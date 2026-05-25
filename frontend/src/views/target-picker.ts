import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import { watchHaComponents } from "../ha-components.js";
import { localize } from "../i18n.js";
import type { HassConnection } from "../api.js";

/**
 * Target picker: ha-form's entity selector when ha-form is registered,
 * Lit checkbox-list fallback otherwise.
 *
 * Emits `value-changed` with `{ value: string[] }`.
 */
@customElement("ambience-target-picker")
export class AmbienceTargetPicker extends LitElement {
  static override styles = css`
    :host { display: block; }
    .empty {
      color: var(--secondary-text-color, #888);
      font-style: italic;
      padding: 0.5rem 0;
    }
    .checkboxes {
      display: flex; flex-direction: column; gap: 0.25rem;
      padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
    }
    label {
      display: flex; align-items: center; gap: 0.5rem;
      cursor: pointer;
      padding: 0.25rem;
    }
    label:hover { background: var(--secondary-background-color, #f5f5f5); }
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) entities: string[] = [];
  @property({ attribute: false }) value: string[] = [];

  override connectedCallback(): void {
    super.connectedCallback();
    watchHaComponents(this, this.hass);
  }

  private _emit(value: string[]) {
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /* v8 ignore start -- ha-form not registered in jsdom */
  private _onHaFormChange(e: CustomEvent<{ value: { entity_ids: string[] } }>) {
    e.stopPropagation();
    this._emit(e.detail.value.entity_ids ?? []);
  }

  private _renderHaForm() {
    const schema = [
      {
        name: "entity_ids",
        selector: {
          entity: {
            multiple: true,
            include_entities: this.entities,
          },
        },
      },
    ];
    // `.computeLabel` returning empty suppresses ha-form's per-field label
    // (the outer "Target" label in rule-editor is enough). Setting
    // `label: ""` on the schema doesn't suppress it — ha-form falls back to
    // rendering the field NAME ("entity_ids"), which is what the user was
    // seeing.
    return html`
      <ha-form
        .hass=${this.hass}
        .schema=${schema}
        .data=${{ entity_ids: this.value }}
        .computeLabel=${() => ""}
        @value-changed=${this._onHaFormChange}
      ></ha-form>
    `;
  }
  /* v8 ignore stop */

  private _toggle(entity_id: string, checked: boolean) {
    const set = new Set(this.value);
    if (checked) set.add(entity_id);
    else set.delete(entity_id);
    // Preserve the canonical sorted order of `entities` in the emitted value.
    this._emit(this.entities.filter((e) => set.has(e)));
  }

  private _renderFallback() {
    if (this.entities.length === 0) {
      return html`<p class="empty">${localize(this.hass, "ui.no_matching_entities", "No matching entities in this area.")}</p>`;
    }
    return html`
      <div class="checkboxes">
        ${this.entities.map(
          (entity_id) => html`
            <label>
              <input
                type="checkbox"
                .checked=${this.value.includes(entity_id)}
                @change=${(e: Event) =>
                  this._toggle(entity_id, (e.target as HTMLInputElement).checked)}
              />
              ${entity_id}
            </label>
          `,
        )}
      </div>
    `;
  }

  override render() {
    /* v8 ignore next -- ha-form not registered in jsdom; coverage branch */
    if (customElements.get("ha-form")) return this._renderHaForm();
    return this._renderFallback();
  }
}
