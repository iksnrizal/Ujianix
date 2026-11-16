import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Download, Eye, Search } from "lucide-react";
import { EmptyState, PageHeader, formatDateTime } from "@/components/app/PageHeader";
import { ScorePill } from "@/components/app/ScorePill";
import { AttemptStatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, type ResultRow } from "@/lib/api";

export const Route = createFileRoute("/admin/hasil")({
  component: ResultsPage,
});

const ALL = "__all";

function ResultsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["results"], queryFn: () => api.listResults(), refetchInterval: 10_000 });
  const [exam, setExam] = useState(ALL);
  const [search, setSearch] = useState("");

  const examNames = [...new Set((data ?? []).map((r) => r.examName))].sort();
  const s = search.trim().toLowerCase();
  const rows = (data ?? []).filter((r) => (exam === ALL || r.examName === exam) && (!s || r.participantName.toLowerCase().includes(s) || r.identityNumber.includes(s)));
  const done = rows.filter((r) => r.result);
  const avg = done.length ? done.reduce((sum, r) => sum + (r.result?.score ?? 0), 0) / done.length : 0;
  const best = done.length ? Math.max(...done.map((r) => r.result!.score)) : 0;

  return (
    <>
      <PageHeader
        title="Hasil Ujian"
        description="Nilai seluruh peserta, diperbarui otomatis."
        actions={<Button variant="outline" disabled={!rows.length} onClick={() => downloadCsv(rows)}><Download /> Unduh CSV</Button>}
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Summary label="Sudah mengumpulkan" value={`${done.length} / ${rows.length}`} />
        <Summary label="Rata-rata nilai" value={done.length ? avg.toLocaleString("id-ID", { maximumFractionDigits: 1 }) : "-"} />
        <Summary label="Nilai tertinggi" value={done.length ? best.toLocaleString("id-ID") : "-"} />
      </div>
      <div className="rounded-xl border bg-card shadow-card">
        <div className="flex flex-wrap gap-3 border-b p-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari peserta atau NIS…" className="pl-9" />
          </div>
          <Select value={exam} onValueChange={setExam}>
            <SelectTrigger className="w-72"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Semua ujian</SelectItem>
              {examNames.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {isLoading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
        ) : rows.length === 0 ? (
          <div className="p-4"><EmptyState title="Belum ada hasil" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Peserta</TableHead>
                <TableHead>Ujian</TableHead>
                <TableHead className="text-center">Benar</TableHead>
                <TableHead className="text-center">Salah</TableHead>
                <TableHead className="text-center">Kosong</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Waktu Kumpul</TableHead>
                <TableHead className="text-right">Nilai</TableHead>
                <TableHead className="pr-5" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.attemptId}>
                  <TableCell className="pl-5">
                    <div className="font-semibold">{r.participantName}</div>
                    <div className="text-xs text-muted-foreground">{r.identityNumber} · {r.className}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{r.examName}</div>
                    <div className="text-xs text-muted-foreground">{r.subject}</div>
                  </TableCell>
                  <TableCell className="text-center font-semibold tabular-nums text-success">{r.result?.correct ?? "-"}</TableCell>
                  <TableCell className="text-center font-semibold tabular-nums text-destructive">{r.result?.wrong ?? "-"}</TableCell>
                  <TableCell className="text-center tabular-nums text-muted-foreground">{r.result?.unanswered ?? "-"}</TableCell>
                  <TableCell><AttemptStatusBadge status={r.status} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDateTime(r.submittedAt)}</TableCell>
                  <TableCell className="text-right"><ScorePill score={r.result?.score} /></TableCell>
                  <TableCell className="pr-5 text-right">
                    {r.status === "submitted" && (
                      <Button asChild variant="ghost" size="icon" aria-label="Lihat detail">
                        <Link to="/hasil/$attemptId" params={{ attemptId: r.attemptId }}><Eye /></Link>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card px-5 py-4 shadow-card">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-extrabold tabular-nums">{value}</div>
    </div>
  );
}

function downloadCsv(rows: ResultRow[]) {
  const head = ["Nama", "NIS", "Kelas", "Ujian", "Mata Pelajaran", "Benar", "Salah", "Kosong", "Nilai", "Status", "Waktu Kumpul"];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [r.participantName, r.identityNumber, r.className, r.examName, r.subject, r.result?.correct, r.result?.wrong, r.result?.unanswered, r.result?.score, r.status === "submitted" ? "Selesai" : "Sedang Mengerjakan", r.submittedAt ?? ""].map(esc).join(","),
  );
  const blob = new Blob(["\uFEFF" + [head.map(esc).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `hasil-ujian-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}
