# Scopes & switches

Ambience organises your home into a hierarchy of *scopes*. Each scope has its
own scenes and its own position in a top-down cascade. Optionally, each scope
also has a switch entity that lets you pause or re-enable Ambience for that
scope from outside the panel. Understanding the three levels — House, Floor, and
Area — is the foundation for everything else Ambience does.

______________________________________________________________________

## The three scope levels

### House

There is exactly one House scope. It sits at the top of the hierarchy and
represents your entire home. Scenes defined at the House level are available as
a fallback for every room in the house.

### Floors

Each floor you have created in Home Assistant's area and floor registry appears
as a Floor scope in Ambience. If you have not set up floors in HA, this level
simply does not appear. Floors are managed entirely in HA's own settings —
Ambience reads them from the registry automatically.

### Areas

Each area in your HA area registry becomes an Area scope. This is where most of
your day-to-day scenes live: the living room, the kitchen, each bedroom. As with
floors, you create and rename areas in HA and Ambience picks up the changes.

There is nothing to configure in Ambience to add or remove scopes — they mirror
your HA area and floor setup directly.

______________________________________________________________________

## Switch entities

Switch entities are **opt-in**. By default Ambience creates no switch entities.
To enable them, open the Ambience panel's Settings modal (cogwheel ⚙), go to the
**Advanced** tab, and turn on **Scope-level pause switch**.

When per-scope switches are enabled, each scope gets one switch entity named
after the scope and ending in "Ambience". For example:

| Scope                        | Entity                               |
| ---------------------------- | ------------------------------------ |
| House                        | `switch.house_ambience`              |
| A floor named "Ground floor" | `switch.ground_floor_floor_ambience` |
| An area named "Living room"  | `switch.living_room_ambience`        |

Floor switches carry `_floor_` in their entity ID to avoid collisions with an
area of the same name.

Each switch lives on its own device. The House switch is the main **Ambience**
device, and every floor and area switch is a sub-device linked to it. **Area**
sub-devices are placed in their matching HA area automatically, so the switch
shows up under that area and area-aware voice assistants can resolve it. If you
move an area's device to a different area yourself, Ambience leaves your choice
alone.

If a scope is disabled (removed from Ambience's configuration) while per-scope
switches are enabled, its switch entity is deleted automatically.

You can choose which voice assistants the switches are exposed to in the
Ambience panel's Settings modal (cogwheel ⚙), on the **Advanced** tab — see
[Installation](../installation.md#voice-assistants).

When per-scope switches exist, they appear in the Ambience panel as a toggle on
each scope row. You can also control them from HA's developer tools,
automations, or dashboards like any other switch entity. When per-scope switches
are not enabled, the panel's scope toggles still work — they pause and resume
Ambience for that scope — but no HA entity is created.

!!! info "📷 Screenshot"

    The main Ambience panel showing the House row at the top with its toggle, then a
    Floor row, then several Area rows each with their own toggle.

______________________________________________________________________

## Cascade: switches affect everything below them

Turning a switch **on or off cascades downwards** through the hierarchy.

- Turning the **House** switch off turns off every Floor switch and every Area
    switch.
- Turning a **Floor** switch off turns off every Area switch on that floor.
- Turning a **Floor** switch on turns on every Area switch on that floor, then
    turns the Floor on.
- Turning an **Area** switch on or off affects only that area.

The cascade only goes downward. Turning a single area switch off does not affect
its floor or the House. If the Living room switch is off but the House switch is
on, Ambience is active for every other room.

When you turn a switch **on**, all the switches below it come on with it, so you
do not need to re-enable them individually.

______________________________________________________________________

## Gating: switches pause automatic scene application

While a switch is **off**, Ambience does not apply that scope's scenes
automatically. The auto-trigger engine skips the scope entirely — it will not
react to changes in occupancy, time of day, weather, or entity state for that
scope.

There is one exception: the **Run actions** option in a scene's action menu
applies that scene immediately regardless of the switch state. This lets you
apply a scene manually even when automatic triggering is paused.

______________________________________________________________________

## Auto-on: the switch turns itself back on

When you turn a switch off, Ambience starts a timer. When the timer expires the
switch turns itself back on automatically — including cascading back on to all
the switches below it.

The default delay is **0** (disabled — the switch stays off until you turn it
back on manually). You can set a positive number of minutes in the
[Advanced tab](../settings-reference.md#advanced-tab) of the Settings modal
(**Pause for** field).

The timer survives a Home Assistant restart. Ambience records the moment the
switch was turned off and, on restart, calculates how much time is left. If the
delay has already elapsed by the time HA comes back up, the switch turns on
immediately.

Changing the global delay setting takes effect immediately for any switch that
is currently off and waiting.

______________________________________________________________________

## A worked example

Suppose you are having a party. You want the lighting in the living room and
dining room to stay exactly as you have set it, without Ambience adjusting
things as occupancy or the time changes.

Turn off the "Ground floor" switch. Ambience cascades the off down to every area
on that floor, including Living room and Dining room. If you set a **Pause for**
duration in the Advanced tab (for example, 120 minutes), Ambience will re-engage
automatically after the party — you do not need to remember to turn it back on.

If the party is likely to run longer, go into Settings → Advanced and raise the
**Pause for** value. If guests are staying overnight and you want to leave
things off until morning, leave **Pause for** at `0` (never auto-resume), then
turn the floor switch back on manually the next day.

You could equally turn off just the Living room switch if you only want to
freeze that one area, leaving the kitchen and hallway running normally.

______________________________________________________________________

## Summary

- **House, Floor, Area** — three levels, mirroring your HA area/floor registry.
- **Switch entities are opt-in** — enable **Scope-level pause switch** in the
    **Advanced** tab of the Settings modal. When enabled, each scope gets one
    switch entity named `switch.<scope>_ambience` (floors:
    `switch.<scope>_floor_ambience`; House: `switch.house_ambience`). Disabling
    a scope while switches are on deletes its entity. Changes take effect live
    without a reload.
- **Turning off cascades down**; turning on cascades down too. Turning off a
    leaf (area) affects only that area.
- **Off means paused**: Ambience skips automatic scene application for that
    scope. Manual "Run actions" still works.
- **Auto-on** brings the switch back after the **Pause for** duration (default:
    `0` = never; set a positive number of minutes to auto-resume).
