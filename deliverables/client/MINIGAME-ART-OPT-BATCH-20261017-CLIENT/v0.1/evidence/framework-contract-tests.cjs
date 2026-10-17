const assert = require('node:assert/strict');
const ts = require('/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/resources/3d/editor-native-scene/node_modules/typescript');
const fs = require('node:fs');
require.extensions['.ts'] = (mod, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  mod._compile(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, experimentalDecorators: true } }).outputText, filename);
};
const root = process.cwd();
const { ModuleAssets } = require(`${root}/apps/client/assets/framework/module-assets/module_assets.ts`);
const { ViewportMapper } = require(`${root}/apps/client/assets/framework/viewport/viewport_mapper.ts`);
const { WebViewportAdapter, WeChatViewportAdapter } = require(`${root}/apps/client/assets/framework/viewport/viewport_adapter.ts`);
const tick = () => new Promise(resolve => setImmediate(resolve));

async function moduleLeaseTests() {
  const loaded = [], released = [];
  const loader = { async load(bundle, path) { loaded.push(`${bundle}/${path}`); return { path }; }, release(bundle, path) { released.push(`${bundle}/${path}`); } };
  const manifest = { one: { bundle: 'b', assets: { frame: { path: 'shared', type: 'SpriteFrame' } } } };
  const assets = new ModuleAssets(manifest, loader);
  const a = assets.acquire('one', 7), b = assets.acquire('one', 7);
  const [la, lb] = await Promise.all([a, b]);
  assert.equal(la.owner.generation, 7); assert.notEqual(la.owner.token, lb.owner.token);
  assert.equal(loaded.length, 1); assert.equal(assets.getRefCount('b', 'shared', 'SpriteFrame'), 2);
  la.release(); la.release(); assert.equal(released.length, 0);
  assert.equal(lb.get('frame').path, 'shared'); lb.release(); lb.release();
  assert.equal(released.length, 1); assert.equal(assets.getRefCount('b', 'shared', 'SpriteFrame'), 0);

  const releaseOrder = [];
  const releaseFault = new ModuleAssets({ dep: { bundle: 'b', assets: { d: { path: 'dep-fault', type: 't' } } },
    root: { bundle: 'b', dependencies: ['dep'], assets: { r: { path: 'root-fault', type: 't' } } } },
    { async load(_bundle,path) { return path; }, release(_bundle,path) { releaseOrder.push(path); if(path==='root-fault') throw new Error('expected release failure'); } });
  const faultLease = await releaseFault.acquire('root', 9);
  assert.throws(() => faultLease.release(), /释放模块资源/);
  faultLease.release();
  assert.deepEqual(releaseOrder, ['root-fault','dep-fault']);
  assert.equal(releaseFault.getRefCount('b','dep-fault','t'),0);
  assert.equal(releaseFault.getRefCount('b','root-fault','t'),0);

  const rollback = new ModuleAssets({ dep:{bundle:'b',assets:{d:{path:'rollback-dep',type:'t'}}},
    root:{bundle:'b',dependencies:['dep'],assets:{r:{path:'rollback-root',type:'t'}}} },
    { async load(_b,path) { if(path==='rollback-root') throw new Error('root load failure'); return path; },
      release(_b,path) { if(path==='rollback-dep') throw new Error('dependency release failure'); } });
  await Promise.race([assert.rejects(rollback.acquire('root',1),/root load failure/),
    new Promise((_,reject)=>setTimeout(()=>reject(new Error('failed acquire remained pending')),250))]);
  assert.equal(rollback.getRefCount('b','rollback-dep','t'),0);

  const ownerReleaseAttempts=[];
  const multiOwner = new ModuleAssets({ a:{bundle:'b',assets:{x:{path:'owner-a',type:'t'}}},
    b:{bundle:'b',assets:{x:{path:'owner-b',type:'t'}}} },
    {async load(_b,path){return path;},release(_b,path){ownerReleaseAttempts.push(path);if(path==='owner-a')throw new Error('owner release failure');}});
  const sharedOwner={token:'multi-owner',generation:3};
  const ownerA=await multiOwner.acquire('a',sharedOwner),ownerB=await multiOwner.acquire('b',sharedOwner);
  assert.throws(()=>multiOwner.cancelOwner('multi-owner'),/取消Owner/);
  assert.deepEqual(ownerReleaseAttempts,['owner-a','owner-b']);
  assert.equal(multiOwner.getRefCount('b','owner-a','t'),0);assert.equal(multiOwner.getRefCount('b','owner-b','t'),0);
  ownerA.release();ownerB.release();

  const order = [];
  const dependent = new ModuleAssets({ dep: { bundle: 'b', assets: { d: { path: 'dep', type: 't' } } },
    root: { bundle: 'b', dependencies: ['dep'], assets: { r: { path: 'root', type: 't' } } } },
    { async load(_bundle, path) { order.push(`load:${path}`); return path; }, release(_bundle, path) { order.push(`release:${path}`); } });
  const lease = await dependent.acquire('root', { token: 'owner-reverse', generation: 1 });
  lease.release(); assert.deepEqual(order, ['load:dep', 'load:root', 'release:root', 'release:dep']);

  let attempts = 0, retriesReleased = 0;
  const retry = new ModuleAssets({ item: { bundle: 'b', assets: { x: { path: 'retry', type: 't' } } } },
    { async load() { attempts++; if (attempts === 1) throw new Error('expected failure'); return 'ok'; }, release() { retriesReleased++; } });
  await assert.rejects(retry.acquire('item', 4)); assert.equal(retry.getRefCount('b', 'retry', 't'), 0);
  const retried = await retry.acquire('item', 4); assert.equal(retried.get('x'), 'ok'); retried.release();
  assert.equal(attempts, 2); assert.equal(retriesReleased, 1);

  let finishDep; const gate = new Promise(resolve => { finishDep = resolve; }); const started = [];
  let cancelRelease = 0;
  const cancellable = new ModuleAssets({ dep: { bundle: 'b', assets: { d: { path: 'slow-dep', type: 't' } } },
    root: { bundle: 'b', dependencies: ['dep'], assets: { r: { path: 'must-not-start', type: 't' } } } },
    { async load(_bundle, path) { started.push(path); if (path === 'slow-dep') return gate; return path; }, release() { cancelRelease++; } });
  const cancelled = cancellable.acquire('root', 5); await tick(); cancelled.cancel(); finishDep('late-dep');
  await assert.rejects(cancelled, /取消/); await tick();
  assert.deepEqual(started, ['slow-dep']); assert.equal(cancelRelease, 1);

  let cyclesReleased = 0;
  const cycles = new ModuleAssets(manifest, { async load(_bundle, path) { return path; }, release() { cyclesReleased++; } });
  for (let i = 0; i < 20; i++) { const x = await cycles.acquire('one', i); x.release(); x.release(); }
  assert.equal(cyclesReleased, 20); assert.equal(cycles.getInFlightCount(), 0);
  return { sharedLoadCalls: loaded.length, sharedRefCount: 2, dependencyReleaseOrder: order.filter(x => x.startsWith('release:')),
    releaseFaultCleanupOrder: releaseOrder, rollbackReleaseErrorSettles: true,
    cancelOwnerContinuesAfterReleaseError: ownerReleaseAttempts,
    retryAttempts: attempts, cancelSkippedRootLoad: !started.includes('must-not-start'), cycles: 20, cyclesReleased };
}

