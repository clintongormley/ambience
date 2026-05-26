import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import {
  listMatchers,
  type HassConnection,
} from "../api.js";
import type { MatcherInfo } from "../types.js";
import "./matcher-card.js";
import "./time-of-day-config.js";
import "./day-config.js";
import "./weather-config.js";

// Matchers with a per-matcher config widget rendered into the card body.
// Add a new entry here whenever a new matcher ships a configuration form.
const CONFIGURABLE_MATCHERS = new Set(["time_of_day", "day", "weather"]);

@customElement("ambience-configuration-view")
export class AmbienceConfigurationView extends LitElement {
  static override styles = css`
    :host { display: block; padding: 1rem; max-width: 60rem; margin: 0 auto; }
    .error { color: var(--error-color, #d32f2f); }
  `;

  @property({ attribute: false }) hass!: HassConnection;

  @state() private _matchers: MatcherInfo[] = [];
  @state() private _error = "";

  override async connectedCallback() {
    super.connectedCallback();
    try {
      this._matchers = await listMatchers(this.hass);
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  override render() {
    // Show cards in linearisation-priority order (lower first) so the
    // Configuration tab matches the order used by rule summaries.
    const configurable = this._matchers
      .filter((m) => CONFIGURABLE_MATCHERS.has(m.name))
      .slice()
      .sort((a, b) => a.priority - b.priority);
    return html`
      ${this._error ? html`<p class="error">${this._error}</p>` : ""}
      ${configurable.map((m) => html`
        <ambience-matcher-card
          .hass=${this.hass}
          .matcherName=${m.name}
          .matcherDescription=${m.description}
        >
          ${m.name === "time_of_day"
            ? html`<ambience-time-of-day-config .hass=${this.hass}></ambience-time-of-day-config>`
            : m.name === "day"
              ? html`<ambience-day-config .hass=${this.hass}></ambience-day-config>`
              : m.name === "weather"
                ? html`<ambience-weather-config .hass=${this.hass}></ambience-weather-config>`
                : html``}
        </ambience-matcher-card>
      `)}
    `;
  }
}
