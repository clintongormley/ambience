import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { HassConnection } from "../api.js";
import { emitValueChanged } from "../dom.js";
import type { HaFormSchema } from "../ha-form.js";
import { type HassLike, localize, luxLabel } from "../i18n.js";
import type { LuxPredicate, LuxQuant, LuxRangeStoreView } from "../types.js";
import { renderSelect, renderSensorField } from "./form-controls.js";
import { type StateObj, statesMap } from "./hass-states.js";
import { effectiveDefIds } from "./named-def-config.js";

const CUSTOM = "__custom__";

/**
 * Editor for a `lux` predicate: a numeric-sensor picker, a band selector
 * (a named lux range or "Custom range" with min/max inputs), and an Any/All
 * quantifier (shown only when more than one sensor is selected).
 *
 *   { sensors: sensor.*[]        // empty = match-anything
 *     range?: string             // a named lux range  (XOR min/max)
 *     min?: number, max?: number // inline half-open band [min, max)
 *     quant?: "any" | "all" }    // default "any"
 *
 * Mirrors `occupancy-predicate-input.ts` for the controls and emit pattern, and
 * `time-of-day-input.ts` for the named-range dropdown. Emits `value-changed`.
 */
/**
 * Localized error for a half-open lux band's numeric bounds — negative,
 * non-integer, or min >= max — or null if valid. The single source of these
 * rules for the frontend, shared by {@link luxPredicateError} (the save gate)
 * and the lux-range edit modal, so they (and the backend's `lux_not_integer` /
 * negative / order rules) can't drift.
 */
export function luxBoundsError(min: unknown, max: unknown, hass?: HassLike): string | null {
  if ((typeof min === "number" && min < 0) || (typeof max === "number" && max < 0)) {
    return localize(hass, "ui.lux_error_negative", "Bounds must be 0 or greater.");
  }
  if (
    (typeof min === "number" && !Number.isInteger(min)) ||
    (typeof max === "number" && !Number.isInteger(max))
  ) {
    return localize(hass, "ui.lux_error_not_integer", "Bounds must be whole numbers.");
  }
  if (typeof min === "number" && typeof max === "number" && min >= max) {
    return localize(hass, "ui.lux_error_order", "Min must be less than max.");
  }
  return null;
}

/**
 * Structural validity for a stored lux predicate (mirrors statePredicateError):
 * the widget only mounts when its slot is expanded, so the save gate needs a
 * pure check for never-opened slots. Returns a user-facing error or null.
 */
export function luxPredicateError(pred: unknown, hass?: HassConnection): string | null {
  if (pred == null || typeof pred !== "object") return null;
  const p = pred as { range?: unknown; min?: unknown; max?: unknown };
  if (typeof p.range === "string") return null; // named ranges validate server-side
  return luxBoundsError(p.min, p.max, hass);
}

/**
 * A sensor the lux condition can read: `conditions/lux.py` accepts any `sensor.*`
 * whose state parses as a finite number. Class/unit/state_class keep a sensor
 * listed while it is offline, when its state alone would not qualify it.
 */
export function isLuxCandidate(st: StateObj | undefined): boolean {
  if (!st) return false;
  const a = st.attributes ?? {};
  if (a.device_class === "illuminance" || a.unit_of_measurement === "lx") return true;
  if (a.state_class === "measurement") return true;
  return (
    typeof st.state === "string" && st.state.trim() !== "" && Number.isFinite(Number(st.state))
  );
}

