"""Deterministic alpha extraction from the user-approved U04 v0.4 flat image."""

from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[5]
OUT = Path(__file__).resolve().parents[1]
SRC = ROOT / "deliverables/art/U04-CLOUD-CORNER-FIT-001/v0.4/cloud_corner_fit_preview.png"
EXPECTED_SHA = "9fc3c8e4312975516d8ca84431cd937b1407fc32215c3ef8b0954dfe57b0d593"
WINDOWS = {
    "bottom_left": (0, 789, 167, 914),
    "top_right": (1500, 675, 1667, 800),
}


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def poly_mask(size: tuple[int, int], points: list[tuple[int, int]]) -> np.ndarray:
    image = Image.new("L", size)
    ImageDraw.Draw(image).polygon(points, fill=255)
    return np.asarray(image) > 0


def mask_for(name: str, rgb: np.ndarray) -> np.ndarray:
    h, w = rgb.shape[:2]
    yy, xx = np.indices((h, w))
    r, g, b = (rgb[:, :, i].astype(np.int16) for i in range(3))
    gold_color = (r >= 65) & (g >= 42) & (r > g * 1.07) & (r < g * 2.15) & (g > b * 1.37) & (r - b >= 35)
    navy_color = (r < 95) & (g < 105) & (b < 135) & (b > r + 8) & (b > g + 4)

    if name == "bottom_left":
        # Source-window coordinates. The arm is excluded by both location and color.
        gold_domain = poly_mask((w, h), [(0, 35), (14, 35), (19, 60), (34, 73), (73, 67), (110, 76), (155, 115), (155, 124), (0, 124)])
        # Stop the bottom border soon after the final cloud scallop.
        gold_domain &= ((yy < 121) | (xx <= 129)) & ((yy < 117) | (xx < 145))
        navy_domain = poly_mask((w, h), [(9, 56), (22, 72), (55, 77), (80, 72), (109, 81), (139, 111), (117, 119), (16, 119)])
    else:
        # Button and top long border lie left of the actual cloud; right vertical
        # border after the curl is also cut away.
        gold_domain = poly_mask((w, h), [(66, 0), (166, 0), (166, 88), (150, 78), (135, 65), (102, 50), (78, 30), (66, 15)])
        # Top straight line starts well before the cloud; keep only its final
        # short connector, preserving the curved gold pixels below it.
        gold_domain &= ((yy > 1) | (xx >= 88)) & ((yy < 67) | (xx < 156))
        navy_domain = poly_mask((w, h), [(86, 10), (128, 7), (163, 20), (164, 67), (143, 52), (107, 41), (85, 26)])
        navy_domain &= xx >= 98  # exclude the adjacent button's cyan right edge

    gold = gold_color & gold_domain
    # One-pixel morphological expansion retains source antialias fringe. The
    # spatial domain and source-color check still prevent a portrait/button leak.
    grown = np.asarray(Image.fromarray((gold * 255).astype("uint8"), "L").filter(ImageFilter.MaxFilter(3))) > 0
    fringe_color = (r > 44) & (g > 31) & (r < g * 2.15) & (g > b * 1.2) & (r - b > 22)
    gold |= grown & fringe_color & gold_domain
    navy = navy_domain & navy_color
    return (gold | navy).astype("uint8") * 255


def nine_slice_panel(source: Image.Image, size: tuple[int, int], inset: int = 48) -> Image.Image:
    sw, sh = source.size
    dw, dh = size
    canvas = Image.new("RGBA", size)
    sx = [0, inset, sw - inset, sw]
    sy = [0, inset, sh - inset, sh]
    dx = [0, inset, dw - inset, dw]
    dy = [0, inset, dh - inset, dh]
    for row in range(3):
        for col in range(3):
            part = source.crop((sx[col], sy[row], sx[col + 1], sy[row + 1]))
            target = (dx[col + 1] - dx[col], dy[row + 1] - dy[row])
            if part.size != target:
                part = part.resize(target, Image.Resampling.BICUBIC)
            canvas.paste(part, (dx[col], dy[row]))
    return canvas


