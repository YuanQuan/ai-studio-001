"""Normalize newly painted RGBA shops and preserve exact pixels in PSD layers.

The reference/old artwork supplies only a target bounding box, never pixels.
Masks are coarse semantic raster regions. Hidden backs are not reconstructed.
"""

import argparse
import json
import subprocess
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
PYTHON = r"C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
ASSEMBLER = r"C:\Users\admin\.codex\skills\bggg-creator-image2psd\scripts\image2psd.py"


def cut(im, mask):
    result = im.copy()
    result.putalpha(ImageChops.multiply(im.getchannel("A"), mask))
    return result


def save_layer(im, name, folder):
    path = folder / (name + ".png")
    im.save(path)
    return path


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--shop", type=int, required=True)
    p.add_argument("--source", required=True)
    p.add_argument("--old-recomposition", required=True)
    p.add_argument("--sign-polygon", required=True, help="JSON points in normalized 1024 coordinates")
    args = p.parse_args()
    n = args.shop
    source = Image.open(args.source).convert("RGBA")
    a = source.getchannel("A")
    a = a.point(lambda v: 0 if v <= 8 else v)
    source.putalpha(a)
    bbox = a.point(lambda v: 255 if v > 32 else 0).getbbox()
    old = Image.open(args.old_recomposition).convert("RGBA")
    target = old.getchannel("A").point(lambda v: 255 if v > 32 else 0).getbbox()
    if not bbox or not target:
        raise ValueError("Missing source or baseline alpha bbox")
    scale = min((target[2] - target[0]) / (bbox[2] - bbox[0]), (target[3] - target[1]) / (bbox[3] - bbox[1]))
    size = (round(source.width * scale), round(source.height * scale))
    res = source.resize(size, Image.Resampling.LANCZOS)
    paste_x = round((target[0] + target[2]) / 2 - (bbox[0] + bbox[2]) * scale / 2)
    paste_y = round(900 - bbox[3] * scale)
    canvas = Image.new("RGBA", (1024, 1024))
    canvas.alpha_composite(res, (paste_x, paste_y))

    work = ROOT / "source" / f"shop_{n:02d}" / "psd_work"
    layers_dir = work / "layers"
    layers_dir.mkdir(parents=True, exist_ok=True)
    normalized = work / "whole_normalized.png"
    canvas.save(normalized)

    sign_mask = Image.new("L", canvas.size)
    ImageDraw.Draw(sign_mask).polygon(json.loads(args.sign_polygon), fill=255)
    remaining = ImageChops.invert(sign_mask)
    body = cut(canvas, remaining)
    sign = cut(canvas, sign_mask)

    roof_mask = Image.new("L", canvas.size)
    ImageDraw.Draw(roof_mask).rectangle((0, 0, 1024, 470), fill=255)
    front_mask = Image.new("L", canvas.size)
    ImageDraw.Draw(front_mask).rectangle((0, 710, 1024, 1024), fill=255)
    roof_mask = ImageChops.multiply(roof_mask, remaining)
    front_mask = ImageChops.multiply(front_mask, remaining)
    interior_mask = ImageChops.multiply(ImageChops.invert(roof_mask), ImageChops.invert(front_mask))
    interior_mask = ImageChops.multiply(interior_mask, remaining)
    layer_files = [
        save_layer(cut(canvas, front_mask), "01_front_and_ground", layers_dir),
        save_layer(cut(canvas, interior_mask), "02_structure_and_interior", layers_dir),
        save_layer(cut(canvas, roof_mask), "03_roof_and_upper", layers_dir),
        save_layer(sign, "04_sign", layers_dir),
    ]
    export_dir = ROOT / "exports"
    export_dir.mkdir(parents=True, exist_ok=True)
    body_path = export_dir / f"tex_u03_shop_{n:02d}_body_full_redraw_v01.png"
    sign_path = export_dir / f"tex_u03_shop_{n:02d}_sign_full_redraw_v01.png"
    body.save(body_path)
    sign.save(sign_path)
    psd_dir = ROOT / "psd"
    preview_dir = ROOT / "preview"
    psd_dir.mkdir(parents=True, exist_ok=True)
    preview_dir.mkdir(parents=True, exist_ok=True)
    psd_path = psd_dir / f"shop_{n:02d}_full_redraw_v01.psd"
    preview_path = preview_dir / f"shop_{n:02d}_recomposed.png"
    psd_check_path = work / "psd_composite_check.png"
    manifest = {
        "canvas": {"width": 1024, "height": 1024, "composite_background": "#000000"},
        "layers": [{"name": f.stem, "file": str(f), "remove_background": "none"} for f in layer_files],
    }
    manifest_path = work / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    subprocess.run([PYTHON, ASSEMBLER, "assemble", "--manifest", str(manifest_path), "--output", str(psd_path), "--preview", str(psd_check_path)], check=True)
    recomposed = Image.alpha_composite(body, sign)
    recomposed.save(preview_path)
    diff = ImageChops.difference(canvas, recomposed)
    if diff.getbbox():
        raise AssertionError(f"Shop {n} body/sign do not exactly recompose source")
    output = {
        "shop": n,
        "source": str(args.source),
        "source_size": source.size,
        "source_alpha_bbox_32": bbox,
        "old_baseline_bbox_32": target,
        "scale": scale,
        "paste": [paste_x, paste_y],
        "normalized": str(normalized),
        "psd": str(psd_path),
        "body": str(body_path),
        "sign": str(sign_path),
        "layer_names": [f.stem for f in layer_files],
        "note": "Four coarse raster region layers; obscured reverse faces remain unpainted. Pixel-exact visible recomposition only.",
    }
    (work / "build_report.json").write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(output, ensure_ascii=False))


if __name__ == "__main__":
    main()
