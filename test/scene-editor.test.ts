import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

// The scene editor's per-action body lazily fetches the service schema via
// `api.getServiceSchema`. Mock the api module so the tests don't depend on
// a real HA connection.
vi.mock("../frontend/src/api", () => ({
  getServiceSchema: vi.fn(async () => ({
    target: { entity: { domain: "light" } },
    fields: {
      brightness: { selector: { number: { min: 0, max: 100 } } },
      transition: { selector: { number: { min: 0 } } },
    },
  })),
  getKnownStates: vi.fn(async () => ({ states: ["on", "off"] })),
}));

import "../frontend/src/views/scene-editor";
import * as api from "../frontend/src/api";
import type {
  ConditionInfo,
  ExposedAction,
  Scene,
  SceneCategory,
  Scope,
  ScopeOption,
} from "../frontend/src/types";

const conditions: ConditionInfo[] = [
  { name: "mode", description: "", predicate_help: "", input: "text", priority: 0 },
  { name: "time_of_day", description: "", predicate_help: "", input: "time_of_day", priority: 200 },
  { name: "people", description: "", predicate_help: "", input: "people_predicate", priority: 75 },
  {
    name: "template",
    description: "",
    predicate_help: "",
    input: "template_predicate",
    priority: 30,
  },
  { name: "state", description: "", predicate_help: "", input: "state_predicate", priority: 100 },
];

const availableActions: ExposedAction[] = [
  {
    id: "light.turn_on",
    label: "Set light",
    visible_fields: ["brightness", "transition"],
    defaults: {},
  },
  {
    id: "script.foo",
    label: "Run foo script",
    visible_fields: [],
    defaults: {},
  },
];

const periods = { builtins: {}, custom: {}, hidden: [] };

const hass = {
  localize: (k: string) => {
    if (k === "component.ambience.condition.mode") return "Mode";
    if (k === "component.ambience.condition.time_of_day") return "Time of day";
    return undefined;
  },
  entities: {
    "light.lamp_a": { entity_id: "light.lamp_a", area_id: "living_room" },
    "light.lamp_b": { entity_id: "light.lamp_b", area_id: "living_room" },
  },
} as any;

async function mount(
  scene: Scene | null,
  opts: { scope?: Scope; hass?: any; categories?: SceneCategory[]; scopes?: ScopeOption[] } = {},
): Promise<any> {
  const el: any = document.createElement("ambience-scene-editor");
  el.conditions = conditions;
  el.availableActions = availableActions;
  el.periods = periods;
  el.hass = opts.hass ?? hass;
  el.scope = opts.scope ?? { kind: "area", id: "living_room" };
  if (opts.categories) el.categories = opts.categories;
  if (opts.scopes) el.scopes = opts.scopes;
  el.scene = scene;
  el.open = true;
  document.body.appendChild(el);
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  // Two more ticks to let the per-action slot resolve its async schema fetch.
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  return el;
}

// Category and destination render as collapse/expand slots (like the name field):
// the selector only exists in the DOM once its slot summary is clicked open.
async function openSlot(el: any, slotId: string): Promise<void> {
  const summary = el.shadowRoot.querySelector(`[data-slot-id="${slotId}"] .summary`) as HTMLElement;
  summary.click();
  await el.updateComplete;
}

