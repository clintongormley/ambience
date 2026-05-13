"""Pure rule engine. No HA, no I/O."""

from __future__ import annotations

from typing import Any

from .protocols import Matcher

Rule = dict[str, Any]


def resolve(
    rules: list[Rule],
    activating_scene: str,
    snapshots: dict[str, Any],
    matchers: dict[str, Matcher],
) -> tuple[int, Rule] | None:
    """Return (index, rule) for the first matching rule, or None.

    Wildcards: a `when` key that is absent or whose value is None matches anything.
    Scene predicate must equal activating_scene if non-None.
    A matcher missing from the registry, or whose snapshot is None, fails the rule.
    """
    for idx, rule in enumerate(rules):
        when = rule.get("when", {})

        scene_pred = when.get("scene")
        if scene_pred is not None and scene_pred != activating_scene:
            continue

        ok = True
        for key, predicate in when.items():
            if key == "scene" or predicate is None:
                continue
            matcher = matchers.get(key)
            snap = snapshots.get(key)
            if matcher is None or snap is None:
                ok = False
                break
            if not matcher.matches(predicate, snap):
                ok = False
                break

        if ok:
            return idx, rule

    return None
