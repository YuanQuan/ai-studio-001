"""Continue approved four-layer PSD with five local raster strokes.

The source PSD is read independently; legacy layer PNGs are used only as
pixel-equivalence witnesses. The bggg assembler consumes the PSD-read layers
plus original SVG-rendered transparent overlays. Four semantic exports are
then read back from the saved nine-layer PSD.
"""
from __future__ import annotations

import hashlib
import io
import json
import struct
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent
ART = ROOT.parents[2]
BASE = ART / "moonlit_psd_20261005_v2_raw"
LEGACY_PSD = BASE / "moonlit_four_layers.psd"
LEGACY_PNGS = sorted((BASE / "psd_full_canvas_layers").glob("*.png"))
OUT = ROOT.parent
PSD = OUT / "psd" / "u01_gentle_underworld_four_layers.psd"
EXPORTS = OUT / "exports"
REVIEW = OUT / "review"
LOCAL = ROOT / "local_layers"
LEGACY = ROOT / "legacy_layers_from_psd"
SIZE = (2172, 724)
SCRIPT = Path("C:/Users/admin/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py")
SHA_OLD = "428a7b1cbee4fb775d90d84401f4558f12fb93b0e3d60f57067d574ce969d6ed"

BOXES = {
    "gu01_left_flower": (920, 438, 949, 481),
    "gu01_right_flower": (1225, 438, 1254, 481),
    "gu02_bridge_carving": (1071, 441, 1112, 466),
    "gu03_waystone": (118, 427, 166, 494),
    "gu04_plaque_lettering": (2034, 253, 2093, 279),
}

def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def u(stream, fmt):
    length = struct.calcsize(">" + fmt)
    data = stream.read(length)
    if len(data) != length:
        raise ValueError("截断的 PSD")
    return struct.unpack(">" + fmt, data)

def read_raw_psd_layers(path):
    """Read raster layers written by the same BGGG PSD writer, top to bottom."""
    stream = io.BytesIO(Path(path).read_bytes())
    assert stream.read(4) == b"8BPS"
    assert u(stream, "H")[0] == 1
    stream.read(6)
    channels, h, w, depth, mode = u(stream, "HIIHH")
    assert (channels, depth, mode) == (3, 8, 3)
    for _ in range(2):
        stream.seek(u(stream, "I")[0], 1)
    mask_size = u(stream, "I")[0]
    mask_end = stream.tell() + mask_size
    info_size = u(stream, "I")[0]
    info_end = stream.tell() + info_size
    count = abs(u(stream, "h")[0])
    records = []
    for _ in range(count):
        top, left, bottom, right = u(stream, "iiii")
        nc = u(stream, "H")[0]
        channels_spec = [u(stream, "hI") for _ in range(nc)]
        assert stream.read(4) == b"8BIM"
        assert stream.read(4) == b"norm"
        opacity, clipping, flags, filler = u(stream, "BBBB")
        assert opacity == 255 and not flags & 2
        extra_size = u(stream, "I")[0]
        extra_end = stream.tell() + extra_size
        for _ in range(2):
            stream.seek(u(stream, "I")[0], 1)
        name_len = u(stream, "B")[0]
        name = stream.read(name_len).decode("macroman")
        stream.seek(-(name_len + 1) % 4, 1)
        while stream.tell() + 12 <= extra_end:
            assert stream.read(4) == b"8BIM"
            key = stream.read(4)
            n = u(stream, "I")[0]
            data = stream.read(n)
            if key == b"luni":
                letter_count = struct.unpack(">I", data[:4])[0]
                name = data[4:4 + letter_count * 2].decode("utf-16be")
            stream.seek(n % 2, 1)
        stream.seek(extra_end)
        records.append((name, (left, top, right, bottom), channels_spec))
    layers = []
    for name, (left, top, right, bottom), channel_spec in records:
        lw, lh = right - left, bottom - top
        rgba = np.zeros((lh, lw, 4), dtype=np.uint8)
        rgba[:, :, 3] = 255
        for cid, n in channel_spec:
            assert u(stream, "H")[0] == 0
            raw = stream.read(n - 2)
            assert len(raw) == lw * lh
            rgba[:, :, {-1: 3, 0: 0, 1: 1, 2: 2}[cid]] = np.frombuffer(raw, dtype=np.uint8).reshape(lh, lw)
        canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        canvas.paste(Image.fromarray(rgba, "RGBA"), (left, top))
        layers.append((name, canvas))
    assert stream.tell() <= info_end <= mask_end
    return (w, h), layers

