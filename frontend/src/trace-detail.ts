import { css, html, nothing, type TemplateResult } from "lit";
import {
  conditionLabel,
  deriveActionLabel,
  humanizeId,
  periodLabel,
  weatherConditionLabel,
} from "./i18n.js";
import { entityDisplayName, formatArgValue, paramLabel } from "./summary.js";
import type { BufferedUnit, ServiceSchema, TraceCause, TraceRuleEval } from "./types.js";

type Action = { service: string; entity_ids?: string[]; params?: Record<string, unknown> };

type HassLike = { localize?: (key: string) => string | undefined; [key: string]: unknown };

// A predicate's `detail` is the condition's `describe()` output. Most conditions
// already return a human phrase (e.g. "3 of 5 home (Alice, Bob)"); a couple
// emit a raw enum id that needs a friendly label. Humanize only those — passing
// the human phrases through untouched (humanizeId would lower-case them).
function formatDetail(hass: HassLike | undefined, conditionKey: string, detail: string): string {
  if (conditionKey === "time_of_day") return periodLabel(hass, detail, {});
  if (conditionKey === "weather") return weatherConditionLabel(hass, detail);
  return detail;
}

// Styles for the evaluation card; hosts include this in their `static styles`.
export const traceDetailStyles = css`
  .eval { border: 1px solid var(--divider-color, #444); border-radius: 8px; padding: 0.7rem 0.9rem; }
  .eval .top { display: flex; align-items: baseline; gap: 0.5rem; }
  .eval .cause { flex: 1; font-family: monospace; font-size: 0.85rem; }
  .eval .ts { color: var(--secondary-text-color, #888); font-size: 0.75rem; }
  .outcome { font-size: 0.72rem; text-transform: uppercase; padding: 1px 7px; border-radius: 4px;
    background: var(--secondary-background-color, #333); color: var(--secondary-text-color, #aaa); }
  .outcome.acted { background: var(--success-color, #4caf50); color: #fff; }
  .outcome.reapplied { background: var(--info-color, #2196f3); color: #fff; }
  .won { margin-top: 0.4rem; }
  .won .name { color: var(--success-color, #4caf50); font-weight: 600; }
  .action-summary { margin-top: 0.2rem; font-family: monospace; font-size: 0.82rem;
    color: var(--secondary-text-color, #bbb); }
  .action-summary .n { color: var(--secondary-text-color, #888); }
  .why-toggle { background: none; border: none; color: var(--primary-color, #03a9f4); cursor: pointer;
    padding: 0.3rem 0; font-size: 0.82rem; }
  .why { margin-top: 0.6rem; padding: 0.2rem 0 0.2rem 0.9rem;
    border-left: 2px solid var(--divider-color, #444); }
  .section + .section { margin-top: 1.25rem; }
  .section-title { font-size: 0.95rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.05em; color: var(--primary-text-color, #fff); margin-bottom: 0.5rem; }
  .rules { font-family: monospace; font-size: 0.8rem; line-height: 1.7; }
  .rule.won { color: var(--success-color, #4caf50); }
  .rule.skipped { opacity: 0.5; }
  .pred.pass { color: var(--success-color, #4caf50); }
  .pred.fail { color: var(--error-color, #e57373); }
  .pred .dim { color: var(--secondary-text-color, #888); }
  .action-block { font-family: monospace; font-size: 0.8rem; line-height: 1.6; margin-bottom: 0.3rem; }
  .action-head { color: var(--primary-text-color, #ddd); }
  .action-block .entity { padding-left: 1rem; color: var(--secondary-text-color, #aaa); }
`;

export function formatCause(c: TraceCause): string {
  if (c.kind === "entity") return `${c.entity_id} ${c.old} → ${c.new}`;
  if (c.detail) return `${humanizeId(c.kind)} ${c.detail}`;
  return humanizeId(c.kind);
}

