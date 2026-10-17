import { Node, Sprite, SpriteFrame, UITransform } from 'cc';
import { ModuleAssets, ModuleLease, ModuleManifest, ModuleOwner, OwnerGeneration, ResourceDescriptor } from '../module-assets/module_assets';
import { DerivedAssetResolver, DerivedFrameDescriptor, DerivedModuleLease, ResolvedDerivedFrame } from './derived_asset_resolver';

type AssetCallback<T = unknown> = (error: Error | null, asset?: T) => void;
type PathEntry = { moduleId: string; assetId: string; descriptor: ResourceDescriptor };

/** Page-scoped leases shared by Gallery pages and the U01/U05 resource adapters. */
export class GalleryAssetSession {
  readonly owner: OwnerGeneration;
  private readonly moduleLeases = new Map<string, ModuleLease>();
  private readonly derivedLeases = new Map<string, Promise<DerivedModuleLease>>();
  private readonly pending = new Set<{ cancel?: () => void }>();
  private readonly frameHandles = new Map<string, ResolvedDerivedFrame[]>();
  private readonly pendingReleases = new Map<string, number>();
  private readonly derivedFrameMaps = new Map<string, Map<SpriteFrame, SpriteFrame>>();
  private disposed = false;

  constructor(
    private readonly modules: ModuleAssets,
    private readonly derived: DerivedAssetResolver,
    private readonly manifest: ModuleManifest,
    private readonly derivedManifest: readonly DerivedFrameDescriptor[],
    token: string,
    generation: number,
    private readonly isCurrent: (owner: OwnerGeneration) => boolean,
  ) {
    if (!token || !Number.isFinite(generation)) throw new Error('页面资源会话必须有token与generation');
    this.owner = { token, generation };
  }

  async acquireModules(moduleIds: readonly string[]): Promise<void> {
    this.assertActive();
    const unique = [...new Set(moduleIds)];
    await Promise.all(unique.map(id => this.acquireModule(id)));
    this.assertCurrent();
  }

  get<T = unknown>(moduleId: string, assetId: string): T {
    this.assertCurrent();
    const lease = this.moduleLeases.get(moduleId);
    if (!lease) throw new Error(`页面尚未取得模块租约：${moduleId}`);
    return lease.get<T>(assetId);
  }

  async getPrototypeFrames(prototypes: ReadonlyArray<{ id: string; path: string }>): Promise<Map<string, SpriteFrame>> {
    this.assertCurrent();
    const result = new Map<string, SpriteFrame>();
    await Promise.all(prototypes.map(async prototype => {
      const runtimePath = `sakura_v03/${prototype.path.replace(/\.png$/i, '')}/spriteFrame`;
      const entry = this.findPath(runtimePath, SpriteFrame, prototype.id);
      await this.acquireModule(entry.moduleId);
      const asset = await this.getEntryAsset(entry);
      if (!(asset instanceof SpriteFrame)) throw new Error(`原型资源不是SpriteFrame：${prototype.id} / ${prototype.path}`);
      result.set(prototype.id, asset);
    }));
    this.assertCurrent();
    return result;
  }

  async getDerivedFrame(moduleId: string, stableAssetId: string): Promise<SpriteFrame> {
    this.assertCurrent();
    const definition = this.manifest[moduleId];
    const descriptor = definition && this.derivedManifest.find(item =>
      item.bundle === definition.bundle && item.stableAssetId === stableAssetId);
    if (!definition || !descriptor) {
      const module = this.manifest[moduleId];
      if (!module?.assets[stableAssetId]) throw new Error(`派生帧或模块资源未登记：${moduleId}/${stableAssetId}`);
      await this.acquireModule(moduleId);
      const raw = this.get(moduleId, stableAssetId);
      if (!(raw instanceof SpriteFrame)) throw new Error(`模块资源不是SpriteFrame：${moduleId}/${stableAssetId}`);
      return raw;
    }
    await this.acquireModule(moduleId);
    const imported = this.get<SpriteFrame>(moduleId, descriptor.sourceAssetId);
    const handle = await this.acquireDerived(moduleId, stableAssetId);
    this.holdFrameHandle(`derived:${moduleId}:${stableAssetId}`, handle);
    let frameMap = this.derivedFrameMaps.get(moduleId);
    if (!frameMap) { frameMap = new Map<SpriteFrame, SpriteFrame>(); this.derivedFrameMaps.set(moduleId, frameMap); }
    frameMap.set(imported, handle.frame);
    return handle.frame;
  }

