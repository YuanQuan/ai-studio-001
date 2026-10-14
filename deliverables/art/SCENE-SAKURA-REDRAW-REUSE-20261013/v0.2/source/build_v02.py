# -*- coding: utf-8 -*-
"""Local v0.2 rail overlay from the newly drawn v0.1 source; no new pixels elsewhere."""
from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image, ImageChops, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OLD = ROOT.parent / "v0.1"
W, H = 3072, 1024
EXPORTS = ROOT / "exports"
LAYERS = ROOT / "source/psd_full_canvas_layers"
REVIEW = ROOT / "review"


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def full(sprite: Image.Image, x: int, y: int) -> Image.Image:
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    out.alpha_composite(sprite, (x, y))
    return out


def rail_half(y_position: int = 730) -> Image.Image:
    src = Image.open(OLD / "exports/tex_sakura_rr_water_rail_half.png").convert("RGBA")
    out = Image.new("RGBA", src.size, (0, 0, 0, 0))
    top = src.crop((0, 0, 1536, 114))
    alpha = top.getchannel("A")
    # Alpha isolation of the source's rail/short base: no water pixels.
    for y in range(114):
        yf = 1.0 if y < 89 else max(0.0, (113 - y) / 24)
        for x in range(1536):
            xf = 1.0 if x < 1215 else max(0.0, (1285 - x) / 70)
            if xf < 1.0 or yf < 1.0:
                alpha.putpixel((x, y), round(alpha.getpixel((x, y)) * xf * yf))
    top.putalpha(alpha)
    out.alpha_composite(top)
    assert y_position >= 708 and y_position + 114 <= 858
    return out


def main() -> None:
    EXPORTS.mkdir(parents=True, exist_ok=True)
    LAYERS.mkdir(parents=True, exist_ok=True)
    REVIEW.mkdir(parents=True, exist_ok=True)
    old_manifest = json.loads((OLD / "CUT_MANIFEST.json").read_text(encoding="utf-8"))
    for record in old_manifest["active_exports"]:
        src = OLD / record["path"]
        dst = ROOT / record["path"]
        shutil.copy2(src, dst)
        assert sha(src) == sha(dst) == record["sha256"]
    # PSD source layers are also exact copies; filenames/numbers remain stable.
    for old_record in old_manifest["psd_layers_bottom_to_top"]:
        src = OLD / old_record["file"]
        dst = ROOT / old_record["file"]
        shutil.copy2(src, dst)
        assert sha(src) == sha(dst) == old_record["sha256"]

    rail = rail_half()
    rail_path = EXPORTS / "tex_sakura_rr_street_rail_half.png"
    rail.save(rail_path)
    rail_l = full(rail, 0, 730)
    rail_r = full(ImageOps.mirror(rail), 1536, 730)
    new_layer_records = []
    for name, img in (("street_rail_l", rail_l), ("street_rail_r", rail_r)):
        path = LAYERS / f"{name}.png"
        img.save(path)
        new_layer_records.append({"name": name, "file": str(path.relative_to(ROOT)), "sha256": sha(path)})

    layers = old_manifest["psd_layers_bottom_to_top"][:17] + new_layer_records + old_manifest["psd_layers_bottom_to_top"][17:]
    instances = old_manifest["instances_bottom_to_top"][:17] + [
        {"asset": rail_path.name, "x": 0, "y": 730, "mirror": False},
        {"asset": rail_path.name, "x": 1536, "y": 730, "mirror": True},
    ] + old_manifest["instances_bottom_to_top"][17:]
    scene = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for record in layers:
        scene.alpha_composite(Image.open(ROOT / record["file"]).convert("RGBA"))
    scene_rgb = scene.convert("RGB")
    scene_rgb.save(REVIEW / "scene_environment.png")
    reassembled = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for record in instances:
        sprite = Image.open(EXPORTS / record["asset"]).convert("RGBA")
        if "width" in record:
            sprite = sprite.resize((record["width"], record["height"]), Image.Resampling.LANCZOS)
        if record.get("mirror"):
            sprite = ImageOps.mirror(sprite)
        reassembled.alpha_composite(sprite, (record["x"], record["y"]))
    reassembled.save(REVIEW / "reassembled_from_exports.png")
    old = Image.open(OLD / "review/scene_environment.png").convert("RGB")
    changed = ImageChops.difference(old, scene_rgb).convert("RGB")
    mask = Image.new("1", (W, H), 0)
    for rect in ((0,708,1285,858),(1787,708,3072,858),(1070,686,1285,858),(1740,667,2009,858)):
        mask.paste(1, rect)
    changed_pixels = 0
    outside_pixels = 0
    import numpy as np
    arr = np.asarray(changed)
    diff = np.any(arr != 0, axis=2)
    allowed = np.asarray(mask).astype(bool)
    changed_pixels = int(diff.sum())
    outside_pixels = int((diff & ~allowed).sum())
    assert outside_pixels == 0, outside_pixels
    re_rgb = reassembled.convert("RGB")
    assert ImageChops.difference(scene_rgb, re_rgb).getbbox() is None
    # Relative export records remain byte-identical; new overlay is an extra cut.
    export_records = old_manifest["active_exports"] + [{"path": str(rail_path.relative_to(ROOT)), "sha256": sha(rail_path), "size": list(rail.size)}]
    result = {
        "task": old_manifest["task"], "version": "v0.2", "canvas": [W,H],
        "baseline_scene_sha256": sha(OLD / "review/scene_environment.png"),
        "no_shop_layers_or_exports": True,
        "active_exports": export_records,
        "instances_bottom_to_top": instances,
        "psd_layers_bottom_to_top": layers,
        "scene_sha256": sha(REVIEW / "scene_environment.png"),
        "reassembly_sha256": sha(REVIEW / "reassembled_from_exports.png"),
        "new_rail_source": "v0.1/exports/tex_sakura_rr_water_rail_half.png top [0,0,1536,114), y=730, x fade 1215:1285, y fade 89:113",
        "allowed_full_canvas_rects_xyxy_half_open": [[0,708,1285,858],[1787,708,3072,858],[1070,686,1285,858],[1740,667,2009,858]],
        "changed_rgb_pixels": changed_pixels,
        "outside_roi_changed_rgb_pixels": outside_pixels,
        "unmodified_v0_1_export_count": 17,
    }
    (ROOT / "CUT_MANIFEST.json").write_text(json.dumps(result, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    psd_manifest = {
        "canvas": {"width": W, "height": H, "composite_background": "#15173b"},
        "output": "source/scene_sakura_reuse_master.psd",
        "preview": "review/scene_psd_preview.png",
        "layers": [{"name": r["name"], "file": r["file"], "fit": "none", "remove_background": "none"} for r in layers],
    }
    (ROOT / "PSD_MANIFEST.json").write_text(json.dumps(psd_manifest, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    print(json.dumps({"layers": len(layers), "exports": len(export_records), "changed": changed_pixels, "outside_roi": outside_pixels, "scene": result["scene_sha256"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
