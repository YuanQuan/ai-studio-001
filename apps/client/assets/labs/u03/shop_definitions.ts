/** Approved U03 display order. Index zero is the milk tea shop. */
export const SHOP_IDS = [
  'MT_SHOP_01', 'SHOP_02', 'SHOP_03', 'SHOP_04', 'SHOP_05', 'SHOP_06',
] as const;

export const SHOP_NAMES = [
  '奶茶店', '糖画摊', '炭烤摊', '理发店', '花灯铺', '投壶铺',
] as const;

/** Creator keeps prefab root names synchronized with asset file names. */
export const SHOP_PREFAB_NAMES = [
  'pf_mt_shop_01', 'pf_shop_02', 'pf_shop_03',
  'pf_shop_04', 'pf_shop_05', 'pf_shop_06',
] as const;
