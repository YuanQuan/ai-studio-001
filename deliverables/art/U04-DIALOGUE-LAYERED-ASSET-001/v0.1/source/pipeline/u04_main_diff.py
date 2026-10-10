from pathlib import Path
from PIL import Image
import json,hashlib,numpy as np
R=Path('deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1');S=R/'source';out={}
for k in ['mt_s2','mt_s3','at_s0','at_s2','at_s3']:
 a=np.asarray(Image.open(S/f'approved_original_{k}.png').convert('RGBA'));edge=np.asarray(Image.open(S/f'{k}_clean_edge.png').convert('RGBA'));b=np.asarray(Image.open(S/f'{k}_clean_face_integrated.png').convert('RGBA'));mask=np.asarray(Image.open(S/f'{k}_feature_mask_wip.png').convert('L'));m=np.zeros(a.shape[:2],bool);m[:512,256:768]=mask>0
 changed=np.any(a[:,:,:3]!=b[:,:,:3],axis=2);new=np.any(edge[:,:,:3]!=b[:,:,:3],axis=2);alpha=a[:,:,3]!=b[:,:,3]
 yy,xx=np.nonzero(new);bbox=[int(xx.min()),int(yy.min()),int(xx.max()+1),int(yy.max()+1)] if len(xx) else None
 front=np.asarray(Image.open(S/f'{k}_front_hair_integrated.png').convert('RGBA'))
 out[k.upper()]={'source_sha256':hashlib.sha256((S/f'approved_original_{k}.png').read_bytes()).hexdigest(),'face_rgb_changed_pixels':int(new.sum()),'face_rgb_changed_bbox_xyxy':bbox,'face_rgb_changed_outside_semantic_mask':int((new&~m).sum()),'alpha_changed_pixels_vs_approved_source':int(alpha.sum()),'alpha_changed_pixels_due_to_edge_cleanup':int((a[:,:,3]!=edge[:,:,3]).sum()),'rgb_changed_outside_feature_mask':int((changed&~m).sum()),'front_hair_alpha_pixels':int((front[:,:,3]>0).sum()),'front_hair_alpha_bbox':Image.fromarray(front[:,:,3]).getbbox(),'status':'STATIC_PIXEL_CHECK'}
 print(k,out[k.upper()])
(S/'main_batch_pixel_diff.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
