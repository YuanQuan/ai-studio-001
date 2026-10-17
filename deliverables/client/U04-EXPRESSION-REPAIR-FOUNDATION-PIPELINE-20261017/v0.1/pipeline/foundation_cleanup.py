#!/usr/bin/env python3
"""Deterministic Art-authored base/front cleanup from explicit masks and samples."""
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


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def resolve(root: Path, value: str) -> Path:
    path = Path(value)
    return path if path.is_absolute() else (root / path).resolve()


def read_json(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"definition must be a JSON object: {path}")
    return value


def read_rgba(path: Path, *, require_explicit_alpha: bool = False) -> Image.Image:
    if not path.is_file():
        raise ValueError(f"input does not exist: {path}")
    with Image.open(path) as raw:
        if require_explicit_alpha and "A" not in raw.getbands() and "transparency" not in raw.info:
            raise ValueError(f"mask must contain an explicit alpha channel: {path}")
        return raw.convert("RGBA")


def validated_path(root: Path, definition: dict[str, Any], path_key: str, sha_key: str) -> Path:
    path = resolve(root, str(definition[path_key]))
    actual = sha(path)
    expected = definition[sha_key]
    if actual != expected:
        raise ValueError(f"SHA-256 mismatch for {path_key}: expected {expected}, got {actual}")
    return path


def validate_roi(value: Any, canvas: tuple[int, int]) -> tuple[int, int, int, int]:
    if not isinstance(value, list) or len(value) != 4 or any(type(x) is not int for x in value):
        raise ValueError("source_roi_xyxy must be four integer coordinates")
    x0, y0, x1, y1 = value
    if x0 < 0 or y0 < 0 or x1 - x0 != 256 or y1 - y0 != 256 or x1 > canvas[0] or y1 > canvas[1]:
        raise ValueError(f"source ROI must be a 256x256 rectangle within canvas {canvas}: {value}")
    return x0, y0, x1, y1


def read_mask(root: Path, record: dict[str, Any], expected_size: tuple[int, int], label: str) -> tuple[Path, Image.Image, np.ndarray]:
    path = resolve(root, record["path"])
    if sha(path) != record["sha256"]:
        raise ValueError(f"SHA-256 mismatch for {label} mask: {path}")
    image = read_rgba(path, require_explicit_alpha=True)
    if image.size != expected_size:
        raise ValueError(f"{label} mask must be {expected_size}, got {image.size}")
    alpha = np.asarray(image.getchannel("A"), dtype=np.uint8)
    count = int(np.count_nonzero(alpha))
    if "alpha_nonzero_pixels" in record and count != record["alpha_nonzero_pixels"]:
        raise ValueError(f"{label} mask alpha count mismatch: definition={record['alpha_nonzero_pixels']}, actual={count}")
    return path, image, alpha


