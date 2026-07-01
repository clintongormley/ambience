import { describe, expect, test } from "vitest";

import { entityNameWithArea, nameContainsArea } from "../frontend/src/entity-area";
import { effectiveAreaId } from "../frontend/src/entity-registry";

const hass: any = {
  states: {
    "sensor.flow": { attributes: { friendly_name: "Water pump Flow" } },
    "binary_sensor.shower": { attributes: { friendly_name: "Zone Shower" } },
    "binary_sensor.guest": { attributes: { friendly_name: "Zone Shower" } },
    "sensor.dev": { attributes: { friendly_name: "Dev Sensor" } },
    "sensor.raw": { attributes: {} },
    "sensor.orphan": { attributes: { friendly_name: "Lonely" } },
    "sensor.stateonly": { attributes: { friendly_name: "State Only" } },
    "sensor.noname": { attributes: { friendly_name: "Mystery" } },
    // A live state whose friendly_name must win over the registry name below.
    "sensor.bothnames": { attributes: { friendly_name: "Friendly Wins" } },
    // remote.cine / remote.origonly / remote.deviceonly deliberately have NO
    // state — they model an entity that's in the registry but not currently in
    // hass.states (unavailable / not loaded), the case that used to leak the
    // raw entity_id into the summary.
  },
  entities: {
    "sensor.flow": { entity_id: "sensor.flow", area_id: "kitchen" },
    "binary_sensor.shower": { entity_id: "binary_sensor.shower", area_id: "shower" },
    "binary_sensor.guest": { entity_id: "binary_sensor.guest", area_id: "guest_bath" },
    "sensor.dev": { entity_id: "sensor.dev", area_id: null, device_id: "dev1" },
    "sensor.raw": { entity_id: "sensor.raw", area_id: "kitchen" },
    "sensor.orphan": { entity_id: "sensor.orphan", area_id: null, device_id: null },
    "sensor.noname": { entity_id: "sensor.noname", area_id: "ghost" },
    "sensor.bothnames": {
      entity_id: "sensor.bothnames",
      area_id: "kitchen",
      name: "Registry Name",
    },
    "remote.cine": { entity_id: "remote.cine", area_id: "lounge", name: "Cine" },
    "remote.origonly": {
      entity_id: "remote.origonly",
      area_id: "lounge",
      original_name: "Origin Remote",
    },
    "remote.deviceonly": { entity_id: "remote.deviceonly", area_id: "lounge", device_id: "hub1" },
    "remote.renamed": { entity_id: "remote.renamed", area_id: "lounge", device_id: "hub2" },
  },
  devices: {
    dev1: { id: "dev1", area_id: "kitchen" },
    hub1: { id: "hub1", area_id: "lounge", name: "Harmony Hub" },
    // A user-renamed device: HA stores the rename in name_by_user.
    hub2: { id: "hub2", area_id: "lounge", name: "Original Hub", name_by_user: "Renamed Hub" },
  },
  areas: {
    kitchen: { area_id: "kitchen", name: "Kitchen" },
    shower: { area_id: "shower", name: "Shower" },
    guest_bath: { area_id: "guest_bath", name: "Guest Bath" },
    ghost: { area_id: "ghost" },
    lounge: { area_id: "lounge", name: "Lounge" },
  },
};

describe("effectiveAreaId", () => {
  test("own area_id wins", () => {
    expect(effectiveAreaId(hass, "sensor.flow")).toBe("kitchen");
  });
  test("falls back to device area", () => {
    expect(effectiveAreaId(hass, "sensor.dev")).toBe("kitchen");
  });
  test("orphan (no area, no device area) → null", () => {
    expect(effectiveAreaId(hass, "sensor.orphan")).toBeNull();
  });
  test("entity absent from registry → null", () => {
    expect(effectiveAreaId(hass, "sensor.nope")).toBeNull();
  });
});

