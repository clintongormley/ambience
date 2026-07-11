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
from typing import Any

DEFAULT_MAX_RESULT_CHARS = 60_000
"""~15k tokens at a conservative 4 chars/token — well under a 25k-token client cap.

Characters, not tokens, on purpose: no tokenizer dependency, and JSON tokenizes
WORSE than prose, so a 4 chars/token assumption errs on the safe side.
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
    """The payload's size as the client will see it."""
    return len(json.dumps(payload, default=str))


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


def fit_entities(result: dict[str, Any], budget: int | None = None) -> dict[str, Any]:
    """Drop rows from the end of a page until it fits, and re-point the cursor at
    the first row dropped.

    Re-pointing is the whole game: a trimmed page whose cursor still pointed past
    the dropped rows would make them UNREACHABLE — a silent hole in the catalog.
    The backend told us the page's `offset`, so the next cursor is exactly
    `offset + kept`.

    Trimming never goes below one row. If even the first row alone exceeds the
    budget, it is served anyway — an honest oversized result, exactly as
    `fit_context` returns an oversized payload when it has nothing left to shed.
    A zero-row page would set `next_cursor == offset`, handing the caller back
    the exact cursor it just used: a conforming pagination client would fetch
    that identical empty page forever. Flooring at one row instead guarantees
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

    kept = list(rows)
    while len(kept) > 1:
        candidate = {**result, "entities": kept, "returned": len(kept)}
        if size_of(candidate) <= limit:
            break
        kept.pop()

    next_cursor = offset + len(kept)
    more = next_cursor < total
    return {
        **result,
        "entities": kept,
        "returned": len(kept),
        "cursor": next_cursor if more else None,
        "truncated": more,
    }
