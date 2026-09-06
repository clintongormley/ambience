"""Shared helper for collecting per-scene predicates across all scopes.

Both `script` and `template` conditions need the same walk: visit every scene in
every scope (areas, floors, house) and yield the predicate carried by
`when[key]`, skipping scenes that don't set the key or set it to `None`
(the wildcard). Dedup / normalisation is condition-specific and stays in the
caller.
"""

from __future__ import annotations

from collections.abc import Iterator
from typing import Any, Protocol

from ..engine import scene_enabled


class _StoreLike(Protocol):
    def all_scope_configs(self) -> list[tuple[str, str | None, dict[str, Any]]]: ...


def collect_scope_predicates(store: _StoreLike, key: str) -> Iterator[Any]:
    """Yield each non-None `when[key]` predicate across every scope.

    Scope order (areas, then floors, then house) is owned by the store's
    ``all_scope_configs()`` — the same walk every other full-scene handler uses.
    Disabled scenes are skipped: their predicates can carry side effects (a
    `when.script` call, a rendered template) that must not run for a scene the
    engine will never fire.
    """
    for _kind, _scope_id, scope_cfg in store.all_scope_configs():
        for scene in scope_cfg.get("scenes") or []:
            if not scene_enabled(scene):
                continue
            pred = scene.get("when", {}).get(key)
            if pred is not None:
                yield pred
