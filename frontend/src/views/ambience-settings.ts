import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { getSwitchDefaults, type HassConnection, saveSwitchDefaults } from "../api.js";
import { localize } from "../i18n.js";
import "./categories-settings.js";
import type { SwitchDefaults } from "../types.js";

@customElement("ambience-ambience-settings")
export class AmbienceAmbienceSettings extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    .card {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      margin-bottom: 1rem;
      padding: 1rem;
    }
    h3 {
      margin: 0 0 0.75rem;
    }
    .row {
      margin-bottom: 0.75rem;
    }
    label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .help {
      color: var(--secondary-text-color, #888);
      font-size: 0.85em;
      margin-top: 0.25rem;
    }
    input[type="text"],
    input[type="number"] {
      width: 100%;
      padding: 0.4rem 0.6rem;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, inherit);
    }
  `;

  @property({ attribute: false }) hass!: HassConnection;

  @state() private _defaults: SwitchDefaults = {
    name: "Ambience",
    auto_on_delay_seconds: 7200,
  };
  @state() private _error = "";

  override async connectedCallback() {
    super.connectedCallback();
    try {
      this._defaults = await getSwitchDefaults(this.hass);
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  private async _safeSave(fn: () => Promise<unknown>): Promise<void> {
    try {
      await fn();
      this._error = "";
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  private _onDefaultName(e: Event) {
    const value = (e.target as HTMLInputElement).value.trim();
    if (!value) return;
    this._defaults = { ...this._defaults, name: value };
    void this._safeSave(() =>
      saveSwitchDefaults(this.hass, this._defaults.name, this._defaults.auto_on_delay_seconds),
    );
  }

  private _onDefaultDelay(e: Event) {
    const raw = (e.target as HTMLInputElement).value;
    if (raw === "" || !Number.isFinite(Number(raw)) || Number(raw) < 0) return;
    this._defaults = {
      ...this._defaults,
      auto_on_delay_seconds: Math.floor(Number(raw)),
    };
    void this._safeSave(() =>
      saveSwitchDefaults(this.hass, this._defaults.name, this._defaults.auto_on_delay_seconds),
    );
  }

  override render() {
    return html`
      ${this._error ? html`<p style="color: var(--error-color, #d32f2f)">${this._error}</p>` : ""}

      <div class="card">
        <h3>
          ${localize(this.hass, "ui.settings_ambience_defaults_card", "Defaults")}
        </h3>
        <div class="row">
          <label
            >${localize(this.hass, "ui.settings_ambience_field_name", "Switch name")}</label
          >
          <input
            data-test="defaults-name"
            type="text"
            .value=${this._defaults.name}
            @change=${(e: Event) => this._onDefaultName(e)}
          />
        </div>
        <div class="row">
          <label
            >${localize(
              this.hass,
              "ui.settings_ambience_field_delay",
              "Auto-on delay (seconds)",
            )}</label
          >
          <input
            data-test="defaults-delay-seconds"
            type="number"
            min="0"
            .value=${String(this._defaults.auto_on_delay_seconds)}
            @change=${(e: Event) => this._onDefaultDelay(e)}
          />
          <div class="help">
            ${localize(this.hass, "ui.settings_ambience_delay_help", "0 = never auto-on")}
          </div>
        </div>
      </div>

      <div class="card">
        <h3>
          ${localize(this.hass, "ui.settings_tab_categories", "Scene categories")}
        </h3>
        <ambience-categories-settings
          .hass=${this.hass}
        ></ambience-categories-settings>
      </div>
    `;
  }
}
