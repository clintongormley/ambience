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

Changes are saved automatically as you make them.

You can reorder exposed actions by dragging the handle on the left of each card. The order controls how they appear in the scene editor's action picker.

---

## Built-in actions

Alongside Home Assistant's own services, Ambience provides a few **built-in
actions** that are smarter than a plain service call. They appear in the
**Settings → Actions** picker like any other service (search for "Ambience").

**Turn on / Turn off** — added for you by default. A single cross-domain on/off
that targets any mix of supported entities (lights, switches, fans, input
booleans, and more) and skips any entity that is already in the target state, so
scenes don't fire redundant commands. If you don't want them, delete them in
Settings → Actions — they won't come back.

**Safe cover actions** — added for you by default on new installs. (If you set
Ambience up before these became defaults, add them from the picker when you need
them; like Turn on / Turn off, any you delete won't come back.)

- **Open cover (safe)** / **Close cover (safe)** — open or close the targeted
  covers, but skip any that are already fully open / fully closed.
- **Set cover position (safe)** / **Set cover tilt (safe)** — move the targeted
  covers to a position (or tilt), skipping any already there.

The "safe" variants read each cover's current position before acting, so a cover
that is already where you want it never receives a command — avoiding the relay
*click* some covers make when told to open while already open. A cover that is
mid-travel, or whose state can't be read, is always commanded.

---

## Using an exposed action in a scene

When you edit a scene, the **Actions** section is where you add what Ambience should do (the "then" of the scene).

1. Click **+ Add action…** in the scene editor.
2. Choose an exposed action from the picker. Only actions you have set up in Settings → Actions appear here.
3. Fill in the **visible fields** — the ones you ticked as visible when you set up the action. Each field shows its name, the appropriate input control (colour picker, number slider, entity selector, and so on), and a hint alongside the label if a default has been set (for example, *Default: 2 seconds*), so you can see what will be sent if you leave the field blank.
4. Set a **target** — the entities this action should act on — if the service requires one. See [Action targets](#action-targets) for the full details on entity/device/area/label selection and how targets are resolved.
5. Save the scene.

When the scene applies, Ambience sends the service call with the values you filled in plus any defaults from the exposed action configuration. If a visible field is left blank in the scene editor, the default (if one was set) is used; the service still receives it.

---

## Action targets

The **target** of an action tells Ambience which entities to act on when the scene applies. You can target by:

- **Entity** — pick one or more specific entities directly.
- **Device** — target all entities belonging to one or more devices.
- **Area** — target all entities in one or more areas.
- **Label** — target all entities that carry one or more HA labels.

These work exactly like HA automation targets: you can mix and match selectors in a single target (for example, two areas plus one specific entity), and HA's native chip picker is used — so autocomplete and domain filtering work as you'd expect.

### Scope-constrained resolution

Ambience resolves the target **live, at apply time**, using the entities currently registered in Home Assistant. The resolution is also **scope-constrained**: indirect selectors (device, area, label) are intersected with the entities that belong to the scene's scope (House, Floor, or Area), so an area-targeted action in a living-room scene only acts on the living-room's entities even if the label spans the whole house.

**Directly-named entity targets are forwarded unchanged.** If you name a specific entity by entity id, it is sent to the service as-is — Ambience does not clip it to the scene's scope. This is a deliberate choice: if you pick an entity directly, you mean exactly that entity.

The scene editor shows a live count below the target picker — for example, **→ resolves to 3 entities in Living Room** — so you can see immediately how many entities a target will act on. A warning is shown when the count is zero.

### Same entity in two actions (last-write-wins)

Two actions in the same scene can target the same entity. When they do, both service calls are sent; whichever arrives last wins. The config-health overlap warning still flags entities that are controlled by more than one *(scope, category)* group, as contradictory commands across groups can still cause flickering.

### Config-health warnings for targets

The [Config health](concepts/scopes-and-switches.md) Repairs page flags two target-related problems:

- **Action overlap** — an entity is acted on by more than one scene in different *(scope, category)* combinations. Last-write-wins applies, but the conflict is flagged so you can decide whether it is intentional.
- **Target resolves to nothing** (`target_empty`) — an action has a non-empty target that resolves to zero entities in the scene's scope at check time. The action will be silently skipped when the scene applies. Common causes: the label is empty, the area has no entities of the right domain, or the target refers to a device that has been removed.

!!! info "📷 Screenshot"
    *The scene editor's action section, showing a "Main lights on" action with Brightness and Colour temperature fields filled in, and a target set to the living-room lights.*

### Apply on every match

At the bottom of a scene's **Actions** section is an **Apply on every match** toggle.

- **Off** (default) — when the scene becomes the winner for its scope/category, Ambience runs its actions once. While it stays the winner, repeated re-evaluations are suppressed (debounced), so the actions are not re-sent.
- **On** — Ambience re-runs the scene's actions every time the scope/category is re-evaluated while this scene is still the winner. Turn it on when you want the scene to keep re-asserting its state — for example, to counteract another integration that keeps changing a light.

This is independent of the global **Re-run all scenes after inactivity** setting (Settings → Advanced), which periodically re-applies every unit's winning scene regardless of this toggle.

---

## How actions run

Ambience re-evaluates your scenes continuously. Whenever the winning scene changes — because a condition changes state, the time crosses a boundary, or something else shifts — it applies the new winner's actions immediately.

Which scopes Ambience evaluates is controlled by a toggle switch on each scope row. If you switch a scope off, Ambience stops applying scenes there. See [Scopes & switches](concepts/scopes-and-switches.md) for details.

If you want to test a scene's actions without waiting for its conditions to match, use the **Run actions** option in the scene's action menu. This runs that scene's actions once, independently of the normal evaluation cycle.
