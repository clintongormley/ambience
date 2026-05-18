/**
 * Tests for ambience-scene-combobox — the fallback path (ha-form not registered in jsdom).
 */
import { describe, test, expect, afterEach } from "vitest";
import "../frontend/src/views/scene-combobox";

async function mount(value: string | null = null, suggestions: string[] = []): Promise<any> {
  const el: any = document.createElement("ambience-scene-combobox");
  el.value = value;
  el.suggestions = suggestions;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function captureEvent(el: HTMLElement, name: string) {
  let detail: any;
  el.addEventListener(name, (e: Event) => { detail = (e as CustomEvent).detail; });
  return () => detail;
}

describe("ambience-scene-combobox (fallback mode — ha-form not registered)", () => {
  let el: any;
  afterEach(() => { el?.remove(); });

  test("renders a text input in fallback mode", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector("input[type='text']")).toBeTruthy();
  });

  test("text input shows current value", async () => {
    el = await mount("movie");
    const input = el.shadowRoot.querySelector("input[type='text']") as HTMLInputElement;
    expect(input.value).toBe("movie");
  });

  test("typing in the input emits value-changed", async () => {
    el = await mount();
    const get = captureEvent(el, "value-changed");

    const input = el.shadowRoot.querySelector("input[type='text']") as HTMLInputElement;
    input.value = "relax";
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));

    expect(get()?.value).toBe("relax");
  });

  test("clearing the input emits null", async () => {
    el = await mount("movie");
    const get = captureEvent(el, "value-changed");

    const input = el.shadowRoot.querySelector("input[type='text']") as HTMLInputElement;
    input.value = "  ";
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));

    expect(get()?.value).toBeNull();
  });

  test("focusing the input opens the dropdown", async () => {
    el = await mount(null, ["movie", "relax"]);
    const input = el.shadowRoot.querySelector("input[type='text']") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    await el.updateComplete;

    expect(el.shadowRoot.querySelector(".menu")).toBeTruthy();
  });

  test("suggestions are listed in the dropdown when open", async () => {
    el = await mount(null, ["movie", "relax"]);
    const input = el.shadowRoot.querySelector("input[type='text']") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    await el.updateComplete;

    const items = el.shadowRoot.querySelectorAll(".item");
    expect(items.length).toBe(2);
    expect(items[0].textContent.trim()).toBe("movie");
    expect(items[1].textContent.trim()).toBe("relax");
  });

  test("'No scenes yet' message when open with no suggestions", async () => {
    el = await mount(null, []);
    const input = el.shadowRoot.querySelector("input[type='text']") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    await el.updateComplete;

    expect(el.shadowRoot.querySelector(".empty")).toBeTruthy();
    expect(el.shadowRoot.textContent).toContain("No scenes yet");
  });

  test("clicking a suggestion emits its value and closes dropdown", async () => {
    el = await mount(null, ["movie"]);
    const get = captureEvent(el, "value-changed");

    const input = el.shadowRoot.querySelector("input[type='text']") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    await el.updateComplete;

    const item = el.shadowRoot.querySelector(".item") as HTMLElement;
    item.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await el.updateComplete;

    expect(get()?.value).toBe("movie");
    expect(el.shadowRoot.querySelector(".menu")).toBeFalsy();
  });

  test("Escape key closes dropdown", async () => {
    el = await mount(null, ["movie"]);
    const input = el.shadowRoot.querySelector("input[type='text']") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".menu")).toBeTruthy();

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".menu")).toBeFalsy();
  });

  test("toggle button opens/closes dropdown", async () => {
    el = await mount(null, ["movie"]);
    const toggle = el.shadowRoot.querySelector("button.toggle") as HTMLButtonElement;
    toggle.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".menu")).toBeTruthy();

    toggle.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".menu")).toBeFalsy();
  });

  test("selected suggestion gets selected class", async () => {
    el = await mount("movie", ["movie", "relax"]);
    const input = el.shadowRoot.querySelector("input[type='text']") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    await el.updateComplete;

    const items = el.shadowRoot.querySelectorAll(".item");
    expect(items[0].classList.contains("selected")).toBe(true);
    expect(items[1].classList.contains("selected")).toBe(false);
  });

  test("document mousedown outside closes dropdown", async () => {
    el = await mount(null, ["movie"]);
    const input = el.shadowRoot.querySelector("input[type='text']") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".menu")).toBeTruthy();

    // Mousedown outside the element
    document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".menu")).toBeFalsy();
  });

  test("connectedCallback starts listening for document mousedown", async () => {
    el = await mount();
    // verify we can remove and re-add without error
    el.remove();
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("input[type='text']")).toBeTruthy();
  });

  test("willUpdate rebuilds schema when suggestions change", async () => {
    el = await mount(null, ["movie"]);
    // Change suggestions
    el.suggestions = ["relax", "focus"];
    await el.updateComplete;
    // Schema should now reflect the new suggestions
    expect(el._schema[0].selector.select.options.length).toBe(2);
    expect(el._schema[0].selector.select.options[0].value).toBe("relax");
  });
});
