import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import {
  listEnabledMatchers,
  listMatchers,
  saveEnabledMatchers,
  type HassConnection,
} from "../api.js";
import type { MatcherInfo } from "../types.js";
import "./matcher-card.js";
import "./time-of-day-config.js";
import "./day-config.js";

@customElement("ambience-configuration-view")
export class AmbienceConfigurationView extends LitElement {
  static override styles = css`
    :host { display: block; padding: 1rem; max-width: 60rem; margin: 0 auto; }
    .error { color: var(--error-color, #d32f2f); }
  `;

  @property({ attribute: false }) hass!: HassConnection;

  @state() private _matchers: MatcherInfo[] = [];
  @state() private _enabled = new Set<string>();
  @state() private _error = "";

  override async connectedCallback() {
    super.connectedCallback();
    try {
      const [matchers, enabled] = await Promise.all([
        listMatchers(this.hass),
        listEnabledMatchers(this.hass),
      ]);
      this._matchers = matchers;
      this._enabled = new Set(enabled.enabled);
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  private async _onToggle(name: string, on: boolean) {
    const next = new Set(this._enabled);
    if (on) next.add(name);
    else next.delete(name);
    this._enabled = next;
    try {
      const list = this._matchers
        .filter((m) => m.toggleable && next.has(m.name))
        .map((m) => m.name);
      await saveEnabledMatchers(this.hass, list);
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  override render() {
    const toggleable = this._matchers.filter((m) => m.toggleable);
    return html`
      ${this._error ? html`<p class="error">${this._error}</p>` : ""}
      ${toggleable.map((m) => html`
        <ambience-matcher-card
          .hass=${this.hass}
          .matcherName=${m.name}
          .matcherDescription=${m.description}
          .enabled=${this._enabled.has(m.name)}
          @enable-changed=${(e: CustomEvent<{ enabled: boolean }>) => {
            e.stopPropagation();
            void this._onToggle(m.name, e.detail.enabled);
          }}
        >
          ${m.name === "time_of_day"
            ? html`<ambience-time-of-day-config .hass=${this.hass}></ambience-time-of-day-config>`
            : m.name === "day"
              ? html`<ambience-day-config .hass=${this.hass}></ambience-day-config>`
              : html``}
        </ambience-matcher-card>
      `)}
    `;
  }
}
