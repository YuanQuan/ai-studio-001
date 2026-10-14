"""Nameplate bases, reusable selected/locked states and counter occluder."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
import numpy as np,json

ROOT=Path(__file__).resolve().parents[1]
BASE=Image.open(ROOT/'source/layers/STATIC_CLEAN_full.png').convert('RGB')
W,H=BASE.size;LAYER=ROOT/'source/layers';EXP=ROOT/'exports'
for p in (LAYER,EXP):p.mkdir(exist_ok=True)

def rr(box,radius):
    m=Image.new('L',(W,H));ImageDraw.Draw(m).rounded_rectangle(box,radius=radius,fill=255)
    return m.filter(ImageFilter.GaussianBlur(.4))
def emit(id,rgba,pivot):
    full=LAYER/f'{id}_full.png';rgba.save(full)
    b=rgba.getchannel('A').getbbox();assert b,id
    out=EXP/f'{id}.png';rgba.crop(b).save(out)
    return dict(id=id,source=str(full.relative_to(ROOT)),export=str(out.relative_to(ROOT)),
                bbox=list(b),pivot_full=list(pivot),pivot_export=[pivot[0]-b[0],pivot[1]-b[1]])

plates=[
 ('T01',(65,565,193,606)),('T02',(65,766,193,808)),('T03',(65,971,193,1013)),
 ('M01',(845,565,972,607)),('M02',(845,766,972,808)),('M03',(845,971,972,1013)),
 ('P01',(282,922,402,964)),('P02',(456,922,576,964)),('P03',(630,922,750,964)),
 ('P04',(282,1041,402,1082)),('P05',(456,1041,576,1082)),('P06',(630,1041,750,1082))]
records=[];bare=np.asarray(BASE).copy();rgb=np.asarray(BASE)
for id,box in plates:
    mask=rr(box,20 if id[0]!='P' else 19)
    layer=BASE.convert('RGBA');layer.putalpha(mask)
    pivot=((box[0]+box[2])//2,(box[1]+box[3])//2)
    records.append(emit(f'LABEL_PLATE_{id}',layer,pivot))
    x0,y0,x1,y1=box
    # This wood is normally hidden by the detachable plaque. It only gives a
    # credible empty backing when the layer is toggled off in the PSD.
    sample=rgb[max(0,y0-12),min(W-1,max(x0+8,(x0+x1)//2))].astype('float32')
    brown=np.array([max(51,min(105,sample[0]*.72)),max(27,min(65,sample[1]*.72)),
                    max(21,min(47,sample[2]*.78))],dtype='uint8')
    sel=np.asarray(mask).astype('float32')/255
    bare=(bare.astype('float32')*(1-sel[...,None])+brown[None,None,:]*sel[...,None]).astype('uint8')
Image.fromarray(bare).save(LAYER/'STATIC_BARE_full.png')

# Use three reusable category frame geometries; their positions are relative
# to each slot, so later states never require a permanently lit static shelf.
for cat,(w,h) in {'TEA':(163,183),'MILK':(142,183),'TOP':(168,121)}.items():
    im=Image.new('RGBA',(w,h),(0,0,0,0));d=ImageDraw.Draw(im)
    r=17 if cat!='TOP' else 13
    d.rounded_rectangle((3,3,w-4,h-4),radius=r,outline=(255,196,67,180),width=7)
    d.rounded_rectangle((6,6,w-7,h-7),radius=r-2,outline=(255,237,138,235),width=3)
    glow=im.filter(ImageFilter.GaussianBlur(5))
    glow.alpha_composite(im)
    p=EXP/f'SELECT_{cat}.png';glow.save(p)
    lock=Image.new('RGBA',(w,h),(0,0,0,0));ld=ImageDraw.Draw(lock)
    ld.rounded_rectangle((5,5,w-6,h-6),radius=r,fill=(33,23,24,145))
    cx=w//2;cy=h//2
    ld.arc((cx-13,cy-22,cx+13,cy+9),180,360,fill=(255,231,192,240),width=5)
    ld.rounded_rectangle((cx-17,cy-2,cx+17,cy+22),radius=5,fill=(255,231,192,235))
    ld.ellipse((cx-3,cy+5,cx+3,cy+11),fill=(76,43,27,255))
    lp=EXP/f'LOCK_{cat}.png';lock.save(lp)
    records.extend([
      dict(id=f'SELECT_{cat}',export=str(p.relative_to(ROOT)),local_size=[w,h],
           anchors={'TEA':[50,427],'MILK':[837,427],'TOP':[256,844]}[cat]),
      dict(id=f'LOCK_{cat}',export=str(lp.relative_to(ROOT)),local_size=[w,h],
           anchors={'TEA':[50,427],'MILK':[837,427],'TOP':[256,844]}[cat])])

# One actual front-counter strip from frozen pixels overlays the ghost's
# lower edge. It is a small occluder, not a full-image reference cover.
counter=Image.new('L',(W,H));ImageDraw.Draw(counter).polygon([(235,778),(788,778),(788,817),(235,817)],fill=255)
counter=counter.filter(ImageFilter.GaussianBlur(.3))
rgb=BASE.convert('RGBA');rgb.putalpha(counter)
records.append(emit('COUNTER_FRONT',rgb,(511,809)))
(ROOT/'source/state_cut_data.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
print('plates',len(plates),'state files',6)
