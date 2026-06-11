import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("../frontend/src/api", () => ({
  listTraces: vi.fn(),
  getServiceSchema: vi.fn(),
  downloadScopeDiagnostics: vi.fn(),
  clearTraces: vi.fn(async () => undefined),
}));

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
        scenes: [{ index: 0, name: "Evening", matched: true, evaluated: true, predicates: [] }],
      },
    });
    el = await mount([withExpl]);
    el.shadowRoot.querySelector(".outcome").click();
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
          scenes: [{ index: 0, name: "Evening", matched: true, evaluated: true, predicates: [] }],
        },
      }),
    ]);
    // Expand the row to reveal the "Actions taken" section.
    el.shadowRoot.querySelector(".outcome").click();
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

  // ── missing-branch coverage ────────────────────────────────────────────────

  test("renders nothing when open is false", async () => {
    vi.mocked(api.listTraces).mockResolvedValue([]);
    el = document.createElement("ambience-traces-modal");
    el.hass = { callWS: vi.fn() };
    el.scope = { scope_kind: "area", scope_id: "kitchen" };
    el.category = "g1";
    el.categoryName = "Evening";
    el.open = false;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".modal")).toBeFalsy();
    expect(vi.mocked(api.listTraces)).not.toHaveBeenCalled();
  });

  test("title falls back to category id when categoryName is null", async () => {
    vi.mocked(api.listTraces).mockResolvedValue([]);
    el = document.createElement("ambience-traces-modal");
    el.hass = { callWS: vi.fn() };
    el.scope = { scope_kind: "area", scope_id: "kitchen" };
    el.category = "cat-fallback-id";
    el.categoryName = null;
    el.open = true;
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("h3")!.textContent).toContain("cat-fallback-id");
  });

  test("download button calls downloadScopeDiagnostics with this scope+category", async () => {
    el = await mount([unit()]);
    const btn = el.shadowRoot.querySelector(".download");
    expect(btn).toBeTruthy();
    btn.click();
    expect(api.downloadScopeDiagnostics).toHaveBeenCalledWith(
      el.hass,
      { scope_kind: "area", scope_id: "kitchen" },
      "g1",
    );
  });

  test("download failure surfaces an error instead of an unhandled rejection", async () => {
    el = await mount([unit()]);
    vi.mocked(api.downloadScopeDiagnostics).mockRejectedValueOnce(new Error("ws boom"));

    el.shadowRoot.querySelector(".download").click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(el.shadowRoot.querySelector(".error")!.textContent).toContain("ws boom");
  });

  test("close button dispatches the close event", async () => {
    el = await mount([unit()]);
    const events: Event[] = [];
    el.addEventListener("close", (e: Event) => events.push(e));
    el.shadowRoot.querySelector(".close").click();
    expect(events.length).toBe(1);
  });

  test("clicking an expanded row collapses it", async () => {
    const withExpl = unit({
      explanation: {
        winner_index: 0,
        scenes: [{ index: 0, name: "Evening", matched: true, evaluated: true, predicates: [] }],
      },
    });
    el = await mount([withExpl]);
    const toggle = el.shadowRoot.querySelector(".outcome");
    toggle.click(); // expand
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".why")).toBeTruthy();
    toggle.click(); // collapse — exercises the delete-from-Set branch
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".why")).toBeFalsy();
  });

  test("_checkNew skips the poll when modal is closed", async () => {
    el = await mount([unit({ timestamp: "2026-06-01T10:00:00+00:00" })]);
    const callsBefore = vi.mocked(api.listTraces).mock.calls.length;
    el.open = false;
    await el.updateComplete;
    await el._checkNew(); // should return early
    expect(vi.mocked(api.listTraces).mock.calls.length).toBe(callsBefore);
  });

  test("_checkNew sets has-new when current records are empty but a new trace arrives", async () => {
    // Mount with empty trace list so _records is empty (shown timestamp = null)
    el = await mount([]);
    expect(el.shadowRoot.querySelector(".refresh.has-new")).toBeFalsy();
    vi.mocked(api.listTraces).mockResolvedValue([
      unit({ event_id: "new", timestamp: "2026-06-01T09:00:00+00:00" }),
    ]);
    await el._checkNew();
    await el.updateComplete;
    // newest is truthy, shown is null → (!shown) branch taken → has-new set
    expect(el.shadowRoot.querySelector(".refresh.has-new")).toBeTruthy();
  });

  test("error state stringifies non-Error rejects from listTraces", async () => {
    vi.mocked(api.listTraces).mockRejectedValue("string rejection");
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
    expect(e.shadowRoot.textContent).toContain("string rejection");
    e.remove();
  });

  test("_checkNew stays silent when listTraces rejects", async () => {
    el = await mount([unit({ timestamp: "2026-06-01T10:00:00+00:00" })]);
    vi.mocked(api.listTraces).mockRejectedValue(new Error("poll error"));
    // Should not throw; error is swallowed
    await expect(el._checkNew()).resolves.toBeUndefined();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".refresh.has-new")).toBeFalsy();
  });

  test("failed service-schema fetch is tolerated — falls back to raw param keys", async () => {
    vi.mocked(api.getServiceSchema).mockRejectedValue(new Error("schema unavailable"));
    el = await mount([
      unit({
        actions: [
          { service: "light.turn_on", entity_ids: ["light.k"], params: { brightness_pct: 80 } },
        ],
        explanation: {
          winner_index: 0,
          scenes: [{ index: 0, name: "Evening", matched: true, evaluated: true, predicates: [] }],
        },
      }),
    ]);
    // Let the (failing) schema fetch settle
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    // Expand the row to verify the fallback humanized key is used
    el.shadowRoot.querySelector(".outcome").click();
    await el.updateComplete;
    expect(el.shadowRoot.textContent).toContain("80"); // value still present
    // Schema is absent, so raw/humanized key is shown
    expect(el.shadowRoot.textContent).not.toContain("Brightness:");
  });

  test("records with null event_id or timestamp render without error", async () => {
    const noIds = unit({
      event_id: null as unknown as string,
      timestamp: null as unknown as string,
    });
    el = await mount([noIds]);
    // The index fallback (event_id ?? i) and ("") fallback are exercised.
    // Element renders and the eval row is present.
    expect(el.shadowRoot.querySelectorAll(".eval").length).toBe(1);
  });
});

describe("review fixes", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("a Clear button empties the buffer via ambience/traces/clear", async () => {
    el = await mount([unit()]);
    const clearBtn = el.shadowRoot.querySelector("button.clear") as HTMLButtonElement;
    expect(clearBtn).not.toBeNull();
    vi.mocked(api.listTraces).mockResolvedValue([]);
    clearBtn.click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(vi.mocked(api.clearTraces)).toHaveBeenCalled();
    expect(el.shadowRoot.textContent).toContain("No traces for this category yet.");
  });

  test("the new-traces poll runs only while the modal is open", async () => {
    el = await mount([unit()]);
    expect(el._poll).not.toBeUndefined();
    el.open = false;
    await el.updateComplete;
    // The interval is torn down on close instead of ticking for the lifetime
    // of scopes-view (the element is always mounted).
    expect(el._poll).toBeUndefined();
  });

  test("Escape closes the modal", async () => {
    el = await mount([unit()]);
    let closed = false;
    el.addEventListener("close", () => {
      closed = true;
    });
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(closed).toBe(true);
  });
});
