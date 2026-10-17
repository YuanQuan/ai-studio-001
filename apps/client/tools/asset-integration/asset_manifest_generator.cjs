#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '../../../../');
const DEFAULT_MAP = 'deliverables/tech_lead/MINIGAME-ART-OPT-IMPORT-TECH-20261017/v0.1/APPROVED_ASSET_HANDOFF_MAP.json';
const DEFAULT_BUNDLES = 'deliverables/tech_lead/MINIGAME-ART-OPT-IMPORT-TECH-20261017/v0.1/BUNDLE_REFERENCE_MAP.json';

function pngSize(bytes) {
  if (bytes.length < 24 || bytes.toString('ascii', 1, 4) !== 'PNG' || bytes.toString('ascii', 12, 16) !== 'IHDR') {
    throw new Error('批准导出不是有效PNG/IHDR');
  }
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
}

function bundleFor(asset) {
  const id = asset.stable_asset_id;
  if (id.startsWith('tex_sakura_')) return 'world';
  if (id.startsWith('U03_SHOP_') || id.startsWith('tex_u03_shop_')) return 'shops';
  if (id.startsWith('UG_GHOST_')) return 'tourist';
  if (['BTN_CONFIRM_TEXT', 'CUP_', 'LOCK_'].some(prefix => id.startsWith(prefix))) return 'milk-tea';
  throw new Error(`无法从批准映射推导唯一Bundle：${id}`);
}

function generatedAssetPath(asset, bundle) {
  const filename = path.basename(asset.current_client_path);
  const folder = bundle === 'world' ? 'sakura_v03'
    : bundle === 'shops' ? path.posix.dirname(asset.current_client_path).split('/').slice(-2).join('/')
      : bundle === 'tourist' ? 'ghost-customer/frames' : 'u05_milk_tea/u05_b';
  return `${bundle === 'milk-tea' ? 'bundles/milk_tea' : `bundles/${bundle}`}/${folder}/${filename}`;
}

function buildManifest(root = ROOT, mapPath = DEFAULT_MAP, bundlePath = DEFAULT_BUNDLES) {
  const map = JSON.parse(fs.readFileSync(path.resolve(root, mapPath), 'utf8'));
  const bundlePlan = JSON.parse(fs.readFileSync(path.resolve(root, bundlePath), 'utf8'));
  if (!Array.isArray(map.assets) || map.count !== map.assets.length || map.assets.length !== 83) {
    throw new Error(`批准映射数量异常：count=${map.count}, rows=${map.assets?.length}`);
  }
  const planned = new Map(bundlePlan.planned_local_bundles.map(item => [item.id, item]));
  const seenIds = new Set(), seenUuids = new Map(), rows = [];
  for (const asset of map.assets) {
    if (!asset.stable_asset_id || seenIds.has(asset.stable_asset_id)) throw new Error(`stable_asset_id 缺失或重复：${asset.stable_asset_id}`);
    seenIds.add(asset.stable_asset_id);
    for (const uuid of [asset.current_image_uuid, asset.current_frame_uuid]) {
      if (!uuid) throw new Error(`正式UUID缺失：${asset.stable_asset_id}`);
      const prior = seenUuids.get(uuid);
      if (prior && prior !== asset.stable_asset_id && uuid === asset.current_image_uuid) {
        throw new Error(`图片UUID重复归属：${uuid}: ${prior}, ${asset.stable_asset_id}`);
      }
      if (!prior) seenUuids.set(uuid, asset.stable_asset_id);
    }
    const bundle = bundleFor(asset);
    if (!planned.has(bundle)) throw new Error(`Bundle不在批准计划中：${bundle}`);
    const source = path.resolve(root, asset.approved_export);
    const bytes = fs.readFileSync(source);
    const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
    if (sha256 !== asset.export_sha256) throw new Error(`导出hash不匹配：${asset.stable_asset_id} (${sha256})`);
    const [width, height] = pngSize(bytes);
    const [x0, y0, x1, y1] = asset.crop_rect;
    const [originalWidth, originalHeight] = asset.original_size;
    if (width !== x1 - x0 || height !== y1 - y0) {
      throw new Error(`PNG尺寸与批准crop_rect不匹配：${asset.stable_asset_id} png=${width}x${height} rect=${x1 - x0}x${y1 - y0}`);
    }
    if (![x0, y0, x1, y1].every(Number.isInteger) || x0 < 0 || y0 < 0 || x1 > originalWidth || y1 > originalHeight || x0 >= x1 || y0 >= y1) {
      throw new Error(`裁切矩形越界或无效：${asset.stable_asset_id}`);
    }
    rows.push({
      stableAssetId: asset.stable_asset_id,
      category: asset.category,
      bundle,
      approvedExport: asset.approved_export,
      approvedSha256: sha256,
      originImageUuid: asset.current_image_uuid,
      originFrameUuid: asset.current_frame_uuid,
      importedImageUuid: null,
      importedFrameUuid: null,
      originalClientPath: asset.current_client_path,
      plannedGeneratedPath: generatedAssetPath(asset, bundle),
      resourcePath: generatedAssetPath(asset, bundle).replace(/\.png$/i, '').replace(bundle === 'milk-tea' ? 'bundles/milk_tea/' : `bundles/${bundle}/`, '') + '/spriteFrame',
      // Each staged PNG is already the approved crop; never trim its transparent
      // sampling border a second time. Its frame rect starts at the crop texture origin.
      frame: { originalSize: asset.original_size, rect: [0, 0, width, height], sourceCropRect: [x0, y0, x1, y1], offset: asset.offset, pivot: asset.pivot, rotated: false },
      logicalFrameId: asset.stable_asset_id,
      sourceState: asset.source_state,
    });
  }
  const byHash = new Map();
  for (const row of rows) {
    const group = byHash.get(row.approvedSha256) ?? [];
    group.push(row.stableAssetId); byHash.set(row.approvedSha256, group);
  }
  const aliases = [...byHash.entries()].filter(([, ids]) => ids.length > 1)
    .map(([sha256, ids]) => ({ sha256, canonicalImageAssetId: ids[0], logicalAssetIds: ids, shareImageOnly: true }));
  const aliasById = new Map();
  for (const alias of aliases) for (const id of alias.logicalAssetIds) aliasById.set(id, alias);
  const rowById = new Map(rows.map(row => [row.stableAssetId, row]));
  for (const row of rows) {
    const alias = aliasById.get(row.stableAssetId);
    const canonical = alias && rowById.get(alias.canonicalImageAssetId);
    row.sourceAssetId = row.stableAssetId;
    row.plannedCanonicalImageUuid = row.originImageUuid;
    if (canonical) {
      row.canonicalImageAssetId = canonical.stableAssetId;
      row.plannedCanonicalImageUuid = canonical.originImageUuid;
      row.plannedGeneratedPath = canonical.plannedGeneratedPath;
      row.resourcePath = canonical.resourcePath;
    } else row.canonicalImageAssetId = row.stableAssetId;
  }
  const bundleDefinitions = Object.fromEntries(bundlePlan.planned_local_bundles.map(b => [b.id, {
    directory: b.planned_directory, dependencies: b.dependencies, consumers: b.consumers,
  }]));
  const moduleManifests = Object.fromEntries(Object.keys(bundleDefinitions).map(id => [id, {
    bundle: id,
    dependencies: bundleDefinitions[id].dependencies,
    assets: Object.fromEntries(rows.filter(row => row.bundle === id).map(row => [row.stableAssetId, {
      path: row.resourcePath, type: 'SpriteFrame', revision: row.approvedSha256,
    }])),
  }]));
  return { schemaVersion: 1, transformId: 'approved-crop-derived-frame-v1', evidenceStatus: 'SOURCE_VALIDATED_NOT_CREATOR_IMPORTED', assetCount: rows.length,
    bundleDefinitions, moduleManifests, assets: rows, aliases };
}

