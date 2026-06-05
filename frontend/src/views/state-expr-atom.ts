import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { getKnownAttributeValues, getKnownStates, type HassConnection } from "../api.js";
import { emitValueChanged } from "../dom.js";
import type { HaFormSchema } from "../ha-form.js";
import { localize, stateOpLabel } from "../i18n.js";
import type { StateAtom, StateForDuration } from "../types.js";
import { statesMap } from "./hass-states.js";

/** Minimal shape of an HA state object as read from `hass.states`. */
type StateObj = { state?: string; attributes?: Record<string, unknown> };

/** HA's snake_case → "Sentence case" attribute formatter, with the same
 *  acronym fixups HA applies. Used as a fallback when the running HA doesn't
 *  expose `hass.formatEntityAttributeName`. */
function formatAttributeName(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\bid\b/g, "ID")
    .replace(/\bip\b/g, "IP")
    .replace(/\bmac\b/g, "MAC")
    .replace(/\bgps\b/g, "GPS")
    .replace(/^\w/, (c) => c.toUpperCase());
}

/** Human-readable label for an attribute name. Prefers HA's own translation-
 *  aware formatter (so it matches the automation editor / more-info dialog),
 *  falling back to `formatAttributeName`. */
function attributeLabel(
  hass: HassConnection | undefined,
  stateObj: StateObj | undefined,
  attribute: string,
): string {
  const fmt = (
    hass as { formatEntityAttributeName?: (s: unknown, a: string) => string } | undefined
  )?.formatEntityAttributeName;
  if (fmt && stateObj) {
    const label = fmt(stateObj, attribute);
    if (label) return label;
  }
  return formatAttributeName(attribute);
}

/**
 * Single atom of a state-predicate tree, laid out like HA's automation State
 * condition: Entity / Attribute (optional) / Op + values / For (optional).
 *
 * Storage cleanup: emitted values are normalised so that
 *  - `attribute === ""`  → `attribute: null` (compare entity state)
 *  - `for === {h:0,m:0,s:0}` → `for: null` (no duration constraint)
 *
 * Values are stored as `string[]` and rendered one per row, with a trailing
 * empty row that acts as the "add another" affordance.
 */
