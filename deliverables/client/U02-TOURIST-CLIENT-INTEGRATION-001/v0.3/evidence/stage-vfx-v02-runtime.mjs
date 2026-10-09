import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const repo = path.resolve(import.meta.dirname, '../../../../..');
const vfx = path.join(repo, 'deliverables/vfx/U02-TOURIST-VFX-FRAMES-001/v0.2');
const client = path.join(repo, 'apps/client/assets/units/ghost-customer');
const approvalPath = path.join(repo, 'tasks/U02-TOURIST-VFX-FRAMES-001/ARTIFACT_APPROVAL.json');
const approval = JSON.parse(fs.readFileSync(approvalPath, 'utf8'));
const frameSource = path.join(vfx, 'frames/FRAME_MANIFEST.json');
const mountSource = path.join(vfx, 'mounts/FRAME_MOUNT_MANIFEST.json');
const sourceFrames = JSON.parse(fs.readFileSync(frameSource, 'utf8'));
const sourceMounts = JSON.parse(fs.readFileSync(mountSource, 'utf8'));
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const hashFile = (file) => sha(fs.readFileSync(file));
const requireThat = (condition, message) => { if (!condition) throw new Error(message); };

requireThat(approval.status === 'USER_APPROVED', 'VFX v0.2 Gate2 is not USER_APPROVED');
requireThat(approval.version === 'v0.2', 'Unexpected approval version');
requireThat(approval.artifact === 'deliverables/vfx/U02-TOURIST-VFX-FRAMES-001/v0.2/preview/recomposition.png',
  'Approval object does not identify the expected VFX v0.2 recomposition');
requireThat(sourceFrames.schemaVersion === 2 && sourceMounts.schemaVersion === 2,
  'Expected schemaVersion 2 source manifests');
requireThat(sourceFrames.frameCount === 40 && sourceFrames.frames.length === 40
  && sourceMounts.frameCount === 40 && sourceMounts.frames.length === 40,
  'Expected exactly 40 source and mount frames');

const sourceFrameSha = hashFile(frameSource);
const sourceMountSha = hashFile(mountSource);
const mountById = new Map(sourceMounts.frames.map((frame) => [frame.frameId, frame]));
const byAction = { walk: 0, run: 0, happy: 0, sad: 0 };
const clientFrames = [];
const auditFrames = [];

for (const frame of sourceFrames.frames) {
  requireThat(Object.hasOwn(byAction, frame.action), `Unexpected action ${frame.action}`);
  byAction[frame.action]++;
  const src = path.join(vfx, frame.file);
  const sourceBytes = fs.readFileSync(src);
  const actualSha = sha(sourceBytes);
  requireThat(actualSha === frame.sha256, `${frame.frameId} PNG SHA mismatch`);
  requireThat(sourceBytes.length === frame.bytes, `${frame.frameId} byte count mismatch`);
  const mount = mountById.get(frame.frameId);
  requireThat(!!mount, `${frame.frameId} has no mount entry`);
  requireThat(mount.sha256 === frame.sha256 && mount.durationMs === frame.durationMs,
    `${frame.frameId} source and mount metadata disagree`);
  requireThat(mount.foot.x === 256 && mount.foot.y === 440,
    `${frame.frameId} violates the fixed logic foot contract`);
  requireThat(Array.isArray(mount.mounts?.head?.localAffine)
    && Array.isArray(mount.mounts?.face?.localAffine)
    && Array.isArray(mount.mounts?.wristNear?.localAffine)
    && Array.isArray(mount.mounts?.wristFar?.localAffine),
  `${frame.frameId} is missing affine mount data`);

  const clientFile = `tex_${path.basename(frame.file)}`;
  fs.copyFileSync(src, path.join(client, 'frames', clientFile));
  clientFrames.push({
    frameId: frame.frameId,
    action: frame.action,
    index: frame.index,
    durationMs: frame.durationMs,
    durationFractionMs: frame.durationFractionMs,
    playback: mount.playback,
    file: `frames/${clientFile}`,
    sourceFile: frame.file,
    sha256: frame.sha256,
    pixelSha256: frame.pixelSha256,
  });
  auditFrames.push({
    frameId: frame.frameId,
    action: frame.action,
    index: frame.index,
    durationMs: frame.durationMs,
    durationFractionMs: frame.durationFractionMs,
    playback: mount.playback,
    artPath: `deliverables/vfx/U02-TOURIST-VFX-FRAMES-001/v0.2/${frame.file}`,
    artSha256: frame.sha256,
    artBytes: sourceBytes.length,
    clientPath: `apps/client/assets/units/ghost-customer/frames/${clientFile}`,
    clientSha256: hashFile(path.join(client, 'frames', clientFile)),
    spriteFrameUuid: null,
    creatorImportStatus: 'PENDING_CREATOR_IMPORT',
    mountFrameId: mount.frameId,
    foot: mount.foot,
    mounts: mount.mounts,
    occlusion: mount.occlusion,
    visualFoot: mount.visualFoot,
  });
}

