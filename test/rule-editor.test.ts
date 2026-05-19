import { describe, test, expect, afterEach } from "vitest";
import "../frontend/src/views/rule-editor";
import type { ActionInfo, MatcherInfo, Rule } from "../frontend/src/types";

const matchers: MatcherInfo[] = [
  { name: "scene", description: "", predicate_help: "", toggleable: false, input: "scene_combobox", priority: 0 },
  { name: "time_of_day", description: "", predicate_help: "", toggleable: true, input: "time_of_day", priority: 100 },
];

const availableActions: ActionInfo[] = [
  {
    name: "set_light",
    description: "",
    domains: ["light"],
    target_params: [
      { name: "brightness", type: "int", required: true, min: 0, max: 100, unit: "%", description: "Percentage brightness, 0 for off" },
      { name: "transition", type: "number", required: false, min: 0, unit: "s", description: "Seconds" },
    ],
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

async function mount(rule: Rule | null, opts: { areaId?: string } = {}): Promise<any> {
  const el: any = document.createElement("ambience-rule-editor");
  el.matchers = matchers;
  el.availableActions = availableActions;
  el.periods = periods;
  el.hass = hass;
  el.areaId = opts.areaId ?? "living_room";
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
    el = await mount({ name: "test", when: { scene: "movie" }, actions: [] });
    const rows = el.shadowRoot.querySelectorAll(".slot.collapsed");
    expect(rows.length).toBe(3);  // name + scene + time_of_day
  });

  test("clicking a collapsed matcher summary expands it", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const sceneRow = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    sceneRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(sceneRow.classList.contains("expanded")).toBe(true);
  });

  test("opening a second matcher collapses the first", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const scene = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    const tod = el.shadowRoot.querySelector('.slot[data-slot-id="time_of_day"]') as HTMLElement;
    scene.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    tod.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(scene.classList.contains("collapsed")).toBe(true);
    expect(tod.classList.contains("expanded")).toBe(true);
  });

  test("clicking an already-expanded summary collapses it", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const scene = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    scene.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    scene.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(scene.classList.contains("collapsed")).toBe(true);
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

  test("action dropdown uses friendly names", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    const addBtn = el.shadowRoot.querySelector(".add-action") as HTMLButtonElement;
    addBtn.click();
    await el.updateComplete;
    const select = el.shadowRoot.querySelector("select.action-type") as HTMLSelectElement;
    const opt = select.querySelector('option[value="set_light"]') as HTMLOptionElement;
    expect(opt.textContent?.trim()).toBe("Set light");
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

  test("changing action type dropdown calls _changeActionType", async () => {
    const twoActions: ActionInfo[] = [
      {
        name: "set_light",
        description: "",
        domains: ["light"],
        target_params: [{ name: "brightness", type: "int", required: true, default: 50 }],
      },
      {
        name: "set_light_alt",
        description: "",
        domains: ["light"],
        target_params: [],
      },
    ];
    el = document.createElement("ambience-rule-editor") as any;
    el.matchers = matchers;
    el.availableActions = twoActions;
    el.periods = periods;
    el.hass = hass;
    el.areaId = "living_room";
    el.rule = { name: "test", when: {}, actions: [{ action: "set_light", entity_ids: [], params: {} }] };
    el.open = true;
    document.body.appendChild(el);
    await el.updateComplete;

    // Open the action
    const action0 = el.shadowRoot.querySelector('.slot[data-slot-id="action-0"]') as HTMLElement;
    action0.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;

    // Change the action type dropdown
    const select = action0.querySelector("select.action-type") as HTMLSelectElement;
    select.value = "set_light_alt";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;

    let saved: any;
    el.addEventListener("save-rule", (e: CustomEvent) => { saved = e.detail; });
    el.shadowRoot.querySelector("button.primary")!.dispatchEvent(new MouseEvent("click"));
    expect(saved?.actions[0]?.action).toBe("set_light_alt");
  });

  test("typing in name input updates the draft name", async () => {
    el = await mount({ name: "original", when: {}, actions: [] });
    // Open the name slot first
    const nameRow = el.shadowRoot.querySelector('.slot[data-slot-id="name"]') as HTMLElement;
    nameRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    const nameInput = nameRow.querySelector('input[type="text"]') as HTMLInputElement;
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

  test("clicking name summary expands the input", async () => {
    el = await mount({ name: "", when: {}, actions: [] });
    const nameRow = el.shadowRoot.querySelector('.slot[data-slot-id="name"]') as HTMLElement;
    expect(nameRow.querySelector('input[type="text"]')).toBeNull();
    nameRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(nameRow.querySelector('input[type="text"]')).toBeTruthy();
  });

  test("opening name slot collapses an open matcher row", async () => {
    el = await mount({ name: "test", when: { scene: "movie" }, actions: [] });
    const scene = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    scene.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(scene.classList.contains("expanded")).toBe(true);
    const nameRow = el.shadowRoot.querySelector('.slot[data-slot-id="name"]') as HTMLElement;
    nameRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(scene.classList.contains("collapsed")).toBe(true);
    expect(nameRow.classList.contains("expanded")).toBe(true);
  });

  test("matcher input value-changed event calls _setPredicate", async () => {
    el = await mount({ name: "test", when: {}, actions: [] });
    // Expand the scene matcher
    const sceneRow = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    sceneRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;

    // Fire value-changed from ambience-matcher-input
    const matcherInput = sceneRow.querySelector("ambience-matcher-input")!;
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
    el = await mount({ name: "test", when: {}, actions: [] });
    const sceneRow = el.shadowRoot.querySelector('.slot[data-slot-id="scene"]') as HTMLElement;
    // Open scene slot
    sceneRow.querySelector(".summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(sceneRow.classList.contains("expanded")).toBe(true);
    // Click on a non-slot region inside the modal (h3 header)
    const h3 = el.shadowRoot.querySelector("h3") as HTMLElement;
    h3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(sceneRow.classList.contains("collapsed")).toBe(true);
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
      name: "test", when: {},
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
});
