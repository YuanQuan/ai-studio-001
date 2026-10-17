export type ResourceDescriptor = { path: string; type: unknown; revision?: string };
export type ModuleDefinition = {
  bundle: string;
  dependencies?: string[];
  assets: Record<string, ResourceDescriptor>;
};
export type ModuleManifest = Record<string, ModuleDefinition>;
export type ModuleOwner = { token: string; generation: number };
export type OwnerGeneration = number | ModuleOwner;

export interface ModuleAssetLoader {
  load(bundle: string, path: string, type: unknown): Promise<unknown>;
  release(bundle: string, path: string, type: unknown): void;
}
export interface ModuleLease {
  readonly owner: ModuleOwner;
  get<T = unknown>(assetId: string): T;
  release(): void;
}
export interface CancellableAcquire extends Promise<ModuleLease> { cancel(): void; }

type Entry = {
  key: string; bundle: string; path: string; type: unknown;
  refs: number; state: 'loading' | 'ready' | 'failed' | 'released';
  asset?: unknown; promise: Promise<unknown>;
};
type Held = { entry: Entry; released: boolean };
type Operation = {
  owner: ModuleOwner; cancelled: boolean; finished: boolean; held: Held[]; heldKeys: Set<string>;
  cancelWait?: () => void;
};

/** Cancellation marker that remains an Error without native Error subclass syntax.
 * Creator's web Babel helper for `class X extends Error` is unavailable in its
 * bundled runtime; link the prototype explicitly while retaining both instanceof checks.
 */
export class ModuleAcquireCancelledError {
  readonly name = 'ModuleAcquireCancelledError';
  readonly message = '模块资源请求已取消';
  readonly stack?: string;
  constructor() { this.stack = new Error(this.message).stack; }
}
Object.setPrototypeOf(ModuleAcquireCancelledError.prototype, Error.prototype);

const stableKey = (bundle: string, path: string, type: unknown, revision = ''): string =>
  `${bundle}\u0000${path}\u0000${typeof type === 'string' ? type : (type as any)?.name ?? String(type)}\u0000${revision}`;

export class ModuleAssets {
  private entries = new Map<string, Entry>();
  private operations = new Map<string, Set<Operation>>();
  private nextOwner = 1;

  constructor(private readonly manifest: ModuleManifest, private readonly loader: ModuleAssetLoader) {
    ModuleAssets.validateManifest(manifest);
  }

  static validateManifest(manifest: ModuleManifest): void {
    const visiting = new Set<string>(), visited = new Set<string>();
    const walk = (id: string, chain: string[]): void => {
      const def = manifest[id];
      if (!def) throw new Error(`模块清单缺少依赖：${id}`);
      if (visiting.has(id)) throw new Error(`模块依赖循环：${[...chain, id].join(' -> ')}`);
      if (visited.has(id)) return;
      visiting.add(id);
      for (const dependency of def.dependencies ?? []) walk(dependency, [...chain, id]);
      const ids = new Set<string>();
      for (const [assetId, resource] of Object.entries(def.assets ?? {})) {
        if (!assetId || !resource?.path || resource.type == null) throw new Error(`模块 ${id} 存在无效资源描述`);
        const key = stableKey(def.bundle, resource.path, resource.type, resource.revision);
        if (ids.has(key)) continue;
        ids.add(key);
      }
      visiting.delete(id); visited.add(id);
    };
    Object.keys(manifest).forEach(id => walk(id, []));
  }

  acquire(moduleId: string, ownerGeneration: OwnerGeneration): CancellableAcquire {
    const owner = typeof ownerGeneration === 'number'
      ? { token: `module-owner-${this.nextOwner++}`, generation: ownerGeneration }
      : { token: ownerGeneration.token, generation: ownerGeneration.generation };
    if (!owner.token || !Number.isFinite(owner.generation)) throw new Error('资源Owner必须具有唯一token和有效generation');
    const operation: Operation = { owner, cancelled: false, finished: false, held: [], heldKeys: new Set() };
    const owners = this.operations.get(owner.token) ?? new Set<Operation>();
    owners.add(operation); this.operations.set(owner.token, owners);

    let resolveResult!: (lease: ModuleLease) => void;
    let rejectResult!: (error: unknown) => void;
    const promise = new Promise<ModuleLease>((resolve, reject) => { resolveResult = resolve; rejectResult = reject; }) as CancellableAcquire;
    promise.cancel = () => this.cancelOperation(operation);
    operation.cancelWait = () => rejectResult(new ModuleAcquireCancelledError());

    void this.loadModule(moduleId, operation, []).then(assetMap => {
      if (operation.cancelled) throw new ModuleAcquireCancelledError();
      operation.finished = true;
      const lease: ModuleLease = {
        owner,
        get: <T = unknown>(assetId: string): T => {
          if (released || operation.cancelled) throw new Error(`租约已释放：${owner.token}`);
          if (!assetMap.has(assetId)) throw new Error(`模块 ${moduleId} 未声明资源：${assetId}`);
          return assetMap.get(assetId) as T;
        },
        release: () => this.cancelOperation(operation),
      };
      let released = false;
      const originalCancel = lease.release.bind(lease);
      lease.release = () => { if (released) return; released = true; originalCancel(); };
      resolveResult(lease);
    }).catch(error => {
      let rejection = error;
      try { this.releaseOperation(operation); }
      catch (cleanupError) { rejection = new Error(`${String(error)}；请求失败后清理也失败：${String(cleanupError)}`); }
      finally { rejectResult(rejection); }
    });
    return promise;
  }

