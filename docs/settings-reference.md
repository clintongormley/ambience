# Settings reference

Open the Settings modal by clicking the cogwheel (⚙) in the Ambience panel header. The modal has three tabs: **Ambience**, **Conditions**, and **Actions**. Category management lives inside the Ambience tab rather than as a separate tab.

---

## Ambience tab

The Ambience tab has two sections: **Defaults** and **Scene categories**.

!!! info "📷 Screenshot"

### Defaults

These values apply to every scope. See [Scopes & switches](concepts/scopes-and-switches.md) for an explanation of how scopes relate to switch entities.

**Switch name**
The name used for the Ambience switch entities when per-scope switches are enabled. The default is `Ambience`. Changing this field renames all of the Ambience switch entities.

**Auto-on delay (seconds)**
How long (in seconds) Ambience waits after you turn a scope off before automatically turning it back on. The default is `7200` (two hours). Set it to `0` to disable auto-on entirely — the scope will stay off until you turn it on again by hand.

Changes take effect immediately and are persisted to the integration's storage.

---

## Scene categories

Category management is embedded in the Ambience tab, below the Defaults card.

Categories let you group scenes so you can filter the scene list and reason about them separately. Every fresh install starts with a single "General" category. You need at least one category at all times — Ambience will not let you delete the last one.

See [Categories](concepts/categories.md) for a full explanation of what categories do.

!!! info "📷 Screenshot"

### Adding a category

Click **+ Add category**. A modal opens with three fields:

- **Category name** — required; must be unique (case-insensitive).
- **Icon** — an optional MDI icon, chosen from the HA icon picker (e.g. `mdi:sofa`).
- **Colour** — an optional colour swatch. Select one from the palette, or choose "No colour" (the ✕ tile) to leave the category uncoloured.

Click **Save** to persist the new category.

### Editing a category

Click any category row to open the editor. All three fields (name, icon, colour) are editable. Click **Save** to apply your changes.

### Deleting a category

Open the editor for the category you want to remove, then click **Delete**. Ambience will refuse if:

- the category is the last one remaining, or
- the category still has scenes assigned to it.

Move or delete those scenes first, then try again.

---

## Conditions tab

The Conditions tab lists the conditions that have configurable settings. Currently that means **Time of day**, **Day**, **Weather**, and **Lux** — other conditions (Entity state, Occupancy, People, Sun, Script, Template) are configured per-scene and have no global settings here.

!!! info "📷 Screenshot"

### Time of day

Scenes can match a named time-of-day period (Morning, Afternoon, Evening, Nighttime, Daytime) rather than a raw time range. The Conditions tab lets you view those built-in periods and adjust their boundaries, or add your own custom periods.

See [Time of day](conditions/time-of-day.md) for a description of how periods work inside a scene condition.

Each period row shows:

- its **name**
- its **time range**, expressed as either clock times (`06:00 → 09:00`) or solar anchors with optional offsets (`Sunrise-30m → Sunrise+1h`)
- a **badge** — `builtin` for the five standard periods, `custom` for periods you have added or overridden

**Overriding a built-in period**
Click the pencil icon (✎) on a built-in row. The editor opens with the current definition pre-filled. Adjust the start and end endpoints (each can be a clock time or a solar anchor, with an optional minute offset), give the period an optional display label, and save. The built-in row will appear struck through and your custom version will appear beneath it.

To revert an override, click the ✕ icon on the custom row. This restores the original built-in definition.

**Adding a custom period**
Click **+ Add custom period**. Enter a name (used as the period's identifier — it must start with a letter and contain only letters, digits, and underscores once normalised), set the start and end endpoints, and save.

**Resetting all periods**
A "Reset all to defaults" button clears all custom periods and restores any hidden built-ins. Ambience will warn you before proceeding and tell you how many custom periods and hidden built-ins will be affected. If any scenes reference a period that is about to disappear, a warning banner names them so you can update those scenes first.

### Day

The Day condition lets a scene match workdays, holidays, and specific days of the calendar. To use the `Workday` and `Holiday` day types you must point Ambience at a source of workday information.

See [Day](conditions/day.md) for the full set of day types.

**Workday sensor**
Select a `binary_sensor` entity provided by the HA [Workday integration](https://www.home-assistant.io/integrations/workday/). The picker is filtered to show only entities from that integration. When set, scenes using the `Workday` or `Holiday` day type read their state from this sensor.

**Workday calendar**
Select a `calendar` entity provided by the Workday integration. This is an alternative source — configure one or the other depending on which the Workday integration exposes in your setup.

If you remove either entity from HA after scenes have referenced it, Ambience shows a warning listing the affected scenes by name.

### Weather

The Weather condition lets a scene react to current weather. It needs to know which weather entity to read, and optionally how to translate HA's weather condition codes into friendlier group labels you can use in scenes.

See [Weather](conditions/weather.md) for how the condition works inside a scene.

**Weather entity**
Select the `weather` entity to use as the source. Ambience reads its `state` (the current condition code, such as `sunny` or `rainy`) and attributes (temperature, humidity, wind speed, etc.) when evaluating scenes.

**Groups**
Groups map one or more HA weather condition codes to a single label. For example, you might create a group called "Overcast" that includes `cloudy`, `fog`, and `partlycloudy`. Scenes can then match against the group label rather than listing individual codes.

To add a group, click **+ Add group**. A collapsed row appears. Click it to expand, enter a label, and select one or more condition codes from the dropdown. Changes are saved automatically.

To remove a group, click the ✕ on the collapsed row. If any scenes reference a group or entity that is no longer configured, Ambience shows a warning listing the affected scenes.

### Lux ranges

Scenes can match a **named lux range** (Dark, Dim, Normal, Bright, Very
bright) instead of a raw min/max band. The Conditions tab lets you adjust the
built-in ranges' boundaries, hide them, or add your own custom ranges — the
same model as time-of-day periods. See [Lux](conditions/lux.md) for how the
condition itself works.

If you remove a range that a scene still references, the save warns you and
that scene stops matching until it is repointed.

---

## Actions tab

The Actions tab controls which HA services are available as actions inside the scene editor. Only services you expose here appear in the "Add action" picker when building a scene.

See [Actions](actions.md) for a conceptual overview.

!!! info "📷 Screenshot"

### Exposing a service

Click **+ Add action**. A searchable picker appears. Start typing a service name or domain (for example `light.turn_on`) and select it from the list. The new action card is added at the bottom and expanded immediately.

### Configuring an action card

Each exposed service is shown as a card. Click the header row to expand it.

**Label**
An optional friendly name shown in the scene editor instead of the raw service id. For example, you might label `light.turn_on` as "Turn on light". If left blank, Ambience derives a label from the service id automatically.

**Fields**
Each field the service accepts is listed with a checkbox and an optional default value.

- **Checkbox** — tick a field to make it editable per-scene. Unticked fields are hidden in the scene editor.
- **Default value** — click **+ Set default** to open an inline editor for that field. The editor uses HA's native selector widget for the field type. Once set, the default is shown as a pill (`Default: 3000`). Click the pill to edit it, or click the ✕ inside the editor to clear it.

**Re-apply periodically**
When ticked, Ambience re-runs the action on a regular interval as long as the scene remains active. Enter the interval in seconds in the field that appears. Use this for services that control devices which might reset themselves (for example, a media player that reverts volume after a few minutes). The minimum interval is 10 seconds.

### Reordering actions

Drag the ⠿ handle on the left of any card to change the order in which actions appear in the scene editor.

### Removing a service

Click the ✖ on the right of any card header to stop exposing that service. Existing scenes that used it are not deleted, but they will show a warning when you next open them.
