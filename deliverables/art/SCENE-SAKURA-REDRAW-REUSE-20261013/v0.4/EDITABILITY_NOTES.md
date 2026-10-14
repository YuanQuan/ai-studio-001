# v0.4 PSD 编辑范围与限制

`source/scene_sakura_reuse_master.psd` 是 3072×1024、实际 45 层的栅格 PSD。原 v0.3 两个 `bridge_l/r` 全画布层各拆为 `bridge_body_l/r` 与 `bridge_front_l/r`；其它 41 层由 v0.3 逐文件复制，石柱链条仍是原 PSD 层。`source/psd_full_canvas_layers/` 保留各层原位透明 PNG，`PSD_MANIFEST.json` 给出图层顺序和来源。PSD 可编辑的是已存在像素的层级、位置与可见性；不是完整重建的桥 3D/矢量或可独立修改的灯与栏杆原画。

前景由 `source/bridge_front_hand_mask.png` 的人工轮廓决定；源桥半幅 x/y 裁框和左右镜像偏移记录于 `CUT_MANIFEST.json`。遮罩只把原 RGBA 归属改到 body 或 front，未绘制新像素。原 v0.3 没有画出栏杆后方被遮住的路面，前景偏移或游客运动若露出未知区域，本版无补洞内容，须另经方案审批后设计。透明像素的无意义 RGB 在标准 alpha 合成时可被归零；有 alpha 的可见像素与整体静态重组均零差。

本次用 `bggg-creator-image2psd` 的 `assemble` 写入 PSD，并以 Pillow 核读取格式、图层数、展平结果和预览。未在原生 Photoshop 中打开验证；Cocos 导入、目标机内存、draw batch 和运行遮挡也未测试。本 PSD、导出和审核图在用户批准具体版本前均为候选资源。
