<div align="center">

# MIRAINOVA — Official Pterodactyl v2 Theme Collection

**Exquisite Visual Mastery & High-Octane Aesthetics for Next-Gen Game Server Panels**

[![Website](https://img.shields.io/badge/Official_Web-theme.mirainova.web.id-c91e2e?style=for-the-badge)](https://theme.mirainova.web.id)
[![Pterodactyl](https://img.shields.io/badge/Pterodactyl-v2.0.0--beta.2%2B_ONLY-c8a464?style=for-the-badge)](#%EF%B8%8F-peringatan-kompatibilitas-penting-v20-only)
[![Instagram](https://img.shields.io/badge/Instagram-%40bisarianbisaryan-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/bisarianbisaryan/)
[![Email](https://img.shields.io/badge/Email-riantosee%40gmail.com-0e1015?style=for-the-badge&logo=gmail&logoColor=white)](mailto:riantosee@gmail.com)

<br />

<img src="screenshots/ada-wong-ui/04-admin-themes-desktop.png" alt="MIRAINOVA Themes Showcase" width="100%" />

</div>

---

## ⚠️ Peringatan Kompatibilitas Penting (Pterodactyl v2.0+ ONLY)

> **[!IMPORTANT]**
> **Apakah tema ini mendukung Pterodactyl versi sebelumnya (v1.x / v1.11.x ke bawah)?**
> **JAWABAN: TIDAK BISA / TIDAK SUPPORT.**
>
> Seluruh tema dalam repositori ini (**Ada Wong UI**, **Shorekeeper UI**, **Luna Bliss UI**, dan **Mirai Glassmo**) dibangun secara eksklusif di atas arsitektur **Pterodactyl Extension & Theme System v2** (`.pteroext`, `@pterodactyl/sdk`, dan Tailwind CSS v4).
> Pterodactyl v1.x menggunakan arsitektur template Blade monolitik + Laravel Mix (Webpack) lama dan **tidak memiliki sistem ekstensi `.pteroext`** maupun perintah `php artisan p:extension:install` / `php artisan p:theme:activate`.

| Versi Panel / Lingkungan | Status Kompatibilitas | Keterangan Teknis |
| :--- | :---: | :--- |
| **Pterodactyl `v2.0.0-beta.2+`** | ✅ **FULLY SUPPORTED** | Dukungan native `.pteroext` & hot-swap theme |
| **Pterodactyl `v2.x` (Dev Branch)** | ✅ **FULLY SUPPORTED** | Kompatibel penuh dengan CLI & Admin Themes UI |
| **Pterodactyl `v1.11.x` (Legacy)** | ❌ **TIDAK SUPPORT** | Beda arsitektur DOM (Blade monolitik + Webpack) |
| **Pterodactyl `v1.0 – v1.10`** | ❌ **TIDAK SUPPORT** | Tidak memiliki sistem ekstensi `p:extension:install` |
| **Blueprint v1 Framework** | ❌ **TIDAK KOMPATIBEL** | Paket menggunakan format resmi `.pteroext` v2 |

---

## 📦 Daftar Edisi Tema (Ediciones) & Unduhan Langsung

Seluruh paket siap pasang (`.pteroext`) tersedia langsung di dalam folder [`downloads/`](./downloads/):

| No | Nama Tema | ID Tema | Versi | Gaya Visual & Karakteristik | Paket `.pteroext` | Kode Sumber |
| :-: | :--- | :--- | :---: | :--- | :---: | :---: |
| **01** | **Ada Wong UI** | `ada-wong-ui` | `v1.1.0` | *Classified Tactical Noir & Crimson Silk* — Siku bidik emas 4-titik (corner reticles), tombol miring chamfered polygon, aksen laser merah 3px, dual-artwork Ada Wong. | [📥 Unduh `.pteroext`](./downloads/ada-wong-ui-1.1.0.pteroext) | [`themes/ada-wong-ui`](./themes/ada-wong-ui) |
| **02** | **Shorekeeper UI** | `shorekeeper-ui` | `v1.2.0` | *Editorial Night Cinema & Starlight Cyan* — Tipografi serif Cormorant Garamond, kartu kaca transparan bergradasi vertikal menyatu ke latar malam, tombol kapsul pill outline. | [📥 Unduh `.pteroext`](./downloads/shorekeeper-ui-1.2.0.pteroext) | [`themes/shorekeeper-ui`](./themes/shorekeeper-ui) |
| **03** | **Luna Bliss UI** | `luna-bliss-ui` | `v1.1.0` | *Classic 2001 Desktop Tribute* — Taskbar biru royal mengilap (glossy Luna bar), kartu dialog krem `#f6f4ea`, tombol Start/Launch hijau 3D, dan padang rumput Bliss (bebas klaim merek). | [📥 Unduh `.pteroext`](./downloads/luna-bliss-ui-1.1.0.pteroext) | [`themes/luna-bliss-ui`](./themes/luna-bliss-ui) |
| **04** | **Mirai Glassmo** | `mirai-glassmo` | `v1.2.0` | *Minimalist Dark Glassmorphism* — Efek kaca buram gelap murni 18px Gaussian Backdrop Blur dengan aksen lavender lembut dan cyan bersih (ukuran ekstra ringan 8 KB). | [📥 Unduh `.pteroext`](./downloads/mirai-glassmo-1.2.0.pteroext) | [`themes/mirai-glassmo`](./themes/mirai-glassmo) |

---

## 🚀 Cara Instalasi Theme di Pterodactyl v2

Instalasi tema MIRAINOVA dilakukan secara instan melalui CLI `artisan` Pterodactyl v2 tanpa perlu melakukan kompilasi ulang (`npm`/`yarn` build) di server produksi Anda.

### Langkah 1 — Masuk ke Direktori Pterodactyl v2
```bash
cd /var/www/pterodactyl
```

### Langkah 2 — Unduh atau Unggah File `.pteroext`
Anda dapat mengunggah file `.pteroext` dari folder [`downloads/`](./downloads/) ke VPS melalui SFTP/SCP, atau mengunduhnya langsung dari repositori ini:
```bash
# Contoh mengunduh seluruh paket tema dari repositori GitHub
git clone https://github.com/riantosee/Ptero---Theme.git /tmp/mirainova-themes
```

### Langkah 3 — Pasang Ekstensi Tema via Artisan CLI
Jalankan perintah `p:extension:install` untuk tema yang ingin Anda pasang:
```bash
# Pasang Ada Wong UI
php artisan p:extension:install /tmp/mirainova-themes/downloads/ada-wong-ui-1.1.0.pteroext

# Pasang Shorekeeper UI
php artisan p:extension:install /tmp/mirainova-themes/downloads/shorekeeper-ui-1.2.0.pteroext

# Pasang Luna Bliss UI
php artisan p:extension:install /tmp/mirainova-themes/downloads/luna-bliss-ui-1.1.0.pteroext

# Pasang Mirai Glassmo
php artisan p:extension:install /tmp/mirainova-themes/downloads/mirai-glassmo-1.2.0.pteroext
```

### Langkah 4 — Aktifkan Tema
Anda dapat mengaktifkan tema melalui **Web Panel** di menu **Admin (`⚙️`) &rarr; Themes &rarr; klik tombol `Activate`**, atau langsung melalui terminal:
```bash
# Pilih salah satu ID tema: ada-wong-ui | shorekeeper-ui | luna-bliss-ui | mirai-glassmo
php artisan p:theme:activate ada-wong-ui

# Bersihkan cache view & config agar perubahan langsung diterapkan
php artisan view:clear && php artisan config:clear
```

### Perintah Manajemen Tambahan
```bash
# Melihat daftar seluruh ekstensi dan tema yang terpasang beserta statusnya
php artisan p:extension:list

# Menonaktifkan ekstensi tertentu jika diperlukan
php artisan p:extension:disable <extension-id>
```

---

## 📸 Dokumentasi Visual Lengkap (56 Tangkapan Layar Asli)

Seluruh tema telah diuji dan didokumentasikan secara menyeluruh pada **7 halaman utama panel** dalam resolusi **Desktop (`1440×900`)** dan **Mobile (`390×844`)** menggunakan **Mozilla Firefox**. Seluruh file tersedia di dalam direktori [`screenshots/`](./screenshots/).

---

### 1. Ada Wong UI (`ada-wong-ui` v1.1.0)
> **Konsep Desain**: *Classified Tactical Noir & Crimson Silk* — Terinspirasi dari agen rahasia Ada Wong. Menggunakan palet obsidian gelap (`#08090d`), siku bidik emas 4-sudut pada setiap kartu, tombol chamfered polygon, aksen laser merah crimson (`#e02e40`), dan watermark permanen MIRAINOVA.

#### Tampilan Desktop (`1440×900`)
| 00 — Login Page (`/auth/login`) | 01 — Server Dashboard (`/`) |
| :---: | :---: |
| ![Ada Wong Login Desktop](screenshots/ada-wong-ui/00-login-desktop.png) | ![Ada Wong Dashboard Desktop](screenshots/ada-wong-ui/01-dashboard-desktop.png) |
| **03 — Admin Overview (`/panel`)** | **04 — Admin Themes Gallery (`/panel/themes`)** |
| ![Ada Wong Admin Overview](screenshots/ada-wong-ui/03-admin-overview-desktop.png) | ![Ada Wong Admin Themes](screenshots/ada-wong-ui/04-admin-themes-desktop.png) |
| **02 — Account Settings (`/account`)** | **05 — Admin Settings (`/panel/settings`)** |
| ![Ada Wong Account Desktop](screenshots/ada-wong-ui/02-account-desktop.png) | ![Ada Wong Settings Desktop](screenshots/ada-wong-ui/05-admin-settings-desktop.png) |

#### Tampilan Mobile (`390×844`)
<p align="center">
  <img src="screenshots/ada-wong-ui/00-login-mobile.png" width="23%" alt="Ada Wong Login Mobile" />
  <img src="screenshots/ada-wong-ui/01-dashboard-mobile.png" width="23%" alt="Ada Wong Dashboard Mobile" />
  <img src="screenshots/ada-wong-ui/03-admin-overview-mobile.png" width="23%" alt="Ada Wong Admin Mobile" />
  <img src="screenshots/ada-wong-ui/04-admin-themes-mobile.png" width="23%" alt="Ada Wong Themes Mobile" />
</p>

---

### 2. Shorekeeper UI (`shorekeeper-ui` v1.2.0)
> **Konsep Desain**: *Editorial Night Cinema & Starlight Cyan* — Menggabungkan tipografi serif *Cormorant Garamond*, kartu kaca transparan bergradasi vertikal yang memudar halus ke latar ilustrasi malam, serta tombol kapsul (*pill outline*) berpendar cyan.

#### Tampilan Desktop (`1440×900`)
| 00 — Login Page (`/auth/login`) | 01 — Server Dashboard (`/`) |
| :---: | :---: |
| ![Shorekeeper Login Desktop](screenshots/shorekeeper-ui/00-login-desktop.png) | ![Shorekeeper Dashboard Desktop](screenshots/shorekeeper-ui/01-dashboard-desktop.png) |
| **03 — Admin Overview (`/panel`)** | **04 — Admin Themes Gallery (`/panel/themes`)** |
| ![Shorekeeper Admin Overview](screenshots/shorekeeper-ui/03-admin-overview-desktop.png) | ![Shorekeeper Admin Themes](screenshots/shorekeeper-ui/04-admin-themes-desktop.png) |
| **02 — Account Settings (`/account`)** | **05 — Admin Settings (`/panel/settings`)** |
| ![Shorekeeper Account Desktop](screenshots/shorekeeper-ui/02-account-desktop.png) | ![Shorekeeper Settings Desktop](screenshots/shorekeeper-ui/05-admin-settings-desktop.png) |

#### Tampilan Mobile (`390×844`)
<p align="center">
  <img src="screenshots/shorekeeper-ui/00-login-mobile.png" width="23%" alt="Shorekeeper Login Mobile" />
  <img src="screenshots/shorekeeper-ui/01-dashboard-mobile.png" width="23%" alt="Shorekeeper Dashboard Mobile" />
  <img src="screenshots/shorekeeper-ui/03-admin-overview-mobile.png" width="23%" alt="Shorekeeper Admin Mobile" />
  <img src="screenshots/shorekeeper-ui/04-admin-themes-mobile.png" width="23%" alt="Shorekeeper Themes Mobile" />
</p>

---

### 3. Luna Bliss UI (`luna-bliss-ui` v1.1.0)
> **Konsep Desain**: *Classic 2001 Luna Desktop & Bliss Meadow* — Menghadirkan kembali kehangatan era desktop tahun 2001 tanpa menggunakan merek dagang Windows. Menampilkan taskbar biru royal mengilap (*glossy Luna bar*), jendela kartu krem `#f6f4ea`, tombol hijau 3D, dan lanskap padang rumput hijau di bawah langit biru cerah.

#### Tampilan Desktop (`1440×900`)
| 00 — Login Page (`/auth/login`) | 01 — Server Dashboard (`/`) |
| :---: | :---: |
| ![Luna Bliss Login Desktop](screenshots/luna-bliss-ui/00-login-desktop.png) | ![Luna Bliss Dashboard Desktop](screenshots/luna-bliss-ui/01-dashboard-desktop.png) |
| **03 — Admin Overview (`/panel`)** | **04 — Admin Themes Gallery (`/panel/themes`)** |
| ![Luna Bliss Admin Overview](screenshots/luna-bliss-ui/03-admin-overview-desktop.png) | ![Luna Bliss Admin Themes](screenshots/luna-bliss-ui/04-admin-themes-desktop.png) |
| **02 — Account Settings (`/account`)** | **05 — Admin Settings (`/panel/settings`)** |
| ![Luna Bliss Account Desktop](screenshots/luna-bliss-ui/02-account-desktop.png) | ![Luna Bliss Settings Desktop](screenshots/luna-bliss-ui/05-admin-settings-desktop.png) |

#### Tampilan Mobile (`390×844`)
<p align="center">
  <img src="screenshots/luna-bliss-ui/00-login-mobile.png" width="23%" alt="Luna Bliss Login Mobile" />
  <img src="screenshots/luna-bliss-ui/01-dashboard-mobile.png" width="23%" alt="Luna Bliss Dashboard Mobile" />
  <img src="screenshots/luna-bliss-ui/03-admin-overview-mobile.png" width="23%" alt="Luna Bliss Admin Mobile" />
  <img src="screenshots/luna-bliss-ui/04-admin-themes-mobile.png" width="23%" alt="Luna Bliss Themes Mobile" />
</p>

---

### 4. Mirai Glassmo (`mirai-glassmo` v1.2.0)
> **Konsep Desain**: *Minimalist Dark Glassmorphism* — Desain baseline berkinerja tinggi dengan efek 18px Gaussian Backdrop Blur, permukaan kaca gelap transparan, serta aksen lavender dan cyan yang bersih.

#### Tampilan Desktop (`1440×900`)
| 00 — Login Page (`/auth/login`) | 01 — Server Dashboard (`/`) |
| :---: | :---: |
| ![Mirai Glassmo Login Desktop](screenshots/mirai-glassmo/00-login-desktop.png) | ![Mirai Glassmo Dashboard Desktop](screenshots/mirai-glassmo/01-dashboard-desktop.png) |
| **03 — Admin Overview (`/panel`)** | **04 — Admin Themes Gallery (`/panel/themes`)** |
| ![Mirai Glassmo Admin Overview](screenshots/mirai-glassmo/03-admin-overview-desktop.png) | ![Mirai Glassmo Admin Themes](screenshots/mirai-glassmo/04-admin-themes-desktop.png) |

#### Tampilan Mobile (`390×844`)
<p align="center">
  <img src="screenshots/mirai-glassmo/00-login-mobile.png" width="23%" alt="Mirai Glassmo Login Mobile" />
  <img src="screenshots/mirai-glassmo/01-dashboard-mobile.png" width="23%" alt="Mirai Glassmo Dashboard Mobile" />
  <img src="screenshots/mirai-glassmo/03-admin-overview-mobile.png" width="23%" alt="Mirai Glassmo Admin Mobile" />
  <img src="screenshots/mirai-glassmo/04-admin-themes-mobile.png" width="23%" alt="Mirai Glassmo Themes Mobile" />
</p>

---

## 🌐 Menjalankan Web Landing Page (`theme.mirainova.web.id`)

Repositori ini juga berfungsi langsung sebagai **Web Landing Page & Interactive 56-Screenshot Documentation Showcase** (siap di-deploy ke GitHub Pages, Vercel, Netlify, atau Cloudflare Pages).

Untuk menjalankan secara lokal di komputer Anda:
```bash
# Menggunakan server Node.js bawaan di repositori ini
node server.js
# Buka http://localhost:3000 di browser Anda
```

---

## 📂 Struktur Repositori

```text
Ptero---Theme/
├── index.html                  # Halaman utama Landing Page (theme.mirainova.web.id)
├── styles.css                  # Stylesheet editorial bertema gothic dark showcase
├── app.js                      # Logika interaktif Spotlight, Carousel & Modal 56 Screenshot
├── server.js                   # Server HTTP statis lokal (port 3000)
├── README.md                   # Dokumentasi lengkap repositori
├── assets/                     # Artwork karakter & aset grafis landing page
├── downloads/                  # Paket siap pasang (.pteroext) untuk Pterodactyl v2
│   ├── ada-wong-ui-1.1.0.pteroext
│   ├── shorekeeper-ui-1.2.0.pteroext
│   ├── luna-bliss-ui-1.1.0.pteroext
│   └── mirai-glassmo-1.2.0.pteroext
├── screenshots/                # 56 tangkapan layar asli (7 halaman × Desktop & Mobile × 4 tema)
│   ├── ada-wong-ui/
│   ├── shorekeeper-ui/
│   ├── luna-bliss-ui/
│   └── mirai-glassmo/
└── themes/                     # Source code lengkap masing-masing tema (Vite + CSS Tokens)
    ├── ada-wong-ui/
    ├── shorekeeper-ui/
    ├── luna-bliss-ui/
    └── mirai-glassmo/
```

---

## 👤 Kreator & Informasi Resmi (Permanent Watermark)

Seluruh tema di dalam repositori ini dirancang dan dikembangkan oleh **MIRAINOVA (Rianto See)**:

- **Official Website**: [https://theme.mirainova.web.id](https://theme.mirainova.web.id)
- **Email Kontak**: [riantosee@gmail.com](mailto:riantosee@gmail.com)
- **Instagram Resmi**: [@bisarianbisaryan](https://www.instagram.com/bisarianbisaryan/)

---

<div align="center">
  <sub>© 2026 <strong>MIRAINOVA</strong> • Theme by MIRAINOVA • <a href="https://theme.mirainova.web.id">theme.mirainova.web.id</a> • <a href="mailto:riantosee@gmail.com">riantosee@gmail.com</a> • <a href="https://www.instagram.com/bisarianbisaryan/">@bisarianbisaryan</a></sub>
</div>
