import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { ConfirmDelete } from "@/components/app/ConfirmDelete";
import { EmptyState, PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, errorMessage, type Participant, type ParticipantInput } from "@/lib/api";

export const Route = createFileRoute("/admin/peserta")({
  component: ParticipantsPage,
});

function ParticipantsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["participants"], queryFn: () => api.listParticipants() });
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Participant | "new" | null>(null);
  const [deleting, setDeleting] = useState<Participant | null>(null);

  const del = useMutation({
    mutationFn: (id: string) => api.deleteParticipant(id),
    onSuccess: () => {
      toast.success("Peserta dihapus");
      qc.invalidateQueries({ queryKey: ["participants"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const q = search.trim().toLowerCase();
  const rows = (data ?? []).filter((p) => !q || [p.name, p.username, p.identityNumber, p.className].some((v) => v.toLowerCase().includes(q)));

  return (
    <>
      <PageHeader
        title="Manajemen Peserta"
        description={`${data?.length ?? 0} peserta terdaftar`}
        actions={
          <Button onClick={() => setEditing("new")}>
            <Plus /> Tambah Peserta
          </Button>
        }
      />
      <div className="rounded-xl border bg-card shadow-card">
        <div className="border-b p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, username, NIS, kelas…" className="pl-9" />
          </div>
        </div>
        {isLoading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
        ) : rows.length === 0 ? (
          <div className="p-4"><EmptyState title="Tidak ada peserta" description={q ? "Coba kata kunci lain." : "Tambahkan peserta pertama Anda."} /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Nama Peserta</TableHead>
                <TableHead>NIS / No. Identitas</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="pr-5 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="pl-5 font-semibold">{p.name}</TableCell>
                  <TableCell className="font-mono text-sm">{p.identityNumber}</TableCell>
                  <TableCell>{p.className}</TableCell>
                  <TableCell className="font-mono text-sm text-primary">{p.username}</TableCell>
                  <TableCell className="pr-5 text-right">
                    <Button variant="ghost" size="icon" aria-label={`Edit ${p.name}`} onClick={() => setEditing(p)}><Pencil /></Button>
                    <Button variant="ghost" size="icon" aria-label={`Hapus ${p.name}`} className="text-destructive hover:bg-destructive-soft hover:text-destructive" onClick={() => setDeleting(p)}><Trash2 /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <ParticipantDialog key={editing === "new" ? "new" : editing?.id ?? "none"} target={editing} onClose={() => setEditing(null)} />
      <ConfirmDelete
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Hapus peserta?"
        description={`${deleting?.name ?? ""} beserta riwayat ujiannya akan dihapus permanen.`}
        onConfirm={() => deleting && del.mutate(deleting.id)}
      />
    </>
  );
}

const schema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
  identityNumber: z.string().trim().min(1, "Nomor identitas wajib diisi").max(30),
  className: z.string().trim().min(1, "Kelas wajib diisi").max(30),
  username: z.string().trim().min(3, "Username minimal 3 karakter").max(30).regex(/^[a-zA-Z0-9._-]+$/, "Hanya huruf, angka, titik, - dan _"),
  password: z.string().max(100).optional(),
});

function ParticipantDialog({ target, onClose }: { target: Participant | "new" | null; onClose: () => void }) {
  const qc = useQueryClient();
  const isNew = target === "new";
  const initial = target && target !== "new" ? target : null;
  const [form, setForm] = useState<ParticipantInput>({
    name: initial?.name ?? "",
    identityNumber: initial?.identityNumber ?? "",
    className: initial?.className ?? "",
    username: initial?.username ?? "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const save = useMutation({
    mutationFn: (input: ParticipantInput) => (initial ? api.updateParticipant(initial.id, input) : api.createParticipant(input)),
    onSuccess: () => {
      toast.success(isNew ? "Peserta ditambahkan" : "Data peserta diperbarui");
      qc.invalidateQueries({ queryKey: ["participants"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
      onClose();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    const errs: Record<string, string> = {};
    if (!parsed.success) for (const [k, v] of Object.entries(parsed.error.flatten().fieldErrors)) if (v?.[0]) errs[k] = v[0];
    if (isNew && (form.password ?? "").length < 6) errs.password = "Password minimal 6 karakter";
    if (!isNew && form.password && form.password.length < 6) errs.password = "Password minimal 6 karakter";
    setErrors(errs);
    if (Object.keys(errs).length || !parsed.success) return;
    save.mutate({ ...parsed.data, password: form.password || undefined });
  }

  const field = (key: keyof ParticipantInput, label: string, props: React.ComponentProps<typeof Input> = {}) => (
    <div className="space-y-1.5">
      <Label htmlFor={key}>{label}</Label>
      <Input id={key} value={form[key] ?? ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} aria-invalid={!!errors[key]} {...props} />
      {errors[key] && <p className="text-xs font-medium text-destructive">{errors[key]}</p>}
    </div>
  );

  return (
    <Dialog open={!!target} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? "Tambah Peserta" : "Edit Peserta"}</DialogTitle>
          <DialogDescription>Akun ini dipakai peserta untuk login di komputer ujian.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4" noValidate>
          {field("name", "Nama lengkap", { placeholder: "Nama peserta" })}
          <div className="grid grid-cols-2 gap-3">
            {field("identityNumber", "NIS / No. Identitas", { placeholder: "2024009" })}
            {field("className", "Kelas", { placeholder: "XII IPA 1" })}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field("username", "Username", { placeholder: "siswa09", autoComplete: "off" })}
            {field("password", isNew ? "Password" : "Password baru", { type: "text", placeholder: isNew ? "min. 6 karakter" : "kosongkan jika tetap", autoComplete: "off" })}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={save.isPending}>{save.isPending ? "Menyimpan…" : "Simpan"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
