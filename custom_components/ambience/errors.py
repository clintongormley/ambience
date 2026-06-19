"""Translatable, user-facing errors for the Ambience integration.

`AmbienceError` is the single carrier for every user-facing error. Its
``translation_key`` indexes the ``exceptions`` section of strings.json; HA core
localises it for service calls, and the websocket layer forwards the key +
placeholders to the frontend (see websocket.py)."""

from __future__ import annotations

from homeassistant.exceptions import HomeAssistantError

from .const import DOMAIN


class AmbienceError(HomeAssistantError):
    """A user-facing error keyed to strings.json `exceptions.<translation_key>`."""

    def __init__(self, translation_key: str, **placeholders: object) -> None:
        coerced = {k: str(v) for k, v in placeholders.items()}
        super().__init__(
            translation_domain=DOMAIN,
            translation_key=translation_key,
            translation_placeholders=coerced,
        )
        # Re-store explicitly: HomeAssistantError sets these, but keep direct
        # attributes so the websocket wrapper can read them without relying on
        # HA internals.
        self.translation_key = translation_key
        self.translation_placeholders = coerced
