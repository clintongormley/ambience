import { html, type TemplateResult } from "lit";

import type { HassConnection } from "../api.js";
import type { HaFormSchema } from "../ha-form.js";

/**
 * Shared form controls for predicate inputs, each rendering an `ha-form` widget
 * in real Home Assistant and a self-contained native fallback in tests / older
 * HA. Centralising the ha-form-with-fallback dance keeps a known version-churn
 * point in one place.
 */

/** A single-select dropdown (ha-form `select` → native `<select>` fallback). The
 *  `field` doubles as the element's CSS class (every caller used the same string
 *  for both), so styling/test hooks key off the field name. */
export function renderSelect(
  hass: HassConnection | undefined,
  field: string,
  value: string,
  options: { value: string; label: string }[],
  onChange: (v: string) => void,
): TemplateResult {
  /* v8 ignore start -- ha-form path (real HA only) */
  if (customElements.get("ha-form")) {
    const schema: HaFormSchema[] = [
      { name: field, required: true, selector: { select: { mode: "dropdown", options } } },
    ];
    return html`<ha-form
      class=${field}
      .hass=${hass}
      .schema=${schema}
      .data=${{ [field]: value }}
      .computeLabel=${() => ""}
      @value-changed=${(e: CustomEvent<{ value: Record<string, string | undefined> }>) => {
        e.stopPropagation();
        const v = e.detail.value[field];
        if (v) onChange(v);
      }}
    ></ha-form>`;
  }
  /* v8 ignore stop */
  return html`<select
    class=${field}
    @change=${(e: Event) => onChange((e.target as HTMLSelectElement).value)}
  >
    ${options.map((o) => html`<option value=${o.value} ?selected=${o.value === value}>${o.label}</option>`)}
  </select>`;
}

/** A multi-entity picker (ha-form entity selector → native comma-list `<input>`
 *  fallback). `schema` is the single-field entity selector; `data-field` is
 *  always `sensors`. */
export function renderSensorField(
  hass: HassConnection | undefined,
  schema: HaFormSchema[],
  current: string[],
  placeholder: string,
  onChange: (ids: string[]) => void,
): TemplateResult {
  /* v8 ignore start -- ha-form path (real HA only) */
  if (customElements.get("ha-form")) {
    return html`<ha-form
      class="field"
      data-field="sensors"
      .hass=${hass}
      .schema=${schema}
      .data=${{ sensors: current }}
      .computeLabel=${() => ""}
      @value-changed=${(e: CustomEvent<{ value: { sensors?: string[] } }>) => {
        e.stopPropagation();
        onChange(e.detail.value.sensors ?? []);
      }}
    ></ha-form>`;
  }
  /* v8 ignore stop */
  return html`<input
    class="field"
    data-field="sensors"
    type="text"
    placeholder=${placeholder}
    .value=${current.join(", ")}
    @change=${(e: Event) =>
      onChange(
        (e.target as HTMLInputElement).value
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== ""),
      )}
  />`;
}

/** A single-entity picker (ha-form entity selector → native text `<input>`
 *  fallback). `selector` is the ha-form entity selector spec; the fallback is
 *  a free-text entity-id input. Emits null when cleared. */
export function renderEntityPicker(
  hass: HassConnection | undefined,
  field: string,
  value: string | null,
  selector: Record<string, unknown>,
  placeholder: string,
  onChange: (v: string | null) => void,
): TemplateResult {
  /* v8 ignore start -- ha-form path (real HA only) */
  if (customElements.get("ha-form")) {
    const schema: HaFormSchema[] = [{ name: field, selector }];
    return html`<ha-form
      .hass=${hass}
      .schema=${schema}
      .data=${{ [field]: value ?? "" }}
      .computeLabel=${() => ""}
      @value-changed=${(e: CustomEvent<{ value: Record<string, string | undefined> }>) => {
        e.stopPropagation();
        onChange(e.detail.value[field] || null);
      }}
    ></ha-form>`;
  }
  /* v8 ignore stop */
  return html`<input
    type="text"
    placeholder=${placeholder}
    .value=${value ?? ""}
    @change=${(e: Event) => onChange((e.target as HTMLInputElement).value || null)}
  />`;
}
