import { describe, test, expect } from "vitest";
import {
  ruleDisplayName,
  summariseMatcher,
  summariseTimeOfDay,
  summariseDay,
  summariseAction,
  summariseWeather,
  summariseSun,
  summariseState,
  summariseScript,
  summarisePeople,
} from "../frontend/src/summary";
import type {
  ActionSpec,
  DayPredicate,
  ExposedAction,
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

  test("ignores a mode predicate — name is the only identifier", () => {
    expect(ruleDisplayName({ name: "", when: { mode: "movie" }, actions: [] }))
      .toBe("New rule");
  });
});

describe("summariseMatcher", () => {
  test("null predicate renders as '(any)'", () => {
    expect(summariseMatcher("mode", null, { hass: noLocalize, periods })).toBe("(any)");
  });

  test("mode predicate renders as the raw string", () => {
    expect(summariseMatcher("mode", "movie", { hass: noLocalize, periods })).toBe("movie");
  });

  test("time_of_day predicate delegates to summariseTimeOfDay", () => {
    expect(
      summariseMatcher("time_of_day", { period: "afternoon" }, { hass: noLocalize, periods }),
    ).toBe("Afternoon");
  });

  test("people predicate delegates to summarisePeople (not [object Object])", () => {
    expect(
      summariseMatcher("people", { quant: "nobody", where: "home" }, { hass: noLocalize, periods }),
    ).toBe("Nobody is at Home");
  });

  test("template predicate renders the template string (not [object Object])", () => {
    expect(
      summariseMatcher("template", { template: "{{ is_state('x','on') }}" }, { hass: noLocalize, periods }),
    ).toBe("{{ is_state('x','on') }}");
  });

  test("null template predicate renders as '(any)'", () => {
    expect(summariseMatcher("template", null, { hass: noLocalize, periods })).toBe("(any)");
  });
});

