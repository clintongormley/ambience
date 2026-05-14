/**
 * Typed wrappers over hass.callWS for Ambience WebSocket commands.
 */

import type {
  ActionInfo,
  AreaConfig,
  AreaListItem,
  DryRunResult,
  MatcherInfo,
} from "./types.js";

// HA fires this on the event bus whenever an area is created/updated/removed.
export type AreaRegistryEvent = {
  data: { action: "create" | "update" | "remove"; area_id: string };
};

// HA panel components receive a `hass` object. We type only what we use.
export type HassConnection = {
  callWS<T = unknown>(message: Record<string, unknown>): Promise<T>;
  connection: {
    subscribeEvents<T>(
      callback: (event: T) => void,
      eventType: string,
    ): Promise<() => void>;
  };
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
  areaId: string,
  scene: string,
): Promise<DryRunResult> {
  return hass.callWS({
    type: "ambience/dry_run",
    area_id: areaId,
    scene,
  });
}
