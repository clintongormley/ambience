import { describe, expect, test } from "vitest";
import { AMBIENCE_STRINGS } from "../frontend/src/i18n-data";
import {
  sceneDisplayName,
  summariseAction,
  summariseBlocker,
  summariseCondition,
  summariseDay,
  summarisePeople,
  summariseScript,
  summariseState,
  summariseSun,
  summariseTimeOfDay,
  summariseWeather,
} from "../frontend/src/summary";
import type {
  ActionSpec,
  DayPredicate,
  ExposedAction,
  OccupancyPredicate,
  PeoplePredicate,
  PeriodStoreView,
  Scene,
  StatePredicate,
  SunPredicate,
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

describe("sceneDisplayName", () => {
  test("returns the name when set", () => {
    expect(sceneDisplayName({ name: "My scene", when: {}, actions: [] })).toBe("My scene");
  });

  test("falls back to the default when name is empty", () => {
    expect(sceneDisplayName({ name: "", when: {}, actions: [] })).toBe("New scene");
  });

  test("uses custom default placeholder", () => {
    expect(sceneDisplayName({ name: "", when: {}, actions: [] }, "Scene 3")).toBe("Scene 3");
  });

  test("treats whitespace-only name as empty", () => {
    expect(sceneDisplayName({ name: "   ", when: {}, actions: [] })).toBe("New scene");
  });

  test("ignores a mode predicate — name is the only identifier", () => {
    expect(sceneDisplayName({ name: "", when: { mode: "movie" }, actions: [] })).toBe("New scene");
  });
});

describe("summariseCondition", () => {
  test("null predicate renders as '(any)'", () => {
    expect(summariseCondition("mode", null, { hass: noLocalize, periods })).toBe("(any)");
  });

  test("mode predicate renders as the raw string", () => {
    expect(summariseCondition("mode", "movie", { hass: noLocalize, periods })).toBe("movie");
  });

  test("time_of_day predicate delegates to summariseTimeOfDay", () => {
    expect(
      summariseCondition("time_of_day", { period: "afternoon" }, { hass: noLocalize, periods }),
    ).toBe("Afternoon");
  });

  test("people predicate delegates to summarisePeople (not [object Object])", () => {
    expect(
      summariseCondition(
        "people",
        { quant: "nobody", where: "home" },
        { hass: noLocalize, periods },
      ),
    ).toBe("Nobody is at Home");
  });

  test("template predicate renders the template string (not [object Object])", () => {
    expect(
      summariseCondition(
        "template",
        { template: "{{ is_state('x','on') }}" },
        { hass: noLocalize, periods },
      ),
    ).toBe("{{ is_state('x','on') }}");
  });

  test("null template predicate renders as '(any)'", () => {
    expect(summariseCondition("template", null, { hass: noLocalize, periods })).toBe("(any)");
  });

  test("unavailable predicate delegates to summariseUnavailable (not [object Object])", () => {
    expect(
      summariseCondition("unavailable", { entities: ["binary_sensor.a"] }, { hass: noLocalize }),
    ).toBe("binary_sensor.a unavailable");
  });

  test("unavailable with multiple entities reads 'any of (...) unavailable'", () => {
    expect(
      summariseCondition(
        "unavailable",
        { entities: ["binary_sensor.a", "light.b"] },
        { hass: noLocalize },
      ),
    ).toBe("any of (binary_sensor.a, light.b) unavailable");
  });

  test("unavailable with no entities renders as 'any'", () => {
    expect(summariseCondition("unavailable", { entities: [] }, { hass: noLocalize })).toBe("any");
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
      summarisePeople(
        { who: ["person.alice", "person.bob"], quant: "any", where: "zone.work", negate: true },
        { hass: hassPeople },
      ),
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
      summarisePeople(
        { who: ["person.clinton"], quant: "any", where: "home" },
        { hass: hassPeople },
      ),
    ).toBe("Clinton is at Home");
    // nobody: effectiveNot true → "is not at".
    expect(
      summarisePeople(
        { who: ["person.clinton"], quant: "nobody", where: "home" },
        { hass: hassPeople },
      ),
    ).toBe("Clinton is not at Home");
    // everyone + negate:true → effectiveNot true → "is not at".
    expect(
      summarisePeople(
        { who: ["person.alice"], quant: "everyone", where: "zone.work", negate: true },
        { hass: hassPeople },
      ),
    ).toBe("Alice is not at Work");
    // nobody + negate:true → XOR resolves to false → "is at".
    expect(
      summarisePeople(
        { who: ["person.clinton"], quant: "nobody", where: "home", negate: true },
        { hass: hassPeople },
      ),
    ).toBe("Clinton is at Home");
  });

  test("single-person list keeps the 'for' suffix", () => {
    expect(
      summarisePeople(
        { who: ["person.clinton"], quant: "any", where: "home", for: { h: 0, m: 10, s: 0 } },
        { hass: hassPeople },
      ),
    ).toBe("Clinton is at Home for ≥10m");
  });

  test("zone location renders as 'is at <Zone>' (multi-person keeps wrapper)", () => {
    expect(
      summarisePeople(
        { who: ["person.alice", "person.bob"], quant: "any", where: "zone.work" },
        { hass: hassPeople },
      ),
    ).toBe("Any of: (Alice, Bob) is at Work");
  });

  test("duration suffix", () => {
    expect(summarisePeople({ quant: "everyone", where: "home", for: { h: 0, m: 10, s: 0 } })).toBe(
      "Everybody is at Home for ≥10m",
    );
  });

  test("falls back to humanised ids when no friendly names (multi-person keeps wrapper)", () => {
    expect(
      summarisePeople({ who: ["person.carol", "person.dave"], quant: "any", where: "zone.gym" }),
    ).toBe("Any of: (Carol, Dave) is at Gym");
  });

  test("falls back to humanised ids for a single-person list too", () => {
    expect(summarisePeople({ who: ["person.carol"], quant: "any", where: "zone.gym" })).toBe(
      "Carol is at Gym",
    );
  });
});

