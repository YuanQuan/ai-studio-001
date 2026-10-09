import { SpriteFrame } from 'cc';
import {
  TouristAction, TouristFrame, TouristFrameAdapter, TouristFrameCommit,
  TouristPlayback, TouristSlot,
} from './tourist_state';
import { TouristView } from './tourist_view';

export interface TouristPoint { x: number; y: number; }
export type TouristAffine = [number, number, number, number];
export interface TouristMount extends TouristPoint {
  valid: boolean;
  visible: boolean;
  localAffine: TouristAffine;
  rotationDeg: number;
}
export interface TouristMountFrame {
  frameId: string;
  action: TouristAction;
  index: number;
  durationMs: number;
  durationFractionMs: [number, number];
  playback: TouristPlayback;
  foot: TouristPoint;
  mounts: Record<'head' | 'face' | 'wristNear' | 'wristFar', TouristMount>;
  occlusion: Record<TouristSlot, string>;
}
export interface TouristFrameItem {
  frameId: string;
  action: TouristAction;
  index: number;
  durationMs: number;
  durationFractionMs: [number, number];
  playback: TouristPlayback;
  file: string;
  sourceFile: string;
  sha256: string;
  pixelSha256: string;
}
export interface TouristFrameManifest {
  schemaVersion: 2;
  batch: string;
  bodyAssetId: string;
  version: string;
  approval: 'USER_APPROVED';
  approvalRef: string;
  sourceManifestPath: string;
  sourceManifestSha256: string;
  initial: string;
  frameCount: number;
  actions: Record<TouristAction, {
    frameCount: number;
    playback: TouristPlayback;
    totalDurationMs: number;
    lastFrameHold: boolean;
  }>;
  frames: TouristFrameItem[];
}
export interface TouristMountManifest {
  schemaVersion: 2;
  batch: string;
  originalFacing: 'right';
  leftFacing: 'mirror_with_body';
  canvas: { width: number; height: number };
  foot: TouristPoint;
  frameCount: number;
  sourceManifestPath: string;
  sourceManifestSha256: string;
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

/** Binds the Gate2-approved U02-VFX-A v0.2 frames and affine mount data. */
export class ApprovedTouristAdapter implements TouristFrameAdapter {
  private readonly frames = new Map<string, TouristFrame>();
  private readonly frameItems = new Map<string, TouristFrameItem>();
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
      this.frameItems.set(item.frameId, item);
      this.frames.set(item.frameId, {
        frameId: item.frameId,
        durationMs: item.durationMs,
        mountVersion: `${frameManifest.batch}/${frameManifest.version}`,
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
      frameCounts: { walk: this.frameCount('walk'), run: this.frameCount('run'),
        happy: this.frameCount('happy'), sad: this.frameCount('sad') },
      playback: { walk: this.playback('walk'), run: this.playback('run'),
        happy: this.playback('happy'), sad: this.playback('sad') },
      slots: SLOTS.map(slot => [slot, this.availableAccessory(slot)]),
    };
  }

  private validate(
    mountManifest: TouristMountManifest, bodyFrames: SpriteFrame[],
    accessoryFrames: SpriteFrame[], paths: string[],
  ): boolean {
    if (this.frameManifest.schemaVersion !== 2
      || this.frameManifest.batch !== 'U02-VFX-A'
      || this.frameManifest.bodyAssetId !== 'UG_GHOST_01'
      || this.frameManifest.version !== 'v0.2'
      || this.frameManifest.approval !== 'USER_APPROVED'
      || this.frameManifest.initial !== 'walk_00'
      || this.frameManifest.frameCount !== 40
      || mountManifest.schemaVersion !== 2
      || mountManifest.batch !== this.frameManifest.batch
      || mountManifest.frameCount !== 40
      || mountManifest.originalFacing !== 'right'
      || mountManifest.leftFacing !== 'mirror_with_body'
      || mountManifest.canvas.width !== 512 || mountManifest.canvas.height !== 512
      || mountManifest.foot.x !== 256 || mountManifest.foot.y !== 440
      || this.frameManifest.frames.length !== 40 || mountManifest.frames.length !== 40
      || bodyFrames.length !== 40 || paths.length !== 4
      || this.frames.size !== 40 || this.frameItems.size !== 40
      || this.mountFrames.size !== 40) {
      this.failureReason = 'v0.2 manifest/count/binding mismatch';
      return false;
    }
    const expected: Record<TouristAction, number> = {
      walk: 10, run: 10, happy: 10, sad: 10,
    };
    for (const action of ACTIONS) {
      const actionSpec = this.frameManifest.actions[action];
      if (actionSpec?.frameCount !== expected[action] || actionSpec.playback !== 'loop'
        || actionSpec.lastFrameHold !== false) {
        this.failureReason = `${action} count/playback mismatch`;
        return false;
      }
      const ordered = this.frameManifest.frames
        .filter(frame => frame.action === action)
        .sort((a, b) => a.index - b.index);
      if (ordered.length !== 10) {
        this.failureReason = `${action} has ${ordered.length} frames`;
        return false;
      }
      for (let index = 0; index < 10; index++) {
        const item = ordered[index];
        const mount = this.mountFrames.get(item.frameId);
        if (!item || item.index !== index || !item.sha256
          || !Number.isFinite(item.durationMs) || item.durationMs <= 0
          || item.playback !== 'loop'
          || !Array.isArray(item.durationFractionMs)
          || item.durationFractionMs[1] <= 0
          || Math.abs(item.durationMs - item.durationFractionMs[0] / item.durationFractionMs[1]) > 1e-6
          || !mount || mount.action !== action || mount.index !== index
          || mount.durationMs !== item.durationMs
          || mount.durationFractionMs[0] !== item.durationFractionMs[0]
          || mount.durationFractionMs[1] !== item.durationFractionMs[1]
          || mount.playback !== 'loop' || !this.bodySprites.get(item.frameId)
          || mount.foot.x !== 256 || mount.foot.y !== 440
          || !this.validAffineMounts(mount)) {
          this.failureReason = `${action}[${index}] body/mount/duration/affine mismatch`;
          return false;
        }
      }
    }
    for (let i = 0; i < 10; i++) {
      if (orderedFrame(this.frameManifest.frames, 'walk', i)?.sha256
        !== orderedFrame(this.frameManifest.frames, 'run', i)?.sha256) {
        this.failureReason = `walk/run pose bytes differ at ${i}`;
        return false;
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

  private validAffineMounts(frame: TouristMountFrame): boolean {
    const keys: Array<keyof TouristMountFrame['mounts']> = [
      'head', 'face', 'wristNear', 'wristFar',
    ];
    for (const key of keys) {
      const mount = frame.mounts[key];
      if (!mount || !Number.isFinite(mount.x) || !Number.isFinite(mount.y)
        || !Array.isArray(mount.localAffine) || mount.localAffine.length !== 4
        || mount.localAffine.some(value => !Number.isFinite(value))
        || !Number.isFinite(mount.rotationDeg)) return false;
      const [a, b, c, d] = mount.localAffine;
      if (Math.abs(a * d - b * c) < 1e-5) return false;
    }
    return true;
  }
}

function orderedFrame(
  frames: TouristFrameItem[], action: TouristAction, index: number,
): TouristFrameItem | undefined {
  return frames.find(frame => frame.action === action && frame.index === index);
}

