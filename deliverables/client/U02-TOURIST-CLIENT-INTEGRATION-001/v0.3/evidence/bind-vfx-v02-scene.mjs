import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const repo = path.resolve(import.meta.dirname, '../../../../..');
const client = path.join(repo, 'apps/client/assets/units/ghost-customer');
const vfx = path.join(repo, 'deliverables/vfx/U02-TOURIST-VFX-FRAMES-001/v0.2');
const frameManifestPath = path.join(client, 'frames/ug_ghost_01_frame_manifest.json');
const sourceManifestPath = path.join(vfx, 'frames/FRAME_MANIFEST.json');
const approvalPath = path.join(repo, 'tasks/U02-TOURIST-VFX-FRAMES-001/ARTIFACT_APPROVAL.json');
const scenePath = path.join(repo, 'apps/client/assets/UnitSamples.scene');
const assetMapPath = path.join(client, 'data/ug_ghost_01_asset_map.json');
const registryPath = path.join(repo, 'project/ASSET_HANDOFF_REGISTRY.md');
const evidence = path.join(repo, 'deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3');
const backupDir = path.join(evidence, 'evidence/old-client-frame-backup');
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const hashFile = (p) => sha(fs.readFileSync(p));
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const ensure = (ok, msg) => { if (!ok) throw new Error(msg); };
const approval = readJson(approvalPath);
ensure(approval.status === 'USER_APPROVED' && approval.version === 'v0.2', 'Gate2 approval mismatch');
const source = readJson(sourceManifestPath);
const runtime = readJson(frameManifestPath);
ensure(source.frames.length === 40 && runtime.frames.length === 40, '40-frame manifests required');
const sceneText = fs.readFileSync(scenePath, 'utf8');
const sceneBeforeSha = sha(Buffer.from(sceneText));
if (!fs.existsSync(path.join(backupDir, 'UnitSamples.scene'))) fs.copyFileSync(scenePath, path.join(backupDir, 'UnitSamples.scene'));

