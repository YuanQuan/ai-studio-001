"""Finish 03/04 local sign-layer edits and inherit 05/06 exact old files."""
from __future__ import annotations

import json
import shutil
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

import build_samples_r2 as r2

base = r2.base
ROOT, OLD = base.ROOT, base.OLD
base.PRE = ROOT / "preview/sign_revision_v02_final"
base.EXP = ROOT / "exports/sign_revision_v02_final"
base.WORK = ROOT / "source/psd_work_final"
for d in (base.PRE, base.EXP, base.WORK): d.mkdir(parents=True, exist_ok=True)

ORIGINALS = json.loads((OLD / "SIX_SHOP_GATE2_CANDIDATE_MANIFEST_V04.json").read_text(encoding="utf-8"))["shops"]

def old_copy(num: int, kind: str, destination: Path) -> None:
    src = OLD / ORIGINALS[f"shop_{num:02d}"][kind]["path"]
    shutil.copy2(src, destination)
    assert base.sha(src) == base.sha(destination)

def compose_existing_body(layers: Path, names: list[str]) -> Image.Image:
    result=base.empty()
    for n in names: result.alpha_composite(Image.open(layers/f"{n}.png").convert("RGBA"))
    return result

def make_xian() -> Image.Image:
    font_file=ROOT/"source/rights/ZCOOLKuaiLe-Regular.ttf"
    assert base.sha(font_file)=="812A6FC1FE54B6D73A419245C32DFEBA8AA33104D5BE90D1CF6AF082007CB71D"
    font=ImageFont.truetype(str(font_file),108)
    mask=Image.new("L",(140,140),0)
    d=ImageDraw.Draw(mask)
    bbox=d.textbbox((0,0),"现",font=font)
    d.text((-bbox[0]+5,-bbox[1]+5),"现",font=font,fill=255)
    mbox=mask.getbbox();assert mbox is not None
    mask=mask.crop(mbox).resize((91,90),Image.Resampling.LANCZOS)
    pad=Image.new("L",(113,112),0);pad.paste(mask,(11,11))
    mask=pad.filter(ImageFilter.MaxFilter(7))
    outer=mask.filter(ImageFilter.MaxFilter(11))
    middle=mask.filter(ImageFilter.MaxFilter(7))
    inner=mask.filter(ImageFilter.MaxFilter(3))
    tile=Image.new("RGBA",mask.size)
    tile.paste((31,23,32,255),(0,0,*mask.size),outer)
    tile.paste((221,120,61,255),(0,0,*mask.size),middle)
    tile.paste((113,65,51,255),(0,0,*mask.size),inner)
    tile.paste((65,43,45,255),(0,0,*mask.size),mask)
    result=base.empty()
    result.alpha_composite(tile,(81,504))
    return result

def shop03() -> dict:
    names=["body_structure","canopy","smoke","operating_objects","ground_contact","light"]
    layers=base.layer_dir(3,"zcool_b92_v03")
    body=compose_existing_body(layers,names)
    orig_glyph=Image.open(base.WORK/"shop_03/history/sign_glyph_v01.png").convert("RGBA")
    keep=base.empty()
    arr=np.array(orig_glyph)
    arr[:638,:,:]=0
    keep=Image.fromarray(arr,"RGBA")
    xian=make_xian()
    shutil.copy2(base.WORK/"shop_03/history/sign_hardware_v01.png",layers/"sign_hardware_reused.png")
    shutil.copy2(base.WORK/"shop_03/history/sign_board_v01.png",layers/"sign_board_reused.png")
    keep.save(layers/"sign_glyph_reused_kao.png")
    xian.save(layers/"sign_glyph_official_xian.png")
    sign=base.empty()
    for n in ["sign_hardware_reused","sign_board_reused","sign_glyph_reused_kao","sign_glyph_official_xian"]:
        sign.alpha_composite(Image.open(layers/f"{n}.png").convert("RGBA"))
    report=base.compose_psd(3,layers,names,["sign_hardware_reused","sign_board_reused","sign_glyph_reused_kao","sign_glyph_official_xian"],body,sign,"charcoal_grill")
    report["font_sha256"]=base.sha(ROOT/"source/rights/ZCOOLKuaiLe-Regular.ttf")
    report["body_byte_identical_to_v01"]=True
    return report

def make_icon() -> Image.Image:
    ref=r2.REFERENCE.crop((203,684,274,729))
    pix=np.asarray(ref.convert("RGBA"),dtype=np.uint8)
    r,g,b=[pix[:,:,i].astype(np.float32) for i in range(3)]
    brightness=np.maximum(np.maximum(r,g),b)
    # Preserve both scissor finger loops and comb teeth. The lower loop is
    # warmer than the metal, so a cool-only chroma key would wrongly erase it.
    a=np.where((brightness>12)&(r<191)&(g<161)&(b<151),255,0).astype(np.uint8)
    a[:2]=0; a[-1:]=0
    rgba=pix.copy();rgba[:,:,3]=a
    icon=Image.fromarray(rgba,"RGBA").resize((225,100),Image.Resampling.LANCZOS)
    icon=icon.filter(ImageFilter.UnsharpMask(radius=1.1,percent=165,threshold=2))
    full=base.empty();full.alpha_composite(icon,(400,420))
    # The source's lower scissor finger ring is brown and nearly lost against
    # the paper. Keep the approved cross layout and locally restore this ring.
    a=np.array(full,dtype=np.uint8)
    area=a[486:522,427:499]
    warm=(area[:,:,0].astype(np.int16)>area[:,:,2].astype(np.int16)+16)
    area[warm,3]=0
    full=Image.fromarray(a,"RGBA")
    ring=Image.new("RGBA",(72*4,38*4))
    rd=ImageDraw.Draw(ring)
    rd.ellipse((7*4,5*4,65*4,32*4),fill=(41,43,55,255),outline=(109,102,102,255),width=3*4)
    rd.ellipse((18*4,13*4,54*4,24*4),fill=(0,0,0,0))
    ring=ring.rotate(18,resample=Image.Resampling.BICUBIC,expand=True).resize((84,58),Image.Resampling.LANCZOS)
    full.alpha_composite(ring,(410,452))
    return full