describe("summarisePeople", () => {
  const hassPeople = {
    localize: () => undefined,
    states: {
      "person.alice": { attributes: { friendly_name: "Alice" } },
      "person.bob": { attributes: { friendly_name: "Bob" } },
      "person.clinton": { attributes: { friendly_name: "Clinton" } },
      "zone.work": { attributes: { friendly_name: "Work" } },
    },
  };

  test("null predicate renders as 'any'", () => {
    expect(summarisePeople(null)).toBe("any");
  });

  test("base modes (no who key) render as 'X is at Home'", () => {
    expect(summarisePeople({ quant: "everyone", where: "home" })).toBe("Everybody is at Home");
    expect(summarisePeople({ quant: "any", where: "home" })).toBe("Anybody is at Home");
    expect(summarisePeople({ quant: "nobody", where: "home" })).toBe("Nobody is at Home");
  });

  test("empty predicate defaults to everybody at home", () => {
    expect(summarisePeople({})).toBe("Everybody is at Home");
  });

  test("negate renders as 'is not at <Location>'", () => {
    expect(summarisePeople({ quant: "everyone", where: "home", negate: true })).toBe(
      "Everybody is not at Home",
    );
    expect(
      summarisePeople({ who: ["person.alice", "person.bob"], quant: "any", where: "zone.work", negate: true }, { hass: hassPeople }),
    ).toBe("Any of: (Alice, Bob) is not at Work");
  });

  test("X-of modes (multi-person) show the mode label and names in parens", () => {
    expect(
      summarisePeople(
        { who: ["person.clinton", "person.alice"], quant: "nobody", where: "home" },
        { hass: hassPeople },
      ),
    ).toBe("None of: (Clinton, Alice) is at Home");
    expect(
      summarisePeople(
        { who: ["person.alice", "person.bob"], quant: "everyone", where: "home" },
        { hass: hassPeople },
      ),
    ).toBe("All of: (Alice, Bob) is at Home");
    expect(
      summarisePeople(
        { who: ["person.alice", "person.bob"], quant: "any", where: "home" },
        { hass: hassPeople },
      ),
    ).toBe("Any of: (Alice, Bob) is at Home");
  });

  test("single-person list drops the wrapper: '<Name> is [not] at <Location>'", () => {
    // any: positive.
    expect(
      summarisePeople({ who: ["person.clinton"], quant: "any", where: "home" }, { hass: hassPeople }),
    ).toBe("Clinton is at Home");
    // nobody: effectiveNot true → "is not at".
    expect(
      summarisePeople({ who: ["person.clinton"], quant: "nobody", where: "home" }, { hass: hassPeople }),
    ).toBe("Clinton is not at Home");
    // everyone + negate:true → effectiveNot true → "is not at".
    expect(
      summarisePeople({ who: ["person.alice"], quant: "everyone", where: "zone.work", negate: true }, { hass: hassPeople }),
    ).toBe("Alice is not at Work");
    // nobody + negate:true → XOR resolves to false → "is at".
    expect(
      summarisePeople({ who: ["person.clinton"], quant: "nobody", where: "home", negate: true }, { hass: hassPeople }),
    ).toBe("Clinton is at Home");
  });

  test("single-person list keeps the 'for' suffix", () => {
    expect(
      summarisePeople({ who: ["person.clinton"], quant: "any", where: "home", for: { h: 0, m: 10, s: 0 } }, { hass: hassPeople }),
    ).toBe("Clinton is at Home for ≥10m");
  });

  test("zone location renders as 'is at <Zone>' (multi-person keeps wrapper)", () => {
    expect(
      summarisePeople({ who: ["person.alice", "person.bob"], quant: "any", where: "zone.work" }, { hass: hassPeople }),
    ).toBe("Any of: (Alice, Bob) is at Work");
  });

  test("duration suffix", () => {
    expect(summarisePeople({ quant: "everyone", where: "home", for: { h: 0, m: 10, s: 0 } }))
      .toBe("Everybody is at Home for ≥10m");
  });

  test("falls back to humanised ids when no friendly names (multi-person keeps wrapper)", () => {
    expect(summarisePeople({ who: ["person.carol", "person.dave"], quant: "any", where: "zone.gym" }))
      .toBe("Any of: (Carol, Dave) is at Gym");
  });

  test("falls back to humanised ids for a single-person list too", () => {
    expect(summarisePeople({ who: ["person.carol"], quant: "any", where: "zone.gym" }))
      .toBe("Carol is at Gym");
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
    expect(summariseDay(pred)).toBe("Mon/Tue/Wed/Thu/Fri (except Holiday)");
  });

  test("formats date, date_range, day_of_month, and month-position kinds", () => {
    expect(summariseDay({ include: [{ kind: "date", month: 12, day: 25 }], exclude: [] }))
      .toBe("December 25");
    expect(summariseDay({
      include: [{ kind: "date_range", from: { month: 7, day: 15 }, to: { month: 8, day: 31 } }],
      exclude: [],
    })).toBe("July 15 → August 31");
    expect(summariseDay({ include: [{ kind: "day_of_month", days: "1-10, 15" }], exclude: [] }))
      .toBe("Day 1-10, 15");
    expect(summariseDay({ include: [{ kind: "last_day" }], exclude: [] })).toBe("Last day");
    expect(summariseDay({ include: [{ kind: "workday" }], exclude: [] })).toBe("Workday");
    expect(summariseDay({ include: [{ kind: "first_workday" }], exclude: [] })).toBe("First workday");
    expect(summariseDay({ include: [{ kind: "last_workday" }], exclude: [] })).toBe("Last workday");
  });

  test("summariseMatcher delegates day to summariseDay", () => {
    expect(
      summariseMatcher("day", { include: [{ kind: "weekday", days: [5, 6] }], exclude: [] }, {}),
    ).toBe("Sat/Sun");
  });
});

