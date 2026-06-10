import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassConnection } from "../api.js";
import { emitValueChanged } from "../dom.js";
import { localize } from "../i18n.js";
import { resultAsBoolean } from "../truthiness.js";
import type { TemplatePredicate } from "../types.js";

type RenderEvent = { result?: unknown; error?: string };
type Preview = { value: string; truthy: boolean } | { error: string };

/** Stringify a rendered template result the way Dev Tools → Template shows it:
 *  objects/arrays as JSON, everything else via String(). */
function formatResult(result: unknown): string {
  if (result !== null && typeof result === "object") {
    try {
      return JSON.stringify(result);
    } catch {
      return String(result);
    }
  }
  return String(result);
}

/**
 * Editor for a `template` condition predicate: a multiline Jinja template that
 * Home Assistant renders against current state and coerces to a boolean.
 *
 * Below the textarea it shows a live render preview — the same
 * `render_template` websocket subscription Dev Tools → Template uses — so the
 * current return value updates as you type and as referenced entities change.
 *
 * Emits `value-changed` with `{ value: { template } }`, or `{ value: null }`
 * (wildcard) when the textarea is empty/whitespace.
 */
@customElement("ambience-template-predicate-input")
export class AmbienceTemplatePredicateInput extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    textarea {
      width: 100%;
      box-sizing: border-box;
      min-height: 4.5rem;
      padding: 0.5rem;
      font-family: var(--code-font-family, monospace);
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: inherit;
      resize: vertical;
    }
    .preview {
      margin-top: 0.5rem;
      border-radius: 4px;
      overflow: hidden;
      background: var(--secondary-background-color, #f5f5f5);
      font-family: var(--code-font-family, monospace);
      font-size: 0.9em;
    }
    .preview .body {
      padding: 0.5rem;
    }
    .preview .label {
      display: block;
      font-family: var(--primary-font-family, inherit);
      font-size: 0.8em;
      color: var(--secondary-text-color, #888);
      margin-bottom: 0.25rem;
    }
    /* pre-wrap only on the value text, so multi-line results are preserved
       without the surrounding markup whitespace leaking into the layout. */
    .preview .value {
      white-space: pre-wrap;
      word-break: break-word;
    }
    .preview.error .value {
      color: var(--error-color, #d32f2f);
    }
    /* Full-width status bar flush to the box edges at the bottom. */
    .preview .bool {
      display: block;
      text-align: center;
      padding: 0.3rem;
      font-family: var(--primary-font-family, inherit);
      font-size: 0.85em;
      color: var(--text-primary-color, #fff);
    }
    .preview .bool.true {
      background: var(--success-color, var(--label-badge-green, #43a047));
    }
    .preview .bool.false {
      background: var(--secondary-text-color, #888);
    }
  `;

  @property({ attribute: false }) value: TemplatePredicate = null;
  @property({ attribute: false }) hass?: HassConnection;

  @state() private _preview: Preview | null = null;

  /** Debounce before (re)subscribing, so typing doesn't spam the connection.
   *  Tests override this to 0. */
  _debounceMs = 250;

  private _unsub?: () => void;
  private _debounceTimer?: ReturnType<typeof setTimeout>;
  // Generation counter so a slow/stale subscription callback is ignored once
  // the template has moved on.
  private _gen = 0;
  // What the live subscription is for. HA replaces the `hass` object on every
  // state change, but `hass.connection` is stable — so we resubscribe only when
  // the template text or the connection itself actually changes, not on every
  // hass churn (which would tear down and re-arm the subscription continuously).
  private _activeTemplate?: string;
  private _activeConn?: unknown;

  private _template(): string {
    return this.value && typeof this.value === "object" ? this.value.template : "";
  }

  override willUpdate(changed: Map<string, unknown>) {
    if (!changed.has("value") && !changed.has("hass")) return;
    const tmpl = this._template();
    const conn = this.hass?.connection;
    if (tmpl === this._activeTemplate && conn === this._activeConn) return;
    this._activeTemplate = tmpl;
    this._activeConn = conn;
    this._scheduleRender();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._teardown();
  }

  private _teardown() {
    if (this._debounceTimer != null) {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = undefined;
    }
    if (this._unsub) {
      this._unsub();
      this._unsub = undefined;
    }
  }

  private _scheduleRender() {
    // Cancel any pending/active subscription for the previous template.
    this._teardown();
    const tmpl = this._template();
    if (!tmpl.trim() || !this.hass?.connection?.subscribeMessage) {
      this._setPreview(null);
      return;
    }
    const gen = ++this._gen;
    this._debounceTimer = setTimeout(() => this._subscribe(tmpl, gen), this._debounceMs);
  }

  private async _subscribe(tmpl: string, gen: number) {
    const conn = this.hass?.connection;
    if (!conn?.subscribeMessage) return;
    try {
      // Call as a method on `conn` — HA's subscribeMessage relies on `this`
      // (it touches the connection's internal queue); a detached call throws.
      const unsub = await conn.subscribeMessage<RenderEvent>(
        (msg) => {
          if (gen !== this._gen) return;
          this._setPreview(
            msg.error != null
              ? { error: msg.error }
              : { value: formatResult(msg.result), truthy: resultAsBoolean(msg.result) },
          );
        },
        { type: "render_template", template: tmpl, report_errors: true },
      );
      if (gen !== this._gen) {
        // Template changed while we were subscribing — drop this one.
        unsub();
        return;
      }
      this._unsub = unsub;
    } catch (e) {
      if (gen !== this._gen) return;
      this._setPreview({ error: (e as Error)?.message ?? String(e) });
    }
  }

  /** Set the preview and notify listeners whether the template currently
   *  errors, so the scene editor can block closing an erroring slot. */
  private _setPreview(p: Preview | null) {
    this._preview = p;
    this._emitValidity(p != null && "error" in p ? p.error : null);
  }

  private _lastValidity: string | null | undefined;

  private _emitValidity(error: string | null) {
    if (this._lastValidity === error) return;
    this._lastValidity = error;
    this.dispatchEvent(
      new CustomEvent("render-invalid-changed", {
        detail: { error },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onInput(e: InputEvent) {
    const raw = (e.target as HTMLTextAreaElement).value;
    const next: TemplatePredicate = raw.trim() === "" ? null : { template: raw };
    this.value = next;
    emitValueChanged(this, next);
  }

  private _renderPreview() {
    const p = this._preview;
    if (p == null) return "";
    if ("error" in p) {
      return html`<div class="preview error">
        <div class="body">
          <span class="label">${localize(this.hass, "ui.template_result", "Result")}</span><span class="value">${p.error}</span>
        </div>
      </div>`;
    }
    return html`<div class="preview">
      <div class="body">
        <span class="label">${localize(this.hass, "ui.template_result", "Result")}</span><span class="value">${p.value}</span>
      </div>
      <span class="bool ${p.truthy ? "true" : "false"}"
        >${
          p.truthy
            ? localize(this.hass, "ui.template_truthy", "true — matches")
            : localize(this.hass, "ui.template_falsy", "false — no match")
        }</span
      >
    </div>`;
  }

  override render() {
    return html`
      <textarea
        spellcheck="false"
        .value=${this._template()}
        placeholder="{{ is_state('binary_sensor.guests','on') }}"
        @input=${this._onInput}
      ></textarea>
      ${this._renderPreview()}
    `;
  }
}
