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
import { getFilterCategory } from "./ui-state.js";
import "./views/category-filter.js";
import "./views/scopes-view.js";
import "./views/settings-modal.js";
import "./views/ambience-doc-link.js";

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
    /* Header contents are capped to the content width and centred, tracking the
     same reading-column cap as the body below (the card overrides this var to
     fill its width). The filter is the only in-flow child so it centres at the
     bar midpoint; the logo and cog are absolutely positioned at the edges so
     they never shift the centre. */
    .bar {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: var(--ambience-content-max-width, 60rem);
      margin: 0 auto;
      padding: 0.75rem 1rem;
    }
    h1.brand {
      margin: 0;
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
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
    .settings-btn {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
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
    /* Too narrow for the wordmark alongside the filter + cog: show the icon.
       The wordmark is pinned at the left (right edge ≈ 181px) and the filter is
       centred with a 18rem (≈252px) min-width, so the two collide once the
       header drops below ≈632px. Swap at 48rem (≈672px at HA's 14px root) to
       keep a ~20px gap before they touch. (NB rem here is ×14, not ×16.) */
    @container (max-width: 48rem) {
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
  @state() private _settingsTab?: "ambience" | "categories" | "conditions" | "actions";
  // Seeded from localStorage so scopes-view renders filtered on first paint
  // (no flash of "All") after a reload or HA's panel rebuild on reconnect. Kept
  // in sync thereafter by the ambience-filter-changed event from the header.
  @state() private _filterCategory = getFilterCategory();

  // Deep-link from a child view (e.g. a scopes-view empty-state banner) asking
  // to open Settings on a specific tab. Composed so it crosses the shadow
  // boundary up to this host.
  private _onOpenSettings = (e: Event) => {
    const tab = (e as CustomEvent<{ tab?: "ambience" | "categories" | "conditions" | "actions" }>)
      .detail?.tab;
    this._settingsTab = tab;
    this._settingsOpen = true;
  };

  private _onFilterChanged = (e: Event) => {
    this._filterCategory = (e as CustomEvent<{ category?: string }>).detail?.category ?? "";
    e.stopPropagation();
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
    const logoOpts = {
      dark: Boolean((this.hass as { themes?: { darkMode?: boolean } }).themes?.darkMode),
      title: localize(this.hass, "ui.panel_title", "Ambience"),
    };
    return html`
      <header>
        <div class="bar">
          <h1 class="brand">
            ${renderLogo(logoOpts)}
            ${renderIcon(logoOpts)}
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
          <ambience-doc-link
            .hass=${this.hass}
            path="getting-started"
          ></ambience-doc-link>
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
