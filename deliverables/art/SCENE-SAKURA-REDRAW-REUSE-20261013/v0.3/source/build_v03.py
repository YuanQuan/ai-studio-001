# -*- coding: utf-8 -*-
"""Build the v0.3 stone-chain rail from one newly generated transparent source."""
from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OLD = ROOT.parent / "v0.2"
W, H = 3072, 1024
EXPORTS = ROOT / "exports"
LAYERS = ROOT / "source/psd_full_canvas_layers"
REVIEW = ROOT / "review"
R = Image.Resampling.LANCZOS


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def full(sprite: Image.Image, x: int, y: int) -> Image.Image:
    out = Image.new("RGBA", (W,H), (0,0,0,0))
    out.alpha_composite(sprite, (x,y))
    return out


def extracted_native() -> tuple[Image.Image, Image.Image]:
    src = Image.open(ROOT / "source/native/stone_chain_native.png").convert("RGBA")
    assert src.size == (2172,724)
    # These two boxes contain only the new image's non-overlapping objects.
    post = src.crop((145,75,535,625))
    chain = src.crop((690,190,2120,535))
    for img in (post, chain):
        alpha = img.getchannel("A").point(lambda v: 0 if v < 8 else v)
        img.putalpha(alpha)
    assert post.getchannel("A").getbbox() and chain.getchannel("A").getbbox()
    post.save(ROOT / "source/native/post_extracted.png")
    chain.save(ROOT / "source/native/chain_extracted.png")
    return post, chain


def make_half() -> tuple[Image.Image, Image.Image, Image.Image, Image.Image]:
    post, chain = extracted_native()
    source = Image.open(OLD / "exports/tex_sakura_rr_street_rail_half.png").convert("RGBA")
    assert source.size == (1536,344)
    bank = source.crop((0,0,1536,113))
    alpha = bank.getchannel("A")
    # Remove the prior warm lantern/rope upper band. The lower newly drawn
    # stone bank and plants remain exactly from v0.2 except old post feet.
    for y in range(113):
        for x in range(1536):
            a = alpha.getpixel((x,y))
            if y < 68:
                a = 0
            alpha.putpixel((x,y),a)
    bank.putalpha(alpha)

    posts = Image.new("RGBA", (1536,113), (0,0,0,0))
    post_sprite = post.resize((66,91),R)
    for center in (74,435,815,1190):
        posts.alpha_composite(post_sprite, (center-33,8))

    chains = Image.new("RGBA", (1536,113), (0,0,0,0))
    centers = (74,435,815,1190)
    for a,b in zip(centers,centers[1:]):
        width = b-a-43
        span = chain.resize((width,43),R)
        chains.alpha_composite(span,(a+22,30))

    combined = bank.copy()
    combined.alpha_composite(chains)
    combined.alpha_composite(posts)
    # Full-width half is required for exact center-axis mirroring; the 231
    # transparent rows from v0.2 are now removed without moving y=730 anchor.
    return bank, chains, posts, combined


