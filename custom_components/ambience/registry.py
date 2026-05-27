"""Public registration helpers for third-party matchers."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from .const import DATA_MATCHERS, DOMAIN
from .protocols import Matcher


def register_matcher(hass: HomeAssistant, matcher: Matcher) -> None:
    """Register a Matcher under hass.data[DOMAIN][DATA_MATCHERS]."""
    matchers = hass.data[DOMAIN][DATA_MATCHERS]
    if matcher.name in matchers:
        raise ValueError(f"matcher {matcher.name!r} already registered")
    matchers[matcher.name] = matcher
