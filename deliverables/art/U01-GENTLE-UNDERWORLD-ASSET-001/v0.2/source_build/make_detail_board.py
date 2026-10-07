"""Review-only crops from the completed v0.2 four-layer composite."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
COMPOSITE = ROOT.parent / "review" / "overall_from_psd.png"
OUTPUT = ROOT.parent / "review" / "local_detail_board.png"
im = Image.open(COMPOSITE).convert("RGB")
assert im.size == (2172, 724)
board = Image.new("RGB", (1240, 820), (19, 29, 43))
draw = ImageDraw.Draw(board)
font = ImageFont.load_default()
draw.text((22, 12), "U01 v0.2 DETAIL CHECK - crops only from official full-scale composite", font=font, fill=(239, 231, 212))

panels = [
    ("GU-01a/b  bridge-side flowers", [(891,416,970,501), (1203,416,1282,501)], (20,48)),
    ("GU-02  three-petal bridge carving", [(1047,411,1137,491)], (630,48)),
    ("GU-03  low garden waystone", [(90,416,190,506)], (20,435)),
    ("GU-04  hand-lettered plaque", [(2015,235,2105,293)], (630,435)),
]
for label, boxes, (px,py) in panels:
    draw.rounded_rectangle((px,py,px+590,py+360),radius=9,fill=(26,42,58),outline=(81,108,128),width=2)
    draw.text((px+16,py+14),label,font=font,fill=(244,216,172))
    if len(boxes)==2:
        for j,box in enumerate(boxes):
            crop=im.crop(box).resize((235,253),Image.Resampling.NEAREST)
            board.paste(crop,(px+38+j*277,py+64))
            draw.rectangle((px+38+j*277,py+64,px+272+j*277,py+316),outline=(100,127,141),width=1)
    else:
        box=boxes[0]
        raw=im.crop(box)
        factor=min(4,(530/raw.width),(265/raw.height))
        size=(int(raw.width*factor),int(raw.height*factor))
        crop=raw.resize(size,Image.Resampling.NEAREST)
        x=px+(590-size[0])//2
        y=py+62+(270-size[1])//2
        board.paste(crop,(x,y))
        draw.rectangle((x,y,x+size[0]-1,y+size[1]-1),outline=(100,127,141),width=1)
    draw.text((px+16,py+340),"Native scene pixel content; zoomed for review only",font=font,fill=(154,177,188))
board.save(OUTPUT)
print(OUTPUT)
