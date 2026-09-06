"""Pure scene engine. No HA, no I/O."""

from __future__ import annotations

import logging
from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from .protocols import Condition

_LOGGER = logging.getLogger(__name__)

Scene = dict[str, Any]


def scene_enabled(scene: Scene) -> bool:
    """A scene is enabled unless it carries an explicit ``enabled: False``.

    Absent or ``True`` both mean enabled — the identity check (not ``== False``
    / ``not scene.get(...)``) deliberately treats other falsy values as enabled,
    so this is the single place the convention lives.
    """
    return scene.get("enabled") is not False


@dataclass(frozen=True)
class PredicateResult:
    """One predicate's evaluation within a scene.

    `entity_ids` are the entity_ids this predicate references (from the caller's
    precomputed lookup when it has one, else the condition's optional
    `trigger_deps`), so the trace UI can link the names it shows to their
    more-info dialogs. Populated only when tracing AND the predicate renders a
    `detail` to link AND the predicate references entities; empty otherwise — not
    tracing, no detail (e.g. template/script, or an unevaluated predicate), no
    `trigger_deps`, or a condition that references no entities (e.g.
    time_of_day). Which keys are actually rendered as links is a separate
    frontend decision.

    `detail_key` / `detail_placeholders` are set only when `detail` came from a
    condition's `unconfigured_reason` (a `Reason`): `detail` holds its English
    render for logs, diagnostics and the MCP, while the pair lets the panel
    localise the same sentence. None for a `describe()` detail, which is
    per-house prose with no fixed translation.
    """

    condition_key: str
    passed: bool
    detail: str | None = None
    entity_ids: tuple[str, ...] = ()
    detail_key: str | None = None
    detail_placeholders: dict[str, str] | None = None


@dataclass(frozen=True)
class SceneEval:
    """One scene's evaluation: its predicate results and whether it matched.

    `evaluated` is False for scenes after the winner — they are never checked,
    mirroring this function's own short-circuit semantics. `disabled` is True
    for scenes the user has turned off (``enabled: False``): they are skipped
    entirely — never matched, never the winner, and they do not short-circuit
    evaluation of later scenes.
    """

    index: int
    name: str | None
    predicates: list[PredicateResult]
    matched: bool
    evaluated: bool
    disabled: bool = False


@dataclass(frozen=True)
class Explanation:
    """The full evaluation of a scene list: the winner and every scene's eval."""

    winner_index: int | None
    scenes: list[SceneEval]


def evaluate_explained(
    scenes: list[Scene],
    snapshots: dict[str, Any],
    conditions: dict[str, Condition],
    *,
    describe: bool = False,
    entity_ids_for: Callable[[int, str], tuple[str, ...]] | None = None,
) -> Explanation:
    """Evaluate `scenes`, recording every predicate result and the winner.

    Same matching semantics as `resolve()`: a `when` key whose predicate is
    None (or absent) is a wildcard; a condition missing from `conditions`, or whose
    snapshot is None, fails the scene; evaluation short-circuits on the first
    failing predicate and stops at the first matching scene.

    When `describe` is True, each successfully evaluated predicate's `detail`
    is filled from the condition's `describe(snapshot)` (extra cost — callers
    pass True only when tracing). Predicates that cannot be evaluated (missing
    condition or None snapshot) always carry ``detail="unavailable"`` regardless
    of this flag.

    `entity_ids_for` supplies a predicate's trace `entity_ids` from the caller's
    own precomputed dependency analysis, keyed by ``(scene_index, condition_key)``
    where `scene_index` indexes `scenes` AS PASSED (a caller resolving a filtered
    subset translates before it hands the lookup over). When given it replaces
    `trigger_deps` entirely, so the always-on trace path re-derives nothing.

    A condition whose `matches` raises (a malformed predicate) fails only its
    own scene: the predicate is recorded as ``detail="error: <ExcType>"`` and
    evaluation continues with the next scene, matching the trigger engine's own
    policy so the two paths cannot disagree. A failure in the trace decoration
    (`describe` / `unconfigured_reason` / `trigger_deps`) is cosmetic and leaves
    the verdict from `matches` intact, so tracing cannot change the winner.
    """
    scene_evals: list[SceneEval] = []
    winner: int | None = None
    warned: set[str] = set()
    for idx, scene in enumerate(scenes):
        if not scene_enabled(scene):
            # Disabled scene: recorded for traces but skipped — it cannot win
            # and does not short-circuit evaluation of the scenes below it.
            scene_evals.append(SceneEval(idx, scene.get("name"), [], False, False, disabled=True))
            continue
        if winner is not None:
            scene_evals.append(SceneEval(idx, scene.get("name"), [], False, False))
            continue
        when = scene.get("when", {})
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
            try:
                passed = bool(condition.matches(predicate, snap))
            except Exception as exc:  # noqa: BLE001 — mirror trigger_engine._recompute
                # A malformed predicate fails its own scene only: raising here
                # would abort the whole category, so the manual/dry-run paths
                # would disagree with the trigger engine, which swallows too.
                _warn_once(warned, key, exc)
                predicates.append(PredicateResult(key, False, f"error: {type(exc).__name__}"))
                ok = False
                break
            try:
                result = _describe_predicate(
                    idx, key, predicate, passed, condition, snap, describe, entity_ids_for
                )
            except Exception as exc:  # noqa: BLE001
                # The trace decoration is cosmetic: a failure there must not
                # change the verdict, or a traced apply would resolve a
                # different winner than an untraced one.
                _warn_once(warned, key, exc)
                result = PredicateResult(key, passed, f"error: {type(exc).__name__}")
            predicates.append(result)
            if not result.passed:
                ok = False
                break
        scene_evals.append(SceneEval(idx, scene.get("name"), predicates, ok, True))
        if ok:
            winner = idx
    return Explanation(winner, scene_evals)


