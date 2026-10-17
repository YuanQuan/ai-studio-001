# coding: utf-8
from pathlib import Path
import json,hashlib,collections
p=Path(__file__).parent;stage=Path('/private/tmp/minigame-art-opt-integration-staging-v0.4d');m=json.loads((stage/'STAGING_INPUT_MANIFEST.json').read_text());metaids=collections.defaultdict(list)
for f in (stage/'assets').rglob('*.meta'):
 d=json.loads(f.read_text())
 if d.get('uuid'):metaids[d['uuid']].append(str(f.relative_to(stage)))
rows=[];byid={x['stableAssetId']:x for x in m['generatedAssets']};remaps=dict(m['aliasUuidRemaps'])
for a in m['generatedAssets']:
 if not a['physicalIncluded']:continue
 c=byid[a['canonicalImageAssetId']];f=stage/a['generatedPath'];d=json.loads(Path(str(f)+'.meta').read_text());sf=d['subMetas']['f9941']['userData'];assert hashlib.sha256(f.read_bytes()).hexdigest()==a['sha256'];assert d['uuid']==c['imageUuid'];assert d['subMetas']['f9941']['uuid']==c['frameUuid'];assert sf['width']==a['cropFrameRect'][2] and sf['height']==a['cropFrameRect'][3];assert sf['trimType']=='none' and sf['packable']==False
 if a['imageUuid']!=c['imageUuid']:assert remaps[a['imageUuid']]==c['imageUuid'] and remaps[a['frameUuid']]==c['frameUuid']
 lib=stage/'library'/c['imageUuid'][:2]/(c['frameUuid']+'.json');assert lib.exists(),str(lib);lc=json.loads(lib.read_text())['content'];assert [lc['rect']['x'],lc['rect']['y'],lc['rect']['width'],lc['rect']['height']]==a['cropFrameRect'];assert [lc['originalSize']['width'],lc['originalSize']['height']]==[sf['rawWidth'],sf['rawHeight']];assert [lc['offset']['x'],lc['offset']['y']]==[0,0]
 rows.append({'id':a['stableAssetId'],'oldImageUuid':a['imageUuid'],'actualCanonicalImageUuid':d['uuid'],'actualFrameUuid':c['frameUuid'],'sourceSha256':'PASS','actualImportedRawSize':[sf['rawWidth'],sf['rawHeight']],'runtimeOriginalSizeRequired':a['originalSize'],'runtimeOffsetRequired':a['offset'],'librarySpriteFrameExists':True})
platforms=[]
for platform in ['web-mobile','wechatgame','bytedance-mini-game']:
 out=stage/'build-output'/('minigame-art-opt-integration-staging-v0.4d-'+platform);files=[f for f in out.rglob('*') if f.is_file()];groups=collections.defaultdict(list)
 for f in files:
  if f.suffix.lower()=='.png':groups[hashlib.sha256(f.read_bytes()).hexdigest()].append(str(f.relative_to(out)))
 duplicates=[{'sha256':h,'files':v} for h,v in groups.items() if len(set(x.split('/')[1] if x.startswith(('assets/','subpackages/')) else '__root__' for x in v))>1]
 game=json.loads((out/'game.json').read_text()) if platform!='web-mobile' else None
 subs={r['name']:sum(f.stat().st_size for f in (out/r['root']).rglob('*') if f.is_file()) for r in game['subpackages']} if game else {}
 subroots=[r['root'] for r in game['subpackages']] if game else []
 main=sum(f.stat().st_size for f in files if not any(str(f.relative_to(out)).startswith(x) for x in subroots)) if game else None
 platforms.append({'platform':platform,'totalPhysicalBytes':sum(f.stat().st_size for f in files),'mainExcludingAllDeclaredSubpackagesBytes':main,'subpackagePhysicalBytes':subs,'crossBundleIdenticalPngCopies':duplicates,'PNGfiles':sum(f.suffix.lower()=='.png' for f in files),'notUploadMeasurement':True})
(p/'IMPORT_GEOMETRY_AND_PACKAGE_AUDIT.json').write_text(json.dumps({'physicalLogicalRows':len(rows),'uniqueImageUUIDs':len(set(x['actualCanonicalImageUuid'] for x in rows)),'stageDuplicateImageMetaUUIDs':{k:v for k,v in metaids.items() if len(v)>1},'rows':rows,'platforms':platforms},indent=2)+'\n')
print('logical',len(rows),'unique',len(set(x['actualCanonicalImageUuid'] for x in rows)), 'cross-bundle duplicate png groups',[(x['platform'],len(x['crossBundleIdenticalPngCopies'])) for x in platforms])
