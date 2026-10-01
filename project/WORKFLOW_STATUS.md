# 工作流状态

Producer维护当前流程事实；更新时间：2026-10-01（Asia/Shanghai）。本轮新单元记录由 Master 依据用户授权补录，待 Producer 后续复核。

## 汇总
- 正式任务线：17
- 待用户审批：3（PRODUCT-001 v0.8；孟桃奶茶店 Art/Tech 出图前预案各 v0.1）
- 当前产品文档任务阻塞：0
- 历史初始化阻塞本轮未重新验证。

## 当前任务线
| 任务 | 阶段 | Owner | 当前 Artifact | 版本 | 专业评审 | 用户审批 | 阻塞 | 下一动作 |
|---|---|---|---|---|---|---|---|---|
| PRODUCT-001 概要需求与模块分层 | USER_REVIEW | product | deliverables/product/PRODUCT-001/v0.8/PRODUCT_OUTLINE.md；BRAINSTORM_MAP.md；MINDMAP_AI_SNAPSHOT.md（同目录，交互图URL登记于交付包） | v0.8 | Master评审APPROVED；4项验收PASS | v0.8待用户确认；v0.7已退回 | 无 | Master呈现新版交互脑图、快照及影响说明供用户审阅 |
| DEMO-001 核心场景全流程验证 Demo | DONE（产品规格阶段） | product | deliverables/product/DEMO-001/v0.1/DEMO_PRODUCT_SPEC.md；DELIVERABLE.json（同目录） | v0.1 | Master评审APPROVED；6项验收PASS | USER_APPROVED | 无 | Master创建并推进Tech Lead、Art、UI规格任务，逐阶段评审及用户审批 |
| TECH-DEMO-001 Demo技术设计 | DONE | tech_lead | deliverables/tech_lead/TECH-DEMO-001/v0.2/TECH_DESIGN.md；REVIEW.md和DELIVERABLE.json（同目录） | v0.2 | Tech Lead自评完成；Master独立评审APPROVED；5项验收PASS | USER_APPROVED | 无 | Master编排后续Client/QA开工包，继续各阶段审批 |
| ART-DEMO-001 Demo美术方向与资产规格 | DONE | art | deliverables/art/ART-DEMO-001/v0.1/ART_DIRECTION.md；ART_BRIEF.md；ASSET_MANIFEST.md；DESIGN_RATIONALE.md；DELIVERABLE.json（同目录） | v0.1 | Master专业评审APPROVED；5项验收PASS | USER_APPROVED | 无 | Master创建UI规格任务；后续视觉实现仍待UI审批 |
| UI-DEMO-001 Demo最简UI规格 | DONE | ui | deliverables/ui/UI-DEMO-001/v0.1/UI_SPEC.md；COLOR_SYSTEM.md；screens/repair-flow.png；components/repair-controls.png；DELIVERABLE.json（同目录） | v0.1 | 5项PASS；Art一致性评审与Master独立评审均APPROVED | USER_APPROVED | 无 | Master编排Client/QA开工包及后续审批 |
| ART-ASSET-DEMO-001 Demo最小可集成美术资产包 | DONE | art | deliverables/art/ART-ASSET-DEMO-001/v0.2/ASSET_AUDIT.md；ASSET_MANIFEST.md；ASSEMBLY_GUIDE.md；scenes/；characters/；props/；DELIVERABLE.json（同目录，21张PNG） | v0.2 | 5项验收PASS；Master独立评审APPROVED | USER_APPROVED | 无 | Master编排Client资产集成与QA开工包及后续审批 |
| CLIENT-BRIEF-DEMO-001 Demo客户端开工概要 | DONE（校准准备范围） | client | deliverables/client/CLIENT-BRIEF-DEMO-001/v0.2/FEATURE_BRIEF.md；DELIVERABLE.json、TECH_REVIEW.json、MASTER_REVIEW.json（同目录） | v0.2 | 5项PASS；Tech Lead与Master评审APPROVED | USER_APPROVED（仅工程/资产导入/静态校准） | 无 | Master推进CLIENT-CALIBRATION-DEMO-001；功能编码仍锁定 |
| QA-PLAN-DEMO-001 Demo测试计划与客户端用例 | DONE（计划阶段） | qa | deliverables/qa/QA-PLAN-DEMO-001/v0.2/TEST_PLAN.md；CLIENT_TEST_CASES.md、DELIVERABLE.json、TECH_REVIEW.json、MASTER_REVIEW.json（同目录） | v0.2 | 5项PASS；Tech Lead与Master评审APPROVED | USER_APPROVED | 无 | 实施后另行执行测试并交TEST_REPORT |
| TECH-PERF-DEMO-001 Demo性能预算与测量口径 | DONE（预算阶段） | tech_lead | project/quality/PERFORMANCE_BUDGET.md；deliverables/tech_lead/TECH-PERF-DEMO-001/v0.1/REVIEW.md、DELIVERABLE.json、MASTER_REVIEW.json | v0.1 | 5项PASS；Tech Lead自检与Master独立评审APPROVED | USER_APPROVED | 无 | 实施时锁定设备并采样验证 |

