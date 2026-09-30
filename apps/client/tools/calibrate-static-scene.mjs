// Apply the first portrait composition after the real TileMap imported.
// This deliberately changes no gameplay or input behavior.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const project = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const scenePath = join(project, 'assets', 'DemoScene.scene');
const scene = JSON.parse(readFileSync(scenePath, 'utf8'));
function node(name) {
  const found = scene.find((object) => object?.__type__ === 'cc.Node' && object._name === name);
  if (!found) throw new Error(`Missing scene node: ${name}`);
  return found;
}
function position(name, x, y) {
  const found = node(name);
  found._lpos.x = x;
  found._lpos.y = y;
}
for (const name of ['GroundTileMap', 'Ground']) {
  const found = node(name);
  const transform = scene[found._components[0].__id__];
  if (transform?.__type__ !== 'cc.UITransform') throw new Error(`${name} has no UITransform`);
  transform._contentSize.width = 17 * 256;
  transform._contentSize.height = 17 * 128;
}

for (const [name, x, y] of [
  ['EntryBridge', -190, 500],
  ['YamaPalace', 220, 450],
  ['ShoreTree_L1', -285, 410],
  ['ShoreTree_R1', 285, 200],
  ['BackgroundStall_L1', -230, 225],
  ['BackgroundStall_R1', 230, 130],
  ['BackgroundStall_L2', -230, -80],
  ['BackgroundStall_R2', 230, -140],
  ['BackgroundStall_L3', -230, -385],
  ['TargetStall', 220, -375],
  ['ShoreTree_R2', 285, -475],
  ['ExitBridge', 190, -850],
  ['Entry', -160, 480],
  ['MarketTurnA', -60, 320],
  ['MarketCenter', -10, 40],
  ['Exit', 180, -650],
  ['BeyondExit', 190, -850],
]) position(name, x, y);
position('Keeper_ExampleHidden', 227, -333);
writeFileSync(scenePath, `${JSON.stringify(scene, null, 2)}\n`);
console.log(`Calibrated static landmarks in ${scenePath}`);
