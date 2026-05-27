/**
 * Typed wrappers over hass.callWS for Ambience WebSocket commands.
 */

import type {
  ActionInfo,
  AreaConfig,
  AreaListItem,
  DayConfig,
  DryRunResult,
  FloorListItem,
  MatcherInfo,
  PeriodDef,
  PeriodStoreView,
  Scope,
  ScopeConfig,
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
  connection: {
    subscribeEvents<T>(
      callback: (event: T) => void,
      eventType: string,
    ): Promise<() => void>;
  };
  [key: string]: unknown;
};

export async function listAreas(hass: HassConnection): Promise<AreaListItem[]> {
  return hass.callWS({ type: "ambience/areas/list" });
}

export async function getArea(
  hass: HassConnection,
  areaId: string,
): Promise<AreaConfig> {
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

export async function getFloor(
  hass: HassConnection,
  floorId: string,
): Promise<ScopeConfig> {
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

export async function listMatchers(hass: HassConnection): Promise<MatcherInfo[]> {
  return hass.callWS({ type: "ambience/matchers/list" });
}

export async function listActions(hass: HassConnection): Promise<ActionInfo[]> {
  return hass.callWS({ type: "ambience/actions/list" });
}

export async function validateConfig(
  hass: HassConnection,
  config: AreaConfig,
): Promise<{ ok: true }> {
  return hass.callWS({ type: "ambience/validate", config });
}

export async function dryRun(
  hass: HassConnection,
  scope: Scope,
  scene?: string,
): Promise<DryRunResult> {
  const msg: Record<string, unknown> = { type: "ambience/dry_run" };
  if (scope.kind === "area") msg.area_id = scope.id;
  else if (scope.kind === "floor") msg.floor_id = scope.id;
  else msg.house = true;
  if (scene !== undefined) msg.scene = scene;
  return hass.callWS(msg);
}

export async function listPeriods(hass: HassConnection): Promise<PeriodStoreView> {
  return hass.callWS({ type: "ambience/time_of_day_periods/list" });
}

export async function savePeriods(
  hass: HassConnection,
  custom: Record<string, PeriodDef>,
  hidden: string[],
): Promise<{ ok: true; warnings: Array<{ scope_kind: string; scope_id: string | null; rule_name: string; missing_period: string }> }> {
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
  return hass.callWS({ type: "ambience/matchers/day/config/list" });
}

export async function saveDayConfig(
  hass: HassConnection,
  workday_sensor: string | null,
  workday_calendar: string | null,
): Promise<{ ok: true; warnings: Array<{ scope_kind: string; scope_id: string | null; rule_name: string; reason: string }> }> {
  return hass.callWS({
    type: "ambience/matchers/day/config/save",
    workday_sensor,
    workday_calendar,
  });
}

export async function getWeatherConfig(hass: HassConnection): Promise<WeatherConfig> {
  return hass.callWS({ type: "ambience/matchers/weather/config/list" });
}

export async function saveWeatherConfig(
  hass: HassConnection,
  entity: string | null,
  groups: WeatherGroup[],
): Promise<{ ok: true; warnings: Array<{ scope_kind: string; scope_id: string | null; rule_name: string; reason: string }> }> {
  return hass.callWS({
    type: "ambience/matchers/weather/config/save",
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

export async function getSwitchDefaults(hass: HassConnection): Promise<SwitchDefaults> {
  return hass.callWS({ type: "ambience/switch_defaults/list" });
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

export async function saveHouseSwitch(
  hass: HassConnection,
  name: string | null,
  auto_on_delay_seconds: number | null,
): Promise<{ ok: true }> {
  return hass.callWS({
    type: "ambience/house/switch/save",
    name,
    auto_on_delay_seconds,
  });
}

export async function saveFloorSwitch(
  hass: HassConnection,
  floor_id: string,
  name: string | null,
  auto_on_delay_seconds: number | null,
): Promise<{ ok: true }> {
  return hass.callWS({
    type: "ambience/floor/switch/save",
    floor_id,
    name,
    auto_on_delay_seconds,
  });
}

export async function saveAreaSwitch(
  hass: HassConnection,
  area_id: string,
  name: string | null,
  auto_on_delay_seconds: number | null,
): Promise<{ ok: true }> {
  return hass.callWS({
    type: "ambience/area/switch/save",
    area_id,
    name,
    auto_on_delay_seconds,
  });
}
