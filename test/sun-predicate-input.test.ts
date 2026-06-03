import { afterEach, describe, expect, test } from "vitest";
import "../frontend/src/views/sun-predicate-input";
import type { SunPredicate } from "../frontend/src/types";

async function mount(value: SunPredicate = null): Promise<any> {
  const el: any = document.createElement("ambience-sun-predicate-input");
  el.value = value;
  el.hass = {};
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("ambience-sun-predicate-input — between-mode elevation inputs", () => {
  let el: any;
  afterEach(() => el?.remove());

  // Lines 146-148: min input change handler when mode === "between" must
  // carry the existing max through the spread.
  test("editing min input in 'between' mode preserves the existing max", async () => {
    el = await mount({ elevation: { min: 10, max: 40 } });
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });

    const minInput = el.shadowRoot.querySelector("input.min") as HTMLInputElement;
    minInput.value = "20";
    minInput.dispatchEvent(new Event("change"));

    expect(detail.value).toEqual({ elevation: { min: 20, max: 40 } });
  });

  // Lines 156-158: max input change handler when mode === "between" must
  // carry the existing min through the spread.
  test("editing max input in 'between' mode preserves the existing min", async () => {
    el = await mount({ elevation: { min: 10, max: 40 } });
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });

    const maxInput = el.shadowRoot.querySelector("input.max") as HTMLInputElement;
    maxInput.value = "50";
    maxInput.dispatchEvent(new Event("change"));

    expect(detail.value).toEqual({ elevation: { min: 10, max: 50 } });
  });
});
