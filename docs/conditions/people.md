# People

Checks who is, or is not, at home or in a named zone.

## How you set it up

When you add a People condition to a scene, the editor shows three controls in
sequence: a **scope** dropdown, an **is at / is not at** toggle, and a
**location** dropdown. An optional **for** duration sits below them.

### Choosing a scope

The first dropdown sets whose presence is checked. It has six options:

| Option | Meaning |
|---|---|
| **Everybody** | Every tracked person must be at the chosen location. |
| **Anybody** | At least one tracked person must be at the chosen location. |
| **Nobody** | No tracked person must be at the chosen location. |
| **Any of:** | At least one person you tick must be at the chosen location. |
| **All of:** | Every person you tick must be at the chosen location. |
| **None of:** | None of the people you tick must be at the chosen location. |

The first three options apply to your whole household — anyone Home Assistant
tracks as a `person` entity. The last three reveal a checklist of your tracked
people so you can limit the test to specific individuals. When you switch to
one of those modes, all people start ticked; untick anyone you want to exclude.

### Choosing a direction and location

Beneath the scope dropdown, two controls form a single sentence:

- **Is at / Is not at** — a dropdown that lets you invert the test. This toggle
  is hidden when the scope is **Nobody** or **None of:**, because combining a
  negative scope with "Is not at" would produce a confusing double negative; for
  those modes the direction is always "is at".
- **Location** — a dropdown populated from your HA zones. **Home** is always
  the first entry. Any other zone you have configured (Work, School, and so on)
  follows it.

Combining scope and direction gives you expressions such as:

- *Everybody / Is at / Home* — the whole household is home.
- *Anybody / Is not at / Home* — at least one person is away.
- *Nobody / (is at) / Home* — the house is empty.
- *Any of: Alice, Bob / Is at / Work* — Alice or Bob (or both) are at work.

### Requiring it to have been true for a duration

Below the location row is a **for** duration field (hours, minutes, seconds).
When set, the condition only matches if the location test has been continuously
true for at least that long. This prevents a scene from firing the moment
someone briefly crosses a zone boundary, which can happen when a phone wanders
in and out of a geofence.

Leave the duration at zero (the default) to match immediately on any location
change.

## Example

**Empty room — lights off.** Suppose you want a scene that turns off the living
room lights whenever nobody is home. You create a scene called "Away", add a
People condition, set the scope to **Nobody**, leave the location as **Home**,
and leave the duration at zero. Because Nobody hides the is-at/is-not-at toggle,
the condition reads simply: nobody is at Home. Place this scene below any
scene that should fire while people are present and it will catch the empty-house
case.

**Evening scene — someone home after dark.** For a "Cosy evening" scene you want
at least one person in the house. You add a People condition set to **Anybody /
Is at / Home**. Combined with a Time of day condition set to **Evening**, the
scene fires when the sun is down and the house is not empty. If you want the
scene to settle before triggering — to avoid it firing while someone is still on
their way in — you could set the **for** duration to, say, five minutes.

!!! info "📷 Screenshot"
    The People condition editor in the scene editor, showing the scope dropdown
    open with Everybody, Anybody, Nobody, Any of:, All of:, and None of: listed;
    below it the "Is at" / "Is not at" dropdown set to "Is at"; and a zone
    dropdown set to "Home". A for duration field shows 0 hours, 0 minutes,
    0 seconds.
