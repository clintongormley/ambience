# Lux

Checks whether ambient-light (illuminance) sensors fall inside a lux range —
"the lounge is dark", "the office is brighter than 300 lx".

This is the natural condition for daylight-aware lighting: instead of guessing
from the time of day or the weather, it reads what your light sensors actually
measure. Only `sensor` entities whose device class is `illuminance` count.

______________________________________________________________________

## How you set it up

When you add a Lux condition to a scene, the editor shows:

- **Sensors** — a picker listing your illuminance sensors. Pick one or more.
    Leaving it empty makes the condition match anything (no constraint).
- **Range** — either a **named lux range** (see below) or a custom inline band
    with a **Min** and/or **Max** in lux. A band is half-open: it matches when
    `min ≤ reading < max`. Either bound may be left empty for an open-ended
    range.
- **Any of / All of** — shown when you pick more than one sensor. "Any of"
    passes when at least one sensor reads inside the range; "All of" requires
    every sensor to.

A sensor reporting `unavailable`, `unknown`, or a non-numeric value never counts
as inside a range — it is treated as unobservable, so the condition does not
pass on it.

### Examples

| Setup                               | Meaning                                 |
| ----------------------------------- | --------------------------------------- |
| Lounge sensor, range *Dark*         | The lounge reads below 10 lx.           |
| Office sensor, min 300              | The office is at 300 lx or brighter.    |
| Hall + landing, Any of, range *Dim* | At least one of the two reads 10–50 lx. |

______________________________________________________________________

## Named lux ranges

Ambience ships five built-in ranges:

| Range       | Band              |
| ----------- | ----------------- |
| Dark        | below 10 lx       |
| Dim         | 10 – 50 lx        |
| Normal      | 50 – 300 lx       |
| Bright      | 300 – 1000 lx     |
| Very bright | 1000 lx and above |

You can adjust these, hide them, or add your own under
[Settings](../settings-reference.md) → **Conditions** tab → **Lux ranges** — the
same override-the-built-ins model as time-of-day periods. Scenes that reference
a named range pick up any later edits to it automatically.

If you delete or hide a named range that a scene still references, the save
warns you, and that scene simply stops matching until you point it at an
existing range — it never breaks the rest of the scope.

______________________________________________________________________

## Precedence

When two scenes match the same moment, the higher-ranked one wins. Each
condition type has a fixed priority, and Lux sits with the other environmental
signals:

```text
Entity state > People > Occupancy > Day > Time of day > Lux > Sun > Weather
```

Ambient light is an environmental fact, like the sun's position — so a Lux rule
never outranks a deliberate device or presence rule, but it does outrank rules
that only look at the sun or the weather.

______________________________________________________________________

## Triggers

Ambience watches the sensors the condition names and re-evaluates the scope
whenever one of them changes, so a cloud passing over flips your scenes without
any polling on your part.
