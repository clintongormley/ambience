import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { live } from "lit/directives/live.js";
import { repeat } from "lit/directives/repeat.js";

import type { AreaRegistryEvent, FloorRegistryEvent, HassConnection } from "../api.js";
import {
  applyScenes,
  getArea,
  getDayConfig,
  getFloor,
  getHouse,
  getServiceSchema,
  getWeatherConfig,
  listAreas,
  listCategories,
  listConditions,
  listExposedActions,
  listFloors,
  listLuxRanges,
  listPeriods,
  listSwitches,
  runSceneActions,
  saveArea,
  saveFloor,
  saveHouse,
  setScopeEnabled,
} from "../api.js";
import { sceneNameKey, scopeKey } from "../entities-for-scope.js";
import { localize } from "../i18n.js";
import { stripPositionMetadata } from "../scene.js";
import { scopeIcon } from "../scope-icon.js";
import type {
  AreaListItem,
  ConditionInfo,
  DayConfig,
  ExposedAction,
  FloorListItem,
  LuxRangeStoreView,
  PeriodStoreView,
  Scene,
  SceneCategory,
  Scope,
  ScopeConfig,
  ScopeOption,
  ServiceSchema,
  WeatherConfig,
} from "../types.js";
import {
  getConditionsHintDismissed,
  getExpandedScopes,
  setConditionsHintDismissed,
  setExpandedScopes,
} from "../ui-state.js";
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