// The action's humanized service label plus its params (key: value) — NOT its
// entities (those are listed one-per-line beneath it in the "Actions taken"
// section). e.g. `light.turn_on {brightness_pct: 60}` → "Turn on light ·
// Brightness: 60". Param keys use the service schema's `field.name` when
// `schemas` is supplied, else fall back to the humanized field id.
export function formatActionHeader(
  a: Action,
  hass?: HassLike,
  schemas?: Record<string, ServiceSchema>,
): string {
  const params = Object.entries(a.params ?? {})
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${paramLabel(k, a.service, schemas)}: ${formatArgValue(hass, v)}`)
    .join(", ");
  const label = deriveActionLabel(a.service);
  return params ? `${label} · ${params}` : label;
}

function entityCount(actions: Action[]): number {
  return actions.reduce((n, a) => n + (a.entity_ids?.length ?? 0), 0);
}

function renderRule(r: TraceRuleEval, hass: HassLike | undefined): TemplateResult {
  // `index` is the 0-based position in the rule list; rule numbers are shown 1-based.
  const num = r.index + 1;
  if (r.disabled) {
    return html`<div class="rule disabled">Rule #${num} ${r.name ?? "—"}: disabled</div>`;
  }
  if (!r.evaluated) {
    return html`<div class="rule skipped">Rule #${num} ${r.name ?? "—"}: not evaluated</div>`;
  }
  return html`
    <div class="rule ${r.matched ? "won" : ""}">Rule #${num} ${r.name ?? "—"}: ${r.matched ? "WON" : "no"}</div>
    ${r.predicates.map(
      (p) => html`
        <div class="pred ${p.passed ? "pass" : "fail"}" style="padding-left:1rem">
          ${p.passed ? "✓" : "✗"} ${conditionLabel(hass, p.condition_key)}${
            p.detail
              ? html` <span class="dim">[${formatDetail(hass, p.condition_key, p.detail)}]</span>`
              : nothing
          }
        </div>`,
    )}
  `;
}

// One evaluation card. Stateless: the host owns the expanded set and toggle.
export function renderEvaluation(
  u: BufferedUnit,
  expanded: boolean,
  onToggle: () => void,
  hass?: HassLike,
  schemas?: Record<string, ServiceSchema>,
): TemplateResult {
  const services = u.actions.map((a) => deriveActionLabel(a.service)).join(", ");
  const n = entityCount(u.actions);
  const canExpand = u.explanation !== null || u.actions.length > 0;
  return html`
    <div class="eval">
      <div class="top">
        <span class="outcome ${u.outcome}">${u.outcome.replace(/_/g, " ")}</span>
        <span class="cause">${formatCause(u.cause)}</span>
        <span class="ts">${u.timestamp ? new Date(u.timestamp).toLocaleTimeString() : ""}</span>
      </div>
      ${u.winner_name ? html`<div class="won">Won: <span class="name">${u.winner_name}</span></div>` : nothing}
      ${
        u.actions.length
          ? html`<div class="action-summary">→ ${services}
            ${n ? html`<span class="n">· ${n} ${n === 1 ? "entity" : "entities"}</span>` : nothing}</div>`
          : nothing
      }
      ${
        canExpand
          ? html`<button class="why-toggle" @click=${onToggle}>
            ${
              expanded
                ? "▾ Hide details"
                : u.explanation
                  ? u.winner_name
                    ? `▸ Why this rule won (${u.explanation.rules.length} rules)`
                    : `▸ Why nothing matched (${u.explanation.rules.length} rules)`
                  : "▸ Details"
            }
          </button>`
          : nothing
      }
      ${expanded ? renderExpansion(u, hass, schemas) : nothing}
    </div>
  `;
}

function renderExpansion(
  u: BufferedUnit,
  hass: HassLike | undefined,
  schemas: Record<string, ServiceSchema> | undefined,
): TemplateResult {
  return html`
    <div class="why">
      ${
        u.explanation
          ? html`<div class="section">
            <div class="section-title">Rule evaluation</div>
            <div class="rules">${u.explanation.rules.map((r) => renderRule(r, hass))}</div>
          </div>`
          : nothing
      }
      ${
        u.actions.length
          ? html`<div class="section">
            <div class="section-title">Actions taken</div>
            ${u.actions.map(
              (a) => html`<div class="action-block">
                <div class="action-head">${formatActionHeader(a, hass, schemas)}</div>
                ${(a.entity_ids ?? []).map(
                  (e) => html`<div class="entity">${entityDisplayName(hass, e)}</div>`,
                )}
              </div>`,
            )}
          </div>`
          : nothing
      }
    </div>
  `;
}
