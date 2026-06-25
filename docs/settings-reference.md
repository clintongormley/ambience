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

The Conditions tab is where you configure the global settings for the few
conditions that have them — the named periods for **Time of day**, the workday
source for **Day**, the weather entity and groups for **Weather**, and the named
ranges for **Lux**. Other conditions (Entity state, Occupancy, People, Sun,
Script, Template) are configured per-scene and have no global settings here.

!!! info "📷 Screenshot"

Each condition's settings are documented on its own reference page:

- [Time of day](conditions/time-of-day.md#settings) — view and adjust the
    built-in periods, or add custom ones.
- [Day](conditions/day.md#settings) — point Ambience at a workday sensor and/or
    calendar.
- [Weather](conditions/weather.md#settings) — choose the weather entity and
    define weather groups.
- [Lux](conditions/lux.md#named-lux-ranges) — adjust the built-in lux ranges,
    hide them, or add your own.

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
