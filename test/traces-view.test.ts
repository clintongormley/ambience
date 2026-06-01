import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("../frontend/src/api", () => ({
  listTraces: vi.fn(),
  clearTraces: vi.fn(),
  countTraces: vi.fn(),
  listGroups: vi.fn(),
}));

import "../frontend/src/views/traces-view";
import * as api from "../frontend/src/api";
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
    actions: [{ service: "light.turn_on", entity_ids: ["light.k"], params: {} }],
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

function makeFakeHass() {
  return { callWS: vi.fn(), connection: { subscribeEvents: vi.fn().mockResolvedValue(vi.fn()) } } as any;
}

async function mount(traces: BufferedUnit[]): Promise<any> {
  vi.mocked(api.listTraces).mockResolvedValue(traces);
  vi.mocked(api.listGroups).mockResolvedValue([{ id: "g1", name: "Evening", icon: "mdi:weather-night", color: "blue" }]);
  vi.mocked(api.countTraces).mockResolvedValue({ count: traces.length, latest: traces[0]?.timestamp ?? null });
  const el: any = document.createElement("ambience-traces-view");
  el.hass = makeFakeHass();
  document.body.appendChild(el);
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  return el;
}

describe("ambience-traces-view", () => {
  let el: any;
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => el?.remove());

  test("empty state when no traces", async () => {
    el = await mount([]);
    expect(el.shadowRoot.textContent).toContain("No traces");
  });

  test("renders a bucket per (scope, group) with a count", async () => {
    el = await mount([unit(), unit({ event_id: "e2", scope_id: "hall", scope_name: "Hall", group: "g1" })]);
    const buckets = el.shadowRoot.querySelectorAll(".bucket");
    expect(buckets.length).toBe(2);
    expect(el.shadowRoot.textContent).toContain("Kitchen");
    expect(el.shadowRoot.textContent).toContain("Hall");
  });

  test("selecting a bucket shows its outcome-first evaluation", async () => {
    el = await mount([unit()]);
    const detail = el.shadowRoot.querySelector(".evaluations");
    expect(detail.textContent).toContain("Evening");
    expect(detail.textContent).toContain("light.turn_on");
  });

  test("the why-expander reveals per-predicate pass/fail", async () => {
    el = await mount([unit()]);
    const toggle = el.shadowRoot.querySelector(".why-toggle");
    toggle.click();
    await el.updateComplete;
    const why = el.shadowRoot.querySelector(".why");
    expect(why.textContent).toContain("tod");
    expect(why.textContent).toContain("Night");
  });

  test("outcome badge carries an outcome class", async () => {
    el = await mount([unit({ outcome: "reapplied", explanation: null })]);
    expect(el.shadowRoot.querySelector(".outcome.reapplied")).toBeTruthy();
  });

  test("shows an error when listTraces rejects", async () => {
    vi.mocked(api.listTraces).mockRejectedValue(new Error("boom"));
    vi.mocked(api.listGroups).mockResolvedValue([]);
    const e: any = document.createElement("ambience-traces-view");
    e.hass = makeFakeHass();
    document.body.appendChild(e);
    await e.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await e.updateComplete;
    expect(e.shadowRoot.textContent).toContain("boom");
    e.remove();
  });

  test("the why-expander marks not-evaluated rules", async () => {
    el = await mount([
      unit({
        explanation: {
          winner_index: 0,
          rules: [
            { index: 0, name: "First", matched: true, evaluated: true, predicates: [] },
            { index: 1, name: "Later", matched: false, evaluated: false, predicates: [] },
          ],
        },
      }),
    ]);
    el.shadowRoot.querySelector(".why-toggle").click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".why").textContent).toContain("not evaluated");
  });

  test("shows the new-data badge when a newer trace arrives, and refresh reloads", async () => {
    // Mount with real timers so the initial _load() and the mount helper's own
    // setTimeout(0) flush complete cleanly before fake timers take over.
    el = await mount([unit({ timestamp: "2026-06-01T10:00:00+00:00" })]);
    // Only switch to fake timers AFTER mount so the mount helper's setTimeout(0)
    // isn't frozen. The setInterval from connectedCallback was registered with real
    // timers; we simulate the poll tick by calling _checkNew() directly instead of
    // advancing the clock, then verify the badge and reload path work correctly.
    vi.useFakeTimers();
    try {
      // A newer record exists in the buffer than what's displayed.
      vi.mocked(api.countTraces).mockResolvedValue({ count: 2, latest: "2026-06-01T11:00:00+00:00" });
      // Advance past the 5-second interval. Because the setInterval was registered
      // before fake-timer takeover, we also fire the check directly to simulate the tick.
      await vi.advanceTimersByTimeAsync(5001);
      await (el as any)._checkNew();
      await el.updateComplete;
      const badge = el.shadowRoot.querySelector(".new-badge");
      expect(badge).toBeTruthy();
      // Clicking the badge reloads (listTraces called again).
      const calls = vi.mocked(api.listTraces).mock.calls.length;
      badge.click();
      await el.updateComplete;
      await Promise.resolve();
      expect(vi.mocked(api.listTraces).mock.calls.length).toBeGreaterThan(calls);
    } finally {
      vi.useRealTimers();
    }
  });
});
