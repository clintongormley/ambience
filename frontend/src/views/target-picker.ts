import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassConnection } from "../api.js";
import type { HaTarget } from "../entities-for-scope.js";
import type { ActionTargetValue } from "../types.js";

/**
 * Target picker: renders HA's native `target` selector via ha-form when
 * ha-form is registered (real HA), or a minimal marker div fallback in
 * jsdom/headless test environments.
 *
 * Emits `value-changed` with `{ value: ActionTargetValue }`.
 */
@customElement("ambience-target-picker")
export class AmbienceTargetPicker extends LitElement {
  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) target: HaTarget = null;
  @property({ attribute: false }) value: ActionTargetValue = {};
  @property() label = "";

  /** Memoized schema; rebuilt in willUpdate only when `target` changes. */
  @state() private _schema: Array<{ name: string; selector: Record<string, unknown> }> = [];

  override willUpdate(changed: Map<string, unknown>) {
    if (changed.has("target")) {
      this._schema = this._targetSchema();
    }
  }

  /** Build the HA `target` selector schema, forwarding the service's entity
   *  domain constraint so suggestions stay domain-correct. */
  _targetSchema(): Array<{ name: string; selector: Record<string, unknown> }> {
    const entry = Array.isArray((this.target as any)?.entity)
      ? (this.target as any).entity[0]
      : (this.target as any)?.entity;
    const domain = entry?.domain;
    const targetSelector: Record<string, unknown> = {};
    if (domain) targetSelector.entity = [{ domain }];
    return [{ name: "target", selector: { target: targetSelector } }];
  }

  _onTargetFormChange = (e: CustomEvent<{ value: { target?: ActionTargetValue } }>) => {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: e.detail.value.target ?? {} },
        bubbles: true,
        composed: true,
      }),
    );
  };

  override render() {
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      return html`
        <ha-form
          .hass=${this.hass}
          .schema=${this._schema}
          .data=${{ target: this.value }}
          .computeLabel=${() => this.label}
          @value-changed=${this._onTargetFormChange}
        ></ha-form>
      `;
    }
    /* v8 ignore stop */
    // jsdom fallback: no native chip widget; render a marker so tests can mount.
    return html`<div data-target-fallback></div>`;
  }
}
