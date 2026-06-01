"""Pure rule sorting: containment-aware topological sort. No HA, no I/O.

See spec §5. Rule order has two parts:

  * a hard partial order — rule P must precede rule Q when P's match-set is a
    strict subset of Q's (under first-match-wins, Q would otherwise permanently
    shadow P);
  * a linearisation — among rules the partial order leaves free, the one with
    the smaller linearisation key (a per-matcher tuple of `order_key` values,
    the slots ordered by matcher `priority` DESCENDING — higher priority =
    more important = sorts earlier; a slot a rule does not constrain sorts last).

The result is a stable topological sort: rules tying on everything keep their
original relative order.
"""

from __future__ import annotations

from typing import Any

Rule = dict[str, Any]

_DEFAULT_PRIORITY = 0  # Fallback for matchers without a priority — lowest, so they sort last.


def matcher_priority(matcher: Any) -> int:
    """A matcher's linearisation priority (higher = more important), defaulting
    to `_DEFAULT_PRIORITY` when absent or non-int. Shared with the websocket
    `matchers/list` handler so both treat priority identically."""
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
    # DESCENDING (higher priority = more important = sorts earlier; ties broken
    # by name for determinism).
    slot_names = sorted(
        {name for rule in rules for name in rule.get("when", {})},
        key=lambda name: (-matcher_priority(matchers.get(name)), name),
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


# Spacing between auto-assigned priorities; generous room for inserts.
# Keep in sync with PIN_GAP in frontend/src/views/scopes-view.ts (the drag
# midpoint math relies on the same scale).
GAP = 1024


def _slot(upper: int | None, lower: int | None, k: int, m: int) -> int:
    """The k-th of m strictly-decreasing values placed between `lower` and
    `upper` (both exclusive; None means open)."""
    if upper is None and lower is None:
        return (m - k) * GAP
    if upper is None:
        return lower + (m - k) * GAP
    if lower is None:
        return upper - (k + 1) * GAP
    step = (upper - lower) // (m + 1)
    return upper - (k + 1) * step  # step may be 0; resolve_order renormalises


def _fill(order: list[Rule]) -> None:
    """Assign every rule whose `priority` is None, gap-inserting between the
    surrounding kept numbers. `order` is most-important-first."""
    n = len(order)
    i = 0
    while i < n:
        if order[i]["priority"] is not None:
            i += 1
            continue
        j = i
        while j < n and order[j]["priority"] is None:
            j += 1
        upper = order[i - 1]["priority"] if i > 0 else None
        lower = order[j]["priority"] if j < n else None
        m = j - i
        for k in range(m):
            order[i + k]["priority"] = _slot(upper, lower, k, m)
        i = j


def _resolve_order_one_group(rules: list[Rule], matchers: dict[str, Any]) -> list[Rule]:
    """Canonicalise one group's rules: maintain unpinned rules' priority numbers
    against the topological auto order (gap insertion preserves untouched
    numbers), keep pinned numbers fixed, then sort all rules by priority
    descending (higher = more important). Returns new rule dicts."""
    rules = [dict(r) for r in rules]
    for r in rules:
        r["pinned"] = bool(r.get("pinned", False))
        p = r.get("priority")
        if not isinstance(p, int) or isinstance(p, bool):
            r["priority"] = None

    unpinned = [r for r in rules if not r["pinned"]]
    order = sort_rules(unpinned, matchers)  # desired auto order, most important first

    # Keep existing numbers that already decrease down `order`; clear the rest.
    hi: int | None = None
    for r in order:
        p = r["priority"]
        if isinstance(p, int) and (hi is None or p < hi):
            hi = p
        else:
            r["priority"] = None
    _fill(order)

    # Pinned rules with no number yet (shouldn't happen via the UI) get one.
    for r in rules:
        if r["priority"] is None:
            r["priority"] = 0

    rules.sort(key=lambda r: r["priority"], reverse=True)

    # Renormalise if the final order isn't strictly decreasing (a gap closed).
    prios = [r["priority"] for r in rules]
    if any(a <= b for a, b in zip(prios, prios[1:], strict=False)):
        for idx, r in enumerate(rules):
            r["priority"] = (len(rules) - idx) * GAP
    return rules


def resolve_order(rules: list[Rule], matchers: dict[str, Any]) -> list[Rule]:
    """Canonicalise a scope's rules per group: partition by `group` (preserving
    each group's first-appearance order), canonicalise each partition
    independently, then concatenate so each group stays contiguous. Groups are
    independent buckets, so order and priority are only meaningful within a
    group."""
    buckets: dict[str | None, list[Rule]] = {}
    for r in rules:
        buckets.setdefault(r.get("group"), []).append(r)
    out: list[Rule] = []
    for bucket in buckets.values():
        out.extend(_resolve_order_one_group(bucket, matchers))
    return out


def _superset_or_equal(
    outer: dict[str, Any], inner: dict[str, Any], matchers: dict[str, Any]
) -> bool:
    """True if `outer`'s match-set ⊇ `inner`'s: every world-state matching the
    inner rule also matches the outer rule. `outer`/`inner` are constrained
    `when` maps (non-None predicates only)."""
    if not outer.keys() <= inner.keys():
        return False
    for key, o_pred in outer.items():
        i_pred = inner[key]
        if o_pred == i_pred:
            continue
        contains = getattr(matchers.get(key), "contains", None)
        if callable(contains) and contains(o_pred, i_pred):
            continue
        return False
    return True


def shadowed_by(ordered_rules: list[Rule], matchers: dict[str, Any]) -> dict[int, int]:
    """For rules already in final (resolved) order, map the index of each
    shadowed rule to the index of the earliest rule IN THE SAME GROUP that
    shadows it. Groups resolve independently, so a rule can only be shadowed by
    an earlier rule in its own group. Disabled rules (``enabled: False``) are
    ignored — they neither shadow others nor are reported as shadowed."""
    constrained = [_constrained(r) for r in ordered_rules]
    result: dict[int, int] = {}
    for j in range(len(ordered_rules)):
        if ordered_rules[j].get("enabled") is False:
            continue
        for i in range(j):
            if ordered_rules[i].get("enabled") is False:
                continue
            if ordered_rules[i].get("group") != ordered_rules[j].get("group"):
                continue
            if _superset_or_equal(constrained[i], constrained[j], matchers):
                result[j] = i
                break
    return result
