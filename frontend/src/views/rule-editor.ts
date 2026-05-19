import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type {
  ActionInfo,
  ActionSpec,
  MatcherInfo,
  ParamSpec,
  PeriodStoreView,
  Rule,
} from "../types.js";
import type { HassConnection } from "../api.js";
import { entitiesInArea } from "../area-entities.js";
import { pickHaTextInput, watchHaComponents } from "../ha-components.js";
import { matcherLabel, actionLabel } from "../i18n.js";
import { summariseMatcher, summariseAction } from "../summary.js";
import "./matcher-input.js";
import "./target-picker.js";

type OpenSlot =
  | { kind: "name" }
  | { kind: "matcher"; id: string }
  | { kind: "action"; idx: number }
  | null;

@customElement("ambience-rule-editor")
export class AmbienceRuleEditor extends LitElement {
  static override styles = css`
    :host {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.4); z-index: 100;
      align-items: center; justify-content: center;
    }
    :host([open]) { display: flex; }
    .modal {
      background: var(--card-background-color, #fff); color: inherit;
      border-radius: 8px; padding: 1.5rem;
      width: 90%; max-width: 40rem; max-height: 90vh; overflow-y: auto;
    }
    h3 {
      margin: 1.5rem 0 0.5rem 0;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      padding-bottom: 0.25rem;
    }
    label {
      display: block; font-weight: 600; margin: 0.5rem 0 0.25rem 0;
    }
    input, select {
      width: 100%; box-sizing: border-box; padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc); border-radius: 4px;
      background: var(--card-background-color, #fff); color: inherit;
    }
    .slot {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }
    .summary {
      padding: 0.6rem 0.75rem;
      cursor: pointer;
      display: flex; align-items: center;
      gap: 0.5rem;
    }
    .summary:hover { background: var(--secondary-background-color, #f5f5f5); }
    .summary-label { flex: 1; }
    .slot.expanded .summary {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .slot.combobox-slot.expanded,
    .slot.name-slot.expanded {
      border: none;
      padding: 0;
      margin-bottom: 0.5rem;
    }
    .body {
      padding: 0.75rem;
      border-top: 1px solid var(--divider-color, #e0e0e0);
    }
    .actions-bar {
      display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem;
    }
    button {
      padding: 0.5rem 1rem; border: 0; border-radius: 4px; cursor: pointer;
    }
    .primary { background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); }
    .secondary {
      background: transparent; color: var(--primary-text-color, inherit);
      border: 1px solid var(--divider-color, #ccc);
    }
    .remove {
      background: none; border: none; color: var(--secondary-text-color, #888);
      cursor: pointer; font-size: 1.1em;
      padding: 0; width: auto;
    }
    .param-input {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .param-input input {
      flex: 1;
    }
    .param-unit {
      color: var(--secondary-text-color, #888);
      font-size: 0.9em;
      min-width: 1.5em;
    }
    .error {
      color: var(--error-color, #c62828);
      font-size: 0.9em;
      margin-top: 0.5rem;
      padding: 0.3rem 0;
    }
  `;

