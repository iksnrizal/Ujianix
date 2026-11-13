import type { User } from "@/lib/api/types";

/** Login session for this computer (token issued by the server). */
export interface StoredSession {
  token: string;
  user: User;
}

const SESSION_KEY = "ujianix.session";

export function readSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

export function writeSession(session: StoredSession | null) {
  if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else window.localStorage.removeItem(SESSION_KEY);
}

export function getToken(): string | null {
  return readSession()?.token ?? null;
}
