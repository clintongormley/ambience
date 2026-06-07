import type { CSSResult } from "lit";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { AmbienceFrontend } from "../frontend/src/ambience-frontend";

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

  test("renders the category filter inside the header", () => {
    expect(el.shadowRoot!.querySelector("header ambience-category-filter")).not.toBeNull();
  });

  test("renders both logo images in the DOM (CSS container query handles the swap)", () => {
    expect(el.shadowRoot!.querySelector("header img.ambience-logo")).not.toBeNull();
    expect(el.shadowRoot!.querySelector("header img.ambience-icon")).not.toBeNull();
  });

  test("logo→icon collapse breakpoint is reachable on a desktop browser window", () => {
    // The header is a container-query context and swaps the wordmark for the
    // icon below this breakpoint. HA sets the root font-size to 14px, and
    // desktop browsers refuse to shrink a window below ~500px — so a breakpoint
    // at/under 500px (≈35.7rem) can never be reached by resizing and the swap
    // would never fire on desktop. The breakpoint must sit comfortably above it.
    const cssText = (AmbienceFrontend.styles as CSSResult).cssText;
    const match = cssText.match(/@container\s*\(\s*max-width:\s*([\d.]+)rem\s*\)/);
    expect(match, "expected an @container (max-width: …rem) rule").not.toBeNull();
    const breakpointPx = Number(match![1]) * 14;
    expect(breakpointPx).toBeGreaterThan(500);
  });

  test("an ambience-filter-changed event sets the scopes-view filterCategory", async () => {
    const filter = el.shadowRoot!.querySelector("ambience-category-filter")!;
    filter.dispatchEvent(
      new CustomEvent("ambience-filter-changed", {
        detail: { category: "kitchen" },
        bubbles: true,
        composed: true,
      }),
    );
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    const scopes = el.shadowRoot!.querySelector("ambience-scopes-view") as HTMLElement & {
      filterCategory?: string;
    };
    expect(scopes.filterCategory).toBe("kitchen");
  });
});
