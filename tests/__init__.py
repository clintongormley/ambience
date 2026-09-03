"""Tests for the Ambience integration."""

from __future__ import annotations

# Re-exported under a scope-oriented name for tests that assert on the device a
# scope switch registers. The version-gated lookup itself lives in production
# (switch.lookup_device_by_identifier) so the HA-2026.8 deprecation gate has a
# single source of truth; see that function for the details.
from custom_components.ambience.switch import (
    lookup_device_by_identifier as get_scope_device,
)

__all__ = ["get_scope_device"]
