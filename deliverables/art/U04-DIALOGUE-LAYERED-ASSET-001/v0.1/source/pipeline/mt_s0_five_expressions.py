from PIL import Image,ImageDraw,ImageFilter
import numpy as np, math
from pathlib import Path
R=Path('deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1')
(R/'source').mkdir(exist_ok=True);(R/'exports').mkdir(exist_ok=True);(R/'review').mkdir(exist_ok=True)
orig=Image.open(R/'source/mt_s0_clean_edge_work.png').convert('RGBA')
base=Image.open(R/'source/mt_s0_clean_face_full.png').convert('RGBA')
F=(360,100,616,356); W=256
# Isolate pixels belonging to approved eyebrow and eye artwork, rather than moving skin-color rectangular crops.
parts={
'lb':(442,163,510,201,'brow'),'rb':(532,198,578,222,'brow'),
'le':(408,185,509,260,'eye'),'re':(526,218,599,275,'eye'),
}
def extract(name):
 x0,y0,x1,y1,kind=parts[name]; im=orig.crop((x0,y0,x1,y1)); a=np.asarray(im).astype(np.float32); rgb=a[:,:,:3];r,g,b=rgb[:,:,0],rgb[:,:,1],rgb[:,:,2]
 if kind=='brow': strength=np.maximum((195-r)/60,(135-g)/55);strength=np.minimum(strength,(150-b)/45)
 else:
  dark=np.maximum((185-r)/75,(160-g)/75);white=np.minimum((g-205)/35,(b-200)/35);strength=np.maximum(dark,white)
 strength=np.clip(strength,0,1)
 yy,xx=np.mgrid[y0:y1,x0:x1]
 if name=='lb': ellipse=((xx-475)/34)**2+((yy-182)/15)**2
 elif name=='rb': ellipse=((xx-550)/25)**2+((yy-208)/10)**2
 elif name=='le': ellipse=((xx-460)/54)**2+((yy-222)/37)**2
 else: ellipse=((xx-561)/41)**2+((yy-245)/29)**2
 strength*=np.clip((1.15-ellipse)/0.17,0,1)
 if name=='le':strength*=np.clip((yy-197)/5,0,1)  # exclude approved brow tail above the eye
 if name=='rb':strength*=np.clip((573-xx)/3,0,1)
 if name=='re':strength*=np.clip((596-xx)/3,0,1)*np.clip((yy-221)/4,0,1)
 mask=Image.fromarray(np.uint8(strength*255)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(.75))
 out=im.copy();alpha=np.asarray(mask,dtype=np.float32)*a[:,:,3]/255;out.putalpha(Image.fromarray(np.uint8(alpha)))
 return out,(x0-F[0],y0-F[1])
source={n:extract(n) for n in parts}
# Change eyes/brows independently in the face coordinate system. (dy, scale-y, rotation, dx)
settings={
 'smile': {'lb':(0,1,0,0),'rb':(0,1,0,0),'le':(0,1,0,0),'re':(0,1,0,0)},
 'happy': {'lb':(-5,1,-3,-1),'rb':(0,1,0,0),'le':(2,.75,0,0),'re':(2,.75,0,0)},
 'surprised': {'lb':(-10,1,-4,0),'rb':(0,1,0,0),'le':(-2,1.18,0,0),'re':(-2,1.18,0,0)},
 'sad': {'lb':(3,1,9,0),'rb':(0,1,0,0),'le':(2,.88,0,0),'re':(2,.88,0,0)},
 'angry': {'lb':(7,1,-15,1),'rb':(0,1,0,0),'le':(2,.83,0,0),'re':(2,.83,0,0)},
}
def piece_layer(name, transform):
 im,(x,y)=source[name]; dy,sy,angle,dx=transform
 if sy!=1: im=im.resize((im.width,max(1,round(im.height*sy))),Image.Resampling.LANCZOS)
 if angle: im=im.rotate(angle,Image.Resampling.BICUBIC,expand=True)
 dest=Image.new('RGBA',(W,W)); xx=round(x+dx+(source[name][0].width-im.width)/2);yy=round(y+dy+(source[name][0].height-im.height)/2)
 dest.alpha_composite(im,(xx,yy));return dest
