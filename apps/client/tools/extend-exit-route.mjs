// Keep the bridge tail distinct from the final off-map recycle anchor.
// This is scene-data calibration only; it adds no movement or input code.
import { readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';

const project = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const scenePath = join(project, 'assets', 'DemoScene.scene');
const scene = JSON.parse(readFileSync(scenePath, 'utf8'));
const find = (name) => scene.find((item) => item?.__type__ === 'cc.Node' && item._name === name);
const walkway = find('WalkwayRoot');
if (!walkway) throw new Error('WalkwayRoot is missing');

let bridgeTail = find('BridgeTail');
let beyondExit = find('BeyondExit');
if (!bridgeTail) {
  if (!beyondExit) throw new Error('Existing BeyondExit anchor is missing');
  bridgeTail = beyondExit;
  bridgeTail._name = 'BridgeTail';
  beyondExit = structuredClone(bridgeTail);
  beyondExit._name = 'BeyondExit';
  beyondExit._id = randomBytes(16).toString('base64url');
  const index = scene.push(beyondExit) - 1;
  walkway._children.push({ __id__: index });
}
if (!beyondExit) throw new Error('BeyondExit anchor is missing');
Object.assign(bridgeTail._lpos, { x: 350, y: -700 });
Object.assign(beyondExit._lpos, { x: 820, y: -840 });
writeFileSync(scenePath, `${JSON.stringify(scene, null, 2)}\n`);
console.log(`Calibrated ${scenePath} with bridge tail and off-map exit`);
