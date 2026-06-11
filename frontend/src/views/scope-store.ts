import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { AreaRegistryEvent, FloorRegistryEvent, HassConnection } from "../api.js";
import {
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
  saveArea,
  saveFloor,
  saveHouse,
} from "../api.js";
import { scopeKey } from "../entities-for-scope.js";
import type {
  AreaListItem,
  ConditionInfo,
  DayConfig,
  ExposedAction,
  FloorListItem,
  LuxRangeStoreView,
  PeriodStoreView,
  SceneCategory,
  Scope,
  ScopeConfig,
  ServiceSchema,
  WeatherConfig,
} from "../types.js";

/** The slice of the host element the store needs: Lit's controller wiring, the
 *  live `hass` connection, and DOM connectedness (checked after every await so
 *  a fetch resolving post-teardown can't write into a torn-down host). */
export type ScopeStoreHost = ReactiveControllerHost & {
  hass: HassConnection;
  isConnected: boolean;
};

function normalizeConfig(cfg: ScopeConfig): ScopeConfig {
  // Preserve the permanent per-scope `enabled` flag (absent ⇒ enabled) so the
  // header toggle reflects the persisted value; only drop it when it's the
  // default (true/absent) to keep configs minimal.
  return cfg.enabled === false
    ? { scenes: cfg.scenes ?? [], enabled: false }
    : { scenes: cfg.scenes ?? [] };
}

/** Property decorator: assigning a new value (per Object.is) requests a host
 *  re-render — the store-field equivalent of Lit's `@state()`. */
function tracked() {
  return (proto: object, name: PropertyKey): void => {
    const backing = Symbol(String(name));
    Object.defineProperty(proto, name, {
      get(this: Record<symbol, unknown>) {
        return this[backing];
      },
      set(this: { _host?: ScopeStoreHost } & Record<symbol, unknown>, value: unknown) {
        if (Object.is(this[backing], value)) return;
        this[backing] = value;
        this._host?.requestUpdate();
      },
      configurable: true,
      enumerable: true,
    });
  };
}

/**
 * Reactive controller owning the scopes view's data layer: the static config
 * (conditions, exposed actions + schemas, categories, periods, lux ranges,
 * day/weather config) and the per-scope configs (house, floors, areas, their
 * Ambience switches). The host renders straight off the public fields; every
 * field assignment requests a host update (see {@link tracked}).
 */
export class ScopeStore implements ReactiveController {
  @tracked() areas: AreaListItem[] = [];
  @tracked() floors: FloorListItem[] = [];
  @tracked() areaConfigs = new Map<string, ScopeConfig>();
  @tracked() floorConfigs = new Map<string, ScopeConfig>();
  @tracked() house: ScopeConfig = { scenes: [] };
  // scopeKey(scope) -> Ambience switch entity_id. Resolved by the backend
  // because user/registry renames make the entity_id non-derivable.
  @tracked() switchEntityIds = new Map<string, string>();
  // True once the first areas fetch settles, so the "No areas found" empty
  // state doesn't flash a false negative on a slow connection before areas
  // arrive.
  @tracked() areasLoaded = false;
  @tracked() conditions: ConditionInfo[] = [];
  @tracked() actions: ExposedAction[] = [];
  @tracked() categories: SceneCategory[] = [];
  // Per-service schemas, keyed by service id. Loaded after `actions` so the
  // summary functions can show HA's `field.name` instead of the humanized
  // field id. Best-effort: services whose schema fetch fails are omitted.
  @tracked() schemas: Record<string, ServiceSchema> = {};
  @tracked() periods?: PeriodStoreView;
  @tracked() luxRanges?: LuxRangeStoreView;
  @tracked() dayConfig?: DayConfig;
  @tracked() weatherConfig?: WeatherConfig;
  // True once the initial static load (actions, weather, workday, …) finishes,
  // so the empty-state banners don't flash during loading.
  @tracked() staticLoaded = false;
  // The latest data-layer failure, rendered by the host as the page error
  // banner. Assigning via the host (e.g. from its own api calls) re-renders too.
  @tracked() error = "";

  // Registry-event unsubscribers, set once subscribe() resolves.
  private _unsubArea?: () => void;
  private _unsubFloor?: () => void;
  // 1s tick that drives the live pause countdown while any scope switch is off.
  private _tick?: ReturnType<typeof setInterval>;

  constructor(private readonly _host: ScopeStoreHost) {
    _host.addController(this);
  }

  private get _hass(): HassConnection {
    return this._host.hass;
  }

  hostConnected(): void {
    window.addEventListener("ambience-exposed-actions-changed", this._onExposedActionsChanged);
    window.addEventListener("ambience-categories-changed", this._onCategoriesChanged);
    window.addEventListener("ambience-conditions-changed", this._onConditionsChanged);
    this._tick = setInterval(() => {
      for (const id of this.switchEntityIds.values()) {
        if (this._hass.states?.[id]?.state === "off") {
          this._host.requestUpdate();
          return;
        }
      }
    }, 1000);
  }

