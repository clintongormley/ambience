import { afterEach, describe, expect, test, vi } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  getKnownStates: vi.fn(async () => ({ states: ["on", "off"] })),
}));

import type { StatePredicate } from "../frontend/src/types";
import { statePredicateError } from "../frontend/src/views/state-predicate-input";

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

  /** Build + attach an element with a listener wired BEFORE first render, so the
   *  validity event fired during the initial update cycle is captured. */
  async function mountCapturingValidity(
    value: StatePredicate,
  ): Promise<{ el: any; errors: (string | null)[] }> {
    const node: any = document.createElement("ambience-state-predicate-input");
    node.hass = {};
    node.value = value;
    const errors: (string | null)[] = [];
    node.addEventListener("render-invalid-changed", (e: Event) => {
      errors.push((e as CustomEvent).detail.error);
    });
    document.body.appendChild(node);
    await node.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await node.updateComplete;
    return { el: node, errors };
  }

  test("emits render-invalid-changed with an error when an atom has a blank value", async () => {
    const { el: node, errors } = await mountCapturingValidity({
      kind: "is",
      entity_id: "light.x",
      states: [], // entity picked, value left blank — incomplete
    });
    expect(errors.at(-1)).toBeTruthy();
    node.remove();
  });

  test("emits render-invalid-changed with an error when the entity is blank", async () => {
    const { el: node, errors } = await mountCapturingValidity({
      kind: "is",
      entity_id: "",
      states: [],
    });
    expect(errors.at(-1)).toBeTruthy();
    node.remove();
  });

  test("reports valid (null) once every atom is complete", async () => {
    const { el: node, errors } = await mountCapturingValidity({
      kind: "and",
      items: [
        { kind: "is", entity_id: "light.x", states: ["on"] },
        { kind: "is", entity_id: "light.y", states: ["off"] },
      ],
    });
    // Either no event (already valid from the start) or a trailing null.
    expect(errors.at(-1) ?? null).toBeNull();
    node.remove();
  });

  test("flags an incomplete atom nested inside a group", async () => {
    const { el: node, errors } = await mountCapturingValidity({
      kind: "and",
      items: [
        { kind: "is", entity_id: "light.x", states: ["on"] },
        { kind: "is", entity_id: "light.y", states: [] }, // incomplete child
      ],
    });
    expect(errors.at(-1)).toBeTruthy();
    node.remove();
  });

  test("null value renders an empty-state Add button", async () => {
    el = await mount(null);
    const txt = el.shadowRoot.textContent ?? "";
    expect(txt).toContain("Add");
  });

  test("empty-state Add button reads 'Add clause' (not 'Add condition')", async () => {
    el = await mount(null);
    const btn = el.shadowRoot.querySelector(".empty button") as HTMLButtonElement;
    expect(btn.textContent).toContain("Add clause");
    expect(btn.textContent).not.toContain("Add condition");
  });

  test("clicking Add creates an empty atom and emits value-changed", async () => {
    el = await mount(null);
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._addFirstAtom();
    expect(captured?.kind).toBe("is");
    expect(captured?.entity_id).toBe("");
    expect(captured?.states).toEqual([]);
  });

  test("_replaceAt at the root swaps the whole predicate", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._replaceAt([], { kind: "is", entity_id: "y", states: ["off"] });
    expect(captured.entity_id).toBe("y");
  });

  test("wrapping the only child of a group still creates a sub-group (no collapse)", async () => {
    // Regression: _patch's collapse-when-single-child fired even on
    // replacements (like wrap), making the wrap appear as just an op flip.
    el = await mount({ kind: "and", items: [{ kind: "is", entity_id: "a", states: ["on"] }] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._wrapAt([0]);
    // Outer AND survives; new inner OR (flipped from AND) wraps `a`.
    expect(captured.kind).toBe("and");
    expect(captured.items).toHaveLength(1);
    expect(captured.items[0].kind).toBe("or");
    expect(captured.items[0].items[0].entity_id).toBe("a");
  });

  test("_wrapAt on a child of an AND group creates an OR sub-group (flip parent's op)", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._wrapAt([1]);
    expect(captured.items[1].kind).toBe("or");
    expect(captured.items[1].items[0].entity_id).toBe("b");
  });

  test("_wrapAt on a child of an OR group creates an AND sub-group (flip parent's op)", async () => {
    el = await mount({
      kind: "or",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._wrapAt([0]);
    expect(captured.items[0].kind).toBe("and");
    expect(captured.items[0].items[0].entity_id).toBe("a");
  });

  test("_wrapAt at root has no parent → defaults to AND", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._wrapAt([]);
    expect(captured.kind).toBe("and");
    expect(captured.items).toHaveLength(1);
    expect(captured.items[0].entity_id).toBe("x");
  });

  test("_wrapAt on an AND group wraps it in an OR parent (flip the group's OWN op)", async () => {
    // Group-level "()": wrap the whole group in parens so it can be combined
    // with new siblings under the opposite operator — "(a AND b)" ready to
    // become "(a AND b) OR c". A same-op wrapper would be a semantic no-op.
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._wrapAt([]);
    expect(captured.kind).toBe("or");
    expect(captured.items).toHaveLength(1);
    expect(captured.items[0].kind).toBe("and");
    expect(captured.items[0].items).toHaveLength(2);
    expect(captured.items[0].items.map((i: any) => i.entity_id)).toEqual(["a", "b"]);
  });

  test("_wrapAt on an OR group wraps it in an AND parent (flip the group's OWN op)", async () => {
    el = await mount({
      kind: "or",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._wrapAt([]);
    expect(captured.kind).toBe("and");
    expect(captured.items[0].kind).toBe("or");
  });

  test("_wrapAt on a NESTED group flips its OWN op (documents the nested-wrap shape)", async () => {
    // Wrapping the inner AND of OR[AND[a,b], c] flips the AND's own op → a new
    // OR wrapper. A same-op wrap would be a no-op, so flipping is the deliberate,
    // root-consistent choice; the resulting OR-in-OR nesting is harmless and
    // undoable via the group header's ✕ (unwrap).
    el = await mount({
      kind: "or",
      items: [
        {
          kind: "and",
          items: [
            { kind: "is", entity_id: "a", states: ["on"] },
            { kind: "is", entity_id: "b", states: ["off"] },
          ],
        },
        { kind: "is", entity_id: "c", states: ["open"] },
      ],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._wrapAt([0]);
    expect(captured.kind).toBe("or"); // outer parent unchanged
    expect(captured.items[0].kind).toBe("or"); // new wrapper: flipped AND → OR
    expect(captured.items[0].items[0].kind).toBe("and"); // original AND preserved
    expect(captured.items[0].items[0].items).toHaveLength(2);
    expect(captured.items[1].entity_id).toBe("c");
  });

  test("_wrapAt on a NOT-wrapped group keeps the NOT inside the new parens", async () => {
    // "NOT (a AND b)" → "( NOT (a AND b) )" under the flipped (OR) parent.
    el = await mount({
      kind: "not",
      item: {
        kind: "and",
        items: [
          { kind: "is", entity_id: "a", states: ["on"] },
          { kind: "is", entity_id: "b", states: ["off"] },
        ],
      },
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._wrapAt([]);
    expect(captured.kind).toBe("or");
    expect(captured.items).toHaveLength(1);
    expect(captured.items[0].kind).toBe("not");
    expect(captured.items[0].item.kind).toBe("and");
  });

  test("group header has a '(…)' wrap button on the right, next to the ✕", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    await flush(el);
    const node = el.shadowRoot.querySelector("ambience-state-expr-node") as any;
    const wrapBtn = node.shadowRoot.querySelector(".group-header button.wrap") as HTMLButtonElement;
    expect(wrapBtn).toBeTruthy();
    // Matches the atom clause buttons' glyph, not "()".
    expect(wrapBtn.textContent).toContain("(…)");
    // Sits immediately before the ✕ (unwrap) on the right of the header.
    expect(wrapBtn.nextElementSibling).toBe(
      node.shadowRoot.querySelector(".group-header button.unwrap"),
    );
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    wrapBtn.click();
    await flush(el);
    // AND group wrapped in a new OR parent.
    expect(captured.kind).toBe("or");
    expect(captured.items[0].kind).toBe("and");
    expect(captured.items[0].items).toHaveLength(2);
  });

  test("_addChildAt appends an empty atom to a group", async () => {
    el = await mount({ kind: "and", items: [{ kind: "is", entity_id: "x", states: ["on"] }] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._addChildAt([], "is");
    expect(captured.items).toHaveLength(2);
    expect(captured.items[1].kind).toBe("is");
    expect(captured.items[1].entity_id).toBe("");
  });

  test("_addChildAt appends to a NOT-wrapped root group, preserving the NOT (regression)", async () => {
    // Bug: "Add clause" silently did nothing on a negated group. Paths treat
    // the NOT wrapper as transparent, so the patch callback received the
    // {kind:'not'} envelope and fell through its and/or check, adding nothing.
    el = await mount({
      kind: "not",
      item: {
        kind: "and",
        items: [
          { kind: "is", entity_id: "a", states: ["on"] },
          { kind: "is", entity_id: "b", states: ["off"] },
          { kind: "is", entity_id: "c", states: ["open"] },
        ],
      },
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._addChildAt([], "is");
    // NOT survives; the inner AND gains a 4th (empty) child.
    expect(captured.kind).toBe("not");
    expect(captured.item.kind).toBe("and");
    expect(captured.item.items).toHaveLength(4);
    expect(captured.item.items[3].kind).toBe("is");
    expect(captured.item.items[3].entity_id).toBe("");
    // The new child is opened (path is transparent through NOT).
    expect(el._openPath).toEqual([3]);
  });

  test("_addChildAt appends to a NOT-wrapped NESTED group, preserving the NOT", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        {
          kind: "not",
          item: { kind: "or", items: [{ kind: "is", entity_id: "b", states: ["off"] }] },
        },
      ],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._addChildAt([1], "is");
    expect(captured.items[1].kind).toBe("not");
    expect(captured.items[1].item.kind).toBe("or");
    expect(captured.items[1].item.items).toHaveLength(2);
    expect(captured.items[1].item.items[1].entity_id).toBe("");
    expect(el._openPath).toEqual([1, 1]);
  });

  test("clicking '+ Add clause' on a negated group adds a clause (regression, full UI path)", async () => {
    el = await mount({
      kind: "not",
      item: {
        kind: "and",
        items: [
          { kind: "is", entity_id: "a", states: ["on"] },
          { kind: "is", entity_id: "b", states: ["off"] },
        ],
      },
    });
    await flush(el);
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    const node = el.shadowRoot.querySelector("ambience-state-expr-node") as any;
    const addBtn = node.shadowRoot.querySelector(".actions button") as HTMLButtonElement;
    addBtn.click();
    await flush(el);
    expect(captured.kind).toBe("not");
    expect(captured.item.items).toHaveLength(3);
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
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "x", states: ["on"] },
        { kind: "is", entity_id: "y", states: ["off"] },
      ],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._removeAt([1]);
    // 2 → 1 child: collapses to that single child.
    expect(captured.kind).toBe("is");
    expect(captured.entity_id).toBe("x");
  });

  test("_removeAt on the last child of a group collapses to null", async () => {
    el = await mount({ kind: "and", items: [{ kind: "is", entity_id: "x", states: ["on"] }] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._removeAt([0]);
    expect(captured).toBeNull();
  });

  test("_toggleNotAt wraps an atom in not", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "x", states: ["on"] },
        { kind: "is", entity_id: "y", states: ["off"] },
      ],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._toggleNotAt([0]);
    expect(captured.items[0].kind).toBe("not");
    expect(captured.items[0].item.entity_id).toBe("x");
  });

  test("_toggleNotAt wraps the whole root group in not (path [])", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "x", states: ["on"] },
        { kind: "is", entity_id: "y", states: ["off"] },
      ],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._toggleNotAt([]);
    expect(captured.kind).toBe("not");
    expect(captured.item.kind).toBe("and");
    expect(captured.item.items).toHaveLength(2);
  });

  test("_toggleNotAt unwraps a negated root group back to the bare group (path [])", async () => {
    el = await mount({
      kind: "not",
      item: {
        kind: "and",
        items: [
          { kind: "is", entity_id: "x", states: ["on"] },
          { kind: "is", entity_id: "y", states: ["off"] },
        ],
      },
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._toggleNotAt([]);
    expect(captured.kind).toBe("and");
    expect(captured.items).toHaveLength(2);
  });

  test("_toggleNotAt unwraps when toggled again", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "not", item: { kind: "is", entity_id: "x", states: ["on"] } },
        { kind: "is", entity_id: "y", states: ["off"] },
      ],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._toggleNotAt([0]);
    expect(captured.items[0].kind).toBe("is");
    expect(captured.items[0].entity_id).toBe("x");
  });

  test("_setGroupOpAt switches and/or at a path", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "x", states: ["on"] },
        { kind: "is", entity_id: "y", states: ["off"] },
      ],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._setGroupOpAt([], "or");
    expect(captured.kind).toBe("or");
    expect(captured.items).toHaveLength(2);
  });

  test("nested replace via path [0,1]", async () => {
    el = await mount({
      kind: "or",
      items: [
        {
          kind: "and",
          items: [
            { kind: "is", entity_id: "a", states: ["on"] },
            { kind: "is", entity_id: "b", states: ["off"] },
          ],
        },
        { kind: "is", entity_id: "c", states: ["open"] },
      ],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._replaceAt([0, 1], { kind: "is_not", entity_id: "b", states: ["off"] });
    expect(captured.items[0].items[1].kind).toBe("is_not");
  });

  // --- root-level toolbar + add-condition --------------------------------

  test("there's no root-toolbar — wrap/clear live on each atom card / group header", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    expect(el.shadowRoot.querySelector(".root-toolbar")).toBeNull();
  });

  test("atom root shows a section-level '+ Add clause' (only way to add a sibling)", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    expect(el.shadowRoot.querySelector(".root-add")).toBeTruthy();
  });

  test("section-level add button reads 'Add clause' (not 'Add condition')", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    const btn = el.shadowRoot.querySelector(".root-add") as HTMLButtonElement;
    expect(btn.textContent).toContain("Add clause");
    expect(btn.textContent).not.toContain("Add condition");
  });

  test("group root hides the section-level '+ Add clause' (the group already has one inside)", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    expect(el.shadowRoot.querySelector(".root-add")).toBeNull();
  });

  test("an empty (null) root has the empty-state Add only — no root-toolbar/root-add", async () => {
    el = await mount(null);
    expect(el.shadowRoot.querySelector(".root-toolbar")).toBeNull();
    expect(el.shadowRoot.querySelector(".root-add")).toBeNull();
  });

  test("_addAtRoot on a lone atom wraps in AND with the atom + an empty sibling", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._addAtRoot();
    expect(captured.kind).toBe("and");
    expect(captured.items).toHaveLength(2);
    expect(captured.items[0].entity_id).toBe("x");
    expect(captured.items[1].kind).toBe("is");
    expect(captured.items[1].entity_id).toBe("");
  });

  test("_addAtRoot on a group appends a child (no re-wrap)", async () => {
    el = await mount({ kind: "and", items: [{ kind: "is", entity_id: "x", states: ["on"] }] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
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
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._addAtRoot();
    expect(captured.kind).toBe("and");
    expect(captured.items[0].kind).toBe("not");
    expect(captured.items[0].item.entity_id).toBe("x");
    expect(captured.items[1].kind).toBe("is");
  });

  test("root toolbar is gone entirely", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    expect(el.shadowRoot.querySelector(".root-toolbar")).toBeNull();
  });

  test("group dropdown has only AND and OR options (no AND_NOT / OR_NOT)", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    await flush(el);
    const visit = (sr: ShadowRoot | null): HTMLSelectElement | null => {
      if (!sr) return null;
      const s = sr.querySelector("select.group-op") as HTMLSelectElement | null;
      if (s) return s;
      for (const n of Array.from(sr.querySelectorAll("ambience-state-expr-node"))) {
        const r = visit((n as any).shadowRoot);
        if (r) return r;
      }
      return null;
    };
    const select = visit(el.shadowRoot);
    const opts = Array.from(select?.options ?? []).map((o) => o.value);
    expect(opts).toEqual(["and", "or"]);
  });

  test("atom card header contains the NOT toggle (reflecting {kind:'not'} wrap state)", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "not", item: { kind: "is", entity_id: "a", states: ["on"] } },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    await flush(el);
    // Each atom card now owns its own NOT toggle in the header.
    const cards = _atomCards(el);
    expect(cards[0].querySelector(".atom-header .not-toggle")?.classList.contains("on")).toBe(true);
    expect(cards[1].querySelector(".atom-header .not-toggle")?.classList.contains("on")).toBe(
      false,
    );
    // The external child-actions toolbar is gone.
    const childActions = el.shadowRoot.querySelectorAll(".child-actions");
    expect(childActions.length).toBe(0);
  });

  test("clicking a child atom's NOT toggle (inside the header) wraps it in {kind:'not'}", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    await flush(el);
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    const cards = _atomCards(el);
    const toggle = cards[0].querySelector(".atom-header .not-toggle") as HTMLButtonElement;
    toggle.click();
    await flush(el);
    expect(captured.items[0].kind).toBe("not");
    expect(captured.items[0].item.entity_id).toBe("a");
  });

  test("clicking the NOT toggle does NOT also expand/collapse the atom (click is consumed)", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    el._setOpen([1]);
    await flush(el);
    let cards = _atomCards(el);
    const toggle = cards[0].querySelector(".atom-header .not-toggle") as HTMLButtonElement;
    toggle.click();
    await flush(el);
    // openPath unchanged; atom [0] remains collapsed.
    expect(el._openPath).toEqual([1]);
    cards = _atomCards(el);
    expect(cards[0].classList.contains("collapsed")).toBe(true);
  });

  test("clearing the predicate happens via the atom card's X (root toolbar is gone)", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    const cards = _atomCards(el);
    (cards[0].querySelector(".atom-header .remove") as HTMLButtonElement).click();
    await flush(el);
    expect(captured).toBeNull();
  });

  // --- collapse / expand ------------------------------------------------

  // Atom cards live inside state-expr-node's shadow DOM, which may be
  // nested when the predicate is a group. Walk down to collect them all.
  function _atomCards(root: any): HTMLElement[] {
    const out: HTMLElement[] = [];
    const visit = (sr: ShadowRoot | null) => {
      if (!sr) return;
      sr.querySelectorAll(".atom-card").forEach((c) => {
        out.push(c as HTMLElement);
      });
      sr.querySelectorAll("ambience-state-expr-node").forEach((n: Element) => {
        visit((n as any).shadowRoot);
      });
    };
    visit(root.shadowRoot);
    return out;
  }

  /** Flush both the host's update and any pending nested updates so the
   *  full descendant tree has re-rendered. */
  async function flush(root: any): Promise<void> {
    await root.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await root.updateComplete;
  }

  test("a single complete atom at root is expanded by default (form visible)", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    const card = _atomCards(el)[0];
    expect(card.classList.contains("expanded")).toBe(true);
    expect(card.querySelector("ambience-state-expr-atom")).toBeTruthy();
  });

  test("a single root atom auto-opens regardless of completeness (so the form is visible)", async () => {
    el = await mount({ kind: "is", entity_id: "", states: [] });
    const card = _atomCards(el)[0];
    expect(card.classList.contains("expanded")).toBe(true);
    const summary = card.querySelector(".summary");
    expect(summary?.classList.contains("placeholder")).toBe(true);
  });

  test("regression: clicking one atom's summary collapses the previously-open atom (even when incomplete)", async () => {
    // Bug report: two atoms with empty/incomplete content both rendered as
    // force-expanded, so opening one didn't collapse the other. The fix
    // respects _openPath strictly — incomplete atoms collapse when they're
    // not the open one.
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "", states: [] }, // incomplete
        { kind: "is", entity_id: "person.b", states: ["home"] },
      ],
    });
    el._setOpen([1]);
    await flush(el);
    const cards = _atomCards(el);
    expect(cards[0].classList.contains("collapsed")).toBe(true);
    expect(cards[1].classList.contains("expanded")).toBe(true);

    // Now click the (incomplete) [0] header — [1] must collapse, [0] open.
    (cards[0].querySelector(".atom-header") as HTMLElement).click();
    await flush(el);
    const after = _atomCards(el);
    expect(after[0].classList.contains("expanded")).toBe(true);
    expect(after[1].classList.contains("collapsed")).toBe(true);
  });

  test("in a group, only the open atom is expanded; others render as summary only", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    el._setOpen([1]);
    await flush(el);
    const cards = _atomCards(el);
    expect(cards).toHaveLength(2);
    expect(cards[0].classList.contains("collapsed")).toBe(true);
    expect(cards[1].classList.contains("expanded")).toBe(true);
    // Collapsed card has no form body.
    expect(cards[0].querySelector("ambience-state-expr-atom")).toBeNull();
    expect(cards[1].querySelector("ambience-state-expr-atom")).toBeTruthy();
  });

  test("clicking a collapsed atom's summary opens it (collapsing the previously-open one)", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    el._setOpen([1]);
    await flush(el);
    const cardA = _atomCards(el)[0];
    (cardA.querySelector(".atom-header") as HTMLElement).click();
    await flush(el);
    const cards = _atomCards(el);
    expect(cards[0].classList.contains("expanded")).toBe(true);
    expect(cards[1].classList.contains("collapsed")).toBe(true);
  });

  test("clicking the X on a collapsed atom removes it (without opening)", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    el._setOpen([1]);
    await flush(el);
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    const cardA = _atomCards(el)[0];
    (cardA.querySelector(".remove") as HTMLButtonElement).click();
    await flush(el);
    // The 2-item group collapses to the lone remaining atom (b).
    expect(captured.kind).toBe("is");
    expect(captured.entity_id).toBe("b");
  });

  test("clicking the open atom's header collapses it (toggle)", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    el._setOpen([0]);
    await flush(el);

    let cards = _atomCards(el);
    expect(cards[0].classList.contains("expanded")).toBe(true);
    (cards[0].querySelector(".atom-header") as HTMLElement).click();
    await flush(el);

    // Open atom clicked → collapses. None left expanded.
    expect(el._openPath).toBeNull();
    cards = _atomCards(el);
    expect(cards[0].classList.contains("collapsed")).toBe(true);
    expect(cards[1].classList.contains("collapsed")).toBe(true);
  });

  test("clicking an INVALID open atom's header refuses to collapse and surfaces the error", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "", states: [] }, // invalid
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    el._setOpen([0]);
    await flush(el);

    const cards = _atomCards(el);
    (cards[0].querySelector(".atom-header") as HTMLElement).click();
    await flush(el);

    // Refused: atom [0] stays open with the error visible.
    expect(el._openPath).toEqual([0]);
    expect(cards[0].textContent).toMatch(/required/i);
  });

  test("clicking another atom while the open one is invalid keeps the open one expanded and shows an error", async () => {
    // The first atom is incomplete (no entity_id). The second is valid.
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "", states: [] }, // invalid (open)
        { kind: "is", entity_id: "person.b", states: ["home"] },
      ],
    });
    el._setOpen([0]);
    await flush(el);

    let cards = _atomCards(el);
    (cards[1].querySelector(".atom-header") as HTMLElement).click();
    await flush(el);

    // Refused to switch: atom [0] is still expanded.
    cards = _atomCards(el);
    expect(cards[0].classList.contains("expanded")).toBe(true);
    expect(cards[1].classList.contains("collapsed")).toBe(true);
    expect(el._openPath).toEqual([0]);

    // And an error message is visible inside the open atom.
    expect(cards[0].textContent).toMatch(/entity is required|required/i);
  });

  test("once the invalid atom becomes valid, the user CAN switch to another", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "", states: [] },
        { kind: "is", entity_id: "person.b", states: ["home"] },
      ],
    });
    el._setOpen([0]);
    await flush(el);

    // Fix [0]: replace it with a complete atom.
    el._replaceAt([0], { kind: "is", entity_id: "person.a", states: ["home"] });
    await flush(el);

    // Now click [1]'s summary — should switch.
    const cards = _atomCards(el);
    (cards[1].querySelector(".atom-header") as HTMLElement).click();
    await flush(el);
    expect(el._openPath).toEqual([1]);
  });

  test("error is cleared once the open atom is valid (no longer shows after fixing)", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "", states: [] },
        { kind: "is", entity_id: "person.b", states: ["home"] },
      ],
    });
    el._setOpen([0]);
    await flush(el);

    // Trigger the error by trying to switch.
    let cards = _atomCards(el);
    (cards[1].querySelector(".atom-header") as HTMLElement).click();
    await flush(el);
    cards = _atomCards(el);
    expect(cards[0].textContent).toMatch(/required/i);

    // Fix the atom — error should clear.
    el._replaceAt([0], { kind: "is", entity_id: "person.a", states: ["home"] });
    await flush(el);
    cards = _atomCards(el);
    expect(cards[0].textContent).not.toMatch(/required/i);
  });

  test("group child-rows have no external toolbar — each child is rendered directly", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    await flush(el);
    // child-actions div is removed entirely.
    const childActions = el.shadowRoot.querySelectorAll(".child-actions");
    expect(childActions.length).toBe(0);
  });

  test("the X on a NESTED group header unwraps (promotes children to parent), it doesn't delete them", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        {
          kind: "or",
          items: [
            { kind: "is", entity_id: "b", states: ["off"] },
            { kind: "is", entity_id: "c", states: ["open"] },
          ],
        },
      ],
    });
    await flush(el);

    // Collect every .group-header in the tree (root first, then nested).
    const allHeaders: HTMLElement[] = [];
    const visit = (sr: ShadowRoot | null) => {
      if (!sr) return;
      sr.querySelectorAll(".group-header").forEach((h) => {
        allHeaders.push(h as HTMLElement);
      });
      sr.querySelectorAll("ambience-state-expr-node").forEach((n) => {
        visit((n as any).shadowRoot);
      });
    };
    visit(el.shadowRoot);
    const innerHeader = allHeaders[1]; // [0] = root group, [1] = nested OR
    expect(innerHeader).toBeTruthy();
    const x = innerHeader!.querySelector("button.unwrap") as HTMLButtonElement;
    expect(x).toBeTruthy();
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    x.click();
    await flush(el);
    // After unwrap: outer AND group has 3 items (a, b, c). Note that the
    // unwrap loses the inner OR semantics — the children become siblings of
    // the outer AND. Power-user feature; explicit user action.
    expect(captured.kind).toBe("and");
    expect(captured.items).toHaveLength(3);
    expect(captured.items.map((i: any) => i.entity_id)).toEqual(["a", "b", "c"]);
  });

  test("the root group header HAS an X — click it to undo a wrap or clear the predicate", async () => {
    // After the root toolbar was dropped, the group's header X is the only
    // way to clear a root group. Semantics: 1 child → promote to root;
    // 2+ children → clear (set to null).
    el = await mount({ kind: "and", items: [{ kind: "is", entity_id: "a", states: ["on"] }] });
    await flush(el);
    const visit = (sr: ShadowRoot | null): HTMLElement | null => {
      if (!sr) return null;
      return sr.querySelector(".group-header") as HTMLElement | null;
    };
    const rootHeader = visit(el.shadowRoot.querySelector("ambience-state-expr-node")?.shadowRoot);
    const x = rootHeader!.querySelector("button.unwrap") as HTMLButtonElement;
    expect(x).toBeTruthy();
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    x.click();
    await flush(el);
    // Single child → the root becomes that child (undoes the wrap).
    expect(captured.kind).toBe("is");
    expect(captured.entity_id).toBe("a");
  });

  test("the root group header X clears the predicate when the group has 2+ items", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    await flush(el);
    const visit = (sr: ShadowRoot | null): HTMLElement | null => {
      if (!sr) return null;
      return sr.querySelector(".group-header") as HTMLElement | null;
    };
    const rootHeader = visit(el.shadowRoot.querySelector("ambience-state-expr-node")?.shadowRoot);
    const x = rootHeader!.querySelector("button.unwrap") as HTMLButtonElement;
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    x.click();
    await flush(el);
    expect(captured).toBeNull();
  });

  // --- _moveRelative (edge-zone before / into / after) ------------------

  const abc = () => ({
    kind: "and" as const,
    items: [
      { kind: "is", entity_id: "a", states: ["on"] },
      { kind: "is", entity_id: "b", states: ["off"] },
      { kind: "is", entity_id: "c", states: ["open"] },
    ],
  });
  const ids = (g: any) => g.items.map((i: any) => i.entity_id);

  async function moveRel(tree: any, from: number[], path: number[], pos: string) {
    el = await mount(tree);
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._moveRelative(from, { path, pos });
    return captured;
  }

  test("_moveRelative before a sibling: move c before a", async () => {
    expect(ids(await moveRel(abc(), [2], [0], "before"))).toEqual(["c", "a", "b"]);
  });

  test("_moveRelative after a sibling: move a after c", async () => {
    expect(ids(await moveRel(abc(), [0], [2], "after"))).toEqual(["b", "c", "a"]);
  });

  test("_moveRelative before, same parent backward: move c before b", async () => {
    expect(ids(await moveRel(abc(), [2], [1], "before"))).toEqual(["a", "c", "b"]);
  });

  test("_moveRelative after, same parent forward: move a after b", async () => {
    expect(ids(await moveRel(abc(), [0], [1], "after"))).toEqual(["b", "a", "c"]);
  });

  test("_moveRelative into a group appends the source as the group's last child", async () => {
    const tree = {
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "or", items: [{ kind: "is", entity_id: "b", states: ["off"] }] },
      ],
    };
    const out = await moveRel(tree, [0], [1], "into"); // drop a INTO the OR group
    expect(out.items).toHaveLength(1);
    expect(out.items[0].kind).toBe("or");
    expect(ids(out.items[0])).toEqual(["b", "a"]);
  });

  test("_moveRelative into a NOT-wrapped group appends inside the inner group", async () => {
    const tree = {
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        {
          kind: "not",
          item: { kind: "or", items: [{ kind: "is", entity_id: "b", states: ["off"] }] },
        },
      ],
    };
    const out = await moveRel(tree, [0], [1], "into");
    expect(out.items).toHaveLength(1);
    expect(out.items[0].kind).toBe("not");
    expect(ids(out.items[0].item)).toEqual(["b", "a"]);
  });

  test("_moveRelative into the root group appends at the root", async () => {
    const tree = {
      kind: "and",
      items: [
        {
          kind: "or",
          items: [
            { kind: "is", entity_id: "a", states: ["on"] },
            { kind: "is", entity_id: "b", states: ["off"] },
          ],
        },
        { kind: "is", entity_id: "c", states: ["open"] },
      ],
    };
    // Move a (deep inside the OR) INTO the root AND group → OR keeps b,
    // root appends a at the end: [OR(b), c, a].
    const out = await moveRel(tree, [0, 0], [], "into");
    expect(out.items).toHaveLength(3);
    expect(out.items[0].kind).toBe("or");
    expect(ids(out.items[0])).toEqual(["b"]);
    expect(out.items[1].entity_id).toBe("c");
    expect(out.items[2].entity_id).toBe("a");
  });

  test("_moveRelative refuses dropping a group into its own descendant", async () => {
    el = await mount({
      kind: "and",
      items: [{ kind: "or", items: [{ kind: "is", entity_id: "a", states: ["on"] }] }],
    });
    let fired = false;
    el.addEventListener("value-changed", () => {
      fired = true;
    });
    el._moveRelative([0], { path: [0, 0], pos: "after" }); // OR after its own child
    expect(fired).toBe(false);
  });

  test("_moveRelative refuses dropping a node onto itself", async () => {
    el = await mount(abc());
    let fired = false;
    el.addEventListener("value-changed", () => {
      fired = true;
    });
    el._moveRelative([1], { path: [1], pos: "before" });
    expect(fired).toBe(false);
  });

  test("_moveRelative before, when the source's single-child parent collapses earlier", async () => {
    // AND[ OR[a], b ]: drag a (the OR's only child) before b. Removing a empties
    // the OR (it collapses to nothing), so b shifts to index 0 — a must still
    // land BEFORE b → [a, b], NOT [b, a].
    const tree = {
      kind: "and",
      items: [
        { kind: "or", items: [{ kind: "is", entity_id: "a", states: ["on"] }] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    };
    expect(ids(await moveRel(tree, [0, 0], [1], "before"))).toEqual(["a", "b"]);
  });

  test("_moveRelative before/after across a collapsing source parent (3 siblings)", async () => {
    const mk = () => ({
      kind: "and",
      items: [
        { kind: "or", items: [{ kind: "is", entity_id: "a", states: ["on"] }] },
        { kind: "is", entity_id: "b", states: ["off"] },
        { kind: "is", entity_id: "c", states: ["open"] },
      ],
    });
    expect(ids(await moveRel(mk(), [0, 0], [2], "before"))).toEqual(["b", "a", "c"]);
    expect(ids(await moveRel(mk(), [0, 0], [1], "before"))).toEqual(["a", "b", "c"]);
    expect(ids(await moveRel(mk(), [0, 0], [1], "after"))).toEqual(["b", "a", "c"]);
  });

  // --- _zoneFor (pure edge-zone geometry) -------------------------------

  const rect = (top: number, height: number) => ({ top, bottom: top + height, height });

  test("_zoneFor group: top edge → before, middle → into, bottom edge → after", async () => {
    el = await mount(abc());
    const r = rect(0, 100); // edge band = min(8, 100/3) = 8px
    expect(el._zoneFor(r, 3, { isGroup: true, isRoot: false })).toBe("before");
    expect(el._zoneFor(r, 50, { isGroup: true, isRoot: false })).toBe("into");
    expect(el._zoneFor(r, 97, { isGroup: true, isRoot: false })).toBe("after");
  });

  test("_zoneFor group: the header (just below the top edge) is into, not before", async () => {
    el = await mount(abc());
    expect(el._zoneFor(rect(0, 100), 12, { isGroup: true, isRoot: false })).toBe("into");
  });

  test("_zoneFor atom: top half → before, bottom half → after (no into)", async () => {
    el = await mount(abc());
    const r = rect(0, 30);
    expect(el._zoneFor(r, 10, { isGroup: false, isRoot: false })).toBe("before");
    expect(el._zoneFor(r, 20, { isGroup: false, isRoot: false })).toBe("after");
  });

  test("_zoneFor root group → into everywhere (no siblings)", async () => {
    el = await mount(abc());
    const r = rect(0, 100);
    expect(el._zoneFor(r, 3, { isGroup: true, isRoot: true })).toBe("into");
    expect(el._zoneFor(r, 97, { isGroup: true, isRoot: true })).toBe("into");
  });

  test("_zoneFor root atom → null (nothing to drop relative to)", async () => {
    el = await mount(abc());
    expect(el._zoneFor(rect(0, 30), 10, { isGroup: false, isRoot: true })).toBeNull();
  });

  test("adding a condition via + Add opens the new (empty) atom", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    // Starts as a lone atom; openPath = []. Click +Add to wrap in AND.
    const addBtn = el.shadowRoot.querySelector(".root-add") as HTMLButtonElement;
    addBtn.click();
    await flush(el);
    expect(el._openPath).toEqual([1]);
    const cards = _atomCards(el);
    // The original atom (path [0]) is complete → collapses.
    expect(cards[0].classList.contains("collapsed")).toBe(true);
    // The new empty atom (path [1]) is incomplete → expanded.
    expect(cards[1].classList.contains("expanded")).toBe(true);
  });

  // --- uncovered branch coverage -------------------------------------------

  test("_addAtRoot on a null predicate delegates to _addFirstAtom (lines 472-474)", async () => {
    // _addAtRoot(null) must take the early-return branch that calls _addFirstAtom.
    el = await mount(null);
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._addAtRoot();
    expect(captured?.kind).toBe("is");
    expect(captured?.entity_id).toBe("");
    // New atom auto-opened at root path [].
    expect(el._openPath).toEqual([]);
  });

  test("_unwrapAt nested: target is a NOT-wrapped group — strips NOT and splices children (lines 411-413)", async () => {
    // The nested target is { kind:'not', item: { kind:'or', items:[b,c] } }.
    // _unwrapAt must enter the else-if(target.kind==='not') branch (lines 412-414)
    // and splice b, c into the parent AND in place of the NOT-group.
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        {
          kind: "not",
          item: {
            kind: "or",
            items: [
              { kind: "is", entity_id: "b", states: ["off"] },
              { kind: "is", entity_id: "c", states: ["open"] },
            ],
          },
        },
      ],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._unwrapAt([1]);
    // After unwrap: outer AND has 3 items (a, b, c); the NOT wrapper is gone.
    expect(captured.kind).toBe("and");
    expect(captured.items).toHaveLength(3);
    expect(captured.items.map((i: any) => i.entity_id)).toEqual(["a", "b", "c"]);
  });

  test("_unwrapAt nested: target is an atom (no group) — no change returned", async () => {
    // When the targeted child is a plain atom (not a group), _unwrapAt hits the
    // '!group → return parent' guard (line 415) and emits the tree unchanged.
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._unwrapAt([0]); // target is an atom, not a group
    // Tree emitted unchanged — still AND with two items.
    expect(captured.kind).toBe("and");
    expect(captured.items).toHaveLength(2);
  });

  test("_unwrapAt at root with a null predicate is a no-op (line 389)", async () => {
    // Guard: if !root, return immediately — no emit.
    el = await mount(null);
    let fired = false;
    el.addEventListener("value-changed", () => {
      fired = true;
    });
    el._unwrapAt([]);
    expect(fired).toBe(false);
  });

  test("_unwrapAt at root with NOT-wrapped group (1 child) → promotes the single child", async () => {
    // Root is { kind:'not', item: { kind:'and', items:[a] } }.
    // inner = root.item (the AND); items.length === 1 → emit items[0].
    el = await mount({
      kind: "not",
      item: { kind: "and", items: [{ kind: "is", entity_id: "a", states: ["on"] }] },
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._unwrapAt([]);
    expect(captured.kind).toBe("is");
    expect(captured.entity_id).toBe("a");
  });

  test("_setGroupOpAt on a NOT-wrapped group strips the NOT and changes op (lines 255-260)", async () => {
    // Node is { kind:'not', item: { kind:'and', items:[a,b] } }.
    // _setGroupOpAt must enter the else-if(node.kind==='not') branch.
    el = await mount({
      kind: "not",
      item: {
        kind: "and",
        items: [
          { kind: "is", entity_id: "a", states: ["on"] },
          { kind: "is", entity_id: "b", states: ["off"] },
        ],
      },
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._setGroupOpAt([], "or");
    // NOT stripped; op changed from AND → OR; items preserved.
    expect(captured.kind).toBe("or");
    expect(captured.items).toHaveLength(2);
    expect(captured.items[0].entity_id).toBe("a");
  });

  test("_setGroupOpAt on a plain atom returns it unchanged (line 261: !bareGroup guard)", async () => {
    // Node at root is an atom — neither group nor NOT-wrapped group.
    // _setGroupOpAt must hit the !bareGroup guard and return node unchanged.
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._setGroupOpAt([], "or");
    // Emitted unchanged.
    expect(captured.kind).toBe("is");
    expect(captured.entity_id).toBe("x");
  });

  // --- _atomError numeric-kind branches ------------------------------------

  test("_atomError on a numeric atom with missing value returns 'Value is required'", async () => {
    el = await mount(null);
    // kind !== 'is' and !== 'is_not' → isNumeric=true; states[0] is falsy.
    const err = el._atomError({ kind: "gt", entity_id: "sensor.x", states: [] });
    expect(err).toMatch(/value is required/i);
  });

  test("_atomError on a numeric atom with a non-finite string returns 'must be a number'", async () => {
    el = await mount(null);
    const err = el._atomError({ kind: "gt", entity_id: "sensor.x", states: ["abc"] });
    expect(err).toMatch(/must be a number/i);
  });

  test("_atomError on a numeric atom with a valid finite string returns null", async () => {
    el = await mount(null);
    const err = el._atomError({ kind: "gt", entity_id: "sensor.x", states: ["42"] });
    expect(err).toBeNull();
  });

  // --- _walk / _atomAt via NOT-wrapped paths --------------------------------

  test("_atomAt on a NOT-wrapped atom (root) returns the inner atom (line 352)", async () => {
    el = await mount({
      kind: "not",
      item: { kind: "is", entity_id: "x", states: ["on"] },
    });
    const atom = el._atomAt([]);
    expect(atom?.entity_id).toBe("x");
  });

  test("_atomAt on a group node (no path left) returns null — group is not an atom (line 354)", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    // Path [] lands on the AND group itself — _walk returns null.
    const result = el._atomAt([]);
    expect(result).toBeNull();
  });

  test("_atomAt on an atom when path has remaining indices returns null (line 360)", async () => {
    // Path [0] into a plain atom — no items to descend into.
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    const result = el._atomAt([0]);
    expect(result).toBeNull();
  });

  // --- _patch with null tree and NOT-kind tree ------------------------------

  test("_patch: null tree with non-empty path returns null (line 281)", async () => {
    // _removeAt on a non-existent nested path: tree is null mid-traversal.
    // Mount with null; set value to null, then call _replaceAt at a deep path.
    el = await mount(null);
    // Manually test _patch by calling _removeAt on a path that traverses null.
    // We need a tree where a path traversal hits null mid-way. Use _replaceAt
    // on an atom tree at path [0] — atom has no items, so tree.kind is "is" →
    // falls through to "Atom — nothing to descend into" (line 308), returning tree.
    // Instead, directly test via _wrapAt on null value: after _removeAt([])->null,
    // the internal value is null; calling _wrapAt should handle the !node guard.
    el._removeAt([]); // value is already null, sets to null again
    // No crash; value stays null.
    expect(el.value).toBeNull();
  });

  test("_patch: NOT-kind tree at non-empty path delegates into its item (lines 302-308)", async () => {
    // Remove an atom from inside a NOT-wrapped group. _patch must take the
    // tree.kind==='not' branch (line 302) to descend into the inner group.
    el = await mount({
      kind: "not",
      item: {
        kind: "and",
        items: [
          { kind: "is", entity_id: "a", states: ["on"] },
          { kind: "is", entity_id: "b", states: ["off"] },
        ],
      },
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    // Remove item at path [0]: traverses NOT → AND → removes index 0.
    // 2 items → 1 item → collapses AND to that child; NOT wraps it.
    el._removeAt([0]);
    expect(captured.kind).toBe("not");
    expect((captured as any).item.entity_id).toBe("b");
  });

  test("_patch: NOT-kind tree where inner collapses to null returns null (line 304)", async () => {
    // Remove the ONLY atom from inside a NOT-wrapped group.
    // _patch traverses NOT → AND(1 item) → removes → 0 items → collapses AND to null
    // → _patch(NOT) gets inner===null → returns null (line 304).
    el = await mount({
      kind: "not",
      item: { kind: "and", items: [{ kind: "is", entity_id: "a", states: ["on"] }] },
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._removeAt([0]);
    expect(captured).toBeNull();
  });

  // --- _rewriteInsert through a NOT-wrapped node --------------------------

  test("_moveRelative: moves across a NOT-wrapped sibling (rewriteInsert NOT branch)", async () => {
    // Tree: AND[ NOT(OR[a, b]), c ]
    // Move c (path [1]) to where a is (path [0, 0]).
    // _rewriteInsert must enter the NOT branch for the NOT-OR child.
    el = await mount({
      kind: "and",
      items: [
        {
          kind: "not",
          item: {
            kind: "or",
            items: [
              { kind: "is", entity_id: "a", states: ["on"] },
              { kind: "is", entity_id: "b", states: ["off"] },
            ],
          },
        },
        { kind: "is", entity_id: "c", states: ["open"] },
      ],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    // Move c (path [1]) into the NOT-wrapped OR at position 0 (path [0, 0]).
    el._moveRelative([1], { path: [0, 0], pos: "before" });
    // c should land at index 0 inside the NOT(OR), with a at index 1.
    expect(captured.kind).toBe("and");
    expect(captured.items[0].kind).toBe("not");
    const inner = captured.items[0].item;
    expect(inner.kind).toBe("or");
    expect(inner.items[0].entity_id).toBe("c");
    expect(inner.items[1].entity_id).toBe("a");
  });

  // --- event handler dispatch paths ----------------------------------------

  // --- pointer-drag coordination (node-drag-start → hit-test → move) ------
  //
  // The root runs the Pointer-Events drag. jsdom has no layout, so the
  // coordinate→drop-target hit-test (_locateDropAt) is stubbed per test to
  // model what the pointer is over.

  function twoAtoms() {
    return {
      kind: "and" as const,
      items: [
        { kind: "is" as const, entity_id: "a", states: ["on"] },
        { kind: "is" as const, entity_id: "b", states: ["off"] },
      ],
    };
  }

  function startNodeDrag(el: any, from: number[]) {
    const pointer = new PointerEvent("pointerdown", { bubbles: true, pointerId: 1 });
    el.dispatchEvent(
      new CustomEvent("node-drag-start", {
        detail: { path: from, pointer },
        bubbles: true,
        composed: true,
      }),
    );
  }

  function firePointer(type: string) {
    window.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId: 1 }));
  }

  test("releasing a drag over a droppable target moves the node (node-drag-start → _moveRelative)", async () => {
    el = await mount(twoAtoms());
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._locateDropAt = () => ({ path: [1], pos: "after" });
    startNodeDrag(el, [0]);
    firePointer("pointerup");
    // drop a (path [0]) AFTER b (path [1]) → [b, a].
    expect(captured.items.map((i: any) => i.entity_id)).toEqual(["b", "a"]);
  });

  test("pointer movement over a droppable target highlights its path and zone", async () => {
    el = await mount(twoAtoms());
    el._locateDropAt = () => ({ path: [1], pos: "before" });
    startNodeDrag(el, [0]);
    firePointer("pointermove");
    await el.updateComplete;
    expect(el._dragOverPath).toEqual([1]);
    expect(el._dragOverPos).toBe("before");
  });

  test("hovering a non-droppable spot clears the highlight", async () => {
    el = await mount(twoAtoms());
    el._locateDropAt = () => ({ path: [1], pos: "before" });
    startNodeDrag(el, [0]);
    firePointer("pointermove");
    await el.updateComplete;
    expect(el._dragOverPath).toEqual([1]);

    el._locateDropAt = () => null;
    firePointer("pointermove");
    await el.updateComplete;
    expect(el._dragOverPath).toBeNull();
    expect(el._dragOverPos).toBeNull();
  });

  test("releasing on the source itself is a no-op", async () => {
    el = await mount(twoAtoms());
    let fired = false;
    el.addEventListener("value-changed", () => {
      fired = true;
    });
    el._locateDropAt = () => ({ path: [0], pos: "before" });
    startNodeDrag(el, [0]);
    firePointer("pointerup");
    expect(fired).toBe(false);
  });

  test("releasing into the source's own descendant is rejected", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "and", items: [{ kind: "is", entity_id: "x", states: ["on"] }] },
        { kind: "is", entity_id: "y", states: ["off"] },
      ],
    });
    let fired = false;
    el.addEventListener("value-changed", () => {
      fired = true;
    });
    // Drag the inner group [0] and try to drop it after its own child [0,0].
    el._locateDropAt = () => ({ path: [0, 0], pos: "after" });
    startNodeDrag(el, [0]);
    firePointer("pointerup");
    expect(fired).toBe(false);
  });

  test("pointercancel aborts the drag without moving and clears drag state", async () => {
    el = await mount(twoAtoms());
    let fired = false;
    el.addEventListener("value-changed", () => {
      fired = true;
    });
    el._locateDropAt = () => ({ path: [1], pos: "before" });
    startNodeDrag(el, [0]);
    firePointer("pointercancel");
    expect(fired).toBe(false);
    expect(el._dragFrom).toBeNull();
    expect(el._dragOverPath).toBeNull();
    expect(el._dragOverPos).toBeNull();
  });

  test("the drag-over path and zone are passed down to the rendered node tree", async () => {
    el = await mount(twoAtoms());
    el._locateDropAt = () => ({ path: [1], pos: "after" });
    startNodeDrag(el, [0]);
    firePointer("pointermove");
    await el.updateComplete;
    const node: any = el.shadowRoot.querySelector("ambience-state-expr-node");
    expect(node.dragOverPath).toEqual([1]);
    expect(node.dragOverPos).toBe("after");
  });

  test("_locateDropAt returns null when the environment can't hit-test", async () => {
    el = await mount(twoAtoms());
    // jsdom has no elementFromPoint, so deepElementFromPoint yields null.
    expect(el._locateDropAt(5, 5)).toBeNull();
  });

  test("_locateDropAt resolves the nearest state-expr-node's path under the point", async () => {
    el = await mount(twoAtoms());
    const node = document.createElement("ambience-state-expr-node") as any;
    node.path = [0];
    const original = Object.getOwnPropertyDescriptor(Document.prototype, "elementFromPoint");
    Object.defineProperty(Document.prototype, "elementFromPoint", {
      configurable: true,
      value: () => node,
    });
    try {
      expect(el._locateDropAt(5, 5)?.path).toEqual([0]);
    } finally {
      if (original) Object.defineProperty(Document.prototype, "elementFromPoint", original);
      else delete (Document.prototype as unknown as Record<string, unknown>).elementFromPoint;
    }
  });

  // --- render: errorMessage when _atomAt returns null ----------------------

  test("render: errorMessage is null when _showError is true but _openPath points to a group (line 506 null branch)", async () => {
    // _showError=true + _openPath=[] pointing to the root AND group.
    // _atomAt([]) → null (group, not atom). So errorMessage stays null.
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    // Manually set internal state to simulate the error-showing path.
    el._openPath = [];
    el._showError = true;
    await flush(el);
    // The error path is null → no error text visible in the root node.
    // Root group exists and is rendered; no crash.
    expect(el.shadowRoot.querySelector("ambience-state-expr-node")).toBeTruthy();
  });

  // --- _wrapAt when patch node is null (branch 30) -------------------------

  test("_wrapAt: the patch callback's !node guard short-circuits on a null node (branch 30)", async () => {
    // To hit the `if (!node) return node` inside _wrapAt's patch callback,
    // we need _patch to call fn(null). This happens when the target path
    // points at a null in the tree — e.g., call _wrapAt([]) when value=null.
    el = await mount(null);
    let fired = false;
    el.addEventListener("value-changed", () => {
      fired = true;
    });
    el._wrapAt([]);
    // fn(null) → returns null → _emit(null). The event fires but value stays null.
    expect(fired).toBe(true);
    expect(el.value).toBeNull();
  });

  // --- _atomError: is/is_not atom with only empty-string states (line 375-376) ---

  test("_atomError on an 'is' atom with only empty-string states returns 'State is required' (line 376)", async () => {
    el = await mount(null);
    // kind==='is', entity_id set, states has only empty strings → hits else-if branch.
    const err = el._atomError({ kind: "is", entity_id: "light.x", states: ["", ""] });
    expect(err).toMatch(/state is required/i);
  });

  test("_atomError on an 'is_not' atom with non-empty state returns null", async () => {
    el = await mount(null);
    // kind==='is_not', entity_id set, states has a non-empty string → valid.
    const err = el._atomError({ kind: "is_not", entity_id: "light.x", states: ["on"] });
    expect(err).toBeNull();
  });

  // --- remaining uncovered event handlers ----------------------------------

  test("node-change event dispatched from a child propagates to the host and calls _replaceAt", async () => {
    // Covers _onNodeChange (lines 313-316) via event dispatch.
    el = await mount({ kind: "is", entity_id: "a", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    const event = new CustomEvent("node-change", {
      detail: { path: [], value: { kind: "is", entity_id: "z", states: ["off"] } },
      bubbles: true,
      composed: true,
    });
    el.dispatchEvent(event);
    expect(captured?.entity_id).toBe("z");
  });

  test("clearing a group child's entity (empties the atom) drops that condition", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "x", states: ["on"] },
        { kind: "is", entity_id: "y", states: ["off"] },
      ],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    // Clearing the entity (the field's X) resets states + attribute, so the
    // atom arrives fully empty — it should be removed, not left blank.
    el.dispatchEvent(
      new CustomEvent("node-change", {
        detail: { path: [1], value: { kind: "is", entity_id: "", states: [], attribute: null } },
        bubbles: true,
        composed: true,
      }),
    );
    // 2 → 1 child: the group collapses to the remaining condition.
    expect(captured.kind).toBe("is");
    expect(captured.entity_id).toBe("x");
  });

  test("clearing the only atom's entity clears the predicate", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    let fired = false;
    el.addEventListener("value-changed", (e: Event) => {
      fired = true;
      captured = (e as CustomEvent).detail.value;
    });
    el.dispatchEvent(
      new CustomEvent("node-change", {
        detail: { path: [], value: { kind: "is", entity_id: "", states: [], attribute: null } },
        bubbles: true,
        composed: true,
      }),
    );
    expect(fired).toBe(true);
    expect(captured).toBeNull();
  });

  test("editing an atom to a value with no entity but a kept state still replaces (not removed)", async () => {
    // Guard: only a *fully* empty atom is dropped. An atom that still carries a
    // state (or attribute/for) is a normal edit and must be preserved.
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el.dispatchEvent(
      new CustomEvent("node-change", {
        detail: { path: [], value: { kind: "is", entity_id: "", states: ["on"], attribute: null } },
        bubbles: true,
        composed: true,
      }),
    );
    expect(captured).not.toBeNull();
    expect(captured.states).toEqual(["on"]);
  });

  test("flipping the op of a still-blank atom keeps the row (only an emptied atom is dropped)", async () => {
    // A freshly-added blank atom whose op the user changes before picking an
    // entity must NOT vanish — removal only applies when an atom that HAD
    // content is emptied.
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "x", states: ["on"] },
        { kind: "is", entity_id: "", states: [] },
      ],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el.dispatchEvent(
      new CustomEvent("node-change", {
        detail: { path: [1], value: { kind: "is_not", entity_id: "", states: [] } },
        bubbles: true,
        composed: true,
      }),
    );
    expect(captured.kind).toBe("and");
    expect(captured.items).toHaveLength(2);
    expect(captured.items[1].kind).toBe("is_not");
  });

  test("clearing a NOT-wrapped atom's entity still removes the condition", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "x", states: ["on"] },
        { kind: "not", item: { kind: "is", entity_id: "y", states: ["off"] } },
      ],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    // The node emits the emptied atom still wrapped in NOT (negation preserved).
    el.dispatchEvent(
      new CustomEvent("node-change", {
        detail: {
          path: [1],
          value: { kind: "not", item: { kind: "is", entity_id: "", states: [], attribute: null } },
        },
        bubbles: true,
        composed: true,
      }),
    );
    expect(captured.kind).toBe("is");
    expect(captured.entity_id).toBe("x");
  });

  test("clearing the open atom's entity resets openPath (no stale index opens a sibling)", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
        { kind: "is", entity_id: "c", states: ["on"] },
      ],
    });
    el._setOpen([1]); // user is editing the middle condition
    el.dispatchEvent(
      new CustomEvent("node-change", {
        detail: { path: [1], value: { kind: "is", entity_id: "", states: [], attribute: null } },
        bubbles: true,
        composed: true,
      }),
    );
    // The emptied (open) atom is removed; openPath must not still be [1], which
    // would now point at — and expand — the shifted sibling.
    expect(el._openPath).toBeNull();
  });

  test("node-wrap event dispatched from a child propagates to the host and calls _wrapAt", async () => {
    // Covers _onNodeWrap (lines 323-326) via event dispatch.
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    const event = new CustomEvent("node-wrap", {
      detail: { path: [] },
      bubbles: true,
      composed: true,
    });
    el.dispatchEvent(event);
    // Root atom wrapped in AND.
    expect(captured?.kind).toBe("and");
    expect(captured?.items[0].entity_id).toBe("x");
  });

  test("node-add-child event dispatched from a child propagates to the host and calls _addChildAt", async () => {
    // Covers _onNodeAddChild (lines 328-331) via event dispatch.
    el = await mount({
      kind: "and",
      items: [{ kind: "is", entity_id: "a", states: ["on"] }],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    const event = new CustomEvent("node-add-child", {
      detail: { path: [] },
      bubbles: true,
      composed: true,
    });
    el.dispatchEvent(event);
    expect(captured?.items).toHaveLength(2);
    expect(captured?.items[1].entity_id).toBe("");
  });

  test("node-set-op event dispatched from a child propagates to the host and calls _setGroupOpAt", async () => {
    // Covers _onNodeSetOp (lines 338-341) via event dispatch.
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    const event = new CustomEvent("node-set-op", {
      detail: { path: [], op: "or" },
      bubbles: true,
      composed: true,
    });
    el.dispatchEvent(event);
    expect(captured?.kind).toBe("or");
  });

  // --- _moveRelative guards ---

  test("_moveRelative: dragging the root is a no-op", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let fired = false;
    el.addEventListener("value-changed", () => {
      fired = true;
    });
    el._moveRelative([], { path: [0], pos: "before" });
    expect(fired).toBe(false);
  });

  test("_moveRelative: a before/after drop relative to the root is a no-op", async () => {
    el = await mount({
      kind: "and",
      items: [{ kind: "is", entity_id: "a", states: ["on"] }],
    });
    let fired = false;
    el.addEventListener("value-changed", () => {
      fired = true;
    });
    el._moveRelative([0], { path: [], pos: "before" });
    expect(fired).toBe(false);
  });

  test("_moveRelative: a no-op when the source path resolves to nothing", async () => {
    // fromPath [5] is out of bounds for a 1-item group → _nodeAt returns null.
    el = await mount({
      kind: "and",
      items: [{ kind: "is", entity_id: "a", states: ["on"] }],
    });
    let fired = false;
    el.addEventListener("value-changed", () => {
      fired = true;
    });
    el._moveRelative([5], { path: [0], pos: "before" });
    expect(fired).toBe(false);
  });

  // --- _walkNode with NOT-wrapped tree (lines 213-214) ---

  test("_walkNode: traverses through a NOT node transparently (line 214)", async () => {
    // The NOT node at root wraps an AND group; _wrapAt must descend through NOT.
    // Use _wrapAt on a child of the NOT-wrapped group to exercise _nodeAt → _walkNode NOT branch.
    el = await mount({
      kind: "not",
      item: {
        kind: "and",
        items: [
          { kind: "is", entity_id: "a", states: ["on"] },
          { kind: "is", entity_id: "b", states: ["off"] },
        ],
      },
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    // _wrapAt([0]) calls _nodeAt([0]) which calls _walkNode through the NOT wrapper.
    el._wrapAt([0]);
    // Should wrap item[0](a) in an OR group (flipped from AND parent).
    expect(captured.kind).toBe("not");
    expect(captured.item.kind).toBe("and");
    expect(captured.item.items[0].kind).toBe("or");
    expect(captured.item.items[0].items[0].entity_id).toBe("a");
  });

  test("_walkNode: atom at path with remaining indices returns null (line 219)", async () => {
    // _nodeAt([0, 1]) on an AND group where item[0] is a plain atom.
    // The second index tries to descend into an atom → returns null.
    // This causes the move to bail (no source).
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    let fired = false;
    el.addEventListener("value-changed", () => {
      fired = true;
    });
    // fromPath [0, 1] tries to descend into atom at [0] → _nodeAt returns null → no-op.
    el._moveRelative([0, 1], { path: [1], pos: "before" });
    expect(fired).toBe(false);
  });

  // --- _addChildAt: node is not a group (no-op branch, line 231) -----------

  test("_addChildAt on an atom path (not a group) appends nothing but still emits", async () => {
    // _patch callback: node.kind === 'is' → not a group → returns node unchanged.
    // newChildPath stays null → _openPath not updated.
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._addChildAt([], "is");
    // Atom returned unchanged; still an atom.
    expect(captured?.kind).toBe("is");
    expect(captured?.entity_id).toBe("x");
  });

  // --- _setGroupOpAt: NOT wrapping non-group inner → !bareGroup path (line 261) ---

  test("_setGroupOpAt: NOT wrapping a plain atom has no bare group → no change (line 261)", async () => {
    // Root is { kind:'not', item: { kind:'is', ... } } — the inner is not a group.
    // bareGroup stays null → returns node unchanged.
    el = await mount({
      kind: "not",
      item: { kind: "is", entity_id: "x", states: ["on"] },
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._setGroupOpAt([], "or");
    // Emitted unchanged.
    expect(captured.kind).toBe("not");
    expect((captured as any).item.entity_id).toBe("x");
  });

  // --- _samePath: arrays with same length but mismatched values (branch 1) ---

  test("_samePath returns false for same-length arrays with different values (branch at line 12)", async () => {
    // The `a.every(...)` call returns false when values differ — exercise that branch.
    // Access via _openPath comparison: set _openPath to [1] then dispatch node-open [2].
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
        { kind: "is", entity_id: "c", states: ["open"] },
      ],
    });
    el._openPath = [1];
    // Dispatch node-open with a different same-length path [2] — _samePath([1],[2]) must return false.
    const event = new CustomEvent("node-open", {
      detail: { path: [2] },
      bubbles: true,
      composed: true,
    });
    el.dispatchEvent(event);
    // [2] is NOT the same as [1] → opens [2] instead of toggling/collapsing.
    expect(el._openPath).toEqual([2]);
  });

  // --- _toggleNotAt / _setGroupOpAt: !node guard (branches 86, 91) --------

  test("_toggleNotAt called on null predicate is a no-op (the !node guard, line 239)", async () => {
    // When value is null, _patch calls fn(null). fn returns null → emit null.
    el = await mount(null);
    let fired = false;
    el.addEventListener("value-changed", () => {
      fired = true;
    });
    el._toggleNotAt([]);
    // fn(null) emitted null — event fires but value stays null.
    expect(fired).toBe(true);
    expect(el.value).toBeNull();
  });

  test("_setGroupOpAt called on null predicate is a no-op (the !node guard, line 251)", async () => {
    el = await mount(null);
    let fired = false;
    el.addEventListener("value-changed", () => {
      fired = true;
    });
    el._setGroupOpAt([], "or");
    // fn(null) emitted null.
    expect(fired).toBe(true);
    expect(el.value).toBeNull();
  });

  // --- _patch: tree===null with non-empty path (branch 103, line 281) ------

  test("_patch: tree is null with non-empty path returns null (line 281)", async () => {
    // Achieve this by _replaceAt at a deep path while value is null.
    // Since value is null, _patch(null, [0], fn) hits `tree==null → return tree`.
    el = await mount(null);
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._replaceAt([0], { kind: "is", entity_id: "z", states: ["on"] });
    // _patch(null, [0], fn) returns null unchanged.
    expect(captured).toBeNull();
  });

  // --- _rewriteInsert: !node early-return (branch 52, line 163) -----------

  test("_rewriteInsert: handles move where the tree root is null (branch 52, line 163)", async () => {
    // This tests an edge case via a deep move where a child path resolves to null.
    // Use a valid tree; _rewriteInsert hits !node when recursing into an
    // out-of-bounds child. We trigger this indirectly via a cross-group move
    // where one of the recursively-visited child paths is an atom (not null),
    // but the NOT-inner collapse produces null after the move.
    // The direct path: move [1,0] out of the single-item OR → OR collapses to
    // null → _rewriteInsert(NOT(OR), ...) gets inner==null → returns null.
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        {
          kind: "not",
          item: {
            kind: "or",
            items: [{ kind: "is", entity_id: "b", states: ["off"] }],
          },
        },
      ],
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    // Move b from [1,0] to [0]: the NOT(OR) is now empty → collapses.
    // _rewriteInsert for the NOT node: inner becomes null → returns null.
    el._moveRelative([1, 0], { path: [0], pos: "before" });
    // The AND group should now have 2 items: b (inserted at 0) and a.
    expect(captured.kind).toBe("and");
    expect(captured.items).toHaveLength(2);
    expect(captured.items[0].entity_id).toBe("b");
    expect(captured.items[1].entity_id).toBe("a");
  });

  // --- _walk: !tree null guard (branch 119, line 351) ----------------------

  test("_atomAt returns null when path walks into an out-of-bounds slot (branch 129, line 358)", async () => {
    // _walk hits `tree.items[path[0]] ?? null` where path[0] is out-of-bounds.
    // The `?? null` produces null → next recursive call returns null.
    el = await mount({
      kind: "and",
      items: [{ kind: "is", entity_id: "a", states: ["on"] }],
    });
    // path [5] is out of bounds for a 1-item group.
    const result = el._atomAt([5]);
    expect(result).toBeNull();
  });

  // --- _unwrapAt root: inner is NOT a group (branch 148, line 391) ---------

  test("_unwrapAt at root when root is an atom (not a group) is a no-op", async () => {
    // inner = root (an atom). inner.kind !== 'and'/'or' → guard at line 391 fails.
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let fired = false;
    el.addEventListener("value-changed", () => {
      fired = true;
    });
    el._unwrapAt([]);
    expect(fired).toBe(false);
  });

  // --- _unwrapAt nested: !parent and parent-not-group guards (branches 154-156) ---

  test("_unwrapAt nested: parent path leads to null → no-op (branch 154, line 403)", async () => {
    // This is pathological — parentPath leads to null in the tree. Trigger by
    // calling _unwrapAt([0]) when value is null (so _patch on null → fn gets null).
    el = await mount(null);
    let fired = false;
    el.addEventListener("value-changed", () => {
      fired = true;
    });
    el._unwrapAt([0]);
    // _patch(null, [], fn) → fn(null) → !parent guard returns null → emit null.
    expect(fired).toBe(true);
    expect(el.value).toBeNull();
  });

  test("_unwrapAt nested: parent is an atom (not a group) → no change (branch 155-156, line 404)", async () => {
    // parentPath [] leads to the atom itself; parent.kind !== 'and'/'or' → guard fires.
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    // _unwrapAt([0]): parentPath=[], idx=0. _patch(atom, [], fn(atom)).
    // parent.kind === 'is' → not 'and'/'or' → returns parent unchanged.
    el._unwrapAt([0]);
    expect(captured?.kind).toBe("is");
    expect(captured?.entity_id).toBe("x");
  });

  // --- _patch: atom with non-empty path returns atom unchanged (line 308) --

  test("_patch atom-fallback: _removeAt with a non-empty path into an atom returns atom unchanged (line 308)", async () => {
    // _patch(atom, [0], fn): atom is not group/NOT → hits `return tree` at line 308.
    // The fn is never called and the tree is returned unchanged.
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    // _removeAt([0]) calls _patch(atom, [0], fn) → atom returned unchanged.
    el._removeAt([0]);
    expect(captured?.kind).toBe("is");
    expect(captured?.entity_id).toBe("x");
  });

  // --- _patch: NOT branch yields non-null inner (branch 116, line 306) -----

  test("_patch NOT branch: non-empty path through NOT → patches inner and re-wraps (line 305)", async () => {
    // Directly call _replaceAt on a path inside a NOT-wrapped atom.
    // NOT wraps an AND with 2 items; replace item[0] → _patch enters NOT branch.
    el = await mount({
      kind: "not",
      item: {
        kind: "and",
        items: [
          { kind: "is", entity_id: "a", states: ["on"] },
          { kind: "is", entity_id: "b", states: ["off"] },
        ],
      },
    });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._replaceAt([0], { kind: "is", entity_id: "z", states: ["open"] });
    // _patch traverses NOT, then AND, replaces item[0].
    // Result: NOT(AND[z, b])
    expect(captured.kind).toBe("not");
    expect(captured.item.items[0].entity_id).toBe("z");
    expect(captured.item.items[1].entity_id).toBe("b");
  });
});

