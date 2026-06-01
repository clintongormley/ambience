import { describe, test, expect, afterEach } from "vitest";
import "../frontend/src/views/script-predicate-input";
import type { ScriptPredicate } from "../frontend/src/types";

type HassStub = {
  services?: Record<string, Record<string, { fields?: Record<string, unknown> }>>;
  states?: Record<string, { attributes?: Record<string, unknown> }>;
};

async function mount(value: ScriptPredicate = null, hass: HassStub = {}): Promise<any> {
  const el: any = document.createElement("ambience-script-predicate-input");
  el.value = value;
  el.hass = hass;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("ambience-script-predicate-input — picker", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("renders an empty state when no script picked", async () => {
    el = await mount(null);
    // Picker present but no form yet.
    expect(el.shadowRoot.textContent).toContain("Script");
  });

  test("_pickerSchema lists every script.* service in sorted order", async () => {
    el = await mount(null, {
      services: {
        script: {
          zebra: {},
          alpha: {},
          mango: {},
        },
      },
      states: {
        "script.alpha": { attributes: { friendly_name: "Alpha Script" } },
      },
    });
    const schema = el._pickerSchema();
    expect(schema).toHaveLength(1);
    expect(schema[0].name).toBe("script");
    expect(schema[0].selector.select.options).toEqual([
      { value: "script.alpha", label: "Alpha Script" },
      { value: "script.mango", label: "script.mango" },
      { value: "script.zebra", label: "script.zebra" },
    ]);
  });

  test("_pickScript emits value-changed with {script, args: {}}", async () => {
    el = await mount(null, { services: { script: { foo: {} } } });
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => { detail = (e as CustomEvent).detail; });
    el._pickScript("script.foo");
    expect(detail.value).toEqual({ script: "script.foo", args: {} });
  });

  test("_pickScript seeds args from field defaults", async () => {
    el = await mount(null, {
      services: {
        script: {
          withdefaults: {
            fields: {
              temp:   { default: 18, selector: { number: {} } },
              zone:   { default: "down", selector: { text: {} } },
              nodef:  { selector: { text: {} } },
            },
          },
        },
      },
    });
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => { detail = (e as CustomEvent).detail; });
    el._pickScript("script.withdefaults");
    expect(detail.value).toEqual({ script: "script.withdefaults", args: { temp: 18, zone: "down" } });
  });

  test("clearing the picker emits null", async () => {
    el = await mount({ script: "script.foo", args: {} }, { services: { script: { foo: {} } } });
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => { detail = (e as CustomEvent).detail; });
    el._pickScript(null);
    expect(detail.value).toBeNull();
  });
});

describe("ambience-script-predicate-input — auto-form", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("_argsSchema mirrors the picked script's fields", async () => {
    el = await mount(
      { script: "script.foo", args: { temp: 20 } },
      {
        services: {
          script: {
            foo: {
              fields: {
                temp: {
                  name: "Threshold",
                  required: true,
                  description: "Trigger above this temperature",
                  selector: { number: { min: 0, max: 100 } },
                },
                zone: {
                  selector: { text: {} },
                },
              },
            },
          },
        },
      },
    );
    const schema = el._argsSchema();
    expect(schema).toEqual([
      {
        name: "temp",
        required: true,
        selector: { number: { min: 0, max: 100 } },
      },
      {
        name: "zone",
        required: undefined,
        selector: { text: {} },
      },
    ]);
  });

  test("editing an arg emits value-changed preserving other args", async () => {
    el = await mount(
      { script: "script.foo", args: { temp: 20, zone: "down" } },
      {
        services: {
          script: {
            foo: {
              fields: {
                temp: { selector: { number: {} } },
                zone: { selector: { text: {} } },
              },
            },
          },
        },
      },
    );
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => { detail = (e as CustomEvent).detail; });
    el._updateArgs({ temp: 25, zone: "down" });
    expect(detail.value).toEqual({ script: "script.foo", args: { temp: 25, zone: "down" } });
  });

  test("arguments section hidden when script declares no fields", async () => {
    el = await mount(
      { script: "script.bare", args: {} },
      { services: { script: { bare: {} } } },          // no fields
    );
    expect(el._argsSchema()).toEqual([]);
    // The args section should not render an empty <ha-form> block — implementer
    // tests this via the rendered DOM:
    expect(el.shadowRoot.querySelector(".args")).toBeNull();
  });

  test("renders args section when the picked script has fields", async () => {
    el = await mount(
      { script: "script.foo", args: {} },
      {
        services: {
          script: { foo: { fields: { temp: { selector: { number: {} } } } } },
        },
      },
    );
    expect(el.shadowRoot.querySelector(".args")).not.toBeNull();
  });
});

