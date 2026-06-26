/** Shared hass registry name lookups — area, label, device.
 *  Each function returns the display name for the given id, falling back to
 *  the raw id when the registry entry is absent or has no name set. */

type HassLike = { [key: string]: unknown } | undefined;

/** Look up an area name from hass.areas, falling back to the raw id. */
export function areaName(hass: HassLike, areaId: string): string {
  const areas = hass?.areas as Record<string, { name?: string | null }> | undefined;
  return areas?.[areaId]?.name ?? areaId;
}

/** Look up a label name from hass.labels, falling back to the raw id. */
export function labelName(hass: HassLike, labelId: string): string {
  const labels = hass?.labels as Record<string, { name?: string | null }> | undefined;
  return labels?.[labelId]?.name ?? labelId;
}

/** Look up a device name from hass.devices, falling back to the raw id. */
export function deviceName(hass: HassLike, deviceId: string): string {
  const devices = hass?.devices as Record<string, { name?: string | null }> | undefined;
  return devices?.[deviceId]?.name ?? deviceId;
}