def composite_local(base, overlay, box):
    """Only the approved ROI changes; all other RGBA pixels remain byte-equal."""
    out = base.copy()
    out.paste(Image.alpha_composite(base.crop(box), overlay.crop(box)), box[:2])
    return out

def verify_diff_box(old, new, boxes):
    a, b = np.asarray(old), np.asarray(new)
    diff = np.any(a != b, axis=2)
    allowed = np.zeros(diff.shape, dtype=bool)
    for x0, y0, x1, y1 in boxes:
        allowed[y0:y1, x0:x1] = True
    assert not np.any(diff & ~allowed), "获批范围之外出现 RGBA 差异"
    ys, xs = np.where(diff)
    return (int(xs.min()), int(ys.min()), int(xs.max()+1), int(ys.max()+1)) if len(xs) else None

def main():
    assert sha(LEGACY_PSD) == SHA_OLD
    assert len(LEGACY_PNGS) == 4
    size, old_top = read_raw_psd_layers(LEGACY_PSD)
    assert size == SIZE and len(old_top) == 4
    old = [image for _, image in reversed(old_top)]
    LEGACY.mkdir(parents=True, exist_ok=True)
    base_hashes = {}
    for i, (layer, witness) in enumerate(zip(old, LEGACY_PNGS), 1):
        assert np.array_equal(np.asarray(layer), np.asarray(Image.open(witness).convert("RGBA"))), f"旧 PSD L{i:02} 与已批导出像素不符"
        dst = LEGACY / f"l{i:02}_from_approved_psd.png"
        layer.save(dst)
        base_hashes[f"L{i:02}"] = {"source_psd_layer_name": old_top[4-i][0], "saved": str(dst), "sha256": sha(dst)}
    local = {}
    for name, box in BOXES.items():
        png = LOCAL / (name + ".png")
        image = Image.open(png).convert("RGBA")
        assert image.size == SIZE
        assert image.getchannel("A").getbbox() is not None
        assert verify_diff_box(Image.new("RGBA", SIZE), image, [box]) is not None, name
        local[name] = image
    manifest = {
        "canvas": {"width": 2172, "height": 724, "composite_background": "#000000"},
        "output": "../psd/u01_gentle_underworld_four_layers.psd",
        "preview": "../review/assembly_preview.png",
        "save_layers_dir": "psd_layers_reexport",
        "layers": [
            {"name": "L01 approved sky", "file": "legacy_layers_from_psd/l01_from_approved_psd.png", "fit": "none", "remove_background": "none"},
            {"name": "L02 approved mountains", "file": "legacy_layers_from_psd/l02_from_approved_psd.png", "fit": "none", "remove_background": "none"},
            {"name": "L03 approved ground", "file": "legacy_layers_from_psd/l03_from_approved_psd.png", "fit": "none", "remove_background": "none"},
            {"name": "GU01a original flower", "file": "local_layers/gu01_left_flower.png", "fit": "none", "remove_background": "none"},
            {"name": "GU01b original flower", "file": "local_layers/gu01_right_flower.png", "fit": "none", "remove_background": "none"},
            {"name": "GU03 original waystone", "file": "local_layers/gu03_waystone.png", "fit": "none", "remove_background": "none"},
            {"name": "GU04 original hand-lettering", "file": "local_layers/gu04_plaque_lettering.png", "fit": "none", "remove_background": "none"},
            {"name": "L04 approved foreground", "file": "legacy_layers_from_psd/l04_from_approved_psd.png", "fit": "none", "remove_background": "none"},
            {"name": "GU02 original bridge carving", "file": "local_layers/gu02_bridge_carving.png", "fit": "none", "remove_background": "none"},
        ],
    }
    manifest_path = ROOT / "assembly_manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    result = subprocess.run([str(Path(__import__("sys").executable)), str(SCRIPT), "assemble", "--manifest", str(manifest_path)], check=True, text=True, capture_output=True)
    (ROOT / "bggg_summary.json").write_text(result.stdout, encoding="utf-8")
    assert PSD.is_file()
    new_size, new_top = read_raw_psd_layers(PSD)
    assert new_size == SIZE and len(new_top) == 9
    new = [image for _, image in reversed(new_top)]
    for index in (0, 1, 2, 7):
        assert np.array_equal(np.asarray(new[index]), np.asarray(old[[0,1,2,3][(0,1,2,7).index(index)]]))
    semantic = [new[0], new[1]]
    l03 = new[2]
    for i, name in zip((3,4,5,6), ("gu01_left_flower", "gu01_right_flower", "gu03_waystone", "gu04_plaque_lettering")):
        assert np.array_equal(np.asarray(new[i]), np.asarray(local[name]))
        l03 = composite_local(l03, new[i], BOXES[name])
    l04 = composite_local(new[7], new[8], BOXES["gu02_bridge_carving"])
    semantic += [l03, l04]
    assert np.array_equal(np.asarray(new[8]), np.asarray(local["gu02_bridge_carving"]))
    EXPORTS.mkdir(parents=True, exist_ok=True)
    names = ("tex_street_base_01_l01_sky.png", "tex_street_base_01_l02_mountains.png", "tex_street_base_01_l03_ground.png", "tex_street_base_01_l04_foreground.png")
    results = {}
    for i, (a, b, filename) in enumerate(zip(old, semantic, names), 1):
        box = verify_diff_box(a, b, [] if i <= 2 else [BOXES[n] for n in (("gu01_left_flower","gu01_right_flower","gu03_waystone","gu04_plaque_lettering") if i == 3 else ("gu02_bridge_carving",))])
        if i <= 2:
            assert box is None
        dst = EXPORTS / filename
        b.save(dst)
        alpha_bbox = b.getchannel("A").getbbox()
        old_alpha = a.getchannel("A")
        assert all(np.array_equal(np.asarray(old_alpha.crop(edge)), np.asarray(b.getchannel("A").crop(edge))) for edge in [
            (0,0,1,724), (2171,0,2172,724), (0,0,2172,1), (0,723,2172,724)
        ])
        results[f"L{i:02}"] = {"file": str(dst), "sha256": sha(dst), "old_sha256": sha(LEGACY_PNGS[i-1]), "alpha_bbox": alpha_bbox, "difference_bbox": box}
    bg = Image.new("RGBA", SIZE, (0,0,0,255))
    for layer in semantic:
        bg = Image.alpha_composite(bg, layer)
    REVIEW.mkdir(parents=True, exist_ok=True)
    composite = REVIEW / "overall_from_psd.png"
    bg.convert("RGB").save(composite)
    stored = Image.open(PSD).convert("RGB")
    delta = np.abs(np.asarray(bg.convert("RGB")).astype(np.int16) - np.asarray(stored).astype(np.int16))
    # Grouping nine PSD layers into four semantic sprites changes the order
    # of integer alpha rounding by at most one channel value in local strokes.
    assert int(delta.max()) <= 1, "四张导出合成与 PSD 内嵌预览差异超出 1 通道值"
    stored.save(REVIEW / "psd_stored_preview.png")
    original = Image.open(BASE / "overall_from_psd.png").convert("RGB")
    assert verify_diff_box(original, bg.convert("RGB"), list(BOXES.values())) is not None
    report = {"approved_source_psd_sha256": SHA_OLD, "new_psd": str(PSD), "new_psd_sha256": sha(PSD), "new_psd_layer_count": 9, "source_psd_layers": base_hashes, "semantic_exports": results, "overall": {"file": str(composite), "sha256": sha(composite), "relation": "four semantic exports reassembled at full scale", "psd_stored_max_channel_delta": int(delta.max()), "psd_stored_nonidentical_channel_count": int(np.count_nonzero(delta))}}
    (ROOT / "build_validation.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"psd": str(PSD), "composite": str(composite), "layers": 9, "exports": results}, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
