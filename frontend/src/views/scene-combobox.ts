import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { HassConnection } from "../api.js";
import { watchHaComponents } from "../ha-components.js";
import { localize } from "../i18n.js";

type HaFormSchema = {
  name: string;
  selector: {
    select: {
      options: Array<{ value: string; label: string }>;
      custom_value: boolean;
      mode: "dropdown";
    };
  };
};

/**
 * Editable scene combobox.
 *
 * Primary path: HA's <ha-form> with a `select` selector and
 * `custom_value: true`. ha-form is registered eagerly in HA 2026.05+ and
 * internally picks whatever the current native combobox widget is (loading
 * any sub-components it needs). This is the official schema-driven path
 * recommended by HA's frontend docs, and works without depending on the
 * removed `loadCardHelpers` global.
 *
 * Fallback path (when ha-form is somehow not registered): a self-contained
 * Lit dropdown themed with HA CSS variables, so the panel stays usable.
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

  @property({ attribute: false }) hass?: HassConnection;
  @property() value: string | null = null;
  @property({ attribute: false }) suggestions: string[] = [];

  // Memoised so ha-form sees a stable reference until suggestions actually
  // change — avoids re-initialising the form on every parent re-render.
  @state() private _schema: HaFormSchema[] = [];

  @state() private _open = false;

  private _onDocMousedown = (e: MouseEvent) => {
    if (!this._open) return;
    if (e.composedPath().includes(this)) return;
    this._open = false;
  };

  override connectedCallback() {
    super.connectedCallback();
    watchHaComponents(this, this.hass);
    document.addEventListener("mousedown", this._onDocMousedown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("mousedown", this._onDocMousedown);
  }

  override willUpdate(changed: Map<string, unknown>) {
    if (changed.has("suggestions")) {
      this._schema = [
        {
          name: "scene",
          selector: {
            select: {
              options: this.suggestions.map((s) => ({ value: s, label: s })),
              custom_value: true,
              mode: "dropdown",
            },
          },
        },
      ];
    }
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

  // --- ha-form path --------------------------------------------------------

  /* v8 ignore next 8 -- ha-form is eagerly registered in HA 2026.05+, not in jsdom */
  private _onHaFormValueChanged = (
    e: CustomEvent<{ value: { scene?: string } }>,
  ) => {
    // ha-form also dispatches `value-changed`; stop it at our shadow
    // boundary and re-emit with the wildcard contract (empty → null).
    e.stopPropagation();
    const v = e.detail.value?.scene ?? "";
    this._emit(v.trim() === "" ? null : v);
  };

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

  // ha-form derives a field's displayed label via this callback. Without it,
  // the floating label inside the field shows the schema's raw `name`
  // ("scene") instead of a friendly human label.
  /* v8 ignore next 4 -- ha-form is eagerly registered in HA 2026.05+, not in jsdom */
  private _sceneComputeLabel = (schema: { name: string }): string => {
    if (schema.name === "scene") return localize(this.hass, "ui.scene_name", "Scene name");
    return schema.name;
  };

  // --- render --------------------------------------------------------------

  override render() {
    /* v8 ignore next 11 -- ha-form is eagerly registered in HA 2026.05+, not in jsdom */
    if (customElements.get("ha-form")) {
      const data = { scene: this.value ?? "" };
      return html`
        <ha-form
          .hass=${this.hass}
          .schema=${this._schema}
          .data=${data}
          .computeLabel=${this._sceneComputeLabel}
          @value-changed=${this._onHaFormValueChanged}
        ></ha-form>
      `;
    }
    // ha-form not registered (very old HA?). Render the self-contained
    // fallback dropdown.
    return html`
      <div class="control">
        <input
          type="text"
          placeholder=${localize(this.hass, "ui.scene_name", "Scene name")}
          .value=${this.value ?? ""}
          @input=${this._onInput}
          @focus=${this._onFocus}
          @keydown=${this._onKeyDown}
        />
        <button
          class="toggle"
          type="button"
          tabindex="-1"
          aria-label=${localize(this.hass, "ui.show_scene_suggestions", "Show scene suggestions")}
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
                    ${localize(this.hass, "ui.no_scenes_yet", "No scenes yet — type to create one")}
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
