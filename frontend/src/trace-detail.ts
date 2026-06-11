import { css, html, nothing, type TemplateResult } from "lit";
import {
  conditionLabel,
  deriveActionLabel,
  humanizeId,
  periodLabel,
  stateValueLabel,
  weatherConditionLabel,
} from "./i18n.js";
import { entityDisplayName, formatArgValue, paramLabel } from "./summary.js";
import type {
  BufferedUnit,
  PeriodDef,
  ServiceSchema,
  TraceAction,
  TraceCause,
  TraceOutcome,
  TraceSceneEval,
} from "./types.js";
import type { HassWithStates } from "./views/entity-row.js";

type HassLike = { localize?: (key: string) => string | undefined; [key: string]: unknown };

/** The host's loaded custom-period definitions, threaded through so a custom
 *  period id in a trace detail resolves to its configured label. */
export type CustomPeriods = Record<string, PeriodDef>;

// A predicate's `detail` is the condition's `describe()` output. Most conditions
// already return a human phrase (e.g. "3 of 5 home (Alice, Bob)"); a couple
// emit a raw enum id that needs a friendly label. Humanize only those — passing
// the human phrases through untouched (humanizeId would lower-case them).
function formatDetail(
  hass: HassLike | undefined,
  conditionKey: string,
  detail: string,
  periods: CustomPeriods,
): string {
  if (conditionKey === "time_of_day") return periodLabel(hass, detail, periods);
  if (conditionKey === "weather") return weatherConditionLabel(hass, detail);
  return detail;
}

// Styles for the evaluation card; hosts include this in their `static styles`.
export const traceDetailStyles = css`
  .eval { border: 1px solid var(--divider-color, #444); border-radius: 8px; padding: 0.7rem 0.9rem; }
  .cause-line { font-family: monospace; font-size: 0.85rem; color: var(--secondary-text-color, #bbb); margin-top: 0.2rem; }
  .raw-trigger { font-family: monospace; font-size: 0.8rem; color: var(--secondary-text-color, #bbb); margin-bottom: 0.4rem; }
  /* Full-width status bar (was a lozenge): the label is centred across the bar,
     the timestamp pinned to the right; the whole bar is the expand/collapse hit area. */
  .outcome { position: relative; display: block; box-sizing: border-box; width: 100%;
    padding: 3px 5px; margin: 0 0 5px 0; text-align: center; font-weight: bold;
    font-size: 0.72rem; text-transform: uppercase; border-radius: 4px;
    background: var(--secondary-background-color, #333); color: var(--secondary-text-color, #aaa); }
  .outcome.clickable { cursor: pointer; }
  .outcome.clickable:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 2px; }
  .outcome .ts { position: absolute; right: 5px; top: 50%; transform: translateY(-50%);
    font-weight: normal; font-size: 0.75rem; opacity: 0.85; }
  .outcome.acted { background: var(--success-color, #4caf50); color: #fff; }
  .outcome.reapplied { background: var(--info-color, #2196f3); color: #fff; }
  .outcome.debounced { background: var(--warning-color, #ff9800); color: #fff; }
  .won { margin-top: 0.4rem; }
  .won .name { color: var(--success-color, #4caf50); font-weight: 600; }
  .action-summary { margin-top: 0.2rem; font-family: monospace; font-size: 0.82rem;
    color: var(--secondary-text-color, #bbb); }
  .action-summary .n { color: var(--secondary-text-color, #888); }
  .why { margin-top: 0.6rem; padding: 0.2rem 0 0.2rem 0.9rem;
    border-left: 2px solid var(--divider-color, #444); }
  .outcome-summary { font-size: 0.85rem; color: var(--primary-text-color, #ddd);
    margin-bottom: 0.7rem; }
  .section + .section { margin-top: 1.25rem; }
  .section-title { font-size: 0.95rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.05em; color: var(--primary-text-color, #fff); margin-bottom: 0.5rem; }
  .scenes { font-family: monospace; font-size: 0.8rem; line-height: 1.7; }
  .scene.won { color: var(--success-color, #4caf50); }
  .scene.skipped { opacity: 0.5; }
  .pred.pass { color: var(--success-color, #4caf50); }
  .pred.fail { color: var(--error-color, #e57373); }
  .pred .dim { color: var(--secondary-text-color, #888); }
  .action-block { font-family: monospace; font-size: 0.8rem; line-height: 1.6; margin-bottom: 0.3rem; }
  .action-head { color: var(--primary-text-color, #ddd); }
  .action-block .entity { padding-left: 1rem; color: var(--secondary-text-color, #aaa); }
  .entity-link { cursor: pointer; color: var(--primary-color, #03a9f4); }
  .entity-link:hover { text-decoration: underline; }
  .entity-link:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 2px; }
`;

