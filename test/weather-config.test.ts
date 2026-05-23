import { describe, test, expect, afterEach, vi, beforeEach } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  getWeatherConfig: vi.fn(async () => ({ entity: null })),
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

  test("renders the weather entity row", async () => {
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("Weather entity");
  });

  test("changing the entity calls saveWeatherConfig", async () => {
    el = await mount();
    el._onEntityChange({ detail: { value: "weather.home" } });
    expect(saveWeatherConfig).toHaveBeenCalledWith(expect.anything(), "weather.home");
  });
});
