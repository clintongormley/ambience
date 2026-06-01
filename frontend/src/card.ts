// frontend/src/card.ts
/**
 * Discoverable Lovelace card for Ambience. This is the tiny, lit-free loader
 * that is registered globally (via the integration's add_extra_js_url). It
 * registers the card in window.customCards so it appears in the card picker,
 * and defines <ambience-card> as a stub that lazy-loads the heavy
 * <ambience-frontend> chunk on first use.
 */

import { defineElement } from "./define-element.js";
import { loadFrontend } from "./lazy-frontend.js";

interface CardConfig {
  type: string;
}

class AmbienceCard extends HTMLElement {
  private _hass?: unknown;
  private _inner?: HTMLElement & { hass?: unknown };
  private _loading = false;

  setConfig(_config: CardConfig): void {
    void this._ensure();
  }

  set hass(hass: unknown) {
    this._hass = hass;
    if (this._inner) this._inner.hass = hass;
  }

  get hass(): unknown {
    return this._hass;
  }

  // Row-count hint for the layout editor; the frontend fills a full-height card.
  getCardSize(): number {
    return 12;
  }

  connectedCallback(): void {
    // Custom elements default to display:inline, which shrink-wraps the card to
    // its content instead of filling the dashboard cell. Make it a block so it
    // spans the column(s) the user sized it to.
    this.style.display = "block";
    void this._ensure();
  }

  private async _ensure(): Promise<void> {
    if (this._inner || this._loading) return;
    this._loading = true;
    try {
      await loadFrontend();
      if (this._inner) return;
      const el = document.createElement("ambience-frontend") as HTMLElement & {
        hass?: unknown;
      };
      el.hass = this._hass;
      this._inner = el;
      this.appendChild(el);
    } finally {
      this._loading = false;
    }
  }

  static getStubConfig(): Record<string, never> {
    return {};
  }
}

// Home Assistant installs `@webcomponents/scoped-custom-element-registry` while
// its main bundle executes, replacing `window.customElements`. Because this
// module is injected via add_extra_js_url, it can run BEFORE that patch — and a
// define() done then lands on the native registry, invisible to the scoped
// registry HA uses to resolve custom cards ("Configuration error: custom
// element doesn't exist"). Defer registration until the document has finished
// loading, by which point the patch is in place; HA rebuilds the card via
// whenDefined once we register.
function registerAmbienceCard(): void {
  defineElement("ambience-card", AmbienceCard);
}
if (document.readyState === "complete") {
  registerAmbienceCard();
} else {
  window.addEventListener("DOMContentLoaded", registerAmbienceCard, { once: true });
  window.addEventListener("load", registerAmbienceCard, { once: true });
}

interface CustomCardEntry {
  type: string;
  name: string;
  description: string;
  preview: boolean;
}
const w = window as unknown as { customCards?: CustomCardEntry[] };
w.customCards = w.customCards ?? [];
if (!w.customCards.some((c) => c.type === "ambience-card")) {
  w.customCards.push({
    type: "ambience-card",
    name: "Ambience",
    description: "The Ambience configuration frontend as a dashboard card.",
    preview: false,
  });
}
