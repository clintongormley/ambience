/**
 * Typed wrappers over hass.callWS for Ambience WebSocket commands.
 */

import type {
  AreaConfig,
  AreaListItem,
  BufferedUnit,
  ConditionInfo,
  DayConfig,
  DryRunResult,
  ExposedAction,
  ExposedActionWarning,
  FloorListItem,
  PeriodDef,
  PeriodStoreView,
  SceneCategory,
  Scope,
  ScopeConfig,
  ScopeSwitch,
  ServiceInfo,
  ServiceSchema,
  SimulateInputs,
  SimulateOverrides,
  SimulateScope,
  SimulateVerdicts,
  SwitchDefaults,
  WeatherConfig,
  WeatherGroup,
} from "./types.js";

// HA fires this on the event bus whenever an area is created/updated/removed.
export type AreaRegistryEvent = {
  data: { action: "create" | "update" | "remove"; area_id: string };
};

// HA fires this on the event bus whenever a floor is created/updated/removed.
export type FloorRegistryEvent = {
  data: { action: "create" | "update" | "remove"; floor_id: string };
};

// HA panel components receive a `hass` object. We type only what we use,
// plus an index signature for the surface we hand to HA components like
// `<ha-form>` that expect the full HomeAssistant shape (hass.localize,
// hass.config, hass.themes, etc.).
export type HassConnection = {
  callWS<T = unknown>(message: Record<string, unknown>): Promise<T>;
  // Live entity states, keyed by entity_id. Optional — simpler mocks omit it.
  states?: Record<string, { state?: string; attributes?: Record<string, unknown> }>;
  // HA's service-call entry point, used to toggle switch entities.
  callService?(domain: string, service: string, data?: Record<string, unknown>): Promise<unknown>;
  connection: {
    subscribeEvents<T>(callback: (event: T) => void, eventType: string): Promise<() => void>;
    // Generic subscription (HA's `subscribeMessage`). Used for the
    // `render_template` live preview — the same command Dev Tools → Template
    // drives. Optional so simpler connection mocks remain valid.
    subscribeMessage?<T>(
      callback: (message: T) => void,
      subscribeMessage: Record<string, unknown>,
    ): Promise<() => void>;
  };
  [key: string]: unknown;
};

export async function listAreas(hass: HassConnection): Promise<AreaListItem[]> {
  return hass.callWS({ type: "ambience/areas/list" });
}

export async function getArea(hass: HassConnection, areaId: string): Promise<AreaConfig> {
  return hass.callWS({ type: "ambience/area/get", area_id: areaId });
}

export async function saveArea(
  hass: HassConnection,
  areaId: string,
  config: AreaConfig,
): Promise<{ ok: true; config: AreaConfig }> {
  return hass.callWS({
    type: "ambience/area/save",
    area_id: areaId,
    config,
  });
}

export async function listFloors(hass: HassConnection): Promise<FloorListItem[]> {
  return hass.callWS({ type: "ambience/floors/list" });
}

export async function getFloor(hass: HassConnection, floorId: string): Promise<ScopeConfig> {
  return hass.callWS({ type: "ambience/floor/get", floor_id: floorId });
}

export async function saveFloor(
  hass: HassConnection,
  floorId: string,
  config: ScopeConfig,
): Promise<{ ok: true; config: ScopeConfig }> {
  return hass.callWS({
    type: "ambience/floor/save",
    floor_id: floorId,
    config,
  });
}

export async function getHouse(hass: HassConnection): Promise<ScopeConfig> {
  return hass.callWS({ type: "ambience/house/get" });
}

export async function saveHouse(
  hass: HassConnection,
  config: ScopeConfig,
): Promise<{ ok: true; config: ScopeConfig }> {
  return hass.callWS({ type: "ambience/house/save", config });
}

export async function listConditions(hass: HassConnection): Promise<ConditionInfo[]> {
  return hass.callWS({ type: "ambience/conditions/list" });
}

export async function listExposedActions(hass: HassConnection): Promise<ExposedAction[]> {
  return hass.callWS({ type: "ambience/exposed_actions/list" });
}

export async function saveExposedActions(
  hass: HassConnection,
  actions: ExposedAction[],
): Promise<{ ok: true; warnings: ExposedActionWarning[] }> {
  return hass.callWS({ type: "ambience/exposed_actions/save", actions });
}

export async function listServices(hass: HassConnection): Promise<ServiceInfo[]> {
  return hass.callWS({ type: "ambience/services/list" });
}

export async function getServiceSchema(
  hass: HassConnection,
  service: string,
): Promise<ServiceSchema> {
  return hass.callWS({ type: "ambience/services/get_schema", service });
}

export async function validateConfig(
  hass: HassConnection,
  config: AreaConfig,
): Promise<{ ok: true }> {
  return hass.callWS({ type: "ambience/validate", config });
}

/** The websocket scope selector for a scope: `{area_id}`, `{floor_id}`, or
 *  `{house: true}`. Spread into a command message. */
function scopeFields(scope: Scope): Record<string, unknown> {
  if (scope.kind === "area") return { area_id: scope.id };
  if (scope.kind === "floor") return { floor_id: scope.id };
  return { house: true };
}

export async function dryRun(hass: HassConnection, scope: Scope): Promise<DryRunResult> {
  return hass.callWS({ type: "ambience/dry_run", ...scopeFields(scope) });
}

