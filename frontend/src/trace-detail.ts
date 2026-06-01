import { html, css, nothing, type TemplateResult } from "lit";

import type { BufferedUnit, TraceCause, TraceRuleEval } from "./types.js";
import { humanizeId } from "./i18n.js";

type Action = { service: string; entity_ids?: string[]; params?: Record<string, unknown> };

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
  .why { margin-top: 0.3rem; }
  .section + .section { margin-top: 0.6rem; }
  .section-title { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.04em;
    color: var(--secondary-text-color, #888); margin-bottom: 0.2rem; }
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

// The action's service plus its params — NOT its entities (those are listed
// one-per-line beneath it in the "Actions taken" section).
export function formatActionHeader(a: Action): string {
  const params = a.params && Object.keys(a.params).length ? ` ${JSON.stringify(a.params)}` : "";
  return `${a.service}${params}`;
}

function entityCount(actions: Action[]): number {
  return actions.reduce((n, a) => n + (a.entity_ids?.length ?? 0), 0);
}

function renderRule(r: TraceRuleEval): TemplateResult {
  if (!r.evaluated) {
    return html`<div class="rule skipped">rule #${r.index} ${r.name ?? "—"}: not evaluated</div>`;
  }
  return html`
    <div class="rule ${r.matched ? "won" : ""}">rule #${r.index} ${r.name ?? "—"}: ${r.matched ? "WON" : "no"}</div>
    ${r.predicates.map(
      (p) => html`
        <div class="pred ${p.passed ? "pass" : "fail"}" style="padding-left:1rem">
          ${p.passed ? "✓" : "✗"} ${p.matcher_key}${p.detail ? html` <span class="dim">[${p.detail}]</span>` : nothing}
        </div>`,
    )}
  `;
}

// One evaluation card. Stateless: the host owns the expanded set and toggle.
export function renderEvaluation(
  u: BufferedUnit,
  expanded: boolean,
  onToggle: () => void,
): TemplateResult {
  const services = u.actions.map((a) => a.service).join(", ");
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
      ${u.actions.length
        ? html`<div class="action-summary">→ ${services}
            ${n ? html`<span class="n">· ${n} ${n === 1 ? "entity" : "entities"}</span>` : nothing}</div>`
        : nothing}
      ${canExpand
        ? html`<button class="why-toggle" @click=${onToggle}>
            ${expanded
              ? "▾ Hide details"
              : u.explanation
                ? u.winner_name
                  ? `▸ Why this rule won (${u.explanation.rules.length} rules)`
                  : `▸ Why nothing matched (${u.explanation.rules.length} rules)`
                : "▸ Details"}
          </button>`
        : nothing}
      ${expanded ? renderExpansion(u) : nothing}
    </div>
  `;
}

function renderExpansion(u: BufferedUnit): TemplateResult {
  return html`
    <div class="why">
      ${u.explanation
        ? html`<div class="section">
            <div class="section-title">Rule evaluation</div>
            <div class="rules">${u.explanation.rules.map((r) => renderRule(r))}</div>
          </div>`
        : nothing}
      ${u.actions.length
        ? html`<div class="section">
            <div class="section-title">Actions taken</div>
            ${u.actions.map(
              (a) => html`<div class="action-block">
                <div class="action-head">${formatActionHeader(a)}</div>
                ${(a.entity_ids ?? []).map((e) => html`<div class="entity">${e}</div>`)}
              </div>`,
            )}
          </div>`
        : nothing}
    </div>
  `;
}
