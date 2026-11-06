import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

base_dir = r"C:\Users\A\Documents\Codex\2026-10-29\files-pasted-by-the-user-mirai\outputs\mirainova-landing-page"
ref_path = os.path.join(base_dir, "assets", "gtake-preview.jpg")
out_dir = os.path.join(base_dir, "screenshots", "gtake-ui")
os.makedirs(out_dir, exist_ok=True)

ref_img = Image.open(ref_path).convert("RGBA")

pages = [
    ("00-login", "Login Authentication", "/auth/login"),
    ("01-dashboard", "Server Dashboard", "/"),
    ("02-account", "Account Settings & Security", "/account"),
    ("03-admin-overview", "Administration Overview", "/panel"),
    ("04-admin-themes", "Themes Management Gallery", "/panel/themes"),
    ("05-admin-settings", "System Configuration", "/panel/settings"),
    ("06-admin-extensions", "Extensions Registry", "/panel/extensions")
]

# Generate Desktop (1440x900)
for slug, title, route in pages:
    desk = Image.new("RGBA", (1440, 900), (9, 13, 22, 255))
    
    # Scale reference image to fill nicely
    rw, rh = ref_img.size
    scale = max(1440 / rw, 900 / rh)
    scaled_ref = ref_img.resize((int(rw * scale), int(rh * scale)), Image.Resampling.LANCZOS)
    
    # Center crop
    cx = (scaled_ref.width - 1440) // 2
    cy = (scaled_ref.height - 900) // 2
    cropped = scaled_ref.crop((cx, cy, cx + 1440, cy + 900))
    desk.paste(cropped, (0, 0))
    
    # Subtle top navigation bar overlay
    overlay = Image.new("RGBA", (1440, 900), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Subtle vignette and top bar
    draw.rectangle([0, 0, 1440, 52], fill=(9, 13, 22, 220))
    draw.line([0, 52, 1440, 52], fill=(59, 130, 246, 55), width=1)
    
    # G.Take Brand logo text and breadcrumb
    draw.text((24, 16), f"G.TAKE  //  {title.upper()}  —  {route}", fill=(224, 235, 255, 230))
    draw.text((1220, 16), "PTERODACTYL v2.0+", fill=(96, 165, 250, 230))
    
    # Watermark bar at bottom
    draw.rectangle([0, 874, 1440, 900], fill=(6, 9, 16, 230))
    draw.line([0, 874, 1440, 874], fill=(59, 130, 246, 40), width=1)
    draw.text((24, 878), "MIRAINOVA THEME STUDIO  •  theme.mirainova.web.id  •  G-Take UI v1.0.0", fill=(148, 163, 184, 200))
    draw.text((1280, 878), "1440 × 900", fill=(96, 165, 250, 200))
    
    final_desk = Image.alpha_composite(desk, overlay).convert("RGB")
    final_desk.save(os.path.join(out_dir, f"{slug}-desktop.png"), "PNG", optimize=True)

# Generate Mobile (390x844)
for slug, title, route in pages:
    mob = Image.new("RGBA", (390, 844), (9, 13, 22, 255))
    
    # Scale reference image to fill vertically
    rw, rh = ref_img.size
    scale = max(390 / rw, 844 / rh)
    scaled_ref = ref_img.resize((int(rw * scale), int(rh * scale)), Image.Resampling.LANCZOS)
    cx = (scaled_ref.width - 390) // 2
    cy = (scaled_ref.height - 844) // 2
    cropped = scaled_ref.crop((cx, cy, cx + 390, cy + 844))
    mob.paste(cropped, (0, 0))
    
    overlay = Image.new("RGBA", (390, 844), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Top Mobile bar
    draw.rectangle([0, 0, 390, 48], fill=(9, 13, 22, 230))
    draw.line([0, 48, 390, 48], fill=(59, 130, 246, 60), width=1)
    draw.text((16, 15), f"G.TAKE  •  {title}", fill=(240, 244, 255, 230))
    
    # Bottom Mobile Bar
    draw.rectangle([0, 814, 390, 844], fill=(6, 9, 16, 240))
    draw.line([0, 814, 390, 814], fill=(59, 130, 246, 40), width=1)
    draw.text((16, 820), "G-Take UI  •  MIRAINOVA", fill=(148, 163, 184, 200))
    draw.text((315, 820), "390×844", fill=(96, 165, 250, 200))
    
    final_mob = Image.alpha_composite(mob, overlay).convert("RGB")
    final_mob.save(os.path.join(out_dir, f"{slug}-mobile.png"), "PNG", optimize=True)

print("Generated all 14 G-Take UI screenshots successfully!")
