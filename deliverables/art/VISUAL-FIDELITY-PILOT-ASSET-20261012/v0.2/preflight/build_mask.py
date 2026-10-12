#!/usr/bin/env python3
"""Deterministically build the approved lantern pilot mask and pixel evidence."""

import hashlib
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[5]
HERE = Path(__file__).resolve().parent
VERSION = HERE.parent
SPEC = HERE / "MASK_SPEC.json"
ART = HERE / "ART_PRESIGN.json"
TECH = HERE / "TECH_PRESIGN.json"
GATE = ROOT / "tasks/VISUAL-FIDELITY-PILOT-PLAN-20261012/ARTIFACT_APPROVAL.json"


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def smooth(a, b, value):
    t = min(1.0, max(0.0, (value - a) / (b - a)))
    return t * t * (3.0 - 2.0 * t)


spec = json.loads(SPEC.read_text())
art = json.loads(ART.read_text())
tech = json.loads(TECH.read_text())
gate = json.loads(GATE.read_text())
spec_hash = sha256(SPEC)
assert gate["status"] == "USER_APPROVED"
assert art["mask_spec_sha256"] == spec_hash
assert tech["bound_inputs_sha256"]["preflight/MASK_SPEC.json"] == spec_hash
assert art["batch_id"] == tech["batch_id"] == spec["batch_id"]

body_path = ROOT / spec["source"]["body_path"]
assert sha256(body_path) == spec["source"]["body_sha256"]
for name in ("sign", "psd"):
    path = ROOT / spec["source"][name + "_path"]
    assert sha256(path) == spec["source"][name + "_sha256"]

source = Image.open(body_path).convert("RGBA")
assert source.size == (1024, 1024)
mask = Image.new("L", (128, 256), 0)
sp = source.load()
mp = mask.load()
changed = []
for y in range(505, 670):
    for x in range(178, 280):
        red, green, blue, alpha = sp[x, y]
        d = math.hypot((x + 0.5 - 224.5) / 25.0, (y + 0.5 - 565.5) / 33.0)
        edge = smooth(0.0, 4.0, (1.0 - d) * 25.0)
        warm = smooth(50.0, 110.0, green)
        opaque = smooth(240.0, 255.0, alpha)
        value = round(255.0 * edge * warm * opaque)
        mp[x - 178, y - 505] = value
        if value:
            changed.append((x, y))

assert len(changed) == spec["mask"]["shape"]["expected_nonzero_pixel_count"]
bbox = [min(x for x, _ in changed), min(y for _, y in changed),
        max(x for x, _ in changed) + 1, max(y for _, y in changed) + 1]
assert bbox == spec["mask"]["shape"]["expected_nonzero_bbox_xyxy_exclusive"]
assert bbox[0] >= 178 and bbox[1] >= 505 and bbox[2] <= 280 and bbox[3] <= 670
assert all(mp[x, y] == 0 for y in range(256) for x in range(128)
           if x >= 102 or y >= 165)

output = ROOT / spec["mask"]["output_path"]
output.parent.mkdir(parents=True, exist_ok=True)
mask.save(output, format="PNG", optimize=False)
assert Image.open(output).mode == "L"

validation = {
    "task_id": spec["task_id"],
    "version": spec["version"],
    "kind": "DETERMINISTIC_CPU_PIXEL_REFERENCE_NOT_COCOS_RUNTIME",
    "status": "PASS_STATIC_PIXEL_REFERENCE",
    "decoder": "Pillow " + Image.__version__,
    "color_interpretation": "source 8-bit sRGB RGBA; no ICC transform; straight alpha; 1:1 pixel grid",
    "background_viewport_scale": "same 1024x1024 transparent canvas; preview HTML configured for one fixed dark backdrop and matched CSS scale, browser render not yet verified",
    "source_body_sha256": sha256(body_path),
    "mask_spec_sha256": spec_hash,
    "mask_path": str(output.relative_to(ROOT)),
    "mask_sha256": sha256(output),
    "mask_mode_size": "L 128x256",
    "mask_raw_bytes": 128 * 256,
    "mask_nonzero_pixels": len(changed),
    "mask_nonzero_bbox_xyxy_exclusive": bbox,
    "mask_min_max": [0, max(mp[x - 178, y - 505] for x, y in changed)],
    "strength_tests": [],
    "source_alpha_unchanged": True,
    "excluded_regions": "outside exact mask, including lantern outer contour/hook/tassel, interior lamp, right cup sign, roof and other shop pixels",
    "runtime_visual": "NOT_TESTED",
    "runtime_alpha_and_color_pipeline": "NOT_TESTED",
    "runtime_draw_calls": "NOT_TESTED",
    "runtime_cpu_gpu": "NOT_TESTED"
}
validation["preview_control_note"] = (
    "预览暂停和打断复位均停止计时并恢复强度1.0；完整循环为算法参考，"
    "不是Cocos Effect运行结果。浏览器预览须按当前HTML版本核控制行为。"
)

