import { describe, expect, it } from "vitest";
import { formatClock, remainingMs, scoreAttempt } from "./scoring";
import type { Question } from "./api/types";

const q = (id: string, correct: Question["correct"], points = 10): Question => ({
  id,
  subject: "Tes",
  text: id,
  options: { A: "a", B: "b", C: "c", D: "d" },
  correct,
  points,
});

describe("scoreAttempt", () => {
  const questions = [q("1", "A"), q("2", "B"), q("3", "C"), q("4", "D")];

  it("gives 100 when every answer is correct", () => {
    const r = scoreAttempt(questions, { "1": "A", "2": "B", "3": "C", "4": "D" });
    expect(r.score).toBe(100);
    expect(r.correct).toBe(4);
  });

  it("counts wrong and unanswered separately", () => {
    const r = scoreAttempt(questions, { "1": "A", "2": "C" });
    expect(r).toMatchObject({ correct: 1, wrong: 1, unanswered: 2, score: 25 });
  });

  it("weights the score by each question's points", () => {
    const weighted = [q("1", "A", 30), q("2", "B", 10)];
    expect(scoreAttempt(weighted, { "1": "A" }).score).toBe(75);
  });

  it("scores 0 for an exam without questions", () => {
    expect(scoreAttempt([], {}).score).toBe(0);
  });
});

describe("timer helpers", () => {
  it("never returns negative remaining time", () => {
    expect(remainingMs("2026-01-01T00:00:00Z", Date.parse("2026-01-01T00:05:00Z"))).toBe(0);
  });

  it("formats minutes and hours", () => {
    expect(formatClock(5 * 60_000 + 9_000)).toBe("05:09");
    expect(formatClock(3_909_000)).toBe("1:05:09");
  });
});
