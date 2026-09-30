// One-time scene creation from the last saved Creator scene.
// It preserves the old static DemoScene as historical reference and attaches
// the menu component to a new scene. Refuse to overwrite an editor-saved scene.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

const project = resolve(import.meta.dirname, '..');
const assetRoot = join(project, 'assets');
const destination = join(assetRoot, 'UnitSamples.scene');
if (existsSync(destination)) throw new Error('UnitSamples.scene exists; refusing to overwrite Creator edits.');

const scene = JSON.parse(readFileSync(join(assetRoot, 'DemoScene.scene'), 'utf8'));
const sceneUuid = randomUUID();
scene[0]._name = 'UnitSamples';
scene[1]._name = 'UnitSamples';
scene[1]._id = sceneUuid;
const worldIndex = scene.findIndex(item => item?._name === 'WorldRoot');
if (worldIndex < 0) throw new Error('Expected WorldRoot in saved DemoScene.');
scene[worldIndex]._active = false;

const assets = [
  'scenes/tile_ground', 'scenes/tile_stone_road', 'scenes/tile_water', 'scenes/tile_shore',
  'scenes/bridge_entry', 'scenes/bridge_exit', 'scenes/yama_palace',
  'props/stall_ruined', 'props/stall_restored', 'characters/keeper_ghost',
  'characters/guest_floating', 'characters/guest_floating_walk_01', 'characters/guest_floating_walk_02',
  'characters/guest_horned_beast', 'characters/guest_horned_beast_walk_01',
  'characters/guest_horned_beast_walk_02', 'characters/guest_paper_talisman',
  'characters/guest_paper_talisman_walk_01', 'characters/guest_paper_talisman_walk_02',
  'props/lantern_warm', 'props/shore_tree',
];
const frames = assets.map(relative => {
  const meta = JSON.parse(readFileSync(join(assetRoot, 'demo', `${relative}.png.meta`), 'utf8'));
  return { __uuid__: meta.subMetas.f9941.uuid, __expectedType__: 'cc.SpriteFrame' };
});
const componentId = scene.length;
scene.push({
  __type__: '9e547Ys0ktFGYIectTcx+4S',
  _name: '', _objFlags: 0, __editorExtras__: {},
  node: { __id__: 2 }, _enabled: true, __prefab: null,
  frames, _id: randomUUID().replaceAll('-', '').slice(0, 22),
});
scene[2]._components.push({ __id__: componentId });
writeFileSync(destination, `${JSON.stringify(scene, null, 2)}\n`);
writeFileSync(`${destination}.meta`, `${JSON.stringify({
  ver: '1.1.50', importer: 'scene', imported: true,
  uuid: sceneUuid, files: ['.json'], subMetas: {}, userData: {},
}, null, 2)}\n`);
console.log(`Created UnitSamples.scene with ${frames.length} existing art references.`);
