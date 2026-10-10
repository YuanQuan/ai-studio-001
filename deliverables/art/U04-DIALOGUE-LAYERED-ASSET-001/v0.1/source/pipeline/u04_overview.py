from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import hashlib,json
R=Path('deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1')
B=Path('deliverables/art/U04-DIALOGUE-ACAJ-BATCH-001/v0.1')
C=Path('deliverables/art/U04-DIALOGUE-ADXJ-BATCH-001/v0.1')
rows=[('孟桃 · 0魂 · 微笑',R/'review/mt_s0_u00_static_smile_sample.png'),('阿棠 · 2魂 · 微笑',R/'review/at_s2_u00_static_smile.png'),('阿炭 · 0魂 · 微笑',B/'review/u04_ac_s0_u00_static_smile.png'),('阿角 · 0魂 · 微笑',B/'review/u04_aj_s0_u00_static_smile.png'),('阿灯 · 0魂 · 微笑',C/'review/ad_s0_smile_u00_static.png'),('小锦 · 0魂 · 微笑',C/'review/xj_s0_smile_u00_static.png')]
font=ImageFont.truetype('/System/Library/Fonts/STHeiti Medium.ttc',24)
out=Image.new('RGB',(1280,1200),'#172232');d=ImageDraw.Draw(out)
log=[]
for i,(label,p) in enumerate(rows):
 im=Image.open(p).convert('RGB');assert im.size==(1280,720),(p,im.size)
 x=(i%2)*640;y=(i//2)*400
 out.paste(im.resize((640,360),Image.Resampling.LANCZOS),(x,y))
 d.rectangle((x,y+360,x+639,y+399),fill='#122032');d.text((x+14,y+365),label,font=font,fill='#f4d994')
 log.append({'label':label,'source_path':str(p),'source_sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'source_size_px':list(im.size)})
p=R/'review/u00_dialogue_overview.png';out.save(p)
(R/'review/u00_dialogue_overview_sources.json').write_text(json.dumps({'kind':'STATIC_COMPOSITE_NOT_RUNTIME_SCREENSHOT','source_background':'deliverables/art/SCENE-CLARITY-REDRAW-ASSET-20261010/v0.3/review/current_shops_on_v03_scene.png','canvas_px':[1280,1200],'panels':log},ensure_ascii=False,indent=2))
print(p)
