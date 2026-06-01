import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { HassConnection } from "../api.js";
import { listTraces, clearTraces, countTraces, listGroups } from "../api.js";
import type { BufferedUnit, RuleGroup, TraceRuleEval } from "../types.js";
import { groupSwatch, groupSwatchStyles } from "../group-swatch.js";
import { scopeLabel } from "../scope-label.js";
import { humanizeId } from "../i18n.js";

type Bucket = {
  id: string;
  scope_kind: string;
  scope_id: string | null;
  scope_name: string | null;
  group: string;
  group_name: string | null;
  records: BufferedUnit[];
  newest: string;
};

function bucketId(u: BufferedUnit): string {
  return `${u.scope_kind}|${u.scope_id ?? ""}|${u.group}`;
}

@customElement("ambience-traces-view")
export class AmbienceTracesView extends LitElement {
  static override styles = [
    groupSwatchStyles,
    css`
      :host { display: block; padding: 1rem; }
      .error { color: var(--error-color, #d32f2f); }
      .empty { color: var(--secondary-text-color, #888); text-align: center; padding: 3rem 1rem; }
      .bar { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; }
      .bar .spacer { flex: 1; }
      .new-badge { cursor: pointer; background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff);
        border: none; border-radius: 14px; padding: 4px 12px; font-size: 0.8rem; }
      .layout { display: flex; gap: 1rem; align-items: flex-start; }
      .buckets { flex: 0 0 16rem; list-style: none; margin: 0; padding: 0; }
      .bucket { display: flex; align-items: center; gap: 0.6rem; padding: 0.5rem; border-radius: 8px; cursor: pointer; }
      .bucket.sel { background: var(--secondary-background-color, #2a2a2a); }
      .bucket .names { flex: 1; min-width: 0; }
      .bucket .names .scope { font-weight: 600; }
      .bucket .names .group { color: var(--secondary-text-color, #999); font-size: 0.85rem; }
      .bucket .count { color: var(--secondary-text-color, #999); font-variant-numeric: tabular-nums; }
      .evaluations { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.6rem; }
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
    `,
  ];

  @property({ attribute: false }) hass!: HassConnection;
  @state() private _traces: BufferedUnit[] = [];
  @state() private _groups = new Map<string, RuleGroup>();
  @state() private _selected: string | null = null;
  @state() private _expanded = new Set<string>();
  @state() private _newAvailable = false;
  @state() private _loading = true;
  @state() private _error = "";
  private _poll?: ReturnType<typeof setInterval>;

