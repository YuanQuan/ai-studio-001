# 工作流状态

2026-10-05 最新门禁：示例1四层切图 Gate2 已获用户批准，Tech Lead 场景接入技术增量 v0.2 已于 2026-10-05 18:48:35 +08:00 登记 USER_APPROVED，并经 Master 最终接受为 DONE。批准仅覆盖技术方案与美术交付/Cocos 正式资源双目录、命名计划；Creator 导入、UUID、Web 运行、性能及后续 Client/QA 开工包仍有独立门禁。现阶段测试范围为 Web 多模拟手机竖屏分辨率，非实体机。

2026-10-05 先前增量（历史快照）：用户指定的四层场景用于单元示例1，已追加隔离预览、产品范围修订、Art/Tech 只读预审、当前图组 Gate1 制作预案及 Gate2 切图审查任务线。以下 2026-10-03 的 33 条统计及旧空景叙述保留为历史快照；本图组当前门禁以新增任务行及审批记录为准。Product v0.1 六方同版评审通过，用户明确批准，于 2026-10-05 14:36:14 +08:00 登记，Task DONE；当前资源 Art 预案 v0.1 已 9/9 Required、五项 PASS、Art/Tech/Client/Master 四份同版 Review APPROVED；用户于 2026-10-05 15:24:18 +08:00 明确批准本四层图组 Gate1，Task DONE。用户已声明拥有原图及商用改编权，此为声明证据，未独立核验权属或完整生成链。用户先前明确撤回“首屏桥与月亮同见”，并要求不改动美术资源；当前 PSD 与四张 PNG 保持原样，任何图像修改不启动。切图 v0.1 的 16/16 Required 文件已落盘，静态同源与同尺度重组三项验收 PASS；Art/Tech/Master Review 均 CHANGES_REQUESTED。用户已允许本机 127.0.0.1:8765 用于本图组预览，Master 通过 CUA 实看两种竖屏、1.0/1.8 倍及左右端拖动，旧访问阻塞解除；可持久追溯的新动态证据和 v0.2 正式 Review 尚未落盘，Task REVISION，不推定动态验收通过。四层切图 Gate2 与 Creator 正式接入继续关闭。

本轮 continuity check：产品、当前资源 Gate1、切图 Gate2 与 Tech v0.2 均 DONE；Client/QA 编码前开工包为已解锁后续，Owner 实产与独立评审需继续追踪，不以 READY/IN_PROGRESS 占位结束授权推进。具体 Web 矩阵及性能预算运行验收前另审。

以下为 2026-10-03 历史快照（由 Producer 当时维护，非当前四层图组状态）。当时范围：七项单元示例先仅第1项空场景；正式资源制作方案 v0.1 Gate 1 已 USER_APPROVED。R3 天空＋R5 月亮＋山雾 R2 A 的中央三层探索小样经 Art 阶段审图与 Tech 后验通过。Stage1 首张 `GROUND_STREET` 街面 Art 判 REVISE（街面过浅、两坡脚透明、水口过宽），岸/水/月影顺序停机；街面 R2 预案 Tech 判 CHANGES_REQUESTED，R2B 修订待完成新同版双签。BASE 仍 REVISION/DRAFT；旧 R1–R4 探索保留隔离历史，第2–7项暂缓，切图效果 Gate 2 未开始，Client 正式接入关闭。历史 UNIT-RESTART-20261002 记录仍保留。

## 汇总
- 正式任务线：23 <!-- UNIT-NEXTSTAGE-20261002 -->
- 待用户审批：5（PRODUCT-001独立待审；孟桃Tech、Art出图前方案、UI、VFX各v0.1待审；概念v0.5已批准） <!-- UNIT-NEXTSTAGE-20261002 -->
- 当前产品文档任务阻塞：0
- 历史初始化阻塞本轮未重新验证。

