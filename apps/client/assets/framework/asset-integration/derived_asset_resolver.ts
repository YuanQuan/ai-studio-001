import { Rect, Size, SpriteFrame, Vec2 } from 'cc';
import { ModuleAssets, ModuleLease, OwnerGeneration } from '../module-assets/module_assets';

export type DerivedFrameDescriptor = {
  stableAssetId: string;
  bundle: string;
  sourceAssetId: string;
  originalSize: [number, number];
  rect: [number, number, number, number];
  offset: [number, number];
  pivot: [number, number];
  revision?: string;
};
export type DerivedAssetManifest = { assets: DerivedFrameDescriptor[] };
export type ResolvedFrameLease = { readonly frame: SpriteFrame; readonly owner: ModuleLease; release(): void };
export type DerivedModuleLease = {
  readonly owner: ModuleLease;
  getFrame(stableAssetId: string): ResolvedDerivedFrame;
  release(): void;
};
export type ResolvedDerivedFrame = { readonly frame: SpriteFrame; release(): void };

type CachedFrame = { frame: SpriteFrame; refs: number };

/** Creates per-logical-frame public SpriteFrame derivatives without mutating imported frames. */
export class DerivedAssetResolver {
  private readonly descriptors = new Map<string, DerivedFrameDescriptor>();
  // Texture object identity is authoritative: UUID/name can be empty or duplicated in
  // imported/runtime textures. Geometry remains a second-level key per texture.
  private readonly derived = new WeakMap<object, Map<string, CachedFrame>>();
  private liveDerivedCount = 0;

  constructor(private readonly modules: ModuleAssets, manifest: DerivedAssetManifest) {
    for (const descriptor of manifest.assets) {
      if (!descriptor.stableAssetId || this.descriptors.has(descriptor.stableAssetId)) {
        throw new Error(`派生帧清单ID为空或重复：${descriptor.stableAssetId}`);
      }
      this.validateDescriptor(descriptor);
      this.descriptors.set(descriptor.stableAssetId, descriptor);
    }
  }

  async acquire(stableAssetId: string, generation: OwnerGeneration): Promise<ResolvedFrameLease> {
    const descriptor = this.descriptors.get(stableAssetId);
    if (!descriptor) throw new Error(`派生帧清单缺少资源：${stableAssetId}`);
    const moduleLease = await this.acquireModule(descriptor.bundle, generation);
    try {
      const frameLease = moduleLease.getFrame(stableAssetId);
      let released = false;
      return {
        frame: frameLease.frame,
        owner: moduleLease.owner,
        release: () => {
          if (released) return;
          released = true;
          try { frameLease.release(); }
          finally { moduleLease.release(); }
        },
      };
    } catch (error) {
      moduleLease.release();
      throw error;
    }
  }

