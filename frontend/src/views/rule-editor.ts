import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type {
  ActionInfo,
  ActionSpec,
  MatcherInfo,
  ParamSpec,
  Rule,
} from "../types.js";
import { HaComponentsController, pickHaTextInput } from "../ha-components.js";
import "./matcher-input.js";

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
    :host([open]) {
      display: flex;
    }
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
    h2 {
      margin: 0 0 1rem 0;
    }
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
    input,
    select {
      width: 100%;
      box-sizing: border-box;
      padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: inherit;
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
  /** Matcher rows to render, in display order (scene first). */
  @property({ attribute: false }) matchers: MatcherInfo[] = [];
  @property({ attribute: false }) sceneSuggestions: string[] = [];
  @property({ attribute: false }) availableActions: ActionInfo[] = [];

  @state() private _draft: Rule | null = null;

  private _ha = new HaComponentsController(this);

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

  private _onNameInput = (e: Event) => {
    // ha-input and ha-textfield both expose `value: string` on their host.
    this._setName((e.target as HTMLElement & { value: string }).value);
  };

  /**
   * Picks the best available HA text-input variant: `ha-input` (HA 2026.05+)
   * or `ha-textfield` (older), falling back to a plain `<input>` when
   * neither is registered. The HaComponentsController re-renders us if a
   * tracked component becomes defined later, so we upgrade in place.
   */
  private _renderNameField() {
    const value = this._draft!.name ?? "";
    const tag = pickHaTextInput();
    if (tag === "ha-input") {
      return html`
        <ha-input
          label="Name (optional)"
          .value=${value}
          @input=${this._onNameInput}
        ></ha-input>
      `;
    }
    if (tag === "ha-textfield") {
      return html`
        <ha-textfield
          label="Name (optional)"
          .value=${value}
          @input=${this._onNameInput}
        ></ha-textfield>
      `;
    }
    return html`
      <label>Name (optional)</label>
      <input
        type="text"
        .value=${value}
        @input=${this._onNameInput}
      />
    `;
  }

  private _setPredicate(matcher: string, value: unknown) {
    if (!this._draft) return;
    const when = { ...this._draft.when };
    if (value == null) delete when[matcher];
    else when[matcher] = value;
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

  private _updateActionAt(idx: number, mutate: (a: ActionSpec) => ActionSpec) {
    if (!this._draft) return;
    const actions = this._draft.actions.map((a, i) =>
      i === idx ? mutate(a) : a,
    );
    this._draft = { ...this._draft, actions };
  }

  private _changeActionType(idx: number, name: string) {
    this._updateActionAt(idx, () => ({ action: name, targets: {} }));
  }

  private _deleteAction(idx: number) {
    if (!this._draft) return;
    this._draft = {
      ...this._draft,
      actions: this._draft.actions.filter((_, i) => i !== idx),
    };
  }

  private _addTarget(actionIdx: number) {
    this._updateActionAt(actionIdx, (a) => {
      const info = this.availableActions.find((x) => x.name === a.action);
      const defaults: Record<string, unknown> = {};
      info?.target_params.forEach((p) => {
        if ("default" in p) defaults[p.name] = p.default;
      });
      return {
        ...a,
        targets: { ...a.targets, "": defaults },
      };
    });
  }

  private _updateTargetId(actionIdx: number, oldId: string, newId: string) {
    this._updateActionAt(actionIdx, (a) => {
      if (oldId === newId) return a;
      const targets = { ...a.targets };
      targets[newId] = targets[oldId];
      delete targets[oldId];
      return { ...a, targets };
    });
  }

  private _updateTargetParam(
    actionIdx: number,
    entityId: string,
    param: ParamSpec,
    rawValue: string,
  ) {
    this._updateActionAt(actionIdx, (a) => {
      const targets = { ...a.targets };
      const cur = { ...(targets[entityId] ?? {}) };
      let parsed: unknown = rawValue;
      if (param.type === "int")
        parsed = rawValue === "" ? undefined : parseInt(rawValue, 10);
      else if (param.type === "number")
        parsed = rawValue === "" ? undefined : parseFloat(rawValue);
      else if (param.type === "boolean") parsed = rawValue === "true";
      if (parsed === undefined) delete cur[param.name];
      else cur[param.name] = parsed;
      targets[entityId] = cur;
      return { ...a, targets };
    });
  }

  private _deleteTarget(actionIdx: number, entityId: string) {
    this._updateActionAt(actionIdx, (a) => {
      const targets = { ...a.targets };
      delete targets[entityId];
      return { ...a, targets };
    });
  }

  private _renderTargets(actionIdx: number, action: ActionSpec) {
    const info = this.availableActions.find((x) => x.name === action.action);
    const params: ParamSpec[] = info?.target_params ?? [];
    const entries = Object.entries(action.targets);
    if (entries.length === 0) {
      return html`<p
        style="color: var(--secondary-text-color, #888); margin: 0.5rem 0;"
      >
        No targets yet.
      </p>`;
    }
    return html`
      ${entries.map(
        ([entityId, paramValues]) => html`
          <div
            style="display: grid; grid-template-columns: 1fr ${"1fr ".repeat(
              params.length,
            )}auto; gap: 0.5rem; margin: 0.5rem 0; align-items: end;"
          >
            <div>
              <label>entity_id</label>
              <input
                type="text"
                .value=${entityId}
                placeholder="${info?.domains?.[0] ?? "domain"}.example"
                @change=${(e: Event) =>
                  this._updateTargetId(
                    actionIdx,
                    entityId,
                    (e.target as HTMLInputElement).value,
                  )}
              />
            </div>
            ${params.map(
              (p) => html`
                <div>
                  <label>${p.name}${p.required ? " *" : ""}</label>
                  <input
                    type=${p.type === "int" || p.type === "number"
                      ? "number"
                      : "text"}
                    .value=${String(
                      (paramValues as Record<string, unknown>)[p.name] ?? "",
                    )}
                    min=${p.min ?? ""}
                    max=${p.max ?? ""}
                    @input=${(e: InputEvent) =>
                      this._updateTargetParam(
                        actionIdx,
                        entityId,
                        p,
                        (e.target as HTMLInputElement).value,
                      )}
                  />
                </div>
              `,
            )}
            <button
              class="secondary"
              @click=${() => this._deleteTarget(actionIdx, entityId)}
              title="Remove target"
            >
              ×
            </button>
          </div>
        `,
      )}
    `;
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

        ${this._renderNameField()}

        <h3>When</h3>
        ${this.matchers.map(
          (m) => html`
            <label>${m.name === "scene" ? "Scene" : m.name}</label>
            <ambience-matcher-input
              .matcher=${m}
              .value=${this._draft!.when[m.name] ?? null}
              .sceneSuggestions=${this.sceneSuggestions}
              @value-changed=${(e: CustomEvent<{ value: unknown }>) =>
                this._setPredicate(m.name, e.detail.value)}
            ></ambience-matcher-input>
          `,
        )}

        <h3>Actions</h3>
        ${this._draft.actions.map(
          (action, actionIdx) => html`
            <div
              style="border: 1px solid var(--divider-color, #e0e0e0); border-radius: 4px; padding: 0.75rem; margin-bottom: 0.5rem;"
            >
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <select
                  @change=${(e: Event) =>
                    this._changeActionType(
                      actionIdx,
                      (e.target as HTMLSelectElement).value,
                    )}
                >
                  ${this.availableActions.map(
                    (info) => html`
                      <option
                        value=${info.name}
                        ?selected=${action.action === info.name}
                      >
                        ${info.name}
                      </option>
                    `,
                  )}
                </select>
                <button
                  class="secondary"
                  style="margin-left: auto"
                  @click=${() => this._deleteAction(actionIdx)}
                >
                  Remove action
                </button>
              </div>

              ${this._renderTargets(actionIdx, action)}

              <button
                class="secondary"
                @click=${() => this._addTarget(actionIdx)}
              >
                + Add target
              </button>
            </div>
          `,
        )}
        <button class="secondary" @click=${this._addActionSlot}>
          + Add action
        </button>

        <div class="actions-bar">
          <button class="secondary" @click=${this._cancel}>Cancel</button>
          <button class="primary" @click=${this._save}>Save rule</button>
        </div>
      </div>
    `;
  }
}
