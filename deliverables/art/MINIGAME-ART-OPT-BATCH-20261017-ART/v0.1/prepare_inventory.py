"""只读盘点现行资产并写文字/JSON预案清单；不得产PNG/PSD。"""
import collections
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
BASE = json.loads((ROOT / 'deliverables/art/MINIGAME-ART-OPT-20261016-ART/v0.1/SOURCE_APPROVAL_MAP.json').read_text())['assets']
PILOT = json.loads((ROOT / 'deliverables/art/MINIGAME-ART-OPT-PILOT-20261017-ART/v0.1/CUT_MANIFEST.json').read_text())
PILOT_BY_KEY = {a['inventory_key']: a for a in PILOT['assets']}
SHOP = json.loads((ROOT / 'deliverables/art/U03-SHOP-FULL-REDRAW-20261009/v0.2/CUT_MANIFEST.json').read_text())
SCENE = json.loads((ROOT / 'deliverables/art/SCENE-SAKURA-REDRAW-REUSE-20261013/v0.3/CUT_MANIFEST.json').read_text())
VFX = json.loads((ROOT / 'deliverables/vfx/U02-TOURIST-VFX-FRAMES-001/v0.2/frames/FRAME_MANIFEST.json').read_text())
U05 = json.loads((ROOT / 'deliverables/art/U05-B-COMPONENT-ASSETS-20261014/v0.2/CUT_MANIFEST.json').read_text())

shop_by_sha = {x[k]['sha256'].lower(): x[k]['path'] for x in SHOP['shops'].values() for k in ('body', 'sign')}
scene_by_sha = {x['sha256'].lower(): 'deliverables/art/SCENE-SAKURA-REDRAW-REUSE-20261013/v0.3/' + x['path'] for x in SCENE['active_exports']}
vfx_by_id = {x['frameId']: x for x in VFX['frames']}
u05_by_id = {x['asset_id']: x for x in U05['exports']}

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def module(asset):
    p = asset['client_path']
    sources = ' '.join(asset['production_sources_same_sha256'])
    if 'U02-TOURIST-VFX-FRAMES' in sources:
        return '游客40帧'
    if 'U03-SHOP-FULL-REDRAW' in sources:
        return '奶茶六店'
    if 'SCENE-SAKURA-REDRAW-REUSE' in sources:
        return '樱花v0.3场景'
    if 'U05-B-COMPONENT-ASSETS' in sources:
        return 'U05组件'
    if 'U05-B-INTERACTION-ASSETS' in sources:
        return 'U05交互'
    if 'U04-DIALOGUE-LAYERED-ASSET' in sources:
        return 'U04对话'
    if 'U04-CLOUD-CORNER-ASSET' in sources:
        return 'U04对话角饰'
    if 'EXAMPLE-REVISION-ART' in sources:
        return 'U01后续示例修订'
    if 'BRIDGE-RAILING-CLEANUP-ART' in sources:
        return 'U01桥栏清理'
    if 'VISUAL-FIDELITY-PILOT-ASSET' in sources:
        return '自定义UV灯笼'
    if '/accessories/' in p:
        return '游客配件'
    return '其他'

def category(asset, mod, approved):
    key = asset['stable_asset_id']
    full = asset['alpha_bbox'] == [0, 0, *asset['original_size']]
    if key in PILOT_BY_KEY or asset['client_path'].split('/')[-1][:-4] in PILOT_BY_KEY:
        return 'PILOT_REUSE', '已批10件原样引用，禁止覆盖重制'
    if full:
        return 'HOLD_NO_CROP', 'alpha可见内容已铺满原画布，bbox+2无减边收益'
    if mod in ('游客40帧', '奶茶六店', '樱花v0.3场景') and approved == 'EXACT_USER_APPROVED':
        return 'NEW_BATCH', '现行源SHA与原批准版本逐项相同，普通Sprite可按原画布恢复'
    if mod == 'U05组件' and approved == 'EXACT_USER_APPROVED' and key not in ('LABEL_PLATE_9SLICE', 'U05_ART_FONT'):
        return 'NEW_BATCH', '组件原画布内栅格元素；旧尺寸/定位保持，按原画布恢复'
    reason = {
        'U04对话': '原画布内手工sourceRect/分层定位，通用裁切会重复补偿，需专案',
        'U04对话角饰': '对话手工定位角饰，需与sourceRect/拼接联审',
        'U05组件': '九宫格边界或字体图集/字形坐标，禁止通用裁切',
        'U05交互': '上游交互资源任务未形成Gate2 USER_APPROVED',
        'U01后续示例修订': '桥街/眼光采用原场景实例及sourceRect定位，需场景专项复核',
        '游客配件': '未找到同SHA Art源及对应独立批准，保留现图',
        '自定义UV灯笼': 'shader固定UV到旧画布，禁止通用裁切',
    }.get(mod, '无本批逐项批准或特殊接口核验；保留现图')
    return 'HOLD_UNVERIFIED_OR_SPECIAL', reason

