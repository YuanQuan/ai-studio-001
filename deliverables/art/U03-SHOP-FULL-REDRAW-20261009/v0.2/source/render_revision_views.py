"""Render v0.2 review views without copying unchanged shop assets."""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
V01 = ROOT.parent / "v0.1"
OUT = ROOT / "preview"
OUT.mkdir(exist_ok=True)


def black(image):
    pane = Image.new("RGBA", image.size, "#000000")
    pane.alpha_composite(image.convert("RGBA"))
    return pane.convert("RGB")


overview = Image.new("RGB", (1536, 1024), "#1b3055")
for number in range(1, 7):
    shop = f"shop_{number:02d}"
    root = ROOT if number == 4 else V01
    image = Image.open(root / "preview" / f"{shop}_recomposed.png").convert("RGBA")
    x = [0, 509, 1019][(number - 1) % 3]
    y = [0, 500][(number - 1) // 3]
    overview.paste(black(image.resize((461, 461), Image.Resampling.LANCZOS)), (x, y))
overview.save(OUT / "six_shop_full_redraw_overview.png")

shop = "shop_04"
new = Image.open(OUT / f"{shop}_recomposed.png").convert("RGBA")
old = Image.open(V01 / "preview" / f"{shop}_recomposed.png").convert("RGBA")
reference = Image.open(V01 / "preview" / f"{shop}_reference_same_scale_black.png").convert("RGB")
comparison = Image.new("RGB", (3072, 1024), "#000000")
for x, image in ((0, reference), (1024, black(old)), (2048, black(new))):
    comparison.paste(image, (x, 0))
comparison.save(OUT / "shop_04_reference_v01_v02_same_scale_black.png")

for width, height, display, foot_y in ((390, 844, 316, 530), (720, 1280, 584, 800)):
    bg = Image.new("RGBA", (width, height), "#1b3055")
    scaled = new.resize((display, display), Image.Resampling.LANCZOS)
    bg.alpha_composite(scaled, ((width - display) // 2, round(foot_y - 900 * display / 1024)))
    bg.convert("RGB").save(OUT / f"{shop}_{width}x{height}.png")

print("Rendered v0.2 six-shop overview, 04 before/after comparison and two display sizes")
