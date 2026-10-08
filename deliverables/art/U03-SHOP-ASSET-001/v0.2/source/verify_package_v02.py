"""Verify real PSD/cut files and produce one overview, one cut sheet and static views."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

ROOT=Path(__file__).resolve().parents[1]
OLD=ROOT.parent/"v0.1"
BUILD=json.loads((ROOT/"FULL_BUILD_REPORT_V02.json").read_text(encoding="utf-8"))["shops"]
BASE=json.loads((OLD/"SIX_SHOP_GATE2_CANDIDATE_MANIFEST_V04.json").read_text(encoding="utf-8"))["shops"]
PRE=ROOT/"preview/sign_revision_v02_final"

def sha(p:Path)->str:return hashlib.sha256(p.read_bytes()).hexdigest().upper()
def rgba(p:Path):return Image.open(p).convert("RGBA")
def ref(path:Path):return {"path":str(path.relative_to(ROOT)).replace("\\","/"),"sha256":sha(path)}
def view(image:Image.Image,width:int,height:int,display:int,foot_y:int)->Image.Image:
    bg=Image.new("RGBA",(width,height),(22,45,82,255))
    scaled=image.resize((display,display),Image.Resampling.LANCZOS)
    bg.alpha_composite(scaled,((width-display)//2,foot_y-round(900*display/1024)))
    return bg.convert("RGB")

def checker(size):
    bg=Image.new("RGBA",size,(206,209,215,255));d=ImageDraw.Draw(bg)
    for y in range(0,size[1],16):
        for x in range(0,size[0],16):
            if (x//16+y//16)%2==0:d.rectangle((x,y,x+15,y+15),fill=(240,241,244,255))
    return bg

def main():
    manifest={"batch_id":"U03-SHOP-SIGN-REVISION-V02","status":"GATE2_USER_REVIEW_CANDIDATE","canvas_px":[1024,1024],"foot_px":[512,900],
              "slice_contract":"全画布RGBA body/sign各一片；同画布原点叠合；未获Gate2用户批准不得替换Client正式贴图","shops":{}}
    diffs={"batch_id":manifest["batch_id"],"shops":{}}
    overview=Image.new("RGBA",(1536,1024),(24,43,79,255))
    cuts=Image.new("RGBA",(512,1536),(24,43,79,255))
    d=ImageDraw.Draw(cuts)
    for num in range(1,7):
        key=f"shop_{num:02d}";record=BUILD[key];old=BASE[key]
        psd=ROOT/record["psd"];body=ROOT/record["body"];sign=ROOT/record["sign"]
        for p in (psd,body,sign):assert p.exists(),p
        assert (sha(psd),sha(body),sha(sign))==(record["psd_sha256"],record["body_sha256"],record["sign_sha256"])
        with Image.open(psd) as test:assert test.size==(1024,1024)
        bi,si=rgba(body),rgba(sign)
        assert bi.size==si.size==(1024,1024)
        composite=bi.copy();composite.alpha_composite(si)
        rec=ROOT/record["recomposition"]
        assert np.array_equal(np.asarray(composite),np.asarray(rgba(rec)))
        assert sha(rec)==record["recomposition_sha256"]
        old_bi=rgba(OLD/old["body"]["path"]);old_si=rgba(OLD/old["sign"]["path"])
        old_rec=old_bi.copy();old_rec.alpha_composite(old_si)
        changed=np.any(np.asarray(old_rec)!=np.asarray(composite),axis=2)
        allowed=(np.asarray(old_si.getchannel("A"))>0)|(np.asarray(si.getchannel("A"))>0)
        if num==1:allowed[470:591,346:678]=True
        outside=int(np.count_nonzero(changed&~allowed));assert outside==0,(key,outside)
        body_identical=body.read_bytes()==(OLD/old["body"]["path"]).read_bytes()
        sign_identical=sign.read_bytes()==(OLD/old["sign"]["path"]).read_bytes()
        psd_identical=psd.read_bytes()==(OLD/old["psd"]["path"]).read_bytes()
        if num in (2,3,4,5,6):assert body_identical,key
        if num in (5,6):assert sign_identical and psd_identical,key
        views=[]
        for width,height,display,foot in ((390,844,316,530),(720,1280,584,800)):
            vp=PRE/f"{key}_{width}x{height}.png";view(composite,width,height,display,foot).save(vp)
            views.append({**ref(vp),"canvas_px":[width,height],"display_px":display,"foot_y_px":foot})
        mini=composite.resize((512,512),Image.Resampling.LANCZOS)
        overview.alpha_composite(mini,(((num-1)%3)*512,((num-1)//3)*512))
        for col,part in enumerate((bi,si)):
            cell=checker((256,256));cell.alpha_composite(part.resize((256,256),Image.Resampling.LANCZOS))
            cuts.alpha_composite(cell,(col*256,(num-1)*256))
        d.text((6,(num-1)*256+4),f"{key} BODY",fill=(255,255,255,255))
        d.text((262,(num-1)*256+4),f"{key} SIGN",fill=(255,255,255,255))
        manifest["shops"][key]={"asset_ids":{"body":f"U03_SHOP_{num:02d}_BODY","sign":f"U03_SHOP_{num:02d}_SIGN"},
            "psd":ref(psd),"body":{**ref(body),"alpha_bbox_xyxy":bi.getchannel("A").getbbox(),"inherited_exact_bytes":body_identical},
            "sign":{**ref(sign),"alpha_bbox_xyxy":si.getchannel("A").getbbox(),"inherited_exact_bytes":sign_identical},
            "recomposition":ref(rec),"views":views,"psd_inherited_exact_bytes":psd_identical,
            "psd_layers_bottom_to_top":record.get("layers_bottom_to_top", "original_v01_layers_unchanged")}
        diffs["shops"][key]={"changed_composite_pixels":int(changed.sum()),"changed_outside_old_and_new_sign_plus_01_repair":outside,
            "body_changed_pixels":int(np.count_nonzero(np.any(np.asarray(old_bi)!=np.asarray(bi),axis=2))),
            "body_byte_identical":body_identical,"sign_byte_identical":sign_identical,"psd_byte_identical":psd_identical,
            "old_sign_bbox":old_si.getchannel("A").getbbox(),"new_sign_bbox":si.getchannel("A").getbbox(),
            "old_body_bbox":old_bi.getchannel("A").getbbox(),"new_body_bbox":bi.getchannel("A").getbbox()}
    over=PRE/"six_shop_same_scale_overview.png";overview.save(over)
    cut=PRE/"twelve_slices_checker_sheet.png";cuts.save(cut)
    manifest["same_scale_overview"]=ref(over);manifest["twelve_slices_checker_sheet"]=ref(cut)
    (ROOT/"CUT_MANIFEST_V02.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding="utf-8")
    (ROOT/"DIFF_AND_RECOMPOSITION_REPORT.json").write_text(json.dumps(diffs,ensure_ascii=False,indent=2),encoding="utf-8")
    print("Verified",len(manifest["shops"]),"shops; outside differences",[x["changed_outside_old_and_new_sign_plus_01_repair"] for x in diffs["shops"].values()])

if __name__=="__main__":main()
