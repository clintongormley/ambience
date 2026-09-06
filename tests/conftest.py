"""Fixtures for Ambience integration tests."""

from __future__ import annotations

import time as _time_module
from collections.abc import Generator
from datetime import UTC, datetime
from unittest.mock import AsyncMock, MagicMock

import pytest
from homeassistant.components.frontend import DATA_EXTRA_MODULE_URL, UrlManager
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.builtin_services import async_register_builtin_services
from custom_components.ambience.const import DOMAIN


@pytest.fixture
async def installed(hass: HomeAssistant, mock_config_entry: MockConfigEntry) -> MockConfigEntry:
    """The integration set up from `mock_config_entry` and settled.

    Shared default; a module that needs a different setup (extra seeding, a
    second entry) still declares its own `installed`, which shadows this one.
    """
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


@pytest.fixture
def builtin(hass: HomeAssistant) -> None:
    """Register Ambience built-in services (shared across builtin test modules)."""
    async_register_builtin_services(hass)


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(
    enable_custom_integrations: None,
) -> Generator[None]:
    """Enable custom integrations for all tests."""
    yield


class _MonotonicFromZero:
    """Monotonically increasing counter starting near zero.

    async_fire_time_changed fires asyncio TimerHandles where:
        mock_seconds_into_future >= future_seconds
    where mock_seconds_into_future = mocked_timestamp - time.time().

    With time.time() near zero, mocked_timestamp (a POSIX timestamp ~1.75e9
    for 2026 dates) is always >> future_seconds, so the condition fires any
    timer that was scheduled via async_track_point_in_utc_time.  The small
    monotonic increment keeps HA's internal timestamps strictly ordered, while
    keeping the absolute value near zero so that
    async_track_point_in_utc_time schedules handles far in the event-loop
    future (asyncio will not fire them prematurely).

    This fixture is intentionally NOT autouse — it is activated only for tests
    that request the ``fixed_utcnow`` fixture, via the
    ``patch_time_for_fixed_utcnow`` autouse fixture below.
    """

    def __init__(self) -> None:
        self._t = 0.0

    def __call__(self) -> float:
        self._t += 0.001  # 1 ms per call — distinct timestamps
        return self._t


@pytest.fixture
def _fake_time() -> _MonotonicFromZero:
    """Provide a near-zero monotonic time.time() replacement."""
    return _MonotonicFromZero()


@pytest.fixture
def fixed_utcnow(monkeypatch):
    base = datetime(2026, 5, 27, 12, 0, 0, tzinfo=UTC)
    holder = {"now": base}

    def fake_utcnow() -> datetime:
        return holder["now"]

    monkeypatch.setattr(dt_util, "utcnow", fake_utcnow)
    return holder


@pytest.fixture(autouse=True)
def patch_time_for_fixed_utcnow(
    request: pytest.FixtureRequest,
    monkeypatch: pytest.MonkeyPatch,
    _fake_time: _MonotonicFromZero,
) -> None:
    """Patch time.time() to near-zero only when the fixed_utcnow fixture is active.

    async_fire_time_changed fires asyncio TimerHandles where
    ``mock_seconds_into_future >= future_seconds``.  When ``dt_util.utcnow``
    is mocked to a 2026 timestamp (~1.75e9), keeping ``time.time()`` near
    zero makes ``mock_seconds_into_future`` very large and positive, so the
    condition is satisfied for any reasonably scheduled handle.

    Limiting this to tests that use ``fixed_utcnow`` avoids breaking other
    tests (especially WebSocket auth, which relies on JWT expiry checked
    against ``datetime.now()`` — but ``time.time()`` is used for token
    *creation* so a near-zero value would produce tokens that appear to have
    expired decades ago).
    """
    if "fixed_utcnow" in request.fixturenames:
        monkeypatch.setattr(_time_module, "time", _fake_time)


@pytest.fixture(autouse=True)
def mock_hass_http(hass: HomeAssistant) -> None:
    """Provide a mock HTTP server so integrations can call async_register_static_paths."""
    mock_http = MagicMock()
    mock_http.async_register_static_paths = AsyncMock()
    hass.http = mock_http  # type: ignore[assignment]


@pytest.fixture(autouse=True)
def init_frontend_extra_module_urls(hass: HomeAssistant) -> None:
    """Initialise the set that add_extra_js_url writes into.

    In a real HA instance the frontend component's async_setup populates this
    key with a UrlManager before any integration calls add_extra_js_url.  In
    tests the frontend component is not set up, so we seed the same type
    ourselves (not a bare set) to avoid KeyError and to match real semantics.
    """
    hass.data.setdefault(DATA_EXTRA_MODULE_URL, UrlManager(lambda *_: None, []))


@pytest.fixture
async def mock_config_entry(hass: HomeAssistant) -> MockConfigEntry:
    """Mock config entry for the Ambience integration.

    The store is pre-seeded with switch defaults so the large body of
    switch-dependent tests starts with a known state.
    """
    from homeassistant.helpers.storage import Store

    raw = Store(hass, 1, "ambience")
    await raw.async_save(
        {
            "version": 1,
            "areas": {},
            "floors": {},
            "house": {},
            "conditions": {},
            "switch_defaults": {
                "name": "Ambience",
                "auto_on_delay_seconds": 0,
            },
        }
    )
    return MockConfigEntry(
        domain=DOMAIN,
        title="Ambience",
        data={},
        options={},
        unique_id="ambience_unique",
    )
