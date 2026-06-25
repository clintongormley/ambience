# Settings reference

Open the Settings modal by clicking the cogwheel (⚙) in the Ambience panel
header. The modal has four tabs: **Categories**, **Conditions**, **Actions**,
and **Advanced**. Each tab has `(?)` help buttons next to controls — click one
to open a short explanation.

______________________________________________________________________

## Categories tab

Category management lives in the Categories tab.

Categories let you group scenes so you can filter the scene list and reason
about them separately. Every fresh install starts with a single "General"
category. You need at least one category at all times — Ambience will not let
you delete the last one.

See [Scopes and categories](getting-started/step-1-scopes-and-categories.md) in
the Getting started guide for a hands-on introduction.

!!! info "📷 Screenshot"

### Adding a category

Click **+ Add category**. A modal opens with three fields:

- **Category name** — required; must be unique (case-insensitive).
- **Icon** — an optional MDI icon, chosen from the HA icon picker (e.g.
    `mdi:sofa`).
- **Colour** — an optional colour swatch. Select one from the palette, or choose
    "No colour" (the ✕ tile) to leave the category uncoloured.

Click **Save** to persist the new category.

### Editing a category

Click any category row to open the editor. All three fields (name, icon, colour)
are editable. Click **Save** to apply your changes.

### Deleting a category

Open the editor for the category you want to remove, then click **Delete**.
Ambience will refuse if:

- the category is the last one remaining, or
- the category still has scenes assigned to it.

Move or delete those scenes first, then try again.

______________________________________________________________________

## Conditions tab

The Conditions tab lists the conditions that have configurable settings.
Currently that means **Time of day**, **Day**, **Weather**, and **Lux** — other
conditions (Entity state, Occupancy, People, Sun, Script, Template) are
configured per-scene and have no global settings here.

!!! info "📷 Screenshot"

### Time of day

Scenes can match a named time-of-day period (Dawn, Morning, Afternoon, Evening,
Nighttime, Daytime) rather than a raw time range. The Conditions tab lets you
view those built-in periods and adjust their boundaries, or add your own custom
periods.

See [Time of day](conditions/time-of-day.md) for a description of how periods
work inside a scene condition.

Each period row shows:

- its **name**
- its **time range**, expressed as either clock times (`06:00 → 09:00`) or solar
    anchors with optional offsets (`Sunrise-30m → Sunrise+1h`)
- a **badge** — `builtin` for the five standard periods, `custom` for periods
    you have added or overridden

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

### Day

The Day condition lets a scene match workdays, holidays, and specific days of
the calendar. To use the `Workday` and `Holiday` day types you must point
Ambience at a source of workday information.

See [Day](conditions/day.md) for the full set of day types.

