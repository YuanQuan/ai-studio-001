from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib
R=Path('deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1');BG=Path('deliverables/art/SCENE-CLARITY-REDRAW-ASSET-20261010/v0.3/review/current_shops_on_v03_scene.png')
M=json.loads((R/'LAYER_EXPORT_MAP.json').read_text())['stages'];W,H=1280,720
names={'mt':'孟桃','at':'阿棠','ac':'阿炭','aj':'阿角','ad':'阿灯','xj':'小锦'};states=['happy','surprised','sad','smile','angry'];cn=['高兴','惊讶','悲伤','微笑','生气'];keys=['mt_s0','at_s2','ac_s0','aj_s0','ad_s0','xj_s0']
bgraw=Image.open(BG).convert('RGB').crop((360,0,2180,1024)).resize((W,H),Image.Resampling.LANCZOS).convert('RGBA')
panel=Image.open(R/'exports/u04_dialogue_panel_9s.png').convert('RGBA');cloud=Image.open(R/'exports/u04_dialogue_corner_cloud_bottom_left.png').convert('RGBA');cloud2=Image.open(R/'exports/u04_dialogue_corner_cloud_top_right.png').convert('RGBA')
def sliced(src,w,h):
 out=Image.new('RGBA',(w,h));xx=[0,48,464,512];yy=[0,48,208,256];tx=[0,48,w-48,w];ty=[0,48,h-48,h]
 for j in range(3):
  for i in range(3):
   tile=src.crop((xx[i],yy[j],xx[i+1],yy[j+1]));size=(tx[i+1]-tx[i],ty[j+1]-ty[j]);tile=tile if tile.size==size else tile.resize(size,Image.Resampling.BICUBIC);out.alpha_composite(tile,(tx[i],ty[j]))
 return out
frame=sliced(panel,1280,195)
font='/System/Library/Fonts/STHeiti Medium.ttc';fn=ImageFont.truetype(font,22);fs=ImageFont.truetype(font,18);fl=ImageFont.truetype(font,26);fsub=ImageFont.truetype(font,24)
def tab(d,x,y,w,h,label,selected=False,font=fs):
 fill=(10,25,53,235);edge=(225,163,77,245) if selected else (137,100,61,215);d.rounded_rectangle((x,y,x+w,y+h),radius=13,fill=fill,outline=edge,width=2)
 bb=d.textbbox((0,0),label,font=font);d.text((x+(w-(bb[2]-bb[0]))/2,y+(h-(bb[3]-bb[1]))/2-bb[1]),label,font=font,fill=(255,221,146,255) if selected else (221,220,222,255))
review=[];sheet=Image.new('RGB',(1280,1200),'#172232');sd=ImageDraw.Draw(sheet)
for n,key in enumerate(keys):
 code,soul=key.split('_s');soul=int(soul);name=names[code];stage=M[key.upper()];geom=stage['handoff_normalized']
 base=Image.open(stage['base']['path']).convert('RGBA');face=Image.open(stage['face']['states']['smile']['combined']['path']).convert('RGBA');front=Image.open(stage.get('front_hair',stage.get('front_occlusion'))['path']).convert('RGBA')
 body=base.copy();body.alpha_composite(face,tuple(geom['face_offset_in_base_export_xy']));body.alpha_composite(front,tuple(geom['front_offset_in_base_export_xy']))
 bbox=body.getchannel('A').getbbox();assert bbox
 waist_fraction={'mt':0.68,'at':0.70,'ac':0.67,'aj':0.68,'ad':0.72,'xj':0.70}[code]
 display_rect=(bbox[0],bbox[1],bbox[2],bbox[1]+round((bbox[3]-bbox[1])*waist_fraction))
 crop=body.crop(display_rect);scale=500/crop.height;pw=round(crop.width*scale);portrait=crop.resize((pw,500),Image.Resampling.LANCZOS)
 out=bgraw.copy();out.alpha_composite(frame,(0,525));out.alpha_composite(cloud,(0,620));out.alpha_composite(cloud2,(1152,530))
 ov=Image.new('RGBA',(W,H));d=ImageDraw.Draw(ov)
 for j,label in enumerate(['0魂','2魂','3魂']):tab(d,480+j*83,445,76,31,label,[0,2,3][j]==soul)
 for j,label in enumerate(cn):tab(d,748+j*102,445,95,31,label,label=='微笑')
 for j,label in enumerate(names.values()):tab(d,470+j*131,484,123,37,label,label==name,fn)
 d.text((510,568),name,font=fl,fill=(255,221,140,255));d.line((510,607,754,607),fill=(177,116,54,180),width=2)
 d.text((510,623),'今晚的夜市刚亮灯。',font=fl,fill=(245,237,227,255));d.polygon([(1190,662),(1215,662),(1202,680)],fill=(253,197,102,255));out.alpha_composite(ov)
 x=round(185-pw/2);out.alpha_composite(portrait,(x,210))
 out=out.convert('RGB');full=R/f'review/overview_{key}_u00_static.png';out.save(full)
 tx=(n%2)*640;ty=(n//2)*400;sheet.paste(out.resize((640,360),Image.Resampling.LANCZOS),(tx,ty));sd.rectangle((tx,ty+360,tx+639,ty+399),fill='#122032');sd.text((tx+14,ty+365),f'{name} · {soul}魂 · 微笑',font=fsub,fill='#f4d994')
 review.append({'stage':key.upper(),'source_export_assets':[stage['base']['path'],stage['face']['states']['smile']['combined']['path'],stage.get('front_hair',stage.get('front_occlusion'))['path']],'recomposition_path':str(full),'recomposition_sha256':hashlib.sha256(full.read_bytes()).hexdigest(),'source_bbox_xyxy':bbox,'display_source_rect_in_base_xyxy':display_rect,'waist_fraction_candidate':waist_fraction,'portrait_visible_height_px':500,'portrait_scale':scale,'portrait_position_xy':[x,210]})
sheetpath=R/'review/u00_dialogue_overview.png';sheet.save(sheetpath)
(R/'review/u00_dialogue_overview_sources.json').write_text(json.dumps({'kind':'STATIC_RECOMPOSITION_NOT_RUNTIME_SCREENSHOT','source_background':str(BG),'source_background_sha256':hashlib.sha256(BG.read_bytes()).hexdigest(),'uniform_canvas_px':[1280,720],'uniform_viewport_crop_xyxy':[360,0,2180,1024],'uniform_panel_asset':'exports/u04_dialogue_panel_9s.png','uniform_panel_size_px':[1280,195],'uniform_expression':'smile','uniform_visible_portrait_height_px':500,'controls':['manager','soul_stage','expression'],'sheet_path':str(sheetpath),'panels':review},ensure_ascii=False,indent=2))
print(sheetpath)
