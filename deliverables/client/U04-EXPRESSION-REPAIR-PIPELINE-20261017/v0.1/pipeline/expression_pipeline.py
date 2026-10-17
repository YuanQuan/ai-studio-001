#!/usr/bin/env python3
"""Deterministic helper for approved ROI expression asset production."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
import tempfile
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def resolve(base: Path, value: str) -> Path:
    p = Path(value)
    return p if p.is_absolute() else (base / p).resolve()


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def rgba(path: Path) -> Image.Image:
    if not path.is_file():
        raise ValueError(f"input does not exist: {path}")
    return Image.open(path).convert("RGBA")


def normalize_candidate(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    # Aspect ratio is preserved; transparent padding is centered, never facial warping.
    scale = min(size[0] / image.width, size[1] / image.height)
    fitted = image.resize((max(1, round(image.width * scale)), max(1, round(image.height * scale))), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    canvas.alpha_composite(fitted, ((size[0] - fitted.width) // 2, (size[1] - fitted.height) // 2))
    return canvas


def paste_source_region(canvas: Image.Image, image_path: Path, rect: list[int]) -> None:
    x0, y0, x1, y1 = map(int, rect)
    im = rgba(image_path)
    expected = (x1 - x0, y1 - y0)
    if im.size != expected:
        im = im.resize(expected, Image.Resampling.LANCZOS)
    canvas.alpha_composite(im, (x0, y0))


def checked_rect(value: Any, name: str, canvas_size: tuple[int, int]) -> list[int]:
    if not isinstance(value, list) or len(value) != 4 or any(type(v) is not int for v in value):
        raise ValueError(f"{name} must be four integer coordinates [left,top,right,bottom]")
    x0, y0, x1, y1 = value
    if x0 < 0 or y0 < 0 or x1 <= x0 or y1 <= y0 or x1 > canvas_size[0] or y1 > canvas_size[1]:
        raise ValueError(f"{name} is invalid or outside source canvas {canvas_size}: {value}")
    return value


def cmd_compose(args: argparse.Namespace) -> None:
    spec_path = Path(args.spec).resolve()
    spec = read_json(spec_path)
    base_dir = Path(args.root).resolve() if args.root else spec_path.parent
    canvas_value = spec.get("source_canvas_px", [1024, 1536])
    if not isinstance(canvas_value, list) or len(canvas_value) != 2 or any(type(v) is not int or v <= 0 for v in canvas_value):
        raise ValueError("source_canvas_px must be two positive integers")
    canvas_size = tuple(canvas_value)
    face_rect = checked_rect(spec.get("face_source_rect_xyxy"), "face_source_rect_xyxy", canvas_size)
    base_rect = checked_rect(spec.get("base_source_rect_xyxy"), "base_source_rect_xyxy", canvas_size)
    front_rect = checked_rect(spec.get("front_source_rect_xyxy"), "front_source_rect_xyxy", canvas_size)
    face_size = (face_rect[2] - face_rect[0], face_rect[3] - face_rect[1])
    if face_size != (256, 256):
        raise ValueError(f"source ROI must be 256x256; got {face_size}")
    if not (0 <= face_rect[0] < face_rect[2] <= canvas_size[0] and 0 <= face_rect[1] < face_rect[3] <= canvas_size[1]):
        raise ValueError("face ROI is outside source canvas")
    old_path = resolve(base_dir, spec["old_face"])
    base_path = resolve(base_dir, spec["base"])
    front_path = resolve(base_dir, spec["front"])
    candidate_path = resolve(base_dir, args.candidate)
    mask_path = resolve(base_dir, args.mask)
    out_dir = Path(args.out).resolve()
    if out_dir.exists() or out_dir.is_symlink():
        raise ValueError(f"refusing to overwrite existing output path: {out_dir}")
    if not out_dir.parent.is_dir():
        raise ValueError(f"output parent directory must already exist: {out_dir.parent}")
    # Read every source before creating output. Missing or undecodable inputs leave no partial files.
    base_image, front_image = rgba(base_path), rgba(front_path)
    old = rgba(old_path)
    if old.size != face_size:
        raise ValueError(f"old face must match ROI pixels {face_size}, got {old.size}")
    old_alpha = np.asarray(old.getchannel("A"), dtype=np.uint8)
    if int(np.count_nonzero(old_alpha == 0)) < int(old.width * old.height * 0.01) or not np.any(old_alpha > 0):
        raise ValueError("old_face must be a transparent oneface layer, not a recomposed review crop")
    candidate_source = rgba(candidate_path)
    candidate = normalize_candidate(candidate_source, face_size)
    mask_image = rgba(mask_path)
    if mask_image.size != face_size:
        raise ValueError(f"semantic mask must be {face_size}, got {mask_image.size}")
    mask_alpha = np.asarray(mask_image.getchannel("A"), dtype=np.uint8)
    if not np.any(mask_alpha):
        raise ValueError("semantic mask is empty; refusing output")
    result = Image.composite(candidate, old, Image.fromarray(mask_alpha, "L"))
    old_a = np.asarray(old, dtype=np.uint8)
    new_a = np.asarray(result, dtype=np.uint8)
    outside = mask_alpha == 0
    outside_diff = np.any(old_a != new_a, axis=2) & outside
    if np.any(outside_diff):
        raise ValueError("mask-exterior RGBA changed; refusing all outputs")

    with tempfile.TemporaryDirectory(prefix=f".{out_dir.name}.staging-", dir=out_dir.parent) as staging_name:
        staging = Path(staging_name)
        face_out = staging / "face_candidate.png"
        result.save(face_out)
        composite = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
        paste_source_region(composite, base_path, base_rect)
        composite.alpha_composite(result, (face_rect[0], face_rect[1]))
        paste_source_region(composite, front_path, front_rect)
        comp_out = staging / "recomposed_source_canvas.png"
        composite.save(comp_out)
        crop_out = staging / "face_source_crop.png"
        composite.crop(tuple(face_rect)).save(crop_out)
        report = {
            "status": "CANDIDATE_COMPOSED_ART_REVIEW_REQUIRED",
            "visual_pass": "NOT_DECIDED_BY_TOOL",
            "inputs": {k: {"path": str(p), "sha256": sha(p)} for k, p in (("base", base_path), ("old_face", old_path), ("front", front_path))},
            "candidate": {"path": str(candidate_path), "sha256": sha(candidate_path), "source_size": list(candidate_source.size),
                          "normalized_size": list(face_size), "normalization": "uniform Lanczos fit, centered transparent padding; no component translation"},
            "mask": {"path": str(mask_path), "sha256": sha(mask_path), "size": list(mask_image.size),
                     "nonzero_alpha_pixels": int(np.count_nonzero(mask_alpha)), "alpha_values": sorted(int(x) for x in np.unique(mask_alpha))},
            "face_source_rect_xyxy": face_rect,
            "outside_mask_rgba_changed_pixels": int(np.count_nonzero(outside_diff)),
            "outputs": {str(out_dir / p.name): sha(p) for p in (face_out, comp_out, crop_out)},
            "composition_order": ["base", "oneface", "front"],
            "notes": ["Tool does not decide identity/expression acceptance.", "Art must reject candidates with anchor drift.",
                      "Scaled layer reconstruction is resampling, not lossless source recovery."]
        }
        (staging / "pipeline_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        if out_dir.exists() or out_dir.is_symlink():
            raise ValueError(f"refusing to overwrite existing output path: {out_dir}")
        os.rename(staging, out_dir)
        report["outputs"][str(out_dir / "pipeline_report.json")] = sha(out_dir / "pipeline_report.json")
    print(json.dumps(report, ensure_ascii=False, indent=2))


def cmd_inspect_psd(args: argparse.Namespace) -> None:
    path = Path(args.psd).resolve()
    if not path.is_file():
        raise ValueError(f"PSD does not exist: {path}")
    result: dict[str, Any] = {"path": str(path), "sha256": sha(path), "file_bytes": path.stat().st_size}
    try:
        from PIL import Image as PILImage
        with PILImage.open(path) as im:
            im.load()
            result["pillow_composite_readable"] = True
            result["composite_size"] = list(im.size)
            result["composite_mode"] = im.mode
    except Exception as exc:
        result["pillow_composite_readable"] = False
        result["pillow_error"] = str(exc)
    try:
        result["psd_tools_available"] = False
        result["layers"] = inspect_layer_records(path)
        result["layer_visibility_check"] = "PSD v1 layer-record flags parsed; grouped/nested layer behavior requires editor confirmation."
    except Exception as exc:
        result["layer_inspection_error"] = str(exc)
    result["editable_limit"] = "Pillow flattened composite readability does not prove native brush/vector editability."
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if not result.get("pillow_composite_readable"):
        raise ValueError("PSD composite is not readable")


def inspect_layer_records(path: Path) -> list[dict[str, Any]]:
    """Read top-level PSD v1 layer names/visibility flags without altering the PSD."""
    data = path.read_bytes()
    if len(data) < 26 or data[:4] != b"8BPS" or int.from_bytes(data[4:6], "big") != 1:
        raise ValueError("only PSD version 1 layer records are supported")
    offset = 26
    color_len = int.from_bytes(data[offset:offset + 4], "big"); offset += 4 + color_len
    resources_len = int.from_bytes(data[offset:offset + 4], "big"); offset += 4 + resources_len
    section_len = int.from_bytes(data[offset:offset + 4], "big"); offset += 4
    section_end = offset + section_len
    layer_info_len = int.from_bytes(data[offset:offset + 4], "big"); offset += 4
    if layer_info_len == 0:
        return []
    info_end = offset + layer_info_len
    count = int.from_bytes(data[offset:offset + 2], "big", signed=True); offset += 2
    layers = []
    for _ in range(abs(count)):
        top, left, bottom, right = [int.from_bytes(data[offset + i:offset + i + 4], "big", signed=True) for i in (0, 4, 8, 12)]
        offset += 16
        channels = int.from_bytes(data[offset:offset + 2], "big"); offset += 2 + channels * 6
        if data[offset:offset + 4] != b"8BIM":
            raise ValueError("unexpected PSD blend signature")
        offset += 4 + 4 + 1 + 1
        flags = data[offset]; offset += 2
        extra_len = int.from_bytes(data[offset:offset + 4], "big"); offset += 4
        extra_end = offset + extra_len
        mask_len = int.from_bytes(data[offset:offset + 4], "big"); offset += 4 + mask_len
        ranges_len = int.from_bytes(data[offset:offset + 4], "big"); offset += 4 + ranges_len
        name_len = data[offset]
        name = data[offset + 1:offset + 1 + name_len].decode("macroman", errors="replace")
        layers.append({"name": name, "visible": not bool(flags & 0x02), "bounds_xyxy": [left, top, right, bottom]})
        offset = extra_end
    if offset > info_end or info_end > section_end or section_end > len(data):
        raise ValueError("PSD layer section offsets are inconsistent")
    # Channel image data follows all layer records; this parser intentionally does not decode it.
    return layers


def parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description=__doc__)
    sub = p.add_subparsers(dest="command", required=True)
    c = sub.add_parser("compose", help="apply one Art-authored semantic mask to one candidate")
    c.add_argument("--spec", required=True, help="stage JSON with exact source-coordinate paths and rectangles")
    c.add_argument("--candidate", required=True)
    c.add_argument("--mask", required=True, help="256x256 RGBA semantic mask authored/approved by Art")
    c.add_argument("--out", required=True)
    c.add_argument("--root", help="base for relative paths; defaults to spec directory")
    c.set_defaults(func=cmd_compose)
    i = sub.add_parser("inspect-psd", help="check PSD composite readability and optional layer visibility metadata")
    i.add_argument("psd")
    i.set_defaults(func=cmd_inspect_psd)
    return p


if __name__ == "__main__":
    try:
        parsed = parser().parse_args()
        parsed.func(parsed)
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(2)
