import { describe, test, expect, vi, beforeEach } from "vitest";

// Mock the lazy loader so importing the card never pulls in the heavy chunk.
vi.mock("../frontend/src/lazy-frontend", () => ({
  loadFrontend: vi.fn().mockResolvedValue(undefined),
}));

import { loadFrontend } from "../frontend/src/lazy-frontend";
import "../frontend/src/card";

describe("<ambience-card>", () => {
  beforeEach(() => {
    vi.mocked(loadFrontend).mockClear();
  });

  test("registers a customCards entry of type ambience-card", () => {
    const cards = (window as unknown as { customCards: Array<{ type: string }> }).customCards;
    expect(cards.some((c) => c.type === "ambience-card")).toBe(true);
  });

  test("defines the <ambience-card> element but NOT the heavy <ambience-frontend>", () => {
    expect(customElements.get("ambience-card")).toBeTypeOf("function");
    expect(customElements.get("ambience-frontend")).toBeUndefined();
  });

  test("setConfig triggers the lazy load and appends an <ambience-frontend> child", async () => {
    const el = document.createElement("ambience-card") as HTMLElement & {
      setConfig: (c: object) => void;
    };
    document.body.appendChild(el);
    el.setConfig({ type: "custom:ambience-card" });
    await Promise.resolve();
    await Promise.resolve();
    expect(loadFrontend).toHaveBeenCalled();
    expect(el.querySelector("ambience-frontend")).not.toBeNull();
  });

  test("forwards hass to the inner element once created", async () => {
    const el = document.createElement("ambience-card") as HTMLElement & {
      setConfig: (c: object) => void;
      hass: unknown;
    };
    document.body.appendChild(el);
    el.setConfig({ type: "custom:ambience-card" });
    await Promise.resolve();
    await Promise.resolve();
    const fake = { foo: 1 };
    el.hass = fake;
    const inner = el.querySelector("ambience-frontend") as HTMLElement & { hass?: unknown };
    expect(inner.hass).toBe(fake);
  });

  test("applies hass set before setConfig once the inner element is created", async () => {
    const el = document.createElement("ambience-card") as HTMLElement & {
      setConfig: (c: object) => void;
      hass: unknown;
    };
    const fake = { foo: 2 };
    el.hass = fake;                     // set BEFORE setConfig
    document.body.appendChild(el);
    el.setConfig({ type: "custom:ambience-card" });
    await Promise.resolve();
    await Promise.resolve();
    const inner = el.querySelector("ambience-frontend") as HTMLElement & { hass?: unknown };
    expect(inner.hass).toBe(fake);
  });

  test("renders as a block so it fills its dashboard cell (not inline)", () => {
    const el = document.createElement("ambience-card") as HTMLElement;
    document.body.appendChild(el);
    expect(el.style.display).toBe("block");
  });

  test("drops the reading-column width cap so it fills its cell", () => {
    const el = document.createElement("ambience-card") as HTMLElement;
    document.body.appendChild(el);
    expect(el.style.getPropertyValue("--ambience-content-max-width")).toBe("none");
  });

  test("getStubConfig returns an object and getCardSize returns a number", () => {
    const Ctor = customElements.get("ambience-card") as unknown as {
      getStubConfig: () => object;
    };
    expect(Ctor.getStubConfig()).toEqual({});
    const el = document.createElement("ambience-card") as HTMLElement & { getCardSize: () => number };
    expect(el.getCardSize()).toBe(12);
  });
});
