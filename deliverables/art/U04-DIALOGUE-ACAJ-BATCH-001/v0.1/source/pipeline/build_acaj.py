"""逐源校准阿炭/阿角六阶段；只写本批次目录。"""
from pathlib import Path
from collections import deque
import hashlib, json, shutil, subprocess, struct, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT=Path(__file__).resolve().parents[6]
OUT=ROOT/'deliverables/art/U04-DIALOGUE-ACAJ-BATCH-001/v0.1'
APP=ROOT/'deliverables/art/U04-MANAGER-PORTRAITS-001/v0.3/APPROVED_COMBINATION_MANIFEST.json'
SCENE=ROOT/'deliverables/art/SCENE-CLARITY-REDRAW-ASSET-20261010/v0.3/review/current_shops_on_v03_scene.png'
SKILL=Path('/Users/yuanquan/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py')
STAGES={
 'ac_s0':{'face':(350,95,606,351),'brows':[(374,156,458,205),(453,140,538,190)],'eyes':[(378,179,468,243),(455,169,544,234)],'mouth':(435,226,532,288),'mouth_anchor':(483.5,250),'nose':(445,213,465,245),'name':'阿炭 0魂'},
 'ac_s2':{'face':(355,75,611,331),'brows':[(380,154,460,202),(458,131,548,183)],'eyes':[(382,172,472,235),(458,155,552,221)],'mouth':(433,211,534,266),'nose':(447,201,470,235),'name':'阿炭 2魂'},
 'ac_s3':{'face':(365,65,621,321),'brows':[(394,127,470,180),(470,103,558,164)],'eyes':[(398,156,478,207),(480,142,560,197)],'mouth':(436,195,545,253),'nose':(457,179,479,218),'name':'阿炭 3魂'},
 'aj_s0':{'face':(355,130,611,386),'brows':[(382,203,470,250),(467,167,558,232)],'eyes':[(383,228,484,300),(466,197,568,271)],'mouth':(458,274,566,334),'mouth_anchor':(512,310),'nose':(467,273,487,293),'name':'阿角 0魂'},
 'aj_s2':{'face':(365,130,621,386),'brows':[(394,201,484,252),(479,170,571,231)],'eyes':[(395,229,490,296),(478,200,580,270)],'mouth':(458,257,568,325),'mouth_anchor':(513,300),'nose':(477,268,498,290),'name':'阿角 2魂'},
 'aj_s3':{'face':(365,145,621,401),'brows':[(397,218,484,264),(484,185,578,245)],'eyes':[(397,238,492,307),(481,212,583,279)],'mouth':(458,267,570,338),'mouth_anchor':(514,312),'nose':(480,279,501,304),'name':'阿角 3魂'},
}
EMOTIONS=['happy','surprised','sad','smile','angry']
def sha(path): return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def rel(path): return str(Path(path).resolve().relative_to(ROOT))
def rec(path):
 p=Path(path); im=Image.open(p); return {'path':rel(p),'sha256':sha(p),'width':im.width,'height':im.height,'mode':im.mode}
def smooth(v,a,b):
 q=np.clip((v-a)/(b-a),0,1);return q*q*(3-2*q)
def ellipse_mask(shape,box,feather=3):
 h,w=shape; x0,y0,x1,y1=box; yy,xx=np.mgrid[0:h,0:w];cx=(x0+x1)/2;cy=(y0+y1)/2;rx=(x1-x0)/2;ry=(y1-y0)/2
 dist=np.sqrt(((xx-cx)/rx)**2+((yy-cy)/ry)**2);return np.clip((1-dist)*min(rx,ry)/feather,0,1).astype(np.float32)
def roundrect_mask(shape,feather=5):
 h,w=shape;yy,xx=np.mgrid[0:h,0:w]
 edge=np.minimum.reduce([xx,w-1-xx,yy,h-1-yy]).astype(np.float32)
 return smooth(edge,0,feather).astype(np.float32)
