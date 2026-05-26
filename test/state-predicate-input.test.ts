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

  test("_wrapAt on a child of an AND group creates an OR sub-group (flip parent's op)", async () => {
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "a", states: ["on"] },
      { kind: "is", entity_id: "b", states: ["off"] },
    ]});
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._wrapAt([1]);
    expect(captured.items[1].kind).toBe("or");
    expect(captured.items[1].items[0].entity_id).toBe("b");
  });

  test("_wrapAt on a child of an OR group creates an AND sub-group (flip parent's op)", async () => {
    el = await mount({ kind: "or", items: [
      { kind: "is", entity_id: "a", states: ["on"] },
      { kind: "is", entity_id: "b", states: ["off"] },
    ]});
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._wrapAt([0]);
    expect(captured.items[0].kind).toBe("and");
    expect(captured.items[0].items[0].entity_id).toBe("a");
  });

  test("_wrapAt at root has no parent → defaults to AND", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    el._wrapAt([]);
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

  test("there's no root-toolbar — wrap/clear live on each atom card / group header", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    expect(el.shadowRoot.querySelector(".root-toolbar")).toBeNull();
  });

  test("atom root shows a section-level '+ Add condition' (only way to add a sibling)", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    expect(el.shadowRoot.querySelector(".root-add")).toBeTruthy();
  });

  test("group root hides the section-level '+ Add condition' (the group already has one inside)", async () => {
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "a", states: ["on"] },
      { kind: "is", entity_id: "b", states: ["off"] },
    ]});
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

  test("root toolbar is gone entirely", async () => {
    el = await mount({ kind: "is", entity_id: "x", states: ["on"] });
    expect(el.shadowRoot.querySelector(".root-toolbar")).toBeNull();
  });

  test("group dropdown has only AND and OR options (no AND_NOT / OR_NOT)", async () => {
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "a", states: ["on"] },
      { kind: "is", entity_id: "b", states: ["off"] },
    ]});
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
    el = await mount({ kind: "and", items: [
      { kind: "not", item: { kind: "is", entity_id: "a", states: ["on"] } },
      { kind: "is", entity_id: "b", states: ["off"] },
    ]});
    await flush(el);
    // Each atom card now owns its own NOT toggle in the header.
    const cards = _atomCards(el);
    expect(cards[0].querySelector(".atom-header .not-toggle")?.classList.contains("on")).toBe(true);
    expect(cards[1].querySelector(".atom-header .not-toggle")?.classList.contains("on")).toBe(false);
    // The external child-actions toolbar is gone.
    const childActions = el.shadowRoot.querySelectorAll(".child-actions");
    expect(childActions.length).toBe(0);
  });

  test("clicking a child atom's NOT toggle (inside the header) wraps it in {kind:'not'}", async () => {
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "a", states: ["on"] },
      { kind: "is", entity_id: "b", states: ["off"] },
    ]});
    await flush(el);
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    const cards = _atomCards(el);
    const toggle = cards[0].querySelector(".atom-header .not-toggle") as HTMLButtonElement;
    toggle.click();
    await flush(el);
    expect(captured.items[0].kind).toBe("not");
    expect(captured.items[0].item.entity_id).toBe("a");
  });

  test("clicking the NOT toggle does NOT also expand/collapse the atom (click is consumed)", async () => {
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "a", states: ["on"] },
      { kind: "is", entity_id: "b", states: ["off"] },
    ]});
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
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
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
      sr.querySelectorAll(".atom-card").forEach((c) => out.push(c as HTMLElement));
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
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "",        states: [] },  // incomplete
      { kind: "is", entity_id: "person.b", states: ["home"] },
    ]});
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
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "a", states: ["on"] },
      { kind: "is", entity_id: "b", states: ["off"] },
    ]});
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
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "a", states: ["on"] },
      { kind: "is", entity_id: "b", states: ["off"] },
    ]});
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
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "a", states: ["on"] },
      { kind: "is", entity_id: "b", states: ["off"] },
    ]});
    el._setOpen([1]);
    await flush(el);
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    const cardA = _atomCards(el)[0];
    (cardA.querySelector(".remove") as HTMLButtonElement).click();
    await flush(el);
    // The 2-item group collapses to the lone remaining atom (b).
    expect(captured.kind).toBe("is");
    expect(captured.entity_id).toBe("b");
  });

  test("clicking the open atom's header collapses it (toggle)", async () => {
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "a", states: ["on"] },
      { kind: "is", entity_id: "b", states: ["off"] },
    ]});
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
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "",       states: [] },   // invalid
      { kind: "is", entity_id: "b",      states: ["off"] },
    ]});
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
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "",     states: [] },   // invalid (open)
      { kind: "is", entity_id: "person.b", states: ["home"] },
    ]});
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
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "",     states: [] },
      { kind: "is", entity_id: "person.b", states: ["home"] },
    ]});
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
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "",     states: [] },
      { kind: "is", entity_id: "person.b", states: ["home"] },
    ]});
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
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "a", states: ["on"] },
      { kind: "is", entity_id: "b", states: ["off"] },
    ]});
    await flush(el);
    // child-actions div is removed entirely.
    const childActions = el.shadowRoot.querySelectorAll(".child-actions");
    expect(childActions.length).toBe(0);
  });

  test("the X on a NESTED group header unwraps (promotes children to parent), it doesn't delete them", async () => {
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "a", states: ["on"] },
      { kind: "or", items: [
        { kind: "is", entity_id: "b", states: ["off"] },
        { kind: "is", entity_id: "c", states: ["open"] },
      ]},
    ]});
    await flush(el);

    // Collect every .group-header in the tree (root first, then nested).
    const allHeaders: HTMLElement[] = [];
    const visit = (sr: ShadowRoot | null) => {
      if (!sr) return;
      sr.querySelectorAll(".group-header").forEach((h) => allHeaders.push(h as HTMLElement));
      sr.querySelectorAll("ambience-state-expr-node").forEach((n) => visit((n as any).shadowRoot));
    };
    visit(el.shadowRoot);
    const innerHeader = allHeaders[1];  // [0] = root group, [1] = nested OR
    expect(innerHeader).toBeTruthy();
    const x = innerHeader!.querySelector("button.unwrap") as HTMLButtonElement;
    expect(x).toBeTruthy();
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
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
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "a", states: ["on"] },
    ]});
    await flush(el);
    const visit = (sr: ShadowRoot | null): HTMLElement | null => {
      if (!sr) return null;
      return sr.querySelector(".group-header") as HTMLElement | null;
    };
    const rootHeader = visit(el.shadowRoot.querySelector("ambience-state-expr-node")?.shadowRoot);
    const x = rootHeader!.querySelector("button.unwrap") as HTMLButtonElement;
    expect(x).toBeTruthy();
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    x.click();
    await flush(el);
    // Single child → the root becomes that child (undoes the wrap).
    expect(captured.kind).toBe("is");
    expect(captured.entity_id).toBe("a");
  });

  test("the root group header X clears the predicate when the group has 2+ items", async () => {
    el = await mount({ kind: "and", items: [
      { kind: "is", entity_id: "a", states: ["on"] },
      { kind: "is", entity_id: "b", states: ["off"] },
    ]});
    await flush(el);
    const visit = (sr: ShadowRoot | null): HTMLElement | null => {
      if (!sr) return null;
      return sr.querySelector(".group-header") as HTMLElement | null;
    };
    const rootHeader = visit(el.shadowRoot.querySelector("ambience-state-expr-node")?.shadowRoot);
    const x = rootHeader!.querySelector("button.unwrap") as HTMLButtonElement;
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => { captured = (e as CustomEvent).detail.value; });
    x.click();
    await flush(el);
    expect(captured).toBeNull();
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
});
