import { describe, test, expect, afterEach, vi } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  getKnownStates: vi.fn(async () => ({ states: ["on", "off"] })),
}));

import "../frontend/src/views/state-expr-atom";
import type { StateAtom } from "../frontend/src/types";

async function mount(atom: StateAtom): Promise<any> {
  const el: any = document.createElement("ambience-state-expr-atom");
  el.value = atom;
  el.hass = {};
  document.body.appendChild(el);
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  return el;
}

describe("ambience-state-expr-atom", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("renders entity, op and states fields (native fallback)", async () => {
    el = await mount({ kind: "is", entity_id: "binary_sensor.x", states: ["on"] });
    expect(el.shadowRoot.querySelector("[data-field='entity']")).toBeTruthy();
    expect(el.shadowRoot.querySelector("[data-field='op']")).toBeTruthy();
    expect(el.shadowRoot.querySelector("[data-field='states']")).toBeTruthy();
  });

  test("_opSchema is a required dropdown with is / is_not", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    const schema = el._opSchema();
    expect(schema[0].name).toBe("op");
    expect(schema[0].required).toBe(true);
    const opts = schema[0].selector.select.options.map((o: { value: string }) => o.value);
    expect(opts).toEqual(["is", "is_not"]);
  });

  test("_statesSchema is a multi-select with custom_value enabled", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    const schema = el._statesSchema();
    const sel = schema[0].selector.select;
    expect(sel.multiple).toBe(true);
    expect(sel.custom_value).toBe(true);
  });

  test("emits value-changed when op flips", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._setOp("is_not");
    expect(captured.kind).toBe("is_not");
  });

  test("emits value-changed when states change", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._setStates(["on", "off"]);
    expect(captured.states).toEqual(["on", "off"]);
  });

  test("setting an entity clears the previously-selected states (different domain)", async () => {
    el = await mount({ kind: "is", entity_id: "binary_sensor.a", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._setEntity("person.bob");
    expect(captured.entity_id).toBe("person.bob");
    expect(captured.states).toEqual([]);
  });

  test("toggling 'for' duration on/off adds and clears the field", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._setForEnabled(true);
    expect(captured.for).toEqual({ h: 0, m: 0, s: 0 });
    el._setForEnabled(false);
    expect(captured.for).toBeNull();
  });

  test("setting for duration updates the field", async () => {
    el = await mount({
      kind: "is", entity_id: "x", states: ["on"], for: { h: 0, m: 0, s: 0 },
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._setForDuration({ h: 0, m: 5, s: 0 });
    expect(captured.for).toEqual({ h: 0, m: 5, s: 0 });
  });

  test("_forSchema is an ha-form duration selector (days disabled)", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"], for: { h: 0, m: 5, s: 0 } });
    const schema = el._forSchema();
    expect(schema).toHaveLength(1);
    expect(schema[0].name).toBe("duration");
    expect(schema[0].required).toBe(true);
    expect(schema[0].selector.duration).toBeDefined();
    expect(schema[0].selector.duration.enable_day).toBe(false);
  });

  test("_forData maps storage {h,m,s} to ha-form's {hours,minutes,seconds}", async () => {
    el = await mount({
      kind: "is", entity_id: "x", states: ["on"], for: { h: 1, m: 30, s: 15 },
    });
    expect(el._forData()).toEqual({ duration: { hours: 1, minutes: 30, seconds: 15 } });
  });

  test("_setForFromHaForm translates ha-form duration shape back to {h,m,s}", async () => {
    el = await mount({
      kind: "is", entity_id: "x", states: ["on"], for: { h: 0, m: 0, s: 0 },
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._setForFromHaForm({ hours: 2, minutes: 15, seconds: 30 });
    expect(captured.for).toEqual({ h: 2, m: 15, s: 30 });
  });

  test("_setAttributeEnabled toggles the attribute field on/off", async () => {
    el = await mount({ kind: "is", entity_id: "media_player.x", states: ["Spotify"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._setAttributeEnabled(true);
    expect(captured.attribute).toBe("");
    // Toggling off clears the field (back to comparing entity state).
    el._setAttributeEnabled(false);
    expect(captured.attribute).toBeNull();
  });

  test("_setAttribute updates the attribute name", async () => {
    el = await mount({ kind: "is", entity_id: "media_player.x", attribute: "", states: [] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._setAttribute("source");
    expect(captured.attribute).toBe("source");
    expect(captured.entity_id).toBe("media_player.x");
  });

  test("changing the entity_id clears a previously-set attribute (different domain)", async () => {
    el = await mount({
      kind: "is", entity_id: "media_player.a", attribute: "source", states: ["Spotify"],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._setEntity("light.kitchen");
    expect(captured.entity_id).toBe("light.kitchen");
    // Both states AND attribute reset — the new entity probably doesn't have the same attribute.
    expect(captured.states).toEqual([]);
    expect(captured.attribute).toBeNull();
  });
});