// Open HA's more-info dialog for an entity. The `hass-more-info` event bubbles
// (composed) up to the <home-assistant> root, which owns the dialog. stopPropagation
// keeps a click on an entity from also toggling the surrounding evaluation card.
function openMoreInfo(e: Event, entityId: string): void {
  e.stopPropagation();
  (e.currentTarget as HTMLElement).dispatchEvent(
    new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }),
  );
}

// `label` text rendered as a keyboard-operable button that opens the more-info
// dialog for `entityId`. Guard e.repeat so a held Space/Enter fires once, like
// <button>. Callers choose the label: the friendly name, or the raw entity_id.
function entityLink(entityId: string, label: string): TemplateResult {
  const onKey = (e: KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && !e.repeat) {
      e.preventDefault();
      openMoreInfo(e, entityId);
    }
  };
  return html`<span
    class="entity-link"
    role="button"
    tabindex="0"
    title="Show more info"
    @click=${(e: Event) => openMoreInfo(e, entityId)}
    @keydown=${onKey}
    >${label}</span
  >`;
}

// An entity's friendly display name as a more-info button.
function clickableEntity(hass: HassLike | undefined, entityId: string): TemplateResult {
  return entityLink(entityId, entityDisplayName(hass, entityId));
}

// Causes whose label is a fixed phrase — the `detail` (a timestamp, an interval,
// "for", …) is internal and not worth showing to the user.
const CAUSE_LABELS_FIXED: Record<string, string> = {
  has_time: "Periodic time check", // template re-checked on the periodic clock sweep
  switch: "Switch turned on",
  manual: "Manual apply",
  startup: "Startup",
  reloaded: "Reloaded",
  reapply: "Periodic refresh",
  simulated: "Simulation",
};

// Causes that keep their `detail` (which boundary fired) after a friendlier label.
const CAUSE_LABELS_WITH_DETAIL: Record<string, string> = {
  clock: "Time of day",
  sun: "Sun position",
};

// A raw value or "?" when the backend sent null (e.g. an entity with no prior
// state). Keeps the raw-trigger line from showing the literal "null" (string
// form) or a confusing blank gap (Lit `html` renders null as empty content).
function rawOrUnknown(v: string | null): string {
  return v ?? "?";
}

export function formatCause(c: TraceCause): string {
  if (c.kind === "entity") return `${c.entity_id} ${rawOrUnknown(c.old)} → ${rawOrUnknown(c.new)}`;
  // A `for:` duration recheck: name the entity, the state it has held, and how
  // long (the detail), e.g. "binary_sensor.motion off for 5m".
  if (c.kind === "duration")
    return `${c.entity_id} ${rawOrUnknown(c.new)} for ${rawOrUnknown(c.detail)}`;
  const fixed = CAUSE_LABELS_FIXED[c.kind];
  if (fixed) return fixed;
  const name = CAUSE_LABELS_WITH_DETAIL[c.kind] ?? humanizeId(c.kind);
  return c.detail ? `${name} ${c.detail}` : name;
}

// Same as {@link formatCause}, but the raw entity_id is a clickable button that
// opens the more-info dialog. Only entity/duration causes carry an entity_id;
// other kinds fall back to the plain-text label.
export function renderCause(c: TraceCause): TemplateResult {
  if (!causeHasRawValues(c) || !c.entity_id) return html`${formatCause(c)}`;
  const name = entityLink(c.entity_id, c.entity_id);
  if (c.kind === "duration")
    return html`${name} ${rawOrUnknown(c.new)} for ${rawOrUnknown(c.detail)}`;
  return html`${name} ${rawOrUnknown(c.old)} → ${rawOrUnknown(c.new)}`;
}

// Cause kinds that carry a raw entity_id + old/new values worth showing
// separately — the only kinds whose friendly label differs from their raw form.
function causeHasRawValues(c: TraceCause): boolean {
  return c.kind === "entity" || c.kind === "duration";
}

// Format an entity/duration cause's old/new state values via HA's formatter
// (falling back to the raw value when hass/stateObj is absent).
function causeStateValues(c: TraceCause, hass?: HassLike): { old: string; new: string } {
  const stateObj = c.entity_id
    ? (hass as HassWithStates | undefined)?.states?.[c.entity_id]
    : undefined;
  const fmt = (v: string | null) => (v === null ? "?" : stateValueLabel(hass, stateObj, null, v));
  return { old: fmt(c.old), new: fmt(c.new) };
}

