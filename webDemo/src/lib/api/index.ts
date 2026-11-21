import { getConfig } from "@/config";
import { httpApi } from "./http";
import { mockApi } from "./mock";
import type { UjianixApi } from "./types";

export * from "./types";

/** Picks the backend at call time, so changing Pengaturan takes effect immediately. */
export const api = new Proxy({} as UjianixApi, {
  get(_target, key: keyof UjianixApi) {
    const impl = getConfig().mode === "flask" ? httpApi : mockApi;
    return impl[key];
  },
});

export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Terjadi kesalahan";
}
