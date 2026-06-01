import { describe, test, expect } from "vitest";
import { render } from "lit";
import { renderEvaluation, formatCause, formatAction } from "../frontend/src/trace-detail";
import type { BufferedUnit } from "../frontend/src/types";

function unit(over: Partial<BufferedUnit> = {}): BufferedUnit {
  return {
    event_id: "e1", timestamp: "2026-06-01T10:00:00+00:00",
    cause: { kind: "entity", entity_id: "binary_sensor.motion", old: "off", new: "on", detail: null },
    scope_kind: "area", scope_id: "kitchen", scope_name: "Kitchen",
    group: "g1", group_name: "Evening", switch_state: "on",
    outcome: "acted", winner_name: "Evening",
    actions: [{ service: "light.turn_on", entity_ids: ["light.k"], params: { brightness_pct: 60 } }],
    explanation: { winner_index: 1, rules: [
      { index: 0, name: "Night", matched: false, evaluated: true, predicates: [{ matcher_key: "tod", passed: false, detail: "evening" }] },
      { index: 1, name: "Evening", matched: true, evaluated: true, predicates: [{ matcher_key: "tod", passed: true, detail: "evening" }] },
    ] },
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

  test("formatAction includes service, targets, params", () => {
    expect(formatAction({ service: "light.turn_on", entity_ids: ["light.k"], params: { x: 1 } }))
      .toBe('light.turn_on [light.k] {"x":1}');
  });

  test("collapsed evaluation shows outcome + winner + action, no predicates", () => {
    const host = renderToHost({}, false);
    expect(host.querySelector(".outcome.acted")).toBeTruthy();
    expect(host.textContent).toContain("Evening");
    expect(host.textContent).toContain("light.turn_on");
    expect(host.querySelector(".why")).toBeFalsy();
  });

  test("expanded evaluation reveals per-predicate pass/fail and losing rule", () => {
    const host = renderToHost({}, true);
    expect(host.querySelector(".why")).toBeTruthy();
    expect(host.textContent).toContain("tod");
    expect(host.textContent).toContain("Night");
    expect(host.querySelector(".pred.fail")).toBeTruthy();
    expect(host.querySelector(".pred.pass")).toBeTruthy();
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
});
