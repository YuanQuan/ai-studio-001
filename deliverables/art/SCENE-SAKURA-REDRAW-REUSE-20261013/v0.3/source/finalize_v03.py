# -*- coding: utf-8 -*-
"""Verify v0.3 stone-chain revision and create one stable review package."""
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
OLD = ROOT.parent / "v0.2"
manifest = json.loads((ROOT / "CUT_MANIFEST.json").read_text(encoding="utf-8"))


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def same_rgb(a: Image.Image, b: Image.Image) -> bool:
    return ImageChops.difference(a.convert("RGB"),b.convert("RGB")).getbbox() is None


def main() -> None:
    review = ROOT / "review"
    scene = Image.open(review / "scene_environment.png").convert("RGB")
    old_scene = Image.open(OLD / "review/scene_environment.png").convert("RGB")
    rebuilt = Image.open(review / "reassembled_from_exports.png").convert("RGBA")
    old_rebuilt = Image.open(OLD / "review/reassembled_from_exports.png").convert("RGBA")
    preview = Image.open(review / "scene_psd_preview.png").convert("RGB")
    psd_path = ROOT / "source/scene_sakura_reuse_master.psd"
    psd = Image.open(psd_path)
    assert scene.size == old_scene.size == psd.size == (3072,1024)
    assert psd.format == "PSD" and psd.n_frames == 43
    assert len(manifest["psd_layers_bottom_to_top"]) == 43
    assert len(manifest["active_exports"]) == 18
    assert same_rgb(scene,preview) and same_rgb(scene,psd) and same_rgb(scene,rebuilt)

    allowed = np.zeros((1024,3072),dtype=bool)
    for x0,y0,x1,y1 in manifest["allowed_full_canvas_rects_xyxy_half_open"]:
        allowed[y0:y1,x0:x1] = True
    diff_rgb = np.any(np.asarray(scene)!=np.asarray(old_scene),axis=2)
    diff_rgba = np.any(np.asarray(rebuilt)!=np.asarray(old_rebuilt),axis=2)
    protected = {
        "changed_rgb_inside_roi":int((diff_rgb & allowed).sum()),
        "changed_rgb_outside_roi":int((diff_rgb & ~allowed).sum()),
        "changed_rgba_inside_roi":int((diff_rgba & allowed).sum()),
        "changed_rgba_outside_roi":int((diff_rgba & ~allowed).sum()),
    }
    assert protected["changed_rgb_outside_roi"] == protected["changed_rgba_outside_roi"] == 0
    assert protected["changed_rgba_inside_roi"] > 0

    old_manifest = json.loads((OLD / "CUT_MANIFEST.json").read_text(encoding="utf-8"))
    for rec in old_manifest["active_exports"]:
        if rec["path"].endswith("tex_sakura_rr_street_rail_half.png"):
            continue
        assert sha(ROOT/rec["path"]) == sha(OLD/rec["path"]) == rec["sha256"]
    for rec in old_manifest["psd_layers_bottom_to_top"]:
        if rec["name"].startswith("street_rail_"):
            continue
        assert sha(ROOT/rec["file"]) == sha(OLD/rec["file"]) == rec["sha256"]
    old_rail = Image.open(OLD/"exports/tex_sakura_rr_street_rail_half.png").convert("RGBA")
    new_bank = Image.open(ROOT/"source/native/rail_bank_half.png").convert("RGBA")
    assert np.array_equal(np.asarray(old_rail)[68:113],np.asarray(new_bank)[68:113])
    assert not any("shop" in r["name"].lower() or "reference" in r["name"].lower() for r in manifest["psd_layers_bottom_to_top"])
    assert not any("shop" in r["path"].lower() for r in manifest["active_exports"])

    # Rebuild the existing CPU preview's midground from the new PSD layers.
    moving = {"spirit_a_flame_instance_1","spirit_a_flame_instance_3","spirit_b_flame_instance_4","spirit_b_flame_instance_6"}
    background = {"sky_l","sky_r","far_l","far_r"}
    midground = Image.new("RGBA",(3072,1024),(0,0,0,0))
    for rec in manifest["psd_layers_bottom_to_top"]:
        if rec["name"] not in moving | background:
            midground.alpha_composite(Image.open(ROOT/rec["file"]).convert("RGBA"))
    midground.save(review/"scene_motion_midground.png")
    for filename in ("scene_sky_overscan.png","scene_far_overscan.png","micro_motion_preview.html"):
        shutil.copy2(OLD/"review"/filename,review/filename)

    comparison = Image.new("RGB",(3072,440))
    comparison.paste(old_scene.crop((0,650,3072,870)),(0,0))
    comparison.paste(scene.crop((0,650,3072,870)),(0,220))
    comparison.save(review/"before_after.png")

    files = [
        "source/scene_sakura_reuse_master.psd","source/native/stone_chain_native.png",
        "source/native/post_extracted.png","source/native/chain_extracted.png",
        "source/native/rail_bank_half.png","source/native/chain_instances_half.png",
        "source/native/stone_posts_half.png",
        "CUT_MANIFEST.json","PSD_MANIFEST.json","EDITABILITY_NOTES.md",
        "review/scene_environment.png","review/reassembled_from_exports.png",
        "review/before_after.png","review/micro_motion_preview.html",
        "review/scene_motion_midground.png","review/scene_sky_overscan.png",
        "review/scene_far_overscan.png",
    ] + [r["path"] for r in manifest["active_exports"]]
    assert len(files) == len(set(files)) == 35
    archive = ROOT/"package/SCENE_SAKURA_ENVIRONMENT_GATE2_v0.3.zip"
    archive.parent.mkdir(parents=True,exist_ok=True)
    with zipfile.ZipFile(archive,"w",compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
        for name in files:
            assert (ROOT/name).is_file()
            z.write(ROOT/name,name)
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None
        assert len(z.namelist()) == len(files)
        assert not any("shop" in n.lower() or "reference/" in n.lower() or "history/" in n.lower() for n in z.namelist())

    rgba_bytes = sum(r["size"][0]*r["size"][1]*4 for r in manifest["active_exports"])
    report = {
        "task_id":manifest["task"],"version":"v0.3",
        "checked_at":datetime.now(timezone(timedelta(hours=8))).isoformat(timespec="seconds"),
        "result":"PASS_STATIC_ARTIFACT_INTEGRITY_NOT_GAME_RUNTIME",
        "canvas":[3072,1024],"psd_format":psd.format,"psd_layers_actual":psd.n_frames,
        "psd_bytes":psd_path.stat().st_size,"psd_sha256":sha(psd_path),
        "active_png_count":18,"unmodified_v0_2_png_sha_count":17,
        "new_rail_slice_size":list(Image.open(ROOT/"exports/tex_sakura_rr_street_rail_half.png").size),
        "active_png_rgba8_theoretical_mib":round(rgba_bytes/1048576,2),
        "active_png_disk_bytes":sum((ROOT/r["path"]).stat().st_size for r in manifest["active_exports"]),
        "static_rgb_max_diff_psd_preview_vs_scene":0,
        "static_rgb_max_diff_psd_flatten_vs_scene":0,
        "static_rgb_max_diff_slice_reassembly_vs_scene":0,
        "protected_pixels":protected,
        "v0_2_bank_and_plants_source_rows_68_to_112_exact":True,
        "no_shop_or_reference_psd_layer":True,"no_shop_export":True,
        "imagegen_v0_3_calls":1,"total_imagegen_calls":15,"budget_limit":15,
        "browser_cpu_animation_tested_in_this_version":False,
        "cocos_import_memory_draw_batches_or_target_run_tested":False,
        "file_sha256":{name:sha(ROOT/name) for name in files},
        "package":{"path":str(archive.relative_to(ROOT)),"sha256":sha(archive),"bytes":archive.stat().st_size,"members":len(files),"crc":"PASS"},
    }
    (ROOT/"FILE_VERIFICATION.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"protected":protected,"psd_layers":psd.n_frames,"exports":18,"package":report["package"]},ensure_ascii=False))


if __name__ == "__main__":
    main()
