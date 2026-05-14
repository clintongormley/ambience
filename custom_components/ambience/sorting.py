"""Pure rule sorting by specificity. No HA, no I/O."""

from __future__ import annotations

from typing import Any

Rule = dict[str, Any]

# Sorts after every real scene name (case-insensitive comparison).
_SCENE_ANY = "￿"


def sort_rules(rules: list[Rule], matchers: dict[str, Any]) -> list[Rule]:
    """Return a new list of rules sorted by specificity (stable).

    Sort key per rule, in order:
      1. scene name, case-insensitive ascending — rules with no scene
         constraint sort last.
      2. constrained-dimension count, descending (more constraints first).
      3. sum of matcher.specificity(predicate) over the constrained matchers,
         ascending (narrower predicates first). A matcher with no
         specificity() method contributes 0.5.

    Python's `sorted` is stable, so rules that tie on all three keep their
    original relative order.
    """

    def key(rule: Rule) -> tuple[str, int, float]:
        when = rule.get("when", {})
        constrained = {k: v for k, v in when.items() if v is not None}

        scene = constrained.get("scene")
        scene_key = scene.lower() if isinstance(scene, str) and scene else _SCENE_ANY

        dims = len(constrained)

        narrowness = 0.0
        for name, predicate in constrained.items():
            matcher = matchers.get(name)
            spec_fn = getattr(matcher, "specificity", None)
            narrowness += spec_fn(predicate) if callable(spec_fn) else 0.5

        return (scene_key, -dims, narrowness)

    return sorted(rules, key=key)
