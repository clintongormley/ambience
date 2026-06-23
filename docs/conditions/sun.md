# Sun

The Sun condition checks where the sun is in the sky — its height above the
horizon (elevation) and/or the compass direction it is coming from (azimuth).
You can use this to trigger a scene when afternoon glare hits a west-facing
window, when the sun is high enough to heat a conservatory, or simply when it
has risen above the roofline.

______________________________________________________________________

## How you set it up

The condition has two independent parts: **elevation** and **azimuth**. You must
set at least one of them.

### Elevation

Elevation measures how high the sun sits above (or below) the horizon, expressed
in degrees. 0° is the horizon, 90° is directly overhead, and negative values
mean the sun is below the horizon (before sunrise or after sunset).

Use the **Elevation** dropdown to choose one of four modes:

| Mode        | What it means                                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| **Any**     | Elevation is not constrained.                                                                                   |
| **Above**   | The sun must be higher than a given angle — for example, above 20° to confirm it is well clear of the roofline. |
| **Below**   | The sun must be lower than a given angle — for example, below 0° to confirm it has set.                         |
| **Between** | The sun must be within a range — for example, between 5° and 20° for a low-light morning window.                |

Type the degree value (or values) into the number field that appears next to the
dropdown. The valid range is −90 to 90.

### Azimuth

Azimuth is the compass bearing of the sun: 0°/360° is north, 90° is east, 180°
is south, 270° is west.

The UI shows a 3 × 3 compass grid — north at the top, with NW, N, NE across the
first row, W, (centre), E across the second, and SW, S, SE across the third.
Tick any sectors you want to include. The sun matches the condition whenever it
falls inside any of the ticked sectors.

Each sector covers a 45° arc (N covers 337.5° to 22.5°, NE covers 22.5° to
67.5°, and so on around the compass).

If you need a different slice — for example, the exact angle at which glare
falls on a skylight — tick **Custom range** and enter a **from** bearing and a
**to** bearing in degrees. A range wraps past north if the "from" value is
greater than the "to" value (for example, 350° to 10° covers the narrow arc
either side of due north). You can combine compass-sector ticks and a custom
range in the same condition; the sun matches if it falls in any of them.

______________________________________________________________________

## Example

You have a south-west-facing sofa that gets direct afternoon sun. You want a
scene that closes the blind automatically when the glare is worst.

Add a **Sun** condition and configure it as follows:

- **Elevation** → **Between** 10° and 40° (the glare band; below 10° the sun is
    too low to reach the sofa, above 40° it clears the window frame).
- **Azimuth** → tick **SW** (and optionally **S** and **W** if the glare starts
    a little earlier or lingers a little later).

The scene's condition now passes only during the hours when the sun is both in
the right part of the sky and low enough to shine directly through the window.
Outside those hours Ambience falls through to the next scene in the list.

!!! info "📷 Screenshot"

    The Sun condition editor with "Between 10° and 40°" set for elevation and the SW
    sector ticked in the compass grid.

______________________________________________________________________

## Notes

- The sun's position is read from the `sun.sun` entity that Home Assistant
    maintains automatically. No additional integration is needed.
- Ambience re-evaluates the condition roughly every minute as the sun moves.
    Your scenes and actions only re-run when the condition's result actually
    changes, not on every check.
- If `sun.sun` is unavailable (for example, your latitude or longitude is not
    configured in Home Assistant), the condition does not match.
