"""Built-in set_light action — maps to light.turn_on / light.turn_off."""

from __future__ import annotations

import asyncio
import logging
from typing import Any

from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)
_ALLOWED_KEYS = frozenset({"brightness", "transition"})


class SetLightAction:
    """Apply brightness and transition to one or more lights."""

    name = "set_light"
    domains: tuple[str, ...] = ("light",)

    async def execute(
        self,
        hass: HomeAssistant,
        targets: dict[str, dict[str, Any]],
    ) -> None:
        coros = [self._apply_one(hass, entity_id, params) for entity_id, params in targets.items()]
        results = await asyncio.gather(*coros, return_exceptions=True)
        for entity_id, result in zip(targets.keys(), results, strict=True):
            if isinstance(result, Exception):
                _LOGGER.warning("set_light failed for %s: %s", entity_id, result)

    async def _apply_one(self, hass: HomeAssistant, entity_id: str, params: dict[str, Any]) -> None:
        brightness = params.get("brightness", 0)
        transition = params.get("transition", 0)
        if brightness == 0:
            await hass.services.async_call(
                "light",
                "turn_off",
                {"entity_id": entity_id, "transition": transition},
                blocking=True,
            )
            return
        await hass.services.async_call(
            "light",
            "turn_on",
            {
                "entity_id": entity_id,
                "brightness_pct": brightness,
                "transition": transition,
            },
            blocking=True,
        )

    def validate_target_params(self, entity_id: str, params: dict[str, Any]) -> None:
        unknown = set(params) - _ALLOWED_KEYS
        if unknown:
            raise ValueError(
                f"unknown param(s) for set_light target {entity_id}: {sorted(unknown)}"
            )
        if "brightness" not in params:
            raise ValueError(f"set_light target {entity_id} missing 'brightness'")
        brightness = params["brightness"]
        if not isinstance(brightness, int) or isinstance(brightness, bool):
            raise ValueError(f"set_light brightness must be int (got {brightness!r})")
        if not 0 <= brightness <= 100:
            raise ValueError(f"set_light brightness must be 0..100 (got {brightness})")
        if "transition" in params:
            transition = params["transition"]
            if not isinstance(transition, (int, float)) or isinstance(transition, bool):
                raise ValueError(f"set_light transition must be number (got {transition!r})")
            if transition < 0:
                raise ValueError(f"set_light transition must be >= 0 (got {transition})")
