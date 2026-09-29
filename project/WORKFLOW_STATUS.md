# 工作流状态

Producer维护当前流程事实；更新时间：2026-09-29（Asia/Shanghai）。

## 汇总
- 正式任务线：6
- 待用户审批：3
- 当前产品文档任务阻塞：0
- 历史初始化阻塞本轮未重新验证。

## 当前任务线
| 任务 | 阶段 | Owner | 当前 Artifact | 版本 | 专业评审 | 用户审批 | 阻塞 | 下一动作 |
|---|---|---|---|---|---|---|---|---|
| PRODUCT-001 概要需求与模块分层 | USER_REVIEW | product | deliverables/product/PRODUCT-001/v0.7/PRODUCT_OUTLINE.md；BRAINSTORM_MAP.md；MINDMAP_AI_SNAPSHOT.md（同目录，交互图URL登记于交付包） | v0.7 | Master评审APPROVED；5项验收PASS | v0.7待用户确认 | 无 | Master呈现交互脑图、快照及概要供用户审阅 |
| DEMO-001 核心场景全流程验证 Demo | DONE（产品规格阶段） | product | deliverables/product/DEMO-001/v0.1/DEMO_PRODUCT_SPEC.md；DELIVERABLE.json（同目录） | v0.1 | Master评审APPROVED；6项验收PASS | USER_APPROVED | 无 | Master创建并推进Tech Lead、Art、UI规格任务，逐阶段评审及用户审批 |
| TECH-DEMO-001 Demo技术设计 | DONE | tech_lead | deliverables/tech_lead/TECH-DEMO-001/v0.2/TECH_DESIGN.md；REVIEW.md和DELIVERABLE.json（同目录） | v0.2 | Tech Lead自评完成；Master独立评审APPROVED；5项验收PASS | USER_APPROVED | 无 | Master编排后续Client/QA开工包，继续各阶段审批 |
| ART-DEMO-001 Demo美术方向与资产规格 | DONE | art | deliverables/art/ART-DEMO-001/v0.1/ART_DIRECTION.md；ART_BRIEF.md；ASSET_MANIFEST.md；DESIGN_RATIONALE.md；DELIVERABLE.json（同目录） | v0.1 | Master专业评审APPROVED；5项验收PASS | USER_APPROVED | 无 | Master创建UI规格任务；后续视觉实现仍待UI审批 |
| UI-DEMO-001 Demo最简UI规格 | USER_REVIEW | ui | deliverables/ui/UI-DEMO-001/v0.1/UI_SPEC.md；COLOR_SYSTEM.md；screens/repair-flow.png；components/repair-controls.png；DELIVERABLE.json（同目录） | v0.1 | 5项PASS；Art一致性评审与Master独立评审均APPROVED | v0.1待用户确认 | 无 | Master呈现UI规格与两张效果图供用户审阅 |
| ART-ASSET-DEMO-001 Demo最小可集成美术资产包 | USER_REVIEW | art | deliverables/art/ART-ASSET-DEMO-001/v0.2/ASSET_AUDIT.md；ASSET_MANIFEST.md；ASSEMBLY_GUIDE.md；scenes/；characters/；props/；DELIVERABLE.json（同目录，21张PNG） | v0.2 | 5项验收PASS；Master独立评审APPROVED | v0.2待用户确认 | 无 | Master呈现可集成资产包及审计供用户审阅 |

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
- UI-DEMO-001与ART-ASSET-DEMO-001均使用已批准的Demo产品、Art方向和Tech设计。UI v0.1交付与两项专业评审已核验；Art资产包v0.2交付与Master评审已核验，v0.1草稿保留。两项均待用户批准；Client视觉集成与资产正式消费保持关闭。

## 连续执行检查
2026-09-29检查：PRODUCT-001、UI-DEMO-001与ART-ASSET-DEMO-001均停于USER_REVIEW；DEMO产品、Tech、美术方向已DONE。无空转READY/IN_PROGRESS任务；Client视觉集成仍须等待UI与可集成资产包当前版本用户批准。