## 当前任务线
| 任务 | 阶段 | Owner | 当前 Artifact | 版本 | 专业评审 | 用户审批 | 阻塞 | 下一动作 |
|---|---|---|---|---|---|---|---|---|
| UNIT-MENU-PARALLAX-PREVIEW-001 竖屏视差隔离预览 | REVIEW | master | deliverables/master/UNIT-MENU-PARALLAX-PREVIEW-001/v0.1/index.html、preview.js、geometry_report.json、REVIEW.md、DELIVERABLE.json；tasks/UNIT-MENU-PARALLAX-PREVIEW-001/ARTIFACT_APPROVAL.json | v0.1 | 交互预览与 12 组几何覆盖已落盘；触控和 Creator 未测，Task 验收待 Master 核 | PROFESSIONAL_REVIEW；无单独用户批准，非 Gate2 | 当前四 PNG/PSD 只读；预览不是生产资源 | Master 核同版交付与 Review，维持与正式接入隔离 |
| UNIT-MENU-SCENE1-SCOPE-001 单元示例1产品增量 | DONE（仅产品增量） | product | deliverables/product/UNIT-MENU-SCENE1-SCOPE-001/v0.1/PRODUCT_DELTA.md、ACCEPTANCE.md、CHANGE_IMPACT.md、DELIVERABLE.json、Product/Art/Tech/Client/QA/Master 六份 Review；tasks/UNIT-MENU-SCENE1-SCOPE-001/ARTIFACT_APPROVAL.json | v0.1 | 10/10 Required、五项验收同序 PASS、六方同版 Review APPROVED；权利信息按用户声明记录，未写成独立核验 | USER_APPROVED（2026-10-05 14:36:14 +08:00，仅产品语义与验收） | 旧 A03 空底板与现图固定树、灯、纸船冲突按获批增量处理；PSD/四 PNG 不改，Gate2 与 Creator 未批 | Master 可组织下游规格修订与正式资源评审；不得将此审批当作图片 Gate1/Gate2 或正式接入许可 |
| UNIT-MENU-FOUR-LAYER-ART-PREFLIGHT-001 四层只读美术预审 | REVIEW（报告通过，资源仍待修） | art | deliverables/art/UNIT-MENU-FOUR-LAYER-ART-PREFLIGHT-001/v0.1/ART_ASSESSMENT.md、ART_REVIEW.json、DELIVERABLE.json；tasks/UNIT-MENU-FOUR-LAYER-ART-PREFLIGHT-001/ARTIFACT_APPROVAL.json | v0.1 | 3/3 Required、四项报告验收 PASS；Art Review APPROVED 只针对只读预审报告，资源本身 CHANGES_REQUESTED | PROFESSIONAL_REVIEW（此任务审批类型 REVIEW）；非 Gate2 | 用户声明拥有原图及商用改编权，权属/生成链未独立核验；动态透明边待验证，图片未修改 | Art 后续补来源记录和动态检查，正式切片视觉 Review 另办；任何改图先告知用户 |
| UNIT-MENU-FOUR-LAYER-TECH-PREFLIGHT-001 四层只读技术预审 | REVIEW | tech_lead | deliverables/tech_lead/UNIT-MENU-FOUR-LAYER-TECH-PREFLIGHT-001/v0.1/TECH_ASSESSMENT.md、TECH_REVIEW.json、DELIVERABLE.json；tasks/UNIT-MENU-FOUR-LAYER-TECH-PREFLIGHT-001/ARTIFACT_APPROVAL.json | v0.1 | 四项自评 PASS，Tech 仅对预审结论 APPROVED；Creator/真机 NOT_TESTED | PROFESSIONAL_REVIEW；无用户批准，非 Gate2 | 2172px 宽图兼容性、纹理与 alpha 运行数据缺失 | Master 核同版预审，正式生产审查和 Gate2 另行办理 |
| UNIT-MENU-FOUR-LAYER-PRODUCTION-PLAN-001 当前四层资源制作与切图预案 | DONE | art | deliverables/art/UNIT-MENU-FOUR-LAYER-PRODUCTION-PLAN-001/v0.1/ART_PRODUCTION_PLAN.md、VISUAL_ANCHORS.md、RIGHTS_AND_SOURCE.md、CUT_COLLABORATION_PLAN.md、DELIVERABLE.json、ART_REVIEW.json、TECH_PREFLIGHT_REVIEW.json、CLIENT_IMPACT_REVIEW.json、MASTER_REVIEW.json；tasks/UNIT-MENU-FOUR-LAYER-PRODUCTION-PLAN-001/TASK.json、ARTIFACT_APPROVAL.json | v0.1 | 9/9 Required、五项 Task 验收同序 PASS、Art/Tech/Client/Master 四份同版 Review APPROVED | USER_APPROVED（2026-10-05 15:24:18 +08:00；仅本图组 Gate1 制作方案） | 预案要求现有 PSD 与四 PNG 原样；尚无图片变更、切图实图 Gate2 或 Creator 验收 | Art/Tech 同版首图前预签后核现有文件，具体实图 Gate2 另办 |
| UNIT-MENU-FOUR-LAYER-CUT-001 当前四层切图效果 Gate2 用户审核 | DONE | art | deliverables/art/UNIT-MENU-FOUR-LAYER-CUT-001/v0.3/USER_REVIEW_PACKET.md、DELIVERABLE.json；deliverables/master/UNIT-MENU-FOUR-LAYER-CUT-001/v0.3/ACCEPTANCE.md；现有 PSD、四张全画布 PNG 与 overall_from_psd.png；tasks/UNIT-MENU-FOUR-LAYER-CUT-001/ARTIFACT_APPROVAL.json | v0.3 | PSD/四 PNG 哈希与 v0.1 清单一致，原位同尺度重组可查看；依新规则直接由用户审核，旧 Review 留历史 | USER_APPROVED（2026-10-05 17:56:22 +08:00；仅本切图版本与效果） | Creator/Web 运行效果、纹理兼容及性能未测，源图不改 | Tech Lead 编制接入规格；Client 开工包仍须独立审批 |
| UNIT-MENU-SCENE1-TECH-RUNTIME-001 示例1四层场景接入技术增量 | DONE（技术方案） | tech_lead | deliverables/tech_lead/UNIT-MENU-SCENE1-TECH-RUNTIME-001/v0.2/TECH_RUNTIME_SPEC.md、PERFORMANCE_GATE_IMPACT.md、RESOURCE_PATH_AND_NAMING_SPEC.md、DELIVERABLE.json、TECH_REVIEW.json、ART_REVIEW.json、CLIENT_REVIEW.json、MASTER_REVIEW.json；project/ASSET_HANDOFF_REGISTRY.md；deliverables/master/UNIT-MENU-SCENE1-TECH-RUNTIME-001/v0.2/MASTER_ACCEPTANCE.md；tasks/UNIT-MENU-SCENE1-TECH-RUNTIME-001/ARTIFACT_APPROVAL.json、ARTIFACT_APPROVAL_v0.1.json | v0.2 已批；v0.1 退回历史 | 10/10 Required；六项验收同序 PASS；Tech/Art/Client/Master 同版 Review APPROVED；Master 最终接受 | USER_APPROVED（2026-10-05 18:48:35 +08:00 登记，仅 v0.2 方案） | Creator 正式资源/.meta/UUID 尚未创建；2172 宽纹理、透明边、Web 运行与性能未测；具体倍率、Web 矩阵及预算另审 | Client/QA 两个编码前开工包分别编制、交叉评审并送用户审核 |
| ART-DIRECTION-FIRST-STREET-001 横向主街美术基线与建筑修订 | DONE（选定参考恢复范围） | art | deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.4/SELECTED_REFERENCE.md、REFERENCE_AUDIT.md、scenes/night-market-selected-reference.png、DELIVERABLE.json、ART_REVIEW.json、MASTER_REVIEW.json | v0.4（精确恢复用户附件） | 3项验收PASS；Art、Master APPROVED仅恢复参考 | USER_APPROVED仅未加宽非像素附件的比例/布局/画风；旧v0.3加宽A/B REJECTED | 无恢复参考阻塞；生产参数和新单元未批准 | 供孟桃v0.5概念参考；正式图集/骨骼/字体/Creator另经签认审批 | <!-- UNIT-RESTART-20261002 -->
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
| UNIT-TEST-PLAN-001 资源盘点与可切换单元清单 | DONE（历史范围确认） | master | project/unit_tests/RESOURCE_UNIT_INVENTORY_v0.1.md；deliverables/master/UNIT-TEST-PLAN-001/v0.1/DELIVERABLE.json；tasks/UNIT-TEST-PLAN-001/ARTIFACT_APPROVAL.json | v0.1 | 清单自检4项PASS | USER_APPROVED（当时九单元实施范围） | 无 | 旧实施范围保留历史；新孟桃单元按后续独立专业Task推进 | <!-- UNIT-NEXTSTAGE-20261002 -->
| UNIT-SAMPLES-001 九个可切换单元样例 | CANCELLED（旧版替换） | master | apps/client/assets/UnitSamples.scene；apps/client/assets/UnitSampleGallery.ts；project/unit_tests/UNIT_SAMPLES_v0.1.md；deliverables/master/UNIT-SAMPLES-001/v0.1/DELIVERABLE.json、VERIFICATION.md | v0.1（历史未批准） | 构建与桌面浏览器自检通过；专业评审/QA未完成 | 样例成果未获批准 | 用户要求重启并替换旧版；Master取消本旧任务 | 旧文件留档，后续正式Client开工包与新孟桃资源再替换工程入口，不能记DONE | <!-- UNIT-NEXTSTAGE-20261002 -->
| UNIT-PILOT-SELECT-001 首个实战对象选型 | DONE（选型范围） | master | project/unit_tests/PILOT_SELECTION_v0.3.md；deliverables/master/UNIT-PILOT-SELECT-001/v0.3/DELIVERABLE.json、REVIEW.json | v0.3 | 修订自评APPROVED；3项验收PASS | USER_APPROVED（店铺/店长单视角、旅客四方向、从零制作） | 无 | Product基于已批准选型提出本轮最小正式语义 |
| UNIT-PILOT-PRODUCT-001 孟桃奶茶店产品规格 | DONE（产品规格） | product | deliverables/product/UNIT-PILOT-PRODUCT-001/v0.1/PRODUCT_SPEC.md；ACCEPTANCE.md；DELIVERABLE.json、MASTER_REVIEW.json（同目录） | v0.1 | Master评审APPROVED；4项交付验收PASS | USER_APPROVED | 技术结构/图集预算待后续评审 | Master按已批准规格推进后续专业阶段；各阶段仍需独立审批 |
| UNIT-PILOT-ART-PREFLIGHT-001 出图前美术预案 | DONE | art | deliverables/art/UNIT-PILOT-ART-PREFLIGHT-001/v0.1/ART_BRIEF.md、PARTS_PLAN.md、ASSET_MANIFEST.md、REFERENCE_AUDIT.md、DESIGN_RATIONALE.md、DELIVERABLE.json、TECH_REVIEW.json、MASTER_REVIEW.json（同目录） | v0.1 | Tech Lead与Master评审APPROVED；4项交付验收PASS | USER_APPROVED | 无概念图或正式图集；出图还需逐对象签认 | 可供原创概念设计使用，不放行正式资源 |
| UNIT-PILOT-TECH-PREFLIGHT-001 骨骼图集与同源接入预审 | DONE | tech_lead | deliverables/tech_lead/UNIT-PILOT-TECH-PREFLIGHT-001/v0.1/TECH_PREFLIGHT.md、CP_REVIEW.md、DELIVERABLE.json、MASTER_REVIEW.json（同目录） | v0.1 | Master评审APPROVED；4项交付验收PASS | USER_APPROVED | 目标设备、像素草排和真机性能尚缺；CP仍PROPOSED | 可供原创概念设计参考；正式出图与Creator实现仍锁定 |
| UNIT-PILOT-ART-CONCEPT-001 孟桃与奶茶店原创概念 | DONE（概念阶段） | art | deliverables/art/UNIT-PILOT-ART-CONCEPT-001/v0.5/ART_BRIEF.md、characters/mengtao-concept.png、scenes/milk-tea-shop-concept.png、scenes/mengtao-shop-relationship.png、PARTS_PLAN.md、ASSET_MANIFEST.md、DESIGN_RATIONALE.md、REFERENCE_AUDIT.md、GENERATION_PROMPT.md、RESTART_AUDIT.md、DELIVERABLE.json、ART_REVIEW.json、TECH_REVIEW.json、MASTER_REVIEW.json | v0.5（替换旧概念待审版） | 3张实图与独立拆件/工程审计落盘；5项PASS；Art/Tech/Master APPROVED仅概念 | USER_APPROVED仅三图与拆件；旧v0.4 REJECTED留档 | 分层母版/骨骼单页图集/正式字体/设备/Creator接入尚未完成 | 新四专业任务可使用v0.5设计输入，分别产出并进入下一用户门禁 | <!-- UNIT-NEXTSTAGE-20261002 -->
| UNIT-PILOT-TECH-DESIGN-001 孟桃同源工程与骨骼接入设计 | USER_REVIEW | tech_lead | deliverables/tech_lead/UNIT-PILOT-TECH-DESIGN-001/v0.1/TECH_DESIGN.md、CREATOR_DEPENDENCY_AUDIT.md、CP_REVIEW.md、ASSET_PIPELINE.md、REVIEW.md、DELIVERABLE.json、MASTER_REVIEW.json；tasks/UNIT-PILOT-TECH-DESIGN-001/ARTIFACT_APPROVAL.json | v0.1 | 5项PASS；Tech/Master评审APPROVED | 待用户批准技术设计与架构选择；CP仍PROPOSED | 工程/骨骼/性能尚未实作；合法作者工具待落实 | Master呈本版，批准后方可记录项目级架构决策并开下游工程包 | <!-- UNIT-NEXTSTAGE-20261002 -->
| UNIT-PILOT-ART-SOURCE-PREFLIGHT-001 分层与骨骼出图前签认 | USER_REVIEW | art | deliverables/art/UNIT-PILOT-ART-SOURCE-PREFLIGHT-001/v0.1/ART_BRIEF.md、PARTS_BOUNDING_PLAN.md、ATLAS_PLAN.md、ASSET_MANIFEST.md、REFERENCE_AUDIT.md、DESIGN_RATIONALE.md、ART_REVIEW.json、TECH_REVIEW.json、DELIVERABLE.json、MASTER_REVIEW.json；tasks/UNIT-PILOT-ART-SOURCE-PREFLIGHT-001/ARTIFACT_APPROVAL.json | v0.1 | 5项PASS；Art/Tech/Master评审APPROVED | 待用户批准出图前方案 | 实际分件/自动pack/Spine/目标机尚未执行 | Master呈本版；批准后制作真实源，导出前需逐件再双签 | <!-- UNIT-NEXTSTAGE-20261002 -->
| UNIT-PILOT-UI-SPEC-001 身份UI与Lab控制规格 | USER_REVIEW | ui | deliverables/ui/UNIT-PILOT-UI-SPEC-001/v0.1/UI_SPEC.md、COLOR_SYSTEM.md、COMPONENT_SPEC.md、SCREEN_STATES.md、screens/identity-portrait-adaptation.svg、screens/identity-work-state.svg、components/identity-card-states.svg、ART_REVIEW.json、DELIVERABLE.json、MASTER_REVIEW.json；tasks/UNIT-PILOT-UI-SPEC-001/ARTIFACT_APPROVAL.json | v0.1 | 4项PASS；Art/Master评审APPROVED，三张SVG有预览 | 待用户批准UI规格 | 字体文件、Creator实际画布及设备尚未验证 | Master呈竖屏样张/组件；批准后正式制作共享组件与许可核验 | <!-- UNIT-NEXTSTAGE-20261002 -->
| UNIT-PILOT-VFX-SPEC-001 工作轻量反馈规格 | USER_REVIEW | vfx | deliverables/vfx/UNIT-PILOT-VFX-SPEC-001/v0.1/VFX_SPEC.md、ASSET_REQUIREMENTS.md、ART_REVIEW.json、DELIVERABLE.json、MASTER_REVIEW.json；tasks/UNIT-PILOT-VFX-SPEC-001/ARTIFACT_APPROVAL.json | v0.1 | 3项PASS；Art/Master评审APPROVED | 待用户批准VFX规格 | 独立骨骼特效页、Creator及目标机尚未验证 | Master呈本版；批准后Art制作原创短弧资源并联合Tech核验 | <!-- UNIT-NEXTSTAGE-20261002 -->
| UNIT-MENU-PRODUCT-001 新七项菜单单元样例产品规格 | USER_REVIEW | product | deliverables/product/UNIT-MENU-PRODUCT-001/v0.1/PRD.md、ACCEPTANCE.md、FLOW.md、CHANGE_IMPACT.md、DELIVERABLE.json、PRODUCT_REVIEW.json、六专业IMPACT_REVIEW.json、MASTER_REVIEW.json；tasks/UNIT-MENU-PRODUCT-001/ARTIFACT_APPROVAL.json | v0.1 | 13项Required Artifact齐全并通过schema；五项PASS；Product/Tech/Art/UI/VFX/Client/QA/Master八Review均APPROVED；DEC-UNIT-DIRECTION-003已纳入 | 待用户审阅批准本产品v0.1 | 四份孟桃专业v0.1仍各自USER_REVIEW；新增资产与Creator/QA执行均未获批 | Master呈PRD、验收、流程及影响；获用户明确批准后才解锁后续专业修订任务 | <!-- UNIT-MENU-20261002 -->

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
2026-10-01：UNIT-PILOT-ART-CONCEPT-001 v0.4 的三张概念图、设计说明、来源档案与交付清单已落盘，五项验收PASS；Product范围、Tech Lead与Master评审均APPROVED，仅限概念。任务和审批记录进入USER_REVIEW，等待用户明确决定。Producer核验全部Task状态，无READY或IN_PROGRESS空转任务；PRODUCT-001独立保持USER_REVIEW。正式分层源、骨骼单页图集、目标设备性能与Creator接入仍须后续审批。

