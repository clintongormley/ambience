import { css, html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import { getFrontendVersion, type HassConnection } from "../api.js";
import { defineElement } from "../define-element.js";
import { _hashInternals } from "../frontend-hash.js";
import { localize } from "../i18n.js";
import "./banner.js";

// Test seam (mirrors lazy-frontend's _internals): tests stub reload so jsdom
// never attempts a real navigation.
export const _internals = {
  reload(): void {
    location.reload();
  },
};

/**
 * Persistent banner shown when the running frontend bundle is older than what
 * the server now serves. The running chunk reports its own content hash via its
 * `?fe=` URL (see frontend-hash.ts); we compare it against the server's current
 * hash. Mismatch → a non-dismissable "reload to update" nudge. Fail-open: any
 * uncertainty leaves the banner hidden, never a false nag. The check runs once
 * per element instance, so it re-runs when HA rebuilds the panel on reconnect.
 */
export class AmbienceVersionBanner extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    .message {
      font-size: 1rem;
      line-height: 1.4;
      color: var(--primary-text-color, #212121);
    }
  `;

  @property({ attribute: false }) hass: HassConnection | undefined;

  // Null = hidden; a non-null string is the server version to show (and the
  // show trigger). One reactive field instead of a separate _visible flag, so
  // "are we visible" and "what do we show" can never drift apart.
  @state() private _serverVersion: string | null = null;
  private _checked = false;

  override willUpdate(): void {
    if (this._checked || !this.hass) return;
    this._checked = true;
    void this._check();
  }

  private async _check(): Promise<void> {
    const running = _hashInternals.runningFrontendHash();
    if (!running || !this.hass) return;
    try {
      const { hash, version } = await getFrontendVersion(this.hass);
      if (!hash || hash === "missing" || hash === running) return;
      this._serverVersion = version;
    } catch {
      // Fail-open: leave the banner hidden on any WS/network error.
    }
  }

  override render() {
    if (this._serverVersion === null) return nothing;
    const message = localize(
      this.hass,
      "ui.version_update.message",
      "Ambience {version} has been installed — reload to update.",
      { version: this._serverVersion },
    );
    const reloadLabel = localize(this.hass, "ui.version_update.reload", "Reload");
    return html`
      <ambience-banner
        data-test="version-banner"
        icon="mdi:update"
        hint
        .dismissible=${false}
        .ctaLabel=${reloadLabel}
        @banner-cta=${() => _internals.reload()}
      ><span class="message">${message}</span></ambience-banner>
    `;
  }
}

defineElement("ambience-version-banner", AmbienceVersionBanner);

declare global {
  interface HTMLElementTagNameMap {
    "ambience-version-banner": AmbienceVersionBanner;
  }
}
