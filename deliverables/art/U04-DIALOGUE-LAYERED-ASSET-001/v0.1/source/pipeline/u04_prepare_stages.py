from PIL import Image,ImageFilter
import numpy as np
from pathlib import Path
R=Path('deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1');O=Path('deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters')
for key in ['mt_s2','mt_s3','at_s0','at_s2','at_s3']:
 src=Image.open(O/f'mgr_{key}.png').convert('RGBA');
 import shutil;shutil.copyfile(O/f'mgr_{key}.png',R/f'source/approved_original_{key}.png')
 arr=np.asarray(src).copy();mask=np.asarray(src.getchannel('A').point(lambda v:255 if v>=245 else 0).filter(ImageFilter.MaxFilter(9)))>0
 arr[:,:,3]=np.where(mask,arr[:,:,3],0)
 out=Image.fromarray(arr,'RGBA');out.save(R/f'source/{key}_clean_edge.png')
 bg=Image.new('RGB',out.size,'#16202f');bg.paste(out,mask=out.getchannel('A'))
 bg.crop((256,0,768,512)).save(R/f'review/{key}_face_reference.png')
 print(key,src.size,int(np.count_nonzero(np.asarray(src.getchannel('A')))),int(np.count_nonzero(arr[:,:,3])))