2026-10-01：用户退回 UNIT-PILOT-ART-CONCEPT-001 v0.3，要求店铺logo换为带吸管的奶茶杯，孟桃只在一枚腰牌保留“孟”字。v0.3 REJECTED 决定已归档；v0.4 修订输入已落盘，Art与Product执行中。三张图、Tech Lead与Master复评未齐，故保持REVISION，不计入待用户审批。正式分层源、骨骼单页图集与Creator接入仍锁定。

2026-10-01：用户批准美术与技术出图前预案后，Art实际生成角色、店铺、同屏关系三张概念图并提交完整来源档案；Tech Lead与Master复核通过，UNIT-PILOT-ART-CONCEPT-001进入USER_REVIEW。Art/Tech预案任务DONE；新建概念任务已产出，无仅靠READY/IN_PROGRESS占位的新增任务。正式图片、骨骼与Creator实施仍锁定。

2026-10-01：获批Product v0.1后，Art出图前预案与Tech图集/Creator同源预审均已实际产出、通过专业及Master评审，进入各自USER_REVIEW。两项只放行下一轮原创概念设计准备，不构成正式图片/骨骼图集或性能通过；无新增空转READY/IN_PROGRESS任务。

2026-10-01：用户要求落实店长与店铺绑定、三魂七魄恢复成长及四魂状态／三姿态表现。PRODUCT-001 v0.8交互图、可编辑源、导出快照、短说明、交付清单与评审已落盘；四项验收PASS，进入USER_REVIEW。无因此解锁的Art/UI/Tech/Client正式任务；现有其他任务线状态不因本版自动改变。

