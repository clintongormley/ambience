import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { ActionSpec, MatcherInfo, Rule } from "../types.js";

@customElement("ambience-rule-editor")
export class AmbienceRuleEditor extends LitElement {
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
    :host([open]) { display: flex; }
    .modal {
      background: var(--card-background-color, #fff);
      color: inherit;
      border-radius: 8px;
      padding: 1.5rem;
      width: 90%;
      max-width: 40rem;
      max-height: 90vh;
      overflow-y: auto;
    }
    h2 { margin: 0 0 1rem 0; }
    h3 {
      margin: 1.5rem 0 0.5rem 0;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      padding-bottom: 0.25rem;
    }
    label {
      display: block;
      font-weight: 600;
      margin: 0.5rem 0 0.25rem 0;
    }
    input, select, textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: inherit;
    }
    .help {
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
      white-space: pre-wrap;
      margin-top: 0.25rem;
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
  @property({ attribute: false }) rule: Rule | null = null;
  @property({ attribute: false }) scenes: string[] = [];
  @property({ attribute: false }) activeMatchers: MatcherInfo[] = [];

  @state() private _draft: Rule | null = null;

  override willUpdate(changed: Map<string, unknown>) {
    if (changed.has("rule")) {
      // Deep clone so the user can cancel without affecting the source.
      this._draft = this.rule ? JSON.parse(JSON.stringify(this.rule)) : null;
    }
  }

  private _setName(v: string) {
    if (!this._draft) return;
    this._draft = { ...this._draft, name: v || undefined };
  }

  private _setScene(v: string) {
    if (!this._draft) return;
    const when = { ...this._draft.when };
    if (v === "") when.scene = null;
    else when.scene = v;
    this._draft = { ...this._draft, when };
  }

  private _setPredicate(matcher: string, v: string) {
    if (!this._draft) return;
    const when = { ...this._draft.when };
    if (v.trim() === "") delete when[matcher];
    else when[matcher] = v;
    this._draft = { ...this._draft, when };
  }

  private _addActionSlot() {
    if (!this._draft) return;
    const spec: ActionSpec = { action: "set_light", targets: {} };
    this._draft = {
      ...this._draft,
      actions: [...this._draft.actions, spec],
    };
  }

  private _save() {
    if (!this._draft) return;
    this.dispatchEvent(
      new CustomEvent("save-rule", {
        detail: this._draft,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _cancel() {
    this.dispatchEvent(
      new CustomEvent("cancel-rule", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    if (!this._draft) return html``;
    return html`
      <div class="modal">
        <h2>${this._draft.name || "New rule"}</h2>

        <label>Name (optional)</label>
        <input
          type="text"
          .value=${this._draft.name ?? ""}
          @input=${(e: InputEvent) => this._setName((e.target as HTMLInputElement).value)}
        />

        <h3>When</h3>

        <label>Scene</label>
        <select
          @change=${(e: Event) => this._setScene((e.target as HTMLSelectElement).value)}
        >
          <option value="" ?selected=${this._draft.when.scene == null}>
            (any scene)
          </option>
          ${this.scenes.map(
            (s) => html`
              <option value=${s} ?selected=${this._draft!.when.scene === s}>
                ${s}
              </option>
            `,
          )}
        </select>

        ${this.activeMatchers.map(
          (m) => html`
            <label>${m.name}</label>
            <input
              type="text"
              placeholder="(any)"
              .value=${String(this._draft!.when[m.name] ?? "")}
              @input=${(e: InputEvent) =>
                this._setPredicate(m.name, (e.target as HTMLInputElement).value)}
            />
            <div class="help">${m.predicate_help}</div>
          `,
        )}

        <h3>Actions</h3>
        ${this._draft.actions.length === 0
          ? html`<p style="color: var(--secondary-text-color, #888)">No actions yet.</p>`
          : this._draft.actions.map(
              (a, i) => html`
                <p>
                  ${i + 1}. ${a.action} on
                  ${Object.keys(a.targets).length} target(s)
                </p>
              `,
            )}
        <button class="secondary" @click=${this._addActionSlot}>+ Add action</button>

        <div class="actions-bar">
          <button class="secondary" @click=${this._cancel}>Cancel</button>
          <button class="primary" @click=${this._save}>Save rule</button>
        </div>
      </div>
    `;
  }
}
