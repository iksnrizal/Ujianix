import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { Eye, EyeOff, Loader2, LogIn, Server, ShieldCheck, UserRound } from "lucide-react";
import { Logo } from "@/components/app/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getConfig } from "@/config";
import { errorMessage } from "@/lib/api";
import { DEMO_ACCOUNTS } from "@/lib/api/seed";
import { homeFor, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Masuk — Ujianix" },
      { name: "description", content: "Masuk ke Ujianix untuk mengerjakan atau mengelola ujian berbasis komputer." },
      { property: "og:title", content: "Masuk — Ujianix" },
      { property: "og:description", content: "Masuk ke Ujianix untuk mengerjakan atau mengelola ujian berbasis komputer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username wajib diisi").max(50, "Username terlalu panjang"),
  password: z.string().min(1, "Password wajib diisi").max(100, "Password terlalu panjang"),
});

type Errors = Partial<Record<"username" | "password" | "form", string | undefined>>;

function LoginPage() {
  const { user, ready, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ institution: "", server: "" });

  useEffect(() => {
    const c = getConfig();
    setMeta({ institution: c.institutionName, server: c.mode === "flask" ? c.apiBaseUrl : "Mode simulasi" });
  }, []);

  useEffect(() => {
    if (ready && user) navigate({ to: homeFor(user.role), replace: true });
  }, [ready, user, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ username, password });
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setErrors({ username: fe.username?.[0], password: fe.password?.[0] });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const u = await login(parsed.data.username, parsed.data.password);
      navigate({ to: homeFor(u.role), replace: true });
    } catch (err) {
      setErrors({ form: errorMessage(err) });
    } finally {
      setLoading(false);
    }
  }

  const fill = (acc: { username: string; password: string }) => {
    setUsername(acc.username);
    setPassword(acc.password);
    setErrors({});
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-glow px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size="lg" showText={false} />
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-brand-navy">Ujianix</h1>
          <p className="mt-1 text-sm text-muted-foreground">Computer Based Test{meta.institution && ` · ${meta.institution}`}</p>
        </div>

        <div className="rounded-2xl border bg-card p-8 shadow-elevated">
          <h2 className="text-lg font-bold">Masuk ke akun Anda</h2>
          <p className="mt-1 text-sm text-muted-foreground">Gunakan username dan password dari pengawas ujian.</p>

          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-invalid={!!errors.username}
                placeholder="contoh: alrijal"
                className="h-11"
              />
              {errors.username && <p className="text-xs font-medium text-destructive">{errors.username}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!errors.password}
                  placeholder="••••••••"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                  aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs font-medium text-destructive">{errors.password}</p>}
            </div>

            {errors.form && (
              <div role="alert" className="rounded-lg bg-destructive-soft px-3 py-2 text-sm font-medium text-destructive">
                {errors.form}
              </div>
            )}

            <Button type="submit" size="lg" className="h-11 w-full text-base" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <LogIn />}
              {loading ? "Memeriksa…" : "Masuk"}
            </Button>
          </form>

          <div className="mt-6 border-t pt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Akun demo</p>
            <div className="grid grid-cols-2 gap-2">
              <DemoButton icon={<ShieldCheck />} title="Admin" sub={`${DEMO_ACCOUNTS.admin.username} / ${DEMO_ACCOUNTS.admin.password}`} onClick={() => fill(DEMO_ACCOUNTS.admin)} />
              <DemoButton icon={<UserRound />} title="Peserta" sub={`${DEMO_ACCOUNTS.peserta.username} / ${DEMO_ACCOUNTS.peserta.password}`} onClick={() => fill(DEMO_ACCOUNTS.peserta)} />
            </div>
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Server className="h-3.5 w-3.5" />
          Server: {meta.server || "…"}
        </p>
      </div>
    </main>
  );
}

function DemoButton({ icon, title, sub, onClick }: { icon: React.ReactNode; title: string; sub: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-lg border bg-background px-3 py-2.5 text-left transition-colors hover:border-primary/40 hover:bg-accent [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-primary"
    >
      {icon}
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block truncate font-mono text-[11px] text-muted-foreground">{sub}</span>
      </span>
    </button>
  );
}
