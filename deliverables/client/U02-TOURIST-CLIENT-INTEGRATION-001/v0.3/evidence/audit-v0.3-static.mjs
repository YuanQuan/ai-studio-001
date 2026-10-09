import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const read = p => fs.readFileSync(path.join(root,p));
const json = p => JSON.parse(read(p).toString('utf8'));
const errors = [];
const check = (ok, message) => { if (!ok) errors.push(message); };
const vfxRoot='deliverables/vfx/U02-TOURIST-VFX-FRAMES-001/v0.2';
const clientRoot='apps/client/assets/units/ghost-customer';
const approval=json('tasks/U02-TOURIST-VFX-FRAMES-001/ARTIFACT_APPROVAL.json');
const sourceFrames=json(`${vfxRoot}/frames/FRAME_MANIFEST.json`);
const sourceMounts=json(`${vfxRoot}/mounts/FRAME_MOUNT_MANIFEST.json`);
const runtimeFrames=json(`${clientRoot}/frames/ug_ghost_01_frame_manifest.json`);
const runtimeMounts=json(`${clientRoot}/data/ug_ghost_01_mounts.json`);
const map=json(`${clientRoot}/data/ug_ghost_01_asset_map.json`);
const scene=json('apps/client/assets/UnitSamples.scene');
const gallery=scene.find(x=>x._id==='ef8c639a38e445b0bb0eef');
const accessory=json(`${clientRoot}/data/ug_ghost_01_accessories.json`);
const priorAudit=json('deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/RESOURCE_AND_FRAME_AUDIT.json');
const engineConfig=json('apps/client/settings/v2/packages/engine.json').modules.configs.defaultConfig;
check(approval.status==='USER_APPROVED' && approval.version==='v0.2','Gate2 approval is not the exact approved v0.2 version');
check(sha(read(`${vfxRoot}/preview/recomposition.png`))==='4a76eaeb64270be2914c41e0ca648a38e2dd4542696d3ead4d363edce76c027a','approved recomposition hash mismatch');
check(sha(read(`${vfxRoot}/frames/FRAME_MANIFEST.json`))==='8089127bea9f4e644177c7285c1552695e45560ad6be4e588788a0f6b90f71c8','source frame manifest hash mismatch');
check(sha(read(`${vfxRoot}/mounts/FRAME_MOUNT_MANIFEST.json`))==='1b3296be8b2335cdd938963a665d2721a8fc352150ae5353ba18831a5d88b42b','source mount manifest hash mismatch');
check(sourceFrames.frames.length===40 && sourceMounts.frames.length===40 && runtimeFrames.frames.length===40 && runtimeMounts.frames.length===40,'expected 40 source/runtime frames and mounts');
check(gallery?.touristBodyFrames?.length===40,'Scene does not reference 40 body SpriteFrames');
check(gallery?.touristAccessoryFrames?.length===4 && gallery?.shopPrefabs?.length===6,'U03 shop or independent accessory Scene references changed');
check(gallery?.streetBasePrefab?.__uuid__==='2d697fb3-01f0-4330-a180-a9c162310bf8','U03 street prefab UUID changed');
check(gallery?.touristPrefab?.__uuid__==='e94ff176-13d1-4691-b958-61765f95cd89','U02 prefab UUID changed');
const backupScene=json('deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/evidence/old-client-frame-backup/UnitSamples.scene');
const normalizeScene=x=>{const copy=structuredClone(x);const g=copy.find(v=>v._id==='ef8c639a38e445b0bb0eef');g.touristBodyFrames='<U02_BODY_FRAMES>';return JSON.stringify(copy)};
check(normalizeScene(scene)===normalizeScene(backupScene),'Scene contains changes outside touristBodyFrames relative to v0.3 recovery snapshot');
const sourceById=new Map(sourceFrames.frames.map(x=>[x.frameId,x]));
const sourceMountById=new Map(sourceMounts.frames.map(x=>[x.frameId,x]));
const runtimeMountById=new Map(runtimeMounts.frames.map(x=>[x.frameId,x]));
const bodyMap=new Map(map.assets.filter(x=>x.kind==='body_frame').map(x=>[x.stableId,x]));
const accessoryRows=map.assets.filter(x=>x.kind==='accessory_slice').map(x=>({
 stableId:x.stableId,category:x.category,clientPath:x.clientPath,clientSha256:x.clientSha256,
 spriteFrameUuid:x.spriteFrameUuid,creatorStatus:x.creatorStatus,
 sceneSpriteFrameUuid:gallery.touristAccessoryFrames[map.assets.filter(y=>y.kind==='accessory_slice').indexOf(x)]?.__uuid__??null,
}));
const frameIds=new Set(), spriteUuids=new Set();
let affineMatrices=0, maxAffineError=0, totalSourceBytes=0, actionCounts={walk:0,run:0,happy:0,sad:0};
for(let i=0;i<40;i++){
 const f=runtimeFrames.frames[i];const sf=sourceById.get(f.frameId);const sm=sourceMountById.get(f.frameId);const m=runtimeMountById.get(f.frameId);const row=bodyMap.get(f.frameId);
 check(!!sf&&!!sm&&!!m&&!!row,`missing manifest/mount/map join: ${f?.frameId}`);
 if(!f||!sf||!sm||!m||!row)continue;
 check(!frameIds.has(f.frameId),`duplicate frameId ${f.frameId}`);frameIds.add(f.frameId);
 check(f.action===sf.action&&f.index===sf.index&&f.sha256===sf.sha256&&m.sha256===sf.sha256,`source/frame/mount identity mismatch ${f.frameId}`);
 const imagePath=path.join(clientRoot,f.file);const png=read(imagePath);check(sha(png)===sf.sha256,`client PNG hash mismatch ${f.frameId}`);check(png.length===sf.bytes,`client PNG byte count mismatch ${f.frameId}`);totalSourceBytes+=png.length;
 check(f.playback==='loop'&&m.playback==='loop'&&sm.playback==='loop',`non-loop playback ${f.frameId}`);
 check(f.durationMs===sm.durationMs&&m.durationMs===sm.durationMs&&f.durationFractionMs[0]===sm.durationFractionMs[0]&&f.durationFractionMs[1]===sm.durationFractionMs[1],`duration mismatch ${f.frameId}`);
 check(m.foot.x===256&&m.foot.y===440&&sm.foot.x===256&&sm.foot.y===440,`fixed foot changed ${f.frameId}`);
 check(row.clientSha256===sha(png)&&row.artSha256===sf.sha256,`asset registry hash mismatch ${f.frameId}`);
 check(row.spriteFrameUuid===gallery.touristBodyFrames[i].__uuid__,`Scene UUID order mismatch ${f.frameId}`);
 check(row.spriteFrameUuid===json(`${clientRoot}/${f.file}.meta`).subMetas.f9941.uuid,`SpriteFrame meta UUID mismatch ${f.frameId}`);
 check(!spriteUuids.has(row.spriteFrameUuid),`duplicate SpriteFrame UUID ${row.spriteFrameUuid}`);spriteUuids.add(row.spriteFrameUuid);
 actionCounts[f.action]=(actionCounts[f.action]||0)+1;
 for(const key of ['head','face','wristNear','wristFar']){
  const mat=m.mounts[key].localAffine;const [a,bDown,c,d]=mat;const b=-bDown,cu=-c;const det=a*d-cu*b;const sx=Math.hypot(a,b);
  check(Number.isFinite(det)&&Math.abs(det)>1e-5,`invalid determinant ${f.frameId}/${key}`);
  const sy=det/sx;const theta=Math.atan2(b,a);const shear=(a*cu+b*d)/(sx*sx);const co=Math.cos(theta),si=Math.sin(theta);
  const rebuilt=[co*sx,si*sx,co*sx*shear-si*sy,si*sx*shear+co*sy];
  const expected=[a,b,cu,d];
  const err=Math.max(...expected.map((v,j)=>Math.abs(v-rebuilt[j])));maxAffineError=Math.max(maxAffineError,err);affineMatrices++;
  check(err<2e-6,`UISkew affine decomposition error ${f.frameId}/${key}=${err}`);
 }
}
for(const action of Object.keys(actionCounts))check(actionCounts[action]===10,`${action} does not have 10 frames`);
for(let i=0;i<10;i++){const w=runtimeFrames.frames.find(x=>x.action==='walk'&&x.index===i);const r=runtimeFrames.frames.find(x=>x.action==='run'&&x.index===i);check(w?.sha256===r?.sha256,`walk/run poses differ at ${i}`);check(!!w&&!!r&&Math.abs(w.durationMs/r.durationMs-2)<1e-12,`run not exactly 2x walk speed at ${i}`)}
check(map.assets.filter(x=>x.kind==='body_frame').length===40,'asset map body row count mismatch');
check(map.assets.filter(x=>x.kind==='accessory_slice').length===4,'asset map accessory slice row count mismatch');
 for(let i=0;i<accessoryRows.length;i++)check(accessoryRows[i].spriteFrameUuid===accessoryRows[i].sceneSpriteFrameUuid,`accessory Scene UUID mismatch ${accessoryRows[i].stableId}`);