describe("ambience-scene-editor — collapse + friendly labels", () => {
  let el: any;
  afterEach(() => {
    el?.remove();
  });

  test("condition rows render as collapsed summaries by default", async () => {
    // Seed both conditions in `when` so both are rendered as rows (toggleable
    // conditions without a value are now hidden behind the add-condition dropdown).
    el = await mount({
      name: "test",
      when: { mode: "movie", time_of_day: { period: "afternoon" } },
      actions: [],
    });
    const rows = el.shadowRoot.querySelectorAll(".slot.collapsed");
    expect(rows.length).toBe(3); // name + mode + time_of_day
  });

  test("clicking a collapsed condition summary expands it", async () => {
    el = await mount({ name: "test", when: { mode: "movie" }, actions: [] });
    const modeRow = el.shadowRoot.querySelector('.slot[data-slot-id="mode"]') as HTMLElement;
    modeRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Re-query: Lit replaces the collapsed element with a new expanded element
    const expanded = el.shadowRoot.querySelector('.slot[data-slot-id="mode"]') as HTMLElement;
    expect(expanded.classList.contains("expanded")).toBe(true);
  });

  test("opening a second condition collapses the first", async () => {
    el = await mount({
      name: "test",
      when: { mode: "movie", time_of_day: { period: "afternoon" } }, // seed so both rows exist
      actions: [],
    });
    const mode = el.shadowRoot.querySelector('.slot[data-slot-id="mode"]') as HTMLElement;
    mode.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Re-query tod after mode expansion (Lit replaces the mode element, tod may shift)
    const tod = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    tod.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Re-query both after renders settle
    const modeAfter = el.shadowRoot.querySelector('.slot[data-slot-id="mode"]') as HTMLElement;
    const todAfter = el.shadowRoot.querySelector(
      '.slot[data-slot-id="time_of_day"]',
    ) as HTMLElement;
    expect(modeAfter.classList.contains("collapsed")).toBe(true);
    expect(todAfter.classList.contains("expanded")).toBe(true);
  });

  test("clicking an already-expanded summary collapses it", async () => {
    // Use time_of_day for this test: it keeps its .summary when expanded
    // so the second click can target it.
    // Seed time_of_day in `when` so the row is rendered (toggleable conditions
    // without a value now appear only behind the add-condition dropdown).
    el = await mount({
      name: "test",
      when: { time_of_day: { period: "afternoon" } },
      actions: [],
    });
    const tod = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    tod.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Re-query: Lit replaces the collapsed element with a new expanded element
    const todExpanded = el.shadowRoot.querySelector(
      '.slot[data-slot-id="time_of_day"]',
    ) as HTMLElement;
    todExpanded
      .querySelector(".summary")!
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    const todCollapsed = el.shadowRoot.querySelector(
      '.slot[data-slot-id="time_of_day"]',
    ) as HTMLElement;
    expect(todCollapsed.classList.contains("collapsed")).toBe(true);
  });

  test("condition row labels use friendly names from i18n", async () => {
    el = await mount({ name: "test", when: { mode: "movie" }, actions: [] });
    const modeRow = el.shadowRoot.querySelector('.slot[data-slot-id="mode"]') as HTMLElement;
    expect(modeRow.textContent).toContain("Mode");
    expect(modeRow.textContent).toContain("movie");
  });

  test("action rows render as collapsed summaries", async () => {
    el = await mount({
      name: "test",
      when: {},
      actions: [
        { service: "light.turn_on", entity_ids: ["light.lamp_a"], params: { brightness: 80 } },
      ],
    });
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    expect(action.classList.contains("collapsed")).toBe(true);
    expect(action.textContent).toContain("Set light");
  });

  test("add-condition selector lists conditions alphabetically by label", async () => {
    const el2: any = document.createElement("ambience-scene-editor");
    // Deliberately unsorted, and not in priority order either.
    el2.conditions = [
      {
        name: "weather",
        description: "",
        predicate_help: "",
        input: "weather_predicate",
        priority: 300,
      },
      { name: "day", description: "", predicate_help: "", input: "day_predicate", priority: 100 },
      { name: "sun", description: "", predicate_help: "", input: "sun_predicate", priority: 250 },
      { name: "mode", description: "", predicate_help: "", input: "text", priority: 0 },
    ];
    el2.availableActions = [];
    el2.periods = periods;
    el2.hass = {}; // no localize → friendly fallback labels
    el2.scope = { kind: "area", id: "living_room" };
    el2.scene = { name: "", when: {}, actions: [] };
    el2.open = true;
    document.body.appendChild(el2);
    await el2.updateComplete;
    const opts = Array.from(el2.shadowRoot.querySelectorAll("select.add-condition option")).map(
      (o: Element) => o.textContent?.trim(),
    );
    // [0] is the "+ Add condition…" placeholder.
    expect(opts.slice(1)).toEqual(["Day", "Mode", "Sun", "Weather"]);
    el2.remove();
  });

  async function mountWeatherDropdown(weatherConfig: unknown): Promise<any> {
    const el2: any = document.createElement("ambience-scene-editor");
    el2.conditions = [
      {
        name: "weather",
        description: "",
        predicate_help: "",
        input: "weather_predicate",
        priority: 300,
      },
      { name: "mode", description: "", predicate_help: "", input: "text", priority: 0 },
    ];
    el2.availableActions = [];
    el2.periods = periods;
    el2.hass = {};
    el2.scope = { kind: "area", id: "living_room" };
    el2.scene = { name: "", when: {}, actions: [] };
    el2.weatherConfig = weatherConfig;
    el2.open = true;
    document.body.appendChild(el2);
    await el2.updateComplete;
    return el2;
  }

  function weatherOption(el2: any): HTMLOptionElement {
    return Array.from(el2.shadowRoot.querySelectorAll("select.add-condition option")).find(
      (o: any) => o.textContent?.trim() === "Weather",
    ) as HTMLOptionElement;
  }

  test("weather condition is disabled in the add-condition dropdown when no weather entity is configured", async () => {
    const el2 = await mountWeatherDropdown({ entity: null, groups: [] });
    const opt = weatherOption(el2);
    expect(opt).toBeTruthy();
    expect(opt.disabled).toBe(true);
    el2.remove();
  });

  test("weather condition is disabled when weatherConfig is absent entirely", async () => {
    const el2 = await mountWeatherDropdown(undefined);
    const opt = weatherOption(el2);
    expect(opt).toBeTruthy();
    expect(opt.disabled).toBe(true);
    el2.remove();
  });

  test("weather condition is enabled once a weather entity is configured", async () => {
    const el2 = await mountWeatherDropdown({ entity: "weather.home", groups: [] });
    const opt = weatherOption(el2);
    expect(opt).toBeTruthy();
    expect(opt.disabled).toBe(false);
    el2.remove();
  });

  test("adding a new action auto-opens it", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const addSelect = el.shadowRoot.querySelector(".add-action select") as HTMLSelectElement;
    addSelect.value = "light.turn_on";
    addSelect.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    expect(action.classList.contains("expanded")).toBe(true);
  });

  test("adding a new action sets ActionSpec.service (not action)", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const addSelect = el.shadowRoot.querySelector(".add-action select") as HTMLSelectElement;
    addSelect.value = "light.turn_on";
    addSelect.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(el._draft.actions[0].service).toBe("light.turn_on");
    expect(el._draft.actions[0].entity_ids).toEqual([]);
    expect(el._draft.actions[0].params).toEqual({});
  });

  test("expanded action editor uses the action-slot component", async () => {
    el = await mount({
      name: "test",
      when: {},
      actions: [
        { service: "light.turn_on", entity_ids: ["light.lamp_a"], params: { brightness: 80 } },
      ],
    });
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(action.querySelector("ambience-action-slot")).toBeTruthy();
  });

  test("an action's target picker hides entities already used by another action", async () => {
    el = await mount({
      name: "test",
      when: {},
      actions: [
        { service: "light.turn_on", entity_ids: ["light.lamp_a"], params: {} },
        { service: "light.turn_on", entity_ids: [], params: {} },
      ],
    });
    const action1 = el.shadowRoot.querySelector('.slot[data-slot-id="action-1"]') as HTMLElement;
    action1.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    const slot = action1.querySelector("ambience-action-slot") as any;
    expect(slot.excludeEntities).toContain("light.lamp_a");
    const picker = slot.shadowRoot.querySelector("ambience-target-picker") as any;
    expect(picker.entities).not.toContain("light.lamp_a");
    expect(picker.entities).toContain("light.lamp_b");
  });

  test("updating one action's targets reactively updates what another action may pick", async () => {
    el = await mount({
      name: "test",
      when: {},
      actions: [
        { service: "light.turn_on", entity_ids: [], params: {} },
        { service: "light.turn_on", entity_ids: [], params: {} },
      ],
    });
    const action1 = el.shadowRoot.querySelector('.slot[data-slot-id="action-1"]') as HTMLElement;
    action1.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    let slot = action1.querySelector("ambience-action-slot") as any;
    expect(slot.excludeEntities).not.toContain("light.lamp_a");

    // Action 0 claims lamp_a — mirror the draft mutation the editor performs.
    el._draft = {
      ...el._draft,
      actions: el._draft.actions.map((a: any, i: number) =>
        i === 0 ? { ...a, entity_ids: ["light.lamp_a"] } : a,
      ),
    };
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    slot = action1.querySelector("ambience-action-slot") as any;
    expect(slot.excludeEntities).toContain("light.lamp_a");
  });

  test("expanded action body does not include an action type dropdown", async () => {
    el = await mount({
      name: "test",
      when: {},
      actions: [
        { service: "light.turn_on", entity_ids: ["light.lamp_a"], params: { brightness: 80 } },
      ],
    });
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(action.querySelector("select.action-type")).toBeNull();
  });

  test("emits save-scene with the draft", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    let saved: Scene | undefined;
    el.addEventListener("save-scene", (e: CustomEvent) => {
      saved = e.detail.scene;
    });
    const saveBtn = Array.from(el.shadowRoot.querySelectorAll("button.primary")).find(
      (b: any) => b.textContent.trim() === "Save scene",
    ) as HTMLButtonElement;
    saveBtn.click();
    expect(saved?.name).toBe("test");
  });

  test("emits cancel-scene", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    let cancelled = false;
    el.addEventListener("cancel-scene", () => {
      cancelled = true;
    });
    const cancelBtn = Array.from(el.shadowRoot.querySelectorAll("button.secondary")).find(
      (b: any) => b.textContent.trim() === "Cancel",
    ) as HTMLButtonElement;
    cancelBtn.click();
    expect(cancelled).toBe(true);
  });

  test("deleting an action removes it from the draft", async () => {
    el = await mount({
      name: "test",
      when: {},
      actions: [
        { service: "light.turn_on", entity_ids: ["light.lamp_a"], params: { brightness: 80 } },
        { service: "light.turn_on", entity_ids: ["light.lamp_b"], params: { brightness: 40 } },
      ],
    });
    const action0 = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    const removeBtn = action0.querySelector(".summary .remove") as HTMLButtonElement;
    removeBtn.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll(".slot[data-slot-id^='action-']").length).toBe(1);
  });

  test("entity-ids-changed event from the action slot updates the draft", async () => {
    el = await mount({
      name: "test",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: [], params: {} }],
    });
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const slot = action.querySelector("ambience-action-slot")!;
    slot.dispatchEvent(
      new CustomEvent("entity-ids-changed", {
        detail: { entityIds: ["light.lamp_a", "light.lamp_b"] },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    expect(el._draft.actions[0].entity_ids).toEqual(["light.lamp_a", "light.lamp_b"]);
  });

  test("params-changed event from the action slot updates the draft", async () => {
    el = await mount({
      name: "test",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: ["light.lamp_a"], params: {} }],
    });
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const slot = action.querySelector("ambience-action-slot")!;
    slot.dispatchEvent(
      new CustomEvent("params-changed", {
        detail: { params: { brightness: 75 } },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    expect(el._draft.actions[0].params).toEqual({ brightness: 75 });
  });

  test("deleting the open action clears _open state", async () => {
    el = await mount({
      name: "test",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: [], params: {} }],
    });
    // Open the action
    const action0 = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action0.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(action0.classList.contains("expanded")).toBe(true);

    // Delete it via the remove button
    const removeBtn = action0.querySelector(".summary .remove") as HTMLButtonElement;
    removeBtn.click();
    await el.updateComplete;
    // No action slots remain
    expect(el.shadowRoot.querySelectorAll(".slot[data-slot-id^='action-']").length).toBe(0);
  });

  test("typing in name input updates the draft name", async () => {
    el = await mount({ name: "original", when: {}, actions: [] });
    // Open the name slot first
    const nameRow = el.shadowRoot.querySelector('.slot[data-slot-id="name"]') as HTMLElement;
    nameRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Re-query: Lit replaces the collapsed element with a new expanded element
    const expandedNameRow = el.shadowRoot.querySelector(
      '.slot[data-slot-id="name"]',
    ) as HTMLElement;
    const nameInput = expandedNameRow.querySelector('input[type="text"]') as HTMLInputElement;
    nameInput.value = "renamed";
    nameInput.dispatchEvent(new InputEvent("input", { bubbles: true }));
    await el.updateComplete;

    let saved: any;
    el.addEventListener("save-scene", (e: CustomEvent) => {
      saved = e.detail.scene;
    });
    el.shadowRoot.querySelector("button.primary")!.dispatchEvent(new MouseEvent("click"));
    expect(saved?.name).toBe("renamed");
  });

  test("name slot renders as collapsed summary with current name", async () => {
    el = await mount({ name: "My Scene", when: {}, actions: [] });
    const nameRow = el.shadowRoot.querySelector('.slot[data-slot-id="name"]') as HTMLElement;
    expect(nameRow.classList.contains("collapsed")).toBe(true);
    expect(nameRow.textContent).toContain("My Scene");
  });

  test("name slot summary shows 'New scene' when name is empty", async () => {
    el = await mount({ name: "", when: {}, actions: [] });
    const nameRow = el.shadowRoot.querySelector('.slot[data-slot-id="name"]') as HTMLElement;
    expect(nameRow.textContent).toContain("New scene");
  });

  test("name slot ignores mode — shows 'New scene' when scene name is empty", async () => {
    el = await mount({ name: "", when: { mode: "Cozy evening" }, actions: [] });
    const nameRow = el.shadowRoot.querySelector('.slot[data-slot-id="name"]') as HTMLElement;
    expect(nameRow.textContent).toContain("New scene");
  });

  test("name slot prefers explicit name over mode", async () => {
    el = await mount({ name: "My scene", when: { mode: "Cozy evening" }, actions: [] });
    const nameRow = el.shadowRoot.querySelector('.slot[data-slot-id="name"]') as HTMLElement;
    expect(nameRow.textContent).toContain("My scene");
  });

  test("clicking name summary expands the input", async () => {
    el = await mount({ name: "", when: {}, actions: [] });
    const nameRow = el.shadowRoot.querySelector('.slot[data-slot-id="name"]') as HTMLElement;
    expect(nameRow.querySelector('input[type="text"]')).toBeNull();
    nameRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Re-query: Lit replaces the collapsed element with a new expanded element
    const expandedRow = el.shadowRoot.querySelector('.slot[data-slot-id="name"]') as HTMLElement;
    expect(expandedRow.querySelector('input[type="text"]')).toBeTruthy();
  });

  test("opening name slot collapses an open condition row", async () => {
    el = await mount({ name: "test", when: { mode: "movie" }, actions: [] });
    const mode = el.shadowRoot.querySelector('.slot[data-slot-id="mode"]') as HTMLElement;
    mode.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Re-query: Lit replaces the collapsed element with a new expanded element
    const modeExpanded = el.shadowRoot.querySelector('.slot[data-slot-id="mode"]') as HTMLElement;
    expect(modeExpanded.classList.contains("expanded")).toBe(true);
    const nameRow = el.shadowRoot.querySelector('.slot[data-slot-id="name"]') as HTMLElement;
    nameRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Re-query: Lit replaces the expanded mode element with a new collapsed element
    const modeCollapsed = el.shadowRoot.querySelector('.slot[data-slot-id="mode"]') as HTMLElement;
    expect(modeCollapsed.classList.contains("collapsed")).toBe(true);
    // Re-query: Lit replaces the collapsed element with a new expanded element
    const expandedNameRow = el.shadowRoot.querySelector(
      '.slot[data-slot-id="name"]',
    ) as HTMLElement;
    expect(expandedNameRow.classList.contains("expanded")).toBe(true);
  });

  test("condition input value-changed event calls _setPredicate", async () => {
    el = await mount({ name: "test", when: { mode: "movie" }, actions: [] });
    // Expand the mode condition
    const modeRow = el.shadowRoot.querySelector('.slot[data-slot-id="mode"]') as HTMLElement;
    modeRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;

    // Re-query: Lit replaces the collapsed element with a new expanded element
    const expandedMode = el.shadowRoot.querySelector('.slot[data-slot-id="mode"]') as HTMLElement;
    // Fire value-changed from ambience-condition-input
    const conditionInput = expandedMode.querySelector("ambience-condition-input")!;
    conditionInput.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: "relaxed" },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    let saved: any;
    el.addEventListener("save-scene", (e: CustomEvent) => {
      saved = e.detail.scene;
    });
    el.shadowRoot.querySelector("button.primary")!.dispatchEvent(new MouseEvent("click"));
    expect(saved?.when?.mode).toBe("relaxed");
  });

  test("clicking outside an open slot collapses it when valid", async () => {
    el = await mount({ name: "test", when: { mode: "movie" }, actions: [] });
    const modeRow = el.shadowRoot.querySelector('.slot[data-slot-id="mode"]') as HTMLElement;
    // Open mode slot
    modeRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Re-query: Lit replaces the collapsed element with a new expanded element
    const expandedMode = el.shadowRoot.querySelector('.slot[data-slot-id="mode"]') as HTMLElement;
    expect(expandedMode.classList.contains("expanded")).toBe(true);
    // Click on a non-slot region inside the modal (h3 header)
    const h3 = el.shadowRoot.querySelector("h3") as HTMLElement;
    h3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Re-query: Lit replaces the expanded element with a new collapsed element
    const collapsedMode = el.shadowRoot.querySelector('.slot[data-slot-id="mode"]') as HTMLElement;
    expect(collapsedMode.classList.contains("collapsed")).toBe(true);
  });

  test("clicking outside an action slot with no targets keeps it open and shows an error", async () => {
    el = await mount({
      name: "test",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: [], params: { brightness: 80 } }],
    });
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    // Open action slot
    action.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(action.classList.contains("expanded")).toBe(true);
    // Simulate target-mode-changed so the editor KNOWS this service has a target.
    // In real HA, ambience-action-slot emits this once the schema loads; the test
    // must fire it explicitly because jsdom doesn't run the action-slot schema fetch.
    const slot = action.querySelector("ambience-action-slot")!;
    slot.dispatchEvent(
      new CustomEvent("target-mode-changed", {
        detail: { hasTarget: true },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    // Click on a non-slot region
    const h3 = el.shadowRoot.querySelector("h3") as HTMLElement;
    h3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Still expanded, error visible
    expect(action.classList.contains("expanded")).toBe(true);
    expect(action.querySelector(".error")?.textContent).toContain("target is required");
  });

  test("clicking another slot's summary while current is invalid keeps current open", async () => {
    el = await mount({
      name: "test",
      when: { mode: "movie" },
      actions: [{ service: "light.turn_on", entity_ids: [], params: { brightness: 80 } }],
    });
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Simulate target-mode-changed so the editor KNOWS this service has a target.
    const slot = action.querySelector("ambience-action-slot")!;
    slot.dispatchEvent(
      new CustomEvent("target-mode-changed", {
        detail: { hasTarget: true },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    const mode = el.shadowRoot.querySelector('.slot[data-slot-id="mode"]') as HTMLElement;
    mode.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(action.classList.contains("expanded")).toBe(true);
    expect(mode.classList.contains("collapsed")).toBe(true);
  });

  test("picking from the +Add action dropdown while current is invalid keeps current open with error", async () => {
    el = await mount({
      name: "test",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: [], params: { brightness: 80 } }],
    });
    const action0 = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action0.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Simulate target-mode-changed so the editor KNOWS this service has a target.
    const slot = action0.querySelector("ambience-action-slot")!;
    slot.dispatchEvent(
      new CustomEvent("target-mode-changed", {
        detail: { hasTarget: true },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    const select = el.shadowRoot.querySelector(".add-action select") as HTMLSelectElement;
    select.value = "script.foo";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.slot[data-slot-id="action-1"]')).toBeNull();
    expect(action0.classList.contains("expanded")).toBe(true);
    expect(action0.querySelector(".error")?.textContent).toContain("target is required");
  });

  test("clicking the +Add action dropdown without picking an option does NOT trigger close-validation", async () => {
    el = await mount({
      name: "test",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: [], params: { brightness: 80 } }],
    });
    const action0 = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action0.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    const select = el.shadowRoot.querySelector(".add-action select") as HTMLSelectElement;
    select.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(action0.querySelector(".error")).toBeNull();
  });

  test("cannot self-collapse a condition slot that has a validation error", async () => {
    // A slot with an error can't be minimized away — collapsing is gated just
    // like clicking out / saving. (Removing via the ✕ is always available.)
    el = await mount({
      name: "t",
      when: { people: { who: [] } }, // empty "X of" selection — invalid
      actions: [{ service: "script.foo", entity_ids: [], params: {} }],
    });
    const slot = el.shadowRoot.querySelector('.slot[data-slot-id="people"]') as HTMLElement;
    slot.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    const open = el.shadowRoot.querySelector('.slot[data-slot-id="people"]') as HTMLElement;
    expect(open.classList.contains("expanded")).toBe(true);

    // Click its own summary to minimize.
    open.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;

    const after = el.shadowRoot.querySelector('.slot[data-slot-id="people"]') as HTMLElement;
    expect(after.classList.contains("expanded")).toBe(true); // blocked
    expect(after.querySelector(".error")?.textContent?.toLowerCase()).toContain(
      "at least one person",
    );
  });

  test("clicking your own slot's title bar collapses it when it has no validation error", async () => {
    // Self-toggle is "minimize this for now" — allowed as long as the slot isn't
    // in error. Here the action's target requirement is unknown (schema not
    // loaded in jsdom), so there's no error to block on.
    el = await mount({
      name: "test",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: [], params: { brightness: 80 } }],
    });
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    const expanded = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    expect(expanded.classList.contains("expanded")).toBe(true);
    expanded.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    const collapsed = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    expect(collapsed.classList.contains("collapsed")).toBe(true);
    expect(collapsed.querySelector(".error")).toBeNull();
  });

  test("expanded name slot renders just the input — no summary header, no duplicate label", async () => {
    el = await mount({ name: "My scene", when: {}, actions: [] });
    const nameRow = el.shadowRoot.querySelector('.slot[data-slot-id="name"]') as HTMLElement;
    // Open it
    nameRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    const expanded = el.shadowRoot.querySelector('.slot[data-slot-id="name"]') as HTMLElement;
    // No .summary child inside the expanded name slot
    expect(expanded.querySelector(".summary")).toBeNull();
    // No <label> child either
    expect(expanded.querySelector("label")).toBeNull();
    // But the input IS rendered
    expect(expanded.querySelector('input[type="text"]')).toBeTruthy();
  });

  test("time-of-day slot keeps the summary header when expanded", async () => {
    el = await mount({ name: "test", when: { time_of_day: { period: "afternoon" } }, actions: [] });
    const todRow = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    todRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    const expanded = el.shadowRoot.querySelector(
      '.slot[data-slot-id="time_of_day"]',
    ) as HTMLElement;
    // Summary stays — user said they like it there
    expect(expanded.querySelector(".summary")).toBeTruthy();
    expect(expanded.querySelector(".body")).toBeTruthy();
  });

  test("clicking inside a nested shadow element (Time/Sun kind dropdown) does not collapse the slot", async () => {
    el = await mount({
      name: "test",
      when: {
        time_of_day: { from: { kind: "time", hh: 9, mm: 0 }, to: { kind: "time", hh: 17, mm: 0 } },
      },
      actions: [],
    });
    const todRow = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    todRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Allow nested custom elements to render
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    // Re-query after expansion
    const todExpanded = el.shadowRoot.querySelector(
      '.slot[data-slot-id="time_of_day"]',
    ) as HTMLElement;
    expect(todExpanded.classList.contains("expanded")).toBe(true);
    // Simulate a click event on a nested element (ambience-condition-input inside the slot).
    // Dispatching on the condition-input host with composed: true mimics a real click that
    // crosses shadow boundaries — composedPath() will include the .slot ancestor.
    const conditionInput = todExpanded.querySelector("ambience-condition-input") as HTMLElement;
    conditionInput.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await el.updateComplete;
    // Slot stays expanded
    const after = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    expect(after.classList.contains("expanded")).toBe(true);
  });

  test("re-passing the scene prop while the editor is open does NOT clobber the in-progress draft", async () => {
    // Regression: when HA fires area_registry_updated (e.g. an unrelated
    // device was added), the parent refetches all area configs, which
    // produces fresh scene objects. The editor used to deep-clone any new
    // `scene` reference, wiping the user's unsaved edits. The fix: only
    // initialize the draft when the editor *opens*; ignore prop changes
    // while open.
    el = await mount({ name: "original", when: {}, actions: [] });
    // User types a new name into the draft (we just set it via the
    // public setter so we don't depend on input wiring here).
    el._setName("user-edited name");
    await el.updateComplete;

    // Simulate the upstream refetch: a fresh Scene object with the same
    // *original* contents (as it would be after a no-op refresh).
    el.scene = { name: "original", when: {}, actions: [] };
    await el.updateComplete;

    // The user's edit must still be in the draft.
    expect((el as any)._draft.name).toBe("user-edited name");

    // Sanity: saving should emit the edited name, not the refetched one.
    let saved: Scene | undefined;
    el.addEventListener("save-scene", (e: CustomEvent) => {
      saved = e.detail.scene;
    });
    const saveBtn = Array.from(el.shadowRoot.querySelectorAll("button.primary")).find(
      (b: any) => b.textContent.trim() === "Save scene",
    ) as HTMLButtonElement;
    saveBtn.click();
    expect(saved?.name).toBe("user-edited name");
  });

  test("re-opening the editor on a different scene re-initializes the draft", async () => {
    // The flip side of the previous test: closing and re-opening on a new
    // scene should pick up the new scene.
    el = await mount({ name: "first", when: {}, actions: [] });
    el._setName("first-edited");
    await el.updateComplete;
    expect((el as any)._draft.name).toBe("first-edited");

    // Close, then re-open with a different scene.
    el.open = false;
    await el.updateComplete;
    el.scene = { name: "second", when: {}, actions: [] };
    el.open = true;
    await el.updateComplete;

    expect((el as any)._draft.name).toBe("second");
  });
});

