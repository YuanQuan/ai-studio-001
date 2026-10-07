"""Create a same-source close-up board for visual user review."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parent
OUT=ROOT.parent
src=Image.open(OUT/'review'/'overall_from_psd.png').convert('RGB')
cuts=[('Lantern A / Banner', (650,145,825,515)),('Road & Bridge signs',(790,345,1180,525)),('Lantern B',(1210,155,1340,255)),('Fengdu letters',(1860,205,2120,345))]
width=1400;board=Image.new('RGB',(width,1010),(19,30,48));d=ImageDraw.Draw(board);font=ImageFont.load_default()
slots=[(20,60,310,880),(350,60,850,450),(875,60,1365,450),(350,510,1365,900)]
for (label,box),(x0,y0,x1,y1) in zip(cuts,slots):
    crop=src.crop(box);scale=min((x1-x0)/crop.width,(y1-y0)/crop.height)
    size=(int(crop.width*scale),int(crop.height*scale))
    crop=crop.resize(size,Image.Resampling.LANCZOS)
    board.paste(crop,(x0+(x1-x0-size[0])//2,y0+(y1-y0-size[1])//2))
    d.rectangle((x0,y0,x1,y1),outline=(127,159,183),width=2)
    d.text((x0,y1+10),label,fill=(238,224,202),font=font)
d.text((22,20),'U01 v0.3 — full-scale source crops enlarged for review; not Cocos runtime',fill=(238,224,202),font=font)
dest=OUT/'review'/'local_detail_board.png';board.save(dest)
print(dest)

