import { describe, test, expect, afterEach } from "vitest";
import "../frontend/src/views/rule-editor";
import type { Rule, MatcherInfo, ActionInfo, PeriodStoreView } from "../frontend/src/types";

const periods: PeriodStoreView = { builtins: {}, custom: {}, hidden: [] };

const sceneMatcher: MatcherInfo = {
  name: "scene",
  description: "Scene matcher",
  predicate_help: "",
  toggleable: false,
  input: "scene_combobox",
  priority: 0,
};

const setLightAction: ActionInfo = {
  name: "set_light",
  description: "Set light",
  domains: ["light"],
  target_params: [
    { name: "brightness", type: "int", required: false, min: 0, max: 100 },
    { name: "transition", type: "number", required: false },
  ],
};

const baseRule: Rule = {
  name: "Test rule",
  when: { scene: "movie" },
  actions: [],
};

async function mount(opts: {
  rule?: Rule | null;
  matchers?: MatcherInfo[];
  availableActions?: ActionInfo[];
  open?: boolean;
} = {}): Promise<any> {
  const el: any = document.createElement("ambience-rule-editor");
  el.rule = opts.rule !== undefined ? opts.rule : baseRule;
  el.matchers = opts.matchers ?? [sceneMatcher];
  el.availableActions = opts.availableActions ?? [setLightAction];
  el.periods = periods;
  el.sceneSuggestions = [];
  if (opts.open !== undefined) el.open = opts.open;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function captureEvent(el: HTMLElement, name: string) {
  let detail: any;
  el.addEventListener(name, (e: Event) => { detail = (e as CustomEvent).detail; });
  return () => detail;
}

describe("ambience-rule-editor", () => {
  let el: any;
  afterEach(() => { el?.remove(); });

  test("renders nothing when rule is null", async () => {
    el = await mount({ rule: null });
    // Should return empty template when _draft is null
    expect(el.shadowRoot.querySelector(".modal")).toBeFalsy();
  });

  test("renders modal when rule is provided", async () => {
    el = await mount({ open: true });
    expect(el.shadowRoot.querySelector(".modal")).toBeTruthy();
  });

  test("shows rule name in heading", async () => {
    el = await mount({ open: true });
    expect(el.shadowRoot.querySelector("h2")?.textContent).toContain("Test rule");
  });

  test("shows 'New rule' when rule has no name", async () => {
    el = await mount({ rule: { when: {}, actions: [] }, open: true });
    expect(el.shadowRoot.querySelector("h2")?.textContent).toContain("New rule");
  });

  test("emits cancel-rule when Cancel clicked", async () => {
    el = await mount({ open: true });
    let cancelled = false;
    el.addEventListener("cancel-rule", () => { cancelled = true; });

    const buttons = el.shadowRoot.querySelectorAll(".actions-bar button");
    const cancelBtn = [...buttons].find((b: any) => b.textContent.includes("Cancel")) as HTMLButtonElement;
    cancelBtn.click();

    expect(cancelled).toBe(true);
  });

  test("emits save-rule with draft when Save clicked", async () => {
    el = await mount({ open: true });
    const get = captureEvent(el, "save-rule");

    const buttons = el.shadowRoot.querySelectorAll(".actions-bar button");
    const saveBtn = [...buttons].find((b: any) => b.textContent.includes("Save")) as HTMLButtonElement;
    saveBtn.click();

    expect(get()).toBeDefined();
    expect(get().name).toBe("Test rule");
    expect(get().when).toEqual({ scene: "movie" });
  });

  test("Add action button adds an action slot", async () => {
    el = await mount({ open: true });
    const addActionBtn = [...el.shadowRoot.querySelectorAll("button")]
      .find((b: any) => b.textContent.includes("+ Add action")) as HTMLButtonElement;
    addActionBtn.click();
    await el.updateComplete;

    const get = captureEvent(el, "save-rule");
    const saveBtn = [...el.shadowRoot.querySelectorAll(".actions-bar button")]
      .find((b: any) => b.textContent.includes("Save")) as HTMLButtonElement;
    saveBtn.click();
    expect(get().actions.length).toBe(1);
    expect(get().actions[0].action).toBe("set_light");
  });

  test("Remove action button removes the action", async () => {
    el = await mount({ rule: { ...baseRule, actions: [{ action: "set_light", targets: {} }] }, open: true });
    const removeBtn = [...el.shadowRoot.querySelectorAll("button")]
      .find((b: any) => b.textContent.includes("Remove action")) as HTMLButtonElement;
    removeBtn.click();
    await el.updateComplete;

    const get = captureEvent(el, "save-rule");
    const saveBtn = [...el.shadowRoot.querySelectorAll(".actions-bar button")]
      .find((b: any) => b.textContent.includes("Save")) as HTMLButtonElement;
    saveBtn.click();
    expect(get().actions.length).toBe(0);
  });

  test("Add target button adds a target slot to an action", async () => {
    el = await mount({ rule: { ...baseRule, actions: [{ action: "set_light", targets: {} }] }, open: true });
    const addTargetBtn = [...el.shadowRoot.querySelectorAll("button")]
      .find((b: any) => b.textContent.includes("+ Add target")) as HTMLButtonElement;
    addTargetBtn.click();
    await el.updateComplete;

    const get = captureEvent(el, "save-rule");
    const saveBtn = [...el.shadowRoot.querySelectorAll(".actions-bar button")]
      .find((b: any) => b.textContent.includes("Save")) as HTMLButtonElement;
    saveBtn.click();
    expect(Object.keys(get().actions[0].targets).length).toBe(1);
  });

  test("renders 'No targets yet' when action has no targets", async () => {
    el = await mount({ rule: { ...baseRule, actions: [{ action: "set_light", targets: {} }] }, open: true });
    expect(el.shadowRoot.textContent).toContain("No targets yet");
  });

  test("renders matcher inputs for provided matchers", async () => {
    el = await mount({ open: true });
    expect(el.shadowRoot.querySelector("ambience-matcher-input")).toBeTruthy();
  });

  test("draft updates when rule prop changes", async () => {
    el = await mount({ rule: baseRule, open: true });
    el.rule = { name: "New name", when: {}, actions: [] };
    await el.updateComplete;

    const get = captureEvent(el, "save-rule");
    const saveBtn = [...el.shadowRoot.querySelectorAll(".actions-bar button")]
      .find((b: any) => b.textContent.includes("Save")) as HTMLButtonElement;
    saveBtn.click();
    expect(get().name).toBe("New name");
  });

  test("name input updates the draft name", async () => {
    el = await mount({ rule: { when: {}, actions: [] }, open: true });
    // Use the plain fallback input (no ha-input registered in jsdom)
    const nameInput = el.shadowRoot.querySelector("input[type='text']") as HTMLInputElement;
    if (nameInput) {
      nameInput.value = "Updated name";
      nameInput.dispatchEvent(new Event("input", { bubbles: true }));
      await el.updateComplete;

      const get = captureEvent(el, "save-rule");
      const saveBtn = [...el.shadowRoot.querySelectorAll(".actions-bar button")]
        .find((b: any) => b.textContent.includes("Save")) as HTMLButtonElement;
      saveBtn.click();
      expect(get().name).toBe("Updated name");
    }
  });

  test("remove target button removes target from action", async () => {
    const rule: Rule = {
      ...baseRule,
      actions: [{ action: "set_light", targets: { "light.x": { brightness: 50 } } }],
    };
    el = await mount({ rule, open: true });
    const removeBtn = el.shadowRoot.querySelector("button[title='Remove target']") as HTMLButtonElement;
    removeBtn.click();
    await el.updateComplete;

    const get = captureEvent(el, "save-rule");
    const saveBtn = [...el.shadowRoot.querySelectorAll(".actions-bar button")]
      .find((b: any) => b.textContent.includes("Save")) as HTMLButtonElement;
    saveBtn.click();
    expect(Object.keys(get().actions[0].targets).length).toBe(0);
  });

  test("param int input parses integer values", async () => {
    const rule: Rule = {
      ...baseRule,
      actions: [{ action: "set_light", targets: { "light.x": { brightness: 50 } } }],
    };
    el = await mount({ rule, open: true });

    // There should be number inputs for brightness and transition params
    const inputs = el.shadowRoot.querySelectorAll("input[type='number']");
    if (inputs.length > 0) {
      const brightnessInput = inputs[0] as HTMLInputElement;
      brightnessInput.value = "80";
      brightnessInput.dispatchEvent(new InputEvent("input", { bubbles: true }));
      await el.updateComplete;

      const get = captureEvent(el, "save-rule");
      const saveBtn = [...el.shadowRoot.querySelectorAll(".actions-bar button")]
        .find((b: any) => b.textContent.includes("Save")) as HTMLButtonElement;
      saveBtn.click();
      expect(get().actions[0].targets["light.x"].brightness).toBe(80);
    }
  });

  test("param int input with empty value removes the param", async () => {
    const rule: Rule = {
      ...baseRule,
      actions: [{ action: "set_light", targets: { "light.x": { brightness: 50 } } }],
    };
    el = await mount({ rule, open: true });

    const inputs = el.shadowRoot.querySelectorAll("input[type='number']");
    if (inputs.length > 0) {
      const brightnessInput = inputs[0] as HTMLInputElement;
      brightnessInput.value = "";
      brightnessInput.dispatchEvent(new InputEvent("input", { bubbles: true }));
      await el.updateComplete;

      const get = captureEvent(el, "save-rule");
      const saveBtn = [...el.shadowRoot.querySelectorAll(".actions-bar button")]
        .find((b: any) => b.textContent.includes("Save")) as HTMLButtonElement;
      saveBtn.click();
      expect(get().actions[0].targets["light.x"].brightness).toBeUndefined();
    }
  });

  test("entity_id input updates target key", async () => {
    const rule: Rule = {
      ...baseRule,
      actions: [{ action: "set_light", targets: { "light.old": { brightness: 50 } } }],
    };
    el = await mount({ rule, open: true });

    // The entity_id input is a text input in the target row
    const entityInput = [...el.shadowRoot.querySelectorAll("input[type='text']")]
      .find((i: any) => (i as HTMLInputElement).value === "light.old") as HTMLInputElement | undefined;
    if (entityInput) {
      entityInput.value = "light.new";
      entityInput.dispatchEvent(new Event("change", { bubbles: true }));
      await el.updateComplete;

      const get = captureEvent(el, "save-rule");
      const saveBtn = [...el.shadowRoot.querySelectorAll(".actions-bar button")]
        .find((b: any) => b.textContent.includes("Save")) as HTMLButtonElement;
      saveBtn.click();
      expect(get().actions[0].targets["light.new"]).toBeDefined();
      expect(get().actions[0].targets["light.old"]).toBeUndefined();
    }
  });

  test("changing action type via select resets targets", async () => {
    const rule: Rule = {
      ...baseRule,
      actions: [{ action: "set_light", targets: { "light.x": { brightness: 50 } } }],
    };
    el = await mount({
      rule,
      availableActions: [
        setLightAction,
        { name: "other_action", description: "", domains: ["switch"], target_params: [] },
      ],
      open: true,
    });

    const select = el.shadowRoot.querySelector("select") as HTMLSelectElement;
    select.value = "other_action";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;

    const get = captureEvent(el, "save-rule");
    const saveBtn = [...el.shadowRoot.querySelectorAll(".actions-bar button")]
      .find((b: any) => b.textContent.includes("Save")) as HTMLButtonElement;
    saveBtn.click();
    expect(get().actions[0].action).toBe("other_action");
    expect(Object.keys(get().actions[0].targets).length).toBe(0);
  });

  test("matcher-input value-changed updates the draft predicate", async () => {
    el = await mount({ open: true });
    const matcherInput = el.shadowRoot.querySelector("ambience-matcher-input")!;
    matcherInput.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: "relaxed" },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    const get = captureEvent(el, "save-rule");
    const saveBtn = [...el.shadowRoot.querySelectorAll(".actions-bar button")]
      .find((b: any) => b.textContent.includes("Save")) as HTMLButtonElement;
    saveBtn.click();
    expect(get().when.scene).toBe("relaxed");
  });

  test("param number input parses float values", async () => {
    const numberAction: ActionInfo = {
      name: "set_light",
      description: "Set light",
      domains: ["light"],
      target_params: [
        { name: "level", type: "number", required: false },
      ],
    };
    const rule: Rule = {
      ...baseRule,
      actions: [{ action: "set_light", targets: { "light.x": { level: 0.5 } } }],
    };
    el = await mount({ rule, availableActions: [numberAction], open: true });

    const inputs = el.shadowRoot.querySelectorAll("input[type='number']");
    if (inputs.length > 0) {
      const levelInput = inputs[0] as HTMLInputElement;
      levelInput.value = "0.75";
      levelInput.dispatchEvent(new InputEvent("input", { bubbles: true }));
      await el.updateComplete;

      const get = captureEvent(el, "save-rule");
      const saveBtn = [...el.shadowRoot.querySelectorAll(".actions-bar button")]
        .find((b: any) => b.textContent.includes("Save")) as HTMLButtonElement;
      saveBtn.click();
      expect(get().actions[0].targets["light.x"].level).toBe(0.75);
    }
  });

  test("param number input with empty value removes the param", async () => {
    const numberAction: ActionInfo = {
      name: "set_light",
      description: "Set light",
      domains: ["light"],
      target_params: [
        { name: "level", type: "number", required: false },
      ],
    };
    const rule: Rule = {
      ...baseRule,
      actions: [{ action: "set_light", targets: { "light.x": { level: 0.5 } } }],
    };
    el = await mount({ rule, availableActions: [numberAction], open: true });

    const inputs = el.shadowRoot.querySelectorAll("input[type='number']");
    if (inputs.length > 0) {
      const levelInput = inputs[0] as HTMLInputElement;
      levelInput.value = "";
      levelInput.dispatchEvent(new InputEvent("input", { bubbles: true }));
      await el.updateComplete;

      const get = captureEvent(el, "save-rule");
      const saveBtn = [...el.shadowRoot.querySelectorAll(".actions-bar button")]
        .find((b: any) => b.textContent.includes("Save")) as HTMLButtonElement;
      saveBtn.click();
      expect(get().actions[0].targets["light.x"].level).toBeUndefined();
    }
  });

  test("matcher-input null value removes the predicate key", async () => {
    el = await mount({ open: true });
    const matcherInput = el.shadowRoot.querySelector("ambience-matcher-input")!;
    matcherInput.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: null },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    const get = captureEvent(el, "save-rule");
    const saveBtn = [...el.shadowRoot.querySelectorAll(".actions-bar button")]
      .find((b: any) => b.textContent.includes("Save")) as HTMLButtonElement;
    saveBtn.click();
    expect("scene" in get().when).toBe(false);
  });
});
