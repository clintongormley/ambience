# Weather

The weather condition checks the current state reported by a Home Assistant
weather entity — both the named condition (sunny, cloudy, rainy, and so on) and
numeric attributes such as temperature, humidity, and wind speed.

______________________________________________________________________

## How you set it up

### 1. Configure a weather entity

Before the weather condition can do anything, Ambience needs to know which
weather entity to read. Set this in [Settings](../settings-reference.md) under
the **Conditions** tab. Pick the entity from the **Weather entity** picker.
Without this, weather conditions in your scenes will never match.

### 2. Add the condition to a scene

In the scene editor, click **+ Add condition…** and choose **Weather**. The
condition panel has two independent sections — **Groups** and **Thresholds** —
and you can use either, both, or neither.

#### Groups

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

You can add your own groups in [Settings](../settings-reference.md) under the
**Conditions** tab. Each custom group has a label and a list of individual
weather states drawn from the full set that Home Assistant defines. Once saved,
your custom groups appear alongside the built-ins in every scene's weather
condition picker.

If you leave the Groups section empty, any weather state will satisfy that part
of the condition.

#### Thresholds

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

#### Combining groups and thresholds

Groups and thresholds work together. If you select the **Wet** group and add a
threshold of "Temperature ≥ 5", the condition passes only when the weather is
wet *and* the temperature is at least 5 degrees. Neither check alone is
sufficient.

______________________________________________________________________

## Example

You want a scene called **Dull day** that raises the living-room lights to 90 %
brightness whenever it is daytime and the sky is dim or dark (overcast, foggy,
or worse). Here is how to set it up:

1. Open the Ambience panel and expand the **Area: Living room** row.
1. Click **+ Add scene** and name it **Dull day**.
1. Under **When**, click **+ Add condition…** and add a **Time of day**
    condition. Select the **Daytime** period.
1. Click **+ Add condition…** again and add a **Weather** condition. In the
    **Groups** section, tick **Dim** and **Dark**.
1. Under **Actions**, add a light action and set the brightness to 90 %.
1. Click **Save scene**.

Place this scene below any higher-priority scene (such as one that detects
nobody home and turns the lights off), but above a general daytime scene that
runs when the weather is fine. Ambience works down the list and applies the
first scene whose conditions all pass, so the dull-day scene only wins when it
really is overcast.

!!! info "📷 Screenshot"

    The scene editor with the Weather condition open, showing the Groups section
    with "Dim" and "Dark" ticked and the Thresholds section empty.

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