2026-10-01：UNIT-PILOT-PRODUCT-001 已实际提交 v0.1 产品规格、P01–P11验收及交付清单，Master评审通过，进入 USER_REVIEW。下游依赖用户批准，当前新增任务无空转 READY/IN_PROGRESS；CP-UNIT-REUSE-001 同源契约仍待评审。

2026-10-01：用户在选型v0.2呈现后提出方向修订并明确继续。v0.3已按单视角店铺/店长和四方向旅客修正，选型范围登记为USER_APPROVED；Product规格任务已创建并分派，后续将依据真实产出更新状态，不以READY作为本轮停点。

2026-10-01：用户退回 UNIT-PILOT-SELECT-001 v0.1，指出无经营品类与店长身份且要求不使用现有资源。v0.2 基于历史概念种子提出孟桃与奶茶店，从零制作边界已落盘并进入 USER_REVIEW；没有解锁任何正式美术或代码任务。

2026-10-01：UNIT-PILOT-SELECT-001 v0.1 已比较建筑、顾客与店长并提交中央可修复摊位选型，进入 USER_REVIEW。新样例正式产品、美术、技术、UI、VFX和QA仍受逐环节审批门禁约束；无以 READY/IN_PROGRESS 占位的新增任务。

2026-10-01：用户明确要求当前九个单元全部做样例，UNIT-TEST-PLAN-001 v0.1 实施范围获批。UNIT-SAMPLES-001 v0.1 场景、脚本、说明与验证记录已落盘；Creator Web Mobile 构建和桌面浏览器逐项操作通过，任务进入 REVIEW。不存在仅靠 READY/IN_PROGRESS 占位的可继续样例任务；专业评审、QA和用户验收仍待后续流程，正式手机性能及美术源图不在本版通过项内。

