import type { Rule } from "./types.js";

/**
 * Drop the fields that fix a rule to a position within its category — the
 * backend-assigned `priority`, the user `pinned` flag, and the transient
 * `shadowed_by`. Used whenever a rule lands "fresh" (duplicated, moved to a new
 * scope, or moved to a new category) so the backend assigns it a new position.
 */
export function stripPositionMetadata(rule: Rule): Rule {
  const { priority: _priority, pinned: _pinned, shadowed_by: _shadowedBy, ...rest } = rule;
  return rest;
}
