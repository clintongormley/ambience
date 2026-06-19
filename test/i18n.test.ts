import { describe, expect, test } from "vitest";
import {
  actionLabel,
  anchorLabel,
  conditionLabel,
  dayItemKindLabel,
  exposedActionLabel,
  localize,
  monthLabel,
  periodLabel,
  weatherAttrLabel,
  weatherAttrUnit,
  weatherConditionLabel,
  weekdayLabel,
} from "../frontend/src/i18n";
import { AMBIENCE_STRINGS_BY_LOCALE } from "../frontend/src/i18n-data";
import type { ExposedAction, PeriodDef } from "../frontend/src/types";

const exposed = (id: string, label: string): ExposedAction => ({
  id,
  label,
  visible_fields: [],
  defaults: {},
});

const def = (label: string | null = null): PeriodDef => ({
  from: { kind: "time", hh: 20, mm: 0 },
  to: { kind: "time", hh: 22, mm: 0 },
  label,
});

describe("periodLabel", () => {
  test("returns custom label when present", () => {
    expect(periodLabel(undefined, "wind_down", { wind_down: def("Wind down") })).toBe("Wind down");
  });

  test("ignores empty/null custom label", () => {
    expect(periodLabel(undefined, "wind_down", { wind_down: def(null) })).toBe("Wind down");
  });

  test("uses hass.localize when available and key resolves", () => {
    const hass = {
      localize: (k: string) =>
        k === "component.ambience.time_of_day_period.afternoon" ? "Nachmittag" : undefined,
    };
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
    expect(periodLabel(hass, "afternoon", { afternoon: def("From custom") })).toBe("From custom");
  });
});

describe("conditionLabel", () => {
  test("returns translated label when hass.localize hits", () => {
    const hass = {
      localize: (k: string) => (k === "component.ambience.condition.mode" ? "Mode" : undefined),
    };
    expect(conditionLabel(hass, "mode")).toBe("Mode");
  });

  test("falls back to friendly form of name when hass.localize misses", () => {
    const hass = { localize: () => undefined };
    expect(conditionLabel(hass, "mode")).toBe("Mode");
  });

  test("falls back to friendly form for multi-word ids", () => {
    expect(conditionLabel(undefined, "time_of_day")).toBe("Time of day");
  });

  test("falls back to friendly form when localize returns the key itself", () => {
    const hass = { localize: (k: string) => k };
    expect(conditionLabel(hass, "time_of_day")).toBe("Time of day");
  });

  test("works with undefined hass", () => {
    expect(conditionLabel(undefined, "mode")).toBe("Mode");
  });
});

describe("actionLabel", () => {
  test("returns translated label when hass.localize hits", () => {
    const hass = {
      localize: (k: string) =>
        k === "component.ambience.action.light.turn_on" ? "Turn on lights" : undefined,
    };
    expect(actionLabel(hass, "light.turn_on")).toBe("Turn on lights");
  });

  test("falls back to friendly form of name", () => {
    expect(actionLabel(undefined, "media_played")).toBe("Media played");
  });
});

describe("exposedActionLabel", () => {
  test("returns the configured label when a matching exposed action has a non-blank label", () => {
    expect(
      exposedActionLabel("fado.fade_lights", [exposed("fado.fade_lights", "Fade lights")], () => {
        throw new Error("fallback should not be called when a configured label wins");
      }),
    ).toBe("Fade lights");
  });

  test("falls back when the matching label is blank or whitespace-only", () => {
    expect(
      exposedActionLabel("fado.fade_lights", [exposed("fado.fade_lights", "   ")], () => "derived"),
    ).toBe("derived");
  });

  test("falls back when no exposed action matches, or the list is undefined", () => {
    expect(
      exposedActionLabel("fado.fade_lights", [exposed("light.turn_on", "On")], () => "derived"),
    ).toBe("derived");
    expect(exposedActionLabel("fado.fade_lights", undefined, () => "derived")).toBe("derived");
  });
});

