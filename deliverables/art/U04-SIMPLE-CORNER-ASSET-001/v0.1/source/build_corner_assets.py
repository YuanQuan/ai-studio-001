"""Reproducible, pixel-derived U04 corner split; no generated or repainted pixels."""

from __future__ import annotations

import hashlib
import json
import shutil
import struct
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[5]
OUT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "deliverables/art/U04-DIALOGUE-CORNER-REVISION-001/v0.3/concept/corner_simple_concept.png"
TOOL = Path("/Users/yuanquan/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py")
SOURCE_SHA = "821f0420d989d1914560a78569fe4cb570f319f1d37be90cc75f5f200e71e043"
BOXES = {
    "corner_bottom_left": (48, 590, 404, 883),
    "corner_top_right": (1362, 58, 1637, 281),
}
SCALE = 70 / 293


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def composite_offset(data: bytes) -> int:
    """Byte offset of PSD merged-image data after layer/mask section."""
    pos = 26
    for _ in range(3):
        length = struct.unpack_from(">I", data, pos)[0]
        pos += 4 + length
    return pos


def hide_reference_layer(data: bytearray) -> None:
    """Set the original reference's PSD hidden flag while retaining its pixels."""
    pos = 26
    for _ in range(2):
        length = struct.unpack_from(">I", data, pos)[0]
        pos += 4 + length
    layer_mask_start = pos + 4
    layer_info_start = layer_mask_start + 4
    count = abs(struct.unpack_from(">h", data, layer_info_start)[0])
    assert count == 3, count
    pos = layer_info_start + 2
    # image2psd.py emits records in top-to-bottom order. Original is bottom.
    for idx in range(count):
        channel_count = struct.unpack_from(">H", data, pos + 16)[0]
        blend_start = pos + 18 + 6 * channel_count
        assert data[blend_start:blend_start + 4] == b"8BIM"
        flags_offset = blend_start + 10
        if idx == count - 1:
            data[flags_offset] |= 0x02  # PSD hidden flag
        extra_length = struct.unpack_from(">I", data, blend_start + 12)[0]
        pos = blend_start + 16 + extra_length


