import { render, type TemplateResult } from "lit";
import { afterEach, describe, expect, test } from "vitest";

import { renderIcon, renderLogo } from "../frontend/src/logo";

type BrandOpts = { dark?: boolean; title?: string };

function drawWith(
  renderer: (opts?: BrandOpts) => TemplateResult,
  opts?: BrandOpts,
): HTMLImageElement {
  const c = document.createElement("div");
  render(renderer(opts), c);
  return c.querySelector("img")!;
}

function draw(opts?: BrandOpts): HTMLImageElement {
  return drawWith(renderLogo, opts);
}

describe("renderLogo", () => {
  let img: HTMLImageElement | undefined;
  afterEach(() => img?.remove());

  test("renders an <img> labelled Ambience", () => {
    img = draw();
    expect(img).toBeTruthy();
    expect(img.getAttribute("alt")).toBe("Ambience");
    expect(img.className).toContain("ambience-logo");
  });

  test("light variant points at the light logo + @2x srcset", () => {
    img = draw({ dark: false });
    expect(img.getAttribute("src")!.endsWith("/logo.png")).toBe(true);
    const srcset = img.getAttribute("srcset")!;
    expect(srcset).toContain("/logo.png 1x");
    expect(srcset).toContain("/logo@2x.png 2x");
  });

  test("dark variant points at the dark logo + @2x srcset", () => {
    img = draw({ dark: true });
    expect(img.getAttribute("src")!.endsWith("/dark_logo.png")).toBe(true);
    const srcset = img.getAttribute("srcset")!;
    expect(srcset).toContain("/dark_logo.png 1x");
    expect(srcset).toContain("/dark_logo@2x.png 2x");
  });

  test("defaults to the light variant when no options given", () => {
    img = draw();
    expect(img.getAttribute("src")!.endsWith("/logo.png")).toBe(true);
  });

  test("title overrides the alt text", () => {
    img = draw({ title: "Ambiente" });
    expect(img.getAttribute("alt")).toBe("Ambiente");
  });
});

function drawIcon(opts?: BrandOpts): HTMLImageElement {
  return drawWith(renderIcon, opts);
}

describe("renderIcon", () => {
  let img: HTMLImageElement | undefined;
  afterEach(() => img?.remove());

  test("renders an <img> labelled Ambience with the icon class", () => {
    img = drawIcon();
    expect(img).toBeTruthy();
    expect(img.getAttribute("alt")).toBe("Ambience");
    expect(img.className).toContain("ambience-icon");
  });

  test("light variant points at the light icon + @2x srcset", () => {
    img = drawIcon({ dark: false });
    expect(img.getAttribute("src")!.endsWith("/icon.png")).toBe(true);
    const srcset = img.getAttribute("srcset")!;
    expect(srcset).toContain("/icon.png 1x");
    expect(srcset).toContain("/icon@2x.png 2x");
  });

  test("dark variant points at the dark icon + @2x srcset", () => {
    img = drawIcon({ dark: true });
    expect(img.getAttribute("src")!.endsWith("/dark_icon.png")).toBe(true);
    const srcset = img.getAttribute("srcset")!;
    expect(srcset).toContain("/dark_icon.png 1x");
    expect(srcset).toContain("/dark_icon@2x.png 2x");
  });

  test("defaults to the light variant when no options given", () => {
    img = drawIcon();
    expect(img.getAttribute("src")!.endsWith("/icon.png")).toBe(true);
  });

  test("title overrides the alt text", () => {
    img = drawIcon({ title: "Ambiente" });
    expect(img.getAttribute("alt")).toBe("Ambiente");
  });
});
