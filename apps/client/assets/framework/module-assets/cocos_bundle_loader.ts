import { assetManager } from 'cc';
import { ModuleAssetLoader } from './module_assets';

export class CocosBundleLoader implements ModuleAssetLoader {
  private bundles = new Map<string, any>();
  private pending = new Map<string, Promise<any>>();
  // Each successful load owns one explicit Asset.addRef(). A queue per exact
  // bundle/path/type identity allows release() to decrement only retained
  // instances, including concurrent loads of the same descriptor.
  private retained = new Map<string, Map<unknown, any[]>>();

  private pathKey(bundle: string, path: string): string { return `${bundle}\u0000${path}`; }

  private getBundle(name: string): Promise<any> {
    const cached = this.bundles.get(name) ?? assetManager.getBundle(name);
    if (cached) { this.bundles.set(name, cached); return Promise.resolve(cached); }
    const existing = this.pending.get(name);
    if (existing) return existing;
    const request = new Promise<any>((resolve, reject) => {
      assetManager.loadBundle(name, (error: Error | null, bundle: any) => {
        if (error || !bundle) { reject(error ?? new Error(`资源包不可用：${name}`)); return; }
        this.bundles.set(name, bundle); resolve(bundle);
      });
    }).finally(() => this.pending.delete(name));
    this.pending.set(name, request);
    return request;
  }

  async load(bundleName: string, path: string, type: unknown): Promise<unknown> {
    const bundle = await this.getBundle(bundleName);
    return new Promise((resolve, reject) => {
      bundle.load(path, type, (error: Error | null, asset: any) => {
        if (error || !asset) reject(error ?? new Error(`资源为空：${bundleName}/${path}`));
        else {
          if (typeof asset.addRef !== 'function' || typeof asset.decRef !== 'function') {
            reject(new Error(`Cocos资源不支持可验证的addRef/decRef，拒绝建立不安全租约：${bundleName}/${path}`));
            return;
          }
          try {
            asset.addRef();
            const key = this.pathKey(bundleName, path);
            let byType = this.retained.get(key);
            if (!byType) { byType = new Map(); this.retained.set(key, byType); }
            let instances = byType.get(type);
            if (!instances) { instances = []; byType.set(type, instances); }
            instances.push(asset);
            resolve(asset);
          } catch (retainError) { reject(retainError); }
        }
      });
    });
  }

  release(bundleName: string, path: string, type: unknown): void {
    const key = this.pathKey(bundleName, path);
    const byType = this.retained.get(key);
    const instances = byType?.get(type);
    if (!instances?.length) throw new Error(`没有此路径/类型对应的已取得资源引用：${bundleName}/${path}`);
    const asset = instances.shift();
    if (!asset || typeof asset.decRef !== 'function') throw new Error(`已取得资源缺少decRef：${bundleName}/${path}`);
    // Non-forced decRef keeps dependency refs valid while another page or
    // serialized Prefab still holds the Texture/SpriteFrame dependency graph.
    asset.decRef();
    if (instances.length === 0) byType!.delete(type);
    if (byType!.size === 0) this.retained.delete(key);
  }
}
