import { describe, expect, test } from "vitest";
import type { LuxPredicate, LuxRangeStoreView } from "../frontend/src/types";
import { isLuxCandidate, luxPredicateError } from "../frontend/src/views/lux-input";

const luxRanges: LuxRangeStoreView = {
  builtins: {
    dark: { max: 10 },
    dim: { min: 10, max: 50 },
    bright: { min: 300, max: 1000 },
  },
  custom: { gloomy: { min: 5, max: 30, label: "Gloomy" } },
  hidden: ["dim"],
};

async function mount(value: LuxPredicate | null): Promise<any> {
  const el: any = document.createElement("ambience-lux-input");
  el.value = value;
  el.hass = {};
  el.luxRanges = luxRanges;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function capture(el: HTMLElement): () => any {
  let v: any;
  el.addEventListener("value-changed", (e: Event) => {
    v = (e as CustomEvent).detail.value;
  });
  return () => v;
}

describe("ambience-lux-input", () => {
  test("clearing all sensors collapses the predicate to null (condition removed)", async () => {
    // Empty sensors is a wildcard regardless of the range/band, so emit null and
    // let the scene editor drop the condition (matches the unavailable widget).
    const el = await mount({ sensors: ["sensor.a"], range: "dark" });
    const v = capture(el);
    el._setSensors([]);
    expect(v()).toBeNull();
    el.remove();
  });

  test("a band chosen before picking sensors survives adding sensors", async () => {
    // The band/negate controls render with no sensors yet; a band picked there
    // must not be discarded when the user then selects a sensor.
    const el = await mount(null);
    const got = capture(el);
    el._setBand("bright");
    el._setSensors(["sensor.a"]);
    expect(got()).toEqual({ sensors: ["sensor.a"], range: "bright" });
    el.remove();
  });

  test("luxPredicateError rejects a non-integer inline bound (matches the backend)", () => {
    // The backend raises lux_not_integer; the FE save-gate must catch it inline
    // instead of letting it through to a generic save error.
    expect(luxPredicateError({ min: 12.5, max: 100 })).toContain("whole number");
    expect(luxPredicateError({ min: 0, max: 99.9 })).toContain("whole number");
    expect(luxPredicateError({ min: 10, max: 100 })).toBeNull();
  });

  test.each([
    [
      "illuminance class, unavailable",
      { state: "unavailable", attributes: { device_class: "illuminance" } },
      true,
    ],
    ["lx unit, no class", { state: "unknown", attributes: { unit_of_measurement: "lx" } }, true],
    ["bare numeric state", { state: "12.5", attributes: {} }, true],
    [
      "measurement state_class, offline",
      { state: "unavailable", attributes: { state_class: "measurement" } },
      true,
    ],
    ["text state", { state: "cloudy", attributes: {} }, false],
    ["unavailable, nothing else", { state: "unavailable", attributes: {} }, false],
    ["missing", undefined, false],
  ])("isLuxCandidate: %s", (_label, st, expected) => {
    expect(isLuxCandidate(st as never)).toBe(expected);
  });

  test("sensor picker lists numeric sensors plus the current selection", async () => {
    const el = await mount({ sensors: ["sensor.gone"], range: "dark" });
    el.hass = {
      ...el.hass,
      states: {
        "sensor.lux": { state: "40", attributes: { device_class: "illuminance" } },
        "sensor.temp": { state: "21.5", attributes: {} },
        "sensor.text": { state: "foo", attributes: {} },
        "binary_sensor.n": { state: "1", attributes: {} },
      },
    } as never;
    const sel = el._sensorSchema()[0].selector.entity;
    expect(sel.domain).toBe("sensor");
    expect(sel.multiple).toBe(true);
    expect(sel.include_entities).toEqual(["sensor.gone", "sensor.lux", "sensor.temp"]);
    el.remove();
  });

  test("candidate list is cached per hass.states identity", async () => {
    // HA replaces `hass` on every state tick; rescanning every entity per render
    // is the thing being avoided, so a same-states call must reuse the list.
    const el = await mount({ sensors: ["sensor.gone"], range: "dark" });
    const states = { "sensor.lux": { state: "40", attributes: { device_class: "illuminance" } } };
    el.hass = { ...el.hass, states } as never;
    const first = el._sensorSchema()[0].selector.entity.include_entities;
    expect(el._sensorSchema()[0].selector.entity.include_entities).toBe(first);

    el.hass = {
      ...el.hass,
      states: { ...states, "sensor.b": { state: "7", attributes: {} } },
    } as never;
    const second = el._sensorSchema()[0].selector.entity.include_entities;
    expect(second).not.toBe(first);
    expect(second).toEqual(["sensor.b", "sensor.gone", "sensor.lux"]);
    el.remove();
  });

  test("sensor picker falls back to the plain sensor selector when nothing qualifies", async () => {
    const el = await mount({ sensors: [], range: "dark" });
    el.hass = { ...el.hass, states: {} } as never;
    const sel = el._sensorSchema()[0].selector.entity;
    expect(sel).toEqual({ domain: "sensor", multiple: true });
    el.remove();
  });

  test("effective range ids exclude hidden built-ins and include custom-only", async () => {
    const el = await mount({ sensors: ["sensor.a"], range: "dark" });
    expect(el._effectiveRangeIds()).toEqual(["dark", "bright", "gloomy"]);
    el.remove();
  });

  test("quant control is hidden for a single sensor, shown for multiple", async () => {
    const one = await mount({ sensors: ["sensor.a"], range: "dark" });
    expect(one._showQuant()).toBe(false);
    one.remove();
    const two = await mount({ sensors: ["sensor.a", "sensor.b"], range: "dark" });
    expect(two._showQuant()).toBe(true);
    two.remove();
  });

  test("selecting a named range emits range and drops min/max", async () => {
    const el = await mount({ sensors: ["sensor.a"], min: 0, max: 100 });
    const got = capture(el);
    el._setBand("bright");
    expect(got()).toEqual({ sensors: ["sensor.a"], range: "bright" });
    el.remove();
  });

  test("switching to custom emits a min/max band and drops range", async () => {
    const el = await mount({ sensors: ["sensor.a"], range: "dark" });
    const got = capture(el);
    el._setBand("__custom__");
    expect(got().range).toBeUndefined();
    expect(got().min).toBe(0);
    el._setMax(500);
    expect(got()).toEqual({ sensors: ["sensor.a"], min: 0, max: 500 });
    el.remove();
  });

  test("clearing both bounds stays in custom mode (does not revert to a named range)", async () => {
    const el = await mount({ sensors: ["sensor.a"], min: 50, max: 300 });
    const got = capture(el);
    el._setMax(undefined);
    el._setMin(undefined);
    expect(got().range).toBeUndefined();
    expect(got().min).toBeUndefined();
    expect(got().max).toBeUndefined();
    el.remove();
  });

  test("quant 'all' is kept, 'any' is dropped", async () => {
    const el = await mount({ sensors: ["sensor.a", "sensor.b"], range: "dark" });
    const got = capture(el);
    el._setQuant("all");
    expect(got().quant).toBe("all");
    el._setQuant("any");
    expect(got().quant).toBeUndefined();
    el.remove();
  });

  test("selecting sensors keeps the chosen band", async () => {
    const el = await mount({ sensors: [], range: "bright" });
    const got = capture(el);
    el._setSensors(["sensor.a"]);
    expect(got()).toEqual({ sensors: ["sensor.a"], range: "bright" });
    el.remove();
  });

  test("'is not' (negate) is kept, 'is' is dropped", async () => {
    const el = await mount({ sensors: ["sensor.a"], range: "dark" });
    const got = capture(el);
    el._setNegate(true);
    expect(got()).toEqual({ sensors: ["sensor.a"], range: "dark", negate: true });
    el._setNegate(false);
    expect(got().negate).toBeUndefined();
    el.remove();
  });

  test("renders an is / is-not dropdown", async () => {
    const el = await mount({ sensors: ["sensor.a"], range: "dark" });
    expect(el.shadowRoot.querySelector("select.negate")).toBeTruthy();
    el.remove();
  });

  test("quant dropdown renders before the sensor picker", async () => {
    const el = await mount({ sensors: ["sensor.a", "sensor.b"], range: "dark" });
    const quant = el.shadowRoot.querySelector("select.quant");
    const sensors = el.shadowRoot.querySelector("[data-field='sensors']");
    expect(quant).toBeTruthy();
    expect(sensors).toBeTruthy();
    // quant precedes the sensor picker in document order
    expect(quant.compareDocumentPosition(sensors) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    el.remove();
  });
});
