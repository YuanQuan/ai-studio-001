#!/usr/bin/env python3
"""Deterministic helper for approved ROI expression asset production."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import tempfile
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image
from PIL import ImageDraw, ImageFilter


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
    with Image.open(candidate_path) as candidate_raw:
        candidate_source_mode = candidate_raw.mode
        candidate_source = candidate_raw.convert("RGBA")
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


def render_region_alpha(points: list[list[int]], feather: int, size: tuple[int, int]) -> np.ndarray:
    """Rasterize only Art-supplied polygon points using the declared feather radius."""
    scale = 4
    image = Image.new("L", (size[0] * scale, size[1] * scale), 0)
    ImageDraw.Draw(image).polygon([(int(x) * scale, int(y) * scale) for x, y in points], fill=255)
    if feather:
        image = image.filter(ImageFilter.GaussianBlur(feather * scale))
    image = image.resize(size, Image.Resampling.LANCZOS)
    return np.asarray(image, dtype=np.uint8)


def cmd_extract_features(args: argparse.Namespace) -> None:
    definition_path = Path(args.definition).resolve()
    definition = read_json(definition_path)
    spec_path = Path(args.spec).resolve()
    spec = read_json(spec_path)
    base_dir = Path(args.root).resolve() if args.root else Path.cwd()
    expected_canvas = tuple(map(int, definition["local_canvas_px"]))
    if expected_canvas != (256, 256):
        raise ValueError(f"Art feature mask canvas must be 256x256, got {expected_canvas}")
    roi = checked_rect(spec["face_source_rect_xyxy"], "face_source_rect_xyxy", tuple(spec["source_canvas_px"]))
    if roi != definition["face_source_rect_xyxy"] or (roi[2] - roi[0], roi[3] - roi[1]) != expected_canvas:
        raise ValueError("compose spec ROI does not exactly match Art mask definition")
    base_rect = checked_rect(spec["base_source_rect_xyxy"], "base_source_rect_xyxy", tuple(spec["source_canvas_px"]))
    front_rect = checked_rect(spec["front_source_rect_xyxy"], "front_source_rect_xyxy", tuple(spec["source_canvas_px"]))
    candidate_path = resolve(base_dir, definition["candidate_path"])
    mask_path = resolve(base_dir, definition["mask_path"])
    base_path = resolve(base_dir, spec["base"])
    front_path = resolve(base_dir, spec["front"])
    old_face_path = resolve(base_dir, definition["old_oneface_path"])
    if sha(candidate_path) != definition["candidate_sha256"]:
        raise ValueError("candidate SHA-256 differs from Art mask definition")
    if sha(mask_path) != definition["mask_sha256"]:
        raise ValueError("feature mask SHA-256 differs from Art mask definition")
    canvas_size = tuple(map(int, spec["source_canvas_px"]))
    if len(canvas_size) != 2 or min(canvas_size) <= 0:
        raise ValueError("source_canvas_px must contain positive width and height")
    # Decode all inputs before staging output. old_oneface is provenance only, never composited.
    base_source, front_source = rgba(base_path), rgba(front_path)
    old_face_source = rgba(old_face_path)
    if old_face_source.size != expected_canvas:
        raise ValueError(f"old_oneface provenance image must match Art canvas {expected_canvas}, got {old_face_source.size}")
    with Image.open(candidate_path) as candidate_raw:
        candidate_source_mode = candidate_raw.mode
        candidate_source = candidate_raw.convert("RGBA")
    feature_mask = rgba(mask_path)
    if feature_mask.size != expected_canvas:
        raise ValueError("Art mask dimensions do not match definition")
    official_alpha = np.asarray(feature_mask.getchannel("A"), dtype=np.uint8)
    if not np.any(official_alpha):
        raise ValueError("Art feature mask is empty")
    normalized = normalize_candidate(candidate_source, expected_canvas)
    candidate_pixels = np.asarray(normalized, dtype=np.uint8)

    region_alphas: list[np.ndarray] = []
    for region in definition["regions"]:
        if not isinstance(region.get("name"), str) or not re.fullmatch(r"[A-Z][A-Z0-9_]*", region["name"]):
            raise ValueError(f"unsafe semantic region name: {region.get('name')!r}")
        feather = int(region["edge_feather_px"])
        points = region["local_polygon_xy"]
        if any(not (0 <= x < expected_canvas[0] and 0 <= y < expected_canvas[1]) for x, y in points):
            raise ValueError(f"Art polygon outside mask canvas: {region['name']}")
        region_alphas.append(render_region_alpha(points, feather, expected_canvas))
    weights = np.stack(region_alphas, axis=0)
    owner = np.argmax(weights, axis=0)
    has_owner = np.max(weights, axis=0) > 0
    # The approved union-mask PNG is the extraction authority. The explicit polygons label
    # the semantic layers; if its raster feather differs slightly from the separate union PNG,
    # assign remaining alpha pixels to the closest polygon centroid deterministically.
    yy, xx = np.indices(expected_canvas)
    centroids = []
    for region in definition["regions"]:
        points = np.asarray(region["local_polygon_xy"], dtype=np.float64)
        centroids.append(points.mean(axis=0))
    distances = np.stack([((xx - cx) ** 2 + (yy - cy) ** 2) for cx, cy in centroids], axis=0)
    nearest = np.argmin(distances, axis=0)
    semantic_owner = np.where(has_owner, owner, nearest)
    # Assign each official mask pixel to exactly one semantic layer. This preserves the approved
    # union alpha exactly and prevents repeated alpha accumulation where feather tails meet.
    assigned = [(official_alpha * (semantic_owner == idx)).astype(np.uint8) for idx in range(len(region_alphas))]
    used = np.maximum.reduce(assigned)
    if not np.array_equal(used, official_alpha):
        raise ValueError("semantic layer allocation did not preserve the Art union mask")
    base_source_canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    paste_source_region(base_source_canvas, base_path, base_rect)
    front_canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    paste_source_region(front_canvas, front_path, front_rect)
    out_dir = Path(args.out).resolve()
    if out_dir.exists() or out_dir.is_symlink():
        raise ValueError(f"refusing to overwrite existing output path: {out_dir}")
    if not out_dir.parent.is_dir():
        raise ValueError(f"output parent directory must already exist: {out_dir.parent}")

    with tempfile.TemporaryDirectory(prefix=f".{out_dir.name}.staging-", dir=out_dir.parent) as temp_name:
        staging = Path(temp_name)
        semantic_dir = staging / "semantic_layers"
        semantic_dir.mkdir()
        layers: list[Image.Image] = []
        layer_records = []
        for idx, region in enumerate(definition["regions"]):
            rgba_arr = candidate_pixels.copy()
            rgba_arr[:, :, 3] = assigned[idx]
            layer = Image.fromarray(rgba_arr)
            layers.append(layer)
            layer_path = semantic_dir / f"{idx + 1:02d}_{region['name'].lower()}.png"
            layer.save(layer_path)
            layer_records.append({"name": region["name"], "path": str(out_dir / "semantic_layers" / layer_path.name),
                                 "sha256": sha(layer_path), "visible": True, "assigned_alpha_pixels": int(np.count_nonzero(assigned[idx]))})
        combined = Image.new("RGBA", expected_canvas, (0, 0, 0, 0))
        for layer in layers:
            combined.alpha_composite(layer)
        combined_path = staging / "oneface_combined.png"
        combined.save(combined_path)
        combined_pixels = np.asarray(combined, dtype=np.uint8)
        expected_combined = np.dstack([candidate_pixels[:, :, :3], official_alpha]).copy()
        # Fully transparent pixels have canonical zero RGB after alpha_composite.
        expected_combined[official_alpha == 0, :3] = 0
        if not np.array_equal(combined_pixels, expected_combined):
            raise ValueError("semantic layers do not recompose exactly to candidate pixels + Art mask")

        full = base_source_canvas.copy()
        full.alpha_composite(combined, (roi[0], roi[1]))
        full.alpha_composite(front_canvas)
        full_path = staging / "recomposed_source_canvas.png"
        full.save(full_path)
        crop_path = staging / "recomposed_face_roi.png"
        full.crop(tuple(roi)).save(crop_path)
        base_front = base_source_canvas.copy()
        base_front.alpha_composite(front_canvas)
        baseline = np.asarray(base_front.crop(tuple(roi)), dtype=np.uint8)
        actual = np.asarray(full.crop(tuple(roi)), dtype=np.uint8)
        mask_zero = official_alpha == 0
        outside_diff = np.any(actual[:, :, :] != baseline, axis=2) & mask_zero
        if np.any(outside_diff):
            raise ValueError("pixels outside Art union mask changed from blank base + front")
        mask_saved = staging / "art_union_mask.png"
        feature_mask.save(mask_saved)
        report = {
            "status": "EXTRACTED_CANDIDATE_FOR_ART_REVIEW",
            "visual_pass": "NOT_DECIDED_BY_CLIENT_TOOL",
            "tool": {"path": str(Path(__file__).resolve()), "sha256": sha(Path(__file__).resolve())},
            "definition": {"path": str(definition_path), "sha256": sha(definition_path)},
            "candidate": {"path": str(candidate_path), "sha256": sha(candidate_path), "source_size": list(candidate_source.size),
                          "source_mode": candidate_source_mode, "decoded_mode": candidate_source.mode, "normalized_size": list(expected_canvas),
                          "normalization": "uniform Lanczos fit; centered transparent padding only"},
            "feature_mask": {"path": str(mask_path), "sha256": sha(mask_path), "size": list(expected_canvas),
                             "union_alpha_nonzero_pixels": int(np.count_nonzero(official_alpha))},
            "base": {"path": str(base_path), "sha256": sha(base_path), "source_rect_xyxy": base_rect},
            "old_oneface": {"path": str(old_face_path), "sha256": sha(old_face_path), "role": "read-only provenance; all old expression pixels discarded"},
            "front": {"path": str(front_path), "sha256": sha(front_path), "source_rect_xyxy": front_rect},
            "face_source_rect_xyxy": roi,
            "semantic_layers_bottom_to_top": layer_records,
            "mask_pixels_needing_centroid_semantic_fallback": int(np.count_nonzero((official_alpha > 0) & ~has_owner)),
            "semantic_recompose_rgba_diff_pixels": 0,
            "roi_outside_art_union_mask_vs_blank_base_front_diff_pixels": int(np.count_nonzero(outside_diff)),
            "outside_roi_same_scale_display_check": "NOT_PERFORMED_BY_THIS_COMMAND; full scene/UI comparison is an Art/Tech visual check",
            "outputs": {str(out_dir / name): sha(staging / name) for name in ("oneface_combined.png", "recomposed_source_canvas.png", "recomposed_face_roi.png", "art_union_mask.png")},
            "skin_removal": "Only the Art-authored union-mask alpha controls extraction. One nonzero union-mask pixel fell outside the rasterized polygon feathers and was assigned to the nearest polygon centroid for semantic labeling; all other candidate pixels outside the union mask are excluded. Skin-like pixels inside the approved union mask are retained; Art visual review is required for any halo.",
            "limits": ["PNG semantic layers are raster layers, not native editable brush/vector strokes.", "This output does not create or approve a PSD or client integration."]
        }
        (staging / "feature_extract_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        if out_dir.exists() or out_dir.is_symlink():
            raise ValueError(f"refusing to overwrite existing output path: {out_dir}")
        os.rename(staging, out_dir)
    print(json.dumps(report, ensure_ascii=False, indent=2))


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
    e = sub.add_parser("extract-features", help="extract one candidate through Art-provided semantic polygons")
    e.add_argument("--spec", required=True, help="source canvas/base/front rectangles and layer paths")
    e.add_argument("--definition", required=True, help="Art JSON mask definition with candidate, mask, ROI and polygons")
    e.add_argument("--root", help="base for relative paths; defaults to current directory")
    e.add_argument("--out", required=True, help="new output directory; must not already exist")
    e.set_defaults(func=cmd_extract_features)
    return p


if __name__ == "__main__":
    try:
        parsed = parser().parse_args()
        parsed.func(parsed)
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(2)
