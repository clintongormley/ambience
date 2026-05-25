import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { getKnownStates, type HassConnection } from "../api.js";
import { localize, stateOpLabel } from "../i18n.js";
import type { StateAtom, StateForDuration } from "../types.js";

type HaFormSchema = { name: string; required?: boolean; selector: Record<string, unknown> };

/**
 * Single atom of a state-predicate tree: entity + is/is_not + states +
 * optional `for` duration. Emits `value-changed` with the full atom.
 */
@customElement("ambience-state-expr-atom")
export class AmbienceStateExprAtom extends LitElement {
  static override styles = css`
    :host { display: block; }
    .row { display: flex; gap: 0.5rem; align-items: flex-end; margin-bottom: 0.4rem; }
    .row ha-form { flex: 1; }
    .row .entity-form { flex: 2; }
    .row .op-form { flex: 0.7; }
    .row .states-form { flex: 2; }
    /* Match the dropdown alignment treatment used by weather-predicate-input.ts:
       ha-form-select has a helper-text padding that ha-form-textfield doesn't,
       so the bottom underlines diverge unless dropdowns get a margin-bottom. */
    .row .entity-form,
    .row .op-form,
    .row .states-form { margin-bottom: 2rem; }
    .for-row, .attribute-row {
      display: flex; gap: 0.5rem; align-items: center; margin-top: 0.25rem;
    }
    .attribute-row input[type="text"] { flex: 1; max-width: 16rem; }
    .for-row label, .attribute-row label {
      display: inline-flex; align-items: center; gap: 0.35rem;
      font-size: 0.9em; color: var(--secondary-text-color, #888);
    }
    .for-row input[type='number'] {
      width: 4rem; padding: 0.25rem;
      border: 1px solid var(--divider-color, #ccc); border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: inherit; box-sizing: border-box;
    }
    /* jsdom-only native selects */
    select, input[type="text"] {
      padding: 0.25rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; background: var(--card-background-color, #fff);
      color: inherit;
    }
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) value: StateAtom = {
    kind: "is", entity_id: "", states: [],
  };

  @state() private _knownStates: string[] = [];

  override async updated(changed: Map<string, unknown>): Promise<void> {
    if (changed.has("value")) {
      const prev = changed.get("value") as StateAtom | undefined;
      const prevId = prev?.entity_id;
      const curId = this.value.entity_id;
      if (curId && curId !== prevId && this.hass) {
        try {
          const r = await getKnownStates(this.hass, curId);
          this._knownStates = r.states;
        } catch {
          this._knownStates = [];
        }
      }
    }
  }

  private _emit(next: StateAtom) {
    this.value = next;
    this.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: next }, bubbles: true, composed: true,
    }));
  }

  _setEntity(entity_id: string) {
    // Different entity → previously-selected states almost certainly don't
    // apply, and any attribute name was tied to the old entity's shape.
    this._emit({ ...this.value, entity_id, states: [], attribute: null });
  }

  _setAttributeEnabled(on: boolean) {
    // Enabling sets an empty attribute name so the field appears. Disabling
    // returns to comparing entity.state.
    this._emit({ ...this.value, attribute: on ? "" : null, states: [] });
  }

  _setAttribute(name: string) {
    this._emit({ ...this.value, attribute: name });
  }

  _setOp(op: "is" | "is_not") {
    this._emit({ ...this.value, kind: op });
  }

  _setStates(states: string[]) {
    this._emit({ ...this.value, states });
  }

  _setForEnabled(on: boolean) {
    const next = { ...this.value };
    next.for = on ? { h: 0, m: 0, s: 0 } : null;
    this._emit(next);
  }

  _setForDuration(dur: StateForDuration) {
    this._emit({ ...this.value, for: dur });
  }

  _entitySchema(): HaFormSchema[] {
    return [{ name: "entity_id", required: true, selector: { entity: {} } }];
  }

  _opSchema(): HaFormSchema[] {
    return [{
      name: "op",
      required: true,
      selector: {
        select: {
          mode: "dropdown",
          options: [
            { value: "is", label: stateOpLabel(this.hass, "is") },
            { value: "is_not", label: stateOpLabel(this.hass, "is_not") },
          ],
        },
      },
    }];
  }

  /** ha-form schema for the "for at least" duration field. HA's duration
   *  selector emits `{hours, minutes, seconds}` (and optionally `days`,
   *  which we disable). */
  _forSchema(): HaFormSchema[] {
    return [{
      name: "duration",
      required: true,
      selector: { duration: { enable_day: false } },
    }];
  }

  /** Map our storage `{h,m,s}` shape to ha-form's `{hours,minutes,seconds}`. */
  _forData(): { duration: { hours: number; minutes: number; seconds: number } } {
    const d = this.value.for ?? { h: 0, m: 0, s: 0 };
    return { duration: { hours: d.h, minutes: d.m, seconds: d.s } };
  }

  /** Translate ha-form's duration shape back into our storage shape. */
  _setForFromHaForm(d: { hours?: number; minutes?: number; seconds?: number } | undefined) {
    this._setForDuration({
      h: d?.hours ?? 0,
      m: d?.minutes ?? 0,
      s: d?.seconds ?? 0,
    });
  }

  _statesSchema(): HaFormSchema[] {
    return [{
      name: "states",
      required: true,
      selector: {
        select: {
          multiple: true,
          custom_value: true,
          mode: "dropdown",
          options: this._knownStates.map((s) => ({ value: s, label: s })),
        },
      },
    }];
  }

  private _renderEntity() {
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      return html`<ha-form
        class="entity-form"
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

