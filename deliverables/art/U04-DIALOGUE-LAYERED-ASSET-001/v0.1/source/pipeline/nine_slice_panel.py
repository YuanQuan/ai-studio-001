from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import json, subprocess
R=Path('deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1')
S=4; W,H=512,256
layers=R/'source/panel_layers'; layers.mkdir(parents=True,exist_ok=True)

def save_layer(name, im):
    p=layers/(name+'.png'); im.resize((W,H),Image.Resampling.LANCZOS).save(p);return p

fill=Image.new('RGBA',(W*S,H*S),(0,0,0,0));d=ImageDraw.Draw(fill)
d.rounded_rectangle((3*S,3*S,(W-4)*S,(H-4)*S),radius=27*S,fill=(8,21,44,235))
# subtle darker center for readability, clipped to rounded rectangle
shade=Image.new('RGBA',(W*S,H*S),(0,0,0,0));pix=shade.load()
for y in range(5*S,(H-5)*S):
    for x in range(5*S,(W-5)*S):
        yy=y/(H*S)
        a=int(28+45*yy)
        pix[x,y]=(2,6,17,a)
mask=Image.new('L',(W*S,H*S),0);ImageDraw.Draw(mask).rounded_rectangle((5*S,5*S,(W-6)*S,(H-6)*S),radius=25*S,fill=255)
shade.putalpha(Image.composite(shade.getchannel('A'),Image.new('L',shade.size,0),mask))
edge=Image.new('RGBA',(W*S,H*S),(0,0,0,0));d=ImageDraw.Draw(edge)
d.rounded_rectangle((2*S,2*S,(W-3)*S,(H-3)*S),radius=29*S,outline=(228,166,75,255),width=3*S)
d.rounded_rectangle((8*S,8*S,(W-9)*S,(H-9)*S),radius=23*S,outline=(125,88,52,200),width=S)
# thin gold accent inside top edge, no text or ornament in scalable center
# corners are their own fixed overlay layer
corner=Image.new('RGBA',(W*S,H*S),(0,0,0,0));d=ImageDraw.Draw(corner)
for cx,cy,sx,sy in [(25,25,1,1),(W-26,25,-1,1),(25,H-26,1,-1),(W-26,H-26,-1,-1)]:
    cx*=S;cy*=S
    d.arc((cx-13*S,cy-13*S,cx+13*S,cy+13*S),45 if sx*sy==1 else 135,215 if sx*sy==1 else 305,fill=(244,184,93,220),width=2*S)
    d.ellipse((cx-2*S,cy-2*S,cx+2*S,cy+2*S),fill=(248,202,117,210))
paths=[save_layer('panel_fill',fill),save_layer('panel_shade',shade),save_layer('panel_border',edge),save_layer('fixed_corner_decor',corner)]
composite=Image.new('RGBA',(W,H),(0,0,0,0))
for p in paths[:3]: composite=Image.alpha_composite(composite,Image.open(p).convert('RGBA'))
composite.save(R/'exports/u04_dialogue_panel_9s.png')
Image.open(paths[3]).save(R/'exports/u04_dialogue_corner_decor.png')
manifest={'canvas':{'width':W,'height':H,'composite_background':'#102038'},'layers':[{'name':name,'file':str(path.resolve()),'remove_background':'none'} for name,path in zip(['Panel fill','Panel shade','Gold border','Fixed corner decor'],paths)]}
mp=R/'source/panel_manifest.json';mp.write_text(json.dumps(manifest,indent=2))
subprocess.run(['python3','/Users/yuanquan/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py','assemble','--manifest',str(mp),'--output',str(R/'source/u04_dialogue_panel_9s.psd'),'--preview',str(R/'review/u04_dialogue_panel_psd_preview.png')],check=True)
# nine-slice reproduction using original pixel cells
src=composite
L=T=Rt=B=48
for width,height in [(384,192),(768,256),(1024,384)]:
    out=Image.new('RGBA',(width,height),(0,0,0,0))
    xx=[0,L,W-Rt,W]; xx2=[0,L,width-Rt,width]
    yy=[0,T,H-B,H];yy2=[0,T,height-B,height]
    for j in range(3):
        for i in range(3):
            cell=src.crop((xx[i],yy[j],xx[i+1],yy[j+1]))
            target=(xx2[i+1]-xx2[i],yy2[j+1]-yy2[j])
            if cell.size!=target: cell=cell.resize(target,Image.Resampling.BICUBIC)
            out.alpha_composite(cell,(xx2[i],yy2[j]))
    out.save(R/f'review/panel_9s_{width}x{height}.png')
print('panel complete',R/'exports/u04_dialogue_panel_9s.png')
