"""Assemble the semantic B master stack, proof images and PSD manifest."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import numpy as np,json,hashlib

ROOT=Path(__file__).resolve().parents[1]
PROJECT=ROOT.parents[3]
SRC=Image.open(PROJECT/'deliverables/art/U05-MILK-TEA-WORKSPACE-CONCEPT-20261013/v0.3/concept_B.png').convert('RGB')
W,H=SRC.size;L=ROOT/'source/layers';E=ROOT/'exports';R=ROOT/'review'
for p in (L,E,R):p.mkdir(parents=True,exist_ok=True)

object_data=json.loads((ROOT/'source/object_cut_data.json').read_text())
scene_data=json.loads((ROOT/'source/scene_cut_data.json').read_text())
state_data=json.loads((ROOT/'source/state_cut_data.json').read_text())
content_data=json.loads((ROOT/'source/cup_content_data.json').read_text())
object_ids=[x['id'] for x in object_data]
obj_order=['U05_B_T01','U05_B_T02','U05_B_T03','U05_B_M01','U05_B_M02','U05_B_M03',
           'U05_B_P01','U05_B_P02','U05_B_P03','U05_B_P04','U05_B_P05','U05_B_P06']

def file(name):return L/f'{name}_full.png'
def img(name):return Image.open(file(name)).convert('RGBA')
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def place(local,box):
    x0,y0,x1,y1=box
    small=local.resize((x1-x0,y1-y0),Image.Resampling.LANCZOS)
    full=Image.new('RGBA',(W,H),(0,0,0,0));full.alpha_composite(small,(x0,y0));return full

# The 12 canonical local-content sprites are present as PSD bank layers below
# opaque clean backing. They remain editable without making all alternatives
# visible in the sample preview. Only A target is shown in the speech bubble.
for id in ['CUP_TEA_T01','CUP_MILK_M01','CUP_TOP_P01']:
    local=Image.open(E/f'{id}.png').convert('RGBA')
    place(local,(577,326,728,506)).save(file(f'ORDER_SAMPLE_{id}'))

Image.open(L/'STATIC_BARE_full.png').convert('RGB').save(E/'STATIC_BARE.png')
layers=[]
def add(name,path,role,shown=True):
    path=Path(path);layers.append(dict(name=name,path=str(path.relative_to(ROOT)),
                                  role=role,shown_in_reconstruction=shown,
                                  sha256=sha(path)))
for x in content_data:add('BANK_'+x['id'],ROOT/x['layer'],'cup_shared_canonical_bank',False)
for state,x,y in [('LOCK_TEA',50,427),('LOCK_MILK',837,427),('LOCK_TOP',256,844)]:
    local=Image.open(E/f'{state}.png').convert('RGBA')
    full=Image.new('RGBA',(W,H),(0,0,0,0));full.alpha_composite(local,(x,y))
    p=file(state+'_BANK');full.save(p)
    add('BANK_'+state,p,'optional_locked_state_bank',False)
add('STATIC_BARE',L/'STATIC_BARE_full.png','source_preserved_static_plus_local_repair')

def state_canvas(name,x,y):
    im=Image.open(E/f'{name}.png').convert('RGBA')
    canvas=Image.new('RGBA',(W,H),(0,0,0,0));canvas.alpha_composite(im,(x,y))
    p=file(name+'_SAMPLE');canvas.save(p);return p

for name,x,y in [('SELECT_TEA',50,427),('SELECT_MILK',837,427),('SELECT_TOP',256,844)]:
    add(name+'_SAMPLE',state_canvas(name,x,y),'selected_state_sample')
for id in obj_order:add('OBJ_'+id,file('OBJ_'+id),'ingredient_semantic_object')
for id in ['T01','T02','T03','M01','M02','M03','P01','P02','P03','P04','P05','P06']:
    add('LABEL_PLATE_'+id,file('LABEL_PLATE_'+id),'independent_nameplate_base')
add('CUSTOMER_GHOST',file('CUSTOMER_GHOST'),'customer_visible_silhouette')
add('COUNTER_FRONT',file('COUNTER_FRONT'),'counter_foreground_occluder')
add('ORDER_BUBBLE_EMPTY',file('ORDER_BUBBLE_EMPTY'),'bubble_empty_single_finished_cup_only')
add('ORDER_CUP_BACK',file('ORDER_CUP_BACK'),'order_vessel_back')
for id in ['CUP_TEA_T01','CUP_MILK_M01','CUP_TOP_P01']:
    add('ORDER_SAMPLE_'+id,file('ORDER_SAMPLE_'+id),'same_canonical_content_transformed_order')
add('ORDER_CUP_FRONT',file('ORDER_CUP_FRONT'),'order_vessel_front')
add('ORDER_STRAW',file('ORDER_STRAW'),'order_straw')
add('WORK_CUP_BACK',file('WORK_CUP_BACK'),'work_vessel_back')
add('WORK_CUP_FRONT',file('WORK_CUP_FRONT'),'work_vessel_front')
for id in ['RECIPE','UNDO','SERVE']:
    add('BTN_'+id+'_BASE',file('BTN_'+id+'_BASE'),'independent_button_base')
    add('BTN_'+id+'_ICON',file('BTN_'+id+'_ICON'),'independent_button_icon')
add('TEXT_SAMPLE_DYNAMIC',file('TEXT_SAMPLE_DYNAMIC'),'licensed_sample_text_not_baked_runtime')

def render(variant='A',work_filled=False):
    out=Image.new('RGBA',(W,H),(0,0,0,0))
    for layer in layers:
        if layer['shown_in_reconstruction'] is False:continue
        n=layer['name']
        if n.startswith('ORDER_SAMPLE_CUP_') and variant!='A':continue
        if n=='WORK_CUP_FRONT' and work_filled:
            names={'A':['CUP_TEA_T01','CUP_MILK_M01','CUP_TOP_P01'],
                   'B':['CUP_TEA_T03','CUP_MILK_M03','CUP_TOP_P06']}[variant]
            for item in names:out.alpha_composite(img(item))
        if n=='ORDER_CUP_FRONT' and variant!='A':
            for item in ['CUP_TEA_T03','CUP_MILK_M03','CUP_TOP_P06']:
                local=Image.open(E/f'{item}.png').convert('RGBA')
                out.alpha_composite(place(local,(577,326,728,506)))
        out.alpha_composite(Image.open(ROOT/layer['path']).convert('RGBA'))
    return out.convert('RGB')

rec=render('A',False);rec.save(R/'reconstructed.png')
a=render('A',True);b=render('B',True)
combo=Image.new('RGB',(W*2,H));combo.paste(a,(0,0));combo.paste(b,(W,0))
combo.save(R/'composition_variants.png')
compare=Image.new('RGB',(W*2,H));compare.paste(SRC,(0,0));compare.paste(rec,(W,0));compare.save(R/'comparison.png')
diff=np.abs(np.asarray(rec).astype('int16')-np.asarray(SRC).astype('int16'))
heat=np.clip(diff*6,0,255).astype('uint8')
Image.fromarray(heat).save(R/'difference.png')

# Exact preservations are measured against explicit planned change rectangles.
allow=Image.new('L',(W,H));d=ImageDraw.Draw(allow)
for box in [(45,420,218,1035),(833,420,984,1035),(252,840,778,1085),
            (303,482,650,787),(464,283,847,528),(412,1087,607,1330),
            (27,1428,999,1536),(109,69,358,116),(827,69,944,116),
            (105,339,169,396),(889,339,965,396),(501,796,573,848)]:
    d.rectangle(box,fill=255)
outside=np.asarray(allow)==0
metrics=dict(max_channel=int(diff.max()),mean_channel=float(diff.mean()),
             changed_pixels=int(np.count_nonzero(diff.max(axis=2))),
             outside_planned_mask_changed_pixels=int(np.count_nonzero(diff.max(axis=2)[outside])),
             allow_mask_boxes_count=12)
(ROOT/'review/change_metrics.json').write_text(json.dumps(metrics,ensure_ascii=False,indent=2),encoding='utf-8')

# Both the skill manifest and detailed layer map come from this one array.
skill_layers=[dict(name=x['name'],file=str(Path(x['path']).relative_to('source')),
                   fit='none',remove_background='none') for x in layers]
manifest=dict(canvas=dict(width=W,height=H,composite_background='#ffffff'),
              output='workspace_b_master.psd',preview='../review/psd_skill_preview.png',
              layers=skill_layers)
(ROOT/'source/psd_manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
(ROOT/'source/LAYER_MANIFEST.json').write_text(json.dumps(dict(canvas=[W,H],
    frozen_source='deliverables/art/U05-MILK-TEA-WORKSPACE-CONCEPT-20261013/v0.3/concept_B.png',
    image2psd_manifest='source/psd_manifest.json',layer_order_bottom_to_top=layers,
    content_bank_explanation='12 canonical content layers are beneath opaque STATIC_BARE in PSD; visible target A uses same source sprites transformed to the order cup. Alternate variants are proven separately.',
    font='source/font/ZCOOLKuaiLe-Regular.ttf',font_license='source/font/OFL.txt'),
    ensure_ascii=False,indent=2),encoding='utf-8')

# Resource board: 12 objects and 12 independent content sprites on checker.
entries=[(x['id'],E/f"{x['id']}.png") for x in object_data]+[(x['id'],ROOT/x['export']) for x in content_data]
sheet=Image.new('RGB',(1200,6*208),(238,226,209));sd=ImageDraw.Draw(sheet)
for i,(name,p) in enumerate(entries):
    x=(i%4)*300;y=(i//4)*208
    for yy in range(y,y+172,16):
        for xx in range(x,x+300,16):
            sd.rectangle((xx,yy,xx+15,yy+15),fill=(223,223,223) if ((xx-x)//16+(yy-y)//16)%2 else (187,187,187))
    im=Image.open(p).convert('RGBA');im.thumbnail((255,158))
    cell=Image.new('RGBA',(300,172),(0,0,0,0));cell.alpha_composite(im,((300-im.width)//2,(172-im.height)//2))
    sheet.paste(cell.convert('RGB'),(x,y),cell.getchannel('A'))
    sd.text((x+9,y+179),name,fill=(77,45,29))
sheet.save(R/'resource_sheet.png')
print('layers',len(layers),'psd_manifest',ROOT/'source/psd_manifest.json')
print('metrics',metrics)