function main(argv) {
  const outputArg = argv[2];
  const manifest = buildManifest();
  const serialized = `${JSON.stringify(manifest, null, 2)}\n`;
  if (outputArg) fs.writeFileSync(path.resolve(ROOT, outputArg), serialized);
  else process.stdout.write(serialized);
  const runtimeArg = argv.find(arg => arg.startsWith('--runtime-ts='));
  if (runtimeArg) {
    const runtimePath = path.resolve(ROOT, runtimeArg.slice('--runtime-ts='.length));
    fs.writeFileSync(runtimePath, renderRuntimeRegistry(manifest));
  }
}

function renderRuntimeRegistry(manifest) {
  const definitions = Object.entries(manifest.moduleManifests).map(([id, module]) => {
    const assets = Object.entries(module.assets).map(([assetId, resource]) =>
      `      ${JSON.stringify(assetId)}: { path: ${JSON.stringify(resource.path)}, type: SpriteFrame, revision: ${JSON.stringify(resource.revision)} },`).join('\n');
    return `  ${JSON.stringify(id)}: { bundle: ${JSON.stringify(module.bundle)}, dependencies: ${JSON.stringify(module.dependencies)}, assets: {\n${assets}\n    } },`;
  }).join('\n');
  const descriptors = manifest.assets.map(row => `  { stableAssetId: ${JSON.stringify(row.stableAssetId)}, bundle: ${JSON.stringify(row.bundle)}, sourceAssetId: ${JSON.stringify(row.sourceAssetId)}, originalSize: ${JSON.stringify(row.frame.originalSize)}, rect: ${JSON.stringify(row.frame.rect)}, offset: ${JSON.stringify(row.frame.offset)}, pivot: ${JSON.stringify(row.frame.pivot)}, revision: ${JSON.stringify(row.approvedSha256)} },`).join('\n');
  return `// Generated from the Tech-approved asset handoff map. Do not hand edit.\nimport { SpriteFrame } from 'cc';\nimport { ModuleManifest } from '../module-assets/module_assets';\nimport { DerivedAssetManifest } from './derived_asset_resolver';\n\nexport const APPROVED_ASSET_MODULE_MANIFEST: ModuleManifest = {\n${definitions}\n};\n\nexport const APPROVED_DERIVED_ASSET_MANIFEST: DerivedAssetManifest = {\n  assets: [\n${descriptors}\n  ],\n};\n`;
}

if (require.main === module) {
  try { main(process.argv); }
  catch (error) { console.error(`asset manifest generation failed: ${error.message}`); process.exitCode = 1; }
}

module.exports = { buildManifest, bundleFor, pngSize, renderRuntimeRegistry };
