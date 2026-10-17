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
const U01_SOURCE = path.join(ROOT, 'apps/client/assets/labs/u01/sakura_layout_editor.ts');
const U01_LAYOUT_SOURCE = path.join(ROOT, 'apps/client/assets/labs/u01/sakura_v03_layout.ts');
const U05_ACCESSIBILITY_SOURCE = path.join(ROOT, 'apps/client/assets/labs/u05/u05_accessibility.ts');
const COCOS_LOADER_SOURCE = path.join(ROOT, 'apps/client/assets/framework/module-assets/cocos_bundle_loader.ts');
const CLIENT_MODULES_SOURCE = path.join(ROOT, 'apps/client/assets/framework/asset-integration/client_asset_modules.ts');
const APPROVED_REGISTRY_SOURCE = path.join(ROOT, 'apps/client/assets/framework/asset-integration/approved_asset_registry.ts');
const U04_REGISTRY_SOURCE = path.join(ROOT, 'apps/client/assets/framework/module-assets/u04_module_registry.ts');
const U05_SOURCE = path.join(ROOT, 'apps/client/assets/labs/u05/milk_tea_lab.ts');

class Vec2 { constructor(x, y) { this.x = x; this.y = y; } }
class Size { constructor(width, height) { this.width = width; this.height = height; } }
class Rect { constructor(x, y, width, height) { Object.assign(this, { x, y, width, height }); } }
class SpriteFrame {
  constructor() { this.isValid = true; this.destroyCount = 0; this.packable = true; }
  reset(data) { this.resetData = data; this.texture = data.texture; }
  destroy() { this.destroyCount++; this.isValid = false; }
}

