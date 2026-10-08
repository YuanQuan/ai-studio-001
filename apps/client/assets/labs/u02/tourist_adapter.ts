import { SpriteFrame } from 'cc';
import {
  TouristAction, TouristFrame, TouristFrameAdapter, TouristFrameCommit,
  TouristPlayback, TouristSlot,
} from './tourist_state';
import { TouristView } from './tourist_view';

export interface TouristPoint { x: number; y: number; }
export interface TouristMount extends TouristPoint {
  valid: boolean;
  visible: boolean;
}
export interface TouristMountFrame {
  frameId: string;
  action: TouristAction;
  index: number;
  durationMs: number;
  foot: TouristPoint;
  mounts: Record<'head' | 'face' | 'wristNear' | 'wristFar', TouristMount>;
  occlusion: Record<TouristSlot, string>;
}
export interface TouristFrameManifest {
  bodyAssetId: string;
  initial: string;
  actions: Record<TouristAction, { frameCount: number; playback: TouristPlayback }>;
  frames: Array<{ frameId: string; action: TouristAction; index: number;
    durationMs: number; file: string }>;
}
export interface TouristMountManifest {
  originalFacing: 'right';
  canvas: { width: number; height: number };
  foot: TouristPoint;
  frames: TouristMountFrame[];
}
export interface TouristAccessory {
  assetId: string;
  category: TouristSlot;
  size: { width: number; height: number };
  pivot: TouristPoint;
  mountKey: 'head' | 'face' | 'wristNear' | 'wristFar';
  mirrorPolicy: string;
  exports: string[];
}
export interface TouristAccessoryManifest { items: TouristAccessory[]; }

const ACTIONS: TouristAction[] = ['walk', 'run', 'happy', 'sad'];
const SLOTS: TouristSlot[] = ['hat', 'glasses', 'wristband'];

/** Binds the approved 20 body frames and four separate accessory slices. */
export class ApprovedTouristAdapter implements TouristFrameAdapter {
  private readonly frames = new Map<string, TouristFrame>();
  private readonly mountFrames = new Map<string, TouristMountFrame>();
  private readonly accessories = new Map<string, TouristAccessory>();
  private readonly bodySprites = new Map<string, SpriteFrame>();
  private readonly accessorySprites = new Map<string, SpriteFrame>();
  public readonly valid: boolean;
  private failureReason = '';

  constructor(
    private readonly view: TouristView,
    private readonly frameManifest: TouristFrameManifest,
    mountManifest: TouristMountManifest,
    accessoryManifest: TouristAccessoryManifest,
    bodyFrames: SpriteFrame[],
    accessoryFrames: SpriteFrame[],
  ) {
    for (let i = 0; i < frameManifest.frames.length; i++) {
      const item = frameManifest.frames[i];
      this.frames.set(item.frameId, {
        frameId: item.frameId, durationMs: item.durationMs,
        mountVersion: 'U02-FULL-A/formal-v0.1',
      });
      if (bodyFrames[i]) this.bodySprites.set(item.frameId, bodyFrames[i]);
    }
    for (const item of mountManifest.frames) this.mountFrames.set(item.frameId, item);
    for (const item of accessoryManifest.items) this.accessories.set(item.assetId, item);
    const paths: string[] = [];
    for (const item of accessoryManifest.items) paths.push(...item.exports);
    for (let i = 0; i < paths.length; i++) {
      if (accessoryFrames[i]) this.accessorySprites.set(paths[i], accessoryFrames[i]);
    }
    this.valid = this.validate(mountManifest, bodyFrames, accessoryFrames, paths);
  }

  public frameCount(action: TouristAction): number {
    return this.valid ? this.frameManifest.actions[action]?.frameCount ?? 0 : 0;
  }

  public frame(action: TouristAction, index: number): TouristFrame | null {
    if (!this.valid) return null;
    const item = this.frameManifest.frames.find(candidate =>
      candidate.action === action && candidate.index === index);
    return item ? this.frames.get(item.frameId) ?? null : null;
  }

  public playback(action: TouristAction): TouristPlayback {
    return this.frameManifest.actions[action]?.playback ?? 'loop';
  }

