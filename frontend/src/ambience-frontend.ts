// frontend/src/ambience-frontend.ts
/**
 * Ambience frontend — shared UI (header, nav, views) registered as
 * <ambience-frontend>. Rendered by both the sidebar panel (<ambience-panel>)
 * and the Lovelace card (<ambience-card>). This is the heavy chunk, lazy-loaded
 * on demand by ./lazy-frontend.ts.
 */

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { HassConnection } from "./api.js";
import { localize } from "./i18n.js";
import { renderLogo } from "./logo.js";
import { watchHaComponents } from "./ha-components.js";
import "./views/scopes-view.js";
import "./views/settings-view.js";

type PanelView = "areas" | "settings";

@customElement("ambience-frontend")
export class AmbienceFrontend extends LitElement {
  static override styles = css`
    :host {
      display: block;
      height: 100%;
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
      flex: 1;
      display: flex;
      align-items: center;
      /* visually replaced by the logo; keep for document outline only */
      font-size: 0;
    }
    h1 .ambience-logo {
      display: block;
      height: 2rem;
      width: auto;
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
    watchHaComponents(this);
  }

  override render() {
    return html`
      <header>
        <h1>
          ${renderLogo({
            dark: Boolean(
              (this.hass as { themes?: { darkMode?: boolean } }).themes
                ?.darkMode,
            ),
            title: localize(this.hass, "ui.panel_title", "Ambience"),
          })}
        </h1>
        <nav>
          <button
            class=${this._view === "areas" ? "active" : ""}
            @click=${() => { this._view = "areas"; }}
          >${localize(this.hass, "ui.tab_areas", "Areas")}</button>
          <button
            class=${this._view === "settings" ? "active" : ""}
            @click=${() => { this._view = "settings"; }}
          >${localize(this.hass, "ui.tab_settings", "Settings")}</button>
        </nav>
      </header>
      ${this._view === "areas"
        ? html`<ambience-scopes-view .hass=${this.hass}></ambience-scopes-view>`
        : html`<ambience-settings-view .hass=${this.hass}></ambience-settings-view>`}
    `;
  }
}
