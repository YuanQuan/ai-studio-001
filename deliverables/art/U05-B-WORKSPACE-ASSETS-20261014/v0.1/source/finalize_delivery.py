"""Freeze file hashes, semantic export mapping and Art review packet."""
from pathlib import Path
from PIL import Image
import json,hashlib
R=Path(__file__).resolve().parents[1]
P=R.parents[3]
J=lambda p:json.loads((R/p).read_text())
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
objects=J('source/object_cut_data.json')
contents=J('source/cup_content_data.json')
scene=J('source/scene_cut_data.json')
states=J('source/state_cut_data.json')
by_id={x['id']:x for x in objects+contents+scene+states}
rows=[]
for path in sorted((R/'exports').glob('*.png')):
    id=path.stem
    meta=by_id.get(id,{})
    im=Image.open(path)
    row={'asset_id':id,'art_path':str(path.relative_to(P)),'art_version':'v0.1',
         'sha256':H(path),'dimensions':list(im.size),'mode':im.mode,
         'alpha_bbox':list(im.getchannel('A').getbbox()) if im.mode=='RGBA' else None,
         'source_layer':meta.get('layer',meta.get('source')),
         'source_bbox_full':meta.get('bbox'),
         'pivot_full':meta.get('pivot_full'),'pivot_export':meta.get('pivot_export'),
         'client_path_plan':'apps/client/assets/units/shops/milk_tea/textures/u05_b/'+path.name,
         'client_import_status':'PLANNED','client_uuid':None}
    if id=='STATIC_BARE':row['source_layer']='source/layers/STATIC_BARE_full.png'
    if id.startswith('SELECT_') or id.startswith('LOCK_'):
        row['source_layer']='source/layers/'+id+('_SAMPLE_full.png' if id.startswith('SELECT_') else '_BANK_full.png')
        row['class_reusable_origin']=meta.get('anchors')
    if id.startswith('CUP_'):
        row['source_layer']=meta['layer']
        row['canonical_canvas']=meta['local_canvas']
        row['canonical_nonzero_bbox']=meta['nonzero_bbox']
        row['work_origin']=meta['work_origin']
        row['order_rect']=meta['order_rect']
    rows.append(row)
assert len(rows)==57,len(rows)
assert len([x for x in rows if x['asset_id'].startswith('U05_B_')])==12
assert len([x for x in rows if x['asset_id'].startswith('CUP_')])==12
assert all(x['alpha_bbox'] is not None for x in rows if x['asset_id']!='STATIC_BARE')
psd=R/'source/workspace_b_master.psd'
manifest={'task_id':'U05-B-WORKSPACE-ASSETS-20261014','version':'v0.1','canvas':[1024,1536],
 'frozen_source':'deliverables/art/U05-MILK-TEA-WORKSPACE-CONCEPT-20261013/v0.3/concept_B.png',
 'frozen_source_sha256':H(P/'deliverables/art/U05-MILK-TEA-WORKSPACE-CONCEPT-20261013/v0.3/concept_B.png'),
 'psd':{'path':str(psd.relative_to(P)),'sha256':H(psd),'layer_manifest':'source/LAYER_MANIFEST.json','layer_count':len(J('source/LAYER_MANIFEST.json')['layer_order_bottom_to_top'])},
 'canonical_cup_composition':{'canonical_canvas':[183,233],'work_origin':[418,1093],
  'order_target_rect':[577,326,728,506], 'scale_filter':'Pillow LANCZOS',
  'draw_order':['cup_back','CUP_TEA_Txx','CUP_MILK_Mxx','CUP_TOP_Pxx','cup_front','order_straw_if_order'],
  'clip':'Each canonical PNG already has the shared cup-interior alpha clip. Place whole 183x233 transparent canvas at work origin. For order resize whole canvas to exact 151x180 then place at order target rect; never use nonzero alpha bbox as origin.',
  'sample_A':['CUP_TEA_T01','CUP_MILK_M01','CUP_TOP_P01'],
  'sample_B':['CUP_TEA_T03','CUP_MILK_M03','CUP_TOP_P06']},
 'font':{'path':'source/font/ZCOOLKuaiLe-Regular.ttf','sha256':H(R/'source/font/ZCOOLKuaiLe-Regular.ttf'),
         'license_path':'source/font/OFL.txt','license_sha256':H(R/'source/font/OFL.txt'),'usage':'source/font_usage.json'},
 'exports':rows,
 'review':{n:{'path':'review/'+n,'sha256':H(R/'review'/n)} for n in ['reconstructed.png','comparison.png','difference.png','resource_sheet.png','composition_variants.png','psd_skill_preview.png']},
 'known_limitations':['Single flat RGB concept has no hidden pixels behind opaque objects. Signed local inpainting fills only exposed holes.','Milk vessel interior was semi-transparent over shelf; exported boundary uses deterministic object mask and local tint/edge repair, so concealed optical background cannot be mathematically recovered.','Glyphs in concept source are not typography authority; licensed text is a separate sample layer and runtime must render text dynamically.']}
(R/'CUT_MANIFEST.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print('exports',len(rows),'PSD',manifest['psd']['sha256'],'outside',J('review/change_metrics.json')['outside_planned_mask_changed_pixels'])
