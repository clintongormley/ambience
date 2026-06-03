import { describe, expect, test } from "vitest";

import { entityIcon, entityName } from "../frontend/src/views/entity-row";

const hass: any = {
  states: {
    "person.alice": { attributes: { friendly_name: "Alice" } },
    "sensor.x": { attributes: {} },
    "light.y": { attributes: { icon: "mdi:custom" } },
  },
};

describe("entity-row helpers", () => {
  test("entityName prefers friendly_name, falls back to id", () => {
    expect(entityName(hass, "person.alice")).toBe("Alice");
    expect(entityName(hass, "sensor.x")).toBe("sensor.x");
  });

  test("entityIcon prefers custom icon, then domain default", () => {
    expect(entityIcon(hass, "light.y")).toBe("mdi:custom");
    expect(entityIcon(hass, "person.alice")).toBe("mdi:account");
    expect(entityIcon(hass, "sensor.x")).toBe("mdi:eye");
  });
});
