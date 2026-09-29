# 用户审批记录

Producer 记录具体版本的决定；专业评审不替代用户批准。

| 时间 | 任务 | Artifact | 版本 | 路径 | 决定 | 用户反馈 | 替代版本 |
|---|---|---|---|---|---|---|---|
| 2026-09-28 | PRODUCT-001 | 产品概要 | v0.1 | deliverables/product/PRODUCT-001/v0.1/PRODUCT_OUTLINE.md | REJECTED（要求修订） | Master转达：普通店员辅助；顾客独立模块，多类触发及店长/装扮互动，建立配置体系 | v0.2随后要求修订，未批准 |
| 2026-09-28 | PRODUCT-001 | 产品概要 | v0.2 | deliverables/product/PRODUCT-001/v0.2/PRODUCT_OUTLINE.md | REJECTED（要求修订） | Master转达：独立十八层进货系统，后期每日世界限量资源争夺 | v0.3修订中，未批准 |
| 2026-09-28 | PRODUCT-001 | 产品概要 | v0.3 | deliverables/product/PRODUCT-001/v0.3/PRODUCT_OUTLINE.md | REJECTED（要求修订） | Master转达：单一共享世界、顾客访问/接待排队及闹事惩罚 | v0.4修订中，未批准 |
| 2026-09-29 | PRODUCT-001 | 产品概要 | v0.4 | deliverables/product/PRODUCT-001/v0.4/PRODUCT_OUTLINE.md | REJECTED（要求修订） | Master转达：头脑风暴阶段需补多玩法留存、粘性、分享传播和自愿广告闭环，说明十八层的作用与边界 | v0.5修订中，未批准 |
| 2026-09-29 | PRODUCT-001 | 产品概要 | v0.5 | deliverables/product/PRODUCT-001/v0.5/PRODUCT_OUTLINE.md | REJECTED（要求修订） | Master转达：排队不使顾客离开；少量定时打卡窗口；中期24小时含离线自动经营；非纯线性长线目标；以简洁脑图表达 | v0.6修订中，未批准 |
| 2026-09-29 | PRODUCT-001 | 产品概要与脑图 | v0.6 | deliverables/product/PRODUCT-001/v0.6/PRODUCT_OUTLINE.md | REJECTED（要求修订） | Master转达：系统玩法为脑图主干，补摊位与经济资源闭环；分享等改为节点标签；每个定时任务限时至少1小时 | v0.7修订中，未批准 |
| 2026-09-29 | DEMO-001 | Demo产品规格 | v0.1 | deliverables/product/DEMO-001/v0.1/DEMO_PRODUCT_SPEC.md | USER_APPROVED | 用户明确批准v0.1；Master通知Producer登记 | 当前正式版本，供后续规格任务使用 |
| 2026-09-29 | TECH-DEMO-001 | Demo技术设计 | v0.1 | deliverables/tech_lead/TECH-DEMO-001/v0.1/TECH_DESIGN.md | REJECTED（要求修订） | 用户采纳混合地图方案：地表等距TileMap，摊位/地标独立Prefab，顾客固定路径点 | v0.2修订中，未批准 |
| 2026-09-29 | TECH-DEMO-001 | Demo技术设计 | v0.2 | deliverables/tech_lead/TECH-DEMO-001/v0.2/TECH_DESIGN.md | USER_APPROVED | Master呈现本版与ART v0.1待批准后，用户回复“继续吧” | 当前批准版本，可供后续正式技术输入 |
| 2026-09-29 | ART-DEMO-001 | Demo美术方向与资产规格 | v0.1 | deliverables/art/ART-DEMO-001/v0.1/ART_DIRECTION.md | USER_APPROVED | Master呈现本版与TECH v0.2待批准后，用户回复“继续吧” | 当前批准版本，可供UI规格与后续视觉设计输入 |

## 当前门禁
- PRODUCT-001历史概要与审批记录保留；当前v0.7专业评审已通过，处于USER_REVIEW，用户尚未作出批准或退回决定。
- DEMO-001 v0.1产品规格已获用户明确批准，产品阶段DONE；正式审批状态见 `tasks/DEMO-001/ARTIFACT_APPROVAL.json`。Tech Lead、Art、UI规格阶段可由Master创建并解锁。
- TECH-DEMO-001 v0.1要求修订的历史决定保留；v0.2已USER_APPROVED，可作后续正式技术输入。历史决定见 `tasks/TECH-DEMO-001/ARTIFACT_APPROVAL_v0.1.json`。
- ART-DEMO-001 v0.1已USER_APPROVED，可供UI规格任务正式消费；UI规格及Client视觉实现仍按后续Artifact Gate审批。
- UI-DEMO-001 v0.1规格经Art视觉一致性与Master独立评审APPROVED，处于USER_REVIEW；用户尚未决定，Client正式UI集成门禁关闭。审批状态见 `tasks/UI-DEMO-001/ARTIFACT_APPROVAL.json`。
- ART-ASSET-DEMO-001 v0.2可集成资产包经Master独立评审APPROVED，处于USER_REVIEW；v0.1保留为未提交用户审批的草稿，用户尚未决定v0.2，Client正式美术输入门禁关闭。审批状态见 `tasks/ART-ASSET-DEMO-001/ARTIFACT_APPROVAL.json`。
- PRODUCT-001仍未获用户批准，其独立下游保持关闭。
