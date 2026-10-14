export type Dimension = 'TEA' | 'MILK' | 'TOPPING';
export type Ingredient = { ingredient_id: string; dimension: Dimension; name: string; sort_order: number };
export type Recipe = {
  recipe_id: string; tier_id: string; min_stage_no: number; drink_name: string;
  tea_id: string; milk_id: string; topping_id: string;
};
export type Stage = {
  stage_id: string; tier_id: string; stage_no: number; xp_from: number; recipe_dims: number;
  orders_target: number; time_sec: number | null; tea_options: number; milk_options: number;
  topping_options: number; xp_reward: number;
};
export type Unlock = {
  tier_id: string; prev_tier_id: string | null; initial_open: boolean; xp_enabled: boolean; xp_min: number;
  level_enabled: boolean; level_min: number; soul_enabled: boolean; soul_min: number;
  spirit_enabled: boolean; spirit_min: number;
};
export type LabConfig = {
  source_sha256: string; resource_id: string; config_version: string; schema_version: string;
  shop_id: string; dimensions: Dimension[]; difficulty_stages: Stage[]; unlock_conditions: Unlock[];
  ingredients: Ingredient[]; recipes: Recipe[];
};
export type Progress = { version: 1; xp: number; cleared: string[]; unlocked: string[] };
export type Run = {
  optionPool: Record<Dimension, Ingredient[]>; tierId: string; stage: Stage; orders: Recipe[];
  orderIndex: number; selected: Partial<Record<Dimension, string>>; selectionOrder: Dimension[]; startedAtMs: number;
  deadlineMs: number | null; status: 'playing' | 'won' | 'failed' | 'exited'; settled: boolean;
};
export const STORAGE_KEY = 'u05.milk-tea.lab.v1';
export const VALIDATION_KEY = 'u05.milk-tea.lab.validation.v1';
export const DIMENSIONS: Dimension[] = ['TEA', 'MILK', 'TOPPING'];
export const DIMENSION_NAMES: Record<Dimension, string> = { TEA: '茶底', MILK: '奶类', TOPPING: '小料' };
export const TIER_IDS = ['EASY', 'MEDIUM', 'HARD', 'HELL', 'NIGHTMARE'];
export const TIER_NAMES: Record<string, string> = { EASY: '简单', MEDIUM: '中等', HARD: '困难', HELL: '地狱', NIGHTMARE: '噩梦' };
export const DEFAULT_PROGRESS: Progress = { version: 1, xp: 0, cleared: [], unlocked: [] };

export function normalizeProgress(raw: unknown): Progress {
  if (!raw || typeof raw !== 'object') throw new Error('进度存档不是对象');
  const value = raw as Partial<Progress>;
  if (value.version !== 1 || !Number.isSafeInteger(value.xp) || Number(value.xp) < 0 ||
      !Array.isArray(value.cleared) || !Array.isArray(value.unlocked) ||
      !value.cleared.every(item => typeof item === 'string' && TIER_IDS.includes(item)) ||
      !value.unlocked.every(item => typeof item === 'string' && TIER_IDS.includes(item))) {
    throw new Error('进度存档结构或字段无效');
  }
  return { version: 1, xp: Number(value.xp), cleared: Array.from(new Set(value.cleared)), unlocked: Array.from(new Set(value.unlocked)) };
}

