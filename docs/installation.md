# Installation

## Requirements

Ambience requires **Home Assistant 2024.1.0 or newer**.

---

## HACS (recommended)

[HACS](https://hacs.xyz/) is the most straightforward way to install Ambience, and it handles future updates automatically.

1. In HACS, open the three-dot menu and choose **Custom repositories**.
2. Paste the repository URL and set the category to **Integration**, then click **Add**.
3. Search for **Ambience** in HACS and install it.
4. Restart Home Assistant.
5. Go to **Settings → Devices & Services → Add Integration** and search for *Ambience*.
6. Follow the setup prompts to complete the configuration.

!!! info "📷 Screenshot"
    The Add Integration dialog with "Ambience" typed in the search box.

---

## Manual installation

If you prefer not to use HACS, you can install the integration by hand.

1. Download or clone this repository.
2. Copy the `custom_components/ambience/` directory into your Home Assistant configuration directory so that it sits at `config/custom_components/ambience/`.
3. Restart Home Assistant.
4. Go to **Settings → Devices & Services → Add Integration**, search for *Ambience*, and follow the setup prompts.

---

## Opening Ambience

Once the integration has been added, an **Ambience** entry appears in the Home Assistant sidebar. The panel is visible to admin users only.

!!! info "📷 Screenshot"
    The Home Assistant sidebar with the Ambience entry highlighted.

If you would prefer not to have the sidebar entry, you can turn it off in the integration's options. Go to **Settings → Devices & Services**, find the Ambience integration, and open its **Configure** dialog. The **Show sidebar panel** option is enabled by default; uncheck it to remove the sidebar entry.

As an alternative to the sidebar, you can add the **Ambience card** to any dashboard. The card provides the same interface and is useful if you want to embed Ambience within an existing dashboard layout rather than giving it a dedicated panel. You add it like any other card, through the dashboard editor.