function compileCommonJs(filename, requireMap = {}) {
  const source = fs.readFileSync(filename, 'utf8');
  // Match Creator's legacy production transform closely enough to catch Set/Map
  // spread and iterator assumptions that pass under modern Node targets.
  const js = ts.transpile(source, { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES5,
    downlevelIteration: false, experimentalDecorators: true });
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

  const layout = compileCommonJs(U01_LAYOUT_SOURCE).SAKURA_V03_LAYOUT;
  class Color { constructor() {} }
  const cc = new Proxy({ Color, Vec2: class {}, Vec3: class {} }, { get: (obj, key) => obj[key] ?? class {} });
  const u01 = compileCommonJs(U01_SOURCE, {
    cc,
    './sakura_v03_layout': { SAKURA_V03_LAYOUT: layout },
    './sakura_v03_environment': { SakuraV03Motion: class {}, attachSakuraV03EyeGlow() {} },
    './sakura_water_motion_math': { deriveWaterGroups() { return []; } },
    './sakura_user_layout': { USER_LAYOUT_PROFILE: { instances: [] } },
    '../../framework/ui/scrollable_text_panel': { ScrollableTextPanel: class {} },
  });
  assert.equal(u01.prototypeBundlePath('tex_sakura_rr_far_l'), 'sakura_v03/tex_sakura_rr_far_l_eye_dark_base',
    'far_l应根据实际layout源路径读dark_base，不得把稳定逻辑ID当成旧far_l.png文件名');
  assert.equal(u01.prototypeBundlePath('tex_sakura_rr_bridge_body_l'), 'sakura_v03/tex_sakura_rr_bridge_body_l_clean',
    'bridge body逻辑ID必须保留当前clean源纹理路径');
  assert.equal(u01.prototypeBundlePath('tex_sakura_rr_bridge_body_r'), 'sakura_v03/tex_sakura_rr_bridge_body_r_clean');

  const sourceFrame = new SpriteFrame();
  const sharedTexture = { width: 60, height: 50, name: 'same-name' };
  sourceFrame.texture = sharedTexture;
  const secondSourceFrame = new SpriteFrame();
  secondSourceFrame.texture = { width: 60, height: 50, name: 'same-name' };
  let loadCount = 0, releaseCount = 0;
  const { ModuleAssets } = compileCommonJs(MODULE_SOURCE);
  const emittedModuleAssets = ts.transpile(fs.readFileSync(MODULE_SOURCE, 'utf8'), {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES5, downlevelIteration: false,
  });
  assert(!emittedModuleAssets.includes('concat(operations)'), 'Set应通过Array.from显式转数组，不可依赖ES5 spread降级');
  assert(!emittedModuleAssets.includes('concat(this.entries.values())'), 'Map.values应显式Array.from转数组');
  const u05Accessibility = compileCommonJs(U05_ACCESSIBILITY_SOURCE);
  const proxyGroups = u05Accessibility.conflictingHitGroups([
    { group: 'tea', rect: { x: 0, y: 0, width: 48, height: 48 } },
    { group: 'milk', rect: { x: 44, y: 0, width: 48, height: 48 } },
    { group: 'topping', rect: { x: 200, y: 0, width: 48, height: 48 } },
  ]);
  assert.deepEqual(proxyGroups.sort(), ['milk', 'tea'], 'U05代理组Set经Creator式ES5转译后仍应返回全部真实分组');
  let cancelLoadReleaseCount = 0;
  const cancelModules = new ModuleAssets({ pending: { bundle: 'pending', assets: { one: { path: 'one', type: 'json' } } } }, {
    load() { return new Promise(resolve => setTimeout(() => resolve({ ok: true }), 5)); },
    release() { cancelLoadReleaseCount++; },
  });
  const cancelled = cancelModules.acquire('pending', { token: 'cancel-owner-set', generation: 1 });
  assert.equal(cancelModules.getInFlightCount(), 1, 'Map.values转数组后应统计真实loading条目');
  cancelModules.cancelOwner('cancel-owner-set');
  await assert.rejects(cancelled, /取消/);
  await new Promise(resolve => setTimeout(resolve, 15));
  assert.equal(cancelModules.getInFlightCount(), 0);
  assert.equal(cancelLoadReleaseCount, 1, 'cancelOwner必须实际遍历Set并释放迟到成功的加载');
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
  const bundleLease = await resolver.acquireModule('milk-tea', { token: 'bundle', generation: 1 });
  const runLease = bundleLease.getFrame('ghostRun');
  const walkLease = bundleLease.getFrame('ghostWalk');
  assert.equal(loadCount, 2, '模块按两个canonical路径各加载一次，同路径逻辑别名只加载一次');
  assert.equal(runLease.frame, walkLease.frame, '相同纹理和几何共享派生帧实例');
  assert.deepEqual(runLease.frame.resetData.originalSize, new Size(100, 80));
  assert.deepEqual(runLease.frame.resetData.rect, new Rect(0, 0, 60, 50));
  assert.deepEqual(runLease.frame.resetData.offset, new Vec2(2, -3));
  assert.equal(runLease.frame.packable, false, '派生独立Texture帧必须关闭动态Atlas打包');
  const otherLease = bundleLease.getFrame('ghostOther');
  assert.notEqual(otherLease.frame, runLease.frame, '无UUID且同名的不同Texture同时活跃时不得串用派生帧');
  assert.equal(resolver.getLiveDerivedCount(), 2);
  otherLease.release();
  assert.equal(resolver.getLiveDerivedCount(), 1);
  runLease.release();
  assert.equal(walkLease.frame.isValid, true, '仍被引用时不可销毁派生帧');
  bundleLease.release();
  assert.equal(walkLease.frame.isValid, false, '最后租约释放后销毁派生帧');
  assert.equal(resolver.getLiveDerivedCount(), 0);
  assert.equal(releaseCount, 2, '模块释放时每个canonical路径仅释放一次');
  assert.equal(sourceFrame.isValid, true, '不得销毁或改写导入源frame');
  await assert.rejects(() => resolver.acquire('badRect', { token: 'bad', generation: 4 }), /超出实际Texture/,
    'rect必须相对于真实Texture尺寸校验，而不是仅对originalSize校验');

  // Exercise the production CocosBundleLoader's per-instance addRef/decRef
  // ownership against an indirect Prefab -> SpriteFrame -> Texture graph.
  class RefAsset {
    constructor(name, dependencies = []) { this.name = name; this.dependencies = dependencies; this.refCount = 0; this.destroyed = false; }
    addRef() { if (this.destroyed) throw new Error(`addRef destroyed ${this.name}`); this.refCount++; return this; }
    decRef() {
      if (this.refCount > 0) this.refCount--;
      if (this.refCount === 0 && !this.destroyed) {
        this.destroyed = true;
        for (const dependency of this.dependencies) dependency.decRef();
      }
      return this;
    }
  }
  const texture = new RefAsset('texture'); texture.addRef(); // SpriteFrame dependency edge
  const frame = new RefAsset('frame', [texture]); frame.addRef(); // Prefab dependency edge
  const prefab = new RefAsset('prefab', [frame]);
  const assets = { prefab, frame };
  const fakeBundle = { load(assetPath, _type, cb) { cb(null, assets[assetPath]); } };
  const fakeCc = { assetManager: { getBundle: () => fakeBundle, loadBundle: (_name, cb) => cb(null, fakeBundle) } };
  const { CocosBundleLoader } = compileCommonJs(COCOS_LOADER_SOURCE, { cc: fakeCc });
  const runtimeModules = new ModuleAssets({
    shopPage: { bundle: 'shops', assets: { shop: { path: 'prefab', type: class Prefab {} } } },
    touristPage: { bundle: 'tourist', assets: { accessory: { path: 'frame', type: class SpriteFrame {} } } },
  }, new CocosBundleLoader());
  const shopLease = await runtimeModules.acquire('shopPage', { token: 'page-shop', generation: 1 });
  const touristLease = await runtimeModules.acquire('touristPage', { token: 'page-tourist', generation: 1 });
  touristLease.release();
  assert.equal(frame.destroyed, false, '释放仅持有SpriteFrame的B页不得破坏A Prefab引用的Frame');
  assert.equal(texture.destroyed, false, 'B页退出时A Prefab仍持有Frame与Texture依赖');
  shopLease.release();
  assert.equal(frame.destroyed, true, '最后A Prefab退出后Frame依赖应释放');
  assert.equal(texture.destroyed, true, '最后A Prefab退出后Texture依赖应释放');

  const unsafeBundle = { load(_path, _type, cb) { cb(null, { name: 'unsafe' }); } };
  const unsafeLoader = new CocosBundleLoader();
  unsafeLoader['bundles'].set('unsafe', unsafeBundle);
  await assert.rejects(() => unsafeLoader.load('unsafe', 'asset', class Asset {}), /不支持可验证的addRef\/decRef/,
    '运行时Asset缺少addRef/decRef时必须显式失败');

  const ccStub = new Proxy({
    BitmapFont: class BitmapFont {}, JsonAsset: class JsonAsset {}, Prefab: class Prefab {}, SpriteFrame,
    Color: class Color {}, Component: class Component {}, _decorator: { ccclass: () => target => target },
  }, { get: (target, key) => target[key] ?? class {} });
  const approvedRegistry = compileCommonJs(APPROVED_REGISTRY_SOURCE, { cc: ccStub });
  const u04Registry = compileCommonJs(U04_REGISTRY_SOURCE, { cc: ccStub });
  const u05Module = compileCommonJs(U05_SOURCE, {
    cc: ccStub,
    './milk_tea_state': {}, './u05_bitmap_text': { U05BitmapText: class {} },
    '../../framework/viewport': { ViewportAdapter: class {}, ViewportMapper: class {} },
    './u05_nine_slice_plate': { U05NineSlicePlate: class {} },
    './u05_accessibility': u05Accessibility,
    '../u02/tourist_state': {}, '../u02/tourist_adapter': { ApprovedTouristAdapter: class {} },
    '../u02/tourist_view': { TouristView: class {} }, './u05_interaction_presentation': {},
  });
  const actualModuleAssets = compileCommonJs(MODULE_SOURCE);
  const registry = compileCommonJs(CLIENT_MODULES_SOURCE, {
    cc: ccStub,
    '../module-assets/cocos_bundle_loader': { CocosBundleLoader: class CocosBundleLoader {} },
    '../module-assets/module_assets': actualModuleAssets,
    '../module-assets/u04_module_registry': u04Registry,
    './approved_asset_registry': approvedRegistry,
    './derived_asset_resolver': { DerivedAssetResolver: class DerivedAssetResolver {} },
    '../../labs/u01/sakura_v03_layout': { SAKURA_V03_LAYOUT: layout },
    '../../labs/u05/milk_tea_lab': u05Module,
  });
  const runtimeManifest = registry.CLIENT_ASSET_MODULE_MANIFEST;
  assert.equal(runtimeManifest.world.assets.tex_sakura_rr_far_l_dark_base.path,
    'sakura_v03/tex_sakura_rr_far_l_eye_dark_base/spriteFrame');
  assert(!runtimeManifest.world.assets.tex_sakura_rr_far_l, '当前world生产清单不得载入未使用的批准far_l裁片');
  assert.equal(runtimeManifest.tourist.assets.touristHatFront.path,
    'ghost-customer/accessories/tex_ug_acc_hat_01_front/spriteFrame');
  assert.equal(runtimeManifest.tourist.assets.touristGlassesFront.path,
    'ghost-customer/accessories/tex_ug_acc_glasses_01_front/spriteFrame');
  assert.equal(runtimeManifest.tourist.assets.touristWristbandFront.path,
    'ghost-customer/accessories/tex_ug_acc_wristband_01_front/spriteFrame');
  assert.equal(runtimeManifest.tourist.assets.touristWristbandBack.path,
    'ghost-customer/accessories/tex_ug_acc_wristband_01_back/spriteFrame');
  assert.equal(runtimeManifest['milk-tea'].assets.STATIC_BARE_PATCH04.path,
    'u05_milk_tea/u05_b/STATIC_BARE_PATCH04/spriteFrame');
  assert(!runtimeManifest['milk-tea'].assets.STATIC_BARE, '旧STATIC_BARE不进入U05运行时加载清单');
  assert.equal(runtimeManifest['milk-tea'].assets.LABEL_PLATE_9SLICE.path,
    'u05_milk_tea/u05_b/LABEL_PLATE_9SLICE/spriteFrame');
  assert(!runtimeManifest['milk-tea'].assets.STATIC_BARE, '旧未使用STATIC_BARE不进入U05运行时加载清单');
  for (const id of ['LOCK_MILK', 'LOCK_TEA', 'LOCK_TOP']) {
    assert(runtimeManifest['milk-tea'].assets[id], `批准锁定裁片必须保留在production manifest: ${id}`);
  }

  const stagingRoot = process.argv[2];
  if (stagingRoot) {
    const stage = path.resolve(stagingRoot);
    const platformConfigs = ['web-mobile', 'wechatgame', 'bytedance-mini-game'].map(platform =>
      JSON.parse(fs.readFileSync(path.join(stage, `build-configs/${platform}.json`), 'utf8')));
    const webConfig = platformConfigs[0];
    const roots = new Map(webConfig.bundleConfigs.map(item => [item.name,
      path.resolve(stage, 'assets', item.root.replace(/^db:\/\/assets\//, ''))]));
    for (const config of platformConfigs) {
      const configured = new Map(config.bundleConfigs.map(item => [item.name, item.root]));
      for (const name of roots.keys()) assert(configured.has(name), `${config.platform}构建配置缺少Bundle ${name}`);
      for (const item of config.bundleConfigs) assert.equal(item.isRemote, false, `${config.platform}/${item.name}不得为远程Bundle`);
    }
    const suffixFor = resource => {
      const type = resource.type?.name;
      if (type === 'SpriteFrame') {
        assert(resource.path.endsWith('/spriteFrame'), `SpriteFrame path缺少spriteFrame后缀: ${resource.path}`);
        return { stem: resource.path.slice(0, -'/spriteFrame'.length), extension: '.png' };
      }
      if (type === 'Prefab') return { stem: resource.path, extension: '.prefab' };
      if (type === 'JsonAsset') return { stem: resource.path, extension: '.json' };
      if (type === 'BitmapFont') return { stem: resource.path, extension: '.fnt' };
      throw new Error(`production manifest使用了未登记资源类型 ${String(type)} ${resource.path}`);
    };
    const missing = [];
    for (const [moduleId, definition] of Object.entries(runtimeManifest)) {
      const bundleRoot = roots.get(definition.bundle);
      assert(bundleRoot, `构建配置缺少运行时Bundle ${definition.bundle}（模块${moduleId}）`);
      for (const [assetId, resource] of Object.entries(definition.assets)) {
        const { stem, extension } = suffixFor(resource);
        const file = path.join(bundleRoot, `${stem}${extension}`);
        if (!fs.existsSync(file)) missing.push(`${definition.bundle}/${resource.path} (${moduleId}.${assetId} -> ${file})`);
        else if (!fs.existsSync(`${file}.meta`)) missing.push(`${definition.bundle}/${resource.path} missing .meta (${moduleId}.${assetId})`);
      }
    }
    assert.deepEqual(missing, [], `真实production manifest路径必须全部落在staging assets与Creator构建Bundle roots: ${missing.join('\n')}`);
    assert(!runtimeManifest.world.assets.tex_sakura_rr_far_l, 'production合并之后不能重新引入退役far_l');
    console.log(`production manifest coverage passed: ${Object.values(runtimeManifest).reduce((n, module) => n + Object.keys(module.assets).length, 0)} runtime paths across ${roots.size} configured bundle roots`);
  }

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
