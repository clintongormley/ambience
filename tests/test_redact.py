"""Value-based redaction in the shared redact module.

Beyond the key-based presence/location scrub, the diagnostics dump and AI
bundle must also blank secrets/PII that ride in *values and rendered strings*:
a `state` rule's rendered detail on a presence entity (R1), a multi-entity
`for:` gate's zone label (R2), security-service action params like alarm codes
(R3), and sensitive exposed-action default values like tokens (R4).
"""

from __future__ import annotations

from homeassistant.components.diagnostics import REDACTED

from custom_components.ambience.redact import (
    redact_action,
    redact_exposed_action,
    redact_plan,
    redact_predicate,
    redact_store,
    redact_trace,
)

# --- R1: predicate detail on a presence-referencing predicate ----------------


def test_redact_predicate_blanks_detail_for_state_rule_on_device_tracker() -> None:
    pred = {
        "condition_key": "state",
        "detail": "Dad's Phone: home ✓ (is home)",
        "entity_ids": ["device_tracker.dads_phone"],
        "passed": True,
    }
    out = redact_predicate(pred)
    assert out["detail"] == REDACTED
    assert out["entity_ids"] == [REDACTED]


def test_redact_predicate_blanks_detail_for_state_rule_on_person() -> None:
    pred = {"condition_key": "state", "detail": "Alice: home", "entity_ids": ["person.alice"]}
    assert redact_predicate(pred)["detail"] == REDACTED


def test_redact_predicate_drops_the_localisation_hints_with_a_blanked_detail() -> None:
    """A blanked detail must take its `detail_key`/`detail_placeholders` with it:
    the placeholders carry the same friendly name the detail does, so a reader
    that rendered the key would reconstitute the phrase just redacted."""
    pred = {
        "condition_key": "occupancy",
        "detail": "Alice's Phone (foo) does not report a number",
        "detail_key": "lux_sensor_not_numeric",
        "detail_placeholders": {"name": "Alice's Phone", "value": "foo"},
    }
    out = redact_predicate(pred)
    assert out["detail"] == REDACTED
    assert "detail_key" not in out
    assert "detail_placeholders" not in out


def test_redact_predicate_drops_the_localisation_hints_even_when_detail_survives() -> None:
    """The redacted view is the external one (MCP/diagnostics/AI bundle), which
    reads the English `detail`; the panel-only hints are not part of that frozen
    payload shape at all."""
    pred = {
        "condition_key": "lux",
        "detail": "lux range gone no longer exists",
        "detail_key": "lux_range_missing",
        "detail_placeholders": {"range": "gone"},
        "entity_ids": ["sensor.lux"],
    }
    out = redact_predicate(pred)
    assert out["detail"] == "lux range gone no longer exists"
    assert "detail_key" not in out
    assert "detail_placeholders" not in out
    # The input is never mutated.
    assert pred["detail_key"] == "lux_range_missing"


def test_redact_predicate_keeps_detail_for_non_presence_state() -> None:
    pred = {"condition_key": "state", "detail": "Hall light: on", "entity_ids": ["light.hall"]}
    out = redact_predicate(pred)
    assert out["detail"] == "Hall light: on"
    assert out["entity_ids"] == ["light.hall"]


def test_redact_predicate_still_blanks_people_detail() -> None:
    # Regression: the original people/template behaviour must be preserved.
    pred = {
        "condition_key": "people",
        "detail": "Alice at zone.work",
        "entity_ids": ["person.alice"],
    }
    out = redact_predicate(pred)
    assert out["detail"] == REDACTED
    assert out["entity_ids"] == [REDACTED]


def test_redact_predicate_blanks_detail_for_unavailable_snapshot_summary() -> None:
    # unavailable's whole-snapshot describe (predicate=None) renders the
    # friendly names of every currently-down entity — which can include a
    # device_tracker (e.g. "Alice's Phone") — even though THIS predicate
    # carries no entity_ids of its own to prefix-match on.
    pred = {"condition_key": "unavailable", "detail": "1 of 3 unavailable (Alice's Phone)"}
    assert redact_predicate(pred)["detail"] == REDACTED


