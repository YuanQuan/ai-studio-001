#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '../../../../');
const FREEZE_PATH = 'deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/RESOURCE_STAGING_INPUT_FREEZE.json';
const FREEZE_ADDENDUM_PATH = 'deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/RESOURCE_STAGING_INPUT_FREEZE_ADDENDUM.json';
const MAP_PATH = 'deliverables/tech_lead/MINIGAME-ART-OPT-IMPORT-TECH-20261017/v0.1/APPROVED_ASSET_HANDOFF_MAP.json';
const BUNDLE_PATH = 'deliverables/tech_lead/MINIGAME-ART-OPT-IMPORT-TECH-20261017/v0.1/BUNDLE_REFERENCE_MAP.json';
const GENERATED_PATH = 'deliverables/client/MINIGAME-ART-OPT-INTEGRATE-CLIENT-20261017/v0.1/GENERATED_ASSET_MANIFEST.json';
const OWNER_OVERRIDES_PATH = 'deliverables/client/MINIGAME-ART-OPT-INTEGRATE-CLIENT-20261017/v0.1/OWNER_SOURCE_OVERRIDES.json';
const APPROVED_PNG_OVERRIDES_PATH = 'apps/client/tools/asset-integration/approved_png_overrides.json';
const APPROVED_PNG_IDENTITY_PATH = 'deliverables/art/MINIGAME-ART-OPT-NEXT-20261017-ART-SAMPLES/v0.1/FILE_IDENTITY.json';
const APPROVED_PNG_IDENTITY_SHA256 = '19e840c2bbe61ba51e6bf56d484edf603367b1f9a03c0972efc90bf18ba148db';
const APPROVED_PNG_AUTH_PATH = 'deliverables/master/MINIGAME-ART-OPT-PNG-20261017/v0.1/USER_AUTHORIZATION.json';
const APPROVED_PNG_AUTH_SHA256 = '5f27b54ac2921a85875fd147311dbb276deaf82dd50834a228039662b9e63793';
const APPROVED_PNG_BASE_STAGE_SHA256 = '70c96497fc5e410ba4f49a9790ac8ae6a63bc2b602523c1da87c899570f56bcc';
const APPROVED_PNG_BASE_STAGE_PAYLOAD_PATH = 'apps/client/tools/asset-integration/approved_png_base_payload.json';
const APPROVED_PNG_BASE_STAGE_PAYLOAD_SHA256 = '7f3bf66203ff90cf92233a3188f14e508c2dda4b3053d0b7eb19db7240d9f114';
const APPROVED_TEXT_PATCH_AUTH_PATH = 'deliverables/master/MINIGAME-ART-OPT-PNG-20261017/v0.1/FONT_PUNCTUATION_FIX_AUTHORIZATION.json';
const APPROVED_TEXT_PATCH_AUTH_SHA256 = '6940d03a9ba8055899abbc907a59d1e8b68166993520252a08a780dd00073c89';
const PORTABLE_INPUT_AUTHORIZATION = 'deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/portable-inputs/PORTABLE_INPUT_RECOVERY_AUTHORIZATION.json';
const PORTABLE_INPUT_AUTHORIZATION_SHA256 = '76a6c02f6eb60736d1f921a400e7c1e76ce1c43c4374eaf3cee4fc0262ecd334';
const PORTABLE_RECOVERY_EXPECTATIONS = [
  { path: 'apps/client/assets/labs/u01/sakura_v03_layout.ts', sha256: '909978eaa52cd53461ebd9edf16efb0850b6d78d7cd714d3c018bb02f3021e82',
    snapshot: 'deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/portable-inputs/sakura_v03_layout.ts',
    bytes: 28061, headSha256: '3153795d853948ea3a97a98ba59608c5abdee9ad0b6cde926e682ae777f50bb8' },
  { path: 'apps/client/package.json', sha256: '3382ee4d451fe205b37501db2fc4b4d0735c2cc9fc5b783cc3abf447d5e21b2a',
    snapshot: 'deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/portable-inputs/package.json',
    bytes: 157, headSha256: 'ae7329118191bf64a9f2bc747e300a72e98c0e1850376ea6628594412467f1b3' },
  { path: 'apps/client/assets/resources/sakura_v03/tex_sakura_rr_bridge_front_l.png', sha256: '39bb2ef51072ee99aac4edd0b04728f75420e9087bb732c27c64e7eafddc6c29',
    snapshot: 'deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/portable-inputs/tex_sakura_rr_bridge_front_l.png',
    bytes: 51230, headSha256: '36cf1106837bd6fa760c471df484de07c1997fa75de268878e2a09174a3d2277' },
  { path: 'apps/client/assets/resources/sakura_v03/tex_sakura_rr_bridge_front_r.png', sha256: '854d855ac88d3030078ae7c25b34a0406d9087c99ca5f73f4a1ae851ee846a26',
    snapshot: 'deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/portable-inputs/tex_sakura_rr_bridge_front_r.png',
    bytes: 51955, headSha256: 'cf4d30b9a036cd5627dc015dab756e78a10952e684c98cd7afc6a21473fe0204' },
];
const EDITOR_BUNDLE_SETTINGS = 'deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/editor-bundle-probe/CREATOR_EXPORTED_BUILDER_SETTINGS.json';
const EDITOR_BUNDLE_SETTINGS_SHA256 = '252823ccfc1ddc591d264b636ca7da33be088bf181769bb918969708325c89c9';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const uuidFrom = seed => {
  const hex = crypto.createHash('sha256').update(seed).digest('hex').slice(0, 32).split('');
  hex[12] = '5'; hex[16] = ((parseInt(hex[16], 16) & 3) | 8).toString(16);
  return `${hex.slice(0,8).join('')}-${hex.slice(8,12).join('')}-${hex.slice(12,16).join('')}-${hex.slice(16,20).join('')}-${hex.slice(20,32).join('')}`;
};
const readJson = rel => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const mkdirParent = p => fs.mkdirSync(path.dirname(p), { recursive: true });

function isPortableInputExcluded(sourcePath) {
  return sourcePath === '.DS_Store' || sourcePath.endsWith('/.DS_Store')
    || sourcePath.startsWith('apps/client/profiles/');
}

function pngDimensions(bytes) {
  if (bytes.length < 24 || bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a'
    || bytes.subarray(12, 16).toString('ascii') !== 'IHDR') return null;
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
}

