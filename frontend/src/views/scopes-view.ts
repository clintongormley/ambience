import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import type { HassConnection } from "../api.js";
import { applyScenes, runSceneActions, setScopeEnabled } from "../api.js";
import { sceneNameKey, scopeCategoryKey, scopeKey } from "../entities-for-scope.js";
import { renderHaSwitch } from "../ha-switch.js";
import { localize } from "../i18n.js";
import { stripPositionMetadata } from "../scene.js";
import { scopeIcon } from "../scope-icon.js";
import type { ConditionInfo, Scene, Scope, ScopeConfig, ScopeOption } from "../types.js";
import {
  getCollapsedCategories,
  getConditionsHintDismissed,
  getExpandedScopes,
  setCollapsedCategories,
  setConditionsHintDismissed,
  setExpandedScopes,
} from "../ui-state.js";
import { renderAggregateProblemFlag } from "./problem-flag.js";
import { ScopeStore } from "./scope-store.js";
import "./scenes-list.js";
import "./scene-editor.js";
import "./kebab-menu.js";
import "./traces-modal.js";
import "./auto-triggers-modal.js";
import "./simulator-modal.js";
import type { KebabItem } from "./kebab-menu.js";

type EditingState = {
  scope: Scope;
  index: number;
  isNew: boolean;
  seed?: Scene;
  // For a new scene: the category to default to (from the per-category "Add
  // scene" button). Absent → fall back to `_defaultCategoryId()`.
  category?: string;
};

/** A single row in the front-page scope list. */
type ScopeRow = {
  scope: Scope;
  name: string;
  cfg: ScopeConfig;
  rowClass: "house" | "floor" | "area";
};

/** Format a remaining-seconds count as a compact countdown:
 *  `H:MM:SS` when there are hours, otherwise `M:SS`. */
