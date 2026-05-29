import { describe, test, expect, afterEach, vi, beforeEach } from "vitest";
import "../frontend/src/views/scopes-view";
import type {
  AreaListItem,
  ExposedAction,
  FloorListItem,
  MatcherInfo,
  PeriodStoreView,
  Rule,
  ScopeConfig,
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
  listMatchers: vi.fn(),
  listExposedActions: vi.fn(),
  listPeriods: vi.fn(),
  getDayConfig: vi.fn(async () => ({ workday_sensor: null, workday_calendar: null })),
  getWeatherConfig: vi.fn(async () => ({ entity: null, groups: [] })),
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

const baseConfig: ScopeConfig = { rules: [], auto_sort: true };

const matchers: MatcherInfo[] = [
  { name: "scene", description: "", predicate_help: "", input: "scene_combobox", priority: 0 },
  { name: "time_of_day", description: "", predicate_help: "", input: "time_of_day", priority: 200 },
];

const actions: ExposedAction[] = [
  { id: "light.turn_on", label: "Set light", visible_fields: [], defaults: {} },
];

const periods: PeriodStoreView = { builtins: {}, custom: {}, hidden: [] };

function makeFakeHass() {
  return {
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
};

async function mount(opts: MountOpts = {}): Promise<any> {
  const areas = opts.areas ?? baseAreas;
  const floors = opts.floors ?? baseFloors;
  const areaConfigs = opts.areaConfigs ?? {};
  const floorConfigs = opts.floorConfigs ?? {};
  const houseConfig = opts.houseConfig ?? structuredClone(baseConfig);

  vi.mocked(api.listAreas).mockResolvedValue(areas);
  vi.mocked(api.getArea).mockImplementation(async (_hass, areaId) =>
    areaConfigs[areaId] ?? structuredClone(baseConfig),
  );
  vi.mocked(api.listFloors).mockResolvedValue(floors);
  vi.mocked(api.getFloor).mockImplementation(async (_hass, floorId) =>
    floorConfigs[floorId] ?? structuredClone(baseConfig),
  );
  vi.mocked(api.getHouse).mockResolvedValue(houseConfig);
  vi.mocked(api.listMatchers).mockResolvedValue(matchers);
  vi.mocked(api.listExposedActions).mockResolvedValue(actions);
  vi.mocked(api.listPeriods).mockResolvedValue(periods);
  vi.mocked(api.saveArea).mockResolvedValue({ ok: true, config: baseConfig });
  vi.mocked(api.saveFloor).mockResolvedValue({ ok: true, config: baseConfig });
  vi.mocked(api.saveHouse).mockResolvedValue({ ok: true, config: baseConfig });

  const el: any = document.createElement("ambience-scopes-view");
  el.hass = makeFakeHass();
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
  });

  afterEach(() => {
    el?.remove();
  });

  // --- row labels ---------------------------------------------------------

  test("renders the Global row for the house scope", async () => {
    el = await mount();
    const houseRow = el.shadowRoot.querySelector(".scope-row.house");
    expect(houseRow).toBeTruthy();
    expect(houseRow.textContent).toContain("Global");
  });

  test("renders one row per HA area with 'Area: ' prefix", async () => {
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("Area: Living Room");
    expect(el.shadowRoot.textContent).toContain("Area: Bedroom");
  });

  test("renders one row per HA floor with 'Floor: ' prefix", async () => {
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("Floor: Ground");
    expect(el.shadowRoot.textContent).toContain("Floor: Upstairs");
  });

  test("no floor rows render when listFloors returns []", async () => {
    el = await mount({ floors: [] });
    const floorRows = el.shadowRoot.querySelectorAll(".scope-row.floor");
    expect(floorRows.length).toBe(0);
  });

  // --- ordering -----------------------------------------------------------

  test("flat list order: Global first, then floors, then areas", async () => {
    el = await mount();
    const rows = Array.from(
      el.shadowRoot.querySelectorAll(".scope-row"),
    ) as HTMLElement[];
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

  async function expandAndAddRuleToScope(
    scopeRowSelector: string,
  ): Promise<void> {
    const row = el.shadowRoot.querySelector(scopeRowSelector) as HTMLElement;
    const header = row.querySelector(".scope-header") as HTMLElement;
    header.click();
    await el.updateComplete;
    const rulesList = row.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("add-rule", { detail: {}, bubbles: true, composed: true }),
    );
    await el.updateComplete;
    const editor = el.shadowRoot.querySelector("ambience-rule-editor")!;
    editor.dispatchEvent(
      new CustomEvent("save-rule", {
        detail: { name: "New rule", when: {}, actions: [] },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));
  }

  test("save-rule on an area routes to saveArea", async () => {
    el = await mount();
    await expandAndAddRuleToScope(".scope-row.area[data-id='living_room']");
    expect(api.saveArea).toHaveBeenCalledWith(
      expect.anything(),
      "living_room",
      expect.objectContaining({
        rules: [{ name: "New rule", when: {}, actions: [] }],
      }),
    );
    expect(api.saveFloor).not.toHaveBeenCalled();
    expect(api.saveHouse).not.toHaveBeenCalled();
  });

  test("save-rule on a floor routes to saveFloor", async () => {
    el = await mount();
    await expandAndAddRuleToScope(".scope-row.floor[data-id='ground']");
    expect(api.saveFloor).toHaveBeenCalledWith(
      expect.anything(),
      "ground",
      expect.objectContaining({
        rules: [{ name: "New rule", when: {}, actions: [] }],
      }),
    );
    expect(api.saveArea).not.toHaveBeenCalled();
    expect(api.saveHouse).not.toHaveBeenCalled();
  });

  test("save-rule on the house routes to saveHouse", async () => {
    el = await mount();
    await expandAndAddRuleToScope(".scope-row.house");
    expect(api.saveHouse).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        rules: [{ name: "New rule", when: {}, actions: [] }],
      }),
    );
    expect(api.saveArea).not.toHaveBeenCalled();
    expect(api.saveFloor).not.toHaveBeenCalled();
  });

  // --- subscriptions ------------------------------------------------------

  test("subscribes to both area_registry_updated and floor_registry_updated", async () => {
    el = await mount();
    const calls = vi.mocked(el.hass.connection.subscribeEvents).mock.calls;
    const eventTypes = calls.map((c: any) => c[1]);
    expect(eventTypes).toContain("area_registry_updated");
    expect(eventTypes).toContain("floor_registry_updated");
  });

  test("area_registry_updated remove clears that area's expanded/editing state", async () => {
    el = await mount();
    const subCall = vi.mocked(el.hass.connection.subscribeEvents);
    const areaCallback = subCall.mock.calls.find(
      (c: any) => c[1] === "area_registry_updated",
    )?.[0];
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
    const row = el.shadowRoot.querySelector(
      ".scope-row.floor[data-id='ground']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;

    vi.mocked(api.listFloors).mockResolvedValue([baseFloors[1]]);
    floorCallback({ data: { action: "remove", floor_id: "ground" } });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(el.shadowRoot.textContent).not.toContain("Ground");
  });

  // --- rule preservation (regression for the existing area behaviour) -----

  test("delete-rule on an area calls saveArea with the rule removed", async () => {
    const cfg: ScopeConfig = {
      rules: [
        { name: "Rule A", when: {}, actions: [] },
        { name: "Rule B", when: {}, actions: [] },
      ],
      auto_sort: false,
    };
    el = await mount({ areaConfigs: { living_room: cfg } });

    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;

    const rulesList = row.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("delete-rule", {
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
        rules: [{ name: "Rule B", when: {}, actions: [] }],
      }),
    );
  });

  test("saveArea error is displayed", async () => {
    vi.mocked(api.saveArea).mockRejectedValueOnce(new Error("Save failed"));
    el = await mount();

    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;

    // The autosort checkbox now lives inside <ambience-rules-list>'s shadow
    // DOM. Dispatch the public toggle-autosort event on the rules-list
    // element directly — that's what scopes-view listens for.
    const rulesList = row.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("toggle-autosort", {
        detail: { manual: true },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(el.shadowRoot.querySelector(".error")).toBeTruthy();
  });

  test("editor receives a Scope object (kind + id) for an area", async () => {
    el = await mount();
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;

    const rulesList = row.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("add-rule", { detail: {}, bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const editor = el.shadowRoot.querySelector("ambience-rule-editor") as any;
    expect(editor.scope).toEqual({ kind: "area", id: "living_room" });
  });

  test("editor receives a Scope object for the house", async () => {
    el = await mount();
    const row = el.shadowRoot.querySelector(".scope-row.house") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;

    const rulesList = row.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("add-rule", { detail: {}, bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const editor = el.shadowRoot.querySelector("ambience-rule-editor") as any;
    expect(editor.scope).toEqual({ kind: "house" });
  });

  test("editor receives a Scope object for a floor", async () => {
    el = await mount();
    const row = el.shadowRoot.querySelector(
      ".scope-row.floor[data-id='ground']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;

    const rulesList = row.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("add-rule", { detail: {}, bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const editor = el.shadowRoot.querySelector("ambience-rule-editor") as any;
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

  test("disconnectedCallback unsubscribes from both registries", async () => {
    const unsubArea = vi.fn();
    const unsubFloor = vi.fn();
    let i = 0;
    vi.mocked(api.listAreas).mockResolvedValue(baseAreas);
    vi.mocked(api.getArea).mockResolvedValue(baseConfig);
    vi.mocked(api.listFloors).mockResolvedValue(baseFloors);
    vi.mocked(api.getFloor).mockResolvedValue(baseConfig);
    vi.mocked(api.getHouse).mockResolvedValue(baseConfig);
    vi.mocked(api.listMatchers).mockResolvedValue(matchers);
    vi.mocked(api.listExposedActions).mockResolvedValue(actions);
    vi.mocked(api.listPeriods).mockResolvedValue(periods);

    const hass = {
      connection: {
        subscribeEvents: vi.fn().mockImplementation(async (_cb, type) => {
          i++;
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
});