export function stagesFor(config: LabConfig, tierId: string): Stage[] {
  return config.difficulty_stages.filter(stage => stage.tier_id === tierId).sort((a, b) => a.stage_no - b.stage_no);
}
export function chooseStage(config: LabConfig, tierId: string, xp: number, forceStage: number | null): Stage {
  const stages = stagesFor(config, tierId);
  const stageNo = forceStage ?? (stages.slice().reverse().find(stage => xp >= stage.xp_from)?.stage_no ?? 1);
  return stages.find(stage => stage.stage_no === stageNo) ?? stages[0];
}
function optionCounts(stage: Stage): Record<Dimension, number> {
  return { TEA: stage.tea_options, MILK: stage.milk_options, TOPPING: stage.topping_options };
}
export function ingredientsFor(config: LabConfig, stage: Stage): Record<Dimension, Ingredient[]> {
  const counts = optionCounts(stage);
  const result = {} as Record<Dimension, Ingredient[]>;
  DIMENSIONS.forEach(dimension => {
    result[dimension] = config.ingredients.filter(item => item.dimension === dimension)
      .sort((a, b) => a.sort_order - b.sort_order).slice(0, counts[dimension]);
  });
  return result;
}
export function makeRun(config: LabConfig, stage: Stage, nowMs: number, random: () => number = Math.random): Run {
  const eligible = config.recipes.filter(recipe => recipe.tier_id === stage.tier_id && recipe.min_stage_no <= stage.stage_no);
  if (!eligible.length) throw new Error(`阶段题池为空：${stage.stage_id}`);
  const orders: Recipe[] = [];
  for (let i = 0; i < stage.orders_target; i++) {
    orders.push({ ...eligible[Math.min(eligible.length - 1, Math.floor(random() * eligible.length))] });
  }
  return { optionPool: ingredientsFor(config, stage), tierId: stage.tier_id, stage, orders, orderIndex: 0,
    selected: {}, selectionOrder: [], startedAtMs: nowMs, deadlineMs: stage.time_sec === null ? null : nowMs + stage.time_sec * 1000,
    status: 'playing', settled: false };
}
export function remainingSeconds(run: Run, nowMs: number): number | null {
  return run.deadlineMs === null ? null : Math.max(0, Math.ceil((run.deadlineMs - nowMs) / 1000));
}
export function expireRun(run: Run, nowMs: number): Run {
  return run.status === 'playing' && run.deadlineMs !== null && nowMs >= run.deadlineMs ? { ...run, status: 'failed' } : run;
}
export function ingredientsForRun(run: Run, dimension: Dimension): Ingredient[] { return run.optionPool[dimension]; }
export function selectIngredient(run: Run, dimension: Dimension, id: string, nowMs: number): Run {
  run = expireRun(run, nowMs);
  if (run.status !== 'playing' || !run.optionPool[dimension].some(item => item.ingredient_id === id)) return run;
  return { ...run, selected: { ...run.selected, [dimension]: id },
    selectionOrder: [...run.selectionOrder.filter(item => item !== dimension), dimension] };
}
export function undoIngredient(run: Run, dimension: Dimension, nowMs: number): Run {
  run = expireRun(run, nowMs);
  if (run.status !== 'playing' || !run.selected[dimension]) return run;
  const selected = { ...run.selected };
  delete selected[dimension];
  return { ...run, selected, selectionOrder: run.selectionOrder.filter(item => item !== dimension) };
}
export function submitCup(run: Run, nowMs: number): { run: Run; result: 'incomplete' | 'wrong' | 'correct' | 'won' | 'expired' } {
  run = expireRun(run, nowMs);
  if (run.status !== 'playing') return { run, result: 'expired' };
  if (DIMENSIONS.some(dimension => !run.selected[dimension])) return { run, result: 'incomplete' };
  const expected = run.orders[run.orderIndex];
  const correct = run.selected.TEA === expected.tea_id && run.selected.MILK === expected.milk_id && run.selected.TOPPING === expected.topping_id;
  if (!correct) return { run: { ...run, selected: {}, selectionOrder: [] }, result: 'wrong' };
  const nextIndex = run.orderIndex + 1;
  if (nextIndex >= run.orders.length) return { run: { ...run, orderIndex: nextIndex, selected: {}, selectionOrder: [], status: 'won' }, result: 'won' };
  return { run: { ...run, orderIndex: nextIndex, selected: {}, selectionOrder: [] }, result: 'correct' };
}
export function settleWin(config: LabConfig, progress: Progress, run: Run,
  growth: { level: number; soul: number; spirit: number; growthEnabled: boolean }, validationBypass = false):
  { progress: Progress; run: Run; xpAdded: number } {
  if (run.status !== 'won' || run.settled) return { progress, run, xpAdded: 0 };
  const stage = config.difficulty_stages.find(item => item.stage_id === run.stage.stage_id);
  if (!stage) return { progress, run: { ...run, settled: true }, xpAdded: 0 };
  const xpAdded = stage.xp_reward;
  const xp = progress.xp + xpAdded;
  const cleared = new Set(progress.cleared); cleared.add(run.tierId);
  const unlocked = new Set(progress.unlocked);
  const own = config.unlock_conditions.find(item => item.tier_id === run.tierId);
  if (own?.initial_open) unlocked.add(run.tierId);
  const next = config.unlock_conditions.find(item => item.prev_tier_id === run.tierId);
  if (next && (validationBypass || meetsConditions(next, xp, growth))) unlocked.add(next.tier_id);
  return { progress: { version: 1, xp, cleared: Array.from(cleared), unlocked: Array.from(unlocked) },
    run: { ...run, settled: true }, xpAdded };
}
function meetsConditions(condition: Unlock, xp: number, growth: { level: number; soul: number; spirit: number }): boolean {
  return (!condition.xp_enabled || xp >= condition.xp_min) && (!condition.level_enabled || growth.level >= condition.level_min) &&
    (!condition.soul_enabled || growth.soul >= condition.soul_min) && (!condition.spirit_enabled || growth.spirit >= condition.spirit_min);
}
export function reconcileUnlocks(config: LabConfig, progress: Progress,
  growth: { level: number; soul: number; spirit: number; growthEnabled: boolean }, validationBypass = false): Progress {
  const unlocked = new Set(progress.unlocked);
  config.unlock_conditions.forEach(condition => {
    if (condition.initial_open || (condition.prev_tier_id && progress.cleared.includes(condition.prev_tier_id) &&
        (validationBypass || meetsConditions(condition, progress.xp, growth)))) unlocked.add(condition.tier_id);
  });
  return { ...progress, unlocked: Array.from(unlocked) };
}
export function isUnlocked(config: LabConfig, progress: Progress, tierId: string,
  growth: { level: number; soul: number; spirit: number; growthEnabled: boolean }, validationBypass = false): boolean {
  if (progress.unlocked.includes(tierId)) return true;
  const condition = config.unlock_conditions.find(item => item.tier_id === tierId);
  if (!condition) return false;
  if (condition.initial_open) return true;
  if (!condition.prev_tier_id || !progress.cleared.includes(condition.prev_tier_id)) return false;
  return validationBypass || meetsConditions(condition, progress.xp, growth);
}
