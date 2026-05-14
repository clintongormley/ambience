"""Pure rule sorting: containment-aware topological sort. No HA, no I/O.

See spec §5. Rule order has two parts:

  * a hard partial order — rule P must precede rule Q when P's match-set is a
    strict subset of Q's (under first-match-wins, Q would otherwise permanently
    shadow P);
  * a linearisation — among rules the partial order leaves free, the one with
    the smaller linearisation key (a per-matcher tuple of `order_key` values,
    the slots ordered by matcher `priority`; a slot a rule does not constrain
    sorts last).

The result is a stable topological sort: rules tying on everything keep their
original relative order.
"""

from __future__ import annotations

from typing import Any

Rule = dict[str, Any]

_DEFAULT_PRIORITY = 1000


def _priority(matcher: Any) -> int:
    value = getattr(matcher, "priority", _DEFAULT_PRIORITY)
    return value if isinstance(value, int) else _DEFAULT_PRIORITY


def _constrained(rule: Rule) -> dict[str, Any]:
    """The `when` entries that actually constrain — non-None predicates."""
    return {k: v for k, v in rule.get("when", {}).items() if v is not None}


def sort_rules(rules: list[Rule], matchers: dict[str, Any]) -> list[Rule]:
    """Return a new list of rules in containment-aware topological order."""
    count = len(rules)
    if count < 2:
        return list(rules)

    constrained = [_constrained(rule) for rule in rules]

    # --- linearisation key per rule --------------------------------------
    # One slot per matcher named anywhere in a `when`, ordered by `priority`
    # (ties broken by name for determinism).
    slot_names = sorted(
        {name for rule in rules for name in rule.get("when", {})},
        key=lambda name: (_priority(matchers.get(name)), name),
    )

    def lin_key(rule: Rule) -> tuple:
        when = rule.get("when", {})
        slots: list[tuple[int, Any]] = []
        for name in slot_names:
            predicate = when.get(name)
            order_fn = getattr(matchers.get(name), "order_key", None)
            if predicate is not None and callable(order_fn):
                slots.append((0, order_fn(predicate)))
            else:
                # Unconstrained (or no order_key) is a wildcard: sorts last.
                slots.append((1, None))
        return tuple(slots)

    lin_keys = [lin_key(rule) for rule in rules]

    # --- hard partial order ----------------------------------------------
    def precedes(a: int, b: int) -> bool:
        """True if rule `a` must precede rule `b` — a's match-set is a strict
        subset of b's."""
        cons_a, cons_b = constrained[a], constrained[b]
        if not cons_b.keys() <= cons_a.keys():
            return False
        strict = cons_a.keys() > cons_b.keys()
        for key, b_pred in cons_b.items():
            a_pred = cons_a[key]
            if a_pred == b_pred:
                continue
            contains = getattr(matchers.get(key), "contains", None)
            if callable(contains) and contains(b_pred, a_pred):
                strict = True  # a_pred is strictly within b_pred
            else:
                return False  # cannot establish a_pred is within b_pred
        return strict

    # predecessors[i] = rules that must come before rule i. This is O(n^2) in
    # `precedes` calls (and the topological loop below is O(n^2) more) —
    # intentional: rule counts per area are small, so clarity beats scaling.
    predecessors = [{j for j in range(count) if j != i and precedes(j, i)} for i in range(count)]

    # --- stable topological sort, smallest linearisation key first -------
    emitted: list[int] = []
    emitted_set: set[int] = set()
    remaining = set(range(count))
    while remaining:
        ready = [i for i in remaining if predecessors[i] <= emitted_set]
        if not ready:
            # Defensive: a misbehaving `contains` produced a cycle. Break it
            # by treating everything still left as ready.
            ready = list(remaining)
        nxt = min(ready, key=lambda i: (lin_keys[i], i))
        emitted.append(nxt)
        emitted_set.add(nxt)
        remaining.discard(nxt)

    return [rules[i] for i in emitted]
