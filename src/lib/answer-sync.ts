import { api, ApiError, NetworkError, type OptionKey } from "@/lib/api";

export type SyncState = "saved" | "saving" | "offline";

const backupKey = (attemptId: string) => `ujianix.pending.${attemptId}`;

/**
 * Sends answers to the server one by one. Answers that cannot be delivered
 * (LAN down, server busy) are kept in a small local buffer and retried
 * automatically, so nothing is lost when the connection drops or the page
 * reloads. The server stays the source of truth.
 */
export class AnswerSync {
  private pending = new Map<string, OptionKey | null>();
  private flushing = false;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private disposed = false;

  constructor(
    private attemptId: string,
    private onState: (s: SyncState, pendingCount: number) => void,
    private onExpired: () => void,
  ) {
    try {
      const raw = window.localStorage.getItem(backupKey(attemptId));
      if (raw) for (const [k, v] of Object.entries(JSON.parse(raw) as Record<string, OptionKey | null>)) this.pending.set(k, v);
    } catch {
      /* ignore corrupt buffer */
    }
    window.addEventListener("online", this.handleOnline);
  }

  /** Answers buffered locally but not yet confirmed by the server. */
  get buffered(): Record<string, OptionKey | null> {
    return Object.fromEntries(this.pending);
  }

  set(questionId: string, answer: OptionKey | null) {
    this.pending.set(questionId, answer);
    this.persist();
    void this.flush();
  }

  async flush() {
    if (this.flushing || this.disposed) return;
    if (this.pending.size === 0) return this.onState("saved", 0);
    this.flushing = true;
    this.onState("saving", this.pending.size);
    try {
      while (this.pending.size > 0 && !this.disposed) {
        const [qid, value] = this.pending.entries().next().value as [string, OptionKey | null];
        await api.saveAnswer(this.attemptId, qid, value);
        if (this.pending.get(qid) === value) this.pending.delete(qid);
        this.persist();
      }
      this.onState("saved", 0);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        this.onExpired();
      } else {
        this.onState("offline", this.pending.size);
        if (!(err instanceof NetworkError) && !(err instanceof ApiError)) console.error(err);
        this.scheduleRetry();
      }
    } finally {
      this.flushing = false;
    }
  }

  clear() {
    this.pending.clear();
    window.localStorage.removeItem(backupKey(this.attemptId));
  }

  dispose() {
    this.disposed = true;
    if (this.retryTimer) clearTimeout(this.retryTimer);
    window.removeEventListener("online", this.handleOnline);
  }

  private scheduleRetry() {
    if (this.retryTimer) clearTimeout(this.retryTimer);
    this.retryTimer = setTimeout(() => void this.flush(), 3000);
  }

  private handleOnline = () => void this.flush();

  private persist() {
    if (this.pending.size === 0) window.localStorage.removeItem(backupKey(this.attemptId));
    else window.localStorage.setItem(backupKey(this.attemptId), JSON.stringify(Object.fromEntries(this.pending)));
  }
}
