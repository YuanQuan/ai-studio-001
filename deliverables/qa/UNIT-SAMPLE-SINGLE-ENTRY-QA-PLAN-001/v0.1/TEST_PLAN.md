# 唯一 U01 清理与运行验收 QA 计划 v0.1

## 任务与状态

- Task：`UNIT-SAMPLE-SINGLE-ENTRY-QA-PLAN-001`；测试阶段：`FUNCTIONAL`（计划设计，尚未执行）。
- 规则：`rules/qa_protocol.md`，版本 `studio-workflow-v2-policy`。
- 产品基线：`UNIT-SAMPLE-SINGLE-ENTRY-SCOPE-001 v0.2` 的 PRD/ACCEPTANCE，已获 `USER_APPROVED`。
- 技术基线：`UNIT-SAMPLE-SINGLE-ENTRY-TECH-PLAN-001 v0.1` 的 TECH_DESIGN/RESOURCE_REFERENCE_AUDIT，已获 `USER_APPROVED`。
- 旧 QA 基线：`UNIT-MENU-SCENE1-QA-PLAN-001 v0.1` 仅作为四层镜头操作用例来源参考；不覆盖本任务新增的唯一菜单、旧样例引用清理、资源删除和历史留存范围。旧版本及审批原样保留。
- Client Brief：`UNIT-SAMPLE-SINGLE-ENTRY-CLIENT-BRIEF-001 v0.1` 已产出；Product 与 Art Review 为 `APPROVED`，其余同版 Review/用户审批待完成。已对照草案交叉核对同场景结构、唯一菜单、进入返回重入、控件输入隔离和 Creator/Web 证据要求；草案仅供一致性检查，不作为已批准验收事实。若后续 Tech/QA/Master Review或用户审批产生范围变化，须按对应决定修订本计划后再进入审批。
- 实际开始证据：本轮已读取上述已批准输入、QA 协议和 Task Packet，并实际创建本目录的三份计划产物；确切起始时分未记录，不推算耗时。2026-10-06 13:13:40（Asia/Shanghai）是执行中首次明确读取的时钟检查点，不当作精确起始时间。本轮不运行任何 QA，不生成运行 PASS 或 TEST_REPORT。

## 目标与边界

计划覆盖 Product AC-01–AC-10：唯一 U01 菜单和所有可见文案、进入/返回/重入、四层背景与镜头行为、旧 U01–U09 实现/场景/序列化引用清理、旧资源逐项删除依据、四层 U01 资产身份链、七项产品及旧取消任务历史留存、活动项目说明更新。验收对象是 Creator 工程与 Web 构建中的唯一 U01；不是另一套七项产品菜单，也不实施旧九个样例。

测试目标引用（`target_ref`）：批准后的 `UNIT-SAMPLE-SINGLE-ENTRY-SCOPE-001 v0.2`、`UNIT-SAMPLE-SINGLE-ENTRY-TECH-PLAN-001 v0.1`、经同版交叉核对并获批准的 Client Brief、被测实现 commit/hash、Creator 工程与实际导入资源身份清单。未实际得到的版本/哈希/UUID/环境值须标 `NOT_RECORDED`，不得从方案候选推造。

环境引用（`environment_ref`）：Cocos Creator 工程 `apps/client/`，精确 Creator 版本从实际工程/启动记录确认；功能运行范围为当前项目决议限定的 Web 构建及浏览器中模拟手机竖屏视口。没有获批运行矩阵前不得自行指定浏览器版本、OS、视口、DPR、渲染后端或输入模拟方式。实体手机、小程序容器和发布平台不是本计划的执行范围，相关结论保持 `NOT_TESTED`。

本计划不定义新相机数值、镜头容差、倍率上下限、浏览器/视口矩阵、性能阈值或允许降级。功能预期沿用已批准的四层场景和镜头技术规格；若实际 Client Brief 引入需产品/技术决定的新语义，应暂停受影响用例并走变更/审批。未来第4/7项内容不测试。

## 执行前置与状态

执行前必须同时满足：

