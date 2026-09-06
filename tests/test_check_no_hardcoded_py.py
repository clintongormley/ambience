from bin.check_no_hardcoded_py import main, violations


def test_flags_literal_message_on_raw_homeassistant_error():
    assert violations('raise HomeAssistantError("nope")')


def test_flags_literal_message_on_service_validation_error():
    assert violations('raise ServiceValidationError("bad scope")')


def test_allows_carrier_with_literal_key():
    assert not violations('raise AmbienceError("scope_disabled", scope_id=s)')


def test_flags_carrier_with_dynamic_key():
    assert violations("raise AmbienceError(some_var)")


def test_flags_fstring_message_on_raw_exception():
    assert violations('raise HomeAssistantError(f"boom {x}")')


def test_flags_send_error_with_literal_message():
    assert violations('connection.send_error(msg["id"], "code", "boom")')


def test_flags_send_error_with_fstring_message():
    assert violations('connection.send_error(i, c, f"unknown {x}")')


def test_allows_send_error_with_dynamic_message():
    assert not violations("connection.send_error(i, c, str(e))")
    assert not violations(
        'connection.send_error(i, "unexpected_error", render_en("unexpected_error", {}))'
    )


def test_i18n_ignore_exempts():
    assert not violations('raise HomeAssistantError("ok")  # i18n-ignore')


def test_flags_value_error_message_in_a_condition():
    """Condition validators reach the scene editor, so their rejections must be
    translatable — a bare ValueError message would surface untranslated."""
    assert violations('raise ValueError("x")', "ambience/conditions/lux.py")
    assert violations('raise ValueError(f"bad {x}")', "ambience/conditions/lux.py")


def test_allows_value_error_message_outside_conditions():
    assert not violations('raise ValueError("x")', "ambience/store.py")


def test_value_error_in_a_condition_respects_i18n_ignore():
    assert not violations('raise ValueError("x")  # i18n-ignore', "ambience/conditions/lux.py")


def test_allows_value_error_without_a_literal_message_in_a_condition():
    assert not violations("raise ValueError(str(exc))", "ambience/conditions/lux.py")


def test_real_tree_is_clean():
    assert main() == 0
