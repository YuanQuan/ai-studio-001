from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1]
preview = root / 'preview'
preview.mkdir(exist_ok=True)
art_root = root.parents[1] / 'U03-SHOP-ASSET-001' / 'v0.1'
old = Image.open(art_root / 'preview/milk_tea_full_redraw_v04/shop_01_recomposed.png').convert('RGBA')
new = Image.open(preview / 'shop_01_recomposed.png').convert('RGBA')
reference = Image.open(root.parents[1] / 'U03-SHOP-REFERENCE-REVISION-20261009/v0.1/reference/user_six_shops_20261009.png').convert('RGB')

def background_comp(asset, color):
    bg = Image.new('RGBA', asset.size, color)
    bg.alpha_composite(asset)
    return bg.convert('RGB')

for width, height, display, foot_y in [(390,844,316,530),(720,1280,584,800)]:
    bg = Image.new('RGBA',(width,height),'#1b3055')
    scaled = new.resize((display,display), Image.Resampling.LANCZOS)
    x=(width-display)//2
    y=round(foot_y-900*display/1024)
    bg.alpha_composite(scaled,(x,y))
    bg.convert('RGB').save(preview/f'shop_01_{width}x{height}.png')

reference_cell = reference.crop((0,0,461,460))
reference_cell = reference_cell.resize((922,920), Image.Resampling.LANCZOS)
ref_canvas = Image.new('RGB',(1024,1024),'#000000')
ref_canvas.paste(reference_cell,(30,80))
ref_canvas.save(preview/'shop_01_reference_same_scale_black.png')
old_black=background_comp(old,'#000000')
new_black=background_comp(new,'#000000')
sheet=Image.new('RGB',(3072,1024),'#000000')
sheet.paste(ref_canvas,(0,0))
sheet.paste(old_black,(1024,0))
sheet.paste(new_black,(2048,0))
sheet.save(preview/'shop_01_reference_old_new_same_scale_black.png')
print('saved 390/720 views and 3-panel black-background comparison')
