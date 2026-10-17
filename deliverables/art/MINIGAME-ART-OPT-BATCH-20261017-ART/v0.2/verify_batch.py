"""76件全RGBA、原尺寸与9相位CPU采样核查；输出用户审阅静态证据。"""
from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone, timedelta
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, __version__ as pillow_version

from build_batch import ROOT, BASE, PLAN_SHA, SCOPE_SHA, sha, save_json, gate, visible_cmp, rgba

TZ=timezone(timedelta(hours=8))
SCENE=ROOT/'deliverables/art/SCENE-SAKURA-REDRAW-REUSE-20261013/v0.3'
PILOT=ROOT/'deliverables/art/MINIGAME-ART-OPT-PILOT-20261017-ART/v0.1'


def linear_compare(src_u8: np.ndarray, out_u8: np.ndarray) -> dict:
    """直通RGBA双线性9相位、source-over；输入使用同原尺寸像素格。"""
    assert src_u8.shape==out_u8.shape and np.array_equal(src_u8[:,:,3],out_u8[:,:,3])
    H,W,_=src_u8.shape
    phases=[.25,.5,.75]
    records=[]
    if np.array_equal(src_u8,out_u8):
        return {'method':'raw_rgba_identity_proves_all_phases','phases':[{'x':x,'y':y,'max_8bit_rgb_delta':0.0,'changed_positions':0} for y in phases for x in phases],
                'max_8bit_rgb_delta':0.0,'changed_positions_summed9phases':0,'backgrounds':{'black':0.0,'gray':0.0,'white':0.0}}
    assert H>=2 and W>=2
    top=0.0;count=0
    for fy in phases:
        for fx in phases:
            pmax=0.0;pcnt=0
            for y0 in range(0,H-1,128):
                y1=min(H-1,y0+128)
                def sample(a):
                    a00=a[y0:y1,:W-1].astype(np.float32)
                    a10=a[y0:y1,1:W].astype(np.float32)
                    a01=a[y0+1:y1+1,:W-1].astype(np.float32)
                    a11=a[y0+1:y1+1,1:W].astype(np.float32)
                    return (a00*(1-fx)*(1-fy)+a10*fx*(1-fy)+a01*(1-fx)*fy+a11*fx*fy)
                a=sample(src_u8);b=sample(out_u8)
                assert np.array_equal(a[:,:,3],b[:,:,3])
                alpha=a[:,:,3:4]/255.0
                # alpha相同，黑/灰/白的背景项完全相消；逐背景最大差相同。
                delta=np.abs((a[:,:,:3]-b[:,:,:3])*alpha)
                pmax=max(pmax,float(delta.max(initial=0)))
                pcnt+=int(np.count_nonzero(np.any(delta>1e-5,axis=2)))
            records.append({'x':fx,'y':fy,'max_8bit_rgb_delta':pmax,'changed_positions':pcnt})
            top=max(top,pmax);count+=pcnt
    return {'method':'CPU_float32_straight_RGBA_bilinear_source_over','phases':records,
            'max_8bit_rgb_delta':top,'changed_positions_summed9phases':count,
            'backgrounds':{'black':top,'gray':top,'white':top}}


def on_bg(im: Image.Image, rgb: tuple[int,int,int]) -> Image.Image:
    a=np.asarray(im,dtype=np.uint16)
    bg=np.array(rgb,dtype=np.uint16).reshape(1,1,3)
    out=(a[:,:,:3]*a[:,:,3:4]+bg*(255-a[:,:,3:4])+127)//255
    return Image.fromarray(out.astype(np.uint8))


def static_bg_compare(a: Image.Image,b: Image.Image) -> dict:
    d={}
    for name,color in [('black',(0,0,0)),('gray',(128,128,128)),('white',(255,255,255))]:
        aa=np.asarray(on_bg(a,color),dtype=np.int16);bb=np.asarray(on_bg(b,color),dtype=np.int16)
        delta=np.abs(aa-bb)
        d[name]={'max_rgb_delta':int(delta.max(initial=0)),'changed_pixel_count':int(np.count_nonzero(np.any(delta>0,axis=2)))}
        assert d[name]=={'max_rgb_delta':0,'changed_pixel_count':0}
    return d


