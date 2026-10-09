"""Build the approved middle-brightness 01 sample from v0.2 body layers.

Only the right-eave sign is replaced. The high-resolution sign is an imagegen
source, resized once and partitioned into editable visible-pixel raster layers.
"""
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
BASE = OLD / "source/psd_work_r2/shop_01/layer_sources"
RAW = ROOT / "source/imagegen/shop_01_sign_light_r1.png"
WORK = ROOT / "source/shop_01_light_r3_psd_work"
LAYERS = WORK / "layer_sources"
EXP = ROOT / "exports/shop_01_light_r3"
PRE = ROOT / "preview/shop_01_light_r3"
PSD = ROOT / "psd/shop_01_milk_tea_light_r3_v03.psd"
SKILL = Path("C:/Users/admin/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py")
FINALIZE = ROOT.parent / "v0.1/source/shop_01/finalize_psd_visibility.py"
BODY_NAMES = ["ground_contact", "body_facade", "body_roof", "interior", "light", "front", "body_repair_01"]
SIGN_NAMES = ["sign_hardware_r3", "sign_board_r3", "sign_logo_r3"]


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def empty() -> Image.Image:
    return Image.new("RGBA", (1024, 1024))


def gate() -> None:
    expected = {
        "PRODUCTION_PLAN.md": "2830BC2DFEAD18A37952E46E1D87AD426097186F67D54858EBDBD2EB5615026E",
        "VISUAL_ANCHORS.md": "98FD35F7D35ABBB886C11FC8FECBE4CC12B737478BAB3E3B7F764B2CDB67EA53",
        "LIGHTING_AND_STYLE_CORRECTION.md": "04239BFC37616ED90AA8C1E8DF767D4EDF440855CDB39865723882400ED89D1E",
    }
    for filename, digest in expected.items():
        assert sha(ROOT / filename) == digest, filename
    approval = json.loads(Path("tasks/U03-SHOP-VISUAL-FIDELITY-003/ARTIFACT_APPROVAL_LIGHTING_UPDATE.json").read_text(encoding="utf-8"))
    assert approval["status"] == "USER_APPROVED"
    tech = json.loads(Path("deliverables/tech_lead/U03-SHOP-VISUAL-FIDELITY-003/v0.1/TECH_PRODUCTION_CHANGE_PRESIGN_V03.json").read_text(encoding="utf-8"))
    art = json.loads((ROOT / "ART_PRODUCTION_CHANGE_PRESIGN.json").read_text(encoding="utf-8"))
    assert tech["decision"] == "PRESIGNED_FOR_SHOP_01_BRIGHTNESS_REVISION"
    assert tech["input_sha256"] == expected | {"user_seen_three_panel_local_correspondence": tech["input_sha256"]["user_seen_three_panel_local_correspondence"], "selected_middle_v02_recomposition": tech["input_sha256"]["selected_middle_v02_recomposition"], "v02_editable_psd": tech["input_sha256"]["v02_editable_psd"]}
    assert art["batch_id"] == tech["batch_id"]


