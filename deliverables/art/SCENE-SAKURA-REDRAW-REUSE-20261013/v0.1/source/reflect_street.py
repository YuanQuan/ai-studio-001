# -*- coding: utf-8 -*-
"""Extend only candidate 2's newly painted straight paving by reflected rows."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageOps

import sample_bridge as sample


BASE = Path(__file__).resolve().parents[1]
SOURCE = BASE / "source/bridge_correction_01_full_work.png"
OUT_SOURCE = BASE / "source/bridge_correction_01_street_reflected.png"
HALF = BASE / "exports/tex_sakura_rr_bridge_correction_01_street_reflected_half.png"
REVIEW = BASE / "review/bridge_correction_01_street_reflected"
REFERENCE = BASE / "reference/user_reference_3072x1024.png"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    REVIEW.mkdir(parents=True, exist_ok=True)
    base = Image.open(SOURCE).convert("RGBA")
    assert base.size == (3072, 1024)
    projected = base.copy()
    # Tile the new paving by alternating vertically reflected strips. No
    # stone is stretched; the retaining wall is cropped to its upper 40 px.
    projected.paste(ImageOps.flip(base.crop((0, 715, 3072, 755))), (0, 755))
    projected.paste(base.crop((0, 715, 3072, 730)), (0, 795))
    projected.paste(base.crop((0, 755, 3072, 795)), (0, 810))
    # Blend to unchanged bridge in a wide transition. Only outer straight
    # street/wall panels are fully projected.
    fade = Image.new("L", (3072, 1), 0)
    px = fade.load()
    for x in range(3072):
        if x <= 1070 or x >= 2002:
            px[x, 0] = 255
        elif x < 1300:
            px[x, 0] = round(255 * (1300 - x) / 230)
        elif x > 1772:
            px[x, 0] = round(255 * (x - 1772) / 230)
    mask = fade.resize((3072, 1024))
    output = Image.composite(projected, base, mask)
    output.save(OUT_SOURCE)
    half = output.crop((0, 512, 1536, 1024))
    half.save(HALF)
    mirrored = Image.new("RGBA", (3072, 1024), (0, 0, 0, 0))
    mirrored.alpha_composite(half, (0, 512))
    mirrored.alpha_composite(ImageOps.mirror(half), (1536, 512))
    mirrored.save(REVIEW / "bridge_sample_mirrored_transparent_3072x1024.png")
    neutral = Image.new("RGBA", (3072, 1024), (26, 25, 62, 255))
    neutral.alpha_composite(mirrored)
    neutral.convert("RGB").save(REVIEW / "bridge_sample_neutral_3072x1024.png")
    overlay, sources = sample.shop_overlay()
    with_shops = Image.alpha_composite(neutral, overlay).convert("RGB")
    with_shops.save(REVIEW / "bridge_sample_with_existing_shops_3072x1024.png")
    reference = Image.open(REFERENCE).convert("RGB")
    pair = Image.new("RGB", (6144, 1024))
    pair.paste(reference, (0, 0))
    pair.paste(with_shops, (3072, 0))
    pair.save(REVIEW / "bridge_reference_vs_sample_1to1.png")
    roi = Image.new("RGB", (1904, 510))
    roi.paste(reference.crop((1060, 440, 2012, 950)), (0, 0))
    roi.paste(with_shops.crop((1060, 440, 2012, 950)), (952, 0))
    roi.save(REVIEW / "bridge_roi_reference_vs_sample_1to1.png")
    paths = [SOURCE, OUT_SOURCE, HALF, REFERENCE, *sorted(REVIEW.glob("*.png"))]
    manifest = {
        "method": "deterministic vertical reflection of new paving rows and crop of new wall rows, x mask zero at central bridge; no stretch and no reference pixels",
        "source_y_paving": [690, 755],
        "projected_y_paving": [690, 810],
        "source_y_wall": [755, 850],
        "projected_y_wall": [810, 850],
        "central_bridge_unchanged_x": [1300, 1772],
        "blend_x": [[1070, 1300], [1772, 2002]],
        "shops": sources,
        "files": {str(p.relative_to(BASE)): digest(p) for p in paths},
    }
    (BASE / "SAMPLE_STREET_REFLECTION_MANIFEST.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps({"half": str(HALF), "review": str(REVIEW)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
