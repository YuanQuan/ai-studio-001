# U04 分层美术制作记录 v0.1

## 来源与方法

孟桃 0 魂只读源为 `deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_mt_s0.png`，原图 SHA-256 `6bd4cccdac4351ccda863d7df4a5f079727fc38a2614e559b827b74f7d330ecb`；本批副本 `source/approved_original_mt_s0.png` 字节同源。当前 U00 静态场景使用 `deliverables/art/SCENE-CLARITY-REDRAW-ASSET-20261010/v0.3/review/current_shops_on_v03_scene.png`；U04 v0.2 imagegen 预览的背景像素未进入本批。对话框深夜蓝/暖金几何框由可编辑形状生成，云纹固定装饰独立导出。静态示例文字临时用本机 STHeiti 字体渲染成 review PNG，字体文件未复制或嵌入游戏；正式字体许可与选择另行核。

原图 1024×1536 的 alpha 内部最高为 254，外轮廓有低 alpha 暗红软晕。`source/mt_s0_clean_edge_work.png` 保持批准源 RGB，局部清除离主体 alpha≥245 区域超过 4px 的 3421 个低 alpha 外晕像素；棋盘/深蓝底人工看发丝、衣装、奶茶与轮廓。脸底采用支持批次 `U04-DIALOGUE-FACE-SUPPORT-001/v0.1` 的同原图坐标肤色候选 RGB 与语义蒙版，叠入本批清边 alpha；修改遮罩以外 RGB 不动。支持源的实改 RGB 23,817 像素，边界框 `(408,140)-(595,326)`，详见其 `PROCESS_NOTES.md` 与 `pixel_diff_summary.json`。支持前发层只取批准原图发丝 RGB，主 Art 实际复合时置于表情之上；脸底与前发保留可编辑 PNG。眉眼轮廓从原批准五官局部取色与笔触，另外四种嘴部在同色系透明层按情绪定向绘制；微笑眉眼嘴为批准原像素局部重组。

曾对局部与整图调用 imagegen 试图去五官，生成候选改变脸型/比例或保留暗晕，全部拒用。拒用参考 `source/rejected_imagegen_blank_face_candidate.png`；早期椭圆补洞 WIP1–WIP6 存在肤色硬边、暗残线、侵入刘海，均未进入现行基底。Swift Vision 前景提取在本机模块缓存编译失败，未计通过。最终没有采用整张 imagegen 回填；未改区维持批准图像素，改动范围与方法可从支持批次脚本/蒙版及本批导出映射复核。

PSD 由 `bggg-creator-image2psd` 的 assemble 写入，原脚本的 `visible:false` 会跳过整层。为保留四态真实可编辑 alpha，使用 `source/image2psd_hidden_adapter.patch` 在临时副本上增加 PSD hidden flag 写入与合成跳过；原 skill 脚本未修改。母版里隐藏的 `REFERENCE_APPROVED` 为原图栅格参考；默认只显示 `SMILE`，切表情要同时关闭原表情三层、打开目标三层。输出 `PSD_VALIDATION.json` 直接解析 PSD 18 层可见标记，确认 13 隐/5 显；图像本身不是矢量或原画天然可编辑分色。

九宫格静态 3 尺寸角区像素比较通过，U00 1280×720 为物理画幅视觉样张，当前工程 720×1280 FIXED_WIDTH 横屏坐标、长文本、图集/内存、Sprite.Type.SLICED、实际运行仍未测。Gate2 用户审核前不进入 Client 正式资源。

## 主 Art 其余五阶段生产记录

孟桃2/3魂、阿棠0/2/3魂均以各自已批准1024×1536原图副本为唯一外形、衣装、发型与职业物来源。`source/pipeline/u04_prepare_stages.py` 检查源和 alpha 软晕后形成清边候选；`u04_batch_clean.py` 对每阶段单独选可信皮肤采样区、脸轮廓、旧五官遮罩和前发区域，输出同原坐标脸底/前发，`u04_batch_expressions.py` 从本阶段原图提取眉眼笔触并单独绘制目标嘴型。脸区参数逐阶段校准，阿棠2魂嘴中心纠正至原图 y约324；孟桃2/3右眉保持批准源笔触，避免形变越过前发。上述算法不把孟桃0魂的坐标机械用于阿棠。

