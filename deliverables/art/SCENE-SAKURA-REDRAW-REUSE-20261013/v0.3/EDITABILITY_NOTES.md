# v0.3 环境资源编辑说明

画布 3072×1024；正式 PSD 含 43 个实际透明栅格层。原 41 个环境语义层与 v0.2 字节相同，另有左右独立 `stone_chain_rail_l/r` 两个真实环境层；层序在桥街之后、牌楼与前景之前。正式运行只需 18 张 active PNG：前 17 张环境 PNG 文件 SHA 与 v0.2 相同，唯一替换 `tex_sakura_rr_street_rail_half.png`，1536×113，置 (0,730) 并水平镜像置 (1536,730)。柱、链是新绘原型，本版保留 `source/native/stone_chain_native.png` 原生图及独立裁出的 post/chain/bank 透明源供后续编辑；用户提供的 687×77 参考没有进入 PSD 或正式 ZIP。

新绘单柱原型依原柱位 x≈74/435/815/1190 重复；新绘链段在三跨之间复用，端环与柱侧挂环有轻微搭接。岸石、植物、桥脚来自 v0.2 已新绘半幅下部，源像素保留；旧灯与绳只在上部透明区清除。正式栏杆层与正式半幅 PNG 使用同一份预合成像素，以避免多个半透明层在 RGBA8 中二次叠加导致 1 级舍入差；独立 post/chain/bank 的可编辑源均保留，未把全景截图作为假层。左右重复与镜像是获批制作方案的一部分。用户明确树不修，且无店铺资源。

`CUT_MANIFEST.json` 记录实际层序、坐标、来源与 SHA；`review/reassembled_from_exports.png` 由正式 active 切片在源尺度重组，和 `review/scene_environment.png` 解码零差。`review/before_after.png` 上行为 v0.2，下行为 v0.3 同尺度街栏。除两侧栏杆 ROI 外，整景 RGBA 像素与 v0.2 零差。CPU 微动 HTML 沿原制作方案继承、未改动画语义，不代表 Cocos 导入或目标机运行。v0.2 具体成品未获用户批准，v0.3 仍待具体资源用户审核。
