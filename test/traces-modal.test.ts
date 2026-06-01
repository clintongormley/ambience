import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("../frontend/src/api", () => ({ listTraces: vi.fn() }));

import "../frontend/src/views/traces-modal";
import * as api from "../frontend/src/api";
import type { BufferedUnit } from "../frontend/src/types";

function unit(over: Partial<BufferedUnit> = {}): BufferedUnit {
  return {
    event_id: "e1", timestamp: "2026-06-01T10:00:00+00:00",
    cause: { kind: "entity", entity_id: "binary_sensor.motion", old: "off", new: "on", detail: null },
    scope_kind: "area", scope_id: "kitchen", scope_name: "Kitchen",
    group: "g1", group_name: "Evening", switch_state: "on",
    outcome: "acted", winner_name: "Evening",
    actions: [{ service: "light.turn_on", entity_ids: ["light.k"], params: {} }],
    explanation: null, ...over,
  };
}

async function mount(traces: BufferedUnit[], group = "g1"): Promise<any> {
  vi.mocked(api.listTraces).mockResolvedValue(traces);
  const el: any = document.createElement("ambience-traces-modal");
  el.hass = { callWS: vi.fn() };
  el.scope = { scope_kind: "area", scope_id: "kitchen" };
  el.group = group;
  el.groupName = "Evening";
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

  test("shows only this scope+group's records", async () => {
    el = await mount([
      unit({ event_id: "a" }),
      unit({ event_id: "b", scope_id: "hall" }),          // other scope_id — filtered out
      unit({ event_id: "c", group: "g2" }),                // other group — filtered out
      unit({ event_id: "d" }),
      unit({ event_id: "e", scope_kind: "floor" }),        // other scope_kind — filtered out
    ]);
    const evals = el.shadowRoot.querySelectorAll(".eval");
    expect(evals.length).toBe(2);                           // a + d only
    // initial mount must trigger exactly one fetch
    expect(vi.mocked(api.listTraces).mock.calls.length).toBe(1);
  });

  test("empty state when the group has no traces", async () => {
    el = await mount([unit({ scope_id: "hall" })]);  // nothing for kitchen/g1
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

  test("error state when listTraces rejects", async () => {
    vi.mocked(api.listTraces).mockRejectedValue(new Error("boom"));
    const e: any = document.createElement("ambience-traces-modal");
    e.hass = { callWS: vi.fn() }; e.scope = { scope_kind: "area", scope_id: "kitchen" };
    e.group = "g1"; e.groupName = "Evening"; e.open = true;
    document.body.appendChild(e);
    await e.updateComplete; await new Promise((r) => setTimeout(r, 0)); await e.updateComplete;
    expect(e.shadowRoot.textContent).toContain("boom");
    e.remove();
  });
});
