# U01 场景图 v0.6｜具体切片用户审核

本版采用已确认的 **3072×1024** 画幅，正式母版与五张切片均已落盘；本包请求审核具体资源效果，尚未接入客户端。

![U01 五层同尺度重组](review/overall_from_psd.png)

五张实际 PNG 切片（均为 3072×1024 RGBA）：[L01 天空](exports/tex_street_base_01_l01_sky.png) · [L02 远山](exports/tex_street_base_01_l02_mountains.png) · [L03 后岸街道](exports/tex_street_base_01_l03_ground.png) · [L04 河水与桥](exports/tex_street_base_01_l04_water_bridge.png) · [L05 水前水草](exports/tex_street_base_01_l05_water_grass.png)。[五层 PSD 母版](source/u01_five_layer_master.psd)保留独立图层。

![静态手机视窗：左、中、右](review/portrait_viewports.png)

视窗图为按画高等比缩放后截取的左、中、右三个 390×844 静态视窗；它不是 Cocos 运行或视差截图。零位同尺度重组与 PSD 合成逐像素一致。河水位于前景、街道位于后岸，L04 河底连续，L05 仅放水前草。未对无全域遮挡证明的区域做透明裁减。

版本与来源：本版是 [v0.5 的 3072 候选](../v0.5/review/candidate_3072_overall.png)同字节正式整理，没有新生图或视觉改动；原始生成中心源为 2172×724（L01 为 2173×724），本版按高等比采样为 3072×1024。PSD SHA-256 `cb6dd00c…cb49ccac`；总览 SHA-256 `b6192061…57ee51da`。逐层完整哈希、来源和计划客户端路径见 [切片清单](CUT_MANIFEST.json)，核对结果见 [文件检查](ART_FILE_CHECK.json) 与 [视觉锚点](VISUAL_ANCHOR_CHECK.md)。

请审核这份具体 PSD、五张切片及重组效果。客户端正式导入、UUID、运行画面和性能仍未测试，需本版获得用户批准后进入接入阶段。
