"""Enumerate a scope's auto-trigger watches.

A scope's triggers are *derived* from its rules: each rule's ``when`` predicate
is run through its condition's ``trigger_deps`` and the results merged into one
``TriggerSpec``. This module exposes that derivation to the engine and the
simulator. Pure logic — conditions are passed in; no HA imports, no I/O.

``opaque`` is a flag (script deps may be incomplete), not a watch.
"""

from __future__ import annotations

from collections.abc import Iterator
from typing import Any

from .engine import rule_enabled
from .triggers import TriggerSpec, merge


def iter_predicate_specs(
    conditions: dict[str, Any], cfg: dict[str, Any]
) -> Iterator[tuple[int, str, TriggerSpec]]:
    """Yield ``(rule_index, condition_key, TriggerSpec)`` for every watchable
    predicate in ``cfg``'s rules.

    The single source of the "what does a predicate watch?" policy, shared by
    the UI (``scope_trigger_spec``) and the engine (``_build_entries``): a
    disabled rule (``enabled: False``) contributes nothing (it can never win, so
    its predicates must not wake the scope); a ``None`` predicate (wildcard) and
    an unknown condition contribute nothing; a condition without ``trigger_deps`` is
    treated as opaque. ``rule_index`` stays aligned with each rule's position in
    ``cfg['rules']`` so disabled rules simply leave gaps.
    """
    for rule_index, rule in enumerate(cfg.get("rules", [])):
        if not rule_enabled(rule):
            continue
        for condition_key, predicate in rule.get("when", {}).items():
            if predicate is None:
                continue
            condition = conditions.get(condition_key)
            if condition is None:
                continue
            trigger_deps = getattr(condition, "trigger_deps", None)
            spec = trigger_deps(predicate) if trigger_deps else TriggerSpec(opaque=True)
            yield rule_index, condition_key, spec


def scope_trigger_spec(conditions: dict[str, Any], cfg: dict[str, Any]) -> TriggerSpec:
    """Merge every rule predicate's ``trigger_deps`` in ``cfg`` into one spec."""
    return merge(spec for _, _, spec in iter_predicate_specs(conditions, cfg))
