"""Read-only comparison of approved Art v0.5 cuts and active Cocos layout."""
import argparse, hashlib, json, pathlib, re, subprocess
ARGS=argparse.ArgumentParser()
ARGS.add_argument('--iab-export',type=pathlib.Path)
args=ARGS.parse_args()
ROOT=pathlib.Path(__file__).resolve().parents[4]
ART=ROOT/'deliverables/art/SCENE-SAKURA-REDRAW-REUSE-20261013/v0.5'
CUT=json.loads((ART/'CUT_MANIFEST.json').read_text())
SRC=(ROOT/'apps/client/assets/labs/u01/sakura_v03_layout.ts').read_text()
LAYOUT=json.loads(re.search(r'=\s*(\{.*\})\s+as const;',SRC,re.S).group(1))
OLD_SRC=subprocess.check_output(['git','show','HEAD:apps/client/assets/labs/u01/sakura_v03_layout.ts'],text=True,cwd=ROOT)
OLD_LAYOUT=json.loads(re.search(r'=\s*(\{.*\})\s+as const;',OLD_SRC,re.S).group(1))
RES=ROOT/'apps/client/assets/resources/sakura_v03'
issues=[]
proto={x['id']:x for x in LAYOUT['prototypes']}
artfiles={pathlib.Path(x['path']).name:x for x in CUT['active_exports']}
if len(artfiles)!=21 or len(proto)!=21 or len(LAYOUT['instances'])!=45:issues.append('21 prototypes/45 instances count mismatch')
for name,item in artfiles.items():
 p=proto.get(pathlib.Path(name).stem)
 if not p:issues.append(f'missing prototype {name}');continue
 f=RES/name
 if not f.exists():issues.append(f'missing imported image {name}')
 else:
  h=hashlib.sha256(f.read_bytes()).hexdigest()
  if h!=item['sha256'] or h!=p['sha256']:issues.append(f'image sha mismatch {name}')
 m=RES/(name+'.meta')
 if not m.exists():issues.append(f'missing meta {name}')
 else:
  d=json.loads(m.read_text());uid=d.get('uuid')
  if uid!=p.get('imageUuid') or p.get('textureUuid')!=f'{uid}@6c48a' or p.get('spriteFrameUuid')!=f'{uid}@f9941':issues.append(f'uuid mismatch {name}')
  old=ROOT/'deliverables/art/SCENE-SAKURA-REDRAW-REUSE-20261013/v0.3/exports'/name
  if old.exists():
   if hashlib.sha256(old.read_bytes()).hexdigest()!=item['sha256']:issues.append(f'17 old source changed {name}')
   oldmeta_bytes=subprocess.check_output(['git','show',f'HEAD:apps/client/assets/resources/sakura_v03/{name}.meta'],cwd=ROOT)
   oldmeta=json.loads(oldmeta_bytes)
   if oldmeta.get('uuid')!=uid:issues.append(f'old uuid changed {name}')
old_nonbridge={(x['assetId'],x['x'],x['y'],x['mirror']):x for x in OLD_LAYOUT['instances'] if 'bridge' not in x['assetId']}
new_nonbridge={(x['assetId'],x['x'],x['y'],x['mirror']):x for x in LAYOUT['instances'] if 'bridge' not in x['assetId']}
if len(old_nonbridge)!=41 or old_nonbridge.keys()!=new_nonbridge.keys():issues.append('41 nonbridge instance key set changed')
for key,old in old_nonbridge.items():
 new=new_nonbridge.get(key)
 if new and any(old.get(field)!=new.get(field) for field in ('instanceId','name','motion')):issues.append(f'41 nonbridge identity/motion changed {key}')
for i,(a,c) in enumerate(zip(CUT['instances_bottom_to_top'],LAYOUT['instances'])):
 name=pathlib.Path(a['asset']).stem
 if c['assetId']!=name:issues.append(f'instance {i} asset mismatch')
 for key,ckey in [('x','x'),('y','y'),('mirror','mirror')]:
  if a[key]!=c[ckey]:issues.append(f'instance {i} {key} mismatch')
 size=artfiles[pathlib.Path(a['asset']).name]['size']
 expected_width=a.get('width',size[0]);expected_height=a.get('height',size[1])
 if c['width']!=expected_width or c['height']!=expected_height:issues.append(f'instance {i} size mismatch')
