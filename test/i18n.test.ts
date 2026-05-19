import { describe, test, expect } from "vitest";
import { periodLabel, matcherLabel, actionLabel } from "../frontend/src/i18n";
import type { PeriodDef } from "../frontend/src/types";

const def = (label: string | null = null): PeriodDef => ({
  from: { kind: "time", hh: 20, mm: 0 },
  to:   { kind: "time", hh: 22, mm: 0 },
  label,
});

describe("periodLabel", () => {
  test("returns custom label when present", () => {
    expect(periodLabel(undefined, "wind_down", { wind_down: def("Wind down") }))
      .toBe("Wind down");
  });

  test("ignores empty/null custom label", () => {
    expect(periodLabel(undefined, "wind_down", { wind_down: def(null) }))
      .toBe("Wind_down");
  });

  test("uses hass.localize when available and key resolves", () => {
    const hass = { localize: (k: string) =>
      k === "component.ambience.time_of_day_period.afternoon" ? "Nachmittag" : undefined };
    expect(periodLabel(hass, "afternoon", {})).toBe("Nachmittag");
  });

  test("falls back to id when hass.localize returns the key itself (miss)", () => {
    const hass = { localize: (k: string) => k };
    expect(periodLabel(hass, "afternoon", {})).toBe("Afternoon");
  });

  test("falls back to capitalised id with no hass", () => {
    expect(periodLabel(undefined, "morning", {})).toBe("Morning");
  });

  test("custom label takes precedence over hass.localize", () => {
    const hass = { localize: () => "From i18n" };
    expect(periodLabel(hass, "afternoon", { afternoon: def("From custom") }))
      .toBe("From custom");
  });
});

describe("matcherLabel", () => {
  test("returns translated label when hass.localize hits", () => {
    const hass = { localize: (k: string) =>
      k === "component.ambience.matcher.scene" ? "Scene" : undefined };
    expect(matcherLabel(hass, "scene")).toBe("Scene");
  });

  test("falls back to raw name when hass.localize misses", () => {
    const hass = { localize: () => undefined };
    expect(matcherLabel(hass, "scene")).toBe("scene");
  });

  test("falls back to raw name when localize returns the key itself", () => {
    const hass = { localize: (k: string) => k };
    expect(matcherLabel(hass, "time_of_day")).toBe("time_of_day");
  });

  test("works with undefined hass", () => {
    expect(matcherLabel(undefined, "scene")).toBe("scene");
  });
});

describe("actionLabel", () => {
  test("returns translated label when hass.localize hits", () => {
    const hass = { localize: (k: string) =>
      k === "component.ambience.action.set_light" ? "Set light" : undefined };
    expect(actionLabel(hass, "set_light")).toBe("Set light");
  });

  test("falls back to raw name", () => {
    expect(actionLabel(undefined, "set_light")).toBe("set_light");
  });
});
