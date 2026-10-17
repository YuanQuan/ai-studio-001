from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import hashlib, json
import numpy as np
from collections import deque
ROOT=Path(__file__).resolve().parents[5]
BATCH=Path(__file__).resolve().parents[1]
OLD=ROOT/'deliverables/art/EXAMPLE-REVISION-ART-20261015/v0.1'
APP=ROOT/'apps/client/assets/resources/sakura_v03'
def sha(p):
    h=hashlib.sha256()
    with open(p,'rb') as f:
        for chunk in iter(lambda:f.read(1024*1024),b''):h.update(chunk)
    return h.hexdigest()
result={'canvas':[3072,1024],'psd_layer_count':48,'source_psd_sha256':sha(OLD/'source/scene_sakura_revision_master.psd'),'new_psd_sha256':sha(BATCH/'source/scene_sakura_railing_clean_master.psd'),'slices':{},'other_46_layers_identical':True,'other_46_layer_hashes':{},'scene_composite_matches_psd':False}
for side,x in [('l',1311),('r',1536)]:
    n=f'tex_sakura_rr_bridge_front_{side}.png'
    old_path=APP/n;new_path=BATCH/'exports'/n
    a=np.asarray(Image.open(old_path).convert('RGBA')).astype(np.int16)
    z=np.asarray(Image.open(new_path).convert('RGBA')).astype(np.int16)
    assert a.shape==z.shape==(177,225,4)
    assert np.array_equal(a[:,:,:3],z[:,:,:3])
    assert np.all(z[:,:,3]<=a[:,:,3])
    assert np.array_equal(a[126:,:,:],z[126:,:,:])
    d=a[:,:,3]>z[:,:,3]
    yy,xx=np.where(d)
    r,g,bl=[a[:,:,i] for i in range(3)]
    warm_core=(r>200)&(g>100)&(r>g*1.1)&(r>bl*1.5)&(a[:,:,3]>=128)
    warm_broad=(r>100)&(r>bl*1.2)&(r>g*1.05)&(a[:,:,3]>0)
    blue=(bl>r*1.15)&(bl>g*1.05)&(a[:,:,3]>0)
    visible=z[:,:,3]>16
    seen=np.zeros(visible.shape,dtype=bool)
    components=[]
    for cy in range(177):
        for cx in range(225):
            if not visible[cy,cx] or seen[cy,cx]:continue
            queue=deque([(cy,cx)]);seen[cy,cx]=True;count=0
            while queue:
                py,px=queue.popleft();count+=1
                for dy in (-1,0,1):
                    for dx in (-1,0,1):
                        ny,nx=py+dy,px+dx
                        if 0<=ny<177 and 0<=nx<225 and visible[ny,nx] and not seen[ny,nx]:
                            seen[ny,nx]=True;queue.append((ny,nx))
            components.append(count)
    anchors=[(127,71)] if side=='l' else [(77,61),(81,63),(89,66),(95,69),(103,74),(108,77),(91,67),(97,70),(107,76)]
    assert all(a[y,x,3]==z[y,x,3] for x,y in anchors)
    assert len(components)==1
    full=np.asarray(Image.open(BATCH/'source/psd_full_canvas_layers'/f'bridge_front_{side}.png').convert('RGBA'))
    assert np.array_equal(full[573:750,x:x+225,:],z.astype(np.uint8))
    q={
      'source_path':str(old_path.relative_to(ROOT)), 'source_sha256':sha(old_path),
      'export_path':str(new_path.relative_to(ROOT)), 'export_sha256':sha(new_path),
      'size':[225,177], 'mode':'RGBA', 'source_rgb_exactly_preserved':True,
      'alpha_only_decreased':True,'unchanged_y_126_to_176_rgba_exact':True,
      'changed_alpha_pixels':int(d.sum()),'removed_alpha_sum':int((a[:,:,3]-z[:,:,3]).sum()),
      'changed_bbox_xyxy_exclusive':[int(xx.min()),int(yy.min()),int(xx.max()+1),int(yy.max()+1)],
      'warm_core_total_pixels':int(warm_core.sum()),'warm_core_changed_pixels':int((warm_core&d).sum()),
      'warm_core_changed_xy':[[int(x),int(y)] for y,x in zip(*np.where(warm_core&d))],
      'real_warm_rail_anchors_unchanged_xy':[[x,y] for x,y in anchors],
      'visible_component_count_alpha_gt_16':len(components),
      'visible_main_component_pixels_alpha_gt_16':max(components),
      'warm_broad_total_pixels':int(warm_broad.sum()),'warm_broad_changed_pixels':int((warm_broad&d).sum()),
      'warm_broad_removed_alpha_sum':int((a[:,:,3]-z[:,:,3])[warm_broad].sum()),
      'blue_total_pixels':int(blue.sum()),'blue_changed_pixels':int((blue&d).sum()),
      'blue_removed_alpha_sum':int((a[:,:,3]-z[:,:,3])[blue].sum()),
      'psd_layer_crop_matches_export':True,
      'mask_path':str((BATCH/'source/masks'/f'front_{side}_result_alpha.png').relative_to(ROOT))
    }
    result['slices'][side]=q
manifest=json.loads((BATCH/'PSD_MANIFEST.json').read_text())
assert len(manifest['layers'])==48
for layer in manifest['layers']:
    name=layer['name']
    if name in ('bridge_front_l','bridge_front_r'):continue
    orig=OLD/layer['file'];new=BATCH/layer['file']
    same=sha(orig)==sha(new)
    result['other_46_layer_hashes'][name]=same
    assert same,name
psd=Image.open(BATCH/'source/scene_sakura_railing_clean_master.psd').convert('RGB')
prev=Image.open(BATCH/'review/scene_reassembled.png').convert('RGB')
assert psd.size==prev.size==(3072,1024)
assert np.array_equal(np.asarray(psd),np.asarray(prev))
result['scene_composite_matches_psd']=True
result['scene_reassembled_sha256']=sha(BATCH/'review/scene_reassembled.png')
result['checks']='PASS'
(BATCH/'VALIDATION.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print('VALIDATION PASS',[(k,v['changed_alpha_pixels'],v['warm_core_changed_pixels'],v['warm_broad_changed_pixels']) for k,v in result['slices'].items()])
