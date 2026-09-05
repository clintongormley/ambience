"""Shared plumbing for the Ambience websocket handlers: the single error
chokepoint, the scope selector schema, and the scope-existence guard."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from ..const import DOMAIN
from ..errors import render_en, service_validation_error
from ..scopes import not_found_error, scope_spec
from ..scopes import scope_exists as _scope_exists

_LOGGER = logging.getLogger(__name__)


def _strict_int(value: Any) -> int:
    """An int that is not a bool. `vol.Any(int, …)` admits booleans (bool
    subclasses int), so `True` would ride in as a paging cursor, a row limit, or
    a scene index — where `True == 1` silently mis-reports a step as DEBOUNCED."""
    if isinstance(value, bool) or not isinstance(value, int):
        # i18n: voluptuous schema validator — English-only (framework layer)
        raise vol.Invalid("expected an integer")
    return value


def send_ambience_error(
    connection: websocket_api.ActiveConnection,
    msg_id: int,
    err: Exception,
    *,
    code: str = "validation_error",
) -> None:
    """Send a websocket error for a handler exception (the single chokepoint).

    - An Ambience ``HomeAssistantError`` (``AmbienceError`` / a
      ``translation_domain == DOMAIN`` error) with a ``translation_key``
      -> a localizable error payload carrying ``translation_key`` +
      ``translation_placeholders`` (plus the English message via ``render_en``
      for fallback/logging). Built with ``send_message`` so the extra fields ride
      on the error object — ``connection.send_error`` cannot carry them.
    - ``ValueError``, or a ``HomeAssistantError`` without a ``translation_key`` or
      from a different ``translation_domain`` (e.g. an HA-core error) ->
      ``connection.send_error(code, str(err))`` — its real message; the generic
      ``unexpected_error`` is reserved for non-HomeAssistantError/non-ValueError
      exceptions (real bugs).
    - Anything else -> log with traceback + a generic ``unexpected_error`` (the
      internal detail is never leaked to the user).
    """
    if (
        isinstance(err, HomeAssistantError)
        and getattr(err, "translation_key", None)
        and getattr(err, "translation_domain", None) == DOMAIN
    ):
        key = err.translation_key
        ph = getattr(err, "translation_placeholders", {}) or {}
        connection.send_message(
            websocket_api.error_message(
                msg_id,
                code,
                render_en(key, ph),
                translation_key=key,
                translation_domain=DOMAIN,
                translation_placeholders=ph,
            )
        )
        return
    if isinstance(err, (HomeAssistantError, ValueError)):
        connection.send_error(msg_id, code, str(err))
        return
    _LOGGER.exception("ambience websocket handler error", exc_info=err)
    # Carry the translation_key so a non-English user sees their localized
    # "unexpected error" (es.json has it); the internal detail is never leaked.
    connection.send_message(
        websocket_api.error_message(
            msg_id,
            "unexpected_error",
            render_en("unexpected_error", {}),
            translation_key="unexpected_error",
            translation_domain=DOMAIN,
            translation_placeholders={},
        )
    )


def _house_must_be_true(v: Any) -> bool:
    if v is not True:
        # i18n: voluptuous schema validator — English-only (framework layer)
        raise vol.Invalid("house must be true")
    return v


# The scope selector shared by every command that targets one (scope, id):
# exactly one of area_id / floor_id / house, parsed by `_parse_scope`. Spread
# (`**_SCOPE_SELECTOR_SCHEMA`) into each command schema so the three keys stay in
# lockstep across commands.
_SCOPE_SELECTOR_SCHEMA = {
    vol.Optional("area_id"): str,
    vol.Optional("floor_id"): str,
    vol.Optional("house"): _house_must_be_true,
}

# Selector key -> scope kind, in the order `_parse_scope` lists them back to a
# caller that sent the wrong number of them.
_SCOPE_SELECTOR_KINDS: dict[str, str] = {"area_id": "area", "floor_id": "floor", "house": "house"}


def _parse_scope(msg: dict[str, Any], command: str) -> tuple[str, str | None]:
    """Map a ws message's scope selector to (scope_kind, scope_id).

    Raises ServiceValidationError (named for `command`, so the client sees which
    request failed) when not exactly one of area_id/floor_id/house is present.
    """
    present = [k for k in _SCOPE_SELECTOR_KINDS if k in msg]
    if len(present) != 1:
        raise service_validation_error(
            "scope_selector_invalid", command=command, present=", ".join(present) or "(none)"
        )
    selector = present[0]
    spec = scope_spec(_SCOPE_SELECTOR_KINDS[selector])
    return spec.kind, (msg[selector] if spec.has_id else None)


def _require_scope(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
    scope_kind: str,
    scope_id: str | None,
) -> bool:
    """Verify an area/floor scope still exists in its registry (house always
    does). On a miss, send the one canonical scope-not-found error — translation
    key `unknown_area`/`unknown_floor` with `scope_id`, code `validation_error` —
    and return False; else return True. The single source of that contract for
    the scope get / save / set-enabled handlers (which the store would otherwise
    `setdefault` a junk bucket for)."""
    if _scope_exists(hass, scope_kind, scope_id):
        return True
    send_ambience_error(connection, msg["id"], not_found_error(scope_kind, scope_id))
    return False
