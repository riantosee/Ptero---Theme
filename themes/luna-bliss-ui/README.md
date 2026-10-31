# Luna Bliss UI

**Classic 2001 Luna Desktop & Bliss Meadow.**

A nostalgic, trademark-safe Y2K / 2001 Luna desktop theme for Pterodactyl Panel v2. Engineered with glossy Royal Blue window chrome, a 3D Green Launch Pill, Explorer-style left task pane, warm Luna cream dialog surfaces (`#f6f4ea`), and a multi-device Bliss meadow wallpaper.

## Release & Archive

- **Theme ID**: `luna-bliss-ui`
- **Version**: `1.0.0`
- **Ready-to-install Extension Archive**: [`luna-bliss-ui-1.0.0.pteroext`](./luna-bliss-ui-1.0.0.pteroext)
- **Extends**: `classic`

## Visual & Design Philosophy

- **Trademark-Safe Nostalgic Identity**: Named **Luna Bliss UI** (`luna-bliss-ui`) with zero proprietary OS trademarks.
- **Glossy 3D Royal Blue Taskbar & Green Launch Pill**:
  - Top bar features the classic multi-stop 3D Royal Blue glossy gradient (`#4993fe` → `#2258d1` → `#113188`).
  - Brand button styled as the iconic **3D Glossy Green Launch Pill** with italic bold white text and drop shadow.
- **Explorer Blue Left Task Pane**:
  - Sidebar uses the classic periwinkle-to-cobalt task pane gradient with creamy white task cards (`#143a82` text) and a Royal Blue + Warm Amber active state (`#f8b334`).
- **Luna Framed Dialog Windows**:
  - Cards feature rounded top window corners (`8px 8px 5px 5px`), a `2px solid #0048c4` Royal Blue frame, a 7px glossy blue top titlebar rim (with a coral-red close-box accent on the top right), warm cream dialog body (`#f6f4ea`), and high-contrast dark navy ink (`#0f203c`).
- **Tactile 3D Controls & Sunken Inputs**:
  - Secondary buttons use the classic pebble-cream 3D bevel gradient with the signature **Luna Warm Amber inner hover ring (`#f8b334`)**.
  - Form inputs use crisp white sunken textboxes (`border: 1px solid #7f9db9`).
- **Multi-Device Bliss Meadow Wallpaper**:
  - **Landscape / Desktop / Tablet**: Full-bleed wide Bliss meadow (`assets/luna-bliss-wide.jpg`).
  - **Portrait / Mobile (`@media (max-aspect-ratio: 4/5)`)**: Automatically switches to a portrait-centered crop (`assets/luna-bliss-portrait.jpg`) so the rolling green hill crest and cloud formations frame mobile screens naturally.

## Compatibility & Safety Guarantee

- **Separate & Isolated**: Installed under its own ID (`luna-bliss-ui`). Does not overwrite, disable, or alter **Mirai Glassmo**, **Shorekeeper UI**, **Ada Wong UI**, or **Mirai Social**.
- **Instant Switching**: Switch between `luna-bliss-ui`, `ada-wong-ui`, `shorekeeper-ui`, and `mirai-glassmo` at any time with a single command.

## Installation on the Panel

1. Copy `luna-bliss-ui-1.0.0.pteroext` to the VM (e.g. into `/tmp/`):
   ```bash
   scp -P 2222 outputs/luna-bliss-ui/luna-bliss-ui-1.0.0.pteroext rian@127.0.0.1:/tmp/
   ```

2. From `/var/www/pterodactyl` on the Ubuntu VM, install and enable the extension:
   ```bash
   sudo php artisan p:extension:install /tmp/luna-bliss-ui-1.0.0.pteroext --enable --replace
   ```

3. Activate Luna Bliss UI:
   ```bash
   sudo php artisan p:theme:activate luna-bliss-ui
   ```

4. Refresh your browser without cache (`Ctrl + F5` or `Cmd + Shift + R`).
