import { describe, test, expect } from "vitest";
import { render } from "lit";
import { renderEvaluation, formatCause, formatActionHeader } from "../frontend/src/trace-detail";
import type { BufferedUnit } from "../frontend/src/types";

function unit(over: Partial<BufferedUnit> = {}): BufferedUnit {
  return {
    event_id: "e1",
    timestamp: "2026-06-01T10:00:00+00:00",
    cause: { kind: "entity", entity_id: "binary_sensor.motion", old: "off", new: "on", detail: null },
    scope_kind: "area",
    scope_id: "kitchen",
    scope_name: "Kitchen",
    group: "g1",
    group_name: "Evening",
    switch_state: "on",
    outcome: "acted",
    winner_name: "Evening",
    actions: [
      { service: "light.turn_on", entity_ids: ["light.k", "light.counter"], params: { brightness_pct: 60 } },
    ],
    explanation: {
      winner_index: 1,
      rules: [
        { index: 0, name: "Night", matched: false, evaluated: true, predicates: [{ matcher_key: "tod", passed: false, detail: "evening" }] },
        { index: 1, name: "Evening", matched: true, evaluated: true, predicates: [{ matcher_key: "tod", passed: true, detail: "evening" }] },
      ],
    },
    ...over,
  };
}

function renderToHost(
  over: Partial<BufferedUnit>,
  expanded: boolean,
  hass?: Record<string, unknown>,
  schemas?: Record<string, unknown>,
): HTMLElement {
  const host = document.createElement("div");
  render(renderEvaluation(unit(over), expanded, () => {}, hass, schemas as never), host);
  return host;
}

