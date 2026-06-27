import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import {
  getExposedAssistants,
  getReapplySettings,
  getSwitchDefaults,
  type HassConnection,
  saveExposedAssistants,
  saveReapplySettings,
  saveSwitchDefaults,
} from "../api.js";
import { renderHaSwitch } from "../ha-switch.js";
import { localize, localizeWsError } from "../i18n.js";
import type { ExposedAssistants, ReapplySettings, SwitchDefaults } from "../types.js";
import "./ambience-help.js";

/** The voice-assistant exposure toggles, in display order. One row per assistant
 *  — rendered identically, so a table avoids three copy-pasted blocks. */
const EXPOSE_ROWS: ReadonlyArray<{
  field: keyof ExposedAssistants;
  labelKey: string;
  label: string;
  dataTest: string;
}> = [
  {
    field: "expose_assist",
    labelKey: "ui.settings_expose_assist",
    label: "Assist",
    dataTest: "expose-assist",
  },
  {
    field: "expose_google",
    labelKey: "ui.settings_expose_google",
    label: "Google Assistant",
    dataTest: "expose-google",
  },
  {
    field: "expose_alexa",
    labelKey: "ui.settings_expose_alexa",
    label: "Alexa",
    dataTest: "expose-alexa",
  },
];

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
      /* White cards on a white dialog: a larger gap plus a faint lift make the
         two top-level sections read as clearly separate. */
      margin-bottom: 1.5rem;
      padding: 1rem;
      box-shadow: var(--ha-card-box-shadow, 0 1px 3px rgba(0, 0, 0, 0.08));
    }
    .card:last-child {
      margin-bottom: 0;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
    }
    .row label {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      /* Field labels sit a notch lighter than the section headings so they
         stop competing with them. */
      font-weight: 500;
      /* Label column is a fixed half-width so the fields beside it line up. */
      flex: 0 0 50%;
    }
    /* A section header: the master toggle that gates the whole card. Larger and
       bold, with a divider beneath it. */
    .toggle-row {
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      padding-bottom: 0.75rem;
      margin-bottom: 0.9rem;
    }
    .toggle-row label {
      font-weight: 700;
      font-size: 1.05rem;
    }
    /* The voice-assistant controls form a sub-section nested under the pause
       switch: a quiet sub-heading above the toggle rows, whose label text is
       indented so the rows read as nested — while the switches stay on the same
       column as the controls in the rows above. */
    .expose-group {
      margin-top: 1rem;
    }
    .expose-heading {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--secondary-text-color, #8b919b);
      margin-bottom: 0.5rem;
    }
    .expose-rows .row:last-child {
      margin-bottom: 0;
    }
    .expose-rows label {
      /* Indent only the label text; keep the fixed 50% column so the switch
         lines up with the fields' control column above, not flush right. */
      box-sizing: border-box;
      padding-left: 1rem;
    }
    input[type="text"],
    input[type="number"] {
      padding: 0.4rem 0.6rem;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, inherit);
    }
    input[type="text"] {
      /* Fill the remaining half beside the 50% label, on the same line. */
      flex: 1 1 auto;
      min-width: 0;
      box-sizing: border-box;
    }
    input[type="number"] {
      width: 5rem;
    }
    input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .unit {
      margin-left: 0.4rem;
      color: var(--secondary-text-color, #888);
    }
  `;

  @property({ attribute: false }) hass!: HassConnection;

  @state() private _defaults: SwitchDefaults = {
    name: "Ambience",
    auto_on_delay_seconds: 0,
  };
  @state() private _reapply: ReapplySettings = {
    enabled: false,
    interval_seconds: 3600,
  };
  @state() private _exposed: ExposedAssistants = {
    expose_assist: true,
    expose_google: false,
    expose_alexa: false,
  };
  @state() private _error = "";

  override async connectedCallback() {
    super.connectedCallback();
    try {
      this._defaults = await getSwitchDefaults(this.hass);
      this._reapply = await getReapplySettings(this.hass);
      this._exposed = await getExposedAssistants(this.hass);
    } catch (e) {
      this._error = localizeWsError(this.hass, e);
    }
  }

  private async _safeSave(fn: () => Promise<unknown>): Promise<void> {
    try {
      await fn();
      this._error = "";
    } catch (e) {
      this._error = localizeWsError(this.hass, e);
    }
  }

  private _saveDefaults() {
    void this._safeSave(() =>
      saveSwitchDefaults(this.hass, this._defaults.name, this._defaults.auto_on_delay_seconds),
    );
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
    this._saveDefaults();
  }

  private _onPauseMinutes(e: Event) {
    const input = e.target as HTMLInputElement;
    const minutes = Math.floor(Number(input.value));
    if (input.value === "" || !Number.isFinite(minutes) || minutes < 0) {
      input.value = String(Math.round(this._defaults.auto_on_delay_seconds / 60));
      return;
    }
    this._defaults = { ...this._defaults, auto_on_delay_seconds: minutes * 60 };
    this._saveDefaults();
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

  private _saveExposed() {
    void this._safeSave(() =>
      saveExposedAssistants(
        this.hass,
        this._exposed.expose_assist,
        this._exposed.expose_google,
        this._exposed.expose_alexa,
      ),
    );
  }

  private _onExpose(field: keyof ExposedAssistants, e: Event) {
    this._exposed = { ...this._exposed, [field]: (e.target as HTMLInputElement).checked };
    this._saveExposed();
  }

  /** Render a toggle using ha-switch when registered (real HA), else a plain
   *  checkbox fallback so the view remains testable under jsdom. Both carry
   *  the same data-test attribute. */
  private _renderToggle(
    checked: boolean,
    dataTest: string,
    onChange: (e: Event) => void,
    disabled = false,
  ) {
    return renderHaSwitch({ checked, dataTest, onChange, disabled });
  }

  override render() {
    return html`
      ${this._error ? html`<p style="color: var(--error-color, #d32f2f)">${this._error}</p>` : ""}

      <div class="card">
        <div class="row">
          <label>
            ${localize(this.hass, "ui.settings_ambience_field_name", "Switch name")}
            <ambience-help
              .hass=${this.hass}
              .text=${localize(
                this.hass,
                "ui.help_switch_name",
                "The name used for the per-scope pause switch entities.",
              )}
            ></ambience-help>
          </label>
          <input
            data-test="defaults-name"
            type="text"
            .value=${this._defaults.name}
            @change=${(e: Event) => this._onDefaultName(e)}
          />
        </div>
        <div class="row">
          <label>
            ${localize(this.hass, "ui.settings_ambience_field_pause", "Pause for")}
            <ambience-help
              .hass=${this.hass}
              .text=${localize(
                this.hass,
                "ui.help_pause_for",
                "When a scope's switch is turned off, auto-resume after this many minutes. 0 = stays paused until turned back on.",
              )}
            ></ambience-help>
          </label>
          <input
            data-test="pause-for-minutes"
            type="number"
            min="0"
            .value=${String(Math.round(this._defaults.auto_on_delay_seconds / 60))}
            @change=${(e: Event) => this._onPauseMinutes(e)}
          />
          <span class="unit"
            >${localize(this.hass, "ui.unit_minutes", "minutes")}</span
          >
        </div>
        <div class="expose-group" data-test="expose-group">
          <div class="expose-heading">
            ${localize(this.hass, "ui.settings_expose_group", "Expose to voice assistants")}
            <ambience-help
              .hass=${this.hass}
              .text=${localize(
                this.hass,
                "ui.help_expose",
                "Expose the per-scope pause switches to the selected voice assistants so you can pause/resume Ambience by voice. Google Assistant and Alexa require Home Assistant Cloud or a manual setup.",
              )}
            ></ambience-help>
          </div>
          <div class="expose-rows">
            ${EXPOSE_ROWS.map(
              (row) => html`
                <div class="row">
                  <label>${localize(this.hass, row.labelKey, row.label)}</label>
                  ${this._renderToggle(
                    this._exposed[row.field],
                    row.dataTest,
                    (e) => this._onExpose(row.field, e),
                    false,
                  )}
                </div>
              `,
            )}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="row toggle-row">
          <label>
            ${localize(
              this.hass,
              "ui.settings_reapply_enable_label",
              "Re-run all scenes after inactivity",
            )}
            <ambience-help
              .hass=${this.hass}
              .text=${localize(
                this.hass,
                "ui.help_reapply_toggle",
                "Re-run the scenes for a scope/category after inactivity and re-apply the winning scene, in case any action had previously failed, such as a light not turning off.",
              )}
            ></ambience-help>
          </label>
          ${this._renderToggle(this._reapply.enabled, "reapply-enabled", (e) =>
            this._onReapplyEnabled(e),
          )}
        </div>
        <div class="row">
          <label>
            ${localize(this.hass, "ui.settings_reapply_interval_label", "Re-run after")}
            <ambience-help
              .hass=${this.hass}
              .text=${localize(
                this.hass,
                "ui.help_reapply_after",
                "Re-run scenes that haven't been updated for this many minutes.",
              )}
            ></ambience-help>
          </label>
          <input
            data-test="reapply-interval-minutes"
            type="number"
            min="1"
            ?disabled=${!this._reapply.enabled}
            .value=${String(Math.round(this._reapply.interval_seconds / 60))}
            @change=${(e: Event) => this._onReapplyMinutes(e)}
          />
          <span class="unit"
            >${localize(this.hass, "ui.unit_minutes", "minutes")}</span
          >
        </div>
      </div>
    `;
  }
}
