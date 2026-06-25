import { describe, expect, test } from "vitest";
import { isComponentLoaded } from "../frontend/src/ha-config.js";

describe("isComponentLoaded", () => {
  const hassWith = (components: unknown) =>
    ({ callWS: async () => undefined, connection: {} as never, config: { components } }) as never;

  test("true when the domain is in config.components", () => {
    expect(isComponentLoaded(hassWith(["cover", "fado", "light"]), "fado")).toBe(true);
  });

  test("false when the domain is absent", () => {
    expect(isComponentLoaded(hassWith(["cover", "light"]), "fado")).toBe(false);
  });

  test("false when components is not an array", () => {
    expect(isComponentLoaded(hassWith(undefined), "fado")).toBe(false);
    expect(isComponentLoaded(hassWith("nope"), "fado")).toBe(false);
  });

  test("false when config is missing", () => {
    expect(
      isComponentLoaded({ callWS: async () => undefined, connection: {} } as never, "fado"),
    ).toBe(false);
  });
});
