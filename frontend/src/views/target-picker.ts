import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassConnection } from "../api.js";
import type { HaTarget } from "../entities-for-scope.js";
import { targetSelectorSupported } from "../ha-version.js";
import type { ActionTargetValue } from "../types.js";

/**
 * Target picker: renders HA's native `target` selector via ha-form on
 * HA >= 2026.1, or an entity-id picker (ha-form with entity selector) on
 * older HA where ``homeassistant.helpers.target`` is unavailable. Falls back
 * to a minimal marker div in jsdom/headless test environments.
 *
 * Emits `value-changed` with `{ value: ActionTargetValue }`.
 *
 * On HA < 2026.1 only direct ``entity_id`` targeting is available; the data
 * model stays the same ``{ entity_id: [...] }`` shape.
 */
@customElement("ambience-target-picker")
export class AmbienceTargetPicker extends LitElement {
  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) target: HaTarget = null;
  @property({ attribute: false }) value: ActionTargetValue = {};
  @property() label = "";
  /** Scope-filtered entity list used as ``include_entities`` in the fallback
   *  entity picker (HA < 2026.1). On modern HA this is unused. */
  @property({ attribute: false }) entities: string[] = [];

  /** Memoized schema; rebuilt in willUpdate only when `target` or `entities` changes. */
  @state() private _schema: Array<{ name: string; selector: Record<string, unknown> }> = [];

  override willUpdate(changed: Map<string, unknown>) {
    if (changed.has("target") || changed.has("entities") || changed.has("hass")) {
      this._schema = this._useEntityFallback() ? this._entitySchema() : this._targetSchema();
    }
  }

  /** True when the connected HA version is too old for the rich target helper. */
  private _useEntityFallback(): boolean {
    return this.hass != null && !targetSelectorSupported(this.hass);
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

  /** Build the entity-only fallback schema (HA < 2026.1). */
  _entitySchema(): Array<{ name: string; selector: Record<string, unknown> }> {
    const sel: Record<string, unknown> = { multiple: true };
    if (this.entities.length > 0) sel.include_entities = this.entities;
    return [{ name: "entities", selector: { entity: sel } }];
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

  _onEntityFormChange = (e: CustomEvent<{ value: { entities?: string[] } }>) => {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { entity_id: e.detail.value.entities ?? [] } },
        bubbles: true,
        composed: true,
      }),
    );
  };

  override render() {
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      if (this._useEntityFallback()) {
        return html`
          <ha-form
            .hass=${this.hass}
            .schema=${this._schema}
            .data=${{ entities: this.value.entity_id ?? [] }}
            .computeLabel=${() => this.label}
            @value-changed=${this._onEntityFormChange}
          ></ha-form>
        `;
      }
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
