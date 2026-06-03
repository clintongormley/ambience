import { render } from "lit";
import { afterEach, describe, expect, test } from "vitest";

import { renderLogo } from "../frontend/src/logo";

function draw(opts?: { dark?: boolean; title?: string }): HTMLImageElement {
  const c = document.createElement("div");
  render(renderLogo(opts), c);
  return c.querySelector("img")!;
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
