import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

// The modal hosts <ambience-settings-view>, whose children fetch on mount.
// Stub the API so those background calls resolve harmlessly.
vi.mock("../frontend/src/api.js", () => ({
  listConditions: vi.fn(async () => []),
  getDayConfig: vi.fn(async () => ({ workday_sensor: null, workday_calendar: null })),
  saveDayConfig: vi.fn(async () => ({ ok: true, warnings: [] })),
  listPeriods: vi.fn(async () => ({ builtins: {}, custom: {}, hidden: [] })),
  savePeriods: vi.fn(async () => ({ ok: true, warnings: [] })),
  resetPeriods: vi.fn(async () => ({ ok: true })),
  getWeatherConfig: vi.fn(async () => ({ entity: null, groups: [] })),
  saveWeatherConfig: vi.fn(async () => ({ ok: true, warnings: [] })),
  listAreas: vi.fn(async () => []),
  listFloors: vi.fn(async () => []),
  getSwitchDefaults: vi.fn(async () => ({ name: "Ambience", auto_on_delay_seconds: 7200 })),
  saveSwitchDefaults: vi.fn(async () => ({ ok: true })),
  getArea: vi.fn(async () => ({ scenes: [] })),
  getFloor: vi.fn(async () => ({ scenes: [] })),
  getHouse: vi.fn(async () => ({ scenes: [] })),
}));

import "../frontend/src/views/settings-modal";

describe("ambience-settings-modal", () => {
  let el: any;

  beforeEach(() => vi.clearAllMocks());
  afterEach(() => el?.remove());

  async function mount(open: boolean): Promise<any> {
    el = document.createElement("ambience-settings-modal");
    el.hass = {};
    el.open = open;
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    return el;
  }

  test("is defined as a custom element", () => {
    expect(customElements.get("ambience-settings-modal")).toBeTypeOf("function");
  });

  test("renders nothing while closed", async () => {
    el = await mount(false);
    expect(el.shadowRoot.querySelector("ambience-settings-view")).toBeNull();
  });

  test("renders the settings view when open", async () => {
    el = await mount(true);
    expect(el.shadowRoot.querySelector("ambience-settings-view")).not.toBeNull();
  });

  test("forwards initialTab to the settings view", async () => {
    el = document.createElement("ambience-settings-modal");
    el.hass = {};
    el.open = true;
    el.initialTab = "conditions";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const view = el.shadowRoot.querySelector("ambience-settings-view");
    expect(view.initialTab).toBe("conditions");
  });

  test("emits close when the ✕ button is clicked", async () => {
    el = await mount(true);
    let closed = false;
    el.addEventListener("close", () => {
      closed = true;
    });
    el.shadowRoot.querySelector(".close").click();
    expect(closed).toBe(true);
  });

  test("emits close when the backdrop is clicked", async () => {
    el = await mount(true);
    let closed = false;
    el.addEventListener("close", () => {
      closed = true;
    });
    // A click on the host itself (outside .modal) is a backdrop click.
    el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(closed).toBe(true);
  });

  test("does not emit close when the modal body is clicked", async () => {
    el = await mount(true);
    let closed = false;
    el.addEventListener("close", () => {
      closed = true;
    });
    el.shadowRoot.querySelector(".modal").click();
    expect(closed).toBe(false);
  });

  test("emits close on Escape keydown while open", async () => {
    el = await mount(true);
    let closed = false;
    el.addEventListener("close", () => {
      closed = true;
    });
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(closed).toBe(true);
  });
});
