import { describe, expect, test } from "vitest";

import "../frontend/src/views/for-duration";
import type { StateForDuration } from "../frontend/src/types";

type ForMode = "at_least" | "less_than";

async function mount(
  value: StateForDuration | null = null,
  mode: ForMode = "at_least",
): Promise<any> {
  const el: any = document.createElement("ambience-for-duration");
  el.value = value;
  el.mode = mode;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("ambience-for-duration", () => {
  test("renders three native h:m:s inputs with the value", async () => {
    const el = await mount({ h: 1, m: 30, s: 15 });
    const inputs = el.shadowRoot.querySelectorAll("input[type='number']");
    expect(inputs.length).toBe(3);
    expect([...inputs].map((i: HTMLInputElement) => i.value)).toEqual(["1", "30", "15"]);
    el.remove();
  });

  test("null value displays as 0:0:0", async () => {
    const el = await mount(null);
    const inputs = el.shadowRoot.querySelectorAll("input[type='number']");
    expect([...inputs].map((i: HTMLInputElement) => i.value)).toEqual(["0", "0", "0"]);
    el.remove();
  });

  test("changing a part emits value-changed with the full {h,m,s,mode}", async () => {
    const el = await mount({ h: 0, m: 5, s: 0 });
    let detail: { value: StateForDuration & { mode: ForMode } } | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const inputs = el.shadowRoot.querySelectorAll("input[type='number']");
    (inputs[0] as HTMLInputElement).value = "2";
    inputs[0].dispatchEvent(new Event("change", { bubbles: true }));
    expect(detail?.value).toEqual({ h: 2, m: 5, s: 0, mode: "at_least" });
    el.remove();
  });

  test("a negative typed value clamps to 0", async () => {
    const el = await mount({ h: 1, m: 1, s: 1 });
    let detail: { value: StateForDuration & { mode: ForMode } } | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const h = el.shadowRoot.querySelectorAll("input[type='number']")[0] as HTMLInputElement;
    h.value = "-3";
    h.dispatchEvent(new Event("change", { bubbles: true }));
    expect(detail?.value).toEqual({ h: 0, m: 1, s: 1, mode: "at_least" });
    el.remove();
  });

  test("a decimal typed value truncates to an integer", async () => {
    const el = await mount({ h: 1, m: 1, s: 1 });
    let detail: { value: StateForDuration & { mode: ForMode } } | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const m = el.shadowRoot.querySelectorAll("input[type='number']")[1] as HTMLInputElement;
    m.value = "2.7";
    m.dispatchEvent(new Event("change", { bubbles: true }));
    expect(detail?.value).toEqual({ h: 1, m: 2, s: 1, mode: "at_least" });
    el.remove();
  });

  test("a non-numeric part coerces to 0", async () => {
    const el = await mount({ h: 1, m: 1, s: 1 });
    let detail: { value: StateForDuration & { mode: ForMode } } | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const inputs = el.shadowRoot.querySelectorAll("input[type='number']");
    (inputs[2] as HTMLInputElement).value = "abc";
    inputs[2].dispatchEvent(new Event("change", { bubbles: true }));
    expect(detail?.value).toEqual({ h: 1, m: 1, s: 0, mode: "at_least" });
    el.remove();
  });

  // --- mode selector ("at least" / "less than") --------------------------

  test("renders a mode selector with 'at least' / 'less than' options", async () => {
    const el = await mount({ h: 1, m: 0, s: 0 });
    const select = el.shadowRoot.querySelector("select.for-mode") as HTMLSelectElement;
    expect(select).toBeTruthy();
    const opts = [...select.options].map((o) => o.value);
    expect(opts).toEqual(["at_least", "less_than"]);
    const labels = [...select.options].map((o) => o.textContent?.trim());
    expect(labels).toEqual(["at least", "less than"]);
    el.remove();
  });

  test("defaults the mode selector to 'at_least'", async () => {
    const el = await mount({ h: 1, m: 0, s: 0 });
    const select = el.shadowRoot.querySelector("select.for-mode") as HTMLSelectElement;
    expect(select.value).toBe("at_least");
    el.remove();
  });

  test("reflects an explicit less_than mode in the selector", async () => {
    const el = await mount({ h: 1, m: 0, s: 0 }, "less_than");
    const select = el.shadowRoot.querySelector("select.for-mode") as HTMLSelectElement;
    expect(select.value).toBe("less_than");
    el.remove();
  });

  test("the mode selector is positioned before the duration cells", async () => {
    const el = await mount({ h: 1, m: 0, s: 0 });
    const root = el.shadowRoot;
    const select = root.querySelector("select.for-mode") as HTMLElement;
    const firstNumber = root.querySelector("input[type='number']") as HTMLElement;
    // DOCUMENT_POSITION_FOLLOWING (4) means firstNumber comes after select.
    expect(select.compareDocumentPosition(firstNumber) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    el.remove();
  });

  test("changing the mode emits value-changed with the full {h,m,s,mode}", async () => {
    const el = await mount({ h: 0, m: 5, s: 0 });
    let detail: { value: StateForDuration & { mode: ForMode } } | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const select = el.shadowRoot.querySelector("select.for-mode") as HTMLSelectElement;
    select.value = "less_than";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    expect(detail?.value).toEqual({ h: 0, m: 5, s: 0, mode: "less_than" });
    el.remove();
  });

  test("changing a duration cell carries the current less_than mode in the payload", async () => {
    const el = await mount({ h: 0, m: 5, s: 0 }, "less_than");
    let detail: { value: StateForDuration & { mode: ForMode } } | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const inputs = el.shadowRoot.querySelectorAll("input[type='number']");
    (inputs[0] as HTMLInputElement).value = "3";
    inputs[0].dispatchEvent(new Event("change", { bubbles: true }));
    expect(detail?.value).toEqual({ h: 3, m: 5, s: 0, mode: "less_than" });
    el.remove();
  });
});
