# Entity state

Checks the state (or an attribute) of one or more entities, and evaluates to
true or false based on a test you build in the UI.

## How you set it up

The condition is built from one or more individual *tests*. You start by picking
an entity, then choosing **where to look** — either the entity's own state (the
default) or one of its attributes — and then setting a **comparison** and a
**value**.

**Comparison operators for text states:**

| Operator | Meaning                                       |
| -------- | --------------------------------------------- |
| is       | the value matches one of the states you list  |
| is not   | the value matches none of the states you list |

For numeric states and numeric attributes, the UI switches automatically to
numeric operators:

| Operator | Meaning                          |
| -------- | -------------------------------- |
| >        | greater than                     |
| ≥        | at least (greater than or equal) |
| \<       | less than                        |
| ≤        | at most (less than or equal)     |

For an **is** or **is not** test you can list several values — the condition
matches if any one of them applies (so "is on, is playing" behaves like "is on
OR is playing").

You can also set a **For** duration. When you do, the *test* must have stayed
true continuously for at least that long before the condition passes. This is
useful for avoiding brief flickers — for example, requiring that a motion sensor
has been clear for five minutes before a scene takes effect. When the test lists
several states ("is *playing* or *paused*"), the clock keeps running as the
entity flips between those listed states, because set membership never lapsed;
it only resets when the entity moves to a state outside the list.

When a scene needs more than one condition on a single entity state check, you
combine individual conditions into a tree using **AND** and **OR** groups. Use
the **"Wrap in group"** button on any condition to place it inside a new group,
then add sibling conditions to the same group. You can nest groups to arbitrary
depth. Each condition and each group can also be negated with the **NOT** toggle
on its header — turning it on inverts the result of that condition or group.

!!! info "📷 Screenshot"

    State expression builder showing two conditions combined in an AND group, with
    the For duration picker visible.

## Example

**The projector is on**

Pick the projector's media player entity, leave "Where" set to *State*, set
Comparison to *is*, and type `on` in the value field. The condition passes
whenever the projector is on.

**Temperature is below 18 °C**

Pick a temperature sensor entity, leave "Where" set to *State*, set Comparison
to *\<*, and enter `18` as the threshold. The condition passes whenever the
sensor reads below 18.

**Nobody home for at least five minutes**

Pick each person entity in turn and set each one to *is not home*. Wrap them in
an **AND** group so all must be away simultaneously. Set the **For** duration to
5 minutes on each condition so brief GPS drift does not trigger the scene.
