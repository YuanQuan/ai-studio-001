const fs=require('fs'),assert=require('assert'),path=require('path');
const root='/private/tmp/minigame-art-opt-integration-final-v0.7-u01fix/build-output/minigame-art-opt-integration-final-v0.7-u01fix-web-mobile';
const regs=new Map(),cache=new Map();const System={register(id,deps,declare){if(Array.isArray(id)){const m=deps(()=>{},{});m.execute();return;}regs.set(id,{deps,declare});}};
for(const file of ['assets/main/index.js','src/chunks/bundle.js','assets/internal/index.js'])Function('System',fs.readFileSync(path.join(root,file),'utf8'))(System);
const cc={cclegacy:{_RF:{push(){},pop(){}}},SpriteFrame:class{},Sprite:class{},UITransform:class{}};
function load(id){if(id==='cc')return cc;if(cache.has(id))return cache.get(id);const rec=regs.get(id);if(!rec)throw Error(id);const exp={};cache.set(id,exp);const decl=rec.declare((key,val)=>{if(typeof key==='object')Object.assign(exp,key);else exp[key]=val;return val;},{meta:{}});rec.deps.forEach((dep,i)=>decl.setters[i](load(dep.startsWith('.')?'chunks:///_virtual/'+path.basename(dep):dep)));decl.execute();return exp;}
const helper=load('chunks:///_virtual/rollupPluginModLoBabelHelpers.js');let vals=[];const next=helper.createForOfIteratorHelperLoose(new Map([['a',1],['b',2]]).values());for(let n;!(n=next()).done;)vals.push(n.value);assert.deepEqual(vals,[1,2]);

const ts=require('/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/resources/3d/engine/node_modules/typescript');
const source=fs.readFileSync(path.join(root,'assets/main/index.js'),'utf8'),sf=ts.createSourceFile('actual.js',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);function UnitSampleGallery(){};const needed=new Set(['ensureU04Manifest','ensureU04Decoration','u04ErrorMessage','releaseU04Page','refreshDialogue']);const checked=[];
function walk(n){if(ts.isBinaryExpression(n)&&ts.isPropertyAccessExpression(n.left)&&needed.has(n.left.name.text)&&ts.isFunctionExpression(n.right)){const name=n.left.name.text;UnitSampleGallery.prototype[name]=Function('te','ie','oe','De','Le','Fe','B','s','return ('+n.right.getText(sf)+')')('mapping','decoration',(k,e)=>k+':'+e,[{key:'happy',name:'开心'},{key:'surprised',name:'惊讶'},{key:'sad',name:'悲伤'},{key:'smile',name:'微笑'}],[{name:'店长'}],[0,2,3],{Type:{SLICED:1}},helper.createForOfIteratorHelperLoose);checked.push(name);}ts.forEachChild(n,walk);}walk(sf);assert.equal(checked.length,5);UnitSampleGallery.prototype.u04Key=()=> 'MT_S0';
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
    console.log('PASS: actual Creator emitted JavaScript Gallery U04 reentry/supersede/exit methods suppress stale cancellations and expose current failures');
  }finally{console.error=oldError;}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
