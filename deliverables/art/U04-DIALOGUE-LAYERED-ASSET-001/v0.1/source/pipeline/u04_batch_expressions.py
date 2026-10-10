from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
import numpy as np, math
R=Path('deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1')
C={
 'mt_s2':{'F':(360,100,616,356),'parts':{'lb':(442,162,510,202),'rb':(532,195,578,224),'le':(409,188,511,262),'re':(527,218,601,277),'mouth':(478,268,529,299)},'center':(141,181),'default':'smile'},
 'mt_s3':{'F':(360,100,616,356),'parts':{'lb':(442,162,510,202),'rb':(532,195,578,224),'le':(409,188,511,262),'re':(527,218,601,277),'mouth':(478,268,529,299)},'center':(141,181),'default':'smile'},
 'at_s0':{'F':(380,180,636,436),'parts':{'lb':(398,253,446,285),'rb':(480,239,541,264),'le':(393,273,478,325),'re':(482,267,575,324),'mouth':(464,334,507,359)},'center':(101,162),'default':'sad'},
 'at_s2':{'F':(380,160,636,416),'parts':{'lb':(397,227,450,259),'rb':(480,204,542,226),'le':(398,258,479,321),'re':(483,229,572,310),'mouth':(461,307,509,340)},'center':(105,164),'default':'smile'},
 'at_s3':{'F':(380,150,636,406),'parts':{'lb':(397,213,456,251),'rb':(482,196,549,229),'le':(393,244,480,315),'re':(482,228,581,303),'mouth':(475,305,534,357)},'center':(122,180),'default':'happy'},
}
S=4
for key,cfg in C.items():
 orig=Image.open(R/f'source/approved_original_{key}.png').convert('RGBA')
 base=Image.open(R/f'source/{key}_clean_face_wip.png').convert('RGBA')
 front=Image.open(R/f'source/{key}_front_hair_wip.png').convert('RGBA')
 F=cfg['F'];W=256;red=key.startswith('mt')
 ink=(99,42,43,255) if red else (103,61,43,255)
 inner=(103,37,47,255) if red else (113,64,52,255)
 lip=(226,114,111,255) if red else (230,139,113,255)
 originals={}
 for name,(x0,y0,x1,y1) in cfg['parts'].items():
  crop=orig.crop((x0,y0,x1,y1));a=np.asarray(crop).astype(np.float32);r,g,b=a[:,:,0],a[:,:,1],a[:,:,2];yy,xx=np.mgrid[y0:y1,x0:x1]
  cx=(x0+x1)/2;cy=(y0+y1)/2;rx=(x1-x0)/2;ry=(y1-y0)/2
  ellipse=((xx-cx)/rx)**2+((yy-cy)/ry)**2
  if name in ('lb','rb'):
   if red: st=np.maximum((205-r)/65,(145-g)/60);st=np.minimum(st,(165-b)/55)
   else:st=np.maximum((185-r)/75,(145-g)/75);st=np.minimum(st,(135-b)/65)
  elif name in ('le','re'):
   if red:
    dark=np.maximum((190-r)/80,(155-g)/75);white=np.minimum((g-210)/30,(b-198)/38);st=np.maximum(dark,white)
   else:
    dark=np.maximum((185-r)/80,(150-g)/70);white=np.minimum((g-210)/31,(b-199)/35)
    gold=np.minimum((r-g-17)/27,(g-b-22)/25)
    st=np.maximum(np.maximum(dark,white),gold)
  else:
   if red:st=np.maximum((203-r)/78,(155-g)/70)
   else:st=np.maximum((221-r)/74,(164-g)/66)
  st=np.clip(st,0,1)*np.clip((1.05-ellipse)/.13,0,1)
  # The eye rectangles intentionally exclude the brow area; no rectangular skin from original enters a layer.
  if name=='le':st*=np.clip((yy-(y0+5))/5,0,1);st*=np.clip((xx-(x0+7))/7,0,1)
  if name=='re':st*=np.clip((yy-(y0+4))/5,0,1);st*=np.clip(((x1-7)-xx)/7,0,1)
  mask=Image.fromarray(np.uint8(st*255)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(.65))
  alpha=np.uint8(np.asarray(mask,dtype=np.float32)*a[:,:,3]/255)
  crop.putalpha(Image.fromarray(alpha)); originals[name]=(crop,(x0-F[0],y0-F[1]))
 def piece(name,dy=0,sy=1,angle=0,dx=0):
  im,(x,y)=originals[name];res=im
  if sy!=1:res=res.resize((res.width,max(1,round(res.height*sy))),Image.Resampling.LANCZOS)
  if angle:res=res.rotate(angle,Image.Resampling.BICUBIC,expand=True)
  out=Image.new('RGBA',(W,W));ox=round(x+dx+(im.width-res.width)/2);oy=round(y+dy+(im.height-res.height)/2)
  if ox>=0 and oy>=0 and ox+res.width<=W and oy+res.height<=W:out.alpha_composite(res,(ox,oy))
  return out
 def curve(d,pts,width,color):
  last=None
  for i in range(101):
   t=i/100;u=1-t;xp=(u*u*pts[0][0]+2*u*t*pts[1][0]+t*t*pts[2][0])*S;yp=(u*u*pts[0][1]+2*u*t*pts[1][1]+t*t*pts[2][1])*S
   if last:d.line((last[0],last[1],xp,yp),fill=color,width=max(1,round(width*S)))
   last=(xp,yp)
 def mouth(state):
  if state==cfg['default'] and key!='at_s0':
   return piece('mouth')
  cx,cy=cfg['center'];im=Image.new('RGBA',(W*S,W*S));d=ImageDraw.Draw(im)
  if state=='happy':
   p=[(cx-21,cy-7),(cx-13,cy+6),(cx,cy+10),(cx+13,cy+6),(cx+21,cy-7),(cx+12,cy-1),(cx,cy+2),(cx-12,cy-1)]
   d.polygon([(int(x*S),int(y*S)) for x,y in p],fill=inner)
   d.ellipse(((cx-12)*S,(cy+4)*S,(cx+12)*S,(cy+15)*S),fill=lip)
   curve(d,[(cx-21,cy-7),(cx,cy+13),(cx+21,cy-7)],2.2,ink)
  elif state=='smile':
   curve(d,[(cx-17,cy-5),(cx,cy+8),(cx+17,cy-5)],2.3,ink)
  elif state=='surprised':
   d.ellipse(((cx-9)*S,(cy-10)*S,(cx+9)*S,(cy+14)*S),fill=ink)
   d.ellipse(((cx-6)*S,(cy-7)*S,(cx+6)*S,(cy+11)*S),fill=inner)
   d.arc(((cx-6)*S,(cy+1)*S,(cx+6)*S,(cy+13)*S),0,180,fill=lip,width=2*S)
  elif state=='sad':
   curve(d,[(cx-15,cy+7),(cx,cy-7),(cx+15,cy+7)],2.4,ink)
  elif state=='angry':
   curve(d,[(cx-17,cy+4),(cx,cy-5),(cx+17,cy+1)],2.8,ink)
  return im.resize((W,W),Image.Resampling.LANCZOS)
 specs={
  'smile':{'lb':(0,1,0,0),'rb':(0,1,0,0),'le':(0,1,0,0),'re':(0,1,0,0)},
  'happy':{'lb':(-4,1,-3,0),'rb':(-4,1,3,0),'le':(1,.78,0,0),'re':(1,.78,0,0)},
  'surprised':{'lb':(-9,1,-6,0),'rb':(-9,1,6,0),'le':(-2,1.15,0,0),'re':(-2,1.15,0,0)},
  'sad':{'lb':(3,1,8,0),'rb':(3,1,-8,0),'le':(2,.88,0,0),'re':(2,.88,0,0)},
  'angry':{'lb':(5,1,-13,0),'rb':(5,1,13,0),'le':(2,.84,0,0),'re':(2,.84,0,0)},
 }
 for state,spec in specs.items():
  brows=Image.new('RGBA',(W,W));eyes=Image.new('RGBA',(W,W))
  for n in ['lb','rb']:
   dy,sy,ang,dx=spec[n]
   if red and n=='rb':dy,sy,ang,dx=(0,1,0,0)
   brows.alpha_composite(piece(n,dy,sy,ang,dx))
  for n in ['le','re']:
   dy,sy,ang,dx=spec[n];eyes.alpha_composite(piece(n,dy,sy,ang,dx))
  m=mouth(state)
  for typ,im in [('brows',brows),('eyes',eyes),('mouth',m)]:im.save(R/f'source/{key}_{state}_{typ}.png')
  both=Image.new('RGBA',(W,W));both.alpha_composite(brows);both.alpha_composite(eyes);both.alpha_composite(m);both.save(R/f'exports/u04_{key}_face_{state}.png')
  full=base.copy();paste=Image.new('RGBA',orig.size);paste.paste(both,F[:2]);full.alpha_composite(paste);full.alpha_composite(front)
  bg=Image.new('RGBA',orig.size,(22,32,47,255));bg.alpha_composite(full)
  bg.crop((256,0,768,512)).convert('RGB').save(R/f'review/{key}_{state}_face_wip.png')
 sheet=Image.new('RGB',(5*512,544),'#16202f');draw=ImageDraw.Draw(sheet)
 for i,state in enumerate(['smile','happy','surprised','sad','angry']):
  sheet.paste(Image.open(R/f'review/{key}_{state}_face_wip.png'),(i*512,0));draw.text((i*512+15,518),state,fill='#e2c296')
 sheet.save(R/f'review/{key}_five_expression_wip.png')
 print(key,'done',F)