def scene_projection(items_by_stem: dict) -> dict:
    spec=json.loads((SCENE/'CUT_MANIFEST.json').read_text())
    instances=spec['instances_bottom_to_top']
    old=Image.new('RGBA',(3072,1024),(0,0,0,0));new=old.copy()
    replaced=set()
    for inst in instances:
        stem=Path(inst['asset']).stem
        approved=rgba(SCENE/'exports'/inst['asset'])
        candidate=rgba(ROOT/items_by_stem[stem]['recomposition_path']) if stem in items_by_stem and items_by_stem[stem]['module'].startswith('scene_') else approved
        assert approved.size==candidate.size
        if candidate is not approved: replaced.add(stem)
        if inst.get('mirror'):
            approved=approved.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
            candidate=candidate.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        size=(int(inst.get('width',approved.width)),int(inst.get('height',approved.height)))
        if size!=approved.size:
            approved=approved.resize(size,Image.Resampling.LANCZOS)
            candidate=candidate.resize(size,Image.Resampling.LANCZOS)
        pos=(int(inst['x']),int(inst['y']))
        old.alpha_composite(approved,pos);new.alpha_composite(candidate,pos)
    cmp=visible_cmp(old,new)
    assert cmp=={'max_alpha_delta':0,'max_visible_rgb_delta':0,'changed_visible_pixel_count':0}
    folder=BASE/'review/same_scale';folder.mkdir(parents=True,exist_ok=True)
    paths=[]
    for name,im in [('approved_source_scene',old),('new_recomposition_scene',new)]:
        p=folder/f'{name}.png';im.save(p);paths.append({'path':str(p.relative_to(ROOT)),'sha256':sha(p)})
    pair=Image.new('RGBA',(6144,1024));pair.paste(old,(0,0));pair.paste(new,(3072,0))
    p=folder/'scene_source_vs_new_same_scale.png';pair.save(p)
    return {'source':'SCENE-SAKURA-REDRAW-REUSE-20261013/v0.3/CUT_MANIFEST.json instances_bottom_to_top',
            'viewport':[3072,1024],'instance_count':len(instances),'replaced_asset_ids':sorted(replaced),
            'visible_compare':cmp,'separate_images':paths,'pair_path':str(p.relative_to(ROOT)),
            'pair_sha256':sha(p),'limit':'同批准实例位置与尺寸的离线静态投影；LANCZOS只用于既有场景实例显示尺度，未改正式裁片。Creator实际运行NOT_TESTED。'}


def shop_projections(items_by_stem: dict) -> list[dict]:
    results=[];out=BASE/'review/same_scale';out.mkdir(parents=True,exist_ok=True)
    for i in range(1,7):
        stem_body=next((s for s in items_by_stem if f'shop_{i:02d}_body' in s),None)
        stem_sign=next((s for s in items_by_stem if f'shop_{i:02d}_sign' in s),None)
        assert stem_body and stem_sign
        body=items_by_stem[stem_body];sign=items_by_stem[stem_sign]
        old_b=rgba(ROOT/body['approved_source_path']);old_s=rgba(ROOT/sign['approved_source_path'])
        new_b=rgba(ROOT/body['recomposition_path']);new_s=rgba(ROOT/sign['recomposition_path'])
        old=old_b.copy();old.alpha_composite(old_s)
        new=new_b.copy();new.alpha_composite(new_s)
        assert visible_cmp(old,new)=={'max_alpha_delta':0,'max_visible_rgb_delta':0,'changed_visible_pixel_count':0}
        pair=Image.new('RGBA',(2048,1024));pair.paste(old,(0,0));pair.paste(new,(1024,0))
        p=out/f'shop_{i:02d}_body_sign_source_vs_new.png';pair.save(p)
        results.append({'shop':f'shop_{i:02d}','original_canvas':[1024,1024],
                        'body_asset_id':body['stable_asset_id'],'sign_asset_id':sign['stable_asset_id'],
                        'visible_equal':True,'pair_path':str(p.relative_to(ROOT)),'pair_sha256':sha(p)})
    return results


