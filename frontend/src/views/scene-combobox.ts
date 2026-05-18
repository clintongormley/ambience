import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

/**
 * Editable scene combobox: free-text input + dropdown of every scene name
 * already used in the area's rules. Typing a new name creates a new scene
 * (no constraint); clearing the field makes the rule "any scene".
 *
 * We rolled our own rather than wrapping HA's <ha-combo-box> because the
 * latter is lazy-loaded by HA and is often undefined in a custom panel's
 * context, rendering blank. This implementation is self-contained and
 * themed with HA's CSS custom properties.
 *
 * Emits `value-changed` with `{ value: string | null }` — null means "any".
 */
@customElement("ambience-scene-combobox")
export class AmbienceSceneCombobox extends LitElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
    }
    .control {
      display: flex;
      align-items: stretch;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
    }
    .control:focus-within {
      border-color: var(--primary-color, #03a9f4);
    }
    input {
      flex: 1;
      min-width: 0;
      padding: 0.5rem;
      border: 0;
      background: transparent;
      color: inherit;
      outline: none;
      font: inherit;
    }
    .toggle {
      background: transparent;
      border: 0;
      padding: 0 0.6rem;
      cursor: pointer;
      color: var(--secondary-text-color, #888);
      font-size: 0.7em;
      line-height: 1;
    }
    .menu {
      position: absolute;
      top: calc(100% + 2px);
      left: 0;
      right: 0;
      max-height: 14rem;
      overflow-y: auto;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      z-index: 10;
    }
    .item {
      padding: 0.5rem;
      cursor: pointer;
    }
    .item:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .item.selected {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
    }
    .empty {
      padding: 0.5rem;
      color: var(--secondary-text-color, #888);
      font-style: italic;
    }
  `;

  @property() value: string | null = null;
  @property({ attribute: false }) suggestions: string[] = [];

  @state() private _open = false;

  // Closes the menu when the user clicks anywhere outside this element.
  // Bound here so add/removeEventListener can find the same reference.
  private _onDocMousedown = (e: MouseEvent) => {
    if (!this._open) return;
    if (e.composedPath().includes(this)) return;
    this._open = false;
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("mousedown", this._onDocMousedown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("mousedown", this._onDocMousedown);
  }

  private _emit(value: string | null) {
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onInput(e: InputEvent) {
    const raw = (e.target as HTMLInputElement).value;
    this._emit(raw.trim() === "" ? null : raw);
    this._open = true;
  }

  private _onFocus() {
    this._open = true;
  }

  private _onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape" && this._open) {
      this._open = false;
      e.stopPropagation();
    }
  }

  private _toggle(e: Event) {
    // mousedown handler: preventDefault stops the input from blurring so
    // focus stays put when the user clicks the chevron.
    e.preventDefault();
    this._open = !this._open;
  }

  private _select(s: string, e: Event) {
    // mousedown handler: preventDefault keeps input focus and prevents
    // the click-after-render from firing on a missing target.
    e.preventDefault();
    this._emit(s);
    this._open = false;
  }

  override render() {
    return html`
      <div class="control">
        <input
          type="text"
          placeholder="(any scene)"
          .value=${this.value ?? ""}
          @input=${this._onInput}
          @focus=${this._onFocus}
          @keydown=${this._onKeyDown}
        />
        <button
          class="toggle"
          type="button"
          tabindex="-1"
          aria-label="Show scene suggestions"
          @mousedown=${this._toggle}
        >
          ▼
        </button>
      </div>
      ${this._open
        ? html`
            <div class="menu" role="listbox">
              ${this.suggestions.length === 0
                ? html`<div class="empty">
                    No scenes yet — type to create one
                  </div>`
                : this.suggestions.map(
                    (s) => html`
                      <div
                        class="item ${s === this.value ? "selected" : ""}"
                        role="option"
                        @mousedown=${(e: Event) => this._select(s, e)}
                      >
                        ${s}
                      </div>
                    `,
                  )}
            </div>
          `
        : ""}
    `;
  }
}
