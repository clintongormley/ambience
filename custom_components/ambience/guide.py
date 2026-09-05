"""Serve the shipped authoring guide over the websocket, stamped with the running
version so a client re-reads it only when the install changes.

The guide markdown is generated into ``ai_guide/`` at build time
(``bin/gen_ai_docs.py``) and ships with the integration — this is the static
knowledge pack, in contrast to the live :mod:`.ai_bundle`."""

from __future__ import annotations

from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant

from .ai_common import ambience_version
from .const import DATA_AI_GUIDE, DOMAIN

GUIDE_PATH = Path(__file__).parent / "ai_guide" / "ambience-ai-guide.md"


async def build_ai_guide(hass: HomeAssistant, have_version: str | None = None) -> dict[str, Any]:
    """The shipped guide plus the running version stamp. When ``have_version``
    matches the running version, skip the (large) text and return
    ``{"unchanged": True}`` so the client keeps the copy it already has — the
    guide is immutable for a given version, so a match is always safe."""
    version = await ambience_version(hass)
    result: dict[str, Any] = {
        "ambience_version": version,
    }
    if have_version is not None and have_version == version:
        result["unchanged"] = True
        return result
    result["guide"] = await _guide_text(hass, version)
    return result


async def _guide_text(hass: HomeAssistant, version: str | None) -> str:
    """The shipped markdown, read from disk once per running version.

    The file ships with the install and cannot change under a running version,
    so every call after the first is served from memory rather than costing an
    executor hop and a re-read of the whole (100 kB+) file."""
    domain_data = hass.data.setdefault(DOMAIN, {})
    cached = domain_data.get(DATA_AI_GUIDE)
    if cached is not None and cached[0] == version:
        return cached[1]
    text: str = await hass.async_add_executor_job(GUIDE_PATH.read_text, "utf-8")
    domain_data[DATA_AI_GUIDE] = (version, text)
    return text
