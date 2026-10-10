from PIL import Image,ImageDraw,ImageFilter
import numpy as np
from pathlib import Path
R=Path('deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1')
# All coordinates are per-stage in the 512x512 diagnostic crop (source x+256,y).
cfg={
 'mt_s2':{'samples':[(210,125,258,160),(202,164,258,187),(173,238,234,270),(192,283,248,311),(247,214,270,248),(279,290,308,316)],'patches':[(151,156,271,273,17),(263,173,350,293,15),(207,259,304,311,14)],'nose':(260,258,274,276),'face':[(213,112),(258,112),(269,145),(280,179),(299,196),(315,210),(327,227),(335,247),(335,266),(325,281),(312,292),(303,303),(288,315),(251,330),(218,320),(188,300),(169,275),(156,244),(155,215),(165,190),(184,155)],'hair':[(257,100),(273,107),(281,145),(284,173),(293,198),(303,219),(289,222),(276,198),(266,175),(260,140)]},
 'mt_s3':{'samples':[(211,126,258,160),(202,168,258,188),(174,239,236,270),(193,280,248,310),(247,211,271,247),(277,290,307,314)],'patches':[(151,157,271,273,17),(263,173,350,293,15),(207,259,304,311,14)],'nose':(260,258,274,276),'face':[(213,112),(258,112),(269,145),(280,179),(299,196),(315,210),(327,227),(335,247),(335,266),(325,281),(312,292),(303,303),(288,315),(251,330),(218,320),(188,300),(169,275),(156,244),(155,215),(165,190),(184,155)],'hair':[(257,100),(273,107),(281,145),(284,173),(293,198),(303,219),(289,222),(276,198),(266,175),(260,140)]},
 'at_s0':{'samples':[(176,273,196,286),(200,249,229,267),(220,270,249,284),(199,329,217,343),(231,329,258,344),(263,322,286,340),(183,315,204,326)],'patches':[(132,245,224,340,13),(213,223,324,326,13),(202,329,255,361,11)],'nose':(214,318,230,335),'face':[(135,278),(154,247),(184,230),(221,215),(270,215),(302,236),(319,263),(319,288),(307,320),(292,350),(259,365),(220,366),(185,352),(159,325),(146,290)],'hair':[(142,228),(165,210),(188,190),(222,180),(260,185),(291,205),(310,235),(282,240),(250,220),(211,229),(177,250)]},
 'at_s2':{'samples':[(180,253,201,266),(202,230,223,246),(221,250,247,264),(191,315,210,329),(240,311,266,329),(267,302,291,318),(217,334,240,346)],'patches':[(133,222,225,327,13),(218,205,324,300,13),(205,316,256,349,10)],'nose':(215,300,233,316),'face':[(136,263),(153,230),(185,207),(225,194),(275,196),(307,220),(319,250),(316,280),(306,314),(287,344),(246,354),(209,342),(177,322),(151,287)],'hair':[(142,214),(173,190),(206,168),(245,170),(283,187),(312,215),(284,227),(251,204),(208,216),(169,236)]},
 'at_s3':{'samples':[(182,243,199,255),(204,218,227,235),(222,244,246,258),(195,300,213,316),(244,300,267,318),(270,285,291,304),(215,336,240,350)],'patches':[(134,211,225,315,12),(218,190,327,295,13),(207,292,282,346,10)],'nose':(222,273,239,294),'face':[(137,256),(155,220),(186,198),(226,184),(275,187),(309,212),(328,246),(324,276),(307,308),(286,343),(246,353),(207,337),(174,316),(151,276)],'hair':[(143,201),(174,177),(210,154),(248,158),(288,177),(312,208),(288,217),(252,194),(213,206),(169,225)]},
}
for key,c in cfg.items():
 src=Image.open(R/f'source/{key}_clean_edge.png').convert('RGBA');a=np.asarray(src).copy();crop=a[:512,256:768];rgb=crop[:,:,:3].astype(np.float32);h,w=rgb.shape[:2];yy,xx=np.mgrid[:h,:w];trusted=np.zeros((h,w),bool)
 for x0,y0,x1,y1 in c['samples']:trusted[y0:y1,x0:x1]=True
 r,g,b=rgb[:,:,0],rgb[:,:,1],rgb[:,:,2];trusted&=(r>160)&(g>105)&(b>80)&(r-g>18)&(g-b>8)&(a[:512,256:768,3]>200)
 x=(xx-245)/100;y=(yy-260)/100;basis=np.stack([np.ones_like(x),x,y,x*x,x*y,y*y],axis=-1);A=basis[trusted]
 if len(A)<200:print(key,'too few samples',len(A));continue
 reg=np.diag([0,.5,.5,20,20,20]);field=[]
 for ch in range(3):
  vals=rgb[:,:,ch][trusted];coef=np.linalg.solve(A.T@A+reg,A.T@vals);field.append(np.sum(basis*coef,axis=2))
 field=np.clip(np.stack(field,axis=2),0,255)
 m=Image.new('L',(512,512));d=ImageDraw.Draw(m)
 for x0,y0,x1,y1,rad in c['patches']:d.rounded_rectangle((x0,y0,x1,y1),radius=rad,fill=255)
 d.ellipse(c['nose'],fill=0)
 shape=Image.new('L',(512,512));ImageDraw.Draw(shape).polygon(c['face'],fill=255)
 ma=np.asarray(m.filter(ImageFilter.GaussianBlur(6)),dtype=np.float32)/255*np.asarray(shape.filter(ImageFilter.GaussianBlur(1.5)),dtype=np.float32)/255
 # Preserve per-stage hair pixels in the front-fringe region, especially the ends over the eyebrow.
 hairreg=Image.new('L',(512,512));ImageDraw.Draw(hairreg).polygon(c['hair'],fill=255)
 hh=np.asarray(hairreg,dtype=np.float32)/255
 if key.startswith('mt'): haircol=(r<195)&(g<125)&(b<135)&(r>g+35)
 else:haircol=(r<205)&(g<165)&(b<130)&(r>g+20)
 hair=hh*haircol
 # Do not restore eyes/eyebrows as hair; stage-specific ceiling prevents feature contamination.
 ceiling={'mt_s2':223,'mt_s3':223,'at_s0':261,'at_s2':246,'at_s3':236}[key]
 hair*=yy<ceiling
 if key=='at_s3': hair*=~((xx>265)&(xx<302)&(yy>199)&(yy<224))
 if key=='at_s0': hair*=~(((xx>131)&(xx<191)&(yy>254))|((xx>218)&(xx<283)&(yy>238)))
 if key=='at_s2': hair*=~(((xx>133)&(xx<192)&(yy>230))|((xx>218)&(xx<283)&(yy>208)))
 if key=='at_s3': hair*=~(((xx>134)&(xx<193)&(yy>219))|((xx>217)&(xx<281)&(yy>197)))
 hair=np.asarray(Image.fromarray(np.uint8(hair*255)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(.7)),dtype=np.float32)/255
 ma*=1-hair
 orig_rgb=rgb.copy();a[:512,256:768,:3]=np.uint8(np.round(orig_rgb*(1-ma[:,:,None])+field*ma[:,:,None]))
 clean=Image.fromarray(a,'RGBA');clean.save(R/f'source/{key}_clean_face_wip.png')
 fronta=np.zeros_like(a);fronta[:512,256:768,:3]=crop[:,:,:3];fronta[:512,256:768,3]=np.uint8(np.clip(hair*crop[:,:,3],0,255));front=Image.fromarray(fronta,'RGBA');front.save(R/f'source/{key}_front_hair_wip.png')
 actual=np.any(orig_rgb.astype(np.uint8)!=a[:512,256:768,:3],axis=2)
 Image.fromarray(np.maximum(np.uint8(ma*255),np.uint8(actual)*255)).save(R/f'source/{key}_feature_mask_wip.png')
 blue=Image.new('RGB',clean.size,'#16202f');blue.paste(clean,mask=clean.getchannel('A'));blue.crop((256,0,768,512)).save(R/f'review/{key}_clean_face_wip.png')
 print(key,'samples',len(A),'mask>',int((ma>0.5).sum()),'hair>',int((hair>0.5).sum()))
