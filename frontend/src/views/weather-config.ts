import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { getWeatherConfig, saveWeatherConfig, type HassConnection } from "../api.js";
import { localize } from "../i18n.js";
import type { WeatherConfig } from "../types.js";

type Warning = { area_id: string; rule_name: string; reason: string };

@customElement("ambience-weather-config")
export class AmbienceWeatherConfig extends LitElement {
  static override styles = css`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    .warnings {
      background: var(--warning-color, #ffd);
      border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-top: 0.5rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @state() private _config: WeatherConfig = { entity: null };
  @state() private _warnings: Warning[] = [];

  override async connectedCallback() {
    super.connectedCallback();
    this._config = await getWeatherConfig(this.hass);
  }

  _onEntityChange(e: { detail: { value: string | null } }) {
    const entity = e.detail.value || null;
    this._config = { entity };
    void saveWeatherConfig(this.hass, entity).then((res) => {
      this._warnings = res.warnings ?? [];
    });
  }

  override render() {
    const schema = [{ name: "entity", selector: { entity: { domain: "weather" } } }];
    return html`
      <div class="row">
        <label>${localize(this.hass, "ui.weather_entity", "Weather entity")}</label>
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
