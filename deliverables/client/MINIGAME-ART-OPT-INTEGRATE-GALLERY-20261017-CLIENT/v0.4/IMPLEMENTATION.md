# Gallery 触拖滚动方向修复 v0.4

修复实际小屏 Web 中列表手指上拖不前进、反向拖动才露出后续入口的问题。Cocos `getUILocation().y` 向上递增，现有内容以正 offset 上移，所以 Gallery 统一按 `currentY - previousY` 更新触拖 offset；菜单滚轮也已接入，沿用既有 wheel 符号和比例。

本次修复覆盖实际审查出的七处反向位移：菜单 Touch/Mouse、游客托盘 Touch/Mouse、U00 调节面板、U04 对话详情、U01 调节面板。没有改 ScrollableTextPanel（其方向公式此前已正确），没有改 U05 上下按钮、布局、动作时序、资源、原素材或layout数据。U01触拖更新抽为 `applyPanelFingerMove`，同时保留原移动阈值、滚动范围裁切、取消行为和拖动时屏蔽按钮点击。

Root记录的原始实际失败证据位于 `deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/browser-integration-v05/menu-bottom-320.jpg` 与 `menu-reversed-drag.jpg`。v0.3修复前 Gallery / U01 源码分别以 SHA-256 `00fc815b9edec3b9c1dcd3c6ed00ee1d38fd9243bbe8d0e752604fdc4e1d944b` / `612b253e8c0fa2fa9d52022eb721ca8838bbac2946d304428b33e9db38720d01` 保存于 `evidence/prechange/`。

## 验证

- Creator 3.8.8 随附 TypeScript 4.9.5 全项目语义检查通过。
- `scroll_direction_probe.cjs` 转译并调用真实 Gallery/U01 方法，检查上拖推进、下拖回顶、双向边界裁切、游客触控/鼠标delta、拖动阈值和菜单拖动不触发入口；同时确认U00/U04使用同一已测方向公式、菜单wheel已挂接、U01按钮保留拖动隔离。通过。
- U04重入探针和ModuleAssets/DerivedResolver方法回归探针仍通过。
- 这份方向修复候选尚未Creator重建或IAB实际触控；菜单上拖到U05/下拖回顶、U00/U01/U02/U04全文触拖均待Root在新构建实测。既有v0.5页面释放20循环结果是修订前候选证据，不替代本版重建后复测。
