export type Ingredient = { ingredient_id: string; dimension: string; name: string; sort_order: number };
export type Recipe = {
  recipe_id: string; tier_id: string; min_stage_no: number; drink_name: string;
  tea_id: string; milk_id: string; topping_id: string; sweet_id: string | null; ice_id: string | null;
};
export type Stage = {
  stage_id: string; tier_id: string; stage_no: number; xp_from: number; recipe_dims: number;
  orders_target: number; time_sec: number | null; options_per_dim: number; xp_reward: number;
};
export type Unlock = {
  tier_id: string; prev_tier_id: string | null; initial_open: boolean; xp_enabled: boolean; xp_min: number;
  level_enabled: boolean; level_min: number; soul_enabled: boolean; soul_min: number;
  spirit_enabled: boolean; spirit_min: number;
};
export type LabConfig = {
  source_sha256: string; resource_id: string; config_version: string; shop_id: string;
  difficulty_stages: Stage[]; unlock_conditions: Unlock[]; ingredients: Ingredient[]; recipes: Recipe[];
};
export type Progress = { version: 1; xp: number; cleared: string[]; unlocked: string[] };
export type Run = {
  optionPool: Record<string, Ingredient[]>;
  tierId: string; stage: Stage; orders: Recipe[]; orderIndex: number; selected: Record<string, string>;
  startedAtMs: number; deadlineMs: number | null; status: 'playing' | 'won' | 'failed' | 'exited'; settled: boolean;
};
export const STORAGE_KEY = 'u05.milk-tea.lab.v1';
export const VALIDATION_KEY = 'u05.milk-tea.lab.validation.v1';
export const DIMENSIONS = ['TEA', 'MILK', 'TOPPING', 'SWEET', 'ICE'];
export const DIMENSION_NAMES: Record<string, string> = { TEA: '茶底', MILK: '奶类', TOPPING: '小料', SWEET: '甜度', ICE: '冰量' };
export const DEFAULT_PROGRESS: Progress = { version: 1, xp: 0, cleared: [], unlocked: [] };

export function normalizeProgress(raw: unknown): Progress {
  if (!raw || typeof raw !== 'object') throw new Error('进度存档不是对象');
  const value = raw as Partial<Progress>;
  const validIds = ['EASY', 'MEDIUM', 'HARD', 'HELL', 'NIGHTMARE'];
  if (value.version !== 1 || !Number.isSafeInteger(value.xp) || Number(value.xp) < 0 ||
      !Array.isArray(value.cleared) || !Array.isArray(value.unlocked) ||
      !value.cleared.every(item => typeof item==='string'&&validIds.includes(item)) ||
      !value.unlocked.every(item => typeof item==='string'&&validIds.includes(item))) throw new Error('进度存档结构或字段无效');
  return { version: 1, xp: Math.floor(Number(value.xp)), cleared: Array.from(new Set(value.cleared)), unlocked: Array.from(new Set(value.unlocked)) };
}

