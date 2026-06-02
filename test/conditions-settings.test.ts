import { describe, test, expect, afterEach, vi, beforeEach } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  listConditions: vi.fn(async () => ([
    { name: "mode", description: "", predicate_help: "", input: "text", priority: 1000 },
    { name: "weather", description: "W", predicate_help: "", input: "weather_predicate", priority: 700 },
    { name: "time_of_day", description: "TOD", predicate_help: "", input: "time_of_day", priority: 800 },
    { name: "day", description: "Day", predicate_help: "", input: "day_predicate", priority: 900 },
    { name: "state", description: "State", predicate_help: "", input: "state_predicate", priority: 600 },
  ])),
  getDayConfig: vi.fn(async () => ({ workday_sensor: null, workday_calendar: null })),
  saveDayConfig: vi.fn(async () => ({ ok: true, warnings: [] })),
  listPeriods: vi.fn(async () => ({ builtins: {}, custom: {}, hidden: [] })),
  savePeriods: vi.fn(async () => ({ ok: true, warnings: [] })),
  resetPeriods: vi.fn(async () => ({ ok: true })),
  getWeatherConfig: vi.fn(async () => ({ entity: null, groups: [] })),
  saveWeatherConfig: vi.fn(async () => ({ ok: true, warnings: [] })),
}));

import "../frontend/src/views/conditions-settings";

describe("ambience-conditions-settings", () => {
  let el: any;
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => el?.remove());

  async function mount() {
    el = document.createElement("ambience-conditions-settings");
    el.hass = {};
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    return el;
  }

  test("renders a card per configurable condition in priority order", async () => {
    el = await mount();
    const cards = el.shadowRoot.querySelectorAll("ambience-condition-card");
    expect(cards.length).toBe(3);
    const names = Array.from(cards).map((c: any) => c.conditionName);
    expect(names).toEqual(["day", "time_of_day", "weather"]);
  });
});
