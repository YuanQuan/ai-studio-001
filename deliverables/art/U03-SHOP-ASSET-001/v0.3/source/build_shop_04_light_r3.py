"""Replace only the barber sign icon with a clear high-resolution cutout."""
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
BASE = OLD / "source/psd_work_final/shop_04/layer_sources"
WORK = ROOT / "source/shop_04_light_r3_psd_work"
LAYERS = WORK / "layer_sources"
EXP = ROOT / "exports/shop_04_light_r3"
PRE = ROOT / "preview/shop_04_light_r3"
PSD = ROOT / "psd/shop_04_barber_light_r3_v03.psd"
RAW = ROOT / "source/imagegen/shop_04_scissors_comb_light_r1.png"
SKILL = Path("C:/Users/admin/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py")
FINALIZE = ROOT.parent / "v0.1/source/shop_01/finalize_psd_visibility.py"
BODY_NAMES = ["ground_contact", "body_facade", "body_roof", "interior", "light", "front"]
SIGN_NAMES = ["sign_hardware_reused", "sign_board_reused", "sign_icon_scissors_comb_light_r3"]


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def empty() -> Image.Image:
    return Image.new("RGBA", (1024, 1024))


def gate() -> None:
    assert sha(ROOT / "FULL_BATCH_LIGHT_R3_PRODUCTION_ADDENDUM.md") == "EAC66BC578A272CAD147B8E0587CC3279F7670C66C225D8903BEA6A7E34FDE9F"
    tech = json.loads(Path("deliverables/tech_lead/U03-SHOP-VISUAL-FIDELITY-003/v0.1/TECH_BATCH_EXPANSION_PRESIGN_02_06.json").read_text(encoding="utf-8"))
    art = json.loads((ROOT / "ART_BATCH_EXPANSION_PRESIGN_02_06.json").read_text(encoding="utf-8"))
    assert tech["decision"] == art["decision"] == "PRESIGNED_FOR_SHOPS_02_TO_06"
    assert tech["batch_id"] == art["batch_id"] == "U03-SHOP-FAITHFUL-REDRAW-V03"


def view(image: Image.Image, width: int, height: int, display: int, foot_y: int) -> Image.Image:
    bg = Image.new("RGBA", (width, height), (24, 43, 79, 255))
    bg.alpha_composite(image.resize((display, display), Image.Resampling.LANCZOS), ((width-display)//2, foot_y-round(900*display/1024)))
    return bg.convert("RGB")


def main() -> None:
    gate()
    for p in (WORK, LAYERS, EXP, PRE, PSD.parent):
        p.mkdir(parents=True, exist_ok=True)
    for name in ("reference_source", *BODY_NAMES, *SIGN_NAMES[:2]):
        shutil.copy2(BASE / f"{name}.png", LAYERS / f"{name}.png")
    original_body = OLD / "exports/sign_revision_v02_final/tex_u03_shop_04_body_sign_revision_v02.png"
    body_file = EXP / "tex_u03_shop_04_body_light_r3_v03.png"
    shutil.copy2(original_body, body_file)
    body = rgba(body_file)
    assert sha(original_body) == sha(body_file)

    raw = rgba(RAW)
    pix = np.asarray(raw).copy()
    pix[pix[:, :, 3] < 8] = 0
    clean = Image.fromarray(pix, "RGBA")
    bbox = clean.getchannel("A").getbbox()
    assert bbox is not None
    graphic = clean.crop(bbox).resize((225, 94), Image.Resampling.LANCZOS)
    icon = empty()
    icon.alpha_composite(graphic, (400, 422))
    icon.save(LAYERS / f"{SIGN_NAMES[-1]}.png")
    sign = empty()
    for name in SIGN_NAMES:
        sign.alpha_composite(rgba(LAYERS / f"{name}.png"))
    sign_file = EXP / "tex_u03_shop_04_sign_light_r3_v03.png"
    sign.save(sign_file)
    combined = body.copy()
    combined.alpha_composite(sign)
    rec = PRE / "shop_04_recomposed_light_r3_v03.png"
    combined.save(rec)

    names = ["reference_source", *BODY_NAMES, *SIGN_NAMES]
    manifest = {"canvas": {"width": 1024, "height": 1024, "composite_background": "#182B4F"},
                "layers": [{"name": name, "file": f"layer_sources/{name}.png", "remove_background": "none", "fit": "none"} for name in names]}
    mf = WORK / "manifest.json"
    mf.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    flat = PRE / "shop_04_psd_flat_light_r3_v03.png"
    subprocess.run([sys.executable, str(SKILL), "assemble", "--manifest", str(mf), "--output", str(PSD), "--preview", str(flat)], check=True, capture_output=True, text=True)
    view(combined, 1024, 1024, 1024, 900).save(flat)
    subprocess.run([sys.executable, str(FINALIZE), "--psd", str(PSD), "--composite-from", str(flat), "--manifest", str(mf), "--report", str(WORK / "PSD_VISIBILITY_REPORT.json")], check=True, capture_output=True, text=True)
    with Image.open(PSD) as opened:
        assert opened.size == (1024, 1024)
    for width, height, display, foot in ((390, 844, 316, 530), (720, 1280, 584, 800)):
        view(combined, width, height, display, foot).save(PRE / f"shop_04_{width}x{height}.png")
    old_sign = rgba(OLD / "exports/sign_revision_v02_final/tex_u03_shop_04_sign_sign_revision_v02.png")
    op = np.asarray(old_sign); npix = np.asarray(sign)
    changed = np.any(op != npix, axis=2)
    ys, xs = np.where(changed)
    report = {"batch_id": "U03-SHOP-FAITHFUL-REDRAW-V03", "shop": "shop_04", "revision": "light-r3",
              "body_reused_byte_identical": True, "body_sha256": sha(body_file),
              "raw_icon_source": str(RAW.relative_to(ROOT)), "raw_icon_sha256": sha(RAW),
              "icon_raw_alpha8_bbox": list(bbox), "icon_placed_bbox": list(icon.getchannel("A").getbbox()),
              "sign_changed_bbox_vs_v02": [int(xs.min()), int(ys.min()), int(xs.max()+1), int(ys.max()+1)],
              "psd": {"path": str(PSD.relative_to(ROOT)), "sha256": sha(PSD)},
              "body": {"path": str(body_file.relative_to(ROOT)), "sha256": sha(body_file)},
              "sign": {"path": str(sign_file.relative_to(ROOT)), "sha256": sha(sign_file), "alpha_bbox": list(sign.getchannel("A").getbbox())},
              "recomposition": {"path": str(rec.relative_to(ROOT)), "sha256": sha(rec)},
              "layers_bottom_to_top": names,
              "editability_limit": "High-resolution icon is an independent transparent raster layer; the inherited board is a raster layer and is not vector or text-editable."}
    (ROOT / "SHOP_04_BUILD_REPORT_LIGHT_R3.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
