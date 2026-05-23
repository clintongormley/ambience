import { describe, test, expect, afterEach } from "vitest";
import "../frontend/src/views/weather-predicate-input";
import type { WeatherPredicate } from "../frontend/src/types";

async function mount(value: WeatherPredicate = null): Promise<any> {
  const el: any = document.createElement("ambience-weather-predicate-input");
  el.value = value;
  el.hass = {};
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("ambience-weather-predicate-input", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("shows Conditions and Thresholds sections", async () => {
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("Conditions");
    expect(el.shadowRoot.textContent).toContain("Thresholds");
  });

  test("_conditionsSchema lists the 15 HA conditions as a multi-select", async () => {
    el = await mount();
    const schema = el._conditionsSchema();
    expect(schema[0].selector.select.multiple).toBe(true);
    expect(schema[0].selector.select.options).toHaveLength(15);
  });

  test("setting conditions emits value-changed", async () => {
    el = await mount();
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => { detail = (e as CustomEvent).detail; });
    el._setConditions(["rainy", "pouring"]);
    expect(detail.value).toEqual({ conditions: ["rainy", "pouring"], thresholds: [] });
  });

  test("adding a threshold appends a default row", async () => {
    el = await mount();
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => { detail = (e as CustomEvent).detail; });
    el._addThreshold();
    expect(detail.value).toEqual({
      conditions: [],
      thresholds: [{ attribute: "temperature", op: "<", value: 0 }],
    });
  });

  test("updating and removing a threshold", async () => {
    el = await mount({ conditions: [], thresholds: [{ attribute: "temperature", op: "<", value: 5 }] });
    el._updateThreshold(0, { attribute: "humidity", op: ">=", value: 80 });
    expect(el.value).toEqual({ conditions: [], thresholds: [{ attribute: "humidity", op: ">=", value: 80 }] });
    el._removeThreshold(0);
    expect(el.value).toBeNull();
  });

  test("empty conditions and thresholds emit null", async () => {
    el = await mount({ conditions: ["rainy"], thresholds: [] });
    el._setConditions([]);
    expect(el.value).toBeNull();
  });
});
