import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { resolveTargetInScope, targetIsEmpty } from "../action-target.js";
import { getServiceSchema, type HassConnection } from "../api.js";
import { entitiesForScope, type HaTarget } from "../entities-for-scope.js";
import { watchHaComponents } from "../ha-components.js";
import { areaName, floorName } from "../hass-names.js";
import { humanizeId, localize, localizeWsError } from "../i18n.js";
import { formatArgValue, formatParamValue, selectorUnit } from "../summary.js";
import type { ActionTargetValue, ExposedAction, Scope, ServiceSchema } from "../types.js";
import "./target-picker.js";
import type { HaFormSchemaEntry } from "../ha-form.js";

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
 *   - `target-changed`     { target: ActionTargetValue }
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
    .raw-config {
      margin: 0.25rem 0 0.5rem 0;
      padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--secondary-background-color, #f5f5f5);
      font-size: 0.85rem;
    }
    .raw-config .raw-row {
      display: flex;
      gap: 0.5rem;
      padding: 0.1rem 0;
    }
    .raw-config dt {
      flex: 0 0 auto;
      font-weight: 600;
      color: var(--secondary-text-color, #888);
    }
    .raw-config dd {
      margin: 0;
      overflow-wrap: anywhere;
      font-family: var(--code-font-family, monospace);
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
    .field-header {
      display: flex;
      align-items: center;
      margin: 0.5rem 0 0.25rem 0;
    }
    .field-label-group {
      flex: 1;
    }
    .field-label {
      font-weight: 600;
    }
    .field-clear {
      flex: 0 0 auto;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color, #888);
      font-size: 1rem;
      padding: 0 0.25rem;
      line-height: 1;
    }
    .field-clear:hover {
      color: var(--error-color, #c62828);
    }
    .field-default-hint {
      font-size: 0.85rem;
      color: var(--secondary-text-color, #888);
      font-style: italic;
    }
    .extra-params-notice {
      margin-top: 0.5rem;
      padding: 0.4rem 0.6rem;
      border: 1px solid var(--warning-color, #cc9);
      background: var(--warning-color, #ffd);
      border-radius: 4px;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .extra-params-notice button {
      background: transparent;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 3px;
      cursor: pointer;
      padding: 0.15rem 0.5rem;
      font: inherit;
      color: inherit;
    }
    .count-preview {
      font-size: 0.85rem;
      color: var(--secondary-text-color, #888);
      margin-top: 0.25rem;
      padding: 0.1rem 0;
    }
    .count-preview.warn {
      color: var(--warning-color, #e65100);
    }
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) scope?: Scope;
  @property({ attribute: false }) exposed?: ExposedAction;
  /** The action's service id, carried separately from `exposed` so it survives
   *  when the service is no longer exposed (`exposed` undefined) and we still
   *  want to show the stored config. */
  @property({ attribute: false }) service?: string;
  @property({ attribute: false }) target: ActionTargetValue = {};
  @property({ attribute: false }) params: Record<string, unknown> = {};

  @state() private _schema: ServiceSchema | null | undefined = undefined;
  @state() private _schemaError: string | null = null;
  /** True when `exposed` is undefined (no entry in the exposed-action list). */
  @state() private _exposedMissing = false;
  /** Cached form schema; rebuilt only when inputs change. */
  @state() private _formSchema: HaFormSchemaEntry[] = [];
  /** Per-field schemas (length-1 arrays) keyed by field name; memoised to
   *  prevent ha-form from re-initialising the selector mid-edit. */
  @state() private _perFieldSchemas: Record<string, HaFormSchemaEntry[]> = {};
  /** Service id that `_schema` was loaded for; guards against stale assigns
   *  when `exposed` changes mid-fetch. */
  private _schemaServiceId: string | null = null;

  override connectedCallback() {
    super.connectedCallback();
    watchHaComponents(this);
  }

  override willUpdate(changed: Map<string, unknown>) {
    if (
      (changed.has("exposed") &&
        (changed.get("exposed") as ExposedAction | undefined)?.id !== this.exposed?.id) ||
      // hass is replaced on every HA state change; without the _schemaServiceId
      // guard each update fired another identical get_schema call while the
      // first was still in flight.
      (changed.has("hass") &&
        this._schema === undefined &&
        this._schemaServiceId !== this.exposed?.id)
    ) {
      void this._loadSchema();
    }
    if (changed.has("exposed") || changed.has("_schema")) {
      this._formSchema = this._buildFormSchema();
    }
    if (changed.has("_formSchema") || changed.has("_schema") || changed.has("exposed")) {
      const next: Record<string, HaFormSchemaEntry[]> = {};
      for (const entry of this._formSchema) {
        next[entry.name] = [entry];
      }
      this._perFieldSchemas = next;
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
      this._schemaError = localizeWsError(this.hass, e);
    }
  }

  /**
   * Intersection of `exposed.visible_fields` and `serviceSchema.fields`,
   * mapped to ha-form's schema-entry shape. Iteration order follows the HA
   * service schema (services.yaml declaration order), filtered by
   * `visible_fields` membership — so the scene editor renders fields in the
   * same order as HA's own service UI, regardless of the order the user
   * toggled them in settings.
   */
  private _buildFormSchema(): HaFormSchemaEntry[] {
    const schema = this._schema;
    const exposed = this.exposed;
    if (!schema || !exposed) return [];
    const visible = new Set(exposed.visible_fields ?? []);
    const out: HaFormSchemaEntry[] = [];
    for (const [name, field] of Object.entries(schema.fields)) {
      if (!visible.has(name)) continue;
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

  /** Scope-filtered entity list for the fallback entity picker (HA < 2026.1).
   *  On modern HA this is passed but unused by the target picker. */
  private _scopeEntities(): string[] {
    if (!this.hass || !this.scope) return [];
    return entitiesForScope(this.hass, this.scope, []);
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

  private _onTargetChanged = (e: CustomEvent<{ value: ActionTargetValue }>) => {
    e.stopPropagation();
    this._emit("target-changed", { target: e.detail.value });
  };

  private _resolvedCount(): number {
    if (!this.hass || !this.scope) return 0;
    return resolveTargetInScope(this.hass as any, this.scope, this.target ?? {}).length;
  }

  private _renderCountPreview() {
    if (targetIsEmpty(this.target ?? {})) return "";
    const n = this._resolvedCount();
    const scope = this.scope;
    const scopeName =
      !scope || scope.kind === "house"
        ? localize(this.hass, "ui.house", "House")
        : scope.kind === "area"
          ? areaName(this.hass as any, scope.id)
          : floorName(this.hass as any, scope.id);
    const text = localize(
      this.hass,
      "ui.target_resolves_count",
      "→ resolves to {n} entities in {scope}",
      { n: String(n), scope: scopeName },
    );
    return html`<div class=${classMap({ "count-preview": true, warn: n === 0 })} data-count-preview>${text}</div>`;
  }

  private _renderTargetPicker() {
    if (!this._hasTarget()) return "";
    const haTarget = (this._schema?.target ?? null) as HaTarget;
    const label = localize(this.hass, "ui.target", "Target");
    return html`
      <div class="target-picker field-row">
        <div class="field-header">
          <span class="field-label">${label}</span>
        </div>
        <ambience-target-picker
          .hass=${this.hass}
          .target=${haTarget}
          .value=${this.target ?? {}}
          .label=${" "}
          .entities=${this._scopeEntities()}
          @value-changed=${this._onTargetChanged}
        ></ambience-target-picker>
        ${this._renderCountPreview()}
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
  private _onHaFormChanged = (e: CustomEvent<{ value: Record<string, unknown> }>) => {
    e.stopPropagation();
    this._emit("params-changed", { params: { ...this.params, ...e.detail.value } });
  };
  /* v8 ignore stop */

  /** Human label for a field: prefers HA's `name` attribute; otherwise humanizes the id. */
  private _humanizeFieldLabel(fieldName: string): string {
    const field = this._schema?.fields[fieldName];
    if (field?.name) return field.name;
    // Humanize: "brightness_pct" → "Brightness pct", "transition" → "Transition"
    return humanizeId(fieldName);
  }

  private _clearField(name: string) {
    if (!(name in this.params)) return;
    const next = { ...this.params };
    delete next[name];
    this._emit("params-changed", { params: next });
  }

  /** Keys present in `params` that are neither in the current schema's
   *  visible fields nor in `exposed.defaults`. These are typically left over
   *  from a settings edit where a previously-visible field was hidden.
   *  The dispatcher will still send them at execution. */
  private _extraParamKeys(): string[] {
    const exposedKeys = new Set<string>();
    for (const entry of this._formSchema) exposedKeys.add(entry.name);
    for (const k of Object.keys(this.exposed?.defaults ?? {})) exposedKeys.add(k);
    return Object.keys(this.params).filter((k) => !exposedKeys.has(k));
  }

  private _clearExtraParams() {
    const extras = new Set(this._extraParamKeys());
    if (extras.size === 0) return;
    const next: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(this.params)) {
      if (!extras.has(k)) next[k] = v;
    }
    this._emit("params-changed", { params: next });
  }

  /** Build the ha-form data for a single field row.
   *
   * Only includes user-set overrides from `this.params`. Settings defaults are
   * intentionally NOT pre-filled here — they are displayed as a separate hint
   * beside the field label so the user can distinguish "using default" from
   * "explicitly set to this value".
   */
  private _fieldData(name: string): Record<string, unknown> {
    if (name in this.params) return { [name]: this.params[name] };
    // else: leave key out — the field renders empty; the default is shown
    // as a sibling hint (see _renderFieldsForm below)
    return {};
  }

  /** Compose the default hint suffix: " (Default: <value> <unit>)" or "". */
  private _defaultHintSuffix(entry: HaFormSchemaEntry): string {
    const defaults = this.exposed?.defaults ?? {};
    if (!(entry.name in defaults)) return "";
    const unit = selectorUnit(entry.selector);
    const value = formatArgValue(this.hass, defaults[entry.name]);
    const prefix = localize(this.hass, "ui.default_prefix", "Default: ");
    return ` (${prefix}${value}${unit ? ` ${unit}` : ""})`;
  }

  /** Whether to show the per-field ✕ clear button.
   *
   * Only when the user has set a distinct value on the scene (something to
   * clear back to the default). Pure-default rows have nothing to clear. */
  private _hasUserOverride(name: string): boolean {
    return name in this.params;
  }

  private _renderExtraParamsNotice() {
    const extras = this._extraParamKeys();
    if (extras.length === 0) return "";
    const list = extras.join(", ");
    return html`
      <div class="extra-params-notice" data-extra-params>
        <span>
          ${localize(this.hass, "ui.extra_fields_prefix", "Extra fields:")} ${list}.
          ${localize(
            this.hass,
            "ui.extra_fields_hint",
            "These fields aren't currently exposed but will still be sent.",
          )}
        </span>
        <button data-remove-extras @click=${() => this._clearExtraParams()}>
          ${localize(this.hass, "ui.remove", "Remove")}
        </button>
      </div>
    `;
  }

  private _renderFieldsForm() {
    const schema = this._formSchema;
    const extrasNotice = this._renderExtraParamsNotice();
    if (schema.length === 0) {
      // No visible fields — still render the extras notice on its own if any.
      return extrasNotice === "" ? "" : html`<div class="fields-form">${extrasNotice}</div>`;
    }

    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      return html`
        <div class="fields-form">
          ${schema.map((entry) => {
            const fieldSchema = this._perFieldSchemas[entry.name] ?? [entry];
            const fieldData = this._fieldData(entry.name);
            const hint = this._defaultHintSuffix(entry);
            return html`
              <div class="field-row">
                <div class="field-header">
                  <span class="field-label-group">
                    <span class="field-label">${this._humanizeFieldLabel(entry.name)}${entry.required ? " *" : ""}</span>${
                      hint ? html`<span class="field-default-hint">${hint}</span>` : ""
                    }
                  </span>
                  ${
                    this._hasUserOverride(entry.name)
                      ? html`<button
                        class="field-clear"
                        data-clear=${entry.name}
                        @click=${() => this._clearField(entry.name)}
                        title=${localize(this.hass, "ui.clear_default", "Clear default")}
                      >✕</button>`
                      : ""
                  }
                </div>
                <ha-form
                  .hass=${this.hass}
                  .schema=${fieldSchema}
                  .data=${fieldData}
                  .computeLabel=${() => ""}
                  @value-changed=${this._onHaFormChanged}
                ></ha-form>
              </div>
            `;
          })}
          ${extrasNotice}
        </div>
      `;
    }
    /* v8 ignore stop */
    // jsdom fallback — text inputs per visible field, so headless tests
    // can still drive the slot.
    return html`
      <div class="fields-form">
        ${schema.map((entry) => {
          const fieldData = this._fieldData(entry.name);
          const displayValue = entry.name in fieldData ? String(fieldData[entry.name] ?? "") : "";
          const hint = this._defaultHintSuffix(entry);
          return html`
              <div class="field-row">
                <div class="field-header">
                  <span class="field-label-group">
                    <label class="field-label">${this._humanizeFieldLabel(entry.name)}${entry.required ? " *" : ""}</label>${
                      hint ? html`<span class="field-default-hint">${hint}</span>` : ""
                    }
                  </span>
                  ${
                    this._hasUserOverride(entry.name)
                      ? html`<button
                        class="field-clear"
                        data-clear=${entry.name}
                        @click=${() => this._clearField(entry.name)}
                        title=${localize(this.hass, "ui.clear_default", "Clear default")}
                      >✕</button>`
                      : ""
                  }
                </div>
                <input
                  type="text"
                  data-field=${entry.name}
                  .value=${displayValue}
                  @input=${this._onFieldInput(entry.name)}
                />
              </div>
            `;
        })}
        ${extrasNotice}
      </div>
    `;
  }

  // --- render --------------------------------------------------------------

  private _emit(name: string, detail: Record<string, unknown>) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  /**
   * Read-only dump of the action's stored config (service id, target entity
   * ids, params), shown beneath the error when the service is deleted or
   * unavailable — so the user can see what to recreate. Raw stored values
   * only; no friendly-name lookups.
   */
  private _renderRawConfig() {
    // Prefer the `service` prop (survives the action being un-exposed); fall
    // back to exposed.id (service registered but its schema is unavailable).
    const serviceId = this.service ?? this.exposed?.id;
    if (!serviceId) return "";
    const params = Object.entries(this.params ?? {});
    // this.target is already the normalized ActionTargetValue bound from the editor.
    const targetEntityIds = this.target?.entity_id ?? [];
    const hasTarget = !targetIsEmpty(this.target ?? {});
    return html`
      <dl class="raw-config" data-raw-config>
        <div class="raw-row">
          <dt>${localize(this.hass, "ui.raw_config_action", "Action")}:</dt>
          <dd>${serviceId}</dd>
        </div>
        ${
          hasTarget
            ? html`<div class="raw-row">
                <dt>${localize(this.hass, "ui.raw_config_targets", "Targets")}:</dt>
                <dd>${targetEntityIds.length ? targetEntityIds.join(", ") : JSON.stringify(this.target)}</dd>
              </div>`
            : ""
        }
        ${
          params.length
            ? html`<div class="raw-row">
                <dt>${localize(this.hass, "ui.raw_config_params", "Parameters")}:</dt>
                <dd>${params.map(([k, v]) => `${k}: ${v == null ? "" : formatParamValue(v)}`).join(", ")}</dd>
              </div>`
            : ""
        }
      </dl>
    `;
  }

  override render() {
    if (this._schema === null) {
      const errorMessage = this._exposedMissing
        ? localize(
            this.hass,
            "ui.action_unavailable",
            "Action no longer available; configure it in Settings → Actions or remove this action.",
          )
        : (this._schemaError ??
          localize(
            this.hass,
            "ui.service_unavailable",
            "Service not available in this HA instance.",
          ));
      return html`
        <div class="schema-error">${errorMessage}</div>
        ${this._renderRawConfig()}
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