| CLIENT-CALIBRATION-DEMO-001 Creator工程与静态场景校准 | CANCELLED（旧整体Demo作废） | client | deliverables/client/CLIENT-CALIBRATION-DEMO-001/v0.3/DELIVERABLE.json、CALIBRATION_APPENDIX.md、IMPLEMENTATION_REPORT.md、TECH_REVIEW.json；apps/client/assets/DemoScene.scene | v0.3（历史草稿） | 3项PASS、2项NOT_TESTED；Tech Lead CHANGES_REQUESTED | 未批准 | 用户明确取消旧整体Demo实施 | 停止校准与功能编码；已有资源供新单元清单盘点，不把历史草稿当新任务输入 |
| ART-OCCLUSION-DEMO-001 桥栏与摊位屋檐前景分层 | CANCELLED（旧整体Demo作废） | art | deliverables/art/ART-OCCLUSION-DEMO-001/v0.1/ASSET_MANIFEST.md、ASSEMBLY_GUIDE.md、DELIVERABLE.json；tasks/ART-OCCLUSION-DEMO-001/TASK.json | v0.1（历史草稿） | 验收2项PASS、1项FAIL、1项NOT_TESTED；Tech Lead CHANGES_REQUESTED | 未批准 | 用户明确取消旧整体Demo实施 | 停止前景层制作；新遮挡单元另立规格 |
| UNIT-TEST-PLAN-001 资源盘点与可切换单元清单 | DONE（范围确认） | master | project/unit_tests/RESOURCE_UNIT_INVENTORY_v0.1.md；deliverables/master/UNIT-TEST-PLAN-001/v0.1/DELIVERABLE.json；tasks/UNIT-TEST-PLAN-001/ARTIFACT_APPROVAL.json | v0.1 | 清单自检4项PASS | USER_APPROVED（九单元实施范围） | 无 | 范围供 UNIT-SAMPLES-001 使用；样例成果另行验收 |
| UNIT-SAMPLES-001 九个可切换单元样例 | REVIEW | master | apps/client/assets/UnitSamples.scene；apps/client/assets/UnitSampleGallery.ts；project/unit_tests/UNIT_SAMPLES_v0.1.md；deliverables/master/UNIT-SAMPLES-001/v0.1/DELIVERABLE.json、VERIFICATION.md | v0.1 | 构建与桌面浏览器自检通过；待专业评审及QA | 样例版本未批准 | 真机触控/性能和正式四方向、分层资产待后续验证 | 专业评审和QA核验后呈用户验收；不将桌面FPS视为手机结论 |
| UNIT-PILOT-SELECT-001 首个实战对象选型 | DONE（选型范围） | master | project/unit_tests/PILOT_SELECTION_v0.3.md；deliverables/master/UNIT-PILOT-SELECT-001/v0.3/DELIVERABLE.json、REVIEW.json | v0.3 | 修订自评APPROVED；3项验收PASS | USER_APPROVED（店铺/店长单视角、旅客四方向、从零制作） | 无 | Product基于已批准选型提出本轮最小正式语义 |
| UNIT-PILOT-PRODUCT-001 孟桃奶茶店产品规格 | DONE（产品规格） | product | deliverables/product/UNIT-PILOT-PRODUCT-001/v0.1/PRODUCT_SPEC.md；ACCEPTANCE.md；DELIVERABLE.json、MASTER_REVIEW.json（同目录） | v0.1 | Master评审APPROVED；4项交付验收PASS | USER_APPROVED | 技术结构/图集预算待后续评审 | Master按已批准规格推进后续专业阶段；各阶段仍需独立审批 |
| UNIT-PILOT-ART-PREFLIGHT-001 出图前美术预案 | USER_REVIEW | art | deliverables/art/UNIT-PILOT-ART-PREFLIGHT-001/v0.1/ART_BRIEF.md、PARTS_PLAN.md、ASSET_MANIFEST.md、REFERENCE_AUDIT.md、DESIGN_RATIONALE.md、DELIVERABLE.json、TECH_REVIEW.json、MASTER_REVIEW.json（同目录） | v0.1 | Tech Lead与Master评审APPROVED；4项交付验收PASS | v0.1待用户确认 | 无概念图或正式图集；出图还需逐对象签认 | Master呈现预案；仅批准进入原创概念设计，不放行正式资源 |
| UNIT-PILOT-TECH-PREFLIGHT-001 骨骼图集与同源接入预审 | USER_REVIEW | tech_lead | deliverables/tech_lead/UNIT-PILOT-TECH-PREFLIGHT-001/v0.1/TECH_PREFLIGHT.md、CP_REVIEW.md、DELIVERABLE.json、MASTER_REVIEW.json（同目录） | v0.1 | Master评审APPROVED；4项交付验收PASS | v0.1待用户确认 | 目标设备、像素草排和真机性能尚缺；CP仍PROPOSED | Master呈现技术预审；正式出图与Creator实现仍锁定 |

