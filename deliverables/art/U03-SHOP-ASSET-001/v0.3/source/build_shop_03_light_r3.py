"""Install the licensed 现 glyph candidate over the inherited grill sign."""
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
BASE = OLD / "source/psd_work_final/shop_03/layer_sources"
WORK = ROOT / "source/shop_03_light_r3_psd_work"
LAYERS = WORK / "layer_sources"
EXP = ROOT / "exports/shop_03_light_r3"
PRE = ROOT / "preview/shop_03_light_r3"
PSD = ROOT / "psd/shop_03_grill_light_r3_v03.psd"
CANDIDATE = ROOT / "source/parallel_shop_03/sign_glyph_xian_candidate_v03.png"
SKILL = Path("C:/Users/admin/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py")
FINALIZE = ROOT.parent / "v0.1/source/shop_01/finalize_psd_visibility.py"
BODY_NAMES = ["body_structure", "canopy", "smoke", "operating_objects", "ground_contact", "light"]
SIGN_NAMES = ["sign_hardware_reused", "sign_board_reused", "sign_glyph_reused_kao", "sign_glyph_official_xian_r3"]


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def empty() -> Image.Image:
    return Image.new("RGBA", (1024, 1024))


def view(image: Image.Image, width: int, height: int, display: int, foot_y: int) -> Image.Image:
    bg = Image.new("RGBA", (width, height), (24, 43, 79, 255))
    bg.alpha_composite(image.resize((display, display), Image.Resampling.LANCZOS), ((width-display)//2, foot_y-round(900*display/1024)))
    return bg.convert("RGB")


def main() -> None:
    assert sha(CANDIDATE) == "DD59BB2D3B1535F6305C481A7CC2223A19789476C08146871E3E54A62405F84E"
    tech = json.loads(Path("deliverables/tech_lead/U03-SHOP-VISUAL-FIDELITY-003/v0.1/TECH_BATCH_EXPANSION_PRESIGN_02_06.json").read_text(encoding="utf-8"))
    assert tech["decision"] == "PRESIGNED_FOR_SHOPS_02_TO_06"
    for p in (WORK, LAYERS, EXP, PRE, PSD.parent):
        p.mkdir(parents=True, exist_ok=True)
    for name in ("reference_source", *BODY_NAMES, *SIGN_NAMES[:3]):
        shutil.copy2(BASE / f"{name}.png", LAYERS / f"{name}.png")
    shutil.copy2(CANDIDATE, LAYERS / f"{SIGN_NAMES[-1]}.png")
    original_body = OLD / "exports/sign_revision_v02_final/tex_u03_shop_03_body_sign_revision_v02.png"
    body_file = EXP / "tex_u03_shop_03_body_light_r3_v03.png"
    shutil.copy2(original_body, body_file)
    body = rgba(body_file)
    assert sha(body_file) == sha(original_body)
    sign = empty()
    for name in SIGN_NAMES:
        sign.alpha_composite(rgba(LAYERS / f"{name}.png"))
    sign_file = EXP / "tex_u03_shop_03_sign_light_r3_v03.png"
    sign.save(sign_file)
    combined = body.copy()
    combined.alpha_composite(sign)
    rec = PRE / "shop_03_recomposed_light_r3_v03.png"
    combined.save(rec)
    names = ["reference_source", *BODY_NAMES, *SIGN_NAMES]
    manifest = {"canvas": {"width": 1024, "height": 1024, "composite_background": "#182B4F"},
                "layers": [{"name": name, "file": f"layer_sources/{name}.png", "remove_background": "none", "fit": "none"} for name in names]}
    mf = WORK / "manifest.json"
    mf.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    flat = PRE / "shop_03_psd_flat_light_r3_v03.png"
    subprocess.run([sys.executable, str(SKILL), "assemble", "--manifest", str(mf), "--output", str(PSD), "--preview", str(flat)], check=True, capture_output=True, text=True)
    view(combined, 1024, 1024, 1024, 900).save(flat)
    subprocess.run([sys.executable, str(FINALIZE), "--psd", str(PSD), "--composite-from", str(flat), "--manifest", str(mf), "--report", str(WORK / "PSD_VISIBILITY_REPORT.json")], check=True, capture_output=True, text=True)
    with Image.open(PSD) as opened:
        assert opened.size == (1024, 1024)
    for width, height, display, foot in ((390, 844, 316, 530), (720, 1280, 584, 800)):
        view(combined, width, height, display, foot).save(PRE / f"shop_03_{width}x{height}.png")
    old_sign = rgba(OLD / "exports/sign_revision_v02_final/tex_u03_shop_03_sign_sign_revision_v02.png")
    changed = np.any(np.asarray(old_sign) != np.asarray(sign), axis=2)
    ys, xs = np.where(changed)
    report = {"batch_id": "U03-SHOP-FAITHFUL-REDRAW-V03", "shop": "shop_03", "revision": "light-r3",
              "body_reused_byte_identical": True, "body_sha256": sha(body_file),
              "candidate_xian_source": str(CANDIDATE.relative_to(ROOT)), "candidate_xian_sha256": sha(CANDIDATE),
              "official_font_source_sha256": "812A6FC1FE54B6D73A419245C32DFEBA8AA33104D5BE90D1CF6AF082007CB71D",
              "original_kao_reused_sha256": sha(BASE / "sign_glyph_reused_kao.png"),
              "sign_changed_bbox_vs_v02": [int(xs.min()), int(ys.min()), int(xs.max()+1), int(ys.max()+1)],
              "psd": {"path": str(PSD.relative_to(ROOT)), "sha256": sha(PSD)},
              "body": {"path": str(body_file.relative_to(ROOT)), "sha256": sha(body_file)},
              "sign": {"path": str(sign_file.relative_to(ROOT)), "sha256": sha(sign_file), "alpha_bbox": list(sign.getchannel("A").getbbox())},
              "recomposition": {"path": str(rec.relative_to(ROOT)), "sha256": sha(rec)},
              "layers_bottom_to_top": names,
              "editability_limit": "现 is a licensed-font-derived independent raster glyph; original 烤 and signboard remain separate original-pixel raster layers."}
    (ROOT / "SHOP_03_BUILD_REPORT_LIGHT_R3.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
