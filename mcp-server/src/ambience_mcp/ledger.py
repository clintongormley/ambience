"""The preview->apply gate. `preview_write` records a fingerprint of the exact
proposed payload; `apply_write` will only commit if the caller passes back that
same fingerprint AND it is still in the ledger. This forces a diff/dry-run step
before any write and rejects a write whose payload drifted after the preview."""

from __future__ import annotations

import hashlib
import json
from typing import Any


def fingerprint(scope: dict[str, Any], scenes: list[dict[str, Any]]) -> str:
    # This fingerprint is a workflow-ordering gate (it forces a preview before an
    # apply of the SAME payload within one in-memory session), not a security
    # control — there is no adversary and no secret. `usedforsecurity=False` says
    # exactly that; it does not change the digest, so existing fingerprints hold.
    payload = json.dumps({"scope": scope, "scenes": scenes}, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8"), usedforsecurity=False).hexdigest()[:16]


class PreviewLedger:
    def __init__(self) -> None:
        self._seen: set[str] = set()

    def record(self, fp: str) -> None:
        self._seen.add(fp)

    def consume(self, fp: str) -> bool:
        if fp in self._seen:
            self._seen.discard(fp)
            return True
        return False