2026-09-30（新方向）：旧整体Demo活动任务已按用户指令取消，不再继续旧校准、遮挡分层或功能编码。UNIT-TEST-PLAN-001 的资源盘点草案已落盘并提交用户审阅，尚未批准制作任何单元；历史批准和产物保留供盘点，不迁移审批状态。

2026-09-30 19:38 连续执行检查：Client v0.3已由Creator重开保存17×17 TileMap、12个场景Prefab实例及152个序列化对象，validate-static-scene.mjs通过。BridgeTail(350,-700) 后新增地图外 BeyondExit(820,-840)，第12行第15、16列（零基）改为出口石路，静态采样通过。用户真实默认 Web 截图摄于新增出口段之前；新出口段、近远倍率及边界画面仍无真实Creator证据。Tech Lead对Client v0.3复评为 CHANGES_REQUESTED，Client保持BLOCKED。Art任务已实际开始并落盘v0.1清单、拼装说明和交付记录；四张精确前景PNG未能可靠制作，交付验收2项PASS、1项FAIL、1项NOT_TESTED，Art进入有明确原因的BLOCKED，Tech Lead正评审两种替代方案。PRODUCT-001仍USER_REVIEW；本次检查无仅靠READY/IN_PROGRESS占位的任务。Art新方案及Client当前版校准经专业评审与用户批准前，正式交互编码关闭。

