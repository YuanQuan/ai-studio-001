# 奶茶小游戏人工源表候选提升说明

版本 v0.1｜供 Tech Lead 与用户审核。稳定候选路径为 `project/config/source/MILK_TEA_MINIGAME.xlsx`，从已批准 Product v0.1 工作簿逐格复制业务数据，仅把四表每行 `status: DRAFT → READY`、`export_enabled: false → true`。10 条难度阶段、5 条解锁条件、20 条原料、15 条配方均完整；不存在只提升部分表或过滤草案行的做法。

`READY` 的业务含义是 Product 已确认该行沿用获批值，并提交整本候选参与后续导出前校验；它不是 `USER_APPROVED`、运行启用或已发布。`export_enabled=true` 表示业务层同意此候选行在**整本通过全部门禁后**可进入导出流程；它与 `xp_enabled`、`level_enabled`、`soul_enabled`、`spirit_enabled` 四个难度解锁条件开关互不影响。四张表必须同一批准版本、同一源 SHA、全部行 `READY/true` 且交叉引用有效；不能因某行关闭解锁门槛而丢弃该行。

当前 `project/config/RESOURCE_INDEX.json` 对奶茶资源的 `active_path` 仍为 `null`，`current_formal_resources` 仍为空；本任务不改该索引，不生成配置，也不让运行端读取新文件。下一步由 Tech Lead 对候选做只读类型、ID、引用与字段说明 Review，Master 再做专业 Review，Producer 绑定用户对本候选准确版本的审批。此后仍须按已批准技术规范实施生成器、全量校验、服务端与客户端投影、来源及生成物 SHA、原子发布和运行验证；未完成前不得把候选称为正式运行资源。

已批准旧工作簿 `project/config/source/MILK_TEA_MINIGAME_v0.1.xlsx` 与既有归档 `project/config/archive/2026-10-12-config-audit/MILK_TEA_MINIGAME_v0.1.xlsx` 保持原路径、原字节，供审批溯源。旧奶茶字段说明单独快照于 `project/config/archive/2026-10-12-milk-tea-config-promotion/FIELD_GUIDE_MG01_previous.md`；新奶茶段同版快照为 `FIELD_GUIDE_MG01.md`，并同步到 `project/config/FIELD_GUIDE.md` 的奶茶一节。其他配置段未改。
