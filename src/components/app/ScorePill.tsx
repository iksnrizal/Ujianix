import { cn } from "@/lib/utils";

export function ScorePill({ score }: { score?: number }) {
  if (score === undefined) return <span className="text-muted-foreground">-</span>;
  const tone = score >= 75 ? "bg-success-soft text-success" : score >= 60 ? "bg-warning-soft text-warning-foreground" : "bg-destructive-soft text-destructive";
  return <span className={cn("inline-flex min-w-14 justify-center rounded-md px-2 py-1 text-sm font-bold tabular-nums", tone)}>{score.toLocaleString("id-ID")}</span>;
}
