"""The preview->apply gate. `preview_write` records a fingerprint of the exact
proposed payload; `apply_write` will only commit if the caller passes back that
same fingerprint AND it is still in the ledger. This forces a diff/dry-run step
before any write and rejects a write whose payload drifted after the preview."""

from __future__ import annotations

import hashlib
import json
from typing import Any


def fingerprint(
    scope: dict[str, Any],
    scenes: list[dict[str, Any]],
    new_categories: list[dict[str, Any]] | None = None,
) -> str:
    # This fingerprint is a workflow-ordering gate (it forces a preview before an
    # apply of the SAME payload within one in-memory session), not a security
    # control — there is no adversary and no secret. `usedforsecurity=False` says
    # exactly that; it does not change the digest, so existing fingerprints hold.
    obj: dict[str, Any] = {"scope": scope, "scenes": scenes}
    if new_categories:  # omit when empty so tokens with no declared categories are unchanged
        obj["new_categories"] = new_categories
    payload = json.dumps(obj, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8"), usedforsecurity=False).hexdigest()[:16]


class PreviewLedger:
    # Cap outstanding (previewed-but-unapplied) tokens so a long session that
    # previews far more than it applies can't grow the set without bound. The
    # oldest outstanding token evicts first; re-recording refreshes its recency.
    _MAX = 1024

    def __init__(self) -> None:
        self._seen: dict[str, None] = {}  # insertion-ordered set

    def record(self, fp: str) -> None:
        self._seen.pop(fp, None)
        self._seen[fp] = None
        while len(self._seen) > self._MAX:
            del self._seen[next(iter(self._seen))]

    def consume(self, fp: str) -> bool:
        if fp in self._seen:
            del self._seen[fp]
            return True
        return False

    def holds(self, fp: str) -> bool:
        """Membership peek — never consumes. apply_write checks upfront but
        spends the token only after the save SUCCEEDS."""
        return fp in self._seen
