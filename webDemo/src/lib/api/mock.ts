/**
 * Simulated backend for demos without a server. It mirrors the Flask API
 * contract (see /backend) so the UI behaves the same in both modes.
 * Data lives only in this browser — not a final storage solution.
 */
import { getConfig } from "@/config";
import { scoreAttempt } from "@/lib/scoring";
import { getToken } from "@/lib/session";
import { createSeed, type MockDb } from "./seed";
import {
  ApiError,
  NetworkError,
  type Attempt,
  type Exam,
  type ParticipantExamView,
  type ResultDetail,
  type ResultRow,
  type Role,
  type UjianixApi,
} from "./types";

const DB_KEY = "ujianix.mockdb.v1";
let db: MockDb | null = null;

function load(): MockDb {
  if (db) return db;
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(DB_KEY);
      if (raw) db = JSON.parse(raw) as MockDb;
    } catch {
      db = null;
    }
  }
  if (!db) {
    db = createSeed();
    persist();
  }
  return db;
}

function persist() {
  if (db && typeof window !== "undefined") window.localStorage.setItem(DB_KEY, JSON.stringify(db));
}

const uid = (prefix: string) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

async function request<T>(fn: () => T, latency = 160): Promise<T> {
  await new Promise((r) => setTimeout(r, latency));
  if (getConfig().simulateOffline || (typeof navigator !== "undefined" && !navigator.onLine)) {
    throw new NetworkError();
  }
  return fn();
}

function auth(role: Role) {
  const token = getToken();
  const [, tokenRole, id] = token?.split(":") ?? [];
  if (!token || tokenRole !== role || !id) throw new ApiError("Sesi tidak valid. Silakan login kembali.", 401);
  return id;
}

function finalize(d: MockDb, attempt: Attempt, now = Date.now()) {
  const exam = d.exams.find((e) => e.id === attempt.examId);
  const qs = (exam?.questionIds ?? []).map((id) => d.questions.find((q) => q.id === id)).filter((q) => !!q);
  attempt.status = "submitted";
  attempt.submittedAt = new Date(Math.min(now, new Date(attempt.deadline).getTime())).toISOString();
  attempt.result = scoreAttempt(qs, attempt.answers);
}

/** Server-side rule: attempts past their deadline are submitted automatically. */
function sweepExpired(d: MockDb) {
  const now = Date.now();
  let changed = false;
  for (const a of d.attempts) {
    if (a.status === "in_progress" && new Date(a.deadline).getTime() <= now) {
      finalize(d, a, now);
      changed = true;
    }
  }
  if (changed) persist();
}

function toRow(d: MockDb, a: Attempt): ResultRow {
  const p = d.participants.find((x) => x.id === a.participantId);
  const e = d.exams.find((x) => x.id === a.examId);
  return {
    attemptId: a.id,
    participantName: p?.name ?? "(peserta dihapus)",
    identityNumber: p?.identityNumber ?? "-",
    className: p?.className ?? "-",
    examName: e?.name ?? "(ujian dihapus)",
    subject: e?.subject ?? "-",
    status: a.status,
    submittedAt: a.submittedAt,
    result: a.result,
  };
}

const stripPassword = ({ password: _pw, ...rest }: MockDb["participants"][number]) => rest;

function assertUsernameFree(d: MockDb, username: string, exceptId?: string) {
  const taken =
    d.admins.some((a) => a.username === username) ||
    d.participants.some((p) => p.username === username && p.id !== exceptId);
  if (taken) throw new ApiError(`Username “${username}” sudah digunakan`, 409);
}

function getExam(d: MockDb, id: string): Exam {
  const e = d.exams.find((x) => x.id === id);
  if (!e) throw new ApiError("Ujian tidak ditemukan", 404);
  return e;
}

