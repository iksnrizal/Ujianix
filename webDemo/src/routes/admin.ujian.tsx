import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Clock, Pencil, Play, Plus, RotateCcw, Square, Trash2 } from "lucide-react";
import { ConfirmDelete } from "@/components/app/ConfirmDelete";
import { EmptyState, PageHeader } from "@/components/app/PageHeader";
import { EXAM_STATUS_LABEL, ExamStatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, errorMessage, type Exam, type ExamInput, type ExamStatus, type Question } from "@/lib/api";

export const Route = createFileRoute("/admin/ujian")({
  component: ExamsPage,
});

function ExamsPage() {
  const qc = useQueryClient();
  const exams = useQuery({ queryKey: ["exams"], queryFn: () => api.listExams() });
  const questions = useQuery({ queryKey: ["questions"], queryFn: () => api.listQuestions() });
  const [editing, setEditing] = useState<Exam | "new" | null>(null);
  const [deleting, setDeleting] = useState<Exam | null>(null);
  const [ending, setEnding] = useState<Exam | null>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["exams"] });
    qc.invalidateQueries({ queryKey: ["stats"] });
    qc.invalidateQueries({ queryKey: ["results"] });
  };

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ExamStatus }) => api.setExamStatus(id, status),
    onSuccess: (e) => {
      toast.success(`${e.name}: ${EXAM_STATUS_LABEL[e.status]}`);
      invalidate();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const del = useMutation({
    mutationFn: (id: string) => api.deleteExam(id),
    onSuccess: () => {
      toast.success("Ujian dihapus");
      invalidate();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <>
      <PageHeader
        title="Manajemen Ujian"
        description="Atur ujian, pilih soal, dan buka atau tutup ujian untuk peserta."
        actions={<Button onClick={() => setEditing("new")}><Plus /> Buat Ujian</Button>}
      />
      <div className="rounded-xl border bg-card shadow-card">
        {exams.isLoading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : !exams.data?.length ? (
          <div className="p-4"><EmptyState title="Belum ada ujian" description="Buat ujian dan pilih soal yang digunakan." /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Nama Ujian</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>Soal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aktif</TableHead>
                <TableHead className="pr-5 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.data.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="pl-5">
                    <div className="font-semibold">{e.name}</div>
                    <div className="text-xs text-muted-foreground">{e.subject}</div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-sm"><Clock className="h-3.5 w-3.5 text-muted-foreground" />{e.durationMinutes} menit</span>
                  </TableCell>
                  <TableCell className="tabular-nums">{e.questionIds.length}</TableCell>
                  <TableCell><ExamStatusBadge status={e.status} /></TableCell>
                  <TableCell>
                    <Switch
                      checked={e.status === "berlangsung"}
                      aria-label={e.status === "berlangsung" ? "Nonaktifkan ujian" : "Aktifkan ujian"}
                      disabled={setStatus.isPending}
                      onCheckedChange={(on) => (on ? setStatus.mutate({ id: e.id, status: "berlangsung" }) : setEnding(e))}
                    />
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <div className="flex justify-end gap-1">
                      {e.status === "belum_dimulai" && (
                        <Button size="sm" variant="outline" onClick={() => setStatus.mutate({ id: e.id, status: "berlangsung" })}><Play /> Mulai</Button>
                      )}
                      {e.status === "berlangsung" && (
                        <Button size="sm" variant="outline" onClick={() => setEnding(e)}><Square /> Akhiri</Button>
                      )}
                      {e.status === "selesai" && (
                        <Button size="sm" variant="ghost" onClick={() => setStatus.mutate({ id: e.id, status: "belum_dimulai" })}><RotateCcw /> Atur ulang</Button>
                      )}
                      <Button variant="ghost" size="icon" aria-label={`Edit ${e.name}`} onClick={() => setEditing(e)}><Pencil /></Button>
                      <Button variant="ghost" size="icon" aria-label={`Hapus ${e.name}`} className="text-destructive hover:bg-destructive-soft hover:text-destructive" onClick={() => setDeleting(e)}><Trash2 /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <ExamDialog key={editing === "new" ? "new" : editing?.id ?? "none"} target={editing} questions={questions.data ?? []} onClose={() => setEditing(null)} onSaved={invalidate} />
      <ConfirmDelete
        open={!!ending}
        onOpenChange={(o) => !o && setEnding(null)}
        title="Akhiri ujian sekarang?"
        description="Peserta yang masih mengerjakan akan dikumpulkan otomatis dan nilainya langsung dihitung."
        confirmLabel="Akhiri Ujian"
        onConfirm={() => ending && setStatus.mutate({ id: ending.id, status: "selesai" })}
      />
      <ConfirmDelete
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Hapus ujian?"
        description={`“${deleting?.name ?? ""}” dan seluruh hasil pesertanya akan dihapus permanen.`}
        onConfirm={() => deleting && del.mutate(deleting.id)}
      />
    </>
  );
}

const schema = z.object({
  name: z.string().trim().min(3, "Nama ujian minimal 3 karakter").max(120),
  subject: z.string().trim().min(1, "Mata pelajaran wajib diisi").max(60),
  durationMinutes: z.number().int("Harus bilangan bulat").min(1, "Minimal 1 menit").max(600, "Maksimal 600 menit"),
  questionIds: z.array(z.string()).min(1, "Pilih minimal satu soal"),
  status: z.enum(["belum_dimulai", "berlangsung", "selesai"]),
});

function ExamDialog({ target, questions, onClose, onSaved }: { target: Exam | "new" | null; questions: Question[]; onClose: () => void; onSaved: () => void }) {
  const initial = target && target !== "new" ? target : null;
  const subjects = [...new Set(questions.map((q) => q.subject))].sort();
  const [form, setForm] = useState<ExamInput>({
    name: initial?.name ?? "",
    subject: initial?.subject ?? subjects[0] ?? "",
    durationMinutes: initial?.durationMinutes ?? 30,
    questionIds: initial?.questionIds ?? [],
    status: initial?.status ?? "belum_dimulai",
  });
  const [showAll, setShowAll] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const save = useMutation({
    mutationFn: (input: ExamInput) => (initial ? api.updateExam(initial.id, input) : api.createExam(input)),
    onSuccess: () => {
      toast.success(initial ? "Ujian diperbarui" : "Ujian dibuat");
      onSaved();
      onClose();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const visible = questions.filter((q) => showAll || q.subject === form.subject || form.questionIds.includes(q.id));
  const selectedPoints = questions.filter((q) => form.questionIds.includes(q.id)).reduce((s, q) => s + q.points, 0);
  const toggle = (id: string) =>
    setForm((f) => ({ ...f, questionIds: f.questionIds.includes(id) ? f.questionIds.filter((x) => x !== id) : [...f.questionIds, id] }));

  function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] ??= issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    // Keep the bank's order so numbering is stable.
    const order = new Map(questions.map((q, i) => [q.id, i]));
    save.mutate({ ...parsed.data, questionIds: [...parsed.data.questionIds].sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0)) });
  }

  const err = (k: string) => errors[k] && <p className="text-xs font-medium text-destructive">{errors[k]}</p>;

  return (
    <Dialog open={!!target} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Ujian" : "Buat Ujian Baru"}</DialogTitle>
          <DialogDescription>Tentukan detail ujian lalu pilih soal dari bank soal.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="exam-name">Nama ujian</Label>
            <Input id="exam-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="contoh: Penilaian Akhir Semester" />
            {err("name")}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="exam-subject">Mata pelajaran</Label>
              <Input id="exam-subject" list="exam-subjects" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              <datalist id="exam-subjects">{subjects.map((s) => <option key={s} value={s} />)}</datalist>
              {err("subject")}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="exam-duration">Durasi (menit)</Label>
              <Input id="exam-duration" type="number" min={1} value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} />
              {err("durationMinutes")}
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as ExamStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(EXAM_STATUS_LABEL) as ExamStatus[]).map((s) => <SelectItem key={s} value={s}>{EXAM_STATUS_LABEL[s]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Soal yang digunakan <span className="font-normal text-muted-foreground">· {form.questionIds.length} dipilih, total {selectedPoints} poin</span></Label>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Checkbox checked={showAll} onCheckedChange={(v) => setShowAll(v === true)} /> Tampilkan semua mapel
              </label>
            </div>
            <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border p-2">
              {visible.length === 0 && <p className="p-3 text-center text-sm text-muted-foreground">Tidak ada soal untuk mata pelajaran ini.</p>}
              {visible.map((q) => (
                <label key={q.id} className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 hover:bg-muted">
                  <Checkbox className="mt-0.5" checked={form.questionIds.includes(q.id)} onCheckedChange={() => toggle(q.id)} />
                  <span className="flex-1 text-sm">{q.text}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{showAll ? `${q.subject} · ` : ""}{q.points} poin</span>
                </label>
              ))}
            </div>
            {err("questionIds")}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={save.isPending}>{save.isPending ? "Menyimpan…" : "Simpan Ujian"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
