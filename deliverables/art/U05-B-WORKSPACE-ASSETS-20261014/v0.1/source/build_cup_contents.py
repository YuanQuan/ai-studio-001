"""Twelve independently composable fantasy drink contents for both cup sizes."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
import numpy as np,json,math

ROOT=Path(__file__).resolve().parents[1]
PROJECT=ROOT.parents[3]
SRC=Image.open(PROJECT/'deliverables/art/U05-MILK-TEA-WORKSPACE-CONCEPT-20261013/v0.3/concept_B.png').convert('RGB')
W,H=SRC.size
LAYER=ROOT/'source/layers';EXP=ROOT/'exports';REVIEW=ROOT/'review'
for p in (LAYER,EXP,REVIEW):p.mkdir(parents=True,exist_ok=True)
BOX=(418,1093,601,1326);CW=BOX[2]-BOX[0];CH=BOX[3]-BOX[1]
ORDER=(577,326,728,506)

def interior_mask():
    s=3;m=Image.new('L',(CW*s,CH*s));d=ImageDraw.Draw(m)
    p=[(37,61),(145,61),(144,94),(139,145),(132,211),(121,219),
       (62,219),(50,211),(43,145),(38,94)]
    d.polygon([(x*s,y*s) for x,y in p],fill=255)
    return m.resize((CW,CH),Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(.6))
INNER=interior_mask()
def clip(im):
    a=Image.fromarray((np.asarray(im.getchannel('A')).astype('float32')*
                       np.asarray(INNER).astype('float32')/255).astype('uint8'))
    im.putalpha(a);return im
def emit(name,local):
    local=clip(local)
    exp=EXP/f'{name}.png';local.save(exp)
    full=Image.new('RGBA',(W,H),(0,0,0,0));full.alpha_composite(local,(BOX[0],BOX[1]))
    path=LAYER/f'{name}_full.png';full.save(path)
    b=local.getchannel('A').getbbox()
    return dict(id=name,export=str(exp.relative_to(ROOT)),layer=str(path.relative_to(ROOT)),
                local_canvas=[CW,CH],nonzero_bbox=list(b),
                work_origin=[BOX[0],BOX[1]],order_rect=list(ORDER),
                same_source_two_size_transform='Lanczos scale of preclipped canonical local canvas; order/work front edges separate')

records=[]
teas=[('CUP_TEA_T01',(81,490,177,564)),('CUP_TEA_T02',(81,694,177,769)),
      ('CUP_TEA_T03',(81,896,177,972))]
for name,crop in teas:
    texture=SRC.crop(crop).resize((113,159),Image.Resampling.LANCZOS).convert('RGBA')
    im=Image.new('RGBA',(CW,CH),(0,0,0,0));im.alpha_composite(texture,(35,61))
    records.append(emit(name,im))

def milk_canvas():
    return Image.new('RGBA',(CW*3,CH*3),(0,0,0,0))
def result_milk(im):return im.resize((CW,CH),Image.Resampling.LANCZOS)
def q(v):return round(v*3)

# Three distinct transparent milk tracery designs. The tea remains visible.
im=milk_canvas();d=ImageDraw.Draw(im)
for b in [(53,80,133,128),(66,111,155,166),(46,148,133,194)]:
    d.arc(tuple(q(v) for v in b),20,220,fill=(181,240,255,220),width=q(8))
    d.arc(tuple(q(v) for v in b),190,340,fill=(247,251,255,185),width=q(5))
for x,y,r in [(79,112,9),(120,139,12),(92,172,7)]:
    d.ellipse((q(x-r),q(y-r),q(x+r),q(y+r)),fill=(223,250,255,142))
records.append(emit('CUP_MILK_M01',result_milk(im)))

im=milk_canvas();d=ImageDraw.Draw(im)
for x,y,r in [(70,113,16),(111,142,18),(82,179,14)]:
    d.ellipse((q(x-r),q(y-r),q(x+r),q(y+r)),fill=(244,248,255,173),outline=(187,210,226,229),width=q(3))
    d.arc((q(x-r+5),q(y-r+4),q(x+r-5),q(y+r-7)),185,345,fill=(255,255,255,222),width=q(4))
    d.ellipse((q(x-3),q(y-r-3),q(x+3),q(y-r+3)),fill=(226,239,252,235))
records.append(emit('CUP_MILK_M02',result_milk(im)))

im=milk_canvas();d=ImageDraw.Draw(im)
for b in [(54,90,151,171),(45,120,135,204)]:
    d.arc(tuple(q(v) for v in b),12,218,fill=(255,245,192,221),width=q(7))
    d.arc(tuple(q(v) for v in b),189,336,fill=(255,251,220,160),width=q(5))
for x,y,r in [(65,119,5),(133,108,6),(105,153,4),(73,184,5),(128,189,5)]:
    d.ellipse((q(x-r),q(y-r),q(x+r),q(y+r)),fill=(255,229,96,227))
records.append(emit('CUP_MILK_M03',result_milk(im)))

tops=[('CUP_TOP_P01',(286,850,399,894)),('CUP_TOP_P02',(449,851,583,897)),
      ('CUP_TOP_P03',(621,852,757,897)),('CUP_TOP_P04',(281,971,403,1022)),
      ('CUP_TOP_P05',(449,973,584,1024)),('CUP_TOP_P06',(622,972,758,1024))]
for name,crop in tops:
    srcid='U05_B_'+name.rsplit('_',1)[-1]
    source_obj=Image.open(LAYER/f'OBJ_{srcid}_full.png').convert('RGBA')
    topper=source_obj.crop(crop)
    topper.thumbnail((100,46),Image.Resampling.LANCZOS)
    im=Image.new('RGBA',(CW,CH),(0,0,0,0))
    im.alpha_composite(topper,((CW-topper.width)//2,169))
    records.append(emit(name,im))

(ROOT/'source/cup_content_data.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')

def transformed(local):
    x0,y0,x1,y1=ORDER
    small=local.resize((x1-x0,y1-y0),Image.Resampling.LANCZOS)
    full=Image.new('RGBA',(W,H),(0,0,0,0));full.alpha_composite(small,(x0,y0));return full

def cup_combo(ids,order=True,work=True):
    img=Image.new('RGBA',(W,H),(0,0,0,0))
    for item in ids:
        local=Image.open(EXP/f'{item}.png').convert('RGBA')
        if order:img.alpha_composite(transformed(local))
        if work:
            full=Image.new('RGBA',(W,H),(0,0,0,0));full.alpha_composite(local,(BOX[0],BOX[1]));img.alpha_composite(full)
    return img

for tag,ids in [
    ('A',['CUP_TEA_T01','CUP_MILK_M01','CUP_TOP_P01']),
    ('B',['CUP_TEA_T03','CUP_MILK_M03','CUP_TOP_P06'])]:
    img=Image.open(LAYER/'STATIC_CLEAN_BEFORE_TEXT_full.png').convert('RGBA')
    img.alpha_composite(Image.open(LAYER/'CUSTOMER_GHOST_full.png').convert('RGBA'))
    img.alpha_composite(Image.open(LAYER/'ORDER_BUBBLE_EMPTY_full.png').convert('RGBA'))
    img.alpha_composite(Image.open(LAYER/'ORDER_CUP_BACK_full.png').convert('RGBA'))
    img.alpha_composite(Image.open(LAYER/'WORK_CUP_BACK_full.png').convert('RGBA'))
    img.alpha_composite(cup_combo(ids))
    img.alpha_composite(Image.open(LAYER/'ORDER_CUP_FRONT_full.png').convert('RGBA'))
    img.alpha_composite(Image.open(LAYER/'ORDER_STRAW_full.png').convert('RGBA'))
    img.alpha_composite(Image.open(LAYER/'WORK_CUP_FRONT_full.png').convert('RGBA'))
    img.convert('RGB').save(REVIEW/f'cup_combo_{tag}.png')
print('content_layers',len(records),'canonical',CW,CH)
