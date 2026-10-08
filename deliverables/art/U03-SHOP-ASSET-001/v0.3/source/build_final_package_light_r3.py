"""Collect six actual PSDs and 12 slices for the v0.3 Gate2 review package."""
from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OLD = ROOT.parent / "v0.2"
OLD_MANIFEST = json.loads((OLD / "CUT_MANIFEST_V02.json").read_text(encoding="utf-8"))["shops"]
EXP = ROOT / "exports/light_r3_final"
PRE = ROOT / "preview/light_r3_final"
FONT_FILE = OLD / "source/rights/ZCOOLKuaiLe-Regular.ttf"
REPORTS = {
    1: "SAMPLE_BUILD_REPORT_LIGHT_R3.json",
    2: "SHOP_02_BUILD_REPORT_LIGHT_R3.json",
    3: "SHOP_03_BUILD_REPORT_LIGHT_R3.json",
    4: "SHOP_04_BUILD_REPORT_LIGHT_R3.json",
}
NAMES = ["奶茶", "糖画", "现烤", "理发", "花灯", "投壶"]


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def ref(path: Path) -> dict:
    return {"path": path.relative_to(ROOT).as_posix(), "sha256": sha(path)}


def view(image: Image.Image, width: int, height: int, display: int, foot_y: int) -> Image.Image:
    bg = Image.new("RGBA", (width, height), (24, 43, 79, 255))
    bg.alpha_composite(image.resize((display, display), Image.Resampling.LANCZOS), ((width-display)//2, foot_y-round(900*display/1024)))
    return bg.convert("RGB")


def checker(size: tuple[int, int]) -> Image.Image:
    bg = Image.new("RGBA", size, (206, 209, 215, 255))
    d = ImageDraw.Draw(bg)
    for y in range(0, size[1], 16):
        for x in range(0, size[0], 16):
            if (x//16 + y//16) % 2 == 0:
                d.rectangle((x, y, x+15, y+15), fill=(240, 241, 244, 255))
    return bg


def copy_verified(source: Path, destination: Path, digest: str) -> None:
    assert source.is_file() and sha(source) == digest, source
    if source != destination:
        shutil.copy2(source, destination)
    assert sha(destination) == digest


def main() -> None:
    for p in (EXP, PRE, ROOT / "psd"):
        p.mkdir(parents=True, exist_ok=True)
    font = ImageFont.truetype(str(FONT_FILE), 23)
    small = ImageFont.truetype(str(FONT_FILE), 16)
    inherited = json.loads((ROOT / "INHERITED_05_06_REPORT_LIGHT_R3.json").read_text(encoding="utf-8"))["shops"]
    manifest = {"batch_id": "U03-SHOP-FAITHFUL-REDRAW-V03", "revision": "r3-light-middle", "status": "GATE2_USER_REVIEW_CANDIDATE",
                "canvas_px": [1024, 1024], "foot_px": [512, 900],
                "slice_contract": "Each shop has full-canvas RGBA body and sign; same-origin alpha composition. Client replacement waits for Gate2 USER_APPROVED.",
                "shops": {}}
    diffs = {"batch_id": manifest["batch_id"], "shops": {}}
    overview = Image.new("RGBA", (1536, 1024), (24, 43, 79, 255))
    cuts = Image.new("RGBA", (512, 1536), (24, 43, 79, 255))
    od = ImageDraw.Draw(overview)
    cd = ImageDraw.Draw(cuts)
    for num in range(1, 7):
        key = f"shop_{num:02d}"
        old = OLD_MANIFEST[key]
        psd = ROOT / "psd" / f"{key}_visual_fidelity_v03.psd"
        body = EXP / f"tex_u03_{key}_body_visual_fidelity_v03.png"
        sign = EXP / f"tex_u03_{key}_sign_visual_fidelity_v03.png"
        if num <= 4:
            record = json.loads((ROOT / REPORTS[num]).read_text(encoding="utf-8"))
            for kind, dest in (("psd", psd), ("body", body), ("sign", sign)):
                source = ROOT / record[kind]["path"]
                copy_verified(source, dest, record[kind]["sha256"])
            layer_names = record["layers_bottom_to_top"]
        else:
            record = inherited[key]
            for kind, dest in (("psd", psd), ("body", body), ("sign", sign)):
                assert sha(dest) == record[kind]["sha256"]
            original_layers = json.loads((ROOT.parent / "v0.1/source/psd_work" / key / "manifest.json").read_text(encoding="utf-8"))["layers"]
            layer_names = [layer["name"] for layer in original_layers]
        with Image.open(psd) as test:
            assert test.size == (1024, 1024)
        bi, si = rgba(body), rgba(sign)
        assert bi.size == si.size == (1024, 1024)
        composed = bi.copy()
        composed.alpha_composite(si)
        rec = PRE / f"{key}_recomposed.png"
        composed.save(rec)
        if num <= 4:
            assert np.array_equal(np.asarray(composed), np.asarray(rgba(ROOT / record["recomposition"]["path"])))
        old_b, old_s = rgba(OLD / old["body"]["path"]), rgba(OLD / old["sign"]["path"])
        old_comp = old_b.copy()
        old_comp.alpha_composite(old_s)
        assert np.array_equal(np.asarray(bi), np.asarray(old_b)), f"body changed: {key}"
        changed = np.any(np.asarray(composed) != np.asarray(old_comp), axis=2)
        allowed = (np.asarray(old_s.getchannel("A")) > 0) | (np.asarray(si.getchannel("A")) > 0)
        outside = int(np.count_nonzero(changed & ~allowed))
        assert outside == 0, (key, outside)
        views = []
        for width, height, display, foot in ((390, 844, 316, 530), (720, 1280, 584, 800)):
            vp = PRE / f"{key}_{width}x{height}.png"
            view(composed, width, height, display, foot).save(vp)
            views.append({**ref(vp), "canvas_px": [width, height], "display_px": display, "foot_y_px": foot})
        x, y = ((num-1) % 3) * 512, ((num-1)//3) * 512
        overview.alpha_composite(composed.resize((512, 512), Image.Resampling.LANCZOS), (x, y))
        for col, part in enumerate((bi, si)):
            cell = checker((256, 256))
            cell.alpha_composite(part.resize((256, 256), Image.Resampling.LANCZOS))
            cuts.alpha_composite(cell, (col * 256, (num-1) * 256))
        od.text((x+16, y+10), f"{num:02d} {NAMES[num-1]}", font=font, fill=(255, 233, 190, 255), stroke_width=1, stroke_fill=(26, 35, 55, 255))
        cd.text((6, (num-1)*256+4), f"{num:02d} {NAMES[num-1]} 主体", font=small, fill=(30, 36, 47, 255))
        cd.text((262, (num-1)*256+4), f"{num:02d} {NAMES[num-1]} 牌匾", font=small, fill=(30, 36, 47, 255))
        body_inherited = sha(body) == old["body"]["sha256"]
        sign_inherited = sha(sign) == old["sign"]["sha256"]
        psd_inherited = sha(psd) == old["psd"]["sha256"]
        manifest["shops"][key] = {
            "name_zh": NAMES[num-1], "asset_ids": {"body": f"U03_SHOP_{num:02d}_BODY", "sign": f"U03_SHOP_{num:02d}_SIGN"},
            "psd": {**ref(psd), "inherited_exact_bytes_from_v02": psd_inherited},
            "body": {**ref(body), "alpha_bbox_xyxy": list(bi.getchannel("A").getbbox()), "inherited_exact_bytes_from_v02": body_inherited},
            "sign": {**ref(sign), "alpha_bbox_xyxy": list(si.getchannel("A").getbbox()), "inherited_exact_bytes_from_v02": sign_inherited},
            "recomposition": ref(rec), "views": views, "psd_layers_bottom_to_top": layer_names,
        }
        diffs["shops"][key] = {"changed_composite_pixels_vs_v02": int(changed.sum()),
                                "changed_outside_old_or_new_sign_pixels": outside,
                                "body_byte_identical_to_v02": body_inherited,
                                "sign_byte_identical_to_v02": sign_inherited,
                                "psd_byte_identical_to_v02": psd_inherited,
                                "old_sign_bbox": list(old_s.getchannel("A").getbbox()),
                                "new_sign_bbox": list(si.getchannel("A").getbbox())}
    over = PRE / "six_shop_same_scale_overview.png"
    cut = PRE / "twelve_slices_checker_sheet.png"
    overview.save(over)
    cuts.save(cut)
    manifest["same_scale_overview"] = ref(over)
    manifest["twelve_slices_checker_sheet"] = ref(cut)
    (ROOT / "CUT_MANIFEST.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    (ROOT / "DIFF_AND_RECOMPOSITION_REPORT.json").write_text(json.dumps(diffs, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"shops": list(manifest["shops"]), "overview": manifest["same_scale_overview"], "outside_sign_difference_pixels": [v["changed_outside_old_or_new_sign_pixels"] for v in diffs["shops"].values()]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