describe("summariseAction", () => {
  const exposedActions: ExposedAction[] = [
    {
      id: "light.turn_on",
      label: "Set light",
      visible_fields: ["brightness", "transition"],
      defaults: {},
    },
  ];

  test("action with multiple entities pluralises by domain", () => {
    const action: ActionSpec = {
      service: "light.turn_on",
      entity_ids: ["light.a", "light.b"],
      params: { brightness: 80 },
    };
    expect(summariseAction(action, { hass: noLocalize, exposedActions }))
      .toBe("Set light: 2 lights, Brightness: 80");
  });

  test("action with one entity uses singular", () => {
    const action: ActionSpec = {
      service: "light.turn_on",
      entity_ids: ["light.a"],
      params: { brightness: 80 },
    };
    expect(summariseAction(action, { hass: noLocalize, exposedActions }))
      .toBe("Set light: 1 light, Brightness: 80");
  });

  test("action with no entities", () => {
    const action: ActionSpec = {
      service: "light.turn_on",
      entity_ids: [],
      params: { brightness: 80 },
    };
    expect(summariseAction(action, { hass: noLocalize, exposedActions }))
      .toBe("Set light: (no targets), Brightness: 80");
  });

  test("action with no params omits the params clause", () => {
    const action: ActionSpec = {
      service: "light.turn_on",
      entity_ids: ["light.a"],
      params: {},
    };
    expect(summariseAction(action, { hass: noLocalize, exposedActions }))
      .toBe("Set light: 1 light");
  });

  test("ExposedAction.label takes precedence over hass.localize", () => {
    const hass = { localize: (k: string) =>
      k === "component.ambience.action.light.turn_on" ? "Localised" : undefined };
    const action: ActionSpec = {
      service: "light.turn_on",
      entity_ids: ["light.a"],
      params: { brightness: 50 },
    };
    expect(summariseAction(action, { hass, exposedActions }))
      .toBe("Set light: 1 light, Brightness: 50");
  });

  test("falls back to hass.localize when exposed list omits the service", () => {
    const hass = { localize: (k: string) =>
      k === "component.ambience.action.light.turn_on" ? "Set light" : undefined };
    const action: ActionSpec = {
      service: "light.turn_on",
      entity_ids: ["light.a"],
      params: { brightness: 50 },
    };
    expect(summariseAction(action, { hass }))
      .toBe("Set light: 1 light, Brightness: 50");
  });

  test("multiple params render comma-separated", () => {
    const action: ActionSpec = {
      service: "light.turn_on",
      entity_ids: ["light.a"],
      params: { brightness: 80, transition: 1.5 },
    };
    expect(summariseAction(action, { hass: noLocalize, exposedActions }))
      .toBe("Set light: 1 light, Brightness: 80, Transition: 1.5");
  });

  test("array param values render with [ ] brackets", () => {
    const action: ActionSpec = {
      service: "light.turn_on",
      entity_ids: ["light.a"],
      params: { rgb_color: [210, 81, 81], brightness_pct: 31 },
    };
    expect(summariseAction(action, { hass: noLocalize, exposedActions }))
      .toBe("Set light: 1 light, Rgb color: [210,81,81], Brightness pct: 31");
  });

  test("uses HA's field.name from schema when available", () => {
    const action: ActionSpec = {
      service: "light.turn_on",
      entity_ids: ["light.a"],
      params: { brightness_pct: 31, rgb_color: [210, 81, 81] },
    };
    const schemas = {
      "light.turn_on": {
        fields: {
          brightness_pct: { name: "Brightness", selector: {} },
          rgb_color: { name: "RGB Color", selector: {} },
        },
        target: null,
      },
    };
    expect(summariseAction(action, { hass: noLocalize, exposedActions, schemas }))
      .toBe("Set light: 1 light, Brightness: 31, RGB Color: [210,81,81]");
  });

  test("falls back to humanized id when schema lacks field.name for a field", () => {
    const action: ActionSpec = {
      service: "light.turn_on",
      entity_ids: ["light.a"],
      params: { brightness_pct: 31, transition: 2 },
    };
    const schemas = {
      "light.turn_on": {
        fields: {
          brightness_pct: { name: "Brightness", selector: {} },
          transition: { selector: {} },  // no name attribute
        },
        target: null,
      },
    };
    expect(summariseAction(action, { hass: noLocalize, exposedActions, schemas }))
      .toBe("Set light: 1 light, Brightness: 31, Transition: 2");
  });

  test("uses domain prefix as fallback target noun (no exposed entry)", () => {
    const action: ActionSpec = {
      service: "x.unknown",
      entity_ids: ["x.a", "x.b"],
      params: {},
    };
    // Domain "x" is the noun; service id ("X.unknown") is the fallback label.
    expect(summariseAction(action, { hass: noLocalize }))
      .toBe("X.unknown: 2 xs");
  });

  test("script.<id> service is just another action", () => {
    const action: ActionSpec = {
      service: "script.foo",
      entity_ids: [],
      params: { msg: "hello" },
    };
    const out = summariseAction(action, { hass: noLocalize });
    // Service id is used verbatim as the action name fallback (after the
    // snake-case → title-case humaniser).
    expect(out).toContain("Script.foo");
    expect(out).toContain("Msg: hello");
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

test("summariseSun formats elevation bands, azimuth sectors and ranges", () => {
  expect(summariseSun({ elevation: { min: 0, max: 30 } })).toBe("0°–30°");
  expect(summariseSun({ elevation: { min: 10 } })).toBe("≥10°");
  expect(summariseSun({ elevation: { max: 30 } })).toBe("≤30°");
  expect(summariseSun({ azimuth: { sectors: ["S", "SW"] } })).toBe("S/SW");
  expect(summariseSun({ azimuth: { ranges: [{ from: 200, to: 250 }] } })).toBe("200°–250°");
  expect(summariseSun({ elevation: { max: 20 }, azimuth: { sectors: ["W"] } })).toBe("≤20°, W");
  expect(summariseSun(null)).toBe("any");
});

test("summariseMatcher dispatches the sun matcher", () => {
  expect(summariseMatcher("sun", { azimuth: { sectors: ["W"] } }, {})).toBe("W");
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
