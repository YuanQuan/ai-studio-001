import { EngineViewportMetrics, Rect, ViewportAdapter, ViewportSnapshot } from './types';

type Listener = (snapshot: ViewportSnapshot) => void;
type WindowLike = {
  innerWidth?: number; innerHeight?: number; devicePixelRatio?: number;
  addEventListener?: (name: string, fn: () => void) => void;
  removeEventListener?: (name: string, fn: () => void) => void;
  visualViewport?: { addEventListener?: (name: string, fn: () => void) => void;
    removeEventListener?: (name: string, fn: () => void) => void };
  requestAnimationFrame?: (fn: () => void) => number;
  cancelAnimationFrame?: (id: number) => void;
};

const validRect = (r: any): r is Rect => !!r && Number.isFinite(r.x) && Number.isFinite(r.y) &&
  Number.isFinite(r.width) && Number.isFinite(r.height) && r.width >= 0 && r.height >= 0;
const clampRect = (r: Rect, width: number, height: number): Rect => {
  const x = Math.max(0, Math.min(width, r.x)), y = Math.max(0, Math.min(height, r.y));
  const right = Math.max(x, Math.min(width, r.x + r.width));
  const bottom = Math.max(y, Math.min(height, r.y + r.height));
  return { x, y, width: right - x, height: bottom - y };
};
type SnapshotComparable = Omit<ViewportSnapshot, 'revision'>;
const sameSnapshot = (a: SnapshotComparable, b: SnapshotComparable): boolean =>
  a.width === b.width && a.height === b.height && a.dpr === b.dpr && a.orientation === b.orientation &&
  JSON.stringify(a.safe) === JSON.stringify(b.safe) && JSON.stringify(a.capsule) === JSON.stringify(b.capsule) &&
  JSON.stringify(a.content) === JSON.stringify(b.content) && a.diagnostics.join('|') === b.diagnostics.join('|');

abstract class BaseViewportAdapter implements ViewportAdapter {
  protected revision = 0;
  protected latest: ViewportSnapshot = { revision: 0, width: 1, height: 1, dpr: 1,
    safe: { x: 0, y: 0, width: 1, height: 1 }, capsule: null, orientation: 'portrait',
    content: { x: 0, y: 0, width: 1, height: 1 }, diagnostics: ['尚未读取平台视窗'] };
  protected listeners = new Set<Listener>();
  protected stopped = false;
  private queued = false;
  private frameId: number | ReturnType<typeof setTimeout> | null = null;
  private notifiedRevision = 0;

  read(): ViewportSnapshot { return this.refresh(false); }
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.read());
    return () => this.listeners.delete(listener);
  }
  protected scheduleRefresh(): void {
    if (this.stopped || this.queued) return;
    this.queued = true;
    const w = (globalThis as any).window as WindowLike | undefined;
    const run = (): void => { this.queued = false; this.frameId = null; this.refresh(true); };
    if (w?.requestAnimationFrame) this.frameId = w.requestAnimationFrame(run);
    else this.frameId = setTimeout(run, 0);
  }
  protected refresh(notify: boolean): ViewportSnapshot {
    let next: Omit<ViewportSnapshot, 'revision'>;
    try { next = this.readPlatform(); }
    catch { next = { ...this.latest, diagnostics: this.withDiagnostic(this.latest.diagnostics, '平台视窗读取异常，保留最近有效值') }; }
    if (next.width <= 0 || next.height <= 0 || next.content.width <= 0 || next.content.height <= 0) {
      next = { ...this.latest };
    }
    if (!sameSnapshot(this.latest, next)) this.latest = { ...next, revision: ++this.revision };
    if (notify && this.latest.revision > this.notifiedRevision) {
      this.notifiedRevision = this.latest.revision;
      this.listeners.forEach(listener => listener(this.latest));
    }
    return this.latest;
  }
  private withDiagnostic(current: string[], item: string): string[] {
    return current.includes(item) ? current : [...current, item];
  }
  protected abstract readPlatform(): Omit<ViewportSnapshot, 'revision'>;
  dispose(): void {
    this.stopped = true;
    const w = (globalThis as any).window as WindowLike | undefined;
    if (typeof this.frameId === 'number' && w?.cancelAnimationFrame) w.cancelAnimationFrame(this.frameId);
    else if (this.frameId !== null) clearTimeout(this.frameId as ReturnType<typeof setTimeout>);
    this.frameId = null;
    this.listeners.clear();
  }
}

export class WebViewportAdapter extends BaseViewportAdapter {
  private safeProbe: HTMLElement | null = null;
  constructor(private readonly readEngineMetrics: () => EngineViewportMetrics | null) {
    super();
    const w = (globalThis as any).window as WindowLike | undefined;
    w?.addEventListener?.('resize', this.onResize);
    w?.visualViewport?.addEventListener?.('resize', this.onResize);
    (globalThis as any).screen?.orientation?.addEventListener?.('change', this.onResize);
    this.refresh(false);
  }
  private onResize = (): void => this.scheduleRefresh();

