import { render } from "lit";
import { describe, expect, test } from "vitest";
import { formatActionHeader, formatCause, renderEvaluation } from "../frontend/src/trace-detail";
import type { BufferedUnit } from "../frontend/src/types";

function unit(over: Partial<BufferedUnit> = {}): BufferedUnit {
  return {
    event_id: "e1",
    timestamp: "2026-06-01T10:00:00+00:00",
    cause: {
      kind: "entity",
      entity_id: "binary_sensor.motion",
      old: "off",
      new: "on",
      detail: null,
    },
    scope_kind: "area",
    scope_id: "kitchen",
    scope_name: "Kitchen",
    category: "g1",
    category_name: "Evening",
    switch_state: "on",
    outcome: "acted",
    winner_name: "Evening",
    actions: [
      {
        service: "light.turn_on",
        entity_ids: ["light.k", "light.counter"],
        params: { brightness_pct: 60 },
      },
    ],
    explanation: {
      winner_index: 1,
      scenes: [
        {
          index: 0,
          name: "Night",
          matched: false,
          evaluated: true,
          predicates: [{ condition_key: "tod", passed: false, detail: "evening" }],
        },
        {
          index: 1,
          name: "Evening",
          matched: true,
          evaluated: true,
          predicates: [{ condition_key: "tod", passed: true, detail: "evening" }],
        },
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
  render(
    renderEvaluation(unit(over), expanded, () => {}, hass, schemas as never),
    host,
  );
  return host;
}

describe("trace-detail", () => {
  test("formatCause renders entity old→new and humanizes other kinds", () => {
    expect(
      formatCause({ kind: "entity", entity_id: "x", old: "off", new: "on", detail: null }),
    ).toContain("off");
    expect(
      formatCause({ kind: "clock", entity_id: null, old: null, new: null, detail: "20:00" }),
    ).toContain("20:00");
  });

  test("formatActionHeader humanizes the service and its params (no entities)", () => {
    expect(
      formatActionHeader({ service: "light.turn_on", entity_ids: ["light.k"], params: { x: 1 } }),
    ).toBe("Turn on light · X: 1");
    expect(formatActionHeader({ service: "light.turn_off", entity_ids: ["light.k"] })).toBe(
      "Turn off light",
    );
  });

  test("formatActionHeader prefers the service schema's field name for param labels", () => {
    const schemas = {
      "light.turn_on": { fields: { brightness_pct: { name: "Brightness" } }, target: null },
    };
    expect(
      formatActionHeader(
        { service: "light.turn_on", entity_ids: [], params: { brightness_pct: 60 } },
        undefined,
        schemas as never,
      ),
    ).toBe("Turn on light · Brightness: 60");
  });

  test("action param labels use the threaded service schema (brightness_pct → 'Brightness')", () => {
    const schemas = {
      "light.turn_on": { fields: { brightness_pct: { name: "Brightness" } }, target: null },
    };
    const host = renderToHost(
      {
        actions: [
          { service: "light.turn_on", entity_ids: ["light.k"], params: { brightness_pct: 60 } },
        ],
      },
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
    const host = renderToHost(
      {
        actions: [{ service: "light.turn_on", entity_ids: ["light.k"], params: {} }],
      },
      false,
    );
    expect(host.textContent).toContain("1 entity");
    expect(host.textContent).not.toContain("1 entities");
  });

  test("expansion has 'Scene evaluation' and 'Actions taken' sections", () => {
    const host = renderToHost({}, true);
    const titles = [...host.querySelectorAll(".section-title")].map((e) => e.textContent?.trim());
    expect(titles).toContain("Scene evaluation");
    expect(titles).toContain("Actions taken");
  });

  test("expanded scene evaluation shows per-predicate pass/fail and the losing scene", () => {
    const host = renderToHost({}, true);
    expect(host.querySelector(".why")).toBeTruthy();
    expect(host.textContent).toContain("Tod"); // condition key humanized
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

  test("not-evaluated scene is marked", () => {
    const host = renderToHost(
      {
        explanation: {
          winner_index: 0,
          scenes: [
            { index: 0, name: "A", matched: true, evaluated: true, predicates: [] },
            { index: 1, name: "B", matched: false, evaluated: false, predicates: [] },
          ],
        },
      },
      true,
    );
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
    expect(titles).not.toContain("Scene evaluation");
    expect(host.querySelector(".why-toggle")).toBeTruthy();
  });

  test("scene numbers are displayed 1-based (index 0 → 'Scene #1')", () => {
    const host = renderToHost({}, true);
    expect(host.textContent).toContain("Scene #1 Night"); // index 0 displays as #1
    expect(host.textContent).toContain("Scene #2 Evening"); // index 1 displays as #2
    expect(host.textContent).not.toContain("#0");
  });

  test("scene lines use the human label 'Scene', not the raw 'scene'", () => {
    const host = renderToHost({}, true);
    expect(host.textContent).not.toContain("scene #");
  });

  test("condition keys are shown as human labels (time_of_day → 'Time of day')", () => {
    const host = renderToHost(
      {
        explanation: {
          winner_index: 0,
          scenes: [
            {
              index: 0,
              name: "Afternoon",
              matched: true,
              evaluated: true,
              predicates: [{ condition_key: "time_of_day", passed: true, detail: "afternoon" }],
            },
          ],
        },
      },
      true,
    );
    expect(host.textContent).toContain("Time of day"); // humanized condition key
    expect(host.textContent).not.toContain("time_of_day");
    expect(host.textContent).toContain("Afternoon"); // humanized period detail
    expect(host.textContent).not.toContain("[afternoon]");
  });

  test("weather condition detail is humanized (partlycloudy → 'Partly cloudy')", () => {
    const host = renderToHost(
      {
        explanation: {
          winner_index: 0,
          scenes: [
            {
              index: 0,
              name: "Cloudy",
              matched: true,
              evaluated: true,
              predicates: [{ condition_key: "weather", passed: true, detail: "partlycloudy" }],
            },
          ],
        },
      },
      true,
    );
    expect(host.textContent).toContain("Partly cloudy");
    expect(host.textContent).not.toContain("partlycloudy");
  });

  test("already-human detail phrases are shown verbatim, not lower-cased", () => {
    const host = renderToHost(
      {
        explanation: {
          winner_index: 0,
          scenes: [
            {
              index: 0,
              name: "Home",
              matched: true,
              evaluated: true,
              predicates: [
                { condition_key: "people", passed: true, detail: "3 of 5 home (Alice, Bob)" },
              ],
            },
          ],
        },
      },
      true,
    );
    expect(host.textContent).toContain("3 of 5 home (Alice, Bob)");
  });

  test("disabled scene is marked 'disabled', not 'not evaluated'", () => {
    const host = renderToHost(
      {
        explanation: {
          winner_index: 1,
          scenes: [
            {
              index: 0,
              name: "Off",
              matched: false,
              evaluated: false,
              disabled: true,
              predicates: [],
            },
            { index: 1, name: "Win", matched: true, evaluated: true, predicates: [] },
          ],
        },
      },
      true,
    );
    expect(host.textContent).toContain("disabled");
    expect(host.textContent).not.toContain("not evaluated");
  });

  // -------------------------------------------------------------------------
  // NEW: branch coverage additions
  // -------------------------------------------------------------------------

  // formatCause — line 61-63: kind != "entity" AND detail is null/falsy
  // Branch 8: returns humanizeId(c.kind) with no detail
  test("formatCause returns humanized kind when kind is not 'entity' and detail is null", () => {
    const result = formatCause({
      kind: "startup",
      entity_id: null,
      old: null,
      new: null,
      detail: null,
    });
    // detail is null → falls through to `return humanizeId(c.kind)`
    expect(result).toBe("Startup");
    expect(result).not.toContain("null");
  });

  // formatCause — line 61: kind != "entity" AND detail is falsy string ""
  test("formatCause returns humanized kind when detail is empty string", () => {
    const result = formatCause({
      kind: "manual",
      entity_id: null,
      old: null,
      new: null,
      detail: "" as unknown as null, // coerce — empty string is falsy
    });
    expect(result).toBe("Manual");
  });

  // entityCount — line 84: entity_ids absent → `?? 0`
  // Branch 17: action has no entity_ids field at all
  test("formatActionHeader handles action with no entity_ids (absent field)", () => {
    const result = formatActionHeader({ service: "scene.turn_on" });
    // Should not throw; service is humanized, no params.
    expect(result).toBe("Turn on scene");
  });

  // renderScene — line 91: scene name is null → fallback "—"
  // Branch 20: r.name ?? "—" uses "—" (disabled scene with null name)
  test("disabled scene with null name shows '—' placeholder", () => {
    const host = renderToHost(
      {
        explanation: {
          winner_index: 0,
          scenes: [
            {
              index: 0,
              name: null,
              matched: false,
              evaluated: false,
              disabled: true,
              predicates: [],
            },
          ],
        },
      },
      true,
    );
    expect(host.textContent).toContain("—");
    expect(host.textContent).toContain("disabled");
  });

  // renderScene — line 94: not-evaluated scene with null name → fallback "—"
  // Branch 23: r.name ?? "—" in the skipped path
  test("not-evaluated scene with null name shows '—' placeholder", () => {
    const host = renderToHost(
      {
        explanation: {
          winner_index: 0,
          scenes: [
            { index: 0, name: null, matched: false, evaluated: false, predicates: [] },
            { index: 1, name: "Win", matched: true, evaluated: true, predicates: [] },
          ],
        },
      },
      true,
    );
    expect(host.textContent).toContain("not evaluated");
    expect(host.textContent).toContain("—");
  });

  // renderScene — line 97: r.name null in matched scene ("no" branch) + null-name
  // Branch 27: r.name ?? "—" in the normal evaluated scene path
  test("evaluated scene with null name shows '—' placeholder", () => {
    const host = renderToHost(
      {
        explanation: {
          winner_index: null,
          scenes: [{ index: 0, name: null, matched: false, evaluated: true, predicates: [] }],
        },
      },
      true,
    );
    expect(host.textContent).toContain("Scene #1");
    expect(host.textContent).toContain("—");
    expect(host.textContent).toContain("no");
  });

  // renderScene — line 103: predicate with no detail → `nothing` branch
  // Branch 35: p.detail is null → no dim span rendered
  test("predicate with null detail renders no dim bracket text", () => {
    const host = renderToHost(
      {
        explanation: {
          winner_index: 0,
          scenes: [
            {
              index: 0,
              name: "R",
              matched: true,
              evaluated: true,
              predicates: [{ condition_key: "people", passed: true, detail: null }],
            },
          ],
        },
      },
      true,
    );
    // Condition key is humanized, but no "[...]" detail bracket.
    expect(host.textContent).toContain("People");
    expect(host.querySelector(".dim")).toBeFalsy();
  });

  // renderEvaluation — line 127: timestamp is null → empty string
  // Branch 38: u.timestamp falsy → ""
  test("missing timestamp renders no time text", () => {
    const host = renderToHost({ timestamp: null }, false);
    // .ts span exists but is empty
    const ts = host.querySelector(".ts");
    expect(ts).toBeTruthy();
    expect(ts?.textContent?.trim()).toBe("");
  });

  // renderEvaluation — line 133-134: actions.length but entity count n=0
  // Branches 43 & 44: `n ? ... : nothing` when n=0 — service shown, no entity span
  test("action summary omits entity count span when all actions have no entity_ids", () => {
    const host = renderToHost(
      {
        actions: [{ service: "scene.turn_on", entity_ids: [], params: {} }],
      },
      false,
    );
    // Service is listed.
    expect(host.textContent).toContain("Turn on scene");
    // No entity count badge.
    expect(host.querySelector(".action-summary .n")).toBeFalsy();
    expect(host.textContent).not.toContain("entities");
    expect(host.textContent).not.toContain("entity");
  });

  // renderEvaluation — line 144-145: collapsed toggle, has explanation AND winner_name
  // Branch 49: `▸ Why this scene won (N scenes)` label
  test("collapsed toggle reads 'Why this scene won' when explanation and winner_name are present", () => {
    const host = renderToHost({}, false); // winner_name set, explanation present
    expect(host.textContent).toContain("Why this scene won");
    expect(host.textContent).toContain("2 scenes");
    expect(host.textContent).not.toContain("Hide details");
  });

  // renderEvaluation — line 147: collapsed toggle, no explanation but has actions → "▸ Details"
  // Branch 50: `▸ Details` label when explanation=null but canExpand=true
  test("collapsed toggle reads '▸ Details' when there is no explanation but actions exist", () => {
    const host = renderToHost({ explanation: null }, false);
    expect(host.textContent).toContain("Details");
    expect(host.textContent).not.toContain("Why");
    expect(host.textContent).not.toContain("Hide details");
  });

  // renderExpansion — line 178: entity_ids absent in expanded action block
  // Branch 60: `(a.entity_ids ?? [])` falls back to [] — no .entity divs
  test("expanded action block with no entity_ids renders no entity rows", () => {
    const host = renderToHost(
      {
        explanation: null,
        actions: [{ service: "script.run_scene", params: {} }],
      },
      true,
    );
    expect(host.textContent).toContain("Run scene");
    expect(host.querySelectorAll(".entity")).toHaveLength(0);
  });

  // renderExpansion — line 182-184: actions.length = 0 in expanded view
  // Branch 57: `u.actions.length` falsy → nothing (no "Actions taken" section)
  test("expanded view with empty actions has no 'Actions taken' section", () => {
    const host = renderToHost({ actions: [] }, true);
    const titles = [...host.querySelectorAll(".section-title")].map((e) => e.textContent?.trim());
    expect(titles).not.toContain("Actions taken");
    // Scene evaluation section still present.
    expect(titles).toContain("Scene evaluation");
  });

  // renderEvaluation — expanded button shows "▾ Hide details"
  // Branch 48 (line 141): expanded=true → "▾ Hide details"
  test("expanded toggle button reads '▾ Hide details'", () => {
    const host = renderToHost({}, true);
    expect(host.querySelector(".why-toggle")?.textContent?.trim()).toContain("Hide details");
  });

  // renderEvaluation — line 147/149: canExpand=false → no why-toggle rendered
  // canExpand is false when explanation=null AND actions=[] (no-op outcome with nothing to show)
  test("no expand button rendered when unit has no actions and no explanation", () => {
    const host = renderToHost({ actions: [], explanation: null }, false);
    expect(host.querySelector(".why-toggle")).toBeFalsy();
    // The .why section is also absent.
    expect(host.querySelector(".why")).toBeFalsy();
  });
});
