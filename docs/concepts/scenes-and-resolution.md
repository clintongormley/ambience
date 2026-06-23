# Scenes & resolution

A **scene** is the core building block of Ambience. It has three parts:

- A **name** (optional, but useful for keeping things readable).
- **Conditions** — the circumstances under which the scene should apply: time of
    day, day of week, an entity state, sun elevation, and so on. These are the
    "when".
- **Actions** — what Ambience does when the scene wins: turn lights to a certain
    brightness and colour temperature, run a script, and so on. These are the
    "then".

Scenes are defined within a scope (House, Floor, or Area). Within each scope,
scenes belong to a [category](categories.md) — one winner per category is chosen
each time Ambience re-evaluates.

!!! info "📷 Screenshot"

    *Scene list for a living-room area, showing a shadowed scene.*

## How resolution works

Within a category, the scenes form an **ordered list**. Ambience works through
them from top to bottom, checking each one in turn. The first scene whose
conditions all pass is the winner; Ambience stops there and applies its actions.

### A condition you have not set is a wildcard

Each condition type is independent. If you have not set a condition for, say,
time of day, that slot is open — it passes automatically regardless of the time.
A scene with no conditions set at all is an unconditional match: it will always
win if Ambience reaches it.

### First match wins

Because evaluation stops at the first match, order determines priority. Put more
specific scenes above more general ones.

**Example.** Suppose you want dim, warm light when a room is empty, and brighter
light the rest of the time:

| Position | Scene      | Conditions             | Actions                |
| -------- | ---------- | ---------------------- | ---------------------- |
| 1        | Empty room | Occupancy sensor = off | Lights at 10 %, 2700 K |
| 2        | Default    | *(none)*               | Lights at 80 %, 3000 K |

When nobody is home the first scene wins. As soon as the sensor flips to "on",
the first scene no longer matches and the second (unconditional) scene wins
instead. If those two scenes were swapped, the unconditional "Default" would
always win first and the "Empty room" scene would never fire.

## Disabled scenes

Disabling a scene removes it from resolution entirely. Ambience skips it as
though it were not in the list — it cannot win, and it does not block the scenes
below it from being evaluated. This is useful for temporarily suspending a scene
without losing its configuration.

## Shadowed scenes

If a scene can never win — because something above it in the list will always
match first — the editor flags it with a warning:

> **Never fires — shadowed by an earlier scene.**

This usually means an unconditional scene (no conditions set) sits above a more
specific one, or two scenes share identical conditions. The specific scene will
never be reached.

To fix a shadowed scene, either:

- **Reorder** — move the shadowed scene above the one that is blocking it, or
- **Tighten the scene above** — add a condition to the earlier scene so it no
    longer matches in all circumstances.

## Automatic and manual application

Normally Ambience re-evaluates automatically whenever something relevant
changes: a sensor updates, the time crosses a boundary, the sun moves past a
threshold. You do not need to do anything.

If you want to force a scene to apply immediately — for instance, to test it —
use the **Run actions** option in the scene's action menu. This runs that
scene's actions once, independently of the normal resolution cycle. It does not
change which scene would win in a normal evaluation.

## Resolution per category

Resolution runs once per [category](categories.md) in a scope. Each category
produces exactly one winner (or no winner, if no scene matches). See
[Categories](categories.md) for how categories are defined and why separating
concerns this way is useful.