describe("ambience-scene-editor — action picker from exposed-actions list", () => {
  let el: any;
  afterEach(() => {
    el?.remove();
  });

  test("Add-action picker exposes the placeholder + every exposed action", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const picker = el.shadowRoot.querySelector(".add-action") as HTMLElement;
    expect(picker).toBeTruthy();
    const select = picker.querySelector("select") as HTMLSelectElement;
    const options = Array.from(select.querySelectorAll("option"));
    expect(options[0]?.value).toBe("");
    expect(options[0]?.textContent).toMatch(/add action/i);
    const values = options.map((o: any) => o.value);
    expect(values).toContain("light.turn_on");
    expect(values).toContain("script.foo");
  });

  test("Add-action picker uses ExposedAction.label when set", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const select = el.shadowRoot.querySelector(".add-action select") as HTMLSelectElement;
    const options = Array.from(select.querySelectorAll("option"));
    const labels = options.map((o: any) => o.textContent.trim());
    expect(labels).toContain("Set light");
    expect(labels).toContain("Run foo script");
  });

  test("Add-action picker falls back to id when label is empty", async () => {
    const el2: any = document.createElement("ambience-scene-editor");
    el2.conditions = conditions;
    el2.availableActions = [
      { id: "homeassistant.reload_config", label: "", visible_fields: [], defaults: {} },
    ];
    el2.periods = periods;
    el2.hass = hass;
    el2.scope = { kind: "area", id: "living_room" };
    el2.scene = { name: "x", when: {}, actions: [] };
    el2.open = true;
    document.body.appendChild(el2);
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;
    const select = el2.shadowRoot.querySelector(".add-action select") as HTMLSelectElement;
    const labels = Array.from(select.querySelectorAll("option")).map((o: any) =>
      o.textContent.trim(),
    );
    expect(labels).toContain("homeassistant.reload_config");
    el2.remove();
  });

  test("selecting a service in the add-action picker creates a slot with ActionSpec.service set", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const select = el.shadowRoot.querySelector(".add-action select") as HTMLSelectElement;
    select.value = "script.foo";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(el._draft.actions[0].service).toBe("script.foo");
  });

  test("empty exposed-actions list renders a helpful inline note instead of a dropdown", async () => {
    const el2: any = document.createElement("ambience-scene-editor");
    el2.conditions = conditions;
    el2.availableActions = [];
    el2.periods = periods;
    el2.hass = hass;
    el2.scope = { kind: "area", id: "living_room" };
    el2.scene = { name: "x", when: {}, actions: [] };
    el2.open = true;
    document.body.appendChild(el2);
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;
    // No dropdown
    expect(el2.shadowRoot.querySelector(".add-action select")).toBeNull();
    // But a hint mentioning Settings → Actions
    expect(el2.shadowRoot.textContent.toLowerCase()).toMatch(/settings.*actions/);
    el2.remove();
  });
});

