"""In-memory undo/redo history for scene-list changes.

A single global stack (capped at HISTORY_LIMIT), held only in memory and cleared
on HA restart / integration unload. Each entry is a full before/after snapshot of
one scope's config, so undo/redo just write a snapshot back — there is no need to
interpret the change to reverse it.
"""

from __future__ import annotations

import copy
from dataclasses import dataclass
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_send

from .const import HISTORY_LIMIT, SIGNAL_HISTORY_CHANGED


def _normalize(config: dict[str, Any] | None) -> dict[str, Any]:
    """Snapshot ONLY the scene list of a scope config: ``{"scenes": [...]}``.

    Excluding the scope-level ``enabled`` flag (and any switch/runtime keys) means
    undo/redo restore scenes without ever reverting an untracked scope
    enable/disable toggle. An absent/empty config becomes ``{"scenes": []}`` so
    undoing a first-ever save truly empties the scope. The per-scene ``enabled``
    field lives inside each scene dict, so per-scene toggles are still captured.
    """
    scenes = (config or {}).get("scenes") or []
    return {"scenes": copy.deepcopy(scenes)}


@dataclass
class HistoryEntry:
    scope_kind: str
    scope_id: str | None
    before: dict[str, Any]
    after: dict[str, Any]
    change: dict[str, Any]


class ChangeHistory:
    """Global undo/redo stack for scene-list changes."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._undo: list[HistoryEntry] = []
        self._redo: list[HistoryEntry] = []

    def record(
        self,
        scope_kind: str,
        scope_id: str | None,
        before: dict[str, Any] | None,
        after: dict[str, Any] | None,
        change: dict[str, Any],
    ) -> bool:
        """Push a change; clear the redo stack; drop the oldest past the cap.
        Returns False (and records nothing) when the save changed nothing."""
        before_n = _normalize(before)
        after_n = _normalize(after)
        if before_n == after_n:
            return False
        self._undo.append(HistoryEntry(scope_kind, scope_id, before_n, after_n, dict(change)))
        self._redo.clear()
        if len(self._undo) > HISTORY_LIMIT:
            self._undo.pop(0)
        return True

    def undo(self) -> tuple[str, str | None, dict[str, Any]] | None:
        """Pop the newest undo entry onto the redo stack; return its `before`."""
        if not self._undo:
            return None
        entry = self._undo.pop()
        self._redo.append(entry)
        return (entry.scope_kind, entry.scope_id, copy.deepcopy(entry.before))

    def redo(self) -> tuple[str, str | None, dict[str, Any]] | None:
        """Pop the newest redo entry back onto the undo stack; return its `after`."""
        if not self._redo:
            return None
        entry = self._redo.pop()
        self._undo.append(entry)
        return (entry.scope_kind, entry.scope_id, copy.deepcopy(entry.after))

    def discard_undo(self) -> None:
        """Drop the newest undo entry without applying it (e.g. its scope is gone)."""
        if self._undo:
            self._undo.pop()

    def discard_redo(self) -> None:
        """Drop the newest redo entry without applying it (e.g. its scope is gone)."""
        if self._redo:
            self._redo.pop()

    @staticmethod
    def _descriptor(entry: HistoryEntry) -> dict[str, Any]:
        return {**entry.change, "scope_kind": entry.scope_kind, "scope_id": entry.scope_id}

    def snapshot(
        self,
        op: str | None = None,
        changed_scope: tuple[str, str | None] | None = None,
    ) -> dict[str, Any]:
        return {
            "op": op,
            "can_undo": bool(self._undo),
            "can_redo": bool(self._redo),
            "undo": self._descriptor(self._undo[-1]) if self._undo else None,
            "redo": self._descriptor(self._redo[-1]) if self._redo else None,
            "undo_count": len(self._undo),
            "redo_count": len(self._redo),
            "changed_scope": (
                {"scope_kind": changed_scope[0], "scope_id": changed_scope[1]}
                if changed_scope is not None
                else None
            ),
        }

    def notify_changed(self, op: str, scope_kind: str, scope_id: str | None) -> None:
        async_dispatcher_send(self._hass, SIGNAL_HISTORY_CHANGED, (op, scope_kind, scope_id))
