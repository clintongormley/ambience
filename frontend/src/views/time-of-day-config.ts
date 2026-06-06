import { html } from "lit";
import { customElement } from "lit/decorators.js";
import type { HassConnection } from "../api.js";
import { listPeriods, savePeriods } from "../api.js";
import { anchorLabel, localize, periodLabel } from "../i18n.js";
import type { PeriodDef, TimeEndpoint } from "../types.js";
import { AmbienceNamedDefConfig, type NamedDefView } from "./named-def-config.js";
import "./period-edit-modal.js";

function formatEndpoint(ep: TimeEndpoint, hass?: HassConnection): string {
  if (ep.kind === "time")
    return `${String(ep.hh).padStart(2, "0")}:${String(ep.mm).padStart(2, "0")}`;
  const anchor = anchorLabel(hass, ep.anchor);
  if (ep.offset_min === 0) return anchor;
  const abs = Math.abs(ep.offset_min);
  const unit =
    abs % 60 === 0
      ? `${abs / 60}${localize(hass, "ui.unit_hour_abbr", "h")}`
      : `${abs}${localize(hass, "ui.unit_min_abbr", "m")}`;
  return `${anchor}${ep.offset_min < 0 ? "-" : "+"}${unit}`;
}

/**
 * Period management screen. Shared list/override/warnings machinery lives in
 * {@link AmbienceNamedDefConfig}; this class wires the period api, labels,
 * from/to formatting, and the period edit modal.
 */
@customElement("ambience-time-of-day-config")
export class AmbienceTimeOfDayConfig extends AmbienceNamedDefConfig<PeriodDef> {
  protected _list(): Promise<NamedDefView<PeriodDef>> {
    return listPeriods(this.hass);
  }
  protected _save(custom: Record<string, PeriodDef>, hidden: string[]) {
    return savePeriods(this.hass, custom, hidden);
  }
  protected _label(id: string, custom: Record<string, PeriodDef>): string {
    return periodLabel(this.hass as never, id, custom);
  }
  protected _formatDef(d: PeriodDef): string {
    return `${formatEndpoint(d.from, this.hass)} → ${formatEndpoint(d.to, this.hass)}`;
  }
  protected _headingKey(): [string, string] {
    return ["ui.periods_heading", "Periods"];
  }
  protected _addKey(): [string, string] {
    return ["ui.add_custom_period", "+ Add custom period"];
  }
  protected _warningTextKey(): [string, string] {
    return ["ui.period_warning_text", "some scenes now reference missing periods:"];
  }

  protected _renderModal() {
    const m = this._modal;
    if (m.mode === "edit") {
      return html`<ambience-period-edit-modal
        .hass=${this.hass}
        .existingId=${m.id}
        .initial=${m.initial}
        .takenIds=${this._takenIds()}
        @period-save=${this._onModalSave}
        @period-cancel=${this._onModalCancel}
      ></ambience-period-edit-modal>`;
    }
    if (m.mode === "add") {
      return html`<ambience-period-edit-modal
        .hass=${this.hass}
        .takenIds=${this._takenIds()}
        @period-save=${this._onModalSave}
        @period-cancel=${this._onModalCancel}
      ></ambience-period-edit-modal>`;
    }
    return html``;
  }
}
