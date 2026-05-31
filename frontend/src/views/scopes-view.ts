import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type {
  AreaRegistryEvent,
  FloorRegistryEvent,
  HassConnection,
} from "../api.js";
import { groupSwatchStyle } from "../group-colors.js";
import { localize } from "../i18n.js";
import {
  getArea,
  getDayConfig,
  getFloor,
  getHouse,
  getWeatherConfig,
  listAreas,
  getServiceSchema,
  listExposedActions,
  listFloors,
  listGroups,
  listMatchers,
  listPeriods,
  saveArea,
  saveFloor,
  saveHouse,
} from "../api.js";
import type {
  AreaListItem,
  DayConfig,
  ExposedAction,
  FloorListItem,
  MatcherInfo,
  PeriodStoreView,
  Rule,
  RuleGroup,
  Scope,
  ScopeConfig,
  ServiceSchema,
  WeatherConfig,
} from "../types.js";
import "./rules-list.js";
import "./rule-editor.js";
import "./auto-triggers-section.js";

type EditingState = { scope: Scope; index: number; isNew: boolean };

/**
 * Stable key for a scope, used in `_expanded` and for `data-id` attributes.
 * `area:<id>` | `floor:<id>` | `house`
 */
function _scopeKey(scope: Scope): string {
  if (scope.kind === "house") return "house";
  return `${scope.kind}:${scope.id}`;
}

function _normalize(cfg: ScopeConfig): ScopeConfig {
  return { rules: cfg.rules ?? [] };
}

// Must stay in sync with GAP in custom_components/ambience/sorting.py — the
// midpoint math below assumes the backend spaces auto priorities by this much.
const PIN_GAP = 1024;

/** Pick a priority for a rule dropped between `above` and `below` (either may be
 *  undefined at the list ends). `all` is the current rule set for end fallbacks. */
function _pinPriority(
  above: number | undefined,
  below: number | undefined,
  all: Rule[],
): number {
  // Common case: dropped between two rules — no need to scan the whole list.
  if (above !== undefined && below !== undefined) return Math.floor((above + below) / 2);
  const nums = all.map((r) => r.priority ?? 0);
  if (above === undefined && below === undefined) return PIN_GAP;
  if (above === undefined) return Math.max(...nums) + PIN_GAP; // top slot
  return Math.min(...nums) - PIN_GAP; // bottom slot
}

@customElement("ambience-scopes-view")
export class AmbienceScopesView extends LitElement {
  static override styles = css`
    :host {
      display: block;
      padding: 1rem;
      max-width: 60rem;
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
    }
    .chevron {
      width: 1em;
      color: var(--secondary-text-color, #888);
      transition: transform 0.1s;
    }
    .chevron.open {
      transform: rotate(90deg);
    }
    .scope-name {
      flex: 1;
      font-weight: 600;
    }
    .scope-summary {
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
    }
    .scope-body {
      padding: 0.5rem 1rem 1rem 1rem;
      border-top: 1px solid var(--divider-color, #e0e0e0);
    }
    .group-filter-row {
      display: flex; align-items: center; gap: 0.75rem;
      margin: 0 0 1.25rem 0;
    }
    .group-filter-label {
      font-size: 0.95rem; font-weight: 500;
      color: var(--secondary-text-color, #888);
    }
    .group-filter { position: relative; min-width: 18rem; }
    /* Trigger keeps a stable height regardless of the selection (the swatch is
       always present), so picking a group never resizes the control. */
    .group-filter-trigger {
      display: flex; align-items: center; gap: 0.65rem; width: 100%;
      min-height: 48px; box-sizing: border-box;
      padding: 0.4rem 0.6rem 0.4rem 0.5rem;
      border: 1px solid var(--divider-color, #e0e0e0); border-radius: 8px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      cursor: pointer; font: inherit; font-size: 1rem;
    }
    .group-filter-trigger:hover { background: var(--secondary-background-color, #f5f5f5); }
    .group-filter-trigger .group-name { flex: 1; text-align: left; }
    .group-filter-trigger .caret { color: var(--secondary-text-color, #888); flex: 0 0 auto; }
    /* Transparent full-screen catcher so any outside click closes the menu. */
    .group-filter-backdrop { position: fixed; inset: 0; z-index: 10; }
    .group-filter-menu {
      position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 11;
      max-height: 60vh; overflow-y: auto;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0); border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
      padding: 0.35rem;
    }
    .group-filter-option {
      display: flex; align-items: center; gap: 0.65rem; width: 100%;
      min-height: 44px; box-sizing: border-box;
      padding: 0.4rem 0.6rem; border: 0; border-radius: 6px;
      background: none; color: var(--primary-text-color, #212121);
      cursor: pointer; font: inherit; font-size: 1rem; text-align: left;
    }
    .group-filter-option:hover { background: var(--secondary-background-color, #f5f5f5); }
    .group-filter-option[aria-selected="true"] {
      background: var(--secondary-background-color, #eee); font-weight: 600;
    }
    /* Square colour swatch holding the group's icon; always present so rows
       and the trigger keep a consistent height. */
    .group-swatch {
      flex: 0 0 auto; width: 2rem; height: 2rem; border-radius: 6px;
      display: inline-flex; align-items: center; justify-content: center;
      background: var(--secondary-background-color, #e0e0e0);
      color: var(--secondary-text-color, #555);
    }
    .group-swatch ha-icon { --mdc-icon-size: 20px; }
    .group-name { flex: 1; }
  `;

