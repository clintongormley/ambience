import { css, html, LitElement, type PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import { emitValueChanged } from "../dom.js";
import type { HaFormSchema } from "../ha-form.js";
import { type HassLike, localize } from "../i18n.js";
import type { ForMode, StateForDuration } from "../types.js";

/**
 * Shared h:m:s "for" duration editor with an "at least" / "less than" mode
 * toggle — an ha-form duration selector + select on real HA, three native
 * number inputs + a native `<select>` in jsdom/older installs. Emits
 * `value-changed` with `{ h, m, s, mode }` (zeros, never null — hosts decide
 * whether all-zero means "no duration"; `mode` defaults to "at_least").
 *
 * Extracted from the three line-for-line copies in state-expr-atom,
 * people-predicate-input, and occupancy-predicate-input so a fix lands once.
 */
// Module-level so ha-form sees a stable schema identity across re-renders and
// doesn't re-initialise the duration selector mid-edit.
const FOR_SCHEMA: HaFormSchema[] = [
  { name: "duration", selector: { duration: { enable_day: false } } },
];

/** The value this editor emits: the duration plus the at-least/less-than mode. */
export type ForDurationValue = StateForDuration & { mode: ForMode };

/** True when a `for` duration is present and non-zero. A zero duration means
 *  "no gate", so it carries no mode either. */
export function hasForDuration(dur: StateForDuration | null | undefined): boolean {
  return !!dur && (dur.h !== 0 || dur.m !== 0 || dur.s !== 0);
}

/** The `for_mode` to persist on the wire for a (duration, mode) pair: only
 *  "less_than" beside a non-zero duration survives — a zero/absent duration or
 *  the default "at_least" drops the field. The single source of truth for the
 *  three predicate inputs' `for_mode` normalisation. */
export function persistedForMode(
  dur: StateForDuration | null | undefined,
  mode: ForMode | null | undefined,
): "less_than" | undefined {
  return hasForDuration(dur) && mode === "less_than" ? "less_than" : undefined;
}

/** The comparator symbol for a `for` clause in summaries/labels: "<" for the
 *  "less than" maximum gate, "≥" for "at least" (the default). The frontend
 *  mirror of the backend `for_comparator_symbol`. */
export function forComparatorSymbol(mode: ForMode | null | undefined): "≥" | "<" {
  return mode === "less_than" ? "<" : "≥";
}

@customElement("ambience-for-duration")
export class AmbienceForDuration extends LitElement {
  static override styles = css`
    /* flex-wrap lets the mode dropdown + the h:m:s duration widget stack
       onto a second line on a narrow (mobile) column instead of spilling
       past the form's right edge; on a wide column they stay side-by-side. */
    :host { display: flex; flex-wrap: wrap; align-items: center; gap: 0.25rem; }
    .for-row { display: flex; gap: 0.25rem; align-items: center; }
    .for-row input[type='number'] { width: 3.5rem; }
    select.for-mode {
      padding: 0.25rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; background: var(--card-background-color, #fff);
      color: inherit;
    }
  `;

  @property({ attribute: false }) hass?: HassLike;
  @property({ attribute: false }) value: StateForDuration | null = null;
  @property({ attribute: false }) mode: ForMode = "at_least";

  // Memoised so ha-form sees a stable schema identity across re-renders and
  // doesn't re-initialise the mode dropdown mid-edit; rebuilt only when `hass`
  // changes (the option labels are localised off it).
  private _modeSchema?: HaFormSchema[];

  override willUpdate(changed: PropertyValues): void {
    if (changed.has("hass") || this._modeSchema === undefined) {
      this._modeSchema = [
        {
          name: "for_mode",
          required: true,
          selector: { select: { mode: "dropdown", options: this._modeOptions() } },
        },
      ];
    }
  }

  private get _d(): StateForDuration {
    return this.value ?? { h: 0, m: 0, s: 0 };
  }

  /** Emit the full payload (duration + mode) whenever either part changes. */
  private _emit(d: StateForDuration, mode: ForMode): void {
    this.value = d;
    this.mode = mode;
    emitValueChanged(this, { ...d, mode });
  }

  private _setDuration(d: StateForDuration): void {
    this._emit(d, this.mode);
  }

  private _setMode(mode: ForMode): void {
    this._emit(this._d, mode);
  }

  private _modeOptions(): { value: ForMode; label: string }[] {
    return [
      { value: "at_least", label: localize(this.hass, "ui.for_at_least", "at least") },
      { value: "less_than", label: localize(this.hass, "ui.for_less_than", "less than") },
    ];
  }

  private _renderMode() {
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      return html`<ha-form
        class="for-mode"
        .hass=${this.hass}
        .schema=${this._modeSchema}
        .data=${{ for_mode: this.mode }}
        .computeLabel=${() => ""}
        @value-changed=${(e: CustomEvent<{ value: { for_mode?: ForMode } }>) => {
          e.stopPropagation();
          if (e.detail.value.for_mode) this._setMode(e.detail.value.for_mode);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    const options = this._modeOptions();
    return html`<select
      class="for-mode"
      @change=${(e: Event) => this._setMode((e.target as HTMLSelectElement).value as ForMode)}
    >
      ${options.map(
        (o) =>
          html`<option value=${o.value} ?selected=${o.value === this.mode}>${o.label}</option>`,
      )}
    </select>`;
  }

  override render() {
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      const d = this._d;
      return html`${this._renderMode()}<ha-form
        data-field="for"
        .hass=${this.hass}
        .schema=${FOR_SCHEMA}
        .data=${{ duration: { hours: d.h, minutes: d.m, seconds: d.s } }}
        .computeLabel=${() => ""}
        @value-changed=${(
          e: CustomEvent<{
            value: { duration?: { hours?: number; minutes?: number; seconds?: number } };
          }>,
        ) => {
          e.stopPropagation();
          const v = e.detail.value.duration;
          this._setDuration({ h: v?.hours ?? 0, m: v?.minutes ?? 0, s: v?.seconds ?? 0 });
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    const d = this._d;
    // type=number's min="0" only constrains the spinner, not typed input, so
    // clamp to a non-negative integer — the backend `for` is {h,m,s}: ints >= 0.
    const cell = (part: "h" | "m" | "s") => html`<input type="number" min="0" step="1"
      .value=${String(d[part])}
      @change=${(e: Event) =>
        this._setDuration({
          ...d,
          [part]: Math.max(0, Math.trunc(Number((e.target as HTMLInputElement).value) || 0)),
        })} />`;
    return html`${this._renderMode()}<div class="for-row" data-field="for">
      ${cell("h")}<span>:</span>${cell("m")}<span>:</span>${cell("s")}
    </div>`;
  }
}
