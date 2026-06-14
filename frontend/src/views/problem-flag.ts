import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { type HassLike, localize } from "../i18n.js";
import { type ProblemSeverity, problemCount, worstSeverity } from "../scene-problems.js";
import type { Scene } from "../types.js";

// The single flag whose popover is currently open. Opening one closes any other,
// so at most one detail popover shows at a time.
let openFlag: AmbienceProblemFlag | null = null;

/** A flag summarising a list of scenes (used for the category-section and scope
 *  headers), or "" when none have problems. The detail popover shows an "N
 *  scene(s) have problems" count. */
export function renderAggregateProblemFlag(
  hass: HassLike | undefined,
  scenes: Scene[],
): TemplateResult | string {
  const severity = worstSeverity(scenes);
  if (!severity) return "";
  const n = problemCount(scenes);
  const title = localize(hass, "ui.problems_count", "{n} scene(s) have problems").replace(
    "{n}",
    String(n),
  );
  return html`<ambience-problem-flag
    .severity=${severity}
    .details=${[title]}
    .summary=${title}
  ></ambience-problem-flag>`;
}

/**
 * A severity-coloured circular badge with a white exclamation mark, flagging a
 * scene/category/scope that has problems. The mark is an explicit white glyph on
 * the disc (not the transparent cutout of `mdi:alert-circle`), so it stays legible
 * on any background — the coloured category bar, dark theme, etc.
 *
 * Tap/click toggles a small detail popover listing the problems, so the info is
 * reachable on touch where a native hover tooltip never shows. The native `title`
 * (from `summary`) still gives a quick hover tooltip on desktop.
 */
@customElement("ambience-problem-flag")
export class AmbienceProblemFlag extends LitElement {
  @property() severity: ProblemSeverity = "warning";
  // One line per problem, shown in the tap-to-reveal popover.
  @property({ attribute: false }) details: string[] = [];
  // One-line hover tooltip (desktop). Usually the details joined by newlines.
  @property() summary = "";

  @state() private _open = false;

  static override styles = css`
    :host {
      position: relative;
      display: inline-flex;
    }
    .problem-flag {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: 18px;
      height: 18px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      cursor: pointer;
      line-height: 1;
      /* The nested mark inherits this as its fill — white reads on both the red
         error disc and the amber warning disc. */
      color: #fff;
      --mdc-icon-size: 13px;
    }
    .problem-flag.error {
      background: var(--error-color, #db4437);
    }
    .problem-flag.warning {
      background: var(--warning-color, #ffa600);
    }
    /* Hover/click land on the badge button, not the icon's shadow DOM. */
    .problem-flag ha-icon {
      pointer-events: none;
    }
    .details {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      z-index: 20;
      /* Grow to fit the content, but cap and wrap long entity ids (which have no
         natural break points) instead of overflowing the box. */
      width: max-content;
      max-width: min(22rem, 80vw);
      overflow-wrap: anywhere;
      padding: 0.4rem 0.6rem;
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      border: 1px solid var(--divider-color, #e0e0e0);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
      font-size: 0.8rem;
      font-weight: 400;
      text-align: left;
      cursor: auto;
    }
    .details > div {
      padding: 0.1rem 0;
    }
  `;

  // Close the popover when the user clicks anywhere else. The badge's own click
  // calls stopPropagation, so opening never immediately re-closes.
  private _onDocClick = () => {
    if (this._open) this._setOpen(false);
  };

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("click", this._onDocClick);
  }

  override disconnectedCallback(): void {
    document.removeEventListener("click", this._onDocClick);
    if (openFlag === this) openFlag = null;
    super.disconnectedCallback();
  }

  /** Set this flag's open state, keeping at most one popover open across all
   *  flags: opening this one closes whichever was previously open. */
  private _setOpen(open: boolean) {
    if (open) {
      if (openFlag && openFlag !== this) openFlag._open = false;
      openFlag = this;
    } else if (openFlag === this) {
      openFlag = null;
    }
    this._open = open;
  }

  private _toggle(e: Event) {
    // Don't let the click reach a parent row/scope header that toggles on click.
    e.stopPropagation();
    this._setOpen(!this._open);
  }

  override render() {
    return html`
      <button
        class="problem-flag ${this.severity}"
        data-severity=${this.severity}
        title=${this.summary}
        aria-label=${this.summary}
        @click=${this._toggle}
      >
        <ha-icon icon="mdi:exclamation-thick"></ha-icon>
      </button>
      ${
        this._open
          ? html`<div class="details" role="tooltip">
            ${this.details.map((line) => html`<div>${line}</div>`)}
          </div>`
          : ""
      }
    `;
  }
}
