import { Point, Rect, ViewportSnapshot, VisibleSize } from './types';

const intersect = (a: Rect, b: Rect): Rect => {
  const x = Math.max(a.x, b.x), y = Math.max(a.y, b.y);
  const right = Math.min(a.x + a.width, b.x + b.width);
  const bottom = Math.min(a.y + a.height, b.y + b.height);
  return { x, y, width: Math.max(0, right - x), height: Math.max(0, bottom - y) };
};

export class ViewportMapper {
  static uiUnitsPerLogicalPixel(snapshot: ViewportSnapshot, visible: VisibleSize): number {
    const sx = visible.width / snapshot.content.width;
    const sy = visible.height / snapshot.content.height;
    // A scalar used for square hit targets must satisfy both projected axes.
    // Font/layout callers may prefer explicit per-axis conversion in a future API.
    return Number.isFinite(sx) && sx > 0 && Number.isFinite(sy) && sy > 0 ? Math.max(sx, sy) : 1;
  }
  static logicalPixelsToUI(value: number, snapshot: ViewportSnapshot, visible: VisibleSize): number {
    return value * this.uiUnitsPerLogicalPixel(snapshot, visible);
  }
  static mapWindowPointToUI(point: Point, content: Rect, visible: VisibleSize): Point | null {
    if (content.width <= 0 || content.height <= 0 || visible.width <= 0 || visible.height <= 0) return null;
    return { x: (point.x - content.x) / content.width * visible.width - visible.width / 2,
      y: visible.height / 2 - (point.y - content.y) / content.height * visible.height };
  }
  static mapWindowRectToUI(rect: Rect, content: Rect, visible: VisibleSize): Rect | null {
    const clipped = intersect(rect, content);
    if (clipped.width <= 0 || clipped.height <= 0) return null;
    const a = this.mapWindowPointToUI({ x: clipped.x, y: clipped.y }, content, visible);
    const b = this.mapWindowPointToUI({ x: clipped.x + clipped.width, y: clipped.y + clipped.height }, content, visible);
    if (!a || !b) return null;
    return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), width: Math.abs(b.x - a.x), height: Math.abs(b.y - a.y) };
  }
  static safeWindowRect(snapshot: ViewportSnapshot): Rect { return intersect(snapshot.safe, snapshot.content); }
  static safeWithCapsule(snapshot: ViewportSnapshot, gap = 8): Rect {
    const safe = this.safeWindowRect(snapshot), capsule = snapshot.capsule;
    if (!capsule || safe.width <= 0 || safe.height <= 0) return safe;
    const c = { x: capsule.x - gap, y: capsule.y - gap, width: capsule.width + 2 * gap, height: capsule.height + 2 * gap };
    if (!(c.x < safe.x + safe.width && c.x + c.width > safe.x && c.y < safe.y + safe.height && c.y + c.height > safe.y)) return safe;
    const cutTop = c.y + c.height / 2 <= safe.y + safe.height / 2;
    if (cutTop) {
      const y = Math.max(safe.y, c.y + c.height);
      return { x: safe.x, y, width: safe.width, height: Math.max(0, safe.y + safe.height - y) };
    }
    const bottom = Math.min(safe.y + safe.height, c.y);
    return { x: safe.x, y: safe.y, width: safe.width, height: Math.max(0, bottom - safe.y) };
  }
  static inset(rect: Rect, horizontal = 12, vertical = 8): Rect {
    return { x: rect.x + horizontal, y: rect.y + vertical,
      width: Math.max(0, rect.width - 2 * horizontal), height: Math.max(0, rect.height - 2 * vertical) };
  }
  static safeUiRect(snapshot: ViewportSnapshot, visible: VisibleSize): Rect | null {
    return this.mapWindowRectToUI(this.inset(this.safeWithCapsule(snapshot)), snapshot.content, visible);
  }
}
