"""Sync HA Repairs issues to the current config-health problems.

`reconcile_issues` scans every scope and creates one issue per problem (stable
id so rescans dedupe), deleting issues whose problem no longer exists. Wired in
`__init__` to run on setup, on config change, and on entity-registry updates, so
issues auto-clear the moment a typo is fixed or a device returns.
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import issue_registry as ir

from .config_health import Problem, scan
from .const import DATA_STORE, DOMAIN


def _issue_id(problem: Problem) -> str:
    if problem.kind == "missing_entity":
        loc = problem.locations[0]  # all locations share one scope for this kind
        sid = loc.scope_id or loc.scope_kind
        return f"missing_entity_{loc.scope_kind}_{sid}_{problem.entity_id}"
    return f"action_overlap_{problem.entity_id}"


def _group_label(scope_kind: str, scope_id: str | None, category_id: str | None) -> str:
    scope = scope_kind if scope_id is None else f"{scope_kind}:{scope_id}"
    return f"{scope}/{category_id or 'uncategorised'}"


@callback
def reconcile_issues(hass: HomeAssistant) -> None:
    """Make the Repairs issue set match the current config-health problems."""
    store = hass.data[DOMAIN][DATA_STORE]
    problems = scan(hass, store.all_scope_configs())
    desired: dict[str, Problem] = {_issue_id(p): p for p in problems}

    registry = ir.async_get(hass)
    existing = [iid for (dom, iid) in registry.issues if dom == DOMAIN]
    for iid in existing:
        if iid not in desired:
            ir.async_delete_issue(hass, DOMAIN, iid)

    for iid, problem in desired.items():
        if problem.kind == "missing_entity":
            scenes = ", ".join(sorted({loc.scene_name or "(unnamed)" for loc in problem.locations}))
            ir.async_create_issue(
                hass,
                DOMAIN,
                iid,
                is_fixable=False,
                severity=ir.IssueSeverity.WARNING,
                translation_key="missing_entity",
                translation_placeholders={"entity_id": problem.entity_id, "scenes": scenes},
            )
        else:  # action_overlap
            groups = ", ".join(
                sorted(
                    _group_label(loc.scope_kind, loc.scope_id, loc.category_id)
                    for loc in problem.locations
                )
            )
            ir.async_create_issue(
                hass,
                DOMAIN,
                iid,
                is_fixable=False,
                severity=ir.IssueSeverity.WARNING,
                translation_key="action_overlap",
                translation_placeholders={"entity_id": problem.entity_id, "groups": groups},
            )
