import { html, css, nothing, type TemplateResult } from "lit";

import type { BufferedUnit, TraceCause, TraceRuleEval } from "./types.js";
import { humanizeId } from "./i18n.js";

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
  .action { font-family: monospace; font-size: 0.82rem; color: var(--secondary-text-color, #bbb); }
  .why-toggle { background: none; border: none; color: var(--primary-color, #03a9f4); cursor: pointer;
    padding: 0.3rem 0; font-size: 0.82rem; }
  .why { font-family: monospace; font-size: 0.8rem; line-height: 1.7; margin-top: 0.3rem; }
  .why .rule.won { color: var(--success-color, #4caf50); }
  .why .rule.skipped { opacity: 0.5; }
  .pred.pass { color: var(--success-color, #4caf50); }
  .pred.fail { color: var(--error-color, #e57373); }
  .pred .dim { color: var(--secondary-text-color, #888); }
`;

export function formatCause(c: TraceCause): string {
  if (c.kind === "entity") return `${c.entity_id} ${c.old} → ${c.new}`;
  if (c.detail) return `${humanizeId(c.kind)} ${c.detail}`;
  return humanizeId(c.kind);
}

export function formatAction(
  a: { service: string; entity_ids?: string[]; params?: Record<string, unknown> },
): string {
  const target = a.entity_ids?.length ? ` [${a.entity_ids.join(", ")}]` : "";
  const params = a.params && Object.keys(a.params).length ? ` ${JSON.stringify(a.params)}` : "";
  return `${a.service}${target}${params}`;
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
  const firstAction = u.actions[0];
  return html`
    <div class="eval">
      <div class="top">
        <span class="outcome ${u.outcome}">${u.outcome.replace(/_/g, " ")}</span>
        <span class="cause">${formatCause(u.cause)}</span>
        <span class="ts">${u.timestamp ? new Date(u.timestamp).toLocaleTimeString() : ""}</span>
      </div>
      ${u.winner_name
        ? html`<div class="won">Won: <span class="name">${u.winner_name}</span>
            ${firstAction ? html`<span class="action"> → ${formatAction(firstAction)}</span>` : nothing}</div>`
        : nothing}
      ${u.explanation
        ? html`<button class="why-toggle" @click=${onToggle}>
            ${expanded ? "▾ Hide" : u.winner_name ? "▸ Why this rule won" : "▸ Why nothing matched"}
            (${u.explanation.rules.length} rules)
          </button>`
        : nothing}
      ${expanded && u.explanation
        ? html`<div class="why">
            ${u.explanation.rules.map((r) => renderRule(r))}
            ${u.actions.map((a) => html`<div>→ ${formatAction(a)}</div>`)}
          </div>`
        : nothing}
    </div>
  `;
}
