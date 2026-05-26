import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

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
    .group-wrap {
      display: flex; align-items: flex-start; gap: 0.4rem;
      margin: 0.25rem 0;
    }
    .group-wrap > .group { flex: 1; min-width: 0; margin: 0; }
    /* External NOT on a group sits next to the card, scoping visually to
       the whole group. Tone-down when off (same treatment as the in-atom
       NOT toggle); loud when on. */
    .group-wrap > .not-toggle.external {
      background: transparent; border: 1px solid transparent;
      border-radius: 4px; padding: 0.1rem 0.35rem; margin-top: 0.4rem;
      cursor: pointer; font-size: 0.85em;
      color: var(--secondary-text-color, #888); opacity: 0.6;
    }
    .group-wrap > .not-toggle.external:hover {
      opacity: 1; border-color: var(--divider-color, #ccc);
    }
    .group-wrap > .not-toggle.external.on {
      background: var(--warning-color, #ffd);
      border-color: var(--warning-color, #cc9);
      color: inherit; opacity: 1; font-weight: 600;
    }
    .group {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      padding: 0.4rem; margin: 0.25rem 0;
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
    /* Nested groups no longer indent — the bordered card already conveys
       hierarchy. This keeps the form full-width regardless of depth. */
    .group-children { display: flex; flex-direction: column; gap: 0.25rem; }
    .actions button {
      background: transparent; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; padding: 0.15rem 0.4rem; cursor: pointer;
      font-size: 0.85em; color: inherit;
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
    .atom-header .not-toggle,
    .atom-header .wrap,
    .group-header .not-toggle,
    .group-header .wrap,
    .group-header .unwrap {
      background: transparent; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; padding: 0.1rem 0.35rem; cursor: pointer;
      font-size: 0.85em; color: inherit;
    }
    /* When NOT is OFF it's a quiet, low-contrast affordance — the
       border fades into the card and the label uses secondary text
       colour so it doesn't compete with the summary. */
    .atom-header .not-toggle,
    .group-header .not-toggle {
      border-color: transparent;
      color: var(--secondary-text-color, #888);
      opacity: 0.6;
    }
    .atom-header .not-toggle:hover,
    .group-header .not-toggle:hover {
      opacity: 1;
      border-color: var(--divider-color, #ccc);
    }
    /* Active state is loud — the negation is in effect, the user should
       see it at a glance. */
    .atom-header .not-toggle.on,
    .group-header .not-toggle.on {
      background: var(--warning-color, #ffd);
      border-color: var(--warning-color, #cc9);
      color: inherit;
      opacity: 1;
      font-weight: 600;
    }
    .group-header .unwrap {
      margin-left: auto;
      border: none; background: none; padding: 0 0.25rem;
      color: var(--secondary-text-color, #888); font-size: 1em;
    }
    .atom-body { padding: 0.5rem 0.75rem; }
    /* Drag-over highlight — applied to either an atom card or a group
       card. The active outline overrides the default border so the drop
       target is unmistakable. */
    .atom-card.drag-over,
    .group.drag-over {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -2px;
    }
    /* Hint that the header — and only the header — is grabbable. The
       summary text and empty padding inside the header pick up grab; the
       buttons keep their own cursor via the default cascade. */
    .atom-header[draggable="true"],
    .group-header[draggable="true"] { cursor: grab; }
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
  /** Whether THIS card is currently the hovered drop target during a drag.
   *  Drives the .drag-over visual state. */
  @state() private _dragOver = false;
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

  private _atomIsComplete(atom: StateAtom): boolean {
    return Boolean(atom.entity_id) && atom.states.some((s) => s !== "");
  }

  private _isErrorTarget(): boolean {
    return _samePath(this.path, this.errorPath);
  }

  // --- drag-and-drop ----------------------------------------------------

  /** Skip dragstart when the user grabbed an interactive element (button,
   *  dropdown, ha-form). Cards stay draggable from any other point. */
  private _onDragStart(e: DragEvent) {
    if (this.path.length === 0) {
      // Root can't be dragged — there's no parent to move it to.
      e.preventDefault();
      return;
    }
    const target = e.target as HTMLElement | null;
    if (target && target.closest("button, select, input, textarea, ha-form")) {
      e.preventDefault();
      return;
    }
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("application/x-ambience-path", JSON.stringify(this.path));
    }
  }

  private _onDragOver(e: DragEvent) {
    if (this.path.length === 0) return;            // root not a drop target
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
    this._dragOver = true;
  }

  private _onDragLeave(e: DragEvent) {
    e.stopPropagation();
    this._dragOver = false;
  }

  private _onDrop(e: DragEvent) {
    if (this.path.length === 0) return;
    e.preventDefault();
    e.stopPropagation();
    this._dragOver = false;
    if (!e.dataTransfer) return;
    const raw = e.dataTransfer.getData("application/x-ambience-path");
    if (!raw) return;
    let from: number[];
    try { from = JSON.parse(raw); } catch { return; }
    if (!Array.isArray(from) || from.every((v) => typeof v === "number") === false) return;
    if (_samePath(from, this.path)) return;        // no-op drop on self
    this.dispatchEvent(new CustomEvent("node-move", {
      detail: { from, to: this.path },
      bubbles: true, composed: true,
    }));
  }

  private _renderAtomCard(atom: StateAtom, isNot: boolean) {
    const isComplete = this._atomIsComplete(atom);
    const expanded = _samePath(this.path, this.openPath);
    const summary = isComplete
      ? summariseState(atom, { hass: this.hass })
      : localize(this.hass, "ui.state_new_condition", "(new condition)");
    return html`
      <div class="atom-card ${expanded ? "expanded" : "collapsed"} ${this._dragOver ? "drag-over" : ""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}>
        <div class="atom-header"
          draggable=${this.path.length > 0}
          @dragstart=${this._onDragStart}
          @click=${() => this._emit("node-open")}>
          <button class="not-toggle ${isNot ? "on" : ""}"
            title=${localize(this.hass, "ui.state_not_toggle", "Negate (NOT)")}
            @click=${(e: Event) => {
              e.stopPropagation();
              this._emit("node-toggle-not");
            }}>${stateOpLabel(this.hass, "not")}</button>
          <span class="summary ${isComplete ? "" : "placeholder"}">${summary}</span>
          <button class="wrap"
            title=${localize(this.hass, "ui.state_wrap", "Wrap in group")}
            @click=${(e: Event) => {
              e.stopPropagation();
              this._emit("node-wrap");
            }}>(…)</button>
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
    // No external toolbar — the child node owns its own NOT/wrap/remove
    // controls in its card header. Pass the wrapped value (with NOT, if
    // any) through so the child can render the toggle state itself.
    const childPath = [...this.path, index];
    return html`
      <ambience-state-expr-node
        .hass=${this.hass}
        .value=${child}
        .path=${childPath}
        .openPath=${this.openPath}
        .errorPath=${this.errorPath}
        .errorMessage=${this.errorMessage}
      ></ambience-state-expr-node>
    `;
  }

  /** Group header: AND/OR dropdown + ✕ (unwrap). Behaviour of X:
   *  - Nested: promote children to parent's items list.
   *  - Root with 1 child: become that child (undoes a wrap).
   *  - Root with 2+ children: clear the predicate (set to null).
   *  Group-level NOT lives OUTSIDE the card in
   *  `_renderGroupWithExternalNot`, reading naturally as "NOT applies to
   *  the whole group". */
  private _renderGroup(group: StateGroup) {
    return html`
      <div class="group ${this._dragOver ? "drag-over" : ""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}>
        <div class="group-header"
          draggable=${this.path.length > 0}
          @dragstart=${this._onDragStart}>
          <select class="group-op"
            @change=${(e: Event) => this._emit("node-set-op", {
              op: (e.target as HTMLSelectElement).value,
            })}>
            <option value="and" ?selected=${group.kind === "and"}>${stateOpLabel(this.hass, "and")}</option>
            <option value="or"  ?selected=${group.kind === "or"} >${stateOpLabel(this.hass, "or")}</option>
          </select>
          <button class="unwrap"
            title=${localize(this.hass, "ui.state_unwrap_group", "Remove these parens (promote children to parent)")}
            @click=${() => this._emit("node-unwrap")}>✕</button>
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
    // Atoms own their NOT toggle in the card header. Groups put NOT
    // outside the card (to the left), where it visually scopes to the
    // whole group. Both unwrap the {kind:'not'} envelope before rendering
    // the inner content; the isNot flag drives the toggle's 'on' class.
    const isNot = this.value.kind === "not";
    const inner = isNot ? (this.value as StateNot).item : this.value;
    if (inner.kind === "and" || inner.kind === "or") {
      return this._renderGroupWithExternalNot(inner as StateGroup, isNot);
    }
    return this._renderAtomCard(inner as StateAtom, isNot);
  }

  private _renderGroupWithExternalNot(group: StateGroup, isNot: boolean) {
    const isRoot = this.path.length === 0;
    return html`
      <div class="group-wrap">
        ${isRoot ? "" : html`<button class="not-toggle external ${isNot ? "on" : ""}"
          title=${localize(this.hass, "ui.state_not_toggle", "Negate (NOT)")}
          @click=${() => this._emit("node-toggle-not")}>${stateOpLabel(this.hass, "not")}</button>`}
        ${this._renderGroup(group)}
      </div>
    `;
  }
}
