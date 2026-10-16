# r3/r4 眼睛像素差分调查记录

Master 对 r3 定时截图的像素差分包围盒测得 34×34，r4同视窗仍观察到相同方形差分。该包围盒描述的是两时点所有变化像素的范围，不足以单独证明 overlay 的 UITransform 尺寸错误。对应截图/差分证据在 `deliverables/master/EXAMPLE-INTEGRATION-20261016/v0.1/evidence/r3-eyes-0.png`、`r3-eyes-1.png`、`r3-eyes-2.png` 和 `r3-eyes-diff.json`；r4稳定截图亦由 Master 留存。

为排除初始化覆盖，r4 把 `transform.setContentSize(99,54)` 移至 `sprite.spriteFrame = frame` 之后。随后r6在浏览器实际日志中确认配置完成和首帧两处都为 overlay contentSize 99×54、scale 1×1；父 contentSize 1536×720、scale 1×1；亮层 SpriteFrame UUID 为 `102e97c1-0e8b-4068-9354-1747e2287596@f9941`，rect 94×49、originalSize 99×54、sizeMode CUSTOM、trim false。完整运行日志记录在 `deliverables/master/EXAMPLE-INTEGRATION-20261016/v0.1/evidence/r6-eye-diagnostics.json`。因此此前差分框是调查线索，不作为 overlay 尺寸失败结论；最终画面仍以 Master 对 r6 的实际视觉复核为准。
