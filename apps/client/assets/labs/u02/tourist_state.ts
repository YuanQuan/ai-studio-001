/** U02's resource-independent state contract. No character image is bundled here. */
export type TouristAction = 'walk' | 'run' | 'happy' | 'sad';
export type TouristFacing = 'right' | 'left';
export type TouristPhase = 'initial' | 'playing' | 'holding';
export type TouristSlot = 'hat' | 'glasses' | 'wristband';
export type TouristPlayback = 'loop' | 'once_hold';

export interface TouristSlots {
  hat: string | null;
  glasses: string | null;
  wristband: string | null;
}

export interface TouristSnapshot {
  action: TouristAction | null;
  frameIndex: number;
  phase: TouristPhase;
  facing: TouristFacing;
  slots: TouristSlots;
  generation: number;
  /** False until an approved body frame has actually been committed. */
  ready: boolean;
  error: string | null;
}

export interface TouristFrame {
  frameId: string;
  durationMs: number;
  /** The adapter owns the approved body's SpriteFrame and all frame mount data. */
  mountVersion: string;
}

export interface TouristFrameCommit {
  frame: TouristFrame;
  action: TouristAction;
  frameIndex: number;
  phase: TouristPhase;
  facing: TouristFacing;
  slots: TouristSlots;
  generation: number;
}

/**
 * A later, Gate-2-approved adapter must update body SpriteFrame, accessory
 * sprites, positions, visibility and depth together, then return true.
 * Returning false leaves the last effective state and UI selection unchanged.
 */
export interface TouristFrameAdapter {
  frameCount(action: TouristAction): number;
  frame(action: TouristAction, index: number): TouristFrame | null;
  playback(action: TouristAction): TouristPlayback;
  commit(packet: TouristFrameCommit): boolean;
  clear(): void;
}

type StateListener = (state: TouristSnapshot) => void;

const INITIAL_SLOTS: TouristSlots = { hat: null, glasses: null, wristband: null };

export class TouristStateController {
  private adapter: TouristFrameAdapter | null = null;
  private listener: StateListener | null = null;
  private elapsedMs = 0;
  private generation = 0;
  private state: TouristSnapshot = this.initialState();

  public snapshot(): TouristSnapshot {
    return { ...this.state, slots: { ...this.state.slots } };
  }

  public onChange(listener: StateListener | null): void {
    this.listener = listener;
    this.notify();
  }

  public isCurrentGeneration(generation: number): boolean {
    return generation === this.generation;
  }

  /** Called only after the concrete adapter's resources pass their approval gate. */
  public attach(adapter: TouristFrameAdapter): boolean {
    this.detach();
    this.adapter = adapter;
    const initial = this.initialState();
    if (!this.commit(initial)) {
      this.adapter = null;
      this.setError('游客主体资源不可用');
      return false;
    }
    return true;
  }

  public selectAction(action: TouristAction): boolean {
    if (this.state.action === action && this.state.ready) return true;
    if (!this.state.ready) return this.rejectUnavailable();
    const next: TouristSnapshot = {
      ...this.state, action, frameIndex: 0, phase: 'playing',
      generation: this.nextGeneration(), error: null,
    };
    if (!this.commit(next)) return this.setError('动作帧不可用');
    this.elapsedMs = 0;
    return true;
  }

  public setFacing(facing: TouristFacing): boolean {
    if (this.state.facing === facing && this.state.ready) return true;
    if (!this.state.ready) return this.rejectUnavailable();
    const next = { ...this.state, facing, generation: this.nextGeneration(), error: null };
    return this.commit(next) || this.setError('朝向切换失败');
  }

  public setSlot(slot: TouristSlot, accessoryId: string | null): boolean {
    if (this.state.slots[slot] === accessoryId && this.state.ready) return true;
    if (!this.state.ready) return this.rejectUnavailable();
    const next = {
      ...this.state,
      slots: { ...this.state.slots, [slot]: accessoryId },
      generation: this.nextGeneration(), error: null,
    };
    return this.commit(next) || this.setError('装扮资源不可用');
  }

  public tick(deltaMs: number): void {
    if (!this.state.ready || this.state.phase !== 'playing' || !this.adapter
      || !Number.isFinite(deltaMs) || deltaMs <= 0) return;
    this.elapsedMs += deltaMs;
    // Bound catch-up work after a suspended browser tab or a long frame.
    for (let steps = 0; steps < 10; steps++) {
      const action = this.state.action;
      if (!action || !this.adapter) return;
      const frame = this.adapter.frame(action, this.state.frameIndex);
      if (!frame || !Number.isFinite(frame.durationMs) || frame.durationMs <= 0) {
        this.setError('动作帧时长无效');
        return;
      }
      if (this.elapsedMs < frame.durationMs) return;
      this.elapsedMs -= frame.durationMs;
      const count = this.validCount(action);
      if (!count) { this.setError('动作帧数量无效'); return; }
      const last = this.state.frameIndex + 1 >= count;
      const hold = last && this.adapter.playback(action) === 'once_hold';
      const next: TouristSnapshot = {
        ...this.state,
        frameIndex: hold ? this.state.frameIndex : (this.state.frameIndex + 1) % count,
        phase: hold ? 'holding' : 'playing',
      };
      if (!this.commit(next)) { this.setError('动作帧提交失败'); return; }
      if (hold) { this.elapsedMs = 0; return; }
    }
    this.elapsedMs = 0;
  }

  public reset(): void {
    this.nextGeneration();
    this.elapsedMs = 0;
    if (this.adapter) {
      this.adapter.clear();
      if (this.commit(this.initialState())) return;
      this.adapter = null;
    }
    this.state = this.initialState();
    this.notify();
  }

  public detach(): void {
    this.nextGeneration();
    this.elapsedMs = 0;
    this.adapter?.clear();
    this.adapter = null;
    this.state = this.initialState();
    this.notify();
  }

  private initialState(): TouristSnapshot {
    return {
      action: null, frameIndex: 0, phase: 'initial', facing: 'right',
      slots: { ...INITIAL_SLOTS }, generation: this.generation,
      ready: false, error: null,
    };
  }

  private validCount(action: TouristAction): number {
    const count = this.adapter?.frameCount(action) ?? 0;
    return Number.isInteger(count) && count >= 1 && count <= 10 ? count : 0;
  }

  private commit(next: TouristSnapshot): boolean {
    if (!this.adapter) return false;
    const action = next.action ?? 'walk';
    const count = this.validCount(action);
    if (!count || next.frameIndex >= count) return false;
    const frame = this.adapter.frame(action, next.frameIndex);
    if (!frame || !frame.frameId || !frame.mountVersion
      || !Number.isFinite(frame.durationMs) || frame.durationMs <= 0) return false;
    const packet: TouristFrameCommit = {
      frame, action, frameIndex: next.frameIndex, phase: next.phase,
      facing: next.facing, slots: { ...next.slots }, generation: next.generation,
    };
    try {
      if (!this.adapter.commit(packet)) return false;
    } catch {
      return false;
    }
    this.state = { ...next, slots: { ...next.slots }, ready: true, error: null };
    this.notify();
    return true;
  }

  private rejectUnavailable(): false {
    return this.setError('正式游客资源尚未接入');
  }

  private setError(message: string): false {
    this.state = { ...this.state, generation: this.generation, error: message };
    this.notify();
    return false;
  }

  private nextGeneration(): number { return ++this.generation; }

  private notify(): void { this.listener?.(this.snapshot()); }
}
