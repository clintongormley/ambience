import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { listLuxRanges, saveLuxRanges } from "../api.js";
import { luxLabel } from "../i18n.js";
import { fmtLuxBand } from "../summary.js";
import type { LuxRangeDef } from "../types.js";
import { AmbienceNamedDefConfig, type DefWarning, type NamedDefView } from "./named-def-config.js";
import "./lux-edit-modal.js";

/**
 * Lux-range management screen. Shared list/override/warnings machinery lives in
 * {@link AmbienceNamedDefConfig}; this class wires the lux api, labels, band
 * formatting, and the lux edit modal.
 */
@customElement("ambience-lux-config")
export class AmbienceLuxConfig extends AmbienceNamedDefConfig<LuxRangeDef> {
  protected _list(): Promise<NamedDefView<LuxRangeDef>> {
    return listLuxRanges(this.hass);
  }
  protected _save(custom: Record<string, LuxRangeDef>, hidden: string[]) {
    return saveLuxRanges(this.hass, custom, hidden);
  }
  protected _label(id: string, custom: Record<string, LuxRangeDef>): string {
    return luxLabel(this.hass as never, id, custom);
  }
  protected _formatDef(d: LuxRangeDef): string {
    return fmtLuxBand(d.min, d.max, "any");
  }
  protected _missingId(w: DefWarning): string {
    return w.missing_range ?? "";
  }
  protected _headingKey(): [string, string] {
    return ["ui.lux_heading", "Lux ranges"];
  }
  protected _addKey(): [string, string] {
    return ["ui.add_custom_lux_range", "+ Add custom lux range"];
  }
  protected _warningTextKey(): [string, string] {
    return ["ui.lux_warning_text", "some scenes now reference missing lux ranges:"];
  }

  protected _renderModal() {
    const m = this._modal;
    if (m.mode === "edit") {
      return html`<ambience-lux-edit-modal
        .hass=${this.hass}
        .existingId=${m.id}
        .initial=${m.initial}
        .takenIds=${this._takenIds()}
        @lux-range-save=${this._onModalSave}
        @lux-range-cancel=${this._onModalCancel}
      ></ambience-lux-edit-modal>`;
    }
    if (m.mode === "add") {
      return html`<ambience-lux-edit-modal
        .hass=${this.hass}
        .takenIds=${this._takenIds()}
        @lux-range-save=${this._onModalSave}
        @lux-range-cancel=${this._onModalCancel}
      ></ambience-lux-edit-modal>`;
    }
    return html``;
  }
}
