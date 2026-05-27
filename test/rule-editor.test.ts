import { describe, test, expect, afterEach } from "vitest";
import "../frontend/src/views/rule-editor";
import type { ActionInfo, MatcherInfo, Rule, Scope } from "../frontend/src/types";

const matchers: MatcherInfo[] = [
  { name: "scene", description: "", predicate_help: "", input: "scene_combobox", priority: 0 },
  { name: "time_of_day", description: "", predicate_help: "", input: "time_of_day", priority: 200 },
];

const availableActions: ActionInfo[] = [
  {
    name: "set_light",
    description: "",
    domains: ["light"],
    kind: "standard",
    target_params: [
      { name: "brightness", type: "int", required: true, min: 0, max: 100, unit: "%", description: "Percentage brightness, 0 for off" },
      { name: "transition", type: "number", required: false, min: 0, unit: "s", description: "Seconds" },
    ],
  },
  {
    name: "script",
    description: "",
    domains: [],
    kind: "script",
    target_params: [],
  },
];

const periods = { builtins: {}, custom: {}, hidden: [] };

const hass = {
  localize: (k: string) => {
    if (k === "component.ambience.matcher.scene") return "Scene";
    if (k === "component.ambience.matcher.time_of_day") return "Time of day";
    if (k === "component.ambience.action.set_light") return "Set light";
    return undefined;
  },
  entities: {
    "light.lamp_a": { entity_id: "light.lamp_a", area_id: "living_room" },
    "light.lamp_b": { entity_id: "light.lamp_b", area_id: "living_room" },
  },
} as any;

async function mount(
  rule: Rule | null,
  opts: { scope?: Scope; hass?: any } = {},
): Promise<any> {
  const el: any = document.createElement("ambience-rule-editor");
  el.matchers = matchers;
  el.availableActions = availableActions;
  el.periods = periods;
  el.hass = opts.hass ?? hass;
  el.scope = opts.scope ?? { kind: "area", id: "living_room" };
  el.rule = rule;
  el.open = true;
  document.body.appendChild(el);
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  return el;
}

