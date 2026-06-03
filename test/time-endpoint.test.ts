import { afterEach, describe, expect, test } from "vitest";
import "../frontend/src/views/time-endpoint";
import type { TimeEndpoint } from "../frontend/src/types";

async function mount(value: TimeEndpoint): Promise<any> {
  const el: any = document.createElement("ambience-time-endpoint");
  el.value = value;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function captureEmit(el: HTMLElement): () => TimeEndpoint | undefined {
  let detail: { value: TimeEndpoint } | undefined;
  el.addEventListener("value-changed", ((e: CustomEvent) => {
    detail = e.detail;
  }) as any);
  return () => detail?.value;
}

describe("ambience-time-endpoint", () => {
  let el: any;
  afterEach(() => {
    el?.remove();
  });

  test("renders time input for time kind", async () => {
    el = await mount({ kind: "time", hh: 9, mm: 30 });
    const timeInput = el.shadowRoot.querySelector('input[type="time"]') as HTMLInputElement;
    expect(timeInput).toBeTruthy();
    expect(timeInput.value).toBe("09:30");
  });

  test("emits new time on time input", async () => {
    el = await mount({ kind: "time", hh: 9, mm: 0 });
    const get = captureEmit(el);
    const timeInput = el.shadowRoot.querySelector('input[type="time"]') as HTMLInputElement;
    timeInput.value = "14:45";
    timeInput.dispatchEvent(new Event("input"));
    expect(get()).toEqual({ kind: "time", hh: 14, mm: 45 });
  });

  test("renders anchor + offset for sun kind", async () => {
    el = await mount({ kind: "sun", anchor: "sunset", offset_min: -30 });
    await el.updateComplete;
    const selects = el.shadowRoot.querySelectorAll("select");
    // 0 = kind select, 1 = anchor select
    expect((selects[1] as HTMLSelectElement).value).toBe("sunset");
    const offset = el.shadowRoot.querySelector('input[type="number"]') as HTMLInputElement;
    expect(offset.value).toBe("-30");
  });

  test("switching to sun emits default sun endpoint", async () => {
    el = await mount({ kind: "time", hh: 9, mm: 0 });
    const get = captureEmit(el);
    const kindSelect = el.shadowRoot.querySelector("select") as HTMLSelectElement;
    kindSelect.value = "sun";
    kindSelect.dispatchEvent(new Event("change"));
    expect(get()).toEqual({ kind: "sun", anchor: "sunset", offset_min: 0 });
  });

  test("switching to time emits default time endpoint", async () => {
    el = await mount({ kind: "sun", anchor: "sunset", offset_min: 0 });
    const get = captureEmit(el);
    const kindSelect = el.shadowRoot.querySelector("select") as HTMLSelectElement;
    kindSelect.value = "time";
    kindSelect.dispatchEvent(new Event("change"));
    expect(get()).toEqual({ kind: "time", hh: 12, mm: 0 });
  });

  test("offset accepts negative values", async () => {
    el = await mount({ kind: "sun", anchor: "sunrise", offset_min: 0 });
    const get = captureEmit(el);
    const offset = el.shadowRoot.querySelector('input[type="number"]') as HTMLInputElement;
    offset.value = "-45";
    offset.dispatchEvent(new Event("input"));
    expect(get()).toEqual({ kind: "sun", anchor: "sunrise", offset_min: -45 });
  });

  test("renders human-readable signed offset for multiples of 60", async () => {
    el = await mount({ kind: "sun", anchor: "noon", offset_min: 120 });
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".offset-hint").textContent.trim()).toBe("+2 hours");
  });

  test("hint shows minutes when not divisible by 60", async () => {
    el = await mount({ kind: "sun", anchor: "noon", offset_min: 45 });
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".offset-hint").textContent.trim()).toBe("+45 min");
  });

  test("hint for negative offset uses unicode minus", async () => {
    el = await mount({ kind: "sun", anchor: "sunset", offset_min: -30 });
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".offset-hint").textContent.trim()).toBe("−30 min");
  });

  test("hint for negative hour offset", async () => {
    el = await mount({ kind: "sun", anchor: "sunrise", offset_min: -60 });
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".offset-hint").textContent.trim()).toBe("−1 hour");
  });

  test("hint for zero is empty", async () => {
    el = await mount({ kind: "sun", anchor: "noon", offset_min: 0 });
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".offset-hint").textContent.trim()).toBe("");
  });

  test("offset input has placeholder describing what to enter", async () => {
    el = await mount({ kind: "sun", anchor: "sunset", offset_min: 0 });
    await el.updateComplete;
    const offset = el.shadowRoot.querySelector('input[type="number"]') as HTMLInputElement;
    expect(offset.placeholder).toBe("Offset");
  });

  test("hint pluralises 'hour' correctly", async () => {
    el = await mount({ kind: "sun", anchor: "noon", offset_min: 60 });
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".offset-hint").textContent.trim()).toBe("+1 hour");
  });

  test("changing anchor emits new sun endpoint with updated anchor", async () => {
    el = await mount({ kind: "sun", anchor: "sunset", offset_min: -30 });
    const get = captureEmit(el);
    const selects = el.shadowRoot.querySelectorAll("select");
    // selects[0] = kind, selects[1] = anchor
    const anchorSelect = selects[1] as HTMLSelectElement;
    anchorSelect.value = "sunrise";
    anchorSelect.dispatchEvent(new Event("change"));
    expect(get()).toEqual({ kind: "sun", anchor: "sunrise", offset_min: -30 });
  });

  test("anchor dropdown options are in time order starting with dawn", async () => {
    el = await mount({ kind: "sun", anchor: "noon", offset_min: 0 });
    await el.updateComplete;
    const selects = el.shadowRoot.querySelectorAll("select");
    const anchorSelect = selects[1] as HTMLSelectElement;
    const values = Array.from(anchorSelect.options).map((o) => o.value);
    expect(values).toEqual(["dawn", "sunrise", "noon", "sunset", "dusk", "midnight"]);
  });

  test("anchor option labels are capitalised", async () => {
    el = await mount({ kind: "sun", anchor: "dawn", offset_min: 0 });
    await el.updateComplete;
    const selects = el.shadowRoot.querySelectorAll("select");
    const anchorSelect = selects[1] as HTMLSelectElement;
    const labels = Array.from(anchorSelect.options).map((o) => o.textContent?.trim());
    expect(labels).toEqual(["Dawn", "Sunrise", "Noon", "Sunset", "Dusk", "Midnight"]);
  });

  // ── missing-branch coverage ──────────────────────────────────────────────

  test("switching kind to same value does not emit (early return branch)", async () => {
    el = await mount({ kind: "time", hh: 9, mm: 0 });
    const get = captureEmit(el);
    const kindSelect = el.shadowRoot.querySelector("select") as HTMLSelectElement;
    // dispatch change with the same kind that is already set
    kindSelect.value = "time";
    kindSelect.dispatchEvent(new Event("change"));
    expect(get()).toBeUndefined();
  });

  test("_onTimeChange guard: does not emit when value.kind is sun", async () => {
    // mount as sun so value.kind !== "time"
    el = await mount({ kind: "sun", anchor: "sunset", offset_min: 0 });
    const get = captureEmit(el);
    // call the private handler directly with a synthetic event pointing at a mock input
    const fakeInput = { value: "10:30" } as HTMLInputElement;
    (el as any)._onTimeChange({ target: fakeInput });
    expect(get()).toBeUndefined();
  });

  test("_onTimeChange does not emit when parsed hh or mm is NaN", async () => {
    el = await mount({ kind: "time", hh: 9, mm: 0 });
    const get = captureEmit(el);
    const timeInput = el.shadowRoot.querySelector('input[type="time"]') as HTMLInputElement;
    // An empty string produces NaN after parseInt
    timeInput.value = "";
    timeInput.dispatchEvent(new Event("input"));
    expect(get()).toBeUndefined();
  });

  test("_onAnchorChange guard: does not emit when value.kind is time", async () => {
    // mount as time so value.kind !== "sun"
    el = await mount({ kind: "time", hh: 9, mm: 0 });
    const get = captureEmit(el);
    const fakeSelect = { value: "sunrise" } as HTMLSelectElement;
    (el as any)._onAnchorChange({ target: fakeSelect });
    expect(get()).toBeUndefined();
  });

  test("_onOffsetChange guard: does not emit when value.kind is time", async () => {
    el = await mount({ kind: "time", hh: 9, mm: 0 });
    const get = captureEmit(el);
    const fakeInput = { value: "30" } as HTMLInputElement;
    (el as any)._onOffsetChange({ target: fakeInput });
    expect(get()).toBeUndefined();
  });

  test("a non-numeric offset entry (blanked by the number input) resolves to 0", async () => {
    // A type=number input rejects "abc" and reports value "" — which we treat
    // as "no offset" → 0, rather than corrupting state.
    el = await mount({ kind: "sun", anchor: "sunset", offset_min: -30 });
    const get = captureEmit(el);
    const offsetInput = el.shadowRoot.querySelector('input[type="number"]') as HTMLInputElement;
    offsetInput.value = "abc";
    offsetInput.dispatchEvent(new Event("input"));
    expect(get()).toEqual({ kind: "sun", anchor: "sunset", offset_min: 0 });
  });

  test("offset input is blank when offset is 0 so the placeholder shows", async () => {
    el = await mount({ kind: "sun", anchor: "sunset", offset_min: 0 });
    const offset = el.shadowRoot.querySelector('input[type="number"]') as HTMLInputElement;
    expect(offset.value).toBe("");
  });

  test("clearing the offset input emits offset_min 0", async () => {
    el = await mount({ kind: "sun", anchor: "sunset", offset_min: -30 });
    const get = captureEmit(el);
    const offset = el.shadowRoot.querySelector('input[type="number"]') as HTMLInputElement;
    offset.value = "";
    offset.dispatchEvent(new Event("input"));
    expect(get()).toEqual({ kind: "sun", anchor: "sunset", offset_min: 0 });
  });

  test("sun endpoint renders a clamp direction dropdown defaulting to none", async () => {
    el = await mount({ kind: "sun", anchor: "sunset", offset_min: 0 });
    const selects = el.shadowRoot.querySelectorAll("select");
    expect(selects.length).toBe(3); // kind, anchor, clamp-direction
    expect((selects[2] as HTMLSelectElement).value).toBe("");
    expect(el.shadowRoot.querySelector('input[type="time"]')).toBeFalsy();
  });

  test("choosing a clamp direction emits a clamp seeded with a clock time", async () => {
    el = await mount({ kind: "sun", anchor: "sunrise", offset_min: 0 });
    const get = captureEmit(el);
    const dir = el.shadowRoot.querySelectorAll("select")[2] as HTMLSelectElement;
    dir.value = "not_before";
    dir.dispatchEvent(new Event("change"));
    const v = get();
    expect(v.kind).toBe("sun");
    expect(v.clamp.dir).toBe("not_before");
    expect(typeof v.clamp.hh).toBe("number");
    expect(typeof v.clamp.mm).toBe("number");
  });

  test("switching clamp direction back to none drops the clamp", async () => {
    el = await mount({
      kind: "sun",
      anchor: "sunrise",
      offset_min: 0,
      clamp: { dir: "not_before", hh: 8, mm: 30 },
    });
    const get = captureEmit(el);
    const dir = el.shadowRoot.querySelectorAll("select")[2] as HTMLSelectElement;
    dir.value = "";
    dir.dispatchEvent(new Event("change"));
    expect(get()).toEqual({ kind: "sun", anchor: "sunrise", offset_min: 0 });
  });

  test("editing the clamp time emits the new hh/mm", async () => {
    el = await mount({
      kind: "sun",
      anchor: "sunrise",
      offset_min: 0,
      clamp: { dir: "not_before", hh: 8, mm: 30 },
    });
    const get = captureEmit(el);
    const timeInput = el.shadowRoot.querySelector('input[type="time"]') as HTMLInputElement;
    expect(timeInput.value).toBe("08:30");
    timeInput.value = "09:15";
    timeInput.dispatchEvent(new Event("input"));
    expect(get()).toEqual({
      kind: "sun",
      anchor: "sunrise",
      offset_min: 0,
      clamp: { dir: "not_before", hh: 9, mm: 15 },
    });
  });

  test("changing anchor preserves an existing clamp", async () => {
    el = await mount({
      kind: "sun",
      anchor: "sunrise",
      offset_min: 0,
      clamp: { dir: "not_before", hh: 8, mm: 30 },
    });
    const get = captureEmit(el);
    const anchor = el.shadowRoot.querySelectorAll("select")[1] as HTMLSelectElement;
    anchor.value = "dusk";
    anchor.dispatchEvent(new Event("change"));
    expect(get()).toEqual({
      kind: "sun",
      anchor: "dusk",
      offset_min: 0,
      clamp: { dir: "not_before", hh: 8, mm: 30 },
    });
  });

  test("offset input uses the Offset placeholder", async () => {
    el = await mount({ kind: "sun", anchor: "sunset", offset_min: 0 });
    const offset = el.shadowRoot.querySelector('input[type="number"]') as HTMLInputElement;
    expect(offset.placeholder).toBe("Offset");
  });
});
