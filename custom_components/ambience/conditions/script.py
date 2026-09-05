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
from collections.abc import Mapping
from dataclasses import dataclass, field
from time import monotonic as _monotonic
from typing import Any

from homeassistant.core import HomeAssistant

from ..errors import AmbienceError
from ..triggers import TriggerSpec
from ._common import validate_entity_ids
from ._opaque import OpaquePrecomputedCondition

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


class ScriptCondition(OpaquePrecomputedCondition[ScriptSnapshot]):
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
    # Below unavailable (980), but above the world-fact conditions: a named
    # script + named args is a deliberate, opaque user constraint — semantically
    # very specific, so it sorts ahead of everything except entity observability.
    priority = 975

    _ttl_seconds: float = 2.0

    def __init__(self, hass: HomeAssistant | None = None) -> None:
        super().__init__(hass)
        # {cache_key: (result, expires_at_monotonic_s)}
        self._cache: dict[str, tuple[bool, float]] = {}

    # --- protocol stubs ----------------------------------------------------

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
            raise AmbienceError("script_predicate_not_object", predicate=predicate)
        script = predicate.get("script")
        if not isinstance(script, str) or not script.startswith("script."):
            raise AmbienceError("script_id_invalid", script=script)
        validate_entity_ids([script], "script", key="script_id_invalid")
        args = predicate.get("args")
        if args is not None and not isinstance(args, dict):
            raise AmbienceError("script_args_not_object", args=args)
        triggers = predicate.get("triggers")
        if triggers is not None:
            # Any domain: a trigger is whatever entity should re-run the script.
            validate_entity_ids(triggers, key="script_triggers_invalid")

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

    def snapshot_from_results(self, results: dict[str, bool]) -> ScriptSnapshot:
        return ScriptSnapshot(results=dict(results))

    def verdict_label(self, predicate: Any, scene: Mapping[str, Any]) -> tuple[str | None, str]:
        """The script's own entity_id names the knob and is what it links to;
        a malformed predicate has neither, so the knob reads generically."""
        script = predicate.get("script")
        if not isinstance(script, str):
            return None, self.name
        return script, script

    # --- trigger dependencies ---------------------------------------------

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        entities: set[str] = set()
        if isinstance(predicate, dict):
            for entity_id in predicate.get("triggers") or []:
                if isinstance(entity_id, str) and entity_id:
                    entities.add(entity_id)
        return TriggerSpec(entities=frozenset(entities), opaque=True)

    # --- snapshot orchestration -------------------------------------------

    def _pair_key(self, pred: dict[str, Any]) -> tuple[str, str] | None:
        """The (script, sorted-args-json) work/dedup key for one predicate, or
        None if malformed (skipped by `_distinct_keys`)."""
        script = pred.get("script")
        if not isinstance(script, str):
            return None
        args = pred.get("args") or {}
        if not isinstance(args, dict):
            return None
        return (script, json.dumps(args, sort_keys=True, separators=(",", ":")))

    def _collect_pairs(self) -> list[tuple[str, str]]:
        """Distinct (script, args-json) pairs carried by `when.script` predicates
        across all scopes (areas, floors, house)."""
        return self._distinct_keys(self._pair_key)

    # Per-call timeout for script invocations. Tests may override.
    _timeout_seconds: float = 5.0

    @staticmethod
    def _pair_from_key(key: str) -> tuple[str, str]:
        """A result key split back into its (script, args-json) pair. The key is
        built as f"{script}|{args_json}" and a script entity_id can never contain
        "|", so the first separator is the boundary."""
        script, _, args_json = key.partition("|")
        return script, args_json

    def _merge(self, fresh: ScriptSnapshot, previous: ScriptSnapshot) -> ScriptSnapshot:
        return ScriptSnapshot(results=self._merge_over_previous(previous.results, fresh.results))

    async def _compute(
        self,
        hass: HomeAssistant,
        keys: frozenset[str] | None,
    ) -> ScriptSnapshot:
        # A result key round-trips to its work item, so a hint is the work list
        # itself — no store walk, and only the named scripts are called.
        pairs = (
            [self._pair_from_key(k) for k in sorted(keys)]
            if keys is not None
            else self._collect_pairs()
        )
        results: dict[str, bool] = {}
        misses: list[tuple[str, str, str]] = []  # (script, args_json, cache_key)
        now_mono = _monotonic()
        for script, args_json in pairs:
            # `args_json` is already the sorted compact form `result_key` uses,
            # so the key is a join — no re-parse, no re-dump.
            key = f"{script}|{args_json}"
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
        # grow with every pair ever configured. Only a full refresh sees the
        # whole work list; a hinted pass would prune every live entry it didn't
        # recompute. After the loops above, results ⊆ cache, so a size check
        # spots the no-eviction common case.
        if keys is None and len(self._cache) > len(results):
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