可复核证据为 `source/main_batch_pixel_diff.json`：五组分别修改脸部 RGB 24,116、23,939、19,194、19,123、22,366 像素；改动区外 RGB 均为0差；alpha 清晕分别改2,239、2,710、3,423、2,519、6,689像素，获批原始PNG自身未改。`source/main_batch_layer_export_map.json` 给各阶段不同脸片原坐标、pivot、半身裁剪与前发裁剪。`source/main_batch_psd_validation.json` 解析每份PSD各18层，默认五层可见、13层隐藏，含已批准源参考；每态导出基底+脸片+前发与同原坐标分层复合逐通道0差。此为**静态结构核验**，视觉仍以同尺度实际图检查，不宣称引擎导入通过。

孟桃2/3及阿棠0/2/3的`review/<阶段>_five_expression_wip.png`保留了制作中五态板；对应最终层的`review/u04_<阶段>_psd_preview.png`是母版默认态，`review/<阶段>_u00_static_<情绪>.png`把本次切片叠到U00现有场景实素材与独立九宫格之上。审图需用最新PSD/重组版本，早期WIP接缝和旧五官候选不计交付。其它两制作单元的独立来源、哈希和整合记录见下节与总清单。

## 六店长全量整合与审核画幅

支持 B 阿炭/阿角六阶段来自 `deliverables/art/U04-DIALOGUE-ACAJ-BATCH-001/v0.1/`，支持 C 阿灯/小锦六阶段来自 `deliverables/art/U04-DIALOGUE-ADXJ-BATCH-001/v0.1/`。主 Art 按各批 `ASSET_MANIFEST.json` 和 `LAYER_EXPORT_MAP.json` 的 SHA 将 PSD、base、front、90 张五官源层及 60 张脸片字节复制到主目录；逐文件原/目标 SHA 见 `source/integration_acaj_copy_log.json` 与 `source/integration_adxj_copy_log.json`。两个原批次目录保留，包括各自失败候选、自检和审图。主 Art 孟桃/阿棠其余五阶段连同首图构成六阶段；总计 18 份 PSD、270 张眉/眼/嘴透明源层、18 基底、90 局部脸片、18 前遮挡。

正式 18 份 PSD 均默认 **SMILE** 的眉/眼/嘴三层与 BASE/FRONT 可见，其余四态及获批原图参考隐藏。阿棠0魂源图的原表情偏悲伤、阿棠3魂源图原表情偏高兴，这仅是提取五官笔触的来源基准；正式 PSD 默认显示已改为 SMILE，绝非把其它态冒充默认。`PSD_VALIDATION.json` 直接解析各 PSD 标志并逐组列默认 SMILE；`source/main_batch_psd_validation.json` 和对应母版均已同步。五官是独立 alpha 栅格源层，非整图轮播；每阶段脸区/前发位置逐组校准。主目录正式输出以 `ASSET_MANIFEST.json` 精确枚举，不将 WIP 或拒用候选计入 90 张。

`review/all_90_combinations.png` 从 90 个经核的导出层重新组合，以每组脸片实际画布宽度的 1.5 倍取等比例人脸审图区域，标签在图外，保证嘴与下巴可见；总板是比较图，不改变 PNG。`review/u00_dialogue_overview.png` 则从正式 base＋SMILE＋front 和现有 U00 背景同一坐标静态重组六位店长，统一面板、文本和三轴控件；只在展示时按源人物 alpha bbox 上方约 67–72% 裁至腰部、可见高 500px，逐格精确 rect 和背景 SHA 在 `review/u00_dialogue_overview_sources.json`。此展示用语义裁切不是正式导出 PNG 裁切，也不是运行截图。现有设计分辨率、横屏实际 Cocos 视窗/字体/文本/性能仍需 Client 后续验证。
