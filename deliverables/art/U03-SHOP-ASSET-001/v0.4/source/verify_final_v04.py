"""Recheck every declared v0.4 file hash, cut composition, and scope."""
from __future__ import annotations
import hashlib
import json
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PREV = ROOT.parent / "v0.3"

def sha(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest().upper()

def rgba(p: Path) -> Image.Image:
    return Image.open(p).convert("RGBA")

def main() -> None:
    mf = json.loads((ROOT / "CUT_MANIFEST.json").read_text(encoding="utf-8"))
    old = json.loads((PREV / "CUT_MANIFEST.json").read_text(encoding="utf-8"))
    checked = []
    dimensions = {}
    for key, entry in mf["shops"].items():
        for kind in ("psd", "body", "sign", "recomposition"):
            item = entry[kind]
            p = ROOT / item["path"]
            assert p.is_file() and sha(p) == item["sha256"], p
            checked.append(item["path"])
        for item in entry["views"]:
            p = ROOT / item["path"]
            assert p.is_file() and sha(p) == item["sha256"], p
            with Image.open(p) as im:
                assert list(im.size) == item["canvas_px"]
            checked.append(item["path"])
        with Image.open(ROOT / entry["psd"]["path"]) as im:
            assert im.size == (1024,1024)
        body, sign, combined = [rgba(ROOT / entry[n]["path"]) for n in ("body", "sign", "recomposition")]
        assert body.size == sign.size == combined.size == (1024,1024)
        assert np.array_equal(np.asarray(Image.alpha_composite(body, sign)), np.asarray(combined))
        assert list(body.getchannel("A").getbbox()) == entry["body"]["alpha_bbox_xyxy"]
        assert list(sign.getchannel("A").getbbox()) == entry["sign"]["alpha_bbox_xyxy"]
        prev_entry = old["shops"][key]
        assert sha(ROOT / entry["body"]["path"]) == prev_entry["body"]["sha256"]
        if key in ("shop_01", "shop_05", "shop_06"):
            assert sha(ROOT / entry["psd"]["path"]) == prev_entry["psd"]["sha256"]
            assert sha(ROOT / entry["sign"]["path"]) == prev_entry["sign"]["sha256"]
        dimensions[key] = {"psd": [1024,1024], "body": list(body.size), "sign": list(sign.size), "sign_alpha_bbox": entry["sign"]["alpha_bbox_xyxy"]}
    for field in ("same_scale_overview", "twelve_slices_checker_sheet", "three_signs_native_1x_comparison"):
        item=mf[field]; p=ROOT/item["path"]
        assert p.is_file() and sha(p)==item["sha256"], p
        checked.append(item["path"])
    diff=json.loads((ROOT/"DIFF_AND_RECOMPOSITION_REPORT.json").read_text(encoding="utf-8"))
    assert all(v["changed_outside_old_or_new_sign_pixels"]==0 for v in diff["shops"].values())
    out={"batch_id": mf["batch_id"], "status":"PASS", "manifest_sha256":sha(ROOT/"CUT_MANIFEST.json"), "files_checked_count":len(checked), "files_checked":checked, "dimensions":dimensions, "all_body_byte_identical_v03":True, "shops_01_05_06_psd_body_sign_byte_identical_v03":True, "all_changed_pixels_within_old_or_new_sign_alpha":True, "creator_runtime":"NOT_TESTED", "gate2_user_approval":"PENDING"}
    (ROOT/"FINAL_PACKAGE_VALIDATION.json").write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps({k:out[k] for k in ("status","manifest_sha256","files_checked_count","creator_runtime")},ensure_ascii=False,indent=2))

if __name__=="__main__":
    main()
