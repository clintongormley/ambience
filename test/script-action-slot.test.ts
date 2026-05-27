/**
 * Tests for ambience-script-action-slot — the body of an action slot whose
 * `action === "script"`. Renders a script picker, a UI/YAML mode toggle, and
 * either a target picker + fields form (UI mode) or a YAML editor (YAML mode).
 *
 * jsdom doesn't register ha-form or ha-yaml-editor, so these tests exercise
 * the fallback rendering paths.
 */
import { describe, test, expect, afterEach } from "vitest";
import "../frontend/src/views/script-action-slot";

type ScriptService = {
  name?: string;
  description?: string;
  fields?: Record<string, {
    name?: string;
    description?: string;
    required?: boolean;
    default?: unknown;
    selector?: Record<string, unknown>;
  }>;
  target?: { entity?: { domain?: string | string[] } } | undefined;
};

function makeHass(scripts: Record<string, ScriptService> = {}) {
  return {
    localize: () => undefined,
    services: { script: scripts },
    entities: {
      "light.lamp_a": { entity_id: "light.lamp_a", area_id: "living_room" },
      "light.lamp_b": { entity_id: "light.lamp_b", area_id: "living_room" },
      "switch.fan": { entity_id: "switch.fan", area_id: "living_room" },
    },
  } as any;
}

async function mount(opts: {
  hass?: any;
  scope?: { kind: "area"; id: string } | { kind: "floor"; id: string } | { kind: "house" };
  script?: string;
  entityIds?: string[];
  params?: Record<string, unknown>;
} = {}): Promise<any> {
  const el: any = document.createElement("ambience-script-action-slot");
  el.hass = opts.hass ?? makeHass();
  el.scope = opts.scope ?? { kind: "area", id: "living_room" };
  if (opts.script !== undefined) el.script = opts.script;
  el.entityIds = opts.entityIds ?? [];
  el.params = opts.params ?? {};
  document.body.appendChild(el);
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  return el;
}

function captureEvent(el: HTMLElement, name: string) {
  let detail: any;
  el.addEventListener(name, (e: Event) => { detail = (e as CustomEvent).detail; });
  return () => detail;
}

