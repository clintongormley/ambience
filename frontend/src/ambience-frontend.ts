// frontend/src/ambience-frontend.ts
/**
 * Ambience frontend — shared UI (header, nav, views) registered as
 * <ambience-frontend>. Rendered by both the sidebar panel (<ambience-panel>)
 * and the Lovelace card (<ambience-card>). This is the heavy chunk, lazy-loaded
 * on demand by ./lazy-frontend.ts.
 */

import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

import type { HassConnection } from "./api.js";
import { defineElement } from "./define-element.js";
import { watchHaComponents } from "./ha-components.js";
import { localize } from "./i18n.js";
import { renderIcon, renderLogo } from "./logo.js";
import "./views/category-filter.js";
import "./views/scopes-view.js";
import "./views/settings-modal.js";

export class AmbienceFrontend extends LitElement {
  static override styles = css`
    :host {
      display: block;
      height: 100%;
      /* Scroll container for the sticky header below. In the panel the outer
       host is 100vh; making this the scroller lets the header pin to the top. */
      overflow: auto;
      background: var(--primary-background-color, #fafafa);
      color: var(--primary-text-color, #1d1d1d);
      font-family: var(--primary-font-family, system-ui, sans-serif);
    }
    header {
      /* Pinned to the top while the content scrolls beneath it. The :host is the
       scroll container (see the :host rule below), so sticky resolves against it.
       An opaque background + z-index keep scrolled content from showing through. */
      position: sticky;
      top: 0;
      z-index: 2;
      background: var(--primary-background-color, #fafafa);
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      /* Establish a containment context so the logo/icon swap can respond to
       the header's own width regardless of the surrounding panel/card. */
      container-type: inline-size;
    }
    /* Header contents are capped to the content width and centred, so the logo,
     filter, and cog align over the centred page content. The 1fr/auto/1fr grid
     keeps the filter centred regardless of the logo's and cog's widths. */
    .bar {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 1rem;
      max-width: 60rem;
      margin: 0 auto;
      padding: 0.75rem 1rem;
    }
    h1.brand {
      margin: 0;
      justify-self: start;
      display: flex;
      align-items: center;
      /* visually replaced by the logo/icon; keep for document outline only */
      font-size: 0;
    }
    .brand .ambience-logo {
      display: block;
      height: 3rem;
      width: auto;
    }
    .brand .ambience-icon {
      display: none;
      height: 3rem;
      width: auto;
    }
    ambience-category-filter {
      justify-self: center;
    }
    .settings-btn {
      justify-self: end;
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
    /* Too narrow for the wordmark alongside the filter + cog: show the icon. */
    @container (max-width: 32rem) {
      .brand .ambience-logo {
        display: none;
      }
      .brand .ambience-icon {
        display: block;
      }
    }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @state() private _settingsOpen = false;
  @state() private _settingsTab?: "ambience" | "conditions" | "actions";
  @state() private _filterCategory = "";

  // Deep-link from a child view (e.g. a scopes-view empty-state banner) asking
  // to open Settings on a specific tab. Composed so it crosses the shadow
  // boundary up to this host.
  private _onOpenSettings = (e: Event) => {
    const tab = (e as CustomEvent<{ tab?: "ambience" | "conditions" | "actions" }>).detail?.tab;
    this._settingsTab = tab;
    this._settingsOpen = true;
  };

  private _onFilterChanged = (e: Event) => {
    this._filterCategory = (e as CustomEvent<{ category?: string }>).detail?.category ?? "";
  };

  override connectedCallback() {
    super.connectedCallback();
    watchHaComponents(this);
    this.addEventListener("ambience-open-settings", this._onOpenSettings);
    this.addEventListener("ambience-filter-changed", this._onFilterChanged);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("ambience-open-settings", this._onOpenSettings);
    this.removeEventListener("ambience-filter-changed", this._onFilterChanged);
  }

  override render() {
    return html`
      <header>
        <div class="bar">
          <h1 class="brand">
            ${renderLogo({
              dark: Boolean((this.hass as { themes?: { darkMode?: boolean } }).themes?.darkMode),
              title: localize(this.hass, "ui.panel_title", "Ambience"),
            })}
            ${renderIcon({
              dark: Boolean((this.hass as { themes?: { darkMode?: boolean } }).themes?.darkMode),
              title: localize(this.hass, "ui.panel_title", "Ambience"),
            })}
          </h1>
          <ambience-category-filter .hass=${this.hass}></ambience-category-filter>
          <button
            class="settings-btn"
            @click=${() => {
              this._settingsTab = undefined;
              this._settingsOpen = true;
            }}
            aria-label=${localize(this.hass, "ui.tab_settings", "Settings")}
            title=${localize(this.hass, "ui.tab_settings", "Settings")}
          ><ha-icon icon="mdi:cog"></ha-icon></button>
        </div>
      </header>
      <ambience-scopes-view
        .hass=${this.hass}
        .filterCategory=${this._filterCategory}
      ></ambience-scopes-view>
      <ambience-settings-modal
        .hass=${this.hass}
        .initialTab=${this._settingsTab}
        ?open=${this._settingsOpen}
        @close=${() => {
          this._settingsOpen = false;
        }}
      ></ambience-settings-modal>
    `;
  }
}

defineElement("ambience-frontend", AmbienceFrontend);