export function stagesFor(config: LabConfig, tierId: string): Stage[] {
  return config.difficulty_stages.filter(stage => stage.tier_id === tierId).sort((a,b) => a.stage_no-b.stage_no);
}
export function chooseStage(config: LabConfig, tierId: string, xp: number, forceStage: number | null): Stage {
  const stages = stagesFor(config, tierId);
  const stageNo = forceStage ?? (stages.slice().reverse().find(stage => xp >= stage.xp_from)?.stage_no ?? stages[0]?.stage_no ?? 1);
  return stages.find(stage => stage.stage_no === stageNo) ?? stages[0];
}
function recipeIngredientIds(recipe: Recipe): Record<string, string | null> {
  return { TEA: recipe.tea_id, MILK: recipe.milk_id, TOPPING: recipe.topping_id, SWEET: recipe.sweet_id, ICE: recipe.ice_id };
}
export function ingredientsFor(config: LabConfig, stage: Stage): Record<string, Ingredient[]> {
  const dimensions = DIMENSIONS.filter(dimension => config.ingredients.some(item => item.dimension === dimension) && (dimension !== 'SWEET' || stage.recipe_dims >= 4) && (dimension !== 'ICE' || stage.recipe_dims >= 5)).slice(0, stage.recipe_dims);
  const byDimension: Record<string, Ingredient[]> = {};
  dimensions.forEach(dimension => {
    byDimension[dimension] = config.ingredients.filter(item => item.dimension === dimension)
      .sort((left,right) => left.sort_order-right.sort_order).slice(0, stage.options_per_dim);
  });
  return byDimension;
}
export function makeRun(config: LabConfig, stage: Stage, nowMs: number, random: () => number = Math.random): Run {
  const orders = config.recipes.filter(recipe => recipe.tier_id === stage.tier_id && recipe.min_stage_no <= stage.stage_no);
  const pool = ingredientsFor(config, stage);
  const eligible = orders;
  const choices: Recipe[] = [];
  for(let i=0;i<stage.orders_target;i++) choices.push({ ...(eligible[Math.floor(random()*eligible.length)] ?? eligible[0]) });
  return { optionPool: pool, tierId: stage.tier_id, stage, orders: choices, orderIndex: 0, selected: {}, startedAtMs: nowMs, deadlineMs: stage.time_sec===null?null:nowMs+stage.time_sec*1000, status:'playing', settled:false };
}
export function remainingSeconds(run: Run, nowMs: number): number | null { return run.deadlineMs===null?null:Math.max(0,Math.ceil((run.deadlineMs-nowMs)/1000)); }
export function expireRun(run: Run, nowMs: number): Run { return run.status==='playing'&&run.deadlineMs!==null&&nowMs>=run.deadlineMs?{...run,status:'failed'}:run; }
export function selectIngredient(run: Run, dimension: string, id: string, nowMs: number): Run {
  run=expireRun(run,nowMs); if(run.status!=='playing'||!ingredientsForRun(run,dimension).some(item=>item.ingredient_id===id)) return run;
  return {...run,selected:{...run.selected,[dimension]:id}};
}
export function ingredientsForRun(run:Run,dimension:string):Ingredient[]{const recipe=run.orders[run.orderIndex];const allowed=Object.keys(recipe).filter(key=>key.endsWith('_id')).map(key=>key.replace('_id','').toUpperCase());if(!allowed.includes(dimension))return[];return run.optionPool[dimension]??[];}
export function undoIngredient(run: Run, dimension: string, nowMs: number): Run {
  run=expireRun(run,nowMs);if(run.status!=='playing'||!run.selected[dimension])return run;const selected={...run.selected};delete selected[dimension];return {...run,selected};
}
export function submitCup(run: Run, nowMs: number): {run:Run;result:'incomplete'|'wrong'|'correct'|'won'|'expired'} {
  run=expireRun(run,nowMs);if(run.status!=='playing')return{run,result:'expired'};
  const expected:Record<string,string|null>={TEA:run.orders[run.orderIndex].tea_id,MILK:run.orders[run.orderIndex].milk_id,TOPPING:run.orders[run.orderIndex].topping_id,SWEET:run.orders[run.orderIndex].sweet_id,ICE:run.orders[run.orderIndex].ice_id};
  const enabled=DIMENSIONS.filter(d=>expected[d]!==null);if(enabled.some(d=>!run.selected[d]))return{run,result:'incomplete'};
  if(!enabled.every(d=>run.selected[d]===expected[d]))return{run:{...run,selected:{}},result:'wrong'};
  const index=run.orderIndex+1;if(index>=run.orders.length)return{run:{...run,orderIndex:index,selected:{},status:'won'},result:'won'};
  return{run:{...run,orderIndex:index,selected:{}},result:'correct'};
}
export function settleWin(config:LabConfig, progress:Progress, run:Run, growthInputs:{level:number;soul:number;spirit:number;growthEnabled:boolean}, validationBypass=false):{progress:Progress;run:Run;xpAdded:number} {
  if(run.status!=='won'||run.settled)return{progress,run,xpAdded:0};
  const stage=config.difficulty_stages.find(item=>item.stage_id===run.stage.stage_id)!;const xpAdded=stage.xp_reward;
  const xp=progress.xp+xpAdded,cleared=new Set(progress.cleared);cleared.add(run.tierId);const unlocked=new Set(progress.unlocked);
  const cond=config.unlock_conditions.find(item=>item.tier_id===run.tierId);
  if(cond?.initial_open)unlocked.add(run.tierId);
  const nextCond=config.unlock_conditions.find(item=>item.prev_tier_id===run.tierId);
  if(nextCond && cleared.has(run.tierId) && (validationBypass || meetsConditions(nextCond,xp,growthInputs))) unlocked.add(nextCond.tier_id);
  return{progress:{version:1,xp,cleared:Array.from(cleared),unlocked:Array.from(unlocked)},run:{...run,settled:true},xpAdded};
}
function meetsConditions(cond:Unlock,xp:number,growth:{level:number;soul:number;spirit:number;growthEnabled:boolean}):boolean {
  return (!cond.xp_enabled||xp>=cond.xp_min)&&(!cond.level_enabled||growth.level>=cond.level_min)&&(!cond.soul_enabled||growth.soul>=cond.soul_min)&&(!cond.spirit_enabled||growth.spirit>=cond.spirit_min);
}
export function reconcileUnlocks(config:LabConfig,progress:Progress,growth:{level:number;soul:number;spirit:number;growthEnabled:boolean},validationBypass=false):Progress {
  const unlocked=new Set(progress.unlocked);
  config.unlock_conditions.forEach(cond=>{
    if(cond.initial_open || (cond.prev_tier_id && progress.cleared.includes(cond.prev_tier_id) && (validationBypass || meetsConditions(cond,progress.xp,growth)))) unlocked.add(cond.tier_id);
  });
  return {...progress,unlocked:Array.from(unlocked)};
}
export function isUnlocked(config:LabConfig,progress:Progress,tierId:string,growth:{level:number;soul:number;spirit:number;growthEnabled:boolean},validationBypass=false):boolean {
  const saved=progress.unlocked.includes(tierId);if(saved)return true;const cond=config.unlock_conditions.find(item=>item.tier_id===tierId);if(!cond)return false;if(cond.initial_open)return true;
  if(!cond.prev_tier_id||!progress.cleared.includes(cond.prev_tier_id))return false;
  return validationBypass || meetsConditions(cond,progress.xp,growth);
}
