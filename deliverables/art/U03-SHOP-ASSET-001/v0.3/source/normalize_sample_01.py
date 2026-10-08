"""Normalize approved small reference and imagegen 01 source to one 1024 canvas.

Reference black removal is for visual comparison only; it is never a formal cut.
"""
from pathlib import Path
import json
import sys
import numpy as np
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
PRE=ROOT/"preview/shop_01_sample"
PRE.mkdir(parents=True,exist_ok=True)
BG=(24,43,79,255)

def background(im):
    panel=Image.new("RGBA",(1024,1024),BG)
    panel.alpha_composite(im)
    return panel.convert("RGB")

def target():
    src=Image.open(ROOT/"source/reference/shop_01_target_crop.png").convert("RGB").crop((0,0,450,445))
    a=np.array(src,dtype=np.uint8)
    bright=a.max(axis=2).astype(np.float32)
    opacity=np.clip((bright-8)/24,0,1)
    rgba=np.dstack([a,(opacity*255).astype(np.uint8)])
    rgba=Image.fromarray(rgba,"RGBA")
    scale=799/371
    resized=rgba.resize((round(450*scale),round(445*scale)),Image.Resampling.LANCZOS)
    full=Image.new("RGBA",(1024,1024))
    full.alpha_composite(resized,(round(112-56*scale),round(258-109*scale)))
    full.save(PRE/"target_01_normalized_comparison_only.png")
    return full

def rebuilt(revision):
    src=Image.open(ROOT/f"source/imagegen/shop_01_full_{revision}.png").convert("RGBA")
    a=np.array(src,dtype=np.uint8)
    a[:,:,3]=np.where(a[:,:,3]>=16,a[:,:,3],0)
    src=Image.fromarray(a,"RGBA")
    solid=Image.fromarray((a[:,:,3]>=32).astype(np.uint8)*255,"L")
    x0,y0,x1,y1=solid.getbbox()
    scale=799/(x1-x0)
    resized=src.resize((round(src.width*scale),round(src.height*scale)),Image.Resampling.LANCZOS)
    full=Image.new("RGBA",(1024,1024))
    full.alpha_composite(resized,(round(112-x0*scale),round(900-y1*scale)))
    full.save(PRE/f"shop_01_{revision}_normalized_source.png")
    return full,(x0,y0,x1,y1)

def main():
    revision=sys.argv[1] if len(sys.argv)>1 else "r1"
    tgt=target();new,raw_bbox=rebuilt(revision)
    old=Image.open(ROOT.parent/"v0.2/preview/sign_revision_v02_final/shop_01_recomposed.png").convert("RGBA")
    panels=[background(x) for x in (tgt,old,new)]
    sheet=Image.new("RGB",(3072,1024))
    for i,panel in enumerate(panels):sheet.paste(panel,(i*1024,0))
    sheet.save(PRE/f"shop_01_target_v02_v03_same_canvas_{revision}.png")
    report={"reference_crop_xyxy":[0,0,462,459],"reference_opaque_bbox_xyxy":[56,109,427,407],
            "reference_target_normalized_bbox_xyxy":[112,258,911,900],"imagegen_raw_size":[1254,1254],
            "imagegen_alpha32_bbox_xyxy":raw_bbox,"imagegen_normalized_alpha32_bbox_approx_xyxy":[112,252,911,900],
            "foot_px":[512,900],"comparison_background":"#182B4F",
            "reference_alpha_note":"黑底亮度抠像仅供目视对照；暗线可能被削弱，不作为正式纹理/精确 alpha 证据。"}
    (PRE/f"NORMALIZATION_REPORT_{revision.upper()}.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps(report,ensure_ascii=False))

if __name__=="__main__":main()