S=4
INK=(99,42,43,250); INNER=(103,37,47,255); LIP=(226,114,111,255); LITE=(250,183,153,255)
def curve(draw,pts,color,width):
 for t in range(201):
  u=t/200;v=1-u;x=(v*v*pts[0][0]+2*v*u*pts[1][0]+u*u*pts[2][0])*S;y=(v*v*pts[0][1]+2*v*u*pts[1][1]+u*u*pts[2][1])*S
  if t:draw.line((px,py,x,y),fill=color,width=round(width*S),joint='curve')
  px,py=x,y
def mouth(kind):
 im=Image.new('RGBA',(W*S,W*S));d=ImageDraw.Draw(im)
 if kind=='happy':
  # wide open smile, tongue visible; warm red line matches approved mouth.
  pts=[(119,174),(122,183),(130,190),(141,194),(153,191),(162,183),(165,174),(159,178),(142,182),(126,178)]
  d.polygon([(int(x*S),int(y*S)) for x,y in pts],fill=INNER)
  d.ellipse((130*S,186*S,155*S,197*S),fill=LIP)
  curve(d,[(119,173),(141,189),(165,173)],INK,2.3)
  curve(d,[(121,176),(142,202),(163,176)],INK,2)
 elif kind=='surprised':
  d.ellipse((133*S,170*S,153*S,201*S),fill=INK)
  d.ellipse((136*S,174*S,150*S,198*S),fill=INNER)
  d.arc((137*S,184*S,149*S,200*S),0,180,fill=LIP,width=3*S)
 elif kind=='sad':
  curve(d,[(122,193),(143,174),(162,193)],INK,2.8)
  curve(d,[(128,194),(143,181),(157,194)],(185,89,79,120),1)
 elif kind=='angry':
  curve(d,[(124,188),(143,178),(161,184)],INK,3.1)
  curve(d,[(125,188),(142,185),(161,184)],INK,1.5)
 else:
  # Smile follows exact approved mouth pixels, not this redraw.
  pass
 return im.resize((W,W),Image.Resampling.LANCZOS)
for emotion,spec in settings.items():
 if emotion=='smile':
  # Original-pixel source layers make the default expression a direct approved-source reconstruction.
  brows=Image.open(R/'source/mt_s0_smile_brows_wip.png').convert('RGBA')
  eyes=Image.open(R/'source/mt_s0_smile_eyes_wip.png').convert('RGBA')
  m=Image.open(R/'source/mt_s0_smile_mouth_wip.png').convert('RGBA')
 else:
  brows=Image.new('RGBA',(W,W));eyes=Image.new('RGBA',(W,W))
  brows.alpha_composite(piece_layer('lb',spec['lb']))
  # Right features remain at approved coordinates beneath the bang. Their
  # alpha follows only eyebrow/eye strokes and sclera, never a skin rectangle.
  brows.alpha_composite(piece_layer('rb',(0,1,0,0)))
  eyes.alpha_composite(piece_layer('le',spec['le']))
  eyes.alpha_composite(piece_layer('re',(0,1,0,0)))
  m=mouth(emotion)
 for typ,im in [('brows',brows),('eyes',eyes),('mouth',m)]:im.save(R/f'source/mt_s0_{emotion}_{typ}.png')
 combined=Image.new('RGBA',(W,W))
 for im in [brows,eyes,m]:combined.alpha_composite(im)
 combined.save(R/f'exports/u04_mt_s0_face_{emotion}.png')
 full=base.copy();face=Image.new('RGBA',orig.size);face.paste(combined,F[:2]);full.alpha_composite(face)
 full.save(R/f'review/mt_s0_{emotion}_recomposed.png')
 blue=Image.new('RGB',orig.size,'#16202f');blue.paste(full,mask=full.getchannel('A'))
 blue.crop((256,0,768,512)).save(R/f'review/mt_s0_{emotion}_face_review.png')
# one comparison sheet, same scale and common face coordinate.
names=['smile','happy','surprised','sad','angry']; thumb=(512,512)
sheet=Image.new('RGB',(512*5,560),'#16202f')
d=ImageDraw.Draw(sheet)
for i,name in enumerate(names):
 im=Image.open(R/f'review/mt_s0_{name}_face_review.png').convert('RGB');sheet.paste(im,(i*512,0));d.text((i*512+20,522),name,fill='#e2c296')
sheet.save(R/'review/mt_s0_five_expression_sheet_wip.png')
