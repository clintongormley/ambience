import { describe, expect, it, vi } from "vitest";
import { subscribeLiveScenes } from "../frontend/src/api.js";
import { scopeCategoryKey, scopeFromParts } from "../frontend/src/entities-for-scope.js";

describe("subscribeLiveScenes", () => {
  it("subscribes via subscribeMessage and returns its unsub", async () => {
    const unsub = vi.fn();
    const subscribeMessage = vi.fn().mockResolvedValue(unsub);
    const hass: any = { connection: { subscribeMessage } };
    const cb = vi.fn();

    const got = await subscribeLiveScenes(hass, cb);

    expect(subscribeMessage).toHaveBeenCalledWith(cb, { type: "ambience/live/subscribe" });
    expect(got).toBe(unsub);
  });

  it("is a no-op when the connection has no subscribeMessage", async () => {
    const hass: any = { connection: {} };
    const unsub = await subscribeLiveScenes(hass, vi.fn());
    expect(typeof unsub).toBe("function");
    expect(() => unsub()).not.toThrow();
  });

  it("degrades to a no-op (never rejects) when subscribeMessage rejects", async () => {
    // e.g. the ambience/live/subscribe command is missing on a backend older
    // than this frontend — must not reject and tear down the registry subs.
    const subscribeMessage = vi.fn().mockRejectedValue(new Error("unknown_command"));
    const hass: any = { connection: { subscribeMessage } };

    const unsub = await subscribeLiveScenes(hass, vi.fn());

    expect(typeof unsub).toBe("function");
    expect(() => unsub()).not.toThrow();
  });
});

describe("scopeFromParts", () => {
  it("rebuilds house, area and floor scopes that round-trip the key", () => {
    expect(scopeFromParts("house", null)).toEqual({ kind: "house" });
    expect(scopeFromParts("area", "a")).toEqual({ kind: "area", id: "a" });
    expect(scopeCategoryKey(scopeFromParts("floor", "f"), "g")).toBe(
      scopeCategoryKey({ kind: "floor", id: "f" }, "g"),
    );
  });
});
