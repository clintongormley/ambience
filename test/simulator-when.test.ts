import { afterEach, describe, expect, test, vi } from "vitest";
import "../frontend/src/views/simulator-modal";
import type { SunAnchors } from "../frontend/src/types";

const ANCHORS: SunAnchors = {
  sunrise: "2026-07-04T03:47:00+00:00",
  sunset: "2026-07-04T20:21:00+00:00",
  noon: "2026-07-04T12:04:00+00:00",
  midnight: "2026-07-04T00:04:00+00:00",
  dawn: "2026-07-04T03:02:00+00:00",
  dusk: "2026-07-04T21:06:00+00:00",
};

const tick = () => new Promise((r) => setTimeout(r, 0));

function makeHass(anchors: SunAnchors | Record<string, string | null> = ANCHORS) {
  const calls: any[] = [];
  const callWS = vi.fn(async (msg: any) => {
    calls.push(msg);
    if (msg.type === "ambience/simulate/inputs") return { knobs: [], has_time: true };
    if (msg.type === "ambience/simulate/sun_anchors") return { anchors };
    if (msg.type === "ambience/simulate") return { result: { category: "g1", outcome: "acted" } };
    return {};
  });
  return { hass: { callWS } as any, calls };
}

async function mount(hass: any): Promise<any> {
  const el: any = document.createElement("ambience-simulator-modal");
  el.hass = hass;
  el.scope = { scope_kind: "area", scope_id: "kitchen" };
  el.category = "g1";
  el.open = true;
  document.body.appendChild(el);
  await el.updateComplete;
  await tick(); // flush async _fetch (simulate/inputs)
  await el.updateComplete;
  return el;
}

async function switchToSun(el: any): Promise<void> {
  el._date = "2026-07-04";
  const modeSel = el.shadowRoot.querySelector("select.whenmode") as HTMLSelectElement;
  modeSel.value = "sun";
  modeSel.dispatchEvent(new Event("change"));
  await el.updateComplete;
  await tick(); // flush async _fetchAnchors
  await el.updateComplete;
}

