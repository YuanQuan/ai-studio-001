"""Remove source AI glyphs and render a licensed, replaceable sample text layer."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageFilter
import numpy as np,json

ROOT=Path(__file__).resolve().parents[1]
BASE=Image.open(ROOT/'source/layers/STATIC_CLEAN_BEFORE_TEXT_full.png').convert('RGB')
W,H=BASE.size
FONT=ROOT/'source/font/ZCOOLKuaiLe-Regular.ttf'
LAYER=ROOT/'source/layers';REVIEW=ROOT/'review'
LAYER.mkdir(exist_ok=True);REVIEW.mkdir(exist_ok=True)

def erase_panel(box,left_x,right_x):
    global BASE
    x0,y0,x1,y1=box
    source=np.asarray(BASE).copy()
    # The category/title panels are wood, not the ivory nameplates. Interpolate
    # between clean wood columns so a dark glyph is not copied into the fill.
    fill=BASE.copy();pixels=fill.load()
    for y in range(y0,y1):
        a=source[y,left_x].astype(float);b=source[y,right_x].astype(float)
        for x in range(x0,x1):
            t=(x-x0+1)/(x1-x0+1)
            pixels[x,y]=tuple(int(v) for v in (1-t)*a+t*b)
    mask=Image.new('L',(W,H));d=ImageDraw.Draw(mask)
    d.rectangle((x0,y0,x1-1,y1-1),fill=255)
    mask=mask.filter(ImageFilter.GaussianBlur(1.5))
    BASE=Image.composite(fill,BASE,mask)

for b,l,r in [
 ((109,341,166,394),106,171),((913,341,961,394),909,965),
 ((505,798,568,846),501,573),
 ((115,72,356,114),112,360),((831,72,939,114),827,943),
]:erase_panel(b,l,r)

def erase_ivory_plate(box):
    global BASE
    x0,y0,x1,y1=box
    # Source white plaque outline and wood shadow remain untouched. Only the
    # inset paper is rebuilt; the generated glyph can no longer survive on a
    # later nameplate layer. Keep warm ivory vertical shading instead of
    # sampling brown cabinet pixels next to the plaque.
    fill=BASE.copy();p=fill.load()
    for y in range(y0,y1):
        t=(y-y0)/(y1-y0)
        c=(round(255-7*t),round(249-19*t),round(233-36*t))
        for x in range(x0,x1):p[x,y]=c
    mask=Image.new('L',(W,H));d=ImageDraw.Draw(mask)
    d.rounded_rectangle((x0,y0,x1-1,y1-1),radius=min(19,(y1-y0)//2),fill=255)
    mask=mask.filter(ImageFilter.GaussianBlur(0.6))
    BASE=Image.composite(fill,BASE,mask)

# Twelve whole inset papers, including the incorrect source 云魄乳 glyph.
for b in [
 (69,566,190,604),(69,768,190,806),(69,972,190,1011),
 (848,566,969,605),(848,768,969,806),(848,972,969,1011),
 (286,924,399,962),(460,924,573,962),(634,924,747,962),
 (286,1043,399,1080),(460,1043,573,1080),(634,1043,747,1080),
]:erase_ivory_plate(b)
BASE.save(LAYER/'STATIC_CLEAN_full.png')

S=3
txt=Image.new('RGBA',(W*S,H*S),(0,0,0,0));d=ImageDraw.Draw(txt)
INK=(67,28,17,255);WHITE=(255,239,210,255)
def draw_center(text,cx,cy,size,color=INK):
    font=ImageFont.truetype(str(FONT),size*S)
    bb=d.textbbox((0,0),text,font=font)
    tw=bb[2]-bb[0];th=bb[3]-bb[1]
    x=round(cx*S-tw/2-bb[0]);y=round(cy*S-th/2-bb[1])
    d.text((x,y),text,font=font,fill=color)

for text,cx,cy,size in [('茶',137,366,39),('奶',935,367,39),('小料',536,823,34),
                        ('当前订单 2/3',232,96,34),('01:48',881,96,39),
                        ('幽灯茶',130,585,29),('月雾茶',130,787,29),('冥霞茶',130,990,29),
                        ('云魄乳',908,585,29),('霜铃乳',908,787,29),('萤绢乳',908,990,29),
                        ('鬼火珠',342,942,27),('梦纹冻',516,942,27),('灯芯脆',690,942,27),
                        ('影鳞片',342,1060,27),('魂铃籽',516,1060,27),('夜羽酥',690,1060,27),
                        ('查看配方',242,1484,39),('撤销',542,1484,40),('确认交杯',845,1484,41)]:
    draw_center(text,cx,cy,size,WHITE if text.startswith('当前订单') or text=='01:48' else INK)
txt=txt.resize((W,H),Image.Resampling.LANCZOS)
txt.save(LAYER/'TEXT_SAMPLE_DYNAMIC_full.png')

usage={
 'font':'source/font/ZCOOLKuaiLe-Regular.ttf','license':'source/font/OFL.txt',
 'sample_layer':'source/layers/TEXT_SAMPLE_DYNAMIC_full.png',
 'runtime_policy':'Text glyphs are dynamic sample only; client must redraw labels, order count, timer, button and help text from Product state; do not bake sample into static base.',
 'names':['幽灯茶','月雾茶','冥霞茶','云魄乳','霜铃乳','萤绢乳','鬼火珠','梦纹冻','灯芯脆','影鳞片','魂铃籽','夜羽酥']
}
(ROOT/'source/font_usage.json').write_text(json.dumps(usage,ensure_ascii=False,indent=2),encoding='utf-8')
print('text glyphs',len(set(''.join(usage['names']))),'font',FONT.name)
