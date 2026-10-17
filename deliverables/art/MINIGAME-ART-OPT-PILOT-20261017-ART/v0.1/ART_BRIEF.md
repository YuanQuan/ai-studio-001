# 10 件无损代表 Art Brief v0.1

本批把已获准的 10 件现行 RGBA 图片按 alpha>0 边界加 2px 保护边裁成较小纹理，同时以真实 PSD 图层保存可追溯母版。视觉目标是零改动：蓝瓦暖灯奶茶店与悬杯、奶白蓝线游客的表情/动作极值、青蓝弱光火焰及莲座关系均继承原批准像素。新裁片只减少透明画布；不得清理招牌原有零星可见边缘像素，也不绘制、调色、重采样或合并动作语义。

用途为本轮具体样本 Gate2 审阅。当前适配对象是 Cocos Creator 3.8.8 工程，但新图尚未导入；预期由后续 Client 按获批 Tech 方案处理 `originalSize`、`offset`、`pivot` 和 `trim=false`。本轮 Art 不改工程、Prefab、`.meta` 或运行代码。

输入身份、确切裁框、预签与预算见同目录 `PREPRODUCTION_PLAN.md`、`ART_PRESIGN.json`、`CUT_MANIFEST.json`。制作工具为 `bggg-creator-image2psd` 的 `assemble`、Pillow 11.3.0 与 ImageMagick 的 PSD 层读取；生成调用 0。源图及旧 PSD 只读。资源库 PSD 有 10 个独立栅格层，3072×2048 仅用于整理，绝非游戏运行纹理或单件整体效果图。

验收分两部分：本次提交可复核的 PSD 真实层→原画布→裁片→回置原画布零差，以及在相同背景/尺度的静态审阅图；具体切片与效果仍由用户 Gate2 判断。Creator 实际导入、运行画面、动作接缝、性能与导入后实际 UUID 均 `NOT_TESTED`，UUID 可能沿用现值。总览图每格为便于查看而缩放，不代表游戏实际显示尺度。