  hostDisconnected(): void {
    window.removeEventListener("ambience-exposed-actions-changed", this._onExposedActionsChanged);
    window.removeEventListener("ambience-categories-changed", this._onCategoriesChanged);
    window.removeEventListener("ambience-conditions-changed", this._onConditionsChanged);
    if (this._tick) clearInterval(this._tick);
    this._tick = undefined;
    this._unsubArea?.();
    this._unsubArea = undefined;
    this._unsubFloor?.();
    this._unsubFloor = undefined;
  }

  /**
   * Subscribe to HA's area/floor registry events and re-fetch on change. A
   * `remove` additionally calls `onRemove(scope)` so the host can drop the
   * scope from its own view state (expanded rows, the open editor) before the
   * refetch lands. The switch set only changes on add/remove, so an `update`
   * skips the switch refetch. Idempotent on disconnect: if the host tears down
   * before the subscriptions resolve, they're unsubscribed immediately.
   */
  async subscribe(onRemove: (scope: Scope) => void): Promise<void> {
    const subArea = this._hass.connection.subscribeEvents<AreaRegistryEvent>((event) => {
      if (event.data.action === "remove") {
        onRemove({ kind: "area", id: event.data.area_id });
      }
      void this.refreshAreas();
      if (event.data.action !== "update") void this.refreshSwitches();
    }, "area_registry_updated");
    const subFloor = this._hass.connection.subscribeEvents<FloorRegistryEvent>((event) => {
      if (event.data.action === "remove") {
        onRemove({ kind: "floor", id: event.data.floor_id });
      }
      void this.refreshFloors();
      if (event.data.action !== "update") void this.refreshSwitches();
    }, "floor_registry_updated");
    const [unsubArea, unsubFloor] = await Promise.all([subArea, subFloor]);
    if (this._host.isConnected) {
      this._unsubArea = unsubArea;
      this._unsubFloor = unsubFloor;
    } else {
      unsubArea();
      unsubFloor();
    }
  }

  private _onExposedActionsChanged = async () => {
    try {
      const actions = await listExposedActions(this._hass);
      if (!this._host.isConnected) return;
      this.actions = actions;
      await this._refreshSchemas(actions);
    } catch {
      // Silent — the user just saw a successful save; transient refetch failures
      // are not worth surfacing here. The next manual reload will re-fetch.
    }
  };

  private _onCategoriesChanged = async () => {
    try {
      const categories = await listCategories(this._hass);
      if (!this._host.isConnected) return;
      this.categories = categories;
    } catch {
      // Silent — same rationale as exposed-actions: a transient refetch failure
      // after a successful save isn't worth surfacing; next reload re-fetches.
    }
  };

  // Workday/Weather are configured in the settings modal, which stays mounted
  // alongside the scopes view — so without this refetch the conditions hint
  // would keep showing (or stay hidden) until a full reload. Re-pull both
  // configs on change so the hint reflects live state.
  private _onConditionsChanged = async () => {
    try {
      const [dayConfig, weatherConfig] = await Promise.all([
        getDayConfig(this._hass),
        getWeatherConfig(this._hass),
      ]);
      if (!this._host.isConnected) return;
      this.dayConfig = dayConfig;
      this.weatherConfig = weatherConfig;
    } catch {
      // Silent — same rationale as the other change handlers.
    }
  };

  async loadStatic(): Promise<void> {
    try {
      const [conditions, actions, periods, luxRanges, dayConfig, weatherConfig, categories] =
        await Promise.all([
          listConditions(this._hass),
          listExposedActions(this._hass),
          listPeriods(this._hass),
          listLuxRanges(this._hass),
          getDayConfig(this._hass),
          getWeatherConfig(this._hass),
          listCategories(this._hass),
        ]);
      if (!this._host.isConnected) return;
      this.conditions = conditions;
      this.actions = actions;
      this.periods = periods;
      this.luxRanges = luxRanges;
      this.dayConfig = dayConfig;
      this.weatherConfig = weatherConfig;
      this.categories = categories;
      this.staticLoaded = true;
      await this._refreshSchemas(actions);
    } catch (e) {
      this.error = (e as Error).message || String(e);
    }
  }

  /** Fetch the service schema for each exposed action. Failures per-service
   *  are silently skipped (the summary just falls back to humanized ids). */
  private async _refreshSchemas(actions: ExposedAction[]): Promise<void> {
    const results = await Promise.all(
      actions.map(async (a) => {
        try {
          const schema = await getServiceSchema(this._hass, a.id);
          return [a.id, schema] as const;
        } catch {
          return [a.id, null] as const;
        }
      }),
    );
    if (!this._host.isConnected) return;
    const next: Record<string, ServiceSchema> = {};
    for (const [id, schema] of results) {
      if (schema) next[id] = schema;
    }
    this.schemas = next;
  }

