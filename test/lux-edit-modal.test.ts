import { afterEach, describe, expect, test } from "vitest";
import "../frontend/src/views/lux-edit-modal";
import type { LuxRangeDef } from "../frontend/src/types";

async function mount(
  opts: { existingId?: string; initial?: LuxRangeDef; takenIds?: Set<string> } = {},
): Promise<any> {
  const el: any = document.createElement("ambience-lux-edit-modal");
  if (opts.existingId !== undefined) el.existingId = opts.existingId;
  if (opts.initial !== undefined) el.initial = opts.initial;
  el.takenIds = opts.takenIds ?? new Set<string>();
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function captureSave(el: HTMLElement): () => { id: string; definition: LuxRangeDef } | undefined {
  let detail: { id: string; definition: LuxRangeDef } | undefined;
  el.addEventListener("lux-range-save", ((e: CustomEvent) => {
    detail = e.detail;
  }) as any);
  return () => detail;
}

function setInput(el: any, id: string, value: string) {
  const input = el.shadowRoot.querySelector(`input[id="${id}"]`) as HTMLInputElement;
  input.value = value;
  input.dispatchEvent(new Event("input"));
}

function clickSave(el: any) {
  (el.shadowRoot.querySelectorAll(".actions button")[1] as HTMLButtonElement).click();
}

describe("ambience-lux-edit-modal", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("derives id from label and emits min/max band on save", async () => {
    el = await mount();
    const get = captureSave(el);
    setInput(el, "label", "Gloomy Den");
    setInput(el, "min", "5");
    setInput(el, "max", "30");
    clickSave(el);
    expect(get()?.id).toBe("gloomy_den");
    expect(get()?.definition).toEqual({ label: "Gloomy Den", min: 5, max: 30 });
  });

  test("an open-ended (min-only) band is allowed", async () => {
    el = await mount();
    const get = captureSave(el);
    setInput(el, "label", "Very bright");
    setInput(el, "min", "1000");
    setInput(el, "max", "");
    clickSave(el);
    expect(get()?.definition).toEqual({ label: "Very bright", min: 1000 });
  });

  test("rejects a band with neither bound", async () => {
    el = await mount();
    const get = captureSave(el);
    setInput(el, "label", "Empty");
    setInput(el, "min", "");
    setInput(el, "max", "");
    clickSave(el);
    expect(get()).toBeUndefined();
    expect(el.shadowRoot.querySelector(".error").textContent).toContain("min");
  });

  test("rejects min >= max", async () => {
    el = await mount();
    const get = captureSave(el);
    setInput(el, "label", "Backwards");
    setInput(el, "min", "300");
    setInput(el, "max", "100");
    clickSave(el);
    expect(get()).toBeUndefined();
    expect(el.shadowRoot.querySelector(".error").textContent).toContain("less than");
  });

  test("rejects a negative bound", async () => {
    el = await mount();
    const get = captureSave(el);
    setInput(el, "label", "Neg");
    setInput(el, "min", "-5");
    clickSave(el);
    expect(get()).toBeUndefined();
    expect(el.shadowRoot.querySelector(".error").textContent).toContain("0 or greater");
  });

  test("edit mode preserves existingId and prefills bounds", async () => {
    el = await mount({ existingId: "dim", initial: { min: 10, max: 50, label: "Dim" } });
    expect(el.shadowRoot.querySelector("h3").textContent).toContain("Dim");
    expect((el.shadowRoot.querySelector('input[id="min"]') as HTMLInputElement).value).toBe("10");
    const get = captureSave(el);
    setInput(el, "max", "60");
    clickSave(el);
    expect(get()?.id).toBe("dim");
    expect(get()?.definition).toEqual({ label: "Dim", min: 10, max: 60 });
  });

  test("Cancel emits lux-range-cancel", async () => {
    el = await mount();
    let cancelled = false;
    el.addEventListener("lux-range-cancel", () => {
      cancelled = true;
    });
    (el.shadowRoot.querySelectorAll(".actions button")[0] as HTMLButtonElement).click();
    expect(cancelled).toBe(true);
  });
});
