"""The AI bundle: a single export an external AI consults to author and
diagnose Ambience config.

Unlike the static knowledge pack (schema + cookbook, shipped with the
integration), the bundle is assembled live from the running install, so it
always reflects the user's actual entities, areas, exposed actions and current
config. It carries everything an AI needs to write *real* config — references to
entities that exist, in areas that exist, calling actions that are exposed — and
the recent traces needed to answer "why didn't my scene fire?".

Location/presence PII is scrubbed via :mod:`.redact`, the same rules the
diagnostics dump uses.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .ai_common import action_schemas, ambience_version, areas, floors
from .const import AI_BUNDLE_VERSION, DATA_STORE, DOMAIN
from .entity_catalog import entity_rows
from .lux_ranges import LuxRangeStore
from .periods import PeriodStore
from .redact import redact_exposed_action, redact_store, redacted_traces
from .services_meta import get_service_schema


async def build_ai_bundle(hass: HomeAssistant) -> dict[str, Any]:
    """Assemble the AI bundle from the live install (catalog + exposed actions +
    definitions + redacted config + traces)."""
    store = hass.data[DOMAIN][DATA_STORE]
    exposed = store.get_exposed_actions()
    return {
        # Format version: the skill gates hard-compatibility on this.
        "ambience_ai_bundle": AI_BUNDLE_VERSION,
        # Freshness signals the skill surfaces (is this bundle current?).
        "ambience_version": await ambience_version(hass),
        "generated_at": dt_util.utcnow().isoformat(),
        "catalog": {
            "areas": areas(hass),
            "floors": floors(hass),
            "entities": entity_rows(hass),
        },
        "actions": {
            # Sensitive default values (tokens, message bodies, recipients) are
            # scrubbed; the schema ids fetched below use the unredacted list.
            "exposed": [redact_exposed_action(a) for a in exposed],
            # `fetch=get_service_schema` passes THIS module's (patchable) name
            # through explicitly — tests monkeypatch `ai_bundle.get_service_schema`,
            # which a bare call to `action_schemas(hass, exposed)` would not see
            # (that would resolve the name from ai_common's own globals instead).
            "schemas": await action_schemas(hass, exposed, fetch=get_service_schema),
        },
        "definitions": {
            "categories": store.categories(),
            # The full named-definition vocabulary (builtins + custom + hidden),
            # not just the user's custom overrides, so the AI can reference a
            # period like "evening" or a lux band like "dark" by name.
            "periods": PeriodStore(store).view_for_ui(),
            "lux_ranges": LuxRangeStore(store).view_for_ui(),
        },
        "config": redact_store(store.as_dict()),
        "traces": redacted_traces(hass),
    }
