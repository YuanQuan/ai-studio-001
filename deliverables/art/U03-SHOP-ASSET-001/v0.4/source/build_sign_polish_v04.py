"""Assemble the three approved sign edits and six-shop v0.4 Gate2 package."""
from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PREV = ROOT.parent / "v0.3"
SKILL = Path("C:/Users/admin/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py")
FINALIZE = ROOT.parent / "v0.1/source/shop_01/finalize_psd_visibility.py"
FONT = ROOT.parent / "v0.2/source/rights/ZCOOLKuaiLe-Regular.ttf"
EXP = ROOT / "exports/sign_polish_v04_final"
PRE = ROOT / "preview/sign_polish_v04_final"
WORK = ROOT / "source/psd_work"
OLD = json.loads((PREV / "CUT_MANIFEST.json").read_text(encoding="utf-8"))
NAMES = ["奶茶", "糖画", "现烤", "理发", "花灯", "投壶"]


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def empty() -> Image.Image:
    return Image.new("RGBA", (1024, 1024))


def ref(path: Path) -> dict:
    return {"path": path.relative_to(ROOT).as_posix(), "sha256": sha(path)}


def copy_exact(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
    assert sha(src) == sha(dst)


def crop_alpha(raw: Image.Image, cutoff: int = 16) -> Image.Image:
    pixels = np.asarray(raw.convert("RGBA")).copy()
    pixels[pixels[:, :, 3] < cutoff] = 0
    clean = Image.fromarray(pixels, "RGBA")
    box = clean.getchannel("A").getbbox()
    assert box is not None
    return clean.crop(box)


def place(raw: Image.Image, xyxy: tuple[int, int, int, int]) -> Image.Image:
    out = empty()
    sized = raw.resize((xyxy[2] - xyxy[0], xyxy[3] - xyxy[1]), Image.Resampling.LANCZOS)
    out.alpha_composite(sized, xyxy[:2])
    return out


def source_02_layers() -> tuple[Image.Image, Image.Image, Image.Image, dict]:
    src = ROOT / "source/imagegen/shop_02_cartoon_sign_r3.png"
    blank_src = ROOT / "source/imagegen/shop_02_cartoon_blank_board_r1.png"
    original = rgba(src)
    blank = rgba(blank_src)
    assert original.size == blank.size == (1024, 1536)
    a = np.asarray(original).astype(np.int16)
    b = np.asarray(blank).astype(np.int16)
    delta = np.max(np.abs(a[:, :, :3] - b[:, :, :3]), axis=2)
    # The image edit kept board geometry but slightly changed brush pixels. The
    # icon's whole painted motif is isolated inside this source-only rectangle.
    mask = np.zeros(delta.shape, dtype=np.uint8)
    mask[175:665, 375:710] = np.uint8(delta[175:665, 375:710] > 22) * 255
    mask_im = Image.fromarray(mask, "L").filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(1.2))
    icon_pixels = np.asarray(original).copy()
    icon_pixels[:, :, 3] = np.minimum(icon_pixels[:, :, 3], np.asarray(mask_im))
    icon_raw = Image.fromarray(icon_pixels, "RGBA")
    # Both sources share this geometric crop, keeping icon and blank board aligned.
    source_box = (264, 66, 762, 1454)
    target_box = (704, 627, 816, 890)
    board = place(blank.crop(source_box), target_box)
    spoon = place(icon_raw.crop(source_box), target_box)
    old_glyph = rgba(PREV / "source/shop_02_light_r3_psd_work/layer_sources/sign_glyph_reused_sugar_small_r3.png")
    glyph = place(crop_alpha(old_glyph), (724, 755, 796, 829))
    return board, spoon, glyph, {
        "cartoon_sign_source": ref(src), "blank_board_source": ref(blank_src),
        "glyph_source": {"path": "../v0.3/source/shop_02_light_r3_psd_work/layer_sources/sign_glyph_reused_sugar_small_r3.png", "sha256": sha(PREV / "source/shop_02_light_r3_psd_work/layer_sources/sign_glyph_reused_sugar_small_r3.png")},
        "source_crop": list(source_box), "target_board_bbox": list(target_box),
        "spoon_layer_bbox": list(spoon.getchannel("A").getbbox()),
        "glyph_bbox": list(glyph.getchannel("A").getbbox()),
    }


def source_04_icon() -> tuple[Image.Image, dict]:
    src = ROOT / "source/imagegen/shop_04_light_scissors_comb_r1.png"
    icon = place(crop_alpha(rgba(src), 8), (422, 430, 602, 505))
    return icon, {"icon_source": ref(src), "target_icon_bbox": list(icon.getchannel("A").getbbox())}


