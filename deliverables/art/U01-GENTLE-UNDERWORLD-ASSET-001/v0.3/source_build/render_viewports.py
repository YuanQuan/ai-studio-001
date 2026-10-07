"""Static Art projection of approved base and six independent v0.3 props.

This is not a Cocos frame capture or a runtime/performance test.
"""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
OUT = ROOT.parent
EXPORTS = OUT / "exports"
VIEWPORTS = OUT / "review" / "viewports"
VIEWPORTS.mkdir(parents=True, exist_ok=True)
SOURCE_W, SOURCE_H = 2172, 724
SCREENS = [
    ("9x16", 360, 640),
    ("9x18", 360, 720),
    ("9x19_5", 390, 844),
    ("9x20", 360, 800),
    ("9x21", 360, 840),
]
SOURCES = (
    ("base/l01_sky.png", .3),
    ("base/l02_mountains.png", .8),
    ("props/U01_PROP_LANTERN_A.png", .8),
    ("props/U01_PROP_LANTERN_B.png", .8),
    ("base/l03_ground.png", 1.),
    ("props/U01_PROP_SOUL_BANNER.png", 1.),
    ("props/U01_PROP_ROAD_SIGN.png", 1.),
    ("props/U01_PROP_FENGDU_LETTERS.png", 1.),
    ("base/l04_foreground.png", 1.),
    ("props/U01_PROP_BRIDGE_SIGN.png", 1.),
)
LAYERS = [(Image.open(EXPORTS / p).convert("RGBA"), ratio) for p,ratio in SOURCES]
assert all(layer.size == (SOURCE_W, SOURCE_H) for layer,_ in LAYERS)
STATES = [
    ("center_min", 1.0, 0.0),
    ("left_min", 1.0, -1.0),
    ("right_min", 1.0, 1.0),
    ("center_max", 1.8, 0.0),
    ("left_max", 1.8, -1.0),
    ("right_max", 1.8, 1.0),
]

def render(width, height, zoom, edge):
    logical_w = 720.0
    logical_h = logical_w * height / width
    cover = max((logical_w + 4) / SOURCE_W, (logical_h + 4) / SOURCE_H)
    scale = cover * zoom
    max_camera_x = max(0.0, (SOURCE_W - (logical_w + 4) / scale) / 2)
    camera_x = edge * max_camera_x
    logical_px = logical_w / width
    a = logical_px / scale
    y0 = SOURCE_H / 2 - logical_h / (2 * scale)
    result = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    for layer, ratio in LAYERS:
        x0 = SOURCE_W / 2 + camera_x * ratio - logical_w / (2 * scale)
        projected = layer.transform(
            (width, height),
            Image.Transform.AFFINE,
            (a, 0, x0, 0, a, y0),
            resample=Image.Resampling.BICUBIC,
            fillcolor=(0, 0, 0, 0),
        )
        result = Image.alpha_composite(result, projected)
    alpha = np.asarray(result.getchannel("A"))
    return result, {
        "logical_viewport": [logical_w, logical_h],
        "cover_scale": cover,
        "scale": scale,
        "max_camera_x": max_camera_x,
        "camera_x": camera_x,
        "source_center_by_layer": [SOURCE_W/2 + camera_x*r for _,r in SOURCES],
        "minimum_composite_alpha": int(alpha.min()),
        "nonopaque_pixels": int(np.count_nonzero(alpha < 255)),
    }

def main():
    rows = []
    result = {}
    thumb_w, thumb_h = 174, 375
    font = ImageFont.load_default()
    sheet = Image.new("RGB", (6*thumb_w+7*8, 5*(thumb_h+44)+50), (20, 29, 43))
    draw = ImageDraw.Draw(sheet)
    draw.text((12, 10), "U01 Art projection - NOT Cocos runtime / no controls rendered", fill=(240,229,207), font=font)
    for row, (label, width, height) in enumerate(SCREENS):
        row_meta = {}
        for col, (state, zoom, edge) in enumerate(STATES):
            image, meta = render(width, height, zoom, edge)
            path = VIEWPORTS / f"{label}_{state}.png"
            image.save(path)
            row_meta[state] = {"file": str(path), **meta}
            thumb = image.convert("RGB").resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
            x = 8 + col*(thumb_w+8)
            y = 46 + row*(thumb_h+44)
            sheet.paste(thumb, (x,y+22))
            draw.text((x+2,y+3), f"{label} {state}", fill=(224,224,212), font=font)
            draw.rectangle((x,y+22,x+thumb_w-1,y+22+thumb_h-1), outline=(84,115,140),width=1)
        result[label] = row_meta
    sheet_path = OUT / "review" / "portrait_viewports.png"
    sheet.save(sheet_path)
    mid = {}
    for label, edge, zoom in (("mid_left_props_z1",-.28,1.0),("mid_left_props_z1_8",-.28,1.8),("mid_right_lantern_z1",.15,1.0)):
        im, meta = render(390,844,zoom,edge)
        p = OUT / "review" / (label + ".png")
        im.save(p)
        mid[label] = {"file": str(p), **meta}
    result["intermediate_motion_samples"] = mid
    (ROOT / "viewport_validation.json").write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(sheet_path)
    print("worst nonopaque pixels", max(v["nonopaque_pixels"] for row in result.values() for v in row.values()))

if __name__ == "__main__":
    main()
