# Conditions

A condition is a test that is either met or not at the moment Ambience checks. Each condition looks at one aspect of the world — the time, the weather, who is home, what state an entity is in — and gives a yes or no answer.

## How conditions work in a scene

A scene can have several conditions. For the scene to apply, **every** condition must be met at the same time. If any one condition fails, Ambience moves on to the next scene in the list.

A condition you leave unset, or do not add at all, is treated as a **wildcard**: it always passes. A scene with no conditions whatsoever matches unconditionally, whenever Ambience evaluates that area.

## The "for" duration

Several conditions offer an optional **for** duration (expressed as hours, minutes, and seconds). When you set a duration, the condition only counts as met once the **condition's own test** has been continuously true for at least that long.

What matters is the *test*, not the exact state. A People condition set to "nobody is at home" with a *for* of ten minutes waits until the house has been empty for ten continuous minutes — and it keeps counting even if someone moves from one away zone to another (work to the shops, say), because "not home" stayed true the whole time. Likewise an Entity-state condition that matches any of several states (for example "media player is *playing* or *paused*") keeps counting when the entity flips between those listed states, because the test never stopped being true. The clock only resets the moment the test actually becomes false.

This prevents brief interruptions — a phone wandering out of a geofence, a GPS hiccup, a sensor flicker — from triggering scenes they should not.

After a Home Assistant restart the clock resumes from the last change Home Assistant can prove (an entity's last state change), so a "switch on for 2 hours" rule that was already an hour in still fires an hour after the restart rather than starting a fresh two hours. It never counts time during a window Home Assistant did not observe.

Leave the duration at zero (the default) to match immediately as soon as the test becomes true.

## Available conditions

| Condition | What it checks |
|---|---|
| [Time of day](time-of-day.md) | Whether the current time falls within a named period, a clock range, or a range anchored to sun events such as sunrise or dusk. |
| [Entity state](entity-state.md) | The state or an attribute of one or more entities, using text or numeric comparisons and logical groups. |
| [Sun](sun.md) | The sun's elevation above the horizon and/or its compass direction (azimuth). |
| [Weather](weather.md) | The current weather condition (sunny, cloudy, rainy, and so on) and numeric attributes such as temperature, humidity, and wind speed. |
| [People](people.md) | Whether everybody, anybody, nobody, or specific people are at home or in a named zone. |
| [Occupancy](occupancy.md) | Whether presence/occupancy/motion sensors report a room as occupied or vacant, with optional dwell time. |
| [Lux](lux.md) | Whether ambient-light (illuminance) sensors fall inside a named or custom lux range. |
| [Day](day.md) | The day of the week, day of the month, a specific annual date or date range, and workday or holiday status. |
| [Template](template.md) | A Home Assistant Jinja2 template evaluated to a yes/no result — a flexible escape hatch for anything the other conditions do not cover. |
| [Script](script.md) | A Home Assistant script that runs your own logic and reports back whether the condition is met. |
