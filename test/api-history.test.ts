import { describe, expect, it, vi } from "vitest";
import { redoChange, saveHouse, subscribeHistory, undoChange } from "../frontend/src/api.js";

describe("subscribeHistory", () => {
  it("subscribes via subscribeMessage and returns its unsub", async () => {
    const unsub = vi.fn();
    const subscribeMessage = vi.fn().mockResolvedValue(unsub);
    const hass: any = { connection: { subscribeMessage } };
    const cb = vi.fn();
    const got = await subscribeHistory(hass, cb);
    expect(subscribeMessage).toHaveBeenCalledWith(cb, { type: "ambience/history/subscribe" });
    expect(got).toBe(unsub);
  });

  it("degrades to a no-op when subscribeMessage is missing or rejects", async () => {
    const a = await subscribeHistory({ connection: {} } as any, vi.fn());
    expect(() => a()).not.toThrow();
    const subscribeMessage = vi.fn().mockRejectedValue(new Error("unknown_command"));
    const b = await subscribeHistory({ connection: { subscribeMessage } } as any, vi.fn());
    expect(() => b()).not.toThrow();
  });
});

describe("undo/redo + save change descriptor", () => {
  it("undoChange and redoChange call the right commands", async () => {
    const callWS = vi.fn().mockResolvedValue({ ok: true });
    const hass: any = { callWS };
    await undoChange(hass);
    await redoChange(hass);
    expect(callWS).toHaveBeenCalledWith({ type: "ambience/history/undo" });
    expect(callWS).toHaveBeenCalledWith({ type: "ambience/history/redo" });
  });

  it("saveHouse forwards the change descriptor", async () => {
    const callWS = vi.fn().mockResolvedValue({ ok: true, config: { scenes: [] } });
    const hass: any = { callWS };
    await saveHouse(hass, { scenes: [] }, { action: "delete", scene_name: "X" });
    expect(callWS).toHaveBeenCalledWith({
      type: "ambience/house/save",
      config: { scenes: [] },
      change: { action: "delete", scene_name: "X" },
    });
  });
});