describe("ambience-rule-editor — collapse + friendly labels", () => {
  let el: any;
  afterEach(() => { el?.remove(); });

  test("matcher rows render as collapsed summaries by default", async () => {
    // Seed both matchers in `when` so both are rendered as rows (toggleable
    // matchers without a value are now hidden behind the add-condition dropdown).
    el = await mount({
      name: "test",
      when: { scene: "movie", time_of_day: { period: "afternoon" } },
      actions: [],
    });
    const rows = el.shadowRoot.querySelectorAll(".slot.collapsed");
    expect(rows.length).toBe(3);  // name + scene + time_of_day
  });

  test("clicking a collapsed matcher summary expands it", async () => {
    el = await mount({ name: "test", when: { scene: "movie" }, actions: [] });
    const sceneRow = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    sceneRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Re-query: Lit replaces the collapsed element with a new expanded element
    const expanded = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    expect(expanded.classList.contains("expanded")).toBe(true);
  });

  test("opening a second matcher collapses the first", async () => {
    el = await mount({
      name: "test",
      when: { scene: "movie", time_of_day: { period: "afternoon" } },  // seed so both rows exist
      actions: [],
    });
    const scene = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    scene.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Re-query tod after scene expansion (Lit replaces the scene element, tod may shift)
    const tod = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    tod.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Re-query both after renders settle
    const sceneAfter = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    const todAfter = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    expect(sceneAfter.classList.contains("collapsed")).toBe(true);
    expect(todAfter.classList.contains("expanded")).toBe(true);
  });

  test("clicking an already-expanded summary collapses it", async () => {
    // Use time_of_day (non-combobox) for this test: it keeps its .summary when expanded
    // so the second click can target it. Scene (combobox) drops chrome when expanded.
    // Seed time_of_day in `when` so the row is rendered (toggleable matchers
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
    const todExpanded = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    todExpanded.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    const todCollapsed = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    expect(todCollapsed.classList.contains("collapsed")).toBe(true);
  });

  test("matcher row labels use friendly names from i18n", async () => {
    el = await mount({ name: "test", when: { scene: "movie" }, actions: [] });
    const sceneRow = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    expect(sceneRow.textContent).toContain("Scene");
    expect(sceneRow.textContent).toContain("movie");
  });

  test("action rows render as collapsed summaries", async () => {
    el = await mount({
      name: "test", when: {},
      actions: [{ action: "set_light", entity_ids: ["light.lamp_a"], params: { brightness: 80 } }],
    });
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    expect(action.classList.contains("collapsed")).toBe(true);
    expect(action.textContent).toContain("Set light");
  });

  test("adding a new action auto-opens it", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const addBtn = el.shadowRoot.querySelector(".add-action") as HTMLButtonElement;
    addBtn.click();
    await el.updateComplete;
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    expect(action.classList.contains("expanded")).toBe(true);
  });

  test("expanded action editor uses target picker", async () => {
    el = await mount({
      name: "test", when: {},
      actions: [{ action: "set_light", entity_ids: ["light.lamp_a"], params: { brightness: 80 } }],
    });
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(action.querySelector("ambience-target-picker")).toBeTruthy();
  });

  test("expanded action body does not include an action type dropdown", async () => {
    el = await mount({
      name: "test", when: {},
      actions: [{ action: "set_light", entity_ids: ["light.lamp_a"], params: { brightness: 80 } }],
    });
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(action.querySelector("select.action-type")).toBeNull();
  });

  test("emits save-rule with the draft", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    let saved: Rule | undefined;
    el.addEventListener("save-rule", (e: CustomEvent) => { saved = e.detail; });
    const saveBtn = Array.from(el.shadowRoot.querySelectorAll("button.primary")).find(
      (b: any) => b.textContent.trim() === "Save rule"
    ) as HTMLButtonElement;
    saveBtn.click();
    expect(saved?.name).toBe("test");
  });

  test("emits cancel-rule", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    let cancelled = false;
    el.addEventListener("cancel-rule", () => { cancelled = true; });
    const cancelBtn = Array.from(el.shadowRoot.querySelectorAll("button.secondary")).find(
      (b: any) => b.textContent.trim() === "Cancel"
    ) as HTMLButtonElement;
    cancelBtn.click();
    expect(cancelled).toBe(true);
  });

  test("deleting an action removes it from the draft", async () => {
    el = await mount({
      name: "test", when: {},
      actions: [
        { action: "set_light", entity_ids: ["light.lamp_a"], params: { brightness: 80 } },
        { action: "set_light", entity_ids: ["light.lamp_b"], params: { brightness: 40 } },
      ],
    });
    const action0 = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    const removeBtn = action0.querySelector(".summary .remove") as HTMLButtonElement;
    removeBtn.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll(".slot[data-slot-id^='action-']").length).toBe(1);
  });

  test("updating an int param (brightness) via input fires _updateActionParam", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    // Add an action and open it
    el.shadowRoot.querySelector(".add-action")!.dispatchEvent(new MouseEvent("click"));
    await el.updateComplete;
    // The action slot is now expanded; find the brightness input
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    const inputs = action.querySelectorAll('input[type="number"]');
    const brightnessInput = inputs[0] as HTMLInputElement;
    brightnessInput.value = "75";
    brightnessInput.dispatchEvent(new InputEvent("input", { bubbles: true }));
    await el.updateComplete;
    // Save and check the draft value
    let saved: any;
    el.addEventListener("save-rule", (e: CustomEvent) => { saved = e.detail; });
    el.shadowRoot.querySelector("button.primary")!.dispatchEvent(new MouseEvent("click"));
    expect(saved?.actions[0]?.params?.brightness).toBe(75);
  });

  test("clearing a number param (transition) via input removes it from params", async () => {
    el = await mount({
      name: "test", when: {},
      actions: [{ action: "set_light", entity_ids: [], params: { brightness: 50, transition: 2 } }],
    });
    const action0 = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action0.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;

    const inputs = action0.querySelectorAll('input[type="number"]');
    // transition is the second input
    const transitionInput = inputs[1] as HTMLInputElement;
    transitionInput.value = "";
    transitionInput.dispatchEvent(new InputEvent("input", { bubbles: true }));
    await el.updateComplete;

    let saved: any;
    el.addEventListener("save-rule", (e: CustomEvent) => { saved = e.detail; });
    el.shadowRoot.querySelector("button.primary")!.dispatchEvent(new MouseEvent("click"));
    expect(saved?.actions[0]?.params?.transition).toBeUndefined();
  });

  test("rule-editor passes floor-scope entities to the target picker", async () => {
    // Floor "upstairs" contains the bedroom area; "downstairs" contains kitchen.
    // light.up_a lives in bedroom → should be in scope.
    // light.down_a lives in kitchen → should NOT be in scope.
    const floorHass: any = {
      localize: hass.localize,
      entities: {
        "light.up_a": { entity_id: "light.up_a", area_id: "bedroom" },
        "light.down_a": { entity_id: "light.down_a", area_id: "kitchen" },
      },
      devices: {},
      areas: {
        bedroom: { area_id: "bedroom", floor_id: "upstairs" },
        kitchen: { area_id: "kitchen", floor_id: "downstairs" },
      },
    };
    el = await mount(
      {
        name: "test",
        when: {},
        actions: [{ action: "set_light", entity_ids: [], params: { brightness: 50 } }],
      },
      { scope: { kind: "floor", id: "upstairs" }, hass: floorHass },
    );
    // Open the action slot so the target picker is rendered.
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    const picker = action.querySelector("ambience-target-picker") as any;
    expect(picker).toBeTruthy();
    expect(picker.entities).toContain("light.up_a");
    expect(picker.entities).not.toContain("light.down_a");
  });

  test("target-picker value-changed updates action entity_ids", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    el.shadowRoot.querySelector(".add-action")!.dispatchEvent(new MouseEvent("click"));
    await el.updateComplete;

    const picker = el.shadowRoot.querySelector("ambience-target-picker")!;
    picker.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: ["light.lamp_a", "light.lamp_b"] },
      bubbles: true,
      composed: true,
    }));
    await el.updateComplete;

    let saved: any;
    el.addEventListener("save-rule", (e: CustomEvent) => { saved = e.detail; });
    el.shadowRoot.querySelector("button.primary")!.dispatchEvent(new MouseEvent("click"));
    expect(saved?.actions[0]?.entity_ids).toEqual(["light.lamp_a", "light.lamp_b"]);
  });

  test("deleting the open action clears _open state", async () => {
    el = await mount({
      name: "test", when: {},
      actions: [{ action: "set_light", entity_ids: [], params: { brightness: 50 } }],
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
    const expandedNameRow = el.shadowRoot.querySelector('.slot[data-slot-id="name"]') as HTMLElement;
    const nameInput = expandedNameRow.querySelector('input[type="text"]') as HTMLInputElement;
    nameInput.value = "renamed";
    nameInput.dispatchEvent(new InputEvent("input", { bubbles: true }));
    await el.updateComplete;

    let saved: any;
    el.addEventListener("save-rule", (e: CustomEvent) => { saved = e.detail; });
    el.shadowRoot.querySelector("button.primary")!.dispatchEvent(new MouseEvent("click"));
    expect(saved?.name).toBe("renamed");
  });

  test("name slot renders as collapsed summary with current name", async () => {
    el = await mount({ name: "My Rule", when: {}, actions: [] });
    const nameRow = el.shadowRoot.querySelector('.slot[data-slot-id="name"]') as HTMLElement;
    expect(nameRow.classList.contains("collapsed")).toBe(true);
    expect(nameRow.textContent).toContain("My Rule");
  });

  test("name slot summary shows 'New rule' when name is empty", async () => {
    el = await mount({ name: "", when: {}, actions: [] });
    const nameRow = el.shadowRoot.querySelector('.slot[data-slot-id="name"]') as HTMLElement;
    expect(nameRow.textContent).toContain("New rule");
  });

  test("name slot ignores scene — shows 'New rule' when rule name is empty", async () => {
    el = await mount({ name: "", when: { scene: "Cozy evening" }, actions: [] });
    const nameRow = el.shadowRoot.querySelector('.slot[data-slot-id="name"]') as HTMLElement;
    expect(nameRow.textContent).toContain("New rule");
  });

  test("name slot prefers explicit name over scene", async () => {
    el = await mount({ name: "My rule", when: { scene: "Cozy evening" }, actions: [] });
    const nameRow = el.shadowRoot.querySelector('.slot[data-slot-id="name"]') as HTMLElement;
    expect(nameRow.textContent).toContain("My rule");
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

  test("opening name slot collapses an open matcher row", async () => {
    el = await mount({ name: "test", when: { scene: "movie" }, actions: [] });
    const scene = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    scene.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Re-query: Lit replaces the collapsed element with a new expanded (chrome-free) element
    const sceneExpanded = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    expect(sceneExpanded.classList.contains("expanded")).toBe(true);
    const nameRow = el.shadowRoot.querySelector('.slot[data-slot-id="name"]') as HTMLElement;
    nameRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Re-query: Lit replaces the expanded scene element with a new collapsed element
    const sceneCollapsed = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    expect(sceneCollapsed.classList.contains("collapsed")).toBe(true);
    // Re-query: Lit replaces the collapsed element with a new expanded element
    const expandedNameRow = el.shadowRoot.querySelector('.slot[data-slot-id="name"]') as HTMLElement;
    expect(expandedNameRow.classList.contains("expanded")).toBe(true);
  });

  test("matcher input value-changed event calls _setPredicate", async () => {
    el = await mount({ name: "test", when: { scene: "movie" }, actions: [] });
    // Expand the scene matcher
    const sceneRow = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    sceneRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;

    // Re-query: Lit replaces the collapsed element with a new expanded (chrome-free) element
    const expandedScene = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    // Fire value-changed from ambience-matcher-input (directly inside the slot, no .body wrapper)
    const matcherInput = expandedScene.querySelector("ambience-matcher-input")!;
    matcherInput.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: "relaxed" },
      bubbles: true,
      composed: true,
    }));
    await el.updateComplete;

    let saved: any;
    el.addEventListener("save-rule", (e: CustomEvent) => { saved = e.detail; });
    el.shadowRoot.querySelector("button.primary")!.dispatchEvent(new MouseEvent("click"));
    expect(saved?.when?.scene).toBe("relaxed");
  });

  test("brightness input is clamped to [0, 100] on entry above max", async () => {
    el = await mount({
      name: "test", when: {},
      actions: [{ action: "set_light", entity_ids: ["light.lamp_a"], params: { brightness: 50 } }],
    });
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    const inputs = action.querySelectorAll('input[type="number"]');
    const brightness = inputs[0] as HTMLInputElement;
    brightness.value = "150";
    brightness.dispatchEvent(new Event("input"));
    await el.updateComplete;
    let saved: any;
    el.addEventListener("save-rule", (e: CustomEvent) => { saved = e.detail; });
    (Array.from(el.shadowRoot.querySelectorAll("button.primary")) as HTMLButtonElement[])
      .find((b) => b.textContent?.trim() === "Save rule")!
      .click();
    expect(saved.actions[0].params.brightness).toBe(100);
  });

  test("brightness input is clamped to [0, 100] on entry below min", async () => {
    el = await mount({
      name: "test", when: {},
      actions: [{ action: "set_light", entity_ids: ["light.lamp_a"], params: { brightness: 50 } }],
    });
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    const brightness = action.querySelector('input[type="number"]') as HTMLInputElement;
    brightness.value = "-50";
    brightness.dispatchEvent(new Event("input"));
    await el.updateComplete;
    let saved: any;
    el.addEventListener("save-rule", (e: CustomEvent) => { saved = e.detail; });
    (Array.from(el.shadowRoot.querySelectorAll("button.primary")) as HTMLButtonElement[])
      .find((b) => b.textContent?.trim() === "Save rule")!
      .click();
    expect(saved.actions[0].params.brightness).toBe(0);
  });

  test("param labels use friendly title-case form", async () => {
    el = await mount({
      name: "test", when: {},
      actions: [{ action: "set_light", entity_ids: ["light.lamp_a"], params: { brightness: 80 } }],
    });
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    const labels = Array.from(action.querySelectorAll("label")).map((l) => l.textContent?.trim());
    expect(labels).toContain("Brightness *");  // required: true → asterisk
    expect(labels).toContain("Transition");    // not required → no asterisk
  });

  test("param placeholders use description from backend", async () => {
    el = await mount({
      name: "test", when: {},
      actions: [{ action: "set_light", entity_ids: ["light.lamp_a"], params: { brightness: 80 } }],
    });
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    const inputs = Array.from(action.querySelectorAll('input[type="number"]')) as HTMLInputElement[];
    expect(inputs[0].placeholder).toBe("Percentage brightness, 0 for off");
    expect(inputs[1].placeholder).toBe("Seconds");
  });

  test("clicking outside an open slot collapses it when valid", async () => {
    el = await mount({ name: "test", when: { scene: "movie" }, actions: [] });
    const sceneRow = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    // Open scene slot
    sceneRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Re-query: Lit replaces the collapsed element with a new expanded (chrome-free) element
    const expandedScene = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    expect(expandedScene.classList.contains("expanded")).toBe(true);
    // Click on a non-slot region inside the modal (h3 header)
    const h3 = el.shadowRoot.querySelector("h3") as HTMLElement;
    h3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Re-query: Lit replaces the expanded element with a new collapsed element
    const collapsedScene = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    expect(collapsedScene.classList.contains("collapsed")).toBe(true);
  });

  test("clicking outside an action slot with no targets keeps it open and shows an error", async () => {
    el = await mount({
      name: "test", when: {},
      actions: [{ action: "set_light", entity_ids: [], params: { brightness: 80 } }],
    });
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    // Open action slot
    action.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(action.classList.contains("expanded")).toBe(true);
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
      name: "test", when: { scene: "movie" },
      actions: [{ action: "set_light", entity_ids: [], params: { brightness: 80 } }],
    });
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    const scene = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    scene.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(action.classList.contains("expanded")).toBe(true);
    expect(scene.classList.contains("collapsed")).toBe(true);
  });

  test("expanded name slot renders just the input — no summary header, no duplicate label", async () => {
    el = await mount({ name: "My rule", when: {}, actions: [] });
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

  test("expanded scene slot renders just the matcher-input — no summary header", async () => {
    el = await mount({ name: "test", when: { scene: "movie" }, actions: [] });
    const sceneRow = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    // Click to expand
    sceneRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Re-query because the expanded element is a fresh template
    const expanded = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    // No .summary child
    expect(expanded.querySelector(".summary")).toBeNull();
    // No .body wrapper either
    expect(expanded.querySelector(".body")).toBeNull();
    // But the matcher-input is rendered
    expect(expanded.querySelector("ambience-matcher-input")).toBeTruthy();
  });

  test("time-of-day slot keeps the summary header when expanded", async () => {
    el = await mount({ name: "test", when: { time_of_day: { period: "afternoon" } }, actions: [] });
    const todRow = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    todRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    const expanded = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    // Summary stays — user said they like it there
    expect(expanded.querySelector(".summary")).toBeTruthy();
    expect(expanded.querySelector(".body")).toBeTruthy();
  });

  test("clicking inside a nested shadow element (Time/Sun kind dropdown) does not collapse the slot", async () => {
    el = await mount({
      name: "test",
      when: { time_of_day: { from: { kind: "time", hh: 9, mm: 0 }, to: { kind: "time", hh: 17, mm: 0 } } },
      actions: [],
    });
    const todRow = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    todRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    // Allow nested custom elements to render
    await new Promise(r => setTimeout(r, 0));
    await el.updateComplete;
    // Re-query after expansion
    const todExpanded = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    expect(todExpanded.classList.contains("expanded")).toBe(true);
    // Simulate a click event on a nested element (ambience-matcher-input inside the slot).
    // Dispatching on the matcher-input host with composed: true mimics a real click that
    // crosses shadow boundaries — composedPath() will include the .slot ancestor.
    const matcherInput = todExpanded.querySelector("ambience-matcher-input") as HTMLElement;
    matcherInput.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await el.updateComplete;
    // Slot stays expanded
    const after = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    expect(after.classList.contains("expanded")).toBe(true);
  });

  test("param unit suffix renders when ParamSpec has unit", async () => {
    el = await mount({
      name: "test", when: {},
      actions: [{ action: "set_light", entity_ids: ["light.lamp_a"], params: { brightness: 80 } }],
    });
    const action = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    const units = Array.from(action.querySelectorAll(".param-unit")).map(e => e.textContent?.trim());
    expect(units).toContain("%");
    expect(units).toContain("s");
  });

  test("re-passing the rule prop while the editor is open does NOT clobber the in-progress draft", async () => {
    // Regression: when HA fires area_registry_updated (e.g. an unrelated
    // device was added), the parent refetches all area configs, which
    // produces fresh rule objects. The editor used to deep-clone any new
    // `rule` reference, wiping the user's unsaved edits. The fix: only
    // initialize the draft when the editor *opens*; ignore prop changes
    // while open.
    el = await mount({ name: "original", when: {}, actions: [] });
    // User types a new name into the draft (we just set it via the
    // public setter so we don't depend on input wiring here).
    el._setName("user-edited name");
    await el.updateComplete;

    // Simulate the upstream refetch: a fresh Rule object with the same
    // *original* contents (as it would be after a no-op refresh).
    el.rule = { name: "original", when: {}, actions: [] };
    await el.updateComplete;

    // The user's edit must still be in the draft.
    expect((el as any)._draft.name).toBe("user-edited name");

    // Sanity: saving should emit the edited name, not the refetched one.
    let saved: Rule | undefined;
    el.addEventListener("save-rule", (e: CustomEvent) => { saved = e.detail; });
    const saveBtn = Array.from(el.shadowRoot.querySelectorAll("button.primary")).find(
      (b: any) => b.textContent.trim() === "Save rule"
    ) as HTMLButtonElement;
    saveBtn.click();
    expect(saved?.name).toBe("user-edited name");
  });

  test("re-opening the editor on a different rule re-initializes the draft", async () => {
    // The flip side of the previous test: closing and re-opening on a new
    // rule should pick up the new rule.
    el = await mount({ name: "first", when: {}, actions: [] });
    el._setName("first-edited");
    await el.updateComplete;
    expect((el as any)._draft.name).toBe("first-edited");

    // Close, then re-open with a different rule.
    el.open = false;
    await el.updateComplete;
    el.rule = { name: "second", when: {}, actions: [] };
    el.open = true;
    await el.updateComplete;

    expect((el as any)._draft.name).toBe("second");
  });
});

