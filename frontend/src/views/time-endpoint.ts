import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { SunAnchor, TimeEndpoint } from "../types.js";
import { anchorLabel } from "../i18n.js";

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
      align-items: center;
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
  `;

  @property({ attribute: false }) hass?: { localize?: (k: string) => string | undefined; [key: string]: unknown };
  @property({ attribute: false }) value: TimeEndpoint = { kind: "time", hh: 12, mm: 0 };

  private _emit(value: TimeEndpoint) {
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
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
    this._emit({ kind: "sun", anchor, offset_min: this.value.offset_min });
  }

  private _onOffsetChange(e: Event) {
    if (this.value.kind !== "sun") return;
    const offset_min = parseInt((e.target as HTMLInputElement).value, 10);
    if (Number.isNaN(offset_min)) return;
    this._emit({ kind: "sun", anchor: this.value.anchor, offset_min });
  }

  private _renderTime(v: { hh: number; mm: number }) {
    const padded = `${String(v.hh).padStart(2, "0")}:${String(v.mm).padStart(2, "0")}`;
    return html`<input type="time" .value=${padded} @input=${this._onTimeChange} />`;
  }

  private _renderSun(v: { anchor: SunAnchor; offset_min: number }) {
    const hint = _formatOffsetHint(v.offset_min);
    return html`
      <select @change=${this._onAnchorChange}>
        ${ANCHORS.map(
          (a) => html`<option value=${a} ?selected=${a === v.anchor}>${anchorLabel(this.hass, a)}</option>`,
        )}
      </select>
      <input
        type="number"
        step="1"
        placeholder="±min, e.g. -30"
        .value=${String(v.offset_min)}
        @input=${this._onOffsetChange}
      />
      <span class="offset-hint">${hint}</span>
    `;
  }

  override render() {
    return html`
      <select @change=${this._onKindChange}>
        <option value="time" ?selected=${this.value.kind === "time"}>Time</option>
        <option value="sun" ?selected=${this.value.kind === "sun"}>Sun</option>
      </select>
      ${this.value.kind === "time" ? this._renderTime(this.value) : this._renderSun(this.value)}
    `;
  }

}

function _formatOffsetHint(offset_min: number): string {
  if (offset_min === 0) return "";
  const abs = Math.abs(offset_min);
  const sign = offset_min < 0 ? "−" : "+"; // U+2212 minus, ASCII +
  if (abs % 60 === 0) {
    const hours = abs / 60;
    return `${sign}${hours} ${hours === 1 ? "hour" : "hours"}`;
  }
  return `${sign}${abs} min`;
}