2026-10-01：用户退回 UNIT-PILOT-ART-CONCEPT-001 v0.1，要求孟桃体现孟婆家族视觉线索，奶茶店体现现代设备、价目表和牛奶瓶。Art已实际提交v0.2三张修订概念图、说明、来源记录与交付清单；Product范围评审仅批准概念边界，Tech与Master复评进行中。当前为REVIEW而非USER_REVIEW，正式资源与Creator实施仍锁定；无新增空转READY/IN_PROGRESS任务。
2026-10-01：UNIT-PILOT-ART-CONCEPT-001 v0.2 的 Tech Lead 与 Master 评审均已通过，五项验收PASS，正式进入 USER_REVIEW。v0.1 的 REJECTED 决定保留，不能作为正式视觉输入。连续执行检查：本轮Art修订有三张图和交付档案，专业复评有落盘结果；新增任务未以 READY/IN_PROGRESS 空转，产品总纲独立停在 USER_REVIEW，单元样例独立停在 REVIEW。统一分层源、骨骼单页图集、目标设备性能与 Creator 接入继续按后续审批门禁执行。

2026-10-01：用户退回 UNIT-PILOT-ART-CONCEPT-001 v0.2，要求复古中式木构或砖房、可爱卡通孟桃与可辨认“孟”字、纸盒装牛奶。v0.2 REJECTED 决定已归档；v0.3 修订输入及Product概念范围评审已落盘，Art正在修订，Tech Lead与Master复评未齐，故保持REVISION，暂不计入待用户审批。正式分层源、骨骼单页图集和Creator接入仍锁定。
2026-10-01：UNIT-PILOT-ART-CONCEPT-001 v0.3 的三张最终概念图、设计说明、来源与交付清单已落盘；五项验收PASS，Product范围、Tech Lead与Master评审均APPROVED，仅限概念。任务和审批记录均进入USER_REVIEW，等待用户明确决定。Producer核验全部Task状态，无READY或IN_PROGRESS空转任务；PRODUCT-001 v0.16独立保持USER_REVIEW。统一分层源、骨骼单页图集、目标设备性能与Creator接入仍须后续审批。

