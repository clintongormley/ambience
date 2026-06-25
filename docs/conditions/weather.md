# Weather

The weather condition checks the current state reported by a Home Assistant
weather entity — both the named condition (sunny, cloudy, rainy, and so on) and
numeric attributes such as temperature, humidity, and wind speed.

______________________________________________________________________

## 1. Configure a weather entity

Before the weather condition can do anything, Ambience needs to know which
weather entity to read. Set this in the panel's [Settings](#settings) — the
**Conditions** tab. Pick the entity from the **Weather entity** picker. Without
this, weather conditions in your scenes will never match.

## 2. Add the condition to a scene

In the scene editor, click **+ Add condition…** and choose **Weather**. The
condition panel has two independent sections — **Groups** and **Thresholds** —
and you can use either, both, or neither.

### Groups

A group is a named collection of weather states. When you tick one or more
groups, the condition passes only if the current weather state belongs to at
least one of them.

Ambience comes with five built-in groups:

| Group     | Weather states it covers                                                                       |
| --------- | ---------------------------------------------------------------------------------------------- |
| **Sunny** | Sunny                                                                                          |
| **Dim**   | Cloudy, Partly cloudy, Rainy                                                                   |
| **Dark**  | Clear (night), Fog, Hail, Lightning, Lightning-rainy, Pouring, Snowy, Snowy-rainy, Exceptional |
| **Wet**   | Hail, Lightning, Lightning-rainy, Pouring, Rainy, Snowy, Snowy-rainy                           |
| **Windy** | Windy, Windy (variant), Exceptional                                                            |

You can add your own groups in the panel's [Settings](#settings) under the
**Conditions** tab. Each custom group has a label and a list of individual
weather states drawn from the full set that Home Assistant defines. Once saved,
your custom groups appear alongside the built-ins in every scene's weather
condition picker.

If you leave the Groups section empty, any weather state will satisfy that part
of the condition.

### Thresholds

A threshold tests a numeric attribute of the weather entity against a value you
supply. Click **+ Add threshold** and choose:

- **Attribute** — one of: Temperature, Apparent temperature, Humidity, Wind
    speed, Pressure.
- **Comparator** — less than (`<`), at most (`≤`), greater than (`>`), at least
    (`≥`).
- **Value** — the number to compare against. The unit shown matches what your
    weather entity reports (for example `°C` or `hPa`).

You can add as many thresholds as you like. All of them must hold for the
condition to pass.

### Combining groups and thresholds

Groups and thresholds work together. If you select the **Wet** group and add a
threshold of "Temperature ≥ 5", the condition passes only when the weather is
wet *and* the temperature is at least 5 degrees. Neither check alone is
sufficient.

For a worked example that builds a weather-based scene, see
[Step 4 of Getting started](../getting-started/step-4-weather-conditions.md).

______________________________________________________________________

## Settings

The Weather condition needs to know which weather entity to read, and optionally
how to translate HA's weather condition codes into friendlier group labels you
can use in scenes. Configure both in the **Conditions** tab of the Settings
modal (open it from the cogwheel ⚙ in the Ambience panel header).

**Weather entity** Select the `weather` entity to use as the source. Ambience
reads its `state` (the current condition code, such as `sunny` or `rainy`) and
attributes (temperature, humidity, wind speed, etc.) when evaluating scenes.

**Groups** Groups map one or more HA weather condition codes to a single label.
For example, you might create a group called "Overcast" that includes `cloudy`,
`fog`, and `partlycloudy`. Scenes can then match against the group label rather
than listing individual codes.

To add a group, click **+ Add group**. A collapsed row appears. Click it to
expand, enter a label, and select one or more condition codes from the dropdown.
Changes are saved automatically.

To remove a group, click the ✕ on the collapsed row. If any scenes reference a
group or entity that is no longer configured, Ambience shows a warning listing
the affected scenes.

______________________________________________________________________

## Notes

- If the configured weather entity is unavailable or not yet loaded, the
    condition does not match. Scenes that depend on the weather condition are
    therefore skipped until the entity reports a valid state.
- A weather condition with no groups selected and no thresholds added passes
    unconditionally for any weather state. This is rarely useful on its own but
    can serve as a placeholder while you decide which groups to use.
- If you rename or delete a custom group that is already referenced by a scene,
    Ambience will warn you via a banner in Settings listing the affected scenes.

______________________________________________________________________

Next: [Actions](../actions.md).