def fit_skin(src,box,all_boxes):
 h,w=src.shape[:2];x0,y0,x1,y1=box;pad=27;xa=max(0,x0-pad);xb=min(w,x1+pad);ya=max(0,y0-pad);yb=min(h,y1+pad)
 yy,xx=np.mgrid[ya:yb,xa:xb];pix=src[ya:yb,xa:xb,:3].astype(float); alpha=src[ya:yb,xa:xb,3]
 ring=(xx<x0-4)|(xx>x1+4)|(yy<y0-4)|(yy>y1+4)
 skin=(pix[:,:,0]>232)&(pix[:,:,1]>175)&(pix[:,:,2]>132)&(pix[:,:,0]-pix[:,:,1]<76)&(pix[:,:,1]-pix[:,:,2]<58)&(alpha>180)
 for ob in all_boxes:
  ox0,oy0,ox1,oy1=ob;ring &= ~((xx>=ox0)&(xx<ox1)&(yy>=oy0)&(yy<oy1))
 good=ring&skin
 if good.sum()<15: good=ring&(alpha>180)&(pix[:,:,0]>145)
 if good.sum()<8: raise ValueError(f'no skin samples {box}')
 xv=(xx[good]-(x0+x1)/2)/100;yv=(yy[good]-(y0+y1)/2)/100
 A=np.column_stack([np.ones(len(xv)),xv,yv,xv*yv]);RGB=pix[good]
 co=np.linalg.lstsq(A,RGB,rcond=None)[0]
 Y,X=np.mgrid[y0:y1,x0:x1];xxv=(X-(x0+x1)/2)/100;yyv=(Y-(y0+y1)/2)/100
 B=np.stack([np.ones_like(xxv),xxv,yyv,xxv*yyv],axis=-1)
 median=np.median(RGB,axis=0)
 return np.clip(B@co,median-17,median+17).astype(np.float32), int(good.sum())
def hair_component(source,face):
 x0=max(0,face[0]-55);x1=min(source.shape[1],face[2]+45);y0=max(0,face[1]-100);y1=min(source.shape[0],face[3])
 pix=source[y0:y1,x0:x1,:3].astype(np.float32); luma=.299*pix[:,:,0]+.587*pix[:,:,1]+.114*pix[:,:,2]
 candidate=(luma<150)&(source[y0:y1,x0:x1,3]>80)&((pix.max(axis=2)-pix.min(axis=2))<75)
 h,w=candidate.shape;seen=np.zeros((h,w),bool);q=deque()
 seed_rows=min(h,max(15,face[1]+20-y0))
 for y in range(seed_rows):
  xs=np.where(candidate[y])[0]
  for x in xs:
   if not seen[y,x]:seen[y,x]=True;q.append((y,x))
 while q:
  y,x=q.popleft()
  for yy,xx in ((y-1,x),(y+1,x),(y,x-1),(y,x+1),(y-1,x-1),(y-1,x+1),(y+1,x-1),(y+1,x+1)):
   if 0<=yy<h and 0<=xx<w and candidate[yy,xx] and not seen[yy,xx]:seen[yy,xx]=True;q.append((yy,xx))
 mask=np.zeros(source.shape[:2],np.uint8);mask[y0:y1,x0:x1]=np.uint8(seen)*255
 return np.asarray(Image.fromarray(mask).filter(ImageFilter.MaxFilter(3)),np.float32)/255
def make_feature(source,box,skin,kind,hairmask):
 x0,y0,x1,y1=box;src=source[y0:y1,x0:x1].astype(np.float32);h,w=src.shape[:2];mask=roundrect_mask((h,w),4)
 luma=.299*src[:,:,0]+.587*src[:,:,1]+.114*src[:,:,2];sl=.299*skin[:,:,0]+.587*skin[:,:,1]+.114*skin[:,:,2]
 if kind=='brows': strength=smooth(sl-luma,22,65)
 elif kind=='eyes': strength=np.maximum(smooth(sl-luma,18,52),smooth(luma-sl,18,52))
 else: strength=np.maximum(smooth(sl-luma,16,48),smooth(luma-sl,18,55))
 a=np.uint8(np.clip(src[:,:,3]*strength*mask*(1-hairmask[y0:y1,x0:x1]),0,255));rgba=src.astype(np.uint8);rgba[:,:,3]=a
 return Image.fromarray(rgba,'RGBA')
