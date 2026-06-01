"""Logbook attribution: message composition + context propagation."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import async_mock_service

from custom_components.ambience.const import DOMAIN
from custom_components.ambience.service import _compose_apply_message


class _FakeExposedStorage:
    """In-memory stand-in for ExposedActionsStore's storage backend."""

    def __init__(self, initial: list[dict] | None = None) -> None:
        self._actions: list[dict] = list(initial or [])

    def get_exposed_actions(self) -> list[dict]:
        return list(self._actions)

    async def async_save_exposed_actions(self, actions: list[dict]) -> None:
        self._actions = list(actions)


# --- Pure message composition -------------------------------------------------


def test_message_named_rule_single_group() -> None:
    msg = _compose_apply_message(
        reapplied=False,
        rule_name="Evening",
        rule_index=0,
        scope_label="Master Bedroom",
        group_label="Lights",
        group_count=1,
    )
    assert msg == "applied 'Evening' in Master Bedroom"


def test_message_multiple_groups_includes_group() -> None:
    msg = _compose_apply_message(
        reapplied=False,
        rule_name="Evening",
        rule_index=0,
        scope_label="Master Bedroom",
        group_label="Lights",
        group_count=2,
    )
    assert msg == "applied 'Evening' in Master Bedroom (Lights)"


def test_message_unnamed_rule_falls_back_to_index() -> None:
    msg = _compose_apply_message(
        reapplied=False,
        rule_name=None,
        rule_index=2,
        scope_label="Kitchen",
        group_label=None,
        group_count=1,
    )
    assert msg == "applied 'rule 3' in Kitchen"


def test_message_reapplied_verb() -> None:
    msg = _compose_apply_message(
        reapplied=True,
        rule_name="Evening",
        rule_index=0,
        scope_label="Master Bedroom",
        group_label="Lights",
        group_count=2,
    )
    assert msg == "re-applied 'Evening' in Master Bedroom (Lights)"


def test_message_multiple_groups_but_no_label_omits_group() -> None:
    # group_count > 1 with an unknown/labelless group: suffix is omitted.
    msg = _compose_apply_message(
        reapplied=False,
        rule_name="Evening",
        rule_index=0,
        scope_label="Master Bedroom",
        group_label=None,
        group_count=2,
    )
    assert msg == "applied 'Evening' in Master Bedroom"


def test_message_reapplied_single_group() -> None:
    msg = _compose_apply_message(
        reapplied=True,
        rule_name="Evening",
        rule_index=0,
        scope_label="Master Bedroom",
        group_label="Lights",
        group_count=1,
    )
    assert msg == "re-applied 'Evening' in Master Bedroom"


# --- Context propagation through async_execute_actions ------------------------


async def test_execute_actions_passes_context_to_service_calls(
    hass: HomeAssistant,
) -> None:
    from homeassistant.core import Context

    from custom_components.ambience.const import DATA_EXPOSED_ACTIONS
    from custom_components.ambience.exposed_actions import ExposedActionsStore
    from custom_components.ambience.service import async_execute_actions

    calls = async_mock_service(hass, "light", "turn_on")
    hass.data[DOMAIN] = {
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    await hass.data[DOMAIN][DATA_EXPOSED_ACTIONS].save(
        [{"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}}]
    )

    ctx = Context()
    await async_execute_actions(
        hass,
        "area",
        "lr",
        [{"service": "light.turn_on", "entity_ids": ["light.lamp"], "params": {}}],
        rule_index=0,
        context=ctx,
    )

    assert len(calls) == 1
    assert calls[0].context.id == ctx.id
