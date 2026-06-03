import { describe, expect, test } from "vitest";
import { scopeIcon } from "../frontend/src/scope-icon";
import type { Scope } from "../frontend/src/types";

const house: Scope = { kind: "house" };
const floor: Scope = { kind: "floor", id: "ground_floor" };
const area: Scope = { kind: "area", id: "living_room" };

describe("scopeIcon", () => {
  test("house always uses the default house icon", () => {
    expect(scopeIcon(house)).toBe("mdi:home");
    // House has no registry entry; registries are irrelevant.
    expect(scopeIcon(house, { areas: {}, floors: {} })).toBe("mdi:home");
  });

  test("floor uses the icon from HA's floor registry when set", () => {
    const hass = { floors: { ground_floor: { icon: "mdi:home-floor-g" } } };
    expect(scopeIcon(floor, hass)).toBe("mdi:home-floor-g");
  });

  test("area uses the icon from HA's area registry when set", () => {
    const hass = { areas: { living_room: { icon: "mdi:sofa" } } };
    expect(scopeIcon(area, hass)).toBe("mdi:sofa");
  });

  test("floor falls back to the default floor icon when none is set", () => {
    expect(scopeIcon(floor)).toBe("mdi:layers");
    expect(scopeIcon(floor, { floors: {} })).toBe("mdi:layers");
    // Registry entry present but icon null/empty → still the default.
    expect(scopeIcon(floor, { floors: { ground_floor: { icon: null } } })).toBe("mdi:layers");
    expect(scopeIcon(floor, { floors: { ground_floor: { icon: "" } } })).toBe("mdi:layers");
  });

  test("area falls back to the default area icon when none is set", () => {
    expect(scopeIcon(area)).toBe("mdi:texture-box");
    expect(scopeIcon(area, { areas: {} })).toBe("mdi:texture-box");
    expect(scopeIcon(area, { areas: { living_room: { icon: null } } })).toBe("mdi:texture-box");
  });

  test("tolerates a hass without areas/floors registries", () => {
    expect(scopeIcon(floor, {})).toBe("mdi:layers");
    expect(scopeIcon(area, {})).toBe("mdi:texture-box");
  });
});
