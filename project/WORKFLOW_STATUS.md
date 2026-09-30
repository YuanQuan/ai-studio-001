# 工作流状态

Producer维护当前流程事实；更新时间：2026-09-29（Asia/Shanghai）。

## 汇总
- 正式任务线：9
- 待用户审批：4
- 当前产品文档任务阻塞：0
- 历史初始化阻塞本轮未重新验证。

## 当前任务线
| 任务 | 阶段 | Owner | 当前 Artifact | 版本 | 专业评审 | 用户审批 | 阻塞 | 下一动作 |
|---|---|---|---|---|---|---|---|---|
| PRODUCT-001 概要需求与模块分层 | USER_REVIEW | product | deliverables/product/PRODUCT-001/v0.7/PRODUCT_OUTLINE.md；BRAINSTORM_MAP.md；MINDMAP_AI_SNAPSHOT.md（同目录，交互图URL登记于交付包） | v0.7 | Master评审APPROVED；5项验收PASS | v0.7待用户确认 | 无 | Master呈现交互脑图、快照及概要供用户审阅 |
| DEMO-001 核心场景全流程验证 Demo | DONE（产品规格阶段） | product | deliverables/product/DEMO-001/v0.1/DEMO_PRODUCT_SPEC.md；DELIVERABLE.json（同目录） | v0.1 | Master评审APPROVED；6项验收PASS | USER_APPROVED | 无 | Master创建并推进Tech Lead、Art、UI规格任务，逐阶段评审及用户审批 |
| TECH-DEMO-001 Demo技术设计 | DONE | tech_lead | deliverables/tech_lead/TECH-DEMO-001/v0.2/TECH_DESIGN.md；REVIEW.md和DELIVERABLE.json（同目录） | v0.2 | Tech Lead自评完成；Master独立评审APPROVED；5项验收PASS | USER_APPROVED | 无 | Master编排后续Client/QA开工包，继续各阶段审批 |
| ART-DEMO-001 Demo美术方向与资产规格 | DONE | art | deliverables/art/ART-DEMO-001/v0.1/ART_DIRECTION.md；ART_BRIEF.md；ASSET_MANIFEST.md；DESIGN_RATIONALE.md；DELIVERABLE.json（同目录） | v0.1 | Master专业评审APPROVED；5项验收PASS | USER_APPROVED | 无 | Master创建UI规格任务；后续视觉实现仍待UI审批 |
| UI-DEMO-001 Demo最简UI规格 | DONE | ui | deliverables/ui/UI-DEMO-001/v0.1/UI_SPEC.md；COLOR_SYSTEM.md；screens/repair-flow.png；components/repair-controls.png；DELIVERABLE.json（同目录） | v0.1 | 5项PASS；Art一致性评审与Master独立评审均APPROVED | USER_APPROVED | 无 | Master编排Client/QA开工包及后续审批 |
| ART-ASSET-DEMO-001 Demo最小可集成美术资产包 | DONE | art | deliverables/art/ART-ASSET-DEMO-001/v0.2/ASSET_AUDIT.md；ASSET_MANIFEST.md；ASSEMBLY_GUIDE.md；scenes/；characters/；props/；DELIVERABLE.json（同目录，21张PNG） | v0.2 | 5项验收PASS；Master独立评审APPROVED | USER_APPROVED | 无 | Master编排Client资产集成与QA开工包及后续审批 |
| CLIENT-BRIEF-DEMO-001 Demo客户端开工概要 | USER_REVIEW | client | deliverables/client/CLIENT-BRIEF-DEMO-001/v0.2/FEATURE_BRIEF.md；DELIVERABLE.json、TECH_REVIEW.json、MASTER_REVIEW.json（同目录） | v0.2 | 5项PASS；Tech Lead与Master评审APPROVED | 待用户确认（仅校准准备） | 无 | Master与QA/性能预算一并呈现；后续实际参数和截图须新版复评及用户批准 |
| QA-PLAN-DEMO-001 Demo测试计划与客户端用例 | USER_REVIEW | qa | deliverables/qa/QA-PLAN-DEMO-001/v0.2/TEST_PLAN.md；CLIENT_TEST_CASES.md、DELIVERABLE.json、TECH_REVIEW.json、MASTER_REVIEW.json（同目录） | v0.2 | 5项PASS；Tech Lead与Master评审APPROVED | 待用户确认 | 无 | Master与Client/性能预算一并呈现 |
| TECH-PERF-DEMO-001 Demo性能预算与测量口径 | USER_REVIEW | tech_lead | project/quality/PERFORMANCE_BUDGET.md；deliverables/tech_lead/TECH-PERF-DEMO-001/v0.1/REVIEW.md、DELIVERABLE.json、MASTER_REVIEW.json | v0.1 | 5项PASS；Tech Lead自检与Master独立评审APPROVED | 待用户确认 | 无 | 与Client/QA修订版汇总呈现用户审阅 |

