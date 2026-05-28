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

  test("cards are collapsed by default; clicking the toggle expands them", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector("[data-card] .body")).toBeNull();
    const toggle = el.shadowRoot.querySelector("[data-card] button[data-toggle]") as HTMLButtonElement;
    expect(toggle).not.toBeNull();
    toggle.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("[data-card] .body")).toBeTruthy();
  });

  test("calls saveExposedActions when save clicked, with current state (new shape)", async () => {
    el = await mount();
    const saveBtn = el.shadowRoot.querySelector("button[data-action='save']") as HTMLButtonElement;
    expect(saveBtn).not.toBeNull();
    saveBtn.click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(saveExposedActions).toHaveBeenCalledWith(
      expect.anything(),
      expect.arrayContaining([
        expect.objectContaining({
          id: "light.turn_on",
          visible_fields: ["brightness_pct"],
          defaults: {},
        }),
      ]),
    );
  });

  test("ticking 'Show in editor' adds the field to visible_fields", async () => {
    el = await mount();
    const toggle = el.shadowRoot.querySelector("[data-card] button[data-toggle]") as HTMLButtonElement;
    toggle.click();
    await el.updateComplete;

    // The `transition` field starts hidden (visible_fields only has brightness_pct).
    const checkbox = el.shadowRoot.querySelector(
      "input[type='checkbox'][data-show-in-editor='transition']",
    ) as HTMLInputElement;
    expect(checkbox).not.toBeNull();
    expect(checkbox.checked).toBe(false);
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;

    const saveBtn = el.shadowRoot.querySelector("button[data-action='save']") as HTMLButtonElement;
    saveBtn.click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

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

  test("unchecking 'Show in editor' removes the field from visible_fields", async () => {
    el = await mount();
    const toggle = el.shadowRoot.querySelector("[data-card] button[data-toggle]") as HTMLButtonElement;
    toggle.click();
    await el.updateComplete;

    const checkbox = el.shadowRoot.querySelector(
      "input[type='checkbox'][data-show-in-editor='brightness_pct']",
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;

    const saveBtn = el.shadowRoot.querySelector("button[data-action='save']") as HTMLButtonElement;
    saveBtn.click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

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

  test("'Set default' button reveals an editor (row 2) and writes into defaults", async () => {
    el = await mount();
    const toggle = el.shadowRoot.querySelector("[data-card] button[data-toggle]") as HTMLButtonElement;
    toggle.click();
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

    const saveBtn = el.shadowRoot.querySelector("button[data-action='save']") as HTMLButtonElement;
    saveBtn.click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

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
    const toggle = el.shadowRoot.querySelector("[data-card] button[data-toggle]") as HTMLButtonElement;
    toggle.click();
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

  test("clear-default ✕ inside row 2 removes the default AND exits edit mode", async () => {
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
    const toggle = el.shadowRoot.querySelector("[data-card] button[data-toggle]") as HTMLButtonElement;
    toggle.click();
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
    await el.updateComplete;

    // Edit mode must have exited (row 2 gone).
    expect(el.shadowRoot.querySelector("input[data-default-value='brightness_pct']")).toBeNull();
    // Compact summary should also be gone (no default left).
    expect(el.shadowRoot.querySelector("button[data-default-summary='brightness_pct']")).toBeNull();
    // Set-default button should be back.
    expect(el.shadowRoot.querySelector("button[data-set-default='brightness_pct']")).not.toBeNull();

    const saveBtn = el.shadowRoot.querySelector("button[data-action='save']") as HTMLButtonElement;
    saveBtn.click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

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

  test("clicking outside the editor row exits edit mode (row 2 disappears)", async () => {
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
    const toggle = el.shadowRoot.querySelector("[data-card] button[data-toggle]") as HTMLButtonElement;
    toggle.click();
    await el.updateComplete;

    // Enter edit mode.
    const summaryBtn = el.shadowRoot.querySelector(
      "button[data-default-summary='brightness_pct']",
    ) as HTMLButtonElement;
    summaryBtn.click();
    await el.updateComplete;

    // Row 2 should be present.
    expect(el.shadowRoot.querySelector("input[data-default-value='brightness_pct']")).not.toBeNull();

    // Dispatch a pointerdown on document.body (outside the editor).
    // composedPath() in jsdom will include document.body but not the shadow element.
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
    await el.updateComplete;

    // Edit mode should have exited.
    expect(el.shadowRoot.querySelector("input[data-default-value='brightness_pct']")).toBeNull();
    // Compact summary should be restored.
    expect(el.shadowRoot.querySelector("button[data-default-summary='brightness_pct']")).not.toBeNull();
  });

  test("a field can be hidden AND have a default (the old 'locked' mode)", async () => {
    el = await mount();
    const toggle = el.shadowRoot.querySelector("[data-card] button[data-toggle]") as HTMLButtonElement;
    toggle.click();
    await el.updateComplete;

    // Uncheck brightness_pct → hidden from rule editor.
    const checkbox = el.shadowRoot.querySelector(
      "input[type='checkbox'][data-show-in-editor='brightness_pct']",
    ) as HTMLInputElement;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;

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

    const saveBtn = el.shadowRoot.querySelector("button[data-action='save']") as HTMLButtonElement;
    saveBtn.click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(saveExposedActions).toHaveBeenCalledWith(
      expect.anything(),
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
    const toggle = el.shadowRoot.querySelector("[data-card] button[data-toggle]") as HTMLButtonElement;
    toggle.click();
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

  test("removing a card drops it from the saved payload", async () => {
    el = await mount();
    const removeBtn = el.shadowRoot.querySelector("[data-card] button[data-remove]") as HTMLButtonElement;
    expect(removeBtn).not.toBeNull();
    removeBtn.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll("[data-card]").length).toBe(0);

    const saveBtn = el.shadowRoot.querySelector("button[data-action='save']") as HTMLButtonElement;
    saveBtn.click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(saveExposedActions).toHaveBeenCalledWith(expect.anything(), []);
  });

  test("renders warnings returned by saveExposedActions", async () => {
    vi.mocked(saveExposedActions).mockResolvedValueOnce({
      ok: true,
      warnings: [
        { scope_kind: "area", scope_id: "lounge", rule_name: "Evening", reason: "field removed" },
      ],
    });
    el = await mount();
    const saveBtn = el.shadowRoot.querySelector("button[data-action='save']") as HTMLButtonElement;
    saveBtn.click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const warnings = el.shadowRoot.querySelector(".warning");
    expect(warnings).not.toBeNull();
    const txt = warnings.textContent ?? "";
    expect(txt).toContain("lounge");
    expect(txt).toContain("Evening");
    expect(txt).toContain("field removed");
  });

  test("surfaces save errors inline", async () => {
    vi.mocked(saveExposedActions).mockRejectedValueOnce(new Error("validation_error: bad"));
    el = await mount();
    const saveBtn = el.shadowRoot.querySelector("button[data-action='save']") as HTMLButtonElement;
    saveBtn.click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const err = el.shadowRoot.querySelector(".error");
    expect(err).not.toBeNull();
    expect(err.textContent).toContain("validation_error");
  });

  test("renders an error and no save button when load fails", async () => {
    vi.mocked(listExposedActions).mockRejectedValueOnce(new Error("WS unavailable"));
    el = await mount();

    expect(el.shadowRoot.querySelector("button[data-action='save']")).toBeNull();
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
    const toggle = el.shadowRoot.querySelector("[data-card] button[data-toggle]") as HTMLButtonElement;
    toggle.click();
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
    const toggle = el.shadowRoot.querySelector("[data-card] button[data-toggle]") as HTMLButtonElement;
    toggle.click();
    await el.updateComplete;

    const nameSpan = el.shadowRoot.querySelector(".field-row .name") as HTMLElement;
    expect(nameSpan).not.toBeNull();
    const text = nameSpan.textContent ?? "";
    expect(text).toContain("Brightness pct");
    expect(nameSpan.querySelector("small.field-id")).toBeNull();
  });

  test("dispatches ambience-exposed-actions-changed on successful save", async () => {
    const listener = vi.fn();
    window.addEventListener("ambience-exposed-actions-changed", listener);
    try {
      el = await mount();
      const saveBtn = el.shadowRoot.querySelector("button[data-action='save']") as HTMLButtonElement;
      saveBtn.click();
      await new Promise((r) => setTimeout(r, 0));
      await el.updateComplete;
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
      const saveBtn = el.shadowRoot.querySelector("button[data-action='save']") as HTMLButtonElement;
      saveBtn.click();
      await new Promise((r) => setTimeout(r, 0));
      await el.updateComplete;
      expect(listener).not.toHaveBeenCalled();
    } finally {
      window.removeEventListener("ambience-exposed-actions-changed", listener);
    }
  });

  test("editing the label updates the action's label in the saved payload", async () => {
    el = await mount();
    const labelInput = el.shadowRoot.querySelector("[data-card] input[type='text']") as HTMLInputElement;
    expect(labelInput).not.toBeNull();
    labelInput.value = "Lights on";
    labelInput.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    const saveBtn = el.shadowRoot.querySelector("button[data-action='save']") as HTMLButtonElement;
    saveBtn.click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(saveExposedActions).toHaveBeenCalledWith(
      expect.anything(),
      expect.arrayContaining([
        expect.objectContaining({ id: "light.turn_on", label: "Lights on" }),
      ]),
    );
  });
});
