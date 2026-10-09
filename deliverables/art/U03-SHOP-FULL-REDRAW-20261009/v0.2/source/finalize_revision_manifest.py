"""Bind v0.2's revised 04 to byte-identical v0.1 assets for the other shops."""

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops


ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT.parents[3]
V01 = ROOT.parent / "v0.1"
OLD = json.loads((V01 / "CUT_MANIFEST.json").read_text(encoding="utf-8"))


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def record(path):
    info = {"path": path.relative_to(PROJECT).as_posix(), "sha256": sha(path), "bytes": path.stat().st_size}
    if path.suffix.lower() == ".png":
        image = Image.open(path)
        info.update(mode=image.mode, size=list(image.size))
        if image.mode == "RGBA":
            alpha = image.getchannel("A")
            info.update(alpha_range=list(alpha.getextrema()), alpha_bbox_32=list(alpha.point(lambda v: 255 if v > 32 else 0).getbbox()))
    return info


result = {
    "status": "CANDIDATE_PENDING_USER_GATE2",
    "task_id": "U03-SHOP-FULL-REDRAW-20261009",
    "version": "v0.2",
    "revision_plan_sha256": sha(ROOT / "BARBER_FRONT_VIEW_REVISION_PLAN.md"),
    "reference_sha256": OLD["reference_sha256"],
    "rejected_v01_manifest": record(V01 / "CUT_MANIFEST.json"),
    "overview": record(ROOT / "preview/six_shop_full_redraw_overview.png"),
    "shop_04_reference_v01_v02": record(ROOT / "preview/shop_04_reference_v01_v02_same_scale_black.png"),
    "shops": {},
    "client_replacement": "LOCKED_PENDING_USER_APPROVAL",
}

for number in range(1, 7):
    key = f"shop_{number:02d}"
    prior = OLD["shops"][key]
    if number != 4:
        fields = ("new_full_redraw_source", "psd", "body", "sign", "recomposition")
        inherited = {field: record(V01 / prior[field]["path"]) for field in fields}
        inherited["views"] = [record(V01 / item["path"]) for item in prior["views"]]
        for field in fields:
            assert inherited[field]["sha256"] == prior[field]["sha256"]
        for now, before in zip(inherited["views"], prior["views"]):
            assert now["sha256"] == before["sha256"]
        result["shops"][key] = {
            "identity": prior["identity"],
            "top_level_id": prior["top_level_id"],
            "asset_ids": prior["asset_ids"],
            "canvas": prior["canvas"],
            "foot": prior["foot"],
            "revision": "BYTE_IDENTICAL_V01_INHERITANCE",
            **inherited,
        }
        continue

    paths = {
        "new_full_redraw_source": ROOT / "source/shop_04/imagegen_whole_r2.png",
        "psd": ROOT / "psd/shop_04_full_redraw_v02.psd",
        "body": ROOT / "exports/tex_u03_shop_04_body_full_redraw_v02.png",
        "sign": ROOT / "exports/tex_u03_shop_04_sign_full_redraw_v02.png",
        "recomposition": ROOT / "preview/shop_04_recomposed.png",
    }
    assets = {field: record(path) for field, path in paths.items()}
    assets["views"] = [record(ROOT / "preview" / f"shop_04_{w}x{h}.png") for w, h in ((390, 844), (720, 1280))]
    body = Image.open(paths["body"]).convert("RGBA")
    sign = Image.open(paths["sign"]).convert("RGBA")
    recomposed = Image.alpha_composite(body, sign)
    expected = Image.open(paths["recomposition"]).convert("RGBA")
    assert ImageChops.difference(recomposed, expected).getbbox() is None
    assert expected.size == (1024, 1024)
    assert expected.getchannel("A").getextrema()[0] == 0
    assert assets["psd"]["sha256"] != prior["psd"]["sha256"]
    result["shops"][key] = {
        "identity": prior["identity"],
        "top_level_id": prior["top_level_id"],
        "asset_ids": prior["asset_ids"],
        "canvas": prior["canvas"],
        "foot": prior["foot"],
        "revision": "FRONTAL_ARCHITECTURE_CORRECTION",
        "psd_layer_count": 4,
        "layer_mapping": record(ROOT / "source/shop_04/psd_work/manifest.json"),
        **assets,
    }

(ROOT / "CUT_MANIFEST.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
print("Manifest saved; five shops SHA-identical to v0.1; revised 04 recomposition pixel-identical")
