import { describe, test, expect } from "vitest";
import {
  ruleDisplayName,
  summariseMatcher,
  summariseTimeOfDay,
  summariseDay,
  summariseAction,
  summariseWeather,
  summariseState,
  summariseScript,
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

  test("falls back to the default when name is empty", () => {
    expect(ruleDisplayName({ name: "", when: {}, actions: [] })).toBe("New rule");
  });

  test("uses custom default placeholder", () => {
    expect(ruleDisplayName({ name: "", when: {}, actions: [] }, "Rule 3"))
      .toBe("Rule 3");
  });

  test("treats whitespace-only name as empty", () => {
    expect(ruleDisplayName({ name: "   ", when: {}, actions: [] })).toBe("New rule");
  });

  test("ignores a scene predicate — name is the only identifier", () => {
    expect(ruleDisplayName({ name: "", when: { scene: "movie" }, actions: [] }))
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
    kind: "standard",
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
      kind: "standard",
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

  test("script action summary includes script id and field values", () => {
    const scriptInfo: ActionInfo = {
      name: "script",
      description: "",
      domains: [],
      kind: "script",
      target_params: [],
    };
    const action: ActionSpec = {
      action: "script",
      script: "script.foo",
      entity_ids: ["light.a"],
      params: { brightness: 50 },
    };
    const out = summariseAction(action, scriptInfo, { hass: noLocalize });
    expect(out).toContain("script.foo");
    expect(out).toContain("50");
  });

  test("script action summary indicates when no script is chosen", () => {
    const scriptInfo: ActionInfo = {
      name: "script",
      description: "",
      domains: [],
      kind: "script",
      target_params: [],
    };
    const action: ActionSpec = {
      action: "script",
      entity_ids: [],
      params: {},
    };
    const out = summariseAction(action, scriptInfo, { hass: noLocalize });
    // Some indication that no script is chosen yet.
    expect(out.toLowerCase()).toMatch(/not selected|no script|\(.*\)/);
  });
});

test("summariseWeather formats group labels + thresholds", () => {
  const ctx = {
    weatherGroups: [
      { id: "wet", label: "Wet", conditions: ["rainy"] },
      { id: "sunny", label: "Sunny", conditions: ["sunny"] },
    ],
  };
  expect(summariseWeather({ groups: ["wet", "sunny"], thresholds: [] }, ctx))
    .toBe("Wet/Sunny");
  expect(summariseWeather({
    groups: [],
    thresholds: [{ attribute: "temperature", op: "<", value: 5 }],
  }, ctx)).toBe("Temperature < 5");
  expect(summariseWeather({
    groups: ["wet"],
    thresholds: [{ attribute: "humidity", op: ">=", value: 80 }],
  }, ctx)).toBe("Wet, Humidity ≥ 80");
  expect(summariseWeather(null, ctx)).toBe("any");
});

test("summariseWeather renders dangling group ids title-cased (no '?' suffix)", () => {
  // `stormy` and `cold_snap` aren't in the configured groups — simulates a
  // rule whose referenced group was renamed or deleted in the matcher config.
  const ctx = { weatherGroups: [{ id: "wet", label: "Wet", conditions: ["rainy"] }] };
  expect(summariseWeather({ groups: ["wet", "stormy"], thresholds: [] }, ctx))
    .toBe("Wet/Stormy");
  // Multi-word ids: split on underscore/dash/whitespace, capitalize each word.
  expect(summariseWeather({ groups: ["cold_snap", "heat-wave"], thresholds: [] }, ctx))
    .toBe("Cold Snap/Heat Wave");
});

test("summariseMatcher delegates weather", () => {
  const ctx = { weatherGroups: [{ id: "wet", label: "Wet", conditions: ["rainy"] }] };
  expect(summariseMatcher("weather", { groups: ["wet"], thresholds: [] }, ctx))
    .toBe("Wet");
});

test("summariseState renders a single atom", () => {
  expect(summariseState({
    kind: "is", entity_id: "person.bob", states: ["home", "work"],
  }, {})).toBe("person.bob is home/work");
});

test("summariseState renders is_not", () => {
  expect(summariseState({
    kind: "is_not", entity_id: "binary_sensor.door", states: ["on"],
  }, {})).toBe("binary_sensor.door is not on");
});

test("summariseState renders 'for' duration", () => {
  expect(summariseState({
    kind: "is", entity_id: "binary_sensor.door", states: ["on"],
    for: { h: 0, m: 5, s: 0 },
  }, {})).toBe("binary_sensor.door is on for ≥5m");
});

test("summariseState renders 'for' with multiple units", () => {
  expect(summariseState({
    kind: "is", entity_id: "x", states: ["on"], for: { h: 1, m: 30, s: 15 },
  }, {})).toBe("x is on for ≥1h 30m 15s");
});

test("summariseState renders AND group", () => {
  expect(summariseState({ kind: "and", items: [
    { kind: "is", entity_id: "a", states: ["on"] },
    { kind: "is", entity_id: "b", states: ["off"] },
  ]}, {})).toBe("a is on AND b is off");
});

test("summariseState renders OR group", () => {
  expect(summariseState({ kind: "or", items: [
    { kind: "is", entity_id: "a", states: ["on"] },
    { kind: "is", entity_id: "b", states: ["off"] },
  ]}, {})).toBe("a is on OR b is off");
});

test("summariseState renders NOT", () => {
  expect(summariseState({
    kind: "not",
    item: { kind: "is", entity_id: "a", states: ["on"] },
  }, {})).toBe("NOT a is on");
});

test("summariseState still parenthesises NOT around a group (so the scope is unambiguous)", () => {
  expect(summariseState({
    kind: "not",
    item: { kind: "and", items: [
      { kind: "is", entity_id: "a", states: ["on"] },
      { kind: "is", entity_id: "b", states: ["off"] },
    ]},
  }, {})).toBe("NOT (a is on AND b is off)");
});

test("summariseState renders nested groups with parens around inner groups", () => {
  expect(summariseState({ kind: "or", items: [
    { kind: "and", items: [
      { kind: "is", entity_id: "a", states: ["on"] },
      { kind: "is", entity_id: "b", states: ["off"] },
    ]},
    { kind: "is_not", entity_id: "c", states: ["open"] },
  ]}, {})).toBe("(a is on AND b is off) OR c is not open");
});

test("summariseState null is 'any'", () => {
  expect(summariseState(null, {})).toBe("any");
});

test("summariseMatcher dispatches state", () => {
  expect(summariseMatcher("state", {
    kind: "is", entity_id: "a", states: ["on"],
  }, {})).toBe("a is on");
});

test("summariseState renders an atom with an attribute as entity.attr", () => {
  expect(summariseState({
    kind: "is", entity_id: "media_player.x", attribute: "source",
    states: ["Spotify", "Tidal"],
  }, {})).toBe("media_player.x.source is Spotify/Tidal");
});

test("summariseState renders attribute-mode is_not", () => {
  expect(summariseState({
    kind: "is_not", entity_id: "light.x", attribute: "brightness",
    states: ["255"],
  }, {})).toBe("light.x.brightness is not 255");
});

test("summariseState falls back to entity-state when attribute is null/empty", () => {
  expect(summariseState({
    kind: "is", entity_id: "a", attribute: null, states: ["on"],
  }, {})).toBe("a is on");
  expect(summariseState({
    kind: "is", entity_id: "a", attribute: "", states: ["on"],
  }, {})).toBe("a is on");
});

test("summariseState renders numeric ops without slashes", () => {
  expect(summariseState({
    kind: ">", entity_id: "sensor.temp", states: ["21"],
  }, {})).toBe("sensor.temp > 21");
  expect(summariseState({
    kind: ">=", entity_id: "sensor.temp", states: ["21"],
  }, {})).toBe("sensor.temp ≥ 21");
  expect(summariseState({
    kind: "<", entity_id: "sensor.temp", states: ["5"],
  }, {})).toBe("sensor.temp < 5");
  expect(summariseState({
    kind: "<=", entity_id: "sensor.temp", states: ["5"],
  }, {})).toBe("sensor.temp ≤ 5");
});

test("summariseState renders numeric ops on attributes as 'entity.attr op N'", () => {
  expect(summariseState({
    kind: ">", entity_id: "light.x", attribute: "brightness", states: ["100"],
  }, {})).toBe("light.x.brightness > 100");
});

test("summariseState appends 'for' clause to a numeric atom", () => {
  expect(summariseState({
    kind: ">", entity_id: "sensor.x", states: ["10"], for: { h: 0, m: 5, s: 0 },
  }, {})).toBe("sensor.x > 10 for ≥5m");
});

test("summariseState uses the entity's friendly_name when one is available", () => {
  const hass = {
    states: {
      "binary_sensor.front_door": { attributes: { friendly_name: "Front door" } },
    },
  } as any;
  expect(summariseState({
    kind: "is", entity_id: "binary_sensor.front_door", states: ["on"],
  }, { hass })).toBe("Front door is on");
});

test("summariseState combines friendly_name with the attribute name", () => {
  const hass = {
    states: {
      "light.kitchen": { attributes: { friendly_name: "Kitchen light", brightness: 200 } },
    },
  } as any;
  expect(summariseState({
    kind: ">", entity_id: "light.kitchen", attribute: "brightness", states: ["100"],
  }, { hass })).toBe("Kitchen light.brightness > 100");
});

test("summariseState falls back to entity_id when no friendly_name is set", () => {
  const hass = {
    states: { "sensor.x": { attributes: {} } },
  } as any;
  expect(summariseState({
    kind: "is", entity_id: "sensor.x", states: ["on"],
  }, { hass })).toBe("sensor.x is on");
});

describe("summariseScript", () => {
  test("null predicate renders as '(any)'", () => {
    expect(summariseScript(null, { hass: noLocalize })).toBe("(any)");
  });

  test("no args renders the script id alone", () => {
    expect(summariseScript({ script: "script.foo" }, { hass: noLocalize }))
      .toBe("script.foo");
  });

  test("empty args object is treated as no args", () => {
    expect(summariseScript({ script: "script.foo", args: {} }, { hass: noLocalize }))
      .toBe("script.foo");
  });

  test("single arg renders as script.foo(k=v)", () => {
    expect(summariseScript({ script: "script.foo", args: { k: 7 } }, { hass: noLocalize }))
      .toBe("script.foo(k=7)");
  });

  test("multiple args render alphabetically by key", () => {
    expect(summariseScript(
      { script: "script.foo", args: { z: "down", k: 7 } },
      { hass: noLocalize },
    )).toBe("script.foo(k=7, z=down)");
  });

  test("malformed predicate (non-string script) falls back to String(pred)", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bad: any = { script: 123 };
    expect(summariseScript(bad, { hass: noLocalize })).toBe(String(bad));
  });

  test("malformed predicate (non-object) falls back to String(pred)", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bad: any = "not-an-object";
    expect(summariseScript(bad, { hass: noLocalize })).toBe("not-an-object");
  });
});

test("summariseMatcher dispatches script with no args", () => {
  expect(summariseMatcher(
    "script",
    { script: "script.foo" },
    { hass: noLocalize },
  )).toBe("script.foo");
});

test("summariseMatcher dispatches script with args (sorted)", () => {
  expect(summariseMatcher(
    "script",
    { script: "script.foo", args: { z: "down", k: 7 } },
    { hass: noLocalize },
  )).toBe("script.foo(k=7, z=down)");
});

test("summariseMatcher script with null predicate yields '(any)'", () => {
  expect(summariseMatcher("script", null, { hass: noLocalize })).toBe("(any)");
});
