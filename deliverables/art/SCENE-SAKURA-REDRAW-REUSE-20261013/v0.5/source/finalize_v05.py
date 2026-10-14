"""Static visual evidence, source verification, and Gate2 package for v0.5."""
from __future__ import annotations

import datetime
import hashlib
import json
import zipfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OLD = ROOT.parent / "v0.4"
ROI = (1160, 520, 1912, 868)


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def rgba(path: Path) -> np.ndarray:
    return np.asarray(Image.open(path).convert("RGBA"))


def report_images(cut: dict) -> None:
    review = ROOT / "review"
    new = Image.open(review / "reassembled_from_exports.png").convert("RGBA")
    current = Image.open(OLD / "review/reassembled_from_exports.png").convert("RGBA")
    reference = Image.open(ROOT / "reference/user_bridge_shape.png").convert("RGB")
    detail = new.crop(ROI)
    detail.save(review / "bridge_detail_v05.png")
    panels = [reference.crop(ROI), current.crop(ROI).convert("RGB"), detail.convert("RGB")]
    board = Image.new("RGB", (752 * 3, 388), (25, 26, 43))
    draw = ImageDraw.Draw(board)
    for i, (label, panel) in enumerate(zip(("REFERENCE ONLY", "v0.4 ACTUAL", "v0.5 ACTUAL EXPORTS"), panels)):
        x = i * 752
        draw.text((x + 10, 12), label, fill=(248, 242, 226))
        board.paste(panel, (x, 40))
    board.save(review / "reference_before_after_bridge.png")

    psd_manifest = json.loads((ROOT / "PSD_MANIFEST.json").read_text())
    no_front = Image.new("RGBA", (3072, 1024))
    front = Image.new("RGBA", (3072, 1024))
    for rec in psd_manifest["layers"]:
        layer = Image.open(ROOT / rec["file"]).convert("RGBA")
        if rec["name"] in ("bridge_front_l", "bridge_front_r"):
            front.alpha_composite(layer)
        else:
            no_front.alpha_composite(layer)
    demo = no_front.crop(ROI)
    placeholder = Image.new("RGBA", (752, 348))
    d = ImageDraw.Draw(placeholder)
    d.rounded_rectangle((289, 132, 328, 250), radius=9, fill=(53, 205, 195, 228), outline="white", width=2)
    d.rounded_rectangle((431, 141, 470, 250), radius=9, fill=(244, 167, 83, 228), outline="white", width=2)
    demo.alpha_composite(placeholder)
    demo.alpha_composite(front.crop(ROI))
    panel = Image.new("RGB", (752, 388), (25, 26, 43))
    panel.paste(demo.convert("RGB"), (0, 40))
    label = ImageDraw.Draw(panel)
    label.text((10, 12), "BODY  >  GEOMETRY PLACEHOLDERS  >  FRONT", fill=(248, 242, 226))
    panel.save(review / "occlusion_demo.png")


