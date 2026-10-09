"""Build U03 01/02 editable sign-revision samples from the approved PSD layer sources.

The reference artwork is used only for individual sign pixels. Existing shop body
layers are copied; 01 receives a small repair solely under the removed sign.
"""
from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OLD = ROOT.parent / "v0.1"
SKILL = Path("C:/Users/admin/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py")
FINALIZE = OLD / "source/shop_01/finalize_psd_visibility.py"
PRE = ROOT / "preview/sign_revision_v02"
EXP = ROOT / "exports/sign_revision_v02"
PSD = ROOT / "psd"
WORK = ROOT / "source/psd_work"
for path in (PRE, EXP, PSD, WORK):
    path.mkdir(parents=True, exist_ok=True)

EXPECTED = {
    "PRODUCTION_PLAN.md": "8C193C9E43B8AE6F89AAC816D06DD70A72BC672E27141FC384A698F5561BFA7D",
    "VISUAL_ANCHORS.md": "32D039DA35BDDB03F83D800CE1DB22B404ABB19D122E45163565AAB9441BAACD",
    "SOURCE_FEASIBILITY.md": "3706A0BF82ADF6142F5EBD95C7CF49247DF46C2758E7D5F403287C2A4A687CE4",
}


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def check_gate() -> None:
    for name, digest in EXPECTED.items():
        assert sha(ROOT / name) == digest, name
    ap = json.loads((Path("tasks/U03-SHOP-SIGN-REVISION-001/ARTIFACT_APPROVAL.json")).read_text(encoding="utf-8"))
    assert ap["status"] == "USER_APPROVED"
    tech = json.loads((Path("deliverables/tech_lead/U03-SHOP-SIGN-REVISION-001/v0.1/TECH_PRODUCTION_PRESIGN_V02.json")).read_text(encoding="utf-8"))
    assert tech["decision"] == "PRESIGNED_FOR_FIRST_SAMPLES"
    assert tech["approved_plan_sha256"] == EXPECTED
    assert tech["canvas_px"] == [1024, 1024] and tech["foot_px"] == [512, 900]
    assert (ROOT / "ART_PRODUCTION_PRESIGN_V02.json").exists()


def empty() -> Image.Image:
    return Image.new("RGBA", (1024, 1024))


def layer_dir(number: int, variant: str) -> Path:
    original = OLD / f"source/psd_work/shop_{number:02d}/{variant}/layer_sources"
    target = WORK / f"shop_{number:02d}/layer_sources"
    target.mkdir(parents=True, exist_ok=True)
    for src in original.glob("*.png"):
        shutil.copy2(src, target / src.name)
    hist = WORK / f"shop_{number:02d}/history"
    hist.mkdir(exist_ok=True)
    for name in ("sign_hardware", "sign_board", "sign_glyph"):
        shutil.copy2(original / f"{name}.png", hist / f"{name}_v01.png")
        empty().save(target / f"{name}.png")
    return target


def reference_cutout(box: tuple[int, int, int, int], mask_fn, size: tuple[int, int]) -> Image.Image:
    ref = Image.open(OLD / "preview/mixed_signs_v04/six_shop_mixed_signs_overview.png").convert("RGBA")
    crop = ref.crop(box)
    mask = Image.new("L", crop.size, 0)
    mask_fn(ImageDraw.Draw(mask))
    # The approved overview has genuinely black gutters. Suppress those pixels
    # inside the hand-traced object outline without changing the sign's paint.
    rgb = np.array(crop, dtype=np.uint8)
    brightness = rgb[:, :, :3].max(axis=2).astype(np.float32)
    black = np.clip((brightness - 7.0) / 20.0, 0, 1)
    a = (np.array(mask, dtype=np.float32) * black).astype(np.uint8)
    crop.putalpha(Image.fromarray(a, "L"))
    return crop.resize(size, Image.Resampling.LANCZOS)


def make_01_sign() -> Image.Image:
    # Board and short hanging chains: approved mixed_signs_v04, top-left cell.
    def outline(d: ImageDraw.ImageDraw) -> None:
        d.rounded_rectangle((1, 13, 60, 97), radius=5, fill=255)
        d.rounded_rectangle((13, 0, 18, 18), radius=2, fill=255)
        d.rounded_rectangle((43, 0, 48, 18), radius=2, fill=255)
    plaque = reference_cutout((364, 226, 425, 324), outline, (122, 196))
    sign = empty()
    sign.alpha_composite(plaque, (821, 455))
    # A short wooden rail joins the two suspension points to the right eave.
    rail = Image.new("RGBA", (1024, 1024))
    d = ImageDraw.Draw(rail)
    d.rounded_rectangle((822, 449, 923, 463), radius=5, fill=(79, 43, 25, 255), outline=(30, 20, 16, 255), width=2)
    d.line((828, 452, 918, 452), fill=(187, 116, 54, 220), width=3)
    rail.alpha_composite(sign)
    return rail