  /** Prepare public derived frames for prefab clones before attaching them to the active scene. */
  async prepareDerivedFrames(moduleId: string): Promise<void> {
    this.assertCurrent();
    const definition = this.manifest[moduleId];
    if (!definition) throw new Error(`模块清单缺少模块：${moduleId}`);
    const descriptors = this.derivedManifest.filter(item => item.bundle === definition.bundle);
    if (!descriptors.length) return;
    await this.acquireModule(moduleId);
    let frameMap = this.derivedFrameMaps.get(moduleId);
    if (!frameMap) { frameMap = new Map<SpriteFrame, SpriteFrame>(); this.derivedFrameMaps.set(moduleId, frameMap); }
    for (const descriptor of descriptors) {
      const sourceDescriptor = definition.assets[descriptor.sourceAssetId];
      // Historical identity rows may remain in the approved crop catalog after
      // production staging intentionally omits that source from this bundle.
      if (!sourceDescriptor) continue;
      const imported = this.get<SpriteFrame>(moduleId, descriptor.sourceAssetId);
      if (!(imported instanceof SpriteFrame)) throw new Error(`派生帧源不是SpriteFrame：${descriptor.sourceAssetId}`);
      if (frameMap.has(imported)) continue;
      const handle = await this.acquireDerived(moduleId, descriptor.stableAssetId);
      this.holdFrameHandle(`prepared:${moduleId}:${descriptor.stableAssetId}`, handle);
      frameMap.set(imported, handle.frame);
    }
  }

  applyDerivedFramesInTree(root: Node, moduleId: string): number {
    this.assertCurrent();
    const frameMap = this.derivedFrameMaps.get(moduleId);
    if (!frameMap) return 0;
    let replaced = 0;
    const visit = (node: Node): void => {
      const sprite = node.getComponent(Sprite);
      const source = sprite?.spriteFrame;
      const derived = source ? frameMap.get(source) : undefined;
      if (sprite && derived) {
        const transform = node.getComponent(UITransform);
        const contentSize = transform?.contentSize.clone();
        const anchor = transform?.anchorPoint.clone();
        const position = node.position.clone();
        const scale = node.scale.clone();
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.trim = false;
        sprite.spriteFrame = derived;
        if (transform && contentSize && anchor) {
          transform.setContentSize(contentSize);
          transform.setAnchorPoint(anchor.x, anchor.y);
        }
        node.setPosition(position);
        node.setScale(scale);
        replaced++;
      }
      for (const child of node.children) visit(child);
    };
    visit(root);
    return replaced;
  }

  async getExportedSpriteFrame(moduleId: string, exportedPngPath: string): Promise<SpriteFrame> {
    const suffix = `${exportedPngPath.replace(/\\/g, '/').replace(/\.png$/i, '')}/spriteFrame`;
    const definition = this.manifest[moduleId];
    const matches: PathEntry[] = [];
    for (const [assetId, descriptor] of Object.entries(definition?.assets ?? {})) {
      if (descriptor.path === suffix || descriptor.path.endsWith(`/${suffix}`)) {
        matches.push({ moduleId, assetId, descriptor });
      }
    }
    const identities = new Map<string, PathEntry>();
    for (const match of matches) {
      const key = `${match.descriptor.path}\u0000${this.typeKey(match.descriptor.type)}\u0000${match.descriptor.revision ?? ''}`;
      if (!identities.has(key)) identities.set(key, match);
    }
    if (identities.size !== 1) throw new Error(`导出SpriteFrame登记${identities.size ? '不唯一' : '缺失'}：${moduleId}/${exportedPngPath}`);
    await this.acquireModule(moduleId);
    const frame = await this.getEntryAsset([...identities.values()][0]);
    if (!(frame instanceof SpriteFrame)) throw new Error(`导出资源不是SpriteFrame：${exportedPngPath}`);
    return frame;
  }

