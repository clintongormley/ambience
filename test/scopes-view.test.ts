import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import "../frontend/src/views/scopes-view";
import type {
  AreaListItem,
  ConditionInfo,
  DayConfig,
  ExposedAction,
  FloorListItem,
  PeriodStoreView,
  Scene,
  SceneCategory,
  Scope,
  ScopeConfig,
  ScopeSwitch,
  WeatherConfig,
} from "../frontend/src/types";

// Mock the api module — same shape as test/areas-list-view.test.ts but with
// the floor + house additions.
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
  listAutoTriggers: vi.fn(async () => ({ triggers: [], opaque: false })),
}));

import * as api from "../frontend/src/api";

const baseAreas: AreaListItem[] = [
  { area_id: "living_room", name: "Living Room" },
  { area_id: "bedroom", name: "Bedroom" },
];

const baseFloors: FloorListItem[] = [
  { floor_id: "ground", name: "Ground" },
  { floor_id: "upstairs", name: "Upstairs" },
];

const baseConfig: ScopeConfig = { scenes: [] };

const conditions: ConditionInfo[] = [
  { name: "mode", description: "", predicate_help: "", input: "text", priority: 0 },
  { name: "time_of_day", description: "", predicate_help: "", input: "time_of_day", priority: 200 },
];

const actions: ExposedAction[] = [
  { id: "light.turn_on", label: "Set light", visible_fields: [], defaults: {} },
];

const periods: PeriodStoreView = { builtins: {}, custom: {}, hidden: [] };

type FakeState = { state?: string; attributes?: Record<string, unknown> };

function makeFakeHass(states: Record<string, FakeState> = {}) {
  return {
    states,
    callService: vi.fn().mockResolvedValue(undefined),
    connection: {
      subscribeEvents: vi.fn().mockResolvedValue(vi.fn()),
    },
  };
}

type MountOpts = {
  areas?: AreaListItem[];
  floors?: FloorListItem[];
  areaConfigs?: Record<string, ScopeConfig>;
  floorConfigs?: Record<string, ScopeConfig>;
  houseConfig?: ScopeConfig;
  switches?: ScopeSwitch[];
  states?: Record<string, FakeState>;
  actions?: ExposedAction[];
  weatherConfig?: WeatherConfig;
  dayConfig?: DayConfig;
};

async function mount(opts: MountOpts = {}): Promise<any> {
  const areas = opts.areas ?? baseAreas;
  const floors = opts.floors ?? baseFloors;
  const areaConfigs = opts.areaConfigs ?? {};
  const floorConfigs = opts.floorConfigs ?? {};
  const houseConfig = opts.houseConfig ?? structuredClone(baseConfig);

  vi.mocked(api.listAreas).mockResolvedValue(areas);
  vi.mocked(api.getArea).mockImplementation(
    async (_hass, areaId) => areaConfigs[areaId] ?? structuredClone(baseConfig),
  );
  vi.mocked(api.listFloors).mockResolvedValue(floors);
  vi.mocked(api.getFloor).mockImplementation(
    async (_hass, floorId) => floorConfigs[floorId] ?? structuredClone(baseConfig),
  );
  vi.mocked(api.getHouse).mockResolvedValue(houseConfig);
  vi.mocked(api.listSwitches).mockResolvedValue(opts.switches ?? []);
  vi.mocked(api.listConditions).mockResolvedValue(conditions);
  vi.mocked(api.listExposedActions).mockResolvedValue(opts.actions ?? actions);
  vi.mocked(api.listPeriods).mockResolvedValue(periods);
  vi.mocked(api.getWeatherConfig).mockResolvedValue(
    opts.weatherConfig ?? { entity: null, groups: [] },
  );
  vi.mocked(api.getDayConfig).mockResolvedValue(
    opts.dayConfig ?? { workday_sensor: null, workday_calendar: null },
  );
  vi.mocked(api.saveArea).mockResolvedValue({ ok: true, config: baseConfig });
  vi.mocked(api.saveFloor).mockResolvedValue({ ok: true, config: baseConfig });
  vi.mocked(api.saveHouse).mockResolvedValue({ ok: true, config: baseConfig });

  const el: any = document.createElement("ambience-scopes-view");
  el.hass = makeFakeHass(opts.states ?? {});
  document.body.appendChild(el);
  await el.updateComplete;
  // Two ticks: connectedCallback awaits _loadStatic, then _refreshAreas etc.
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  return el;
}

