import { JsonAsset, SpriteFrame } from 'cc';
import { ModuleManifest } from './module_assets';

const manifest: ModuleManifest = {
  'u04-mapping': { bundle: 'dialogue', assets: { mapping: { path: 'u04_layer_export_map', type: JsonAsset } } },
  'u04-decoration': { bundle: 'dialogue', assets: {
    panel: { path: 'ui/tex_u04_dialogue_panel_9s/spriteFrame', type: SpriteFrame },
    cornerBottomLeft: { path: 'ui/tex_u04_dialogue_corner_cloud_bottom_left/spriteFrame', type: SpriteFrame },
    cornerTopRight: { path: 'ui/tex_u04_dialogue_corner_cloud_top_right/spriteFrame', type: SpriteFrame },
  } },
};

for (const manager of ['mt', 'at', 'ac', 'aj', 'ad', 'xj']) {
  for (const stage of [0, 2, 3]) {
    for (const expression of ['happy', 'surprised', 'sad', 'smile', 'angry']) {
      const id = `u04-${manager}-s${stage}-${expression}`;
      manifest[id] = { bundle: 'dialogue', assets: {
        base: { path: `portraits/tex_u04_${manager}_s${stage}_base/spriteFrame`, type: SpriteFrame },
        face: { path: `faces/tex_u04_${manager}_s${stage}_face_${expression}/spriteFrame`, type: SpriteFrame },
        front: { path: `portraits/tex_u04_${manager}_s${stage}_front/spriteFrame`, type: SpriteFrame },
      } };
    }
  }
}

export const U04_MODULE_MANIFEST = manifest;
export const U04_MAPPING_MODULE = 'u04-mapping';
export const U04_DECORATION_MODULE = 'u04-decoration';
export const u04PortraitModuleId = (key: string, expression: string): string => {
  const normalized = key.toLowerCase().replace('_', '-');
  return `u04-${normalized}-${expression}`;
};
