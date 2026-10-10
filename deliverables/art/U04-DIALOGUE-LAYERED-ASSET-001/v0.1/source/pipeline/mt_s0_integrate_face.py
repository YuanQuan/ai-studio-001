from PIL import Image,ImageDraw
import numpy as np
from pathlib import Path
R=Path('deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1');S=Path('deliverables/art/U04-DIALOGUE-FACE-SUPPORT-001/v0.1')
edge=Image.open(R/'source/mt_s0_clean_edge_work.png').convert('RGBA');sup=Image.open(S/'candidate_clean_face.png').convert('RGBA');mask=Image.open(S/'modification_mask.png').convert('L')
a=np.asarray(edge).copy(); b=np.asarray(sup);m=np.asarray(mask,dtype=np.float32)/255
a[:,:,:3]=np.uint8(np.round(a[:,:,:3].astype(np.float32)*(1-m[:,:,None])+b[:,:,:3].astype(np.float32)*m[:,:,None]))
# Alpha inherits the cleaned approved source exactly; support only supplies local RGB repair.
base=Image.fromarray(a,'RGBA');base.save(R/'source/mt_s0_clean_face_integrated_wip.png')
front=Image.open(S/'candidate_front_overlay.png').convert('RGBA');front.save(R/'source/mt_s0_front_hair_integrated_wip.png')
names=['smile','happy','surprised','sad','angry'];sheet=Image.new('RGB',(512*5,560),'#16202f');d=ImageDraw.Draw(sheet)
for i,n in enumerate(names):
 full=base.copy();face=Image.open(R/f'exports/u04_mt_s0_face_{n}.png').convert('RGBA');lay=Image.new('RGBA',full.size);lay.paste(face,(360,100));full.alpha_composite(lay);full.alpha_composite(front)
 full.save(R/f'review/mt_s0_{n}_support_recomposed_wip.png')
 blue=Image.new('RGB',full.size,'#16202f');blue.paste(full,mask=full.getchannel('A'));crop=blue.crop((256,0,768,512));crop.save(R/f'review/mt_s0_{n}_support_face_wip.png');sheet.paste(crop,(i*512,0));d.text((i*512+16,523),n,fill='#e2c296')
sheet.save(R/'review/mt_s0_five_expression_support_sheet_wip.png')