def _warn_once(warned: set[str], key: str, exc: Exception) -> None:
    """Warn about a broken condition once per evaluation, not once per scene."""
    if key not in warned:
        warned.add(key)
        _LOGGER.warning("ambience: condition %r evaluation failed: %s", key, exc)


def _describe_predicate(
    scene_index: int,
    key: str,
    predicate: Any,
    passed: bool,
    condition: Condition,
    snap: Any,
    describe: bool,
    entity_ids_for: Callable[[int, str], tuple[str, ...]] | None,
) -> PredicateResult:
    """Decorate one predicate's verdict with its trace detail and entity links.

    May raise (the caller guards)."""
    # Pass the predicate so the trace detail is scoped to the sensors/
    # persons THIS scene references, not the whole shared snapshot.
    detail = condition.describe(snap, predicate) if describe else None
    detail_key: str | None = None
    detail_placeholders: dict[str, str] | None = None
    if describe and not passed:
        reason_fn = getattr(condition, "unconfigured_reason", None)
        reason = reason_fn(predicate, snap) if reason_fn else None
        if reason:
            detail = reason.render()
            detail_key = reason.key
            detail_placeholders = dict(reason.placeholders)
    # The entity_ids the trace UI links to. Only a predicate that renders a
    # detail string can have its names linked, so skip the lookup when there's
    # nothing to link (`detail is not None` already implies tracing). A caller
    # holding precomputed deps hands them over rather than paying per predicate
    # per fire; otherwise fall back to the condition's own dependency analysis,
    # sorted so the (unordered) set serialises deterministically. Deriving deps
    # can be expensive (the template condition re-renders its Jinja), and
    # `trigger_deps` is optional (protocols.py), so guard it like scope_triggers.
    if detail is None:
        entity_ids: tuple[str, ...] = ()
    elif entity_ids_for is not None:
        entity_ids = entity_ids_for(scene_index, key)
    else:
        trigger_deps = getattr(condition, "trigger_deps", None)
        entity_ids = tuple(sorted(trigger_deps(predicate).entities)) if trigger_deps else ()
    return PredicateResult(key, passed, detail, entity_ids, detail_key, detail_placeholders)


def resolve(
    scenes: list[Scene],
    snapshots: dict[str, Any],
    conditions: dict[str, Condition],
) -> tuple[int, Scene] | None:
    """Return (index, scene) for the first matching scene, or None.

    Thin derivation over `evaluate_explained()` so the matching logic has a
    single source of truth shared with traces.
    """
    explanation = evaluate_explained(scenes, snapshots, conditions)
    if explanation.winner_index is None:
        return None
    return explanation.winner_index, scenes[explanation.winner_index]
