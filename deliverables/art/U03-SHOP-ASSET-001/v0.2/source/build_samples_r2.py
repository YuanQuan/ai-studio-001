"""R2: preserve approved 01/02 layouts while splitting sign objects and fixing 糖 provenance."""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

import build_samples_v02 as base

ROOT = base.ROOT
OLD = base.OLD
base.PRE = ROOT / "preview/sign_revision_v02_r2"
base.EXP = ROOT / "exports/sign_revision_v02_r2"
base.WORK = ROOT / "source/psd_work_r2"
for d in (base.PRE, base.EXP, base.WORK):
    d.mkdir(parents=True, exist_ok=True)

REFERENCE = Image.open(OLD / "preview/mixed_signs_v04/six_shop_mixed_signs_overview.png").convert("RGBA")


def source_piece(source: Image.Image, mask: Image.Image, target_wh: tuple[int,int], xy: tuple[int,int]) -> Image.Image:
    pix = source.copy()
    bright = np.asarray(source.convert("RGB"), dtype=np.uint8).max(axis=2).astype(np.float32)
    black_alpha = np.clip((bright-7)/20,0,1)
    alpha = (np.array(mask,dtype=np.float32)*black_alpha).astype(np.uint8)
    pix.putalpha(Image.fromarray(alpha,"L"))
    pix = pix.resize(target_wh,Image.Resampling.LANCZOS)
    full = base.empty()
    full.alpha_composite(pix,xy)
    return full


def build_01_sign(layers: Path) -> Image.Image:
    # First resample the approved sign exactly once. Partition those exact
    # pixels afterward to avoid resampling seams between raster layers.
    whole=base.make_01_sign()
    pix=np.asarray(whole,dtype=np.uint8)
    logo_m=Image.new("L",(61,98),0)
    ImageDraw.Draw(logo_m).polygon([(23,23),(42,22),(55,31),(56,51),(52,76),(45,90),(9,90),(5,70),(6,45),(13,30)],fill=255)
    logo_full=Image.new("L",(1024,1024),0)
    logo_full.paste(logo_m.resize((122,196),Image.Resampling.NEAREST),(821,455))
    hardware_m=Image.new("L",(61,98),0)
    hd=ImageDraw.Draw(hardware_m)
    hd.rounded_rectangle((13,0,18,18),radius=2,fill=255)
    hd.rounded_rectangle((43,0,48,18),radius=2,fill=255)
    hardware_full=Image.new("L",(1024,1024),0)
    hardware_full.paste(hardware_m.resize((122,196),Image.Resampling.NEAREST),(821,455))
    ImageDraw.Draw(hardware_full).rectangle((822,449,923,463),fill=255)
    lmask=np.asarray(logo_full)>127
    hmask=(np.asarray(hardware_full)>127)&~lmask
    bmask=~lmask&~hmask
    def partition(mask: np.ndarray) -> Image.Image:
        part=pix.copy();part[~mask]=0
        return Image.fromarray(part,"RGBA")
    hardware=partition(hmask)
    board=partition(bmask)
    logo=partition(lmask)
    hardware.save(layers/"sign_hardware_new.png")
    board.save(layers/"sign_board_new.png")
    logo.save(layers/"sign_logo_new.png")
    check=base.empty()
    for part in (hardware,board,logo):check.alpha_composite(part)
    assert np.array_equal(np.asarray(check),np.asarray(whole)), "01 split changed sign pixels"
    return whole


