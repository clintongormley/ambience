import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("../frontend/src/api", () => ({
  simulateInputs: vi.fn(),
  simulate: vi.fn(),
}));

import "../frontend/src/views/simulator-modal";
import * as api from "../frontend/src/api";

const INPUTS = {
  has_time: true,
  knobs: [
    {
      kind: "entity",
      entity_id: "binary_sensor.motion",
      control: "select",
      options: ["on", "off"],
      live_state: "off",
      attributes: [],
    },
    {
      kind: "entity",
      entity_id: "sensor.count",
      control: "number",
      live_state: "2.0",
      attributes: [],
    },
    {
      kind: "entity",
      entity_id: "calendar.work",
      control: "select",
      options: ["off"],
      live_state: "off",
      attributes: [{ name: "description", control: "text", live_value: "today" }],
    },
    {
      kind: "entity",
      entity_id: "event.boot",
      control: "text",
      live_state: null,
      attributes: [{ name: "event_type", control: "text", live_value: null }],
    },
    {
      kind: "verdict",
      condition: "script",
      key: "k1",
      label: "script.holiday",
      entity_id: "script.holiday",
      live_value: false,
    },
  ],
};

const RESULT = {
  event_id: null,
  timestamp: "2026-12-21T17:30:00+00:00",
  cause: { kind: "simulated", entity_id: null, old: null, new: null, detail: "x" },
  scope_kind: "area",
  scope_id: "kitchen",
  scope_name: "Kitchen",
  category: "g1",
  category_name: "Lights",
  switch_state: "on",
  outcome: "acted",
  winner_name: "Evening",
  actions: [],
  explanation: {
    winner_index: 0,
    scenes: [{ index: 0, name: "Evening", matched: true, evaluated: true, predicates: [] }],
  },
};

