# PATCH-03 唯一候选 Art 失败交接

结论：**`REVISE / STOP`**。本文件只归档已完成候选和当时已报告的检查事实；不代表新的制作或复核，不作 FULL 文字复签，不提交资源 Gate2。

同批 Art `ART_PRESIGN_PATCH03.json`、Tech `TECH_PRESIGN_PATCH03.json` 及 `TECH_BUDGET_RELEASE_PATCH03.json` 先于唯一候选实存。候选 `exports/STATIC_BARE_PATCH03.png` SHA-256 `3c70ed0096fcac5d649117eb57328a2ee116f44a0a554a5063450299624845b6`，从 MANUAL-01 静底 SHA `54d0d41b06de0ecb509475b246a3f81236ba30a169bed551ef6e062fe789556a` 出发，仅在用户批准的三框同坐标取同项目 donor SHA `4062dfb0dc46cf17dea20b93478e9712ded98c057d8246c0f6c5221318b5c6af` 的 RGB8 像素。三框为窗口 `[305,489,406,294]`、杯沿 `[418,1090,185,40]`、玻璃 `[440,1220,136,108]`，合计 141,452 像素。`review/PATCH03_METRICS.json` 当时记录各框实际变化像素为 36,349／558／674；三框外相对 MANUAL-01 RGB 变化像素 **0**，三框内相对 donor RGB 差异像素 **0**，本轮 `image_gen` 调用 **0**。

Art 当时已看源尺度全图、三个局部 4 倍图、含框外 8 源像素的边缘放大图及 360×640 空窗、停靠中性、开心离场预览。窗口内旧幽灵/气泡和三框内部残影在此检查中不再明显，但边界图 `review/patch03_cup_rim_edge_3x.png` 左框外仍见旧杯垂线，`review/patch03_cup_glass_edge_3x.png` 左侧/下部仍见杯身或底缘残线。它们位于已批准整体替换范围之外；框外零差异只证明没有误改，**不能证明残影清除成功**。按已签停止条件，不能扩框、羽化、沿线补第二候选或把净底判 PASS。代表动画只做了静帧观察，完整新 GIF、失落与完整入场、全组件同尺度重组、PSD 均未在本轮生产。

本轮候选制作及实图检查从 **2026-10-14 08:57:54 UTC** 开始，到 **09:00:03 UTC** 核时，约 **129 秒**，超过 Tech 对本唯一候选设置的 **120 秒硬上限约 9 秒**。此超时已如实报告 Root；不能把超时段改称等待或宣布代表验收通过。Art 在核时后立即停止图片工作。旧 REP-01、REP-02、MANUAL-01 候选与本唯一 PATCH-03 候选原样保留；无 FULL、PSD、Gate2 或 Client 导入结论。
