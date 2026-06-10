import { describe, expect, test } from "vitest";

import "../frontend/src/views/for-duration";
import type { StateForDuration } from "../frontend/src/types";

async function mount(value: StateForDuration | null = null): Promise<any> {
  const el: any = document.createElement("ambience-for-duration");
  el.value = value;
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

  test("changing a part emits value-changed with the full {h,m,s}", async () => {
    const el = await mount({ h: 0, m: 5, s: 0 });
    let detail: { value: StateForDuration } | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const inputs = el.shadowRoot.querySelectorAll("input[type='number']");
    (inputs[0] as HTMLInputElement).value = "2";
    inputs[0].dispatchEvent(new Event("change", { bubbles: true }));
    expect(detail?.value).toEqual({ h: 2, m: 5, s: 0 });
    el.remove();
  });

  test("a non-numeric part coerces to 0", async () => {
    const el = await mount({ h: 1, m: 1, s: 1 });
    let detail: { value: StateForDuration } | undefined;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const inputs = el.shadowRoot.querySelectorAll("input[type='number']");
    (inputs[2] as HTMLInputElement).value = "abc";
    inputs[2].dispatchEvent(new Event("change", { bubbles: true }));
    expect(detail?.value).toEqual({ h: 1, m: 1, s: 0 });
    el.remove();
  });
});