def test_redact_predicate_blanks_detail_for_occupancy_snapshot_summary() -> None:
    # occupancy's whole-snapshot describe (predicate=None) renders which rooms
    # are occupied right now, by sensor friendly name.
    pred = {"condition_key": "occupancy", "detail": "2 of 3 active (Kitchen, Hall)"}
    assert redact_predicate(pred)["detail"] == REDACTED


# --- R2: multi-entity DURATION cause label -----------------------------------


def test_redact_trace_blanks_multi_entity_duration_label() -> None:
    trace = {
        "cause": {
            "kind": "duration",
            "entity_id": None,
            "old": None,
            "new": "anybody in zone.work",
            "detail": "5 minutes",
        }
    }
    out = redact_trace(trace)
    assert out["cause"]["new"] == REDACTED
    assert out["cause"]["detail"] == "5 minutes"  # plain duration is not PII


def test_redact_trace_keeps_non_duration_none_entity_cause() -> None:
    trace = {"cause": {"kind": "has_time", "entity_id": None, "new": None, "detail": "periodic"}}
    assert redact_trace(trace)["cause"]["detail"] == "periodic"


def test_redact_trace_keeps_non_presence_entity_cause() -> None:
    trace = {"cause": {"kind": "entity", "entity_id": "light.hall", "old": "off", "new": "on"}}
    assert redact_trace(trace)["cause"]["new"] == "on"


# --- R3: security-domain action params ---------------------------------------


def test_redact_action_blanks_alarm_code() -> None:
    action = {
        "service": "alarm_control_panel.alarm_disarm",
        "entity_ids": ["alarm_control_panel.home"],
        "params": {"code": "1234"},
    }
    out = redact_action(action)
    assert out["params"] == {"code": REDACTED}
    assert out["entity_ids"] == ["alarm_control_panel.home"]  # target stays


def test_redact_action_blanks_lock_code() -> None:
    assert redact_action({"service": "lock.unlock", "params": {"code": "9999"}})["params"][
        "code"
    ] == (REDACTED)


def test_redact_action_keeps_non_security_params() -> None:
    action = {"service": "light.turn_on", "params": {"brightness_pct": 30}}
    assert redact_action(action)["params"] == {"brightness_pct": 30}


def test_redact_action_without_params_is_unchanged() -> None:
    action = {"service": "lock.unlock", "entity_ids": ["lock.front"]}
    assert redact_action(action) == action


def test_redact_action_supports_new_action_key() -> None:
    # "service" is the old term; the new HA terminology is "action". Redaction
    # must match the security domain under either key so it survives the rename.
    out = redact_action({"action": "lock.lock", "params": {"code": "4321"}})
    assert out["params"]["code"] == REDACTED


def test_redact_action_non_dict_passthrough() -> None:
    assert redact_action("not-a-dict") == "not-a-dict"  # type: ignore[arg-type]


def test_redact_trace_redacts_security_action_params() -> None:
    trace = {
        "cause": {"kind": "manual"},
        "actions": [
            {"service": "alarm_control_panel.alarm_arm_away", "params": {"code": "1"}},
            {"service": "light.turn_on", "params": {"brightness_pct": 5}},
        ],
    }
    out = redact_trace(trace)
    assert out["actions"][0]["params"]["code"] == REDACTED
    assert out["actions"][1]["params"]["brightness_pct"] == 5


# --- R4: sensitive exposed-action default values -----------------------------


