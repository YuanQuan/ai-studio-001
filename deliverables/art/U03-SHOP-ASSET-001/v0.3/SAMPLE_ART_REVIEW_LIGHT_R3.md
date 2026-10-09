# 01 奶茶店浅明暗代表样张：Art 自审

- 批次：`U03-SHOP-FAITHFUL-REDRAW-V03`；样张修订：`r3-light-middle`。
- 本次用户指出 3072×1024 三面板中间的 v0.2 店铺为风格和明暗基准。r3 直接继承该店主体及其亮度，`body` PNG 与 v0.2 原件 SHA-256 完全相同；原 v0.3 r2 深色整店稿保留为 `REVISE` 历史，不进入本次扩批。
- 右檐小牌独立高清重建，仍为横杆、短吊环、圆角木框、奶茶杯、珍珠与茶叶；位置 `(821,449)–(943,651)`，不移动旧店主体、灯、叶、柜台或脚点。小牌源为 `source/imagegen/shop_01_sign_light_r1.png`，其有效 alpha 边界为 `(88,120)–(909,1451)`；正式缩放一次至 122×202。新牌并非从数百像素的六店概览图裁下放大。
- 视觉核对：已实看同蓝底、同画布、390×844、720×1280 三列对照。r3 的主体明暗与中间 v0.2 逐像素一致；牌上杯与叶在 390 宽视窗可辨，奶茶牌宽高和相对屋檐位置保持。牌面比 v0.2 更清楚，暖棕边和浅奶油底与主体暖木色协调。没有新增物件或改变店铺布局。目标概念图仅用于设计布局参考；其黑底抠像不作为精确 alpha 或深阴影标准。
- 技术自检：PSD 1024²、11 层；源图隐藏、10 工作层可见；PSD RGB 预览与两片重组逐像素一致；标牌分为挂件、牌板、图形三个可选栅格图层；两片同画布。图层仅含可见像素，图形后方的完整牌面不可独立恢复，已在报告披露。
- 视觉判断：**PASS，提交 Tech 首样后验**。此判断仅覆盖 01 代表样张，不代替六店成品的 Gate2 用户审核或 Client 真机验证。

## 直接查看

- [同画布三列](preview/shop_01_light_r3/shop_01_target_v02_light_r3_same_canvas.png)
- [390 静态视窗](preview/shop_01_light_r3/shop_01_target_v02_light_r3_390x844.png)
- [720 静态视窗](preview/shop_01_light_r3/shop_01_target_v02_light_r3_720x1280.png)
- [PSD 母版](psd/shop_01_milk_tea_light_r3_v03.psd)
- [body 切片](exports/shop_01_light_r3/tex_u03_shop_01_body_light_r3_v03.png)
- [sign 切片](exports/shop_01_light_r3/tex_u03_shop_01_sign_light_r3_v03.png)
- [构建报告与 SHA](SAMPLE_BUILD_REPORT_LIGHT_R3.json)

勘误：方向图的帘幕实际为左三段、右三段；灯是左外红灯与右内暖圆灯。冻结方案中旧的文字描述不作为改图依据，实际目标图和用户最新中间明暗选择优先。
