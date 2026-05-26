"""Built-in scene matcher.

`scene` matches the activating scene by exact name. Its snapshot is supplied
by the service handler (it cannot be captured from `hass` alone), so the
service-handler injection is authoritative. `snapshot()` returns None as a
safe no-op for callers that iterate the registry uniformly.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant


class SceneMatcher:
    """Matches the activating scene by exact name."""

    name = "scene"
    description = "Matches the scene that triggered apply_scene."
    predicate_help = "A scene name, e.g. 'movie_night'."
    toggleable = True
    input = "scene_combobox"
    priority = 0

    async def snapshot(self, hass: HomeAssistant) -> Any:
        return None

    def matches(self, predicate: Any, snapshot: Any) -> bool:
        return predicate == snapshot

    def describe(self, snapshot: Any) -> str | None:
        return snapshot

    def validate_predicate(self, predicate: Any) -> None:
        if not isinstance(predicate, str) or not predicate.strip():
            raise ValueError(f"invalid scene predicate: {predicate!r}")

    def order_key(self, predicate: Any) -> str:
        return predicate.lower()