def official_old_glyph() -> Image.Image:
    old = Image.open(OLD/"source/psd_work/shop_02/zcool_b92_v03/layer_sources/sign_glyph.png").convert("RGBA")
    first = old.crop((800,465,925,585))
    box=first.getchannel("A").getbbox()
    assert box is not None
    first=first.crop(box)
    arr=np.array(first,dtype=np.uint8)
    src=arr[:,:,:3].astype(np.float32)
    # Color treatment on the already-approved glyph bitmap; the contour and
    # antialias are inherited, with no new font rasterization.
    arr[:,:,0]=np.clip(src[:,:,0]*.56+105,0,255).astype(np.uint8)
    arr[:,:,1]=np.clip(src[:,:,1]*.65+48,0,255).astype(np.uint8)
    arr[:,:,2]=np.clip(src[:,:,2]*.38+12,0,255).astype(np.uint8)
    return Image.fromarray(arr,"RGBA").resize((93,94),Image.Resampling.LANCZOS)


def build_02_sign(layers: Path) -> Image.Image:
    ref=REFERENCE.crop((765,309,829,435))
    wh=ref.size
    board_m=Image.new("L",wh,0)
    d=ImageDraw.Draw(board_m)
    d.rounded_rectangle((1,4,63,115),radius=5,fill=255)
    d.polygon([(5,111),(17,111),(16,126),(4,126)],fill=255)
    d.polygon([(48,111),(60,111),(61,126),(49,126)],fill=255)
    # Reconstruct the small blank brown panel interior using its unaffected
    # left/right border-adjacent colors, removing AI-preview lettering.
    panel=np.asarray(ref,dtype=np.uint8).copy()
    for y in range(15,111):
        left=panel[y,10,:3].astype(np.float32)
        right=panel[y,55,:3].astype(np.float32)
        for x in range(12,54):
            t=(x-12)/41
            panel[y,x,:3]=np.clip(left*(1-t)+right*t,0,255).astype(np.uint8)
    board=source_piece(Image.fromarray(panel,"RGBA"),board_m,(135,266),(685,624))
    # Spoon and syrup are the user-approved graphic only, with hand-traced
    # object masks; generated text is excluded from this layer.
    spoon_m=Image.new("L",wh,0)
    d=ImageDraw.Draw(spoon_m)
    d.polygon([(39,11),(47,14),(34,34),(29,31)],fill=255)
    d.ellipse((17,28,43,53),fill=255)
    d.polygon([(26,47),(32,47),(32,81),(29,86),(27,81)],fill=255)
    spoon=source_piece(ref,spoon_m,(135,266),(685,624))
    glyph=base.empty()
    glyph.alpha_composite(official_old_glyph(),(706,765))
    board.save(layers/"sign_board_new.png")
    spoon.save(layers/"sign_spoon_syrup_new.png")
    glyph.save(layers/"sign_glyph_reused_sugar.png")
    whole=base.empty()
    for part in (board,spoon,glyph):whole.alpha_composite(part)
    return whole


def main() -> None:
    base.check_gate()
    l1=base.layer_dir(1,"full_redraw_v04")
    body1,_,repair=base.repair_01(l1)
    sign1=build_01_sign(l1)
    d1=base.compose_psd(1,l1,["ground_contact","body_facade","body_roof","interior","light","front","body_repair_01"],
                        ["sign_hardware_new","sign_board_new","sign_logo_new"],body1,sign1,"milk_tea_r2")
    d1["repair"]=repair
    l2=base.layer_dir(2,"zcool_b92_v03")
    body2=base.empty()
    for name in ("umbrella","operating_objects","light","ground_contact"):
        body2.alpha_composite(Image.open(l2/f"{name}.png").convert("RGBA"))
    sign2=build_02_sign(l2)
    d2=base.compose_psd(2,l2,["umbrella","operating_objects","light","ground_contact"],
                        ["sign_board_new","sign_spoon_syrup_new","sign_glyph_reused_sugar"],body2,sign2,"sugar_art_r2")
    report={"batch":"U03-SHOP-SIGN-REVISION-V02","revision":"r2","samples":{"shop_01":d1,"shop_02":d2},
            "font_note":"02 糖轮廓来自旧正式 PSD sign_glyph，未从生成式方向图取文字；01 图案来自授权方向图并分层。"}
    (ROOT/"SAMPLE_BUILD_REPORT_V02_R2.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=="__main__":main()
