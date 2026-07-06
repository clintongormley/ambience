# Bedroom Recipes

These recipes cover the automations in our main bedroom suite. A single presence
sensor watches the bedroom and its ensuite bathroom together, telling each
device below whether the suite is occupied or vacant.

Presence sensors are notoriously poor at spotting someone lying still in bed, so
— alongside the time of day and the position of the sun — these recipes lean on
generous time buffers to ride out the gaps.

- [**Blinds**](blinds.md): the window blinds, closed at dusk and opened in the
    morning once the suite has been vacant long enough to trust that nobody's
    still asleep in bed.
- [**Lights**](lights.md): the lights, turned on by time of day when someone
    enters, dropped to reading mode once they get into bed, and buffered against
    flaky presence.
