import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassConnection } from "../api.js";
import { categorySwatch, categorySwatchStyles } from "../category-swatch.js";
import { entitiesForScope, sceneNameKey, scopeKey } from "../entities-for-scope.js";
import { pickHaTextInput, watchHaComponents } from "../ha-components.js";
import { conditionLabel, localize } from "../i18n.js";
import { effectiveReapplySeconds, parseReapplyOverrideSeconds } from "../reapply.js";
import { entitiesUsedByOtherActions, stripPositionMetadata } from "../scene.js";
import { scopeIcon } from "../scope-icon.js";
import { sceneDisplayName, summariseAction, summariseCondition } from "../summary.js";
import type {
  ActionSpec,
  ConditionInfo,
  DayConfig,
  ExposedAction,
  PeriodStoreView,
  Scene,
  SceneCategory,
  Scope,
  ScopeOption,
} from "../types.js";
import "./action-slot.js";
import "./condition-input.js";
import { statePredicateError } from "./state-predicate-input.js";

type OpenSlot =
  | { kind: "name" }
  | { kind: "category" }
  | { kind: "destination" }
  | { kind: "condition"; id: string }
  | { kind: "action"; idx: number }
  | null;

/**
 * True for the people condition's "X of: nothing selected" invalid shape: a
 * predicate object carrying a `who` key that is a present-but-empty array.
 * (An "X of:" mode with zero people ticked.) Used by both validation and save.
 */
function _isEmptyWhoPredicate(pred: unknown): boolean {
  return (
    pred != null &&
    typeof pred === "object" &&
    Array.isArray((pred as { who?: unknown }).who) &&
    (pred as { who: unknown[] }).who.length === 0
  );
}

/**
 * The default predicate seeded into `when` when a condition is added via the
 * +Add condition dropdown. The people condition defaults to a real
 * "Everybody is Home" constraint (rather than the wildcard "(any)") — to get
 * the wildcard back, the user removes the condition. Every other condition keeps
 * the "(any)" default, i.e. no predicate is seeded.
 */
function _defaultPredicateFor(name: string): unknown {
  if (name === "people") return { quant: "everyone", where: "home" };
  return null;
}

function sameScope(a?: Scope, b?: Scope): boolean {
  return !!a && !!b && scopeKey(a) === scopeKey(b);
}

@customElement("ambience-scene-editor")
export class AmbienceSceneEditor extends LitElement {
  static override styles = [
    categorySwatchStyles,
    css`
    :host {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.4); z-index: 100;
      /* Centre the fixed-height modal so it leaves a little space above and
         below the viewport edges, matching the config (settings) modal. */
      align-items: center; justify-content: center;
      --category-swatch-size: 1.75rem;
      --category-swatch-icon-size: 18px;
    }
    :host([open]) { display: flex; }
    .modal {
      background: var(--card-background-color, #fff); color: inherit;
      width: 90%; max-width: 40rem;
      height: calc(100vh - 24px);
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
    /* min-width:0 lets the flex item shrink below its content's intrinsic
       width; overflow-wrap breaks long unbreakable tokens (e.g. a template
       string) so the summary wraps instead of overflowing the panel. */
    .summary-label { flex: 1; min-width: 0; overflow-wrap: anywhere; }
    .slot.expanded .summary {
      background: var(--secondary-background-color, #f5f5f5);
    }
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
      display: flex; justify-content: flex-end; align-items: center; gap: 0.5rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      flex-shrink: 0;
    }
    /* Push the save error to the left so the Cancel/Save buttons stay right. */
    .actions-bar .save-error { margin-right: auto; margin-top: 0; }
    select.add-condition, select.add-action {
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
    .add-action-empty {
      color: var(--secondary-text-color, #888);
      font-style: italic;
      margin: 0.5rem 0;
      padding: 0.5rem 0;
    }
    .reapply-override {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px dotted var(--divider-color, #eee);
      font-size: 0.9rem;
      flex-wrap: wrap;
    }
    .reapply-override label {
      flex: 0 0 auto;
      color: var(--secondary-text-color, #888);
    }
    .reapply-override input[data-reapply-override] {
      width: 5rem;
      box-sizing: border-box;
      padding: 0.25rem 0.4rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 3px;
      background: transparent;
      color: var(--primary-text-color, inherit);
      font: inherit;
    }
    .reapply-override .reapply-unit {
      color: var(--secondary-text-color, #888);
      flex: 0 0 auto;
    }
    .reapply-badge {
      font-size: 0.75rem;
      background: var(--secondary-background-color, #f5f5f5);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 3px;
      color: var(--secondary-text-color, #888);
      padding: 0.1rem 0.35rem;
      white-space: nowrap;
      flex: 0 0 auto;
    }
    .error {
      color: var(--error-color, #c62828);
      font-size: 0.9em;
      margin-top: 0.5rem;
      padding: 0.3rem 0;
    }
    /* Scope icon in the destination summary + option list — matches the
       scope-header icon (HA's area/floor icon, or a per-kind default). */
    .scope-icon {
      flex: 0 0 auto;
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color, #888);
      vertical-align: middle;
    }
    .scope-name { flex: 1; min-width: 0; overflow-wrap: anywhere; }
    /* Scope picker: the option list shown directly when expanded, each with its
       scope icon. Mirrors the category menu (native/ha-form selects can't carry
       per-option icons, and HA's icon-capable lists churn across versions). */
    .scope-menu { display: flex; flex-direction: column; gap: 0.15rem; padding: 0.35rem; }
    .scope-option {
      display: flex; align-items: center; gap: 0.6rem; width: 100%;
      min-height: 40px; box-sizing: border-box;
      padding: 0.3rem 0.5rem; border: 0; border-radius: 6px;
      background: none; color: var(--primary-text-color, inherit);
      cursor: pointer; font: inherit; font-size: 1rem; text-align: left;
    }
    .scope-option:hover { background: var(--secondary-background-color, #f5f5f5); }
    .scope-option[aria-selected="true"] {
      background: var(--secondary-background-color, #eee); font-weight: 600;
    }
    /* Category field: colour-coded swatch + icon (shell from categorySwatchStyles),
       matching the scenes-list filter. */
    .category-name { flex: 1; min-width: 0; overflow-wrap: anywhere; }
    .category-menu { display: flex; flex-direction: column; gap: 0.15rem; padding: 0.35rem; }
    .category-option {
      display: flex; align-items: center; gap: 0.6rem; width: 100%;
      min-height: 40px; box-sizing: border-box;
      padding: 0.3rem 0.5rem; border: 0; border-radius: 6px;
      background: none; color: var(--primary-text-color, inherit);
      cursor: pointer; font: inherit; font-size: 1rem; text-align: left;
    }
    .category-option:hover { background: var(--secondary-background-color, #f5f5f5); }
    .category-option[aria-selected="true"] {
      background: var(--secondary-background-color, #eee); font-weight: 600;
    }
  `,
  ];

