import { describe, test, expect, afterEach, vi, beforeEach } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  getDayConfig: vi.fn(async () => ({ workday_sensor: null, workday_calendar: null })),
  saveDayConfig: vi.fn(async () => ({ ok: true, warnings: [] })),
}));

import "../frontend/src/views/day-config";
import { saveDayConfig } from "../frontend/src/api.js";

describe("ambience-day-config", () => {
  let el: any;
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => el?.remove());

  async function mount() {
    el = document.createElement("ambience-day-config");
    el.hass = {};
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    return el;
  }

  test("renders two entity-picker rows labelled appropriately", async () => {
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("Workday sensor");
    expect(el.shadowRoot.textContent).toContain("Workday calendar");
  });

  test("changing the sensor value calls saveDayConfig", async () => {
    el = await mount();
    el._onSensorChange({ detail: { value: "binary_sensor.workday" } });
    expect(saveDayConfig).toHaveBeenCalledWith(expect.anything(), "binary_sensor.workday", null);
  });
});