  cancelOwner(ownerToken: string): void {
    const operations = this.operations.get(ownerToken);
    if (!operations) return;
    const errors: unknown[] = [];
    for (const operation of [...operations]) {
      try { this.cancelOperation(operation); } catch (error) { errors.push(error); }
    }
    if (errors.length) throw new Error(`取消Owner时有 ${errors.length} 项清理失败：${errors.map(error => String(error)).join('；')}`);
  }

  getRefCount(bundle: string, path: string, type: unknown, revision = ''): number {
    return this.entries.get(stableKey(bundle, path, type, revision))?.refs ?? 0;
  }
  getInFlightCount(): number { return [...this.entries.values()].filter(entry => entry.state === 'loading').length; }

  private async loadModule(moduleId: string, operation: Operation, chain: string[]): Promise<Map<string, unknown>> {
    if (operation.cancelled) throw new ModuleAcquireCancelledError();
    if (chain.includes(moduleId)) throw new Error(`模块依赖循环：${[...chain, moduleId].join(' -> ')}`);
    const definition = this.manifest[moduleId];
    if (!definition) throw new Error(`模块清单缺少模块：${moduleId}`);
    const nextChain = [...chain, moduleId];
    for (const dependency of definition.dependencies ?? []) {
      await this.loadModule(dependency, operation, nextChain);
      if (operation.cancelled) throw new ModuleAcquireCancelledError();
    }
    const result = new Map<string, unknown>();
    const byKey = new Map<string, Promise<unknown>>();
    for (const [assetId, resource] of Object.entries(definition.assets)) {
      const key = stableKey(definition.bundle, resource.path, resource.type, resource.revision);
      let pending = byKey.get(key);
      if (!pending) {
        pending = this.retain(operation, key, definition.bundle, resource);
        byKey.set(key, pending);
      }
      result.set(assetId, await pending);
      if (operation.cancelled) throw new ModuleAcquireCancelledError();
    }
    return result;
  }

  private retain(operation: Operation, key: string, bundle: string, resource: ResourceDescriptor): Promise<unknown> {
    if (operation.cancelled) throw new ModuleAcquireCancelledError();
    const alreadyHeld = operation.held.find(item => !item.released && item.entry.key === key);
    if (alreadyHeld) return alreadyHeld.entry.promise;
    let entry = this.entries.get(key);
    if (!entry || entry.state === 'failed' || entry.state === 'released') {
      const created: Entry = { key, bundle, path: resource.path, type: resource.type,
        refs: 0, state: 'loading', promise: Promise.resolve(undefined) };
      created.promise = Promise.resolve().then(() => this.loader.load(bundle, resource.path, resource.type)).then(asset => {
        if (asset == null) throw new Error(`资源加载结果为空：${bundle}/${resource.path}`);
        created.asset = asset; created.state = 'ready';
        if (created.refs === 0) this.disposeEntry(created);
        return asset;
      }).catch(error => {
        created.state = 'failed';
        if (this.entries.get(key) === created) this.entries.delete(key);
        throw error;
      });
      entry = created; this.entries.set(key, entry);
    }
    entry.refs++;
    operation.heldKeys.add(key); operation.held.push({ entry, released: false });
    return entry.promise;
  }

  private cancelOperation(operation: Operation): void {
    if (operation.cancelled) return;
    operation.cancelled = true;
    operation.cancelWait?.();
    this.releaseOperation(operation);
  }

  private releaseOperation(operation: Operation): void {
    const releaseErrors: unknown[] = [];
    for (let i = operation.held.length - 1; i >= 0; i--) {
      const held = operation.held[i];
      if (held.released) continue;
      held.released = true;
      held.entry.refs = Math.max(0, held.entry.refs - 1);
      if (held.entry.refs === 0 && held.entry.state === 'ready') {
        try { this.disposeEntry(held.entry); } catch (error) { releaseErrors.push(error); }
      }
      else if (held.entry.refs === 0 && held.entry.state === 'failed' && this.entries.get(held.entry.key) === held.entry) this.entries.delete(held.entry.key);
    }
    operation.held.length = 0;
    const owners = this.operations.get(operation.owner.token);
    owners?.delete(operation);
    if (owners?.size === 0) this.operations.delete(operation.owner.token);
    if (releaseErrors.length) throw new Error(`释放模块资源时有 ${releaseErrors.length} 项失败：${releaseErrors.map(error => String(error)).join('；')}`);
  }

  private disposeEntry(entry: Entry): void {
    if (entry.state === 'released' || entry.refs > 0 || entry.state !== 'ready') return;
    entry.state = 'released';
    try { this.loader.release(entry.bundle, entry.path, entry.type); }
    finally { if (this.entries.get(entry.key) === entry) this.entries.delete(entry.key); }
  }
}
