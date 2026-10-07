"""First-pass art preview from original full-canvas raster layers and local strokes."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent
RAW = ROOT.parents[2] / "moonlit_psd_20261005_v2_raw" / "psd_full_canvas_layers"
LOCAL = ROOT / "local_layers"
REVIEW = ROOT.parent / "review"
REVIEW.mkdir(parents=True, exist_ok=True)
SIZE = (2172, 724)

def load(name):
    image = Image.open(name).convert("RGBA")
    assert image.size == SIZE, name
    return image

legacy = [load(p) for p in sorted(RAW.glob("*.png"))]
assert len(legacy) == 4
def put(bottom, top):
    return Image.alpha_composite(bottom, top)

old = Image.new("RGBA", SIZE, (0, 0, 0, 255))
for item in legacy:
    old = put(old, item)
assert old.convert("RGB").tobytes() == Image.open(
    RAW.parent / "overall_from_psd.png"
).convert("RGB").tobytes()

local = {p.stem: load(p) for p in LOCAL.glob("*.png")}
assert len(local) == 5
new = Image.new("RGBA", SIZE, (0, 0, 0, 255))
for item in legacy[:3]:
    new = put(new, item)
for name in ("gu01_left_flower", "gu01_right_flower", "gu03_waystone", "gu04_plaque_lettering"):
    new = put(new, local[name])
new = put(new, legacy[3])
new = put(new, local["gu02_bridge_carving"])
new.convert("RGB").save(REVIEW / "first_pass_overall.png")
for name, box in {
    "flower_left": (890, 415, 970, 500),
    "flower_right": (1200, 415, 1280, 500),
    "bridge": (1045, 410, 1135, 490),
    "waystone": (90, 415, 190, 505),
    "plaque": (2015, 237, 2105, 291),
}.items():
    old.crop(box).resize(((box[2]-box[0])*4,(box[3]-box[1])*4)).save(REVIEW / f"first_pass_{name}_old.png")
    new.crop(box).resize(((box[2]-box[0])*4,(box[3]-box[1])*4)).save(REVIEW / f"first_pass_{name}_new.png")
print(REVIEW / "first_pass_overall.png")
