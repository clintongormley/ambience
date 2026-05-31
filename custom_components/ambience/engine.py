"""Pure rule engine. No HA, no I/O."""

from __future__ import annotations

from typing import Any

from .protocols import Matcher

Rule = dict[str, Any]


def resolve(
    rules: list[Rule],
    snapshots: dict[str, Any],
    matchers: dict[str, Matcher],
) -> tuple[int, Rule] | None:
    """Return (index, rule) for the first matching rule, or None.

    Every key in a rule's `when` is a matcher name.
    A key whose predicate is None — or that is absent — is a wildcard.
    A matcher missing from `matchers`, or whose snapshot is None, fails the rule.
    """
    for idx, rule in enumerate(rules):
        when = rule.get("when", {})
        ok = True
        for key, predicate in when.items():
            if predicate is None:
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