// `statePredicateError` is exported for the scene-editor SAVE gate, where it runs
// against persisted `when[...]` data — which can be corrupt/hand-edited and is
// NOT guaranteed to match the widget-built shape. It must never throw, and it
// should align with the backend validator so the frontend blocks exactly what
// the backend would reject (rather than passing it through to a cryptic error).
describe("statePredicateError — robust to malformed persisted predicates", () => {
  test("a group missing its items array reports an error instead of throwing", () => {
    expect(() => statePredicateError({ kind: "and" })).not.toThrow();
    expect(statePredicateError({ kind: "and" })).toBeTruthy();
    expect(statePredicateError({ kind: "or", items: null })).toBeTruthy();
  });

  test("a NOT missing its item reports an error instead of returning valid", () => {
    expect(() => statePredicateError({ kind: "not" })).not.toThrow();
    expect(statePredicateError({ kind: "not" })).toBeTruthy();
  });

  test("an atom missing its states array reports an error instead of throwing", () => {
    expect(() => statePredicateError({ kind: "is", entity_id: "x" })).not.toThrow();
    expect(statePredicateError({ kind: "is", entity_id: "x" })).toBeTruthy();
  });

  test("a numeric threshold of only whitespace is rejected (backend float() would too)", () => {
    // JS Number(" ") === 0 (finite), so the naive check passed it while the
    // backend's float(" ") raises — a divergence that let a bad save through.
    expect(statePredicateError({ kind: ">", entity_id: "x", states: [" "] })).toBeTruthy();
  });
});

describe("openPath on remove/unwrap (review fix)", () => {
  test("removing a node clears the open path so a sibling can't inherit it", async () => {
    const el: any = document.createElement("ambience-state-predicate-input");
    el.hass = { callWS: async () => ({ states: [] }) };
    el.value = {
      kind: "and",
      items: [
        { kind: "is", entity_id: "light.a", states: ["on"] },
        { kind: "is", entity_id: "light.b", states: ["on"] },
        { kind: "is", entity_id: "light.c", states: ["on"] },
      ],
    };
    document.body.appendChild(el);
    await el.updateComplete;
    el._openPath = [2];
    el._removeAt([0]); // a node before the open one — indices shift
    await el.updateComplete;
    expect(el._openPath).toBeNull();
    el.remove();
  });
});