describe("summariseTimeOfDay", () => {
  test("null renders as 'any'", () => {
    expect(summariseTimeOfDay(null, { hass: noLocalize, periods })).toBe("any");
  });

  test("period reference uses periodLabel", () => {
    expect(summariseTimeOfDay({ period: "afternoon" }, { hass: noLocalize, periods })).toBe(
      "Afternoon",
    );
  });

  test("time range renders as HH:MM → HH:MM", () => {
    expect(
      summariseTimeOfDay(
        { from: { kind: "time", hh: 16, mm: 0 }, to: { kind: "time", hh: 18, mm: 30 } },
        { hass: noLocalize, periods },
      ),
    ).toBe("16:00 → 18:30");
  });

  test("sun-relative range uses anchor + offset", () => {
    expect(
      summariseTimeOfDay(
        {
          from: { kind: "sun", anchor: "sunset", offset_min: -30 },
          to: { kind: "time", hh: 22, mm: 0 },
        },
        { hass: noLocalize, periods },
      ),
    ).toBe("Sunset-30m → 22:00");
  });

  test("OR-list joins with comma", () => {
    expect(
      summariseTimeOfDay(
        [
          { period: "afternoon" },
          { from: { kind: "time", hh: 22, mm: 0 }, to: { kind: "time", hh: 23, mm: 0 } },
        ],
        { hass: noLocalize, periods },
      ),
    ).toBe("Afternoon, 22:00 → 23:00");
  });

  test("summarises a not-before clamp suffix on a sun endpoint", () => {
    const pred = {
      from: {
        kind: "sun",
        anchor: "sunrise",
        offset_min: 0,
        clamp: { dir: "not_before", hh: 8, mm: 30 },
      },
      to: { kind: "sun", anchor: "dusk", offset_min: 0 },
    } as any;
    expect(summariseTimeOfDay(pred, {})).toBe("Sunrise (not before 08:30) → Dusk");
  });

  test("summarises a not-after clamp suffix", () => {
    const pred = {
      from: { kind: "sun", anchor: "sunrise", offset_min: 0 },
      to: {
        kind: "sun",
        anchor: "sunset",
        offset_min: 0,
        clamp: { dir: "not_after", hh: 22, mm: 0 },
      },
    } as any;
    expect(summariseTimeOfDay(pred, {})).toBe("Sunrise → Sunset (not after 22:00)");
  });

  test("clamp suffix composes with an offset", () => {
    const pred = {
      from: {
        kind: "sun",
        anchor: "sunrise",
        offset_min: 60,
        clamp: { dir: "not_before", hh: 8, mm: 30 },
      },
      to: { kind: "sun", anchor: "dusk", offset_min: 0 },
    } as any;
    expect(summariseTimeOfDay(pred, {})).toBe("Sunrise+1h (not before 08:30) → Dusk");
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
    expect(summariseDay({ include: [{ kind: "weekday", days: [5, 6] }], exclude: [] })).toBe(
      "Sat/Sun",
    );
  });

  test("include with exclude shows except clause", () => {
    const pred: DayPredicate = {
      include: [{ kind: "weekday", days: [0, 1, 2, 3, 4] }],
      exclude: [{ kind: "holiday" }],
    };
    // "holiday" is lowercase in the bundled day_summary strings (matching en.json).
    expect(summariseDay(pred)).toBe("Mon/Tue/Wed/Thu/Fri (except holiday)");
  });

  test("formats date, date_range, day_of_month, and month-position kinds", () => {
    expect(summariseDay({ include: [{ kind: "date", month: 12, day: 25 }], exclude: [] })).toBe(
      "December 25",
    );
    expect(
      summariseDay({
        include: [{ kind: "date_range", from: { month: 7, day: 15 }, to: { month: 8, day: 31 } }],
        exclude: [],
      }),
    ).toBe("July 15 → August 31");
    // day_summary strings are lowercase in the bundle (matching en.json).
    expect(
      summariseDay({ include: [{ kind: "day_of_month", days: "1-10, 15" }], exclude: [] }),
    ).toBe("day 1-10, 15");
    expect(summariseDay({ include: [{ kind: "last_day" }], exclude: [] })).toBe("last day");
    expect(summariseDay({ include: [{ kind: "workday" }], exclude: [] })).toBe("workday");
    expect(summariseDay({ include: [{ kind: "first_workday" }], exclude: [] })).toBe(
      "first workday",
    );
    expect(summariseDay({ include: [{ kind: "last_workday" }], exclude: [] })).toBe("last workday");
  });

  test("summariseCondition delegates day to summariseDay", () => {
    expect(
      summariseCondition("day", { include: [{ kind: "weekday", days: [5, 6] }], exclude: [] }, {}),
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
    expect(summariseAction(action, { hass: noLocalize, exposedActions })).toBe(
      "Set light: 2 lights, Brightness: 80",
    );
  });

  test("action with one entity uses singular", () => {
    const action: ActionSpec = {
      service: "light.turn_on",
      entity_ids: ["light.a"],
      params: { brightness: 80 },
    };
    expect(summariseAction(action, { hass: noLocalize, exposedActions })).toBe(
      "Set light: 1 light, Brightness: 80",
    );
  });

  test("action with no entities", () => {
    const action: ActionSpec = {
      service: "light.turn_on",
      entity_ids: [],
      params: { brightness: 80 },
    };
    expect(summariseAction(action, { hass: noLocalize, exposedActions })).toBe(
      "Set light: (no targets), Brightness: 80",
    );
  });

  test("action with no params omits the params clause", () => {
    const action: ActionSpec = {
      service: "light.turn_on",
      entity_ids: ["light.a"],
      params: {},
    };
    expect(summariseAction(action, { hass: noLocalize, exposedActions })).toBe(
      "Set light: 1 light",
    );
  });

  test("ExposedAction.label takes precedence over hass.localize", () => {
    const hass = {
      localize: (k: string) =>
        k === "component.ambience.action.light.turn_on" ? "Localised" : undefined,
    };
    const action: ActionSpec = {
      service: "light.turn_on",
      entity_ids: ["light.a"],
      params: { brightness: 50 },
    };
    expect(summariseAction(action, { hass, exposedActions })).toBe(
      "Set light: 1 light, Brightness: 50",
    );
  });

  test("falls back to hass.localize when exposed list omits the service", () => {
    const hass = {
      localize: (k: string) =>
        k === "component.ambience.action.light.turn_on" ? "Set light" : undefined,
    };
    const action: ActionSpec = {
      service: "light.turn_on",
      entity_ids: ["light.a"],
      params: { brightness: 50 },
    };
    expect(summariseAction(action, { hass })).toBe("Set light: 1 light, Brightness: 50");
  });

  test("multiple params render comma-separated", () => {
    const action: ActionSpec = {
      service: "light.turn_on",
      entity_ids: ["light.a"],
      params: { brightness: 80, transition: 1.5 },
    };
    expect(summariseAction(action, { hass: noLocalize, exposedActions })).toBe(
      "Set light: 1 light, Brightness: 80, Transition: 1.5",
    );
  });

  test("array param values render with [ ] brackets", () => {
    const action: ActionSpec = {
      service: "light.turn_on",
      entity_ids: ["light.a"],
      params: { rgb_color: [210, 81, 81], brightness_pct: 31 },
    };
    expect(summariseAction(action, { hass: noLocalize, exposedActions })).toBe(
      "Set light: 1 light, Rgb color: [210,81,81], Brightness pct: 31",
    );
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
    expect(summariseAction(action, { hass: noLocalize, exposedActions, schemas })).toBe(
      "Set light: 1 light, Brightness: 31, RGB Color: [210,81,81]",
    );
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
          transition: { selector: {} }, // no name attribute
        },
        target: null,
      },
    };
    expect(summariseAction(action, { hass: noLocalize, exposedActions, schemas })).toBe(
      "Set light: 1 light, Brightness: 31, Transition: 2",
    );
  });

  test("uses domain prefix as fallback target noun (no exposed entry)", () => {
    const action: ActionSpec = {
      service: "x.unknown",
      entity_ids: ["x.a", "x.b"],
      params: {},
    };
    // Domain "x" is the noun; service id ("X.unknown") is the fallback label.
    expect(summariseAction(action, { hass: noLocalize })).toBe("X.unknown: 2 xs");
  });

  test("target noun comes from the entity domain, not the service domain (fado.fade_lights → lights)", () => {
    // fado.fade_lights is a fado-integration service that acts on light
    // entities. The count noun must follow the targets ("lights"), not the
    // service's own domain ("fados").
    const action: ActionSpec = {
      service: "fado.fade_lights",
      entity_ids: ["light.a", "light.b", "light.c"],
      params: { brightness: 40 },
    };
    const exposed: ExposedAction[] = [
      { id: "fado.fade_lights", label: "Fade lights", visible_fields: [], defaults: {} },
    ];
    expect(summariseAction(action, { hass: noLocalize, exposedActions: exposed })).toBe(
      "Fade lights: 3 lights, Brightness: 40",
    );
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

  test("target-valued param renders friendly entity names", () => {
    const hass = {
      localize: () => undefined,
      states: { "light.kitchen": { attributes: { friendly_name: "Kitchen" } } },
    };
    const action: ActionSpec = {
      service: "script.dim",
      entity_ids: [],
      params: { target: { entity_id: ["light.kitchen"] } },
    };
    expect(summariseAction(action, { hass })).toBe("Script.dim: (no targets), Target: [Kitchen]");
  });
});

