# Config health

Ambience validates your configuration automatically and surfaces problems as
Home Assistant **Repairs** issues. The checks run on startup, whenever you
change a scope, and whenever an entity is added or removed — so an issue appears
as soon as a problem is introduced and clears as soon as it is fixed.

______________________________________________________________________

## Repairs issues

Open **Settings → Repairs** in Home Assistant to see any active issues. Ambience
raises a Repairs issue for each of the following problems.

### Missing entity

> **Ambience: a scene references a missing or disabled entity**

A scene refers to an entity that does not exist, or that exists but has been
**disabled** (for example because its device was disabled) — either in a
condition (an entity Ambience monitors to decide which scene wins) or in an
action (an entity Ambience tries to control).

Common causes: a typo in the entity id, an entity that was deleted or renamed
after the scene was saved, or an entity (or its device) that has since been
disabled.

To resolve it, either re-enable the entity (or its device), or open the scene in
the Ambience editor and correct or remove the reference. The issue clears
automatically once all references are valid.

### Action overlap

> **Ambience: an entity is controlled by multiple groups**

The same entity appears in the actions of scenes in more than one scope group.
For example, two categories in the same area both control `light.living_room`,
or an area scene and the House scene both target it.

When two groups act on the same entity independently, they can fight each other:
one group applies a state, the other applies a different state, and the entity
ends up toggling or stuck in a no-op loop.

To resolve it, decide which group should own the entity and remove it from the
actions of the other group.

### Dangling references

These appear when a scene still points at something you have since deleted or
renamed. The condition or action can never do anything useful, so Ambience flags
it.

| Issue                                              | What it means                                                                                                                  | How to fix it                                                       |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| **scenes reference a deleted time-of-day period**  | A Time of day condition uses a named period that no longer exists.                                                             | Re-create the period, or remove the reference, in the scene editor. |
| **scenes reference a deleted lux range**           | A Lux condition uses a named lux range that no longer exists.                                                                  | Re-create the range, or remove the reference.                       |
| **scenes reference a deleted weather group**       | A Weather condition uses a weather group that no longer exists.                                                                | Re-create the group, or remove the reference.                       |
| **scenes use an action that is no longer exposed** | A scene action calls a service you have removed from **Settings → Actions**. The action is **skipped** when the scene applies. | Re-expose the action, or remove it from the scenes.                 |

### Missing condition prerequisites

Some conditions depend on something being configured globally. If it is missing,
those conditions can never match, so the scenes that use them are effectively
dead.

| Issue                                                                  | What it means                                                                            | How to fix it                                                                                              |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **scenes use a weather condition but no weather entity is configured** | A Weather condition has nothing to read from.                                            | Configure a weather entity on the **Conditions → Weather** settings tab, or remove the weather conditions. |
| **scenes use a workday item but no workday sensor is configured**      | A Day condition uses a `workday` or `holiday` item with no workday sensor set.           | Configure a workday sensor on the **Conditions → Day** settings tab, or remove those items.                |
| **scenes use a workday-calendar item but no calendar is configured**   | A Day condition uses a `first_workday`/`last_workday` item with no workday calendar set. | Configure a workday calendar on the **Conditions → Day** settings tab, or remove those items.              |

Every issue in the tables above — and the missing-entity and action-overlap
issues before them — is a **warning**: they do not stop Ambience from running,
and only **enabled** scenes are checked. Each one clears automatically once the
underlying problem is fixed.

### Damaged configuration file

> **Ambience: the saved configuration could not be read**

Unlike the checks above, this one is an **error**, and it is not about your
scenes: the file Ambience stores its configuration in (`.storage/ambience`)
exists but could not be read, so Ambience started with an empty configuration.

The damaged file is left exactly as it is, so nothing is lost while you recover.
You have two ways forward:

- **Restore it from a backup** and restart Home Assistant.
- **Delete the file and restart** to start fresh. Saving anything from the
    Ambience panel also replaces the file.

This issue is raised only while Ambience is starting up, so it stays visible
until Home Assistant restarts and the file loads cleanly.

______________________________________________________________________

## Trace: "not found" vs "unavailable"

In the
[Traces viewer](../getting-started/step-9-debugging-scenes.md#traces-why-a-scene-won),
a condition that references an entity shows one of two states when the entity
cannot be used:

- **not found** — the entity id does not resolve to any state. This means the
    entity does not exist at evaluation time: it was deleted, renamed, or not
    yet loaded.
- **unavailable** — the entity exists but its current value cannot be used (the
    device is offline, the integration is starting up, and so on).

The distinction helps you tell a configuration error (not found) from a
transient device issue (unavailable).
