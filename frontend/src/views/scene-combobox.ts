import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * Editable scene combobox. A free-text input backed by a native <datalist>
 * of suggestions (the scenes already named by the area's rules). Typing a
 * brand-new name is how a scene comes into existence; clearing the field is
 * how a rule becomes "any scene".
 *
 * Emits `value-changed` with `{ value: string | null }` — null means "any".
 */
@customElement("ambience-scene-combobox")
export class AmbienceSceneCombobox extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: inherit;
    }
  `;

  @property() value: string | null = null;
  @property({ attribute: false }) suggestions: string[] = [];

  // Unique per instance so multiple comboboxes on a page don't share a list.
  private readonly _listId = `scene-suggestions-${Math.random()
    .toString(36)
    .slice(2)}`;

  private _onInput(e: InputEvent) {
    const raw = (e.target as HTMLInputElement).value;
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: raw.trim() === "" ? null : raw },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <input
        type="text"
        list=${this._listId}
        placeholder="(any scene)"
        .value=${this.value ?? ""}
        @input=${this._onInput}
      />
      <datalist id=${this._listId}>
        ${this.suggestions.map((s) => html`<option value=${s}></option>`)}
      </datalist>
    `;
  }
}
