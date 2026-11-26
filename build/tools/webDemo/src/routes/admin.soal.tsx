import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { ConfirmDelete } from "@/components/app/ConfirmDelete";
import { EmptyState, PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { OPTION_KEYS, api, errorMessage, type OptionKey, type Question, type QuestionInput } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/soal")({
  component: QuestionsPage,
});

const ALL = "__all";

function QuestionsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["questions"], queryFn: () => api.listQuestions() });
  const [subject, setSubject] = useState(ALL);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Question | "new" | null>(null);
  const [deleting, setDeleting] = useState<Question | null>(null);

  const subjects = [...new Set((data ?? []).map((q) => q.subject))].sort();
  const s = search.trim().toLowerCase();
  const rows = (data ?? []).filter((q) => (subject === ALL || q.subject === subject) && (!s || q.text.toLowerCase().includes(s)));

  const del = useMutation({
    mutationFn: (id: string) => api.deleteQuestion(id),
    onSuccess: () => {
      toast.success("Soal dihapus");
      qc.invalidateQueries({ queryKey: ["questions"] });
      qc.invalidateQueries({ queryKey: ["exams"] });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <>
      <PageHeader
        title="Manajemen Soal"
        description={`${data?.length ?? 0} soal pilihan ganda di bank soal`}
        actions={<Button onClick={() => setEditing("new")}><Plus /> Buat Soal</Button>}
      />
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari teks soal…" className="bg-card pl-9" />
        </div>
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger className="w-56 bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Semua mata pelajaran</SelectItem>
            {subjects.map((sub) => <SelectItem key={sub} value={sub}>{sub}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36" />)}</div>
      ) : rows.length === 0 ? (
        <EmptyState title="Belum ada soal" description="Buat soal pilihan ganda untuk digunakan dalam ujian." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {rows.map((q, i) => (
            <article key={q.id} className="flex flex-col rounded-xl border bg-card p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>
                  <Badge variant="info">{q.subject}</Badge>
                  <Badge variant="muted">{q.points} poin</Badge>
                </div>
                <div className="-mr-2 -mt-2 flex">
                  <Button variant="ghost" size="icon" aria-label="Edit soal" onClick={() => setEditing(q)}><Pencil /></Button>
                  <Button variant="ghost" size="icon" aria-label="Hapus soal" className="text-destructive hover:bg-destructive-soft hover:text-destructive" onClick={() => setDeleting(q)}><Trash2 /></Button>
                </div>
              </div>
              <p className="mt-3 font-semibold leading-relaxed">{q.text}</p>
              <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
                {OPTION_KEYS.map((k) => (
                  <li key={k} className={cn("flex items-center gap-2 rounded-md px-2 py-1.5", k === q.correct ? "bg-success-soft font-semibold text-success" : "text-muted-foreground")}>
                    <span className="font-mono text-xs font-bold">{k}.</span>
                    <span className="flex-1">{q.options[k]}</span>
                    {k === q.correct && <CheckCircle2 className="h-4 w-4" />}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}

      <QuestionDialog key={editing === "new" ? "new" : editing?.id ?? "none"} target={editing} subjects={subjects} onClose={() => setEditing(null)} />
      <ConfirmDelete
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Hapus soal?"
        description="Soal ini juga akan dikeluarkan dari setiap ujian yang memakainya."
        onConfirm={() => deleting && del.mutate(deleting.id)}
      />
    </>
  );
}

const schema = z.object({
  subject: z.string().trim().min(1, "Mata pelajaran wajib diisi").max(60),
  text: z.string().trim().min(5, "Pertanyaan minimal 5 karakter").max(2000),
  options: z.object({
    A: z.string().trim().min(1, "Wajib diisi").max(300),
    B: z.string().trim().min(1, "Wajib diisi").max(300),
    C: z.string().trim().min(1, "Wajib diisi").max(300),
    D: z.string().trim().min(1, "Wajib diisi").max(300),
  }),
  correct: z.enum(["A", "B", "C", "D"]),
  points: z.number().int("Harus bilangan bulat").min(1, "Minimal 1").max(100, "Maksimal 100"),
});

function QuestionDialog({ target, subjects, onClose }: { target: Question | "new" | null; subjects: string[]; onClose: () => void }) {
  const qc = useQueryClient();
  const initial = target && target !== "new" ? target : null;
  const [form, setForm] = useState<QuestionInput>({
    subject: initial?.subject ?? subjects[0] ?? "",
    text: initial?.text ?? "",
    options: initial?.options ?? { A: "", B: "", C: "", D: "" },
    correct: initial?.correct ?? "A",
    points: initial?.points ?? 10,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const save = useMutation({
    mutationFn: (input: QuestionInput) => (initial ? api.updateQuestion(initial.id, input) : api.createQuestion(input)),
    onSuccess: () => {
      toast.success(initial ? "Soal diperbarui" : "Soal ditambahkan");
      qc.invalidateQueries({ queryKey: ["questions"] });
      onClose();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[issue.path.join(".")] ??= issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    save.mutate(parsed.data);
  }

  const err = (k: string) => errors[k] && <p className="text-xs font-medium text-destructive">{errors[k]}</p>;

  return (
    <Dialog open={!!target} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Soal" : "Buat Soal Pilihan Ganda"}</DialogTitle>
          <DialogDescription>Pilih lingkaran di samping opsi untuk menandai jawaban benar.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="grid grid-cols-[1fr_8rem] gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="subject">Mata pelajaran</Label>
              <Input id="subject" list="subject-list" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              <datalist id="subject-list">{subjects.map((s) => <option key={s} value={s} />)}</datalist>
              {err("subject")}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="points">Nilai soal</Label>
              <Input id="points" type="number" min={1} max={100} value={form.points} onChange={(e) => setForm({ ...form, points: Number(e.target.value) })} />
              {err("points")}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="text">Pertanyaan</Label>
            <Textarea id="text" rows={3} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Tulis pertanyaan…" />
            {err("text")}
          </div>
          <fieldset className="space-y-2">
            <legend className="mb-1.5 text-sm font-medium">Pilihan jawaban</legend>
            {OPTION_KEYS.map((k) => (
              <div key={k}>
                <div className={cn("flex items-center gap-2 rounded-lg border p-1.5 pl-2 transition-colors", form.correct === k && "border-success bg-success-soft")}>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, correct: k as OptionKey })}
                    aria-label={`Tandai ${k} sebagai jawaban benar`}
                    aria-pressed={form.correct === k}
                    className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm font-bold", form.correct === k ? "border-success bg-success text-success-foreground" : "border-input text-muted-foreground hover:border-success")}
                  >
                    {k}
                  </button>
                  <Input
                    value={form.options[k]}
                    onChange={(e) => setForm({ ...form, options: { ...form.options, [k]: e.target.value } })}
                    placeholder={`Opsi ${k}`}
                    className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                    aria-label={`Opsi ${k}`}
                  />
                </div>
                {err(`options.${k}`)}
              </div>
            ))}
          </fieldset>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={save.isPending}>{save.isPending ? "Menyimpan…" : "Simpan Soal"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
