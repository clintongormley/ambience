import { describe, test, expect, afterEach, vi, beforeEach } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  getWeatherConfig: vi.fn(async () => ({
    entity: null,
    groups: [
      { id: "sunny", label: "Sunny", conditions: ["sunny"] },
      { id: "wet",   label: "Wet",   conditions: ["rainy"] },
    ],
  })),
  saveWeatherConfig: vi.fn(async () => ({ ok: true, warnings: [] })),
}));

import "../frontend/src/views/weather-config";
import { saveWeatherConfig } from "../frontend/src/api.js";

describe("ambience-weather-config", () => {
  let el: any;
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => el?.remove());

  async function mount() {
    el = document.createElement("ambience-weather-config");
    el.hass = {};
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    return el;
  }

  test("renders the weather entity row and group rows", async () => {
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("Weather entity");
    expect(el.shadowRoot.textContent).toContain("Groups");
    expect(el.shadowRoot.textContent).toContain("Sunny");
    expect(el.shadowRoot.textContent).toContain("Wet");
  });

  test("changing the entity calls saveWeatherConfig with current groups", async () => {
    el = await mount();
    el._onEntityChange({ detail: { value: "weather.home" } });
    expect(saveWeatherConfig).toHaveBeenCalledWith(
      expect.anything(),
      "weather.home",
      el._config.groups,
    );
  });

  test("_addGroup appends a new group with a unique id", async () => {
    el = await mount();
    el._addGroup();
    const ids = el._config.groups.map((g: any) => g.id);
    expect(ids).toContain("group_1");
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("_nextGroupId picks the smallest free index", () => {
    const fn = (existing: any[]) => {
      const el2: any = document.createElement("ambience-weather-config");
      try {
        return el2._nextGroupId(existing);
      } finally {
        el2.remove?.();
      }
    };
    expect(fn([])).toBe("group_1");
    expect(fn([{ id: "group_1" }])).toBe("group_2");
    expect(fn([{ id: "group_2" }])).toBe("group_1");
    expect(fn([{ id: "wet" }])).toBe("group_1");
  });

  test("_updateGroup applies a label patch", async () => {
    el = await mount();
    el._updateGroup(0, { label: "Sun ☀" });
    expect(el._config.groups[0].label).toBe("Sun ☀");
  });

  test("_updateGroup toggles a condition on a group", async () => {
    el = await mount();
    const next = [...el._config.groups[0].conditions, "cloudy"];
    el._updateGroup(0, { conditions: next });
    expect(el._config.groups[0].conditions).toEqual(["sunny", "cloudy"]);
  });

  test("_removeGroup deletes a row and saves", async () => {
    el = await mount();
    el._removeGroup(1);
    expect(el._config.groups.map((g: any) => g.id)).toEqual(["sunny"]);
    expect(saveWeatherConfig).toHaveBeenCalled();
  });
});
