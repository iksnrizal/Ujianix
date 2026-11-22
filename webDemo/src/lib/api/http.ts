/**
 * HTTP client for the Flask backend (see /backend/app.py).
 * Base address comes from Pengaturan → Alamat Server, so participants'
 * computers can point to the supervisor laptop on the local network.
 */
import { getConfig } from "@/config";
import { getToken } from "@/lib/session";
import { ApiError, NetworkError, type UjianixApi } from "./types";

async function call<T>(method: string, path: string, body?: unknown, timeoutMs = 8000): Promise<T> {
  const base = getConfig().apiBaseUrl.replace(/\/+$/, "");
  const token = getToken();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res: Response;
  try {
    res = await fetch(`${base}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? null : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    throw new NetworkError();
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    let message = `Permintaan gagal (${res.status})`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(message, res.status);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

const enc = encodeURIComponent;

export const httpApi: UjianixApi = {
  login: (username, password) => call("POST", "/api/auth/login", { username, password }),
  logout: () => call<void>("POST", "/api/auth/logout").catch(() => undefined),
  health: () => call("GET", "/api/health", undefined, 4000),

  getDashboardStats: () => call("GET", "/api/admin/stats"),
  listParticipants: () => call("GET", "/api/admin/participants"),
  createParticipant: (input) => call("POST", "/api/admin/participants", input),
  updateParticipant: (id, input) => call("PUT", `/api/admin/participants/${enc(id)}`, input),
  deleteParticipant: (id) => call("DELETE", `/api/admin/participants/${enc(id)}`),
  listQuestions: () => call("GET", "/api/admin/questions"),
  createQuestion: (input) => call("POST", "/api/admin/questions", input),
  updateQuestion: (id, input) => call("PUT", `/api/admin/questions/${enc(id)}`, input),
  deleteQuestion: (id) => call("DELETE", `/api/admin/questions/${enc(id)}`),
  listExams: () => call("GET", "/api/admin/exams"),
  createExam: (input) => call("POST", "/api/admin/exams", input),
  updateExam: (id, input) => call("PUT", `/api/admin/exams/${enc(id)}`, input),
  setExamStatus: (id, status) => call("PATCH", `/api/admin/exams/${enc(id)}/status`, { status }),
  deleteExam: (id) => call("DELETE", `/api/admin/exams/${enc(id)}`),
  listResults: () => call("GET", "/api/admin/results"),
  resetDemoData: () => call("POST", "/api/admin/reset"),

  listMyExams: () => call("GET", "/api/exams"),
  startExam: (examId) => call("POST", `/api/exams/${enc(examId)}/start`),
  saveAnswer: (attemptId, questionId, answer) =>
    call("PUT", `/api/attempts/${enc(attemptId)}/answers/${enc(questionId)}`, { answer }, 5000),
  submitAttempt: (attemptId, answers) => call("POST", `/api/attempts/${enc(attemptId)}/submit`, { answers }),
  getResult: (attemptId) => call("GET", `/api/attempts/${enc(attemptId)}/result`),
};