async function mount(): Promise<any> {
  vi.mocked(api.simulateInputs).mockResolvedValue(INPUTS as any);
  vi.mocked(api.simulate).mockResolvedValue(RESULT as any);
  const el: any = document.createElement("ambience-simulator-modal");
  el.hass = {
    callWS: vi.fn(),
    states: { "binary_sensor.motion": { attributes: { friendly_name: "Hall motion" } } },
  };
  el.scope = { scope_kind: "area", scope_id: "kitchen" };
  el.category = "g1";
  el.categoryName = "Lights";
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

  test("renders a friendly-named row per knob with the right control", async () => {
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("Hall motion");
    expect(el.shadowRoot.textContent).toContain("binary_sensor.motion");
    expect(el.shadowRoot.querySelector("select[data-entity='binary_sensor.motion']")).toBeTruthy();
    expect(el.shadowRoot.querySelector("input[data-entity='sensor.count']")).toBeTruthy();
    expect(el.shadowRoot.querySelector('input[type="date"]')).toBeTruthy();
  });

  test("restore button in the When section resets date+time to now", async () => {
    el = await mount();
    const dateInput = el.shadowRoot.querySelector('input[type="date"]');
    const timeInput = el.shadowRoot.querySelector('input[type="time"]');
    dateInput.value = "2000-01-01";
    dateInput.dispatchEvent(new Event("change"));
    timeInput.value = "03:04";
    timeInput.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(el._date).toBe("2000-01-01");
    expect(el._time).toBe("03:04");

    const restore = el.shadowRoot.querySelector(".when .reset");
    expect(restore).toBeTruthy();
    // Freeze the clock only across the reset so the expected value is exact and
    // the test never depends on the real wall-clock. _resetWhen reads new Date()
    // synchronously on click, so the frozen time is what lands in the fields.
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 2, 3, 4, 0)); // 2026-01-02 03:04 local
    restore.click();
    vi.useRealTimers();
    await el.updateComplete;
    expect(el._date).toBe("2026-01-02");
    expect(el._time).toBe("03:04");
  });

  test("verdict knob renders a true/false select", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector("select[data-verdict='script:k1']")).toBeTruthy();
  });

  test("renders an h:m:s For control per entity row", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector("input[data-for='binary_sensor.motion:h']")).toBeTruthy();
    expect(el.shadowRoot.querySelector("input[data-for='binary_sensor.motion:m']")).toBeTruthy();
    expect(el.shadowRoot.querySelector("input[data-for='binary_sensor.motion:s']")).toBeTruthy();
  });

  test("each For input has an accessible per-part label", async () => {
    el = await mount();
    const h = el.shadowRoot.querySelector("input[data-for='binary_sensor.motion:h']");
    const m = el.shadowRoot.querySelector("input[data-for='binary_sensor.motion:m']");
    const s = el.shadowRoot.querySelector("input[data-for='binary_sensor.motion:s']");
    expect(h.getAttribute("aria-label")).toContain("hours");
    expect(m.getAttribute("aria-label")).toContain("minutes");
    expect(s.getAttribute("aria-label")).toContain("seconds");
  });

  test("Simulate sends the per-entity For duration", async () => {
    el = await mount();
    const m = el.shadowRoot.querySelector("input[data-for='binary_sensor.motion:m']");
    m.value = "5";
    m.dispatchEvent(new Event("change"));
    await el.updateComplete;
    el.shadowRoot.querySelector(".runbtn").click();
    await new Promise((r) => setTimeout(r, 0));
    const overrides = vi.mocked(api.simulate).mock.calls[0][4];
    expect(overrides["binary_sensor.motion"].for).toEqual({ h: 0, m: 5, s: 0 });
  });

  test("a zero For duration is omitted from the override", async () => {
    el = await mount();
    el.shadowRoot.querySelector(".runbtn").click();
    await new Promise((r) => setTimeout(r, 0));
    const overrides = vi.mocked(api.simulate).mock.calls[0][4];
    expect(overrides["binary_sensor.motion"].for).toBeUndefined();
  });

  test("reset restores the For duration to zero", async () => {
    el = await mount();
    const m = el.shadowRoot.querySelector("input[data-for='binary_sensor.motion:m']");
    m.value = "5";
    m.dispatchEvent(new Event("change"));
    await el.updateComplete;
    el.shadowRoot.querySelector("[data-reset='binary_sensor.motion']").click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("input[data-for='binary_sensor.motion:m']").value).toBe("0");
  });

  test("Simulate sends overrides + verdicts; reset restores live", async () => {
    el = await mount();
    const motion = el.shadowRoot.querySelector("select[data-entity='binary_sensor.motion']");
    motion.value = "on";
    motion.dispatchEvent(new Event("change"));
    await el.updateComplete;
    el.shadowRoot.querySelector(".runbtn").click();
    await new Promise((r) => setTimeout(r, 0));
    const args = vi.mocked(api.simulate).mock.calls[0];
    expect(args[4]["binary_sensor.motion"].state).toBe("on");
    expect(args[5]).toEqual({ script: { k1: false } });
    const reset = el.shadowRoot.querySelector("[data-reset='binary_sensor.motion']");
    reset.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("select[data-entity='binary_sensor.motion']").value).toBe(
      "off",
    );
  });

  test("text attribute renders a text input and sends a string override", async () => {
    el = await mount();
    const input = el.shadowRoot.querySelector("input[data-attr='calendar.work:description']");
    expect(input).toBeTruthy();
    expect(input.type).toBe("text");
    input.value = "xxx";
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
    el.shadowRoot.querySelector(".runbtn").click();
    await new Promise((r) => setTimeout(r, 0));
    const args = vi.mocked(api.simulate).mock.calls[0];
    expect(args[4]["calendar.work"].attributes.description).toBe("xxx");
  });

  test("attribute-only override on a stateless entity is still sent (no state)", async () => {
    el = await mount();
    const input = el.shadowRoot.querySelector("input[data-attr='event.boot:event_type']");
    input.value = "foo";
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
    el.shadowRoot.querySelector(".runbtn").click();
    await new Promise((r) => setTimeout(r, 0));
    const override = vi.mocked(api.simulate).mock.calls[0][4]["event.boot"];
    expect(override.attributes.event_type).toBe("foo");
    expect(override.state).toBeUndefined(); // stateless → no state key
  });

  test("result renders via renderEvaluation", async () => {
    el = await mount();
    el.shadowRoot.querySelector(".runbtn").click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".eval")).toBeTruthy();
  });

  // --- render guard: open=false returns nothing ----------------------------

  test("renders nothing when open is false", async () => {
    vi.mocked(api.simulateInputs).mockResolvedValue(INPUTS as any);
    el = document.createElement("ambience-simulator-modal") as any;
    el.hass = { callWS: vi.fn(), states: {} };
    el.scope = { scope_kind: "area", scope_id: "kitchen" };
    el.category = "g1";
    el.open = false;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".modal")).toBeNull();
    // simulateInputs must NOT have been called (open=false → _load skipped)
    expect(api.simulateInputs).not.toHaveBeenCalled();
  });

  // --- categoryName fallback -----------------------------------------------

  test("header shows category id when categoryName is null", async () => {
    vi.mocked(api.simulateInputs).mockResolvedValue({ has_time: false, knobs: [] } as any);
    el = document.createElement("ambience-simulator-modal") as any;
    el.hass = { callWS: vi.fn(), states: {} };
    el.scope = { scope_kind: "area", scope_id: "k" };
    el.category = "raw_cat_id";
    el.categoryName = null;
    el.open = true;
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("h3").textContent).toContain("raw_cat_id");
  });

  // --- loading error path --------------------------------------------------

  test("shows an error paragraph when simulateInputs rejects", async () => {
    vi.mocked(api.simulateInputs).mockRejectedValue(new Error("network fail"));
    el = document.createElement("ambience-simulator-modal") as any;
    el.hass = { callWS: vi.fn(), states: {} };
    el.scope = { scope_kind: "area", scope_id: "k" };
    el.category = "g1";
    el.open = true;
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const err = el.shadowRoot.querySelector(".error");
    expect(err).toBeTruthy();
    expect(err.textContent).toContain("network fail");
  });

  // --- _run error path -----------------------------------------------------

  test("shows an error when simulate() rejects", async () => {
    vi.mocked(api.simulateInputs).mockResolvedValue({ has_time: false, knobs: [] } as any);
    vi.mocked(api.simulate).mockRejectedValue(new Error("sim boom"));
    el = document.createElement("ambience-simulator-modal") as any;
    el.hass = { callWS: vi.fn(), states: {} };
    el.scope = { scope_kind: "area", scope_id: "k" };
    el.category = "g1";
    el.open = true;
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    el.shadowRoot.querySelector(".runbtn").click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const err = el.shadowRoot.querySelector(".error");
    expect(err).toBeTruthy();
    expect(err.textContent).toContain("sim boom");
  });

  // --- _onClose fires a close event ----------------------------------------

  test("close button dispatches a 'close' custom event", async () => {
    vi.mocked(api.simulateInputs).mockResolvedValue({ has_time: false, knobs: [] } as any);
    el = document.createElement("ambience-simulator-modal") as any;
    el.hass = { callWS: vi.fn(), states: {} };
    el.scope = { scope_kind: "area", scope_id: "k" };
    el.category = "g1";
    el.open = true;
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const fired: Event[] = [];
    el.addEventListener("close", (e: Event) => fired.push(e));
    el.shadowRoot.querySelector(".close").click();
    expect(fired.length).toBe(1);
  });

  // --- no time section when has_time=false ---------------------------------

  test("does not render the When section when has_time is false", async () => {
    vi.mocked(api.simulateInputs).mockResolvedValue({ has_time: false, knobs: [] } as any);
    el = document.createElement("ambience-simulator-modal") as any;
    el.hass = { callWS: vi.fn(), states: {} };
    el.scope = { scope_kind: "area", scope_id: "k" };
    el.category = "g1";
    el.open = true;
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('input[type="date"]')).toBeNull();
    expect(el.shadowRoot.querySelector('input[type="time"]')).toBeNull();
  });

  // --- no knobs section when knobs=[] --------------------------------------

  test("does not render the Inputs section when there are no knobs", async () => {
    vi.mocked(api.simulateInputs).mockResolvedValue({ has_time: false, knobs: [] } as any);
    el = document.createElement("ambience-simulator-modal") as any;
    el.hass = { callWS: vi.fn(), states: {} };
    el.scope = { scope_kind: "area", scope_id: "k" };
    el.category = "g1";
    el.open = true;
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.textContent).not.toContain("Inputs this category depends on");
  });

  // --- number attribute sends coerced number, not string -------------------

  test("number attribute input sends a numeric value in the override", async () => {
    const inputs = {
      has_time: false,
      knobs: [
        {
          kind: "entity",
          entity_id: "sensor.temp",
          control: "text",
          live_state: "20",
          attributes: [{ name: "humidity", control: "number", live_value: 50 }],
        },
      ],
    };
    vi.mocked(api.simulateInputs).mockResolvedValue(inputs as any);
    el = document.createElement("ambience-simulator-modal") as any;
    el.hass = { callWS: vi.fn(), states: {} };
    el.scope = { scope_kind: "area", scope_id: "k" };
    el.category = "g1";
    el.open = true;
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const input = el.shadowRoot.querySelector(
      "input[data-attr='sensor.temp:humidity']",
    ) as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.type).toBe("number");
    input.value = "75";
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
    el.shadowRoot.querySelector(".runbtn").click();
    await new Promise((r) => setTimeout(r, 0));
    const args = vi.mocked(api.simulate).mock.calls[0];
    expect(args[4]["sensor.temp"].attributes.humidity).toBe(75);
    expect(typeof args[4]["sensor.temp"].attributes.humidity).toBe("number");
  });

  // --- number entity control renders a number input -----------------------

  test("number control entity renders a number input (not select)", async () => {
    el = await mount();
    const input = el.shadowRoot.querySelector(
      "input[data-entity='sensor.count']",
    ) as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.type).toBe("number");
    expect(input.classList.contains("num")).toBe(true);
  });

  // --- verdict knob without entity_id (label-only row) --------------------

  test("verdict knob without entity_id renders label text and generic icon", async () => {
    const inputs = {
      has_time: false,
      knobs: [
        {
          kind: "verdict",
          condition: "template",
          key: "mykey",
          label: "custom template",
          entity_id: null,
          live_value: true,
        },
      ],
    };
    vi.mocked(api.simulateInputs).mockResolvedValue(inputs as any);
    el = document.createElement("ambience-simulator-modal") as any;
    el.hass = { callWS: vi.fn(), states: {} };
    el.scope = { scope_kind: "area", scope_id: "k" };
    el.category = "g1";
    el.open = true;
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const text = el.shadowRoot.textContent;
    expect(text).toContain("custom template");
    // No entity_id subtitle should be rendered for this knob
    expect(el.shadowRoot.querySelector(".row-detail")).toBeNull();
  });

  // --- _setVerdict and _resetVerdict ----------------------------------------

  test("changing a verdict select updates the sent verdict", async () => {
    el = await mount();
    const sel = el.shadowRoot.querySelector(
      "select[data-verdict='script:k1']",
    ) as HTMLSelectElement;
    // Default is false; change to true
    sel.value = "true";
    sel.dispatchEvent(new Event("change"));
    await el.updateComplete;
    el.shadowRoot.querySelector(".runbtn").click();
    await new Promise((r) => setTimeout(r, 0));
    const args = vi.mocked(api.simulate).mock.calls[0];
    expect(args[5]).toEqual({ script: { k1: true } });
  });

  test("resetting a verdict restores the live value", async () => {
    el = await mount();
    const sel = el.shadowRoot.querySelector(
      "select[data-verdict='script:k1']",
    ) as HTMLSelectElement;
    // Change away from live (false → true)
    sel.value = "true";
    sel.dispatchEvent(new Event("change"));
    await el.updateComplete;
    // Now reset
    // The last button in a verdict row is the reset
    const buttons = Array.from(
      el.shadowRoot.querySelectorAll(".row button.reset"),
    ) as HTMLButtonElement[];
    // Find the reset for the verdict row (script:k1)
    const verdictReset = buttons.find((b) =>
      b.closest(".row")?.querySelector("select[data-verdict='script:k1']"),
    );
    expect(verdictReset).toBeTruthy();
    verdictReset!.click();
    await el.updateComplete;
    el.shadowRoot.querySelector(".runbtn").click();
    await new Promise((r) => setTimeout(r, 0));
    const args = vi.mocked(api.simulate).mock.calls[0];
    expect(args[5]).toEqual({ script: { k1: false } });
  });

  // --- entity row with attributes: last-attr class -------------------------

  test("last attribute row gets the 'last-attr' CSS class", async () => {
    el = await mount();
    // calendar.work has exactly one attribute (description), it should be last-attr
    const attrRows = Array.from(el.shadowRoot.querySelectorAll(".row.attr")) as HTMLElement[];
    const lastAttrRows = attrRows.filter((r) => r.classList.contains("last-attr"));
    expect(lastAttrRows.length).toBeGreaterThan(0);
  });

  // --- entity row without attributes: no has-attrs class ------------------

  test("entity row without attributes does not get 'has-attrs' class", async () => {
    el = await mount();
    // binary_sensor.motion has no attributes
    const rows = Array.from(el.shadowRoot.querySelectorAll(".row")) as HTMLElement[];
    // The motion row should not have has-attrs
    const motionRow = rows.find((r) =>
      r.querySelector("select[data-entity='binary_sensor.motion']"),
    );
    expect(motionRow).toBeTruthy();
    expect(motionRow!.classList.contains("has-attrs")).toBe(false);
  });

  // --- _buildVerdicts ?? fallback (verdicts dict not containing the key) ---

  test("_buildVerdicts falls back to live_value when no manual verdict was set", async () => {
    const inputs = {
      has_time: false,
      knobs: [
        {
          kind: "verdict",
          condition: "script",
          key: "fresh",
          label: "fresh key",
          entity_id: null,
          live_value: true,
        },
      ],
    };
    vi.mocked(api.simulateInputs).mockResolvedValue(inputs as any);
    vi.mocked(api.simulate).mockResolvedValue(RESULT as any);
    el = document.createElement("ambience-simulator-modal") as any;
    el.hass = { callWS: vi.fn(), states: {} };
    el.scope = { scope_kind: "area", scope_id: "k" };
    el.category = "g1";
    el.open = true;
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    // Manually clear verdicts so the ?? path fires
    el._verdicts = {};
    el.shadowRoot.querySelector(".runbtn").click();
    await new Promise((r) => setTimeout(r, 0));
    const args = vi.mocked(api.simulate).mock.calls[0];
    // Should fall back to live_value=true
    expect(args[5]).toEqual({ script: { fresh: true } });
  });

  // --- entity with multiple attributes: middle attr lacks last-attr class --

  test("entity with multiple attributes: only the last row has last-attr class", async () => {
    const inputs = {
      has_time: false,
      knobs: [
        {
          kind: "entity",
          entity_id: "weather.home",
          control: "text",
          live_state: "sunny",
          attributes: [
            { name: "temperature", control: "number", live_value: 20 },
            { name: "humidity", control: "number", live_value: 60 },
          ],
        },
      ],
    };
    vi.mocked(api.simulateInputs).mockResolvedValue(inputs as any);
    vi.mocked(api.simulate).mockResolvedValue(RESULT as any);
    el = document.createElement("ambience-simulator-modal") as any;
    el.hass = { callWS: vi.fn(), states: {} };
    el.scope = { scope_kind: "area", scope_id: "k" };
    el.category = "g1";
    el.open = true;
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const attrRows = Array.from(el.shadowRoot.querySelectorAll(".row.attr")) as HTMLElement[];
    expect(attrRows.length).toBe(2);
    expect(attrRows[0].classList.contains("last-attr")).toBe(false);
    expect(attrRows[1].classList.contains("last-attr")).toBe(true);
  });

  // --- select control with no options field (uses ?? [value]) -------------

  test("select control with no options falls back to rendering just the current value", async () => {
    const inputs = {
      has_time: false,
      knobs: [
        {
          kind: "entity",
          entity_id: "input_select.test",
          control: "select",
          // no options field — should fall back to [value]
          live_state: "option_a",
          attributes: [],
        },
      ],
    };
    vi.mocked(api.simulateInputs).mockResolvedValue(inputs as any);
    el = document.createElement("ambience-simulator-modal") as any;
    el.hass = { callWS: vi.fn(), states: {} };
    el.scope = { scope_kind: "area", scope_id: "k" };
    el.category = "g1";
    el.open = true;
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const sel = el.shadowRoot.querySelector(
      "select[data-entity='input_select.test']",
    ) as HTMLSelectElement;
    expect(sel).toBeTruthy();
    const options = Array.from(sel.querySelectorAll("option")) as HTMLOptionElement[];
    expect(options.length).toBe(1);
    expect(options[0].value).toBe("option_a");
  });

  // --- error fallback: || String(e) when thrown value has no .message ------

  test("shows stringified error when simulateInputs throws a non-Error", async () => {
    // Throw a plain string (no .message property) to hit the String(e) branch
    vi.mocked(api.simulateInputs).mockRejectedValue("raw string error");
    el = document.createElement("ambience-simulator-modal") as any;
    el.hass = { callWS: vi.fn(), states: {} };
    el.scope = { scope_kind: "area", scope_id: "k" };
    el.category = "g1";
    el.open = true;
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const err = el.shadowRoot.querySelector(".error");
    expect(err).toBeTruthy();
    expect(err.textContent).toContain("raw string error");
  });

  test("shows stringified error when simulate() throws a non-Error", async () => {
    vi.mocked(api.simulateInputs).mockResolvedValue({ has_time: false, knobs: [] } as any);
    vi.mocked(api.simulate).mockRejectedValue("sim string error");
    el = document.createElement("ambience-simulator-modal") as any;
    el.hass = { callWS: vi.fn(), states: {} };
    el.scope = { scope_kind: "area", scope_id: "k" };
    el.category = "g1";
    el.open = true;
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    el.shadowRoot.querySelector(".runbtn").click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const err = el.shadowRoot.querySelector(".error");
    expect(err).toBeTruthy();
    expect(err.textContent).toContain("sim string error");
  });

  // --- isConnected guard: load aborts when detached before response --------

  test("_load silently aborts when the element is removed before simulateInputs resolves", async () => {
    let resolveInputs!: (v: any) => void;
    vi.mocked(api.simulateInputs).mockReturnValue(
      new Promise((r) => {
        resolveInputs = r;
      }),
    );
    el = document.createElement("ambience-simulator-modal") as any;
    el.hass = { callWS: vi.fn(), states: {} };
    el.scope = { scope_kind: "area", scope_id: "k" };
    el.category = "g1";
    el.open = true;
    document.body.appendChild(el);
    await el.updateComplete;
    // Remove before the promise resolves
    el.remove();
    resolveInputs({ has_time: false, knobs: [] });
    await new Promise((r) => setTimeout(r, 0));
    // No error, and the element should still have empty knobs (_load bailed out)
    expect(el._knobs).toEqual([]);
  });
});
