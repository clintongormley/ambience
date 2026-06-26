import { describe, expect, test } from "vitest";

import "../frontend/src/views/lux-input";
import type { LuxPredicate, LuxRangeStoreView } from "../frontend/src/types";

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
  test("sensor picker is a sensor entity selector filtered to illuminance", async () => {
    const el = await mount({ sensors: [], range: "dark" });
    const sel = el._sensorSchema()[0].selector.entity;
    expect(sel.domain).toBe("sensor");
    expect(sel.multiple).toBe(true);
    expect(sel.device_class).toEqual(["illuminance"]);
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
