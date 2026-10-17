import hashlib, json, os, pathlib, struct
try:
    from PIL import Image
except Exception:
    Image = None
ROOT = pathlib.Path('/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001')
BASELINE = pathlib.Path('/private/tmp/minigame-art-opt-png-baseline-regenerated-20261017')
PRE = pathlib.Path('/private/tmp/minigame-art-opt-png-stage-20261017-v05-preimport-reconstructed')
POST = pathlib.Path('/private/tmp/minigame-art-opt-png-stage-20261017-v05')
OUT = POST / 'build-output'
EVIDENCE = ROOT / 'deliverables/client/MINIGAME-ART-OPT-PNG-20261017-CLIENT/v0.1/evidence'
sha = lambda b: hashlib.sha256(b).hexdigest()
def file_hash(p): return sha(p.read_bytes())
def rows_for(root, prefixes):
    rows=[]
    for prefix in prefixes:
        p=root/prefix
        if p.is_file():
            files=[p]
        elif p.is_dir():
            files=[x for x in p.rglob('*') if x.is_file()]
        else: raise FileNotFoundError(p)
        for f in files:
            rel=f.relative_to(root).as_posix()
            if f.name=='.DS_Store': continue
            b=f.read_bytes(); rows.append({'path':rel,'bytes':len(b),'sha256':sha(b)})
    rows.sort(key=lambda x:x['path'])
    return rows
config=json.loads((ROOT/'apps/client/tools/asset-integration/approved_png_overrides.json').read_text())
sm=json.loads((POST/'STAGING_INPUT_MANIFEST.json').read_text())
pre_rows=rows_for(PRE,['assets','settings','package.json','build-configs'])
pre_digest=sha(('\n'.join(f"{x['path']}\t{x['bytes']}\t{x['sha256']}" for x in pre_rows)+'\n').encode())
(EVIDENCE/'PREIMPORT_PAYLOAD.json').write_text(json.dumps({'scope':'assets/** + settings/** + package.json + build-configs/*.json; excludes .DS_Store','snapshotNature':'RECONSTRUCTED_FROM_PINNED_REGENERATED_BASELINE_PLUS_EXACT_APPROVED_DELTAS_BEFORE_CREATOR_IMPORT','baselineStage':str(BASELINE),'baselineManifestSha256':file_hash(BASELINE/'STAGING_INPUT_MANIFEST.json'),'overrideManifestSha256':file_hash(ROOT/'apps/client/tools/asset-integration/approved_png_overrides.json'),'textPatchAuthorizationSha256':file_hash(ROOT/'deliverables/master/MINIGAME-ART-OPT-PNG-20261017/v0.1/FONT_PUNCTUATION_FIX_AUTHORIZATION.json'),'fileCount':len(pre_rows),'bytes':sum(x['bytes'] for x in pre_rows),'inventorySha256':pre_digest,'files':pre_rows},ensure_ascii=False,indent=2)+'\n')
post_rows=rows_for(POST,['assets','settings','package.json','build-configs'])
pre_map={x['path']:x for x in pre_rows}; post_map={x['path']:x for x in post_rows}
diffs=[]
for p in sorted(set(pre_map)|set(post_map)):
    a,b=pre_map.get(p),post_map.get(p)
    if a!=b: diffs.append({'path':p,'before':a,'after':b})
post_digest=sha(('\n'.join(f"{x['path']}\t{x['bytes']}\t{x['sha256']}" for x in post_rows)+'\n').encode())
(EVIDENCE/'POSTIMPORT_STAGE_DIFF.json').write_text(json.dumps({'scope':'same paths as PREIMPORT_PAYLOAD.json; Creator imported stage only','preImportInventorySha256':pre_digest,'postImportInventorySha256':post_digest,'preFileCount':len(pre_rows),'postFileCount':len(post_rows),'diffCount':len(diffs),'diffs':diffs},ensure_ascii=False,indent=2)+'\n')
platforms=[]; native_checks=[]
for platform in ['web-mobile','wechatgame','bytedance-mini-game']:
    name=f'minigame-art-opt-png-20261017-client-v01-{platform}';root=OUT/name
    files=rows_for(root,['.'])
    log=POST/'evidence'/f'creator-{platform}.log';log_bytes=log.read_bytes();log_text=log_bytes.decode('utf8','replace')
    expected_marker=f'build Task (MINIGAME-ART-OPT-PNG-20261017-CLIENT-{platform}) Finished'
    rows=[]
    for x in sm['approvedPngOverrides']:
        rel=x['imageUuid']+'.png'
        bundle={'tex_sakura_rr_sky_r':'world','tex_u03_shop_05_sign':'shops','UG_GHOST_01_HAPPY_00':'tourist','tex_u04_at_s3_base':'dialogue','tex_u03_shop_05_body':'shops','U05_ART_FONT':'milk-tea'}[x['stableAssetId']]
        folder='assets' if platform=='web-mobile' else 'subpackages'
        native_rel=f'{folder}/{bundle}/native/{x["imageUuid"][:2]}/{rel}'
        target=root/native_rel
        if not target.is_file(): raise FileNotFoundError(target)
        raw=target.read_bytes(); width,height=struct.unpack('>II',raw[16:24]) if raw[:8]==b'\x89PNG\r\n\x1a\n' else (None,None)
        candidate=ROOT/x['candidatePath']; pixel_equal=None
        if Image:
            with Image.open(candidate) as c, Image.open(target) as b:
                pixel_equal=c.convert('RGBA').size==b.convert('RGBA').size and c.convert('RGBA').tobytes()==b.convert('RGBA').tobytes()
        rows.append({'stableAssetId':x['stableAssetId'],'nativePath':native_rel,'sha256':sha(raw),'bytes':len(raw),'dimensions':[width,height],'candidateSha256':x['candidateSha256'],'candidatePixelEqual':pixel_equal})
    platforms.append({'platform':platform,'outputRoot':str(root),'fileCount':len(files),'totalBytes':sum(x['bytes'] for x in files),'filesInventorySha256':sha(('\n'.join(f"{x['path']}\t{x['bytes']}\t{x['sha256']}" for x in files)+'\n').encode()),'exitCode':36,'finishedMarkerPresent':expected_marker in log_text,'logPath':str(log),'logSha256':sha(log_bytes),'outputFiles':files,'sixNativePngs':rows})
    native_checks.extend({'platform':platform,**x} for x in rows)
