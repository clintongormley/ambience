import { describe, test, expect } from "vitest";
import {
  ruleDisplayName,
  summariseMatcher,
  summariseTimeOfDay,
  summariseDay,
  summariseAction,
} from "../frontend/src/summary";
import type {
  ActionInfo,
  ActionSpec,
  DayPredicate,
  PeriodStoreView,
} from "../frontend/src/types";

const noLocalize = { localize: () => undefined };

const periods: PeriodStoreView = {
  builtins: {
    afternoon: {
      from: { kind: "sun", anchor: "noon", offset_min: 60 },
      to: { kind: "sun", anchor: "sunset", offset_min: -30 },
    },
  },
  custom: {},
  hidden: [],
};

describe("ruleDisplayName", () => {
  test("returns the name when set", () => {
    expect(ruleDisplayName({ name: "My rule", when: {}, actions: [] })).toBe("My rule");
  });

  test("falls back to scene when name is empty", () => {
    expect(ruleDisplayName({ name: "", when: { scene: "movie" }, actions: [] }))
      .toBe("movie");
  });

  test("falls back to default when neither is set", () => {
    expect(ruleDisplayName({ name: "", when: {}, actions: [] })).toBe("New rule");
  });

  test("uses custom default placeholder", () => {
    expect(ruleDisplayName({ name: "", when: {}, actions: [] }, "Rule 3"))
      .toBe("Rule 3");
  });

  test("treats whitespace-only name as empty", () => {
    expect(ruleDisplayName({ name: "   ", when: { scene: "movie" }, actions: [] }))
      .toBe("movie");
  });

  test("treats non-string scene as no scene", () => {
    // scene predicate could be null (wildcard) — fall through to default
    expect(ruleDisplayName({ name: "", when: { scene: null as any }, actions: [] }))
      .toBe("New rule");
  });
});

describe("summariseMatcher", () => {
  test("null predicate renders as '(any)'", () => {
    expect(summariseMatcher("scene", null, { hass: noLocalize, periods })).toBe("(any)");
  });

  test("scene predicate renders as the raw string", () => {
    expect(summariseMatcher("scene", "movie", { hass: noLocalize, periods })).toBe("movie");
  });

  test("time_of_day predicate delegates to summariseTimeOfDay", () => {
    expect(
      summariseMatcher("time_of_day", { period: "afternoon" }, { hass: noLocalize, periods }),
    ).toBe("Afternoon");
  });
});

describe("summariseTimeOfDay", () => {
  test("null renders as 'any'", () => {
    expect(summariseTimeOfDay(null, { hass: noLocalize, periods })).toBe("any");
  });

  test("period reference uses periodLabel", () => {
    expect(summariseTimeOfDay({ period: "afternoon" }, { hass: noLocalize, periods }))
      .toBe("Afternoon");
  });

  test("time range renders as HH:MM → HH:MM", () => {
    expect(summariseTimeOfDay(
      { from: { kind: "time", hh: 16, mm: 0 }, to: { kind: "time", hh: 18, mm: 30 } },
      { hass: noLocalize, periods },
    )).toBe("16:00 → 18:30");
  });

  test("sun-relative range uses anchor + offset", () => {
    expect(summariseTimeOfDay(
      {
        from: { kind: "sun", anchor: "sunset", offset_min: -30 },
        to: { kind: "time", hh: 22, mm: 0 },
      },
      { hass: noLocalize, periods },
    )).toBe("Sunset-30m → 22:00");
  });

  test("OR-list joins with comma", () => {
    expect(summariseTimeOfDay(
      [{ period: "afternoon" }, { from: { kind: "time", hh: 22, mm: 0 }, to: { kind: "time", hh: 23, mm: 0 } }],
      { hass: noLocalize, periods },
    )).toBe("Afternoon, 22:00 → 23:00");
  });
});

