import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ArrowLeft, CheckCircle2, CircleSlash, FileText, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/app/Logo";
import { FullPageLoader, formatDateTime } from "@/components/app/PageHeader";
import { AttemptStatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hasil/$attemptId")({
  head: () => ({
    meta: [
      { title: "Hasil Ujian — Ujianix" },
      { name: "description", content: "Ringkasan nilai dan jawaban peserta ujian Ujianix." },
      { property: "og:title", content: "Hasil Ujian — Ujianix" },
      { property: "og:description", content: "Ringkasan nilai dan jawaban peserta ujian Ujianix." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const { attemptId } = Route.useParams();
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (ready && !user) navigate({ to: "/", replace: true });
  }, [ready, user, navigate]);

  const { data, error, isPending } = useQuery({ queryKey: ["result", attemptId], queryFn: () => api.getResult(attemptId), enabled: !!user });

  if (!user || isPending) return <FullPageLoader label="Memuat hasil…" />;
  const back = user.role === "admin" ? ({ to: "/admin/hasil", label: "Kembali ke Hasil Ujian" } as const) : ({ to: "/peserta", label: "Kembali ke Dashboard" } as const);

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="font-semibold">{errorMessage(error)}</p>
          <Button asChild className="mt-4"><Link to={back.to}>{back.label}</Link></Button>
        </div>
      </div>
    );
  }

  const r = data.result;
  const score = r?.score ?? 0;
  const tone = score >= 75 ? "text-success" : score >= 60 ? "text-warning" : "text-destructive";

  return (
    <div className="min-h-screen bg-brand-glow">
      <header className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
        <Logo size="sm" />
        <Button asChild variant="ghost" size="sm"><Link to={back.to}><ArrowLeft /> {back.label}</Link></Button>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-16 pt-6">
        <div className="overflow-hidden rounded-2xl border bg-card shadow-elevated">
          <div className="bg-brand-gradient px-8 py-6 text-primary-foreground">
            <p className="text-sm opacity-80">Hasil Ujian</p>
            <h1 className="mt-1 text-2xl font-extrabold">{data.examName}</h1>
            <p className="mt-1 text-sm opacity-85">{data.subject}</p>
          </div>

          <div className="grid gap-8 p-8 md:grid-cols-[auto_1fr] md:items-center">
            <ScoreRing score={score} toneClass={tone} />
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <Field label="Nama peserta" value={data.participantName} />
              <Field label="NIS / Kelas" value={`${data.identityNumber} · ${data.className}`} />
              <Field label="Mulai" value={formatDateTime(data.startedAt)} />
              <Field label="Dikumpulkan" value={formatDateTime(data.submittedAt)} />
              <div className="col-span-2">
                <dt className="text-muted-foreground">Status penyelesaian</dt>
                <dd className="mt-1"><AttemptStatusBadge status={data.status} /></dd>
              </div>
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-px border-t bg-border sm:grid-cols-4">
            <Metric icon={<FileText />} label="Jumlah soal" value={r?.totalQuestions ?? 0} tone="text-brand-navy" />
            <Metric icon={<CheckCircle2 />} label="Jawaban benar" value={r?.correct ?? 0} tone="text-success" />
            <Metric icon={<XCircle />} label="Jawaban salah" value={r?.wrong ?? 0} tone="text-destructive" />
            <Metric icon={<CircleSlash />} label="Tidak dijawab" value={r?.unanswered ?? 0} tone="text-muted-foreground" />
          </div>
        </div>
        {r && <p className="mt-4 text-center text-xs text-muted-foreground">Nilai dihitung dari {r.earnedPoints} dari {r.totalPoints} poin.</p>}
      </main>
    </div>
  );
}

function ScoreRing({ score, toneClass }: { score: number; toneClass: string }) {
  const c = 2 * Math.PI * 52;
  return (
    <div className="relative mx-auto h-40 w-40">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r="52" className="fill-none stroke-muted" strokeWidth="10" />
        <circle cx="60" cy="60" r="52" className={cn("fill-none stroke-current transition-all", toneClass)} strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-4xl font-extrabold tabular-nums", toneClass)}>{score.toLocaleString("id-ID")}</span>
        <span className="text-xs font-medium text-muted-foreground">Nilai akhir</span>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-semibold">{value}</dd>
    </div>
  );
}

function Metric({ icon, label, value, tone }: { icon: ReactNode; label: string; value: number; tone: string }) {
  return (
    <div className="bg-card px-6 py-5">
      <div className={cn("flex items-center gap-2 [&_svg]:h-4 [&_svg]:w-4", tone)}>{icon}<span className="text-2xl font-extrabold tabular-nums">{value}</span></div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