  private readSafeInsets(): { top: number; right: number; bottom: number; left: number } {
    const doc = (globalThis as any).document as Document | undefined;
    if (!doc?.documentElement) return { top: 0, right: 0, bottom: 0, left: 0 };
    if (!this.safeProbe) {
      this.safeProbe = doc.createElement('div');
      this.safeProbe.setAttribute('aria-hidden', 'true');
      this.safeProbe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;contain:strict;z-index:-1;padding-top:env(safe-area-inset-top);padding-right:env(safe-area-inset-right);padding-bottom:env(safe-area-inset-bottom);padding-left:env(safe-area-inset-left);';
      doc.documentElement.appendChild(this.safeProbe);
    }
    const style = (globalThis as any).getComputedStyle?.(this.safeProbe);
    const value = (name: string): number => Math.max(0, parseFloat(style?.[name] || '0') || 0);
    return { top: value('paddingTop'), right: value('paddingRight'),
      bottom: value('paddingBottom'), left: value('paddingLeft') };
  }

  protected readPlatform(): Omit<ViewportSnapshot, 'revision'> {
    const w = (globalThis as any).window as WindowLike | undefined;
    const doc = (globalThis as any).document as Document | undefined;
    const cssWidth = Math.max(0, Number(w?.innerWidth) || 0);
    const cssHeight = Math.max(0, Number(w?.innerHeight) || 0);
    const diagnostics: string[] = [];
    const insets = this.readSafeInsets();
    const safe = clampRect({ x: insets.left, y: insets.top,
      width: cssWidth - insets.left - insets.right, height: cssHeight - insets.top - insets.bottom }, cssWidth, cssHeight);
    let content: Rect = { x: 0, y: 0, width: cssWidth, height: cssHeight };
    try {
      const metrics = this.readEngineMetrics();
      const canvas = doc?.querySelector('canvas') as HTMLCanvasElement | null;
      const box = canvas?.getBoundingClientRect();
      if (metrics && box && box.width > 0 && box.height > 0 && metrics.backbufferWidth > 0 && metrics.backbufferHeight > 0 &&
          metrics.viewportRect.width > 0 && metrics.viewportRect.height > 0) {
        const scaleX = metrics.backbufferWidth / box.width;
        const scaleY = metrics.backbufferHeight / box.height;
        content = {
          x: box.left + metrics.viewportRect.x / scaleX,
          y: box.top + (metrics.backbufferHeight - metrics.viewportRect.y - metrics.viewportRect.height) / scaleY,
          width: metrics.viewportRect.width / scaleX,
          height: metrics.viewportRect.height / scaleY,
        };
      } else diagnostics.push('Web Canvas 内容矩形不可读，暂用窗口范围');
    } catch { diagnostics.push('Web Canvas 内容矩形读取失败，暂用窗口范围'); }
    // Keep the full projected content rectangle as the mapping basis. Clipping it
    // to the window here would rescale the visible slice as though it were the
    // complete Cocos viewport when a Canvas is partially offscreen.
    if (safe.width === 0 || safe.height === 0) diagnostics.push('Web safe-area 数据无效，回退窗口范围');
    const effectiveSafe = safe.width > 0 && safe.height > 0 ? safe : { x: 0, y: 0, width: cssWidth, height: cssHeight };
    return { width: cssWidth, height: cssHeight,
      dpr: Math.max(1, Number(w?.devicePixelRatio) || 1), safe: effectiveSafe,
      capsule: null, orientation: cssWidth > cssHeight ? 'landscape' : 'portrait', content,
      diagnostics };
  }

  dispose(): void {
    const w = (globalThis as any).window as WindowLike | undefined;
    w?.removeEventListener?.('resize', this.onResize);
    w?.visualViewport?.removeEventListener?.('resize', this.onResize);
    (globalThis as any).screen?.orientation?.removeEventListener?.('change', this.onResize);
    this.safeProbe?.parentNode?.removeChild(this.safeProbe);
    this.safeProbe = null;
    super.dispose();
  }
}

type MiniProgramInfo = {
  windowWidth?: number; windowHeight?: number; pixelRatio?: number;
  windowLeft?: number; windowTop?: number; screenLeft?: number; screenTop?: number;
  screenWidth?: number; screenHeight?: number; safeArea?: any; deviceOrientation?: string;
};
type MiniProgramApi = {
  getWindowInfo?: () => MiniProgramInfo; getSystemInfoSync?: () => MiniProgramInfo;
  getMenuButtonBoundingClientRect?: () => any;
  onWindowResize?: (fn: (event: any) => void) => void; offWindowResize?: (fn: (event: any) => void) => void;
};

