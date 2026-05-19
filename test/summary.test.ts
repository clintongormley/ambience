import { describe, test, expect } from "vitest";
import {
  ruleDisplayName,
  summariseMatcher,
  summariseTimeOfDay,
  summariseAction,
} from "../frontend/src/summary";
import type { ActionInfo, ActionSpec, PeriodStoreView } from "../frontend/src/types";

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

describe("summariseAction", () => {
  const info: ActionInfo = {
    name: "set_light",
    description: "",
    domains: ["light"],
    target_params: [
      { name: "brightness", type: "int", required: true },
      { name: "transition", type: "number", required: false },
    ],
  };

  test("action with multiple entities pluralises", () => {
    const action: ActionSpec = {
      action: "set_light",
      entity_ids: ["light.a", "light.b"],
      params: { brightness: 80 },
    };
    expect(summariseAction(action, info, { hass: noLocalize }))
      .toBe("Set light: 2 lights, brightness 80");
  });

  test("action with one entity uses singular", () => {
    const action: ActionSpec = {
      action: "set_light",
      entity_ids: ["light.a"],
      params: { brightness: 80 },
    };
    expect(summariseAction(action, info, { hass: noLocalize }))
      .toBe("Set light: 1 light, brightness 80");
  });

  test("action with no entities", () => {
    const action: ActionSpec = {
      action: "set_light",
      entity_ids: [],
      params: { brightness: 80 },
    };
    expect(summariseAction(action, info, { hass: noLocalize }))
      .toBe("Set light: (no targets), brightness 80");
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
