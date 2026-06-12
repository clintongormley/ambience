import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import {
  getReapplySettings,
  getSwitchDefaults,
  type HassConnection,
  saveReapplySettings,
  saveSwitchDefaults,
} from "../api.js";
import { localize } from "../i18n.js";
import type { ReapplySettings, SwitchDefaults } from "../types.js";

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
  @state() private _reapply: ReapplySettings = {
    enabled: false,
    interval_seconds: 5400,
  };
  @state() private _error = "";

  override async connectedCallback() {
    super.connectedCallback();
    try {
      this._defaults = await getSwitchDefaults(this.hass);
      this._reapply = await getReapplySettings(this.hass);
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
    const input = e.target as HTMLInputElement;
    const value = input.value.trim();
    if (!value) {
      // Rejected edit: restore the stored value — Lit won't re-commit the
      // unchanged binding, so the input would keep showing the rejected text.
      input.value = this._defaults.name;
      return;
    }
    this._defaults = { ...this._defaults, name: value };
    void this._safeSave(() =>
      saveSwitchDefaults(this.hass, this._defaults.name, this._defaults.auto_on_delay_seconds),
    );
  }

  private _onDefaultDelay(e: Event) {
    const input = e.target as HTMLInputElement;
    const raw = input.value;
    if (raw === "" || !Number.isFinite(Number(raw)) || Number(raw) < 0) {
      input.value = String(this._defaults.auto_on_delay_seconds);
      return;
    }
    this._defaults = {
      ...this._defaults,
      auto_on_delay_seconds: Math.floor(Number(raw)),
    };
    void this._safeSave(() =>
      saveSwitchDefaults(this.hass, this._defaults.name, this._defaults.auto_on_delay_seconds),
    );
  }

  private _saveReapply() {
    void this._safeSave(() =>
      saveReapplySettings(this.hass, this._reapply.enabled, this._reapply.interval_seconds),
    );
  }

  private _onReapplyEnabled(e: Event) {
    this._reapply = { ...this._reapply, enabled: (e.target as HTMLInputElement).checked };
    this._saveReapply();
  }

  private _onReapplyMinutes(e: Event) {
    const input = e.target as HTMLInputElement;
    const minutes = Math.floor(Number(input.value));
    if (input.value === "" || !Number.isFinite(minutes) || minutes < 1) {
      input.value = String(Math.round(this._reapply.interval_seconds / 60));
      return;
    }
    this._reapply = { ...this._reapply, interval_seconds: minutes * 60 };
    this._saveReapply();
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
        <h3>${localize(this.hass, "ui.settings_reapply_card", "Re-apply")}</h3>
        <div class="row">
          <label>
            <input
              data-test="reapply-enabled"
              type="checkbox"
              .checked=${this._reapply.enabled}
              @change=${(e: Event) => this._onReapplyEnabled(e)}
            />
            ${localize(
              this.hass,
              "ui.settings_reapply_enable_label",
              "Re-apply scenes after inactivity",
            )}
          </label>
        </div>
        <div class="row">
          <label
            >${localize(
              this.hass,
              "ui.settings_reapply_interval_label",
              "Inactivity timeout (minutes)",
            )}</label
          >
          <input
            data-test="reapply-interval-minutes"
            type="number"
            min="1"
            .value=${String(Math.round(this._reapply.interval_seconds / 60))}
            @change=${(e: Event) => this._onReapplyMinutes(e)}
          />
          <div class="help">
            ${localize(
              this.hass,
              "ui.settings_reapply_help",
              "Re-send each area's scene commands after this much quiet, to recover dropped commands.",
            )}
          </div>
        </div>
      </div>
    `;
  }
}
