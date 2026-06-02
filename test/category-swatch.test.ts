import { describe, test, expect, afterEach } from "vitest";
import { render } from "lit";

import { categorySwatch, categorySwatchStyles } from "../frontend/src/category-swatch";

function draw(color: string | undefined, icon: string | undefined): HTMLElement {
  const c = document.createElement("div");
  render(categorySwatch(color, icon), c);
  return c.querySelector(".category-swatch")!;
}

describe("categorySwatch", () => {
  let swatch: HTMLElement | undefined;
  afterEach(() => swatch?.remove());

  test("renders a span.category-swatch", () => {
    swatch = draw("green", "mdi:blinds");
    expect(swatch).toBeTruthy();
    expect(swatch.tagName).toBe("SPAN");
  });

  test("a coloured category paints the swatch with its colour", () => {
    swatch = draw("green", "mdi:blinds");
    expect(swatch.getAttribute("style") || "").toContain("#4caf50");
  });

  test("renders the category's icon", () => {
    swatch = draw("green", "mdi:blinds");
    expect(swatch.querySelector('ha-icon[icon="mdi:blinds"]')).toBeTruthy();
  });

  test("no icon → no ha-icon element", () => {
    swatch = draw("green", undefined);
    expect(swatch.querySelector("ha-icon")).toBeNull();
  });

  test("no colour → neutral (empty) inline style", () => {
    swatch = draw(undefined, "mdi:filter-variant");
    expect(swatch.getAttribute("style") || "").toBe("");
    expect(swatch.querySelector('ha-icon[icon="mdi:filter-variant"]')).toBeTruthy();
  });
});

describe("categorySwatchStyles", () => {
  test("styles the .category-swatch shell with a parameterised size", () => {
    const cssText = categorySwatchStyles.cssText;
    expect(cssText).toContain(".category-swatch");
    expect(cssText).toContain("--category-swatch-size");
    expect(cssText).toContain("--category-swatch-icon-size");
  });
});