def shop04() -> dict:
    names=["ground_contact","body_facade","body_roof","interior","light","front"]
    layers=base.layer_dir(4,"full_redraw_v03")
    body=compose_existing_body(layers,names)
    shutil.copy2(base.WORK/"shop_04/history/sign_hardware_v01.png",layers/"sign_hardware_reused.png")
    shutil.copy2(base.WORK/"shop_04/history/sign_board_v01.png",layers/"sign_board_reused.png")
    icon=make_icon();icon.save(layers/"sign_icon_scissors_comb_new.png")
    sign=base.empty()
    for n in ["sign_hardware_reused","sign_board_reused","sign_icon_scissors_comb_new"]:
        sign.alpha_composite(Image.open(layers/f"{n}.png").convert("RGBA"))
    report=base.compose_psd(4,layers,names,["sign_hardware_reused","sign_board_reused","sign_icon_scissors_comb_new"],body,sign,"barber")
    report["body_byte_identical_to_v01"]=True
    report["icon_source_overview_xyxy"]=[203,684,274,729]
    return report

def shop_unchanged(num: int) -> dict:
    key=f"shop_{num:02d}"
    data=ORIGINALS[key]
    psd=ROOT/"psd"/f"{key}_unchanged_sign_revision_v02.psd"
    body=base.EXP/f"tex_u03_{key}_body_sign_revision_v02.png"
    sign=base.EXP/f"tex_u03_{key}_sign_sign_revision_v02.png"
    old_copy(num,"psd",psd);old_copy(num,"body",body);old_copy(num,"sign",sign)
    bi=Image.open(body).convert("RGBA");si=Image.open(sign).convert("RGBA")
    recomposed=bi.copy();recomposed.alpha_composite(si)
    rec=base.PRE/f"{key}_recomposed.png";recomposed.save(rec)
    old_rec=Image.open(OLD/data["recomposition"]["path"]).convert("RGBA")
    assert np.array_equal(np.asarray(recomposed),np.asarray(old_rec)),key
    return {"psd":str(psd.relative_to(ROOT)),"body":str(body.relative_to(ROOT)),"sign":str(sign.relative_to(ROOT)),
            "recomposition":str(rec.relative_to(ROOT)),"psd_sha256":base.sha(psd),"body_sha256":base.sha(body),
            "sign_sha256":base.sha(sign),"recomposition_sha256":base.sha(rec),"body_bbox":bi.getchannel("A").getbbox(),
            "sign_bbox":si.getchannel("A").getbbox(),"unchanged_from_v01":True,"foot":[512,900]}

def main() -> None:
    base.check_gate()
    tech=json.loads((Path("deliverables/tech_lead/U03-SHOP-SIGN-REVISION-001/v0.1/SAMPLE_TECH_POSTCHECK_V02_R2.json")).read_text(encoding="utf-8"))
    assert tech.get("decision") == "APPROVED_FOR_BATCH_EXPANSION",tech.get("decision")
    sample=json.loads((ROOT/"SAMPLE_BUILD_REPORT_V02_R2.json").read_text(encoding="utf-8"))["samples"]
    # Reuse the exact reviewed r2 PSD/cut bytes in the final version paths.
    result={}
    for num in (1,2):
        key=f"shop_{num:02d}";src=sample[key]
        entry={**src}
        for kind in ("psd","body","sign"):
            origin=ROOT/src[kind]
            destination=(ROOT/"psd"/f"{key}_sign_revision_v02.psd") if kind=="psd" else (base.EXP/f"tex_u03_{key}_{kind}_sign_revision_v02.png")
            shutil.copy2(origin,destination)
            entry[kind]=str(destination.relative_to(ROOT))
            assert base.sha(origin)==base.sha(destination)
        bi=Image.open(ROOT/entry["body"]).convert("RGBA");si=Image.open(ROOT/entry["sign"]).convert("RGBA")
        rec=bi.copy();rec.alpha_composite(si)
        path=base.PRE/f"{key}_recomposed.png";rec.save(path)
        entry["recomposition"]=str(path.relative_to(ROOT));entry["recomposition_sha256"]=base.sha(path)
        result[key]=entry
    result["shop_03"]=shop03();result["shop_04"]=shop04()
    result["shop_05"]=shop_unchanged(5);result["shop_06"]=shop_unchanged(6)
    (ROOT/"FULL_BUILD_REPORT_V02.json").write_text(json.dumps({"batch":"U03-SHOP-SIGN-REVISION-V02","shops":result},ensure_ascii=False,indent=2),encoding="utf-8")
    print("Built",list(result))

if __name__=="__main__":main()
