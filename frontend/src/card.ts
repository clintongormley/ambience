// frontend/src/card.ts
/**
 * Discoverable Lovelace card for Ambience. This is the tiny, lit-free loader
 * that the integration registers as a Lovelace resource (so it loads after HA's
 * scoped-custom-element-registry is installed — see card_resources.py). It
 * registers the card in window.customCards so it appears in the card picker, and
 * defines <ambience-card> as a stub that lazy-loads the heavy <ambience-frontend>
 * chunk on first use.
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
    // Drop the sidebar panel's reading-column width cap so the card uses the
    // full width of its (possibly multi-column) dashboard cell.
    this.style.setProperty("--ambience-content-max-width", "none");
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

// Loaded as a Lovelace resource (post scoped-registry install), so a plain
// idempotent define lands in the registry HA queries.
defineElement("ambience-card", AmbienceCard);

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
