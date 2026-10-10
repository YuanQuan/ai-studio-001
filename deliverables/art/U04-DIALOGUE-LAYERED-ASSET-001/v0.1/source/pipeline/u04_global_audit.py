from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib,struct,copy,numpy as np
ROOT=Path.cwd();R=ROOT/'deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1';rel=lambda p:str(Path(p).resolve().relative_to(ROOT))
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
code_order=['mt','at','ac','aj','ad','xj'];stages=[0,2,3];states=['happy','surprised','sad','smile','angry']
expected=[f'{c}_s{s}' for c in code_order for s in stages]
approved=json.loads((ROOT/'deliverables/art/U04-MANAGER-PORTRAITS-001/v0.3/APPROVED_COMBINATION_MANIFEST.json').read_text())
lock={Path(f['path']).stem.replace('mgr_',''):f for f in approved['files'] if Path(f['path']).stem.startswith('mgr_') and '_s' in Path(f['path']).stem and 'board' not in f['path']}
if set(expected)!=set(lock):raise AssertionError(('lock',set(expected)-set(lock)))
existing=json.loads((R/'LAYER_EXPORT_MAP.json').read_text())
main={'mt_s0':existing['stages']['MT_S0'] if 'stages' in existing else existing}
main.update({k.lower():v for k,v in json.loads((R/'source/main_batch_layer_export_map.json').read_text()).items()})
B=ROOT/'deliverables/art/U04-DIALOGUE-ACAJ-BATCH-001/v0.1';C=ROOT/'deliverables/art/U04-DIALOGUE-ADXJ-BATCH-001/v0.1'
for s in json.loads((B/'LAYER_EXPORT_MAP.json').read_text())['stages']:main[s['stage_key'].lower()]=s
for k,v in json.loads((C/'LAYER_EXPORT_MAP.json').read_text())['stages'].items():main[k]=v
if set(main)!=set(expected):raise AssertionError(('stages',set(expected)-set(main),set(main)-set(expected)))
def rewrite(obj):
 if isinstance(obj,dict):
  obj={k:rewrite(v) for k,v in obj.items()}
  p=obj.get('path')
  if isinstance(p,str):
   for support in ('U04-DIALOGUE-ACAJ-BATCH-001','U04-DIALOGUE-ADXJ-BATCH-001'):
    prefix=f'deliverables/art/{support}/v0.1/'
    if p.startswith(prefix):
     sub=p[len(prefix):]
     if sub.startswith('source/') or sub.startswith('exports/'):
      mainpath=R/sub
      if not mainpath.exists():raise AssertionError(('missing integrated path',mainpath))
      obj['path']=rel(mainpath)
  return obj
 if isinstance(obj,list):return [rewrite(x) for x in obj]
 return obj
main={k:rewrite(v) for k,v in main.items()}
# A file reference is valid only when the bytes at the declared path match the declared hash.
def verify_ref(o):
 if isinstance(o,dict):
  if 'path' in o and 'sha256' in o and isinstance(o['path'],str):
   p=ROOT/o['path'];
   if not p.exists():raise AssertionError(('missing',p))
   if sha(p)!=o['sha256']:raise AssertionError(('sha',p,sha(p),o['sha256']))
  for x in o.values():verify_ref(x)
 elif isinstance(o,list):
  for x in o:verify_ref(x)
verify_ref(main)
for key in expected:
 approved_file=ROOT/lock[key]['path'];assert sha(approved_file)==lock[key]['sha256']
 src=main[key]['approved_source'];assert src['sha256']==lock[key]['sha256'],(key,'approved source mismatch',src['sha256'],lock[key]['sha256'])
# Validate PSD dimensions, layer record count, hidden flags independently from support statements.
def parse_psd(p):
 data=p.read_bytes();assert data[:4]==b'8BPS';canvas=[struct.unpack_from('>I',data,18)[0],struct.unpack_from('>I',data,14)[0]]
 u32=lambda q:struct.unpack_from('>I',data,q)[0];u16=lambda q:struct.unpack_from('>H',data,q)[0];o=26;o+=4+u32(o);o+=4+u32(o);o+=4;o+=4;n=struct.unpack_from('>h',data,o)[0];o+=2;flags=[]
 for i in range(n):
  o+=16;c=u16(o);o+=2+c*6;o+=8;flags.append(int(data[o+2]));o+=4;ex=u32(o);o+=4+ex
 return {'canvas':canvas,'layer_count':n,'visible_count':sum((x&2)==0 for x in flags),'hidden_count':sum((x&2)!=0 for x in flags),'flags':flags}
