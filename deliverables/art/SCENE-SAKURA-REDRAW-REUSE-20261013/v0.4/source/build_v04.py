"""Deterministic v0.4 split of the existing bridge pixels. No generated pixels."""
from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OLD = ROOT.parent / "v0.3"
W, H = 3072, 1024
EXPORTS = ROOT / "exports"
LAYERS = ROOT / "source/psd_full_canvas_layers"
REVIEW = ROOT / "review"
R = Image.Resampling.LANCZOS


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def full(sprite: Image.Image, x: int, y: int) -> Image.Image:
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    out.alpha_composite(sprite, (x, y))
    return out


def bridge_front_mask() -> Image.Image:
    """Hand-picked outline: lamps, far parapet, near parapet; x/y in old half."""
    m = Image.new("L", (1536, 512), 0)
    d = ImageDraw.Draw(m)
    # Near parapet upper and lower stone seams.  The road remains below the
    # far balustrade and behind this near strip, rather than moving wholesale.
    d.polygon([
        (1235, 230), (1245, 225), (1255, 220), (1265, 217), (1275, 215),
        (1285, 212), (1295, 209), (1305, 205), (1315, 202), (1325, 198),
        (1335, 195), (1345, 194), (1355, 201), (1365, 202), (1375, 198),
        (1385, 195), (1395, 191), (1405, 187), (1415, 183),
        (1415, 205), (1405, 218),
        (1395, 222), (1385, 225), (1375, 227), (1365, 228), (1355, 228),
        (1345, 228), (1335, 228), (1325, 228), (1315, 228), (1305, 228),
        (1295, 228), (1285, 231), (1275, 232), (1265, 232), (1255, 231),
        (1245, 230), (1235, 230)
    ], fill=255)
    # Far-side balustrade: retain the walkway sliver between the two rails.
    d.polygon([
        (1325, 177), (1335, 172), (1345, 167), (1355, 161), (1365, 155),
        (1375, 150), (1385, 145), (1395, 139), (1405, 134), (1415, 129),
        (1425, 124), (1435, 119), (1445, 115), (1455, 110), (1465, 106),
        (1475, 102), (1485, 100), (1495, 98), (1505, 96), (1515, 95),
        (1525, 94), (1535, 94), (1535, 149), (1525, 149), (1515, 150),
        (1505, 151), (1495, 151), (1485, 151), (1475, 149), (1465, 148),
        (1455, 150), (1445, 153), (1435, 156), (1425, 161), (1415, 165),
        (1405, 170), (1395, 174), (1385, 179), (1375, 183), (1365, 188),
        (1355, 193), (1345, 197), (1335, 201), (1325, 206)
    ], fill=255)
    # First lantern halo/roof/stem and its continuous stone pedestal.
    d.polygon([
        (1310, 76), (1320, 74), (1326, 69), (1332, 75), (1340, 82),
        (1349, 87), (1358, 92), (1363, 101), (1364, 117), (1361, 135),
        (1354, 146), (1345, 150), (1343, 174), (1354, 176), (1355, 228),
        (1349, 229), (1312, 229), (1308, 228), (1308, 180), (1318, 174),
        (1317, 151), (1308, 147), (1301, 139), (1296, 127), (1294, 114),
        (1296, 103), (1300, 93)
    ], fill=255)
    # Second lantern and pillar. Its glow is preserved via original alpha.
    d.polygon([
        (1366, 57), (1371, 51), (1382, 48), (1389, 39), (1394, 34),
        (1400, 39), (1406, 48), (1416, 52), (1423, 60), (1427, 75),
        (1427, 89), (1424, 106), (1417, 115), (1408, 119), (1406, 130),
        (1417, 132), (1417, 178), (1410, 182), (1378, 185), (1373, 180),
        (1373, 135), (1380, 127), (1381, 116), (1372, 109), (1365, 98),
        (1361, 84), (1362, 69)
    ], fill=255)
    # Center crest and rounded post touch the mirror axis as one continuous rail.
    d.polygon([(1459, 85), (1471, 84), (1482, 90), (1488, 103),
               (1487, 151), (1455, 157), (1451, 144), (1451, 105)], fill=255)
    d.polygon([(1493, 96), (1505, 95), (1535, 94), (1535, 157),
               (1504, 161), (1491, 152)], fill=255)
    # The original lantern bloom has sparse low-alpha edge pixels outside its
    # visible silhouette. Move those source pixels with the lamp, too.
    d.rectangle((1288, 65, 1367, 173), fill=255)
    d.rectangle((1358, 30, 1430, 145), fill=255)
    d.rectangle((1308, 168, 1320, 180), fill=255)
    d.rectangle((1365, 147, 1375, 158), fill=255)
    d.rectangle((1470, 80, 1490, 100), fill=255)
    d.rectangle((1500, 88, 1535, 100), fill=255)
    return m


