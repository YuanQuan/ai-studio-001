const assert=require('node:assert/strict');
const Module=require('node:module');
const ts=require('/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/resources/3d/engine/node_modules/typescript');
const originalLoad=Module._load;
class Component {}
class Color { constructor(){} }
class Prefab {}
const cc={_decorator:{ccclass:()=>target=>target,property:()=>()=>{}},Component,Color,Prefab};
Module._load=function(request,parent,isMain){
  if(request==='cc')return cc;
  if(!request.startsWith('.'))return originalLoad.call(this,request,parent,isMain);
  if(request.includes('sakura_user_layout'))return {USER_LAYOUT_PROFILE:{instances:[]}};
  if(request.includes('shop_definitions'))return {SHOP_IDS:[],SHOP_NAMES:[],SHOP_PREFAB_NAMES:[]};
  if(request.includes('module-assets'))return {U04_MAPPING_MODULE:'mapping',U04_DECORATION_MODULE:'decoration',u04PortraitModuleId:(key,expression)=>`${key}:${expression}`};
  return {};
};
require.extensions['.ts']=function(mod,filename){const source=require('node:fs').readFileSync(filename,'utf8');const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2019,experimentalDecorators:true}}).outputText;mod._compile(js,filename);};
const unitGalleryPath=require('node:path').resolve(__dirname,'../../../../../apps/client/assets/UnitSampleGallery.ts'); const {UnitSampleGallery}=require(unitGalleryPath);
function acquireRequest(){let reject;const promise=new Promise((_,r)=>{reject=r;});promise.cancel=()=>{const error=new Error('模块资源请求已取消');error.name='ModuleAcquireCancelledError';reject(error);};return {promise,reject};}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function makeGallery(){
  const requests=[];
  const gallery=Object.create(UnitSampleGallery.prototype);
  Object.assign(gallery,{isValid:true,u04PageGeneration:7,u04Generation:0,u04Manager:0,u04Stage:0,u04Expression:3,
    u04Manifest:{json:{stages:{MT_S0:{id:'map'}}}},u04Portrait:{isValid:true},u04Sprites:[],u04Status:{isValid:true,string:'idle'},
    u04SelectionPending:null,u04MappingPending:null,u04DecorationPending:null,u04MappingLease:null,u04DecorationLease:null,
    u04SelectionLease:null,u04Name:{string:''},u04CommittedKey:'',u04CommittedExpression:'',u04Sweep:{active:false,checked:0,total:90,failed:[],elapsedMs:0,startedAt:0},
    publishU04Runtime(){},applyU04Geometry(){},layoutDialogue(){},
    u04Assets:{acquire(moduleId){const request=acquireRequest();requests.push({moduleId,...request});return request.promise;}}});
  return {gallery,requests};
}
async function main(){
  const logs=[];const oldError=console.error;console.error=(...args)=>logs.push(args.join(' '));
  try{
    const {gallery,requests}=makeGallery();
    gallery.refreshDialogue();
    gallery.refreshDialogue();
    assert.equal(requests.length,2,'reselect creates a new active request');
    await tick();
    assert.equal(logs.length,0,'superseded cancellation does not log a false load failure');
    assert.match(gallery.u04Status.string,/正在载入/,'stale cancellation does not overwrite current selection status');
    requests[1].reject(new Error('真实资源故障'));
    await tick();
    assert.match(gallery.u04Status.string,/加载失败/,'current request failure remains visible');
    const parsed=JSON.parse(logs[0].slice(logs[0].indexOf('{')));
    assert.match(parsed.error,/真实资源故障/,'current failure log serializes the actionable message');

    const reentry=makeGallery();let refreshed=0,acquired=0;
    reentry.gallery.refreshDialogue=()=>{refreshed++;};
    reentry.gallery.u04Assets={acquire(){acquired++;return acquireRequest().promise;}};
    reentry.gallery.ensureU04Manifest(7);
    assert.equal(refreshed,0,'existing page mapping is not redundantly refreshed by ensure');
    assert.equal(acquired,0,'existing manifest does not start duplicate mapping acquisition');

    const stale=makeGallery();stale.gallery.u04Manifest=null;stale.gallery.u04Portrait={isValid:true};
    stale.gallery.ensureU04Manifest(7);stale.gallery.ensureU04Decoration(7);
    assert.equal(stale.requests.length,2,'mapping and decoration each have one page-scoped request');
    stale.gallery.releaseU04Page();
    await tick();
    assert.equal(logs.length,1,'page-exit cancellation from mapping/decoration is not reported as a real failure');
    assert.equal(stale.gallery.u04Manifest,null,'page exit clears mapping reference');
    console.log('PASS: actual compiled Gallery U04 reentry/supersede/exit methods suppress stale cancellations and expose current failures');
  }finally{console.error=oldError;}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