def place(part,box,face,transform=(0,1,0,0)):
 dx,sy,deg,dy=transform;im=part
 if sy!=1:im=im.resize((im.width,max(1,round(im.height*sy))),Image.Resampling.LANCZOS)
 if deg:im=im.rotate(deg,Image.Resampling.BICUBIC,expand=True)
 layer=Image.new('RGBA',(256,256));x=round(box[0]-face[0]+dx+(part.width-im.width)/2);y=round(box[1]-face[1]+dy+(part.height-im.height)/2)
 layer.alpha_composite(im,(x,y));return layer
def draw_mouth(box,face,state,src,anchor=None):
 x0,y0,x1,y1=box; anchor=anchor or ((x0+x1)/2,(y0+y1)/2);mx=anchor[0]-face[0];my=anchor[1]-face[1];R=4;im=Image.new('RGBA',(1024,1024));d=ImageDraw.Draw(im)
 ink=(67,37,34,245);deep=(90,34,39,245);lip=(218,105,90,245)
 def pt(x,y):return (round(x*R),round(y*R))
 def arc(points,fill,width):d.line([pt(*p) for p in points],fill=fill,width=round(width*R),joint='curve')
 if state=='happy':
  d.ellipse((*pt(mx-20,my-8),*pt(mx+20,my+14)),fill=deep)
  d.ellipse((*pt(mx-13,my+6),*pt(mx+13,my+14)),fill=lip)
  arc([(mx-23,my-8),(mx-12,my+1),(mx,my+4),(mx+13,my+1),(mx+23,my-10)],ink,2.4)
 elif state=='surprised':
  d.ellipse((*pt(mx-9,my-13),*pt(mx+10,my+15)),fill=ink)
  d.ellipse((*pt(mx-6,my-10),*pt(mx+7,my+12)),fill=deep)
  d.arc((*pt(mx-5,my+3),*pt(mx+6,my+13)),start=0,end=180,fill=lip,width=round(2*R))
 elif state=='sad':
  arc([(mx-18,my+9),(mx-9,my+2),(mx,my-1),(mx+10,my+2),(mx+20,my+10)],ink,3)
 elif state=='angry':
  arc([(mx-18,my+7),(mx-5,my+3),(mx+8,my+1),(mx+20,my+3)],ink,3)
 return im.resize((256,256),Image.Resampling.LANCZOS)
def alpha_edge(src):
 a=np.asarray(src.getchannel('A'),np.float32);a=np.uint8(np.clip((a-40)*255/215,0,255));out=src.copy();out.putalpha(Image.fromarray(a));return out
def front_overlay(src,hairmask,boxes):
 arr=np.asarray(src).copy();h,w=arr.shape[:2];region=np.zeros((h,w),bool)
 for x0,y0,x1,y1 in boxes:
  region[y0:y1,x0:x1]=True
 arr[:,:,3]=np.uint8(np.clip(arr[:,:,3]*hairmask*region,0,255))
 return Image.fromarray(arr,'RGBA')
def crop_nonempty(img,cap=(768,1024)):
 a=np.asarray(img.getchannel('A'));bb=Image.fromarray(np.uint8(a>=20)*255).getbbox();
 if not bb:raise ValueError('empty image')
 x0,y0,x1,y1=bb
 # approved full body is taller than budget: dialogue bust uses source top 1024
 y0=0;y1=min(1024,max(1024,y1));x0=max(0,x0-4);x1=min(img.width,x1+4)
 if x1-x0>cap[0] or y1-y0>cap[1]:raise ValueError(f'output exceeds cap {x0,y0,x1,y1}')
 return img.crop((x0,y0,x1,y1)),[x0,y0,x1,y1]
