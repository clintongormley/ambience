"""The result budget: no tool result may exceed what the client will accept.

Filtering makes a payload SMALLER; only a budget makes it BOUNDED. The backend
already serves counts instead of rows, but two terms are still unbounded — a user
can expose fifty actions (each schema ~1k chars), and a model can ask for a page
of any size — so the last line of defence lives here, at the serialization
boundary: an oversized payload DEGRADES, announced, instead of erroring.

Truncation is always announced with the way to get the rest. A silently truncated
catalog is worse than a hard error, because the model authors against entities it
cannot see.
"""

from __future__ import annotations

import json
import os
from collections.abc import Callable
from typing import Any

DEFAULT_MAX_RESULT_CHARS = 60_000
"""~15k tokens at a conservative 4 chars/token — well under a 25k-token client cap.

Characters, not tokens, on purpose: no tokenizer dependency, and JSON tokenizes
WORSE than prose, so a 4 chars/token assumption errs on the safe side.

This budgets the WIRE payload, not the logical one: see `size_of`. Measuring
compact `json.dumps` here would under-count what the client actually receives
by roughly 1.6-2.6x and silently break the boundedness this whole module
exists to guarantee.
"""

_ENV_VAR = "AMBIENCE_MCP_MAX_RESULT_CHARS"


def max_result_chars() -> int:
    """The budget, honouring the env override. A nonsense override (unparseable,
    zero, negative) falls back to the default rather than disabling the guard —
    the one thing that must never happen is an unbounded result."""
    raw = os.environ.get(_ENV_VAR)
    if raw is None:
        return DEFAULT_MAX_RESULT_CHARS
    try:
        value = int(raw)
    except ValueError:
        return DEFAULT_MAX_RESULT_CHARS
    return value if value > 0 else DEFAULT_MAX_RESULT_CHARS


def size_of(payload: Any) -> int:
    """The payload's size as the client will actually receive it on the wire.

    FastMCP does not send compact JSON. Every tool here is annotated
    `-> dict[str, Any]`, which FastMCP turns into an output schema, so a result
    is serialized TWICE: once pretty-printed (`indent=2`) as the text content
    block, and again, byte-for-byte the same, as `structuredContent`. Nested
    action schemas — exactly what `fit_context` exists to shed — inflate ~97%
    under `indent=2` alone, before the duplication.

    Measuring compact `json.dumps` therefore under-counts the real wire size by
    roughly 1.6-2.6x, worst where it matters most, and would let an "it fits"
    result sail through that the client actually rejects. `json.dumps(indent=2)`
    is not byte-identical to FastMCP's `pydantic_core.to_json(indent=2)`, but it
    is a faithful stand-in, and keeps this module free of a FastMCP/pydantic-core
    dependency.
    """
    return 2 * len(json.dumps(payload, indent=2, default=str))


def fit_context(context: dict[str, Any], budget: int | None = None) -> dict[str, Any]:
    """Shed action schemas, biggest first, until the context fits.

    Schemas are the only unbounded term left in the context (everything else is
    counts), and they are the most sheddable: the model can still see every
    exposed action's id in `actions.exposed`, it just loses the field detail for
    the ones named in `schemas_omitted`. Biggest-first sheds the fewest schemas
    for the bytes reclaimed.
    """
    limit = max_result_chars() if budget is None else budget
    if size_of(context) <= limit:
        return context

    actions = context.get("actions")
    schemas = actions.get("schemas") if isinstance(actions, dict) else None
    if not isinstance(schemas, dict) or not schemas:
        return context  # nothing left to shed — an honest oversized result beats a crash

    kept = dict(schemas)
    omitted: list[str] = []
    fitted = context
    for name in sorted(schemas, key=lambda k: size_of(schemas[k]), reverse=True):
        del kept[name]
        omitted.append(name)
        fitted = {
            **context,
            "actions": {**actions, "schemas": kept},
            "schemas_omitted": sorted(omitted),
        }
        if size_of(fitted) <= limit:
            break
    return fitted


