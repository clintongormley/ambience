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

  test("renders Entity / Attribute / Op / Values / For sections", async () => {
    el = await mount({ kind: "is", entity_id: "binary_sensor.x", states: ["on"] });
    expect(el.shadowRoot.querySelector("[data-field='entity']")).toBeTruthy();
    expect(el.shadowRoot.querySelector("[data-field='attribute']")).toBeTruthy();
    expect(el.shadowRoot.querySelector("[data-field='op']")).toBeTruthy();
    expect(el.shadowRoot.querySelector("[data-field='for']")).toBeTruthy();
  });

  test("_opSchema is a required dropdown with is / is_not", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    const schema = el._opSchema();
    expect(schema[0].name).toBe("op");
    expect(schema[0].required).toBe(true);
    const opts = schema[0].selector.select.options.map((o: { value: string }) => o.value);
    expect(opts).toEqual(["is", "is_not"]);
  });

  test("_valueSchema is a single-value combobox with custom_value enabled", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    const schema = el._valueSchema();
    const sel = schema[0].selector.select;
    expect(sel.mode).toBe("dropdown");
    expect(sel.custom_value).toBe(true);
    expect(sel.multiple).toBeFalsy();
  });

  test("_attributeSchema is a combobox listing the entity's attributes (sorted)", async () => {
    const el2: any = document.createElement("ambience-state-expr-atom");
    el2.value = { kind: "is", entity_id: "media_player.x", states: [] };
    el2.hass = {
      states: {
        "media_player.x": {
          attributes: { source: "Spotify", volume_level: 0.5, friendly_name: "Living room" },
        },
      },
    };
    document.body.appendChild(el2);
    await el2.updateComplete;
    const sel = el2._attributeSchema()[0].selector.select;
    expect(sel.mode).toBe("dropdown");
    expect(sel.custom_value).toBe(true);
    expect(sel.options.map((o: { value: string }) => o.value)).toEqual([
      "friendly_name", "source", "volume_level",
    ]);
    el2.remove();
  });

  test("_attributeSchema returns an empty option list when the entity is not in hass.states", async () => {
    const el2: any = document.createElement("ambience-state-expr-atom");
    el2.value = { kind: "is", entity_id: "media_player.does_not_exist", states: [] };
    el2.hass = { states: {} };
    document.body.appendChild(el2);
    await el2.updateComplete;
    expect(el2._attributeSchema()[0].selector.select.options).toEqual([]);
    el2.remove();
  });

  test("_attributeSchema falls back to empty options when entity_id is unset", async () => {
    el = await mount({ kind: "is", entity_id: "", states: [] });
    expect(el._attributeSchema()[0].selector.select.options).toEqual([]);
  });

  // --- op dropdown adapts to target type --------------------------------

  async function mountWithHass(atom: StateAtom, hassStates: any): Promise<any> {
    const el2: any = document.createElement("ambience-state-expr-atom");
    el2.value = atom;
    el2.hass = { states: hassStates };
    document.body.appendChild(el2);
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;
    return el2;
  }

  test("op dropdown shows only is/is_not when the state is non-numeric", async () => {
    const el2 = await mountWithHass(
      { kind: "is", entity_id: "person.bob", states: [] },
      { "person.bob": { state: "home", attributes: {} } },
    );
    const opts = el2._opSchema()[0].selector.select.options.map((o: any) => o.value);
    expect(opts).toEqual(["is", "is_not"]);
    el2.remove();
  });

  test("op dropdown also offers >, >=, <, <= when the state parses as a number", async () => {
    const el2 = await mountWithHass(
      { kind: "is", entity_id: "sensor.temp", states: [] },
      { "sensor.temp": { state: "21.4", attributes: {} } },
    );
    const opts = el2._opSchema()[0].selector.select.options.map((o: any) => o.value);
    expect(opts).toEqual(["is", "is_not", ">", ">=", "<", "<="]);
    el2.remove();
  });

  test("attribute mode: numeric ops appear when the attribute is a number", async () => {
    const el2 = await mountWithHass(
      { kind: "is", entity_id: "light.x", attribute: "brightness", states: [] },
      { "light.x": { state: "on", attributes: { brightness: 200 } } },
    );
    const opts = el2._opSchema()[0].selector.select.options.map((o: any) => o.value);
    expect(opts).toContain(">");
    el2.remove();
  });

  test("attribute mode: numeric ops do NOT appear when the attribute is a string", async () => {
    const el2 = await mountWithHass(
      { kind: "is", entity_id: "media_player.x", attribute: "source", states: [] },
      { "media_player.x": { state: "playing", attributes: { source: "Spotify" } } },
    );
    const opts = el2._opSchema()[0].selector.select.options.map((o: any) => o.value);
    expect(opts).toEqual(["is", "is_not"]);
    el2.remove();
  });

  test("the currently-selected op is always present in the dropdown (even if target isn't numeric)", async () => {
    const el2 = await mountWithHass(
      // kind is ">" but target is non-numeric — guard against blank dropdown.
      { kind: ">", entity_id: "person.bob", states: ["10"] },
      { "person.bob": { state: "home", attributes: {} } },
    );
    const opts = el2._opSchema()[0].selector.select.options.map((o: any) => o.value);
    expect(opts).toContain(">");
    el2.remove();
  });

  test("changing the entity to a non-numeric target auto-flips a numeric op back to 'is'", async () => {
    const el2 = await mountWithHass(
      { kind: ">", entity_id: "sensor.temp", states: ["10"] },
      {
        "sensor.temp": { state: "21.4", attributes: {} },
        "person.bob":  { state: "home",  attributes: {} },
      },
    );
    let captured: any;
    el2.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el2._setEntity("person.bob");
    expect(captured.entity_id).toBe("person.bob");
    expect(captured.kind).toBe("is");
    el2.remove();
  });

  test("changing the attribute to a non-numeric one auto-flips numeric op back to 'is'", async () => {
    const el2 = await mountWithHass(
      { kind: ">", entity_id: "light.x", attribute: "brightness", states: ["100"] },
      { "light.x": { state: "on", attributes: { brightness: 200, friendly_name: "Lamp" } } },
    );
    let captured: any;
    el2.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el2._setAttribute("friendly_name");
    expect(captured.kind).toBe("is");
    el2.remove();
  });

  // --- single value row for numeric ops ---------------------------------

  test("numeric op renders a single value row (no trailing add-row)", async () => {
    el = await mount({ kind: ">", entity_id: "sensor.temp", states: ["10"] });
    const rows = el.shadowRoot.querySelectorAll(".value-row");
    expect(rows).toHaveLength(1);
    expect(rows[0].getAttribute("data-row")).toBe("0");
  });

  test("setting the value to empty for a numeric op keeps the row (states=[''])", async () => {
    el = await mount({ kind: ">", entity_id: "sensor.temp", states: ["10"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._setValueAt(0, "");
    expect(captured.states).toEqual([""]);
  });

  test("emits value-changed when op flips", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._setOp("is_not");
    expect(captured.kind).toBe("is_not");
  });

  test("renders N value rows plus one trailing empty add-row", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on", "off"] });
    const rows = el.shadowRoot.querySelectorAll(".value-row");
    expect(rows.length).toBe(3); // 2 stored + 1 add-row
    // Stored rows have data-row indices 0, 1; the add row uses -1.
    expect(rows[0].getAttribute("data-row")).toBe("0");
    expect(rows[1].getAttribute("data-row")).toBe("1");
    expect(rows[2].getAttribute("data-row")).toBe("-1");
  });

  test("_addValue appends to the states list", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._addValue("off");
    expect(captured.states).toEqual(["on", "off"]);
  });

  test("_addValue ignores an empty string (don't add blank values)", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let fired = false;
    el.addEventListener("value-changed", () => { fired = true; });
    el._addValue("");
    expect(fired).toBe(false);
  });

  test("_setValueAt replaces a value at an index", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on", "off"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._setValueAt(1, "unavailable");
    expect(captured.states).toEqual(["on", "unavailable"]);
  });

  test("_setValueAt with an empty string removes that row", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on", "off"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._setValueAt(0, "");
    expect(captured.states).toEqual(["off"]);
  });

  test("_removeValueAt deletes the row", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on", "off", "unavailable"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._removeValueAt(1);
    expect(captured.states).toEqual(["on", "unavailable"]);
  });

  test("setting an entity_id clears both states and attribute", async () => {
    el = await mount({
      kind: "is", entity_id: "media_player.a", attribute: "source", states: ["Spotify"],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._setEntity("light.kitchen");
    expect(captured.entity_id).toBe("light.kitchen");
    expect(captured.states).toEqual([]);
    expect(captured.attribute).toBeNull();
  });

  test("_setAttribute('') normalises empty string to null on emit", async () => {
    el = await mount({
      kind: "is", entity_id: "x", attribute: "source", states: ["Spotify"],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._setAttribute("");
    expect(captured.attribute).toBeNull();
  });

  test("_setAttribute('source') stores the attribute name", async () => {
    el = await mount({ kind: "is", entity_id: "media_player.x", states: [] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._setAttribute("source");
    expect(captured.attribute).toBe("source");
  });

  test("_forSchema is an ha-form duration selector (days disabled, not required)", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    const schema = el._forSchema();
    expect(schema[0].name).toBe("duration");
    // Optional → no `required: true` so the field is blank by default.
    expect(schema[0].required).toBeFalsy();
    expect(schema[0].selector.duration.enable_day).toBe(false);
  });

  test("_forData maps storage {h,m,s} to ha-form {hours,minutes,seconds}", async () => {
    el = await mount({
      kind: "is", entity_id: "x", states: ["on"], for: { h: 1, m: 30, s: 15 },
    });
    expect(el._forData()).toEqual({ duration: { hours: 1, minutes: 30, seconds: 15 } });
  });

  test("_forData with no `for` falls back to {0,0,0} (blank display)", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    expect(el._forData()).toEqual({ duration: { hours: 0, minutes: 0, seconds: 0 } });
  });

  test("setting duration to {0,0,0} normalises to null on emit", async () => {
    el = await mount({
      kind: "is", entity_id: "x", states: ["on"], for: { h: 0, m: 5, s: 0 },
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._setForFromHaForm({ hours: 0, minutes: 0, seconds: 0 });
    expect(captured.for).toBeNull();
  });

  test("setting a non-zero duration stores it as {h,m,s}", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._setForFromHaForm({ hours: 0, minutes: 5, seconds: 0 });
    expect(captured.for).toEqual({ h: 0, m: 5, s: 0 });
  });
});
