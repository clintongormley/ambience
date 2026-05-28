import { describe, test, expect, afterEach, beforeEach, vi } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  listExposedActions: vi.fn(async () => [
    { id: "light.turn_on", label: "", visible_fields: ["brightness_pct"], defaults: {} },
  ]),
  listServices: vi.fn(async () => [
    { id: "light.turn_on", description: "Turn on", target: null },
    { id: "light.turn_off", description: "Turn off", target: null },
  ]),
  getServiceSchema: vi.fn(async (_hass: unknown, service: string) => {
    if (service === "light.turn_on") {
      return {
        fields: {
          // Intentionally not alphabetical so the sort test below has bite.
          transition: { selector: { number: { min: 0 } } },
          brightness_pct: { selector: { number: { min: 0, max: 100 } } },
        },
        target: null,
      };
    }
    return { fields: {}, target: null };
  }),
  saveExposedActions: vi.fn(async () => ({ ok: true, warnings: [] })),
}));

import "../frontend/src/views/actions-settings";
import {
  listExposedActions,
  saveExposedActions,
  getServiceSchema,
} from "../frontend/src/api.js";

// Helper: finds the card-header element (now a div[data-toggle]) and clicks it to toggle expand.
function clickToggle(root: ShadowRoot) {
  const header = root.querySelector("[data-card] [data-toggle]") as HTMLElement;
  expect(header).not.toBeNull();
  header.click();
}

// Wait for all pending microtasks/timers to settle after an async action.
async function flush(el: any) {
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
}

