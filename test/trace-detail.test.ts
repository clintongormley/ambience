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

function renderToHost(over: Partial<BufferedUnit>, expanded: boolean): HTMLElement {
  const host = document.createElement("div");
  render(renderEvaluation(unit(over), expanded, () => {}), host);
  return host;
}

describe("trace-detail", () => {
  test("formatCause renders entity old→new and humanizes other kinds", () => {
    expect(formatCause({ kind: "entity", entity_id: "x", old: "off", new: "on", detail: null })).toContain("off");
    expect(formatCause({ kind: "clock", entity_id: null, old: null, new: null, detail: "20:00" })).toContain("20:00");
  });

  test("formatActionHeader is service + params only (no entities)", () => {
    expect(formatActionHeader({ service: "light.turn_on", entity_ids: ["light.k"], params: { x: 1 } }))
      .toBe('light.turn_on {"x":1}');
    expect(formatActionHeader({ service: "light.turn_off", entity_ids: ["light.k"] })).toBe("light.turn_off");
  });

  test("collapsed summary lists the action service + entity count, but not the entities or predicates", () => {
    const host = renderToHost({}, false);
    expect(host.querySelector(".outcome.acted")).toBeTruthy();
    expect(host.textContent).toContain("Evening"); // winner
    expect(host.textContent).toContain("light.turn_on"); // action service
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
    expect(host.textContent).toContain("tod");
    expect(host.textContent).toContain("Night");
    expect(host.querySelector(".pred.fail")).toBeTruthy();
    expect(host.querySelector(".pred.pass")).toBeTruthy();
  });

  test("actions taken shows the action header with params then one entity per line", () => {
    const host = renderToHost({}, true);
    expect(host.textContent).toContain("brightness_pct"); // params in the action header
    const entities = [...host.querySelectorAll(".entity")].map((e) => e.textContent?.trim());
    expect(entities).toEqual(["light.k", "light.counter"]); // one per line, in order
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

  test("disabled rule is marked 'disabled', not 'not evaluated'", () => {
    const host = renderToHost({ explanation: { winner_index: 1, rules: [
      { index: 0, name: "Off", matched: false, evaluated: false, disabled: true, predicates: [] },
      { index: 1, name: "Win", matched: true, evaluated: true, predicates: [] },
    ] } }, true);
    expect(host.textContent).toContain("disabled");
    expect(host.textContent).not.toContain("not evaluated");
  });
});
