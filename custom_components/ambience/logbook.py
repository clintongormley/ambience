"""Describe Ambience activity logbook events.

Firing a *described* event (rather than a bare ``logbook.async_log_entry``) makes
Ambience a recognised logbook context source. HA's logbook only renders a
"triggered by …" line on a child event when that child's context source is a
state change, a service call, or a *registered* external event — a bare logbook
entry is none of those. By describing ``EVENT_AMBIENCE_ACTIVITY`` here, the device
changes dispatched under the apply's Context render as
"triggered by '<category>/<scene>' (<switch>)", while the entry itself stays
attached to the scope switch entity (so it remains filterable by area).

HA auto-discovers this platform via ``async_process_integration_platforms`` once
the logbook integration is set up (logbook is in the manifest ``after_dependencies``).
"""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from homeassistant.components.logbook import (
    LOGBOOK_ENTRY_ENTITY_ID,
    LOGBOOK_ENTRY_MESSAGE,
    LazyEventPartialState,
)
from homeassistant.const import ATTR_ENTITY_ID
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN, EVENT_AMBIENCE_ACTIVITY


@callback
def async_describe_events(
    hass: HomeAssistant,
    async_describe_event: Callable[
        [str, str, Callable[[LazyEventPartialState], dict[str, Any]]], None
    ],
) -> None:
    """Teach the logbook how to render an Ambience activity event."""

    @callback
    def async_describe_activity(event: LazyEventPartialState) -> dict[str, Any]:
        data = event.data
        return {
            # No LOGBOOK_ENTRY_NAME: the switch entity name ("Lounge Ambience") is
            # the entry's subject and is appended to the "triggered by" line, so a
            # name here would double the brand.
            LOGBOOK_ENTRY_MESSAGE: data["message"],
            LOGBOOK_ENTRY_ENTITY_ID: data[ATTR_ENTITY_ID],
        }

    async_describe_event(DOMAIN, EVENT_AMBIENCE_ACTIVITY, async_describe_activity)