describe("ambience-script-predicate-input — YAML mode", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("starts in Form mode and toggles to YAML", async () => {
    el = await mount(
      { script: "script.foo", args: { x: 1 } },
      { services: { script: { foo: { fields: { x: { selector: { number: {} } } } } } } },
    );
    expect(el._mode).toBe("form");
    el._setMode("yaml");
    await el.updateComplete;
    expect(el._mode).toBe("yaml");
    // YAML pane shows the dump of the current predicate.
    const ta = el.shadowRoot.querySelector("textarea, ha-code-editor");
    expect(ta).not.toBeNull();
    expect((ta as HTMLTextAreaElement).value ?? (ta as any).value).toContain("script: script.foo");
  });

  test("editing YAML emits value-changed when parseable + valid", async () => {
    el = await mount(
      { script: "script.foo", args: {} },
      { services: { script: { foo: {} } } },
    );
    el._setMode("yaml");
    await el.updateComplete;
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => { detail = (e as CustomEvent).detail; });
    el._onYamlInput("script: script.foo\nargs:\n  k: 7\n");
    expect(detail.value).toEqual({ script: "script.foo", args: { k: 7 } });
    expect(el._yamlError).toBeNull();
  });

  test("invalid YAML sets _yamlError and does not emit", async () => {
    el = await mount({ script: "script.foo", args: {} }, { services: { script: { foo: {} } } });
    el._setMode("yaml");
    await el.updateComplete;
    let emitted = false;
    el.addEventListener("value-changed", () => { emitted = true; });
    el._onYamlInput("script: [unclosed");
    expect(emitted).toBe(false);
    expect(el._yamlError).not.toBeNull();
  });

  test("YAML missing 'script.' prefix sets _yamlError and does not emit", async () => {
    el = await mount({ script: "script.foo", args: {} }, { services: { script: { foo: {} } } });
    el._setMode("yaml");
    await el.updateComplete;
    let emitted = false;
    el.addEventListener("value-changed", () => { emitted = true; });
    el._onYamlInput("script: foo\n");
    expect(emitted).toBe(false);
    expect(el._yamlError).toMatch(/script\./);
  });

  test("scripts without fields default to form mode", async () => {
    el = await mount({ script: "script.bare", args: {} }, { services: { script: { bare: {} } } });
    expect(el._mode).toBe("form");
  });

  test("Form tab is disabled while YAML is invalid", async () => {
    el = await mount(
      { script: "script.foo", args: {} },
      { services: { script: { foo: { fields: { x: { selector: { number: {} } } } } } } },
    );
    el._setMode("yaml");
    await el.updateComplete;
    el._onYamlInput("not: a script");
    el._setMode("form");                    // attempt
    expect(el._mode).toBe("yaml");          // refused
  });

  test("Form tab button disabled attribute reflects yaml error", async () => {
    el = await mount(
      { script: "script.foo", args: {} },
      { services: { script: { foo: { fields: { x: { selector: { number: {} } } } } } } },
    );
    // Switch to YAML mode and type invalid YAML.
    el._setMode("yaml");
    await el.updateComplete;
    el._onYamlInput("script: [unclosed");
    await el.updateComplete;
    const buttons = Array.from(el.shadowRoot.querySelectorAll(".tabs button")) as HTMLButtonElement[];
    const formBtn = buttons.find((b) => b.textContent?.trim() === "Form");
    expect(formBtn?.disabled).toBe(true);
    expect(formBtn?.title).toContain("unclosed");  // error message preview
  });
});