describe("ambience-scopes-view", () => {
  let el: any;

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  afterEach(() => {
    el?.remove();
  });

  // --- row labels ---------------------------------------------------------

  test("renders the House row for the house scope", async () => {
    el = await mount();
    const houseRow = el.shadowRoot.querySelector(".scope-row.house");
    expect(houseRow).toBeTruthy();
    expect(houseRow.textContent).toContain("House");
  });

  test("renders one row per HA area by bare name (no redundant 'Area: ' prefix)", async () => {
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("Living Room");
    expect(el.shadowRoot.textContent).toContain("Bedroom");
    expect(el.shadowRoot.textContent).not.toContain("Area: ");
  });

  test("renders one row per HA floor by bare name (no redundant 'Floor: ' prefix)", async () => {
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("Ground");
    expect(el.shadowRoot.textContent).toContain("Upstairs");
    expect(el.shadowRoot.textContent).not.toContain("Floor: ");
  });

  test("no floor rows render when listFloors returns []", async () => {
    el = await mount({ floors: [] });
    const floorRows = el.shadowRoot.querySelectorAll(".scope-row.floor");
    expect(floorRows.length).toBe(0);
  });

  // --- scope icons --------------------------------------------------------

  const iconFor = (root: any, sel: string): string | null =>
    (
      root.shadowRoot.querySelector(`${sel} .scope-header ha-icon.scope-icon`) as Element
    )?.getAttribute("icon") ?? null;

  test("each scope header shows a per-kind default icon when HA has none", async () => {
    el = await mount();
    expect(iconFor(el, ".scope-row.house")).toBe("mdi:home");
    expect(iconFor(el, ".scope-row.floor[data-id='ground']")).toBe("mdi:layers");
    expect(iconFor(el, ".scope-row.area[data-id='living_room']")).toBe("mdi:texture-box");
  });

  test("scope headers use the icon assigned in HA's area/floor registry", async () => {
    el = await mount();
    el.hass = {
      ...el.hass,
      areas: { living_room: { icon: "mdi:sofa" } },
      floors: { ground: { icon: "mdi:home-floor-g" } },
    };
    await el.updateComplete;
    expect(iconFor(el, ".scope-row.area[data-id='living_room']")).toBe("mdi:sofa");
    expect(iconFor(el, ".scope-row.floor[data-id='ground']")).toBe("mdi:home-floor-g");
    // An area with no registry icon still falls back to the default.
    expect(iconFor(el, ".scope-row.area[data-id='bedroom']")).toBe("mdi:texture-box");
    // House has no HA registry entry → always the default.
    expect(iconFor(el, ".scope-row.house")).toBe("mdi:home");
  });

  // --- ordering -----------------------------------------------------------

  test("flat list order: House first, then floors, then areas", async () => {
    el = await mount();
    const rows = Array.from(el.shadowRoot.querySelectorAll(".scope-row")) as HTMLElement[];
    const kinds = rows.map((r) => {
      if (r.classList.contains("house")) return "house";
      if (r.classList.contains("floor")) return "floor";
      return "area";
    });
    // House row first
    expect(kinds[0]).toBe("house");
    // All floors before any areas
    const firstAreaIdx = kinds.indexOf("area");
    const lastFloorIdx = kinds.lastIndexOf("floor");
    expect(lastFloorIdx).toBeGreaterThan(0);
    expect(firstAreaIdx).toBeGreaterThan(lastFloorIdx);
  });

  // --- house --------------------------------------------------------------

  test("Exactly one house row is rendered", async () => {
    el = await mount();
    const houseRows = el.shadowRoot.querySelectorAll(".scope-row.house");
    expect(houseRows.length).toBe(1);
  });

  // --- mutation routing ---------------------------------------------------

  async function expandAndAddSceneToScope(scopeRowSelector: string, scope: Scope): Promise<void> {
    const row = el.shadowRoot.querySelector(scopeRowSelector) as HTMLElement;
    const header = row.querySelector(".scope-header") as HTMLElement;
    header.click();
    await el.updateComplete;
    const scenesList = row.querySelector("ambience-scenes-list")!;
    scenesList.dispatchEvent(
      new CustomEvent("add-scene", { detail: {}, bubbles: true, composed: true }),
    );
    await el.updateComplete;
    const editor = el.shadowRoot.querySelector("ambience-scene-editor")!;
    editor.dispatchEvent(
      new CustomEvent("save-scene", {
        detail: { scene: { name: "New scene", when: {}, actions: [] }, scope },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));
  }

  test("save-scene on an area routes to saveArea", async () => {
    el = await mount();
    await expandAndAddSceneToScope(".scope-row.area[data-id='living_room']", {
      kind: "area",
      id: "living_room",
    });
    expect(api.saveArea).toHaveBeenCalledWith(
      expect.anything(),
      "living_room",
      expect.objectContaining({
        scenes: [{ name: "New scene", when: {}, actions: [] }],
      }),
    );
    expect(api.saveFloor).not.toHaveBeenCalled();
    expect(api.saveHouse).not.toHaveBeenCalled();
  });

  test("save-scene on a floor routes to saveFloor", async () => {
    el = await mount();
    await expandAndAddSceneToScope(".scope-row.floor[data-id='ground']", {
      kind: "floor",
      id: "ground",
    });
    expect(api.saveFloor).toHaveBeenCalledWith(
      expect.anything(),
      "ground",
      expect.objectContaining({
        scenes: [{ name: "New scene", when: {}, actions: [] }],
      }),
    );
    expect(api.saveArea).not.toHaveBeenCalled();
    expect(api.saveHouse).not.toHaveBeenCalled();
  });

  test("save-scene on the house routes to saveHouse", async () => {
    el = await mount();
    await expandAndAddSceneToScope(".scope-row.house", { kind: "house" });
    expect(api.saveHouse).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        scenes: [{ name: "New scene", when: {}, actions: [] }],
      }),
    );
    expect(api.saveArea).not.toHaveBeenCalled();
    expect(api.saveFloor).not.toHaveBeenCalled();
  });

  // --- save failure handling ----------------------------------------------

  async function openEditorViaAdd(scope: Scope): Promise<any> {
    const row = el.shadowRoot.querySelector(
      `.scope-row.${scope.kind}${scope.kind === "house" ? "" : `[data-id='${scope.id}']`}`,
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row
      .querySelector("ambience-scenes-list")!
      .dispatchEvent(new CustomEvent("add-scene", { detail: {}, bubbles: true, composed: true }));
    await el.updateComplete;
    return el.shadowRoot.querySelector("ambience-scene-editor");
  }

  function dispatchSave(editor: any, scope: Scope, name = "X"): void {
    editor.dispatchEvent(
      new CustomEvent("save-scene", {
        detail: { scene: { name, when: {}, actions: [] }, scope },
        bubbles: true,
        composed: true,
      }),
    );
  }

  test("a failed scene save keeps the editor open and surfaces the error inside it", async () => {
    vi.mocked(api.saveArea).mockRejectedValueOnce(new Error("backend says no"));
    el = await mount({ areaConfigs: { living_room: { scenes: [] } } });
    const scope: Scope = { kind: "area", id: "living_room" };
    const editor = await openEditorViaAdd(scope);
    dispatchSave(editor, scope);
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    // The editor stays open so the user's draft isn't lost...
    expect(editor.open).toBe(true);
    // ...and the failure reason is shown inside the editor, not just behind it.
    expect(editor.saveError).toContain("backend says no");
  });

  test("a successful scene save closes the editor", async () => {
    el = await mount({ areaConfigs: { living_room: { scenes: [] } } });
    const scope: Scope = { kind: "area", id: "living_room" };
    const editor = await openEditorViaAdd(scope);
    dispatchSave(editor, scope);
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(editor.open).toBe(false);
  });

  test("a re-entrant save while one is in flight is ignored (no double-submit)", async () => {
    let resolveSave: (v: { ok: true; config: ScopeConfig }) => void = () => {};
    vi.mocked(api.saveArea).mockReturnValueOnce(
      new Promise((r) => {
        resolveSave = r;
      }),
    );
    el = await mount({ areaConfigs: { living_room: { scenes: [] } } });
    const scope: Scope = { kind: "area", id: "living_room" };
    const editor = await openEditorViaAdd(scope);

    // Two rapid Save clicks before the first mutation resolves.
    dispatchSave(editor, scope);
    dispatchSave(editor, scope);
    await new Promise((r) => setTimeout(r, 0));

    resolveSave({ ok: true, config: { scenes: [] } });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(api.saveArea).toHaveBeenCalledTimes(1);
  });

  // --- cross-scope move ---------------------------------------------------

  async function editSceneViaEditor(
    scopeRowSelector: string,
    index: number,
    detail: { scene: Scene; scope: Scope },
  ): Promise<void> {
    const row = el.shadowRoot.querySelector(scopeRowSelector) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    const scenesList = row.querySelector("ambience-scenes-list")!;
    scenesList.dispatchEvent(
      new CustomEvent("edit-scene", { detail: { index }, bubbles: true, composed: true }),
    );
    await el.updateComplete;
    const editor = el.shadowRoot.querySelector("ambience-scene-editor")!;
    editor.dispatchEvent(new CustomEvent("save-scene", { detail, bubbles: true, composed: true }));
    await new Promise((r) => setTimeout(r, 0));
  }

  test("editing a scene to a different scope adds to the new and removes from the old", async () => {
    const scene: Scene = { name: "R", when: {}, actions: [] };
    el = await mount({ areaConfigs: { living_room: { scenes: [scene] } } });
    await editSceneViaEditor(".scope-row.area[data-id='living_room']", 0, {
      scene,
      scope: { kind: "area", id: "bedroom" },
    });
    // Added to bedroom...
    expect(api.saveArea).toHaveBeenCalledWith(
      expect.anything(),
      "bedroom",
      expect.objectContaining({ scenes: [expect.objectContaining({ name: "R" })] }),
    );
    // ...and removed from living_room.
    expect(api.saveArea).toHaveBeenCalledWith(
      expect.anything(),
      "living_room",
      expect.objectContaining({ scenes: [] }),
    );
  });

  test("a failed move to a new scope leaves the scene in its original scope", async () => {
    const scene: Scene = { name: "R", when: {}, actions: [] };
    el = await mount({ areaConfigs: { living_room: { scenes: [scene] } } });
    // Target (house) save fails.
    vi.mocked(api.saveHouse).mockRejectedValueOnce(new Error("boom"));
    await editSceneViaEditor(".scope-row.area[data-id='living_room']", 0, {
      scene,
      scope: { kind: "house" },
    });
    // Target add was attempted...
    expect(api.saveHouse).toHaveBeenCalledTimes(1);
    // ...but since it failed, the source scene was NOT removed (no saveArea call).
    expect(api.saveArea).not.toHaveBeenCalled();
  });

  test("a scene moved to a new scope has its ordering metadata stripped", async () => {
    const scene: Scene = {
      name: "R",
      when: {},
      actions: [],
      priority: 50,
      pinned: true,
      shadowed_by: 1,
    };
    el = await mount({ areaConfigs: { living_room: { scenes: [scene] } } });
    await editSceneViaEditor(".scope-row.area[data-id='living_room']", 0, {
      scene,
      scope: { kind: "house" },
    });
    const houseCall = vi.mocked(api.saveHouse).mock.calls.at(-1)!;
    const landed = (houseCall[1] as ScopeConfig).scenes[0] as Scene;
    expect(landed.priority).toBeUndefined();
    expect(landed.pinned).toBeUndefined();
    expect(landed.shadowed_by).toBeUndefined();
  });

  // --- subscriptions ------------------------------------------------------

  test("subscribes to both area_registry_updated and floor_registry_updated", async () => {
    el = await mount();
    const calls = vi.mocked(el.hass.connection.subscribeEvents).mock.calls;
    const eventTypes = calls.map((c: any) => c[1]);
    expect(eventTypes).toContain("area_registry_updated");
    expect(eventTypes).toContain("floor_registry_updated");
  });

  test("expanded scope body no longer renders the inline auto-triggers section", async () => {
    el = await mount();
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    expect(row.querySelector("ambience-auto-triggers-section")).toBeNull();
  });

  test("area_registry_updated remove clears that area's expanded/editing state", async () => {
    el = await mount();
    const subCall = vi.mocked(el.hass.connection.subscribeEvents);
    const areaCallback = subCall.mock.calls.find((c: any) => c[1] === "area_registry_updated")?.[0];
    if (!areaCallback) throw new Error("no area_registry_updated subscription");

    // Areas section is expanded by default — just expand the living_room row
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    expect(row.querySelector(".scope-body")).toBeTruthy();

    // Fire a remove event for living_room
    vi.mocked(api.listAreas).mockResolvedValue([baseAreas[1]]);
    areaCallback({ data: { action: "remove", area_id: "living_room" } });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(el.shadowRoot.textContent).not.toContain("Living Room");
  });

  test("floor_registry_updated remove clears that floor's expanded/editing state", async () => {
    el = await mount();
    const subCall = vi.mocked(el.hass.connection.subscribeEvents);
    const floorCallback = subCall.mock.calls.find(
      (c: any) => c[1] === "floor_registry_updated",
    )?.[0];
    if (!floorCallback) throw new Error("no floor_registry_updated subscription");

    // Floors section is expanded by default — just expand the ground row
    const row = el.shadowRoot.querySelector(".scope-row.floor[data-id='ground']") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;

    vi.mocked(api.listFloors).mockResolvedValue([baseFloors[1]]);
    floorCallback({ data: { action: "remove", floor_id: "ground" } });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(el.shadowRoot.textContent).not.toContain("Ground");
  });

  // --- expanded-scope persistence -----------------------------------------

  test("persists the expanded set to localStorage when a scope is toggled", async () => {
    el = await mount();
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    expect(JSON.parse(window.localStorage.getItem("ambience-expanded-scopes")!)).toContain(
      "area:living_room",
    );
  });

  test("drops a scope from localStorage when it is collapsed again", async () => {
    el = await mount();
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    const header = row.querySelector(".scope-header") as HTMLElement;
    header.click(); // expand
    await el.updateComplete;
    header.click(); // collapse
    await el.updateComplete;
    expect(JSON.parse(window.localStorage.getItem("ambience-expanded-scopes")!)).not.toContain(
      "area:living_room",
    );
  });

  test("restores expanded scopes from localStorage on mount", async () => {
    window.localStorage.setItem("ambience-expanded-scopes", JSON.stringify(["area:living_room"]));
    el = await mount();
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    expect(row.querySelector(".scope-body")).toBeTruthy();
    // A scope that wasn't stored stays collapsed.
    const house = el.shadowRoot.querySelector(".scope-row.house") as HTMLElement;
    expect(house.querySelector(".scope-body")).toBeFalsy();
  });

  // --- scene preservation (regression for the existing area behaviour) -----

  test("delete-scene on an area calls saveArea with the scene removed", async () => {
    const cfg: ScopeConfig = {
      scenes: [
        { name: "Scene A", when: {}, actions: [] },
        { name: "Scene B", when: {}, actions: [] },
      ],
    };
    el = await mount({ areaConfigs: { living_room: cfg } });

    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;

    const scenesList = row.querySelector("ambience-scenes-list")!;
    scenesList.dispatchEvent(
      new CustomEvent("delete-scene", {
        detail: { index: 0 },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));

    expect(api.saveArea).toHaveBeenCalledWith(
      expect.anything(),
      "living_room",
      expect.objectContaining({
        scenes: [{ name: "Scene B", when: {}, actions: [] }],
      }),
    );
  });

  // --- empty-state banners -------------------------------------------------

  test("shows the no-actions banner when no actions are configured", async () => {
    el = await mount({ actions: [] });
    expect(el.shadowRoot.querySelector('[data-test="no-actions-banner"]')).not.toBeNull();
    // The optional conditions hint is sequenced AFTER an action exists.
    expect(el.shadowRoot.querySelector('[data-test="conditions-hint-banner"]')).toBeNull();
  });

  test("the no-actions banner button opens settings on the actions tab", async () => {
    el = await mount({ actions: [] });
    let detail: any = null;
    el.addEventListener("ambience-open-settings", (e: CustomEvent) => {
      detail = e.detail;
    });
    (el.shadowRoot.querySelector('[data-test="setup-actions-btn"]') as HTMLElement).click();
    expect(detail).toEqual({ tab: "actions" });
  });

  test("hides the no-actions banner once at least one action exists", async () => {
    el = await mount(); // default mock has one action
    expect(el.shadowRoot.querySelector('[data-test="no-actions-banner"]')).toBeNull();
  });

  test("shows the conditions hint when actions exist but weather/workday are unconfigured", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector('[data-test="conditions-hint-banner"]')).not.toBeNull();
  });

  test("shows the conditions hint when only workday is unconfigured", async () => {
    el = await mount({
      weatherConfig: { entity: "weather.home", groups: [] },
      dayConfig: { workday_sensor: null, workday_calendar: null },
    });
    expect(el.shadowRoot.querySelector('[data-test="conditions-hint-banner"]')).not.toBeNull();
  });

  test("the conditions hint names both when neither weather nor workday is configured", async () => {
    el = await mount(); // default: both unconfigured
    const banner = el.shadowRoot.querySelector('[data-test="conditions-hint-banner"]');
    expect(banner.textContent).toContain("Workday & Weather");
  });

  test("the conditions hint names only Workday when weather is configured", async () => {
    el = await mount({
      weatherConfig: { entity: "weather.home", groups: [] },
      dayConfig: { workday_sensor: null, workday_calendar: null },
    });
    const banner = el.shadowRoot.querySelector('[data-test="conditions-hint-banner"]');
    expect(banner.textContent).toContain("Workday");
    expect(banner.textContent).not.toContain("Weather");
  });

  test("the conditions hint names only Weather when workday is configured", async () => {
    el = await mount({
      weatherConfig: { entity: null, groups: [] },
      dayConfig: { workday_sensor: "binary_sensor.workday", workday_calendar: null },
    });
    const banner = el.shadowRoot.querySelector('[data-test="conditions-hint-banner"]');
    expect(banner.textContent).toContain("Weather");
    expect(banner.textContent).not.toContain("Workday");
  });

  test("the conditions hint button opens settings on the conditions tab", async () => {
    el = await mount();
    let detail: any = null;
    el.addEventListener("ambience-open-settings", (e: CustomEvent) => {
      detail = e.detail;
    });
    (el.shadowRoot.querySelector('[data-test="setup-conditions-btn"]') as HTMLElement).click();
    expect(detail).toEqual({ tab: "conditions" });
  });

  test("hides the conditions hint when weather and workday are both configured", async () => {
    el = await mount({
      weatherConfig: { entity: "weather.home", groups: [] },
      dayConfig: { workday_sensor: "binary_sensor.workday", workday_calendar: null },
    });
    expect(el.shadowRoot.querySelector('[data-test="conditions-hint-banner"]')).toBeNull();
  });

  test("dismissing the conditions hint hides it and persists across remounts", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector('[data-test="conditions-hint-banner"]')).not.toBeNull();
    (el.shadowRoot.querySelector('[data-test="dismiss-conditions-hint"]') as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[data-test="conditions-hint-banner"]')).toBeNull();

    // Persisted via localStorage: a fresh mount stays dismissed.
    el.remove();
    el = await mount();
    expect(el.shadowRoot.querySelector('[data-test="conditions-hint-banner"]')).toBeNull();
  });

  test("hides the conditions hint live when weather + workday get configured", async () => {
    el = await mount(); // unconfigured → hint shown
    expect(el.shadowRoot.querySelector('[data-test="conditions-hint-banner"]')).not.toBeNull();
    // The user configures both in the settings modal, which broadcasts a change.
    vi.mocked(api.getWeatherConfig).mockResolvedValue({ entity: "weather.home", groups: [] });
    vi.mocked(api.getDayConfig).mockResolvedValue({
      workday_sensor: "binary_sensor.workday",
      workday_calendar: null,
    });
    window.dispatchEvent(new CustomEvent("ambience-conditions-changed"));
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[data-test="conditions-hint-banner"]')).toBeNull();
  });

  test("re-shows the conditions hint live when weather/workday are cleared", async () => {
    el = await mount({
      weatherConfig: { entity: "weather.home", groups: [] },
      dayConfig: { workday_sensor: "binary_sensor.workday", workday_calendar: null },
    });
    // Configured → hidden.
    expect(el.shadowRoot.querySelector('[data-test="conditions-hint-banner"]')).toBeNull();
    // Both configs are cleared again; the hint must come back (no sticky state).
    vi.mocked(api.getWeatherConfig).mockResolvedValue({ entity: null, groups: [] });
    vi.mocked(api.getDayConfig).mockResolvedValue({
      workday_sensor: null,
      workday_calendar: null,
    });
    window.dispatchEvent(new CustomEvent("ambience-conditions-changed"));
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[data-test="conditions-hint-banner"]')).not.toBeNull();
  });

  // --- duplicate ----------------------------------------------------------

  test("duplicate opens the editor with a clone and saves nothing until confirmed", async () => {
    const scene: Scene = { name: "Orig", when: {}, actions: [] };
    el = await mount({ areaConfigs: { living_room: { scenes: [scene] } } });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    const scenesList = row.querySelector("ambience-scenes-list")!;
    scenesList.dispatchEvent(
      new CustomEvent("duplicate-scene", { detail: { index: 0 }, bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const editor: any = el.shadowRoot.querySelector("ambience-scene-editor");
    expect(editor.open).toBe(true);
    expect(editor.scene).toEqual(scene); // equal-by-value clone
    expect(editor.scene).not.toBe(scene); // but not the same object
    expect(api.saveArea).not.toHaveBeenCalled();
  });

  test("editor gets sibling scene names for uniqueness, excluding the edited scene", async () => {
    const scenes: Scene[] = [
      { name: "Movie", when: {}, actions: [], category: "a" },
      { name: "Dinner", when: {}, actions: [], category: "a" },
      { name: "Bright", when: {}, actions: [], category: "b" },
    ];
    el = await mount({ areaConfigs: { living_room: { scenes } } });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row
      .querySelector("ambience-scenes-list")!
      .dispatchEvent(
        new CustomEvent("edit-scene", { detail: { index: 0 }, bubbles: true, composed: true }),
      );
    await el.updateComplete;

    const editor: any = el.shadowRoot.querySelector("ambience-scene-editor");
    const takenA = editor.takenNames.get("area:living_room\u0000a");
    // Sibling in the same category is present; the edited scene itself is not.
    expect(takenA.has("dinner")).toBe(true);
    expect(takenA.has("movie")).toBe(false);
    // A different category is keyed separately.
    expect(editor.takenNames.get("area:living_room\u0000b").has("bright")).toBe(true);
  });

  test("editor gets all names (none excluded) when adding a new scene", async () => {
    const scenes: Scene[] = [{ name: "Movie", when: {}, actions: [], category: "a" }];
    el = await mount({ areaConfigs: { living_room: { scenes } } });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row
      .querySelector("ambience-scenes-list")!
      .dispatchEvent(new CustomEvent("add-scene", { bubbles: true, composed: true }));
    await el.updateComplete;

    const editor: any = el.shadowRoot.querySelector("ambience-scene-editor");
    expect(editor.takenNames.get("area:living_room\u0000a").has("movie")).toBe(true);
  });

  test("per-category add-scene opens a new scene defaulting to that category", async () => {
    const scenes: Scene[] = [{ name: "X", when: {}, actions: [], category: "a" }];
    el = await mount({ areaConfigs: { living_room: { scenes } } });
    el._categories = [
      { id: "a", name: "Awnings" },
      { id: "b", name: "Blinds" },
    ];
    await el.updateComplete;
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row
      .querySelector("ambience-scenes-list")!
      .dispatchEvent(
        new CustomEvent("add-scene", { detail: { category: "b" }, bubbles: true, composed: true }),
      );
    await el.updateComplete;
    const editor: any = el.shadowRoot.querySelector("ambience-scene-editor");
    expect(editor.scene.category).toBe("b");
  });

  test("add-scene without a category falls back to the first category alphabetically", async () => {
    const scenes: Scene[] = [{ name: "X", when: {}, actions: [], category: "b" }];
    el = await mount({ areaConfigs: { living_room: { scenes } } });
    el._categories = [
      { id: "b", name: "Blinds" },
      { id: "a", name: "Awnings" },
    ];
    await el.updateComplete;
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row
      .querySelector("ambience-scenes-list")!
      .dispatchEvent(new CustomEvent("add-scene", { detail: {}, bubbles: true, composed: true }));
    await el.updateComplete;
    const editor: any = el.shadowRoot.querySelector("ambience-scene-editor");
    expect(editor.scene.category).toBe("a"); // Awnings sorts before Blinds
  });

  test("duplicating a pinned scene drops the pin and its fixed priority", async () => {
    const scene: Scene = {
      name: "Pinned",
      when: {},
      actions: [],
      category: "a",
      pinned: true,
      priority: 4096,
    };
    el = await mount({ areaConfigs: { living_room: { scenes: [scene] } } });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    const scenesList = row.querySelector("ambience-scenes-list")!;
    scenesList.dispatchEvent(
      new CustomEvent("duplicate-scene", { detail: { index: 0 }, bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const editor: any = el.shadowRoot.querySelector("ambience-scene-editor");
    expect(editor.scene.pinned).toBeUndefined();
    expect(editor.scene.priority).toBeUndefined();
    expect(editor.scene.category).toBe("a"); // category is preserved
    // the original is untouched
    expect(scene.pinned).toBe(true);
  });

  test("duplicate opens the editor without auto-opening the destination", async () => {
    const scene: Scene = { name: "Orig", when: {}, actions: [], category: "a" };
    el = await mount({ areaConfigs: { living_room: { scenes: [scene] } } });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    const scenesList = row.querySelector("ambience-scenes-list")!;
    scenesList.dispatchEvent(
      new CustomEvent("duplicate-scene", { detail: { index: 0 }, bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const editor: any = el.shadowRoot.querySelector("ambience-scene-editor");
    await editor.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await editor.updateComplete;
    // Editor is open with the clone, but the destination/scope slot stays
    // collapsed — duplicating should not auto-expand the scope picker.
    expect(editor.open).toBe(true);
    expect(editor.shadowRoot.querySelector(".scope-option")).toBeNull();
  });

  test("saveArea error is displayed", async () => {
    vi.mocked(api.saveArea).mockRejectedValueOnce(new Error("Save failed"));
    el = await mount({
      areaConfigs: {
        living_room: { scenes: [{ name: "Scene A", when: {}, actions: [] }] },
      },
    });

    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;

    const scenesList = row.querySelector("ambience-scenes-list")!;
    scenesList.dispatchEvent(
      new CustomEvent("delete-scene", {
        detail: { index: 0 },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(el.shadowRoot.querySelector(".error")).toBeTruthy();
  });

  test("dropping a scene to the top slot pins it above the max priority", async () => {
    const cfg: ScopeConfig = {
      scenes: [
        { name: "a", when: {}, actions: [], priority: 3072, pinned: false },
        { name: "b", when: {}, actions: [], priority: 2048, pinned: false },
        { name: "c", when: {}, actions: [], priority: 1024, pinned: false },
      ],
    };
    vi.mocked(api.saveArea).mockImplementation(async (_hass, _areaId, saved) => ({
      ok: true,
      config: saved,
    }));
    el = await mount({ areaConfigs: { living_room: cfg } });

    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;

    const scenesList = row.querySelector("ambience-scenes-list")!;
    // Move scene at index 2 ("c") to index 0 (the top slot)
    scenesList.dispatchEvent(
      new CustomEvent("reorder-scenes", {
        detail: { from: 2, to: 0 },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));

    expect(api.saveArea).toHaveBeenCalled();
    const savedConfig: ScopeConfig = vi.mocked(api.saveArea).mock.calls.at(-1)![2];
    const movedScene = savedConfig.scenes[0];
    expect(movedScene.name).toBe("c");
    expect(movedScene.pinned).toBe(true);
    // Top slot: above=undefined, below=3072 → max(3072,2048,1024) + 1024 = 4096
    expect(movedScene.priority).toBe(4096);
    expect(movedScene.priority).toBeGreaterThan(3072);
  });

  test("dropping a scene to a middle slot pins it at the midpoint priority", async () => {
    const cfg: ScopeConfig = {
      scenes: [
        { name: "a", when: {}, actions: [], priority: 3072, pinned: false },
        { name: "b", when: {}, actions: [], priority: 2048, pinned: false },
        { name: "c", when: {}, actions: [], priority: 1024, pinned: false },
      ],
    };
    vi.mocked(api.saveArea).mockImplementation(async (_hass, _areaId, saved) => ({
      ok: true,
      config: saved,
    }));
    el = await mount({ areaConfigs: { living_room: cfg } });

    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;

    const scenesList = row.querySelector("ambience-scenes-list")!;
    // Move scene at index 2 ("c") to index 1.
    // After splice: [a:3072, c, b:2048] → above=scenes[0].priority=3072, below=scenes[2].priority=2048
    // _pinPriority(3072, 2048, original) → Math.floor((3072+2048)/2) = 2560
    scenesList.dispatchEvent(
      new CustomEvent("reorder-scenes", {
        detail: { from: 2, to: 1 },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));

    expect(api.saveArea).toHaveBeenCalled();
    const savedConfig: ScopeConfig = vi.mocked(api.saveArea).mock.calls.at(-1)![2];
    const movedScene = savedConfig.scenes[1];
    expect(movedScene.name).toBe("c");
    expect(movedScene.pinned).toBe(true);
    // Midpoint between a(3072) and b(2048): Math.floor((3072+2048)/2) = 2560
    expect(movedScene.priority).toBe(2560);
  });

  test("dropping a scene to the bottom slot pins it below the min priority", async () => {
    const cfg: ScopeConfig = {
      scenes: [
        { name: "a", when: {}, actions: [], priority: 3072, pinned: false },
        { name: "b", when: {}, actions: [], priority: 2048, pinned: false },
        { name: "c", when: {}, actions: [], priority: 1024, pinned: false },
      ],
    };
    vi.mocked(api.saveArea).mockImplementation(async (_hass, _areaId, saved) => ({
      ok: true,
      config: saved,
    }));
    el = await mount({ areaConfigs: { living_room: cfg } });

    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;

    const scenesList = row.querySelector("ambience-scenes-list")!;
    // Move scene at index 0 ("a") to index 2 (the bottom slot).
    // After splice(0,1): [b:2048, c:1024], then splice(2,0,a): [b:2048, c:1024, a]
    // above=scenes[1].priority=1024, below=scenes[3]=undefined
    // _pinPriority(1024, undefined, original) → min(3072,2048,1024) - 1024 = 0
    scenesList.dispatchEvent(
      new CustomEvent("reorder-scenes", {
        detail: { from: 0, to: 2 },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));

    expect(api.saveArea).toHaveBeenCalled();
    const savedConfig: ScopeConfig = vi.mocked(api.saveArea).mock.calls.at(-1)![2];
    const movedScene = savedConfig.scenes[2];
    expect(movedScene.name).toBe("a");
    expect(movedScene.pinned).toBe(true);
    // Bottom slot: above=1024, below=undefined → min(3072,2048,1024) - 1024 = 0
    expect(movedScene.priority).toBe(0);
  });

  test("editor receives a Scope object (kind + id) for an area", async () => {
    el = await mount();
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;

    const scenesList = row.querySelector("ambience-scenes-list")!;
    scenesList.dispatchEvent(
      new CustomEvent("add-scene", { detail: {}, bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const editor = el.shadowRoot.querySelector("ambience-scene-editor") as any;
    expect(editor.scope).toEqual({ kind: "area", id: "living_room" });
  });

  test("editor receives a Scope object for the house", async () => {
    el = await mount();
    const row = el.shadowRoot.querySelector(".scope-row.house") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;

    const scenesList = row.querySelector("ambience-scenes-list")!;
    scenesList.dispatchEvent(
      new CustomEvent("add-scene", { detail: {}, bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const editor = el.shadowRoot.querySelector("ambience-scene-editor") as any;
    expect(editor.scope).toEqual({ kind: "house" });
  });

  test("editor receives a Scope object for a floor", async () => {
    el = await mount();
    const row = el.shadowRoot.querySelector(".scope-row.floor[data-id='ground']") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;

    const scenesList = row.querySelector("ambience-scenes-list")!;
    scenesList.dispatchEvent(
      new CustomEvent("add-scene", { detail: {}, bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const editor = el.shadowRoot.querySelector("ambience-scene-editor") as any;
    expect(editor.scope).toEqual({ kind: "floor", id: "ground" });
  });

  // --- exposed-actions refresh --------------------------------------------

  test("ambience-exposed-actions-changed event re-fetches listExposedActions", async () => {
    el = await mount();
    const initialCallCount = vi.mocked(api.listExposedActions).mock.calls.length;

    const updatedActions: ExposedAction[] = [
      { id: "light.turn_on", label: "Set light", visible_fields: ["brightness_pct"], defaults: {} },
    ];
    vi.mocked(api.listExposedActions).mockResolvedValueOnce(updatedActions);

    window.dispatchEvent(new CustomEvent("ambience-exposed-actions-changed"));
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(vi.mocked(api.listExposedActions).mock.calls.length).toBe(initialCallCount + 1);
  });

  test("ambience-exposed-actions-changed listener is removed on disconnect", async () => {
    el = await mount();
    el.remove();
    await new Promise((r) => setTimeout(r, 0));

    const callsBefore = vi.mocked(api.listExposedActions).mock.calls.length;
    window.dispatchEvent(new CustomEvent("ambience-exposed-actions-changed"));
    await new Promise((r) => setTimeout(r, 0));

    // No additional call after disconnect
    expect(vi.mocked(api.listExposedActions).mock.calls.length).toBe(callsBefore);
    el = null; // already removed, don't double-remove in afterEach
  });

  test("ambience-categories-changed event re-fetches listCategories", async () => {
    el = await mount();
    const initialCallCount = vi.mocked(api.listCategories).mock.calls.length;

    const updated: SceneCategory[] = [{ id: "movie", name: "Movie night" }];
    vi.mocked(api.listCategories).mockResolvedValueOnce(updated);

    window.dispatchEvent(new CustomEvent("ambience-categories-changed"));
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(vi.mocked(api.listCategories).mock.calls.length).toBe(initialCallCount + 1);
    expect(el._categories).toEqual(updated);
  });

  test("ambience-categories-changed listener is removed on disconnect", async () => {
    el = await mount();
    el.remove();
    await new Promise((r) => setTimeout(r, 0));

    const callsBefore = vi.mocked(api.listCategories).mock.calls.length;
    window.dispatchEvent(new CustomEvent("ambience-categories-changed"));
    await new Promise((r) => setTimeout(r, 0));

    expect(vi.mocked(api.listCategories).mock.calls.length).toBe(callsBefore);
    el = null;
  });

  // --- global category filter ------------------------------------------------

  test("per-scope summary counts scenes matching the active filter", async () => {
    el = await mount();
    const cfg = {
      scenes: [
        { when: {}, actions: [], category: "a" },
        { when: {}, actions: [], category: "b" },
        { when: {}, actions: [], category: "a" },
      ],
    };
    el.filterCategory = "";
    await el.updateComplete;
    expect(el._summary(cfg)).toBe("3 scenes");
    el.filterCategory = "a";
    await el.updateComplete;
    expect(el._summary(cfg)).toBe("2 scenes");
    el.filterCategory = "b";
    await el.updateComplete;
    expect(el._summary(cfg)).toBe("1 scene");
    // A genuinely empty scope is always "not configured".
    expect(el._summary({ scenes: [] })).toBe("not configured");
    // A scope with scenes but none in the active filter shows "0 scenes".
    el.filterCategory = "c";
    await el.updateComplete;
    expect(el._summary(cfg)).toBe("0 scenes");
  });

  test("a new scene defaults to the active filtered category", async () => {
    el = await mount();
    el._categories = [
      { id: "a", name: "Awn" },
      { id: "b", name: "Bee" },
    ] as SceneCategory[];
    el.filterCategory = "b";
    await el.updateComplete;
    el._addScene({ kind: "house" });
    expect(el._editingScene.category).toBe("b");
  });

  test("a new scene under All defaults to the alphabetically-first category", async () => {
    el = await mount();
    el._categories = [
      { id: "z", name: "Zed" },
      { id: "a", name: "Awn" },
    ] as SceneCategory[];
    await el.updateComplete;
    el._addScene({ kind: "house" });
    expect(el._editingScene.category).toBe("a");
  });

  test("reorder rejects a cross-category drop (no mutation)", async () => {
    const cfg: ScopeConfig = {
      scenes: [
        { name: "a", when: {}, actions: [], category: "a", priority: 2048 },
        { name: "b", when: {}, actions: [], category: "b", priority: 1024 },
      ] as Scene[],
    };
    el = await mount({ houseConfig: structuredClone(cfg) });
    vi.clearAllMocks();

    el._reorderScenes({ kind: "house" }, {
      detail: { from: 0, to: 1 },
    } as CustomEvent<{ from: number; to: number }>);
    await new Promise((r) => setTimeout(r, 0));

    expect(api.saveHouse).not.toHaveBeenCalled();
    const stored = el._getConfig({ kind: "house" });
    expect(stored.scenes.map((r: Scene) => r.name)).toEqual(["a", "b"]);
  });

  test("disconnectedCallback unsubscribes from both registries", async () => {
    const unsubArea = vi.fn();
    const unsubFloor = vi.fn();
    let _i = 0;
    vi.mocked(api.listAreas).mockResolvedValue(baseAreas);
    vi.mocked(api.getArea).mockResolvedValue(baseConfig);
    vi.mocked(api.listFloors).mockResolvedValue(baseFloors);
    vi.mocked(api.getFloor).mockResolvedValue(baseConfig);
    vi.mocked(api.getHouse).mockResolvedValue(baseConfig);
    vi.mocked(api.listConditions).mockResolvedValue(conditions);
    vi.mocked(api.listExposedActions).mockResolvedValue(actions);
    vi.mocked(api.listPeriods).mockResolvedValue(periods);

    const hass = {
      connection: {
        subscribeEvents: vi.fn().mockImplementation(async (_cb, type) => {
          _i++;
          return type === "area_registry_updated" ? unsubArea : unsubFloor;
        }),
      },
    };

    const localEl: any = document.createElement("ambience-scopes-view");
    localEl.hass = hass;
    document.body.appendChild(localEl);
    await localEl.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => setTimeout(r, 0));

    localEl.remove();
    await new Promise((r) => setTimeout(r, 0));
    expect(unsubArea).toHaveBeenCalled();
    expect(unsubFloor).toHaveBeenCalled();
  });

  // --- scope-header switch toggle -----------------------------------------

  const baseSwitches = [
    { scope_kind: "house", scope_id: null, entity_id: "switch.global_ambience" },
    { scope_kind: "area", scope_id: "living_room", entity_id: "switch.living_room_ambience" },
    { scope_kind: "area", scope_id: "bedroom", entity_id: "switch.bedroom_ambience" },
    { scope_kind: "floor", scope_id: "ground", entity_id: "switch.ground_floor_ambience" },
    { scope_kind: "floor", scope_id: "upstairs", entity_id: "switch.upstairs_floor_ambience" },
  ] satisfies ScopeSwitch[];

  function toggleIn(row: HTMLElement): any {
    return row.querySelector("[data-test='scope-switch']");
  }

  test("renders a toggle per scope reflecting the enabled flag", async () => {
    el = await mount({
      areaConfigs: {
        living_room: { scenes: [], enabled: true },
        bedroom: { scenes: [], enabled: false },
      },
    });
    const lr = toggleIn(el.shadowRoot.querySelector(".scope-row.area[data-id='living_room']"));
    const br = toggleIn(el.shadowRoot.querySelector(".scope-row.area[data-id='bedroom']"));
    expect(lr).toBeTruthy();
    expect(br).toBeTruthy();
    expect(lr.checked).toBe(true);
    expect(br.checked).toBe(false);
  });

  test("toggling a disabled scope writes setScopeEnabled(true)", async () => {
    el = await mount({ areaConfigs: { bedroom: { scenes: [], enabled: false } } });
    const br = toggleIn(el.shadowRoot.querySelector(".scope-row.area[data-id='bedroom']"));
    br.checked = true;
    br.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    expect(api.setScopeEnabled).toHaveBeenCalledWith(
      expect.anything(),
      { kind: "area", id: "bedroom" },
      true,
    );
    expect(el.hass.callService).not.toHaveBeenCalled();
  });

  test("toggling an enabled scope writes setScopeEnabled(false)", async () => {
    el = await mount({ areaConfigs: { living_room: { scenes: [], enabled: true } } });
    const lr = toggleIn(el.shadowRoot.querySelector(".scope-row.area[data-id='living_room']"));
    lr.checked = false;
    lr.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    expect(api.setScopeEnabled).toHaveBeenCalledWith(
      expect.anything(),
      { kind: "area", id: "living_room" },
      false,
    );
    expect(el.hass.callService).not.toHaveBeenCalled();
  });

  test("toggling the header switch writes the enabled flag, not the HA switch", async () => {
    el = await mount({ houseConfig: { scenes: [], enabled: true } });
    const houseRow = el.shadowRoot.querySelector(".scope-row.house");
    const sw = toggleIn(houseRow);
    expect(sw).toBeTruthy();
    expect(sw.checked).toBe(true);
    sw.checked = false;
    sw.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(api.setScopeEnabled).toHaveBeenCalledWith(expect.anything(), { kind: "house" }, false);
    expect(el.hass.callService).not.toHaveBeenCalled();
  });

  test("clicking the toggle does not expand the row", async () => {
    el = await mount({
      switches: baseSwitches,
      states: { "switch.living_room_ambience": { state: "on" } },
    });
    const row = el.shadowRoot.querySelector(".scope-row.area[data-id='living_room']");
    toggleIn(row).click();
    await el.updateComplete;
    expect(row.querySelector(".scope-body")).toBeFalsy();
  });

  // --- temporary-pause timer icon -----------------------------------------

  const houseSwitch = [
    { scope_kind: "house", scope_id: null, entity_id: "switch.house_ambience" },
  ] satisfies ScopeSwitch[];

  function pauseIn(root: any): HTMLElement | null {
    return root.shadowRoot
      .querySelector(".scope-row.house")
      .querySelector("[data-test='scope-pause']");
  }

  test("pause icon: not paused → tap calls switch.turn_off", async () => {
    el = await mount({
      switches: houseSwitch,
      houseConfig: { scenes: [], enabled: true },
      states: {
        "switch.house_ambience": {
          state: "on",
          attributes: { off_at: null, auto_on_delay_seconds: 7200 },
        },
      },
    });
    const icon = pauseIn(el) as HTMLElement;
    expect(icon).toBeTruthy();
    icon.click();
    expect(el.hass.callService).toHaveBeenCalledWith("switch", "turn_off", {
      entity_id: "switch.house_ambience",
    });
  });

  test("pause icon: paused → shows countdown and tap calls switch.turn_on", async () => {
    // off_at is 30 min before "now"; delay 7200s → ~90 min remaining,
    // regardless of the real clock at test time.
    const offAt = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    el = await mount({
      switches: houseSwitch,
      houseConfig: { scenes: [], enabled: true },
      states: {
        "switch.house_ambience": {
          state: "off",
          attributes: { off_at: offAt, auto_on_delay_seconds: 7200 },
        },
      },
    });
    const icon = pauseIn(el) as HTMLElement;
    expect(icon).toBeTruthy();
    expect(icon.textContent).toMatch(/\d+:\d{2}/);
    icon.click();
    expect(el.hass.callService).toHaveBeenCalledWith("switch", "turn_on", {
      entity_id: "switch.house_ambience",
    });
  });

  test("pause icon hidden when scope permanently disabled", async () => {
    el = await mount({
      switches: houseSwitch,
      houseConfig: { scenes: [], enabled: false },
      states: {
        "switch.house_ambience": {
          state: "on",
          attributes: { off_at: null, auto_on_delay_seconds: 7200 },
        },
      },
    });
    expect(pauseIn(el)).toBeNull();
  });

  function scopeRowIds(e: any): string[] {
    return [...e.shadowRoot.querySelectorAll(".scope-row")].map((r: Element) => {
      const cls = r.classList.contains("house")
        ? "house"
        : r.classList.contains("floor")
          ? "floor"
          : "area";
      return `${cls}:${r.getAttribute("data-id") || "house"}`;
    });
  }

  test("permanently disabled scopes sort to the end of the list (stable otherwise)", async () => {
    el = await mount({
      floorConfigs: { ground: { scenes: [], enabled: false } },
      areaConfigs: { bedroom: { scenes: [], enabled: false } },
    });
    // Base order is house, floor:ground, floor:upstairs, area:living_room,
    // area:bedroom. The two disabled scopes (ground, bedroom) sink to the end,
    // keeping their relative order; the enabled ones keep theirs.
    expect(scopeRowIds(el)).toEqual([
      "house:house",
      "floor:upstairs",
      "area:living_room",
      "floor:ground",
      "area:bedroom",
    ]);
  });

  test("disabled scopes sort to the end", async () => {
    el = await mount({
      areaConfigs: { living_room: { scenes: [], enabled: false } },
    });
    const names = [...el.shadowRoot.querySelectorAll(".scope-name")].map((n: Element) =>
      n.textContent?.trim(),
    );
    expect(names[names.length - 1]).toContain("Living Room");
  });

  test("scopes keep their base order when none are disabled", async () => {
    el = await mount({
      floorConfigs: {
        ground: { scenes: [], enabled: true },
        upstairs: { scenes: [], enabled: true },
      },
      areaConfigs: {
        living_room: { scenes: [], enabled: true },
        bedroom: { scenes: [], enabled: true },
      },
    });
    expect(scopeRowIds(el)).toEqual([
      "house:house",
      "floor:ground",
      "floor:upstairs",
      "area:living_room",
      "area:bedroom",
    ]);
  });

  test("temporarily switched-off scopes keep their place in the list", async () => {
    // A switch being off is a *temporary* pause — it must NOT reorder the list.
    el = await mount({
      switches: baseSwitches,
      states: {
        "switch.ground_floor_ambience": { state: "off" },
        "switch.bedroom_ambience": { state: "off" },
      },
    });
    expect(scopeRowIds(el)).toEqual([
      "house:house",
      "floor:ground",
      "floor:upstairs",
      "area:living_room",
      "area:bedroom",
    ]);
  });

  test("renders a toggle for every scope regardless of switch entities", async () => {
    // The toggle reflects the permanent `enabled` flag, not a switch entity, so
    // it must render even when no switch entity is known for the scope.
    el = await mount({
      switches: [
        { scope_kind: "area", scope_id: "living_room", entity_id: "switch.living_room_ambience" },
      ],
    });
    const br = toggleIn(el.shadowRoot.querySelector(".scope-row.area[data-id='bedroom']"));
    expect(br).toBeTruthy();
    // Default (no enabled flag) ⇒ enabled.
    expect(br.checked).toBe(true);
  });

  // --- disabled / faded scope styling -------------------------------------

  const headerOf = (e: any, sel: string): HTMLElement =>
    e.shadowRoot.querySelector(`${sel} .scope-header`) as HTMLElement;

  test("a switched-off scope header gets the 'off' (disabled) class", async () => {
    el = await mount({
      switches: baseSwitches,
      states: { "switch.bedroom_ambience": { state: "off" } },
    });
    const header = headerOf(el, ".scope-row.area[data-id='bedroom']");
    expect(header.classList.contains("off")).toBe(true);
  });

  test("an on scope with no scenes gets the 'empty' (faded) class", async () => {
    el = await mount({
      switches: baseSwitches,
      states: { "switch.living_room_ambience": { state: "on" } },
    });
    const header = headerOf(el, ".scope-row.area[data-id='living_room']");
    expect(header.classList.contains("empty")).toBe(true);
    expect(header.classList.contains("off")).toBe(false);
  });

  test("an on scope with matching scenes is neither off nor empty", async () => {
    el = await mount({
      switches: baseSwitches,
      states: { "switch.living_room_ambience": { state: "on" } },
      areaConfigs: {
        living_room: { scenes: [{ when: {}, actions: [], category: "a" }] },
      },
    });
    const header = headerOf(el, ".scope-row.area[data-id='living_room']");
    expect(header.classList.contains("empty")).toBe(false);
    expect(header.classList.contains("off")).toBe(false);
  });

  test("the 'empty' class follows the active category filter", async () => {
    el = await mount({
      areaConfigs: {
        living_room: { scenes: [{ when: {}, actions: [], category: "a" }] },
      },
    });
    // Filtered to the scene's own category: the scope has a matching rule.
    el.filterCategory = "a";
    await el.updateComplete;
    expect(headerOf(el, ".scope-row.area[data-id='living_room']").classList.contains("empty")).toBe(
      false,
    );
    // Filtered to a category the scope has no scene in: faded.
    el.filterCategory = "b";
    await el.updateComplete;
    expect(headerOf(el, ".scope-row.area[data-id='living_room']").classList.contains("empty")).toBe(
      true,
    );
  });

  test("a switched-off empty scope reads 'off', not 'empty' (off takes precedence)", async () => {
    el = await mount({
      switches: baseSwitches,
      states: { "switch.bedroom_ambience": { state: "off" } },
    });
    const header = headerOf(el, ".scope-row.area[data-id='bedroom']");
    expect(header.classList.contains("off")).toBe(true);
    expect(header.classList.contains("empty")).toBe(false);
  });

  test("disabled scope row carries the scope-disabled class", async () => {
    el = await mount({
      areaConfigs: { bedroom: { scenes: [], enabled: false } },
    });
    const row = el.shadowRoot.querySelector(".scope-row.area[data-id='bedroom']") as HTMLElement;
    const kebab = row.querySelector('[data-test="scope-kebab"]') as HTMLElement;
    expect(kebab.closest("li")).toBe(row);
    expect(row.classList.contains("scope-disabled")).toBe(true);
  });

  test("an enabled scope row does not carry the scope-disabled class", async () => {
    el = await mount({
      areaConfigs: { living_room: { scenes: [], enabled: true } },
    });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    expect(row.classList.contains("scope-disabled")).toBe(false);
  });

  // --- apply-scenes / run-scene-actions ----------------------------------------

  async function pickScopeKebab(target: any, rowSelector: string, action: string) {
    const header = target.shadowRoot.querySelector(`${rowSelector} .scope-header`) as HTMLElement;
    const kebab: any = header.querySelector("ambience-kebab-menu");
    (kebab.shadowRoot.querySelector(".kebab-trigger") as HTMLButtonElement).click();
    await kebab.updateComplete;
    (kebab.shadowRoot.querySelector(`[data-action='${action}']`) as HTMLButtonElement).click();
    await kebab.updateComplete;
  }

  test("scope header has a kebab and no standalone apply button", async () => {
    el = await mount();
    const header = el.shadowRoot.querySelector("li.scope-row.house .scope-header") as HTMLElement;
    expect(header.querySelector("ambience-kebab-menu")).toBeTruthy();
    expect(header.querySelector("[data-test='apply-scope']")).toBeNull();
  });

  test("kebab Run calls api.applyScenes for that scope", async () => {
    el = await mount();
    await pickScopeKebab(el, "li.scope-row.house", "run");
    expect(vi.mocked(api.applyScenes)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(api.applyScenes).mock.calls[0][1]).toEqual({ kind: "house" });
  });

  test("kebab Auto-triggers opens the read-only auto-triggers modal for that scope", async () => {
    el = await mount();
    const modal: any = el.shadowRoot.querySelector("ambience-auto-triggers-modal");
    // Closed until the kebab item is picked.
    expect(modal.open).toBe(false);

    await pickScopeKebab(el, "li.scope-row.house", "auto");
    await el.updateComplete;

    expect(modal.open).toBe(true);
    expect(modal.scope).toEqual({ kind: "house" });
  });

  test("the Auto-triggers modal reads the scope's live scenes, not a snapshot", async () => {
    el = await mount({
      areaConfigs: { living_room: { scenes: [{ name: "A", when: {}, actions: [] }] } },
    });
    await pickScopeKebab(el, "li.scope-row.area[data-id='living_room']", "auto");
    await el.updateComplete;
    const modal: any = el.shadowRoot.querySelector("ambience-auto-triggers-modal");
    expect(modal.scenes.map((s: Scene) => s.name)).toEqual(["A"]);

    // The scope's config changes while the modal is open — it must reflect the
    // new scenes (a frozen snapshot taken at open time would still show ["A"]).
    const next = new Map(el._areaConfigs);
    next.set("living_room", {
      scenes: [
        { name: "A", when: {}, actions: [] },
        { name: "B", when: {}, actions: [] },
      ],
    });
    el._areaConfigs = next;
    await el.updateComplete;
    expect(modal.scenes.map((s: Scene) => s.name)).toEqual(["A", "B"]);
  });

  test("run-scene-actions event from a scene list calls api.runSceneActions", async () => {
    el = await mount({
      areaConfigs: {
        living_room: { scenes: [{ name: "R", category: "g", when: {}, actions: [] }] },
      },
    });
    const header = el.shadowRoot.querySelector(
      "li.scope-row.area[data-id='living_room'] .scope-header",
    ) as HTMLElement;
    header.click();
    await el.updateComplete;
    const list = el.shadowRoot.querySelector(
      "li.scope-row.area[data-id='living_room'] ambience-scenes-list",
    ) as HTMLElement;
    expect(list).toBeTruthy();
    list.dispatchEvent(
      new CustomEvent("run-scene-actions", {
        detail: { index: 0 },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    expect(vi.mocked(api.runSceneActions)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(api.runSceneActions).mock.calls[0][1]).toEqual({
      kind: "area",
      id: "living_room",
    });
    expect(vi.mocked(api.runSceneActions).mock.calls[0][2]).toBe(0);
  });

  test("apply-category event calls api.applyScenes with the category id", async () => {
    el = await mount({
      areaConfigs: {
        living_room: { scenes: [{ name: "R", category: "g", when: {}, actions: [] }] },
      },
    });
    const header = el.shadowRoot.querySelector(
      "li.scope-row.area[data-id='living_room'] .scope-header",
    ) as HTMLElement;
    header.click();
    await el.updateComplete;
    const list = el.shadowRoot.querySelector(
      "li.scope-row.area[data-id='living_room'] ambience-scenes-list",
    ) as HTMLElement;
    list.dispatchEvent(
      new CustomEvent("apply-category", {
        detail: { categoryId: "g" },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    expect(vi.mocked(api.applyScenes)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(api.applyScenes).mock.calls[0][1]).toEqual({
      kind: "area",
      id: "living_room",
    });
    expect(vi.mocked(api.applyScenes).mock.calls[0][2]).toBe("g");
  });

  // --- scene enable/disable toggle -----------------------------------------

  async function toggleSceneInArea(
    areaId: string,
    detail: { index: number; enabled: boolean },
  ): Promise<void> {
    const row = el.shadowRoot.querySelector(`.scope-row.area[data-id='${areaId}']`) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    const scenesList = row.querySelector("ambience-scenes-list")!;
    scenesList.dispatchEvent(
      new CustomEvent("toggle-scene-enabled", { detail, bubbles: true, composed: true }),
    );
    await new Promise((r) => setTimeout(r, 0));
  }

  test("disabling a scene saves enabled:false on that scene", async () => {
    el = await mount({
      areaConfigs: { living_room: { scenes: [{ name: "R", when: {}, actions: [] }] } },
    });
    await toggleSceneInArea("living_room", { index: 0, enabled: false });
    expect(api.saveArea).toHaveBeenCalledWith(
      expect.anything(),
      "living_room",
      expect.objectContaining({ scenes: [expect.objectContaining({ name: "R", enabled: false })] }),
    );
  });

  test("re-enabling a scene removes the enabled key", async () => {
    el = await mount({
      areaConfigs: {
        living_room: { scenes: [{ name: "R", when: {}, actions: [], enabled: false }] },
      },
    });
    await toggleSceneInArea("living_room", { index: 0, enabled: true });
    const call = vi.mocked(api.saveArea).mock.calls.at(-1)!;
    const savedScene = (call[2] as ScopeConfig).scenes[0];
    expect(savedScene).not.toHaveProperty("enabled");
    expect(savedScene).toMatchObject({ name: "R" });
  });

  // --- cancel-scene ---------------------------------------------------------

  test("cancel-scene closes the editor without saving", async () => {
    el = await mount({
      areaConfigs: { living_room: { scenes: [{ name: "R", when: {}, actions: [] }] } },
    });
    vi.clearAllMocks();
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    // Open the editor
    row
      .querySelector("ambience-scenes-list")!
      .dispatchEvent(new CustomEvent("add-scene", { detail: {}, bubbles: true, composed: true }));
    await el.updateComplete;
    const editor: any = el.shadowRoot.querySelector("ambience-scene-editor");
    expect(editor.open).toBe(true);
    // Fire cancel-scene
    editor.dispatchEvent(new CustomEvent("cancel-scene", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(editor.open).toBe(false);
    expect(api.saveArea).not.toHaveBeenCalled();
  });

  // --- unpin-scene ----------------------------------------------------------

  test("unpin-scene sets pinned:false on the targeted scene and saves", async () => {
    const scene: Scene = { name: "Pinned", when: {}, actions: [], pinned: true, priority: 1024 };
    el = await mount({ areaConfigs: { living_room: { scenes: [scene] } } });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row
      .querySelector("ambience-scenes-list")!
      .dispatchEvent(
        new CustomEvent("unpin-scene", { detail: { index: 0 }, bubbles: true, composed: true }),
      );
    await new Promise((r) => setTimeout(r, 0));
    expect(api.saveArea).toHaveBeenCalledWith(
      expect.anything(),
      "living_room",
      expect.objectContaining({
        scenes: [expect.objectContaining({ name: "Pinned", pinned: false })],
      }),
    );
  });

  // --- show-traces / show-simulator ----------------------------------------

  test("show-traces event opens the traces modal with correct props", async () => {
    el = await mount();
    el._categories = [{ id: "lights", name: "Lights", color: null, icon: null }] as SceneCategory[];
    await el.updateComplete;
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-scenes-list")!.dispatchEvent(
      new CustomEvent("show-traces", {
        detail: { category: "lights" },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    const modal: any = el.shadowRoot.querySelector("ambience-traces-modal");
    expect(modal.open).toBe(true);
    expect(modal.category).toBe("lights");
    expect(modal.categoryName).toBe("Lights");
    expect(modal.scope).toMatchObject({ scope_kind: "area", scope_id: "living_room" });
  });

  test("show-traces with unknown category passes null categoryName", async () => {
    el = await mount();
    el._categories = [] as SceneCategory[];
    await el.updateComplete;
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-scenes-list")!.dispatchEvent(
      new CustomEvent("show-traces", {
        detail: { category: "unknown_cat" },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    const modal: any = el.shadowRoot.querySelector("ambience-traces-modal");
    expect(modal.open).toBe(true);
    expect(modal.categoryName).toBeNull();
  });

  test("closing the traces modal sets _viewingTraces to null", async () => {
    el = await mount();
    el._categories = [{ id: "lights", name: "Lights", color: null, icon: null }] as SceneCategory[];
    await el.updateComplete;
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-scenes-list")!.dispatchEvent(
      new CustomEvent("show-traces", {
        detail: { category: "lights" },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    const modal: any = el.shadowRoot.querySelector("ambience-traces-modal");
    expect(modal.open).toBe(true);
    modal.dispatchEvent(new CustomEvent("close", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(modal.open).toBe(false);
  });

  test("show-simulator event opens the simulator modal with correct props", async () => {
    el = await mount();
    el._categories = [{ id: "lights", name: "Lights", color: null, icon: null }] as SceneCategory[];
    await el.updateComplete;
    const row = el.shadowRoot.querySelector(".scope-row.house") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-scenes-list")!.dispatchEvent(
      new CustomEvent("show-simulator", {
        detail: { category: "lights" },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    const modal: any = el.shadowRoot.querySelector("ambience-simulator-modal");
    expect(modal.open).toBe(true);
    expect(modal.category).toBe("lights");
    expect(modal.categoryName).toBe("Lights");
    expect(modal.scope).toMatchObject({ scope_kind: "house", scope_id: null });
  });

  test("closing the simulator modal sets _viewingSimulator to null", async () => {
    el = await mount();
    el._categories = [{ id: "g1", name: "G1", color: null, icon: null }] as SceneCategory[];
    await el.updateComplete;
    const row = el.shadowRoot.querySelector(".scope-row.house") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-scenes-list")!.dispatchEvent(
      new CustomEvent("show-simulator", {
        detail: { category: "g1" },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    const modal: any = el.shadowRoot.querySelector("ambience-simulator-modal");
    expect(modal.open).toBe(true);
    modal.dispatchEvent(new CustomEvent("close", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(modal.open).toBe(false);
  });

  // --- traces/simulator scope fallbacks when modal props come from null ----

  test("traces-modal scope prop uses fallback when _viewingTraces is null", async () => {
    el = await mount();
    // When _viewingTraces is null the template uses a default scope
    const modal: any = el.shadowRoot.querySelector("ambience-traces-modal");
    expect(modal.scope).toMatchObject({ scope_kind: "house", scope_id: null });
  });

  test("simulator-modal scope prop uses fallback when _viewingSimulator is null", async () => {
    el = await mount();
    const modal: any = el.shadowRoot.querySelector("ambience-simulator-modal");
    expect(modal.scope).toMatchObject({ scope_kind: "house", scope_id: null });
  });

  // --- no-areas empty state ------------------------------------------------

  test("renders no-areas message when listAreas returns empty", async () => {
    el = await mount({ areas: [] });
    expect(el.shadowRoot.textContent).toContain("No areas found");
  });

  // --- _saveScene: same scope, edit existing scene (non-new) ----------------

  test("save-scene replaces an existing scene at its index when editing same scope", async () => {
    const scenes = [
      { name: "Old", when: {}, actions: [] },
      { name: "Other", when: {}, actions: [] },
    ];
    el = await mount({ areaConfigs: { living_room: { scenes } } });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    const scenesList = row.querySelector("ambience-scenes-list")!;
    scenesList.dispatchEvent(
      new CustomEvent("edit-scene", { detail: { index: 0 }, bubbles: true, composed: true }),
    );
    await el.updateComplete;
    const editor = el.shadowRoot.querySelector("ambience-scene-editor")!;
    editor.dispatchEvent(
      new CustomEvent("save-scene", {
        detail: {
          scene: { name: "Renamed", when: {}, actions: [] },
          scope: { kind: "area", id: "living_room" },
        },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));
    expect(api.saveArea).toHaveBeenCalledWith(
      expect.anything(),
      "living_room",
      expect.objectContaining({
        scenes: expect.arrayContaining([expect.objectContaining({ name: "Renamed" })]),
      }),
    );
  });

  // --- _mutate floor and error ------------------------------------------

  test("saveFloor error is displayed", async () => {
    vi.mocked(api.saveFloor).mockRejectedValueOnce(new Error("Floor save failed"));
    el = await mount({
      floorConfigs: { ground: { scenes: [{ name: "R", when: {}, actions: [] }] } },
    });
    const row = el.shadowRoot.querySelector(".scope-row.floor[data-id='ground']") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row
      .querySelector("ambience-scenes-list")!
      .dispatchEvent(
        new CustomEvent("delete-scene", { detail: { index: 0 }, bubbles: true, composed: true }),
      );
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".error")).toBeTruthy();
  });

  // --- _defaultCategoryId with no categories --------------------------------

  test("_defaultCategoryId returns empty string when no categories exist", async () => {
    el = await mount();
    el._categories = [] as SceneCategory[];
    expect(el._defaultCategoryId()).toBe("");
  });

  // --- area_registry_updated update (non-remove) refreshes without deleting -----

  test("area_registry_updated update event refreshes areas without clearing expanded state", async () => {
    el = await mount();
    const subCall = vi.mocked(el.hass.connection.subscribeEvents);
    const areaCallback = subCall.mock.calls.find((c: any) => c[1] === "area_registry_updated")?.[0];
    if (!areaCallback) throw new Error("no area_registry_updated subscription");
    // Expand living_room
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    expect(row.querySelector(".scope-body")).toBeTruthy();
    // Fire an update (not remove) event
    vi.mocked(api.listAreas).mockResolvedValue(baseAreas);
    areaCallback({ data: { action: "update", area_id: "living_room" } });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    // Row still present and still expanded
    expect(el.shadowRoot.textContent).toContain("Living Room");
  });

  // --- floor_registry_updated update (non-remove) ---------------------------

  test("floor_registry_updated update event refreshes floors without clearing expanded state", async () => {
    el = await mount();
    const subCall = vi.mocked(el.hass.connection.subscribeEvents);
    const floorCallback = subCall.mock.calls.find(
      (c: any) => c[1] === "floor_registry_updated",
    )?.[0];
    if (!floorCallback) throw new Error("no floor_registry_updated subscription");
    // Expand ground row
    const row = el.shadowRoot.querySelector(".scope-row.floor[data-id='ground']") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    // Fire update (not remove) - should NOT call _refreshSwitches
    vi.mocked(api.listFloors).mockResolvedValue(baseFloors);
    vi.clearAllMocks();
    floorCallback({ data: { action: "update", floor_id: "ground" } });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.textContent).toContain("Ground");
  });

  // --- area_registry_updated remove clears _editing when it targets the area ---

  test("area_registry_updated remove clears editing state when editing that area's scene", async () => {
    const scene: Scene = { name: "R", when: {}, actions: [] };
    el = await mount({ areaConfigs: { living_room: { scenes: [scene] } } });
    const subCall = vi.mocked(el.hass.connection.subscribeEvents);
    const areaCallback = subCall.mock.calls.find((c: any) => c[1] === "area_registry_updated")?.[0];
    if (!areaCallback) throw new Error("no area_registry_updated subscription");
    // Open the editor for living_room
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row
      .querySelector("ambience-scenes-list")!
      .dispatchEvent(
        new CustomEvent("edit-scene", { detail: { index: 0 }, bubbles: true, composed: true }),
      );
    await el.updateComplete;
    expect(el._editing?.scope).toEqual({ kind: "area", id: "living_room" });
    // Fire remove for living_room
    vi.mocked(api.listAreas).mockResolvedValue([baseAreas[1]]);
    areaCallback({ data: { action: "remove", area_id: "living_room" } });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el._editing).toBeNull();
  });

  // --- floor_registry_updated remove clears _editing -----------------------

  test("floor_registry_updated remove clears editing state when editing that floor's scene", async () => {
    const scene: Scene = { name: "FR", when: {}, actions: [] };
    el = await mount({ floorConfigs: { ground: { scenes: [scene] } } });
    const subCall = vi.mocked(el.hass.connection.subscribeEvents);
    const floorCallback = subCall.mock.calls.find(
      (c: any) => c[1] === "floor_registry_updated",
    )?.[0];
    if (!floorCallback) throw new Error("no floor_registry_updated subscription");
    const row = el.shadowRoot.querySelector(".scope-row.floor[data-id='ground']") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row
      .querySelector("ambience-scenes-list")!
      .dispatchEvent(
        new CustomEvent("edit-scene", { detail: { index: 0 }, bubbles: true, composed: true }),
      );
    await el.updateComplete;
    expect(el._editing?.scope).toEqual({ kind: "floor", id: "ground" });
    vi.mocked(api.listFloors).mockResolvedValue([baseFloors[1]]);
    floorCallback({ data: { action: "remove", floor_id: "ground" } });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el._editing).toBeNull();
  });

  // --- _mutate: saveHouse error reverts to prev ----------------------------

  test("saveHouse error displays the error message", async () => {
    vi.mocked(api.saveHouse).mockRejectedValueOnce(new Error("House save failed"));
    el = await mount({
      houseConfig: { scenes: [{ name: "H", when: {}, actions: [] }] },
    });
    const row = el.shadowRoot.querySelector(".scope-row.house") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row
      .querySelector("ambience-scenes-list")!
      .dispatchEvent(
        new CustomEvent("delete-scene", { detail: { index: 0 }, bubbles: true, composed: true }),
      );
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".error")).toBeTruthy();
  });

  // --- _callApi || String(e) branch ----------------------------------------

  test("applyScenes error with a non-Error thrown value shows stringified message", async () => {
    vi.mocked(api.applyScenes).mockRejectedValueOnce("plain string error");
    el = await mount();
    await pickScopeKebab(el, "li.scope-row.house", "run");
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".error")).toBeTruthy();
    expect(el.shadowRoot.textContent).toContain("plain string error");
  });

  // --- _normalize: scenes missing from config payload (??[]) ----------------

  test("_normalize treats a missing scenes field as empty array", async () => {
    // getHouse returns a config without a scenes field; _normalize should use []
    vi.mocked(api.getHouse).mockResolvedValueOnce({} as any);
    el = await mount();
    // The house scope should have an empty scenes array, not crash
    const cfg = el._getConfig({ kind: "house" });
    expect(cfg.scenes).toEqual([]);
  });

  // --- _pinPriority: both above and below undefined (single scene at top) ---

  test("dropping the only scene to itself (no neighbours) assigns PIN_GAP priority", async () => {
    const cfg: ScopeConfig = {
      scenes: [{ name: "solo", when: {}, actions: [], category: "a", priority: 1024 }],
    };
    vi.mocked(api.saveArea).mockImplementation(async (_hass, _areaId, saved) => ({
      ok: true,
      config: saved,
    }));
    el = await mount({ areaConfigs: { living_room: cfg } });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    const scenesList = row.querySelector("ambience-scenes-list")!;
    // Move index 0 to index 0 — single same-category scene, both above+below are undefined
    scenesList.dispatchEvent(
      new CustomEvent("reorder-scenes", {
        detail: { from: 0, to: 0 },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));
    expect(api.saveArea).toHaveBeenCalled();
    const savedCfg: ScopeConfig = vi.mocked(api.saveArea).mock.calls.at(-1)![2];
    // both above=undefined, below=undefined → PIN_GAP = 1024
    expect(savedCfg.scenes[0].priority).toBe(1024);
  });

  // --- _loadStatic || String(e) branch -------------------------------------

  test("non-Error thrown in _loadStatic is stringified and shown", async () => {
    vi.mocked(api.listConditions).mockRejectedValueOnce("string-only error");
    el = await mount();
    expect(el.shadowRoot.querySelector(".error")).toBeTruthy();
    expect(el.shadowRoot.textContent).toContain("string-only error");
  });

  // --- _refreshAreas || String(e) branch -----------------------------------

  test("non-Error thrown in _refreshAreas is stringified and shown", async () => {
    vi.mocked(api.listAreas).mockRejectedValueOnce("areas string error");
    el = await mount();
    expect(el.shadowRoot.querySelector(".error")).toBeTruthy();
    expect(el.shadowRoot.textContent).toContain("areas string error");
  });

  // --- _refreshFloors || String(e) branch ----------------------------------

  test("non-Error thrown in _refreshFloors is stringified and shown", async () => {
    vi.mocked(api.listFloors).mockRejectedValueOnce("floors string error");
    el = await mount();
    expect(el.shadowRoot.querySelector(".error")).toBeTruthy();
    expect(el.shadowRoot.textContent).toContain("floors string error");
  });

  // --- _refreshHouse || String(e) branch -----------------------------------

  test("non-Error thrown in _refreshHouse is stringified and shown", async () => {
    vi.mocked(api.getHouse).mockRejectedValueOnce("house string error");
    el = await mount();
    expect(el.shadowRoot.querySelector(".error")).toBeTruthy();
    expect(el.shadowRoot.textContent).toContain("house string error");
  });

  // --- _refreshSwitches || String(e) branch --------------------------------

  test("non-Error thrown in _refreshSwitches is stringified and shown", async () => {
    vi.mocked(api.listSwitches).mockRejectedValueOnce("switches string error");
    el = await mount();
    expect(el.shadowRoot.querySelector(".error")).toBeTruthy();
    expect(el.shadowRoot.textContent).toContain("switches string error");
  });

  // --- isConnected guards: disconnect before async resolves ----------------

  test("_loadStatic: bails out silently when element is removed before response", async () => {
    let resolveConditions!: (v: any) => void;
    vi.mocked(api.listConditions).mockReturnValue(
      new Promise((r) => {
        resolveConditions = r;
      }),
    );
    const localEl: any = document.createElement("ambience-scopes-view");
    localEl.hass = makeFakeHass();
    document.body.appendChild(localEl);
    await localEl.updateComplete;
    // Remove before the API call resolves
    localEl.remove();
    resolveConditions(conditions);
    await new Promise((r) => setTimeout(r, 0));
    // No error, no crash — just silently aborted
    expect(localEl._conditions).toEqual([]);
  });

  test("_refreshAreas: bails out silently when element is removed before response", async () => {
    let resolveAreas!: (v: any) => void;
    vi.mocked(api.listAreas).mockReturnValue(
      new Promise((r) => {
        resolveAreas = r;
      }),
    );
    const localEl: any = document.createElement("ambience-scopes-view");
    localEl.hass = makeFakeHass();
    document.body.appendChild(localEl);
    await localEl.updateComplete;
    localEl.remove();
    resolveAreas(baseAreas);
    await new Promise((r) => setTimeout(r, 0));
    expect(localEl._areas).toEqual([]);
  });

  test("_refreshHouse: bails out silently when element is removed before response", async () => {
    let resolveHouse!: (v: any) => void;
    vi.mocked(api.getHouse).mockReturnValue(
      new Promise((r) => {
        resolveHouse = r;
      }),
    );
    const localEl: any = document.createElement("ambience-scopes-view");
    localEl.hass = makeFakeHass();
    document.body.appendChild(localEl);
    await localEl.updateComplete;
    localEl.remove();
    resolveHouse(baseConfig);
    await new Promise((r) => setTimeout(r, 0));
    // House remains at default empty config
    expect(localEl._house).toEqual({ scenes: [] });
  });

  test("_onExposedActionsChanged: bails out when element is removed before listExposedActions resolves", async () => {
    el = await mount();
    let resolveActions!: (v: any) => void;
    vi.mocked(api.listExposedActions).mockReturnValue(
      new Promise((r) => {
        resolveActions = r;
      }),
    );
    window.dispatchEvent(new CustomEvent("ambience-exposed-actions-changed"));
    await el.updateComplete;
    // Remove before the call resolves
    el.remove();
    // Resolve with a DIFFERENT array reference so we can tell if the guard fires
    const newActions: ExposedAction[] = [
      { id: "new.action", label: "New", visible_fields: [], defaults: {} },
    ];
    resolveActions(newActions);
    await new Promise((r) => setTimeout(r, 0));
    // _actions should NOT have been updated to newActions (isConnected=false bail)
    expect(el._actions).not.toBe(newActions);
    el = null; // already removed
  });

  test("_refreshSchemas: bails out when element is removed before getServiceSchema resolves", async () => {
    el = await mount();
    let resolveSchema!: (v: any) => void;
    vi.mocked(api.getServiceSchema).mockReturnValue(
      new Promise((r) => {
        resolveSchema = r;
      }),
    );
    vi.mocked(api.listExposedActions).mockResolvedValue(actions);
    window.dispatchEvent(new CustomEvent("ambience-exposed-actions-changed"));
    await new Promise((r) => setTimeout(r, 0)); // let listExposedActions resolve
    await el.updateComplete;
    // Remove before schema resolves
    el.remove();
    const prevSchemas = el._schemas;
    resolveSchema({ fields: {} });
    await new Promise((r) => setTimeout(r, 0));
    // _schemas should NOT have been updated
    expect(el._schemas).toBe(prevSchemas);
    el = null;
  });

  test("_refreshSwitches: bails out silently when element is removed before response", async () => {
    let resolveSwitches!: (v: any) => void;
    vi.mocked(api.listSwitches).mockReturnValue(
      new Promise((r) => {
        resolveSwitches = r;
      }),
    );
    const localEl: any = document.createElement("ambience-scopes-view");
    localEl.hass = makeFakeHass();
    document.body.appendChild(localEl);
    await localEl.updateComplete;
    localEl.remove();
    resolveSwitches([]);
    await new Promise((r) => setTimeout(r, 0));
    expect(localEl._switchEntityIds.size).toBe(0);
  });

  // --- _mutate || String(e) branch -----------------------------------------

  test("non-Error thrown in _mutate is stringified and shown", async () => {
    vi.mocked(api.saveArea).mockRejectedValueOnce("mutate string error");
    el = await mount({
      areaConfigs: { living_room: { scenes: [{ name: "R", when: {}, actions: [] }] } },
    });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row
      .querySelector("ambience-scenes-list")!
      .dispatchEvent(
        new CustomEvent("delete-scene", { detail: { index: 0 }, bubbles: true, composed: true }),
      );
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".error")).toBeTruthy();
    expect(el.shadowRoot.textContent).toContain("mutate string error");
  });

  // --- _subscribe: disconnects before subscribe resolves -------------------

  test("_subscribe unsubscribes immediately when element is disconnected before subscriptions resolve", async () => {
    const unsubArea = vi.fn();
    const unsubFloor = vi.fn();
    // Use a two-step deferred: the first call to subscribeEvents returns a promise
    // that won't resolve until after we remove the element.
    const deferredArea = { resolve: null as null | ((v: any) => void) };
    const deferredFloor = { resolve: null as null | ((v: any) => void) };

    vi.mocked(api.listAreas).mockResolvedValue(baseAreas);
    vi.mocked(api.getArea).mockResolvedValue(baseConfig);
    vi.mocked(api.listFloors).mockResolvedValue(baseFloors);
    vi.mocked(api.getFloor).mockResolvedValue(baseConfig);
    vi.mocked(api.getHouse).mockResolvedValue(baseConfig);
    vi.mocked(api.listConditions).mockResolvedValue(conditions);
    vi.mocked(api.listExposedActions).mockResolvedValue(actions);
    vi.mocked(api.listPeriods).mockResolvedValue(periods);

    const hass = {
      connection: {
        subscribeEvents: vi.fn().mockImplementation((_cb: any, type: string) => {
          if (type === "area_registry_updated") {
            return new Promise<typeof unsubArea>((r) => {
              deferredArea.resolve = r;
            });
          }
          return new Promise<typeof unsubFloor>((r) => {
            deferredFloor.resolve = r;
          });
        }),
      },
    };

    const localEl: any = document.createElement("ambience-scopes-view");
    localEl.hass = hass;
    document.body.appendChild(localEl);
    await localEl.updateComplete;
    await new Promise((r) => setTimeout(r, 0)); // let _loadStatic + refreshes run

    // Remove BEFORE the subscriptions have resolved
    localEl.remove();

    // Now let the subscription promises resolve — element is already disconnected
    deferredArea.resolve!(unsubArea);
    deferredFloor.resolve!(unsubFloor);
    await new Promise((r) => setTimeout(r, 0));

    // The element should have called unsubscribe immediately (isConnected=false path)
    expect(unsubArea).toHaveBeenCalled();
    expect(unsubFloor).toHaveBeenCalled();
  });

  // --- _onExposedActionsChanged: silent catch path -------------------------

  test("listExposedActions failure in _onExposedActionsChanged is silently swallowed", async () => {
    el = await mount();
    vi.mocked(api.listExposedActions).mockRejectedValueOnce(new Error("network"));
    window.dispatchEvent(new CustomEvent("ambience-exposed-actions-changed"));
    await new Promise((r) => setTimeout(r, 0));
    // No error displayed — the failure is silent
    expect(el.shadowRoot.querySelector(".error")).toBeFalsy();
  });

  // --- _refreshSchemas: per-service failure is skipped ---------------------

  test("getServiceSchema failure for one action is skipped silently", async () => {
    vi.mocked(api.getServiceSchema).mockRejectedValueOnce(new Error("schema fail"));
    el = await mount();
    // No error shown; the schema is just absent from _schemas
    expect(el.shadowRoot.querySelector(".error")).toBeFalsy();
  });

  // --- _saveScene: cross-scope new scene (added:true, isNew:true = no removal) ----

  test("cross-scope save of a NEW scene does not try to remove from source", async () => {
    el = await mount();
    // Open editor for living_room (isNew=true, no source scene to remove)
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row
      .querySelector("ambience-scenes-list")!
      .dispatchEvent(new CustomEvent("add-scene", { detail: {}, bubbles: true, composed: true }));
    await el.updateComplete;
    // Save to bedroom instead (cross-scope, isNew=true)
    const editor = el.shadowRoot.querySelector("ambience-scene-editor")!;
    editor.dispatchEvent(
      new CustomEvent("save-scene", {
        detail: {
          scene: { name: "New", when: {}, actions: [] },
          scope: { kind: "area", id: "bedroom" },
        },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));
    // bedroom was saved...
    expect(api.saveArea).toHaveBeenCalledWith(expect.anything(), "bedroom", expect.anything());
    // ...but NOT living_room (no removal since isNew)
    const livingRoomCalls = vi
      .mocked(api.saveArea)
      .mock.calls.filter((c: any) => c[1] === "living_room");
    expect(livingRoomCalls.length).toBe(0);
  });

  // --- _toggleExpand: collapsing (true branch of next.has(key)) -----------

  test("clicking an already-expanded scope header collapses it", async () => {
    el = await mount();
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    const header = row.querySelector(".scope-header") as HTMLElement;
    // First click: expand
    header.click();
    await el.updateComplete;
    expect(row.querySelector(".scope-body")).toBeTruthy();
    // Second click: collapse
    header.click();
    await el.updateComplete;
    expect(row.querySelector(".scope-body")).toBeFalsy();
  });

  // --- _showTraces / _showSimulator with house scope (scope_id: null) -----

  test("show-traces on the house scope sets scope_id to null", async () => {
    el = await mount();
    el._categories = [{ id: "g", name: "G", color: null, icon: null }] as SceneCategory[];
    await el.updateComplete;
    const row = el.shadowRoot.querySelector(".scope-row.house") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-scenes-list")!.dispatchEvent(
      new CustomEvent("show-traces", {
        detail: { category: "g" },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    const modal: any = el.shadowRoot.querySelector("ambience-traces-modal");
    expect(modal.scope).toMatchObject({ scope_kind: "house", scope_id: null });
  });

  test("show-simulator on the house scope sets scope_id to null", async () => {
    el = await mount();
    el._categories = [{ id: "g", name: "G", color: null, icon: null }] as SceneCategory[];
    await el.updateComplete;
    const row = el.shadowRoot.querySelector(".scope-row.house") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-scenes-list")!.dispatchEvent(
      new CustomEvent("show-simulator", {
        detail: { category: "g" },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    const modal: any = el.shadowRoot.querySelector("ambience-simulator-modal");
    expect(modal.scope).toMatchObject({ scope_kind: "house", scope_id: null });
  });

  test("show-simulator with unknown category passes null categoryName", async () => {
    el = await mount();
    el._categories = [] as SceneCategory[];
    await el.updateComplete;
    const row = el.shadowRoot.querySelector(".scope-row.house") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-scenes-list")!.dispatchEvent(
      new CustomEvent("show-simulator", {
        detail: { category: "no_such_cat" },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    const modal: any = el.shadowRoot.querySelector("ambience-simulator-modal");
    expect(modal.open).toBe(true);
    expect(modal.categoryName).toBeNull();
  });

  // --- _saveScene: spurious save when editing is null -----------------------

  test("save-scene is a no-op when _editing is null (defensive guard)", async () => {
    el = await mount();
    // Ensure _editing is null before firing save-scene
    el._editing = null;
    const editor = el.shadowRoot.querySelector("ambience-scene-editor")!;
    editor.dispatchEvent(
      new CustomEvent("save-scene", {
        detail: { scene: { name: "Ghost", when: {}, actions: [] }, scope: { kind: "house" } },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));
    // Nothing should have been saved
    expect(api.saveHouse).not.toHaveBeenCalled();
    expect(api.saveArea).not.toHaveBeenCalled();
    expect(api.saveFloor).not.toHaveBeenCalled();
  });

  // --- reorder with skip-category neighbour scan ---------------------------

  test("reorder scans past non-category scenes to find same-category neighbours", async () => {
    // Layout: [b1(b,3072), a1(a,2048), a2(a,1024)]
    // Move a2 (from=2) to to=1. After splice(2,1): [b1, a1], then splice(1,0,a2): [b1, a2, a1]
    // Scan above: a = to-1 = 0, sameCategory(0) = b1.cat=b != a → WHILE BODY executes, a-- → a=-1
    //   above = undefined (a<0)
    // Scan below: b = to+1 = 2, sameCategory(2) = a1.cat=a = a → WHILE BODY does NOT execute
    //   below = scenes[2].priority = 2048
    // _pinPriority(undefined, 2048, [a1,a2]) → max(2048,1024)+1024 = 3072
    const cfg: ScopeConfig = {
      scenes: [
        { name: "b1", when: {}, actions: [], category: "b", priority: 3072 },
        { name: "a1", when: {}, actions: [], category: "a", priority: 2048 },
        { name: "a2", when: {}, actions: [], category: "a", priority: 1024 },
      ] as Scene[],
    };
    vi.mocked(api.saveArea).mockImplementation(async (_hass, _areaId, saved) => ({
      ok: true,
      config: saved,
    }));
    el = await mount({ areaConfigs: { living_room: structuredClone(cfg) } });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-scenes-list")!.dispatchEvent(
      new CustomEvent("reorder-scenes", {
        detail: { from: 2, to: 1 },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));
    expect(api.saveArea).toHaveBeenCalled();
    const saved: ScopeConfig = vi.mocked(api.saveArea).mock.calls.at(-1)![2];
    expect(saved.scenes[1].name).toBe("a2");
    expect(saved.scenes[1].pinned).toBe(true);
    // above=undefined (scanned past b1 to find nothing), below=2048 → top slot within category
    // max(2048,1024)+1024 = 3072
    expect(saved.scenes[1].priority).toBe(3072);
  });

  test("reorder scans past non-category below when the immediate below is different category", async () => {
    // Layout: [a1(a,3072), a2(a,2048), b1(b,1024)]
    // Move a1 (from=0) to to=1. After splice(0,1): [a2, b1], then splice(1,0,a1): [a2, a1, b1]
    // Scan above: a = to-1 = 0, sameCategory(0) = a2.cat=a = a → WHILE does NOT execute
    //   above = scenes[0].priority = 2048
    // Scan below: b = to+1 = 2, sameCategory(2) = b1.cat=b != a → WHILE BODY executes, b++ → b=3
    //   b=3 >= scenes.length=3, below = undefined
    // _pinPriority(2048, undefined, [a1,a2]) → min(3072,2048)-1024 = 1024
    const cfg: ScopeConfig = {
      scenes: [
        { name: "a1", when: {}, actions: [], category: "a", priority: 3072 },
        { name: "a2", when: {}, actions: [], category: "a", priority: 2048 },
        { name: "b1", when: {}, actions: [], category: "b", priority: 1024 },
      ] as Scene[],
    };
    vi.mocked(api.saveArea).mockImplementation(async (_hass, _areaId, saved) => ({
      ok: true,
      config: saved,
    }));
    el = await mount({ areaConfigs: { living_room: structuredClone(cfg) } });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-scenes-list")!.dispatchEvent(
      new CustomEvent("reorder-scenes", {
        detail: { from: 0, to: 1 },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));
    expect(api.saveArea).toHaveBeenCalled();
    const saved: ScopeConfig = vi.mocked(api.saveArea).mock.calls.at(-1)![2];
    expect(saved.scenes[1].name).toBe("a1");
    expect(saved.scenes[1].pinned).toBe(true);
    // above=2048, below=undefined (scanned past b1 to find nothing) → bottom slot
    // min(3072,2048)-1024 = 1024
    expect(saved.scenes[1].priority).toBe(1024);
  });

  // --- _toggleSceneEnabled with multiple scenes: non-targeted scene returned as-is ---

  test("disabling scene at index 0 in a 2-scene config leaves scene at index 1 unchanged", async () => {
    const cfg: ScopeConfig = {
      scenes: [
        { name: "A", when: {}, actions: [] },
        { name: "B", when: {}, actions: [] },
      ],
    };
    el = await mount({ areaConfigs: { living_room: cfg } });
    await toggleSceneInArea("living_room", { index: 0, enabled: false });
    const call = vi.mocked(api.saveArea).mock.calls.at(-1)!;
    const saved = (call[2] as ScopeConfig).scenes;
    expect(saved[0]).toMatchObject({ name: "A", enabled: false });
    expect(saved[1]).toMatchObject({ name: "B" });
    expect(saved[1]).not.toHaveProperty("enabled");
  });

  // --- _pinPriority: scenes with undefined priority use 0 fallback ----------

  test("reorder with scenes missing priority treats them as priority=0", async () => {
    const cfg: ScopeConfig = {
      scenes: [
        { name: "a", when: {}, actions: [], category: "x" },
        { name: "b", when: {}, actions: [], category: "x" },
      ] as Scene[],
    };
    vi.mocked(api.saveArea).mockImplementation(async (_hass, _areaId, saved) => ({
      ok: true,
      config: saved,
    }));
    el = await mount({ areaConfigs: { living_room: structuredClone(cfg) } });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-scenes-list")!.dispatchEvent(
      new CustomEvent("reorder-scenes", {
        detail: { from: 1, to: 0 },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));
    expect(api.saveArea).toHaveBeenCalled();
    // priority ?? 0 → max(0,0)+1024=1024 for top slot
    const saved: ScopeConfig = vi.mocked(api.saveArea).mock.calls.at(-1)![2];
    expect(saved.scenes[0].priority).toBe(1024);
  });

  // --- _unpin: the targeted index IS matched (ternary true branch) ---------

  test("unpin-scene: the ternary truthy branch applies pinned:false to the matched scene", async () => {
    // Two scenes: unpin index 0 — map produces [{...r0, pinned:false}, r1]
    const scenes = [
      { name: "P0", when: {}, actions: [], pinned: true, priority: 2048 },
      { name: "P1", when: {}, actions: [], pinned: true, priority: 1024 },
    ];
    el = await mount({ areaConfigs: { living_room: { scenes } } });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row
      .querySelector("ambience-scenes-list")!
      .dispatchEvent(
        new CustomEvent("unpin-scene", { detail: { index: 0 }, bubbles: true, composed: true }),
      );
    await new Promise((r) => setTimeout(r, 0));
    const call = vi.mocked(api.saveArea).mock.calls.at(-1)!;
    const saved = (call[2] as ScopeConfig).scenes;
    expect(saved[0].pinned).toBe(false);
    expect(saved[1].pinned).toBe(true); // untouched
  });

  // --- show-simulator with house scope (scope_id: null) --------------------

  test("show-simulator on a floor scope sets scope_kind to floor", async () => {
    el = await mount();
    el._categories = [{ id: "g1", name: "G1", color: null, icon: null }] as SceneCategory[];
    await el.updateComplete;
    const row = el.shadowRoot.querySelector(".scope-row.floor[data-id='ground']") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-scenes-list")!.dispatchEvent(
      new CustomEvent("show-simulator", {
        detail: { category: "g1" },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    const modal: any = el.shadowRoot.querySelector("ambience-simulator-modal");
    expect(modal.open).toBe(true);
    expect(modal.scope).toMatchObject({ scope_kind: "floor", scope_id: "ground" });
  });

  // Keep last: registering <ha-switch> is global and switches the toggle widget
  // for any mount that runs after this test.
  test("uses <ha-switch> when it is registered and toggles the enabled flag", async () => {
    if (!customElements.get("ha-switch")) {
      customElements.define("ha-switch", class extends HTMLElement {});
    }
    el = await mount({ areaConfigs: { bedroom: { scenes: [], enabled: false } } });
    const toggle = toggleIn(el.shadowRoot.querySelector(".scope-row.area[data-id='bedroom']"));
    expect(toggle.tagName.toLowerCase()).toBe("ha-switch");
    toggle.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    expect(api.setScopeEnabled).toHaveBeenCalledWith(
      expect.anything(),
      { kind: "area", id: "bedroom" },
      true,
    );
    expect(el.hass.callService).not.toHaveBeenCalled();
  });
});
