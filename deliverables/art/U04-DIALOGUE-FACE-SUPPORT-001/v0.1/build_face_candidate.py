from PIL import Image,ImageDraw,ImageFilter
import numpy as np, os
root='/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001'
orig=Image.open(root+'/deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_mt_s0.png').convert('RGBA')
wip=Image.open(root+'/deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1/review/mt_s0_clean_face_crop_wip6.png').convert('RGB')
out=root+'/deliverables/art/U04-DIALOGUE-FACE-SUPPORT-001/v0.1'
os.makedirs(out,exist_ok=True)
# coordinates below are 512x512 crop, whose origin is (256,0) in the approved 1024x1536 source.
# Reconstruct a continuous anime skin field from intact pixels of the existing WIP.
wp=np.asarray(wip,dtype=np.float32)
# The WIP has the right skin tone and blush but contains remnants. Only healthy skin samples enter the field.
yy,xx=np.mgrid[0:512,0:512]
trusted=(wp[:,:,0]>224)&(wp[:,:,1]>157)&(wp[:,:,2]>142)&(wp[:,:,0]-wp[:,:,1]<87)
# Explicit intact-skin sampling patches. No hair, eye, eyebrow, mouth, or old patch contributes.
regions=[(211,127,258,160),(201,168,260,187),(171,235,237,272),(195,279,251,305),(246,212,270,245),(276,294,308,314),(234,307,273,320)]
where=np.zeros((512,512),bool)
for x0,y0,x1,y1 in regions:where[y0:y1,x0:x1]=True
trusted &= where
x=(xx-250)/100.0;y=(yy-225)/100.0
basis=np.stack([np.ones_like(x),x,y,x*x,x*y,y*y,x*x*x,x*x*y,x*y*y,y*y*y],axis=-1)
A=basis[trusted]
# Gentle regularization keeps out-of-sample cheek interpolation stable.
reg=np.diag([0,0,0,.15,.15,.15,.7,.7,.7,.7])
field=[]
for c in range(3):
 vals=wp[:,:,c][trusted]
 coef=np.linalg.solve(A.T@A+reg,A.T@vals)
 field.append(np.sum(basis*coef,axis=2))
