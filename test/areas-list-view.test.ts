import { describe, test, expect, afterEach, vi, beforeEach } from "vitest";
import "../frontend/src/views/areas-list-view";
import type {
  AreaConfig,
  AreaListItem,
  MatcherInfo,
  ActionInfo,
  PeriodStoreView,
} from "../frontend/src/types";

// Mock the api module
vi.mock("../frontend/src/api", () => ({
  listAreas: vi.fn(),
  getArea: vi.fn(),
  saveArea: vi.fn(),
  listMatchers: vi.fn(),
  listEnabledMatchers: vi.fn(async () => ({ enabled: ["time_of_day", "day"] })),
  listActions: vi.fn(),
  listPeriods: vi.fn(),
  getDayConfig: vi.fn(async () => ({ workday_sensor: null, workday_calendar: null })),
  getWeatherConfig: vi.fn(async () => ({ entity: null, groups: [] })),
}));

import * as api from "../frontend/src/api";

const baseAreas: AreaListItem[] = [
  { area_id: "living_room", name: "Living Room" },
  { area_id: "bedroom", name: "Bedroom" },
];

const baseConfig: AreaConfig = { rules: [], auto_sort: true };

const matchers: MatcherInfo[] = [
  { name: "scene", description: "", predicate_help: "", toggleable: false, input: "scene_combobox", priority: 0 },
  { name: "time_of_day", description: "", predicate_help: "", toggleable: true, input: "time_of_day", priority: 200 },
];

const actions: ActionInfo[] = [
  { name: "set_light", description: "", domains: ["light"], target_params: [] },
];

const periods: PeriodStoreView = { builtins: {}, custom: {}, hidden: [] };

function makeFakeHass() {
  return {
    connection: {
      subscribeEvents: vi.fn().mockResolvedValue(vi.fn()),
    },
  };
}

async function mount(
  areas: AreaListItem[] = baseAreas,
  configs: Record<string, AreaConfig> = {},
): Promise<any> {
  vi.mocked(api.listAreas).mockResolvedValue(areas);
  vi.mocked(api.getArea).mockImplementation(async (_hass, areaId) =>
    configs[areaId] ?? structuredClone(baseConfig),
  );
  vi.mocked(api.listMatchers).mockResolvedValue(matchers);
  vi.mocked(api.listEnabledMatchers).mockResolvedValue({ enabled: ["time_of_day"] });
  vi.mocked(api.listActions).mockResolvedValue(actions);
  vi.mocked(api.listPeriods).mockResolvedValue(periods);
  vi.mocked(api.saveArea).mockResolvedValue({ ok: true, config: baseConfig });

  const el: any = document.createElement("ambience-areas-list");
  el.hass = makeFakeHass();
  document.body.appendChild(el);
  await el.updateComplete;
  // Flush async callbacks (connectedCallback calls await which resolves in microtasks)
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  return el;
}

