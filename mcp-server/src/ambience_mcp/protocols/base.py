"""The version-invariant half of the MCP tool surface.

Eight of the eleven tools mean the same thing to every backend Ambience has ever
served, so they live here once: a bug fixed in `get_scope` is fixed for every
protocol. The three that differ — `get_context`, `find_entities`, `list_traces` —
are declared here and implemented per protocol, so a `vN.py` that forgets one fails
loudly instead of silently inheriting another protocol's behaviour.
"""

from __future__ import annotations

from typing import Any

from ..budget import fit_preview
from ..diff import diff_scopes
from ..ha_client import HACommandError
from ..ledger import PreviewLedger, fingerprint
from ..tools import (
    _GUIDE_USAGE,
    CommandUnavailable,
    GuideCache,
    ToolError,
    _id_payload,
    _merge_categories,
    _parse_scope,
    _scope_key,
    _split_guide_sections,
    _strip_ranks,
    _with_ranks,
)


def _has_category(scene: dict[str, Any]) -> bool:
    """A scene "has a category" only for a genuinely-named, non-empty id — a
    falsy value (`""`) passes `isinstance(..., str)` but is never a registered
    category, so it must NOT count as having one. Shared by `preview_write`'s
    unknown-categories and uncategorised-scenes gates, which need this same
    predicate stated once each, positively and negated."""
    category = scene.get("category")
    return isinstance(category, str) and bool(category)


