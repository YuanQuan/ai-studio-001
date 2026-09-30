// Export the already calibrated scene nodes as reusable static Creator prefabs.
// Creator imports the resulting source files and owns their .meta files.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { randomBytes } from 'node:crypto';

const project = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const source = JSON.parse(readFileSync(join(project, 'assets', 'DemoScene.scene'), 'utf8'));
const outputDir = join(project, 'assets', 'demo', 'prefabs');
mkdirSync(outputDir, { recursive: true });
const ref = (index) => ({ __id__: index });
const fileId = () => randomBytes(16).toString('base64').slice(0, 22);

function cloneNodeTree(name, prefabName) {
  const rootIndex = source.findIndex((value) => value?.__type__ === 'cc.Node' && value._name === name);
  if (rootIndex < 0) throw new Error(`Missing scene node: ${name}`);
  const result = [{
    __type__: 'cc.Prefab', _name: prefabName, _objFlags: 0, _native: '',
    data: ref(1), optimizationPolicy: 0, asyncLoadAssets: false, persistent: false,
  }];
  const copied = new Map();

  function addObject(originalIndex) {
    if (copied.has(originalIndex)) return copied.get(originalIndex);
    const destination = result.length;
    copied.set(originalIndex, destination);
    result.push(null);
    const original = source[originalIndex];
    if (!original) throw new Error(`Dangling scene reference ${originalIndex}`);
    const object = structuredClone(original);
    if (object.__type__ === 'cc.Node') {
      object._parent = originalIndex === rootIndex ? null : ref(addObject(original._parent.__id__));
      object._children = original._children.map((child) => ref(addObject(child.__id__)));
      object._components = original._components.map((component) => ref(addObject(component.__id__)));
      object._id = '';
      const prefabInfo = result.length;
      result.push({ __type__: 'cc.PrefabInfo', root: ref(1), asset: ref(0), fileId: fileId() });
      object._prefab = ref(prefabInfo);
    } else {
      object.node = ref(addObject(original.node.__id__));
      object._id = '';
      const componentInfo = result.length;
      result.push({ __type__: 'cc.CompPrefabInfo', fileId: fileId() });
      object.__prefab = ref(componentInfo);
    }
    result[destination] = object;
    return destination;
  }

  addObject(rootIndex);
  result[1]._name = prefabName;
  result[1]._lpos.x = 0;
  result[1]._lpos.y = 0;
  result[1]._active = true;
  const output = join(outputDir, `${prefabName}.prefab`);
  if (existsSync(output)) throw new Error(`Prefab already exists; refusing to replace Creator-imported asset: ${output}`);
  writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
  return output;
}

for (const [sceneNode, prefabName] of [
  ['EntryBridge', 'EntryBridge'],
  ['ExitBridge', 'ExitBridge'],
  ['YamaPalace', 'YamaPalace'],
  ['BackgroundStall_L1', 'BackgroundStall'],
  ['TargetStall', 'TargetStall'],
  ['Keeper_ExampleHidden', 'Keeper'],
  ['GuestFloating_Example', 'GuestFloating'],
  ['GuestHorned_Example', 'GuestHorned'],
  ['GuestPaperTalisman_Example', 'GuestPaperTalisman'],
]) console.log(cloneNodeTree(sceneNode, prefabName));
