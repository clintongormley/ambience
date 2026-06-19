"""Tests for the websocket error chokepoint helper.

`send_ambience_error` is the single place every Ambience websocket handler
routes its caught exceptions through. It must:

- forward an `AmbienceError`'s translation_key + placeholders (i18n path),
- preserve the legacy `ValueError` -> `send_error(code, str(err))` behavior
  exactly, so the existing handler tests stay green,
- and reduce any other exception to a generic, logged `unexpected_error`.
"""

from homeassistant.exceptions import HomeAssistantError

from custom_components.ambience.errors import AmbienceError
from custom_components.ambience.websocket import send_ambience_error


class _Conn:
    def __init__(self):
        self.message = None
        self.error = None

    def send_message(self, message):
        self.message = message

    def send_error(self, msg_id, code, message):
        self.error = (msg_id, code, message)


def test_ambience_error_forwards_translation_key_and_placeholders():
    conn = _Conn()
    send_ambience_error(conn, 7, AmbienceError("unexpected_error"))  # key exists in scaffold
    err = conn.message["error"]
    assert conn.message["id"] == 7
    assert conn.message["success"] is False
    assert err["code"] == "validation_error"  # default code rides on the payload
    assert err["translation_key"] == "unexpected_error"
    assert err["translation_placeholders"] == {}
    assert isinstance(err["message"], str) and err["message"]  # English rendered


def test_ambience_error_placeholders_forwarded():
    conn = _Conn()
    send_ambience_error(conn, 1, AmbienceError("unexpected_error", a="x", b="y"))
    assert conn.message["error"]["translation_placeholders"] == {"a": "x", "b": "y"}


def test_legacy_value_error_preserves_str_message():
    conn = _Conn()
    send_ambience_error(conn, 9, ValueError("boom"), code="validation_error")
    assert conn.error == (9, "validation_error", "boom")
    assert conn.message is None  # legacy path uses send_error, not send_message


def test_homeassistant_error_without_key_uses_its_message():
    conn = _Conn()
    send_ambience_error(conn, 5, HomeAssistantError("plain message"), code="validation_error")
    assert conn.error == (5, "validation_error", "plain message")
    assert conn.message is None  # uses send_error, not the translated send_message path


def test_foreign_domain_hae_uses_its_message():
    # An HA-core (or other-integration) HomeAssistantError that carries a
    # translation_key but a DIFFERENT translation_domain must not be relabeled as
    # Ambience — it shows its own message via send_error, not the keyed payload.
    conn = _Conn()
    err = HomeAssistantError("core failure")
    err.translation_key = "some_core_key"
    err.translation_domain = "homeassistant"
    send_ambience_error(conn, 8, err, code="validation_error")
    assert conn.error == (8, "validation_error", "core failure")
    assert conn.message is None  # not the keyed Ambience payload


def test_unexpected_exception_is_generic_and_logged(caplog):
    conn = _Conn()
    send_ambience_error(conn, 3, RuntimeError("internal detail"))
    err = conn.message["error"]
    assert conn.message["id"] == 3
    assert err["translation_key"] == "unexpected_error"  # localizable for non-English users
    assert err["translation_placeholders"] == {}
    assert "internal detail" not in err["message"]  # internal detail not leaked to the user
    # The handler logged the failure with its traceback, so the internal detail
    # IS available to operators even though it never reaches the user payload.
    assert "ambience websocket handler error" in caplog.text
    assert "internal detail" in caplog.text
