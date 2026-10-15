"""U05-B FULL: deterministic local cuts, exact-source animation and layered PSD inputs."""
import hashlib, importlib.util, json, math, time, sys
from pathlib import Path
from PIL import Image, ImageDraw
import numpy as np

START=time.monotonic(); HARD=390
OUT=Path(__file__).resolve().parents[1]; ROOT=OUT.parents[3]
EXP=OUT/'exports'; REV=OUT/'review'; SRC=OUT/'source'; L=ROOT/'deliverables/art/U05-B-WORKSPACE-ASSETS-20261014/v0.1/source/layers'
V2=ROOT/'deliverables/art/U05-B-COMPONENT-ASSETS-20261014/v0.2/source'; OLD=ROOT/'deliverables/art/U05-B-INTERACTION-ASSETS-20261014/v0.1'; LC=V2/'layers'
def ck():
    if time.monotonic()-START>HARD: raise TimeoutError('FULL production bound; stop')
def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def layer(n):return Image.open((LC if n.startswith('LABEL_PLATE_') else L)/(n+'_full.png')).convert('RGBA')
def compose(base,names):
    im=base.convert('RGBA')
    for n in names: im=Image.alpha_composite(im,layer(n))
    return im
spec=importlib.util.spec_from_file_location('rep',OLD/'source/build_representative.py'); rep=importlib.util.module_from_spec(spec);spec.loader.exec_module(rep)
static=Image.open(OLD/'exports/STATIC_BARE_PATCH04.png').convert('RGB');body=Image.open(OLD/'exports/CUSTOMER_BODY.png').convert('RGBA')
faces={n:Image.open(OLD/'exports'/f'FACE_{n.upper()}.png').convert('RGBA') for n in ('neutral','blink','happy','squash','expand_mid')}
faces['disappointed']=Image.open(OLD/'exports/FACE_DISAPPOINTED.png').convert('RGBA')
ck()
# Preserve existing twelve shelf objects, twelve signs, and original bottom controls.
ids=[f'T{i:02d}' for i in range(1,4)]+[f'M{i:02d}' for i in range(1,4)]+[f'P{i:02d}' for i in range(1,7)]
racks=compose(static,[f'OBJ_U05_B_{i}' for i in ids]+[f'LABEL_PLATE_{i}' for i in ids]+['BTN_RECIPE_BASE','BTN_RECIPE_ICON','BTN_UNDO_BASE','BTN_UNDO_ICON','BTN_SERVE_BASE','BTN_SERVE_ICON'])
text_existing=np.asarray(layer('TEXT_SAMPLE_DYNAMIC')).copy();text_existing[1400:,700:]=0
text_existing=Image.fromarray(text_existing,'RGBA')
confirm=Image.open(ROOT/'deliverables/art/U05-B-COMPONENT-ASSETS-20261014/v0.2/exports/BTN_CONFIRM_TEXT.png').convert('RGBA')
racks.alpha_composite(text_existing)
racks.alpha_composite(confirm,(695,1443))
target=Image.new('RGBA',(118,160)); target.alpha_composite(rep.target_cup().resize((118,140),Image.Resampling.LANCZOS),(0,20))
slots=[(345,1150,90,84),(467,1150,90,84),(589,1150,90,84)]
def make_slot(id,box):
    obj=layer('OBJ_U05_B_'+id); bb=obj.getbbox(); obj=obj.crop(bb);x,y,w,h=box
    scale=min(w/obj.width,h/obj.height);sz=(round(obj.width*scale),round(obj.height*scale));obj=obj.resize(sz,Image.Resampling.LANCZOS)
    return obj,(x+(w-sz[0])//2,y+(h-sz[1])//2)
slotitems=[make_slot(i,b) for i,b in zip(('T01','M01','P01'),slots)]
worknames=['WORK_CUP_BACK','CUP_TEA_T01','CUP_MILK_M01','CUP_TOP_P01','WORK_CUP_FRONT']
def fullframe(face='neutral',x=309,bubble=True,selection=True,work=0):
    im=rep.render_frame(racks,body,faces[face],x,bubble,target).convert('RGBA')
    if selection:
        for obj,pos in slotitems: im.alpha_composite(obj,pos)
    if work:
        for n in worknames[:int(work)]: im=Image.alpha_composite(im,layer(n))
    return im.convert('RGB')
def view(im):
    s=im.resize((360,540),Image.Resampling.LANCZOS);v=Image.new('RGB',(360,640),(22,17,27));v.paste(s,(0,50));return v
recon=fullframe();recon.save(REV/'reconstructed.png');view(recon).save(REV/'reconstructed_360x640.png')
ck()
# Full-canvas PSD layers retain all previous independently editable objects, labels, controls and bank textures.
layers_dir=SRC/'full_canvas_layers';layers_dir.mkdir(exist_ok=True)
def canvas_layer(im,pos):
    v=Image.new('RGBA',(1024,1536));v.alpha_composite(im,pos);return v
canvas_layer(body,(309,484)).save(layers_dir/'CUSTOMER_BODY_BASE_full.png')
text_existing.save(layers_dir/'TEXT_LABELS_HEADER_full.png')
canvas_layer(confirm,(695,1443)).save(layers_dir/'BTN_CONFIRM_TEXT_full.png')
table_full=Image.new('RGBA',(1024,1536))
for obj,pos in slotitems:table_full.alpha_composite(obj,pos)
table_full.save(layers_dir/'SELECTED_TRIO_TABLE_full.png')
bubble_full=layer('ORDER_BUBBLE_EMPTY');bubble_full.alpha_composite(target,(594,326));bubble_full.save(layers_dir/'ORDER_BUBBLE_TARGET_078_full.png')
for n,im in faces.items():canvas_layer(im,(309,484)).save(layers_dir/('FACE_'+n.upper()+'_full.png'))
static.save(layers_dir/'STATIC_BARE_PATCH04_full.png')
orig=json.loads((V2/'psd_manifest.json').read_text());bank=[];visible=[]
for item in orig['layers']:
    name=item['name']
    if name=='STATIC_BARE':continue
    if name.startswith('BANK_') or name in ('CUSTOMER_GHOST','WORK_CUP_BACK','WORK_CUP_FRONT','CUP_TEA_T01','CUP_MILK_M01','CUP_TOP_P01'):
        bank.append(item)
    elif name.startswith('ORDER_') or name.startswith('SELECT_') or name=='TEXT_SAMPLE_DYNAMIC':
        bank.append(item)
    else:visible.append(item)
newlayer=lambda name,path:{'name':name,'file':str(Path(path).resolve()),'fit':'none','remove_background':'none'}
items=bank+[newlayer('BANK_FACE_'+n.upper(),layers_dir/('FACE_'+n.upper()+'_full.png')) for n in ('blink','happy','disappointed','squash','expand_mid')]+[newlayer('STATIC_BARE_PATCH04',layers_dir/'STATIC_BARE_PATCH04_full.png')]
for item in visible:
    if item['name']=='COUNTER_FRONT':
        items.append(newlayer('TEXT_LABELS_HEADER',layers_dir/'TEXT_LABELS_HEADER_full.png'))
        items += [newlayer('CUSTOMER_BODY_BASE',layers_dir/'CUSTOMER_BODY_BASE_full.png'),newlayer('FACE_NEUTRAL',layers_dir/'FACE_NEUTRAL_full.png')]
    items.append(item)
items += [newlayer('SELECTED_TRIO_TABLE',layers_dir/'SELECTED_TRIO_TABLE_full.png'),newlayer('ORDER_BUBBLE_TARGET_078',layers_dir/'ORDER_BUBBLE_TARGET_078_full.png'),newlayer('BTN_CONFIRM_TEXT',layers_dir/'BTN_CONFIRM_TEXT_full.png')]
manifest={'canvas':{'width':1024,'height':1536,'composite_background':'#ffffff'},'layers':items}
(SRC/'psd_manifest_full.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')

if '--neutral-only' in sys.argv:
    print(json.dumps({'stage':'NEUTRAL_ONLY','reconstructed_sha256':sha(REV/'reconstructed.png'),'manifest_sha256':sha(SRC/'psd_manifest_full.json'),'layers':len(items),'elapsed_seconds':round(time.monotonic()-START,2)}))
    sys.exit(0)
# Complete branch playback: each segment uses actual elapsed keyframes and distinct stable pose/motion samples.
timeline=[]
def add(branch,t,face,x,bubble,selection,work,duration):timeline.append(dict(branch=branch,t_ms=t,face=face,x=x,bubble=bubble,selection=selection,work=work,duration_ms=duration))
for t,work,dur in [(0,0,80),(80,1,140),(220,2,140),(360,3,180),(540,4,110),(650,5,50)]:add('confirm',t,'neutral',309,True,t<650,work,dur)
for t,face,dur in [(700,'neutral',40),(740,'squash',40),(780,'blink',70),(850,'blink',75),(925,'expand_mid',75),(1000,'happy',100)]:add('correct',t,face,309,True,False,5,dur)
for i,(t,x) in enumerate([(1100,309),(1210,286),(1320,216),(1430,101),(1550,-72)]):add('correct_exit',t,'happy',x,False,False,0,110 if i<4 else 90)
for i,(t,x) in enumerate([(1640,-72),(1730,74),(1820,214),(1910,292),(2090,309)]):add('next_entry',t,'neutral',x,i==4,False,0,90)
for t,f,dur in [(0,'neutral',40),(40,'squash',40),(80,'blink',70),(150,'blink',75),(225,'disappointed',125),(350,'blink',75),(425,'squash',75),(500,'neutral',150)]:add('wrong',t,f,309,True,t==0,0,dur)
for t,f,x,dur in [(0,'neutral',309,40),(40,'squash',309,40),(80,'blink',309,70),(150,'disappointed',309,150),(300,'disappointed',309,100),(400,'disappointed',280,100),(500,'disappointed',205,100),(600,'disappointed',90,100),(700,'disappointed',-72,50)]:add('timeout',t,f,x,t<300,False,0,dur)
for i,(t,x) in enumerate([(0,309),(90,284),(180,209),(270,90),(450,-72)]):add('voluntary_exit',t,'neutral',x,i==0,False,0,90)
frames=[];sheet=[]
for i,e in enumerate(timeline):
    ck(); f=fullframe(e['face'],e['x'],e['bubble'],e['selection'],e['work']);v=view(f);frames.append(v)
    if (e['branch'],e['t_ms']) in {('confirm',0),('confirm',650),('correct',1000),('correct_exit',1550),('next_entry',2090),('wrong',225),('wrong',500),('timeout',700),('voluntary_exit',450)}:sheet.append((e['branch'],e['t_ms'],v))
frames[0].save(REV/'animation_preview.gif',save_all=True,append_images=frames[1:],duration=[e['duration_ms'] for e in timeline],loop=0,optimize=False)
cs=Image.new('RGB',(360*3,640*3),(22,17,27))
for i,(_,__,im) in enumerate(sheet[:9]):cs.paste(im,((i%3)*360,(i//3)*640))
cs.save(REV/'component_sheet.png')
(REV/'animation_timeline.json').write_text(json.dumps(timeline,ensure_ascii=False,indent=2)+'\n')
ck()

print(json.dumps({'stage':'FULL','gif_sha256':sha(REV/'animation_preview.gif'),'component_sheet_sha256':sha(REV/'component_sheet.png'),'frame_count':len(frames),'elapsed_seconds':round(time.monotonic()-START,2)}))
