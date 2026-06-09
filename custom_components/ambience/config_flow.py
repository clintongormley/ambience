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
    ASSISTANT_FIELDS,
    CONF_EXPOSED_ASSISTANTS,
    CONF_SHOW_SIDEBAR_PANEL,
    DEFAULT_EXPOSED_ASSISTANTS,
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
            exposed = {
                assistant: bool(user_input.get(field, False))
                for assistant, field in ASSISTANT_FIELDS.items()
            }
            return self.async_create_entry(
                title="",
                data={
                    CONF_SHOW_SIDEBAR_PANEL: user_input[CONF_SHOW_SIDEBAR_PANEL],
                    CONF_EXPOSED_ASSISTANTS: exposed,
                },
            )

        current = self.config_entry.options.get(
            CONF_SHOW_SIDEBAR_PANEL, DEFAULT_SHOW_SIDEBAR_PANEL
        )
        exposed = self.config_entry.options.get(
            CONF_EXPOSED_ASSISTANTS, DEFAULT_EXPOSED_ASSISTANTS
        )
        fields: dict[Any, Any] = {
            vol.Required(CONF_SHOW_SIDEBAR_PANEL, default=current): bool
        }
        for assistant, field in ASSISTANT_FIELDS.items():
            # DEFAULT_EXPOSED_ASSISTANTS[assistant] (not .get) so a new assistant
            # added to ASSISTANT_FIELDS but forgotten in DEFAULT_EXPOSED_ASSISTANTS
            # fails loudly instead of silently defaulting to off.
            default = exposed.get(assistant, DEFAULT_EXPOSED_ASSISTANTS[assistant])
            fields[vol.Required(field, default=default)] = bool
        return self.async_show_form(step_id="init", data_schema=vol.Schema(fields))