1. 本 QA 计划及相关 Client Brief 已完成专业 Review 和用户审批；当前计划 Task 的审批不等于 QA 执行授权。
2. Client 实施 Artifact 已完成并获适用 Review、用户确认；被测提交、Creator 版本、构建/资源版本可追溯。已有工作区删改须先与 Client 实施前 `git status`/diff 基线对照。
3. Tech/Client 已提供逐资源清理清单、Creator 操作证据、U01 资产身份/登记映射以及测试入口。不能以 Tech 静态审计代替本计划执行时的实施后核验。
4. Web 浏览器、OS、模拟视口、DPR、渲染后端和输入模拟方式形成版本化矩阵并获批。矩阵未批时，对应运行覆盖为 `NOT_TESTED`，不得报整体 PASS。
5. 如本功能适用性能测量，Tech/Client/QA 按两阶段 QA 协议另行确定并审批指标、工具、采样方法、基线和预算；本计划不新增性能阈值。预算未批时不作性能达标判断，记录为 `NOT_TESTED`，功能结果与性能结果分列。

缺少 Creator 工程可打开、资源导入失败、场景损坏或必需矩阵/批准输入缺失时，受影响项记 `BLOCKED` 并保留错误/日志；未执行项记 `NOT_TESTED`。状态不得用 N/A 替代缺失条件。

## 执行顺序和证据

1. 保存实施开始基线：commit、`git status --short`、相关 diff、被测资源路径与文件 hash；把本轮实施改动同原工作区预存差异区分。
2. 完成静态代码、场景序列化、Creator UUID、路径和项目说明扫描。扫描须限定活动工程范围并明确排除历史 Artifact/Task/审批记录；单纯历史文字命中不算活动引用。
3. 在 Creator 中刷新/导入工程，打开、保存并关闭/重开 `UnitSamples.scene`；检查 Console/Inspector 的 missing UUID、资源导入及序列化。记录 Creator 版本、操作步骤、日志和场景文件 hash。
4. 编译 TypeScript、构建 Web Mobile 并运行被批准入口；记录构建命令/Creator 构建日志、commit/hash、浏览器环境矩阵、截图/短录屏、场景对象/引用检查和操作结果。验证唯一菜单文字、进入、返回、再次进入、初始状态、拖动、缩放、重置及 UI 输入隔离。
5. 按资源清单逐项核对已删/保留项，扫描实施后活动引用并验证四层 PNG、Prefab、Controller 及登记身份链；把 Creator 实际导入状态与静态 `.meta`/Library 数据分开记证据。
6. 对产品历史与项目说明做文件/审批差异检查，确保七项内容和历史审批留存、旧任务仍 CANCELLED、活动说明更新且不误删历史资料。

每条用例记录：用例 ID、AC/来源、测试提交与资源版本、Creator 版本、矩阵 ID（如适用）、前置条件、步骤、预期、PASS/FAIL/BLOCKED/NOT_TESTED、证据路径、缺陷 ID。功能、视觉、性能结果分别汇报。视觉证据需覆盖菜单和 U01 运行页完整可见文字、初始/返回状态及操作过程；QA 核对可见内容和批准资产版本，Art/UI 按职责审阅关键视觉差异，自动差异仅用于发现候选问题。

## 旧计划关系与明确排除

既有 `UNIT-MENU-SCENE1-QA-PLAN-001 v0.1` 保留原批准范围和历史结果。其已批准镜头操作用例可在满足输入版本一致时作为操作步骤参考，但其早期 Client Brief 的独立 Lab Scene 导航假设、四层独立入口和排除其他单元的范围不适用于本次同场景唯一 U01 改造。此计划新增唯一菜单、同一场景返回/重入、旧九项脱链与资源清理验收；必须作为独立新 Task/版本审批，不能静默覆盖旧计划。

明确排除：Server/API/存档/经济/配置测试；七项正式内容功能测试；第4/7项实际对象/组合功能；实体手机、微信/抖音容器、发布平台和实际弱网；没有获批预算的性能达标判定；与本次变更无关的全量回归。构建及浏览器运行仅能支持获批 Web 范围结论。

## 结果门禁

旧样例运行引用残留、保留资源身份损坏、U01 导航/核心镜头行为失败或 Creator 构建/导入关键错误须按复现与影响分级；P0/P1 阻塞，P2 在报告中显式记录。必须的环境或证据缺失时不能整体 PASS。QA 计划审批仅批准计划；TEST_REPORT 需在单独 QA 执行任务中生成并经用户确认，Master 基于证据最终接受后方可推进对应任务 DONE。
