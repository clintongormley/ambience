import { describe, test, expect, afterEach, vi, beforeEach } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  listGroups: vi.fn(async () => ([
    { id: "morning", name: "Morning" },
    { id: "blinds", name: "Blinds" },
  ])),
  saveGroups: vi.fn(async () => ({ ok: true })),
  deleteGroup: vi.fn(async () => ({ ok: true })),
}));

import "../frontend/src/views/groups-settings";
import { saveGroups, deleteGroup } from "../frontend/src/api.js";

describe("ambience-groups-settings", () => {
  let el: any;
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => el?.remove());

  async function mount() {
    el = document.createElement("ambience-groups-settings");
    el.hass = {};
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    return el;
  }

  test("renders a row per group, alphabetical by name", async () => {
    el = await mount();
    const rows = Array.from(el.shadowRoot.querySelectorAll("button.group-row")) as HTMLElement[];
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

  test("clicking '+ Add group' opens the modal with a blank name", async () => {
    el = await mount();
    (el.shadowRoot.querySelector("button.add") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".modal")).toBeTruthy();
    const input = el.shadowRoot.querySelector("input.name") as HTMLInputElement;
    expect(input.value).toBe("");
  });

  test("saving a valid unique name calls saveGroups and closes the modal", async () => {
    el = await mount();
    el._addGroup();
    await el.updateComplete;
    const input = el.shadowRoot.querySelector("input.name") as HTMLInputElement;
    input.value = "Evening";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    el._save();
    await el.updateComplete;
    expect(saveGroups).toHaveBeenCalledWith(expect.anything(), el._groups);
    expect(el._groups.some((g: any) => g.name === "Evening")).toBe(true);
    expect(el.shadowRoot.querySelector(".modal")).toBeFalsy();
  });

  test("saving a blank name shows an error in the modal and does NOT save", async () => {
    el = await mount();
    el._addGroup();
    await el.updateComplete;
    el._save();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".modal-error")?.textContent).toContain("empty");
    expect(el.shadowRoot.querySelector(".modal")).toBeTruthy();
    expect(saveGroups).not.toHaveBeenCalled();
  });

  test("saving a duplicate name (case-insensitive) shows an error and does NOT save", async () => {
    el = await mount();
    el._addGroup();
    await el.updateComplete;
    const input = el.shadowRoot.querySelector("input.name") as HTMLInputElement;
    input.value = "morning"; // clashes with existing "Morning"
    input.dispatchEvent(new Event("input", { bubbles: true }));
    el._save();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".modal-error")?.textContent).toContain("same name");
    expect(saveGroups).not.toHaveBeenCalled();
  });

  test("clicking an existing group opens the modal populated with its name", async () => {
    el = await mount();
    // Chips alphabetical: [Blinds, Morning]. Click the first row (Blinds).
    const row = el.shadowRoot.querySelector("button.group-row") as HTMLButtonElement;
    row.click();
    await el.updateComplete;
    const input = el.shadowRoot.querySelector("input.name") as HTMLInputElement;
    expect(input.value).toBe("Blinds");
  });

  test("the modal Delete button calls deleteGroup with the id", async () => {
    el = await mount();
    el._openEditor({ id: "morning", name: "Morning" });
    await el.updateComplete;
    const delBtn = el.shadowRoot.querySelector("button.delete") as HTMLButtonElement;
    expect(delBtn).toBeTruthy();
    delBtn.click();
    expect(deleteGroup).toHaveBeenCalledWith(expect.anything(), "morning");
    await new Promise((r) => setTimeout(r, 0));
    expect(el._groups.map((g: any) => g.id)).toEqual(["blinds"]);
  });

  test("deleting the last group is blocked client-side with a reason", async () => {
    el = await mount();
    el._groups = [{ id: "only", name: "Only" }];
    el._openEditor({ id: "only", name: "Only" });
    await el.updateComplete;
    (el.shadowRoot.querySelector("button.delete") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".modal-error")?.textContent).toContain("last group");
    expect(deleteGroup).not.toHaveBeenCalled();
  });

  test("a server delete rejection (group in use) shows the reason and restores the group", async () => {
    // The backend rejects with a stable code; the UI localizes the in-use message.
    (deleteGroup as any).mockRejectedValueOnce({ code: "group_in_use", message: "group 'blinds' still has rules" });
    el = await mount();
    // ensure >1 group so the last-group guard doesn't fire
    el._groups = [{ id: "blinds", name: "Blinds" }, { id: "lights", name: "Lights" }];
    el._openEditor({ id: "blinds", name: "Blinds" });
    await el.updateComplete;
    (el.shadowRoot.querySelector("button.delete") as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".modal-error")?.textContent).toContain("still has rules");
    expect(el._groups.some((g: any) => g.id === "blinds")).toBe(true); // restored
  });

  test("a new (unsaved) group's modal has no Delete button", async () => {
    el = await mount();
    el._addGroup();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("button.delete")).toBeFalsy();
  });

  test("selecting a colour swatch then saving persists the color id", async () => {
    el = await mount();
    el._addGroup();
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
    const saved = el._groups.find((g: any) => g.name === "Greens");
    expect(saved.color).toBe("green");
    expect(saveGroups).toHaveBeenCalledWith(expect.anything(), el._groups);
  });

  test("clicking the overlay background closes the modal", async () => {
    el = await mount();
    el._addGroup();
    await el.updateComplete;
    const overlay = el.shadowRoot.querySelector(".overlay") as HTMLElement;
    overlay.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".modal")).toBeFalsy();
  });
});
