# Mirai Glassmo

**A Clearer View of Your Servers.**

A high-contrast dark Pterodactyl Panel v2 theme with a glass console, layered midnight surfaces, lavender-to-cyan accents, crisp navigation, and tuned terminal colors.

## Installed release

Mirai Glassmo **v1.2.0** is active on the connected Panel. Refresh the browser without cache (`Ctrl+F5`) to fetch the new theme stylesheet.

Ready-to-install Panel extension archive: [mirai-glassmo-1.2.0.pteroext](./mirai-glassmo-1.2.0.pteroext).

## Social, AI, and notifications

**Mirai Social v1.5.1** adds per-server subscription terms and console countdowns, expiry-triggered suspension that preserves files, reseller grants restricted to servers they own, root-admin broadcasts, and scoped integration API keys. It retains private user-to-user chat, AI, notifications, profile photos, and the Glassmo interface.

Ready-to-install extension archive: [mirai-social-1.5.1.pteroext](./mirai-social-1.5.1.pteroext). Full source and API notes: [social-extension/README.md](./social-extension/README.md).

## Server eggs

The panel now has the generic Node.js and Python eggs from the Pterodactyl community catalog. Unused eggs were removed. The Forge Minecraft egg remains because one existing server uses it; Panel blocks deleting an egg while a server is attached to it. Remove or migrate that server first to leave only Node.js and Python.

To configure AI, a root administrator opens **Admin → Extensions → Mirai Social** and sets the API endpoint URL, API format (Responses or Chat Completions), exact model ID, and provider API key. The default assistant instructions keep replies in English. The key is stored encrypted by the panel and stays on the server. AI remains off until configured; provider usage may incur charges on the key's project.

## Theme source

`pterodactyl-theme/` contains the CSS-only Panel v2 extension source. It uses `extension.json`, `src/theme.css`, and `src/tokens.css`, and was built against the SDK bundled with Panel 2.0.0-beta.2. The install archive contains the compiled runtime files.

The current release, including the mobile layout pass, is active and passed the panel checks:

```text
p:extension:doctor — manifest, compatibility, autoload directories and build passed
p:extension:list — mirai-glassmo v1.2.0 enabled
p:theme:list — mirai-glassmo active (extends classic)
```

To restore the built-in theme, run from `/var/www/pterodactyl`:

```bash
php artisan p:theme:reset
```

## Visual changes

- Deep navy page atmosphere with restrained violet and cyan light, and a fine technical grid.
- Frosted server navigation with distinct active and hover states.
- Layered glass cards, stronger headings, clear focus rings, and polished controls.
- Console terminal framing, improved command field, and legible ANSI colors.
- Responsive spacing, reduced-motion support, and reduced-transparency fallback.

The theme styles the Panel, while Mirai Social uses authenticated extension API routes and its own private-message table. Authentication, permissions, server controls, terminal, files, and core API behavior remain owned by Pterodactyl.

## Standalone preview

`index.html`, `styles.css`, and `app.js` are a separate responsive prototype with demo-labelled server data. It does not connect to the Panel or control servers.








