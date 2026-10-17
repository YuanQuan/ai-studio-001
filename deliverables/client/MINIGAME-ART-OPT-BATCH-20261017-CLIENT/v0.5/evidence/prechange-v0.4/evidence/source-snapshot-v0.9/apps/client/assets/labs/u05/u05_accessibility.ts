export type U05Rect = { x: number; y: number; width: number; height: number };
export type U05HitTarget = { group: string; rect: U05Rect };

export function hitBox(widthCss: number, heightCss: number, minimumCss = 48): U05Rect {
  return { x: 0, y: 0, width: Math.max(widthCss, minimumCss), height: Math.max(heightCss, minimumCss) };
}

export function minimumFontLocal(sizeLocal: number, cssScale: number, minimumCss: number): number {
  return Math.max(sizeLocal, cssScale > 0 ? minimumCss / cssScale : sizeLocal);
}

export function minimumFontLocalAxes(sizeLocal: number, cssScaleX: number, cssScaleY: number, minimumCss: number): number {
  return Math.max(sizeLocal,
    cssScaleX > 0 ? minimumCss / cssScaleX : sizeLocal,
    cssScaleY > 0 ? minimumCss / cssScaleY : sizeLocal);
}

export function minimumHitLocalAxes(widthLocal: number, heightLocal: number, cssScaleX: number, cssScaleY: number,
  minimumCss = 48): { width: number; height: number } {
  return {
    width: Math.max(widthLocal, cssScaleX > 0 ? minimumCss / cssScaleX : widthLocal),
    height: Math.max(heightLocal, cssScaleY > 0 ? minimumCss / cssScaleY : heightLocal),
  };
}

export function resolveHitCandidates<T>(modalActive: boolean, all: Iterable<T>, modalOnly: Iterable<T>): Iterable<T> {
  return modalActive ? modalOnly : all;
}

export function hasHitConflict(targets: U05HitTarget[], minimumGapCss = 8): boolean {
  for (let i = 0; i < targets.length; i++) for (let j = i + 1; j < targets.length; j++) {
    const a = targets[i].rect, b = targets[j].rect;
    const gapX = Math.max(0, Math.max(a.x - (b.x + b.width), b.x - (a.x + a.width)));
    const gapY = Math.max(0, Math.max(a.y - (b.y + b.height), b.y - (a.y + a.height)));
    if (gapX < minimumGapCss && gapY < minimumGapCss) return true;
  }
  return false;
}

export function conflictingHitGroups(targets: U05HitTarget[], minimumGapCss = 8): string[] {
  const groups = new Set<string>();
  for (let i = 0; i < targets.length; i++) for (let j = i + 1; j < targets.length; j++) {
    const a = targets[i], b = targets[j];
    const gapX = Math.max(0, Math.max(a.rect.x - (b.rect.x + b.rect.width), b.rect.x - (a.rect.x + a.rect.width)));
    const gapY = Math.max(0, Math.max(a.rect.y - (b.rect.y + b.rect.height), b.rect.y - (a.rect.y + a.rect.height)));
    if (gapX < minimumGapCss && gapY < minimumGapCss) { groups.add(a.group); groups.add(b.group); }
  }
  return [...groups];
}

export function needsProxy(targets: U05HitTarget[], minimumGapCss = 8): boolean {
  return hasHitConflict(targets, minimumGapCss);
}

export function clampScrollOffset(offset: number, rowCount: number, visibleRows: number): number {
  return Math.max(0, Math.min(Math.max(0, rowCount - visibleRows), Math.floor(offset)));
}


export function containInSafe(safe: U05Rect, artWidth: number, artHeight: number): { scale: number; centerX: number; centerY: number } {
  const scale = safe.width > 0 && safe.height > 0
    ? Math.min(safe.width / artWidth, safe.height / artHeight) : 0;
  return { scale, centerX: safe.x + safe.width / 2, centerY: safe.y + safe.height / 2 };
}

export function wrapTextByCodepoint(value: string, maxCharacters: number): string[] {
  const limit = Math.max(1, Math.floor(maxCharacters)); const lines: string[] = [];
  for (const paragraph of value.split('\n')) {
    const characters = Array.from(paragraph);
    if (!characters.length) { lines.push(''); continue; }
    for (let index = 0; index < characters.length; index += limit) lines.push(characters.slice(index, index + limit).join(''));
  }
  return lines;
}

export function layoutAccessibleText(value: string, widthLocal: number, heightLocal: number, sizeLocal: number,
  cssScaleX: number, cssScaleY: number, minimumCss: number): { text: string; fontSize: number; lineHeight: number; height: number; lines: number } {
  const fontSize = minimumFontLocalAxes(sizeLocal, cssScaleX, cssScaleY, minimumCss);
  const lineHeight = fontSize + 5;
  const capacity = Math.max(1, Math.floor(widthLocal / Math.max(fontSize, .001)));
  const wrapped = wrapTextByCodepoint(value, capacity);
  return { text: wrapped.join('\n'), fontSize, lineHeight,
    height: Math.max(heightLocal, lineHeight * wrapped.length), lines: wrapped.length };
}
