"""Build faithful 01 sample as real layered PSD and body/sign slices.

All visible layers are an exclusive semantic partition of the normalized
high-resolution imagegen render. Hidden backside pixels are not invented.
"""
from __future__ import annotations

import hashlib
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/"preview/shop_01_sample/shop_01_r2_normalized_source.png"
WORK=ROOT/"source/shop_01_psd_work"
LAYER=WORK/"layer_sources"
PRE=ROOT/"preview/shop_01_sample"
PSD=ROOT/"psd"
EXP=ROOT/"exports/shop_01_sample"
for p in (WORK,LAYER,PRE,PSD,EXP):p.mkdir(parents=True,exist_ok=True)
SKILL=Path("C:/Users/admin/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py")
FINALIZE=ROOT.parent/"v0.1/source/shop_01/finalize_psd_visibility.py"

def sha(path:Path):return hashlib.sha256(path.read_bytes()).hexdigest().upper()
def rgba(path:Path):return Image.open(path).convert("RGBA")

def gate():
    plan=sha(ROOT/"PRODUCTION_PLAN.md")
    anchor=sha(ROOT/"VISUAL_ANCHORS.md")
    assert plan=="2830BC2DFEAD18A37952E46E1D87AD426097186F67D54858EBDBD2EB5615026E"
    assert anchor=="98FD35F7D35ABBB886C11FC8FECBE4CC12B737478BAB3E3B7F764B2CDB67EA53"
    ap=json.loads(Path("tasks/U03-SHOP-VISUAL-FIDELITY-003/ARTIFACT_APPROVAL_GATE1.json").read_text(encoding="utf-8"))
    tech=json.loads(Path("deliverables/tech_lead/U03-SHOP-VISUAL-FIDELITY-003/v0.1/TECH_PRODUCTION_PRESIGN.json").read_text(encoding="utf-8"))
    art=json.loads((ROOT/"ART_PRODUCTION_PRESIGN.json").read_text(encoding="utf-8"))
    assert ap["status"]=="USER_APPROVED"
    assert tech["decision"]=="PRESIGNED_FOR_SHOP_01_SAMPLE" and art["decision"]=="PRESIGNED_FOR_SHOP_01_SAMPLE"
    assert tech["input_sha256"]["PRODUCTION_PLAN.md"]==plan
    assert art["input_hashes_sha256"]["VISUAL_ANCHORS.md"]==anchor

def mask_ellipse(x0,y0,x1,y1):
    m=Image.new("L",(1024,1024),0)
    ImageDraw.Draw(m).ellipse((x0,y0,x1,y1),fill=255)
    return np.asarray(m)>0

def part(src:np.ndarray,match:np.ndarray,name:str):
    a=src.copy();a[~match]=0
    Image.fromarray(a,"RGBA").save(LAYER/f"{name}.png")

