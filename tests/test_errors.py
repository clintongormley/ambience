from homeassistant.exceptions import HomeAssistantError, ServiceValidationError

from custom_components.ambience.const import DOMAIN
from custom_components.ambience.errors import (
    AmbienceError,
    render_en,
    service_validation_error,
)


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


def test_service_validation_error_carries_translation_metadata():
    err = service_validation_error("unknown_area", scope_id="kitchen")
    assert isinstance(err, ServiceValidationError)
    assert err.translation_domain == DOMAIN
    assert err.translation_key == "unknown_area"
    # placeholders coerced to str
    assert err.translation_placeholders == {"scope_id": "kitchen"}


def test_service_validation_error_no_placeholders():
    err = service_validation_error("scene_index_out_of_range")
    assert err.translation_placeholders == {}


def test_render_en_interpolates_placeholders():
    # uses the real en.json scaffold added in this task
    msg = render_en("unexpected_error", {})
    assert "unexpected" in msg.lower()


def test_render_en_unknown_key_returns_key():
    assert render_en("no_such_key_xyz", {}) == "no_such_key_xyz"


def test_render_en_missing_placeholder_returns_raw_template(monkeypatch):
    from custom_components.ambience import errors

    monkeypatch.setattr(errors, "_en_exceptions", lambda: {"needs_detail": "Error: {detail}"})
    # placeholders omit {detail} -> str.format raises KeyError -> raw template returned
    assert errors.render_en("needs_detail", {}) == "Error: {detail}"
