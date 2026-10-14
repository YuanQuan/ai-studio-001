# REP-01 首样 Art 自查（Rev 0）

状态：`REVISE`；不能据此进入 FULL。已签 Gate1 + 原 Art/Tech 首图文字预签下制作首样，所用新生成调用 0。REP-01 原图片、GIF、遮罩和 metrics 已逐文件保留于 `review/history/REP01/` 的 `exports/`、`review/` 和 `source/`，第二轮不会覆盖这些历史副本。这是第一轮代表检查，不冒充最终资源 Gate2。

| 视觉锚点/检查 | 结论 | 实测证据与原因 |
|---|---|---|
| 原 B 蓝瓦、木柜、夜景、台面非残影区域 | `PASS`（像素范围） | `review/history/REP01/review/REPRESENTATIVE_METRICS.json`：`STATIC_BARE` 在实际精细遮罩外 RGB 差异像素 0；本轮遮罩 18,372 像素。 |
| 空窗、气泡白尖与空台面 | `REVISE` | 首样局部补底改善大部分残影，但窗口顶部/右缘有细碎线，杯沿上下边残留明显黑线与左右角；实图见 `review/history/REP01/exports/STATIC_BARE_CLEAN.png`。残影坐标超原目测诊断界，精确修订及停止条件见 `REP_ROI_REVISION.md`。 |
| 中性角色身份、身体和头身比例 | `PASS`（静态像素） | 身体+中性脸 332×301 RGBA 重组与旧 `CUSTOMER_GHOST.png` 全 RGBA 0 差异；脸编辑遮罩外 RGBA 0 差异，支点源 `(475,785)`。 |
| 眨眼/开心、身体与脸同步、450ms 完整离窗 | `REVISE`（相位）；几何位移可检 | `review/history/REP01/review/animation_representative.gif` 12 帧、360×640 contain，x309→−72 的末帧完整离窗，气泡离场开始收；但采样在 80ms 才压眼、150ms 才闭眼，晚于已批时序。`REP-02` 应改 0/40/80/150/225/300ms 关键采样。具体 Cocos 运行仍 `NOT_TESTED`。 |
| 面部在 360×640 与既有角色风格吻合 | `PASS`（代表实图） | `review/history/REP01/review/representative_sheet.png` 和 `review/history/REP01/review/rep_t300_happy_x309.png` 可见双眼弧线及笑口；只改脸内眼口，不改轮廓、躯干和颊色。 |
| 客户端导入、真实 Web 运行、GPU/内存 | `NOT_TESTED` | Gate2 前不接入；此处静态回放不代替真实运行。 |

Art 下一步仅在同批 Tech 对 `ROI-REV1` 复签后，按修订的同一残影细遮罩重做净底，并对同背景、同视窗、同尺度的净底和动画复核。新净底仍有残线则停诊断；全部代表锚点合格后才送 Tech 生产格式检查及 FULL 文字复签。
