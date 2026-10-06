# UnitSamples 唯一入口 U01 范围变更 v0.1

任务：UNIT-SAMPLE-SINGLE-ENTRY-SCOPE-001。状态：DRAFT，待专业影响评审、Master 核验及用户审批。日期：2026-10-06。

## 1. 目标与依据

将 apps/client/assets/UnitSamples.scene 当前菜单中的四层场景镜头 Lab 从 U10 改为唯一 U01，并从此菜单退役旧实验 U01–U09 的运行入口、实现和仅供旧实验使用的资源。新 U01 保持此前批准的四层场景、镜头拖动、缩放和重置语义。

本次对象是 UnitSamples.scene 的旧九项技术样例目录（UNIT-SAMPLES-001），不是另一套已批准的七项正式内容产品规格。UNIT-MENU-PRODUCT-001 v0.2 的七项内容及其审批仍有效；它们不因从这个旧运行菜单移除 U01–U09 而撤销或改写。若未来需要将七项正式内容接入新的运行导航，应另有获批产品范围和实施任务。

依据：用户 2026-10-06 指令；UNIT-MENU-PRODUCT-001 v0.2；UNIT-MENU-SCENE1-SCOPE-001 v0.1；tasks/UNIT-SAMPLES-001/TASK.json（已 CANCELLED）；tasks/UNIT-MENU-SCENE1-CLIENT-IMPLEMENT-001/TASK.json（当前 U10 实施 BLOCKED）；project/ASSET_HANDOFF_REGISTRY.md；当前工程文件与 Git 工作区状态。

## 2. 范围

### 保留并改为唯一 U01

- 菜单只展示一个可运行单元入口：U01 四层场景镜头。不得出现 U02–U10 入口或旧实验卡片。
- U01 继续由 UnitSamples.scene 承载，使用获批四层背景、共用 STREET_BASE_01 Prefab 与镜头控制器；可从 U01 返回同一场景的基础标题/空菜单状态，并再次进入 U01。
- 保持已批准行为语义：查看四层背景；水平拖动镜头；放大/缩小；重置到初始镜头。具体参数和输入实现沿用现行已批 Tech/Client 规格，不在本 PRD 中重定技术契约。
- 保留现有四层获批 PNG 与 Creator 身份文件、apps/client/assets/units/background/prefabs/pf_street_base_01.prefab 及 .meta、apps/client/assets/labs/menu/scene1_camera_controller.ts 及 .meta，以及场景必要引用。
- 保留 project/ASSET_HANDOFF_REGISTRY.md 中的稳定资产 ID、哈希、UUID、路径与审批追溯记录；更新由其职责 Owner 在后续任务中执行。本产品任务不编辑该登记表。

### 退役并清理旧 U01–U09

旧菜单项目为：U01 瓦片地图、U02 镜头与手势、U03 建筑占格、U04 建筑四方向、U05 精灵四方向、U06 层级遮挡、U07 场景轻特效、U08 UI 与交互、U09 密度与性能。以上运行样例全部从运行菜单退役，其旧实现、旧场景/序列化引用和专属运行资源均应清除。

当前观察到的清理候选包括 apps/client/assets/DemoScene.scene 及 .meta、apps/client/assets/demo/**、旧 UnitSampleGallery.ts 的九项实现分支/旧 SpriteFrame 引用，以及 project/unit_tests/UNIT_SAMPLES_v0.1.md 的运行说明。Git 工作区已经显示其中 DemoScene 与 assets/demo 多项删除、UnitSampleGallery.ts 和 UnitSamples.scene 修改；这只是待审查的工作区事实，不代表本任务已验证或批准这些改动。

清理按引用判定，执行前/后逐项核对当前 Scene、Prefab、脚本、构建入口、Creator 元数据和项目其他功能：

1. 只有能证明仅供旧 U01–U09 使用、且无任何保留功能引用的运行资源，才列为可删除。
2. 任何由新 U01、已批准七项正式产品内容、项目其他功能或 Creator 资产身份/目录关系共用的资源，均不得按“旧样例资源”名义删除；需先由 Client 与 Tech Lead 标明引用和归属。
3. 不删除 Creator Library/缓存、全局设置、共享 UI/字体/基础图集、登记表、审批与 Review 历史、旧任务包、旧交付物、取消记录和变更记录。它们不是旧样例运行资源。
4. 不因路径位于 assets/demo/ 就跳过交叉引用核查；引用扫描、Creator 导入/编译或运行异常须如实记录，未核清的资源保持保留并提交 Master 处理。

## 3. 用户流程与状态

1. 打开 UnitSamples.scene，菜单只显示 U01 标题与进入操作，不列其他单元。
2. 进入 U01，显示四层背景和现有镜头控制操作。
3. 用户可拖动、缩放并触发重置；重置恢复批准的初始镜头状态。
4. 返回后回到唯一 U01 菜单，再进入时不残留之前的镜头状态或重复对象。

空场景若作为返回菜单承载画面，不得呈现第二个可运行样例或旧实验内容。

## 4. 影响已批准七项正式内容的边界

UNIT-MENU-PRODUCT-001 v0.2 的七项内容规格和已批准语义不变，不列入本次删除。当前导航系统不再提供旧九项实验入口；因此七项正式内容在 UnitSamples.scene 的菜单可达性不属于本 PRD 验收承诺。对应 Product、UI、Tech、Art、VFX、Client、QA 历史 Artifact、审批和 Review 继续有效并留档。如果后续将七项内容编入其他导航或样例运行包，必须有明确范围、跨角色评审及适用的用户审批，不能把本次唯一 U01 变更解释为自动授权。

## 5. 依赖、边界与风险

- 上游产品基线：四层场景范围 v0.1 和已批准四层切图/技术/客户端输入，具体有效版本由 Master/Producer 从审批事实源确认。
- 新 U01 当前仍继承 Client Task UNIT-MENU-SCENE1-CLIENT-IMPLEMENT-001 的 BLOCKED 事实；这份产品范围不能将其解锁或宣称实现/运行通过。
- 旧 UNIT-SAMPLES-001 已取消，历史验收只证明旧任务曾报告九项桌面验证，不构成本次清理、重命名或新 U01 的验证证据。
- 主要返工风险是误删共享资源、漏掉序列化引用、菜单索引与 U01 行为错位，以及误将新的七项产品范围与已取消旧九项测试混为一谈。
- 本版未定义删除策略的代码细节、资源重命名方式、Creator 导入恢复方法、构建/性能阈值或正式 QA 平台。

## 6. 下游门禁

本 PRD、验收标准和变更影响必须先经必要专业影响 Review、Product Review 与 Master Review，再由用户明确批准该具体版本。用户批准前不得把本稿作为正式 Client 清理输入，也不得以此移除资源。批准后由 Master 建立/解锁 Tech Lead 资源引用审查及 Client 实施任务；完成后应针对新实现版本进行专业 Review 和用户确认。需要 QA 时，QA 依已批准的测试计划/范围执行并提交报告；QA 报告经用户确认、Master 基于证据接受之前，相关任务不得标 DONE。

本范围草案不改写任何已有审批记录，不代替 Producer 记录审批或状态。
