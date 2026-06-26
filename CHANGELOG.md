# Changelog

All notable user-facing changes to Ambience are documented here. This project
adheres to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). Releases before
0.24.0 are recorded only in
[GitHub Releases](https://github.com/clintongormley/ambience/releases).

## [Unreleased]

### Changed

- The Unavailable condition now has the highest precedence of all conditions —
  above Script and Template. When two scenes are otherwise equally specific, the
  one that guards on an entity being unavailable, unknown, or missing now sorts
  first and wins, because whether an entity is observable at all is the most
  fundamental fact a scene can match on.

## [0.29.0] - 2026-06-26

### Added

- Scene actions can now target by entity, device, area, floor, or label (like
  Home Assistant automations). The target resolves live at apply time and is
  constrained to the scene's scope, with a live count in the editor showing how
  many entities the target will act on. A directly-named entity is forwarded
  unchanged — it is the author's deliberate choice and is never scope-clipped.
  The device/area/floor/label picker needs Home Assistant 2026.1 or newer; on
  older versions the action editor falls back to entity-only targeting.
- The safe cover actions — Open cover, Close cover, Set cover position, and Set
  cover tilt — are now seeded as default actions on new installs, so covers work
  in scenes out of the box.
- The Actions settings page now shows a dismissible recommendation to install
  the Fado Light Fader integration (smooth light fading with automatic
  brightness restoration) when it isn't already installed.
- The Lux condition now has an "is / is not" choice, so a scene can match when
  your light sensors are *not* in a chosen range — for example, blocking a scene
  until the room is no longer bright.

### Changed

- The action editor no longer prevents two actions in the same scene from
  targeting the same entity (Home Assistant's native target picker cannot hide
  individual entities); contradictory actions apply in order, last-write-wins.
  The config-health overlap warning still flags entities controlled by more than
  one scope/category group. A new `target_empty` Repairs warning flags an action
  whose target resolves to no entities in its scope.
- In the Lux and Occupancy conditions, the "Any of / All of" selector now sits
  above the sensor list (and only appears when more than one sensor is chosen),
  and their summaries read more naturally — e.g. "Any of (Lounge, Hall) is
  bright", "All of (Lounge, Hall) are detected", "Lounge is unavailable".
- The Advanced settings tab now has a clearer visual hierarchy. Section titles
  stand out from their fields, the two setting groups are more obviously
  separated, and the voice-assistant toggles are presented as a nested
  sub-section of the scope-level pause switch (their switches still line up with
  the fields above).

### Removed

- The admin-only `ambience.apply_scene` action — for calling Ambience from your
  own automations and scripts — has been removed. Automatic scene application
  (as conditions change) and the panel's Run / apply controls are unaffected;
  only the standalone service is gone.

### Fixed

- When overriding a built-in time-of-day period (e.g. "Dawn") or lux range, the
  name field now defaults to the range's current name instead of starting blank
  with only the "e.g. Wind down" placeholder. You can still rename it or clear
  it.

## [0.28.0] - 2026-06-25

### Added

- In the Entity State condition, each AND/OR group now has a "(…)" button that
  wraps all of that group's clauses in parentheses, so you can combine them with
  another clause under a different operator — for example turning "a AND b" into
  "(a AND b) OR c".

### Changed

- Condition summaries now prefix each entity with its area (e.g. "Kitchen ·
  Water pump Flow"), so clauses that reference similarly-named entities in
  different areas are no longer ambiguous. The area is omitted when the entity's
  name already contains it (e.g. an entity called "Zone Shower" in the "Shower"
  area stays "Zone Shower").
- In the Entity State condition, the buttons that add another comparison within
  the same condition now read "Add clause" instead of "Add condition", to avoid
  confusion with the main "Add condition" button that adds a new condition.
- A blocking scene whose condition is an OR now reads as "Block while … OR
  until …" instead of a hard-to-parse double negative. For example, a block that
  read "Block while NOT (Zone Shower is Clear for ≥5s) OR Water pump Flow > 5"
  now reads "Block while Water pump Flow > 5 OR until Zone Shower is Clear for
  ≥5s".

### Fixed

- In the Entity State condition, "Add clause" now works on a negated (NOT)
  group. Previously, clicking it while NOT was enabled did nothing until you
  turned NOT off.
- Config health now flags an entity referenced by a scene when that entity is
  disabled (e.g. its device was disabled) rather than deleted. A disabled entity
  stays in the entity registry but has no state, so it can never satisfy a
  condition; it is now reported as missing in both the scene problem flag and
  the Repairs issue, instead of being silently treated as present.

## [0.27.0] - 2026-06-24

### Changed

- In the Simulate panel, an entity attribute that has a known set of values
  (such as a remote's current activity) is now editable via a dropdown of those
  values — matching the scene editor — instead of a free-text field.

### Fixed

- The state value dropdown (in the scene editor and the simulator) now offers
  both On and Off for remote, automation, script, siren, humidifier, update and
  calendar entities, instead of only the entity's current state.
- On phones the Simulate panel no longer squashes the entity name into a narrow
  column or scrolls sideways — each row's controls now wrap onto their own line.
- Deleting the Ambience integration now also removes its stored data (scenes,
  scopes, switch and condition settings). Previously this data was kept on disk,
  so removing and re-adding the integration silently restored all your old
  settings instead of starting fresh. A reload or Home Assistant restart still
  preserves your data as before — only an explicit delete clears it.
- When configuring an action's fields, each field's checkbox now lines up with
  the field name at the top of the row instead of floating in the vertical
  centre of multi-line descriptions.

## [0.26.0] - 2026-06-23

### Added

- Scenes can now have an optional description. Add one from the scene editor via
  the "+ Add description" link below Scope. On the panel it appears as a "?"
  tooltip next to the scene name, and inline beneath the scene when you expand
  it.
- Undo / redo for scene changes: the panel now keeps the last 30 scene edits in
  memory. Use the Undo and Redo buttons at the top of the panel — or Ctrl/⌘+Z and
  Ctrl/⌘+Shift+Z — to step back and forward through add, edit, delete, reorder,
  unpin and enable/disable changes. A caption beside the buttons always names
  the next change. The history is shared across browser tabs (which refresh
  automatically when you change scenes elsewhere) and clears when Home Assistant
  restarts.

## [0.25.0] - 2026-06-22

### Added

- Live scene indicator: each scene in the panel now shows a small dot for its
  live state — a green dot on the scene that currently matches, and a hollow dot
  on a scene whose actions are still applied but no longer match. It updates
  automatically; tap a dot for an explanation.

### Fixed

- Long scene conditions and scope names now wrap inside the card on narrow and
  mobile screens, instead of overflowing and pushing the toggle and menu off the
  right edge.

## [0.24.0] - 2026-06-21

### Fixed

- Scene updates sensor is now filterable in the Home Assistant logbook.