  loadPageResource<T = unknown>(path: string, type: unknown, callback: AssetCallback<T>): void {
    let settled = false;
    const finish = (error: Error | null, asset?: T): void => {
      if (settled) return;
      settled = true;
      callback(error, asset);
    };
    void Promise.resolve().then(() => {
      this.assertCurrent();
      return this.findPath(path, type);
    }).then(entry => this.acquireModule(entry.moduleId).then(async lease => {
      this.assertCurrent();
      const stableId = this.findDerivedId(entry);
      let asset: unknown;
      if (stableId) {
        const handle = await this.acquireDerived(entry.moduleId, stableId);
        asset = handle.frame;
        const key = this.pathKey(path, type);
        this.holdFrameHandle(key, handle);
        const releaseCount = this.pendingReleases.get(key) ?? 0;
        if (releaseCount > 0) {
          this.pendingReleases.set(key, releaseCount - 1);
          this.releaseOneFrameHandle(key);
        }
      } else {
        asset = lease.get(entry.assetId);
      }
      if (!this.isCurrent(this.owner) || this.disposed) throw new Error('页面资源加载已因切页而取消');
      finish(null, asset as T);
    })).catch(error => {
      if (settled) {
        console.error('[GalleryAssetSession] page resource callback threw', error);
        return;
      }
      finish(error instanceof Error ? error : new Error(String(error)));
    });
  }

  releasePageResource(path: string, type: unknown): void {
    if (this.disposed) return;
    const key = this.pathKey(path, type);
    if (this.releaseOneFrameHandle(key)) return;
    this.pendingReleases.set(key, (this.pendingReleases.get(key) ?? 0) + 1);
  }

  private releaseOneFrameHandle(key: string): boolean {
    const handles = this.frameHandles.get(key);
    if (handles?.length) {
      const handle = handles.pop()!;
      handle.release();
      if (!handles.length) this.frameHandles.delete(key);
      return true;
    }
    return false;
  }

  diagnostics(): { generation: number; moduleLeases: number; pendingRequests: number; heldDerivedFrames: number; disposed: boolean } {
    return {
      generation: (this.owner as ModuleOwner).generation,
      moduleLeases: this.moduleLeases.size,
      pendingRequests: this.pending.size,
      heldDerivedFrames: [...this.frameHandles.values()].reduce((sum, handles) => sum + handles.length, 0),
      disposed: this.disposed,
    };
  }

