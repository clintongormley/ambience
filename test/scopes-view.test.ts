import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import "../frontend/src/views/scopes-view";
import type {
  AreaListItem,
  ConditionInfo,
  ExposedAction,
  FloorListItem,
  PeriodStoreView,
  Rule,
  RuleCategory,
  Scope,
  ScopeConfig,
  ScopeSwitch,
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
  listSwitches: vi.fn(async () => []),
  listConditions: vi.fn(),
  listExposedActions: vi.fn(),
  listCategories: vi.fn(async () => []),
  getServiceSchema: vi.fn(async () => ({})),
  listPeriods: vi.fn(),
  getDayConfig: vi.fn(async () => ({ workday_sensor: null, workday_calendar: null })),
  getWeatherConfig: vi.fn(async () => ({ entity: null, groups: [] })),
  applyRules: vi.fn(async () => ({ ok: true })),
  runRuleActions: vi.fn(async () => ({ ran: 1, rule_name: "R" })),
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

const conditions: ConditionInfo[] = [
  { name: "mode", description: "", predicate_help: "", input: "text", priority: 0 },
  { name: "time_of_day", description: "", predicate_help: "", input: "time_of_day", priority: 200 },
];

const actions: ExposedAction[] = [
  { id: "light.turn_on", label: "Set light", visible_fields: [], defaults: {} },
];

const periods: PeriodStoreView = { builtins: {}, custom: {}, hidden: [] };

function makeFakeHass(states: Record<string, { state?: string }> = {}) {
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
  states?: Record<string, { state?: string }>;
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
  vi.mocked(api.listExposedActions).mockResolvedValue(actions);
  vi.mocked(api.listPeriods).mockResolvedValue(periods);
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

  async function expandAndAddRuleToScope(scopeRowSelector: string, scope: Scope): Promise<void> {
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
    await expandAndAddRuleToScope(".scope-row.area[data-id='living_room']", {
      kind: "area",
      id: "living_room",
    });
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
    await expandAndAddRuleToScope(".scope-row.floor[data-id='ground']", {
      kind: "floor",
      id: "ground",
    });
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
    editor.dispatchEvent(new CustomEvent("save-rule", { detail, bubbles: true, composed: true }));
    await new Promise((r) => setTimeout(r, 0));
  }

  test("editing a rule to a different scope adds to the new and removes from the old", async () => {
    const rule: Rule = { name: "R", when: {}, actions: [] };
    el = await mount({ areaConfigs: { living_room: { rules: [rule] } } });
    await editRuleViaEditor(".scope-row.area[data-id='living_room']", 0, {
      rule,
      scope: { kind: "area", id: "bedroom" },
    });
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

  test("a failed move to a new scope leaves the rule in its original scope", async () => {
    const rule: Rule = { name: "R", when: {}, actions: [] };
    el = await mount({ areaConfigs: { living_room: { rules: [rule] } } });
    // Target (house) save fails.
    vi.mocked(api.saveHouse).mockRejectedValueOnce(new Error("boom"));
    await editRuleViaEditor(".scope-row.area[data-id='living_room']", 0, {
      rule,
      scope: { kind: "house" },
    });
    // Target add was attempted...
    expect(api.saveHouse).toHaveBeenCalledTimes(1);
    // ...but since it failed, the source rule was NOT removed (no saveArea call).
    expect(api.saveArea).not.toHaveBeenCalled();
  });

  test("a rule moved to a new scope has its ordering metadata stripped", async () => {
    const rule: Rule = {
      name: "R",
      when: {},
      actions: [],
      priority: 50,
      pinned: true,
      shadowed_by: 1,
    };
    el = await mount({ areaConfigs: { living_room: { rules: [rule] } } });
    await editRuleViaEditor(".scope-row.area[data-id='living_room']", 0, {
      rule,
      scope: { kind: "house" },
    });
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

  // --- duplicate ----------------------------------------------------------

  test("duplicate opens the editor with a clone and saves nothing until confirmed", async () => {
    const rule: Rule = { name: "Orig", when: {}, actions: [] };
    el = await mount({ areaConfigs: { living_room: { rules: [rule] } } });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    const rulesList = row.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("duplicate-rule", { detail: { index: 0 }, bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const editor: any = el.shadowRoot.querySelector("ambience-rule-editor");
    expect(editor.open).toBe(true);
    expect(editor.rule).toEqual(rule); // equal-by-value clone
    expect(editor.rule).not.toBe(rule); // but not the same object
    expect(api.saveArea).not.toHaveBeenCalled();
  });

  test("duplicating a pinned rule drops the pin and its fixed priority", async () => {
    const rule: Rule = {
      name: "Pinned",
      when: {},
      actions: [],
      category: "a",
      pinned: true,
      priority: 4096,
    };
    el = await mount({ areaConfigs: { living_room: { rules: [rule] } } });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    const rulesList = row.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("duplicate-rule", { detail: { index: 0 }, bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const editor: any = el.shadowRoot.querySelector("ambience-rule-editor");
    expect(editor.rule.pinned).toBeUndefined();
    expect(editor.rule.priority).toBeUndefined();
    expect(editor.rule.category).toBe("a"); // category is preserved
    // the original is untouched
    expect(rule.pinned).toBe(true);
  });

  test("duplicate makes the destination area directly editable", async () => {
    const rule: Rule = { name: "Orig", when: {}, actions: [], category: "a" };
    el = await mount({ areaConfigs: { living_room: { rules: [rule] } } });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    const rulesList = row.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("duplicate-rule", { detail: { index: 0 }, bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const editor: any = el.shadowRoot.querySelector("ambience-rule-editor");
    expect(editor.autoEditScope).toBe(true);
  });

  test("editing an existing rule does not auto-open the destination", async () => {
    const rule: Rule = { name: "Orig", when: {}, actions: [], category: "a" };
    el = await mount({ areaConfigs: { living_room: { rules: [rule] } } });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    const rulesList = row.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("edit-rule", { detail: { index: 0 }, bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const editor: any = el.shadowRoot.querySelector("ambience-rule-editor");
    expect(editor.autoEditScope).toBe(false);
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
    const row = el.shadowRoot.querySelector(".scope-row.floor[data-id='ground']") as HTMLElement;
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

  // --- global category filter ------------------------------------------------

  test("renders a global category filter only when >1 category", async () => {
    el = await mount();
    el._categories = [
      { id: "a", name: "Awn" },
      { id: "b", name: "Bee" },
    ] as RuleCategory[];
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".category-filter-trigger")).toBeTruthy();

    el._categories = [{ id: "a", name: "Awn" }] as RuleCategory[];
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".category-filter-trigger")).toBeNull();
  });

  test("the filter dropdown lists colour-coded swatch+icon+name options and selecting one sets the filter", async () => {
    el = await mount();
    el._categories = [
      { id: "a", name: "Awn", color: "green", icon: "mdi:blinds" },
      { id: "b", name: "Bee" },
    ] as RuleCategory[];
    await el.updateComplete;
    // Open the menu.
    (el.shadowRoot.querySelector(".category-filter-trigger") as HTMLButtonElement).click();
    await el.updateComplete;
    const options = Array.from(
      el.shadowRoot.querySelectorAll(".category-filter-option"),
    ) as HTMLElement[];
    // All categories + 2 categories.
    expect(options.length).toBe(3);
    // The "Awn" option carries a coloured swatch with its icon.
    const awn = options.find((o) => o.textContent!.includes("Awn"))!;
    const swatch = awn.querySelector(".category-swatch") as HTMLElement;
    expect(swatch.getAttribute("style") || "").toContain("#4caf50");
    expect(swatch.querySelector('ha-icon[icon="mdi:blinds"]')).toBeTruthy();
    // Selecting it sets the filter and closes the menu.
    awn.click();
    await el.updateComplete;
    expect(el._filterCategory).toBe("a");
    expect(el.shadowRoot.querySelector(".category-filter-menu")).toBeNull();
  });

  test("per-scope summary counts rules matching the active filter", async () => {
    el = await mount();
    const cfg = {
      rules: [
        { when: {}, actions: [], category: "a" },
        { when: {}, actions: [], category: "b" },
        { when: {}, actions: [], category: "a" },
      ],
    };
    el._filterCategory = "";
    expect(el._summary(cfg)).toBe("3 rules");
    el._filterCategory = "a";
    expect(el._summary(cfg)).toBe("2 rules");
    el._filterCategory = "b";
    expect(el._summary(cfg)).toBe("1 rule");
    // A genuinely empty scope is always "not configured".
    expect(el._summary({ rules: [] })).toBe("not configured");
    // A scope with rules but none in the active filter shows "0 rules".
    el._filterCategory = "c";
    expect(el._summary(cfg)).toBe("0 rules");
  });

  test("a new rule defaults to the active filtered category", async () => {
    el = await mount();
    el._categories = [
      { id: "a", name: "Awn" },
      { id: "b", name: "Bee" },
    ] as RuleCategory[];
    el._filterCategory = "b";
    await el.updateComplete;
    el._addRule({ kind: "house" });
    expect(el._editingRule.category).toBe("b");
  });

  test("a new rule under All defaults to the alphabetically-first category", async () => {
    el = await mount();
    el._filterCategory = "";
    el._categories = [
      { id: "z", name: "Zed" },
      { id: "a", name: "Awn" },
    ] as RuleCategory[];
    await el.updateComplete;
    el._addRule({ kind: "house" });
    expect(el._editingRule.category).toBe("a");
  });

  test("reorder rejects a cross-category drop (no mutation)", async () => {
    const cfg: ScopeConfig = {
      rules: [
        { name: "a", when: {}, actions: [], category: "a", priority: 2048 },
        { name: "b", when: {}, actions: [], category: "b", priority: 1024 },
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

  test("renders a toggle per scope reflecting the switch state", async () => {
    el = await mount({
      switches: baseSwitches,
      states: {
        "switch.living_room_ambience": { state: "on" },
        "switch.bedroom_ambience": { state: "off" },
      },
    });
    const lr = toggleIn(el.shadowRoot.querySelector(".scope-row.area[data-id='living_room']"));
    const br = toggleIn(el.shadowRoot.querySelector(".scope-row.area[data-id='bedroom']"));
    expect(lr).toBeTruthy();
    expect(br).toBeTruthy();
    expect(lr.checked).toBe(true);
    expect(br.checked).toBe(false);
  });

  test("toggling an off switch calls switch.turn_on for its entity", async () => {
    el = await mount({
      switches: baseSwitches,
      states: { "switch.bedroom_ambience": { state: "off" } },
    });
    const br = toggleIn(el.shadowRoot.querySelector(".scope-row.area[data-id='bedroom']"));
    br.checked = true;
    br.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    expect(el.hass.callService).toHaveBeenCalledWith("switch", "turn_on", {
      entity_id: "switch.bedroom_ambience",
    });
  });

  test("toggling an on switch calls switch.turn_off for its entity", async () => {
    el = await mount({
      switches: baseSwitches,
      states: { "switch.living_room_ambience": { state: "on" } },
    });
    const lr = toggleIn(el.shadowRoot.querySelector(".scope-row.area[data-id='living_room']"));
    lr.checked = false;
    lr.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    expect(el.hass.callService).toHaveBeenCalledWith("switch", "turn_off", {
      entity_id: "switch.living_room_ambience",
    });
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

  test("renders no toggle for a scope with no known switch entity", async () => {
    el = await mount({
      switches: [
        { scope_kind: "area", scope_id: "living_room", entity_id: "switch.living_room_ambience" },
      ],
    });
    const br = toggleIn(el.shadowRoot.querySelector(".scope-row.area[data-id='bedroom']"));
    expect(br).toBeFalsy();
  });

  // --- apply-rules / run-rule-actions ----------------------------------------

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

  test("kebab Run calls api.applyRules for that scope", async () => {
    el = await mount();
    await pickScopeKebab(el, "li.scope-row.house", "run");
    expect(vi.mocked(api.applyRules)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(api.applyRules).mock.calls[0][1]).toEqual({ kind: "house" });
  });

  test("run-rule-actions event from a rule list calls api.runRuleActions", async () => {
    el = await mount({
      areaConfigs: {
        living_room: { rules: [{ name: "R", category: "g", when: {}, actions: [] }] },
      },
    });
    const header = el.shadowRoot.querySelector(
      "li.scope-row.area[data-id='living_room'] .scope-header",
    ) as HTMLElement;
    header.click();
    await el.updateComplete;
    const list = el.shadowRoot.querySelector(
      "li.scope-row.area[data-id='living_room'] ambience-rules-list",
    ) as HTMLElement;
    expect(list).toBeTruthy();
    list.dispatchEvent(
      new CustomEvent("run-rule-actions", {
        detail: { index: 0 },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    expect(vi.mocked(api.runRuleActions)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(api.runRuleActions).mock.calls[0][1]).toEqual({
      kind: "area",
      id: "living_room",
    });
    expect(vi.mocked(api.runRuleActions).mock.calls[0][2]).toBe(0);
  });

  test("apply-category event calls api.applyRules with the category id", async () => {
    el = await mount({
      areaConfigs: {
        living_room: { rules: [{ name: "R", category: "g", when: {}, actions: [] }] },
      },
    });
    const header = el.shadowRoot.querySelector(
      "li.scope-row.area[data-id='living_room'] .scope-header",
    ) as HTMLElement;
    header.click();
    await el.updateComplete;
    const list = el.shadowRoot.querySelector(
      "li.scope-row.area[data-id='living_room'] ambience-rules-list",
    ) as HTMLElement;
    list.dispatchEvent(
      new CustomEvent("apply-category", {
        detail: { categoryId: "g" },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    expect(vi.mocked(api.applyRules)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(api.applyRules).mock.calls[0][1]).toEqual({
      kind: "area",
      id: "living_room",
    });
    expect(vi.mocked(api.applyRules).mock.calls[0][2]).toBe("g");
  });

  // --- rule enable/disable toggle -----------------------------------------

  async function toggleRuleInArea(
    areaId: string,
    detail: { index: number; enabled: boolean },
  ): Promise<void> {
    const row = el.shadowRoot.querySelector(`.scope-row.area[data-id='${areaId}']`) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    const rulesList = row.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("toggle-rule-enabled", { detail, bubbles: true, composed: true }),
    );
    await new Promise((r) => setTimeout(r, 0));
  }

  test("disabling a rule saves enabled:false on that rule", async () => {
    el = await mount({
      areaConfigs: { living_room: { rules: [{ name: "R", when: {}, actions: [] }] } },
    });
    await toggleRuleInArea("living_room", { index: 0, enabled: false });
    expect(api.saveArea).toHaveBeenCalledWith(
      expect.anything(),
      "living_room",
      expect.objectContaining({ rules: [expect.objectContaining({ name: "R", enabled: false })] }),
    );
  });

  test("re-enabling a rule removes the enabled key", async () => {
    el = await mount({
      areaConfigs: {
        living_room: { rules: [{ name: "R", when: {}, actions: [], enabled: false }] },
      },
    });
    await toggleRuleInArea("living_room", { index: 0, enabled: true });
    const call = vi.mocked(api.saveArea).mock.calls.at(-1)!;
    const savedRule = (call[2] as ScopeConfig).rules[0];
    expect(savedRule).not.toHaveProperty("enabled");
    expect(savedRule).toMatchObject({ name: "R" });
  });

  // --- cancel-rule ---------------------------------------------------------

  test("cancel-rule closes the editor without saving", async () => {
    el = await mount({
      areaConfigs: { living_room: { rules: [{ name: "R", when: {}, actions: [] }] } },
    });
    vi.clearAllMocks();
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    // Open the editor
    row
      .querySelector("ambience-rules-list")!
      .dispatchEvent(new CustomEvent("add-rule", { detail: {}, bubbles: true, composed: true }));
    await el.updateComplete;
    const editor: any = el.shadowRoot.querySelector("ambience-rule-editor");
    expect(editor.open).toBe(true);
    // Fire cancel-rule
    editor.dispatchEvent(new CustomEvent("cancel-rule", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(editor.open).toBe(false);
    expect(api.saveArea).not.toHaveBeenCalled();
  });

  // --- unpin-rule ----------------------------------------------------------

  test("unpin-rule sets pinned:false on the targeted rule and saves", async () => {
    const rule: Rule = { name: "Pinned", when: {}, actions: [], pinned: true, priority: 1024 };
    el = await mount({ areaConfigs: { living_room: { rules: [rule] } } });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row
      .querySelector("ambience-rules-list")!
      .dispatchEvent(
        new CustomEvent("unpin-rule", { detail: { index: 0 }, bubbles: true, composed: true }),
      );
    await new Promise((r) => setTimeout(r, 0));
    expect(api.saveArea).toHaveBeenCalledWith(
      expect.anything(),
      "living_room",
      expect.objectContaining({
        rules: [expect.objectContaining({ name: "Pinned", pinned: false })],
      }),
    );
  });

  // --- show-traces / show-simulator ----------------------------------------

  test("show-traces event opens the traces modal with correct props", async () => {
    el = await mount();
    el._categories = [{ id: "lights", name: "Lights", color: null, icon: null }] as RuleCategory[];
    await el.updateComplete;
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-rules-list")!.dispatchEvent(
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
    el._categories = [] as RuleCategory[];
    await el.updateComplete;
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-rules-list")!.dispatchEvent(
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
    el._categories = [{ id: "lights", name: "Lights", color: null, icon: null }] as RuleCategory[];
    await el.updateComplete;
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-rules-list")!.dispatchEvent(
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
    el._categories = [{ id: "lights", name: "Lights", color: null, icon: null }] as RuleCategory[];
    await el.updateComplete;
    const row = el.shadowRoot.querySelector(".scope-row.house") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-rules-list")!.dispatchEvent(
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
    el._categories = [{ id: "g1", name: "G1", color: null, icon: null }] as RuleCategory[];
    await el.updateComplete;
    const row = el.shadowRoot.querySelector(".scope-row.house") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-rules-list")!.dispatchEvent(
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

  // --- _saveRule: same scope, edit existing rule (non-new) ----------------

  test("save-rule replaces an existing rule at its index when editing same scope", async () => {
    const rules = [
      { name: "Old", when: {}, actions: [] },
      { name: "Other", when: {}, actions: [] },
    ];
    el = await mount({ areaConfigs: { living_room: { rules } } });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    const rulesList = row.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("edit-rule", { detail: { index: 0 }, bubbles: true, composed: true }),
    );
    await el.updateComplete;
    const editor = el.shadowRoot.querySelector("ambience-rule-editor")!;
    editor.dispatchEvent(
      new CustomEvent("save-rule", {
        detail: {
          rule: { name: "Renamed", when: {}, actions: [] },
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
        rules: expect.arrayContaining([expect.objectContaining({ name: "Renamed" })]),
      }),
    );
  });

  // --- _mutate floor and error ------------------------------------------

  test("saveFloor error is displayed", async () => {
    vi.mocked(api.saveFloor).mockRejectedValueOnce(new Error("Floor save failed"));
    el = await mount({
      floorConfigs: { ground: { rules: [{ name: "R", when: {}, actions: [] }] } },
    });
    const row = el.shadowRoot.querySelector(".scope-row.floor[data-id='ground']") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row
      .querySelector("ambience-rules-list")!
      .dispatchEvent(
        new CustomEvent("delete-rule", { detail: { index: 0 }, bubbles: true, composed: true }),
      );
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".error")).toBeTruthy();
  });

  // --- _filterOpen toggle and backdrop click --------------------------------

  test("clicking the category filter backdrop closes the dropdown", async () => {
    el = await mount();
    el._categories = [
      { id: "a", name: "Awn" },
      { id: "b", name: "Bee" },
    ] as RuleCategory[];
    await el.updateComplete;
    // Open it
    (el.shadowRoot.querySelector(".category-filter-trigger") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".category-filter-menu")).toBeTruthy();
    // Click the backdrop to close
    (el.shadowRoot.querySelector(".category-filter-backdrop") as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".category-filter-menu")).toBeNull();
  });

  test("clicking the filter trigger again toggles the dropdown closed", async () => {
    el = await mount();
    el._categories = [
      { id: "a", name: "Awn" },
      { id: "b", name: "Bee" },
    ] as RuleCategory[];
    await el.updateComplete;
    const trigger = el.shadowRoot.querySelector(".category-filter-trigger") as HTMLButtonElement;
    trigger.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".category-filter-menu")).toBeTruthy();
    trigger.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".category-filter-menu")).toBeNull();
  });

  // --- _defaultCategoryId with no categories --------------------------------

  test("_defaultCategoryId returns empty string when no categories exist", async () => {
    el = await mount();
    el._categories = [] as RuleCategory[];
    el._filterCategory = "";
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

  test("area_registry_updated remove clears editing state when editing that area's rule", async () => {
    const rule: Rule = { name: "R", when: {}, actions: [] };
    el = await mount({ areaConfigs: { living_room: { rules: [rule] } } });
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
      .querySelector("ambience-rules-list")!
      .dispatchEvent(
        new CustomEvent("edit-rule", { detail: { index: 0 }, bubbles: true, composed: true }),
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

  test("floor_registry_updated remove clears editing state when editing that floor's rule", async () => {
    const rule: Rule = { name: "FR", when: {}, actions: [] };
    el = await mount({ floorConfigs: { ground: { rules: [rule] } } });
    const subCall = vi.mocked(el.hass.connection.subscribeEvents);
    const floorCallback = subCall.mock.calls.find(
      (c: any) => c[1] === "floor_registry_updated",
    )?.[0];
    if (!floorCallback) throw new Error("no floor_registry_updated subscription");
    const row = el.shadowRoot.querySelector(".scope-row.floor[data-id='ground']") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row
      .querySelector("ambience-rules-list")!
      .dispatchEvent(
        new CustomEvent("edit-rule", { detail: { index: 0 }, bubbles: true, composed: true }),
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
      houseConfig: { rules: [{ name: "H", when: {}, actions: [] }] },
    });
    const row = el.shadowRoot.querySelector(".scope-row.house") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row
      .querySelector("ambience-rules-list")!
      .dispatchEvent(
        new CustomEvent("delete-rule", { detail: { index: 0 }, bubbles: true, composed: true }),
      );
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".error")).toBeTruthy();
  });

  // --- _callApi || String(e) branch ----------------------------------------

  test("applyRules error with a non-Error thrown value shows stringified message", async () => {
    vi.mocked(api.applyRules).mockRejectedValueOnce("plain string error");
    el = await mount();
    await pickScopeKebab(el, "li.scope-row.house", "run");
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".error")).toBeTruthy();
    expect(el.shadowRoot.textContent).toContain("plain string error");
  });

  // --- _normalize: rules missing from config payload (??[]) ----------------

  test("_normalize treats a missing rules field as empty array", async () => {
    // getHouse returns a config without a rules field; _normalize should use []
    vi.mocked(api.getHouse).mockResolvedValueOnce({} as any);
    el = await mount();
    // The house scope should have an empty rules array, not crash
    const cfg = el._getConfig({ kind: "house" });
    expect(cfg.rules).toEqual([]);
  });

  // --- _pinPriority: both above and below undefined (single rule at top) ---

  test("dropping the only rule to itself (no neighbours) assigns PIN_GAP priority", async () => {
    const cfg: ScopeConfig = {
      rules: [{ name: "solo", when: {}, actions: [], category: "a", priority: 1024 }],
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
    // Move index 0 to index 0 — single same-category rule, both above+below are undefined
    rulesList.dispatchEvent(
      new CustomEvent("reorder-rules", {
        detail: { from: 0, to: 0 },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));
    expect(api.saveArea).toHaveBeenCalled();
    const savedCfg: ScopeConfig = vi.mocked(api.saveArea).mock.calls.at(-1)![2];
    // both above=undefined, below=undefined → PIN_GAP = 1024
    expect(savedCfg.rules[0].priority).toBe(1024);
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
    expect(localEl._house).toEqual({ rules: [] });
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
      areaConfigs: { living_room: { rules: [{ name: "R", when: {}, actions: [] }] } },
    });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row
      .querySelector("ambience-rules-list")!
      .dispatchEvent(
        new CustomEvent("delete-rule", { detail: { index: 0 }, bubbles: true, composed: true }),
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

  // --- _saveRule: cross-scope new rule (added:true, isNew:true = no removal) ----

  test("cross-scope save of a NEW rule does not try to remove from source", async () => {
    el = await mount();
    // Open editor for living_room (isNew=true, no source rule to remove)
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row
      .querySelector("ambience-rules-list")!
      .dispatchEvent(new CustomEvent("add-rule", { detail: {}, bubbles: true, composed: true }));
    await el.updateComplete;
    // Save to bedroom instead (cross-scope, isNew=true)
    const editor = el.shadowRoot.querySelector("ambience-rule-editor")!;
    editor.dispatchEvent(
      new CustomEvent("save-rule", {
        detail: {
          rule: { name: "New", when: {}, actions: [] },
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
    el._categories = [{ id: "g", name: "G", color: null, icon: null }] as RuleCategory[];
    await el.updateComplete;
    const row = el.shadowRoot.querySelector(".scope-row.house") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-rules-list")!.dispatchEvent(
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
    el._categories = [{ id: "g", name: "G", color: null, icon: null }] as RuleCategory[];
    await el.updateComplete;
    const row = el.shadowRoot.querySelector(".scope-row.house") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-rules-list")!.dispatchEvent(
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
    el._categories = [] as RuleCategory[];
    await el.updateComplete;
    const row = el.shadowRoot.querySelector(".scope-row.house") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-rules-list")!.dispatchEvent(
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

  // --- _saveRule: spurious save when editing is null -----------------------

  test("save-rule is a no-op when _editing is null (defensive guard)", async () => {
    el = await mount();
    // Ensure _editing is null before firing save-rule
    el._editing = null;
    const editor = el.shadowRoot.querySelector("ambience-rule-editor")!;
    editor.dispatchEvent(
      new CustomEvent("save-rule", {
        detail: { rule: { name: "Ghost", when: {}, actions: [] }, scope: { kind: "house" } },
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

  test("reorder scans past non-category rules to find same-category neighbours", async () => {
    // Layout: [b1(b,3072), a1(a,2048), a2(a,1024)]
    // Move a2 (from=2) to to=1. After splice(2,1): [b1, a1], then splice(1,0,a2): [b1, a2, a1]
    // Scan above: a = to-1 = 0, sameCategory(0) = b1.cat=b != a → WHILE BODY executes, a-- → a=-1
    //   above = undefined (a<0)
    // Scan below: b = to+1 = 2, sameCategory(2) = a1.cat=a = a → WHILE BODY does NOT execute
    //   below = rules[2].priority = 2048
    // _pinPriority(undefined, 2048, [a1,a2]) → max(2048,1024)+1024 = 3072
    const cfg: ScopeConfig = {
      rules: [
        { name: "b1", when: {}, actions: [], category: "b", priority: 3072 },
        { name: "a1", when: {}, actions: [], category: "a", priority: 2048 },
        { name: "a2", when: {}, actions: [], category: "a", priority: 1024 },
      ] as Rule[],
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
    row.querySelector("ambience-rules-list")!.dispatchEvent(
      new CustomEvent("reorder-rules", {
        detail: { from: 2, to: 1 },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));
    expect(api.saveArea).toHaveBeenCalled();
    const saved: ScopeConfig = vi.mocked(api.saveArea).mock.calls.at(-1)![2];
    expect(saved.rules[1].name).toBe("a2");
    expect(saved.rules[1].pinned).toBe(true);
    // above=undefined (scanned past b1 to find nothing), below=2048 → top slot within category
    // max(2048,1024)+1024 = 3072
    expect(saved.rules[1].priority).toBe(3072);
  });

  test("reorder scans past non-category below when the immediate below is different category", async () => {
    // Layout: [a1(a,3072), a2(a,2048), b1(b,1024)]
    // Move a1 (from=0) to to=1. After splice(0,1): [a2, b1], then splice(1,0,a1): [a2, a1, b1]
    // Scan above: a = to-1 = 0, sameCategory(0) = a2.cat=a = a → WHILE does NOT execute
    //   above = rules[0].priority = 2048
    // Scan below: b = to+1 = 2, sameCategory(2) = b1.cat=b != a → WHILE BODY executes, b++ → b=3
    //   b=3 >= rules.length=3, below = undefined
    // _pinPriority(2048, undefined, [a1,a2]) → min(3072,2048)-1024 = 1024
    const cfg: ScopeConfig = {
      rules: [
        { name: "a1", when: {}, actions: [], category: "a", priority: 3072 },
        { name: "a2", when: {}, actions: [], category: "a", priority: 2048 },
        { name: "b1", when: {}, actions: [], category: "b", priority: 1024 },
      ] as Rule[],
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
    row.querySelector("ambience-rules-list")!.dispatchEvent(
      new CustomEvent("reorder-rules", {
        detail: { from: 0, to: 1 },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));
    expect(api.saveArea).toHaveBeenCalled();
    const saved: ScopeConfig = vi.mocked(api.saveArea).mock.calls.at(-1)![2];
    expect(saved.rules[1].name).toBe("a1");
    expect(saved.rules[1].pinned).toBe(true);
    // above=2048, below=undefined (scanned past b1 to find nothing) → bottom slot
    // min(3072,2048)-1024 = 1024
    expect(saved.rules[1].priority).toBe(1024);
  });

  // --- _toggleRuleEnabled with multiple rules: non-targeted rule returned as-is ---

  test("disabling rule at index 0 in a 2-rule config leaves rule at index 1 unchanged", async () => {
    const cfg: ScopeConfig = {
      rules: [
        { name: "A", when: {}, actions: [] },
        { name: "B", when: {}, actions: [] },
      ],
    };
    el = await mount({ areaConfigs: { living_room: cfg } });
    await toggleRuleInArea("living_room", { index: 0, enabled: false });
    const call = vi.mocked(api.saveArea).mock.calls.at(-1)!;
    const saved = (call[2] as ScopeConfig).rules;
    expect(saved[0]).toMatchObject({ name: "A", enabled: false });
    expect(saved[1]).toMatchObject({ name: "B" });
    expect(saved[1]).not.toHaveProperty("enabled");
  });

  // --- _pinPriority: rules with undefined priority use 0 fallback ----------

  test("reorder with rules missing priority treats them as priority=0", async () => {
    const cfg: ScopeConfig = {
      rules: [
        { name: "a", when: {}, actions: [], category: "x" },
        { name: "b", when: {}, actions: [], category: "x" },
      ] as Rule[],
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
    row.querySelector("ambience-rules-list")!.dispatchEvent(
      new CustomEvent("reorder-rules", {
        detail: { from: 1, to: 0 },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));
    expect(api.saveArea).toHaveBeenCalled();
    // priority ?? 0 → max(0,0)+1024=1024 for top slot
    const saved: ScopeConfig = vi.mocked(api.saveArea).mock.calls.at(-1)![2];
    expect(saved.rules[0].priority).toBe(1024);
  });

  // --- _unpin: the targeted index IS matched (ternary true branch) ---------

  test("unpin-rule: the ternary truthy branch applies pinned:false to the matched rule", async () => {
    // Two rules: unpin index 0 — map produces [{...r0, pinned:false}, r1]
    const rules = [
      { name: "P0", when: {}, actions: [], pinned: true, priority: 2048 },
      { name: "P1", when: {}, actions: [], pinned: true, priority: 1024 },
    ];
    el = await mount({ areaConfigs: { living_room: { rules } } });
    const row = el.shadowRoot.querySelector(
      ".scope-row.area[data-id='living_room']",
    ) as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row
      .querySelector("ambience-rules-list")!
      .dispatchEvent(
        new CustomEvent("unpin-rule", { detail: { index: 0 }, bubbles: true, composed: true }),
      );
    await new Promise((r) => setTimeout(r, 0));
    const call = vi.mocked(api.saveArea).mock.calls.at(-1)!;
    const saved = (call[2] as ScopeConfig).rules;
    expect(saved[0].pinned).toBe(false);
    expect(saved[1].pinned).toBe(true); // untouched
  });

  // --- show-simulator with house scope (scope_id: null) --------------------

  test("show-simulator on a floor scope sets scope_kind to floor", async () => {
    el = await mount();
    el._categories = [{ id: "g1", name: "G1", color: null, icon: null }] as RuleCategory[];
    await el.updateComplete;
    const row = el.shadowRoot.querySelector(".scope-row.floor[data-id='ground']") as HTMLElement;
    (row.querySelector(".scope-header") as HTMLElement).click();
    await el.updateComplete;
    row.querySelector("ambience-rules-list")!.dispatchEvent(
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
  test("uses <ha-switch> when it is registered and toggles via callService", async () => {
    if (!customElements.get("ha-switch")) {
      customElements.define("ha-switch", class extends HTMLElement {});
    }
    el = await mount({
      switches: [{ scope_kind: "area", scope_id: "bedroom", entity_id: "switch.bedroom_ambience" }],
      states: { "switch.bedroom_ambience": { state: "off" } },
    });
    const toggle = toggleIn(el.shadowRoot.querySelector(".scope-row.area[data-id='bedroom']"));
    expect(toggle.tagName.toLowerCase()).toBe("ha-switch");
    toggle.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    expect(el.hass.callService).toHaveBeenCalledWith("switch", "turn_on", {
      entity_id: "switch.bedroom_ambience",
    });
  });
});
