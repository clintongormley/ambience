import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { HaComponentsController } from "../ha-components.js";

/**
 * Editable scene combobox.
 *
 * Primary path: wraps HA's <ha-combo-box> (force-loaded via
 * `ensureHaComponents`) for native HA-themed styling and a real selector
 * dropdown of every scene already named by the area's rules. Supports typing
 * a brand-new scene name (allow-custom-value). Clearing the field makes the
 * rule "any scene".
 *
 * Fallback path (when HA's lazy form chunk fails to load): a self-contained
 * Lit dropdown with the same behaviour, themed via HA CSS custom properties.
 * The fallback exists because, in some HA versions/contexts, our loader
 * cannot pull ha-combo-box into the registry — the panel should still work.
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
    .placeholder {
      padding: 0.6rem 0.75rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      color: var(--secondary-text-color, #888);
      font-style: italic;
    }
    /* Fallback dropdown */
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

  private _ha = new HaComponentsController(this);

  @state() private _open = false;

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

  // --- ha-combo-box path ---------------------------------------------------

  private _onHaValueChanged(e: CustomEvent<{ value: string }>) {
    // ha-combo-box also dispatches `value-changed`; stop it at our shadow
    // boundary and re-emit with the wildcard contract (empty → null).
    e.stopPropagation();
    const v = e.detail.value;
    this._emit(v === "" ? null : v);
  }

  // --- fallback dropdown path ---------------------------------------------

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
    e.preventDefault();
    this._open = !this._open;
  }

  private _select(s: string, e: Event) {
    e.preventDefault();
    this._emit(s);
    this._open = false;
  }

  // --- render --------------------------------------------------------------

  override render() {
    if (this._ha.state === "loading") {
      return html`<div class="placeholder">Loading scene picker…</div>`;
    }
    if (this._ha.state === "ready") {
      const items = this.suggestions.map((s) => ({ value: s, label: s }));
      return html`
        <ha-combo-box
          .items=${items}
          .value=${this.value ?? ""}
          item-value-path="value"
          item-label-path="label"
          placeholder="(any scene)"
          allow-custom-value
          @value-changed=${this._onHaValueChanged}
        ></ha-combo-box>
      `;
    }
    // Failed — render the self-contained fallback dropdown.
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
