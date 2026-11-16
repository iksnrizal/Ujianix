/**
 * Runtime configuration for Ujianix.
 *
 * - `mode: "mock"`  → data simulasi di browser (untuk demo tanpa server).
 * - `mode: "flask"` → semua data dikirim ke backend Flask (folder /backend) di `apiBaseUrl`.
 *
 * Default diambil dari env (VITE_API_MODE, VITE_API_BASE_URL) dan dapat diubah
 * admin lewat halaman Pengaturan tanpa build ulang.
 */
export type ApiMode = "mock" | "flask";

export interface AppConfig {
  mode: ApiMode;
  apiBaseUrl: string;
  institutionName: string;
  /** Demo only: pura-pura koneksi ke server terputus (mode simulasi). */
  simulateOffline: boolean;
}

const CONFIG_KEY = "ujianix.config";

export const DEFAULT_CONFIG: AppConfig = {
  mode: import.meta.env["VITE_API_MODE"] === "flask" ? "flask" : "mock",
  apiBaseUrl: (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "http://192.168.1.10:5000",
  institutionName: "SMA Negeri Demo Ujianix",
  simulateOffline: false,
};

export function getConfig(): AppConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = window.localStorage.getItem(CONFIG_KEY);
    return raw ? { ...DEFAULT_CONFIG, ...(JSON.parse(raw) as Partial<AppConfig>) } : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(patch: Partial<AppConfig>): AppConfig {
  const next = { ...getConfig(), ...patch };
  window.localStorage.setItem(CONFIG_KEY, JSON.stringify(next));
  return next;
}

export function resetConfig() {
  window.localStorage.removeItem(CONFIG_KEY);
}
