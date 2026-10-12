# 奶茶人工源候选交付验收

版本 v0.1｜Product 自查，待 Tech Lead、Master Review 及用户批准。`PASS` 仅对应本任务候选材料，不代表正式运行资源已发布。

| Task 验收项 | 结果 | 证据 |
|---|---|---|
| 稳定无版本人工源候选完整含四表，全部获批业务字段与数值逐格不变，仅明确记录状态和业务导出开关的候选提升 | PASS | `SOURCE_DIFF.md` 记录 10/5/20/15 行、100 个受控单元格变化、其他字段 0 变化；候选工作簿四表 |
| 独立中文字段说明逐字段解释含义、类型、单位、完整取值、空值、默认、引用和适用范围，且与候选源表一致 | PASS | `FIELD_GUIDE_MG01.md` 覆盖四表 41 个表头，与 `FIELD_GUIDE.md` 奶茶段一致 |
| 原已审批源表及归档原路径和字节不变，旧新两版奶茶中文字段说明有同版快照，候选路径、来源哈希与差异可追溯 | PASS | `SOURCE_DIFF.md` 三个工作簿 SHA；旧字段快照 `FIELD_GUIDE_MG01_previous.md` 与新同版快照 |
| 候选在用户与技术审查完成前不进入正式索引或运行生成，四表整体发布条件和后续步骤明确 | PASS | `PROMOTION_SPEC.md` 的 `READY`/true 语义及发布门禁；只读确认 `RESOURCE_INDEX.json` 的 `active_path=null`、`current_formal_resources=[]` |
| 交付物有可复核的表头、类型、范围、引用、配方选项池和禁用草案隔离检查，明确未完成的发布与运行验证 | PASS | 只读逐格与业务校验记录于 `SOURCE_DIFF.md`、`PROMOTION_SPEC.md`；同版四张表预览图；生成与运行均未执行 |
