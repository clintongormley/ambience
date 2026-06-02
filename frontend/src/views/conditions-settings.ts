import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { listConditions, type HassConnection } from "../api.js";
import type { ConditionInfo } from "../types.js";
import "./condition-card.js";
import "./time-of-day-config.js";
import "./day-config.js";
import "./weather-config.js";

const CONFIGURABLE_CONDITIONS = new Set(["time_of_day", "day", "weather"]);

@customElement("ambience-conditions-settings")
export class AmbienceConditionsSettings extends LitElement {
  static override styles = css`
    :host { display: block; }
    .error { color: var(--error-color, #d32f2f); }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @state() private _conditions: ConditionInfo[] = [];
  @state() private _error = "";

  override async connectedCallback() {
    super.connectedCallback();
    try {
      this._conditions = await listConditions(this.hass);
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  override render() {
    const configurable = this._conditions
      .filter((m) => CONFIGURABLE_CONDITIONS.has(m.name))
      .slice()
      .sort((a, b) => b.priority - a.priority);
    return html`
      ${this._error ? html`<p class="error">${this._error}</p>` : ""}
      ${configurable.map((m) => html`
        <ambience-condition-card .hass=${this.hass} .conditionName=${m.name} .conditionDescription=${m.description}>
          ${m.name === "time_of_day"
            ? html`<ambience-time-of-day-config .hass=${this.hass}></ambience-time-of-day-config>`
            : m.name === "day"
              ? html`<ambience-day-config .hass=${this.hass}></ambience-day-config>`
              : m.name === "weather"
                ? html`<ambience-weather-config .hass=${this.hass}></ambience-weather-config>`
                : html``}
        </ambience-condition-card>
      `)}
    `;
  }
}