  @property({ attribute: false }) hass!: HassConnection;

  @state() private _areas: AreaListItem[] = [];
  @state() private _floors: FloorListItem[] = [];
  @state() private _areaConfigs = new Map<string, ScopeConfig>();
  @state() private _floorConfigs = new Map<string, ScopeConfig>();
  @state() private _house: ScopeConfig = { rules: [] };
  @state() private _matchers: MatcherInfo[] = [];
  @state() private _actions: ExposedAction[] = [];
  @state() private _groups: RuleGroup[] = [];
  // Per-service schemas, keyed by service id. Loaded after _actions so the
  // summary functions can show HA's `field.name` instead of the humanized
  // field id. Best-effort: services whose schema fetch fails are omitted.
  @state() private _schemas: Record<string, ServiceSchema> = {};
  @state() private _periods?: PeriodStoreView;
  @state() private _dayConfig?: DayConfig;
  @state() private _weatherConfig?: WeatherConfig;
  // _expanded keys: "area:<id>" | "floor:<id>" | "house"
  @state() private _expanded = new Set<string>();
  @state() private _error = "";
  @state() private _editing: EditingState | null = null;
  // Global group filter shared by every scope: "" = All, else a group id.
  // Sticky for the session (component lifetime).
  @state() private _filterGroup = "";
  // Whether the colour-coded filter dropdown menu is open.
  @state() private _filterOpen = false;
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

  override async connectedCallback() {
    super.connectedCallback();
    window.addEventListener("ambience-exposed-actions-changed", this._onExposedActionsChanged);
    await this._loadStatic();
    await Promise.all([
      this._refreshAreas(),
      this._refreshFloors(),
      this._refreshHouse(),
    ]);
    await this._subscribe();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("ambience-exposed-actions-changed", this._onExposedActionsChanged);
    this._unsubArea?.();
    this._unsubArea = undefined;
    this._unsubFloor?.();
    this._unsubFloor = undefined;
  }

  // --- loading -------------------------------------------------------------