describe("anchorLabel", () => {
  test("returns translated label when hass.localize hits", () => {
    const hass = {
      localize: (k: string) =>
        k === "component.ambience.anchor.dawn" ? "Morgendämmerung" : undefined,
    };
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
    const hass = {
      localize: (k: string) => (k === "component.ambience.ui.include" ? "Inclure" : undefined),
    };
    expect(localize(hass, "ui.include", "Include")).toBe("Inclure");
  });

  // --- multi-locale bundle tests ---
  test("selects the es bundle when hass.language is Spanish", () => {
    // ui.close is seeded as "Cerrar" in es
    expect(localize({ language: "es" } as any, "ui.close", "Close")).toBe("Cerrar");
  });
  test("normalizes region locales (es-ES) to the base language", () => {
    expect(localize({ language: "es-ES" } as any, "ui.close", "Close")).toBe("Cerrar");
  });
  test("falls back to en for a key missing in es", () => {
    // es is now a full mirror of en, so test with a key absent from both bundles
    expect(localize({ language: "es" } as any, "ui.nonexistent_key_xyz", "X")).toBe("X");
  });
  test("falls back to en for an unknown language", () => {
    expect(localize({ language: "de" } as any, "ui.cancel", "FALLBACK")).toBe("Cancel");
  });
  test("interpolates placeholders in the fallback string", () => {
    expect(
      localize({ language: "en" } as any, "nonexistent.key", "Hi {name}", { name: "Bob" }),
    ).toBe("Hi Bob");
  });
});

describe("weekdayLabel", () => {
  test("English fallbacks, 0=Mon..6=Sun", () => {
    expect(weekdayLabel(undefined, 0)).toBe("Mon");
    expect(weekdayLabel(undefined, 5)).toBe("Sat");
    expect(weekdayLabel(undefined, 6)).toBe("Sun");
  });
  test("localizes via component.ambience.weekday.<id>", () => {
    const hass = {
      localize: (k: string) => (k === "component.ambience.weekday.mon" ? "Lun" : undefined),
    };
    expect(weekdayLabel(hass, 0)).toBe("Lun");
  });
});

describe("dayItemKindLabel", () => {
  test("English fallbacks per kind", () => {
    expect(dayItemKindLabel(undefined, "weekday")).toBe("Day of week");
    expect(dayItemKindLabel(undefined, "first_workday")).toBe("First workday of month");
  });
  test("localizes via component.ambience.day_item.<kind>", () => {
    const hass = {
      localize: (k: string) =>
        k === "component.ambience.day_item.workday" ? "Jour ouvré" : undefined,
    };
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
    const hass = {
      localize: (k: string) => (k === "component.ambience.month.1" ? "Janvier" : undefined),
    };
    expect(monthLabel(hass, 1)).toBe("Janvier");
  });
});

describe("weatherConditionLabel", () => {
  test("English fallbacks", () => {
    expect(weatherConditionLabel(undefined, "rainy")).toBe("Rainy");
    expect(weatherConditionLabel(undefined, "partlycloudy")).toBe("Partly cloudy");
    expect(weatherConditionLabel(undefined, "clear-night")).toBe("Clear (night)");
  });
  test("localizes via component.ambience.weather_condition.<cond>", () => {
    const hass = {
      localize: (k: string) =>
        k === "component.ambience.weather_condition.rainy" ? "Pluvieux" : undefined,
    };
    expect(weatherConditionLabel(hass, "rainy")).toBe("Pluvieux");
  });
});

describe("weatherAttrLabel", () => {
  test("English fallbacks", () => {
    expect(weatherAttrLabel(undefined, "temperature")).toBe("Temperature");
    expect(weatherAttrLabel(undefined, "wind_speed")).toBe("Wind speed");
  });
});

