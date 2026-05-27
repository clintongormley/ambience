"""Built-in script action — calls a Home Assistant script."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from ..protocols import ParamSpec


class ScriptAction:
    """Call a Home Assistant script."""

    name = "script"
    description = "Call a Home Assistant script."
    domains: tuple[str, ...] = ()
    target_params: list[ParamSpec] = []
    kind = "script"

    async def execute(
        self,
        hass: HomeAssistant,
        entity_ids: list[str],
        params: dict[str, Any],
        script: str | None = None,
    ) -> None:
        if not script or not script.startswith("script."):
            raise ValueError("script action requires a script entity (e.g. 'script.foo')")
        object_id = script.split(".", 1)[1]
        if not object_id:
            raise ValueError("script action requires a script entity (e.g. 'script.foo')")
        await hass.services.async_call(
            "script",
            object_id,
            service_data=dict(params),
            target={"entity_id": list(entity_ids)} if entity_ids else None,
            blocking=True,
        )

    def validate_target_params(
        self,
        entity_ids: list[str],
        params: dict[str, Any],
        script: str | None = None,
    ) -> None:
        if not script or not script.startswith("script.") or not script.split(".", 1)[1]:
            raise ValueError("script action requires a script entity (e.g. 'script.foo')")
        if not isinstance(params, dict):
            raise ValueError("script params must be a dict")
