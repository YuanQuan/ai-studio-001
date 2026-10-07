"""Assemble the signed U01 v0.3 bridge-sign representative sample."""
from __future__ import annotations
import hashlib, json, subprocess, sys
from pathlib import Path
from PIL import Image
import numpy as np
from build_assets import read_raw_psd_layers

ROOT = Path(__file__).resolve().parent
OUT = ROOT.parent
BASE = ROOT.parents[2] / 'moonlit_psd_20261005_v2_raw'
SCRIPT = Path('C:/Users/admin/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py')
SHA = '428a7b1cbee4fb775d90d84401f4558f12fb93b0e3d60f57067d574ce969d6ed'
IDS = ('ties','board','letters')
def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def main():
    assert sha(BASE/'moonlit_four_layers.psd') == SHA
    size, top = read_raw_psd_layers(BASE/'moonlit_four_layers.psd')
    assert size == (2172,724) and len(top)==4
    old = [im for _,im in reversed(top)]
    witnesses=sorted((BASE/'psd_full_canvas_layers').glob('*.png'))
    assert len(witnesses)==4
    bdir=OUT/'exports'/'base'; bdir.mkdir(parents=True,exist_ok=True)
    base_names=['l01_sky.png','l02_mountains.png','l03_ground.png','l04_foreground.png']
    for im,w,name in zip(old,witnesses,base_names):
        assert np.array_equal(np.asarray(im),np.asarray(Image.open(w).convert('RGBA')))
        im.save(bdir/name)
    parts=[Image.open(ROOT/'parts'/f'U01_PROP_BRIDGE_SIGN_{id}.png').convert('RGBA') for id in IDS]
    assert all(x.size==size for x in parts)
    combined=Image.new('RGBA',size,(0,0,0,0))
    for x in parts: combined=Image.alpha_composite(combined,x)
    bbox=combined.getchannel('A').getbbox()
    assert bbox is not None and bbox[0]>=1025 and bbox[1]>=415 and bbox[2]<=1147 and bbox[3]<=470, bbox
    pdir=OUT/'exports'/'props'; pdir.mkdir(parents=True,exist_ok=True)
    prop=pdir/'U01_PROP_BRIDGE_SIGN.png'; combined.save(prop)
    layers=[{'name':f'L{i:02} approved original','file':str(bdir/name),'fit':'none','remove_background':'none'} for i,name in enumerate(base_names[:3],1)]
    layers.append({'name':'L04 approved original','file':str(bdir/base_names[3]),'fit':'none','remove_background':'none'})
    for part in IDS: layers.append({'name':f'U01_PROP_BRIDGE_SIGN {part}','file':str(ROOT/'parts'/f'U01_PROP_BRIDGE_SIGN_{part}.png'),'fit':'none','remove_background':'none'})
    manifest={'canvas':{'width':2172,'height':724,'composite_background':'#000000'},'output':str(OUT/'psd'/'sample_bridge_sign.psd'),'preview':str(OUT/'review'/'sample_bridge_sign_bggg_preview.png'),'layers':layers}
    mp=ROOT/'sample_manifest.json'; mp.write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    psd=OUT/'psd'/'sample_bridge_sign.psd'; psd.parent.mkdir(parents=True,exist_ok=True)
    subprocess.run([sys.executable,str(SCRIPT),'assemble','--manifest',str(mp)],check=True)
    new_size,new_top=read_raw_psd_layers(psd)
    assert new_size==size and len(new_top)==7
    new=[im for _,im in reversed(new_top)]
    assert all(np.array_equal(np.asarray(a),np.asarray(b)) for a,b in zip(old,new[:4]))
    assert all(np.array_equal(np.asarray(a),np.asarray(b)) for a,b in zip(parts,new[4:]))
    overall=Image.new('RGBA',size,(0,0,0,255))
    for im in old+parts: overall=Image.alpha_composite(overall,im)
    ov=OUT/'review'/'sample_bridge_sign_overall.png'; overall.convert('RGB').save(ov)
    crop=overall.crop((974,379,1192,496)).resize((1090,585),Image.Resampling.LANCZOS)
    cp=OUT/'review'/'sample_bridge_sign_detail.png'; crop.convert('RGB').save(cp)
    report={'source_psd_sha256':SHA,'sample_psd':str(psd),'sample_psd_sha256':sha(psd),'layer_count':7,'prop_png':str(prop),'prop_png_sha256':sha(prop),'alpha_bbox':bbox,'source_parts':[{ 'part':k,'svg_sha256':sha(ROOT/'editable_strokes'/f'U01_PROP_BRIDGE_SIGN_{k}.svg'),'png_sha256':sha(ROOT/'parts'/f'U01_PROP_BRIDGE_SIGN_{k}.png')} for k in IDS],'overall':str(ov),'detail':str(cp),'tool':'bggg assemble from PSD-read original layers and new SVG-rendered transparent parts'}
    (ROOT/'sample_validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=='__main__': main()