function _normalize(cfg: ScopeConfig): ScopeConfig {
  // Preserve the permanent per-scope `enabled` flag (absent ⇒ enabled) so the
  // header toggle reflects the persisted value; only drop it when it's the
  // default (true/absent) to keep configs minimal.
  return cfg.enabled === false
    ? { scenes: cfg.scenes ?? [], enabled: false }
    : { scenes: cfg.scenes ?? [] };
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
       contents harder — while leaving the switch fully lit to re-enable. */
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
      .scope-header.off .scope-summary,
      .scope-header.off ambience-kebab-menu {
        opacity: 0.4;
      }
      /* Permanently disabled scope: dim its kebab menu to signal the state.
       Opacity only — the menu stays fully clickable. */
      .scope-disabled ambience-kebab-menu {
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

  @state() private _areas: AreaListItem[] = [];
  @state() private _floors: FloorListItem[] = [];
  @state() private _areaConfigs = new Map<string, ScopeConfig>();
  @state() private _floorConfigs = new Map<string, ScopeConfig>();
  @state() private _house: ScopeConfig = { scenes: [] };
  // scopeKey(scope) -> Ambience switch entity_id. Resolved by the backend
  // because user/registry renames make the entity_id non-derivable.
  @state() private _switchEntityIds = new Map<string, string>();
  @state() private _conditions: ConditionInfo[] = [];
  @state() private _actions: ExposedAction[] = [];
  @state() private _categories: SceneCategory[] = [];
  // Per-service schemas, keyed by service id. Loaded after _actions so the
  // summary functions can show HA's `field.name` instead of the humanized
  // field id. Best-effort: services whose schema fetch fails are omitted.
  @state() private _schemas: Record<string, ServiceSchema> = {};
  @state() private _periods?: PeriodStoreView;
  @state() private _luxRanges?: LuxRangeStoreView;
  @state() private _dayConfig?: DayConfig;
  @state() private _weatherConfig?: WeatherConfig;
  // _expanded keys: "area:<id>" | "floor:<id>" | "house". Seeded from
  // localStorage so a reload (or HA's panel rebuild on reconnect) restores which
  // rows were open; persisted on every change via _setExpanded.
  @state() private _expanded = new Set<string>(getExpandedScopes());
  @state() private _error = "";
  // True once the initial static load (actions, weather, workday, …) finishes,
  // so the empty-state banners don't flash during loading.
  @state() private _staticLoaded = false;
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
  // The scope whose read-only Auto-triggers modal is open (null = closed). Only
  // scope identity is stored; the live scenes are read from `_getConfig` at
  // render time so the modal re-fetches if that scope's config changes.
  @state() private _autoTriggers: { scope: Scope; name: string } | null = null;
  // Global category filter, driven by the header's <ambience-category-filter>:
  // "" = All, else a category id. Set via Lit property binding only (never an
  // HTML attribute), matching how scenes-list declares the same input.
  @property({ attribute: false }) filterCategory = "";
  private _unsubArea?: () => void;
  private _unsubFloor?: () => void;

  private _onExposedActionsChanged = async () => {
    try {
      const actions = await listExposedActions(this.hass);
      if (!this.isConnected) return;
      this._actions = actions;
      await this._refreshSchemas(actions);
    } catch {
      // Silent — the user just saw a successful save; transient refetch failures
      // are not worth surfacing here. The next manual reload will re-fetch.
    }
  };

  private _onCategoriesChanged = async () => {
    try {
      const categories = await listCategories(this.hass);
      if (!this.isConnected) return;
      this._categories = categories;
    } catch {
      // Silent — same rationale as exposed-actions: a transient refetch failure
      // after a successful save isn't worth surfacing; next reload re-fetches.
    }
  };

  // Workday/Weather are configured in the settings modal, which stays mounted
  // alongside this view — so without this refetch the conditions hint would keep
  // showing (or stay hidden) until a full reload. Re-pull both configs on change
  // so the hint reflects live state.
  private _onConditionsChanged = async () => {
    try {
      const [dayConfig, weatherConfig] = await Promise.all([
        getDayConfig(this.hass),
        getWeatherConfig(this.hass),
      ]);
      if (!this.isConnected) return;
      this._dayConfig = dayConfig;
      this._weatherConfig = weatherConfig;
    } catch {
      // Silent — same rationale as the other change handlers.
    }
  };

  /** Fetch the service schema for each exposed action. Failures per-service
   *  are silently skipped (the summary just falls back to humanized ids). */
  private async _refreshSchemas(actions: ExposedAction[]): Promise<void> {
    const results = await Promise.all(
      actions.map(async (a) => {
        try {
          const schema = await getServiceSchema(this.hass, a.id);
          return [a.id, schema] as const;
        } catch {
          return [a.id, null] as const;
        }
      }),
    );
    if (!this.isConnected) return;
    const next: Record<string, ServiceSchema> = {};
    for (const [id, schema] of results) {
      if (schema) next[id] = schema;
    }
    this._schemas = next;
  }

  // 1s tick that drives the live pause countdown while any scope switch is off.
  private _tick?: ReturnType<typeof setInterval>;

  override async connectedCallback() {
    super.connectedCallback();
    this._conditionsHintDismissed = getConditionsHintDismissed();
    window.addEventListener("ambience-exposed-actions-changed", this._onExposedActionsChanged);
    window.addEventListener("ambience-categories-changed", this._onCategoriesChanged);
    window.addEventListener("ambience-conditions-changed", this._onConditionsChanged);
    this._tick = setInterval(() => {
      for (const id of this._switchEntityIds.values()) {
        if (this.hass.states?.[id]?.state === "off") {
          this.requestUpdate();
          return;
        }
      }
    }, 1000);
    await this._loadStatic();
    await Promise.all([
      this._refreshAreas(),
      this._refreshFloors(),
      this._refreshHouse(),
      this._refreshSwitches(),
    ]);
    await this._subscribe();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._tick) clearInterval(this._tick);
    this._tick = undefined;
    window.removeEventListener("ambience-exposed-actions-changed", this._onExposedActionsChanged);
    window.removeEventListener("ambience-categories-changed", this._onCategoriesChanged);
    window.removeEventListener("ambience-conditions-changed", this._onConditionsChanged);
    this._unsubArea?.();
    this._unsubArea = undefined;
    this._unsubFloor?.();
    this._unsubFloor = undefined;
  }

  // --- loading -------------------------------------------------------------

  private async _loadStatic() {
    try {
      const [conditions, actions, periods, luxRanges, dayConfig, weatherConfig, categories] =
        await Promise.all([
          listConditions(this.hass),
          listExposedActions(this.hass),
          listPeriods(this.hass),
          listLuxRanges(this.hass),
          getDayConfig(this.hass),
          getWeatherConfig(this.hass),
          listCategories(this.hass),
        ]);
      if (!this.isConnected) return;
      this._conditions = conditions;
      this._actions = actions;
      this._periods = periods;
      this._luxRanges = luxRanges;
      this._dayConfig = dayConfig;
      this._weatherConfig = weatherConfig;
      this._categories = categories;
      this._staticLoaded = true;
      await this._refreshSchemas(actions);
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  private async _refreshAreas() {
    try {
      const areas = await listAreas(this.hass);
      // Ambience configs only change when WE call saveArea — never via
      // area_registry_updated events. Reuse existing config references and
      // only fetch for newly-discovered areas, to keep Scene references
      // stable across rename/add/remove events.
      const previous = this._areaConfigs;
      const configs = new Map<string, ScopeConfig>();
      await Promise.all(
        areas.map(async (a) => {
          const existing = previous.get(a.area_id);
          if (existing) {
            configs.set(a.area_id, existing);
            return;
          }
          configs.set(a.area_id, _normalize(await getArea(this.hass, a.area_id)));
        }),
      );
      if (!this.isConnected) return;
      this._areas = areas;
      this._areaConfigs = configs;
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  private async _refreshFloors() {
    try {
      const floors = (await listFloors(this.hass))
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));
      const previous = this._floorConfigs;
      const configs = new Map<string, ScopeConfig>();
      await Promise.all(
        floors.map(async (f) => {
          const existing = previous.get(f.floor_id);
          if (existing) {
            configs.set(f.floor_id, existing);
            return;
          }
          configs.set(f.floor_id, _normalize(await getFloor(this.hass, f.floor_id)));
        }),
      );
      if (!this.isConnected) return;
      this._floors = floors;
      this._floorConfigs = configs;
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  private async _refreshHouse() {
    try {
      const house = _normalize(await getHouse(this.hass));
      if (!this.isConnected) return;
      this._house = house;
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  private async _refreshSwitches() {
    try {
      const switches = await listSwitches(this.hass);
      if (!this.isConnected) return;
      this._switchEntityIds = new Map(
        switches.map((s) => {
          // Route through scopeKey() — the single source of truth for scope
          // identity — rather than re-deriving its string format here.
          const scope: Scope =
            s.scope_kind === "house" ? { kind: "house" } : { kind: s.scope_kind, id: s.scope_id! };
          return [scopeKey(scope), s.entity_id];
        }),
      );
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  private async _subscribe() {
    const subArea = this.hass.connection.subscribeEvents<AreaRegistryEvent>((event) => {
      if (event.data.action === "remove") {
        const id = event.data.area_id;
        const expanded = new Set(this._expanded);
        expanded.delete(`area:${id}`);
        this._setExpanded(expanded);
        if (this._editing?.scope.kind === "area" && this._editing.scope.id === id) {
          this._editing = null;
        }
      }
      void this._refreshAreas();
      // The switch set only changes when an area is added or removed.
      if (event.data.action !== "update") void this._refreshSwitches();
    }, "area_registry_updated");
    const subFloor = this.hass.connection.subscribeEvents<FloorRegistryEvent>((event) => {
      if (event.data.action === "remove") {
        const id = event.data.floor_id;
        const expanded = new Set(this._expanded);
        expanded.delete(`floor:${id}`);
        this._setExpanded(expanded);
        if (this._editing?.scope.kind === "floor" && this._editing.scope.id === id) {
          this._editing = null;
        }
      }
      void this._refreshFloors();
      // The switch set only changes when a floor is added or removed.
      if (event.data.action !== "update") void this._refreshSwitches();
    }, "floor_registry_updated");
    const [unsubArea, unsubFloor] = await Promise.all([subArea, subFloor]);
    if (this.isConnected) {
      this._unsubArea = unsubArea;
      this._unsubFloor = unsubFloor;
    } else {
      unsubArea();
      unsubFloor();
    }
  }

  // --- config getter / setter ----------------------------------------------

  private _getConfig(scope: Scope): ScopeConfig | undefined {
    if (scope.kind === "house") return this._house;
    if (scope.kind === "area") return this._areaConfigs.get(scope.id);
    return this._floorConfigs.get(scope.id);
  }

  private _setConfig(scope: Scope, config: ScopeConfig) {
    if (scope.kind === "house") {
      this._house = config;
    } else if (scope.kind === "area") {
      const next = new Map(this._areaConfigs);
      next.set(scope.id, config);
      this._areaConfigs = next;
    } else {
      const next = new Map(this._floorConfigs);
      next.set(scope.id, config);
      this._floorConfigs = next;
    }
  }

  /**
   * Apply `next` optimistically, persist, reconcile with the stored config.
   * Not serialised per scope: overlapping saves could revert to a stale
   * intermediate config on error. In practice the UI serialises mutations
   * (one modal / one interaction at a time), so this is acceptable.
   *
   * @returns `true` if the save succeeded, `false` if it errored (in which case
   *   the optimistic update has been reverted and `_error` set).
   */
  private async _mutate(scope: Scope, next: ScopeConfig): Promise<boolean> {
    const prev = this._getConfig(scope);
    this._setConfig(scope, next);
    this._error = "";
    try {
      let result: { ok: true; config: ScopeConfig };
      if (scope.kind === "house") result = await saveHouse(this.hass, next);
      else if (scope.kind === "area") result = await saveArea(this.hass, scope.id, next);
      else result = await saveFloor(this.hass, scope.id, next);
      this._setConfig(scope, _normalize(result.config));
      return true;
    } catch (e) {
      if (prev) this._setConfig(scope, prev);
      this._error = (e as Error).message || String(e);
      return false;
    }
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

  // --- scenes ---------------------------------------------------------------

  private _addScene(scope: Scope, category?: string) {
    const cfg = this._getConfig(scope);
    if (!cfg) return;
    this._sceneEditorError = "";
    this._editing = { scope, index: cfg.scenes.length, isNew: true, category };
  }

  private _editScene(scope: Scope, e: CustomEvent<{ index: number }>) {
    this._sceneEditorError = "";
    this._editing = { scope, index: e.detail.index, isNew: false };
  }

  private _duplicateScene(scope: Scope, e: CustomEvent<{ index: number }>) {
    const cfg = this._getConfig(scope);
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
    const cfg = this._getConfig(scope);
    if (!cfg) return;
    const scenes = cfg.scenes.filter((_, i) => i !== e.detail.index);
    void this._mutate(scope, { ...cfg, scenes });
  }

  private _reorderScenes(scope: Scope, e: CustomEvent<{ from: number; to: number }>) {
    const cfg = this._getConfig(scope);
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
    void this._mutate(scope, { ...cfg, scenes });
  }

  private _unpinScene(scope: Scope, e: CustomEvent<{ index: number }>) {
    const cfg = this._getConfig(scope);
    if (!cfg) return;
    const scenes = cfg.scenes.map((r, i) => (i === e.detail.index ? { ...r, pinned: false } : r));
    void this._mutate(scope, { ...cfg, scenes });
  }

  private _toggleSceneEnabled(scope: Scope, e: CustomEvent<{ index: number; enabled: boolean }>) {
    const cfg = this._getConfig(scope);
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
    void this._mutate(scope, { ...cfg, scenes });
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
        const cfg = this._getConfig(target);
        if (!cfg) return;
        const scenes = [...cfg.scenes];
        if (editing.isNew) scenes.push(scene);
        else scenes[editing.index] = scene;
        // Close the editor only on success; on failure keep it open with the
        // draft intact and show why the save was rejected.
        if (await this._mutate(target, { ...cfg, scenes })) this._editing = null;
        else this._sceneEditorError = this._takeError();
        return;
      }

      // Different scope: the scene lands fresh. Strip ordering metadata so the
      // backend assigns a new priority.
      const fresh = stripPositionMetadata(scene);
      const targetCfg = this._getConfig(target);
      if (!targetCfg) return;
      const added = await this._mutate(target, {
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
        const srcCfg = this._getConfig(editing.scope);
        if (srcCfg) {
          const scenes = srcCfg.scenes.filter((_, i) => i !== editing.index);
          await this._mutate(editing.scope, { ...srcCfg, scenes });
        }
      }
    } finally {
      this._savingScene = false;
    }
  }

  /** Move the page-level error (set by `_mutate`) into the scene editor, where
   *  it shows in the open modal rather than behind it, and clear the banner. */
  private _takeError(): string {
    const msg = this._error;
    this._error = "";
    return msg;
  }

  /** Run an api call, surfacing any failure in `_error`. */
  private async _callApi(fn: () => Promise<unknown>) {
    this._error = "";
    try {
      await fn();
    } catch (e) {
      this._error = (e as Error).message || String(e);
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

  private _onScopeMenu(scope: Scope, name: string, _cfg: ScopeConfig, id: string) {
    if (id === "run") void this._applyScenes(scope);
    else if (id === "auto") this._autoTriggers = { scope, name };
  }

  private _showTraces(scope: Scope, category: string) {
    const g = this._categories.find((x) => x.id === category);
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
    const g = this._categories.find((x) => x.id === category);
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
    const sorted = [...this._categories].sort((a, b) => a.name.localeCompare(b.name));
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
    const cfg = this._getConfig(this._editing.scope);
    return cfg?.scenes[this._editing.index] ?? null;
  }

  /** Condition rows for the scene editor — sorted by `priority` (higher first). */
  private get _editorConditions(): ConditionInfo[] {
    if (!this._editing) return [];
    return this._conditions.slice().sort((a, b) => b.priority - a.priority);
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
    addScope({ kind: "house" }, this._house);
    for (const f of this._floors) {
      addScope({ kind: "floor", id: f.floor_id }, this._floorConfigs.get(f.floor_id));
    }
    for (const a of this._areas) {
      addScope({ kind: "area", id: a.area_id }, this._areaConfigs.get(a.area_id));
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
      ...this._floors.map((f) => ({
        scope: { kind: "floor" as const, id: f.floor_id },
        label: f.name,
      })),
      ...this._areas.map((a) => ({
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
    return !this._weatherConfig || this._weatherConfig.entity == null;
  }

  /** True when neither a Workday sensor nor calendar is picked. */
  private get _workdayUnconfigured(): boolean {
    const day = this._dayConfig;
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
    if (!this._staticLoaded) return "";
    if (this._actions.length === 0) {
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
        cfg: this._house,
        rowClass: "house",
      },
    ];
    for (const f of this._floors) {
      const cfg = this._floorConfigs.get(f.floor_id);
      if (cfg) {
        rows.push({
          scope: { kind: "floor", id: f.floor_id },
          name: f.name,
          cfg,
          rowClass: "floor",
        });
      }
    }
    for (const a of this._areas) {
      const cfg = this._areaConfigs.get(a.area_id);
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
    const entityId = this._switchEntityIds.get(scopeKey(scope));
    if (!entityId) return false;
    return this.hass.states?.[entityId]?.state === "off";
  }

  override render() {
    return html`
      ${this._error ? html`<p class="error">${this._error}</p>` : ""}
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
        ${
          this._areas.length === 0
            ? html`<li>
              <p class="empty">
                ${localize(this.hass, "ui.no_areas", "No areas found in Home Assistant.")}
              </p>
            </li>`
            : ""
        }
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
        .periods=${this._periods}
        .luxRanges=${this._luxRanges}
        .dayConfig=${this._dayConfig}
        .weatherConfig=${this._weatherConfig}
        .availableActions=${this._actions}
        .schemas=${this._schemas}
        .categories=${this._categories}
        @save-scene=${this._saveScene}
        @cancel-scene=${this._cancelScene}
      ></ambience-scene-editor>
      <ambience-traces-modal
        ?open=${this._viewingTraces !== null}
        .hass=${this.hass}
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
        .scenes=${
          this._autoTriggers ? (this._getConfig(this._autoTriggers.scope)?.scenes ?? []) : []
        }
        @close=${() => {
          this._autoTriggers = null;
        }}
      ></ambience-auto-triggers-modal>
      <ambience-simulator-modal
        ?open=${this._viewingSimulator !== null}
        .hass=${this.hass}
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
          <span class="scope-summary">${this._summary(cfg)}</span>
          ${this._renderPauseIcon(scope, cfg)}
          ${this._renderScopeSwitch(scope, cfg)}
          <ambience-kebab-menu
            data-test="scope-kebab"
            .hass=${this.hass}
            .items=${
              [
                {
                  id: "run",
                  label: localize(this.hass, "ui.run", "Run"),
                  icon: "mdi:play",
                },
                {
                  id: "auto",
                  label: localize(this.hass, "ui.auto_triggers_section", "Auto-triggers"),
                  icon: "mdi:flash-auto",
                },
              ] satisfies KebabItem[]
            }
            @menu-action=${(e: CustomEvent<{ id: string }>) =>
              this._onScopeMenu(scope, name, cfg, e.detail.id)}
            @click=${(e: Event) => e.stopPropagation()}
          ></ambience-kebab-menu>
        </div>
        ${
          open
            ? html`
              <div class="scope-body">
                <ambience-scenes-list
                  .scenes=${cfg.scenes}
                  .periods=${this._periods}
                  .luxRanges=${this._luxRanges}
                  .weatherConfig=${this._weatherConfig}
                  .conditions=${this._conditions}
                  .availableActions=${this._actions}
                  .schemas=${this._schemas}
                  .categories=${this._categories}
                  .filterCategory=${this.filterCategory}
                  .hass=${this.hass}
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
    const entityId = this._switchEntityIds.get(scopeKey(scope));
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
        await this._reloadScope(scope);
      } catch (err) {
        this._error = (err as Error).message || String(err);
      }
    };
    if (customElements.get("ha-switch")) {
      return html`<ha-switch
        class="scope-switch"
        data-test="scope-switch"
        .checked=${live(enabled)}
        @click=${stop}
        @change=${onChange}
      ></ha-switch>`;
    }
    return html`<input
      class="scope-switch"
      data-test="scope-switch"
      type="checkbox"
      .checked=${live(enabled)}
      @click=${stop}
      @change=${onChange}
    />`;
  }

  /** Re-fetch just this scope's config and update the relevant store, so the
   *  header toggle reflects the persisted `enabled` value after a write. */
  private async _reloadScope(scope: Scope) {
    try {
      let cfg: ScopeConfig;
      if (scope.kind === "house") cfg = _normalize(await getHouse(this.hass));
      else if (scope.kind === "area") cfg = _normalize(await getArea(this.hass, scope.id));
      else cfg = _normalize(await getFloor(this.hass, scope.id));
      if (!this.isConnected) return;
      this._setConfig(scope, cfg);
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }
}
