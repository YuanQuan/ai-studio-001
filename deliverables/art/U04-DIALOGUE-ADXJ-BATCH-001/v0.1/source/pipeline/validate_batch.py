"""Independent byte, PSD flag, recomposition and U00 static checks."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import numpy as np
import json,hashlib,struct,datetime

ROOT=Path(__file__).resolve().parents[6]
OUT=Path(__file__).resolve().parents[2]
SOURCE=OUT/'source';EXPORT=OUT/'exports';REVIEW=OUT/'review'
DATA=json.loads((OUT/'production_data.json').read_text())
EMOTIONS=['happy','surprised','sad','smile','angry']
def rel(p):return str(Path(p).resolve().relative_to(ROOT))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def entry(p):
    p=Path(p);im=Image.open(p)
    return {'path':rel(p),'sha256':sha(p),'width':im.width,'height':im.height,'mode':im.mode}
def psd_layers(path):
    b=Path(path).read_bytes();assert b[:4]==b'8BPS' and struct.unpack_from('>H',b,4)[0]==1
    height,width=struct.unpack_from('>II',b,14)
    u32=lambda o:struct.unpack_from('>I',b,o)[0]
    o=26
    for _ in range(2):o+=4+u32(o)
    lm_length=u32(o);o+=4;limit=o+lm_length;info_length=u32(o);o+=4
    n=struct.unpack_from('>h',b,o)[0];o+=2;records=[]
    for _ in range(n):
        top,left,bottom,right=struct.unpack_from('>iiii',b,o);o+=16
        chn=struct.unpack_from('>H',b,o)[0];o+=2;channels=[]
        for _ in range(chn):
            cid,clen=struct.unpack_from('>hI',b,o);o+=6;channels.append((cid,clen))
        o+=8;opacity,clipping,flags,filler=b[o:o+4];o+=4
        extra=u32(o);o+=4;extra_bytes=b[o:o+extra];o+=extra
        # Pascal name follows two four-byte empty mask/range fields.
        no=8;namelen=extra_bytes[no];name=extra_bytes[no+1:no+1+namelen].decode('latin-1')
        records.append({'name':name,'hidden':bool(flags&2),'flags':flags,'rect':[left,top,right,bottom], 'channels':channels})
    for rec in records:
        for cid,clen in rec['channels']:
            block=b[o:o+clen];o+=clen;assert struct.unpack_from('>H',block,0)[0]==0
            if cid==-1:rec['alpha_nonzero_pixels']=int(np.count_nonzero(np.frombuffer(block[2:],dtype=np.uint8)))
        del rec['channels']
    assert o<=limit
    return {'canvas':[width,height],'layer_count':n,'layers':records}

bg_path=ROOT/'deliverables/art/SCENE-CLARITY-REDRAW-ASSET-20261010/v0.3/review/current_shops_on_v03_scene.png'
panel_path=ROOT/'deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1/exports/u04_dialogue_panel_9s.png'
bg=Image.open(bg_path).convert('RGB').crop((360,0,2180,1024)).resize((1280,720),Image.Resampling.LANCZOS).convert('RGBA')
panel=Image.open(panel_path).convert('RGBA')
def nine_slice(im,w,h):
    out=Image.new('RGBA',(w,h));xs=[0,48,464,512];ys=[0,48,208,256];dx=[0,48,w-48,w];dy=[0,48,h-48,h]
    for j in range(3):
        for i in range(3):
            tile=im.crop((xs[i],ys[j],xs[i+1],ys[j+1]));size=(dx[i+1]-dx[i],dy[j+1]-dy[j])
            if tile.size!=size:tile=tile.resize(size,Image.Resampling.BICUBIC)
            out.alpha_composite(tile,(dx[i],dy[j]))
    return out
panel_stretched=nine_slice(panel,1280,195)
font_path='/System/Library/Fonts/STHeiti Medium.ttc'
font=ImageFont.truetype(font_path,23)
def u00_scene(key,emotion,char):
    out=bg.copy();out.alpha_composite(panel_stretched,(0,525))
    # One physical display scale for all thirty states and stage combinations.
    ch=char.resize((570,570),Image.Resampling.LANCZOS)
    out.alpha_composite(ch,(10,150))
    draw=ImageDraw.Draw(out)
    who='阿灯' if key.startswith('ad') else '小锦';stage=key.split('_s')[-1]
    names={'happy':'高兴','surprised':'惊讶','sad':'悲伤','smile':'微笑','angry':'生气'}
    draw.text((710,560),f'{who} · {stage}魂 · {names[emotion]}',font=font,fill=(249,220,166,255))
    draw.text((710,612),'今晚的夜市刚亮灯。',font=font,fill=(244,238,224,255))
    p=REVIEW/f'{key}_{emotion}_u00_static.png';out.convert('RGB').save(p)
    return entry(p)

asset=[];mapping={'status':'INTERNAL_BATCH_READY_FOR_MAIN_ART_REVIEW','task_id':'U04-DIALOGUE-ADXJ-BATCH-001','stage_count':6,'stages':{}}
validation={'psd_canvas':[1024,1536],'stages':{},'all_psd_flags_pass':True}
combination={'status':'STATIC_INTERNAL_CHECK','background':entry(bg_path),'shared_panel':entry(panel_path),'scene_canvas':[1280,720],'combinations':{},'combination_count':0}
for key,stage in DATA.items():
    x0,y0,x1,y1=stage['face_rect'];base=EXPORT/f'u04_{key}_base.png';front=EXPORT/f'u04_{key}_front_occlusion.png'
    psd=SOURCE/f'u04_{key}_dialogue.psd';original=SOURCE/f'approved_original_{key}.png';manifest=SOURCE/f'{key}_layer_manifest.json'
    assert sha(original)==stage['approved_sha256']
    face_offset=(round(x0*.75),round(y0*.75)); baseim=Image.open(base).convert('RGBA');frontim=Image.open(front).convert('RGBA')
    psdinfo=psd_layers(psd);layers=psdinfo['layers']
    if psdinfo['canvas']!=[1024,1536] or len(layers)!=18:raise AssertionError(key+' PSD structure')
    hidden=[l['name'] for l in layers if l['hidden']];visible=[l['name'] for l in layers if not l['hidden']]
    assert len(hidden)==13 and len(visible)==5
    assert any('REFERENCE_APPROVED' in l['name'] for l in layers if l['hidden'])
    assert all(l['alpha_nonzero_pixels']>0 for l in layers)
    assert all(('SMILE' in l['name'] or 'FRONT' in l['name'] or 'BASE' in l['name']) for l in layers if not l['hidden'])
    # PSD merged cache, skill preview and source-layer smile must agree on the same matte.
    cache=Image.open(psd).convert('RGB');preview=Image.open(REVIEW/f'{key}_psd_preview.png').convert('RGB')
    cache_diff=np.abs(np.array(cache,dtype=np.int16)-np.array(preview,dtype=np.int16))
    assert not np.any(cache_diff),key+' PSD cache mismatch'
    stage_map={'approved_source':entry(original),'original_manifest_source':{'path':rel(stage['approved_source']),'sha256':stage['approved_sha256']},
      'source_canvas':[1024,1536],'psd':{'path':rel(psd),'sha256':sha(psd)},
      'layer_manifest':{'path':rel(manifest),'sha256':sha(manifest)},
      'base':{**entry(base),'source_rect_xyxy':stage['base_rect'],'source_to_export_scale':.75},
      'face':{'editable_source_canvas':[256,256],'export_canvas':[192,192],'source_rect_xyxy':stage['face_rect'],'pivot_source_xy':[x0+128,y0+128],
              'pivot_export_xy':[96,96],'offset_in_base_export_xy':list(face_offset),'states':{}},
      'front_occlusion':{**entry(front),'source_rect_xyxy':stage['face_rect'],'offset_in_base_export_xy':list(face_offset),'contains_stage_glasses':stage['glasses']},
      'composition_order':['base','one selected face state','front_occlusion'],
      'skin_sample_pixels':stage['skin_sample_pixels'],'changed_rgb_pixels':stage['changed_rgb_pixels'],'changed_rgb_outside_mask':stage['changed_rgb_outside_mask'],
      'feature_boxes':stage['feature_boxes']}
    errors={};target_files=[]
    for emotion in EMOTIONS:
        face=EXPORT/f'u04_{key}_face_{emotion}.png';faceim=Image.open(face).convert('RGBA')
        assert faceim.size==(192,192) and baseim.size==(768,768)
        comp=baseim.copy();comp.alpha_composite(faceim,face_offset);comp.alpha_composite(frontim,face_offset)
        p=REVIEW/f'{key}_{emotion}_export_recomposition.png';comp.save(p)
        # Independently recompute the export target from the editable sources.
        fresh=Image.new('RGBA',(256,256))
        sources={}
        for role in ('brows','eyes','mouth'):
            layer=SOURCE/f'{key}_{emotion}_{role}.png';sources[role]=entry(layer);fresh.alpha_composite(Image.open(layer).convert('RGBA'))
        fresh=fresh.resize((192,192),Image.Resampling.LANCZOS)
        target=Image.open(base).convert('RGBA');target.alpha_composite(fresh,face_offset);target.alpha_composite(Image.open(front).convert('RGBA'),face_offset)
        delta=np.abs(np.array(target,dtype=np.int16)-np.array(comp,dtype=np.int16))
        errors[emotion]={'max_channel_delta':int(delta.max()),'nonzero_channels':int(np.count_nonzero(delta))}
        assert errors[emotion]['nonzero_channels']==0
        stage_map['face']['states'][emotion]={'combined':entry(face),'editable_sources':sources,'recomposition':entry(p),
            'u00_static_review':u00_scene(key,emotion,comp)}
        combination['combinations'][f'{key}_{emotion}']={'source':stage_map['approved_source'],'face':entry(face),
            'recomposition':entry(p),'u00_static_review':stage_map['face']['states'][emotion]['u00_static_review'],
            'max_channel_delta':0,'nonzero_channels':0}
        combination['combination_count']+=1
    mapping['stages'][key]=stage_map
    validation['stages'][key]={'psd':{'path':rel(psd),'sha256':sha(psd),'canvas':[1024,1536],
           'layer_count':18,'visible_layers':visible,'hidden_layers':hidden,'hidden_flag_count':len(hidden),
           'all_layers_alpha_nonzero':True,'layer_records':layers,'cache_vs_preview_max_delta':int(cache_diff.max())},
           'editable_expression_layers':15,'export_recomposition':errors,
           'skin_source_rgb_outside_mask_changed_pixels':stage['changed_rgb_outside_mask'],
           'result':'PASS_STATIC_STRUCTURE_AND_EXPORT'}
    for p in [original,base,front,psd,manifest,SOURCE/f'{key}_clean_full.png',SOURCE/f'{key}_feature_mask.png',SOURCE/f'{key}_front_occlusion.png',REVIEW/f'{key}_five_state_board.png']:
        asset.append(entry(p) if p.suffix.lower() in ('.png','.psd') else {'path':rel(p),'sha256':sha(p)})
    for emotion in EMOTIONS:
        asset.append(entry(EXPORT/f'u04_{key}_face_{emotion}.png'))
        for role in ('brows','eyes','mouth'):asset.append(entry(SOURCE/f'{key}_{emotion}_{role}.png'))

assert combination['combination_count']==30
assert len(mapping['stages'])==6
board=Image.new('RGB',(5*320,6*180),'#172234');bd=ImageDraw.Draw(board)
for row,key in enumerate(DATA):
    for col,emotion in enumerate(EMOTIONS):
        tile=Image.open(REVIEW/f'{key}_{emotion}_u00_static.png').convert('RGB').resize((320,180),Image.Resampling.LANCZOS)
        board.paste(tile,(col*320,row*180))
        bd.text((col*320+5,row*180+5),f'{key} {emotion}',fill='white')
board_path=REVIEW/'batch_30_combinations.png';board.save(board_path)
combination['batch_board']=entry(board_path);asset.append(entry(board_path))
asset_manifest={'task_id':'U04-DIALOGUE-ADXJ-BATCH-001','version':'v0.1','status':'INTERNAL_BATCH_READY_FOR_MAIN_ART_REVIEW',
  'approval_scope':'用户已批Gate1和Art/Tech同批预签；本批实际切片等待主Art整合统一Gate2','count':{'stage_psd':6,'base':6,'face_combined':30,'editable_feature_sources':90,'front_occlusion':6},'assets':asset,
  'client_path':'PLANNED_NOT_IMPORTED','client_uuid':'NOT_IMPORTED'}
for name,data in [('ASSET_MANIFEST.json',asset_manifest),('LAYER_EXPORT_MAP.json',mapping),('PSD_VALIDATION.json',validation),('COMBINATION_CHECK.json',combination)]:
    (OUT/name).write_text(json.dumps(data,ensure_ascii=False,indent=2))
print('validated 6 PSD, 30 combinations, 90 editable part sources, 30 U00 static scenes')
