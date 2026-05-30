"""Shared helper for collecting per-rule predicates across all scopes.

Both `script` and `template` matchers need the same walk: visit every rule in
every scope (areas, floors, house) and yield the predicate carried by
`when[key]`, skipping rules that don't set the key or set it to `None`
(the wildcard). Dedup / normalisation is matcher-specific and stays in the
caller.
"""

from __future__ import annotations

from collections.abc import Iterator
from typing import Any, Protocol


class _StoreLike(Protocol):
    def all_scope_configs(self) -> list[tuple[str, str | None, dict[str, Any]]]: ...


def collect_scope_predicates(store: _StoreLike, key: str) -> Iterator[Any]:
    """Yield each non-None `when[key]` predicate across every scope.

    Scope order (areas, then floors, then house) is owned by the store's
    ``all_scope_configs()`` — the same walk every other full-rule handler uses.
    """
    for _kind, _scope_id, scope_cfg in store.all_scope_configs():
        for rule in scope_cfg.get("rules", []):
            pred = rule.get("when", {}).get(key)
            if pred is not None:
                yield pred
