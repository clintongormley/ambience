import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type {
  AreaListItem,
  ConditionInfo,
  ExposedAction,
  FloorListItem,
  PeriodStoreView,
  SceneCategory,
  ScopeConfig,
} from "../frontend/src/types";

// Mock the api module — same shape as test/scopes-view.test.ts, so the store
// under test and the view tests exercise identical seams.
vi.mock("../frontend/src/api", () => ({
  listAreas: vi.fn(),
  getArea: vi.fn(),
  saveArea: vi.fn(),
  listFloors: vi.fn(),
  getFloor: vi.fn(),
  saveFloor: vi.fn(),
  getHouse: vi.fn(),
  saveHouse: vi.fn(),
  setScopeEnabled: vi.fn(async () => ({ ok: true })),
  listSwitches: vi.fn(async () => []),
  listConditions: vi.fn(),
  listExposedActions: vi.fn(),
  listCategories: vi.fn(async () => []),
  getServiceSchema: vi.fn(async () => ({})),
  listPeriods: vi.fn(),
  listLuxRanges: vi.fn(async () => ({ builtins: {}, custom: {}, hidden: [] })),
  getDayConfig: vi.fn(async () => ({ workday_sensor: null, workday_calendar: null })),
  getWeatherConfig: vi.fn(async () => ({ entity: null, groups: [] })),
  applyScenes: vi.fn(async () => ({ ok: true })),
  runSceneActions: vi.fn(async () => ({ ran: 1, scene_name: "R" })),
}));

import * as api from "../frontend/src/api";
import { ScopeStore } from "../frontend/src/views/scope-store";

const conditions: ConditionInfo[] = [
  { name: "mode", description: "", predicate_help: "", input: "text", priority: 0 },
];

const actions: ExposedAction[] = [
  { id: "light.turn_on", label: "Set light", visible_fields: [], defaults: {} },
  { id: "cover.set_position", label: "Set cover", visible_fields: [], defaults: {} },
];

const categories: SceneCategory[] = [{ id: "lights", name: "Lights", color: null, icon: null }];

const periods: PeriodStoreView = { builtins: {}, custom: {}, hidden: [] };

function makeHost() {
  return {
    addController: vi.fn(),
    removeController: vi.fn(),
    requestUpdate: vi.fn(),
    updateComplete: Promise.resolve(true),
    isConnected: true,
    hass: {
      states: {} as Record<string, { state?: string; attributes?: Record<string, unknown> }>,
      callService: vi.fn().mockResolvedValue(undefined),
      connection: { subscribeEvents: vi.fn().mockResolvedValue(vi.fn()) },
    },
  };
}

type Host = ReturnType<typeof makeHost>;

function makeStore(host: Host = makeHost()): { store: ScopeStore; host: Host } {
  return { store: new ScopeStore(host as any), host };
}

/** Flush pending microtasks plus one macrotask tick. */
const tick = () => new Promise((r) => setTimeout(r, 0));

const baseAreas: AreaListItem[] = [
  { area_id: "living_room", name: "Living Room" },
  { area_id: "bedroom", name: "Bedroom" },
];

const baseFloors: FloorListItem[] = [
  { floor_id: "upstairs", name: "Upstairs" },
  { floor_id: "ground", name: "Ground" },
];

function mockScopes() {
  vi.mocked(api.listAreas).mockResolvedValue(baseAreas);
  vi.mocked(api.getArea).mockImplementation(async () => ({ scenes: [] }));
  vi.mocked(api.listFloors).mockResolvedValue(baseFloors);
  vi.mocked(api.getFloor).mockImplementation(async () => ({ scenes: [] }));
  vi.mocked(api.getHouse).mockResolvedValue({ scenes: [] });
  vi.mocked(api.listSwitches).mockResolvedValue([]);
}

function mockStatic() {
  vi.mocked(api.listConditions).mockResolvedValue(conditions);
  vi.mocked(api.listExposedActions).mockResolvedValue(actions);
  vi.mocked(api.listPeriods).mockResolvedValue(periods);
  vi.mocked(api.listLuxRanges).mockResolvedValue({ builtins: {}, custom: {}, hidden: [] });
  vi.mocked(api.getDayConfig).mockResolvedValue({ workday_sensor: null, workday_calendar: null });
  vi.mocked(api.getWeatherConfig).mockResolvedValue({ entity: null, groups: [] });
  vi.mocked(api.listCategories).mockResolvedValue(categories);
  vi.mocked(api.getServiceSchema).mockResolvedValue({});
}

