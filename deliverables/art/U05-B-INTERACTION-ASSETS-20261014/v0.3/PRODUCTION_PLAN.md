# U05-B 底部按钮文字无损拆层：Art v0.3 制作预案

正式任务 `U05-B-BUTTON-TEXT-ASSETS-20261015`，批次 `v0.3/BUTTON_TEXT_SPLIT`。只执行用户已批 `U05-B-BUTTON-TEXT-LAYER-PLAN-20261015/v0.1`；旧 v0.1、失败 v0.2 的 PNG/GIF/PSD 均只读保留。本批不绘字、不换字体/标签/角色/杯/静底，不加动画帧或 imagegen 调用。

## 锁定源与工艺

`SOURCE_AUDIT.json` 已逐字节核 `SOURCE_IDENTITIES.json` 六文件，锁 v0.2 `TEXT_LABELS_HEADER_full.png` SHA `5c4697268c6d5daa543ad8a96f7407f4dfcae8b3e2cf75cc919818fd47d3f7a3`，1024×1536 RGBA。其 y<1400 可见 alpha 25,840 像素、y≥1400 可见 alpha 5,660 像素；y=1399/1400 两行皆空。仅将同源 RGBA 无损分成两张同尺寸透明全画布图：上图 y<1400 原像素、其它行 alpha0；下图 y≥1400 原像素、其它行 alpha0。保留可见源像素四通道原值；两图 alpha 交集0，合成回源在 RGBA 可见结果零差。

以 v0.2 已有 72 层 manifest 为底，在新 v0.3 清单中将上图仍作 `TEXT_LABELS_HEADER` 放在 `COUNTER_FRONT` 前；下图新增 `TEXT_BOTTOM_ACTIONS`，放在全部底部按钮底板/图标之后、`BTN_CONFIRM_TEXT` 之前。清单 73 层。12 张已批 Component v0.2 标签源、净底、四脸、其它位置和合成配置沿袭 v0.2；静态目标仍是 v0.2 `review/reconstructed.png`，SHA `ef101b99caa8511d0cb6a19f91bd183ea83570bcb0303baa784cbb9f946ee947`。

首产只做文字拆层与73层 PSD，核实际层数/名称/顺序、1024×1536可读，PSD RGB 预览对上述静态目标 **0 不同像素**；不满足即停，不自动改第二版。通过后才从同一 v0.2 标签源重导44个时间线逻辑采样项的 GIF 和组件表，实际解码帧数/尺寸/总时长单独登记（旧 GIF 解码39帧），保持既有五分支动作与时间语义。新旧视觉允许差异只在既批标签及标题遮挡区域，区域外零差。完成后登记实际切片、源/hash、稳定ID、Client计划路径及未导入UUID，并交用户具体资源 Gate2；Gate2前不正式接入。

累计活动预算：代表≤70分钟、FULL≤24分钟、总≤94分钟，旧保守上界 FULL1120.318秒/总5275.262秒不重置。此预签/源审和后续制作均计活动；先由 Art/Tech 同批文字签认且复核余额。唯一候选制作+核验≤180秒，另留≥60秒整理；余额不足则收紧制作硬停或停止。既有0次 imagegen 不增。
