from PIL import Image, ImageDraw, ImageFont
import os

base_dir = r"C:\Users\A\Documents\Codex\2026-10-29\files-pasted-by-the-user-mirai\outputs\mirainova-landing-page"
avatar = Image.new("RGBA", (256, 256), (9, 13, 22, 255))
draw = ImageDraw.Draw(avatar)

# Radial gradient glow
for r in range(120, 0, -2):
    alpha = int(80 * (1 - r / 120))
    draw.ellipse([128 - r, 128 - r, 128 + r, 128 + r], fill=(37, 99, 235, alpha))

# Logo symbol (stylized ><)
# Left chevron
draw.line([(80, 100), (105, 128), (80, 156)], fill=(56, 189, 248, 255), width=8)
# Right chevron
draw.line([(120, 100), (95, 128), (120, 156)], fill=(96, 165, 250, 255), width=8)

# Text "G.TAKE"
draw.text((135, 118), "G.TAKE", fill=(240, 246, 255, 255))

avatar.convert("RGB").save(os.path.join(base_dir, "assets", "gtake-avatar.jpg"), "JPEG", quality=95)
print("G-Take avatar generated!")
