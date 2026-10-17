# 小屏触拖方向缺陷与修订范围

实际候选：Resource v0.5，Gallery v0.3，Creator final-v0.5-u04fix 的真实 Web，IAB 320×568、DPR 1。六页面稳定画幅及20次页面退出释放已验证，不以这些结果替代触控功能验证。

菜单从顶部向上拖动 `[160,490] → [160,120]` 两次没有露出下方入口，反向 `[160,120] → [160,490]` 却露出 U03/U04。证据：`browser-integration-v05/menu-bottom-320.jpg` 为向上拖动后仍在顶部，`menu-reversed-drag.jpg` 为反向拖动后画面。原生滚轮也未移动菜单；源码当时没有菜单滚轮处理。

Cocos `getUILocation().y` 向上递增，内容节点以正 offset 向上移动，因此此类列表应按 `currentY - previousY` 增加 offset。已发现反式共七处：菜单 Touch/Mouse 两处、游客 Touch/Mouse 两处、总览调节一处、对话详情一处、U01调节面板一处。通用 ScrollableTextPanel 的公式已正确，不修改；U05使用独立上下按钮，已能到达全部操作，本次不新增触拖功能。

Master授权 Gallery Owner 在同一 Client 返工阶段修改 Gallery 与 U01 `sakura_layout_editor.ts` 的上述手势范围及有效验证，可补菜单原生滚轮；资源 Owner 不并发改这两源。保留拖动阈值、取消、点击隔离、已有轮滚和镜头方向，不改布局、素材或玩法。新版本先实际检查 320 菜单向上到 U05、向下回顶部、拖动不误开页面和受影响面板，再进行后续回归。既有批准不重复请求，不新增UI或美术审批门禁。