function loadApprovedPngOverrides(overridePath, rows, appRoot, sourceRoot, contentRoot = ROOT) {
  if (!overridePath) return [];
  const data = JSON.parse(fs.readFileSync(overridePath, 'utf8'));
  const required = new Map([
    ['tex_sakura_rr_sky_r', { stagePath: 'assets/bundles/world/sakura_v03/tex_sakura_rr_sky_r.png', clientPath: 'apps/client/assets/resources/sakura_v03/tex_sakura_rr_sky_r.png' }],
    ['tex_u03_shop_05_sign', { stagePath: 'assets/bundles/shops/lantern/textures/tex_u03_shop_05_sign.png', clientPath: 'apps/client/assets/units/shops/lantern/textures/tex_u03_shop_05_sign.png' }],
    ['UG_GHOST_01_HAPPY_00', { stagePath: 'assets/bundles/tourist/ghost-customer/frames/tex_ug_ghost_01_happy_00.png', clientPath: 'apps/client/assets/units/ghost-customer/frames/tex_ug_ghost_01_happy_00.png' }],
    ['tex_u04_at_s3_base', { stagePath: 'assets/units/dialogue/portraits/tex_u04_at_s3_base.png', clientPath: 'apps/client/assets/units/dialogue/portraits/tex_u04_at_s3_base.png' }],
    ['tex_u03_shop_05_body', { stagePath: 'assets/bundles/shops/lantern/textures/tex_u03_shop_05_body.png', clientPath: 'apps/client/assets/units/shops/lantern/textures/tex_u03_shop_05_body.png' }],
    ['U05_ART_FONT', { stagePath: 'assets/bundles/milk_tea/u05_milk_tea/u05_b/U05_ART_FONT.png', clientPath: 'apps/client/assets/resources/u05_milk_tea/u05_b/U05_ART_FONT.png' }],
  ]);
  const entries = data.assets;
  if (data.schemaVersion !== 1 || data.taskId !== 'MINIGAME-ART-OPT-PNG-20261017-CLIENT'
    || data.sourceIdentityPath !== APPROVED_PNG_IDENTITY_PATH || data.sourceIdentitySha256 !== APPROVED_PNG_IDENTITY_SHA256
    || data.artIdentitySha256 !== APPROVED_PNG_IDENTITY_SHA256
    || data.authorizationPath !== APPROVED_PNG_AUTH_PATH || data.authorizationSha256 !== APPROVED_PNG_AUTH_SHA256
    || !Array.isArray(entries) || entries.length !== required.size) {
    throw new Error('正式PNG override清单必须是本Task的精确六项');
  }
  const identityBytes = fs.readFileSync(path.join(contentRoot, APPROVED_PNG_IDENTITY_PATH));
  const authorizationBytes = fs.readFileSync(path.join(contentRoot, APPROVED_PNG_AUTH_PATH));
  if (sha(identityBytes) !== APPROVED_PNG_IDENTITY_SHA256 || sha(authorizationBytes) !== APPROVED_PNG_AUTH_SHA256) {
    throw new Error('PNG override审批身份文件SHA不匹配');
  }
  const identity = JSON.parse(identityBytes.toString('utf8'));
  const approved = new Map(identity.assets.map(asset => [asset.id, asset]));
  if (identity.gate1 !== 'USER_APPROVED' || approved.size !== required.size) throw new Error('Art样本身份未获准确Gate1批准或资产数量不符');
  const authorization = JSON.parse(authorizationBytes.toString('utf8'));
  if (!authorization.decisions?.some(text => text.includes('六PNG候选批'))
    || !authorization.decisions?.some(text => text.includes('WebP不采用'))) throw new Error('六PNG用户授权内容不匹配');
  const seenIds = new Set(), seenPaths = new Set();
  for (const entry of entries) {
    const expected = required.get(entry.stableAssetId);
    if (!expected || entry.stagePath !== expected.stagePath || entry.clientPath !== expected.clientPath || seenIds.has(entry.stableAssetId)
      || seenPaths.has(entry.stagePath)) throw new Error(`PNG override越界、重复或stage路径不匹配：${entry.stableAssetId}`);
    seenIds.add(entry.stableAssetId); seenPaths.add(entry.stagePath);
    const approvedAsset = approved.get(entry.stableAssetId);
    const approvedCandidate = approvedAsset?.candidates?.find(candidate => candidate.kind === 'png_lossless');
    if (!approvedAsset || approvedAsset.source.sha256 !== entry.sourceSha256
      || approvedAsset.source.path !== entry.sourcePath || approvedAsset.original_client_path !== entry.clientPath
      || approvedAsset.original_client_uuid !== entry.imageUuid
      || approvedAsset.reference.path !== entry.referencePath || approvedCandidate?.path !== entry.candidatePath
      || approvedCandidate?.sha256 !== entry.candidateSha256 || approvedAsset.source.dimensions?.join('x') !== entry.dimensions.join('x')
      || JSON.stringify(approvedAsset.original_geometry) !== JSON.stringify(entry.geometry)) {
      throw new Error(`PNG override与获批Art FILE_IDENTITY绑定不匹配：${entry.stableAssetId}`);
    }
    const sampleRoot = `deliverables/art/MINIGAME-ART-OPT-NEXT-20261017-ART-SAMPLES/v0.1/samples/${entry.stableAssetId}/`;
    if (entry.referencePath !== `${sampleRoot}reference.png` || entry.candidatePath !== `${sampleRoot}png_lossless.png`
      || entry.metaPath !== `${entry.clientPath}.meta`) throw new Error(`PNG override候选/元数据路径不属于已批准资产：${entry.stableAssetId}`);
    if (!/^[a-f0-9]{64}$/.test(entry.candidateSha256) || !/^[a-f0-9]{64}$/.test(entry.sourceSha256)
      || !/^[a-f0-9]{64}$/.test(entry.metaSha256) || !Array.isArray(entry.dimensions) || entry.dimensions.length !== 2) throw new Error(`PNG override身份字段无效：${entry.stableAssetId}`);
    const row = rows.find(item => item.stableAssetId === entry.stableAssetId);
    if (row && row.approvedSha256 !== entry.sourceSha256) throw new Error(`PNG override源SHA与正式生成表不一致：${entry.stableAssetId}`);
    const reference = fs.readFileSync(path.join(contentRoot, entry.referencePath));
    const candidate = fs.readFileSync(path.join(contentRoot, entry.candidatePath));
    const clientMetaPath = path.join(sourceRoot, entry.metaPath);
    if (sha(fs.readFileSync(clientMetaPath)) !== entry.metaSha256) throw new Error(`PNG override源meta SHA漂移：${entry.stableAssetId}`);
    const clientMeta = JSON.parse(fs.readFileSync(clientMetaPath, 'utf8'));
    if (clientMeta.uuid !== entry.imageUuid) throw new Error(`PNG override源meta UUID不符：${entry.stableAssetId}`);
    if (sha(reference) !== entry.sourceSha256) throw new Error(`PNG override参考源SHA漂移：${entry.stableAssetId}`);
    if (sha(candidate) !== entry.candidateSha256 || candidate.length !== entry.candidateBytes) throw new Error(`PNG override候选SHA/字节数漂移：${entry.stableAssetId}`);
    const size = pngDimensions(candidate);
    if (!size || size[0] !== entry.dimensions[0] || size[1] !== entry.dimensions[1]) throw new Error(`PNG override格式或尺寸不符：${entry.stableAssetId}`);
    if (appRoot) {
      const target = path.join(appRoot, entry.stagePath), metaPath = `${target}.meta`;
      if (!fs.existsSync(target) || sha(fs.readFileSync(target)) !== entry.sourceSha256) throw new Error(`PNG override目标基础SHA不符：${entry.stableAssetId}`);
      if (!fs.existsSync(metaPath)) throw new Error(`PNG override目标meta缺失：${entry.stableAssetId}`);
      const targetMeta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      const targetFrame = Object.values(targetMeta.subMetas ?? {}).find(item => item.importer === 'sprite-frame');
      if (targetMeta.uuid !== entry.imageUuid || targetFrame?.uuid !== entry.frameUuid) throw new Error(`PNG override目标meta UUID不符：${entry.stableAssetId}`);
    }
  }
  if (seenIds.size !== required.size || [...required.keys()].some(id => !seenIds.has(id))) throw new Error('PNG override缺少稳定资产ID');
  return entries;
}

