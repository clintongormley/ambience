import { describe, expect, it, vi } from "vitest";
import * as api from "../frontend/src/api.js";
import { ScopeStore } from "../frontend/src/views/scope-store.js";

function makeStore() {
  const host: any = {
    addController: vi.fn(),
    removeController: vi.fn(),
    requestUpdate: vi.fn(),
    updateComplete: Promise.resolve(true),
    isConnected: true,
    hass: { connection: {} },
  };
  return { store: new ScopeStore(host), host };
}

describe("ScopeStore history state", () => {
  it("mutate forwards the change descriptor to saveHouse", async () => {
    const spy = vi
      .spyOn(api, "saveHouse")
      .mockResolvedValue({ ok: true, config: { scenes: [] } } as any);
    const { store } = makeStore();
    await store.mutate({ kind: "house" }, { scenes: [] }, { action: "delete", scene_name: "X" });
    expect(spy).toHaveBeenCalledWith(expect.anything(), { scenes: [] }, {
      action: "delete",
      scene_name: "X",
    });
    spy.mockRestore();
  });

  it("undo applies the returned config to the affected scope", async () => {
    vi.spyOn(api, "undoChange").mockResolvedValue({
      ok: true,
      scope_kind: "area",
      scope_id: "a",
      config: { scenes: [{ name: "A", category: "general" }] },
    } as any);
    const { store } = makeStore();
    await store.undo();
    expect(store.areaConfigs.get("a")?.scenes[0].name).toBe("A");
  });

  it("a history snapshot updates the toolbar flags", () => {
    const { store } = makeStore();
    (store as any)._onHistory({
      op: "record",
      can_undo: true,
      can_redo: false,
      undo: { action: "delete", scene_name: "X", scope_kind: "house", scope_id: null },
      redo: null,
      undo_count: 1,
      redo_count: 0,
      changed_scope: null,
    });
    expect(store.canUndo).toBe(true);
    expect(store.undoAction?.action).toBe("delete");
  });
});