**Workday sensor** Select a `binary_sensor` entity provided by the HA
[Workday integration](https://www.home-assistant.io/integrations/workday/). The
picker is filtered to show only entities from that integration. When set, scenes
using the `Workday` or `Holiday` day type read their state from this sensor.

**Workday calendar** Select a `calendar` entity provided by the Workday
integration. This is an alternative source — configure one or the other
depending on which the Workday integration exposes in your setup.

If you remove either entity from HA after scenes have referenced it, Ambience
shows a warning listing the affected scenes by name.

### Weather

The Weather condition lets a scene react to current weather. It needs to know
which weather entity to read, and optionally how to translate HA's weather
condition codes into friendlier group labels you can use in scenes.

See [Weather](conditions/weather.md) for how the condition works inside a scene.

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

### Lux ranges

Scenes can match a **named lux range** (Dark, Dim, Normal, Bright, Very bright)
instead of a raw min/max band. The Conditions tab lets you adjust the built-in
ranges' boundaries, hide them, or add your own custom ranges — the same model as
time-of-day periods. See [Lux](conditions/lux.md) for how the condition itself
works.

If you remove a range that a scene still references, the save warns you and that
scene stops matching until it is repointed.

______________________________________________________________________

## Actions tab

The Actions tab controls which HA services are available as actions inside the
scene editor. Only services you expose here appear in the "Add action" picker
when building a scene.

See [Actions](actions.md) for a conceptual overview.

!!! info "📷 Screenshot"

### Exposing a service

Click **+ Add action**. A searchable picker appears. Start typing a service name
or domain (for example `light.turn_on`) and select it from the list. The new
action card is added at the bottom and expanded immediately.

### Configuring an action card

Each exposed service is shown as a card. Click the header row to expand it.

**Label** An optional friendly name shown in the scene editor instead of the raw
service id. For example, you might label `light.turn_on` as "Turn on light". If
left blank, Ambience derives a label from the service id automatically.

**Fields** Each field the service accepts is listed with a checkbox and an
optional default value.

- **Checkbox** — tick a field to make it editable per-scene. Unticked fields are
    hidden in the scene editor.
- **Default value** — click **+ Set default** to open an inline editor for that
    field. The editor uses HA's native selector widget for the field type. Once
    set, the default is shown as a pill (`Default: 3000`). Click the pill to
    edit it, or click the ✕ inside the editor to clear it.

### Reordering actions

Drag the ⠿ handle on the left of any card to change the order in which actions
appear in the scene editor.

### Removing a service

Click the ✖ on the right of any card header to stop exposing that service.
Existing scenes that used it are not deleted, but they will show a warning when
you next open them.

______________________________________________________________________

## Advanced tab

The Advanced tab is the last tab in the Settings modal. It has two sections:
**Scope-level pause switch** and **Re-run**.

!!! info "📷 Screenshot"

### Scope-level pause switch

This section controls whether Ambience creates a switch entity per scope that
you can use to pause automatic scene application from outside the panel.

**Scope-level pause switch** (toggle) Enables or disables per-scope switch
entities. Off by default. When turned on, each scope (House, each Floor, each
Area) gets a switch entity that pauses Ambience for that scope when turned off.

**Switch name** The name used for the per-scope switch entities. The default is
`Ambience`. Changing this renames all of the Ambience switch entities. Only
editable when the toggle above is on.

**Pause for (minutes)** How long Ambience waits after a scope's switch is turned
off before automatically turning it back on. The default is `0` (never
auto-resume) — the scope stays paused until you turn the switch back on
manually. Set a positive number of minutes to resume automatically after that
delay. Only editable when the toggle above is on.

**Expose to voice assistants** Three toggles — **Assist**, **Google Assistant**,
and **Alexa** — controlling which voice assistants the per-scope switches are
exposed to, so you can pause or resume a scope by voice ("turn off Living Room
Ambience"). Only editable when the pause-switch toggle is on. **Assist** (Home
Assistant's built-in agent) is on by default; **Google Assistant** and **Alexa**
are off and require Home Assistant Cloud (or a manual setup) to take effect.
Changing a toggle re-applies the exposure to every Ambience switch, overwriting
any per-switch exposure you set manually under **Settings → Voice assistants →
Expose**.

Changes take effect immediately — Ambience creates or removes switch entities
live without requiring an integration reload.

______________________________________________________________________

### Re-run

The **Re-run** card lets Ambience automatically re-send a scope/category unit's
scene commands after a period of inactivity. This is useful for recovering from
dropped commands — for example, a light that did not actually turn off, or a
cover that reverted to its previous position.

**Re-run all scenes after inactivity** (toggle) Enables or disables the feature
globally. Off by default.

**Re-run after (minutes)** How long Ambience waits without dispatching any
commands to a given scope/category unit before it re-asserts that unit's winning
scene. The default is `60` minutes. The minimum is `1` minute. Only editable
when the toggle above is on.

When the feature is enabled and the timeout elapses for a unit, Ambience
re-evaluates and re-dispatches that unit's winning scene — even if the winner
has not changed — to recover any commands that may have been dropped. The idle
clock resets each time a unit's commands are actually dispatched. Units whose
switch is off, or whose scope is disabled, are skipped.

## Undo / redo

The panel keeps the last 30 scene-list changes in memory. Undo and Redo buttons
at the top of the panel step back and forward through those changes (or use
Ctrl/⌘+Z and Ctrl/⌘+Shift+Z). A caption beside the buttons always names the
change that's next, e.g. *Undo: Deleted scene "Movie night" in Living Room* — so
it's visible on touch devices too, not just on hover.

The history is global (it spans the house and every area and floor), is shared
across browser tabs, and is cleared when Home Assistant restarts. When you
change scenes in one tab, other open tabs refresh automatically; if a tab has
the scene editor open on the scope that changed, it shows a "changed in another
tab — Refresh" banner instead of reloading underneath your edit. Changes to
categories, time periods, lux ranges, and the whole-scope on/off switch are not
part of undo.
