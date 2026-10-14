"""Separate B scene actors, cups and buttons from frozen pixels.

The static backing is reconstructed from the approved local repair candidates;
all untouched pixels are taken from the frozen reference. No reference overlay
is used in the final layer stack.
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter,ImageFont
import numpy as np, json

ROOT=Path(__file__).resolve().parents[1]
PROJECT=ROOT.parents[3]
SRC=Image.open(PROJECT/'deliverables/art/U05-MILK-TEA-WORKSPACE-CONCEPT-20261013/v0.3/concept_B.png').convert('RGB')
BASE=Image.open(ROOT/'source/layers/SHELF_EMPTY_WITH_LABELS_full.png').convert('RGB')
REPAIR=Image.open(ROOT/'source/repair_scene_candidate.png').convert('RGB')
W,H=SRC.size
LAYER=ROOT/'source/layers';EXP=ROOT/'exports';REVIEW=ROOT/'review'
for p in (LAYER,EXP,REVIEW):p.mkdir(parents=True,exist_ok=True)

def shape(draw):
    s=4;m=Image.new('L',(W*s,H*s));d=ImageDraw.Draw(m);draw(d,s)
    return m.resize((W,H),Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(.3))
def poly(d,s,p,fill=255):d.polygon([(round(x*s),round(y*s)) for x,y in p],fill=fill)
def rect(d,s,b,fill=255,radius=0):
    b=tuple(round(v*s) for v in b)
    if radius:d.rounded_rectangle(b,radius=radius*s,fill=fill)
    else:d.rectangle(b,fill=fill)
def merge(*ms):return Image.fromarray(np.maximum.reduce([np.asarray(m) for m in ms]))
def emit(name,im):
    p=LAYER/f'{name}_full.png';im.save(p);return str(p.relative_to(ROOT))
def crop_export(name,im,pivot):
    bbox=im.getchannel('A').getbbox();assert bbox,name
    p=EXP/f'{name}.png';im.crop(bbox).save(p)
    return dict(id=name,source=str((LAYER/f'{name}_full.png').relative_to(ROOT)),
                export=str(p.relative_to(ROOT)),bbox=list(bbox),pivot_full=list(pivot),
                pivot_export=[pivot[0]-bbox[0],pivot[1]-bbox[1]])
def src_rgba(alpha):
    im=SRC.convert('RGBA');im.putalpha(alpha);return im

# White ghost silhouette: approved visible body only, ending at the counter.
ghost_poly=[(508,486),(540,490),(569,502),(595,523),(616,549),(632,582),
            (641,618),(643,658),(636,691),(623,709),(639,728),(647,745),
            (636,765),(616,779),(562,784),(327,784),(307,781),(321,766),
            (342,752),(357,727),(374,704),(380,671),(384,635),(393,594),
            (412,554),(441,519),(473,498)]
ghost_coarse=shape(lambda d,s:poly(d,s,ghost_poly))
# Bright body extraction within the rough signed outline removes street-blue
# triangles. Enclosed eyes and mouth are filled back into the semantic body.
srca=np.asarray(SRC).astype('int16')
white=(srca[:,:,0]>132)&(srca[:,:,1]>145)&(srca[:,:,2]>158)
white &= np.asarray(ghost_coarse)>0
white[484:524,579:660]=False  # bubble-tail occlusion is a separate layer
raw=Image.fromarray((white.astype('uint8')*255)).filter(ImageFilter.MaxFilter(7))
from collections import deque
arr=(np.asarray(raw.crop((300,480,655,790)))>0).astype('uint8')
hh,ww=arr.shape;seen=np.zeros_like(arr,dtype=bool);q=deque()
for x in range(ww):
    if not arr[0,x]:q.append((0,x))
    if not arr[hh-1,x]:q.append((hh-1,x))
for y in range(hh):
    if not arr[y,0]:q.append((y,0))
    if not arr[y,ww-1]:q.append((y,ww-1))
while q:
    y,x=q.popleft()
    if y<0 or x<0 or y>=hh or x>=ww or seen[y,x] or arr[y,x]:continue
    seen[y,x]=True
    q.extend(((y-1,x),(y+1,x),(y,x-1),(y,x+1)))
arr=np.where((arr>0)|(~seen),255,0).astype('uint8')
ghost_mask=Image.new('L',(W,H));ghost_mask.paste(Image.fromarray(arr),(300,480))
ghost_mask=Image.fromarray(np.minimum(np.asarray(ghost_mask),np.asarray(ghost_coarse)))
ghost=src_rgba(ghost_mask)
emit('CUSTOMER_GHOST',ghost)

# Speech bubble shape is recreated as a clean ivory plate with a source-color
# dark border; this deliberately removes the baked target cup for dynamic use.
bubble_mask=shape(lambda d,s:(rect(d,s,(466,287,842,491),radius=23),
                              poly(d,s,[(578,484),(608,484),(579,524)])))
bubble=Image.new('RGBA',(W,H),(0,0,0,0))
bd=ImageDraw.Draw(bubble)
bd.rounded_rectangle((467,288,841,490),radius=22,fill=(255,247,235,255),outline=(74,35,38,255),width=5)
bd.polygon([(577,484),(610,484),(580,522)],fill=(255,247,235,255))
bd.line([(577,483),(580,522),(610,484)],fill=(74,35,38,255),width=5)
bubble.putalpha(Image.fromarray(np.minimum(np.asarray(bubble.getchannel('A')),np.asarray(bubble_mask))))
emit('ORDER_BUBBLE_EMPTY',bubble)

# Empty cup structure. The source contains baked wood through glass; only
# frame/highlight pixels stay solid. The body is a light translucent shell.
cup_body=shape(lambda d,s:poly(d,s,[(422,1109),(598,1109),(585,1163),(575,1248),
                                     (562,1313),(552,1325),(463,1325),(451,1314),
                                     (439,1250),(428,1163)]))
cup_rim=shape(lambda d,s:(d.ellipse((418*s,1093*s,601*s,1131*s),fill=255),
                            d.ellipse((428*s,1100*s,591*s,1124*s),fill=0)))
cup_edges=shape(lambda d,s:(d.line([(426*s,1116*s),(451*s,1308*s),(460*s,1318*s)],fill=255,width=7*s),
                              d.line([(593*s,1116*s),(571*s,1308*s),(562*s,1318*s)],fill=255,width=7*s),
                              d.arc((450*s,1294*s,569*s,1325*s),0,180,fill=255,width=7*s)))
front_alpha=merge(cup_rim,cup_edges)
back_alpha=Image.fromarray((np.asarray(cup_body).astype('float32')*.28).astype('uint8'))
back=src_rgba(back_alpha)
glass=Image.new('RGBA',(W,H),(0,0,0,0));gd=ImageDraw.Draw(glass)
gd.polygon([(432,1128),(448,1128),(467,1300),(459,1310)],fill=(255,249,238,102))
gd.polygon([(574,1128),(588,1128),(566,1308),(557,1302)],fill=(255,249,238,96))
gd.polygon([(448,1131),(574,1131),(557,1300),(467,1300)],fill=(255,246,232,22))
ga=np.asarray(glass.getchannel('A')).astype('float32')*np.asarray(cup_body).astype('float32')/255
glass.putalpha(Image.fromarray(ga.astype('uint8')))
front=glass;front.alpha_composite(src_rgba(front_alpha))
emit('WORK_CUP_BACK',back);emit('WORK_CUP_FRONT',front)

# The order vessel is a deliberate same-source transform of the work cup;
# separate straw is retained from B visible pixels. Cup content sprites are
# composed between back/front at either size downstream.
SRC_CUP_BOX=(418,1093,601,1326); ORDER_BOX=(577,326,728,506)
def to_order(im):
    local=im.crop(SRC_CUP_BOX).resize((ORDER_BOX[2]-ORDER_BOX[0],ORDER_BOX[3]-ORDER_BOX[1]),Image.Resampling.LANCZOS)
    canvas=Image.new('RGBA',(W,H),(0,0,0,0));canvas.alpha_composite(local,(ORDER_BOX[0],ORDER_BOX[1]));return canvas
order_back=to_order(back);order_front=to_order(front)
emit('ORDER_CUP_BACK',order_back);emit('ORDER_CUP_FRONT',order_front)
straw_mask=shape(lambda d,s:poly(d,s,[(687,304),(706,303),(711,309),(705,366),
                                      (696,384),(689,376),(694,318),(686,315)]))
straw=src_rgba(straw_mask);emit('ORDER_STRAW',straw)

# Three signed bottom actions. Each plate is independent of its dark icon and
# dynamic label; the latter is rendered from the licensed font below.
buttons={
 'RECIPE':((34,1434,351,1536),[(84,1453,139,1510)],(191,1490)),
 'UNDO':((409,1434,625,1536),[(442,1453,495,1511)],(518,1490)),
 'SERVE':((635,1434,991,1536),[(690,1451,748,1512)],(813,1490))
}
button_records=[];button_masks=[]
for key,(box,icons,pivot) in buttons.items():
    mask=shape(lambda d,s,b=box:rect(d,s,b,radius=48))
    button_masks.append(mask)
    plate=src_rgba(mask)
    # Remove baked icon and lettering only from the inner plate, keeping its
    # source rim; icons are separately sampled from original under small ROIs.
    p_arr=np.array(plate)
    x0,y0,x1,y1=box
    fill=(255,239,207,255) if key!='SERVE' else (255,180,75,255)
    inner=Image.new('RGBA',(W,H),(0,0,0,0));dd=ImageDraw.Draw(inner)
    dd.rounded_rectangle((x0+16,y0+15,x1-16,y1-10),radius=35,fill=fill)
    m=np.asarray(mask).astype('float32')/255
    ia=np.asarray(inner.getchannel('A')).astype('float32')/255
    sel=(m*ia)[...,None]
    a=np.asarray(inner).astype('float32')
    p_arr=(p_arr.astype('float32')*(1-sel)+a*sel).astype('uint8')
    plate=Image.fromarray(p_arr,'RGBA')
    emit(f'BTN_{key}_BASE',plate)
    icon_box=icons[0]
    i_mask=Image.new('L',(W,H));ImageDraw.Draw(i_mask).rectangle(icon_box,fill=255)
    # Dark source silhouette only; no cream plate background.
    sr=np.asarray(SRC).astype('int16')
    dark=(sr[:,:,0]<135)&(sr[:,:,1]<92)&(sr[:,:,2]<72)
    i_mask=Image.fromarray(np.where((np.asarray(i_mask)>0)&dark,255,0).astype('uint8'))
    i_mask=i_mask.filter(ImageFilter.MaxFilter(3))
    icon=src_rgba(i_mask);emit(f'BTN_{key}_ICON',icon)
    button_records += [crop_export(f'BTN_{key}_BASE',plate,pivot),crop_export(f'BTN_{key}_ICON',icon,(icons[0][0],icons[0][1]))]

# Locally pasted street/counter/wood below removed dynamic foreground items.
repair_mask=merge(ghost_mask,bubble_mask,cup_body,*button_masks)
base=Image.composite(REPAIR,BASE,repair_mask)
base.save(LAYER/'STATIC_CLEAN_BEFORE_TEXT_full.png')

records=[crop_export('CUSTOMER_GHOST',ghost,(510,780)),
         crop_export('ORDER_BUBBLE_EMPTY',bubble,(655,489)),
         crop_export('WORK_CUP_BACK',back,(510,1321)),
         crop_export('WORK_CUP_FRONT',front,(510,1321)),
         crop_export('ORDER_CUP_BACK',order_back,(653,505)),
         crop_export('ORDER_CUP_FRONT',order_front,(653,505)),
         crop_export('ORDER_STRAW',straw,(700,375))]+button_records
(ROOT/'source/scene_cut_data.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')

preview=base.convert('RGBA')
for x in [ghost,bubble,back,front,order_back,order_front,straw]:preview.alpha_composite(x)
for key in buttons:
    for n in [f'BTN_{key}_BASE',f'BTN_{key}_ICON']:
        preview.alpha_composite(Image.open(LAYER/f'{n}_full.png').convert('RGBA'))
preview.convert('RGB').save(REVIEW/'scene_reconstructed_before_text.png')
print('scene records',len(records),'repair bbox',repair_mask.getbbox())
for x in records:print(x['id'],x['bbox'])
