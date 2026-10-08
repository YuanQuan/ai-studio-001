# U01 S02 代表样张｜首图预案补充 v0.2

状态：**下一次 imagegen 调用前待 Art/Tech 对本文件同一 SHA-256 复签**。原 `PREFLIGHT_PLAN.md` SHA-256 `bc960467c2ad3d35a16ec7fb7ba3e576e7a36dba55ec590cc1f93fa19a206e34` 保留。Gate1 已确认画幅、风格、五层内容与视觉锚点均不变；本补充只调整 imagegen 的输入画布准备与 S02 验证方法。S01 失败样张、提示词和 Art/Tech 样张结论完整保留。

## S01 触发事实

`source/sample_complete_s01.png` 由内置 imagegen 以旧 2172×724 合成图作引用输出，实际仍为 2172×724 RGB，SHA-256 `3cc1e03883cb1712282aea4ada33ec4576b770e46514f9b526abb4953b295b52`。Art 逐锚点检查判 `REVISE`：主体方向基本保留，但新画幅和左右延路缺失；Tech 同图检查亦判 `REVISE`。不将旧尺寸 S01 拉伸、裁切或留空作为正式 3840×1024 成品。

## S02 唯一补充路径

1. 用已核原版 `bggg-creator-image2psd/scripts/image2psd.py assemble` 在本任务 `source_build/s02_reference/` 制作**仅供 imagegen 输入的参考画布**。manifest 固定 `canvas.width=3840,height=1024`，唯一图层文件为当前新样张 `source/sample_complete_s01.png`，`fit="contain"`、`x=384`、`y=0`、`remove_background="none"`。此工具的 `contain` 将 2172×724 按相同倍率映射为 3072×1024，`place_on_canvas` 再从 x=384 放置，左右保留各384透明像素；导出的**全画布 RGBA 单层 PNG**作为 S02 编辑输入。`assemble` 所写临时 PSD/预览只证明原位参考构图，不是正式五层母版，也不称为新高分辨率细节。
2. 用 `view_image` 实看该 3840×1024 RGBA 参考和 S01。调用内置 imagegen 的编辑方式，以此**准确宽画布**为目标，明确要求：在左右两个透明带实绘连续的石路、栏杆、水岸、柳林、山水背景；重绘中央桥石、路缝、柳叶、水纹等近景细节，不能只插值；保持月、桥、灯船、右牌楼与空白牌面的位置、身份和冷蓝暖灯风格；无人物、挂件、文字。`transparent_background=false`，输出完整不透明场景。每次调用保存原始结果、实际尺寸、prompt、输入角色与 SHA。
3. S02 实际输出**必须**为 3840×1024，且经 Art 实看左右延路完整、中央细节确有新绘、主体锚点不漂移；Tech 对同一输出核尺寸、目标视窗、可分层性和预算。若内置 imagegen 仍强制输出 2172×724 或其它无法满足已确认画幅的尺寸，记录失败并停止，不再无尽重试，也不通过 `stretch/cover/contain` 充当正式画面。未双结论通过前不得抽五层或制作正式 PSD。

此补充不改变来源权利、最终五层 PSD/PNG、L04 补底/L05 独立、连续域透明规则、75 MiB 基础展开估算或 Gate2 用户审核方式。参考画布含旧 S01 的比例放大只服务于 imagegen 扩绘输入，不能在最终图中作为未经重绘的低清晰底层交付。