def test_redact_exposed_action_blanks_sensitive_defaults() -> None:
    entry = {
        "id": "notify.mobile",
        "label": "Notify",
        "visible_fields": ["message"],
        "defaults": {
            "message": "the kids are home alone",
            "data": {"token": "xyz"},
            "title": "Alert",
        },
    }
    out = redact_exposed_action(entry)
    assert out["defaults"]["message"] == REDACTED
    assert out["defaults"]["data"] == REDACTED
    assert out["defaults"]["title"] == REDACTED
    assert out["id"] == "notify.mobile"
    assert out["visible_fields"] == ["message"]


def test_redact_exposed_action_keeps_harmless_defaults() -> None:
    entry = {"id": "light.turn_on", "defaults": {"brightness_pct": 50, "transition": 2}}
    assert redact_exposed_action(entry)["defaults"] == {"brightness_pct": 50, "transition": 2}


def test_redact_exposed_action_without_defaults_is_unchanged() -> None:
    entry = {"id": "light.turn_on", "visible_fields": ["brightness_pct"]}
    assert redact_exposed_action(entry) == entry


def test_redact_exposed_action_non_dict_passthrough() -> None:
    assert redact_exposed_action("not-a-dict") == "not-a-dict"  # type: ignore[arg-type]


# --- R3 + R4 + key-based, over a full store dump -----------------------------


def _store_dump() -> dict:
    return {
        "areas": {
            "lr": {
                "scenes": [
                    {
                        "category": "general",
                        "when": {"people": {"who": ["person.alice"], "where": "zone.work"}},
                        "actions": [
                            {
                                "service": "alarm_control_panel.alarm_disarm",
                                "params": {"code": "1234"},
                            },
                            {"service": "light.turn_on", "params": {"brightness_pct": 30}},
                        ],
                    }
                ]
            }
        },
        "floors": {
            "f1": {"scenes": [{"actions": [{"service": "lock.unlock", "params": {"code": "9"}}]}]}
        },
        "house": {
            "scenes": [
                {
                    "actions": [
                        {"service": "alarm_control_panel.alarm_arm_home", "params": {"code": "8"}}
                    ]
                }
            ]
        },
        "conditions": {"day": {"workday_sensor": "binary_sensor.workday"}},
        "exposed_actions": [
            {"id": "notify.mobile", "defaults": {"message": "secret", "data": {"token": "t"}}},
            {"id": "light.turn_on", "defaults": {"brightness_pct": 50}},
        ],
    }


def test_redact_store_redacts_scene_security_params_across_all_scopes() -> None:
    out = redact_store(_store_dump())
    assert out["areas"]["lr"]["scenes"][0]["actions"][0]["params"]["code"] == REDACTED
    assert out["areas"]["lr"]["scenes"][0]["actions"][1]["params"]["brightness_pct"] == 30
    assert out["floors"]["f1"]["scenes"][0]["actions"][0]["params"]["code"] == REDACTED
    assert out["house"]["scenes"][0]["actions"][0]["params"]["code"] == REDACTED


def test_redact_store_redacts_exposed_defaults() -> None:
    out = redact_store(_store_dump())
    assert out["exposed_actions"][0]["defaults"]["message"] == REDACTED
    assert out["exposed_actions"][0]["defaults"]["data"] == REDACTED
    assert out["exposed_actions"][1]["defaults"]["brightness_pct"] == 50


def test_redact_store_still_applies_key_based_redaction() -> None:
    out = redact_store(_store_dump())
    assert out["areas"]["lr"]["scenes"][0]["when"]["people"]["who"] == REDACTED
    assert out["conditions"]["day"]["workday_sensor"] == REDACTED


def test_redact_store_does_not_mutate_input() -> None:
    dump = _store_dump()
    redact_store(dump)
    assert dump["house"]["scenes"][0]["actions"][0]["params"]["code"] == "8"
    assert dump["exposed_actions"][0]["defaults"]["message"] == "secret"
    assert dump["areas"]["lr"]["scenes"][0]["when"]["people"]["who"] == ["person.alice"]


def test_redact_store_tolerates_missing_sections() -> None:
    # A sparse/empty dump must not raise.
    assert redact_store({}) == {}
    out = redact_store({"areas": {}, "exposed_actions": []})
    assert out == {"areas": {}, "exposed_actions": []}


