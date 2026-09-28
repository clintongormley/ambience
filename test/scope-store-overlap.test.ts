import { afterEach, describe, expect, it, vi } from "vitest";
import * as api from "../frontend/src/api.js";
import type { Scene, Scope, ScopeConfig } from "../frontend/src/types.js";
import { ScopeStore } from "../frontend/src/views/scope-store.js";

// The "controlled by multiple groups" flag is computed across every scope, so a
// save to one scope can change the flag on another. These tests pin that the
// store re-reads the other scopes that drive the same entities.

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

const house: Scope = { kind: "house" };
const kitchen: Scope = { kind: "area", id: "kitchen" };

function lockOnly(store: ScopeStore, locked: () => Scope | null) {
  (store as any)._isScopeLocked = (s: Scope) => {
    const l = locked();
    return l !== null && l.kind === s.kind && (s.kind === "house" || (l as any).id === s.id);
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

async function flush() {
  for (let i = 0; i < 20; i++) await Promise.resolve();
}

function pushChange(store: ScopeStore, scope: Scope) {
  (store as any)._onHistory({
    op: "record",
    can_undo: true,
    can_redo: false,
    undo: null,
    redo: null,
    undo_count: 1,
    redo_count: 0,
    changed_scope: { scope_kind: scope.kind, scope_id: scope.kind === "house" ? null : scope.id },
    is_self: false,
  });
}

function scene(name: string, entity: string, overlap: string[] = []): Scene {
  return {
    name,
    category: "c",
    when: {},
    actions: [{ service: "light.turn_on", entity_ids: [entity], params: {} }],
    overlap_entities: overlap,
  } as Scene;
}

const cfg = (...scenes: Scene[]): ScopeConfig => ({ scenes }) as ScopeConfig;

afterEach(() => vi.restoreAllMocks());

describe("ScopeStore refreshes overlap flags on scopes sharing an entity", () => {
  it("clears a stale flag on the area when the house's copy is deleted", async () => {
    const { store } = makeStore();
    store.house = cfg(scene("Nighttime", "light.x"));
    store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
    vi.spyOn(api, "saveHouse").mockResolvedValue({ ok: true, config: cfg() } as any);
    vi.spyOn(api, "getArea").mockResolvedValue(cfg(scene("Nighttime", "light.x")));

    await store.mutate({ kind: "house" }, cfg());

    expect(store.areaConfigs.get("kitchen")?.scenes[0].overlap_entities).toEqual([]);
  });

  it("flags the house when an area save starts driving the same entity", async () => {
    const { store } = makeStore();
    store.house = cfg(scene("Nighttime", "light.x"));
    store.areaConfigs = new Map([["kitchen", cfg()]]);
    vi.spyOn(api, "saveArea").mockResolvedValue({
      ok: true,
      config: cfg(scene("Nighttime", "light.x", ["light.x"])),
    } as any);
    vi.spyOn(api, "getHouse").mockResolvedValue(cfg(scene("Nighttime", "light.x", ["light.x"])));

    await store.mutate({ kind: "area", id: "kitchen" }, cfg(scene("Nighttime", "light.x")));

    expect(store.house?.scenes[0].overlap_entities).toEqual(["light.x"]);
  });

  it("does not re-read a scope that drives none of the changed entities", async () => {
    const { store } = makeStore();
    store.house = cfg(scene("Nighttime", "light.x"));
    store.areaConfigs = new Map([["lounge", cfg(scene("Evening", "light.y"))]]);
    vi.spyOn(api, "saveHouse").mockResolvedValue({ ok: true, config: cfg() } as any);
    const getArea = vi.spyOn(api, "getArea");

    await store.mutate({ kind: "house" }, cfg());

    expect(getArea).not.toHaveBeenCalled();
  });

  it("leaves a scope that is open in the editor alone", async () => {
    const { store } = makeStore();
    (store as any)._isScopeLocked = (s: any) => s.kind === "area" && s.id === "kitchen";
    store.house = cfg(scene("Nighttime", "light.x"));
    store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
    vi.spyOn(api, "saveHouse").mockResolvedValue({ ok: true, config: cfg() } as any);
    const getArea = vi.spyOn(api, "getArea");

    await store.mutate({ kind: "house" }, cfg());

    expect(getArea).not.toHaveBeenCalled();
  });

  it("refreshes sharing scopes after an undo", async () => {
    const { store } = makeStore();
    store.house = cfg(scene("Nighttime", "light.x"));
    store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
    vi.spyOn(api, "undoChange").mockResolvedValue({
      ok: true,
      scope_kind: "house",
      scope_id: null,
      config: cfg(),
    } as any);
    vi.spyOn(api, "getArea").mockResolvedValue(cfg(scene("Nighttime", "light.x")));

    await store.undo();

    expect(store.areaConfigs.get("kitchen")?.scenes[0].overlap_entities).toEqual([]);
  });

  it("refreshes sharing scopes after a change made in another tab", async () => {
    const { store } = makeStore();
    store.house = cfg(scene("Nighttime", "light.x"));
    store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
    vi.spyOn(api, "getHouse").mockResolvedValue(cfg());
    vi.spyOn(api, "getArea").mockResolvedValue(cfg(scene("Nighttime", "light.x")));

    (store as any)._onHistory({
      op: "record",
      can_undo: true,
      can_redo: false,
      undo: { action: "delete", scene_name: "Nighttime", scope_kind: "house", scope_id: null },
      redo: null,
      undo_count: 1,
      redo_count: 0,
      changed_scope: { scope_kind: "house", scope_id: null },
      is_self: false,
    });

    await vi.waitFor(() =>
      expect(store.areaConfigs.get("kitchen")?.scenes[0].overlap_entities).toEqual([]),
    );
  });

  it("refreshes a floor that shares an entity with a saved area", async () => {
    const { store } = makeStore();
    store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x"))]]);
    store.floorConfigs = new Map([["ground", cfg(scene("Evening", "light.x", ["light.x"]))]]);
    vi.spyOn(api, "saveArea").mockResolvedValue({ ok: true, config: cfg() } as any);
    const getFloor = vi.spyOn(api, "getFloor").mockResolvedValue(cfg(scene("Evening", "light.x")));

    await store.mutate(kitchen, cfg());

    expect(getFloor).toHaveBeenCalledWith(expect.anything(), "ground");
    expect(store.floorConfigs.get("ground")?.scenes[0].overlap_entities).toEqual([]);
  });

  it("refreshes sharing scopes after a redo", async () => {
    const { store } = makeStore();
    store.house = cfg();
    store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x"))]]);
    vi.spyOn(api, "redoChange").mockResolvedValue({
      ok: true,
      scope_kind: "house",
      scope_id: null,
      config: cfg(scene("Nighttime", "light.x", ["light.x"])),
    } as any);
    vi.spyOn(api, "getArea").mockResolvedValue(cfg(scene("Nighttime", "light.x", ["light.x"])));

    await store.redo();

    expect(store.areaConfigs.get("kitchen")?.scenes[0].overlap_entities).toEqual(["light.x"]);
  });

  it("re-reads sharing scopes when the editor closes on a scope another tab changed (incl. Load theirs)", async () => {
    const { store } = makeStore();
    let locked: Scope | null = house;
    lockOnly(store, () => locked);
    store.house = cfg(scene("Nighttime", "light.x"));
    store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
    vi.spyOn(api, "getHouse").mockResolvedValue(cfg());
    const getArea = vi.spyOn(api, "getArea").mockResolvedValue(cfg(scene("Nighttime", "light.x")));
    pushChange(store, house);
    await flush();
    expect(getArea).not.toHaveBeenCalled();
    locked = null;

    await store.editorClosed(house);

    expect(store.house.scenes).toEqual([]);
    expect(store.isScopeStale(house)).toBe(false);
    expect(getArea).toHaveBeenCalledTimes(1);
    expect(store.areaConfigs.get("kitchen")?.scenes[0].overlap_entities).toEqual([]);
  });

  describe("another tab changes the scope whose editor is open here", () => {
    it("leaves no warning behind for a device only an intermediate version used", async () => {
      const { store } = makeStore();
      let locked: Scope | null = kitchen;
      lockOnly(store, () => locked);
      store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x"))]]);
      store.house = cfg(scene("Evening", "light.y"));
      let serverHouseOverlap: string[] = [];
      let serverKitchen = cfg(scene("Nighttime", "light.x"));
      vi.spyOn(api, "getArea").mockImplementation(async () => serverKitchen);
      vi.spyOn(api, "getHouse").mockImplementation(async () =>
        cfg(scene("Evening", "light.y", serverHouseOverlap)),
      );
      serverKitchen = cfg(scene("Nighttime", "light.x"), scene("Added", "light.y", ["light.y"]));
      serverHouseOverlap = ["light.y"];
      pushChange(store, kitchen);
      await flush();
      serverKitchen = cfg(scene("Nighttime", "light.x"));
      serverHouseOverlap = [];
      pushChange(store, kitchen);
      await flush();

      locked = null;
      await store.editorClosed(kitchen);
      await flush();

      expect(store.house.scenes[0].overlap_entities).toEqual([]);
    });

    it("leaves no warning behind after saving over their change (Overwrite theirs)", async () => {
      const { store } = makeStore();
      lockOnly(store, () => kitchen);
      store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x"))]]);
      store.house = cfg(scene("Evening", "light.y"));
      let serverHouseOverlap = ["light.y"];
      vi.spyOn(api, "getArea").mockResolvedValue(
        cfg(scene("Nighttime", "light.x"), scene("Theirs", "light.y", ["light.y"])),
      );
      vi.spyOn(api, "getHouse").mockImplementation(async () =>
        cfg(scene("Evening", "light.y", serverHouseOverlap)),
      );
      pushChange(store, kitchen);
      await flush();
      serverHouseOverlap = [];
      vi.spyOn(api, "saveArea").mockResolvedValue({
        ok: true,
        config: cfg(scene("Nighttime", "light.x")),
      } as any);

      expect(await store.mutate(kitchen, cfg(scene("Nighttime", "light.x")))).toBe(true);

      expect(store.house.scenes[0].overlap_entities).toEqual([]);
    });
  });

  describe("a failed re-read of a sharing scope stays silent", () => {
    it("after a save: the save stands and no error banner shows", async () => {
      const { store } = makeStore();
      store.house = cfg(scene("Nighttime", "light.x"));
      store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
      vi.spyOn(api, "saveHouse").mockResolvedValue({ ok: true, config: cfg() } as any);
      vi.spyOn(api, "getArea").mockRejectedValue(new Error("read failed"));

      expect(await store.mutate(house, cfg())).toBe(true);

      expect(store.house.scenes).toEqual([]);
      expect(store.error).toBe("");
    });

    it("after an undo: the restored config stands and no error banner shows", async () => {
      const { store } = makeStore();
      store.house = cfg(scene("Nighttime", "light.x"));
      store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
      vi.spyOn(api, "undoChange").mockResolvedValue({
        ok: true,
        scope_kind: "house",
        scope_id: null,
        config: cfg(),
      } as any);
      vi.spyOn(api, "getArea").mockRejectedValue(new Error("read failed"));

      await store.undo();

      expect(store.house.scenes).toEqual([]);
      expect(store.error).toBe("");
    });
  });

  it("does not apply a sharer's re-read if its editor opened while the read was in flight", async () => {
    const { store } = makeStore();
    let locked: Scope | null = null;
    lockOnly(store, () => locked);
    store.house = cfg(scene("Nighttime", "light.x"));
    const original = cfg(scene("Nighttime", "light.x", ["light.x"]));
    store.areaConfigs = new Map([["kitchen", original]]);
    const response = deferred<ScopeConfig>();
    vi.spyOn(api, "getHouse").mockResolvedValue(cfg());
    vi.spyOn(api, "getArea").mockReturnValue(response.promise);
    pushChange(store, house);
    await flush();
    expect(api.getArea).toHaveBeenCalledTimes(1);

    locked = kitchen;
    response.resolve(cfg(scene("Inserted", "light.y"), scene("Nighttime", "light.x")));
    await flush();

    expect(store.areaConfigs.get("kitchen")).toBe(original);
  });

  it("does not apply a sharer's re-read that lands after the host disconnects", async () => {
    const { store, host } = makeStore();
    store.house = cfg(scene("Nighttime", "light.x"));
    const original = cfg(scene("Nighttime", "light.x", ["light.x"]));
    store.areaConfigs = new Map([["kitchen", original]]);
    const response = deferred<ScopeConfig>();
    vi.spyOn(api, "saveHouse").mockResolvedValue({ ok: true, config: cfg() } as any);
    vi.spyOn(api, "getArea").mockReturnValue(response.promise);

    const saving = store.mutate(house, cfg());
    await flush();
    host.isConnected = false;
    response.resolve(cfg(scene("Nighttime", "light.x")));
    await saving;

    expect(store.areaConfigs.get("kitchen")).toBe(original);
  });

  it("does not let a sharer's late re-read overwrite a save to that scope made meanwhile", async () => {
    const { store } = makeStore();
    store.house = cfg(scene("Nighttime", "light.x"));
    store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
    const response = deferred<ScopeConfig>();
    vi.spyOn(api, "getHouse").mockResolvedValue(cfg());
    vi.spyOn(api, "getArea").mockReturnValue(response.promise);
    pushChange(store, house);
    await flush();
    expect(api.getArea).toHaveBeenCalledTimes(1);
    vi.spyOn(api, "saveArea").mockResolvedValue({
      ok: true,
      config: cfg(scene("Saved edit", "light.x")),
    } as any);
    expect(await store.mutate(kitchen, cfg(scene("Saved edit", "light.x")))).toBe(true);

    response.resolve(cfg(scene("Nighttime", "light.x")));
    await flush();

    expect(store.areaConfigs.get("kitchen")?.scenes.map((s) => s.name)).toEqual(["Saved edit"]);
  });

  it("applies the newer of two overlapping re-reads of the same scope", async () => {
    const { store } = makeStore();
    store.house = cfg(scene("Nighttime", "light.x"));
    store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x"))]]);
    const older = deferred<ScopeConfig>();
    const newer = deferred<ScopeConfig>();
    vi.spyOn(api, "getHouse").mockResolvedValue(cfg(scene("Nighttime", "light.x")));
    vi.spyOn(api, "getArea").mockReturnValueOnce(older.promise).mockReturnValueOnce(newer.promise);
    pushChange(store, house);
    await flush();
    pushChange(store, house);
    await flush();
    expect(api.getArea).toHaveBeenCalledTimes(2);

    older.resolve(cfg(scene("Nighttime", "light.x")));
    await flush();
    newer.resolve(cfg(scene("Nighttime", "light.x", ["light.x"])));
    await flush();

    expect(store.areaConfigs.get("kitchen")?.scenes[0].overlap_entities).toEqual(["light.x"]);
  });

  it("re-reads a scope after its in-flight save lands, not before", async () => {
    // Two quick list actions: a delete in the house (save still in flight), then
    // one in the kitchen. The house's save answer can predate the kitchen's.
    const { store } = makeStore();
    store.house = cfg(scene("Nighttime", "light.x", ["light.x"]), scene("Other", "light.z"));
    store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
    const houseSave = deferred<any>();
    vi.spyOn(api, "saveHouse").mockReturnValue(houseSave.promise);
    vi.spyOn(api, "saveArea").mockResolvedValue({ ok: true, config: cfg() } as any);
    const getHouse = vi
      .spyOn(api, "getHouse")
      .mockResolvedValue(cfg(scene("Nighttime", "light.x")));
    vi.spyOn(api, "getArea").mockResolvedValue(cfg());

    const houseDelete = store.mutate(house, cfg(scene("Nighttime", "light.x", ["light.x"])));
    await store.mutate(kitchen, cfg());
    houseSave.resolve({ ok: true, config: cfg(scene("Nighttime", "light.x", ["light.x"])) });
    await houseDelete;
    await flush();

    expect(getHouse).toHaveBeenCalledTimes(1);
    expect(store.house.scenes[0].overlap_entities).toEqual([]);
  });

  it("applies a re-read that was in flight while a save to that scope failed", async () => {
    const { store } = makeStore();
    store.house = cfg(scene("Nighttime", "light.x"));
    store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
    const response = deferred<ScopeConfig>();
    vi.spyOn(api, "getHouse").mockResolvedValue(cfg());
    vi.spyOn(api, "getArea").mockReturnValue(response.promise);
    pushChange(store, house);
    await flush();
    vi.spyOn(api, "saveArea").mockRejectedValue(new Error("save failed"));
    expect(await store.mutate(kitchen, cfg())).toBe(false);

    response.resolve(cfg(scene("Nighttime", "light.x")));
    await flush();

    expect(store.areaConfigs.get("kitchen")?.scenes[0].overlap_entities).toEqual([]);
  });

  it("does not replace a save's optimistic config with a re-read that lands while it saves", async () => {
    const { store } = makeStore();
    store.house = cfg(scene("Nighttime", "light.x"));
    store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
    vi.spyOn(api, "getHouse").mockResolvedValue(cfg());
    const read = deferred<ScopeConfig>();
    vi.spyOn(api, "getArea")
      .mockReturnValueOnce(read.promise)
      .mockResolvedValue(cfg(scene("Edit", "light.x")));
    pushChange(store, house);
    await flush();
    const save = deferred<any>();
    vi.spyOn(api, "saveArea").mockReturnValue(save.promise);
    const saving = store.mutate(kitchen, cfg(scene("Edit", "light.x")));

    read.resolve(cfg(scene("Nighttime", "light.x")));
    await flush();

    expect(store.areaConfigs.get("kitchen")?.scenes.map((s) => s.name)).toEqual(["Edit"]);
    save.resolve({ ok: true, config: cfg(scene("Edit", "light.x")) });
    await saving;
  });

  it("drops a re-read that was in flight when an undo result for that scope landed", async () => {
    const { store } = makeStore();
    store.house = cfg(scene("Nighttime", "light.x"));
    store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
    vi.spyOn(api, "getHouse").mockResolvedValue(cfg());
    const read = deferred<ScopeConfig>();
    vi.spyOn(api, "getArea").mockReturnValue(read.promise);
    pushChange(store, house);
    await flush();
    vi.spyOn(api, "undoChange").mockResolvedValue({
      ok: true,
      scope_kind: "area",
      scope_id: "kitchen",
      config: cfg(scene("Undone", "light.z")),
    } as any);
    await store.undo();

    read.resolve(cfg(scene("Nighttime", "light.x")));
    await flush();

    expect(store.areaConfigs.get("kitchen")?.scenes.map((s) => s.name)).toEqual(["Undone"]);
  });

  it("drops a sharer's re-read that lands after a newer reload of that scope", async () => {
    const { store } = makeStore();
    store.house = cfg(scene("Nighttime", "light.x"));
    store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
    vi.spyOn(api, "getHouse").mockResolvedValue(cfg());
    const older = deferred<ScopeConfig>();
    vi.spyOn(api, "getArea")
      .mockReturnValueOnce(older.promise)
      .mockResolvedValueOnce(cfg(scene("Newer", "light.q")));
    pushChange(store, house);
    await flush();
    pushChange(store, kitchen);
    await flush();
    expect(store.areaConfigs.get("kitchen")?.scenes[0].name).toBe("Newer");

    older.resolve(cfg(scene("Nighttime", "light.x")));
    await flush();

    expect(store.areaConfigs.get("kitchen")?.scenes[0].name).toBe("Newer");
  });

  it("drops a reload that lands after a save result for that scope was applied", async () => {
    const { store } = makeStore();
    store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x"))]]);
    const older = deferred<ScopeConfig>();
    vi.spyOn(api, "getArea").mockReturnValue(older.promise);
    const reloading = store.reloadScope(kitchen);
    vi.spyOn(api, "saveArea").mockResolvedValue({
      ok: true,
      config: cfg(scene("Saved edit", "light.x")),
    } as any);
    expect(await store.mutate(kitchen, cfg(scene("Saved edit", "light.x")))).toBe(true);

    older.resolve(cfg(scene("Nighttime", "light.x")));
    await reloading;

    expect(store.areaConfigs.get("kitchen")?.scenes.map((s) => s.name)).toEqual(["Saved edit"]);
  });

  it("returns false from a failed save without waiting for a re-read queued behind it", async () => {
    const { store } = makeStore();
    store.house = cfg(scene("Nighttime", "light.x"));
    store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
    const kitchenSave = deferred<any>();
    vi.spyOn(api, "saveArea").mockReturnValue(kitchenSave.promise);
    vi.spyOn(api, "saveHouse").mockResolvedValue({ ok: true, config: cfg() } as any);
    const read = deferred<ScopeConfig>();
    const getArea = vi.spyOn(api, "getArea").mockReturnValue(read.promise);
    let result: boolean | undefined;
    const saving = store.mutate(kitchen, cfg(scene("Nighttime", "light.x"))).then((r) => {
      result = r;
    });
    await store.mutate(house, cfg());

    kitchenSave.resolve(Promise.reject(new Error("save failed")));
    await flush();

    expect(getArea).toHaveBeenCalledTimes(1);
    expect(result).toBe(false);
    read.resolve(cfg(scene("Nighttime", "light.x")));
    await saving;
  });

  describe("when a scope is removed", () => {
    it("drops a re-read of it that was in flight", async () => {
      const { store } = makeStore();
      store.house = cfg(scene("Nighttime", "light.x"));
      store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
      vi.spyOn(api, "getHouse").mockResolvedValue(cfg());
      const read = deferred<ScopeConfig>();
      vi.spyOn(api, "getArea").mockReturnValue(read.promise);
      pushChange(store, house);
      await flush();
      store.forgetScope(kitchen);
      vi.spyOn(api, "listAreas").mockResolvedValue([] as any);
      await store.refreshAreas();

      read.resolve(cfg(scene("Nighttime", "light.x")));
      await flush();

      expect(store.areaConfigs.has("kitchen")).toBe(false);
    });

    it("drops a re-read of it waiting behind its in-flight save", async () => {
      const { store } = makeStore();
      store.house = cfg(scene("Nighttime", "light.x"));
      store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
      const kitchenSave = deferred<any>();
      vi.spyOn(api, "saveArea").mockReturnValue(kitchenSave.promise);
      vi.spyOn(api, "saveHouse").mockResolvedValue({ ok: true, config: cfg() } as any);
      const getArea = vi.spyOn(api, "getArea").mockResolvedValue(cfg());
      const saving = store.mutate(kitchen, cfg(scene("Nighttime", "light.x")));
      await store.mutate(house, cfg());

      store.forgetScope(kitchen);
      kitchenSave.resolve(Promise.reject(new Error("unknown area")));
      await saving;
      await flush();

      expect(getArea).not.toHaveBeenCalled();
    });
  });

  describe("a sharer held back while its editor is open", () => {
    it("is re-read when the editor closes without saving", async () => {
      const { store } = makeStore();
      let locked: Scope | null = kitchen;
      lockOnly(store, () => locked);
      store.house = cfg(scene("Nighttime", "light.x"));
      store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
      vi.spyOn(api, "saveHouse").mockResolvedValue({ ok: true, config: cfg() } as any);
      const getArea = vi
        .spyOn(api, "getArea")
        .mockResolvedValue(cfg(scene("Nighttime", "light.x")));
      await store.mutate(house, cfg());
      expect(getArea).not.toHaveBeenCalled();

      locked = null;
      await store.editorClosed(kitchen);

      expect(getArea).toHaveBeenCalledTimes(1);
      expect(store.areaConfigs.get("kitchen")?.scenes[0].overlap_entities).toEqual([]);
      expect(store.isScopeStale(kitchen)).toBe(false);
    });

    it("is re-read on close when its editor opened while the read was in flight", async () => {
      const { store } = makeStore();
      let locked: Scope | null = null;
      lockOnly(store, () => locked);
      store.house = cfg(scene("Nighttime", "light.x"));
      store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
      const response = deferred<ScopeConfig>();
      vi.spyOn(api, "getHouse").mockResolvedValue(cfg());
      const getArea = vi.spyOn(api, "getArea").mockReturnValueOnce(response.promise);
      pushChange(store, house);
      await flush();
      locked = kitchen;
      response.resolve(cfg(scene("Nighttime", "light.x")));
      await flush();

      locked = null;
      getArea.mockResolvedValue(cfg(scene("Nighttime", "light.x")));
      await store.editorClosed(kitchen);

      expect(getArea).toHaveBeenCalledTimes(2);
      expect(store.areaConfigs.get("kitchen")?.scenes[0].overlap_entities).toEqual([]);
    });

    it("is not re-read again after its own save (the save's result is authoritative)", async () => {
      const { store } = makeStore();
      let locked: Scope | null = kitchen;
      lockOnly(store, () => locked);
      store.house = cfg(scene("Nighttime", "light.x"));
      store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
      vi.spyOn(api, "saveHouse").mockResolvedValue({ ok: true, config: cfg() } as any);
      vi.spyOn(api, "saveArea").mockResolvedValue({
        ok: true,
        config: cfg(scene("Nighttime", "light.x")),
      } as any);
      const getArea = vi.spyOn(api, "getArea");
      await store.mutate(house, cfg());

      await store.mutate(kitchen, cfg(scene("Nighttime", "light.x")));
      locked = null;
      await store.editorClosed(kitchen);

      expect(getArea).not.toHaveBeenCalled();
    });

    it("is not re-read on a later close once a stale-scope close has reloaded it", async () => {
      const { store } = makeStore();
      let locked: Scope | null = kitchen;
      lockOnly(store, () => locked);
      store.house = cfg(scene("Nighttime", "light.x"));
      store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
      vi.spyOn(api, "saveHouse").mockResolvedValue({ ok: true, config: cfg() } as any);
      const getArea = vi
        .spyOn(api, "getArea")
        .mockResolvedValue(cfg(scene("Nighttime", "light.x")));
      await store.mutate(house, cfg());
      pushChange(store, kitchen);
      await flush();
      locked = null;
      await store.editorClosed(kitchen);
      const afterFirstClose = getArea.mock.calls.length;

      await store.editorClosed(kitchen);

      expect(getArea.mock.calls.length).toBe(afterFirstClose);
    });

    it("is not re-read after an undo result for it is applied", async () => {
      const { store } = makeStore();
      let locked: Scope | null = kitchen;
      lockOnly(store, () => locked);
      store.house = cfg(scene("Nighttime", "light.x"));
      store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
      vi.spyOn(api, "saveHouse").mockResolvedValue({ ok: true, config: cfg() } as any);
      const getArea = vi.spyOn(api, "getArea").mockResolvedValue(cfg());
      vi.spyOn(api, "getHouse").mockResolvedValue(cfg());
      await store.mutate(house, cfg());
      vi.spyOn(api, "undoChange").mockResolvedValue({
        ok: true,
        scope_kind: "area",
        scope_id: "kitchen",
        config: cfg(),
      } as any);
      await store.undo();

      locked = null;
      await store.editorClosed(kitchen);

      expect(getArea).not.toHaveBeenCalled();
    });

    it("is not re-read after the scope is removed", async () => {
      const { store } = makeStore();
      let locked: Scope | null = kitchen;
      lockOnly(store, () => locked);
      store.house = cfg(scene("Nighttime", "light.x"));
      store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
      vi.spyOn(api, "saveHouse").mockResolvedValue({ ok: true, config: cfg() } as any);
      const getArea = vi.spyOn(api, "getArea");
      await store.mutate(house, cfg());

      store.forgetScope(kitchen);
      locked = null;
      await store.editorClosed(kitchen);

      expect(getArea).not.toHaveBeenCalled();
    });

    it("is still re-read after clearStale, which only drops the changed-elsewhere mark", async () => {
      const { store } = makeStore();
      let locked: Scope | null = kitchen;
      lockOnly(store, () => locked);
      store.house = cfg(scene("Nighttime", "light.x"));
      store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x", ["light.x"]))]]);
      vi.spyOn(api, "saveHouse").mockResolvedValue({ ok: true, config: cfg() } as any);
      const getArea = vi
        .spyOn(api, "getArea")
        .mockResolvedValue(cfg(scene("Nighttime", "light.x")));
      await store.mutate(house, cfg());

      store.clearStale(kitchen);
      locked = null;
      await store.editorClosed(kitchen);

      expect(getArea).toHaveBeenCalledTimes(1);
    });

    it("is not re-read while its own save is in flight (the editor's move flow)", async () => {
      const { store } = makeStore();
      let locked: Scope | null = house;
      lockOnly(store, () => locked);
      store.house = cfg(scene("Nighttime", "light.x"));
      store.areaConfigs = new Map([["kitchen", cfg()]]);
      vi.spyOn(api, "saveArea").mockResolvedValue({
        ok: true,
        config: cfg(scene("Nighttime", "light.x", ["light.x"])),
      } as any);
      const getHouse = vi.spyOn(api, "getHouse").mockResolvedValue(cfg());
      vi.spyOn(api, "getArea").mockResolvedValue(cfg(scene("Nighttime", "light.x")));
      await store.mutate(kitchen, cfg(scene("Nighttime", "light.x")));
      expect(getHouse).not.toHaveBeenCalled();

      locked = null;
      const save = deferred<any>();
      vi.spyOn(api, "saveHouse").mockReturnValue(save.promise);
      const deleting = store.mutate(house, cfg());
      await store.editorClosed(house);
      save.resolve({ ok: true, config: cfg() });
      expect(await deleting).toBe(true);

      expect(getHouse).not.toHaveBeenCalled();
      expect(store.house.scenes).toEqual([]);
    });

    it("is re-read once its own save fails", async () => {
      const { store } = makeStore();
      let locked: Scope | null = house;
      lockOnly(store, () => locked);
      store.house = cfg(scene("Nighttime", "light.x"));
      store.areaConfigs = new Map([["kitchen", cfg()]]);
      vi.spyOn(api, "saveArea").mockResolvedValue({
        ok: true,
        config: cfg(scene("Nighttime", "light.x", ["light.x"])),
      } as any);
      const getHouse = vi
        .spyOn(api, "getHouse")
        .mockResolvedValue(cfg(scene("Nighttime", "light.x", ["light.x"])));
      await store.mutate(kitchen, cfg(scene("Nighttime", "light.x")));

      locked = null;
      vi.spyOn(api, "saveHouse").mockRejectedValue(new Error("save failed"));
      expect(await store.mutate(house, cfg())).toBe(false);
      await flush();

      expect(getHouse).toHaveBeenCalledTimes(1);
      expect(store.house.scenes[0].overlap_entities).toEqual(["light.x"]);
    });
  });

  it("closing the editor on a scope changed in another tab loads that change once", async () => {
    const { store } = makeStore();
    let locked: Scope | null = kitchen;
    lockOnly(store, () => locked);
    store.areaConfigs = new Map([["kitchen", cfg(scene("Nighttime", "light.x"))]]);
    const getArea = vi.spyOn(api, "getArea").mockResolvedValue(cfg());
    pushChange(store, kitchen);
    await flush();
    expect(store.isScopeStale(kitchen)).toBe(true);
    expect(store.areaConfigs.get("kitchen")?.scenes).toHaveLength(1);
    getArea.mockClear();

    locked = null;
    await store.editorClosed(kitchen);

    expect(getArea).toHaveBeenCalledTimes(1);
    expect(store.areaConfigs.get("kitchen")?.scenes).toEqual([]);
    expect(store.isScopeStale(kitchen)).toBe(false);
  });

  describe("when the changed scope's previous config is unknown", () => {
    it("refreshes a sharer even though the change removed every action", async () => {
      const { store } = makeStore();
      store.house = cfg(scene("Nighttime", "light.x", ["light.x"]));
      vi.spyOn(api, "getArea").mockResolvedValue(cfg());
      const getHouse = vi
        .spyOn(api, "getHouse")
        .mockResolvedValue(cfg(scene("Nighttime", "light.x")));

      pushChange(store, kitchen);

      await vi.waitFor(() => expect(store.house.scenes[0].overlap_entities).toEqual([]));
      expect(getHouse).toHaveBeenCalledTimes(1);
    });

    it("re-reads every other cached scope, holding back one whose editor is open", async () => {
      const { store } = makeStore();
      lockOnly(store, () => ({ kind: "floor", id: "upstairs" }));
      store.house = cfg();
      store.floorConfigs = new Map([
        ["ground", cfg(scene("Evening", "light.y"))],
        ["upstairs", cfg(scene("Evening", "light.z"))],
      ]);
      vi.spyOn(api, "getArea").mockResolvedValue(cfg());
      const getHouse = vi.spyOn(api, "getHouse").mockResolvedValue(cfg());
      const getFloor = vi.spyOn(api, "getFloor").mockResolvedValue(cfg());

      pushChange(store, kitchen);
      await flush();

      expect(getHouse).toHaveBeenCalledTimes(1);
      expect(getFloor.mock.calls.map((c) => c[1])).toEqual(["ground"]);
    });
  });
});
