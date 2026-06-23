# Categories

A scope's scenes are evaluated as one list — first-match wins, top to bottom.
That works well when every scene in a room controls the same thing. But what if
you want the lights to dim for a film *and* the blinds to close at sunset, with
neither decision depending on the other?

Categories are how Ambience handles that. They partition a scope's scenes into
independent groups, each of which is resolved separately. A scope can have one
winner per category at the same time.

## How categories work

Every scene belongs to exactly one category. When Ambience evaluates a scope, it
splits the scene list by category and runs each group through the standard
resolution algorithm on its own. The results are independent: a winning scene in
"Lighting" has no bearing on which scene wins in "Blinds".

Within each category, scenes are resolved the same way as always: they are
checked top to bottom, and the first one whose conditions all match is the
winner. See [Scenes & resolution](scenes-and-resolution.md) for a full
explanation of that process.

The important consequence is that *one evaluation pass can produce multiple
winners* — one per category — and all of them act concurrently. Each category's
actions run in parallel with the others.

## A worked example

Suppose you have a living room with two categories: "Lighting" and "Blinds".

**Lighting** scenes, in order:

1. Film mode — *when* the media player is playing → dim the lights to 20 %
1. Evening — *when* the time is after 18:00 → set lights to a warm 60 %
1. Default — no conditions (wildcard) → set lights to full brightness

**Blinds** scenes, in order:

1. Sunset — *when* the sun is below 10° elevation → close the blinds
1. Default — no conditions (wildcard) → open the blinds

When the media player starts at 20:00 and the sun has already set, Ambience
evaluates both categories:

- **Lighting**: scene 1 matches (media player playing) → dim to 20 %.
- **Blinds**: scene 1 matches (sun below 10°) → close the blinds.

Both actions run. The lights dim and the blinds close, each decided by its own
logic. If the media player later stops, only the Lighting category re-evaluates;
the Blinds category is unaffected.

Without categories, you would need a separate scene for every combination of
lighting state and blind state — the list grows quickly and becomes difficult to
maintain.

## The default "General" category

A fresh installation seeds one category called **General** (icon: home, colour:
blue-grey). Every new scene is assigned to General by default, so the
integration works out of the box without any category setup.

General is an ordinary category. You can rename it, change its icon and colour,
and delete it once you have created at least one other category to replace it.

## Managing categories

Categories are created, renamed, and deleted in the Ambience panel's
**Settings** modal (the cogwheel ⚙ icon), on the **Categories** tab. Each
category has a name, an optional icon (any MDI icon name), and an optional
colour swatch to make it easy to distinguish at a glance. Category names must be
unique and cannot be left blank.

You cannot delete the last remaining category, and you cannot delete a category
that still has scenes assigned to it — move or delete those scenes first.

See the [Settings reference](../settings-reference.md) for a full description of
the Categories settings screen.

## The category filter

When you have more than one category, a **Filter by category** dropdown appears
above the scope list in the panel. Selecting a category narrows the view so that
only scenes belonging to that category are shown in every scope. Selecting "All
categories" returns to the full view.

The filter is a display control only. It does not affect which scenes Ambience
evaluates or how it resolves them — all categories are always active. Filtering
is useful when you want to focus on one aspect of your configuration (for
example, reviewing all your "Lighting" scenes across every room) without the
other categories cluttering the view.

When you add a new scene while a single category is selected in the filter, that
category is pre-selected as the scene's category in the editor.

!!! info "📷 Screenshot"

    *Category filter dropdown showing "All categories", "Blinds", and "Lighting"
    options, each with its colour swatch and icon.*