field=np.uint8(np.clip(np.stack(field,axis=2),0,255))
# Mask covers all old brows/eyes/mouth with margins; it is bounded by restored source hair.
mask=Image.new('L',(512,512),0);d=ImageDraw.Draw(mask)
d.rounded_rectangle((152,156,271,273),radius=17,fill=255)
d.rounded_rectangle((263,174,350,294),radius=15,fill=255)
d.rounded_rectangle((208,259,303,309),radius=14,fill=255)
d.ellipse((259,257,274,277),fill=0) # original nose
feather=mask.filter(ImageFilter.GaussianBlur(7))
clean=field
# Hair is preserved from the source as a separate, full-canvas alpha layer.
# Pixel classification inside conservative front-hair polygons avoids bringing back eyebrows or eye details.
hair_region=Image.new('L',(512,512),0);hd=ImageDraw.Draw(hair_region)
# Only the locks that actually cross the expression canvas are needed in the occlusion layer.
# Outer hair/background remain in the untouched base; this prevents source backdrop halos.
hd.polygon([(257,100),(273,107),(281,145),(284,173),(293,198),(303,219),(289,222),(276,198),(266,175),(260,140)],fill=255)
hd.polygon([(287,115),(320,139),(341,174),(356,207),(361,246),(352,281),(336,288),(320,270),(327,239),(315,215),(301,192)],fill=255)
sp=np.asarray(orig.crop((256,0,768,512)).convert('RGB'),dtype=np.uint8)
yy,xx=np.mgrid[0:512,0:512]
red=(sp[:,:,0]<195)&(sp[:,:,1]<125)&(sp[:,:,2]<135)&(sp[:,:,0]>sp[:,:,1]+35)
# Avoid the original right eyebrow and eye while retaining the front-hair boundary.
right_threshold=np.interp(yy,[100,160,185,205,225,250,280],[282,297,310,319,326,333,338])
# The central lock ends above the source right eyebrow. Keep a conservative edge on the right lock.
central_low=np.interp(yy,[100,140,170,185,195,205,215,222],[258,262,268,272,276,282,289,296])
central_high=np.interp(yy,[100,140,170,185,195,205,215,222],[275,280,284,287,290,294,300,303])
central=(xx>=central_low)&(xx<=central_high)&(yy>=100)&(yy<=222)
right_bound=np.interp(yy,[165,185,205,225,250,270],[329,334,337,340,344,348])
right=(xx>=right_bound)&(xx<365)&(yy>=165)&(yy<=270)
red &= central|right
reg=np.asarray(hair_region)>0
hm=Image.fromarray(np.uint8(red&reg)*255,'L').filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.65))
hm_arr=np.array(hm);hm=Image.fromarray(hm_arr)
# Enforce source RGB in the front hair and outside the local feature patches.
mask_arr=np.asarray(feather,dtype=np.float32)/255.0
hair_arr=np.asarray(hm,dtype=np.float32)/255.0
face_shape=Image.new('L',(512,512),0)
fd=ImageDraw.Draw(face_shape)
fd.polygon([(213,112),(258,112),(269,145),(280,179),(299,196),(315,210),(327,227),(335,247),(335,266),(325,281),(312,292),(303,303),(288,315),(251,330),(218,320),(188,300),(169,275),(156,244),(155,215),(165,190),(184,155)],fill=255)
face_arr=np.asarray(face_shape.filter(ImageFilter.GaussianBlur(1.5)),dtype=np.float32)/255.0
mask_arr *= face_arr*(1-hair_arr)
fullmask=Image.new('L',orig.size,0);fullmask.paste(Image.fromarray(np.uint8(np.clip(mask_arr*255,0,255)),'L'),(256,0))
clean_full=orig.copy(); clean_full.paste(Image.fromarray(clean,'RGB').convert('RGBA'),(256,0),Image.fromarray(np.uint8(np.clip(mask_arr*255,0,255)),'L'))
# Full canvas source-colored hair layer; RGB is the approved source exactly, alpha is editable.
front=Image.new('RGBA',orig.size,(0,0,0,0))
hair_rgba=Image.fromarray(np.dstack([sp,np.asarray(hm,dtype=np.uint8)]),'RGBA')
front.paste(hair_rgba,(256,0))
clean_full.putalpha(orig.getchannel('A'))
clean_full.save(out+'/candidate_clean_face.png')
front.save(out+'/candidate_front_overlay.png')
fullmask.save(out+'/modification_mask.png')
# Comparison in original crop coordinates.
compare=Image.new('RGB',(1536,512))
compare.paste(orig.crop((256,0,768,512)).convert('RGB'),(0,0))
compare.paste(clean_full.crop((256,0,768,512)).convert('RGB'),(512,0))
composite=Image.alpha_composite(clean_full,front)
compare.paste(composite.crop((256,0,768,512)).convert('RGB'),(1024,0))
compare.save(out+'/comparison.png')
np_mask=np.asarray(fullmask)>0
a=np.asarray(orig);c=np.asarray(clean_full);changed=np.any(a!=c,axis=2)
print('output',out,'changed',changed.sum(),'bbox',Image.fromarray(np.uint8(changed)*255).getbbox(),'outside_mask',np.count_nonzero(changed&~np_mask),'orig_alpha_diff',np.count_nonzero(a[:,:,3]!=c[:,:,3]))
# Preview existing five expression layers against this exact candidate. This is an internal visual check.
source_dir=root+'/deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1/source'
states=['smile','happy','surprised','sad','angry']
sheet=Image.new('RGB',(512*len(states),512),'#172232')
for i,state in enumerate(states):
 panel=Image.open(source_dir+'/mt_s0_clean_edge_work.png').convert('RGBA')
 panel.paste(clean_full,(0,0),fullmask)
 for role in ['brows','eyes','mouth']:
  layer=Image.open(f'{source_dir}/mt_s0_{state}_{role}.png').convert('RGBA')
  tmp=Image.new('RGBA',orig.size,(0,0,0,0));tmp.paste(layer,(360,100))
  panel=Image.alpha_composite(panel,tmp)
 panel=Image.alpha_composite(panel,front)
 bg=Image.new('RGBA',orig.size,(23,34,50,255));bg=Image.alpha_composite(bg,panel)
 sheet.paste(bg.crop((256,0,768,512)).convert('RGB'),(i*512,0))
sheet.save(out+'/five_expression_candidate.png')
import json,hashlib
summary={
 'canvas':[1024,1536],
 'source_sha256':hashlib.sha256(open(root+'/deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_mt_s0.png','rb').read()).hexdigest(),
 'changed_rgb_pixels':int(np.count_nonzero(np.any(a[:,:,:3]!=c[:,:,:3],axis=2))),
 'changed_pixels_outside_mask':int(np.count_nonzero(changed&~np_mask)),
 'alpha_difference_pixels':int(np.count_nonzero(a[:,:,3]!=c[:,:,3])),
 'changed_bbox_xyxy':Image.fromarray(np.uint8(changed)*255).getbbox(),
 'status':'internal candidate; visual review pending'
}
with open(out+'/pixel_diff_summary.json','w') as f:json.dump(summary,f,indent=2)