def alpha_erase(source: Image.Image, roi: tuple[int, int, int, int], mask_alpha: np.ndarray) -> Image.Image:
    arr = np.asarray(source, dtype=np.uint8).copy()
    x0, y0, x1, y1 = roi
    patch = arr[y0:y1, x0:x1]
    a = patch[:, :, 3].astype(np.uint16)
    m = mask_alpha.astype(np.uint16)
    patch[:, :, 3] = ((a * (255 - m) + 127) // 255).astype(np.uint8)
    return Image.fromarray(arr, "RGBA")


def gather_samples(
    definition: dict[str, Any],
    base: Image.Image,
    roi: tuple[int, int, int, int],
    base_mask_alpha: np.ndarray,
) -> list[dict[str, Any]]:
    x0, y0, _, _ = roi
    samples: list[dict[str, Any]] = []
    seen: set[tuple[int, int]] = set()
    for region in definition.get("base_repair_regions", []):
        region_name = region.get("name")
        if not isinstance(region_name, str) or not re.fullmatch(r"[A-Za-z0-9_ -]+", region_name):
            raise ValueError(f"invalid Art region name: {region_name!r}")
        for point in region.get("sample_points", []):
            if not isinstance(point, list) or len(point) != 2 or any(type(v) is not int for v in point):
                raise ValueError(f"sample point for {region_name} must be integer [x,y]")
            sx, sy = point
            if not (0 <= sx < 256 and 0 <= sy < 256):
                raise ValueError(f"sample point outside local canvas: {region_name} {point}")
            if int(base_mask_alpha[sy, sx]) != 0:
                raise ValueError(f"sample point intersects repair mask: {region_name} {point}, alpha={int(base_mask_alpha[sy, sx])}")
            if (sx, sy) in seen:
                raise ValueError(f"duplicate sample point: {point}")
            seen.add((sx, sy))
            rgba = base.getpixel((x0 + sx, y0 + sy))
            if rgba[3] == 0:
                raise ValueError(f"sample point is fully transparent in base: {region_name} {point}")
            samples.append({"region": region_name, "local_xy": [sx, sy], "source_xy": [x0 + sx, y0 + sy], "rgba": list(rgba)})
    if np.any(base_mask_alpha) and not samples:
        raise ValueError("base repair mask is nonempty but Art supplied no clean sample points")
    return samples


def skin_from_samples(
    source: Image.Image,
    roi: tuple[int, int, int, int],
    mask_alpha: np.ndarray,
    samples: list[dict[str, Any]],
) -> Image.Image:
    if not samples and np.any(mask_alpha):
        raise ValueError("cannot repair base without explicit Art sample points")
    arr = np.asarray(source, dtype=np.uint8).copy()
    x0, y0, x1, y1 = roi
    patch = arr[y0:y1, x0:x1]
    ys, xs = np.nonzero(mask_alpha)
    if len(xs):
        points = np.asarray([s["local_xy"] for s in samples], dtype=np.float64)
        colors = np.asarray([s["rgba"][:3] for s in samples], dtype=np.float64)
        dx = xs[:, None].astype(np.float64) - points[None, :, 0]
        dy = ys[:, None].astype(np.float64) - points[None, :, 1]
        d2 = dx * dx + dy * dy
        exact = d2 == 0
        weights = 1.0 / np.maximum(d2, 1.0)  # deterministic IDW power 2
        interpolated = weights @ colors / weights.sum(axis=1, keepdims=True)
        exact_rows = exact.any(axis=1)
        if np.any(exact_rows):
            exact_sample_idx = np.argmax(exact[exact_rows], axis=1)
            interpolated[exact_rows] = colors[exact_sample_idx]
        old_rgb = patch[ys, xs, :3].astype(np.float64)
        alpha = mask_alpha[ys, xs, None].astype(np.float64) / 255.0
        blended = old_rgb * (1.0 - alpha) + interpolated * alpha
        patch[ys, xs, :3] = np.floor(blended + 0.5).clip(0, 255).astype(np.uint8)
    # Alpha is untouched; every pixel outside the explicit Art mask remains byte-identical RGBA.
    return Image.fromarray(arr, "RGBA")


def recover_hair_from_approved_source(
    base: Image.Image,
    approved: Image.Image,
    roi: tuple[int, int, int, int],
    mask_alpha: np.ndarray,
) -> Image.Image:
    """Copy Art-authorized same-coordinate RGB only; preserve base alpha."""
    if approved.size != base.size:
        raise ValueError(f"hair recovery source must match full base canvas {base.size}, got {approved.size}")
    arr = np.asarray(base, dtype=np.uint8).copy()
    src = np.asarray(approved, dtype=np.uint8)
    x0, y0, x1, y1 = roi
    patch = arr[y0:y1, x0:x1]
    src_patch = src[y0:y1, x0:x1]
    active = mask_alpha > 0
    # A feathered Art mask blends RGB only. Base alpha stays byte-identical.
    a = mask_alpha.astype(np.uint16)
    patch[:, :, :3] = ((patch[:, :, :3].astype(np.uint16) * (255 - a[:, :, None]) +
                        src_patch[:, :, :3].astype(np.uint16) * a[:, :, None] + 127) // 255).astype(np.uint8)
    return Image.fromarray(arr, "RGBA")


def composite_roi(base: Image.Image, front: Image.Image, roi: tuple[int, int, int, int]) -> Image.Image:
    x0, y0, x1, y1 = roi
    result = base.crop((x0, y0, x1, y1)).copy()
    result.alpha_composite(front.crop((x0, y0, x1, y1)))
    return result


def count_diff_outside_roi(source: Image.Image, output: Image.Image, roi: tuple[int, int, int, int]) -> int:
    a = np.asarray(source, dtype=np.uint8)
    b = np.asarray(output, dtype=np.uint8)
    diff = np.any(a != b, axis=2)
    x0, y0, x1, y1 = roi
    diff[y0:y1, x0:x1] = False
    return int(np.count_nonzero(diff))


def count_diff_outside_mask(source: Image.Image, output: Image.Image, roi: tuple[int, int, int, int], mask_alpha: np.ndarray) -> int:
    a = np.asarray(source, dtype=np.uint8)
    b = np.asarray(output, dtype=np.uint8)
    x0, y0, x1, y1 = roi
    local = np.any(a[y0:y1, x0:x1] != b[y0:y1, x0:x1], axis=2)
    return int(np.count_nonzero(local & (mask_alpha == 0)))


def validate_optics_binding(root: Path, binding: dict[str, Any], front: Image.Image, roi: tuple[int, int, int, int]) -> dict[str, Any]:
    """Verify Art's preassembled approved optics/front inputs without editing them."""
    required = ("approved_face", "annulus_mask", "derived_annulus", "derived_roi_front")
    if not all(isinstance(binding.get(k), dict) and {"path", "sha256"}.issubset(binding[k]) for k in required):
        raise ValueError("approved_optics_transfer_binding must bind approved_face, annulus_mask, derived_annulus and derived_roi_front")
    checked: dict[str, dict[str, Any]] = {}
    decoded: dict[str, Image.Image] = {}
    for name in required:
        record = binding[name]
        path = resolve(root, record["path"])
        actual = sha(path)
        if actual != record["sha256"]:
            raise ValueError(f"SHA-256 mismatch for approved optics {name}: expected {record['sha256']}, got {actual}")
        with Image.open(path) as im:
            decoded[name] = im.convert("RGBA")
        if decoded[name].size != (256, 256):
            raise ValueError(f"approved optics {name} must be 256x256, got {decoded[name].size}")
        checked[name] = {"path": str(path), "sha256": actual, "size_px": list(decoded[name].size)}
    annulus_alpha = np.asarray(decoded["annulus_mask"].getchannel("A"), dtype=np.uint8)
    if not np.any(annulus_alpha):
        raise ValueError("approved optics transfer mask is empty")
    x0, y0, x1, y1 = roi
    full_front_crop = np.asarray(front.crop(roi), dtype=np.uint8)
    prototype = np.asarray(decoded["derived_roi_front"], dtype=np.uint8)
    diff = int(np.count_nonzero(np.any(full_front_crop != prototype, axis=2)))
    if diff:
        raise ValueError(f"approved optics ROI prototype does not match actual front input: {diff} RGBA pixels differ")
    return {
        "checked_inputs": checked,
        "approved_face_sha256": checked["approved_face"]["sha256"],
        "annulus_mask_sha256": checked["annulus_mask"]["sha256"],
        "annulus_mask_nonzero_pixels": int(np.count_nonzero(annulus_alpha)),
        "full_front_roi_matches_art_derived_roi_front": True,
        "full_front_roi_vs_prototype_changed_rgba_pixels": diff,
        "assembly_policy": str(binding.get("assembly", "")),
        "operation": "binding-only verification; the Art-derived front input is used unchanged",
    }


def run(args: argparse.Namespace) -> None:
    definition_path = Path(args.definition).resolve()
    definition = read_json(definition_path)
    root = Path(args.root).resolve() if args.root else Path.cwd()
    status = str(definition.get("status", ""))
    if any(marker in status.upper() for marker in ("REJECTED", "RETRACTED", "DO_NOT_EXECUTE", "SUPERSEDED")):
        raise ValueError(f"Art definition is not executable: status={status}")
    if args.only not in {"both", "base", "front"}:
        raise ValueError(f"invalid --only mode: {args.only}")
    if args.stage and definition.get("stage") != args.stage:
        raise ValueError(f"stage mismatch: CLI={args.stage}, definition={definition.get('stage')}")

    source_rect_value = definition.get("source_roi_xyxy")
    if not isinstance(source_rect_value, list) or len(source_rect_value) != 4:
        raise ValueError("definition source_roi_xyxy is required")
    # Source images are resolved and hash-checked before output staging.
    base_path = validated_path(root, definition, "existing_base", "existing_base_sha256")
    front_path = validated_path(root, definition, "existing_front", "existing_front_sha256")
    with Image.open(base_path) as im:
        if im.mode != "RGBA":
            raise ValueError(f"base source must be RGBA to preserve source alpha, got {im.mode}")
        base = im.copy()
    with Image.open(front_path) as im:
        if im.mode != "RGBA":
            raise ValueError(f"front source must be RGBA to preserve source alpha, got {im.mode}")
        front = im.copy()
    if base.size != front.size:
        raise ValueError(f"base/front canvas mismatch: {base.size} vs {front.size}")
    roi = validate_roi(source_rect_value, base.size)
    local_size = tuple(definition.get("local_canvas_px", []))
    if local_size != (256, 256):
        raise ValueError(f"local_canvas_px must be [256,256], got {local_size}")
    if (roi[2] - roi[0], roi[3] - roi[1]) != (256, 256):
        raise ValueError("ROI dimensions do not match the Art local canvas")

    masks = definition.get("masks")
    if not isinstance(masks, dict) or not {"base_repair", "front_erase", "protect_review"}.issubset(masks):
        raise ValueError("definition must provide base_repair, front_erase and protect_review masks")
    mask_records: dict[str, dict[str, Any]] = {}
    mask_data: dict[str, tuple[Path, Image.Image, np.ndarray]] = {}
    for name in ("base_repair", "front_erase", "protect_review"):
        record = masks[name]
        if not isinstance(record, dict) or not {"path", "sha256"}.issubset(record):
            raise ValueError(f"mask record is incomplete: {name}")
        mask_records[name] = record
        mask_data[name] = read_mask(root, record, (256, 256), name)
    base_mask_path, base_mask_image, base_mask_alpha = mask_data["base_repair"]
    front_mask_path, front_mask_image, front_mask_alpha = mask_data["front_erase"]
    protect_mask_path, protect_mask_image, protect_mask_alpha = mask_data["protect_review"]
    if args.only in ("both", "base") and np.any(base_mask_alpha):
        samples = gather_samples(definition, base, roi, base_mask_alpha)
    else:
        samples = []

    hair_recovery = definition.get("hair_recovery")
    hair_data = None
    if hair_recovery is not None:
        if not isinstance(hair_recovery, dict):
            raise ValueError("hair_recovery must be an object")
        source_path_value = hair_recovery.get("source_path", hair_recovery.get("approved_source"))
        source_sha_value = hair_recovery.get("source_sha256", hair_recovery.get("approved_source_sha256"))
        source_rect_value = hair_recovery.get("source_rect_xyxy", hair_recovery.get("source_roi_xyxy"))
        mask_record = hair_recovery.get("mask")
        if mask_record is None and {"mask_path", "mask_sha256"}.issubset(hair_recovery):
            mask_record = {"path": hair_recovery["mask_path"], "sha256": hair_recovery["mask_sha256"]}
        if source_path_value is None or source_sha_value is None or source_rect_value is None or not isinstance(mask_record, dict):
            raise ValueError("hair_recovery needs source path/SHA, matching source ROI, and mask path/SHA")
        if hair_recovery.get("preserve_current_alpha", True) is not True:
            raise ValueError("hair_recovery must preserve current base alpha")
        if hair_recovery.get("channels", "RGB") != "RGB":
            raise ValueError("hair_recovery supports RGB copy/blend only; alpha must remain unchanged")
        source_rect = validate_roi(source_rect_value, base.size)
        if source_rect != roi:
            raise ValueError(f"hair recovery source rect must exactly equal target source ROI: {source_rect} vs {roi}")
        approved_path = resolve(root, str(source_path_value))
        if sha(approved_path) != source_sha_value:
            raise ValueError(f"SHA-256 mismatch for hair recovery source: {approved_path}")
        with Image.open(approved_path) as im:
            if im.size != base.size:
                raise ValueError(f"hair recovery source must match full source canvas {base.size}, got {im.size}")
            approved = im.copy()
            if approved.mode != "RGBA":
                approved = approved.convert("RGBA")
        hair_mask_path, hair_mask_image, hair_mask_alpha = read_mask(root, mask_record, (256, 256), "hair_recovery")
        hair_data = (approved_path, approved, hair_mask_path, hair_mask_image, hair_mask_alpha)

    optics_binding = definition.get("approved_optics_transfer_binding")
    optics_report = validate_optics_binding(root, optics_binding, front, roi) if optics_binding is not None else None

    out_dir = Path(args.out).resolve()
    if out_dir.exists() or out_dir.is_symlink():
        raise ValueError(f"refusing to overwrite existing output path: {out_dir}")
    if not out_dir.parent.is_dir():
        raise ValueError(f"output parent directory must already exist: {out_dir.parent}")

    repaired_base = skin_from_samples(base, roi, base_mask_alpha, samples) if args.only in ("both", "base") else base.copy()
    if hair_data is not None and args.only in ("both", "base"):
        repaired_base = recover_hair_from_approved_source(repaired_base, hair_data[1], roi, hair_data[4])
    cleaned_front = alpha_erase(front, roi, front_mask_alpha) if args.only in ("both", "front") else front.copy()
    base_roi_diff = count_diff_outside_mask(base, repaired_base, roi, base_mask_alpha)
    if hair_data is not None:
        changed_roi = np.any(np.asarray(base.crop(roi), dtype=np.uint8) != np.asarray(repaired_base.crop(roi), dtype=np.uint8), axis=2)
        allowed_union = (base_mask_alpha > 0) | (hair_data[4] > 0)
        base_roi_diff = int(np.count_nonzero(changed_roi & ~allowed_union))
    front_roi_diff = count_diff_outside_mask(front, cleaned_front, roi, front_mask_alpha)
    base_outside_roi_diff = count_diff_outside_roi(base, repaired_base, roi)
    front_outside_roi_diff = count_diff_outside_roi(front, cleaned_front, roi)
    if any((base_roi_diff, front_roi_diff, base_outside_roi_diff, front_outside_roi_diff)):
        raise ValueError("RGBA changed outside its Art mask/ROI; refusing all outputs")

    protect_overlap = {
        "base_repair_nonzero_pixels_overlapping_protect_review": int(np.count_nonzero((base_mask_alpha > 0) & (protect_mask_alpha > 0))),
        "front_erase_nonzero_pixels_overlapping_protect_review": int(np.count_nonzero((front_mask_alpha > 0) & (protect_mask_alpha > 0))),
        "policy": "protect_review is reported for human visual review; it is not automatically subtracted from Art cleanup masks.",
    }
    before_roi = composite_roi(base, front, roi)
    after_roi = composite_roi(repaired_base, cleaned_front, roi)
    canvas_preview = Image.new("RGBA", (512, 256), (0, 0, 0, 0))
    canvas_preview.alpha_composite(before_roi, (0, 0))
    canvas_preview.alpha_composite(after_roi, (256, 0))

    with tempfile.TemporaryDirectory(prefix=f".{out_dir.name}.staging-", dir=out_dir.parent) as tmp:
        staging = Path(tmp)
        outputs: dict[str, Path] = {}
        if args.only in ("both", "base"):
            outputs["derived_base_full.png"] = staging / "derived_base_full.png"
            repaired_base.save(outputs["derived_base_full.png"])
            outputs["derived_base_roi.png"] = staging / "derived_base_roi.png"
            repaired_base.crop(roi).save(outputs["derived_base_roi.png"])
        if args.only in ("both", "front"):
            outputs["derived_front_full.png"] = staging / "derived_front_full.png"
            cleaned_front.save(outputs["derived_front_full.png"])
            outputs["derived_front_roi.png"] = staging / "derived_front_roi.png"
            cleaned_front.crop(roi).save(outputs["derived_front_roi.png"])
        outputs["roi_before_after.png"] = staging / "roi_before_after.png"
        canvas_preview.save(outputs["roi_before_after.png"])
        report = {
            "status": "PARTIAL_LAYER_CANDIDATE_FOR_ART_REVIEW" if args.only != "both" else "CANDIDATE_FOR_ART_REVIEW",
            "visual_pass": "NOT_DECIDED_BY_TOOL",
            "definition": {"path": str(definition_path), "sha256": sha(definition_path), "stage": definition.get("stage"), "status": status},
            "source_canvas_px": list(base.size),
            "source_roi_xyxy": list(roi),
            "inputs": {
                "base": {"path": str(base_path), "sha256": sha(base_path), "mode": base.mode},
                "front": {"path": str(front_path), "sha256": sha(front_path), "mode": front.mode},
            },
            "masks": {
                name: {"path": str(mask_data[name][0]), "sha256": sha(mask_data[name][0]), "size_px": list(mask_data[name][1].size),
                       "alpha_nonzero_pixels": int(np.count_nonzero(mask_data[name][2])), "alpha_values": [int(v) for v in np.unique(mask_data[name][2])]}
                for name in ("base_repair", "front_erase", "protect_review")
            },
            "hair_recovery": None if hair_data is None else {
                "approved_source": str(hair_data[0]), "approved_source_sha256": sha(hair_data[0]),
                "source_rect_xyxy": list(roi), "source_coordinates": "same absolute source-ROI coordinates as existing_base",
                "channels": "RGB", "preserve_current_alpha": True,
                "mask": {"path": str(hair_data[2]), "sha256": sha(hair_data[2]),
                    "alpha_nonzero_pixels": int(np.count_nonzero(hair_data[4]))},
                "operation_order": "skin_from_samples first, then mask-alpha RGB blend from exact same-coordinate approved source; current base alpha preserved",
                "operation": "mask-alpha RGB blend from exact same-coordinate approved source; current base alpha preserved",
                "changed_roi_pixels_in_hair_mask": int(np.count_nonzero(np.any(np.asarray(base.crop(roi)) != np.asarray(repaired_base.crop(roi)), axis=2) & (hair_data[4] > 0))),
                "overlap_with_base_repair_mask_pixels": int(np.count_nonzero((hair_data[4] > 0) & (base_mask_alpha > 0))),
            },
            "approved_optics_transfer_binding": optics_report,
            "operations": {
                "base": {"operation": "skin_from_samples" if args.only in ("both", "base") else "not_requested", "method": "IDW power=2 over all Art-listed sample points; mask alpha linearly blends interpolated RGB into current base; original alpha preserved", "sample_points": samples,
                    "additional_hair_recovery": "explicit Art mask/source only" if hair_data is not None else "not_defined"},
                "front": {"operation": "alpha_erase" if args.only in ("both", "front") else "not_requested", "method": "A_out = round(A_in * (255 - mask_alpha) / 255); RGB unchanged", "mask_path": str(front_mask_path)},
                "protect_review_overlap": protect_overlap,
            },
            "pixel_checks": {
                "base_roi_outside_mask_or_hair_recovery_changed_rgba_pixels": base_roi_diff,
                "front_roi_outside_mask_changed_rgba_pixels": front_roi_diff,
                "base_outside_source_roi_changed_rgba_pixels": base_outside_roi_diff,
                "front_outside_source_roi_changed_rgba_pixels": front_outside_roi_diff,
                "base_alpha_changed_pixels": int(np.count_nonzero(np.asarray(base)[:, :, 3] != np.asarray(repaired_base)[:, :, 3])),
                "front_rgb_changed_pixels": int(np.count_nonzero(np.any(np.asarray(front)[:, :, :3] != np.asarray(cleaned_front)[:, :, :3], axis=2))),
            },
            "outputs": {str(out_dir / name): sha(path) for name, path in outputs.items()},
            "limitations": ["Mask范围完全取自Art PNG；保护区只用于报告交叠，需Art目视判断。", "插值生成的是派生栅格像素，不恢复原生笔触；Art须审核边缘肤色、阴影与发丝。", "此工具不生成五官、不决定清理区域、不向正式Art目录落版。"],
        }
        (staging / "cleanup_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        if out_dir.exists() or out_dir.is_symlink():
            raise ValueError(f"refusing to overwrite existing output path: {out_dir}")
        os.rename(staging, out_dir)
        report["outputs"][str(out_dir / "cleanup_report.json")] = sha(out_dir / "cleanup_report.json")
    print(json.dumps(report, ensure_ascii=False, indent=2))


def parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description=__doc__)
    sub = p.add_subparsers(dest="command", required=True)
    c = sub.add_parser("clean-definition", help="apply only Art-authored base/front masks and sample points")
    c.add_argument("--definition", required=True, help="Art JSON definition with exact source hashes, ROI, masks and samples")
    c.add_argument("--root", help="base for relative paths; defaults to current directory")
    c.add_argument("--out", required=True, help="new output directory; existing path is always refused")
    c.add_argument("--only", choices=["both", "base", "front"], default="both", help="optional partial layer review output")
    c.add_argument("--stage", help="optional assertion that definition stage equals the supplied stage")
    c.set_defaults(func=run)
    return p


if __name__ == "__main__":
    try:
        args = parser().parse_args()
        args.func(args)
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(2)
