import type { HassConnection } from "./api.js";

/**
 * Whether a Home Assistant integration `domain` is currently loaded, read from
 * `hass.config.components` (HA's list of set-up integration domains). Returns
 * false when config/components is missing or not an array. `hass.config` is
 * `unknown` under HassConnection's permissive index signature, so we read it
 * defensively rather than trusting its shape.
 */
export function isComponentLoaded(hass: HassConnection, domain: string): boolean {
  const components = (hass as { config?: { components?: unknown } })?.config?.components;
  return Array.isArray(components) && components.includes(domain);
}
