# Ada Wong UI

**Classified Tactical Noir & Crimson Silk.**

A tactical espionage HUD and crimson-noir theme for Pterodactyl Panel v2 inspired by Ada Wong (Resident Evil). Engineered to look completely distinct from both *Mirai Glassmo* and *Shorekeeper UI*.

## Release & Archive

- **Theme ID**: `ada-wong-ui`
- **Version**: `1.0.0`
- **Ready-to-install Extension Archive**: [`ada-wong-ui-1.0.0.pteroext`](./ada-wong-ui-1.0.0.pteroext)
- **Extends**: `classic`

## Visual & Design Philosophy

- **Classified Tactical HUD Architecture**:
  - **4-Corner Targeting Reticles & Left Crimson Laser Bar**: Cards use razor-sharp `2px` corners (`--radius: 0.18rem`), an asymmetric `3px` Crimson Silk left laser bar (`#d42436`), and Imperial Gold corner targeting reticles (`#d6a656`).
  - **Chamfered Polygon Buttons**: Interactive buttons feature angled bevel corners (`clip-path: polygon(...)`) with a Crimson Silk gradient fill and gold border highlights.
  - **Angular Agency & Monospace Telemetry Typography**: `Chakra Petch` uppercase tactical headings paired with `JetBrains Mono` telemetry labels, badges, tabs, and navigation items.
  - **CRT Micro-Scanlines & Smoked Gunmetal Glass**: Subtle horizontal scanline overlay and smoked obsidian glass (`rgba(13, 10, 12, 0.74)`) with diagonal micro-hatch card headers.
- **Multi-Device Responsive Artwork**:
  - **Landscape / Desktop / Tablet**: Full-bleed widescreen Ada Wong composition (`assets/ada-wong-wide.jpg`) with crimson-gold tactical vignette.
  - **Portrait / Mobile (`@media (max-aspect-ratio: 4/5)`)**: Automatically switches to a portrait-centered crop (`assets/ada-wong-portrait.jpg`) so Ada Wong's face, round glasses, crimson qipao embroidery, and pistol remain centered on phone screens.

## Compatibility & Safety Guarantee

- **Separate & Isolated**: Installed under its own ID (`ada-wong-ui`). Does not overwrite, disable, or alter **Mirai Glassmo**, **Shorekeeper UI**, or **Mirai Social**.
- **Instant Switching**: Switch between `ada-wong-ui`, `shorekeeper-ui`, and `mirai-glassmo` at any time with a single command.

## Installation on the Panel

1. Copy `ada-wong-ui-1.0.0.pteroext` to the VM (e.g. into `/tmp/`):
   ```bash
   scp -P 2222 outputs/ada-wong-ui/ada-wong-ui-1.0.0.pteroext rian@127.0.0.1:/tmp/
   ```

2. From `/var/www/pterodactyl` on the Ubuntu VM, install and enable the extension:
   ```bash
   sudo php artisan p:extension:install /tmp/ada-wong-ui-1.0.0.pteroext --enable --replace
   ```

3. Activate Ada Wong UI:
   ```bash
   sudo php artisan p:theme:activate ada-wong-ui
   ```

4. Refresh your browser without cache (`Ctrl + F5` or `Cmd + Shift + R`).

## Switching Between Installed Themes

- **Activate Ada Wong UI**:
  ```bash
  sudo php artisan p:theme:activate ada-wong-ui
  ```
- **Activate Shorekeeper UI**:
  ```bash
  sudo php artisan p:theme:activate shorekeeper-ui
  ```
- **Activate Mirai Glassmo**:
  ```bash
  sudo php artisan p:theme:activate mirai-glassmo
  ```
