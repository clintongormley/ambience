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

import type { StateAtom, StateExpr, StateGroup, StateNot, StatePredicate } from "../types.js";

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
    if (path.length === 0) {
      this._emit(null);
      return;
    }
    const next = this._patch(this.value, path, () => null);
    this._emit(next);
  }

  /** Wrap the node at `path` in a new single-child group whose op is the
   *  OPPOSITE of the parent's op (AND inside OR → wrap in OR; OR inside
   *  AND → wrap in AND). Wrapping in the same op as the parent would be a
   *  no-op semantically, so flipping is the only useful choice. At the
   *  root there is no parent — default to AND. */
  _wrapAt(path: number[]) {
    let parentKind: "and" | "or" | null = null;
    if (path.length > 0) {
      const parent = this._nodeAt(path.slice(0, -1));
      if (parent && (parent.kind === "and" || parent.kind === "or")) {
        parentKind = parent.kind;
      }
    }
    const op: "and" | "or" = parentKind === "and" ? "or" : "and";
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

  /** Move the node at `fromPath` to the position currently held by the
   *  node at `toPath`. Used by drag-and-drop. Cross-group moves work
   *  naturally; same-parent moves adjust the destination index for the
   *  source's removal so the source lands where the target visually was.
   *
   *  Refuses to move a node into its own descendants (you can't drop a
   *  group inside itself). */
  _moveAt(fromPath: number[], toPath: number[]) {
    if (this._isPrefix(fromPath, toPath)) return;
    if (fromPath.length === 0) return; // can't drag the root
    if (toPath.length === 0) return; // can't drop on the root
    const source = this._nodeAt(fromPath);
    if (!source) return;
    const next = this._rewriteForMove(this.value, [], fromPath, toPath, source);
    this._emit(next);
  }

  private _isPrefix(prefix: number[], path: number[]): boolean {
    if (prefix.length > path.length) return false;
    return prefix.every((v, i) => v === path[i]);
  }

  /** Single-pass tree rewriter: drops the source from its old position
   *  AND inserts it at the destination position. Doesn't collapse single-
   *  child groups (collapses ONLY 0-child groups so an empty parent after
   *  the move disappears). */
  private _rewriteForMove(
    node: StatePredicate,
    nodePath: number[],
    fromPath: number[],
    toPath: number[],
    source: StateExpr,
  ): StatePredicate {
    if (!node) return node;
    if (node.kind === "not") {
      const inner = this._rewriteForMove(
        (node as StateNot).item,
        nodePath,
        fromPath,
        toPath,
        source,
      );
      if (inner == null) return null;
      return { kind: "not", item: inner as StateExpr };
    }
    if (node.kind !== "and" && node.kind !== "or") return node;

    const fromParent = fromPath.slice(0, -1);
    const toParent = toPath.slice(0, -1);
    const isFromParent = _samePath(nodePath, fromParent);
    const isToParent = _samePath(nodePath, toParent);

    // First, build the items list with the source removed (if this is its
    // parent). Other items rewrite recursively; any child that collapses
    // to null after the move (e.g. its only child WAS the source) is
    // dropped from the new list.
    const out: StateExpr[] = [];
    node.items.forEach((child, i) => {
      const childPath = [...nodePath, i];
      if (isFromParent && i === fromPath[fromPath.length - 1]) return;
      const rewritten = this._rewriteForMove(child, childPath, fromPath, toPath, source);
      if (rewritten !== null) out.push(rewritten as StateExpr);
    });

    // Insert the source at the target's ORIGINAL index in the post-
    // removal list. No adjustment needed — typical drag semantics:
    // "drop on B → source ends up where B was; B (and later items)
    // shift to make room."
    if (isToParent) {
      const insertIdx = toPath[toPath.length - 1];
      out.splice(insertIdx, 0, source);
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
    // Drag the grabbed node's card under the pointer for feedback.
    const follow = (pointer.target as Element | null)?.closest(".atom-card, .group");
    this._cancelDrag = startPointerDrag(
      pointer,
      {
        onMove: (x, y) => {
          const to = this._locatePathAt(x, y);
          const next = this._isDroppable(from, to) ? to : null;
          // pointermove fires continuously and _locatePathAt returns a fresh
          // array each time; only reassign (and re-render the tree) when the
          // highlighted target actually changes.
          const changed =
            next === null ? this._dragOverPath !== null : !_samePath(next, this._dragOverPath);
          if (changed) this._dragOverPath = next;
        },
        onEnd: (x, y) => {
          const to = this._locatePathAt(x, y);
          if (this._isDroppable(from, to)) this._moveAt(from, to);
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
  }

  /** A drop target is droppable when it's a real non-root node other than the
   *  source itself, and not inside the source's own subtree. */
  private _isDroppable(from: number[], to: number[] | null): to is number[] {
    return to !== null && to.length > 0 && !_samePath(from, to) && !this._isPrefix(from, to);
  }

  /** Resolve the path of the node under viewport point (x, y), or null. Lives
   *  here (not on the node) because it must pierce every node's shadow root.
   *  Overridable in tests, where there is no layout to hit-test against. */
  private _locatePathAt(x: number, y: number): number[] | null {
    let node: Node | null = deepElementFromPoint(x, y);
    while (node) {
      if (node instanceof Element && node.localName === "ambience-state-expr-node") {
        const path = (node as unknown as { path?: number[] }).path;
        return path ? [...path] : null;
      }
      const parent = node.parentNode;
      if (parent) node = parent;
      else if (node instanceof ShadowRoot) node = node.host;
      else node = null;
    }
    return null;
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
      if (node && (node.kind === "and" || node.kind === "or")) {
        const items = [...node.items, this._emptyAtom()];
        newChildPath = [...path, items.length - 1];
        return { ...node, items };
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
    if (!tree) return null;
    if (tree.kind === "not") return this._treeError((tree as StateNot).item);
    if (tree.kind === "and" || tree.kind === "or") {
      for (const item of tree.items) {
        const err = this._treeError(item);
        if (err !== null) return err;
      }
      return null;
    }
    return this._atomError(tree as StateAtom);
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
    if (!atom.entity_id) {
      return localize(this.hass, "ui.state_err_entity", "Entity is required");
    }
    const isNumeric = atom.kind !== "is" && atom.kind !== "is_not";
    if (isNumeric) {
      const v = atom.states[0];
      if (!v) return localize(this.hass, "ui.state_err_value", "Value is required");
      if (!Number.isFinite(Number(v))) {
        return localize(this.hass, "ui.state_err_numeric", "Value must be a number");
      }
    } else if (!atom.states.some((s) => s !== "")) {
      return localize(this.hass, "ui.state_err_state", "State is required");
    }
    return null;
  }

  /** The X button on a group header maps to this. Behaviour:
   *  - At root: 1 child → become that child (undoes a wrap); 2+ → clear.
   *  - Nested: splice the group's children into the parent's items list
   *    ("remove the parens, keep the clauses"). */
  _unwrapAt(path: number[]) {
    if (path.length === 0) {
      // Root case: peel the group, keep a single child or clear entirely.
      const root = this.value;
      if (!root) return;
      const inner = root.kind === "not" ? (root as StateNot).item : root;
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
            + ${localize(this.hass, "ui.state_add_first", "Add condition")}
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
    // Section-level + Add condition is needed only when the root doesn't
    // already provide one. A group root has its own + Add inside the card.
    // An atom root (or NOT-wrapped atom) doesn't, so we show it here.
    const inner = this.value.kind === "not" ? (this.value as StateNot).item : this.value;
    const showSectionAdd = inner.kind !== "and" && inner.kind !== "or";
    return html`
      <ambience-state-expr-node
        .hass=${this.hass}
        .value=${this.value}
        .path=${[]}
        .openPath=${this._openPath}
        .dragOverPath=${this._dragOverPath}
        .dragFromPath=${this._dragFrom}
        .errorPath=${errorMessage ? this._openPath : null}
        .errorMessage=${errorMessage}
      ></ambience-state-expr-node>
      ${
        showSectionAdd
          ? html`
        <button class="root-add" @click=${() => this._addAtRoot()}>
          + ${localize(this.hass, "ui.state_add_condition", "Add condition")}
        </button>
      `
          : ""
      }
    `;
  }
}
