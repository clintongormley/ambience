# Occupancy Condition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a first-class `occupancy` condition (presence/occupancy/motion binary_sensors, occupied/vacant × any/all × `for`) at priority 915 — below `state` (950) so device/activity rules outrank presence-based ambient lighting, above ambient time/weather.

**Architecture:** A new built-in condition mirroring `PeopleCondition`: a frozen snapshot of binary_sensor states, pure `matches`, a `contains` sort lattice, no `order_key`. Registered in `DATA_CONDITIONS` (auto-exposed to the editor via `conditions/list`). A new Lit predicate-input widget dispatched by `input = "occupancy_predicate"`, plus a `summariseOccupancy` renderer.

**Tech Stack:** Python 3.13 / Home Assistant condition protocol; TypeScript / Lit / ha-form; vitest + pytest.

**Spec:** `docs/superpowers/specs/2026-06-05-occupancy-condition-design.md`

---

## File Structure

- Create `custom_components/ambience/conditions/occupancy.py` — the condition.
- Modify `custom_components/ambience/__init__.py` — register in `DATA_CONDITIONS`.
- Create `tests/test_conditions_occupancy.py` — backend tests.
- Modify `tests/test_sorting.py` — precedence-interaction test (state outranks occupancy).
- Create `frontend/src/views/occupancy-predicate-input.ts` — editor widget.
- Modify `frontend/src/views/condition-input.ts` — dispatch the widget.
- Modify `frontend/src/summary.ts` — `summariseOccupancy` + dispatch.
- Modify `frontend/src/i18n-data.ts` — strings.
- Create `test/occupancy-predicate-input.test.ts` — widget tests.
- Modify `test/summary.test.ts` — summary tests.
- Create `docs/conditions/occupancy.md` + modify `docs/conditions/index.md`.

---

## Task 1: Backend condition — protocol fields & snapshot

**Files:**
- Create: `custom_components/ambience/conditions/occupancy.py`
- Test: `tests/test_conditions_occupancy.py`

- [ ] **Step 1: Write the failing tests**

```python
"""OccupancyCondition — presence/occupancy binary_sensors, with optional `for`."""

from __future__ import annotations

from datetime import UTC, datetime

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.conditions.occupancy import (
    OccupancyCondition,
    OccupancySnapshot,
)


def _snap(sensors=None, now=None, names=None) -> OccupancySnapshot:
    return OccupancySnapshot(
        now=now or datetime(2026, 5, 25, 12, 0, tzinfo=UTC),
        sensors=sensors or {},
        names=names or {},
    )


def _s(state: str, mins_ago: int = 60) -> tuple[str, datetime]:
    return (state, datetime(2026, 5, 25, 12, 0, tzinfo=UTC).replace(minute=0))


def test_protocol_fields() -> None:
    m = OccupancyCondition()
    assert m.name == "occupancy"
    assert m.input == "occupancy_predicate"
    assert m.priority == 915
    assert m.description.strip() != ""
    assert m.predicate_help.strip() != ""


async def test_snapshot_captures_only_binary_sensors(hass: HomeAssistant) -> None:
    hass.states.async_set("binary_sensor.lounge", "on", {"friendly_name": "Lounge"})
    hass.states.async_set("light.x", "on")
    snap = await OccupancyCondition().snapshot(hass)
    assert snap.sensors["binary_sensor.lounge"][0] == "on"
    assert isinstance(snap.sensors["binary_sensor.lounge"][1], datetime)
    assert snap.names["binary_sensor.lounge"] == "Lounge"
    assert "light.x" not in snap.sensors
```

- [ ] **Step 2: Run to verify it fails**

Run: `.venv/bin/pytest tests/test_conditions_occupancy.py -v` (use `/Users/clintongormley/.venv/bin/pytest`)
Expected: FAIL — `ModuleNotFoundError: ...conditions.occupancy`.

- [ ] **Step 3: Write minimal implementation (class scaffold + snapshot)**

