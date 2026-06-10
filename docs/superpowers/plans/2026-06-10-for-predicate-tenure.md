# `for:` Predicate Tenure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `for:` durations in the people, occupancy, and state conditions measure how long the *predicate* has held true (tenure), not how long the entity has sat in its current exact state — so "nobody home for 30m" no longer resets when a person hops between two away zones, and "`is [A, B]` for 10m" no longer resets on an A→B flip.

**Architecture:** The trigger engine becomes the single owner of tenure history: a map of `condition_key → {gate_fingerprint → held-since}` where a *gate fingerprint* canonically identifies the instant (un-`for`ed) sub-predicate by content. Conditions grow two pure hooks — duration gates declared in `trigger_deps()` (a `DurationGate` per `for:`-bearing sub-predicate) and `gate_states(predicate, snapshot)` reporting each gate's instant truth + a seed anchor. The engine updates tenure on every recompute (flip-to-true records now; startup/reload seeds from the anchor, i.e. `last_changed`) and **injects a live view of the tenure map into each condition's snapshot** (`snapshot.tenure`). `matches()`/`describe()` consult `snapshot.tenure` when present and fall back to today's exact-state clock when absent — so `resolve()`/`evaluate_explained()`, the simulator, and existing unit tests need no signature changes. Recheck timers arm off `since + seconds` exactly (the dual-clock `_for_recheck_delay` heuristic dies).

**Tech Stack:** Python (HA custom integration), pytest (99% coverage gate), Lit/TypeScript frontend (vitest), esbuild bundles committed.

**Key design decisions (the handoff asked for these to be made explicitly):**