## 横向主街美术基线本轮记录

- 待用户审批：3（PRODUCT-001 v0.20；孟桃奶茶店原创概念 v0.4；ART-DIRECTION-FIRST-STREET-001 v0.3含效果图v0.6 A/B；原Art/Tech出图前预案各v0.1已获批）

- 用户于2026-10-02明确采纳STYLE_STUDY v0.3的布局和画风；具体范围见tasks/ART-DIRECTION-FIRST-STREET-001/SCOPE_ACCEPTANCE.md。新建筑修订及长期美术原则由ART-DIRECTION-FIRST-STREET-001另立版本审批；本次未批准PRODUCT-001 v0.20或孟桃概念v0.4整版。

2026-10-02：ART-DIRECTION-FIRST-STREET-001 v0.1的八条美术原则、v0.4横向效果图、来源/提示词档案、资产清单、Art/Tech/Master三Review及项目指南已实际落盘；五项验收PASS，三Review均APPROVED，仅限概念方向。任务与审批记录转USER_REVIEW；Producer扫描全部Task，更新后无READY/IN_PROGRESS空转任务。PRODUCT-001 v0.20和孟桃概念v0.4仍独立待审；用户已采纳v0.3布局/画风的局部范围不会提前放行新细则、分层母版、骨骼单页图集或Creator正式生产。

