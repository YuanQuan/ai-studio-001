"""Assemble the small sugar-painting board, spoon and approved 糖 glyph."""
from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OLD = ROOT.parent / "v0.2"
BASE = OLD / "source/psd_work_r2/shop_02/layer_sources"
CANDIDATES = ROOT / "source/parallel_shop_02"
WORK = ROOT / "source/shop_02_light_r3_psd_work"
LAYERS = WORK / "layer_sources"
EXP = ROOT / "exports/shop_02_light_r3"
PRE = ROOT / "preview/shop_02_light_r3"
PSD = ROOT / "psd/shop_02_sugar_light_r3_v03.psd"
SKILL = Path("C:/Users/admin/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py")
FINALIZE = ROOT.parent / "v0.1/source/shop_01/finalize_psd_visibility.py"
BODY_NAMES = ["umbrella", "operating_objects", "light", "ground_contact"]
SIGN_NAMES = ["sign_board_light_r3", "sign_spoon_syrup_light_r3", "sign_glyph_reused_sugar_small_r3"]


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def empty() -> Image.Image:
    return Image.new("RGBA", (1024, 1024))


def placed_raw(path: Path, box: tuple[int, int, int, int]) -> tuple[Image.Image, tuple[int, int, int, int]]:
    raw = rgba(path)
    pixels = np.asarray(raw).copy()
    pixels[pixels[:, :, 3] < 16] = 0
    clean = Image.fromarray(pixels, "RGBA")
    crop_bbox = clean.getchannel("A").getbbox()
    assert crop_bbox is not None
    crop = clean.crop(crop_bbox).resize((box[2]-box[0], box[3]-box[1]), Image.Resampling.LANCZOS)
    image = empty()
    image.alpha_composite(crop, (box[0], box[1]))
    return image, crop_bbox


