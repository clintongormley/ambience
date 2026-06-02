"""Internal interface for Ambience's built-in matchers."""

from __future__ import annotations

from typing import Any, Protocol

from homeassistant.core import HomeAssistant


class Matcher(Protocol):
    """A predicate evaluator. The built-in matchers all conform to this shape.

    Optional (duck-typed, read via getattr with defaults — not part of the
    Protocol so they stay optional):
      - ``contains(outer, inner) -> bool``: True iff every state matching
        ``inner`` also matches ``outer``. The hard-constraint primitive for
        the rule sort. Absent => no containment edges from this matcher.
      - ``order_key(predicate)``: a sortable linearisation key for the
        predicate (e.g. start-minute-of-day). Absent => the slot sorts last.
      - ``priority: int``: linearisation-slot order, lower first. Default 1000.
      - ``input: str``: rule-editor widget hint. Default "text".
    """

    name: str
    description: str
    predicate_help: str

    async def snapshot(self, hass: HomeAssistant) -> Any:
        """Capture all state needed to evaluate predicates."""
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
