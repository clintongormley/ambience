import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./state-expr-atom.js";
import type { HassConnection } from "../api.js";
import { localize, stateOpLabel } from "../i18n.js";
import type { StateAtom, StateExpr, StateGroup, StateNot } from "../types.js";

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
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) value!: StateExpr;
  /** Path of this node from the root. The root passes []. */
  @property({ attribute: false }) path: number[] = [];

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

  private _renderAtomCard(atom: StateAtom) {
    return html`
      <ambience-state-expr-atom
        .hass=${this.hass}
        .value=${atom}
        @value-changed=${(e: CustomEvent<{ value: StateAtom }>) => {
          e.stopPropagation();
          this._emit("node-change", { value: e.detail.value });
        }}
      ></ambience-state-expr-atom>
    `;
  }

  private _renderChildRow(child: StateExpr, index: number) {
    const isNot = child.kind === "not";
    const inner: StateExpr = isNot ? (child as StateNot).item : child;
    const childPath = [...this.path, index];
    return html`
      <div class="child-row">
        <div class="child-actions">
          <button class="not-toggle ${isNot ? "on" : ""}"
            title=${localize(this.hass, "ui.state_not_toggle", "Negate (NOT)")}
            @click=${() => this._emitAt(childPath, "node-toggle-not")}>${stateOpLabel(this.hass, "not")}</button>
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
          ></ambience-state-expr-node>
        </div>
      </div>
    `;
  }

  private _renderGroup(group: StateGroup) {
    return html`
      <div class="group">
        <div class="group-header">
          <select class="group-op"
            @change=${(e: Event) => this._emit("node-set-op", {
              op: (e.target as HTMLSelectElement).value as "and" | "or",
            })}>
            <option value="and" ?selected=${group.kind === "and"}>${stateOpLabel(this.hass, "and")}</option>
            <option value="or"  ?selected=${group.kind === "or"} >${stateOpLabel(this.hass, "or")}</option>
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
    if (this.value.kind === "and" || this.value.kind === "or") {
      return this._renderGroup(this.value);
    }
    // Atom (is / is_not) — `not` wrappers are unwrapped by the parent's
    // _renderChildRow, so this branch only ever sees atoms.
    return this._renderAtomCard(this.value as StateAtom);
  }
}
