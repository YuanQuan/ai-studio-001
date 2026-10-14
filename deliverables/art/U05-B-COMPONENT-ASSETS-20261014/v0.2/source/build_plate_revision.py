"""U05 v0.2: replace only the shared plate's silhouette and border."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import hashlib, json, shutil, subprocess, sys
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
PROJECT=ROOT.parents[3]
OLD=PROJECT/'deliverables/art/U05-B-COMPONENT-ASSETS-20261014/v0.1'
TECH=PROJECT/'deliverables/tech_lead/U05-B-COMPONENT-TECH-20261014/v0.2/TECH_PRESIGN.json'
SKILL=Path('/Users/yuanquan/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py')
E,L,R,F=(ROOT/x for x in ('exports','source/layers','review','source/font'))
for p in (E,L,R,F):p.mkdir(parents=True,exist_ok=True)
art_sign=json.loads((ROOT/'ART_PRESIGN.json').read_text())
tech_sign=json.loads(TECH.read_text())
assert art_sign['batch_id']==tech_sign['batch_id']=='U05-B-COMPONENT-ASSETS-20261014/v0.2/LABEL-02'

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def put_json(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

old_cut=json.loads((OLD/'CUT_MANIFEST.json').read_text())
for p in (OLD/'exports').iterdir():
    if p.name!='LABEL_PLATE_9SLICE.png':shutil.copy2(p,E/p.name)
for p in (OLD/'source/font').iterdir():shutil.copy2(p,F/p.name)
shutil.copy2(OLD/'source/font_metrics.json',ROOT/'source/font_metrics.json')

old_plate=Image.open(OLD/'exports/LABEL_PLATE_9SLICE.png').convert('RGBA')
assert old_plate.size==(123,45)
# Paper color is sampled from the v0.1 center and stretched inside a newly
# drawn 8 px rounded rectangle. Border/shadow colors derive from its rim.
paper=Image.new('RGBA',(123,45))
op=old_plate.load();pp=paper.load()
for y in range(45):
    sy=9+round(y*22/44)
    for x in range(123):
        sx=24+round(x*75/122)
        r,g,b,_=op[sx,sy]
        pp[x,y]=(r,g,b,255)
mask=Image.new('L',(123,45));md=ImageDraw.Draw(mask)
md.rounded_rectangle((1,1,121,42),radius=8,fill=255)
paper.putalpha(mask)
plate=Image.new('RGBA',(123,45))
d=ImageDraw.Draw(plate)
d.rounded_rectangle((1,2,121,44),radius=8,fill=(75,29,17,58))
plate.alpha_composite(paper)
d=ImageDraw.Draw(plate)
d.rounded_rectangle((1,1,121,42),radius=8,outline=(83,34,20,218),width=2)
plate.save(E/'LABEL_PLATE_9SLICE.png')

def nine_slice(src,w,h):
    l,r,t,b=18,18,12,12;sw,sh=src.size
    out=Image.new('RGBA',(w,h))
    xs=((0,l,0,l),(l,sw-r,l,w-r),(sw-r,sw,w-r,w))
    ys=((0,t,0,t),(t,sh-b,t,h-b),(sh-b,sh,h-b,h))
    for sx0,sx1,dx0,dx1 in xs:
        for sy0,sy1,dy0,dy1 in ys:
            piece=src.crop((sx0,sy0,sx1,sy1))
            if piece.size!=(dx1-dx0,dy1-dy0):piece=piece.resize((dx1-dx0,dy1-dy0),Image.Resampling.BILINEAR)
            out.alpha_composite(piece,(dx0,dy0))
    return out

positions=old_cut['nine_slice']['instances']
for key,box in positions.items():
    x0,y0,x1,y1=box
    layer=Image.new('RGBA',(1024,1536))
    layer.alpha_composite(nine_slice(plate,x1-x0,y1-y0),(x0,y0))
    layer.save(L/f'LABEL_PLATE_{key}_full.png')

old_layers=json.loads((OLD/'source/LAYER_MANIFEST.json').read_text())
layers=[]
for original in old_layers['layer_order_bottom_to_top']:
    item=original.copy()
    name=item['name']
    p=L/f'{name}_full.png' if name.startswith('LABEL_PLATE_') else Path(item['path'])
    item['path']=str(p);item['sha256']=sha(p)
    if name.startswith('LABEL_PLATE_'):
        item['source_task_version']='U05-B-COMPONENT-ASSETS-20261014/v0.2'
        item['role']='instance_of_v0.2_LABEL_PLATE_9SLICE'
    layers.append(item)
put_json(ROOT/'source/LAYER_MANIFEST.json',dict(canvas=[1024,1536],predecessor='U05-B-COMPONENT-ASSETS-20261014/v0.1',layer_order_bottom_to_top=layers,shared_plate='exports/LABEL_PLATE_9SLICE.png',font_atlas='v0.1 byte-identical U05_ART_FONT.png',editability='61 raster semantic layers; only 12 nameplate instances replaced; all other layers referenced from unchanged v0.1 source.'))
put_json(ROOT/'source/psd_manifest.json',dict(canvas=dict(width=1024,height=1536,composite_background='#ffffff'),layers=[dict(name=x['name'],file=x['path'],fit='none',remove_background='none') for x in layers]))
subprocess.run([sys.executable,str(SKILL),'assemble','--manifest',str(ROOT/'source/psd_manifest.json'),'--output',str(ROOT/'source/workspace_b_master.psd'),'--preview',str(R/'psd_skill_preview.png')],check=True,stdout=subprocess.DEVNULL)

rec=Image.new('RGBA',(1024,1536))
for item in layers:
    if item['shown_in_reconstruction']:rec.alpha_composite(Image.open(item['path']).convert('RGBA'))
rec.convert('RGB').save(R/'reconstructed.png')
prior=Image.open(OLD/'review/reconstructed.png').convert('RGB')
comparison=Image.new('RGB',(2048,1536));comparison.paste(prior,(0,0));comparison.paste(rec.convert('RGB'),(1024,0))
comparison.save(R/'comparison.png')

board=Image.new('RGB',(900,260),(231,218,196));bd=ImageDraw.Draw(board)
for i,w in enumerate((123,130,131)):
    sample=nine_slice(plate,w,45)
    big=sample.resize((w*2,90),Image.Resampling.NEAREST)
    board.paste(big,(30+290*i,35),big)
    bd.text((30+290*i,145),f'{w}x45 | inset 18/18/12/12',fill=(64,36,26))
font=ImageFont.truetype(str(F/'ZCOOLKuaiLe-Regular.ttf'),27)
for i,s in enumerate(('幽灯茶','云魄乳','鬼火珠')):
    bd.text((30+290*i,195),s,font=font,fill=(67,28,17))
board.save(R/'component_sheet.png')

prior_pixels=np.array(prior);new_pixels=np.array(rec.convert('RGB'))
change=np.any(prior_pixels!=new_pixels,axis=2)
allow=np.zeros((1536,1024),dtype=bool)
for x0,y0,x1,y1 in positions.values():allow[y0:y1,x0:x1]=True
assert not np.any(change & ~allow)
assert np.array_equal(new_pixels,np.array(Image.open(R/'psd_skill_preview.png').convert('RGB')))

cut=old_cut.copy()
cut.update(task_id='U05-B-COMPONENT-ASSETS-20261014',version='v0.2',predecessor='U05-B-COMPONENT-ASSETS-20261014/v0.1')
cut['psd']=dict(path=str(ROOT/'source/workspace_b_master.psd'),sha256=sha(ROOT/'source/workspace_b_master.psd'),layer_count=61)
cut['nine_slice']=dict(old_cut['nine_slice'])
cut['nine_slice'].update(path=str(E/'LABEL_PLATE_9SLICE.png'),sha256=sha(E/'LABEL_PLATE_9SLICE.png'),revision='small_radius_paper_tab_thin_border_light_shadow',
                         source_grid_x=[0,18,105,123],source_grid_y=[0,12,33,45],insets=dict(left=18,right=18,top=12,bottom=12))
cut['font']=dict(old_cut['font'])
cut['font'].update(atlas=str(E/'U05_ART_FONT.png'),fnt=str(E/'U05_ART_FONT.fnt'),metrics='source/font_metrics.json')
cut['exports']=[]
for original in old_cut['exports']:
    item=original.copy();p=E/Path(item['art_path']).name
    item['art_path']=str(p);item['sha256']=sha(p)
    item['inherited_from']='U05-B-COMPONENT-ASSETS-20261014/v0.1' if item['asset_id']!='LABEL_PLATE_9SLICE' else None
    item['byte_identical_to_predecessor']=item['sha256']==original['sha256']
    cut['exports'].append(item)
cut['review']=dict(reconstructed_sha256=sha(R/'reconstructed.png'),component_sheet_sha256=sha(R/'component_sheet.png'),comparison_sha256=sha(R/'comparison.png'),changed_pixels_vs_v01=int(change.sum()),outside_twelve_plate_rectangles_changed_pixels=0,psd_preview_pixel_equal=True)
put_json(ROOT/'CUT_MANIFEST.json',cut)
assert len(cut['exports'])==49
assert sum(x['byte_identical_to_predecessor'] for x in cut['exports'])==48
print('v0.2 ready; plate',cut['nine_slice']['sha256'],'unchanged exports',48,'changed pixels',int(change.sum()))
