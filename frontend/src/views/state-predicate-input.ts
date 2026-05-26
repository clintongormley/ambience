import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "./state-expr-node.js";
import type { HassConnection } from "../api.js";
import { localize } from "../i18n.js";

function _samePath(a: number[] | null, b: number[] | null): boolean {
  if (a === null || b === null) return false;
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}
import type {
  StateAtom, StateExpr, StateGroup, StateNot, StatePredicate,
} from "../types.js";

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
   *  Mirrors the rule-editor pattern: errors only surface after a switch
   *  attempt, not from the start. Reset when the open atom becomes valid. */
  @state() private _showError = false;

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
  }

  private _emit(value: StatePredicate) {
    this.value = value;
    this.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value }, bubbles: true, composed: true,
    }));
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

  private _onNodeChange = (e: CustomEvent<{ path: number[]; value: StateExpr }>) => {
    e.stopPropagation();
    this._replaceAt(e.detail.path, e.detail.value);
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

  private _onNodeSetOp = (
    e: CustomEvent<{ path: number[]; op: "and" | "or" }>,
  ) => {
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

  /** Return a localized validation message for an atom, or null if valid. */
  _atomError(atom: StateAtom): string | null {
    if (!atom.entity_id) {
      return localize(this.hass, "ui.state_err_entity", "Entity is required");
    }
    const isNumeric =
      atom.kind !== "is" && atom.kind !== "is_not";
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
      if (v && this._openPath === null
          && v.kind !== "and" && v.kind !== "or") {
        this._openPath = [];
      }
      // If we're showing an error and the open atom became valid, drop it.
      if (this._showError && this._openPath !== null) {
        const current = this._atomAt(this._openPath);
        if (!current || this._atomError(current) === null) {
          this._showError = false;
        }
      }
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
    const errorMessage = this._showError && this._openPath !== null
      ? (() => {
          const atom = this._atomAt(this._openPath!);
          return atom ? this._atomError(atom) : null;
        })()
      : null;
    // Section-level + Add condition is needed only when the root doesn't
    // already provide one. A group root has its own + Add inside the card.
    // An atom root (or NOT-wrapped atom) doesn't, so we show it here.
    const inner = this.value.kind === "not"
      ? (this.value as StateNot).item
      : this.value;
    const showSectionAdd = inner.kind !== "and" && inner.kind !== "or";
    return html`
      <ambience-state-expr-node
        .hass=${this.hass}
        .value=${this.value}
        .path=${[]}
        .openPath=${this._openPath}
        .errorPath=${errorMessage ? this._openPath : null}
        .errorMessage=${errorMessage}
      ></ambience-state-expr-node>
      ${showSectionAdd ? html`
        <button class="root-add" @click=${() => this._addAtRoot()}>
          + ${localize(this.hass, "ui.state_add_condition", "Add condition")}
        </button>
      ` : ""}
    `;
  }

}
