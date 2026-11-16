import { Badge } from "@/components/ui/badge";
import type { AttemptStatus, ExamStatus, ParticipantExamState } from "@/lib/api";

const EXAM: Record<ExamStatus, { label: string; variant: "muted" | "success" | "secondary" }> = {
  belum_dimulai: { label: "Belum Dimulai", variant: "muted" },
  berlangsung: { label: "Sedang Berlangsung", variant: "success" },
  selesai: { label: "Selesai", variant: "secondary" },
};

export const EXAM_STATUS_LABEL: Record<ExamStatus, string> = {
  belum_dimulai: EXAM.belum_dimulai.label,
  berlangsung: EXAM.berlangsung.label,
  selesai: EXAM.selesai.label,
};

export function ExamStatusBadge({ status }: { status: ExamStatus }) {
  const s = EXAM[status];
  return (
    <Badge variant={s.variant}>
      {status === "berlangsung" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />}
      {s.label}
    </Badge>
  );
}

export function AttemptStatusBadge({ status }: { status: AttemptStatus }) {
  return status === "submitted" ? (
    <Badge variant="success">Selesai</Badge>
  ) : (
    <Badge variant="warning">Sedang Mengerjakan</Badge>
  );
}

export function ParticipantStateBadge({ state }: { state: ParticipantExamState }) {
  if (state === "selesai") return <Badge variant="success">Sudah Dikerjakan</Badge>;
  if (state === "sedang_dikerjakan") return <Badge variant="warning">Sedang Dikerjakan</Badge>;
  return <Badge variant="muted">Belum Dikerjakan</Badge>;
}
