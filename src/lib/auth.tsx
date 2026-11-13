import { useNavigate } from "@tanstack/react-router";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { api, type Role, type User } from "@/lib/api";
import { readSession, writeSession } from "@/lib/session";

interface AuthState {
  user: User | null;
  ready: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(readSession()?.user ?? null);
    setReady(true);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await api.login(username, password);
    writeSession(res);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    writeSession(null);
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, ready, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export const homeFor = (role: Role) => (role === "admin" ? "/admin" : "/peserta");

/** Redirects away unless the signed-in user has the given role. */
export function useRequireRole(role: Role) {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const allowed = ready && user?.role === role;

  useEffect(() => {
    if (!ready) return;
    if (!user) navigate({ to: "/", replace: true });
    else if (user.role !== role) navigate({ to: homeFor(user.role), replace: true });
  }, [ready, user, role, navigate]);

  return allowed ? user : null;
}
