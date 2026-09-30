// One-time cleanup after the Creator-imported TiledMap has been verified.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const project = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const scenePath = join(project, 'assets', 'DemoScene.scene');
const scene = JSON.parse(readFileSync(scenePath, 'utf8'));
const fallback = scene.findIndex((value) => value?.__type__ === 'cc.Node' && value._name === 'DraftSpriteFallback_Disabled');
if (fallback < 0) throw new Error('Disabled ground fallback is already absent.');
const parent = scene[fallback]._parent.__id__;
scene[parent]._children = scene[parent]._children.filter((child) => child.__id__ !== fallback);

const reachable = new Set();
function refs(value, callback) {
  if (!value || typeof value !== 'object') return;
  if ('__id__' in value) { callback(value.__id__); return; }
  for (const nested of Object.values(value)) refs(nested, callback);
}
function visit(index) {
  if (reachable.has(index)) return;
  if (!scene[index]) throw new Error(`Dangling reference ${index}`);
  reachable.add(index);
  refs(scene[index], visit);
}
visit(0);
const kept = [...reachable].sort((a, b) => a - b);
const remap = new Map(kept.map((oldIndex, newIndex) => [oldIndex, newIndex]));
const compact = kept.map((oldIndex) => structuredClone(scene[oldIndex]));
function remapRefs(value) {
  if (!value || typeof value !== 'object') return;
  if ('__id__' in value) {
    if (!remap.has(value.__id__)) throw new Error(`Reference to removed object ${value.__id__}`);
    value.__id__ = remap.get(value.__id__);
    return;
  }
  for (const nested of Object.values(value)) remapRefs(nested);
}
for (const object of compact) remapRefs(object);
writeFileSync(scenePath, `${JSON.stringify(compact, null, 2)}\n`);
console.log(`Removed disabled draft ground: ${scene.length} -> ${compact.length} scene objects`);
