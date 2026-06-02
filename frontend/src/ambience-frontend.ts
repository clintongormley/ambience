// frontend/src/ambience-frontend.ts
/**
 * Ambience frontend — shared UI (header, nav, views) registered as
 * <ambience-frontend>. Rendered by both the sidebar panel (<ambience-panel>)
 * and the Lovelace card (<ambience-card>). This is the heavy chunk, lazy-loaded
 * on demand by ./lazy-frontend.ts.
 */

import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";

import type { HassConnection } from "./api.js";
import { defineElement } from "./define-element.js";
import { localize } from "./i18n.js";
import { renderLogo } from "./logo.js";
import { watchHaComponents } from "./ha-components.js";
import "./views/scopes-view.js";
import "./views/settings-modal.js";

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
      height: 3rem;
      width: auto;
    }
    .settings-btn {
      background: transparent;
      border: none;
      border-radius: 50%;
      padding: 0.35rem;
      cursor: pointer;
      color: var(--secondary-text-color, #888);
      display: flex;
      align-items: center;
    }
    .settings-btn:hover {
      color: var(--primary-text-color, inherit);
      background: var(--secondary-background-color, #eee);
    }
    .settings-btn ha-icon {
      --mdc-icon-size: 24px;
    }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @state() private _settingsOpen = false;

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
        <button
          class="settings-btn"
          @click=${() => { this._settingsOpen = true; }}
          aria-label=${localize(this.hass, "ui.tab_settings", "Settings")}
          title=${localize(this.hass, "ui.tab_settings", "Settings")}
        ><ha-icon icon="mdi:cog"></ha-icon></button>
      </header>
      <ambience-scopes-view .hass=${this.hass}></ambience-scopes-view>
      <ambience-settings-modal
        .hass=${this.hass}
        ?open=${this._settingsOpen}
        @close=${() => { this._settingsOpen = false; }}
      ></ambience-settings-modal>
    `;
  }
}

defineElement("ambience-frontend", AmbienceFrontend);
