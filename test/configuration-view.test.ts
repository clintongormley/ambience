import { describe, test, expect, afterEach, vi, beforeEach } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  // Deliberately return matchers NOT in priority order — the view should sort.
  listMatchers: vi.fn(async () => ([
    { name: "scene", description: "", predicate_help: "", toggleable: false, input: "scene_combobox", priority: 0 },
    { name: "weather", description: "W", predicate_help: "", toggleable: true, input: "weather_predicate", priority: 300 },
    { name: "time_of_day", description: "TOD", predicate_help: "", toggleable: true, input: "time_of_day", priority: 200 },
    { name: "day", description: "Day", predicate_help: "", toggleable: true, input: "day_predicate", priority: 100 },
  ])),
  listEnabledMatchers: vi.fn(async () => ({ enabled: ["time_of_day"] })),
  saveEnabledMatchers: vi.fn(async () => ({ ok: true, warnings: [] })),
  getDayConfig: vi.fn(async () => ({ workday_sensor: null, workday_calendar: null })),
  saveDayConfig: vi.fn(async () => ({ ok: true, warnings: [] })),
  listPeriods: vi.fn(async () => ({ builtins: {}, custom: {}, hidden: [] })),
  savePeriods: vi.fn(async () => ({ ok: true, warnings: [] })),
  resetPeriods: vi.fn(async () => ({ ok: true })),
  getWeatherConfig: vi.fn(async () => ({ entity: null, groups: [] })),
  saveWeatherConfig: vi.fn(async () => ({ ok: true, warnings: [] })),
}));

import "../frontend/src/views/configuration-view";
import { saveEnabledMatchers } from "../frontend/src/api.js";

describe("ambience-configuration-view", () => {
  let el: any;
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => el?.remove());

  async function mount() {
    el = document.createElement("ambience-configuration-view");
    el.hass = {};
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    return el;
  }

  test("renders a card per toggleable matcher in priority order (scene is skipped)", async () => {
    el = await mount();
    const cards = el.shadowRoot.querySelectorAll("ambience-matcher-card");
    expect(cards.length).toBe(3);
    const names = Array.from(cards).map((c: any) => c.matcherName);
    // Mock returns weather-tod-day; view should sort by priority → day, tod, weather.
    expect(names).toEqual(["day", "time_of_day", "weather"]);
  });

  test("time_of_day card is enabled (mock pre-enables it); day & weather are disabled", async () => {
    el = await mount();
    const cards = el.shadowRoot.querySelectorAll("ambience-matcher-card");
    // Order is now day(0), time_of_day(1), weather(2).
    expect((cards[0] as any).enabled).toBe(false); // day
    expect((cards[1] as any).enabled).toBe(true);  // time_of_day (mocked enabled)
    expect((cards[2] as any).enabled).toBe(false); // weather
  });

  test("toggling a card calls saveEnabledMatchers with the union", async () => {
    el = await mount();
    // Toggle the day card (now at index 0 thanks to priority sort).
    const card = el.shadowRoot.querySelectorAll("ambience-matcher-card")[0] as HTMLElement;
    card.dispatchEvent(new CustomEvent("enable-changed", { detail: { enabled: true } }));
    await el.updateComplete;
    expect(saveEnabledMatchers).toHaveBeenCalledWith(expect.anything(), ["time_of_day", "day"]);
  });
});