active=[]
for x in config['assets']:
    p=ROOT/x['clientPath'];meta=p.with_name(p.name+'.meta')
    active.append({'stableAssetId':x['stableAssetId'],'clientPath':x['clientPath'],'activeSourceAfterSha256':file_hash(p),'approvedCandidateSha256':x['candidateSha256'],'sourceMetaPath':str(meta.relative_to(ROOT)),'sourceMetaSha256':file_hash(meta),'stageOutputPath':x['stagePath'],'stageImageSha256':file_hash(POST/x['stagePath']),'stageMetaSha256':file_hash(pathlib.Path(str(POST/x['stagePath'])+'.meta'))})
protected=[]
for rel,expected in [
 ('apps/client/assets/labs/u01/sakura_v03_layout.ts','909978eaa52cd53461ebd9edf16efb0850b6d78d7cd714d3c018bb02f3021e82'),
 ('apps/client/assets/resources/sakura_v03/tex_sakura_rr_bridge_front_l.png','39bb2ef51072ee99aac4edd0b04728f75420e9087bb732c27c64e7eafddc6c29'),
 ('apps/client/assets/resources/sakura_v03/tex_sakura_rr_bridge_front_r.png','854d855ac88d3030078ae7c25b34a0406d9087c99ca5f73f4a1ae851ee846a26'),
 ('apps/client/package.json','3382ee4d451fe205b37501db2fc4b4d0735c2cc9fc5b783cc3abf447d5e21b2a')]:
    actual=file_hash(ROOT/rel); protected.append({'path':rel,'sha256':actual,'expectedProtectedSha256':expected,'unchanged':actual==expected})
report={'creatorVersion':'3.8.8','stageRoot':str(POST),'stageManifestSha256':file_hash(POST/'STAGING_INPUT_MANIFEST.json'),'baselineStage':str(BASELINE),'baselineManifestSha256':file_hash(BASELINE/'STAGING_INPUT_MANIFEST.json'),'basePayloadInventoryPath':config['baseStagePayloadManifestPath'],'basePayloadInventorySha256':file_hash(pathlib.Path(config['baseStagePayloadManifestPath'])),'approvedOverridesPath':'apps/client/tools/asset-integration/approved_png_overrides.json','approvedOverridesSha256':file_hash(ROOT/'apps/client/tools/asset-integration/approved_png_overrides.json'),'artIdentitySha256':config['sourceIdentitySha256'],'authorizationPath':config['authorizationPath'],'authorizationSha256':config['authorizationSha256'],'fontPatchAuthorizationPath':'deliverables/master/MINIGAME-ART-OPT-PNG-20261017/v0.1/FONT_PUNCTUATION_FIX_AUTHORIZATION.json','fontPatchAuthorizationSha256':file_hash(ROOT/'deliverables/master/MINIGAME-ART-OPT-PNG-20261017/v0.1/FONT_PUNCTUATION_FIX_AUTHORIZATION.json'),'approvedPngs':active,'protectedClientDifferences':protected,'preImportInventorySha256':pre_digest,'postImportStageDiffPath':'deliverables/client/MINIGAME-ART-OPT-PNG-20261017-CLIENT/v0.1/evidence/POSTIMPORT_STAGE_DIFF.json','platformBuilds':platforms}
(EVIDENCE/'BUILD_OUTPUTS.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'preFiles':len(pre_rows),'preBytes':sum(x['bytes'] for x in pre_rows),'preInventorySha256':pre_digest,'postFiles':len(post_rows),'postImportDiffCount':len(diffs),'platforms':[{'platform':p['platform'],'files':p['fileCount'],'bytes':p['totalBytes'],'finished':p['finishedMarkerPresent'],'sixNative':len(p['sixNativePngs'])} for p in platforms],'protectedAllUnchanged':all(x['unchanged'] for x in protected)},ensure_ascii=False,indent=2))
