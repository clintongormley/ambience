"""ChangeHistory is wired into hass.data on setup and gone after unload."""

from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import DATA_HISTORY, DOMAIN
from custom_components.ambience.history import ChangeHistory


async def test_history_present_after_setup_and_cleared_on_unload(
    hass, mock_config_entry: MockConfigEntry
) -> None:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert isinstance(hass.data[DOMAIN][DATA_HISTORY], ChangeHistory)

    assert await hass.config_entries.async_unload(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    assert DOMAIN not in hass.data
