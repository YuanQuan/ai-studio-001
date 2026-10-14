"""One-shot MANUAL-01 human-traced residual mask from the presigned SVG.

The SVG is authored from visual source comparison; the code does not find or
grow object contours. Run only after matching MANUAL-01 Tech presign.
"""

from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path
import xml.etree.ElementTree as ET

import numpy as np
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parents[1]
ROOT = Path(__file__).resolve().parents[5]
SVG = HERE / "source/MANUAL_PATHS.svg"
REP02 = HERE / "exports/STATIC_BARE_CLEAN.png"
DONOR = ROOT / "deliverables/art/U05-B-WORKSPACE-ASSETS-20261014/v0.1/source/repair_scene_candidate.png"
SOURCE = HERE / "source"
REVIEW = HERE / "review"
EXPORT = HERE / "exports"
SCALE = 3


def sha(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


def points_from_path(d: str) -> list[tuple[float, float]]:
    tokens = re.findall(r"[MC]|-?\d+(?:\.\d+)?", d)
    i = 0
    result = []
    while i < len(tokens):
        kind = tokens[i]
        i += 1
        if kind == "M":
            x, y = float(tokens[i]), float(tokens[i + 1])
            result.append((x, y))
            i += 2
        elif kind == "C":
            a = result[-1]
            c1 = (float(tokens[i]), float(tokens[i + 1]))
            c2 = (float(tokens[i + 2]), float(tokens[i + 3]))
            b = (float(tokens[i + 4]), float(tokens[i + 5]))
            i += 6
            for j in range(1, 65):
                t = j / 64.0
                q = 1 - t
                x = q**3*a[0] + 3*q*q*t*c1[0] + 3*q*t*t*c2[0] + t**3*b[0]
                y = q**3*a[1] + 3*q*q*t*c1[1] + 3*q*t*t*c2[1] + t**3*b[1]
                result.append((x, y))
        else:
            raise ValueError(f"unexpected path command {kind}")
    return result


def bbox_gate(kind: str) -> tuple[int, int, int, int]:
    if kind == "old_ghost_outline":
        return 305, 489, 711, 783
    if kind == "old_work_cup_rim":
        return 418, 1090, 603, 1130
    if kind == "old_work_cup_glass":
        return 440, 1220, 576, 1328
    raise ValueError(kind)


def main() -> None:
    assert sha(REP02) == "2160dd5789174154304e49d3a6fd4230a095bcf1e3777caf4db1f939d3e179c9"
    assert sha(DONOR) == "4062dfb0dc46cf17dea20b93478e9712ded98c057d8246c0f6c5221318b5c6af"
    assert sha(SVG) == "cd4906160946d865cb3c4deff92b7077e958b4d4d7304cbd47265e1dea87788c"
    a = np.asarray(Image.open(REP02).convert("RGB"), dtype=np.uint8)
    b = np.asarray(Image.open(DONOR).convert("RGB"), dtype=np.uint8)
    difference = np.max(np.abs(a.astype(np.int16) - b.astype(np.int16)), axis=2)
    remaining_low = (difference >= 4) & (difference < 12)
    union = np.zeros((1536, 1024), dtype=bool)
    detail = []
    tree = ET.parse(SVG)
    ns = {"svg": "http://www.w3.org/2000/svg"}
    for node in tree.findall(".//svg:path", ns):
        name = node.attrib["id"]
        kind = node.attrib["data-object"]
        width = float(node.attrib["stroke-width"])
        coords = points_from_path(node.attrib["d"])
        path_image = Image.new("L", (1024*SCALE, 1536*SCALE), 0)
        draw = ImageDraw.Draw(path_image)
        draw.line([(round(x*SCALE), round(y*SCALE)) for x,y in coords], fill=255, width=round(width*SCALE), joint="curve")
        # Match SVG round caps at endpoints.
        rad = width * SCALE / 2
        for x,y in (coords[0], coords[-1]):
            px,py=x*SCALE,y*SCALE
            draw.ellipse((round(px-rad),round(py-rad),round(px+rad),round(py+rad)), fill=255)
        support = np.asarray(path_image.resize((1024, 1536), Image.Resampling.LANCZOS)) >= 128
        gated = np.zeros_like(support)
        x1,y1,x2,y2=bbox_gate(kind)
        gated[y1:y2,x1:x2] = support[y1:y2,x1:x2] & remaining_low[y1:y2,x1:x2]
        union |= gated
        detail.append({"path_id":name,"object":kind,"stroke_source_px":width,"confirmed_candidate_pixels":int(gated.sum()),"diagnostic_bbox_xyxy":[x1,y1,x2,y2]})
    # The hand trace and approved boxes exclude all unrelated donor differences.
    mask = Image.fromarray((union*255).astype(np.uint8))
    mask.save(SOURCE / "mask_residual_confirmed.png")
    for name,(x1,y1,x2,y2) in {"window":(280,450,720,790),"rim":(350,1060,660,1160),"glass":(420,1200,600,1340)}.items():
        base = Image.fromarray(a, "RGB").crop((x1,y1,x2,y2)).convert("RGBA")
        overlay = Image.new("RGBA",base.size,(255,0,170,0))
        overlay.putalpha(mask.crop((x1,y1,x2,y2)).point(lambda v: 140 if v else 0))
        Image.alpha_composite(base,overlay).resize((base.width*3,base.height*3),Image.Resampling.NEAREST).save(REVIEW / f"manual_mask_{name}_review.png")
    out = a.copy()
    out[union] = b[union]
    assert np.array_equal(out[~union],a[~union])
    out_path=EXPORT / "STATIC_BARE_MANUAL01.png"
    Image.fromarray(out).save(out_path)
    (SOURCE / "MASK_REVIEW.json").write_text(json.dumps({"batch_id":"MANUAL-01","svg_sha256":sha(SVG),"rep02_sha256":sha(REP02),"donor_sha256":sha(DONOR),"output_sha256":sha(out_path),"mask_sha256":sha(SOURCE / "mask_residual_confirmed.png"),"mask_pixels":int(union.sum()),"outside_mask_rgb_difference_pixels":0,"objects":detail,"method":"manual SVG path ∩ signed bbox ∩ residual donor max RGB channel difference 4–11; one candidate only; natural street and wood excluded by path"},ensure_ascii=False,indent=2)+"\n")
    print(json.dumps({"output_sha256":sha(out_path),"mask_pixels":int(union.sum()),"objects":detail},ensure_ascii=False))


if __name__ == "__main__":
    main()