def build() -> None:
    EXPORTS.mkdir(parents=True, exist_ok=True)
    LAYERS.mkdir(parents=True, exist_ok=True)
    REVIEW.mkdir(parents=True, exist_ok=True)
    prior = json.loads((OLD / "CUT_MANIFEST.json").read_text())
    source = Image.open(OLD / "exports/tex_sakura_rr_bridge_half.png").convert("RGBA")
    original = np.asarray(source).copy()
    mask = np.asarray(bridge_front_mask(), dtype=np.uint8) > 0
    alpha = original[:, :, 3] > 0
    selected = mask & alpha
    assert selected.any() and not selected[:34].any() and not selected[287:].any()
    front_np = original.copy()
    front_np[~selected] = 0
    body_np = original.copy()
    body_np[selected] = 0
    assert not np.any((front_np[:, :, 3] > 0) & (body_np[:, :, 3] > 0))
    exact = np.where(selected[:, :, None], front_np, body_np)
    assert np.array_equal(exact, original)
    front = Image.fromarray(front_np, "RGBA")
    body = Image.fromarray(body_np, "RGBA")
    bbox = front.getchannel("A").getbbox()
    assert bbox and bbox[0] >= 1235 and bbox[1] >= 34 and bbox[2] <= 1536 and bbox[3] <= 287
    tight = front.crop(bbox)
    mask_file = ROOT / "source/bridge_front_hand_mask.png"
    bridge_front_mask().save(mask_file)
    body_file = EXPORTS / "tex_sakura_rr_bridge_body_half.png"
    front_file = EXPORTS / "tex_sakura_rr_bridge_front_half.png"
    body.save(body_file)
    tight.save(front_file)

    unchanged = []
    for rec in prior["active_exports"]:
        if rec["path"].endswith("tex_sakura_rr_bridge_half.png"):
            continue
        target = ROOT / rec["path"]
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(OLD / rec["path"], target)
        assert sha(target) == rec["sha256"]
        unchanged.append(rec)

    # Two full-canvas bridge source layers are split at their original positions.
    new_bridge = {}
    for side, x in (("l", 0), ("r", 1536)):
        for kind, part in (("body", body), ("front", front)):
            sprite = part if side == "l" else ImageOps.mirror(part)
            name = f"bridge_{kind}_{side}"
            target = LAYERS / f"{name}.png"
            full(sprite, x, 512).save(target)
            new_bridge[name] = {"name": name, "file": str(target.relative_to(ROOT)), "sha256": sha(target)}
    layers = []
    for rec in prior["psd_layers_bottom_to_top"]:
        if rec["name"] in ("bridge_l", "bridge_r"):
            side = rec["name"][-1]
            layers.extend((new_bridge[f"bridge_body_{side}"], new_bridge[f"bridge_front_{side}"]))
        else:
            target = ROOT / rec["file"]
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(OLD / rec["file"], target)
            assert sha(target) == rec["sha256"]
            layers.append(rec)
    assert len(layers) == len(prior["psd_layers_bottom_to_top"]) + 2

    x0, y0, x1, y1 = bbox
    new_instances = []
    for rec in prior["instances_bottom_to_top"]:
        if rec["asset"] != "tex_sakura_rr_bridge_half.png":
            new_instances.append(rec)
            continue
        side = "r" if rec.get("mirror") else "l"
        body_instance = {**rec, "asset": body_file.name, "instance_id": f"bridge_body_{side}"}
        front_instance = {
            "asset": front_file.name, "instance_id": f"bridge_front_{side}",
            "x": x0 if side == "l" else 1536 + (1536 - x1),
            "y": 512 + y0, "mirror": side == "r",
            "render_band": "L04_FRONT_AFTER_OCCUPANTS_BEFORE_STONE_CHAIN",
        }
        new_instances.extend((body_instance, front_instance))

    scene = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for rec in layers:
        scene.alpha_composite(Image.open(ROOT / rec["file"]).convert("RGBA"))
    rebuilt = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for rec in new_instances:
        sprite = Image.open(EXPORTS / rec["asset"]).convert("RGBA")
        if "width" in rec:
            sprite = sprite.resize((rec["width"], rec["height"]), R)
        if rec.get("mirror"):
            sprite = ImageOps.mirror(sprite)
        rebuilt.alpha_composite(sprite, (rec["x"], rec["y"]))
    old_scene = Image.open(OLD / "review/reassembled_from_exports.png").convert("RGBA")
    assert np.array_equal(np.asarray(scene), np.asarray(rebuilt))
    assert np.array_equal(np.asarray(rebuilt), np.asarray(old_scene))
    scene.save(REVIEW / "scene_environment.png")
    rebuilt.save(REVIEW / "reassembled_from_exports.png")

    # Reviewer figures: 1:1 crop and a labelled, geometry-only occupant demo.
    detail_box = (1150, 535, 1922, 870)
    detail = scene.crop(detail_box)
    detail.save(REVIEW / "bridge_front_detail.png")
    # Opaque rectangles are temporary placeholders; no shop or character asset.
    base = scene.copy()
    body_only = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for rec in layers:
        if rec["name"].startswith("bridge_front_"):
            continue
        body_only.alpha_composite(Image.open(ROOT / rec["file"]).convert("RGBA"))
    demo = body_only.crop((1150, 520, 1922, 870))
    rect = Image.new("RGBA", demo.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(rect)
    draw.rounded_rectangle((235, 90, 305, 214), radius=10, fill=(61, 219, 207, 230), outline=(255, 255, 255, 255), width=2)
    draw.rounded_rectangle((470, 110, 540, 214), radius=10, fill=(243, 185, 97, 230), outline=(255, 255, 255, 255), width=2)
    demo.alpha_composite(rect)
    for side, x in (("l", 0), ("r", 1536)):
        sprite = front if side == "l" else ImageOps.mirror(front)
        full_front = full(sprite, x, 512)
        demo.alpha_composite(full_front.crop((1150, 520, 1922, 870)))
    # Four visible labels are added outside the illustration strip.
    board = Image.new("RGB", (772, 405), (22, 25, 45))
    board.paste(demo.convert("RGB"), (0, 55))
    labels = ImageDraw.Draw(board)
    labels.text((12, 8), "v0.4 OCCLUSION DEMO / PLACEHOLDER RECTANGLES ONLY", fill=(255, 255, 255))
    labels.text((12, 28), "bridge body -> visitor/shop-foot placeholders -> front rail", fill=(180, 230, 235))
    board.save(REVIEW / "occlusion_placeholder_demo.png")

    exports = [{"path": rec["path"], "sha256": sha(ROOT / rec["path"]), "size": list(Image.open(ROOT / rec["path"]).size)} for rec in unchanged]
    for file in (body_file, front_file):
        exports.append({"path": str(file.relative_to(ROOT)), "sha256": sha(file), "size": list(Image.open(file).size)})
    out = {
        "task": "SAKURA-BRIDGE-FRONT-ART-20261014", "version": "v0.4", "canvas": [W, H],
        "baseline_version": "v0.3", "baseline_scene_sha256": sha(OLD / "review/reassembled_from_exports.png"),
        "source_bridge_half_sha256": sha(OLD / "exports/tex_sakura_rr_bridge_half.png"),
        "bridge_source_half_size": [1536, 512], "bridge_body_half_size": [1536, 512],
        "bridge_front_source_half_bbox_xyxy_half_open": list(bbox),
        "bridge_front_tight_size": list(tight.size),
        "bridge_front_left_instance_xy": [x0, 512 + y0],
        "bridge_front_right_mirrored_instance_xy": [1536 + (1536 - x1), 512 + y0],
        "active_exports": exports, "instances_bottom_to_top": new_instances,
        "psd_layers_bottom_to_top": layers,
        "unchanged_v0_3_exports_count": len(unchanged),
        "source_mask": str(mask_file.relative_to(ROOT)), "source_mask_sha256": sha(mask_file),
        "source_selected_nonzero_alpha_pixels": int(selected.sum()),
        "body_front_alpha_overlap_pixels": 0, "source_half_exact_partition_rgba_diff_pixels": 0,
        "source_half_standard_composite_visible_diff_pixels": 0,
        "scene_vs_v0_3_rgba_diff_pixels": 0, "scene_vs_exports_rgba_diff_pixels": 0,
        "scene_sha256": sha(REVIEW / "scene_environment.png"),
        "reassembly_sha256": sha(REVIEW / "reassembled_from_exports.png"),
        "imagegen_calls_this_batch": 0,
        "new_shop_assets": 0,
    }
    (ROOT / "CUT_MANIFEST.json").write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n")
    pm = {
        "canvas": {"width": W, "height": H, "composite_background": "#15173b"},
        "output": "source/scene_sakura_reuse_master.psd", "preview": "review/scene_psd_preview.png",
        "layers": [{"name": rec["name"], "file": rec["file"], "fit": "none", "remove_background": "none"} for rec in layers],
    }
    (ROOT / "PSD_MANIFEST.json").write_text(json.dumps(pm, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"front_bbox": bbox, "front_size": tight.size, "selected_pixels": int(selected.sum()), "layers": len(layers), "exports": len(exports)}, ensure_ascii=False))


if __name__ == "__main__":
    build()