@customElement("ambience-state-expr-atom")
export class AmbienceStateExprAtom extends LitElement {
  static override styles = css`
    :host { display: block; }
    .field { margin-bottom: 0.6rem; }
    .field-label {
      display: block;
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
      margin-bottom: 0.25rem;
    }
    .field ha-form { width: 100%; }
    .op-row { display: flex; gap: 0.5rem; align-items: flex-end; }
    .op-row .op-form { flex: 0 0 auto; min-width: 8rem; }
    .op-row .op-label { flex: 1; }
    /* HA-form-select carries extra bottom padding (helper-text slot) that
       smaller widgets lack. Lift the op so its underline matches. */
    .op-row .op-form { margin-bottom: 2rem; }
    /* Where + Comparison on one line. Where takes the wider share since
       it shows attribute names; Comparison is a short word/symbol. */
    .where-op-row { display: flex; gap: 0.5rem; align-items: flex-start; }
    .where-op-row .where-cell { flex: 2; min-width: 0; }
    .where-op-row .op-cell { flex: 1; min-width: 0; }
    .value-list { display: flex; flex-direction: column; gap: 0.4rem; }
    .value-row { display: flex; gap: 0.5rem; align-items: center; }
    .value-row ha-form { flex: 1; }
    /* jsdom-only native fallbacks */
    select, input[type="text"], input[type="number"] {
      padding: 0.25rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; background: var(--card-background-color, #fff);
      color: inherit;
    }
    .for-row { display: flex; gap: 0.25rem; align-items: center; }
    .for-row input[type='number'] { width: 3.5rem; }
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) value: StateAtom = {
    kind: "is",
    entity_id: "",
    states: [],
  };

  @state() private _knownStates: string[] = [];
  @state() private _knownAttributeValues: string[] = [];

  override async updated(changed: Map<string, unknown>): Promise<void> {
    if (!changed.has("value")) return;
    const prev = changed.get("value") as StateAtom | undefined;
    const curId = this.value.entity_id;
    if (curId && curId !== prev?.entity_id && this.hass) {
      try {
        this._knownStates = (await getKnownStates(this.hass, curId)).states;
      } catch {
        this._knownStates = [];
      }
    }
    // Attribute values are fetched from the backend (single source of truth with
    // known states) whenever the entity or the chosen attribute changes.
    const attr = this.value.attribute;
    if (curId !== prev?.entity_id || attr !== prev?.attribute) {
      if (curId && attr && this.hass) {
        try {
          this._knownAttributeValues = (
            await getKnownAttributeValues(this.hass, curId, attr)
          ).values;
        } catch {
          this._knownAttributeValues = [];
        }
      } else if (this._knownAttributeValues.length) {
        this._knownAttributeValues = [];
      }
    }
  }

  /** Tidy the atom shape before emitting so the wire format stays small. */
  private _normalize(atom: StateAtom): StateAtom {
    const out: StateAtom = { ...atom };
    if (out.attribute === "") out.attribute = null;
    if (out.for && out.for.h === 0 && out.for.m === 0 && out.for.s === 0) {
      out.for = null;
    }
    return out;
  }

  private _emit(next: StateAtom) {
    const normalized = this._normalize(next);
    this.value = normalized;
    emitValueChanged(this, normalized);
  }

  /** Keep the op type in step with the target type: numeric targets use a
   *  numeric op (>, ≥, <, ≤); non-numeric targets use is/is_not. Defaults
   *  to `>` and `is` respectively. */
  private _autoFlipOp(next: StateAtom): StateAtom {
    const numericTarget = this._isNumericTargetFor(next);
    const numericOp = this._isNumericOp(next.kind);
    if (numericTarget && !numericOp) return { ...next, kind: ">" };
    if (!numericTarget && numericOp) return { ...next, kind: "is" };
    return next;
  }

  _setEntity(entity_id: string) {
    // Different entity → previously-selected values almost certainly don't
    // apply, and the attribute name was tied to the old entity's shape.
    this._emit(this._autoFlipOp({ ...this.value, entity_id, states: [], attribute: null }));
  }

  _setAttribute(name: string) {
    this._emit(this._autoFlipOp({ ...this.value, attribute: name }));
  }

  _setOp(op: "is" | "is_not") {
    this._emit({ ...this.value, kind: op });
  }

  _setStates(states: string[]) {
    this._emit({ ...this.value, states });
  }

  /** Replace the value at `idx`. For is/is_not, an empty string removes the
   *  row (the user cleared the input). For numeric ops, there's always
   *  exactly one slot, so clearing just empties it. */
  _setValueAt(idx: number, v: string) {
    if (this._isNumericOp(this.value.kind)) {
      this._setStates([v]);
      return;
    }
    const next = this.value.states.slice();
    if (v === "") {
      next.splice(idx, 1);
    } else {
      next[idx] = v;
    }
    this._setStates(next);
  }

  _addValue(v: string) {
    if (!v) return;
    this._setStates([...this.value.states, v]);
  }

  _removeValueAt(idx: number) {
    const next = this.value.states.slice();
    next.splice(idx, 1);
    this._setStates(next);
  }

  _setForDuration(dur: StateForDuration | null) {
    this._emit({ ...this.value, for: dur });
  }

  // --- schemas ----------------------------------------------------------

  _entitySchema(): HaFormSchema[] {
    return [{ name: "entity_id", required: true, selector: { entity: {} } }];
  }

  /** Best-effort list of attributes for the chosen entity, read from
   *  `hass.states[entity_id].attributes`. Returns [] when the entity is
   *  unset or not in hass.states. */
  private _knownAttributesFor(entity_id: string): string[] {
    if (!entity_id) return [];
    const attrs = statesMap(this.hass)[entity_id]?.attributes;
    if (!attrs) return [];
    return Object.keys(attrs).sort();
  }

  /** ha-form select doesn't render value="" as a selectable item, so we
   *  use a non-empty sentinel for the "compare entity.state" option and
   *  translate it back to `null` on emit (and to the sentinel when
   *  populating `data`). With `custom_value: true`, ha-form displays the
   *  raw value in the input box — so the sentinel is the literal word
   *  "State" rather than a magic key, making the displayed text match
   *  the user's expectation. */
  private static readonly _STATE_SENTINEL = "State";

  /** Dropdown of "Where to look": first option is the State sentinel; the
   *  rest are the entity's known attributes. custom_value: true so the
   *  user can still type an attribute name we don't know about. */
  _attributeSchema(): HaFormSchema[] {
    const attrs = this._knownAttributesFor(this.value.entity_id);
    const stateObj = statesMap(this.hass)[this.value.entity_id] as StateObj | undefined;
    return [
      {
        name: "attribute",
        selector: {
          select: {
            mode: "dropdown",
            custom_value: true,
            // Sentinel value and label are both the literal word 'State' so
            // ha-form's custom_value combobox displays "State" rather than an
            // internal key.
            options: [
              {
                value: AmbienceStateExprAtom._STATE_SENTINEL,
                label: AmbienceStateExprAtom._STATE_SENTINEL,
              },
              // Value stays the raw attribute key (storage); the label is
              // humanised so the dropdown reads like the automation editor.
              ...attrs.map((a) => ({ value: a, label: attributeLabel(this.hass, stateObj, a) })),
            ],
          },
        },
      },
    ];
  }

  /** Translate storage (`attribute: null | ""` or string) to the ha-form
   *  dropdown's data shape (sentinel for state-mode, otherwise the
   *  attribute name verbatim). */
  _attributeData(): { attribute: string } {
    const attr = this.value.attribute;
    if (!attr) return { attribute: AmbienceStateExprAtom._STATE_SENTINEL };
    return { attribute: attr };
  }

  /** Inverse of `_attributeData`: ha-form emits the sentinel for the
   *  State option; we translate back to "" so `_normalize` stores null. */
  _setAttributeFromHaForm(v: string) {
    if (v === AmbienceStateExprAtom._STATE_SENTINEL) {
      this._setAttribute("");
    } else {
      this._setAttribute(v);
    }
  }

  private static readonly _NUMERIC_OPS = [">", ">=", "<", "<="] as const;

  private _isNumericOp(kind: string): boolean {
    return (AmbienceStateExprAtom._NUMERIC_OPS as readonly string[]).includes(kind);
  }

  /** Does the current target (entity.state or entity.attributes[x]) hold
   *  a value we'd compare numerically? */
  private _isNumericTargetFor(atom: StateAtom): boolean {
    const entity = statesMap(this.hass)[atom.entity_id];
    if (!entity) return false;
    if (atom.attribute) {
      return typeof entity.attributes?.[atom.attribute] === "number";
    }
    const s = entity.state;
    if (typeof s !== "string") return false;
    if (s === "" || s === "unknown" || s === "unavailable") return false;
    return Number.isFinite(Number(s));
  }

  _opSchema(): HaFormSchema[] {
    // A numeric target only offers numeric ops — is/is_not don't compare
    // ordered values cleanly. A non-numeric target only offers is/is_not.
    const ops: string[] = this._isNumericTargetFor(this.value)
      ? [...AmbienceStateExprAtom._NUMERIC_OPS]
      : ["is", "is_not"];
    // Defensive: always include the currently-selected op so the dropdown
    // never shows a blank value (e.g. the entity is briefly unavailable
    // and the inferred set excludes the current kind).
    if (!ops.includes(this.value.kind)) ops.push(this.value.kind);
    return [
      {
        name: "op",
        required: true,
        selector: {
          select: {
            mode: "dropdown",
            options: ops.map((op) => ({
              value: op,
              label: stateOpLabel(this.hass, op),
            })),
          },
        },
      },
    ];
  }

  /** ha-form schema for a single value row.
   *    Numeric ops      → number selector.
   *    Attribute mode   → combobox seeded with the attribute's possible values
   *                       (fetched from the backend, like the automation
   *                       editor); custom_value lets the user type others.
   *    State mode       → combobox seeded with the entity's known states. */
  _valueSchema(): HaFormSchema[] {
    if (this._isNumericOp(this.value.kind)) {
      return [
        {
          name: "value",
          selector: { number: { mode: "box", step: "any" } },
        },
      ];
    }
    let options: string[];
    if (this.value.attribute) {
      // Possible values come from the backend (single source of truth with the
      // known-states list), already including the current value.
      options = this._knownAttributeValues;
    } else {
      options = this._knownStates;
    }
    return [
      {
        name: "value",
        selector: {
          select: {
            mode: "dropdown",
            custom_value: true,
            options: options.map((s) => ({ value: s, label: s })),
          },
        },
      },
    ];
  }

  /** ha-form schema for the optional "for" duration. Blank by default; we
   *  treat `{h:0,m:0,s:0}` as null on the way out via _normalize. */
  _forSchema(): HaFormSchema[] {
    return [
      {
        name: "duration",
        selector: { duration: { enable_day: false } },
      },
    ];
  }

  /** Storage `{h,m,s}` → ha-form `{hours,minutes,seconds}`. */
  _forData(): { duration: { hours: number; minutes: number; seconds: number } } {
    const d = this.value.for ?? { h: 0, m: 0, s: 0 };
    return { duration: { hours: d.h, minutes: d.m, seconds: d.s } };
  }

  _setForFromHaForm(d: { hours?: number; minutes?: number; seconds?: number } | undefined) {
    this._setForDuration({
      h: d?.hours ?? 0,
      m: d?.minutes ?? 0,
      s: d?.seconds ?? 0,
    });
  }

  // --- render -----------------------------------------------------------

  private _renderEntity() {
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      return html`<ha-form
        data-field="entity"
        .hass=${this.hass}
        .schema=${this._entitySchema()}
        .data=${{ entity_id: this.value.entity_id }}
        .computeLabel=${() => ""}
        @value-changed=${(e: CustomEvent<{ value: { entity_id?: string } }>) => {
          e.stopPropagation();
          this._setEntity(e.detail.value.entity_id ?? "");
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    return html`<input
      data-field="entity"
      type="text"
      .value=${this.value.entity_id}
      @change=${(e: Event) => this._setEntity((e.target as HTMLInputElement).value)}
    />`;
  }

  private _renderAttribute() {
    const attr = this.value.attribute ?? "";
    /* v8 ignore start */
    if (customElements.get("ha-form")) {
      return html`<ha-form
        data-field="attribute"
        .hass=${this.hass}
        .schema=${this._attributeSchema()}
        .data=${this._attributeData()}
        .computeLabel=${() => ""}
        @value-changed=${(e: CustomEvent<{ value: { attribute?: string } }>) => {
          e.stopPropagation();
          this._setAttributeFromHaForm(e.detail.value.attribute ?? "");
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    return html`<input
      data-field="attribute"
      type="text"
      placeholder=${localize(this.hass, "ui.state_attribute_placeholder", "leave blank to compare state")}
      .value=${attr}
      @change=${(e: Event) => this._setAttribute((e.target as HTMLInputElement).value)}
    />`;
  }

  private _renderOp() {
    /* v8 ignore start */
    if (customElements.get("ha-form")) {
      return html`<ha-form
        class="op-form"
        data-field="op"
        .hass=${this.hass}
        .schema=${this._opSchema()}
        .data=${{ op: this.value.kind }}
        .computeLabel=${() => ""}
        @value-changed=${(e: CustomEvent<{ value: { op?: "is" | "is_not" } }>) => {
          e.stopPropagation();
          const op = e.detail.value.op;
          if (op) this._setOp(op);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    return html`<select
      data-field="op"
      @change=${(e: Event) => this._setOp((e.target as HTMLSelectElement).value as "is" | "is_not")}>
      <option value="is" ?selected=${this.value.kind === "is"}>is</option>
      <option value="is_not" ?selected=${this.value.kind === "is_not"}>is not</option>
    </select>`;
  }

  /** A single state-value row. Clearing the ha-form select to empty (its
   *  built-in X button) triggers `_setValueAt(idx, "")`, which removes the
   *  row — so no wrapper ✕ is needed. */
  private _renderValueRow(value: string, idx: number) {
    const isAddRow = idx === -1;
    const onChange = isAddRow
      ? (v: string) => this._addValue(v)
      : (v: string) => this._setValueAt(idx, v);
    const isNumeric = this._isNumericOp(this.value.kind);
    // ha-form's number selector wants a number in `data` and emits a number
    // in the change event; we store the threshold as a string for wire-
    // format consistency, so we coerce at the boundary.
    const data: Record<string, unknown> = isNumeric
      ? { value: value === "" ? undefined : Number(value) }
      : { value };
    /* v8 ignore start */
    if (customElements.get("ha-form")) {
      return html`
        <div class="value-row" data-row=${idx}>
          <ha-form
            .hass=${this.hass}
            .schema=${this._valueSchema()}
            .data=${data}
            .computeLabel=${() => ""}
            @value-changed=${(e: CustomEvent<{ value: { value?: string | number } }>) => {
              e.stopPropagation();
              const v = e.detail.value.value;
              onChange(v === undefined || v === null ? "" : String(v));
            }}
          ></ha-form>
        </div>
      `;
    }
    /* v8 ignore stop */
    return html`
      <div class="value-row" data-row=${idx}>
        <input type=${isNumeric ? "number" : "text"} .value=${value}
          placeholder=${isAddRow ? localize(this.hass, "ui.state_add_value", "+ Add state") : ""}
          @change=${(e: Event) => onChange((e.target as HTMLInputElement).value)} />
      </div>
    `;
  }

  private _renderForRow() {
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      return html`<ha-form
        data-field="for"
        .hass=${this.hass}
        .schema=${this._forSchema()}
        .data=${this._forData()}
        .computeLabel=${() => ""}
        @value-changed=${(
          e: CustomEvent<{
            value: { duration?: { hours?: number; minutes?: number; seconds?: number } };
          }>,
        ) => {
          e.stopPropagation();
          this._setForFromHaForm(e.detail.value.duration);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    const d = this.value.for ?? { h: 0, m: 0, s: 0 };
    return html`
      <div class="for-row" data-field="for">
        <input type="number" min="0" .value=${String(d.h)}
          @change=${(e: Event) => this._setForDuration({ ...d, h: Number((e.target as HTMLInputElement).value) || 0 })} />
        <span>:</span>
        <input type="number" min="0" .value=${String(d.m)}
          @change=${(e: Event) => this._setForDuration({ ...d, m: Number((e.target as HTMLInputElement).value) || 0 })} />
        <span>:</span>
        <input type="number" min="0" .value=${String(d.s)}
          @change=${(e: Event) => this._setForDuration({ ...d, s: Number((e.target as HTMLInputElement).value) || 0 })} />
      </div>
    `;
  }

  override render() {
    return html`
      <section class="field">
        <label class="field-label">${localize(this.hass, "ui.state_entity", "Entity")}</label>
        ${this._renderEntity()}
      </section>
      <section class="field where-op-row">
        <div class="where-cell">
          <label class="field-label">${localize(this.hass, "ui.state_where", "Where")}</label>
          ${this._renderAttribute()}
        </div>
        <div class="op-cell">
          <label class="field-label">${localize(this.hass, "ui.state_op_header", "Comparison")}</label>
          ${this._renderOp()}
        </div>
      </section>
      <section class="field">
        <label class="field-label">
          ${localize(this.hass, "ui.state_value_label", "Value")}
        </label>
        <div class="value-list">
          ${
            this._isNumericOp(this.value.kind)
              ? this._renderValueRow(this.value.states[0] ?? "", 0)
              : html`
                ${this.value.states.map((v, i) => this._renderValueRow(v, i))}
                ${this._renderValueRow("", -1)}
              `
          }
        </div>
      </section>
      <section class="field">
        <label class="field-label">${localize(this.hass, "ui.state_for", "For (optional)")}</label>
        ${this._renderForRow()}
      </section>
    `;
  }
}
