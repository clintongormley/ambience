"""Fixtures for Ambience integration tests."""

from __future__ import annotations

from collections.abc import Generator
from unittest.mock import AsyncMock, MagicMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import DOMAIN


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(
    enable_custom_integrations: None,
) -> Generator[None]:
    """Enable custom integrations for all tests."""
    yield


@pytest.fixture(autouse=True)
def mock_hass_http(hass: HomeAssistant) -> None:
    """Provide a mock HTTP server so integrations can call async_register_static_paths."""
    mock_http = MagicMock()
    mock_http.async_register_static_paths = AsyncMock()
    hass.http = mock_http  # type: ignore[assignment]


@pytest.fixture
def mock_config_entry() -> MockConfigEntry:
    """Create a mock config entry for the Ambience integration."""
    return MockConfigEntry(
        domain=DOMAIN,
        title="Ambience",
        data={},
        options={},
        unique_id="ambience_unique",
    )