// Prepare Creator image metadata for newly introduced frames. Keep the existing
// 20 imported UUIDs stable; assign new UUIDs only to the 20 added body frames.
const templateMetaPath = path.join(client, 'frames/tex_ug_ghost_01_walk_00.png.meta');
const templateMetaText = fs.readFileSync(templateMetaPath, 'utf8');
const templateMeta = JSON.parse(templateMetaText);
const existingMap = readJson(assetMapPath);
const previousBody = new Map(existingMap.assets.filter(x => x.kind === 'body_frame').map(x => [x.stableId, x]));
const originalBodyIds = new Set(readJson(path.join(backupDir, 'ug_ghost_01_asset_map.json')).assets.filter(x => x.kind === 'body_frame').map(x => x.stableId));
const idByFrame = new Map();
const rows = [];
for (const item of runtime.frames) {
  const filename = path.basename(item.file);
  const imagePath = path.join(client, item.file);
  ensure(fs.existsSync(imagePath), `Client PNG missing: ${item.file}`);
  const prior = previousBody.get(item.frameId);
  const metaPath = `${imagePath}.meta`;
  let mainUuid;
  let creatorStatus;
  if (prior) {
    mainUuid = prior.imageMainUuid;
    const meta = readJson(metaPath);
    ensure(meta.uuid === mainUuid, `existing meta UUID mismatch ${filename}`);
    creatorStatus = originalBodyIds.has(item.frameId) ? 'EXISTING_UUID_PRESERVED_IMPORT_PENDING_RECHECK' : 'META_PREPARED_IMPORT_PENDING';
  } else {
    ensure(!fs.existsSync(metaPath), `unexpected meta already exists for ${filename}`);
    mainUuid = crypto.randomUUID();
    const key = JSON.parse(templateMetaText).uuid;
    const meta = JSON.parse(templateMetaText.replaceAll(key, mainUuid));
    meta.subMetas['6c48a'].displayName = path.parse(filename).name;
    meta.subMetas['f9941'].displayName = path.parse(filename).name;
    meta.userData.redirect = `${mainUuid}@6c48a`;
    fs.writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`);
    creatorStatus = 'META_PREPARED_IMPORT_PENDING';
  }
  const spriteFrameUuid = `${mainUuid}@f9941`;
  idByFrame.set(item.frameId, spriteFrameUuid);
  const sourceItem = source.frames.find(x => x.frameId === item.frameId);
  ensure(sourceItem && hashFile(imagePath) === sourceItem.sha256, `PNG hash mismatch ${filename}`);
  rows.push({
    stableId: item.frameId, kind: 'body_frame', action: item.action, index: item.index,
    purpose: `${item.action} 第 ${item.index} 帧无装扮主体`,
    artPath: `deliverables/vfx/U02-TOURIST-VFX-FRAMES-001/v0.2/${sourceItem.file}`,
    artSha256: sourceItem.sha256, artBytes: sourceItem.bytes,
    clientPath: `apps/client/assets/units/ghost-customer/${item.file}`,
    clientSha256: hashFile(imagePath), canvas: { width: 512, height: 512 },
    durationMs: item.durationMs, durationFractionMs: item.durationFractionMs,
    playback: item.playback, imageMainUuid: mainUuid,
    texture2dUuid: `${mainUuid}@6c48a`, spriteFrameUuid,
    creatorStatus, metaPath: `apps/client/assets/units/ghost-customer/${item.file}.meta`,
    sourceManifest: 'deliverables/vfx/U02-TOURIST-VFX-FRAMES-001/v0.2/frames/FRAME_MANIFEST.json',
    gate2Approval: 'tasks/U02-TOURIST-VFX-FRAMES-001/ARTIFACT_APPROVAL.json',
  });
}
const accessoryRows = existingMap.assets.filter(x => x.kind === 'accessory_slice');
const nextMap = {
  ...existingMap,
  schemaVersion: 2,
  artVersion: 'U02-VFX-A/v0.2',
  batch: 'U02-VFX-A/v0.2',
  gate2Approval: 'tasks/U02-TOURIST-VFX-FRAMES-001/ARTIFACT_APPROVAL.json',
  approvedRecompositionSha256: '4a76eaeb64270be2914c41e0ca648a38e2dd4542696d3ead4d363edce76c027a',
  frameManifestSha256: hashFile(sourceManifestPath),
  frameCount: 40,
  actions: source.actions,
  assets: [...rows, ...accessoryRows],
  data: existingMap.data.map(row => {
    if (row.kind === 'frame_manifest') return {
      ...row, artPath: 'deliverables/vfx/U02-TOURIST-VFX-FRAMES-001/v0.2/frames/FRAME_MANIFEST.json',
      artSha256: hashFile(sourceManifestPath), clientSha256: hashFile(frameManifestPath),
      creatorStatus: 'EXISTING_JSON_ASSET_UUID_PRESERVED_IMPORT_PENDING_RECHECK',
    };
    if (row.kind === 'mount_manifest') return {
      ...row, artPath: 'deliverables/vfx/U02-TOURIST-VFX-FRAMES-001/v0.2/mounts/FRAME_MOUNT_MANIFEST.json',
      artSha256: hashFile(path.join(vfx, 'mounts/FRAME_MOUNT_MANIFEST.json')),
      clientSha256: hashFile(path.join(client, 'data/ug_ghost_01_mounts.json')),
      creatorStatus: 'EXISTING_JSON_ASSET_UUID_PRESERVED_IMPORT_PENDING_RECHECK',
    };
    return row;
  }),
  supersedes: { priorClientAssetMapVersion: 'U02-TOURIST-CLIENT-ASSET-001/v0.1', reason: '40-frame U02 VFX v0.2 Gate2-approved runtime binding' },
};
fs.writeFileSync(assetMapPath, `${JSON.stringify(nextMap, null, 2)}\n`);

// Replace exactly the serialized touristBodyFrames array; all other Scene bytes
// remain identical so current U03 shop prefab and unrelated Scene data survive.
const marker = '"touristBodyFrames":';
const markerAt = sceneText.indexOf(marker);
ensure(markerAt >= 0 && sceneText.indexOf(marker, markerAt + marker.length) < 0, 'unique touristBodyFrames property required');
const openAt = sceneText.indexOf('[', markerAt + marker.length);
ensure(openAt >= 0, 'touristBodyFrames array start missing');
let depth = 0, inString = false, escaped = false, closeAt = -1;
for (let i = openAt; i < sceneText.length; i++) {
  const ch = sceneText[i];
  if (inString) {
    if (escaped) escaped = false;
    else if (ch === '\\') escaped = true;
    else if (ch === '"') inString = false;
    continue;
  }
  if (ch === '"') inString = true;
  else if (ch === '[') depth++;
  else if (ch === ']' && --depth === 0) { closeAt = i; break; }
}
ensure(closeAt >= 0, 'touristBodyFrames array end missing');
const sceneRefs = runtime.frames.map(item => ({ __uuid__: idByFrame.get(item.frameId), __expectedType__: 'cc.SpriteFrame' }));
const nextArray = JSON.stringify(sceneRefs, null, 2).replaceAll('\n', '\n    ');
const nextSceneText = sceneText.slice(0, openAt) + nextArray + sceneText.slice(closeAt + 1);
const parsedScene = JSON.parse(nextSceneText);
const gallery = parsedScene.find(x => x._id === 'ef8c639a38e445b0bb0eef');
ensure(gallery && gallery.touristBodyFrames.length === 40, 'Scene gallery 40 refs missing');
ensure(gallery.touristPrefab.__uuid__ === 'e94ff176-13d1-4691-b958-61765f95cd89', 'U02 prefab identity changed');
ensure(gallery.streetBasePrefab.__uuid__ === '2d697fb3-01f0-4330-a180-a9c162310bf8', 'U03 street prefab identity changed');
ensure(gallery.touristAccessoryFrames.length === 4 && gallery.shopPrefabs.length === 6, 'U03/accessory arrays changed');
const normalize = text => {
  const parsed = JSON.parse(text);
  const c = parsed.find(x => x._id === 'ef8c639a38e445b0bb0eef');
  c.touristBodyFrames = '<U02_BODY_FRAMES>';
  return JSON.stringify(parsed);
};
ensure(normalize(sceneText) === normalize(nextSceneText), 'Scene changes extend beyond touristBodyFrames');
fs.writeFileSync(scenePath, nextSceneText);

// Append current VFX v0.2 resource identity rows; older provenance remains intact.
let registry = fs.readFileSync(registryPath, 'utf8');
const header = '## U02 VFX v0.2 Gate2 正式接入（Client v0.3）';
if (!registry.includes(header)) {
  const lines = rows.map(r => `| \`${r.stableId}\` | \`${r.artPath}\` | \`${r.artSha256}\` | \`${r.clientPath}\` | \`${r.spriteFrameUuid}\` | ${r.creatorStatus} |`).join('\n');
  registry += ["", "", header, "", "来源：VFX v0.2 Gate2 用户批准；重组 SHA-256 4a76eaeb64270be2914c41e0ca648a38e2dd4542696d3ead4d363edce76c027a。Client 工程 PNG 与 VFX 源图逐帧 SHA-256 一致。新增 SpriteFrame UUID 根据稳定 meta 文件写入，Creator AssetDB/Library/导入及运行状态待当前 Editor 重导与实测确认；本表中的 META_PREPARED_IMPORT_PENDING 不表示 Creator 已导入。附件 4 个 slice 资源及 UUID 沿用旧版，不与主体帧合并。", "", "| 稳定资产 ID | VFX 美术路径 | VFX SHA-256 | Client 正式路径 | SpriteFrame UUID | Creator 导入状态 |", "|---|---|---|---|---|---|", lines, ""].join("\n");
  fs.writeFileSync(registryPath, registry);
}
const auditPath = path.join(evidence, 'RESOURCE_AND_FRAME_AUDIT.json');
const audit = readJson(auditPath);
audit.scene = { path: 'apps/client/assets/UnitSamples.scene', sha256BeforeIntegration: sceneBeforeSha, sha256AfterIntegration: hashFile(scenePath), preservedU03ShopPrefabRefs: true, bodyFrameRefCount: 40 };
audit.bodyResults = audit.bodyResults.map(item => ({
  ...item, spriteFrameUuid: idByFrame.get(item.frameId),
  creatorImportStatus: rows.find(r => r.stableId === item.frameId)?.creatorStatus ?? 'MISSING_ASSET_MAP_ROW',
}));
audit.creatorImport = 'METADATA_PREPARED_PENDING_CREATOR_ASSETDB_IMPORT';
fs.writeFileSync(auditPath, `${JSON.stringify(audit, null, 2)}\n`);
console.log(JSON.stringify({result:'BOUND', bodyFrames:40, newMetas:rows.filter(r=>r.creatorStatus==='META_PREPARED_IMPORT_PENDING').length, stableMetas:rows.length - rows.filter(r=>r.creatorStatus==='META_PREPARED_IMPORT_PENDING').length, sceneBeforeSha, sceneAfterSha:hashFile(scenePath), sceneOnlyBodyRefArrayChanged:true, shopPrefabs:gallery.shopPrefabs.length, mapRows:rows.length + accessoryRows.length}, null, 2));





