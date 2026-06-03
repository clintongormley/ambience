import { describe, expect, test } from "vitest";

import { colorHex, textColorFor } from "../frontend/src/category-colors";

describe("textColorFor", () => {
  test("white background → black text", () => {
    expect(textColorFor("#ffffff")).toBe("#000000");
  });

  test("black background → white text", () => {
    expect(textColorFor("#000000")).toBe("#ffffff");
  });

  test("a dark colour → white text", () => {
    expect(textColorFor("#3f51b5")).toBe("#ffffff");
  });

  test("a light colour → black text", () => {
    expect(textColorFor("#ffeb3b")).toBe("#000000");
  });
});

describe("colorHex", () => {
  test("resolves a known id to its hex", () => {
    expect(colorHex("green")).toBe("#4caf50");
  });

  test("undefined input → undefined", () => {
    expect(colorHex(undefined)).toBeUndefined();
  });

  test("unknown id → undefined", () => {
    expect(colorHex("nonsense")).toBeUndefined();
  });
});
