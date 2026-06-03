import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  listCategories: vi.fn(async () => [
    { id: "morning", name: "Morning" },
    { id: "blinds", name: "Blinds" },
  ]),
  saveCategories: vi.fn(async () => ({ ok: true })),
  deleteCategory: vi.fn(async () => ({ ok: true })),
}));

import "../frontend/src/views/categories-settings";
import { deleteCategory, saveCategories } from "../frontend/src/api.js";

describe("ambience-categories-settings", () => {
  let el: any;
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => el?.remove());

  async function mount() {
    el = document.createElement("ambience-categories-settings");
    el.hass = {};
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    return el;
  }

  test("renders a row per category, alphabetical by name", async () => {
    el = await mount();
    const rows = Array.from(el.shadowRoot.querySelectorAll("button.category-row")) as HTMLElement[];
    expect(rows.length).toBe(2);
    const names = rows.map((r) => r.querySelector(".row-name")!.textContent!.trim());
    // Stored [Morning, Blinds] → rendered [Blinds, Morning].
    expect(names).toEqual(["Blinds", "Morning"]);
    // Each row has an icon slot and a colour swatch.
    rows.forEach((r) => {
      expect(r.querySelector(".row-icon")).toBeTruthy();
      expect(r.querySelector(".row-swatch")).toBeTruthy();
    });
  });

  test("clicking '+ Add category' opens the modal with a blank name", async () => {
    el = await mount();
    (el.shadowRoot.querySelector("button.add") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".modal")).toBeTruthy();
    const input = el.shadowRoot.querySelector("input.name") as HTMLInputElement;
    expect(input.value).toBe("");
  });

  test("saving a valid unique name calls saveCategories and closes the modal", async () => {
    el = await mount();
    el._addCategory();
    await el.updateComplete;
    const input = el.shadowRoot.querySelector("input.name") as HTMLInputElement;
    input.value = "Evening";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    el._save();
    await el.updateComplete;
    expect(saveCategories).toHaveBeenCalledWith(expect.anything(), el._categories);
    expect(el._categories.some((g: any) => g.name === "Evening")).toBe(true);
    expect(el.shadowRoot.querySelector(".modal")).toBeFalsy();
  });

  test("a successful save fires ambience-categories-changed so views refetch", async () => {
    el = await mount();
    const seen = vi.fn();
    window.addEventListener("ambience-categories-changed", seen);
    el._addCategory();
    await el.updateComplete;
    const input = el.shadowRoot.querySelector("input.name") as HTMLInputElement;
    input.value = "Evening";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    el._save();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    expect(seen).toHaveBeenCalledTimes(1);
    window.removeEventListener("ambience-categories-changed", seen);
  });

  test("saving a blank name shows an error in the modal and does NOT save", async () => {
    el = await mount();
    el._addCategory();
    await el.updateComplete;
    el._save();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".modal-error")?.textContent).toContain("empty");
    expect(el.shadowRoot.querySelector(".modal")).toBeTruthy();
    expect(saveCategories).not.toHaveBeenCalled();
  });

  test("saving a duplicate name (case-insensitive) shows an error and does NOT save", async () => {
    el = await mount();
    el._addCategory();
    await el.updateComplete;
    const input = el.shadowRoot.querySelector("input.name") as HTMLInputElement;
    input.value = "morning"; // clashes with existing "Morning"
    input.dispatchEvent(new Event("input", { bubbles: true }));
    el._save();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".modal-error")?.textContent).toContain("same name");
    expect(saveCategories).not.toHaveBeenCalled();
  });

  test("clicking an existing category opens the modal populated with its name", async () => {
    el = await mount();
    // Chips alphabetical: [Blinds, Morning]. Click the first row (Blinds).
    const row = el.shadowRoot.querySelector("button.category-row") as HTMLButtonElement;
    row.click();
    await el.updateComplete;
    const input = el.shadowRoot.querySelector("input.name") as HTMLInputElement;
    expect(input.value).toBe("Blinds");
  });

  test("the modal Delete button calls deleteCategory with the id", async () => {
    el = await mount();
    el._openEditor({ id: "morning", name: "Morning" });
    await el.updateComplete;
    const delBtn = el.shadowRoot.querySelector("button.delete") as HTMLButtonElement;
    expect(delBtn).toBeTruthy();
    delBtn.click();
    expect(deleteCategory).toHaveBeenCalledWith(expect.anything(), "morning");
    await new Promise((r) => setTimeout(r, 0));
    expect(el._categories.map((g: any) => g.id)).toEqual(["blinds"]);
  });

  test("deleting the last category is blocked client-side with a reason", async () => {
    el = await mount();
    el._categories = [{ id: "only", name: "Only" }];
    el._openEditor({ id: "only", name: "Only" });
    await el.updateComplete;
    (el.shadowRoot.querySelector("button.delete") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".modal-error")?.textContent).toContain("last category");
    expect(deleteCategory).not.toHaveBeenCalled();
  });

  test("a server delete rejection (category in use) shows the reason and restores the category", async () => {
    // The backend rejects with a stable code; the UI localizes the in-use message.
    (deleteCategory as any).mockRejectedValueOnce({
      code: "category_in_use",
      message: "category 'blinds' still has scenes",
    });
    el = await mount();
    // ensure >1 category so the last-category guard doesn't fire
    el._categories = [
      { id: "blinds", name: "Blinds" },
      { id: "lights", name: "Lights" },
    ];
    el._openEditor({ id: "blinds", name: "Blinds" });
    await el.updateComplete;
    (el.shadowRoot.querySelector("button.delete") as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".modal-error")?.textContent).toContain("still has scenes");
    expect(el._categories.some((g: any) => g.id === "blinds")).toBe(true); // restored
  });

  test("a server delete rejection (last category, concurrent-delete race) shows the localized reason and restores", async () => {
    // Local count > 1 so the client guard doesn't fire, but the server has only
    // one left (another client deleted concurrently) and refuses with code=category_last.
    (deleteCategory as any).mockRejectedValueOnce({
      code: "category_last",
      message: "cannot delete the last category",
    });
    el = await mount();
    el._categories = [
      { id: "blinds", name: "Blinds" },
      { id: "lights", name: "Lights" },
    ];
    el._openEditor({ id: "blinds", name: "Blinds" });
    await el.updateComplete;
    (el.shadowRoot.querySelector("button.delete") as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    // The localized message (not the raw server string) must be shown.
    expect(el.shadowRoot.querySelector(".modal-error")?.textContent).toContain("You can't delete");
    expect(el._categories.some((g: any) => g.id === "blinds")).toBe(true); // restored
  });

  test("a new (unsaved) category's modal has no Delete button", async () => {
    el = await mount();
    el._addCategory();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("button.delete")).toBeFalsy();
  });

  test("selecting a colour swatch then saving persists the color id", async () => {
    el = await mount();
    el._addCategory();
    await el.updateComplete;
    const input = el.shadowRoot.querySelector("input.name") as HTMLInputElement;
    input.value = "Greens";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    const green = el.shadowRoot.querySelector('button.swatch[title="Green"]') as HTMLButtonElement;
    expect(green).toBeTruthy();
    green.click();
    await el.updateComplete;
    el._save();
    await el.updateComplete;
    const saved = el._categories.find((g: any) => g.name === "Greens");
    expect(saved.color).toBe("green");
    expect(saveCategories).toHaveBeenCalledWith(expect.anything(), el._categories);
  });

  test("clicking the overlay background closes the modal", async () => {
    el = await mount();
    el._addCategory();
    await el.updateComplete;
    const overlay = el.shadowRoot.querySelector(".overlay") as HTMLElement;
    overlay.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".modal")).toBeFalsy();
  });
});
