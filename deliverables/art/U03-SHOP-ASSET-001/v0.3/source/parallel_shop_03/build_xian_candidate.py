"""Produce a replaceable, full-canvas 现 raster layer from licensed font source.

This is a candidate only. The parent Art owner composes and reviews the PSD.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


HERE = Path(__file__).resolve().parent
V02 = HERE.parents[2] / "v0.2"
LAYERS = V02 / "source/psd_work_final/shop_03/layer_sources"
FONT = V02 / "source/rights/ZCOOLKuaiLe-Regular.ttf"
EXPECTED_FONT_SHA = "812A6FC1FE54B6D73A419245C32DFEBA8AA33104D5BE90D1CF6AF082007CB71D"
CANVAS = (1024, 1024)


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def layer(name: str) -> Image.Image:
    return Image.open(LAYERS / name).convert("RGBA")


def mask_color(mask: Image.Image, color: tuple[int, int, int]) -> Image.Image:
    image = Image.new("RGBA", CANVAS, (*color, 0))
    image.putalpha(mask)
    return image


def main() -> None:
    assert sha(FONT) == EXPECTED_FONT_SHA
    font = ImageFont.truetype(str(FONT), 144)
    raw = Image.new("L", (200, 200), 0)
    draw = ImageDraw.Draw(raw)
    box = draw.textbbox((0, 0), "现", font=font)
    draw.text((-box[0] + 8, -box[1] + 8), "现", font=font, fill=255)
    actual = raw.getbbox()
    assert actual is not None
    # Native OFL outlines are resized into the existing upper-character slot.
    # Use a restrained face expansion; the v0.2 candidate was overfilled.
    face = raw.crop(actual).resize((101, 94), Image.Resampling.LANCZOS)
    core = Image.new("L", CANVAS, 0)
    core.paste(face, (92, 515))
    core = core.filter(ImageFilter.MaxFilter(5))
    inner = core.filter(ImageFilter.MaxFilter(3))
    outline = core.filter(ImageFilter.MaxFilter(7))
    depth = Image.new("L", CANVAS, 0)
    depth.paste(outline.crop((0, 0, 1020, 1020)), (4, 4))
    dark_edge = outline.filter(ImageFilter.MaxFilter(5))

    glyph = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    glyph.alpha_composite(mask_color(depth, (105, 46, 35)))
    glyph.alpha_composite(mask_color(dark_edge, (32, 28, 37)))
    glyph.alpha_composite(mask_color(outline, (227, 126, 69)))
    glyph.alpha_composite(mask_color(inner, (112, 49, 36)))
    glyph.alpha_composite(mask_color(core, (80, 61, 49)))
    out = HERE / "sign_glyph_xian_candidate_v03.png"
    glyph.save(out)

    old_xian = layer("sign_glyph_official_xian.png")
    kao = layer("sign_glyph_reused_kao.png")
    board = layer("sign_board_reused.png")
    hardware = layer("sign_hardware_reused.png")
    baseline = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    candidate = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    for base in (baseline, candidate):
        base.alpha_composite(hardware)
        base.alpha_composite(board)
        base.alpha_composite(kao)
    baseline.alpha_composite(old_xian)
    candidate.alpha_composite(glyph)
    # Same native canvas and 4x enlargement, with no scaling between compared signs.
    crop = (65, 465, 225, 770)
    comp = Image.new("RGBA", (1280, 1220), (24, 43, 79, 255))
    for i, source in enumerate((baseline, candidate)):
        tile = source.crop(crop).resize((640, 1220), Image.Resampling.NEAREST)
        comp.alpha_composite(tile, (640 * i, 0))
    compare = HERE / "sign_xian_v02_vs_candidate_v03_4x.png"
    comp.convert("RGB").save(compare)
    actual_scale = Image.new("RGBA", (320, 305), (24, 43, 79, 255))
    actual_scale.alpha_composite(baseline.crop(crop), (0, 0))
    actual_scale.alpha_composite(candidate.crop(crop), (160, 0))
    actual_compare = HERE / "sign_xian_v02_vs_candidate_v03_1x.png"
    actual_scale.convert("RGB").save(actual_compare)

    original_psd = V02 / "psd/shop_03_charcoal_grill_sign_revision_v02.psd"

    manifest = {
        "status": "ART_CANDIDATE_NOT_VISUAL_PASS_NOT_GATE2",
        "text": "现",
        "canvas": [1024, 1024],
        "source_font": {"path": str(FONT.relative_to(HERE.parents[2])).replace('\\', '/'), "sha256": sha(FONT), "license": "SIL OFL 1.1", "upstream_url": "https://raw.githubusercontent.com/googlefonts/zcool-kuaile/main/fonts/ttf/ZCOOLKuaiLe-Regular.ttf", "distribution": "font file used only as local source, not embedded in candidate PNG or PSD"},
        "source_license": {"path": "v0.2/source/rights/ZCOOLKuaiLe-OFL.txt", "sha256": sha(V02 / "source/rights/ZCOOLKuaiLe-OFL.txt")},
        "original_psd": {"path": "v0.2/psd/shop_03_charcoal_grill_sign_revision_v02.psd", "sha256": sha(original_psd)},
        "original_layers": {n: {"path": f"v0.2/source/psd_work_final/shop_03/layer_sources/{n}", "sha256": sha(LAYERS / n)} for n in ("sign_board_reused.png", "sign_hardware_reused.png", "sign_glyph_reused_kao.png", "sign_glyph_official_xian.png")},
        "generator": {"path": "v0.3/source/parallel_shop_03/build_xian_candidate.py", "sha256": sha(Path(__file__))},
        "outputs": {out.name: {"sha256": sha(out), "alpha_bbox": glyph.getchannel("A").getbbox()}, compare.name: {"sha256": sha(compare), "crop_xyxy": crop, "scale": 4}, actual_compare.name: {"sha256": sha(actual_compare), "crop_xyxy": crop, "scale": 1}},
        "render": {"source_character": "现 U+73B0", "font_point_size": 144, "source_glyph_bbox": actual, "resized_face_px": [101, 94], "face_top_left": [92, 515], "face_thickening_max_filter_px": 5, "face_rgb": [80, 61, 49], "warm_orange_edge_rgb": [227, 126, 69], "inner_warm_rgb": [112, 49, 36], "deep_brown_depth_rgb": [105, 46, 35], "dark_edge_rgb": [32, 28, 37], "depth_offset_px": [4, 4]},
        "preservation": "Candidate PNG contains only 现. Original 烤, board, hardware and body sources are read only. Parent Art must preserve their original pixels in composition."
    }
    (HERE / "SOURCE_MANIFEST.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
