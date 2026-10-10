from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
R=Path('deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1');keys=['mt_s0','mt_s2','mt_s3','at_s0','at_s2','at_s3'];names={'mt':'孟桃','at':'阿棠'};states=['happy','surprised','sad','smile','angry'];cn=['高兴','惊讶','悲伤','微笑','生气'];cellw,cellh=300,340
sheet=Image.new('RGB',(cellw*5,cellh*6),'#172232');d=ImageDraw.Draw(sheet);font=ImageFont.truetype('/System/Library/Fonts/STHeiti Medium.ttc',22)
for row,k in enumerate(keys):
 code,stage=k.split('_s')
 for col,e in enumerate(states):
  p=R/f'review/{k}_{e}_face_wip.png'
  if k=='mt_s0':p=R/f'review/mt_s0_{e}_face_review.png'
  im=Image.open(p).convert('RGB').crop((35,0,477,475)).resize((cellw,320),Image.Resampling.LANCZOS)
  sheet.paste(im,(col*cellw,row*cellh));label=f'{names[code]} {stage}魂 · {cn[col]}'
  d.text((col*cellw+12,row*cellh+318),label,font=font,fill='#f4d994')
sheet.save(R/'review/main_30_combinations.png')
