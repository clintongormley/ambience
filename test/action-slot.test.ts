/**
 * Tests for ambience-action-slot — the body of an action slot. Renders a
 * target picker (when the service has a target stanza) plus an ha-form
 * for the intersection of `ExposedAction.visible_fields` and the service's
 * field schema.
 *
 * jsdom doesn't register ha-form, so these tests exercise the fallback
 * rendering paths.
 */
import { afterEach, describe, expect, test, vi } from "vitest";
import "../frontend/src/views/action-slot";

vi.mock("../frontend/src/api", () => ({
  getServiceSchema: vi.fn(),
}));

import * as api from "../frontend/src/api";
import type { ExposedAction, ServiceSchema } from "../frontend/src/types";

function makeHass() {
  return {
    localize: () => undefined,
    callWS: vi.fn(),
    entities: {
      "light.lamp_a": { entity_id: "light.lamp_a", area_id: "living_room" },
      "light.lamp_b": { entity_id: "light.lamp_b", area_id: "living_room" },
      "switch.fan": { entity_id: "switch.fan", area_id: "living_room" },
    },
    connection: { subscribeEvents: vi.fn() },
  } as any;
}

async function mount(
  opts: {
    hass?: any;
    scope?: { kind: "area"; id: string } | { kind: "floor"; id: string } | { kind: "house" };
    exposed?: ExposedAction;
    schema?: ServiceSchema | null;
    entityIds?: string[];
    params?: Record<string, unknown>;
    excludeEntities?: string[];
  } = {},
): Promise<any> {
  if (opts.schema !== undefined) {
    vi.mocked(api.getServiceSchema).mockResolvedValueOnce(opts.schema as ServiceSchema);
  }
  const el: any = document.createElement("ambience-action-slot");
  el.hass = opts.hass ?? makeHass();
  el.scope = opts.scope ?? { kind: "area", id: "living_room" };
  if (opts.exposed) el.exposed = opts.exposed;
  el.entityIds = opts.entityIds ?? [];
  el.params = opts.params ?? {};
  if (opts.excludeEntities) el.excludeEntities = opts.excludeEntities;
  document.body.appendChild(el);
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  return el;
}

function captureEvent(el: HTMLElement, name: string) {
  let detail: any;
  el.addEventListener(name, (e: Event) => {
    detail = (e as CustomEvent).detail;
  });
  return () => detail;
}

