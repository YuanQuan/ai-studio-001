const assert = require('node:assert/strict');
const Module = require('node:module');
const path = require('node:path');
const ts = require('/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/app.asar.unpacked/node_modules/typescript');

class Vec { constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z;} clone(){return new Vec(this.x,this.y,this.z);} }
class Size { constructor(width=0,height=0){this.width=width;this.height=height;} clone(){return new Size(this.width,this.height);} }
class SpriteFrame { constructor(id=''){this.id=id;this.texture={width:2048,height:2048};this.isValid=true;} reset(info){this.resetInfo=info;this.texture=info.texture;} destroy(){this.isValid=false;} }
class Sprite { static SizeMode={CUSTOM:1,TRIMMED:0}; constructor(frame){this.spriteFrame=frame;this.sizeMode=0;this.trim=true;} }
class UITransform { constructor(){this.contentSize=new Size(120,80);this.anchorPoint=new Vec(.25,.75);} setContentSize(size){this.contentSize=size.clone();} setAnchorPoint(x,y){this.anchorPoint=new Vec(x,y);} }
class FakeNode {
  constructor(...components){this.children=[];this.position=new Vec(4,5,6);this.scale=new Vec(2,3,4);this.components=new Map(components.map(c=>[c.constructor,c]));}
  getComponent(type){return this.components.get(type)||null;}
  addChild(child){this.children.push(child);}
  setPosition(value){this.position=value.clone();}
  setScale(value){this.scale=value.clone();}
}
const cc={assetManager:{},Node:FakeNode,Sprite,SpriteFrame,UITransform,Rect:class{constructor(x,y,width,height){Object.assign(this,{x,y,width,height});}},Size,Vec2:Vec};
const originalLoad=Module._load;
Module._load=function(request,parent,isMain){if(request==='cc')return cc;return originalLoad.call(this,request,parent,isMain);};
require.extensions['.ts']=function(mod,filename){const source=require('node:fs').readFileSync(filename,'utf8');const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2019,experimentalDecorators:true}}).outputText;mod._compile(js,filename);};
const {GalleryAssetSession}=require('/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/apps/client/assets/framework/asset-integration/gallery_asset_session.ts');
const {ModuleAssets}=require('/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/apps/client/assets/framework/module-assets/module_assets.ts');
const {DerivedAssetResolver}=require('/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/apps/client/assets/framework/asset-integration/derived_asset_resolver.ts');

