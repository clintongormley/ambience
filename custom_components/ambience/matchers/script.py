"""ScriptMatcher — evaluate a rule by calling a HA script that returns {match: bool}.

Per-rule predicate carries `(script, args)`. `snapshot()` collects every
distinct pair across all areas' rules, calls each script in parallel with a
per-call timeout, and memoises results by `(script, sorted-args-json)` with
a short TTL. `matches()` is a pure dict lookup.

Response contract: the script's `response_variable` must point to a dict
containing `match: true|false`. Anything else => no match.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from homeassistant.core import HomeAssistant


@dataclass(frozen=True)
class ScriptSnapshot:
    """Frozen view of pre-computed script call results.

    `results[key]` is `True` iff the script returned `{"match": True}`; any
    other outcome (False, missing key, error, timeout) is `False`.
    """

    results: dict[str, bool] = field(default_factory=dict)


class ScriptMatcher:
    """Matches by calling a HA script and reading {match: bool} from its response."""

    name = "script"
    description = "Matches by calling a HA script that returns {match: bool}."
    predicate_help = (
        "Object {script: 'script.<name>', args?: {...}}. The script must end "
        "with `stop:` + `response_variable:` pointing at a dict {match: bool}. "
        "True = match. None = wildcard."
    )
    input = "script_predicate"
    # Between scene (0) and state (50): a named script + named args is a
    # deliberate, opaque user constraint — semantically very specific.
    priority = 25

    def __init__(self, hass: HomeAssistant | None = None) -> None:
        self._hass = hass

    # --- protocol stubs ----------------------------------------------------

    def describe(self, snapshot: Any) -> str | None:
        return None

    def order_key(self, predicate: Any) -> str:
        if not isinstance(predicate, dict):
            return ""
        script = predicate.get("script")
        return script if isinstance(script, str) else ""

    # --- validation --------------------------------------------------------

    def validate_predicate(self, predicate: Any) -> None:
        if predicate is None:
            return
        if not isinstance(predicate, dict):
            raise ValueError(f"script predicate must be a dict or null: {predicate!r}")
        script = predicate.get("script")
        if not isinstance(script, str) or not script.startswith("script."):
            raise ValueError(
                f"script predicate `script` must be a 'script.<name>' string: {script!r}"
            )
        args = predicate.get("args")
        if args is not None and not isinstance(args, dict):
            raise ValueError(f"script predicate `args` must be a dict or absent: {args!r}")