for strength in (1.0, 0.96, 0.90, 0.95, 0.92):
    max_rgb_delta = 0
    changed_pixels = 0
    outside_difference_count = 0
    alpha_difference_count = 0
    for y in range(1024):
        for x in range(1024):
            r, g, b, a = sp[x, y]
            m = mp[x - 178, y - 505] if 178 <= x < 306 and 505 <= y < 761 else 0
            if strength == 1.0:
                out = (r, g, b, a)
            else:
                factor = 1.0 - (1.0 - strength) * m / 255.0
                out = (round(r * factor), round(g * factor), round(b * factor), a)
            difference = max(abs(out[0] - r), abs(out[1] - g), abs(out[2] - b))
            max_rgb_delta = max(max_rgb_delta, difference)
            changed_pixels += difference > 0
            outside_difference_count += m == 0 and difference > 0
            alpha_difference_count += out[3] != a
    assert outside_difference_count == 0 and alpha_difference_count == 0
    if strength == 1.0:
        assert max_rgb_delta == 0 and changed_pixels == 0
    validation["strength_tests"].append({
        "strength": strength,
        "changed_pixel_count": changed_pixels,
        "max_rgb_channel_delta_8bit": max_rgb_delta,
        "outside_nonzero_mask_rgb_difference_count": outside_difference_count,
        "full_image_alpha_difference_count": alpha_difference_count,
        "status": "PASS_STATIC_PIXEL_REFERENCE"
    })

evidence = VERSION / "evidence/VISUAL_VALIDATION.json"
evidence.parent.mkdir(parents=True, exist_ok=True)
evidence.write_text(json.dumps(validation, ensure_ascii=False, indent=2) + "\n")

# A small same-scale visual crop for human review; numerical pass above remains
# the authority for full-image zero-difference claims. This is not engine output.
sign = Image.open(ROOT / spec["source"]["sign_path"]).convert("RGBA")
reference = Image.alpha_composite(source, sign)
dim_body = source.copy()
dp = dim_body.load()
for x, y in changed:
    r, g, b, a = sp[x, y]
    factor = 1.0 - 0.1 * mp[x - 178, y - 505] / 255.0
    dp[x, y] = (round(r * factor), round(g * factor), round(b * factor), a)
dim = Image.alpha_composite(dim_body, sign)
backdrop = Image.new("RGBA", (1024, 1024), (23, 32, 43, 255))
ref_visible = Image.alpha_composite(backdrop, reference).convert("RGB")
dim_visible = Image.alpha_composite(backdrop, dim).convert("RGB")
region = (178, 505, 280, 670)
left = ref_visible.crop(region).resize((306, 495), Image.Resampling.NEAREST)
right = dim_visible.crop(region).resize((306, 495), Image.Resampling.NEAREST)
contact = Image.new("RGB", (636, 535), (23, 32, 43))
contact.paste(left, (0, 40))
contact.paste(right, (330, 40))
draw = ImageDraw.Draw(contact)
draw.text((6, 13), "BASELINE 1.00", fill=(234, 240, 245))
draw.text((336, 13), "DIMMEST 0.90", fill=(234, 240, 245))
contact_path = VERSION / "evidence/lantern_static_contact.png"
contact.save(contact_path)
validation["static_contact_path"] = str(contact_path.relative_to(ROOT))
validation["static_contact_sha256"] = sha256(contact_path)
evidence.write_text(json.dumps(validation, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"mask": str(output), "sha256": validation["mask_sha256"],
                  "bbox": bbox, "nonzero": len(changed), "validation": str(evidence),
                  "contact": str(contact_path)},
                 ensure_ascii=False))
