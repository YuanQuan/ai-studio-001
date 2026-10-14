"""Deterministic bridge-local masks and v0.4 layer continuation. No image generation."""
from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OLD = ROOT.parent / "v0.4"
W, H = 3072, 1024
RX0, RY0, RX1, RY1 = 1160, 520, 1912, 868
RW, RH = RX1 - RX0, RY1 - RY0


def sha(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


def mask_shapes() -> tuple[Image.Image, Image.Image]:
    # Manual semantic boundary on the aligned 752x348 production candidate.
    # The first mask covers the old/new bridge union and immediately exposed
    # street/water at the revised arch. It excludes the outer chain posts.
    union = Image.new("L", (RW, RH), 0)
    d = ImageDraw.Draw(union)
    d.polygon([
        (86, 327), (96, 290), (113, 250), (138, 210),
        (166, 166), (199, 136), (244, 108), (293, 88),
        (335, 78), (376, 77), (417, 78), (459, 88),
        (508, 108), (553, 136), (586, 166), (614, 210),
        (639, 250), (656, 290), (666, 327),
    ] + [(666, 347), (86, 347)], fill=255)
    # Keep most water in the opening from the established source. The cap
    # above y190 is intentionally repainted because the old lower arch would
    # otherwise remain in the higher new opening.
    d.polygon([
        (245, 348), (249, 309), (254, 274), (267, 240),
        (287, 213), (315, 195), (344, 186), (376, 185),
        (408, 186), (437, 195), (465, 213), (485, 240),
        (498, 274), (503, 309), (507, 348)
    ], fill=0)

    # Lamp and solid pedestal silhouettes, drawn independently to avoid
    # replacing the sky rectangle around the four lamps.
    lamps = [
        [(151, 125), (157, 118), (165, 113), (172, 110), (176, 111),
         (185, 117), (198, 128), (194, 138), (190, 141), (191, 169),
         (196, 176), (197, 220), (190, 229), (156, 229), (151, 220),
         (151, 178), (156, 170), (157, 142), (152, 138)],
        [(214, 68), (224, 63), (233, 57), (240, 53), (246, 55),
         (257, 63), (270, 69), (266, 82), (263, 85), (264, 111),
         (269, 119), (269, 176), (260, 183), (226, 183),
         (218, 176), (218, 119), (221, 111), (222, 85), (216, 82)],
    ]
    # Candidate is nearly symmetric in lantern placement; mirror only the
    # mask polygons, never the central emblem or source pixels.
    for poly in lamps:
        d.polygon(poly, fill=255)
        d.polygon([(RW - 1 - x, y) for x, y in poly], fill=255)
    for box in ((309, 72, 341, 107), (411, 72, 443, 107)):
        d.ellipse(box, fill=255)

    front = Image.new("L", (RW, RH), 0)
    f = ImageDraw.Draw(front)
    f.polygon([
        (184, 173), (204, 149), (243, 123), (290, 100),
        (332, 89), (376, 86), (420, 89), (462, 100),
        (509, 123), (548, 149), (568, 173),
        (566, 196), (548, 192), (509, 172), (467, 154),
        (427, 151), (409, 165), (376, 169), (343, 165),
        (325, 151), (285, 154), (243, 172), (204, 192),
        (186, 196),
    ], fill=255)
    for poly in lamps:
        f.polygon(poly, fill=255)
        f.polygon([(RW - 1 - x, y) for x, y in poly], fill=255)
    for box in ((309, 72, 341, 107), (411, 72, 443, 107)):
        f.ellipse(box, fill=255)
    # Front is always a subset of the union; exact pixels go to one layer.
    u = np.asarray(union) > 0
    fr = np.asarray(front) > 0
    u |= fr
    union = Image.fromarray((u * 255).astype(np.uint8), "L")
    return union, front


def main() -> None:
    (ROOT / "exports").mkdir(parents=True, exist_ok=True)
    (ROOT / "review").mkdir(parents=True, exist_ok=True)
    laydir = ROOT / "source/psd_full_canvas_layers"
    laydir.mkdir(parents=True, exist_ok=True)
    candidate = Image.open(ROOT / "source/bridge_candidate_aligned.png").convert("RGBA")
    assert candidate.size == (RW, RH)
    old_manifest = json.loads((OLD / "PSD_MANIFEST.json").read_text())
    old_layers = {rec["name"]: rec for rec in old_manifest["layers"]}
    old_body = Image.new("RGBA", (W, H))
    for name in ("bridge_body_l", "bridge_body_r"):
        old_body.alpha_composite(Image.open(OLD / old_layers[name]["file"]).convert("RGBA"))
    old_front = Image.new("RGBA", (W, H))
    for name in ("bridge_front_l", "bridge_front_r"):
        old_front.alpha_composite(Image.open(OLD / old_layers[name]["file"]).convert("RGBA"))
    body = np.array(old_body)
    front = np.zeros_like(body)
    cand = np.array(candidate)
    um, fm = mask_shapes()
    u = np.asarray(um) > 0
    f = np.asarray(fm) > 0
    # Remove every old foreground bridge pixel, including lamp bloom and
    # lower rails outside the new silhouette; fill the vacated spot from the
    # candidate as body when it is no longer a new foreground object.
    old_front_alpha = np.asarray(old_front.crop((RX0, RY0, RX1, RY1)).getchannel("A")) > 0
    # Upper old lamp pixels can simply reveal the unchanged sky after their
    # removal. Only the former low parapet/foot footprint needs new pixels;
    # otherwise candidate sky would be baked into the body texture.
    old_front_alpha[:175, :] = False
    u |= old_front_alpha
    Image.fromarray((u * 255).astype(np.uint8)).save(ROOT / "source/bridge_union_mask.png")
    b = u & ~f
    part = body[RY0:RY1, RX0:RX1]
    part[u] = 0
    part[b] = cand[b]
    front[RY0:RY1, RX0:RX1][f] = cand[f]
    # The revised arch rises above the old one. Blend the small formerly
    # blocked water cap into the established water over the next 45 pixels.
    water = Image.new("L", (RW, RH), 0)
    wd = ImageDraw.Draw(water)
    wd.polygon([(376, 169), (413, 174), (447, 190), (474, 215),
                (491, 241), (261, 241), (278, 215), (305, 190),
                (339, 174)], fill=255)
    cap = np.asarray(water) > 0
    for y in range(169, 242):
        weight = 255 if y <= 190 else max(0, round(255 * (241 - y) / 51))
        if not weight:
            continue
        take = cap[y] & ~f[y]
        if not np.any(take):
            continue
        old_row = Image.fromarray(body[RY0 + y, RX0:RX1][None, :, :])
        overlay = np.zeros((1, RW, 4), dtype=np.uint8)
        overlay[0, take, :3] = cand[y, take, :3]
        overlay[0, take, 3] = weight
        blend = Image.alpha_composite(old_row, Image.fromarray(overlay))
        body[RY0 + y, RX0:RX1] = np.asarray(blend)[0]
    Image.fromarray(np.asarray(fm)).save(ROOT / "source/bridge_front_mask.png")

    # Keep the two geographic half-canvas identities; no mirror of center art.
    new_layers = {}
    active = []
    for kind, pixels in (("body", body), ("front", front)):
        for side, x0, x1 in (("l", 0, 1536), ("r", 1536, 3072)):
            full = np.zeros_like(pixels)
            full[:, x0:x1] = pixels[:, x0:x1]
            layer_path = laydir / f"bridge_{kind}_{side}.png"
            Image.fromarray(full, "RGBA").save(layer_path)
            new_layers[f"bridge_{kind}_{side}"] = {
                "name": f"bridge_{kind}_{side}",
                "file": str(layer_path.relative_to(ROOT)),
                "sha256": sha(layer_path),
            }
            sprite = Image.fromarray(pixels[512:1024, x0:x1], "RGBA")
            bbox = sprite.getchannel("A").getbbox()
            assert bbox is not None
            asset_path = ROOT / "exports" / f"tex_sakura_rr_bridge_{kind}_{side}.png"
            sprite.crop(bbox).save(asset_path)
            active.append({
                "path": str(asset_path.relative_to(ROOT)),
                "sha256": sha(asset_path), "size": list(Image.open(asset_path).size),
                "side": side, "kind": kind, "half_bbox_xyxy": list(bbox),
                "instance_xy": [x0 + bbox[0], 512 + bbox[1]], "mirror": False,
            })

    unchanged = []
    prev_cut = json.loads((OLD / "CUT_MANIFEST.json").read_text())
    for rec in prev_cut["active_exports"]:
        if "bridge_" in rec["path"]:
            continue
        out = ROOT / rec["path"]
        out.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(OLD / rec["path"], out)
        assert sha(out) == rec["sha256"]
        unchanged.append(rec)
    assert len(unchanged) == 17

    layers = []
    for rec in old_manifest["layers"]:
        if rec["name"] in new_layers:
            layers.append({"name": rec["name"], "file": new_layers[rec["name"]]["file"],
                           "fit": "none", "remove_background": "none"})
        else:
            target = ROOT / rec["file"]
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(OLD / rec["file"], target)
            layers.append(rec)
    assert len(layers) == 45
    manifest = {
        "canvas": {"width": W, "height": H, "composite_background": "#15173b"},
        "output": "source/scene_sakura_reuse_master.psd",
        "preview": "review/scene_psd_preview.png",
        "layers": layers,
    }
    (ROOT / "PSD_MANIFEST.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")

    scene = Image.new("RGBA", (W, H))
    for rec in layers:
        scene.alpha_composite(Image.open(ROOT / rec["file"]).convert("RGBA"))
    scene.save(ROOT / "review/scene_environment.png")
    active_by_id = {f"bridge_{a['kind']}_{a['side']}": a for a in active}
    instances = []
    for rec in prev_cut["instances_bottom_to_top"]:
        iid = rec.get("instance_id")
        if iid in active_by_id:
            a = active_by_id[iid]
            instances.append({
                "asset": Path(a["path"]).name, "instance_id": iid,
                "x": a["instance_xy"][0], "y": a["instance_xy"][1],
                "mirror": False, "render_band": rec.get("render_band", "L03_BRIDGE"),
            })
        else:
            instances.append(rec)
    rebuilt = Image.new("RGBA", (W, H))
    for rec in instances:
        sprite = Image.open(ROOT / "exports" / rec["asset"]).convert("RGBA")
        if "width" in rec:
            sprite = sprite.resize((rec["width"], rec["height"]), Image.Resampling.LANCZOS)
        if rec.get("mirror"):
            sprite = ImageOps.mirror(sprite)
        rebuilt.alpha_composite(sprite, (rec["x"], rec["y"]))
    assert np.array_equal(np.asarray(scene), np.asarray(rebuilt)), "actual export reassembly differs from PSD layers"
    rebuilt.save(ROOT / "review/reassembled_from_exports.png")
    old_scene = np.array(Image.open(OLD / "review/reassembled_from_exports.png").convert("RGBA"))
    new_scene = np.array(scene)
    outside = np.ones((H, W), dtype=bool)
    outside[RY0:RY1, RX0:RX1] = False
    assert np.array_equal(old_scene[outside], new_scene[outside])
    (ROOT / "CUT_MANIFEST.json").write_text(json.dumps({
        "task": "SAKURA-BRIDGE-SHAPE-PRODUCTION-ART-20261014",
        "version": "v0.5", "canvas": [W, H],
        "roi_xyxy": [RX0, RY0, RX1, RY1],
        "bridge_union_mask": "source/bridge_union_mask.png",
        "bridge_front_mask": "source/bridge_front_mask.png",
        "bridge_union_mask_sha256": sha(ROOT / "source/bridge_union_mask.png"),
        "bridge_front_mask_sha256": sha(ROOT / "source/bridge_front_mask.png"),
        "bridge_union_pixels": int(u.sum()), "bridge_front_pixels": int(f.sum()),
        "body_front_alpha_overlap_pixels": 0,
        "active_exports": unchanged + active,
        "instances_bottom_to_top": instances,
        "unchanged_nonbridge_count": len(unchanged),
        "bridge_instance_mapping": active,
        "bridge_export_rect_area_pixels": sum(a["size"][0] * a["size"][1] for a in active),
        "bridge_export_rgba8_uncompressed_bytes": 4 * sum(a["size"][0] * a["size"][1] for a in active),
        "center_badge_note": "The single native central spiral is split at x=1536 between two non-mirrored adjacent halves; pixels are not duplicated.",
        "scene_sha256": sha(ROOT / "review/reassembled_from_exports.png"),
        "roi_outside_decoded_rgba_diff_pixels": 0,
        "candidate_native": "source/native/bridge_candidate_16.png",
        "imagegen_calls_this_batch": 1, "cumulative_imagegen_calls": 16,
    }, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"scene_sha": sha(ROOT / "review/reassembled_from_exports.png"),
                      "new_bridge_assets": len(active), "unchanged": len(unchanged),
                      "mask_union": int(u.sum()), "front": int(f.sum())}))


if __name__ == "__main__":
    main()
