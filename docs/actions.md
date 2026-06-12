# Actions

An **action** is something Ambience does when a scene applies: turn on a light, set a cover position, send a notification, run a script. Each action calls a Home Assistant service, passing it a target (which entities to act on) and any field values the service needs (brightness, colour temperature, and so on).

You can put as many actions in a scene as you like. When the scene wins, Ambience runs all of them.

---

## Exposed actions

Rather than configuring a service from scratch every time you use it in a scene, Ambience uses a layer of reusable templates called **exposed actions**. You set these up once, in **Settings → Actions**, and they then appear in the action picker whenever you edit a scene.

Each exposed action wraps a single Home Assistant service and captures two kinds of per-field setting:

- **Which fields are visible** in the scene editor — these are the fields you expect to vary from scene to scene. When you add the action to a scene, you fill these fields in for that scene.
- **Defaults** — values that are always sent to the service, regardless of what any scene says. A default can accompany a visible field (pre-filling it with a sensible starting value) or it can apply to a hidden field (so the service always receives that value but the per-scene editor never shows it).

The combination is flexible. For example, a `light.turn_on` exposed action might:

- show **brightness** and **colour temperature** as visible fields, so each scene can set its own levels;
- send `transition: 2` as a hidden default, so every scene using this action gets a two-second fade — without needing to configure it each time.

!!! info "📷 Screenshot"
    *The Settings → Actions list, showing several exposed actions with their service ids and configured fields.*

### Setting up an exposed action

1. Go to **Settings → Actions** in the Ambience panel.
2. Click **+ Add action** and pick a Home Assistant service from the searchable picker.
3. Expand the new action card. A list of the service's fields appears, sorted alphabetically.
4. For each field, decide:
   - **Tick the checkbox** next to it to make the field visible in the scene editor. Scenes using this action will see this field and can set their own value.
   - **Set a default** by clicking the *+ Set default* button. Enter a value; this will be sent every time the action runs. You can set a default with or without ticking the checkbox — a hidden field with a default is always sent but never shown in the scene editor.
5. Optionally, give the action a **label** (the text field in the card header). The label appears in the scene editor's action picker to make it easier to tell similar actions apart — for example, "Main lights on" and "Accent lights on" might both wrap `light.turn_on` but target different groups.
6. Optionally, enable **Re-apply periodically** and enter an interval in seconds. This is described in the next section.

Changes are saved automatically as you make them.

You can reorder exposed actions by dragging the handle on the left of each card. The order controls how they appear in the scene editor's action picker.

### Re-apply interval

Some services do not hold their state reliably — a light that gets power-cycled, for instance, or a cover that can be moved manually. The **Re-apply periodically** checkbox lets you tell Ambience to re-run this action at a regular interval (minimum 10 seconds) while the scene stays matched, not only when the scene first applies.

The interval you set here is the default for every scene that uses this action. An individual scene can override it — or disable re-apply for its use of the action entirely — without affecting any other scene.

---

## Using an exposed action in a scene

When you edit a scene, the **Actions** section is where you add what Ambience should do (the "then" of the scene).

1. Click **+ Add action…** in the scene editor.
2. Choose an exposed action from the picker. Only actions you have set up in Settings → Actions appear here.
3. Fill in the **visible fields** — the ones you ticked as visible when you set up the action. Each field shows its name, the appropriate input control (colour picker, number slider, entity selector, and so on), and a hint alongside the label if a default has been set (for example, *Default: 2 seconds*), so you can see what will be sent if you leave the field blank.
4. Set a **target** — the entities this action should act on — if the service requires one. The target picker lists only entities relevant to the current scope (House, Floor, or Area).
5. Save the scene.

When the scene applies, Ambience sends the service call with the values you filled in plus any defaults from the exposed action configuration. If a visible field is left blank in the scene editor, the default (if one was set) is used; the service still receives it.

!!! info "📷 Screenshot"
    *The scene editor's action section, showing a "Main lights on" action with Brightness and Colour temperature fields filled in, and a target set to the living-room lights.*

---

## How actions run

Ambience re-evaluates your scenes continuously. Whenever the winning scene changes — because a condition changes state, the time crosses a boundary, or something else shifts — it applies the new winner's actions immediately.

Which scopes Ambience evaluates is controlled by a toggle switch on each scope row. If you switch a scope off, Ambience stops applying scenes there. See [Scopes & switches](concepts/scopes-and-switches.md) for details.

If you want to test a scene's actions without waiting for its conditions to match, use the **Run actions** option in the scene's action menu. This runs that scene's actions once, independently of the normal evaluation cycle.

---

## Calling Ambience from automations

Everything above happens automatically, but the same machinery is available
to your own automations and scripts via the `ambience.apply_scene` action
(admin-only). You target scopes by area id, floor id, or the `house` flag —
no switch entity is required.

```yaml
# Re-resolve and apply every category in the living room:
action: ambience.apply_scene
data:
  areas: [living_room]

# Apply only the lighting category in the living room, even if the scope is paused:
action: ambience.apply_scene
data:
  areas: [living_room]
  category: [lighting]
  force: true

# Run one named scene directly across a whole floor, skipping condition resolution:
action: ambience.apply_scene
data:
  floors: [ground_floor]
  scene: [Movie night]

# Apply every scope in the house (omit areas/floors/house to target all):
action: ambience.apply_scene
data: {}
```

| Field | Required | Description |
|---|---|---|
| `areas` | No | List of area ids to target. |
| `floors` | No | List of floor ids to target. |
| `house` | No | `true` to target the House scope. |
| `category` | No | Limit the apply to one or more category ids (default: all). |
| `scene` | No | Apply this named scene directly; each scene resolves its own category. |
| `force` | No | Apply even while the scope's toggle is off. |

Omitting `areas`, `floors`, and `house` targets every scope. Without `force`,
the call is a no-op for any scope whose toggle is currently off.
