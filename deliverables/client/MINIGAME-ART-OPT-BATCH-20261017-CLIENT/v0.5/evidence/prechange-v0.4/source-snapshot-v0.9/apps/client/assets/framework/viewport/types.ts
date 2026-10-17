export type Rect = { x: number; y: number; width: number; height: number };
export type Point = { x: number; y: number };
export type ViewportSnapshot = {
  revision: number;
  width: number;
  height: number;
  dpr: number;
  safe: Rect;
  capsule: Rect | null;
  orientation: 'portrait' | 'landscape';
  content: Rect;
  diagnostics: string[];
};

export interface ViewportAdapter {
  read(): ViewportSnapshot;
  subscribe(listener: (snapshot: ViewportSnapshot) => void): () => void;
  dispose(): void;
}

export type VisibleSize = { width: number; height: number };
export type EngineViewportMetrics = {
  visibleSize: VisibleSize;
  canvasRect: Rect;
  viewportRect: Rect;
  backbufferWidth: number;
  backbufferHeight: number;
};