def test_redact_store_non_dict_passthrough() -> None:
    # Defensive: a non-dict payload is returned untouched, never crashes an export.
    assert redact_store("not-a-dict") == "not-a-dict"  # type: ignore[arg-type]


# --- presence entity_ids inside scene predicates (state / unavailable) --------


def test_redact_store_scrubs_presence_entity_ids_in_state_predicate() -> None:
    # A `state` rule that tests a person/device_tracker directly reveals that
    # person's location; the bare entity_id must be scrubbed (the key-based
    # `who`/`where` scrub never reaches a `state` atom's `entity_id`).
    dump = {
        "areas": {
            "lr": {
                "scenes": [
                    {
                        "when": {
                            "state": {
                                "kind": "and",
                                "items": [
                                    {"kind": "is", "entity_id": "person.alice", "states": ["home"]},
                                    {
                                        "kind": "not",
                                        "item": {
                                            "kind": "is",
                                            "entity_id": "device_tracker.bobs_phone",
                                            "states": ["home"],
                                        },
                                    },
                                    {"kind": "is", "entity_id": "light.hall", "states": ["on"]},
                                ],
                            }
                        },
                        "actions": [],
                    }
                ]
            }
        }
    }
    out = redact_store(dump)
    items = out["areas"]["lr"]["scenes"][0]["when"]["state"]["items"]
    assert items[0]["entity_id"] == REDACTED  # person, nested directly
    assert items[1]["item"]["entity_id"] == REDACTED  # device_tracker, under `not`
    assert items[2]["entity_id"] == "light.hall"  # benign entity kept
    assert items[0]["states"] == ["home"]  # rest of the rule shape survives


def test_redact_store_scrubs_presence_entity_ids_in_any_predicate() -> None:
    # The scrub walks the whole `when` block, so a presence id riding in a
    # different predicate (e.g. `unavailable.entities`) is caught too.
    dump = {
        "areas": {
            "lr": {
                "scenes": [
                    {
                        "when": {"unavailable": {"entities": ["device_tracker.phone", "sensor.x"]}},
                        "actions": [],
                    }
                ]
            }
        }
    }
    out = redact_store(dump)
    entities = out["areas"]["lr"]["scenes"][0]["when"]["unavailable"]["entities"]
    assert entities == [REDACTED, "sensor.x"]


def test_redact_store_presence_scrub_preserves_non_string_scalars() -> None:
    # The presence scrub recurses through containers but leaves non-string
    # scalars (ints/bools/None) in a predicate untouched.
    dump = {
        "areas": {
            "lr": {
                "scenes": [
                    {
                        "when": {"lux": {"sensors": ["sensor.x"], "min": 5, "max": 100}},
                        "actions": [],
                    }
                ]
            }
        }
    }
    out = redact_store(dump)
    assert out["areas"]["lr"]["scenes"][0]["when"]["lux"] == {
        "sensors": ["sensor.x"],
        "min": 5,
        "max": 100,
    }


def test_redact_store_passes_through_non_dict_scene() -> None:
    # Defensive: a malformed (non-dict) scene in the list is passed through
    # untouched rather than crashing the export.
    out = redact_store({"areas": {"lr": {"scenes": ["not-a-scene"]}}})
    assert out["areas"]["lr"]["scenes"][0] == "not-a-scene"


def test_redact_store_presence_scrub_does_not_mutate_input() -> None:
    dump = {
        "areas": {
            "lr": {
                "scenes": [
                    {
                        "when": {
                            "state": {"kind": "is", "entity_id": "person.alice", "states": ["home"]}
                        },
                        "actions": [],
                    }
                ]
            }
        }
    }
    redact_store(dump)
    assert dump["areas"]["lr"]["scenes"][0]["when"]["state"]["entity_id"] == "person.alice"


