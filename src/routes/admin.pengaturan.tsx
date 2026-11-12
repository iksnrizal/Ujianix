import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Database, Loader2, RotateCcw, Server, WifiOff, XCircle } from "lucide-react";
import { ConfirmDelete } from "@/components/app/ConfirmDelete";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getConfig, saveConfig, type AppConfig } from "@/config";
import { api, errorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/pengaturan")({
  component: SettingsPage,
});

const urlSchema = z.string().trim().url("Alamat harus berupa URL, contoh http://192.168.1.10:5000");

function SettingsPage() {
  const qc = useQueryClient();
  const [cfg, setCfg] = useState<AppConfig | null>(null);
  const [urlError, setUrlError] = useState<string>();
  const [test, setTest] = useState<"idle" | "loading" | "ok" | "fail">("idle");
  const [testMsg, setTestMsg] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => setCfg(getConfig()), []);
  if (!cfg) return null;

  function save() {
    if (!cfg) return;
    const url = urlSchema.safeParse(cfg.apiBaseUrl);
    if (cfg.mode === "flask" && !url.success) {
      setUrlError(url.error.issues[0].message);
      return;
    }
    setUrlError(undefined);
    saveConfig({ ...cfg, institutionName: cfg.institutionName.trim().slice(0, 100), apiBaseUrl: cfg.apiBaseUrl.trim() });
    qc.invalidateQueries();
    toast.success("Pengaturan disimpan");
  }

  async function testConnection() {
    if (!cfg) return;
    const prev = getConfig();
    saveConfig({ mode: cfg.mode, apiBaseUrl: cfg.apiBaseUrl.trim(), simulateOffline: cfg.simulateOffline });
    setTest("loading");
    try {
      const r = await api.health();
      setTest("ok");
      setTestMsg(r.mode === "mock" ? "Mode simulasi aktif — data tersimpan di browser ini." : "Server Flask merespons dengan baik.");
    } catch (e) {
      setTest("fail");
      setTestMsg(errorMessage(e));
    } finally {
      saveConfig(prev);
    }
  }

  return (
    <>
      <PageHeader title="Pengaturan" description="Konfigurasi server lokal dan identitas penyelenggara." />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-card p-6 shadow-card">
          <h2 className="flex items-center gap-2 font-bold"><Server className="h-4 w-4 text-primary" /> Koneksi Server</h2>
          <p className="mt-1 text-sm text-muted-foreground">Komputer peserta terhubung ke laptop pengawas melalui LAN / Wi-Fi lokal.</p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {([
              ["mock", "Simulasi", "Data demo di browser ini"],
              ["flask", "Server Flask", "Backend lokal + SQLite"],
            ] as const).map(([mode, title, sub]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setCfg({ ...cfg, mode })}
                className={cn("rounded-lg border p-3 text-left transition-colors", cfg.mode === mode ? "border-primary bg-info-soft" : "hover:bg-muted")}
              >
                <div className="text-sm font-semibold">{title}</div>
                <div className="text-xs text-muted-foreground">{sub}</div>
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-1.5">
            <Label htmlFor="api-url">Alamat server</Label>
            <Input id="api-url" value={cfg.apiBaseUrl} onChange={(e) => setCfg({ ...cfg, apiBaseUrl: e.target.value })} placeholder="http://192.168.1.10:5000" className="font-mono" disabled={cfg.mode === "mock"} />
            {urlError ? <p className="text-xs font-medium text-destructive">{urlError}</p> : <p className="text-xs text-muted-foreground">Isi dengan IP laptop pengawas dan port Flask.</p>}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button variant="outline" onClick={testConnection} disabled={test === "loading"}>
              {test === "loading" ? <Loader2 className="animate-spin" /> : <Server />} Tes Koneksi
            </Button>
            {test === "ok" && <span className="flex items-center gap-1.5 text-sm text-success"><CheckCircle2 className="h-4 w-4" />{testMsg}</span>}
            {test === "fail" && <span className="flex items-center gap-1.5 text-sm text-destructive"><XCircle className="h-4 w-4" />{testMsg}</span>}
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-card">
          <h2 className="flex items-center gap-2 font-bold"><Database className="h-4 w-4 text-primary" /> Identitas & Demo</h2>
          <div className="mt-5 space-y-1.5">
            <Label htmlFor="inst">Nama penyelenggara</Label>
            <Input id="inst" value={cfg.institutionName} maxLength={100} onChange={(e) => setCfg({ ...cfg, institutionName: e.target.value })} />
            <p className="text-xs text-muted-foreground">Ditampilkan di halaman login.</p>
          </div>

          <div className="mt-5 flex items-start justify-between gap-4 rounded-lg border p-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold"><WifiOff className="h-4 w-4 text-warning" /> Simulasi koneksi terputus</div>
              <p className="mt-1 text-xs text-muted-foreground">Untuk demo: jawaban peserta ditahan di komputer dan dikirim ulang otomatis saat koneksi kembali. Hanya berlaku di mode simulasi.</p>
            </div>
            <Switch checked={cfg.simulateOffline} onCheckedChange={(v) => setCfg({ ...cfg, simulateOffline: v })} aria-label="Simulasi koneksi terputus" />
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 rounded-lg bg-destructive-soft p-4">
            <div>
              <div className="text-sm font-semibold text-destructive">Reset data demo</div>
              <p className="text-xs text-muted-foreground">Kembalikan peserta, soal, ujian, dan hasil ke data contoh.</p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => setConfirmReset(true)}><RotateCcw /> Reset</Button>
          </div>
        </section>
      </div>

      <div className="mt-6 flex justify-end">
        <Button size="lg" onClick={save}>Simpan Pengaturan</Button>
      </div>

      <ConfirmDelete
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Reset semua data demo?"
        description="Semua perubahan peserta, soal, ujian, dan hasil akan diganti dengan data contoh."
        confirmLabel="Reset Data"
        onConfirm={async () => {
          try {
            await api.resetDemoData();
            qc.invalidateQueries();
            toast.success("Data demo dikembalikan");
          } catch (e) {
            toast.error(errorMessage(e));
          }
        }}
      />
    </>
  );
}