## 版本与边界
- 用户于2026-09-30明确宣布旧整体Demo实施任务作废。DEMO-001及已批准专业规格保持历史审批事实，不再解锁旧整体Demo后续执行；CLIENT-CALIBRATION-DEMO-001、ART-OCCLUSION-DEMO-001 已取消，遮挡变更提案 CP-DEMO-OCCLUSION-001 停止。新「单元测试」系列从资源盘点草案重新审阅，未经用户确认不开发单元。
- v0.1至v0.6原文保留；历史审批决定保存为tasks/PRODUCT-001/ARTIFACT_APPROVAL_v0.x.json。
- 当前ARTIFACT_APPROVAL.json为v0.8 USER_REVIEW；v0.7退回记录已归档。用户未批准，任务未DONE。
- 用户明确方向由Master记入项目决策；整包概要和配置尚未获批，下游正式消费关闭。
- 当前游戏的Studio Layer快照与主模板提交 `1d155c993e7d33696ade22a39e3e92901c16d38a` 中本轮相关的13个通用文件核验一致；`.studio-lock.json` 已锁定该真实模板commit。主模板已由Master提交推送；本次Producer仅更新游戏工作区文件。
- 脑图方法提案记录 `user_approval=APPROVED`、`status=APPLIED`；当前游戏与主模板Studio文件及标准项目模板默认项已核验同步。该组织级批准不代表PRODUCT-001 v0.6获批。
- Git同步状态与Artifact审批状态分开记录；模板commit和推送不代表当前游戏概要得到用户批准。
- DEMO-001以用户最新Demo指令为独立输入；PRODUCT-001 v0.7只作背景参考，未获批准的概要不成为Demo下游正式输入。DEMO-001 v0.1产品规格已获用户明确批准，可解锁Tech Lead、Art、UI规格阶段；正式下游任务仍由Master创建，Client和QA执行须遵守后续审批门禁。
- DEMO-001当前审批记录为 `tasks/DEMO-001/ARTIFACT_APPROVAL.json`，状态 `USER_APPROVED`；Git同步状态与该审批决定分开。
- TECH-DEMO-001与ART-DEMO-001以上游已批准DEMO-001 v0.1规格为输入。用户在两个具体版本同时呈现后回复“继续吧”，Master确认批准TECH v0.2和ART v0.1；TECH v0.1要求修订的历史审批及产物保留。UI规格任务已满足Art输入门禁，可由Master创建；Client/QA可使用已批准技术设计，但正式编码仍需Client/Server Feature Brief与QA Test Plan等适用开工包审批，Client视觉实现仍需UI视觉Artifact审批。
- UI-DEMO-001与ART-ASSET-DEMO-001均使用已批准的Demo产品、Art方向和Tech设计。用户在两个具体版本同时呈现后回复“可以继续吧”，Master确认批准UI v0.1与Art资产包v0.2；v0.1资产草稿保留。两项均可作为Client正式视觉输入；编码前仍需适用的Client Feature Brief与QA Test Plan开工包审批。
- 用户于2026-09-30明确批准Client Brief v0.2、QA Plan v0.2和性能预算v0.1三项；各自审批记录独立保留，v0.1修订历史保留。Client Brief批准范围仅工程创建、已批准资产导入及无业务逻辑静态场景校准。Master已创建CLIENT-CALIBRATION-DEMO-001；实际参数/截图的新版本经Tech Lead评审和用户批准前，不得正式功能编码。

