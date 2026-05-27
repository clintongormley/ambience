/**
 * Tests for ambience-action-slot — the body of an action slot. Renders a
 * target picker (when the service has a target stanza) plus an ha-form
 * for the intersection of `ExposedAction.visible_fields` and the service's
 * field schema.
 *
 * jsdom doesn't register ha-form, so these tests exercise the fallback
 * rendering paths.
 */
import { describe, test, expect, afterEach, vi } from "vitest";
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

async function mount(opts: {
  hass?: any;
  scope?: { kind: "area"; id: string } | { kind: "floor"; id: string } | { kind: "house" };
  exposed?: ExposedAction;
  schema?: ServiceSchema | null;
  entityIds?: string[];
  params?: Record<string, unknown>;
} = {}): Promise<any> {
  if (opts.schema !== undefined) {
    vi.mocked(api.getServiceSchema).mockResolvedValueOnce(opts.schema as ServiceSchema);
  }
  const el: any = document.createElement("ambience-action-slot");
  el.hass = opts.hass ?? makeHass();
  el.scope = opts.scope ?? { kind: "area", id: "living_room" };
  if (opts.exposed) el.exposed = opts.exposed;
  el.entityIds = opts.entityIds ?? [];
  el.params = opts.params ?? {};
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
  el.addEventListener(name, (e: Event) => { detail = (e as CustomEvent).detail; });
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
      id: "light.turn_on", label: "", visible_fields: [], locked_values: {},
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
        locked_values: {},
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
        locked_values: {},
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
        locked_values: {},
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
        locked_values: {},
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
        locked_values: {},
      },
      schema,
    });
    const rows = el.shadowRoot.querySelectorAll(".field-row");
    expect(rows.length).toBe(1);
    expect(rows[0].querySelector("label")?.textContent).toContain("Brightness");
  });

  test("typing in a field input emits params-changed", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: { msg: { selector: { text: {} } } },
    };
    el = await mount({
      exposed: {
        id: "notify.email", label: "",
        visible_fields: ["msg"], locked_values: {},
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
        id: "light.turn_on", label: "",
        visible_fields: [], locked_values: {},
      },
      schema,
    });
    const get = captureEvent(el, "entity-ids-changed");
    const picker = el.shadowRoot.querySelector("ambience-target-picker") as HTMLElement;
    picker.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: ["light.lamp_a"] },
      bubbles: true,
      composed: true,
    }));
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
        id: "light.turn_on", label: "",
        visible_fields: [], locked_values: {},
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

  test("required visible field renders an asterisk in the fallback label", async () => {
    const schema: ServiceSchema = {
      target: null,
      fields: { msg: { selector: { text: {} }, required: true } },
    };
    el = await mount({
      exposed: {
        id: "notify.email", label: "",
        visible_fields: ["msg"], locked_values: {},
      },
      schema,
    });
    const label = el.shadowRoot.querySelector(".field-row label")?.textContent;
    expect(label).toContain("Msg *");
  });

  test("schema fetch failure renders an inline error", async () => {
    vi.mocked(api.getServiceSchema).mockRejectedValueOnce(new Error("not found"));
    const el2: any = document.createElement("ambience-action-slot");
    el2.hass = makeHass();
    el2.scope = { kind: "area", id: "living_room" };
    el2.exposed = {
      id: "missing.service", label: "",
      visible_fields: [], locked_values: {},
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
        id: "notify.email", label: "",
        visible_fields: ["msg"], locked_values: {},
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
    el.exposed = { id: "notify.send_message", label: "", visible_fields: ["msg"], locked_values: {} };
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
    el.exposed = { id: "light.turn_on", label: "", visible_fields: [], locked_values: {} };
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

  // Fix 3: stale-fetch guard — second schema wins even if first resolves later
  test("stale-fetch guard: second schema wins when first resolves after second", async () => {
    // Simulate: slot mounts with light.turn_on, then exposed changes to
    // light.turn_off before the first fetch resolves.
    let resolveTurnOn!: (s: ServiceSchema) => void;
    const turnOnPromise = new Promise<ServiceSchema>((res) => { resolveTurnOn = res; });
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
    el.exposed = { id: "light.turn_on", label: "", visible_fields: [], locked_values: {} };
    el.entityIds = [];
    el.params = {};
    document.body.appendChild(el);
    await el.updateComplete;

    // Change exposed to light.turn_off before the first fetch resolves.
    el.exposed = { id: "light.turn_off", label: "", visible_fields: ["transition"], locked_values: {} };
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
    const rows = el.shadowRoot.querySelectorAll(".field-row");
    expect(rows.length).toBe(1);
    const labelText = rows[0].querySelector("label")?.textContent ?? "";
    expect(labelText.toLowerCase()).toContain("transition");
    expect(labelText.toLowerCase()).not.toContain("brightness");
  });
});
