# Actions

An **action** is something Ambience does when a scene is applied, for example:
turn on a light, set a cover position, send a notification, or run a script.
Each action calls a Home Assistant service, passing it a **target** (which
entities to act on) and any parameters the service needs (brightness, colour
temperature, cover position, and so on).

You can put as many actions in a scene as you like. When the scene wins,
Ambience runs all of them.

## In this section

| Page                                            | What it covers                                                          |
| ----------------------------------------------- | ----------------------------------------------------------------------- |
| [Exposed actions](exposed-actions.md)           | Reusable service templates with visible fields and defaults.            |
| [Built-in actions](built-in-actions.md)         | Ambience's smarter on/off and safe cover actions.                       |
| [Using an action in a scene](using-actions.md)  | Adding an action, picking a target, and filling in its visible fields.  |
| [Apply on every match](apply-on-every-match.md) | Re-asserting a scene's actions on every re-evaluation, with an example. |
| [How actions run](how-actions-run.md)           | When actions fire, and the execution model behind them.                 |

______________________________________________________________________

Next: [Exposed actions](exposed-actions.md).