describe("weatherAttrUnit", () => {
  test("humidity is always '%' regardless of hass", () => {
    expect(weatherAttrUnit(undefined, "humidity")).toBe("%");
    expect(
      weatherAttrUnit({ config: { unit_system: { temperature: "°F" } } } as any, "humidity"),
    ).toBe("%");
  });
  test("temperature & apparent_temperature follow hass.config.unit_system.temperature", () => {
    const hass = { config: { unit_system: { temperature: "°F" } } } as any;
    expect(weatherAttrUnit(hass, "temperature")).toBe("°F");
    expect(weatherAttrUnit(hass, "apparent_temperature")).toBe("°F");
  });
  test("wind_speed reads from hass.config.unit_system.wind_speed", () => {
    const hass = { config: { unit_system: { wind_speed: "km/h" } } } as any;
    expect(weatherAttrUnit(hass, "wind_speed")).toBe("km/h");
  });
  test("pressure reads from hass.config.unit_system.pressure", () => {
    const hass = { config: { unit_system: { pressure: "inHg" } } } as any;
    expect(weatherAttrUnit(hass, "pressure")).toBe("inHg");
  });
  test("falls back to metric defaults when hass is missing or has no unit_system", () => {
    expect(weatherAttrUnit(undefined, "temperature")).toBe("°C");
    expect(weatherAttrUnit(undefined, "apparent_temperature")).toBe("°C");
    expect(weatherAttrUnit(undefined, "wind_speed")).toBe("m/s");
    expect(weatherAttrUnit(undefined, "pressure")).toBe("hPa");
    expect(weatherAttrUnit({} as any, "temperature")).toBe("°C");
  });
  test("returns empty string for unknown attributes", () => {
    expect(weatherAttrUnit(undefined, "cloudiness")).toBe("");
  });

  // --- entity-state override --------------------------------------------
  // HA's `unit_system.pressure` is "Pa" / "psi" — the base SI unit — but
  // weather entities report pressure in "hPa" / "inHg". The entity's own
  // attributes (temperature_unit, pressure_unit, wind_speed_unit) carry
  // the unit HA actually uses to display values. Read those first.

  test("entity-state pressure_unit overrides unit_system.pressure", () => {
    const hass = { config: { unit_system: { pressure: "Pa" } } } as any;
    const state = { attributes: { pressure_unit: "hPa" } };
    expect(weatherAttrUnit(hass, "pressure", state)).toBe("hPa");
  });
  test("entity-state temperature_unit overrides unit_system.temperature", () => {
    const hass = { config: { unit_system: { temperature: "°C" } } } as any;
    const state = { attributes: { temperature_unit: "°F" } };
    expect(weatherAttrUnit(hass, "temperature", state)).toBe("°F");
    // apparent_temperature shares the same unit attribute.
    expect(weatherAttrUnit(hass, "apparent_temperature", state)).toBe("°F");
  });
  test("entity-state wind_speed_unit overrides unit_system.wind_speed", () => {
    const hass = { config: { unit_system: { wind_speed: "m/s" } } } as any;
    const state = { attributes: { wind_speed_unit: "km/h" } };
    expect(weatherAttrUnit(hass, "wind_speed", state)).toBe("km/h");
  });
  test("humidity still '%' even if entity exposes a bogus unit", () => {
    const state = { attributes: { humidity_unit: "ppm" } };
    expect(weatherAttrUnit(undefined, "humidity", state)).toBe("%");
  });
  test("falls through to unit_system when the entity attribute is missing or non-string", () => {
    const hass = { config: { unit_system: { pressure: "Pa" } } } as any;
    expect(weatherAttrUnit(hass, "pressure", { attributes: {} })).toBe("Pa");
    expect(weatherAttrUnit(hass, "pressure", { attributes: { pressure_unit: 42 } as any })).toBe(
      "Pa",
    );
    expect(weatherAttrUnit(hass, "pressure", undefined)).toBe("Pa");
  });
});

describe("AMBIENCE_STRINGS_BY_LOCALE parity", () => {
  test("es bundle mirrors en bundle key-for-key", () => {
    const flat = (o: any, p = ""): string[] =>
      Object.entries(o).flatMap(([k, v]) =>
        v && typeof v === "object" ? flat(v, `${p}${k}.`) : [`${p}${k}`],
      );
    const en = new Set(flat(AMBIENCE_STRINGS_BY_LOCALE.en));
    const es = new Set(flat(AMBIENCE_STRINGS_BY_LOCALE.es));
    expect([...en].filter((k) => !es.has(k))).toEqual([]); // none missing in es
    expect([...es].filter((k) => !en.has(k))).toEqual([]); // none extra in es
  });
});