async function viewportTests() {
  const snapshot = { revision: 1, width: 400, height: 800, dpr: 3, orientation: 'portrait',
    content: { x: 40, y: 20, width: 320, height: 760 }, safe: { x: 40, y: 64, width: 320, height: 682 },
    capsule: { x: 272, y: 32, width: 88, height: 32 }, diagnostics: [] };
  const point = ViewportMapper.mapWindowPointToUI({ x: 200, y: 400 }, snapshot.content, { width: 720, height: 1280 });
  assert.deepEqual(point, { x: 0, y: 0 });
  const safe = ViewportMapper.safeUiRect(snapshot, { width: 720, height: 1280 });
  assert.ok(safe && safe.x < 0 && safe.y > -640 && safe.height > 0);
  assert.equal(ViewportMapper.logicalPixelsToUI(48, snapshot, { width: 720, height: 1280 }), 48*Math.max(720/320,1280/760));
  const capsuleSnapshot={...snapshot,safe:{x:0,y:300,width:400,height:100},content:{x:0,y:0,width:400,height:800},capsule:{x:200,y:330,width:80,height:30}};
  const capsuleSafe=ViewportMapper.safeWithCapsule(capsuleSnapshot);
  assert.deepEqual(capsuleSafe,{x:0,y:368,width:400,height:32});

  let raf = null, changed = 0, fail = false;
  global.window = { innerWidth: 320, innerHeight: 640, devicePixelRatio: 2,
    addEventListener() {}, removeEventListener() {}, requestAnimationFrame(fn) { raf = fn; return 1; }, cancelAnimationFrame() {} };
  const probe = { setAttribute() {}, style: {}, parentNode: null };
  global.document = { documentElement: { appendChild(node) { node.parentNode = this; }, removeChild(node) { node.parentNode = null; } },
    createElement() { return probe; }, querySelector() { return null; } };
  global.getComputedStyle = () => { if (fail) throw new Error('mock platform read failure'); return { paddingTop: '0px', paddingRight: '0px', paddingBottom: '0px', paddingLeft: '0px' }; };
  const adapter = new WebViewportAdapter(() => null);
  const off = adapter.subscribe(s => { changed++; });
  const initial = adapter.read(); global.window.innerWidth = 360; adapter.read();
  assert.equal(changed, 1, 'read() must not consume or prematurely notify resize');
  adapter['onResize'](); const scheduled = raf; assert.equal(typeof scheduled, 'function');
  scheduled(); assert.equal(changed, 2, 'queued resize must notify after a synchronous read');
  const good = adapter.read(); global.window.innerWidth = 0; const zero = adapter.read();
  assert.equal(zero.width, good.width); assert.equal(zero.revision, good.revision);
  global.window.innerWidth = 380; fail = true; const error = adapter.read();
  assert.equal(error.width, good.width); assert.ok(error.diagnostics.some(x => x.includes('异常')));
  global.window.innerWidth=300; global.window.innerHeight=600; fail=false;
  global.document.querySelector=()=>({getBoundingClientRect(){return {left:-50,top:0,width:400,height:600};}});
  const offscreen = new WebViewportAdapter(() => ({ visibleSize:{width:400,height:600},
    canvasRect:{x:-50,y:0,width:400,height:600},viewportRect:{x:0,y:0,width:400,height:600},
    backbufferWidth:400,backbufferHeight:600 }));
  const projected=offscreen.read();
  assert.equal(projected.content.x,-50);
  assert.deepEqual(ViewportMapper.mapWindowPointToUI({x:0,y:300},projected.content,{width:400,height:600}),{x:-150,y:0});
  offscreen.dispose();
  const wxFallback=new WeChatViewportAdapter({getWindowInfo(){throw new Error('primary unavailable');},
    getSystemInfoSync(){return {windowWidth:390,windowHeight:844,pixelRatio:3};}});
  const wxSnapshot=wxFallback.read();
  assert.equal(wxSnapshot.width,390);assert.equal(wxSnapshot.height,844);
  assert.ok(wxSnapshot.diagnostics.some(x=>x.includes('尝试系统信息回退')));
  wxFallback.dispose();
  off(); adapter.dispose(); delete global.window; delete global.document; delete global.getComputedStyle;
  return { centerMapsToOrigin: true, safeCapsuleMapped: true, capsuleAcrossSafeCenter: capsuleSafe,
    logical48DesignUnits: ViewportMapper.logicalPixelsToUI(48,snapshot,{width:720,height:1280}),
    resizeNotificationAfterRead: true, zeroSizeRetainsRevision: true, platformExceptionFallback: true,
    offscreenCanvasPoint:{x:-150,y:0},wechatPrimaryFallback:{width:wxSnapshot.width,height:wxSnapshot.height},initialWidth: initial.width };
}

(async () => {
  const leases = await moduleLeaseTests(), viewport = await viewportTests();
  console.log(JSON.stringify({ result: 'PASS', scope: 'deterministic owner-controlled contract tests; not device/rendering or DPR matrix', leases, viewport }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
