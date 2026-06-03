# Conditions

A condition is a test that is either met or not at the moment Ambience checks. Each condition looks at one aspect of the world — the time, the weather, who is home, what state an entity is in — and gives a yes or no answer.

## How conditions work in a scene

A scene can have several conditions. For the scene to apply, **every** condition must be met at the same time. If any one condition fails, Ambience moves on to the next scene in the list.

A condition you leave unset, or do not add at all, is treated as a **wildcard**: it always passes. A scene with no conditions whatsoever matches unconditionally, whenever Ambience evaluates that area.

## The "for" duration

Several conditions offer an optional **for** duration (expressed as hours, minutes, and seconds). When you set a duration, the condition only counts as met once the underlying test has been continuously true for at least that long.

For example: a People condition set to "nobody is at home" with a *for* of ten minutes will not pass the moment the last person leaves. It waits until the house has been empty for ten continuous minutes. If someone returns during that window, the clock resets. This prevents brief interruptions — a phone wandering out of a geofence, a GPS hiccup — from triggering scenes they should not.

Leave the duration at zero (the default) to match immediately as soon as the test becomes true.

## Available conditions

| Condition | What it checks |
|---|---|
| [Time of day](time-of-day.md) | Whether the current time falls within a named period, a clock range, or a range anchored to sun events such as sunrise or dusk. |
| [Entity state](entity-state.md) | The state or an attribute of one or more entities, using text or numeric comparisons and logical groups. |
| [Sun](sun.md) | The sun's elevation above the horizon and/or its compass direction (azimuth). |
| [Weather](weather.md) | The current weather condition (sunny, cloudy, rainy, and so on) and numeric attributes such as temperature, humidity, and wind speed. |
| [People](people.md) | Whether everybody, anybody, nobody, or specific people are at home or in a named zone. |
| [Day](day.md) | The day of the week, day of the month, a specific annual date or date range, and workday or holiday status. |
| [Template](template.md) | A Home Assistant Jinja2 template evaluated to a yes/no result — a flexible escape hatch for anything the other conditions do not cover. |
| [Script](script.md) | A Home Assistant script that runs your own logic and reports back whether the condition is met. |
