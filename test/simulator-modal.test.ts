import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("../frontend/src/api", () => ({
  simulateInputs: vi.fn(),
  simulate: vi.fn(),
}));

import "../frontend/src/views/simulator-modal";
import * as api from "../frontend/src/api";

const INPUTS = {
  knobs: [
    {
      kind: "entity",
      entity_id: "binary_sensor.motion",
      live_state: "off",
      states: ["on", "off"],
      attributes: [],
    },
  ],
  has_time: true,
  opaque: false,
};

const RESULT = {
  event_id: null,
  timestamp: "2026-12-21T17:30:00+00:00",
  cause: { kind: "simulated", entity_id: null, old: null, new: null, detail: "2026-12-21T17:30:00+00:00" },
  scope_kind: "area",
  scope_id: "kitchen",
  scope_name: "Kitchen",
  group: "g1",
  group_name: "Evening",
  switch_state: "on",
  outcome: "acted",
  winner_name: "Evening Bright",
  actions: [],
  explanation: { winner_index: 0, rules: [{ index: 0, name: "Evening Bright", matched: true, evaluated: true, predicates: [] }] },
};

async function mount(): Promise<any> {
  vi.mocked(api.simulateInputs).mockResolvedValue(INPUTS as any);
  vi.mocked(api.simulate).mockResolvedValue(RESULT as any);
  const el: any = document.createElement("ambience-simulator-modal");
  el.hass = { callWS: vi.fn() };
  el.scope = { scope_kind: "area", scope_id: "kitchen" };
  el.group = "g1";
  el.groupName = "Evening";
  el.open = true;
  document.body.appendChild(el);
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  return el;
}

describe("ambience-simulator-modal", () => {
  let el: any;
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => el?.remove());

  test("loads and renders a knob for each group dependency", async () => {
    el = await mount();
    expect(vi.mocked(api.simulateInputs)).toHaveBeenCalledTimes(1);
    expect(el.shadowRoot.textContent).toContain("binary_sensor.motion");
    expect(el.shadowRoot.querySelector('input[type="date"]')).toBeTruthy();
    expect(el.shadowRoot.querySelector('input[type="time"]')).toBeTruthy();
  });

  test("Simulate calls the api and renders the result via renderEvaluation", async () => {
    el = await mount();
    el.shadowRoot.querySelector(".runbtn").click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(vi.mocked(api.simulate)).toHaveBeenCalledTimes(1);
    expect(el.shadowRoot.querySelector(".eval")).toBeTruthy();
    expect(el.shadowRoot.textContent).toContain("Evening Bright");
  });

  test("overrides include the edited knob and the chosen time", async () => {
    el = await mount();
    const select = el.shadowRoot.querySelector("select[data-entity='binary_sensor.motion']");
    select.value = "on";
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;
    el.shadowRoot.querySelector(".runbtn").click();
    await new Promise((r) => setTimeout(r, 0));
    const [, , , nowArg, overridesArg] = vi.mocked(api.simulate).mock.calls[0];
    expect(typeof nowArg).toBe("string");
    expect(overridesArg["binary_sensor.motion"].state).toBe("on");
  });
});