function loadApprovedTextPatches(contentRoot = ROOT) {
  const authBytes = fs.readFileSync(path.join(contentRoot, APPROVED_TEXT_PATCH_AUTH_PATH));
  if (sha(authBytes) !== APPROVED_TEXT_PATCH_AUTH_SHA256) throw new Error('正式文本patch授权SHA不匹配');
  const auth = JSON.parse(authBytes.toString('utf8'));
  if (auth.path !== 'apps/client/assets/labs/u05/milk_tea_lab.ts' || auth.exact_occurrences !== 1
    || auth.before_text !== '三杯完成！' || auth.after_text !== '三杯完成!'
    || auth.old_sha256 !== '9032ccdff921a569acb19a55de154267dede14beacafad4dcc095021fec91d6e'
    || auth.new_sha256 !== '86808200d37b4554c2e28ac33bba728232f8178cb025bc9530efa04c895a9ce5') {
    throw new Error('正式文本patch未绑定获批的U05单字符修复');
  }
  return [{ path: auth.path, beforeText: auth.before_text, afterText: auth.after_text,
    beforeSha256: auth.old_sha256, afterSha256: auth.new_sha256, authorizationPath: APPROVED_TEXT_PATCH_AUTH_PATH,
    authorizationSha256: APPROVED_TEXT_PATCH_AUTH_SHA256 }];
}

