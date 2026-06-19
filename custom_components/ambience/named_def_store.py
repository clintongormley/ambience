"""Base for a user-owned named-definition store (custom + hidden over builtins).

A "named-definition store" holds the user-editable slice of a dict of named
definitions: a ``custom`` map (additions and per-id overrides) plus a ``hidden``
list (built-in ids to suppress), layered over a set of code-shipped built-ins.

``PeriodStore`` (time_of_day periods) and ``LuxRangeStore`` (lux ranges) share
this machinery; they differ only in the built-ins, the per-entry
``validate_definition``, the human ``kind`` label used in error messages, and
which storage accessor pair they read/write.
"""

from __future__ import annotations

import re
from abc import ABC, abstractmethod
from typing import Any

from .errors import AmbienceError

# Shared id grammar for custom entries: lowercase, must start with a letter.
ID_RE = re.compile(r"^[a-z][a-z0-9_]*$")


class NamedDefStore(ABC):
    """Manages the user-owned (custom + hidden) slice and the merged view."""

    # Subclasses set these.
    builtins: dict[str, dict[str, Any]]
    kind: str  # human label for error messages, e.g. "period" / "lux range"

    def __init__(self, storage: Any) -> None:
        self._storage = storage

    # --- storage + per-entry validation hooks (subclass) ----------------

    @abstractmethod
    def _read(self) -> dict[str, Any]:
        """Return the stored ``{custom, hidden}`` slice."""

    @abstractmethod
    async def _write(self, payload: dict[str, Any]) -> None:
        """Persist the ``{custom, hidden}`` slice."""

    @abstractmethod
    def validate_definition(self, defn: Any) -> None:
        """Raise ValueError if ``defn`` is not a well-shaped definition."""

    # --- merged views ---------------------------------------------------

    def effective(self) -> dict[str, dict[str, Any]]:
        """Merged view: (builtins ∪ custom) − hidden, with custom shadowing builtin.

        Iteration order: built-ins first (in shipped order), then custom-only
        ids in insertion order.
        """
        user = self._read()
        custom = user.get("custom", {})
        hidden = set(user.get("hidden", []))
        result: dict[str, dict[str, Any]] = {}
        for id_, defn in self.builtins.items():
            if id_ in hidden:
                continue
            result[id_] = custom.get(id_, defn)
        for id_, defn in custom.items():
            if id_ not in self.builtins:  # built-in ids already handled above
                result[id_] = defn
        return result

    def view_for_ui(self) -> dict[str, Any]:
        """Returns ``{builtins, custom, hidden}`` for the management screen."""
        user = self._read()
        return {
            "builtins": self.builtins,
            "custom": user.get("custom", {}),
            "hidden": user.get("hidden", []),
        }

    # --- mutations ------------------------------------------------------

    async def save(self, custom: dict[str, Any], hidden: list[str]) -> None:
        """Validate then persist the user-owned slice atomically.

        Rejects the whole save on any malformed entry; no partial writes."""
        if not isinstance(custom, dict):
            raise AmbienceError("named_def_custom_not_object")
        if not isinstance(hidden, list):
            raise AmbienceError("named_def_hidden_not_list")
        for id_ in custom:
            if not isinstance(id_, str) or not ID_RE.match(id_):
                raise AmbienceError("named_def_invalid_id", kind=self.kind, id=id_)
            self.validate_definition(custom[id_])
        for id_ in hidden:
            if id_ not in self.builtins:
                raise AmbienceError("named_def_only_builtin_hideable", id=id_)
        await self._write({"custom": custom, "hidden": hidden})

    async def reset(self) -> None:
        """Clear custom + hidden."""
        await self._write({"custom": {}, "hidden": []})