check(accessory.items.length===3,'expected three independent accessory categories');
check(engineConfig.cache['ui-skew']._value===true&&engineConfig.includeModules.includes('ui-skew'),'UISkew runtime module is not enabled');
const statuses=map.assets.filter(x=>x.kind==='body_frame').reduce((o,x)=>(o[x.creatorStatus]=(o[x.creatorStatus]||0)+1,o),{});
const result={
 taskId:'U02-TOURIST-CLIENT-INTEGRATION-001',version:'v0.3',auditType:'STATIC_SOURCE_AND_BINDING',status:errors.length?'FAIL':'PASS',
 gate2:{status:approval.status,version:approval.version,artifact:'deliverables/vfx/U02-TOURIST-VFX-FRAMES-001/v0.2/preview/recomposition.png',sha256:sha(read(`${vfxRoot}/preview/recomposition.png`))},
 frames:{total:runtimeFrames.frames.length,actions:actionCounts,sourcePngBytes:totalSourceBytes,sourceMountRows:sourceMounts.frames.length,affineMatricesRecomputed:affineMatrices,maxAbsoluteMatrixError:maxAffineError,foot:{x:256,y:440},allPlayback:'loop',runSpeedRatio:2},
 binding:{assetMapBodyRows:map.assets.filter(x=>x.kind==='body_frame').length,accessorySlices:map.assets.filter(x=>x.kind==='accessory_slice').length,bodySpriteFrameUuids:spriteUuids.size,creatorMetaStates:statuses,sceneBodyFrameRefs:gallery.touristBodyFrames.length,sceneShopPrefabRefs:gallery.shopPrefabs.length,sceneOtherFieldsMatchRecoverySnapshot:true,engineModule:{uiSkewEnabled:engineConfig.cache['ui-skew']._value,included:engineConfig.includeModules.includes('ui-skew')}},
 baseline:{sceneRecoverySnapshot:'deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/evidence/old-client-frame-backup/UnitSamples.scene',sceneRecoverySha256:sha(read('deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/evidence/old-client-frame-backup/UnitSamples.scene')),scenePreBindSha256:'da43667ff3760b63d4cf7a193a48be6536bcdc4f646cd05336e7e7c937077c72',sceneFinalSha256:sha(read('apps/client/assets/UnitSamples.scene')),oldRuntimeAssetMapSha256:sha(read('deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/evidence/old-client-frame-backup/ug_ghost_01_asset_map.json'))},
 errors,
 creatorImport:priorAudit.creatorImport==='IMPORTED_LIBRARY_VERIFIED'?'IMPORTED_LIBRARY_VERIFIED':'NOT_VERIFIED',creatorBuild:priorAudit.creatorBuild==='BUILT'?'BUILT':'BLOCKED_ENVIRONMENT',webRuntime:priorAudit.runtimeAnimation==='PASS'?'PASS':'NOT_TESTED',visualViewportAndHappy03:'STATIC_NO_STAGE_MASK; RUNTIME_NOT_TESTED',performance:'NOT_TESTED',
 creatorImportAudit:priorAudit.staticAudit?.creatorImportAudit??null,
};
const auditPath='deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/RESOURCE_AND_FRAME_AUDIT.json';
 const audit=json(auditPath);
audit.staticAudit=result;
audit.scene={path:'apps/client/assets/UnitSamples.scene',sha256BeforeIntegration:result.baseline.scenePreBindSha256,sha256AfterIntegration:result.baseline.sceneFinalSha256,preservedU03ShopPrefabRefs:true,bodyFrameRefCount:40,onlySerializedFieldChanged:'touristBodyFrames'};
 audit.accessories=accessoryRows;
 audit.jsonAssetUuids={frameManifest:gallery.touristFrameManifest.__uuid__,mounts:gallery.touristMountManifest.__uuid__,accessories:gallery.touristAccessoryManifest.__uuid__};
audit.creatorImport=result.creatorImport;
audit.creatorBuild=result.creatorBuild==='BUILT'?'BUILT':'BLOCKED_ENVIRONMENT_EPERM_ENGINE_PLUGIN';
audit.runtimeAnimation='NOT_TESTED';audit.runtimeMountAndMirror='NOT_TESTED';audit.webPerformance='NOT_TESTED';
fs.writeFileSync(path.join(root,auditPath),JSON.stringify(audit,null,2)+'\n');
console.log(JSON.stringify(result,null,2));if(errors.length)process.exit(1);