export function formatCauseFriendly(c: TraceCause, hass?: HassLike): string {
  if (!causeHasRawValues(c)) return formatCause(c);
  const name = c.entity_id ? entityDisplayName(hass, c.entity_id) : "?";
  const v = causeStateValues(c, hass);
  if (c.kind === "duration") return `${name}: ${v.new} for ${c.detail ?? "?"}`;
  return `${name}: ${v.old} → ${v.new}`;
}

// Same as {@link formatCauseFriendly}, but the entity name is a clickable button
// that opens the more-info dialog. Causes without an entity (manual, clock, …)
// fall back to the plain-text friendly label.
export function renderCauseFriendly(c: TraceCause, hass?: HassLike): TemplateResult {
  if (!causeHasRawValues(c) || !c.entity_id) return html`${formatCauseFriendly(c, hass)}`;
  const name = clickableEntity(hass, c.entity_id);
  const v = causeStateValues(c, hass);
  if (c.kind === "duration") return html`${name}: ${v.new} for ${c.detail ?? "?"}`;
  return html`${name}: ${v.old} → ${v.new}`;
}

// Friendly badge text for each outcome. The internal id stays the CSS class
// (so colours don't change); only the displayed word is humanised.
const OUTCOME_LABELS: Record<string, string> = {
  acted: "applied",
  no_op: "blocked",
  debounced: "unchanged",
  no_match: "no match",
  reapplied: "refreshed",
  skipped_switch_off: "skipped",
  skipped_scope_disabled: "skipped",
};

export function outcomeLabel(outcome: TraceOutcome): string {
  return OUTCOME_LABELS[outcome] ?? outcome.replace(/_/g, " ");
}

// A one-line plain-language explanation of what the outcome actually did —
// shown at the top of the expansion so an empty action list or a suppressed
// re-fire reads as a deliberate result, not a gap.
export function outcomeSummary(u: BufferedUnit): string {
  const winner = u.winner_name ?? "The matching scene";
  switch (u.outcome) {
    case "acted": {
      const acts = pluralize(u.actions.length, "action", "actions");
      const e = entityCount(u.actions);
      return e
        ? `Applied ${winner} — ${acts} on ${pluralize(e, "entity", "entities")}.`
        : `Applied ${winner} — ${acts}.`;
    }
    case "no_op":
      return `${winner} matched but has no actions — it blocks lower scenes from applying. Nothing changed.`;
    case "debounced":
      return `${winner} matched, but it's already applied — nothing was re-sent.`;
    case "no_match":
      return "No scene matched — nothing applied.";
    case "reapplied":
      return `Periodic refresh re-sent ${winner}'s actions.`;
    case "skipped_switch_off":
      return "Skipped — the category switch is off.";
    case "skipped_scope_disabled":
      return "Skipped — the scope is disabled.";
    default:
      return "";
  }
}