def test_redact_store_leaves_malformed_actions_unchanged() -> None:
    # A scene whose `actions` isn't a list (hand-edited export) must be passed
    # through, not coerced — the old `... or []` mangled a dict into its keys.
    dump = {
        "areas": {"lr": {"scenes": [{"actions": {"weird": 1}}, {"name": "no-actions"}]}},
    }
    out = redact_store(dump)
    assert out["areas"]["lr"]["scenes"][0]["actions"] == {"weird": 1}
    assert out["areas"]["lr"]["scenes"][1] == {"name": "no-actions"}


def test_redact_trace_leaves_malformed_actions_unchanged() -> None:
    trace = {"cause": {"kind": "manual"}, "actions": {"weird": 1}}
    assert redact_trace(trace)["actions"] == {"weird": 1}


# --- redact_plan: one resolve/dry-run plan -----------------------------------


def test_redact_plan_blanks_security_params_and_presence_describes():
    plan = {
        "matched_scene_index": 0,
        "scene_name": "Night",
        "actions": [
            {"service": "lock.lock", "entity_ids": ["lock.front"], "params": {"code": "1234"}},
            {
                "service": "light.turn_on",
                "entity_ids": ["light.hall"],
                "params": {"brightness": 10},
            },
        ],
        "snapshots_described": {
            "people": "1 of 2 home (Alice)",
            "template": "rendered location detail",
            "unavailable": "1 of 3 unavailable (Alice's Phone)",
            "occupancy": "2 of 3 active (Kitchen, Hall)",
            "sun": "below horizon",
        },
        "switch_state": "on",
    }
    out = redact_plan(plan)
    assert out["actions"][0]["params"] == {"code": REDACTED}
    assert out["actions"][1]["params"] == {"brightness": 10}
    assert out["snapshots_described"]["people"] == REDACTED
    assert out["snapshots_described"]["template"] == REDACTED
    assert out["snapshots_described"]["unavailable"] == REDACTED
    assert out["snapshots_described"]["occupancy"] == REDACTED
    assert out["snapshots_described"]["sun"] == "below horizon"
    # never mutates the input
    assert plan["actions"][0]["params"]["code"] == "1234"
    assert plan["snapshots_described"]["people"] == "1 of 2 home (Alice)"


def test_redact_plan_blanks_explanation_predicate_detail_when_present():
    # `explanation` is always None on the dry-run path today
    # (`async_resolve_only` passes `explain=False`), but `redact_plan`'s
    # docstring documents the full `async_resolve_only` shape, which DOES
    # carry an `explanation` when a caller passes `explain=True`. Closing this
    # permanently — rather than relying on `explain` never flipping — means a
    # future caller can't leak presence-bearing predicate detail with no test
    # catching it. Reuses `redact_predicate` the same way `redact_trace` does
    # (via the shared `_redact_explanation` helper).
    plan = {
        "matched_scene_index": 0,
        "explanation": {
            "winner_index": 0,
            "scenes": [
                {
                    "index": 0,
                    "predicates": [
                        {
                            "condition_key": "people",
                            "detail": "Alice at zone.work",
                            "entity_ids": ["person.alice"],
                        },
                        {"condition_key": "time_of_day", "detail": "evening"},
                    ],
                }
            ],
        },
    }
    out = redact_plan(plan)
    preds = out["explanation"]["scenes"][0]["predicates"]
    assert preds[0]["detail"] == REDACTED
    assert preds[0]["entity_ids"] == [REDACTED]
    assert preds[1]["detail"] == "evening"
    # never mutates the input
    assert plan["explanation"]["scenes"][0]["predicates"][0]["detail"] == "Alice at zone.work"


def test_redact_plan_passes_unexpected_shapes_through():
    assert redact_plan(None) is None
    assert redact_plan({"actions": "not-a-list", "snapshots_described": 3}) == {
        "actions": "not-a-list",
        "snapshots_described": 3,
    }