psds={};combo=[];flat=[]
for key in expected:
 stage=main[key];code,soul=key.split('_s');soul=int(soul)
 p=R/f'source/u04_{key}_dialogue.psd';assert stage['psd']['path']==rel(p);d=parse_psd(p)
 if d['canvas']!=[1024,1536] or d['layer_count']!=18 or d['visible_count']!=5 or d['hidden_count']!=13:raise AssertionError((key,'PSD structure',d))
 expected_visible=[0,1,2,3,16] if key=='mt_s0' else [0,4,5,6,16]
 if [i for i,f in enumerate(d['flags']) if (f&2)==0]!=expected_visible:raise AssertionError((key,'default must be SMILE',d['flags']))
 psds[key.upper()]={'path':rel(p),'sha256':sha(p),'canvas':d['canvas'],'layer_count':18,'visible_layers':5,'hidden_layers':13,'reference_hidden':bool(d['flags'][-1]&2),'default_visible_expression':'SMILE','visible_layer_indices':expected_visible,'result':'PASS_STATIC_PSD_PARSE'}
 base=stage['base'];bp=ROOT/base['path'];bi=Image.open(bp).convert('RGBA');assert bi.width<=768 and bi.height<=1024
 face=stage['face'];fcanvas=face.get('export_canvas',face.get('canvas'))
 front=stage.get('front_hair',stage.get('front_occlusion'))
 if front is None:raise AssertionError((key,'front absent'))
 fp=ROOT/front['path'];fi=Image.open(fp).convert('RGBA')
 boff=front.get('offset_in_base_export_xy',front.get('offset_in_base_xy'))
 foff=face.get('offset_in_base_export_xy',face.get('offset_in_base_xy'))
 if boff is None or foff is None:raise AssertionError((key,'offset absent'))
 for e in states:
  st=face['states'][e];fref=st['combined'];ip=ROOT/fref['path'];im=Image.open(ip).convert('RGBA')
  if max(im.size)>256 or list(im.size)!=list(fcanvas):raise AssertionError((key,e,'face size',im.size,fcanvas))
  if len(st['editable_sources'])!=3:raise AssertionError((key,e,'editable sources'))
  for part in ('brows','eyes','mouth'):
   pref=st['editable_sources'][part];pi=Image.open(ROOT/pref['path']).convert('RGBA')
   if pi.getchannel('A').getbbox() is None:raise AssertionError((key,e,part,'empty alpha'))
  recom=bi.copy();recom.alpha_composite(im,tuple(foff));recom.alpha_composite(fi,tuple(boff))
  # Each support batch supplied a full or export-scale recomposition; crop full to base rect when needed.
  target_path=st.get('recomposition',{}).get('path')
  if key=='mt_s0':target_path=rel(R/f'review/mt_s0_{e}_export_recomposition.png')
  elif key in ('mt_s2','mt_s3','at_s0','at_s2','at_s3'):target_path=rel(R/f'review/{key}_{e}_export_recomposition.png')
  target=Image.open(ROOT/target_path).convert('RGBA')
  if target.size!=recom.size:
   rect=base['source_rect_xyxy'];target=target.crop(tuple(rect))
  diff=np.abs(np.asarray(target,dtype=np.int16)-np.asarray(recom,dtype=np.int16))
  if diff.max()!=0:raise AssertionError((key,e,'static recompose mismatch',int(diff.max()),target_path))
  combo.append({'key':[code,soul,e],'stage_key':key.upper(),'asset_ids':{'base':f'U04_PORTRAIT_{code.upper()}_S{soul}_BASE','face':f'U04_FACE_{code.upper()}_S{soul}_{e.upper()}','front':f'U04_FRONT_{code.upper()}_S{soul}'},'paths':{'base':base['path'],'face':fref['path'],'front':front['path'],'recomposition_review':target_path},'export_recomposition_max_delta':0,'status':'PASS_STATIC'})
  flat.append((key,e,recom))
 print(key,'PSD+5 states PASS')