def view(image: Image.Image, width: int, height: int, display: int, foot_y: int) -> Image.Image:
    bg = Image.new("RGBA", (width, height), (24, 43, 79, 255))
    scaled = image.resize((display, display), Image.Resampling.LANCZOS)
    bg.alpha_composite(scaled, ((width-display)//2, foot_y-round(900*display/1024)))
    return bg.convert("RGB")


def main() -> None:
    gate()
    for path in (WORK, LAYERS, EXP, PRE, PSD.parent):
        path.mkdir(parents=True, exist_ok=True)
    for name in ("reference_source", *BODY_NAMES):
        shutil.copy2(BASE / f"{name}.png", LAYERS / f"{name}.png")
    original_body = OLD / "exports/sign_revision_v02_final/tex_u03_shop_01_body_sign_revision_v02.png"
    body_file = EXP / "tex_u03_shop_01_body_light_r3_v03.png"
    shutil.copy2(original_body, body_file)
    body = rgba(body_file)
    assert sha(original_body) == sha(body_file)

    raw = rgba(RAW)
    pixels = np.asarray(raw).copy()
    pixels[pixels[:, :, 3] < 8] = 0
    cleaned = Image.fromarray(pixels, "RGBA")
    crop_bbox = cleaned.getchannel("A").getbbox()
    assert crop_bbox is not None
    crop = cleaned.crop(crop_bbox).resize((122, 202), Image.Resampling.LANCZOS)
    sign = empty()
    sign.alpha_composite(crop, (821, 449))
    sign_file = EXP / "tex_u03_shop_01_sign_light_r3_v03.png"
    sign.save(sign_file)

    # Visible-pixel partition of the exact sign export. This makes rail,
    # board and cup/leaf mark individually selectable without resampling seams.
    sp = np.asarray(sign).copy()
    yy, xx = np.indices((1024, 1024))
    present = sp[:, :, 3] > 0
    hardware = present & (yy < 495)
    logo = present & (yy >= 516) & (yy < 640) & (xx >= 841) & (xx < 927)
    board = present & ~hardware & ~logo
    for name, mask in zip(SIGN_NAMES, (hardware, board, logo)):
        part = sp.copy()
        part[~mask] = 0
        Image.fromarray(part, "RGBA").save(LAYERS / f"{name}.png")
    assembled_sign = empty()
    for name in SIGN_NAMES:
        assembled_sign.alpha_composite(rgba(LAYERS / f"{name}.png"))
    assert np.array_equal(np.asarray(assembled_sign), np.asarray(sign))
    combined = body.copy()
    combined.alpha_composite(sign)
    recomposed = PRE / "shop_01_recomposed_light_r3_v03.png"
    combined.save(recomposed)

    names = ["reference_source", *BODY_NAMES, *SIGN_NAMES]
    manifest = {"canvas": {"width": 1024, "height": 1024, "composite_background": "#182B4F"},
                "layers": [{"name": name, "file": f"layer_sources/{name}.png", "remove_background": "none", "fit": "none"} for name in names]}
    mf = WORK / "manifest.json"
    mf.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    flat = PRE / "shop_01_psd_flat_light_r3_v03.png"
    subprocess.run([sys.executable, str(SKILL), "assemble", "--manifest", str(mf), "--output", str(PSD), "--preview", str(flat)], check=True, capture_output=True, text=True)
    view(combined, 1024, 1024, 1024, 900).save(flat)
    subprocess.run([sys.executable, str(FINALIZE), "--psd", str(PSD), "--composite-from", str(flat), "--manifest", str(mf), "--report", str(WORK / "PSD_VISIBILITY_REPORT.json")], check=True, capture_output=True, text=True)
    with Image.open(PSD) as psd:
        assert psd.size == (1024, 1024)

    previous = rgba(OLD / "preview/sign_revision_v02_final/shop_01_recomposed.png")
    target = rgba(ROOT / "preview/shop_01_sample/target_01_normalized_comparison_only.png")
    for width, height, display, foot in ((390, 844, 316, 530), (720, 1280, 584, 800)):
        sheet = Image.new("RGB", (width * 3, height), (24, 43, 79))
        for column, image in enumerate((target, previous, combined)):
            sheet.paste(view(image, width, height, display, foot), (column * width, 0))
        sheet.save(PRE / f"shop_01_target_v02_light_r3_{width}x{height}.png")
    same = Image.new("RGB", (3072, 1024), (24, 43, 79))
    for column, image in enumerate((target, previous, combined)):
        same.paste(view(image, 1024, 1024, 1024, 900), (column * 1024, 0))
    same.save(PRE / "shop_01_target_v02_light_r3_same_canvas.png")

    b = np.asarray(body)
    old_b = np.asarray(rgba(original_body))
    assert np.array_equal(b, old_b)
    report = {"batch_id": "U03-SHOP-FAITHFUL-REDRAW-V03", "revision": "r3-light-middle", "sample": "shop_01",
              "body_reused_byte_identical": True, "body_sha256": sha(body_file),
              "raw_sign_source": str(RAW.relative_to(ROOT)), "raw_sign_sha256": sha(RAW),
              "raw_alpha8_bbox": list(crop_bbox), "sign_placed_bbox": list(sign.getchannel("A").getbbox()),
              "psd": {"path": str(PSD.relative_to(ROOT)), "sha256": sha(PSD)},
              "body": {"path": str(body_file.relative_to(ROOT)), "sha256": sha(body_file)},
              "sign": {"path": str(sign_file.relative_to(ROOT)), "sha256": sha(sign_file)},
              "recomposition": {"path": str(recomposed.relative_to(ROOT)), "sha256": sha(recomposed)},
              "same_canvas": {"path": str((PRE / "shop_01_target_v02_light_r3_same_canvas.png").relative_to(ROOT)), "sha256": sha(PRE / "shop_01_target_v02_light_r3_same_canvas.png")},
              "layers_bottom_to_top": names, "sign_partition_exact": True,
              "editability_limit": "Board/logo are exclusive visible-pixel raster regions; obscured backside is not reconstructed.",
              "reference_alpha_limit": "Target black-background extraction is comparison-only; not a formal texture or exact alpha reference."}
    (ROOT / "SAMPLE_BUILD_REPORT_LIGHT_R3.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
