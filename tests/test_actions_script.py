"""ScriptAction — dispatches to a Home Assistant script service."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import async_mock_service

from custom_components.ambience.actions.script import ScriptAction


def test_kind_attribute() -> None:
    assert ScriptAction().kind == "script"


def test_validate_rejects_missing_script() -> None:
    action = ScriptAction()
    with pytest.raises(ValueError, match="script entity"):
        action.validate_target_params([], {}, script=None)


def test_validate_rejects_empty_string() -> None:
    action = ScriptAction()
    with pytest.raises(ValueError, match="script entity"):
        action.validate_target_params([], {}, script="")


def test_validate_rejects_wrong_domain() -> None:
    action = ScriptAction()
    with pytest.raises(ValueError, match="script entity"):
        action.validate_target_params([], {}, script="light.foo")


def test_validate_rejects_bare_domain() -> None:
    action = ScriptAction()
    with pytest.raises(ValueError, match="script entity"):
        action.validate_target_params([], {}, script="script.")


def test_validate_rejects_non_dict_params() -> None:
    action = ScriptAction()
    with pytest.raises(ValueError, match="must be a dict"):
        action.validate_target_params([], [], script="script.foo")


def test_validate_accepts_minimal() -> None:
    ScriptAction().validate_target_params([], {}, script="script.foo")


def test_validate_accepts_with_fields() -> None:
    ScriptAction().validate_target_params(
        [],
        {"brightness": 50, "transition": 2},
        script="script.foo",
    )


async def test_execute_no_target_no_fields(hass: HomeAssistant) -> None:
    calls = async_mock_service(hass, "script", "foo")
    await ScriptAction().execute(hass, [], {}, script="script.foo")
    assert len(calls) == 1
    assert calls[0].data == {}


async def test_execute_with_target(hass: HomeAssistant) -> None:
    calls = async_mock_service(hass, "script", "foo")
    await ScriptAction().execute(hass, ["light.a", "light.b"], {}, script="script.foo")
    assert len(calls) == 1
    assert calls[0].data.get("entity_id") == ["light.a", "light.b"]


async def test_execute_with_fields_only(hass: HomeAssistant) -> None:
    calls = async_mock_service(hass, "script", "foo")
    await ScriptAction().execute(hass, [], {"brightness": 50}, script="script.foo")
    assert len(calls) == 1
    assert calls[0].data["brightness"] == 50
    assert calls[0].data.get("entity_id") is None


async def test_execute_with_target_and_fields(hass: HomeAssistant) -> None:
    calls = async_mock_service(hass, "script", "foo")
    await ScriptAction().execute(
        hass,
        ["light.a"],
        {"brightness": 50, "transition": 2},
        script="script.foo",
    )
    assert len(calls) == 1
    assert calls[0].data["entity_id"] == ["light.a"]
    assert calls[0].data["brightness"] == 50
    assert calls[0].data["transition"] == 2


async def test_execute_raises_on_missing_script(hass: HomeAssistant) -> None:
    calls = async_mock_service(hass, "script", "foo")
    with pytest.raises(ValueError):
        await ScriptAction().execute(hass, [], {}, script=None)
    assert len(calls) == 0
