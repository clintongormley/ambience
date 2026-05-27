import { describe, test, expect, afterEach, beforeEach, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSwitchDefaults: vi.fn(async () => ({ name: "Ambience", auto_on_delay_seconds: 7200 })),
  saveSwitchDefaults: vi.fn(async () => ({ ok: true })),
  listAreas: vi.fn(async () => [
    { area_id: "a1", name: "Living Room" },
    { area_id: "a2", name: "Kitchen" },
  ]),
  listFloors: vi.fn(async () => [
    { floor_id: "f1", name: "Upstairs" },
  ]),
  getArea: vi.fn(async (_h: any, id: string) =>
    id === "a2"
      ? { rules: [], auto_sort: true, switch: { name: "Kitchen lights", auto_on_delay_seconds: 1800, off_at: null } }
      : { rules: [], auto_sort: true },
  ),
  getFloor: vi.fn(async () => ({ rules: [], auto_sort: true })),
  getHouse: vi.fn(async () => ({ rules: [], auto_sort: true })),
  saveHouseSwitch: vi.fn(async () => ({ ok: true })),
  saveFloorSwitch: vi.fn(async () => ({ ok: true })),
  saveAreaSwitch: vi.fn(async () => ({ ok: true })),
}));

vi.mock("../frontend/src/api.js", () => mocks);

import "../frontend/src/views/ambience-settings";

describe("ambience-ambience-settings", () => {
  let el: any;
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => el?.remove());

  async function mount() {
    el = document.createElement("ambience-ambience-settings");
    el.hass = {};
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    return el;
  }

  test("shows defaults from the backend", async () => {
    el = await mount();
    expect((el.shadowRoot.querySelector("[data-test=defaults-name]") as HTMLInputElement).value).toBe("Ambience");
    expect((el.shadowRoot.querySelector("[data-test=defaults-delay-seconds]") as HTMLInputElement).value).toBe("7200");
  });

  test("editing defaults calls saveSwitchDefaults", async () => {
    el = await mount();
    const input = el.shadowRoot.querySelector("[data-test=defaults-name]") as HTMLInputElement;
    input.value = "Master";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(mocks.saveSwitchDefaults).toHaveBeenCalledWith(expect.anything(), "Master", 7200);
  });

  test("renders one row per scope (House + 1 floor + 2 areas)", async () => {
    el = await mount();
    const rows = el.shadowRoot.querySelectorAll("[data-test=scope-row]");
    expect(rows.length).toBe(4);
    expect(rows[0].textContent).toContain("Global");
    expect(rows[1].textContent).toContain("Upstairs");
    // Areas sorted alphabetically: Kitchen, Living Room
    expect(rows[2].textContent).toContain("Kitchen");
    expect(rows[2].textContent).toContain("Overridden");
    expect(rows[3].textContent).toContain("Living Room");
    expect(rows[3].textContent).toContain("Using defaults");
  });

  test("reset on overridden area row sends nulls via saveAreaSwitch", async () => {
    el = await mount();
    const rows = el.shadowRoot.querySelectorAll("[data-test=scope-row]");
    // Kitchen is the overridden row (index 2)
    (rows[2].querySelector("[data-test=expand]") as HTMLElement).click();
    await el.updateComplete;
    (el.shadowRoot.querySelector("[data-test=reset-area-a2]") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(mocks.saveAreaSwitch).toHaveBeenCalledWith(expect.anything(), "a2", null, null);
  });

  test("editing house row calls saveHouseSwitch", async () => {
    el = await mount();
    const rows = el.shadowRoot.querySelectorAll("[data-test=scope-row]");
    (rows[0].querySelector("[data-test=expand]") as HTMLElement).click();
    await el.updateComplete;
    const input = el.shadowRoot.querySelector("[data-test=override-name-house]") as HTMLInputElement;
    input.value = "All";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(mocks.saveHouseSwitch).toHaveBeenCalledWith(expect.anything(), "All", null);
  });

  test("editing floor row calls saveFloorSwitch", async () => {
    el = await mount();
    const rows = el.shadowRoot.querySelectorAll("[data-test=scope-row]");
    (rows[1].querySelector("[data-test=expand]") as HTMLElement).click();
    await el.updateComplete;
    const input = el.shadowRoot.querySelector("[data-test=override-name-floor-f1]") as HTMLInputElement;
    input.value = "Upstairs lights";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(mocks.saveFloorSwitch).toHaveBeenCalledWith(expect.anything(), "f1", "Upstairs lights", null);
  });
});
