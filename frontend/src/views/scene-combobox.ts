import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import { HaComponentsController } from "../ha-components.js";

/**
 * Editable scene combobox. Wraps HA's <ha-combo-box> (force-loaded via
 * `ensureHaComponents`) so the dropdown shows every scene already named by
 * the area's rules with full HA theme styling, and supports typing a brand-new
 * name via `allow-custom-value`. Clearing the field makes the rule "any scene".
 *
 * Emits `value-changed` with `{ value: string | null }` — null means "any".
 */
@customElement("ambience-scene-combobox")
export class AmbienceSceneCombobox extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    .placeholder {
      padding: 0.6rem 0.75rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      color: var(--secondary-text-color, #888);
      font-style: italic;
    }
    .placeholder.error {
      color: var(--error-color, #d32f2f);
      font-style: normal;
    }
  `;

  @property() value: string | null = null;
  @property({ attribute: false }) suggestions: string[] = [];

  private _ha = new HaComponentsController(this);

  private _onValueChanged(e: CustomEvent<{ value: string }>) {
    // ha-combo-box also dispatches `value-changed`; stop it at our shadow
    // boundary and re-emit with the wildcard contract (empty string → null).
    e.stopPropagation();
    const v = e.detail.value;
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: v === "" ? null : v },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    if (!this._ha.ready) {
      return html`<div class="placeholder">Loading scene picker…</div>`;
    }
    const items = this.suggestions.map((s) => ({ value: s, label: s }));
    return html`
      <ha-combo-box
        .items=${items}
        .value=${this.value ?? ""}
        item-value-path="value"
        item-label-path="label"
        placeholder="(any scene)"
        allow-custom-value
        @value-changed=${this._onValueChanged}
      ></ha-combo-box>
    `;
  }
}
