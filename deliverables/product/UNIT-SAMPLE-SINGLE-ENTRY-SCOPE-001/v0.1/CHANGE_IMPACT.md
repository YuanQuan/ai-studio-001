# 变更影响分析｜UnitSamples 唯一入口 U01 v0.1

## 变更说明

用户要求把当前 UnitSamples.scene 中的 U10 四层场景镜头示例改为唯一 U01，并删除其余旧示例及专属资源。本次处理对象是已取消的 UNIT-SAMPLES-001 旧九项实验目录与后来追加的 U10 四层 Lab 入口；不是 UNIT-MENU-PRODUCT-001 v0.2 已批准的七项正式内容规格。

## 逐角色影响与必要复核

| 角色/既有范围 | 影响 | 后续动作与门禁 |
|---|---|---|
| Product | 新旧编号/入口语义改变；旧九项实验范围退出当前菜单。已批准七项正式产品规格不变。 | 本 v0.1 提交用户审批；若用户退回，创建新 Revision，不覆盖本版。 |
| UI | UnitSamples 的菜单由十项改为一个 U01；返回状态需要保留唯一入口，不再展示旧九项卡片。七项正式 UI Artifact 不自动作废。 | UI 核对标题、菜单状态、空状态和返回/重入行为；如形成正式 UI 规格变更，单独交付并审批。 |
| Tech Lead | 需识别旧实验资源与新 U01/其他功能/Creator 必需资源的依赖边界，审查删除安全性。 | 提交可核对的引用/资源分类 Review；未核清的资源不得删除。 |
| Art | 四层批准图组不变且必须保留；旧实验专属图可能退役。已批准七项视觉资产、PSD、Review 图和审批证据不是运行资源删除目标。 | 对资源目录中的旧专属图与四层正式图做身份/用途核对；本次不委托新美术制作。 |
| Client | 修改 UnitSampleGallery.ts、UnitSamples.scene，移除旧样例分支和安全确认可删的旧运行资源，U10 改 U01；更新仍适用的运行说明和登记。 | 依赖本 Product Artifact USER_APPROVED 与 Master 新建/解锁实施任务；提交删除清单、引用扫描、资源登记差异、运行证据和实施报告。 |
| QA | 测试对象由旧九项历史样例改为唯一四层 U01；历史九项通过记录不可复用为新验收证据。 | QA 计划/用例按批准的 U01 范围修订并获得相应审批后执行；覆盖唯一入口、拖动、缩放、重置、资源完整性和清理无悬空引用。 |
| Server / VFX | 无服务器协议、存档或新 VFX 需求。 | 本范围不需要执行任务；若实现审查发现影响再由 Master 发起正式变更。 |
| Producer | 需保留旧任务取消状态及原审批链，追踪新版本的 Product 审批门禁和下游依赖。 | 在 Master 接受产品稿后核验版本/审批事实并按职责更新流程状态；产品稿作者不修改 Producer 文件。 |
| Master | 需核验产品边界、旧任务关系、当前工作区既有删除和新 U01 Client Blocked 事实。 | 完成 Master Review 后呈现用户审批；批准前不解锁正式清理。 |

## 受影响的具体事实与 Artifact

- tasks/UNIT-SAMPLES-001/TASK.json 已为 CANCELLED；其 v0.1 描述 U01–U09 与旧验收记录保留为历史，不重新打开或覆盖。
- tasks/UNIT-MENU-SCENE1-CLIENT-IMPLEMENT-001/TASK.json 原目标为在 UnitSamples 中以 U10 承载四层 Lab，目前 BLOCKED；其 U10 产品映射必须按获批新范围改成 U01，并对实现版本重新 Review。其四层 PNG、Prefab、控制器与登记中的真实 UUID/哈希是保留依赖。
- UNIT-MENU-SCENE1-SCOPE-001 v0.1 已批准四层场景语义继续有效；此次仅改变导航编号与旧菜单余项，不改四层画面及镜头行为。
- UNIT-MENU-PRODUCT-001 v0.2 七项正式内容和其审批继续有效；不属于 assets/demo/** 删除目标。它们不再由旧九项实验菜单提供运行入口这一事实须在未来独立规划中处理。
- project/ASSET_HANDOFF_REGISTRY.md、Product/Art/Tech/Client/QA历史Review、任务包、审批日志和变更记录均为追溯事实源，不得当作旧运行资源清除。

## 工作区现状与风险

本轮读取 Git 状态时已见 DemoScene.scene/.meta、assets/demo 多项被删除，UnitSampleGallery.ts、UnitSamples.scene 及部分工程设置已有未提交修改；同时存在 assets/units/background/prefabs/pf_street_base_01.prefab、四层 PNG、镜头控制器与 Creator .meta 文件。上述改动是现状，不是本产品任务作出的修改或完成证明。实施 Owner 必须先复核 diff、引用和资源登记，避免覆盖并发改动、误删共享依赖或把必需 Prefab 当成旧资源。

本任务只交产品规格，不改源代码、资产、项目说明或其他状态文件。未核实的运行引用、共享归属或 Creator 必需元数据均为删除阻断项。

## 审批及重新验证

1. Product Review → Master Review → 用户批准本版，是 Client/Tech 正式消费的前置门禁。
2. 获批后，Tech Lead 对引用与清理边界 Review；Client 实施并产出新版实现证据；Art 对保留四层实际画面/资产映射做适用复核。
3. Client 新实现和相关专业 Review 完成后，经用户确认，再按已批准 QA 计划做正式 QA；TEST_REPORT 也须用户确认。
4. 不更改已批准七项正式产品语义、经济/玩法规则或视觉图片；若交叉核查揭示必须改变上述范围，停止该部分并向 Master 提交变更请求，不能由实现方静默扩大清理范围。
