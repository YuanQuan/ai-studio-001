import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
preview = root / 'preview'
preview.mkdir(exist_ok=True)
art_root = root.parents[1] / 'U03-SHOP-ASSET-001' / 'v0.1'
manifest = json.loads((art_root / 'SIX_SHOP_GATE2_CANDIDATE_MANIFEST_V04.json').read_text(encoding='utf-8'))
reference = Image.open(root.parents[1] / 'U03-SHOP-REFERENCE-REVISION-20261009/v0.1/reference/user_six_shops_20261009.png').convert('RGB')
cells = [(0,0,461,460),(509,0,972,460),(1019,0,1496,460),(0,500,461,1024),(509,500,972,1024),(1019,500,1496,1024)]
overview = Image.new('RGB',(1536,1024),'#1b3055')
contact = Image.new('RGB',(3072,1024),'#192f50')

for n in range(1,7):
    key = f'shop_{n:02d}'
    new = Image.open(preview / f'{key}_recomposed.png').convert('RGBA')
    old = Image.open(art_root / manifest['shops'][key]['recomposition']['path']).convert('RGBA')
    for width,height,display,foot_y in [(390,844,316,530),(720,1280,584,800)]:
        bg=Image.new('RGBA',(width,height),'#1b3055')
        scaled=new.resize((display,display),Image.Resampling.LANCZOS)
        bg.alpha_composite(scaled,((width-display)//2,round(foot_y-900*display/1024)))
        bg.convert('RGB').save(preview/f'{key}_{width}x{height}.png')

    # The reference panel retains its original black background. It is scaled
    # only for a visual comparison; it is never used as an export texture.
    cell=reference.crop(cells[n-1])
    old_box=old.getchannel('A').point(lambda v:255 if v>32 else 0).getbbox()
    rgb=cell.convert('RGB')
    fg=rgb.convert('L').point(lambda v:255 if v>20 else 0).getbbox()
    scale=min((old_box[2]-old_box[0])/(fg[2]-fg[0]),(old_box[3]-old_box[1])/(fg[3]-fg[1]))
    resized=cell.resize((round(cell.width*scale),round(cell.height*scale)),Image.Resampling.LANCZOS)
    ref_canvas=Image.new('RGB',(1024,1024),'#000000')
    left=round((old_box[0]+old_box[2])/2-(fg[0]+fg[2])*scale/2)
    top=round(900-fg[3]*scale)
    ref_canvas.paste(resized,(left,top))
    ref_canvas.save(preview/f'{key}_reference_same_scale_black.png')
    three=Image.new('RGB',(3072,1024),'#000000')
    three.paste(ref_canvas,(0,0))
    for index,img in enumerate((old,new),start=1):
        pane=Image.new('RGBA',(1024,1024),'#000000')
        pane.alpha_composite(img)
        three.paste(pane.convert('RGB'),(1024*index,0))
    three.save(preview/f'{key}_reference_old_new_same_scale_black.png')
    x=[0,509,1019][(n-1)%3]
    y=[0,500][(n-1)//3]
    thumb=new.resize((461,461),Image.Resampling.LANCZOS)
    pane=Image.new('RGBA',(461,461),'#000000')
    pane.alpha_composite(thumb)
    overview.paste(pane.convert('RGB'),(x,y))
    # Each row of the contact sheet has body then sign on checkerboard.
    body=Image.open(root/'exports'/f'tex_u03_shop_{n:02d}_body_full_redraw_v01.png').convert('RGBA')
    sign=Image.open(root/'exports'/f'tex_u03_shop_{n:02d}_sign_full_redraw_v01.png').convert('RGBA')
    for j,part in enumerate((body,sign)):
        sx=(n-1)%3*1024+j*512
        sy=(n-1)//3*512
        small=part.resize((512,512),Image.Resampling.LANCZOS)
        tile=Image.new('RGBA',(512,512),'#8f8f8f')
        tile.alpha_composite(small)
        contact.paste(tile.convert('RGB'),(sx,sy))

overview.save(preview/'six_shop_full_redraw_overview.png')
contact.save(preview/'twelve_slices_contact_sheet.png')
print('saved six 390/720 views, six three-panel comparisons, overview and contact sheet')
