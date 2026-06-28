# Actions

When a scene wins, Ambience runs its `actions` — a list of HA service calls. This
file explains how they work and how to author them. For the high-level
`ActionSpec` shape see [schema.md](schema.md); for the generated field schemas of
the built-in services see
[action-reference.generated.md](action-reference.generated.md).

## The action shape

```jsonc
{
  "service": "light.turn_on",          // "domain.service"; required; MUST be exposed
  "entity_ids": ["light.living_room"], // the call target
  "params": { "brightness_pct": 40 }   // service field values
}
```

- **`service`** — a `"domain.service"` string (must contain a `.`).
- **`entity_ids`** — the entities the call targets. A list of non-empty entity
  ids. May be empty only for services that need no target. Ambience sends these
  as the call's `target.entity_id`.
- **`params`** — service field name → value (e.g. `brightness_pct`, `color_temp`,
  `position`). May be empty.

## Only EXPOSED services are valid

Ambience deliberately does **not** let scenes call arbitrary HA services. The
user maintains an **exposed actions** list (panel → Configuration → Actions).
Each exposed action pins one service id (e.g. `light.turn_on`) and may define
per-field **defaults** and which fields are user-visible in the editor.

At execution time:

- If a scene action's `service` **is not exposed**, the engine **logs and skips
  it**. The scene still wins; other (exposed) actions still run; the unexposed
  one does nothing. In a trace, such an action is marked `unexposed`.
- So: **only emit actions whose `service` appears in the AI bundle's exposed
  services/actions list.** The bundle also carries each exposed service's field
  schema, telling you which `params` are valid and their types.

## How `params` merge with exposed-action defaults

At execution, the params actually sent are:

```text
sent_params = { ...exposed_action.defaults, ...scene_action.params }
```

That is: the exposed action's **defaults** are applied first, then the scene's
**`params` override** them key-by-key. Consequences:

- You only need to set the `params` you want to differ from the user's defaults.
- A field the user marked as a hidden default (not user-visible) is still applied
  unless your scene `params` override it.
- Extra `params` keys are allowed even if the field isn't in the exposed action's
  visible list — they are still sent. (Validation does not whitelist param keys.)
- HA itself rejects mismatched value types at call time, so use the correct type
  per the bundle's field schema (e.g. `brightness_pct` is an int 0–100).

## Targeting with `entity_ids`

`entity_ids` becomes the call's `target.entity_id`. Use the **real entity ids
from the AI bundle**, scoped to what makes sense for the scene's scope (e.g. an
`area: living_room` scene typically targets that area's lights). There is no
device/area/label targeting in an action — only `entity_ids`.

## The built-in `ambience.*` safe services

The integration ships six "safe" services that read current state and only
command entities that need changing (no redundant relay clicks / flicker). They
are commonly exposed and good defaults for on/off and cover control:

| Service | Fields | Behaviour |
|---|---|---|
| `ambience.turn_on` | — | Turn on, skipping entities already on. Cross-domain. |
| `ambience.turn_off` | — | Turn off, skipping entities already off. Cross-domain. |
| `ambience.cover_safe_open` | — | Open covers, skipping those already open / mid-travel. |
| `ambience.cover_safe_close` | — | Close covers, skipping those already closed / mid-travel. |
| `ambience.cover_safe_set_position` | `position` (int 0–100) | Set cover position, skipping covers already there. |
| `ambience.cover_safe_set_tilt_position` | `tilt_position` (int 0–100) | Set tilt, skipping covers already there. |

> These are only **available** if the user has them exposed (a fresh install
> seeds them). Confirm against the AI bundle before using them.

## Examples

Dim the living-room lights warmly:

```yaml
actions:
  - service: light.turn_on
    entity_ids: [light.living_room]
    params: { brightness_pct: 15, color_temp: 454 }
```

Set a cover to 30% open, only if not already there:

```yaml
actions:
  - service: ambience.cover_safe_set_position
    entity_ids: [cover.lounge_blind]
    params: { position: 30 }
```

Turn several things on at once (one action per service; multiple targets per
action are fine):

```yaml
actions:
  - service: ambience.turn_on
    entity_ids: [light.kitchen, light.hall, switch.coffee]
```

Turn everything in the room off (a "night" or "away" scene):

```yaml
actions:
  - service: ambience.turn_off
    entity_ids: [light.living_room, media_player.tv]
```

A scene with **no actions** is valid — a pure "blocker" that matches (winning its
unit so no lower scene fires) but commands nothing:

```yaml
- name: Do nothing while guests are over
  category: presence
  when:
    people: { who: [person.guest], quant: any, where: home }
  actions: []
```
