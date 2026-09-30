// Attach the Creator-imported TMX to the existing static scene.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { randomBytes } from 'node:crypto';

const project = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const scenePath = join(project, 'assets', 'DemoScene.scene');
const tmxMetaPath = join(project, 'assets', 'demo', 'tilemaps', 'NightMarket.tmx.meta');
const scene = JSON.parse(readFileSync(scenePath, 'utf8'));
const meta = JSON.parse(readFileSync(tmxMetaPath, 'utf8'));
if (meta.importer !== 'tiled-map' || meta.imported !== true) throw new Error('TMX has not been imported by Creator.');
if (scene.some((object) => object?._name === 'GroundTileMap')) throw new Error('GroundTileMap already exists.');
const world = scene.findIndex((object) => object?._name === 'WorldRoot');
const fallback = scene.findIndex((object) => object?._name === 'GroundTileMap_DraftSprites');
if (world < 0 || fallback < 0) throw new Error('Expected static scene roots are missing.');
const ref = (index) => ({ __id__: index });
const id = () => randomBytes(16).toString('base64').slice(0, 22);
const nodeIndex = scene.length;
scene.push({
  __type__: 'cc.Node', _name: 'GroundTileMap', _objFlags: 0, __editorExtras__: {},
  _parent: ref(world), _children: [], _active: true,
  _components: [ref(nodeIndex + 1), ref(nodeIndex + 2)], _prefab: null,
  _lpos: { __type__: 'cc.Vec3', x: 0, y: 0, z: 0 },
  _lrot: { __type__: 'cc.Quat', x: 0, y: 0, z: 0, w: 1 },
  _lscale: { __type__: 'cc.Vec3', x: 1, y: 1, z: 1 },
  _mobility: 0, _layer: 33554432,
  _euler: { __type__: 'cc.Vec3', x: 0, y: 0, z: 0 }, _id: id(),
});
scene.push({
  __type__: 'cc.UITransform', _name: '', _objFlags: 0, __editorExtras__: {},
  node: ref(nodeIndex), _enabled: true, __prefab: null,
  _contentSize: { __type__: 'cc.Size', width: 3840, height: 1920 },
  _anchorPoint: { __type__: 'cc.Vec2', x: 0.5, y: 0.5 }, _id: id(),
});
scene.push({
  __type__: 'cc.TiledMap', _name: '', _objFlags: 0, __editorExtras__: {},
  node: ref(nodeIndex), _enabled: true, __prefab: null,
  _tmxFile: { __uuid__: meta.uuid }, _enableCulling: true,
  cleanupImageCache: true, _id: id(),
});
scene[world]._children.unshift(ref(nodeIndex));
scene[fallback]._active = false;
scene[fallback]._name = 'DraftSpriteFallback_Disabled';
writeFileSync(scenePath, `${JSON.stringify(scene, null, 2)}\n`);
console.log(`Attached Creator TMX ${meta.uuid} to DemoScene; disabled the original ground sprites.`);
