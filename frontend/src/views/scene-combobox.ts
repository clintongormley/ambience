import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * Editable scene combobox. Wraps HA's globally-registered <ha-combo-box>
 * so the dropdown shows every scene already named by the area's rules in
 * HA's native selector styling, and supports typing a brand-new name
 * (allow-custom-value). Clearing the field makes the rule "any scene".
 *
 * Emits `value-changed` with `{ value: string | null }` — null means "any".
 */
@customElement("ambience-scene-combobox")
export class AmbienceSceneCombobox extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
  `;

  @property() value: string | null = null;
  @property({ attribute: false }) suggestions: string[] = [];

  private _onValueChanged(e: CustomEvent<{ value: string }>) {
    // ha-combo-box dispatches its own `value-changed`; stop it at our shadow
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