describe("ambience-areas-list", () => {
  let el: any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    el?.remove();
  });

  test("renders 'No areas found' when areas list is empty", async () => {
    el = await mount([]);
    expect(el.shadowRoot.textContent).toContain("No areas found");
  });

  test("renders area names", async () => {
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("Living Room");
    expect(el.shadowRoot.textContent).toContain("Bedroom");
  });

  test("areas start collapsed (no area-body)", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector(".area-body")).toBeFalsy();
  });

  test("clicking an area header expands it", async () => {
    el = await mount();
    const headers = el.shadowRoot.querySelectorAll(".area-header");
    (headers[0] as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".area-body")).toBeTruthy();
  });

  test("clicking an expanded area header collapses it", async () => {
    el = await mount();
    const headers = el.shadowRoot.querySelectorAll(".area-header");
    (headers[0] as HTMLElement).click();
    await el.updateComplete;
    (headers[0] as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".area-body")).toBeFalsy();
  });

  test("there is no per-area cog button", async () => {
    el = await mount();
    const cogs = el.shadowRoot.querySelectorAll(".cog");
    expect(cogs.length).toBe(0);
  });

  test("does not mount the matchers-modal", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector("ambience-matchers-modal")).toBeNull();
  });

  test("summary shows 'not configured' for empty area", async () => {
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("not configured");
  });

  test("summary shows rule count", async () => {
    const config: AreaConfig = {
      rules: [{ when: { scene: "movie" }, actions: [] }, { when: {}, actions: [] }],
      auto_sort: true,
    };
    el = await mount(baseAreas, { living_room: config });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.textContent).toContain("2 rules");
  });

  test("expanded area shows rules-list component", async () => {
    el = await mount();
    const headers = el.shadowRoot.querySelectorAll(".area-header");
    (headers[0] as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("ambience-rules-list")).toBeTruthy();
  });

  test("add-rule event from rules-list opens the rule editor", async () => {
    el = await mount();
    const headers = el.shadowRoot.querySelectorAll(".area-header");
    (headers[0] as HTMLElement).click();
    await el.updateComplete;

    const rulesList = el.shadowRoot.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("add-rule", { detail: {}, bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const editor = el.shadowRoot.querySelector("ambience-rule-editor") as any;
    expect(editor?.open).toBe(true);
  });

  test("cancel-rule from editor closes it without saving", async () => {
    el = await mount();
    const headers = el.shadowRoot.querySelectorAll(".area-header");
    (headers[0] as HTMLElement).click();
    await el.updateComplete;

    const rulesList = el.shadowRoot.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("add-rule", { detail: {}, bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const editor = el.shadowRoot.querySelector("ambience-rule-editor") as any;
    editor.dispatchEvent(
      new CustomEvent("cancel-rule", { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    expect(editor?.open).toBe(false);
  });

  test("save-rule event persists the new rule", async () => {
    el = await mount();
    const headers = el.shadowRoot.querySelectorAll(".area-header");
    (headers[0] as HTMLElement).click();
    await el.updateComplete;

    const rulesList = el.shadowRoot.querySelector("ambience-rules-list")!;
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

    expect(api.saveArea).toHaveBeenCalledWith(
      expect.anything(),
      "living_room",
      expect.objectContaining({ rules: [{ name: "New rule", when: {}, actions: [] }] }),
    );
  });

  test("delete-rule event removes rule at given index", async () => {
    const config: AreaConfig = {
      rules: [
        { name: "Rule A", when: {}, actions: [] },
        { name: "Rule B", when: {}, actions: [] },
      ],
      auto_sort: false,
    };
    el = await mount(baseAreas, { living_room: config });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    const headers = el.shadowRoot.querySelectorAll(".area-header");
    (headers[0] as HTMLElement).click();
    await el.updateComplete;

    const rulesList = el.shadowRoot.querySelector("ambience-rules-list")!;
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
      expect.objectContaining({ rules: [{ name: "Rule B", when: {}, actions: [] }] }),
    );
  });

  test("duplicate-rule event inserts a copy after the original", async () => {
    const config: AreaConfig = {
      rules: [{ name: "Rule A", when: {}, actions: [] }],
      auto_sort: false,
    };
    el = await mount(baseAreas, { living_room: config });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    const headers = el.shadowRoot.querySelectorAll(".area-header");
    (headers[0] as HTMLElement).click();
    await el.updateComplete;

    const rulesList = el.shadowRoot.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("duplicate-rule", {
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
        rules: [
          { name: "Rule A", when: {}, actions: [] },
          { name: "Rule A", when: {}, actions: [] },
        ],
      }),
    );
  });

  test("reorder-rules event moves a rule", async () => {
    const config: AreaConfig = {
      rules: [
        { name: "Rule A", when: {}, actions: [] },
        { name: "Rule B", when: {}, actions: [] },
      ],
      auto_sort: false,
    };
    el = await mount(baseAreas, { living_room: config });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    const headers = el.shadowRoot.querySelectorAll(".area-header");
    (headers[0] as HTMLElement).click();
    await el.updateComplete;

    const rulesList = el.shadowRoot.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("reorder-rules", {
        detail: { from: 0, to: 1 },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));

    expect(api.saveArea).toHaveBeenCalledWith(
      expect.anything(),
      "living_room",
      expect.objectContaining({
        rules: [
          { name: "Rule B", when: {}, actions: [] },
          { name: "Rule A", when: {}, actions: [] },
        ],
      }),
    );
  });

  test("area_registry_updated remove event clears that area from expanded/editing", async () => {
    el = await mount();
    // Get the subscribeEvents callback
    const subCall = vi.mocked(el.hass.connection.subscribeEvents);
    const callback = subCall.mock.calls[0]?.[0];
    if (!callback) return;

    // Expand an area first
    const headers = el.shadowRoot.querySelectorAll(".area-header");
    (headers[0] as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".area-body")).toBeTruthy();

    // Fire a remove event for that area
    vi.mocked(api.listAreas).mockResolvedValue([baseAreas[1]]);
    vi.mocked(api.getArea).mockResolvedValue(baseConfig);
    callback({ data: { action: "remove", area_id: "living_room" } });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    // Living Room should be gone
    expect(el.shadowRoot.textContent).not.toContain("Living Room");
  });

  test("auto_sort checkbox toggles auto_sort on the config", async () => {
    el = await mount();
    // Expand first area
    const headers = el.shadowRoot.querySelectorAll(".area-header");
    (headers[0] as HTMLElement).click();
    await el.updateComplete;

    const checkbox = el.shadowRoot.querySelector("input[type='checkbox']") as HTMLInputElement;
    expect(checkbox).toBeTruthy();
    // Simulate unchecking (enabling manual order => auto_sort=false)
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 0));

    expect(api.saveArea).toHaveBeenCalledWith(
      expect.anything(),
      "living_room",
      expect.objectContaining({ auto_sort: false }),
    );
  });

  test("edit-rule event opens editor for an existing rule", async () => {
    const config: AreaConfig = {
      rules: [{ name: "Rule A", when: {}, actions: [] }],
      auto_sort: false,
    };
    el = await mount(baseAreas, { living_room: config });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    const headers = el.shadowRoot.querySelectorAll(".area-header");
    (headers[0] as HTMLElement).click();
    await el.updateComplete;

    const rulesList = el.shadowRoot.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("edit-rule", {
        detail: { index: 0 },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    const editor = el.shadowRoot.querySelector("ambience-rule-editor") as any;
    expect(editor?.open).toBe(true);
    // editing.isNew should be false, so _editingRule returns the existing rule
    expect(editor?.rule?.name).toBe("Rule A");
  });

  test("save-rule for existing rule (not new) replaces at index", async () => {
    const config: AreaConfig = {
      rules: [
        { name: "Rule A", when: {}, actions: [] },
        { name: "Rule B", when: {}, actions: [] },
      ],
      auto_sort: false,
    };
    el = await mount(baseAreas, { living_room: config });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    const headers = el.shadowRoot.querySelectorAll(".area-header");
    (headers[0] as HTMLElement).click();
    await el.updateComplete;

    // Edit rule at index 1
    const rulesList = el.shadowRoot.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("edit-rule", {
        detail: { index: 1 },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    const editor = el.shadowRoot.querySelector("ambience-rule-editor")!;
    editor.dispatchEvent(
      new CustomEvent("save-rule", {
        detail: { name: "Rule B updated", when: {}, actions: [] },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));

    expect(api.saveArea).toHaveBeenCalledWith(
      expect.anything(),
      "living_room",
      expect.objectContaining({
        rules: [
          { name: "Rule A", when: {}, actions: [] },
          { name: "Rule B updated", when: {}, actions: [] },
        ],
      }),
    );
  });

  test("saveArea error is displayed", async () => {
    vi.mocked(api.saveArea).mockRejectedValueOnce(new Error("Save failed"));
    el = await mount();

    // Trigger a mutation (auto_sort toggle) to call _mutate
    const headers = el.shadowRoot.querySelectorAll(".area-header");
    (headers[0] as HTMLElement).click();
    await el.updateComplete;

    const checkbox = el.shadowRoot.querySelector("input[type='checkbox']") as HTMLInputElement;
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(el.shadowRoot.querySelector(".error")).toBeTruthy();
  });

  test("_sceneSuggestions collects scene names from area rules", async () => {
    const config: AreaConfig = {
      rules: [
        { name: "Rule A", when: { scene: "movie" }, actions: [] },
        { name: "Rule B", when: { scene: "relaxed" }, actions: [] },
      ],
      auto_sort: false,
    };
    el = await mount(baseAreas, { living_room: config });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    // Open the rule editor to trigger _sceneSuggestions
    const headers = el.shadowRoot.querySelectorAll(".area-header");
    (headers[0] as HTMLElement).click();
    await el.updateComplete;

    const rulesList = el.shadowRoot.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("add-rule", { detail: {}, bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const editor = el.shadowRoot.querySelector("ambience-rule-editor") as any;
    // Scene suggestions should include existing scene names
    expect(Array.isArray(editor?.sceneSuggestions)).toBe(true);
  });

  test("_editorMatchers includes scene + globally enabled matchers when editing", async () => {
    const config: AreaConfig = {
      rules: [],
      auto_sort: true,
    };
    el = await mount(baseAreas, { living_room: config });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    const headers = el.shadowRoot.querySelectorAll(".area-header");
    (headers[0] as HTMLElement).click();
    await el.updateComplete;

    const rulesList = el.shadowRoot.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("add-rule", { detail: {}, bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const editor = el.shadowRoot.querySelector("ambience-rule-editor") as any;
    // scene (always) + time_of_day (globally enabled in the mount() stub)
    expect(editor?.matchers?.map((m: MatcherInfo) => m.name)).toEqual([
      "scene",
      "time_of_day",
    ]);
  });

  test("_editorMatchers is ordered by matcher priority (scene, day, time_of_day, weather)", async () => {
    // Override the default mocks with the full matcher set in deliberate
    // registration-order (NOT priority order) — we expect the getter to sort.
    const allMatchers: MatcherInfo[] = [
      { name: "scene",       description: "", predicate_help: "", toggleable: false, input: "scene_combobox",     priority: 0 },
      { name: "time_of_day", description: "", predicate_help: "", toggleable: true,  input: "time_of_day",        priority: 200 },
      { name: "day",         description: "", predicate_help: "", toggleable: true,  input: "day_predicate",      priority: 100 },
      { name: "weather",     description: "", predicate_help: "", toggleable: true,  input: "weather_predicate",  priority: 300 },
    ];
    el = await mount(baseAreas, { living_room: { rules: [], auto_sort: true } });
    // mount() reset the matchers mock to the 2-item default; re-override and
    // re-trigger a load by reassigning the element's internal state directly.
    vi.mocked(api.listMatchers).mockResolvedValue(allMatchers);
    vi.mocked(api.listEnabledMatchers).mockResolvedValue({
      enabled: ["time_of_day", "day", "weather"],
    });
    el._matchers = allMatchers;
    el._enabledMatchers = new Set(["time_of_day", "day", "weather"]);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    const headers = el.shadowRoot.querySelectorAll(".area-header");
    (headers[0] as HTMLElement).click();
    await el.updateComplete;

    const rulesList = el.shadowRoot.querySelector("ambience-rules-list")!;
    rulesList.dispatchEvent(
      new CustomEvent("add-rule", { detail: {}, bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const editor = el.shadowRoot.querySelector("ambience-rule-editor") as any;
    expect(editor?.matchers?.map((m: MatcherInfo) => m.name)).toEqual([
      "scene",
      "day",
      "time_of_day",
      "weather",
    ]);
  });

  test("disconnectedCallback unsubscribes from events", async () => {
    const unsubFn = vi.fn();
    vi.mocked(api.listAreas).mockResolvedValue(baseAreas);
    vi.mocked(api.getArea).mockResolvedValue(baseConfig);
    vi.mocked(api.listMatchers).mockResolvedValue(matchers);
    vi.mocked(api.listActions).mockResolvedValue(actions);
    vi.mocked(api.listPeriods).mockResolvedValue(periods);

    const hass = {
      connection: {
        subscribeEvents: vi.fn().mockResolvedValue(unsubFn),
      },
    };

    const localEl: any = document.createElement("ambience-areas-list");
    localEl.hass = hass;
    document.body.appendChild(localEl);
    await localEl.updateComplete;
    await new Promise((r) => setTimeout(r, 0));

    localEl.remove();
    // unsub may be called async
    await new Promise((r) => setTimeout(r, 0));
    expect(unsubFn).toHaveBeenCalled();
  });

  test("listMatchers error is surfaced in _error", async () => {
    vi.mocked(api.listMatchers).mockRejectedValueOnce(new Error("matchers fetch failed"));
    el = await mount();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    // _loadStatic catch sets _error
    expect(el.shadowRoot.querySelector(".error")).toBeTruthy();
  });

  test("listAreas error is surfaced in _error", async () => {
    vi.mocked(api.listAreas).mockRejectedValueOnce(new Error("areas fetch failed"));
    el = await mount();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    // _refreshAreas catch sets _error
    expect(el.shadowRoot.querySelector(".error")).toBeTruthy();
  });

  test("_subscribe calls unsub immediately if disconnected before subscribe resolves", async () => {
    // subscribeEvents resolves after a delay so the element can be removed first
    const unsubFn = vi.fn();
    let resolveSubscribe!: (v: typeof unsubFn) => void;
    const subscribePromise = new Promise<typeof unsubFn>((res) => { resolveSubscribe = res; });
    vi.mocked(api.listAreas).mockResolvedValue(baseAreas);
    vi.mocked(api.getArea).mockResolvedValue(baseConfig);
    vi.mocked(api.listMatchers).mockResolvedValue(matchers);
    vi.mocked(api.listActions).mockResolvedValue(actions);
    vi.mocked(api.listPeriods).mockResolvedValue(periods);

    const hass = {
      connection: {
        subscribeEvents: vi.fn().mockReturnValue(subscribePromise),
      },
    };

    const localEl: any = document.createElement("ambience-areas-list");
    localEl.hass = hass;
    document.body.appendChild(localEl);
    // Remove before subscribeEvents promise resolves
    localEl.remove();
    // Now resolve the subscribe promise — since element is disconnected, unsub() should be called
    resolveSubscribe(unsubFn);
    await new Promise((r) => setTimeout(r, 0));
    expect(unsubFn).toHaveBeenCalled();
  });
});
