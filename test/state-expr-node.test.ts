import { afterEach, describe, expect, test, vi } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  getKnownStates: vi.fn(async () => ({ states: ["on", "off"] })),
}));

import "../frontend/src/views/state-expr-node";
import "../frontend/src/views/state-expr-atom";
import type { StateAtom, StateExpr } from "../frontend/src/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function mount(
  value: StateExpr,
  opts: { path?: number[]; openPath?: number[] | null } = {},
): Promise<any> {
  const el: any = document.createElement("ambience-state-expr-node");
  el.value = value;
  el.hass = {};
  el.path = opts.path ?? [];
  if ("openPath" in opts) el.openPath = opts.openPath;
  document.body.appendChild(el);
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  return el;
}

async function flush(el: any): Promise<void> {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
}

// ---------------------------------------------------------------------------
// Atom card rendering
// ---------------------------------------------------------------------------

describe("ambience-state-expr-node — atom", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("renders an atom card (collapsed) when value is an atom and path doesn't match openPath", async () => {
    el = await mount(
      { kind: "is", entity_id: "sensor.x", states: ["on"] },
      { path: [0], openPath: null },
    );
    const card = el.shadowRoot.querySelector(".atom-card");
    expect(card).toBeTruthy();
    expect(card.classList.contains("collapsed")).toBe(true);
  });

  test("renders an atom card (expanded) when path matches openPath", async () => {
    el = await mount(
      { kind: "is", entity_id: "sensor.x", states: ["on"] },
      { path: [0], openPath: [0] },
    );
    const card = el.shadowRoot.querySelector(".atom-card");
    expect(card).toBeTruthy();
    expect(card.classList.contains("expanded")).toBe(true);
    expect(card.querySelector("ambience-state-expr-atom")).toBeTruthy();
  });

  test("expanded atom body contains <ambience-state-expr-atom> with the atom value", async () => {
    el = await mount(
      { kind: "is", entity_id: "binary_sensor.door", states: ["on"] },
      { path: [0], openPath: [0] },
    );
    const atom: any = el.shadowRoot.querySelector("ambience-state-expr-atom");
    expect(atom).toBeTruthy();
    expect(atom.value.entity_id).toBe("binary_sensor.door");
  });

  // --- value-changed from inner atom bubbles as node-change (lines 294-295) ---

  test("value-changed from the inner atom emits node-change with the new value (line 294-295)", async () => {
    el = await mount(
      { kind: "is", entity_id: "sensor.x", states: ["on"] },
      { path: [2], openPath: [2] },
    );
    let captured: any;
    el.addEventListener("node-change", (e: CustomEvent) => {
      captured = e.detail;
    });
    const atom: any = el.shadowRoot.querySelector("ambience-state-expr-atom");
    const newAtom: StateAtom = { kind: "is", entity_id: "sensor.x", states: ["off"] };
    atom.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: newAtom },
        bubbles: true,
        composed: true,
      }),
    );
    expect(captured).toBeDefined();
    expect(captured.path).toEqual([2]);
    expect(captured.value.states).toEqual(["off"]);
  });

  test("editing a NOT-wrapped atom re-wraps the change in NOT (negation is preserved)", async () => {
    el = await mount(
      { kind: "not", item: { kind: "is", entity_id: "sensor.x", states: ["on"] } },
      { path: [2], openPath: [2] },
    );
    let captured: any;
    el.addEventListener("node-change", (e: CustomEvent) => {
      captured = e.detail;
    });
    const atom: any = el.shadowRoot.querySelector("ambience-state-expr-atom");
    atom.dispatchEvent(
      new CustomEvent("value-changed", {
        // The atom editor emits only the bare inner atom (state on → off).
        detail: { value: { kind: "is", entity_id: "sensor.x", states: ["off"] } },
        bubbles: true,
        composed: true,
      }),
    );
    expect(captured.value.kind).toBe("not");
    expect(captured.value.item.states).toEqual(["off"]);
  });

  test("value-changed from inner atom stops propagation (does not leak as value-changed)", async () => {
    el = await mount(
      { kind: "is", entity_id: "sensor.x", states: ["on"] },
      { path: [0], openPath: [0] },
    );
    let leaked = false;
    el.addEventListener("value-changed", () => {
      leaked = true;
    });
    const atom: any = el.shadowRoot.querySelector("ambience-state-expr-atom");
    atom.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { kind: "is", entity_id: "sensor.x", states: ["off"] } },
        bubbles: true,
        composed: true,
      }),
    );
    expect(leaked).toBe(false);
  });

  // --- error display ---

  test("error message is shown when errorPath matches this node's path", async () => {
    el = await mount({ kind: "is", entity_id: "", states: [] }, { path: [0], openPath: [0] });
    el.errorPath = [0];
    el.errorMessage = "Entity is required";
    await flush(el);
    expect(el.shadowRoot.querySelector(".atom-error")).toBeTruthy();
    expect(el.shadowRoot.querySelector(".atom-error")!.textContent).toContain("Entity is required");
  });

  test("error message is NOT shown when errorPath does not match", async () => {
    el = await mount(
      { kind: "is", entity_id: "sensor.x", states: ["on"] },
      { path: [0], openPath: [0] },
    );
    el.errorPath = [1];
    el.errorMessage = "Some error";
    await flush(el);
    expect(el.shadowRoot.querySelector(".atom-error")).toBeNull();
  });

  // --- header buttons emit events ---

  test("clicking the NOT toggle emits node-toggle-not with the correct path", async () => {
    el = await mount({ kind: "is", entity_id: "sensor.x", states: ["on"] }, { path: [1] });
    let captured: any;
    el.addEventListener("node-toggle-not", (e: CustomEvent) => {
      captured = e.detail;
    });
    const toggle = el.shadowRoot.querySelector("button.not-toggle") as HTMLButtonElement;
    toggle.click();
    expect(captured.path).toEqual([1]);
  });

  test("clicking NOT toggle does NOT also fire node-open (stopPropagation)", async () => {
    el = await mount({ kind: "is", entity_id: "sensor.x", states: ["on"] }, { path: [0] });
    let openFired = false;
    el.addEventListener("node-open", () => {
      openFired = true;
    });
    const toggle = el.shadowRoot.querySelector("button.not-toggle") as HTMLButtonElement;
    toggle.click();
    expect(openFired).toBe(false);
  });

  test("clicking the atom header emits node-open", async () => {
    el = await mount({ kind: "is", entity_id: "sensor.x", states: ["on"] }, { path: [0] });
    let captured: any;
    el.addEventListener("node-open", (e: CustomEvent) => {
      captured = e.detail;
    });
    const header = el.shadowRoot.querySelector(".atom-header") as HTMLElement;
    header.click();
    expect(captured.path).toEqual([0]);
  });

  test("clicking the wrap button emits node-wrap with the correct path", async () => {
    el = await mount({ kind: "is", entity_id: "sensor.x", states: ["on"] }, { path: [0] });
    let captured: any;
    el.addEventListener("node-wrap", (e: CustomEvent) => {
      captured = e.detail;
    });
    const wrapBtn = el.shadowRoot.querySelector("button.wrap") as HTMLButtonElement;
    wrapBtn.click();
    expect(captured.path).toEqual([0]);
  });

  test("clicking the remove button emits node-remove", async () => {
    el = await mount({ kind: "is", entity_id: "sensor.x", states: ["on"] }, { path: [0] });
    let captured: any;
    el.addEventListener("node-remove", (e: CustomEvent) => {
      captured = e.detail;
    });
    const removeBtn = el.shadowRoot.querySelector("button.remove") as HTMLButtonElement;
    removeBtn.click();
    expect(captured.path).toEqual([0]);
  });

  test("NOT-wrapped atom renders the not-toggle with class 'on'", async () => {
    el = await mount(
      { kind: "not", item: { kind: "is", entity_id: "sensor.x", states: ["on"] } },
      { path: [0] },
    );
    const toggle = el.shadowRoot.querySelector("button.not-toggle");
    expect(toggle?.classList.contains("on")).toBe(true);
  });

  // --- placeholder summary ---

  test("incomplete atom (no entity_id) shows placeholder text", async () => {
    el = await mount({ kind: "is", entity_id: "", states: [] }, { path: [0] });
    const summary = el.shadowRoot.querySelector(".summary");
    expect(summary?.classList.contains("placeholder")).toBe(true);
  });

  test("complete atom shows non-placeholder summary", async () => {
    el = await mount({ kind: "is", entity_id: "sensor.temp", states: ["on"] }, { path: [0] });
    const summary = el.shadowRoot.querySelector(".summary");
    expect(summary?.classList.contains("placeholder")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Group rendering
// ---------------------------------------------------------------------------

describe("ambience-state-expr-node — group", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("renders a group card with .group and .group-header", async () => {
    el = await mount({ kind: "and", items: [{ kind: "is", entity_id: "x", states: ["on"] }] });
    expect(el.shadowRoot.querySelector(".group")).toBeTruthy();
    expect(el.shadowRoot.querySelector(".group-header")).toBeTruthy();
  });

  test("group contains a select.group-op with and/or options", async () => {
    el = await mount({ kind: "and", items: [{ kind: "is", entity_id: "x", states: ["on"] }] });
    const sel = el.shadowRoot.querySelector("select.group-op") as HTMLSelectElement;
    expect(sel).toBeTruthy();
    const values = Array.from(sel.options).map((o) => o.value);
    expect(values).toEqual(["and", "or"]);
  });

  // --- change event on the group-op select emits node-set-op (lines 346-347) ---

  test("changing select.group-op emits node-set-op with new op (line 346-347)", async () => {
    el = await mount(
      { kind: "and", items: [{ kind: "is", entity_id: "x", states: ["on"] }] },
      { path: [0] },
    );
    let captured: any;
    el.addEventListener("node-set-op", (e: CustomEvent) => {
      captured = e.detail;
    });
    const sel = el.shadowRoot.querySelector("select.group-op") as HTMLSelectElement;
    sel.value = "or";
    sel.dispatchEvent(new Event("change", { bubbles: true }));
    expect(captured).toBeDefined();
    expect(captured.op).toBe("or");
    expect(captured.path).toEqual([0]);
  });

  test("changing group-op from 'or' to 'and' emits the right op", async () => {
    el = await mount(
      { kind: "or", items: [{ kind: "is", entity_id: "x", states: ["on"] }] },
      { path: [0] },
    );
    let captured: any;
    el.addEventListener("node-set-op", (e: CustomEvent) => {
      captured = e.detail;
    });
    const sel = el.shadowRoot.querySelector("select.group-op") as HTMLSelectElement;
    sel.value = "and";
    sel.dispatchEvent(new Event("change", { bubbles: true }));
    expect(captured.op).toBe("and");
  });

  test("clicking the unwrap button emits node-unwrap", async () => {
    el = await mount(
      { kind: "and", items: [{ kind: "is", entity_id: "x", states: ["on"] }] },
      { path: [0] },
    );
    let captured: any;
    el.addEventListener("node-unwrap", (e: CustomEvent) => {
      captured = e.detail;
    });
    const unwrapBtn = el.shadowRoot.querySelector("button.unwrap") as HTMLButtonElement;
    unwrapBtn.click();
    expect(captured.path).toEqual([0]);
  });

  test("'+ Add condition' button emits node-add-child", async () => {
    el = await mount(
      { kind: "and", items: [{ kind: "is", entity_id: "x", states: ["on"] }] },
      { path: [0] },
    );
    let captured: any;
    el.addEventListener("node-add-child", (e: CustomEvent) => {
      captured = e.detail;
    });
    const addBtn = el.shadowRoot.querySelector(".actions button") as HTMLButtonElement;
    addBtn.click();
    expect(captured.path).toEqual([0]);
  });

  test("group renders child nodes as <ambience-state-expr-node>", async () => {
    el = await mount({
      kind: "and",
      items: [
        { kind: "is", entity_id: "a", states: ["on"] },
        { kind: "is", entity_id: "b", states: ["off"] },
      ],
    });
    const children = el.shadowRoot.querySelectorAll("ambience-state-expr-node");
    expect(children.length).toBe(2);
  });

  test("child nodes receive the correct path (parent path + index)", async () => {
    el = await mount(
      {
        kind: "and",
        items: [
          { kind: "is", entity_id: "a", states: ["on"] },
          { kind: "is", entity_id: "b", states: ["off"] },
        ],
      },
      { path: [1] },
    );
    const children = Array.from(
      el.shadowRoot.querySelectorAll("ambience-state-expr-node"),
    ) as any[];
    expect(children[0].path).toEqual([1, 0]);
    expect(children[1].path).toEqual([1, 1]);
  });

  // --- external NOT toggle on group ---

  test("nested group (non-root) renders the external NOT toggle button", async () => {
    el = await mount(
      { kind: "and", items: [{ kind: "is", entity_id: "x", states: ["on"] }] },
      { path: [0] },
    );
    const extNot = el.shadowRoot.querySelector("button.not-toggle.external");
    expect(extNot).toBeTruthy();
  });

  test("root group (path=[]) does NOT render the external NOT toggle", async () => {
    el = await mount(
      { kind: "and", items: [{ kind: "is", entity_id: "x", states: ["on"] }] },
      { path: [] },
    );
    const extNot = el.shadowRoot.querySelector("button.not-toggle.external");
    expect(extNot).toBeNull();
  });

  test("external NOT toggle has class 'on' when group is wrapped in NOT", async () => {
    el = await mount(
      {
        kind: "not",
        item: { kind: "and", items: [{ kind: "is", entity_id: "x", states: ["on"] }] },
      },
      { path: [0] },
    );
    const extNot = el.shadowRoot.querySelector("button.not-toggle.external");
    expect(extNot?.classList.contains("on")).toBe(true);
  });

  test("external NOT toggle does NOT have class 'on' when group is not negated", async () => {
    el = await mount(
      { kind: "and", items: [{ kind: "is", entity_id: "x", states: ["on"] }] },
      { path: [0] },
    );
    const extNot = el.shadowRoot.querySelector("button.not-toggle.external");
    expect(extNot?.classList.contains("on")).toBe(false);
  });

  test("clicking external NOT toggle emits node-toggle-not", async () => {
    el = await mount(
      { kind: "and", items: [{ kind: "is", entity_id: "x", states: ["on"] }] },
      { path: [0] },
    );
    let captured: any;
    el.addEventListener("node-toggle-not", (e: CustomEvent) => {
      captured = e.detail;
    });
    const extNot = el.shadowRoot.querySelector("button.not-toggle.external") as HTMLButtonElement;
    extNot.click();
    expect(captured.path).toEqual([0]);
  });
});

// ---------------------------------------------------------------------------
// Drag-and-drop
// ---------------------------------------------------------------------------

describe("ambience-state-expr-node — drag-and-drop (Pointer Events)", () => {
  let el: any;
  afterEach(() => el?.remove());

  // --- drag handle presence ---

  test("a non-root atom renders a drag handle", async () => {
    el = await mount({ kind: "is", entity_id: "sensor.x", states: ["on"] }, { path: [0] });
    expect(el.shadowRoot.querySelector(".atom-header .drag-handle")).toBeTruthy();
  });

  test("the root atom (path=[]) renders no drag handle — there's nowhere to move it", async () => {
    el = await mount({ kind: "is", entity_id: "sensor.x", states: ["on"] }, { path: [] });
    expect(el.shadowRoot.querySelector(".drag-handle")).toBeNull();
  });

  test("a non-root group renders a drag handle", async () => {
    el = await mount(
      { kind: "and", items: [{ kind: "is", entity_id: "x", states: ["on"] }] },
      { path: [0] },
    );
    expect(el.shadowRoot.querySelector(".group-header .drag-handle")).toBeTruthy();
  });

  test("the root group renders no drag handle", async () => {
    el = await mount(
      { kind: "and", items: [{ kind: "is", entity_id: "x", states: ["on"] }] },
      { path: [] },
    );
    expect(el.shadowRoot.querySelector(".drag-handle")).toBeNull();
  });

  // --- pointerdown on the handle starts a drag ---

  test("pointerdown on the handle emits node-drag-start carrying this node's path and the pointer", async () => {
    el = await mount({ kind: "is", entity_id: "sensor.x", states: ["on"] }, { path: [1] });
    let captured: any;
    el.addEventListener("node-drag-start", (e: CustomEvent) => {
      captured = e.detail;
    });
    const handle = el.shadowRoot.querySelector(".drag-handle") as HTMLElement;
    const evt = new PointerEvent("pointerdown", { bubbles: true, pointerId: 1, isPrimary: true });
    handle.dispatchEvent(evt);
    expect(captured).toBeDefined();
    expect(captured.path).toEqual([1]);
    expect(captured.pointer).toBe(evt);
  });

  test("a non-primary pointer / secondary button on the handle does NOT start a drag", async () => {
    el = await mount({ kind: "is", entity_id: "sensor.x", states: ["on"] }, { path: [1] });
    let fired = false;
    el.addEventListener("node-drag-start", () => {
      fired = true;
    });
    const handle = el.shadowRoot.querySelector(".drag-handle") as HTMLElement;
    handle.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true, pointerId: 2, isPrimary: false }),
    );
    handle.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true, pointerId: 1, isPrimary: true, button: 2 }),
    );
    expect(fired).toBe(false);
  });

  test("pointerdown on the handle does not also fire node-open (drag must not expand the atom)", async () => {
    el = await mount({ kind: "is", entity_id: "sensor.x", states: ["on"] }, { path: [1] });
    let opened = false;
    el.addEventListener("node-open", () => {
      opened = true;
    });
    const handle = el.shadowRoot.querySelector(".drag-handle") as HTMLElement;
    handle.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true, pointerId: 1, isPrimary: true }),
    );
    handle.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(opened).toBe(false);
  });

  // --- drag-over highlight is driven by dragOverPath from the root ---

  test("atom card gets the drag-over class when dragOverPath matches this node's path", async () => {
    el = await mount({ kind: "is", entity_id: "sensor.x", states: ["on"] }, { path: [0] });
    el.dragOverPath = [0];
    await flush(el);
    expect(el.shadowRoot.querySelector(".atom-card")?.classList.contains("drag-over")).toBe(true);
  });

  test("atom card has no drag-over class when dragOverPath differs", async () => {
    el = await mount({ kind: "is", entity_id: "sensor.x", states: ["on"] }, { path: [0] });
    el.dragOverPath = [1];
    await flush(el);
    expect(el.shadowRoot.querySelector(".atom-card")?.classList.contains("drag-over")).toBe(false);
  });

  test("group card gets the drag-over class when dragOverPath matches this node's path", async () => {
    el = await mount(
      { kind: "and", items: [{ kind: "is", entity_id: "x", states: ["on"] }] },
      { path: [0] },
    );
    el.dragOverPath = [0];
    await flush(el);
    expect(el.shadowRoot.querySelector(".group")?.classList.contains("drag-over")).toBe(true);
  });

  test("the dragged node dims (atom card gets the dragging class when dragFromPath matches)", async () => {
    el = await mount({ kind: "is", entity_id: "sensor.x", states: ["on"] }, { path: [0] });
    el.dragFromPath = [0];
    await flush(el);
    expect(el.shadowRoot.querySelector(".atom-card")?.classList.contains("dragging")).toBe(true);
  });

  test("a non-dragged node does not dim", async () => {
    el = await mount({ kind: "is", entity_id: "sensor.x", states: ["on"] }, { path: [0] });
    el.dragFromPath = [1];
    await flush(el);
    expect(el.shadowRoot.querySelector(".atom-card")?.classList.contains("dragging")).toBe(false);
  });

  test("the dragged group dims (group gets the dragging class when dragFromPath matches)", async () => {
    el = await mount(
      { kind: "and", items: [{ kind: "is", entity_id: "x", states: ["on"] }] },
      { path: [0] },
    );
    el.dragFromPath = [0];
    await flush(el);
    expect(el.shadowRoot.querySelector(".group")?.classList.contains("dragging")).toBe(true);
  });

  test("child nodes inherit dragFromPath", async () => {
    el = await mount(
      {
        kind: "and",
        items: [
          { kind: "is", entity_id: "a", states: ["on"] },
          { kind: "is", entity_id: "b", states: ["off"] },
        ],
      },
      { path: [] },
    );
    el.dragFromPath = [0];
    await flush(el);
    const children = Array.from(
      el.shadowRoot.querySelectorAll("ambience-state-expr-node"),
    ) as any[];
    expect(children[0].dragFromPath).toEqual([0]);
    expect(children[1].dragFromPath).toEqual([0]);
  });

  test("child nodes inherit dragOverPath so deep drop targets can highlight", async () => {
    el = await mount(
      {
        kind: "and",
        items: [
          { kind: "is", entity_id: "a", states: ["on"] },
          { kind: "is", entity_id: "b", states: ["off"] },
        ],
      },
      { path: [] },
    );
    el.dragOverPath = [1];
    await flush(el);
    const children = Array.from(
      el.shadowRoot.querySelectorAll("ambience-state-expr-node"),
    ) as any[];
    expect(children[0].dragOverPath).toEqual([1]);
    expect(children[1].dragOverPath).toEqual([1]);
  });
});
