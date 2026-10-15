"""Reassemble the actual exported sprites and record same-pipeline pixel evidence."""
from __future__ import annotations

import datetime
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[4]
OLD = ROOT / "deliverables/art/SCENE-SAKURA-REDRAW-REUSE-20261013/v0.5"
OUT = Path(__file__).resolve().parent
VIEW = OUT / "review"
OLD_CUT = json.loads((OLD / "CUT_MANIFEST.json").read_text())


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def instance(asset: str, path: Path, x: int, y: int, *, mirror: bool = False, stable_id: str, band: str) -> dict:
    return {"stable_id": stable_id, "asset": asset, "source_path": str(path.relative_to(ROOT)), "sha256": sha(path), "size": list(Image.open(path).size), "x": x, "y": y, "mirror_x": mirror, "render_band": band, "client_formal_path": "PLANNED_ONLY_GATE2_PENDING", "client_uuid": None}


def main() -> None:
    W, H = 3072, 1024
    old_instances = OLD_CUT["instances_bottom_to_top"]
    new_instances = []
    for rec in old_instances:
        asset = rec["asset"]
        if asset == "tex_sakura_rr_far_l.png":
            dark = OUT / "exports/tex_sakura_rr_far_l_eye_dark_base.png"
            glow = OUT / "exports/tex_sakura_rr_far_l_eye_glow.png"
            new_instances.append(instance(dark.name, dark, 0, 0, stable_id="FAR_L_EYE_DARK_BASE", band="L01_FAR"))
            new_instances.append(instance(glow.name, glow, 1284, 250, stable_id="FAR_L_EYE_GLOW", band="L01_FAR_OVERLAY"))
        elif asset == "tex_sakura_rr_bridge_body_l.png":
            street = OUT / "exports/tex_sakura_rr_bridge_street_master.png"
            body = OUT / "exports/tex_sakura_rr_bridge_body_l_clean.png"
            new_instances.append(instance(street.name, street, 0, 598, stable_id="BRIDGE_STREET_MASTER_L", band="L03_BRIDGE"))
            new_instances.append(instance(body.name, body, 0, 598, stable_id="BRIDGE_BODY_L_CLEAN", band="L03_BRIDGE"))
        elif asset == "tex_sakura_rr_bridge_body_r.png":
            street = OUT / "exports/tex_sakura_rr_bridge_street_master.png"
            body = OUT / "exports/tex_sakura_rr_bridge_body_r_clean.png"
            new_instances.append(instance(street.name, street, 1900, 598, mirror=True, stable_id="BRIDGE_STREET_MASTER_R_INSTANCE", band="L03_BRIDGE"))
            new_instances.append(instance(body.name, body, 1536, 597, stable_id="BRIDGE_BODY_R_CLEAN", band="L03_BRIDGE"))
        elif asset in ("tex_sakura_rr_bridge_front_l.png", "tex_sakura_rr_bridge_front_r.png"):
            path = OUT / "exports" / asset
            item = instance(asset, path, rec["x"], rec["y"], stable_id=rec["instance_id"].upper(), band=rec.get("render_band", "L04_FRONT"))
            meta = ROOT / "apps/client/assets/resources/sakura_v03" / (asset + ".meta")
            item["client_formal_path"] = str(meta.with_suffix("").relative_to(ROOT))
            item["client_uuid"] = json.loads(meta.read_text())["uuid"]
            new_instances.append(item)
        else:
            path = OLD / "exports" / asset
            item = instance(asset, path, rec["x"], rec["y"], mirror=rec.get("mirror", False), stable_id=rec.get("instance_id") or asset.removesuffix(".png").upper(), band=rec.get("render_band", "OLD_ORDER"))
            meta = ROOT / "apps/client/assets/resources/sakura_v03" / (asset + ".meta")
            item["client_formal_path"] = str(meta.with_suffix("").relative_to(ROOT))
            item["client_uuid"] = json.loads(meta.read_text())["uuid"]
            if "width" in rec:
                item["display_size"] = [rec["width"], rec["height"]]
            new_instances.append(item)

    scene = Image.new("RGBA", (W, H))
    for rec in new_instances:
        sprite = Image.open(ROOT / rec["source_path"]).convert("RGBA")
        if "display_size" in rec:
            sprite = sprite.resize(tuple(rec["display_size"]), Image.Resampling.LANCZOS)
        if rec["mirror_x"]:
            sprite = ImageOps.mirror(sprite)
        scene.alpha_composite(sprite, (rec["x"], rec["y"]))
    scene.save(VIEW / "reassembled_from_actual_exports.png")

    layer_scene = Image.new("RGBA", (W, H))
    psd_manifest = json.loads((OUT / "PSD_MANIFEST.json").read_text())
    for rec in psd_manifest["layers"]:
        layer_scene.alpha_composite(Image.open(OUT / rec["file"]).convert("RGBA"))
    layers_arr = np.array(layer_scene)
    exports_arr = np.array(scene)
    assert np.array_equal(layers_arr, exports_arr), "Actual export reassembly and PSD layers differ"
    psd = Image.open(OUT / "source/scene_sakura_revision_master.psd")
    assert psd.format == "PSD" and psd.size == (W, H) and psd.n_frames == len(psd_manifest["layers"])
    psd_rgb = np.array(psd.convert("RGB"))
    scene_rgb = np.array(scene.convert("RGB"))
    assert np.array_equal(psd_rgb, scene_rgb), "PSD merged image and actual export reassembly differ"
    preview_rgb = np.array(Image.open(VIEW / "scene_psd_preview.png").convert("RGB"))
    assert np.array_equal(preview_rgb, scene_rgb), "Preview and actual export reassembly differ"

    old_scene = np.array(Image.open(OLD / "review/scene_environment.png").convert("RGBA"))
    delta = np.abs(old_scene.astype(np.int16) - exports_arr.astype(np.int16))
    changed = np.any(delta > 0, axis=2)
    allowed = np.zeros((H, W), dtype=bool)
    allowed[680:868, 0:1172] = True
    allowed[680:868, 1900:3072] = True
    allowed[597:868, 1172:1900] = True
    allowed[250:304, 1284:1383] = True
    outside_count = int(np.count_nonzero(changed & ~allowed))
    assert outside_count == 0
    eye_bright_count = int(np.count_nonzero(changed[250:304,1284:1383]))
    assert eye_bright_count == 0, "Bright reference pose must be exact"
    diff_visual = np.zeros((H,W,4),dtype=np.uint8)
    diff_visual[...,0] = np.clip(delta[...,:3].max(axis=2)*3,0,255)
    diff_visual[...,1] = np.where(changed, 70, 0)
    diff_visual[...,3] = 255
    Image.fromarray(diff_visual).save(VIEW / "old_vs_new_difference.png")

    unchanged = []
    replaced = {"tex_sakura_rr_far_l.png", "tex_sakura_rr_bridge_body_l.png", "tex_sakura_rr_bridge_body_r.png"}
    for rec in OLD_CUT["active_exports"]:
        if Path(rec["path"]).name not in replaced:
            path = OLD / rec["path"]
            assert sha(path) == rec["sha256"]
            existing_client = ROOT / "apps/client/assets/resources/sakura_v03" / path.name
            assert existing_client.is_file() and sha(existing_client) == rec["sha256"]
            unchanged.append({"asset": Path(rec["path"]).name, "path": str(path.relative_to(ROOT)), "sha256": rec["sha256"], "size": rec["size"], "reuse": True})
    cut = {"task": "EXAMPLE-REVISION-ART-20261015", "version": "v0.1", "source_version": "v0.5", "canvas": [W,H], "instances_bottom_to_top": new_instances, "unchanged_exports": unchanged, "new_unique_exports": [str(p.relative_to(ROOT)) for p in sorted((OUT / "exports").glob("*.png")) if "front_" not in p.name], "gate2": "PENDING_USER_REVIEW", "client_imported": False, "scene_sha256": sha(VIEW / "reassembled_from_actual_exports.png")}
    (OUT / "CUT_MANIFEST.json").write_text(json.dumps(cut,ensure_ascii=False,indent=2)+"\n")
    apng = Image.open(VIEW / "far_l_eyes_4s_loop.png")
    apng_duration = 0
    apng.seek(0)
    first_frame = np.array(apng.convert("RGB"), dtype=np.int16)
    for frame_index in range(apng.n_frames):
        apng.seek(frame_index)
        apng_duration += apng.info.get("duration", 0)
    last_frame = np.array(apng.convert("RGB"), dtype=np.int16)
    apng_seam_delta = int(np.abs(first_frame - last_frame).max())
    assert apng_duration == 4000 and apng_seam_delta <= 1
    verification = {"checked_at": datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(timespec="seconds"), "result": "PASS_STATIC_ARTIFACT_INTEGRITY_GATE2_PENDING", "decode": "Pillow 11.3.0; RGBA8 straight alpha; original sRGB values, no ICC conversion; alpha-over; background from original sky layers; integer coordinates; original display resampling Lanczos", "source_psd_sha256": sha(OLD / "source/scene_sakura_reuse_master.psd"), "new_psd_sha256": sha(OUT / "source/scene_sakura_revision_master.psd"), "psd_layers": psd.n_frames, "actual_export_count_instances": len(new_instances), "old_v05_export_count": len(OLD_CUT["active_exports"]), "unchanged_export_count": len(unchanged), "unchanged_export_hash_verified": len(unchanged), "existing_client_unchanged_hash_verified": len(unchanged), "export_vs_layer_rgba_changed_pixels": 0, "psd_vs_export_rgb_changed_pixels": 0, "preview_vs_export_rgb_changed_pixels": 0, "old_vs_new_changed_pixels": int(changed.sum()), "outside_approved_change_region_rgba_changed_pixels": outside_count, "bright_eye_vs_v05_changed_pixels": eye_bright_count, "old_vs_new_max_channel_delta": int(delta.max()), "transparent_rgb_interpretation": "full scene has opaque sky; alpha compared separately in RGBA", "native_photoshop_open_tested": False, "creator_import_tested": False, "runtime_tested": False, "generation_calls_this_batch": 0, "eye_apng_frames": apng.n_frames, "eye_apng_duration_ms": apng_duration, "eye_apng_loop_seam_max_channel_delta": apng_seam_delta}
    (OUT / "FILE_VERIFICATION.json").write_text(json.dumps(verification,ensure_ascii=False,indent=2)+"\n")
    print(json.dumps({"result":verification["result"], "unchanged":len(unchanged), "outside":outside_count, "changed":verification["old_vs_new_changed_pixels"], "psd_layers":psd.n_frames, "eye_frames":verification["eye_apng_frames"]},ensure_ascii=False))


if __name__ == "__main__":
    main()
