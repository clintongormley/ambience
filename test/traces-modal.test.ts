import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("../frontend/src/api", () => ({ listTraces: vi.fn(), getServiceSchema: vi.fn() }));

import "../frontend/src/views/traces-modal";
import * as api from "../frontend/src/api";
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
    actions: [{ service: "light.turn_on", entity_ids: ["light.k"], params: {} }],
    explanation: null,
    ...over,
  };
}

async function mount(traces: BufferedUnit[], category = "g1"): Promise<any> {
  vi.mocked(api.listTraces).mockResolvedValue(traces);
  const el: any = document.createElement("ambience-traces-modal");
  el.hass = { callWS: vi.fn() };
  el.scope = { scope_kind: "area", scope_id: "kitchen" };
  el.category = category;
  el.categoryName = "Evening";
  el.open = true;
  document.body.appendChild(el);
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  return el;
}

describe("ambience-traces-modal", () => {
  let el: any;
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => el?.remove());

  test("shows only this scope+category's records", async () => {
    el = await mount([
      unit({ event_id: "a" }),
      unit({ event_id: "b", scope_id: "hall" }), // other scope_id — filtered out
      unit({ event_id: "c", category: "g2" }), // other category — filtered out
      unit({ event_id: "d" }),
      unit({ event_id: "e", scope_kind: "floor" }), // other scope_kind — filtered out
    ]);
    const evals = el.shadowRoot.querySelectorAll(".eval");
    expect(evals.length).toBe(2); // a + d only
    // initial mount must trigger exactly one fetch
    expect(vi.mocked(api.listTraces).mock.calls.length).toBe(1);
  });

  test("empty state when the category has no traces", async () => {
    el = await mount([unit({ scope_id: "hall" })]); // nothing for kitchen/g1
    expect(el.shadowRoot.textContent).toContain("No traces");
  });

  test("refresh re-fetches", async () => {
    el = await mount([unit()]);
    const calls = vi.mocked(api.listTraces).mock.calls.length;
    el.shadowRoot.querySelector(".refresh").click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    expect(vi.mocked(api.listTraces).mock.calls.length).toBeGreaterThan(calls);
  });

  test("reopening starts collapsed — a reload clears any expanded rows", async () => {
    const withExpl = unit({
      explanation: {
        winner_index: 0,
        rules: [{ index: 0, name: "Evening", matched: true, evaluated: true, predicates: [] }],
      },
    });
    el = await mount([withExpl]);
    el.shadowRoot.querySelector(".why-toggle").click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".why")).toBeTruthy(); // expanded
    // A reload (reopen / category-change / refresh) must reset expansion.
    el.shadowRoot.querySelector(".refresh").click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".why")).toBeFalsy(); // collapsed again
  });

  test("Refresh flags when newer traces are available for this category, and clears on refresh", async () => {
    el = await mount([unit({ event_id: "old", timestamp: "2026-06-01T10:00:00+00:00" })]);
    expect(el.shadowRoot.querySelector(".refresh.has-new")).toBeFalsy();
    // A newer record lands in the same (scope, category) bucket.
    vi.mocked(api.listTraces).mockResolvedValue([
      unit({ event_id: "new", timestamp: "2026-06-01T11:00:00+00:00" }),
    ]);
    await el._checkNew(); // simulate a poll tick
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".refresh.has-new")).toBeTruthy();
    // Refresh loads the new record and clears the flag.
    el.shadowRoot.querySelector(".refresh").click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".refresh.has-new")).toBeFalsy();
  });

  test("the new-traces flag ignores newer records from other categories", async () => {
    el = await mount([unit({ event_id: "old", timestamp: "2026-06-01T10:00:00+00:00" })]);
    vi.mocked(api.listTraces).mockResolvedValue([
      unit({ event_id: "other", category: "g2", timestamp: "2026-06-01T12:00:00+00:00" }),
    ]);
    await el._checkNew();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".refresh.has-new")).toBeFalsy();
  });

  test("threads service schemas so action param labels use HA's field names", async () => {
    vi.mocked(api.getServiceSchema).mockResolvedValue({
      fields: { brightness_pct: { name: "Brightness" } },
      target: null,
    } as never);
    el = await mount([
      unit({
        actions: [
          { service: "light.turn_on", entity_ids: ["light.k"], params: { brightness_pct: 60 } },
        ],
        explanation: {
          winner_index: 0,
          rules: [{ index: 0, name: "Evening", matched: true, evaluated: true, predicates: [] }],
        },
      }),
    ]);
    // Expand the row to reveal the "Actions taken" section.
    el.shadowRoot.querySelector(".why-toggle").click();
    await el.updateComplete;
    // Let the schema fetch resolve and the label refine.
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(vi.mocked(api.getServiceSchema)).toHaveBeenCalledWith(el.hass, "light.turn_on");
    expect(el.shadowRoot.textContent).toContain("Brightness: 60");
    expect(el.shadowRoot.textContent).not.toContain("Brightness pct");
  });

  test("error state when listTraces rejects", async () => {
    vi.mocked(api.listTraces).mockRejectedValue(new Error("boom"));
    const e: any = document.createElement("ambience-traces-modal");
    e.hass = { callWS: vi.fn() };
    e.scope = { scope_kind: "area", scope_id: "kitchen" };
    e.category = "g1";
    e.categoryName = "Evening";
    e.open = true;
    document.body.appendChild(e);
    await e.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await e.updateComplete;
    expect(e.shadowRoot.textContent).toContain("boom");
    e.remove();
  });
});
