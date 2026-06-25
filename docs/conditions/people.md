# People

Checks who is, or is not, at home or in a named zone.

## How you set it up

When you add a People condition to a scene, the editor shows three controls in
sequence: a **scope** dropdown, an **is at / is not at** toggle, and a
**location** dropdown. An optional **for** duration sits below them.

### Choosing a scope

The first dropdown sets whose presence is checked. It has six options:

| Option        | Meaning                                                      |
| ------------- | ------------------------------------------------------------ |
| **Everybody** | Every tracked person must be at the chosen location.         |
| **Anybody**   | At least one tracked person must be at the chosen location.  |
| **Nobody**    | No tracked person must be at the chosen location.            |
| **Any of:**   | At least one person you tick must be at the chosen location. |
| **All of:**   | Every person you tick must be at the chosen location.        |
| **None of:**  | None of the people you tick must be at the chosen location.  |

The first three options apply to your whole household — anyone Home Assistant
tracks as a `person` entity. The last three reveal a checklist of your tracked
people so you can limit the test to specific individuals. When you switch to one
of those modes, all people start ticked; untick anyone you want to exclude.

### Choosing a direction and location

Beneath the scope dropdown, two controls form a single sentence:

- **Is at / Is not at** — a dropdown that lets you invert the test. This toggle
    is hidden when the scope is **Nobody** or **None of:**, because combining a
    negative scope with "Is not at" would produce a confusing double negative;
    for those modes the direction is always "is at".
- **Location** — a dropdown populated from your HA zones. **Home** is always the
    first entry. Any other zone you have configured (Work, School, and so on)
    follows it.

Combining scope and direction gives you expressions such as:

- *Everybody / Is at / Home* — the whole household is home.
- *Anybody / Is not at / Home* — at least one person is away.
- *Nobody / (is at) / Home* — the house is empty.
- *Any of: Alice, Bob / Is at / Work* — Alice or Bob (or both) are at work.

### Requiring it to have been true for a duration

Below the location row is a **for** duration field (hours, minutes, seconds).
When set, the condition only matches if the location *test* has been
continuously true for at least that long. Because it tracks the test rather than
the exact zone, a "nobody home" duration keeps counting when a person moves
between two away zones (work to the shops) — "not home" never stopped being true
— and only resets when someone actually comes home. This prevents a scene from
firing the moment someone briefly crosses a zone boundary, which can happen when
a phone wanders in and out of a geofence.

Leave the duration at zero (the default) to match immediately on any location
change.

______________________________________________________________________

Next: [Script](script.md).
