# -*- coding: utf-8 -*-
"""Combine a newly painted straight-street patch with unchanged r1 bridge."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageOps

import sample_bridge as sample


BASE = Path(__file__).resolve().parents[1]
NATIVE = BASE / "source/native/street_patch_correction_02_native.png"
BRIDGE_R1 = BASE / "source/bridge_correction_01_full_work.png"
PATCH = BASE / "source/street_patch_correction_02_projected.png"
COMBINED = BASE / "source/bridge_correction_02_full_work.png"
HALF = BASE / "exports/tex_sakura_rr_bridge_correction_02_half.png"
REVIEW = BASE / "review/bridge_correction_02"
REFERENCE = BASE / "reference/user_reference_3072x1024.png"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    REVIEW.mkdir(parents=True, exist_ok=True)
    native = Image.open(NATIVE).convert("RGBA")
    bridge = Image.open(BRIDGE_R1).convert("RGBA")
    assert native.size == (2172, 724) and bridge.size == (3072, 1024)
    # The NEW street has genuinely painted paving and wall regions. Project
    # these semantic bands separately, never reflecting rows or duplicating
    # bright motifs. The lower wall is cropped to the part actually needed.
    paving = native.crop((0, 245, 2172, 430)).resize(
        (3072, 120), Image.Resampling.LANCZOS
    )
    wall = native.crop((0, 430, 2172, 510)).resize(
        (3072, 40), Image.Resampling.LANCZOS
    )
    patch = Image.new("RGBA", bridge.size, (0, 0, 0, 0))
    patch.alpha_composite(paving, (0, 690))
    patch.alpha_composite(wall, (0, 810))
    patch.save(PATCH)
    # Select the old complete bridge unchanged in its center; select only the
    # newly painted patch at outer straight street. The overlap fades in X.
    band = Image.new("L", (3072, 1), 0)
    pixels = band.load()
    for x in range(3072):
        if x < 1050 or x > 2022:
            pixels[x, 0] = 0
        elif x < 1280:
            pixels[x, 0] = round(255 * (x - 1050) / 230)
        elif x <= 1792:
            pixels[x, 0] = 255
        else:
            pixels[x, 0] = round(255 * (2022 - x) / 230)
    mask = band.resize(bridge.size)
    combined = Image.composite(bridge, patch, mask)
    combined.save(COMBINED)
    half = combined.crop((0, 512, 1536, 1024))
    half.save(HALF)
    mirrored = Image.new("RGBA", bridge.size, (0, 0, 0, 0))
    mirrored.alpha_composite(half, (0, 512))
    mirrored.alpha_composite(ImageOps.mirror(half), (1536, 512))
    mirrored.save(REVIEW / "bridge_sample_mirrored_transparent_3072x1024.png")
    neutral = Image.new("RGBA", bridge.size, (26, 25, 62, 255))
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
    paths = [NATIVE, BRIDGE_R1, PATCH, COMBINED, HALF, REFERENCE, *sorted(REVIEW.glob("*.png"))]
    record = {
        "method": "new painted independent straight-street layer composited with unchanged r1 bridge at center, then left half mirrored",
        "native_paving_crop": [0, 245, 2172, 430],
        "native_wall_crop": [0, 430, 2172, 510],
        "projected_paving_rect": [0, 690, 3072, 810],
        "projected_wall_rect": [0, 810, 3072, 850],
        "bridge_full_weight_x": [1280, 1792],
        "bridge_fade_x": [[1050, 1280], [1792, 2022]],
        "mirror_axis_x": 1536,
        "shop_sources_read_only": sources,
        "files": {str(p.relative_to(BASE)): digest(p) for p in paths},
    }
    (BASE / "SAMPLE_CORRECTION_02_SOURCE_MANIFEST.json").write_text(
        json.dumps(record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps({"half": str(HALF), "combined": str(COMBINED)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
