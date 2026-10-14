# U05 B 三类配置源变更影响

版本 v0.1。用户已批准上游 Product 三类内容方案；本版人工工作簿仍需 Product／Tech Review 和对具体配置版本的用户批准。旧正式无版本源 `project/config/source/MILK_TEA_MINIGAME.xlsx` 的 SHA-256 为 `a0372ae4414471d57c2e9a621b538e80cee4d1482455088afe7bcb72630a1c76`，本轮只读未改。历史 `project/config/source/MILK_TEA_MINIGAME_v0.1.xlsx` SHA-256 为 `cdad804b8ba7974ce4ac6835ee02f7863be6f577a3919fd4baa8c90a73fa1cfa`，亦只读。

| 范围 | 具体影响与后续门禁 |
|---|---|
| Product 业务源 | 旧现实茶／奶／小料各 4 项及甜／冰各 4 项，替换为已批幻想茶 3、奶 3、小料 6；旧 15 条五维配方替换为各档完整三元组合计 174 条。旧 `options_per_dim` 改三类独立数量，`recipe_dims` 全部为 3，`sweet_id`／`ice_id` 废止。配方三元组不复用旧 ID。 |
| 保留数值 | 十阶段的 `stage_id/tier_id/stage_no/xp_from/orders_target/time_sec/xp_reward` 与旧正式源逐格一致；五档解锁条件的上一档、开关、阈值逐格一致。体验仍一单一杯、一局三杯。 |
| 字段说明与历史 | 同版 `FIELD_GUIDE.md` 独立解释 41 字段、引用、空值与范围。旧工作簿和已批资料保留，正式配置源和索引未动；审批后再依配置契约建立归档／提升链。 |
| Tech／Client | Tech 审逐类开放计数、配方生成、ID 引用、状态过滤和三维运行资源格式。Client 必须消费获批公共源导出，不手写正式业务值；现有五维局不得按三维续玩。 |
| 前端记录 | 建议保留原累计 XP、clear 和永久 unlocked；不保存旧五维半局到新版，已结算结果不可重复发 XP。具体字段与迁移机制由 Tech 审核。本轮无后端任务。 |
| UI／Art／单元示例验证 | 气泡仅成品杯图，帮助入口另置；54 种最高档组合由同源茶／奶／小料图层可辨。Art 实际资源、UI 提示表现和 U05 Owner 运行与视觉验证走各自已设门禁，不因工作簿存在视为完成。 |

全部候选行均 `DRAFT` 且 `export_enabled=false`。配置草案不进入现行源、索引、客户端资源或生成流程；Tech 评审和本配置版本用户批准之后才可另行受控提升。
