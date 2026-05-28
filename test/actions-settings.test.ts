import { describe, test, expect, afterEach, beforeEach, vi } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  listExposedActions: vi.fn(async () => [
    { id: "light.turn_on", label: "", visible_fields: ["brightness_pct"], locked_values: {} },
  ]),
  listServices: vi.fn(async () => [
    { id: "light.turn_on", description: "Turn on", target: null },
    { id: "light.turn_off", description: "Turn off", target: null },
  ]),
  getServiceSchema: vi.fn(async (_hass: unknown, service: string) => {
    if (service === "light.turn_on") {
      return {
        fields: {
          brightness_pct: { selector: { number: { min: 0, max: 100 } } },
          transition: { selector: { number: { min: 0 } } },
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
    // Body fields should not be visible initially.
    expect(el.shadowRoot.querySelector("[data-card] .body")).toBeNull();
    const toggle = el.shadowRoot.querySelector("[data-card] button[data-toggle]") as HTMLButtonElement;
    expect(toggle).not.toBeNull();
    toggle.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("[data-card] .body")).toBeTruthy();
  });

  test("calls saveExposedActions when save clicked, with current state", async () => {
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
          locked_values: {},
        }),
      ]),
    );
  });

  test("toggling a field from hidden to visible updates the saved payload", async () => {
    el = await mount();
    // Expand the card so the field rows are rendered.
    const toggle = el.shadowRoot.querySelector("[data-card] button[data-toggle]") as HTMLButtonElement;
    toggle.click();
    await el.updateComplete;

    // The `transition` field starts as hidden (only brightness_pct is visible).
    const select = el.shadowRoot.querySelector("select[data-field-mode='transition']") as HTMLSelectElement;
    expect(select).not.toBeNull();
    select.value = "visible";
    select.dispatchEvent(new Event("change", { bubbles: true }));
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

  test("toggling a field to locked moves it from visible_fields to locked_values", async () => {
    el = await mount();
    const toggle = el.shadowRoot.querySelector("[data-card] button[data-toggle]") as HTMLButtonElement;
    toggle.click();
    await el.updateComplete;

    const select = el.shadowRoot.querySelector("select[data-field-mode='brightness_pct']") as HTMLSelectElement;
    select.value = "locked";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;

    // A native input fallback should appear for editing the locked value.
    const lockedInput = el.shadowRoot.querySelector("input[data-locked-value='brightness_pct']") as HTMLInputElement;
    expect(lockedInput).not.toBeNull();
    lockedInput.value = "42";
    lockedInput.dispatchEvent(new Event("input", { bubbles: true }));
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
          locked_values: { brightness_pct: "42" },
        }),
      ]),
    );
  });

  test("add-service flow adds a new card for the chosen service", async () => {
    el = await mount();
    const addBtn = el.shadowRoot.querySelector("button[data-action='add']") as HTMLButtonElement;
    expect(addBtn).not.toBeNull();
    addBtn.click();
    await el.updateComplete;

    const picker = el.shadowRoot.querySelector("select[data-add-service]") as HTMLSelectElement;
    expect(picker).not.toBeNull();
    // Already-exposed services are not in the picker.
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

    // Save button must NOT be present
    expect(el.shadowRoot.querySelector("button[data-action='save']")).toBeNull();
    // Error message visible
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
    // Expand the card.
    const toggle = el.shadowRoot.querySelector("[data-card] button[data-toggle]") as HTMLButtonElement;
    toggle.click();
    await el.updateComplete;

    const nameSpan = el.shadowRoot.querySelector(".field-row .name") as HTMLElement;
    expect(nameSpan).not.toBeNull();
    const text = nameSpan.textContent ?? "";
    // Human name visible.
    expect(text).toContain("Brightness");
    // Raw field id shown as secondary text in parentheses.
    expect(text).toContain("brightness_pct");
    // The field-id small element wraps the raw id.
    const fieldIdSmall = nameSpan.querySelector("small.field-id") as HTMLElement;
    expect(fieldIdSmall).not.toBeNull();
    expect(fieldIdSmall.textContent).toContain("brightness_pct");
  });

  test("shows raw field id when schema has no name attribute", async () => {
    el = await mount();
    // Expand the card.
    const toggle = el.shadowRoot.querySelector("[data-card] button[data-toggle]") as HTMLButtonElement;
    toggle.click();
    await el.updateComplete;

    // The default mock schema has no name on brightness_pct.
    const nameSpan = el.shadowRoot.querySelector(".field-row .name") as HTMLElement;
    expect(nameSpan).not.toBeNull();
    const text = nameSpan.textContent ?? "";
    expect(text).toContain("brightness_pct");
    // No field-id small element when there's no human name.
    expect(nameSpan.querySelector("small.field-id")).toBeNull();
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