class BaseProtocol:
    """Talks to one Ambience over an HAClient. Subclassed per protocol version."""

    def __init__(
        self,
        client: Any,
        ledger: PreviewLedger,
        guide_cache: GuideCache,
        *,
        protocol: int,
    ) -> None:
        self.client = client
        self.ledger = ledger
        self.guide_cache = guide_cache
        # The protocol this adapter was BUILT for — the key it was looked up under in
        # PROTOCOLS. Every command it sends carries it (see `command`), so the client
        # can refuse to put a v1-shaped command on a backend that has since reconnected
        # at v2. Required, not defaulted: an adapter that does not know its own protocol
        # cannot state the assumption it is asking the client to hold.
        self.protocol = protocol

    async def command(self, type: str, **payload: Any) -> dict[str, Any]:
        """Every backend call an adapter makes goes through here — pinned to the
        protocol the adapter was built for.

        Not `self.client.command(...)`: the client's own idea of the current protocol
        is shared mutable state that a CONCURRENT tool call can change (an HA restart
        under a parallel command reconnects and re-handshakes). Only the adapter holds
        the vN assumption, so only the adapter can supply it.

        `unknown_command` is rewritten: this adapter exists because THIS connection
        handshook successfully, so the backend cannot be too old — its commands are
        unregistered right now (a config-entry reload after an options save, or the
        integration was disabled). The raw error carried no remedy at all.
        """
        try:
            return await self.client.command_for(self.protocol, type, **payload)
        except HACommandError as exc:
            if exc.code == "unknown_command":
                raise CommandUnavailable(
                    f"Home Assistant reports {type!r} is unavailable, but this Ambience "
                    "answered the protocol handshake on this same connection — it is "
                    "reloading (an options save does that) or was disabled. Wait a moment "
                    "and try again; if it persists, re-enable the Ambience integration."
                ) from exc
            raise

    # --- protocol-specific: every subclass MUST implement these three ---

    async def get_context(self) -> dict[str, Any]:
        raise NotImplementedError("each protocol defines its own authoring context")

    async def find_entities(self, *args: Any, **kwargs: Any) -> dict[str, Any]:
        raise NotImplementedError("each protocol defines its own entity search")

    async def list_traces(self, limit: int | None = None) -> dict[str, Any]:
        raise NotImplementedError("each protocol defines its own trace listing")

    # --- version-invariant ---

    async def get_scope(self, scope: dict[str, Any]) -> dict[str, Any]:
        kind, sid = _parse_scope(scope)
        result = await self.command(f"ambience/{kind}/get", **_id_payload(kind, sid))
        if isinstance(result.get("scenes"), list):
            result["scenes"] = _with_ranks(result["scenes"])
        return result

    async def get_guide(self, section: str | None = None) -> dict[str, Any]:
        """Fetch the authoring guide (schema + cookbook) from the running install, one
        section at a time.

        With no `section`, returns the list of section names (a table of contents).
        With a `section`, returns just that section's text. The full guide is ~25k
        tokens and does not fit in a single tool result, which is why there is no
        "give me all of it" mode. A backend caught mid config-entry-reload (or
        disabled) returns {unavailable: true} instead of raising — see `command`.
        """
        held = {"have_version": self.guide_cache.version} if self.guide_cache.version else {}
        try:
            payload = await self.command("ambience/ai_guide", **held)
        except CommandUnavailable as exc:
            return {"unavailable": True, "message": str(exc)}

        if payload.get("unchanged"):
            # We only claim a version we actually hold, so the cache is populated here.
            sections, version = self.guide_cache.sections, self.guide_cache.version
        else:
            # Always answer from what THIS fetch returned — never fall back to a cached
            # older guide, which would serve stale text under the new version's number.
            sections = _split_guide_sections(payload.get("guide") or "")
            version = payload.get("ambience_version")
            self.guide_cache.store(version, sections)
        meta = {
            "ambience_version": version,
            "sections": list(sections),
        }
        if section is None:
            return {**meta, "usage": _GUIDE_USAGE}
        if section not in sections:
            return {**meta, "error": f"Unknown guide section {section!r}.", "usage": _GUIDE_USAGE}
        return {**meta, "section": section, "guide": sections[section]}

    async def dry_run(self, scope: dict[str, Any]) -> dict[str, Any]:
        kind, sid = _parse_scope(scope)
        # dry_run uses HA's shared scope selector, which marks house with `house: True`
        # rather than an id key; area/floor reuse the same id selector as get/save.
        selector = _id_payload(kind, sid) or {"house": True}
        # Always redacted: the plan carries presence/location-revealing describes
        # (people, template, unavailable, occupancy) and the winning scene's raw
        # action params (lock/alarm codes) — the same PII classes list_traces
        # already redacts on this session. An older backend rejects the extra key
        # at the schema layer (invalid_format); retry without it and SAY so,
        # rather than failing a working tool or leaking silently. Any OTHER
        # HACommandError (e.g. validation_error) must propagate — this is not a
        # generic "retry on any error" branch, it exists solely to work around a
        # backend that doesn't understand the `redact` key yet.
        try:
            return await self.command("ambience/dry_run", redact=True, **selector)
        except HACommandError as exc:
            if exc.code != "invalid_format":
                raise
            result = await self.command("ambience/dry_run", **selector)
            result["notice"] = (
                "This Ambience does not support redacting dry_run results; presence "
                "detail and security action params may appear unredacted. Update "
                "Ambience (HACS) and restart Home Assistant to enable redaction."
            )
            return result

    async def validate(self, scenes: list[dict[str, Any]]) -> dict[str, Any]:
        # Strip the read-only `rank` annotation, like the write paths, so a caller that
        # validates scenes it just read never leaks it to the backend validator.
        return await self.command("ambience/validate", config={"scenes": _strip_ranks(scenes)})

    async def preview_write(
        self,
        scope: dict[str, Any],
        scenes: list[dict[str, Any]],
        new_categories: list[dict[str, Any]] | None = None,
    ) -> dict[str, Any]:
        kind, sid = _parse_scope(scope)
        scenes = _strip_ranks(scenes)  # `rank` is a read-only annotation, never stored
        new_categories = new_categories or []
        current = (await self.command(f"ambience/{kind}/get", **_id_payload(kind, sid))).get(
            "scenes", []
        )
        # `current` is backend-sourced, so a too-new/unknown bundle could reshape it (same
        # risk _with_ranks guards on the read path). We can't diff against scenes we can't
        # read, so fall back to an empty baseline rather than let diff_scopes raise — the
        # write's validity is decided by validate + categories below, not by the diff. Check
        # the container too: `{"scenes": null}` makes `.get`'s default moot, leaving None.
        if not isinstance(current, list) or not all(isinstance(scene, dict) for scene in current):
            current = []
        try:
            # Through the METHOD, not an inline command: a vN override of
            # validate() must govern the preview gate too. (_strip_ranks in
            # validate() is idempotent on the already-stripped list.)
            await self.validate(scenes)
            valid, errors = True, None
        except HACommandError as exc:
            valid, errors = False, exc.message
        # The backend silently reassigns a scene with an unknown category to "General"
        # on save, so an unflagged typo would commit something other than the previewed
        # diff. A category counts as known if it already exists OR is declared in
        # new_categories (created on apply); anything else blocks the write.
        cat_list = await self.command("ambience/categories/list")
        existing_by_id = {c.get("id"): c for c in cat_list.get("categories", [])}
        known = set(existing_by_id) | {c.get("id") for c in new_categories}
        # A falsy category (`""`) does not count as "having" one: it passes
        # `isinstance(..., str)` but is never a registered id, so treating it as
        # "has a category" here would land it in `unknown` and trip that gate first
        # with a dangling "unknown categories ...: " message — masking the
        # uncategorised gate below and its actionable message. Empty categories
        # belong to the uncategorised gate; the unknown gate is only for a
        # genuinely-unknown, non-empty id (e.g. a typo).
        unknown = sorted({s["category"] for s in scenes if _has_category(s)} - known)
        # A scene with no category at all is silently moved to "General" by the
        # backend on save (reassign_orphan_scenes) — the stored scope would
        # differ from the approved preview. Same treatment as an unknown
        # category: block the write until every scene names one.
        uncategorised = [i for i, s in enumerate(scenes) if not _has_category(s)]

        def _unknown_categories_error() -> str | None:
            if not unknown:
                return None
            joined = ", ".join(unknown)
            return f"unknown categories (create them or declare in new_categories): {joined}"

        def _uncategorised_scenes_error() -> str | None:
            if not uncategorised:
                return None
            joined = ", ".join(str(i) for i in uncategorised)
            return (
                "every scene must name a category (the backend silently moves "
                f"uncategorised scenes to General): scene index(es) {joined} have none"
            )

        # Ordered, first-match-wins: each check is independent and stateless (no
        # shared "have we already failed" flag to remember), so precedence is
        # explicit in the list order rather than resting on every new gate
        # remembering to guard itself. Unknown before uncategorised is pinned by
        # test_preview_write_with_unknown_and_empty_category_reports_unknown_first.
        # The schema-validate() gate above stays separate: it catches an
        # exception rather than computing a value, a different enough shape that
        # folding it into this list would obscure more than it would unify.
        if valid:
            for category_gate in (_unknown_categories_error, _uncategorised_scenes_error):
                message = category_gate()
                if message is not None:
                    valid, errors = False, message
                    break
        creating = [c for c in new_categories if c.get("id") not in existing_by_id]
        # apply's _merge_categories REPLACES a re-declared existing category
        # wholesale — a rename or a dropped icon is a real mutation the human
        # must see. A byte-identical redeclare is a no-op and stays quiet.
        updating = [
            {"before": existing_by_id[c.get("id")], "after": c}
            for c in new_categories
            if c.get("id") in existing_by_id and c != existing_by_id[c.get("id")]
        ]
        changes = diff_scopes(current, scenes)
        token = fingerprint(_scope_key(kind, sid), scenes, new_categories)
        # Only a fully-valid payload (schema OK + every category known) gets an applyable
        # token; otherwise the fingerprint is returned for reference but recorded nowhere,
        # so apply_write rejects it until the caller fixes the problem.
        if valid:
            self.ledger.record(token)
        return fit_preview(
            {
                "valid": valid,
                "errors": errors,
                "unknown_categories": unknown,
                "creating_categories": creating,
                "updating_categories": updating,
                "diff": changes,
                "confirm_token": token,
            }
        )

    async def apply_write(
        self,
        scope: dict[str, Any],
        scenes: list[dict[str, Any]],
        confirm_token: str,
        new_categories: list[dict[str, Any]] | None = None,
    ) -> dict[str, Any]:
        kind, sid = _parse_scope(scope)
        new_categories = new_categories or []
        scenes = _strip_ranks(scenes)  # `rank` is a read-only annotation, never stored
        token = fingerprint(_scope_key(kind, sid), scenes, new_categories)
        if confirm_token != token or not self.ledger.holds(token):
            raise ToolError(
                "apply_write needs the confirm_token from a preview_write of this exact "
                "payload; run preview_write first (and again if you changed the scenes)"
            )
        # Create any declared categories first (merged into the existing list, which
        # categories/save replaces wholesale) so a scene's new category exists instead
        # of being coerced to General.
        if new_categories:
            existing = (await self.command("ambience/categories/list")).get("categories", [])
            await self.command(
                "ambience/categories/save", categories=_merge_categories(existing, new_categories)
            )
        result = await self.command(
            f"ambience/{kind}/save",
            config={"scenes": scenes},
            change={"action": "import", "scene_name": None},
            minimise_pins=True,
            **_id_payload(kind, sid),
        )
        # Spend the token only now: a failed apply (dropped socket, a
        # startup-window refusal between the category save and this one) keeps
        # it valid, so "try again" is true advice and a retry can complete the
        # half-applied write. The save is a wholesale replace, so retrying the
        # same approved payload is idempotent.
        #
        # This does loosen the gate: `holds()` above only PEEKS (it does not
        # consume), so two concurrent apply_write calls carrying the same token
        # can both pass the check above, both `await` the save, and both reach
        # this consume() (the second is then a harmless no-op — the token is
        # already gone). That is not a consent hole: both calls carry the exact
        # payload the human approved, the save is a wholesale replace, so the
        # end state is identical either way — the only externally visible cost
        # is one extra entry in the undo history.
        self.ledger.consume(token)
        return result

    async def list_categories(self) -> dict[str, Any]:
        return await self.command("ambience/categories/list")

    async def save_categories(self, categories: list[dict[str, Any]]) -> dict[str, Any]:
        return await self.command("ambience/categories/save", categories=categories)
