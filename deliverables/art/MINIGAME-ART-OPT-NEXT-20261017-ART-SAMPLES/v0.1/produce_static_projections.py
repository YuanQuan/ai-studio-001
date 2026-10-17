"""以冻结源码公式制作同背景、同视窗、同尺度的静态源/候选投影。

只绘制本件图片和源码中的纯色舞台背景；不声称完整场景重组或GPU运行。
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image

REPO = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
PLAN = json.loads((REPO / "deliverables/art/MINIGAME-ART-OPT-NEXT-20261017-ART-PRESIGN/v0.1/BATCH_PLAN.json").read_text())
FIRST = ("tex_sakura_rr_sky_r", "tex_u03_shop_05_sign", "UG_GHOST_01_HAPPY_00")
BG = (10, 20, 34)
PANEL = (19, 34, 51)


def image_rgba(path: Path) -> np.ndarray:
    with Image.open(path) as image:
        return np.asarray(image.convert("RGBA"), dtype=np.uint8)


def layout(asset: str, width: int, height: int) -> tuple[dict, tuple[int, int, int, int] | None]:
    if asset == "tex_sakura_rr_sky_r":
        scale = min((width - 40) / 3072, (height - 168) / 1024)
        return {"left": width / 2, "top": height / 2 - 12 - 1024 * scale / 2,
                "scale": scale, "formula": "U01 reset fit; sky_r at right half; centerY +12"}, None
    if asset == "tex_u03_shop_05_sign":
        scale = min(width - 24, height - 202, 620) / 1024
        canvas_left = width / 2 - 512 * scale
        canvas_top = height / 2 - 29 - 512 * scale
        return {"left": canvas_left + 288 * scale, "top": canvas_top + 243 * scale,
                "scale": scale, "formula": "U03 stage centerY +29; sign crop [288,243,663,383] in original 1024 canvas"}, None
    if asset == "UG_GHOST_01_HAPPY_00":
        safe_h = height - 16
        nav_y = height / 2 - 8 - 56 / 2
        stage_top = nav_y - 56 / 2 - 8
        tray_bottom = -height / 2 + 8 + 8
        region_h = stage_top - tray_bottom
        desired_tray = max(168, min(336, safe_h * .45))
        tray_h = max(120, min(desired_tray, region_h - 120 - 64 - 16))
        tray_top = tray_bottom + tray_h
        stage_bottom = tray_top + 64 + 8
        stage_h = max(0, stage_top - stage_bottom)
        stage_w = min(590, width - 24)
        stage_center_y_up = stage_top - stage_h / 2
        stage_screen_center = height / 2 - stage_center_y_up
        scale = min(.9, max(.4, (stage_h - 60) / 356))
        stage_box = (int(round((width - stage_w) / 2)), int(round(height / 2 - stage_top)),
                     int(round((width + stage_w) / 2)), int(round(height / 2 - stage_bottom)))
        return {"left": width / 2 - 166 * scale, "top": stage_screen_center - 173 * scale,
                "scale": scale, "stage_height": stage_h,
                "formula": "U02 happy00 right-facing no accessory; foot=(256,440), mirrorY=-192s, crop=[90,75,417,442]"}, stage_box
    raise ValueError(asset)


def bilinear_straight_rgba(source: np.ndarray, size: tuple[int, int], rect: dict) -> np.ndarray:
    width, height = size
    out = np.zeros((height, width, 4), dtype=np.float32)
    scale, left, top = rect["scale"], rect["left"], rect["top"]
    x0 = max(0, int(np.floor(left)))
    x1 = min(width, int(np.ceil(left + source.shape[1] * scale)))
    y0 = max(0, int(np.floor(top)))
    y1 = min(height, int(np.ceil(top + source.shape[0] * scale)))
    if x1 <= x0 or y1 <= y0:
        return out.astype(np.uint8)
    xx = (np.arange(x0, x1, dtype=np.float32) + .5 - left) / scale - .5
    yy = (np.arange(y0, y1, dtype=np.float32) + .5 - top) / scale - .5
    xx = np.clip(xx, 0, source.shape[1] - 1)
    yy = np.clip(yy, 0, source.shape[0] - 1)
    xlo = np.floor(xx).astype(np.int32)
    ylo = np.floor(yy).astype(np.int32)
    xhi = np.minimum(xlo + 1, source.shape[1] - 1)
    yhi = np.minimum(ylo + 1, source.shape[0] - 1)
    fx = (xx - xlo)[None, :, None]
    fy = (yy - ylo)[:, None, None]
    a = source[ylo[:, None], xlo[None, :]].astype(np.float32)
    b = source[ylo[:, None], xhi[None, :]].astype(np.float32)
    c = source[yhi[:, None], xlo[None, :]].astype(np.float32)
    d = source[yhi[:, None], xhi[None, :]].astype(np.float32)
    sample = (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy
    out[y0:y1, x0:x1] = sample
    return np.clip(np.rint(out), 0, 255).astype(np.uint8)


def composite(source: np.ndarray, size: tuple[int, int], rect: dict, panel: tuple[int, int, int, int] | None) -> np.ndarray:
    width, height = size
    canvas = np.empty((height, width, 3), dtype=np.uint8)
    canvas[:] = BG
    if panel:
        x0, y0, x1, y1 = panel
        canvas[max(y0, 0):min(y1, height), max(x0, 0):min(x1, width)] = PANEL
    projected = bilinear_straight_rgba(source, size, rect)
    alpha = projected[:, :, 3:4].astype(np.float32) / 255
    mixed = projected[:, :, :3].astype(np.float32) * alpha + canvas.astype(np.float32) * (1 - alpha)
    return np.clip(np.rint(mixed), 0, 255).astype(np.uint8)


def main() -> None:
    record = {"basis": "冻结源码公式静态投影；只用源码纯色舞台背景，不重组其他场景层或运行GPU",
              "sampler": "straight-alpha RGBA8双线性，像素中心0.5，源/候选同公式；sRGB字节值插值、同背景混合",
              "viewports": [[720, 1280], [320, 568]], "runtime": "NOT_TESTED", "items": []}
    for asset in FIRST:
        folder = OUT / "samples" / asset
        source = image_rgba(folder / "reference.png")
        for kind, name in (("png_lossless", "png_lossless.png"), ("webp_lossless", "webp_lossless.webp")):
            candidate = image_rgba(folder / name)
            assert np.array_equal(source, candidate)
            for width, height in ((720, 1280), (320, 568)):
                rect, panel = layout(asset, width, height)
                left = composite(source, (width, height), rect, panel)
                right = composite(candidate, (width, height), rect, panel)
                difference = np.abs(left.astype(np.int16) - right.astype(np.int16))
                assert not np.any(difference)
                pair = Image.new("RGB", (2 * width, height))
                pair.paste(Image.fromarray(left), (0, 0))
                pair.paste(Image.fromarray(right), (width, 0))
                path = folder / "evidence" / f"{kind}_static_projection_{width}x{height}.png"
                pair.save(path, optimize=True, compress_level=9)
                record["items"].append({"asset_id": asset, "kind": kind, "viewport": [width, height],
                                        "layout": rect, "background": "MENU_BG RGB(10,20,34)" + (" and U02 PANEL RGB(19,34,51)" if panel else ""),
                                        "source_candidate_projected_difference": 0,
                                        "path": str(path.relative_to(REPO)), "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                                        "limitation": "纯色舞台上的源码公式投影；未复现完整场景层、设备采样或运行帧"})
    (OUT / "STATIC_PROJECTION.json").write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
