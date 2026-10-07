"""Assemble independently editable U01 v0.3 props on the approved PSD layers."""
from __future__ import annotations
import hashlib, json, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image
from build_assets import read_raw_psd_layers

ROOT=Path(__file__).resolve().parent
OUT=ROOT.parent
BASE=ROOT.parents[2]/'moonlit_psd_20261005_v2_raw'
SCRIPT=Path('C:/Users/admin/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py')
SOURCE_SHA='428a7b1cbee4fb775d90d84401f4558f12fb93b0e3d60f57067d574ce969d6ed'
SIZE=(2172,724)
GROUPS={
 'U01_PROP_LANTERN_A':['glow','shade','tail'],
 'U01_PROP_LANTERN_B':['glow','shade','tail'],
 'U01_PROP_SOUL_BANNER':['pole','cloth','knot','foot'],
 'U01_PROP_ROAD_SIGN':['pole','board','letters','arrow'],
 'U01_PROP_FENGDU_LETTERS':['feng','du','cheng'],
 'U01_PROP_BRIDGE_SIGN':['ties','board','letters'],
}
PIVOTS={'U01_PROP_LANTERN_A':(792,223),'U01_PROP_LANTERN_B':(1278,235),'U01_PROP_SOUL_BANNER':(700,499),'U01_PROP_ROAD_SIGN':(866,511),'U01_PROP_FENGDU_LETTERS':(2050,268),'U01_PROP_BRIDGE_SIGN':(1086,422)}
BOXES={'U01_PROP_LANTERN_A':(770,163,814,227),'U01_PROP_LANTERN_B':(1259,184,1296,239),'U01_PROP_SOUL_BANNER':(683,329,753,504),'U01_PROP_ROAD_SIGN':(830,373,914,515),'U01_PROP_FENGDU_LETTERS':(2004,250,2098,288),'U01_PROP_BRIDGE_SIGN':(1025,417,1148,470)}
BASE_NAMES=['l01_sky.png','l02_mountains.png','l03_ground.png','l04_foreground.png']
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def rgba(p):
    im=Image.open(p).convert('RGBA'); assert im.size==SIZE,p; return im
def comp(images):
    out=Image.new('RGBA',SIZE,(0,0,0,0))
    for im in images:out=Image.alpha_composite(out,im)
    return out
def edges_clear(im):
    a=np.asarray(im.getchannel('A'))
    return max(int(a[:,0].max()),int(a[:,-1].max()),int(a[0,:].max()),int(a[-1,:].max()))==0
