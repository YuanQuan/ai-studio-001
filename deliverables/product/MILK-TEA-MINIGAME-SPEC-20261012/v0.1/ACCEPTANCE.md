# 奶茶小游戏产品规格验收

版本 v0.1｜Product 自查，待专业 Review 与用户审批。`PASS` 表示本次交付材料满足任务包检查项，不表示数值和新提案已批准。

| Task 验收项 | 结果 | 证据 |
|---|---|---|
| 奶茶流程、状态、提示纠错、计时和边界均可复核，明确已确认规则与新增提案 | PASS | `PRD.md` 单局与边界；`FLOW.md` 状态和竞争边界 |
| 五档与档内递增有明确独立参数、上限和数值理由，通关经验及解锁按已确认机制 | PASS | `PRD.md` 五档表及熟练度；`CONFIG_SPEC.md` 两阶段阈值与数值依据；源表“难度阶段／解锁条件” |
| 人工配置源表及字段字典包含稳定ID、引用、开关与门槛，已启用条件按且组合，魂数魄数独立 | PASS | `CONFIG_SPEC.md` 字典；源表四表及独立 `soul_enabled/soul_min`、`spirit_enabled/spirit_min` |
| 配置工作簿内容、引用、范围与显示经过核验，无其他五店未讨论玩法或虚构正式引用 | PASS | `CONFIG_VALIDATION.md`；源表仅 MG01；`CONFIG_SPEC.md` 标明工程奶茶 ID `MT_SHOP_01` 绑定待审 |
| PRD、流程、源表及验收同版可追溯，未经用户及后续技术审批不可直接作为运行配置 | PASS | 本版 `PRD.md`、`FLOW.md`、`CONFIG_SPEC.md`、`REVIEW_PACKET.md`、源表均 v0.1，DRAFT 和审批边界明确 |
