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

function build(stageRoot, ownerOverridesPath = OWNER_OVERRIDES_PATH, sourceRoot = ROOT) {
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
  for (const override of addendum.overrides ?? []) {
    if (effectiveHash.get(override.path) !== override.previous_sha256) throw new Error(`Freeze addendum基线不匹配：${override.path}`);
    effectiveHash.set(override.path, override.sha256);
  }
  const sourceDeltas = [], copied = [], frozenInputRecoveries = [], excludedFrozenInputs = [], portableRecoverySources = [];
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

if (require.main === module) {
  const stageRoot = path.resolve(process.argv[2] || '/private/tmp/minigame-art-opt-integration-staging-v0.1');
  const overridesPath = process.argv[3] ? path.resolve(process.argv[3]) : OWNER_OVERRIDES_PATH;
  const sourceRoot = process.argv[4] ? path.resolve(process.argv[4]) : ROOT;
  try { build(stageRoot, overridesPath, sourceRoot); } catch (error) { console.error(`staging failed: ${error.stack || error}`); process.exitCode = 1; }
}
module.exports = { build, isPortableInputExcluded };
