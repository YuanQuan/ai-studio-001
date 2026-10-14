"""Produce real full-canvas semantic objects from approved frozen B pixels.

Background repairs are pasted only inside the listed shelf cells. This script
never modifies the frozen reference nor writes to the image2psd skill folder.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
PROJECT=ROOT.parents[3]
REF=PROJECT/'deliverables/art/U05-MILK-TEA-WORKSPACE-CONCEPT-20261013/v0.3/concept_B.png'
SRC=Image.open(REF).convert('RGB')
W,H=SRC.size
RGB=np.asarray(SRC)
LAYER=ROOT/'source/layers';EXPORT=ROOT/'exports';REVIEW=ROOT/'review'
for p in (LAYER,EXPORT,REVIEW):p.mkdir(parents=True,exist_ok=True)

def poly_mask(points,cut=None):
    s=4;m=Image.new('L',(W*s,H*s));d=ImageDraw.Draw(m)
    d.polygon([(x*s,y*s) for x,y in points],fill=255)
    if cut:
        for pts in cut:d.polygon([(x*s,y*s) for x,y in pts],fill=0)
    return m.resize((W,H),Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(.35))

def color_ingredient(box,kind):
    x0,y0,x1,y1=box
    p=RGB[y0:y1,x0:x1].astype('int16')
    r,g,b=p[:,:,0],p[:,:,1],p[:,:,2]
    if kind=='purple':q=(b>r*.95)&(b>g*1.16)&(r>80)
    elif kind=='gold':q=(r>135)&(g>85)&(r>g*.94)&(g>b*1.26)
    elif kind=='blue':q=(b>r*1.25)&(b>g*.95)&(b>95)
    elif kind=='silver':q=(b>75)&(r>100)&(g>95)&(np.abs(r-g)<48)&(np.abs(g-b)<65)
    elif kind=='teal':q=(b>r*1.17)&(g>r*1.17)&(b>65)
    else:raise ValueError(kind)
    raw=np.zeros((H,W),dtype='uint8');raw[y0:y1,x0:x1]=q.astype('uint8')*255
    return Image.fromarray(raw).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(.35))

def combine(*ms):
    a=np.maximum.reduce([np.asarray(m) for m in ms]);return Image.fromarray(a)

def limit(mask,box):
    r=Image.new('L',(W,H));ImageDraw.Draw(r).rectangle((box[0],box[1],box[2]-1,box[3]-1),fill=255)
    return Image.composite(mask,Image.new('L',(W,H)),r)

def object_file(asset_id,mask,pivot):
    out=SRC.convert('RGBA');out.putalpha(mask)
    full=LAYER/f'OBJ_{asset_id}_full.png';out.save(full)
    b=mask.getbbox();assert b,asset_id
    cropped=out.crop(b);dst=EXPORT/f'{asset_id}.png';cropped.save(dst)
    return dict(id=asset_id,layer=str(full.relative_to(ROOT)),export=str(dst.relative_to(ROOT)),
                bbox=list(b),pivot_full=list(pivot),pivot_export=[pivot[0]-b[0],pivot[1]-b[1]],
                nonzero_alpha=int(np.count_nonzero(np.asarray(mask))),size=list(cropped.size))

info=[]
rep=ROOT/'source/representative'
for id,fn,pivot in [('U05_B_T01','T01_youdeng_tea_full.png',(132,561)),
                    ('U05_B_P01','P01_guihuozhu_bowl_full.png',(343,923))]:
    a=Image.open(rep/fn).getchannel('A')
    info.append(object_file(id,a,pivot))

tea_a=Image.open(rep/'T01_youdeng_tea_full.png').getchannel('A')
for id,dy,pivot in [('U05_B_T02',204,(132,765)),('U05_B_T03',408,(132,969))]:
    m=Image.new('L',(W,H));m.paste(tea_a,(5,dy))
    info.append(object_file(id,limit(m,(55,415+dy,217,567+dy)),pivot))

# Milk bottle contours include visible container/glass/body but exclude shelf,
# nameplate and permanent selection glow. Dangling bells stay attached to M02/M03.
milk={
 'U05_B_M01': ([(880,438),(920,438),(947,442),(954,450),(946,462),(945,475),(957,488),
                 (965,513),(966,541),(958,561),(947,568),(858,568),(854,560),(852,541),
                 (854,509),(858,488),(870,473),(874,460),(866,452),(867,444)],(908,565),(850,425,975,569)),
 'U05_B_M02': ([(876,640),(932,640),(952,646),(956,656),(950,664),(949,678),(958,679),
                 (968,690),(977,704),(973,716),(964,725),(960,746),(951,765),(859,766),
                 (853,755),(853,724),(854,694),(864,677),(871,661),(865,652)],(907,763),(850,630,981,768)),
 'U05_B_M03': ([(876,840),(932,840),(951,847),(954,857),(948,866),(948,879),(958,882),
                 (972,891),(981,906),(976,920),(963,929),(960,951),(949,973),(858,974),
                 (853,961),(853,930),(854,902),(862,881),(871,866),(865,856)],(907,971),(850,831,982,976))
}
for id,(pts,pivot,roi) in milk.items():
    m=poly_mask(pts)
    if id=='U05_B_M01':
        # The first milk slot is selected in the concept. Its amber vertical
        # highlight is shelf state, not bottle glass or a natural reflection.
        a=np.asarray(m).copy();rr=RGB[:,:,0].astype('int16');gg=RGB[:,:,1].astype('int16');bb=RGB[:,:,2].astype('int16')
        xx=np.arange(W)[None,:]
        baked_glow=(xx<860)&(bb<45)&(rr>gg*1.48)
        a[baked_glow]=0;m=Image.fromarray(a)
    # Ring handles/bell loops remain semantic and are transparent through center.
    if id!='U05_B_M01':
        arr=Image.new('L',(W,H));d=ImageDraw.Draw(arr)
        oy=0 if id=='U05_B_M02' else 200
        d.ellipse((947,650+oy,967,678+oy),fill=255)
        d.ellipse((953,655+oy,962,670+oy),fill=0)
        m=combine(m,arr)
    info.append(object_file(id,limit(m,roi),pivot))

# Bowl profiles are shared at common shelf dimensions, while each fantasy
# topping is segmented from its own visible pigment, not replaced with a grid.
bowl=[(277,889),(281,882),(289,877),(304,874),(324,872),(375,873),
      (396,878),(405,884),(409,892),(407,902),(399,916),(392,925),
      (292,925),(282,916),(276,902)]
for id,dx,dy,kind,top,pivot in [
 ('U05_B_P02',174,0,'purple',(444,856,582,890),(517,923)),
 ('U05_B_P03',348,0,'gold',(619,858,753,891),(691,923)),
 ('U05_B_P04',0,115,'blue',(282,976,403,1021),(343,1040)),
 ('U05_B_P05',174,115,'silver',(449,975,583,1021),(517,1040)),
 ('U05_B_P06',348,115,'teal',(624,973,754,1021),(691,1040))]:
    b=poly_mask([(x+dx,y+dy) for x,y in bowl])
    c=color_ingredient(top,kind)
    roi=(272+dx,845+dy,414+dx,929+dy)
    info.append(object_file(id,limit(combine(b,c),roi),pivot))

# A single generated patch source is confined to the twelve signed shelf-cell
# interiors and selected rims. Keep all other frozen RGB source pixels exact.
repair=Image.open(ROOT/'source/repair_all_slots_candidate.png').convert('RGB')
patch=Image.new('L',(W,H));pd=ImageDraw.Draw(patch)
cells=[(50,427,211,612),(50,631,211,812),(50,835,211,1031),
       (839,427,977,612),(839,632,977,812),(839,835,977,1031),
       (257,845,424,967),(431,845,601,967),(606,845,773,967),
       (257,969,424,1082),(431,969,601,1082),(606,969,773,1082)]
for b in cells:pd.rectangle(b,fill=255)
soft=patch.filter(ImageFilter.GaussianBlur(1.5))
patch=Image.composite(soft,Image.new('L',(W,H)),patch)
back=Image.composite(repair,SRC,patch)
back.save(LAYER/'SHELF_EMPTY_WITH_LABELS_full.png')

import json
(ROOT/'source/object_cut_data.json').write_text(json.dumps(info,ensure_ascii=False,indent=2),encoding='utf-8')
rec=back.convert('RGBA')
for item in info:rec.alpha_composite(Image.open(ROOT/item['layer']).convert('RGBA'))
rec.convert('RGB').save(REVIEW/'objects_reconstructed.png')
diff=np.abs(np.asarray(rec.convert('RGB')).astype('int16')-RGB.astype('int16'))
outside=np.asarray(patch)==0
print('objects',len(info),'outside_patch_diff_pixels',int(np.count_nonzero(diff.max(axis=2)[outside])),
      'changed_pixels',int(np.count_nonzero(diff.max(axis=2))),'max_channel',int(diff.max()))
for item in info:print(item['id'],item['bbox'],item['nonzero_alpha'])