describe("ambience-scene-editor — template render-error gate", () => {
  let el: any;
  afterEach(() => {
    el?.remove();
  });

  const validAction = { service: "script.foo", entity_ids: [], params: {} };

  async function openTemplate(): Promise<HTMLElement> {
    const slot = el.shadowRoot.querySelector('.slot[data-slot-id="template"]') as HTMLElement;
    slot.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    return el.shadowRoot.querySelector('.slot[data-slot-id="template"]') as HTMLElement;
  }

  function reportRenderError(slot: HTMLElement, error: string | null) {
    slot.querySelector("ambience-condition-input")!.dispatchEvent(
      new CustomEvent("render-invalid-changed", {
        detail: { error },
        bubbles: true,
        composed: true,
      }),
    );
  }

  test("cannot close a template slot while its template has a render error", async () => {
    el = await mount({
      name: "t",
      when: { template: { template: "{{ bad }}" } },
      actions: [validAction],
    });
    const slot = await openTemplate();
    expect(slot.classList.contains("expanded")).toBe(true);

    reportRenderError(slot, "UndefinedError: 'bad' is undefined");
    await el.updateComplete;

    // Click outside the slot → attempt to close.
    (el.shadowRoot.querySelector("h3") as HTMLElement).dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
    await el.updateComplete;

    const after = el.shadowRoot.querySelector('.slot[data-slot-id="template"]') as HTMLElement;
    expect(after.classList.contains("expanded")).toBe(true); // still open — blocked
    expect(after.querySelector(".error")?.textContent?.toLowerCase()).toContain(
      "error in this condition",
    );
  });

  test("cannot collapse a template slot via its own summary while it has a render error", async () => {
    el = await mount({
      name: "t",
      when: { template: { template: "{{ bad }}" } },
      actions: [validAction],
    });
    const slot = await openTemplate();
    reportRenderError(slot, "boom");
    await el.updateComplete;

    // Click the slot's OWN summary — the "minimize for now" gesture.
    const reopened = el.shadowRoot.querySelector('.slot[data-slot-id="template"]') as HTMLElement;
    reopened.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;

    const after = el.shadowRoot.querySelector('.slot[data-slot-id="template"]') as HTMLElement;
    expect(after.classList.contains("expanded")).toBe(true); // still open — blocked
    expect(after.querySelector(".error")?.textContent?.toLowerCase()).toContain(
      "error in this condition",
    );
  });

  test("can close a template slot once the render error clears", async () => {
    el = await mount({
      name: "t",
      when: { template: { template: "{{ ok }}" } },
      actions: [validAction],
    });
    const slot = await openTemplate();
    reportRenderError(slot, "boom");
    reportRenderError(slot, null); // fixed
    await el.updateComplete;

    (el.shadowRoot.querySelector("h3") as HTMLElement).dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
    await el.updateComplete;

    const after = el.shadowRoot.querySelector('.slot[data-slot-id="template"]') as HTMLElement;
    expect(after.classList.contains("collapsed")).toBe(true); // closed — allowed
  });

  test("save is blocked while a template has a render error", async () => {
    el = await mount({
      name: "t",
      when: { template: { template: "{{ bad }}" } },
      actions: [validAction],
    });
    let saved = false;
    el.addEventListener("save-scene", () => {
      saved = true;
    });

    const slot = await openTemplate();
    reportRenderError(slot, "boom");
    await el.updateComplete;

    const saveBtn = Array.from(el.shadowRoot.querySelectorAll("button")).find((b: any) =>
      /save/i.test(b.textContent ?? ""),
    ) as HTMLButtonElement;
    saveBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;

    expect(saved).toBe(false);
    const after = el.shadowRoot.querySelector('.slot[data-slot-id="template"]') as HTMLElement;
    expect(after.classList.contains("expanded")).toBe(true); // reopened with error
  });

  test("save is blocked when an open action is missing a required target", async () => {
    el = await mount({
      name: "t",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: [], params: {} }],
    });
    let saved = false;
    el.addEventListener("save-scene", () => {
      saved = true;
    });

    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Tell the editor this service requires a target (schema loaded).
    action.querySelector("ambience-action-slot")!.dispatchEvent(
      new CustomEvent("target-mode-changed", {
        detail: { hasTarget: true },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    const saveBtn = Array.from(el.shadowRoot.querySelectorAll("button")).find((b: any) =>
      /save/i.test(b.textContent ?? ""),
    ) as HTMLButtonElement;
    saveBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;

    expect(saved).toBe(false);
    const after = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    expect(after.classList.contains("expanded")).toBe(true);
    expect(after.querySelector(".error")?.textContent?.toLowerCase()).toContain("target");
  });
});

describe("ambience-scene-editor — condition dropdown + full-height layout", () => {
  let el: any;
  afterEach(() => {
    el?.remove();
  });

  test("does not render a row for a toggleable condition that is not used in the scene", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    // mode is toggleable and not in `when` → no row
    expect(el.shadowRoot.querySelector('.slot[data-slot-id="mode"]')).toBeNull();
    // time_of_day is toggleable and not in `when` → no row
    expect(el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]')).toBeNull();
  });

  // Regression: an incomplete state condition (entity picked, value left blank)
  // could be navigated away from, leaving a half-filled predicate that renders
  // blank / gets lost. The state condition must report its invalidity so the
  // editor blocks leaving it, exactly like the template/people conditions.
  test("blocks adding a new condition while the open state condition is incomplete", async () => {
    el = await mount({
      name: "t",
      when: { state: { kind: "is", entity_id: "light.lamp_a", states: [] } }, // value blank
      actions: [],
    });
    // Open the state slot so its input mounts and reports validity to the editor.
    el._open = { kind: "condition", id: "state" };
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    // Try to add another condition — must be refused while state is incomplete.
    el._addCondition("mode");
    await el.updateComplete;

    expect(el._open).toEqual({ kind: "condition", id: "state" });
    expect(el._showError).toBe(true);
    // The incomplete state condition is still in the draft (not silently lost).
    expect(el._draft.when.state).toBeTruthy();
    // The blocking error renders in the state slot.
    const stateSlot = el.shadowRoot.querySelector('[data-slot-id="state"]');
    expect(stateSlot?.querySelector(".error")).toBeTruthy();
  });

  test("allows adding a new condition once the state condition is complete", async () => {
    el = await mount({
      name: "t",
      when: { state: { kind: "is", entity_id: "light.lamp_a", states: ["on"] } }, // complete
      actions: [],
    });
    el._open = { kind: "condition", id: "state" };
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    el._addCondition("mode");
    await el.updateComplete;

    expect(el._open).toEqual({ kind: "condition", id: "mode" });
    expect(el._showError).toBe(false);
  });

  test("renders a row for a toggleable condition that IS used in the scene", async () => {
    el = await mount({ name: "test", when: { time_of_day: { period: "afternoon" } }, actions: [] });
    expect(el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]')).toBeTruthy();
  });

  test("renders an add-condition dropdown listing unused toggleable conditions", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const select = el.shadowRoot.querySelector("select.add-condition") as HTMLSelectElement;
    expect(select).toBeTruthy();
    const values = Array.from(select.querySelectorAll("option")).map((o: any) => o.value);
    expect(values).toContain("time_of_day");
    // mode is now toggleable → also in the dropdown when not used
    expect(values).toContain("mode");
  });

  test("the add-condition dropdown excludes conditions that are already used", async () => {
    el = await mount({ name: "test", when: { time_of_day: { period: "afternoon" } }, actions: [] });
    const select = el.shadowRoot.querySelector("select.add-condition") as HTMLSelectElement | null;
    if (select) {
      const values = Array.from(select.querySelectorAll("option")).map((o: any) => o.value);
      expect(values).not.toContain("time_of_day");
    }
    // Either no dropdown (all used) or dropdown without time_of_day — both acceptable.
  });

  test("adding the people condition seeds a default 'Everybody is at Home' predicate", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const select = el.shadowRoot.querySelector("select.add-condition") as HTMLSelectElement;
    select.value = "people";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    // Draft is seeded with a real Everybody-is-at-Home predicate.
    expect(el._draft.when.people).toEqual({ quant: "everyone", where: "home" });
    // The row renders open with the "Everybody is at Home" summary.
    const row = el.shadowRoot.querySelector('.slot[data-slot-id="people"]') as HTMLElement;
    expect(row).toBeTruthy();
    expect(row.classList.contains("expanded")).toBe(true);
    expect(row.textContent).toContain("Everybody is at Home");
  });

  test("adding a non-people condition leaves its when entry absent (no default predicate)", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const select = el.shadowRoot.querySelector("select.add-condition") as HTMLSelectElement;
    select.value = "time_of_day";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect("time_of_day" in el._draft.when).toBe(false);
  });

  test("selecting a condition from the dropdown adds it as an open row", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const select = el.shadowRoot.querySelector("select.add-condition") as HTMLSelectElement;
    select.value = "time_of_day";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    const tod = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    expect(tod).toBeTruthy();
    expect(tod.classList.contains("expanded")).toBe(true);
  });

  test("clicking on the dropdown does NOT collapse the just-added condition slot", async () => {
    // Regression: in the real browser, picking a <select> option fires a
    // `change` followed by a `click` that bubbles to .modal. _onModalClick
    // would then call _tryCloseCurrent() and close the slot we just opened.
    el = await mount({ name: "test", when: {}, actions: [] });
    const select = el.shadowRoot.querySelector("select.add-condition") as HTMLSelectElement;
    select.value = "time_of_day";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    // Simulate the trailing click that comes from selecting an option.
    select.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await el.updateComplete;
    const tod = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    expect(tod).toBeTruthy();
    expect(tod.classList.contains("expanded")).toBe(true);
  });

  test("after adding a condition via the dropdown, it disappears from the dropdown options", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const select = el.shadowRoot.querySelector("select.add-condition") as HTMLSelectElement;
    select.value = "time_of_day";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    const select2 = el.shadowRoot.querySelector("select.add-condition") as HTMLSelectElement | null;
    if (select2) {
      const values = Array.from(select2.querySelectorAll("option")).map((o: any) => o.value);
      expect(values).not.toContain("time_of_day");
    }
  });

  test("toggleable condition row has a remove button that drops it from the scene", async () => {
    el = await mount({ name: "test", when: { time_of_day: { period: "afternoon" } }, actions: [] });
    const tod = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    const remove = tod.querySelector(".remove") as HTMLButtonElement;
    expect(remove).toBeTruthy();
    remove.click();
    await el.updateComplete;
    // Row is gone …
    expect(el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]')).toBeNull();
    // … and it reappears as an unused option in the dropdown.
    const select = el.shadowRoot.querySelector("select.add-condition") as HTMLSelectElement;
    const values = Array.from(select.querySelectorAll("option")).map((o: any) => o.value);
    expect(values).toContain("time_of_day");
  });

  test("removing a condition also clears its predicate from the saved scene", async () => {
    el = await mount({ name: "test", when: { time_of_day: { period: "afternoon" } }, actions: [] });
    const tod = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    (tod.querySelector(".remove") as HTMLButtonElement).click();
    await el.updateComplete;
    let saved: any;
    el.addEventListener("save-scene", (e: CustomEvent) => {
      saved = e.detail.scene;
    });
    (Array.from(el.shadowRoot.querySelectorAll("button.primary")) as HTMLButtonElement[])
      .find((b) => b.textContent?.trim() === "Save scene")!
      .click();
    expect("time_of_day" in saved.when).toBe(false);
  });

  test("mode appears in the +Add condition dropdown when not used in the scene", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const select = el.shadowRoot.querySelector("select.add-condition") as HTMLSelectElement;
    const values = Array.from(select.querySelectorAll("option")).map((o: any) => o.value);
    expect(values).toContain("mode"); // mode is now toggleable like the others
    expect(values).toContain("time_of_day");
  });

  test("mode row has a remove button now that it's toggleable", async () => {
    el = await mount({ name: "test", when: { mode: "movie" }, actions: [] });
    const mode = el.shadowRoot.querySelector('.slot[data-slot-id="mode"]') as HTMLElement;
    // The condition row keeps its summary chrome when toggleable (.summary is dropped
    // only in the expanded-combobox special case).
    expect(mode.querySelector(".remove")).toBeTruthy();
  });

  test("a condition with a null (any) predicate is hidden — appears in the dropdown instead of as a row", async () => {
    // Stored `when: { time_of_day: null }` should render exactly like an absent key.
    el = await mount({ name: "test", when: { time_of_day: null }, actions: [] });
    expect(el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]')).toBeNull();
    const select = el.shadowRoot.querySelector("select.add-condition") as HTMLSelectElement;
    const values = Array.from(select.querySelectorAll("option")).map((o: any) => o.value);
    expect(values).toContain("time_of_day");
  });

  test("save strips null predicates from `when`", async () => {
    el = await mount({ name: "test", when: { time_of_day: null, mode: "movie" }, actions: [] });
    let saved: any;
    el.addEventListener("save-scene", (e: CustomEvent) => {
      saved = e.detail.scene;
    });
    const saveBtn = Array.from(el.shadowRoot.querySelectorAll("button.primary")).find(
      (b: any) => b.textContent.trim() === "Save scene",
    ) as HTMLButtonElement;
    saveBtn.click();
    expect("time_of_day" in saved.when).toBe(false);
    expect(saved.when.mode).toBe("movie");
  });

  test("modal has a separate scrollable content area and a non-scrolling actions-bar", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const modal = el.shadowRoot.querySelector(".modal") as HTMLElement;
    // .content (scrollable) and .actions-bar (sticky footer) are direct children of .modal.
    const directChildren = Array.from(modal.children) as HTMLElement[];
    const content = directChildren.find((c) => c.classList.contains("content"));
    const actionsBar = directChildren.find((c) => c.classList.contains("actions-bar"));
    expect(content).toBeTruthy();
    expect(actionsBar).toBeTruthy();
    // The actions-bar lives outside the scrollable content so it stays anchored.
    expect(content!.querySelector(".actions-bar")).toBeNull();
  });
});

