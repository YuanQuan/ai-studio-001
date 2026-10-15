"""Deterministic local edit of the approved v0.5 raster layers.

No image generation, inpainting, external pixels, or app asset writes.
"""
from __future__ import annotations

import hashlib
import json
import math
import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[4]
OLD = ROOT / "deliverables/art/SCENE-SAKURA-REDRAW-REUSE-20261013/v0.5"
OUT = Path(__file__).resolve().parent
LAYER_DIR = OUT / "source/psd_full_canvas_layers"
EXPORT_DIR = OUT / "exports"
REVIEW_DIR = OUT / "review"
EXPECTED_PSD = "1a0c525d679b5dbcbda7812ce97bba8401698c1d3fe0ace45f39b82a449d3d49"
PSD_SCRIPT = Path("/Users/yuanquan/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py")
STREET_WIDTH = 1172
RIGHT_STREET_X = 3072 - STREET_WIDTH


def sha(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fp:
        for chunk in iter(lambda: fp.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def rgba(path: Path) -> np.ndarray:
    return np.array(Image.open(path).convert("RGBA"), dtype=np.uint8)


def save(arr: np.ndarray, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(arr, "RGBA").save(path)


def clear_islands(arr: np.ndarray, side: str) -> np.ndarray:
    # Rectangles enclose only disconnected residual arcs seen in the v0.5 body alpha.
    # The lower bridge crown is deliberately left alone.
    if side == "l":
        rects = [(1422, 0, 1472, 36), (1348, 45, 1380, 87), (1496, 0, 1536, 14)]
    else:
        rects = [(1536, 0, 1577, 14), (1601, 6, 1649, 37), (1692, 45, 1723, 87)]
    for x0, y0, x1, y1 in rects:
        origin_y = 598 if side == "l" else 597
        arr[origin_y + y0 : origin_y + y1, x0:x1, :] = 0
    return arr


def clear_water_block(arr: np.ndarray, side: str) -> tuple[np.ndarray, int]:
    # Continuous cut follows the existing lower stone silhouette. Water already
    # exists in water_rail, so this body-layer rectangular water tail is redundant.
    left_poly = [(1246, 856), (1272, 850), (1300, 841), (1340, 839),
                 (1390, 838), (1442, 834), (1442, 868), (1246, 868)]
    poly = left_poly if side == "l" else [(3072-x, y) for x, y in left_poly]
    mask = Image.new("1", (3072, 1024), 0)
    ImageDraw.Draw(mask).polygon(poly, fill=1)
    cut = np.array(mask, dtype=bool) & (arr[..., 3] > 0)
    count = int(cut.sum())
    arr[cut] = 0
    return arr, count


def create_eye_layers(far: np.ndarray, old_composite: np.ndarray) -> tuple[np.ndarray, np.ndarray, dict]:
    src = far.copy()
    base = far.copy()
    glow = np.zeros_like(far)
    eye_boxes = [(1284, 250, 1326, 298), (1352, 261, 1383, 304)]
    interior_ellipses = [(1287, 253, 1322, 294), (1354, 262, 1380, 301)]
    stats = []
    for box, ellipse in zip(eye_boxes, interior_ellipses):
        x0, y0, x1, y1 = box
        m = Image.new("1", (x1-x0, y1-y0), 0)
        ImageDraw.Draw(m).ellipse((ellipse[0]-x0, ellipse[1]-y0, ellipse[2]-x0, ellipse[3]-y0), fill=1)
        mask = np.array(m, dtype=bool) & (src[y0:y1, x0:x1, 3] > 0)
        eye_base = base[y0:y1, x0:x1]
        eye_glow = glow[y0:y1, x0:x1]
        ambient = np.array([72, 29, 24], dtype=np.float32)
        dark = np.rint(src[y0:y1, x0:x1, :3].astype(np.float32) * 0.40 + ambient * 0.60).astype(np.uint8)
        eye_base[mask, :3] = dark[mask]
        # v0.5 far pixels have alpha 251-253. At the fully bright keyframe an
        # opaque overlay of the already-approved composite restores exact
        # visible RGB; otherwise a second alpha-over would brighten differently.
        eye_glow[mask, :3] = old_composite[y0:y1, x0:x1][mask]
        eye_glow[mask, 3] = 255
        yy, xx = np.where(mask)
        stats.append({"box_xyxy": [x0, y0, x1, y1], "mask_bbox_xyxy": [x0 + int(xx.min()), y0 + int(yy.min()), x0 + int(xx.max()) + 1, y0 + int(yy.max()) + 1], "pixels": int(mask.sum())})
    return base, glow, {"eyes": stats, "glow_alpha": "0.5+0.5*cos(2*pi*t/4), t seconds; bright at 0/4, microglow dark at 2"}


def main() -> None:
    assert sha(OLD / "source/scene_sakura_reuse_master.psd") == EXPECTED_PSD
    assert PSD_SCRIPT.is_file()
    LAYER_DIR.mkdir(parents=True, exist_ok=True)
    EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    REVIEW_DIR.mkdir(parents=True, exist_ok=True)
    old_manifest = json.loads((OLD / "PSD_MANIFEST.json").read_text())
    layer_entries = []
    original_paths = {}
    for item in old_manifest["layers"]:
        name = item["name"]
        src = OLD / item["file"]
        dest = LAYER_DIR / (name + ".png")
        shutil.copy2(src, dest)
        original_paths[name] = src
        layer_entries.append({"name": name, "file": str(dest.relative_to(OUT)), "fit": "none", "remove_background": "none"})

    # Eye dark base and bright overlay. At full intensity the original eye pixels
    # are placed back exactly; outside the two eye masks the far raster is unchanged.
    far = rgba(LAYER_DIR / "far_l.png")
    old_composite = np.array(Image.open(OLD / "review/scene_psd_preview.png").convert("RGB"), dtype=np.uint8)
    dark, glow, eye_stats = create_eye_layers(far, old_composite)
    save(dark, LAYER_DIR / "far_l.png")
    save(glow, LAYER_DIR / "far_l_eye_glow.png")
    save(dark[:720, :1536], EXPORT_DIR / "tex_sakura_rr_far_l_eye_dark_base.png")
    # Crop a tight transparent eye layer; local offset recorded in manifest.
    bbox = [1284, 250, 1383, 304]
    save(glow[bbox[1]:bbox[3], bbox[0]:bbox[2]], EXPORT_DIR / "tex_sakura_rr_far_l_eye_glow.png")
    far_index = next(i for i, v in enumerate(layer_entries) if v["name"] == "far_l")
    layer_entries.insert(far_index + 1, {"name": "far_l_eye_glow", "file": "source/psd_full_canvas_layers/far_l_eye_glow.png", "fit": "none", "remove_background": "none"})

    # The repeated road segment is separated before touching the unique bridge
    # foot, arch, medallion or front rail. Right side uses the same exact pixels.
    body_l = rgba(LAYER_DIR / "bridge_body_l.png")
    body_r = rgba(LAYER_DIR / "bridge_body_r.png")
    street = body_l[598:868, 0:STREET_WIDTH].copy()
    street_l = np.zeros_like(body_l)
    street_r = np.zeros_like(body_l)
    street_l[598:868, 0:STREET_WIDTH] = street
    street_r[598:868, RIGHT_STREET_X:3072] = street[:, ::-1]
    body_l[598:868, 0:STREET_WIDTH] = 0
    body_r[597:868, RIGHT_STREET_X:3072] = 0
    body_l = clear_islands(body_l, "l")
    body_r = clear_islands(body_r, "r")
    body_l, removed_water_l = clear_water_block(body_l, "l")
    body_r, removed_water_r = clear_water_block(body_r, "r")
    save(street_l, LAYER_DIR / "bridge_street_l_master.png")
    save(street_r, LAYER_DIR / "bridge_street_r_mirror_instance.png")
    save(body_l, LAYER_DIR / "bridge_body_l.png")
    save(body_r, LAYER_DIR / "bridge_body_r.png")
    save(street, EXPORT_DIR / "tex_sakura_rr_bridge_street_master.png")
    save(body_l[598:868, :1536], EXPORT_DIR / "tex_sakura_rr_bridge_body_l_clean.png")
    save(body_r[597:868, 1536:], EXPORT_DIR / "tex_sakura_rr_bridge_body_r_clean.png")
    # Front slices retain source bytes to make their identity explicit.
    for name in ("tex_sakura_rr_bridge_front_l.png", "tex_sakura_rr_bridge_front_r.png"):
        shutil.copy2(OLD / "exports" / name, EXPORT_DIR / name)
    for name in ("bridge_body_l", "bridge_body_r"):
        idx = next(i for i, v in enumerate(layer_entries) if v["name"] == name)
        street_name = "bridge_street_l_master" if name.endswith("_l") else "bridge_street_r_mirror_instance"
        layer_entries.insert(idx, {"name": street_name, "file": f"source/psd_full_canvas_layers/{street_name}.png", "fit": "none", "remove_background": "none"})

    manifest = {"canvas": {"width": 3072, "height": 1024, "composite_background": "#15173b"}, "output": "source/scene_sakura_revision_master.psd", "preview": "review/scene_psd_preview.png", "layers": layer_entries}
    (OUT / "PSD_MANIFEST.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    subprocess.run([sys.executable, str(PSD_SCRIPT), "assemble", "--manifest", str(OUT / "PSD_MANIFEST.json"), "--output", str(OUT / "source/scene_sakura_revision_master.psd"), "--preview", str(REVIEW_DIR / "scene_psd_preview.png")], check=True)
    # PSD preview is the literal deliverable layers, with reference layer absent.
    preview = Image.open(REVIEW_DIR / "scene_psd_preview.png").convert("RGB")
    old_preview = Image.open(OLD / "review/scene_psd_preview.png").convert("RGB")
    # Full scene and bridge detail for direct Gate2 inspection.
    preview.save(REVIEW_DIR / "scene_reassembled_bright.png")
    old_preview.crop((0, 0, 3072, 1024)).resize((1536, 512)).save(REVIEW_DIR / "old_scene_halfscale.png")
    preview.resize((1536, 512)).save(REVIEW_DIR / "new_scene_halfscale.png")
    bridge_box = (1160, 560, 1912, 868)
    bridge_old = old_preview.crop(bridge_box)
    bridge_new = preview.crop(bridge_box)
    comparison = Image.new("RGB", (1504, 308), "#15173b")
    comparison.paste(bridge_old, (0, 0)); comparison.paste(bridge_new, (752, 0))
    comparison.save(REVIEW_DIR / "bridge_before_after_same_scale.png")
    # A full scene low-light eye state plus a small animated original-pixel preview.
    eye_crop_box = (1180, 180, 1450, 380)
    bright_eye = preview.crop(eye_crop_box)
    dark_composite = Image.new("RGBA", (3072, 1024))
    for entry in layer_entries:
        if entry["name"] != "far_l_eye_glow":
            dark_composite.alpha_composite(Image.open(OUT / entry["file"]).convert("RGBA"))
    dark_scene = dark_composite.convert("RGB")
    eye_mask = glow[..., 3] > 0
    dark_scene.save(REVIEW_DIR / "scene_reassembled_eye_dark.png")
    frames = []
    base_eye = np.array(dark_scene.crop(eye_crop_box), dtype=np.uint8)
    bright_eye_arr = np.array(bright_eye, dtype=np.uint8)
    m = eye_mask[eye_crop_box[1]:eye_crop_box[3], eye_crop_box[0]:eye_crop_box[2]]
    for k in range(32):
        a = 0.5 + 0.5 * math.cos(2 * math.pi * k / 32)
        frame = base_eye.copy()
        frame[m] = np.rint(base_eye[m].astype(np.float32) * (1-a) + bright_eye_arr[m].astype(np.float32) * a).astype(np.uint8)
        frames.append(Image.fromarray(frame, "RGB"))
    frames[0].save(REVIEW_DIR / "far_l_eyes_4s_loop.png", save_all=True, append_images=frames[1:], duration=125, loop=0, default_image=False, disposal=0, blend=0)
    bright_eye.save(REVIEW_DIR / "far_l_eyes_bright.png")
    dark_scene.crop(eye_crop_box).save(REVIEW_DIR / "far_l_eyes_dark.png")
    audit = {"source_psd_sha256": EXPECTED_PSD, "batch": "EXAMPLE-REVISION-ART-20261015/v0.1", "canvas": [3072, 1024], "street_master": {"source": "v0.5 bridge_body_l", "crop_xyxy_in_half": [0, 0, STREET_WIDTH, 270], "export_size": [STREET_WIDTH, 270], "left_instance_xy": [0, 598], "right_instance_xy": [RIGHT_STREET_X, 598], "right_flip_x": True}, "eye": {**eye_stats, "source_layer": "far_l", "dark_base_size": [1536,720], "glow_crop_xyxy": bbox, "glow_export_size": [bbox[2]-bbox[0],bbox[3]-bbox[1]], "glow_instance_xy": [bbox[0],bbox[1]], "far_r_changed": False}, "water_pixels_removed": {"left": removed_water_l, "right": removed_water_r}, "layers": len(layer_entries), "generation_calls": 0, "files": {}}
    for f in sorted(OUT.rglob("*")):
        if f.is_file() and f.name not in {"build_art_v01.py", "BUILD_AUDIT.json"}:
            audit["files"][str(f.relative_to(OUT))] = sha(f)
    (OUT / "BUILD_AUDIT.json").write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({k: audit[k] for k in ("layers", "eye", "street_master", "water_pixels_removed", "generation_calls")}, ensure_ascii=False))


if __name__ == "__main__":
    main()
