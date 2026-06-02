"""Pure rule engine. No HA, no I/O."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from .protocols import Condition

Rule = dict[str, Any]


def rule_enabled(rule: Rule) -> bool:
    """A rule is enabled unless it carries an explicit ``enabled: False``.

    Absent or ``True`` both mean enabled — the identity check (not ``== False``
    / ``not rule.get(...)``) deliberately treats other falsy values as enabled,
    so this is the single place the convention lives.
    """
    return rule.get("enabled") is not False


@dataclass(frozen=True)
class PredicateResult:
    """One predicate's evaluation within a rule."""

    condition_key: str
    passed: bool
    detail: str | None = None


@dataclass(frozen=True)
class RuleEval:
    """One rule's evaluation: its predicate results and whether it matched.

    `evaluated` is False for rules after the winner — they are never checked,
    mirroring this function's own short-circuit semantics. `disabled` is True
    for rules the user has turned off (``enabled: False``): they are skipped
    entirely — never matched, never the winner, and they do not short-circuit
    evaluation of later rules.
    """

    index: int
    name: str | None
    predicates: list[PredicateResult]
    matched: bool
    evaluated: bool
    disabled: bool = False


@dataclass(frozen=True)
class Explanation:
    """The full evaluation of a rule list: the winner and every rule's eval."""

    winner_index: int | None
    rules: list[RuleEval]


def evaluate_explained(
    rules: list[Rule],
    snapshots: dict[str, Any],
    conditions: dict[str, Condition],
    *,
    describe: bool = False,
) -> Explanation:
    """Evaluate `rules`, recording every predicate result and the winner.

    Same matching semantics as `resolve()`: a `when` key whose predicate is
    None (or absent) is a wildcard; a condition missing from `conditions`, or whose
    snapshot is None, fails the rule; evaluation short-circuits on the first
    failing predicate and stops at the first matching rule.

    When `describe` is True, each successfully evaluated predicate's `detail`
    is filled from the condition's `describe(snapshot)` (extra cost — callers
    pass True only when tracing). Predicates that cannot be evaluated (missing
    condition or None snapshot) always carry ``detail="unavailable"`` regardless
    of this flag.
    """
    rule_evals: list[RuleEval] = []
    winner: int | None = None
    for idx, rule in enumerate(rules):
        if not rule_enabled(rule):
            # Disabled rule: recorded for traces but skipped — it cannot win
            # and does not short-circuit evaluation of the rules below it.
            rule_evals.append(RuleEval(idx, rule.get("name"), [], False, False, disabled=True))
            continue
        if winner is not None:
            rule_evals.append(RuleEval(idx, rule.get("name"), [], False, False))
            continue
        when = rule.get("when", {})
        predicates: list[PredicateResult] = []
        ok = True
        for key, predicate in when.items():
            if predicate is None:
                continue
            condition = conditions.get(key)
            snap = snapshots.get(key)
            if condition is None or snap is None:
                predicates.append(PredicateResult(key, False, "unavailable"))
                ok = False
                break
            passed = bool(condition.matches(predicate, snap))
            detail = condition.describe(snap) if describe else None
            predicates.append(PredicateResult(key, passed, detail))
            if not passed:
                ok = False
                break
        rule_evals.append(RuleEval(idx, rule.get("name"), predicates, ok, True))
        if ok:
            winner = idx
    return Explanation(winner, rule_evals)


def resolve(
    rules: list[Rule],
    snapshots: dict[str, Any],
    conditions: dict[str, Condition],
) -> tuple[int, Rule] | None:
    """Return (index, rule) for the first matching rule, or None.

    Thin derivation over `evaluate_explained()` so the matching logic has a
    single source of truth shared with traces.
    """
    explanation = evaluate_explained(rules, snapshots, conditions)
    if explanation.winner_index is None:
        return None
    return explanation.winner_index, rules[explanation.winner_index]
