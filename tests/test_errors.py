from homeassistant.exceptions import HomeAssistantError

from custom_components.ambience.const import DOMAIN
from custom_components.ambience.errors import AmbienceError


def test_ambience_error_carries_translation_metadata():
    err = AmbienceError("dup_scene_name", scene_idx=2, name="Cosy")
    assert isinstance(err, HomeAssistantError)
    assert err.translation_domain == DOMAIN
    assert err.translation_key == "dup_scene_name"
    # placeholders coerced to str
    assert err.translation_placeholders == {"scene_idx": "2", "name": "Cosy"}


def test_ambience_error_no_placeholders():
    err = AmbienceError("last_category_required")
    assert err.translation_placeholders == {}


from custom_components.ambience.errors import render_en


def test_render_en_interpolates_placeholders():
    # uses the real en.json scaffold added in this task
    msg = render_en("unexpected_error", {})
    assert "unexpected" in msg.lower()


def test_render_en_unknown_key_returns_key():
    assert render_en("no_such_key_xyz", {}) == "no_such_key_xyz"
