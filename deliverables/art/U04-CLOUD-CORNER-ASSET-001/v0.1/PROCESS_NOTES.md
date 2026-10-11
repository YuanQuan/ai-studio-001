# U04 云纹角花拆分记录 v0.1

首图前 Art 与 Tech 对 `U04-CLOUD-CORNER-v0.1` 预签，Tech 记录：`deliverables/tech_lead/U04-CLOUD-CORNER-TECH-001/v0.1/TECH_PRESIGN.json`。此后按同批预案从用户批准的 v0.4 PNG 导出，没有调用生图工具、绘制新线或补画人物遮挡部分。

## 实际处理

- 源图原文件以相同 SHA 复制到 `source/original_reference.png`。`source/extract_corner_cloud.py` 按两个预签窗口取源 RGB，使用局部多边形、RGB 金色阈值、深蓝色阈值和连通位置限制生成 alpha。该处理仅决定哪些原图像素可见；PSD 原位层中非透明位置的 RGB 与源图逐像素相同。
- 保留金线、可见卷纹、金线围合且实际可见的深蓝云体。左下人物手臂与服装颜色不进入 alpha；右上“放大面板”按钮及蓝色边线不进入 alpha。源图原本没有被遮挡处的角花像素，故该区域透明且不可恢复。
- 左下角花在窗口 `[0,789,167,914)` 中实际 alpha 边界为 `[4,40,130,125)`；右上窗口 `[1500,675,1667,800)` 中为 `[85,0,167,67)`。直框线只保留云头/云尾邻近短接段，已去除远端长直边框。输出窗口不变，按获批图宽度 1672→1280 的比例采样到 128×96；两端从同一源窗口取样，未为填满 128×96 另放大。
- `source/corner_cloud_layers.psd` 画布 1672×941，共三层：完整 v0.4 参考底层（PSD hidden flag=2，像素完整保留）、左下原位透明栅格层、右上原位透明栅格层（两层可见）。`bggg-creator-image2psd` 原生脚本只能写出可见参考层，因此另用 `source/hide_reference_layer.py` 设置底层隐藏，并把合成图替换为仅两角的深蓝底预览；`source/psd_full_canvas_layers/` 保留三个可直接叠放的全画布 PNG 图层。内部线条和蓝色云体仍是栅格，不能像矢量那样无损改变曲率；平面源图无法恢复遮挡下内容，没有背景补洞。
- `preview/panel_only_recomposition.png` 用 Client 现有 512×256 `tex_u04_dialogue_panel_9s.png`、四边 48 px 九宫格拼成 1280×195 的面板，再只叠本批两张 128×96 切片；这是同画幅组件静态重组，不含人物、场景或按钮。`preview/approved_position_reference.png` 是把角花叠回缩放后的批准整图，仅核相对位置；原角仍在底图中，不能当作还原验收。`preview/corner_exports_4x.png` 在深蓝底上四倍放大核边缘和意外混入。

## 验证边界

- 两张 PNG 均为 128×96 RGBA，源位层中非透明 RGB 已逐像素核对；原图副本 SHA 与批准图相同。PSD 可由 Pillow 读取为 1672×941，`image2psd` 输出摘要为三层并生成预览。
- 目视两角内纹完整；右上未见按钮蓝框，左下未见人物皮肤/衣物。`panel_only_recomposition.png` 的面板与两角叠序、方向和同画幅位置可核；源图提取的少量接框像素与九宫格金边存在抗锯齿差异。深蓝云体的边缘受平面图抗锯齿混色限制，不能声称具有原生透明母版精度。
- PSD 通过 Pillow 读取为 1672×941，ImageMagick 可识别三层；这不是 Photoshop 打开验证。当前静态重组只说明组件可复核。Creator 导入、面板伸缩、人物遮挡、同背景实际截图和目标平台由 Client/Tech 后续按任务核验，不能在 Art 交付中记为通过。
