import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { emitValueChanged } from "../dom.js";
import type { HaFormSchema } from "../ha-form.js";
import type { StateForDuration } from "../types.js";

/**
 * Shared h:m:s "for" duration editor — an ha-form duration selector on real
 * HA, three native number inputs in jsdom/older installs. Emits
 * `value-changed` with `{ h, m, s }` (zeros, never null — hosts decide
 * whether all-zero means "no duration").
 *
 * Extracted from the three line-for-line copies in state-expr-atom,
 * people-predicate-input, and occupancy-predicate-input so a fix lands once.
 */
@customElement("ambience-for-duration")
export class AmbienceForDuration extends LitElement {
  static override styles = css`
    :host { display: inline-block; }
    .for-row { display: flex; gap: 0.25rem; align-items: center; }
    .for-row input[type='number'] { width: 3.5rem; }
  `;

  @property({ attribute: false }) hass?: unknown;
  @property({ attribute: false }) value: StateForDuration | null = null;

  private get _d(): StateForDuration {
    return this.value ?? { h: 0, m: 0, s: 0 };
  }

  private _set(d: StateForDuration): void {
    this.value = d;
    emitValueChanged(this, d);
  }

  override render() {
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      const schema: HaFormSchema[] = [
        { name: "duration", selector: { duration: { enable_day: false } } },
      ];
      const d = this._d;
      return html`<ha-form
        data-field="for"
        .hass=${this.hass}
        .schema=${schema}
        .data=${{ duration: { hours: d.h, minutes: d.m, seconds: d.s } }}
        .computeLabel=${() => ""}
        @value-changed=${(
          e: CustomEvent<{
            value: { duration?: { hours?: number; minutes?: number; seconds?: number } };
          }>,
        ) => {
          e.stopPropagation();
          const v = e.detail.value.duration;
          this._set({ h: v?.hours ?? 0, m: v?.minutes ?? 0, s: v?.seconds ?? 0 });
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    const d = this._d;
    const cell = (part: "h" | "m" | "s") => html`<input type="number" min="0"
      .value=${String(d[part])}
      @change=${(e: Event) =>
        this._set({ ...d, [part]: Number((e.target as HTMLInputElement).value) || 0 })} />`;
    return html`<div class="for-row" data-field="for">
      ${cell("h")}<span>:</span>${cell("m")}<span>:</span>${cell("s")}
    </div>`;
  }
}
