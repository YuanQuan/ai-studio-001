from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import numpy as np, math, os
R=Path('deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1')
BG=Path('deliverables/art/SCENE-CLARITY-REDRAW-ASSET-20261010/v0.3/review/current_shops_on_v03_scene.png')
W,H=1280,720
emotion=os.getenv('U04_EMOTION','smile')
bg=Image.open(BG).convert('RGB').crop((360,0,2180,1024)).resize((W,H),Image.Resampling.LANCZOS).convert('RGBA')
# Pixel-preserving nine-slice, with source corners copied without interpolation.
panel=Image.open(R/'exports/u04_dialogue_panel_9s.png').convert('RGBA'); l=t=r=b=48
pw,ph=1280,195; dst=Image.new('RGBA',(pw,ph)); xx=[0,l,512-r,512]; yy=[0,t,256-b,256];tx=[0,l,pw-r,pw];ty=[0,t,ph-b,ph]
for j in range(3):
 for i in range(3):
  crop=panel.crop((xx[i],yy[j],xx[i+1],yy[j+1])); sz=(tx[i+1]-tx[i],ty[j+1]-ty[j]);
  if crop.size!=sz:crop=crop.resize(sz,Image.Resampling.BICUBIC)
  dst.alpha_composite(crop,(tx[i],ty[j]))
bg.alpha_composite(dst,(0,525))
# Fixed cloud curls: a separate overlay from the stretchable 512x256 panel.
def cubic(a,b,c,d,n=100):
 return [((1-u)**3*a[0]+3*(1-u)**2*u*b[0]+3*(1-u)*u*u*c[0]+u**3*d[0],(1-u)**3*a[1]+3*(1-u)**2*u*b[1]+3*(1-u)*u*u*c[1]+u**3*d[1]) for u in [i/n for i in range(n+1)]]
def ornament(w=128,h=96):
 S=4;im=Image.new('RGBA',(w*S,h*S));d=ImageDraw.Draw(im)
 gold=(205,141,62,225);dark=(103,70,43,190)
 paths=[
  [(0,72),(10,50),(20,48),(27,58)],[(27,58),(17,68),(13,76),(22,82)],
  [(22,82),(42,88),(55,74),(49,65)],[(49,65),(43,58),(31,66),(35,72)],
  [(35,72),(40,76),(49,69),(45,66)],[(0,90),(16,79),(31,81),(37,92)],
  [(52,91),(63,77),(73,77),(81,87)],[(74,79),(75,59),(92,53),(104,65)],
  [(104,65),(100,75),(87,72),(91,66)],[(91,66),(95,62),(101,69),(97,72)],
  [(9,48),(4,42),(8,30),(19,32)],[(19,32),(28,29),(35,39),(30,47)],
 ]
 for p in paths:
  pts=cubic(*p)
  points=[(int(x*S),int(y*S)) for x,y in pts]
  d.line(points,fill=dark,width=5*S,joint='curve');d.line(points,fill=gold,width=2*S,joint='curve')
 d.ellipse((107*S,73*S,112*S,78*S),fill=(239,183,87,220))
 return im.resize((w,h),Image.Resampling.LANCZOS)
orn=ornament();orn.save(R/'exports/u04_dialogue_corner_cloud_bottom_left.png')
orn.transpose(Image.Transpose.ROTATE_180).save(R/'exports/u04_dialogue_corner_cloud_top_right.png')
bg.alpha_composite(orn,(0,620));bg.alpha_composite(orn.transpose(Image.Transpose.ROTATE_180),(1152,530))
# Individual controls, label, copy live on review overlay only; none is baked into the nine-slice source.
ov=Image.new('RGBA',(W,H));d=ImageDraw.Draw(ov)
font='/System/Library/Fonts/STHeiti Medium.ttc'
fn=ImageFont.truetype(font,22);fs=ImageFont.truetype(font,18);fl=ImageFont.truetype(font,26)
def tab(x,y,w,h,label,selected=False,font=fs):
 fill=(10,25,53,235);edge=(225,163,77,245) if selected else (137,100,61,215)
 d.rounded_rectangle((x,y,x+w,y+h),radius=13,fill=fill,outline=edge,width=2)
 if selected:d.rounded_rectangle((x+2,y+2,x+w-2,y+h-2),radius=11,outline=(231,188,100,70),width=2)
 bb=d.textbbox((0,0),label,font=font);d.text((x+(w-(bb[2]-bb[0]))/2,y+(h-(bb[3]-bb[1]))/2-bb[1]),label,font=font,fill=(255,221,146,255) if selected else (221,220,222,255))
# Layout follows preview: two compact independent selector rows then broad bottom dialogue.
for i,label in enumerate(['0魂','2魂','3魂']):tab(480+i*83,445,76,31,label,i==0)
for i,label in enumerate(['高兴','惊讶','悲伤','微笑','生气']):tab(748+i*102,445,95,31,label,i==['happy','surprised','sad','smile','angry'].index(emotion))
for i,label in enumerate(['孟桃','阿棠','阿炭','阿角','阿灯','小锦']):tab(470+i*131,484,123,37,label,i==0,fn)
d.text((510,568),'孟桃',font=fl,fill=(255,221,140,255))
d.line((510,607,754,607),fill=(177,116,54,180),width=2)
d.text((510,623),'今晚的夜市刚亮灯，来杯热奶茶吧。',font=fl,fill=(245,237,227,255))
d.polygon([(1190,662),(1215,662),(1202,680)],fill=(253,197,102,255))
bg.alpha_composite(ov)
# Character stays in front of the panel as in v0.2 layout; source RGB retained outside face WIP mask.
char=Image.open(R/f'review/mt_s0_{emotion}_support_recomposed_wip.png').convert('RGBA').crop((0,0,1024,850)).resize((614,510),Image.Resampling.LANCZOS)
bg.alpha_composite(char,(-55,210))
bg.convert('RGB').save(R/f'review/mt_s0_u00_static_{emotion}_sample.png')