  /** Acquire every source in one bundle once, then derive only frames actually used. */
  async acquireModule(bundle: string, generation: OwnerGeneration): Promise<DerivedModuleLease> {
    const moduleLease = await this.modules.acquire(bundle, generation);
    const activeFrames = new Set<ResolvedDerivedFrame>();
    let released = false;
    return {
      owner: moduleLease,
      getFrame: (stableAssetId: string): ResolvedDerivedFrame => {
        if (released) throw new Error(`派生模块租约已释放：${bundle}`);
        const descriptor = this.descriptors.get(stableAssetId);
        if (!descriptor || descriptor.bundle !== bundle) throw new Error(`资源不属于当前Bundle：${stableAssetId}/${bundle}`);
        const imported = moduleLease.get<SpriteFrame>(descriptor.sourceAssetId);
        if (!(imported instanceof SpriteFrame) || !imported.texture) {
          throw new Error(`源资源不是含Texture的SpriteFrame：${stableAssetId}/${descriptor.sourceAssetId}`);
        }
        const texture = imported.texture as any as object;
        const dimensions = this.textureSize(imported.texture, stableAssetId);
        const key = this.cacheKey(descriptor);
        let textureCache = this.derived.get(texture);
        if (!textureCache) {
          textureCache = new Map<string, CachedFrame>();
          this.derived.set(texture, textureCache);
        }
        let cached = textureCache.get(key);
        if (!cached) {
          const [x, y, width, height] = descriptor.rect;
          const [originalWidth, originalHeight] = descriptor.originalSize;
          const [offsetX, offsetY] = descriptor.offset;
          const [pivotX, pivotY] = descriptor.pivot;
          if (pivotX !== 0.5 || pivotY !== 0.5) throw new Error(`当前Creator公开reset不支持非中心pivot：${stableAssetId}`);
          if (x < 0 || y < 0 || width <= 0 || height <= 0
            || x + width > dimensions.width || y + height > dimensions.height) {
            throw new Error(`派生帧rect超出实际Texture：${stableAssetId} rect=${x},${y},${width},${height} texture=${dimensions.width}x${dimensions.height}`);
          }
          const frame = new SpriteFrame();
          try {
            // Derived standalone frames are not packed into a dynamic atlas:
            // cropping/padding UVs must remain identical to the source Texture.
            frame.packable = false;
            frame.reset({ texture: imported.texture, originalSize: new Size(originalWidth, originalHeight),
              rect: new Rect(x, y, width, height), offset: new Vec2(offsetX, offsetY), isRotate: false }, true);
          } catch (error) {
            if (frame.isValid) frame.destroy();
            throw error;
          }
          cached = { frame, refs: 0 };
          textureCache.set(key, cached);
          this.liveDerivedCount++;
        }
        cached.refs++;
        let frameReleased = false;
        const handle: ResolvedDerivedFrame = {
          frame: cached.frame,
          release: () => {
            if (frameReleased) return;
            frameReleased = true;
            activeFrames.delete(handle);
            this.releaseDerivedForTexture(texture, key);
          },
        };
        activeFrames.add(handle);
        return handle;
      },
      release: () => {
        if (released) return;
        released = true;
        for (const handle of Array.from(activeFrames)) handle.release();
        moduleLease.release();
      },
    };
  }

  getLiveDerivedCount(): number { return this.liveDerivedCount; }
  getDerivedRefCount(stableAssetId: string, imported: SpriteFrame): number {
    const descriptor = this.descriptors.get(stableAssetId);
    if (!descriptor) return 0;
    const texture = imported.texture as any as object;
    return this.derived.get(texture)?.get(this.cacheKey(descriptor))?.refs ?? 0;
  }

  private validateDescriptor(d: DerivedFrameDescriptor): void {
    const [x, y, width, height] = d.rect;
    const [ow, oh] = d.originalSize;
    if (!d.bundle || !d.sourceAssetId || ![x, y, width, height, ow, oh, ...d.offset, ...d.pivot].every(Number.isFinite)
      || width <= 0 || height <= 0 || ow <= 0 || oh <= 0 || x < 0 || y < 0 || x + width > ow || y + height > oh) {
      throw new Error(`派生帧几何无效：${d.stableAssetId}`);
    }
  }

  private textureSize(texture: any, id: string): { width: number; height: number } {
    const width = Number(texture?.width ?? texture?.getWidth?.());
    const height = Number(texture?.height ?? texture?.getHeight?.());
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      throw new Error(`源Texture没有有效像素尺寸：${id}`);
    }
    return { width, height };
  }

  private cacheKey(d: DerivedFrameDescriptor): string {
    return `${d.revision ?? ''}|${d.originalSize.join(',')}|${d.rect.join(',')}|${d.offset.join(',')}|${d.pivot.join(',')}`;
  }

  private releaseDerivedForTexture(texture: object, key: string): void {
    const textureCache = this.derived.get(texture);
    const cached = textureCache?.get(key);
    if (!cached || !textureCache) return;
    cached.refs = Math.max(0, cached.refs - 1);
    if (cached.refs === 0) {
      textureCache.delete(key);
      if (textureCache.size === 0) this.derived.delete(texture);
      this.liveDerivedCount--;
      if (cached.frame.isValid) cached.frame.destroy();
    }
  }
}