```python
"""OccupancyCondition — presence/occupancy/motion binary_sensors are (not) active.

Predicate (scoped quantifier):
  {sensors: [binary_sensor.*]? (empty/absent = all listed = match-anything),
   occupied: bool? (default true; false = vacant),
   quant: 'any'|'all' (default 'any'),
   for?: {h,m,s}}
None = vacuous true (no constraint).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..triggers import EMPTY, TriggerSpec
from ._common import UNAVAILABLE, dur_seconds, validate_for

_QUANTS = ("any", "all")


@dataclass(frozen=True)
class OccupancySnapshot:
    """Frozen view of binary_sensor state at tick time."""

    now: datetime
    # entity_id -> (state, last_changed). last_changed: a presence sensor's
    # `for` clock should reset on state transitions only.
    sensors: dict[str, tuple[str, datetime]]
    names: dict[str, str] = field(default_factory=dict)


class OccupancyCondition:
    name = "occupancy"
    description = "Matches whether presence/occupancy sensors are active."
    predicate_help = (
        "{sensors: [binary_sensor.*] (empty = match-anything), "
        "occupied: bool (default true), quant: 'any'|'all', for?: {h,m,s}}. "
        "None = match-anything."
    )
    input = "occupancy_predicate"
    # Below state (950) and people (925), above day (900): a live presence fact
    # is more specific than ambient time/weather, but an explicit device/state
    # rule should still win.
    priority = 915

    def __init__(self, hass: HomeAssistant | None = None) -> None:
        self._hass = hass

    async def snapshot(
        self, hass: HomeAssistant, *, now: datetime | None = None
    ) -> OccupancySnapshot:
        sensors: dict[str, tuple[str, datetime]] = {}
        names: dict[str, str] = {}
        for s in hass.states.async_all("binary_sensor"):
            sensors[s.entity_id] = (s.state, s.last_changed)
            names[s.entity_id] = s.attributes.get("friendly_name") or s.entity_id
        return OccupancySnapshot(now=now or dt_util.utcnow(), sensors=sensors, names=names)
```

- [ ] **Step 4: Run to verify it passes**

Run: `/Users/clintongormley/.venv/bin/pytest tests/test_conditions_occupancy.py -v`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add custom_components/ambience/conditions/occupancy.py tests/test_conditions_occupancy.py
git commit -m "feat(occupancy): condition scaffold + snapshot"
```

---

## Task 2: `matches` — occupied/vacant × any/all × for

**Files:**
- Modify: `custom_components/ambience/conditions/occupancy.py`
- Test: `tests/test_conditions_occupancy.py`

- [ ] **Step 1: Write the failing tests**

```python
def test_matches_none_is_true() -> None:
    assert OccupancyCondition().matches(None, _snap()) is True


def test_matches_empty_sensors_is_true() -> None:
    assert OccupancyCondition().matches({"sensors": []}, _snap()) is True


def test_occupied_any_one_on() -> None:
    snap = _snap({"binary_sensor.a": _s("off"), "binary_sensor.b": _s("on")})
    pred = {"sensors": ["binary_sensor.a", "binary_sensor.b"], "occupied": True, "quant": "any"}
    assert OccupancyCondition().matches(pred, snap) is True


def test_occupied_all_requires_every_sensor_on() -> None:
    snap = _snap({"binary_sensor.a": _s("on"), "binary_sensor.b": _s("off")})
    pred = {"sensors": ["binary_sensor.a", "binary_sensor.b"], "occupied": True, "quant": "all"}
    assert OccupancyCondition().matches(pred, snap) is False


def test_vacant_all_requires_every_sensor_off() -> None:
    snap = _snap({"binary_sensor.a": _s("off"), "binary_sensor.b": _s("off")})
    pred = {"sensors": ["binary_sensor.a", "binary_sensor.b"], "occupied": False, "quant": "all"}
    assert OccupancyCondition().matches(pred, snap) is True


def test_unavailable_sensor_is_unobservable() -> None:
    snap = _snap({"binary_sensor.a": _s("unavailable")})
    pred = {"sensors": ["binary_sensor.a"], "occupied": True, "quant": "any"}
    assert OccupancyCondition().matches(pred, snap) is False


def test_for_duration_not_yet_held() -> None:
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    changed = datetime(2026, 5, 25, 11, 58, tzinfo=UTC)  # 2 min ago
    snap = _snap({"binary_sensor.a": ("on", changed)}, now=now)
    pred = {"sensors": ["binary_sensor.a"], "occupied": True, "for": {"h": 0, "m": 5, "s": 0}}
    assert OccupancyCondition().matches(pred, snap) is False