describe("ambience-script-action-slot", () => {
  let el: any;
  afterEach(() => { el?.remove(); });

  test("always renders a script picker even when no script is chosen", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector(".script-picker")).toBeTruthy();
  });

  test("renders mode toggle buttons (UI | YAML)", async () => {
    el = await mount();
    const buttons = Array.from(el.shadowRoot.querySelectorAll(".mode-toggle button"))
      .map((b: any) => b.textContent.trim());
    expect(buttons).toContain("UI");
    expect(buttons).toContain("YAML");
  });

  test("UI mode is the default", async () => {
    el = await mount();
    const uiBtn = Array.from(el.shadowRoot.querySelectorAll(".mode-toggle button"))
      .find((b: any) => b.textContent.trim() === "UI") as HTMLButtonElement;
    expect(uiBtn.classList.contains("active")).toBe(true);
  });

  test("when a script with fields AND target is chosen, both target picker and fields form render", async () => {
    const hass = makeHass({
      foo: {
        target: { entity: { domain: "light" } },
        fields: {
          brightness: { selector: { number: { min: 0, max: 100 } } },
        },
      },
    });
    el = await mount({ hass, script: "script.foo" });
    expect(el.shadowRoot.querySelector(".target-picker")).toBeTruthy();
    expect(el.shadowRoot.querySelector(".fields-form")).toBeTruthy();
  });

  test("when chosen script has no target metadata, target picker is NOT rendered", async () => {
    const hass = makeHass({
      foo: {
        fields: { msg: { selector: { text: {} } } },
      },
    });
    el = await mount({ hass, script: "script.foo" });
    expect(el.shadowRoot.querySelector(".target-picker")).toBeNull();
    expect(el.shadowRoot.querySelector(".fields-form")).toBeTruthy();
  });

  test("when chosen script has no fields and no target, 'no parameters' text shows", async () => {
    const hass = makeHass({
      foo: {},
    });
    el = await mount({ hass, script: "script.foo" });
    expect(el.shadowRoot.textContent).toMatch(/no parameters/i);
  });

  test("when chosen script is not in hass.services, shows 'not found' warning AND preserves YAML data", async () => {
    const hass = makeHass({}); // No script.foo registered
    el = await mount({
      hass,
      script: "script.foo",
      entityIds: ["light.lamp_a"],
      params: { brightness: 75 },
    });
    expect(el.shadowRoot.textContent).toMatch(/not found/i);
    // The YAML editor (textarea fallback) should be present, holding the data
    const textarea = el.shadowRoot.querySelector("textarea") as HTMLTextAreaElement;
    expect(textarea).toBeTruthy();
    // Combined object: { entity_id: [...], ...params }
    expect(textarea.value).toContain("light.lamp_a");
    expect(textarea.value).toContain("75");
  });

  test("changing the script picker emits 'script-changed' with the new id", async () => {
    el = await mount();
    const get = captureEvent(el, "script-changed");
    // Find the script picker fallback input (a <select> or <input>).
    const picker = el.shadowRoot.querySelector(".script-picker") as HTMLElement;
    const input = picker.querySelector("input,select") as HTMLInputElement | HTMLSelectElement;
    input.value = "script.foo";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(get()?.script).toBe("script.foo");
  });

  test("switching to YAML mode shows a YAML editor with combined { entity_id, ...params }", async () => {
    const hass = makeHass({
      foo: { fields: { brightness: { selector: { number: {} } } } },
    });
    el = await mount({
      hass,
      script: "script.foo",
      entityIds: ["light.lamp_a"],
      params: { brightness: 50 },
    });
    // Click YAML button
    const yamlBtn = Array.from(el.shadowRoot.querySelectorAll(".mode-toggle button"))
      .find((b: any) => b.textContent.trim() === "YAML") as HTMLButtonElement;
    yamlBtn.click();
    await el.updateComplete;
    const textarea = el.shadowRoot.querySelector("textarea") as HTMLTextAreaElement;
    expect(textarea).toBeTruthy();
    expect(textarea.value).toContain("light.lamp_a");
    expect(textarea.value).toContain("brightness");
    expect(textarea.value).toContain("50");
  });

  test("editing valid YAML emits BOTH entity-ids-changed and params-changed", async () => {
    const hass = makeHass({
      foo: { fields: { brightness: { selector: { number: {} } } } },
    });
    el = await mount({
      hass,
      script: "script.foo",
      entityIds: ["light.lamp_a"],
      params: { brightness: 50 },
    });
    // Switch to YAML mode
    const yamlBtn = Array.from(el.shadowRoot.querySelectorAll(".mode-toggle button"))
      .find((b: any) => b.textContent.trim() === "YAML") as HTMLButtonElement;
    yamlBtn.click();
    await el.updateComplete;
    const getEntities = captureEvent(el, "entity-ids-changed");
    const getParams = captureEvent(el, "params-changed");
    const textarea = el.shadowRoot.querySelector("textarea") as HTMLTextAreaElement;
    // Replace with new YAML (JSON-style is valid YAML)
    textarea.value = '{"entity_id": ["light.lamp_b"], "brightness": 80}';
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(getEntities()?.entityIds).toEqual(["light.lamp_b"]);
    expect(getParams()?.params).toEqual({ brightness: 80 });
  });

  test("invalid YAML shows an inline error and does NOT emit", async () => {
    const hass = makeHass({
      foo: { fields: { brightness: { selector: { number: {} } } } },
    });
    el = await mount({
      hass,
      script: "script.foo",
      entityIds: [],
      params: {},
    });
    const yamlBtn = Array.from(el.shadowRoot.querySelectorAll(".mode-toggle button"))
      .find((b: any) => b.textContent.trim() === "YAML") as HTMLButtonElement;
    yamlBtn.click();
    await el.updateComplete;
    let emitted = false;
    el.addEventListener("entity-ids-changed", () => { emitted = true; });
    el.addEventListener("params-changed", () => { emitted = true; });
    const textarea = el.shadowRoot.querySelector("textarea") as HTMLTextAreaElement;
    textarea.value = "{this: is: not: valid: yaml: at: all";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(emitted).toBe(false);
    expect(el.shadowRoot.querySelector(".yaml-error")).toBeTruthy();
  });

  test("target-picker in UI mode emits entity-ids-changed on selection", async () => {
    const hass = makeHass({
      foo: {
        target: { entity: { domain: "light" } },
        fields: {},
      },
    });
    el = await mount({ hass, script: "script.foo", entityIds: [] });
    const get = captureEvent(el, "entity-ids-changed");
    const picker = el.shadowRoot.querySelector("ambience-target-picker");
    picker.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: ["light.lamp_a"] },
      bubbles: true,
      composed: true,
    }));
    await el.updateComplete;
    expect(get()?.entityIds).toEqual(["light.lamp_a"]);
  });

  test("target picker is restricted to area entities matching the script's target domain", async () => {
    const hass = makeHass({
      foo: { target: { entity: { domain: "light" } } },
    });
    el = await mount({ hass, script: "script.foo" });
    const picker = el.shadowRoot.querySelector("ambience-target-picker") as any;
    // Both lights but no switch
    expect(picker.entities).toEqual(["light.lamp_a", "light.lamp_b"]);
  });

  test("fields form renders a field per script field and emits params-changed on update", async () => {
    const hass = makeHass({
      foo: {
        fields: {
          msg: { selector: { text: {} } },
        },
      },
    });
    el = await mount({ hass, script: "script.foo" });
    const get = captureEvent(el, "params-changed");
    // Fallback: a text input per field
    const input = el.shadowRoot.querySelector(".fields-form input,.fields-form textarea") as HTMLInputElement;
    expect(input).toBeTruthy();
    input.value = "hello";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(get()?.params).toEqual({ msg: "hello" });
  });

  test("script slot does not wrap the target picker in its own <label>", async () => {
    const hass = makeHass({
      foo: { target: { entity: { domain: "light" } } },
    });
    el = await mount({ hass, script: "script.foo" });
    const wrapper = el.shadowRoot.querySelector(".target-picker") as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.querySelector("label")).toBeNull();
  });

  test("script slot passes a non-empty label down to the target picker", async () => {
    const hass = makeHass({
      foo: { target: { entity: { domain: "light" } } },
    });
    el = await mount({ hass, script: "script.foo" });
    const picker = el.shadowRoot.querySelector("ambience-target-picker") as any;
    expect(picker.label).toBeTruthy();
    expect(picker.label).not.toBe("entity_id");
    expect(picker.label).not.toBe("entity_ids");
  });

  test("ha-yaml-editor receives the combined object as .value (not a JSON string)", async () => {
    class FakeHaYamlEditor extends HTMLElement {
      private _value: unknown;
      set value(v: unknown) { this._value = v; }
      get value() { return this._value; }
    }
    if (!customElements.get("ha-yaml-editor")) {
      customElements.define("ha-yaml-editor", FakeHaYamlEditor);
    }
    const hass = makeHass({
      foo: { fields: { brightness: { selector: { number: {} } } } },
    });
    el = await mount({
      hass,
      script: "script.foo",
      entityIds: ["light.lamp_a"],
      params: { brightness: 50 },
    });
    const yamlBtn = Array.from(el.shadowRoot.querySelectorAll(".mode-toggle button"))
      .find((b: any) => b.textContent.trim() === "YAML") as HTMLButtonElement;
    yamlBtn.click();
    await el.updateComplete;
    const editor = el.shadowRoot.querySelector("ha-yaml-editor") as any;
    expect(editor).toBeTruthy();
    expect(typeof editor.value).toBe("object");
    expect(editor.value).toEqual({
      entity_id: ["light.lamp_a"],
      brightness: 50,
    });
  });
});
