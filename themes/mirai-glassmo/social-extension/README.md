# Mirai Social

An account-area extension for Pterodactyl Panel v2. It provides private user-to-user messages, unread-message notifications, browser desktop alerts, administrator role identity effects, and an AI assistant with an administrator-configurable API provider.

## Install on this panel

Copy `mirai-social-1.5.1.pteroext` to the Ubuntu VM, then install it from `/var/www/pterodactyl`:

```bash
php artisan p:extension:install /path/to/mirai-social-1.5.1.pteroext --enable --replace
```

Reload the panel. The account menu shows **Mirai Social**. The extension migration creates its private message table; foreign keys remove messages when either user is deleted.

## Configure the AI provider

As a panel root administrator, open **Admin → Extensions → Mirai Social** and configure:

- **Enable AI assistant** and **Provider API key**.
- **AI API endpoint**, the full HTTPS URL for the provider endpoint (default: `https://api.openai.com/v1/responses`).
- **AI API format**, selecting **Responses API** or **Chat Completions API** to match that endpoint.
- **AI model ID**, using the exact model identifier supported by the provider.
- **AI instructions**, which default to English-first assistant behavior.

The API key is stored encrypted by panel extension settings and never sent to client browsers. Endpoints must use public HTTPS on port 443; redirects, credentials in the URL, query strings, literal IP addresses, and private or reserved destinations are rejected. Set a provider-side usage limit because AI usage may incur charges. Requests run through the panel backend, are limited to six per minute per account, and conversation history is not persisted in the extension database.

## Behavior and privacy

- Private one-to-one chat; each API query is scoped to the authenticated sender and recipient.
- Inbox refreshes every four seconds and an open conversation refreshes every three seconds. Unread messages are marked read when that conversation is opened.
- Desktop notifications require the user to grant browser permission using the bell button. The unread list also works without desktop permission.
- Root administrators receive a gold badge and restrained animated identity glow. Other users do not receive elevated styling.
- The AI receives only the current request and the latest short in-browser exchange. Messages are rendered as plain text.
- No core login, server-control, file, permission, or API behavior is replaced.
- The mobile interface switches between a people list and one active conversation, with touch-sized controls and support for device safe areas. Focusing a message field enters a keyboard-aware composition layout that reserves the visible viewport for the conversation and composer. Long messages wrap safely; AI replies display headings, lists, inline emphasis, and code blocks. The floating quick-access button is mounted in the panel shell and stays available across dashboard, account, server, and admin pages. It stays pinned to the bottom-right safe area and opens Messages or AI Assistant.
- The messaging screen uses a familiar messenger layout with a searchable conversation list, circular profile photos, clear message bubbles, and a compact composer. Users can upload or remove their JPEG, PNG, or WebP profile photo (up to 2 MB) from **Account → Overview**. Uploaded images are stored privately and shown to authenticated panel users in conversations.

## Server terms, resellers, and broadcasts

Only a root administrator can grant reseller rights from **Mirai Social → Admin**. Resellers can set or renew a server term only when they own that server. The console shows a live countdown and the expiration timestamp. A term can be set from 1 to 3650 days, or renewed by adding that many days to the later of the current expiry and now. On expiry the panel suspends the server through Pterodactyl's server suspension action. Server files and databases are preserved. Renewing a server suspended by this expiry system restores it; a server suspended manually stays suspended. The panel scheduler checks each minute and retries failed suspend or restore actions.

Root administrators can publish an announcement to all signed-in panel users, review and remove announcements, and grant or revoke reseller access. Users see global announcements in **Mirai Social → Alerts** and can mark them read. Browser routes use the Panel's authenticated session and normal CSRF protections; programmatic routes require the scoped bearer keys described below.

### Scoped API keys

The **Application API Keys** page in Pterodactyl creates broad panel-level credentials. Mirai Social integrations use separate, scoped keys from **Mirai Social → Admin → Scoped integration keys**. A root admin issues a key to themselves or an authorized reseller, chooses its scopes, and receives the secret once. Only its SHA-256 hash is stored. Revoke a compromised key from the same admin screen. Reseller keys cannot publish broadcasts and term changes remain limited to servers owned by that reseller.