def main() -> None:
    assert sha(SOURCE) == SOURCE_SHA
    original = Image.open(SOURCE).convert("RGBA")
    assert original.size == (1672, 940)
    source_dir = OUT / "source"
    exports = OUT / "exports"
    preview = OUT / "preview"
    for directory in (source_dir, exports, preview):
        directory.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(SOURCE, source_dir / "original_reference.png")

    pixels = np.asarray(original)
    left = np.zeros_like(pixels)
    right = np.zeros_like(pixels)
    for name, target in (("corner_bottom_left", left), ("corner_top_right", right)):
        x1, y1, x2, y2 = BOXES[name]
        target[y1:y2, x1:x2] = pixels[y1:y2, x1:x2]
    omitted_alpha = pixels[:, :, 3].astype(np.int16) - np.maximum(left[:, :, 3], right[:, :, 3]).astype(np.int16)
    assert np.count_nonzero(omitted_alpha) == 21 and omitted_alpha.max() == 1
    assert not np.any((left[:, :, 3] > 0) & (right[:, :, 3] > 0))
    left_img, right_img = Image.fromarray(left), Image.fromarray(right)
    left_img.save(source_dir / "left_full_canvas.png")
    right_img.save(source_dir / "right_full_canvas.png")

    manifest = {
        "canvas": {"width": 1672, "height": 940, "composite_background": "#ffffff"},
        "layers": [
            {"name": "Original reference - hidden", "file": "original_reference.png", "fit": "none", "remove_background": "none"},
            {"name": "Bottom left - original pixels", "file": "left_full_canvas.png", "fit": "none", "remove_background": "none"},
            {"name": "Top right - original pixels", "file": "right_full_canvas.png", "fit": "none", "remove_background": "none"},
        ],
    }
    manifest_path = source_dir / "psd_manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    tool_output = source_dir / "corner_simple_layers.with_visible_reference.tmp.psd"
    subprocess.run([sys.executable, str(TOOL), "assemble", "--manifest", str(manifest_path), "--output", str(tool_output)], check=True)

    # The PSD writer retains pixels but always writes layers visible. Hide only
    # the intact reference; replace merged image with the two-region composite.
    two_layer_manifest = dict(manifest)
    two_layer_manifest["layers"] = manifest["layers"][1:]
    temp_manifest = source_dir / "two_region_manifest.tmp.json"
    temp_manifest.write_text(json.dumps(two_layer_manifest, ensure_ascii=False, indent=2) + "\n")
    temp_psd = source_dir / "two_region_composite.tmp.psd"
    subprocess.run([sys.executable, str(TOOL), "assemble", "--manifest", str(temp_manifest), "--output", str(temp_psd), "--preview", str(preview / "corner_simple_layers.preview.png")], check=True)
    three = bytearray(tool_output.read_bytes())
    two = temp_psd.read_bytes()
    hide_reference_layer(three)
    three[composite_offset(three):] = two[composite_offset(two):]
    psd_path = source_dir / "corner_simple_layers.psd"
    psd_path.write_bytes(three)
    for path in (tool_output, tool_output.with_suffix(".preview.png"), temp_manifest, temp_psd):
        path.unlink()

    records = []
    client_targets = {
        "corner_bottom_left": "apps/client/assets/units/dialogue/ui/tex_u04_dialogue_corner_cloud_bottom_left.png",
        "corner_top_right": "apps/client/assets/units/dialogue/ui/tex_u04_dialogue_corner_cloud_top_right.png",
    }
    for name, layer in (("corner_bottom_left", left_img), ("corner_top_right", right_img)):
        box = BOXES[name]
        crop = layer.crop(box)
        size = tuple(round(dim * SCALE) for dim in crop.size)
        scaled = crop.resize(size, Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (128, 96), (0, 0, 0, 0))
        offset = (0, 96 - size[1]) if name.endswith("left") else (128 - size[0], 0)
        canvas.paste(scaled, offset)
        output = exports / f"{name}.png"
        canvas.save(output)
        records.append({
            "name": name,
            "path": str(output.relative_to(ROOT)),
            "client_target_path": client_targets[name],
            "client_import_status": "PLANNED_BY_ART",
            "sha256": sha(output),
            "source_region": "left_full_canvas.png" if name.endswith("left") else "right_full_canvas.png",
            "source_crop_xyxy_exclusive": list(box),
            "source_crop_size": list(crop.size),
            "uniform_scale": "70/293",
            "resample": "Pillow LANCZOS RGBA",
            "scaled_size": list(size),
            "canvas_size": [128, 96],
            "paste_xy": list(offset),
            "anchor": "left-bottom" if name.endswith("left") else "right-top",
            "alpha_bbox_xyxy_exclusive": list(canvas.getchannel("A").getbbox()),
            "alpha_extrema": list(canvas.getchannel("A").getextrema()),
        })

    mapping = {
        "batch": "U04-SIMPLE-CORNER-v0.1",
        "source": str(SOURCE.relative_to(ROOT)),
        "source_sha256": SOURCE_SHA,
        "source_copy": str((source_dir / "original_reference.png").relative_to(ROOT)),
        "psd": str(psd_path.relative_to(ROOT)),
        "psd_sha256": sha(psd_path),
        "psd_canvas": [1672, 940],
        "psd_layers_bottom_to_top": ["Original reference - hidden", "Bottom left - original pixels", "Top right - original pixels"],
        "psd_editability": "完整原图为隐藏参考层；左右两角为原位独立栅格层。内部形状非矢量，未补洞、重建或重绘。",
        "preview": str((preview / "corner_simple_layers.preview.png").relative_to(ROOT)),
        "exports": records,
        "note": "隐藏源图层逐像素完整保留原图；可见左右区域层仅排除两框外21个alpha=1离散噪点，无alpha>=2像素被排除。",
    }
    (OUT / "EXPORT_MAP.json").write_text(json.dumps(mapping, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"psd_sha256": mapping["psd_sha256"], "exports": records}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
