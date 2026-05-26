"""Public protocols for Ambience pluggable matchers and actions."""

from __future__ import annotations

from typing import Any, NotRequired, Protocol, TypedDict, runtime_checkable

from homeassistant.core import HomeAssistant


class ParamSpec(TypedDict):
    """UI metadata for one target parameter on an Action."""

    name: str
    type: str  # "int" | "number" | "string" | "boolean"
    required: bool
    default: NotRequired[Any]
    min: NotRequired[float]
    max: NotRequired[float]
    description: NotRequired[str]
    unit: NotRequired[str]


@runtime_checkable
class Matcher(Protocol):
    """A pluggable predicate evaluator.

    Optional (duck-typed, read via getattr with defaults — not part of the
    Protocol so they stay optional for isinstance checks):
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


@runtime_checkable
class Action(Protocol):
    """A pluggable scene-application operation."""

    name: str
    description: str
    domains: tuple[str, ...]
    target_params: list[ParamSpec]

    async def execute(
        self,
        hass: HomeAssistant,
        entity_ids: list[str],
        params: dict[str, Any],
    ) -> None:
        """Apply this action to the given entity ids using shared params."""
        ...

    def validate_target_params(
        self,
        entity_ids: list[str],
        params: dict[str, Any],
    ) -> None:
        """Raise ValueError if the entity_ids list or params are malformed."""
        ...