test("summariseWeather formats group labels + thresholds", () => {
  const ctx = {
    weatherGroups: [
      { id: "wet", label: "Wet", conditions: ["rainy"] },
      { id: "sunny", label: "Sunny", conditions: ["sunny"] },
    ],
  };
  expect(summariseWeather({ groups: ["wet", "sunny"], thresholds: [] }, ctx)).toBe("Wet/Sunny");
  expect(
    summariseWeather(
      {
        groups: [],
        thresholds: [{ attribute: "temperature", op: "<", value: 5 }],
      },
      ctx,
    ),
  ).toBe("Temperature < 5");
  expect(
    summariseWeather(
      {
        groups: ["wet"],
        thresholds: [{ attribute: "humidity", op: ">=", value: 80 }],
      },
      ctx,
    ),
  ).toBe("Wet, Humidity ≥ 80");
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

test("summariseCondition dispatches the sun condition", () => {
  expect(summariseCondition("sun", { azimuth: { sectors: ["W"] } }, {})).toBe("W");
});

test("summariseWeather renders dangling group ids title-cased (no '?' suffix)", () => {
  // `stormy` and `cold_snap` aren't in the configured groups — simulates a
  // scene whose referenced group was renamed or deleted in the condition config.
  const ctx = { weatherGroups: [{ id: "wet", label: "Wet", conditions: ["rainy"] }] };
  expect(summariseWeather({ groups: ["wet", "stormy"], thresholds: [] }, ctx)).toBe("Wet/Stormy");
  // Multi-word ids: split on underscore/dash/whitespace, capitalize each word.
  expect(summariseWeather({ groups: ["cold_snap", "heat-wave"], thresholds: [] }, ctx)).toBe(
    "Cold Snap/Heat Wave",
  );
});

test("summariseCondition delegates weather", () => {
  const ctx = { weatherGroups: [{ id: "wet", label: "Wet", conditions: ["rainy"] }] };
  expect(summariseCondition("weather", { groups: ["wet"], thresholds: [] }, ctx)).toBe("Wet");
});

test("summariseOccupancy: single sensor occupied", () => {
  const hass = {
    states: { "binary_sensor.lounge": { attributes: { friendly_name: "Lounge" } } },
  } as any;
  expect(
    summariseCondition(
      "occupancy",
      { sensors: ["binary_sensor.lounge"], occupied: true },
      { hass },
    ),
  ).toBe("Lounge is detected");
});

test("summariseOccupancy: vacant with for", () => {
  const hass = {
    states: { "binary_sensor.lounge": { attributes: { friendly_name: "Lounge" } } },
  } as any;
  expect(
    summariseCondition(
      "occupancy",
      { sensors: ["binary_sensor.lounge"], occupied: false, for: { h: 0, m: 5, s: 0 } },
      { hass },
    ),
  ).toBe("Lounge is clear for ≥5m");
});

test("summariseOccupancy: multiple sensors with quant", () => {
  const hass = {
    states: {
      "binary_sensor.a": { attributes: { friendly_name: "Lounge" } },
      "binary_sensor.b": { attributes: { friendly_name: "Hall" } },
    },
  } as any;
  expect(
    summariseCondition(
      "occupancy",
      { sensors: ["binary_sensor.a", "binary_sensor.b"], occupied: true, quant: "all" },
      { hass },
    ),
  ).toBe("all of (Lounge, Hall) detected");
});

test("summariseOccupancy: negated single sensor with for", () => {
  const hass = {
    states: { "binary_sensor.lounge": { attributes: { friendly_name: "Lounge" } } },
  } as any;
  expect(
    summariseCondition(
      "occupancy",
      {
        sensors: ["binary_sensor.lounge"],
        occupied: false,
        negate: true,
        for: { h: 0, m: 20, s: 0 },
      },
      { hass },
    ),
  ).toBe("Lounge is not clear for ≥20m");
});

test("summariseOccupancy: negated multiple sensors with quant", () => {
  const hass = {
    states: {
      "binary_sensor.a": { attributes: { friendly_name: "Lounge" } },
      "binary_sensor.b": { attributes: { friendly_name: "Hall" } },
    },
  } as any;
  expect(
    summariseCondition(
      "occupancy",
      {
        sensors: ["binary_sensor.a", "binary_sensor.b"],
        occupied: true,
        quant: "any",
        negate: true,
      },
      { hass },
    ),
  ).toBe("any of (Lounge, Hall) not detected");
});

test("summariseOccupancy: null is 'any'", () => {
  expect(summariseCondition("occupancy", null, {})).toBe("(any)");
});

test("summariseLux: single sensor named range", () => {
  const hass = {
    states: { "sensor.lounge": { attributes: { friendly_name: "Lounge" } } },
  } as any;
  expect(summariseCondition("lux", { sensors: ["sensor.lounge"], range: "dark" }, { hass })).toBe(
    "Lounge Dark",
  );
});

test("summariseLux: single sensor inline band", () => {
  const hass = {
    states: { "sensor.lounge": { attributes: { friendly_name: "Lounge" } } },
  } as any;
  expect(
    summariseCondition("lux", { sensors: ["sensor.lounge"], min: 50, max: 300 }, { hass }),
  ).toBe("Lounge 50–300 lx");
});

test("summariseLux: open-ended bands", () => {
  const hass = {
    states: { "sensor.lounge": { attributes: { friendly_name: "Lounge" } } },
  } as any;
  expect(summariseCondition("lux", { sensors: ["sensor.lounge"], min: 1000 }, { hass })).toBe(
    "Lounge ≥1000 lx",
  );
  expect(summariseCondition("lux", { sensors: ["sensor.lounge"], max: 10 }, { hass })).toBe(
    "Lounge <10 lx",
  );
});

test("summariseLux: multiple sensors with quant and custom label", () => {
  const hass = {
    states: {
      "sensor.a": { attributes: { friendly_name: "Lounge" } },
      "sensor.b": { attributes: { friendly_name: "Hall" } },
    },
  } as any;
  const luxRanges = {
    builtins: {},
    custom: { gloomy: { min: 5, max: 30, label: "Gloomy" } },
    hidden: [],
  };
  expect(
    summariseCondition(
      "lux",
      { sensors: ["sensor.a", "sensor.b"], range: "gloomy", quant: "all" },
      { hass, luxRanges },
    ),
  ).toBe("all of (Lounge, Hall) Gloomy");
});

test("summariseLux: null is 'any'", () => {
  expect(summariseCondition("lux", null, {})).toBe("(any)");
});

test("summariseState renders a single atom", () => {
  expect(
    summariseState(
      {
        kind: "is",
        entity_id: "person.bob",
        states: ["home", "work"],
      },
      {},
    ),
  ).toBe("person.bob is home/work");
});

test("summariseState renders is_not", () => {
  expect(
    summariseState(
      {
        kind: "is_not",
        entity_id: "binary_sensor.door",
        states: ["on"],
      },
      {},
    ),
  ).toBe("binary_sensor.door is not on");
});

test("summariseState renders 'for' duration", () => {
  expect(
    summariseState(
      {
        kind: "is",
        entity_id: "binary_sensor.door",
        states: ["on"],
        for: { h: 0, m: 5, s: 0 },
      },
      {},
    ),
  ).toBe("binary_sensor.door is on for ≥5m");
});

test("summariseState renders 'for' with multiple units", () => {
  expect(
    summariseState(
      {
        kind: "is",
        entity_id: "x",
        states: ["on"],
        for: { h: 1, m: 30, s: 15 },
      },
      {},
    ),
  ).toBe("x is on for ≥1h 30m 15s");
});

test("summariseState renders AND group", () => {
  expect(
    summariseState(
      {
        kind: "and",
        items: [
          { kind: "is", entity_id: "a", states: ["on"] },
          { kind: "is", entity_id: "b", states: ["off"] },
        ],
      },
      {},
    ),
  ).toBe("a is on AND b is off");
});

test("summariseState renders OR group", () => {
  expect(
    summariseState(
      {
        kind: "or",
        items: [
          { kind: "is", entity_id: "a", states: ["on"] },
          { kind: "is", entity_id: "b", states: ["off"] },
        ],
      },
      {},
    ),
  ).toBe("a is on OR b is off");
});

test("summariseState inlines NOT into a simple 'is' clause", () => {
  expect(
    summariseState(
      {
        kind: "not",
        item: { kind: "is", entity_id: "a", states: ["on"] },
      },
      {},
    ),
  ).toBe("a is NOT on");
});

test("summariseState inlines NOT before the value, keeping the 'for' suffix", () => {
  expect(
    summariseState(
      {
        kind: "not",
        item: {
          kind: "is",
          entity_id: "binary_sensor.bed",
          states: ["off"],
          for: { h: 0, m: 20, s: 0 },
        },
      },
      {},
    ),
  ).toBe("binary_sensor.bed is NOT off for ≥20m");
});

test("summariseState keeps the NOT prefix for a numeric clause (inline reads badly)", () => {
  expect(
    summariseState(
      {
        kind: "not",
        item: { kind: ">=", entity_id: "sensor.t", states: ["20"] },
      },
      {},
    ),
  ).toBe("NOT sensor.t ≥ 20");
});

test("summariseState keeps the NOT prefix for an is_not clause (avoids a double negative)", () => {
  expect(
    summariseState(
      {
        kind: "not",
        item: { kind: "is_not", entity_id: "a", states: ["on"] },
      },
      {},
    ),
  ).toBe("NOT a is not on");
});

test("summariseState still parenthesises NOT around a group (so the scope is unambiguous)", () => {
  expect(
    summariseState(
      {
        kind: "not",
        item: {
          kind: "and",
          items: [
            { kind: "is", entity_id: "a", states: ["on"] },
            { kind: "is", entity_id: "b", states: ["off"] },
          ],
        },
      },
      {},
    ),
  ).toBe("NOT (a is on AND b is off)");
});

test("summariseState renders nested groups with parens around inner groups", () => {
  expect(
    summariseState(
      {
        kind: "or",
        items: [
          {
            kind: "and",
            items: [
              { kind: "is", entity_id: "a", states: ["on"] },
              { kind: "is", entity_id: "b", states: ["off"] },
            ],
          },
          { kind: "is_not", entity_id: "c", states: ["open"] },
        ],
      },
      {},
    ),
  ).toBe("(a is on AND b is off) OR c is not open");
});

test("summariseState null is 'any'", () => {
  expect(summariseState(null, {})).toBe("any");
});

test("summariseCondition dispatches state", () => {
  expect(
    summariseCondition(
      "state",
      {
        kind: "is",
        entity_id: "a",
        states: ["on"],
      },
      {},
    ),
  ).toBe("a is on");
});

test("summariseState renders an atom with an attribute as entity.attr", () => {
  expect(
    summariseState(
      {
        kind: "is",
        entity_id: "media_player.x",
        attribute: "source",
        states: ["Spotify", "Tidal"],
      },
      {},
    ),
  ).toBe("media_player.x.Source is Spotify/Tidal");
});

test("summariseState humanises state values via HA's formatEntityState", () => {
  const hass = {
    states: { "climate.x": { state: "heat", attributes: {} } },
    formatEntityState: (_s: unknown, v: string) => (v === "heat_cool" ? "Heat/cool" : v),
  } as any;
  expect(
    summariseState({ kind: "is", entity_id: "climate.x", states: ["heat_cool"] }, { hass }),
  ).toBe("climate.x is Heat/cool");
});

test("summariseState humanises attribute values via formatEntityAttributeValue", () => {
  const hass = {
    states: { "remote.cine": { state: "on", attributes: { current_activity: "nvidia" } } },
    formatEntityAttributeValue: (_s: unknown, _a: string, v: string) =>
      v === "nvidia" ? "Nvidia (TV)" : v,
  } as any;
  expect(
    summariseState(
      { kind: "is", entity_id: "remote.cine", attribute: "current_activity", states: ["nvidia"] },
      { hass },
    ),
  ).toBe("remote.cine.Current activity is Nvidia (TV)");
});

test("summariseState humanises a multi-word attribute name (matches the editor's Where dropdown)", () => {
  expect(
    summariseState(
      {
        kind: ">",
        entity_id: "climate.x",
        attribute: "current_temperature",
        states: ["21"],
      },
      {},
    ),
  ).toBe("climate.x.Current temperature > 21");
});

test("summariseState renders attribute-mode is_not", () => {
  expect(
    summariseState(
      {
        kind: "is_not",
        entity_id: "light.x",
        attribute: "brightness",
        states: ["255"],
      },
      {},
    ),
  ).toBe("light.x.Brightness is not 255");
});

test("summariseState falls back to entity-state when attribute is null/empty", () => {
  expect(
    summariseState(
      {
        kind: "is",
        entity_id: "a",
        attribute: null,
        states: ["on"],
      },
      {},
    ),
  ).toBe("a is on");
  expect(
    summariseState(
      {
        kind: "is",
        entity_id: "a",
        attribute: "",
        states: ["on"],
      },
      {},
    ),
  ).toBe("a is on");
});

test("summariseState renders numeric ops without slashes", () => {
  expect(
    summariseState(
      {
        kind: ">",
        entity_id: "sensor.temp",
        states: ["21"],
      },
      {},
    ),
  ).toBe("sensor.temp > 21");
  expect(
    summariseState(
      {
        kind: ">=",
        entity_id: "sensor.temp",
        states: ["21"],
      },
      {},
    ),
  ).toBe("sensor.temp ≥ 21");
  expect(
    summariseState(
      {
        kind: "<",
        entity_id: "sensor.temp",
        states: ["5"],
      },
      {},
    ),
  ).toBe("sensor.temp < 5");
  expect(
    summariseState(
      {
        kind: "<=",
        entity_id: "sensor.temp",
        states: ["5"],
      },
      {},
    ),
  ).toBe("sensor.temp ≤ 5");
});

test("summariseState renders numeric ops on attributes as 'entity.attr op N'", () => {
  expect(
    summariseState(
      {
        kind: ">",
        entity_id: "light.x",
        attribute: "brightness",
        states: ["100"],
      },
      {},
    ),
  ).toBe("light.x.Brightness > 100");
});

test("summariseState appends 'for' clause to a numeric atom", () => {
  expect(
    summariseState(
      {
        kind: ">",
        entity_id: "sensor.x",
        states: ["10"],
        for: { h: 0, m: 5, s: 0 },
      },
      {},
    ),
  ).toBe("sensor.x > 10 for ≥5m");
});

test("summariseState uses the entity's friendly_name when one is available", () => {
  const hass = {
    states: {
      "binary_sensor.front_door": { attributes: { friendly_name: "Front door" } },
    },
  } as any;
  expect(
    summariseState(
      {
        kind: "is",
        entity_id: "binary_sensor.front_door",
        states: ["on"],
      },
      { hass },
    ),
  ).toBe("Front door is on");
});

test("summariseState combines friendly_name with the attribute name", () => {
  const hass = {
    states: {
      "light.kitchen": { attributes: { friendly_name: "Kitchen light", brightness: 200 } },
    },
  } as any;
  expect(
    summariseState(
      {
        kind: ">",
        entity_id: "light.kitchen",
        attribute: "brightness",
        states: ["100"],
      },
      { hass },
    ),
  ).toBe("Kitchen light.Brightness > 100");
});

test("summariseState falls back to entity_id when no friendly_name is set", () => {
  const hass = {
    states: { "sensor.x": { attributes: {} } },
  } as any;
  expect(
    summariseState(
      {
        kind: "is",
        entity_id: "sensor.x",
        states: ["on"],
      },
      { hass },
    ),
  ).toBe("sensor.x is on");
});

describe("summariseScript", () => {
  test("null predicate renders as '(any)'", () => {
    expect(summariseScript(null, { hass: noLocalize })).toBe("(any)");
  });

  test("uses the script's friendly name when available", () => {
    const hass = {
      localize: () => undefined,
      states: { "script.foobar": { attributes: { friendly_name: "Evening Scene" } } },
    };
    expect(summariseScript({ script: "script.foobar", args: {} }, { hass })).toBe("Evening Scene");
  });

  test("no args renders the humanised script name", () => {
    expect(summariseScript({ script: "script.foobar" }, { hass: noLocalize })).toBe("Foobar");
  });

  test("empty args object is treated as no args", () => {
    expect(summariseScript({ script: "script.foo", args: {} }, { hass: noLocalize })).toBe("Foo");
  });

  test("single arg renders with a humanised key when no alias is known", () => {
    expect(summariseScript({ script: "script.foo", args: { k: 7 } }, { hass: noLocalize })).toBe(
      "Foo (K: 7)",
    );
  });

  test("multiple args render alphabetically by key", () => {
    expect(
      summariseScript({ script: "script.foo", args: { z: "down", k: 7 } }, { hass: noLocalize }),
    ).toBe("Foo (K: 7, Z: down)");
  });

  test("object-valued arg renders via formatParamValue, not [object Object]", () => {
    expect(
      summariseScript({ script: "script.foo", args: { rgb: [210, 81, 81] } }, { hass: noLocalize }),
    ).toBe("Foo (Rgb: [210,81,81])");
  });

  test("arg key resolves to the script field's friendly name alias", () => {
    const hass = {
      localize: () => undefined,
      services: { script: { foo: { fields: { target: { name: "Target brightness" } } } } },
    };
    expect(summariseScript({ script: "script.foo", args: { target: 5 } }, { hass })).toBe(
      "Foo (Target brightness: 5)",
    );
  });

  test("target-shaped arg renders a bracketed list of friendly entity names", () => {
    const hass = {
      localize: () => undefined,
      states: {
        "sensor.cph2653_battery_level": { attributes: { friendly_name: "Battery Level" } },
        "sensor.cph2653_battery_state": { attributes: { friendly_name: "Battery State" } },
      },
    };
    expect(
      summariseScript(
        {
          script: "script.foo",
          args: {
            target: { entity_id: ["sensor.cph2653_battery_level", "sensor.cph2653_battery_state"] },
          },
        },
        { hass },
      ),
    ).toBe("Foo (Target: [Battery Level, Battery State])");
  });

  test("target with many entities is capped with '+N more'", () => {
    const ids = ["a", "b", "c", "d", "e"].map((s) => `sensor.${s}`);
    const states = Object.fromEntries(
      ids.map((id, i) => [id, { attributes: { friendly_name: `E${i + 1}` } }]),
    );
    expect(
      summariseScript(
        { script: "script.foo", args: { target: { entity_id: ids } } },
        { hass: { localize: () => undefined, states } },
      ),
    ).toBe("Foo (Target: [E1, E2 +3 more])");
  });

  test("single-string entity_id target renders one friendly name", () => {
    const hass = {
      localize: () => undefined,
      states: { "light.kitchen": { attributes: { friendly_name: "Kitchen" } } },
    };
    expect(
      summariseScript(
        { script: "script.foo", args: { target: { entity_id: "light.kitchen" } } },
        { hass },
      ),
    ).toBe("Foo (Target: [Kitchen])");
  });

  test("non-target object arg still renders as JSON", () => {
    expect(
      summariseScript(
        { script: "script.foo", args: { opts: { mode: "auto" } } },
        { hass: noLocalize },
      ),
    ).toBe('Foo (Opts: {"mode":"auto"})');
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

test("summariseCondition dispatches script with no args", () => {
  expect(summariseCondition("script", { script: "script.foo" }, { hass: noLocalize })).toBe("Foo");
});

test("summariseCondition dispatches script with args (sorted)", () => {
  expect(
    summariseCondition(
      "script",
      { script: "script.foo", args: { z: "down", k: 7 } },
      { hass: noLocalize },
    ),
  ).toBe("Foo (K: 7, Z: down)");
});

test("summariseCondition script with null predicate yields '(any)'", () => {
  expect(summariseCondition("script", null, { hass: noLocalize })).toBe("(any)");
});

describe("summariseBlocker", () => {
  // hass with no translations (use English fallbacks) + a couple of friendly names.
  const hass = {
    localize: () => undefined,
    states: {
      "binary_sensor.island": { attributes: { friendly_name: "Island" } },
    },
  };
  const ctx = { hass };

  const blocker = (when: Record<string, unknown>): Scene => ({
    name: "x",
    when,
    actions: [],
  });

  test("pure dwell: negated occupancy renders as a positive 'until' release", () => {
    const when = {
      occupancy: {
        sensors: ["binary_sensor.island"],
        occupied: false,
        for: { h: 0, m: 3, s: 0 },
        negate: true,
      } as OccupancyPredicate,
    };
    expect(summariseBlocker(blocker(when), ctx)).toBe("Block until Island is clear for ≥3m");
  });

  test("release + guard: lead with the guard — 'While <guard>, block until <release>'", () => {
    const when = {
      occupancy: {
        sensors: ["binary_sensor.island"],
        occupied: false,
        for: { h: 0, m: 3, s: 0 },
        negate: true,
      } as OccupancyPredicate,
      time_of_day: { period: "daytime" },
    };
    expect(summariseBlocker(blocker(when), ctx)).toBe(
      "While Daytime, block until Island is clear for ≥3m",
    );
  });

  test("ambient guard (sun) carries its type label so the value makes sense", () => {
    // Sun renders abstract geometry ("N/NE") that is opaque without "Sun:".
    // The entity-naming occupancy release stays bare (it names its sensor).
    const when = {
      occupancy: {
        sensors: ["binary_sensor.island"],
        occupied: false,
        for: { h: 0, m: 3, s: 0 },
        negate: true,
      } as OccupancyPredicate,
      sun: { azimuth: { sectors: ["N", "NE"] } } as SunPredicate,
    };
    expect(summariseBlocker(blocker(when), ctx)).toBe(
      "While Sun: N/NE, block until Island is clear for ≥3m",
    );
  });

  test("release + multiple guards: 'While <g1> and <g2>, block until <release>'", () => {
    const when = {
      occupancy: {
        sensors: ["binary_sensor.island"],
        occupied: false,
        for: { h: 0, m: 3, s: 0 },
        negate: true,
      } as OccupancyPredicate,
      time_of_day: { period: "daytime" },
      people: { who: ["person.alice"], where: "home" } as PeoplePredicate,
    };
    expect(summariseBlocker(blocker(when), ctx)).toBe(
      "While Daytime and Alice is at Home, block until Island is clear for ≥3m",
    );
  });

  test("pure guard (no negation): 'Block while …'", () => {
    const when = {
      occupancy: { sensors: ["binary_sensor.island"], occupied: true } as OccupancyPredicate,
    };
    expect(summariseBlocker(blocker(when), ctx)).toBe("Block while Island is detected");
  });

  test("two guards join with 'and'", () => {
    const when = {
      occupancy: { sensors: ["binary_sensor.island"], occupied: true } as OccupancyPredicate,
      time_of_day: { period: "daytime" },
    };
    expect(summariseBlocker(blocker(when), ctx)).toBe("Block while Island is detected and Daytime");
  });

  test("two releases (different types) join with 'or'", () => {
    const when = {
      occupancy: {
        sensors: ["binary_sensor.island"],
        occupied: false,
        for: { h: 0, m: 3, s: 0 },
        negate: true,
      } as OccupancyPredicate,
      people: { who: ["person.alice"], where: "home", negate: true } as PeoplePredicate,
    };
    expect(summariseBlocker(blocker(when), ctx)).toBe(
      "Block until Island is clear for ≥3m or Alice is at Home",
    );
  });

  test("multi-person quantified people stays a guard (negate is per-person, not an outer wrap)", () => {
    // {everyone, negate} matches "all away" and releases when ANY arrives, so
    // dropping `negate` would mis-render "All of … is at Home" (wrong quantifier,
    // false to the engine). Render the truthful negated form as a guard instead.
    const when = {
      people: {
        who: ["person.alice", "person.bob"],
        quant: "everyone",
        where: "home",
        negate: true,
      } as PeoplePredicate,
    };
    expect(summariseBlocker(blocker(when), ctx)).toBe(
      "Block while All of: (Alice, Bob) is not at Home",
    );
  });

  test("state top-level 'not' de-negates to its inner clause", () => {
    const inner = { kind: "is", entity_id: "light.lounge", states: ["on"] };
    const when = { state: { kind: "not", item: inner } as StatePredicate };
    // Tie to whatever summariseState produces for the inner clause, robust to
    // its exact wording — the point is the 'not' wrapper is gone.
    const expected = `Block until ${summariseCondition("state", inner, ctx)}`;
    const out = summariseBlocker(blocker(when), ctx);
    expect(out).toBe(expected);
    expect(out.toLowerCase()).not.toContain("not");
  });

  test("zero-condition blocker reads 'Block always'", () => {
    expect(summariseBlocker(blocker({}), ctx)).toBe("Block always");
  });

  test("null condition values are ignored", () => {
    const when = {
      occupancy: { sensors: ["binary_sensor.island"], occupied: true } as OccupancyPredicate,
      time_of_day: null,
    };
    expect(summariseBlocker(blocker(when), ctx)).toBe("Block while Island is detected");
  });

  test("priority ordering: higher-priority condition appears first regardless of insertion order", () => {
    // Insertion order: occupancy first, time_of_day second.
    // Priority map: time_of_day=10 (higher), occupancy=5 (lower).
    // With priorities, time_of_day should appear FIRST in the guards list.
    const when = {
      occupancy: { sensors: ["binary_sensor.island"], occupied: true } as OccupancyPredicate,
      time_of_day: { period: "daytime" },
    };
    const priorities = new Map([
      ["time_of_day", 10],
      ["occupancy", 5],
    ]);
    expect(summariseBlocker(blocker(when), { ...ctx, priorities })).toBe(
      "Block while Daytime and Island is detected",
    );
  });

  test("without priorities, insertion order is preserved", () => {
    // Same scene as above but no priorities → occupancy (inserted first) comes first.
    const when = {
      occupancy: { sensors: ["binary_sensor.island"], occupied: true } as OccupancyPredicate,
      time_of_day: { period: "daytime" },
    };
    expect(summariseBlocker(blocker(when), ctx)).toBe("Block while Island is detected and Daytime");
  });

  test("conditions absent from a non-empty priority map keep insertion order", () => {
    // Both keys are missing from the map, so the comparator must treat them as
    // equal (return 0) and preserve insertion order — never produce NaN.
    const when = {
      time_of_day: { period: "daytime" },
      occupancy: { sensors: ["binary_sensor.island"], occupied: true } as OccupancyPredicate,
    };
    const priorities = new Map([["weather", 999]]); // non-empty, neither key present
    expect(summariseBlocker(blocker(when), { ...ctx, priorities })).toBe(
      "Block while Daytime and Island is detected",
    );
  });

  test("defaults to English fallbacks when ctx is omitted", () => {
    expect(summariseBlocker(blocker({}))).toBe("Block always");
  });
});

describe("blocker_summary i18n bundle", () => {
  test("every blocker_summary string is bundled (translatable), not inline-only", () => {
    // The inline fallbacks in summariseBlocker are a last resort; the canonical
    // source must live in the bundle so the strings are localizable like
    // day_summary (and unlike the still-inline occupancy/people/lux/unavailable
    // families — tracked for a separate i18n cleanup).
    const ns = AMBIENCE_STRINGS.blocker_summary as Record<string, unknown> | undefined;
    for (const key of [
      "block",
      "block_mid",
      "until",
      "while",
      "while_lead",
      "or",
      "and",
      "always",
    ]) {
      expect(typeof ns?.[key]).toBe("string");
    }
  });
});
