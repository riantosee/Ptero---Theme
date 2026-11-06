import os
import base64

ROOT_DIR = r"C:\Users\A\Documents\Codex\2026-10-29\files-pasted-by-the-user-mirai\outputs\mirainova-landing-page"
THEME_DIR = os.path.join(ROOT_DIR, "themes", "gtake-ui")
PTERO_DIR = os.path.join(THEME_DIR, "pterodactyl-theme")
DIST_DIR = os.path.join(PTERO_DIR, "dist")
BG_DIR = os.path.join(PTERO_DIR, "backgrounds")

os.makedirs(DIST_DIR, exist_ok=True)

with open(os.path.join(BG_DIR, "wide.jpg"), "rb") as f:
    wide_b64 = base64.b64encode(f.read()).decode("utf-8")

with open(os.path.join(BG_DIR, "portrait.jpg"), "rb") as f:
    port_b64 = base64.b64encode(f.read()).decode("utf-8")

css_content = f"""/*
 * G-Take UI - v1.0.0
 * Official Modern Productivity Dashboard Theme for Pterodactyl Panel v2
 * Designed by MIRAINOVA (https://theme.mirainova.web.id)
 * Inspired by G.Take Modern Interface
 */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {{
  --gt-art-wide: url('data:image/jpeg;base64,{wide_b64}');
  --gt-art-portrait: url('data:image/jpeg;base64,{port_b64}');

  --font-sans: 'Plus Jakarta Sans', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-display: 'Plus Jakarta Sans', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  --gt-blue-50: #eff6ff;
  --gt-blue-100: #dbeafe;
  --gt-blue-200: #bfdbfe;
  --gt-blue-300: #93c5fd;
  --gt-blue-400: #60a5fa;
  --gt-blue-500: #3b82f6;
  --gt-blue-600: #2563eb;
  --gt-blue-700: #1d4ed8;
  --gt-blue-900: #1e3a8a;

  --gt-navy-deep: #060a14;
  --gt-navy-space: #080d1a;
  --gt-navy-surface: #0b1222;
  --gt-navy-card: rgba(13, 20, 38, 0.74);
  --gt-navy-card-hover: rgba(18, 28, 54, 0.82);

  --gt-border-subtle: rgba(59, 130, 246, 0.18);
  --gt-border-glow: rgba(59, 130, 246, 0.42);
  --gt-border-bright: rgba(96, 165, 250, 0.65);

  --gt-glow-sm: 0 0 14px rgba(59, 130, 246, 0.35);
  --gt-glow-md: 0 0 24px rgba(59, 130, 246, 0.5);
  --gt-glow-lg: 0 0 40px rgba(37, 99, 235, 0.65);

  /* Semantic Variables for Pterodactyl v2 */
  --background: #060a14;
  --foreground: #f8fafc;

  --card: rgba(13, 20, 38, 0.74);
  --card-foreground: #f8fafc;

  --popover: rgba(9, 15, 30, 0.95);
  --popover-foreground: #f8fafc;

  --muted: rgba(22, 33, 62, 0.65);
  --muted-foreground: #94a3b8;

  --accent: rgba(37, 99, 235, 0.22);
  --accent-foreground: #60a5fa;

  --border: rgba(59, 130, 246, 0.22);
  --input: rgba(11, 18, 33, 0.82);
  --ring: #3b82f6;

  --primary: #2563eb;
  --primary-foreground: #ffffff;

  --secondary: rgba(15, 23, 42, 0.8);
  --secondary-foreground: #e2e8f0;

  --success: #22c55e;
  --success-foreground: #ffffff;

  --warning: #f59e0b;
  --warning-foreground: #000000;

  --destructive: #ef4444;
  --destructive-foreground: #ffffff;

  --radius: 1.25rem;
  --radius-pill: 9999px;

  --shadow-sm: 0 4px 14px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 12px 32px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 24px 64px rgba(0, 0, 0, 0.7);

  --scrollbar-thumb: rgba(59, 130, 246, 0.45);
  --scrollbar-thumb-fill: #3b82f6;
}}

/* ==========================================================================
   Full-Bleed Starry Mountain Backdrop & Ambient Canvas
   ========================================================================== */
.dark body {{
  position: relative;
  min-height: 100dvh;
  background-color: #060a14 !important;
  color: var(--foreground) !important;
  font-family: var(--font-sans) !important;
  letter-spacing: -0.01em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}}

.dark body::before {{
  content: '';
  position: fixed;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background-color: #060a14;
  background-image:
    /* Top cosmic vignette */
    linear-gradient(180deg, rgba(6, 10, 20, 0.58) 0%, rgba(8, 14, 28, 0.32) 42%, rgba(6, 10, 20, 0.78) 85%, #060a14 100%),
    /* Radiant electric blue nebula */
    radial-gradient(circle at 50% 12%, rgba(59, 130, 246, 0.22) 0%, rgba(37, 99, 235, 0.08) 45%, transparent 70%),
    /* Ambient horizon dusk aura */
    radial-gradient(circle at 65% 85%, rgba(217, 119, 6, 0.08) 0%, transparent 40%),
    /* Dark alpine mountain starry night artwork */
    var(--gt-art-wide);
  background-size: cover, cover, cover, cover;
  background-position: center, center top, center bottom, center 65%;
  background-repeat: no-repeat;
  filter: brightness(1.08) contrast(1.05) saturate(1.15);
}}

@media (max-aspect-ratio: 4/5) {{
  .dark body::before {{
    background-image:
      linear-gradient(180deg, rgba(6, 10, 20, 0.65) 0%, rgba(8, 14, 28, 0.4) 38%, rgba(6, 10, 20, 0.85) 80%, #060a14 100%),
      radial-gradient(circle at 50% 15%, rgba(59, 130, 246, 0.25) 0%, transparent 65%),
      var(--gt-art-portrait);
    background-size: cover, cover, cover;
    background-position: center, center top, center 40%;
  }}
}}

/* G-Take subtle watermark badge on desktop */
.dark body::after {{
  content: 'G.TAKE MODERN PRODUCTIVITY // MIRAINOVA V2';
  position: fixed;
  right: 1.5rem;
  bottom: 0.85rem;
  z-index: 40;
  pointer-events: none;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: rgba(96, 165, 250, 0.4);
  text-transform: uppercase;
}}

.dark #app {{
  position: relative;
  z-index: 1;
  background: transparent !important;
}}

.dark ::selection {{
  background: rgba(37, 99, 235, 0.45);
  color: #ffffff;
}}

/* ==========================================================================
   Typography - Sleek Modern Headings & Electric Blue Gradients
   ========================================================================== */
.dark h1,
.dark h2,
.dark [data-ui='dialog'][data-part='title'] {{
  font-family: var(--font-display) !important;
  font-weight: 700 !important;
  letter-spacing: -0.02em;
  color: #ffffff !important;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
}}

.dark main h1 {{
  font-size: clamp(2rem, 3.2vw, 2.75rem) !important;
  line-height: 1.15;
  background: linear-gradient(135deg, #ffffff 15%, #93c5fd 60%, #60a5fa 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  display: inline-block;
  margin-bottom: 0.35rem;
}}

.dark main h2 {{
  font-size: clamp(1.3rem, 2vw, 1.7rem) !important;
  line-height: 1.25;
}}

.dark main h1 + p,
.dark main header p {{
  color: var(--gt-text-secondary) !important;
  font-size: 0.95rem !important;
  letter-spacing: -0.005em;
}}

/* ==========================================================================
   Header Navbar - Floating Translucent Glass Bar
   ========================================================================== */
.dark #app > header,
.dark #app > div > header {{
  position: relative;
  background: rgba(8, 13, 26, 0.72) !important;
  border-bottom: 1px solid rgba(59, 130, 246, 0.18) !important;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.45) !important;
  -webkit-backdrop-filter: blur(20px) saturate(1.3);
  backdrop-filter: blur(20px) saturate(1.3);
}}

/* Glowing Cobalt Electric Line under Header */
.dark #app > header::after,
.dark #app > div > header::after {{
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    rgba(59, 130, 246, 0) 0%,
    rgba(59, 130, 246, 0.8) 15%,
    rgba(96, 165, 250, 1) 35%,
    rgba(37, 99, 235, 0.8) 55%,
    rgba(59, 130, 246, 0) 100%
  );
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
}}

.dark #app > header a:first-child,
.dark #app > div > header a:first-child {{
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ffffff;
  background: linear-gradient(135deg, #ffffff 30%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}}

/* ==========================================================================
   Sidebar Navigation - Floating Rounded Pill Capsule System
   ========================================================================== */
.dark aside,
.dark nav[aria-label='Main'],
.dark [data-ui='sidebar'] {{
  background: rgba(8, 13, 26, 0.65) !important;
  border-right: 1px solid rgba(59, 130, 246, 0.16) !important;
  -webkit-backdrop-filter: blur(24px) saturate(1.25);
  backdrop-filter: blur(24px) saturate(1.25);
  padding: 0.75rem 0.5rem;
}}

.dark aside a,
.dark aside button,
.dark nav[aria-label='Main'] a {{
  position: relative;
  border-radius: 9999px !important;
  border: 1px solid transparent !important;
  font-family: var(--font-sans) !important;
  font-size: 0.84rem !important;
  font-weight: 500 !important;
  color: #94a3b8 !important;
  margin-block: 0.18rem;
  padding: 0.6rem 1rem !important;
  transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1) !important;
}}

.dark aside a:hover,
.dark aside button:hover,
.dark nav[aria-label='Main'] a:hover {{
  color: #ffffff !important;
  background: rgba(59, 130, 246, 0.14) !important;
  border-color: rgba(96, 165, 250, 0.3) !important;
  box-shadow: 0 0 16px rgba(59, 130, 246, 0.25) !important;
}}

/* Active Navigation Item - Electric Cobalt Glow Bubble */
.dark aside a[aria-current='page'],
.dark aside a[data-active='true'],
.dark aside a.active,
.dark nav[aria-label='Main'] a[aria-current='page'] {{
  color: #ffffff !important;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
  border-color: rgba(147, 197, 253, 0.38) !important;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.35) !important;
  font-weight: 600 !important;
}}

/* ==========================================================================
   Server Sub-Navigation Telemetry Strip
   ========================================================================== */
.dark [aria-label='Server'] {{
  background: rgba(8, 13, 26, 0.7) !important;
  border-bottom: 1px solid rgba(59, 130, 246, 0.18) !important;
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
}}

.dark [aria-label='Server'] a {{
  position: relative;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: #94a3b8;
  border-radius: 9999px;
  padding: 0.45rem 0.9rem;
  transition: all 160ms ease;
}}

.dark [aria-label='Server'] a:hover {{
  color: #ffffff;
  background: rgba(59, 130, 246, 0.12);
}}

.dark [aria-label='Server'] a[aria-current='page'],
.dark [aria-label='Server'] a.active {{
  color: #ffffff;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.35), rgba(29, 78, 216, 0.2));
  border: 1px solid rgba(96, 165, 250, 0.35);
  box-shadow: 0 0 14px rgba(59, 130, 246, 0.35);
}}

/* ==========================================================================
   Cards - Ultra-Rich Frosted Obsidian Glassmorphism
   ========================================================================== */
.dark [data-ui='card'][data-part='root'],
.dark [class~='bg-card'],
.dark .bg-card {{
  position: relative;
  border: 1px solid rgba(59, 130, 246, 0.22) !important;
  border-radius: 1.35rem !important;
  background-color: rgba(13, 20, 38, 0.68) !important;
  background-image:
    /* Top-left soft ambient light burst */
    radial-gradient(circle at 18% 0%, rgba(59, 130, 246, 0.14) 0%, transparent 55%),
    /* Base obsidian glass gradient */
    linear-gradient(
      150deg,
      rgba(15, 23, 44, 0.72) 0%,
      rgba(10, 16, 32, 0.85) 60%,
      rgba(6, 10, 20, 0.92) 100%
    ) !important;
  box-shadow:
    0 16px 44px rgba(2, 6, 23, 0.52),
    inset 0 1px 0 rgba(147, 197, 253, 0.14) !important;
  -webkit-backdrop-filter: blur(20px) saturate(1.3) !important;
  backdrop-filter: blur(20px) saturate(1.3) !important;
  transition: all 220ms cubic-bezier(0.16, 1, 0.3, 1) !important;
  overflow: hidden;
}}

.dark a:hover > [data-ui='card'][data-part='root'],
.dark [data-ui='card'][data-part='root']:hover,
.dark [class~='bg-card']:hover {{
  border-color: rgba(96, 165, 250, 0.48) !important;
  background-color: rgba(16, 25, 48, 0.76) !important;
  box-shadow:
    0 22px 60px rgba(2, 6, 23, 0.68),
    0 0 28px rgba(59, 130, 246, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.22) !important;
  transform: translateY(-2px);
}}

.dark [data-ui='card'][data-part='header'] {{
  border-bottom: 1px solid rgba(59, 130, 246, 0.14) !important;
  background: rgba(11, 18, 36, 0.4) !important;
  padding: 1.25rem 1.5rem !important;
}}

.dark [data-ui='card'][data-part='title'],
.dark [data-ui='card'] h3 {{
  font-family: var(--font-display) !important;
  font-size: 1.05rem !important;
  font-weight: 700 !important;
  letter-spacing: -0.01em;
  color: #f8fafc !important;
}}

/* ==========================================================================
   Buttons - Sleek Capsule Pills with Electric Cobalt Glow
   ========================================================================== */
.dark [data-ui='button'],
.dark button[type='submit'],
.dark button[type='button']:not([role='tab']) {{
  position: relative;
  border-radius: 9999px !important;
  padding-inline: 1.4rem !important;
  padding-block: 0.6rem !important;
  font-family: var(--font-sans) !important;
  font-size: 0.84rem !important;
  font-weight: 600 !important;
  letter-spacing: -0.01em;
  transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1) !important;
}}

/* Primary Action Capsule Button */
.dark [data-ui='button'][data-variant='default'],
.dark [data-ui='button'][data-variant='primary'],
.dark [data-ui='button']:not([data-variant]),
.dark button[type='submit'] {{
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
  border: 1px solid rgba(147, 197, 253, 0.3) !important;
  color: #ffffff !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 4px 18px rgba(37, 99, 235, 0.45) !important;
}}

.dark [data-ui='button'][data-variant='default']:hover,
.dark [data-ui='button'][data-variant='primary']:hover,
.dark [data-ui='button']:not([data-variant]):hover,
.dark button[type='submit']:hover {{
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  border-color: rgba(191, 219, 254, 0.5) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    0 8px 28px rgba(59, 130, 246, 0.65),
    0 0 18px rgba(59, 130, 246, 0.4) !important;
  transform: translateY(-1px);
}}

/* Secondary / Outline Capsule Button */
.dark [data-ui='button'][data-variant='secondary'],
.dark [data-ui='button'][data-variant='outline'],
.dark [data-ui='button'][data-variant='ghost'] {{
  background: rgba(15, 23, 42, 0.65) !important;
  border: 1px solid rgba(59, 130, 246, 0.25) !important;
  color: #e2e8f0 !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
}}

.dark [data-ui='button'][data-variant='secondary']:hover,
.dark [data-ui='button'][data-variant='outline']:hover,
.dark [data-ui='button'][data-variant='ghost']:hover {{
  background: rgba(59, 130, 246, 0.16) !important;
  border-color: rgba(96, 165, 250, 0.5) !important;
  color: #ffffff !important;
  box-shadow: 0 0 16px rgba(59, 130, 246, 0.3) !important;
}}

.dark [data-ui='button'][data-variant='destructive'] {{
  background: linear-gradient(135deg, #dc2626, #991b1b) !important;
  border: 1px solid rgba(252, 165, 165, 0.45) !important;
  color: #ffffff !important;
  box-shadow: 0 4px 18px rgba(220, 38, 38, 0.4) !important;
}}

/* ==========================================================================
   Badges & Status Indicators
   ========================================================================== */
.dark [data-ui='badge'] {{
  border-radius: 9999px !important;
  font-family: var(--font-sans) !important;
  font-size: 0.72rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.02em;
  padding: 0.28rem 0.8rem !important;
  border: 1px solid rgba(59, 130, 246, 0.32) !important;
  background: rgba(15, 23, 42, 0.75) !important;
  color: #93c5fd !important;
}}

/* Active state badge (e.g. Active Theme) */
.dark [data-ui='badge'][data-variant='default'],
.dark [data-ui='badge'][data-status='active'],
.dark [data-ui='badge']:has(span[class*='emerald']),
.dark [data-ui='badge']:has(span[class*='green']) {{
  background: rgba(34, 197, 94, 0.15) !important;
  border-color: rgba(34, 197, 94, 0.4) !important;
  color: #4ade80 !important;
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.25) !important;
}}

/* ==========================================================================
   Progress Bars - Diagonal Candy Striped Pattern
   ========================================================================== */
.dark [data-ui='progress'] {{
  background: rgba(15, 23, 42, 0.75) !important;
  border: 1px solid rgba(59, 130, 246, 0.2) !important;
  border-radius: 9999px !important;
  height: 0.75rem !important;
  overflow: hidden;
}}

.dark [role='progressbar'] {{
  border-radius: 9999px !important;
  background-color: #2563eb !important;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.22) 0px,
    rgba(255, 255, 255, 0.22) 8px,
    transparent 8px,
    transparent 16px
  ) !important;
  box-shadow: 0 0 14px rgba(59, 130, 246, 0.55) !important;
}}

/* ==========================================================================
   Form Inputs & Search - Capsule Smoked Fields
   ========================================================================== */
.dark input:not([type='checkbox']):not([type='radio']),
.dark textarea,
.dark select,
.dark [data-ui='input'],
.dark [data-ui='textarea'],
.dark [data-ui='select'][data-part='trigger'] {{
  border: 1px solid rgba(59, 130, 246, 0.24) !important;
  border-radius: 9999px !important;
  background: rgba(11, 18, 33, 0.8) !important;
  color: var(--foreground) !important;
  font-family: var(--font-sans) !important;
  padding-inline: 1.25rem !important;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4) !important;
  transition: all 180ms ease !important;
}}

.dark textarea,
.dark [data-ui='textarea'] {{
  border-radius: 1.25rem !important;
}}

.dark input::placeholder,
.dark textarea::placeholder {{
  color: #64748b !important;
}}

.dark input:focus,
.dark textarea:focus,
.dark select:focus {{
  border-color: #3b82f6 !important;
  background: rgba(14, 22, 42, 0.95) !important;
  box-shadow:
    0 0 0 3px rgba(59, 130, 246, 0.25),
    0 0 20px rgba(59, 130, 246, 0.35) !important;
  outline: none !important;
}}

.dark label,
.dark [data-ui='label'] {{
  font-family: var(--font-sans);
  font-size: 0.82rem;
  font-weight: 600;
  color: #cbd5e1;
}}

/* ==========================================================================
   Tabs
   ========================================================================== */
.dark [role='tablist'],
.dark [data-ui='tabs'][data-part='list'] {{
  background: rgba(11, 18, 33, 0.68) !important;
  border: 1px solid rgba(59, 130, 246, 0.2) !important;
  border-radius: 9999px !important;
  padding: 0.3rem !important;
  gap: 0.35rem;
}}

.dark [role='tab'],
.dark [data-ui='tabs'][data-part='trigger'] {{
  padding: 0.55rem 1.25rem !important;
  border-radius: 9999px !important;
  font-family: var(--font-sans) !important;
  font-size: 0.82rem !important;
  font-weight: 600 !important;
  color: #94a3b8 !important;
  background: transparent !important;
  border: 1px solid transparent !important;
  transition: all 160ms ease !important;
}}

.dark [role='tab'][aria-selected='true'],
.dark [role='tab'][data-state='active'],
.dark [data-ui='tabs'][data-part='trigger'][data-state='active'] {{
  color: #ffffff !important;
  background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
  border-color: rgba(147, 197, 253, 0.35) !important;
  box-shadow: 0 3px 14px rgba(37, 99, 235, 0.45) !important;
}}

/* ==========================================================================
   Tables & Data Grids
   ========================================================================== */
.dark [data-ui='table'][data-part='root'] {{
  border-radius: 1.25rem;
  overflow: hidden;
  border: 1px solid rgba(59, 130, 246, 0.2);
}}

.dark [data-ui='table'][data-part='headerCell'] {{
  font-family: var(--font-sans) !important;
  font-size: 0.74rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #93c5fd !important;
  background: rgba(11, 18, 36, 0.6) !important;
}}

.dark [data-ui='table'][data-part='row']:hover {{
  background-color: rgba(59, 130, 246, 0.1) !important;
}}

/* ==========================================================================
   Console / Encrypted Terminal
   ========================================================================== */
.dark section[aria-label='Console'] {{
  border: 1px solid rgba(59, 130, 246, 0.25) !important;
  border-radius: 1.25rem !important;
  background: rgba(6, 10, 20, 0.92) !important;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.7), 0 0 20px rgba(59, 130, 246, 0.15) !important;
  overflow: hidden;
}}

.dark section[aria-label='Console'] input[aria-label='Console command'] {{
  min-height: 3.2rem;
  border-top: 1px solid rgba(59, 130, 246, 0.2) !important;
  border-radius: 0 !important;
  background: rgba(9, 15, 30, 0.98) !important;
  font-family: var(--font-mono) !important;
  caret-color: #60a5fa !important;
}}

/* ==========================================================================
   Dialogs & Popovers
   ========================================================================== */
.dark [role='dialog'],
.dark [data-ui='dialog'][data-part='content'],
.dark [data-ui='popover'][data-part='content'] {{
  border: 1px solid rgba(59, 130, 246, 0.32) !important;
  border-radius: 1.5rem !important;
  background: linear-gradient(155deg, rgba(14, 22, 42, 0.96), rgba(8, 13, 26, 0.98)) !important;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.8), 0 0 35px rgba(59, 130, 246, 0.25) !important;
  -webkit-backdrop-filter: blur(24px) saturate(1.3);
  backdrop-filter: blur(24px) saturate(1.3);
}}

.dark [data-ui='dialog'][data-part='backdrop'] {{
  background: rgba(3, 6, 15, 0.78) !important;
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}}

/* ==========================================================================
   Scrollbars
   ========================================================================== */
.dark ::-webkit-scrollbar {{
  width: 8px;
  height: 8px;
}}

.dark ::-webkit-scrollbar-track {{
  background: rgba(6, 10, 20, 0.6);
}}

.dark ::-webkit-scrollbar-thumb {{
  background: rgba(59, 130, 246, 0.35);
  border-radius: 9999px;
}}

.dark ::-webkit-scrollbar-thumb:hover {{
  background: #3b82f6;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.8);
}}
"""

theme_css_path = os.path.join(DIST_DIR, "theme.css")
with open(theme_css_path, "w", encoding="utf-8") as f:
    f.write(css_content)

theme_source_path = os.path.join(DIST_DIR, "theme-source.css")
with open(theme_source_path, "w", encoding="utf-8") as f:
    f.write(css_content)

tokens_path = os.path.join(THEME_DIR, "tokens.css")
with open(tokens_path, "w", encoding="utf-8") as f:
    f.write(css_content)

ptero_tokens_path = os.path.join(PTERO_DIR, "tokens.css")
with open(ptero_tokens_path, "w", encoding="utf-8") as f:
    f.write(css_content)

print(f"Theme CSS written successfully! Size: {len(css_content.encode('utf-8'))} bytes")
