# -*- coding: utf-8 -*-
"""One deterministic asset-to-layer pipeline for the environment-only master."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parents[1]
NATIVE = ROOT / "source/native"
EXPORTS = ROOT / "exports"
LAYERS = ROOT / "source/psd_full_canvas_layers"
REVIEW = ROOT / "review"
W, H = 3072, 1024
R = Image.Resampling.LANCZOS


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read(name: str) -> Image.Image:
    return Image.open(NATIVE / name).convert("RGBA")


def canvas() -> Image.Image:
    return Image.new("RGBA", (W, H), (0, 0, 0, 0))


def clean(img: Image.Image, cutoff: int = 3) -> Image.Image:
    alpha = img.getchannel("A").point(lambda v: 0 if v < cutoff else v)
    img.putalpha(alpha)
    return img


def place(sprite: Image.Image, x: int, y: int) -> Image.Image:
    out = canvas()
    out.alpha_composite(sprite, (x, y))
    return out


def mirror_half(half: Image.Image, y: int) -> tuple[Image.Image, Image.Image]:
    return place(half, 0, y), place(ImageOps.mirror(half), 1536, y)


def asset(name: str, img: Image.Image) -> Path:
    path = EXPORTS / f"tex_sakura_rr_{name}.png"
    img.save(path)
    return path


def add(name: str, img: Image.Image, out_layers: list[dict]) -> None:
    assert img.size == (W, H) and img.getchannel("A").getbbox()
    path = LAYERS / f"{len(out_layers)+1:02d}_{name}.png"
    img.save(path)
    out_layers.append({"name": name, "file": str(path.relative_to(ROOT)), "sha256": digest(path)})


def spirit_parts(sprite: Image.Image, stem: str) -> dict[str, Image.Image]:
    # Semantic bands from each newly drawn prototype.  One pixel belongs to
    # exactly one part, so rest-state reassembly is pixel-identical.
    h = sprite.height
    cuts = (round(h * 0.61), round(h * 0.76))
    parts = {}
    for name, ya, yb in (("flame", 0, cuts[0]), ("lotus", cuts[0], cuts[1]), ("reflection", cuts[1], h)):
        mask = Image.new("L", sprite.size, 0)
        mask.paste(255, (0, ya, sprite.width, yb))
        part = sprite.copy()
        part.putalpha(Image.composite(sprite.getchannel("A"), Image.new("L", sprite.size, 0), mask))
        asset(f"{stem}_{name}", part)
        parts[name] = part
    return parts


def main() -> None:
    EXPORTS.mkdir(exist_ok=True)
    LAYERS.mkdir(exist_ok=True)
    REVIEW.mkdir(exist_ok=True)
    out_layers: list[dict] = []
    instances: list[dict] = []

    # Opaque asymmetric sky: left and right are distinct, not mirrored.
    sky = read("sky_moon_correction_01_native.png").resize((W, H), R)
    for side, x in (("l", 0), ("r", 1536)):
        half = sky.crop((x, 0, x + 1536, H))
        p = asset(f"sky_{side}", half)
        add(f"sky_{side}", place(half, x, 0), out_layers)
        instances.append({"asset": p.name, "x": x, "y": 0, "mirror": False})

    # Unique mountain panorama. A mist fade removes the lower photographic
    # fringe before its 720px export boundary; the skull landmark stays intact.
    far = clean(read("far_initial_native.png").resize((W, H), R), 8)
    alpha = far.getchannel("A")
    fade = Image.new("L", (1, H), 0)
    for y in range(H):
        opacity = 255 if y < 620 else round(255 * (720-y)/100) if y < 720 else 0
        fade.putpixel((0, y), max(0, opacity))
    fade = fade.resize((W, H))
    from PIL import ImageChops
    far.putalpha(ImageChops.multiply(alpha, fade))
    for side, x in (("l", 0), ("r", 1536)):
        half = far.crop((x, 0, x + 1536, 720))
        p = asset(f"far_{side}", half)
        add(f"far_{side}", place(half, x, 0), out_layers)
        instances.append({"asset": p.name, "x": x, "y": 0, "mirror": False})

    spirit_source = {}
    for label, native in (("spirit_a", "spirit_a_initial_native.png"), ("spirit_b", "spirit_b_initial_native.png")):
        sprite = clean(read(native).resize((160, 160), R), 8)
        spirit_source[label] = spirit_parts(sprite, label)

    # Original two tree prototypes are exported once each, instanced four
    # times without creating four distinct textures.
    for label, native, size in (("tree_a", "tree_a_initial_native.png", 600), ("tree_b", "tree_b_initial_native.png", 340)):
        sprite = clean(read(native).resize((size, size), R), 6)
        asset(label, sprite)
    trees = [
        ("tree_a", -60, 140, 600, False),
        ("tree_b", 700, 395, 340, False),
        ("tree_b", 2160, 405, 340, True),
        ("tree_a", 2760, 190, 380, True),
    ]
    for idx, (label, x, y, size, flip) in enumerate(trees, 1):
        source = Image.open(EXPORTS / f"tex_sakura_rr_{label}.png").convert("RGBA")
        sprite = source.resize((size, size), R)
        if flip:
            sprite = ImageOps.mirror(sprite)
        add(f"{label}_instance_{idx}", place(sprite, x, y), out_layers)
        instances.append({"asset": f"tex_sakura_rr_{label}.png", "x": x, "y": y, "width": size, "height": size, "mirror": flip})

    # A few small distant fire lights reuse the exact two approved ghost
    # prototypes' flame-only pieces; no extra drawing or lotus in the air.
    airborne = [
        ("spirit_a", 93, 366, 58), ("spirit_b", 487, 450, 47),
        ("spirit_a", 1090, 90, 42), ("spirit_b", 1550, 469, 55),
        ("spirit_a", 2470, 385, 49),
    ]
    for idx, (label, x, y, size) in enumerate(airborne, 1):
        flame = spirit_source[label]["flame"].resize((size, size), R)
        add(f"airborne_{label}_static_{idx}", place(flame, x, y), out_layers)
        instances.append({"asset": f"tex_sakura_rr_{label}_flame.png", "x": x, "y": y, "width": size, "height": size, "mirror": False, "motion": "static"})

    # Canal follows the full reference's bank height. The new source's left
    # half is reused by horizontal mirror; the central bridge interrupts rail.
    bank_source = clean(read("water_rail_initial_native.png").crop((0, 390, 2172, 724)), 8)
    bank_work = bank_source.resize((W, 344), R)
    half = bank_work.crop((0, 0, 1536, 344))
    # The bridge opening needs deep water up to its arch crown. Only reproject
    # newly painted canal pixels into the center gap; street/bridge still cover
    # them elsewhere. The original shoreline-source crop has open alpha here.
    deep = half.crop((1180, 150, 1536, 330)).resize((286, 160), R)
    deep = ImageEnhance.Brightness(deep).enhance(0.60)
    deep_alpha = deep.getchannel("A")
    for yy in range(160):
        global_y = 680 + yy
        if global_y < 700:
            left_edge = 1536
        elif global_y < 730:
            left_edge = round(1536 - (global_y-700) * 76 / 30)
        elif global_y < 790:
            left_edge = round(1460 - (global_y-730) * 60 / 60)
        else:
            left_edge = 1400
        row_factor = min(1.0, (160 - yy) / 40) if yy >= 120 else 1.0
        for xx in range(286):
            if 1250 + xx < left_edge:
                deep_alpha.putpixel((xx, yy), 0)
            elif row_factor < 1.0:
                deep_alpha.putpixel((xx, yy), round(deep_alpha.getpixel((xx, yy)) * row_factor))
    deep.putalpha(deep_alpha)
    half.alpha_composite(deep, (1250, 0))
    p = asset("water_rail_half", half)
    for side, layer in zip(("l", "r"), mirror_half(half, 680)):
        add(f"water_rail_{side}", layer, out_layers)
        instances.append({"asset": p.name, "x": 0 if side == "l" else 1536, "y": 680, "mirror": side == "r"})

    # The final signed representative bridge half is the only active bridge.
    bridge_source = Image.open(ROOT / "history/candidates/tex_sakura_rr_bridge_correction_02_half.png").convert("RGBA")
    bridge = asset("bridge_half", bridge_source)
    for side, layer in zip(("l", "r"), mirror_half(bridge_source, 512)):
        add(f"bridge_{side}", layer, out_layers)
        instances.append({"asset": bridge.name, "x": 0 if side == "l" else 1536, "y": 512, "mirror": side == "r"})

    # Right-side asymmetric gate, fully separate from trees and shops.
    gate = clean(read("gate_initial_native.png").resize((380, 475), R), 5)
    p = asset("gate", gate)
    add("gate_right", place(gate, 2650, 245), out_layers)
    instances.append({"asset": p.name, "x": 2650, "y": 245, "mirror": False})

    # Independent left and right corner framing. Crop alpha-tight to the
    # approved max 768x384 box after reducing each newly drawn native cluster.
    left = clean(read("foreground_left_initial_native.png").resize((768, 512), R), 7)
    right = clean(read("foreground_right_initial_native.png").resize((768, 512), R), 7)
    for label, sprite, x in (("foreground_left", left, 0), ("foreground_right", right, 2304)):
        sprite = sprite.crop((0, 128, 768, 512))
        p = asset(label, sprite)
        add(label, place(sprite, x, 640), out_layers)
        instances.append({"asset": p.name, "x": x, "y": 640, "mirror": False})

    # Spirits from two prototypes. Reflection rests on the canal; animation
    # moves only the flame layer and leaves lotus/ripple anchored.
    spirits = [
        ("spirit_a", 450, 840, 130), ("spirit_b", 720, 850, 92),
        ("spirit_a", 1000, 853, 123), ("spirit_b", 1740, 853, 126),
        ("spirit_a", 1920, 846, 112), ("spirit_b", 2310, 851, 104),
        ("spirit_a", 2600, 850, 94),
    ]
    for idx, (label, x, y, size) in enumerate(spirits, 1):
        for part in ("reflection", "lotus", "flame"):
            source = spirit_source[label][part].resize((size, size), R)
            add(f"{label}_{part}_instance_{idx}", place(source, x, y), out_layers)
            motion = "flame_float" if part == "flame" and idx in {1, 3, 4, 6} else "static"
            instances.append({"asset": f"tex_sakura_rr_{label}_{part}.png", "x": x, "y": y, "width": size, "height": size, "mirror": False, "motion": motion})

    # Both full-size views use the EXACT same layers and ordering.
    scene = canvas()
    motion_base = canvas()
    motion_midground = canvas()
    moving_flames = {"spirit_a_flame_instance_1", "spirit_a_flame_instance_3", "spirit_b_flame_instance_4", "spirit_b_flame_instance_6"}
    parallax_background = {"sky_l", "sky_r", "far_l", "far_r"}
    for item in out_layers:
        layer = Image.open(ROOT / item["file"]).convert("RGBA")
        scene.alpha_composite(layer)
        if item["name"] not in moving_flames:
            motion_base.alpha_composite(layer)
            if item["name"] not in parallax_background:
                motion_midground.alpha_composite(layer)
    scene.convert("RGB").save(REVIEW / "scene_environment.png")
    motion_base.convert("RGB").save(REVIEW / "scene_motion_base.png")
    motion_midground.save(REVIEW / "scene_motion_midground.png")
    for name, source, margin in (("sky", sky, 12), ("far", far, 6)):
        overscan = Image.new("RGBA", (W + margin*2, H), (0, 0, 0, 0))
        overscan.alpha_composite(source, (margin, 0))
        if name == "sky":
            overscan.paste(source.crop((0, 0, 1, H)).resize((margin, H)), (0, 0))
            overscan.paste(source.crop((W-1, 0, W, H)).resize((margin, H)), (W+margin, 0))
        overscan.save(REVIEW / f"scene_{name}_overscan.png")
    reconstructed = canvas()
    for item in instances:
        sprite = Image.open(EXPORTS / item["asset"]).convert("RGBA")
        if "width" in item:
            sprite = sprite.resize((item["width"], item["height"]), R)
        if item.get("mirror"):
            sprite = ImageOps.mirror(sprite)
        reconstructed.alpha_composite(sprite, (item["x"], item["y"]))
    reconstructed.save(REVIEW / "reassembled_from_exports.png")
    cut_manifest = {
        "task": "SCENE-SAKURA-REDRAW-REUSE-20261013",
        "version": "v0.1",
        "canvas": [W, H],
        "reference_only": "reference/user_reference_3072x1024.png",
        "no_shop_layers_or_exports": True,
        "native_output_is_interpolated_where_larger_than_native": True,
        "source_groups": 11,
        "active_exports": [{"path": str(p.relative_to(ROOT)), "sha256": digest(p), "size": list(Image.open(p).size)} for p in sorted(EXPORTS.glob("*.png"))],
        "instances_bottom_to_top": instances,
        "psd_layers_bottom_to_top": out_layers,
        "scene_sha256": digest(REVIEW / "scene_environment.png"),
        "reassembly_sha256": digest(REVIEW / "reassembled_from_exports.png"),
        "motion_base_sha256": digest(REVIEW / "scene_motion_base.png"),
        "motion_midground_sha256": digest(REVIEW / "scene_motion_midground.png"),
        "sky_overscan_sha256": digest(REVIEW / "scene_sky_overscan.png"),
        "far_overscan_sha256": digest(REVIEW / "scene_far_overscan.png"),
        "moving_flame_layers": sorted(moving_flames),
        "composition": "Pillow RGBA8 alpha_composite sRGB, same full-canvas layers for PSD and flat scene; no reference overlay, no shops",
    }
    (ROOT / "CUT_MANIFEST.json").write_text(json.dumps(cut_manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    psd_manifest = {
        "canvas": {"width": W, "height": H, "composite_background": "#15173b"},
        "output": "source/scene_sakura_reuse_master.psd",
        "preview": "review/scene_psd_preview.png",
        "layers": [{"name": item["name"], "file": item["file"], "fit": "none", "remove_background": "none"} for item in out_layers],
    }
    (ROOT / "PSD_MANIFEST.json").write_text(json.dumps(psd_manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"layer_count": len(out_layers), "export_count": len(cut_manifest["active_exports"]), "scene": str(REVIEW / "scene_environment.png")}, ensure_ascii=False))


if __name__ == "__main__":
    main()
