/**
 * Ambience panel — root element registered as <ambience-panel>.
 * HA loads the bundle and instantiates this element inside the panel iframe.
 */

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { HassConnection } from "./api.js";
import { localize } from "./i18n.js";
import { watchHaComponents } from "./ha-components.js";
import "./views/scopes-view.js";
import "./views/configuration-view.js";

type PanelView = "areas" | "configuration";

@customElement("ambience-panel")
export class AmbiencePanel extends LitElement {
  static override styles = css`
    :host {
      display: block;
      height: 100vh;
      background: var(--primary-background-color, #fafafa);
      color: var(--primary-text-color, #1d1d1d);
      font-family: var(--primary-font-family, system-ui, sans-serif);
    }
    header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    h1 {
      margin: 0;
      font-size: 1.4rem;
      flex: 1;
    }
    nav {
      display: flex;
      gap: 0.25rem;
    }
    nav button {
      background: transparent;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      padding: 0.35rem 0.75rem;
      cursor: pointer;
      color: var(--primary-text-color, inherit);
      font-size: 0.9rem;
    }
    nav button.active {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
    }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @state() private _view: PanelView = "areas";

  override connectedCallback() {
    super.connectedCallback();
    // Register whenDefined callbacks so sub-components re-render if HA
    // registers form elements lazily (no-op on HA 2026.05+ where they are
    // eagerly registered).
    watchHaComponents(this);
  }

  override render() {
    return html`
      <header>
        <h1>${localize(this.hass, "ui.panel_title", "Ambience")}</h1>
        <nav>
          <button
            class=${this._view === "areas" ? "active" : ""}
            @click=${() => { this._view = "areas"; }}
          >${localize(this.hass, "ui.tab_areas", "Areas")}</button>
          <button
            class=${this._view === "configuration" ? "active" : ""}
            @click=${() => { this._view = "configuration"; }}
          >${localize(this.hass, "ui.tab_configuration", "Configuration")}</button>
        </nav>
      </header>
      ${this._view === "areas"
        ? html`<ambience-scopes-view .hass=${this.hass}></ambience-scopes-view>`
        : html`<ambience-configuration-view .hass=${this.hass}></ambience-configuration-view>`}
    `;
  }
}
