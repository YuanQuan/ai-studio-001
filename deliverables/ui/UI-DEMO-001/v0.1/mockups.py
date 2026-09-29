"""Regenerate UI review PNGs with Pillow. Illustrative geometry is not game art."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
FONT = 'C:/Windows/Fonts/msyh.ttc'


def font(size):
    return ImageFont.truetype(FONT, size)


def txt(draw, xy, value, size=20, color='#F7ECDD', anchor=None):
    draw.text(xy, value, font=font(size), fill=color, anchor=anchor)


def rr(draw, box, fill, radius=14, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def scene(draw, left, top, mode):
    w, h = 390, 844
    draw.rectangle((left, top, left+w, top+h), '#1A2940')
    draw.polygon([(left,top+150),(left+130,top+90),(left+390,top+270),(left+390,top+844),(left,top+844)], fill='#344553')
    # Repeated stone path and bridges: layout only.
    draw.polygon([(left+30,top+170),(left+126,top+136),(left+355,top+700),(left+290,top+762)],fill='#767D80')
    for y in range(175,760,42):
        x=55+(y-175)*0.43
        draw.line((left+x,top+y,left+x+70,top+y+14),fill='#919894',width=2)
    draw.polygon([(left+10,top+110),(left+130,top+85),(left+175,top+155),(left+64,top+185)],fill='#566575')
    draw.polygon([(left+260,top+747),(left+385,top+690),(left+390,top+795),(left+302,top+830)],fill='#566575')
    # Ruined stalls, repeated silhouettes.
    for x,y,s in [(34,310,1),(246,300,1),(34,520,1),(252,555,1)]:
        px,py=left+x,top+y
        draw.polygon([(px,py+34),(px+38,py),(px+100,py+30),(px+63,py+65)],fill='#514B4A')
        draw.polygon([(px+20,py+48),(px+70,py+34),(px+70,py+88),(px+20,py+99)],fill='#473F40')
        draw.line((px+5,py+25,px+77,py+72),fill='#9A9898',width=2)
    # One target stall at upper center.
    px,py=left+145,top+272
    done=mode=='done'
    roof='#A56C4D' if done else '#554C4B'
    draw.polygon([(px,py+25),(px+50,py-4),(px+112,py+29),(px+62,py+61)],fill=roof)
    draw.polygon([(px+14,py+49),(px+95,py+55),(px+95,py+113),(px+14,py+107)],fill='#795B49' if done else '#4A4442')
    if done:
        for lx in [px+24,px+87]:
            draw.ellipse((lx-10,py+62,lx+10,py+86),fill='#D9894C')
        draw.ellipse((px+101,py+94,px+119,py+117),fill='#E6C4B4')
        txt(draw,(px+111,py+116),'店长',12,anchor='ma')
    else:
        draw.line((px+22,py+36,px+94,py+94),fill='#BAB1A6',width=2)
        draw.arc((px+12,py+29,px+72,py+75),20,200,fill='#B9B2AA',width=2)
    # Small customers imply route without covering controls.
    for x,y in [(92,220),(170,475),(223,608)]:
        draw.ellipse((left+x-10,top+y-13,left+x+10,top+y+10),fill='#CED7D7')
        draw.ellipse((left+x-3,top+y-4,left+x-1,top+y-2),fill='#304054')
        draw.ellipse((left+x+3,top+y-4,left+x+5,top+y-2),fill='#304054')
    # Common safe-area hints and minimal single-target ring.
    if not done:
        for a in range(0,360,24):
            draw.arc((left+133,top+259,left+269,top+410),a,a+12,fill='#E8B276',width=3)
        rr(draw,(left+141,top+419,left+252,top+455),'#172336',10)
        txt(draw,(left+196,top+437),'点击修复',17,anchor='mm')
    if mode=='panel':
        draw.rectangle((left,top,left+w,top+h),fill=(13,20,31,95))
        rr(draw,(left+16,top+607,left+374,top+815),'#172336',16,'#7D8D98')
        txt(draw,(left+40,top+630),'修复破败摊位',23)
        txt(draw,(left+40,top+674),'点亮夜市第一间店铺',16,'#C9C5C2')
        rr(draw,(left+38,top+724,left+267,top+782),'#D9894C',12)
        txt(draw,(left+153,top+753),'修复',21,anchor='mm')
        rr(draw,(left+281,top+724,left+349,top+782),'#29384A',12)
        txt(draw,(left+315,top+753),'关闭',16,anchor='mm')
    if done:
        rr(draw,(left+50,top+625,left+340,top+686),'#172336',12)
        txt(draw,(left+195,top+655),'修复完成 · 店长已到位',17,'#B6D8C7',anchor='mm')


def build_flow():
    image=Image.new('RGB',(1230,930),'#EDE8DF')
    d=ImageDraw.Draw(image,'RGBA')
    for index,(mode,label) in enumerate([('idle','① 待修复'),('panel','② 确认修复'),('done','③ 修复完成')]):
        x=10+index*410
        rr(d,(x,30,x+390,874),'#0F1828',26)
        scene(d,x,30,mode)
        txt(d,(x+195,900),label,22,'#243348',anchor='mm')
    (ROOT/'screens').mkdir(exist_ok=True)
    image.save(ROOT/'screens'/'repair-flow.png')


def build_components():
    im=Image.new('RGB',(900,650),'#EDE8DF'); d=ImageDraw.Draw(im)
    txt(d,(40,30),'DEMO-001  修复控件状态 / 逻辑像素示意',25,'#243348')
    states=[('正常','#D9894C','#F7ECDD'),('按下','#B66F3E','#F7ECDD'),('禁用 / 处理中','#6E6865','#C9C5C2')]
    for i,(name,bg,fg) in enumerate(states):
        y=90+i*125
        txt(d,(42,y),name,19,'#243348')
        rr(d,(300,y-5,580,y+67),bg,12)
        txt(d,(440,y+30),'修复',22,fg,anchor='mm')
        rr(d,(620,y,700,y+66),'#29384A',12)
        txt(d,(660,y+33),'×',26,'#F7ECDD',anchor='mm')
        txt(d,(730,y+20),'关闭',17,'#243348')
    y=475
    rr(d,(42,y,390,y+78),'#172336',12)
    txt(d,(216,y+39),'修复完成 · 店长已到位',18,'#B6D8C7',anchor='mm')
    rr(d,(475,y,810,y+78),'#172336',12)
    txt(d,(642,y+39),'点击修复',18,'#E8B276',anchor='mm')
    txt(d,(42,605),'命中区域 ≥ 44 × 44；图形源文件由 Art 后续重绘并入 UI 图集。',17,'#576574')
    (ROOT/'components').mkdir(exist_ok=True)
    im.save(ROOT/'components'/'repair-controls.png')


if __name__=='__main__':
    build_flow(); build_components()
