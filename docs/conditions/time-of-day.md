# Time of day

Checks whether the current time falls within a specified window, expressed as a
named period, a clock range, or a range anchored to sun events such as sunrise
or dusk.

When you add a Time of day condition to a scene, you see a dropdown with three
kinds of entry:

- **Any time** — the condition always matches (equivalent to having no condition
    at all; useful as a placeholder while you build a scene).
- **A named period** — one of the built-in periods or any custom period you have
    defined in Settings.
- **Custom range** — you define the start and end yourself.

## Using a named period

Ambience ships six built-in periods that track the sun automatically, so they
adjust throughout the year without any configuration:

| Period    | From    | To      |
| --------- | ------- | ------- |
| Dawn      | Dawn    | Sunrise |
| Morning   | Sunrise | Noon    |
| Afternoon | Noon    | Sunset  |
| Evening   | Sunset  | Dusk    |
| Nighttime | Sunset  | Sunrise |
| Daytime   | Sunrise | Sunset  |

All six are sun-relative, so "Morning" in summer starts earlier than it does in
winter, and everything shifts with your latitude automatically. "Nighttime"
spans the whole night (sunset to sunrise) and so overlaps the narrower "Evening"
and "Dawn" windows; where periods overlap, a scene's summary names the most
specific one.

You can also define your own periods — for example a "Wind down" period from
21:00 to 23:00 — via **Settings → Conditions**. Once saved, custom periods
appear in the same dropdown alongside the built-ins. See [Settings](#settings)
below for how to create and edit them.

## Using a custom range

Select **Custom range** from the dropdown and the editor expands to show a
**From** row and a **To** row. Each end of the range has two controls:

1. A **kind** dropdown — choose **Time** for a fixed clock time, or **Sun** for
    a sun-relative anchor.
1. The value itself:
    - **Time**: a standard time-of-day picker (hh:mm in your local timezone,
        DST-aware).
    - **Sun**: an anchor dropdown (Dawn, Sunrise, Noon, Sunset, Dusk, or
        Midnight) plus an offset field. Enter a positive number to push the
        boundary later (e.g. `30` = 30 minutes after the anchor) or a negative
        number to push it earlier (e.g. `-30` = 30 minutes before). Leave the
        offset at `0` for exactly at the anchor. The hint next to the field shows
        the offset in plain English, such as `+30 min` or `−1 hour`.

Ranges can wrap midnight. If your "From" time is later in the day than your "To"
time (for example, 22:00 to 06:00), the condition matches from 22:00 through to
06:00 the following morning.

## Adding multiple time windows

Once a custom range is set, an **+ add another time range** button appears below
it. Clicking it adds a second entry to the condition. The condition then matches
if the current time falls within *any* of the listed windows, which lets you
express things like "between 07:00–09:00 or 17:00–19:00" in a single condition.
Each added entry collapses to a summary chip when you move to another; click a
chip to expand and edit it.

## Settings

The **Conditions** tab of the Settings modal lets you view the built-in periods
and adjust their boundaries, or add your own custom periods. Open it from the
cogwheel (⚙) in the Ambience panel header.

Each period row shows:

- its **name**
- its **time range**, expressed as either clock times (`06:00 → 09:00`) or solar
    anchors with optional offsets (`Sunrise-30m → Sunrise+1h`)
- a **badge** — `builtin` for the six standard periods, `custom` for periods you
    have added or overridden

**Overriding a built-in period** Click the pencil icon (✎) on a built-in row.
The editor opens with the current definition pre-filled. Adjust the start and
end endpoints (each can be a clock time or a solar anchor, with an optional
minute offset), give the period an optional display label, and save. The
built-in row will appear struck through and your custom version will appear
beneath it.

To revert an override, click the ✕ icon on the custom row. This restores the
original built-in definition.

**Adding a custom period** Click **+ Add custom period**. Enter a name (used as
the period's identifier — it must start with a letter and contain only letters,
digits, and underscores once normalised), set the start and end endpoints, and
save.

**Resetting all periods** A "Reset all to defaults" button clears all custom
periods and restores any hidden built-ins. Ambience will warn you before
proceeding and tell you how many custom periods and hidden built-ins will be
affected. If any scenes reference a period that is about to disappear, a warning
banner names them so you can update those scenes first.

______________________________________________________________________

Next: [Unavailable](unavailable.md).