export async function applyScenes(
  hass: HassConnection,
  scope: Scope,
  categoryId?: string,
): Promise<{ ok: true }> {
  const msg: Record<string, unknown> = {
    type: "ambience/apply",
    ...scopeFields(scope),
  };
  if (categoryId !== undefined) msg.category_id = categoryId;
  return hass.callWS(msg);
}

export async function runSceneActions(
  hass: HassConnection,
  scope: Scope,
  sceneIndex: number,
): Promise<{ ran: number; scene_name: string | null }> {
  return hass.callWS({
    type: "ambience/scene/run_actions",
    scene_index: sceneIndex,
    ...scopeFields(scope),
  });
}

export async function listPeriods(hass: HassConnection): Promise<PeriodStoreView> {
  return hass.callWS({ type: "ambience/time_of_day_periods/list" });
}

export async function savePeriods(
  hass: HassConnection,
  custom: Record<string, PeriodDef>,
  hidden: string[],
): Promise<{
  ok: true;
  warnings: Array<{
    scope_kind: string;
    scope_id: string | null;
    scene_name: string;
    missing_period: string;
  }>;
}> {
  return hass.callWS({
    type: "ambience/time_of_day_periods/save",
    custom,
    hidden,
  });
}

export async function resetPeriods(hass: HassConnection): Promise<{ ok: true }> {
  return hass.callWS({ type: "ambience/time_of_day_periods/reset" });
}

export async function getDayConfig(hass: HassConnection): Promise<DayConfig> {
  return hass.callWS({ type: "ambience/conditions/day/config/list" });
}

export async function saveDayConfig(
  hass: HassConnection,
  workday_sensor: string | null,
  workday_calendar: string | null,
): Promise<{
  ok: true;
  warnings: Array<{
    scope_kind: string;
    scope_id: string | null;
    scene_name: string;
    reason: string;
  }>;
}> {
  return hass.callWS({
    type: "ambience/conditions/day/config/save",
    workday_sensor,
    workday_calendar,
  });
}

export async function getWeatherConfig(hass: HassConnection): Promise<WeatherConfig> {
  return hass.callWS({ type: "ambience/conditions/weather/config/list" });
}

export async function saveWeatherConfig(
  hass: HassConnection,
  entity: string | null,
  groups: WeatherGroup[],
): Promise<{
  ok: true;
  warnings: Array<{
    scope_kind: string;
    scope_id: string | null;
    scene_name: string;
    reason: string;
  }>;
}> {
  return hass.callWS({
    type: "ambience/conditions/weather/config/save",
    entity,
    groups,
  });
}

/** Best-effort list of plausible states for an entity. Returns `[]` when
 *  the backend has no domain map AND the entity has no current state. */
export async function getKnownStates(
  hass: HassConnection,
  entity_id: string,
): Promise<{ states: string[] }> {
  return hass.callWS({ type: "ambience/state/known_states", entity_id });
}

/** Possible values for an entity attribute, derived from its companion list
 *  attribute (e.g. a light's `effect` → `effect_list`), always including the
 *  current value. `[]` when there's nothing to offer. */
export async function getKnownAttributeValues(
  hass: HassConnection,
  entity_id: string,
  attribute: string,
): Promise<{ values: string[] }> {
  return hass.callWS({
    type: "ambience/state/known_attribute_values",
    entity_id,
    attribute,
  });
}

export async function getSwitchDefaults(hass: HassConnection): Promise<SwitchDefaults> {
  return hass.callWS({ type: "ambience/switch_defaults/list" });
}

/** Map each scope to its (possibly renamed) Ambience switch entity_id. */
export async function listSwitches(hass: HassConnection): Promise<ScopeSwitch[]> {
  return hass.callWS({ type: "ambience/switches/list" });
}

export async function saveSwitchDefaults(
  hass: HassConnection,
  name: string,
  auto_on_delay_seconds: number,
): Promise<{ ok: true }> {
  return hass.callWS({
    type: "ambience/switch_defaults/save",
    name,
    auto_on_delay_seconds,
  });
}

export async function listCategories(hass: HassConnection): Promise<SceneCategory[]> {
  const res = await hass.callWS<{ categories: SceneCategory[] }>({
    type: "ambience/categories/list",
  });
  return res.categories;
}

export async function saveCategories(
  hass: HassConnection,
  categories: SceneCategory[],
): Promise<{ ok: true }> {
  return hass.callWS({ type: "ambience/categories/save", categories });
}

export async function deleteCategory(
  hass: HassConnection,
  category_id: string,
): Promise<{ ok: true }> {
  return hass.callWS({ type: "ambience/categories/delete", category_id });
}

export async function listTraces(hass: HassConnection): Promise<BufferedUnit[]> {
  const res = await hass.callWS<{ traces: BufferedUnit[] }>({
    type: "ambience/traces/list",
  });
  return res.traces;
}

export async function simulateInputs(
  hass: HassConnection,
  scope: SimulateScope,
  category: string,
): Promise<SimulateInputs> {
  return hass.callWS({
    type: "ambience/simulate/inputs",
    scope_kind: scope.scope_kind,
    scope_id: scope.scope_id,
    category,
  });
}

export async function simulate(
  hass: HassConnection,
  scope: SimulateScope,
  category: string,
  now: string,
  overrides: SimulateOverrides,
  verdicts: SimulateVerdicts,
): Promise<BufferedUnit> {
  const res = await hass.callWS<{ result: BufferedUnit }>({
    type: "ambience/simulate",
    scope_kind: scope.scope_kind,
    scope_id: scope.scope_id,
    category,
    now,
    overrides,
    verdicts,
  });
  return res.result;
}