def main() -> None:
    assert sha(SRC) == EXPECTED_SHA
    source = Image.open(SRC).convert("RGB")
    assert source.size == (1672, 941)
    (OUT / "exports").mkdir(parents=True, exist_ok=True)
    (OUT / "source/layer_sources").mkdir(parents=True, exist_ok=True)
    (OUT / "preview").mkdir(parents=True, exist_ok=True)
    shutil.copyfile(SRC, OUT / "source/original_reference.png")

    manifest = {
        "canvas": {"width": 1672, "height": 941, "composite_background": "#071326"},
        "layers": [{"name": "Approved v0.4 full reference", "file": "layer_sources/original_reference.png", "remove_background": "none"}],
    }
    # The skill manifest resides in source/, so all relative files are below it.
    source.save(OUT / "source/layer_sources/original_reference.png")
    data = {"source_sha256": EXPECTED_SHA, "windows": {}, "mask_rule": "source RGB retained; only alpha changed in full-canvas layers"}
    full_rgb = np.asarray(source)
    for name, box in WINDOWS.items():
        x0, y0, x1, y1 = box
        crop_rgb = full_rgb[y0:y1, x0:x1]
        alpha = mask_for(name, crop_rgb)
        crop_rgba = Image.fromarray(np.dstack((crop_rgb, alpha)), "RGBA")
        full = Image.fromarray(np.dstack((full_rgb, np.zeros((941, 1672), dtype="uint8"))), "RGBA")
        full.paste(crop_rgba, (x0, y0))
        layer_path = OUT / f"source/layer_sources/{name}_full_canvas.png"
        full.save(layer_path)
        manifest["layers"].append({"name": f"{name} - approved RGB, semantic alpha", "file": f"layer_sources/{name}_full_canvas.png", "remove_background": "none"})
        export = crop_rgba.resize((128, 96), Image.Resampling.LANCZOS)
        export_path = OUT / f"exports/corner_{name}.png"
        export.save(export_path)
        nonzero = Image.fromarray(alpha).getbbox()
        data["windows"][name] = {
            "source_crop_xyxy_exclusive": list(box),
            "source_alpha_bbox_in_crop": list(nonzero) if nonzero else None,
            "source_alpha_count": int(np.count_nonzero(alpha)),
            "export": str(export_path.relative_to(ROOT)),
            "export_sha256": sha(export_path),
            "export_alpha_bbox": list(export.getchannel("A").getbbox()),
            "export_alpha_count": int(np.count_nonzero(np.asarray(export.getchannel("A")))),
        }
    (OUT / "source/manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    (OUT / "source/mask_metrics.json").write_text(json.dumps(data, indent=2) + "\n")
    scaled_reference = source.resize((1280, 720), Image.Resampling.LANCZOS).convert("RGBA")
    recomposed = scaled_reference.copy()
    recomposed.alpha_composite(Image.open(OUT / "exports/corner_bottom_left.png").convert("RGBA"), (0, 604))
    recomposed.alpha_composite(Image.open(OUT / "exports/corner_top_right.png").convert("RGBA"), (1148, 517))
    recomposed.convert("RGB").save(OUT / "preview/approved_position_reference.png")
    panel_src = Image.open(ROOT / "apps/client/assets/units/dialogue/ui/tex_u04_dialogue_panel_9s.png").convert("RGBA")
    assert panel_src.size == (512, 256)
    panel = nine_slice_panel(panel_src, (1280, 195))
    panel.alpha_composite(Image.open(OUT / "exports/corner_bottom_left.png").convert("RGBA"), (0, 99))
    panel.alpha_composite(Image.open(OUT / "exports/corner_top_right.png").convert("RGBA"), (1152, 0))
    panel.save(OUT / "preview/panel_only_recomposition.png")
    dark = Image.new("RGB", (1054, 424), (15, 29, 51))
    for i, name in enumerate(WINDOWS):
        tile = Image.new("RGBA", (128, 96), (13, 27, 49, 255))
        tile.alpha_composite(Image.open(OUT / f"exports/corner_{name}.png").convert("RGBA"))
        dark.paste(tile.resize((512, 384), Image.Resampling.NEAREST).convert("RGB"), (i * 527, 40))
    ImageDraw.Draw(dark).text((10, 10), "U04 v0.4 source-pixel alpha / 128x96 exports at 4x", (255, 223, 170))
    dark.save(OUT / "preview/corner_exports_4x.png")


if __name__ == "__main__":
    main()
