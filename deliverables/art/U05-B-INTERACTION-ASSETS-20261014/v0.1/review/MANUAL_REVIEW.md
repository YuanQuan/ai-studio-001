# MANUAL-01 唯一人工候选 Art 实图自查

结论：**`REVISE / STOP`**。这是已获同批 Art/Tech 预签的一次手绘路径净底候选，不是最终资源或 Gate2 样张。完整画布仍为 1024×1536 RGB8/sRGB；源、路径、单通道 Mask 和产物哈希见 `source/MASK_REVIEW.json`。实际候选 `exports/STATIC_BARE_MANUAL01.png` SHA `54d0d41b06de0ecb509475b246a3f81236ba30a169bed551ef6e062fe789556a`；唯一 Mask SHA `bd5148f8369939fde38260461d844ec1f91ff5fad40c68ecfab8edf4f2d5e1b4`，1600 像素。三张 `review/manual_comparison_{window,rim,glass}_4x.png` 均为相同源坐标、最近邻4倍的四栏对照（旧原图／同源 donor／REP-02／MANUAL-01），用于同时定位失败旧影与未改自然纹理。

| 锚点 | 结果 | 实图证据 |
|---|---|---|
| 签认 Mask 外保持原图 | `PASS`（像素） | 与 REP-02 静底比较，Mask 外 RGB 改动像素 0。三处遮罩叠图为 `review/manual_mask_window_review.png`、`review/manual_mask_rim_review.png`、`review/manual_mask_glass_review.png`。 |
| 窗口旧幽灵及气泡尖消失 | `REVISE` | `review/manual_result_window_4x.png`：右下仍呈旧幽灵淡尾，局部手描复制没有覆盖完整半透明边。自然夜街树叶、远灯、砖面保留，不能直接将该区域全部候选差异视为旧物。 |
| 旧工作杯 rim 消失 | `REVISE` | `review/manual_result_rim_4x.png`：横木面仍见淡椭圆与局部竖痕；这一路径与低差异交集只有 34 像素，漏过旧杯沿的弱透明边。 |
| 旧玻璃轮廓消失 | `REVISE` | `review/manual_result_glass_4x.png`：台面仍见杯身侧线、底部弧形/暗影；三条路径交集共 70 像素，不能确认已清影。 |
| 身体/中性/闭眼/开心、代表离场 | `PASS`（既有 REP-02 局部预览） | 这些图未在 MANUAL-01 改动；REP-02 `review/REPRESENTATIVE_METRICS.json` 记录身体+中性与旧角色 RGBA 零差异、脸编辑区外零差异、0/40/80/150/225/300ms 脸序列及 x309→−72 真实 −381 位移。当前 `review/animation_representative.gif` 仍使用失败的 REP-02 静底，不能作为 MANUAL-01 成品回放。 |
| 完整资源/PSD/运行 | `NOT_TESTED` | 完整四脸、入场、三槽与12原料重组、新版 PSD、最终 GIF、Cocos 导入和实际设备画面尚未产出或测试。 |

`source/MANUAL_PATHS.svg` 保存八条原路径与笔宽；`source/MASK_REVIEW.json` 说明为何排除自然夜街/木纹。技术交集只选出 1600 像素，不能当作视觉已确认的充分证据。失败原因是手绘线和 4–11 通道差异相交后仍遗漏半透明轮廓，尤其杯沿和玻璃。REP-01、REP-02 与本候选均保留，不修改失败记录。

同一净底问题的默认自动修正两轮与额外一次手工候选均已停止。Art 不再调整此 Mask、降低阈值、扩大保护区、补做 GIF 或扩展 FULL；无 FULL 文字预签、无正式 PSD、无 Gate2。后续若改变工具方法和超出两轮上限，应由 Master 先处理用户轮次决定，并由 Art/Tech 对新批次同源/遮罩/尺寸/预算重新文字预签。
