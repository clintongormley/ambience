# Recipes

Recipes are worked examples of real-world scene setups. Each one starts from
something you might want to happen in your home, shows the **scene group** to
build for it, lays out the **scenes** in the order Ambience evaluates them, and
— most importantly — explains **why** the group is shaped that way.

Unlike [Getting started](../getting-started/index.md), which walks a single
example end to end, recipes are self-contained and focus on the *design* of a
scene group: which scope and category to use, how the scenes cascade, and which
conditions you can safely leave out.

!!! tip "Recipes describe the shape, not your exact entities"

    A recipe names *kinds* of entities ("the lounge lights", "a presence sensor")
    rather than your specific entity IDs. Adapt the scope, category and entity
    choices to your own home as you build the group in the panel.

Each recipe leans on Ambience's **cascade**: within a scene group the scenes are
evaluated **top to bottom** and the **first** one whose conditions all pass
wins. For the full model, see
[Scene priority](../getting-started/step-6-scene-priority.md).

## Available recipes

### Bathroom

- [**Blind**](bathroom/blind.md) — open and close the bathroom blind by time of
    day, and ease it open on bright mornings without overriding a manual
    adjustment.
- [**Extractor fan**](bathroom/fan.md) — turn the extractor fan on when someone
    uses the shower or toilet, and off again once the bathroom has been vacant
    for a while.
- [**Lights**](bathroom/lights.md) — dim the bathroom lights to suit the time of
    day, switch them off when the room is vacant, and drop to 1% at night when
    the adjoining bedroom is in bed mode.
- [**Towel rack**](bathroom/towel-rack.md) — dry the towels after a shower by
    running the heated rack for a couple of hours, even when a second person
    showers before it finishes.

### House

- [**Power Shower**](house/power-shower.md) — run the pump's high-pressure mode
    while someone's in a shower, then bleed the pressure back to normal through
    the garden irrigation once they leave.
