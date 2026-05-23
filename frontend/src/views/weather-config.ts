import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { getWeatherConfig, saveWeatherConfig, type HassConnection } from "../api.js";
import { localize, weatherConditionLabel } from "../i18n.js";
import type { WeatherConfig, WeatherGroup } from "../types.js";

const ALL_CONDITIONS = [
  "clear-night", "cloudy", "fog", "hail", "lightning", "lightning-rainy",
  "partlycloudy", "pouring", "rainy", "snowy", "snowy-rainy", "sunny",
  "windy", "windy-variant", "exceptional",
];

type Warning = { area_id: string; rule_name: string; reason: string };

@customElement("ambience-weather-config")
export class AmbienceWeatherConfig extends LitElement {
  static override styles = css`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label.section { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    h4 { margin: 1rem 0 0.5rem 0; font-size: 0.95em; }
    .group {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      padding: 0.5rem 0.75rem;
      margin-bottom: 0.5rem;
    }
    .group-header {
      display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.4rem;
    }
    .group-header input {
      flex: 1; padding: 0.25rem 0.5rem;
      border: 1px solid var(--divider-color, #ccc); border-radius: 4px;
      background: var(--card-background-color, #fff); color: inherit;
    }
    .conditions-list {
      display: block; color: var(--secondary-text-color, #888);
      font-size: 0.9em; padding: 0.15rem 0;
    }
    button.icon {
      background: none; border: none; padding: 0.2rem 0.4rem; cursor: pointer;
      color: var(--secondary-text-color); font-size: 1em;
    }
    .sr-label {
      position: absolute; width: 1px; height: 1px;
      padding: 0; margin: -1px; overflow: hidden;
      clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
    }
    button.add {
      background: transparent; border: 1px dashed var(--divider-color, #ccc);
      padding: 0.4rem 0.75rem; border-radius: 4px; cursor: pointer;
      color: var(--primary-text-color, inherit);
    }
    .warnings {
      background: var(--warning-color, #ffd);
      border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-top: 0.5rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @state() private _config: WeatherConfig = { entity: null, groups: [] };
  @state() private _warnings: Warning[] = [];

  override async connectedCallback() {
    super.connectedCallback();
    this._config = await getWeatherConfig(this.hass);
  }

  private async _persist() {
    const res = await saveWeatherConfig(this.hass, this._config.entity, this._config.groups);
    this._warnings = res.warnings ?? [];
  }

  _onEntityChange(e: { detail: { value: string | null } }) {
    this._config = { ...this._config, entity: e.detail.value || null };
    void this._persist();
  }

  _nextGroupId(existing: WeatherGroup[]): string {
    const ids = new Set(existing.map((g) => g.id));
    for (let n = 1; n <= existing.length + 1; n++) {
      const candidate = `group_${n}`;
      if (!ids.has(candidate)) return candidate;
    }
    return `group_${existing.length + 1}`;
  }

  _addGroup() {
    const id = this._nextGroupId(this._config.groups);
    this._config = {
      ...this._config,
      groups: [...this._config.groups, { id, label: "", conditions: [] }],
    };
    void this._persist();
  }

  _updateGroup(idx: number, patch: Partial<WeatherGroup>) {
    this._config = {
      ...this._config,
      groups: this._config.groups.map((g, i) => (i === idx ? { ...g, ...patch } : g)),
    };
    void this._persist();
  }

  _removeGroup(idx: number) {
    this._config = {
      ...this._config,
      groups: this._config.groups.filter((_, i) => i !== idx),
    };
    void this._persist();
  }

  /** ha-form schema for the per-group conditions multi-selector. */
  _conditionsSchema() {
    return [
      {
        name: "conditions",
        selector: {
          select: {
            multiple: true,
            mode: "dropdown",
            options: ALL_CONDITIONS.map((c) => ({
              value: c,
              label: weatherConditionLabel(this.hass, c),
            })),
          },
        },
      },
    ];
  }

  private _renderConditions(idx: number, g: WeatherGroup) {
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      return html`<ha-form
        .hass=${this.hass as any}
        .schema=${this._conditionsSchema()}
        .data=${{ conditions: g.conditions }}
        .computeLabel=${() => ""}
        @value-changed=${(e: CustomEvent<{ value: { conditions?: string[] } }>) => {
          e.stopPropagation();
          this._updateGroup(idx, { conditions: e.detail.value.conditions ?? [] });
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    // Native fallback (jsdom / old HA): just list the selected codes.
    const labels = g.conditions.map((c) => weatherConditionLabel(this.hass, c));
    return html`<span class="conditions-list">${labels.join(", ")}</span>`;
  }

  private _renderGroup(idx: number, g: WeatherGroup) {
    return html`
      <div class="group" data-label=${g.label}>
        <div class="group-header">
          <input
            .value=${g.label}
            aria-label=${g.label}
            @change=${(e: Event) => this._updateGroup(idx, { label: (e.target as HTMLInputElement).value })}
          />
          <button class="icon" title=${localize(this.hass, "ui.title_delete", "Delete")}
            @click=${() => this._removeGroup(idx)}>✕</button>
        </div>
        <span class="sr-label">${g.label}</span>
        ${this._renderConditions(idx, g)}
      </div>
    `;
  }

  override render() {
    const schema = [{ name: "entity", selector: { entity: { domain: "weather" } } }];
    return html`
      <div class="row">
        <label class="section">${localize(this.hass, "ui.weather_entity", "Weather entity")}</label>
        <ha-form
          .hass=${this.hass as any}
          .schema=${schema}
          .data=${{ entity: this._config.entity ?? "" }}
          .computeLabel=${() => ""}
          @value-changed=${(e: CustomEvent) => {
            e.stopPropagation();
            this._onEntityChange({ detail: { value: (e.detail.value?.entity as string) || null } });
          }}
        ></ha-form>
      </div>

      <h4>${localize(this.hass, "ui.groups", "Groups")}</h4>
      ${this._config.groups.map((g, i) => this._renderGroup(i, g))}
      <button class="add" @click=${() => this._addGroup()}>
        ${localize(this.hass, "ui.add_group", "+ Add group")}
      </button>

      ${this._warnings.length ? html`
        <div class="warnings">
          <strong>${localize(this.hass, "ui.day_warning_prefix", "Warning:")}</strong>
          ${localize(this.hass, "ui.weather_warning_text", "rules now reference an unconfigured weather entity:")}
          <ul>${this._warnings.map(w => html`<li>${w.area_id} / "${w.rule_name}" → ${w.reason}</li>`)}</ul>
        </div>
      ` : ""}
    `;
  }
}
