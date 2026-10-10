from pathlib import Path
from PIL import Image
import json,hashlib,subprocess,sys,shutil
R=Path('deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1').resolve();S=R/'source';E=R/'exports';V=R/'review'
C={'mt_s2':((360,100,616,356),'smile'),'mt_s3':((360,100,616,356),'smile'),'at_s0':((380,180,636,436),'smile'),'at_s2':((380,160,636,416),'smile'),'at_s3':((380,150,636,406),'smile')}
states=['happy','surprised','sad','smile','angry']
for key,(F,default) in C.items():
 base=Image.open(S/f'{key}_clean_face_wip.png').convert('RGBA')
 shutil.copyfile(S/f'{key}_clean_face_wip.png',S/f'{key}_clean_face_integrated.png')
 shutil.copyfile(S/f'{key}_front_hair_wip.png',S/f'{key}_front_hair_integrated.png')
 bbox=base.getchannel('A').getbbox();x0,x1=bbox[0],bbox[2]
 if x1-x0>768:
  print('EXCEEDS WIDTH',key,bbox);sys.exit(2)
 rect=(x0,0,x1,1024);base.crop(rect).save(E/f'u04_{key}_base.png')
 front=Image.open(S/f'{key}_front_hair_integrated.png').convert('RGBA')
 hb=front.getchannel('A').getbbox();front.crop(hb).save(E/f'u04_{key}_front_hair.png')
 layers=[{'name':'REFERENCE_APPROVED / original locked for comparison','file':str(S/f'approved_original_{key}.png'),'visible':False},{'name':'BASE / source silhouette + clean face','file':str(S/f'{key}_clean_face_integrated.png'),'visible':True}]
 for st in states:
  for role in ('brows','eyes','mouth'):
   layers.append({'name':f'{st.upper()} / {role}','file':str(S/f'{key}_{st}_{role}.png'),'x':F[0],'y':F[1],'visible':st==default})
 layers.append({'name':'FRONT HAIR / approved source occlusion','file':str(S/f'{key}_front_hair_integrated.png'),'visible':True})
 man={'canvas':{'width':1024,'height':1536,'composite_background':'#16202f'},'layers':layers}
 (S/f'{key}_layer_manifest.json').write_text(json.dumps(man,ensure_ascii=False,indent=2))
 out=S/f'u04_{key}_dialogue.psd';preview=V/f'u04_{key}_psd_preview.png'
 cp=subprocess.run(['python3','/tmp/u04_image2psd_hidden.py','assemble','--manifest',str(S/f'{key}_layer_manifest.json'),'--output',str(out),'--preview',str(preview)],capture_output=True,text=True)
 if cp.returncode:print(key,cp.stderr,cp.stdout);sys.exit(cp.returncode)
 print(key,'PSD',out.stat().st_size,'crop',rect,'front',hb,'default',default,flush=True)
