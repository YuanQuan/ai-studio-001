"""Render a two-character grill sign candidate from one licensed OFL font.

Only candidate glyph and read-only comparison previews are written here.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
V03 = ROOT / "v0.3"
V02 = ROOT / "v0.2"
FONT = V02 / "source/rights/ZCOOLKuaiLe-Regular.ttf"
LICENSE = V02 / "source/rights/ZCOOLKuaiLe-OFL.txt"
PLAN = ROOT / "v0.4/PRODUCTION_PLAN_AND_ANCHORS.md"
BOARD = V03 / "source/shop_03_light_r3_psd_work/layer_sources/sign_board_reused.png"
HARDWARE = V03 / "source/shop_03_light_r3_psd_work/layer_sources/sign_hardware_reused.png"
BODY = V03 / "exports/light_r3_final/tex_u03_shop_03_body_visual_fidelity_v03.png"
OLD_SIGN = V03 / "exports/light_r3_final/tex_u03_shop_03_sign_visual_fidelity_v03.png"
OLD_PSD = V03 / "psd/shop_03_visual_fidelity_v03.psd"
REFERENCE = ROOT / "v0.4/source/reference/shop_03_approved_sign_crop.png"
FONT_SHA = "812A6FC1FE54B6D73A419245C32DFEBA8AA33104D5BE90D1CF6AF082007CB71D"
LICENSE_SHA = "538078469839B4A2E7AD22BEF4EBE41681A4E53749BB2A072144024F1D6D703D"
PLAN_SHA = "6EC78613C66311B1D85B04E7A5AE55C9CC8BE6E21DA27B46C634D2C302A67183"
CANVAS = (1024, 1024)
FONT_SIZE = 124
UNIFORM_SCALE = 0.92
CHARACTERS = [("现", (138, 562)), ("烤", (138, 696))]


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def rgba(path: Path) -> Image.Image:
    image = Image.open(path).convert("RGBA")
    assert image.size == CANVAS, path
    return image


def colored(mask: Image.Image, rgb: tuple[int, int, int]) -> Image.Image:
    image = Image.new("RGBA", CANVAS, (*rgb, 0))
    image.putalpha(mask)
    return image


def shifted(mask: Image.Image, dx: int, dy: int) -> Image.Image:
    image = Image.new("L", CANVAS, 0)
    image.paste(mask.crop((0, 0, 1024-dx, 1024-dy)), (dx, dy))
    return image


def face_gradient(mask: Image.Image, bbox: tuple[int, int, int, int]) -> Image.Image:
    """Warm golden face with a subtle upper-left highlight, no black fill."""
    x0, y0, x1, y1 = bbox
    yy, xx = np.mgrid[0:1024, 0:1024]
    t = np.clip(.64*(yy-y0)/max(y1-y0, 1) + .36*(xx-x0)/max(x1-x0, 1), 0, 1)
    top = np.array((255, 215, 144), dtype=np.float32)
    bottom = np.array((221, 149, 80), dtype=np.float32)
    rgb = np.rint(top[None, None, :]*(1-t[..., None]) + bottom[None, None, :]*t[..., None]).astype(np.uint8)
    out = np.empty((1024, 1024, 4), dtype=np.uint8)
    out[:, :, :3] = rgb
    out[:, :, 3] = np.asarray(mask, dtype=np.uint8)
    return Image.fromarray(out, "RGBA")


def make_glyph() -> tuple[Image.Image, list[dict]]:
    font = ImageFont.truetype(str(FONT), FONT_SIZE)
    result = Image.new("RGBA", CANVAS)
    metrics: list[dict] = []
    for character, center in CHARACTERS:
        raw = Image.new("L", (160, 160), 0)
        draw = ImageDraw.Draw(raw)
        font_box = draw.textbbox((0, 0), character, font=font)
        draw.text((8-font_box[0], 8-font_box[1]), character, font=font, fill=255)
        visible = raw.getbbox()
        assert visible is not None
        cropped = raw.crop(visible)
        resized = cropped.resize((round(cropped.width*UNIFORM_SCALE), round(cropped.height*UNIFORM_SCALE)), Image.Resampling.LANCZOS)
        x = center[0] - resized.width//2
        y = center[1] - resized.height//2
        natural = Image.new("L", CANVAS, 0)
        natural.paste(resized, (x, y))
        # The same 1-pixel round expansion and 2-pixel edge are applied to both.
        face = natural.filter(ImageFilter.MaxFilter(3))
        rim = face.filter(ImageFilter.MaxFilter(5))
        depth = shifted(rim, 3, 3)
        piece = Image.new("RGBA", CANVAS)
        piece.alpha_composite(colored(depth, (151, 95, 56)))
        piece.alpha_composite(colored(rim, (192, 119, 65)))
        piece.alpha_composite(face_gradient(face, face.getbbox()))
        top_light = np.maximum(np.asarray(face, dtype=np.int16) - np.asarray(shifted(face, 1, 1), dtype=np.int16), 0).astype(np.uint8)
        top_light = Image.fromarray((top_light.astype(np.float32)*.38).astype(np.uint8), "L")
        piece.alpha_composite(colored(top_light, (255, 230, 172)))
        result.alpha_composite(piece)
        metrics.append({"char": character, "unicode": f"U+{ord(character):04X}", "font_bbox": font_box,
                        "source_visible_bbox": visible, "scaled_px": [resized.width, resized.height],
                        "center_xy": center, "face_bbox": face.getbbox(), "effect_bbox": piece.getchannel("A").getbbox()})
    return result, metrics


def composed_with_sign(sign: Image.Image) -> Image.Image:
    image = rgba(BODY)
    image.alpha_composite(sign)
    return image


def view(image: Image.Image, width: int, height: int, display: int, foot_y: int) -> Image.Image:
    bg = Image.new("RGBA", (width, height), (24, 43, 79, 255))
    bg.alpha_composite(image.resize((display, display), Image.Resampling.LANCZOS),
                       ((width-display)//2, foot_y-round(900*display/1024)))
    return bg.convert("RGB")


def main() -> None:
    assert sha(FONT) == FONT_SHA and sha(LICENSE) == LICENSE_SHA and sha(PLAN) == PLAN_SHA
    glyph, metrics = make_glyph()
    out = HERE / "sign_glyph_xiankao_candidate_v04.png"
    glyph.save(out)

    # Candidate sign is assembled only in memory. Never copy old 现 or 烤 pixels.
    new_sign = Image.new("RGBA", CANVAS)
    new_sign.alpha_composite(rgba(HARDWARE))
    new_sign.alpha_composite(rgba(BOARD))
    new_sign.alpha_composite(glyph)
    old_full = composed_with_sign(rgba(OLD_SIGN))
    new_full = composed_with_sign(new_sign)

    box = (65, 465, 225, 770)
    local = Image.new("RGBA", (320, 305), (24, 43, 79, 255))
    local.alpha_composite(old_full.crop(box), (0, 0))
    local.alpha_composite(new_full.crop(box), (160, 0))
    local_path = HERE / "sign_xiankao_v03_vs_candidate_v04_1x.png"
    local.convert("RGB").save(local_path)
    phone_old = view(old_full, 390, 844, 316, 530)
    phone_new = view(new_full, 390, 844, 316, 530)
    phone = Image.new("RGB", (780, 844), (24, 43, 79))
    phone.paste(phone_old, (0, 0))
    phone.paste(phone_new, (390, 0))
    phone_path = HERE / "shop_03_v03_vs_candidate_v04_390x844.png"
    phone.save(phone_path)

    records = {p.name: {"sha256": sha(p)} for p in (out, local_path, phone_path)}
    records[out.name].update({"canvas": [1024, 1024], "mode": "RGBA", "alpha_bbox": glyph.getchannel("A").getbbox()})
    records[local_path.name].update({"left": "v0.3", "right": "v0.4 candidate", "native_crop_xyxy": box, "scale": 1})
    records[phone_path.name].update({"left": "v0.3", "right": "v0.4 candidate", "view_each": [390, 844], "display_px": 316, "foot_y_px": 530})
    manifest = {
        "status": "ART_CANDIDATE_NOT_VISUAL_PASS_NOT_GATE2",
        "word": "现烤", "canvas": [1024, 1024], "foot": [512, 900],
        "approval_basis": {"plan_sha256": sha(PLAN), "gate1": "USER_APPROVED", "art_presign": "PRESIGNED_FOR_02_03_04_SIGN_ONLY_ON_GATE1", "tech_presign": "PRESIGNED_FOR_02_03_04_SIGN_ONLY"},
        "font": {"path": "v0.2/source/rights/ZCOOLKuaiLe-Regular.ttf", "sha256": sha(FONT), "license": "SIL OFL 1.1", "license_path": "v0.2/source/rights/ZCOOLKuaiLe-OFL.txt", "license_sha256": sha(LICENSE), "upstream_url": "https://raw.githubusercontent.com/googlefonts/zcool-kuaile/main/fonts/ttf/ZCOOLKuaiLe-Regular.ttf", "font_distributed": False},
        "inputs": {name: {"path": p.relative_to(ROOT).as_posix(), "sha256": sha(p)} for name, p in {"old_psd": OLD_PSD, "body": BODY, "old_sign": OLD_SIGN, "board": BOARD, "hardware": HARDWARE, "approved_direction_crop": REFERENCE}.items()},
        "generator": {"path": Path(__file__).relative_to(ROOT).as_posix(), "sha256": sha(Path(__file__))},
        "render": {"characters": metrics, "font_size": FONT_SIZE, "uniform_scale": UNIFORM_SCALE, "same_parameter_for_both": True,
                   "face_expansion_filter_px": 3, "rim_expansion_filter_px": 5, "depth_offset_px": [3, 3],
                   "face_gradient_top_rgb": [255, 215, 144], "face_gradient_bottom_rgb": [221, 149, 80],
                   "rim_rgb": [192, 119, 65], "depth_rgb": [151, 95, 56], "top_left_highlight_rgb": [255, 230, 172]},
        "outputs": records,
        "preservation": "The candidate contains only newly rendered 现烤. The original board, hardware and body are read-only inputs; old 现 and 烤 glyph pixels are not composited into the candidate."
    }
    (HERE / "SOURCE_MANIFEST.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
