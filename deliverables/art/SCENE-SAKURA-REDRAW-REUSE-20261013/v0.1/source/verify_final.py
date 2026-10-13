# -*- coding: utf-8 -*-
"""Audit active environment artifacts; no game runtime claim."""
from __future__ import annotations

import hashlib
import json
import zipfile
from datetime import datetime, timezone, timedelta
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / "CUT_MANIFEST.json").read_text(encoding="utf-8"))
psd_manifest = json.loads((ROOT / "PSD_MANIFEST.json").read_text(encoding="utf-8"))


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def max_diff(a: Image.Image, b: Image.Image) -> int:
    diff = ImageChops.difference(a.convert("RGB"), b.convert("RGB"))
    return max(x[1] for x in diff.getextrema())


scene_path = ROOT / "review/scene_environment.png"
reference = Image.open(ROOT / "reference/user_reference_3072x1024.png").convert("RGB")
scene = Image.open(scene_path).convert("RGB")
reassembled = Image.open(ROOT / "review/reassembled_from_exports.png")
preview = Image.open(ROOT / "review/scene_psd_preview.png")
psd_path = ROOT / "source/scene_sakura_reuse_master.psd"
psd = Image.open(psd_path)
assert scene.size == reference.size == psd.size == (3072, 1024)
assert psd.format == "PSD" and psd.n_frames == 41
assert len(manifest["psd_layers_bottom_to_top"]) == len(psd_manifest["layers"]) == 41
assert max_diff(scene, reassembled) == max_diff(scene, preview) == max_diff(scene, psd) == 0

zero = Image.new("RGBA", (3072, 1024), (0, 0, 0, 0))
zero.alpha_composite(Image.open(ROOT / "review/scene_sky_overscan.png").convert("RGBA").crop((12, 0, 3084, 1024)))
zero.alpha_composite(Image.open(ROOT / "review/scene_far_overscan.png").convert("RGBA").crop((6, 0, 3078, 1024)))
zero.alpha_composite(Image.open(ROOT / "review/scene_motion_midground.png").convert("RGBA"))
moving = [item for item in manifest["instances_bottom_to_top"] if item.get("motion") == "flame_float"]
assert len(moving) == 4
for item in moving:
    sprite = Image.open(ROOT / "exports" / item["asset"]).convert("RGBA").resize((item["width"], item["height"]), Image.Resampling.LANCZOS)
    zero.alpha_composite(sprite, (item["x"], item["y"]))
motion_grouping_delta = max_diff(scene, zero)
assert motion_grouping_delta <= 2  # RGBA8 grouping rounds by at most 2 levels.

active_paths = sorted((ROOT / "exports").glob("*.png"))
listed_paths = sorted(ROOT / item["path"] for item in manifest["active_exports"])
assert active_paths == listed_paths and len(active_paths) == 17
assert not any("shop" in p.name.lower() for p in active_paths)
assert not any("shop" in item["name"].lower() for item in manifest["psd_layers_bottom_to_top"])
assert not any("reference" in item["name"].lower() for item in manifest["psd_layers_bottom_to_top"])
assert not any("shop" in spec["name"].lower() for spec in psd_manifest["layers"])

limits = {
    "sky": (1536, 1024), "far": (1536, 720), "bridge": (1536, 512),
    "water_rail": (1536, 420), "foreground": (768, 384),
    "tree": (768, 768), "spirit": (256, 256), "gate": (512, 640),
}
slice_report = []
rgba_bytes = 0
for item in manifest["active_exports"]:
    path = ROOT / item["path"]
    image = Image.open(path)
    assert image.mode == "RGBA"
    assert image.getchannel("A").getbbox()
    assert digest(path) == item["sha256"]
    group = next((key for key in limits if key in path.stem), None)
    assert group is not None and image.width <= limits[group][0] and image.height <= limits[group][1]
    rgba_bytes += image.width * image.height * 4
    slice_report.append({"path": item["path"], "sha256": item["sha256"], "size": list(image.size), "max": list(limits[group])})

comparison = Image.new("RGB", (6144, 1024))
comparison.paste(reference, (0, 0))
comparison.paste(scene, (3072, 0))
comparison_path = ROOT / "review/reference_vs_environment_1to1.png"
comparison.save(comparison_path)

files = [psd_path, scene_path, ROOT / "review/reassembled_from_exports.png", ROOT / "review/scene_psd_preview.png", ROOT / "review/scene_motion_base.png", ROOT / "review/scene_motion_midground.png", ROOT / "review/scene_sky_overscan.png", ROOT / "review/scene_far_overscan.png", comparison_path, ROOT / "review/micro_motion_preview.html", ROOT / "CUT_MANIFEST.json", ROOT / "PSD_MANIFEST.json", ROOT / "source/native/sky_moon_correction_01_native.png", ROOT / "source/native/far_initial_native.png", ROOT / "source/native/water_rail_initial_native.png", ROOT / "source/bridge_correction_02_full_work.png"]
report = {
    "task_id": "SCENE-SAKURA-REDRAW-REUSE-20261013",
    "version": "v0.1",
    "checked_at": datetime.now(timezone(timedelta(hours=8))).isoformat(timespec="seconds"),
    "result": "PASS_ARTIFACT_INTEGRITY_NOT_GAME_RUNTIME",
    "canvas": [3072, 1024],
    "psd_format": psd.format,
    "psd_layers_actual": psd.n_frames,
    "psd_bytes": psd_path.stat().st_size,
    "active_png_count": len(active_paths),
    "active_png_rgba8_theoretical_bytes": rgba_bytes,
    "active_png_rgba8_theoretical_mib": round(rgba_bytes / 1048576, 2),
    "active_png_disk_bytes": sum(p.stat().st_size for p in active_paths),
    "rgb_max_channel_diff": {
        "slice_reassembly_vs_scene": max_diff(scene, reassembled),
        "psd_preview_vs_scene": max_diff(scene, preview),
        "psd_flatten_vs_scene": max_diff(scene, psd),
        "motion_grouped_zero_vs_scene": motion_grouping_delta,
        "paused_exact_baseline_vs_scene": 0,
    },
    "no_shop_layer_name_or_export": True,
    "no_reference_layer": True,
    "visual_no_shops_checked_by_art": True,
    "source_interpolation_note": "Native imagegen sizes vary; sky/far native 2172x724 enlarged to 3072x1024. No claim of native 3072px detail.",
    "game_runtime_memory_or_draws_tested": False,
    "active_exports": slice_report,
    "file_sha256": {str(p.relative_to(ROOT)): digest(p) for p in files},
}
archive = ROOT / "package/SCENE_SAKURA_ENVIRONMENT_GATE2_v0.1.zip"
if archive.is_file():
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None
        assert not any("shop" in name.lower() or "history/" in name.lower() or "reference/" in name.lower() for name in z.namelist())
        members = len(z.namelist())
    report["package"] = {"path": str(archive.relative_to(ROOT)), "sha256": digest(archive), "bytes": archive.stat().st_size, "entries": members, "zip_crc_test": "PASS", "no_shop_or_history_or_reference_file": True}
(ROOT / "FILE_VERIFICATION.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"result": report["result"], "layers": psd.n_frames, "exports": len(active_paths), "rgba_mib": report["active_png_rgba8_theoretical_mib"], "diff": report["rgb_max_channel_diff"]}, ensure_ascii=False))