if len(combo)!=90:raise AssertionError(len(combo))
# User-visible 90-grid uses same-scale face crops where available. C and B full comps have different base scales,
# so render each from the already verified source PSD visible layer equivalent at 1024 coordinates where possible.
font=ImageFont.truetype('/System/Library/Fonts/STHeiti Medium.ttc',20)
name={'mt':'孟桃','at':'阿棠','ac':'阿炭','aj':'阿角','ad':'阿灯','xj':'小锦'};en={'happy':'高兴','surprised':'惊讶','sad':'悲伤','smile':'微笑','angry':'生气'}
# Use independent support stage boards for feature-rich review and global grid from each batch export recompose.
cellw,cellh,tileh=300,400,370;board=Image.new('RGB',(cellw*5,cellh*18),'#172232');draw=ImageDraw.Draw(board)
for row,key in enumerate(expected):
 st=main[key];code,soul=key.split('_s');geom=st['handoff_normalized'] if 'handoff_normalized' in st else None
 face=st['face'];off=face.get('offset_in_base_export_xy',face.get('offset_in_base_xy'))
 fcanvas=face.get('export_canvas',face.get('canvas'));fw,fh=fcanvas
 cropw=round(fw*1.5);croph=round(cropw*tileh/cellw)
 cx=off[0]+fw/2;cy=off[1]+fh/2+fh*0.05
 x0=round(cx-cropw/2);y0=round(cy-croph/2)
 for col,e in enumerate(states):
  recom=next(img for k,emo,img in flat if k==key and emo==e)
  crop=recom.crop((x0,y0,x0+cropw,y0+croph))
  bg=Image.new('RGBA',crop.size,(23,34,50,255));bg.alpha_composite(crop)
  tile=bg.convert('RGB').resize((cellw,tileh),Image.Resampling.LANCZOS);board.paste(tile,(col*cellw,row*cellh))
  draw.text((col*cellw+10,row*cellh+374),f'{name[code]} {soul}魂 · {en[e]}',font=font,fill='#f4d994')
board.save(R/'review/all_90_combinations.png')
# Manifest flat register: each runtime PNG gets stable ID, exact bytes, and only PLANNED Client path.
assets=[]
def add(id,path,client,kind):
 p=ROOT/path;im=Image.open(p);assets.append({'asset_id':id,'kind':kind,'art_path':path,'sha256':sha(p),'size_px':[im.width,im.height],'mode':im.mode,'art_version':'v0.1','client_planned_path':client,'client_import_status':'NOT_IMPORTED','client_uuid':None})
for key in expected:
 code,soul=key.split('_s');soul=int(soul);s=main[key]
 add(f'U04_PORTRAIT_{code.upper()}_S{soul}_BASE',s['base']['path'],f'apps/client/assets/units/dialogue/portraits/tex_u04_{key}_base.png','base')
 front=s.get('front_hair',s.get('front_occlusion'));add(f'U04_FRONT_{code.upper()}_S{soul}',front['path'],f'apps/client/assets/units/dialogue/portraits/tex_u04_{key}_front.png','front_occlusion')
 for e in states:add(f'U04_FACE_{code.upper()}_S{soul}_{e.upper()}',s['face']['states'][e]['combined']['path'],f'apps/client/assets/units/dialogue/faces/tex_u04_{key}_face_{e}.png','localized_face')
add('U04_DIALOGUE_PANEL_9S',rel(R/'exports/u04_dialogue_panel_9s.png'),'apps/client/assets/units/dialogue/ui/tex_u04_dialogue_panel_9s.png','nine_slice_panel')
for at,name2 in [('bottom_left','BOTTOM_LEFT'),('top_right','TOP_RIGHT')]:add(f'U04_DIALOGUE_CORNER_CLOUD_{name2}',rel(R/f'exports/u04_dialogue_corner_cloud_{at}.png'),f'apps/client/assets/units/dialogue/ui/tex_u04_dialogue_corner_cloud_{at}.png','fixed_decor')
if len(assets)!=129 or len(set(a['asset_id'] for a in assets))!=129:raise AssertionError(('assets',len(assets)))
# Stage map source schema is preserved per producing batch; normalized handoff carries common geometry.
for key,s in main.items():
 face=s['face'];front=s.get('front_hair',s.get('front_occlusion'));base=s['base'];s['handoff_normalized']={'base':base['path'],'base_source_rect_xyxy':base['source_rect_xyxy'],'base_source_to_export_scale':base.get('source_to_export_scale',1),'face_source_rect_xyxy':face['source_rect_xyxy'],'face_source_pivot_xy':face['pivot_source_xy'],'face_export_canvas_px':face.get('export_canvas',face.get('canvas')),'face_offset_in_base_export_xy':face.get('offset_in_base_export_xy',face.get('offset_in_base_xy')),'front':front['path'],'front_offset_in_base_export_xy':front.get('offset_in_base_export_xy',front.get('offset_in_base_xy')),'composition_order':['base','one face state','front'],'switch_rule':'切店长或魂阶段时替换本组基底/表情/遮挡并同步姓名；只改表情时保留店长与魂阶段'}
 s['integration_provenance']='MAIN_ART' if key in ['mt_s0','mt_s2','mt_s3','at_s0','at_s2','at_s3'] else ('SUPPORT_B_ACAJ' if key.startswith(('ac_','aj_')) else 'SUPPORT_C_ADXJ')
