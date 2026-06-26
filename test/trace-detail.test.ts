import { render } from "lit";
import { describe, expect, test } from "vitest";
import {
  formatActionHeader,
  formatCause,
  formatCauseFriendly,
  outcomeLabel,
  outcomeSummary,
  renderEvaluation,
} from "../frontend/src/trace-detail";
import type { BufferedUnit, ExposedAction, TracePredicate } from "../frontend/src/types";

function exposed(id: string, label: string): ExposedAction {
  return { id, label, visible_fields: [], defaults: {} };
}

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
      formatCause({}, { kind: "entity", entity_id: "x", old: "off", new: "on", detail: null }),
    ).toContain("off");
    expect(
      formatCause({}, { kind: "clock", entity_id: null, old: null, new: null, detail: "20:00" }),
    ).toContain("20:00");
  });

  test("formatCause labels the idle re-apply cause and keeps its interval detail", () => {
    expect(
      formatCause({}, { kind: "reapply", entity_id: null, old: null, new: null, detail: "1h30m" }),
    ).toBe("Re-run 1h30m");
  });

  test("formatCause normalizes null state values to '?' (not the string 'null')", () => {
    expect(
      formatCause({}, { kind: "entity", entity_id: "x", old: null, new: null, detail: null }),
    ).toBe("x ? → ?");
    expect(
      formatCause({}, { kind: "duration", entity_id: "x", old: null, new: null, detail: null }),
    ).toBe("x ? for ?");
  });

  test("formatCauseFriendly uses friendly name + formatted values for entity causes", () => {
    const hass = {
      states: { "binary_sensor.motion": { attributes: { friendly_name: "Master Bath Presence" } } },
      formatEntityState: (_s: unknown, v: string) => (v === "on" ? "On" : v === "off" ? "Off" : v),
    };
    expect(
      formatCauseFriendly(
        { kind: "entity", entity_id: "binary_sensor.motion", old: "off", new: "on", detail: null },
        hass,
      ),
    ).toBe("Master Bath Presence: Off → On");
  });

  test("formatCauseFriendly falls back to raw id + values without hass", () => {
    expect(
      formatCauseFriendly({
        kind: "entity",
        entity_id: "binary_sensor.motion",
        old: "off",
        new: "on",
        detail: null,
      }),
    ).toBe("binary_sensor.motion: off → on");
  });

  test("formatCauseFriendly renders duration causes with name + formatted value", () => {
    const hass = {
      states: { "binary_sensor.motion": { attributes: { friendly_name: "Hall" } } },
      formatEntityState: (_s: unknown, v: string) => (v === "off" ? "Clear" : v),
    };
    expect(
      formatCauseFriendly(
        {
          kind: "duration",
          entity_id: "binary_sensor.motion",
          old: null,
          new: "off",
          detail: "5m",
        },
        hass,
      ),
    ).toBe("Hall: Clear for 5m");
  });

  test("formatCauseFriendly renders a multi-entity duration cause via its label", () => {
    // No entity_id → no name/state lookup; render the label directly.
    expect(
      formatCauseFriendly({
        kind: "duration",
        entity_id: null,
        old: null,
        new: "nobody home",
        detail: "30m",
      }),
    ).toBe("nobody home for 30m");
  });

  test("formatCauseFriendly delegates non-entity causes to formatCause", () => {
    expect(
      formatCauseFriendly({ kind: "manual", entity_id: null, old: null, new: null, detail: null }),
    ).toBe("Manual apply");
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

  test("formatActionHeader prefers the configured exposed-action label over the derived service label", () => {
    const schemas = {
      "fado.fade_lights": { fields: { brightness_pct: { name: "Brightness" } }, target: null },
    };
    expect(
      formatActionHeader(
        { service: "fado.fade_lights", entity_ids: ["light.k"], params: { brightness_pct: 0 } },
        undefined,
        schemas as never,
        [exposed("fado.fade_lights", "Fade lights")],
      ),
    ).toBe("Fade lights · Brightness: 0");
  });

  test("formatActionHeader falls back to the derived label when no exposed action matches or its label is blank", () => {
    // Blank/whitespace configured label → fall back to the derived service label.
    expect(
      formatActionHeader({ service: "fado.fade_lights", entity_ids: [] }, undefined, undefined, [
        exposed("fado.fade_lights", "   "),
      ]),
    ).toBe("Fade lights fado");
    // No matching exposed action → fall back to the derived service label.
    expect(
      formatActionHeader({ service: "fado.fade_lights", entity_ids: [] }, undefined, undefined, [
        exposed("light.turn_on", "Lights on"),
      ]),
    ).toBe("Fade lights fado");
  });

  test("empty-label exposed action uses catalog schema name in formatActionHeader", () => {
    // An action seeded with label="" should fall back to schemas[id].name ("Turn on"),
    // not the humanized service id ("Ambience Turn On").
    const schemas = {
      "ambience.turn_on": { name: "Turn on", fields: {}, target: null },
    };
    expect(
      formatActionHeader(
        { service: "ambience.turn_on", entity_ids: [], params: {} },
        undefined,
        schemas as never,
        [exposed("ambience.turn_on", "")],
      ),
    ).toBe("Turn on");
  });

  test("empty-label exposed action uses catalog schema name in collapsed summary", () => {
    // The collapsed one-line summary (services list) should also show the catalog name.
    const host = document.createElement("div");
    render(
      renderEvaluation(
        unit({ actions: [{ service: "ambience.turn_on", entity_ids: ["light.k"] }] }),
        false,
        () => {},
        undefined,
        { "ambience.turn_on": { name: "Turn on", fields: {}, target: null } } as never,
        {},
        [exposed("ambience.turn_on", "")],
      ),
      host,
    );
    expect(host.textContent).toContain("Turn on");
    expect(host.textContent).not.toContain("Ambience");
  });

  test("collapsed action summary uses the configured exposed-action label", () => {
    const host = document.createElement("div");
    render(
      renderEvaluation(
        unit({ actions: [{ service: "fado.fade_lights", entity_ids: ["light.k", "light.m"] }] }),
        false,
        () => {},
        undefined,
        undefined,
        {},
        [exposed("fado.fade_lights", "Fade lights")],
      ),
      host,
    );
    expect(host.textContent).toContain("Fade lights");
    expect(host.textContent).not.toContain("Fade lights fado");
    expect(host.textContent).toContain("2 entities");
  });

  test("expanded actions-taken header uses the configured exposed-action label", () => {
    const host = document.createElement("div");
    render(
      renderEvaluation(
        unit({
          actions: [
            { service: "fado.fade_lights", entity_ids: ["light.k"], params: { brightness_pct: 0 } },
          ],
        }),
        true,
        () => {},
        undefined,
        {
          "fado.fade_lights": { fields: { brightness_pct: { name: "Brightness" } }, target: null },
        },
        {},
        [exposed("fado.fade_lights", "Fade lights")],
      ),
      host,
    );
    expect(host.textContent).toContain("Fade lights · Brightness: 0");
    expect(host.textContent).not.toContain("Fade lights fado");
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

  test("a debounced outcome renders its own badge (distinct from no_op)", () => {
    const host = renderToHost({ outcome: "debounced" }, false);
    expect(host.querySelector(".outcome.debounced")).toBeTruthy();
    // The CSS class stays the internal id; the displayed label is friendlier.
    expect(host.querySelector(".outcome .label")?.textContent?.trim()).toBe("unchanged");
  });

  // Every outcome that lists no actions surfaces its plain-language explanation
  // in the action-summary slot (where the action list would otherwise appear),
  // so the collapsed card never reads as a blank gap.
  test.each([
    ["debounced", "Evening", "already applied"],
    ["no_op", "Blocker", "no actions"],
    ["no_match", null, "No scene matched"],
    ["skipped_switch_off", null, "switch is off"],
    ["skipped_scope_disabled", null, "scope is disabled"],
    ["skipped_unavailable", null, "went unavailable"],
  ] as const)("%s (no actions) shows the explanation where the action summary would go", (outcome, winner_name, phrase) => {
    const host = renderToHost({ outcome, winner_name, actions: [] }, false);
    const slot = host.querySelector(".action-summary");
    expect(slot).toBeTruthy();
    expect(slot?.textContent).toContain(phrase);
  });

  test("an outcome with actions lists the actions, not the explanation", () => {
    const host = renderToHost({ outcome: "acted" }, false);
    const slot = host.querySelector(".action-summary");
    expect(slot?.textContent).toContain("→");
    expect(slot?.textContent).not.toContain("Applied");
  });

  test("expanding a no-action card does not duplicate the explanation in the header", () => {
    // Collapsed, the explanation sits in the header's action slot; once expanded,
    // the expansion's outcome-summary carries it, so the header slot drops out.
    const host = renderToHost({ outcome: "no_match", winner_name: null, actions: [] }, true);
    expect(host.querySelector(".action-summary")).toBeFalsy();
    expect(host.querySelector(".outcome-summary")?.textContent).toContain("No scene matched");
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
    expect(host.textContent).toContain("not reached");
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
    expect(host.textContent).not.toContain("not reached");
  });

  // -------------------------------------------------------------------------
  // Scene-evaluation entity more-info links
  // -------------------------------------------------------------------------

  function sceneEvalHost(
    predicates: TracePredicate[],
    hass?: Record<string, unknown>,
  ): HTMLElement {
    return renderToHost(
      {
        explanation: {
          winner_index: 0,
          scenes: [{ index: 0, name: "S", matched: true, evaluated: true, predicates }],
        },
      },
      true,
      hass,
    );
  }

  test("scene-evaluation entity names become inline more-info links", () => {
    const host = sceneEvalHost(
      [
        {
          condition_key: "occupancy",
          passed: true,
          detail: "Zone Shower: on ✓ (for ≥10s, held 13s)",
          entity_ids: ["binary_sensor.zone_1"],
        },
      ],
      { states: { "binary_sensor.zone_1": { attributes: { friendly_name: "Zone Shower" } } } },
    );
    const links = [...host.querySelectorAll(".pred .entity-link")].map((e) =>
      e.textContent?.trim(),
    );
    expect(links).toEqual(["Zone Shower"]);
    // The surrounding detail text is preserved around the link.
    expect(host.querySelector(".pred")?.textContent).toContain("on ✓ (for ≥10s, held 13s)");
  });

  test("an entity in an area still links by its backend (un-prefixed) name", () => {
    // Regression: condition summaries area-prefix names ("Kitchen · Zone Shower"),
    // but the backend bakes the BARE friendly name into the trace detail. The
    // link matcher must use the un-prefixed name or area-scoped entities silently
    // lose their more-info link.
    const host = sceneEvalHost(
      [
        {
          condition_key: "occupancy",
          passed: true,
          detail: "Zone Shower: on ✓",
          entity_ids: ["binary_sensor.zone_1"],
        },
      ],
      {
        states: { "binary_sensor.zone_1": { attributes: { friendly_name: "Zone Shower" } } },
        entities: {
          "binary_sensor.zone_1": { entity_id: "binary_sensor.zone_1", area_id: "kitchen" },
        },
        devices: {},
        areas: { kitchen: { area_id: "kitchen", name: "Kitchen" } },
      },
    );
    const links = [...host.querySelectorAll(".pred .entity-link")].map((e) =>
      e.textContent?.trim(),
    );
    expect(links).toEqual(["Zone Shower"]);
  });

  test("multiple entities each link; a shorter name does not double-wrap a longer one", () => {
    // "Hall Light" appears first, so the shorter "Hall" must skip the "Hall"
    // *inside* it and claim the standalone occurrence further along.
    const host = sceneEvalHost(
      [
        {
          condition_key: "occupancy",
          passed: true,
          detail: "all of: Hall Light: off ✗, Hall: on ✓",
          entity_ids: ["binary_sensor.hall", "light.hall"],
        },
      ],
      {
        states: {
          "binary_sensor.hall": { attributes: { friendly_name: "Hall" } },
          "light.hall": { attributes: { friendly_name: "Hall Light" } },
        },
      },
    );
    const links = [...host.querySelectorAll(".pred .entity-link")].map((e) =>
      e.textContent?.trim(),
    );
    // Linked once each, in the order they appear in the detail string.
    expect(links).toEqual(["Hall Light", "Hall"]);
  });

  test("an entity with no friendly name links by its raw id (as baked into the detail)", () => {
    const host = sceneEvalHost(
      [
        {
          condition_key: "occupancy",
          passed: true,
          detail: "binary_sensor.zone_1: on ✓",
          entity_ids: ["binary_sensor.zone_1"],
        },
      ],
      // No friendly_name → entityName falls back to the id, which the
      // backend also baked into the detail, so the id itself becomes the link.
      { states: { "binary_sensor.zone_1": { attributes: {} } } },
    );
    const links = [...host.querySelectorAll(".pred .entity-link")].map((e) =>
      e.textContent?.trim(),
    );
    expect(links).toEqual(["binary_sensor.zone_1"]);
  });

  test("clicking a scene-evaluation entity link fires hass-more-info for that entity", () => {
    const host = sceneEvalHost(
      [
        {
          condition_key: "occupancy",
          passed: true,
          detail: "Zone Shower: on ✓",
          entity_ids: ["binary_sensor.zone_1"],
        },
      ],
      { states: { "binary_sensor.zone_1": { attributes: { friendly_name: "Zone Shower" } } } },
    );
    let detail: unknown;
    host.addEventListener("hass-more-info", (e) => {
      detail = (e as CustomEvent).detail;
    });
    (host.querySelector(".pred .entity-link") as HTMLElement).click();
    expect(detail).toEqual({ entityId: "binary_sensor.zone_1" });
  });

  test("a renamed/missing entity falls back to plain detail text (no link)", () => {
    const host = sceneEvalHost(
      [
        {
          condition_key: "occupancy",
          passed: true,
          // Name baked at trace time; the entity has since been renamed in hass.
          detail: "Zone Shower: on ✓",
          entity_ids: ["binary_sensor.zone_1"],
        },
      ],
      { states: { "binary_sensor.zone_1": { attributes: { friendly_name: "Renamed Zone" } } } },
    );
    expect(host.querySelector(".pred .entity-link")).toBeFalsy();
    expect(host.querySelector(".pred")?.textContent).toContain("Zone Shower: on ✓");
  });

  test("a predicate with no entity_ids renders the detail as plain text", () => {
    const host = sceneEvalHost([
      { condition_key: "people", passed: true, detail: "3 of 5 home (Alice, Bob)" },
    ]);
    expect(host.querySelector(".pred .entity-link")).toBeFalsy();
    expect(host.querySelector(".pred")?.textContent).toContain("3 of 5 home (Alice, Bob)");
  });

  test("state attribute-mode links only the entity name, not the appended attribute", () => {
    const host = sceneEvalHost(
      [
        {
          condition_key: "state",
          passed: true,
          detail: "Thermostat temperature: 22°C ✓ (is 20)",
          entity_ids: ["climate.thermostat"],
        },
      ],
      { states: { "climate.thermostat": { attributes: { friendly_name: "Thermostat" } } } },
    );
    const links = [...host.querySelectorAll(".pred .entity-link")].map((e) =>
      e.textContent?.trim(),
    );
    expect(links).toEqual(["Thermostat"]); // not "Thermostat temperature"
    expect(host.querySelector(".pred")?.textContent).toContain("temperature: 22°C ✓ (is 20)");
  });

  test("ambient sun condition does NOT link its prose, even though it carries sun.sun", () => {
    // sun.describe() is prose ("Sun 12° elevation"); the leading word "Sun"
    // equals sun.sun's friendly name only by coincidence — must not be linked.
    const host = sceneEvalHost(
      [
        {
          condition_key: "sun",
          passed: true,
          detail: "Sun 12° elevation, 180° azimuth (S)",
          entity_ids: ["sun.sun"],
        },
      ],
      { states: { "sun.sun": { attributes: { friendly_name: "Sun" } } } },
    );
    expect(host.querySelector(".pred .entity-link")).toBeFalsy();
    expect(host.querySelector(".pred")?.textContent).toContain(
      "Sun 12° elevation, 180° azimuth (S)",
    );
  });

  test("ambient weather condition does NOT link, even when its entity name matches the label", () => {
    // weather detail is localized to a condition word; linking the weather
    // entity here would be a coincidental match on that word.
    const host = sceneEvalHost(
      [
        {
          condition_key: "weather",
          passed: true,
          detail: "sunny", // formatDetail → weatherConditionLabel → "Sunny"
          entity_ids: ["weather.home"],
        },
      ],
      { states: { "weather.home": { attributes: { friendly_name: "Sunny" } } } },
    );
    expect(host.querySelector(".pred .entity-link")).toBeFalsy();
    expect(host.querySelector(".pred")?.textContent).toContain("Sunny");
  });

  // -------------------------------------------------------------------------
  // NEW: branch coverage additions
  // -------------------------------------------------------------------------

  // formatCause — line 61-63: kind != "entity" AND detail is null/falsy
  // Branch 8: returns humanizeId(c.kind) with no detail
  test("formatCause returns humanized kind when kind is not 'entity' and detail is null", () => {
    const result = formatCause(
      {},
      {
        kind: "startup",
        entity_id: null,
        old: null,
        new: null,
        detail: null,
      },
    );
    // detail is null → falls through to `return humanizeId(c.kind)`
    expect(result).toBe("Startup");
    expect(result).not.toContain("null");
  });

  // formatCause — line 61: kind != "entity" AND detail is falsy string ""
  test("formatCause returns humanized kind when detail is empty string", () => {
    const result = formatCause(
      {},
      {
        kind: "manual",
        entity_id: null,
        old: null,
        new: null,
        detail: "" as unknown as null, // coerce — empty string is falsy
      },
    );
    expect(result).toBe("Manual apply");
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
    expect(host.textContent).toContain("not reached");
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
    expect(host.textContent).toContain("no match");
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

  test("there is no chevron — the outcome bar itself is the affordance", () => {
    expect(renderToHost({}, false).querySelector(".chev")).toBeNull();
    expect(renderToHost({}, true).querySelector(".chev")).toBeNull();
  });

  test("the timestamp lives inside the outcome bar", () => {
    const bar = renderToHost({}, false).querySelector(".outcome");
    expect(bar?.querySelector(".ts")).toBeTruthy();
  });

  test("aria-expanded on the outcome bar reflects state and is absent when not expandable", () => {
    expect(renderToHost({}, false).querySelector(".outcome")?.getAttribute("aria-expanded")).toBe(
      "false",
    );
    expect(renderToHost({}, true).querySelector(".outcome")?.getAttribute("aria-expanded")).toBe(
      "true",
    );
    const flat = renderToHost({ actions: [], explanation: null, outcome: "no_match" }, false);
    expect(flat.querySelector(".outcome")?.hasAttribute("aria-expanded")).toBe(false);
  });

  test("only the outcome bar toggles; the body text and expanded panel do not", () => {
    let toggles = 0;
    const host = document.createElement("div");
    render(
      renderEvaluation(
        unit(),
        true,
        () => {
          toggles += 1;
        },
        undefined,
        undefined as never,
      ),
      host,
    );
    // The trigger/winner/action body sits outside the bar and must not toggle.
    (host.querySelector(".cause-line") as HTMLElement).click();
    expect(toggles).toBe(0);
    (host.querySelector(".why") as HTMLElement | null)?.click();
    expect(toggles).toBe(0); // clicking inside the detail must not toggle
    (host.querySelector(".outcome") as HTMLElement).click();
    expect(toggles).toBe(1); // only the bar toggles
    expect(host.querySelector(".why-toggle")).toBeNull(); // old button removed
  });

  test("the expanded panel shows the raw trigger for entity causes only", () => {
    const entity = renderToHost({}, true); // default cause kind is "entity"
    expect(entity.querySelector(".raw-trigger")?.textContent).toContain("binary_sensor.motion");
    const manual = renderToHost(
      { cause: { kind: "manual", entity_id: null, old: null, new: null, detail: null } },
      true,
    );
    expect(manual.querySelector(".raw-trigger")).toBeNull();
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

  // renderEvaluation — line 147/149: canExpand=false → not clickable, no .why section
  // canExpand is false when explanation=null AND actions=[] (no-op outcome with nothing to show)
  test("not clickable and no .why section when unit has no actions and no explanation", () => {
    const host = renderToHost({ actions: [], explanation: null }, false);
    expect(host.querySelector(".outcome.clickable")).toBeFalsy();
    expect(host.querySelector(".why")).toBeFalsy();
  });

  // -------------------------------------------------------------------------
  // Wording: friendly outcome labels, summary lines, Trigger: prefix
  // -------------------------------------------------------------------------

  test("outcomeLabel maps internal ids to friendly badge text", () => {
    expect(outcomeLabel({}, "acted")).toBe("applied");
    expect(outcomeLabel({}, "no_op")).toBe("blocked");
    expect(outcomeLabel({}, "debounced")).toBe("unchanged");
    expect(outcomeLabel({}, "no_match")).toBe("no match");
    expect(outcomeLabel({}, "skipped_switch_off")).toBe("skipped");
    expect(outcomeLabel({}, "skipped_scope_disabled")).toBe("skipped");
    expect(outcomeLabel({}, "skipped_unavailable")).toBe("skipped");
  });

  test("badge shows the friendly label while keeping the internal CSS class", () => {
    const host = renderToHost({ outcome: "acted" }, false);
    expect(host.querySelector(".outcome.acted")).toBeTruthy(); // class = internal id
    expect(host.querySelector(".outcome .label")?.textContent?.trim()).toBe("applied"); // text = label
  });

  test("outcomeSummary explains each outcome in plain language", () => {
    const applied = outcomeSummary({}, unit({ outcome: "acted", winner_name: "Evening" }));
    expect(applied).toContain("Applied");
    expect(applied).toContain("Evening");

    expect(outcomeSummary({}, unit({ outcome: "no_op", winner_name: "Blocker" }))).toContain(
      "no actions",
    );
    expect(outcomeSummary({}, unit({ outcome: "debounced", winner_name: "Evening" }))).toContain(
      "already applied",
    );
    expect(outcomeSummary({}, unit({ outcome: "no_match", winner_name: null }))).toContain(
      "No scene matched",
    );
    expect(outcomeSummary({}, unit({ outcome: "skipped_switch_off" }))).toContain("switch is off");
    expect(outcomeSummary({}, unit({ outcome: "skipped_scope_disabled" }))).toContain(
      "scope is disabled",
    );
    expect(outcomeSummary({}, unit({ outcome: "skipped_unavailable" }))).toContain(
      "went unavailable",
    );
  });

  test("the friendly outcome summary appears at the top of the expansion", () => {
    const host = renderToHost({ outcome: "no_match", winner_name: null }, true);
    const summary = host.querySelector(".outcome-summary");
    expect(summary).toBeTruthy();
    expect(summary?.textContent).toContain("No scene matched");
  });

  test("a skipped unit can expand to reveal why it was skipped", () => {
    const host = renderToHost(
      { outcome: "skipped_switch_off", winner_name: null, actions: [], explanation: null },
      true,
    );
    expect(host.querySelector(".outcome.clickable")).toBeTruthy();
    expect(host.querySelector(".outcome-summary")?.textContent).toContain("switch is off");
  });

  test("the cause line is prefixed with 'Trigger: '", () => {
    const host = renderToHost({}, false);
    expect(host.querySelector(".cause-line")?.textContent?.trim()).toMatch(/^Trigger:/);
  });

  test("formatCause uses friendly labels for non-entity causes", () => {
    const base = { entity_id: null, old: null, new: null } as const;
    expect(formatCause({}, { kind: "switch", ...base, detail: null })).toBe("Switch turned on");
    expect(formatCause({}, { kind: "manual", ...base, detail: null })).toBe("Manual apply");
    expect(formatCause({}, { kind: "simulated", ...base, detail: "2026-06-01T10:00:00" })).toBe(
      "Simulation",
    );
    expect(formatCause({}, { kind: "has_time", ...base, detail: null })).toBe(
      "Periodic time check",
    );
  });

  test("formatCause renders a duration cause as 'entity state for duration'", () => {
    expect(
      formatCause(
        {},
        {
          kind: "duration",
          entity_id: "binary_sensor.motion",
          old: null,
          new: "off",
          detail: "5m",
        },
      ),
    ).toBe("binary_sensor.motion off for 5m");
  });

  test("formatCause renders a multi-entity duration cause as '<label> for duration'", () => {
    expect(
      formatCause(
        {},
        {
          kind: "duration",
          entity_id: null,
          old: null,
          new: "nobody home",
          detail: "30m",
        },
      ),
    ).toBe("nobody home for 30m");
  });

  test("per-scene marks read '✓ matched' / '✗ no match'", () => {
    const host = renderToHost({}, true);
    const scenes = [...host.querySelectorAll(".scene")].map((e) => e.textContent);
    expect(scenes.some((t) => t?.includes("✓ matched"))).toBe(true); // Evening won
    expect(scenes.some((t) => t?.includes("✗ no match"))).toBe(true); // Night lost
    expect(host.textContent).not.toContain("WON");
  });

  test("formatCause renders the reloaded kind as 'Reloaded'", () => {
    expect(
      formatCause({}, { kind: "reloaded", entity_id: null, old: null, new: null, detail: null }),
    ).toBe("Reloaded");
  });
});

describe("trace-detail clickable entities", () => {
  test("clicking the trigger entity opens more-info for the cause entity", () => {
    const host = renderToHost({}, false);
    let detail: unknown;
    host.addEventListener("hass-more-info", (e) => (detail = (e as CustomEvent).detail));
    const link = host.querySelector(".cause-line .entity-link") as HTMLElement;
    link.click();
    expect(detail).toEqual({ entityId: "binary_sensor.motion" });
  });

  test("clicking an action entity opens more-info for that entity", () => {
    const host = renderToHost({}, true); // expanded so "Actions taken" is rendered
    let detail: unknown;
    host.addEventListener("hass-more-info", (e) => (detail = (e as CustomEvent).detail));
    const link = [...host.querySelectorAll(".action-block .entity .entity-link")].find((el) =>
      el.textContent?.includes("light.counter"),
    ) as HTMLElement;
    link.click();
    expect(detail).toEqual({ entityId: "light.counter" });
  });

  test("pressing Enter on an entity opens more-info", () => {
    const host = renderToHost({}, false);
    let detail: unknown;
    host.addEventListener("hass-more-info", (e) => (detail = (e as CustomEvent).detail));
    const link = host.querySelector(".cause-line .entity-link") as HTMLElement;
    link.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(detail).toEqual({ entityId: "binary_sensor.motion" });
  });

  test("clicking the raw-trigger entity opens more-info", () => {
    const host = renderToHost({}, true); // expanded so the raw-trigger line is rendered
    let detail: unknown;
    host.addEventListener("hass-more-info", (e) => (detail = (e as CustomEvent).detail));
    const link = host.querySelector(".raw-trigger .entity-link") as HTMLElement;
    link.click();
    expect(detail).toEqual({ entityId: "binary_sensor.motion" });
  });

  test("the raw-trigger shows the raw entity_id even when a friendly name exists", () => {
    const hass = {
      states: { "binary_sensor.motion": { attributes: { friendly_name: "Hall Motion" } } },
    };
    const host = renderToHost({}, true, hass);
    const link = host.querySelector(".raw-trigger .entity-link") as HTMLElement;
    expect(link.textContent).toBe("binary_sensor.motion");
  });

  test("a non-entity cause renders no clickable entity in the trigger line", () => {
    const host = renderToHost(
      { cause: { kind: "manual", entity_id: null, old: null, new: null, detail: null } },
      false,
    );
    expect(host.querySelector(".cause-line .entity-link")).toBeNull();
    expect(host.querySelector(".cause-line")?.textContent).toContain("Manual apply");
  });

  test("the clickable entity is keyboard-focusable with a button role", () => {
    const host = renderToHost({}, false);
    const link = host.querySelector(".cause-line .entity-link") as HTMLElement;
    expect(link.getAttribute("role")).toBe("button");
    expect(link.getAttribute("tabindex")).toBe("0");
  });

  test("pressing Space on an entity opens more-info", () => {
    const host = renderToHost({}, false);
    let detail: unknown;
    host.addEventListener("hass-more-info", (e) => (detail = (e as CustomEvent).detail));
    const link = host.querySelector(".cause-line .entity-link") as HTMLElement;
    link.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    expect(detail).toEqual({ entityId: "binary_sensor.motion" });
  });

  test("the raw-trigger normalizes null state values to '?' rather than blanks", () => {
    const host = renderToHost(
      {
        cause: {
          kind: "entity",
          entity_id: "binary_sensor.motion",
          old: null,
          new: "on",
          detail: null,
        },
      },
      true, // expanded so the raw-trigger line is rendered
    );
    expect(host.querySelector(".raw-trigger")?.textContent).toContain(
      "binary_sensor.motion ? → on",
    );
  });

  test("a duration cause renders clickable entities in both the trigger and raw-trigger lines", () => {
    const host = renderToHost(
      {
        cause: {
          kind: "duration",
          entity_id: "binary_sensor.motion",
          old: null,
          new: "off",
          detail: "5m",
        },
      },
      true, // expanded so the raw-trigger line is rendered too
    );
    const causeLink = host.querySelector(".cause-line .entity-link") as HTMLElement;
    const rawLink = host.querySelector(".raw-trigger .entity-link") as HTMLElement;
    expect(host.querySelector(".cause-line")?.textContent).toContain("for 5m");
    expect(host.querySelector(".raw-trigger")?.textContent).toContain("off for 5m");
    let detail: unknown;
    host.addEventListener("hass-more-info", (e) => (detail = (e as CustomEvent).detail));
    causeLink.click();
    expect(detail).toEqual({ entityId: "binary_sensor.motion" });
    detail = undefined;
    rawLink.click();
    expect(detail).toEqual({ entityId: "binary_sensor.motion" });
  });
});

describe("review fixes", () => {
  test("custom time-of-day period labels resolve via the supplied periods map", () => {
    const host = document.createElement("div");
    render(
      renderEvaluation(
        unit({
          explanation: {
            winner_index: 0,
            scenes: [
              {
                index: 0,
                name: "Wind down",
                matched: true,
                evaluated: true,
                predicates: [{ condition_key: "time_of_day", passed: true, detail: "wind_down" }],
              },
            ],
          },
        }),
        true,
        () => {},
        undefined,
        undefined,
        {
          wind_down: {
            label: "Calmer evenings",
            from: { kind: "time", hh: 20, mm: 0 },
            to: { kind: "time", hh: 22, mm: 0 },
          },
        },
      ),
      host,
    );
    expect(host.textContent).toContain("Calmer evenings");
    expect(host.textContent).not.toContain("wind_down");
  });

  test("outcomeSummary notes how many actions were skipped (unexposed)", () => {
    const summary = outcomeSummary(
      {},
      unit({
        actions: [
          { service: "light.turn_on", entity_ids: ["light.k"], params: {} },
          { service: "light.toggle", entity_ids: ["light.b"], params: {}, unexposed: true },
        ],
      }),
    );
    expect(summary).toContain("1 skipped");
  });

  test("renderEvaluation marks an unexposed action as not exposed", () => {
    const host = renderToHost(
      {
        actions: [
          { service: "light.toggle", entity_ids: ["light.b"], params: {}, unexposed: true },
        ],
      },
      true,
    );
    expect(host.textContent).toContain("not exposed");
  });

  test("collapsed summary does not present an all-skipped unit's action as taken", () => {
    const host = renderToHost(
      {
        actions: [
          { service: "light.toggle", entity_ids: ["light.b"], params: {}, unexposed: true },
        ],
      },
      false,
    );
    // The one-line summary must not read like the skipped action ran; it falls
    // through to the outcome summary, which notes the skip.
    expect(host.textContent).toContain("skipped");
    expect(host.textContent).not.toContain("· 1 entity");
  });

  test("outcomeSummary reads sensibly when every action was skipped", () => {
    const summary = outcomeSummary(
      {},
      unit({
        actions: [
          { service: "light.toggle", entity_ids: ["light.b"], params: {}, unexposed: true },
        ],
      }),
    );
    expect(summary).toContain("skipped");
    expect(summary).not.toContain("0 actions");
    expect(summary).not.toMatch(/^Applied/);
  });
});
