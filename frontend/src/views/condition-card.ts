import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassConnection } from "../api.js";
import { conditionDocPath } from "../docs.js";
import { conditionLabel } from "../i18n.js";
import "./ambience-doc-link.js";

@customElement("ambience-condition-card")
export class AmbienceConditionCard extends LitElement {
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
    .body {
      padding: 1rem;
    }
    .body.collapsed {
      display: none;
    }
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property() conditionName = "";
  @property() conditionDescription = "";

  @state() private _expanded = false;

  private _toggleExpand() {
    this._expanded = !this._expanded;
  }

  override render() {
    const label = conditionLabel(this.hass as any, this.conditionName);
    return html`
      <div class="card">
        <header @click=${this._toggleExpand}>
          <span class="chevron ${this._expanded ? "open" : ""}">▶</span>
          <label>
            <div class="name">${label}</div>
            <div class="description">${this.conditionDescription}</div>
          </label>
          <ambience-doc-link
            .hass=${this.hass}
            .path=${conditionDocPath(this.conditionName) ?? ""}
          ></ambience-doc-link>
        </header>
        <div class="body ${this._expanded ? "" : "collapsed"}">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
