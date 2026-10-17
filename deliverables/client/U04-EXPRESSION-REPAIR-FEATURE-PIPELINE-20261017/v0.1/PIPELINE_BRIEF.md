# 表情透明五官提取支持说明

本支持工具处理已存在的单态候选图：保持 Art 给定的 256×256 源脸 ROI、语义范围和底图/前发顺序，只把候选像素通过 Art 提供的 union mask 提取为透明新 oneface，并拆成六张栅格语义层。旧表情 oneface 仅作来源记录，不参与新合成；脸部几何和候选锚点不由工具移动或变形。

## 本次 AT_S0 实际运行

- 候选：`deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.1/candidates/at_s0_sad_imagegen_01.png`，1254×1254，源模式 RGB，SHA-256 `284af40cb10421c96c800dc814fee0f62e6683ac1484c30f20ee47936fc79176`。
- Art v02 定义与 mask：`deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.1/resume_20261017/AT_S0_SAD_FEATURE_MASK_DEFINITION_02.json`；mask `at_s0_sad_feature_mask_02.png` SHA-256 `198b659fb66b6ec5df084072ca17072aad4b44ca859342617f7fe7b388ee093c`。
- 最新不可变输出目录：`review/AT_S0_SAD_feature_extract_04/`。六语义层按顺序以 alpha_composite 重组后与 oneface RGBA 差异 0 像素；脸 ROI 内 union mask 外相对 base+front 差异 0 像素。union mask 中 1 个非零 alpha 像素落在由 JSON 多边形重栅格化的 feather 覆盖外，按最近多边形质心确定性归入语义层；union mask PNG 仍是提取 alpha 的唯一来源。
- 1280×720 同背景图：使用全身 `at_s0_clean_face_integrated.png`、新 oneface 放置在 `(380,180)`、全身 `at_s0_front_hair_integrated.png`，随后按旧 `u04_main_u00.py` 从 `(0,0,1024,850)` 裁切、Lanczos 缩至 614×510 并放置于 `(-55,210)`。图 SHA-256 `5ddd31524d502daf8f44978e1cb1de41a5dd10ba400dcf5162ba917e4e2b4bd3`。Art 已报告候选视觉 PASS，Art 与 Master 均实看反馈接缝消除、身份保持；Tech 独立核验全源 ROI 外差异为 0。工具不输出审美 PASS，也不替代正式资源审批。
- Art 已使用该透明 oneface 制作独立 PSD `deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.1/source/u04_at_s0_expression_repair.psd`（SHA-256 `8f864a57b42ccda169431ee279bb5288918cc64faea005521a23bce24b86a556`）。只读检查器确认 Pillow 合成预览可读，24 个顶层图层中 6 个新 SAD 特征可见、15 个旧表情层隐藏、base/front 可见、参考图隐藏；Art 报告 PSD 与同尺度 oneface 复合差异最大 1/255。

## 运行与边界

新增 `extract-features` 只接受 JSON 定义中的候选 SHA、Art mask SHA、256×256 ROI 和语义多边形。候选以等比例 Lanczos fit 归一；不平移局部五官、不制作新表情、不使用生成图的整块皮肤矩形。输出目录必须不存在；输入、几何与解码检查先完成，文件写入同级临时目录，成功后才原子改名。失败不会留下最终目录，也不覆盖旧文件。

测试包含真实 AT 候选与 mask、语义层逐像素重组、ROI 局部 mask 外差核、坏 base 路径与非法 ROI 拒绝且不产生输出，以及新 PSD 的 Pillow composite 读取和顶层可见 flag 解析。检查器解析不能替代组内嵌套行为与原生笔画可编辑性的验证；本 Client 支持任务没有生成 PSD、导入正式客户端或制作新图。旧 PSD / exports、`apps/client` 和旧 Task 源码均保持不改。

六张语义 PNG 是可移动的 raster layer，不是原生笔刷/矢量笔画。底图与前发导出映射若尺寸不同于源矩形，恢复会重采样；重采样不是无损源像素恢复。`recomposed_source_canvas.png` 按 LAYER_EXPORT_MAP 将 base/front 导出贴到其源矩形，未覆盖源矩形外的整身像素；完整角色同尺度检查请看本次 1280×720 图。最终 PSD 应仅显示新的 SAD 组，并隐藏旧五态表情层；当前工具可解析 PSD 顶层 flag，不能证明组内嵌套行为或原生编辑能力。