describe("simulator When control — Sun mode", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("switching to Sun mode fetches that date's anchors", async () => {
    const { hass, calls } = makeHass();
    el = await mount(hass);
    await switchToSun(el);
    expect(
      calls.some((c) => c.type === "ambience/simulate/sun_anchors" && c.date === "2026-07-04"),
    ).toBe(true);
    expect(el.shadowRoot.querySelector("select.anchor")).toBeTruthy();
  });

  test("_resolvedInstant applies the offset to the anchor instant", async () => {
    const { hass } = makeHass();
    el = await mount(hass);
    await switchToSun(el);
    el._anchor = "sunset";
    el._offset = -30;
    await el.updateComplete;
    const expected = Date.parse("2026-07-04T20:21:00+00:00") - 30 * 60000;
    expect(el._resolvedInstant()).toBe(expected);
  });

  test("readout shows the resolved-time arrow", async () => {
    const { hass } = makeHass();
    el = await mount(hass);
    await switchToSun(el);
    el._anchor = "sunset";
    el._offset = -30;
    await el.updateComplete;
    expect(el.shadowRoot.textContent).toContain("→");
  });

  test("an undefined anchor shows the note and _resolvedInstant is null", async () => {
    const polar = { ...ANCHORS, sunset: null };
    const { hass } = makeHass(polar);
    el = await mount(hass);
    await switchToSun(el);
    el._anchor = "sunset";
    await el.updateComplete;
    expect(el._resolvedInstant()).toBeNull();
    expect(el.shadowRoot.textContent?.toLowerCase()).toContain("no");
  });

  test("_resolvedInstant returns null when cached anchors are for a stale date", async () => {
    const { hass } = makeHass();
    el = await mount(hass);
    await switchToSun(el); // _anchorsDate === _date === "2026-07-04", anchors loaded
    el._date = "2026-12-21"; // simulate a date change whose refetch hasn't landed
    el._anchor = "sunset";
    await el.updateComplete;
    expect(el._resolvedInstant()).toBeNull();
  });

  test("readout includes the date when the resolved instant lands on another day", async () => {
    const { hass } = makeHass();
    el = await mount(hass);
    await switchToSun(el);
    el._anchor = "sunset";
    el._offset = 2880; // +2 days — resolved date differs from picked date in any TZ
    await el.updateComplete;
    expect(el.shadowRoot.textContent).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  test("changing the date refetches anchors", async () => {
    const { hass, calls } = makeHass();
    el = await mount(hass);
    await switchToSun(el);
    const dateInput = el.shadowRoot.querySelector('input[type="date"]') as HTMLInputElement;
    dateInput.value = "2026-12-21";
    dateInput.dispatchEvent(new Event("change"));
    await el.updateComplete;
    await tick();
    expect(
      calls.some((c) => c.type === "ambience/simulate/sun_anchors" && c.date === "2026-12-21"),
    ).toBe(true);
  });

  test("Sun-mode Simulate sends the resolved instant as now", async () => {
    const { hass, calls } = makeHass();
    // Reject the simulate call so _result never renders (isolates the payload).
    (hass.callWS as any).mockImplementation(async (msg: any) => {
      calls.push(msg);
      if (msg.type === "ambience/simulate/inputs") return { knobs: [], has_time: true };
      if (msg.type === "ambience/simulate/sun_anchors") return { anchors: ANCHORS };
      if (msg.type === "ambience/simulate") throw new Error("stop");
      return {};
    });
    el = await mount(hass);
    await switchToSun(el);
    el._anchor = "sunset";
    el._offset = -30;
    await el.updateComplete;
    (el.shadowRoot.querySelector(".runbtn") as HTMLButtonElement).click();
    await tick();
    const sim = calls.find((c) => c.type === "ambience/simulate");
    const expected = new Date(Date.parse("2026-07-04T20:21:00+00:00") - 30 * 60000).toISOString();
    expect(sim.now).toBe(expected);
  });

  test("Sun-mode Simulate on an undefined anchor errors and sends nothing", async () => {
    const { hass, calls } = makeHass({ ...ANCHORS, sunset: null });
    el = await mount(hass);
    await switchToSun(el);
    el._anchor = "sunset";
    await el.updateComplete;
    (el.shadowRoot.querySelector(".runbtn") as HTMLButtonElement).click();
    await tick();
    expect(calls.some((c) => c.type === "ambience/simulate")).toBe(false);
    // Sun mode reports a sun-specific message, not the generic date/time one.
    expect(el._error).toContain("sun time");
  });

  test("Time mode still sends a wall-clock now", async () => {
    const { hass, calls } = makeHass();
    (hass.callWS as any).mockImplementation(async (msg: any) => {
      calls.push(msg);
      if (msg.type === "ambience/simulate/inputs") return { knobs: [], has_time: true };
      if (msg.type === "ambience/simulate") throw new Error("stop");
      return {};
    });
    el = await mount(hass);
    el._date = "2026-07-04";
    el._time = "17:30";
    await el.updateComplete;
    (el.shadowRoot.querySelector(".runbtn") as HTMLButtonElement).click();
    await tick();
    const sim = calls.find((c) => c.type === "ambience/simulate");
    expect(sim.now).toBe(new Date("2026-07-04T17:30").toISOString());
  });

  test("an absurd offset renders no NaN readout and Simulate refuses it", async () => {
    const { hass, calls } = makeHass();
    el = await mount(hass);
    await switchToSun(el);
    el._anchor = "sunset";
    el._offset = 999999999999999; // anchor + offset overflows Date's range
    await el.updateComplete;
    expect(el.shadowRoot.textContent).not.toContain("NaN");
    (el.shadowRoot.querySelector(".runbtn") as HTMLButtonElement).click();
    await tick();
    expect(calls.some((c) => c.type === "ambience/simulate")).toBe(false);
    expect(el._error).toBeTruthy();
  });

  test("no stale polar note while a date-change refetch is in flight", async () => {
    const { hass } = makeHass({ ...ANCHORS, sunset: null });
    el = await mount(hass);
    await switchToSun(el); // _anchorsDate === _date, with sunset null (polar)
    el._anchor = "sunset";
    el._date = "2026-12-21"; // date changed; _anchorsDate now stale, refetch pending
    await el.updateComplete;
    expect(el.shadowRoot.textContent).not.toContain("on this date");
  });
});