  /** Call only after page nodes and Gallery-held references have been cleared. */
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    const errors: unknown[] = [];
    for (const handles of this.frameHandles.values()) {
      for (const handle of handles) {
        try { handle.release(); } catch (error) { errors.push(error); }
      }
    }
    this.frameHandles.clear();
    this.pendingReleases.clear();
    this.derivedFrameMaps.clear();
    try { this.modules.cancelOwner(this.ownerToken()); } catch (error) { errors.push(error); }
    for (const pending of this.pending) {
      try { pending.cancel?.(); } catch (error) { errors.push(error); }
    }
    this.pending.clear();
    for (const lease of this.moduleLeases.values()) {
      try { lease.release(); } catch (error) { errors.push(error); }
    }
    this.moduleLeases.clear();
    for (const promise of this.derivedLeases.values()) {
      void promise.then(lease => {
        try { lease.release(); } catch (error) { this.reportCleanupError(error); }
      }, () => undefined);
    }
    this.derivedLeases.clear();
    if (errors.length) throw new Error(`页面资源清理失败：${errors.map(String).join('；')}`);
  }

  private async acquireModule(moduleId: string): Promise<ModuleLease> {
    this.assertCurrent();
    const ready = this.moduleLeases.get(moduleId);
    if (ready) return ready;
    const request = this.modules.acquire(moduleId, this.owner);
    this.pending.add(request);
    try {
      const lease = await request;
      if (this.disposed || !this.isCurrent(this.owner)) {
        lease.release();
        throw new Error(`页面资源加载已失效：${moduleId}`);
      }
      const existing = this.moduleLeases.get(moduleId);
      if (existing) { lease.release(); return existing; }
      this.moduleLeases.set(moduleId, lease);
      return lease;
    } finally {
      this.pending.delete(request);
    }
  }

  private async acquireDerived(moduleId: string, stableId: string): Promise<ResolvedDerivedFrame> {
    const definition = this.manifest[moduleId];
    if (!definition) throw new Error(`模块清单缺少模块：${moduleId}`);
    let promise = this.derivedLeases.get(definition.bundle);
    if (!promise) {
      promise = this.derived.acquireModule(definition.bundle, this.owner).then(lease => {
        if (this.disposed || !this.isCurrent(this.owner)) {
          lease.release();
          throw new Error(`派生模块租约已失效：${definition.bundle}`);
        }
        return lease;
      });
      this.derivedLeases.set(definition.bundle, promise);
    }
    const lease = await promise;
    this.assertCurrent();
    return lease.getFrame(stableId);
  }

  private async getEntryAsset(entry: PathEntry): Promise<unknown> {
    const derivedId = this.findDerivedId(entry);
    if (!derivedId) return this.get(entry.moduleId, entry.assetId);
    const handle = await this.acquireDerived(entry.moduleId, derivedId);
    this.holdFrameHandle(this.pathKey(entry.descriptor.path, entry.descriptor.type), handle);
    return handle.frame;
  }

  private holdFrameHandle(key: string, handle: ResolvedDerivedFrame): void {
    if (this.disposed || !this.isCurrent(this.owner)) {
      handle.release();
      throw new Error('派生帧句柄在页面失效后才完成');
    }
    const handles = this.frameHandles.get(key) ?? [];
    handles.push(handle); this.frameHandles.set(key, handles);
  }

  private reportCleanupError(error: unknown): void {
    // Disposal can race a still-loading derived bundle. Keep that cleanup failure
    // observable without creating an unhandled Promise rejection.
    console.error('[GalleryAssetSession] 派生资源迟到清理失败', error);
  }

  private findPath(path: string, type: unknown, preferredAssetId?: string): PathEntry {
    const matches: PathEntry[] = [];
    for (const [moduleId, definition] of Object.entries(this.manifest)) {
      for (const [assetId, descriptor] of Object.entries(definition.assets)) {
        if (descriptor.path === path && descriptor.type === type) matches.push({ moduleId, assetId, descriptor });
      }
    }
    const identities = new Map<string, PathEntry>();
    for (const match of matches) {
      const definition = this.manifest[match.moduleId];
      const key = `${definition.bundle}\u0000${match.descriptor.path}\u0000${this.typeKey(match.descriptor.type)}\u0000${match.descriptor.revision ?? ''}`;
      if (!identities.has(key)) identities.set(key, match);
    }
    if (identities.size !== 1) {
      const state = identities.size ? '跨Bundle或修订版本路径冲突' : '模块清单没有此准确资源路径';
      throw new Error(`${state}：${path}`);
    }
    return matches.find(item => item.assetId === preferredAssetId) ?? [...identities.values()][0];
  }

  private findDerivedId(entry: PathEntry): string | null {
    const definition = this.manifest[entry.moduleId];
    const match = this.derivedManifest.find(item => item.bundle === definition.bundle && item.sourceAssetId === entry.assetId
      && item.stableAssetId === entry.assetId);
    return match?.stableAssetId ?? null;
  }

  private pathKey(path: string, type: unknown): string {
    return `${path}\u0000${this.typeKey(type)}`;
  }
  private typeKey(type: unknown): string { return typeof type === 'string' ? type : (type as any)?.name ?? String(type); }
  private ownerToken(): string { return (this.owner as ModuleOwner).token; }
  private assertActive(): void { if (this.disposed) throw new Error('页面资源会话已释放'); }
  private assertCurrent(): void {
    this.assertActive();
    if (!this.isCurrent(this.owner)) throw new Error('页面资源会话已过期');
  }
}