describe("ambience-actions-settings", () => {
  let el: any;
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => el?.remove());

  async function mount() {
    el = document.createElement("ambience-actions-settings");
    el.hass = { localize: () => "" };
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    return el;
  }

  test("loads exposed actions and renders one card per entry", async () => {
    el = await mount();
    const cards = el.shadowRoot.querySelectorAll("[data-card]");
    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toContain("light.turn_on");
    expect(listExposedActions).toHaveBeenCalled();
  });

  test("cards are collapsed by default; clicking the header toggles expansion", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector("[data-card] .body")).toBeNull();
    // The header area (div[data-toggle]) is the clickable expand target.
    const header = el.shadowRoot.querySelector("[data-card] [data-toggle]") as HTMLElement;
    expect(header).not.toBeNull();
    header.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("[data-card] .body")).toBeTruthy();
  });

  test("clicking anywhere on the card header (not remove) toggles expand", async () => {
    el = await mount();
    // Click on the service id <strong> inside the header.
    const strong = el.shadowRoot.querySelector("[data-card] .card-header strong") as HTMLElement;
    expect(strong).not.toBeNull();
    strong.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("[data-card] .body")).toBeTruthy();
    // Click again to collapse.
    strong.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("[data-card] .body")).toBeNull();
  });

  test("collapsed card shows label in header when label is set", async () => {
    vi.mocked(listExposedActions).mockResolvedValueOnce([
      { id: "light.turn_on", label: "Morning lights", visible_fields: [], defaults: {} },
    ]);
    el = await mount();
    // Card is collapsed by default. The label display span should show just the label.
    const labelDisplay = el.shadowRoot.querySelector(
      "[data-card] .header-label-display",
    ) as HTMLElement;
    expect(labelDisplay).not.toBeNull();
    expect(labelDisplay.textContent).toContain("Morning lights");
  });

  test("collapsed card with no label shows empty label display", async () => {
    el = await mount();
    const labelDisplay = el.shadowRoot.querySelector(
      "[data-card] .header-label-display",
    ) as HTMLElement;
    expect(labelDisplay).not.toBeNull();
    // No label set, so display is empty (or whitespace).
    expect(labelDisplay.textContent?.trim()).toBe("");
  });

  test("expanded card shows ha-input for label editing", async () => {
    el = await mount();
    clickToggle(el.shadowRoot);
    await el.updateComplete;
    // When expanded, ha-input (data-label-input) should be present.
    const labelInput = el.shadowRoot.querySelector("[data-card] [data-label-input]") as HTMLElement;
    expect(labelInput).not.toBeNull();
    // The static label-display span should be gone when expanded.
    expect(el.shadowRoot.querySelector("[data-card] .header-label-display")).toBeNull();
  });

  test("no Save button is present in the rendered UI", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector("button[data-action='save']")).toBeNull();
  });

  test("auto-saves after checkbox toggle", async () => {
    el = await mount();
    clickToggle(el.shadowRoot);
    await el.updateComplete;

    const checkbox = el.shadowRoot.querySelector(
      "input[type='checkbox'][data-show-in-editor='transition']",
    ) as HTMLInputElement;
    expect(checkbox).not.toBeNull();
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    await flush(el);

    expect(saveExposedActions).toHaveBeenCalledWith(
      expect.anything(),
      expect.arrayContaining([
        expect.objectContaining({
          id: "light.turn_on",
          visible_fields: expect.arrayContaining(["brightness_pct", "transition"]),
        }),
      ]),
    );
  });

  test("auto-saves after unchecking checkbox", async () => {
    el = await mount();
    clickToggle(el.shadowRoot);
    await el.updateComplete;

    const checkbox = el.shadowRoot.querySelector(
      "input[type='checkbox'][data-show-in-editor='brightness_pct']",
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    await flush(el);

    expect(saveExposedActions).toHaveBeenCalledWith(
      expect.anything(),
      expect.arrayContaining([
        expect.objectContaining({
          id: "light.turn_on",
          visible_fields: expect.not.arrayContaining(["brightness_pct"]),
        }),
      ]),
    );
  });

  test("auto-saves after Save in default editor", async () => {
    vi.mocked(listExposedActions).mockResolvedValueOnce([
      {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct"],
        defaults: { brightness_pct: 50 },
      },
    ]);
    el = await mount();
    clickToggle(el.shadowRoot);
    await el.updateComplete;

    // Enter edit mode.
    const summaryBtn = el.shadowRoot.querySelector(
      "button[data-default-summary='brightness_pct']",
    ) as HTMLButtonElement;
    summaryBtn.click();
    await el.updateComplete;

    // Change the value.
    const editorInput = el.shadowRoot.querySelector(
      "input[data-default-value='brightness_pct']",
    ) as HTMLInputElement;
    editorInput.value = "75";
    editorInput.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    // Click the inner Save button — this commits the edit and auto-saves.
    const saveDefaultBtn = el.shadowRoot.querySelector(
      "button[data-save-default='brightness_pct']",
    ) as HTMLButtonElement;
    expect(saveDefaultBtn).not.toBeNull();
    saveDefaultBtn.click();
    await flush(el);

    // Edit mode should have exited.
    expect(el.shadowRoot.querySelector("input[data-default-value='brightness_pct']")).toBeNull();

    // The summary should reflect the new committed value (75).
    const summaryAfter = el.shadowRoot.querySelector(
      "button[data-default-summary='brightness_pct']",
    ) as HTMLButtonElement;
    expect(summaryAfter).not.toBeNull();
    expect(summaryAfter.textContent).toContain("75");

    expect(saveExposedActions).toHaveBeenCalledWith(
      expect.anything(),
      expect.arrayContaining([
        expect.objectContaining({
          id: "light.turn_on",
          defaults: { brightness_pct: "75" },
        }),
      ]),
    );
  });

  test("auto-saves after ✕ clear in default editor", async () => {
    // Seed an action with a pre-existing default.
    vi.mocked(listExposedActions).mockResolvedValueOnce([
      {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct"],
        defaults: { brightness_pct: 80 },
      },
    ]);
    el = await mount();
    clickToggle(el.shadowRoot);
    await el.updateComplete;

    // Enter edit mode via the compact summary button.
    const summaryBtn = el.shadowRoot.querySelector(
      "button[data-default-summary='brightness_pct']",
    ) as HTMLButtonElement;
    expect(summaryBtn).not.toBeNull();
    summaryBtn.click();
    await el.updateComplete;

    // Row 2 is now visible — the clear button should be inside it.
    const clearBtn = el.shadowRoot.querySelector(
      "button[data-clear-default='brightness_pct']",
    ) as HTMLButtonElement;
    expect(clearBtn).not.toBeNull();
    clearBtn.click();
    await flush(el);

    // Edit mode must have exited (row 2 gone).
    expect(el.shadowRoot.querySelector("input[data-default-value='brightness_pct']")).toBeNull();
    // Compact summary should also be gone (no default left).
    expect(el.shadowRoot.querySelector("button[data-default-summary='brightness_pct']")).toBeNull();
    // Set-default button should be back.
    expect(el.shadowRoot.querySelector("button[data-set-default='brightness_pct']")).not.toBeNull();

    expect(saveExposedActions).toHaveBeenCalledWith(
      expect.anything(),
      expect.arrayContaining([
        expect.objectContaining({
          id: "light.turn_on",
          defaults: {},
        }),
      ]),
    );
  });

  test("auto-saves after add service", async () => {
    el = await mount();
    const addBtn = el.shadowRoot.querySelector("button[data-action='add']") as HTMLButtonElement;
    addBtn.click();
    await el.updateComplete;

    const picker = el.shadowRoot.querySelector("select[data-add-service]") as HTMLSelectElement;
    picker.value = "light.turn_off";
    picker.dispatchEvent(new Event("change", { bubbles: true }));
    await flush(el);

    const cards = el.shadowRoot.querySelectorAll("[data-card]");
    expect(cards.length).toBe(2);
    expect(saveExposedActions).toHaveBeenCalledWith(
      expect.anything(),
      expect.arrayContaining([
        expect.objectContaining({ id: "light.turn_off" }),
      ]),
    );
  });

  test("auto-saves after remove service", async () => {
    el = await mount();
    const removeBtn = el.shadowRoot.querySelector("[data-card] button[data-remove]") as HTMLButtonElement;
    expect(removeBtn).not.toBeNull();
    removeBtn.click();
    await flush(el);

    expect(el.shadowRoot.querySelectorAll("[data-card]").length).toBe(0);
    expect(saveExposedActions).toHaveBeenCalledWith(expect.anything(), []);
  });

  test("auto-saves label change on blur, not on input", async () => {
    el = await mount();
    clickToggle(el.shadowRoot);
    await el.updateComplete;

    const labelEl = el.shadowRoot.querySelector("[data-card] [data-label-input]") as any;
    expect(labelEl).not.toBeNull();

    // Simulate typing (input event) — should NOT trigger a save yet.
    Object.defineProperty(labelEl, "value", { value: "Lights on", writable: true });
    labelEl.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(saveExposedActions).not.toHaveBeenCalled();

    // Now blur — should trigger a save.
    labelEl.dispatchEvent(new Event("blur", { bubbles: true }));
    await flush(el);

    expect(saveExposedActions).toHaveBeenCalledWith(
      expect.anything(),
      expect.arrayContaining([
        expect.objectContaining({ id: "light.turn_on", label: "Lights on" }),
      ]),
    );
  });

  test("Cancel in default editor does NOT trigger a save", async () => {
    vi.mocked(listExposedActions).mockResolvedValueOnce([
      {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct"],
        defaults: { brightness_pct: 80 },
      },
    ]);
    el = await mount();
    clickToggle(el.shadowRoot);
    await el.updateComplete;

    // Enter edit mode.
    const summaryBtn = el.shadowRoot.querySelector(
      "button[data-default-summary='brightness_pct']",
    ) as HTMLButtonElement;
    summaryBtn.click();
    await el.updateComplete;

    // Change the value in the editor.
    const editorInput = el.shadowRoot.querySelector(
      "input[data-default-value='brightness_pct']",
    ) as HTMLInputElement;
    editorInput.value = "20";
    editorInput.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    // Click Cancel.
    const cancelBtn = el.shadowRoot.querySelector(
      "button[data-cancel-default='brightness_pct']",
    ) as HTMLButtonElement;
    expect(cancelBtn).not.toBeNull();
    cancelBtn.click();
    await flush(el);

    // Edit mode should have exited.
    expect(el.shadowRoot.querySelector("input[data-default-value='brightness_pct']")).toBeNull();

    // The summary should be restored to the original value (80).
    const summaryAfter = el.shadowRoot.querySelector(
      "button[data-default-summary='brightness_pct']",
    ) as HTMLButtonElement;
    expect(summaryAfter).not.toBeNull();
    expect(summaryAfter.textContent).toContain("80");

    // No save should have been triggered.
    expect(saveExposedActions).not.toHaveBeenCalled();
  });

  test("'Set default' button reveals an editor (row 2) and writes into defaults on save", async () => {
    el = await mount();
    clickToggle(el.shadowRoot);
    await el.updateComplete;

    const setDefaultBtn = el.shadowRoot.querySelector(
      "button[data-set-default='brightness_pct']",
    ) as HTMLButtonElement;
    expect(setDefaultBtn).not.toBeNull();
    // Editor (row 2) must not exist yet.
    expect(el.shadowRoot.querySelector("input[data-default-value='brightness_pct']")).toBeNull();

    setDefaultBtn.click();
    await el.updateComplete;

    // The default-value editor (fallback input) should now be visible in row 2.
    const input = el.shadowRoot.querySelector(
      "input[data-default-value='brightness_pct']",
    ) as HTMLInputElement;
    expect(input).not.toBeNull();
    input.value = "42";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    // Click the inner Save button to commit.
    const saveDefaultBtn = el.shadowRoot.querySelector(
      "button[data-save-default='brightness_pct']",
    ) as HTMLButtonElement;
    saveDefaultBtn.click();
    await flush(el);

    expect(saveExposedActions).toHaveBeenCalledWith(
      expect.anything(),
      expect.arrayContaining([
        expect.objectContaining({
          id: "light.turn_on",
          // Field is still shown AND has a default — orthogonal axes.
          visible_fields: ["brightness_pct"],
          defaults: { brightness_pct: "42" },
        }),
      ]),
    );
  });

  test("clicking the compact default summary enters edit mode (row 2 appears)", async () => {
    // Seed with a pre-existing default so the compact summary is shown.
    vi.mocked(listExposedActions).mockResolvedValueOnce([
      {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct"],
        defaults: { brightness_pct: 80 },
      },
    ]);
    el = await mount();
    clickToggle(el.shadowRoot);
    await el.updateComplete;

    // Compact summary button should be visible; editor row should not be present.
    const summaryBtn = el.shadowRoot.querySelector(
      "button[data-default-summary='brightness_pct']",
    ) as HTMLButtonElement;
    expect(summaryBtn).not.toBeNull();
    expect(summaryBtn.textContent).toContain("80");
    expect(el.shadowRoot.querySelector("input[data-default-value='brightness_pct']")).toBeNull();

    // Click the summary to enter edit mode.
    summaryBtn.click();
    await el.updateComplete;

    // Editor row (row 2) must now be visible.
    const editorInput = el.shadowRoot.querySelector(
      "input[data-default-value='brightness_pct']",
    ) as HTMLInputElement;
    expect(editorInput).not.toBeNull();

    // Compact summary should be hidden while editing.
    expect(el.shadowRoot.querySelector("button[data-default-summary='brightness_pct']")).toBeNull();
  });

  test("clicking outside the editor row cancels — exits edit mode and reverts value", async () => {
    // Seed with a pre-existing default.
    vi.mocked(listExposedActions).mockResolvedValueOnce([
      {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct"],
        defaults: { brightness_pct: 50 },
      },
    ]);
    el = await mount();
    clickToggle(el.shadowRoot);
    await el.updateComplete;

    // Enter edit mode.
    const summaryBtn = el.shadowRoot.querySelector(
      "button[data-default-summary='brightness_pct']",
    ) as HTMLButtonElement;
    summaryBtn.click();
    await el.updateComplete;

    // Row 2 should be present.
    expect(el.shadowRoot.querySelector("input[data-default-value='brightness_pct']")).not.toBeNull();

    // Change the value in the editor.
    const editorInput = el.shadowRoot.querySelector(
      "input[data-default-value='brightness_pct']",
    ) as HTMLInputElement;
    editorInput.value = "99";
    editorInput.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    // Dispatch a pointerdown on document.body (outside the editor).
    // composedPath() in jsdom will include document.body but not the shadow element.
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
    await el.updateComplete;

    // Edit mode should have exited.
    expect(el.shadowRoot.querySelector("input[data-default-value='brightness_pct']")).toBeNull();
    // Compact summary should be restored with the ORIGINAL value (50), not 99.
    const restoredSummary = el.shadowRoot.querySelector(
      "button[data-default-summary='brightness_pct']",
    ) as HTMLButtonElement;
    expect(restoredSummary).not.toBeNull();
    expect(restoredSummary.textContent).toContain("50");
  });

  test("clicking Cancel reverts the value and exits edit mode without saving", async () => {
    vi.mocked(listExposedActions).mockResolvedValueOnce([
      {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct"],
        defaults: { brightness_pct: 80 },
      },
    ]);
    el = await mount();
    clickToggle(el.shadowRoot);
    await el.updateComplete;

    // Enter edit mode.
    const summaryBtn = el.shadowRoot.querySelector(
      "button[data-default-summary='brightness_pct']",
    ) as HTMLButtonElement;
    summaryBtn.click();
    await el.updateComplete;

    // Change the value in the editor.
    const editorInput = el.shadowRoot.querySelector(
      "input[data-default-value='brightness_pct']",
    ) as HTMLInputElement;
    editorInput.value = "20";
    editorInput.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    // Click Cancel.
    const cancelBtn = el.shadowRoot.querySelector(
      "button[data-cancel-default='brightness_pct']",
    ) as HTMLButtonElement;
    expect(cancelBtn).not.toBeNull();
    cancelBtn.click();
    await flush(el);

    // Edit mode should have exited.
    expect(el.shadowRoot.querySelector("input[data-default-value='brightness_pct']")).toBeNull();

    // The summary should be restored to the original value (80).
    const summaryAfter = el.shadowRoot.querySelector(
      "button[data-default-summary='brightness_pct']",
    ) as HTMLButtonElement;
    expect(summaryAfter).not.toBeNull();
    expect(summaryAfter.textContent).toContain("80");

    // No auto-save should have fired.
    expect(saveExposedActions).not.toHaveBeenCalled();
  });

  test("Cancel after '+ Set default' removes the field entirely (was never set)", async () => {
    // Default action has no default for brightness_pct (defaults: {}).
    el = await mount();
    clickToggle(el.shadowRoot);
    await el.updateComplete;

    // Click "+ Set default" — enters edit mode, no key added yet.
    const setDefaultBtn = el.shadowRoot.querySelector(
      "button[data-set-default='brightness_pct']",
    ) as HTMLButtonElement;
    expect(setDefaultBtn).not.toBeNull();
    setDefaultBtn.click();
    await el.updateComplete;

    // Type something — this writes into _actions via live mutation.
    const editorInput = el.shadowRoot.querySelector(
      "input[data-default-value='brightness_pct']",
    ) as HTMLInputElement;
    editorInput.value = "30";
    editorInput.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    // Click Cancel — the key should be removed entirely.
    const cancelBtn = el.shadowRoot.querySelector(
      "button[data-cancel-default='brightness_pct']",
    ) as HTMLButtonElement;
    expect(cancelBtn).not.toBeNull();
    cancelBtn.click();
    await flush(el);

    // Edit mode should have exited.
    expect(el.shadowRoot.querySelector("input[data-default-value='brightness_pct']")).toBeNull();

    // "Set default" button should be back (no default exists).
    expect(el.shadowRoot.querySelector("button[data-set-default='brightness_pct']")).not.toBeNull();
    expect(el.shadowRoot.querySelector("button[data-default-summary='brightness_pct']")).toBeNull();

    // No save should have fired (cancel path).
    expect(saveExposedActions).not.toHaveBeenCalled();
  });

  test("field-row-main has three columns: checkbox / name / summary-cell", async () => {
    vi.mocked(listExposedActions).mockResolvedValueOnce([
      {
        id: "light.turn_on",
        label: "",
        visible_fields: ["brightness_pct"],
        defaults: { brightness_pct: 50 },
      },
    ]);
    el = await mount();
    clickToggle(el.shadowRoot);
    await el.updateComplete;

    const fieldRowMain = el.shadowRoot.querySelector(".field-row-main") as HTMLElement;
    expect(fieldRowMain).not.toBeNull();

    // Expect 3 children: checkbox-cell, name, summary-cell.
    const children = Array.from(fieldRowMain.children);
    expect(children.length).toBe(3);
    expect(children[0].classList.contains("checkbox-cell")).toBe(true);
    expect(children[1].classList.contains("name")).toBe(true);
    expect(children[2].classList.contains("summary-cell")).toBe(true);

    // Enter edit mode — summary-cell stays in position 3 but shows "Editing…".
    const summaryBtn = el.shadowRoot.querySelector(
      "button[data-default-summary='brightness_pct']",
    ) as HTMLButtonElement;
    summaryBtn.click();
    await el.updateComplete;

    const childrenAfter = Array.from(fieldRowMain.children);
    expect(childrenAfter.length).toBe(3);
    expect(childrenAfter[0].classList.contains("checkbox-cell")).toBe(true);
    expect(childrenAfter[2].classList.contains("summary-cell")).toBe(true);
    expect(childrenAfter[2].textContent).toContain("Editing");
  });

  test("show-in-editor checkbox is in the leftmost column (checkbox-cell)", async () => {
    el = await mount();
    clickToggle(el.shadowRoot);
    await el.updateComplete;

    const fieldRowMain = el.shadowRoot.querySelector(".field-row-main") as HTMLElement;
    const checkboxCell = fieldRowMain.querySelector(".checkbox-cell") as HTMLElement;
    expect(checkboxCell).not.toBeNull();
    // The checkbox should be inside the checkbox-cell (first column).
    const checkbox = checkboxCell.querySelector(
      "input[type='checkbox'][data-show-in-editor]",
    ) as HTMLInputElement;
    expect(checkbox).not.toBeNull();
    // title attribute should be set for accessibility.
    expect(checkbox.getAttribute("title")).toBe("Show in rule editor");
  });

  test("a field can be hidden AND have a default (the old 'locked' mode)", async () => {
    el = await mount();
    clickToggle(el.shadowRoot);
    await el.updateComplete;

    // Uncheck brightness_pct → hidden from rule editor (auto-saves).
    const checkbox = el.shadowRoot.querySelector(
      "input[type='checkbox'][data-show-in-editor='brightness_pct']",
    ) as HTMLInputElement;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    await flush(el);

    // Set a default for brightness_pct → always sent at execution.
    const setDefaultBtn = el.shadowRoot.querySelector(
      "button[data-set-default='brightness_pct']",
    ) as HTMLButtonElement;
    setDefaultBtn.click();
    await el.updateComplete;
    const input = el.shadowRoot.querySelector(
      "input[data-default-value='brightness_pct']",
    ) as HTMLInputElement;
    input.value = "60";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    // Click inner Save to commit — triggers auto-save.
    const saveDefaultBtn = el.shadowRoot.querySelector(
      "button[data-save-default='brightness_pct']",
    ) as HTMLButtonElement;
    saveDefaultBtn.click();
    await flush(el);

    // The last saveExposedActions call should have the final state.
    const calls = vi.mocked(saveExposedActions).mock.calls;
    const lastCall = calls[calls.length - 1];
    expect(lastCall[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "light.turn_on",
          visible_fields: expect.not.arrayContaining(["brightness_pct"]),
          defaults: { brightness_pct: "60" },
        }),
      ]),
    );
  });

  test("field rows are sorted alphabetically by field id", async () => {
    el = await mount();
    clickToggle(el.shadowRoot);
    await el.updateComplete;

    // The mock schema returns fields in non-alphabetical order
    // (transition, then brightness_pct). The UI must render them
    // alphabetically (brightness_pct, then transition).
    const checkboxes = el.shadowRoot.querySelectorAll(
      "input[type='checkbox'][data-show-in-editor]",
    );
    const names = Array.from(checkboxes).map((c: any) => c.getAttribute("data-show-in-editor"));
    expect(names).toEqual(["brightness_pct", "transition"]);
  });

  test("add-service flow adds a new card for the chosen service", async () => {
    el = await mount();
    const addBtn = el.shadowRoot.querySelector("button[data-action='add']") as HTMLButtonElement;
    expect(addBtn).not.toBeNull();
    addBtn.click();
    await el.updateComplete;

    const picker = el.shadowRoot.querySelector("select[data-add-service]") as HTMLSelectElement;
    expect(picker).not.toBeNull();
    const options = Array.from(picker.options).map((o) => o.value);
    expect(options).toContain("light.turn_off");
    expect(options).not.toContain("light.turn_on");

    picker.value = "light.turn_off";
    picker.dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    const cards = el.shadowRoot.querySelectorAll("[data-card]");
    expect(cards.length).toBe(2);
    expect(getServiceSchema).toHaveBeenCalledWith(expect.anything(), "light.turn_off");
  });

  test("renders warnings returned by saveExposedActions after auto-save", async () => {
    vi.mocked(saveExposedActions).mockResolvedValueOnce({
      ok: true,
      warnings: [
        { scope_kind: "area", scope_id: "lounge", rule_name: "Evening", reason: "field removed" },
      ],
    });
    el = await mount();
    clickToggle(el.shadowRoot);
    await el.updateComplete;

    // Trigger an auto-save via checkbox toggle.
    const checkbox = el.shadowRoot.querySelector(
      "input[type='checkbox'][data-show-in-editor='brightness_pct']",
    ) as HTMLInputElement;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    await flush(el);

    const warnings = el.shadowRoot.querySelector(".warning");
    expect(warnings).not.toBeNull();
    const txt = warnings.textContent ?? "";
    expect(txt).toContain("lounge");
    expect(txt).toContain("Evening");
    expect(txt).toContain("field removed");
  });

  test("surfaces save errors inline after auto-save", async () => {
    vi.mocked(saveExposedActions).mockRejectedValueOnce(new Error("validation_error: bad"));
    el = await mount();
    clickToggle(el.shadowRoot);
    await el.updateComplete;

    // Trigger an auto-save via checkbox toggle.
    const checkbox = el.shadowRoot.querySelector(
      "input[type='checkbox'][data-show-in-editor='brightness_pct']",
    ) as HTMLInputElement;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    await flush(el);

    const err = el.shadowRoot.querySelector(".error");
    expect(err).not.toBeNull();
    expect(err.textContent).toContain("validation_error");
  });

  test("renders an error and retry button when load fails (no cards shown)", async () => {
    vi.mocked(listExposedActions).mockRejectedValueOnce(new Error("WS unavailable"));
    el = await mount();

    expect(el.shadowRoot.querySelector("[data-card]")).toBeNull();
    expect(el.shadowRoot.textContent).toContain("WS unavailable");
  });

  test("shows field name from schema when present, with raw id as secondary text", async () => {
    vi.mocked(getServiceSchema).mockResolvedValueOnce({
      fields: {
        brightness_pct: {
          name: "Brightness",
          selector: { number: { min: 0, max: 100 } },
        },
      },
      target: null,
    });
    el = await mount();
    clickToggle(el.shadowRoot);
    await el.updateComplete;

    const nameSpan = el.shadowRoot.querySelector(".field-row .name") as HTMLElement;
    expect(nameSpan).not.toBeNull();
    const text = nameSpan.textContent ?? "";
    expect(text).toContain("Brightness");
    expect(text).toContain("brightness_pct");
    const fieldIdSmall = nameSpan.querySelector("small.field-id") as HTMLElement;
    expect(fieldIdSmall).not.toBeNull();
    expect(fieldIdSmall.textContent).toContain("brightness_pct");
  });

  test("shows humanized field id when schema has no name attribute", async () => {
    el = await mount();
    clickToggle(el.shadowRoot);
    await el.updateComplete;

    const nameSpan = el.shadowRoot.querySelector(".field-row .name") as HTMLElement;
    expect(nameSpan).not.toBeNull();
    const text = nameSpan.textContent ?? "";
    expect(text).toContain("Brightness pct");
    expect(nameSpan.querySelector("small.field-id")).toBeNull();
  });

  test("dispatches ambience-exposed-actions-changed on auto-save (checkbox toggle)", async () => {
    const listener = vi.fn();
    window.addEventListener("ambience-exposed-actions-changed", listener);
    try {
      el = await mount();
      clickToggle(el.shadowRoot);
      await el.updateComplete;

      const checkbox = el.shadowRoot.querySelector(
        "input[type='checkbox'][data-show-in-editor='brightness_pct']",
      ) as HTMLInputElement;
      checkbox.checked = false;
      checkbox.dispatchEvent(new Event("change", { bubbles: true }));
      await flush(el);

      expect(listener).toHaveBeenCalledTimes(1);
    } finally {
      window.removeEventListener("ambience-exposed-actions-changed", listener);
    }
  });

  test("does not dispatch ambience-exposed-actions-changed on save error", async () => {
    vi.mocked(saveExposedActions).mockRejectedValueOnce(new Error("server error"));
    const listener = vi.fn();
    window.addEventListener("ambience-exposed-actions-changed", listener);
    try {
      el = await mount();
      clickToggle(el.shadowRoot);
      await el.updateComplete;

      const checkbox = el.shadowRoot.querySelector(
        "input[type='checkbox'][data-show-in-editor='brightness_pct']",
      ) as HTMLInputElement;
      checkbox.checked = false;
      checkbox.dispatchEvent(new Event("change", { bubbles: true }));
      await flush(el);

      expect(listener).not.toHaveBeenCalled();
    } finally {
      window.removeEventListener("ambience-exposed-actions-changed", listener);
    }
  });

  test("editing the label updates the action's label — save fires on blur", async () => {
    el = await mount();
    // Expand the card so the ha-input is visible.
    clickToggle(el.shadowRoot);
    await el.updateComplete;

    const labelEl = el.shadowRoot.querySelector("[data-card] [data-label-input]") as any;
    expect(labelEl).not.toBeNull();
    // Dispatch an input event on the ha-input element simulating a value change.
    Object.defineProperty(labelEl, "value", { value: "Lights on", writable: true });
    labelEl.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    // No save yet — only on blur.
    expect(saveExposedActions).not.toHaveBeenCalled();

    // Blur fires the auto-save.
    labelEl.dispatchEvent(new Event("blur", { bubbles: true }));
    await flush(el);

    expect(saveExposedActions).toHaveBeenCalledWith(
      expect.anything(),
      expect.arrayContaining([
        expect.objectContaining({ id: "light.turn_on", label: "Lights on" }),
      ]),
    );
  });
});
