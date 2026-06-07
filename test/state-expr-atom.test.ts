import { afterEach, describe, expect, test, vi } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  getKnownStates: vi.fn(async () => ({ states: ["on", "off"] })),
  getKnownAttributeValues: vi.fn(async () => ({ values: [] })),
}));

import "../frontend/src/views/state-expr-atom";
import { getKnownAttributeValues, getKnownStates } from "../frontend/src/api.js";
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

  test("_attributeSchema's first option is the 'State' sentinel (non-empty value)", async () => {
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
    // First option represents "compare entity.state". ha-form's select
    // doesn't render value: "" as a selectable item, so we use a sentinel
    // value and translate at the boundary.
    expect(sel.options[0].label).toBe("State");
    expect(sel.options[0].value).not.toBe("");
    // ha-form's custom_value combobox displays the option's VALUE, not its
    // label. So every option's value must equal its (human) label, otherwise
    // selecting an attribute shows the raw key. Attributes are sorted by key.
    expect(sel.options.slice(1)).toEqual([
      { value: "Friendly name", label: "Friendly name" },
      { value: "Source", label: "Source" },
      { value: "Volume level", label: "Volume level" },
    ]);
    el2.remove();
  });

  test("_attributeData translates a stored attribute key to its human label so the combobox shows the label", async () => {
    const el2: any = document.createElement("ambience-state-expr-atom");
    el2.value = { kind: "is", entity_id: "media_player.x", attribute: "source", states: [] };
    el2.hass = {
      states: { "media_player.x": { attributes: { source: "Spotify", volume_level: 0.5 } } },
    };
    document.body.appendChild(el2);
    await el2.updateComplete;
    expect(el2._attributeData().attribute).toBe("Source");
    el2.remove();
  });

  test("_setAttributeFromHaForm maps a human label back to the raw attribute key", async () => {
    const el2: any = document.createElement("ambience-state-expr-atom");
    el2.value = { kind: "is", entity_id: "media_player.x", states: [] };
    el2.hass = {
      states: { "media_player.x": { attributes: { source: "Spotify", volume_level: 0.5 } } },
    };
    document.body.appendChild(el2);
    await el2.updateComplete;
    let captured: any;
    el2.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el2._setAttributeFromHaForm("Source");
    expect(captured.attribute).toBe("source");
    el2.remove();
  });

  test("when attribute is null, _attributeData carries the State-sentinel so the dropdown renders 'State'", async () => {
    el = await mount({ kind: "is", entity_id: "x", attribute: null, states: ["on"] });
    const data = el._attributeData();
    const sentinel = el._attributeSchema()[0].selector.select.options[0].value;
    expect(data.attribute).toBe(sentinel);
  });

  test("when attribute is 'source', _attributeData carries 'source'", async () => {
    el = await mount({ kind: "is", entity_id: "x", attribute: "source", states: [] });
    expect(el._attributeData().attribute).toBe("source");
  });

  test("selecting the State sentinel via _setAttributeFromHaForm clears the attribute (null)", async () => {
    el = await mount({ kind: "is", entity_id: "x", attribute: "source", states: ["Spotify"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    const sentinel = el._attributeSchema()[0].selector.select.options[0].value;
    el._setAttributeFromHaForm(sentinel);
    expect(captured.attribute).toBeNull();
  });

  test("selecting a real attribute value via _setAttributeFromHaForm stores it as-is", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: [] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._setAttributeFromHaForm("brightness");
    expect(captured.attribute).toBe("brightness");
  });

  test("the attribute field is labelled 'Where' (not 'Attribute')", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    expect(el.shadowRoot.textContent).toContain("Where");
    expect(el.shadowRoot.textContent).not.toContain("Attribute (optional)");
  });

  test("_attributeSchema offers only the 'State' sentinel when the entity is not in hass.states", async () => {
    const el2: any = document.createElement("ambience-state-expr-atom");
    el2.value = { kind: "is", entity_id: "media_player.does_not_exist", states: [] };
    el2.hass = { states: {} };
    document.body.appendChild(el2);
    await el2.updateComplete;
    const opts = el2._attributeSchema()[0].selector.select.options;
    expect(opts).toHaveLength(1);
    expect(opts[0].label).toBe("State");
    el2.remove();
  });

  test("_attributeSchema offers only the 'State' sentinel when entity_id is unset", async () => {
    el = await mount({ kind: "is", entity_id: "", states: [] });
    const opts = el._attributeSchema()[0].selector.select.options;
    expect(opts).toHaveLength(1);
    expect(opts[0].label).toBe("State");
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

  test("op dropdown for a numeric state shows ONLY the numeric ops (no is/is_not)", async () => {
    const el2 = await mountWithHass(
      // Pre-flip to a numeric op so the dropdown matches the kind.
      { kind: ">", entity_id: "sensor.temp", states: ["10"] },
      { "sensor.temp": { state: "21.4", attributes: {} } },
    );
    const opts = el2._opSchema()[0].selector.select.options.map((o: any) => o.value);
    expect(opts).toEqual([">", ">=", "<", "<="]);
    el2.remove();
  });

  test("attribute mode: numeric ops only when the attribute is a number", async () => {
    const el2 = await mountWithHass(
      { kind: ">", entity_id: "light.x", attribute: "brightness", states: ["100"] },
      { "light.x": { state: "on", attributes: { brightness: 200 } } },
    );
    const opts = el2._opSchema()[0].selector.select.options.map((o: any) => o.value);
    expect(opts).toEqual([">", ">=", "<", "<="]);
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
        "person.bob": { state: "home", attributes: {} },
      },
    );
    let captured: any;
    el2.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    await el2._setEntity("person.bob");
    expect(captured.entity_id).toBe("person.bob");
    expect(captured.kind).toBe("is");
    el2.remove();
  });

  test("changing the entity to a numeric target auto-flips is/is_not to '>'", async () => {
    const el2 = await mountWithHass(
      { kind: "is", entity_id: "person.bob", states: ["home"] },
      {
        "person.bob": { state: "home", attributes: {} },
        "sensor.temp": { state: "21.4", attributes: {} },
      },
    );
    let captured: any;
    el2.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    await el2._setEntity("sensor.temp");
    expect(captured.kind).toBe(">");
    el2.remove();
  });

  test("changing the attribute to a non-numeric one auto-flips numeric op back to 'is'", async () => {
    const el2 = await mountWithHass(
      { kind: ">", entity_id: "light.x", attribute: "brightness", states: ["100"] },
      { "light.x": { state: "on", attributes: { brightness: 200, friendly_name: "Lamp" } } },
    );
    let captured: any;
    el2.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el2._setAttribute("friendly_name");
    expect(captured.kind).toBe("is");
    el2.remove();
  });

  test("changing the attribute to a numeric one auto-flips is/is_not to '>'", async () => {
    const el2 = await mountWithHass(
      { kind: "is", entity_id: "light.x", attribute: "source", states: ["Spotify"] },
      { "light.x": { state: "on", attributes: { source: "Spotify", brightness: 200 } } },
    );
    let captured: any;
    el2.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el2._setAttribute("brightness");
    expect(captured.kind).toBe(">");
    el2.remove();
  });

  test("numeric op: _valueSchema is a number selector (not a select combobox)", async () => {
    el = await mount({ kind: ">", entity_id: "sensor.temp", states: ["10"] });
    const schema = el._valueSchema();
    expect(schema[0].name).toBe("value");
    expect(schema[0].selector.number).toBeDefined();
    expect(schema[0].selector.select).toBeUndefined();
  });

  test("non-numeric op: _valueSchema is still the combobox select with custom_value", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    const sel = el._valueSchema()[0].selector.select;
    expect(sel.mode).toBe("dropdown");
    expect(sel.custom_value).toBe(true);
  });

  test("attribute mode: value options come from getKnownAttributeValues (backend)", async () => {
    vi.mocked(getKnownAttributeValues).mockResolvedValue({
      values: ["None", "Rainbow", "Custom"],
    });
    const el2: any = document.createElement("ambience-state-expr-atom");
    el2.value = { kind: "is", entity_id: "light.lamp", attribute: "effect", states: [] };
    el2.hass = { states: { "light.lamp": { attributes: { effect: "Custom" } } } };
    document.body.appendChild(el2);
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;
    const opts = el2
      ._valueSchema()[0]
      .selector.select.options.map((o: { value: string }) => o.value);
    expect(opts).toEqual(["None", "Rainbow", "Custom"]);
    expect(getKnownAttributeValues).toHaveBeenCalledWith(el2.hass, "light.lamp", "effect");
    el2.remove();
  });

  test("_attributeSchema labels attribute names in human-readable form", async () => {
    const el2: any = document.createElement("ambience-state-expr-atom");
    el2.value = { kind: "is", entity_id: "climate.x", states: [] };
    el2.hass = {
      states: { "climate.x": { attributes: { fan_mode: "auto", hvac_action: "idle" } } },
    };
    document.body.appendChild(el2);
    await el2.updateComplete;
    const opts = el2._attributeSchema()[0].selector.select.options;
    const byLabel = (l: string) => opts.find((o: { label: string }) => o.label === l);
    // Value and label are both the humanised name (ha-form's custom_value
    // combobox displays the value, so they must match).
    expect(byLabel("Fan mode")).toEqual({ value: "Fan mode", label: "Fan mode" });
    expect(byLabel("Hvac action")).toEqual({ value: "Hvac action", label: "Hvac action" });
    el2.remove();
  });

  test("attribute mode: value options are empty when the backend returns none", async () => {
    vi.mocked(getKnownAttributeValues).mockResolvedValue({ values: [] });
    const el2: any = document.createElement("ambience-state-expr-atom");
    el2.value = { kind: "is", entity_id: "x", attribute: "missing_attr", states: [] };
    el2.hass = { states: { x: { attributes: {} } } };
    document.body.appendChild(el2);
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;
    expect(el2._valueSchema()[0].selector.select.options).toEqual([]);
    el2.remove();
  });

  test("the value section label is always 'Value' (regardless of op or mode)", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    expect(el.shadowRoot.textContent).toContain("Value");
    el.remove();
    el = await mount({ kind: ">", entity_id: "sensor.temp", states: ["10"] });
    expect(el.shadowRoot.textContent).toContain("Value");
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
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._setValueAt(0, "");
    expect(captured.states).toEqual([""]);
  });

  test("emits value-changed when op flips", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
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
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._addValue("off");
    expect(captured.states).toEqual(["on", "off"]);
  });

  test("_addValue ignores an empty string (don't add blank values)", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let fired = false;
    el.addEventListener("value-changed", () => {
      fired = true;
    });
    el._addValue("");
    expect(fired).toBe(false);
  });

  test("_setValueAt replaces a value at an index", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on", "off"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._setValueAt(1, "unavailable");
    expect(captured.states).toEqual(["on", "unavailable"]);
  });

  test("_setValueAt with an empty string removes that row", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on", "off"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._setValueAt(0, "");
    expect(captured.states).toEqual(["off"]);
  });

  test("state-mode value options use HA's formatted label as both value and label", async () => {
    const el2: any = document.createElement("ambience-state-expr-atom");
    el2.value = { kind: "is", entity_id: "binary_sensor.x", states: [] };
    el2.hass = {
      states: { "binary_sensor.x": { state: "on", attributes: {} } },
      formatEntityState: (_s: unknown, v: string) => ({ on: "Detected", off: "Clear" })[v] ?? v,
    };
    document.body.appendChild(el2);
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;
    expect(el2._valueSchema()[0].selector.select.options).toEqual([
      { value: "Detected", label: "Detected" },
      { value: "Clear", label: "Clear" },
    ]);
    el2.remove();
  });

  test("attribute-mode value options use formatEntityAttributeValue label (value===label)", async () => {
    vi.mocked(getKnownAttributeValues).mockResolvedValue({ values: ["nvidia", "ps5"] });
    const el2: any = document.createElement("ambience-state-expr-atom");
    el2.value = { kind: "is", entity_id: "remote.cine", attribute: "current_activity", states: [] };
    el2.hass = {
      states: { "remote.cine": { state: "on", attributes: { current_activity: "nvidia" } } },
      formatEntityAttributeValue: (_s: unknown, _a: string, v: string) =>
        ({ nvidia: "Nvidia (TV)", ps5: "PlayStation 5 (TV)" })[v] ?? v,
    };
    document.body.appendChild(el2);
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;
    expect(el2._valueSchema()[0].selector.select.options).toEqual([
      { value: "Nvidia (TV)", label: "Nvidia (TV)" },
      { value: "PlayStation 5 (TV)", label: "PlayStation 5 (TV)" },
    ]);
    el2.remove();
  });

  test("_valueDisplay translates a stored raw value to its formatted label", async () => {
    const el2: any = document.createElement("ambience-state-expr-atom");
    el2.value = { kind: "is", entity_id: "binary_sensor.x", states: ["on"] };
    el2.hass = {
      states: { "binary_sensor.x": { state: "on", attributes: {} } },
      formatEntityState: (_s: unknown, v: string) => (v === "on" ? "Detected" : v),
    };
    document.body.appendChild(el2);
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;
    expect(el2._valueDisplay("on")).toBe("Detected");
    el2.remove();
  });

  test("_addValueFromHaForm maps a formatted label back to the raw value before storing", async () => {
    const el2: any = document.createElement("ambience-state-expr-atom");
    el2.value = { kind: "is", entity_id: "binary_sensor.x", states: [] };
    el2.hass = {
      states: { "binary_sensor.x": { state: "on", attributes: {} } },
      formatEntityState: (_s: unknown, v: string) => ({ on: "Detected", off: "Clear" })[v] ?? v,
    };
    document.body.appendChild(el2);
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;
    let captured: any;
    el2.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el2._addValueFromHaForm("Detected");
    expect(captured.states).toEqual(["on"]);
    el2.remove();
  });

  test("_setValueFromHaForm maps a formatted label back to the raw value at an index", async () => {
    const el2: any = document.createElement("ambience-state-expr-atom");
    el2.value = { kind: "is", entity_id: "binary_sensor.x", states: ["on"] };
    el2.hass = {
      states: { "binary_sensor.x": { state: "on", attributes: {} } },
      formatEntityState: (_s: unknown, v: string) => ({ on: "Detected", off: "Clear" })[v] ?? v,
    };
    document.body.appendChild(el2);
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;
    let captured: any;
    el2.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el2._setValueFromHaForm(0, "Clear");
    expect(captured.states).toEqual(["off"]);
    el2.remove();
  });

  test("_addValueFromHaForm keeps an unknown custom value verbatim", async () => {
    const el2: any = document.createElement("ambience-state-expr-atom");
    el2.value = { kind: "is", entity_id: "binary_sensor.x", states: [] };
    el2.hass = {
      states: { "binary_sensor.x": { state: "on", attributes: {} } },
      formatEntityState: (_s: unknown, v: string) => ({ on: "Detected", off: "Clear" })[v] ?? v,
    };
    document.body.appendChild(el2);
    await el2.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el2.updateComplete;
    let captured: any;
    el2.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el2._addValueFromHaForm("custom_state_we_dont_know");
    expect(captured.states).toEqual(["custom_state_we_dont_know"]);
    el2.remove();
  });

  test("_removeValueAt deletes the row", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on", "off", "unavailable"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._removeValueAt(1);
    expect(captured.states).toEqual(["on", "unavailable"]);
  });

  test("setting an entity_id clears the attribute and any value the new entity can't take", async () => {
    // getKnownStates is mocked to return ["on","off"]; "Spotify" isn't among
    // them, so it's dropped. The attribute is cleared here because the new
    // entity (light.kitchen) doesn't expose `source`.
    el = await mount({
      kind: "is",
      entity_id: "media_player.a",
      attribute: "source",
      states: ["Spotify"],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    await el._setEntity("light.kitchen");
    expect(captured.entity_id).toBe("light.kitchen");
    expect(captured.states).toEqual([]);
    expect(captured.attribute).toBeNull();
  });

  test("changing the entity keeps a value the new entity still supports", async () => {
    // Both presence sensors share on/off (the default getKnownStates mock), so
    // a "Detected"/on match carries over instead of being wiped.
    const el2 = await mountWithHass(
      { kind: "is", entity_id: "binary_sensor.presence_a", states: ["on"] },
      {
        "binary_sensor.presence_a": { state: "on", attributes: {} },
        "binary_sensor.presence_b": { state: "off", attributes: {} },
      },
    );
    let captured: any;
    el2.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    await el2._setEntity("binary_sensor.presence_b");
    expect(captured.entity_id).toBe("binary_sensor.presence_b");
    expect(captured.states).toEqual(["on"]);
    el2.remove();
  });

  test("changing the entity keeps only the supported subset of selected values", async () => {
    vi.mocked(getKnownStates).mockResolvedValueOnce({ states: ["on", "off"] });
    const el2 = await mountWithHass(
      { kind: "is", entity_id: "binary_sensor.a", states: ["on", "jammed"] },
      {
        "binary_sensor.a": { state: "on", attributes: {} },
        "binary_sensor.b": { state: "off", attributes: {} },
      },
    );
    let captured: any;
    el2.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    await el2._setEntity("binary_sensor.b");
    expect(captured.states).toEqual(["on"]);
    el2.remove();
  });

  test("changing the entity drops a value the new entity does not support", async () => {
    const el2 = await mountWithHass(
      { kind: "is", entity_id: "binary_sensor.x", states: ["on"] },
      {
        "binary_sensor.x": { state: "on", attributes: {} },
        "person.bob": { state: "home", attributes: {} },
      },
    );
    vi.mocked(getKnownStates).mockResolvedValueOnce({ states: ["home", "away"] });
    let captured: any;
    el2.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    await el2._setEntity("person.bob");
    expect(captured.entity_id).toBe("person.bob");
    expect(captured.states).toEqual([]);
    expect(captured.attribute).toBeNull();
    el2.remove();
  });

  test("changing the entity keeps the attribute (and its value) when the new entity also has it", async () => {
    const el2 = await mountWithHass(
      { kind: "is", entity_id: "media_player.a", attribute: "source", states: ["Spotify"] },
      {
        "media_player.a": { state: "playing", attributes: { source: "Spotify" } },
        "media_player.b": { state: "playing", attributes: { source: "Radio" } },
      },
    );
    // The new entity's source list still includes the matched value.
    vi.mocked(getKnownAttributeValues).mockResolvedValueOnce({ values: ["Spotify", "Radio"] });
    let captured: any;
    el2.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    await el2._setEntity("media_player.b");
    expect(captured.entity_id).toBe("media_player.b");
    expect(captured.attribute).toBe("source");
    expect(captured.states).toEqual(["Spotify"]);
    el2.remove();
  });

  test("changing the entity keeps the attribute but drops a value the new entity's attribute can't take", async () => {
    const el2 = await mountWithHass(
      { kind: "is", entity_id: "media_player.a", attribute: "source", states: ["Spotify"] },
      {
        "media_player.a": { state: "playing", attributes: { source: "Spotify" } },
        "media_player.b": { state: "playing", attributes: { source: "Radio" } },
      },
    );
    // The new entity has `source`, but Spotify isn't one of its sources.
    vi.mocked(getKnownAttributeValues).mockResolvedValueOnce({ values: ["Radio", "TV"] });
    let captured: any;
    el2.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    await el2._setEntity("media_player.b");
    expect(captured.attribute).toBe("source");
    expect(captured.states).toEqual([]);
    el2.remove();
  });

  test("changing the entity clears the attribute (and value) when the new entity lacks it", async () => {
    const el2 = await mountWithHass(
      { kind: "is", entity_id: "media_player.a", attribute: "source", states: ["Spotify"] },
      {
        "media_player.a": { state: "playing", attributes: { source: "Spotify" } },
        "light.kitchen": { state: "on", attributes: { brightness: 200 } },
      },
    );
    let captured: any;
    el2.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    await el2._setEntity("light.kitchen");
    expect(captured.attribute).toBeNull();
    expect(captured.states).toEqual([]);
    el2.remove();
  });

  test("a superseded entity change doesn't overwrite a newer one when fetches resolve out of order", async () => {
    const el2 = await mountWithHass(
      { kind: "is", entity_id: "binary_sensor.a", states: ["on"] },
      {
        "binary_sensor.a": { state: "on", attributes: {} },
        "binary_sensor.b": { state: "off", attributes: {} },
        "binary_sensor.c": { state: "on", attributes: {} },
      },
    );
    // Hand-controlled fetches so the earlier (b) resolves AFTER the later (c).
    let resolveB!: (v: { states: string[] }) => void;
    let resolveC!: (v: { states: string[] }) => void;
    const bP = new Promise<{ states: string[] }>((r) => {
      resolveB = r;
    });
    const cP = new Promise<{ states: string[] }>((r) => {
      resolveC = r;
    });
    vi.mocked(getKnownStates).mockReturnValueOnce(bP).mockReturnValueOnce(cP);
    const emits: any[] = [];
    el2.addEventListener("value-changed", (e: Event) => {
      emits.push((e as CustomEvent).detail.value);
    });
    const p1 = el2._setEntity("binary_sensor.b");
    const p2 = el2._setEntity("binary_sensor.c");
    resolveC({ states: ["on", "off"] });
    resolveB({ states: ["on", "off"] });
    await Promise.all([p1, p2]);
    // The stale "b" emit must be dropped; only the newest selection wins.
    expect(emits.every((v) => v.entity_id !== "binary_sensor.b")).toBe(true);
    expect(emits.at(-1).entity_id).toBe("binary_sensor.c");
    el2.remove();
  });

  test("_setAttribute('') normalises empty string to null on emit", async () => {
    el = await mount({
      kind: "is",
      entity_id: "x",
      attribute: "source",
      states: ["Spotify"],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._setAttribute("");
    expect(captured.attribute).toBeNull();
  });

  test("_setAttribute('source') stores the attribute name", async () => {
    el = await mount({ kind: "is", entity_id: "media_player.x", states: [] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
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
      kind: "is",
      entity_id: "x",
      states: ["on"],
      for: { h: 1, m: 30, s: 15 },
    });
    expect(el._forData()).toEqual({ duration: { hours: 1, minutes: 30, seconds: 15 } });
  });

  test("_forData with no `for` falls back to {0,0,0} (blank display)", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    expect(el._forData()).toEqual({ duration: { hours: 0, minutes: 0, seconds: 0 } });
  });

  test("setting duration to {0,0,0} normalises to null on emit", async () => {
    el = await mount({
      kind: "is",
      entity_id: "x",
      states: ["on"],
      for: { h: 0, m: 5, s: 0 },
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._setForFromHaForm({ hours: 0, minutes: 0, seconds: 0 });
    expect(captured.for).toBeNull();
  });

  test("setting a non-zero duration stores it as {h,m,s}", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._setForFromHaForm({ hours: 0, minutes: 5, seconds: 0 });
    expect(captured.for).toEqual({ h: 0, m: 5, s: 0 });
  });
});
