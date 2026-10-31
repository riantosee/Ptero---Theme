# Shorekeeper UI

**Guiding Your Servers Through Starlight.**

An editorial luxury night-cinema theme for Pterodactyl Panel v2 inspired by Shorekeeper (Wuthering Waves) and classic high-contrast editorial exhibition layouts.

## Release & Archive

- **Theme ID**: `shorekeeper-ui`
- **Version**: `1.1.0`
- **Ready-to-install Extension Archive**: [`shorekeeper-ui-1.1.0.pteroext`](./shorekeeper-ui-1.1.0.pteroext)
- **Extends**: `classic`

## Visual & Design Philosophy (v1.1.0)

- **Multi-Device Responsive Shorekeeper Artwork**:
  - **Landscape / Desktop / Tablet**: Full-bleed wide Shorekeeper illustration (`assets/shorekeeper-wide.jpg`) with cinema vignette and starlight glow.
  - **Portrait / Mobile (`max-aspect-ratio: 4/5`)**: Automatically switches to the vertical portrait Shorekeeper artwork (`assets/shorekeeper-portrait.jpg`) so the character composition stays centered and uncropped on phones.
- **Editorial Serif & Modern Sans Pairing**: High-contrast `Cormorant Garamond` display serif headings paired with clean `Outfit` UI typography and wide-tracked uppercase labels (`letter-spacing: 0.16em`).
- **Editorial Hairline Frame**: Subtle 1px full-viewport framing rules (`rgba(222, 236, 255, 0.14)`) that structure the header, navigation, and content canvas like an exhibition layout.
- **Bottom-Fading Gradient Glass Cards**: Cards are clear and airy near the top (`rgba(16, 26, 52, 0.34)`) so the background artwork shines through, and gradually deepen toward the bottom (`rgba(4, 8, 19, 0.92)`) for crisp text legibility.
- **Outlined Pill Controls**: Signature rounded pill buttons (`border-radius: 999px`) with luminous starlight borders (`1px solid rgba(236, 244, 255, 0.78)`).

## Compatibility & Safety Guarantee

- **Separate & Isolated**: Shorekeeper UI is completely isolated in its own package and ID. It does not overwrite, delete, disable, or modify **Mirai Glassmo** or **Mirai Social**.
- **Extension Coexistence**: Mirai Social retains its chat routes, database tables, quick floating button, notifications, and administrator features.
- **Instant Switching**: Both `mirai-glassmo` and `shorekeeper-ui` can remain installed simultaneously. Switching between them takes one command without reinstalling.

## Installation on the Panel

1. Copy `shorekeeper-ui-1.1.0.pteroext` to the VM (e.g. into `/tmp/`):
   ```bash
   scp -P 2222 outputs/shorekeeper-ui/shorekeeper-ui-1.1.0.pteroext rian@127.0.0.1:/tmp/
   ```

2. From `/var/www/pterodactyl` on the Ubuntu VM, install and enable the extension:
   ```bash
   sudo php artisan p:extension:install /tmp/shorekeeper-ui-1.1.0.pteroext --enable --replace
   ```

3. Activate Shorekeeper UI:
   ```bash
   sudo php artisan p:theme:activate shorekeeper-ui
   ```

4. Refresh your browser without cache (`Ctrl + F5` or `Cmd + Shift + R`).

## Switching & Rollback

- **Switch to Mirai Glassmo**:
  ```bash
  sudo php artisan p:theme:activate mirai-glassmo
  ```

- **Revert to Classic Theme**:
  ```bash
  sudo php artisan p:theme:reset
  ```

- **List All Installed Themes**:
  ```bash
  sudo php artisan p:theme:list
  ```

## Standalone Preview

Open `index.html` in any modern web browser to interact with the responsive visual mockup, test status filtering, search servers, and preview modal dialogs.
