import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

/**
 * A small live-state dot with a tap/click popover explaining what it means.
 *
 * `kind` "matched" → a filled green dot (the scene currently matches and is
 * applied); "stale" → a hollow dot (its actions are still applied but it no
 * longer matches). Click the dot to toggle the popover; click outside or press
 * Escape to dismiss. The popover (not a native `title`) is the explanation, so
 * the meaning is reachable on touch where a hover tooltip never shows — matching
 * `ambience-help` / `ambience-problem-flag`. Dependency-free (no ha-* elements)
 * so it works in every panel context and under jsdom.
 */
@customElement("ambience-live-dot")
export class AmbienceLiveDot extends LitElement {
  @property() kind: "matched" | "stale" = "matched";
  // The explanatory text (already localised by the caller), shown in the popover
  // and used as the dot's aria-label.
  @property() label = "";

  @state() private _open = false;

  static override styles = css`
    :host {
      position: relative;
      display: inline-flex;
    }
    button.dot {
      all: unset;
      display: inline-block;
      box-sizing: border-box;
      cursor: pointer;
      width: 0.55em;
      height: 0.55em;
      border-radius: 50%;
    }
    button.dot:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    button.dot.matched {
      background: var(--success-color, #4caf50);
    }
    button.dot.stale {
      background: transparent;
      border: 1.5px solid var(--secondary-text-color, #888);
    }
    .popover {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      z-index: 30;
      width: max-content;
      max-width: 260px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
      padding: 0.6rem 0.7rem;
      font-size: 0.85rem;
      font-weight: 400;
      line-height: 1.45;
      white-space: normal;
      text-align: left;
    }
  `;

  // Capture phase: the panel can live inside a modal whose `.modal` stops click
  // propagation in the bubble phase, so a bubble-phase document listener never
  // sees clicks elsewhere. Capturing fires before that stopPropagation, so
  // click-outside-to-dismiss works there too (matching ambience-help).
  private _onDocClick = (e: MouseEvent): void => {
    if (!e.composedPath().includes(this)) this._close();
  };
  private _onKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") this._close();
  };

  private _toggle(e: Event): void {
    // Don't let the click reach a parent row that toggles on click.
    e.stopPropagation();
    if (this._open) this._close();
    else this._openPopover();
  }

  private _openPopover(): void {
    this._open = true;
    document.addEventListener("click", this._onDocClick, true);
    document.addEventListener("keydown", this._onKeydown);
  }

  private _close(): void {
    if (!this._open) return;
    this._open = false;
    document.removeEventListener("click", this._onDocClick, true);
    document.removeEventListener("keydown", this._onKeydown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("click", this._onDocClick, true);
    document.removeEventListener("keydown", this._onKeydown);
  }

  override render() {
    return html`
      <button
        type="button"
        class="dot ${this.kind}"
        aria-label=${this.label}
        aria-expanded=${this._open}
        @click=${(e: Event) => this._toggle(e)}
      ></button>
      ${
        this._open
          ? html`<div class="popover" role="tooltip" @click=${(e: Event) => e.stopPropagation()}>
            ${this.label}
          </div>`
          : ""
      }
    `;
  }
}