1. **Tenure keyed by content fingerprint, not PredKey.** Identical instant sub-predicates across scenes/scopes share one clock (correct: same content = same truth history), and the resolve path gets tenure "for free" via snapshots without threading per-scene identity through `engine.py`.
2. **Gate granularity:** people/occupancy gate at predicate level (one gate, quantifier collapsed; occupancy's `negate` wraps *outside* the gate); state gates per atom (each `for:`-bearing atom has its own tenure).
3. **Seeding:** at startup/reload (`_sync`), a gate first seen instant-true seeds `since` from the condition-provided anchor (`max(last_changed)` of referenced entities; `last_updated` for attribute-mode atoms) — preserving the radiator-left-on behavior. During normal operation a fresh flip records the current time.
4. **Bypass paths:** `async_snapshot_all` (manual apply / resolve-only / dry-runs) enriches snapshots from the engine's tenure when the engine exists → manual evaluation agrees with the engine. The **simulator** stays un-enriched: its `for:` override backdates entity clocks and the legacy fallback honors that exactly as today.
5. **Recheck timers** stay per-PredKey (handle dict keyed `(gate_key, seconds)` instead of `(entity, seconds)`); the fired evaluation re-arms pending gates, so the recheck callback no longer self-re-arms. `rearm_scope_rechecks` keeps its body (filter + schedule) with an updated docstring; `websocket.py` is untouched.

**Files:**
- Modify: `custom_components/ambience/triggers.py` (add `DurationGate`, replace `entity_durations` with `duration_gates`)
- Modify: `custom_components/ambience/trigger_index.py` (durations hold gate sets)
- Modify: `custom_components/ambience/conditions/_common.py` (`tenure_held`)
- Modify: `custom_components/ambience/conditions/state.py`, `people.py`, `occupancy.py` (gates, `gate_states`, tenure-aware `matches`/`describe`, snapshot `tenure` field)
- Modify: `custom_components/ambience/trigger_engine.py` (tenure store, `_update_tenure`, seed mode, prune, snapshot enrichment)
- Modify: `custom_components/ambience/trigger_subscriptions.py` (tenure-based scheduler, gate-aware recheck cause, delete `_for_recheck_delay`)
- Modify: `custom_components/ambience/service.py` (`attach_tenure`, enrich `async_snapshot_all`)
- Modify: `custom_components/ambience/trace.py` (DURATION describe with no entity)
- Modify: `custom_components/ambience/simulate.py` (comment only)
- Modify: `frontend/src/trace-detail.ts` (+ `test/trace-detail.test.ts`, rebuild bundles)
- Modify: `tests/test_conditions_state.py`, `tests/test_conditions_people.py`, `tests/test_conditions_occupancy.py`, `tests/test_trigger_engine.py`, `tests/test_trigger_subscriptions.py`
- Modify: `docs/conditions/index.md`, `people.md`, `entity-state.md`, `occupancy.md`

---

### Task 1: `DurationGate` value type and `TriggerSpec.duration_gates`

**Files:** Modify `custom_components/ambience/triggers.py`, `custom_components/ambience/trigger_index.py`, and whichever tests construct `TriggerSpec(entity_durations=...)` / `TriggerIndex(durations=...)` (grep `entity_durations` under `tests/`).

- [ ] **Step 1: Write failing tests** for the new value type and merge behavior (in the file that currently tests `triggers.py` — find with `grep -rln "from custom_components.ambience.triggers" tests/`):

```python
def test_duration_gate_merge_unions_gates() -> None:
    g1 = DurationGate(key="k1", seconds=60.0, label="x is on", entity_id="switch.x")
    g2 = DurationGate(key="k2", seconds=30.0, label="nobody home", entity_id=None)
    merged = merge([TriggerSpec(duration_gates=frozenset({g1})), TriggerSpec(duration_gates=frozenset({g2}))])
    assert merged.duration_gates == frozenset({g1, g2})


def test_build_index_collects_duration_gates_per_predicate() -> None:
    g = DurationGate(key="k", seconds=60.0, label="x is on", entity_id="switch.x")
    key = ("area", "a", 0, "state")
    index = build_index([(key, TriggerSpec(entities=frozenset({"switch.x"}), duration_gates=frozenset({g})))])
    assert index.durations == {key: frozenset({g})}
```

- [ ] **Step 2: Run to verify failure** (`pytest tests/<file> -k duration_gate -x`) — fails with ImportError/AttributeError.
- [ ] **Step 3: Implement.** In `triggers.py` add above `TriggerSpec`:

```python
@dataclass(frozen=True)
class DurationGate:
    """One `for:` duration gate inside a predicate.

    - ``key``: canonical fingerprint of the gated *instant* sub-predicate
      (same content anywhere in the config -> same key -> shared tenure).
    - ``seconds``: the `for:` duration.
    - ``label``: human-readable instant description for DURATION trace causes
      when the gate reads more than one entity (e.g. "nobody home").
    - ``entity_id``: the single entity the gate reads, or None when it spans
      several (the trace then falls back to ``label``).
    """

    key: str
    seconds: float
    label: str
    entity_id: str | None = None
```

Replace `entity_durations: frozenset[tuple[str, float]]` with `duration_gates: frozenset[DurationGate] = frozenset()` (field, docstring, and `merge()` union). In `trigger_index.py`, change `durations: dict[PredKey, frozenset[tuple[str, float]]]` → `dict[PredKey, frozenset[DurationGate]]`, `build_index` reads `spec.duration_gates`, and update the dataclass docstring.

- [ ] **Step 4: Mechanically update** every `TriggerSpec(entity_durations=...)` / `TriggerIndex(durations={key: frozenset({(entity, secs)})})` in source + tests to construct `DurationGate`s. The three conditions' `trigger_deps` are rewritten properly in Tasks 3–5; for now make them compile by mapping their existing pairs through `DurationGate(key=f"{e}:{s}", seconds=s, label=e, entity_id=e)` placeholders ONLY if needed to keep the suite green mid-task — otherwise do Tasks 1+3+4+5 commits in sequence before running the full suite.
- [ ] **Step 5: Run** `pytest tests -x -q` (full), fix fallout, **commit** `feat(triggers): introduce DurationGate, replace entity_durations`.

---

### Task 2: `tenure_held` helper

**Files:** Modify `custom_components/ambience/conditions/_common.py`, `tests/test_conditions_common.py`.

- [ ] **Step 1: Failing tests:**

```python
def test_tenure_held_requires_recorded_since() -> None:
    now = dt_util.utcnow()
    assert tenure_held({}, "k", now, 60.0) is False
    assert tenure_held({"k": now - timedelta(seconds=59)}, "k", now, 60.0) is False
    assert tenure_held({"k": now - timedelta(seconds=60)}, "k", now, 60.0) is True
```

- [ ] **Step 2: Run** — fails (no `tenure_held`).
- [ ] **Step 3: Implement** in `_common.py`:

```python
def tenure_held(tenure: Mapping[str, datetime], key: str, now: datetime, seconds: float) -> bool:
    """Whether the gate `key`'s instant predicate has held for >= `seconds`,
    per the engine-recorded tenure map. Absent key = never seen true."""
    since = tenure.get(key)
    return since is not None and (now - since).total_seconds() >= seconds
```

(imports: `from collections.abc import Iterable, Mapping`, `from datetime import datetime`.)

- [ ] **Step 4: Run, pass. Step 5: Commit** `feat(conditions): add tenure_held helper`.

---

### Task 3: State condition — per-atom gates + tenure-aware evaluation

**Files:** Modify `custom_components/ambience/conditions/state.py`, `tests/test_conditions_state.py`.

- [ ] **Step 1: Failing tests** (key behaviors; one test per bullet):

```python
def _snap(states, now=None, tenure=None, attributes=None):
    now = now or dt_util.utcnow()
    return StateSnapshot(now=now, states=states, attributes=attributes or {}, tenure=tenure)

def test_atom_for_does_not_reset_on_in_set_flip_with_tenure() -> None:
    """is [A, B] for 10m: A->B flip mid-window must not reset (headline bug)."""
    cond = StateCondition()
    now = dt_util.utcnow()
    atom = {"kind": "is", "entity_id": "media.x", "states": ["A", "B"], "for": {"m": 10}}
    key = cond._atom_gate_key(atom)
    # Entity flipped A->B 1m ago (last_changed fresh) but the gate has held 10m.
    states = {"media.x": ("B", now - timedelta(minutes=1), now - timedelta(minutes=1))}
    assert cond.matches(atom, _snap(states, now, tenure={key: now - timedelta(minutes=10)})) is True
    # Same snapshot WITHOUT tenure falls back to the exact-state clock -> no match.
    assert cond.matches(atom, _snap(states, now, tenure=None)) is False

def test_atom_tenure_not_yet_held() -> None: ...      # tenure={key: now-5m} with for 10m -> False; absent key -> False
def test_gate_states_reports_instant_and_anchor() -> None:
    """gate_states: instant truth ignores `for`; anchor is last_changed (state mode) / last_updated (attribute mode)."""
def test_gate_states_unobservable_atom_is_instant_false() -> None: ...  # unavailable/absent entity -> (False, snapshot.now)
def test_trigger_deps_emits_duration_gates() -> None:
    """One DurationGate per for-bearing atom: key == _atom_gate_key, entity_id set, seconds right."""
def test_describe_atom_shows_tenure_elapsed() -> None: ...  # tenure mode: elapsed from tenure; absent since -> no elapsed
```

- [ ] **Step 2: Run** — fail.
- [ ] **Step 3: Implement.**
  - `StateSnapshot` gains `tenure: Mapping[str, datetime] | None = None` (comment: engine-injected gate tenure; None = legacy exact-state clock fallback for the simulator and direct callers).
  - Add:

```python
@staticmethod
def _atom_gate_key(atom: dict) -> str:
    """Canonical fingerprint of an atom's instant test (sans `for`). Sorted
    states so `is [A, B]` and `is [B, A]` share one tenure clock."""
    states = "|".join(sorted(str(s) for s in (atom.get("states") or [])))
    return f"{atom.get('kind')}:{atom.get('entity_id')}:{atom.get('attribute') or ''}:{states}"
```

  - Split `_eval_atom`: extract everything up to (not including) the `for` block into `_atom_instant(atom, snap) -> bool | None`; `_eval_atom` becomes:

```python
def _eval_atom(self, atom: dict, snap: StateSnapshot) -> bool | None:
    instant = self._atom_instant(atom, snap)
    if instant is not True:
        return instant
    seconds = dur_seconds(atom.get("for"))
    if seconds <= 0:
        return True
    if snap.tenure is not None:
        # Engine-tracked predicate tenure: the instant test (set membership /
        # comparison) has held this long, surviving in-set state flips.
        return tenure_held(snap.tenure, self._atom_gate_key(atom), snap.now, seconds)
    # Legacy exact-state clock (simulator / direct callers without an engine):
    # state-mode atoms clock off last_changed, attribute-mode off last_updated.
    _state, last_changed, last_updated = snap.states[atom["entity_id"]]
    since = last_updated if atom.get("attribute") else last_changed
    return (snap.now - since).total_seconds() >= seconds
```

  - `gate_states(predicate, snap) -> dict[str, tuple[bool, datetime]]`: walk the tree (same shape as `_collect_deps`); for each atom with `dur_seconds(atom.get("for")) > 0`: `instant = self._atom_instant(atom, snap) is True`; anchor from `snap.states.get(entity_id)` → `last_updated if attribute else last_changed`, falling back to `snap.now` when the entity is absent.
  - `_collect_deps` emits `DurationGate(key=self._atom_gate_key(atom), seconds=seconds, label=f"{entity_id} {self._describe_comparison(atom)}", entity_id=entity_id)`; `trigger_deps` returns `duration_gates=frozenset(gates)`.
  - `_describe_atom`: in tenure mode (`seconds > 0 and snap.tenure is not None`) elapsed comes from `snap.tenure.get(self._atom_gate_key(atom))` (`f" {fmt_duration((snap.now - since).total_seconds())}"` when present, else `""`); legacy branch unchanged.
  - Update the exact-state NOTE comments to describe the new split.
- [ ] **Step 4: Run** `pytest tests/test_conditions_state.py -q` — pass. **Step 5: Commit** `feat(state): per-atom duration gates with engine tenure`.

---

### Task 4: People condition — predicate-level gate

**Files:** Modify `custom_components/ambience/conditions/people.py`, `tests/test_conditions_people.py`.

- [ ] **Step 1: Failing tests:**

```python
def test_nobody_home_for_does_not_reset_on_zone_hop_with_tenure() -> None:
    """Headline bug: zone A -> zone B keeps 'nobody home' tenure."""
    cond = PeopleCondition()
    now = dt_util.utcnow()
    pred = {"quant": "nobody", "where": "home", "for": {"m": 30}}
    key = cond._gate_key(pred)
    # Bob hopped zones 1m ago (fresh last_changed) but 'nobody home' held 30m.
    snap = PeopleSnapshot(
        now=now,
        persons={"person.bob": ("ZoneB", now - timedelta(minutes=1))},
        zone_labels={"zone.home": "home"},
        in_zones={"person.bob": ["zone.b"]},
        tenure={key: now - timedelta(minutes=30)},
    )
    assert cond.matches(pred, snap) is True
    assert cond.matches(pred, replace(snap, tenure=None)) is False  # legacy resets

def test_people_tenure_gate_requires_instant_truth() -> None: ...  # someone home + stale tenure entry -> False
def test_people_gate_states_instant_and_anchor() -> None: ...      # anchor == max(person last_changed); empty persons -> snapshot.now
def test_people_trigger_deps_emits_single_gate() -> None: ...      # key==_gate_key; entity_id set only for single explicit who
def test_people_describe_tenure_mode() -> None: ...                # per-person elapsed dropped; prefix gains "(held 25m)" / "(not held)"
```

- [ ] **Step 2: Run** — fail.
- [ ] **Step 3: Implement.**
  - `PeopleSnapshot` gains `tenure: Mapping[str, datetime] | None = None`.
  - Extract the quantifier into `_quantified(who, quant, where, negate, seconds, snapshot) -> bool` (current `matches` body's `holds` closure + quant dispatch, parameterized on `seconds`).
  - `matches`:

```python
if seconds > 0 and snapshot.tenure is not None:
    if not self._quantified(who, quant, where, negate, 0.0, snapshot):
        return False
    return tenure_held(snapshot.tenure, self._gate_key(predicate), snapshot.now, seconds)
return self._quantified(who, quant, where, negate, seconds, snapshot)
```

  - `_gate_key(predicate)`: `f"{quant}:{where}:{int(negate)}:{'|'.join(sorted(who)) if who else '*'}"` (defaults applied first).
  - `gate_states(predicate, snapshot)`: `{}` unless dict predicate with `seconds > 0`; else `{key: (instant, anchor)}` where `instant = self._quantified(..., 0.0, snapshot)` and `anchor = max(last_changed of person_ids present in snapshot.persons)` falling back to `snapshot.now`.
  - `trigger_deps`: when `seconds > 0`, `duration_gates=frozenset({DurationGate(key=self._gate_key(predicate), seconds=seconds, label=self._gate_label(predicate), entity_id=(who[0] if len(who) == 1 else None))})`. `_gate_label`: `f"{self._quant_word(quant)} {'not ' if negate else ''}{'home' if where == _HOME else 'in ' + where}"`.
  - `describe`: tenure mode → per-person `held` mark uses `seconds=0`, no per-person elapsed suffix; after `for ≥X` append `f" (held {fmt_duration(...)})"` when `tenure.get(key)` present else `" (not held)"`.
  - Rewrite the `_holds_at` NOTE: it now documents the legacy/fallback clock only.
- [ ] **Step 4: Run, pass. Step 5: Commit** `feat(people): predicate-tenure for nobody/anyone/everyone durations`.

---

### Task 5: Occupancy condition — predicate-level gate inside `negate`

**Files:** Modify `custom_components/ambience/conditions/occupancy.py`, `tests/test_conditions_occupancy.py`.

- [ ] **Step 1: Failing tests:**

```python
def test_occupancy_for_survives_sensor_handover_with_tenure() -> None:
    """any-of [s1, s2] occupied for 20m: handover between sensors keeps tenure."""
def test_occupancy_negate_wraps_the_gated_match() -> None:
    """negate inverts the *gated* inner verdict: NOT(vacant for 20m) is False
    once tenure matures, True before."""
def test_occupancy_gate_key_excludes_negate() -> None: ...
def test_occupancy_gate_states_pre_negate_instant() -> None: ...
def test_occupancy_trigger_deps_emits_gate() -> None: ...   # entity_id set for single sensor; label "any of 2 sensors vacant" for multi
def test_occupancy_describe_tenure_mode() -> None: ...
def test_occupancy_unobservable_stays_unobservable_under_tenure() -> None:
    """A None inner verdict must stay None through the gate so negate can't invert it."""
```

- [ ] **Step 2: Run** — fail.
- [ ] **Step 3: Implement.**
  - `OccupancySnapshot` gains `tenure: Mapping[str, datetime] | None = None`.
  - `_gate_key(predicate)`: `f"{'on' if want_on else 'off'}:{quant}:{'|'.join(sorted(sensors))}"` — **negate excluded** (it wraps outside the gate).
  - `matches`: compute `tenure_mode = seconds > 0 and snapshot.tenure is not None`; per-sensor verdicts use `seconds=0` in tenure mode; then:

```python
result = kleene_all(verdicts) if quant == "all" else kleene_any(verdicts)
if tenure_mode and result is True:
    result = tenure_held(snapshot.tenure, self._gate_key(predicate), snapshot.now, seconds)
if predicate.get("negate"):
    result = kleene_not(result)
return result is True
```

  - `gate_states`: `{}` unless constraining sensors and `seconds > 0`; `instant = (pre-negate kleene result with seconds=0) is True`; anchor = `max(changed over predicate sensors present in snapshot.sensors)` else `snapshot.now`.
  - `trigger_deps`: one `DurationGate` (`entity_id=sensors[0] if len(sensors)==1 else None`, label `f"{sensors[0]} {'occupied' if want_on else 'vacant'}"` single / `f"{quant} of {len(sensors)} sensors {'occupied' if want_on else 'vacant'}"` multi).
  - `describe`: tenure mode → per-sensor elapsed dropped, marks use `seconds=0`, trailing `(for ≥X, held Y)` / `(for ≥X, not held)`.
- [ ] **Step 4: Run, pass. Step 5: Commit** `feat(occupancy): predicate-tenure with negate outside the gate`.

---

### Task 6: Engine — tenure store, seeding, pruning, snapshot enrichment

**Files:** Modify `custom_components/ambience/trigger_engine.py`, `custom_components/ambience/service.py`, `tests/test_trigger_engine.py` (+ a service test file for `attach_tenure`).

- [ ] **Step 1: Failing tests** (engine-level, using a small gate-aware fake condition; pattern mirrors `_ForCondition`):

```python
class _GateCondition:
    """Fake with one predicate-level gate; snapshot is (state, last_changed, now)."""
    def __init__(self, entity_id, seconds): ...
    def trigger_deps(self, predicate):
        return TriggerSpec(entities=frozenset({self._entity_id}),
                           duration_gates=frozenset({DurationGate(key=f"g:{self._entity_id}", seconds=self._seconds,
                                                                  label=f"{self._entity_id} is on", entity_id=self._entity_id)}))
    async def snapshot(self, hass, entities=None): ...   # returns SimpleNamespace(state=..., changed=..., now=dt_util.utcnow(), tenure=None)
    def gate_states(self, predicate, snap):
        return {f"g:{self._entity_id}": (snap.state == predicate, snap.changed)}
    def matches(self, predicate, snap):
        if snap.state != predicate: return False
        if snap.tenure is None: return (snap.now - snap.changed).total_seconds() >= self._seconds
        return tenure_held(snap.tenure, f"g:{self._entity_id}", snap.now, self._seconds)

def test_recompute_records_tenure_on_flip_and_clears_on_drop() -> None: ...
def test_recompute_seed_mode_uses_anchor() -> None:
    """seed=True + instant true + absent entry -> since == anchor (last_changed), not now."""
def test_recompute_keeps_existing_since_across_reseeds() -> None: ...
def test_rebuild_prunes_dead_gate_keys_in_place() -> None:
    """Removing the scene drops its fingerprint, and the dict OBJECT identity is preserved."""
def test_refresh_snapshots_attaches_live_tenure_view() -> None:
    """self._snapshots[cond].tenure is engine._tenure[cond] (same object)."""
def test_attach_tenure_skips_none_and_gateless() -> None: ...      # service.attach_tenure unit test
def test_async_snapshot_all_enriches_when_engine_present() -> None: ...
def test_zone_hop_does_not_reset_tenure_end_to_end() -> None:
    """Engine-level headline test with the real PeopleCondition: person zone.a -> zone.b
    while a 'nobody home for 30m' window is open; assert the tenure entry's since is
    unchanged after the second evaluation and the predicate flips true at the original
    30m mark (recheck timer delay unchanged)."""
```

- [ ] **Step 2: Run** — fail.
- [ ] **Step 3: Implement.**
  - `service.py` — add (and import `replace` from `dataclasses`):

```python
def attach_tenure(
    conditions_registry: dict[str, Any],
    tenure_by_condition: dict[str, dict[str, Any]],
    snapshots: dict[str, Any],
) -> dict[str, Any]:
    """Inject a LIVE view of the engine's per-condition gate tenure into each
    gate-capable condition's snapshot (the dict object is shared, so engine
    updates are visible without re-enrichment). Conditions without `gate_states`,
    and failed (None) snapshots, pass through untouched."""
    out = dict(snapshots)
    for name, snap in snapshots.items():
        condition = conditions_registry.get(name)
        if snap is None or condition is None or not hasattr(condition, "gate_states"):
            continue
        out[name] = replace(snap, tenure=tenure_by_condition.setdefault(name, {}))
    return out
```

  - `async_snapshot_all`: after building snapshots, `engine = hass.data[DOMAIN].get(DATA_ENGINE)`; if not None, `snapshots = attach_tenure(conditions_registry, engine.tenure, snapshots)` (import `DATA_ENGINE` from const). Comment: manual apply / resolve-only then agree with the engine's tenure semantics; without an engine (unit tests) the legacy clock fallback applies.
  - `trigger_engine.py`:
    - `__init__`: `self._tenure: dict[str, dict[str, datetime]] = {}` (comment: condition_key → gate fingerprint → held-since; inner dicts are shared by reference with enriched snapshots — mutate, never replace). Import `datetime`, `dt_util`, `DurationGate` as needed, `attach_tenure` from `.service`.
    - `@property def tenure(self)` returning `self._tenure`.
    - `_refresh_snapshots`: wrap the update — `self._snapshots.update(attach_tenure(self._conditions(), self._tenure, await snapshot_conditions(...)))`.
    - `async_rebuild`: after the `_predicate_state` prune, prune tenure **in place**:

```python
live_gates: dict[str, set[str]] = {}
for key, gates in self._index.durations.items():
    live_gates.setdefault(key[3], set()).update(g.key for g in gates)
for cond_key, entries in self._tenure.items():
    keep = live_gates.get(cond_key, set())
    for gate_key in [k for k in entries if k not in keep]:
        del entries[gate_key]
```

    - `_recompute(self, fired, snapshots, *, seed: bool = False)`: inside the loop, after resolving `condition`/`snap`, when `key in self._index.durations`: append to `gated` list and, if `snap is not None`, call `self._update_tenure(key, condition, predicate, snap, seed=seed)`. After the loop: `self._schedule_for_rechecks(gated)`.
    - `_update_tenure`:

```python
def _update_tenure(self, key: PredKey, condition: Any, predicate: Any, snap: Any, *, seed: bool) -> None:
    """Record instant-truth flips for the predicate's duration gates. A gate
    seen true for the first time gets since=now (live flip) or its
    condition-provided anchor (seed mode: startup/reload, where the anchor is
    a provable lower bound like last_changed); a gate seen false is dropped.
    A snapshot failure skips the update (stale tenure self-heals on the next
    successful evaluation rather than wiping real tenure)."""
    gate_states = getattr(condition, "gate_states", None)
    if gate_states is None:
        return
    tenure = self._tenure.setdefault(key[3], {})
    try:
        readings = gate_states(predicate, snap)
    except Exception as exc:  # noqa: BLE001 — mirror the matches-failure policy
        _LOGGER.warning("ambience: condition %r gate_states failed: %s", key[3], exc)
        return
    for gate_key, (instant, anchor) in readings.items():
        if not instant:
            tenure.pop(gate_key, None)
        elif gate_key not in tenure:
            tenure[gate_key] = anchor if seed else dt_util.utcnow()
```

    - `_sync`: call `self._recompute(set(self._index.all_predicates()), self._snapshots, seed=True)` and **delete** the explicit `self._schedule_for_rechecks(self._index.durations.keys())` line (recompute arms them now); update the surrounding comment.
- [ ] **Step 4: Run** `pytest tests/test_trigger_engine.py tests/test_apply_scene_force.py -q` (manual-path tests cover `async_snapshot_all`), fix, **Step 5: Commit** `feat(engine): own gate tenure, seed from anchors, inject into snapshots`.

---

### Task 7: Subscriptions — tenure-based recheck timers

**Files:** Modify `custom_components/ambience/trigger_subscriptions.py`, `tests/test_trigger_subscriptions.py`.

- [ ] **Step 1: Failing/updated tests:**
  - Update `_ForCondition` fake to the gate protocol (snapshot returns `(state, last_changed)`; `gate_states` returns `{key: (state == predicate, last_changed)}`; `matches` consults `snap` tuple + tenure fallback as in Task 6's fake). Keep `test_startup_sync_arms_for_recheck_for_remaining_time` (5640s), `test_reload_sync_arms_for_recheck` (6600s), `test_startup_sync_skips_recheck_when_duration_already_elapsed` assertions identical — only handle keys change to `(gate.key, seconds)`.
  - **Delete** `test_for_recheck_delay_clocks_off_last_changed`, `test_for_recheck_delay_falls_back_to_last_updated_window`, `test_for_recheck_delay_unknown_entity_falls_back_to_full`, `test_for_recheck_fire_rearms_for_later_pending_window` (the dual-clock heuristic and self-re-arm die). **Replace** with:

```python
def test_schedule_for_rechecks_arms_remaining_tenure() -> None: ...   # since 60s ago, for 100s -> delay 40s
def test_schedule_for_rechecks_skips_matured_and_untracked_gates() -> None: ...
async def test_attribute_churn_does_not_move_the_recheck() -> None:
    """GPS-style attribute-only update fires an evaluation; the gate's instant
    stays true so since is untouched and the re-armed delay still targets the
    ORIGINAL since+seconds (replaces test_for_recheck_delay_clocks_off_last_changed)."""
async def test_recheck_fire_does_not_self_rearm() -> None:
    """The callback pops its handle and fires; re-arming happens in the
    evaluation it triggers (assert _schedule_for_rechecks NOT called by the callback)."""
def test_recheck_cause_names_entity_or_label() -> None:
    """entity gate -> TriggerCause(DURATION, entity_id=..., new=<held state>);
    multi-entity gate -> entity_id None, new=label."""
```

  - Rework `test_switch_resync_rearms_for_rechecks`: run `await engine.async_initial_sync()` first (seeds tenure + arms), simulate the consumed timer by cancelling/clearing `engine._for_handles`, then `_force_resync_scope` and assert the handle re-appears with the remaining delay.
- [ ] **Step 2: Run** — fail.
- [ ] **Step 3: Implement.**
  - `_schedule_for_rechecks`:

```python
def _schedule_for_rechecks(self, preds: Iterable[PredKey]) -> None:
    """(Re)arm one timer per pending duration gate: a gate whose instant
    predicate is currently true (tenure recorded) but hasn't matured flips the
    predicate at since+seconds with no further event, so wake it exactly then.
    Matured gates need no timer (the current evaluation already saw them) and
    untracked gates (instant false) re-arm event-driven via the flip that
    records their tenure. Cancels and replaces any prior handles per predicate,
    so calling this is idempotent."""
    now = dt_util.utcnow()
    for key in preds:
        gates = self._index.durations.get(key)
        if not gates:
            continue
        for cancel in self._for_handles.pop(key, {}).values():
            cancel()
        tenure = self._tenure.get(key[3], {})
        handles: dict[tuple[str, float], Callable[[], None]] = {}
        for gate in gates:
            since = tenure.get(gate.key)
            if since is None:
                continue
            delay = gate.seconds - (now - since).total_seconds()
            if delay <= 0:
                continue
            handles[(gate.key, gate.seconds)] = async_call_later(
                self._hass, delay, self._make_for_recheck(key, gate)
            )
        if handles:
            self._for_handles[key] = handles
```

  - `_make_for_recheck(self, key: PredKey, gate: DurationGate)`: as today minus the trailing self-re-arm; cause:

```python
if gate.entity_id is not None:
    state = self._hass.states.get(gate.entity_id)
    held = state.state if state is not None else STATE_UNKNOWN
    cause = TriggerCause(kind=CauseKind.DURATION, entity_id=gate.entity_id, new=held, detail=fmt_duration(gate.seconds))
else:
    cause = TriggerCause(kind=CauseKind.DURATION, new=gate.label, detail=fmt_duration(gate.seconds))
self._fire({key}, cause)
```

  - Delete `_for_recheck_delay`. Remove the `self._schedule_for_rechecks(preds)` call from `_on_state_event` (the fired evaluation re-arms after refreshing snapshots). Update `rearm_scope_rechecks`'s docstring (body unchanged): it now re-arms *pending* gates from tenure — a safety net for handles lost while pending; matured gates need no timer because tenure already records maturity and the force-apply re-resolves.
  - Update the engine `__init__` comment for `_for_handles` (keys are now `(gate_key, seconds)`).
- [ ] **Step 4: Run** `pytest tests/test_trigger_subscriptions.py tests/test_trigger_engine.py -q`, then the full backend suite. **Step 5: Commit** `feat(rechecks): arm duration timers off gate tenure`.

---

### Task 8: Trace cause + frontend rendering

**Files:** Modify `custom_components/ambience/trace.py`, `frontend/src/trace-detail.ts`, `test/trace-detail.test.ts`, `tests/` (trace describe test file — grep `CauseKind.DURATION` under tests/).

- [ ] **Step 1: Failing tests:**
  - Python: `TriggerCause(kind=CauseKind.DURATION, new="nobody home", detail="30m").describe() == "nobody home for 30m"` (and the entity form unchanged).
  - Vitest (in `test/trace-detail.test.ts`): `formatCause({kind: "duration", entity_id: null, new: "nobody home", detail: "30m", old: null})` → `"nobody home for 30m"`; `formatCauseFriendly` same input → `"nobody home for 30m"` (no entity lookup).
- [ ] **Step 2: Run** `pytest <trace test file> -q` and `npx vitest run test/trace-detail.test.ts` — fail.
- [ ] **Step 3: Implement.**
  - `trace.py` `describe()`: `if self.kind == CauseKind.DURATION: return f"{self.new} for {self.detail}" if self.entity_id is None else f"{self.entity_id} {self.new} for {self.detail}"`. Update the `CauseKind.DURATION` comment (entity OR a multi-entity gate label).
  - `trace-detail.ts` line ~106: `if (c.kind === "duration") return c.entity_id ? \`${c.entity_id} ${c.new} for ${c.detail}\` : \`${c.new} for ${c.detail}\`;` and in `formatCauseFriendly` (~129): `if (c.kind === "duration") return c.entity_id ? \`${name}: ${fmt(c.new)} for ${c.detail ?? "?"}\` : \`${c.new ?? "?"} for ${c.detail ?? "?"}\`;` — check `causeHasRawValues`: a duration cause without entity_id has no raw entity values, so make it `c.kind === "entity" || (c.kind === "duration" && !!c.entity_id)`.
- [ ] **Step 4: Run** both suites, pass. Run `npm run build` and stage the rebuilt bundles under `custom_components/ambience/frontend/` (run `npm install` first if `node_modules` is missing in this worktree). **Step 5: Commit** `feat(traces): label-based DURATION causes for multi-entity gates`.

---

### Task 9: Docs + comment sweep

**Files:** Modify `docs/conditions/index.md` ("The for duration"), `docs/conditions/people.md`, `docs/conditions/entity-state.md`, `docs/conditions/occupancy.md`, `custom_components/ambience/simulate.py` (comments).

- [ ] **Step 1:** `docs/conditions/index.md` — rewrite the section: the duration measures how long the **condition's test** has been continuously true; moving between two away zones does not reset a "nobody home" clock, and an entity flipping between two listed states does not reset an `is [A, B]` clock; the clock resets the moment the test stops being true; after a Home Assistant restart the clock resumes from the last provable state change (it never over-counts a window HA didn't observe... it resumes conservatively). People example updated accordingly.
- [ ] **Step 2:** `people.md` / `entity-state.md` / `occupancy.md` — align their `for` wording ("held the tested value continuously" stays true; add the no-reset-within-the-test clarification where each doc explains the duration). Add the simulator caveat to whichever doc describes the simulator's `for` override: the simulator approximates tenure by backdating each entity's state clock, so multi-entity handover scenarios can't be expressed there.
- [ ] **Step 3:** `simulate.py` — update the `_build_override_states` comment: backdated clocks drive the **legacy fallback** path (simulated snapshots carry no engine tenure), which is exactly how the `for:` override is honoured.
- [ ] **Step 4:** Run `mkdocs build -q` if available (or skip — docs CI gates it) and the docs-drift checks via the pre-push hook later. **Step 5: Commit** `docs(conditions): describe predicate-tenure for semantics`.

---

### Task 10: Full verification

- [ ] `pytest tests -q` — all pass, coverage ≥ 99% (add tests for any uncovered new branches).
- [ ] `ruff check . && ruff format .`
- [ ] `npm run ci` (Biome) and `npx vitest run` (full frontend suite) and `npx tsc --noEmit` if part of `npm run ci`.
- [ ] `npm run build` — confirm committed bundles are fresh.
- [ ] `/simplify`-style self-review of the diff; final commit if cleanups found.

## Self-review notes

- Spec coverage: handoff steps 1–5 map to Tasks 6 (flip tracking + seeding), 3–5 (instant/duration split via gates), 7 (recheck timers off `since`), 6 (restart semantics = seed from anchor), 6+9 (bypass paths: manual enriched, simulator documented fallback). Handoff's required tests all appear: zone-hop (Task 6), A→B in-set flip (Task 3), attribute churn (Task 7), startup seeding (Task 7, kept radiator tests), trace output (Task 8 + describe tests in 3–5).
- Type consistency: `DurationGate(key, seconds, label, entity_id)` used identically in Tasks 1, 3–7; `gate_states -> dict[str, tuple[bool, datetime]]` in 3–6; `tenure: Mapping[str, datetime] | None` on all three snapshots.
