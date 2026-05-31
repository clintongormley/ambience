import { describe, test, expect, afterEach } from "vitest";
import { render } from "lit";

import { groupSwatch, groupSwatchStyles } from "../frontend/src/group-swatch";

function draw(color: string | undefined, icon: string | undefined): HTMLElement {
  const c = document.createElement("div");
  render(groupSwatch(color, icon), c);
  return c.querySelector(".group-swatch")!;
}

describe("groupSwatch", () => {
  let swatch: HTMLElement | undefined;
  afterEach(() => swatch?.remove());

  test("renders a span.group-swatch", () => {
    swatch = draw("green", "mdi:blinds");
    expect(swatch).toBeTruthy();
    expect(swatch.tagName).toBe("SPAN");
  });

  test("a coloured group paints the swatch with its colour", () => {
    swatch = draw("green", "mdi:blinds");
    expect(swatch.getAttribute("style") || "").toContain("#4caf50");
  });

  test("renders the group's icon", () => {
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

describe("groupSwatchStyles", () => {
  test("styles the .group-swatch shell with a parameterised size", () => {
    const cssText = groupSwatchStyles.cssText;
    expect(cssText).toContain(".group-swatch");
    expect(cssText).toContain("--group-swatch-size");
    expect(cssText).toContain("--group-swatch-icon-size");
  });
});