// The action's humanized service label plus its params (key: value) — NOT its
// entities (those are listed one-per-line beneath it in the "Actions taken"
// section). e.g. `light.turn_on {brightness_pct: 60}` → "Turn on light ·
// Brightness: 60". Param keys use the service schema's `field.name` when
// `schemas` is supplied, else fall back to the humanized field id.
export function formatActionHeader(
  a: TraceAction,
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

function entityCount(actions: TraceAction[]): number {
  return actions.reduce((n, a) => n + (a.entity_ids?.length ?? 0), 0);
}

// "1 entity" / "2 entities" — count plus the correctly-pluralised noun.
function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

// Outcomes where the whole unit's evaluation was skipped (switch off / scope
// disabled). They carry no explanation or actions but still expand to show why.
function isSkipped(outcome: TraceOutcome): boolean {
  return outcome === "skipped_switch_off" || outcome === "skipped_scope_disabled";
}

function renderScene(
  r: TraceSceneEval,
  hass: HassLike | undefined,
  periods: CustomPeriods,
): TemplateResult {
  // `index` is the 0-based position in the scene list; scene numbers are shown 1-based.
  const num = r.index + 1;
  if (r.disabled) {
    return html`<div class="scene disabled">Scene #${num} ${r.name ?? "—"}: disabled</div>`;
  }
  if (!r.evaluated) {
    return html`<div class="scene skipped">Scene #${num} ${r.name ?? "—"}: not reached</div>`;
  }
  return html`
    <div class="scene ${r.matched ? "won" : ""}">Scene #${num} ${r.name ?? "—"}: ${r.matched ? "✓ matched" : "✗ no match"}</div>
    ${r.predicates.map(
      (p) => html`
        <div class="pred ${p.passed ? "pass" : "fail"}" style="padding-left:1rem">
          ${p.passed ? "✓" : "✗"} ${conditionLabel(hass, p.condition_key)}${
            p.detail
              ? html` <span class="dim">[${formatDetail(hass, p.condition_key, p.detail, periods)}]</span>`
              : nothing
          }
        </div>`,
    )}
  `;
}

// One evaluation card. Stateless: the host owns the expanded set and toggle.
// Only the `.outcome` status bar is the toggle target — the body text and the
// expanded `.why` panel are siblings outside it, so detail text stays selectable
// and a stray click on it never collapses the card.
export function renderEvaluation(
  u: BufferedUnit,
  expanded: boolean,
  onToggle: () => void,
  hass?: HassLike,
  schemas?: Record<string, ServiceSchema>,
  periods: CustomPeriods = {},
): TemplateResult {
  const services = u.actions.map((a) => deriveActionLabel(a.service)).join(", ");
  const n = entityCount(u.actions);
  // Skipped units have no explanation or actions, but still expand to reveal the
  // one-line reason (switch off / scope disabled).
  const canExpand = u.explanation !== null || u.actions.length > 0 || isSkipped(u.outcome);
  const onKey = (e: KeyboardEvent) => {
    // Guard e.repeat so holding Space doesn't fire the toggle on every
    // key-repeat (a native <button> activates once, on keyup).
    if ((e.key === "Enter" || e.key === " ") && !e.repeat) {
      e.preventDefault();
      onToggle();
    }
  };
  return html`
    <div class="eval">
      <div
        class="outcome ${u.outcome}${canExpand ? " clickable" : ""}"
        role=${canExpand ? "button" : nothing}
        tabindex=${canExpand ? "0" : nothing}
        aria-expanded=${canExpand ? expanded : nothing}
        @click=${canExpand ? onToggle : undefined}
        @keydown=${canExpand ? onKey : undefined}
      >
        <span class="label">${outcomeLabel(u.outcome)}</span>
        <span class="ts">${u.timestamp ? new Date(u.timestamp).toLocaleTimeString() : ""}</span>
      </div>
      <div class="eval-body">
        <div class="cause-line">Trigger: ${renderCauseFriendly(u.cause, hass)}</div>
        ${u.winner_name ? html`<div class="won">Won: <span class="name">${u.winner_name}</span></div>` : nothing}
        ${
          u.actions.length
            ? html`<div class="action-summary">→ ${services}
              ${n ? html`<span class="n">· ${pluralize(n, "entity", "entities")}</span>` : nothing}</div>`
            : // No actions to list (UNCHANGED, blocked, no match, skipped, …) — fill
              // the slot with the explanation instead. Collapsed only: once expanded,
              // the expansion's outcome-summary carries it, so showing it here too
              // would just duplicate the line.
              expanded
              ? nothing
              : html`<div class="action-summary">${outcomeSummary(u)}</div>`
        }
      </div>
      ${expanded ? renderExpansion(u, hass, schemas, periods) : nothing}
    </div>
  `;
}

function renderExpansion(
  u: BufferedUnit,
  hass: HassLike | undefined,
  schemas: Record<string, ServiceSchema> | undefined,
  periods: CustomPeriods,
): TemplateResult {
  const summary = outcomeSummary(u);
  // Raw entity_id + raw old→new, one click away. Only entity/duration causes
  // carry raw values; other kinds would just duplicate the friendly label.
  const showRawTrigger = causeHasRawValues(u.cause);
  return html`
    <div class="why">
      ${showRawTrigger ? html`<div class="raw-trigger">Trigger: ${renderCause(u.cause)}</div>` : nothing}
      ${summary ? html`<div class="outcome-summary">${summary}</div>` : nothing}
      ${
        u.explanation
          ? html`<div class="section">
            <div class="section-title">Scene evaluation</div>
            <div class="scenes">${u.explanation.scenes.map((r) => renderScene(r, hass, periods))}</div>
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
                  (e) => html`<div class="entity">${clickableEntity(hass, e)}</div>`,
                )}
              </div>`,
            )}
          </div>`
          : nothing
      }
    </div>
  `;
}