export const mockApi: UjianixApi = {
  login: (username, password) =>
    request(() => {
      const d = load();
      const u = username.trim().toLowerCase();
      const admin = d.admins.find((a) => a.username === u && a.password === password);
      if (admin) {
        return { token: `mock:admin:${admin.id}`, user: { id: admin.id, username: admin.username, name: admin.name, role: "admin" as const } };
      }
      const p = d.participants.find((x) => x.username === u && x.password === password);
      if (!p) throw new ApiError("Username atau password salah", 401);
      return {
        token: `mock:peserta:${p.id}`,
        user: { id: p.id, username: p.username, name: p.name, role: "peserta" as const, identityNumber: p.identityNumber, className: p.className },
      };
    }, 400),

  logout: () => Promise.resolve(),

  health: () => request(() => ({ ok: true, mode: "mock" }), 80),

  getDashboardStats: () =>
    request(() => {
      auth("admin");
      const d = load();
      sweepExpired(d);
      const submitted = d.attempts
        .filter((a) => a.status === "submitted")
        .sort((a, b) => (b.submittedAt ?? "").localeCompare(a.submittedAt ?? ""));
      return {
        totalParticipants: d.participants.length,
        totalExams: d.exams.length,
        activeExams: d.exams.filter((e) => e.status === "berlangsung").length,
        inProgress: d.attempts.filter((a) => a.status === "in_progress").length,
        recentResults: submitted.slice(0, 6).map((a) => toRow(d, a)),
      };
    }),

  listParticipants: () =>
    request(() => {
      auth("admin");
      return load().participants.map(stripPassword);
    }),

  createParticipant: (input) =>
    request(() => {
      auth("admin");
      const d = load();
      const username = input.username.trim().toLowerCase();
      assertUsernameFree(d, username);
      if (!input.password) throw new ApiError("Password wajib diisi", 400);
      const p = { id: uid("p"), username, password: input.password, name: input.name.trim(), identityNumber: input.identityNumber.trim(), className: input.className.trim(), createdAt: new Date().toISOString() };
      d.participants.push(p);
      persist();
      return stripPassword(p);
    }),

  updateParticipant: (id, input) =>
    request(() => {
      auth("admin");
      const d = load();
      const p = d.participants.find((x) => x.id === id);
      if (!p) throw new ApiError("Peserta tidak ditemukan", 404);
      const username = input.username.trim().toLowerCase();
      assertUsernameFree(d, username, id);
      Object.assign(p, { username, name: input.name.trim(), identityNumber: input.identityNumber.trim(), className: input.className.trim() });
      if (input.password) p.password = input.password;
      persist();
      return stripPassword(p);
    }),

  deleteParticipant: (id) =>
    request(() => {
      auth("admin");
      const d = load();
      d.participants = d.participants.filter((p) => p.id !== id);
      d.attempts = d.attempts.filter((a) => a.participantId !== id);
      persist();
    }),

  listQuestions: () =>
    request(() => {
      auth("admin");
      return load().questions;
    }),

  createQuestion: (input) =>
    request(() => {
      auth("admin");
      const d = load();
      const q = { ...input, id: uid("q") };
      d.questions.push(q);
      persist();
      return q;
    }),

  updateQuestion: (id, input) =>
    request(() => {
      auth("admin");
      const d = load();
      const q = d.questions.find((x) => x.id === id);
      if (!q) throw new ApiError("Soal tidak ditemukan", 404);
      Object.assign(q, input);
      persist();
      return q;
    }),

  deleteQuestion: (id) =>
    request(() => {
      auth("admin");
      const d = load();
      d.questions = d.questions.filter((q) => q.id !== id);
      for (const e of d.exams) e.questionIds = e.questionIds.filter((qid) => qid !== id);
      persist();
    }),

  listExams: () =>
    request(() => {
      auth("admin");
      return load().exams;
    }),

  createExam: (input) =>
    request(() => {
      auth("admin");
      const d = load();
      const e: Exam = { ...input, id: uid("e"), createdAt: new Date().toISOString() };
      d.exams.push(e);
      persist();
      return e;
    }),

  updateExam: (id, input) =>
    request(() => {
      auth("admin");
      const d = load();
      const e = getExam(d, id);
      Object.assign(e, input);
      if (e.status === "selesai") for (const a of d.attempts) if (a.examId === id && a.status === "in_progress") finalize(d, a);
      persist();
      return e;
    }),

  setExamStatus: (id, status) =>
    request(() => {
      auth("admin");
      const d = load();
      const e = getExam(d, id);
      e.status = status;
      // Ending an exam collects every attempt still in progress.
      if (status === "selesai") for (const a of d.attempts) if (a.examId === id && a.status === "in_progress") finalize(d, a);
      persist();
      return e;
    }),

  deleteExam: (id) =>
    request(() => {
      auth("admin");
      const d = load();
      d.exams = d.exams.filter((e) => e.id !== id);
      d.attempts = d.attempts.filter((a) => a.examId !== id);
      persist();
    }),

  listResults: () =>
    request(() => {
      auth("admin");
      const d = load();
      sweepExpired(d);
      return d.attempts
        .slice()
        .sort((a, b) => (b.submittedAt ?? b.startedAt).localeCompare(a.submittedAt ?? a.startedAt))
        .map((a) => toRow(d, a));
    }),

  resetDemoData: () =>
    request(() => {
      auth("admin");
      db = createSeed();
      persist();
    }),

  listMyExams: () =>
    request(() => {
      const pid = auth("peserta");
      const d = load();
      sweepExpired(d);
      return d.exams.map<ParticipantExamView>((e) => {
        const a = d.attempts.find((x) => x.examId === e.id && x.participantId === pid);
        return {
          exam: { id: e.id, name: e.name, subject: e.subject, durationMinutes: e.durationMinutes, status: e.status },
          questionCount: e.questionIds.length,
          state: !a ? "belum_dikerjakan" : a.status === "submitted" ? "selesai" : "sedang_dikerjakan",
          attemptId: a?.id,
        };
      });
    }),

  startExam: (examId) =>
    request(() => {
      const pid = auth("peserta");
      const d = load();
      sweepExpired(d);
      const exam = getExam(d, examId);
      let attempt = d.attempts.find((a) => a.examId === examId && a.participantId === pid);
      if (attempt?.status === "submitted") throw new ApiError("Ujian ini sudah Anda kumpulkan", 409);
      if (!attempt) {
        if (exam.status !== "berlangsung") throw new ApiError("Ujian belum dibuka oleh pengawas", 403);
        if (exam.questionIds.length === 0) throw new ApiError("Ujian ini belum memiliki soal", 409);
        const now = Date.now();
        attempt = {
          id: uid("a"),
          examId,
          participantId: pid,
          startedAt: new Date(now).toISOString(),
          deadline: new Date(now + exam.durationMinutes * 60_000).toISOString(),
          answers: {},
          status: "in_progress",
        };
        d.attempts.push(attempt);
        persist();
      }
      const current: Attempt = attempt;
      const questions = exam.questionIds
        .map((id) => d.questions.find((q) => q.id === id))
        .filter((q) => !!q)
        .map(({ correct: _c, ...pub }) => pub);
      return {
        attempt: { id: current.id, examId, startedAt: current.startedAt, deadline: current.deadline, answers: { ...current.answers }, status: current.status },
        exam: { id: exam.id, name: exam.name, subject: exam.subject, durationMinutes: exam.durationMinutes },
        questions,
        serverTime: new Date().toISOString(),
      };
    }, 250),

  saveAnswer: (attemptId, questionId, answer) =>
    request(() => {
      const pid = auth("peserta");
      const d = load();
      sweepExpired(d);
      const a = d.attempts.find((x) => x.id === attemptId && x.participantId === pid);
      if (!a) throw new ApiError("Sesi ujian tidak ditemukan", 404);
      if (a.status !== "in_progress") throw new ApiError("Waktu ujian telah berakhir", 409);
      if (answer) a.answers[questionId] = answer;
      else delete a.answers[questionId];
      persist();
    }, 120),

  submitAttempt: (attemptId, answers) =>
    request(() => {
      const pid = auth("peserta");
      const d = load();
      const a = d.attempts.find((x) => x.id === attemptId && x.participantId === pid);
      if (!a) throw new ApiError("Sesi ujian tidak ditemukan", 404);
      if (a.status === "in_progress") {
        // Accept the final answer sheet only while time remains.
        if (new Date(a.deadline).getTime() + 5_000 > Date.now()) a.answers = { ...a.answers, ...answers };
        finalize(d, a);
        persist();
      }
      return { attemptId: a.id };
    }, 300),

  getResult: (attemptId) =>
    request(() => {
      const token = getToken() ?? "";
      const isAdmin = token.startsWith("mock:admin:");
      const pid = isAdmin ? null : auth("peserta");
      const d = load();
      sweepExpired(d);
      const a = d.attempts.find((x) => x.id === attemptId && (isAdmin || x.participantId === pid));
      if (!a) throw new ApiError("Hasil ujian tidak ditemukan", 404);
      const detail: ResultDetail = { ...toRow(d, a), participantId: a.participantId, examId: a.examId, startedAt: a.startedAt };
      return detail;
    }),
};
