import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSeed } from "./seed";

const DB_KEY = "ujianix.mockdb.v1";

describe("mock demo participant account", () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        get length() {
          return values.size;
        },
        clear: () => values.clear(),
        getItem: (key: string) => values.get(key) ?? null,
        key: (index: number) => [...values.keys()][index] ?? null,
        removeItem: (key: string) => values.delete(key),
        setItem: (key: string, value: string) => values.set(key, String(value)),
      } satisfies Storage,
    });
    vi.resetModules();
  });

  it("migrates the demo account name and returns it at login", async () => {
    const storedDb = createSeed();
    const demoParticipant = storedDb.participants.find(
      (participant) => participant.username === "alrijal",
    );
    if (!demoParticipant) throw new Error("Demo participant not found");
    demoParticipant.name = "Andi Pratama";
    window.localStorage.setItem(DB_KEY, JSON.stringify(storedDb));

    const { mockApi } = await import("./mock");
    const response = await mockApi.login("alrijal", "pink floyd");
    const migratedDb = JSON.parse(window.localStorage.getItem(DB_KEY) ?? "null") as typeof storedDb;
    const migratedParticipant = migratedDb.participants.find(
      (participant) => participant.username === "alrijal",
    );

    expect(response.user.name).toBe("Alrijal");
    expect(migratedParticipant?.name).toBe("Alrijal");
  });
});