describe("summariseDay", () => {
  test("null is 'any'", () => {
    expect(summariseDay(null)).toBe("any");
  });

  test("empty include is 'any day'", () => {
    expect(summariseDay({ include: [], exclude: [] })).toBe("any day");
  });

  test("weekday include lists day names", () => {
    expect(summariseDay({ include: [{ kind: "weekday", days: [5, 6] }], exclude: [] }))
      .toBe("Sat/Sun");
  });

  test("include with exclude shows except clause", () => {
    const pred: DayPredicate = {
      include: [{ kind: "weekday", days: [0, 1, 2, 3, 4] }],
      exclude: [{ kind: "holiday" }],
    };
    expect(summariseDay(pred)).toBe("Mon/Tue/Wed/Thu/Fri (except holiday)");
  });

  test("formats date, date_range, day_of_month, and month-position kinds", () => {
    expect(summariseDay({ include: [{ kind: "date", month: 12, day: 25 }], exclude: [] }))
      .toBe("December 25");
    expect(summariseDay({
      include: [{ kind: "date_range", from: { month: 7, day: 15 }, to: { month: 8, day: 31 } }],
      exclude: [],
    })).toBe("July 15 → August 31");
    expect(summariseDay({ include: [{ kind: "day_of_month", days: "1-10, 15" }], exclude: [] }))
      .toBe("day 1-10, 15");
    expect(summariseDay({ include: [{ kind: "last_day" }], exclude: [] })).toBe("last day");
    expect(summariseDay({ include: [{ kind: "workday" }], exclude: [] })).toBe("workday");
    expect(summariseDay({ include: [{ kind: "first_workday" }], exclude: [] })).toBe("first workday");
    expect(summariseDay({ include: [{ kind: "last_workday" }], exclude: [] })).toBe("last workday");
  });

  test("summariseMatcher delegates day to summariseDay", () => {
    expect(
      summariseMatcher("day", { include: [{ kind: "weekday", days: [5, 6] }], exclude: [] }, {}),
    ).toBe("Sat/Sun");
  });
});

describe("summariseAction", () => {
  const info: ActionInfo = {
    name: "set_light",
    description: "",
    domains: ["light"],
    target_params: [
      { name: "brightness", type: "int", required: true, unit: "%" },
      { name: "transition", type: "number", required: false, unit: "s" },
    ],
  };

  test("action with multiple entities pluralises", () => {
    const action: ActionSpec = {
      action: "set_light",
      entity_ids: ["light.a", "light.b"],
      params: { brightness: 80 },
    };
    expect(summariseAction(action, info, { hass: noLocalize }))
      .toBe("Set light: 2 lights, brightness 80%");
  });

  test("action with one entity uses singular", () => {
    const action: ActionSpec = {
      action: "set_light",
      entity_ids: ["light.a"],
      params: { brightness: 80 },
    };
    expect(summariseAction(action, info, { hass: noLocalize }))
      .toBe("Set light: 1 light, brightness 80%");
  });

  test("action with no entities", () => {
    const action: ActionSpec = {
      action: "set_light",
      entity_ids: [],
      params: { brightness: 80 },
    };
    expect(summariseAction(action, info, { hass: noLocalize }))
      .toBe("Set light: (no targets), brightness 80%");
  });

  test("action with no params omits the params clause", () => {
    const action: ActionSpec = {
      action: "set_light",
      entity_ids: ["light.a"],
      params: {},
    };
    expect(summariseAction(action, info, { hass: noLocalize }))
      .toBe("Set light: 1 light");
  });

  test("uses actionLabel for the action name when hass.localize hits", () => {
    const hass = { localize: (k: string) =>
      k === "component.ambience.action.set_light" ? "Set light" : undefined };
    const action: ActionSpec = {
      action: "set_light",
      entity_ids: ["light.a"],
      params: { brightness: 50 },
    };
    expect(summariseAction(action, info, { hass }))
      .toBe("Set light: 1 light, brightness 50%");
  });

  test("appends param unit suffix when ParamSpec has unit", () => {
    const action: ActionSpec = {
      action: "set_light",
      entity_ids: ["light.a"],
      params: { brightness: 80, transition: 1.5 },
    };
    expect(summariseAction(action, info, { hass: noLocalize }))
      .toBe("Set light: 1 light, brightness 80%, transition 1.5s");
  });

  test("omits unit suffix when ParamSpec has no unit field", () => {
    const noUnitInfo: ActionInfo = {
      name: "set_light",
      description: "",
      domains: ["light"],
      target_params: [
        { name: "brightness", type: "int", required: true },
      ],
    };
    const action: ActionSpec = {
      action: "set_light",
      entity_ids: ["light.a"],
      params: { brightness: 50 },
    };
    expect(summariseAction(action, noUnitInfo, { hass: noLocalize }))
      .toBe("Set light: 1 light, brightness 50");
  });

  test("uses 'target' as fallback when info has no domains", () => {
    const action: ActionSpec = {
      action: "unknown",
      entity_ids: ["x.a", "x.b"],
      params: {},
    };
    expect(summariseAction(action, undefined, { hass: noLocalize }))
      .toBe("Unknown: 2 targets");
  });
});
