import { BitmapFont, JsonAsset, Prefab, SpriteFrame } from 'cc';
import { CocosBundleLoader } from '../module-assets/cocos_bundle_loader';
import { ModuleAssets, ModuleManifest } from '../module-assets/module_assets';
import { U04_MODULE_MANIFEST } from '../module-assets/u04_module_registry';
import { APPROVED_ASSET_MODULE_MANIFEST, APPROVED_DERIVED_ASSET_MANIFEST } from './approved_asset_registry';
import { DerivedAssetResolver } from './derived_asset_resolver';
import { SAKURA_V03_LAYOUT } from '../../labs/u01/sakura_v03_layout';
import { U05_ASSET_SIZES } from '../../labs/u05/milk_tea_lab';

const worldLayoutAssets: Record<string, { path: string; type: unknown }> = {};
for (const prototype of SAKURA_V03_LAYOUT.prototypes) {
  const id = prototype.id === 'tex_sakura_rr_far_l' ? 'tex_sakura_rr_far_l_dark_base' : prototype.id;
  worldLayoutAssets[id] = { path: `sakura_v03/${prototype.path.replace(/\.png$/i, '')}/spriteFrame`, type: SpriteFrame };
}

const teaAssets: Record<string, { path: string; type: unknown }> = {};
for (const id of Object.keys(U05_ASSET_SIZES)) {
  // STATIC_BARE is a legacy texture; the live scene uses the explicitly named
  // PATCH04 composition. Do not load the old full-canvas texture into U05.
  if (id === 'STATIC_BARE') continue;
  teaAssets[id] = { path: `u05_milk_tea/u05_b/${id}/spriteFrame`, type: SpriteFrame };
}
teaAssets.LABEL_PLATE_9SLICE = { path: 'u05_milk_tea/u05_b/LABEL_PLATE_9SLICE/spriteFrame', type: SpriteFrame };
teaAssets.milkTeaConfig = { path: 'u05_milk_tea/config', type: JsonAsset };
teaAssets.milkTeaFont = { path: 'u05_milk_tea/u05_b/U05_ART_FONT', type: BitmapFont };

const extra: ModuleManifest = {
  world: { bundle: 'world', assets: {
    streetBasePrefab: { path: 'prefabs/pf_street_base_01', type: Prefab },
    ...worldLayoutAssets,
  } },
  tourist: { bundle: 'tourist', assets: {
    touristPrefab: { path: 'ghost-customer/UG_GHOST_01', type: Prefab },
    touristFrameManifest: { path: 'ghost-customer/frames/ug_ghost_01_frame_manifest', type: JsonAsset },
    touristMountManifest: { path: 'ghost-customer/data/ug_ghost_01_mounts', type: JsonAsset },
    touristAccessoryManifest: { path: 'ghost-customer/data/ug_ghost_01_accessories', type: JsonAsset },
    // These four existing accessory textures are still referenced by U00/U02
    // gameplay. They are runtime source assets, not part of the approved 83
    // crop set, so retain their original PNG/UUID and load them by exact path.
    touristHatFront: { path: 'ghost-customer/accessories/tex_ug_acc_hat_01_front/spriteFrame', type: SpriteFrame },
    touristGlassesFront: { path: 'ghost-customer/accessories/tex_ug_acc_glasses_01_front/spriteFrame', type: SpriteFrame },
    touristWristbandFront: { path: 'ghost-customer/accessories/tex_ug_acc_wristband_01_front/spriteFrame', type: SpriteFrame },
    touristWristbandBack: { path: 'ghost-customer/accessories/tex_ug_acc_wristband_01_back/spriteFrame', type: SpriteFrame },
  } },
  shops: { bundle: 'shops', assets: {
    shopPrefab01: { path: 'milk_tea/prefabs/pf_mt_shop_01', type: Prefab },
    shopPrefab02: { path: 'sugar_art/prefabs/pf_shop_02', type: Prefab },
    shopPrefab03: { path: 'charcoal_grill/prefabs/pf_shop_03', type: Prefab },
    shopPrefab04: { path: 'barber/prefabs/pf_shop_04', type: Prefab },
    shopPrefab05: { path: 'lantern/prefabs/pf_shop_05', type: Prefab },
    shopPrefab06: { path: 'pitch_pot/prefabs/pf_shop_06', type: Prefab },
  } },
  'milk-tea': { bundle: 'milk-tea', dependencies: ['tourist'], assets: teaAssets },
};

// Approved historical identities remain in APPROVED_ASSET_MODULE_MANIFEST. The
// production world manifest follows the frozen Sakura prototype paths exactly;
// the approved far_l crop is kept in the audit map but is not loaded because the
// active scene uses the separately approved eye_dark_base source.
const approvedProduction: ModuleManifest = {};
for (const [id, module] of Object.entries(APPROVED_ASSET_MODULE_MANIFEST)) {
  const assets = { ...module.assets };
  if (id === 'world') delete assets.tex_sakura_rr_far_l;
  if (id === 'milk-tea') {
    // Retain approved LOCK crops and omit only the unapproved legacy full-canvas
    // background that the live caller replaced with STATIC_BARE_PATCH04.
    delete assets.STATIC_BARE;
  }
  approvedProduction[id] = { ...module, assets };
}

export const CLIENT_ASSET_MODULE_MANIFEST: ModuleManifest = {
  ...approvedProduction,
  ...Object.entries(extra).reduce((result, [id, module]) => {
    // Merge with the filtered production set: using the historical approval
    // map here reintroduced the retired far_l path after it was deleted above.
    const approved = approvedProduction[id];
    result[id] = { ...module, assets: { ...(approved?.assets ?? {}), ...module.assets } };
    return result;
  }, {} as ModuleManifest),
  ...Object.entries(U04_MODULE_MANIFEST).reduce((result, [id, module]) => {
    result[id] = {
    ...module,
    dependencies: ['world', 'shops'],
    };
    return result;
  }, {} as ModuleManifest),
};

export function createClientAssetRuntime(): { modules: ModuleAssets; derived: DerivedAssetResolver } {
  const modules = new ModuleAssets(CLIENT_ASSET_MODULE_MANIFEST, new CocosBundleLoader());
  const productionDerived = { assets: APPROVED_DERIVED_ASSET_MANIFEST.assets
    .filter(item => item.stableAssetId !== 'tex_sakura_rr_far_l') };
  return { modules, derived: new DerivedAssetResolver(modules, productionDerived) };
}
