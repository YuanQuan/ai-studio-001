# U01拖动后的下一次点击失效

候选为 Resource v0.6、Gallery v0.4；实际 IAB Web，320×568、DPR 1。菜单上拖/下拖/滚轮、游客双向拖动和点击隔离均已通过，U01方向本身也已正确，但拖动后的按钮状态仍需修复。

U01调节面板连续拖动后，点击关闭 `[248,52]` 多次没有响应；截图 `browser-integration-v06/U01-close-stuck-after-drag-320.jpg`。点击正文行间隙 `[160,180]`，使滚动视窗收到完整 start/end，再点关闭可恢复，截图 `U01-close-recovered-via-gap-320.jpg`。此为故障隔离过程，不是交付给用户的操作方式。

源码 button helper 的 TOUCH_END 停止冒泡，滚动视窗可能收不到 END，`panelScrollY` 残留；新按钮 START 又只在其为 null 时重置 `panelScrollGesture`，于是正常下一次 tap 被旧拖动状态拦截。Master授权原Gallery Owner仅修改U01按钮/视窗的手势结束与取消状态，不更改布局、资源、动作或其它滚动逻辑。必须同时证明：拖动末尾不执行按钮；下一次新tap可关闭或执行普通按钮；取消不执行；之后新tap恢复。

原 `browser-integration-v06/U00-panel-drag-bottom-320.jpg` 文件名误标，实际画面仍为未关闭的U01面板，不可用作U00通过证据。后续真正U00的正反触拖、步长行可达与关闭已独立复测，证据为 `U00-panel-real-up-drag-320.jpg` 和 `U00-panel-after-close-320.jpg`。验证计数已更正，不把误识别的页面计作一次进入。
