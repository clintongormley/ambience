import { describe, test, expect, afterEach } from "vitest";
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
  el.addEventListener("value-changed", ((e: CustomEvent) => { detail = e.detail; }) as any);
  return () => detail?.value;
}

describe("ambience-time-endpoint", () => {
  let el: any;
  afterEach(() => { el?.remove(); });

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
    expect(offset.placeholder).toContain("min");
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
});