  @property({ type: Boolean, reflect: true }) open = false;
  @property({ attribute: false }) scene: Scene | null = null;
  @property({ attribute: false }) conditions: ConditionInfo[] = [];
  @property({ attribute: false }) periods?: PeriodStoreView;
  @property({ attribute: false }) luxRanges?: import("../types.js").LuxRangeStoreView;
  @property({ attribute: false }) dayConfig?: DayConfig;
  @property({ attribute: false }) weatherConfig?: import("../types.js").WeatherConfig;
  @property({ attribute: false }) availableActions: ExposedAction[] = [];
  @property({ attribute: false }) categories: SceneCategory[] = [];
  @property({ attribute: false }) schemas: Record<string, import("../types.js").ServiceSchema> = {};
  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) scope?: Scope;
  @property({ attribute: false }) scopes: ScopeOption[] = [];
  /**
   * Lowercased, trimmed names already taken in each (scope, category) pair,
   * keyed by `sceneNameKey`. Supplied by the parent, which excludes the scene
   * currently being edited so renaming-to-same is never a false conflict. A
   * scene's name must be unique within its scope + category.
   */
  @property({ attribute: false }) takenNames: Map<string, Set<string>> = new Map();

  /**
   * A save failure reported by the parent (e.g. the backend rejected the save).
   * Shown in the actions bar so the user sees why the save didn't go through —
   * the page-level error banner is hidden behind this modal. Empty = no error.
   */
  @property({ attribute: false }) saveError = "";

  @state() private _draft: Scene | null = null;
  @state() private _scope?: Scope;
  @state() private _open: OpenSlot = null;
  @state() private _showError = false;
  /**
   * Names of conditions added via the dropdown during this editing session, in
   * the order they were added. A newly added condition always sorts after the
   * pre-existing ones, so it appears last in the list at the moment it's added.
   * This is session-only display state — it is NOT persisted, so reopening the
   * editor reverts to the natural (priority) order. Reset whenever the editor
   * opens.
   */
  @state() private _addOrder: string[] = [];
  /**
   * Tracks whether each action's service requires a target. Keyed by service
   * id rather than action index so it remains valid when actions are
   * added/deleted/reordered. `false` means the schema loaded and has no target
   * stanza (e.g. notify.send_message). Entries are populated lazily when the
   * action-slot emits `target-mode-changed`.
   */
  @state() private _serviceHasTarget: Map<string, boolean> = new Map();

  /**
   * Last-known error reported by a condition's input widget, keyed by condition
   * name (via the `render-invalid-changed` event — the template condition is the
   * first emitter, but the channel is condition-agnostic). A present entry means
   * that condition is invalid, so closing/saving its slot is blocked until it's
   * fixed. Not reactive: it's read during the `_showError`-gated render.
   */
  private _conditionError: Map<string, string> = new Map();

  private _onConditionInvalid(name: string, error: string | null) {
    if (error) this._conditionError.set(name, error);
    else this._conditionError.delete(name);
  }

  override connectedCallback() {
    super.connectedCallback();
    watchHaComponents(this, this.hass);
  }

  override willUpdate(changed: Map<string, unknown>) {
    // Initialise the draft ONLY when the editor opens. Once open, ignore
    // subsequent `scene` prop changes — the parent re-derives `scene` from a
    // possibly-refreshed config every time `area_registry_updated` fires,
    // and we don't want an unrelated refetch to clobber the user's
    // in-progress edits.
    const isOpening = changed.has("open") && this.open;
    if (isOpening) {
      this._draft = this.scene ? JSON.parse(JSON.stringify(this.scene)) : null;
      this._scope = this.scope;
      // Everything collapsed by default.
      this._open = null;
      this._showError = false;
      this._addOrder = [];
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

  private _setDestination(idx: number) {
    const opt = this.scopes[idx];
    if (!opt || !this._draft) return;
    this._scope = opt.scope;
    if (!this.hass) return;
    // Re-check action targets against the new scope. Pruning is destructive:
    // switching back to the old scope does NOT restore cleared refs. Condition
    // predicates may legitimately reference other scopes, so they're untouched.
    const inScope = new Set(entitiesForScope(this.hass, this._scope, []));
    this._draft = {
      ...this._draft,
      actions: this._draft.actions.map((a) => ({
        ...a,
        entity_ids: a.entity_ids.filter((id) => inScope.has(id)),
      })),
    };
  }

  // Expanded scope picker: the option list shown directly (like the category
  // field), so one click on the summary opens it. Each option carries its scope
  // icon — native/ha-form selects render text-only options, and HA's
  // icon-capable list components churn across versions (mwc → webawesome).
  // Picking an option closes the slot, mirroring the category menu.
  private _renderDestination() {
    return html`
      <div class="scope-menu" role="listbox">
        ${this.scopes.map(
          (o, i) => html`<button
            class="scope-option"
            role="option"
            aria-selected=${sameScope(o.scope, this._scope)}
            @click=${() => {
              this._setDestination(i);
              this._open = null;
            }}
          >
            <ha-icon class="scope-icon" icon=${scopeIcon(o.scope, this.hass as any)}></ha-icon>
            <span class="scope-name">${o.label}</span>
          </button>`,
        )}
      </div>
    `;
  }

  /**
   * The destination scope as a collapse/expand slot (like the name field): a
   * summary of the current scope, replaced by the selector when clicked.
   */
  private _renderDestinationSlot() {
    if (this.scopes.length === 0) return "";
    if (this._isOpen({ kind: "destination" })) {
      return html`
        <div class="slot destination-slot expanded" data-slot-id="destination">
          ${this._renderDestination()}
        </div>
      `;
    }
    const current = this.scopes.find((o) => sameScope(o.scope, this._scope)) ?? this.scopes[0];
    return html`
      <div class="slot collapsed" data-slot-id="destination">
        <div class="summary" @click=${() => this._toggleSlot({ kind: "destination" })}>
          <strong>${localize(this.hass, "ui.scope", "Scope")}:</strong>
          <ha-icon class="scope-icon" icon=${scopeIcon(current.scope, this.hass as any)}></ha-icon>
          <span class="scope-name">${current.label}</span>
        </div>
      </div>
    `;
  }

  private _renderNameSlot() {
    const value = this._draft!.name ?? "";
    const open = this._isOpen({ kind: "name" });
    if (open) {
      // Just the input — no header, no label, no enclosing chrome.
      // The .slot class is kept (with the .name-slot.expanded variant) so the
      // click-outside detection in _onModalClick still treats this region as
      // "inside" an editable slot.
      const error = this._showError ? this._nameError() : null;
      return html`
        <div class="slot name-slot expanded" data-slot-id="name">
          ${this._renderNameInputControl(value)}
          ${error ? html`<div class="error">${error}</div>` : ""}
        </div>
      `;
    }
    const summaryText = sceneDisplayName(
      this._draft!,
      localize(this.hass, "ui.new_scene", "New scene"),
    );
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

  // --- Category field ---

  // A scene's category is required: the selector always has a value and there is
  // no "no category" option.

  private _setCategory(id: string) {
    if (!this._draft || !id || id === this._draft.category) return;
    // Pin position and priority are per-category, so moving a scene to a different
    // category invalidates them — drop the fixed-position fields so it falls back
    // to automatic ordering within the new category.
    this._draft = { ...stripPositionMetadata(this._draft), category: id };
  }

  /**
   * The category as a collapse/expand slot (like the name field): a swatch + name
   * summary, expanding to a colour-coded menu of swatch + name options (the same
   * visual language as the scenes-list category filter).
   */
  private _renderCategorySlot() {
    if (this.categories.length === 0) return "";
    const sorted = [...this.categories].sort((a, b) => a.name.localeCompare(b.name));
    const currentId = this._effectiveCategoryId();
    const current = this.categories.find((g) => g.id === currentId) ?? sorted[0];
    if (this._isOpen({ kind: "category" })) {
      return html`
        <div class="slot category-slot expanded" data-slot-id="category">
          <div class="category-menu" role="listbox">
            ${sorted.map(
              (g) => html`<button
                class="category-option"
                role="option"
                aria-selected=${g.id === currentId}
                @click=${() => {
                  this._setCategory(g.id);
                  this._open = null;
                }}
              >
                ${categorySwatch(g.color, g.icon)}
                <span class="category-name">${g.name}</span>
              </button>`,
            )}
          </div>
        </div>
      `;
    }
    return html`
      <div class="slot collapsed" data-slot-id="category">
        <div class="summary" @click=${() => this._toggleSlot({ kind: "category" })}>
          <strong>${localize(this.hass, "ui.category", "Category")}:</strong>
          ${categorySwatch(current.color, current.icon)}
          <span class="category-name">${current.name}</span>
        </div>
      </div>
    `;
  }

  // --- Collapse helpers ---

  private _isOpen(slot: Exclude<OpenSlot, null>): boolean {
    const open = this._open;
    if (open === null || open.kind !== slot.kind) return false;
    if (slot.kind === "condition" && open.kind === "condition") return slot.id === open.id;
    if (slot.kind === "action" && open.kind === "action") return slot.idx === open.idx;
    // name / category / destination — a kind match is sufficient (single instance).
    return true;
  }

  /** The category the draft will be saved under: its explicit category, or the
   *  alphabetically-first one (which the collapsed category summary also shows
   *  as the effective value). */
  private _effectiveCategoryId(): string {
    if (this._draft?.category) return this._draft.category;
    const sorted = [...this.categories].sort((a, b) => a.name.localeCompare(b.name));
    return sorted[0]?.id ?? "";
  }

  /** Name-slot validation: a non-empty name must be unique (case-insensitively)
   *  within the current scope + category. Empty/unnamed scenes are exempt. */
  private _nameError(): string | null {
    const name = this._draft?.name?.trim().toLowerCase();
    if (!name || !this._scope) return null;
    const key = sceneNameKey(this._scope, this._effectiveCategoryId());
    if (this.takenNames.get(key)?.has(name)) {
      return localize(
        this.hass,
        "ui.name_duplicate",
        "A scene with this name already exists in this category.",
      );
    }
    return null;
  }

  /**
   * Returns a user-facing error string if the currently open slot has invalid
   * data, or null if valid.
   *
   * - Name slot: must be unique within the scope + category (see `_nameError`).
   * - Condition slots: predicates are valid by construction, with one exception —
   *   the people condition's "X of:" modes carry a `who` array that must not be
   *   empty (an unfinished selection). A present-but-empty `who` is the error.
   * - Action slots: must have at least one target. Per-field required-ness
   *   is enforced by ha-form / native browser validation inside the slot;
   *   the scene-editor only guards the cross-cutting "you forgot to pick a
   *   target" case.
   */
  private _validationError(slot: OpenSlot): string | null {
    if (slot === null) return null;
    // Category and destination always carry a valid value.
    if (slot.kind === "category" || slot.kind === "destination") return null;
    if (slot.kind === "name") return this._nameError();
    if (slot.kind === "condition") {
      // People empty-selection case: an "X of:" mode (who key present) with
      // zero people ticked. Other conditions are valid by construction.
      const pred = this._draft?.when[slot.id];
      if (_isEmptyWhoPredicate(pred)) {
        return localize(this.hass, "ui.people_select_one", "Select at least one person");
      }
      // Structurally validate a state predicate, so an incomplete atom (e.g.
      // entity picked but no state chosen) is caught even when this slot was
      // never opened — the input widget only mounts when expanded, so it can't
      // report via `render-invalid-changed`. Without this, a scene loaded from
      // storage with a half-filled state atom would pass the save gate and be
      // rejected by the backend with a cryptic ValueError.
      const stateErr = statePredicateError(pred, this.hass);
      if (stateErr) return stateErr;
      // A condition whose input widget reports an error (e.g. a `template` whose
      // Jinja throws) must not be left in the scene.
      if (this._conditionError.has(slot.id)) {
        return localize(
          this.hass,
          "ui.condition_error",
          "Fix the error in this condition before continuing",
        );
      }
      return null;
    }
    // slot.kind === "action"
    const action = this._draft?.actions[slot.idx];
    if (!action) return null;
    // Only enforce the entity-ids check when we KNOW the service has a target
    // (serviceHasTarget === true). If the schema is still loading (undefined)
    // or the service has no target stanza (false), skip the check — the slot's
    // hasTarget() uses the same conservative logic.
    const serviceHasTarget = this._serviceHasTarget.get(action.service);
    if (action.entity_ids.length === 0 && serviceHasTarget === true) {
      return localize(this.hass, "ui.at_least_one_target", "At least one target is required.");
    }
    return null;
  }

  /**
   * Validation that blocks *leaving* (collapsing or switching away from) a slot.
   *
   * A malformed condition/action must not be left behind — it would persist as
   * invalid data — so its error blocks leaving. A name-uniqueness conflict is
   * different: it's a cross-slot constraint, resolvable by moving the scene to a
   * category or scope where the name is free. Locking the user into the name
   * slot would make that resolution unreachable, so a name error never blocks
   * leaving — only the final save gate (`_save`) enforces it.
   */
  private _leaveBlockingError(slot: OpenSlot): string | null {
    if (slot?.kind === "name") return null;
    return this._validationError(slot);
  }

  /**
   * Attempt to close the currently open slot. Returns true if successfully
   * closed; false if blocked by a validation error (in which case `_showError`
   * is set so the error renders).
   */
  private _tryCloseCurrent(): boolean {
    if (this._open === null) return true;
    if (this._leaveBlockingError(this._open) !== null) {
      this._showError = true;
      return false;
    }
    this._open = null;
    this._showError = false;
    return true;
  }

  private _toggleSlot(slot: Exclude<OpenSlot, null>) {
    if (this._isOpen(slot)) {
      // Collapsing your own slot is a "minimize for now" gesture, but a slot
      // with a validation error can't be minimized away — same gate as leaving
      // it. (Removing via the ✕ is always available as an escape.)
      if (this._leaveBlockingError(slot) !== null) {
        this._showError = true;
        return;
      }
      this._open = null;
      this._showError = false;
      return;
    }
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
      // would collapse the condition slot the change handler just opened.
      if (node.classList.contains("add-condition")) return;
      // Same reasoning for the +Add action dropdown: opening it to browse
      // options should not be treated as "leaving the current slot".
      if (node.classList.contains("add-action")) return;
    }
    this._tryCloseCurrent();
  }

  // --- Condition row ---

  private _setPredicate(condition: string, value: unknown) {
    if (!this._draft) return;
    const when = { ...this._draft.when };
    if (value == null) delete when[condition];
    else when[condition] = value;
    this._draft = { ...this._draft, when };
  }

  private _renderConditionRow(m: ConditionInfo) {
    const value = this._draft!.when[m.name] ?? null;
    const open = this._isOpen({ kind: "condition", id: m.name });

    const summary = summariseCondition(m.name, value, {
      hass: this.hass as any,
      periods: this.periods,
      luxRanges: this.luxRanges,
    });
    return html`
      <div class="slot ${open ? "expanded" : "collapsed"}" data-slot-id=${m.name}>
        <div class="summary" @click=${() => this._toggleSlot({ kind: "condition", id: m.name })}>
          <span class="summary-label"><strong>${conditionLabel(this.hass as any, m.name)}:</strong> ${summary}</span>
          <button
            class="remove"
            @click=${(e: Event) => {
              e.stopPropagation();
              this._removeCondition(m.name);
            }}
            title=${localize(this.hass, "ui.remove_condition", "Remove condition")}
          >✕</button>
        </div>
        ${
          open
            ? html`
          <div class="body">
            <ambience-condition-input
              .hass=${this.hass}
              .condition=${m}
              .value=${value}
              .periods=${this.periods}
              .luxRanges=${this.luxRanges}
              .dayConfig=${this.dayConfig}
              .weatherConfig=${this.weatherConfig}
              @value-changed=${(e: CustomEvent<{ value: unknown }>) => this._setPredicate(m.name, e.detail.value)}
              @render-invalid-changed=${(e: CustomEvent<{ error: string | null }>) => this._onConditionInvalid(m.name, e.detail.error)}
            ></ambience-condition-input>

            ${
              this._showError && this._validationError({ kind: "condition", id: m.name })
                ? html`
              <div class="error">${this._validationError({ kind: "condition", id: m.name })}</div>
            `
                : ""
            }
          </div>
        `
            : ""
        }
      </div>
    `;
  }

  // --- Condition visibility / add+remove ---

  /**
   * Conditions shown as rows. A condition is visible only if it has a non-null
   * value in `when`, OR if it's the currently-open slot (just-added via
   * dropdown, no predicate set yet). A stored null predicate is treated as
   * "not in the scene" — same as an absent key.
   */
  private _visibleConditions(): ConditionInfo[] {
    if (!this._draft) return [];
    const when = this._draft.when;
    const visible = this.conditions.filter(
      (m) =>
        (m.name in when && when[m.name] != null) ||
        (this._open?.kind === "condition" && this._open.id === m.name),
    );
    // Conditions added this session go last, in the order they were added — a
    // newly added condition appears last. Pre-existing ones keep their natural
    // (priority) order.
    const added = new Set(this._addOrder);
    const preExisting = visible.filter((m) => !added.has(m.name));
    const addedInOrder = this._addOrder
      .map((name) => visible.find((m) => m.name === name))
      .filter((m): m is ConditionInfo => m != null);
    return [...preExisting, ...addedInOrder];
  }

  private _unusedConditions(): ConditionInfo[] {
    const visible = new Set(this._visibleConditions().map((m) => m.name));
    return this.conditions
      .filter((m) => !visible.has(m.name))
      .sort((a, b) =>
        conditionLabel(this.hass as any, a.name).localeCompare(
          conditionLabel(this.hass as any, b.name),
        ),
      );
  }

  private _onAddCondition = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    const name = select.value;
    select.value = ""; // reset placeholder regardless of branch
    this._addCondition(name);
  };

  // Sentinel value for the ha-form select's placeholder option. ha-form's
  // dropdown won't render an option whose value is the empty string, so we
  // use a non-colliding literal and translate it back to "no selection" on
  // emit. (Same pattern as state-expr-atom's "State" sentinel.)
  private static readonly _ADD_CONDITION_PLACEHOLDER = "__add_condition__";

  /* v8 ignore start -- ha-form not registered in jsdom */
  private _onAddConditionHaForm = (e: CustomEvent<{ value: { add: string } }>) => {
    e.stopPropagation();
    const name = e.detail.value.add;
    if (name === AmbienceSceneEditor._ADD_CONDITION_PLACEHOLDER) return;
    this._addCondition(name);
  };
  /* v8 ignore stop */

  private _addCondition(name: string) {
    if (!name) return;
    // If a different slot is open and invalid, refuse to switch.
    if (this._open !== null && !this._tryCloseCurrent()) return;
    // Seed a default predicate for conditions that want a real starting
    // constraint (currently only `people` → "Everybody is Home"). Skip if the
    // key is already present so we never clobber an existing value.
    const def = _defaultPredicateFor(name);
    if (def != null && this._draft && !(name in this._draft.when)) {
      this._draft = { ...this._draft, when: { ...this._draft.when, [name]: def } };
    }
    // Track add-order so the new condition sorts last (see `_addOrder`). Move it
    // to the end if it was already added-then-removed earlier this session.
    this._addOrder = [...this._addOrder.filter((n) => n !== name), name];
    this._open = { kind: "condition", id: name };
    this._showError = false;
  }

  private _removeCondition(name: string) {
    if (!this._draft) return;
    const when = { ...this._draft.when };
    delete when[name];
    this._draft = { ...this._draft, when };
    this._conditionError.delete(name);
    if (this._open?.kind === "condition" && this._open.id === name) {
      this._open = null;
      this._showError = false;
    }
  }

  // A condition that depends on extra configuration is greyed out in the
  // add-condition dropdown until that configuration exists — selecting it would
  // only fail validation on save. Currently only `weather`, which needs a
  // weather entity to be configured (see weather.py validate_predicate).
  private _conditionDisabled(name: string): boolean {
    return name === "weather" && !this.weatherConfig?.entity;
  }

  private _renderAddCondition() {
    const unused = this._unusedConditions();
    if (unused.length === 0) return "";
    /* v8 ignore next 4 -- ha-form not registered in jsdom; jsdom tests hit the fallback below */
    if (customElements.get("ha-form")) {
      return this._renderAddConditionHaForm(unused);
    }
    return html`
      <div class="add-condition">
        <select class="add-condition" @change=${this._onAddCondition}>
          <option value="">${localize(this.hass, "ui.add_condition", "+ Add condition…")}</option>
          ${unused.map((m) => html`<option value=${m.name} ?disabled=${this._conditionDisabled(m.name)}>${conditionLabel(this.hass as any, m.name)}</option>`)}
        </select>
      </div>
    `;
  }

  /* v8 ignore start -- ha-form path (real HA only) */
  private _renderAddConditionHaForm(unused: ConditionInfo[]) {
    const placeholderLabel = localize(this.hass, "ui.add_condition", "+ Add condition…");
    const schema = [
      {
        name: "add",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: AmbienceSceneEditor._ADD_CONDITION_PLACEHOLDER, label: placeholderLabel },
              ...unused.map((m) => ({
                value: m.name,
                label: conditionLabel(this.hass as any, m.name),
                disabled: this._conditionDisabled(m.name),
              })),
            ],
          },
        },
      },
    ];
    return html`
      <div class="add-condition">
        <ha-form
          .hass=${this.hass}
          .schema=${schema}
          .data=${{ add: AmbienceSceneEditor._ADD_CONDITION_PLACEHOLDER }}
          .computeLabel=${() => ""}
          @value-changed=${this._onAddConditionHaForm}
        ></ha-form>
      </div>
    `;
  }
  /* v8 ignore stop */

  // --- Action row ---

  private static readonly _ADD_ACTION_PLACEHOLDER = "__add_action__";

  private _onAddAction = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    const name = select.value;
    select.value = "";
    this._addActionSlot(name);
  };

  /* v8 ignore start -- ha-form not registered in jsdom */
  private _onAddActionHaForm = (e: CustomEvent<{ value: { add: string } }>) => {
    e.stopPropagation();
    const name = e.detail.value.add;
    if (name === AmbienceSceneEditor._ADD_ACTION_PLACEHOLDER) return;
    this._addActionSlot(name);
  };
  /* v8 ignore stop */

  private _addActionSlot(name: string) {
    if (!this._draft || !name) return;
    if (this._open !== null && !this._tryCloseCurrent()) return;
    const spec: ActionSpec = { service: name, entity_ids: [], params: {} };
    const newIdx = this._draft.actions.length;
    this._draft = { ...this._draft, actions: [...this._draft.actions, spec] };
    this._open = { kind: "action", idx: newIdx };
    this._showError = false;
  }

  /** Friendly label for an ExposedAction in the add-action dropdown. */
  private _actionOptionLabel(a: ExposedAction): string {
    if (a.label?.trim()) return a.label;
    return a.id;
  }

  private _renderAddAction() {
    if (this.availableActions.length === 0) {
      return html`
        <p class="add-action-empty">
          ${localize(this.hass, "ui.no_exposed_actions", "Add services in Settings → Actions.")}
        </p>
      `;
    }
    /* v8 ignore next 3 -- ha-form not registered in jsdom */
    if (customElements.get("ha-form")) {
      return this._renderAddActionHaForm();
    }
    return html`
      <div class="add-action">
        <select class="add-action" @change=${this._onAddAction}>
          <option value="">${localize(this.hass, "ui.add_action", "+ Add action…")}</option>
          ${this.availableActions.map(
            (a) => html`
            <option value=${a.id}>${this._actionOptionLabel(a)}</option>
          `,
          )}
        </select>
      </div>
    `;
  }

  /* v8 ignore start -- ha-form path (real HA only) */
  private _renderAddActionHaForm() {
    const placeholderLabel = localize(this.hass, "ui.add_action", "+ Add action…");
    const schema = [
      {
        name: "add",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: AmbienceSceneEditor._ADD_ACTION_PLACEHOLDER, label: placeholderLabel },
              ...this.availableActions.map((a) => ({
                value: a.id,
                label: this._actionOptionLabel(a),
              })),
            ],
          },
        },
      },
    ];
    return html`
      <div class="add-action">
        <ha-form
          .hass=${this.hass}
          .schema=${schema}
          .data=${{ add: AmbienceSceneEditor._ADD_ACTION_PLACEHOLDER }}
          .computeLabel=${() => ""}
          @value-changed=${this._onAddActionHaForm}
        ></ha-form>
      </div>
    `;
  }
  /* v8 ignore stop */

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

  private _setActionParams(idx: number, params: Record<string, unknown>) {
    this._updateActionAt(idx, (a) => ({ ...a, params }));
  }

  private _onTargetModeChanged(service: string, hasTarget: boolean) {
    if (this._serviceHasTarget.get(service) === hasTarget) return;
    this._serviceHasTarget = new Map(this._serviceHasTarget).set(service, hasTarget);
  }

  private _setReapplyOverride(idx: number, rawValue: string) {
    const s = parseReapplyOverrideSeconds(rawValue);
    this._updateActionAt(idx, (a) => {
      if (s === null) {
        // Empty/invalid → REMOVE the key (inherit exposed default).
        const { reapply_seconds: _removed, ...rest } = a;
        return rest as ActionSpec;
      }
      // 0 = disable for this scene; >0 = custom seconds.
      return { ...a, reapply_seconds: s };
    });
  }

  private _renderReapplyOverride(action: ActionSpec, idx: number, exposedSeconds: number) {
    // Only render when the exposed action has re-apply enabled.
    if (exposedSeconds <= 0) return html``;

    // Empty field (key absent) → inheriting; explicit value (incl. 0) → shown.
    const fieldValue = "reapply_seconds" in action ? String(action.reapply_seconds) : "";

    return html`
      <div class="reapply-override">
        <label for="reapply-override-${idx}">
          ${localize(this.hass, "ui.reapply_seconds_label", "Re-apply every (seconds)")}
        </label>
        <input
          id="reapply-override-${idx}"
          type="number"
          min="0"
          data-reapply-override
          placeholder=${String(exposedSeconds)}
          .value=${fieldValue}
          @input=${(e: Event) => {
            e.stopPropagation();
            this._setReapplyOverride(idx, (e.target as HTMLInputElement).value);
          }}
        />
        <span class="reapply-unit">${localize(this.hass, "ui.reapply_seconds_unit", "s")}</span>
      </div>
    `;
  }

  private _renderActionRow(action: ActionSpec, idx: number) {
    const exposed = this.availableActions.find((x) => x.id === action.service);
    const exposedSeconds = exposed?.reapply_seconds ?? 0;
    const open = this._isOpen({ kind: "action", idx });
    const summary = summariseAction(action, {
      hass: this.hass as any,
      exposedActions: this.availableActions,
      schemas: this.schemas,
    });
    const effectiveSeconds = effectiveReapplySeconds(action, exposedSeconds);
    const showBadge = exposedSeconds > 0 && effectiveSeconds > 0;
    return html`
      <div class="slot ${open ? "expanded" : "collapsed"}" data-slot-id="action-${idx}">
        <div class="summary" @click=${() => this._toggleSlot({ kind: "action", idx })}>
          <span class="summary-label">${summary}</span>
          ${showBadge ? html`<span class="reapply-badge" data-reapply-badge>↺ ${effectiveSeconds}s</span>` : ""}
          <button class="remove" @click=${(e: Event) => {
            e.stopPropagation();
            this._deleteAction(idx);
          }} title=${localize(this.hass, "ui.remove_action", "Remove action")}>✕</button>
        </div>
        ${
          open
            ? html`
          <div class="body">
            <ambience-action-slot
              .hass=${this.hass}
              .scope=${this._scope}
              .exposed=${exposed}
              .entityIds=${action.entity_ids}
              .excludeEntities=${entitiesUsedByOtherActions(this._draft?.actions ?? [], idx)}
              .params=${action.params}
              @entity-ids-changed=${(e: CustomEvent<{ entityIds: string[] }>) => {
                e.stopPropagation();
                this._setActionTargets(idx, e.detail.entityIds);
              }}
              @params-changed=${(e: CustomEvent<{ params: Record<string, unknown> }>) => {
                e.stopPropagation();
                this._setActionParams(idx, e.detail.params);
              }}
              @target-mode-changed=${(e: CustomEvent<{ hasTarget: boolean }>) => {
                e.stopPropagation();
                this._onTargetModeChanged(action.service, e.detail.hasTarget);
              }}
            ></ambience-action-slot>

            ${this._renderReapplyOverride(action, idx, exposedSeconds)}

            ${
              this._showError && this._validationError({ kind: "action", idx })
                ? html`
              <div class="error">${this._validationError({ kind: "action", idx })}</div>
            `
                : ""
            }
          </div>
        `
            : ""
        }
      </div>
    `;
  }

  // --- Save / cancel ---

  private _save() {
    if (!this._draft) return;
    // Re-validate every slot through the same gate used for closing/collapsing.
    // Collapsed or loaded-from-storage slots are never opened, so this is the
    // only place they're checked — block on the first error and re-open the
    // offending slot with its message shown.
    if (this._nameError() !== null) {
      this._showError = true;
      this._open = { kind: "name" };
      return;
    }
    for (const id of Object.keys(this._draft.when)) {
      if (
        this._draft.when[id] != null &&
        this._validationError({ kind: "condition", id }) !== null
      ) {
        this._showError = true;
        this._open = { kind: "condition", id };
        return;
      }
    }
    for (let idx = 0; idx < this._draft.actions.length; idx++) {
      if (this._validationError({ kind: "action", idx }) !== null) {
        this._showError = true;
        this._open = { kind: "action", idx };
        return;
      }
    }
    // Defense in depth: a condition set to "any" should not persist as a null
    // predicate in storage. _setPredicate already deletes on null for live
    // user input, but older storage / hand-edited JSON might still carry one.
    const when = Object.fromEntries(Object.entries(this._draft.when).filter(([, v]) => v != null));
    this.dispatchEvent(
      new CustomEvent("save-scene", {
        detail: { scene: { ...this._draft, when }, scope: this._scope },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _cancel() {
    this.dispatchEvent(new CustomEvent("cancel-scene", { bubbles: true, composed: true }));
  }

  override render() {
    if (!this._draft) return html``;
    const visibleConditions = this._visibleConditions();
    return html`
      <div class="modal" @click=${this._onModalClick}>
        <div class="content">
          ${this._renderNameSlot()}
          ${this._renderCategorySlot()}
          ${this._renderDestinationSlot()}

          <h3>${localize(this.hass, "ui.when_heading", "When")}</h3>
          ${visibleConditions.map((m) => this._renderConditionRow(m))}
          ${this._renderAddCondition()}

          <h3>${localize(this.hass, "ui.actions_heading", "Actions")}</h3>
          ${this._draft.actions.map((a, i) => this._renderActionRow(a, i))}
          ${this._renderAddAction()}
        </div>

        <div class="actions-bar">
          ${this.saveError ? html`<div class="error save-error">${this.saveError}</div>` : ""}
          <button class="secondary" @click=${this._cancel}>${localize(this.hass, "ui.cancel", "Cancel")}</button>
          <button class="primary" @click=${this._save}>${localize(this.hass, "ui.save_scene", "Save scene")}</button>
        </div>
      </div>
    `;
  }
}