Send the key in `Authorization: Bearer mso_…`. Do not put it in browser code, URLs, screenshots, or client-side applications. Server-to-server integrations should keep it in a secret store and use HTTPS. API requests are limited to 60 per minute per source IP.

| Scope | Permission |
| --- | --- |
| `server-terms:read` | Read a server term. |
| `server-terms:write` | Set a term from now. |
| `server-terms:renew` | Add days to a server term. |
| `broadcasts:read` | Read active announcements. |
| `broadcasts:write` | Create or delete announcements; root-admin keys only. |

Use the same API paths shown below, prefixed with `/api/extensions/mirai-social/v1`. Server IDs in these token routes are the numeric Panel server IDs. For example:

```http
GET /api/extensions/mirai-social/v1/servers/12/term
Authorization: Bearer mso_your-secret
```

### API routes

| Method and path | Access | Purpose |
| --- | --- | --- |
| `GET /api/client/servers/{server}/extensions/mirai-social/term` | User with access to that server | Read expiry, suspension state, and `can_manage`. |
| `PUT /api/client/servers/{server}/extensions/mirai-social/term` | Root admin, or authorized reseller who owns the server | Set `{"duration_days":30}` from now. |
| `POST /api/client/servers/{server}/extensions/mirai-social/term/renew` | Root admin, or authorized reseller who owns the server | Add `{"duration_days":30}` to the current unexpired expiry, or to now if expired. |
| `GET /api/client/extensions/mirai-social/broadcasts` | Signed-in user | List current announcements and each user's `read_at`. |
| `POST /api/client/extensions/mirai-social/broadcasts/{id}/read` | Signed-in user | Mark that announcement read. |
| `GET /api/admin/extensions/mirai-social/resellers-broadcasts` | Root admin | List reseller grants and announcements. |
| `POST /api/admin/extensions/mirai-social/resellers` | Root admin | Grant by `{"username":"name"}`. |
| `DELETE /api/admin/extensions/mirai-social/resellers/{userId}` | Root admin | Revoke reseller access. |
| `POST /api/admin/extensions/mirai-social/broadcasts` | Root admin | Publish `{"title":"…","body":"…","expires_at":null}`. |
| `DELETE /api/admin/extensions/mirai-social/broadcasts/{id}` | Root admin | Remove an announcement. |
| `GET /api/admin/extensions/mirai-social/api-keys` | Root admin browser session | List active key metadata; secrets are never returned. |
| `POST /api/admin/extensions/mirai-social/api-keys` | Root admin browser session | Create a scoped key with `{"username":"reseller","name":"Bot","scopes":["server-terms:read"]}`. The secret is returned once. |
| `DELETE /api/admin/extensions/mirai-social/api-keys/{id}` | Root admin browser session | Revoke a key immediately. |

| Method and path | Required bearer scope |
| --- | --- |
| `GET /api/extensions/mirai-social/v1/servers/{serverId}/term` | `server-terms:read` |
| `PUT /api/extensions/mirai-social/v1/servers/{serverId}/term` | `server-terms:write` |
| `POST /api/extensions/mirai-social/v1/servers/{serverId}/term/renew` | `server-terms:renew` |
| `GET /api/extensions/mirai-social/v1/broadcasts` | `broadcasts:read` |
| `POST` or `DELETE /api/extensions/mirai-social/v1/broadcasts[/{id}]` | `broadcasts:write` |

Term duration is restricted to 1–3650 days. The Panel's server-scoped API middleware checks server access; the extension applies an additional owner and reseller-grant check before a term change. Broadcast bodies are plain text and limited to 10,000 characters.

## Build and inspect

Place the extension in `/var/www/pterodactyl/extensions/mirai-social`; its `file:../../packages/sdk` dependency resolves to the SDK bundled in the panel source. Run `npm install --legacy-peer-deps`, then from the panel root:

```bash
php artisan p:extension:doctor extensions/mirai-social
php artisan p:extension:dev extensions/mirai-social --enable
php artisan p:extension:pack extensions/mirai-social
```




