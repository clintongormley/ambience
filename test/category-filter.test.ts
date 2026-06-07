import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import "../frontend/src/views/category-filter";
import type { SceneCategory } from "../frontend/src/types";

vi.mock("../frontend/src/api", () => ({
  listCategories: vi.fn(async () => [] as SceneCategory[]),
}));

import * as api from "../frontend/src/api";

const cats: SceneCategory[] = [
  { id: "a", name: "Alpha", color: "#f00", icon: "mdi:alpha" },
  { id: "b", name: "Beta", color: "#0f0", icon: "mdi:beta" },
];

type Filter = HTMLElement & { hass?: unknown; updateComplete: Promise<unknown> };

// Two cycles: connectedCallback resolves listCategories on a later microtask,
// then Lit needs another update to re-render with the loaded categories.
async function flush(el: Filter): Promise<void> {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
}

async function mount(categories: SceneCategory[]): Promise<Filter> {
  vi.mocked(api.listCategories).mockResolvedValue(categories);
  const el = document.createElement("ambience-category-filter") as Filter;
  el.hass = {};
  document.body.appendChild(el);
  await flush(el);
  return el;
}

describe("<ambience-category-filter>", () => {
  let el: Filter | undefined;
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => el?.remove());

  test("is defined as a custom element", () => {
    expect(customElements.get("ambience-category-filter")).toBeTypeOf("function");
  });

  test("renders nothing until categories have loaded", async () => {
    let resolve!: (v: SceneCategory[]) => void;
    vi.mocked(api.listCategories).mockReturnValue(
      new Promise<SceneCategory[]>((r) => {
        resolve = r;
      }),
    );
    el = document.createElement("ambience-category-filter") as Filter;
    el.hass = {};
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".category-filter-trigger")).toBeNull();
    expect(el.shadowRoot!.querySelector(".category-filter-add")).toBeNull();

    resolve(cats);
    await flush(el);
    expect(el.shadowRoot!.querySelector(".category-filter-trigger")).not.toBeNull();
  });

  test("with >1 category, opening the menu lists All + one option per category", async () => {
    el = await mount(cats);
    (el.shadowRoot!.querySelector(".category-filter-trigger") as HTMLButtonElement).click();
    await el.updateComplete;
    const opts = el.shadowRoot!.querySelectorAll(".category-filter-option");
    // All categories + Alpha + Beta
    expect(opts.length).toBe(3);
    expect(opts[0].textContent).toContain("All categories");
  });

  test("selecting an option emits ambience-filter-changed and closes the menu", async () => {
    el = await mount(cats);
    const events: string[] = [];
    el.addEventListener("ambience-filter-changed", (e) =>
      events.push((e as CustomEvent<{ category: string }>).detail.category),
    );
    (el.shadowRoot!.querySelector(".category-filter-trigger") as HTMLButtonElement).click();
    await el.updateComplete;
    const opts = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".category-filter-option");
    // index 1 = first real category (Alpha, id "a")
    opts[1].click();
    await el.updateComplete;
    expect(events).toEqual(["a"]);
    expect(el.shadowRoot!.querySelector(".category-filter-menu")).toBeNull();
  });

  test("the trigger reflects the current selection after choosing", async () => {
    el = await mount(cats);
    (el.shadowRoot!.querySelector(".category-filter-trigger") as HTMLButtonElement).click();
    await el.updateComplete;
    el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".category-filter-option")[2].click();
    await el.updateComplete;
    const trigger = el.shadowRoot!.querySelector(".category-filter-trigger")!;
    expect(trigger.textContent).toContain("Beta");
  });

  test("the add-category action emits ambience-open-settings and closes the menu", async () => {
    el = await mount(cats);
    const tabs: (string | undefined)[] = [];
    el.addEventListener("ambience-open-settings", (e) =>
      tabs.push((e as CustomEvent<{ tab?: string }>).detail?.tab),
    );
    (el.shadowRoot!.querySelector(".category-filter-trigger") as HTMLButtonElement).click();
    await el.updateComplete;
    (el.shadowRoot!.querySelector(".category-filter-add") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(tabs).toEqual(["ambience"]);
    expect(el.shadowRoot!.querySelector(".category-filter-menu")).toBeNull();
  });

  test("with <=1 category (loaded) it shows only the add button, no dropdown", async () => {
    el = await mount([{ id: "a", name: "Alpha" }]);
    expect(el.shadowRoot!.querySelector(".category-filter-trigger")).toBeNull();
    expect(el.shadowRoot!.querySelector(".category-filter-add")).not.toBeNull();
  });

  test("refreshes its list on the global ambience-categories-changed event", async () => {
    el = await mount([{ id: "a", name: "Alpha" }]);
    expect(el.shadowRoot!.querySelector(".category-filter-trigger")).toBeNull();
    vi.mocked(api.listCategories).mockResolvedValue(cats);
    window.dispatchEvent(new Event("ambience-categories-changed"));
    await flush(el);
    expect(el.shadowRoot!.querySelector(".category-filter-trigger")).not.toBeNull();
  });

  test("a click outside the component closes the open menu", async () => {
    el = await mount(cats);
    (el.shadowRoot!.querySelector(".category-filter-trigger") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".category-filter-menu")).not.toBeNull();
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".category-filter-menu")).toBeNull();
  });
});