describe("ambience-rule-editor — script-action support", () => {
  let el: any;
  afterEach(() => { el?.remove(); });

  test("renders an action-type picker exposing both standard and script kinds", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const picker = el.shadowRoot.querySelector(".action-type-picker") as HTMLElement;
    expect(picker).toBeTruthy();
    const select = picker.querySelector("select") as HTMLSelectElement;
    const values = Array.from(select.querySelectorAll("option")).map((o: any) => o.value);
    expect(values).toContain("set_light");
    expect(values).toContain("script");
  });

  test("selecting 'script' in the action-type picker and clicking + Add creates a script slot", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const picker = el.shadowRoot.querySelector(".action-type-picker") as HTMLElement;
    const select = picker.querySelector("select") as HTMLSelectElement;
    select.value = "script";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    const addBtn = el.shadowRoot.querySelector(".add-action") as HTMLButtonElement;
    addBtn.click();
    await el.updateComplete;
    // _draft.actions[0].action should be "script"
    expect(el._draft.actions[0].action).toBe("script");
  });

  test("a script-kind slot renders <ambience-script-action-slot> and NOT the legacy target picker", async () => {
    el = await mount({
      name: "test", when: {},
      actions: [{ action: "script", script: "script.foo", entity_ids: [], params: {} }],
    });
    const slot = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    slot.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(slot.querySelector("ambience-script-action-slot")).toBeTruthy();
    // Legacy direct target picker must not render — it's owned by the script slot now.
    expect(slot.querySelector(":scope > .body > ambience-target-picker")).toBeNull();
  });

  test("a standard slot still renders the legacy target picker", async () => {
    el = await mount({
      name: "test", when: {},
      actions: [{ action: "set_light", entity_ids: ["light.lamp_a"], params: { brightness: 50 } }],
    });
    const slot = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    slot.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(slot.querySelector("ambience-target-picker")).toBeTruthy();
    expect(slot.querySelector("ambience-script-action-slot")).toBeNull();
  });

  test("script-changed event from the slot updates the draft's script field and resets entity_ids/params", async () => {
    el = await mount({
      name: "test", when: {},
      actions: [{ action: "script", entity_ids: ["light.lamp_a"], params: { brightness: 50 } }],
    });
    const slot = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    slot.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    const scriptSlot = slot.querySelector("ambience-script-action-slot")!;
    scriptSlot.dispatchEvent(new CustomEvent("script-changed", {
      detail: { script: "script.bar" }, bubbles: true, composed: true,
    }));
    await el.updateComplete;
    expect(el._draft.actions[0].script).toBe("script.bar");
    expect(el._draft.actions[0].entity_ids).toEqual([]);
    expect(el._draft.actions[0].params).toEqual({});
  });

  test("entity-ids-changed from the script slot updates the draft", async () => {
    el = await mount({
      name: "test", when: {},
      actions: [{ action: "script", script: "script.foo", entity_ids: [], params: {} }],
    });
    const slot = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    slot.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    const scriptSlot = slot.querySelector("ambience-script-action-slot")!;
    scriptSlot.dispatchEvent(new CustomEvent("entity-ids-changed", {
      detail: { entityIds: ["light.lamp_a", "light.lamp_b"] }, bubbles: true, composed: true,
    }));
    await el.updateComplete;
    expect(el._draft.actions[0].entity_ids).toEqual(["light.lamp_a", "light.lamp_b"]);
  });

  test("params-changed from the script slot updates the draft", async () => {
    el = await mount({
      name: "test", when: {},
      actions: [{ action: "script", script: "script.foo", entity_ids: [], params: {} }],
    });
    const slot = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    slot.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    const scriptSlot = slot.querySelector("ambience-script-action-slot")!;
    scriptSlot.dispatchEvent(new CustomEvent("params-changed", {
      detail: { params: { brightness: 75 } }, bubbles: true, composed: true,
    }));
    await el.updateComplete;
    expect(el._draft.actions[0].params).toEqual({ brightness: 75 });
  });

  test("_validationError reports an error for a script slot with no script chosen", async () => {
    el = await mount({
      name: "test", when: {},
      actions: [{ action: "script", entity_ids: [], params: {} }],
    });
    expect(el._validationError({ kind: "action", idx: 0 })).toBeTruthy();
  });

  test("_validationError accepts a script slot with `script` set even when entity_ids is empty", async () => {
    el = await mount({
      name: "test", when: {},
      actions: [{ action: "script", script: "script.foo", entity_ids: [], params: {} }],
    });
    // hass.services has no script.foo, so missing-metadata branch must accept.
    expect(el._validationError({ kind: "action", idx: 0 })).toBeNull();
  });

  test("_validationError accepts a script slot when all required fields are populated", async () => {
    // Provide script.foo metadata with a required field that IS populated.
    const hass2 = {
      ...hass,
      services: { script: { foo: { fields: { msg: { required: true } } } } },
    };
    const el2: any = document.createElement("ambience-rule-editor");
    el2.matchers = matchers;
    el2.availableActions = availableActions;
    el2.periods = periods;
    el2.hass = hass2;
    el2.scope = { kind: "area", id: "living_room" };
    el2.rule = {
      name: "t", when: {},
      actions: [{ action: "script", script: "script.foo", entity_ids: [], params: { msg: "hi" } }],
    };
    el2.open = true;
    document.body.appendChild(el2);
    await el2.updateComplete;
    expect(el2._validationError({ kind: "action", idx: 0 })).toBeNull();
    el2.remove();
  });

  test("_validationError rejects a script slot whose required field is missing", async () => {
    const hass2 = {
      ...hass,
      services: { script: { foo: { fields: { msg: { required: true } } } } },
    };
    const el2: any = document.createElement("ambience-rule-editor");
    el2.matchers = matchers;
    el2.availableActions = availableActions;
    el2.periods = periods;
    el2.hass = hass2;
    el2.scope = { kind: "area", id: "living_room" };
    el2.rule = {
      name: "t", when: {},
      actions: [{ action: "script", script: "script.foo", entity_ids: [], params: {} }],
    };
    el2.open = true;
    document.body.appendChild(el2);
    await el2.updateComplete;
    expect(el2._validationError({ kind: "action", idx: 0 })).toBeTruthy();
    el2.remove();
  });
});

