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
        description: { suffix: "Trigger above this temperature" },
        selector: { number: { min: 0, max: 100 } },
      },
      {
        name: "zone",
        required: undefined,
        description: undefined,
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

  test("form mode hidden when script declares no fields", async () => {
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