abstract class MiniProgramViewportAdapter extends BaseViewportAdapter {
  private api: MiniProgramApi;
  private registrationDiagnostics: string[] = [];
  constructor(api: MiniProgramApi, private readonly flavor: 'wechat' | 'douyin') {
    super(); this.api = api;
    try { this.api.onWindowResize?.(this.onResize); }
    catch { this.registrationDiagnostics.push('平台窗口变化监听注册失败'); }
    this.refresh(false);
  }
  private onResize = (): void => this.scheduleRefresh();
  protected readPlatform(): Omit<ViewportSnapshot, 'revision'> {
    const diagnostics = [...this.registrationDiagnostics];
    let info: MiniProgramInfo = {};
    if (this.flavor === 'wechat') {
      try {
        info = this.api.getWindowInfo?.() ?? {};
        if (!(Number(info.windowWidth) > 0 && Number(info.windowHeight) > 0)) {
          diagnostics.push('微信窗口信息不可用，尝试系统信息回退');
          try { info = this.api.getSystemInfoSync?.() ?? info; }
          catch { diagnostics.push('微信系统信息回退失败'); }
        }
      } catch {
        diagnostics.push('微信窗口信息读取失败，尝试系统信息回退');
        try { info = this.api.getSystemInfoSync?.() ?? {}; }
        catch { diagnostics.push('微信系统信息回退失败'); }
      }
    } else {
      try { info = this.api.getSystemInfoSync?.() ?? {}; }
      catch { diagnostics.push('抖音系统信息读取失败'); }
    }
    const width = Math.max(0, Number(info.windowWidth) || 0);
    const height = Math.max(0, Number(info.windowHeight) || 0);
    const orientation = width > height ? 'landscape' : 'portrait';
    let safe: Rect = { x: 0, y: 0, width, height };
    const rawSafe = info.safeArea;
    if (rawSafe && Number.isFinite(rawSafe.left) && Number.isFinite(rawSafe.top)) {
      const originX = Number(info.windowLeft ?? info.screenLeft ?? 0);
      const originY = Number(info.windowTop ?? info.screenTop ?? 0);
      const candidate = { x: rawSafe.left - originX, y: rawSafe.top - originY,
        width: Number(rawSafe.width ?? rawSafe.right - rawSafe.left),
        height: Number(rawSafe.height ?? rawSafe.bottom - rawSafe.top) };
      const landscapeAmbiguous = this.flavor === 'douyin' && orientation === 'landscape';
      if (!landscapeAmbiguous && validRect(candidate) && candidate.width > 0 && candidate.height > 0 &&
          candidate.x + candidate.width <= width + 1 && candidate.y + candidate.height <= height + 1) safe = clampRect(candidate, width, height);
      else diagnostics.push('平台安全区坐标或旋转方向无法确认，按窗口回退');
    } else diagnostics.push('平台未提供安全区，按窗口回退');

    let capsule: Rect | null = null;
    try {
      const raw = this.api.getMenuButtonBoundingClientRect?.();
      if (raw && Number.isFinite(raw.left ?? raw.x) && Number.isFinite(raw.top ?? raw.y)) {
        const originX = Number(info.windowLeft ?? info.screenLeft ?? 0);
        const originY = Number(info.windowTop ?? info.screenTop ?? 0);
        const candidate = { x: Number(raw.left ?? raw.x) - originX, y: Number(raw.top ?? raw.y) - originY,
          width: Number(raw.width ?? raw.right - raw.left), height: Number(raw.height ?? raw.bottom - raw.top) };
        if (validRect(candidate) && candidate.width > 0 && candidate.height > 0 && candidate.x >= 0 && candidate.y >= 0 &&
            candidate.x + candidate.width <= width + 1 && candidate.y + candidate.height <= height + 1) capsule = candidate;
        else diagnostics.push('胶囊坐标不在当前窗口逻辑坐标域，忽略胶囊');
      }
    } catch { diagnostics.push('平台胶囊接口不可用'); }
    if (!capsule) diagnostics.push('平台胶囊不可用或坐标未知');
    return { width, height, dpr: Math.max(1, Number(info.pixelRatio) || 1), safe, capsule,
      orientation, content: { x: 0, y: 0, width, height }, diagnostics };
  }
  dispose(): void { try { this.api.offWindowResize?.(this.onResize); } catch { /* Optional platform listener may be unavailable. */ } super.dispose(); }
}

export class WeChatViewportAdapter extends MiniProgramViewportAdapter {
  constructor(api?: MiniProgramApi) {
    super(api ?? ((globalThis as any).wx as MiniProgramApi) ?? {}, 'wechat');
  }
}
export class DouyinViewportAdapter extends MiniProgramViewportAdapter {
  constructor(api?: MiniProgramApi) {
    super(api ?? ((globalThis as any).tt as MiniProgramApi) ?? {}, 'douyin');
  }
}
