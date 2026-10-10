from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
R=Path('deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1');BG=Path('deliverables/art/SCENE-CLARITY-REDRAW-ASSET-20261010/v0.3/review/current_shops_on_v03_scene.png')
W,H=1280,720;names={'mt':'孟桃','at':'阿棠','ac':'阿炭','aj':'阿角','ad':'阿灯','xj':'小锦'};states=['happy','surprised','sad','smile','angry'];cn=['高兴','惊讶','悲伤','微笑','生气'];keys=['mt_s2','mt_s3','at_s0','at_s2','at_s3']
bgraw=Image.open(BG).convert('RGB').crop((360,0,2180,1024)).resize((W,H),Image.Resampling.LANCZOS).convert('RGBA')
panel=Image.open(R/'exports/u04_dialogue_panel_9s.png').convert('RGBA');cloud=Image.open(R/'exports/u04_dialogue_corner_cloud_bottom_left.png').convert('RGBA');cloud2=Image.open(R/'exports/u04_dialogue_corner_cloud_top_right.png').convert('RGBA')
def sliced(src,w,h):
 out=Image.new('RGBA',(w,h));xx=[0,48,464,512];yy=[0,48,208,256];tx=[0,48,w-48,w];ty=[0,48,h-48,h]
 for j in range(3):
  for i in range(3):
   tile=src.crop((xx[i],yy[j],xx[i+1],yy[j+1]));size=(tx[i+1]-tx[i],ty[j+1]-ty[j]);tile=tile if tile.size==size else tile.resize(size,Image.Resampling.BICUBIC);out.alpha_composite(tile,(tx[i],ty[j]))
 return out
frame=sliced(panel,1280,195)
font='/System/Library/Fonts/STHeiti Medium.ttc';fn=ImageFont.truetype(font,22);fs=ImageFont.truetype(font,18);fl=ImageFont.truetype(font,26)
def tab(d,x,y,w,h,label,selected=False,font=fs):
 fill=(10,25,53,235);edge=(225,163,77,245) if selected else (137,100,61,215);d.rounded_rectangle((x,y,x+w,y+h),radius=13,fill=fill,outline=edge,width=2)
 bb=d.textbbox((0,0),label,font=font);d.text((x+(w-(bb[2]-bb[0]))/2,y+(h-(bb[3]-bb[1]))/2-bb[1]),label,font=font,fill=(255,221,146,255) if selected else (221,220,222,255))
for key in keys:
 code,stage=key.split('_s');name=names[code];stage=int(stage)
 src=Image.open(R/f'source/{key}_clean_face_integrated.png').convert('RGBA');front=Image.open(R/f'source/{key}_front_hair_integrated.png').convert('RGBA')
 F=(360,100) if code=='mt' else (380,180 if stage==0 else (160 if stage==2 else 150))
 for i,emo in enumerate(states):
  out=bgraw.copy();out.alpha_composite(frame,(0,525));out.alpha_composite(cloud,(0,620));out.alpha_composite(cloud2,(1152,530))
  ov=Image.new('RGBA',(W,H));d=ImageDraw.Draw(ov)
  for j,label in enumerate(['0魂','2魂','3魂']):tab(d,480+j*83,445,76,31,label,[0,2,3][j]==stage)
  for j,label in enumerate(cn):tab(d,748+j*102,445,95,31,label,j==i)
  for j,label in enumerate(names.values()):tab(d,470+j*131,484,123,37,label,label==name,fn)
  d.text((510,568),name,font=fl,fill=(255,221,140,255));d.line((510,607,754,607),fill=(177,116,54,180),width=2)
  d.text((510,623),'今晚的夜市刚亮灯。',font=fl,fill=(245,237,227,255));d.polygon([(1190,662),(1215,662),(1202,680)],fill=(253,197,102,255));out.alpha_composite(ov)
  body=src.copy();layer=Image.new('RGBA',src.size);layer.paste(Image.open(R/f'exports/u04_{key}_face_{emo}.png').convert('RGBA'),F);body.alpha_composite(layer);body.alpha_composite(front)
  char=body.crop((0,0,1024,850)).resize((614,510),Image.Resampling.LANCZOS);out.alpha_composite(char,(-55,210))
  out.convert('RGB').save(R/f'review/{key}_u00_static_{emo}.png')
 print(key,'5 U00 actual-background static composites',flush=True)