def test_for_duration_held_long_enough() -> None:
    now = datetime(2026, 5, 25, 12, 0, tzinfo=UTC)
    changed = datetime(2026, 5, 25, 11, 50, tzinfo=UTC)  # 10 min ago
    snap = _snap({"binary_sensor.a": ("on", changed)}, now=now)
    pred = {"sensors": ["binary_sensor.a"], "occupied": True, "for": {"h": 0, "m": 5, "s": 0}}
    assert OccupancyCondition().matches(pred, snap) is True
```

- [ ] **Step 2: Run to verify it fails**

Run: `/Users/clintongormley/.venv/bin/pytest tests/test_conditions_occupancy.py -v`
Expected: FAIL — `AttributeError: 'OccupancyCondition' object has no attribute 'matches'`.

- [ ] **Step 3: Implement `matches`**

Add to the class:

```python
    def matches(self, predicate, snapshot: OccupancySnapshot) -> bool:
        if predicate is None:
            return True
        if not isinstance(predicate, dict):
            return False
        sensors = predicate.get("sensors") or []
        if not sensors:
            return True  # no constraint
        want_on = predicate.get("occupied", True) is not False
        quant = predicate.get("quant") or "any"
        seconds = dur_seconds(predicate.get("for"))

        def holds(eid: str) -> bool:
            cur = snapshot.sensors.get(eid)
            if cur is None:
                return False
            state, changed = cur
            if state in UNAVAILABLE:
                return False  # unobservable
            is_on = state == "on"
            if is_on is not want_on:
                return False
            return not (seconds > 0 and (snapshot.now - changed).total_seconds() < seconds)

        if quant == "all":
            return all(holds(e) for e in sensors)
        return any(holds(e) for e in sensors)
```

- [ ] **Step 4: Run to verify it passes**

Run: `/Users/clintongormley/.venv/bin/pytest tests/test_conditions_occupancy.py -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(occupancy): matches (occupied/vacant, any/all, for)"
```

---

## Task 3: `describe`, `validate_predicate`, `trigger_deps`

**Files:**
- Modify: `custom_components/ambience/conditions/occupancy.py`
- Test: `tests/test_conditions_occupancy.py`

- [ ] **Step 1: Write the failing tests**

```python
def test_describe_counts_active() -> None:
    snap = _snap(
        {"binary_sensor.a": _s("on"), "binary_sensor.b": _s("off")},
        names={"binary_sensor.a": "Lounge", "binary_sensor.b": "Hall"},
    )
    assert OccupancyCondition().describe(snap) == "1 of 2 active (Lounge)"


def test_validate_accepts_valid_and_none() -> None:
    m = OccupancyCondition()
    m.validate_predicate(None)
    m.validate_predicate(
        {"sensors": ["binary_sensor.a"], "occupied": False, "quant": "all", "for": {"h": 0, "m": 5, "s": 0}}
    )


@pytest.mark.parametrize(
    "bad",
    [
        {"sensors": ["light.x"]},
        {"sensors": "binary_sensor.a"},
        {"quant": "some"},
        {"occupied": "yes"},
        {"for": {"h": -1}},
    ],
)
def test_validate_rejects(bad) -> None:
    with pytest.raises(ValueError):
        OccupancyCondition().validate_predicate(bad)


def test_trigger_deps_watches_sensors_and_durations() -> None:
    pred = {"sensors": ["binary_sensor.a"], "for": {"h": 0, "m": 5, "s": 0}}
    spec = OccupancyCondition().trigger_deps(pred)
    assert spec.entities == frozenset({"binary_sensor.a"})
    assert spec.entity_durations == frozenset({("binary_sensor.a", 300.0)})
