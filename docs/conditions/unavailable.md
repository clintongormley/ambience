# Unavailable

Checks whether any of the entities you list is **unavailable, unknown, or
missing**. It is the "block here if any of these is down" guard — a way to make
a scene win precisely when a sensor it depends on cannot be trusted.

Most conditions treat an unavailable entity as *unobservable* and quietly
decline to match on it. The Unavailable condition does the opposite: being down
is the exact fact it reports. That lets you build a safe fallback that takes
over when, say, your presence sensor drops offline, rather than letting a
presence-based rule misfire on stale or missing data.

## How you set it up

When you add an Unavailable condition to a scene, the editor shows a single
control:

- **Entities** — a picker listing entities of **any** domain (a `binary_sensor`,
    a `light`, a `climate` device, anything). Pick one or more.

There is no is/is-not toggle, no Any-of/All-of quantifier, and no **for**
duration — the condition is deliberately simple. It matches as soon as **any
one** of the entities you picked is unavailable, unknown, or absent (deleted or
not yet loaded). You must pick at least one entity.

### Examples

| Setup                       | Meaning                                                     |
| --------------------------- | ----------------------------------------------------------- |
| Lounge presence sensor      | The lounge presence sensor is offline, unknown, or missing. |
| Hall sensor + Stairs sensor | At least one of the hall or stairs sensors is down.         |

## Using it as a fallback guard

The Unavailable condition is most useful on a high-priority "something's wrong"
scene that should take over when a sensor you rely on stops working. For
example:

| Position | Scene       | Conditions                          | Actions                         |
| -------- | ----------- | ----------------------------------- | ------------------------------- |
| 1        | Sensor down | Unavailable: lounge presence sensor | Lights at 60 % (a safe default) |
| 2        | Empty room  | Occupancy: lounge sensor, Vacant    | Lights off                      |
| 3        | Occupied    | Occupancy: lounge sensor, Occupied  | Lights at 30 %                  |

While the presence sensor works, scenes 2 and 3 do their normal job. The moment
the sensor goes unavailable, scene 1 wins and applies a sensible default instead
of leaving the room dark because the occupancy test can no longer pass.

## Precedence: why Unavailable sits near the top

When two scenes match the same moment, the higher-ranked one wins. Ambience
ranks scenes automatically, and each condition type has a fixed priority:

```text
Script > Template > Unavailable > Entity state > People > Occupancy > Day > Time of day > Lux > Sun > Weather
```

Unavailable sits **above Entity state** — higher than every world-state
condition. Whether an entity is observable at all is the most fundamental fact
about it, so a "sensor down" guard naturally outranks the normal rules that
depend on that sensor. You do not have to drag your fallback scene to the top by
hand; the ordering falls out of the priorities.
