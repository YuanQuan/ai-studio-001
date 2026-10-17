"""在首产零差后制作用户审阅缩略图与同场景静态投影。"""

from pathlib import Path
import json
import hashlib

import numpy as np
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[4]
BASE = Path(__file__).resolve().parent
SCENE = ROOT / "deliverables/art/SCENE-SAKURA-REDRAW-REUSE-20261013/v0.3"


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def vis_equal(a: Image.Image, b: Image.Image) -> bool:
    aa = np.asarray(a.convert("RGBA")).copy()
    bb = np.asarray(b.convert("RGBA")).copy()
    aa[aa[:, :, 3] == 0, :3] = 0
    bb[bb[:, :, 3] == 0, :3] = 0
    return np.array_equal(aa, bb)


def src_and_rebuilt(stem: str) -> tuple[Image.Image, Image.Image]:
    a = Image.open(BASE / f"source/originals/{stem}.png").convert("RGBA")
    b = Image.open(BASE / f"review/recompositions/{stem}.png").convert("RGBA")
    assert vis_equal(a, b), stem
    return a, b


def main() -> None:
    manifest = json.loads((BASE / "CUT_MANIFEST.json").read_text())
    items = manifest["assets"]
    report_path = BASE / "review/COMPARISON_REPORT.json"
    report = json.loads(report_path.read_text())

    # 源店体+招牌与新PSD层恢复画布后的对应两件同原点重合。
    sb, nb = src_and_rebuilt("tex_mt_shop_01_body")
    ss, ns = src_and_rebuilt("tex_mt_shop_01_sign")
    old_shop = sb.copy(); old_shop.alpha_composite(ss)
    new_shop = nb.copy(); new_shop.alpha_composite(ns)
    assert vis_equal(old_shop, new_shop)
    approved_shop = Image.open(ROOT / "deliverables/art/U03-SHOP-FULL-REDRAW-20261009/v0.1/preview/shop_01_recomposed.png").convert("RGBA")
    # 原批准预览可能带不透明底，其尺寸/来源供视觉旁证；零差主基准为当前两张RGBA源。
    shop_out = BASE / "review/shop_01_body_sign_recomposition.png"
    new_shop.save(shop_out)
    report["shop_body_sign"] = {
        "original_canvas": [1024, 1024],
        "source_vs_new_visible_rgba_equal": True,
        "approved_preview_path": str((ROOT / "deliverables/art/U03-SHOP-FULL-REDRAW-20261009/v0.1/preview/shop_01_recomposed.png").relative_to(ROOT)),
        "approved_preview_size": list(approved_shop.size),
        "output": str(shop_out.relative_to(ROOT)), "sha256": sha(shop_out),
    }

    # 只用获批樱花 v0.3 实际PSD全画布层构造相同静态背景，去掉其中4个A火焰层。
    scene_manifest = json.loads((SCENE / "PSD_MANIFEST.json").read_text())
    bg = Image.new("RGBA", (3072, 1024), (0, 0, 0, 0))
    skipped = []
    for layer in scene_manifest["layers"]:
        if layer["name"].startswith("spirit_a_flame_instance_"):
            skipped.append(layer["name"])
            continue
        im = Image.open(SCENE / layer["file"]).convert("RGBA")
        assert im.size == bg.size
        bg.alpha_composite(im)
    flame_old, flame_new = src_and_rebuilt("tex_sakura_rr_spirit_a_flame")
    cut = json.loads((SCENE / "CUT_MANIFEST.json").read_text())
    placements = [x for x in cut["instances_bottom_to_top"] if x.get("asset") == "tex_sakura_rr_spirit_a_flame.png"]
    assert len(placements) == 7 and len(skipped) == 4
    scene_old, scene_new = bg.copy(), bg.copy()
    for inst in placements:
        pos = int(inst["x"]), int(inst["y"])
        size = int(inst["width"]), int(inst["height"])
        scene_old.alpha_composite(flame_old.resize(size, Image.Resampling.LANCZOS), pos)
        scene_new.alpha_composite(flame_new.resize(size, Image.Resampling.LANCZOS), pos)
    assert vis_equal(scene_old, scene_new)
    scene_old_path = BASE / "review/scene_flame_same_scale_source.png"
    scene_new_path = BASE / "review/scene_flame_same_scale_new.png"
    scene_old.save(scene_old_path); scene_new.save(scene_new_path)
    # 450,840 的获批实例、莲座、水面及道路在同一个视窗ROI内；仅供审阅展示。
    roi = (350, 650, 950, 1024)
    detail = Image.new("RGBA", (1200, 374))
    detail.paste(scene_old.crop(roi), (0,0)); detail.paste(scene_new.crop(roi), (600,0))
    detail_path = BASE / "review/scene_flame_detail_source_vs_new.png"
    detail.save(detail_path)
    report["scene_flame_static_projection"] = {
        "background_source": str((SCENE / "PSD_MANIFEST.json").relative_to(ROOT)),
        "background_layers": 39,
        "excluded_original_flame_layers": skipped,
        "placements": placements,
        "source_vs_new_visible_rgba_equal": True,
        "source_projection": str(scene_old_path.relative_to(ROOT)),
        "new_projection": str(scene_new_path.relative_to(ROOT)),
        "detail_pair": str(detail_path.relative_to(ROOT)),
        "detail_roi": list(roi),
        "limits": "PSD层构成的同背景静态投影；160源像素按既有v0.3实例尺寸经同一LANCZOS路径缩放，仅审阅图缩放，裁片未缩放。非Creator实际运行。"
    }

    # 10件切片缩略图 + 店体/招牌重组图。接触表缩放仅用于看图，正式切片仍原像素。
    names = [e["inventory_key"] for e in items] + ["shop_01_body_sign_recomposition"]
    images = [Image.open(BASE / e["output_path"].split("/v0.1/")[-1]).convert("RGBA") for e in items] + [new_shop]
    cell_w, cell_h, cols = 500, 440, 3
    rows = (len(images) + cols - 1) // cols
    sheet = Image.new("RGB", (cell_w * cols, cell_h * rows), (27, 32, 54))
    draw = ImageDraw.Draw(sheet)
    for i, (name, im) in enumerate(zip(names, images)):
        cx, cy = (i % cols) * cell_w, (i // cols) * cell_h
        draw.rectangle((cx+10,cy+10,cx+cell_w-10,cy+cell_h-10), fill=(67, 72, 89), outline=(160, 170, 195), width=2)
        scale = min(450/im.width, 355/im.height, 1.0)
        show = im.resize((max(1,round(im.width*scale)),max(1,round(im.height*scale))),Image.Resampling.LANCZOS)
        sheet.paste(show, (cx+(cell_w-show.width)//2,cy+20+(355-show.height)//2), show)
        draw.text((cx+18,cy+385), name, fill=(255,255,255))
        draw.text((cx+18,cy+407), f"{im.width}x{im.height}", fill=(205,214,235))
    contact = BASE / "review/contact_sheet.png"
    sheet.save(contact)
    report["contact_sheet"] = {"path":str(contact.relative_to(ROOT)),"sha256":sha(contact),"note":"仅审阅缩略图使用LANCZOS缩放；正式PNG原像素。"}
    report_path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n")
    print(json.dumps({"contact_sheet":str(contact.relative_to(ROOT)),"scene_static_equal":True,"shop_rgba_equal":True},ensure_ascii=False))


if __name__ == "__main__": main()
