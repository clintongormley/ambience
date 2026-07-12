"""Protocol 1: the bounded-context contract.

FROZEN. Once this ships in a release it is never edited except to fix a bug in its
own protocol handling — a released Ambience speaking protocol 1 will be talking to
this file forever. New behaviour goes in a new `v2.py`.

Protocol 1 is the contract introduced in Ambience 1.1.0-rc.3:
  - `ambience/ai_context`   — entity COUNTS, not rows; scene counts, not scene lists
  - `ambience/entities/find` — the paged catalog search that keeps every entity reachable
  - `ambience/traces/list`   — honours `redact: true`
"""

from __future__ import annotations

from typing import Any

from ..budget import fit_context, fit_entities, fit_traces
from .base import BaseProtocol


class ProtocolV1(BaseProtocol):
    async def get_context(self) -> dict[str, Any]:
        """The bounded authoring context: counts, not rows.

        Reads `ambience/ai_context`, NOT the fat `ambience/ai_bundle` — that one
        still exists for the download-and-paste flow, where the AI has no tools and
        needs everything inline, but at ~90k tokens it cannot be returned as a tool
        result. Entity rows come from `find_entities`, scene lists from `get_scope`,
        traces from `list_traces`."""
        return fit_context(await self.client.command("ambience/ai_context"))

    async def find_entities(
        self,
        query: str | None = None,
        domain: str | list[str] | None = None,
        area_id: str | list[str] | None = None,
        device_class: str | list[str] | None = None,
        limit: int | None = None,
        cursor: int | None = None,
    ) -> dict[str, Any]:
        """Search the live entity catalog, one bounded page at a time.

        Only the filters the caller actually set are forwarded — sending explicit
        nulls would defeat the backend's `vol.Optional` schema. `is not None`, not
        truthiness: `cursor=0` and `limit=0` are falsy but legitimately SET."""
        payload: dict[str, Any] = {
            key: value
            for key, value in (
                ("query", query),
                ("domain", domain),
                ("area_id", area_id),
                ("device_class", device_class),
                ("limit", limit),
                ("cursor", cursor),
            )
            if value is not None
        }
        return fit_entities(await self.client.command("ambience/entities/find", **payload))

    async def list_traces(self, limit: int | None = None) -> dict[str, Any]:
        """Recent scene-evaluation traces, always redacted.

        `ambience/traces/list` is unredacted by default because the HA panel consumes
        it and needs the real detail — but a trace can carry presence causes (zone
        names), rendered-template location detail, and unredacted alarm codes / lock
        PINs in dispatched action params. This tool sends them to an external AI, so
        it always asks for redaction."""
        payload: dict[str, Any] = {"redact": True}
        if limit is not None:
            payload["limit"] = limit
        return fit_traces(await self.client.command("ambience/traces/list", **payload))