  override async connectedCallback() {
    super.connectedCallback();
    await this._load();
    this._poll = setInterval(() => this._checkNew(), 5000);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._poll) clearInterval(this._poll);
  }

  private async _load() {
    try {
      this._error = "";
      const [traces, groups] = await Promise.all([listTraces(this.hass), listGroups(this.hass)]);
      if (!this.isConnected) return;
      this._traces = traces;
      this._groups = new Map(groups.map((g) => [g.id, g]));
      this._newAvailable = false;
      // Compute buckets here (before re-render) to pick the initial _selected.
      const buckets = this._buckets();
      if (buckets.length && (this._selected === null || !buckets.some((b) => b.id === this._selected))) {
        this._selected = buckets[0].id;
      }
      this._loading = false;
    } catch (e) {
      this._error = (e as Error).message || String(e);
      this._loading = false;
    }
  }

  private async _checkNew() {
    if (document.visibilityState !== "visible" || !this.isConnected) return;
    try {
      const { latest } = await countTraces(this.hass);
      const newestShown = this._traces[0]?.timestamp ?? null;
      if (latest && (!newestShown || latest > newestShown)) {
        this._newAvailable = true;
      }
    } catch {
      // background check — stay silent
    }
  }

  private _buckets(): Bucket[] {
    const map = new Map<string, Bucket>();
    for (const u of this._traces) {
      const id = bucketId(u);
      let b = map.get(id);
      if (!b) {
        b = { id, scope_kind: u.scope_kind, scope_id: u.scope_id, scope_name: u.scope_name,
          group: u.group, group_name: u.group_name, records: [], newest: u.timestamp ?? "" };
        map.set(id, b);
      }
      b.records.push(u);
      if ((u.timestamp ?? "") > b.newest) b.newest = u.timestamp ?? "";
    }
    return [...map.values()].sort((a, b) => (a.newest < b.newest ? 1 : -1));
  }

  private _scopeText(b: Bucket): string {
    return b.scope_name || scopeLabel({ scope_kind: b.scope_kind, scope_id: b.scope_id });
  }

  private _causeText(c: BufferedUnit["cause"]): string {
    if (c.kind === "entity") return `${c.entity_id} ${c.old} → ${c.new}`;
    if (c.detail) return `${humanizeId(c.kind)} ${c.detail}`;
    return humanizeId(c.kind);
  }

  private _evalKey(u: BufferedUnit, idx: number): string {
    return `${u.event_id ?? idx}|${u.timestamp ?? ""}|${u.scope_id ?? ""}|${u.group}`;
  }

  override render() {
    if (this._error) return html`<p class="error">${this._error}</p>`;
    if (this._loading) return html`<p class="empty">Loading…</p>`;
    const buckets = this._buckets();
    if (!buckets.length) return html`<p class="empty">No traces captured yet.</p>`;
    const selected = buckets.find((b) => b.id === this._selected) ?? buckets[0];
    return html`
      <div class="bar">
        <button @click=${() => this._load()}>Refresh</button>
        ${this._newAvailable
          ? html`<button class="new-badge" @click=${() => this._load()}>● New traces — refresh</button>`
          : nothing}
        <span class="spacer"></span>
        <button @click=${() => this._clear()}>Clear all</button>
      </div>
      <div class="layout">
        <ul class="buckets">
          ${buckets.map((b) => this._renderBucket(b, b.id === selected.id))}
        </ul>
        <div class="evaluations">
          ${selected.records.map((u, i) => this._renderEval(u, i))}
        </div>
      </div>
    `;
  }

  private _renderBucket(b: Bucket, sel: boolean) {
    const g = this._groups.get(b.group);
    return html`
      <li
        class="bucket ${sel ? "sel" : ""}"
        role="button"
        tabindex="0"
        @click=${() => { this._selected = b.id; }}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this._selected = b.id;
          }
        }}
      >
        ${groupSwatch(g?.color, g?.icon)}
        <span class="names">
          <span class="scope">${this._scopeText(b)}</span><br />
          <span class="group">${b.group_name ?? b.group}</span>
        </span>
        <span class="count">${b.records.length}</span>
      </li>
    `;
  }

  private _renderEval(u: BufferedUnit, idx: number) {
    const key = this._evalKey(u, idx);
    const open = this._expanded.has(key);
    const firstAction = u.actions[0];
    return html`
      <div class="eval">
        <div class="top">
          <span class="outcome ${u.outcome}">${u.outcome.replace(/_/g, " ")}</span>
          <span class="cause">${this._causeText(u.cause)}</span>
          <span class="ts">${u.timestamp ? new Date(u.timestamp).toLocaleTimeString() : ""}</span>
        </div>
        ${u.winner_name
          ? html`<div class="won">Won: <span class="name">${u.winner_name}</span>
              ${firstAction ? html`<span class="action"> → ${this._actionText(firstAction)}</span>` : nothing}</div>`
          : nothing}
        ${u.explanation
          ? html`<button class="why-toggle" @click=${() => this._toggle(key)}>
              ${open ? "▾ Hide" : u.winner_name ? "▸ Why this rule won" : "▸ Why nothing matched"}
              (${u.explanation.rules.length} rules)
            </button>`
          : nothing}
        ${open && u.explanation ? this._renderWhy(u) : nothing}
      </div>
    `;
  }

  private _renderWhy(u: BufferedUnit) {
    return html`
      <div class="why">
        ${u.explanation!.rules.map((r) => this._renderRule(r))}
        ${u.actions.map((a) => html`<div>→ ${this._actionText(a)}</div>`)}
      </div>
    `;
  }

  private _renderRule(r: TraceRuleEval) {
    if (!r.evaluated) return html`<div class="rule skipped">rule #${r.index} ${r.name ?? "—"}: not evaluated</div>`;
    return html`
      <div class="rule ${r.matched ? "won" : ""}">rule #${r.index} ${r.name ?? "—"}: ${r.matched ? "WON" : "no"}</div>
      ${r.predicates.map((p) => html`
        <div class="pred ${p.passed ? "pass" : "fail"}" style="padding-left:1rem">
          ${p.passed ? "✓" : "✗"} ${p.matcher_key}${p.detail ? html` <span class="dim">[${p.detail}]</span>` : nothing}
        </div>`)}
    `;
  }

  private _actionText(a: { service: string; entity_ids?: string[]; params?: Record<string, unknown> }): string {
    const target = a.entity_ids?.length ? ` [${a.entity_ids.join(", ")}]` : "";
    const params = a.params && Object.keys(a.params).length ? ` ${JSON.stringify(a.params)}` : "";
    return `${a.service}${target}${params}`;
  }

  private _toggle(key: string) {
    const next = new Set(this._expanded);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this._expanded = next;
  }

  private async _clear() {
    try {
      this._error = "";
      await clearTraces(this.hass);
      this._traces = [];
      this._selected = null;
      this._newAvailable = false;
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }
}