describe("ambience-scene-editor — no-target services (Fix 1)", () => {
  let el: any;

  beforeEach(() => {
    // Override the default mock to return a no-target schema for notify.send_message.
    vi.mocked(api.getServiceSchema).mockImplementation(async (_hass, id) => {
      if (id === "notify.send_message") {
        return { target: null, fields: { message: { selector: { text: {} } } } };
      }
      return {
        target: { entity: { domain: "light" } },
        fields: { brightness: { selector: { number: { min: 0, max: 100 } } } },
      };
    });
  });

  afterEach(() => {
    el?.remove();
    vi.mocked(api.getServiceSchema).mockReset();
  });

  const noTargetActions: ExposedAction[] = [
    {
      id: "notify.send_message",
      label: "Send notification",
      visible_fields: ["message"],
      defaults: {},
    },
  ];

  test("no-target service slot renders without a target picker", async () => {
    const el2: any = document.createElement("ambience-scene-editor");
    el2.conditions = conditions;
    el2.availableActions = noTargetActions;
    el2.periods = periods;
    el2.hass = hass;
    el2.scope = { kind: "area", id: "living_room" };
    el2.scene = {
      name: "test",
      when: {},
      actions: [{ service: "notify.send_message", entity_ids: [], params: {} }],
    };
    el2.open = true;
    document.body.appendChild(el2);
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;

    // Open the action slot
    const actionRow = el2.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    actionRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;

    const slot = actionRow.querySelector("ambience-action-slot") as any;
    expect(slot).toBeTruthy();
    // No target picker rendered for a no-target service
    expect(slot.shadowRoot.querySelector(".target-picker")).toBeNull();
    el = el2;
  });

  test("no-target service can be saved with empty entity_ids (validation does not block)", async () => {
    const el2: any = document.createElement("ambience-scene-editor");
    el2.conditions = conditions;
    el2.availableActions = noTargetActions;
    el2.periods = periods;
    el2.hass = hass;
    el2.scope = { kind: "area", id: "living_room" };
    el2.scene = {
      name: "test",
      when: {},
      actions: [{ service: "notify.send_message", entity_ids: [], params: {} }],
    };
    el2.open = true;
    document.body.appendChild(el2);
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;

    // Open the action slot so target-mode-changed fires and _serviceHasTarget is populated
    const actionRow = el2.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    actionRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;

    // Save should succeed (no validation error)
    let saved: Scene | undefined;
    el2.addEventListener("save-scene", (e: CustomEvent) => {
      saved = e.detail.scene;
    });
    el2.shadowRoot.querySelector("button.primary")!.dispatchEvent(new MouseEvent("click"));

    // Scene was saved
    expect(saved).toBeDefined();
    expect(saved!.actions[0].service).toBe("notify.send_message");
    expect(saved!.actions[0].entity_ids).toEqual([]);
    el = el2;
  });

  test("clicking outside an open no-target slot with empty entity_ids does NOT keep it open", async () => {
    const el2: any = document.createElement("ambience-scene-editor");
    el2.conditions = conditions;
    el2.availableActions = noTargetActions;
    el2.periods = periods;
    el2.hass = hass;
    el2.scope = { kind: "area", id: "living_room" };
    el2.scene = {
      name: "test",
      when: {},
      actions: [{ service: "notify.send_message", entity_ids: [], params: {} }],
    };
    el2.open = true;
    document.body.appendChild(el2);
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;

    // Open the action slot so target-mode-changed fires
    const actionRow = el2.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    actionRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;

    // Click outside — should collapse cleanly (no validation error blocking it)
    const h3 = el2.shadowRoot.querySelector("h3") as HTMLElement;
    h3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el2.updateComplete;

    // Slot should now be collapsed — no error
    const after = el2.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    expect(after.classList.contains("collapsed")).toBe(true);
    expect(after.querySelector(".error")).toBeNull();
    el = el2;
  });

  test("schema still loading (undefined _serviceHasTarget) does NOT block save or close", async () => {
    // Regression for the false-positive "at least one target" error: when the
    // action slot hasn't been rendered yet (no target-mode-changed emitted),
    // _serviceHasTarget has no entry → undefined. The old `!== false` guard
    // treated undefined the same as true (has target), showing an error before
    // the schema even loaded. The fix: only enforce when serviceHasTarget === true.
    const el2: any = document.createElement("ambience-scene-editor");
    el2.conditions = conditions;
    el2.availableActions = noTargetActions;
    el2.periods = periods;
    el2.hass = hass;
    el2.scope = { kind: "area", id: "living_room" };
    el2.scene = {
      name: "test",
      when: {},
      actions: [{ service: "notify.send_message", entity_ids: [], params: {} }],
    };
    el2.open = true;
    document.body.appendChild(el2);
    // Wait only enough for the editor to render its collapsed summary — do NOT
    // open the action slot, so target-mode-changed never fires and
    // _serviceHasTarget remains empty (all undefined).
    await el2.updateComplete;

    // _serviceHasTarget must have no entry for this service yet.
    expect((el2 as any)._serviceHasTarget.has("notify.send_message")).toBe(false);

    // Even with empty entity_ids and unknown hasTarget, validation must NOT block save.
    let saved: Scene | undefined;
    el2.addEventListener("save-scene", (e: CustomEvent) => {
      saved = e.detail.scene;
    });
    el2.shadowRoot.querySelector("button.primary")!.dispatchEvent(new MouseEvent("click"));

    expect(saved).toBeDefined();
    expect(saved!.actions[0].entity_ids).toEqual([]);
    el = el2;
  });
});

