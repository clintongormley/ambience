import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type {
  ActionInfo,
  ActionSpec,
  DayConfig,
  MatcherInfo,
  ParamSpec,
  PeriodStoreView,
  Rule,
  Scope,
} from "../types.js";
import type { HassConnection } from "../api.js";
import { entitiesForScope } from "../entities-for-scope.js";
import { pickHaTextInput, watchHaComponents } from "../ha-components.js";
import { localize, matcherLabel } from "../i18n.js";
import { ruleDisplayName, summariseMatcher, summariseAction } from "../summary.js";
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
      align-items: stretch; justify-content: center;
    }
    :host([open]) { display: flex; }
    .modal {
      background: var(--card-background-color, #fff); color: inherit;
      width: 90%; max-width: 40rem;
      height: 100vh; max-height: 100vh;
      display: flex; flex-direction: column;
    }
    .content {
      flex: 1; min-height: 0;
      overflow-y: auto;
      padding: 1.5rem;
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
      display: flex; justify-content: flex-end; gap: 0.5rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      flex-shrink: 0;
    }
    select.add-matcher {
      margin-top: 0.5rem;
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
  @property({ attribute: false }) dayConfig?: DayConfig;
  @property({ attribute: false }) weatherConfig?: import("../types.js").WeatherConfig;
  @property({ attribute: false }) availableActions: ActionInfo[] = [];
  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) scope?: Scope;

  @state() private _draft: Rule | null = null;
  @state() private _open: OpenSlot = null;
  @state() private _showError = false;

  override connectedCallback() {
    super.connectedCallback();
    watchHaComponents(this, this.hass);
  }

  override willUpdate(changed: Map<string, unknown>) {
    // Initialise the draft ONLY when the editor opens. Once open, ignore
    // subsequent `rule` prop changes — the parent re-derives `rule` from a
    // possibly-refreshed config every time `area_registry_updated` fires,
    // and we don't want an unrelated refetch to clobber the user's
    // in-progress edits.
    const isOpening = changed.has("open") && this.open;
    if (isOpening) {
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
    const summaryText = ruleDisplayName(this._draft!, localize(this.hass, "ui.new_rule", "New rule"));
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
      return html`<ha-input label=${localize(this.hass, "ui.name_optional", "Name (optional)")} .value=${value} @input=${this._onNameInput}></ha-input>`;
    }
    /* v8 ignore next 8 -- ha-textfield is legacy HA variant, not registered in jsdom */
    if (tag === "ha-textfield") {
      return html`<ha-textfield label=${localize(this.hass, "ui.name_optional", "Name (optional)")} .value=${value} @input=${this._onNameInput}></ha-textfield>`;
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
      return localize(this.hass, "ui.at_least_one_target", "At least one target is required.");
    }
    const info = this.availableActions.find((x) => x.name === action.action);
    if (!info) return null;
    for (const p of info.target_params) {
      if (!p.required) continue;
      const v = action.params[p.name];
      if (v === undefined || v === null || v === "") {
        return localize(this.hass, "ui.param_required", "{param} is required.").replace("{param}", this._paramLabel(p.name));
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
    // composedPath() includes all elements across shadow DOM boundaries,
    // unlike closest() which stops at the first shadow root.
    // When the click originates inside a nested custom element (e.g. the
    // Time/Sun select inside <ambience-time-endpoint>), the retargeted
    // e.target loses the .slot ancestor — composedPath does not.
    for (const node of e.composedPath()) {
      if (!(node instanceof Element)) continue;
      if (node.classList.contains("slot")) return;
      if (node.classList.contains("actions-bar")) return;
      // The add-condition dropdown fires `change` followed by a bubbling
      // `click` from the selected option. Without this skip, that click
      // would collapse the matcher slot the change handler just opened.
      if (node.classList.contains("add-matcher")) return;
    }
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
            .dayConfig=${this.dayConfig}
            .weatherConfig=${this.weatherConfig}
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
          <button
            class="remove"
            @click=${(e: Event) => { e.stopPropagation(); this._removeMatcher(m.name); }}
            title=${localize(this.hass, "ui.remove_condition", "Remove condition")}
          >✕</button>
        </div>
        ${open ? html`
          <div class="body">
            <ambience-matcher-input
              .hass=${this.hass}
              .matcher=${m}
              .value=${value}
              .sceneSuggestions=${this.sceneSuggestions}
              .periods=${this.periods}
              .dayConfig=${this.dayConfig}
              .weatherConfig=${this.weatherConfig}
              @value-changed=${(e: CustomEvent<{ value: unknown }>) => this._setPredicate(m.name, e.detail.value)}
            ></ambience-matcher-input>
          </div>
        ` : ""}
      </div>
    `;
  }

  // --- Matcher visibility / add+remove ---

  /**
   * Matchers shown as rows. A matcher is visible only if it has a non-null
   * value in `when`, OR if it's the currently-open slot (just-added via
   * dropdown, no predicate set yet). A stored null predicate is treated as
   * "not in the rule" — same as an absent key.
   */
  private _visibleMatchers(): MatcherInfo[] {
    if (!this._draft) return [];
    const when = this._draft.when;
    return this.matchers.filter((m) =>
      (m.name in when && when[m.name] != null) ||
      (this._open?.kind === "matcher" && this._open.id === m.name),
    );
  }

  private _unusedMatchers(): MatcherInfo[] {
    const visible = new Set(this._visibleMatchers().map((m) => m.name));
    return this.matchers.filter((m) => !visible.has(m.name));
  }

  private _onAddMatcher = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    const name = select.value;
    select.value = "";  // reset placeholder regardless of branch
    this._addMatcher(name);
  };

  // Sentinel value for the ha-form select's placeholder option. ha-form's
  // dropdown won't render an option whose value is the empty string, so we
  // use a non-colliding literal and translate it back to "no selection" on
  // emit. (Same pattern as state-expr-atom's "State" sentinel.)
  private static readonly _ADD_MATCHER_PLACEHOLDER = "__add_matcher__";

  /* v8 ignore start -- ha-form not registered in jsdom */
  private _onAddMatcherHaForm = (e: CustomEvent<{ value: { add: string } }>) => {
    e.stopPropagation();
    const name = e.detail.value.add;
    if (name === AmbienceRuleEditor._ADD_MATCHER_PLACEHOLDER) return;
    this._addMatcher(name);
  };
  /* v8 ignore stop */

  private _addMatcher(name: string) {
    if (!name) return;
    // If a different slot is open and invalid, refuse to switch.
    if (this._open !== null && !this._tryCloseCurrent()) return;
    this._open = { kind: "matcher", id: name };
    this._showError = false;
  }

  private _removeMatcher(name: string) {
    if (!this._draft) return;
    const when = { ...this._draft.when };
    delete when[name];
    this._draft = { ...this._draft, when };
    if (this._open?.kind === "matcher" && this._open.id === name) {
      this._open = null;
      this._showError = false;
    }
  }

  private _renderAddMatcher() {
    const unused = this._unusedMatchers();
    if (unused.length === 0) return "";
    /* v8 ignore next 4 -- ha-form not registered in jsdom; jsdom tests hit the fallback below */
    if (customElements.get("ha-form")) {
      return this._renderAddMatcherHaForm(unused);
    }
    return html`
      <div class="add-matcher">
        <select class="add-matcher" @change=${this._onAddMatcher}>
          <option value="">${localize(this.hass, "ui.add_condition", "+ Add condition…")}</option>
          ${unused.map((m) => html`<option value=${m.name}>${matcherLabel(this.hass as any, m.name)}</option>`)}
        </select>
      </div>
    `;
  }

  /* v8 ignore start -- ha-form path (real HA only) */
  private _renderAddMatcherHaForm(unused: MatcherInfo[]) {
    const placeholderLabel = localize(this.hass, "ui.add_condition", "+ Add condition…");
    const schema = [{
      name: "add",
      selector: {
        select: {
          mode: "dropdown",
          options: [
            { value: AmbienceRuleEditor._ADD_MATCHER_PLACEHOLDER, label: placeholderLabel },
            ...unused.map((m) => ({ value: m.name, label: matcherLabel(this.hass as any, m.name) })),
          ],
        },
      },
    }];
    return html`
      <div class="add-matcher">
        <ha-form
          .hass=${this.hass}
          .schema=${schema}
          .data=${{ add: AmbienceRuleEditor._ADD_MATCHER_PLACEHOLDER }}
          .computeLabel=${() => ""}
          @value-changed=${this._onAddMatcherHaForm}
        ></ha-form>
      </div>
    `;
  }
  /* v8 ignore stop */

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
    const entities = this.scope
      ? entitiesForScope(this.hass as any, this.scope, info?.domains ?? [])
      : [];
    return html`
      <div class="slot ${open ? "expanded" : "collapsed"}" data-slot-id="action-${idx}">
        <div class="summary" @click=${() => this._toggleSlot({ kind: "action", idx })}>
          <span class="summary-label">${summary}</span>
          <button class="remove" @click=${(e: Event) => { e.stopPropagation(); this._deleteAction(idx); }} title=${localize(this.hass, "ui.remove_action", "Remove action")}>✕</button>
        </div>
        ${open ? html`
          <div class="body">
            <label>${localize(this.hass, "ui.target", "Target")}</label>
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
    // Defense in depth: a matcher set to "any" should not persist as a null
    // predicate in storage. _setPredicate already deletes on null for live
    // user input, but older storage / hand-edited JSON might still carry one.
    const when = Object.fromEntries(
      Object.entries(this._draft.when).filter(([, v]) => v != null),
    );
    this.dispatchEvent(new CustomEvent("save-rule", {
      detail: { ...this._draft, when }, bubbles: true, composed: true,
    }));
  }

  private _cancel() {
    this.dispatchEvent(new CustomEvent("cancel-rule", { bubbles: true, composed: true }));
  }

  override render() {
    if (!this._draft) return html``;
    const visibleMatchers = this._visibleMatchers();
    return html`
      <div class="modal" @click=${this._onModalClick}>
        <div class="content">
          ${this._renderNameSlot()}

          <h3>${localize(this.hass, "ui.when_heading", "When")}</h3>
          ${visibleMatchers.map((m) => this._renderMatcherRow(m))}
          ${this._renderAddMatcher()}

          <h3>${localize(this.hass, "ui.actions_heading", "Actions")}</h3>
          ${this._draft.actions.map((a, i) => this._renderActionRow(a, i))}
          <button class="secondary add-action" @click=${this._addActionSlot}>${localize(this.hass, "ui.add_action", "+ Add action")}</button>
        </div>

        <div class="actions-bar">
          <button class="secondary" @click=${this._cancel}>${localize(this.hass, "ui.cancel", "Cancel")}</button>
          <button class="primary" @click=${this._save}>${localize(this.hass, "ui.save_rule", "Save rule")}</button>
        </div>
      </div>
    `;
  }
}
