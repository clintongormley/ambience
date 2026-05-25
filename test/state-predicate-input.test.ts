import { describe, test, expect, afterEach, vi } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  getKnownStates: vi.fn(async () => ({ states: ["on", "off"] })),
}));

import "../frontend/src/views/state-predicate-input";
import type { StatePredicate } from "../frontend/src/types";

async function mount(value: StatePredicate = null): Promise<any> {
  const el: any = document.createElement("ambience-state-predicate-input");
  el.value = value;
  el.hass = {};
  document.body.appendChild(el);
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  return el;
}

describe("ambience-state-predicate-input", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("null value renders an empty-state Add button", async () => {
    el = await mount(null);
    const txt = el.shadowRoot.textContent ?? "";
    expect(txt).toContain("Add");
  });

  test("clicking Add creates an empty atom and emits value-changed", async () => {
    el = await mount(null);
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._addFirstAtom();
    expect(captured?.kind).toBe("is");
    expect(captured?.entity_id).toBe("");
    expect(captured?.states).toEqual([]);
  });

  test("_replaceAt at the root swaps the whole predicate", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._replaceAt([], { kind: "is", entity_id: "y", states: ["off"] });
    expect(captured.entity_id).toBe("y");
  });

  test("_wrapAt at root converts an atom into a single-child group", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._wrapAt([], "and");
    expect(captured.kind).toBe("and");
    expect(captured.items).toHaveLength(1);
    expect(captured.items[0].entity_id).toBe("x");
  });

  test("_addChildAt appends an empty atom to a group", async () => {
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "x", states: ["on"] },
    ]});
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._addChildAt([], "is");
    expect(captured.items).toHaveLength(2);
    expect(captured.items[1].kind).toBe("is");
    expect(captured.items[1].entity_id).toBe("");
  });

  test("_removeAt at root returns null (no predicate)", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    let fired = false;
    el.addEventListener("value-changed", (e: Event) => {
      fired = true;
      captured = (e as CustomEvent).detail.value;
    });
    el._removeAt([]);
    expect(fired).toBe(true);
    expect(captured).toBeNull();
  });

  test("_removeAt removes one child from a 2-child group", async () => {
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "x", states: ["on"] },
      { kind: "is", entity_id: "y", states: ["off"] },
    ]});
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._removeAt([1]);
    // 2 → 1 child: collapses to that single child.
    expect(captured.kind).toBe("is");
    expect(captured.entity_id).toBe("x");
  });

  test("_removeAt on the last child of a group collapses to null", async () => {
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "x", states: ["on"] },
    ]});
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._removeAt([0]);
    expect(captured).toBeNull();
  });

  test("_toggleNotAt wraps an atom in not", async () => {
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "x", states: ["on"] },
      { kind: "is", entity_id: "y", states: ["off"] },
    ]});
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._toggleNotAt([0]);
    expect(captured.items[0].kind).toBe("not");
    expect(captured.items[0].item.entity_id).toBe("x");
  });

  test("_toggleNotAt unwraps when toggled again", async () => {
    el = await mount({ kind: "and", items: [
      { kind: "not", item: { kind: "is", entity_id: "x", states: ["on"] } },
      { kind: "is", entity_id: "y", states: ["off"] },
    ]});
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._toggleNotAt([0]);
    expect(captured.items[0].kind).toBe("is");
    expect(captured.items[0].entity_id).toBe("x");
  });

  test("_setGroupOpAt switches and/or at a path", async () => {
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "x", states: ["on"] },
      { kind: "is", entity_id: "y", states: ["off"] },
    ]});
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._setGroupOpAt([], "or");
    expect(captured.kind).toBe("or");
    expect(captured.items).toHaveLength(2);
  });

  test("nested replace via path [0,1]", async () => {
    el = await mount({ kind: "or", items: [
      { kind: "and", items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ]},
      { kind: "is", entity_id: "c", states: ["open"] },
    ]});
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._replaceAt([0, 1], { kind: "is_not", entity_id: "b", states: ["off"] });
    expect(captured.items[0].items[1].kind).toBe("is_not");
  });

  // --- root-level toolbar + add-condition --------------------------------

  test("a non-null root renders a root-level toolbar and Add button", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    expect(el.shadowRoot.querySelector(".root-toolbar")).toBeTruthy();
    expect(el.shadowRoot.querySelector(".root-add")).toBeTruthy();
  });

  test("an empty (null) root renders neither root-toolbar nor root-add (only the initial empty-state Add)", async () => {
    el = await mount(null);
    expect(el.shadowRoot.querySelector(".root-toolbar")).toBeNull();
    expect(el.shadowRoot.querySelector(".root-add")).toBeNull();
  });

  test("_addAtRoot on a lone atom wraps in AND with the atom + an empty sibling", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._addAtRoot();
    expect(captured.kind).toBe("and");
    expect(captured.items).toHaveLength(2);
    expect(captured.items[0].entity_id).toBe("x");
    expect(captured.items[1].kind).toBe("is");
    expect(captured.items[1].entity_id).toBe("");
  });

  test("_addAtRoot on a group appends a child (no re-wrap)", async () => {
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "x", states: ["on"] },
    ]});
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._addAtRoot();
    expect(captured.kind).toBe("and");
    expect(captured.items).toHaveLength(2);
    expect(captured.items[0].entity_id).toBe("x");
  });

  test("_addAtRoot on a NOT-wrapped atom wraps the NOT in AND with an empty sibling", async () => {
    el = await mount({
      kind: "not",
      item: { kind: "is", entity_id: "x", states: ["on"] },
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._addAtRoot();
    expect(captured.kind).toBe("and");
    expect(captured.items[0].kind).toBe("not");
    expect(captured.items[0].item.entity_id).toBe("x");
    expect(captured.items[1].kind).toBe("is");
  });

  test("clicking root NOT toggle wraps the whole predicate in NOT", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    const notBtn = el.shadowRoot.querySelector(".root-toolbar .not-toggle") as HTMLButtonElement;
    notBtn.click();
    expect(captured.kind).toBe("not");
    expect(captured.item.entity_id).toBe("x");
  });

  test("clicking root Clear/Remove sets the predicate to null", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    const removeBtn = el.shadowRoot.querySelector(".root-toolbar .remove") as HTMLButtonElement;
    removeBtn.click();
    expect(captured).toBeNull();
  });

  test("clicking root Wrap wraps the atom in a single-child AND group", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    const wrapBtn = el.shadowRoot.querySelector(".root-toolbar .wrap") as HTMLButtonElement;
    wrapBtn.click();
    expect(captured.kind).toBe("and");
    expect(captured.items).toHaveLength(1);
    expect(captured.items[0].entity_id).toBe("x");
  });
});