describe("ambience-scene-editor — people condition empty-selection validation", () => {
  let el: any;
  afterEach(() => {
    el?.remove();
  });

  // hass with one person so the people widget renders a checklist.
  const peopleHass = {
    ...hass,
    states: {
      "person.alice": {
        entity_id: "person.alice",
        state: "home",
        attributes: { friendly_name: "Alice" },
      },
    },
  } as any;

  async function openPeople(): Promise<HTMLElement> {
    const slot = el.shadowRoot.querySelector('.slot[data-slot-id="people"]') as HTMLElement;
    slot.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    return el.shadowRoot.querySelector('.slot[data-slot-id="people"]') as HTMLElement;
  }

  test("_validationError returns the message for a people predicate with who:[]", async () => {
    el = await mount(
      { name: "t", when: { people: { quant: "any", who: [], where: "home" } }, actions: [] },
      { hass: peopleHass },
    );
    expect(el._validationError({ kind: "condition", id: "people" })).toBe(
      "Select at least one person",
    );
    // A non-empty who is valid.
    expect(el._validationError({ kind: "condition", id: "mode" })).toBeNull();
  });

  test("a non-empty (or who-less) people predicate is valid", async () => {
    el = await mount(
      {
        name: "t",
        when: { people: { quant: "any", who: ["person.alice"], where: "home" } },
        actions: [],
      },
      { hass: peopleHass },
    );
    expect(el._validationError({ kind: "condition", id: "people" })).toBeNull();
    el.remove();
    el = await mount(
      { name: "t", when: { people: { quant: "everyone", where: "home" } }, actions: [] },
      { hass: peopleHass },
    );
    expect(el._validationError({ kind: "condition", id: "people" })).toBeNull();
  });

  test("the open people slot renders the inline error when who is empty", async () => {
    el = await mount(
      { name: "t", when: { people: { quant: "any", who: [], where: "home" } }, actions: [] },
      { hass: peopleHass },
    );
    const slot = await openPeople();
    // Switching focus away (clicking outside) surfaces the error and keeps it open.
    const h3 = el.shadowRoot.querySelector("h3") as HTMLElement;
    h3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(slot.classList.contains("expanded")).toBe(true);
    expect(slot.querySelector(".error")?.textContent).toContain("Select at least one person");
  });

  test("an empty people selection blocks switching to another slot", async () => {
    el = await mount(
      {
        name: "t",
        when: { people: { quant: "any", who: [], where: "home" }, mode: "movie" },
        actions: [],
      },
      { hass: peopleHass },
    );
    const people = await openPeople();
    const mode = el.shadowRoot.querySelector('.slot[data-slot-id="mode"]') as HTMLElement;
    mode.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // People stays open; mode stays collapsed.
    expect(people.classList.contains("expanded")).toBe(true);
    expect(mode.classList.contains("collapsed")).toBe(true);
  });

  test("an empty people selection blocks _save and opens the offending slot", async () => {
    el = await mount(
      { name: "t", when: { people: { quant: "any", who: [], where: "home" } }, actions: [] },
      { hass: peopleHass },
    );
    let saved: Scene | undefined;
    el.addEventListener("save-scene", (e: CustomEvent) => {
      saved = e.detail.scene;
    });
    const saveBtn = Array.from(el.shadowRoot.querySelectorAll("button.primary")).find(
      (b: any) => b.textContent.trim() === "Save scene",
    ) as HTMLButtonElement;
    saveBtn.click();
    await el.updateComplete;
    expect(saved).toBeUndefined();
    const slot = el.shadowRoot.querySelector('.slot[data-slot-id="people"]') as HTMLElement;
    expect(slot.classList.contains("expanded")).toBe(true);
    expect(slot.querySelector(".error")?.textContent).toContain("Select at least one person");
  });

  test("selecting a person clears the error and allows save", async () => {
    el = await mount(
      { name: "t", when: { people: { quant: "any", who: [], where: "home" } }, actions: [] },
      { hass: peopleHass },
    );
    await openPeople();
    // Tick Alice via the people widget's native checkbox. The widget lives one
    // shadow root deeper, inside <ambience-condition-input>.
    const mi = el.shadowRoot.querySelector("ambience-condition-input") as any;
    const widget = mi.shadowRoot.querySelector("ambience-people-predicate-input") as any;
    const cb = widget.shadowRoot.querySelector("input[type=checkbox]") as HTMLInputElement;
    cb.checked = true;
    cb.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(el._validationError({ kind: "condition", id: "people" })).toBeNull();

    let saved: Scene | undefined;
    el.addEventListener("save-scene", (e: CustomEvent) => {
      saved = e.detail.scene;
    });
    const saveBtn = Array.from(el.shadowRoot.querySelectorAll("button.primary")).find(
      (b: any) => b.textContent.trim() === "Save scene",
    ) as HTMLButtonElement;
    saveBtn.click();
    await el.updateComplete;
    expect(saved).toBeDefined();
    expect((saved!.when.people as any).who).toEqual(["person.alice"]);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Re-apply interval override in scene-editor action rows
// ────────────────────────────────────────────────────────────────────────────

describe("ambience-scene-editor — reapply interval override", () => {
  let el: any;
  afterEach(() => {
    el?.remove();
    vi.mocked(api.getServiceSchema).mockReset();
  });

  const reapplyActions: ExposedAction[] = [
    {
      id: "light.turn_on",
      label: "Set light",
      visible_fields: [],
      defaults: {},
      reapply_seconds: 300, // exposed default = 300s
    },
    {
      id: "script.foo",
      label: "Run foo script",
      visible_fields: [],
      defaults: {},
      // no reapply_seconds → re-apply not enabled on this action
    },
  ];

  async function mountWithReapply(scene: import("../frontend/src/types").Scene): Promise<any> {
    const editorEl: any = document.createElement("ambience-scene-editor");
    editorEl.conditions = conditions;
    editorEl.availableActions = reapplyActions;
    editorEl.periods = periods;
    editorEl.hass = hass;
    editorEl.scope = { kind: "area", id: "living_room" };
    editorEl.scene = scene;
    editorEl.open = true;
    document.body.appendChild(editorEl);
    await editorEl.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await editorEl.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await editorEl.updateComplete;
    return editorEl;
  }

  async function openActionSlot(editorEl: any, idx = 0) {
    const action = editorEl.shadowRoot.querySelector(
      `.slot[data-slot-id="action-${idx}"]`,
    ) as HTMLElement;
    action.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await editorEl.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await editorEl.updateComplete;
    return editorEl.shadowRoot.querySelector(`.slot[data-slot-id="action-${idx}"]`) as HTMLElement;
  }

  // --- Control visibility ---

  test("reapply override control is shown when exposed action has reapply_seconds > 0", async () => {
    el = await mountWithReapply({
      name: "t",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: [], params: {} }],
    });
    const slot = await openActionSlot(el);
    expect(slot.querySelector("[data-reapply-override]")).not.toBeNull();
  });

  test("reapply override control is HIDDEN when exposed action has no reapply_seconds", async () => {
    el = await mountWithReapply({
      name: "t",
      when: {},
      actions: [{ service: "script.foo", entity_ids: [], params: {} }],
    });
    const slot = await openActionSlot(el);
    expect(slot.querySelector("[data-reapply-override]")).toBeNull();
  });

  // --- Field value / placeholder ---

  test("empty field (key absent) shows placeholder = exposed default seconds", async () => {
    el = await mountWithReapply({
      name: "t",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: [], params: {} }],
    });
    const slot = await openActionSlot(el);
    const input = slot.querySelector("[data-reapply-override]") as HTMLInputElement;
    expect(input.value).toBe("");
    expect(input.placeholder).toBe("300");
  });

  test("explicit override value appears in the field", async () => {
    el = await mountWithReapply({
      name: "t",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: [], params: {}, reapply_seconds: 120 }],
    });
    const slot = await openActionSlot(el);
    const input = slot.querySelector("[data-reapply-override]") as HTMLInputElement;
    expect(input.value).toBe("120");
  });

  test("explicit override of 0 (disable) shows '0' in the field", async () => {
    el = await mountWithReapply({
      name: "t",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: [], params: {}, reapply_seconds: 0 }],
    });
    const slot = await openActionSlot(el);
    const input = slot.querySelector("[data-reapply-override]") as HTMLInputElement;
    expect(input.value).toBe("0");
  });

  // --- Mutations ---

  test("clearing the field (empty) removes reapply_seconds key (inherit)", async () => {
    el = await mountWithReapply({
      name: "t",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: [], params: {}, reapply_seconds: 120 }],
    });
    const slot = await openActionSlot(el);
    const input = slot.querySelector("[data-reapply-override]") as HTMLInputElement;
    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect("reapply_seconds" in el._draft.actions[0]).toBe(false);
  });

  test("typing '0' stores reapply_seconds: 0 (disable for this scene)", async () => {
    el = await mountWithReapply({
      name: "t",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: [], params: {} }],
    });
    const slot = await openActionSlot(el);
    const input = slot.querySelector("[data-reapply-override]") as HTMLInputElement;
    input.value = "0";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(el._draft.actions[0].reapply_seconds).toBe(0);
  });

  test("typing '120' stores reapply_seconds: 120 (seconds, not minutes)", async () => {
    el = await mountWithReapply({
      name: "t",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: [], params: {} }],
    });
    const slot = await openActionSlot(el);
    const input = slot.querySelector("[data-reapply-override]") as HTMLInputElement;
    input.value = "120";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(el._draft.actions[0].reapply_seconds).toBe(120);
  });

  // --- Badge ---

  test("badge appears and shows effective seconds when inheriting exposed default", async () => {
    el = await mountWithReapply({
      name: "t",
      when: {},
      // reapply_seconds absent → inherits exposed default (300s)
      actions: [{ service: "light.turn_on", entity_ids: [], params: {} }],
    });
    const slot = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    const badge = slot.querySelector("[data-reapply-badge]") as HTMLElement;
    expect(badge).not.toBeNull();
    expect(badge.textContent).toContain("300");
    expect(badge.textContent).toContain("s");
  });

  test("badge shows the overridden value when a custom override is set", async () => {
    el = await mountWithReapply({
      name: "t",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: [], params: {}, reapply_seconds: 60 }],
    });
    const slot = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    const badge = slot.querySelector("[data-reapply-badge]") as HTMLElement;
    expect(badge).not.toBeNull();
    expect(badge.textContent).toContain("60");
  });

  test("badge does NOT appear for an action whose exposed default has no reapply", async () => {
    el = await mountWithReapply({
      name: "t",
      when: {},
      // script.foo has no reapply_seconds default
      actions: [{ service: "script.foo", entity_ids: [], params: {} }],
    });
    const slot = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    expect(slot.querySelector("[data-reapply-badge]")).toBeNull();
  });

  test("badge does NOT appear when override is 0 (explicitly disabled)", async () => {
    el = await mountWithReapply({
      name: "t",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: [], params: {}, reapply_seconds: 0 }],
    });
    const slot = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    expect(slot.querySelector("[data-reapply-badge]")).toBeNull();
  });

  // --- Save semantics (key-presence) ---

  test("saved scene preserves absent reapply_seconds (inherit) in the emitted payload", async () => {
    el = await mountWithReapply({
      name: "t",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: ["light.lamp_a"], params: {} }],
    });
    let saved: any;
    el.addEventListener("save-scene", (e: CustomEvent) => {
      saved = e.detail.scene;
    });
    el.shadowRoot.querySelector("button.primary")!.dispatchEvent(new MouseEvent("click"));
    await el.updateComplete;
    expect(saved).toBeDefined();
    expect("reapply_seconds" in saved.actions[0]).toBe(false);
  });

  test("saved scene preserves reapply_seconds: 0 (explicitly off) — key must NOT be stripped", async () => {
    el = await mountWithReapply({
      name: "t",
      when: {},
      actions: [
        { service: "light.turn_on", entity_ids: ["light.lamp_a"], params: {}, reapply_seconds: 0 },
      ],
    });
    let saved: any;
    el.addEventListener("save-scene", (e: CustomEvent) => {
      saved = e.detail.scene;
    });
    el.shadowRoot.querySelector("button.primary")!.dispatchEvent(new MouseEvent("click"));
    await el.updateComplete;
    expect(saved).toBeDefined();
    expect(saved.actions[0].reapply_seconds).toBe(0);
  });
});

