# -*- coding: utf-8 -*-
"""Verify and package the frozen v0.4 static art candidate."""
from __future__ import annotations

import datetime
import hashlib
import json
import zipfile
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OLD = ROOT.parent / "v0.3"


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load(path: Path) -> np.ndarray:
    return np.asarray(Image.open(path).convert("RGBA"))


def main() -> None:
    cut = json.loads((ROOT / "CUT_MANIFEST.json").read_text())
    x0, y0, x1, y1 = cut["bridge_front_source_half_bbox_xyxy_half_open"]
    source = load(OLD / "exports/tex_sakura_rr_bridge_half.png")
    body = load(ROOT / "exports/tex_sakura_rr_bridge_body_half.png")
    front = load(ROOT / "exports/tex_sakura_rr_bridge_front_half.png")
    full_front = np.zeros_like(source)
    full_front[y0:y1, x0:x1] = front
    assert front.shape == (199, 301, 4)
    assert not np.any((body[:, :, 3] > 0) & (full_front[:, :, 3] > 0))
    recovered = np.where(full_front[:, :, 3:4] > 0, full_front, body)
    assert np.array_equal(recovered, source)
    assert np.array_equal(load(ROOT / "review/reassembled_from_exports.png"), load(OLD / "review/reassembled_from_exports.png"))
    assert np.array_equal(load(ROOT / "review/scene_environment.png"), load(ROOT / "review/reassembled_from_exports.png"))
    psd = Image.open(ROOT / "source/scene_sakura_reuse_master.psd")
    assert psd.format == "PSD" and psd.n_frames == 45 and psd.size == (3072, 1024)
    scene_rgb = np.asarray(Image.open(ROOT / "review/scene_environment.png").convert("RGB"))
    assert np.array_equal(scene_rgb, np.asarray(psd.convert("RGB")))
    assert np.array_equal(scene_rgb, np.asarray(Image.open(ROOT / "review/scene_psd_preview.png").convert("RGB")))
    previous = json.loads((OLD / "CUT_MANIFEST.json").read_text())
    unchanged = 0
    for rec in previous["active_exports"]:
        if rec["path"].endswith("tex_sakura_rr_bridge_half.png"):
            continue
        assert sha(ROOT / rec["path"]) == rec["sha256"]
        unchanged += 1
    assert unchanged == 17

    include = [
        "ART_BRIEF.md", "ASSET_MANIFEST.md", "PRODUCTION_PLAN.md", "ART_PRESIGN.json",
        "CUT_MANIFEST.json", "PSD_MANIFEST.json", "EDITABILITY_NOTES.md",
        "ART_VISUAL_SELF_REVIEW.md", "USER_REVIEW_PACKET.md",
        "source/bridge_front_hand_mask.png", "source/build_v04.py",
        "source/scene_sakura_reuse_master.psd",
        "review/scene_environment.png", "review/reassembled_from_exports.png",
        "review/scene_psd_preview.png", "review/bridge_front_detail.png",
        "review/bridge_layer_breakdown.png", "review/occlusion_placeholder_demo.png",
    ] + [rec["path"] for rec in cut["active_exports"]]
    archive = ROOT / "package/SCENE_SAKURA_BRIDGE_FRONT_GATE2_v0.4.zip"
    archive.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for entry in include:
            z.write(ROOT / entry, entry)
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None
        members = len(z.namelist())

    tracked = [
        "source/scene_sakura_reuse_master.psd", "source/bridge_front_hand_mask.png",
        "exports/tex_sakura_rr_bridge_body_half.png", "exports/tex_sakura_rr_bridge_front_half.png",
        "CUT_MANIFEST.json", "PSD_MANIFEST.json", "review/reassembled_from_exports.png",
        "review/bridge_layer_breakdown.png", "review/occlusion_placeholder_demo.png",
    ]
    report = {
        "task_id": "SAKURA-BRIDGE-FRONT-ART-20261014", "version": "v0.4",
        "checked_at": datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(timespec="seconds"),
        "result": "PASS_STATIC_ARTIFACT_INTEGRITY_USER_GATE2_PENDING",
        "canvas": [3072, 1024], "psd_format": psd.format, "psd_layers_actual": psd.n_frames,
        "psd_bytes": (ROOT / "source/scene_sakura_reuse_master.psd").stat().st_size,
        "active_png_count": len(cut["active_exports"]),
        "unmodified_v0_3_png_sha_count": unchanged,
        "bridge_source_half_size": [1536, 512], "bridge_body_half_size": [1536, 512],
        "bridge_front_half_size": [front.shape[1], front.shape[0]],
        "bridge_front_half_bbox_xyxy": [x0, y0, x1, y1],
        "bridge_front_rgba8_bytes": front.shape[1] * front.shape[0] * 4,
        "bridge_alpha_overlap_pixels": 0,
        "bridge_source_exact_partition_rgba_diff_pixels": 0,
        "scene_vs_v0_3_rgba_diff_pixels": 0,
        "scene_vs_psd_preview_rgb_diff_pixels": 0,
        "scene_vs_psd_flatten_rgb_diff_pixels": 0,
        "scene_vs_export_reassembly_rgba_diff_pixels": 0,
        "imagegen_v0_4_calls": 0, "cumulative_imagegen_calls": 15,
        "native_photoshop_open_tested": False, "client_import_or_game_runtime_tested": False,
        "file_sha256": {entry: sha(ROOT / entry) for entry in tracked},
        "package": {"path": str(archive.relative_to(ROOT)), "sha256": sha(archive),
                    "bytes": archive.stat().st_size, "members": members, "crc": "PASS"},
    }
    (ROOT / "FILE_VERIFICATION.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"psd_sha256": sha(ROOT / tracked[0]), "zip_sha256": sha(archive),
                      "zip_bytes": archive.stat().st_size, "zip_members": members,
                      "front_bbox": [x0, y0, x1, y1], "unchanged_pngs": unchanged}))


if __name__ == "__main__":
    main()
