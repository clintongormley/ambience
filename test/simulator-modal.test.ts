import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("../frontend/src/api", () => ({
  simulateInputs: vi.fn(),
  simulate: vi.fn(),
}));

import "../frontend/src/views/simulator-modal";
import * as api from "../frontend/src/api";

const INPUTS = {
  has_time: true,
  knobs: [
    { kind: "entity", entity_id: "binary_sensor.motion", control: "select", options: ["on", "off"], live_state: "off", attributes: [] },
    { kind: "entity", entity_id: "sensor.count", control: "number", live_state: "2.0", attributes: [] },
    { kind: "entity", entity_id: "calendar.work", control: "select", options: ["off"], live_state: "off", attributes: [{ name: "description", control: "text", live_value: "today" }] },
    { kind: "verdict", matcher: "script", key: "k1", label: "script.holiday", entity_id: "script.holiday", live_value: false },
  ],
};

const RESULT = {
  event_id: null, timestamp: "2026-12-21T17:30:00+00:00",
  cause: { kind: "simulated", entity_id: null, old: null, new: null, detail: "x" },
  scope_kind: "area", scope_id: "kitchen", scope_name: "Kitchen",
  group: "g1", group_name: "Lights", switch_state: "on",
  outcome: "acted", winner_name: "Evening", actions: [],
  explanation: { winner_index: 0, rules: [{ index: 0, name: "Evening", matched: true, evaluated: true, predicates: [] }] },
};

async function mount(): Promise<any> {
  vi.mocked(api.simulateInputs).mockResolvedValue(INPUTS as any);
  vi.mocked(api.simulate).mockResolvedValue(RESULT as any);
  const el: any = document.createElement("ambience-simulator-modal");
  el.hass = { callWS: vi.fn(), states: { "binary_sensor.motion": { attributes: { friendly_name: "Hall motion" } } } };
  el.scope = { scope_kind: "area", scope_id: "kitchen" };
  el.group = "g1"; el.groupName = "Lights"; el.open = true;
  document.body.appendChild(el);
  await el.updateComplete; await new Promise((r) => setTimeout(r, 0)); await el.updateComplete;
  return el;
}

describe("ambience-simulator-modal", () => {
  let el: any;
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => el?.remove());

  test("renders a friendly-named row per knob with the right control", async () => {
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("Hall motion");
    expect(el.shadowRoot.textContent).toContain("binary_sensor.motion");
    expect(el.shadowRoot.querySelector("select[data-entity='binary_sensor.motion']")).toBeTruthy();
    expect(el.shadowRoot.querySelector("input[data-entity='sensor.count']")).toBeTruthy();
    expect(el.shadowRoot.querySelector('input[type="date"]')).toBeTruthy();
  });

  test("verdict knob renders a true/false select", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector("select[data-verdict='script:k1']")).toBeTruthy();
  });

  test("Simulate sends overrides + verdicts; reset restores live", async () => {
    el = await mount();
    const motion = el.shadowRoot.querySelector("select[data-entity='binary_sensor.motion']");
    motion.value = "on"; motion.dispatchEvent(new Event("change"));
    await el.updateComplete;
    el.shadowRoot.querySelector(".runbtn").click();
    await new Promise((r) => setTimeout(r, 0));
    const args = vi.mocked(api.simulate).mock.calls[0];
    expect(args[4]["binary_sensor.motion"].state).toBe("on");
    expect(args[5]).toEqual({ script: { k1: false } });
    const reset = el.shadowRoot.querySelector("[data-reset='binary_sensor.motion']");
    reset.click(); await el.updateComplete;
    expect(el.shadowRoot.querySelector("select[data-entity='binary_sensor.motion']").value).toBe("off");
  });

  test("text attribute renders a text input and sends a string override", async () => {
    el = await mount();
    const input = el.shadowRoot.querySelector("input[data-attr='calendar.work:description']");
    expect(input).toBeTruthy();
    expect(input.type).toBe("text");
    input.value = "xxx"; input.dispatchEvent(new Event("input"));
    await el.updateComplete;
    el.shadowRoot.querySelector(".runbtn").click();
    await new Promise((r) => setTimeout(r, 0));
    const args = vi.mocked(api.simulate).mock.calls[0];
    expect(args[4]["calendar.work"].attributes.description).toBe("xxx");
  });

  test("result renders via renderEvaluation", async () => {
    el = await mount();
    el.shadowRoot.querySelector(".runbtn").click();
    await new Promise((r) => setTimeout(r, 0)); await el.updateComplete;
    expect(el.shadowRoot.querySelector(".eval")).toBeTruthy();
  });
});
