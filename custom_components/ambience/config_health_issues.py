"""Sync HA Repairs issues to the current config-health problems.

`reconcile_issues` scans every scope and creates one issue per problem (stable
id so rescans dedupe), deleting issues whose problem no longer exists. Wired in
`__init__` to run on setup, on config change, and on entity-registry updates, so
issues auto-clear the moment a typo is fixed or a device returns.
"""

from __future__ import annotations

import re

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import issue_registry as ir

from .config_health import Problem, scan
from .const import DATA_OVERLAP_SET, DATA_STORE, DOMAIN
from .naming import category_names, scope_display_name

# Issue-id prefixes this module owns. The reconcile delete-pass only touches ids
# with these prefixes, so it never deletes a Repairs issue some other part of the
# integration might raise under DOMAIN.
# Keep in sync with the kinds that config_health can emit:
# - `config_health.scene_config_issues()` emits the 7 dangling-reference kinds below.
# - `config_health.scan()` section 2 emits `target_empty` (aggregated by service ref).
# Any kind missing here would have its Repairs issue orphaned by the delete-pass.
_NEW_KINDS = frozenset(
    {
        "missing_workday_sensor",
        "missing_workday_calendar",
        "missing_weather_entity",
        "missing_weather_group",
        "missing_period",
        "missing_lux_range",
        "unexposed_action",
        "target_empty",
    }
)
_ISSUE_PREFIXES = ("missing_entity:", "action_overlap:") + tuple(
    f"{k}:"
    for k in sorted(_NEW_KINDS)  # sorted → deterministic regardless of frozenset order
)


def _issue_id(problem: Problem) -> str:
    # `:` separates the id fields. It can't appear in a scope id (slugified:
    # [a-z0-9_]) or an entity id ([a-z0-9_.]), so distinct (scope, entity) tuples
    # can never collide into one id — an `_` separator could (e.g. area
    # "living_room" + "binary_sensor.x" vs area "living_room_binary" + "sensor.x").
    if problem.kind == "missing_entity":
        loc = problem.locations[0]  # all locations share one scope for this kind
        sid = loc.scope_id or loc.scope_kind
        return f"missing_entity:{loc.scope_kind}:{sid}:{problem.ref}"
    if problem.kind == "action_overlap":
        return f"action_overlap:{problem.ref}"
    return f"{problem.kind}:{problem.ref}"  # new kinds: global per (kind, ref)


def _clean(text: str) -> str:
    """Collapse whitespace (incl. newlines/tabs) so a user-supplied scope/category/
    scene name can't break the markdown bullet structure of a Repairs description."""
    return re.sub(r"\s+", " ", text).strip()


def _scope_phrase(hass: HomeAssistant, scope_kind: str, scope_id: str | None) -> str:
    """Bold friendly scope label with its kind: '**House**', '**Kitchen** floor',
    '**Living Room** area'."""
    name = _clean(scope_display_name(hass, scope_kind, scope_id))
    return f"**{name}**" if scope_kind == "house" else f"**{name}** {scope_kind}"


def _category_clause(category_name: str) -> str:
    """'category: Security' for a named category, else 'uncategorised'."""
    return f"category: {_clean(category_name)}" if category_name else "uncategorised"


def _scene_bullets(hass: HomeAssistant, cats: dict[str, str], problem: Problem) -> str:
    """Markdown bullets naming each affected scope · scene · category. Used by the
    new dangling-config-reference issue kinds (which aggregate across scopes)."""
    rows = sorted(
        {
            (
                _scope_phrase(hass, loc.scope_kind, loc.scope_id),
                cats.get(loc.category_id) or "",
                loc.scene_name or "(unnamed)",
            )
            for loc in problem.locations
        }
    )
    return "".join(
        f'\n- {phrase} · "{_clean(name)}" — {_category_clause(cat)}' for phrase, cat, name in rows
    )


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
    # Refresh the overlap-set cache the frontend flag reads (see
    # config_health.scene_annotations) from this same scan — no extra work, and it
    # keeps the flag on the same config-change/registry cadence as the Repairs issue.
    domain_data[DATA_OVERLAP_SET] = frozenset(p.ref for p in problems if p.kind == "action_overlap")
    desired: dict[str, Problem] = {_issue_id(p): p for p in problems}
    cats = category_names(hass)  # category id -> friendly name

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
            loc0 = problem.locations[0]  # all locations share one scope for this kind
            scope = _scope_phrase(hass, loc0.scope_kind, loc0.scope_id)
            bullets = sorted(
                {
                    (loc.scene_name or "(unnamed)", cats.get(loc.category_id) or "")
                    for loc in problem.locations
                }
            )
            scenes = "".join(
                f'\n- "{_clean(name)}" — {_category_clause(category)}' for name, category in bullets
            )
            translation_key = "missing_entity"
            placeholders = {"entity_id": problem.ref, "scope": scope, "scenes": scenes}
        elif problem.kind == "action_overlap":
            group_bullets = sorted(
                {
                    (
                        _scope_phrase(hass, loc.scope_kind, loc.scope_id),
                        cats.get(loc.category_id) or "",
                    )
                    for loc in problem.locations
                }
            )
            groups = "".join(
                f"\n- {phrase} · {_category_clause(category)}" for phrase, category in group_bullets
            )
            translation_key = "action_overlap"
            placeholders = {"entity_id": problem.ref, "groups": groups}
        elif problem.kind in _NEW_KINDS:
            translation_key = problem.kind
            placeholders = {
                "ref": problem.ref,
                "scenes": _scene_bullets(hass, cats, problem),
            }
        else:  # pragma: no cover - unknown future kind; skip rather than crash
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