function formatRemaining(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

// Must stay in sync with GAP in custom_components/ambience/sorting.py — the
// midpoint math below assumes the backend spaces auto priorities by this much.
const PIN_GAP = 1024;

/** Pick a priority for a scene dropped between `above` and `below` (either may be
 *  undefined at the list ends). `all` is the current scene set for end fallbacks. */
function _pinPriority(above: number | undefined, below: number | undefined, all: Scene[]): number {
  // Common case: dropped between two scenes — no need to scan the whole list.
  if (above !== undefined && below !== undefined) return Math.floor((above + below) / 2);
  const nums = all.map((r) => r.priority ?? 0);
  if (above === undefined && below === undefined) return PIN_GAP;
  if (above === undefined) return Math.max(...nums) + PIN_GAP; // top slot
  return Math.min(...nums) - PIN_GAP; // bottom slot
}

@customElement("ambience-scopes-view")
export class AmbienceScopesView extends LitElement {
  static override styles = [
    css`
      :host {
        display: block;
        padding: 1rem;
        /* Reading-column cap for the sidebar panel; the card overrides this var
         so it fills whatever width the user gives the card. */
        max-width: var(--ambience-content-max-width, 60rem);
        margin: 0 auto;
      }
      .empty {
        color: var(--secondary-text-color, #888);
        text-align: center;
        padding: 2rem;
      }
      .spinner {
        display: inline-block;
        width: 1.1em;
        height: 1.1em;
        margin-right: 0.5em;
        vertical-align: -0.2em;
        border: 2px solid var(--divider-color, #e0e0e0);
        border-top-color: var(--primary-color, #03a9f4);
        border-radius: 50%;
        animation: ambience-spin 0.8s linear infinite;
      }
      @keyframes ambience-spin {
        to {
          transform: rotate(360deg);
        }
      }
      .error {
        color: var(--error-color, #d32f2f);
        margin: 0.5rem 0;
      }
      .banner {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 0.85rem 1rem;
        margin: 0 0 1rem 0;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 8px;
        background: var(--card-background-color, #fff);
      }
      .banner-icon {
        flex: 0 0 auto;
        margin-top: 0.1rem;
        --mdc-icon-size: 22px;
      }
      .banner-required {
        border-color: var(--warning-color, #ffa600);
        background: color-mix(in srgb, var(--warning-color, #ffa600) 12%, var(--card-background-color, #fff));
      }
      .banner-required .banner-icon {
        color: var(--warning-color, #ffa600);
      }
      .banner-hint .banner-icon {
        color: var(--primary-color, #03a9f4);
      }
      .banner-text {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }
      .banner-text strong {
        font-weight: 600;
      }
      .banner-text span {
        font-size: 0.9rem;
        color: var(--secondary-text-color, #888);
      }
      .banner-cta {
        flex: 0 0 auto;
        align-self: center;
        background: var(--primary-color, #03a9f4);
        border: 1px solid var(--primary-color, #03a9f4);
        color: var(--text-primary-color, #fff);
        border-radius: 4px;
        padding: 0.45rem 0.9rem;
        font: inherit;
        font-size: 0.9rem;
        cursor: pointer;
        white-space: nowrap;
      }
      .banner-dismiss {
        flex: 0 0 auto;
        align-self: flex-start;
        background: transparent;
        border: none;
        color: var(--secondary-text-color, #888);
        cursor: pointer;
        font-size: 1rem;
        line-height: 1;
        padding: 0.15rem 0.3rem;
      }
      .banner-dismiss:hover {
        color: var(--primary-text-color, inherit);
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      li.scope-row {
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 4px;
        margin-bottom: 0.5rem;
        background: var(--card-background-color, #fff);
      }
      .scope-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        cursor: pointer;
        /* A soft grey header strip. --secondary-background-color is the page
         backdrop (a fairly heavy grey); mixing it down toward the card colour
         gives the lighter section-header tint HA uses for similar dividers. */
        background: color-mix(
          in srgb,
          var(--secondary-background-color, #e0e0e0) 50%,
          var(--card-background-color, #fff)
        );
        /* Collapsed: round all corners to match the card. */
        border-radius: 4px;
      }
      /* Expanded: only the top corners round, so the grey header meets the white
       body below with a flush edge. */
      .scope-header.open {
        border-radius: 4px 4px 0 0;
      }
      /* Faded ("empty"): the scope is on but has no rules in the active category.
       Dim the glyphs + text so it recedes behind active scopes; the switch and
       kebab stay full-strength so the row is still operable. */
      .scope-header.empty .chevron,
      .scope-header.empty .scope-icon,
      .scope-header.empty .scope-name,
      .scope-header.empty .scope-summary {
        opacity: 0.5;
      }
      /* Disabled ("off"): the scope's switch is off. Read more emphatically
       disabled than the faded state — flatten the header tint and dim its
       contents harder — while leaving the switch fully lit to re-enable. The
       kebab dims too, but via its own "muted" attribute (see the row below)
       so the dim reaches only the trigger, not the open menu popup. */
      .scope-header.off {
        /* A barely-there grey (≈ #f8f8f8 on the default light theme) — paler
         than the active header so a disabled scope reads washed-out. */
        background: color-mix(
          in srgb,
          var(--secondary-background-color, #e0e0e0) 25%,
          var(--card-background-color, #fff)
        );
      }
      .scope-header.off .chevron,
      .scope-header.off .scope-icon,
      .scope-header.off .scope-name,
      .scope-header.off .scope-summary {
        opacity: 0.4;
      }
      .chevron {
        width: 1em;
        color: var(--secondary-text-color, #888);
        transition: transform 0.1s;
      }
      .chevron.open {
        transform: rotate(90deg);
      }
      /* Scope icon (HA's area/floor icon, or a per-kind default) sits between the
         chevron and the name, sized + coloured like the other header glyphs. */
      .scope-icon {
        flex: 0 0 auto;
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color, #888);
      }
      .scope-name {
        flex: 1;
        text-align: left;
        font-weight: 600;
      }
      .scope-header ambience-problem-flag {
        margin-left: 0.25rem;
      }
      .scope-summary {
        font-size: 0.85em;
        color: var(--secondary-text-color, #888);
      }
      .scope-switch {
        flex: 0 0 auto;
        margin-left: 0.5rem;
        accent-color: var(--primary-color, #03a9f4);
        cursor: pointer;
      }
      .scope-pause {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--secondary-text-color);
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px;
      }
      .scope-pause.paused {
        color: var(--warning-color, #ffa600);
      }
      .scope-pause .countdown {
        font-variant-numeric: tabular-nums;
        font-size: 0.85em;
      }
      .scope-body {
        padding: 0.5rem 1rem 1rem 1rem;
        border-top: 1px solid var(--divider-color, #e0e0e0);
      }
    `,
  ];

  @property({ attribute: false }) hass!: HassConnection;

  // Data layer: static config, loaded scope configs, and their mutators live in
  // the store; this element renders straight off its fields.
  private _store = new ScopeStore(this);

  // _expanded keys: "area:<id>" | "floor:<id>" | "house". Seeded from
  // localStorage so a reload (or HA's panel rebuild on reconnect) restores which
  // rows were open; persisted on every change via _setExpanded.
  @state() private _expanded = new Set<string>(getExpandedScopes());
  // Collapsed category sections, keyed by scopeCategoryKey(scope, categoryId).
  // Owned here (scenes-list is presentational and rebuilt on every scope
  // reopen, so it can't hold this) and seeded from localStorage so a reload or
  // HA's panel rebuild on reconnect restores which sections were collapsed.
  @state() private _collapsedCategories = new Set<string>(getCollapsedCategories());
  @state() private _conditionsHintDismissed = false;
  @state() private _editing: EditingState | null = null;
  // A failed scene save's message, shown inside the (still-open) editor.
  @state() private _sceneEditorError = "";
  // Re-entrancy guard: the editor stays open during the save await, so a
  // double-clicked Save must not dispatch a second mutation.
  private _savingScene = false;
  @state() private _viewingTraces: {
    scope: { scope_kind: string; scope_id: string | null };
    category: string;
    categoryName: string | null;
  } | null = null;
  @state() private _viewingSimulator: {
    scope: { scope_kind: string; scope_id: string | null };
    category: string;
    categoryName: string | null;
  } | null = null;
  // The (scope, category) whose read-only Auto-triggers modal is open (null =
  // closed). Scope+category identity is stored; the live scenes are read from
  // `_store.getConfig` at render time so the modal re-fetches if that scope's
  // config changes.
  @state() private _autoTriggers: {
    scope: Scope;
    name: string;
    category: string;
    categoryName: string | null;
  } | null = null;
  // Global category filter, driven by the header's <ambience-category-filter>:
  // "" = All, else a category id. Set via Lit property binding only (never an
  // HTML attribute), matching how scenes-list declares the same input.
  @property({ attribute: false }) filterCategory = "";

  override async connectedCallback() {
    super.connectedCallback();
    this._conditionsHintDismissed = getConditionsHintDismissed();
    await this._store.loadStatic();
    await Promise.all([
      this._store.refreshAreas(),
      this._store.refreshFloors(),
      this._store.refreshHouse(),
      this._store.refreshSwitches(),
    ]);
    // The store owns the registry subscriptions (and tears them down in
    // hostDisconnected); it calls back here so the view can drop a removed
    // scope from its own expanded/editing state.
    await this._store.subscribe((scope) => this._onScopeRemoved(scope));
  }

  /** Drop a just-removed scope from the view's own state: collapse its row
   *  (persisted) and close the editor if it was editing that scope. */
  private _onScopeRemoved(scope: Scope) {
    const key = scopeKey(scope);
    const expanded = new Set(this._expanded);
    expanded.delete(key);
    this._setExpanded(expanded);
    // Drop the scope's collapsed-category keys too (parallel to `_expanded`).
    // Every such key is prefixed with `scopeCategoryKey(scope, "")`, and the NUL
    // in that prefix means it can't false-match a different scope's keys.
    const prefix = scopeCategoryKey(scope, "");
    this._setCollapsedCategories(
      new Set([...this._collapsedCategories].filter((k) => !k.startsWith(prefix))),
    );
    if (this._editing && scopeKey(this._editing.scope) === key) {
      this._editing = null;
    }
  }

  override willUpdate(changed: Map<string, unknown>): void {
    // React only to a genuine, user-driven change of the active filter. On the
    // initial property assignment Lit reports the old value as `undefined`; we
    // skip that so mount honours the persisted expanded/collapsed state intact.
    if (changed.has("filterCategory") && changed.get("filterCategory") !== undefined) {
      this._onFilterCategoryChanged();
    }
  }

  /** When the filter changes to a specific category X: collapse every scope row
   *  that has no scenes in X (leaving scopes WITH matching scenes as the user
   *  left them — no auto-expand), and clear X's collapse flag in every scope so
   *  the selected category is visible as soon as a scope is opened. Switching to
   *  "All" ("") does nothing. */
  private _onFilterCategoryChanged() {
    const x = this.filterCategory;
    if (x === "") return;
    const expanded = new Set(this._expanded);
    const collapsed = new Set(this._collapsedCategories);
    let expandedChanged = false;
    let collapsedChanged = false;
    for (const row of this._orderedScopeRows()) {
      const key = scopeKey(row.scope);
      if (this._matchingSceneCount(row.cfg) === 0 && expanded.delete(key)) {
        expandedChanged = true;
      }
      if (collapsed.delete(scopeCategoryKey(row.scope, x))) {
        collapsedChanged = true;
      }
    }
    if (expandedChanged) this._setExpanded(expanded);
    if (collapsedChanged) this._setCollapsedCategories(collapsed);
  }

  // --- expand --------------------------------------------------------------

  /** Update the expanded set and persist it, so the open/collapsed rows survive
   *  a reload or HA's panel rebuild on reconnect. */
  private _setExpanded(next: Set<string>) {
    this._expanded = next;
    setExpandedScopes([...next]);
  }

  private _toggleExpand(scope: Scope) {
    const key = scopeKey(scope);
    const next = new Set(this._expanded);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this._setExpanded(next);
  }

  /** Update the collapsed-categories set and persist it (same survives-reload
   *  rationale as `_setExpanded`). */
  private _setCollapsedCategories(next: Set<string>) {
    this._collapsedCategories = next;
    setCollapsedCategories([...next]);
  }

  /** Flip whether a category's section is collapsed within `scope`, driven by a
   *  click on that section's header in scenes-list. */
  private _toggleCategoryCollapse(scope: Scope, e: CustomEvent<{ categoryId: string }>) {
    const key = scopeCategoryKey(scope, e.detail.categoryId);
    const next = new Set(this._collapsedCategories);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this._setCollapsedCategories(next);
  }

  /** The collapsed category ids for one scope — derived by intersecting the
   *  persisted composite-key set with the known categories — to pass down to
   *  that scope's scenes-list. */
  private _collapsedCategoriesFor(scope: Scope): string[] {
    return this._store.categories
      .map((c) => c.id)
      .filter((id) => this._collapsedCategories.has(scopeCategoryKey(scope, id)));
  }

  // --- scenes ---------------------------------------------------------------

  private _addScene(scope: Scope, category?: string) {
    const cfg = this._store.getConfig(scope);
    if (!cfg) return;
    this._sceneEditorError = "";
    this._editing = { scope, index: cfg.scenes.length, isNew: true, category };
  }

  private _editScene(scope: Scope, e: CustomEvent<{ index: number }>) {
    this._sceneEditorError = "";
    this._editing = { scope, index: e.detail.index, isNew: false };
  }

  private _duplicateScene(scope: Scope, e: CustomEvent<{ index: number }>) {
    const cfg = this._store.getConfig(scope);
    if (!cfg) return;
    const original = cfg.scenes[e.detail.index];
    if (!original) return;
    // A duplicate is a fresh scene: drop the original's fixed position so it
    // doesn't inherit the pin/priority slot (the backend assigns a new one).
    const seed = stripPositionMetadata(JSON.parse(JSON.stringify(original)));
    this._sceneEditorError = "";
    this._editing = { scope, index: cfg.scenes.length, isNew: true, seed };
  }

  private _deleteScene(scope: Scope, e: CustomEvent<{ index: number }>) {
    const cfg = this._store.getConfig(scope);
    if (!cfg) return;
    const scenes = cfg.scenes.filter((_, i) => i !== e.detail.index);
    void this._store.mutate(scope, { ...cfg, scenes });
  }

  private _reorderScenes(scope: Scope, e: CustomEvent<{ from: number; to: number }>) {
    const cfg = this._store.getConfig(scope);
    if (!cfg) return;
    const { from, to } = e.detail;
    const moved = cfg.scenes[from];
    // Reorder is per-category: a drop whose target row is in a different
    // category is rejected (categories are independent; cross-category moves
    // aren't meaningful).
    if (!moved || cfg.scenes[to]?.category !== moved.category) return;
    const scenes = [...cfg.scenes];
    scenes.splice(from, 1);
    scenes.splice(to, 0, moved);
    // Pin priority is computed from the nearest SAME-CATEGORY neighbours around
    // the drop position (the backend keeps categories contiguous, so scanning
    // outward finds category-mates).
    const sameCategory = (idx: number) => scenes[idx] && scenes[idx].category === moved.category;
    let a = to - 1;
    while (a >= 0 && !sameCategory(a)) a--;
    let b = to + 1;
    while (b < scenes.length && !sameCategory(b)) b++;
    const above = a >= 0 ? scenes[a].priority : undefined;
    const below = b < scenes.length ? scenes[b].priority : undefined;
    const priority = _pinPriority(
      above,
      below,
      cfg.scenes.filter((r) => r.category === moved.category),
    );
    scenes[to] = { ...moved, priority, pinned: true };
    void this._store.mutate(scope, { ...cfg, scenes });
  }

  private _unpinScene(scope: Scope, e: CustomEvent<{ index: number }>) {
    const cfg = this._store.getConfig(scope);
    if (!cfg) return;
    const scenes = cfg.scenes.map((r, i) => (i === e.detail.index ? { ...r, pinned: false } : r));
    void this._store.mutate(scope, { ...cfg, scenes });
  }

  private _toggleSceneEnabled(scope: Scope, e: CustomEvent<{ index: number; enabled: boolean }>) {
    const cfg = this._store.getConfig(scope);
    if (!cfg) return;
    const scenes = cfg.scenes.map((r, i) => {
      if (i !== e.detail.index) return r;
      if (e.detail.enabled) {
        // Re-enable: drop the key entirely (absent = enabled) so default
        // scenes stay clean.
        const next = { ...r };
        delete next.enabled;
        return next;
      }
      return { ...r, enabled: false };
    });
    void this._store.mutate(scope, { ...cfg, scenes });
  }

  private async _saveScene(e: CustomEvent<{ scene: Scene; scope: Scope }>) {
    // Ignore a re-entrant save (e.g. a double-clicked Save) while one is still
    // in flight — the editor stays open during the await, so without this guard
    // a second dispatch would push a duplicate mutation.
    if (this._savingScene) return;
    const editing = this._editing;
    if (!editing) return;
    const { scene, scope: target } = e.detail;
    this._savingScene = true;
    this._sceneEditorError = "";
    try {
      if (scopeKey(target) === scopeKey(editing.scope)) {
        // Same scope: replace in place, or append a new scene.
        const cfg = this._store.getConfig(target);
        if (!cfg) return;
        const scenes = [...cfg.scenes];
        if (editing.isNew) scenes.push(scene);
        else scenes[editing.index] = scene;
        // Close the editor only on success; on failure keep it open with the
        // draft intact and show why the save was rejected.
        if (await this._store.mutate(target, { ...cfg, scenes })) this._editing = null;
        else this._sceneEditorError = this._takeError();
        return;
      }

      // Different scope: the scene lands fresh. Strip ordering metadata so the
      // backend assigns a new priority.
      const fresh = stripPositionMetadata(scene);
      const targetCfg = this._store.getConfig(target);
      if (!targetCfg) return;
      const added = await this._store.mutate(target, {
        ...targetCfg,
        scenes: [...targetCfg.scenes, fresh],
      });
      if (!added) {
        this._sceneEditorError = this._takeError();
        return;
      }
      this._editing = null;

      // Only remove the original once it is safely in the new scope — otherwise a
      // failed add would lose the scene entirely. (A failed removal after a
      // successful add merely leaves a duplicate, which is the accepted
      // non-atomic outcome.)
      if (!editing.isNew) {
        const srcCfg = this._store.getConfig(editing.scope);
        if (srcCfg) {
          const scenes = srcCfg.scenes.filter((_, i) => i !== editing.index);
          await this._store.mutate(editing.scope, { ...srcCfg, scenes });
        }
      }
    } finally {
      this._savingScene = false;
    }
  }

  /** Move the page-level error (set by `_store.mutate`) into the scene editor,
   *  where it shows in the open modal rather than behind it, and clear the banner. */
  private _takeError(): string {
    const msg = this._store.error;
    this._store.error = "";
    return msg;
  }

  /** Run an api call, surfacing any failure in `_store.error`. */
  private async _callApi(fn: () => Promise<unknown>) {
    this._store.error = "";
    try {
      await fn();
    } catch (e) {
      this._store.error = (e as Error).message || String(e);
    }
  }

  private _applyScenes(scope: Scope, categoryId?: string) {
    return this._callApi(() => applyScenes(this.hass, scope, categoryId));
  }

  private _runSceneActions(scope: Scope, e: CustomEvent<{ index: number }>) {
    return this._callApi(() => runSceneActions(this.hass, scope, e.detail.index));
  }

  private _cancelScene() {
    // New scenes are not added to the config until saved, so cancel is a no-op.
    this._sceneEditorError = "";
    this._editing = null;
  }

  private _onScopeMenu(scope: Scope, id: string) {
    if (id === "run") void this._applyScenes(scope);
  }

  private _showAutoTriggers(scope: Scope, name: string, category: string) {
    const g = this._store.categories.find((x) => x.id === category);
    this._autoTriggers = { scope, name, category, categoryName: g?.name ?? null };
  }

  private _showTraces(scope: Scope, category: string) {
    const g = this._store.categories.find((x) => x.id === category);
    this._viewingTraces = {
      scope: {
        scope_kind: scope.kind,
        scope_id: "id" in scope ? scope.id : null,
      },
      category,
      categoryName: g?.name ?? null,
    };
  }

  private _showSimulator(scope: Scope, category: string) {
    const g = this._store.categories.find((x) => x.id === category);
    this._viewingSimulator = {
      scope: {
        scope_kind: scope.kind,
        scope_id: "id" in scope ? scope.id : null,
      },
      category,
      categoryName: g?.name ?? null,
    };
  }

  // --- derived -------------------------------------------------------------

  /** The category a newly-added scene should default to: the active filter when a
   *  single category is selected, otherwise the alphabetically-first category. */
  private _defaultCategoryId(): string {
    if (this.filterCategory !== "") return this.filterCategory;
    const sorted = [...this._store.categories].sort((a, b) => a.name.localeCompare(b.name));
    return sorted[0]?.id ?? "";
  }

  private get _editingScene(): Scene | null {
    if (!this._editing) return null;
    if (this._editing.seed) return this._editing.seed;
    if (this._editing.isNew)
      return {
        when: {},
        actions: [],
        category: this._editing.category ?? this._defaultCategoryId(),
      };
    const cfg = this._store.getConfig(this._editing.scope);
    return cfg?.scenes[this._editing.index] ?? null;
  }

  /** Condition rows for the scene editor — sorted by `priority` (higher first). */
  private get _editorConditions(): ConditionInfo[] {
    if (!this._editing) return [];
    return this._store.conditions.slice().sort((a, b) => b.priority - a.priority);
  }

  /** Lowercased scene names taken in each (scope, category) pair, for the scene
   *  editor's uniqueness check. The scene currently being edited is excluded so
   *  saving it under its own unchanged name is never a false conflict. */
  private get _takenSceneNames(): Map<string, Set<string>> {
    const map = new Map<string, Set<string>>();
    const editing = this._editing;
    const addScope = (scope: Scope, cfg: ScopeConfig | undefined) => {
      if (!cfg) return;
      const editingThisScope =
        !!editing && !editing.isNew && scopeKey(editing.scope) === scopeKey(scope);
      cfg.scenes.forEach((scene, i) => {
        if (editingThisScope && i === editing.index) return; // exclude the edited scene
        const name = scene.name?.trim().toLowerCase();
        if (!name) return;
        const key = sceneNameKey(scope, scene.category);
        let set = map.get(key);
        if (!set) {
          set = new Set();
          map.set(key, set);
        }
        set.add(name);
      });
    };
    addScope({ kind: "house" }, this._store.house);
    for (const f of this._store.floors) {
      addScope({ kind: "floor", id: f.floor_id }, this._store.floorConfigs.get(f.floor_id));
    }
    for (const a of this._store.areas) {
      addScope({ kind: "area", id: a.area_id }, this._store.areaConfigs.get(a.area_id));
    }
    return map;
  }

  /** Selectable destinations for the scene editor: house, then floors, then areas. */
  private get _scopeOptions(): ScopeOption[] {
    // Scope kind is conveyed visually (grouping/icons), so the "Floor:"/"Area:"
    // text prefixes are redundant — show bare names.
    return [
      {
        scope: { kind: "house" },
        label: localize(this.hass, "ui.scope_house", "House"),
      },
      ...this._store.floors.map((f) => ({
        scope: { kind: "floor" as const, id: f.floor_id },
        label: f.name,
      })),
      ...this._store.areas.map((a) => ({
        scope: { kind: "area" as const, id: a.area_id },
        label: a.name,
      })),
    ];
  }

  /** How many of a scope's scenes match the active category filter ("" = all).
   *  0 for a genuinely empty scope, and also 0 for a scope whose scenes all sit
   *  in other categories — the signal the header uses to fade itself. */
  private _matchingSceneCount(cfg: ScopeConfig): number {
    if (this.filterCategory === "") return cfg.scenes.length;
    return cfg.scenes.filter((scene) => scene.category === this.filterCategory).length;
  }

  private _summary(cfg: ScopeConfig): string {
    // A genuinely empty scope reads "not configured" regardless of filter.
    if (cfg.scenes.length === 0) {
      return localize(this.hass, "ui.not_configured", "not configured");
    }
    // Otherwise count the scenes matching the active filter (all when "").
    const r = this._matchingSceneCount(cfg);
    const noun =
      r === 1
        ? localize(this.hass, "ui.scene_singular", "scene")
        : localize(this.hass, "ui.scene_plural", "scenes");
    return `${r} ${noun}`;
  }

  // --- empty-state banners -------------------------------------------------

  /** True when Weather has no entity picked — it can't be used as a condition. */
  private get _weatherUnconfigured(): boolean {
    return !this._store.weatherConfig || this._store.weatherConfig.entity == null;
  }

  /** True when neither a Workday sensor nor calendar is picked. */
  private get _workdayUnconfigured(): boolean {
    const day = this._store.dayConfig;
    return !day || (day.workday_sensor == null && day.workday_calendar == null);
  }

  /** True when either Weather or Workday is unconfigured (the optional hint
   *  nudges the user to set up whichever is still missing). */
  private get _conditionsUnconfigured(): boolean {
    return this._weatherUnconfigured || this._workdayUnconfigured;
  }

  /** Title + body for the conditions hint, naming only the input(s) still
   *  missing — so configuring one narrows the nudge rather than leaving it
   *  unchanged. Only called when at least one is unconfigured. */
  private _conditionsHintText(): { title: string; body: string } {
    const weatherUnset = this._weatherUnconfigured;
    const workdayUnset = this._workdayUnconfigured;
    if (weatherUnset && workdayUnset) {
      return {
        title: localize(
          this.hass,
          "ui.conditions_hint_title",
          "Optional: set up Workday & Weather",
        ),
        body: localize(
          this.hass,
          "ui.conditions_hint_body",
          "Configure Workday and Weather in Conditions to use them in your scene conditions.",
        ),
      };
    }
    if (workdayUnset) {
      return {
        title: localize(this.hass, "ui.conditions_hint_title_workday", "Optional: set up Workday"),
        body: localize(
          this.hass,
          "ui.conditions_hint_body_workday",
          "Configure Workday in Conditions to use it in your scene conditions.",
        ),
      };
    }
    return {
      title: localize(this.hass, "ui.conditions_hint_title_weather", "Optional: set up Weather"),
      body: localize(
        this.hass,
        "ui.conditions_hint_body_weather",
        "Configure Weather in Conditions to use it in your scene conditions.",
      ),
    };
  }

  private _openSettings(tab: "ambience" | "actions" | "conditions") {
    this.dispatchEvent(
      new CustomEvent("ambience-open-settings", { detail: { tab }, bubbles: true, composed: true }),
    );
  }

  private _dismissConditionsHint() {
    this._conditionsHintDismissed = true;
    setConditionsHintDismissed();
  }

  /** The empty-state nudges shown above the scope list:
   *  - a required, non-dismissible banner when no action is exposed yet;
   *  - else an optional, dismissible hint to configure Workday/Weather.
   *  Sequenced: the optional hint only appears once at least one action exists. */
  private _renderBanners() {
    if (!this._store.staticLoaded) return "";
    if (this._store.actions.length === 0) {
      return html`
        <div class="banner banner-required" data-test="no-actions-banner" role="alert">
          <ha-icon class="banner-icon" icon="mdi:alert-circle-outline"></ha-icon>
          <div class="banner-text">
            <strong
              >${localize(this.hass, "ui.no_actions_title", "Set up an action to get started")}</strong
            >
            <span
              >${localize(
                this.hass,
                "ui.no_actions_body",
                "Ambience can't apply anything until you expose at least one action — scenes need actions to run.",
              )}</span
            >
          </div>
          <button
            class="banner-cta"
            data-test="setup-actions-btn"
            @click=${() => this._openSettings("actions")}
          >
            ${localize(this.hass, "ui.no_actions_cta", "Set up actions")}
          </button>
        </div>
      `;
    }
    if (!this._conditionsHintDismissed && this._conditionsUnconfigured) {
      const { title, body } = this._conditionsHintText();
      return html`
        <div class="banner banner-hint" data-test="conditions-hint-banner">
          <ha-icon class="banner-icon" icon="mdi:lightbulb-on-outline"></ha-icon>
          <div class="banner-text">
            <strong>${title}</strong>
            <span>${body}</span>
          </div>
          <button
            class="banner-cta"
            data-test="setup-conditions-btn"
            @click=${() => this._openSettings("conditions")}
          >
            ${localize(this.hass, "ui.conditions_hint_cta", "Configure conditions")}
          </button>
          <button
            class="banner-dismiss"
            data-test="dismiss-conditions-hint"
            title=${localize(this.hass, "ui.dismiss", "Dismiss")}
            aria-label=${localize(this.hass, "ui.dismiss", "Dismiss")}
            @click=${() => this._dismissConditionsHint()}
          >
            ✕
          </button>
        </div>
      `;
    }
    return "";
  }

  // --- render --------------------------------------------------------------

  /** The scope rows in display order: house, then floors, then areas — but with
   *  permanently-disabled scopes (cfg.enabled === false) stably moved to the
   *  end, so the active scopes surface at the top of the list. A temporary
   *  switch-off does NOT reorder (it shows the pause countdown in place). */
  private _orderedScopeRows(): ScopeRow[] {
    const rows: ScopeRow[] = [
      {
        scope: { kind: "house" },
        name: localize(this.hass, "ui.scope_house", "House"),
        cfg: this._store.house,
        rowClass: "house",
      },
    ];
    for (const f of this._store.floors) {
      const cfg = this._store.floorConfigs.get(f.floor_id);
      if (cfg) {
        rows.push({
          scope: { kind: "floor", id: f.floor_id },
          name: f.name,
          cfg,
          rowClass: "floor",
        });
      }
    }
    for (const a of this._store.areas) {
      const cfg = this._store.areaConfigs.get(a.area_id);
      if (cfg) {
        rows.push({
          scope: { kind: "area", id: a.area_id },
          name: a.name,
          cfg,
          rowClass: "area",
        });
      }
    }
    // Stable partition: enabled rows keep their base order and the
    // permanently-disabled rows (cfg.enabled === false) follow in theirs.
    const on: ScopeRow[] = [];
    const off: ScopeRow[] = [];
    for (const r of rows) {
      (r.cfg.enabled === false ? off : on).push(r);
    }
    return [...on, ...off];
  }

  /** True only when the scope's Ambience switch is resolved AND currently off.
   *  An unresolved/unknown switch is treated as "not off" so it stays in place. */
  private _isSwitchedOff(scope: Scope): boolean {
    const entityId = this._store.switchEntityIds.get(scopeKey(scope));
    if (!entityId) return false;
    return this.hass.states?.[entityId]?.state === "off";
  }

  /** Renders the trailing list item: a spinner while areas are still loading,
   *  the "no areas" empty state once a load with zero areas has settled, else
   *  nothing (the scope rows above carry the content). On error the error
   *  banner speaks for the failed load, so the empty state is suppressed —
   *  "No areas found" would be a false negative when the fetch didn't succeed. */
  private _renderAreasPlaceholder() {
    if (!this._store.areasLoaded) {
      return html`<li>
        <p class="empty" data-test="areas-loading">
          <span class="spinner" aria-hidden="true"></span>
          ${localize(this.hass, "ui.loading", "Loading…")}
        </p>
      </li>`;
    }
    if (!this._store.error && this._store.areas.length === 0) {
      return html`<li>
        <p class="empty">
          ${localize(this.hass, "ui.no_areas", "No areas found in Home Assistant.")}
        </p>
      </li>`;
    }
    return "";
  }

  override render() {
    return html`
      ${this._store.error ? html`<p class="error">${this._store.error}</p>` : ""}
      ${this._renderBanners()}
      <ul>
        ${repeat(
          this._orderedScopeRows(),
          // Key by scope identity so reordering (e.g. a disabled scope
          // sinking to the end) moves each row's DOM with its scope rather than
          // reusing nodes positionally — otherwise a toggle's checked state can
          // bleed onto whichever scope inherits its old position.
          (r) => scopeKey(r.scope),
          (r) => this._renderScopeRow(r.scope, r.name, r.cfg, r.rowClass),
        )}
        ${this._renderAreasPlaceholder()}
      </ul>

      <ambience-scene-editor
        ?open=${this._editing !== null}
        .hass=${this.hass}
        .scope=${this._editing ? this._editing.scope : undefined}
        .scopes=${this._scopeOptions}
        .takenNames=${this._takenSceneNames}
        .saveError=${this._sceneEditorError}
        .scene=${this._editingScene}
        .conditions=${this._editorConditions}
        .periods=${this._store.periods}
        .luxRanges=${this._store.luxRanges}
        .dayConfig=${this._store.dayConfig}
        .weatherConfig=${this._store.weatherConfig}
        .availableActions=${this._store.actions}
        .schemas=${this._store.schemas}
        .categories=${this._store.categories}
        @save-scene=${this._saveScene}
        @cancel-scene=${this._cancelScene}
      ></ambience-scene-editor>
      <ambience-traces-modal
        ?open=${this._viewingTraces !== null}
        .hass=${this.hass}
        .periods=${this._store.periods}
        .exposedActions=${this._store.actions}
        .scope=${
          this._viewingTraces?.scope ?? {
            scope_kind: "house",
            scope_id: null,
          }
        }
        .category=${this._viewingTraces?.category ?? ""}
        .categoryName=${this._viewingTraces?.categoryName ?? null}
        @close=${() => {
          this._viewingTraces = null;
        }}
      ></ambience-traces-modal>
      <ambience-auto-triggers-modal
        ?open=${this._autoTriggers !== null}
        .hass=${this.hass}
        .scope=${this._autoTriggers?.scope ?? { kind: "house" }}
        .scopeName=${this._autoTriggers?.name ?? ""}
        .category=${this._autoTriggers?.category}
        .categoryName=${this._autoTriggers?.categoryName ?? ""}
        .scenes=${
          this._autoTriggers
            ? (this._store.getConfig(this._autoTriggers.scope)?.scenes ?? []).filter(
                (s) => s.category === this._autoTriggers!.category,
              )
            : []
        }
        @close=${() => {
          this._autoTriggers = null;
        }}
      ></ambience-auto-triggers-modal>
      <ambience-simulator-modal
        ?open=${this._viewingSimulator !== null}
        .hass=${this.hass}
        .periods=${this._store.periods}
        .exposedActions=${this._store.actions}
        .scope=${
          this._viewingSimulator?.scope ?? {
            scope_kind: "house",
            scope_id: null,
          }
        }
        .category=${this._viewingSimulator?.category ?? ""}
        .categoryName=${this._viewingSimulator?.categoryName ?? null}
        @close=${() => {
          this._viewingSimulator = null;
        }}
      ></ambience-simulator-modal>
    `;
  }

  private _renderScopeRow(
    scope: Scope,
    name: string,
    cfg: ScopeConfig,
    rowClass: "house" | "floor" | "area",
  ) {
    const open = this._expanded.has(scopeKey(scope));
    const dataId = scope.kind === "house" ? "" : scope.id;
    // Header de-emphasis, strongest first: a switched-off scope reads fully
    // "disabled"; an on scope with no rules in the active category reads "empty"
    // (faded). Off wins so a disabled scope never also looks merely empty.
    const stateClass = this._isSwitchedOff(scope)
      ? "off"
      : this._matchingSceneCount(cfg) === 0
        ? "empty"
        : "";
    const disabled = cfg.enabled === false;
    return html`
      <li class="scope-row ${rowClass} ${disabled ? "scope-disabled" : ""}" data-id=${dataId}>
        <div
          class="scope-header ${open ? "open" : ""} ${stateClass}"
          @click=${() => this._toggleExpand(scope)}
        >
          <span class="chevron ${open ? "open" : ""}">▶</span>
          <ha-icon class="scope-icon" icon=${scopeIcon(scope, this.hass as any)}></ha-icon>
          <span class="scope-name">${name}</span>
          ${renderAggregateProblemFlag(this.hass, cfg.scenes)}
          <span class="scope-summary">${this._summary(cfg)}</span>
          ${this._renderPauseIcon(scope, cfg)}
          ${this._renderScopeSwitch(scope, cfg)}
          <ambience-kebab-menu
            data-test="scope-kebab"
            ?muted=${stateClass === "off" || disabled}
            .hass=${this.hass}
            .items=${
              [
                {
                  id: "run",
                  label: localize(this.hass, "ui.run", "Run"),
                  icon: "mdi:play",
                },
              ] satisfies KebabItem[]
            }
            @menu-action=${(e: CustomEvent<{ id: string }>) =>
              this._onScopeMenu(scope, e.detail.id)}
            @click=${(e: Event) => e.stopPropagation()}
          ></ambience-kebab-menu>
        </div>
        ${
          open
            ? html`
              <div class="scope-body">
                <ambience-scenes-list
                  .scenes=${cfg.scenes}
                  .periods=${this._store.periods}
                  .luxRanges=${this._store.luxRanges}
                  .weatherConfig=${this._store.weatherConfig}
                  .conditions=${this._store.conditions}
                  .availableActions=${this._store.actions}
                  .schemas=${this._store.schemas}
                  .categories=${this._store.categories}
                  .filterCategory=${this.filterCategory}
                  .collapsedCategories=${this._collapsedCategoriesFor(scope)}
                  .hass=${this.hass}
                  @toggle-category-collapse=${(e: CustomEvent<{ categoryId: string }>) =>
                    this._toggleCategoryCollapse(scope, e)}
                  @add-scene=${(e: CustomEvent<{ category?: string }>) =>
                    this._addScene(scope, e.detail?.category)}
                  @edit-scene=${(e: CustomEvent<{ index: number }>) => this._editScene(scope, e)}
                  @duplicate-scene=${(e: CustomEvent<{ index: number }>) =>
                    this._duplicateScene(scope, e)}
                  @delete-scene=${(e: CustomEvent<{ index: number }>) => this._deleteScene(scope, e)}
                  @reorder-scenes=${(e: CustomEvent<{ from: number; to: number }>) =>
                    this._reorderScenes(scope, e)}
                  @unpin-scene=${(e: CustomEvent<{ index: number }>) => this._unpinScene(scope, e)}
                  @toggle-scene-enabled=${(e: CustomEvent<{ index: number; enabled: boolean }>) =>
                    this._toggleSceneEnabled(scope, e)}
                  @run-scene-actions=${(e: CustomEvent<{ index: number }>) =>
                    this._runSceneActions(scope, e)}
                  @apply-category=${(e: CustomEvent<{ categoryId: string }>) =>
                    this._applyScenes(scope, e.detail.categoryId)}
                  @show-traces=${(e: CustomEvent<{ category: string }>) =>
                    this._showTraces(scope, e.detail.category)}
                  @show-simulator=${(e: CustomEvent<{ category: string }>) =>
                    this._showSimulator(scope, e.detail.category)}
                  @show-auto-triggers=${(e: CustomEvent<{ category: string }>) =>
                    this._showAutoTriggers(scope, name, e.detail.category)}
                ></ambience-scenes-list>
              </div>
            `
            : ""
        }
      </li>
    `;
  }

  /** Seconds remaining until the scope's switch auto-resumes, derived from the
   *  switch entity's `off_at` / `auto_on_delay_seconds` attributes. 0 if not
   *  paused or the attributes are missing. */
  private _pauseRemaining(entityId: string): number {
    const st = this.hass.states?.[entityId];
    const offAt = st?.attributes?.off_at as string | null | undefined;
    const delay = Number(st?.attributes?.auto_on_delay_seconds ?? 0);
    if (!offAt || !delay) return 0;
    const elapsed = (Date.now() - new Date(offAt).getTime()) / 1000;
    return Math.max(0, Math.round(delay - elapsed));
  }

  /** Temporary-pause control: a timer icon next to the permanent toggle.
   *  Hidden when the scope is permanently disabled. Tapping pauses (switch off)
   *  or resumes (switch on); shows a live countdown while paused. */
  private _renderPauseIcon(scope: Scope, cfg: ScopeConfig) {
    if (cfg.enabled === false) return "";
    const entityId = this._store.switchEntityIds.get(scopeKey(scope));
    if (!entityId) return "";
    const paused = this.hass.states?.[entityId]?.state === "off";
    const onClick = (e: Event) => {
      e.stopPropagation();
      void this.hass.callService?.("switch", paused ? "turn_on" : "turn_off", {
        entity_id: entityId,
      });
    };
    if (!paused) {
      return html`<button
        class="scope-pause"
        data-test="scope-pause"
        title=${localize(this.hass, "ui.pause_scope", "Pause this scope")}
        @click=${onClick}
      >
        <ha-icon icon="mdi:timer-outline"></ha-icon>
      </button>`;
    }
    const remaining = this._pauseRemaining(entityId);
    return html`<button
      class="scope-pause paused"
      data-test="scope-pause"
      title=${localize(this.hass, "ui.resume_scope", "Resume now")}
      @click=${onClick}
    >
      <ha-icon icon="mdi:timer"></ha-icon>
      <span class="countdown">${formatRemaining(remaining)}</span>
    </button>`;
  }

  /** Permanent enable/disable toggle for the scope (non-hierarchical).
   *  Reads/writes the scope config `enabled` flag (default true).
   *  Uses HA's <ha-switch> when registered, else a themed checkbox fallback
   *  (which also keeps the toggle testable under jsdom). */
  private _renderScopeSwitch(scope: Scope, cfg: ScopeConfig) {
    const enabled = cfg.enabled !== false;
    // Don't let toggling expand/collapse the row.
    const stop = (e: Event) => e.stopPropagation();
    const onChange = async (e: Event) => {
      e.stopPropagation();
      try {
        await setScopeEnabled(this.hass, scope, !enabled);
        await Promise.all([this._store.reloadScope(scope), this._store.refreshSwitches()]);
      } catch (err) {
        this._store.error = (err as Error).message || String(err);
      }
    };
    return renderHaSwitch({
      checked: enabled,
      dataTest: "scope-switch",
      onChange,
      className: "scope-switch",
      onClick: stop,
    });
  }
}