2026-10-02：ART-DIRECTION-FIRST-STREET-001 v0.3完整方向包与v0.6 A原插画/B轻像素双图、来源/四次实际提示词/候选档案已落盘；五项验收逐项PASS且与Task一致，Art/Tech/Master最终Review均APPROVED仅概念。Task和Approval转USER_REVIEW，19Task扫描无READY/IN_PROGRESS/REVISION空转，见tasks/ART-DIRECTION-FIRST-STREET-001/CONTINUITY_CHECK_v0.3.md。用户采纳v0.3原布局/画风范围、v0.1/v0.2退回历史保留；本次A/B待选未批准、Product与孟桃独立审批和正式生产门禁保持。

2026-10-02：ART-DIRECTION-FIRST-STREET-001 v0.2完整方向包、v0.5 A原插画/B轻像素双图及来源/四次实际提示词档案已落盘；五项验收PASS，Art/Tech/Master最终Review均APPROVED仅概念。Task和Approval转USER_REVIEW，19个Task扫描无READY/IN_PROGRESS/REVISION空转，见tasks/ART-DIRECTION-FIRST-STREET-001/CONTINUITY_CHECK_v0.2.md。用户采纳v0.3布局/原画方向保留，v0.1退回记录保留；A/B选择、八条原则和正式生产未自动批准，Product与孟桃独立审批保持。

2026-10-02：用户退回ART-DIRECTION-FIRST-STREET-001 v0.1效果图的桥和牌匾，并授权A原插画/B轻像素双版比较；v0.1 REJECTED归档，v0.2修订输入和参考真实存在，当前REVISION，Master与Art/Tech本轮持续产出。五项验收和三Review未齐，尚不可USER_REVIEW；待完成后执行结束前continuity check。已采纳v0.3布局/原画方向保留，八条原则未被推定全部拒绝。

<!-- UNIT-RESTART-20261002 START -->
2026-10-02：用户精确附件v0.4已原样恢复，三项验收PASS且Art/Master复核通过，仅该未加宽非像素视觉参考范围USER_APPROVED；旧加宽A/B及旧孟桃v0.4退回历史保留。孟桃v0.5三张新图、可执行拆件方案、来源/三次实际提示词与旧Creator真实UUID审计全部落盘；五项验收PASS，Art/Tech/Master概念Review APPROVED，Task/Approval转USER_REVIEW。19Task全量连续检查无空转READY/IN_PROGRESS/REVISION，本轮停在新概念用户审阅门禁；正式骨骼/图集/同源Prefab/Creator工程替换未执行，也不移用旧桌面FPS记录证明新性能。
<!-- UNIT-RESTART-20261002 END -->

- 2026-10-02 UNIT-NEXTSTAGE-20261002：孟桃概念v0.5在三图与拆件具体呈现后收到用户“好的继续把”，审批记录已记USER_APPROVED，概念Task DONE；四专业任务由Master建立，Producer核对Product v0.1与Art概念v0.5门禁并解锁。四Owner均已实际提交Required Artifact，专业和Master评审通过，详见上表与project/unit_tests/UNIT_PILOT_NEXT_STAGE_v0.1.md；当前四任务USER_REVIEW。旧九样例正式任务已取消。正式骨骼、图集及Creator仍需后续门禁。
2026-10-02 UNIT-NEXTSTAGE-20261002：23个Task逐项扫描，四个新专业Task均有本轮Owner真实文档/可编辑SVG产出、Required路径齐备、Task/Deliverable/Review Schema有效、验收逐项PASS、专业与Master Review均APPROVED，已全部进入USER_REVIEW；因此本轮孟桃概念v0.5批准后的授权推进已到下一用户门禁，无READY/IN_PROGRESS/REVISION/REVIEW空转。PRODUCT-001仍为独立USER_REVIEW。旧UNIT-SAMPLES-001 v0.1由Master依据用户重启替换指令取消，旧工程文件留档而成果未获批准。四项未获用户批准前，Client/正式骨骼、图集、Creator接入仍锁定。
