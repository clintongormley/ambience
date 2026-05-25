import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./state-expr-atom.js";
import type { HassConnection } from "../api.js";
import { localize, stateOpLabel } from "../i18n.js";
import { summariseState } from "../summary.js";
import type { StateAtom, StateExpr, StateGroup, StateNot } from "../types.js";

function _samePath(a: number[] | null, b: number[] | null): boolean {
  if (a === null || b === null) return false;
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

/**
 * Recursive node renderer. Atoms render as <ambience-state-expr-atom>; groups
 * render a header (and/or switch) + each child wrapped in a child-row with
 * NOT/wrap/remove buttons + an "Add condition" button. Mutations bubble up
 * as `node-*` events tagged with `path: number[]`; the root component
 * (state-predicate-input) applies them via a single `_patch` helper.
 */
@customElement("ambience-state-expr-node")
export class AmbienceStateExprNode extends LitElement {
  static override styles = css`
    :host { display: block; }
    .group {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      padding: 0.5rem; margin: 0.25rem 0;
      background: var(--secondary-background-color, transparent);
    }
    .group-header {
      display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .group-op {
      padding: 0.15rem 0.5rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; background: var(--card-background-color, #fff);
      color: inherit;
    }
    .group-children { display: flex; flex-direction: column; gap: 0.25rem; padding-left: 1rem; }
    .child-row { display: flex; gap: 0.5rem; align-items: flex-start; }
    .child-body { flex: 1; min-width: 0; }
    .child-actions { display: flex; gap: 0.25rem; padding-top: 0.25rem; }
    .child-actions button, .actions button {
      background: transparent; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; padding: 0.15rem 0.4rem; cursor: pointer;
      font-size: 0.85em; color: inherit;
    }
    .child-actions .not-toggle.on {
      background: var(--warning-color, #ffd);
      border-color: var(--warning-color, #cc9);
    }
    .actions { display: flex; gap: 0.25rem; margin-top: 0.5rem; }

    .atom-card {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
    }
    .atom-header {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.4rem 0.6rem; cursor: pointer; user-select: none;
    }
    .atom-card.expanded .atom-header { border-bottom: 1px solid var(--divider-color, #eee); }
    .atom-card.collapsed .atom-header:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .atom-header .summary {
      flex: 1; min-width: 0;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .atom-header .summary.placeholder {
      color: var(--secondary-text-color, #888); font-style: italic;
    }
    .atom-header .remove {
      background: none; border: none; color: var(--secondary-text-color, #888);
      cursor: pointer; font-size: 1em; padding: 0 0.25rem;
    }
    .atom-body { padding: 0.5rem 0.75rem; }
    .atom-error {
      margin-top: 0.5rem;
      color: var(--error-color, #b71c1c);
      font-size: 0.9em;
    }
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) value!: StateExpr;
  /** Path of this node from the root. The root passes []. */
  @property({ attribute: false }) path: number[] = [];
  /** Path of the currently-open atom (set by the root). When this node is
   *  an atom and its path matches, it renders expanded. Incomplete atoms
   *  render expanded regardless. */
  @property({ attribute: false }) openPath: number[] | null = null;
  /** Path of an atom that currently has a surfaced validation error.
   *  Combined with `errorMessage`, this drives the inline error display. */
  @property({ attribute: false }) errorPath: number[] | null = null;
  @property({ attribute: false }) errorMessage: string | null = null;

  private _emit(name: string, detail: Record<string, unknown> = {}) {
    this.dispatchEvent(new CustomEvent(name, {
      detail: { path: this.path, ...detail },
      bubbles: true, composed: true,
    }));
  }

  private _emitAt(path: number[], name: string, detail: Record<string, unknown> = {}) {
    this.dispatchEvent(new CustomEvent(name, {
      detail: { path, ...detail },
      bubbles: true, composed: true,
    }));
  }

  private _atomIsComplete(atom: StateAtom): boolean {
    return Boolean(atom.entity_id) && atom.states.some((s) => s !== "");
  }

  private _isErrorTarget(): boolean {
    return _samePath(this.path, this.errorPath);
  }

  private _renderAtomCard(atom: StateAtom) {
    const isComplete = this._atomIsComplete(atom);
    // Strict open/closed model: only the open atom expands. Incomplete
    // atoms used to force-expand which broke collapse-others-on-open when
    // both atoms were half-filled. The root component auto-opens a lone
    // atom, so a freshly-added single condition still shows its form.
    const expanded = _samePath(this.path, this.openPath);
    const summary = isComplete
      ? summariseState(atom, { hass: this.hass })
      : localize(this.hass, "ui.state_new_condition", "(new condition)");
    return html`
      <div class="atom-card ${expanded ? "expanded" : "collapsed"}">
        <div class="atom-header"
          @click=${() => this._emit("node-open")}>
          <span class="summary ${isComplete ? "" : "placeholder"}">${summary}</span>
          <button class="remove"
            title=${localize(this.hass, "ui.remove", "Remove")}
            @click=${(e: Event) => {
              e.stopPropagation();
              this._emit("node-remove");
            }}>✕</button>
        </div>
        ${expanded ? html`
          <div class="atom-body">
            <ambience-state-expr-atom
              .hass=${this.hass}
              .value=${atom}
              @value-changed=${(e: CustomEvent<{ value: StateAtom }>) => {
                e.stopPropagation();
                this._emit("node-change", { value: e.detail.value });
              }}
            ></ambience-state-expr-atom>
            ${this._isErrorTarget() && this.errorMessage
              ? html`<div class="atom-error">${this.errorMessage}</div>`
              : ""}
          </div>
        ` : ""}
      </div>
    `;
  }

  private _renderChildRow(child: StateExpr, index: number) {
    // Defensive unwrap of legacy NOT-on-atom data. New predicates express
    // negation via `is_not` at the atom level or via and_not/or_not on the
    // parent group, so this NOT wrap should be uncommon.
    const inner: StateExpr = child.kind === "not" ? (child as StateNot).item : child;
    const childPath = [...this.path, index];
    return html`
      <div class="child-row">
        <div class="child-actions">
          <button title=${localize(this.hass, "ui.state_wrap", "Wrap in group")}
            @click=${() => this._emitAt(childPath, "node-wrap", { op: "and" })}>(…)</button>
          <button title=${localize(this.hass, "ui.remove", "Remove")}
            @click=${() => this._emitAt(childPath, "node-remove")}>✕</button>
        </div>
        <div class="child-body">
          <ambience-state-expr-node
            .hass=${this.hass}
            .value=${inner}
            .path=${childPath}
            .openPath=${this.openPath}
            .errorPath=${this.errorPath}
            .errorMessage=${this.errorMessage}
          ></ambience-state-expr-node>
        </div>
      </div>
    `;
  }

  /** Group dropdown exposes 4 operators. `and_not` and `or_not` are sugar
   *  for `{not, item: {and|or, items}}` — they negate the whole group. */
  private _renderGroup(group: StateGroup, isNot: boolean) {
    const currentOp = isNot
      ? (group.kind === "and" ? "and_not" : "or_not")
      : group.kind;
    return html`
      <div class="group">
        <div class="group-header">
          <select class="group-op"
            @change=${(e: Event) => this._emit("node-set-op", {
              op: (e.target as HTMLSelectElement).value,
            })}>
            <option value="and"     ?selected=${currentOp === "and"}    >${stateOpLabel(this.hass, "and")}</option>
            <option value="or"      ?selected=${currentOp === "or"}     >${stateOpLabel(this.hass, "or")}</option>
            <option value="and_not" ?selected=${currentOp === "and_not"}>${stateOpLabel(this.hass, "and_not")}</option>
            <option value="or_not"  ?selected=${currentOp === "or_not"} >${stateOpLabel(this.hass, "or_not")}</option>
          </select>
        </div>
        <div class="group-children">
          ${group.items.map((child, i) => this._renderChildRow(child, i))}
        </div>
        <div class="actions">
          <button @click=${() => this._emit("node-add-child")}>
            + ${localize(this.hass, "ui.state_add_condition", "Add condition")}
          </button>
        </div>
      </div>
    `;
  }

  override render() {
    // NOT wrappers may arrive here from the root (predicate-input passes the
    // raw value, not the unwrapped inner). For groups, the NOT-ness flows
    // through to the group's operator dropdown (and_not / or_not). For
    // atoms, we just unwrap defensively — the new UI doesn't create
    // `{not, atom}` but legacy data might.
    const isNot = this.value.kind === "not";
    const inner = isNot ? (this.value as StateNot).item : this.value;
    if (inner.kind === "and" || inner.kind === "or") {
      return this._renderGroup(inner, isNot);
    }
    return this._renderAtomCard(inner as StateAtom);
  }
}
