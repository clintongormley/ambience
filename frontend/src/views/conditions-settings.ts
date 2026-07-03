import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { type HassConnection, listConditions } from "../api.js";
import { localize, localizeWsError } from "../i18n.js";
import type { ConditionInfo } from "../types.js";
import "./ambience-help.js";
import "./condition-card.js";
import "./time-of-day-config.js";
import "./lux-config.js";
import "./day-config.js";
import "./weather-config.js";

// Per-condition settings panel, keyed by condition name. A condition with no
// entry here exposes no settings UI.
const CONFIG_PANELS: Record<string, (hass: HassConnection) => TemplateResult> = {
  time_of_day: (hass) =>
    html`<ambience-time-of-day-config .hass=${hass}></ambience-time-of-day-config>`,
  lux: (hass) => html`<ambience-lux-config .hass=${hass}></ambience-lux-config>`,
  day: (hass) => html`<ambience-day-config .hass=${hass}></ambience-day-config>`,
  weather: (hass) => html`<ambience-weather-config .hass=${hass}></ambience-weather-config>`,
};

const CONFIGURABLE_CONDITIONS = new Set(Object.keys(CONFIG_PANELS));

@customElement("ambience-conditions-settings")
export class AmbienceConditionsSettings extends LitElement {
  static override styles = css`
    :host { display: block; }
    .error { color: var(--error-color, #d32f2f); }
    .tab-heading {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 600;
      margin-bottom: 0.6rem;
    }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @state() private _conditions: ConditionInfo[] = [];
  @state() private _error = "";

  override async connectedCallback() {
    super.connectedCallback();
    try {
      this._conditions = await listConditions(this.hass);
    } catch (e) {
      this._error = localizeWsError(this.hass, e);
    }
  }

  override render() {
    const configurable = this._conditions
      .filter((m) => CONFIGURABLE_CONDITIONS.has(m.name))
      .slice()
      .sort((a, b) => b.priority - a.priority);
    return html`
      <div class="tab-heading">
        <span>${localize(this.hass, "ui.settings_tab_conditions", "Conditions")}</span>
        <ambience-help .hass=${this.hass} .text=${localize(this.hass, "ui.help_conditions_tab", "Conditions are the inputs scenes match on (time of day, presence, weather, …). A scene wins when all its conditions pass.")} .docPath=${"reference/conditions"}></ambience-help>
      </div>
      ${this._error ? html`<p class="error">${this._error}</p>` : ""}
      ${configurable.map(
        (m) => html`
        <ambience-condition-card .hass=${this.hass} .conditionName=${m.name} .conditionDescription=${m.description}>
          ${CONFIG_PANELS[m.name]?.(this.hass) ?? html``}
        </ambience-condition-card>
      `,
      )}
    `;
  }
}
