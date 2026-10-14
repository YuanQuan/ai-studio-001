# U05 B 残影手工定向修订工艺 MANUAL-01（仅文字与路径，待同批 Tech 复签）

Master 已根据本轮已批准的本地确定性局部编辑范围，授权在自动两轮停止后进行**一次手工确认 Mask** 的定向修订。它不是第三次阈值自动重试；本文件和 `source/MANUAL_PATHS.svg` 是首图前可检查的技术路径，尚未导出新的正式资源图。原 Gate1 的同对象、同源、同视觉锚点仍生效；REP-01/REP-02 失败样张和复盘保留。新批号 `U05-B-INTERACTION-ASSETS-20261014/v0.1/MANUAL-01`。

源图固定：v0.2 `STATIC_BARE.png` SHA `f0aada4dc35c80930a034a14f228a6012e59b783f93f342899ccf00251af4c34`；REP-02 结果 SHA `2160dd5789174154304e49d3a6fd4230a095bcf1e3777caf4db1f939d3e179c9`；历史同项目净底 donor SHA `4062dfb0dc46cf17dea20b93478e9712ded98c057d8246c0f6c5221318b5c6af`。三列真实局部对照为 `review/diagnostic_window_comparison.png`、`review/diagnostic_rim_comparison.png`、`review/diagnostic_glass_comparison.png`。donor 在对应位置已没有幽灵、气泡或杯轮廓，残留成因是 REP-02 差异阈值 12 排除了低对比旧影。着色候选差异图仅用于找线，不全量照单复制；窗口中非物件的树叶/房灯自然差会排除。

## 人工路径与像素保护

`source/MANUAL_PATHS.svg` 在 1024×1536 源坐标手写 8 条 Bézier/线段描边，明示每条的对象、控制点与笔宽；只描旧幽灵头身边、杯 rim 椭圆、玻璃左右和底缘。窗口路径刻意不覆盖夜街中央树叶、路面砖与远处灯光；杯路径不覆盖圆形木纹、中央木板、台面导线及可保留的木纹变化。SVG 用于让 Art/Tech 在出图前检查边界，**不是可直接贴进游戏的美术图**。

落地时以本 SVG 栅格化为一个 1024×1536 的候选单通道 Mask，再与三个已签诊断外接界及 REP-02/同源 donor 的剩余 4–11 通道差异求交。Art 在放大对照上逐条检查交集，仅保留可见旧物件边缘；将确认后的 Mask 与每条保留/排除说明一起存 `source/mask_residual_confirmed.png` 和 `source/MASK_REVIEW.json`。自然街景与木纹即使有 4–11 差异，也不因阈值命中就复制。签认后的唯一 Mask 只用于一次输出，不自动修改宽度、控制点或阈值重试。

仅在确认 Mask 内，把同坐标 donor 的 RGB8 原像素复制到 REP-02 静底；外部 RGB 差异必须 0。比较管线为 Pillow/Numpy、1024×1536 RGB8/sRGB 原值，直通颜色不缩放；视觉核 4 倍局部、完整 1024×1536、360×640 contain 下的夜街连续、木纹和零杯/幽灵残影。只重算净底和代表重组/GIF；已通过的身体+中性/闭眼/开心源图保留同 SHA，不做失落或全入场，直到代表 Art/Tech 实核并作 FULL 文字复签。

本人工修订只允许**一套 Mask、一次新候选、无自动修正**。人工制作活动最多 15 分钟，并继续计入原代表 45 分钟、全批 75 分钟上限；执行时取更低的实时剩余。内置 image_gen 调用 0，工具费用/GPU 遥测仍 `UNKNOWN`，无新依赖、无 CLI/API/key。若视觉仍留旧影、自然木纹/夜街被破坏、Mask 外像素变化，或超活动预算，立即停止、保留失败稿并报 Master，不再自行扩大路径或换生成工具。因本轮改变了具体修补方法，首张 MANUAL-01 输出前必须由 Art 与 Tech 对同批源/路径/Mask/格式/预算文字复签；此文为 Art 制作方法签认，Tech 复签待实存。
