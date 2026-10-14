# -*- coding: utf-8 -*-
"""Validate v0.2 local revision and make one stable user package."""
from __future__ import annotations

import hashlib
import json
import shutil
import zipfile
from datetime import datetime, timedelta, timezone
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[1]
OLD = ROOT.parent / "v0.1"
manifest = json.loads((ROOT / "CUT_MANIFEST.json").read_text(encoding="utf-8"))
P = Image.Resampling.LANCZOS


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def zero_rgb(a: Image.Image, b: Image.Image) -> bool:
    return ImageChops.difference(a.convert("RGB"), b.convert("RGB")).getbbox() is None


def main() -> None:
    review = ROOT / "review"
    scene = Image.open(review / "scene_environment.png").convert("RGB")
    old = Image.open(OLD / "review/scene_environment.png").convert("RGB")
    reassembled = Image.open(review / "reassembled_from_exports.png").convert("RGBA")
    old_reassembled = Image.open(OLD / "review/reassembled_from_exports.png").convert("RGBA")
    preview = Image.open(review / "scene_psd_preview.png").convert("RGB")
    psd = Image.open(ROOT / "source/scene_sakura_reuse_master.psd")
    assert psd.format == "PSD" and psd.n_frames == 43
    assert len(manifest["psd_layers_bottom_to_top"]) == 43
    assert len(manifest["active_exports"]) == 18
    assert zero_rgb(scene, reassembled) and zero_rgb(scene, preview) and zero_rgb(scene, psd)

    allowed = np.zeros((1024,3072), dtype=bool)
    for x0,y0,x1,y1 in manifest["allowed_full_canvas_rects_xyxy_half_open"]:
        allowed[y0:y1,x0:x1] = True
    diffrgb = np.any(np.asarray(scene) != np.asarray(old), axis=2)
    diffrgba = np.any(np.asarray(reassembled) != np.asarray(old_reassembled), axis=2)
    stats = {
        "rgb_changed_inside_roi": int((diffrgb & allowed).sum()),
        "rgb_changed_outside_roi": int((diffrgb & ~allowed).sum()),
        "rgba_changed_inside_roi": int((diffrgba & allowed).sum()),
        "rgba_changed_outside_roi": int((diffrgba & ~allowed).sum()),
    }
    assert stats["rgb_changed_outside_roi"] == stats["rgba_changed_outside_roi"] == 0
    assert stats["rgb_changed_inside_roi"] > 0

    old_manifest = json.loads((OLD / "CUT_MANIFEST.json").read_text(encoding="utf-8"))
    for rec in old_manifest["active_exports"]:
        assert sha(OLD / rec["path"]) == sha(ROOT / rec["path"]) == rec["sha256"]
    for rec in old_manifest["psd_layers_bottom_to_top"]:
        assert sha(OLD / rec["file"]) == sha(ROOT / rec["file"]) == rec["sha256"]
    assert not any("shop" in p.name.lower() for p in (ROOT / "exports").glob("*.png"))
    assert not any("shop" in rec["name"].lower() or "reference" in rec["name"].lower() for rec in manifest["psd_layers_bottom_to_top"])

    # v0.1 approved-method animation grouping, rebuilt with the new rail layer.
    moving = {"spirit_a_flame_instance_1", "spirit_a_flame_instance_3", "spirit_b_flame_instance_4", "spirit_b_flame_instance_6"}
    background = {"sky_l", "sky_r", "far_l", "far_r"}
    motion_mid = Image.new("RGBA", (3072,1024), (0,0,0,0))
    for rec in manifest["psd_layers_bottom_to_top"]:
        if rec["name"] not in moving | background:
            motion_mid.alpha_composite(Image.open(ROOT / rec["file"]).convert("RGBA"))
    motion_mid.save(review / "scene_motion_midground.png")
    for filename in ("scene_sky_overscan.png", "scene_far_overscan.png", "micro_motion_preview.html"):
        shutil.copy2(OLD / "review" / filename, review / filename)

    # At 1:1 scale, show the exact revised street band before and after.
    comparison = Image.new("RGB", (3072, 440))
    comparison.paste(old.crop((0,650,3072,870)), (0,0))
    comparison.paste(scene.crop((0,650,3072,870)), (0,220))
    comparison.save(review / "before_after.png")

    # Stable ZIP with only canonical resources and their CPU preview dependencies.
    files = [
        "source/scene_sakura_reuse_master.psd", "CUT_MANIFEST.json", "PSD_MANIFEST.json",
        "EDITABILITY_NOTES.md", "review/scene_environment.png", "review/reassembled_from_exports.png",
        "review/before_after.png", "review/micro_motion_preview.html",
        "review/scene_motion_midground.png", "review/scene_sky_overscan.png", "review/scene_far_overscan.png",
    ] + [rec["path"] for rec in manifest["active_exports"]]
    archive = ROOT / "package/SCENE_SAKURA_ENVIRONMENT_GATE2_v0.2.zip"
    archive.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for name in files:
            assert (ROOT / name).is_file()
            z.write(ROOT / name, name)
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None
        assert len(z.namelist()) == len(files) == len(set(files))
        assert not any("shop" in n.lower() or "history/" in n.lower() or "reference/" in n.lower() for n in z.namelist())

    active_bytes = sum((ROOT / rec["path"]).stat().st_size for rec in manifest["active_exports"])
    rgba_bytes = sum(rec["size"][0] * rec["size"][1] * 4 for rec in manifest["active_exports"])
    report = {
        "task_id": manifest["task"], "version": "v0.2",
        "checked_at": datetime.now(timezone(timedelta(hours=8))).isoformat(timespec="seconds"),
        "result": "PASS_STATIC_ARTIFACT_INTEGRITY_NOT_GAME_RUNTIME",
        "canvas": [3072,1024], "psd_format": psd.format, "psd_layers_actual": psd.n_frames,
        "psd_bytes": (ROOT / "source/scene_sakura_reuse_master.psd").stat().st_size,
        "active_png_count": len(manifest["active_exports"]), "unmodified_v0_1_png_sha_count": 17,
        "active_png_disk_bytes": active_bytes, "active_png_rgba8_theoretical_mib": round(rgba_bytes/1048576,2),
        "decoded_rgb_max_channel_diff_psd_preview_vs_scene": 0,
        "decoded_rgb_max_channel_diff_psd_flatten_vs_scene": 0,
        "decoded_rgb_max_channel_diff_slice_reassembly_vs_scene": 0,
        "protected_pixels": stats, "roi_rects": manifest["allowed_full_canvas_rects_xyxy_half_open"],
        "no_shop_or_reference_psd_layer": True, "no_shop_export": True,
        "imagegen_v0_2_calls": 0, "inherited_imagegen_calls": 14, "total_budget": 15,
        "browser_cpu_animation_in_this_version_tested": False,
        "cocos_import_memory_draw_batches_or_target_run_tested": False,
        "file_sha256": {name: sha(ROOT / name) for name in files},
        "package": {"path": str(archive.relative_to(ROOT)), "sha256": sha(archive), "bytes": archive.stat().st_size, "members": len(files), "crc": "PASS"},
    }
    (ROOT / "FILE_VERIFICATION.json").write_text(json.dumps(report, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    print(json.dumps({"stats":stats,"psd_layers":psd.n_frames,"exports":len(manifest["active_exports"]),"package":report["package"]},ensure_ascii=False))


if __name__ == "__main__":
    main()