rows = []
for a in BASE:
    key = a['stable_asset_id']
    client = a['client_path']
    cpath = ROOT / client
    assert cpath.exists() and sha(cpath) == a['sha256'], client
    mod = module(a)
    source = None
    approval = 'NOT_VERIFIED'
    approval_path = None
    if a['sha256'] in shop_by_sha and mod == '奶茶六店':
        source = shop_by_sha[a['sha256']]
        approval = 'EXACT_USER_APPROVED'
        approval_path = 'tasks/U03-SHOP-FULL-REDRAW-20261009/ARTIFACT_APPROVAL_GATE2.json'
    elif a['sha256'] in scene_by_sha and mod == '樱花v0.3场景':
        source = scene_by_sha[a['sha256']]
        approval = 'EXACT_USER_APPROVED'
        approval_path = 'tasks/SCENE-SAKURA-REDRAW-REUSE-20261013/ARTIFACT_APPROVAL.json'
    elif mod == '游客40帧' and key in vfx_by_id and a['sha256'] == vfx_by_id[key]['sha256'].lower():
        source = 'deliverables/vfx/U02-TOURIST-VFX-FRAMES-001/v0.2/' + vfx_by_id[key]['file']
        approval = 'EXACT_USER_APPROVED'
        approval_path = 'tasks/U02-TOURIST-VFX-FRAMES-001/ARTIFACT_APPROVAL.json'
    elif mod == 'U05组件' and key in u05_by_id and a['sha256'] == u05_by_id[key]['sha256'].lower():
        source = u05_by_id[key]['art_path'].removeprefix(str(ROOT) + '/')
        approval = 'EXACT_USER_APPROVED'
        approval_path = 'tasks/U05-B-COMPONENT-ASSETS-20261014/ARTIFACT_APPROVAL_v0.2.json'
    elif a['production_sources_same_sha256']:
        source = a['production_sources_same_sha256'][0]
        approval = 'SAME_SHA_SOURCE_APPROVAL_NOT_BOUND'
    if source:
        sp = ROOT / source
        assert sp.exists() and sha(sp) == a['sha256'], (key, source)
    W,H=a['original_size']; x0,y0,x1,y1=a['alpha_bbox']
    l,t,r,b=max(0,x0-2),max(0,y0-2),min(W,x1+2),min(H,y1+2)
    meta_path=ROOT/(client+'.meta')
    border=None;pivot=[.5,.5]
    if meta_path.exists():
        mj=json.loads(meta_path.read_text())
        sfs=[s for s in mj.get('subMetas',{}).values() if s.get('importer')=='sprite-frame']
        if sfs:
            ud=sfs[0].get('userData',{})
            border={n:ud.get('border'+n,0) for n in ('Top','Bottom','Left','Right')}
            pivot=[ud.get('pivotX',.5),ud.get('pivotY',.5)]
    cat,reason=category(a,mod,approval)
    if cat=='PILOT_REUSE':
        route='已批pilot PSD与10件切片只读引用'
    elif cat=='NEW_BATCH':
        route='旧PSD只读评估；获批PNG建立本批独立原尺寸栅格层，经真实PSD层读回后导出'
    else:
        route='本批不新建PSD/切片；保留现行源与客户端文件'
    rows.append({
        'stable_asset_id':key,'module':mod,'category':cat,'reason':reason,
        'client_path':client,'client_sha256':a['sha256'],
        'approved_source_path':source,'source_sha256':a['sha256'] if source else None,
        'source_match_count':len(a['production_sources_same_sha256']),
        'approval_status':approval,'approval_record':approval_path,
        'original_size':[W,H],'alpha_bbox':[x0,y0,x1,y1],
        'crop_rect_if_applicable':[l,t,r,b],
        'crop_size_if_applicable':[r-l,b-t],
        'offset_if_applicable':[(l+r-W)/2,(H-t-b)/2],
        'pivot':pivot,'meta_border':border,
        'special_class':('CUSTOM_UV' if mod=='自定义UV灯笼' else 'SOURCE_RECT' if mod in ('U04对话','U04对话角饰') else 'NINE_SLICE' if key=='LABEL_PLATE_9SLICE' or border and any(border.values()) else 'FONT_ATLAS' if key=='U05_ART_FONT' else 'SCENE_INSTANCE' if mod=='U01后续示例修订' else 'NONE'),
        'psd_route':route,
        'project_rights_basis':'项目已有USER_APPROVED资源复用；不添加外部字体/图片' if approval=='EXACT_USER_APPROVED' else '本批未取得逐项可生产批准，保留现图',
        'client_import':'NOT_IMPORTED_IN_THIS_BATCH',
    })

assert len(rows)==268 and len({x['client_path'] for x in rows})==268
counts=collections.Counter(x['category'] for x in rows)
by_mod={m:dict(collections.Counter(x['category'] for x in rows if x['module']==m)) for m in sorted({x['module'] for x in rows})}
doc={'schema':'art-batch-scope-v0.1','method':'现行客户端文件逐SHA验证；获批清单逐ID及SHA比对；alpha>0 bbox加2px；未核者不生产','source_map':'deliverables/art/MINIGAME-ART-OPT-20261016-ART/v0.1/SOURCE_APPROVAL_MAP.json','summary':{'total':len(rows),'categories':dict(counts),'by_module':by_mod},'assets':rows}
(OUT/'SCOPE_INVENTORY.json').write_text(json.dumps(doc,ensure_ascii=False,indent=2)+'\n')
print(doc['summary'])