def view(image: Image.Image, width: int, height: int, display: int, foot_y: int) -> Image.Image:
    bg = Image.new("RGBA", (width, height), (24, 43, 79, 255))
    bg.alpha_composite(image.resize((display, display), Image.Resampling.LANCZOS), ((width-display)//2, foot_y-round(900*display/1024)))
    return bg.convert("RGB")


def checker(size: tuple[int, int]) -> Image.Image:
    bg = Image.new("RGBA", size, (206, 209, 215, 255))
    draw = ImageDraw.Draw(bg)
    for y in range(0, size[1], 16):
        for x in range(0, size[0], 16):
            if (x//16 + y//16) % 2 == 0:
                draw.rectangle((x, y, x+15, y+15), fill=(240, 241, 244, 255))
    return bg


def assemble_shop(num: int) -> tuple[list[str], dict]:
    key = f"shop_{num:02d}"
    src_dir = PREV / f"source/{key}_light_r3_psd_work/layer_sources"
    layers_dir = WORK / key / "layer_sources"
    layers_dir.mkdir(parents=True, exist_ok=True)
    names: list[str] = []
    info: dict = {}
    if num == 2:
        names = ["reference_source", "umbrella", "operating_objects", "light", "ground_contact"]
        for n in names:
            copy_exact(src_dir / f"{n}.png", layers_dir / f"{n}.png")
        board, spoon, glyph, info = source_02_layers()
        added = ["sign_board_cartoon_v04", "sign_spoon_syrup_painted_v04", "sign_glyph_formal_sugar_v04"]
        images = [board, spoon, glyph]
    elif num == 3:
        names = ["reference_source", "ground_contact", "body_structure", "canopy", "smoke", "operating_objects", "light", "sign_hardware_reused", "sign_board_reused"]
        for n in names:
            copy_exact(src_dir / f"{n}.png", layers_dir / f"{n}.png")
        glyph_src = ROOT / "source/parallel_shop_03/sign_glyph_xiankao_candidate_v04.png"
        images = [rgba(glyph_src)]
        added = ["sign_glyph_xiankao_same_font_v04"]
        info = {"two_glyph_source": ref(glyph_src), "two_glyph_bbox": list(images[0].getchannel("A").getbbox()), "font_sha256": sha(ROOT.parent / "v0.2/source/rights/ZCOOLKuaiLe-Regular.ttf")}
    elif num == 4:
        names = ["reference_source", "ground_contact", "body_facade", "body_roof", "interior", "light", "front", "sign_hardware_reused", "sign_board_reused"]
        for n in names:
            copy_exact(src_dir / f"{n}.png", layers_dir / f"{n}.png")
        icon, info = source_04_icon()
        images = [icon]
        added = ["sign_icon_scissors_comb_light_v04"]
    else:
        raise ValueError(num)
    for n, im in zip(added, images):
        im.save(layers_dir / f"{n}.png")
    names += added
    sign = empty()
    for n in names:
        if n.startswith("sign_"):
            sign.alpha_composite(rgba(layers_dir / f"{n}.png"))
    sign_path = EXP / f"tex_u03_{key}_sign_sign_polish_v04.png"
    sign.save(sign_path)
    manifest = {"canvas": {"width": 1024, "height": 1024, "composite_background": "#182B4F"},
                "layers": [{"name": n, "file": f"layer_sources/{n}.png", "remove_background": "none", "fit": "none"} for n in names]}
    mf = WORK / key / "manifest.json"
    mf.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    psd = ROOT / "psd" / f"{key}_sign_polish_v04.psd"
    flat = PRE / f"{key}_psd_flat.png"
    subprocess.run([sys.executable, str(SKILL), "assemble", "--manifest", str(mf), "--output", str(psd), "--preview", str(flat)], check=True, capture_output=True, text=True)
    body = rgba(EXP / f"tex_u03_{key}_body_sign_polish_v04.png")
    combined = body.copy(); combined.alpha_composite(sign)
    view(combined, 1024, 1024, 1024, 900).save(flat)
    subprocess.run([sys.executable, str(FINALIZE), "--psd", str(psd), "--composite-from", str(flat), "--manifest", str(mf), "--report", str(WORK / key / "PSD_VISIBILITY_REPORT.json")], check=True, capture_output=True, text=True)
    with Image.open(psd) as check:
        assert check.size == (1024, 1024)
    return names, info


def main() -> None:
    assert sha(ROOT / "PRODUCTION_PLAN_AND_ANCHORS.md") == "6EC78613C66311B1D85B04E7A5AE55C9CC8BE6E21DA27B46C634D2C302A67183"
    for p in (EXP, PRE, ROOT / "psd", WORK):
        p.mkdir(parents=True, exist_ok=True)
    font = ImageFont.truetype(str(FONT), 23)
    small = ImageFont.truetype(str(FONT), 16)
    overview = Image.new("RGBA", (1536, 1024), (24, 43, 79, 255))
    cuts = Image.new("RGBA", (512, 1536), (24, 43, 79, 255))
    od, cd = ImageDraw.Draw(overview), ImageDraw.Draw(cuts)
    result = {"batch_id": "U03-SHOP-SIGN-POLISH-V04", "revision": "v0.4", "status": "GATE2_USER_REVIEW_CANDIDATE", "canvas_px": [1024, 1024], "foot_px": [512, 900], "source_manifest_v03_sha256": sha(PREV / "CUT_MANIFEST.json"), "shops": {}}
    diffs = {"batch_id": result["batch_id"], "shops": {}}
    for num in range(1, 7):
        key = f"shop_{num:02d}"
        old = OLD["shops"][key]
        psd = ROOT / "psd" / f"{key}_sign_polish_v04.psd"
        body = EXP / f"tex_u03_{key}_body_sign_polish_v04.png"
        sign = EXP / f"tex_u03_{key}_sign_sign_polish_v04.png"
        copy_exact(PREV / old["body"]["path"], body)
        if num in (1, 5, 6):
            copy_exact(PREV / old["psd"]["path"], psd)
            copy_exact(PREV / old["sign"]["path"], sign)
            layers, info = old["psd_layers_bottom_to_top"], {"inherited_all_exact_bytes_from_v03": True}
        else:
            layers, info = assemble_shop(num)
        bi, si = rgba(body), rgba(sign)
        with Image.open(psd) as check:
            assert check.size == (1024, 1024)
        assert bi.size == si.size == (1024, 1024)
        combined = bi.copy(); combined.alpha_composite(si)
        rec = PRE / f"{key}_recomposed.png"
        combined.save(rec)
        old_b, old_s = rgba(PREV / old["body"]["path"]), rgba(PREV / old["sign"]["path"])
        assert sha(body) == old["body"]["sha256"]
        changed = np.any(np.asarray(combined) != np.asarray(Image.alpha_composite(old_b, old_s)), axis=2)
        allowed = (np.asarray(old_s.getchannel("A")) > 0) | (np.asarray(si.getchannel("A")) > 0)
        outside = int(np.count_nonzero(changed & ~allowed))
        assert outside == 0, (key, outside)
        views = []
        for width, height, display, foot in ((390, 844, 316, 530), (720, 1280, 584, 800)):
            vp = PRE / f"{key}_{width}x{height}.png"
            view(combined, width, height, display, foot).save(vp)
            views.append({**ref(vp), "canvas_px": [width, height], "display_px": display, "foot_y_px": foot})
        x, y = ((num-1)%3)*512, ((num-1)//3)*512
        overview.alpha_composite(combined.resize((512, 512), Image.Resampling.LANCZOS), (x, y))
        for col, part in enumerate((bi, si)):
            cell = checker((256, 256)); cell.alpha_composite(part.resize((256, 256), Image.Resampling.LANCZOS))
            cuts.alpha_composite(cell, (col*256, (num-1)*256))
        od.text((x+16, y+10), f"{num:02d} {NAMES[num-1]}", font=font, fill=(255,233,190,255), stroke_width=1, stroke_fill=(26,35,55,255))
        cd.text((6, (num-1)*256+4), f"{num:02d} {NAMES[num-1]} 主体", font=small, fill=(30,36,47,255))
        cd.text((262, (num-1)*256+4), f"{num:02d} {NAMES[num-1]} 牌匾", font=small, fill=(30,36,47,255))
        result["shops"][key] = {"name_zh": NAMES[num-1], "asset_ids": old["asset_ids"], "psd": {**ref(psd), "inherited_exact_bytes_from_v03": sha(psd)==old["psd"]["sha256"]}, "body": {**ref(body), "alpha_bbox_xyxy": list(bi.getchannel("A").getbbox()), "inherited_exact_bytes_from_v03": True}, "sign": {**ref(sign), "alpha_bbox_xyxy": list(si.getchannel("A").getbbox()), "inherited_exact_bytes_from_v03": sha(sign)==old["sign"]["sha256"]}, "recomposition": ref(rec), "views": views, "psd_layers_bottom_to_top": layers, "source_notes": info}
        diffs["shops"][key] = {"changed_composite_pixels_vs_v03": int(changed.sum()), "changed_outside_old_or_new_sign_pixels": outside, "body_byte_identical_to_v03": True, "sign_byte_identical_to_v03": sha(sign)==old["sign"]["sha256"], "psd_byte_identical_to_v03": sha(psd)==old["psd"]["sha256"], "old_sign_bbox": list(old_s.getchannel("A").getbbox()), "new_sign_bbox": list(si.getchannel("A").getbbox())}
    over = PRE / "six_shop_same_scale_overview.png"
    cut = PRE / "twelve_slices_checker_sheet.png"
    overview.save(over); cuts.save(cut)
    result["same_scale_overview"] = ref(over)
    result["twelve_slices_checker_sheet"] = ref(cut)
    comparison = PRE / "three_signs_v03_v04_native_1x.png"
    if comparison.is_file():
        result["three_signs_native_1x_comparison"] = ref(comparison)
    (ROOT / "CUT_MANIFEST.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    (ROOT / "DIFF_AND_RECOMPOSITION_REPORT.json").write_text(json.dumps(diffs, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"manifest": sha(ROOT/"CUT_MANIFEST.json"), "outside_sign_difference_pixels": {k:v["changed_outside_old_or_new_sign_pixels"] for k,v in diffs["shops"].items()}, "overview": str(over)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
