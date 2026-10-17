'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/resources/3d/engine/node_modules/typescript');
const { buildManifest } = require('../../../apps/client/tools/asset-integration/asset_manifest_generator.cjs');

const ROOT = path.resolve(__dirname, '../../..');
const SOURCE = path.join(ROOT, 'apps/client/assets/framework/asset-integration/derived_asset_resolver.ts');
const MODULE_SOURCE = path.join(ROOT, 'apps/client/assets/framework/module-assets/module_assets.ts');

class Vec2 { constructor(x, y) { this.x = x; this.y = y; } }
class Size { constructor(width, height) { this.width = width; this.height = height; } }
class Rect { constructor(x, y, width, height) { Object.assign(this, { x, y, width, height }); } }
class SpriteFrame {
  constructor() { this.isValid = true; this.destroyCount = 0; }
  reset(data) { this.resetData = data; this.texture = data.texture; }
  destroy() { this.destroyCount++; this.isValid = false; }
}

function compileCommonJs(filename, requireMap = {}) {
  const source = fs.readFileSync(filename, 'utf8');
  const js = ts.transpile(source, { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019, experimentalDecorators: true });
  const module = { exports: {} };
  const localRequire = id => Object.prototype.hasOwnProperty.call(requireMap, id) ? requireMap[id] : require(id);
  new Function('require', 'module', 'exports', js)(localRequire, module, module.exports);
  return module.exports;
}

async function run() {
  const manifest = buildManifest(ROOT);
  assert.equal(manifest.assetCount, 83);
  assert.equal(manifest.evidenceStatus, 'SOURCE_VALIDATED_NOT_CREATOR_IMPORTED');
  assert(manifest.assets.every(row => row.frame.originalSize[0] > 0 && row.frame.rect[0] === 0 && row.frame.rect[1] === 0
    && row.frame.rect[2] > 0 && row.frame.pivot[0] === 0.5 && row.frame.sourceCropRect.length === 4),
  '83个派生帧都应从裁片纹理原点开始，原图裁切坐标单独保留');
  assert(manifest.aliases.length >= 10, '应该保留批准映射中完全重复图像的共享候选');
  assert(manifest.aliases.every(alias => alias.shareImageOnly && alias.logicalAssetIds.length === 2));
  assert.deepEqual(Object.fromEntries(Object.keys(manifest.bundleDefinitions).map(bundle => [bundle, manifest.assets.filter(row => row.bundle === bundle).length])),
    { world: 15, tourist: 40, shops: 12, dialogue: 0, 'milk-tea': 16 });
  assert(manifest.aliases.every(alias => {
    const [a, b] = alias.logicalAssetIds.map(id => manifest.assets.find(row => row.stableAssetId === id));
    return a && b && a.resourcePath === b.resourcePath && a.logicalFrameId !== b.logicalFrameId && a.importedImageUuid === null;
  }), '别名仅共享计划图片路径，保留逻辑帧并且不伪报实际导入UUID');

  const sourceFrame = new SpriteFrame();
  const sharedTexture = { width: 60, height: 50, name: 'same-name' };
  sourceFrame.texture = sharedTexture;
  const secondSourceFrame = new SpriteFrame();
  secondSourceFrame.texture = { width: 60, height: 50, name: 'same-name' };
  let loadCount = 0, releaseCount = 0;
  const { ModuleAssets } = compileCommonJs(MODULE_SOURCE);
  const loader = {
    async load(_bundle, assetPath) { loadCount++; return assetPath === 'shared/other' ? secondSourceFrame : sourceFrame; },
    release() { releaseCount++; },
  };
  const modules = new ModuleAssets({
    'milk-tea': { bundle: 'milk-tea', assets: {
      ghostRun: { path: 'shared/source', type: SpriteFrame },
      ghostWalk: { path: 'shared/source', type: SpriteFrame },
      ghostOther: { path: 'shared/other', type: SpriteFrame },
    } },
  }, loader);
  const { DerivedAssetResolver } = compileCommonJs(SOURCE, { cc: { Rect, Size, SpriteFrame, Vec2 }, '../module-assets/module_assets': { ModuleAssets } });
  const resolver = new DerivedAssetResolver(modules, { assets: [
    { stableAssetId: 'ghostRun', bundle: 'milk-tea', sourceAssetId: 'ghostRun', originalSize: [100, 80], rect: [0, 0, 60, 50], offset: [2, -3], pivot: [0.5, 0.5] },
    { stableAssetId: 'ghostWalk', bundle: 'milk-tea', sourceAssetId: 'ghostWalk', originalSize: [100, 80], rect: [0, 0, 60, 50], offset: [2, -3], pivot: [0.5, 0.5] },
    { stableAssetId: 'ghostOther', bundle: 'milk-tea', sourceAssetId: 'ghostOther', originalSize: [100, 80], rect: [0, 0, 60, 50], offset: [2, -3], pivot: [0.5, 0.5] },
    { stableAssetId: 'badRect', bundle: 'milk-tea', sourceAssetId: 'ghostRun', originalSize: [100, 80], rect: [1, 0, 60, 50], offset: [2, -3], pivot: [0.5, 0.5] },
  ] });
  const runLease = await resolver.acquire('ghostRun', { token: 'run', generation: 1 });
  const walkLease = await resolver.acquire('ghostWalk', { token: 'walk', generation: 2 });
  assert.equal(loadCount, 2, '模块按两个canonical路径各加载一次，同路径逻辑别名只加载一次');
  assert.equal(runLease.frame, walkLease.frame, '相同纹理和几何共享派生帧实例');
  assert.deepEqual(runLease.frame.resetData.originalSize, new Size(100, 80));
  assert.deepEqual(runLease.frame.resetData.rect, new Rect(0, 0, 60, 50));
  assert.deepEqual(runLease.frame.resetData.offset, new Vec2(2, -3));
  assert.equal(resolver.getLiveDerivedCount(), 1);
  runLease.release();
  assert.equal(walkLease.frame.isValid, true, '仍被引用时不可销毁派生帧');
  walkLease.release();
  assert.equal(walkLease.frame.isValid, false, '最后租约释放后销毁派生帧');
  assert.equal(resolver.getLiveDerivedCount(), 0);
  assert.equal(releaseCount, 2, '模块释放时每个canonical路径仅释放一次');
  assert.equal(sourceFrame.isValid, true, '不得销毁或改写导入源frame');
  const otherLease = await resolver.acquire('ghostOther', { token: 'other', generation: 3 });
  assert.notEqual(otherLease.frame, runLease.frame, '无UUID且同名的不同Texture不得串用派生帧');
  otherLease.release();
  await assert.rejects(() => resolver.acquire('badRect', { token: 'bad', generation: 4 }), /超出实际Texture/,
    'rect必须相对于真实Texture尺寸校验，而不是仅对originalSize校验');

  const badMap = JSON.parse(fs.readFileSync(path.join(ROOT, 'deliverables/tech_lead/MINIGAME-ART-OPT-IMPORT-TECH-20261017/v0.1/APPROVED_ASSET_HANDOFF_MAP.json'), 'utf8'));
  badMap.assets[0].export_sha256 = '0'.repeat(64);
  const os = require('node:os');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'asset-map-invalid-'));
  try {
    const badPath = path.join(tmp, 'bad.json'); fs.writeFileSync(badPath, JSON.stringify(badMap));
    assert.throws(() => buildManifest(ROOT, badPath), /hash不匹配/);
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  console.log('asset integration checks passed: 83 source rows, generated-frame geometry, lease sharing/release, source immutability, bad hash rejection');
}

run().catch(error => { console.error(error); process.exitCode = 1; });
