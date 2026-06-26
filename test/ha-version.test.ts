/**
 * Tests for targetSelectorSupported() in ha-version.ts.
 *
 * Parses hass.config.version and returns true iff HA >= 2026.1
 * (where homeassistant.helpers.target is available).
 */
import { describe, expect, test } from "vitest";
import { targetSelectorSupported } from "../frontend/src/ha-version";

function hass(version: string) {
  return { config: { version } } as any;
}

describe("targetSelectorSupported", () => {
  test("returns false for HA 2025.2.0 (below min with full helpers)", () => {
    expect(targetSelectorSupported(hass("2025.2.0"))).toBe(false);
  });

  test("returns false for HA 2025.12.0 (still below 2026.1)", () => {
    expect(targetSelectorSupported(hass("2025.12.0"))).toBe(false);
  });

  test("returns false for HA 2026.0.1", () => {
    expect(targetSelectorSupported(hass("2026.0.1"))).toBe(false);
  });

  test("returns true for HA 2026.1.0 (first supported)", () => {
    expect(targetSelectorSupported(hass("2026.1.0"))).toBe(true);
  });

  test("returns true for HA 2026.5.1", () => {
    expect(targetSelectorSupported(hass("2026.5.1"))).toBe(true);
  });

  test("returns true for HA 2027.1.0 (future major)", () => {
    expect(targetSelectorSupported(hass("2027.1.0"))).toBe(true);
  });

  test("returns true for HA 2027.1 (no patch segment)", () => {
    expect(targetSelectorSupported(hass("2027.1"))).toBe(true);
  });

  test("returns true for garbage version string (assume modern)", () => {
    expect(targetSelectorSupported(hass("not-a-version"))).toBe(true);
  });

  test("returns true when version is empty string (assume modern)", () => {
    expect(targetSelectorSupported(hass(""))).toBe(true);
  });

  test("returns true when config is missing (assume modern)", () => {
    expect(targetSelectorSupported({ config: undefined } as any)).toBe(true);
  });
});
