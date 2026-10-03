# CP-UNIT-MENU-PERF-GATE-001｜七菜单目标机型与性能预算分阶段审批提案

状态：`PROPOSED`；日期：2026-10-03；发起：Master Agent。**未获用户批准，不改变 Tech v0.2 当前门禁。**

## 触发与原契约

用户已批准 `UNIT-MENU-TECH-DESIGN-001 v0.2`。其中 `PERFORMANCE_PLAN.md` 明确：硬阈值、正式机型、允许的降级须在后续获批的 Client/QA 开工包中锁定。`UNIT-MENU-CLIENT-BRIEF-001 v0.1` 与 `UNIT-MENU-QA-PREBUILD-001 v0.1` 已完成七菜单结构、正式资源门禁和测试用例，但尚未指定团队可反复接触的目标手机、低端机、数值硬阈值及降级；Tech Lead 的 Client Review 因此为 `CHANGES_REQUESTED`。旧 `TECH-PERF-DEMO-001 v0.1` 针对 45° 瓦片 Demo，且仍为待审批候选，不能直接转成平视七菜单阈值。

## 推荐变更：两个批准节点

1. **结构与测试计划节点**：允许 Client Feature Brief 与 QA Test Plan 在七入口、同源 Prefab、资源依赖、动画/遮挡、证据方法和未测口径专业 Review 通过后进入用户审阅。获批只允许搭建与正式资源无关的路由/镜头骨架、实现获批资源的导入与独立/组合逻辑；每批资源仍须 Art/Tech 出图前双签和单独用户批准后才能进入正式功能。不允许用旧 Demo/概念/占位图片充数。
2. **设备与性能节点**：最迟在组合场景集成及目标机 QA/优化开始前，Tech/Product/Client/QA 共同提交并获用户批准：目标平台和可重复接触的代表机/低端机具体型号、OS/容器/DPR，帧时/DrawCall/纹理驻留/加载或输入指标与采样方法、低端机允许降级及不能降级的必验效果。在该节点前亦不得给目标设备数值 `PASS`、放行性能降级或宣称完整单元 QA 通过。随后以相同 Creator 构建、正式资源和真机原始记录执行 QA；未锁定时相关项始终 `NOT_TESTED`。将此节点放在组合场景集成前，可及早发现背景覆盖、图集/骨骼和 UI 小字的设备返工风险。

这只是**门禁时序变更**，不放宽最终性能或质量要求。骨骼对象单页、幽灵序列帧、七入口、左右十格、目标机读字和遮挡取证不变。Tech v0.2 若采用此方案，应出 v0.3 `CHANGE_IMPACT` 与修订 `PERFORMANCE_PLAN`，Client/QA v0.1 需据此出新版本/复审，不原地覆盖已审版本。

## 另一条路径：本轮锁定

若用户能指定可供重复测试的手机与目标平台，本轮可保持 Tech v0.2 原契约。Tech/Product/Client/QA 在 Client/QA 开工包新版本中写入具体机型、硬阈值、采样与允许降级，专业 Review 再通过后送用户审批。没有具体可用设备时不得填造型号，不能把 Web/开发工具结果当真机结果。

## 影响与评审

| 角色 / Artifact | 影响 |
|---|---|
| Tech Lead `PERFORMANCE_PLAN` | 需确认分阶段是否可行、完整设备预算最迟门禁与不可绕过项；选择推荐路径时发布 v0.3 供用户批准 |
| Client `FEATURE_BRIEF` / `ASSET_GATE_MATRIX` | 采用 v0.3 后明确先行实现范围和禁止进入完整质量结论的条件；仍必须等待正式资源逐批批准 |
| QA `TEST_PLAN` / `CLIENT_TEST_CASES` | 设备缺失及数值项保留 `NOT_TESTED`；实际测试报告须在设备预算批准后才可判完整通过 |
| Product / Art / UI / VFX | 产品与视觉验收语义不改；如降级影响店光影、角色状态、树花灯必验表现，必须另行评审而非自行裁剪 |
| Producer | 对应版本、专业 Review、用户审批与两节点门禁分别跟踪；现有 Client 技术评审 `CHANGES_REQUESTED` 保留历史 |

## 待用户决定

选择“分阶段审批”或提供本轮可锁定的目标平台与代表/低端机具体型号。未决定前，正式背景与幽灵等独立资源批次仍可按已批准 Art/Tech 规格推进；Client/QA 开工包维持修订中，不开始七菜单正式编码。