## 连续执行检查
2026-10-01：获批Product v0.1后，Art出图前预案与Tech图集/Creator同源预审均已实际产出、通过专业及Master评审，进入各自USER_REVIEW。两项只放行下一轮原创概念设计准备，不构成正式图片/骨骼图集或性能通过；无新增空转READY/IN_PROGRESS任务。

2026-10-01：用户要求落实店长与店铺绑定、三魂七魄恢复成长及四魂状态／三姿态表现。PRODUCT-001 v0.8交互图、可编辑源、导出快照、短说明、交付清单与评审已落盘；四项验收PASS，进入USER_REVIEW。无因此解锁的Art/UI/Tech/Client正式任务；现有其他任务线状态不因本版自动改变。

2026-10-01：UNIT-PILOT-PRODUCT-001 已实际提交 v0.1 产品规格、P01–P11验收及交付清单，Master评审通过，进入 USER_REVIEW。下游依赖用户批准，当前新增任务无空转 READY/IN_PROGRESS；CP-UNIT-REUSE-001 同源契约仍待评审。

2026-10-01：用户在选型v0.2呈现后提出方向修订并明确继续。v0.3已按单视角店铺/店长和四方向旅客修正，选型范围登记为USER_APPROVED；Product规格任务已创建并分派，后续将依据真实产出更新状态，不以READY作为本轮停点。

2026-10-01：用户退回 UNIT-PILOT-SELECT-001 v0.1，指出无经营品类与店长身份且要求不使用现有资源。v0.2 基于历史概念种子提出孟桃与奶茶店，从零制作边界已落盘并进入 USER_REVIEW；没有解锁任何正式美术或代码任务。

2026-10-01：UNIT-PILOT-SELECT-001 v0.1 已比较建筑、顾客与店长并提交中央可修复摊位选型，进入 USER_REVIEW。新样例正式产品、美术、技术、UI、VFX和QA仍受逐环节审批门禁约束；无以 READY/IN_PROGRESS 占位的新增任务。

2026-10-01：用户明确要求当前九个单元全部做样例，UNIT-TEST-PLAN-001 v0.1 实施范围获批。UNIT-SAMPLES-001 v0.1 场景、脚本、说明与验证记录已落盘；Creator Web Mobile 构建和桌面浏览器逐项操作通过，任务进入 REVIEW。不存在仅靠 READY/IN_PROGRESS 占位的可继续样例任务；专业评审、QA和用户验收仍待后续流程，正式手机性能及美术源图不在本版通过项内。

2026-09-30（新方向）：旧整体Demo活动任务已按用户指令取消，不再继续旧校准、遮挡分层或功能编码。UNIT-TEST-PLAN-001 的资源盘点草案已落盘并提交用户审阅，尚未批准制作任何单元；历史批准和产物保留供盘点，不迁移审批状态。

2026-09-30 19:38 连续执行检查：Client v0.3已由Creator重开保存17×17 TileMap、12个场景Prefab实例及152个序列化对象，validate-static-scene.mjs通过。BridgeTail(350,-700) 后新增地图外 BeyondExit(820,-840)，第12行第15、16列（零基）改为出口石路，静态采样通过。用户真实默认 Web 截图摄于新增出口段之前；新出口段、近远倍率及边界画面仍无真实Creator证据。Tech Lead对Client v0.3复评为 CHANGES_REQUESTED，Client保持BLOCKED。Art任务已实际开始并落盘v0.1清单、拼装说明和交付记录；四张精确前景PNG未能可靠制作，交付验收2项PASS、1项FAIL、1项NOT_TESTED，Art进入有明确原因的BLOCKED，Tech Lead正评审两种替代方案。PRODUCT-001仍USER_REVIEW；本次检查无仅靠READY/IN_PROGRESS占位的任务。Art新方案及Client当前版校准经专业评审与用户批准前，正式交互编码关闭。
