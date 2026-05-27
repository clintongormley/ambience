"""One-shot migration from set_light/script action types to generic services.

Pre-1.0 only. Walk every scope config on integration setup. After enough
users have upgraded (one tagged release), drop this file and the call site
in __init__.py.
"""

from __future__ import annotations

from typing import Any


def migrate_scope(scope_cfg: dict[str, Any]) -> set[str]:
    """Rewrite legacy action entries in-place.

    Returns the set of services produced by rewriting. Already-migrated
    entries (those with a `service` key and no `action` key) are left
    unchanged and NOT included in the returned set — callers don't need
    to re-expose them because they were exposed on a prior upgrade.
    """
    services_used: set[str] = set()
    for rule in scope_cfg.get("rules", []):
        actions = rule.get("actions", [])
        for action in actions:
            if "action" not in action:
                continue
            old = action.pop("action")
            if old == "set_light":
                params = action.get("params", {})
                brightness = params.pop("brightness", 0)
                transition = params.pop("transition", None)
                # guard against legacy data with None/string brightness
                if not isinstance(brightness, (int, float)) or brightness == 0:
                    action["service"] = "light.turn_off"
                    new_params: dict[str, Any] = {}
                    if transition is not None:
                        new_params["transition"] = transition
                else:
                    action["service"] = "light.turn_on"
                    new_params = {"brightness_pct": brightness}
                    if transition is not None:
                        new_params["transition"] = transition
                action["params"] = new_params
            elif old == "script":
                script = action.pop("script", "")
                if "." in script:
                    # Old ScriptAction enforced script.<object_id>; strip and re-prefix
                    # to canonicalise regardless of what's in storage.
                    _, object_id = script.split(".", 1)
                    action["service"] = f"script.{object_id}"
                else:
                    action["service"] = ""
            else:
                action["service"] = old  # unknown old action; let validation fail later
            # skip empty/malformed; downstream validation will surface the bad rule
            if action["service"]:
                services_used.add(action["service"])
    return services_used