  @property({ type: Boolean, reflect: true }) open = false;
  @property({ attribute: false }) rule: Rule | null = null;
  @property({ attribute: false }) matchers: MatcherInfo[] = [];
  @property({ attribute: false }) sceneSuggestions: string[] = [];
  @property({ attribute: false }) periods?: PeriodStoreView;
  @property({ attribute: false }) availableActions: ActionInfo[] = [];
  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) areaId?: string;

  @state() private _draft: Rule | null = null;
  @state() private _open: OpenSlot = null;
  @state() private _showError = false;

  override connectedCallback() {
    super.connectedCallback();
    watchHaComponents(this, this.hass);
  }

  override willUpdate(changed: Map<string, unknown>) {
    if (changed.has("rule")) {
      this._draft = this.rule ? JSON.parse(JSON.stringify(this.rule)) : null;
      this._open = null;  // new rule loaded → everything collapsed
      this._showError = false;
    }
  }

  // --- Name field ---

  private _setName(v: string) {
    if (!this._draft) return;
    this._draft = { ...this._draft, name: v || undefined };
  }

  private _onNameInput = (e: Event) => {
    this._setName((e.target as HTMLElement & { value: string }).value);
  };

  private _renderNameSlot() {
    const value = this._draft!.name ?? "";
    const open = this._isOpen({ kind: "name" });
    if (open) {
      // Just the input — no header, no label, no enclosing chrome.
      // The .slot class is kept (with the .name-slot.expanded variant) so the
      // click-outside detection in _onModalClick still treats this region as
      // "inside" an editable slot.
      return html`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(value)}
        </div>
      `;
    }
    const summaryText = value || "New rule";
    return html`
      <div class="slot collapsed" data-slot-id="name">
        <div class="summary" @click=${() => this._toggleSlot({ kind: "name" })}>
          <span class="summary-label"><strong>${summaryText}</strong></span>
        </div>
      </div>
    `;
  }

  /**
   * Renders just the input control (no label, no slot wrapper). The label is
   * already provided by the slot body; this method exists so the input
   * stays the same across the three HA variants without duplicating
   * shell markup.
   */
  private _renderNameInputControl(value: string) {
    const tag = pickHaTextInput();
    /* v8 ignore next 8 -- ha-input is eagerly registered in HA 2026.05+, not in jsdom */
    if (tag === "ha-input") {
      return html`<ha-input label="Name (optional)" .value=${value} @input=${this._onNameInput}></ha-input>`;
    }
    /* v8 ignore next 8 -- ha-textfield is legacy HA variant, not registered in jsdom */
    if (tag === "ha-textfield") {
      return html`<ha-textfield label="Name (optional)" .value=${value} @input=${this._onNameInput}></ha-textfield>`;
    }
    return html`<input type="text" .value=${value} @input=${this._onNameInput} />`;
  }

  // --- Collapse helpers ---

  private _isOpen(slot: { kind: "name" } | { kind: "matcher"; id: string } | { kind: "action"; idx: number }): boolean {
    if (this._open === null) return false;
    if (slot.kind === "name" && this._open.kind === "name") return true;
    if (slot.kind === "matcher" && this._open.kind === "matcher") return slot.id === this._open.id;
    if (slot.kind === "action" && this._open.kind === "action") return slot.idx === this._open.idx;
    return false;
  }

  /**
   * Returns a user-facing error string if the currently open slot has invalid
   * data, or null if valid.
   *
   * - Name slot: always valid (optional).
   * - Matcher slots: predicates are valid by construction (form inputs constrain shape).
   * - Action slots: must have at least one target, and all required params set.
   */
  private _validationError(slot: OpenSlot): string | null {
    if (slot === null) return null;
    if (slot.kind === "name") return null;
    if (slot.kind === "matcher") return null;
    // slot.kind === "action"
    const action = this._draft?.actions[slot.idx];
    if (!action) return null;
    if (action.entity_ids.length === 0) {
      return "At least one target is required.";
    }
    const info = this.availableActions.find((x) => x.name === action.action);
    if (!info) return null;
    for (const p of info.target_params) {
      if (!p.required) continue;
      const v = action.params[p.name];
      if (v === undefined || v === null || v === "") {
        return `${this._paramLabel(p.name)} is required.`;
      }
    }
    return null;
  }

  /**
   * Attempt to close the currently open slot. Returns true if successfully
   * closed; false if blocked by a validation error (in which case `_showError`
   * is set so the error renders).
   */
  private _tryCloseCurrent(): boolean {
    if (this._open === null) return true;
    if (this._validationError(this._open) !== null) {
      this._showError = true;
      return false;
    }
    this._open = null;
    this._showError = false;
    return true;
  }

  private _toggleSlot(slot: { kind: "name" } | { kind: "matcher"; id: string } | { kind: "action"; idx: number }) {
    if (this._isOpen(slot)) {
      this._tryCloseCurrent();
      return;
    }
    // Switching to a different slot — try to close current first
    if (this._open !== null && !this._tryCloseCurrent()) return;
    this._open = slot;
    this._showError = false;
  }

  private _onModalClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    // If the click landed inside any editable region or the actions bar,
    // don't treat it as a "click outside".
    if (target.closest(".slot") || target.closest(".actions-bar")) return;
    this._tryCloseCurrent();
  }

  // --- Matcher row ---

  private _setPredicate(matcher: string, value: unknown) {
    if (!this._draft) return;
    const when = { ...this._draft.when };
    if (value == null) delete when[matcher];
    else when[matcher] = value;
    this._draft = { ...this._draft, when };
  }

  private _renderMatcherRow(m: MatcherInfo) {
    const value = this._draft!.when[m.name] ?? null;
    const open = this._isOpen({ kind: "matcher", id: m.name });
    const isCombobox = m.input === "scene_combobox";

    // Expanded simple-combobox: drop chrome — just the input.
    if (open && isCombobox) {
      return html`
        <div class="slot combobox-slot expanded" data-slot-id=${m.name}>
          <ambience-matcher-input
            .hass=${this.hass}
            .matcher=${m}
            .value=${value}
            .sceneSuggestions=${this.sceneSuggestions}
            .periods=${this.periods}
            @value-changed=${(e: CustomEvent<{ value: unknown }>) => this._setPredicate(m.name, e.detail.value)}
          ></ambience-matcher-input>
        </div>
      `;
    }

    const summary = summariseMatcher(m.name, value, { hass: this.hass as any, periods: this.periods });
    return html`
      <div class="slot ${open ? "expanded" : "collapsed"}" data-slot-id=${m.name}>
        <div class="summary" @click=${() => this._toggleSlot({ kind: "matcher", id: m.name })}>
          <span class="summary-label"><strong>${matcherLabel(this.hass as any, m.name)}:</strong> ${summary}</span>
        </div>
        ${open ? html`
          <div class="body">
            <ambience-matcher-input
              .hass=${this.hass}
              .matcher=${m}
              .value=${value}
              .sceneSuggestions=${this.sceneSuggestions}
              .periods=${this.periods}
              @value-changed=${(e: CustomEvent<{ value: unknown }>) => this._setPredicate(m.name, e.detail.value)}
            ></ambience-matcher-input>
          </div>
        ` : ""}
      </div>
    `;
  }

  // --- Action row ---

  private _addActionSlot() {
    if (!this._draft) return;
    const spec: ActionSpec = { action: "set_light", entity_ids: [], params: {} };
    const newIdx = this._draft.actions.length;
    this._draft = { ...this._draft, actions: [...this._draft.actions, spec] };
    this._open = { kind: "action", idx: newIdx };
  }

  private _updateActionAt(idx: number, mutate: (a: ActionSpec) => ActionSpec) {
    if (!this._draft) return;
    const actions = this._draft.actions.map((a, i) => (i === idx ? mutate(a) : a));
    this._draft = { ...this._draft, actions };
  }

  private _changeActionType(idx: number, name: string) {
    this._updateActionAt(idx, () => {
      const info = this.availableActions.find((x) => x.name === name);
      const params: Record<string, unknown> = {};
      info?.target_params.forEach((p) => { if ("default" in p) params[p.name] = p.default; });
      return { action: name, entity_ids: [], params };
    });
  }

  private _deleteAction(idx: number) {
    if (!this._draft) return;
    this._draft = { ...this._draft, actions: this._draft.actions.filter((_, i) => i !== idx) };
    if (this._open?.kind === "action" && this._open.idx === idx) this._open = null;
  }

  private _setActionTargets(idx: number, entity_ids: string[]) {
    this._updateActionAt(idx, (a) => ({ ...a, entity_ids }));
  }

  private _paramLabel(name: string): string {
    // brightness → "Brightness"; transition → "Transition"
    // Same snake_case → title-case rule we use for matcher/action labels.
    const spaced = name.replaceAll("_", " ").toLowerCase();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }

  private _updateActionParam(idx: number, param: ParamSpec, rawValue: string) {
    this._updateActionAt(idx, (a) => {
      const params = { ...a.params };
      let parsed: unknown = rawValue;
      if (param.type === "int")
        parsed = rawValue === "" ? undefined : parseInt(rawValue, 10);
      else if (param.type === "number")
        parsed = rawValue === "" ? undefined : parseFloat(rawValue);
      /* v8 ignore next -- boolean params are rare; not exercised in current actions */
      else if (param.type === "boolean") parsed = rawValue === "true";
      // Clamp numeric values to [min, max] if those bounds are defined.
      if (typeof parsed === "number" && Number.isFinite(parsed)) {
        let num = parsed;
        if (typeof param.min === "number" && num < param.min) num = param.min;
        if (typeof param.max === "number" && num > param.max) num = param.max;
        parsed = num;
      }
      if (parsed === undefined) delete params[param.name];
      else params[param.name] = parsed;
      return { ...a, params };
    });
  }

  private _renderActionParams(idx: number, action: ActionSpec, info: ActionInfo | undefined) {
    const params: ParamSpec[] = info?.target_params ?? [];
    return html`
      ${params.map((p) => html`
        <div class="param-row">
          <label>${this._paramLabel(p.name)}${p.required ? " *" : ""}</label>
          <div class="param-input">
            <input
              type=${p.type === "int" || p.type === "number" ? "number" : "text"}
              placeholder=${p.description ?? ""}
              .value=${String(action.params[p.name] ?? "")}
              min=${p.min ?? ""}
              max=${p.max ?? ""}
              @input=${(e: InputEvent) => this._updateActionParam(idx, p, (e.target as HTMLInputElement).value)}
            />
            ${p.unit ? html`<span class="param-unit">${p.unit}</span>` : ""}
          </div>
        </div>
      `)}
    `;
  }

  private _renderActionRow(action: ActionSpec, idx: number) {
    const info = this.availableActions.find((x) => x.name === action.action);
    const open = this._isOpen({ kind: "action", idx });
    const summary = summariseAction(action, info, { hass: this.hass as any });
    const entities = entitiesInArea(this.hass as any, this.areaId, info?.domains ?? []);
    return html`
      <div class="slot ${open ? "expanded" : "collapsed"}" data-slot-id="action-${idx}">
        <div class="summary" @click=${() => this._toggleSlot({ kind: "action", idx })}>
          <span class="summary-label">${summary}</span>
          <button class="remove" @click=${(e: Event) => { e.stopPropagation(); this._deleteAction(idx); }} title="Remove action">✕</button>
        </div>
        ${open ? html`
          <div class="body">
            <label>Action type</label>
            <select class="action-type" @change=${(e: Event) =>
              this._changeActionType(idx, (e.target as HTMLSelectElement).value)}>
              ${this.availableActions.map((info) => html`
                <option value=${info.name} ?selected=${action.action === info.name}>
                  ${actionLabel(this.hass as any, info.name)}
                </option>
              `)}
            </select>

            <label>Target</label>
            <ambience-target-picker
              .hass=${this.hass}
              .entities=${entities}
              .value=${action.entity_ids}
              @value-changed=${(e: CustomEvent<{ value: string[] }>) => {
                e.stopPropagation();
                this._setActionTargets(idx, e.detail.value);
              }}
            ></ambience-target-picker>

            ${this._renderActionParams(idx, action, info)}

            ${this._showError && this._validationError({ kind: "action", idx }) ? html`
              <div class="error">${this._validationError({ kind: "action", idx })}</div>
            ` : ""}
          </div>
        ` : ""}
      </div>
    `;
  }

  // --- Save / cancel ---

  private _save() {
    if (!this._draft) return;
    this.dispatchEvent(new CustomEvent("save-rule", {
      detail: this._draft, bubbles: true, composed: true,
    }));
  }

  private _cancel() {
    this.dispatchEvent(new CustomEvent("cancel-rule", { bubbles: true, composed: true }));
  }

  override render() {
    if (!this._draft) return html``;
    return html`
      <div class="modal" @click=${this._onModalClick}>
        ${this._renderNameSlot()}

        <h3>When</h3>
        ${this.matchers.map((m) => this._renderMatcherRow(m))}

        <h3>Actions</h3>
        ${this._draft.actions.map((a, i) => this._renderActionRow(a, i))}
        <button class="secondary add-action" @click=${this._addActionSlot}>+ Add action</button>

        <div class="actions-bar">
          <button class="secondary" @click=${this._cancel}>Cancel</button>
          <button class="primary" @click=${this._save}>Save rule</button>
        </div>
      </div>
    `;
  }
}
