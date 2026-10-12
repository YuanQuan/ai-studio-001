#!/usr/bin/env python3
"""Build a same-background, same-scale full-view reference at phase 0.83 s."""

import hashlib
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[5]
VERSION = Path(__file__).resolve().parents[1]
BODY = ROOT / "apps/client/assets/units/shops/milk_tea/textures/tex_mt_shop_01_body.png"
SIGN = ROOT / "apps/client/assets/units/shops/milk_tea/textures/tex_mt_shop_01_sign.png"
MASK = VERSION / "exports/tex_mt_shop_01_lantern_mask_v02.png"
OUT = VERSION / "evidence/lantern_full_083s.png"


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


assert digest(BODY) == "1a5e980d2df64078197883f5ffdcd27fbd282fc9a71055c9aada87de0185fb06"
assert digest(SIGN) == "316b7bc4461ab43b8cd55bef7e35e6c4d5ddd5677d49aee06061c9c8db385ea5"
assert digest(MASK) == "f9a67671a0e1d4f03974f62b3fdf8de1131e4e99adc7aad4fecd13095fba7b9f"
body = Image.open(BODY).convert("RGBA")
sign = Image.open(SIGN).convert("RGBA")
mask = Image.open(MASK).convert("L")
strength = 0.96 - 0.06 * (0.95 * 0.95 * (3 - 2 * 0.95))

candidate = body.copy()
pixels = candidate.load()
source = body.load()
mp = mask.load()
for y in range(533, 598):
    for x in range(200, 249):
        m = mp[x - 178, y - 505]
        if not m:
            continue
        r, g, b, a = source[x, y]
        factor = 1 - (1 - strength) * m / 255
        pixels[x, y] = round(r * factor), round(g * factor), round(b * factor), a

backdrop = Image.new("RGBA", (1024, 1024), (23, 32, 43, 255))
baseline = Image.alpha_composite(backdrop, Image.alpha_composite(body, sign)).convert("RGB")
dimmed = Image.alpha_composite(backdrop, Image.alpha_composite(candidate, sign)).convert("RGB")
baseline = baseline.resize((512, 512), Image.Resampling.LANCZOS)
dimmed = dimmed.resize((512, 512), Image.Resampling.LANCZOS)
sheet = Image.new("RGB", (1048, 550), (23, 32, 43))
sheet.paste(baseline, (0, 38))
sheet.paste(dimmed, (536, 38))
draw = ImageDraw.Draw(sheet)
draw.text((8, 13), "BASELINE 0.000s / 1.000", fill=(234, 240, 245))
draw.text((544, 13), f"PILOT 0.830s / {strength:.3f} (CPU REFERENCE)", fill=(234, 240, 245))
sheet.save(OUT)
print(OUT, digest(OUT), strength)
