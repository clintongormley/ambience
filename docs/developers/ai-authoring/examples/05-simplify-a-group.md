# Example 5 — Simplify a group (and fix a no-op)

A worked **simplification pass**: a group that grew into a stack of actionless
blockers around a catch-all collapses into one acting scene plus the catch-all.
See [conditions-cookbook.md](../conditions-cookbook.md) → *Simplify a finished
group* for the principle.

## The situation

A terrace **Lights** group should: glow the lights at 25 % in the evening **while the
house is empty** (away lighting); turn them **off** otherwise when empty; and —
crucially — **leave them alone when someone is home**, so it never fights a manual
adjustment. Over time it had grown to four scenes, three of which do nothing but
*block*.

## The starting group (the smell)

```yaml
# Three actionless blockers guard the catch-all; the third "Lights on" scene is a
# no-op — despite its name it never turns anything on.
- name: Block if anybody home
  when: { people: { quant: any, where: home } }
  actions: []
- name: Block if presence detected
  when: { occupancy: { sensors: [binary_sensor.all_presence_sensors] } }
  actions: []
- name: Lights on at night        # <- named like it acts, but actions: []
  when:
    time_of_day:
      from: { kind: sun, anchor: dusk,   offset_min: -10 }
      to:   { kind: sun, anchor: sunset, offset_min: 240, clamp: { dir: not_after, hh: 0, mm: 36 } }
  actions: []
- name: Lights off
  when: {}
  actions:
    - { service: fado.fade_lights, entity_ids: [light.terrace_floor_lights, light.terrace_perimeter_lights, light.terrace_entrance_spots, light.terrace_step_lights], params: { brightness_pct: 0 } }
```

The two blockers exist only so the `Lights off` catch-all doesn't fire while someone
is home or present; the third "blocks" the evening window so the lights are *left as
they are* at night — but nothing in the group ever switches them **on**.

## The simplified import block

Fold the guards that lead to an **action** into one acting scene (and correct the
no-op so it actually turns the lights on) — but **keep** the "anybody home" guard as a
pure **blocker**: when someone's home the right behaviour is to *do nothing* and leave
manual control, and "do nothing" can't be folded into an acting scene. Four scenes →
three. Because this *removes* scenes, use `mode: replace` (not `merge`, which only
upserts and would leave the old blockers behind).

```yaml
ambience_import: 1
scope: { kind: area, id: terrace }
mode: replace                       # removing scenes -> replace, not merge
scenes:
  - name: Lights on at night when nobody home
    category: general
    when:
      time_of_day:
        from: { kind: sun, anchor: dusk,   offset_min: -10 }
        to:   { kind: sun, anchor: sunset, offset_min: 240, clamp: { dir: not_after, hh: 0, mm: 36 } }
      occupancy: { sensors: [binary_sensor.all_presence_sensors], occupied: false }
      people:    { quant: nobody, where: home }
    actions:
      - { service: fado.fade_lights, entity_ids: [light.terrace_floor_lights, light.terrace_perimeter_lights, light.terrace_entrance_spots], params: { brightness_pct: 25 } }
  - name: Leave the lights alone when anybody's home
    category: general
    when: { people: { quant: any, where: home } }
    actions: []                     # blocker: do nothing -> manual control is preserved
  - name: Lights off
    category: general
    when: {}
    actions:
      - { service: fado.fade_lights, entity_ids: [light.terrace_floor_lights, light.terrace_perimeter_lights, light.terrace_entrance_spots, light.terrace_step_lights], params: { brightness_pct: 0 } }
```

## Why it's equivalent — and better

- **Fold guards that gate an action; keep a blocker for a guard that gates
  inaction.** `Block if presence detected` and the evening window lead to an
  *action* (away + evening → 25 %), so they fold into the acting scene's `when` as
  their complements. `Block if anybody home` does **not**: when someone's home you
  want to leave the lights alone, and there's no positive action for "leave alone" —
  so it stays a pure actionless **blocker**.
- **Don't over-fold.** Collapsing all the way to *two* scenes (dropping the home
  blocker too) looks tidier but is wrong: with only the acting scene + catch-all,
  `Lights off` wins whenever you're home, turning the terrace off and fighting any
  manual change. That blocker was the one guard doing real work.
- **The no-op is corrected.** "Lights on at night" finally turns the lights on
  (25 %) instead of silently doing nothing — its name now matches its behaviour.
- **Ordering needs no pinning.** Both the acting scene and the blocker carry
  conditions, so both are more *specific* than the empty-`when` `Lights off` and sort
  above it automatically; `Lights off` is reached only when you're away and outside
  the evening window.
- **Manual control while home is preserved** by the blocker. It leans on a general
  rule worth knowing: an entity a scene only *acts on* — never named in a `when` —
  doesn't subscribe the unit, so a manual change to it isn't even seen (see the
  cookbook's *`state`* subscription note). The away-managed lights still re-assert on
  the next re-evaluation or reapply — the intended automatic behaviour.
