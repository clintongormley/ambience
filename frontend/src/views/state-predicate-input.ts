import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./state-expr-node.js";
import type { HassConnection } from "../api.js";
import { localize } from "../i18n.js";
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
    .root-toolbar {
      display: flex; justify-content: flex-end; gap: 0.25rem;
      margin-bottom: 0.25rem;
    }
    .root-toolbar button {
      background: transparent; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; padding: 0.15rem 0.4rem; cursor: pointer;
      font-size: 0.85em; color: inherit;
    }
    .root-toolbar .not-toggle.on {
      background: var(--warning-color, #ffd);
      border-color: var(--warning-color, #cc9);
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

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("node-change", this._onNodeChange as EventListener);
    this.addEventListener("node-remove", this._onNodeRemove as EventListener);
    this.addEventListener("node-wrap", this._onNodeWrap as EventListener);
    this.addEventListener("node-add-child", this._onNodeAddChild as EventListener);
    this.addEventListener("node-toggle-not", this._onNodeToggleNot as EventListener);
    this.addEventListener("node-set-op", this._onNodeSetOp as EventListener);
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

  _wrapAt(path: number[], op: "and" | "or") {
    const next = this._patch(this.value, path, (node) => {
      if (!node) return node;
      return { kind: op, items: [node] } as StateGroup;
    });
    this._emit(next);
  }

  _addChildAt(path: number[], _kind: "is") {
    const next = this._patch(this.value, path, (node) => {
      if (node && (node.kind === "and" || node.kind === "or")) {
        return { ...node, items: [...node.items, this._emptyAtom()] };
      }
      return node;
    });
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

  /** Group operator includes the negated variants. AND/OR set the bare
   *  group kind; AND_NOT/OR_NOT wrap the group in a NOT. Storage stays
   *  the same wire-format set (and|or|not) — the UI just exposes the
   *  combination as a single dropdown choice. */
  _setGroupOpAt(
    path: number[],
    op: "and" | "or" | "and_not" | "or_not",
  ) {
    const wantNot = op === "and_not" || op === "or_not";
    const innerKind: "and" | "or" =
      op === "and" || op === "and_not" ? "and" : "or";
    const next = this._patch(this.value, path, (node) => {
      if (!node) return node;
      // Extract the underlying items list, whether the current node is a
      // bare group or a NOT-wrapped group.
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
      const replaced: StateGroup = { kind: innerKind, items: bareGroup.items };
      return wantNot ? ({ kind: "not", item: replaced } as StateNot) : replaced;
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
      const items = tree.items.slice();
      const replaced = this._patch(items[idx], rest, fn);
      if (replaced === null) {
        items.splice(idx, 1);
      } else {
        items[idx] = replaced as StateExpr;
      }
      if (items.length === 0) return null;
      if (items.length === 1) return items[0];
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

  private _onNodeWrap = (e: CustomEvent<{ path: number[]; op: "and" | "or" }>) => {
    e.stopPropagation();
    this._wrapAt(e.detail.path, e.detail.op);
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
    e: CustomEvent<{ path: number[]; op: "and" | "or" | "and_not" | "or_not" }>,
  ) => {
    e.stopPropagation();
    this._setGroupOpAt(e.detail.path, e.detail.op);
  };

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
    this._emit({ kind: "and", items: [value, this._emptyAtom()] });
  }

  private _renderRootToolbar() {
    // Negation lives on the atom (`is_not`) or the group (`and_not` /
    // `or_not` in the group dropdown) — no NOT button here.
    return html`
      <div class="root-toolbar">
        <button class="wrap"
          title=${localize(this.hass, "ui.state_wrap", "Wrap in group")}
          @click=${() => this._wrapAt([], "and")}>(…)</button>
        <button class="remove"
          title=${localize(this.hass, "ui.state_clear", "Clear")}
          @click=${() => this._removeAt([])}>✕</button>
      </div>
    `;
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
    return html`
      ${this._renderRootToolbar()}
      <ambience-state-expr-node
        .hass=${this.hass}
        .value=${this.value}
        .path=${[]}
      ></ambience-state-expr-node>
      <button class="root-add" @click=${() => this._addAtRoot()}>
        + ${localize(this.hass, "ui.state_add_condition", "Add condition")}
      </button>
    `;
  }
}
