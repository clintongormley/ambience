import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type {
  ConditionInfo,
  ExposedAction,
  PeriodStoreView,
  SceneCategory,
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
});
