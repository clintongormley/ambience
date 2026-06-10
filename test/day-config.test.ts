import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  getDayConfig: vi.fn(async () => ({ workday_sensor: null, workday_calendar: null })),
  saveDayConfig: vi.fn(async () => ({ ok: true, warnings: [] })),
}));

import "../frontend/src/views/day-config";
import { saveDayConfig } from "../frontend/src/api.js";

// day-config guards its pickers on customElements.get("ha-form"); define a
// stub so the ha-form path (what real HA renders) is the one under test.
if (!customElements.get("ha-form")) {
  customElements.define("ha-form", class extends HTMLElement {});
}

describe("ambience-day-config", () => {
  let el: any;
  beforeEach(() => {
    vi.clearAllMocks();
  });
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

  test("a successful save fires ambience-conditions-changed so views refetch", async () => {
    el = await mount();
    const seen = vi.fn();
    window.addEventListener("ambience-conditions-changed", seen);
    el._onSensorChange({ detail: { value: "binary_sensor.workday" } });
    await new Promise((r) => setTimeout(r, 0));
    expect(seen).toHaveBeenCalledTimes(1);
    window.removeEventListener("ambience-conditions-changed", seen);
  });

  test("changing the calendar value calls saveDayConfig with the new calendar", async () => {
    el = await mount();
    el._onCalendarChange({ detail: { value: "calendar.workday" } });
    expect(saveDayConfig).toHaveBeenCalledWith(expect.anything(), null, "calendar.workday");
  });

  test("clearing the calendar sends null to saveDayConfig", async () => {
    el = await mount();
    // An empty string value should be coerced to null via `|| null`.
    el._onCalendarChange({ detail: { value: "" } });
    expect(saveDayConfig).toHaveBeenCalledWith(expect.anything(), null, null);
  });

  test("saveDayConfig response with no warnings field defaults to empty array", async () => {
    // When `res.warnings` is undefined the `?? []` branch fires.
    vi.mocked(saveDayConfig).mockResolvedValueOnce({ ok: true } as any);
    el = await mount();
    el._onSensorChange({ detail: { value: "binary_sensor.workday" } });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    // No warnings div rendered — confirms _warnings stayed []
    expect(el.shadowRoot.querySelector(".warnings")).toBeNull();
  });

  test("ha-form value-changed for sensor triggers _onSensorChange via DOM event", async () => {
    el = await mount();
    vi.clearAllMocks(); // reset spy from mount's connectedCallback
    const haForms = el.shadowRoot.querySelectorAll("ha-form");
    // First ha-form is the sensor picker.
    const sensorForm = haForms[0];
    sensorForm.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        composed: true,
        detail: { value: { workday_sensor: "binary_sensor.workday_sensor" } },
      }),
    );
    expect(saveDayConfig).toHaveBeenCalledWith(
      expect.anything(),
      "binary_sensor.workday_sensor",
      null,
    );
  });

  test("ha-form value-changed for sensor with empty value coerces to null", async () => {
    el = await mount();
    vi.clearAllMocks();
    const sensorForm = el.shadowRoot.querySelectorAll("ha-form")[0];
    // Sending an empty string fires the `|| null` fallback branch.
    sensorForm.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        composed: true,
        detail: { value: { workday_sensor: "" } },
      }),
    );
    expect(saveDayConfig).toHaveBeenCalledWith(expect.anything(), null, null);
  });

  test("ha-form value-changed for calendar triggers _onCalendarChange via DOM event", async () => {
    el = await mount();
    vi.clearAllMocks();
    const haForms = el.shadowRoot.querySelectorAll("ha-form");
    // Second ha-form is the calendar picker.
    const calendarForm = haForms[1];
    calendarForm.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        composed: true,
        detail: { value: { workday_calendar: "calendar.workday_calendar" } },
      }),
    );
    expect(saveDayConfig).toHaveBeenCalledWith(
      expect.anything(),
      null,
      "calendar.workday_calendar",
    );
  });

  test("ha-form value-changed for calendar with empty value coerces to null", async () => {
    el = await mount();
    vi.clearAllMocks();
    const calendarForm = el.shadowRoot.querySelectorAll("ha-form")[1];
    // Sending an empty string fires the `|| null` fallback branch.
    calendarForm.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        composed: true,
        detail: { value: { workday_calendar: "" } },
      }),
    );
    expect(saveDayConfig).toHaveBeenCalledWith(expect.anything(), null, null);
  });

  test("renders dangling warnings with scope labels for area, floor and house", async () => {
    vi.mocked(saveDayConfig).mockResolvedValueOnce({
      ok: true,
      warnings: [
        {
          scope_kind: "area",
          scope_id: "kitchen",
          scene_name: "Area scene",
          reason: "missing sensor",
        },
        {
          scope_kind: "floor",
          scope_id: "upstairs",
          scene_name: "Floor scene",
          reason: "missing sensor",
        },
        {
          scope_kind: "house",
          scope_id: null,
          scene_name: "House scene",
          reason: "missing sensor",
        },
      ],
    });
    el = await mount();
    el._onSensorChange({ detail: { value: "binary_sensor.workday" } });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const txt = el.shadowRoot.querySelector(".warnings").textContent;
    expect(txt).toContain("kitchen"); // area scope renders the id
    expect(txt).toContain("Floor: upstairs"); // floor scope renders with prefix
    expect(txt).toContain("House"); // house scope renders the literal label
    expect(txt).not.toContain("undefined");
  });

  test("a failed load shows an error instead of a blank panel", async () => {
    const { getDayConfig } = await import("../frontend/src/api.js");
    vi.mocked(getDayConfig).mockRejectedValueOnce(new Error("day list boom"));
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("day list boom");
  });

  test("a failed save shows an error", async () => {
    el = await mount();
    vi.mocked(saveDayConfig).mockRejectedValueOnce(new Error("day save boom"));
    el._onSensorChange({ detail: { value: "binary_sensor.workday" } });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.textContent).toContain("day save boom");
  });
});
