"""The AI context: the bounded export the MCP server reads.

The AI bundle (download-and-paste) must carry EVERYTHING, because the AI on the
other end of a paste has no tools — strip its entity catalog and it cannot author
at all. The MCP consumer is the opposite: it has tools, and a hard cap on how much
one tool result may return. On a real install the fat bundle is ~358k chars (~90k
tokens) and is rejected outright.

So this export carries only what is provably small — counts, not rows — and the
model reaches for the detail on demand:

    entity rows   → ambience/entities/find
    scene lists   → ambience/{area,floor,house}/get
    traces        → ambience/traces/list

Curation was rejected: no static filter is sound, because a `state` condition can
name any entity in the house and exposing a new action can make a previously
irrelevant domain relevant. Nothing here is hidden — it is summarised, and
reachable through the commands above.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .ai_common import action_schemas, ambience_version, areas, floors
from .const import AI_CONTEXT_VERSION, DATA_STORE, DOMAIN
from .entity_catalog import entity_rows, entity_summary
from .lux_ranges import LuxRangeStore
from .periods import PeriodStore
from .redact import redact_exposed_action, redact_store
from .services_meta import get_service_schema


def _thin_scope(scope_config: Any) -> Any:
    """One scope's config with its `scenes` list replaced by a count."""
    if not isinstance(scope_config, dict) or "scenes" not in scope_config:
        return scope_config
    thinned = {k: v for k, v in scope_config.items() if k != "scenes"}
    scenes = scope_config["scenes"]
    thinned["scene_count"] = len(scenes) if isinstance(scenes, list) else 0
    return thinned


def _thin_config(config: dict[str, Any]) -> dict[str, Any]:
    """The store config with every scope's scene list replaced by a count.

    Thinned, NOT dropped. The scene lists are 51.8k of the fat bundle's 56k config
    and `ambience/{scope}/get` already serves them on demand — but the rest
    (`conditions`, `switch_defaults`, `reapply`, `exposed_actions`,
    `exposed_assistants`, `categories`) is ~3.2k that NO other command serves, so
    dropping the config wholesale would lose house-level settings the model needs.
    """
    thinned = dict(config)
    for group_key in ("areas", "floors"):
        group = thinned.get(group_key)
        if isinstance(group, dict):
            thinned[group_key] = {
                scope_id: _thin_scope(scope_config) for scope_id, scope_config in group.items()
            }
    if isinstance(thinned.get("house"), dict):
        thinned["house"] = _thin_scope(thinned["house"])
    return thinned


async def build_ai_context(hass: HomeAssistant) -> dict[str, Any]:
    """Assemble the bounded MCP export from the live install."""
    store = hass.data[DOMAIN][DATA_STORE]
    exposed = store.get_exposed_actions()
    return {
        "ambience_ai_context": AI_CONTEXT_VERSION,
        "ambience_version": await ambience_version(hass),
        "generated_at": dt_util.utcnow().isoformat(),
        "catalog": {
            "areas": areas(hass),
            "floors": floors(hass),
            # Counts, not rows. `ambience/entities/find` serves the rows.
            "entity_summary": entity_summary(entity_rows(hass)),
        },
        "actions": {
            "exposed": [redact_exposed_action(a) for a in exposed],
            "schemas": await action_schemas(hass, exposed, fetch=get_service_schema),
        },
        "definitions": {
            "categories": store.categories(),
            "periods": PeriodStore(store).view_for_ui(),
            "lux_ranges": LuxRangeStore(store).view_for_ui(),
        },
        "config": _thin_config(redact_store(store.as_dict())),
        # No `traces` — ambience/traces/list serves them (51k chars in the bundle).
    }
