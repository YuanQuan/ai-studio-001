"""Deterministic, local U05 representative image and playback builder.

Only run for the presigned REP-01 batch. Uses approved same-project pixels;
there is no generative call and no change to predecessor files.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[5]
OUT = Path(__file__).resolve().parents[1]
SRC = OUT / "source"
EXPORT = OUT / "exports"
REVIEW = OUT / "review"
BASE = ROOT / "deliverables/art/U05-B-COMPONENT-ASSETS-20261014/v0.2/exports"
CANDIDATE = ROOT / "deliverables/art/U05-B-WORKSPACE-ASSETS-20261014/v0.1/source/repair_scene_candidate.png"


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dilate(mask: np.ndarray, r: int) -> np.ndarray:
    out = mask.copy()
    for _ in range(r):
        q = out.copy()
        q[1:, :] |= out[:-1, :]
        q[:-1, :] |= out[1:, :]
        q[:, 1:] |= out[:, :-1]
        q[:, :-1] |= out[:, 1:]
        out = q
    return out


def static_clean() -> tuple[Image.Image, dict]:
    old = np.asarray(Image.open(BASE / "STATIC_BARE.png").convert("RGB"), dtype=np.uint8)
    donor = np.asarray(Image.open(CANDIDATE).convert("RGB"), dtype=np.uint8)
    delta = np.max(np.abs(old.astype(np.int16) - donor.astype(np.int16)), axis=2)
    definitions = {
        "ghost_outline_and_bubble_tip": ((305, 489, 711, 783), 12, 2),
        "cup_rim": ((418, 1090, 603, 1130), 12, 2),
        "cup_glass": ((440, 1220, 576, 1328), 12, 2),
    }
    union = np.zeros(delta.shape, dtype=bool)
    each = {}
    for name, (box, cutoff, radius) in definitions.items():
        x1, y1, x2, y2 = box
        local = dilate(delta[y1:y2, x1:x2] >= cutoff, radius)
        union[y1:y2, x1:x2] |= local
        each[name] = {"bbox_xyxy": box, "candidate_difference_threshold": cutoff, "dilation_px": radius, "changed_pixels": int(local.sum())}
        Image.fromarray((local * 255).astype(np.uint8), "L").save(SRC / f"mask_{name}.png")
    clean = old.copy()
    clean[union] = donor[union]
    Image.fromarray((union * 255).astype(np.uint8), "L").save(SRC / "mask_static_union.png")
    assert np.array_equal(clean[~union], old[~union])
    im = Image.fromarray(clean, "RGB")
    im.save(EXPORT / "STATIC_BARE_CLEAN.png")
    report = {"source_sha256": sha(BASE / "STATIC_BARE.png"), "donor_sha256": sha(CANDIDATE), "output_sha256": sha(EXPORT / "STATIC_BARE_CLEAN.png"), "canvas": [1024, 1536], "mask_pixels": int(union.sum()), "outside_mask_changed_pixels": int(np.count_nonzero(np.any(clean[~union] != old[~union], axis=1))), "regions": each, "method": "RGB8 raw sRGB pixel comparison; donor copied only where difference exceeds threshold inside approved ROI, dilated two Manhattan pixels"}
    return im, report


def face_mask() -> np.ndarray:
    mask = Image.new("L", (332, 301), 0)
    d = ImageDraw.Draw(mask)
    # Bounded tightly around the existing eye and mouth strokes. Blush stays in body.
    d.ellipse((183, 98, 225, 158), fill=255)
    d.ellipse((272, 89, 308, 145), fill=255)
    d.ellipse((233, 141, 276, 167), fill=255)
    a = np.asarray(mask, dtype=np.uint8) > 0
    assert not np.any(a[:89]) and not np.any(a[180:])
    assert not np.any(a[:, :154]) and not np.any(a[:, 324:])
    return a


def inpaint_rgb(original: np.ndarray, mask: np.ndarray) -> np.ndarray:
    # Harmonic interpolation of original neighboring white face pixels.
    rgb = original[:, :, :3].astype(np.float32)
    cur = rgb.copy()
    cur[mask] = [249.0, 242.0, 232.0]
    for _ in range(650):
        around = (
            np.pad(cur[1:], ((0, 1), (0, 0), (0, 0)), mode="edge")
            + np.pad(cur[:-1], ((1, 0), (0, 0), (0, 0)), mode="edge")
            + np.pad(cur[:, 1:], ((0, 0), (0, 1), (0, 0)), mode="edge")
            + np.pad(cur[:, :-1], ((0, 0), (1, 0), (0, 0)), mode="edge")
        ) * 0.25
        cur[mask] = around[mask]
    out = original.copy()
    out[mask, :3] = np.clip(np.rint(cur[mask]), 0, 255).astype(np.uint8)
    return out


def stroke_face(kind: str) -> Image.Image:
    S = 4
    im = Image.new("RGBA", (332*S, 301*S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    navy = (25, 29, 91, 255)
    if kind == "blink":
        d.arc((188*S, 116*S, 222*S, 142*S), 14, 167, fill=navy, width=5*S)
        d.arc((274*S, 108*S, 304*S, 133*S), 14, 167, fill=navy, width=5*S)
    elif kind == "happy":
        d.arc((183*S, 110*S, 226*S, 151*S), 202, 338, fill=navy, width=7*S)
        d.arc((270*S, 102*S, 310*S, 141*S), 202, 338, fill=navy, width=7*S)
        d.arc((230*S, 131*S, 279*S, 174*S), 15, 165, fill=navy, width=6*S)
    elif kind == "squash":
        d.ellipse((190*S, 122*S, 219*S, 140*S), fill=navy)
        d.ellipse((279*S, 113*S, 301*S, 130*S), fill=navy)
    elif kind == "expand_mid":
        d.arc((185*S, 111*S, 224*S, 150*S), 204, 334, fill=navy, width=6*S)
        d.arc((272*S, 103*S, 307*S, 140*S), 204, 334, fill=navy, width=6*S)
        d.arc((238*S, 141*S, 272*S, 166*S), 20, 160, fill=navy, width=5*S)
    else:
        raise ValueError(kind)
    if kind in ("blink", "squash"):
        # The neutral mouth is restored from the source rather than redrawn.
        pass
    return im.resize((332, 301), Image.Resampling.LANCZOS)


def faces() -> tuple[dict[str, Image.Image], dict]:
    original = np.asarray(Image.open(BASE / "CUSTOMER_GHOST.png").convert("RGBA"), dtype=np.uint8)
    mask = face_mask()
    cleaned = inpaint_rgb(original, mask)
    body = Image.fromarray(cleaned, "RGBA")
    body.save(EXPORT / "CUSTOMER_BODY.png")
    Image.fromarray((mask * 255).astype(np.uint8), "L").save(SRC / "mask_face_rep.png")
    neutral_array = np.zeros_like(original)
    neutral_array[mask] = original[mask]
    neutral = Image.fromarray(neutral_array, "RGBA")
    neutral.save(EXPORT / "FACE_NEUTRAL.png")
    # Blink/squash keep the exact old mouth; happy replaces that mouth.
    mouth = np.zeros_like(original)
    mouth_mask = np.zeros(mask.shape, dtype=bool)
    mouth_mask[141:167, 233:276] = mask[141:167, 233:276]
    mouth[mouth_mask] = original[mouth_mask]
    old_mouth = Image.fromarray(mouth, "RGBA")
    variants = {"neutral": neutral}
    for name in ("squash", "blink", "expand_mid", "happy"):
        ink = stroke_face(name)
        if name in ("squash", "blink"):
            ink = Image.alpha_composite(old_mouth, ink)
        ink.save(EXPORT / f"FACE_{name.upper()}.png")
        variants[name] = ink
    rebuilt = Image.alpha_composite(body, neutral)
    reb = np.asarray(rebuilt)
    # Alpha compositing must reproduce the original neutral visible RGBA exactly.
    pixel_diff = np.any(reb != original, axis=2)
    assert not np.any(pixel_diff), int(pixel_diff.sum())
    report = {"original_sha256": sha(BASE / "CUSTOMER_GHOST.png"), "body_sha256": sha(EXPORT / "CUSTOMER_BODY.png"), "neutral_sha256": sha(EXPORT / "FACE_NEUTRAL.png"), "face_mask_pixels": int(mask.sum()), "neutral_reconstruction_different_rgba_pixels": int(pixel_diff.sum()), "outside_mask_different_rgba_pixels": int(np.count_nonzero(np.any(cleaned[~mask] != original[~mask], axis=1))), "canvas": [332, 301], "top_left_source": [309, 484], "pivot_source": [475, 785], "anchor_normalized": [0.5, 0], "planned_edit_limit_local": [154, 89, 170, 91]}
    return variants, report


def target_cup() -> Image.Image:
    layer_root = ROOT / "deliverables/art/U05-B-WORKSPACE-ASSETS-20261014/v0.1/source/layers"
    names = ["ORDER_CUP_BACK", "ORDER_SAMPLE_CUP_TEA_T01", "ORDER_SAMPLE_CUP_MILK_M01", "ORDER_SAMPLE_CUP_TOP_P01", "ORDER_CUP_FRONT", "ORDER_STRAW"]
    group = Image.new("RGBA", (1024, 1536), (0, 0, 0, 0))
    for name in names:
        group = Image.alpha_composite(group, Image.open(layer_root / f"{name}_full.png").convert("RGBA"))
    cropped = group.crop((577, 301, 728, 506))
    return cropped.resize((118, 160), Image.Resampling.LANCZOS)


def render_frame(static: Image.Image, body: Image.Image, face: Image.Image, x: int, bubble: bool, cup: Image.Image) -> Image.Image:
    canvas = static.convert("RGBA")
    unit = Image.alpha_composite(body, face)
    carrier = Image.new("RGBA", (1024, 1536), (0, 0, 0, 0))
    carrier.paste(unit, (x, 484))
    # Clip only the body+face to the fixed inner window.
    mask = Image.new("L", (1024, 1536), 0)
    ImageDraw.Draw(mask).rectangle((260, 278, 749, 782), fill=255)
    alpha = np.asarray(carrier.getchannel("A"), dtype=np.uint8)
    m = np.asarray(mask, dtype=np.uint8)
    carrier.putalpha(Image.fromarray(np.minimum(alpha, m), "L"))
    canvas = Image.alpha_composite(canvas, carrier)
    counter = Image.open(BASE / "COUNTER_FRONT.png").convert("RGBA")
    canvas.alpha_composite(counter, (234, 777))
    if bubble:
        b = Image.open(BASE / "ORDER_BUBBLE_EMPTY.png").convert("RGBA")
        canvas.alpha_composite(b, (467, 288))
        canvas.alpha_composite(cup, (594, 326))
    return canvas.convert("RGB")


def preview(static: Image.Image, variants: dict[str, Image.Image]) -> dict:
    body = Image.open(EXPORT / "CUSTOMER_BODY.png").convert("RGBA")
    cup = target_cup()
    # 0 neutral; squash 0–80; closed 80–150; open happy by 300;
    # hold, then move all 381 px in 450ms with an ease-in sample path.
    timeline = [
        (0, "neutral", 309, True, 40),
        (40, "squash", 309, True, 40),
        (80, "blink", 309, True, 70),
        (150, "blink", 309, True, 75),
        (225, "expand_mid", 309, True, 75),
        (300, "happy", 309, True, 100),
        (400, "happy", 309, False, 75),
        (475, "happy", 298, False, 75),
        (550, "happy", 267, False, 75),
        (625, "happy", 214, False, 75),
        (700, "happy", 140, False, 75),
        (775, "happy", 44, False, 75),
        (850, "happy", -72, False, 300),
    ]
    frames = []
    for t, state, x, bubble, duration in timeline:
        full = render_frame(static, body, variants[state], x, bubble, cup)
        if t in (0, 80, 300, 625, 850):
            full.save(REVIEW / f"rep_t{t:03d}_{state}_x{x}.png")
        small = full.resize((360, 540), Image.Resampling.LANCZOS)
        view = Image.new("RGB", (360, 640), (22, 17, 27))
        view.paste(small, (0, 50))
        frames.append(view)
    frames[0].save(REVIEW / "animation_representative.gif", save_all=True, append_images=frames[1:], duration=[x[-1] for x in timeline], loop=0, optimize=False)
    sheet = Image.new("RGB", (360*4, 640), (22, 17, 27))
    for i, idx in enumerate((0, 2, 5, 12)):
        sheet.paste(frames[idx], (360*i, 0))
    sheet.save(REVIEW / "representative_sheet.png")
    return {"gif_sha256": sha(REVIEW / "animation_representative.gif"), "gif_size": [360, 640], "frame_count": len(frames), "duration_ms": sum(x[-1] for x in timeline), "timeline": [{"time_ms": t, "face": face, "customer_left": x, "bubble_visible": bubble, "duration_ms": d} for t, face, x, bubble, d in timeline]}


def main() -> None:
    for p in (SRC, EXPORT, REVIEW):
        p.mkdir(parents=True, exist_ok=True)
    static, static_report = static_clean()
    variants, face_report = faces()
    animation = preview(static, variants)
    (REVIEW / "REPRESENTATIVE_METRICS.json").write_text(json.dumps({"static": static_report, "face": face_report, "animation": animation}, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"static": static_report, "face": face_report, "animation_gif": animation["gif_sha256"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
