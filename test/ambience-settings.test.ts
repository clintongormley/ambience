import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSwitchDefaults: vi.fn(async () => ({ name: "Ambience", auto_on_delay_seconds: 7200 })),
  saveSwitchDefaults: vi.fn(async () => ({ ok: true })),
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
    expect(
      (el.shadowRoot.querySelector("[data-test=defaults-name]") as HTMLInputElement).value,
    ).toBe("Ambience");
    expect(
      (el.shadowRoot.querySelector("[data-test=defaults-delay-seconds]") as HTMLInputElement).value,
    ).toBe("7200");
  });

  test("editing the default name calls saveSwitchDefaults", async () => {
    el = await mount();
    const input = el.shadowRoot.querySelector("[data-test=defaults-name]") as HTMLInputElement;
    input.value = "Master";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(mocks.saveSwitchDefaults).toHaveBeenCalledWith(expect.anything(), "Master", 7200);
  });

  test("editing the default delay calls saveSwitchDefaults", async () => {
    el = await mount();
    const input = el.shadowRoot.querySelector(
      "[data-test=defaults-delay-seconds]",
    ) as HTMLInputElement;
    input.value = "300";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(mocks.saveSwitchDefaults).toHaveBeenCalledWith(expect.anything(), "Ambience", 300);
  });

  test("no per-scope override rows are rendered", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelectorAll("[data-test=scope-row]").length).toBe(0);
  });
});
