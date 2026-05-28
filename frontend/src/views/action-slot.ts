import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { getServiceSchema, type HassConnection } from "../api.js";
import {
  entitiesForScope,
  type HaTarget,
} from "../entities-for-scope.js";
import { watchHaComponents } from "../ha-components.js";
import { localize } from "../i18n.js";
import type { ExposedAction, Scope, ServiceSchema } from "../types.js";
import "./target-picker.js";

type HaFormSchemaEntry = {
  name: string;
  selector?: unknown;
  required?: boolean;
  description?: { suggested_value?: unknown } | string;
};

/**
 * Body of an action slot. The action is identified by `exposed` (the
 * ExposedAction config — its `id` doubles as the HA service id). On mount /
 * exposed-change, the slot fetches the corresponding ServiceSchema and
 * renders:
 *
 *   1. A target picker, scoped by `scope` and further filtered by the HA
 *      target metadata on the schema. Suppressed when the service has no
 *      target.
 *   2. A field form rendered via <ha-form>, whose schema is the
 *      intersection of `exposed.visible_fields` and `serviceSchema.fields`.
 *      Suppressed when the intersection is empty.
 *
 * Events:
 *   - `entity-ids-changed` { entityIds: string[] }
 *   - `params-changed`     { params: Record<string, unknown> }
 */
