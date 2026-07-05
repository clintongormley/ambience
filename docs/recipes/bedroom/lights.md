# Bedroom lights

This recipe controls the lighting in the bedroom, where occupancy is determined
by a presence sensor.

!!! note "The disappointment of presence sensors"

    Presence sensors, in spite of their promises, are notoriously unreliable at
    detecting people who are asleep.

    The Aqara FP2 loses people in bed for 15-20 minutes at a time, and the
    Everything Presence Pro is even worse, losing sleeping people for over an hour
    at a time. While presence sensors are very useful at detecting when people enter
    specific zones, they can't be relied upon to keep track of them when still.

    I'm waiting for my bed sensors from
    [Elevated Sensors](https://www.elevatedsensors.com/store) to arrive, which will
    hopefully allow me to tighten up my bedroom scene group. But in the meantime,
    I'm using an Aqara FP2 and lots of time buffers to make sure that we don't get
    woken up by the lights coming on in the middle of the night.

All of the lights should turn on when somebody enters the room for the first
time, the brightness will depend on the time of day. However, if somebody is
already in the room then we shouldn't alter the lighting, especially if that
person is in bed asleep.

At night when the main lights are on, and somebody climbs into bed, we should
turn off all the lights and fade the reading lights down to 10%.

When the occupant wants to go to sleep they can turn the lights of manually or
with voice control. The lights should remain off until they turn them on again
in the morning.

## Requirements

- **Main Bedroom Suite Presence** - an occupancy sensor group which covers the
    main bedroom and the main bathroom.

## Scene: Vacant

When the **Main Bedroom Suite Presence** is clear for 2 minutes, turn off all of
the lights. We use the Suite presence here so that the occupant can go into the
en-suite bathroom without the lights resetting.

![Vacant.](../images/bedroom/lights/vacant.png "Vacant")

## Scenes: Daytime, Evening, Nighttime

We add a scene for **Daytime** (which fades the lights to 60%), **Evening**
(25%), and **Nighttime** (15%).

![Daytime, Evening, and Nighttime.](../images/bedroom/lights/time-of-day.png "Daytime, Evening, and Nighttime.")

The **Nighttime** condition doesn't need a **Time of day** condition because it
comes after the **Daytime** and **Evening** scenes.

## Scene: Block until somebody enters empty room

It is really important that we don't turn the lights on when somebody is asleep
in bed. It is quite possible for the presence sensor to lose track of a person
sleeping in bed, then they turn over, the presence sensor detects them, and
wants to turn the lights on.

To reduce the chance of this happening, we will require that a person must enter
through the **Master Bedroom Entrances** zone (i.e. the doors to the bedroom),
and the **Master Bedroom Presence** must be occupied for less than 10 seconds.

![Block until somebody enters empty room.](../images/bedroom/lights/somebody-enters.png "Block until somebody enters empty room.")

## Scene: Block changes until bed is vacant for 20 minutes

The **Vacant** scene only has a buffer of 2 minutes of vacancy. While we want
the lights to turn off soon after somebody leaves the room, the presence sensor
could easily lose somebody reading in bed after 2 minutes and turn the lights
off.

To prevent this we'll add a blocker that prevents any actions until the bed has
been vacant for at least 20 minutes:

![Block changes until bed is vacant for 20 minutes.](../images/bedroom/lights/bed-vacant.png "Block changes until bed is vacant for 20 minutes.")

## Scene: Person in bed, reading mode

Finally, when somebody climbs into bed at night, the lights should fade off and
the reading lights should be set to 10%. We can't rely just on the **Main
Bedroom Bed Presence** as it loses sleeping people. When it finds the person
again it would turn the reading lights back on.

Instead, we use the main lights as a gate: we only enter reading mode if the
main lights are still on. Also, we want the occupant to be able to turn the
lights back on in the morning and not have Ambience try to reset reading mode,
so we only enter reading mode when the bed has been occupied for between 45
seconds and one minute:

![Person in bed, reading mode.](../images/bedroom/lights/reading-mode.png "Person in bed, reading mode.")

!!! tip "Apply on every match"

    You may have noticed that the **Person in bed, reading mode** actions are marked
    as **Apply on every match**. The reason for this is that presence sensors are
    not very accurate, so sometimes reading mode is triggered when somebody is near
    the bed and not in the bed. They manually turn the lights back on, and go to the
    bathroom. After 15 minutes, they climb into bed, **Person in bed, reading mode**
    matches, but the lights aren't dimmed because the scene group had blocked on
    **Block changes until bed is vacant for 20 minutes**, and it thinks that reading
    mode has already been applied.

    By enabling **Apply on every match**, reading mode actions will be applied even
    if they have been applied before.

## Lifecycle

| Trigger                                                 | Matched Scene                                    | Action                                            |
| ------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------- |
| Person enters empty room                                | Daytime, Evening, or Nighttime                   | Lights turned on to the appropriate brightness    |
| Person leaves room for 2 minutes                        | Vacant                                           | Lights turned off                                 |
| Person climbs into bed for 45 seconds at 11pm           | Person in bed, reading mode                      | Main lights turned off, reading lights set to 10% |
| Person goes to bathroom                                 | Block changes until bed is vacant for 20 minutes | None                                              |
| Person climbs out of bed and leaves room for 2 minutes  | Block changes until bed is vacant for 20 minutes | None                                              |
| Person climbs out of bed and leaves room for 20 minutes | Vacant                                           | Lights turned off                                 |
| Person turns lights back on then returns to bed         | Person in bed, reading mode                      | Main lights turned off, reading lights set to 10% |
| Person in bed, another person enters                    | Block changes until bed is vacant for 20 minutes | None                                              |
| Person wakes up and turns on lights                     | Block changes until bed is vacant for 20 minutes | None                                              |
