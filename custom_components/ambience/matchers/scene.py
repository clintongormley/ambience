"""Built-in scene matcher.

`scene` is an always-on matcher: its predicate is a scene name and its
"snapshot" is the scene that triggered apply_scene. The snapshot cannot be
captured from `hass` alone, so the service handler injects it directly
(see service.py); `snapshot()` here is never called.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant


class SceneMatcher:
    """Matches the activating scene by exact name. Always-on, not toggleable."""

    name = "scene"
    description = "Matches the scene that triggered apply_scene."
    predicate_help = "A scene name, e.g. 'movie_night'."
    toggleable = False
    input = "scene_combobox"
    priority = 0

    async def snapshot(self, hass: HomeAssistant) -> Any:
        raise NotImplementedError("scene snapshot is injected by the service handler")

    def matches(self, predicate: Any, snapshot: Any) -> bool:
        return predicate == snapshot

    def describe(self, snapshot: Any) -> str | None:
        return snapshot

    def validate_predicate(self, predicate: Any) -> None:
        if not isinstance(predicate, str) or not predicate.strip():
            raise ValueError(f"invalid scene predicate: {predicate!r}")

    def order_key(self, predicate: Any) -> str:
        """Linearisation key — the lowercased scene name. This is what makes the
        rule sort cluster rules by scene."""
        return predicate.lower()