def make_adapter():
 target=OUT/'source/pipeline/image2psd_hidden_adapter.py'
 code=SKILL.read_text();code=code.replace('    opacity: float = 1.0\n','    opacity: float = 1.0\n    visible: bool = True\n',1)
 code=code.replace('    if spec.get("visible", True) is False:\n        return None\n','    visible = bool(spec.get("visible", True))\n',1)
 code=code.replace('blend_mode=blend_mode, opacity=opacity)','blend_mode=blend_mode, opacity=opacity, visible=visible)')
 code=code.replace('        comp.alpha_composite(layer.image.convert("RGBA"))','        if layer.visible:\n            comp.alpha_composite(layer.image.convert("RGBA"))',1)
 code=code.replace('bytes([255, 0, 0, 0])  # opacity, clipping, flags, filler','bytes([255, 0, 2 if not layer.visible else 0, 0])  # hidden PSD flag',1)
 target.write_text(code);return target
def parse_psd(path,names):
 data=path.read_bytes();u32=lambda o:struct.unpack_from('>I',data,o)[0];u16=lambda o:struct.unpack_from('>H',data,o)[0];o=26;o+=4+u32(o);o+=4+u32(o);o+=8;n=struct.unpack_from('>h',data,o)[0];o+=2;flags=[]
 for _ in range(n):
  o+=16;c=u16(o);o+=2+c*6;o+=8;flags.append(data[o+2]);o+=4;ex=u32(o);o+=4+ex
 return {'layer_count':n,'visible_layers':[name for name,f in zip(names[::-1],flags) if not f&2],'hidden_layers':[name for name,f in zip(names[::-1],flags) if f&2]}