@customElement("ambience-action-slot")
export class AmbienceActionSlot extends LitElement {
  static override styles = css`
    :host { display: block; }
    label {
      display: block; font-weight: 600; margin: 0.5rem 0 0.25rem 0;
    }
    .target-picker, .fields-form {
      margin-top: 0.5rem;
    }
    .no-params {
      color: var(--secondary-text-color, #888);
      font-style: italic;
      padding: 0.5rem 0;
    }
    .schema-error {
      color: var(--error-color, #c62828);
      font-size: 0.9em;
      padding: 0.3rem 0;
    }
    input {
      width: 100%; box-sizing: border-box; padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc); border-radius: 4px;
      background: var(--card-background-color, #fff); color: inherit;
      font: inherit;
    }
    .field-row {
      margin-bottom: 0.5rem;
    }
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) scope?: Scope;
  @property({ attribute: false }) exposed?: ExposedAction;
  @property({ attribute: false }) entityIds: string[] = [];
  @property({ attribute: false }) params: Record<string, unknown> = {};

  @state() private _schema: ServiceSchema | null | undefined = undefined;
  @state() private _schemaError: string | null = null;
  /** True when `exposed` is undefined (no entry in the exposed-action list). */
  @state() private _exposedMissing = false;
  /** Cached form schema; rebuilt only when inputs change. */
  @state() private _formSchema: HaFormSchemaEntry[] = [];
  /** Service id that `_schema` was loaded for; guards against stale assigns
   *  when `exposed` changes mid-fetch. */
  private _schemaServiceId: string | null = null;

  override connectedCallback() {
    super.connectedCallback();
    watchHaComponents(this, this.hass);
  }

  override willUpdate(changed: Map<string, unknown>) {
    if (
      (changed.has("exposed") &&
        (changed.get("exposed") as ExposedAction | undefined)?.id !== this.exposed?.id) ||
      (changed.has("hass") && this._schema === undefined)
    ) {
      void this._loadSchema();
    }
    if (changed.has("exposed") || changed.has("_schema")) {
      this._formSchema = this._buildFormSchema();
    }
  }

  private async _loadSchema() {
    // If exposed is undefined, the service is no longer in the exposed list.
    if (this.exposed === undefined && this.hass) {
      this._exposedMissing = true;
      this._schema = null;
      this._schemaServiceId = null;
      return;
    }
    const id = this.exposed?.id;
    if (!id || !this.hass) {
      this._exposedMissing = false;
      this._schema = undefined;
      this._schemaServiceId = null;
      return;
    }
    this._exposedMissing = false;
    this._schemaServiceId = id;
    this._schemaError = null;
    this._schema = undefined;
    try {
      const schema = await getServiceSchema(this.hass, id);
      // Drop stale responses if `exposed` changed mid-fetch.
      if (this._schemaServiceId !== id) return;
      this._schema = schema;
    } catch (e) {
      if (this._schemaServiceId !== id) return;
      this._schema = null;
      this._schemaError = e instanceof Error ? e.message : String(e);
    }
  }

  /**
   * Intersection of `exposed.visible_fields` and `serviceSchema.fields`,
   * mapped to ha-form's schema-entry shape. Entries are ordered as in
   * `visible_fields` so the user sees them in the order they configured.
   */
  private _buildFormSchema(): HaFormSchemaEntry[] {
    const schema = this._schema;
    const exposed = this.exposed;
    if (!schema || !exposed) return [];
    const out: HaFormSchemaEntry[] = [];
    for (const name of exposed.visible_fields ?? []) {
      const field = schema.fields[name];
      if (!field) continue;
      out.push({
        name,
        selector: field.selector ?? { text: {} },
        required: !!field.required,
        description:
          typeof field.description === "string" && field.description
            ? field.description
            : undefined,
      });
    }
    return out;
  }

  override updated(changed: Map<string, unknown>) {
    super.updated?.(changed);
    if (changed.has("_schema")) {
      this.dispatchEvent(
        new CustomEvent("target-mode-changed", {
          detail: { hasTarget: this.hasTarget() },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  // --- target picker -------------------------------------------------------

  /** True when the HA service has a target stanza (non-empty object). */
  private _hasTarget(): boolean {
    const t = (this._schema?.target ?? null) as Record<string, unknown> | null;
    if (!t || typeof t !== "object") return false;
    return Object.keys(t).length > 0;
  }

  /**
   * Public accessor for the parent to query whether this slot's service
   * requires a target. Returns:
   *   - true  when schema is loaded and has a non-empty target stanza
   *   - false when schema is loaded and has no target (service like notify.send_message)
   *   - false when schema is still loading (conservative — don't fail validation on a pending fetch)
   */
  hasTarget(): boolean {
    if (this._schema === undefined) return false; // still loading → conservative
    return this._hasTarget();
  }

  private _scopeEntities(): string[] {
    if (!this.scope || !this.hass) return [];
    // No domain filter at this layer — the target picker intersects with
    // the HA service `target` metadata via filterEntities.
    return entitiesForScope(this.hass, this.scope, []);
  }

  private _onTargetChanged = (e: CustomEvent<{ value: string[] }>) => {
    e.stopPropagation();
    this._emit("entity-ids-changed", { entityIds: e.detail.value });
  };

  private _renderTargetPicker() {
    if (!this._hasTarget()) return "";
    const entities = this._scopeEntities();
    const target = (this._schema?.target ?? null) as HaTarget;
    const label = localize(this.hass, "ui.target", "Target");
    return html`
      <div class="target-picker">
        <ambience-target-picker
          .hass=${this.hass}
          .entities=${entities}
          .target=${target}
          .value=${this.entityIds}
          .label=${label}
          @value-changed=${this._onTargetChanged}
        ></ambience-target-picker>
      </div>
    `;
  }

  // --- field form ----------------------------------------------------------

  private _onFieldInput = (key: string) => (e: Event) => {
    e.stopPropagation();
    const t = e.target as HTMLInputElement;
    const next = { ...this.params, [key]: t.value };
    this._emit("params-changed", { params: next });
  };

  /* v8 ignore start -- ha-form path (real HA only) */
  private _onHaFormChanged = (
    e: CustomEvent<{ value: Record<string, unknown> }>,
  ) => {
    e.stopPropagation();
    this._emit("params-changed", { params: { ...this.params, ...e.detail.value } });
  };
  /* v8 ignore stop */

  /** Human label for a field: prefers HA's `name` attribute; otherwise humanizes the id. */
  private _humanizeFieldLabel(fieldName: string): string {
    const field = this._schema?.fields[fieldName];
    if (field?.name) return field.name;
    // Humanize: "brightness_pct" → "Brightness pct", "transition" → "Transition"
    const spaced = fieldName.replaceAll("_", " ").toLowerCase();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }

  private _fieldLabel(key: string): string {
    return this._humanizeFieldLabel(key);
  }

  private _renderFieldsForm() {
    const schema = this._formSchema;
    if (schema.length === 0) return "";
    // Seed the form data from current params, falling back to "" so
    // controlled inputs render.
    const data: Record<string, unknown> = {};
    for (const entry of schema) {
      data[entry.name] = this.params[entry.name] ?? "";
    }
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      return html`
        <div class="fields-form">
          <ha-form
            .hass=${this.hass}
            .schema=${schema}
            .data=${data}
            .computeLabel=${(entry: HaFormSchemaEntry) => this._humanizeFieldLabel(entry.name)}
            @value-changed=${this._onHaFormChanged}
          ></ha-form>
        </div>
      `;
    }
    /* v8 ignore stop */
    // jsdom fallback — text inputs per visible field, so headless tests
    // can still drive the slot.
    return html`
      <div class="fields-form">
        ${schema.map(
          (entry) => html`
            <div class="field-row">
              <label>${this._fieldLabel(entry.name)}${entry.required ? " *" : ""}</label>
              <input
                type="text"
                data-field=${entry.name}
                .value=${String(this.params[entry.name] ?? "")}
                @input=${this._onFieldInput(entry.name)}
              />
            </div>
          `,
        )}
      </div>
    `;
  }

  // --- render --------------------------------------------------------------

  private _emit(name: string, detail: Record<string, unknown>) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  override render() {
    if (this._schema === null) {
      if (this._exposedMissing) {
        return html`
          <div class="schema-error">
            ${localize(
              this.hass,
              "ui.service_not_exposed",
              "Service no longer exposed; configure it in Settings → Actions or remove this action.",
            )}
          </div>
        `;
      }
      return html`
        <div class="schema-error">
          ${this._schemaError ??
            localize(
              this.hass,
              "ui.service_unavailable",
              "Service not available in this HA instance.",
            )}
        </div>
      `;
    }
    if (this._schema === undefined) {
      return html`<div>${localize(this.hass, "ui.loading", "Loading…")}</div>`;
    }
    const target = this._renderTargetPicker();
    const fields = this._renderFieldsForm();
    if (target === "" && fields === "") {
      return html`<div class="no-params">${localize(
        this.hass,
        "ui.action_no_parameters",
        "This action has no configurable fields.",
      )}</div>`;
    }
    return html`${target}${fields}`;
  }
}
