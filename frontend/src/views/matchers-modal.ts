import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { MatcherInfo } from "../types.js";

/**
 * Per-area matchers picker. Checkboxes for every `toggleable` matcher; the
 * `scene` matcher (toggleable: false) is always-on and never shown here.
 *
 * Emits `apply-matchers` with `{ matchers: string[] }` and `cancel-matchers`.
 */
@customElement("ambience-matchers-modal")
export class AmbienceMatchersModal extends LitElement {
  static override styles = css`
    :host {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 100;
      align-items: center;
      justify-content: center;
    }
    :host([open]) {
      display: flex;
    }
    .modal {
      background: var(--card-background-color, #fff);
      color: inherit;
      border-radius: 8px;
      padding: 1.5rem;
      width: 90%;
      max-width: 36rem;
      max-height: 90vh;
      overflow-y: auto;
    }
    h2 {
      margin: 0 0 0.5rem 0;
    }
    p.intro {
      color: var(--secondary-text-color, #888);
      margin-top: 0;
    }
    .matcher-row {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0.5rem;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }
    .matcher-row input[type="checkbox"] {
      width: auto;
      margin-top: 0.25rem;
    }
    .matcher-meta {
      flex: 1;
    }
    .matcher-name {
      font-weight: 600;
    }
    .matcher-help {
      white-space: pre-wrap;
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
    }
    .actions-bar {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    button {
      padding: 0.5rem 1rem;
      border: 0;
      border-radius: 4px;
      cursor: pointer;
    }
    .primary {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
    }
    .secondary {
      background: transparent;
      color: var(--primary-text-color, inherit);
      border: 1px solid var(--divider-color, #ccc);
    }
  `;

  @property({ type: Boolean, reflect: true }) open = false;
  /** Full matchers list from `matchers/list`; non-toggleable ones are filtered out. */
  @property({ attribute: false }) matchers: MatcherInfo[] = [];
  /** The area's currently-enabled matcher names. */
  @property({ attribute: false }) selected: string[] = [];

  @state() private _draft = new Set<string>();

  override willUpdate(changed: Map<string, unknown>) {
    // Re-seed the draft whenever the modal is (re-)opened for an area.
    if (changed.has("selected") || changed.has("open")) {
      if (this.open) this._draft = new Set(this.selected);
    }
  }

  private _toggle(name: string, on: boolean) {
    const next = new Set(this._draft);
    if (on) next.add(name);
    else next.delete(name);
    this._draft = next;
  }

  private _apply() {
    this.dispatchEvent(
      new CustomEvent("apply-matchers", {
        detail: { matchers: [...this._draft] },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _cancel() {
    this.dispatchEvent(
      new CustomEvent("cancel-matchers", { bubbles: true, composed: true }),
    );
  }

  override render() {
    const toggleable = this.matchers.filter((m) => m.toggleable);
    return html`
      <div class="modal">
        <h2>Matchers</h2>
        <p class="intro">
          Select which matchers can be used in this area's rule predicates.
        </p>
        ${toggleable.map(
          (m) => html`
            <div class="matcher-row">
              <input
                type="checkbox"
                .checked=${this._draft.has(m.name)}
                @change=${(e: Event) =>
                  this._toggle(
                    m.name,
                    (e.target as HTMLInputElement).checked,
                  )}
              />
              <div class="matcher-meta">
                <div class="matcher-name">${m.name}</div>
                <div>${m.description}</div>
                <div class="matcher-help">${m.predicate_help}</div>
              </div>
            </div>
          `,
        )}
        <div class="actions-bar">
          <button class="secondary" @click=${this._cancel}>Cancel</button>
          <button class="primary" @click=${this._apply}>Apply</button>
        </div>
      </div>
    `;
  }
}
