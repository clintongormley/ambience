/**
 * HA version utilities — query feature availability based on hass.config.version.
 */

import type { HassConnection } from "./api.js";

/**
 * Returns true when the connected HA instance is >= 2026.1, where
 * ``homeassistant.helpers.target`` (required for rich target resolution of
 * area/device/label/floor selectors) is available.
 *
 * Parses ``hass.config.version`` as ``"<major>.<minor>[.<patch>]"``. If the
 * string can't be parsed, returns true (assume modern — don't degrade a new HA
 * on a weird version string).
 */
export function targetSelectorSupported(hass: HassConnection): boolean {
  const version = (hass as any)?.config?.version;
  if (typeof version !== "string" || version === "") return true;
  const parts = version.split(".");
  const major = parseInt(parts[0] ?? "", 10);
  const minor = parseInt(parts[1] ?? "", 10);
  if (!Number.isFinite(major) || !Number.isFinite(minor)) return true;
  if (major > 2026) return true;
  if (major === 2026) return minor >= 1;
  return false;
}
