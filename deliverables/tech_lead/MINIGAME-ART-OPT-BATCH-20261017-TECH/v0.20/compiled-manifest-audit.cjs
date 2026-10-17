const fs=require('fs'),assert=require('assert'),path=require('path');
const root='/private/tmp/minigame-art-opt-integration-staging-v0.3c/build-output/minigame-art-opt-integration-staging-v0.3c-web-mobile';
const regs=new Map(),cache=new Map();const System={register(id,deps,declare){if(Array.isArray(id)){const m=deps(()=>{},{});m.execute();return;}regs.set(id,{deps,declare});}};
for(const file of ['assets/main/index.js','src/chunks/bundle.js','assets/internal/index.js','assets/dialogue/index.js'])Function('System',fs.readFileSync(path.join(root,file),'utf8'))(System);
const ts=require('/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/resources/3d/engine/node_modules/typescript');
const stage='/private/tmp/minigame-art-opt-integration-staging-v0.3c';let sizes;const sf=ts.createSourceFile('x',fs.readFileSync(stage+'/assets/labs/u05/milk_tea_lab.ts','utf8'),ts.ScriptTarget.Latest,true);function walk(n){if(ts.isVariableDeclaration(n)&&n.name.getText(sf)==='U05_ASSET_SIZES')sizes=Function('return ('+n.initializer.getText(sf)+')')();ts.forEachChild(n,walk);}walk(sf);
const cc={cclegacy:{_RF:{push(){},pop(){}}},SpriteFrame:class SpriteFrame{},Prefab:class Prefab{},BitmapFont:class BitmapFont{},JsonAsset:class JsonAsset{},Sprite:class{},UITransform:class{}};
function load(id){if(id==='chunks:///_virtual/milk_tea_lab.ts')return {U05_ASSET_SIZES:sizes};if(id==='cc')return cc;if(cache.has(id))return cache.get(id);const rec=regs.get(id);if(!rec)throw Error(id);const exp={};cache.set(id,exp);const decl=rec.declare((key,val)=>{if(typeof key==='object')Object.assign(exp,key);else exp[key]=val;return val;},{meta:{}});rec.deps.forEach((dep,i)=>decl.setters[i](load(dep.startsWith('.')?'chunks:///_virtual/'+path.basename(dep):dep)));decl.execute();return exp;}

const manifest=load('chunks:///_virtual/client_asset_modules.ts').CLIENT_ASSET_MODULE_MANIFEST;
const report={stage,modules:[],missing:[],duplicateCanonical:[],stageMissing:[],dependenciesMissing:[],allDescriptors:0};
for(const [id,m] of Object.entries(manifest)){
 const file=path.join(root,'assets',m.bundle,'config.json');const config=JSON.parse(fs.readFileSync(file,'utf8'));const entries=Object.values(config.paths).map(x=>({path:x[0],type:config.types[x[1]]}));
 for(const dep of m.dependencies??[])if(!manifest[dep])report.dependenciesMissing.push({module:id,dependency:dep});const seen=new Set();for(const [assetId,a] of Object.entries(m.assets)){report.allDescriptors++;const roots={world:'assets/bundles/world',tourist:'assets/bundles/tourist',shops:'assets/bundles/shops',dialogue:'assets/units/dialogue','milk-tea':'assets/bundles/milk_tea'};const ext={SpriteFrame:'.png',Prefab:'.prefab',JsonAsset:'.json',BitmapFont:'.fnt'}[a.type.name];const source=path.join(stage,roots[m.bundle],a.path.replace(/\/spriteFrame$/,'')+ext);if(!fs.existsSync(source)||!fs.existsSync(source+'.meta'))report.stageMissing.push({module:id,assetId,path:source});const type='cc.'+a.type.name;const matched=entries.some(x=>x.path===a.path&&x.type===type);if(!matched)report.missing.push({module:id,bundle:m.bundle,assetId,path:a.path,type});const key=m.bundle+'|'+a.path+'|'+type;if(seen.has(key))report.duplicateCanonical.push({module:id,assetId,key});seen.add(key);}
 report.modules.push({id,bundle:m.bundle,assets:Object.keys(m.assets).length,configPaths:entries.length});
}
report.retiredFarLInManifest=Object.values(manifest.world.assets).some(x=>x.path==='sakura_v03/tex_sakura_rr_far_l/spriteFrame');
report.retiredFiles=['tex_sakura_rr_far_l','tex_sakura_rr_bridge_body_l','tex_sakura_rr_bridge_body_r'].map(x=>({name:x,present:fs.existsSync(stage+'/assets/bundles/world/sakura_v03/'+x+'.png')}));
console.log(JSON.stringify(report,null,2));
