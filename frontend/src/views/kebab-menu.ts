import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { localize } from "../i18n";

export interface KebabItem {
  /** Returned to the caller via the `menu-action` event. */
  id: string;
  /** Already-localized display text. */
  label: string;
  /** mdi icon name, e.g. "mdi:delete". */
  icon: string;
  /** Render in the error colour (e.g. Delete). */
  danger?: boolean;
  /** Render a separator above this item. */
  dividerBefore?: boolean;
}

/**
 * A self-contained three-dots overflow menu. Renders a themed popup (with a
 * backdrop catcher and Escape-to-close, mirroring the category-filter popup in
 * scopes-view) and emits a bubbling, composed `menu-action` CustomEvent with
 * { id } when an item is selected. Deliberately does NOT depend on any HA menu
 * component — `ha-button-menu` was removed from HA in 2026.02, so a self-
 * contained widget keeps this stable across HA versions.
 */
@customElement("ambience-kebab-menu")
export class AmbienceKebabMenu extends LitElement {
  @property({ attribute: false }) items: KebabItem[] = [];
  @property({ attribute: false }) hass?: { localize?: (k: string) => string | undefined; [key: string]: unknown };
  /** Overrides the trigger aria-label (default "More actions"). */
  @property() label?: string;

  @state() private _open = false;

  static override styles = css`
    :host { position: relative; display: inline-flex; flex: 0 0 auto; }
    .kebab-trigger {
      display: inline-flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; padding: 0;
      border: 0; border-radius: 50%; background: none;
      color: var(--kebab-trigger-color, var(--secondary-text-color, #888));
      cursor: pointer; font: inherit;
    }
    .kebab-trigger:hover { background: var(--secondary-background-color, #f5f5f5); }
    .kebab-backdrop { position: fixed; inset: 0; z-index: 10; }
    .kebab-menu {
      position: absolute; top: calc(100% + 4px); right: 0; z-index: 11;
      min-width: 12rem; max-height: 60vh; overflow-y: auto;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0); border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
      padding: 0.35rem;
    }
    .kebab-item {
      display: flex; align-items: center; gap: 0.75rem; width: 100%;
      min-height: 44px; box-sizing: border-box;
      padding: 0.4rem 0.75rem; border: 0; border-radius: 6px;
      background: none; color: var(--primary-text-color, #212121);
      cursor: pointer; font: inherit; font-size: 1rem; text-align: left;
    }
    .kebab-item:hover { background: var(--secondary-background-color, #f5f5f5); }
    .kebab-item.danger { color: var(--error-color, #db4437); }
    .kebab-item ha-icon { color: inherit; flex: 0 0 auto; }
    .kebab-divider {
      height: 1px; margin: 0.35rem 0;
      background: var(--divider-color, #e0e0e0);
    }
  `;

  private _triggerLabel(): string {
    return this.label ?? localize(this.hass, "ui.more_actions", "More actions");
  }

  private _select(id: string, e: Event) {
    e.stopPropagation();
    this._open = false;
    this.dispatchEvent(
      new CustomEvent("menu-action", { detail: { id }, bubbles: true, composed: true }),
    );
  }

  private _renderItems() {
    return this.items.map(
      (item) => html`
        ${item.dividerBefore
          ? html`<div class="kebab-divider" role="separator"></div>`
          : nothing}
        <button
          class="kebab-item ${item.danger ? "danger" : ""}"
          role="menuitem"
          data-action=${item.id}
          @click=${(e: Event) => this._select(item.id, e)}
        >
          <ha-icon icon=${item.icon}></ha-icon>
          <span class="kebab-label">${item.label}</span>
        </button>
      `,
    );
  }

  private _renderTrigger(expanded: boolean) {
    return html`
      <button
        class="kebab-trigger"
        aria-label=${this._triggerLabel()}
        aria-haspopup="menu"
        aria-expanded=${expanded}
        @click=${(e: Event) => { e.stopPropagation(); this._open = !this._open; }}
      >
        <ha-icon icon="mdi:dots-vertical"></ha-icon>
      </button>
    `;
  }

  private _renderMenu() {
    return html`
      ${this._renderTrigger(this._open)}
      ${this._open
        ? html`
            <div
              class="kebab-backdrop"
              @click=${(e: Event) => { e.stopPropagation(); this._open = false; }}
            ></div>
            <div class="kebab-menu" role="menu">${this._renderItems()}</div>
          `
        : nothing}
    `;
  }

  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this._open) this._open = false;
  };

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener("keydown", this._onKeydown);
  }

  override disconnectedCallback() {
    this.removeEventListener("keydown", this._onKeydown);
    super.disconnectedCallback();
  }

  override render() {
    return this._renderMenu();
  }
}
