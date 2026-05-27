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

  test("renders dangling warnings with scope labels for area, floor and house", async () => {
    vi.mocked(saveDayConfig).mockResolvedValueOnce({
      ok: true,
      warnings: [
        { scope_kind: "area",  scope_id: "kitchen", rule_name: "Area rule",  reason: "missing sensor" },
        { scope_kind: "floor", scope_id: "upstairs", rule_name: "Floor rule", reason: "missing sensor" },
        { scope_kind: "house", scope_id: null,      rule_name: "House rule", reason: "missing sensor" },
      ],
    });
    el = await mount();
    el._onSensorChange({ detail: { value: "binary_sensor.workday" } });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const txt = el.shadowRoot.querySelector(".warnings").textContent;
    expect(txt).toContain("kitchen");        // area scope renders the id
    expect(txt).toContain("Floor: upstairs"); // floor scope renders with prefix
    expect(txt).toContain("House");           // house scope renders the literal label
    expect(txt).not.toContain("undefined");
  });
});
