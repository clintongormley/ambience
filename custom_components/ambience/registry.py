"""Public registration helpers for third-party matchers and actions."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from .const import DATA_ACTIONS, DATA_MATCHERS, DOMAIN
from .protocols import Action, Matcher


def register_matcher(hass: HomeAssistant, matcher: Matcher) -> None:
    """Register a Matcher under hass.data[DOMAIN][DATA_MATCHERS]."""
    matchers = hass.data[DOMAIN][DATA_MATCHERS]
    if matcher.name in matchers:
        raise ValueError(f"matcher {matcher.name!r} already registered")
    matchers[matcher.name] = matcher


def register_action(hass: HomeAssistant, action: Action) -> None:
    """Register an Action under hass.data[DOMAIN][DATA_ACTIONS]."""
    actions = hass.data[DOMAIN][DATA_ACTIONS]
    if action.name in actions:
        raise ValueError(f"action {action.name!r} already registered")
    actions[action.name] = action
