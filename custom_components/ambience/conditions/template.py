"""TemplateCondition — evaluate a Jinja2 template (against HA state) to a boolean.

The lightweight sibling of `script`: same "collect every distinct predicate
across all scopes, pre-evaluate in snapshot(), pure dict lookup in matches()"
shape, but it renders a Jinja template instead of calling a service. No service
call and no TTL cache — rendering is cheap and synchronous, so each snapshot
renders fresh.

Each template is rendered via ``Template.async_render_to_info()``, which returns
both the result AND the set of entities/flags the render touched. We coerce the
result to a bool with ``result_as_boolean`` (HA's own truthiness scene) and stash
the dependency info — the trigger engine can later read it for free.
"""

from __future__ import annotations

import logging
from collections.abc import Mapping
from dataclasses import dataclass, field
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import TemplateError
from homeassistant.helpers.template import Template, result_as_boolean

from ..errors import AmbienceError
from ..triggers import EMPTY, TriggerSpec
from ._opaque import OpaquePrecomputedCondition

_LOGGER = logging.getLogger(__name__)


@dataclass(frozen=True)
class TemplateDeps:
    """What a template render touched — fuel for the auto-trigger engine.

    ``entities`` are the specific entity_ids referenced; ``all_states`` is True
    if the template scanned every state (expensive to watch); ``has_time`` is
    True if it used ``now()``/``utcnow()`` (needs periodic re-evaluation).
    """

    entities: frozenset[str] = frozenset()
    all_states: bool = False
    has_time: bool = False


@dataclass(frozen=True)
class TemplateSnapshot:
    """Frozen view of pre-computed template render results.

    ``results[template_str]`` is the rendered value coerced to bool; any render
    error is recorded as ``False``. ``deps`` carries the dependency info keyed
    by the same template string.
    """

    results: dict[str, bool] = field(default_factory=dict)
    deps: dict[str, TemplateDeps] = field(default_factory=dict)


class TemplateCondition(OpaquePrecomputedCondition[TemplateSnapshot]):
    """Matches by rendering a Jinja2 template against HA state to a boolean."""

    name = "template"
    description = "Matches by rendering a Jinja2 template against HA state to a boolean."
    predicate_help = (
        "Object {template: '{{ ... }}'}. The Jinja template is rendered against "
        "current state; the result is coerced to a boolean the same way Home "
        "Assistant does (true/yes/on/1/enable and nonzero numbers => match; "
        "everything else, including unknown/none/empty, => no match). "
        "None = wildcard."
    )
    input = "template_predicate"
    # Just below script (975): both are opaque user-defined booleans. A template
    # is an arbitrary expression, so it has a lower priority than the
    # slightly-more-structured named-script constraint.
    priority = 970

    # --- protocol stubs ----------------------------------------------------

    def order_key(self, predicate: Any) -> str:
        if not isinstance(predicate, dict):
            return ""
        tmpl = predicate.get("template")
        return tmpl if isinstance(tmpl, str) else ""

    # --- validation --------------------------------------------------------

    def validate_predicate(self, predicate: Any) -> None:
        if predicate is None:
            return
        if not isinstance(predicate, dict):
            raise AmbienceError("template_predicate_not_object", predicate=predicate)
        tmpl = predicate.get("template")
        if not isinstance(tmpl, str) or not tmpl.strip():
            raise AmbienceError("template_empty", template=tmpl)
        try:
            Template(tmpl, self._hass).ensure_valid()
        except TemplateError as exc:
            raise AmbienceError("template_invalid_jinja", error=exc) from exc

    # --- evaluation --------------------------------------------------------

    def result_key(self, predicate: Any) -> str:
        """The key this predicate's result is stored under in the snapshot (the
        template string), or "" if malformed. Shared by `matches()` and the
        simulator's verdict knobs so both agree on the identity."""
        if not isinstance(predicate, dict):
            return ""
        tmpl = predicate.get("template")
        return tmpl if isinstance(tmpl, str) else ""

    def snapshot_from_results(self, results: dict[str, bool]) -> TemplateSnapshot:
        # No `deps`: a forced verdict is a leaf, watched by nothing.
        return TemplateSnapshot(results=dict(results))

    def verdict_label(self, predicate: Any, scene: Mapping[str, Any]) -> tuple[str | None, str]:
        """A template names no entity, so the owning scene is the only handle a
        user recognises."""
        return None, scene.get("name") or "Template"

    # --- trigger dependencies ---------------------------------------------

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        if not isinstance(predicate, dict):
            return EMPTY
        tmpl = predicate.get("template")
        if not isinstance(tmpl, str) or not tmpl.strip():
            return EMPTY
        if self._hass is None:
            # Can't introspect the template without hass → deps unknown.
            return TriggerSpec(opaque=True)
        try:
            info = Template(tmpl, self._hass).async_render_to_info()
        except TemplateError:
            return TriggerSpec(opaque=True)
        # `entities`/`domains`/`all_states`/`has_time` are collected even when the
        # render then errors (e.g. an entity is momentarily 'unknown'), so a render
        # exception is not itself a reason to distrust the deps. Over-broadness —
        # scanning every state (`all_states`) or iterating a whole domain
        # (`domains`, e.g. `states.sensor`) — is: we can't watch that
        # entity-by-entity, so flag opaque to make the engine warn and fall back.
        over_broad = bool(info.all_states or info.domains)
        return TriggerSpec(
            entities=frozenset(info.entities),
            has_time=bool(info.has_time),
            opaque=over_broad,
        )

    # --- snapshot orchestration -------------------------------------------

    def _template_key(self, pred: dict[str, Any]) -> str | None:
        """The non-empty template string for one predicate, or None if malformed
        (skipped by `_distinct_keys`)."""
        tmpl = pred.get("template")
        return tmpl if isinstance(tmpl, str) and tmpl else None

    def _collect_templates(self) -> list[str]:
        """Distinct, non-empty template strings carried by `when.template`
        predicates across all scopes (areas, floors, house)."""
        return self._distinct_keys(self._template_key)

    async def _compute(
        self,
        hass: HomeAssistant,
        keys: frozenset[str] | None,
        previous: TemplateSnapshot | None,
    ) -> TemplateSnapshot:
        results: dict[str, bool] = {}
        deps: dict[str, TemplateDeps] = {}
        # A result key IS the template string, so a hint is the work list itself
        # — no store walk, and only the named templates render.
        work = sorted(keys) if keys is not None else self._collect_templates()
        for tmpl in work:
            info = Template(tmpl, hass).async_render_to_info()
            if info.exception is not None:
                _LOGGER.warning("ambience: template %r render failed: %s", tmpl, info.exception)
                results[tmpl] = False
            else:
                results[tmpl] = result_as_boolean(info.result())
            deps[tmpl] = TemplateDeps(
                entities=frozenset(info.entities),
                all_states=info.all_states,
                has_time=info.has_time,
            )
        return TemplateSnapshot(
            results=self._merge_over_previous(keys, previous.results if previous else {}, results),
            deps=self._merge_over_previous(keys, previous.deps if previous else {}, deps),
        )
