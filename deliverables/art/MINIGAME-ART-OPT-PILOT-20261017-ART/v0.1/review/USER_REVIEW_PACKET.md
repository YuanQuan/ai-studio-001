# 10 件无损代表具体切片 Gate2 用户审阅包 v0.1

本包请求用户审阅**这 10 件实际裁片及静态效果**。上一轮“批准”已作为制作方案 Gate1 登记，并由 Art/Tech 对同一 `PREPRODUCTION_PLAN.md` SHA-256 `e2a2c7a74830c9929d7989964dc302537d198bafe5f5f96af4e7fde088312294` 完成首图前预签；该批准不替代本次 Gate2。本包不含全批扩张或客户端正式接入。组织 Agent 自行切图，按现行规则由 Owner 核文件、真实层和重组后直接送用户审核。

## 看图入口

- [`contact_sheet.png`](contact_sheet.png)：10 件切片及奶茶 body+sign 原位置重组，方便浏览。**各格经过 fit 缩放，不代表游戏实际显示尺度**；实际裁片均保持表内原像素尺寸。
- [`shop_01_body_sign_recomposition.png`](shop_01_body_sign_recomposition.png)：1024² 原位置重组，保留蓝瓦、暖灯、右悬杯以及原招牌零星可见边缘像素。
- [`scene_flame_detail_source_vs_new.png`](scene_flame_detail_source_vs_new.png)：左为原火焰、右为新裁片回置源画布后，在获批樱花 v0.3 PSD 背景、相同 ROI 和同一原场景实例尺寸下的静态投影。全场景两版在 [`scene_flame_same_scale_source.png`](scene_flame_same_scale_source.png) 与 [`scene_flame_same_scale_new.png`](scene_flame_same_scale_new.png)。这不是 Creator 运行截图。
- `background_comparisons/`：每件原图与新裁片回置图按原尺寸在黑、灰、白相同背景上并列；`recompositions/` 保存 10 张独立原尺寸回置图。
- [`sample_review_bundle.zip`](sample_review_bundle.zip)：本页、10 件实际 PNG、总览与重点重组图、准确清单及比较 JSON 的便携审阅包；PSD 母版另以源文件提供。

## 版本和结果

|范围|本次实产|
|---|---|
|奶茶|`tex_mt_shop_01_body.png` 749×624；`tex_mt_shop_01_sign.png` 93×200|
|游客|`tex_ug_ghost_01_walk_00.png`、`run_00.png` 各327×359；`happy_01.png` 343×338、`happy_03.png` 315×395；`sad_04.png` 354×322、`sad_05.png` 355×321、`sad_06.png` 354×323|
|火焰|`tex_sakura_rr_spirit_a_flame.png` 92×94|

10 件源 PNG 合计 2,474,501 字节，新裁片合计 1,449,436 字节，文件体积减少 1,025,065 字节（41.43%）；这只是 PNG 文件字节差，**不等于 GPU 内存、包体或帧率收益**。10 件完整源/新 SHA、bbox+2px、`originalSize`、`offset`、`pivot`、计划 Client 路径与真实 PSD 图层帧号均在 [`CUT_MANIFEST.json`](../CUT_MANIFEST.json)。`walk00` 与 `run00` 虽同 SHA，仍分别保留动作 ID、资源 ID 与导出文件。

[`source/optimization_pilot_master.psd`](../source/optimization_pilot_master.psd) 是 3072×2048、10 个真实栅格层的多资产资源库母版，SHA-256 `f123f00d52b5ef9ae66028d3de395d312111a2477cc2a388f9cf9a6e0ed2a00c`；其整体预览不是单件游戏画面。`PSD_LAYER_EXPORT_MAP.md` 记录旧 PSD、层来源和可编辑范围。游客原生旧 PSD 缺失，所以本版七帧是原像素独立栅格层；火焰取获批原 PNG，未把场景缩放实例冒充源层。

[`COMPARISON_REPORT.json`](COMPARISON_REPORT.json) 记录从**真实 PSD 层**反向取回原画布、导出裁片、回置源画布的逐件核验：10/10 件最大 alpha 差 0、可见 RGB 差 0、变化像素数 0；黑/灰/白背景差均 0。奶茶 body+sign 原位重组与原两张现行源可见 RGBA 零差，火焰在现行场景背景与原实例尺寸的静态投影也零差。Art 目视复核蓝瓦暖灯、悬杯、游客表情轮廓及弱光火焰未出现新视觉偏移；招牌原有小边缘像素保持原样。

## 审批边界

请只决定本包 10 件具体裁片及所附静态同尺度效果是否通过 Gate2。批准后 Client 才能按已批 Tech 方案接入确切文件；未来全批扩张另行复签/送审。当前未导入 Cocos，导入后实际 UUID（可能沿用现值）、真实动作接缝、镜像、遮挡、运行画面、性能及平台包体均 `NOT_TESTED`；静态零差不能代替这些验证。
