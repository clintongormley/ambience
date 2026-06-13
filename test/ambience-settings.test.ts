import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSwitchDefaults: vi.fn(async () => ({
    name: "Ambience",
    auto_on_delay_seconds: 0,
    create_switches: false,
  })),
  saveSwitchDefaults: vi.fn(async () => ({ ok: true })),
  getReapplySettings: vi.fn(async () => ({ enabled: false, interval_seconds: 3600 })),
  saveReapplySettings: vi.fn(async () => ({ ok: true })),
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
    // pause-for is now shown in minutes (0 seconds → "0" minutes)
    expect(
      (el.shadowRoot.querySelector("[data-test=pause-for-minutes]") as HTMLInputElement).value,
    ).toBe("0");
  });

  test("editing the default name calls saveSwitchDefaults", async () => {
    el = await mount();
    const input = el.shadowRoot.querySelector("[data-test=defaults-name]") as HTMLInputElement;
    input.value = "Master";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(mocks.saveSwitchDefaults).toHaveBeenCalledWith(expect.anything(), "Master", 0, false);
  });

  test("editing the pause-for minutes calls saveSwitchDefaults with seconds", async () => {
    mocks.getSwitchDefaults.mockResolvedValue({
      name: "Ambience",
      auto_on_delay_seconds: 0,
      create_switches: true,
    });
    el = await mount();
    const input = el.shadowRoot.querySelector("[data-test=pause-for-minutes]") as HTMLInputElement;
    input.value = "5";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(mocks.saveSwitchDefaults).toHaveBeenCalledWith(expect.anything(), "Ambience", 300, true);
  });

  test("no per-scope override rows are rendered", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelectorAll("[data-test=scope-row]").length).toBe(0);
  });

  // ── missing-branch coverage ────────────────────────────────────────────────

  test("shows error paragraph when getSwitchDefaults rejects", async () => {
    mocks.getSwitchDefaults.mockRejectedValue(new Error("network error"));
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("network error");
  });

  test("shows stringified error when getSwitchDefaults rejects with a non-Error", async () => {
    mocks.getSwitchDefaults.mockRejectedValue("plain string error");
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("plain string error");
  });

  test("shows stringified error when save rejects with a non-Error", async () => {
    mocks.getSwitchDefaults.mockResolvedValue({
      name: "Ambience",
      auto_on_delay_seconds: 0,
      create_switches: true,
    });
    el = await mount();
    mocks.saveSwitchDefaults.mockRejectedValue(42);
    const input = el.shadowRoot.querySelector("[data-test=defaults-name]") as HTMLInputElement;
    input.value = "Trigger";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.textContent).toContain("42");
  });

  test("shows error paragraph when save rejects", async () => {
    mocks.getSwitchDefaults.mockResolvedValue({
      name: "Ambience",
      auto_on_delay_seconds: 0,
      create_switches: true,
    });
    el = await mount();
    mocks.saveSwitchDefaults.mockRejectedValue(new Error("save failed"));
    const input = el.shadowRoot.querySelector("[data-test=defaults-name]") as HTMLInputElement;
    input.value = "New Name";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.textContent).toContain("save failed");
  });

  test("empty-string name is ignored — no save, no update", async () => {
    el = await mount();
    const input = el.shadowRoot.querySelector("[data-test=defaults-name]") as HTMLInputElement;
    input.value = "";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    // saveSwitchDefaults should not have been called (only getSwitchDefaults on mount)
    expect(mocks.saveSwitchDefaults).not.toHaveBeenCalled();
  });

  test("whitespace-only name is ignored — no save", async () => {
    el = await mount();
    const input = el.shadowRoot.querySelector("[data-test=defaults-name]") as HTMLInputElement;
    input.value = "   ";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(mocks.saveSwitchDefaults).not.toHaveBeenCalled();
  });

  test("empty-string pause-for value is ignored — no save", async () => {
    mocks.getSwitchDefaults.mockResolvedValue({
      name: "Ambience",
      auto_on_delay_seconds: 0,
      create_switches: true,
    });
    el = await mount();
    const input = el.shadowRoot.querySelector("[data-test=pause-for-minutes]") as HTMLInputElement;
    input.value = "";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(mocks.saveSwitchDefaults).not.toHaveBeenCalled();
  });

  test("non-numeric pause-for value is ignored — no save", async () => {
    mocks.getSwitchDefaults.mockResolvedValue({
      name: "Ambience",
      auto_on_delay_seconds: 0,
      create_switches: true,
    });
    el = await mount();
    const input = el.shadowRoot.querySelector("[data-test=pause-for-minutes]") as HTMLInputElement;
    input.value = "abc";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(mocks.saveSwitchDefaults).not.toHaveBeenCalled();
  });

  test("negative pause-for value is ignored — no save", async () => {
    mocks.getSwitchDefaults.mockResolvedValue({
      name: "Ambience",
      auto_on_delay_seconds: 0,
      create_switches: true,
    });
    el = await mount();
    const input = el.shadowRoot.querySelector("[data-test=pause-for-minutes]") as HTMLInputElement;
    input.value = "-1";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(mocks.saveSwitchDefaults).not.toHaveBeenCalled();
  });

  test("successful save clears a previous error", async () => {
    mocks.getSwitchDefaults.mockRejectedValue(new Error("initial error"));
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("initial error");
    // Now fix the mock so the next save succeeds; also need create_switches=true so input is enabled
    mocks.getSwitchDefaults.mockResolvedValue({
      name: "Ambience",
      auto_on_delay_seconds: 0,
      create_switches: true,
    });
    mocks.saveSwitchDefaults.mockResolvedValue({ ok: true });
    const input = el.shadowRoot.querySelector("[data-test=defaults-name]") as HTMLInputElement;
    input.value = "Fixed";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("p")).toBeFalsy();
  });

  test("a rejected (empty) name edit restores the stored value in the input", async () => {
    el = await mount();
    const input = el.shadowRoot.querySelector("[data-test=defaults-name]") as HTMLInputElement;
    input.value = "   ";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    // The edit is rejected; the input must not keep showing the rejected text
    // while the stored value silently stays "Ambience".
    expect(input.value).toBe("Ambience");
  });

  test("a rejected (negative) pause-for edit restores the stored minutes in the input", async () => {
    mocks.getSwitchDefaults.mockResolvedValue({
      name: "Ambience",
      auto_on_delay_seconds: 120,
      create_switches: true,
    });
    el = await mount();
    const input = el.shadowRoot.querySelector("[data-test=pause-for-minutes]") as HTMLInputElement;
    input.value = "-5";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(input.value).toBe("2"); // 120 seconds = 2 minutes
  });

  test("loads reapply settings and shows minutes", async () => {
    mocks.getSwitchDefaults.mockResolvedValue({
      name: "Ambience",
      auto_on_delay_seconds: 0,
      create_switches: false,
    });
    mocks.getReapplySettings.mockResolvedValue({ enabled: true, interval_seconds: 5400 });
    el = await mount();
    const minutes = el.shadowRoot.querySelector(
      '[data-test="reapply-interval-minutes"]',
    ) as HTMLInputElement;
    expect(minutes.value).toBe("90");
    const toggle = el.shadowRoot.querySelector('[data-test="reapply-enabled"]') as HTMLInputElement;
    expect(toggle.checked).toBe(true);
  });

  test("toggling the reapply switch saves enabled=true", async () => {
    mocks.getSwitchDefaults.mockResolvedValue({
      name: "Ambience",
      auto_on_delay_seconds: 0,
      create_switches: false,
    });
    mocks.getReapplySettings.mockResolvedValue({ enabled: false, interval_seconds: 3600 });
    el = await mount();
    const toggle = el.shadowRoot.querySelector('[data-test="reapply-enabled"]') as HTMLInputElement;
    toggle.checked = true;
    toggle.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(mocks.saveReapplySettings).toHaveBeenCalledWith(expect.anything(), true, 3600);
  });

  test("saves reapply settings as seconds when minutes change", async () => {
    mocks.getSwitchDefaults.mockResolvedValue({
      name: "Ambience",
      auto_on_delay_seconds: 0,
      create_switches: false,
    });
    mocks.getReapplySettings.mockResolvedValue({ enabled: true, interval_seconds: 5400 });
    el = await mount();
    const minutes = el.shadowRoot.querySelector(
      '[data-test="reapply-interval-minutes"]',
    ) as HTMLInputElement;
    minutes.value = "120";
    minutes.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(mocks.saveReapplySettings).toHaveBeenCalledWith(expect.anything(), true, 7200);
  });

  // ── Task 7: new tests ──────────────────────────────────────────────────────

  test("toggling the pause switch saves create_switches", async () => {
    el = await mount();
    // default: create_switches=false
    const toggle = el.shadowRoot.querySelector(
      '[data-test="pause-switch-enabled"]',
    ) as HTMLInputElement;
    expect(toggle).not.toBeNull();
    toggle.checked = true;
    toggle.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(mocks.saveSwitchDefaults).toHaveBeenCalledWith(expect.anything(), "Ambience", 0, true);
  });

  test("pause-for shows minutes and name/pause-for disabled when toggle off", async () => {
    el = await mount();
    // create_switches=false → inputs disabled
    const minutes = el.shadowRoot.querySelector(
      '[data-test="pause-for-minutes"]',
    ) as HTMLInputElement;
    expect(minutes.value).toBe("0");
    expect(minutes.disabled).toBe(true);
    expect(
      (el.shadowRoot.querySelector('[data-test="defaults-name"]') as HTMLInputElement).disabled,
    ).toBe(true);
  });

  test("name and pause-for enabled when create_switches is true", async () => {
    mocks.getSwitchDefaults.mockResolvedValue({
      name: "Ambience",
      auto_on_delay_seconds: 300,
      create_switches: true,
    });
    el = await mount();
    const minutes = el.shadowRoot.querySelector(
      '[data-test="pause-for-minutes"]',
    ) as HTMLInputElement;
    expect(minutes.value).toBe("5");
    expect(minutes.disabled).toBe(false);
    expect(
      (el.shadowRoot.querySelector('[data-test="defaults-name"]') as HTMLInputElement).disabled,
    ).toBe(false);
  });

  test("reapply-interval disabled when reapply toggle off", async () => {
    mocks.getReapplySettings.mockResolvedValue({ enabled: false, interval_seconds: 3600 });
    el = await mount();
    const interval = el.shadowRoot.querySelector(
      '[data-test="reapply-interval-minutes"]',
    ) as HTMLInputElement;
    expect(interval.disabled).toBe(true);
  });

  test("reapply-interval enabled when reapply is enabled", async () => {
    mocks.getReapplySettings.mockResolvedValue({ enabled: true, interval_seconds: 3600 });
    el = await mount();
    const interval = el.shadowRoot.querySelector(
      '[data-test="reapply-interval-minutes"]',
    ) as HTMLInputElement;
    expect(interval.disabled).toBe(false);
  });
});
