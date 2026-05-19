import { describe, test, expect, afterEach } from "vitest";
import "../frontend/src/views/period-edit-modal";
import type { PeriodDef } from "../frontend/src/types";

const defaultDef: PeriodDef = {
  from: { kind: "time", hh: 9, mm: 0 },
  to:   { kind: "time", hh: 17, mm: 0 },
  label: null,
};

async function mount(opts: { existingId?: string; initial?: PeriodDef; takenIds?: Set<string> } = {}): Promise<any> {
  const el: any = document.createElement("ambience-period-edit-modal");
  if (opts.existingId !== undefined) el.existingId = opts.existingId;
  el.initial = opts.initial ?? defaultDef;
  el.takenIds = opts.takenIds ?? new Set<string>();
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function captureSave(el: HTMLElement): () => { id: string; definition: PeriodDef } | undefined {
  let detail: { id: string; definition: PeriodDef } | undefined;
  el.addEventListener("period-save", ((e: CustomEvent) => { detail = e.detail; }) as any);
  return () => detail;
}

function clickSave(el: any) {
  const btns = el.shadowRoot.querySelectorAll(".actions button");
  (btns[1] as HTMLButtonElement).click();
}

describe("ambience-period-edit-modal", () => {
  let el: any;
  afterEach(() => { el?.remove(); });

  test("derives id from label on save", async () => {
    el = await mount();
    const get = captureSave(el);
    (el.shadowRoot.querySelector('input[id="label"]') as HTMLInputElement).value = "Wind Down";
    (el.shadowRoot.querySelector('input[id="label"]') as HTMLInputElement).dispatchEvent(new Event("input"));
    clickSave(el);
    expect(get()?.id).toBe("wind_down");
    expect(get()?.definition.label).toBe("Wind Down");
  });

  test("derived id strips special characters", async () => {
    el = await mount();
    const get = captureSave(el);
    (el.shadowRoot.querySelector('input[id="label"]') as HTMLInputElement).value = "Workout time!";
    (el.shadowRoot.querySelector('input[id="label"]') as HTMLInputElement).dispatchEvent(new Event("input"));
    clickSave(el);
    expect(get()?.id).toBe("workout_time");
  });

  test("rejects label that derives to id starting with digit", async () => {
    el = await mount();
    const get = captureSave(el);
    (el.shadowRoot.querySelector('input[id="label"]') as HTMLInputElement).value = "1st of the month";
    (el.shadowRoot.querySelector('input[id="label"]') as HTMLInputElement).dispatchEvent(new Event("input"));
    clickSave(el);
    expect(get()).toBeUndefined();
    expect(el.shadowRoot.querySelector(".error").textContent).toContain("must start with a letter");
  });

  test("rejects empty label", async () => {
    el = await mount();
    const get = captureSave(el);
    clickSave(el);
    expect(get()).toBeUndefined();
    expect(el.shadowRoot.querySelector(".error").textContent).toContain("Please enter a name");
  });

  test("rejects label that collides with takenIds", async () => {
    el = await mount({ takenIds: new Set(["afternoon"]) });
    const get = captureSave(el);
    (el.shadowRoot.querySelector('input[id="label"]') as HTMLInputElement).value = "Afternoon";
    (el.shadowRoot.querySelector('input[id="label"]') as HTMLInputElement).dispatchEvent(new Event("input"));
    clickSave(el);
    expect(get()).toBeUndefined();
    expect(el.shadowRoot.querySelector(".error").textContent).toContain("already exists");
  });

  test("Edit mode skips id validation (id is readonly)", async () => {
    el = await mount({ existingId: "afternoon", initial: defaultDef, takenIds: new Set(["afternoon"]) });
    const get = captureSave(el);
    clickSave(el);
    expect(get()?.id).toBe("afternoon");
  });

  test("Edit mode preserves existingId regardless of label", async () => {
    el = await mount({ existingId: "afternoon", initial: { ...defaultDef, label: "Afternoon" } });
    const get = captureSave(el);
    (el.shadowRoot.querySelector('input[id="label"]') as HTMLInputElement).value = "Something completely different";
    (el.shadowRoot.querySelector('input[id="label"]') as HTMLInputElement).dispatchEvent(new Event("input"));
    clickSave(el);
    expect(get()?.id).toBe("afternoon");
    expect(get()?.definition.label).toBe("Something completely different");
  });

  test("Edit mode allows clearing label back to null", async () => {
    el = await mount({ existingId: "afternoon", initial: { ...defaultDef, label: "Afternoon" } });
    const get = captureSave(el);
    const input = el.shadowRoot.querySelector('input[id="label"]') as HTMLInputElement;
    input.value = "";
    input.dispatchEvent(new Event("input"));
    clickSave(el);
    expect(get()?.definition.label).toBeNull();
  });

  test("id field is not present (always absent)", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector('input[id="id"]')).toBeNull();
    el.remove();
    el = await mount({ existingId: "afternoon", initial: defaultDef });
    expect(el.shadowRoot.querySelector('input[id="id"]')).toBeNull();
  });

  test("heading shows 'Add custom period' in Add mode", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector("h3").textContent).toContain("Add custom period");
  });

  test("heading shows friendly label in Edit mode", async () => {
    el = await mount({ existingId: "afternoon", initial: { ...defaultDef, label: "Afternoon" } });
    expect(el.shadowRoot.querySelector("h3").textContent).toContain("Afternoon");
  });

  test("Cancel emits period-cancel", async () => {
    el = await mount();
    let cancelled = false;
    el.addEventListener("period-cancel", () => { cancelled = true; });
    const cancelBtn = el.shadowRoot.querySelectorAll(".actions button")[0] as HTMLButtonElement;
    cancelBtn.click();
    expect(cancelled).toBe(true);
  });
});
