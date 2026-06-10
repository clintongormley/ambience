import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { HassConnection } from "../api.js";
import {
  getDayConfig,
  getServiceSchema,
  getWeatherConfig,
  listCategories,
  listConditions,
  listExposedActions,
  listLuxRanges,
  listPeriods,
} from "../api.js";
import type {
  ConditionInfo,
  DayConfig,
  ExposedAction,
  LuxRangeStoreView,
  PeriodStoreView,
  SceneCategory,
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
 * day/weather config). The host renders straight off the public fields; every
 * field assignment requests a host update (see {@link tracked}).
 */
export class ScopeStore implements ReactiveController {
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
  }

  hostDisconnected(): void {
    window.removeEventListener("ambience-exposed-actions-changed", this._onExposedActionsChanged);
    window.removeEventListener("ambience-categories-changed", this._onCategoriesChanged);
    window.removeEventListener("ambience-conditions-changed", this._onConditionsChanged);
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
}