describe("nameContainsArea", () => {
  test("single-word area contained → true", () => {
    expect(nameContainsArea("Zone Shower", "Shower")).toBe(true);
  });
  test("multi-word area contiguous → true", () => {
    expect(nameContainsArea("Guest Bath Sensor", "Guest Bath")).toBe(true);
  });
  test("no overlap → false", () => {
    expect(nameContainsArea("Water pump Flow", "Kitchen")).toBe(false);
  });
  test("whole-word, not substring", () => {
    expect(nameContainsArea("Bathroom Motion", "Bath")).toBe(false);
  });
  test("case-insensitive", () => {
    expect(nameContainsArea("zone SHOWER", "Shower")).toBe(true);
  });
  test("empty area → treated as contained", () => {
    expect(nameContainsArea("Anything", "")).toBe(true);
  });
  test("matches across Unicode normalization forms (NFD name vs NFC area)", () => {
    // Same word in different normal forms, built from code points so the editor
    // can't fold them to one form: NFD = "o" + U+0301 combining acute, NFC =
    // precomposed U+00F3. Must still match so the redundant prefix is suppressed.
    const nfd = `Sal${String.fromCharCode(0x6f, 0x301)}n Lampara`;
    const nfc = `Sal${String.fromCharCode(0xf3)}n`;
    expect(nameContainsArea(nfd, nfc)).toBe(true);
  });
});

describe("entityNameWithArea", () => {
  test("prefixes the area when not redundant", () => {
    expect(entityNameWithArea(hass, "sensor.flow")).toBe("Kitchen · Water pump Flow");
  });
  test("suppresses prefix when name already contains the area", () => {
    expect(entityNameWithArea(hass, "binary_sensor.shower")).toBe("Zone Shower");
  });
  test("disambiguates same-name entities in different areas", () => {
    expect(entityNameWithArea(hass, "binary_sensor.guest")).toBe("Guest Bath · Zone Shower");
  });
  test("uses device-area fallback", () => {
    expect(entityNameWithArea(hass, "sensor.dev")).toBe("Kitchen · Dev Sensor");
  });
  test("orphan entity → bare name", () => {
    expect(entityNameWithArea(hass, "sensor.orphan")).toBe("Lonely");
  });
  test("no state → registry override name (matches the entity picker)", () => {
    // The reported regression: remote.cine has no live state, so friendly_name
    // is unavailable. The registry knows it as "Cine" (same source the picker
    // and the area prefix read) — the summary must use that, not the raw id.
    expect(entityNameWithArea(hass, "remote.cine")).toBe("Lounge · Cine");
  });
  test("no state, no override → registry original_name", () => {
    expect(entityNameWithArea(hass, "remote.origonly")).toBe("Lounge · Origin Remote");
  });
  test("no state, no entity name → device name", () => {
    expect(entityNameWithArea(hass, "remote.deviceonly")).toBe("Lounge · Harmony Hub");
  });
  test("device name uses the user's rename (name_by_user) over the original name", () => {
    expect(entityNameWithArea(hass, "remote.renamed")).toBe("Lounge · Renamed Hub");
  });
  test("live friendly_name wins over the registry name", () => {
    expect(entityNameWithArea(hass, "sensor.bothnames")).toBe("Kitchen · Friendly Wins");
  });
  test("no friendly_name and no registry name → prefixed entity_id (honest last resort)", () => {
    expect(entityNameWithArea(hass, "sensor.raw")).toBe("Kitchen · sensor.raw");
  });
  test("area exists but has no name → bare name", () => {
    expect(entityNameWithArea(hass, "sensor.noname")).toBe("Mystery");
  });
  test("entity has state but no registry entry → bare name", () => {
    expect(entityNameWithArea(hass, "sensor.stateonly")).toBe("State Only");
  });
  test("undefined hass → entity_id", () => {
    expect(entityNameWithArea(undefined, "sensor.flow")).toBe("sensor.flow");
  });
});
