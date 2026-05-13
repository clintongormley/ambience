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


@runtime_checkable
class Matcher(Protocol):
    """A pluggable predicate evaluator."""

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
        targets: dict[str, dict[str, Any]],
    ) -> None:
        """Apply this action to its targets."""
        ...

    def validate_target_params(self, entity_id: str, params: dict[str, Any]) -> None:
        """Raise ValueError if params for this target are malformed."""
        ...