def manifest_layer(name,p):return {'name':name,'file':str(p),'fit':'none','remove_background':'none'}
def main():
    assert sha(BASE/'moonlit_four_layers.psd')==SOURCE_SHA
    size,top=read_raw_psd_layers(BASE/'moonlit_four_layers.psd')
    assert size==SIZE and len(top)==4
    old=[im for _,im in reversed(top)]
    witness=sorted((BASE/'psd_full_canvas_layers').glob('*.png'))
    assert len(witness)==4
    bdir=OUT/'exports'/'base';bdir.mkdir(parents=True,exist_ok=True)
    base_hash=[]
    for im,w,name in zip(old,witness,BASE_NAMES):
        assert np.array_equal(np.asarray(im),np.asarray(rgba(w))),name
        out=bdir/name;im.save(out);base_hash.append({'file':str(out),'sha256':sha(out),'old_png_sha256':sha(w),'pixel_equal_old':True,'alpha_bbox':im.getchannel('A').getbbox()})
    pdir=OUT/'exports'/'props';pdir.mkdir(parents=True,exist_ok=True)
    groups={}; rows=[]
    for id,parts in GROUPS.items():
        sources=[ROOT/'parts'/f'{id}_{part}.png' for part in parts]
        images=[rgba(p) for p in sources]
        combined=comp(images)
        bbox=combined.getchannel('A').getbbox()
        assert bbox is not None and edges_clear(combined),id
        allowed=BOXES[id]
        assert bbox[0]>=allowed[0] and bbox[1]>=allowed[1] and bbox[2]<=allowed[2] and bbox[3]<=allowed[3],(id,bbox,allowed)
        out=pdir/f'{id}.png';combined.save(out)
        groups[id]=images
        rows.append({'id':id,'file':str(out),'sha256':sha(out),'size':SIZE,'mode':'RGBA','alpha_bbox':bbox,'pivot':PIVOTS[id],'source_part_names':parts,'source_part_files':[str(p) for p in sources],'source_svg_sha256':[sha(ROOT/'editable_strokes'/f'{id}_{p}.svg') for p in parts]})
    layer_defs=[]
    def add_base(i):layer_defs.append(manifest_layer(f'L{i+1:02} approved original',bdir/BASE_NAMES[i]))
    def add_group(id):
        for p in GROUPS[id]:layer_defs.append(manifest_layer(f'{id} {p}',ROOT/'parts'/f'{id}_{p}.png'))
    add_base(0);add_base(1)
    add_group('U01_PROP_LANTERN_A');add_group('U01_PROP_LANTERN_B')
    add_base(2)
    add_group('U01_PROP_SOUL_BANNER');add_group('U01_PROP_ROAD_SIGN');add_group('U01_PROP_FENGDU_LETTERS')
    add_base(3);add_group('U01_PROP_BRIDGE_SIGN')
    m={'canvas':{'width':2172,'height':724,'composite_background':'#000000'},'output':str(OUT/'psd'/'u01_gentle_underworld_props.psd'),'preview':str(OUT/'review'/'assembly_preview.png'),'layers':layer_defs}
    mp=ROOT/'assembly_manifest.json';mp.write_text(json.dumps(m,ensure_ascii=False,indent=2),encoding='utf-8')
    (OUT/'psd').mkdir(exist_ok=True)
    result=subprocess.run([sys.executable,str(SCRIPT),'assemble','--manifest',str(mp)],check=True,capture_output=True,text=True)
    (ROOT/'bggg_summary.json').write_text(result.stdout,encoding='utf-8')
    psd=OUT/'psd'/'u01_gentle_underworld_props.psd'
    new_size,top_new=read_raw_psd_layers(psd)
    assert new_size==SIZE and len(top_new)==len(layer_defs)
    new=[im for _,im in reversed(top_new)]
    for i,(im,defn) in enumerate(zip(new,layer_defs)):
        assert np.array_equal(np.asarray(im),np.asarray(rgba(defn['file']))),(i,defn['name'])
    overall=Image.new('RGBA',SIZE,(0,0,0,255))
    for im in new:overall=Image.alpha_composite(overall,im)
    rev=OUT/'review';rev.mkdir(exist_ok=True)
    out=rev/'overall_from_psd.png';overall.convert('RGB').save(out)
    stored=Image.open(psd).convert('RGB')
    delta=np.abs(np.asarray(overall.convert('RGB')).astype(np.int16)-np.asarray(stored).astype(np.int16))
    assert int(delta.max())<=1,int(delta.max())
    old_overall=Image.open(BASE/'overall_from_psd.png').convert('RGB')
    before=np.asarray(old_overall);after=np.asarray(overall.convert('RGB'))
    diff=np.any(before!=after,axis=2)
    allowed=np.zeros((724,2172),dtype=bool)
    for x0,y0,x1,y1 in BOXES.values():allowed[y0:y1,x0:x1]=True
    assert not np.any(diff & ~allowed),'整体差异超出六件范围'
    validation={'approved_psd_sha256':SOURCE_SHA,'new_psd':str(psd),'new_psd_sha256':sha(psd),'layer_count':len(layer_defs),'layer_names':[x['name'] for x in layer_defs],'base':base_hash,'props':rows,'overall':str(out),'overall_sha256':sha(out),'psd_stored_max_channel_delta':int(delta.max()),'psd_stored_nonidentical_channel_count':int(np.count_nonzero(delta)),'diff_pixels_from_approved':int(np.count_nonzero(diff)),'edge_alpha_base_l04_unchanged':True}
    (ROOT/'build_validation.json').write_text(json.dumps(validation,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'psd':str(psd),'layers':len(layer_defs),'props':[(r['id'],r['alpha_bbox']) for r in rows],'stored_delta':int(delta.max())},ensure_ascii=False,indent=2))
if __name__=='__main__':main()