```

- [ ] **Step 2: Run to verify it fails**

Run: `/Users/clintongormley/.venv/bin/pytest tests/test_conditions_occupancy.py -k "describe or validate or trigger" -v`
Expected: FAIL — missing methods.

- [ ] **Step 3: Implement the three methods**

```python
    def describe(self, snapshot: OccupancySnapshot) -> str | None:
        if not snapshot.sensors:
            return "no occupancy sensors"
        total = len(snapshot.sensors)
        active = sorted(
            snapshot.names.get(eid, eid)
            for eid, (state, _) in snapshot.sensors.items()
            if state == "on"
        )
        if active:
            return f"{len(active)} of {total} active ({', '.join(active)})"
        return f"0 of {total} active"

    def validate_predicate(self, predicate) -> None:
        if predicate is None:
            return
        if not isinstance(predicate, dict):
            raise ValueError("occupancy predicate must be a dict")
        sensors = predicate.get("sensors")
        if sensors is not None:
            if not isinstance(sensors, list):
                raise ValueError("`sensors` must be a list of binary_sensor.* ids")
            for e in sensors:
                if not isinstance(e, str) or not e.startswith("binary_sensor."):
                    raise ValueError(f"`sensors` entries must be binary_sensor.* ids, got {e!r}")
        occupied = predicate.get("occupied")
        if occupied is not None and not isinstance(occupied, bool):
            raise ValueError(f"`occupied` must be a bool, got {occupied!r}")
        quant = predicate.get("quant")
        if quant is not None and quant not in _QUANTS:
            raise ValueError(f"`quant` must be one of {_QUANTS}, got {quant!r}")
        validate_for(predicate.get("for"))

    def trigger_deps(self, predicate) -> TriggerSpec:
        if not isinstance(predicate, dict):
            return EMPTY
        sensors = [e for e in (predicate.get("sensors") or []) if isinstance(e, str) and e]
        seconds = dur_seconds(predicate.get("for"))
        durations = frozenset((e, seconds) for e in sensors) if seconds > 0 else frozenset()
        return TriggerSpec(entities=frozenset(sensors), entity_durations=durations)
```

- [ ] **Step 4: Run to verify it passes**

Run: `/Users/clintongormley/.venv/bin/pytest tests/test_conditions_occupancy.py -v`
Expected: PASS (all).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(occupancy): describe, validate, trigger_deps"
```

---

## Task 4: `contains` sort lattice

**Files:**
- Modify: `custom_components/ambience/conditions/occupancy.py`
- Test: `tests/test_conditions_occupancy.py`

- [ ] **Step 1: Write the failing tests**

```python
def test_contains_any_subset_is_more_specific() -> None:
    m = OccupancyCondition()
    outer = {"sensors": ["binary_sensor.a", "binary_sensor.b"], "quant": "any"}
    inner = {"sensors": ["binary_sensor.a"], "quant": "any"}
    # inner (only a) ⊆ outer (a,b): any-a implies any-(a,b)
    assert m.contains(outer, inner) is True
    assert m.contains(inner, outer) is False


def test_contains_requires_same_polarity_and_quant() -> None:
    m = OccupancyCondition()
    a = {"sensors": ["binary_sensor.a"], "occupied": True, "quant": "any"}
    b = {"sensors": ["binary_sensor.a"], "occupied": False, "quant": "any"}
    assert m.contains(a, b) is False
    c = {"sensors": ["binary_sensor.a"], "quant": "all"}
    assert m.contains(a, c) is False


def test_contains_longer_for_is_more_specific() -> None:
    m = OccupancyCondition()
    outer = {"sensors": ["binary_sensor.a"], "for": {"h": 0, "m": 1, "s": 0}}
    inner = {"sensors": ["binary_sensor.a"], "for": {"h": 0, "m": 5, "s": 0}}
    assert m.contains(outer, inner) is True
    assert m.contains(inner, outer) is False
```

- [ ] **Step 2: Run to verify it fails**

Run: `/Users/clintongormley/.venv/bin/pytest tests/test_conditions_occupancy.py -k contains -v`
Expected: FAIL — no `contains`.

- [ ] **Step 3: Implement `contains` + helpers**

