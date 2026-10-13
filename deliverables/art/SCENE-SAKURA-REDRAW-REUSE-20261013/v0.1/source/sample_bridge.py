# -*- coding: utf-8 -*-
"""Deterministic sample placement from a newly generated complete bridge.

Run from the game repository root with the bundled Python runtime.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path.cwd()
BASE = Path(__file__).resolve().parents[1]
NATIVE = BASE / "source/native/bridge_initial_native.png"
SOURCE = BASE / "source/bridge_full_work.png"
HALF = BASE / "exports/tex_sakura_rr_bridge_half.png"
REVIEW = BASE / "review"
MANIFEST = BASE / "SAMPLE_SOURCE_MANIFEST.json"
REFERENCE = BASE / "reference/user_reference_3072x1024.png"
WIDTH, HEIGHT = 3072, 1024
SCALE = 0.5
CORE_X, CORE_Y = 993, 535
HALF_TOP = 512
TILE_NATIVE = 350
SHOPS = [
    ("milk_tea", "tex_mt_shop_01", 283, 440),
    ("sugar_art", "tex_u03_shop_02", 582, 466),
    ("charcoal_grill", "tex_u03_shop_03", 952, 441),
    ("barber", "tex_u03_shop_04", 1712, 443),
    ("lantern", "tex_u03_shop_05", 2051, 455),
    ("pitch_pot", "tex_u03_shop_06", 2392, 455),
]


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def paste_clip(dst: Image.Image, src: Image.Image, x: int, y: int) -> None:
    dst.alpha_composite(src, (x, y))


def shop_overlay() -> tuple[Image.Image, list[dict]]:
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    sources = []
    for slug, stem, x, y in SHOPS:
        textures = ROOT / "apps/client/assets/units/shops" / slug / "textures"
        body_path = textures / f"{stem}_body.png"
        sign_path = textures / f"{stem}_sign.png"
        body = Image.open(body_path).convert("RGBA")
        sign = Image.open(sign_path).convert("RGBA")
        shop = Image.alpha_composite(body, sign).resize((348, 348), Image.Resampling.LANCZOS)
        paste_clip(overlay, shop, x, y)
        sources.append({
            "shop": slug,
            "body": str(body_path.relative_to(ROOT)),
            "body_sha256": digest(body_path),
            "sign": str(sign_path.relative_to(ROOT)),
            "sign_sha256": digest(sign_path),
            "top_left": [x, y],
            "scale_canvas": [348, 348],
        })
    return overlay, sources


def main() -> None:
    REVIEW.mkdir(parents=True, exist_ok=True)
    HALF.parent.mkdir(parents=True, exist_ok=True)
    native = Image.open(NATIVE).convert("RGBA")
    assert native.size == (2172, 724), native.size
    core = native.resize((round(native.width * SCALE), round(native.height * SCALE)), Image.Resampling.LANCZOS)
    full = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    # The two far outer street strips are deterministically reflected and
    # repeated from this newly drawn source, never sampled from the reference.
    strip_width = round(TILE_NATIVE * SCALE)
    left_strip = native.crop((0, 0, TILE_NATIVE, native.height)).resize(
        (strip_width, core.height), Image.Resampling.LANCZOS
    )
    right_strip = native.crop((native.width - TILE_NATIVE, 0, native.width, native.height)).resize(
        (strip_width, core.height), Image.Resampling.LANCZOS
    )
    x = CORE_X - strip_width
    flip = True
    while x + strip_width > 0:
        paste_clip(full, ImageOps.mirror(left_strip) if flip else left_strip, x, CORE_Y)
        x -= strip_width
        flip = not flip
    x = CORE_X + core.width
    flip = True
    while x < WIDTH:
        paste_clip(full, ImageOps.mirror(right_strip) if flip else right_strip, x, CORE_Y)
        x += strip_width
        flip = not flip
    paste_clip(full, core, CORE_X, CORE_Y)
    full.save(SOURCE)
    half = full.crop((0, HALF_TOP, WIDTH // 2, HEIGHT))
    half.save(HALF)
    mirrored = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    paste_clip(mirrored, half, 0, HALF_TOP)
    paste_clip(mirrored, ImageOps.mirror(half), WIDTH // 2, HALF_TOP)
    mirrored.save(REVIEW / "bridge_sample_mirrored_transparent_3072x1024.png")
    neutral = Image.new("RGBA", (WIDTH, HEIGHT), (26, 25, 62, 255))
    neutral.alpha_composite(mirrored)
    neutral.convert("RGB").save(REVIEW / "bridge_sample_neutral_3072x1024.png")
    overlay, shops = shop_overlay()
    with_shops = Image.alpha_composite(neutral, overlay).convert("RGB")
    with_shops.save(REVIEW / "bridge_sample_with_existing_shops_3072x1024.png")
    reference = Image.open(REFERENCE).convert("RGB")
    comparison = Image.new("RGB", (WIDTH * 2, HEIGHT))
    comparison.paste(reference, (0, 0))
    comparison.paste(with_shops, (WIDTH, 0))
    comparison.save(REVIEW / "bridge_reference_vs_sample_1to1.png")
    paths = [NATIVE, SOURCE, HALF, REFERENCE,
             REVIEW / "bridge_sample_mirrored_transparent_3072x1024.png",
             REVIEW / "bridge_sample_neutral_3072x1024.png",
             REVIEW / "bridge_sample_with_existing_shops_3072x1024.png",
             REVIEW / "bridge_reference_vs_sample_1to1.png"]
    data = {
        "version": "sample_v0.1",
        "method": "new native bridge scaled uniformly by the recorded scale, extended only from its own far street strips by alternating mirrors, then left half mirrored at x=1536",
        "native_size": list(native.size),
        "scale": SCALE,
        "core_position": [CORE_X, CORE_Y],
        "core_projected_size": list(core.size),
        "left_half_source_rect": [0, HALF_TOP, WIDTH // 2, HEIGHT],
        "shop_overlay": "rebuilt from current body/sign sources, not an older screenshot",
        "shop_sources": shops,
        "files": {str(p.relative_to(BASE)): digest(p) for p in paths},
    }
    MANIFEST.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps({"file_count": len(paths), "half": str(HALF), "full": str(SOURCE)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
