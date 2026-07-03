# Recipes

Recipes are worked examples of real-world scene setups. Each one starts from
something you might want to happen in your home, shows the **scene group** to
build for it, lays out the **scenes** in the order Ambience evaluates them, and —
most importantly — explains **why** the group is shaped that way.

Unlike [Getting started](../getting-started/index.md), which walks a single
example end to end, recipes are self-contained and focus on the *design* of a
scene group: which scope and category to use, how the scenes cascade, and which
conditions you can safely leave out.

!!! tip "Recipes describe the shape, not your exact entities"

    A recipe names *kinds* of entities ("the lounge lights", "a presence
    sensor") rather than your specific entity IDs. Adapt the scope, category and
    entity choices to your own home as you build the group in the panel.

## How to read a recipe

Every recipe follows the same layout:

1. **Goal** — what you want to happen, in one or two sentences.
1. **Scene group** — the scope (area, floor or house) and category to create,
    and why that grouping fits.
1. **The cascade** — a table of the scenes in the group, listed **top to
    bottom** in the order Ambience evaluates them. The first scene whose
    conditions all pass wins.
1. **Why it's shaped this way** — the reasoning behind the order: which scene is
    the specific case, which is the catch-all, and which conditions are left out
    because an earlier scene already guarantees them.
1. **Variations** *(optional)* — small changes and what they do.

## The cascade, briefly

Within one scene group Ambience walks the scenes **from top to bottom** and
applies the **first** one whose conditions all pass. Two consequences every
recipe leans on:

- **Order is priority.** Put the most specific scene first and the catch-all
    last. A broad scene placed above a narrow one would win first, and the narrow
    one could never fire.
- **Earlier scenes narrow the field.** Because a higher scene already handled
    its case, a lower scene can omit the conditions that scene covered — it only
    runs when everything above it failed to match.

For the full model, see
[Scene priority](../getting-started/step-6-scene-priority.md).

## Recipe template

Use this skeleton when writing a recipe:

> **Goal.** One or two sentences describing the desired behaviour.
>
> **Scene group.** Scope: *(area / floor / house — which and why)*. Category:
> *(new or existing — and why)*.
>
> **The cascade.**
>
> | Scene (top → bottom) | When (conditions) | What it does (actions) |
> | --- | --- | --- |
> | *Specific case* | *its conditions* | *its actions* |
> | *Catch-all* | *(none, or a broad guard)* | *its actions* |
>
> **Why it's shaped this way.** Explain the order, the catch-all, and any
> conditions deliberately left out.
>
> **Variations.** *(optional)*

Recipes will be added here as they're written.