```python
    # --- sorting (containment lattice) ----------------------------------
    # No order_key: no meaningful total order among occupancy predicates.

    def contains(self, outer, inner) -> bool:
        """True iff every world-state matching `inner` also matches `outer`
        (inner ⊆ outer). Conservative: unprovable -> False."""
        if not isinstance(outer, dict) or not isinstance(inner, dict):
            return False
        if (outer.get("occupied", True) is not False) != (inner.get("occupied", True) is not False):
            return False
        if (outer.get("quant") or "any") != (inner.get("quant") or "any"):
            return False
        if dur_seconds(inner.get("for")) < dur_seconds(outer.get("for")):
            return False
        so = self._sensor_set(outer.get("sensors"))
        si = self._sensor_set(inner.get("sensors"))
        quant = outer.get("quant") or "any"
        if quant == "any":
            return self._subset(si, so)  # any over fewer sensors ⊆ any over more
        return self._subset(so, si)  # all over more sensors ⊆ all over fewer

    @staticmethod
    def _sensor_set(sensors):
        if not sensors:
            return None  # empty = ALL (the universe)
        return frozenset(sensors)

    @staticmethod
    def _subset(a, b) -> bool:
        """a ⊆ b, where None = ALL (the universe)."""
        if b is None:
            return True
        if a is None:
            return False
        return a <= b
```

- [ ] **Step 4: Run to verify it passes**

Run: `/Users/clintongormley/.venv/bin/pytest tests/test_conditions_occupancy.py -v`
Expected: PASS (all).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(occupancy): contains sort lattice"
```

---

## Task 5: Register the condition + precedence sort test

**Files:**
- Modify: `custom_components/ambience/__init__.py` (the `DATA_CONDITIONS` dict, ~line 150)
- Modify: `tests/test_sorting.py`

- [ ] **Step 1: Write the failing test** (add to `tests/test_sorting.py`)

```python
def test_state_rule_outranks_occupancy_rule() -> None:
    """An explicit state rule (priority 950) must sort above an occupancy rule
    (915) when their conditions are disjoint — the precedence fix."""

    class StateLike:
        priority = 950

        def order_key(self, p):
            return p.get("entity_id", "")

    class OccLike:
        priority = 915

    conditions = {"state": StateLike(), "occupancy": OccLike()}
    scenes = [
        _scene("presence", {"occupancy": {"sensors": ["binary_sensor.lounge"]}}),
        _scene("watch-tv", {"state": {"kind": "is", "entity_id": "remote.cine"}}),
    ]
    assert _names(sort_scenes(scenes, conditions)) == ["watch-tv", "presence"]
```

- [ ] **Step 2: Run to verify it fails**

Run: `/Users/clintongormley/.venv/bin/pytest tests/test_sorting.py::test_state_rule_outranks_occupancy_rule -v`
Expected: FAIL — order is `["presence", "watch-tv"]` (occupancy wildcards lose, but state slot must win). If it already passes, keep it as a regression guard.

- [ ] **Step 3: Register the condition**

In `custom_components/ambience/__init__.py`, add the import near the other condition imports and add to the `DATA_CONDITIONS` dict:

```python
        "occupancy": OccupancyCondition(hass=hass),
```

(Import: `from .conditions.occupancy import OccupancyCondition` alongside the sibling imports.)

- [ ] **Step 4: Run the test + full backend suite**

Run: `/Users/clintongormley/.venv/bin/pytest tests/test_sorting.py tests/test_conditions_occupancy.py -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(occupancy): register condition + precedence sort test"
```

---

## Task 6: Frontend predicate-input widget

**Files:**
- Create: `frontend/src/views/occupancy-predicate-input.ts`
- Test: `test/occupancy-predicate-input.test.ts`

Model on `frontend/src/views/people-predicate-input.ts` (Lit element, `@customElement("ambience-occupancy-predicate-input")`, `hass`/`value` props, `emitValueChanged`). Build the schema as below; render Occupied/Vacant + (conditional) quant + for via ha-form (guard `customElements.get("ha-form")` with the native fallback pattern used in `state-expr-atom.ts`).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from "vitest";
import "../frontend/src/views/occupancy-predicate-input";

async function mount(value: any): Promise<any> {
  const el: any = document.createElement("ambience-occupancy-predicate-input");
  el.value = value;
  el.hass = {};
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("ambience-occupancy-predicate-input", () => {
  test("sensor picker is a binary_sensor entity selector filtered by presence device classes", async () => {
    const el = await mount({ sensors: [], occupied: true, quant: "any" });
    const sel = el._sensorSchema()[0].selector.entity;
    expect(sel.domain).toBe("binary_sensor");
    expect(sel.multiple).toBe(true);
    expect(sel.device_class).toEqual(["occupancy", "presence", "motion"]);
    el.remove();
  });

  test("quant control is hidden for a single sensor", async () => {
    const el = await mount({ sensors: ["binary_sensor.a"], occupied: true, quant: "any" });
    expect(el._showQuant()).toBe(false);
    el.remove();
  });

  test("quant control is shown for multiple sensors", async () => {
    const el = await mount({ sensors: ["binary_sensor.a", "binary_sensor.b"], quant: "all" });
    expect(el._showQuant()).toBe(true);
    el.remove();
  });

  test("toggling vacant emits occupied:false", async () => {
    const el = await mount({ sensors: ["binary_sensor.a"], occupied: true });
    let captured: any;
    el.addEventListener("value-changed", (e: Event) => {
      captured = (e as CustomEvent).detail.value;
    });
    el._setOccupied(false);
    expect(captured.occupied).toBe(false);
    el.remove();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run test/occupancy-predicate-input.test.ts`
