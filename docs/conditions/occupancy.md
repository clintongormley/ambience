# Occupancy

Checks whether one or more presence sensors report a room as occupied or vacant.

This is the purpose-built way to drive presence-based lighting. Under the hood a
presence sensor is just a `binary_sensor`, so you *could* express the same test
with an [Entity state](entity-state.md) condition — but the Occupancy condition
gives you a sensor picker that only lists presence-type sensors, an
Occupied/Vacant toggle, and (importantly) the right **precedence** relative to
your other rules. See
[Precedence](#precedence-why-occupancy-sits-below-entity-state) below.

## How you set it up

When you add an Occupancy condition to a scene, the editor shows:

- **Sensors** — a picker listing your `binary_sensor` entities whose device
    class is `occupancy`, `presence`, or `motion`. Pick one or more.
- **Occupied / Vacant** — whether the chosen sensors should be active (occupied)
    or clear (vacant).
- **Any of / All of** — shown only when you pick more than one sensor. "Any of"
    passes when at least one sensor is in the chosen state; "All of" requires
    every sensor to be.
- **for** — an optional duration (see
    [the *for* duration](index.md#the-for-duration)). With "Any of", the clock
    tracks the combined test, so it keeps running through a handover from one
    sensor to another as long as *some* chosen sensor stays in the wanted state.

### Examples

| Setup                           | Meaning                                              |
| ------------------------------- | ---------------------------------------------------- |
| Lounge sensor, Occupied         | The lounge is occupied right now.                    |
| Lounge sensor, Vacant, for 15m  | The lounge has been empty for 15 continuous minutes. |
| Hall + Stairs, Any of, Occupied | Someone is in the hall or on the stairs.             |
| Hall + Stairs, All of, Vacant   | Both the hall and the stairs are empty.              |

A sensor reporting `unavailable` or `unknown` never counts as occupied or vacant
— it is treated as unobservable, so the condition does not pass on it.

## Precedence: why Occupancy sits below Entity state

When two scenes match the same moment, the higher-ranked one wins. Ambience
ranks scenes automatically by how specific their conditions are, and each
condition type has a fixed priority:

```text
Entity state > People > Occupancy > Day > Time of day > Lux > Sun > Weather
```

Occupancy deliberately sits **below Entity state**. This means a deliberate
device/activity rule built on an Entity state condition — for example "the TV
remote's current activity is *Watch a movie*" — automatically takes precedence
over your presence-based ambient lighting, even though you are also *present*
while watching. You do not have to drag the "Watch TV" scene above your
"someone's home" scenes by hand; the ordering falls out of the priorities.

Occupancy still outranks the ambient conditions (Day, Time of day, Lux, Sun,
Weather), so a presence rule beats a rule that only looks at the time or the
weather.
