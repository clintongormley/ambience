import { describe, test, expect, beforeEach, afterEach } from "vitest";
import "../frontend/src/ambience-frontend";

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

  test("renders two nav buttons (Areas / Settings)", () => {
    const buttons = el.shadowRoot!.querySelectorAll("nav button");
    expect(buttons.length).toBe(2);
  });

  test("defaults to the areas view", () => {
    expect(el.shadowRoot!.querySelector("ambience-scopes-view")).not.toBeNull();
  });

  test("switches to the settings view on nav click", async () => {
    const buttons = el.shadowRoot!.querySelectorAll<HTMLButtonElement>("nav button");
    buttons[1].click();
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    expect(el.shadowRoot!.querySelector("ambience-settings-view")).not.toBeNull();
  });
});
