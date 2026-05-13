import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { Rule } from "../types.js";

@customElement("ambience-rules-list")
export class AmbienceRulesList extends LitElement {
  static override styles = css`
    :host { display: block; }
    .empty {
      color: var(--secondary-text-color, #888);
      padding: 1rem;
      text-align: center;
    }
    ul { list-style: none; padding: 0; margin: 0; }
    li {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: var(--card-background-color, #fff);
    }
    .idx {
      font-family: monospace;
      color: var(--secondary-text-color, #888);
      margin-right: 0.75rem;
      min-width: 2em;
    }
    .name {
      flex: 1;
      cursor: pointer;
    }
    .name:hover { text-decoration: underline; }
    .summary {
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
    }
    button {
      background: transparent;
      border: 0;
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
      padding: 0.25rem 0.5rem;
    }
    button:disabled {
      color: var(--disabled-text-color, #ccc);
      cursor: default;
    }
    .add {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      padding: 0.5rem 1rem;
      border-radius: 4px;
      margin-top: 0.5rem;
    }
  `;

  @property({ attribute: false }) rules: Rule[] = [];

  private _emit(name: string, detail: unknown) {
    this.dispatchEvent(
      new CustomEvent(name, { detail, bubbles: true, composed: true }),
    );
  }

  override render() {
    if (this.rules.length === 0) {
      return html`
        <p class="empty">No rules yet.</p>
        <button class="add" @click=${() => this._emit("add-rule", {})}>
          + Add rule
        </button>
      `;
    }
    return html`
      <ul>
        ${this.rules.map(
          (rule, i) => html`
            <li>
              <span class="idx">${i + 1}</span>
              <div style="flex: 1">
                <div class="name" @click=${() => this._emit("edit-rule", { index: i })}>
                  ${rule.name || `Rule ${i + 1}`}
                </div>
                <div class="summary">
                  scene=${rule.when.scene ?? "*"},
                  actions=${rule.actions.length}
                </div>
              </div>
              <button
                ?disabled=${i === 0}
                @click=${() => this._emit("move-rule", { index: i, delta: -1 })}
                title="Move up"
              >↑</button>
              <button
                ?disabled=${i === this.rules.length - 1}
                @click=${() => this._emit("move-rule", { index: i, delta: +1 })}
                title="Move down"
              >↓</button>
              <button @click=${() => this._emit("delete-rule", { index: i })}>×</button>
            </li>
          `,
        )}
      </ul>
      <button class="add" @click=${() => this._emit("add-rule", {})}>
        + Add rule
      </button>
    `;
  }
}
