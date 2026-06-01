import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import { localize } from "../i18n.js";
import type { HassConnection } from "../api.js";
import "./settings-view.js";

/**
 * Modal wrapper around <ambience-settings-view>, opened from the header cogwheel.
 *
 * Properties:
 *   hass – HA connection (required)
 *   open – whether the modal is visible
 *
 * Events:
 *   close – dispatched when the user closes the modal (✕, backdrop, or Escape)
 */
@customElement("ambience-settings-modal")
export class AmbienceSettingsModal extends LitElement {
  static override styles = css`
    :host {
      display: none;
      position: fixed; inset: 0;
      align-items: center; justify-content: center;
      background: rgba(0, 0, 0, 0.45); z-index: 1000;
    }
    :host([open]) {
      display: flex;
    }
    .modal {
      background: var(--card-background-color, #fff);
      border-radius: 8px; padding: 1.5rem;
      max-width: 680px; width: 90%; height: 85vh;
      display: flex; flex-direction: column; gap: 1rem;
      overflow: hidden;
    }
    .header {
      display: flex; align-items: center; gap: 0.5rem;
    }
    .header h3 { margin: 0; flex: 1; }
    .close {
      padding: 0.25rem 0.5rem; cursor: pointer;
      border: none; background: none; font-size: 1.2rem;
      color: var(--secondary-text-color, #888);
      line-height: 1;
    }
    .body {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .body > ambience-settings-view { flex: 1; min-height: 0; }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @property({ type: Boolean, reflect: true }) open = false;

  private _onKeydown = (e: KeyboardEvent): void => {
    if (this.open && e.key === "Escape") this._close();
  };

  // A click that reaches the host is a backdrop click — clicks inside .modal
  // stop propagation before they get here.
  private _onBackdrop = (): void => {
    if (this.open) this._close();
  };

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("keydown", this._onKeydown);
    this.addEventListener("click", this._onBackdrop);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._onKeydown);
    this.removeEventListener("click", this._onBackdrop);
  }

  private _close(): void {
    this.dispatchEvent(new CustomEvent("close", { bubbles: true, composed: true }));
  }

  override render() {
    if (!this.open) return nothing;
    return html`
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        @click=${(e: Event) => e.stopPropagation()}
      >
        <div class="header">
          <h3>${localize(this.hass, "ui.tab_settings", "Settings")}</h3>
          <button class="close" @click=${this._close} aria-label="Close">✕</button>
        </div>
        <div class="body">
          <ambience-settings-view .hass=${this.hass}></ambience-settings-view>
        </div>
      </div>
    `;
  }
}