def main() -> None:
    EXPORTS.mkdir(parents=True, exist_ok=True)
    LAYERS.mkdir(parents=True, exist_ok=True)
    REVIEW.mkdir(parents=True, exist_ok=True)
    old_manifest = json.loads((OLD / "CUT_MANIFEST.json").read_text(encoding="utf-8"))
    old_exports = old_manifest["active_exports"]
    for rec in old_exports:
        if rec["path"].endswith("tex_sakura_rr_street_rail_half.png"):
            continue
        dst = ROOT / rec["path"]
        shutil.copy2(OLD / rec["path"],dst)
        assert sha(dst) == rec["sha256"]
    for rec in old_manifest["psd_layers_bottom_to_top"]:
        if rec["name"].startswith("street_rail_"):
            continue
        dst = ROOT / rec["file"]
        dst.parent.mkdir(parents=True,exist_ok=True)
        shutil.copy2(OLD / rec["file"],dst)
        assert sha(dst) == rec["sha256"]

    bank, chains, posts, combined = make_half()
    for name, part in (("rail_bank_half",bank),("chain_instances_half",chains),("stone_posts_half",posts)):
        part.save(ROOT / "source/native" / f"{name}.png")
    rail_path = EXPORTS / "tex_sakura_rr_street_rail_half.png"
    combined.save(rail_path)
    new_layers = []
    for side in ("l","r"):
        sprite = combined if side == "l" else ImageOps.mirror(combined)
        placed = full(sprite,0 if side=="l" else 1536,730)
        name = f"stone_chain_rail_{side}"
        path = LAYERS / f"{name}.png"
        placed.save(path)
        new_layers.append({"name":name,"file":str(path.relative_to(ROOT)),"sha256":sha(path)})
    prior_layers = old_manifest["psd_layers_bottom_to_top"]
    assert prior_layers[17]["name"] == "street_rail_l" and prior_layers[18]["name"] == "street_rail_r"
    layers = prior_layers[:17] + new_layers + prior_layers[19:]
    assert len(layers) == 43
    # Runtime stays one combined rail texture, two mirrored placements.
    instances = old_manifest["instances_bottom_to_top"]
    assert instances[17]["asset"] == rail_path.name and instances[18]["asset"] == rail_path.name
    scene = Image.new("RGBA",(W,H),(0,0,0,0))
    for rec in layers:
        scene.alpha_composite(Image.open(ROOT / rec["file"]).convert("RGBA"))
    scene.convert("RGB").save(REVIEW / "scene_environment.png")
    rebuilt = Image.new("RGBA",(W,H),(0,0,0,0))
    for rec in instances:
        sprite = Image.open(EXPORTS / rec["asset"]).convert("RGBA")
        if "width" in rec:
            sprite = sprite.resize((rec["width"],rec["height"]),R)
        if rec.get("mirror"):
            sprite = ImageOps.mirror(sprite)
        rebuilt.alpha_composite(sprite,(rec["x"],rec["y"]))
    rebuilt.save(REVIEW / "reassembled_from_exports.png")
    assert np.array_equal(np.asarray(scene),np.asarray(rebuilt))
    old_rebuilt = Image.open(OLD / "review/reassembled_from_exports.png").convert("RGBA")
    diff = np.any(np.asarray(scene) != np.asarray(old_rebuilt),axis=2)
    allowed = np.zeros((H,W),dtype=bool)
    allowed[730:843,0:1285] = True
    allowed[730:843,1787:3072] = True
    changed = int(diff.sum())
    outside = int((diff & ~allowed).sum())
    assert outside == 0, outside
    exports = [{"path":rec["path"],"sha256":sha(ROOT/rec["path"]),"size":list(Image.open(ROOT/rec["path"]).size)} for rec in old_exports]
    out = {
        "task":old_manifest["task"],"version":"v0.3","canvas":[W,H],
        "baseline_scene_sha256":sha(OLD/"review/scene_environment.png"),
        "new_native_source_sha256":sha(ROOT/"source/native/stone_chain_native.png"),
        "active_exports":exports,"instances_bottom_to_top":instances,"psd_layers_bottom_to_top":layers,
        "no_shop_layers_or_exports":True,
        "allowed_full_canvas_rects_xyxy_half_open":[[0,730,1285,843],[1787,730,3072,843]],
        "changed_rgba_pixels":changed,"outside_roi_changed_rgba_pixels":outside,
        "unmodified_v0_2_export_count":17,
        "replaced_export":"exports/tex_sakura_rr_street_rail_half.png",
        "scene_sha256":sha(REVIEW/"scene_environment.png"),
        "reassembly_sha256":sha(REVIEW/"reassembled_from_exports.png"),
        "prototypes_from_generated_source":{"post":"source/native/post_extracted.png","chain":"source/native/chain_extracted.png"},
        "editable_component_sources":["source/native/rail_bank_half.png","source/native/chain_instances_half.png","source/native/stone_posts_half.png"],
    }
    (ROOT/"CUT_MANIFEST.json").write_text(json.dumps(out,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    psd_manifest = {
        "canvas":{"width":W,"height":H,"composite_background":"#15173b"},
        "output":"source/scene_sakura_reuse_master.psd","preview":"review/scene_psd_preview.png",
        "layers":[{"name":r["name"],"file":r["file"],"fit":"none","remove_background":"none"} for r in layers],
    }
    (ROOT/"PSD_MANIFEST.json").write_text(json.dumps(psd_manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"layers":len(layers),"exports":len(exports),"changed":changed,"outside":outside,"scene":out["scene_sha256"],"rail_size":list(combined.size)},ensure_ascii=False))


if __name__ == "__main__":
    main()