def view(image: Image.Image, width: int, height: int, display: int, foot_y: int) -> Image.Image:
    bg = Image.new("RGBA", (width, height), (24, 43, 79, 255))
    bg.alpha_composite(image.resize((display, display), Image.Resampling.LANCZOS), ((width-display)//2, foot_y-round(900*display/1024)))
    return bg.convert("RGB")


def main() -> None:
    source_manifest = json.loads((CANDIDATES / "SOURCE_MANIFEST.json").read_text(encoding="utf-8"))
    entries = {item["path"]: item["sha256"] for item in source_manifest["files"]}
    for name in ("board_tall_raw.png", "spoon_syrup_raw.png"):
        assert sha(CANDIDATES / name) == entries[name]
    glyph_source = BASE / "sign_glyph_reused_sugar.png"
    assert sha(glyph_source) == "671874A020AFBC180B458BA1EAF26641E37BE5A5018FCA442D0C2FED575A2645"
    tech = json.loads(Path("deliverables/tech_lead/U03-SHOP-VISUAL-FIDELITY-003/v0.1/TECH_BATCH_EXPANSION_PRESIGN_02_06.json").read_text(encoding="utf-8"))
    assert tech["decision"] == "PRESIGNED_FOR_SHOPS_02_TO_06"
    for p in (WORK, LAYERS, EXP, PRE, PSD.parent):
        p.mkdir(parents=True, exist_ok=True)
    for name in ("reference_source", *BODY_NAMES):
        shutil.copy2(BASE / f"{name}.png", LAYERS / f"{name}.png")
    original_body = OLD / "exports/sign_revision_v02_final/tex_u03_shop_02_body_sign_revision_v02.png"
    body_file = EXP / "tex_u03_shop_02_body_light_r3_v03.png"
    shutil.copy2(original_body, body_file)
    body = rgba(body_file)
    assert sha(body_file) == sha(original_body)
    board, board_crop = placed_raw(CANDIDATES / "board_tall_raw.png", (685, 627, 820, 890))
    spoon, spoon_crop = placed_raw(CANDIDATES / "spoon_syrup_raw.png", (710, 647, 794, 737))
    glyph_old = rgba(glyph_source)
    glyph_bbox = glyph_old.getchannel("A").getbbox()
    assert glyph_bbox == (706, 765, 799, 859)
    glyph_scaled = glyph_old.crop(glyph_bbox).resize((78, 79), Image.Resampling.LANCZOS)
    glyph = empty()
    glyph.alpha_composite(glyph_scaled, (713, 751))
    for name, image in zip(SIGN_NAMES, (board, spoon, glyph)):
        image.save(LAYERS / f"{name}.png")
    sign = empty()
    for name in SIGN_NAMES:
        sign.alpha_composite(rgba(LAYERS / f"{name}.png"))
    sign_file = EXP / "tex_u03_shop_02_sign_light_r3_v03.png"
    sign.save(sign_file)
    combined = body.copy()
    combined.alpha_composite(sign)
    rec = PRE / "shop_02_recomposed_light_r3_v03.png"
    combined.save(rec)
    names = ["reference_source", *BODY_NAMES, *SIGN_NAMES]
    manifest = {"canvas": {"width": 1024, "height": 1024, "composite_background": "#182B4F"},
                "layers": [{"name": name, "file": f"layer_sources/{name}.png", "remove_background": "none", "fit": "none"} for name in names]}
    mf = WORK / "manifest.json"
    mf.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    flat = PRE / "shop_02_psd_flat_light_r3_v03.png"
    subprocess.run([sys.executable, str(SKILL), "assemble", "--manifest", str(mf), "--output", str(PSD), "--preview", str(flat)], check=True, capture_output=True, text=True)
    view(combined, 1024, 1024, 1024, 900).save(flat)
    subprocess.run([sys.executable, str(FINALIZE), "--psd", str(PSD), "--composite-from", str(flat), "--manifest", str(mf), "--report", str(WORK / "PSD_VISIBILITY_REPORT.json")], check=True, capture_output=True, text=True)
    with Image.open(PSD) as opened:
        assert opened.size == (1024, 1024)
    for width, height, display, foot in ((390, 844, 316, 530), (720, 1280, 584, 800)):
        view(combined, width, height, display, foot).save(PRE / f"shop_02_{width}x{height}.png")
    old_sign = rgba(OLD / "exports/sign_revision_v02_final/tex_u03_shop_02_sign_sign_revision_v02.png")
    changed = np.any(np.asarray(old_sign) != np.asarray(sign), axis=2)
    ys, xs = np.where(changed)
    report = {"batch_id": "U03-SHOP-FAITHFUL-REDRAW-V03", "shop": "shop_02", "revision": "light-r3",
              "body_reused_byte_identical": True, "body_sha256": sha(body_file),
              "board_source": str((CANDIDATES / "board_tall_raw.png").relative_to(ROOT)), "board_source_sha256": sha(CANDIDATES / "board_tall_raw.png"),
              "spoon_source": str((CANDIDATES / "spoon_syrup_raw.png").relative_to(ROOT)), "spoon_source_sha256": sha(CANDIDATES / "spoon_syrup_raw.png"),
              "formal_glyph_source": str(glyph_source.relative_to(ROOT.parent)), "formal_glyph_sha256": sha(glyph_source),
              "board_raw_alpha16_bbox": list(board_crop), "spoon_raw_alpha16_bbox": list(spoon_crop),
              "board_placed_bbox": list(board.getchannel("A").getbbox()), "spoon_placed_bbox": list(spoon.getchannel("A").getbbox()),
              "glyph_placed_bbox": list(glyph.getchannel("A").getbbox()),
              "sign_changed_bbox_vs_v02": [int(xs.min()), int(ys.min()), int(xs.max()+1), int(ys.max()+1)],
              "psd": {"path": str(PSD.relative_to(ROOT)), "sha256": sha(PSD)},
              "body": {"path": str(body_file.relative_to(ROOT)), "sha256": sha(body_file)},
              "sign": {"path": str(sign_file.relative_to(ROOT)), "sha256": sha(sign_file), "alpha_bbox": list(sign.getchannel("A").getbbox())},
              "recomposition": {"path": str(rec.relative_to(ROOT)), "sha256": sha(rec)},
              "layers_bottom_to_top": names,
              "editability_limit": "Board, spoon/syrup and resized formal 糖 glyph are three independent raster layers; source PNGs are preserved, not vector objects."}
    (ROOT / "SHOP_02_BUILD_REPORT_LIGHT_R3.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
