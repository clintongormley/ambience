import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "./state-expr-node.js";
import type { HassConnection } from "../api.js";
import { emitValueChanged } from "../dom.js";
import { localize } from "../i18n.js";
import { deepElementFromPoint, startPointerDrag } from "../pointer-drag.js";

function _samePath(a: number[] | null, b: number[] | null): boolean {
  if (a === null || b === null) return false;
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

/** The meaningful inner node, peeling a top-level `not` wrapper (paths treat the
 *  `not` as transparent). Used to ask "is this node a group?" / "what's inside?" */
function _unwrapNot(node: StateExpr): StateExpr;
function _unwrapNot(node: StateExpr | null): StateExpr | null;
function _unwrapNot(node: StateExpr | null): StateExpr | null {
  return node && node.kind === "not" ? node.item : node;
}

import type {
  DropPos,
  StateAtom,
  StateExpr,
  StateGroup,
  StateNot,
  StatePredicate,
} from "../types.js";

/** A resolved insertion for a drag: append `into` the destination group, or
 *  place before/after the item at `index` in the destination parent. */
type _InsertSpec = { kind: "into" } | { kind: "before" | "after"; index: number };

/** State-predicate node kinds. Used to recognise a state predicate by shape so
 *  {@link statePredicateError} can ignore other condition shapes (template,
 *  people, …) it might be handed. */
const _STATE_KINDS = new Set(["is", "is_not", ">", ">=", "<", "<=", "and", "or", "not"]);

/** Return a localized validation message for a single atom, or null if valid.
 *  Pure (no component state) so the scene editor's save gate can reuse it. */
function _stateAtomError(atom: StateAtom, hass?: HassConnection): string | null {
  if (!atom.entity_id) {
    return localize(hass, "ui.state_err_entity", "Entity is required");
  }
  // `states` may be missing/non-array on persisted-but-corrupt data reaching the
  // save gate (the widget always builds an array). Treat anything else as empty.
  const states = Array.isArray(atom.states) ? atom.states : [];
  const isNumeric = atom.kind !== "is" && atom.kind !== "is_not";
  if (isNumeric) {
    const v = states[0];
    // Mirror the backend's float() parse: a non-string or whitespace-only value
    // is "missing" (JS `Number(" ")` is 0, so the trim guard is what rejects it).
    if (typeof v !== "string" || !v.trim()) {
      return localize(hass, "ui.state_err_value", "Value is required");
    }
    if (!Number.isFinite(Number(v))) {
      return localize(hass, "ui.state_err_numeric", "Value must be a number");
    }
  } else if (!states.some((s) => s !== "")) {
    return localize(hass, "ui.state_err_state", "State is required");
  }
  return null;
}

/** First validation error anywhere in an expression tree, or null when every
 *  atom is complete. Walks groups/NOT wrappers and validates each atom. */
function _stateTreeError(tree: StateExpr | null, hass?: HassConnection): string | null {
  if (!tree || typeof tree !== "object") return null;
  if (tree.kind === "not") {
    const item = (tree as StateNot).item;
    if (!item) return localize(hass, "ui.state_err_incomplete", "This condition is incomplete");
    return _stateTreeError(item, hass);
  }
  if (tree.kind === "and" || tree.kind === "or") {
    const items = (tree as StateGroup).items;
    // A corrupt group with no/invalid items would otherwise throw on `for…of`.
    if (!Array.isArray(items) || items.length === 0) {
      return localize(hass, "ui.state_err_incomplete", "This condition is incomplete");
    }
    for (const item of items) {
      const err = _stateTreeError(item, hass);
      if (err !== null) return err;
    }
    return null;
  }
  return _stateAtomError(tree as StateAtom, hass);
}

/** Structural validation for a whole state predicate: a localized message for
 *  the first incomplete atom, or null when complete (or not a state predicate).
 *
 *  Pure and exported so the scene editor can gate *saving* even when this widget
 *  was never mounted to announce its validity via `render-invalid-changed` —
 *  e.g. a scene loaded from storage whose state slot is left collapsed. Returns
 *  null for anything that isn't a state-predicate shape, mirroring how the
 *  editor's who-check ignores unrelated predicates. */
export function statePredicateError(pred: unknown, hass?: HassConnection): string | null {
  if (pred == null || typeof pred !== "object") return null; // "(any)" — no constraint
  const kind = (pred as { kind?: unknown }).kind;
  if (typeof kind !== "string" || !_STATE_KINDS.has(kind)) return null;
  return _stateTreeError(pred as StateExpr, hass);
}

/**
 * Root component for editing a state predicate. Holds the full expression
 * tree; renders an empty-state Add button when null, otherwise a single
 * recursive <ambience-state-expr-node>. Listens for node-* events from
 * descendants and rebuilds the tree via a single _patch helper.
 */
@customElement("ambience-state-predicate-input")
export class AmbienceStatePredicateInput extends LitElement {
  static override styles = css`
    :host { display: block; }
    .empty {
      border: 1px dashed var(--divider-color, #ccc);
      border-radius: 4px; padding: 0.75rem; text-align: center;
      color: var(--secondary-text-color, #888);
    }
    .empty button {
      background: transparent; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; padding: 0.25rem 0.75rem; cursor: pointer;
      color: inherit;
    }
    .root-add {
      display: block; margin-top: 0.5rem;
      background: transparent; border: 1px dashed var(--divider-color, #ccc);
      border-radius: 4px; padding: 0.25rem 0.75rem; cursor: pointer;
      color: inherit; width: 100%; text-align: center;
    }
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) value: StatePredicate = null;
  /** Path of the currently-expanded atom. `null` = none. Only one atom is
   *  expanded at a time; the form below the matching summary shows the
   *  editor, others render as summary + X. */
  @state() private _openPath: number[] | null = null;
  /** Set to true when the user tried to navigate away from an invalid atom.
   *  Mirrors the scene-editor pattern: errors only surface after a switch
   *  attempt, not from the start. Reset when the open atom becomes valid. */
  @state() private _showError = false;
  /** Path of the node currently being dragged, or null when idle. */
  @state() private _dragFrom: number[] | null = null;
  /** Path of the node the pointer is hovering as a drop target during a drag,
   *  threaded down to the node tree to drive the .drag-over highlight. */
  @state() private _dragOverPath: number[] | null = null;
  /** Which zone of the hovered drop target the pointer is in (before/into/after),
   *  threaded down to draw the right indicator. */
  @state() private _dragOverPos: DropPos | null = null;
  /** Detaches the active pointer drag's listeners; null when idle. */
  private _cancelDrag: (() => void) | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("node-change", this._onNodeChange as EventListener);
    this.addEventListener("node-remove", this._onNodeRemove as EventListener);
    this.addEventListener("node-wrap", this._onNodeWrap as EventListener);
    this.addEventListener("node-add-child", this._onNodeAddChild as EventListener);
    this.addEventListener("node-toggle-not", this._onNodeToggleNot as EventListener);
    this.addEventListener("node-set-op", this._onNodeSetOp as EventListener);
    this.addEventListener("node-open", this._onNodeOpen as EventListener);
    this.addEventListener("node-unwrap", this._onNodeUnwrap as EventListener);
    this.addEventListener("node-drag-start", this._onNodeDragStart as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    // Drop any in-flight drag so its window listeners don't outlive us.
    this._endDrag();
  }

  private _emit(value: StatePredicate) {
    this.value = value;
    emitValueChanged(this, value);
  }

  // --- mutation helpers (exposed for tests) ----------------------------

  _emptyAtom(): StateAtom {
    return { kind: "is", entity_id: "", states: [] };
  }

  _addFirstAtom() {
    // The new atom is the only one — open it so the form is visible.
    this._openPath = [];
    this._emit(this._emptyAtom());
  }

  /** Replace the node at `path` with `value`. */
  _replaceAt(path: number[], value: StateExpr) {
    const next = this._patch(this.value, path, () => value);
    this._emit(next);
  }

  /** Remove the node at `path`. Collapses empty groups to null and
   *  single-child groups to that single child. Root removal → null. */
  _removeAt(path: number[]) {
    // Indices shift under the open path when an earlier sibling goes away —
    // collapse instead of letting whichever node inherits the index expand
    // (the same hazard _onNodeChange already guards).
    this._openPath = null;
    if (path.length === 0) {
      this._emit(null);
      return;
    }
    const next = this._patch(this.value, path, () => null);
    this._emit(next);
  }

  /** Wrap the node at `path` in a new single-child group ("(…)"), choosing
   *  the wrapper's op so the new parens are MEANINGFUL (a same-op wrap is a
   *  semantic no-op the moment a sibling is added):
   *   - Wrapping a whole group: flip the group's OWN op (AND group → OR
   *     wrapper), so "(a AND b)" is ready to become "(a AND b) OR c".
   *   - Wrapping an atom: flip the PARENT's op (atom in AND → OR wrapper),
   *     defaulting to AND at the root where there's no parent.
   *  `_nodeAt` walks transparently through a NOT, so a NOT-wrapped group is
   *  recognised as a group; the NOT envelope is preserved inside the parens
   *  because `_patch` hands `fn` the raw (still-wrapped) node. */
  _wrapAt(path: number[]) {
    // Pick the wrapper op so the new parens are MEANINGFUL: a group flips its
    // OWN op, an atom flips its PARENT's op, and there's nothing to flip
    // against at the root — so default to AND.
    const target = this._nodeAt(path);
    let op: "and" | "or" = "and";
    if (target && (target.kind === "and" || target.kind === "or")) {
      op = target.kind === "and" ? "or" : "and";
    } else if (path.length > 0) {
      const parent = this._nodeAt(path.slice(0, -1));
      if (parent && (parent.kind === "and" || parent.kind === "or")) {
        op = parent.kind === "and" ? "or" : "and";
      }
    }
    const next = this._patch(this.value, path, (node) => {
      if (!node) return node;
      return { kind: op, items: [node] } as StateGroup;
    });
    this._emit(next);
  }

  /** Walk to a node at `path`. Paths index into group items; NOT
   *  wrappers are transparent (consume no index). */
  private _nodeAt(path: number[]): StateExpr | null {
    return this._walkNode(this.value, path);
  }

  /** Edge-zone drag: insert the dragged node `before`/`after` the target, or
   *  `into` a target group (append as its last child). Resolves the drop, then
   *  removes the source and inserts it in a single tree rewrite. */
  _moveRelative(fromPath: number[], target: { path: number[]; pos: DropPos }) {
    const ins = this._resolveInsertion(fromPath, target);
    if (!ins) return;
    this._emit(
      this._rewriteInsert(this.value, [], fromPath, ins.destParent, ins.insert, ins.source),
    );
  }

  /** Resolve an edge-zone drop to a concrete insertion, or null if it's not a
   *  valid move (onto itself, into its own subtree, a non-group `into`, or a
   *  sibling of the root). Pure — used by both the move and the drag-over
   *  droppability check. The insert is expressed relative to the TARGET (append,
   *  or before/after the item at `index` in `destParent`) rather than as a fixed
   *  index, so the rewriter places it correctly even when removing the source
   *  collapses an empty group ahead of it. */
  private _resolveInsertion(
    fromPath: number[],
    target: { path: number[]; pos: DropPos },
  ): { destParent: number[]; insert: _InsertSpec; source: StateExpr } | null {
    if (fromPath.length === 0) return null; // can't move the root
    if (_samePath(fromPath, target.path)) return null; // not onto itself
    const source = this._nodeAt(fromPath);
    if (!source) return null;

    if (target.pos === "into") {
      // Only a group (or a NOT wrapping one) can receive children.
      const inner = _unwrapNot(this._nodeAt(target.path));
      if (!inner || (inner.kind !== "and" && inner.kind !== "or")) return null;
      if (this._isPrefix(fromPath, target.path)) return null; // into self / descendant
      return { destParent: target.path, insert: { kind: "into" }, source };
    }
    if (target.path.length === 0) return null; // root has no siblings
    const destParent = target.path.slice(0, -1);
    if (this._isPrefix(fromPath, destParent)) return null; // sibling inside self
    return {
      destParent,
      insert: { kind: target.pos, index: target.path[target.path.length - 1] },
      source,
    };
  }

  private _isPrefix(prefix: number[], path: number[]): boolean {
    if (prefix.length > path.length) return false;
    return prefix.every((v, i) => v === path[i]);
  }

  /** Single-pass tree rewriter: drop the source from its old position AND insert
   *  it into the node at `destParent` per `insert` (append for `into`, else
   *  before/after the surviving target). Collapses ONLY 0-child groups, so an
   *  empty parent after the move disappears. The insert index is computed
   *  against the POST-removal list — the target item is tracked as it survives —
   *  so a group collapsing ahead of the target doesn't shift the source. */
  private _rewriteInsert(
    node: StatePredicate,
    nodePath: number[],
    fromPath: number[],
    destParent: number[],
    insert: _InsertSpec,
    source: StateExpr,
  ): StatePredicate {
    if (!node) return node;
    if (node.kind === "not") {
      const inner = this._rewriteInsert(
        (node as StateNot).item,
        nodePath,
        fromPath,
        destParent,
        insert,
        source,
      );
      if (inner == null) return null;
      return { kind: "not", item: inner as StateExpr };
    }
    if (node.kind !== "and" && node.kind !== "or") return node;

    const isFromParent = _samePath(nodePath, fromPath.slice(0, -1));
    const isToParent = _samePath(nodePath, destParent);

    // Rebuild the items with the source removed; recurse into the rest. A child
    // that collapses to null (its only child WAS the source) is dropped. Track
    // where the before/after target lands in the SURVIVING list.
    const out: StateExpr[] = [];
    let targetOutIdx = -1;
    node.items.forEach((child, i) => {
      if (isFromParent && i === fromPath[fromPath.length - 1]) return; // drop source
      const rewritten = this._rewriteInsert(
        child,
        [...nodePath, i],
        fromPath,
        destParent,
        insert,
        source,
      );
      if (rewritten === null) return;
      out.push(rewritten as StateExpr);
      if (isToParent && insert.kind !== "into" && i === insert.index) targetOutIdx = out.length - 1;
    });

    if (isToParent) {
      // A vanished target (can't happen for a valid drop) degrades to append,
      // never a negative splice — so a node is never silently lost.
      const at =
        insert.kind === "into" || targetOutIdx < 0
          ? out.length
          : insert.kind === "before"
            ? targetOutIdx
            : targetOutIdx + 1;
      out.splice(at, 0, source);
    }

    if (out.length === 0) return null;
    return { ...node, items: out };
  }

  // --- pointer-drag coordination ----------------------------------------
  //
  // Nodes only announce a drag (node-drag-start) and hand over the pointer;
  // the root runs the whole Pointer-Events gesture — hit-testing each move to
  // find the node under the finger, highlighting a valid target, and applying
  // the move on release. Centralising it here keeps drop-target hit-testing
  // (which must reach across every node's shadow root) in one place.

  private _onNodeDragStart = (e: CustomEvent<{ path: number[]; pointer: PointerEvent }>) => {
    e.stopPropagation();
    this._startDrag(e.detail.path, e.detail.pointer);
  };

  private _startDrag(from: number[], pointer: PointerEvent) {
    this._endDrag(); // defensively clear any prior drag
    this._dragFrom = from;
    this._dragOverPath = null;
    this._dragOverPos = null;
    // Drag the grabbed node's card under the pointer for feedback.
    const follow = (pointer.target as Element | null)?.closest(".atom-card, .group");
    this._cancelDrag = startPointerDrag(
      pointer,
      {
        onMove: (x, y) => {
          // A drop is valid only when _resolveInsertion accepts it; otherwise
          // show no indicator. pointermove fires continuously, so only reassign
          // (and re-render the tree) when the highlighted target/zone changes.
          const target = this._locateDropAt(x, y);
          const ok = target !== null && this._resolveInsertion(from, target) !== null;
          const path = ok ? target!.path : null;
          const pos = ok ? target!.pos : null;
          // Same target when both paths are equal arrays OR both null (a fresh
          // array each move means `_samePath`, not `===`; and `_samePath(null,
          // null)` is false, so the both-null case needs its own arm).
          const samePath =
            _samePath(path, this._dragOverPath) || (path === null && this._dragOverPath === null);
          if (!samePath || pos !== this._dragOverPos) {
            this._dragOverPath = path;
            this._dragOverPos = pos;
          }
        },
        onEnd: (x, y) => {
          const target = this._locateDropAt(x, y);
          if (target) this._moveRelative(from, target);
          this._endDrag();
        },
        onCancel: () => this._endDrag(),
      },
      { follow },
    );
  }

  private _endDrag() {
    this._cancelDrag?.();
    this._cancelDrag = null;
    this._dragFrom = null;
    this._dragOverPath = null;
    this._dragOverPos = null;
  }

  /** The nearest `<ambience-state-expr-node>` element under viewport (x, y), or
   *  null. Lives here (not on the node) because it must pierce every node's
   *  shadow root. */
  private _nodeElementAt(x: number, y: number): Element | null {
    let node: Node | null = deepElementFromPoint(x, y);
    while (node) {
      if (node instanceof Element && node.localName === "ambience-state-expr-node") {
        return node;
      }
      const parent = node.parentNode;
      if (parent) node = parent;
      else if (node instanceof ShadowRoot) node = node.host;
      else node = null;
    }
    return null;
  }

  /** Resolve the full edge-zone drop target (path + before/into/after) under
   *  viewport point (x, y), or null. Overridable in tests, where there is no
   *  layout to hit-test against. */
  private _locateDropAt(x: number, y: number): { path: number[]; pos: DropPos } | null {
    const el = this._nodeElementAt(x, y);
    const path = (el as unknown as { path?: number[] } | null)?.path;
    if (!el || !path) return null;
    const target = this._nodeAt([...path]);
    const inner = _unwrapNot(target);
    const isGroup = Boolean(inner) && (inner!.kind === "and" || inner!.kind === "or");
    const pos = this._zoneFor(el.getBoundingClientRect(), y, {
      isGroup,
      isRoot: path.length === 0,
    });
    return pos ? { path: [...path], pos } : null;
  }

  /** Which edge zone the pointer (viewport `y`) sits in over a node's box.
   *  A group has a thin top/bottom band (≤8px) for `before`/`after` and a wide
   *  `into` middle — so hovering the header or padding drops into the group; an
   *  atom isn't a container, so it splits 50/50 into `before`/`after`. The root
   *  has no parent, so the only meaningful drop is `into` (a root group) or
   *  nothing (a root atom). */
  private _zoneFor(
    rect: { top: number; bottom: number; height: number },
    y: number,
    opts: { isGroup: boolean; isRoot: boolean },
  ): DropPos | null {
    if (opts.isRoot) return opts.isGroup ? "into" : null;
    if (opts.isGroup) {
      const edge = Math.min(8, rect.height / 3);
      if (y < rect.top + edge) return "before";
      if (y > rect.bottom - edge) return "after";
      return "into";
    }
    return y < rect.top + rect.height / 2 ? "before" : "after";
  }

  private _walkNode(tree: StateExpr | null, path: number[]): StateExpr | null {
    if (!tree) return null;
    if (tree.kind === "not") return this._walkNode((tree as StateNot).item, path);
    if (path.length === 0) return tree;
    if (tree.kind === "and" || tree.kind === "or") {
      return this._walkNode(tree.items[path[0]] ?? null, path.slice(1));
    }
    return null;
  }

  _addChildAt(path: number[], _kind: "is") {
    // Capture the new child's path so we can open it after the patch lands.
    let newChildPath: number[] | null = null;
    const next = this._patch(this.value, path, (node) => {
      if (!node) return node;
      // The target group may be NOT-wrapped — paths treat NOT as transparent,
      // so "Add clause" on a negated group lands here with the {kind:'not'}
      // envelope. Peel it, append to the inner group, then re-wrap so the
      // negation survives (mirrors _setGroupOpAt / _unwrapAt).
      const isNot = node.kind === "not";
      const group = _unwrapNot(node);
      if (group.kind === "and" || group.kind === "or") {
        const items = [...group.items, this._emptyAtom()];
        newChildPath = [...path, items.length - 1];
        const grown: StateExpr = { ...group, items };
        return isNot ? ({ kind: "not", item: grown } as StateNot) : grown;
      }
      return node;
    });
    if (newChildPath !== null) this._openPath = newChildPath;
    this._emit(next);
  }

  _toggleNotAt(path: number[]) {
    const next = this._patch(this.value, path, (node) => {
      if (!node) return node;
      if (node.kind === "not") return (node as StateNot).item;
      return { kind: "not", item: node } as StateNot;
    });
    this._emit(next);
  }

  /** Set the operator of the group at `path`. Strips any legacy outer NOT
   *  wrap; whole-group negation isn't exposed in the UI any more — per-row
   *  NOT toggles handle child-level negation instead. */
  _setGroupOpAt(path: number[], op: "and" | "or") {
    const next = this._patch(this.value, path, (node) => {
      if (!node) return node;
      let bareGroup: StateGroup | null = null;
      if (node.kind === "and" || node.kind === "or") {
        bareGroup = node as StateGroup;
      } else if (node.kind === "not") {
        const inner = (node as StateNot).item;
        if (inner.kind === "and" || inner.kind === "or") {
          bareGroup = inner as StateGroup;
        }
      }
      if (!bareGroup) return node;
      return { kind: op, items: bareGroup.items } as StateGroup;
    });
    this._emit(next);
  }

  /**
   * Walk to `path` in `tree` and replace the target with `fn(target)`. A
   * `null` return from `fn` means "delete this node". Cleans up groups:
   *   - group with 0 items → null (collapsed by the parent step)
   *   - group with 1 item  → that item (no need for the wrapper)
   */
  private _patch(
    tree: StatePredicate,
    path: number[],
    fn: (node: StateExpr | null) => StateExpr | null,
  ): StatePredicate {
    if (path.length === 0) {
      return fn(tree);
    }
    if (tree == null) return tree;
    const [idx, ...rest] = path;
    if (tree.kind === "and" || tree.kind === "or") {
      const originalLength = tree.items.length;
      const items = tree.items.slice();
      const replaced = this._patch(items[idx], rest, fn);
      if (replaced === null) {
        items.splice(idx, 1);
      } else {
        items[idx] = replaced as StateExpr;
      }
      // Collapse only when items actually SHRUNK (i.e. a removal). Pure
      // replacements (like wrapping a child) preserve the parent group
      // even if it has a single child — otherwise the wrap is invisible
      // and looks like the parent's op just flipped.
      if (items.length < originalLength) {
        if (items.length === 0) return null;
        if (items.length === 1) return items[0];
      }
      return { ...tree, items };
    }
    if (tree.kind === "not") {
      const inner = this._patch((tree as StateNot).item, path, fn);
      if (inner == null) return null;
      return { kind: "not", item: inner as StateExpr };
    }
    // Atom — nothing to descend into.
    return tree;
  }

  // --- event handlers ---------------------------------------------------

  /** True for an atom carrying no condition at all — no entity, no non-empty
   *  state, no attribute, no duration. Clearing the entity (its field X) resets
   *  states + attribute, so the atom arrives here fully empty. */
  private _isEmptyAtom(node: StateExpr): boolean {
    // A negated atom is empty when its inner atom is — clearing the entity of a
    // NOT-wrapped atom should still drop the whole condition.
    if (node.kind === "not") return this._isEmptyAtom((node as StateNot).item);
    if (node.kind === "and" || node.kind === "or") return false;
    const atom = node as StateAtom;
    return !atom.entity_id && atom.states.every((s) => s === "") && !atom.attribute && !atom.for;
  }

  private _onNodeChange = (e: CustomEvent<{ path: number[]; value: StateExpr }>) => {
    e.stopPropagation();
    const { path, value } = e.detail;
    // An atom the user just emptied (typically by clearing its entity via the
    // field's X, which also resets states + attribute) carries no condition, so
    // drop it rather than leaving a blank row — mirroring how clearing a value
    // row removes that row. Only when it WAS carrying something: editing a
    // still-blank atom (e.g. flipping its op before picking an entity) keeps it.
    if (this._isEmptyAtom(value)) {
      const prev = this._atomAt(path);
      if (prev && !this._isEmptyAtom(prev)) {
        // The emptied atom is the open one; collapse so a stale openPath can't
        // expand whichever sibling shifts into its index.
        this._openPath = null;
        this._removeAt(path);
        return;
      }
    }
    this._replaceAt(path, value);
  };

  private _onNodeRemove = (e: CustomEvent<{ path: number[] }>) => {
    e.stopPropagation();
    this._removeAt(e.detail.path);
  };

  private _onNodeWrap = (e: CustomEvent<{ path: number[] }>) => {
    e.stopPropagation();
    this._wrapAt(e.detail.path);
  };

  private _onNodeAddChild = (e: CustomEvent<{ path: number[] }>) => {
    e.stopPropagation();
    this._addChildAt(e.detail.path, "is");
  };

  private _onNodeToggleNot = (e: CustomEvent<{ path: number[] }>) => {
    e.stopPropagation();
    this._toggleNotAt(e.detail.path);
  };

  private _onNodeSetOp = (e: CustomEvent<{ path: number[]; op: "and" | "or" }>) => {
    e.stopPropagation();
    this._setGroupOpAt(e.detail.path, e.detail.op);
  };

  /** Locate the atom at a given path. Skips NOT wrappers transparently
   *  (they don't consume a path index). Returns null if the path lands on
   *  a group node or runs off the end. */
  _atomAt(path: number[]): StateAtom | null {
    return this._walk(this.value, path);
  }

  private _walk(tree: StateExpr | null, path: number[]): StateAtom | null {
    if (!tree) return null;
    if (tree.kind === "not") return this._walk((tree as StateNot).item, path);
    if (path.length === 0) {
      if (tree.kind === "and" || tree.kind === "or") return null;
      return tree as StateAtom;
    }
    if (tree.kind === "and" || tree.kind === "or") {
      return this._walk(tree.items[path[0]] ?? null, path.slice(1));
    }
    return null;
  }

  /** First validation error anywhere in the tree, or null when every atom is
   *  complete. Walks groups/NOT wrappers and validates each atom with
   *  {@link _atomError}. Used to tell the parent scene editor (via
   *  `render-invalid-changed`) that an incomplete predicate must not be left in
   *  the scene — otherwise a half-filled atom (e.g. entity picked, value blank)
   *  would silently survive when the user navigates to another condition. */
  _treeError(tree: StatePredicate = this.value): string | null {
    return _stateTreeError(tree, this.hass);
  }

  private _lastValidity: string | null | undefined;

  /** Mirror of the template condition's validity channel: announce to the scene
   *  editor whether this predicate is currently complete, so it can block
   *  closing/leaving an invalid slot. Deduped so it only fires on transitions. */
  private _emitValidity() {
    const error = this._treeError();
    if (this._lastValidity === error) return;
    this._lastValidity = error;
    this.dispatchEvent(
      new CustomEvent("render-invalid-changed", {
        detail: { error },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** Return a localized validation message for an atom, or null if valid. */
  _atomError(atom: StateAtom): string | null {
    return _stateAtomError(atom, this.hass);
  }

  /** The X button on a group header maps to this. Behaviour:
   *  - At root: 1 child → become that child (undoes a wrap); 2+ → clear.
   *  - Nested: splice the group's children into the parent's items list
   *    ("remove the parens, keep the clauses"). */
  _unwrapAt(path: number[]) {
    this._openPath = null;
    if (path.length === 0) {
      // Root case: peel the group, keep a single child or clear entirely.
      const root = this.value;
      if (!root) return;
      const inner = _unwrapNot(root);
      if (inner.kind === "and" || inner.kind === "or") {
        if (inner.items.length === 1) {
          this._emit(inner.items[0]);
        } else {
          this._emit(null);
        }
      }
      return;
    }
    const parentPath = path.slice(0, -1);
    const idx = path[path.length - 1];
    const next = this._patch(this.value, parentPath, (parent) => {
      if (!parent) return parent;
      if (parent.kind !== "and" && parent.kind !== "or") return parent;
      const items = parent.items.slice();
      const target = items[idx];
      // Locate the underlying group (strip any NOT wrap on the target).
      let group: StateGroup | null = null;
      if (target.kind === "and" || target.kind === "or") {
        group = target as StateGroup;
      } else if (target.kind === "not") {
        const inner = (target as StateNot).item;
        if (inner.kind === "and" || inner.kind === "or") group = inner as StateGroup;
      }
      if (!group) return parent;
      items.splice(idx, 1, ...group.items);
      return { ...parent, items };
    });
    this._emit(next);
  }

  private _onNodeUnwrap = (e: CustomEvent<{ path: number[] }>) => {
    e.stopPropagation();
    this._unwrapAt(e.detail.path);
  };

  private _onNodeOpen = (e: CustomEvent<{ path: number[] }>) => {
    e.stopPropagation();
    // Refuse to switch (or collapse) away from an invalid open atom — surface
    // the error instead so the user sees what needs fixing.
    if (this._openPath !== null) {
      const current = this._atomAt(this._openPath);
      if (current && this._atomError(current) !== null) {
        this._showError = true;
        return;
      }
    }
    // Click on the currently-open atom → collapse it (toggle behavior).
    if (this._openPath !== null && _samePath(this._openPath, e.detail.path)) {
      this._openPath = null;
    } else {
      this._openPath = e.detail.path;
    }
    this._showError = false;
  };

  /** Clear `_showError` once the open atom is valid again. */
  override willUpdate(changed: Map<string, unknown>) {
    if (changed.has("value")) {
      const v = this.value;
      if (v && this._openPath === null && v.kind !== "and" && v.kind !== "or") {
        this._openPath = [];
      }
      // If we're showing an error and the open atom became valid, drop it.
      if (this._showError && this._openPath !== null) {
        const current = this._atomAt(this._openPath);
        if (!current || this._atomError(current) === null) {
          this._showError = false;
        }
      }
      // Tell the parent scene editor whether the whole predicate is complete,
      // so it can block leaving an incomplete state condition behind.
      this._emitValidity();
    }
  }

  /** Add a sibling to the root expression.
   *  - If root is a group: append an empty atom child.
   *  - Otherwise: wrap the root in an AND group with [root, emptyAtom],
   *    making the first composition discoverable from a lone atom or
   *    NOT-wrapped atom. */
  _addAtRoot() {
    const value = this.value;
    if (value == null) {
      this._addFirstAtom();
      return;
    }
    if (value.kind === "and" || value.kind === "or") {
      this._addChildAt([], "is");
      return;
    }
    // Atom or NOT-wrapped atom — wrap the whole thing in AND with a sibling.
    // The new (empty) atom is at index 1; open it.
    this._openPath = [1];
    this._emit({ kind: "and", items: [value, this._emptyAtom()] });
  }

  /** Set the currently-expanded atom by path. */
  _setOpen(path: number[] | null) {
    this._openPath = path;
  }

  override render() {
    if (this.value == null) {
      return html`
        <div class="empty">
          <button @click=${() => this._addFirstAtom()}>
            + ${localize(this.hass, "ui.state_add_first", "Add clause")}
          </button>
        </div>
      `;
    }
    // Error message for the currently-open atom, only visible after the user
    // tried to navigate away while it was invalid.
    const errorMessage =
      this._showError && this._openPath !== null
        ? (() => {
            const atom = this._atomAt(this._openPath!);
            return atom ? this._atomError(atom) : null;
          })()
        : null;
    // Section-level + Add clause is needed only when the root doesn't
    // already provide one. A group root has its own + Add inside the card.
    // An atom root (or NOT-wrapped atom) doesn't, so we show it here.
    const inner = _unwrapNot(this.value);
    const showSectionAdd = inner.kind !== "and" && inner.kind !== "or";
    return html`
      <ambience-state-expr-node
        .hass=${this.hass}
        .value=${this.value}
        .path=${[]}
        .openPath=${this._openPath}
        .dragOverPath=${this._dragOverPath}
        .dragOverPos=${this._dragOverPos}
        .dragFromPath=${this._dragFrom}
        .errorPath=${errorMessage ? this._openPath : null}
        .errorMessage=${errorMessage}
      ></ambience-state-expr-node>
      ${
        showSectionAdd
          ? html`
        <button class="root-add" @click=${() => this._addAtRoot()}>
          + ${localize(this.hass, "ui.state_add_condition", "Add clause")}
        </button>
      `
          : ""
      }
    `;
  }
}
