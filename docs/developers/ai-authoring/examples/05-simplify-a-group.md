# Example 5 — Simplify a group (and fix a no-op)

A worked **simplification pass**: a group that grew into a stack of actionless
blockers around a catch-all collapses into one acting scene plus the catch-all.
See [conditions-cookbook.md](../conditions-cookbook.md) → *Simplify a finished
group* for the principle.

## The situation

A terrace **Lights** group should keep the terrace lights **off**, except glow them
at 25 % in the evening **while the house is empty** (away lighting). Over time it
had grown to four scenes — three of which do nothing but *block*.

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
    - { service: fado.fade_lights, entity_ids: [light.terrace_floor_lights, light.terrace_perimeter_lights, light.terrace_step_lights], params: { brightness_pct: 0 } }
```

The two blockers exist only so the `Lights off` catch-all doesn't fire while someone
is home or present; the third "blocks" the evening window so the lights are *left as
they are* at night — but nothing in the group ever switches them **on**.

## The simplified import block

The positive case ("evening + nobody home + nothing present") becomes a single
**acting** scene, with the two guards folded (as their complements) into its `when`.
The blockers then have nothing left to block, so they're dropped. Because this
*removes* scenes, use `mode: replace` (which replaces this category's scenes in the
scope) rather than `merge` (which only upserts and would leave the blockers behind).

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
  - name: Lights off
    category: general
    when: {}
    actions:
      - { service: fado.fade_lights, entity_ids: [light.terrace_floor_lights, light.terrace_perimeter_lights, light.terrace_step_lights], params: { brightness_pct: 0 } }
```

## Why it's equivalent — and better

- **The blockers were negative space.** `Block if anybody home` /
  `Block if presence detected` only ever *prevented* the off-action. Their job is
  done by stating the **opposite** as a positive condition on the one scene that
  acts: `people: { quant: nobody, where: home }` and
  `occupancy: { …, occupied: false }`.
- **The no-op is corrected.** "Lights on at night" finally turns the lights on
  (25 %) instead of silently doing nothing — its name now matches its behaviour.
- **Resolution is unchanged in spirit.** The acting scene has conditions, so it's
  more *specific* than the empty-`when` catch-all and is evaluated first; when its
  conditions don't hold, `Lights off` wins. Four scenes → two, no pinning needed.
- One caveat worth a thought (see the cookbook's *cap-and-hold* / `for:` notes): a
  manual "on" while you're home now loses to `Lights off`. If you want manual
  control to survive, add a guard (e.g. exclude a "terrace manually on" helper) or
  keep a small blocker for that case.
