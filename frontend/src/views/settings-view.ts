import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { localize } from "../i18n.js";
import type { HassConnection } from "../api.js";
import "./ambience-settings.js";
import "./conditions-settings.js";
import "./actions-settings.js";

type Tab = "ambience" | "conditions" | "actions";

@customElement("ambience-settings-view")
export class AmbienceSettingsView extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
    }
    /* HA-style tab bar: icon + label, primary-coloured active tab with an
       underline indicator, a single divider beneath the whole row. */
    nav {
      display: flex;
      flex-shrink: 0;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    nav button {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      padding: 0.85rem 1rem;
      cursor: pointer;
      color: var(--secondary-text-color, #727272);
      font-size: 0.95rem;
      font-weight: 500;
      white-space: nowrap;
    }
    nav button:hover {
      color: var(--primary-text-color, inherit);
    }
    nav button.active {
      color: var(--primary-color, #03a9f4);
      border-bottom-color: var(--primary-color, #03a9f4);
    }
    nav button ha-icon {
      --mdc-icon-size: 22px;
    }
    .content {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 1rem;
      max-width: var(--ambience-content-max-width, 60rem);
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
    }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @state() private _tab: Tab = "ambience";

  override render() {
    return html`
      <nav>
        <button class=${this._tab === "ambience" ? "active" : ""} @click=${() => { this._tab = "ambience"; }}>
          <ha-icon icon="mdi:home-lightbulb"></ha-icon>${localize(this.hass, "ui.settings_tab_ambience", "Ambience")}
        </button>
        <button class=${this._tab === "conditions" ? "active" : ""} @click=${() => { this._tab = "conditions"; }}>
          <ha-icon icon="mdi:filter-variant"></ha-icon>${localize(this.hass, "ui.settings_tab_conditions", "Conditions")}
        </button>
        <button class=${this._tab === "actions" ? "active" : ""} @click=${() => { this._tab = "actions"; }}>
          <ha-icon icon="mdi:flash"></ha-icon>${localize(this.hass, "ui.settings_tab_actions", "Actions")}
        </button>
      </nav>
      <div class="content">
        ${this._tab === "ambience"
          ? html`<ambience-ambience-settings .hass=${this.hass}></ambience-ambience-settings>`
          : this._tab === "conditions"
            ? html`<ambience-conditions-settings .hass=${this.hass}></ambience-conditions-settings>`
            : html`<ambience-actions-settings .hass=${this.hass}></ambience-actions-settings>`}
      </div>
    `;
  }
}
