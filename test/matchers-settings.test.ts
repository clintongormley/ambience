import { describe, test, expect, afterEach, vi, beforeEach } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  listMatchers: vi.fn(async () => ([
    { name: "scene", description: "", predicate_help: "", input: "scene_combobox", priority: 0 },
    { name: "weather", description: "W", predicate_help: "", input: "weather_predicate", priority: 300 },
    { name: "time_of_day", description: "TOD", predicate_help: "", input: "time_of_day", priority: 200 },
    { name: "day", description: "Day", predicate_help: "", input: "day_predicate", priority: 100 },
    { name: "state", description: "State", predicate_help: "", input: "state_predicate", priority: 400 },
  ])),
  getDayConfig: vi.fn(async () => ({ workday_sensor: null, workday_calendar: null })),
  saveDayConfig: vi.fn(async () => ({ ok: true, warnings: [] })),
  listPeriods: vi.fn(async () => ({ builtins: {}, custom: {}, hidden: [] })),
  savePeriods: vi.fn(async () => ({ ok: true, warnings: [] })),
  resetPeriods: vi.fn(async () => ({ ok: true })),
  getWeatherConfig: vi.fn(async () => ({ entity: null, groups: [] })),
  saveWeatherConfig: vi.fn(async () => ({ ok: true, warnings: [] })),
}));

import "../frontend/src/views/matchers-settings";

describe("ambience-matchers-settings", () => {
  let el: any;
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => el?.remove());

  async function mount() {
    el = document.createElement("ambience-matchers-settings");
    el.hass = {};
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    return el;
  }

  test("renders a card per configurable matcher in priority order", async () => {
    el = await mount();
    const cards = el.shadowRoot.querySelectorAll("ambience-matcher-card");
    expect(cards.length).toBe(3);
    const names = Array.from(cards).map((c: any) => c.matcherName);
    expect(names).toEqual(["day", "time_of_day", "weather"]);
  });
});
