import { describe, test, expect, afterEach, vi, beforeEach } from "vitest";
import "../frontend/src/views/scopes-view";
import type {
  AreaListItem,
  ExposedAction,
  FloorListItem,
  MatcherInfo,
  PeriodStoreView,
  Rule,
  RuleGroup,
  Scope,
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
  listGroups: vi.fn(async () => []),
  getServiceSchema: vi.fn(async () => ({})),
  listPeriods: vi.fn(),
  getDayConfig: vi.fn(async () => ({ workday_sensor: null, workday_calendar: null })),
  getWeatherConfig: vi.fn(async () => ({ entity: null, groups: [] })),
  listAutoTriggers: vi.fn(async () => ({ triggers: [], opaque: false })),
  setAutoTrigger: vi.fn(async () => ({ ok: true })),
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

const baseConfig: ScopeConfig = { rules: [] };

const matchers: MatcherInfo[] = [
  { name: "mode", description: "", predicate_help: "", input: "text", priority: 0 },
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
    scope: Scope,
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
        detail: { rule: { name: "New rule", when: {}, actions: [] }, scope },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));
  }

  test("save-rule on an area routes to saveArea", async () => {
    el = await mount();
    await expandAndAddRuleToScope(".scope-row.area[data-id='living_room']", { kind: "area", id: "living_room" });
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
    await expandAndAddRuleToScope(".scope-row.floor[data-id='ground']", { kind: "floor", id: "ground" });
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
    await expandAndAddRuleToScope(".scope-row.house", { kind: "house" });
    expect(api.saveHouse).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        rules: [{ name: "New rule", when: {}, actions: [] }],
      }),
    );
    expect(api.saveArea).not.toHaveBeenCalled();
    expect(api.saveFloor).not.toHaveBeenCalled();
  });

  // --- cross-scope move ---------------------------------------------------

  async function editRuleViaEditor(
    scopeRowSelector: string,
    index: number,
    detail: { rule: Rule; scope: Scope },
  ): Promise<void> {
    const row = el.shadowRoot.querySelector(scopeRowSelector) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    const rulesList = row.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("edit-rule", { detail: { index }, bubbles: true, composed: true }),
    );
    await el.updateComplete;
    const editor = el.shadowRoot.querySelector("ambience-rule-editor")!;
    editor.dispatchEvent(
      new CustomEvent("save-rule", { detail, bubbles: true, composed: true }),
    );
    await new Promise((r) => setTimeout(r, 0));
  }

  test("editing a rule to a different scope adds to the new and removes from the old", async () => {
    const rule: Rule = { name: "R", when: {}, actions: [] };
    el = await mount({ areaConfigs: { living_room: { rules: [rule] } } });
    await editRuleViaEditor(
      ".scope-row.area[data-id='living_room']",
      0,
      { rule, scope: { kind: "area", id: "bedroom" } },
    );
    // Added to bedroom...
    expect(api.saveArea).toHaveBeenCalledWith(
      expect.anything(),
      "bedroom",
      expect.objectContaining({ rules: [expect.objectContaining({ name: "R" })] }),
    );
    // ...and removed from living_room.
    expect(api.saveArea).toHaveBeenCalledWith(
      expect.anything(),
      "living_room",
      expect.objectContaining({ rules: [] }),
    );
  });

  test("a rule moved to a new scope has its ordering metadata stripped", async () => {
    const rule: Rule = {
      name: "R", when: {}, actions: [], priority: 50, pinned: true, shadowed_by: 1,
    };
    el = await mount({ areaConfigs: { living_room: { rules: [rule] } } });
    await editRuleViaEditor(
      ".scope-row.area[data-id='living_room']",
      0,
      { rule, scope: { kind: "house" } },
    );
    const houseCall = vi.mocked(api.saveHouse).mock.calls.at(-1)!;
    const landed = (houseCall[1] as ScopeConfig).rules[0] as Rule;
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

  test("expanded scope renders an auto-triggers section", async () => {
    el = await mount();
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    expect(row.querySelector("ambience-auto-triggers-section")).toBeTruthy();
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
    el = await mount({
      areaConfigs: {
        living_room: { rules: [{ name: "Rule A", when: {}, actions: [] }] },
      },
    });

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
    await el.updateComplete;

    expect(el.shadowRoot.querySelector(".error")).toBeTruthy();
  });

  test("dropping a rule to the top slot pins it above the max priority", async () => {
    const cfg: ScopeConfig = {
      rules: [
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

    const rulesList = row.querySelector("ambience-rules-list")!;
    // Move rule at index 2 ("c") to index 0 (the top slot)
    rulesList.dispatchEvent(
      new CustomEvent("reorder-rules", {
        detail: { from: 2, to: 0 },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));

    expect(api.saveArea).toHaveBeenCalled();
    const savedConfig: ScopeConfig = vi.mocked(api.saveArea).mock.calls.at(-1)![2];
    const movedRule = savedConfig.rules[0];
    expect(movedRule.name).toBe("c");
    expect(movedRule.pinned).toBe(true);
    // Top slot: above=undefined, below=3072 → max(3072,2048,1024) + 1024 = 4096
    expect(movedRule.priority).toBe(4096);
    expect(movedRule.priority).toBeGreaterThan(3072);
  });

  test("dropping a rule to a middle slot pins it at the midpoint priority", async () => {
    const cfg: ScopeConfig = {
      rules: [
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

    const rulesList = row.querySelector("ambience-rules-list")!;
    // Move rule at index 2 ("c") to index 1.
    // After splice: [a:3072, c, b:2048] → above=rules[0].priority=3072, below=rules[2].priority=2048
    // _pinPriority(3072, 2048, original) → Math.floor((3072+2048)/2) = 2560
    rulesList.dispatchEvent(
      new CustomEvent("reorder-rules", {
        detail: { from: 2, to: 1 },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));

    expect(api.saveArea).toHaveBeenCalled();
    const savedConfig: ScopeConfig = vi.mocked(api.saveArea).mock.calls.at(-1)![2];
    const movedRule = savedConfig.rules[1];
    expect(movedRule.name).toBe("c");
    expect(movedRule.pinned).toBe(true);
    // Midpoint between a(3072) and b(2048): Math.floor((3072+2048)/2) = 2560
    expect(movedRule.priority).toBe(2560);
  });

  test("dropping a rule to the bottom slot pins it below the min priority", async () => {
    const cfg: ScopeConfig = {
      rules: [
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

    const rulesList = row.querySelector("ambience-rules-list")!;
    // Move rule at index 0 ("a") to index 2 (the bottom slot).
    // After splice(0,1): [b:2048, c:1024], then splice(2,0,a): [b:2048, c:1024, a]
    // above=rules[1].priority=1024, below=rules[3]=undefined
    // _pinPriority(1024, undefined, original) → min(3072,2048,1024) - 1024 = 0
    rulesList.dispatchEvent(
      new CustomEvent("reorder-rules", {
        detail: { from: 0, to: 2 },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));

    expect(api.saveArea).toHaveBeenCalled();
    const savedConfig: ScopeConfig = vi.mocked(api.saveArea).mock.calls.at(-1)![2];
    const movedRule = savedConfig.rules[2];
    expect(movedRule.name).toBe("a");
    expect(movedRule.pinned).toBe(true);
    // Bottom slot: above=1024, below=undefined → min(3072,2048,1024) - 1024 = 0
    expect(movedRule.priority).toBe(0);
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

  // --- global group filter ------------------------------------------------

  test("renders a global group filter only when >1 group", async () => {
    el = await mount();
    el._groups = [
      { id: "a", name: "Awn" },
      { id: "b", name: "Bee" },
    ] as RuleGroup[];
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".group-filter-trigger")).toBeTruthy();

    el._groups = [{ id: "a", name: "Awn" }] as RuleGroup[];
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".group-filter-trigger")).toBeNull();
  });

  test("the filter dropdown lists colour-coded swatch+icon+name options and selecting one sets the filter", async () => {
    el = await mount();
    el._groups = [
      { id: "a", name: "Awn", color: "green", icon: "mdi:blinds" },
      { id: "b", name: "Bee" },
    ] as RuleGroup[];
    await el.updateComplete;
    // Open the menu.
    (el.shadowRoot.querySelector(".group-filter-trigger") as HTMLButtonElement).click();
    await el.updateComplete;
    const options = Array.from(el.shadowRoot.querySelectorAll(".group-filter-option")) as HTMLElement[];
    // All groups + 2 groups.
    expect(options.length).toBe(3);
    // The "Awn" option carries a coloured swatch with its icon.
    const awn = options.find((o) => o.textContent!.includes("Awn"))!;
    const swatch = awn.querySelector(".group-swatch") as HTMLElement;
    expect((swatch.getAttribute("style") || "")).toContain("#4caf50");
    expect(swatch.querySelector('ha-icon[icon="mdi:blinds"]')).toBeTruthy();
    // Selecting it sets the filter and closes the menu.
    awn.click();
    await el.updateComplete;
    expect(el._filterGroup).toBe("a");
    expect(el.shadowRoot.querySelector(".group-filter-menu")).toBeNull();
  });

  test("per-scope summary counts rules matching the active filter", async () => {
    el = await mount();
    const cfg = {
      rules: [
        { when: {}, actions: [], group: "a" },
        { when: {}, actions: [], group: "b" },
        { when: {}, actions: [], group: "a" },
      ],
    };
    el._filterGroup = "";
    expect(el._summary(cfg)).toBe("3 rules");
    el._filterGroup = "a";
    expect(el._summary(cfg)).toBe("2 rules");
    el._filterGroup = "b";
    expect(el._summary(cfg)).toBe("1 rule");
    // A genuinely empty scope is always "not configured".
    expect(el._summary({ rules: [] })).toBe("not configured");
    // A scope with rules but none in the active filter shows "0 rules".
    el._filterGroup = "c";
    expect(el._summary(cfg)).toBe("0 rules");
  });

  test("a new rule defaults to the active filtered group", async () => {
    el = await mount();
    el._groups = [
      { id: "a", name: "Awn" },
      { id: "b", name: "Bee" },
    ] as RuleGroup[];
    el._filterGroup = "b";
    await el.updateComplete;
    el._addRule({ kind: "house" });
    expect(el._editingRule.group).toBe("b");
  });

  test("a new rule under All defaults to the alphabetically-first group", async () => {
    el = await mount();
    el._filterGroup = "";
    el._groups = [
      { id: "z", name: "Zed" },
      { id: "a", name: "Awn" },
    ] as RuleGroup[];
    await el.updateComplete;
    el._addRule({ kind: "house" });
    expect(el._editingRule.group).toBe("a");
  });

  test("reorder rejects a cross-group drop (no mutation)", async () => {
    const cfg: ScopeConfig = {
      rules: [
        { name: "a", when: {}, actions: [], group: "a", priority: 2048 },
        { name: "b", when: {}, actions: [], group: "b", priority: 1024 },
      ] as Rule[],
    };
    el = await mount({ houseConfig: structuredClone(cfg) });
    vi.clearAllMocks();

    el._reorderRules({ kind: "house" }, {
      detail: { from: 0, to: 1 },
    } as CustomEvent<{ from: number; to: number }>);
    await new Promise((r) => setTimeout(r, 0));

    expect(api.saveHouse).not.toHaveBeenCalled();
    const stored = el._getConfig({ kind: "house" });
    expect(stored.rules.map((r: Rule) => r.name)).toEqual(["a", "b"]);
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
