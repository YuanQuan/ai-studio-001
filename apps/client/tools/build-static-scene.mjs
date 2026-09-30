// One-time static layout builder for the Creator-created DemoScene.scene.
// It changes scene nodes only; Creator owns every asset .meta and UUID.
import { readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';

const project = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const scenePath = join(project, 'assets', 'DemoScene.scene');
const scene = JSON.parse(readFileSync(scenePath, 'utf8'));
const existingWorld = scene.findIndex((item) => item?._name === 'WorldRoot');
if (existingWorld >= 0) {
  throw new Error('DemoScene already contains WorldRoot; refusing to duplicate the static layout.');
}
const ref = (id) => ({ __id__: id });
const vec3 = (x, y, z = 0) => ({ __type__: 'cc.Vec3', x, y, z });
const size = (width, height) => ({ __type__: 'cc.Size', width, height });
const vec2 = (x, y) => ({ __type__: 'cc.Vec2', x, y });
const color = { __type__: 'cc.Color', r: 255, g: 255, b: 255, a: 255 };
const id = () => randomBytes(16).toString('base64url').slice(0, 22);

function addNode(name, parent, x = 0, y = 0, scale = 1, active = true) {
  const index = scene.length;
  const node = {
    __type__: 'cc.Node', _name: name, _objFlags: 0, __editorExtras__: {},
    _parent: ref(parent), _children: [], _active: active, _components: [], _prefab: null,
    _lpos: vec3(x, y),
    _lrot: { __type__: 'cc.Quat', x: 0, y: 0, z: 0, w: 1 },
    _lscale: vec3(scale, scale, 1), _mobility: 0, _layer: 33554432,
    _euler: vec3(0, 0), _id: id(),
  };
  scene.push(node);
  scene[parent]._children.push(ref(index));
  return index;
}

function addTransform(nodeIndex, width, height, anchorX = 0.5, anchorY = 0.5) {
  const index = scene.length;
  scene.push({
    __type__: 'cc.UITransform', _name: '', _objFlags: 0, __editorExtras__: {},
    node: ref(nodeIndex), _enabled: true, __prefab: null,
    _contentSize: size(width, height), _anchorPoint: vec2(anchorX, anchorY), _id: id(),
  });
  scene[nodeIndex]._components.push(ref(index));
}

const assetCache = new Map();
function asset(relative) {
  if (assetCache.has(relative)) return assetCache.get(relative);
  const meta = JSON.parse(readFileSync(join(project, 'assets', 'demo', `${relative}.png.meta`), 'utf8'));
  const data = {
    frame: meta.subMetas.f9941.uuid,
    width: meta.subMetas.f9941.userData.width,
    height: meta.subMetas.f9941.userData.height,
  };
  assetCache.set(relative, data);
  return data;
}

function addSprite(name, parent, relative, x, y, scale = 1, anchorY = 0.5, active = true) {
  const { frame, width, height } = asset(relative);
  const nodeIndex = addNode(name, parent, x, y, scale, active);
  addTransform(nodeIndex, width, height, 0.5, anchorY);
  const componentIndex = scene.length;
  scene.push({
    __type__: 'cc.Sprite', _name: '', _objFlags: 0, __editorExtras__: {},
    node: ref(nodeIndex), _enabled: true, __prefab: null,
    _srcBlendFactor: 2, _dstBlendFactor: 4, _color: color,
    _sharedMaterial: null, _spriteFrame: { __uuid__: frame },
    _type: 0, _fillType: 0, _sizeMode: 1, _fillCenter: vec2(0, 0),
    _fillStart: 0, _fillRange: 0, _isTrimmedMode: true,
    _useGrayscale: false, _atlas: null, _id: id(),
  });
  scene[nodeIndex]._components.push(ref(componentIndex));
  return nodeIndex;
}

// The Canvas and camera were serialized by Creator when the user saved this scene.
scene[2]._name = 'ScreenCanvas';
scene[2]._lpos = vec3(360, 640);
scene[5]._contentSize = size(720, 1280);
scene[4]._orthoHeight = 1280;
scene[4]._color = { __type__: 'cc.Color', r: 11, g: 19, b: 39, a: 255 };

const world = addNode('WorldRoot', 2);
const ground = addNode('GroundTileMap_DraftSprites', world);
const landmarks = addNode('LandmarkRoot', world);
const walkway = addNode('WalkwayRoot', world);
const actors = addNode('ActorsRoot_StaticExamples', world);

// 15x15 isometric placement. This draft uses individual sprites so the first
// visual pass can be reviewed; the final calibration must use a real TiledMap.
const mapSize = 15;
const groundTiles = [];
for (let row = 0; row < mapSize; row++) {
  for (let col = 0; col < mapSize; col++) {
    const x = (col - row) * 128;
    const y = (14 - row - col) * 64;
    const edge = Math.min(row, col, mapSize - 1 - row, mapSize - 1 - col);
    const roadCenter = -250 + (row + col) * 18;
    const road = Math.abs(x - roadCenter) < 155 && row + col > 3 && row + col < 25;
    const kind = road ? 'tile_stone_road' : edge === 0 ? 'tile_water' : edge === 1 ? 'tile_shore' : 'tile_ground';
    groundTiles.push({ row, col, x, y, kind });
  }
}
groundTiles.sort((a, b) => b.y - a.y || a.x - b.x);
for (const tile of groundTiles) {
  addSprite(`Tile_${tile.row}_${tile.col}_${tile.kind}`, ground, `scenes/${tile.kind}`, tile.x, tile.y);
}

const decorations = [
  ['EntryBridge', 'scenes/bridge_entry', -290, 585, 0.48],
  ['YamaPalace', 'scenes/yama_palace', 380, 525, 0.51],
  ['ShoreTree_L1', 'props/shore_tree', -535, 410, 0.34],
  ['ShoreTree_R1', 'props/shore_tree', 550, 200, 0.31],
  ['BackgroundStall_L1', 'props/stall_ruined', -360, 225, 0.34],
  ['BackgroundStall_R1', 'props/stall_ruined', 350, 130, 0.34],
  ['BackgroundStall_L2', 'props/stall_ruined', -365, -80, 0.34],
  ['BackgroundStall_R2', 'props/stall_ruined', 365, -140, 0.34],
  ['BackgroundStall_L3', 'props/stall_ruined', -375, -385, 0.33],
  ['TargetStall', null, 295, -375, 1],
  ['ShoreTree_R2', 'props/shore_tree', 550, -475, 0.3],
  ['ExitBridge', 'scenes/bridge_exit', 305, -685, 0.48],
];
// Simple painter order for the fixed scene preview, back to front by foot Y.
decorations.sort((a, b) => b[3] - a[3]);
let target;
for (const [name, image, x, y, scale] of decorations) {
  if (name === 'TargetStall') target = addNode(name, landmarks, x, y);
  else addSprite(name, landmarks, image, x, y, scale, 0);
}
addSprite('RuinedVisual', target, 'props/stall_ruined', 0, 0, 0.39, 0);
addSprite('RestoredVisual', target, 'props/stall_restored', 0, 0, 0.39, 0, false);
const hit = addNode('HitArea', target, 0, 75);
addTransform(hit, 260, 160);
addNode('StaffAnchor', target, 7, 42);

const path = [
  ['Entry', -310, 570], ['MarketTurnA', -220, 320],
  ['MarketCenter', -75, 40], ['TargetFront', 75, -300],
  ['MarketTurnB', 190, -490], ['Exit', 290, -660], ['BeyondExit', 420, -850],
];
for (const [name, x, y] of path) addNode(name, walkway, x, y);

addSprite('GuestFloating_Example', actors, 'characters/guest_floating', -170, 230, 0.24, 0);
addSprite('GuestHorned_Example', actors, 'characters/guest_horned_beast', -30, -25, 0.22, 0);
addSprite('GuestPaperTalisman_Example', actors, 'characters/guest_paper_talisman', 140, -265, 0.22, 0);
const keeper = addSprite('Keeper_ExampleHidden', actors, 'characters/keeper_ghost', 295, -330, 0.22, 0, false);
scene[keeper]._active = false;

writeFileSync(scenePath, `${JSON.stringify(scene, null, 2)}\n`);
console.log(`Wrote ${scenePath}: ${groundTiles.length} ground sprites, ${decorations.length} landmarks, ${path.length} path anchors.`);