def _trim_list_to_fit(
    result: dict[str, Any],
    key: str,
    limit: int,
    derive_fields: Callable[[int], dict[str, Any]],
) -> dict[str, Any]:
    """The floor-at-one-element trim loop shared by `fit_entities` and
    `fit_traces`: drop items from the END of `result[key]` until the result
    fits, never going below ONE item.

    This floor is the trickiest invariant in this module. A trim to zero items
    is never safe: for `fit_entities` it would re-point the cursor at the
    caller's own offset, so a conforming pagination client would fetch that
    identical empty page forever; for `fit_traces` it would tell the model
    nothing happened at all. One item, however oversized, is always an honest,
    forward-making result — the same philosophy `fit_context` documents for its
    own "nothing left to shed" case.

    `derive_fields(kept_len)` recomputes the caller-specific metadata (cursor/
    truncated for entities, omitted/notice for traces) for a trim of that
    length. Measuring the dict we would actually RETURN — those recomputed
    fields included, not a stand-in that still carries the pre-trim values — is
    required for correctness: the fields themselves cost bytes too, and sizing
    anything else risks handing back a result still over budget by a few chars.

    Bails out unchanged if `result[key]` is missing, not a list, or empty —
    there is nothing to trim.
    """
    rows = result.get(key)
    if not isinstance(rows, list) or not rows:
        return result

    kept = list(rows)
    while True:
        candidate = {**result, key: kept, **derive_fields(len(kept))}
        if size_of(candidate) <= limit or len(kept) <= 1:
            return candidate
        kept.pop()


def fit_entities(result: dict[str, Any], budget: int | None = None) -> dict[str, Any]:
    """Drop rows from the end of a page until it fits, and re-point the cursor at
    the first row dropped.

    Re-pointing is the whole game: a trimmed page whose cursor still pointed past
    the dropped rows would make them UNREACHABLE — a silent hole in the catalog.
    The backend told us the page's `offset`, so the next cursor is exactly
    `offset + kept`.

    Trimming never goes below one row (see `_trim_list_to_fit`): a zero-row page
    would set `next_cursor == offset`, handing the caller back the exact cursor
    it just used, so a conforming pagination client would fetch that identical
    empty page forever. Flooring at one row instead guarantees
    `next_cursor >= offset + 1` whenever rows exist, so paging always makes
    progress and no row is ever silently skipped.
    """
    limit = max_result_chars() if budget is None else budget
    if size_of(result) <= limit:
        return result

    rows = result.get("entities")
    if not isinstance(rows, list) or not rows:
        return result

    total = result.get("total_matches", len(rows))
    offset = result.get("offset", 0)

    def derive_fields(kept_len: int) -> dict[str, Any]:
        next_cursor = offset + kept_len
        more = next_cursor < total
        return {"returned": kept_len, "cursor": next_cursor if more else None, "truncated": more}

    return _trim_list_to_fit(result, "entities", limit, derive_fields)


def fit_traces(result: dict[str, Any], budget: int | None = None) -> dict[str, Any]:
    """Drop trace records from the END of the list until the result fits,
    announcing what was cut instead of truncating silently.

    `ambience/traces/list` takes an uncapped `limit` — by design, the backend's
    contract is unchanged here — so a model that asks for (or gets the default
    of) more than fits is the exact unbounded-result failure this module exists
    to prevent, just reached through a different tool. Unlike `fit_entities`
    there is no cursor to re-point: the list is a prefix of the trace buffer,
    newest first, so the fix is to say how many were kept/omitted and let the
    model ask again with a smaller `limit` for a different slice.

    Trimming never goes below one trace (see `_trim_list_to_fit`): a smaller,
    honest result beats an empty one that tells the model nothing happened.
    """
    limit = max_result_chars() if budget is None else budget
    if size_of(result) <= limit:
        return result

    traces = result.get("traces")
    total = len(traces) if isinstance(traces, list) else 0

    def derive_fields(kept_len: int) -> dict[str, Any]:
        omitted = total - kept_len
        notice = (
            f"Showing {kept_len} of {total} traces; the oldest {omitted} were "
            "omitted to fit the result budget. Call again with a smaller limit to see "
            "a different slice."
            if omitted
            else None
        )
        return {"returned": kept_len, "omitted": omitted, "notice": notice}

    return _trim_list_to_fit(result, "traces", limit, derive_fields)
