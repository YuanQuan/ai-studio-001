# PSD 真实图层→原画布→切片映射 v0.1

母版 `source/optimization_pilot_master.psd`（3072×2048，10个实层）SHA-256 `f123f00d52b5ef9ae66028d3de395d312111a2477cc2a388f9cf9a6e0ed2a00c`。下表从底层到顶层排列；ImageMagick 帧0为合成预览，帧1～10按顶层到底层。制作脚本读取真实 PSD 层通道，从资源库坐标反向平移至独立原画布，再按裁框导出。完整 SHA 与逐项比较见 `CUT_MANIFEST.json` 和 `review/COMPARISON_REPORT.json`。

|层名/稳定ID|PSD帧|资源库位移|独立原画布|裁框 `[l,t,r,b)`|输出|
|---|---:|---|---|---|---|
|`U03_SHOP_01_BODY`|10|(0,0)|1024²|`[137,280,886,904)`|`tex_mt_shop_01_body.png`|
|`U03_SHOP_01_SIGN`|9|(1024,0)|1024²|`[783,533,876,733)`|`tex_mt_shop_01_sign.png`|
|`UG_GHOST_01_WALK_00`|8|(0,1024)|512²|`[89,67,416,426)`|`tex_ug_ghost_01_walk_00.png`|
|`UG_GHOST_01_RUN_00`|7|(512,1024)|512²|`[89,67,416,426)`|`tex_ug_ghost_01_run_00.png`|
|`UG_GHOST_01_HAPPY_01`|6|(1024,1024)|512²|`[82,110,425,448)`|`tex_ug_ghost_01_happy_01.png`|
|`UG_GHOST_01_HAPPY_03`|5|(1536,1024)|512²|`[98,23,413,418)`|`tex_ug_ghost_01_happy_03.png`|
|`UG_GHOST_01_SAD_04`|4|(0,1536)|512²|`[89,126,443,448)`|`tex_ug_ghost_01_sad_04.png`|
|`UG_GHOST_01_SAD_05`|3|(512,1536)|512²|`[89,127,444,448)`|`tex_ug_ghost_01_sad_05.png`|
|`UG_GHOST_01_SAD_06`|2|(1024,1536)|512²|`[89,125,443,448)`|`tex_ug_ghost_01_sad_06.png`|
|`tex_sakura_rr_spirit_a_flame`|1|(2048,1024)|160²|`[34,6,126,100)`|`tex_sakura_rr_spirit_a_flame.png`|

旧奶茶 `shop_01_full_redraw_v01.psd` 有 `01_front_and_ground`、`02_structure_and_interior`、`03_roof_and_upper`、`04_sign` 四实层；前三层合成对已批 body PNG、第四层对已批 sign PNG 的 alpha/可见RGB均0差。新母版 body/sign 层取这两张获批导出 PNG，旧 PSD 未修改。游客旧 `tourist_body_master.psd` 当前缺失，七帧按获批现行 PNG 建独立栅格层，只可编辑像素/透明边，不恢复原生结构或动画绑定。樱花 v0.3 场景 PSD 中四个 `spirit_a_flame_instance_*` 是已经缩放的场景实例；本次 160² 新层取同版获批源 PNG，不冒充场景实例为源纹理层。

`source/psd_manifest.json`、`source/originals/`、`source/psd_full_canvas_layers/` 与 `source/process_notes.md` 保存组装输入、skill 输出与编辑限制。10 件源→PSD实层→原画布以及裁片回置源画布的 alpha、可见RGB均0差。`review/scene_flame_detail_source_vs_new.png` 为现行场景同背景、同实例尺寸的静态投影；Creator实际导入、运行与Photoshop/Photopea交互编辑均 `NOT_TESTED`。
