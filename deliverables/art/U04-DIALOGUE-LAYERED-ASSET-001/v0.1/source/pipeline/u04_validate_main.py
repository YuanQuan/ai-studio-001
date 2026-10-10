from pathlib import Path
from PIL import Image
import json,hashlib,struct,numpy as np
R=Path('deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1').resolve();S=R/'source';E=R/'exports';V=R/'review'
keys=['mt_s2','mt_s3','at_s0','at_s2','at_s3'];states=['happy','surprised','sad','smile','angry'];F={'mt_s2':(360,100,616,356),'mt_s3':(360,100,616,356),'at_s0':(380,180,636,436),'at_s2':(380,160,636,416),'at_s3':(380,150,636,406)}
def rel(p):return str(p.relative_to(R.parent.parent.parent.parent))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def rec(p):
 p=Path(p);im=Image.open(p);return {'path':rel(p),'sha256':sha(p),'width':im.width,'height':im.height,'mode':im.mode}
allmap={};valid={}
for key in keys:
 base=Image.open(E/f'u04_{key}_base.png').convert('RGBA');f=F[key];full=Image.open(S/f'{key}_clean_face_integrated.png').convert('RGBA');bb=full.getchannel('A').getbbox();rect=[bb[0],0,bb[2],1024]
 frontfull=Image.open(S/f'{key}_front_hair_integrated.png').convert('RGBA');hb=frontfull.getchannel('A').getbbox();front=Image.open(E/f'u04_{key}_front_hair.png').convert('RGBA')
 m={'stage_key':key.upper(),'approved_source':rec(S/f'approved_original_{key}.png'),'psd':{'path':rel(S/f'u04_{key}_dialogue.psd'),'sha256':sha(S/f'u04_{key}_dialogue.psd')},'base':{**rec(E/f'u04_{key}_base.png'),'source_rect_xyxy':rect},'face':{'canvas':[256,256],'source_rect_xyxy':list(f),'pivot_source_xy':[(f[0]+f[2])//2,(f[1]+f[3])//2],'offset_in_base_xy':[f[0]-rect[0],f[1]],'states':{}},'front_hair':{**rec(E/f'u04_{key}_front_hair.png'),'source_rect_xyxy':list(hb),'offset_in_base_xy':[hb[0]-rect[0],hb[1]]},'composition_order':['base','one selected face state','front_hair']}
 errors={}
 for e in states:
  m['face']['states'][e]={'combined':rec(E/f'u04_{key}_face_{e}.png'),'editable_sources':{part:rec(S/f'{key}_{e}_{part}.png') for part in ['brows','eyes','mouth']}}
  recom=base.copy();recom.alpha_composite(Image.open(E/f'u04_{key}_face_{e}.png').convert('RGBA'),tuple(m['face']['offset_in_base_xy']));recom.alpha_composite(front,tuple(m['front_hair']['offset_in_base_xy']));recom.save(V/f'{key}_{e}_export_recomposition.png')
  target=full.copy();layer=Image.new('RGBA',target.size);layer.paste(Image.open(E/f'u04_{key}_face_{e}.png').convert('RGBA'),f[:2]);target.alpha_composite(layer);target.alpha_composite(frontfull);target=target.crop(rect)
  diff=np.abs(np.asarray(target,dtype=np.int16)-np.asarray(recom,dtype=np.int16));errors[e]={'max_channel_delta':int(diff.max()),'nonzero_channels':int(np.count_nonzero(diff))}
  if diff.max()>0:raise AssertionError((key,e,'recomposition mismatch',diff.max()))
 allmap[key.upper()]=m
 p=S/f'u04_{key}_dialogue.psd';data=p.read_bytes();u32=lambda q:struct.unpack_from('>I',data,q)[0];u16=lambda q:struct.unpack_from('>H',data,q)[0];o=26;o+=4+u32(o);o+=4+u32(o);o+=4;o+=4;n=struct.unpack_from('>h',data,o)[0];o+=2;flags=[]
 for i in range(n):
  o+=16;c=u16(o);o+=2+c*6;o+=8;flags.append(int(data[o+2]));o+=4;ex=u32(o);o+=4+ex
 names=[x['name'] for x in json.loads((S/f'{key}_layer_manifest.json').read_text())['layers']][::-1]
 visible=[nm for nm,fl in zip(names,flags) if fl&2==0];hidden=[nm for nm,fl in zip(names,flags) if fl&2]
 if n!=18 or len(visible)!=5 or len(hidden)!=13 or not any('REFERENCE_APPROVED' in x for x in hidden):raise AssertionError((key,n,visible,hidden))
 valid[key.upper()]={'psd':{'path':rel(p),'sha256':sha(p),'canvas':[1024,1536],'layer_count':n,'visible_layers':visible,'hidden_layers':hidden,'hidden_flag_count':len(hidden),'reference_layer_hidden':True,'editable_expression_layers':15},'recomposition_export_vs_full':errors,'result':'PASS_STATIC_STRUCTURE'}
 print(key,'PASS',n,len(visible),len(hidden),errors,flush=True)
(S/'main_batch_layer_export_map.json').write_text(json.dumps(allmap,ensure_ascii=False,indent=2));(S/'main_batch_psd_validation.json').write_text(json.dumps(valid,ensure_ascii=False,indent=2))
