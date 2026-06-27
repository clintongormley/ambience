# Apply on every match

When any condition specified in a scene group changes from true to false or vice
versa, it triggers a reassessment of all scenes in the scene group. The winning
scene might be the same scene that won the previous time. In that case, we don't
usually want to reapply its actions as nothing will have changed in the interim.

In fact, often we want to be able to make manual changes and **not** have
Ambience override them every time a trigger fires. For instance, perhaps I want
to close a blind manually, and I don't want Ambience to open it again two
seconds later.

In certain circumstances, however, we **do** want the actions to be reapplied on
every match. For instance, imagine a Power Shower function which we switch on
when somebody is in the shower and the water is flowing. We can create a scene
such as this:

![Power shower on when somebody is showering.](../images/actions/apply-on-every-match/power-shower-1.png "Power shower on when somebody is showering.")

But the Power Shower has an internal timer which switches it off automatically
every 5 minutes. That automatic off-switch is outside our control. To Ambience
it looks like our _"Power Shower on"_ scene is still winning, but in reality the
power shower has been turned off.

We can solve this in two steps:

1. We want to include state of the Power Shower switch as a trigger, so we add
    it as a clause which matches on both **On** and **Off** into the entity
    state condition.
1. Turn the Action's **Apply on every match** toggle to **On**.

![Apply on every match.](../images/actions/apply-on-every-match/power-shower-2.png "Apply on every match.")

This way, the scene will match when somebody is in the shower and the water is
flowing, **and** will turn the Power Shower back on whenever it turns itself
off. The built-in **Turn on** action has a safeguard in place so that it will
not try to turn the Power Shower on if it is already on.

!!! note "Rerun all scenes after inactivity"

    This is independent of the global **Re-run all scenes after inactivity** setting
    (Settings → Advanced), which periodically re-applies every unit's winning scene
    regardless of this toggle.

______________________________________________________________________

Next: [How actions run](how-actions-run.md).
