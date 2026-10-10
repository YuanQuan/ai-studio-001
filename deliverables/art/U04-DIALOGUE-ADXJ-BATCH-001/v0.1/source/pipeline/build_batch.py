"""Stage-calibrated raster production for the approved AD/XJ portrait batch.

Each feature is sampled from its own approved stage.  The sampled stroke masks,
local skin reconstruction, and export mapping remain inspectable beside the PSD.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import hashlib, json, shutil, subprocess

ROOT = Path(__file__).resolve().parents[6]
OUT = Path(__file__).resolve().parents[2]
SOURCE = OUT / "source"
EXPORT = OUT / "exports"
REVIEW = OUT / "review"
for p in (SOURCE, EXPORT, REVIEW): p.mkdir(parents=True, exist_ok=True)
APPROVED = ROOT / "deliverables/art/U04-MANAGER-PORTRAITS-001/v0.3/APPROVED_COMBINATION_MANIFEST.json"
approved = {Path(e["path"]).name: e for e in json.loads(APPROVED.read_text())["files"]}
EMOTIONS = ["happy", "surprised", "sad", "smile", "angry"]

# Coordinates were read from each 1024x1536 approved PNG, never inherited from MT.
# bbox order: left brow, right brow, left eye, right eye, mouth; XYXY in source.
STAGES = {
 "ad_s0": {"face": (310,185,566,441), "parts": [(319,222,393,251),(414,198,482,231),(323,252,423,316),(444,224,533,303),(423,314,486,361)], "skin": (235,181,130), "glasses": False},
 "ad_s2": {"face": (308,184,564,440), "parts": [(317,221,391,250),(413,197,481,231),(321,251,421,315),(443,224,532,303),(425,312,486,359)], "skin": (235,180,129), "glasses": False},
 "ad_s3": {"face": (310,184,566,440), "parts": [(322,219,395,249),(418,197,489,229),(326,250,425,314),(448,222,538,302),(420,306,490,359)], "skin": (235,180,129), "glasses": False},
 "xj_s0": {"face": (330,223,586,479), "parts": [(373,236,445,270),(474,262,523,286),(353,282,440,358),(467,298,553,359),(425,379,465,405)], "skin": (245,199,183), "glasses": True, "rings": [(397,314,55),(504,324,56)]},
 "xj_s2": {"face": (330,222,586,478), "parts": [(372,235,443,267),(475,260,524,284),(353,281,440,354),(467,297,553,358),(424,369,480,403)], "skin": (245,199,183), "glasses": True, "rings": [(397,309,55),(504,321,56)]},
 "xj_s3": {"face": (320,190,576,446), "parts": [(387,190,451,219),(489,214,543,240),(379,218,457,299),(488,239,564,311),(421,310,503,353)], "skin": (246,201,186), "glasses": False},
}
BROW_POLYS = {
 'ad_s0': [[(321,248),(330,236),(349,223),(374,219),(391,222),(390,230),(371,230),(347,241),(328,251)],[(416,238),(424,226),(442,218),(464,222),(475,231),(456,226),(437,228),(424,239)]],
 'ad_s2': [[(319,247),(329,235),(348,222),(372,218),(389,221),(388,229),(369,229),(345,240),(326,250)],[(415,237),(423,225),(441,217),(463,221),(473,230),(455,225),(436,227),(423,238)]],
 'ad_s3': [[(323,246),(332,234),(351,221),(376,218),(393,221),(392,229),(373,229),(350,239),(330,249)],[(421,236),(429,224),(447,216),(470,220),(480,229),(461,224),(443,226),(429,237)]],
 'xj_s0': [[(373,245),(382,235),(399,238),(420,249),(438,267),(432,267),(413,255),(394,246),(378,247)],[(474,271),(485,263),(501,266),(516,279),(508,280),(496,271),(485,269)]],
 'xj_s2': [[(372,244),(381,234),(398,237),(419,248),(437,266),(431,266),(412,254),(393,245),(377,246)],[(473,269),(485,261),(501,264),(516,277),(508,278),(496,269),(485,267)]],
 'xj_s3': [[(388,210),(395,196),(409,191),(431,195),(450,211),(445,214),(426,203),(407,200),(394,212)],[(488,219),(499,207),(519,208),(541,222),(535,225),(517,215),(500,214),(492,221)]],
}
for _key,_cfg in STAGES.items():
    _cfg['brow_polys']=BROW_POLYS[_key]
    _cfg['left_eye_min']=342 if _key.startswith('ad') else 354
_nose={'ad_s0':(418,296,438,312),'ad_s2':(418,295,438,311),'ad_s3':(421,290,441,306),
       'xj_s0':(433,354,448,375),'xj_s2':(433,344,448,365),'xj_s3':(438,290,456,309)}
for _key,_cfg in STAGES.items():_cfg['nose_hole']=_nose[_key]

def sha(path): return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def save(im, path): im.save(path); return path
def rgb_skin_field(rgb, cfg):
    """Fit only unaffected face skin; iris, frames, hair and nose are excluded."""
    fx0,fy0,fx1,fy1=cfg["face"]
    y,x=np.mgrid[fy0:fy1,fx0:fx1].astype(np.float64)
    px=rgb[fy0:fy1,fx0:fx1].astype(np.float64)
    cx=(fx0+fx1)/2;cy=(fy0+fy1)/2
    nx=(x-cx)/120;ny=(y-cy)/120
    A=np.stack([np.ones_like(nx),nx,ny,nx*nx,nx*ny,ny*ny,nx**3,ny**3],axis=-1)
    inside=((nx+.06)/.88)**2+((ny-.07)/.86)**2<1
    skin=cfg["skin"]
    color=(px[:,:,0]>skin[0]-28)&(px[:,:,1]>skin[1]-36)&(px[:,:,2]>skin[2]-40)
    color &= (px[:,:,0]-px[:,:,1]>15)&(px[:,:,0]-px[:,:,1]<95)
    allowed=inside&color
    for i,(x0,y0,x1,y1) in enumerate(cfg["parts"]):
        margin=7 if i<4 else 10
        allowed[max(0,y0-margin-fy0):min(fy1-fy0,y1+margin-fy0),max(0,x0-margin-fx0):min(fx1-fx0,x1+margin-fx0)]=False
    # The intact forehead around each eyebrow is essential to match skin under
    # the spectacle frame; the color gate already rejects teal hair and gold.
    if allowed.sum()<200: raise RuntimeError(f"insufficient stage skin samples: {allowed.sum()}")
    field=np.zeros_like(px)
    ridge=np.diag([.001,.02,.02,.15,.15,.15,.5,.5])
    B=A[allowed]
    for channel in range(3):
        coef=np.linalg.solve(B.T@B+ridge,B.T@px[:,:,channel][allowed]);field[:,:,channel]=A@coef
    return np.clip(field,0,255).astype(np.uint8),int(allowed.sum())

def soft_mask(boxes, canvas, cfg):
    mask=Image.new('L',canvas);d=ImageDraw.Draw(mask)
    for j,(x0,y0,x1,y1) in enumerate(boxes):
        if j<2:
            d.polygon(cfg['brow_polys'][j],fill=255)
        elif j<4:
            d.ellipse((x0+3,y0+2,x1-3,y1-2),fill=255)
        else:
            d.rounded_rectangle((x0-4,y0-3,x1+4,y1+4),radius=11,fill=255)
    # Preserve the approved nose bridge and tip between eyes and mouth.
    d.ellipse(cfg['nose_hole'],fill=0)
    # Keep source side locks attached to the silhouette; the leftmost lash stays
    # in the base where it touches hair instead of creating a skin-color seam.
    d.rectangle((0,253 if cfg['skin'][0]<240 else 281,cfg['left_eye_min']-1,365),fill=0)
    return mask.filter(ImageFilter.GaussianBlur(3))

def feature_mask(rgb, field, box, cfg, kind):
    x0,y0,x1,y1=box;fx0,fy0,_,_=cfg['face']
    pix=rgb[y0:y1,x0:x1].astype(np.float32)
    skin=field[y0-fy0:y1-fy0,x0-fx0:x1-fx0].astype(np.float32)
    delta=np.linalg.norm(pix-skin,axis=2)
    if kind=='brows': amount=np.clip((delta-19)/32,0,1)
    elif kind=='eyes': amount=np.clip((delta-16)/30,0,1)
    else: amount=np.clip((delta-17)/35,0,1)
    y,x=np.mgrid[y0:y1,x0:x1];cx=(x0+x1)/2;cy=(y0+y1)/2
    ellipse=((x-cx)/((x1-x0)*.50))**2+((y-cy)/((y1-y0)*.49))**2
    amount*=np.clip((1.12-ellipse)/.16,0,1)
    if kind=='eyes' and x0<400: amount*=np.clip((x-cfg['left_eye_min'])/3,0,1)
    if cfg['glasses'] and kind=='eyes':
        # Stage glasses are exported as an independent top layer; omit their outer ring.
        for rx,ry,rad in cfg['rings']:
            rr=np.sqrt((x-rx)**2+(y-ry)**2)
            amount*=np.where((rr>rad-11)&(rr<rad+5),.03,1.)
    mask=Image.fromarray(np.uint8(amount*255),'L').filter(ImageFilter.GaussianBlur(.7))
    return mask

def brow_piece(original,cfg,idx):
    """Extract approved-stage brow pixels through a hand-traced silhouette."""
    box=cfg['parts'][idx];x0,y0,x1,y1=box
    mask=Image.new('L',(x1-x0,y1-y0));d=ImageDraw.Draw(mask)
    d.polygon([(x-x0,y-y0) for x,y in cfg['brow_polys'][idx]],fill=255)
    mask=mask.filter(ImageFilter.GaussianBlur(.45))
    out=original.crop(box);out.putalpha(mask)
    return out

def transform_piece(im, mode, kind, side):
    if mode=='smile':return im
    sy=1.;dy=0;angle=0
    if kind=='brows':
        dy={'happy':-1,'surprised':-4,'sad':2,'angry':3}[mode]
        angle={'happy':-1,'surprised':-2,'sad':3,'angry':-5}[mode]*(1 if side==0 else -1)
    elif kind=='eyes':
        sy={'happy':.78,'surprised':1.14,'sad':.82,'angry':.78}[mode]
        dy={'happy':2,'surprised':-2,'sad':3,'angry':2}[mode]
    if sy!=1:im=im.resize((im.width,max(1,round(im.height*sy))),Image.Resampling.LANCZOS)
    if angle:im=im.rotate(angle,Image.Resampling.BICUBIC,expand=True)
    return im,dy

def draw_mouth(cfg,emotion,W=256):
    S=4; im=Image.new('RGBA',(W*S,W*S));d=ImageDraw.Draw(im)
    box=cfg['parts'][4];fx0,fy0,_,_=cfg['face'];cx=(box[0]+box[2])/2-fx0;cy=(box[1]+box[3])/2-fy0
    # Palette sampled from each identity's approved mouth, with its own scale.
    xj=cfg['skin'][0]>240
    ink=(125,55,54,250) if xj else (129,60,44,250)
    inner=(113,39,53,255) if xj else (145,61,45,255)
    lip=(238,126,118,255) if xj else (235,136,94,255)
    width=(box[2]-box[0])*.72
    if emotion=='happy':
        width*=1.23
        pts=[(cx-width*.5,cy-7),(cx,cy+1),(cx+width*.5,cy-7),(cx+width*.39,cy+17),(cx,cy+26),(cx-width*.39,cy+17)]
        d.polygon([(round(x*S),round(y*S)) for x,y in pts],fill=inner)
        d.ellipse(((cx-width*.28)*S,(cy+12)*S,(cx+width*.28)*S,(cy+27)*S),fill=lip)
        d.arc(((cx-width*.52)*S,(cy-17)*S,(cx+width*.52)*S,(cy+12)*S),0,180,fill=ink,width=10)
    elif emotion=='surprised':
        d.ellipse(((cx-11)*S,(cy-14)*S,(cx+11)*S,(cy+15)*S),fill=ink)
        d.ellipse(((cx-7)*S,(cy-9)*S,(cx+7)*S,(cy+12)*S),fill=inner)
        d.arc(((cx-7)*S,cy*S,(cx+7)*S,(cy+13)*S),0,180,fill=lip,width=9)
    elif emotion=='sad':
        pts=[(cx-width*.44,cy+8),(cx-width*.2,cy+1),(cx,cy-1),(cx+width*.2,cy+1),(cx+width*.44,cy+8)]
        d.line([(round(x*S),round(y*S)) for x,y in pts],fill=ink,width=9,joint='curve')
    else:
        # A tapered pressed-mouth stroke follows the source ink color; no bar.
        pts=[(cx-width*.46,cy+4),(cx-width*.18,cy+2),(cx+width*.12,cy+1),(cx+width*.45,cy-2)]
        d.line([(round(x*S),round(y*S)) for x,y in pts],fill=ink,width=7,joint='curve')
        d.ellipse(((cx+width*.37)*S,(cy-4)*S,(cx+width*.47)*S,(cy+2)*S),fill=ink)
    return im.resize((W,W),Image.Resampling.LANCZOS)

def extract_glasses(orig,cfg):
    face=cfg['face'];f=Image.new('RGBA',(256,256));rgb=np.array(orig)[:,:,:3]
    y,x=np.mgrid[face[1]:face[3],face[0]:face[2]]
    mask=np.zeros((256,256),dtype=np.float32)
    for cx,cy,r in cfg['rings']:
        rr=np.sqrt((x-cx)**2+(y-cy)**2)
        mask=np.maximum(mask,np.clip((rr-(r-12))/2,0,1)*np.clip(((r+3)-rr)/2,0,1))
    # Bridge and side temples are part of the frame, preserving the stage pose.
    bridge=((x>441)&(x<468)&(y>307)&(y<342))
    mask=np.maximum(mask,bridge.astype(np.float32)*.9)
    # Source reflection strokes remain inside the lenses as a gentle glass cue.
    pix=rgb[face[1]:face[3],face[0]:face[2]].astype(np.float32)
    bright=(pix[:,:,0]>225)&(pix[:,:,1]>220)&(pix[:,:,2]>205)
    for cx,cy,r in cfg['rings']:
        rr=np.sqrt((x-cx)**2+(y-cy)**2)
        mask=np.maximum(mask,(bright&(rr<r-10)&(rr>r-33)).astype(np.float32)*.5)
    a=np.array(orig.getchannel('A').crop(face),dtype=np.float32)
    rgba=np.array(orig.crop(face));rgba[:,:,3]=np.uint8(np.clip(a*mask,0,255))
    return Image.fromarray(rgba,'RGBA')

def extract_front_hair(orig,cfg):
    x0,y0,x1,y1=cfg['face'];arr=np.array(orig.crop(cfg['face']));pix=arr[:,:,:3].astype(np.float32)
    yy,xx=np.mgrid[y0:y1,x0:x1]
    if cfg['glasses']:
        region=(yy<300)&(xx>420)&(xx<590)
        colored=(pix[:,:,1]>pix[:,:,0]*1.16)&(pix[:,:,2]>pix[:,:,0]*1.12)&(pix[:,:,0]<145)
    else:
        region=((xx<351)&(yy<321)&(yy>185))|((xx>407)&(xx<481)&(yy<234))
        colored=(pix[:,:,0]<115)&(pix[:,:,1]<115)&(pix[:,:,2]<145)
    alpha=np.uint8(np.where(region&colored,arr[:,:,3],0))
    alpha=np.array(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(.6)))
    arr[:,:,3]=alpha
    return Image.fromarray(arr,'RGBA')

def create_stage(key,cfg):
    c,s=key.split('_s');src=ROOT / approved[f'mgr_{c}_s{s}.png']['path']
    if sha(src)!=approved[src.name]['sha256']:raise RuntimeError('source SHA mismatch '+str(src))
    original=Image.open(src).convert('RGBA');assert original.size==(1024,1536)
    shutil.copyfile(src,SOURCE/f'approved_original_{key}.png')
    a=np.array(original);rgb=a[:,:,:3];field,n_samples=rgb_skin_field(rgb,cfg)
    mask=soft_mask(cfg['parts'],original.size,cfg);m=np.asarray(mask,dtype=np.float32)/255
    fx0,fy0,fx1,fy1=cfg['face'];reg=a[fy0:fy1,fx0:fx1].copy();mm=m[fy0:fy1,fx0:fx1,None]
    reg[:,:,:3]=np.uint8(np.clip(reg[:,:,:3]*(1-mm)+field*mm,0,255))
    clean=a.copy();clean[fy0:fy1,fx0:fx1]=reg
    # Remove background wisps in alpha while leaving outside-mask RGB bytes untouched.
    aa=clean[:,:,3].astype(np.float32);clean[:,:,3]=np.uint8(np.where(aa<18,0,np.where(aa<75,(aa-18)*75/57,aa)))
    base=Image.fromarray(clean,'RGBA');save(base,SOURCE/f'{key}_clean_full.png');save(mask,SOURCE/f'{key}_feature_mask.png')
    front=extract_front_hair(original,cfg)
    if cfg['glasses']:front.alpha_composite(extract_glasses(original,cfg))
    save(front,SOURCE/f'{key}_front_occlusion.png')
    original_rgb=np.array(original)[:,:,:3]
    pieces={}
    for idx,box in enumerate(cfg['parts']):
        if idx<2:
            pieces[idx]=brow_piece(original,cfg,idx)
            continue
        kind='brows' if idx<2 else ('eyes' if idx<4 else 'mouth')
        fm=feature_mask(original_rgb,field,box,cfg,kind)
        im=original.crop(box);im.putalpha(Image.fromarray(np.minimum(np.array(fm),np.array(original.getchannel('A').crop(box))),'L'))
        pieces[idx]=im
    x0,y0,_,_=cfg['face'];states={};compositions={}
    for emotion in EMOTIONS:
        layers={}
        for kind,ids in [('brows',[0,1]),('eyes',[2,3])]:
            layer=Image.new('RGBA',(256,256))
            for side,idx in enumerate(ids):
                im=pieces[idx]; box=cfg['parts'][idx]
                if key=='xj_s0' and kind=='eyes' and side==1 and emotion in ('surprised','sad','angry'):
                    # The approved S0 smile winks.  Other semantic states need
                    # an open right eye; mirror this stage's own left eye only.
                    im=pieces[2].transpose(Image.Transpose.FLIP_LEFT_RIGHT).resize((box[2]-box[0],box[3]-box[1]),Image.Resampling.LANCZOS)
                    ma=Image.new('L',im.size);md=ImageDraw.Draw(ma);md.ellipse((9,9,im.width-10,im.height-6),fill=255)
                    old=np.array(im.getchannel('A'));clip=np.array(ma.filter(ImageFilter.GaussianBlur(2)))
                    im.putalpha(Image.fromarray(np.minimum(old,clip)))
                if emotion!='smile': im,dy=transform_piece(im,emotion,kind,side)
                else:dy=0
                xx=round((box[0]+box[2]-im.width)/2-x0);yy=round((box[1]+box[3]-im.height)/2-y0+dy)
                layer.alpha_composite(im,(xx,yy))
            layers[kind]=layer
        if emotion=='smile':
            mouth=Image.new('RGBA',(256,256));box=cfg['parts'][4];mouth.alpha_composite(pieces[4],(box[0]-x0,box[1]-y0))
        else:mouth=draw_mouth(cfg,emotion)
        layers['mouth']=mouth
        for kind,im in layers.items():save(im,SOURCE/f'{key}_{emotion}_{kind}.png')
        combined=Image.new('RGBA',(256,256))
        for kind in ('brows','eyes','mouth'):combined.alpha_composite(layers[kind])
        face_export=combined.resize((192,192),Image.Resampling.LANCZOS)
        save(face_export,EXPORT/f'u04_{key}_face_{emotion}.png')
        full=base.copy();full.alpha_composite(combined,(x0,y0))
        full.alpha_composite(front,(x0,y0))
        compositions[emotion]=full
        save(full,REVIEW/f'{key}_{emotion}_full.png')
        states[emotion]={"sources":{kind:str(SOURCE/f'{key}_{emotion}_{kind}.png') for kind in layers},"face_export":str(EXPORT/f'u04_{key}_face_{emotion}.png')}
    base_rect=(0,0,1024,1024);base_export=base.crop(base_rect).resize((768,768),Image.Resampling.LANCZOS)
    save(base_export,EXPORT/f'u04_{key}_base.png')
    save(front.resize((192,192),Image.Resampling.LANCZOS),EXPORT/f'u04_{key}_front_occlusion.png')
    sheet=Image.new('RGB',(5*320,350),'#263142');d=ImageDraw.Draw(sheet)
    for i,emotion in enumerate(EMOTIONS):
        full=compositions[emotion];bg=Image.new('RGBA',full.size,'#263142');bg.alpha_composite(full)
        thumb=bg.crop((300,190,620,510)).convert('RGB');sheet.paste(thumb,(i*320,0));d.text((i*320+5,325),f'{key} {emotion}',fill='white')
    save(sheet,REVIEW/f'{key}_five_state_board.png')
    layers=[{"name":"REFERENCE_APPROVED / original locked","file":str(SOURCE/f'approved_original_{key}.png'),"visible":False},{"name":"BASE / approved silhouette and clean face","file":str(SOURCE/f'{key}_clean_full.png'),"visible":True}]
    for emotion in EMOTIONS:
        for kind in ('brows','eyes','mouth'):
            layers.append({"name":f'{emotion.upper()} / {kind}',"file":str(SOURCE/f'{key}_{emotion}_{kind}.png'),"x":x0,"y":y0,"visible":emotion=='smile'})
    layers.append({"name":"FRONT HAIR + GLASSES / approved stage occlusion","file":str(SOURCE/f'{key}_front_occlusion.png'),"x":x0,"y":y0,"visible":True})
    manifest={"canvas":{"width":1024,"height":1536,"composite_background":"#263142"},"layers":layers}
    mp=SOURCE/f'{key}_layer_manifest.json';mp.write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
    cmd=['python3','/tmp/u04_image2psd_hidden.py','assemble','--manifest',str(mp),'--output',str(SOURCE/f'u04_{key}_dialogue.psd'),'--preview',str(REVIEW/f'{key}_psd_preview.png')]
    subprocess.run(cmd,check=True,stdout=subprocess.DEVNULL)
    return {"key":key,"approved_source":str(src),"approved_sha256":sha(src),"face_rect":list(cfg['face']),"feature_boxes":cfg['parts'],"skin_sample_pixels":n_samples,"skin_mask_pixels":int((np.asarray(mask)>0).sum()),"changed_rgb_pixels":int(np.count_nonzero(np.any(a[:,:,:3]!=clean[:,:,:3],axis=2))),"changed_rgb_outside_mask":int(np.count_nonzero(np.any(a[:,:,:3]!=clean[:,:,:3],axis=2)&(np.asarray(mask)==0))),"base_rect":list(base_rect),"base_size":[768,768],"face_export_size":[192,192],"face_offset_export":[round(x0*.75),round(y0*.75)],"glasses":cfg['glasses'],"states":states}

if __name__=='__main__':
    result={k:create_stage(k,v) for k,v in STAGES.items()}
    (OUT/'production_data.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
    print('built',len(result),'stages')
