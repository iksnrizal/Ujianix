import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BookOpen, CheckCircle2, Clock, FileText, Lock, Play, RotateCw } from "lucide-react";
import { EmptyState } from "@/components/app/PageHeader";
import { ExamStatusBadge, ParticipantStateBadge } from "@/components/app/StatusBadge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { api, type ParticipantExamView } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/peserta/")({
  component: ParticipantDashboard,
});

function ParticipantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading, refetch, isFetching } = useQuery({ queryKey: ["my-exams"], queryFn: () => api.listMyExams(), refetchInterval: 15_000 });
  const [confirm, setConfirm] = useState<ParticipantExamView | null>(null);


  return (
    <>
      <section className="mb-8 overflow-hidden rounded-2xl bg-brand-gradient p-8 text-primary-foreground shadow-elevated">
        <p className="text-sm font-medium opacity-80">Selamat datang,</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{user?.name}</h1>
        <p className="mt-2 max-w-xl text-sm opacity-85">
          Pilih ujian yang sedang berlangsung lalu tekan <strong>Mulai Ujian</strong>. Jawaban Anda tersimpan otomatis ke server.
        </p>
      </section>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Daftar Ujian</h2>
        <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RotateCw className={isFetching ? "animate-spin" : ""} /> Muat ulang
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}</div>
      ) : !data?.length ? (
        <EmptyState title="Belum ada ujian" description="Tunggu pengawas membuka ujian." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((v) => (
            <article key={v.exam.id} className="flex flex-col rounded-xl border bg-card p-6 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                  <BookOpen className="h-3.5 w-3.5" /> {v.exam.subject}
                </span>
                <ExamStatusBadge status={v.exam.status} />
              </div>
              <h3 className="mt-3 text-lg font-bold leading-snug">{v.exam.name}</h3>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {v.exam.durationMinutes} menit</span>
                <span className="inline-flex items-center gap-1.5"><FileText className="h-4 w-4" /> {v.questionCount} soal</span>
                <ParticipantStateBadge state={v.state} />
              </div>
              <div className="mt-6 flex-1" />
              <ExamAction view={v} onStart={() => setConfirm(v)} />
            </article>
          ))}
        </div>
      )}

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mulai “{confirm?.exam.name}”?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>Waktu {confirm?.exam.durationMinutes} menit langsung berjalan setelah Anda menekan Mulai dan tidak dapat dihentikan.</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>{confirm?.questionCount} soal pilihan ganda (A–D).</li>
                  <li>Jawaban tersimpan otomatis setiap kali Anda memilih.</li>
                  <li>Ujian terkumpul otomatis saat waktu habis.</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirm && navigate({ to: "/ujian/$examId", params: { examId: confirm.exam.id } })}>
              <Play className="h-4 w-4" /> Mulai Sekarang
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ExamAction({ view, onStart }: { view: ParticipantExamView; onStart: () => void }) {
  if (view.state === "selesai" && view.attemptId)
    return (
      <Button asChild variant="outline" size="lg">
        <Link to="/hasil/$attemptId" params={{ attemptId: view.attemptId }}><CheckCircle2 /> Lihat Hasil</Link>
      </Button>
    );
  if (view.state === "sedang_dikerjakan")
    return (
      <Button asChild size="lg">
        <Link to="/ujian/$examId" params={{ examId: view.exam.id }}><Play /> Lanjutkan Ujian</Link>
      </Button>
    );
  if (view.exam.status === "berlangsung")
    return <Button size="lg" onClick={onStart}><Play /> Mulai Ujian</Button>;
  return (
    <Button size="lg" variant="secondary" disabled>
      <Lock /> {view.exam.status === "belum_dimulai" ? "Belum Dibuka" : "Ujian Ditutup"}
    </Button>
  );
}
