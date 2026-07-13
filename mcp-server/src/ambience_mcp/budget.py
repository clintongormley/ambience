"""The result budget: no tool result may exceed what the client will accept.

Filtering makes a payload SMALLER; only a budget makes it BOUNDED. The backend
already serves counts instead of rows, but two terms are still unbounded — a user
can expose fifty actions (each schema ~1k chars), and a model can ask for a page
of any size.

Two layers enforce this. `fit_context`/`fit_entities`/`fit_traces`/`fit_preview`
understand their tool's shape and DEGRADE it safely — truncating a paged/
appendable list that is never written back wholesale, always announced with
the way to get the rest. `fit_preview` is the odd one out: `preview_write`'s
diff is NOT appendable/truncatable (see its own docstring for why), so it
degrades by summarising instead — same idea, different mechanism. `fit_result`,
the terminal backstop at the serialization boundary (see
`server.py`'s `_BoundedFastMCP`), has no such shape knowledge, so it never
trims: a result still over budget when it reaches that boundary is replaced by
a small, bounded error object instead. A silently truncated catalog is worse
than a hard error, because the model authors against entities it cannot see —
and a truncated list that a write path treats as complete (e.g.
`ambience_get_scope`'s `scenes`) is worse still, because it can silently
delete data. See `fit_result`'s docstring for the full story.
"""

from __future__ import annotations

import json
import os
from collections.abc import Callable
from typing import Any

