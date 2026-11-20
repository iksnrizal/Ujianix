import type { ReactNode } from "react";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function FullPageLoader({ label = "Memuat…" }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        {label}
      </div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-xl border border-dashed bg-dot-grid px-6 py-12 text-center">
      <p className="font-semibold">{title}</p>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

export function formatDateTime(iso?: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