  public commit(packet: TouristFrameCommit): boolean {
    if (!this.valid) {
      console.error('[U02] adapter invalid at commit', this.diagnostic());
      return false;
    }
    const item = this.frameManifest.frames.find(candidate =>
      candidate.action === packet.action && candidate.index === packet.frameIndex);
    if (!item || packet.frame.frameId !== item.frameId) {
      console.error('[U02] frame packet mismatch', packet.action, packet.frameIndex,
        packet.frame.frameId, item?.frameId);
      return false;
    }
    const body = this.bodySprites.get(item.frameId);
    const mounts = this.mountFrames.get(item.frameId);
    if (!body || !mounts) {
      console.error('[U02] body or mount missing', item.frameId, !!body, !!mounts);
      return false;
    }
    const selected: Partial<Record<TouristSlot, TouristAccessory>> = {};
    for (const slot of SLOTS) {
      const id = packet.slots[slot];
      if (id === null) continue;
      const accessory = this.accessories.get(id);
      if (!accessory || accessory.category !== slot
        || accessory.exports.some(path => !this.accessorySprites.has(path))) {
        console.error('[U02] accessory missing', slot, id);
        return false;
      }
      selected[slot] = accessory;
    }
    try {
      const applied = this.view.apply(body, mounts, selected,
        this.accessorySprites, packet.facing);
      if (!applied) console.error('[U02] view rejected frame', item.frameId);
      return applied;
    } catch (error) {
      console.error('[U02] view.apply exception', item.frameId, error);
      return false;
    }
  }

  public clear(): void { this.view.clear(); }

  public availableAccessory(slot: TouristSlot): boolean {
    for (const item of this.accessories.values()) {
      if (item.category === slot) {
        return item.exports.every(path => this.accessorySprites.has(path));
      }
    }
    return false;
  }

  public diagnostic(): Record<string, unknown> {
    return {
      valid: this.valid, failureReason: this.failureReason,
      manifestFrames: this.frameManifest.frames?.length,
      mountFrames: this.mountFrames.size,
      bodyBound: this.bodySprites.size,
      accessoryBound: this.accessorySprites.size,
      accessoryItems: this.accessories.size,
      initialFrame: this.frame('walk', 0)?.frameId ?? null,
      slots: SLOTS.map(slot => [slot, this.availableAccessory(slot)]),
    };
  }

  private validate(
    mountManifest: TouristMountManifest, bodyFrames: SpriteFrame[],
    accessoryFrames: SpriteFrame[], paths: string[],
  ): boolean {
    if (this.frameManifest.bodyAssetId !== 'UG_GHOST_01'
      || this.frameManifest.initial !== 'walk_00'
      || mountManifest.originalFacing !== 'right'
      || mountManifest.canvas.width !== 512 || mountManifest.canvas.height !== 512
      || mountManifest.foot.x !== 256 || mountManifest.foot.y !== 440
      || this.frameManifest.frames.length !== 20 || mountManifest.frames.length !== 20
      || bodyFrames.length !== 20 || paths.length !== 4
      || this.frames.size !== 20 || this.mountFrames.size !== 20) {
      this.failureReason = 'top-level manifest/count/binding mismatch';
      return false;
    }
    const expected: Record<TouristAction, number> = { walk: 6, run: 6, happy: 4, sad: 4 };
    for (const action of ACTIONS) {
      const count = this.frameManifest.actions[action]?.frameCount;
      if (count !== expected[action] || count > 10) {
        this.failureReason = `${action} count mismatch: ${count}`;
        return false;
      }
      for (let index = 0; index < count; index++) {
        const item = this.frameManifest.frames.find(frame =>
          frame.action === action && frame.index === index);
        const mount = item && this.mountFrames.get(item.frameId);
        if (!item || !mount || mount.action !== action || mount.index !== index
          || mount.durationMs !== item.durationMs || !this.bodySprites.get(item.frameId)
          || mount.foot.x !== 256 || mount.foot.y !== 440) {
          this.failureReason = `${action}[${index}] body/mount/duration mismatch`;
          return false;
        }
      }
    }
    for (const slot of SLOTS) {
      let present = false;
      for (const accessory of this.accessories.values()) {
        if (accessory.category === slot) { present = true; break; }
      }
      if (!present) {
        this.failureReason = `${slot} category manifest mismatch`;
        return false;
      }
    }
    return true;
  }
}
