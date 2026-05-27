"""ScriptMatcher — evaluate a rule by calling a HA script that returns {match: bool}.

Per-rule predicate carries `(script, args)`. `snapshot()` collects every
distinct pair across all areas' rules, calls each script in parallel with a
per-call timeout, and memoises results by `(script, sorted-args-json)` with
a short TTL. `matches()` is a pure dict lookup.

Response contract: the script's `response_variable` must point to a dict
containing `match: true|false`. Anything else => no match.
"""

from __future__ import annotations

import asyncio
import json
import logging
from dataclasses import dataclass, field
from typing import Any

from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)


def _cache_key(script: str, args: dict[str, Any] | None) -> str:
    """Stable cache key from (script, args). Args sorted so dict ordering doesn't matter."""
    payload = args or {}
    return f"{script}|{json.dumps(payload, sort_keys=True, separators=(',', ':'))}"


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

    # --- evaluation --------------------------------------------------------

    def matches(self, predicate: Any, snapshot: ScriptSnapshot) -> bool:
        if predicate is None:
            return True
        if not isinstance(predicate, dict):
            return False
        script = predicate.get("script")
        if not isinstance(script, str):
            return False
        args = predicate.get("args") or {}
        if not isinstance(args, dict):
            return False
        return snapshot.results.get(_cache_key(script, args), False) is True

    # --- snapshot orchestration -------------------------------------------

    def _collect_pairs(self) -> list[tuple[str, str]]:
        """Walk every area's rules and return distinct (script, args-json) pairs
        carried by `when.script` predicates. Malformed predicates are skipped.
        Order is insertion order; duplicates are removed."""
        hass = self._hass
        if hass is None:
            return []
        from ..const import DATA_STORE, DOMAIN

        store = hass.data.get(DOMAIN, {}).get(DATA_STORE)
        if store is None:
            return []
        seen: set[tuple[str, str]] = set()
        pairs: list[tuple[str, str]] = []
        for area_cfg in store.areas().values():
            for rule in area_cfg.get("rules", []):
                pred = rule.get("when", {}).get("script")
                if not isinstance(pred, dict):
                    continue
                script = pred.get("script")
                if not isinstance(script, str):
                    continue
                args = pred.get("args") or {}
                if not isinstance(args, dict):
                    continue
                args_json = json.dumps(args, sort_keys=True, separators=(",", ":"))
                key = (script, args_json)
                if key in seen:
                    continue
                seen.add(key)
                pairs.append(key)
        return pairs

    # Per-call timeout for script invocations. Tests may override.
    _timeout_seconds: float = 5.0

    async def snapshot(self, hass: HomeAssistant) -> ScriptSnapshot:
        pairs = self._collect_pairs()
        if not pairs:
            return ScriptSnapshot(results={})
        results = await asyncio.gather(
            *[self._call_one(hass, script, args_json) for script, args_json in pairs],
            return_exceptions=False,
        )
        return ScriptSnapshot(
            results={
                _cache_key(script, json.loads(args_json)): r
                for (script, args_json), r in zip(pairs, results, strict=True)
            }
        )

    async def _call_one(self, hass: HomeAssistant, script: str, args_json: str) -> bool:
        """Call one script.* service; return True iff response is `{"match": True}`.

        Errors / timeouts / non-dict responses / missing key / non-True value all
        return False. Warnings are logged for genuine failures (not for the
        normal "match: false" case)."""
        service = script.removeprefix("script.")
        args = json.loads(args_json)
        try:
            response = await asyncio.wait_for(
                hass.services.async_call(
                    "script",
                    service,
                    args,
                    blocking=True,
                    return_response=True,
                ),
                timeout=self._timeout_seconds,
            )
        except TimeoutError:
            _LOGGER.warning(
                "ambience: script %s timeout after %.1fs", script, self._timeout_seconds
            )
            return False
        except Exception as exc:  # noqa: BLE001  (catch-all: any HA error => no match)
            _LOGGER.warning("ambience: script %s call failed: %s", script, exc)
            return False
        if not isinstance(response, dict):
            return False
        return response.get("match") is True