function build(stageRoot, ownerOverridesPath = OWNER_OVERRIDES_PATH, sourceRoot = ROOT, pngOverridesPath = null) {
  sourceRoot = path.resolve(sourceRoot);
  const freeze = readJson(FREEZE_PATH), addendum = readJson(FREEZE_ADDENDUM_PATH);
  const portableAuthBytes = fs.readFileSync(path.join(ROOT, PORTABLE_INPUT_AUTHORIZATION));
  if (sha(portableAuthBytes) !== PORTABLE_INPUT_AUTHORIZATION_SHA256) throw new Error('portable输入授权文件hash不匹配');
  const portableAuthorization = JSON.parse(portableAuthBytes.toString('utf8'));
  const recoveryAuthorization = portableAuthorization.recoveries ?? [];
  if (portableAuthorization.source_inventory !== FREEZE_PATH
    || recoveryAuthorization.length !== PORTABLE_RECOVERY_EXPECTATIONS.length
    || PORTABLE_RECOVERY_EXPECTATIONS.some(item => !recoveryAuthorization.some(auth =>
      auth.original_path === item.path && auth.snapshot_path === item.snapshot && auth.expected_sha256 === item.sha256
      && auth.HEAD_sha256 === item.headSha256 && auth.bytes === item.bytes && auth.original_path_commit_authorized === false))
    || portableAuthorization.excluded_nonproduction_patterns?.length !== 2
    || !portableAuthorization.excluded_nonproduction_patterns.includes('**/.DS_Store')
    || !portableAuthorization.excluded_nonproduction_patterns.includes('apps/client/profiles/**')) {
    throw new Error('portable输入授权与代码中的精确路径/hash/排除白名单不一致');
  }
  for (const item of PORTABLE_RECOVERY_EXPECTATIONS) {
    const frozen = freeze.files.find(entry => entry.path === item.path);
    const snapshot = fs.readFileSync(path.join(ROOT, item.snapshot));
    if (!frozen || frozen.sha256 !== item.sha256 || sha(snapshot) !== item.sha256 || snapshot.length !== item.bytes) {
      throw new Error(`portable冻结恢复快照校验失败：${item.path}`);
    }
  }
  const editorSettingsBytes = fs.readFileSync(path.join(ROOT, EDITOR_BUNDLE_SETTINGS));
  if (sha(editorSettingsBytes) !== EDITOR_BUNDLE_SETTINGS_SHA256) throw new Error('Creator Editor导出的bundle设置hash漂移');
  const editorBundleSettings = JSON.parse(editorSettingsBytes.toString('utf8'));
  const ownerOverrides = JSON.parse(fs.readFileSync(path.isAbsolute(ownerOverridesPath)
    ? ownerOverridesPath : path.join(ROOT, ownerOverridesPath), 'utf8'));
  const rows = readJson(GENERATED_PATH).assets, map = readJson(MAP_PATH), bundlePlan = readJson(BUNDLE_PATH);
  if (freeze.files.length !== 711 || rows.length !== 83 || map.assets.length !== 83) throw new Error('冻结输入或83资源计数不匹配');
  const effectiveHash = new Map(freeze.files.map(entry => [entry.path, entry.sha256]));
  const textPatches = loadApprovedTextPatches();
  for (const patch of textPatches) {
    const frozen = freeze.files.find(entry => entry.path === patch.path);
    const current = fs.readFileSync(path.join(sourceRoot, patch.path));
    if (!frozen || frozen.sha256 !== patch.beforeSha256 || sha(current) !== patch.afterSha256
      || current.toString('utf8').split(patch.afterText).length - 1 !== 1
      || current.toString('utf8').includes(patch.beforeText)) throw new Error(`正式文本patch源SHA/内容不符：${patch.path}`);
    effectiveHash.set(patch.path, patch.afterSha256);
  }
  for (const override of addendum.overrides ?? []) {
    if (effectiveHash.get(override.path) !== override.previous_sha256) throw new Error(`Freeze addendum基线不匹配：${override.path}`);
    effectiveHash.set(override.path, override.sha256);
  }
  const sourceDeltas = [], copied = [], frozenInputRecoveries = [], excludedFrozenInputs = [], portableRecoverySources = [];
  for (const patch of textPatches) sourceDeltas.push({ path: patch.path, baseSha256: patch.beforeSha256,
    sha256: patch.afterSha256, transformId: 'u05-approved-bmfont-punctuation-fix-v1',
    authorizationPath: patch.authorizationPath, authorizationSha256: patch.authorizationSha256 });
  const sourceOwnerPaths = new Set(['apps/client/assets/labs/u01/sakura_layout_editor.ts',
    'apps/client/assets/labs/u05/milk_tea_lab.ts', 'apps/client/assets/labs/u01/sakura_v03_environment.ts',
    'apps/client/assets/UnitSampleGallery.ts', 'apps/client/assets/framework/asset-integration/gallery_asset_session.ts',
    'apps/client/assets/framework/module-assets/cocos_bundle_loader.ts', 'apps/client/assets/framework/module-assets/module_assets.ts',
    'apps/client/assets/labs/u05/u05_accessibility.ts']);
  for (const override of ownerOverrides.overrides ?? []) {
    if (!sourceOwnerPaths.has(override.path)) throw new Error(`Owner source override越界：${override.path}`);
    if (effectiveHash.get(override.path) !== override.baseSha256) throw new Error(`Owner source override基线不匹配：${override.path}`);
    const bytes = fs.readFileSync(path.join(sourceRoot, override.path)), actual = sha(bytes);
    if (actual !== override.sha256) throw new Error(`Owner source override当前hash不匹配：${override.path}`);
    effectiveHash.set(override.path, override.sha256);
    sourceDeltas.push({ path: override.path, baseSha256: override.baseSha256, sha256: actual,
      transformId: override.transformId, reason: override.reason });
  }
  const additionPaths = new Set([
    'apps/client/assets/framework/asset-integration/approved_asset_registry.ts',
    'apps/client/assets/framework/asset-integration/client_asset_modules.ts',
    'apps/client/assets/framework/asset-integration/derived_asset_resolver.ts',
    'apps/client/assets/framework/asset-integration/derived_asset_resolver.ts.meta',
    'apps/client/assets/framework/asset-integration/gallery_asset_session.ts',
    'apps/client/assets/framework/asset-integration/gallery_asset_session.ts.meta',
  ]);
  for (const addition of ownerOverrides.additions ?? []) {
    if (!additionPaths.has(addition.path)) throw new Error(`Owner source addition越界：${addition.path}`);
    if (freeze.files.some(entry => entry.path === addition.path)) throw new Error(`Owner addition已在冻结清单中：${addition.path}`);
    const bytes = fs.readFileSync(path.join(sourceRoot, addition.path)), actual = sha(bytes);
    if (actual !== addition.sha256) throw new Error(`Owner source addition当前hash不匹配：${addition.path}`);
    sourceDeltas.push({ path: addition.path, baseSha256: null, sha256: actual,
      transformId: addition.transformId, reason: addition.reason, kind: 'AUTHORIZED_ADDITION' });
  }
  if (fs.existsSync(stageRoot) && fs.readdirSync(stageRoot).length) throw new Error(`staging目标非空，拒绝覆盖：${stageRoot}`);
  fs.mkdirSync(stageRoot, { recursive: true });
  for (const entry of freeze.files) {
    if (isPortableInputExcluded(entry.path)) {
      excludedFrozenInputs.push({ path: entry.path, sha256: entry.sha256,
        reason: entry.path.startsWith('apps/client/profiles/') ? 'EXCLUDED_LOCAL_CREATOR_EDITOR_PROFILE'
          : 'EXCLUDED_OS_METADATA' });
      continue;
    }
    let source = path.join(sourceRoot, entry.path);
    let bytes = fs.existsSync(source) ? fs.readFileSync(source) : null;
    let liveSha256 = bytes ? sha(bytes) : null;
    let actual = liveSha256;
    const expected = effectiveHash.get(entry.path) ?? entry.sha256;
    const recovery = PORTABLE_RECOVERY_EXPECTATIONS.find(item => item.path === entry.path);
    let sourceKind = 'FROZEN_SOURCE';
    if (actual !== expected && recovery) {
      source = path.join(ROOT, recovery.snapshot);
      bytes = fs.readFileSync(source); actual = sha(bytes);
      if (actual !== recovery.sha256 || actual !== expected) {
        throw new Error(`portable授权冻结输入恢复快照hash不匹配：${entry.path} expected=${expected} recovery=${actual}`);
      }
      sourceKind = 'AUTHORIZED_FROZEN_SNAPSHOT';
      frozenInputRecoveries.push({ path: entry.path, liveSha256, sourceSnapshot: recovery.snapshot,
        sha256: actual, authorization: PORTABLE_INPUT_AUTHORIZATION });
    }
    if (actual !== expected) throw new Error(`冻结输入漂移：${entry.path} expected=${expected} actual=${actual ?? 'MISSING'}`);
    if (recovery) portableRecoverySources.push({ path: entry.path, liveSha256, sha256: actual,
      sourceKind, snapshotPath: recovery.snapshot, headSha256: recovery.headSha256 });
    const target = path.join(stageRoot, entry.path.replace(/^apps\/client\//, ''));
    mkdirParent(target); fs.writeFileSync(target, bytes);
    copied.push({ path: entry.path, sha256: actual, bytes: bytes.length });
  }
  for (const addition of ownerOverrides.additions ?? []) {
    const bytes = fs.readFileSync(path.join(sourceRoot, addition.path));
    const target = path.join(stageRoot, addition.path.replace(/^apps\/client\//, ''));
    mkdirParent(target); fs.writeFileSync(target, bytes);
    copied.push({ path: addition.path, sha256: sha(bytes), bytes: bytes.length, kind: 'AUTHORIZED_ADDITION' });
  }
  const appRoot = stageRoot;
  const assetRoot = path.join(appRoot, 'assets');
  const builderSettingsPath = path.join(appRoot, 'settings/v2/packages/builder.json');
  const builderSettingsBefore = fs.readFileSync(builderSettingsPath);
  const builderSettings = JSON.parse(builderSettingsBefore.toString('utf8'));
  if (!editorBundleSettings.bundleConfig?.custom?.default?.configs?.miniGame) {
    throw new Error('Creator导出设置缺少miniGame bundle config');
  }
  builderSettings.bundleConfig = editorBundleSettings.bundleConfig;
  fs.writeFileSync(builderSettingsPath, `${JSON.stringify(builderSettings, null, 2)}\n`);
  const builderSettingsDelta = { path: 'settings/v2/packages/builder.json',
    beforeSha256: sha(builderSettingsBefore), afterSha256: sha(fs.readFileSync(builderSettingsPath)),
    transformId: 'merge-editor-exported-mini-game-bundle-config-v1',
    sourceArtifact: EDITOR_BUNDLE_SETTINGS, sourceSha256: EDITOR_BUNDLE_SETTINGS_SHA256,
    miniGameConfig: editorBundleSettings.bundleConfig.custom.default.configs.miniGame };
  // Relocate complete, UUID-stable owner trees in the isolated staging project.
  // PNG/Prefab/JSON bytes and their metas are copied as pairs, then removed from
  // their original locations so they cannot remain in the priority-8 resources bundle.
  const relocationLog = [];
  const moveTree = (sourceRel, targetRel, transformId) => {
    const source = path.join(assetRoot, sourceRel), target = path.join(assetRoot, targetRel);
    if (!fs.existsSync(source)) throw new Error(`Bundle来源目录缺失：${sourceRel}`);
    const copy = (from, to) => {
      for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
        const inPath = path.join(from, entry.name), outPath = path.join(to, entry.name);
        if (entry.isDirectory()) { fs.mkdirSync(outPath, { recursive: true }); copy(inPath, outPath); }
        else { mkdirParent(outPath); fs.copyFileSync(inPath, outPath); }
      }
    };
    fs.mkdirSync(target, { recursive: true }); copy(source, target); fs.rmSync(source, { recursive: true, force: true });
    const sourceMeta = `${source}.meta`, targetMeta = `${target}.meta`;
    if (fs.existsSync(sourceMeta)) { fs.copyFileSync(sourceMeta, targetMeta); fs.rmSync(sourceMeta); }
    relocationLog.push({ from: `assets/${sourceRel}`, to: `assets/${targetRel}`, transformId });
  };
  moveTree('units/background', 'bundles/world', 'relocate-world-prefab-tree-v1');
  moveTree('units/ghost-customer', 'bundles/tourist/ghost-customer', 'relocate-tourist-tree-v1');
  moveTree('units/shops', 'bundles/shops', 'relocate-shop-trees-v1');
  moveTree('resources/sakura_v03', 'bundles/world/sakura_v03', 'relocate-world-source-textures-v1');
  moveTree('resources/u05_milk_tea', 'bundles/milk_tea/u05_milk_tea', 'relocate-milk-tea-source-tree-v1');
  // UnitSamples startup menu must not hold the sample-page payload. Clear only
  // the serialized asset slots on the existing component; keep Scene/node IDs.
  const sceneRel = 'assets/UnitSamples.scene';
  const scenePath = path.join(appRoot, sceneRel);
  const sceneBefore = fs.readFileSync(scenePath);
  const scene = JSON.parse(sceneBefore.toString('utf8'));
  const sceneComponent = scene.find(item => item && Object.prototype.hasOwnProperty.call(item, 'streetBasePrefab'));
  if (!sceneComponent || sceneComponent.shopPrefabs?.length !== 6 || sceneComponent.touristBodyFrames?.length !== 40) {
    throw new Error('UnitSamples.scene启动资源字段身份/计数与冻结引用图不一致');
  }
  const removedHardReferences = {
    streetBasePrefab: sceneComponent.streetBasePrefab ? 1 : 0,
    touristPrefab: sceneComponent.touristPrefab ? 1 : 0,
    touristFrameManifest: sceneComponent.touristFrameManifest ? 1 : 0,
    touristMountManifest: sceneComponent.touristMountManifest ? 1 : 0,
    touristAccessoryManifest: sceneComponent.touristAccessoryManifest ? 1 : 0,
    touristBodyFrames: sceneComponent.touristBodyFrames.length,
    touristAccessoryFrames: sceneComponent.touristAccessoryFrames.length,
    shopPrefabs: sceneComponent.shopPrefabs.length,
  };
  const previousOptimizedBundleFlag = sceneComponent.useOptimizedBundles === true;
  for (const key of ['streetBasePrefab','touristPrefab','touristFrameManifest','touristMountManifest','touristAccessoryManifest']) sceneComponent[key] = null;
  sceneComponent.touristBodyFrames = []; sceneComponent.touristAccessoryFrames = []; sceneComponent.shopPrefabs = [];
  sceneComponent.useOptimizedBundles = true;
  fs.writeFileSync(scenePath, `${JSON.stringify(scene, null, 2)}\n`);
  const sceneDelta = { path: sceneRel, fromSha256: sha(sceneBefore), toSha256: sha(fs.readFileSync(scenePath)),
    transformId: 'remove-non-startup-gallery-hard-references-and-enable-page-bundles-v2', removedHardReferences,
    useOptimizedBundles: { before: previousOptimizedBundleFlag, after: true } };
  const aliasIds = new Map();
  const manifest = readJson(GENERATED_PATH);
  for (const alias of manifest.aliases) {
    const canonical = alias.canonicalImageAssetId;
    for (const id of alias.logicalAssetIds) aliasIds.set(id, canonical);
  }
  const oldUuids = new Map();
  for (const asset of map.assets) {
    const canonicalId = aliasIds.get(asset.stable_asset_id) || asset.stable_asset_id;
    const canonical = map.assets.find(item => item.stable_asset_id === canonicalId);
    if (!canonical) throw new Error(`alias canonical缺失：${canonicalId}`);
    if (asset.current_image_uuid !== canonical.current_image_uuid) oldUuids.set(asset.current_image_uuid, canonical.current_image_uuid);
    const oldFrame = asset.current_frame_uuid, newFrame = canonical.current_frame_uuid;
    if (oldFrame !== newFrame) oldUuids.set(oldFrame, newFrame);
    for (const oldPath of [asset.current_client_path, `${asset.current_client_path}.meta`]) {
      let stagedRel = oldPath.replace(/^apps\/client\/assets\//, 'assets/');
      const moved = [
        ['assets/units/background/', 'assets/bundles/world/'],
        ['assets/units/ghost-customer/', 'assets/bundles/tourist/ghost-customer/'],
        ['assets/units/shops/', 'assets/bundles/shops/'],
        ['assets/resources/sakura_v03/', 'assets/bundles/world/sakura_v03/'],
        ['assets/resources/u05_milk_tea/', 'assets/bundles/milk_tea/u05_milk_tea/'],
      ].find(([from]) => stagedRel.startsWith(from));
      if (moved) stagedRel = moved[1] + stagedRel.slice(moved[0].length);
      const stagedPath = path.join(appRoot, stagedRel);
      if (fs.existsSync(stagedPath)) fs.rmSync(stagedPath);
    }
  }
  const generated = [], destinations = new Map();
  for (const row of rows) {
    const asset = map.assets.find(item => item.stable_asset_id === row.stableAssetId);
    const canonicalId = aliasIds.get(row.stableAssetId) || row.stableAssetId;
    const canonicalRow = rows.find(item => item.stableAssetId === canonicalId);
    const destRel = path.posix.join('assets', canonicalRow.plannedGeneratedPath);
    const dest = path.join(appRoot, destRel);
    const productionExcluded = canonicalId === 'tex_sakura_rr_far_l';
    if (!destinations.has(destRel) && !productionExcluded) {
      const source = path.join(ROOT, row.approvedExport), bytes = fs.readFileSync(source);
      if (sha(bytes) !== row.approvedSha256) throw new Error(`批准导出hash漂移：${row.stableAssetId}`);
      mkdirParent(dest); fs.writeFileSync(dest, bytes);
      const originalMetaPath = path.join(sourceRoot, `${asset.current_client_path}.meta`);
      const meta = JSON.parse(fs.readFileSync(originalMetaPath, 'utf8'));
      const spriteMeta = Object.values(meta.subMetas ?? {}).find(m => m.importer === 'sprite-frame');
      const [width, height] = [row.frame.rect[2], row.frame.rect[3]];
      if (!spriteMeta) throw new Error(`源图meta缺少sprite-frame子项：${row.stableAssetId}`);
      spriteMeta.userData = { ...(spriteMeta.userData ?? {}), trimThreshold: 0, trimX: 0, trimY: 0,
        width, height, rawWidth: width, rawHeight: height, packable: false, trimType: 'none', rotated: false };
      meta.userData = { ...(meta.userData ?? {}), type: 'sprite-frame', hasAlpha: true };
      fs.writeFileSync(`${dest}.meta`, `${JSON.stringify(meta, null, 2)}\n`);
      destinations.set(destRel, { stableAssetId: canonicalId, sha256: sha(bytes), bytes: bytes.length,
        imageUuid: asset.current_image_uuid, frameUuid: asset.current_frame_uuid, cropFrameRect: [0, 0, width, height],
        sourceCropRect: row.frame.sourceCropRect, originalSize: row.frame.originalSize, offset: row.frame.offset, noTrim: true });
    }
    generated.push({ stableAssetId: row.stableAssetId, canonicalImageAssetId: canonicalId, generatedPath: destRel,
      sha256: row.approvedSha256, imageUuid: row.originImageUuid, frameUuid: row.originFrameUuid,
      cropFrameRect: row.frame.rect, originalSize: row.frame.originalSize, offset: row.frame.offset, pivot: row.frame.pivot,
      physicalIncluded: !productionExcluded,
      ...(productionExcluded ? { exclusionReason: 'Approved historical crop is not referenced by the current frozen Sakura layout; current path resolves to the distinct eye_dark_base PNG.' } : {}) });
  }
  const pngOverrides = loadApprovedPngOverrides(pngOverridesPath, rows, appRoot, sourceRoot);
  for (const override of pngOverrides) {
    const target = path.join(appRoot, override.stagePath);
    const bytes = fs.readFileSync(path.join(ROOT, override.candidatePath));
    const beforeSha256 = sha(fs.readFileSync(target));
    fs.writeFileSync(target, bytes);
    if (sha(fs.readFileSync(target)) !== override.candidateSha256) throw new Error(`PNG override写入后SHA不符：${override.stableAssetId}`);
    const generatedRow = generated.find(item => item.stableAssetId === override.stableAssetId && item.generatedPath === override.stagePath);
    if (generatedRow) generatedRow.sha256 = override.candidateSha256;
    override.beforeSha256 = beforeSha256;
    override.afterSha256 = override.candidateSha256;
    override.bytes = bytes.length;
    override.metaSha256 = sha(fs.readFileSync(`${target}.meta`));
  }
  const releaseExclusions = [];
  const sourceTextFiles = [];
  const collectTexts = dir => { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectTexts(full);
    else if (/\.(scene|prefab|json|ts|js|anim|fire)$/.test(entry.name)) sourceTextFiles.push([full, fs.readFileSync(full, 'utf8')]);
  } };
  collectTexts(assetRoot);
  const u05RuntimeExclusions = [];
  for (const name of ['CUSTOMER_GHOST', 'STATIC_BARE']) {
    const imagePath = path.join(assetRoot, `bundles/milk_tea/u05_milk_tea/u05_b/${name}.png`);
    const metaPath = `${imagePath}.meta`;
    if (!fs.existsSync(imagePath) || !fs.existsSync(metaPath)) throw new Error(`预期U05原始资源不存在：${name}`);
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const ids = [meta.uuid, ...Object.values(meta.subMetas ?? {}).map(item => item.uuid)].filter(Boolean);
    const filename = `${name}.png`;
    const refs = sourceTextFiles.filter(([full, text]) => full !== metaPath &&
      (text.includes(filename) || ids.some(id => text.includes(id))));
    if (refs.length) throw new Error(`U05待排除图仍有冻结源码/序列化引用：${name} -> ${refs.map(([full]) => full).join(', ')}`);
    const bytes = fs.statSync(imagePath).size;
    fs.rmSync(imagePath); fs.rmSync(metaPath);
    u05RuntimeExclusions.push({ path: `apps/client/assets/resources/u05_milk_tea/u05_b/${filename}`,
      uuid: meta.uuid, spriteFrameUuid: Object.values(meta.subMetas ?? {}).map(item => item.uuid).find(id => String(id).endsWith('@f9941')) ?? null,
      bytes, disposition: 'EXCLUDED_UNREFERENCED_LEGACY_U05_IMAGE',
      evidence: 'no exact PNG filename or image/frame UUID reference in staged Scene/Prefab/TS/JSON/Anim/Fire payloads' });
  }
  for (const filename of ['tex_sakura_rr_far_l.png', 'tex_sakura_rr_bridge_body_l.png', 'tex_sakura_rr_bridge_body_r.png']) {
    const imagePath = path.join(assetRoot, 'bundles/world/sakura_v03', filename);
    const metaPath = `${imagePath}.meta`;
    const sourceRel = `apps/client/assets/resources/sakura_v03/${filename}`;
    const original = copied.find(entry => entry.path === sourceRel);
    if (!original) throw new Error(`冻结输入manifest缺少旧世界图：${sourceRel}`);
    // far_l is intentionally absent from the production tree: both its legacy
    // original and the historically approved crop are unused by the frozen
    // layout. Read identity from the frozen source meta for the audit only.
    const identityMetaPath = fs.existsSync(metaPath) ? metaPath : path.join(sourceRoot, `${sourceRel}.meta`);
    if (!fs.existsSync(identityMetaPath)) throw new Error(`冻结世界图meta缺失：${filename}`);
    const meta = JSON.parse(fs.readFileSync(identityMetaPath, 'utf8'));
    const ids = [meta.uuid, ...Object.values(meta.subMetas ?? {}).map(item => item.uuid)].filter(Boolean);
    const refs = sourceTextFiles.filter(([full, text]) => full !== metaPath &&
      (text.includes(filename) || ids.some(id => text.includes(id))));
    if (refs.length) throw new Error(`禁止排除的世界遗留图仍被源码或序列化资源引用：${filename} -> ${refs.map(([full]) => full).join(', ')}`);
    const generatedRow = generated.find(item => item.generatedPath === `assets/bundles/world/sakura_v03/${filename}` && item.physicalIncluded);
    if (generatedRow) {
      if (!fs.existsSync(imagePath) || sha(fs.readFileSync(imagePath)) !== generatedRow.sha256) throw new Error(`批准裁片被排除检查意外覆盖：${filename}`);
    } else if (fs.existsSync(imagePath)) {
      // The exact legacy file is proven unreachable in the frozen project;
      // leave it out of the production bundle while preserving the source tree.
      fs.rmSync(imagePath); fs.rmSync(metaPath, { force: true });
    }
    releaseExclusions.push({ sourcePath: sourceRel, originalSha256: original.sha256, originalBytes: original.bytes,
      currentOutputPath: generatedRow ? generatedRow.generatedPath : null,
      currentOutputSha256: generatedRow ? generatedRow.sha256 : null,
      disposition: generatedRow ? 'REPLACED_BY_APPROVED_CROP_AT_SAME_UUID' : (filename === 'tex_sakura_rr_far_l.png' ? 'EXCLUDED_APPROVED_BUT_UNREFERENCED_CROP_AND_LEGACY_IMAGE' : 'EXCLUDED_UNREFERENCED_LEGACY_IMAGE'),
      uuid: meta.uuid, spriteFrameUuid: Object.values(meta.subMetas ?? {}).map(item => item.uuid).find(id => String(id).endsWith('@f9941')) ?? null,
      transformId: 'exclude-unreferenced-legacy-world-texture-v1', evidence: 'no exact filename or UUID references in staged Scene/Prefab/TS/JSON/Anim/Fire payloads after approved paths are staged' });
    if (!generatedRow) { fs.rmSync(imagePath, { force: true }); fs.rmSync(metaPath, { force: true }); }
  }
  // Bundle folders are owned by the generated staging project. No original asset is edited.
  const bundleMeta = [];
  for (const bundle of bundlePlan.planned_local_bundles) {
    const directory = bundle.planned_directory.replace(/^apps\/client\/assets\//, 'assets/');
    fs.mkdirSync(path.join(appRoot, directory), { recursive: true });
    const metaPath = `${path.join(appRoot, directory)}.meta`;
    const uuid = uuidFrom(`asset-bundle:${bundle.id}`);
    const body = { ver: '1.2.0', importer: 'directory', imported: true, uuid, files: [], subMetas: {},
      userData: { isBundle: true, bundleName: bundle.id, priority: 1, compressionType: 0,
        isRemoteBundle: false, isZipBundle: false } };
    fs.writeFileSync(metaPath, `${JSON.stringify(body, null, 2)}\n`);
    bundleMeta.push({ id: bundle.id, directory, metaPath: path.relative(appRoot, metaPath), uuid, dependencies: bundle.dependencies });
  }
  // Deterministic UUID remap for byte-identical logical aliases only.
  if (oldUuids.size) {
    const textExt = new Set(['.scene','.prefab','.fire','.json','.ts','.js','.meta','.anim']);
    const walk = dir => { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (textExt.has(path.extname(entry.name))) {
        let text = fs.readFileSync(full, 'utf8'), before = text;
        for (const [from, to] of oldUuids) text = text.replaceAll(from, to);
        if (text !== before) fs.writeFileSync(full, text);
      }
    } };
    walk(assetRoot);
  }
  const uuidInventory = new Map();
  const scanMeta = dir => { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) scanMeta(full);
    else if (entry.name.endsWith('.meta')) {
      const m = JSON.parse(fs.readFileSync(full, 'utf8'));
      for (const uuid of [m.uuid, ...Object.values(m.subMetas ?? {}).map(x => x.uuid)]) if (uuid) {
        const prior = uuidInventory.get(uuid);
        if (prior) throw new Error(`staging重复UUID ${uuid}: ${prior} / ${full}`);
        uuidInventory.set(uuid, full);
      }
    }
  } };
  scanMeta(assetRoot);
  const physicalGeneratedByPath = new Map();
  for (const item of generated.filter(entry => entry.physicalIncluded)) {
    const full = path.join(appRoot, item.generatedPath);
    if (!fs.existsSync(full)) throw new Error(`生成派生图缺失：${item.stableAssetId} -> ${item.generatedPath}`);
    const actual = sha(fs.readFileSync(full));
    if (actual !== item.sha256) throw new Error(`生成派生图hash不匹配：${item.stableAssetId}`);
    const prior = physicalGeneratedByPath.get(item.generatedPath);
    if (prior && prior.sha256 !== actual) throw new Error(`别名共享目标hash不一致：${item.generatedPath}`);
    if (prior) prior.logicalAssetIds.push(item.stableAssetId);
    else physicalGeneratedByPath.set(item.generatedPath, { path: item.generatedPath, sha256: actual,
      bytes: fs.statSync(full).size, logicalAssetIds: [item.stableAssetId] });
  }
  const physicallyGenerated = Array.from(physicalGeneratedByPath.values());
  const uniquePhysicalDerivedImages = new Set(physicallyGenerated.map(item => item.path)).size;
  const report = { schemaVersion: 1, status: 'SOURCE_STAGED_NOT_CREATOR_IMPORTED', freezeVersion: freeze.version,
    freezeSha256: sha(Buffer.from(`${JSON.stringify(freeze, null, 2)}\n`)),
    freezeAddendumSha256: sha(Buffer.from(`${JSON.stringify(addendum, null, 2)}\n`)),
    ownerSourceOverridesSha256: sha(Buffer.from(`${JSON.stringify(ownerOverrides, null, 2)}\n`)), frozenFileCount: freeze.files.length,
    rootSourceManifestSha256: freeze.main_source_manifest_sha256, sourceFiles: copied,
    portableInputMode: true, sourceRoot: path.resolve(sourceRoot),
    excludedFrozenInputs, excludedFrozenInputCount: excludedFrozenInputs.length,
    includedFrozenInputCount: freeze.files.length - excludedFrozenInputs.length,
    frozenInputRecoveries, portableRecoverySources,
    portableInputAuthorizationPath: PORTABLE_INPUT_AUTHORIZATION,
    portableInputAuthorizationSha256: PORTABLE_INPUT_AUTHORIZATION_SHA256,
    builderSettingsDelta,
    authorizedDeltas: sourceDeltas,
    approvedPngOverrides: pngOverrides,
    ...(pngOverrides.length ? { approvedPngOverrideManifestPath: path.relative(ROOT, path.resolve(pngOverridesPath)),
      approvedPngOverrideManifestSha256: sha(fs.readFileSync(path.isAbsolute(pngOverridesPath) ? pngOverridesPath : path.join(ROOT, pngOverridesPath))),
      approvedPngIdentityPath: APPROVED_PNG_IDENTITY_PATH, approvedPngIdentitySha256: APPROVED_PNG_IDENTITY_SHA256,
      approvedPngAuthorizationPath: APPROVED_PNG_AUTH_PATH, approvedPngAuthorizationSha256: APPROVED_PNG_AUTH_SHA256 } : {}),
    approvedAssetCount: generated.length, plannedUniqueGeneratedImages: destinations.size,
    uniqueGeneratedImages: uniquePhysicalDerivedImages, physicalGeneratedImages: physicallyGenerated,
    aliasUuidRemaps: [...oldUuids.entries()], generatedAssets: generated, bundleMeta, relocations: relocationLog,
    releaseExclusions, u05RuntimeExclusions,
    uniqueAssetUuidCount: uuidInventory.size,
    creatorImport: 'NOT_TESTED', sceneDelta, sceneStartupHardReferences: 'REMOVED_FROM_SERIALIZED_COMPONENT',
  };
  const outPath = path.join(appRoot, 'STAGING_INPUT_MANIFEST.json');
  fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ stageRoot: appRoot, includedFrozenInputCount: freeze.files.length - excludedFrozenInputs.length,
    excludedFrozenInputCount: excludedFrozenInputs.length, stagedSourceFileCount: copied.length, generatedAssetCount: generated.length,
    uniqueGeneratedImages: uniquePhysicalDerivedImages, uniqueAssetUuidCount: uuidInventory.size, authorizedDeltas: sourceDeltas }, null, 2));
  return report;
}

