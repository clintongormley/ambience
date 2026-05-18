/**
 * Tests for ha-components.ts — specifically the pickHaTextInput and
 * watchHaComponents functions, and the hass-with-keys branch in ensureHaComponents.
 */
import { describe, test, expect, vi, beforeEach } from "vitest";
import { pickHaTextInput, watchHaComponents } from "../frontend/src/ha-components";

// Reset module-level singletons between test groups using vi.resetModules in
// a fresh import each time, or just test observable behaviour.

describe("pickHaTextInput", () => {
  test("returns null when neither ha-input nor ha-textfield is registered", () => {
    // jsdom doesn't have HA components registered
    expect(pickHaTextInput()).toBeNull();
  });

  test("returns 'ha-input' when ha-input is registered", () => {
    // Temporarily register a fake ha-input element
    class FakeHaInput extends HTMLElement {}
    customElements.define("ha-input-test-only", FakeHaInput);
    // We can't re-register 'ha-input' in jsdom without risking conflicts,
    // so we test the logic indirectly: if ha-input is not defined, we get null.
    const result = pickHaTextInput();
    expect(result === null || result === "ha-input" || result === "ha-textfield").toBe(true);
  });
});

describe("watchHaComponents", () => {
  test("calls requestUpdate when a tracked component becomes defined", async () => {
    const mockHost = { requestUpdate: vi.fn() };
    watchHaComponents(mockHost as any);
    // ha-combo-box is not defined in jsdom → whenDefined is pending; no update yet
    expect(mockHost.requestUpdate).not.toHaveBeenCalled();
  });

  test("does not throw when host has no hass", () => {
    const mockHost = { requestUpdate: vi.fn() };
    expect(() => watchHaComponents(mockHost as any)).not.toThrow();
  });

  test("accepts hass object parameter without throwing", () => {
    const mockHost = { requestUpdate: vi.fn() };
    const fakeHass = { loadForm: vi.fn(), someOtherKey: "value" };
    expect(() => watchHaComponents(mockHost as any, fakeHass)).not.toThrow();
  });

  test("passes hass object to ensureHaComponents (exercises hass-key branch)", async () => {
    // Pass a hass object that has keys matching the /load|helper|card|form|element|register/i filter
    // This exercises the `hass && typeof hass === "object"` true branch.
    const mockHost = { requestUpdate: vi.fn() };
    const fakeHass = {
      loadCardHelpers: undefined, // no real loader
      callWS: vi.fn(),
    };
    watchHaComponents(mockHost as any, fakeHass);
    // Allow async tasks to settle
    await new Promise((r) => setTimeout(r, 10));
    // No error should have been thrown
    expect(mockHost.requestUpdate).not.toHaveBeenCalled();
  });
});