describe("ambience-script-predicate-input — field labels", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("_computeFieldLabel prefers the field's friendly name alias", async () => {
    el = await mount(
      { script: "script.foo", args: {} },
      { services: { script: { foo: { fields: {
        target_brightness: { name: "Target brightness", selector: { number: {} } },
      } } } } },
    );
    expect(el._computeFieldLabel({ name: "target_brightness" })).toBe("Target brightness");
  });

  test("_computeFieldLabel falls back to a humanized raw key when no alias", async () => {
    el = await mount(
      { script: "script.foo", args: {} },
      { services: { script: { foo: { fields: {
        target_brightness: { selector: { number: {} } },
      } } } } },
    );
    expect(el._computeFieldLabel({ name: "target_brightness" })).toBe("Target brightness");
  });

  test("_computeFieldLabel falls back to humanized key when no script is picked", async () => {
    el = await mount(null, { services: { script: {} } });
    expect(el._computeFieldLabel({ name: "target_brightness" })).toBe("Target brightness");
  });

  test("_computeFieldHelper returns empty string when no script is picked", async () => {
    el = await mount(null, { services: { script: {} } });
    expect(el._computeFieldHelper({ name: "temp" })).toBe("");
  });

  test("_computeFieldHelper returns the field description", async () => {
    el = await mount(
      { script: "script.foo", args: {} },
      { services: { script: { foo: { fields: {
        temp: { description: "Target temperature in °C", selector: { number: {} } },
      } } } } },
    );
    expect(el._computeFieldHelper({ name: "temp" })).toBe("Target temperature in °C");
  });

  test("_argsSchema no longer carries a description suffix", async () => {
    el = await mount(
      { script: "script.foo", args: {} },
      { services: { script: { foo: { fields: {
        temp: { description: "Target temperature", selector: { number: {} } },
      } } } } },
    );
    expect(el._argsSchema()[0].description).toBeUndefined();
  });
});

describe("ambience-script-predicate-input — no suggestions", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("does not expose suggestion state or load suggestions", async () => {
    el = await mount(
      { script: "script.foo", args: {} },
      { services: { script: { foo: { fields: { x: { selector: { text: {} } } } } } } },
    );
    expect(el._loadSuggestions).toBeUndefined();
    expect(el._suggested).toBeUndefined();
    expect(el.shadowRoot.querySelector(".suggested")).toBeNull();
  });
});

describe("ambience-script-predicate-input — triggers picker", () => {
  let el: any;
  afterEach(() => el?.remove());

  const withScript = {
    script: "script.foo",
    args: {},
    triggers: ["light.kitchen"],
  } as ScriptPredicate;
  const hass = { services: { script: { foo: { fields: { x: { selector: { text: {} } } } } } } };

  test("removing a trigger chip emits the shortened list", async () => {
    el = await mount(withScript, hass);
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => { detail = (e as CustomEvent).detail; });
    const removeBtn = el.shadowRoot.querySelector('[data-test="trigger-light.kitchen"] .x');
    removeBtn.click();
    expect(detail.value.triggers).toEqual([]);
  });

  test("typing an entity_id in the fallback input adds it", async () => {
    el = await mount({ script: "script.foo", args: {}, triggers: [] }, hass);
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => { detail = (e as CustomEvent).detail; });
    const input = el.shadowRoot.querySelector('[data-test="trigger-add-input"]');
    input.value = "binary_sensor.front_door";
    input.dispatchEvent(new Event("change"));
    expect(detail.value.triggers).toEqual(["binary_sensor.front_door"]);
  });

  test("triggers section is not rendered in YAML mode", async () => {
    el = await mount(withScript, hass);
    el._setMode("yaml");
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".triggers")).toBeNull();
  });

  test("adding an entity already present does not duplicate it", async () => {
    el = await mount({ script: "script.foo", args: {}, triggers: ["light.kitchen"] }, hass);
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => { detail = (e as CustomEvent).detail; });
    const input = el.shadowRoot.querySelector('[data-test="trigger-add-input"]');
    input.value = "light.kitchen";
    input.dispatchEvent(new Event("change"));
    // No-op: the dedupe guard prevents re-adding; triggers stay as-is.
    expect(el._triggers).toEqual(["light.kitchen"]);
  });
});

describe("ambience-script-predicate-input — form tab reachable", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("no-fields script defaults to form mode", async () => {
    el = await mount(
      { script: "script.bare", args: {} },
      { services: { script: { bare: {} } } },
    );
    expect(el._mode).toBe("form");
  });

  test("Form button is enabled for a no-fields script with valid yaml", async () => {
    el = await mount(
      { script: "script.bare", args: {} },
      { services: { script: { bare: {} } } },
    );
    const buttons = [...el.shadowRoot.querySelectorAll(".tabs button")];
    const formBtn = buttons.find((b: any) => b.textContent?.trim() === "Form");
    expect(formBtn.disabled).toBe(false);
  });

  test("can switch back to form after going to YAML (no fields)", async () => {
    el = await mount(
      { script: "script.bare", args: {} },
      { services: { script: { bare: {} } } },
    );
    el._setMode("yaml");
    expect(el._mode).toBe("yaml");
    el._setMode("form");
    expect(el._mode).toBe("form");
  });
});