# Reproduce the editor's current createInitialItems band sequence, then inspect order.
EDITOR=(ROOT/'apps/client/assets/labs/u01/sakura_layout_editor.ts').read_text()
expected_source=["addEntries(['L01_Sky','L02_Mountains','L03_Ground'])", "addEntries(['L04_WaterBridge','L05_WaterGrass'])", "order:this.items.length+i*0.001", "this.items.sort((a,b)=>a.order-b.order); this.reorder()"]
if not all(part in EDITOR for part in expected_source):issues.append('U01 source band algorithm not recognized; require actual export')
bands=['L01_Sky','L02_Mountains','L03_Ground','L04_WaterBridge','L05_WaterGrass']
ordered=[]
for band in bands[:3]:ordered.extend(sorted((x for x in LAYOUT['instances'] if x['layer']==band),key=lambda x:x['order']))
ordered.extend({'instanceId':f'ORIGINAL-SHOP-{i+1}','layer':'SHOP'} for i in range(6))
for band in bands[3:]:ordered.extend(sorted((x for x in LAYOUT['instances'] if x['layer']==band),key=lambda x:x['order']))
order_names=[x['instanceId'] for x in ordered]
indexes={name:order_names.index(name) for name in order_names}
bodies=[i for i,x in enumerate(ordered) if x.get('assetId') in ('tex_sakura_rr_bridge_body_l','tex_sakura_rr_bridge_body_r')]
fronts=[i for i,x in enumerate(ordered) if x.get('assetId') in ('tex_sakura_rr_bridge_front_l','tex_sakura_rr_bridge_front_r')]
shops=[indexes[f'ORIGINAL-SHOP-{i+1}'] for i in range(6)]
rails=[i for i,x in enumerate(ordered) if x.get('assetId')=='tex_sakura_rr_street_rail_half']
if len(ordered)!=51 or None in bodies+fronts or not(max(bodies)<min(shops) and max(shops)<min(fronts) and max(fronts)<min(rails)):
 issues.append(f'U01 draw order wrong: bodies={bodies} shops={shops} fronts={fronts} rails={rails}')
iab_result='NOT_TESTED'
if args.iab_export:
 export=json.loads(args.iab_export.read_text())
 got=export.get('instances',[])
 export_issues=[]
 if len(got)!=51:export_issues.append(f'actual export count {len(got)} != 51')
 exported_proto={x['assetId']:x for x in export.get('prototypes',[])}
 if len(exported_proto)!=21:export_issues.append('actual exported prototype count != 21')
 for asset,source_proto in proto.items():
  ep=exported_proto.get(asset)
  if not ep:export_issues.append(f'export missing prototype {asset}');continue
  for key,export_key in [('sha256','sha256'),('imageUuid','imageUuid'),('textureUuid','textureUuid'),('spriteFrameUuid','spriteFrameUuid'),('width','width'),('height','height')]:
   if source_proto.get(key)!=ep.get(export_key):export_issues.append(f'export prototype {asset} {key} mismatch')
 if export.get('counts',{}).get('environment')!=45 or export.get('counts',{}).get('shops')!=6:export_issues.append('actual counts not 45+6')
 for i,(want,actual) in enumerate(zip(ordered,got)):
  if want['instanceId']!=actual.get('instanceId'):export_issues.append(f'export order {i} id mismatch')
  if want.get('layer')!='SHOP':
   p=proto[want['assetId']]
   for k in ('imageUuid','textureUuid','spriteFrameUuid'):
    if actual.get(k)!=p.get(k):export_issues.append(f'export {i} {k} mismatch')
   if actual.get('assetUuid')!=p.get('spriteFrameUuid'):export_issues.append(f'export {i} assetUuid mismatch')
   for ek,ak in [('assetId','assetId'),('x','left'),('y','top'),('width','displayWidth'),('height','displayHeight'),('mirror','mirror')]:
    if want.get(ek)!=actual.get(ak):export_issues.append(f'export {i} {ek} mismatch')
  elif actual.get('assetId')!='ORIGINAL-SHOP':export_issues.append(f'export {i} shop asset mismatch')
  if i and not (got[i-1].get('orderBottomToTop',-1)<actual.get('orderBottomToTop',-1)):export_issues.append(f'export {i} order not increasing')
 iab_result='PASS' if not export_issues else 'FAIL'
 issues.extend(export_issues)
output={'art_manifest' :str(CUT.get('version')),'source_version':LAYOUT.get('sourceVersion'),'prototype_count':len(proto),'instance_count':len(LAYOUT['instances']),'art_instance_coordinate_and_mirror_check':'PASS' if not any(x.startswith('instance ') for x in issues) else 'FAIL','nonbridge_41_identity_motion':'PASS' if not any('41 nonbridge' in x for x in issues) else 'FAIL','uuid_and_file_check':'PASS' if not any(('uuid' in x or 'image' in x or 'meta' in x or 'prototype' in x or 'source changed' in x) for x in issues) else 'FAIL','u01_source_derived_order':'PASS' if not any(('draw order' in x or 'band algorithm' in x) for x in issues) else 'FAIL','u01_source_derived_positions':{'bodies':bodies,'shops':shops,'fronts':fronts,'shore_chains':rails},'actual_iab_export':iab_result,'issues':issues}
print(json.dumps(output,ensure_ascii=False,indent=2))