def repair_01(layers: Path) -> tuple[Image.Image, Image.Image, dict]:
    names = ["ground_contact", "body_facade", "body_roof", "interior", "light", "front"]
    body = empty()
    for name in names:
        body.alpha_composite(Image.open(layers / f"{name}.png").convert("RGBA"))
    original_alpha = np.array(body.getchannel("A"), dtype=np.uint8)
    generated = Image.open(ROOT / "source/shop_01_gap_imagegen_raw.png").convert("RGBA").resize((1024, 1024), Image.Resampling.LANCZOS)
    patch = np.array(generated, dtype=np.uint8)
    yy, xx = np.indices((1024, 1024))
    region = (xx >= 346) & (xx < 678) & (yy >= 470) & (yy < 591)
    missing = region & (original_alpha <= 2)
    # A few edge pixels are replaced only where the sign cutout is genuinely
    # absent; this does not transfer imagegen edits to the rest of the shop.
    patch[~missing] = 0
    repair = Image.fromarray(patch, "RGBA")
    repair.save(layers / "body_repair_01.png")
    body.alpha_composite(repair)
    report = {"repair_roi_xyxy": [346, 470, 678, 591], "repaired_pixels": int(missing.sum()),
              "source": "source/shop_01_gap_imagegen_raw.png", "outside_roi_changed": False}
    return body, repair, report


def make_02_sign() -> Image.Image:
    # Approved small, front-facing sugar sign, with spoon, syrup and 糖 intact.
    def outline(d: ImageDraw.ImageDraw) -> None:
        d.rounded_rectangle((1, 4, 63, 115), radius=5, fill=255)
        d.polygon([(5, 111), (17, 111), (16, 126), (4, 126)], fill=255)
        d.polygon([(48, 111), (60, 111), (61, 126), (49, 126)], fill=255)
    plaque = reference_cutout((765, 309, 829, 435), outline, (135, 266))
    sign = empty()
    sign.alpha_composite(plaque, (685, 624))
    return sign


def compose_psd(number: int, layers: Path, body_names: list[str], sign_names: list[str], body: Image.Image, sign: Image.Image, slug: str) -> dict:
    base = f"shop_{number:02d}"
    body_file = EXP / f"tex_u03_{base}_body_sign_revision_v02.png"
    sign_file = EXP / f"tex_u03_{base}_sign_sign_revision_v02.png"
    if number in (2, 3, 4):
        old_bodies = {
            2: "exports/zcool_b92_five_v03/tex_u03_shop_02_body_zcool_b92_v03.png",
            3: "exports/zcool_b92_five_v03/tex_u03_shop_03_body_zcool_b92_v03.png",
            4: "exports/barber_full_redraw_v03/tex_u03_shop_04_body_full_redraw_v03.png",
        }
        old_body = OLD / old_bodies[number]
        shutil.copy2(old_body, body_file)
        assert sha(old_body) == sha(body_file)
    else:
        body.save(body_file)
    sign.save(sign_file)
    recomposed = body.copy()
    recomposed.alpha_composite(sign)
    recomposed_file = PRE / f"{base}_recomposed.png"
    recomposed.save(recomposed_file)
    # Keep original full-frame source hidden; all edited working layers are visible.
    names = ["reference_source", *body_names, *sign_names]
    manifest = {"canvas": {"width": 1024, "height": 1024, "composite_background": "#182b4f"},
                "layers": [{"name": n, "file": f"layer_sources/{n}.png", "remove_background": "none", "fit": "none"} for n in names]}
    man_file = layers.parent / "manifest.json"
    man_file.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    psd_file = PSD / f"{base}_{slug}_sign_revision_v02.psd"
    flat = PRE / f"{base}_psd_flat.png"
    subprocess.run([sys.executable, str(SKILL), "assemble", "--manifest", str(man_file), "--output", str(psd_file), "--preview", str(flat)], check=True)
    # The bggg writer does not mark the archived reference hidden by default.
    rgb = Image.new("RGBA", (1024, 1024), (24, 43, 79, 255))
    rgb.alpha_composite(recomposed)
    rgb.convert("RGB").save(flat)
    report = layers.parent / "PSD_VISIBILITY_REPORT.json"
    subprocess.run([sys.executable, str(FINALIZE), "--psd", str(psd_file), "--composite-from", str(flat), "--manifest", str(man_file), "--report", str(report)], check=True, capture_output=True, text=True)
    return {"psd": str(psd_file.relative_to(ROOT)), "body": str(body_file.relative_to(ROOT)), "sign": str(sign_file.relative_to(ROOT)),
            "recomposition": str(recomposed_file.relative_to(ROOT)), "body_bbox": body.getchannel("A").getbbox(),
            "sign_bbox": sign.getchannel("A").getbbox(), "psd_sha256": sha(psd_file), "body_sha256": sha(body_file),
            "sign_sha256": sha(sign_file), "recomposition_sha256": sha(recomposed_file), "layers_bottom_to_top": names}


def main() -> None:
    check_gate()
    l1 = layer_dir(1, "full_redraw_v04")
    body1, _, repair_report = repair_01(l1)
    sign1 = make_01_sign()
    sign1.save(l1 / "sign_object_01.png")
    d1 = compose_psd(1, l1, ["ground_contact", "body_facade", "body_roof", "interior", "light", "front", "body_repair_01"], ["sign_object_01"], body1, sign1, "milk_tea")
    d1["repair"] = repair_report

    l2 = layer_dir(2, "zcool_b92_v03")
    body2 = empty()
    for name in ("umbrella", "operating_objects", "light", "ground_contact"):
        body2.alpha_composite(Image.open(l2 / f"{name}.png").convert("RGBA"))
    sign2 = make_02_sign()
    sign2.save(l2 / "sign_object_02.png")
    d2 = compose_psd(2, l2, ["umbrella", "operating_objects", "light", "ground_contact"], ["sign_object_02"], body2, sign2, "sugar_art")
    out = {"batch": "U03-SHOP-SIGN-REVISION-V02", "samples": {"shop_01": d1, "shop_02": d2}}
    (ROOT / "SAMPLE_BUILD_REPORT_V02.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(out, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
