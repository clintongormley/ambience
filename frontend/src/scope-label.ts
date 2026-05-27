/**
 * Render a short, user-facing label for a (scope_kind, scope_id) pair as it
 * arrives in dangling-rule warning payloads from the backend (Configuration
 * tab views). House has no id; floor's id is shown with a prefix so it can't
 * be mistaken for an area; areas are shown by id (a registry lookup is a
 * follow-up).
 */
export function scopeLabel(w: {
  scope_kind: string;
  scope_id: string | null;
}): string {
  if (w.scope_kind === "house") return "House";
  if (w.scope_kind === "floor") return `Floor: ${w.scope_id ?? ""}`;
  return w.scope_id ?? "";
}