describe("ambience-scene-editor — category selector", () => {
  let el: any;
  afterEach(() => {
    el?.remove();
  });

  const categories: SceneCategory[] = [
    { id: "morning", name: "Morning" },
    { id: "blinds", name: "Blinds" },
  ];

  // Category option rows after opening the category slot: their names and which is
  // marked selected (aria-selected="true").
  function categoryOptions(el: any): { names: string[]; selected: string | undefined } {
    const opts = Array.from(el.shadowRoot.querySelectorAll(".category-option")) as HTMLElement[];
    const names = opts.map((o) => o.querySelector(".category-name")!.textContent!.trim());
    const selected = opts
      .find((o) => o.getAttribute("aria-selected") === "true")
      ?.querySelector(".category-name")
      ?.textContent?.trim();
    return { names, selected };
  }

  test("category selector has no empty option and preselects the scene's category", async () => {
    el = await mount(
      { name: "t", when: {}, actions: [], category: "b" },
      {
        categories: [
          { id: "a", name: "A" },
          { id: "b", name: "B" },
        ],
      },
    );
    await openSlot(el, "category");
    const { names, selected } = categoryOptions(el);
    expect(names).toEqual(["A", "B"]); // no empty option
    expect(selected).toBe("B");
  });

  test("changing the category sets a real id (never undefined)", async () => {
    el = await mount(
      { name: "t", when: {}, actions: [], category: "a" },
      { categories: [{ id: "a", name: "A" }] },
    );
    el._setCategory("a");
    expect(el._draft.category).toBe("a");
  });

  test("changing the category resets the scene's pinned priority", async () => {
    el = await mount(
      { name: "t", when: {}, actions: [], category: "a", pinned: true, priority: 4096 },
      {
        categories: [
          { id: "a", name: "A" },
          { id: "b", name: "B" },
        ],
      },
    );
    el._setCategory("b");
    expect(el._draft.category).toBe("b");
    expect(el._draft.pinned).toBeUndefined();
    expect(el._draft.priority).toBeUndefined();
  });

  test("re-selecting the same category keeps the pin", async () => {
    el = await mount(
      { name: "t", when: {}, actions: [], category: "a", pinned: true, priority: 4096 },
      {
        categories: [
          { id: "a", name: "A" },
          { id: "b", name: "B" },
        ],
      },
    );
    el._setCategory("a");
    expect(el._draft.pinned).toBe(true);
    expect(el._draft.priority).toBe(4096);
  });

  test("selector marks the scene's current category as selected", async () => {
    el = await mount({ name: "t", when: {}, actions: [], category: "blinds" }, { categories });
    await openSlot(el, "category");
    expect(categoryOptions(el).selected).toBe("Blinds");
  });

  test("a scene with an unset category defaults to the alphabetically-first category", async () => {
    // category is required, but defend against a hand-edited/empty value: the
    // current selection still resolves to a real category (the first by name).
    el = await mount({ name: "t", when: {}, actions: [], category: "" }, { categories });
    await openSlot(el, "category");
    // categories = Morning, Blinds → sorted by name: Blinds first.
    expect(categoryOptions(el).selected).toBe("Blinds");
  });

  test("selecting a category option sets the draft and saves it", async () => {
    el = await mount({ name: "t", when: {}, actions: [], category: "morning" }, { categories });
    await openSlot(el, "category");
    const blinds = Array.from(el.shadowRoot.querySelectorAll(".category-option")).find(
      (o: any) => o.querySelector(".category-name").textContent.trim() === "Blinds",
    ) as HTMLButtonElement;
    blinds.click();
    await el.updateComplete;
    expect(el._draft.category).toBe("blinds");
    // picking an option collapses the slot again
    expect(el.shadowRoot.querySelector(".category-option")).toBeNull();

    let saved: Scene | undefined;
    el.addEventListener("save-scene", (e: CustomEvent) => {
      saved = e.detail.scene;
    });
    const saveBtn = Array.from(el.shadowRoot.querySelectorAll("button.primary")).find(
      (b: any) => b.textContent.trim() === "Save scene",
    ) as HTMLButtonElement;
    saveBtn.click();
    expect(saved?.category).toBe("blinds");
  });

  test("category options show the icon on the category's colour (like the filter)", async () => {
    el = await mount(
      { name: "t", when: {}, actions: [], category: "g1" },
      { categories: [{ id: "g1", name: "G1", color: "red", icon: "mdi:weather-sunny" }] },
    );
    // The collapsed summary already shows the coloured swatch + icon.
    const swatch = el.shadowRoot.querySelector(
      '[data-slot-id="category"] .category-swatch',
    ) as HTMLElement;
    expect(swatch).toBeTruthy();
    expect(swatch.getAttribute("style") || "").toContain("#f44336"); // red
    expect(swatch.querySelector("ha-icon")?.getAttribute("icon")).toBe("mdi:weather-sunny");
  });

  test("no category field rendered when there are no categories", async () => {
    el = await mount({ name: "t", when: {}, actions: [], category: "morning" });
    expect(el.shadowRoot.querySelector('[data-slot-id="category"]')).toBeNull();
  });

  test("category field IS rendered when there is one category", async () => {
    el = await mount(
      { name: "t", when: {}, actions: [], category: "blinds" },
      { categories: [{ id: "blinds", name: "Blinds" }] },
    );
    expect(el.shadowRoot.querySelector('[data-slot-id="category"]')).toBeTruthy();
    await openSlot(el, "category");
    expect(el.shadowRoot.querySelector(".category-option")).toBeTruthy();
  });

  test("the category is collapsed by default; its summary shows the current category", async () => {
    el = await mount({ name: "t", when: {}, actions: [], category: "blinds" }, { categories });
    const summary = el.shadowRoot.querySelector('[data-slot-id="category"] .summary');
    expect(summary).toBeTruthy();
    expect(summary.textContent).toContain("Blinds");
    // collapsed: the option menu is not in the DOM until the slot is opened.
    expect(el.shadowRoot.querySelector(".category-option")).toBeNull();
    await openSlot(el, "category");
    expect(el.shadowRoot.querySelector(".category-option")).toBeTruthy();
  });
});

