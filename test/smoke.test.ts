import { describe, test, expect } from "vitest";

describe("vitest smoke", () => {
  test("runs", () => {
    expect(1 + 1).toBe(2);
  });

  test("happy-dom provides document", () => {
    const div = document.createElement("div");
    div.textContent = "hi";
    expect(div.textContent).toBe("hi");
  });
});
