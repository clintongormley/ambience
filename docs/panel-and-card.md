# The panel and the card

Ambience gives you one interface — the scene manager — that you can use in two
places: as a dedicated **sidebar panel**, or as a **card** on any dashboard. Both
provide the same controls, so pick whichever suits how you like to work.

## The panel

Once you have added the integration, an **Ambience** entry appears in the Home
Assistant sidebar. The panel is visible to **administrator users only** — Home
Assistant hides it from non-admin users. If you are an admin and the entry does
not appear, hard-refresh the HA web UI (Ctrl-F5 / Cmd-Shift-R).

### Showing or hiding the panel

Whether the sidebar entry is shown is the integration's **only** configuration
option. Go to **Settings → Devices & Services**, find the Ambience integration,
and open its **Configure** dialog.

!!! info "📷 Screenshot"

    The Ambience **Configure** dialog, showing the **Show sidebar panel** option.

**Show sidebar panel** is enabled by default. Uncheck it to remove the sidebar
entry — handy if you would rather reach Ambience only through a dashboard card.

## The card

You can add the **Ambience card** to any dashboard. The card provides the same
interface as the panel, and is useful if you want to embed Ambience within an
existing dashboard layout rather than giving it a dedicated sidebar panel. You
add it like any other card, through the dashboard editor.