describe("ScopeStore", () => {
  let connected: ScopeStore[];

  beforeEach(() => {
    vi.clearAllMocks();
    mockStatic();
    mockScopes();
    connected = [];
  });

  afterEach(() => {
    // Detach window listeners added by hostConnected so tests can't leak.
    for (const store of connected) store.hostDisconnected();
  });

  const connect = (store: ScopeStore) => {
    store.hostConnected();
    connected.push(store);
  };

  describe("construction and reactivity", () => {
    test("registers itself as a controller on the host", () => {
      const { store, host } = makeStore();
      expect(host.addController).toHaveBeenCalledWith(store);
    });

    test("assigning a tracked field requests a host update", () => {
      const { store, host } = makeStore();
      const calls = host.requestUpdate.mock.calls.length;
      store.categories = categories;
      expect(host.requestUpdate.mock.calls.length).toBe(calls + 1);
    });

    test("re-assigning the same value does not request an update", () => {
      const { store, host } = makeStore();
      store.categories = categories;
      const calls = host.requestUpdate.mock.calls.length;
      store.categories = categories;
      expect(host.requestUpdate.mock.calls.length).toBe(calls);
    });

    test("setting error requests a host update", () => {
      const { store, host } = makeStore();
      const calls = host.requestUpdate.mock.calls.length;
      store.error = "boom";
      expect(store.error).toBe("boom");
      expect(host.requestUpdate.mock.calls.length).toBe(calls + 1);
    });
  });

  describe("loadStatic", () => {
    test("populates the static config and marks it loaded", async () => {
      const { store } = makeStore();
      await store.loadStatic();
      expect(store.conditions).toEqual(conditions);
      expect(store.actions).toEqual(actions);
      expect(store.categories).toEqual(categories);
      expect(store.periods).toEqual(periods);
      expect(store.luxRanges).toEqual({ builtins: {}, custom: {}, hidden: [] });
      expect(store.dayConfig).toEqual({ workday_sensor: null, workday_calendar: null });
      expect(store.weatherConfig).toEqual({ entity: null, groups: [] });
      expect(store.staticLoaded).toBe(true);
      expect(store.error).toBe("");
    });

    test("loads a schema per exposed action", async () => {
      vi.mocked(api.getServiceSchema).mockImplementation(async (_hass, id) => ({
        name: `schema for ${id}`,
        fields: {},
      }));
      const { store } = makeStore();
      await store.loadStatic();
      expect(Object.keys(store.schemas).sort()).toEqual(["cover.set_position", "light.turn_on"]);
    });

    test("skips services whose schema fetch fails, keeping the rest", async () => {
      vi.mocked(api.getServiceSchema).mockImplementation(async (_hass, id) => {
        if (id === "light.turn_on") throw new Error("nope");
        return { name: "ok", fields: {} };
      });
      const { store } = makeStore();
      await store.loadStatic();
      expect(Object.keys(store.schemas)).toEqual(["cover.set_position"]);
    });

    test("surfaces a thrown Error's message via error and leaves staticLoaded false", async () => {
      vi.mocked(api.listConditions).mockRejectedValue(new Error("boom"));
      const { store } = makeStore();
      await store.loadStatic();
      expect(store.error).toBe("boom");
      expect(store.staticLoaded).toBe(false);
    });

    test("stringifies a non-Error thrown value", async () => {
      vi.mocked(api.listConditions).mockRejectedValue("bang");
      const { store } = makeStore();
      await store.loadStatic();
      expect(store.error).toBe("bang");
    });

    test("bails out silently when the host disconnects before the fetch resolves", async () => {
      const { store, host } = makeStore();
      const pending = store.loadStatic();
      host.isConnected = false;
      await pending;
      expect(store.conditions).toEqual([]);
      expect(store.staticLoaded).toBe(false);
    });

    test("bails out of schema application when the host disconnects mid-load", async () => {
      const { store, host } = makeStore();
      vi.mocked(api.getServiceSchema).mockImplementation(async () => {
        host.isConnected = false;
        return { name: "late", fields: {} };
      });
      await store.loadStatic();
      expect(store.schemas).toEqual({});
    });
  });

  describe("window change events", () => {
    test("ambience-exposed-actions-changed refetches actions and schemas", async () => {
      const { store } = makeStore();
      connect(store);
      const next: ExposedAction[] = [
        { id: "switch.turn_on", label: "Switch", visible_fields: [], defaults: {} },
      ];
      vi.mocked(api.listExposedActions).mockResolvedValue(next);
      window.dispatchEvent(new Event("ambience-exposed-actions-changed"));
      await tick();
      expect(store.actions).toEqual(next);
      expect(Object.keys(store.schemas)).toEqual(["switch.turn_on"]);
    });

    test("ambience-categories-changed refetches categories", async () => {
      const { store } = makeStore();
      connect(store);
      const next: SceneCategory[] = [{ id: "covers", name: "Covers", color: null, icon: null }];
      vi.mocked(api.listCategories).mockResolvedValue(next);
      window.dispatchEvent(new Event("ambience-categories-changed"));
      await tick();
      expect(store.categories).toEqual(next);
    });

    test("ambience-conditions-changed refetches the day and weather configs", async () => {
      const { store } = makeStore();
      connect(store);
      vi.mocked(api.getDayConfig).mockResolvedValue({
        workday_sensor: "binary_sensor.workday",
        workday_calendar: null,
      });
      vi.mocked(api.getWeatherConfig).mockResolvedValue({ entity: "weather.home", groups: [] });
      window.dispatchEvent(new Event("ambience-conditions-changed"));
      await tick();
      expect(store.dayConfig?.workday_sensor).toBe("binary_sensor.workday");
      expect(store.weatherConfig?.entity).toBe("weather.home");
    });

    test("a refetch failure after a change event is silently swallowed", async () => {
      const { store } = makeStore();
      connect(store);
      await store.loadStatic();
      vi.mocked(api.listCategories).mockRejectedValue(new Error("transient"));
      window.dispatchEvent(new Event("ambience-categories-changed"));
      await tick();
      expect(store.categories).toEqual(categories);
      expect(store.error).toBe("");
    });

    test("a change event resolving after disconnect is not applied", async () => {
      const { store, host } = makeStore();
      connect(store);
      vi.mocked(api.listCategories).mockImplementation(async () => {
        host.isConnected = false;
        return [{ id: "late", name: "Late", color: null, icon: null }];
      });
      window.dispatchEvent(new Event("ambience-categories-changed"));
      await tick();
      expect(store.categories).toEqual([]);
    });

    test("hostDisconnected removes the window listeners", async () => {
      const { store } = makeStore();
      connect(store);
      store.hostDisconnected();
      const calls = vi.mocked(api.listCategories).mock.calls.length;
      window.dispatchEvent(new Event("ambience-categories-changed"));
      await tick();
      expect(vi.mocked(api.listCategories).mock.calls.length).toBe(calls);
    });
  });

  describe("per-scope config refreshes", () => {
    test("refreshAreas loads each area's normalized config and marks areasLoaded", async () => {
      const { store } = makeStore();
      await store.refreshAreas();
      expect(store.areas).toEqual(baseAreas);
      expect(store.areaConfigs.get("living_room")).toEqual({ scenes: [] });
      expect(store.areaConfigs.get("bedroom")).toEqual({ scenes: [] });
      expect(store.areasLoaded).toBe(true);
    });

    test("refreshAreas reuses existing config references and only fetches new areas", async () => {
      const { store } = makeStore();
      await store.refreshAreas();
      const existing = store.areaConfigs.get("living_room");
      vi.mocked(api.listAreas).mockResolvedValue([
        ...baseAreas,
        { area_id: "attic", name: "Attic" },
      ]);
      vi.mocked(api.getArea).mockClear();
      await store.refreshAreas();
      expect(store.areaConfigs.get("living_room")).toBe(existing);
      expect(vi.mocked(api.getArea).mock.calls.map((c) => c[1])).toEqual(["attic"]);
    });

    test("refreshAreas failure surfaces the error but still settles areasLoaded", async () => {
      vi.mocked(api.listAreas).mockRejectedValue(new Error("areas down"));
      const { store } = makeStore();
      await store.refreshAreas();
      expect(store.error).toBe("areas down");
      expect(store.areasLoaded).toBe(true);
    });

    test("refreshAreas bails out when the host disconnects mid-fetch (areasLoaded stays false)", async () => {
      const { store, host } = makeStore();
      const pending = store.refreshAreas();
      host.isConnected = false;
      await pending;
      expect(store.areas).toEqual([]);
      expect(store.areasLoaded).toBe(false);
    });

    test("refreshFloors sorts floors by name and loads their configs", async () => {
      const { store } = makeStore();
      await store.refreshFloors();
      expect(store.floors.map((f) => f.floor_id)).toEqual(["ground", "upstairs"]);
      expect(store.floorConfigs.get("ground")).toEqual({ scenes: [] });
    });

    test("refreshFloors reuses existing config references across refreshes", async () => {
      const { store } = makeStore();
      await store.refreshFloors();
      const existing = store.floorConfigs.get("ground");
      vi.mocked(api.getFloor).mockClear();
      await store.refreshFloors();
      expect(store.floorConfigs.get("ground")).toBe(existing);
      expect(vi.mocked(api.getFloor)).not.toHaveBeenCalled();
    });

    test("refreshHouse normalizes a sparse config (missing scenes becomes [])", async () => {
      vi.mocked(api.getHouse).mockResolvedValue({} as ScopeConfig);
      const { store } = makeStore();
      await store.refreshHouse();
      expect(store.house).toEqual({ scenes: [] });
    });

    test("refreshHouse preserves a persisted enabled:false flag", async () => {
      vi.mocked(api.getHouse).mockResolvedValue({ scenes: [], enabled: false });
      const { store } = makeStore();
      await store.refreshHouse();
      expect(store.house).toEqual({ scenes: [], enabled: false });
    });

    test("refreshSwitches maps scope keys to switch entity ids", async () => {
      vi.mocked(api.listSwitches).mockResolvedValue([
        { scope_kind: "house", scope_id: null, entity_id: "switch.ambience_house" },
        { scope_kind: "area", scope_id: "living_room", entity_id: "switch.ambience_lr" },
        { scope_kind: "floor", scope_id: "ground", entity_id: "switch.ambience_ground" },
      ]);
      const { store } = makeStore();
      await store.refreshSwitches();
      expect(store.switchEntityIds.get("house")).toBe("switch.ambience_house");
      expect(store.switchEntityIds.get("area:living_room")).toBe("switch.ambience_lr");
      expect(store.switchEntityIds.get("floor:ground")).toBe("switch.ambience_ground");
    });

    test("refreshSwitches failure surfaces the error", async () => {
      vi.mocked(api.listSwitches).mockRejectedValue(new Error("switches down"));
      const { store } = makeStore();
      await store.refreshSwitches();
      expect(store.error).toBe("switches down");
    });
  });

  describe("getConfig / setConfig / reloadScope", () => {
    test("getConfig routes house, area and floor scopes to their stores", async () => {
      const { store } = makeStore();
      await Promise.all([store.refreshAreas(), store.refreshFloors(), store.refreshHouse()]);
      expect(store.getConfig({ kind: "house" })).toBe(store.house);
      expect(store.getConfig({ kind: "area", id: "living_room" })).toBe(
        store.areaConfigs.get("living_room"),
      );
      expect(store.getConfig({ kind: "floor", id: "ground" })).toBe(
        store.floorConfigs.get("ground"),
      );
    });

    test("setConfig replaces only the targeted scope's entry", async () => {
      const { store } = makeStore();
      await store.refreshAreas();
      const untouched = store.areaConfigs.get("bedroom");
      const next: ScopeConfig = { scenes: [{ name: "S", when: {}, actions: [], category: "g" }] };
      store.setConfig({ kind: "area", id: "living_room" }, next);
      expect(store.areaConfigs.get("living_room")).toBe(next);
      expect(store.areaConfigs.get("bedroom")).toBe(untouched);
    });

    test("setConfig on the house replaces the house config", () => {
      const { store } = makeStore();
      const next: ScopeConfig = { scenes: [], enabled: false };
      store.setConfig({ kind: "house" }, next);
      expect(store.house).toBe(next);
    });

    test("reloadScope re-fetches a single scope's config and normalizes it", async () => {
      const { store } = makeStore();
      await store.refreshAreas();
      vi.mocked(api.getArea).mockResolvedValue({ enabled: false } as ScopeConfig);
      await store.reloadScope({ kind: "area", id: "living_room" });
      expect(store.areaConfigs.get("living_room")).toEqual({ scenes: [], enabled: false });
      expect(store.areaConfigs.get("bedroom")).toEqual({ scenes: [] });
    });

    test("reloadScope failure surfaces the error", async () => {
      vi.mocked(api.getHouse).mockRejectedValue(new Error("house down"));
      const { store } = makeStore();
      await store.reloadScope({ kind: "house" });
      expect(store.error).toBe("house down");
    });

    test("reloadScope resolving after disconnect is not applied", async () => {
      const { store, host } = makeStore();
      await store.refreshHouse();
      vi.mocked(api.getHouse).mockImplementation(async () => {
        host.isConnected = false;
        return { scenes: [], enabled: false };
      });
      await store.reloadScope({ kind: "house" });
      expect(store.house).toEqual({ scenes: [] });
    });
  });
});
