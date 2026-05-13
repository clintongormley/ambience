"""Config flow for the Ambience integration."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

from .const import DOMAIN


class AmbienceConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Ambience."""

    VERSION = 1
    MINOR_VERSION = 1

    async def async_step_user(self, _user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Handle the initial step."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        return self.async_create_entry(title="Ambience", data={})