mapout={'task_id':'U04-DIALOGUE-LAYERED-ASSET-001','version':'v0.1','status':'GATE2_USER_REVIEW_CANDIDATE','canvas_source':[1024,1536],'stage_count':18,'face_state_count':90,'states':states,'stages':{k.upper():main[k] for k in expected},'panel':{'path':rel(R/'exports/u04_dialogue_panel_9s.png'),'sha256':sha(R/'exports/u04_dialogue_panel_9s.png'),'source_size':[512,256],'insets_px':[48,48,48,48]}}
(R/'LAYER_EXPORT_MAP.json').write_text(json.dumps(mapout,ensure_ascii=False,indent=2))
manifest={'task_id':'U04-DIALOGUE-LAYERED-ASSET-001','version':'v0.1','status':'GATE2_USER_REVIEW_CANDIDATE','approved_combination_manifest':{'path':'deliverables/art/U04-MANAGER-PORTRAITS-001/v0.3/APPROVED_COMBINATION_MANIFEST.json','sha256':sha(ROOT/'deliverables/art/U04-MANAGER-PORTRAITS-001/v0.3/APPROVED_COMBINATION_MANIFEST.json')},'count':{'manager':6,'soul_stage_per_manager':3,'portrait_psd':18,'base':18,'face':90,'front':18,'runtime_png':129,'editable_face_source_layers':270},'assets':assets,'psd':[{'stage_key':k.upper(),'path':psds[k.upper()]['path'],'sha256':psds[k.upper()]['sha256'],'canvas_px':[1024,1536],'layer_count':18} for k in expected],'source_editable_layers':{k.upper():{e:{part:main[k]['face']['states'][e]['editable_sources'][part] for part in ('brows','eyes','mouth')} for e in states} for k in expected},'support_integration_logs':[{'path':rel(R/f'source/integration_{t}_copy_log.json'),'sha256':sha(R/f'source/integration_{t}_copy_log.json')} for t in ('acaj','adxj')],'client_import_status':'NOT_IMPORTED','client_uuid':None}
(R/'ASSET_MANIFEST.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
(R/'PSD_VALIDATION.json').write_text(json.dumps({'task_id':'U04-DIALOGUE-LAYERED-ASSET-001','status':'STATIC_STRUCTURE_PASS','count':18,'stages':psds,'batch_source_validations':[{'path':rel(B/'PSD_VALIDATION.json'),'sha256':sha(B/'PSD_VALIDATION.json')},{'path':rel(C/'PSD_VALIDATION.json'),'sha256':sha(C/'PSD_VALIDATION.json')}],'runtime_import':'NOT_TESTED'},ensure_ascii=False,indent=2))
(R/'COMBINATION_CHECK.json').write_text(json.dumps({'task_id':'U04-DIALOGUE-LAYERED-ASSET-001','status':'STATIC_90_COMBINATIONS_PASS','count':90,'combination_keys':combo,'board':{'path':rel(R/'review/all_90_combinations.png'),'sha256':sha(R/'review/all_90_combinations.png'),'size_px':list(board.size)},'source_background':'deliverables/art/SCENE-CLARITY-REDRAW-ASSET-20261010/v0.3/review/current_shops_on_v03_scene.png','runtime_state':'NOT_TESTED'},ensure_ascii=False,indent=2))
print('GLOBAL_AUDIT_PASS',len(main),'PSD',len(psds),'combinations',len(combo),'runtime_png',len(assets),'board',board.size)