from .diff import summarise_diff

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

    ordered = sorted(schemas, key=lambda k: size_of(schemas[k]), reverse=True)

    def candidate(shed: int) -> dict[str, Any]:
        dropped = set(ordered[:shed])
        return {
            **context,
            "actions": {
                **actions,
                "schemas": {k: v for k, v in schemas.items() if k not in dropped},
            },
            "schemas_omitted": sorted(ordered[:shed]),
        }

    # Shedding order is fixed (biggest first), so find the SMALLEST shed count
    # that fits by bisection — identical result to the old one-dump-per-shed
    # loop, in O(log n) measurements. If even shedding everything does not fit,
    # return that honest oversized result (fit_result is the backstop).
    lo, hi = 1, len(ordered)
    while lo < hi:
        mid = (lo + hi) // 2
        if size_of(candidate(mid)) <= limit:
            hi = mid
        else:
            lo = mid + 1
    fitted = candidate(lo)
    while lo < len(ordered) and size_of(fitted) > limit:
        lo += 1
        fitted = candidate(lo)
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

    Bisects instead of dropping one row per full re-measure — see the inline comment.
    """
    rows = result.get(key)
    if not isinstance(rows, list) or not rows:
        return result

    def candidate(kept_len: int) -> dict[str, Any]:
        return {**result, key: rows[:kept_len], **derive_fields(kept_len)}

    # Size grows monotonically with kept rows, so bisect for the largest length
    # that fits — O(log n) full measurements instead of one per dropped row
    # (which re-serialized a >60k-char dict up to len(rows) times, on the event
    # loop, stalling every concurrent tool call). derive_fields can nudge sizes
    # by a few chars (cursor digits, the traces notice), so the bisection
    # result is verified against the EXACT dict returned and nudged down if
    # needed — measure-what-you-return still holds.
    lo, hi = 1, len(rows)
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if size_of(candidate(mid)) <= limit:
            lo = mid
        else:
            hi = mid - 1
    while lo > 1 and size_of(candidate(lo)) > limit:
        lo -= 1
    return candidate(lo)


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
        # The floor-at-one case (see _trim_list_to_fit) can return here with
        # nothing actually omitted — an oversized single trace still over
        # budget on its own. `omitted: 0` / `notice: None` would be noise in
        # that case, so both keys are suppressed together, same as
        # `fit_context`'s "nothing omitted" case.
        omitted = total - kept_len
        if not omitted:
            return {"returned": kept_len}
        notice = (
            f"Showing {kept_len} of {total} traces; the oldest {omitted} were "
            "omitted to fit the result budget. Call again with a smaller limit to see "
            "a different slice."
        )
        return {"returned": kept_len, "omitted": omitted, "notice": notice}

    return _trim_list_to_fit(result, "traces", limit, derive_fields)


def fit_preview(result: dict[str, Any], budget: int | None = None) -> dict[str, Any]:
    """Elide `preview_write`'s diff BODIES, never its ENTRIES, when the full diff
    busts the budget.

    `diff_scopes` lists full scene bodies, and replacing a whole scope lists
    every scene TWICE (once in `removed`, once in `added`) — a normal
    "redo my scenes" request can double the scope's size and bust the budget on
    its own. Trimming here would be unsafe in the way `fit_result`'s docstring
    warns about generic trims being unsafe: the diff is the surface a human
    approves a write from, and `apply_write` REPLACES the whole scope, so
    dropping an entry would let someone approve changes they never saw.

    So this never drops an entry. It replaces `diff` with `summarise_diff(diff)`
    — same `added`/`removed`/`updated` shape, same COUNT in each list, just
    scene bodies swapped for compact identifiers (name/category, and which
    fields changed for an update) — and leaves every other field, especially
    `confirm_token`, untouched: the token still applies to the exact payload
    previewed, and the summarised diff still lists every scene it covers.

    If the summarised result is STILL over budget (pathological — thousands of
    changed scenes), this leaves it alone; `fit_result`, the terminal backstop,
    will replace it with the bounded error object. There is no second
    truncation path here — see `fit_result`'s docstring for why a generic trim
    of a still-oversized result is never safe.
    """
    limit = max_result_chars() if budget is None else budget
    if size_of(result) <= limit:
        return result
    diff = result.get("diff")
    if not isinstance(diff, dict):
        return result  # nothing this strategy understands — leave it for fit_result
    return {
        **result,
        "diff": summarise_diff(diff),
        "diff_summarised": True,
        "notice": (
            "Scene bodies were elided from `diff` to fit the response budget. Every "
            "changed scene is still listed (added/removed/updated, by name/category), "
            "just without its full body. Use ambience_get_scope or ambience_dry_run to "
            "inspect a specific scene's detail."
        ),
    }


def fit_result(result: Any, budget: int | None = None) -> Any:
    """The terminal backstop underneath `fit_context`/`fit_entities`/`fit_traces`:
    applied to EVERY tool's return value at the server boundary (see
    `server.py`'s `_BoundedFastMCP`), so a tool with no shape-aware strategy —
    one of the 8 that had none, or a brand new one nobody has written a
    strategy for yet — still cannot ship an unbounded result.

    Idempotent and cheap: a result already within budget (including one already
    handled by a shape-aware strategy above) is returned unchanged, so this is a
    no-op layered under those, not a replacement for them.

    This function used to trim the largest top-level list, generically, when a
    result was still over budget here. That was a blunt instrument applied to
    shapes it does not understand, and it was actively dangerous:

    - `ambience_get_scope`'s `scenes` list has no shape-aware strategy of its
      own, so an oversized scope got silently cut short. `ambience_apply_write`
      treats a scope's scene list as the COMPLETE set to persist — any scene
      left out is deleted — so a model that read a truncated `scenes`, and
      followed the documented "carry forward every scene you mean to keep"
      workflow, would silently delete the scenes it never saw. A generic trim
      must never be able to feed a destructive write.
    - Trimming the largest top-level list isn't necessarily trimming the BULK:
      it could cut a small audit/blocking list (e.g. `get_guide`'s table of
      contents, `get_context`'s `schemas_omitted`, `preview_write`'s
      `unknown_categories`) while the real bulk sits elsewhere, untouched and
      the result still over budget.
    - When the bulk is nested (e.g. `preview_write`'s `diff.added/removed/
      updated`), a top-level-only pass cannot reach it at all, so boundedness
      was never actually structural for those shapes.

    So: a result that is still over budget when it reaches this boundary is
    never trimmed. It is replaced by a small, fixed-shape error object instead
    — always bounded, never a truncation of the original payload, and
    incapable of feeding a destructive write, because there is no partial list
    within it for a caller to carry forward.

    Returned unchanged if `result` isn't a dict or already fits.
    """
    limit = max_result_chars() if budget is None else budget
    if not isinstance(result, dict):
        return result
    size = size_of(result)
    if size <= limit:
        return result
    return {
        "error": "result_too_large",
        "size_chars": size,
        "budget_chars": limit,
        "message": (
            f"This result is {size} chars, over the {limit}-char budget, and cannot be "
            "safely trimmed. Narrow the request (a filter, a smaller limit, or a "
            "narrower scope), or use the Ambience panel."
        ),
    }
