import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { HassConnection } from "../api.js";
import { emitValueChanged } from "../dom.js";
import type { HaFormSchema } from "../ha-form.js";
import type { UnavailablePredicate } from "../types.js";
import { renderSensorField } from "./form-controls.js";

// Static schema, hoisted to module scope so `ha-form` sees a stable reference
// across re-renders (per the project's "memoise the schema" guidance) rather
// than a fresh array each render. `renderSensorField` hardcodes the internal
// form field name "sensors" (shared with the occupancy widget, whose predicate
// uses that key); we re-map the picked ids to `{ entities }` in `_setEntities`
// on emit, so the predicate's public shape stays `entities`.
const UNAVAILABLE_SCHEMA: HaFormSchema[] = [
  { name: "sensors", selector: { entity: { multiple: true } } },
];

/**
 * Editor for an `unavailable` predicate: a single any-domain entity multi-select.
 * Matches when ANY listed entity is unavailable/unknown/absent — the "block here
 * if any of these is down" guard. No is/is-not, quantifier, or `for` (single
 * mode by design).
 *
 *   { entities: string[] }   // at least one; any domain
 *
 * Emits `value-changed` with `{ value: UnavailablePredicate }`. `null` value =
 * not yet constrained; we render an empty picker and only emit on change.
 */
@customElement("ambience-unavailable-predicate-input")
export class AmbienceUnavailablePredicateInput extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.6rem;
    }
    .field {
      width: 100%;
    }
    input[type="text"] {
      padding: 0.25rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: inherit;
    }
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) value: UnavailablePredicate | null = null;

  _entities(): string[] {
    return this.value?.entities ?? [];
  }

  _setEntities(entities: string[]) {
    const next: UnavailablePredicate = { entities };
    this.value = next;
    emitValueChanged(this, next);
  }

  override render() {
    return html`
      <div class="row">
        ${renderSensorField(
          this.hass,
          UNAVAILABLE_SCHEMA,
          this._entities(),
          "binary_sensor.a, light.b",
          (ids) => this._setEntities(ids),
        )}
      </div>
    `;
  }
}
