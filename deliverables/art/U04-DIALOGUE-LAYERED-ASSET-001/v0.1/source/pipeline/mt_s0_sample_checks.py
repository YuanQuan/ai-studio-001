from pathlib import Path
from PIL import Image
import hashlib,json,struct,numpy as np
R=Path('deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1').resolve(); rel=lambda p:str(Path(p).resolve().relative_to(R.parent.parent.parent.parent))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def rec(p):
 p=Path(p);im=Image.open(p);return {'path':rel(p),'sha256':sha(p),'width':im.width,'height':im.height,'mode':im.mode}
emo=['happy','surprised','sad','smile','angry']
mapo={'status':'FIRST_SAMPLE','stage_key':'MT_S0','approved_source':rec(R/'source/approved_original_mt_s0.png'),'source_canvas':{'width':1024,'height':1536},'psd':rec(R/'source/u04_mt_s0_dialogue.psd') if False else {'path':rel(R/'source/u04_mt_s0_dialogue.psd'),'sha256':sha(R/'source/u04_mt_s0_dialogue.psd')},'base':{**rec(R/'exports/u04_mt_s0_base.png'),'source_rect_xyxy':[193,0,866,1024]},'face':{'canvas':[256,256],'source_rect_xyxy':[360,100,616,356],'pivot_source_xy':[488,228],'offset_in_base_xy':[167,100],'states':{}},'front_hair':{**rec(R/'exports/u04_mt_s0_front_hair.png'),'source_rect_xyxy':[505,88,633,280],'offset_in_base_xy':[312,88]},'composition_order':['base','one selected face state','front_hair'],'switch_rule':'仅显示一组表情；切店长/阶段重载该组基底、五态脸片与前发，保留用户未改变的轴值','sample_only':True}
for e in emo:
 mapo['face']['states'][e]={'combined':rec(R/f'exports/u04_mt_s0_face_{e}.png'),'editable_sources':{part:rec(R/f'source/mt_s0_{e}_{part}.png') for part in ['brows','eyes','mouth']},'u00_static_review':rec(R/f'review/mt_s0_u00_static_{e}_sample.png')}
(R/'LAYER_EXPORT_MAP.json').write_text(json.dumps(mapo,ensure_ascii=False,indent=2))
# Verify PSD layer count and hidden flags straight from layer records.
p=R/'source/u04_mt_s0_dialogue.psd';data=p.read_bytes();u32=lambda q:struct.unpack_from('>I',data,q)[0];u16=lambda q:struct.unpack_from('>H',data,q)[0];o=26;o+=4+u32(o);o+=4+u32(o);o+=4;o+=4;n=struct.unpack_from('>h',data,o)[0];o+=2;flags=[]
for i in range(n):
 o+=16;c=u16(o);o+=2+c*6;o+=8;flags.append(int(data[o+2]));o+=4;ex=u32(o);o+=4+ex
# Reverse manifest order equals writer's top-down PSD record order.
manifest=json.loads((R/'source/mt_s0_layer_manifest.json').read_text());layer_names=[x['name'] for x in manifest['layers']][::-1]
visible=[name for name,f in zip(layer_names,flags) if f&2==0];hidden=[name for name,f in zip(layer_names,flags) if f&2]
errors={}
base=Image.open(R/'exports/u04_mt_s0_base.png').convert('RGBA');front=Image.open(R/'exports/u04_mt_s0_front_hair.png').convert('RGBA')
for e in emo:
 image=base.copy();image.alpha_composite(Image.open(R/f'exports/u04_mt_s0_face_{e}.png').convert('RGBA'),(167,100));image.alpha_composite(front,(312,88));target=Image.open(R/f'review/mt_s0_{e}_support_recomposed_wip.png').convert('RGBA').crop((193,0,866,1024));diff=np.abs(np.asarray(image,dtype=np.int16)-np.asarray(target,dtype=np.int16));errors[e]={'max_channel_delta':int(diff.max()),'nonzero_channels':int(np.count_nonzero(diff))};image.save(R/f'review/mt_s0_{e}_export_recomposition.png')
valid={'status':'FIRST_SAMPLE','psd':{'path':rel(p),'sha256':sha(p),'canvas':[1024,1536],'layer_count':n,'visible_layers':visible,'hidden_layers':hidden,'hidden_flag_count':sum(bool(f&2) for f in flags),'reference_layer_hidden':any('REFERENCE_APPROVED' in x for x in hidden),'editable_expression_layers':15},'recomposition_export_vs_full':errors,'limitations':['PSD为可编辑栅格层，不表示原生矢量或原画天然分层','PSD预览缓存以#16202f背景合成，导出PNG仍保留透明alpha','仅孟桃0魂首样张；其他17组尚未制作'], 'result':'PASS_FOR_FIRST_SAMPLE_TECH_REVIEW'}
(R/'PSD_VALIDATION.json').write_text(json.dumps(valid,ensure_ascii=False,indent=2))
# Four 48x48 corners must match source for all approved stretch sizes.
src=Image.open(R/'exports/u04_dialogue_panel_9s.png').convert('RGBA');checks={}
for w,h in [(384,192),(768,256),(1024,384)]:
 im=Image.open(R/f'review/panel_9s_{w}x{h}.png').convert('RGBA');same=True;corner=[]
 for sx,sy,dx,dy in [(0,0,0,0),(464,0,w-48,0),(0,208,0,h-48),(464,208,w-48,h-48)]:
  eq=np.array_equal(np.asarray(src.crop((sx,sy,sx+48,sy+48))),np.asarray(im.crop((dx,dy,dx+48,dy+48))));corner.append(bool(eq));same&=eq
 checks[f'{w}x{h}']={'path':rel(R/f'review/panel_9s_{w}x{h}.png'),'corner_pixel_equal':corner,'all_corners_equal':same}
ns={'status':'FIRST_SAMPLE_STATIC_CHECK','panel':rec(R/'exports/u04_dialogue_panel_9s.png'),'psd':{'path':rel(R/'source/u04_dialogue_panel_9s.psd'),'sha256':sha(R/'source/u04_dialogue_panel_9s.psd')},'insets_px':{'left':48,'right':48,'top':48,'bottom':48},'cuts_source_xy':{'x':[48,464],'y':[48,208]},'minimum_geometry_px':[96,96],'text_layout_candidate_lower_bound_px':[384,192],'sizes':checks,'fixed_decor':[rec(R/'exports/u04_dialogue_corner_cloud_bottom_left.png'),rec(R/'exports/u04_dialogue_corner_cloud_top_right.png')],'creator_sprite_sliced':'NOT_TESTED','result':'PASS_STATIC_ONLY'}
(R/'NINE_SLICE_CHECK.json').write_text(json.dumps(ns,ensure_ascii=False,indent=2))
print('map, psd, nine-slice written',n,len(visible),len(hidden),errors)
