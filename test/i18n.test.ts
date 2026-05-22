import { describe, test, expect } from "vitest";
import {
  periodLabel,
  matcherLabel,
  actionLabel,
  anchorLabel,
  localize,
  weekdayLabel,
  dayItemKindLabel,
  monthLabel,
} from "../frontend/src/i18n";
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

  test("falls back to friendly form of name when hass.localize misses", () => {
    const hass = { localize: () => undefined };
    expect(matcherLabel(hass, "scene")).toBe("Scene");
  });

  test("falls back to friendly form for multi-word ids", () => {
    expect(matcherLabel(undefined, "time_of_day")).toBe("Time of day");
  });

  test("falls back to friendly form when localize returns the key itself", () => {
    const hass = { localize: (k: string) => k };
    expect(matcherLabel(hass, "time_of_day")).toBe("Time of day");
  });

  test("works with undefined hass", () => {
    expect(matcherLabel(undefined, "scene")).toBe("Scene");
  });
});

describe("actionLabel", () => {
  test("returns translated label when hass.localize hits", () => {
    const hass = { localize: (k: string) =>
      k === "component.ambience.action.set_light" ? "Set light" : undefined };
    expect(actionLabel(hass, "set_light")).toBe("Set light");
  });

  test("falls back to friendly form of name", () => {
    expect(actionLabel(undefined, "set_light")).toBe("Set light");
  });
});

describe("anchorLabel", () => {
  test("returns translated label when hass.localize hits", () => {
    const hass = { localize: (k: string) =>
      k === "component.ambience.anchor.dawn" ? "Morgendämmerung" : undefined };
    expect(anchorLabel(hass, "dawn")).toBe("Morgendämmerung");
  });

  test("falls back to capitalised name", () => {
    expect(anchorLabel(undefined, "sunset")).toBe("Sunset");
  });
});

describe("localize", () => {
  test("returns fallback when hass has no localize", () => {
    expect(localize(undefined, "ui.include", "Include")).toBe("Include");
  });
  test("returns fallback when localize misses (returns the key)", () => {
    const hass = { localize: (k: string) => k };
    expect(localize(hass, "ui.include", "Include")).toBe("Include");
  });
  test("returns localized value on hit", () => {
    const hass = { localize: (k: string) => (k === "component.ambience.ui.include" ? "Inclure" : undefined) };
    expect(localize(hass, "ui.include", "Include")).toBe("Inclure");
  });
});

describe("weekdayLabel", () => {
  test("English fallbacks, 0=Mon..6=Sun", () => {
    expect(weekdayLabel(undefined, 0)).toBe("Mon");
    expect(weekdayLabel(undefined, 5)).toBe("Sat");
    expect(weekdayLabel(undefined, 6)).toBe("Sun");
  });
  test("localizes via component.ambience.weekday.<id>", () => {
    const hass = { localize: (k: string) => (k === "component.ambience.weekday.mon" ? "Lun" : undefined) };
    expect(weekdayLabel(hass, 0)).toBe("Lun");
  });
});

describe("dayItemKindLabel", () => {
  test("English fallbacks per kind", () => {
    expect(dayItemKindLabel(undefined, "weekday")).toBe("Day of week");
    expect(dayItemKindLabel(undefined, "first_workday")).toBe("First workday of month");
  });
  test("localizes via component.ambience.day_item.<kind>", () => {
    const hass = { localize: (k: string) => (k === "component.ambience.day_item.workday" ? "Jour ouvré" : undefined) };
    expect(dayItemKindLabel(hass, "workday")).toBe("Jour ouvré");
  });
});

describe("monthLabel", () => {
  test("English fallbacks, 1=January..12=December", () => {
    expect(monthLabel(undefined, 1)).toBe("January");
    expect(monthLabel(undefined, 2)).toBe("February");
    expect(monthLabel(undefined, 12)).toBe("December");
  });
  test("localizes via component.ambience.month.<n>", () => {
    const hass = { localize: (k: string) => (k === "component.ambience.month.1" ? "Janvier" : undefined) };
    expect(monthLabel(hass, 1)).toBe("Janvier");
  });
});
