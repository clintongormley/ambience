import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import { matcherLabel } from "../i18n.js";
import type { HassConnection } from "../api.js";

@customElement("ambience-matcher-card")
export class AmbienceMatcherCard extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    .card {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      margin-bottom: 1rem;
    }
    header {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    header label {
      flex: 1;
      cursor: pointer;
    }
    .name {
      font-weight: 600;
    }
    .description {
      color: var(--secondary-text-color, #888);
      font-size: 0.9em;
    }
    .body {
      padding: 1rem;
    }
    .body.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property() matcherName = "";
  @property() matcherDescription = "";
  @property({ type: Boolean }) enabled = false;

  private _onToggle(e: Event) {
    const enabled = (e.target as HTMLInputElement).checked;
    this.dispatchEvent(
      new CustomEvent("enable-changed", {
        detail: { enabled },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    const label = matcherLabel(this.hass as any, this.matcherName);
    return html`
      <div class="card">
        <header>
          <input type="checkbox" .checked=${this.enabled} @change=${this._onToggle} />
          <label>
            <div class="name">${label}</div>
            <div class="description">${this.matcherDescription}</div>
          </label>
        </header>
        <div class="body ${this.enabled ? "" : "disabled"}">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
