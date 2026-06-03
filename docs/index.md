# Ambience

Ambience is a condition-based scene engine for Home Assistant. You describe scenes for each room and give each one the conditions that should bring it about. Ambience watches your home and applies the best-matching scene automatically.

## The idea in four words

- A **scene** is a named outcome, such as "Movie night". Each scene has a name, the **conditions** that call for it (the "when"), and the **actions** it runs (the "then").
- A **condition** describes when a scene applies, for example a time of day, the weather, or whether anyone is home.
- An **action** is something Ambience does when a scene applies, such as turning on a light or closing the blinds.
- A **scope** is where a scene lives: your whole House, a Floor, or a single Area (room).

Home Assistant already has its own built-in **Scenes**, which are saved snapshots of entity states. Ambience scenes are a different thing: they are conditional, and Ambience chooses between them for you.

Ready to try it? Start with [Getting started](getting-started.md).
