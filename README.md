<div align="center">

# MIRAINOVA — Official Pterodactyl v2 Theme Collection

**Exquisite Visual Mastery & High-Octane Aesthetics for Next-Gen Game Server Panels**

[![Website](https://img.shields.io/badge/Official_Web-theme.mirainova.web.id-c91e2e?style=for-the-badge)](https://theme.mirainova.web.id)
[![Vercel Deployment](https://img.shields.io/badge/Vercel_Live-mirainova--landing--page.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://mirainova-landing-page.vercel.app)
[![Pterodactyl](https://img.shields.io/badge/Pterodactyl-v2.0.0--beta.2%2B_ONLY-c8a464?style=for-the-badge)](#%EF%B8%8F-critical-compatibility-notice-pterodactyl-v20-only)
[![Instagram](https://img.shields.io/badge/Instagram-%40bisarianbisaryan-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/bisarianbisaryan/)
[![Email](https://img.shields.io/badge/Email-riantosee%40gmail.com-0e1015?style=for-the-badge&logo=gmail&logoColor=white)](mailto:riantosee@gmail.com)

<br />

<img src="screenshots/ada-wong-ui/04-admin-themes-desktop.png" alt="MIRAINOVA Themes Showcase" width="100%" />

</div>

---

## ⚠️ Critical Compatibility Notice (Pterodactyl v2.0+ ONLY)

> **[!IMPORTANT]**
> **Are legacy Pterodactyl versions (`v1.x` / `v1.11.x` and older) supported?**
> **NO — LEGACY PTERODACTYL v1.x IS NOT SUPPORTED.**
>
> Every theme in this repository (**Ada Wong UI**, **Shorekeeper UI**, **Luna Bliss UI**, **Mirai Glassmo**, and **G-Take UI**) is engineered exclusively on top of the **Pterodactyl v2 Extension & Theme System** (`.pteroext` archive format, `@pterodactyl/sdk`, and Tailwind CSS v4 tokens).
> Legacy Pterodactyl `v1.x` panels rely on monolithic Blade templates + Laravel Mix (Webpack) and **do not possess the `.pteroext` extension loader** or the `php artisan p:extension:install` and `php artisan p:theme:activate` CLI commands.

| Panel Version / Environment | Compatibility Status | Technical Explanation |
| :--- | :---: | :--- |
| **Pterodactyl `v2.0.0-beta.2+`** | ✅ **FULLY SUPPORTED** | Native `.pteroext` installer & hot-swappable theme engine |
| **Pterodactyl `v2.x` (Dev Branch)** | ✅ **FULLY SUPPORTED** | Full compatibility with Artisan CLI & Admin Themes UI |
| **Pterodactyl `v1.11.x` (Legacy)** | ❌ **NOT SUPPORTED** | Incompatible DOM architecture (Monolithic Blade + Webpack) |
| **Pterodactyl `v1.0 – v1.10`** | ❌ **NOT SUPPORTED** | Lacks `p:extension:install` & v2 theme token system |
| **Blueprint v1 Framework** | ❌ **INCOMPATIBLE** | Packages use the official Pterodactyl v2 `.pteroext` format |

---

## 📦 Theme Editions Catalog & Direct Downloads

All production-ready `.pteroext` packages are available directly inside the [`downloads/`](./downloads/) directory:

| # | Theme Name | Theme ID | Version | Visual Paradigm & Key Highlights | `.pteroext` Package | Source Code |
| :-: | :--- | :--- | :---: | :--- | :---: | :---: |
| **01** | **Ada Wong UI** | `ada-wong-ui` | `v1.1.0` | *Classified Tactical Noir & Crimson Silk* — 4-corner gold targeting reticles on every card, chamfered polygon buttons, 3px crimson laser accents, embedded dual-artwork Ada Wong backdrops. | [📥 Download `.pteroext`](./downloads/ada-wong-ui-1.1.0.pteroext) | [`themes/ada-wong-ui`](./themes/ada-wong-ui) |
| **02** | **Shorekeeper UI** | `shorekeeper-ui` | `v1.2.0` | *Editorial Night Cinema & Starlight Cyan* — Refined Cormorant Garamond serif headings, vertical gradient glass cards fading into the night canvas, luminous cyan capsule buttons. | [📥 Download `.pteroext`](./downloads/shorekeeper-ui-1.2.0.pteroext) | [`themes/shorekeeper-ui`](./themes/shorekeeper-ui) |
| **03** | **Luna Bliss UI** | `luna-bliss-ui` | `v1.1.0` | *Classic 2001 Desktop Tribute* — Glossy royal-blue Luna taskbar, warm `#f6f4ea` dialog cards with rounded blue title bars, 3D beveled green Start buttons, and rolling green Bliss meadow (100% trademark-safe). | [📥 Download `.pteroext`](./downloads/luna-bliss-ui-1.1.0.pteroext) | [`themes/luna-bliss-ui`](./themes/luna-bliss-ui) |
| **04** | **Mirai Glassmo** | `mirai-glassmo` | `v1.2.0` | *Minimalist Dark Glassmorphism* — Pure dark frosted glass with 18px Gaussian backdrop blur, restrained lavender and cyan accents, and an ultra-lightweight 8 KB package footprint. | [📥 Download `.pteroext`](./downloads/mirai-glassmo-1.2.0.pteroext) | [`themes/mirai-glassmo`](./themes/mirai-glassmo) |
| **05** | **G-Take UI** | `gtake-ui` | `v1.0.0` | *Midnight Cobalt Glassmorphism* — Modeled after G.Take modern productivity dashboards. Deep obsidian-navy canvas, electric cobalt blue glowing accents, frosted floating cards, and streamlined capsule controls. | [📥 Download `.pteroext`](./downloads/gtake-ui-1.0.0.pteroext) | [`themes/gtake-ui`](./themes/gtake-ui) |

---

## 🚀 Step-by-Step Installation Guide (Pterodactyl v2)

Installing any MIRAINOVA theme takes seconds via the native Pterodactyl v2 Artisan CLI—no manual frontend compilation (`npm` / `yarn` build) is required on your production server.

### Step 1 — Navigate to Your Pterodactyl v2 Root Directory
```bash
cd /var/www/pterodactyl
```

### Step 2 — Download or Upload the `.pteroext` Package
Upload your chosen `.pteroext` file from [`downloads/`](./downloads/) via SFTP/SCP, or clone this repository directly onto your server:
```bash
git clone https://github.com/riantosee/Ptero---Theme.git /tmp/mirainova-themes
```

### Step 3 — Install the Theme Extension via Artisan CLI
Run `p:extension:install` for the theme(s) you wish to install:
```bash
# Install Ada Wong UI
php artisan p:extension:install /tmp/mirainova-themes/downloads/ada-wong-ui-1.1.0.pteroext

# Install Shorekeeper UI
php artisan p:extension:install /tmp/mirainova-themes/downloads/shorekeeper-ui-1.2.0.pteroext

# Install Luna Bliss UI
php artisan p:extension:install /tmp/mirainova-themes/downloads/luna-bliss-ui-1.1.0.pteroext

# Install Mirai Glassmo
php artisan p:extension:install /tmp/mirainova-themes/downloads/mirai-glassmo-1.2.0.pteroext
```

### Step 4 — Activate the Theme
You can switch themes anytime from the **Web Panel** under **Admin (`⚙️`) &rarr; Themes &rarr; click `Activate`**, or activate directly via terminal:
```bash
# Available theme IDs: ada-wong-ui | shorekeeper-ui | luna-bliss-ui | mirai-glassmo
php artisan p:theme:activate ada-wong-ui

# Clear view & config caches so changes take effect immediately
php artisan view:clear && php artisan config:clear
```

### Additional Management Commands
```bash
# List all installed extensions and themes along with their status
php artisan p:extension:list

# Disable a specific extension if needed
php artisan p:extension:disable <extension-id>
```

---

## 📸 Full Visual Documentation (56 Authentic Screenshots)

Every theme has been thoroughly tested and captured across **7 core panel routes** in both **Desktop (`1440×900`)** and **Mobile (`390×844`)** resolutions using **Mozilla Firefox**. All 56 captures are stored in [`screenshots/`](./screenshots/).

---

### 1. Ada Wong UI (`ada-wong-ui` v1.1.0)
> **Design Direction**: *Classified Tactical Noir & Crimson Silk* — Inspired by covert operative Ada Wong. Pairs deep obsidian surfaces (`#08090d`) with 4-corner gold targeting reticles, chamfered polygon buttons, 3px crimson laser bars (`#e02e40`), and the permanent MIRAINOVA watermark.

#### Desktop Captures (`1440×900`)
| 00 — Login Page (`/auth/login`) | 01 — Server Dashboard (`/`) |
| :---: | :---: |
| ![Ada Wong Login Desktop](screenshots/ada-wong-ui/00-login-desktop.png) | ![Ada Wong Dashboard Desktop](screenshots/ada-wong-ui/01-dashboard-desktop.png) |
| **03 — Admin Overview (`/panel`)** | **04 — Admin Themes Gallery (`/panel/themes`)** |
| ![Ada Wong Admin Overview](screenshots/ada-wong-ui/03-admin-overview-desktop.png) | ![Ada Wong Admin Themes](screenshots/ada-wong-ui/04-admin-themes-desktop.png) |
| **02 — Account Settings (`/account`)** | **05 — Admin Settings (`/panel/settings`)** |
| ![Ada Wong Account Desktop](screenshots/ada-wong-ui/02-account-desktop.png) | ![Ada Wong Settings Desktop](screenshots/ada-wong-ui/05-admin-settings-desktop.png) |

#### Mobile Captures (`390×844`)
<p align="center">
  <img src="screenshots/ada-wong-ui/00-login-mobile.png" width="23%" alt="Ada Wong Login Mobile" />
  <img src="screenshots/ada-wong-ui/01-dashboard-mobile.png" width="23%" alt="Ada Wong Dashboard Mobile" />
  <img src="screenshots/ada-wong-ui/03-admin-overview-mobile.png" width="23%" alt="Ada Wong Admin Mobile" />
  <img src="screenshots/ada-wong-ui/04-admin-themes-mobile.png" width="23%" alt="Ada Wong Themes Mobile" />
</p>

---

### 2. Shorekeeper UI (`shorekeeper-ui` v1.2.0)
> **Design Direction**: *Editorial Night Cinema & Starlight Cyan* — Blends *Cormorant Garamond* editorial serif headings with vertical gradient glass cards that fade seamlessly into the nocturnal artwork and luminous cyan capsule controls.

#### Desktop Captures (`1440×900`)
| 00 — Login Page (`/auth/login`) | 01 — Server Dashboard (`/`) |
| :---: | :---: |
| ![Shorekeeper Login Desktop](screenshots/shorekeeper-ui/00-login-desktop.png) | ![Shorekeeper Dashboard Desktop](screenshots/shorekeeper-ui/01-dashboard-desktop.png) |
| **03 — Admin Overview (`/panel`)** | **04 — Admin Themes Gallery (`/panel/themes`)** |
| ![Shorekeeper Admin Overview](screenshots/shorekeeper-ui/03-admin-overview-desktop.png) | ![Shorekeeper Admin Themes](screenshots/shorekeeper-ui/04-admin-themes-desktop.png) |
| **02 — Account Settings (`/account`)** | **05 — Admin Settings (`/panel/settings`)** |
| ![Shorekeeper Account Desktop](screenshots/shorekeeper-ui/02-account-desktop.png) | ![Shorekeeper Settings Desktop](screenshots/shorekeeper-ui/05-admin-settings-desktop.png) |

#### Mobile Captures (`390×844`)
<p align="center">
  <img src="screenshots/shorekeeper-ui/00-login-mobile.png" width="23%" alt="Shorekeeper Login Mobile" />
  <img src="screenshots/shorekeeper-ui/01-dashboard-mobile.png" width="23%" alt="Shorekeeper Dashboard Mobile" />
  <img src="screenshots/shorekeeper-ui/03-admin-overview-mobile.png" width="23%" alt="Shorekeeper Admin Mobile" />
  <img src="screenshots/shorekeeper-ui/04-admin-themes-mobile.png" width="23%" alt="Shorekeeper Themes Mobile" />
</p>

---

### 3. Luna Bliss UI (`luna-bliss-ui` v1.1.0)
> **Design Direction**: *Classic 2001 Luna Desktop & Bliss Meadow* — Brings back the warmth of the iconic 2001 desktop era with 100% trademark-safe naming. Features a glossy royal-blue Luna taskbar, warm `#f6f4ea` dialog cards, 3D beveled green Start buttons, and a sunlit rolling green meadow.

#### Desktop Captures (`1440×900`)
| 00 — Login Page (`/auth/login`) | 01 — Server Dashboard (`/`) |
| :---: | :---: |
| ![Luna Bliss Login Desktop](screenshots/luna-bliss-ui/00-login-desktop.png) | ![Luna Bliss Dashboard Desktop](screenshots/luna-bliss-ui/01-dashboard-desktop.png) |
| **03 — Admin Overview (`/panel`)** | **04 — Admin Themes Gallery (`/panel/themes`)** |
| ![Luna Bliss Admin Overview](screenshots/luna-bliss-ui/03-admin-overview-desktop.png) | ![Luna Bliss Admin Themes](screenshots/luna-bliss-ui/04-admin-themes-desktop.png) |
| **02 — Account Settings (`/account`)** | **05 — Admin Settings (`/panel/settings`)** |
| ![Luna Bliss Account Desktop](screenshots/luna-bliss-ui/02-account-desktop.png) | ![Luna Bliss Settings Desktop](screenshots/luna-bliss-ui/05-admin-settings-desktop.png) |

#### Mobile Captures (`390×844`)
<p align="center">
  <img src="screenshots/luna-bliss-ui/00-login-mobile.png" width="23%" alt="Luna Bliss Login Mobile" />
  <img src="screenshots/luna-bliss-ui/01-dashboard-mobile.png" width="23%" alt="Luna Bliss Dashboard Mobile" />
  <img src="screenshots/luna-bliss-ui/03-admin-overview-mobile.png" width="23%" alt="Luna Bliss Admin Mobile" />
  <img src="screenshots/luna-bliss-ui/04-admin-themes-mobile.png" width="23%" alt="Luna Bliss Themes Mobile" />
</p>

---

### 4. Mirai Glassmo (`mirai-glassmo` v1.2.0)
> **Design Direction**: *Minimalist Dark Glassmorphism* — High-performance baseline theme featuring an 18px Gaussian backdrop blur, translucent dark glass surfaces, and clean lavender and cyan accents.

#### Desktop Captures (`1440×900`)
| 00 — Login Page (`/auth/login`) | 01 — Server Dashboard (`/`) |
| :---: | :---: |
| ![Mirai Glassmo Login Desktop](screenshots/mirai-glassmo/00-login-desktop.png) | ![Mirai Glassmo Dashboard Desktop](screenshots/mirai-glassmo/01-dashboard-desktop.png) |
| **03 — Admin Overview (`/panel`)** | **04 — Admin Themes Gallery (`/panel/themes`)** |
| ![Mirai Glassmo Admin Overview](screenshots/mirai-glassmo/03-admin-overview-desktop.png) | ![Mirai Glassmo Admin Themes](screenshots/mirai-glassmo/04-admin-themes-desktop.png) |

#### Mobile Captures (`390×844`)
<p align="center">
  <img src="screenshots/mirai-glassmo/00-login-mobile.png" width="23%" alt="Mirai Glassmo Login Mobile" />
  <img src="screenshots/mirai-glassmo/01-dashboard-mobile.png" width="23%" alt="Mirai Glassmo Dashboard Mobile" />
  <img src="screenshots/mirai-glassmo/03-admin-overview-mobile.png" width="23%" alt="Mirai Glassmo Admin Mobile" />
  <img src="screenshots/mirai-glassmo/04-admin-themes-mobile.png" width="23%" alt="Mirai Glassmo Themes Mobile" />
</p>

---

## 🌐 Running the Web Landing Page (`theme.mirainova.web.id`)

This repository also serves directly as the **Official MIRAINOVA Web Landing Page & Interactive 56-Screenshot Inspector** (ready for zero-config deployment on GitHub Pages, Vercel, Netlify, or Cloudflare Pages).

To run the landing page locally:
```bash
node server.js
# Open http://localhost:3000 in your browser
```

---

## 📂 Repository Structure

```text
Ptero---Theme/
├── index.html                  # Official Landing Page (theme.mirainova.web.id)
├── styles.css                  # Editorial dark showcase stylesheet
├── app.js                      # Interactive Spotlight, Carousel & 56-Screenshot Inspector Modal
├── server.js                   # Local static HTTP server (Port 3000)
├── README.md                   # Complete English documentation
├── assets/                     # Character portraits & landing page graphics
├── downloads/                  # Production-ready (.pteroext) packages for Pterodactyl v2
│   ├── ada-wong-ui-1.1.0.pteroext
│   ├── shorekeeper-ui-1.2.0.pteroext
│   ├── luna-bliss-ui-1.1.0.pteroext
│   └── mirai-glassmo-1.2.0.pteroext
├── screenshots/                # 56 authentic screenshots (7 routes × Desktop & Mobile × 4 themes)
│   ├── ada-wong-ui/
│   ├── shorekeeper-ui/
│   ├── luna-bliss-ui/
│   └── mirai-glassmo/
└── themes/                     # Full theme source code (Vite + CSS Tokens)
    ├── ada-wong-ui/
    ├── shorekeeper-ui/
    ├── luna-bliss-ui/
    └── mirai-glassmo/
```

---

## 👤 Creator & Official Attribution (Permanent Watermark)

All themes in this repository are designed and maintained by **MIRAINOVA (Rianto See)**:

- **Official Website**: [https://theme.mirainova.web.id](https://theme.mirainova.web.id)
- **Contact Email**: [riantosee@gmail.com](mailto:riantosee@gmail.com)
- **Official Instagram**: [@bisarianbisaryan](https://www.instagram.com/bisarianbisaryan/)

---

<div align="center">
  <sub>© 2026 <strong>MIRAINOVA</strong> • Theme by MIRAINOVA • <a href="https://theme.mirainova.web.id">theme.mirainova.web.id</a> • <a href="mailto:riantosee@gmail.com">riantosee@gmail.com</a> • <a href="https://www.instagram.com/bisarianbisaryan/">@bisarianbisaryan</a></sub>
</div>