Expected: FAIL — element/methods undefined.

- [ ] **Step 3: Implement the widget**

Key bits (full element modelled on `people-predicate-input.ts`):

```ts
  _sensorSchema(): HaFormSchema[] {
    return [
      {
        name: "sensors",
        selector: {
          entity: {
            domain: "binary_sensor",
            device_class: ["occupancy", "presence", "motion"],
            multiple: true,
          },
        },
      },
    ];
  }

  _showQuant(): boolean {
    return (this.value?.sensors?.length ?? 0) > 1;
  }

  private _emit(next: OccupancyPredicate) {
    this.value = next;
    emitValueChanged(this, next);
  }

  _setSensors(sensors: string[]) { this._emit({ ...this.value, sensors }); }
  _setOccupied(occupied: boolean) { this._emit({ ...this.value, occupied }); }
  _setQuant(quant: "any" | "all") { this._emit({ ...this.value, quant }); }
  _setFor(dur: { h: number; m: number; s: number } | null) { this._emit({ ...this.value, for: dur }); }
```

`render()`: sensor picker, an Occupied/Vacant ha-form `select` (options `occupied`/`vacant` → `_setOccupied(v === "occupied")`), the quant `select` rendered only when `_showQuant()`, and the duration field (reuse the `{h,m,s}` ha-form duration pattern from `state-expr-atom.ts:_forSchema`/`_forData`). Add the `OccupancyPredicate` type to `frontend/src/types.ts`:

```ts
export type OccupancyPredicate =
  | null
  | { sensors: string[]; occupied?: boolean; quant?: "any" | "all"; for?: { h: number; m: number; s: number } | null };
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run test/occupancy-predicate-input.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(occupancy): predicate-input widget"
```

---

## Task 7: Dispatch widget + summary + i18n

**Files:**
- Modify: `frontend/src/views/condition-input.ts`
- Modify: `frontend/src/summary.ts`
- Modify: `frontend/src/i18n-data.ts`
- Test: `test/summary.test.ts`

- [ ] **Step 1: Write the failing summary tests** (add to `test/summary.test.ts`)

```ts
test("summariseOccupancy: single sensor occupied", () => {
  const hass = { states: { "binary_sensor.lounge": { attributes: { friendly_name: "Lounge" } } } } as any;
  expect(
    summariseCondition("occupancy", { sensors: ["binary_sensor.lounge"], occupied: true }, { hass }),
  ).toBe("Lounge is occupied");
});

test("summariseOccupancy: vacant with for", () => {
  const hass = { states: { "binary_sensor.lounge": { attributes: { friendly_name: "Lounge" } } } } as any;
  expect(
    summariseCondition(
      "occupancy",
      { sensors: ["binary_sensor.lounge"], occupied: false, for: { h: 0, m: 5, s: 0 } },
      { hass },
    ),
  ).toBe("Lounge is vacant for ≥5m");
});

test("summariseOccupancy: multiple sensors with quant", () => {
  const hass = {
    states: {
      "binary_sensor.a": { attributes: { friendly_name: "Lounge" } },
      "binary_sensor.b": { attributes: { friendly_name: "Hall" } },
    },
  } as any;
  expect(
    summariseCondition(
      "occupancy",
      { sensors: ["binary_sensor.a", "binary_sensor.b"], occupied: true, quant: "all" },
      { hass },
    ),
  ).toBe("all of (Lounge, Hall) occupied");
});

test("summariseOccupancy: null is 'any'", () => {
  expect(summariseCondition("occupancy", null, {})).toBe("(any)");
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run test/summary.test.ts -t summariseOccupancy`
Expected: FAIL — dispatch returns `String(predicate)`.