## 版本与边界
- v0.1至v0.6原文保留；历史审批决定保存为tasks/PRODUCT-001/ARTIFACT_APPROVAL_v0.x.json。
- 当前ARTIFACT_APPROVAL.json为v0.7 USER_REVIEW；用户未批准，任务未DONE。
- 用户明确方向由Master记入项目决策；整包概要和配置尚未获批，下游正式消费关闭。
- 当前游戏的Studio Layer快照与主模板提交 `1d155c993e7d33696ade22a39e3e92901c16d38a` 中本轮相关的13个通用文件核验一致；`.studio-lock.json` 已锁定该真实模板commit。主模板已由Master提交推送；本次Producer仅更新游戏工作区文件。
- 脑图方法提案记录 `user_approval=APPROVED`、`status=APPLIED`；当前游戏与主模板Studio文件及标准项目模板默认项已核验同步。该组织级批准不代表PRODUCT-001 v0.6获批。
- Git同步状态与Artifact审批状态分开记录；模板commit和推送不代表当前游戏概要得到用户批准。
- DEMO-001以用户最新Demo指令为独立输入；PRODUCT-001 v0.7只作背景参考，未获批准的概要不成为Demo下游正式输入。DEMO-001 v0.1产品规格已获用户明确批准，可解锁Tech Lead、Art、UI规格阶段；正式下游任务仍由Master创建，Client和QA执行须遵守后续审批门禁。
- DEMO-001当前审批记录为 `tasks/DEMO-001/ARTIFACT_APPROVAL.json`，状态 `USER_APPROVED`；Git同步状态与该审批决定分开。
- TECH-DEMO-001与ART-DEMO-001以上游已批准DEMO-001 v0.1规格为输入。用户在两个具体版本同时呈现后回复“继续吧”，Master确认批准TECH v0.2和ART v0.1；TECH v0.1要求修订的历史审批及产物保留。UI规格任务已满足Art输入门禁，可由Master创建；Client/QA可使用已批准技术设计，但正式编码仍需Client/Server Feature Brief与QA Test Plan等适用开工包审批，Client视觉实现仍需UI视觉Artifact审批。
- UI-DEMO-001与ART-ASSET-DEMO-001均使用已批准的Demo产品、Art方向和Tech设计。用户在两个具体版本同时呈现后回复“可以继续吧”，Master确认批准UI v0.1与Art资产包v0.2；v0.1资产草稿保留。两项均可作为Client正式视觉输入；编码前仍需适用的Client Feature Brief与QA Test Plan开工包审批。
- Client Brief v0.2、QA Plan v0.2与性能预算 v0.1均已通过专业评审，分别停于USER_REVIEW，并作为同一开工审批包呈现；v0.1修订历史保留。Client Brief v0.2审批范围仅限工程创建、已批准资产导入与无业务逻辑的静态场景校准。实际地图/相机/命中/路径参数和截图形成新版本，经过Tech Lead评审与用户批准前，不得正式功能编码。

## 连续执行检查
2026-09-30连续执行检查：PRODUCT-001与三项Demo开工审批包均停于USER_REVIEW；此前Demo产品、技术、美术、UI与资产阶段均DONE。当前无仅以READY/IN_PROGRESS占位的可继续任务；Client正式功能编码仍锁定，等待校准参数新版本专业评审及用户审批。
