import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ChevronLeft, ChevronRight, Clock, CloudOff, CloudUpload, Loader2, Send, ShieldCheck, Eraser } from "lucide-react";
import { Logo } from "@/components/app/Logo";
import { FullPageLoader } from "@/components/app/PageHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AnswerSync, type SyncState } from "@/lib/answer-sync";
import { NetworkError, OPTION_KEYS, api, errorMessage, type Answers, type ExamSession, type OptionKey } from "@/lib/api";
import { useAuth, useRequireRole } from "@/lib/auth";
import { formatClock, remainingMs } from "@/lib/scoring";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ujian/")({
  head: () => ({
    meta: [
      { title: "Pengerjaan Ujian — Ujianix" },
      { name: "description", content: "Halaman pengerjaan ujian berbasis komputer Ujianix." },
      { property: "og:title", content: "Pengerjaan Ujian — Ujianix" },
      { property: "og:description", content: "Halaman pengerjaan ujian berbasis komputer Ujianix." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ExamPage,
});

function ExamPage() {
  const { examId } = Route.useParams();
  const user = useRequireRole("peserta");
  const session = useQuery({
    queryKey: ["session", examId],
    queryFn: () => api.startExam(examId),
    enabled: !!user,
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
    retry: (count, err) => err instanceof NetworkError && count < 200,
    retryDelay: 3000,
  });

  if (!user || session.isPending) {
    return <FullPageLoader label={session.failureCount > 0 ? "Menghubungkan ulang ke server…" : "Menyiapkan ujian…"} />;
  }
  if (session.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-glow px-4">
        <div className="max-w-md rounded-2xl border bg-card p-8 text-center shadow-elevated">
          <AlertTriangle className="mx-auto h-10 w-10 text-warning" />
          <h1 className="mt-4 text-xl font-bold">Ujian tidak dapat dibuka</h1>
          <p className="mt-2 text-sm text-muted-foreground">{errorMessage(session.error)}</p>
          <Button asChild className="mt-6"><Link to="/peserta">Kembali ke daftar ujian</Link></Button>
        </div>
      </div>
    );
  }
  return <ExamRunner session={session.data} />;
}

function ExamRunner({ session }: { session: ExamSession }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { attempt, exam, questions } = session;

  const [answers, setAnswers] = useState<Answers>(attempt.answers);
  const [index, setIndex] = useState(0);
  const [sync, setSync] = useState<{ state: SyncState; pending: number }>({ state: "saved", pending: 0 });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState<null | "manual" | "auto">(null);
  const [submitWaiting, setSubmitWaiting] = useState(false);
  const clockOffset = useMemo(() => new Date(session.serverTime).getTime() - Date.now(), [session.serverTime]);
  const [now, setNow] = useState(() => Date.now() + clockOffset);
  const syncRef = useRef<AnswerSync | null>(null);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const submittingRef = useRef(false);

  const submit = useCallback(
    async (mode: "manual" | "auto") => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      setSubmitting(mode);
      // Retry until the server confirms: the full answer sheet is sent each time.
      for (;;) {
        try {
          await api.submitAttempt(attempt.id, answersRef.current);
          break;
        } catch (err) {
          if (err instanceof NetworkError) {
            setSubmitWaiting(true);
            await new Promise((r) => setTimeout(r, 3000));
            continue;
          }
          console.error(err);
          break;
        }
      }
      syncRef.current?.clear();
      qc.invalidateQueries({ queryKey: ["my-exams"] });
      navigate({ to: "/hasil/$attemptId", params: { attemptId: attempt.id }, replace: true });
    },
    [attempt.id, navigate, qc],
  );

  // Answer sync engine
  useEffect(() => {
    const s = new AnswerSync(attempt.id, (state, pending) => setSync({ state, pending }), () => void submit("auto"));
    syncRef.current = s;
    const buffered = s.buffered;
    if (Object.keys(buffered).length) {
      setAnswers((prev) => {
        const next = { ...prev };
        for (const [k, v] of Object.entries(buffered)) {
          if (v) next[k] = v;
          else delete next[k];
        }
        return next;
      });
      void s.flush();
    }
    return () => s.dispose();
  }, [attempt.id, submit]);

  // Countdown
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now() + clockOffset), 1000);
    return () => clearInterval(t);
  }, [clockOffset]);

  const left = remainingMs(attempt.deadline, now);
  useEffect(() => {
    if (left <= 0) void submit("auto");
  }, [left, submit]);

  const q = questions[index];
  const answeredCount = questions.filter((x) => answers[x.id]).length;
  const unanswered = questions.length - answeredCount;

  const choose = useCallback(
    (key: OptionKey | null) => {
      if (!q || submittingRef.current) return;
      setAnswers((prev) => {
        const next = { ...prev };
        if (key) next[q.id] = key;
        else delete next[q.id];
        return next;
      });
      syncRef.current?.set(q.id, key);
    },
    [q],
  );

  // Keyboard: A–D to answer, ←/→ to move
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (confirmOpen || e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.toUpperCase();
      if ((OPTION_KEYS as string[]).includes(k)) choose(k as OptionKey);
      else if (e.key === "ArrowRight") setIndex((i) => Math.min(questions.length - 1, i + 1));
      else if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choose, confirmOpen, questions.length]);

  const timerTone = left < 60_000 ? "bg-destructive-soft text-destructive" : left < 5 * 60_000 ? "bg-warning-soft text-warning-foreground" : "bg-secondary text-brand-navy";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 border-b bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6">
          <Logo size="sm" showText={false} />
          <div className="min-w-0 flex-1">
            <div className="truncate font-bold">{exam.name}</div>
            <div className="truncate text-xs text-muted-foreground">{exam.subject} · {user?.name}</div>
          </div>
          <SyncIndicator state={sync.state} pending={sync.pending} />
          <div className={cn("flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xl font-bold tabular-nums", timerTone)} role="timer" aria-label="Sisa waktu">
            <Clock className="h-5 w-5" />
            {formatClock(left)}
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-6 px-6 py-6 lg:grid-cols-[1fr_20rem]">
        <main className="flex flex-col">
          {q && (
            <div className="flex flex-1 flex-col rounded-2xl border bg-card p-8 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">Soal {index + 1} dari {questions.length}</span>
                <span className="text-xs text-muted-foreground">{q.points} poin</span>
              </div>
              <p className="mt-4 text-xl font-semibold leading-relaxed">{q.text}</p>

              <div className="mt-8 grid gap-3" role="radiogroup" aria-label="Pilihan jawaban">
                {OPTION_KEYS.map((k) => {
                  const selected = answers[q.id] === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => choose(k)}
                      className={cn(
                        "flex items-center gap-4 rounded-xl border-2 p-4 text-left text-base transition-all",
                        selected ? "border-primary bg-info-soft shadow-card" : "border-border hover:border-primary/40 hover:bg-muted",
                      )}
                    >
                      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-mono font-bold", selected ? "border-primary bg-primary text-primary-foreground" : "border-input text-muted-foreground")}>
                        {k}
                      </span>
                      <span className={cn("flex-1", selected && "font-semibold")}>{q.options[k]}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex-1" />
              <div className="mt-8 flex items-center justify-between gap-3 border-t pt-6">
                <Button variant="outline" size="lg" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
                  <ChevronLeft /> Sebelumnya
                </Button>
                <Button variant="ghost" size="sm" onClick={() => choose(null)} disabled={!answers[q.id]} className="text-muted-foreground">
                  <Eraser /> Hapus jawaban
                </Button>
                {index < questions.length - 1 ? (
                  <Button size="lg" onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}>
                    Berikutnya <ChevronRight />
                  </Button>
                ) : (
                  <Button size="lg" onClick={() => setConfirmOpen(true)}>
                    <Send /> Kumpulkan
                  </Button>
                )}
              </div>
            </div>
          )}
          <p className="mt-3 text-center text-xs text-muted-foreground">Tips: tekan tombol A–D untuk menjawab, ← → untuk berpindah soal.</p>
        </main>

        <aside className="space-y-4">
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex items-baseline justify-between">
              <h2 className="font-bold">Nomor Soal</h2>
              <span className="text-sm text-muted-foreground"><strong className="text-foreground">{answeredCount}</strong>/{questions.length} dijawab</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(answeredCount / Math.max(1, questions.length)) * 100}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {questions.map((x, i) => {
                const done = !!answers[x.id];
                return (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Soal ${i + 1}${done ? ", sudah dijawab" : ", belum dijawab"}`}
                    aria-current={i === index}
                    className={cn(
                      "relative flex aspect-square items-center justify-center rounded-lg border-2 text-sm font-bold tabular-nums transition-colors",
                      done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/40",
                      i === index && "ring-2 ring-brand-cyan ring-offset-2",
                    )}
                  >
                    {i + 1}
                    {done && <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-card bg-brand-cyan" />}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border-2 border-primary bg-primary" /> Sudah dijawab</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border-2 border-border bg-background" /> Belum dijawab</span>
            </div>
          </div>

          <Button size="lg" className="h-12 w-full text-base" onClick={() => setConfirmOpen(true)}>
            <Send /> Kumpulkan Ujian
          </Button>
          <p className="flex items-start gap-2 px-1 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Jawaban tersimpan di server setiap kali Anda memilih. Jika koneksi terputus, jawaban dikirim ulang otomatis.
          </p>
        </aside>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kumpulkan ujian sekarang?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>Setelah dikumpulkan, jawaban tidak dapat diubah lagi.</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-info-soft p-3 text-center">
                    <div className="text-2xl font-extrabold text-primary">{answeredCount}</div>
                    <div className="text-xs">Sudah dijawab</div>
                  </div>
                  <div className={cn("rounded-lg p-3 text-center", unanswered ? "bg-warning-soft" : "bg-muted")}>
                    <div className={cn("text-2xl font-extrabold", unanswered ? "text-warning-foreground" : "text-muted-foreground")}>{unanswered}</div>
                    <div className="text-xs">Belum dijawab</div>
                  </div>
                </div>
                {unanswered > 0 && <p className="text-sm font-medium text-warning-foreground">Masih ada {unanswered} soal yang belum dijawab.</p>}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Periksa lagi</AlertDialogCancel>
            <AlertDialogAction onClick={() => void submit("manual")}>Ya, Kumpulkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-lg font-bold">{submitting === "auto" ? "Waktu habis — mengumpulkan jawaban…" : "Mengumpulkan jawaban…"}</p>
            {submitWaiting && <p className="mt-1 text-sm text-muted-foreground">Menunggu koneksi ke server. Jangan tutup halaman ini.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function SyncIndicator({ state, pending }: { state: SyncState; pending: number }) {
  if (state === "offline")
    return (
      <span className="hidden items-center gap-1.5 rounded-full bg-warning-soft px-3 py-1 text-xs font-semibold text-warning-foreground sm:flex">
        <CloudOff className="h-3.5 w-3.5" /> Koneksi terputus · {pending} jawaban menunggu
      </span>
    );
  if (state === "saving")
    return (
      <span className="hidden items-center gap-1.5 text-xs font-medium text-muted-foreground sm:flex">
        <CloudUpload className="h-3.5 w-3.5 animate-pulse" /> Menyimpan…
      </span>
    );
  return (
    <span className="hidden items-center gap-1.5 text-xs font-medium text-success sm:flex">
      <ShieldCheck className="h-3.5 w-3.5" /> Tersimpan
    </span>
  );
}
