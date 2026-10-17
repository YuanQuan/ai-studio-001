# 10 件代表资产登记 v0.1

本登记描述 Art 实际交付及未来计划接入位置。10 件新 PNG 均未导入 Cocos，导入后实际 UUID 待核（可能沿用现 UUID），实际运行 `NOT_TESTED`，具体版本 Gate2 待用户批准。当前工程 UUID 见同批 `INPUT_CHECK.json`，不可冒充本版导入结果。每件完整 SHA、裁框、offset、原画布与重组路径见 `CUT_MANIFEST.json`。

|稳定资产 ID|描述|原画布→裁片|Art 实际文件|Client 计划路径|
|---|---|---|---|---|
|`U03_SHOP_01_BODY`|奶茶店主体|1024²→749×624|`exports/tex_mt_shop_01_body.png`|`apps/client/assets/units/shops/milk_tea/textures/tex_mt_shop_01_body.png`|
|`U03_SHOP_01_SIGN`|奶茶店悬杯招牌|1024²→93×200|`exports/tex_mt_shop_01_sign.png`|`apps/client/assets/units/shops/milk_tea/textures/tex_mt_shop_01_sign.png`|
|`UG_GHOST_01_WALK_00`|游客步行第0帧|512²→327×359|`exports/tex_ug_ghost_01_walk_00.png`|`apps/client/assets/units/ghost-customer/frames/tex_ug_ghost_01_walk_00.png`|
|`UG_GHOST_01_RUN_00`|游客跑动第0帧|512²→327×359|`exports/tex_ug_ghost_01_run_00.png`|`apps/client/assets/units/ghost-customer/frames/tex_ug_ghost_01_run_00.png`|
|`UG_GHOST_01_HAPPY_01`|游客开心第1帧|512²→343×338|`exports/tex_ug_ghost_01_happy_01.png`|`apps/client/assets/units/ghost-customer/frames/tex_ug_ghost_01_happy_01.png`|
|`UG_GHOST_01_HAPPY_03`|游客开心第3帧|512²→315×395|`exports/tex_ug_ghost_01_happy_03.png`|`apps/client/assets/units/ghost-customer/frames/tex_ug_ghost_01_happy_03.png`|
|`UG_GHOST_01_SAD_04`|游客难过第4帧|512²→354×322|`exports/tex_ug_ghost_01_sad_04.png`|`apps/client/assets/units/ghost-customer/frames/tex_ug_ghost_01_sad_04.png`|
|`UG_GHOST_01_SAD_05`|游客难过第5帧|512²→355×321|`exports/tex_ug_ghost_01_sad_05.png`|`apps/client/assets/units/ghost-customer/frames/tex_ug_ghost_01_sad_05.png`|
|`UG_GHOST_01_SAD_06`|游客难过第6帧|512²→354×323|`exports/tex_ug_ghost_01_sad_06.png`|`apps/client/assets/units/ghost-customer/frames/tex_ug_ghost_01_sad_06.png`|
|`tex_sakura_rr_spirit_a_flame`|樱花场景A火焰|160²→92×94|`exports/tex_sakura_rr_spirit_a_flame.png`|`apps/client/assets/resources/sakura_v03/tex_sakura_rr_spirit_a_flame.png`|

`source/optimization_pilot_master.psd` 是 3072×2048 资源库母版，SHA-256 `f123f00d52b5ef9ae66028d3de395d312111a2477cc2a388f9cf9a6e0ed2a00c`，用于图层整理而非客户端运行纹理。原图与旧 PSD 保持只读；其批准来源及权利链见 `PREPRODUCTION_PLAN.md`。本批未引入外部图片、字体或新视觉元素。
