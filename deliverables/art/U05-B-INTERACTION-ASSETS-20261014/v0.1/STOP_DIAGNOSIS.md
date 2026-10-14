# U05 B 局部净底第二轮停止诊断

结论：REP-02 的剩余痕迹来自本轮差值阈值漏掉了**低对比的旧轮廓像素**，并非历史同源隐底候选本身仍画着幽灵或杯。窗口和台面三列放大对照分别见 `review/diagnostic_window_comparison.png`、`review/diagnostic_rim_comparison.png`、`review/diagnostic_glass_comparison.png`：左为 v0.2 静底，中为历史同源隐底候选，右为 REP-02。中列的窗口尾影和台面杯沿已消失，右列仍有淡影。对 REP-02 与 donor 的 4–11/通道差异着色图见 `review/diagnostic_window_tail_candidate_delta_4to11.png`、`review/diagnostic_rim_halo_candidate_delta_4to11.png`、`review/diagnostic_glass_candidate_delta_4to11.png`。这些图是定位候选差异，不等于经过人工确认的最终修补 Mask。

REP-02 的确定性方法先取每像素 RGB 最大通道差 ≥12 的位置，再仅在同批签认的三个诊断界内扩 2 个四邻域像素并复制 donor。因此 ≥12 的明显物体线已消失，但距离已修区域较近的 4–11 级淡影未全入 Mask。窗口尾区 `(600,690)–(711,783)` 的低差异候选 3,813 像素，杯沿区 `(418,1090)–(603,1130)` 为 312，玻璃区 `(440,1220)–(576,1328)` 为 466；各区最大剩余通道差为 11/10/10。**4,591 是候选差异总数，不能全部等同残影像素**：窗口中部分低差异属于 donor 与原夜街背景的细微自然差，不能直接把这些点全贴回。真正需要修的像素必须由 Art 沿可见旧幽灵尾、杯沿椭圆和玻璃边逐点圈定，保持街景/木纹原像素。

REP-01 在更窄目测界留下高对比碎线，REP-02 把诊断界校准到实际对象范围后已消掉高对比线，剩余淡影可在放大图辨认。两轮均未调用生成工具，未改旧 PSD/冻结资源，旧首样位于 `review/history/REP01/`；REP-02 见 `review/REP02_REVIEW.md`。Art 判净底 `REVISE`，故新版 PSD、完整组件重组、失落脸/完整入场和 Gate2 均未制作。不得以差异最大值 11 很小为由自动宣称视觉通过，也不能简单降低阈值后把夜街自然差一起替换。
