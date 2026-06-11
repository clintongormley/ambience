import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { HassConnection } from "../api.js";
import { emitValueChanged } from "../dom.js";
import { filterEntities, type HaTarget } from "../entities-for-scope.js";
import { watchHaComponents } from "../ha-components.js";
import { localize } from "../i18n.js";

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
  // Pre-scoped list of candidate entity_ids (already filtered by floor / area
  // / house). The picker intersects this with the HA service `target`
  // metadata via filterEntities, so the displayed list never offers an
  // entity that the service couldn't accept.
  @property({ attribute: false }) entities: string[] = [];
  @property({ attribute: false }) value: string[] = [];
  // HA target metadata, as returned by `ambience/services/get_schema`.
  // `null`/`undefined` → no service-level filtering (display all in-scope
  // entities).
  @property({ attribute: false }) target: HaTarget = null;
  // When set, used as the inner ha-form field label. Default " " (a single
  // space) is truthy but visually empty — without it, ha-form's entity
  // selector falls back to rendering the schema name ("entity_ids").
  @property() label = " ";

  /** Entities after intersecting the pre-scoped list with the HA target. */
  private _filteredEntities(): string[] {
    return filterEntities(this.entities, this.target);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    watchHaComponents(this);
  }

  private _emit(value: string[]) {
    emitValueChanged(this, value);
  }

  /* v8 ignore start -- ha-form not registered in jsdom */
  private _onHaFormChange(e: CustomEvent<{ value: { entity_ids: string[] } }>) {
    e.stopPropagation();
    this._emit(e.detail.value.entity_ids ?? []);
  }

  private _renderHaForm() {
    const entities = this._filteredEntities();
    const schema = [
      {
        name: "entity_ids",
        selector: {
          entity: {
            multiple: true,
            include_entities: entities,
          },
        },
      },
    ];
    const label = this.label;
    return html`
      <ha-form
        .hass=${this.hass}
        .schema=${schema}
        .data=${{ entity_ids: this.value }}
        .computeLabel=${() => label}
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
    this._emit(this._filteredEntities().filter((e) => set.has(e)));
  }

  private _renderFallback() {
    const entities = this._filteredEntities();
    if (entities.length === 0) {
      return html`<p class="empty">${localize(this.hass, "ui.no_matching_entities", "No matching entities in this area.")}</p>`;
    }
    return html`
      <div class="checkboxes">
        ${entities.map(
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
