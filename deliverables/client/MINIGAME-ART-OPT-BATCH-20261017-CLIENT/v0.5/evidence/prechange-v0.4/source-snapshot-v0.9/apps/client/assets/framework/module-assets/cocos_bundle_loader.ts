import { assetManager } from 'cc';
import { ModuleAssetLoader } from './module_assets';

export class CocosBundleLoader implements ModuleAssetLoader {
  private bundles = new Map<string, any>();
  private pending = new Map<string, Promise<any>>();

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
      bundle.load(path, type, (error: Error | null, asset: unknown) => {
        if (error || !asset) reject(error ?? new Error(`资源为空：${bundleName}/${path}`));
        else resolve(asset);
      });
    });
  }

  release(bundleName: string, path: string, type: unknown): void {
    const bundle = this.bundles.get(bundleName) ?? assetManager.getBundle(bundleName);
    if (!bundle) throw new Error(`释放资源时找不到资源包：${bundleName}`);
    bundle.release(path, type);
  }
}
