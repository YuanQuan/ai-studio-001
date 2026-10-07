# U01 六件独立挂件｜Gate2 实图审核包 v0.3

本版承接已批准的 `U01-GENTLE-UNDERWORLD-ART-PLAN-001/v0.2` 制作方案。旧 v0.2 花、莲纹、景石和“忘川”效果已按用户意见退回；**本版没有沿用这些旧图或笔触**。本轮仅制作美术，尚未接入程序。本文件供用户对**具体 v0.3 图片、PSD 和六张切图**决定是否批准 Gate2。

## 看图顺序

1. [2172×724 整景同尺度重组](review/overall_from_psd.png)：两盏孔明灯、引魂幡、桥左“黄泉路→”路牌、桥中“奈何桥”木牌、右原空匾“酆都城”独立字片。
2. [四处放大细节](review/local_detail_board.png)：可核纸灯、幡、两路牌文字和右匾文字是否符合温和月夜画风。
3. [五种竖屏比例 × 中/左/右 × zoom 1/1.8](review/portrait_viewports.png)：30 张静态美术投影，所有状态无透明露底。挂件按现有场景深度随画面移动；左侧幡/路牌在移动途中可见，极端视窗无需六件同时出现。另有 [左移途中的挂件视窗](review/mid_left_props_z1.png) 与 [右移途中的孔明灯视窗](review/mid_right_lantern_z1.png)。这些**不是 Creator 运行截图**，未显示真实悬浮控件。

## 可编辑资源与交接

- [24 层 PSD 母版](psd/u01_gentle_underworld_props.psd)：四个批准原层逐像素保留；六件用稳定 ID 前缀组织为各自独立的分部栅格层。旁存原创 SVG 路径，每件另有独立透明全画布 PNG。PSD 写入器不生成原生文件夹组/文字对象；可按同前缀多选分部层整体移动，或移动该件独立 PNG。详见 [可编辑性核验](PSD_EDITABILITY_REPORT.md)。
- [资源清单](CUT_MANIFEST.json)记录六件稳定 ID、实际 PNG 路径/哈希、alpha 包围盒、pivot、PSD 对应层、四张原场景图与完整层序。六件 PNG 在 `exports/props/`；四张批准基底在 `exports/base/`。
- [来源与制作记录](SOURCE_AND_EDIT_RECORD.md)和[锚点核对](VISUAL_ANCHOR_CHECK.md)记录旧层身份、新件范围、代表样张复核、30 视窗及未测项。[切图协作记录](CUT_COLLABORATION_RECORD.md)记录 Tech/Client 对后续接入的意见。

请特别审看三处文字是否准确、引魂幡是否保持温和、六件的位置与画面密度。**Gate1 对制作方案的批准不等于这组实图已获批准**。用户确认具体 v0.3 PSD/切片/效果前，Client 不将其接入工程。真实 Creator 遮挡、图集/显存/帧时、目标手机效果均待后续接入验证。
