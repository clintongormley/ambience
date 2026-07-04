import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { emitValueChanged } from "../dom.js";
import { anchorLabel, localize } from "../i18n.js";
import type { SunAnchor, SunClamp, TimeEndpoint } from "../types.js";

const ANCHORS: SunAnchor[] = ["dawn", "sunrise", "noon", "sunset", "dusk", "midnight"];

/**
 * Editor for one TimeEndpoint. Renders a kind dropdown (Time | Sun) and the
 * appropriate inputs. Emits `value-changed` with `{ value: TimeEndpoint }`.
 *
 * Switching kind resets to a sensible default for the new kind.
 */
@customElement("ambience-time-endpoint")
export class AmbienceTimeEndpoint extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      gap: 0.5rem;
      /* Top-align so the kind dropdown (e.g. "Sun") lines up with the first
         input row, not the vertical centre of the two-row sun editor. */
      align-items: flex-start;
    }
    select, input {
      padding: 0.4rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: inherit;
      font: inherit;
    }
    .offset-hint {
      color: var(--secondary-text-color, #888);
      font-size: 0.85em;
      min-width: 3em;
    }
    .sun {
      display: inline-flex;
      flex-direction: column;
      gap: 0.4rem;
      align-items: flex-start;
    }
    .row {
      display: inline-flex;
      gap: 0.5rem;
      align-items: center;
    }
  `;

  @property({ attribute: false }) hass?: {
    localize?: (k: string) => string | undefined;
    [key: string]: unknown;
  };
  @property({ attribute: false }) value: TimeEndpoint = { kind: "time", hh: 12, mm: 0 };

  private _emit(value: TimeEndpoint) {
    emitValueChanged(this, value);
  }

  private _onKindChange(e: Event) {
    const kind = (e.target as HTMLSelectElement).value as "time" | "sun";
    if (kind === this.value.kind) return;
    if (kind === "time") this._emit({ kind: "time", hh: 12, mm: 0 });
    else this._emit({ kind: "sun", anchor: "sunset", offset_min: 0 });
  }

  private _onTimeChange(e: Event) {
    if (this.value.kind !== "time") return;
    const raw = (e.target as HTMLInputElement).value;
    const [hh, mm] = raw.split(":").map((n) => parseInt(n, 10));
    if (Number.isNaN(hh) || Number.isNaN(mm)) return;
    this._emit({ kind: "time", hh, mm });
  }

  private _onAnchorChange(e: Event) {
    if (this.value.kind !== "sun") return;
    const anchor = (e.target as HTMLSelectElement).value as SunAnchor;
    this._emit({ ...this.value, anchor });
  }

  private _onOffsetChange(e: Event) {
    if (this.value.kind !== "sun") return;
    // A blank field means "no offset" → 0, so the placeholder can show through
    // for the common zero case.
    const raw = (e.target as HTMLInputElement).value.trim();
    const offset_min = raw === "" ? 0 : parseInt(raw, 10);
    if (Number.isNaN(offset_min)) return;
    this._emit({ ...this.value, offset_min });
  }

  private _onClampDirChange(e: Event) {
    if (this.value.kind !== "sun") return;
    const dir = (e.target as HTMLSelectElement).value as "" | "not_before" | "not_after";
    if (dir === "") {
      // Canonical "no clamp" = key absent.
      this._emit({ kind: "sun", anchor: this.value.anchor, offset_min: this.value.offset_min });
      return;
    }
    const seed = this.value.clamp ?? _nowClock();
    this._emit({ ...this.value, clamp: { dir, hh: seed.hh, mm: seed.mm } });
  }

  private _onClampTimeChange(e: Event) {
    if (this.value.kind !== "sun" || !this.value.clamp) return;
    const raw = (e.target as HTMLInputElement).value;
    const [hh, mm] = raw.split(":").map((n) => parseInt(n, 10));
    if (Number.isNaN(hh) || Number.isNaN(mm)) return;
    this._emit({ ...this.value, clamp: { dir: this.value.clamp.dir, hh, mm } });
  }

  private _renderTime(v: { hh: number; mm: number }) {
    const padded = `${String(v.hh).padStart(2, "0")}:${String(v.mm).padStart(2, "0")}`;
    return html`<input type="time" .value=${padded} @input=${this._onTimeChange} />`;
  }

  private _renderSun(v: { anchor: SunAnchor; offset_min: number; clamp?: SunClamp | null }) {
    const hint = formatOffsetHint(v.offset_min, this.hass);
    const clampDir = v.clamp?.dir ?? "";
    const clampTime = v.clamp
      ? `${String(v.clamp.hh).padStart(2, "0")}:${String(v.clamp.mm).padStart(2, "0")}`
      : "";
    return html`
      <div class="sun">
        <div class="row">
          <select @change=${this._onAnchorChange}>
            ${ANCHORS.map(
              (a) =>
                html`<option value=${a} ?selected=${a === v.anchor}>${anchorLabel(this.hass, a)}</option>`,
            )}
          </select>
          <input
            type="number"
            step="1"
            placeholder=${localize(this.hass, "ui.offset_placeholder", "Offset")}
            .value=${v.offset_min === 0 ? "" : String(v.offset_min)}
            @input=${this._onOffsetChange}
          />
          <span class="offset-hint">${hint}</span>
        </div>
        <div class="row">
          <select @change=${this._onClampDirChange}>
            <option value="" ?selected=${clampDir === ""}>${localize(this.hass, "ui.clamp_none", "—")}</option>
            <option value="not_before" ?selected=${clampDir === "not_before"}>${localize(this.hass, "ui.clamp_not_before", "not before")}</option>
            <option value="not_after" ?selected=${clampDir === "not_after"}>${localize(this.hass, "ui.clamp_not_after", "not after")}</option>
          </select>
          ${
            v.clamp
              ? html`<input type="time" .value=${clampTime} @input=${this._onClampTimeChange} />`
              : ""
          }
        </div>
      </div>
    `;
  }

  override render() {
    return html`
      <select @change=${this._onKindChange}>
        <option value="time" ?selected=${this.value.kind === "time"}>${localize(this.hass, "ui.endpoint_time", "Time")}</option>
        <option value="sun" ?selected=${this.value.kind === "sun"}>${localize(this.hass, "ui.endpoint_sun", "Sun")}</option>
      </select>
      ${this.value.kind === "time" ? this._renderTime(this.value) : this._renderSun(this.value)}
    `;
  }
}

function _nowClock(): { hh: number; mm: number } {
  // Local wall-clock — the seed time the user sees must match their timezone.
  const d = new Date();
  return { hh: d.getHours(), mm: d.getMinutes() };
}

export function formatOffsetHint(
  offset_min: number,
  hass?: { localize?: (k: string) => string | undefined; [key: string]: unknown },
): string {
  if (offset_min === 0) return "";
  const abs = Math.abs(offset_min);
  const sign = offset_min < 0 ? "−" : "+"; // U+2212 minus, ASCII +
  if (abs % 60 === 0) {
    const hours = abs / 60;
    const unit =
      hours === 1
        ? localize(hass, "ui.unit_hour", "hour")
        : localize(hass, "ui.unit_hours", "hours");
    return `${sign}${hours} ${unit}`;
  }
  return `${sign}${abs} ${localize(hass, "ui.unit_min", "min")}`;
}