- [ ] **Step 3: Implement summary + dispatch + i18n + widget dispatch**

In `frontend/src/summary.ts`, add `OccupancyPredicate` import, dispatch in `summariseCondition` (`if (conditionName === "occupancy") return summariseOccupancy(...)`), and:

```ts
export function summariseOccupancy(pred: OccupancyPredicate, ctx: ConditionContext = {}): string {
  if (pred == null || !pred.sensors?.length) return localize(ctx.hass, "ui.summary_any", "any");
  const names = pred.sensors.map((id) => entityName(ctx.hass as HassWithStates | undefined, id));
  const verb = pred.occupied === false
    ? localize(ctx.hass, "occupancy_summary.vacant", "vacant")
    : localize(ctx.hass, "occupancy_summary.occupied", "occupied");
  let head: string;
  if (names.length === 1) {
    head = `${names[0]} is ${verb}`;
  } else {
    const q = pred.quant === "all"
      ? localize(ctx.hass, "occupancy_summary.all_of", "all of")
      : localize(ctx.hass, "occupancy_summary.any_of", "any of");
    head = `${q} (${names.join(", ")}) ${verb}`;
  }
  if (pred.for && (pred.for.h || pred.for.m || pred.for.s)) {
    return `${head} ${localize(ctx.hass, "ui.for_prefix", "for")} ≥${_fmtStateDur(pred.for)}`;
  }
  return head;
}
```

(Reuse existing `_fmtStateDur`.) In `condition-input.ts`: `import "./occupancy-predicate-input.js"` and an `if (this.condition.input === "occupancy_predicate")` branch rendering `<ambience-occupancy-predicate-input>` (mirror the `people_predicate` branch's prop wiring). In `i18n-data.ts`: add an `occupancy_summary` group (`occupied`, `vacant`, `any_of`, `all_of`) and any field labels the widget reads via `localize`.

- [ ] **Step 4: Run frontend suite**

Run: `npx vitest run test/summary.test.ts test/occupancy-predicate-input.test.ts && npx tsc --noEmit`
Expected: PASS, tsc clean.

- [ ] **Step 5: Build + commit**

```bash
npm run build
git add -A && git commit -m "feat(occupancy): summary, editor dispatch, i18n"
```

---

## Task 8: Docs + final gates

**Files:**
- Create: `docs/conditions/occupancy.md`
- Modify: `docs/conditions/index.md`

- [ ] **Step 1:** Write `docs/conditions/occupancy.md` (what it does, predicate fields, occupied/vacant × any/all × for, and the precedence note: "an occupancy rule sits below `state` so a deliberate device/activity rule like 'Watch TV' wins"). Add a row/link in `docs/conditions/index.md` matching the existing format.

- [ ] **Step 2: Run all gates**

```bash
/Users/clintongormley/.venv/bin/pytest tests/ -q
npx vitest run
npx tsc --noEmit
npx biome ci frontend/src test
ruff check . && ruff format --check .
```
Expected: all green.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "docs(occupancy): condition reference"
```

---

## Self-review notes

- Spec coverage: predicate (T2), priority/contains (T2/T4), backend methods (T1–T4), registration + precedence (T5), frontend widget + device_class filter (T6), summary + dispatch + i18n (T7), docs + tests (all). Migration = none (documented in spec; nothing to build).
- `OccupancyCondition`/`OccupancySnapshot` names consistent across tasks. Predicate keys (`sensors`, `occupied`, `quant`, `for`) consistent in backend, widget, summary, and tests.
- `priority = 915` consistent (Task 1, Task 5 test).