describe("ambience-rule-editor — matcher dropdown + full-height layout", () => {
  let el: any;
  afterEach(() => { el?.remove(); });

  test("does not render a row for a toggleable matcher that is not used in the rule", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    // scene is toggleable and not in `when` → no row
    expect(el.shadowRoot.querySelector('.slot[data-slot-id="scene"]')).toBeNull();
    // time_of_day is toggleable and not in `when` → no row
    expect(el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]')).toBeNull();
  });

  test("renders a row for a toggleable matcher that IS used in the rule", async () => {
    el = await mount({ name: "test", when: { time_of_day: { period: "afternoon" } }, actions: [] });
    expect(el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]')).toBeTruthy();
  });

  test("renders an add-matcher dropdown listing unused toggleable matchers", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const select = el.shadowRoot.querySelector("select.add-matcher") as HTMLSelectElement;
    expect(select).toBeTruthy();
    const values = Array.from(select.querySelectorAll("option")).map((o: any) => o.value);
    expect(values).toContain("time_of_day");
    // scene is now toggleable → also in the dropdown when not used
    expect(values).toContain("scene");
  });

  test("the add-matcher dropdown excludes matchers that are already used", async () => {
    el = await mount({ name: "test", when: { time_of_day: { period: "afternoon" } }, actions: [] });
    const select = el.shadowRoot.querySelector("select.add-matcher") as HTMLSelectElement | null;
    if (select) {
      const values = Array.from(select.querySelectorAll("option")).map((o: any) => o.value);
      expect(values).not.toContain("time_of_day");
    }
    // Either no dropdown (all used) or dropdown without time_of_day — both acceptable.
  });

  test("selecting a matcher from the dropdown adds it as an open row", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const select = el.shadowRoot.querySelector("select.add-matcher") as HTMLSelectElement;
    select.value = "time_of_day";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    const tod = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    expect(tod).toBeTruthy();
    expect(tod.classList.contains("expanded")).toBe(true);
  });

  test("clicking on the dropdown does NOT collapse the just-added matcher slot", async () => {
    // Regression: in the real browser, picking a <select> option fires a
    // `change` followed by a `click` that bubbles to .modal. _onModalClick
    // would then call _tryCloseCurrent() and close the slot we just opened.
    el = await mount({ name: "test", when: {}, actions: [] });
    const select = el.shadowRoot.querySelector("select.add-matcher") as HTMLSelectElement;
    select.value = "time_of_day";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    // Simulate the trailing click that comes from selecting an option.
    select.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await el.updateComplete;
    const tod = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    expect(tod).toBeTruthy();
    expect(tod.classList.contains("expanded")).toBe(true);
  });

  test("after adding a matcher via the dropdown, it disappears from the dropdown options", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const select = el.shadowRoot.querySelector("select.add-matcher") as HTMLSelectElement;
    select.value = "time_of_day";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    const select2 = el.shadowRoot.querySelector("select.add-matcher") as HTMLSelectElement | null;
    if (select2) {
      const values = Array.from(select2.querySelectorAll("option")).map((o: any) => o.value);
      expect(values).not.toContain("time_of_day");
    }
  });

  test("toggleable matcher row has a remove button that drops it from the rule", async () => {
    el = await mount({ name: "test", when: { time_of_day: { period: "afternoon" } }, actions: [] });
    const tod = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    const remove = tod.querySelector(".remove") as HTMLButtonElement;
    expect(remove).toBeTruthy();
    remove.click();
    await el.updateComplete;
    // Row is gone …
    expect(el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]')).toBeNull();
    // … and it reappears as an unused option in the dropdown.
    const select = el.shadowRoot.querySelector("select.add-matcher") as HTMLSelectElement;
    const values = Array.from(select.querySelectorAll("option")).map((o: any) => o.value);
    expect(values).toContain("time_of_day");
  });

  test("removing a matcher also clears its predicate from the saved rule", async () => {
    el = await mount({ name: "test", when: { time_of_day: { period: "afternoon" } }, actions: [] });
    const tod = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    (tod.querySelector(".remove") as HTMLButtonElement).click();
    await el.updateComplete;
    let saved: any;
    el.addEventListener("save-rule", (e: CustomEvent) => { saved = e.detail; });
    (Array.from(el.shadowRoot.querySelectorAll("button.primary")) as HTMLButtonElement[])
      .find((b) => b.textContent?.trim() === "Save rule")!
      .click();
    expect("time_of_day" in saved.when).toBe(false);
  });

  test("scene appears in the +Add condition dropdown when not used in the rule", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const select = el.shadowRoot.querySelector("select.add-matcher") as HTMLSelectElement;
    const values = Array.from(select.querySelectorAll("option")).map((o: any) => o.value);
    expect(values).toContain("scene");   // scene is now toggleable like the others
    expect(values).toContain("time_of_day");
  });

  test("scene row has a remove button now that it's toggleable", async () => {
    el = await mount({ name: "test", when: { scene: "movie" }, actions: [] });
    const scene = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    // The matcher row keeps its summary chrome when toggleable (.summary is dropped
    // only in the expanded-combobox special case).
    expect(scene.querySelector(".remove")).toBeTruthy();
  });

  test("a matcher with a null (any) predicate is hidden — appears in the dropdown instead of as a row", async () => {
    // Stored `when: { time_of_day: null }` should render exactly like an absent key.
    el = await mount({ name: "test", when: { time_of_day: null }, actions: [] });
    expect(el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]')).toBeNull();
    const select = el.shadowRoot.querySelector("select.add-matcher") as HTMLSelectElement;
    const values = Array.from(select.querySelectorAll("option")).map((o: any) => o.value);
    expect(values).toContain("time_of_day");
  });

  test("save strips null predicates from `when`", async () => {
    el = await mount({ name: "test", when: { time_of_day: null, scene: "movie" }, actions: [] });
    let saved: any;
    el.addEventListener("save-rule", (e: CustomEvent) => { saved = e.detail; });
    const saveBtn = Array.from(el.shadowRoot.querySelectorAll("button.primary")).find(
      (b: any) => b.textContent.trim() === "Save rule"
    ) as HTMLButtonElement;
    saveBtn.click();
    expect("time_of_day" in saved.when).toBe(false);
    expect(saved.when.scene).toBe("movie");
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
