// Migrate scene landmarks to Creator's serialized Prefab instance format.
// Start with --probe; inspect/re-save in Creator before --all.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { randomBytes } from 'node:crypto';

const project = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const scenePath = join(project, 'assets', 'DemoScene.scene');
const prefabsDir = join(project, 'assets', 'demo', 'prefabs');
const scene = JSON.parse(readFileSync(scenePath, 'utf8'));
const ref = (id) => ({ __id__: id });
const fileId = () => randomBytes(16).toString('base64').slice(0, 22);

function link(sceneName, prefabName) {
  const oldIndex = scene.findIndex((object) => object?.__type__ === 'cc.Node' && object._name === sceneName);
  if (oldIndex < 0 || !scene[oldIndex]._active || scene[oldIndex]._prefab) {
    throw new Error(`Expected active ordinary scene node: ${sceneName}`);
  }
  const old = scene[oldIndex];
  const parentIndex = old._parent.__id__;
  const siblings = scene[parentIndex]._children;
  const position = siblings.findIndex((child) => child.__id__ === oldIndex);
  if (position < 0) throw new Error(`Parent is missing ${sceneName}`);
  const asset = JSON.parse(readFileSync(join(prefabsDir, `${prefabName}.prefab`), 'utf8'));
  const meta = JSON.parse(readFileSync(join(prefabsDir, `${prefabName}.prefab.meta`), 'utf8'));
  const rootInfo = asset[asset[1]._prefab.__id__];
  if (asset[0].__type__ !== 'cc.Prefab' || rootInfo.__type__ !== 'cc.PrefabInfo' || !meta.imported) {
    throw new Error(`Prefab import is invalid: ${prefabName}`);
  }
  const stubIndex = scene.length;
  const infoIndex = stubIndex + 1;
  const instanceIndex = stubIndex + 2;
  const overrideIndex = stubIndex + 3;
  const targetIndex = stubIndex + 4;
  scene.push({
    __type__: 'cc.Node', _objFlags: 0, _parent: ref(parentIndex),
    _prefab: ref(infoIndex), _id: fileId(),
  });
  scene.push({
    __type__: 'cc.PrefabInfo', root: ref(stubIndex), asset: { __uuid__: meta.uuid },
    fileId: rootInfo.fileId, instance: ref(instanceIndex),
  });
  scene.push({
    __type__: 'cc.PrefabInstance', fileId: fileId(), prefabRootNode: null,
    mountedChildren: [], propertyOverrides: [ref(overrideIndex)], removedComponents: [],
  });
  scene.push({
    __type__: 'CCPropertyOverrideInfo', targetInfo: ref(targetIndex),
    propertyPath: ['position'], value: structuredClone(old._lpos),
  });
  scene.push({ __type__: 'cc.TargetInfo', localID: [rootInfo.fileId] });
  old._active = false;
  siblings.splice(position + 1, 0, ref(stubIndex));
  console.log(`${sceneName} -> ${prefabName} (${meta.uuid})`);
}

const mode = process.argv[2];
if (mode === '--probe') {
  link('BackgroundStall_L1', 'BackgroundStall');
} else if (mode === '--all') {
  for (const [sceneName, prefabName] of [
    ['EntryBridge', 'EntryBridge'],
    ['ExitBridge', 'ExitBridge'],
    ['YamaPalace', 'YamaPalace'],
    ['BackgroundStall_R1', 'BackgroundStall'],
    ['BackgroundStall_L2', 'BackgroundStall'],
    ['BackgroundStall_R2', 'BackgroundStall'],
    ['BackgroundStall_L3', 'BackgroundStall'],
    ['TargetStall', 'TargetStall'],
  ]) link(sceneName, prefabName);
} else if (mode === '--actors') {
  for (const [sceneName, prefabName] of [
    ['GuestFloating_Example', 'GuestFloating'],
    ['GuestHorned_Example', 'GuestHorned'],
    ['GuestPaperTalisman_Example', 'GuestPaperTalisman'],
  ]) link(sceneName, prefabName);
} else {
  throw new Error('Use --probe first, then --all and --actors after Creator verifies the probe instance.');
}
writeFileSync(scenePath, `${JSON.stringify(scene, null, 2)}\n`);
