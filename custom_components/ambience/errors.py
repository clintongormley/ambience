"""Translatable, user-facing errors for the Ambience integration.

`AmbienceError` is the single carrier for every user-facing error. Its
``translation_key`` indexes the ``exceptions`` section of strings.json; HA core
localises it for service calls, and the websocket layer forwards the key +
placeholders to the frontend (see websocket/common.py).
"""

from __future__ import annotations

import json
from functools import cache
from pathlib import Path

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError

from .const import DOMAIN

_EN_PATH = Path(__file__).parent / "translations" / "en.json"


@cache
def _en_exceptions() -> dict[str, str]:
    data = json.loads(_EN_PATH.read_text(encoding="utf-8"))
    return {k: v["message"] for k, v in data.get("exceptions", {}).items()}


async def async_preload_translations(hass: HomeAssistant) -> None:
    """Warm the English exceptions cache off the event loop.

    Rendering an error otherwise does the first `en.json` read inline, and a
    blocking file read in the loop is a hard error for custom integrations.
    """
    await hass.async_add_executor_job(_en_exceptions)


def render_en(translation_key: str, placeholders: dict[str, str]) -> str:
    """English text for an exceptions key, interpolated. Falls back to the key."""
    template = _en_exceptions().get(translation_key)
    if template is None:
        return translation_key
    try:
        return template.format(**placeholders)
    except KeyError:
        return template


def service_validation_error(
    translation_key: str, **placeholders: object
) -> ServiceValidationError:
    """A translatable ServiceValidationError for the service-call path.

    HA core localizes it via strings.json ``exceptions.<translation_key>``. Used
    where the error should stay a ``ServiceValidationError`` (HA logs these as
    user errors, not bugs); the websocket layer routes the same key + placeholders
    to the frontend via ``send_ambience_error``."""
    return ServiceValidationError(
        translation_domain=DOMAIN,
        translation_key=translation_key,
        translation_placeholders={k: str(v) for k, v in placeholders.items()},
    )


class AmbienceError(HomeAssistantError):
    """A user-facing error keyed to strings.json `exceptions.<translation_key>`."""

    def __init__(self, translation_key: str, **placeholders: object) -> None:
        super().__init__(
            translation_domain=DOMAIN,
            translation_key=translation_key,
            translation_placeholders={k: str(v) for k, v in placeholders.items()},
        )