  async refreshAreas(): Promise<void> {
    try {
      const areas = await listAreas(this._hass);
      // Ambience configs only change when WE call saveArea — never via
      // area_registry_updated events. Reuse existing config references and
      // only fetch for newly-discovered areas, to keep Scene references
      // stable across rename/add/remove events.
      const previous = this.areaConfigs;
      const configs = new Map<string, ScopeConfig>();
      await Promise.all(
        areas.map(async (a) => {
          const existing = previous.get(a.area_id);
          if (existing) {
            configs.set(a.area_id, existing);
            return;
          }
          configs.set(a.area_id, normalizeConfig(await getArea(this._hass, a.area_id)));
        }),
      );
      if (!this._host.isConnected) return;
      this.areas = areas;
      this.areaConfigs = configs;
    } catch (e) {
      this.error = (e as Error).message || String(e);
    } finally {
      // The fetch has settled (success or failure) — replace the loading spinner
      // with the areas, the empty state, or (on error) the error banner. Skip
      // when disconnected (matching the early-return above) so a stale fetch
      // resolving after teardown can't mark a torn-down host "loaded".
      if (this._host.isConnected) this.areasLoaded = true;
    }
  }

  async refreshFloors(): Promise<void> {
    try {
      const floors = (await listFloors(this._hass))
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));
      const previous = this.floorConfigs;
      const configs = new Map<string, ScopeConfig>();
      await Promise.all(
        floors.map(async (f) => {
          const existing = previous.get(f.floor_id);
          if (existing) {
            configs.set(f.floor_id, existing);
            return;
          }
          configs.set(f.floor_id, normalizeConfig(await getFloor(this._hass, f.floor_id)));
        }),
      );
      if (!this._host.isConnected) return;
      this.floors = floors;
      this.floorConfigs = configs;
    } catch (e) {
      this.error = (e as Error).message || String(e);
    }
  }

  async refreshHouse(): Promise<void> {
    try {
      const house = normalizeConfig(await getHouse(this._hass));
      if (!this._host.isConnected) return;
      this.house = house;
    } catch (e) {
      this.error = (e as Error).message || String(e);
    }
  }

  async refreshSwitches(): Promise<void> {
    try {
      const switches = await listSwitches(this._hass);
      if (!this._host.isConnected) return;
      this.switchEntityIds = new Map(
        switches.map((s) => {
          // Route through scopeKey() — the single source of truth for scope
          // identity — rather than re-deriving its string format here.
          const scope: Scope =
            s.scope_kind === "house" ? { kind: "house" } : { kind: s.scope_kind, id: s.scope_id! };
          return [scopeKey(scope), s.entity_id];
        }),
      );
    } catch (e) {
      this.error = (e as Error).message || String(e);
    }
  }

  getConfig(scope: Scope): ScopeConfig | undefined {
    if (scope.kind === "house") return this.house;
    if (scope.kind === "area") return this.areaConfigs.get(scope.id);
    return this.floorConfigs.get(scope.id);
  }

  setConfig(scope: Scope, config: ScopeConfig): void {
    if (scope.kind === "house") {
      this.house = config;
    } else if (scope.kind === "area") {
      const next = new Map(this.areaConfigs);
      next.set(scope.id, config);
      this.areaConfigs = next;
    } else {
      const next = new Map(this.floorConfigs);
      next.set(scope.id, config);
      this.floorConfigs = next;
    }
  }

  /**
   * Apply `next` optimistically, persist, reconcile with the stored config.
   * Not serialised per scope: overlapping saves could revert to a stale
   * intermediate config on error. In practice the UI serialises mutations
   * (one modal / one interaction at a time), so this is acceptable.
   *
   * @returns `true` if the save succeeded, `false` if it errored (in which case
   *   the optimistic update has been reverted and `error` set).
   */
  async mutate(scope: Scope, next: ScopeConfig): Promise<boolean> {
    const prev = this.getConfig(scope);
    this.setConfig(scope, next);
    this.error = "";
    try {
      let result: { ok: true; config: ScopeConfig };
      if (scope.kind === "house") result = await saveHouse(this._hass, next);
      else if (scope.kind === "area") result = await saveArea(this._hass, scope.id, next);
      else result = await saveFloor(this._hass, scope.id, next);
      this.setConfig(scope, normalizeConfig(result.config));
      return true;
    } catch (e) {
      if (prev) this.setConfig(scope, prev);
      this.error = (e as Error).message || String(e);
      return false;
    }
  }

  /** Re-fetch just this scope's config and update the relevant store, so the
   *  header toggle reflects the persisted `enabled` value after a write. */
  async reloadScope(scope: Scope): Promise<void> {
    try {
      let cfg: ScopeConfig;
      if (scope.kind === "house") cfg = normalizeConfig(await getHouse(this._hass));
      else if (scope.kind === "area") cfg = normalizeConfig(await getArea(this._hass, scope.id));
      else cfg = normalizeConfig(await getFloor(this._hass, scope.id));
      if (!this._host.isConnected) return;
      this.setConfig(scope, cfg);
    } catch (e) {
      this.error = (e as Error).message || String(e);
    }
  }
}
