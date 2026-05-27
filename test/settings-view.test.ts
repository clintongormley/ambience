import { describe, test, expect, afterEach, beforeEach, vi } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  listMatchers: vi.fn(async () => []),
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
  getArea: vi.fn(async () => ({ rules: [], auto_sort: true })),
  getFloor: vi.fn(async () => ({ rules: [], auto_sort: true })),
  getHouse: vi.fn(async () => ({ rules: [], auto_sort: true })),
  saveHouseSwitch: vi.fn(async () => ({ ok: true })),
  saveFloorSwitch: vi.fn(async () => ({ ok: true })),
  saveAreaSwitch: vi.fn(async () => ({ ok: true })),
}));

import "../frontend/src/views/settings-view";

describe("ambience-settings-view", () => {
  let el: any;
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => el?.remove());

  async function mount() {
    el = document.createElement("ambience-settings-view");
    el.hass = {};
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    return el;
  }

  test("default sub-tab is Ambience", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector("ambience-ambience-settings")).not.toBeNull();
  });

  test("clicking Matchers swaps the body", async () => {
    el = await mount();
    const buttons = el.shadowRoot.querySelectorAll("nav button");
    (buttons[1] as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("ambience-matchers-settings")).not.toBeNull();
    expect(el.shadowRoot.querySelector("ambience-ambience-settings")).toBeNull();
  });

  test("clicking Actions swaps the body", async () => {
    el = await mount();
    const buttons = el.shadowRoot.querySelectorAll("nav button");
    (buttons[2] as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("ambience-actions-settings")).not.toBeNull();
  });
});
