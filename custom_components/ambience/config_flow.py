"""Config and options flows for the Ambience integration."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback

from .const import (
    CONF_ENABLE_AI_TAB,
    CONF_SHOW_SIDEBAR_PANEL,
    DEFAULT_ENABLE_AI_TAB,
    DEFAULT_SHOW_SIDEBAR_PANEL,
    DOMAIN,
)


class AmbienceConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Ambience."""

    VERSION = 1
    MINOR_VERSION = 1

    async def async_step_user(self, _user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Handle the initial step."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        return self.async_create_entry(title="Ambience", data={})

    @staticmethod
    @callback
    def async_get_options_flow(_config_entry: ConfigEntry) -> OptionsFlow:
        """Return the options flow handler."""
        return AmbienceOptionsFlow()


class AmbienceOptionsFlow(OptionsFlow):
    """Handle Ambience options."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Manage the options."""
        if user_input is not None:
            return self.async_create_entry(
                title="",
                data={
                    CONF_SHOW_SIDEBAR_PANEL: user_input[CONF_SHOW_SIDEBAR_PANEL],
                    CONF_ENABLE_AI_TAB: user_input[CONF_ENABLE_AI_TAB],
                },
            )

        current = self.config_entry.options.get(CONF_SHOW_SIDEBAR_PANEL, DEFAULT_SHOW_SIDEBAR_PANEL)
        current_ai = self.config_entry.options.get(CONF_ENABLE_AI_TAB, DEFAULT_ENABLE_AI_TAB)
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_SHOW_SIDEBAR_PANEL, default=current): bool,
                    vol.Required(CONF_ENABLE_AI_TAB, default=current_ai): bool,
                }
            ),
        )
