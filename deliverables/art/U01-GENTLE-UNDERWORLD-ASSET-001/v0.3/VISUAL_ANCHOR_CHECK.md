# U01 v0.3 视觉锚点核对

| 锚点 | 结果 | 实际证据与边界 |
|---|---|---|
| 原月夜、柳、桥、河、灯与右牌楼 | PASS | 原 PSD 四层逐像素相同；`source_build/build_validation.json`、`review/overall_from_psd.png`。 |
| 两盏孔明灯、引魂幡温和非恐怖 | PASS | 米橙低亮纸灯、月白短幡，不含怪物/血/骷髅/符咒；`review/local_detail_board.png`。 |
| “黄泉路→”“奈何桥”“酆都城”位置和文字 | PASS | 路牌箭头向右、桥牌在两灯柱间且保留拱洞、右字片收在原木匾内；局部板和独立 PNG。字符路径由 Art 原创，实际手机阅读还需用户判断。 |
| 六件独立后移位能力 | PASS（美术源） | PSD 按稳定 ID 独立分部层；六张 RGBA 全画布单件切图；`PSD_EDITABILITY_REPORT.md`。运行时节点尚无。 |
| 五比例静态极限与露底 | PASS（静态投影） | 30 张 `review/viewports/` 均合成 alpha 最小 255；`source_build/viewport_validation.json`。左侧幡/路牌与远灯在横移途中出现，极端视窗不要求全部可见。 |
| 悬浮控件遮挡与实际 Creator/目标设备 | NOT_TESTED | 本轮没有 UI 控件叠层或 Creator 构建/运行；美术投影不能替代接入后验证。 |
