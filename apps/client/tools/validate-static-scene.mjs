import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const project = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const assets = join(project, 'assets');
const scene = JSON.parse(readFileSync(join(assets, 'DemoScene.scene'), 'utf8'));
const tmx = readFileSync(join(assets, 'demo', 'tilemaps', 'NightMarket.tmx'), 'utf8');
const tmxMeta = JSON.parse(readFileSync(join(assets, 'demo', 'tilemaps', 'NightMarket.tmx.meta'), 'utf8'));
function assert(condition, message) { if (!condition) throw new Error(message); }
function node(name) {
  const value = scene.find((item) => item?.__type__ === 'cc.Node' && item._name === name);
  assert(value, `Missing node: ${name}`);
  return value;
}
function checkReferences(objects, label) {
  function walk(value) {
    if (!value || typeof value !== 'object') return;
    if ('__id__' in value) {
      assert(Number.isInteger(value.__id__) && value.__id__ >= 0 && value.__id__ < objects.length,
        `${label}: invalid __id__ ${value.__id__}`);
      return;
    }
    for (const nested of Object.values(value)) walk(nested);
  }
  for (const object of objects) walk(object);
}

checkReferences(scene, 'DemoScene');
assert(tmx.includes('width="17" height="17" tilewidth="256" tileheight="128"'), 'Unexpected TileMap size');
const data = tmx.match(/<data encoding="csv">([\s\S]*?)<\/data>/)?.[1].trim().replace(/\s+/g, '');
const cells = data?.split(',').map(Number);
assert(cells?.length === 289, 'TileMap must contain 289 cells');
const roadCenters = [];
for (let row = 0; row < 17; row++) {
  for (let col = 0; col < 17; col++) {
    if (cells[row * 17 + col] === 2) roadCenters.push([(col - row) * 128, (16 - row - col) * 64]);
  }
}
const pathNames = ['Entry', 'MarketTurnA', 'MarketCenter', 'TargetFront', 'MarketTurnB', 'Exit'];
const path = pathNames.map((name) => node(name)._lpos);
let offRoad = 0;
for (let segment = 0; segment < path.length - 1; segment++) {
  for (let step = 0; step <= 100; step++) {
    const t = step / 100;
    const x = path[segment].x + (path[segment + 1].x - path[segment].x) * t;
    const y = path[segment].y + (path[segment + 1].y - path[segment].y) * t;
    if (!roadCenters.some(([rx, ry]) => Math.abs(x - rx) / 128 + Math.abs(y - ry) / 64 <= 1.001)) offRoad++;
  }
}
assert(offRoad === 0, `${offRoad} path samples leave stone-road tiles`);
assert(tmxMeta.importer === 'tiled-map' && tmxMeta.imported === true, 'TileMap is not imported by Creator');
const tileComponent = scene.find((item) => item?.__type__ === 'cc.TiledMap');
assert(tileComponent?._tmxFile?.__uuid__ === tmxMeta.uuid, 'Scene points at another TMX');
for (const name of ['GroundTileMap', 'Ground']) {
  const n = node(name);
  const transform = scene[n._components[0].__id__];
  assert(transform._contentSize.width === 4352 && transform._contentSize.height === 2176,
    `${name}: stale map bounds`);
}
const prefabs = join(assets, 'demo', 'prefabs');
const names = readdirSync(prefabs).filter((name) => name.endsWith('.prefab'));
assert(names.length === 9, 'Expected nine reusable static prefabs');
const prefabByUuid = new Map();
for (const name of names) {
  const objects = JSON.parse(readFileSync(join(prefabs, name), 'utf8'));
  const meta = JSON.parse(readFileSync(join(prefabs, `${name}.meta`), 'utf8'));
  checkReferences(objects, name);
  assert(objects[0]?.__type__ === 'cc.Prefab' && objects[1]?.__type__ === 'cc.Node', `${name}: invalid prefab root`);
  assert(meta.importer === 'prefab' && meta.imported === true && meta.uuid, `${name}: not imported by Creator`);
  prefabByUuid.set(meta.uuid, { name, objects });
}
const targetPrefab = prefabByUuid.get(JSON.parse(readFileSync(join(prefabs, 'TargetStall.prefab.meta'), 'utf8')).uuid).objects;
for (const name of ['TargetStall', 'RuinedVisual', 'RestoredVisual', 'HitArea', 'StaffAnchor']) {
  assert(targetPrefab.some((item) => item?.__type__ === 'cc.Node' && item._name === name), `TargetStall prefab lacks ${name}`);
}
const prefabInfos = scene.filter((item) => item?.__type__ === 'cc.PrefabInfo' && item.asset?.__uuid__);
const instances = scene.filter((item) => item?.__type__ === 'cc.PrefabInstance');
assert(prefabInfos.length === 12 && instances.length === 12, 'Expected twelve scene prefab instances');
const counts = new Map();
for (const info of prefabInfos) {
  const prefab = prefabByUuid.get(info.asset.__uuid__);
  assert(prefab, `Scene points at unknown prefab ${info.asset.__uuid__}`);
  assert(info.fileId === prefab.objects[prefab.objects[1]._prefab.__id__].fileId, `${prefab.name}: mismatched prefab root`);
  const instance = scene[info.instance.__id__];
  assert(instance?.__type__ === 'cc.PrefabInstance', `${prefab.name}: missing instance`);
  assert(instance.propertyOverrides.some((entry) => scene[entry.__id__]?.propertyPath?.[0] === 'position'),
    `${prefab.name}: missing world position override`);
  counts.set(prefab.name, (counts.get(prefab.name) ?? 0) + 1);
}
for (const [name, count] of Object.entries({
  'EntryBridge.prefab': 1, 'ExitBridge.prefab': 1, 'YamaPalace.prefab': 1,
  'TargetStall.prefab': 1, 'BackgroundStall.prefab': 5,
  'GuestFloating.prefab': 1, 'GuestHorned.prefab': 1, 'GuestPaperTalisman.prefab': 1,
})) assert(counts.get(name) === count, `${name}: expected ${count} scene instances`);
for (const name of ['BeforeEntry', 'Entry', 'Exit', 'BeyondExit', 'TargetFront']) node(name);
function instancePosition(prefabName) {
  const meta = JSON.parse(readFileSync(join(prefabs, `${prefabName}.prefab.meta`), 'utf8'));
  const info = prefabInfos.find((item) => item.asset.__uuid__ === meta.uuid);
  const instance = scene[info.instance.__id__];
  return scene[instance.propertyOverrides.find((entry) =>
    scene[entry.__id__]?.propertyPath?.[0] === 'position').__id__].value;
}
for (const [name, x, y] of [
  ['EntryBridge', -225, 410], ['ExitBridge', 260, -775],
]) {
  const actual = instancePosition(name);
  assert(actual.x === x && actual.y === y, `${name}: position changed without route calibration`);
}
for (const [name, x, y] of [
  ['BeforeEntry', -325, 560], ['Entry', -160, 480],
  ['Exit', 180, -650], ['BeyondExit', 350, -700],
]) {
  const actual = node(name)._lpos;
  assert(actual.x === x && actual.y === y, `${name}: position changed without bridge calibration`);
}
console.log(`PASS: ${scene.length} scene objects, 17x17 TileMap, ${instances.length} prefab instances, ${path.length - 1} on-road segments, valid references`);
