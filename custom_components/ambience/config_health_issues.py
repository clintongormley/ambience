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

# Issue-id prefixes this module owns. The reconcile delete-pass only touches ids
# with these prefixes, so it never deletes a Repairs issue some other part of the
# integration might raise under DOMAIN.
_ISSUE_PREFIXES = ("missing_entity:", "action_overlap:")


def _issue_id(problem: Problem) -> str:
    # `:` separates the id fields. It can't appear in a scope id (slugified:
    # [a-z0-9_]) or an entity id ([a-z0-9_.]), so distinct (scope, entity) tuples
    # can never collide into one id — an `_` separator could (e.g. area
    # "living_room" + "binary_sensor.x" vs area "living_room_binary" + "sensor.x").
    if problem.kind == "missing_entity":
        loc = problem.locations[0]  # all locations share one scope for this kind
        sid = loc.scope_id or loc.scope_kind
        return f"missing_entity:{loc.scope_kind}:{sid}:{problem.entity_id}"
    return f"action_overlap:{problem.entity_id}"


def _group_label(scope_kind: str, scope_id: str | None, category_id: str | None) -> str:
    scope = scope_kind if scope_id is None else f"{scope_kind}:{scope_id}"
    return f"{scope}/{category_id or 'uncategorised'}"


@callback
def reconcile_issues(hass: HomeAssistant) -> None:
    """Make the Repairs issue set match the current config-health problems."""
    # An entity-registry update (system-wide) or a config-changed signal can fire
    # in the window after unload pops hass.data[DOMAIN] but before the listeners
    # are detached; no-op rather than KeyError.
    domain_data = hass.data.get(DOMAIN)
    if domain_data is None or DATA_STORE not in domain_data:
        return
    store = domain_data[DATA_STORE]
    problems = scan(hass, store.all_scope_configs())
    desired: dict[str, Problem] = {_issue_id(p): p for p in problems}

    registry = ir.async_get(hass)
    existing = [
        iid for (dom, iid) in registry.issues if dom == DOMAIN and iid.startswith(_ISSUE_PREFIXES)
    ]
    for iid in existing:
        if iid not in desired:
            ir.async_delete_issue(hass, DOMAIN, iid)

    # `async_create_issue` upserts (idempotent), so the create pass re-asserts
    # every desired issue unconditionally — an unchanged one is a no-op, which is
    # why this loop has no "skip if already present" guard like the delete pass.
    for iid, problem in desired.items():
        if problem.kind == "missing_entity":
            scenes = ", ".join(sorted({loc.scene_name or "(unnamed)" for loc in problem.locations}))
            translation_key = "missing_entity"
            placeholders = {"entity_id": problem.entity_id, "scenes": scenes}
        elif problem.kind == "action_overlap":
            groups = ", ".join(
                sorted(
                    _group_label(loc.scope_kind, loc.scope_id, loc.category_id)
                    for loc in problem.locations
                )
            )
            translation_key = "action_overlap"
            placeholders = {"entity_id": problem.entity_id, "groups": groups}
        else:  # pragma: no cover - unreachable; kind is a closed Literal
            continue
        ir.async_create_issue(
            hass,
            DOMAIN,
            iid,
            is_fixable=False,
            severity=ir.IssueSeverity.WARNING,
            translation_key=translation_key,
            translation_placeholders=placeholders,
        )
