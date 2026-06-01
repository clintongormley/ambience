import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { localize } from "../i18n.js";
import type { HassConnection } from "../api.js";
import "./ambience-settings.js";
import "./matchers-settings.js";
import "./actions-settings.js";

type Tab = "ambience" | "matchers" | "actions";

@customElement("ambience-settings-view")
export class AmbienceSettingsView extends LitElement {
  static override styles = css`
    :host { display: block; padding: 1rem; max-width: var(--ambience-content-max-width, 60rem); margin: 0 auto; }
    nav { display: flex; gap: 0.25rem; margin-bottom: 1rem; }
    nav button {
      background: transparent;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      padding: 0.35rem 0.75rem;
      cursor: pointer;
      color: var(--primary-text-color, inherit);
      font-size: 0.9rem;
    }
    nav button.active {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
    }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @state() private _tab: Tab = "ambience";

  override render() {
    return html`
      <nav>
        <button class=${this._tab === "ambience" ? "active" : ""} @click=${() => { this._tab = "ambience"; }}>${localize(this.hass, "ui.settings_tab_ambience", "Ambience")}</button>
        <button class=${this._tab === "matchers" ? "active" : ""} @click=${() => { this._tab = "matchers"; }}>${localize(this.hass, "ui.settings_tab_matchers", "Matchers")}</button>
        <button class=${this._tab === "actions" ? "active" : ""} @click=${() => { this._tab = "actions"; }}>${localize(this.hass, "ui.settings_tab_actions", "Actions")}</button>
      </nav>
      ${this._tab === "ambience"
        ? html`<ambience-ambience-settings .hass=${this.hass}></ambience-ambience-settings>`
        : this._tab === "matchers"
          ? html`<ambience-matchers-settings .hass=${this.hass}></ambience-matchers-settings>`
          : html`<ambience-actions-settings .hass=${this.hass}></ambience-actions-settings>`}
    `;
  }
}
