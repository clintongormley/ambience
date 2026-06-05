import { afterEach, beforeEach, describe, expect, test } from "vitest";
import "../frontend/src/ambience-frontend";

type SettingsModal = HTMLElement & { open: boolean };

const hass = {
  states: {},
  connection: {
    subscribeMessage: async () => () => {},
    sendMessagePromise: async () => ({}),
    subscribeEvents: async () => () => {},
  },
  themes: { darkMode: false },
  localize: () => "",
  language: "en",
} as unknown as Record<string, unknown>;

describe("<ambience-frontend>", () => {
  let el: HTMLElement & { hass?: unknown };

  beforeEach(async () => {
    el = document.createElement("ambience-frontend") as HTMLElement & { hass?: unknown };
    el.hass = hass;
    document.body.appendChild(el);
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
  });

  afterEach(() => el?.remove());

  test("is defined as a custom element", () => {
    expect(customElements.get("ambience-frontend")).toBeTypeOf("function");
  });

  test("renders a single cogwheel settings button and no nav tabs", () => {
    expect(el.shadowRoot!.querySelectorAll("nav button").length).toBe(0);
    const cog = el.shadowRoot!.querySelector(".settings-btn ha-icon");
    expect(cog).not.toBeNull();
    expect(cog!.getAttribute("icon")).toBe("mdi:cog");
  });

  test("always renders the areas view", () => {
    expect(el.shadowRoot!.querySelector("ambience-scopes-view")).not.toBeNull();
  });

  test("settings modal is closed by default", () => {
    const modal = el.shadowRoot!.querySelector<SettingsModal>("ambience-settings-modal");
    expect(modal === null || !modal.open).toBe(true);
  });

  test("clicking the cogwheel opens the settings modal", async () => {
    el.shadowRoot!.querySelector<HTMLButtonElement>(".settings-btn")!.click();
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    const modal = el.shadowRoot!.querySelector<SettingsModal>("ambience-settings-modal");
    expect(modal).not.toBeNull();
    expect(modal!.open).toBe(true);
  });

  test("an ambience-open-settings event opens the modal on the requested tab", async () => {
    const scopes = el.shadowRoot!.querySelector("ambience-scopes-view")!;
    scopes.dispatchEvent(
      new CustomEvent("ambience-open-settings", {
        detail: { tab: "actions" },
        bubbles: true,
        composed: true,
      }),
    );
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    const modal = el.shadowRoot!.querySelector<SettingsModal & { initialTab?: string }>(
      "ambience-settings-modal",
    )!;
    expect(modal.open).toBe(true);
    expect(modal.initialTab).toBe("actions");
  });

  test("a close event from the modal dismisses it", async () => {
    el.shadowRoot!.querySelector<HTMLButtonElement>(".settings-btn")!.click();
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    const modal = el.shadowRoot!.querySelector("ambience-settings-modal")!;
    modal.dispatchEvent(new CustomEvent("close", { bubbles: true, composed: true }));
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    const after = el.shadowRoot!.querySelector<SettingsModal>("ambience-settings-modal");
    expect(after === null || !after.open).toBe(true);
  });
});
