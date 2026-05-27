"""One-shot migration from set_light/script action types to generic services.

Pre-1.0 only. Walk every scope config on integration setup. After enough
users have upgraded (one tagged release), drop this file and the call site
in __init__.py.
"""

from __future__ import annotations

from typing import Any


def migrate_scope(scope_cfg: dict[str, Any]) -> set[str]:
    """Rewrite action entries in-place. Return services now in use."""
    services_used: set[str] = set()
    for rule in scope_cfg.get("rules", []):
        actions = rule.get("actions", [])
        for a in actions:
            if "action" not in a:
                continue
            old = a.pop("action")
            if old == "set_light":
                params = a.get("params", {})
                brightness = params.pop("brightness", 0)
                transition = params.pop("transition", None)
                if brightness == 0:
                    a["service"] = "light.turn_off"
                    new_params: dict[str, Any] = {}
                    if transition is not None:
                        new_params["transition"] = transition
                else:
                    a["service"] = "light.turn_on"
                    new_params = {"brightness_pct": brightness}
                    if transition is not None:
                        new_params["transition"] = transition
                a["params"] = new_params
            elif old == "script":
                script = a.pop("script", "")
                if "." in script:
                    _, object_id = script.split(".", 1)
                    a["service"] = f"script.{object_id}"
                else:
                    a["service"] = ""
            else:
                a["service"] = old  # unknown old action; let validation fail later
            services_used.add(a["service"])
    return services_used
