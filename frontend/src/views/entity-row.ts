import { html, css, type TemplateResult } from "lit";

import type { HassConnection } from "../api.js";

// Per-domain entity icons — a fallback for when <ha-state-icon> isn't
// registered (it resolves the real icon otherwise).
const DOMAIN_ICON: Record<string, string> = {
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch-variant",
  binary_sensor: "mdi:motion-sensor",
  sensor: "mdi:eye",
  person: "mdi:account",
  device_tracker: "mdi:account",
  climate: "mdi:thermostat",
  cover: "mdi:window-shutter",
  media_player: "mdi:cast",
  lock: "mdi:lock",
  fan: "mdi:fan",
  weather: "mdi:weather-partly-cloudy",
  input_boolean: "mdi:toggle-switch",
  event: "mdi:eye-check",
  script: "mdi:script-text",
  template: "mdi:code-braces",
};
export const DEFAULT_ENTITY_ICON = "mdi:eye";

export type HassWithStates = {
  states?: Record<string, { attributes?: Record<string, unknown> }>;
};

/** Friendly name for an entity, falling back to the entity_id. */
export function entityName(hass: HassWithStates | undefined, entity_id: string): string {
  const name = hass?.states?.[entity_id]?.attributes?.friendly_name;
  return typeof name === "string" && name ? name : entity_id;
}

/** Icon for an entity: its own `icon` attribute, else a per-domain default,
 *  else a neutral glyph. */
export function entityIcon(hass: HassWithStates | undefined, entity_id: string): string {
  const custom = hass?.states?.[entity_id]?.attributes?.icon;
  if (typeof custom === "string" && custom) return custom;
  const domain = entity_id.split(".")[0];
  return DOMAIN_ICON[domain] ?? DEFAULT_ENTITY_ICON;
}

/** Leading icon for an entity row: HA's <ha-state-icon> when registered (it
 *  resolves the registry/device_class/domain icon), else a per-domain glyph. */
export function renderEntityIcon(hass: HassConnection, entity_id: string): TemplateResult {
  const stateObj = (hass as HassWithStates)?.states?.[entity_id];
  if (stateObj && customElements.get("ha-state-icon")) {
    return html`<ha-state-icon class="row-icon" .hass=${hass} .stateObj=${stateObj}></ha-state-icon>`;
  }
  return html`<ha-icon class="row-icon" icon=${entityIcon(hass, entity_id)}></ha-icon>`;
}

/** Shared row layout CSS (icon + text block). Hosts add it to `static styles`. */
export const entityRowStyles = css`
  .row-icon {
    flex: 0 0 auto;
    color: var(--secondary-text-color, #888);
    --mdc-icon-size: 22px;
  }
  .row-text {
    flex: 1;
    min-width: 0;
  }
  .row-title {
    color: var(--primary-text-color, #212121);
  }
  .row-detail {
    color: var(--secondary-text-color, #888);
    font-size: 0.8em;
    margin-top: 0.1rem;
    word-break: break-word;
  }
`;