def main():
 for folder in ['exports','review','source','source/pipeline','source/layers']: (OUT/folder).mkdir(parents=True,exist_ok=True)
 approved={e['path']:e['sha256'] for e in json.loads(APP.read_text())['files']}; adapter=make_adapter();maps=[];valid=[];combos=[];manifest=[];batches=[]
 scene=Image.open(SCENE).convert('RGB').resize((1280,720))
 for key,c in STAGES.items():
  char,ss=key.split('_');stage=int(ss[1:]);prefix=f'u04_{key}';source=ROOT/f'deliverables/art/U04-MANAGER-PORTRAITS-001/v0.3/characters/mgr_{key}.png'
  if sha(source)!=approved[rel(source)]:raise ValueError('approved SHA mismatch '+key)
  original=Image.open(source).convert('RGBA'); edge=alpha_edge(original);src=np.asarray(edge).copy();face=c['face'];boxes=c['brows']+c['eyes']+[c['mouth']];hairmask=hair_component(src,face)
  skins=[];features=[];repair=np.zeros((1536,1024),np.float32);samplecounts=[]
  for box in boxes:
   sk,n=fit_skin(src,box,boxes);skins.append(sk);samplecounts.append(n)
  for box,sk,kind in zip(boxes,skins,['brows']*2+['eyes']*2+['mouth']):features.append(make_feature(src,box,sk,kind,hairmask))
  cleaned=src.copy().astype(np.float32)
  for box,sk in zip(boxes,skins):
   x0,y0,x1,y1=box;h=y1-y0;w=x1-x0;mask=roundrect_mask((h,w),10)
   nose=c['nose'];nm=ellipse_mask((h,w),(nose[0]-x0,nose[1]-y0,nose[2]-x0,nose[3]-y0),3)
   mask*=1-nm
   repair[y0:y1,x0:x1]=np.maximum(repair[y0:y1,x0:x1],mask)
   cleaned[y0:y1,x0:x1,:3]=cleaned[y0:y1,x0:x1,:3]*(1-mask[:,:,None])+sk*mask[:,:,None]
  cleaned=np.uint8(np.clip(cleaned,0,255));basefull=Image.fromarray(cleaned,'RGBA');front=front_overlay(edge,hairmask,boxes)
  maskpath=OUT/f'source/{prefix}_repair_mask.png';Image.fromarray(np.uint8(np.clip(repair*255,0,255))).save(maskpath)
  outside_changed=int(np.count_nonzero(np.any(src[:,:,:3]!=cleaned[:,:,:3],axis=2)&(repair==0)))
  if outside_changed:raise ValueError(f'RGB changed outside repair mask: {key} {outside_changed}')
  base_path=OUT/f'source/{prefix}_clean_base_full.png';basefull.save(base_path)
  front_path=OUT/f'source/{prefix}_front_full.png';front.save(front_path)
  refpath=OUT/f'source/{prefix}_approved_reference.png';shutil.copyfile(source,refpath)
  baser,baserect=crop_nonempty(basefull);basexp=OUT/f'exports/{prefix}_base.png';baser.save(basexp)
  fb=front.getbbox();frontrec=None
  if fb:
   frontcrop=front.crop(fb);frontxp=OUT/f'exports/{prefix}_front_hair.png';frontcrop.save(frontxp);frontrec={**rec(frontxp),'source_rect_xyxy':list(fb),'offset_in_base_xy':[fb[0]-baserect[0],fb[1]-baserect[1]]}
  layers=[{'name':'REFERENCE_APPROVED / hidden source','file':str(refpath),'visible':False},{'name':'BASE / clean silhouette and face','file':str(base_path),'visible':True}]
  states={};diffs={};stagefaces=[];preview_cards=[]
  for emotion in EMOTIONS:
   brow=Image.new('RGBA',(256,256));eyes=Image.new('RGBA',(256,256))
   for i in range(2):
    if emotion=='smile':bt=(0,1,0,0);et=(0,1,0,0)
    elif emotion=='happy':bt=(0,1,-4 if i==0 else 3,-6);et=(0,.72,0,2)
    elif emotion=='surprised':bt=(0,1,-2 if i==0 else 2,-9);et=(0,1.18,0,-2)
    elif emotion=='sad':bt=(0,1,10 if i==0 else -10,4);et=(0,.82,0,3)
    else:bt=(0,1,-12 if i==0 else 12,6);et=(0,.82,-4 if i==0 else 4,2)
    brow.alpha_composite(place(features[i],c['brows'][i],face,bt));eyes.alpha_composite(place(features[2+i],c['eyes'][i],face,et))
   mouth=place(features[4],c['mouth'],face) if emotion=='smile' else draw_mouth(c['mouth'],face,emotion,src,c.get('mouth_anchor'))
   pieces={'brows':brow,'eyes':eyes,'mouth':mouth};sources={};combined=Image.new('RGBA',(256,256))
   for part,im in pieces.items():
    path=OUT/f'source/layers/{prefix}_{emotion}_{part}.png';im.save(path);sources[part]=rec(path);combined.alpha_composite(im)
    layers.append({'name':f'{emotion.upper()} / {part}','file':str(path),'x':face[0],'y':face[1],'visible':emotion=='smile'})
   exp=OUT/f'exports/{prefix}_face_{emotion}.png';combined.save(exp)
   full=basefull.copy();ov=Image.new('RGBA',full.size);ov.paste(combined,face[:2]);full.alpha_composite(ov);full.alpha_composite(front)
   fullpath=OUT/f'review/{prefix}_{emotion}_full_recomposition.png';full.save(fullpath)
   target=baser.copy();target.alpha_composite(combined,(face[0]-baserect[0],face[1]-baserect[1]));
   if fb:target.alpha_composite(frontcrop,(fb[0]-baserect[0],fb[1]-baserect[1]))
   diff=np.abs(np.asarray(target,dtype=np.int16)-np.asarray(full.crop(tuple(baserect)),dtype=np.int16));diffs[emotion]={'max_channel_delta':int(diff.max()),'nonzero_channels':int(np.count_nonzero(diff))}
   # Face board preserves each stage's source-scale face and distinct state.
   crop=full.crop((face[0]-35,face[1]-15,face[2]+35,face[3]+15));bg=Image.new('RGBA',crop.size,'#17202d');bg.alpha_composite(crop);stagefaces.append(bg.convert('RGB').resize((320,280)))
   states[emotion]={'combined':rec(exp),'editable_sources':sources,'recomposition':rec(fullpath),'export_vs_full':diffs[emotion]}
   combos.append({'key':f'{char.upper()}_S{stage}_{emotion.upper()}','source':rel(source),'base':rel(basexp),'face':rel(exp),'front_hair':frontrec['path'] if frontrec else None,'full_recomposition':rel(fullpath),'max_channel_delta':int(diff.max())})
  if frontrec:layers.append({'name':'FRONT HAIR / source occlusion','file':str(front_path),'visible':True})
  lm={'canvas':{'width':1024,'height':1536,'composite_background':'#17202d'},'layers':layers};lmp=OUT/f'source/{prefix}_layer_manifest.json';lmp.write_text(json.dumps(lm,ensure_ascii=False,indent=2))
  psd=OUT/f'source/{prefix}_dialogue.psd';psdpreview=OUT/f'review/{prefix}_psd_preview.png'
  subprocess.run([sys.executable,str(adapter),'assemble','--manifest',str(lmp),'--output',str(psd),'--preview',str(psdpreview)],check=True,stdout=subprocess.DEVNULL)
  parsed=parse_psd(psd,[x['name'] for x in layers]);expected_visible=['BASE / clean silhouette and face','SMILE / brows','SMILE / eyes','SMILE / mouth']+(['FRONT HAIR / source occlusion'] if frontrec else [])
  if parsed['visible_layers']!=expected_visible[::-1]:raise ValueError(f'PSD visible mismatch {key}: {parsed}')
  with Image.open(psd) as checkpsd:
   checkpsd.load()
   if checkpsd.size!=(1024,1536):raise ValueError('PSD canvas mismatch')
  hidden_nonzero=all(Image.open(x['file']).getchannel('A').getbbox() is not None for x in layers if not x['visible'])
  if not hidden_nonzero:raise ValueError(f'hidden PSD source empty {key}')
  cached=Image.open(psdpreview).convert('RGB');onbg=Image.new('RGBA',(1024,1536),'#17202d');onbg.alpha_composite(Image.open(OUT/f'review/{prefix}_smile_full_recomposition.png').convert('RGBA'))
  cache_diff=np.abs(np.asarray(cached,dtype=np.int16)-np.asarray(onbg.convert('RGB'),dtype=np.int16))
  if int(cache_diff.max())>2:raise ValueError(f'PSD smile cache differs {key}: {cache_diff.max()}')
  board=Image.new('RGB',(320*5,320),'#17202d');dr=ImageDraw.Draw(board)
  for i,(emotion,im) in enumerate(zip(EMOTIONS,stagefaces)):
   board.paste(im,(i*320,0));dr.text((i*320+10,292),f'{key.upper()} {emotion}',fill='#ead6b6')
  boardpath=OUT/f'review/{prefix}_five_state_board.png';board.save(boardpath)
  # Same physical U00 background is used in each per-stage smile scene, static only.
  smile=Image.open(OUT/f'review/{prefix}_smile_full_recomposition.png').convert('RGBA').crop(tuple(baserect));smile.thumbnail((510,650));u00=scene.copy().convert('RGBA');u00.alpha_composite(smile,(65,720-smile.height));u00p=OUT/f'review/{prefix}_u00_static_smile.png';u00.convert('RGB').save(u00p)
  faceinfo={'canvas':[256,256],'source_rect_xyxy':list(face),'pivot_source_xy':[face[0]+128,face[1]+128],'offset_in_base_xy':[face[0]-baserect[0],face[1]-baserect[1]],'states':states}
  maps.append({'stage_key':key.upper(),'approved_source':rec(source),'source_canvas':[1024,1536],'psd':{'path':rel(psd),'sha256':sha(psd)},'base':{**rec(basexp),'source_rect_xyxy':baserect},'face':faceinfo,'front_hair':frontrec,'composition_order':['base','one selected face state','front_hair if present'],'stage_board':rec(boardpath),'u00_static_smile':rec(u00p)})
  valid.append({'stage_key':key.upper(),'psd':{'path':rel(psd),'sha256':sha(psd),'canvas':[1024,1536],**parsed,'hidden_reference_nonzero_alpha':hidden_nonzero,'hidden_other_states_nonzero_alpha':hidden_nonzero,'pil_psd_load':'PASS','cache_vs_smile_max_channel_delta':int(cache_diff.max())},'repair_mask':rec(maskpath),'repair_mask_pixels':int(np.count_nonzero(repair>0)),'repair_bbox_xyxy':list(Image.fromarray(np.uint8(repair>0)*255).getbbox()),'source_rgb_changed_outside_repair_mask_pixels':outside_changed,'skin_sample_counts':samplecounts,'source_alpha_edge_cleaned':True,'recomposition_export_vs_full':diffs,'result':'PASS_STATIC_STRUCTURE'})
  manifest.append({'asset_id':key.upper(),'approved_source':rec(source),'base':rec(basexp),'faces':{e:rec(OUT/f'exports/{prefix}_face_{e}.png') for e in EMOTIONS},'front_hair':frontrec,'psd':{'path':rel(psd),'sha256':sha(psd)},'status':'ART_INTERNAL_BATCH_CANDIDATE','client_path':'PLANNED','client_uuid':'NOT_IMPORTED'})
  batches.append((key,boardpath))
  print('DONE',key,baser.size,parsed['layer_count'],flush=True)
 # Whole-batch board uses six source-calibrated five-state boards at one source-scale crop.
 final=Image.new('RGB',(1600,320*6),'#17202d')
 for i,(_,path) in enumerate(batches):final.paste(Image.open(path).convert('RGB'),(0,i*320))
 finalpath=OUT/'review/batch_30_combinations.png';final.save(finalpath)
 (OUT/'ASSET_MANIFEST.json').write_text(json.dumps({'task_id':'U04-DIALOGUE-ACAJ-BATCH-001','version':'v0.1','assets':manifest,'shared_panel':'reuse main Art u04_dialogue_panel_9s; no separate copy'},ensure_ascii=False,indent=2))
 (OUT/'LAYER_EXPORT_MAP.json').write_text(json.dumps({'task_id':'U04-DIALOGUE-ACAJ-BATCH-001','version':'v0.1','stages':maps},ensure_ascii=False,indent=2))
 (OUT/'PSD_VALIDATION.json').write_text(json.dumps({'task_id':'U04-DIALOGUE-ACAJ-BATCH-001','version':'v0.1','stages':valid,'result':'PASS_STATIC_STRUCTURE','limitations':['PSD为可编辑栅格层；平面原画的皮肤局部补洞是重建内容','导出与整画布重组像素比较，不代替目标机运行或Gate2批准']},ensure_ascii=False,indent=2))
 (OUT/'COMBINATION_CHECK.json').write_text(json.dumps({'task_id':'U04-DIALOGUE-ACAJ-BATCH-001','version':'v0.1','combination_count':len(combos),'combinations':combos,'batch_board':rec(finalpath),'u00_background':rec(SCENE),'result':'PASS_STATIC_30_OF_30','run_state':'NOT_TESTED'},ensure_ascii=False,indent=2))
 print('ALL COMPLETE',len(combos),rel(finalpath))
if __name__=='__main__':main()