  private _renderStates() {
    /* v8 ignore start */
    if (customElements.get("ha-form")) {
      return html`<ha-form
        class="states-form"
        data-field="states"
        .hass=${this.hass}
        .schema=${this._statesSchema()}
        .data=${{ states: this.value.states }}
        .computeLabel=${() => ""}
        @value-changed=${(e: CustomEvent<{ value: { states?: string[] } }>) => {
          e.stopPropagation();
          this._setStates(e.detail.value.states ?? []);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    return html`<select
      data-field="states"
      multiple
      @change=${(e: Event) => {
        const opts = (e.target as HTMLSelectElement).selectedOptions;
        const next = Array.from(opts).map((o) => o.value);
        this._setStates(next);
      }}>
      ${this._knownStates.map((s) => html`<option value=${s} ?selected=${this.value.states.includes(s)}>${s}</option>`)}
    </select>`;
  }

  private _renderForRow() {
    const d = this.value.for ?? null;
    const on = d !== null;
    return html`
      <div class="for-row">
        <label>
          <input type="checkbox" .checked=${on}
            @change=${(e: Event) => this._setForEnabled((e.target as HTMLInputElement).checked)} />
          ${localize(this.hass, "ui.for_at_least", "for at least")}
        </label>
        ${on ? this._renderForDuration(d!) : ""}
      </div>
    `;
  }

  private _renderForDuration(d: StateForDuration) {
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      return html`<ha-form
        class="for-form"
        data-field="for"
        .hass=${this.hass}
        .schema=${this._forSchema()}
        .data=${this._forData()}
        .computeLabel=${() => ""}
        @value-changed=${(e: CustomEvent<{ value: { duration?: { hours?: number; minutes?: number; seconds?: number } } }>) => {
          e.stopPropagation();
          this._setForFromHaForm(e.detail.value.duration);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    // jsdom fallback: three native number inputs (also useful for older HA).
    return html`
      <input type="number" min="0" .value=${String(d.h)}
        @change=${(e: Event) => this._setForDuration({ ...d, h: Number((e.target as HTMLInputElement).value) || 0 })} />
      <span>h</span>
      <input type="number" min="0" .value=${String(d.m)}
        @change=${(e: Event) => this._setForDuration({ ...d, m: Number((e.target as HTMLInputElement).value) || 0 })} />
      <span>m</span>
      <input type="number" min="0" .value=${String(d.s)}
        @change=${(e: Event) => this._setForDuration({ ...d, s: Number((e.target as HTMLInputElement).value) || 0 })} />
      <span>s</span>
    `;
  }

  private _renderAttributeRow() {
    const attr = this.value.attribute;
    const on = attr !== null && attr !== undefined;
    return html`
      <div class="attribute-row">
        <label>
          <input type="checkbox" .checked=${on}
            @change=${(e: Event) => this._setAttributeEnabled((e.target as HTMLInputElement).checked)} />
          ${localize(this.hass, "ui.state_compare_attribute", "Compare attribute")}
        </label>
        ${on ? html`
          <input
            type="text"
            data-field="attribute"
            placeholder=${localize(this.hass, "ui.state_attribute_placeholder", "e.g. source, brightness")}
            .value=${attr ?? ""}
            @change=${(e: Event) => this._setAttribute((e.target as HTMLInputElement).value)}
          />
        ` : ""}
      </div>
    `;
  }

  override render() {
    return html`
      <div class="row">
        ${this._renderEntity()}
        ${this._renderOp()}
        ${this._renderStates()}
      </div>
      ${this._renderAttributeRow()}
      ${this._renderForRow()}
    `;
  }
}
