import hashlib
import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]

def record(path, image=False):
    data=path.read_bytes()
    result={'path':path.relative_to(root).as_posix(),'sha256':hashlib.sha256(data).hexdigest().upper(),'bytes':len(data)}
    if image:
        im=Image.open(path)
        result['mode']=im.mode
        result['size']=list(im.size)
        if 'A' in im.getbands():
            a=im.getchannel('A')
            result['alpha_range']=list(a.getextrema())
            result['alpha_bbox_32']=list(a.point(lambda v:255 if v>32 else 0).getbbox() or [])
    return result

names=['奶茶','糖画','现烤','理发','花灯','投壶']
items={}
for n,name in enumerate(names,start=1):
    key=f'shop_{n:02d}'
    src=root/'source'/key/'imagegen_whole_r1.png'
    psd=root/'psd'/f'{key}_full_redraw_v01.psd'
    body=root/'exports'/f'tex_u03_{key}_body_full_redraw_v01.png'
    sign=root/'exports'/f'tex_u03_{key}_sign_full_redraw_v01.png'
    rec=root/'preview'/f'{key}_recomposed.png'
    view390=root/'preview'/f'{key}_390x844.png'
    view720=root/'preview'/f'{key}_720x1280.png'
    with Image.open(rec) as im:
        if im.size!=(1024,1024) or im.mode!='RGBA': raise AssertionError(key+' recomposition format')
    if Image.open(body).size!=(1024,1024) or Image.open(sign).size!=(1024,1024): raise AssertionError(key+' cuts format')
    items[key]={
        'identity':name,
        'top_level_id':'MT_SHOP_01' if n==1 else f'SHOP_{n:02d}',
        'asset_ids':{'body':f'U03_SHOP_{n:02d}_BODY','sign':f'U03_SHOP_{n:02d}_SIGN'},
        'canvas':[1024,1024], 'foot':[512,900],
        'new_full_redraw_source':record(src,True),
        'psd':record(psd),
        'body':record(body,True),
        'sign':record(sign,True),
        'recomposition':record(rec,True),
        'views':[record(view390,True),record(view720,True)],
        'psd_layer_count':4,
        'layer_mapping_path':f'source/{key}/psd_work/manifest.json'
    }

manifest={
    'status':'CANDIDATE_PENDING_USER_GATE2',
    'task_id':'U03-SHOP-FULL-REDRAW-20261009',
    'version':'v0.1',
    'gate1_plan_sha256':'171CFCE512C13A8A68652BCB9E2506C6851B4B68CE790857951C1BB1643587FB',
    'reference_sha256':'B1295170D7245FA8BF4471FF29AFBA8A5C32BA4E5F59637814E87A793C85F8C9',
    'prior_approved_manifest_sha256':'C67C47E89860A4EAFAFFA340617D7176E7F68A10AE54DBEF188F2BAF19505191',
    'overview':record(root/'preview'/'six_shop_full_redraw_overview.png',True),
    'twelve_slices_contact_sheet':record(root/'preview'/'twelve_slices_contact_sheet.png',True),
    'shops':items,
    'editability':'PSD four coarse raster region layers per shop, plus preserved complete redraw source; hidden/occluded reverse faces are not reconstructed. Body+sign visible pixels exactly recompose normalized full redraw.',
    'client_replacement':'LOCKED_UNTIL_USER_GATE2_APPROVAL'
}
(root/'CUT_MANIFEST.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print('six shops, six PSD, twelve PNG, overview and views recorded')
