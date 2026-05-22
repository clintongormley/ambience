import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

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
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      cursor: pointer;
    }
    .chevron {
      color: var(--secondary-text-color, #888);
      font-size: 0.7em;
      transition: transform 0.15s ease;
      width: 0.8em;
      flex: 0 0 auto;
    }
    .chevron.open {
      transform: rotate(90deg);
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
    .enable {
      flex: 0 0 auto;
    }
    .body {
      padding: 1rem;
    }
    .body.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
    .body.collapsed {
      display: none;
    }
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property() matcherName = "";
  @property() matcherDescription = "";
  @property({ type: Boolean }) enabled = false;

  @state() private _expanded = true;

  private _toggleExpand() {
    this._expanded = !this._expanded;
  }

  private _onToggle(e: Event) {
    e.stopPropagation();
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
        <header @click=${this._toggleExpand}>
          <span class="chevron ${this._expanded ? "open" : ""}">▶</span>
          <label>
            <div class="name">${label}</div>
            <div class="description">${this.matcherDescription}</div>
          </label>
          <input
            class="enable"
            type="checkbox"
            .checked=${this.enabled}
            @click=${(e: Event) => e.stopPropagation()}
            @change=${this._onToggle}
          />
        </header>
        <div
          class="body ${this.enabled ? "" : "disabled"} ${this._expanded ? "" : "collapsed"}"
        >
          <slot></slot>
        </div>
      </div>
    `;
  }
}