  private async _loadStatic() {
    try {
      const [matchers, actions, periods, dayConfig, weatherConfig, groups] = await Promise.all([
        listMatchers(this.hass),
        listExposedActions(this.hass),
        listPeriods(this.hass),
        getDayConfig(this.hass),
        getWeatherConfig(this.hass),
        listGroups(this.hass),
      ]);
      if (!this.isConnected) return;
      this._matchers = matchers;
      this._actions = actions;
      this._periods = periods;
      this._dayConfig = dayConfig;
      this._weatherConfig = weatherConfig;
      this._groups = groups;
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
      // only fetch for newly-discovered areas, to keep Rule references
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
          configs.set(
            a.area_id,
            _normalize(await getArea(this.hass, a.area_id)),
          );
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
          configs.set(
            f.floor_id,
            _normalize(await getFloor(this.hass, f.floor_id)),
          );
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

  private async _subscribe() {
    const subArea = this.hass.connection.subscribeEvents<AreaRegistryEvent>(
      (event) => {
        if (event.data.action === "remove") {
          const id = event.data.area_id;
          const expanded = new Set(this._expanded);
          expanded.delete(`area:${id}`);
          this._expanded = expanded;
          if (
            this._editing?.scope.kind === "area" &&
            this._editing.scope.id === id
          ) {
            this._editing = null;
          }
        }
        void this._refreshAreas();
      },
      "area_registry_updated",
    );
    const subFloor = this.hass.connection.subscribeEvents<FloorRegistryEvent>(
      (event) => {
        if (event.data.action === "remove") {
          const id = event.data.floor_id;
          const expanded = new Set(this._expanded);
          expanded.delete(`floor:${id}`);
          this._expanded = expanded;
          if (
            this._editing?.scope.kind === "floor" &&
            this._editing.scope.id === id
          ) {
            this._editing = null;
          }
        }
        void this._refreshFloors();
      },
      "floor_registry_updated",
    );
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
   */
  private async _mutate(scope: Scope, next: ScopeConfig) {
    const prev = this._getConfig(scope);
    this._setConfig(scope, next);
    this._error = "";
    try {
      let result: { ok: true; config: ScopeConfig };
      if (scope.kind === "house") result = await saveHouse(this.hass, next);
      else if (scope.kind === "area")
        result = await saveArea(this.hass, scope.id, next);
      else result = await saveFloor(this.hass, scope.id, next);
      this._setConfig(scope, _normalize(result.config));
    } catch (e) {
      if (prev) this._setConfig(scope, prev);
      this._error = (e as Error).message || String(e);
    }
  }

  // --- expand --------------------------------------------------------------

  private _toggleExpand(scope: Scope) {
    const key = _scopeKey(scope);
    const next = new Set(this._expanded);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this._expanded = next;
  }

  // --- rules ---------------------------------------------------------------

  private _addRule(scope: Scope) {
    const cfg = this._getConfig(scope);
    if (!cfg) return;
    this._editing = { scope, index: cfg.rules.length, isNew: true };
  }

  private _editRule(scope: Scope, e: CustomEvent<{ index: number }>) {
    this._editing = { scope, index: e.detail.index, isNew: false };
  }

  private _duplicateRule(scope: Scope, e: CustomEvent<{ index: number }>) {
    const cfg = this._getConfig(scope);
    if (!cfg) return;
    const original = cfg.rules[e.detail.index];
    if (!original) return;
    const copy: Rule = JSON.parse(JSON.stringify(original));
    const rules = [...cfg.rules];
    rules.splice(e.detail.index + 1, 0, copy);
    void this._mutate(scope, { ...cfg, rules });
  }

  private _deleteRule(scope: Scope, e: CustomEvent<{ index: number }>) {
    const cfg = this._getConfig(scope);
    if (!cfg) return;
    const rules = cfg.rules.filter((_, i) => i !== e.detail.index);
    void this._mutate(scope, { ...cfg, rules });
  }

  private _reorderRules(
    scope: Scope,
    e: CustomEvent<{ from: number; to: number }>,
  ) {
    const cfg = this._getConfig(scope);
    if (!cfg) return;
    const { from, to } = e.detail;
    const moved = cfg.rules[from];
    // Reorder is per-group: a drop whose target row is in a different group is
    // rejected (groups are independent; cross-group moves aren't meaningful).
    if (!moved || cfg.rules[to]?.group !== moved.group) return;
    const rules = [...cfg.rules];
    rules.splice(from, 1);
    rules.splice(to, 0, moved);
    // Pin priority is computed from the nearest SAME-GROUP neighbours around the
    // drop position (the backend keeps groups contiguous, so scanning outward
    // finds group-mates).
    const sameGroup = (idx: number) => rules[idx] && rules[idx].group === moved.group;
    let a = to - 1;
    while (a >= 0 && !sameGroup(a)) a--;
    let b = to + 1;
    while (b < rules.length && !sameGroup(b)) b++;
    const above = a >= 0 ? rules[a].priority : undefined;
    const below = b < rules.length ? rules[b].priority : undefined;
    const priority = _pinPriority(above, below, cfg.rules.filter((r) => r.group === moved.group));
    rules[to] = { ...moved, priority, pinned: true };
    void this._mutate(scope, { ...cfg, rules });
  }

  private _unpinRule(scope: Scope, e: CustomEvent<{ index: number }>) {
    const cfg = this._getConfig(scope);
    if (!cfg) return;
    const rules = cfg.rules.map((r, i) =>
      i === e.detail.index ? { ...r, pinned: false } : r,
    );
    void this._mutate(scope, { ...cfg, rules });
  }

  private _saveRule(e: CustomEvent<Rule>) {
    const editing = this._editing;
    this._editing = null;
    if (!editing) return;
    const cfg = this._getConfig(editing.scope);
    if (!cfg) return;
    const rules = [...cfg.rules];
    if (editing.isNew) rules.push(e.detail);
    else rules[editing.index] = e.detail;
    void this._mutate(editing.scope, { ...cfg, rules });
  }

  private _cancelRule() {
    // New rules are not added to the config until saved, so cancel is a no-op.
    this._editing = null;
  }

  // --- group filter --------------------------------------------------------

  private _selectFilter(id: string) {
    this._filterGroup = id;
    this._filterOpen = false;
  }

  /** A colour swatch (group colour bg + icon) followed by the group name.
   *  `null` renders the "All groups" entry with a neutral filter-icon swatch,
   *  so the trigger and option rows keep a consistent height across selections. */
  private _renderFilterEntry(group: RuleGroup | null) {
    if (group === null) {
      return html`
        <span class="group-swatch"><ha-icon icon="mdi:filter-variant"></ha-icon></span>
        <span class="group-name">${localize(this.hass, "ui.all_groups", "All groups")}</span>
      `;
    }
    return html`
      <span class="group-swatch" style=${groupSwatchStyle(group.color)}>
        ${group.icon ? html`<ha-icon icon=${group.icon}></ha-icon>` : ""}
      </span>
      <span class="group-name">${group.name}</span>
    `;
  }

  /** The colour-coded global group filter: a trigger showing the current
   *  selection and a dropdown of swatch+icon+name options. Shown only when
   *  more than one group exists. */
  private _renderFilter() {
    if (this._groups.length <= 1) return "";
    const sorted = [...this._groups].sort((a, b) => a.name.localeCompare(b.name));
    const current = this._groups.find((g) => g.id === this._filterGroup) ?? null;
    return html`
      <div class="group-filter-row">
        <span class="group-filter-label">${localize(this.hass, "ui.filter_by_group", "Filter by group")}</span>
        <div class="group-filter">
          <button
            class="group-filter-trigger"
            aria-haspopup="listbox"
            aria-expanded=${this._filterOpen}
            @click=${() => { this._filterOpen = !this._filterOpen; }}
          >
            ${this._renderFilterEntry(current)}
            <ha-icon class="caret" icon="mdi:menu-down"></ha-icon>
          </button>
          ${this._filterOpen
            ? html`
                <div class="group-filter-backdrop" @click=${() => { this._filterOpen = false; }}></div>
                <div class="group-filter-menu" role="listbox">
                  <button
                    class="group-filter-option"
                    role="option"
                    aria-selected=${this._filterGroup === ""}
                    @click=${() => this._selectFilter("")}
                  >
                    ${this._renderFilterEntry(null)}
                  </button>
                  ${sorted.map(
                    (g) => html`<button
                      class="group-filter-option"
                      role="option"
                      aria-selected=${this._filterGroup === g.id}
                      @click=${() => this._selectFilter(g.id)}
                    >
                      ${this._renderFilterEntry(g)}
                    </button>`,
                  )}
                </div>
              `
            : ""}
        </div>
      </div>
    `;
  }

  // --- derived -------------------------------------------------------------

  /** The group a newly-added rule should default to: the active filter when a
   *  single group is selected, otherwise the alphabetically-first group. */
  private _defaultGroupId(): string {
    if (this._filterGroup !== "") return this._filterGroup;
    const sorted = [...this._groups].sort((a, b) => a.name.localeCompare(b.name));
    return sorted[0]?.id ?? "";
  }

  private get _editingRule(): Rule | null {
    if (!this._editing) return null;
    if (this._editing.isNew) return { when: {}, actions: [], group: this._defaultGroupId() };
    const cfg = this._getConfig(this._editing.scope);
    return cfg?.rules[this._editing.index] ?? null;
  }

  /** Matcher rows for the rule editor — sorted by `priority` (higher first). */
  private get _editorMatchers(): MatcherInfo[] {
    if (!this._editing) return [];
    return this._matchers.slice().sort((a, b) => b.priority - a.priority);
  }

  private _summary(cfg: ScopeConfig): string {
    // A genuinely empty scope reads "not configured" regardless of filter.
    if (cfg.rules.length === 0) {
      return localize(this.hass, "ui.not_configured", "not configured");
    }
    // Otherwise count the rules matching the active filter (all when "").
    const r =
      this._filterGroup === ""
        ? cfg.rules.length
        : cfg.rules.filter((rule) => rule.group === this._filterGroup).length;
    const noun =
      r === 1
        ? localize(this.hass, "ui.rule_singular", "rule")
        : localize(this.hass, "ui.rule_plural", "rules");
    return `${r} ${noun}`;
  }

  // --- render --------------------------------------------------------------

  override render() {
    const floorPrefix = localize(this.hass, "ui.scope_floor_prefix", "Floor: ");
    const areaPrefix = localize(this.hass, "ui.scope_area_prefix", "Area: ");
    return html`
      ${this._error ? html`<p class="error">${this._error}</p>` : ""}
      ${this._renderFilter()}
      <ul>
        ${this._renderScopeRow(
          { kind: "house" },
          localize(this.hass, "ui.scope_global", "Global"),
          this._house,
          "house",
        )}
        ${this._floors.map((f) => {
          const cfg = this._floorConfigs.get(f.floor_id);
          if (!cfg) return html``;
          return this._renderScopeRow(
            { kind: "floor", id: f.floor_id },
            `${floorPrefix}${f.name}`,
            cfg,
            "floor",
          );
        })}
        ${this._areas.length === 0
          ? html`<li>
              <p class="empty">
                ${localize(
                  this.hass,
                  "ui.no_areas",
                  "No areas found in Home Assistant.",
                )}
              </p>
            </li>`
          : this._areas.map((a) => {
              const cfg = this._areaConfigs.get(a.area_id);
              if (!cfg) return html``;
              return this._renderScopeRow(
                { kind: "area", id: a.area_id },
                `${areaPrefix}${a.name}`,
                cfg,
                "area",
              );
            })}
      </ul>

      <ambience-rule-editor
        ?open=${this._editing !== null}
        .hass=${this.hass}
        .scope=${this._editing ? this._editing.scope : undefined}
        .rule=${this._editingRule}
        .matchers=${this._editorMatchers}
        .periods=${this._periods}
        .dayConfig=${this._dayConfig}
        .weatherConfig=${this._weatherConfig}
        .availableActions=${this._actions}
        .schemas=${this._schemas}
        .groups=${this._groups}
        @save-rule=${this._saveRule}
        @cancel-rule=${this._cancelRule}
      ></ambience-rule-editor>
    `;
  }

  private _renderScopeRow(
    scope: Scope,
    name: string,
    cfg: ScopeConfig,
    rowClass: "house" | "floor" | "area",
  ) {
    const open = this._expanded.has(_scopeKey(scope));
    const dataId = scope.kind === "house" ? "" : scope.id;
    return html`
      <li
        class="scope-row ${rowClass}"
        data-id=${dataId}
      >
        <div class="scope-header" @click=${() => this._toggleExpand(scope)}>
          <span class="chevron ${open ? "open" : ""}">▶</span>
          <span class="scope-name">${name}</span>
          <span class="scope-summary">${this._summary(cfg)}</span>
        </div>
        ${open
          ? html`
              <div class="scope-body">
                <ambience-rules-list
                  .rules=${cfg.rules}
                  .periods=${this._periods}
                  .weatherConfig=${this._weatherConfig}
                  .matchers=${this._matchers}
                  .availableActions=${this._actions}
                  .schemas=${this._schemas}
                  .groups=${this._groups}
                  .filterGroup=${this._filterGroup}
                  .hass=${this.hass}
                  @add-rule=${() => this._addRule(scope)}
                  @edit-rule=${(e: CustomEvent<{ index: number }>) =>
                    this._editRule(scope, e)}
                  @duplicate-rule=${(e: CustomEvent<{ index: number }>) =>
                    this._duplicateRule(scope, e)}
                  @delete-rule=${(e: CustomEvent<{ index: number }>) =>
                    this._deleteRule(scope, e)}
                  @reorder-rules=${(
                    e: CustomEvent<{ from: number; to: number }>,
                  ) => this._reorderRules(scope, e)}
                  @unpin-rule=${(e: CustomEvent<{ index: number }>) =>
                    this._unpinRule(scope, e)}
                ></ambience-rules-list>
                <ambience-auto-triggers-section
                  .hass=${this.hass}
                  .scope=${scope}
                  .rules=${cfg.rules}
                ></ambience-auto-triggers-section>
              </div>
            `
          : ""}
      </li>
    `;
  }
}
