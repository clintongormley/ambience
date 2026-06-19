import { describe, expect, it } from "vitest";
import { localizeWsError } from "../frontend/src/i18n";

const hass = (map: Record<string, string>) => ({
  language: "en",
  localize: (k: string, ...args: string[]) => {
    let s = map[k];
    if (s === undefined) return k; // HA returns the key on miss
    for (let i = 0; i < args.length; i += 2) s = s.replaceAll(`{${args[i]}}`, args[i + 1]);
    return s;
  },
});

describe("localizeWsError", () => {
  it("localizes via translation_key + placeholders", () => {
    const h = hass({
      "component.ambience.exceptions.scope_disabled": "Scope {scope_id} is disabled",
    });
    const err = {
      code: "validation_error",
      message: "EN fallback",
      translation_key: "scope_disabled",
      translation_placeholders: { scope_id: "x" },
    };
    expect(localizeWsError(h, err)).toBe("Scope x is disabled");
  });
  it("falls back to message when key unresolved", () => {
    const err = {
      message: "EN fallback",
      translation_key: "missing_key",
      translation_placeholders: {},
    };
    expect(localizeWsError(hass({}), err)).toBe("EN fallback");
  });
  it("falls back to message when there is no key", () => {
    expect(localizeWsError(hass({}), { message: "plain" })).toBe("plain");
  });
  it("handles a plain Error", () => {
    expect(localizeWsError(hass({}), new Error("boom"))).toBe("boom");
  });
  it("handles a non-error value", () => {
    expect(localizeWsError(hass({}), "weird")).toBe("weird");
  });
});