for (const [action, expected] of Object.entries({ walk: 10, run: 10, happy: 10, sad: 10 })) {
  requireThat(byAction[action] === expected, `${action} must contain ${expected} frames`);
}
requireThat(sourceMounts.frames.every((frame) => sourceFrames.frames.some((item) => item.frameId === frame.frameId)),
  'Mount manifest contains an unbound frame');

const runtimeFrameManifest = {
  schemaVersion: 2,
  batch: sourceFrames.batch,
  bodyAssetId: sourceFrames.bodyAssetId,
  version: sourceFrames.version,
  approval: 'USER_APPROVED',
  approvalRef: 'tasks/U02-TOURIST-VFX-FRAMES-001/ARTIFACT_APPROVAL.json',
  sourceManifestPath: 'deliverables/vfx/U02-TOURIST-VFX-FRAMES-001/v0.2/frames/FRAME_MANIFEST.json',
  sourceManifestSha256: sourceFrameSha,
  initial: sourceFrames.initial,
  frameCount: sourceFrames.frameCount,
  actions: sourceFrames.actions,
  frames: clientFrames,
};
const runtimeMountManifest = {
  ...sourceMounts,
  sourceManifestPath: 'deliverables/vfx/U02-TOURIST-VFX-FRAMES-001/v0.2/mounts/FRAME_MOUNT_MANIFEST.json',
  sourceManifestSha256: sourceMountSha,
  frames: sourceMounts.frames.map((frame) => ({
    ...frame,
    sourceFile: frame.file,
    file: `frames/tex_${path.basename(frame.file)}`,
  })),
};
fs.writeFileSync(path.join(client, 'frames/ug_ghost_01_frame_manifest.json'),
  `${JSON.stringify(runtimeFrameManifest, null, 2)}\n`);
fs.writeFileSync(path.join(client, 'data/ug_ghost_01_mounts.json'),
  `${JSON.stringify(runtimeMountManifest, null, 2)}\n`);

const audit = {
  taskId: 'U02-TOURIST-CLIENT-INTEGRATION-001',
  version: 'v0.3',
  vfxVersion: 'U02-VFX-A/v0.2',
  gate2Status: approval.status,
  approvedArtifact: approval.artifact,
  approvedArtifactSha256: hashFile(path.join(repo, approval.artifact)),
  sourceFrameManifestPath: path.relative(repo, frameSource).replaceAll('\\', '/'),
  sourceFrameManifestSha256: sourceFrameSha,
  sourceMountManifestPath: path.relative(repo, mountSource).replaceAll('\\', '/'),
  sourceMountManifestSha256: sourceMountSha,
  clientRuntimeFrameManifestPath: 'apps/client/assets/units/ghost-customer/frames/ug_ghost_01_frame_manifest.json',
  clientRuntimeMountManifestPath: 'apps/client/assets/units/ghost-customer/data/ug_ghost_01_mounts.json',
  clientRuntimeFrameManifestSha256: hashFile(path.join(client, 'frames/ug_ghost_01_frame_manifest.json')),
  clientRuntimeMountManifestSha256: hashFile(path.join(client, 'data/ug_ghost_01_mounts.json')),
  sourceFrameCount: sourceFrames.frames.length,
  sourceMountCount: sourceMounts.frames.length,
  actions: byAction,
  sourcePngBytes: sourceFrames.frames.reduce((sum, frame) => sum + frame.bytes, 0),
  bodyResults: auditFrames,
  accessories: [],
  jsonAssetUuids: { frameManifest: null, mounts: null, accessories: null },
  prefab: { path: 'apps/client/assets/units/ghost-customer/UG_GHOST_01.prefab', uuid: 'e94ff176-13d1-4691-b958-61765f95cd89' },
  scene: { path: 'apps/client/assets/UnitSamples.scene', sha256BeforeIntegration: hashFile(path.join(repo, 'apps/client/assets/UnitSamples.scene')) },
  creatorImport: 'PENDING',
  runtimeAnimation: 'NOT_TESTED',
  runtimeMountAndMirror: 'NOT_TESTED',
  webPerformance: 'NOT_TESTED',
};
fs.writeFileSync(path.join(repo, 'deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/RESOURCE_AND_FRAME_AUDIT.json'),
  `${JSON.stringify(audit, null, 2)}\n`);
console.log(JSON.stringify({
  result: 'STAGED', sourceFrameCount: sourceFrames.frames.length,
  sourceMountCount: sourceMounts.frames.length, actions: byAction,
  sourceFrameManifestSha256: sourceFrameSha,
  sourceMountManifestSha256: sourceMountSha,
  clientManifestSha256: audit.clientRuntimeFrameManifestSha256,
  clientMountSha256: audit.clientRuntimeMountManifestSha256,
  pngBytes: audit.sourcePngBytes,
}, null, 2));
