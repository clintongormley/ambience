import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSwitchDefaults: vi.fn(async () => ({ name: "Ambience", auto_on_delay_seconds: 7200 })),
  saveSwitchDefaults: vi.fn(async () => ({ ok: true })),
  getReapplySettings: vi.fn(async () => ({ enabled: false, interval_seconds: 5400 })),
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

  test("empty-string delay value is ignored — no save", async () => {
    el = await mount();
    const input = el.shadowRoot.querySelector(
      "[data-test=defaults-delay-seconds]",
    ) as HTMLInputElement;
    input.value = "";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(mocks.saveSwitchDefaults).not.toHaveBeenCalled();
  });

  test("non-numeric delay value is ignored — no save", async () => {
    el = await mount();
    const input = el.shadowRoot.querySelector(
      "[data-test=defaults-delay-seconds]",
    ) as HTMLInputElement;
    input.value = "abc";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(mocks.saveSwitchDefaults).not.toHaveBeenCalled();
  });

  test("negative delay value is ignored — no save", async () => {
    el = await mount();
    const input = el.shadowRoot.querySelector(
      "[data-test=defaults-delay-seconds]",
    ) as HTMLInputElement;
    input.value = "-1";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(mocks.saveSwitchDefaults).not.toHaveBeenCalled();
  });

  test("successful save clears a previous error", async () => {
    mocks.getSwitchDefaults.mockRejectedValue(new Error("initial error"));
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("initial error");
    // Now fix the mock so the next save succeeds
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

  test("a rejected (negative) delay edit restores the stored value in the input", async () => {
    el = await mount();
    const input = el.shadowRoot.querySelector(
      "[data-test=defaults-delay-seconds]",
    ) as HTMLInputElement;
    input.value = "-5";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(input.value).toBe("7200");
  });

  test("loads reapply settings and shows minutes", async () => {
    mocks.getSwitchDefaults.mockResolvedValue({ name: "Ambience", auto_on_delay_seconds: 7200 });
    mocks.getReapplySettings.mockResolvedValue({ enabled: true, interval_seconds: 5400 });
    el = await mount();
    const minutes = el.shadowRoot.querySelector(
      '[data-test="reapply-interval-minutes"]',
    ) as HTMLInputElement;
    expect(minutes.value).toBe("90");
    const toggle = el.shadowRoot.querySelector('[data-test="reapply-enabled"]') as HTMLInputElement;
    expect(toggle.checked).toBe(true);
  });

  test("saves reapply settings as seconds when minutes change", async () => {
    mocks.getSwitchDefaults.mockResolvedValue({ name: "Ambience", auto_on_delay_seconds: 7200 });
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
});
