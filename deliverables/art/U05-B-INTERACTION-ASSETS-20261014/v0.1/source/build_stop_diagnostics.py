"""Read-only source comparison sheets for the stopped REP-02 sample."""

from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[5]
HERE = Path(__file__).resolve().parents[1]
BEFORE = Image.open(ROOT / "deliverables/art/U05-B-COMPONENT-ASSETS-20261014/v0.2/exports/STATIC_BARE.png").convert("RGB")
DONOR = Image.open(ROOT / "deliverables/art/U05-B-WORKSPACE-ASSETS-20261014/v0.1/source/repair_scene_candidate.png").convert("RGB")
REP02 = Image.open(HERE / "exports/STATIC_BARE_CLEAN.png").convert("RGB")
OUT = HERE / "review"
OUT.mkdir(parents=True, exist_ok=True)


def compare(name, box, scale):
    x1, y1, x2, y2 = box
    w, h = (x2 - x1) * scale, (y2 - y1) * scale
    canvas = Image.new("RGB", (w * 3, h + 28), "#191521")
    draw = ImageDraw.Draw(canvas)
    for i, (label, im) in enumerate((("V0.2 STATIC_BARE", BEFORE), ("HISTORICAL DONOR", DONOR), ("REP-02 RESULT", REP02))):
        canvas.paste(im.crop(box).resize((w, h), Image.Resampling.NEAREST), (i * w, 28))
        draw.text((i*w + 8, 7), label, fill="white")
    canvas.save(OUT / f"diagnostic_{name}_comparison.png")


compare("window", (280, 450, 720, 790), 2)
compare("rim", (350, 1060, 660, 1160), 4)
compare("glass", (420, 1200, 600, 1340), 3)

# This is a donor-difference map, not an automatically accepted object mask.
a = np.asarray(REP02, dtype=np.int16)
b = np.asarray(DONOR, dtype=np.int16)
delta = np.max(np.abs(a-b), axis=2)
for name, box in (("window_tail", (600, 690, 711, 783)), ("rim_halo", (418, 1090, 603, 1130)), ("glass", (440, 1220, 576, 1328))):
    x1, y1, x2, y2 = box
    base = REP02.crop(box).convert("RGBA")
    residual = (delta[y1:y2, x1:x2] >= 4) & (delta[y1:y2, x1:x2] < 12)
    overlay = Image.new("RGBA", base.size, (245, 30, 160, 0))
    alpha = Image.fromarray((residual * 180).astype(np.uint8))
    overlay.putalpha(alpha)
    base = Image.alpha_composite(base, overlay)
    base.resize((base.width*4, base.height*4), Image.Resampling.NEAREST).save(OUT / f"diagnostic_{name}_candidate_delta_4to11.png")
