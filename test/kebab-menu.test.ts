import { afterEach, describe, expect, test } from "vitest";
import "../frontend/src/views/kebab-menu";
import type { KebabItem } from "../frontend/src/views/kebab-menu";

const items: KebabItem[] = [
  { id: "duplicate", label: "Duplicate", icon: "mdi:content-duplicate" },
  { id: "run", label: "Run actions", icon: "mdi:play" },
  { id: "delete", label: "Delete", icon: "mdi:delete", danger: true, dividerBefore: true },
];

async function mount(props: Record<string, unknown> = {}): Promise<any> {
  const el: any = document.createElement("ambience-kebab-menu");
  el.items = items;
  el.hass = {};
  Object.assign(el, props);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function captureEvent(el: HTMLElement, name: string) {
  let detail: any;
  el.addEventListener(name, (e: Event) => {
    detail = (e as CustomEvent).detail;
  });
  return () => detail;
}

describe("ambience-kebab-menu", () => {
  let el: any;
  afterEach(() => {
    el?.remove();
  });

  test("renders a trigger with the default aria-label", async () => {
    el = await mount();
    const trigger = el.shadowRoot.querySelector(".kebab-trigger") as HTMLButtonElement;
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute("aria-label")).toBe("More actions");
  });

  test("menu is closed until the trigger is clicked", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector(".kebab-menu")).toBeNull();
    (el.shadowRoot.querySelector(".kebab-trigger") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".kebab-menu")).toBeTruthy();
  });

  test("renders one item per entry with label and icon", async () => {
    el = await mount();
    (el.shadowRoot.querySelector(".kebab-trigger") as HTMLButtonElement).click();
    await el.updateComplete;
    const buttons = el.shadowRoot.querySelectorAll(".kebab-item");
    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent).toContain("Duplicate");
    expect(buttons[0].querySelector("ha-icon")?.getAttribute("icon")).toBe("mdi:content-duplicate");
  });

  test("selecting an item emits menu-action with its id and closes the menu", async () => {
    el = await mount();
    const get = captureEvent(el, "menu-action");
    (el.shadowRoot.querySelector(".kebab-trigger") as HTMLButtonElement).click();
    await el.updateComplete;
    (el.shadowRoot.querySelector("[data-action='run']") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(get()).toEqual({ id: "run" });
    expect(el.shadowRoot.querySelector(".kebab-menu")).toBeNull();
  });

  test("danger item carries the danger class", async () => {
    el = await mount();
    (el.shadowRoot.querySelector(".kebab-trigger") as HTMLButtonElement).click();
    await el.updateComplete;
    const del = el.shadowRoot.querySelector("[data-action='delete']") as HTMLElement;
    expect(del.classList.contains("danger")).toBe(true);
  });

  test("dividerBefore renders a separator above the item", async () => {
    el = await mount();
    (el.shadowRoot.querySelector(".kebab-trigger") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".kebab-divider")).toBeTruthy();
  });

  test("Escape closes the menu", async () => {
    el = await mount();
    (el.shadowRoot.querySelector(".kebab-trigger") as HTMLButtonElement).click();
    await el.updateComplete;
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".kebab-menu")).toBeNull();
  });

  test("backdrop click closes the menu", async () => {
    el = await mount();
    (el.shadowRoot.querySelector(".kebab-trigger") as HTMLButtonElement).click();
    await el.updateComplete;
    (el.shadowRoot.querySelector(".kebab-backdrop") as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".kebab-menu")).toBeNull();
  });

  test("custom label overrides the trigger aria-label", async () => {
    el = await mount({ label: "Rule actions" });
    const trigger = el.shadowRoot.querySelector(".kebab-trigger") as HTMLButtonElement;
    expect(trigger.getAttribute("aria-label")).toBe("Rule actions");
  });

  test("empty items does not throw and renders no menu items", async () => {
    el = await mount({ items: [] });
    (el.shadowRoot.querySelector(".kebab-trigger") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll(".kebab-item").length).toBe(0);
  });

  test("menu-action bubbles and is composed (reaches an ancestor)", async () => {
    const parent = document.createElement("div");
    document.body.appendChild(parent);
    const inner: any = document.createElement("ambience-kebab-menu");
    inner.items = items;
    inner.hass = {};
    parent.appendChild(inner);
    await inner.updateComplete;
    let detail: any;
    let composed = false;
    parent.addEventListener("menu-action", (e: Event) => {
      detail = (e as CustomEvent).detail;
      composed = (e as CustomEvent).composed;
    });
    (inner.shadowRoot.querySelector(".kebab-trigger") as HTMLButtonElement).click();
    await inner.updateComplete;
    (inner.shadowRoot.querySelector("[data-action='duplicate']") as HTMLButtonElement).click();
    expect(detail).toEqual({ id: "duplicate" });
    expect(composed).toBe(true);
    parent.remove();
  });

  test("opening the menu flips the trigger's aria-expanded to true", async () => {
    el = await mount();
    const trigger = el.shadowRoot.querySelector(".kebab-trigger") as HTMLButtonElement;
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    trigger.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".kebab-trigger")?.getAttribute("aria-expanded")).toBe(
      "true",
    );
  });
});