describe("ambience-action-slot", () => {
  let el: any;
  afterEach(() => {
    el?.remove();
    vi.mocked(api.getServiceSchema).mockReset();
  });

  test("loading state is rendered before the schema arrives", async () => {
    // Never resolve the getServiceSchema promise; the slot should sit in
    // its `_schema === undefined` (Loading…) state.
    vi.mocked(api.getServiceSchema).mockReturnValue(new Promise(() => {}));
    const exposed: ExposedAction = {
      id: "light.turn_on",
      label: "",
      visible_fields: [],
      defaults: {},
    };
    el = document.createElement("ambience-action-slot");
    el.hass = makeHass();
    el.scope = { kind: "area", id: "living_room" };
    el.exposed = exposed;
    el.entityIds = [];
    el.params = {};
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot.textContent.toLowerCase()).toContain("loading");
  });

  test("renders target picker and a field form when both exist", async () => {
    const schema: ServiceSchema = {
      target: { entity: { domain: "light" } },
      fields: {
        brightness: { selector: { number: { min: 0, max: 100 } } },
      },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "Set light",
        visible_fields: ["brightness"],
        defaults: {},
      },
      schema,
    });
    expect(el.shadowRoot.querySelector(".target-picker")).toBeTruthy();
    expect(el.shadowRoot.querySelector(".fields-form")).toBeTruthy();
  });

  test("omits target picker when the schema has no target", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: { msg: { selector: { text: {} } } },
    };
    el = await mount({
      exposed: {
        id: "notify.email",
        label: "",
        visible_fields: ["msg"],
        defaults: {},
      },
      schema,
    });
    expect(el.shadowRoot.querySelector(".target-picker")).toBeNull();
    expect(el.shadowRoot.querySelector(".fields-form")).toBeTruthy();
  });

  test("omits field form when visible_fields is empty", async () => {
    const schema: ServiceSchema = {
      target: { entity: { domain: "light" } },
      fields: { brightness: { selector: { number: {} } } },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: [],
        defaults: {},
      },
      schema,
    });
    expect(el.shadowRoot.querySelector(".target-picker")).toBeTruthy();
    expect(el.shadowRoot.querySelector(".fields-form")).toBeNull();
  });

  test("renders 'no parameters' message when neither target nor fields apply", async () => {
    const schema: ServiceSchema = { target: null, fields: {} };
    el = await mount({
      exposed: {
        id: "homeassistant.reload_config",
        label: "",
        visible_fields: [],
        defaults: {},
      },
      schema,
    });
    expect(el.shadowRoot.textContent.toLowerCase()).toMatch(/no.+(parameter|field)/);
  });

  test("visible_fields entries missing from the service schema are dropped silently", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: { brightness: { selector: { number: {} } } },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        // `gone` is no longer in the service schema → dropped
        visible_fields: ["gone", "brightness"],
        defaults: {},
      },
      schema,
    });
    const rows = el.shadowRoot.querySelectorAll(".field-row");
    expect(rows.length).toBe(1);
    const header = rows[0].querySelector(".field-label") as HTMLElement;
    expect(header?.textContent).toContain("Brightness");
  });

  test("typing in a field input emits params-changed", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: { msg: { selector: { text: {} } } },
    };
    el = await mount({
      exposed: {
        id: "notify.email",
        label: "",
        visible_fields: ["msg"],
        defaults: {},
      },
      schema,
    });
    const get = captureEvent(el, "params-changed");
    const input = el.shadowRoot.querySelector(".fields-form input") as HTMLInputElement;
    expect(input).toBeTruthy();
    input.value = "hello";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(get()?.params).toEqual({ msg: "hello" });
  });

  test("target picker value-changed re-emits as entity-ids-changed", async () => {
    const schema: ServiceSchema = {
      target: { entity: { domain: "light" } },
      fields: {},
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: [],
        defaults: {},
      },
      schema,
    });
    const get = captureEvent(el, "entity-ids-changed");
    const picker = el.shadowRoot.querySelector("ambience-target-picker") as HTMLElement;
    picker.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: ["light.lamp_a"] },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    expect(get()?.entityIds).toEqual(["light.lamp_a"]);
  });

  test("target picker receives the HA target metadata for domain filtering", async () => {
    const schema: ServiceSchema = {
      target: { entity: { domain: "light" } },
      fields: {},
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: [],
        defaults: {},
      },
      schema,
    });
    const picker = el.shadowRoot.querySelector("ambience-target-picker") as any;
    // target is passed through verbatim
    expect(picker.target).toEqual({ entity: { domain: "light" } });
    // entities are the full scope list; the picker itself intersects with target
    expect(picker.entities).toContain("light.lamp_a");
    expect(picker.entities).toContain("switch.fan");
  });

  test("excludeEntities are removed from the candidate list passed to the picker", async () => {
    const schema: ServiceSchema = {
      target: { entity: { domain: "light" } },
      fields: {},
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: [],
        defaults: {},
      },
      schema,
      excludeEntities: ["light.lamp_a"],
    });
    const picker = el.shadowRoot.querySelector("ambience-target-picker") as any;
    // lamp_a is claimed by another action → omitted from this picker's candidates.
    expect(picker.entities).not.toContain("light.lamp_a");
    // The rest of the in-scope entities remain available.
    expect(picker.entities).toContain("light.lamp_b");
  });

  test("excludeEntities defaults to passing through all scope entities", async () => {
    const schema: ServiceSchema = {
      target: { entity: { domain: "light" } },
      fields: {},
    };
    el = await mount({
      exposed: { id: "light.turn_on", label: "", visible_fields: [], defaults: {} },
      schema,
    });
    const picker = el.shadowRoot.querySelector("ambience-target-picker") as any;
    expect(picker.entities).toContain("light.lamp_a");
    expect(picker.entities).toContain("light.lamp_b");
  });

  test("required visible field renders an asterisk in the fallback label", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: { msg: { selector: { text: {} }, required: true } },
    };
    el = await mount({
      exposed: {
        id: "notify.email",
        label: "",
        visible_fields: ["msg"],
        defaults: {},
      },
      schema,
    });
    const label = el.shadowRoot.querySelector(".field-row .field-label")?.textContent;
    expect(label).toContain("Msg *");
  });

  test("schema fetch failure renders an inline error", async () => {
    vi.mocked(api.getServiceSchema).mockRejectedValueOnce(new Error("not found"));
    const el2: any = document.createElement("ambience-action-slot");
    el2.hass = makeHass();
    el2.scope = { kind: "area", id: "living_room" };
    el2.exposed = {
      id: "missing.service",
      label: "",
      visible_fields: [],
      defaults: {},
    };
    el2.entityIds = [];
    el2.params = {};
    document.body.appendChild(el2);
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;
    expect(el2.shadowRoot.querySelector(".schema-error")).toBeTruthy();
    expect(el2.shadowRoot.textContent).toContain("not found");
    el = el2;
  });

  test("field input seeds its current value from params", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: { msg: { selector: { text: {} } } },
    };
    el = await mount({
      exposed: {
        id: "notify.email",
        label: "",
        visible_fields: ["msg"],
        defaults: {},
      },
      schema,
      params: { msg: "already typed" },
    });
    const input = el.shadowRoot.querySelector(".fields-form input") as HTMLInputElement;
    expect(input.value).toBe("already typed");
  });

  // Fix 2: exposed=undefined renders a "service not exposed" message
  test("exposed=undefined renders a 'service not exposed' message instead of Loading…", async () => {
    // Do NOT set exposed — the service is no longer in the exposed-action list.
    el = document.createElement("ambience-action-slot");
    el.hass = makeHass();
    el.scope = { kind: "area", id: "living_room" };
    // exposed stays undefined
    el.entityIds = [];
    el.params = {};
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    // Must NOT show "Loading…"
    expect(el.shadowRoot.textContent.toLowerCase()).not.toContain("loading");
    // Must show the "not exposed" error message
    expect(el.shadowRoot.querySelector(".schema-error")).toBeTruthy();
    expect(el.shadowRoot.textContent.toLowerCase()).toMatch(/no longer exposed|settings.*actions/i);
    // getServiceSchema should never have been called
    expect(vi.mocked(api.getServiceSchema)).not.toHaveBeenCalled();
  });

  // Fix 1: no-target service emits target-mode-changed with hasTarget=false
  test("emits target-mode-changed with hasTarget=false when schema has no target stanza", async () => {
    const schema: ServiceSchema = { target: null, fields: { msg: { selector: { text: {} } } } };
    const events: boolean[] = [];
    el = document.createElement("ambience-action-slot");
    el.addEventListener("target-mode-changed", (e: Event) => {
      events.push((e as CustomEvent<{ hasTarget: boolean }>).detail.hasTarget);
    });
    el.hass = makeHass();
    el.scope = { kind: "area", id: "living_room" };
    el.exposed = { id: "notify.send_message", label: "", visible_fields: ["msg"], defaults: {} };
    el.entityIds = [];
    el.params = {};
    vi.mocked(api.getServiceSchema).mockResolvedValueOnce(schema);
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    // The last emitted event must have hasTarget=false
    expect(events.at(-1)).toBe(false);
    // hasTarget() public method must agree
    expect(el.hasTarget()).toBe(false);
  });

  // Fix 1: service-with-target emits target-mode-changed with hasTarget=true
  test("emits target-mode-changed with hasTarget=true when schema has a target stanza", async () => {
    const schema: ServiceSchema = {
      target: { entity: { domain: "light" } },
      fields: {},
    };
    const events: boolean[] = [];
    el = document.createElement("ambience-action-slot");
    el.addEventListener("target-mode-changed", (e: Event) => {
      events.push((e as CustomEvent<{ hasTarget: boolean }>).detail.hasTarget);
    });
    el.hass = makeHass();
    el.scope = { kind: "area", id: "living_room" };
    el.exposed = { id: "light.turn_on", label: "", visible_fields: [], defaults: {} };
    el.entityIds = [];
    el.params = {};
    vi.mocked(api.getServiceSchema).mockResolvedValueOnce(schema);
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(events.at(-1)).toBe(true);
    expect(el.hasTarget()).toBe(true);
  });

  test("fallback label shows human name from schema when field has a name attribute", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: {
        brightness_pct: {
          name: "Brightness",
          selector: { number: { min: 0, max: 100 } },
        },
      },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct"],
        defaults: {},
      },
      schema,
    });
    const label = el.shadowRoot.querySelector(".field-row .field-label") as HTMLElement;
    expect(label).not.toBeNull();
    expect(label.textContent).toContain("Brightness");
    expect(label.textContent).not.toContain("brightness_pct");
  });

  test("fallback label uses humanised field id when schema field has no name attribute", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: {
        brightness_pct: { selector: { number: { min: 0, max: 100 } } },
      },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct"],
        defaults: {},
      },
      schema,
    });
    const label = el.shadowRoot.querySelector(".field-row .field-label") as HTMLElement;
    expect(label).not.toBeNull();
    // Falls back to capitalised/underscores-replaced id.
    expect(label.textContent).toContain("Brightness pct");
  });

  test("jsdom fallback: hint span is rendered when field has a default value", async () => {
    // This test must run BEFORE ha-form is registered (jsdom fallback path).
    // Exercises the `hint ? html<span class="field-default-hint">...` truthy
    // branch in _renderFieldsForm's jsdom branch.
    const schema: ServiceSchema = {
      target: null,
      fields: { transition: { selector: { number: { min: 0, max: 60 } } } },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["transition"],
        defaults: { transition: 5 },
      },
      schema,
      params: {},
    });

    // jsdom fallback renders a <label> for the field.
    const label = el.shadowRoot.querySelector(".field-row label.field-label") as HTMLElement;
    // Only relevant in jsdom fallback (no ha-form).
    if (label) {
      const hint = el.shadowRoot.querySelector(".field-default-hint");
      expect(hint).not.toBeNull();
      expect(hint!.textContent).toContain("5");
    }
  });

  test("jsdom fallback: default hint includes unit suffix when selector has unit_of_measurement", async () => {
    // Exercises the `unit ? ` ${unit}` : ""` truthy branch in _defaultHintSuffix.
    // Must run BEFORE ha-form is registered.
    const schema: ServiceSchema = {
      target: null,
      fields: {
        transition: {
          selector: { number: { min: 0, max: 60, unit_of_measurement: "s" } },
        },
      },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["transition"],
        defaults: { transition: 3 },
      },
      schema,
      params: {},
    });

    const hint = el.shadowRoot.querySelector(".field-default-hint");
    expect(hint).not.toBeNull();
    // Hint must contain the value AND the unit suffix.
    expect(hint!.textContent).toContain("3");
    expect(hint!.textContent).toContain("s");
  });

  // Fix (color_rgb): ha-form data must NOT include "" for unset non-text fields
  test("ha-form data omits unset fields rather than filling them with empty string", async () => {
    // Register a stub ha-form so the ha-form branch (not jsdom fallback) is taken.
    if (!customElements.get("ha-form")) {
      class HaFormStub extends HTMLElement {
        data: Record<string, unknown> = {};
        schema: unknown[] = [];
      }
      customElements.define("ha-form", HaFormStub);
    }

    const schema: ServiceSchema = {
      target: null,
      fields: {
        rgb_color: { selector: { color_rgb: {} } },
        brightness_pct: { selector: { number: { min: 0, max: 100 } } },
      },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["rgb_color", "brightness_pct"],
        defaults: {},
      },
      schema,
      params: {},
    });

    // With per-field rendering, there are two ha-form elements.
    const haForms = el.shadowRoot.querySelectorAll("ha-form") as NodeListOf<any>;
    expect(haForms.length).toBe(2);

    // rgb_color form: field is unset → data should be empty (no pre-fill).
    const rgbForm = Array.from(haForms).find((f: any) =>
      ((f.schema as Array<{ name: string }>) ?? []).some((e) => e.name === "rgb_color"),
    ) as any;
    expect(rgbForm).toBeTruthy();
    expect(rgbForm.data).not.toHaveProperty("rgb_color");

    // brightness_pct form: field is also unset → data should be empty.
    const brightnessForm = Array.from(haForms).find((f: any) =>
      ((f.schema as Array<{ name: string }>) ?? []).some((e) => e.name === "brightness_pct"),
    ) as any;
    expect(brightnessForm).toBeTruthy();
    expect(brightnessForm.data).not.toHaveProperty("brightness_pct");
  });

  test("ha-form data includes only keys that are set in params", async () => {
    // ha-form stub is already registered from the test above.
    const schema: ServiceSchema = {
      target: null,
      fields: {
        brightness_pct: { selector: { number: { min: 0, max: 100 } } },
        transition: { selector: { number: { min: 0, max: 60 } } },
      },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct", "transition"],
        defaults: {},
      },
      schema,
      params: { brightness_pct: 50 },
    });

    const haForms = el.shadowRoot.querySelectorAll("ha-form") as NodeListOf<any>;
    expect(haForms.length).toBe(2);

    // Find the brightness_pct form and check its data.
    const brightnessForm = Array.from(haForms).find((f: any) =>
      ((f.schema as Array<{ name: string }>) ?? []).some((e) => e.name === "brightness_pct"),
    ) as any;
    expect(brightnessForm).toBeTruthy();
    expect(brightnessForm.data).toEqual({ brightness_pct: 50 });

    // Find the transition form and check data is empty.
    const transitionForm = Array.from(haForms).find((f: any) =>
      ((f.schema as Array<{ name: string }>) ?? []).some((e) => e.name === "transition"),
    ) as any;
    expect(transitionForm).toBeTruthy();
    expect(transitionForm.data).not.toHaveProperty("transition");
  });

  // Non-color selectors should never be pre-filled with any default.
  test("does not pre-fill non-color selectors when unset in params", async () => {
    // ha-form stub is already registered from earlier tests.
    const schema: ServiceSchema = {
      target: null,
      fields: {
        brightness_pct: { selector: { number: { min: 0, max: 100 } } },
      },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct"],
        defaults: {},
      },
      schema,
      params: {},
    });

    const haForm = el.shadowRoot.querySelector("ha-form") as any;
    expect(haForm).toBeTruthy();
    // Non-color selectors keep the existing omit-from-data behaviour.
    expect(haForm.data).not.toHaveProperty("brightness_pct");
  });

  // Fix 3: stale-fetch guard — second schema wins even if first resolves later
  test("stale-fetch guard: second schema wins when first resolves after second", async () => {
    // Simulate: slot mounts with light.turn_on, then exposed changes to
    // light.turn_off before the first fetch resolves.
    let resolveTurnOn!: (s: ServiceSchema) => void;
    const turnOnPromise = new Promise<ServiceSchema>((res) => {
      resolveTurnOn = res;
    });
    const turnOffSchema: ServiceSchema = {
      target: { entity: { domain: "light" } },
      fields: { transition: { selector: { number: {} } } },
    };

    // First call (light.turn_on) returns a never-yet-resolved promise.
    vi.mocked(api.getServiceSchema).mockReturnValueOnce(turnOnPromise);
    // Second call (light.turn_off) resolves immediately.
    vi.mocked(api.getServiceSchema).mockResolvedValueOnce(turnOffSchema);

    el = document.createElement("ambience-action-slot");
    el.hass = makeHass();
    el.scope = { kind: "area", id: "living_room" };
    el.exposed = { id: "light.turn_on", label: "", visible_fields: [], defaults: {} };
    el.entityIds = [];
    el.params = {};
    document.body.appendChild(el);
    await el.updateComplete;

    // Change exposed to light.turn_off before the first fetch resolves.
    el.exposed = { id: "light.turn_off", label: "", visible_fields: ["transition"], defaults: {} };
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    // Now resolve the first (stale) fetch — the slot must ignore it.
    const turnOnSchema: ServiceSchema = {
      target: { entity: { domain: "light" } },
      fields: { brightness: { selector: { number: {} } } },
    };
    resolveTurnOn(turnOnSchema);
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    // The rendered schema should be for light.turn_off (transition field),
    // not light.turn_on (brightness field).
    // ha-form is registered (from the earlier tests) so check its schema;
    // otherwise fall back to checking .field-row labels.
    const haForm = el.shadowRoot.querySelector("ha-form") as any;
    if (haForm) {
      const schemaNames = ((haForm.schema as Array<{ name: string }>) ?? []).map((e) => e.name);
      expect(schemaNames).toContain("transition");
      expect(schemaNames).not.toContain("brightness");
    } else {
      const rows = el.shadowRoot.querySelectorAll(".field-row");
      expect(rows.length).toBe(1);
      const labelText = rows[0].querySelector(".field-label")?.textContent ?? "";
      expect(labelText.toLowerCase()).toContain("transition");
      expect(labelText.toLowerCase()).not.toContain("brightness");
    }
  });

  // --- New tests for per-field layout, clear button, and label rendering ---

  test("renders a clear button only when a field has a value", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: { brightness_pct: { selector: { number: { min: 0, max: 100 } } } },
    };
    // No params set — no clear button expected.
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct"],
        defaults: {},
      },
      schema,
      params: {},
    });
    expect(el.shadowRoot.querySelector("[data-clear]")).toBeNull();

    // Now set params — clear button should appear.
    el.params = { brightness_pct: 80 };
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("[data-clear]")).toBeTruthy();
  });

  test("clear button removes the param from emitted state", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: { brightness_pct: { selector: { number: { min: 0, max: 100 } } } },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct"],
        defaults: {},
      },
      schema,
      params: { brightness_pct: 80 },
    });

    const get = captureEvent(el, "params-changed");
    const clearBtn = el.shadowRoot.querySelector("[data-clear]") as HTMLElement;
    expect(clearBtn).toBeTruthy();
    clearBtn.click();
    await el.updateComplete;

    const emitted = get();
    expect(emitted).toBeTruthy();
    expect(emitted.params).not.toHaveProperty("brightness_pct");
  });

  test("target label is rendered by action-slot with .field-label class", async () => {
    const schema: ServiceSchema = {
      target: { entity: { domain: "light" } },
      fields: {},
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: [],
        defaults: {},
      },
      schema,
    });
    // The Target label must appear as a .field-label inside the action-slot's
    // own shadow DOM, not delegated to ambience-target-picker's internal label.
    const labelEl = el.shadowRoot.querySelector(".target-picker .field-label") as HTMLElement;
    expect(labelEl).not.toBeNull();
    expect(labelEl.textContent?.trim()).toBe("Target");
    // The picker itself must receive a placeholder label (single space), not "Target".
    const picker = el.shadowRoot.querySelector("ambience-target-picker") as any;
    expect(picker.label).toBe(" ");
  });

  test("each visible field renders its label above the input", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: {
        brightness_pct: { selector: { number: { min: 0, max: 100 } } },
        transition: { selector: { number: { min: 0, max: 60 } } },
      },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct", "transition"],
        defaults: {},
      },
      schema,
      params: {},
    });

    const labels = el.shadowRoot.querySelectorAll(".field-label");
    expect(labels.length).toBe(2);
    const labelTexts = Array.from(labels).map((l: any) => l.textContent.trim());
    expect(labelTexts.some((t: string) => t.includes("Brightness pct"))).toBe(true);
    expect(labelTexts.some((t: string) => t.includes("Transition"))).toBe(true);
  });

  test("ha-form receives empty data for unset fields per row", async () => {
    // ha-form stub is already registered from earlier tests.
    const schema: ServiceSchema = {
      target: null,
      fields: {
        brightness_pct: { selector: { number: { min: 0, max: 100 } } },
        transition: { selector: { number: { min: 0, max: 60 } } },
      },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct", "transition"],
        defaults: {},
      },
      schema,
      params: { brightness_pct: 75 },
    });

    const haForms = el.shadowRoot.querySelectorAll("ha-form") as NodeListOf<any>;
    expect(haForms.length).toBe(2);

    const brightnessForm = Array.from(haForms).find((f: any) =>
      ((f.schema as Array<{ name: string }>) ?? []).some((e) => e.name === "brightness_pct"),
    ) as any;
    expect(brightnessForm.data).toEqual({ brightness_pct: 75 });

    const transitionForm = Array.from(haForms).find((f: any) =>
      ((f.schema as Array<{ name: string }>) ?? []).some((e) => e.name === "transition"),
    ) as any;
    expect(transitionForm.data).toEqual({});
  });

  // --- Show+default model: HA declaration order, default pre-fill, extras notice ---

  test("fields render in HA services.yaml declaration order, not visible_fields order", async () => {
    // Schema declares brightness_pct BEFORE transition.
    const schema: ServiceSchema = {
      target: null,
      fields: {
        brightness_pct: { selector: { number: { min: 0, max: 100 } } },
        transition: { selector: { number: { min: 0, max: 60 } } },
      },
    };
    el = await mount({
      // visible_fields stores them in the opposite order — should not matter.
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["transition", "brightness_pct"],
        defaults: {},
      },
      schema,
      params: {},
    });

    const haForms = el.shadowRoot.querySelectorAll("ha-form") as NodeListOf<any>;
    expect(haForms.length).toBe(2);
    const orderedNames = Array.from(haForms).map(
      (f: any) => ((f.schema as Array<{ name: string }>) ?? [])[0]?.name,
    );
    expect(orderedNames).toEqual(["brightness_pct", "transition"]);
  });

  test("settings default does NOT pre-fill the form; field renders empty and hint appears", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: {
        brightness_pct: { selector: { number: { min: 0, max: 100 } } },
      },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct"],
        defaults: { brightness_pct: 42 },
      },
      schema,
      params: {},
    });

    // ha-form branch: data must NOT contain the default
    const haForm = el.shadowRoot.querySelector("ha-form") as any;
    if (haForm) {
      expect(haForm.data).not.toHaveProperty("brightness_pct");
    }

    // jsdom fallback: input value must be empty
    const input = el.shadowRoot.querySelector(
      "input[data-field='brightness_pct']",
    ) as HTMLInputElement | null;
    if (input) {
      expect(input.value).toBe("");
    }

    // The default hint must be visible
    const hint = el.shadowRoot.querySelector(".field-default-hint");
    expect(hint).toBeTruthy();
    expect(hint!.textContent).toContain("42");
  });

  test("user override wins over the settings default", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: { brightness_pct: { selector: { number: { min: 0, max: 100 } } } },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct"],
        defaults: { brightness_pct: 42 },
      },
      schema,
      params: { brightness_pct: 99 },
    });
    const haForm = el.shadowRoot.querySelector("ha-form") as any;
    expect(haForm.data).toEqual({ brightness_pct: 99 });
  });

  test("clear ✕ button only shows for user overrides, not default-only values", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: { brightness_pct: { selector: { number: { min: 0, max: 100 } } } },
    };
    // Default-only: no clear button.
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct"],
        defaults: { brightness_pct: 30 },
      },
      schema,
      params: {},
    });
    expect(el.shadowRoot.querySelector("[data-clear]")).toBeNull();

    // Now add a user override → ✕ button appears.
    el.params = { brightness_pct: 80 };
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("[data-clear]")).toBeTruthy();
  });

  test("'Extra fields' notice appears when params contain keys not in visible_fields and not in defaults", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: {
        rgb_color: { selector: { color_rgb: {} } },
        brightness_pct: { selector: { number: { min: 0, max: 100 } } },
      },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct"],
        defaults: {},
      },
      schema,
      params: { rgb_color: [255, 0, 0] }, // not exposed
    });
    const notice = el.shadowRoot.querySelector("[data-extra-params]");
    expect(notice).toBeTruthy();
    expect(notice.textContent).toContain("rgb_color");
  });

  test("'Extra fields' notice does NOT appear when the extra key is in defaults", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: { rgb_color: { selector: { color_rgb: {} } } },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: [], // not shown in the editor
        defaults: { rgb_color: [0, 0, 0] }, // but defaults expose it
      },
      schema,
      params: { rgb_color: [255, 0, 0] },
    });
    expect(el.shadowRoot.querySelector("[data-extra-params]")).toBeNull();
  });

  test("'Remove extras' button clears only the extra keys, preserving exposed-field values", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: {
        brightness_pct: { selector: { number: { min: 0, max: 100 } } },
        rgb_color: { selector: { color_rgb: {} } },
      },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct"],
        defaults: {},
      },
      schema,
      params: { brightness_pct: 50, rgb_color: [255, 0, 0] },
    });
    const get = captureEvent(el, "params-changed");
    const removeBtn = el.shadowRoot.querySelector("[data-remove-extras]") as HTMLElement;
    expect(removeBtn).toBeTruthy();
    removeBtn.click();
    await el.updateComplete;

    const emitted = get();
    expect(emitted).toBeTruthy();
    expect(emitted.params).toEqual({ brightness_pct: 50 });
    expect(emitted.params).not.toHaveProperty("rgb_color");
  });

  // --- Default hint rendering ---

  test("renders 'Default: X' hint beside the field label when settings has a default", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: { transition: { selector: { number: { min: 0, max: 60 } } } },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["transition"],
        defaults: { transition: 3 },
      },
      schema,
      params: {},
    });
    const hint = el.shadowRoot.querySelector(".field-default-hint");
    expect(hint).toBeTruthy();
    expect(hint!.textContent).toContain("Default:");
    expect(hint!.textContent).toContain("3");
  });

  test("target-valued default hint renders friendly entity names", async () => {
    const hass = {
      ...makeHass(),
      states: { "light.kitchen": { attributes: { friendly_name: "Kitchen" } } },
    };
    const schema: ServiceSchema = {
      target: null,
      fields: { target: { selector: { target: {} } } },
    };
    el = await mount({
      hass,
      exposed: {
        id: "script.dim",
        label: "",
        visible_fields: ["target"],
        defaults: { target: { entity_id: ["light.kitchen"] } },
      },
      schema,
      params: {},
    });
    const hint = el.shadowRoot.querySelector(".field-default-hint");
    expect(hint).toBeTruthy();
    expect(hint!.textContent).toContain("Default: [Kitchen]");
  });

  test("no default hint when settings has no default for the field", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: { transition: { selector: { number: { min: 0, max: 60 } } } },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["transition"],
        defaults: {},
      },
      schema,
      params: {},
    });
    expect(el.shadowRoot.querySelector(".field-default-hint")).toBeNull();
  });

  test("user typing a value equal to the default still counts as an override", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: { transition: { selector: { number: { min: 0, max: 60 } } } },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["transition"],
        defaults: { transition: 3 },
      },
      schema,
      params: {},
    });

    // Before typing: no clear button
    expect(el.shadowRoot.querySelector("[data-clear='transition']")).toBeNull();

    const get = captureEvent(el, "params-changed");
    const input = el.shadowRoot.querySelector("input[data-field='transition']") as HTMLInputElement;
    if (input) {
      // Type "3" — same as default, but now an explicit override
      input.value = "3";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      await el.updateComplete;

      const emitted = get();
      expect(emitted).toBeTruthy();
      expect(emitted.params).toHaveProperty("transition");
      expect(emitted.params.transition).toBe("3");

      // Simulate the parent reflecting the emitted params back
      el.params = emitted.params;
      await el.updateComplete;

      // Clear button must now be visible
      expect(el.shadowRoot.querySelector("[data-clear='transition']")).toBeTruthy();
    } else {
      // ha-form branch: simulate ha-form value-changed
      const haForm = el.shadowRoot.querySelector("ha-form") as HTMLElement | null;
      if (haForm) {
        haForm.dispatchEvent(
          new CustomEvent("value-changed", {
            detail: { value: { transition: 3 } },
            bubbles: true,
            composed: true,
          }),
        );
        await el.updateComplete;

        const emitted = get();
        expect(emitted).toBeTruthy();
        expect(emitted.params).toHaveProperty("transition", 3);

        el.params = emitted.params;
        await el.updateComplete;
        expect(el.shadowRoot.querySelector("[data-clear='transition']")).toBeTruthy();
      }
    }
  });

  test("✕ clear removes the override; field renders empty again with default hint", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: { transition: { selector: { number: { min: 0, max: 60 } } } },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["transition"],
        defaults: { transition: 3 },
      },
      schema,
      params: { transition: 5 },
    });

    const get = captureEvent(el, "params-changed");

    // Clear button should be present (there's a user override)
    const clearBtn = el.shadowRoot.querySelector("[data-clear='transition']") as HTMLElement;
    expect(clearBtn).toBeTruthy();
    clearBtn.click();
    await el.updateComplete;

    const emitted = get();
    expect(emitted).toBeTruthy();
    expect(emitted.params).not.toHaveProperty("transition");

    // Simulate parent reflecting the cleared params
    el.params = emitted.params;
    await el.updateComplete;

    // No clear button anymore
    expect(el.shadowRoot.querySelector("[data-clear='transition']")).toBeNull();

    // Default hint still visible
    const hint = el.shadowRoot.querySelector(".field-default-hint");
    expect(hint).toBeTruthy();
    expect(hint!.textContent).toContain("3");

    // Input is empty (jsdom fallback)
    const input = el.shadowRoot.querySelector(
      "input[data-field='transition']",
    ) as HTMLInputElement | null;
    if (input) {
      expect(input.value).toBe("");
    }
  });

  // --- Missing branch coverage additions ---

  test("_loadSchema skips fetch and clears schema when hass is not set at call time", async () => {
    // Mount with exposed but WITHOUT hass — triggers _loadSchema with !this.hass
    // which hits the `!id || !this.hass` early-return branch (lines 164-168).
    el = document.createElement("ambience-action-slot");
    // hass deliberately left unset
    el.scope = { kind: "area", id: "living_room" };
    el.exposed = { id: "light.turn_on", label: "", visible_fields: [], defaults: {} };
    el.entityIds = [];
    el.params = {};
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    // Without hass, _loadSchema returns early → _schema stays undefined → loading state.
    expect(el.shadowRoot.textContent.toLowerCase()).toContain("loading");
    // getServiceSchema should never have been called without hass.
    expect(vi.mocked(api.getServiceSchema)).not.toHaveBeenCalled();
  });

  test("_buildFormSchema propagates a string description from the service field", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: {
        transition: {
          selector: { number: { min: 0, max: 60 } },
          description: "Transition time in seconds",
        },
      },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["transition"],
        defaults: {},
      },
      schema,
    });

    // The description should end up in the ha-form schema entry. Verify by
    // checking the jsdom fallback label (description shows up via the
    // field-default-hint or can be checked via the internal _formSchema).
    const formSchema: any[] = (el as any)._formSchema;
    expect(formSchema.length).toBe(1);
    expect(formSchema[0].description).toBe("Transition time in seconds");
  });

  test("hasTarget() returns false (conservative) while schema is still loading", async () => {
    // Keep schema pending so _schema stays undefined.
    vi.mocked(api.getServiceSchema).mockReturnValueOnce(new Promise(() => {}));
    el = document.createElement("ambience-action-slot");
    el.hass = makeHass();
    el.scope = { kind: "area", id: "living_room" };
    el.exposed = { id: "light.turn_on", label: "", visible_fields: [], defaults: {} };
    el.entityIds = [];
    el.params = {};
    document.body.appendChild(el);
    await el.updateComplete;

    // _schema is still undefined (loading) → hasTarget() must return false conservatively.
    expect((el as any)._schema).toBeUndefined();
    expect(el.hasTarget()).toBe(false);
  });

  test("schema null from a successful fetch (no error) renders the 'service unavailable' fallback", async () => {
    // getServiceSchema resolves with null (not a rejection) — this is the
    // _schemaError=null path where localize() provides the fallback text.
    vi.mocked(api.getServiceSchema).mockResolvedValueOnce(null);
    el = document.createElement("ambience-action-slot");
    el.hass = makeHass();
    el.scope = { kind: "area", id: "living_room" };
    el.exposed = { id: "light.turn_on", label: "", visible_fields: [], defaults: {} };
    el.entityIds = [];
    el.params = {};
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    // _schemaError is null, _schema is null, _exposedMissing is false →
    // renders the fallback localize text (service unavailable).
    const errEl = el.shadowRoot.querySelector(".schema-error") as HTMLElement;
    expect(errEl).not.toBeNull();
    // _schemaError is null → falls through to localize default text.
    expect((el as any)._schemaError).toBeNull();
    // The ?? right-hand side (localize fallback) must be visible in the error text.
    expect(errEl.textContent).toContain("not available");
  });

  test("no default-hint text when the field has no default (hint branch=false in jsdom fallback)", async () => {
    // This test exercises the `hint ? html<span>... : ""` falsy branch in the
    // jsdom fallback renderer (_renderFieldsForm). A field with no default in
    // exposed.defaults produces an empty hint string.
    const schema: ServiceSchema = {
      target: null,
      fields: { brightness_pct: { selector: { number: { min: 0, max: 100 } } } },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct"],
        defaults: {}, // no default → hint = ""
      },
      schema,
      params: {},
    });

    // jsdom fallback (no ha-form): label element with no hint span next to it.
    const label = el.shadowRoot.querySelector(".field-row .field-label-group label") as HTMLElement;
    if (label) {
      // The hint span should not be rendered alongside the label.
      const hint = label.parentElement?.querySelector(".field-default-hint");
      expect(hint).toBeNull();
    }
    // Also verify via the field-default-hint check.
    expect(el.shadowRoot.querySelector(".field-default-hint")).toBeNull();
  });

  test("'Extra fields' notice shows without any visible fields (schema=0, extrasNotice branch)", async () => {
    // When visible_fields is empty but params contains extra keys, the code path
    // `extrasNotice !== "" ? html<div class="fields-form">... : ""`
    // (the non-empty extrasNotice with schema.length=0) is exercised.
    const schema: ServiceSchema = {
      target: null,
      fields: { brightness_pct: { selector: { number: {} } } },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: [], // no visible fields → schema.length === 0
        defaults: {},
      },
      schema,
      params: { brightness_pct: 80 }, // extra param (not in visible_fields, not in defaults)
    });

    // Should render the extras notice inside a .fields-form wrapper.
    const fieldsForm = el.shadowRoot.querySelector(".fields-form");
    expect(fieldsForm).not.toBeNull();
    const notice = el.shadowRoot.querySelector("[data-extra-params]");
    expect(notice).not.toBeNull();
    expect(notice!.textContent).toContain("brightness_pct");
  });

  test("field with no selector falls back to { text: {} } in the form schema", async () => {
    // Exercises the `field.selector ?? { text: {} }` branch in _buildFormSchema.
    const schema: ServiceSchema = {
      target: null,
      fields: {
        note: {
          // No selector provided — should fall back to text selector.
          name: "Note",
        } as any,
      },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["note"],
        defaults: {},
      },
      schema,
    });

    const formSchema: any[] = (el as any)._formSchema;
    expect(formSchema.length).toBe(1);
    expect(formSchema[0].selector).toEqual({ text: {} });
  });

  test("_defaultHintSuffix returns empty string for a selector with no unit_of_measurement", async () => {
    // Exercises the `unit ? ... : ""` falsy branch in _defaultHintSuffix.
    // A text selector has no unit — the suffix should be empty.
    const schema: ServiceSchema = {
      target: null,
      fields: { message: { selector: { text: {} } } },
    };
    el = await mount({
      exposed: {
        id: "light.turn_on",
        label: "",
        visible_fields: ["message"],
        defaults: { message: "hello" }, // default set so hint is rendered
      },
      schema,
      params: {},
    });

    const hint = el.shadowRoot.querySelector(".field-default-hint");
    expect(hint).not.toBeNull();
    // Hint text should contain the value but no unit suffix.
    expect(hint!.textContent).toContain("hello");
    // No " s" or " %" or similar unit suffix.
    expect(hint!.textContent).not.toMatch(/Default: hello\s+\S/);
  });

  test("hass updates while a schema fetch is in flight don't spawn duplicates", async () => {
    vi.mocked(api.getServiceSchema).mockReturnValue(new Promise(() => {}));
    el = await mount({
      exposed: { id: "light.turn_on", label: "", visible_fields: [], defaults: {} },
    });
    // hass is replaced on every HA state change; while _schema is still
    // undefined each update used to fire another identical ws call.
    el.hass = makeHass();
    await el.updateComplete;
    el.hass = makeHass();
    await el.updateComplete;
    expect(vi.mocked(api.getServiceSchema)).toHaveBeenCalledTimes(1);
  });
});