async function main(){
  const source=new SpriteFrame('imported'), derivedFrame=new SpriteFrame('derived');
  const owner={token:'race-owner',generation:1};
  let resolveDerived, releaseCalls=0;
  const modules={acquire:()=>Promise.resolve({release(){},get(){return source;}}),cancelOwner(){}};
  const derived={acquireModule:()=>new Promise(resolve=>{resolveDerived=resolve;})};
  const manifest={sample:{bundle:'sample',assets:{src:{path:'src',type:SpriteFrame}}}};
  const session=new GalleryAssetSession(modules,derived,manifest,[{stableAssetId:'src',bundle:'sample',sourceAssetId:'src',originalSize:[120,80],rect:[0,0,120,80],offset:[0,0],pivot:[.5,.5]}],owner.token,owner.generation,()=>true);
  const pending=session.getDerivedFrame('sample','src');
  await Promise.resolve(); await Promise.resolve();
  session.dispose();
  resolveDerived({release(){releaseCalls++;},getFrame(){return {frame:derivedFrame,release(){}};}});
  await assert.rejects(pending,/失效|释放/);
  await Promise.resolve();
  assert.equal(releaseCalls,1,'late derived module lease released once after disposal');

  const activeSession=new GalleryAssetSession({cancelOwner(){},getInFlightCount(){return 0;}},{}, {}, [], 'layout-owner',1,()=>true);
  activeSession.derivedFrameMaps.set('shops',new Map([[source,derivedFrame]]));
  const transform=new UITransform(), sprite=new Sprite(source), node=new FakeNode(transform,sprite), root=new FakeNode(); root.addChild(node);
  assert.equal(activeSession.applyDerivedFramesInTree(root,'shops'),1);
  assert.equal(sprite.spriteFrame,derivedFrame); assert.equal(sprite.sizeMode,Sprite.SizeMode.CUSTOM); assert.equal(sprite.trim,false);
  assert.deepEqual(transform.contentSize,new Size(120,80)); assert.deepEqual(transform.anchorPoint,new Vec(.25,.75));
  assert.deepEqual(node.position,new Vec(4,5,6)); assert.deepEqual(node.scale,new Vec(2,3,4));
  // Instrument the same frame setter side effect that a non-CUSTOM Sprite may have.
  const beforeSize=transform.contentSize.clone();let assigned=false;
  Object.defineProperty(sprite,'spriteFrame',{get(){return source;},set(frame){assert.equal(this.sizeMode,Sprite.SizeMode.CUSTOM);assert.equal(this.trim,false);transform.setContentSize(new Size(999,777));assigned=true;}});
  activeSession.applyDerivedFramesInTree(root,'shops');assert(assigned);assert.deepEqual(transform.contentSize,beforeSize);
  activeSession.dispose();
  let released=0; assert.throws(()=>activeSession.holdFrameHandle('late',{frame:derivedFrame,release(){released++;}}),/失效/);
  assert.equal(released,1,'stale frame handle released synchronously');

  const callbackSession=new GalleryAssetSession({cancelOwner(){}},{},{},[],'callback-owner',1,()=>true);
  let callbackWasSync=true, missingCallbackError=null;
  callbackSession.loadPageResource('not/registered',SpriteFrame,error=>{missingCallbackError=error;assert.equal(callbackWasSync,false);});
  callbackWasSync=false; await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
  assert.match(missingCallbackError?.message??'',/没有此准确资源路径/,'missing resource callback is asynchronous and fails closed');
  callbackSession.dispose();

  for(let cycle=0;cycle<20;cycle++){
    const imported=new SpriteFrame(`source-${cycle}`); let loadCount=0, releaseCount=0;
    const manifest={sample:{bundle:'sample',assets:{source:{path:'source',type:SpriteFrame}}}};
    const sharedModules=new ModuleAssets(manifest,{async load(){loadCount++;return imported;},release(){releaseCount++;}});
    const descriptor={stableAssetId:'crop',bundle:'sample',sourceAssetId:'source',originalSize:[120,80],rect:[4,6,40,30],offset:[0,0],pivot:[.5,.5]};
    const sharedDerived=new DerivedAssetResolver(sharedModules,{assets:[descriptor]});
    const mkSession=(n)=>new GalleryAssetSession(sharedModules,sharedDerived,manifest,[descriptor],`cycle-${cycle}-${n}`,n,()=>true);
    const first=mkSession(1), second=mkSession(2);
    const [firstFrame,secondFrame]=await Promise.all([first.getDerivedFrame('sample','crop'),second.getDerivedFrame('sample','crop')]);
    assert.equal(firstFrame,secondFrame,'same source texture and geometry share the cached derived frame');
    assert.equal(loadCount,1,'competing page owners share one underlying source load');
    first.dispose(); await Promise.resolve(); await Promise.resolve();
    assert.equal(firstFrame.isValid,true,'one owner release must preserve the other page frame');
    second.dispose(); await Promise.resolve(); await Promise.resolve(); await new Promise(resolve=>setImmediate(resolve));
    assert.equal(sharedDerived.getLiveDerivedCount(),0,'derived cache returns to zero after both owners leave');
    assert.equal(releaseCount,1,'shared source is released only after final owner leaves');
  }
  const {CocosBundleLoader}=require('/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/apps/client/assets/framework/module-assets/cocos_bundle_loader.ts');
  let frameRefs=1,dead=false,add=0,dec=0,forced=0;
  const depFrame={addRef(){frameRefs++;add++;return this;},decRef(){frameRefs--;dec++;if(frameRefs===0)dead=true;return this;}};
  cc.assetManager.getBundle=()=>({load(path,type,cb){queueMicrotask(()=>cb(null,depFrame));},release(){forced++;dead=true;}});
  const loader=new CocosBundleLoader();
  await loader.load('shared','frame',SpriteFrame);assert.equal(frameRefs,2);loader.release('shared','frame',SpriteFrame);assert.equal(frameRefs,1);assert.equal(dead,false);assert.equal(forced,0);assert.equal(add,1);assert.equal(dec,1);
  depFrame.decRef();assert(dead);assert.throws(()=>loader.release('shared','frame',SpriteFrame));
  const raceSession=new GalleryAssetSession({cancelOwner(){}},{},manifest,[],'window',1,()=>true);
  raceSession.acquireModule=async()=>({get(){return source;}});raceSession.get=()=>source;let lateReleased=0;
  raceSession.derivedManifest=[{stableAssetId:'src',sourceAssetId:'src',bundle:'sample'}];
  raceSession.acquireDerived=async()=>{raceSession.dispose();return {frame:derivedFrame,release(){lateReleased++;}}};
  await assert.rejects(raceSession.getDerivedFrame('sample','src'),/失效/);assert.equal(lateReleased,1);assert.equal(raceSession.diagnostics().heldDerivedFrames,0);
  console.log('PASS independent loader ownership, setter geometry, await/dispose window; Owner actual methods rerun:  stale derived-acquire race, late frame release, non-CUSTOM prefab geometry, shared-owner competition and 20 release cycles');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
