import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

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
  getSwitchDefaults: vi.fn(async () => ({
    name: "Ambience",
    auto_on_delay_seconds: 7200,
    create_switches: false,
  })),
  saveSwitchDefaults: vi.fn(async () => ({ ok: true })),
  getReapplySettings: vi.fn(async () => ({ enabled: false, interval_seconds: 3600 })),
  saveReapplySettings: vi.fn(async () => ({ ok: true })),
  getExposedAssistants: vi.fn(async () => ({
    expose_assist: true,
    expose_google: false,
    expose_alexa: false,
  })),
  saveExposedAssistants: vi.fn(async () => ({ ok: true })),
  getArea: vi.fn(async () => ({ scenes: [] })),
  getFloor: vi.fn(async () => ({ scenes: [] })),
  getHouse: vi.fn(async () => ({ scenes: [] })),
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

  test("default sub-tab is Categories", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector("ambience-categories-settings")).not.toBeNull();
    expect(el.shadowRoot.querySelector("ambience-ambience-settings")).toBeNull();
  });

  test("initialTab seeds the active tab", async () => {
    el = document.createElement("ambience-settings-view");
    el.hass = {};
    el.initialTab = "actions";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("ambience-actions-settings")).not.toBeNull();
    expect(el.shadowRoot.querySelector("ambience-ambience-settings")).toBeNull();
  });

  test("clicking Conditions swaps the body", async () => {
    el = await mount();
    const buttons = el.shadowRoot.querySelectorAll("nav button");
    (buttons[1] as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("ambience-conditions-settings")).not.toBeNull();
    expect(el.shadowRoot.querySelector("ambience-ambience-settings")).toBeNull();
  });

  test("clicking Actions swaps the body", async () => {
    el = await mount();
    const buttons = el.shadowRoot.querySelectorAll("nav button");
    (buttons[2] as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("ambience-actions-settings")).not.toBeNull();
  });

  test("clicking Advanced swaps the body", async () => {
    el = await mount();
    const buttons = el.shadowRoot.querySelectorAll("nav button");
    (buttons[3] as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("ambience-ambience-settings")).not.toBeNull();
  });

  test("renders the Advanced tab last with Categories first", async () => {
    el = await mount();
    const labels = [...el.shadowRoot!.querySelectorAll("nav button")].map((b: Element) =>
      b.textContent!.trim(),
    );
    expect(labels.at(-1)).toBe("Advanced");
    expect(labels[0]).toBe("Categories");
  });

  test("initialTab can deep-link to Categories", async () => {
    el = document.createElement("ambience-settings-view");
    el.hass = {};
    el.initialTab = "categories";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("ambience-categories-settings")).not.toBeNull();
    expect(el.shadowRoot.querySelector("ambience-ambience-settings")).toBeNull();
  });

  test("each tab renders an HA-style icon", async () => {
    el = await mount();
    const icons = el.shadowRoot.querySelectorAll("nav button ha-icon");
    expect(Array.from(icons).map((i: Element) => i.getAttribute("icon"))).toEqual([
      "mdi:shape-outline",
      "mdi:filter-variant",
      "mdi:flash",
      "mdi:home-lightbulb",
    ]);
  });

  test("the active tab is marked for the underline indicator", async () => {
    el = await mount();
    const active = el.shadowRoot.querySelectorAll("nav button.active");
    expect(active.length).toBe(1);
    expect(active[0].textContent).toContain("Categories");
  });

  test("tab content lives in a scroll region separate from the nav", async () => {
    el = await mount();
    const content = el.shadowRoot.querySelector(".content");
    expect(content).not.toBeNull();
    expect(content!.querySelector("ambience-categories-settings")).not.toBeNull();
    // the nav must NOT be inside the scrolling content region
    expect(content!.querySelector("nav")).toBeNull();
  });
});