def view(im:Image.Image,width:int,height:int,display:int,foot_y:int):
    bg=Image.new("RGBA",(width,height),(24,43,79,255))
    bg.alpha_composite(im.resize((display,display),Image.Resampling.LANCZOS),((width-display)//2,foot_y-round(900*display/1024)))
    return bg.convert("RGB")

def main():
    gate()
    image=rgba(SRC)
    pix=np.array(image,dtype=np.uint8)
    pix[pix[:,:,3]<8]=0
    pix[900:,:,:]=0
    src=Image.fromarray(pix,"RGBA")
    src.save(WORK/"shop_01_complete_r2_normalized.png")
    yy,xx=np.indices((1024,1024))
    opaque=pix[:,:,3]>0
    labels=np.full((1024,1024),"body_structure",dtype="<U32")
    # Body semantics. This is a visible-pixel split, not a completed backside.
    roof=opaque&(yy<=482)&(xx>=105)&(xx<=889)
    labels[roof]="roof"
    curtain=opaque&(xx>=275)&(xx<=731)&(yy>=496)&(yy<=577)
    labels[curtain]="curtain"
    lantern=opaque&(xx>=145)&(xx<=231)&(yy>=478)&(yy<=650)
    labels[lantern]="left_lantern_light"
    interior=opaque&(xx>=278)&(xx<=733)&(yy>=577)&(yy<752)
    labels[interior]="interior_objects"
    plants=opaque&(yy>=712)&(((xx>=120)&(xx<=260))|((xx>=732)&(xx<=870)))
    labels[plants]="plants_ground"
    front=opaque&(yy>=752)&(xx>=240)&(xx<=790)
    labels[front]="front_counter"
    # Keep the rail, chains and board together as sign pixels. The logo is a
    # separately movable raster subregion, retaining the reference's cream
    # plate pixels inside its rectangle; editing it can reveal an empty hole.
    rail=opaque&(xx>=760)&(xx<=914)&(yy>=479)&(yy<=522)
    chains=opaque&(xx>=813)&(xx<=891)&(yy>=520)&(yy<=556)
    board=opaque&(xx>=784)&(xx<=915)&(yy>=540)&(yy<=717)
    labels[rail|chains]="sign_hardware"
    labels[board]="sign_board"
    logo=opaque&(xx>=803)&(xx<=898)&(yy>=574)&(yy<=701)
    labels[logo]="sign_logo"
    body_names=["body_structure","roof","curtain","left_lantern_light","interior_objects","plants_ground","front_counter"]
    sign_names=["sign_hardware","sign_board","sign_logo"]
    for name in body_names+sign_names:part(pix,opaque&(labels==name),name)
    (LAYER/"reference_source.png").write_bytes((WORK/"shop_01_complete_r2_normalized.png").read_bytes())
    body=Image.new("RGBA",(1024,1024));sign=Image.new("RGBA",(1024,1024))
    for name in body_names:body.alpha_composite(rgba(LAYER/f"{name}.png"))
    for name in sign_names:sign.alpha_composite(rgba(LAYER/f"{name}.png"))
    combined=body.copy();combined.alpha_composite(sign)
    colored=lambda im:view(im,1024,1024,1024,900)
    rgbdiff=np.asarray(colored(combined),dtype=np.int16)-np.asarray(colored(src),dtype=np.int16)
    assert np.max(np.abs(rgbdiff))<=1,int(np.max(np.abs(rgbdiff)))
    body_file=EXP/"tex_u03_shop_01_body_sample_v03.png"
    sign_file=EXP/"tex_u03_shop_01_sign_sample_v03.png"
    body.save(body_file);sign.save(sign_file)
    rec=PRE/"shop_01_psd_recomposed_r2.png";combined.save(rec)
    manifest={"canvas":{"width":1024,"height":1024,"composite_background":"#182B4F"},
              "layers":[{"name":name,"file":f"layer_sources/{name}.png","remove_background":"none","fit":"none"}
                        for name in ["reference_source",*body_names,*sign_names]]}
    mf=WORK/"manifest.json";mf.write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding="utf-8")
    psd_file=PSD/"shop_01_milk_tea_faithful_sample_v03.psd"
    flat=PRE/"shop_01_psd_flat_r2.png"
    subprocess.run([sys.executable,str(SKILL),"assemble","--manifest",str(mf),"--output",str(psd_file),"--preview",str(flat)],check=True,capture_output=True,text=True)
    colored(combined).save(flat)
    visibility=WORK/"PSD_VISIBILITY_REPORT.json"
    subprocess.run([sys.executable,str(FINALIZE),"--psd",str(psd_file),"--composite-from",str(flat),"--manifest",str(mf),"--report",str(visibility)],check=True,capture_output=True,text=True)
    with Image.open(psd_file) as test:assert test.size==(1024,1024)
    for width,height,display,foot in ((390,844,316,530),(720,1280,584,800)):
        for label,im in (("target",rgba(PRE/"target_01_normalized_comparison_only.png")),("v02",rgba(ROOT.parent/"v0.2/preview/sign_revision_v02_final/shop_01_recomposed.png")),("v03",combined)):
            view(im,width,height,display,foot).save(PRE/f"shop_01_{label}_{width}x{height}.png")
        sheet=Image.new("RGB",(width*3,height),(24,43,79))
        for i,label in enumerate(("target","v02","v03")):
            with Image.open(PRE/f"shop_01_{label}_{width}x{height}.png") as v:sheet.paste(v,(i*width,0))
        sheet.save(PRE/f"shop_01_target_v02_v03_{width}x{height}_r2.png")
    report={"batch_id":"U03-SHOP-FAITHFUL-REDRAW-V03","sample":"shop_01","revision":"r2",
            "psd":{"path":str(psd_file.relative_to(ROOT)),"sha256":sha(psd_file)},
            "body":{"path":str(body_file.relative_to(ROOT)),"sha256":sha(body_file),"bbox":body.getchannel("A").getbbox()},
            "sign":{"path":str(sign_file.relative_to(ROOT)),"sha256":sha(sign_file),"bbox":sign.getchannel("A").getbbox()},
            "recomposition":{"path":str(rec.relative_to(ROOT)),"sha256":sha(rec)},
            "layers_bottom_to_top":["reference_source",*body_names,*sign_names],
            "flattened_source_sha256":sha(WORK/"shop_01_complete_r2_normalized.png"),
            "visible_rgb_max_abs_difference":int(np.max(np.abs(rgbdiff))),
            "editability_limit":"visible-pixel semantic cut; hidden backside of sign and other overlaps is not complete",
            "alpha_limit":"low alpha under 8 removed; imagegen near-edge colors may retain subtle chromatic fringing"}
    (ROOT/"SAMPLE_BUILD_REPORT.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=="__main__":main()
