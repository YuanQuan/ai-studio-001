import { Dimension } from './milk_tea_state';

export type PresentationResult = 'arrival' | 'correct' | 'won' | 'wrong' | 'expired' | 'exited';
export type PresentationPhase = 'synthesis' | 'happy' | 'disappointed' | 'depart' | 'arrive' | 'complete';
export type FacePose = 'neutral' | 'squash' | 'blink' | 'expand_mid' | 'happy' | 'disappointed';
export type IngredientSnapshot = Partial<Record<Dimension, string>>;

/** Immutable display facts captured before the business Run is mutated. */
export type CupSnapshot = Readonly<{
  orderIndex: number;
  recipeId: string;
  ingredients: Readonly<IngredientSnapshot>;
}>;

/** Ephemeral presentation transaction; it never owns business results or rewards. */
export type PresentationTransaction = Readonly<{
  epoch: number;
  result: PresentationResult;
  submittedAtMs: number;
  snapshot: CupSnapshot;
  customerStartX: number;
}>;

export type PresentationSample = {
  phase: PresentationPhase;
  face: FacePose;
  faceProgress: number;
  phaseStartedAtMs: number;
  phaseDurationMs: number;
  progress: number;
  complete: boolean;
  customerX: number;
  bubbleVisible: boolean;
};

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));
const easeIn = (value: number): number => clamp01(value) ** 2;
const easeOut = (value: number): number => 1 - (1 - clamp01(value)) ** 2;

export function freezeCupSnapshot(orderIndex: number, recipeId: string, selected: IngredientSnapshot): CupSnapshot {
  return Object.freeze({
    orderIndex,
    recipeId,
    ingredients: Object.freeze({ ...selected }),
  });
}

export function createPresentationTransaction(
  epoch: number,
  result: PresentationResult,
  submittedAtMs: number,
  snapshot: CupSnapshot,
  customerStartX = 309,
): PresentationTransaction {
  return Object.freeze({ epoch, result, submittedAtMs, snapshot, customerStartX });
}

/** Converts any still-active non-win sequence to timeout feedback at the actual deadline observation. */
export function interruptPresentationForTimeout(
  transaction: PresentationTransaction,
  epoch: number,
  nowMs: number,
  customerStartX = 309,
): PresentationTransaction {
  return createPresentationTransaction(epoch, 'expired', nowMs, transaction.snapshot, customerStartX);
}

export function samplePresentation(
  transaction: PresentationTransaction,
  nowMs: number,
  target?: PresentationSample,
): PresentationSample {
  const sample = target ?? { phase: 'complete', face: 'neutral', faceProgress: 1, phaseStartedAtMs: 0,
    phaseDurationMs: 0, progress: 1, complete: true, customerX: 309, bubbleVisible: false } as PresentationSample;
  const elapsed = Math.max(0, nowMs - transaction.submittedAtMs);
  let phase: PresentationPhase; let start: number; let duration: number; let face: FacePose;
  let customerX: number; let bubbleVisible: boolean;
  if (transaction.result === 'wrong') {
    if (elapsed < 650) { phase = 'synthesis'; start = 0; duration = 650; face = 'neutral'; customerX = 309; bubbleVisible = true; }
    else if (elapsed < 1000) { phase = 'disappointed'; start = 650; duration = 350; face = 'disappointed'; customerX = 309; bubbleVisible = true; }
    else { phase = 'complete'; start = 1000; duration = 0; face = 'neutral'; customerX = 309; bubbleVisible = true; }
  } else if (transaction.result === 'expired') {
    if (transaction.customerStartX <= -72) { phase = 'complete'; start = 0; duration = 0; face = 'disappointed'; customerX = -72; bubbleVisible = false; }
    else if (elapsed < 300) { phase = 'disappointed'; start = 0; duration = 300; face = 'disappointed'; customerX = transaction.customerStartX; bubbleVisible = true; }
    else if (elapsed < 750) { phase = 'depart'; start = 300; duration = 450; face = 'disappointed'; customerX = transaction.customerStartX + (-72 - transaction.customerStartX) * easeIn((elapsed - 300) / 450); bubbleVisible = false; }
    else { phase = 'complete'; start = 750; duration = 0; face = 'disappointed'; customerX = -72; bubbleVisible = false; }
  } else if (transaction.result === 'exited') {
    if (elapsed < 450) { phase = 'depart'; start = 0; duration = 450; face = 'neutral'; customerX = transaction.customerStartX + (-72 - transaction.customerStartX) * easeIn(elapsed / 450); bubbleVisible = false; }
    else { phase = 'complete'; start = 450; duration = 0; face = 'neutral'; customerX = -72; bubbleVisible = false; }
  } else if (transaction.result === 'arrival') {
    if (elapsed < 450) { phase = 'arrive'; start = 0; duration = 450; face = 'neutral'; customerX = -72 + 381 * easeOut(elapsed / 450); bubbleVisible = false; }
    else { phase = 'complete'; start = 450; duration = 0; face = 'neutral'; customerX = 309; bubbleVisible = true; }
  } else if (elapsed < 650) { phase = 'synthesis'; start = 0; duration = 650; face = 'neutral'; customerX = 309; bubbleVisible = true; }
  else if (elapsed < 950) { phase = 'happy'; start = 650; duration = 300; face = 'happy'; customerX = 309; bubbleVisible = true; }
  else if (elapsed < 1400) { phase = 'depart'; start = 950; duration = 450; face = 'happy'; customerX = 309 - 381 * easeIn((elapsed - 950) / 450); bubbleVisible = false; }
  else if (transaction.result === 'correct' && elapsed < 1850) {
    phase = 'arrive'; start = 1400; duration = 450; face = 'neutral'; customerX = -72 + 381 * easeOut((elapsed - 1400) / 450); bubbleVisible = false;
  } else {
    phase = 'complete'; start = transaction.result === 'won' ? 1400 : 1850; duration = 0;
    face = 'neutral'; customerX = transaction.result === 'won' ? -72 : 309; bubbleVisible = false;
  }
  const phaseElapsed = Math.max(0, elapsed - start);
  sample.phase = phase;
  sample.face = phase === 'happy' || phase === 'disappointed'
    ? (phaseElapsed < 80 ? 'squash' : phaseElapsed < 150 ? 'blink' : phaseElapsed < 225 ? 'expand_mid' : face) : face;
  sample.faceProgress = phase === 'happy' || phase === 'disappointed' ? clamp01((phaseElapsed - 150) / 150) : 1;
  sample.phaseStartedAtMs = transaction.submittedAtMs + start;
  sample.phaseDurationMs = duration;
  sample.progress = duration > 0 ? clamp01(phaseElapsed / duration) : 1;
  sample.complete = phase === 'complete';
  sample.customerX = customerX;
  sample.bubbleVisible = bubbleVisible;
  return sample;
}

export function shouldLockInput(transaction: PresentationTransaction | null): boolean {
  return transaction !== null;
}
