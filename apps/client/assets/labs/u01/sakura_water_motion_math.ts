export interface WaterEntry {
  instanceId: string;
  assetId: string;
  left: number;
  top: number;
}

export interface WaterGroupDefinition {
  memberIds: string[];
  direction: 1 | -1;
}

/** Infer complete river trios; elevated flames remain static despite legacy motion labels. */
export function deriveWaterGroups(entries: readonly WaterEntry[]): WaterGroupDefinition[] {
  const used = new Set<string>();
  const flames = entries.filter(entry => entry.assetId.includes('_flame') && entry.top >= 700)
    .sort((a, b) => a.left - b.left || a.top - b.top);
  const groups: WaterGroupDefinition[] = [];
  for (const flame of flames) {
    if (used.has(flame.instanceId)) continue;
    const side = flame.assetId.match(/spirit_([ab])_flame/)?.[1];
    if (!side) continue;
    const pair = entries.filter(entry => !used.has(entry.instanceId)
      && Math.abs(entry.left - flame.left) < 0.01 && Math.abs(entry.top - flame.top) < 0.01);
    const lotus = pair.find(entry => entry.assetId.includes(`spirit_${side}_lotus`));
    const reflection = pair.find(entry => entry.assetId.includes(`spirit_${side}_reflection`));
    if (!lotus || !reflection) continue;
    used.add(flame.instanceId); used.add(lotus.instanceId); used.add(reflection.instanceId);
    groups.push({ memberIds: [reflection.instanceId, lotus.instanceId, flame.instanceId], direction: groups.length % 2 === 0 ? 1 : -1 });
  }
  return groups;
}

/** One shared signed offset is applied to every part of a trio. */
export function sampleWaterGroupCenter(baseLeft: number, groupWidth: number, direction: 1 | -1,
  elapsedSeconds: number, canvasWidth = 3072): number {
  const period = canvasWidth + groupWidth;
  const start = baseLeft + canvasWidth / 2 + groupWidth;
  const wrappedLeft = ((start + direction * elapsedSeconds * 24) % period + period) % period - groupWidth;
  return wrappedLeft + groupWidth / 2 - canvasWidth / 2;
}

/** Keep edited baseline coordinates when restarting preview time after a user edit. */
export function recaptureWaterGroupPositions(currentX: readonly number[], changedIndex: number,
  lastAppliedOffset: number): number[] {
  return currentX.map((x, index) => index === changedIndex ? x : x - lastAppliedOffset);
}
