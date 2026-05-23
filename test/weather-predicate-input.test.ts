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
});
