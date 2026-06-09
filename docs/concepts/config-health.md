# Config health

Ambience validates your configuration automatically and surfaces problems as Home Assistant **Repairs** issues. The checks run on startup, whenever you change a scope, and whenever an entity is added or removed — so an issue appears as soon as a problem is introduced and clears as soon as it is fixed.

---

## Repairs issues

Open **Settings → Repairs** in Home Assistant to see any active issues. Ambience raises a Repairs issue for each of the following problems.

### Missing entity

> **Ambience: a scene references a missing entity**

A scene refers to an entity that does not exist — either in a condition (an entity Ambience monitors to decide which scene wins) or in an action (an entity Ambience tries to control).

Common causes: a typo in the entity id, or an entity that was deleted or renamed after the scene was saved.

To resolve it, open the scene in the Ambience editor, correct or remove the reference, and save. The issue clears automatically once all references are valid.

### Action overlap

> **Ambience: an entity is controlled by multiple groups**

The same entity appears in the actions of scenes in more than one scope group. For example, two categories in the same area both control `light.living_room`, or an area scene and the House scene both target it.

When two groups act on the same entity independently, they can fight each other: one group applies a state, the other applies a different state, and the entity ends up toggling or stuck in a no-op loop.

To resolve it, decide which group should own the entity and remove it from the actions of the other group.

Both issue types are **warnings** — they do not stop Ambience from running. They clear automatically once the underlying problem is fixed.

---

## Trace: "not found" vs "unavailable"

In the [Traces viewer](../tips-and-testing.md#traces--why-a-scene-won), a condition that references an entity shows one of two states when the entity cannot be used:

- **not found** — the entity id does not resolve to any state. This means the entity does not exist at evaluation time: it was deleted, renamed, or not yet loaded.
- **unavailable** — the entity exists but its current value cannot be used (the device is offline, the integration is starting up, and so on).

The distinction helps you tell a configuration error (not found) from a transient device issue (unavailable).