describe("trace-detail", () => {
  test("formatCause renders entity old→new and humanizes other kinds", () => {
    expect(formatCause({ kind: "entity", entity_id: "x", old: "off", new: "on", detail: null })).toContain("off");
    expect(formatCause({ kind: "clock", entity_id: null, old: null, new: null, detail: "20:00" })).toContain("20:00");
  });

  test("formatActionHeader humanizes the service and its params (no entities)", () => {
    expect(formatActionHeader({ service: "light.turn_on", entity_ids: ["light.k"], params: { x: 1 } }))
      .toBe("Turn on light · X: 1");
    expect(formatActionHeader({ service: "light.turn_off", entity_ids: ["light.k"] })).toBe("Turn off light");
  });

  test("formatActionHeader prefers the service schema's field name for param labels", () => {
    const schemas = { "light.turn_on": { fields: { brightness_pct: { name: "Brightness" } }, target: null } };
    expect(
      formatActionHeader(
        { service: "light.turn_on", entity_ids: [], params: { brightness_pct: 60 } },
        undefined,
        schemas as never,
      ),
    ).toBe("Turn on light · Brightness: 60");
  });

  test("action param labels use the threaded service schema (brightness_pct → 'Brightness')", () => {
    const schemas = { "light.turn_on": { fields: { brightness_pct: { name: "Brightness" } }, target: null } };
    const host = renderToHost(
      { actions: [{ service: "light.turn_on", entity_ids: ["light.k"], params: { brightness_pct: 60 } }] },
      true,
      undefined,
      schemas,
    );
    expect(host.textContent).toContain("Brightness: 60");
    expect(host.textContent).not.toContain("Brightness pct");
  });

  test("collapsed summary lists the action service + entity count, but not the entities or predicates", () => {
    const host = renderToHost({}, false);
    expect(host.querySelector(".outcome.acted")).toBeTruthy();
    expect(host.textContent).toContain("Evening"); // winner
    expect(host.textContent).toContain("Turn on light"); // action service, humanized
    expect(host.textContent).not.toContain("light.turn_on"); // not the raw service id
    expect(host.textContent).toContain("2 entities"); // aggregate count
    expect(host.querySelector(".why")).toBeFalsy(); // collapsed
    expect(host.textContent).not.toContain("light.counter"); // entity list is expansion-only
    expect(host.querySelector(".pred")).toBeFalsy(); // predicates are expansion-only
  });

  test("singular entity count reads '1 entity'", () => {
    const host = renderToHost({
      actions: [{ service: "light.turn_on", entity_ids: ["light.k"], params: {} }],
    }, false);
    expect(host.textContent).toContain("1 entity");
    expect(host.textContent).not.toContain("1 entities");
  });

  test("expansion has 'Rule evaluation' and 'Actions taken' sections", () => {
    const host = renderToHost({}, true);
    const titles = [...host.querySelectorAll(".section-title")].map((e) => e.textContent?.trim());
    expect(titles).toContain("Rule evaluation");
    expect(titles).toContain("Actions taken");
  });

  test("expanded rule evaluation shows per-predicate pass/fail and the losing rule", () => {
    const host = renderToHost({}, true);
    expect(host.querySelector(".why")).toBeTruthy();
    expect(host.textContent).toContain("Tod"); // matcher key humanized
    expect(host.textContent).toContain("Night");
    expect(host.querySelector(".pred.fail")).toBeTruthy();
    expect(host.querySelector(".pred.pass")).toBeTruthy();
  });

  test("actions taken shows the humanized action header with params then one entity per line", () => {
    const host = renderToHost({}, true);
    expect(host.textContent).toContain("Turn on light"); // service humanized
    expect(host.textContent).toContain("Brightness pct: 60"); // params humanized
    expect(host.textContent).not.toContain("brightness_pct"); // not the raw param key
    const entities = [...host.querySelectorAll(".entity")].map((e) => e.textContent?.trim());
    expect(entities).toEqual(["light.k", "light.counter"]); // raw ids when no friendly_name
  });

  test("action entities show friendly names when hass provides them", () => {
    const hass = {
      states: {
        "light.master_bedroom_ceiling_light": {
          attributes: { friendly_name: "Master Bedroom Ceiling Light" },
        },
      },
    };
    const host = renderToHost(
      {
        actions: [
          {
            service: "light.turn_on",
            entity_ids: ["light.master_bedroom_ceiling_light"],
            params: { brightness_pct: 60 },
          },
        ],
      },
      true,
      hass,
    );
    const entities = [...host.querySelectorAll(".entity")].map((e) => e.textContent?.trim());
    expect(entities).toEqual(["Master Bedroom Ceiling Light"]);
    expect(host.textContent).not.toContain("light.master_bedroom_ceiling_light");
  });

  test("not-evaluated rule is marked", () => {
    const host = renderToHost({ explanation: { winner_index: 0, rules: [
      { index: 0, name: "A", matched: true, evaluated: true, predicates: [] },
      { index: 1, name: "B", matched: false, evaluated: false, predicates: [] },
    ] } }, true);
    expect(host.textContent).toContain("not evaluated");
  });

  test("label says 'Why nothing matched' when there is no winner", () => {
    const host = renderToHost({ winner_name: null }, false);
    expect(host.textContent).toContain("Why nothing matched");
  });

  test("a unit with actions but no explanation can still expand to its actions", () => {
    const host = renderToHost({ outcome: "reapplied", explanation: null }, true);
    const titles = [...host.querySelectorAll(".section-title")].map((e) => e.textContent?.trim());
    expect(titles).toContain("Actions taken");
    expect(titles).not.toContain("Rule evaluation");
    expect(host.querySelector(".why-toggle")).toBeTruthy();
  });

  test("rule numbers are displayed 1-based (index 0 → 'Rule #1')", () => {
    const host = renderToHost({}, true);
    expect(host.textContent).toContain("Rule #1 Night"); // index 0 displays as #1
    expect(host.textContent).toContain("Rule #2 Evening"); // index 1 displays as #2
    expect(host.textContent).not.toContain("#0");
  });

  test("rule lines use the human label 'Rule', not the raw 'rule'", () => {
    const host = renderToHost({}, true);
    expect(host.textContent).not.toContain("rule #");
  });

  test("matcher keys are shown as human labels (time_of_day → 'Time of day')", () => {
    const host = renderToHost({ explanation: { winner_index: 0, rules: [
      { index: 0, name: "Afternoon", matched: true, evaluated: true,
        predicates: [{ matcher_key: "time_of_day", passed: true, detail: "afternoon" }] },
    ] } }, true);
    expect(host.textContent).toContain("Time of day"); // humanized matcher key
    expect(host.textContent).not.toContain("time_of_day");
    expect(host.textContent).toContain("Afternoon"); // humanized period detail
    expect(host.textContent).not.toContain("[afternoon]");
  });

  test("weather condition detail is humanized (partlycloudy → 'Partly cloudy')", () => {
    const host = renderToHost({ explanation: { winner_index: 0, rules: [
      { index: 0, name: "Cloudy", matched: true, evaluated: true,
        predicates: [{ matcher_key: "weather", passed: true, detail: "partlycloudy" }] },
    ] } }, true);
    expect(host.textContent).toContain("Partly cloudy");
    expect(host.textContent).not.toContain("partlycloudy");
  });

  test("already-human detail phrases are shown verbatim, not lower-cased", () => {
    const host = renderToHost({ explanation: { winner_index: 0, rules: [
      { index: 0, name: "Home", matched: true, evaluated: true,
        predicates: [{ matcher_key: "people", passed: true, detail: "3 of 5 home (Alice, Bob)" }] },
    ] } }, true);
    expect(host.textContent).toContain("3 of 5 home (Alice, Bob)");
  });

  test("disabled rule is marked 'disabled', not 'not evaluated'", () => {
    const host = renderToHost({ explanation: { winner_index: 1, rules: [
      { index: 0, name: "Off", matched: false, evaluated: false, disabled: true, predicates: [] },
      { index: 1, name: "Win", matched: true, evaluated: true, predicates: [] },
    ] } }, true);
    expect(host.textContent).toContain("disabled");
    expect(host.textContent).not.toContain("not evaluated");
  });
});