def contact_sheets(reports: list[dict]) -> list[dict]:
    out=BASE/'review/contact_sheets';out.mkdir(parents=True,exist_ok=True)
    results=[]
    for report in reports:
        entries=report['items'];cols=4;cell_w=320;cell_h=300;rows=(len(entries)+cols-1)//cols
        sheet=Image.new('RGB',(cols*cell_w,rows*cell_h),(28,36,54));d=ImageDraw.Draw(sheet)
        for i,x in enumerate(entries):
            im=rgba(ROOT/x['output_path'])
            scale=min(280/im.width,230/im.height,1.0)
            show=im.resize((max(1,round(im.width*scale)),max(1,round(im.height*scale))),Image.Resampling.LANCZOS)
            col=i%cols;row=i//cols;ox=col*cell_w;oy=row*cell_h
            d.rectangle((ox+5,oy+5,ox+cell_w-5,oy+cell_h-5),fill=(70,78,98),outline=(180,190,210),width=2)
            sheet.paste(show,(ox+(cell_w-show.width)//2,oy+10+(230-show.height)//2),show)
            d.text((ox+10,oy+246),x['stable_asset_id'][:39],fill=(255,255,255))
            d.text((ox+10,oy+267),f"{im.width}x{im.height}",fill=(215,225,245))
        p=out/f"{report['module']}.png";sheet.save(p)
        results.append({'module':report['module'],'path':str(p.relative_to(ROOT)),'sha256':sha(p),
                        'note':'仅索引缩略图使用fit/LANCZOS；不代表游戏实际显示尺度。'})
    return results


def main() -> None:
    gate()
    reports=[json.loads(p.read_text()) for p in sorted((BASE/'source/module_reports').glob('*.json'))]
    assert len(reports)==14 and all(x['result']=='PASS' for x in reports)
    items=[x for report in reports for x in report['items']]
    assert len(items)==76 and len({x['stable_asset_id'] for x in items})==76
    for report in reports:
        assert sha(ROOT/report['psd_path'])==report['psd_sha256']
    comparison=[];total_fill=0;total_source_bytes=0;total_output_bytes=0
    for x in items:
        src=ROOT/x['approved_source_path'];cut=ROOT/x['output_path'];rec=ROOT/x['recomposition_path']
        assert sha(src)==x['source_sha256'] and sha(cut)==x['output_sha256'] and sha(rec)==x['recomposition_sha256']
        a=rgba(src);b=rgba(rec);c=rgba(cut)
        l,t,r,bb=x['crop_rect']
        assert np.array_equal(np.asarray(c),np.asarray(a.crop((l,t,r,bb))))
        vis=visible_cmp(a,b)
        assert vis=={'max_alpha_delta':0,'max_visible_rgb_delta':0,'changed_visible_pixel_count':0}
        bg=static_bg_compare(a,b)
        aa=np.asarray(a,dtype=np.uint8);ba=np.asarray(b,dtype=np.uint8)
        cpu=linear_compare(aa,ba)
        assert cpu['max_8bit_rgb_delta']==0.0 and cpu['changed_positions_summed9phases']==0,(x['stable_asset_id'],cpu)
        total_fill+=x['alpha_zero_rgb_source_fill_pixels']
        total_source_bytes+=src.stat().st_size;total_output_bytes+=cut.stat().st_size
        comparison.append({'stable_asset_id':x['stable_asset_id'],'category':x['category'],
                           'approved_source_path':x['approved_source_path'],'approved_source_sha256':x['source_sha256'],
                           'output_path':x['output_path'],'output_sha256':x['output_sha256'],
                           'psd_layer_frame':x['psd_layer_frame'],'psd_visible_compare':x['psd_visible_compare'],
                           'alpha_zero_rgb_source_fill_pixels':x['alpha_zero_rgb_source_fill_pixels'],
                           'crop_rgba_all_channels_equal_approved_source':True,
                           'recomposition_visible_compare':vis,'black_gray_white':bg,'cpu_9phase':cpu})
    controls=[]
    pilot=json.loads((PILOT/'CUT_MANIFEST.json').read_text())
    for x in pilot['assets']:
        if x['stable_asset_id'] not in ('U03_SHOP_01_BODY','U03_SHOP_01_SIGN','tex_sakura_rr_spirit_a_flame'):continue
        original=rgba(ROOT/x['source_path']);old=rgba(ROOT/x['recomposition_path'])
        cpu=linear_compare(np.asarray(original,dtype=np.uint8),np.asarray(old,dtype=np.uint8))
        assert cpu['max_8bit_rgb_delta']>0
        controls.append({'stable_asset_id':x['stable_asset_id'],'old_v0_1_max_8bit_rgb_delta':cpu['max_8bit_rgb_delta'],
                         'new_v0_2_max_8bit_rgb_delta':0.0,
                         'old_sample_path':x['recomposition_path'],'old_sample_sha256':x['recomposition_sha256']})
    bystem={Path(x['client_path_current']).stem:x for x in items}
    scene=scene_projection(bystem)
    shops=shop_projections(bystem)
    contacts=contact_sheets(reports)
    save_json(BASE/'review/COMPARISON_REPORT.json',{
        'version':'cmp-v1-plus-linear9','plan_sha256':PLAN_SHA,'scope_sha256':SCOPE_SHA,
        'tool':{'Pillow':pillow_version,'numpy':np.__version__,'image_mode':'RGBA8','icc_conversion':False,
                'background_rounding':'(src*alpha+bg*(255-alpha)+127)//255','cpu_sampling':'float32 straight RGBA bilinear x/y=.25,.5,.75 then source-over'},
        'counts':{'candidate_items':len(items),'module_psds':len(reports),'alpha_zero_rgb_source_fill_pixels':total_fill,
                  'source_png_bytes_sum':total_source_bytes,'new_cut_png_bytes_sum':total_output_bytes},
        'items':comparison,'old_three_sampling_controls':controls,'scene_same_scale_projection':scene,
        'shop_same_scale_projections':shops,'contact_sheets':contacts,
        'limits':'CPU数值与离线同尺度投影已核，Creator/GPU/目标平台实际采样与性能NOT_TESTED。',
        'result':'PASS'})
    print(json.dumps({'result':'PASS','items':len(items),'psds':len(reports),'fill_pixels':total_fill,
                      'source_png_bytes_sum':total_source_bytes,'new_png_bytes_sum':total_output_bytes,
                      'old_three_controls':[z['old_v0_1_max_8bit_rgb_delta'] for z in controls]},ensure_ascii=False))


if __name__=='__main__':
    main()
