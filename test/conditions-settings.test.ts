import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  listConditions: vi.fn(async () => [
    { name: "mode", description: "", predicate_help: "", input: "text", priority: 1000 },
    {
      name: "weather",
      description: "W",
      predicate_help: "",
      input: "weather_predicate",
      priority: 700,
    },
    {
      name: "time_of_day",
      description: "TOD",
      predicate_help: "",
      input: "time_of_day",
      priority: 800,
    },
    { name: "day", description: "Day", predicate_help: "", input: "day_predicate", priority: 900 },
    {
      name: "state",
      description: "State",
      predicate_help: "",
      input: "state_predicate",
      priority: 600,
    },
  ]),
  getDayConfig: vi.fn(async () => ({ workday_sensor: null, workday_calendar: null })),
  saveDayConfig: vi.fn(async () => ({ ok: true, warnings: [] })),
  listPeriods: vi.fn(async () => ({ builtins: {}, custom: {}, hidden: [] })),
  savePeriods: vi.fn(async () => ({ ok: true, warnings: [] })),
  resetPeriods: vi.fn(async () => ({ ok: true })),
  getWeatherConfig: vi.fn(async () => ({ entity: null, groups: [] })),
  saveWeatherConfig: vi.fn(async () => ({ ok: true, warnings: [] })),
}));

import "../frontend/src/views/conditions-settings";
import { listConditions } from "../frontend/src/api.js";

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

  test("renders no cards when there are no configurable conditions", async () => {
    vi.mocked(listConditions).mockResolvedValueOnce([
      {
        name: "state",
        description: "State",
        predicate_help: "",
        input: "state_predicate",
        priority: 600,
      },
    ]);
    el = await mount();
    const cards = el.shadowRoot.querySelectorAll("ambience-condition-card");
    expect(cards.length).toBe(0);
  });

  test("passes conditionName and conditionDescription to each card", async () => {
    el = await mount();
    const cards = Array.from(el.shadowRoot.querySelectorAll("ambience-condition-card")) as any[];
    const day = cards.find((c) => c.conditionName === "day");
    expect(day).toBeTruthy();
    expect(day.conditionDescription).toBe("Day");
    const tod = cards.find((c) => c.conditionName === "time_of_day");
    expect(tod.conditionDescription).toBe("TOD");
  });

  test("injects ambience-time-of-day-config inside the time_of_day card slot", async () => {
    el = await mount();
    const cards = Array.from(el.shadowRoot.querySelectorAll("ambience-condition-card")) as any[];
    const tod = cards.find((c) => c.conditionName === "time_of_day");
    expect(tod.querySelector("ambience-time-of-day-config")).toBeTruthy();
  });

  test("injects ambience-day-config inside the day card slot", async () => {
    el = await mount();
    const cards = Array.from(el.shadowRoot.querySelectorAll("ambience-condition-card")) as any[];
    const day = cards.find((c) => c.conditionName === "day");
    expect(day.querySelector("ambience-day-config")).toBeTruthy();
  });

  test("injects ambience-weather-config inside the weather card slot", async () => {
    el = await mount();
    const cards = Array.from(el.shadowRoot.querySelectorAll("ambience-condition-card")) as any[];
    const weather = cards.find((c) => c.conditionName === "weather");
    expect(weather.querySelector("ambience-weather-config")).toBeTruthy();
  });

  test("displays an error paragraph when listConditions rejects with an Error", async () => {
    vi.mocked(listConditions).mockRejectedValueOnce(new Error("network failure"));
    el = await mount();
    const p = el.shadowRoot.querySelector("p.error");
    expect(p).toBeTruthy();
    expect(p.textContent).toContain("network failure");
  });

  test("displays no error paragraph when listConditions resolves successfully", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector("p.error")).toBeFalsy();
  });

  test("uses String(e) when the thrown value has no message property", async () => {
    vi.mocked(listConditions).mockRejectedValueOnce("plain string error");
    el = await mount();
    const p = el.shadowRoot.querySelector("p.error");
    expect(p).toBeTruthy();
    expect(p.textContent).toContain("plain string error");
  });

  test("error prevents cards from rendering when listConditions rejects", async () => {
    vi.mocked(listConditions).mockRejectedValueOnce(new Error("oops"));
    el = await mount();
    const cards = el.shadowRoot.querySelectorAll("ambience-condition-card");
    expect(cards.length).toBe(0);
  });

  test("renders a help tooltip trigger", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector("ambience-help")).not.toBeNull();
  });
});
