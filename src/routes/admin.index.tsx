import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ClipboardList, PlayCircle, UserCheck, Users } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState, PageHeader, formatDateTime } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data, isLoading } = useQuery({ queryKey: ["stats"], queryFn: () => api.getDashboardStats(), refetchInterval: 10_000 });

  return (
    <>
      <PageHeader title="Dashboard" description="Ringkasan kegiatan ujian di server ini." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<Users />} label="Total Peserta" value={data?.totalParticipants} tone="navy" />
        <StatCard icon={<ClipboardList />} label="Total Ujian" value={data?.totalExams} tone="blue" />
        <StatCard icon={<PlayCircle />} label="Ujian Aktif" value={data?.activeExams} tone="cyan" />
        <StatCard icon={<UserCheck />} label="Sedang Mengerjakan" value={data?.inProgress} tone="success" live />
      </div>

      <section className="mt-8 rounded-xl border bg-card shadow-card">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-bold">Hasil Ujian Terbaru</h2>
            <p className="text-xs text-muted-foreground">Enam pengumpulan terakhir</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/hasil">
              Lihat semua <ArrowRight />
            </Link>
          </Button>
        </div>
        {isLoading ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !data?.recentResults.length ? (
          <div className="p-5">
            <EmptyState title="Belum ada hasil" description="Hasil akan muncul setelah peserta mengumpulkan ujian." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Peserta</TableHead>
                <TableHead>Ujian</TableHead>
                <TableHead>Waktu Kumpul</TableHead>
                <TableHead className="pr-5 text-right">Nilai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentResults.map((r) => (
                <TableRow key={r.attemptId}>
                  <TableCell className="pl-5">
                    <div className="font-semibold">{r.participantName}</div>
                    <div className="text-xs text-muted-foreground">{r.className}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{r.examName}</div>
                    <div className="text-xs text-muted-foreground">{r.subject}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDateTime(r.submittedAt)}</TableCell>
                  <TableCell className="pr-5 text-right">
                    <ScorePill score={r.result?.score} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </>
  );
}

const tones = {
  navy: "bg-secondary text-brand-navy",
  blue: "bg-info-soft text-primary",
  cyan: "bg-accent text-accent-foreground",
  success: "bg-success-soft text-success",
};

function StatCard({ icon, label, value, tone, live }: { icon: ReactNode; label: string; value?: number; tone: keyof typeof tones; live?: boolean }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-lg [&_svg]:h-5 [&_svg]:w-5", tones[tone])}>{icon}</span>
        {live && (
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-success">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Live
          </span>
        )}
      </div>
      <div className="mt-4 text-3xl font-extrabold tabular-nums">{value ?? <Skeleton className="h-9 w-12" />}</div>
      <div className="mt-0.5 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function ScorePill({ score }: { score?: number }) {
  if (score === undefined) return <span className="text-muted-foreground">-</span>;
  const tone = score >= 75 ? "bg-success-soft text-success" : score >= 60 ? "bg-warning-soft text-warning-foreground" : "bg-destructive-soft text-destructive";
  return <span className={cn("inline-flex min-w-14 justify-center rounded-md px-2 py-1 text-sm font-bold tabular-nums", tone)}>{score.toLocaleString("id-ID")}</span>;
}
