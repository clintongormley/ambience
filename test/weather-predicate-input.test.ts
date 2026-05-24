import { describe, test, expect, afterEach } from "vitest";
import "../frontend/src/views/weather-predicate-input";
import type { WeatherGroup, WeatherPredicate } from "../frontend/src/types";

const TEST_GROUPS: WeatherGroup[] = [
  { id: "sunny", label: "Sunny", conditions: ["sunny"] },
  { id: "dim",   label: "Dim",   conditions: ["cloudy", "partlycloudy"] },
  { id: "wet",   label: "Wet",   conditions: ["rainy"] },
];

async function mount(value: WeatherPredicate = null, groups = TEST_GROUPS): Promise<any> {
  const el: any = document.createElement("ambience-weather-predicate-input");
  el.value = value;
  el.groups = groups;
  el.hass = {};
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("ambience-weather-predicate-input", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("shows Groups and Thresholds sections", async () => {
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("Groups");
    expect(el.shadowRoot.textContent).toContain("Thresholds");
  });

  test("_groupsSchema offers one option per configured group", async () => {
    el = await mount();
    const schema = el._groupsSchema();
    expect(schema[0].selector.select.multiple).toBe(true);
    expect(schema[0].selector.select.options).toEqual([
      { value: "sunny", label: "Sunny" },
      { value: "dim",   label: "Dim" },
      { value: "wet",   label: "Wet" },
    ]);
  });

  test("setting groups emits value-changed", async () => {
    el = await mount();
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => { detail = (e as CustomEvent).detail; });
    el._setGroups(["wet", "dim"]);
    expect(detail.value).toEqual({ groups: ["wet", "dim"], thresholds: [] });
  });

  test("adding a threshold appends a default row", async () => {
    el = await mount();
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => { detail = (e as CustomEvent).detail; });
    el._addThreshold();
    expect(detail.value).toEqual({
      groups: [],
      thresholds: [{ attribute: "temperature", op: "<", value: 0 }],
    });
  });

  test("updating and removing a threshold", async () => {
    el = await mount({ groups: [], thresholds: [{ attribute: "temperature", op: "<", value: 5 }] });
    el._updateThreshold(0, { attribute: "humidity", op: ">=", value: 80 });
    expect(el.value).toEqual({ groups: [], thresholds: [{ attribute: "humidity", op: ">=", value: 80 }] });
    el._removeThreshold(0);
    expect(el.value).toBeNull();
  });

  test("empty groups + thresholds emits null", async () => {
    el = await mount({ groups: ["wet"], thresholds: [] });
    el._setGroups([]);
    expect(el.value).toBeNull();
  });

  test("_attributeSchema is a required ha-form select(dropdown) listing all attributes", async () => {
    el = await mount({ groups: [], thresholds: [{ attribute: "temperature", op: "<", value: 0 }] });
    const schema = el._attributeSchema(0);
    expect(schema).toHaveLength(1);
    expect(schema[0].name).toBe("attribute");
    expect(schema[0].required).toBe(true); // no clear-X
    const sel = schema[0].selector.select;
    expect(sel.mode).toBe("dropdown");
    expect(sel.multiple).toBeFalsy();
    expect(sel.options.map((o: { value: string }) => o.value)).toEqual([
      "temperature", "apparent_temperature", "humidity", "wind_speed", "pressure",
    ]);
    // Labels resolved via i18n fallback (no hass set on this mount).
    expect(sel.options[0]).toEqual({ value: "temperature", label: "Temperature" });
  });

  test("_opSchema is a required ha-form select(dropdown) listing the four comparators", async () => {
    el = await mount({ groups: [], thresholds: [{ attribute: "temperature", op: "<", value: 0 }] });
    const schema = el._opSchema(0);
    expect(schema).toHaveLength(1);
    expect(schema[0].name).toBe("op");
    expect(schema[0].required).toBe(true); // no clear-X
    const sel = schema[0].selector.select;
    expect(sel.mode).toBe("dropdown");
    expect(sel.multiple).toBeFalsy();
    // Symbols themselves are the values; labels use the same ≤/≥ pretty-form
    // we use elsewhere in the summary.
    expect(sel.options).toEqual([
      { value: "<",  label: "<"  },
      { value: "<=", label: "≤" },
      { value: ">",  label: ">"  },
      { value: ">=", label: "≥" },
    ]);
  });

  test("_valueSchema is a required ha-form number(box) carrying the unit", async () => {
    el = await mount({ groups: [], thresholds: [{ attribute: "temperature", op: "<", value: 5 }] });
    const schema = el._valueSchema(0, "temperature");
    expect(schema).toHaveLength(1);
    expect(schema[0].name).toBe("value");
    expect(schema[0].required).toBe(true);
    const num = schema[0].selector.number;
    expect(num.mode).toBe("box");
    // Unit comes via weatherAttrUnit — temperature defaults to °C.
    expect(num.unit_of_measurement).toBe("°C");
  });

  test("_valueSchema unit follows hass.config.unit_system overrides", async () => {
    const el2: any = document.createElement("ambience-weather-predicate-input");
    el2.value = { groups: [], thresholds: [{ attribute: "temperature", op: "<", value: 5 }] };
    el2.groups = TEST_GROUPS;
    el2.hass = { config: { unit_system: { temperature: "°F" } } } as any;
    document.body.appendChild(el2);
    await el2.updateComplete;
    expect(el2._valueSchema(0, "temperature")[0].selector.number.unit_of_measurement).toBe("°F");
    el2.remove();
  });

  test("_valueSchema prefers the configured entity's pressure_unit over unit_system.pressure", async () => {
    // unit_system says "Pa" (SI base) but the entity reports values in hPa.
    // The schema should show hPa — what HA actually renders.
    const el2: any = document.createElement("ambience-weather-predicate-input");
    el2.value = { groups: [], thresholds: [{ attribute: "pressure", op: "<", value: 1013 }] };
    el2.groups = TEST_GROUPS;
    el2.weatherEntity = "weather.home";
    el2.hass = {
      config: { unit_system: { pressure: "Pa" } },
      states: { "weather.home": { attributes: { pressure_unit: "hPa" } } },
    } as any;
    document.body.appendChild(el2);
    await el2.updateComplete;
    expect(el2._valueSchema(0, "pressure")[0].selector.number.unit_of_measurement).toBe("hPa");
    el2.remove();
  });

  test("native fallback renders the unit symbol next to the value input", async () => {
    el = await mount({
      groups: [],
      thresholds: [
        { attribute: "temperature", op: "<", value: 5 },
        { attribute: "humidity", op: ">=", value: 80 },
      ],
    });
    const units = Array.from(el.shadowRoot.querySelectorAll(".threshold .unit"))
      .map((n: Element) => n.textContent?.trim() ?? "");
    // No hass.config → temperature default "°C", humidity always "%".
    expect(units).toEqual(["°C", "%"]);
  });

  test("native fallback unit follows hass.config.unit_system", async () => {
    const el2: any = document.createElement("ambience-weather-predicate-input");
    el2.value = { groups: [], thresholds: [{ attribute: "temperature", op: "<", value: 5 }] };
    el2.groups = TEST_GROUPS;
    el2.hass = { config: { unit_system: { temperature: "°F" } } } as any;
    document.body.appendChild(el2);
    await el2.updateComplete;
    const unit = el2.shadowRoot.querySelector(".threshold .unit")?.textContent?.trim();
    expect(unit).toBe("°F");
    el2.remove();
  });
});