function applyApprovedPngOverridesFromFrozenStage(baseStageRoot, stageRoot, overridePath, sourceRoot = ROOT, contentRoot = ROOT) {
  baseStageRoot = path.resolve(baseStageRoot); stageRoot = path.resolve(stageRoot);
  const overrideData = JSON.parse(fs.readFileSync(overridePath, 'utf8'));
  if (path.resolve(overrideData.baseStagePath) !== baseStageRoot
    || overrideData.baseStageManifestSha256 !== APPROVED_PNG_BASE_STAGE_SHA256) throw new Error('override清单未绑定准确冻结v0.8 stage');
  const baseManifestPath = path.join(baseStageRoot, 'STAGING_INPUT_MANIFEST.json');
  const baseManifestBytes = fs.readFileSync(baseManifestPath);
  if (sha(baseManifestBytes) !== APPROVED_PNG_BASE_STAGE_SHA256) throw new Error('冻结v0.8 staging manifest SHA不匹配');
  const frozenPayloadManifestBytes = fs.readFileSync(path.join(ROOT, APPROVED_PNG_BASE_STAGE_PAYLOAD_PATH));
  if (sha(frozenPayloadManifestBytes) !== APPROVED_PNG_BASE_STAGE_PAYLOAD_SHA256) throw new Error('冻结v0.8 payload manifest SHA不匹配');
  const frozenPayload = JSON.parse(frozenPayloadManifestBytes.toString('utf8'));
  if (frozenPayload.baseStagePath !== baseStageRoot || frozenPayload.baseStageReportSha256 !== APPROVED_PNG_BASE_STAGE_SHA256) {
    throw new Error('冻结v0.8 payload inventory未绑定准确stage/report');
  }
  const payloadRows = new Map(frozenPayload.files.map(row => [row.path, row.sha256]));
  if (payloadRows.size !== frozenPayload.files.length) throw new Error('冻结v0.8 payload inventory包含重复路径');
  const allowedOverrides = new Map(JSON.parse(fs.readFileSync(overridePath, 'utf8')).assets.map(item => [item.stagePath, item.sourceSha256]));
  const actualPaths = new Set();
  const walkBase = (dir, rel = '') => { for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name), current = rel ? `${rel}/${item.name}` : item.name;
    if (item.isDirectory() && ['evidence', 'build-output', 'build-configs'].includes(item.name)) continue;
    if (item.isDirectory()) walkBase(full, current);
    else if (current !== 'STAGING_INPUT_MANIFEST.json') {
      const digest = sha(fs.readFileSync(full)); actualPaths.add(current);
      const expected = payloadRows.get(current);
      if (expected && digest !== expected) throw new Error(`冻结v0.8 payload漂移：${current}`);
      if (!expected && !allowedOverrides.has(current)) throw new Error(`冻结v0.8 payload存在未登记文件：${current}`);
      if (allowedOverrides.has(current) && digest !== allowedOverrides.get(current)) throw new Error(`六项候选的v0.8基础源SHA不符：${current}`);
    }
  } };
  walkBase(baseStageRoot);
  for (const rel of payloadRows.keys()) if (!actualPaths.has(rel)) throw new Error(`冻结v0.8 payload缺失：${rel}`);
  if (actualPaths.size !== payloadRows.size) throw new Error('冻结v0.8 payload文件数量漂移');
  if (fs.existsSync(stageRoot) && fs.readdirSync(stageRoot).length) throw new Error(`PNG override staging目标非空，拒绝覆盖：${stageRoot}`);
  const rows = readJson(GENERATED_PATH).assets;
  const overrides = loadApprovedPngOverrides(overridePath, rows, baseStageRoot, sourceRoot, contentRoot);
  const textPatches = loadApprovedTextPatches(contentRoot);
  for (const patch of textPatches) {
    const baseFile = path.join(baseStageRoot, patch.path.replace(/^apps\/client\//, ''));
    const live = fs.readFileSync(path.join(sourceRoot, patch.path));
    if (sha(fs.readFileSync(baseFile)) !== patch.beforeSha256 || sha(live) !== patch.afterSha256
      || live.toString('utf8').includes(patch.beforeText)) throw new Error(`U05文本patch基础/活动源身份不符：${patch.path}`);
  }
  fs.mkdirSync(stageRoot, { recursive: true });
  for (const name of ['assets', 'settings', 'build-configs', 'package.json', 'STAGING_INPUT_MANIFEST.json']) {
    const source = path.join(baseStageRoot, name), target = path.join(stageRoot, name);
    if (!fs.existsSync(source)) throw new Error(`冻结stage缺少必要输入：${name}`);
    fs.cpSync(source, target, { recursive: true, errorOnExist: true, force: false });
  }
  const manifest = JSON.parse(fs.readFileSync(path.join(stageRoot, 'STAGING_INPUT_MANIFEST.json'), 'utf8'));
  const appliedTextPatches = [];
  for (const patch of textPatches) {
    const target = path.join(stageRoot, patch.path.replace(/^apps\/client\//, ''));
    const before = fs.readFileSync(target), beforeSha256 = sha(before), text = before.toString('utf8');
    if (beforeSha256 !== patch.beforeSha256 || text.split(patch.beforeText).length - 1 !== 1) throw new Error(`stage文本patch旧SHA/唯一锚点不符：${patch.path}`);
    const after = Buffer.from(text.replace(patch.beforeText, patch.afterText), 'utf8');
    if (sha(after) !== patch.afterSha256) throw new Error(`stage文本patch新SHA不符：${patch.path}`);
    fs.writeFileSync(target, after);
    const row = manifest.sourceFiles?.find(item => item.path === patch.path);
    if (row) { row.sha256 = patch.afterSha256; row.bytes = after.length; }
    manifest.authorizedDeltas = [...(manifest.authorizedDeltas ?? []), { path: patch.path, baseSha256: patch.beforeSha256,
      sha256: patch.afterSha256, transformId: 'u05-approved-bmfont-punctuation-fix-v1', authorizationPath: patch.authorizationPath,
      authorizationSha256: patch.authorizationSha256 }];
    appliedTextPatches.push({ ...patch, beforeSha256, afterSha256: sha(after), bytesBefore: before.length, bytesAfter: after.length });
  }
  for (const entry of overrides) {
    const target = path.join(stageRoot, entry.stagePath), metaPath = `${target}.meta`;
    const before = fs.readFileSync(target), beforeMeta = fs.readFileSync(metaPath);
    const beforeMetaHash = sha(beforeMeta), meta = JSON.parse(beforeMeta.toString('utf8'));
    const frameMeta = Object.values(meta.subMetas ?? {}).find(item => item.importer === 'sprite-frame');
    if (!frameMeta || meta.uuid !== entry.imageUuid || frameMeta.uuid !== entry.frameUuid) throw new Error(`冻结stage UUID/meta不符：${entry.stableAssetId}`);
    const bytes = fs.readFileSync(path.join(contentRoot, entry.candidatePath));
    fs.writeFileSync(target, bytes);
    const afterMeta = fs.readFileSync(metaPath);
    if (sha(afterMeta) !== beforeMetaHash || sha(fs.readFileSync(target)) !== entry.candidateSha256) throw new Error(`PNG override写入或meta保留失败：${entry.stableAssetId}`);
    const generatedRow = manifest.generatedAssets?.find(item => item.stableAssetId === entry.stableAssetId && `assets/${item.generatedPath.replace(/^assets\//, '')}` === entry.stagePath);
    if (generatedRow) generatedRow.sha256 = entry.candidateSha256;
    const physical = manifest.physicalGeneratedImages?.find(item => item.path === entry.stagePath);
    if (physical) { physical.sha256 = entry.candidateSha256; physical.bytes = bytes.length; }
    entry.beforeSha256 = sha(before); entry.afterSha256 = entry.candidateSha256;
    entry.metaSha256Before = beforeMetaHash; entry.metaSha256After = sha(afterMeta);
    entry.metaUuid = meta.uuid; entry.frameUuid = frameMeta.uuid; entry.bytes = bytes.length;
  }
  for (const configPath of fs.readdirSync(path.join(stageRoot, 'build-configs')).filter(file => file.endsWith('.json'))) {
    const full = path.join(stageRoot, 'build-configs', configPath), config = JSON.parse(fs.readFileSync(full, 'utf8'));
    config.buildPath = path.join(stageRoot, 'build-output');
    config.logDest = path.join(stageRoot, 'evidence', `creator-${config.platform}.log`);
    config.outputName = `minigame-art-opt-png-20261017-client-v01-${config.platform}`;
    config.taskName = `MINIGAME-ART-OPT-PNG-20261017-CLIENT-${config.platform}`;
    fs.writeFileSync(full, `${JSON.stringify(config, null, 2)}\n`);
  }
  fs.mkdirSync(path.join(stageRoot, 'evidence'), { recursive: true });
  manifest.status = 'SOURCE_STAGED_WITH_APPROVED_PNG_OVERRIDES_NOT_CREATOR_IMPORTED';
  manifest.approvedPngOverrides = overrides;
  manifest.approvedTextPatches = appliedTextPatches;
  manifest.approvedTextPatchAuthorizationPath = APPROVED_TEXT_PATCH_AUTH_PATH;
  manifest.approvedTextPatchAuthorizationSha256 = APPROVED_TEXT_PATCH_AUTH_SHA256;
  manifest.approvedPngOverrideManifestPath = path.relative(ROOT, overridePath);
  manifest.approvedPngOverrideManifestSha256 = sha(fs.readFileSync(overridePath));
  manifest.approvedPngIdentityPath = APPROVED_PNG_IDENTITY_PATH;
  manifest.approvedPngIdentitySha256 = APPROVED_PNG_IDENTITY_SHA256;
  manifest.approvedPngAuthorizationPath = APPROVED_PNG_AUTH_PATH;
  manifest.approvedPngAuthorizationSha256 = APPROVED_PNG_AUTH_SHA256;
  manifest.baseStagePath = baseStageRoot;
  manifest.baseStageManifestSha256 = APPROVED_PNG_BASE_STAGE_SHA256;
  manifest.baseStagePayloadManifestPath = APPROVED_PNG_BASE_STAGE_PAYLOAD_PATH;
  manifest.baseStagePayloadManifestSha256 = APPROVED_PNG_BASE_STAGE_PAYLOAD_SHA256;
  fs.writeFileSync(path.join(stageRoot, 'STAGING_INPUT_MANIFEST.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  return { stageRoot, baseStageRoot, manifestSha256: sha(fs.readFileSync(path.join(stageRoot, 'STAGING_INPUT_MANIFEST.json'))), overrides };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const takeFlag = flag => {
    const index = args.indexOf(flag);
    if (index < 0) return null;
    if (!args[index + 1] || args[index + 1].startsWith('--')) throw new Error(`${flag}需要一个路径`);
    const value = path.resolve(args[index + 1]); args.splice(index, 2); return value;
  };
  const pngOverridesPath = takeFlag('--candidate-overrides');
  const baseStagePath = takeFlag('--base-stage');
  const stageRoot = path.resolve(args[0] || '/private/tmp/minigame-art-opt-integration-staging-v0.1');
  try {
    if (baseStagePath) {
      if (!pngOverridesPath) throw new Error('--base-stage必须同时提供--candidate-overrides');
      const result = applyApprovedPngOverridesFromFrozenStage(baseStagePath, stageRoot, pngOverridesPath, ROOT);
      console.log(JSON.stringify(result, null, 2));
    } else {
      const overridesPath = args[1] ? path.resolve(args[1]) : OWNER_OVERRIDES_PATH;
      const sourceRoot = args[2] ? path.resolve(args[2]) : ROOT;
      build(stageRoot, overridesPath, sourceRoot, pngOverridesPath);
    }
  } catch (error) { console.error(`staging failed: ${error.stack || error}`); process.exitCode = 1; }
}
module.exports = { build, isPortableInputExcluded, loadApprovedPngOverrides, applyApprovedPngOverridesFromFrozenStage };
