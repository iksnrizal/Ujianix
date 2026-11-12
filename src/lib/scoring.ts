import type { Answers, AttemptResult, Question } from "@/lib/api/types";

/**
 * Score an attempt. Each question carries its own points; the final score is
 * earned points / total points × 100, rounded to one decimal.
 * "Salah" counts answered-but-wrong only; blank answers are "tidak dijawab".
 */
export function scoreAttempt(questions: Question[], answers: Answers): AttemptResult {
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;
  let earnedPoints = 0;
  let totalPoints = 0;

  for (const q of questions) {
    totalPoints += q.points;
    const given = answers[q.id];
    if (!given) unanswered++;
    else if (given === q.correct) {
      correct++;
      earnedPoints += q.points;
    } else wrong++;
  }

  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 1000) / 10 : 0;
  return { totalQuestions: questions.length, correct, wrong, unanswered, earnedPoints, totalPoints, score };
}

/** Milliseconds left until the deadline, never negative. */
export function remainingMs(deadlineIso: string, nowMs: number): number {
  return Math.max(0, new Date(deadlineIso).getTime() - nowMs);
}

/** 1:05:09 or 05:09 */
export function formatClock(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}
