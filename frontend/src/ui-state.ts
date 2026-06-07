// frontend/src/ui-state.ts
/**
 * Per-browser persistence for the panel's transient view state — the active
 * category filter, which scope rows are expanded, and whether the optional
 * conditions hint was dismissed — so a reload (or HA's panel rebuild on
 * WebSocket reconnect) restores what the user was looking at.
 *
 * State is shared across every surface that renders the panel (sidebar panel,
 * Lovelace card, multiple card instances) and applied on mount, so the most
 * recent change in any tab wins on the next load (last-write-wins).
 *
 * Every accessor is wrapped in try/catch: localStorage can throw (private mode,
 * blocked storage), in which case we fall back to defaults and simply don't
 * persist — matching the existing conditions-hint helper in scopes-view.
 */

const FILTER_CATEGORY_KEY = "ambience-filter-category";
const EXPANDED_SCOPES_KEY = "ambience-expanded-scopes";
const CONDITIONS_HINT_DISMISSED_KEY = "ambience-conditions-hint-dismissed";

/** The remembered category filter ("" = All), or "" when none is stored. */
export function getFilterCategory(): string {
  try {
    return window.localStorage.getItem(FILTER_CATEGORY_KEY) ?? "";
  } catch {
    // Storage disabled (e.g. private mode) — treat as unset.
    return "";
  }
}

/** Persist the active category filter ("" = All). */
export function setFilterCategory(id: string): void {
  try {
    window.localStorage.setItem(FILTER_CATEGORY_KEY, id);
  } catch {
    // Storage disabled — the selection just won't persist.
  }
}

/** The remembered set of expanded scope keys. Returns [] when nothing is stored,
 *  the value isn't valid JSON, or it isn't an array. A stored array is recovered
 *  leniently: any non-string entries are dropped and the valid keys kept (a
 *  corrupted entry shouldn't discard the user's whole expanded set — unknown
 *  keys are harmless, they just never match a scope at render). */
export function getExpandedScopes(): string[] {
  try {
    const raw = window.localStorage.getItem(EXPANDED_SCOPES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((k): k is string => typeof k === "string");
  } catch {
    // Malformed JSON or storage disabled — treat as nothing expanded.
    return [];
  }
}

/** Persist the set of expanded scope keys. */
export function setExpandedScopes(keys: string[]): void {
  try {
    window.localStorage.setItem(EXPANDED_SCOPES_KEY, JSON.stringify(keys));
  } catch {
    // Storage disabled — the expansion just won't persist.
  }
}

/** Whether the user dismissed the optional "configure Workday & Weather" hint. */
export function getConditionsHintDismissed(): boolean {
  try {
    return window.localStorage.getItem(CONDITIONS_HINT_DISMISSED_KEY) === "1";
  } catch {
    // Storage disabled — treat as not dismissed.
    return false;
  }
}

/** Persist that the user dismissed the optional conditions hint. */
export function setConditionsHintDismissed(): void {
  try {
    window.localStorage.setItem(CONDITIONS_HINT_DISMISSED_KEY, "1");
  } catch {
    // Storage disabled — the dismissal just won't persist.
  }
}
