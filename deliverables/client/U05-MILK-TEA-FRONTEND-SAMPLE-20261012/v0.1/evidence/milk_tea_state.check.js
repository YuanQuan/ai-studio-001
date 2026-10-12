const assert = require('assert');
const fs = require('fs');
const ts = require('/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/app.asar.unpacked/node_modules/typescript/lib/typescript.js');
const source = fs.readFileSync('apps/client/assets/labs/u05/milk_tea_state.ts','utf8');
const js = ts.transpile(source,{target:ts.ScriptTarget.ES2017,module:ts.ModuleKind.CommonJS});
const Module = module.constructor;const m=new Module('milk_tea_state.generated',module);m.filename=process.cwd()+'/milk_tea_state.generated.js';m.paths=module.paths;m._compile(js,m.filename);const state=m.exports;
const config=JSON.parse(fs.readFileSync('apps/client/assets/resources/u05_milk_tea/config.json','utf8'));
const dims=['TEA','MILK','TOPPING','SWEET','ICE'];
for(const tierId of ['EASY','MEDIUM','HARD','HELL','NIGHTMARE']){
 for(const stage of config.difficulty_stages.filter(x=>x.tier_id===tierId)){
  const pool=state.ingredientsFor(config,stage);assert.strictEqual(Object.keys(pool).length,stage.recipe_dims,`${tierId}/${stage.stage_no} dimensions`);
  assert(dims.slice(0,stage.recipe_dims).every(d=>pool[d].length===stage.options_per_dim),`${tierId}/${stage.stage_no} options`);
 }
}
const medium=config.difficulty_stages.filter(x=>x.tier_id==='MEDIUM').sort((a,b)=>a.stage_no-b.stage_no);assert.strictEqual(state.chooseStage(config,'MEDIUM',medium[1].xp_from-1,null).stage_no,1);assert.strictEqual(state.chooseStage(config,'MEDIUM',medium[1].xp_from,null).stage_no,2);
let p={...state.DEFAULT_PROGRESS};p=state.reconcileUnlocks(config,p,{level:1,soul:0,spirit:0,growthEnabled:false});assert(p.unlocked.includes('EASY'));assert(!p.unlocked.includes('MEDIUM'));
const easy=config.difficulty_stages.find(x=>x.tier_id==='EASY'&&x.stage_no===1);let r=state.makeRun(config,easy,1000,()=>0);assert.strictEqual(state.submitCup(r,1500).result,'incomplete');
const expected=recipe=>({TEA:recipe.tea_id,MILK:recipe.milk_id,TOPPING:recipe.topping_id});
function fill(run, recipe, now){for(const dim of ['TEA','MILK','TOPPING'])run=state.selectIngredient(run,dim,expected(recipe)[dim],now);return run;}
r=fill(r,r.orders[0],2000);r=state.undoIngredient(r,'TOPPING',2200);assert(!r.selected.TOPPING);
r=state.selectIngredient(r,'TEA',r.optionPool.TEA.find(x=>x.ingredient_id!==r.orders[0].tea_id).ingredient_id,2300);r=state.selectIngredient(r,'MILK',r.orders[0].milk_id,2300);r=state.selectIngredient(r,'TOPPING',r.orders[0].topping_id,2300);let result=state.submitCup(r,2400);assert.strictEqual(result.result,'wrong');assert.strictEqual(result.run.orderIndex,0);assert.strictEqual(Object.keys(result.run.selected).length,0);
r=result.run;
for(let i=0;i<3;i++){r=fill(r,r.orders[r.orderIndex],3000+i);result=state.submitCup(r,3100+i);r=result.run;}assert.strictEqual(r.status,'won');
let settled=state.settleWin(config,p,r,{level:1,soul:0,spirit:0,growthEnabled:false});assert.strictEqual(settled.xpAdded,easy.xp_reward);assert.strictEqual(state.settleWin(config,settled.progress,settled.run,{level:1,soul:0,spirit:0,growthEnabled:false}).xpAdded,0);
const mediumRecipe=config.recipes.find(x=>x.tier_id==='MEDIUM'&&x.min_stage_no===1);let timed=state.makeRun(config,medium[0],5000,()=>0);assert.strictEqual(timed.deadlineMs,5000+medium[0].time_sec*1000);assert.strictEqual(state.submitCup(timed,timed.deadlineMs-1).result,'incomplete');assert.strictEqual(state.submitCup(timed,timed.deadlineMs).result,'expired');assert.strictEqual(state.expireRun(timed,timed.deadlineMs+1).status,'failed');assert.strictEqual(state.settleWin(config,p,state.expireRun(timed,timed.deadlineMs+1),{level:1,soul:0,spirit:0,growthEnabled:false}).xpAdded,0);const exited={...timed,status:'exited'};assert.strictEqual(state.settleWin(config,p,exited,{level:1,soul:0,spirit:0,growthEnabled:false}).xpAdded,0);
const cond=config.unlock_conditions.find(x=>x.tier_id==='MEDIUM');const fully={...cond,level_enabled:true,level_min:2,soul_enabled:true,soul_min:2,spirit_enabled:true,spirit_min:3};const gated={...config,unlock_conditions:config.unlock_conditions.map(x=>x.tier_id==='MEDIUM'?fully:x)};let cleared={version:1,xp:999,cleared:['EASY'],unlocked:['EASY']};assert(!state.isUnlocked(gated,cleared,'MEDIUM',{level:2,soul:1,spirit:3,growthEnabled:true}));assert(state.isUnlocked(gated,cleared,'MEDIUM',{level:2,soul:2,spirit:3,growthEnabled:true}));
let opened=state.reconcileUnlocks(config,{...settled.progress,xp:50,cleared:['EASY'],unlocked:['EASY']},{level:1,soul:0,spirit:0,growthEnabled:false});assert(opened.unlocked.includes('MEDIUM'));opened=state.reconcileUnlocks(config,{...opened,xp:0},{level:1,soul:0,spirit:0,growthEnabled:false});assert(opened.unlocked.includes('MEDIUM'));
assert.throws(()=>state.normalizeProgress({version:42}));assert.throws(()=>state.normalizeProgress({version:1,xp:0,cleared:['NOT_A_TIER'],unlocked:[]}));
console.log('PASS: five tiers / two stages option pools; config xp_from boundary; missing and wrong cups; undo; three correct cups; one-time xp settlement; pre-deadline/exact-deadline timeout; all-enabled unlock conditions; permanent unlock; corrupted save.');
