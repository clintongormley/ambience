"""Internal interface for Ambience's built-in conditions."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Protocol

from homeassistant.core import HomeAssistant


class Condition(Protocol):
    """A predicate evaluator. The built-in conditions all conform to this shape.

    Optional (duck-typed, read via getattr with defaults — not part of the
    Protocol so they stay optional):
      - ``contains(outer, inner) -> bool``: True iff every state matching
        ``inner`` also matches ``outer``. The hard-constraint primitive for
        the scene sort. Absent => no containment edges from this condition.
      - ``order_key(predicate)``: a sortable linearisation key for the
        predicate (e.g. start-minute-of-day). Absent => the slot sorts last.
      - ``priority: int``: linearisation-slot order, lower first. Default 1000.
      - ``input: str``: scene-editor widget hint. Default "text".
    """

    name: str
    description: str
    predicate_help: str

    async def snapshot(
        self,
        hass: HomeAssistant,
        *,
        now: datetime | None = None,
        entities: frozenset[str] | None = None,
    ) -> Any:
        """Capture all state needed to evaluate predicates.

        `now` overrides the wall-clock the snapshot is taken at (used by the
        what-if simulator to time-travel). When None, the condition reads the
        real current time. Time-insensitive conditions accept and ignore it.

        `entities` is the set of entity_ids that scenes actually reference for
        this condition (the union of every predicate's `trigger_deps().entities`,
        see `scope_triggers.referenced_entities`). A sensor-backed condition uses
        it to snapshot only those entities instead of scanning the whole domain.
        `None` means "no hint, scan as before" — the back-compat default for
        direct/test calls and for conditions that aren't entity-list-driven, which
        accept and ignore it. An empty set means "references nothing".
        """
        ...

    def matches(self, predicate: Any, snapshot: Any) -> bool:
        """Pure: return True iff this snapshot satisfies the predicate."""
        ...

    def describe(self, snapshot: Any) -> str | None:
        """Human-readable current value, for diagnostics."""
        ...

    def validate_predicate(self, predicate: Any) -> None:
        """Raise ValueError if the predicate is malformed."""
        ...