@customElement("ambience-lux-input")
export class AmbienceLuxInput extends LitElement {
  static override styles = css`
    :host { display: block; }
    .row {
      display: flex; flex-wrap: wrap; align-items: center;
      gap: 0.5rem; margin-bottom: 0.6rem;
    }
    .label { color: var(--secondary-text-color, #888); font-size: 0.9em; }
    select, input[type="number"], input[type="text"] {
      padding: 0.25rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; background: var(--card-background-color, #fff);
      color: inherit;
    }
    .field { width: 100%; }
    .band-row input[type='number'] { width: 5rem; }
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) value: LuxPredicate | null = null;
  @property({ attribute: false }) luxRanges?: LuxRangeStoreView;

  // --- value round-trip ----------------------------------------------------

  private _cur(): LuxPredicate {
    return this.value ?? { sensors: [], range: this._defaultRangeId() };
  }

  private _sensors(): string[] {
    return this._cur().sensors ?? [];
  }

  /** The quant control only makes sense (and only differs) with >1 sensor. */
  _showQuant(): boolean {
    return this._sensors().length > 1;
  }

  /** Effective (visible) range ids: built-ins minus hidden, then custom-only.
   *  No display-order sort — lux ranges are stored in their natural order. */
  _effectiveRangeIds(): string[] {
    return effectiveDefIds(this.luxRanges);
  }

  private _defaultRangeId(): string {
    return this._effectiveRangeIds()[0] ?? "dark";
  }

  // Custom (inline-band) mode is exactly "no named range": switching to custom
  // clears `range`, switching to a named range clears min/max. Keying off `range`
  // alone (rather than also requiring a bound) keeps the user in custom mode when
  // they clear both min and max, instead of snapping back to a default range.
  private _isCustom(c: LuxPredicate): boolean {
    return c.range == null;
  }

  /** Build a clean predicate from the current value + overrides. The default
   *  quant ("any") is dropped to keep the wire format small; a predicate
   *  carries a named `range` XOR an inline `min`/`max` band. */
  private _build(over: Partial<LuxPredicate>): LuxPredicate {
    const merged = { ...this._cur(), ...over };
    const out: LuxPredicate = { sensors: merged.sensors ?? [] };
    // Mode is derived from the predicate shape itself: `range` set → named,
    // else an inline band. Setters that switch mode clear the other side.
    if (this._isCustom(merged)) {
      if (merged.min != null) out.min = merged.min;
      if (merged.max != null) out.max = merged.max;
    } else {
      out.range = merged.range ?? this._defaultRangeId();
    }
    if (merged.quant === "all") out.quant = "all";
    if (merged.negate === true) out.negate = true;
    return out;
  }

  private _emit(value: LuxPredicate | null) {
    this.value = value;
    emitValueChanged(this, value);
  }

  _setSensors(sensors: string[]) {
    // Clearing the picker drops the whole condition (empty sensors is a wildcard
    // regardless of the band), like the unavailable widget. Other edits keep
    // their partial predicate, so a band/bound chosen before a sensor is picked
    // isn't lost.
    this._emit(sensors.length ? this._build({ sensors }) : null);
  }

  _setQuant(quant: LuxQuant) {
    this._emit(this._build({ quant }));
  }

  _setNegate(negate: boolean) {
    this._emit(this._build({ negate }));
  }

  /** Band dropdown changed: a named range id, or CUSTOM to switch to min/max.
   *  Switching mode clears the other side so `_isCustom` reflects the choice. */
  _setBand(v: string) {
    if (v === CUSTOM) {
      const cur = this._cur();
      this._emit(this._build({ range: undefined, min: cur.min ?? 0, max: cur.max }));
    } else {
      this._emit(this._build({ range: v, min: undefined, max: undefined }));
    }
  }

  _setMin(min: number | undefined) {
    this._emit(this._build({ min }));
  }

  _setMax(max: number | undefined) {
    this._emit(this._build({ max }));
  }

  // --- schemas -------------------------------------------------------------

  /** HA's entity selector has no "numeric" filter, so the candidate list is
   *  computed from `hass.states` and passed as `include_entities`. The current
   *  selection is always unioned in, so a configured sensor that is missing or
   *  offline never silently vanishes from the picker; with no candidates at all
   *  the plain `sensor` selector is the fallback (an empty `include_entities`
   *  would offer nothing). */
  _sensorSchema(): HaFormSchema[] {
    const states = statesMap(this.hass);
    const ids = new Set(this._sensors());
    for (const [id, st] of Object.entries(states)) {
      if (id.startsWith("sensor.") && isLuxCandidate(st)) ids.add(id);
    }
    const entity: Record<string, unknown> = { domain: "sensor", multiple: true };
    if (ids.size) entity.include_entities = [...ids].sort();
    return [{ name: "sensors", selector: { entity } }];
  }

  // --- render --------------------------------------------------------------

  private _renderSensors() {
    return renderSensorField(
      this.hass,
      this._sensorSchema(),
      this._sensors(),
      "sensor.a, sensor.b",
      (ids) => this._setSensors(ids),
    );
  }

  private _renderBand(cur: LuxPredicate) {
    const custom = this._isCustom(cur);
    const options = [
      ...this._effectiveRangeIds().map((id) => ({
        value: id,
        label: luxLabel(this.hass, id, this.luxRanges?.custom ?? {}),
      })),
      { value: CUSTOM, label: localize(this.hass, "ui.custom_range", "Custom range") },
    ];
    const select = renderSelect(
      this.hass,
      "band",
      custom ? CUSTOM : (cur.range ?? this._defaultRangeId()),
      options,
      (v) => this._setBand(v),
    );
    if (!custom) return select;
    const num = (v: number | undefined) => (v == null ? "" : String(v));
    return html`${select}
      <span class="band-row" data-field="band-custom">
        <input
          type="number" min="0" step="1" data-field="min"
          placeholder=${localize(this.hass, "ui.lux_min_placeholder", "0")}
          .value=${num(cur.min)}
          @change=${(e: Event) => {
            const raw = (e.target as HTMLInputElement).value;
            this._setMin(raw === "" ? undefined : Number(raw));
          }}
        />
        <span>–</span>
        <input
          type="number" min="0" step="1" data-field="max"
          placeholder=${localize(this.hass, "ui.lux_max_placeholder", "∞")}
          .value=${num(cur.max)}
          @change=${(e: Event) => {
            const raw = (e.target as HTMLInputElement).value;
            this._setMax(raw === "" ? undefined : Number(raw));
          }}
        />
        <span class="label">lx</span>
      </span>`;
  }

  private _renderQuant(quant: LuxQuant) {
    return renderSelect(
      this.hass,
      "quant",
      quant,
      [
        { value: "any", label: localize(this.hass, "ui.lux_any", "Any of") },
        { value: "all", label: localize(this.hass, "ui.lux_all", "All of") },
      ],
      (v) => this._setQuant(v as LuxQuant),
    );
  }

  private _renderNegate(negate: boolean) {
    return renderSelect(
      this.hass,
      "negate",
      negate ? "is_not" : "is",
      [
        { value: "is", label: localize(this.hass, "ui.lux_is", "is") },
        { value: "is_not", label: localize(this.hass, "ui.lux_is_not", "is not") },
      ],
      (v) => this._setNegate(v === "is_not"),
    );
  }

  override render() {
    const cur = this._cur();
    const quant: LuxQuant = cur.quant === "all" ? "all" : "any";
    const negate = cur.negate === true;
    // Quant goes above the (full-width) sensor picker so the controls read
    // top-to-bottom as "Any of <these sensors> is <band>". It only shows with
    // 2+ sensors (where any/all actually differ).
    return html`
      ${this._showQuant() ? html`<div class="row">${this._renderQuant(quant)}</div>` : ""}
      <div class="row">${this._renderSensors()}</div>
      <div class="row">
        ${this._renderNegate(negate)}
        ${this._renderBand(cur)}
      </div>
    `;
  }
}
