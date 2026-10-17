# U05 客户端功能概要：完整画幅与可读操作代理

任务：`MINIGAME-ART-OPT-BATCH-20261017-CLIENT-U05`；版本：v0.1；Owner：Client。

## 已批准输入与边界

继承 Client v0.1 FEATURE_BRIEF（SHA-256 `e9ad048785a285d4ef04a8f4a6655658223a27c2e7e49f94e0bccf06008d7caf`）及 Tech Lead `CLIENT_BRIEF_REVIEW.json` APPROVED。当前 handoff：`milk_tea_lab.ts` SHA-256 `e618b5ab4de6e24d10864426efe6805960a6403f550009758fd9ad3ca65004ac`，同时保留初始 U05 来源快照 SHA-256 `306128c61f4d9fb41c5e4c25852a7cf88cbe09e533819f0587b0fca0ae0933a7`。按 UI v0.1 `screens/LAYOUT_SPEC.md` 的 U05 条款实施，先以 ViewportMapper 的 safe/capsule R 对 1024×1536 原画完整 contain，再独立布局 HUD。保留 `configureViewportAdapter(adapter)`、1024×1536 母版、唯一 `run`/`presentation`、业务时序、状态和配置接口。此子任务不增加接口或产品语义，不需要重复审批。

## 结构与实现

在 `milk_tea_lab.ts` 内按真实 CSS content、visibleSize、root.fit 与每个revision测量字号、热区和相交情况。合格控件留在原画位置；不合格操作组通过默认关闭的安全区操作/配方面板代理，并停用对应原热区。safe/capsule 布局独立于原画，不增加常驻托盘。退出确认、配方、验证设置及结算采用统一安全区遮罩弹窗、固定头/底和可滚动正文。resize仅重排，保留原 run/presentation/选择/订单/剩余时间及滚动位置并清除按下手势。

复用 `ViewportAdapter` 读取的 `ViewportSnapshot`；不更改共享 Adapter 生命周期、State、presentation 时序、Gallery/framework、PNG、meta、Scene 或 Prefab。不新增图片、字体或依赖。

## 风险与验证

原画内热区扩张可能重叠，因此必须逐组测量并核对目标集合唯一性；面板操作直接调用现有同一动作入口，不复制业务状态。通过有效几何/字号/热区/代理/遮罩/时序测试及 `milk_tea_state.check.js` 状态回归核验。Creator构建由主Client集成后统一执行；Codex内置浏览器当前不可用，实际运行证据将标记 `NOT_TESTED`，不以静态或测试替代。
