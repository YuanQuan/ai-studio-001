"""Read-only visual and pixel-diff evidence for the 01/02 sign samples."""
from pathlib import Path
import json
import os
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OLD = ROOT.parent / "v0.1"
R2 = os.environ.get("SAMPLE_REVISION") == "r2"
PRE = ROOT / ("preview/sign_revision_v02_r2" if R2 else "preview/sign_revision_v02")
EXP = ROOT / ("exports/sign_revision_v02_r2" if R2 else "exports/sign_revision_v02")

OLD_FILES = {
    1: ("exports/milk_tea_full_redraw_v04/tex_u03_shop_01_body_full_redraw_v04.png", "exports/milk_tea_full_redraw_v04/tex_u03_shop_01_sign_full_redraw_v04.png"),
    2: ("exports/zcool_b92_five_v03/tex_u03_shop_02_body_zcool_b92_v03.png", "exports/zcool_b92_five_v03/tex_u03_shop_02_sign_zcool_b92_v03.png"),
}

def rgba(path):
    return Image.open(path).convert("RGBA")

def view(im, width, height, display, foot_y):
    bg = Image.new("RGBA", (width, height), (22, 45, 82, 255))
    scaled = im.resize((display, display), Image.Resampling.LANCZOS)
    bg.alpha_composite(scaled, ((width-display)//2, foot_y-round(900*display/1024)))
    return bg.convert("RGB")

report = {"samples": {}}
for num in (1, 2):
    key = f"shop_{num:02d}"
    old_body, old_sign = [rgba(OLD/p) for p in OLD_FILES[num]]
    new_body = rgba(EXP/f"tex_u03_{key}_body_sign_revision_v02.png")
    new_sign = rgba(EXP/f"tex_u03_{key}_sign_sign_revision_v02.png")
    old = old_body.copy(); old.alpha_composite(old_sign)
    new = new_body.copy(); new.alpha_composite(new_sign)
    old_arr, new_arr = np.array(old), np.array(new)
    changed = np.any(old_arr != new_arr, axis=2)
    allowed = (np.array(old_sign.getchannel("A")) > 0) | (np.array(new_sign.getchannel("A")) > 0)
    if num == 1:
        allowed[470:591, 346:678] = True
    outside = int(np.count_nonzero(changed & ~allowed))
    body_changed = np.any(np.array(old_body) != np.array(new_body), axis=2)
    report["samples"][key] = {
        "body_changed_pixels": int(body_changed.sum()),
        "diff_outside_old_new_sign_and_local_repair": outside,
        "old_body_bbox": old_body.getchannel("A").getbbox(),
        "new_body_bbox": new_body.getchannel("A").getbbox(),
        "old_sign_bbox": old_sign.getchannel("A").getbbox(),
        "new_sign_bbox": new_sign.getchannel("A").getbbox(),
        "body_byte_identical": (OLD/OLD_FILES[num][0]).read_bytes() == (EXP/f"tex_u03_{key}_body_sign_revision_v02.png").read_bytes(),
        "canvas": [1024, 1024], "foot": [512, 900],
        "visual_status": "NOT_YET_REVIEWED"
    }
    assert outside == 0, (num, outside)
    for width, height, display, foot in ((390,844,316,530),(720,1280,584,800)):
        view(new,width,height,display,foot).save(PRE/f"{key}_{width}x{height}.png")
    # Old and new at identical 1024 canvas; border does not shift pixels.
    sheet = Image.new("RGBA", (2048, 1024), (24,43,79,255))
    sheet.alpha_composite(old, (0,0)); sheet.alpha_composite(new,(1024,0))
    sheet.save(PRE/f"{key}_old_new_same_canvas.png")

(ROOT/("SAMPLE_DIFF_REPORT_V02_R2.json" if R2 else "SAMPLE_DIFF_REPORT_V02.json")).write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps(report,ensure_ascii=False,indent=2))