def main() -> None:
    cut = json.loads((ROOT / "CUT_MANIFEST.json").read_text())
    assert cut["cumulative_imagegen_calls"] == 16
    assert len(cut["active_exports"]) == 21
    assert cut["unchanged_nonbridge_count"] == 17
    assert len(cut["bridge_instance_mapping"]) == 4
    report_images(cut)

    old = rgba(OLD / "review/reassembled_from_exports.png")
    new = rgba(ROOT / "review/reassembled_from_exports.png")
    source_scene = rgba(ROOT / "review/scene_environment.png")
    assert np.array_equal(new, source_scene)
    outside = np.ones((1024, 3072), dtype=bool)
    outside[ROI[1]:ROI[3], ROI[0]:ROI[2]] = False
    outside_diff = int(np.any(old[outside] != new[outside], axis=1).sum())
    assert outside_diff == 0
    roi_old = old[ROI[1]:ROI[3], ROI[0]:ROI[2]]
    roi_new = new[ROI[1]:ROI[3], ROI[0]:ROI[2]]
    inside_changed = int(np.any(roi_old != roi_new, axis=2).sum())
    assert inside_changed > 0
    unchanged = []
    old_cut = json.loads((OLD / "CUT_MANIFEST.json").read_text())
    for rec in old_cut["active_exports"]:
        if "bridge_" in rec["path"]:
            continue
        path = ROOT / rec["path"]
        assert sha(path) == rec["sha256"]
        unchanged.append({"path": rec["path"], "sha256": rec["sha256"]})
    assert len(unchanged) == 17
    for rec in cut["active_exports"]:
        path = ROOT / rec["path"]
        assert sha(path) == rec["sha256"]
        assert list(Image.open(path).size) == rec["size"]
    area = sum(a["size"][0] * a["size"][1] for a in cut["bridge_instance_mapping"])
    assert area == cut["bridge_export_rect_area_pixels"]
    assert all(not a["mirror"] for a in cut["bridge_instance_mapping"])
    source_layers = json.loads((ROOT / "PSD_MANIFEST.json").read_text())["layers"]
    assert len(source_layers) == 45
    psd = Image.open(ROOT / "source/scene_sakura_reuse_master.psd")
    assert psd.format == "PSD" and psd.size == (3072, 1024) and psd.n_frames == 45
    psd_rgb = np.asarray(psd.convert("RGB"))
    preview_rgb = np.asarray(Image.open(ROOT / "review/scene_psd_preview.png").convert("RGB"))
    new_rgb = np.asarray(Image.fromarray(new).convert("RGB"))
    psd_diff = int(np.any(psd_rgb != new_rgb, axis=2).sum())
    preview_diff = int(np.any(preview_rgb != new_rgb, axis=2).sum())
    assert psd_diff == preview_diff == 0

    pack = ROOT / "package/SCENE_SAKURA_BRIDGE_SHAPE_GATE2_v0.5.zip"
    pack.parent.mkdir(parents=True, exist_ok=True)
    fixed = [
        "ART_BRIEF.md", "ASSET_MANIFEST.md", "ART_PRESIGN.json", "TECH_PRESIGN.json",
        "BRIDGE_DIAGNOSIS.md", "PRODUCTION_PLAN.md", "EXECUTION_LEDGER.json",
        "CUT_MANIFEST.json", "PSD_MANIFEST.json", "ART_VISUAL_SELF_REVIEW.md",
        "USER_REVIEW_PACKET.md", "source/process_notes.md",
        "source/BRIDGE_IMAGEGEN_PROMPT.txt", "source/build_v05.py", "source/finalize_v05.py",
        "source/native/bridge_candidate_16.png", "source/bridge_candidate_aligned.png",
        "source/bridge_union_mask.png", "source/bridge_front_mask.png",
        "source/scene_sakura_reuse_master.psd",
        "review/scene_environment.png", "review/reassembled_from_exports.png",
        "review/scene_psd_preview.png", "review/bridge_detail_v05.png",
        "review/reference_before_after_bridge.png", "review/occlusion_demo.png",
    ]
    to_pack = fixed + [rec["path"] for rec in cut["active_exports"]]
    to_pack += [str(p.relative_to(ROOT)) for p in (ROOT / "source/psd_full_canvas_layers").glob("*.png")]
    to_pack = sorted(set(to_pack))
    with zipfile.ZipFile(pack, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for entry in to_pack:
            assert (ROOT / entry).is_file(), entry
            z.write(ROOT / entry, entry)
    with zipfile.ZipFile(pack) as z:
        assert z.testzip() is None
        members = z.namelist()
    checked_at = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(timespec="seconds")
    verification = {
        "task_id": "SAKURA-BRIDGE-SHAPE-PRODUCTION-ART-20261014",
        "version": "v0.5", "checked_at": checked_at,
        "result": "PASS_STATIC_ARTIFACT_INTEGRITY_USER_GATE2_PENDING",
        "source_candidate": {"path": "source/native/bridge_candidate_16.png",
                             "size": [1844, 853],
                             "sha256": sha(ROOT / "source/native/bridge_candidate_16.png")},
        "canvas": [3072, 1024], "roi_xyxy": list(ROI),
        "roi_outside_decoded_rgba_diff_pixels": outside_diff,
        "roi_inside_changed_decoded_rgba_pixels": inside_changed,
        "scene_vs_actual_21_exports_rgba_diff_pixels": 0,
        "scene_vs_psd_flatten_rgb_diff_pixels": psd_diff,
        "scene_vs_psd_preview_rgb_diff_pixels": preview_diff,
        "psd_format": psd.format, "psd_layers_actual": psd.n_frames,
        "psd_bytes": (ROOT / "source/scene_sakura_reuse_master.psd").stat().st_size,
        "active_png_count": len(cut["active_exports"]),
        "nonbridge_png_sha_identical_count": len(unchanged),
        "nonbridge_pngs": unchanged,
        "bridge_png_count": len(cut["bridge_instance_mapping"]),
        "bridge_rect_area_pixels": area,
        "bridge_rgba8_uncompressed_bytes": area * 4,
        "bridge_instance_mapping": cut["bridge_instance_mapping"],
        "bridge_body_front_alpha_overlap_pixels": cut["body_front_alpha_overlap_pixels"],
        "native_photoshop_open_tested": False,
        "client_import_or_game_runtime_tested": False,
        "cumulative_imagegen_calls": 16, "automatic_retries": 0,
        "files_sha256": {entry: sha(ROOT / entry) for entry in fixed if entry != "source/finalize_v05.py"},
        "package": {"path": str(pack.relative_to(ROOT)), "sha256": sha(pack),
                    "bytes": pack.stat().st_size, "members": len(members), "crc": "PASS"},
    }
    (ROOT / "FILE_VERIFICATION.json").write_text(json.dumps(verification, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"result": verification["result"], "outside": outside_diff,
                      "changed": inside_changed, "psd_layers": psd.n_frames,
                      "bridge_area": area, "zip_members": len(members),
                      "zip_sha": sha(pack)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
