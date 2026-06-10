"""ScriptCondition — evaluate a scene by calling a HA script that returns {match: bool}.

Per-scene predicate carries `(script, args)`. `snapshot()` collects every
distinct pair across all areas' scenes, calls each script in parallel with a
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
from datetime import datetime
from time import monotonic as _monotonic
from typing import Any

from homeassistant.core import HomeAssistant

from ..const import get_store
from ..triggers import TriggerSpec
from ._collect import collect_scope_predicates

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


class ScriptCondition:
    """Matches by calling a HA script and reading {match: bool} from its response."""

    name = "script"
    description = "Matches by calling a HA script that returns {match: bool}."
    predicate_help = (
        "Object {script: 'script.<name>', args?: {...}, triggers?: [entity_id]}. "
        "The script must end with `stop:` + `response_variable:` pointing at a "
        "dict {match: bool}. True = match. None = wildcard. `triggers` lists "
        "entities to re-evaluate on, since the script itself is opaque."
    )
    input = "script_predicate"
    # The highest priority (sorts earliest): a named script + named args is a
    # deliberate, opaque user constraint — semantically very specific.
    priority = 975

    _ttl_seconds: float = 2.0

    def __init__(self, hass: HomeAssistant | None = None) -> None:
        self._hass = hass
        # {cache_key: (result, expires_at_monotonic_s)}
        self._cache: dict[str, tuple[bool, float]] = {}

    # --- protocol stubs ----------------------------------------------------

    def describe(self, snapshot: Any, predicate: Any = None) -> str | None:
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
        triggers = predicate.get("triggers")
        if triggers is not None and (
            not isinstance(triggers, list) or not all(isinstance(t, str) and t for t in triggers)
        ):
            raise ValueError("script predicate `triggers` must be a list of entity_id strings")

    # --- evaluation --------------------------------------------------------

    def result_key(self, predicate: Any) -> str:
        """The key this predicate's result is stored under in the snapshot, or
        "" if the predicate is malformed. Shared by `matches()` and the
        simulator's verdict knobs so both agree on the identity."""
        if not isinstance(predicate, dict):
            return ""
        script = predicate.get("script")
        args = predicate.get("args") or {}
        if not isinstance(script, str) or not isinstance(args, dict):
            return ""
        return _cache_key(script, args)

    def matches(self, predicate: Any, snapshot: ScriptSnapshot) -> bool:
        if predicate is None:
            return True
        key = self.result_key(predicate)
        return bool(key) and snapshot.results.get(key, False) is True

    # --- trigger dependencies ---------------------------------------------

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        entities: set[str] = set()
        if isinstance(predicate, dict):
            for entity_id in predicate.get("triggers") or []:
                if isinstance(entity_id, str) and entity_id:
                    entities.add(entity_id)
        return TriggerSpec(entities=frozenset(entities), opaque=True)

    # --- snapshot orchestration -------------------------------------------

    def _collect_pairs(self) -> list[tuple[str, str]]:
        """Walk every scope's scenes (areas, floors, house) and return distinct
        (script, args-json) pairs carried by `when.script` predicates. Malformed
        predicates are skipped. Order is insertion order; duplicates are removed."""
        if self._hass is None:
            return []
        store = get_store(self._hass)
        if store is None:
            return []
        seen: set[tuple[str, str]] = set()
        pairs: list[tuple[str, str]] = []
        for pred in collect_scope_predicates(store, "script"):
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

    async def snapshot(
        self,
        hass: HomeAssistant,
        *,
        now: datetime | None = None,
        entities: frozenset[str] | None = None,  # part of the shared contract; not used here
    ) -> ScriptSnapshot:
        pairs = self._collect_pairs()
        results: dict[str, bool] = {}
        misses: list[tuple[str, str, str]] = []  # (script, args_json, cache_key)
        now_mono = _monotonic()
        for script, args_json in pairs:
            key = _cache_key(script, json.loads(args_json))
            cached = self._cache.get(key)
            if cached is not None and cached[1] > now_mono:
                results[key] = cached[0]
            else:
                misses.append((script, args_json, key))
        if misses:
            fetched = await asyncio.gather(
                *[self._call_one(hass, script, args_json) for script, args_json, _ in misses],
            )
            expires_at = _monotonic() + self._ttl_seconds
            for (_, _, key), value in zip(misses, fetched, strict=True):
                self._cache[key] = (value, expires_at)
                results[key] = value
        # Evict keys whose (script, args) pair is no longer referenced by any
        # scene — the cache lives on a long-lived singleton and would otherwise
        # grow with every pair ever configured.
        self._cache = {k: v for k, v in self._cache.items() if k in results}
        return ScriptSnapshot(results=results)

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