describe("ambience-scene-editor — destination selector", () => {
  let el: any;
  afterEach(() => {
    el?.remove();
  });

  const scopes = [
    { scope: { kind: "house" }, label: "House" },
    { scope: { kind: "area", id: "living_room" }, label: "Area: Living Room" },
    { scope: { kind: "area", id: "bedroom" }, label: "Area: Bedroom" },
  ];

  async function mountWithScopes(scene: Scene, scope: Scope): Promise<any> {
    const e: any = document.createElement("ambience-scene-editor");
    e.conditions = conditions;
    e.availableActions = availableActions;
    e.periods = periods;
    e.hass = hass;
    e.scope = scope;
    e.scopes = scopes;
    e.scene = scene;
    e.open = true;
    document.body.appendChild(e);
    await e.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await e.updateComplete;
    return e;
  }

  // Expanding the scope slot shows the option list directly (like the category
  // field) — one click, no trigger.
  async function openScopeMenu(e: any): Promise<NodeListOf<HTMLElement>> {
    await openSlot(e, "destination");
    return e.shadowRoot.querySelectorAll(".scope-option");
  }

  test("renders a destination option per scope, defaulting to the scene's scope", async () => {
    el = await mountWithScopes({ when: {}, actions: [] }, { kind: "area", id: "bedroom" });
    const options = await openScopeMenu(el);
    expect(options.length).toBe(3);
    const selected = el.shadowRoot.querySelector(
      '.scope-option[aria-selected="true"]',
    ) as HTMLElement;
    expect(selected.textContent).toContain("Area: Bedroom");
  });

  test("the expanded scope dropdown shows an icon per option", async () => {
    el = await mountWithScopes({ when: {}, actions: [] }, { kind: "house" });
    const options = await openScopeMenu(el);
    const icons = Array.from(options).map((o) =>
      o.querySelector("ha-icon.scope-icon")?.getAttribute("icon"),
    );
    // scopes = [house, area living_room, area bedroom]
    expect(icons).toEqual(["mdi:home", "mdi:texture-box", "mdi:texture-box"]);
  });

  test("the collapsed destination summary shows the current scope label", async () => {
    el = await mountWithScopes({ when: {}, actions: [] }, { kind: "area", id: "bedroom" });
    const summary = el.shadowRoot.querySelector('[data-slot-id="destination"] .summary');
    expect(summary).toBeTruthy();
    expect(summary.textContent).toContain("Area: Bedroom");
    // collapsed by default: the picker is not in the DOM until clicked open.
    expect(el.shadowRoot.querySelector(".scope-option")).toBeNull();
  });

  test("the destination summary label reads 'Scope' (not 'Destination')", async () => {
    el = await mountWithScopes({ when: {}, actions: [] }, { kind: "area", id: "bedroom" });
    const summary = el.shadowRoot.querySelector('[data-slot-id="destination"] .summary') as Element;
    expect(summary.textContent).toContain("Scope");
    expect(summary.textContent).not.toContain("Destination");
  });

  test("the destination summary shows the current scope's icon", async () => {
    el = await mountWithScopes({ when: {}, actions: [] }, { kind: "area", id: "living_room" });
    const icon = el.shadowRoot.querySelector(
      '[data-slot-id="destination"] .summary ha-icon.scope-icon',
    ) as Element;
    expect(icon).toBeTruthy();
    expect(icon.getAttribute("icon")).toBe("mdi:texture-box");
  });

  test("the destination summary icon reflects the scope kind (house)", async () => {
    el = await mountWithScopes({ when: {}, actions: [] }, { kind: "house" });
    const icon = el.shadowRoot.querySelector(
      '[data-slot-id="destination"] .summary ha-icon.scope-icon',
    ) as Element;
    expect(icon.getAttribute("icon")).toBe("mdi:home");
  });

  test("the destination slot is rendered after the category slot", async () => {
    el = await mount(
      { name: "t", when: {}, actions: [], category: "a" },
      { categories: [{ id: "a", name: "A" }], scopes },
    );
    const category = el.shadowRoot.querySelector('[data-slot-id="category"]');
    const destination = el.shadowRoot.querySelector('[data-slot-id="destination"]');
    expect(category).toBeTruthy();
    expect(destination).toBeTruthy();
    // destination must come AFTER the category slot in document order.
    expect(
      category.compareDocumentPosition(destination) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  test("changing destination clears out-of-scope action targets, keeps conditions", async () => {
    const hass2 = {
      ...hass,
      entities: {
        "light.lamp_a": { entity_id: "light.lamp_a", area_id: "living_room" },
        "light.bed": { entity_id: "light.bed", area_id: "bedroom" },
      },
    } as any;
    const e: any = document.createElement("ambience-scene-editor");
    e.conditions = conditions;
    e.availableActions = availableActions;
    e.periods = periods;
    e.hass = hass2;
    e.scope = { kind: "area", id: "living_room" };
    e.scopes = scopes;
    e.scene = {
      when: { state: { atom: { kind: "is", entity_id: "light.lamp_a", states: ["on"] } } },
      actions: [{ service: "light.turn_on", entity_ids: ["light.lamp_a"], params: {} }],
    };
    e.open = true;
    document.body.appendChild(e);
    await e.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await e.updateComplete;
    el = e;

    const options = await openScopeMenu(el);
    (options[2] as HTMLElement).click(); // Area: Bedroom
    await el.updateComplete;

    // light.lamp_a is in living_room, not bedroom → action target cleared.
    expect(el._draft.actions[0].entity_ids).toEqual([]);
    // Condition entity reference is left untouched.
    expect(el._draft.when.state.atom.entity_id).toBe("light.lamp_a");
  });

  test("save-scene carries the scene and the selected destination scope", async () => {
    el = await mountWithScopes({ when: {}, actions: [] }, { kind: "area", id: "living_room" });
    const options = await openScopeMenu(el);
    (options[2] as HTMLElement).click(); // Area: Bedroom
    await el.updateComplete;

    let saved: any;
    el.addEventListener("save-scene", (e: CustomEvent) => {
      saved = e.detail;
    });
    (el.shadowRoot.querySelector("button.primary") as HTMLElement).click();
    await el.updateComplete;

    expect(saved.scope).toEqual({ kind: "area", id: "bedroom" });
    expect(saved.scene.when).toEqual({});
  });

  test("the destination slot starts collapsed on mount", async () => {
    const e: any = document.createElement("ambience-scene-editor");
    e.conditions = conditions;
    e.availableActions = availableActions;
    e.periods = periods;
    e.hass = hass;
    e.scope = { kind: "area", id: "bedroom" };
    e.scopes = scopes;
    e.scene = { when: {}, actions: [] };
    e.open = true;
    document.body.appendChild(e);
    await e.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await e.updateComplete;
    el = e;
    // Collapsed by default: the summary is shown, the option list is not.
    expect(el.shadowRoot.querySelector('[data-slot-id="destination"] .summary')).toBeTruthy();
    expect(el.shadowRoot.querySelector(".scope-option")).toBeNull();
  });
});

describe("ambience-scene-editor — unique name per scope + category", () => {
  let el: any;
  afterEach(() => {
    el?.remove();
  });

  const cats: SceneCategory[] = [
    { id: "a", name: "Alpha" },
    { id: "b", name: "Beta" },
  ];

  function clickSave(e: any) {
    (e.shadowRoot.querySelector("button.primary") as HTMLElement).click();
  }

  function captureSave(e: any): { detail: any } {
    const out: { detail: any } = { detail: null };
    e.addEventListener("save-scene", (ev: CustomEvent) => {
      out.detail = ev.detail;
    });
    return out;
  }

  test("blocks save when the name duplicates a sibling in the same scope + category", async () => {
    el = await mount(
      { name: "Movie", when: {}, actions: [], category: "a" },
      { scope: { kind: "area", id: "living_room" }, categories: cats },
    );
    el.takenNames = new Map([["area:living_room\u0000a", new Set(["movie"])]]);
    await el.updateComplete;
    const saved = captureSave(el);

    clickSave(el);
    await el.updateComplete;

    expect(saved.detail).toBeNull();
    const err = el.shadowRoot.querySelector('[data-slot-id="name"] .error');
    expect(err?.textContent).toContain("already exists");
  });

  test("the duplicate match is case-insensitive and trimmed", async () => {
    el = await mount(
      { name: "  mOvIe  ", when: {}, actions: [], category: "a" },
      { scope: { kind: "area", id: "living_room" }, categories: cats },
    );
    el.takenNames = new Map([["area:living_room\u0000a", new Set(["movie"])]]);
    await el.updateComplete;
    const saved = captureSave(el);

    clickSave(el);
    await el.updateComplete;

    expect(saved.detail).toBeNull();
  });

  test("allows save when the name is unique in the scope + category", async () => {
    el = await mount(
      { name: "Dinner", when: {}, actions: [], category: "a" },
      { scope: { kind: "area", id: "living_room" }, categories: cats },
    );
    el.takenNames = new Map([["area:living_room\u0000a", new Set(["movie"])]]);
    await el.updateComplete;
    const saved = captureSave(el);

    clickSave(el);
    await el.updateComplete;

    expect(saved.detail).not.toBeNull();
    expect(saved.detail.scene.name).toBe("Dinner");
  });

  test("the same name is allowed in a different category", async () => {
    el = await mount(
      { name: "Movie", when: {}, actions: [], category: "b" },
      { scope: { kind: "area", id: "living_room" }, categories: cats },
    );
    // "movie" taken only in category "a", not "b".
    el.takenNames = new Map([["area:living_room\u0000a", new Set(["movie"])]]);
    await el.updateComplete;
    const saved = captureSave(el);

    clickSave(el);
    await el.updateComplete;

    expect(saved.detail).not.toBeNull();
  });

  test("an empty name is exempt from the uniqueness check", async () => {
    el = await mount(
      { name: "", when: {}, actions: [], category: "a" },
      { scope: { kind: "area", id: "living_room" }, categories: cats },
    );
    el.takenNames = new Map([["area:living_room\u0000a", new Set([""])]]);
    await el.updateComplete;
    const saved = captureSave(el);

    clickSave(el);
    await el.updateComplete;

    expect(saved.detail).not.toBeNull();
  });

  // A name conflict is resolvable from another slot — move the scene to a
  // category (or scope) where the name is free. So unlike a malformed
  // condition/action, it must NOT lock the user into the name slot. (Regression:
  // duplicating a scene and hitting Save force-opened the name slot, and the
  // slot-leave guard then refused to open the category/destination slot, so the
  // only escape was renaming.)
  test("a name conflict does not lock the user into the name slot — the category slot still opens", async () => {
    el = await mount(
      { name: "Movie", when: {}, actions: [], category: "a" },
      { scope: { kind: "area", id: "living_room" }, categories: cats },
    );
    el.takenNames = new Map([["area:living_room\u0000a", new Set(["movie"])]]);
    await el.updateComplete;

    // Save is blocked and the name slot is force-opened with the conflict error.
    clickSave(el);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[data-slot-id="name"] .error')?.textContent).toContain(
      "already exists",
    );

    // The user should be able to open the category slot to resolve the conflict.
    await openSlot(el, "category");

    const catSlot = el.shadowRoot.querySelector('[data-slot-id="category"]') as HTMLElement;
    expect(catSlot.classList.contains("expanded")).toBe(true);
    expect(el.shadowRoot.querySelector(".category-option")).toBeTruthy();
  });

  test("renders a parent-supplied save error in the actions bar", async () => {
    el = await mount(
      { name: "Movie", when: {}, actions: [], category: "a" },
      { scope: { kind: "area", id: "living_room" }, categories: cats },
    );
    el.saveError = "Backend rejected the save";
    await el.updateComplete;

    const err = el.shadowRoot.querySelector(".actions-bar .error");
    expect(err?.textContent).toContain("Backend rejected the save");
  });

  test("moving to a free category from a conflicting name lets the scene save", async () => {
    el = await mount(
      { name: "Movie", when: {}, actions: [], category: "a" },
      { scope: { kind: "area", id: "living_room" }, categories: cats },
    );
    // "movie" is taken in category "a" only.
    el.takenNames = new Map([["area:living_room\u0000a", new Set(["movie"])]]);
    await el.updateComplete;
    const saved = captureSave(el);

    // Blocked; name slot force-opened.
    clickSave(el);
    await el.updateComplete;
    expect(saved.detail).toBeNull();

    // Open the category slot and pick "Beta" (b) — where "movie" is free.
    await openSlot(el, "category");
    const beta = Array.from(el.shadowRoot.querySelectorAll(".category-option")).find(
      (b: any) => b.textContent.trim() === "Beta",
    ) as HTMLElement;
    beta.click();
    await el.updateComplete;

    // Now saving succeeds with the new category.
    clickSave(el);
    await el.updateComplete;
    expect(saved.detail).not.toBeNull();
    expect(saved.detail.scene.category).toBe("b");
  });
});
