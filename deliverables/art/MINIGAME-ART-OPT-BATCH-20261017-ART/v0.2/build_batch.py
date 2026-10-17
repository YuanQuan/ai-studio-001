"""同 SHA 双预签后的76件模块 PSD→真实层→裁片确定性生产。"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

import numpy as np
from PIL import Image, __version__ as pillow_version

ROOT = Path(__file__).resolve().parents[4]
BASE = Path(__file__).resolve().parent
PLAN_SHA = 'fe1221f4069c0f062e80af8b385ef3f638084f9d84025f04f402e3a2d408f083'
SCOPE_SHA = 'ffcb38f0d1816517196743f4f189f7177c97c6c11b65839883f2fea326a00a26'
TECH = ROOT / 'deliverables/tech_lead/MINIGAME-ART-OPT-BATCH-20261017-TECH/v0.1/TECH_PRESIGN.json'
MASTER = ROOT / 'deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/BATCH_PRESIGN_ACCEPTANCE.json'
SKILL = Path('/Users/yuanquan/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py')
TZ = timezone(timedelta(hours=8))


def sha(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


def save_json(p: Path, x: object) -> None:
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(x, ensure_ascii=False, indent=2) + '\n')


def gate() -> list[dict]:
    assert sha(BASE / 'BATCH_PREPRODUCTION_PLAN.md') == PLAN_SHA
    assert sha(BASE / 'SCOPE_INVENTORY.json') == SCOPE_SHA
    art = json.loads((BASE / 'ART_PRESIGN.json').read_text())
    tech = json.loads(TECH.read_text())
    master = json.loads(MASTER.read_text())
    assert all(x['decision'] == 'APPROVED' for x in (art, tech, master))
    assert all(PLAN_SHA in str(x['findings']) for x in (art, tech, master))
    inv = json.loads((BASE / 'SCOPE_INVENTORY.json').read_text())
    rows = [x for x in inv['assets'] if x['category'] in ('NEW_BATCH', 'SAMPLING_REVISION')]
    assert len(rows) == 76
    for x in rows:
        assert x['approval_status'] == 'EXACT_USER_APPROVED'
        assert sha(ROOT / x['approved_source_path']) == x['source_sha256']
        assert sha(ROOT / x['client_path']) == x['client_sha256']
    return rows


def module_slot(x: dict, u05_index: dict[str, int]) -> tuple[str, tuple[int,int], tuple[int,int]]:
    k = x['stable_asset_id']
    m = x['module']
    if m == '游客40帧':
        action = k.split('_')[-2].lower()
        idx = int(k.split('_')[-1])
        assert action in ('walk','run','happy','sad') and 0 <= idx <= 9
        return f'tourist_{action}', (2048,1536), ((idx%4)*512,(idx//4)*512)
    if m == '奶茶六店':
        import re
        match = re.search(r'shop_(0[1-6])_(body|sign)', x['client_path'])
        assert match, k
        n, role = match.groups()
        return f'shop_{n}', (2048,1024), ((0 if role=='body' else 1024),0)
    if m == '樱花v0.3场景':
        bg = {
            'tex_sakura_rr_far_l':(0,0), 'tex_sakura_rr_far_r':(1536,0),
            'tex_sakura_rr_water_rail_half':(0,720), 'tex_sakura_rr_street_rail_half':(1536,720),
        }
        fg = {
            'tex_sakura_rr_foreground_left':(0,0), 'tex_sakura_rr_foreground_right':(768,0),
            'tex_sakura_rr_tree_a':(0,384), 'tex_sakura_rr_tree_b':(600,384),
            'tex_sakura_rr_gate':(940,384),
        }
        spirits = ['tex_sakura_rr_spirit_a_flame','tex_sakura_rr_spirit_a_lotus',
                   'tex_sakura_rr_spirit_a_reflection','tex_sakura_rr_spirit_b_flame',
                   'tex_sakura_rr_spirit_b_lotus','tex_sakura_rr_spirit_b_reflection']
        if k in bg:
            return 'scene_background',(3072,1064),bg[k]
        if k in fg:
            return 'scene_foreground',(1536,1024),fg[k]
        assert k in spirits, k
        return 'scene_spirits',(960,160),(spirits.index(k)*160,0)
    assert m == 'U05组件', (k,m)
    i = u05_index[k]
    return 'u05_components',(1024,1024),((i%4)*256,(i//4)*256)


def rgba(path: Path) -> Image.Image:
    im = Image.open(path)
    assert im.mode == 'RGBA' and not any(k in im.info for k in ('icc_profile','gamma','srgb')), str(path)
    return im.copy()


def visible_cmp(a: Image.Image, b: Image.Image) -> dict:
    assert a.size == b.size
    aa=np.asarray(a,dtype=np.uint8); bb=np.asarray(b,dtype=np.uint8)
    alpha_diff=np.abs(aa[:,:,3].astype(np.int16)-bb[:,:,3].astype(np.int16))
    vis=(aa[:,:,3]>0)|(bb[:,:,3]>0)
    rgb_diff=np.abs(aa[:,:,:3].astype(np.int16)-bb[:,:,:3].astype(np.int16))
    changed=(aa[:,:,3]!=bb[:,:,3]) | (vis & np.any(aa[:,:,:3]!=bb[:,:,:3],axis=2))
    return {'max_alpha_delta':int(alpha_diff.max(initial=0)),
            'max_visible_rgb_delta':int(rgb_diff[vis].max(initial=0)),
            'changed_visible_pixel_count':int(changed.sum())}


def extract_layer(psd: Path, frame: int, width: int, height: int) -> Image.Image:
    raw=subprocess.check_output(['magick', f'{psd}[{frame}]', '-alpha','on','-depth','8','RGBA:-'])
    assert len(raw)==width*height*4, (frame,len(raw),width,height)
    return Image.frombytes('RGBA',(width,height),raw)


def process_module(name: str, specs: list[dict]) -> dict:
    clock=BASE/'production_clock.json'
    if not clock.exists():
        save_json(clock, {'first_image_started_at':datetime.now(TZ).isoformat(timespec='seconds'),
                          'definition':'制作计时从本批首次模块PSD生成前开始；预案盘点和等待另计',
                          'generation_calls':0,'production_budget_seconds':5400,'static_budget_seconds':2700,
                          'total_budget_seconds':8100})
    canvas=specs[0]['library_canvas']
    assert all(x['library_canvas']==canvas for x in specs)
    manifest={'canvas':{'width':canvas[0],'height':canvas[1],'composite_background':'#808080'},'layers':[]}
    rects=[]
    manifest_dir=BASE/'source/psd_manifests'
    manifest_dir.mkdir(parents=True,exist_ok=True)
    for x in specs:
        src=ROOT/x['approved_source_path']
        assert sha(src)==x['source_sha256']
        im=rgba(src)
        assert list(im.size)==x['original_size']
        assert list(im.getchannel('A').getbbox())==x['alpha_bbox']
        l,t,r,b=x['crop_rect_if_applicable'];W,H=im.size
        assert [l,t,r,b]==[max(0,x['alpha_bbox'][0]-2),max(0,x['alpha_bbox'][1]-2),min(W,x['alpha_bbox'][2]+2),min(H,x['alpha_bbox'][3]+2)]
        px,py=x['library_position']
        assert px>=0 and py>=0 and px+W<=canvas[0] and py+H<=canvas[1]
        rect=(px,py,px+W,py+H)
        assert all(rect[0]>=z[2] or rect[2]<=z[0] or rect[1]>=z[3] or rect[3]<=z[1] for z in rects), (name,x['stable_asset_id'])
        rects.append(rect)
        manifest['layers'].append({'name':x['stable_asset_id'],'file':os.path.relpath(src,manifest_dir),
                                   'x':px,'y':py,'fit':'none','remove_background':'none'})
    manifest_path=manifest_dir/f'{name}.json';save_json(manifest_path,manifest)
    psd=BASE/'source/psd'/f'{name}.psd';psd.parent.mkdir(parents=True,exist_ok=True)
    preview=BASE/'review/psd_previews'/f'{name}.png';preview.parent.mkdir(parents=True,exist_ok=True)
    cmd=[sys.executable,str(SKILL),'assemble','--manifest',str(manifest_path),'--output',str(psd),'--preview',str(preview)]
    result=subprocess.run(cmd,check=True,capture_output=True,text=True)
    summary=json.loads(result.stdout)
    assert summary['layer_count']==len(specs)
    assert [z['name'] for z in summary['layers']]==[z['stable_asset_id'] for z in specs]
    assert [summary['width'],summary['height']]==canvas
    assert psd.stat().st_size<100*1024*1024, (name,psd.stat().st_size)
    items=[]
    for i,x in enumerate(specs):
        s=summary['layers'][i]
        frame=len(specs)-i
        layer=extract_layer(psd,frame,s['width'],s['height'])
        original=rgba(ROOT/x['approved_source_path'])
        px,py=x['library_position']; dx,dy=s['left']-px,s['top']-py
        assert dx>=0 and dy>=0 and dx+layer.width<=original.width and dy+layer.height<=original.height
        source_canvas=Image.new('RGBA',original.size,(0,0,0,0))
        source_canvas.paste(layer,(dx,dy))
        cmp=visible_cmp(original,source_canvas)
        assert cmp=={'max_alpha_delta':0,'max_visible_rgb_delta':0,'changed_visible_pixel_count':0},(name,x['stable_asset_id'],cmp)
        l,t,r,b=x['crop_rect_if_applicable']
        psd_cut=np.asarray(source_canvas.crop((l,t,r,b)),dtype=np.uint8).copy()
        source_cut=np.asarray(original.crop((l,t,r,b)),dtype=np.uint8)
        assert np.array_equal(psd_cut[:,:,3],source_cut[:,:,3])
        assert np.array_equal(psd_cut[:,:,:3][source_cut[:,:,3]>0],source_cut[:,:,:3][source_cut[:,:,3]>0])
        zero=source_cut[:,:,3]==0
        fill_count=int(np.count_nonzero(zero & np.any(psd_cut[:,:,:3]!=source_cut[:,:,:3],axis=2)))
        psd_cut[:,:,:3][zero]=source_cut[:,:,:3][zero]
        assert np.array_equal(psd_cut,source_cut),x['stable_asset_id']
        cut=Image.fromarray(psd_cut,'RGBA')
        output=BASE/'exports'/Path(x['client_path']).name
        output.parent.mkdir(parents=True,exist_ok=True)
        cut.save(output)
        assert np.array_equal(np.asarray(rgba(output)),source_cut)
        recon=Image.new('RGBA',original.size,(0,0,0,0));recon.paste(cut,(l,t))
        recon_path=BASE/'review/recompositions'/Path(x['client_path']).name
        recon_path.parent.mkdir(parents=True,exist_ok=True);recon.save(recon_path)
        recmp=visible_cmp(original,recon)
        assert recmp=={'max_alpha_delta':0,'max_visible_rgb_delta':0,'changed_visible_pixel_count':0},(x['stable_asset_id'],recmp)
        assert list(cut.getchannel('A').getbbox()) == [x['alpha_bbox'][0]-l,x['alpha_bbox'][1]-t,x['alpha_bbox'][2]-l,x['alpha_bbox'][3]-t]
        items.append({'stable_asset_id':x['stable_asset_id'],'category':x['category'],'module':name,
                      'approved_source_path':x['approved_source_path'],'source_sha256':x['source_sha256'],
                      'client_path_current':x['client_path'],'client_sha256_current':x['client_sha256'],
                      'original_size':x['original_size'],'alpha_bbox':x['alpha_bbox'],'crop_rect':x['crop_rect_if_applicable'],
                      'crop_size':x['crop_size_if_applicable'],'offset':x['offset_if_applicable'],'pivot':x['pivot'],
                      'psd_path':str(psd.relative_to(ROOT)),'psd_sha256':sha(psd),'psd_layer_name':x['stable_asset_id'],
                      'psd_layer_frame':frame,'psd_layer_bbox_on_library':[s['left'],s['top'],s['left']+s['width'],s['top']+s['height']],
                      'library_position':[px,py],'psd_visible_compare':cmp,'alpha_zero_rgb_source_fill_pixels':fill_count,
                      'crop_rgba_full_equal_source':True,'recomposition_visible_compare':recmp,
                      'output_path':str(output.relative_to(ROOT)),'output_sha256':sha(output),
                      'recomposition_path':str(recon_path.relative_to(ROOT)),'recomposition_sha256':sha(recon_path),
                      'new_client_import_status':'PLANNED_NOT_IMPORTED','new_client_uuid':'NOT_TESTED_MAY_REUSE_CURRENT_UUID'})
    report={'module':name,'plan_sha256':PLAN_SHA,'scope_sha256':SCOPE_SHA,
            'psd_path':str(psd.relative_to(ROOT)),'psd_sha256':sha(psd),'psd_bytes':psd.stat().st_size,
            'preview_path':str(preview.relative_to(ROOT)),'preview_sha256':sha(preview),
            'psd_manifest_path':str(manifest_path.relative_to(ROOT)),'psd_manifest_sha256':sha(manifest_path),
            'layer_count':len(items),'items':items,'result':'PASS','completed_at':datetime.now(TZ).isoformat(timespec='seconds')}
    save_json(BASE/'source/module_reports'/f'{name}.json',report)
    return {'module':name,'items':len(items),'psd_bytes':report['psd_bytes'],'psd_sha256':report['psd_sha256']}


def main() -> None:
    parser=argparse.ArgumentParser();parser.add_argument('--module');args=parser.parse_args()
    rows=gate()
    u05=sorted(x['stable_asset_id'] for x in rows if x['module']=='U05组件')
    u05_index={k:i for i,k in enumerate(u05)}
    modules={}
    for x in rows:
        name,canvas,pos=module_slot(x,u05_index)
        x['library_canvas']=list(canvas);x['library_position']=list(pos)
        modules.setdefault(name,[]).append(x)
    assert len(modules)==14
    assert sum(map(len,modules.values()))==76
    names=[args.module] if args.module else sorted(modules)
    for name in names:
        assert name in modules,name
        print(json.dumps(process_module(name,modules[name]),ensure_ascii=False),flush=True)


if __name__=='__main__':
    main()
