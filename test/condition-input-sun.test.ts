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

describe("ambience-sun-predicate-input", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("shows Elevation and Azimuth sections", async () => {
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("Elevation");
    expect(el.shadowRoot.textContent).toContain("Azimuth");
  });

  test("renders sectors as a compass grid (NW N NE / W E / SW S SE order)", async () => {
    el = await mount();
    const labels = Array.from(el.shadowRoot.querySelectorAll(".sectors label")).map((n: Element) =>
      n.textContent?.trim(),
    );
    expect(labels).toEqual(["NW", "N", "NE", "W", "E", "SW", "S", "SE"]);
  });

  test("checked state reflects the current sectors regardless of grid order", async () => {
    el = await mount({ azimuth: { sectors: ["NW", "SE"] } });
    const checked = Array.from(el.shadowRoot.querySelectorAll(".sectors label"))
      .filter((l: Element) => (l.querySelector("input") as HTMLInputElement).checked)
      .map((l: Element) => l.textContent?.trim());
    expect(checked).toEqual(["NW", "SE"]);
  });

  test("ticking a compass checkbox emits that sector; unticking removes it", async () => {
    el = await mount({ azimuth: { sectors: ["N"] } });
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });

    const box = (label: string): HTMLInputElement => {
      const lbl = Array.from(el.shadowRoot.querySelectorAll(".sectors label")).find(
        (l: Element) => l.textContent?.trim() === label,
      ) as Element;
      return lbl.querySelector("input") as HTMLInputElement;
    };

    const ne = box("NE");
    ne.checked = true;
    ne.dispatchEvent(new Event("change"));
    expect(detail.value).toEqual({ azimuth: { sectors: ["N", "NE"] } });
    await el.updateComplete;

    const n = box("N");
    n.checked = false;
    n.dispatchEvent(new Event("change"));
    expect(detail.value).toEqual({ azimuth: { sectors: ["NE"] } });
  });

  test("selecting sectors emits an azimuth predicate", async () => {
    el = await mount();
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    el._setSectors(["W", "SW"]);
    expect(detail.value).toEqual({ azimuth: { sectors: ["W", "SW"] } });
  });

  test("setting an elevation band emits an elevation predicate", async () => {
    el = await mount();
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    el._setElevation({ min: 0, max: 30 });
    expect(detail.value).toEqual({ elevation: { min: 0, max: 30 } });
  });

  test("elevation 'above' keeps only min; 'below' keeps only max", async () => {
    el = await mount();
    el._setElevation({ min: 10 });
    expect(el.value).toEqual({ elevation: { min: 10 } });
    el._setElevation({ max: 20 });
    expect(el.value).toEqual({ elevation: { max: 20 } });
  });

  test("_setRange sets a single range; null removes it", async () => {
    el = await mount();
    el._setRange({ from: 200, to: 250 });
    expect(el.value).toEqual({ azimuth: { ranges: [{ from: 200, to: 250 }] } });
    el._setRange(null);
    expect(el.value).toBeNull();
  });

  test("ticking 'Custom range' reveals from/to inputs and emits a default range", async () => {
    el = await mount();
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const toggle = el.shadowRoot.querySelector(".custom-range-toggle") as HTMLInputElement;
    toggle.checked = true;
    toggle.dispatchEvent(new Event("change"));
    expect(detail.value).toEqual({ azimuth: { ranges: [{ from: 0, to: 0 }] } });
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".range-row")).toBeTruthy();
  });

  test("editing the custom range emits the updated from/to", async () => {
    el = await mount({ azimuth: { ranges: [{ from: 200, to: 250 }] } });
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const from = el.shadowRoot.querySelector(".range-row .from") as HTMLInputElement;
    from.value = "210";
    from.dispatchEvent(new Event("change"));
    expect(detail.value).toEqual({ azimuth: { ranges: [{ from: 210, to: 250 }] } });
  });

  test("unticking 'Custom range' removes it", async () => {
    el = await mount({ azimuth: { ranges: [{ from: 200, to: 250 }] } });
    const toggle = el.shadowRoot.querySelector(".custom-range-toggle") as HTMLInputElement;
    expect(toggle.checked).toBe(true);
    toggle.checked = false;
    toggle.dispatchEvent(new Event("change"));
    expect(el.value).toBeNull();
  });

  test("clearing both elevation and azimuth emits null", async () => {
    el = await mount({ elevation: { min: 10 } });
    el._setElevation(null);
    expect(el.value).toBeNull();
  });

  test("combines elevation AND azimuth", async () => {
    el = await mount({ azimuth: { sectors: ["W"] } });
    el._setElevation({ max: 20 });
    expect(el.value).toEqual({ elevation: { max: 20 }, azimuth: { sectors: ["W"] } });
  });

  test("round-trips an existing predicate (sectors + range + elevation band)", async () => {
    const value: SunPredicate = {
      elevation: { min: 0, max: 30 },
      azimuth: { sectors: ["S", "SW"], ranges: [{ from: 100, to: 140 }] },
    };
    el = await mount(value);
    const cur = el._current();
    expect(cur.elevation).toEqual({ min: 0, max: 30 });
    expect(cur.sectors).toEqual(["S", "SW"]);
    expect(cur.range).toEqual({ from: 100, to: 140 });
  });
});
