"""Rebuild only U05 B's shared nameplate and type layers after batch presigns."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import hashlib, json, math, re, shutil, subprocess, sys

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT.parents[3]
OLD = PROJECT / 'deliverables/art/U05-B-WORKSPACE-ASSETS-20261014/v0.1'
FONT = OLD / 'source/font/ZCOOLKuaiLe-Regular.ttf'
SKILL = Path('/Users/yuanquan/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py')
E, L, R, SF = (ROOT / x for x in ('exports', 'source/layers', 'review', 'source/font'))
for p in (E, L, R, SF): p.mkdir(parents=True, exist_ok=True)

def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def js(p, obj): Path(p).write_text(json.dumps(obj, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

old_cut = json.loads((OLD/'CUT_MANIFEST.json').read_text())
old_layers = json.loads((OLD/'source/LAYER_MANIFEST.json').read_text())
for p in (OLD/'exports').glob('*.png'):
    if not p.name.startswith('LABEL_PLATE_'): shutil.copy2(p, E/p.name)
for n in ('ZCOOLKuaiLe-Regular.ttf', 'OFL.txt'): shutil.copy2(OLD/'source/font'/n, SF/n)
assert sha(SF/FONT.name) == old_cut['font']['sha256']
assert sha(SF/'OFL.txt') == old_cut['font']['license_sha256']

# Source plate P01 is a licensed project-original empty, warm paper plaque.
plate = Image.open(OLD/'exports/LABEL_PLATE_P01.png').convert('RGBA')
assert plate.size == (123, 45)
plate.save(E/'LABEL_PLATE_9SLICE.png')
insets = (18,18,12,12)
def nine_slice(src, width, height=45):
    l,r,t,b = insets; sw,sh = src.size
    assert width >= l+r and height >= t+b
    out=Image.new('RGBA',(width,height))
    xs=[(0,l,0,l),(l,sw-r,l,width-r),(sw-r,sw,width-r,width)]
    ys=[(0,t,0,t),(t,sh-b,t,height-b),(sh-b,sh,height-b,height)]
    for sx0,sx1,dx0,dx1 in xs:
        for sy0,sy1,dy0,dy1 in ys:
            piece=src.crop((sx0,sy0,sx1,sy1))
            if piece.size != (dx1-dx0,dy1-dy0): piece=piece.resize((dx1-dx0,dy1-dy0),Image.Resampling.BILINEAR)
            out.alpha_composite(piece,(dx0,dy0))
    return out

plate_positions={x['asset_id'].replace('LABEL_PLATE_',''):x['source_bbox_full']
                 for x in old_cut['exports'] if x['asset_id'].startswith('LABEL_PLATE_')}
for key,box in plate_positions.items():
    x0,y0,x1,y1=box
    full=Image.new('RGBA',(1024,1536))
    full.alpha_composite(nine_slice(plate,x1-x0,y1-y0),(x0,y0))
    full.save(L/f'LABEL_PLATE_{key}_full.png')

# Collect every Chinese character used by the current U05 product/UI flow and
# existing U05 implementation, then add dynamic digits and punctuation.
sources=[
    PROJECT/'deliverables/product/U05-B-PLAYABLE-20261013-PRODUCT-SPEC/v0.1/CONTENT_PLAN.md',
    PROJECT/'deliverables/product/U05-B-PLAYABLE-20261013-PRODUCT-SPEC/v0.1/PRD.md',
    PROJECT/'deliverables/ui/U05-B-UI-SPEC-20261014/v0.1/UI_SPEC.md',
    PROJECT/'deliverables/ui/U05-B-UI-SPEC-20261014/v0.1/screens/SCREEN_STATES.md',
    PROJECT/'deliverables/ui/U05-B-UI-SPEC-20261014/v0.1/components/COMPONENT_STATES.md',
    PROJECT/'apps/client/assets/labs/u05/milk_tea_lab.ts',
    PROJECT/'apps/client/assets/labs/u05/milk_tea_state.ts',
]
content=''.join(p.read_text(encoding='utf-8') for p in sources)
extra='0123456789:/+%-×（）()!?，。、：；·—… 空无完成确认交杯继续制作退出本局返回菜单再玩一局重试本档加载失败请选齐茶奶小料配方不对重做当前这杯'
glyphs=''.join(sorted(set(re.findall(r'[\u3400-\u9fff]',content+extra))))
glyphs += ''.join(sorted(set(c for c in extra if ord(c)<0x3400 or ord(c)>0x9fff)))
glyphs=''.join(dict.fromkeys(glyphs))
font=ImageFont.truetype(str(SF/FONT.name),34)
cells=[]
for c in glyphs:
    bbox=font.getbbox(c)
    if bbox is None: bbox=(0,0,0,0)
    w,h=bbox[2]-bbox[0],bbox[3]-bbox[1]
    cells.append((c,bbox,w,h,max(1,math.ceil(font.getlength(c)))))

def pack(side):
    x=y=2;row=0;records=[]
    for c,bb,w,h,adv in cells:
        if x+w+4>side: x=2;y+=row+4;row=0
        if y+h+4>side: return None
        records.append((c,bb,w,h,adv,x,y));x+=w+4;row=max(row,h)
    return records
side=next((s for s in (1024,2048,4096) if pack(s) is not None),None)
assert side is not None, 'Font atlas exceeds one page; new Tech presign required'
records=pack(side);atlas=Image.new('RGBA',(side,side))
ad=ImageDraw.Draw(atlas)
for c,bb,w,h,adv,x,y in records:
    if w and h: ad.text((x-bb[0],y-bb[1]),c,font=font,fill=(255,255,255,255))
atlas.save(E/'U05_ART_FONT.png')
fnt=['info face="ZCOOLKuaiLe" size=34 bold=0 italic=0 charset="" unicode=1 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=4,4',
     'common lineHeight=44 base=36 scaleW=%d scaleH=%d pages=1 packed=0'%(side,side),
     'page id=0 file="U05_ART_FONT.png"','chars count=%d'%len(records)]
metrics=[]
for c,bb,w,h,adv,x,y in records:
    fnt.append('char id=%d x=%d y=%d width=%d height=%d xoffset=%d yoffset=%d xadvance=%d page=0 chnl=15'%(ord(c),x,y,w,h,bb[0],bb[1],adv))
    metrics.append(dict(char=c,codepoint=ord(c),x=x,y=y,width=w,height=h,xoffset=bb[0],yoffset=bb[1],xadvance=adv))
fnt.append('kernings count=0')
(E/'U05_ART_FONT.fnt').write_text('\n'.join(fnt)+'\n',encoding='utf-8')
js(ROOT/'source/font_metrics.json',dict(font='ZCOOLKuaiLe-Regular.ttf',size=34,atlas=[side,side],lineHeight=44,base=36,characters=glyphs,glyphs=metrics,atlas_sha256=sha(E/'U05_ART_FONT.png'),fnt_sha256=sha(E/'U05_ART_FONT.fnt')))

# Same baseline layout; the only text change is the primary button caption.
S=3; text=Image.new('RGBA',(1024*S,1536*S));d=ImageDraw.Draw(text)
INK=(67,28,17,255);WHITE=(255,239,210,255)
def draw_center(s,cx,cy,size,color=INK):
    f=ImageFont.truetype(str(SF/FONT.name),size*S)
    bb=d.textbbox((0,0),s,font=f);tw=bb[2]-bb[0];th=bb[3]-bb[1]
    d.text((round(cx*S-tw/2-bb[0]),round(cy*S-th/2-bb[1])),s,font=f,fill=color)
for s,cx,cy,size in [('茶',137,366,39),('奶',935,367,39),('小料',536,823,34),
    ('当前订单 2/3',232,96,34),('01:48',881,96,39),
    ('幽灯茶',130,585,29),('月雾茶',130,787,29),('冥霞茶',130,990,29),
    ('云魄乳',908,585,29),('霜铃乳',908,787,29),('萤绢乳',908,990,29),
    ('鬼火珠',342,942,27),('梦纹冻',516,942,27),('灯芯脆',690,942,27),
    ('影鳞片',342,1060,27),('魂铃籽',516,1060,27),('夜羽酥',690,1060,27),
    ('查看配方',242,1484,39),('撤销',542,1484,40),('确认',845,1484,41)]:
    draw_center(s,cx,cy,size,WHITE if s.startswith('当前订单') or s=='01:48' else INK)
text=text.resize((1024,1536),Image.Resampling.LANCZOS)
text.save(L/'TEXT_SAMPLE_DYNAMIC_full.png')
text.crop((725,1444,961,1524)).save(E/'BTN_CONFIRM_TEXT.png')

# The full PSD references inherited baseline layers exactly, replacing only
# plate and text paths. Independent runtime assets remain byte-identical.
layers=[]
for item in old_layers['layer_order_bottom_to_top']:
    item=item.copy();name=item['name']
    p=(L/f'{name}_full.png') if name.startswith('LABEL_PLATE_') or name=='TEXT_SAMPLE_DYNAMIC' else OLD/item['path']
    item['source_task_version']='U05-B-COMPONENT-ASSETS-20261014/v0.1' if p.parent==L else 'U05-B-WORKSPACE-ASSETS-20261014/v0.1'
    item['path']=str(p)
    item['sha256']=sha(p)
    if name.startswith('LABEL_PLATE_'): item['role']='instance_of_LABEL_PLATE_9SLICE'
    if name=='TEXT_SAMPLE_DYNAMIC': item['role']='BMFont_layout_visual_sample_not_runtime_sprite'
    layers.append(item)
js(ROOT/'source/LAYER_MANIFEST.json',dict(canvas=[1024,1536],layer_order_bottom_to_top=layers,shared_plate='exports/LABEL_PLATE_9SLICE.png',font_atlas='exports/U05_ART_FONT.png',editability='Inherited B raster semantic layers and new per-instance plate/text rasters; PSD has editable raster layers, not vector/text objects.'))
psd_manifest=dict(canvas=dict(width=1024,height=1536,composite_background='#ffffff'),layers=[dict(name=x['name'],file=x['path'],fit='none',remove_background='none') for x in layers])
js(ROOT/'source/psd_manifest.json',psd_manifest)
subprocess.run([sys.executable,str(SKILL),'assemble','--manifest',str(ROOT/'source/psd_manifest.json'),'--output',str(ROOT/'source/workspace_b_master.psd'),'--preview',str(R/'psd_skill_preview.png')],check=True)

# Reconstruct from visible stack, proving the canvas at B source scale.
rec=Image.new('RGBA',(1024,1536))
for item in layers:
    if item['shown_in_reconstruction']: rec.alpha_composite(Image.open(item['path']).convert('RGBA'))
rec.convert('RGB').save(R/'reconstructed.png')
prior=Image.open(OLD/'review/reconstructed.png').convert('RGB')
comparison=Image.new('RGB',(2048,1536));comparison.paste(prior,(0,0));comparison.paste(rec.convert('RGB'),(1024,0))
comparison.save(R/'comparison.png')
board=Image.new('RGB',(900,440),(231,218,196));bd=ImageDraw.Draw(board)
for i,w in enumerate((123,130,131)):
    im=nine_slice(plate,w);im=im.resize((w*2,90),Image.Resampling.NEAREST)
    board.paste(im,(30+i*290,40),im)
    bd.text((30+i*290,145),f'{w}x45 | inset 18/18/12/12',fill=(64,36,26))
for i,name in enumerate(('幽灯茶','云魄乳','鬼火珠','确认','0123456789 01:48')):
    bd.text((30+(i%3)*290,220+(i//3)*100),name,font=ImageFont.truetype(str(SF/FONT.name),30),fill=(67,28,17))
board.save(R/'component_sheet.png')

new_cut=dict(task_id='U05-B-COMPONENT-ASSETS-20261014',version='v0.1',canvas=[1024,1536],
  predecessor='U05-B-WORKSPACE-ASSETS-20261014/v0.1',
  psd=dict(path=str(ROOT/'source/workspace_b_master.psd'),sha256=sha(ROOT/'source/workspace_b_master.psd'),layer_count=len(layers)),
  nine_slice=dict(asset_id='LABEL_PLATE_9SLICE',path=str(E/'LABEL_PLATE_9SLICE.png'),sha256=sha(E/'LABEL_PLATE_9SLICE.png'),source_asset_id='LABEL_PLATE_P01',source_sha256=sha(OLD/'exports/LABEL_PLATE_P01.png'),dimensions=[123,45],insets=dict(left=18,right=18,top=12,bottom=12),source_grid_x=[0,18,105,123],source_grid_y=[0,12,33,45],target_widths=[123,130,131],instances=plate_positions),
  font=dict(atlas=str(E/'U05_ART_FONT.png'),fnt=str(E/'U05_ART_FONT.fnt'),metrics='source/font_metrics.json',atlas_sha256=sha(E/'U05_ART_FONT.png'),fnt_sha256=sha(E/'U05_ART_FONT.fnt'),source_font_sha256=sha(SF/FONT.name),license_sha256=sha(SF/'OFL.txt'),glyph_count=len(records),characters=glyphs,dimensions=[side,side],runtime_tint='white alpha glyphs; client applies deep brown or warm cream tint'),
  exports=[],review=dict(reconstructed_sha256=sha(R/'reconstructed.png'),component_sheet_sha256=sha(R/'component_sheet.png'),comparison_sha256=sha(R/'comparison.png')))
old_by_id={x['asset_id']:x for x in old_cut['exports']}
for p in sorted(E.iterdir()):
    if not p.is_file():continue
    stem=p.stem
    old=old_by_id.get(stem)
    asset_id=stem if stem!='U05_ART_FONT' else ('U05_ART_FONT_ATLAS' if p.suffix=='.png' else 'U05_ART_FONT_FNT')
    planned='apps/client/assets/units/shops/milk_tea/textures/u05_b/'+p.name
    entry=dict(asset_id=asset_id,art_path=str(p),sha256=sha(p),client_path_plan=planned,
               client_import_status='PLANNED',client_uuid=None,
               usage='VISUAL_SAMPLE_ONLY' if stem=='BTN_CONFIRM_TEXT' else 'RUNTIME_CANDIDATE_GATE2_PENDING')
    if old:
        entry['inherited_from']='U05-B-WORKSPACE-ASSETS-20261014/v0.1'
        entry['byte_identical_to_predecessor']=entry['sha256']==old['sha256']
        entry['dimensions']=old['dimensions'];entry['source_bbox_full']=old.get('source_bbox_full')
    elif p.suffix=='.png':entry['dimensions']=list(Image.open(p).size)
    new_cut['exports'].append(entry)
js(ROOT/'CUT_MANIFEST.json',new_cut)
print('assets',len(new_cut['exports']),'inherited',sum(x.get('byte_identical_to_predecessor',False) for x in new_cut['exports']),'glyphs',len(records),'atlas',side,'layers',len(layers))
