# 奶茶人工源候选送审资料

请核对稳定候选 [工作簿](../../../../project/config/source/MILK_TEA_MINIGAME.xlsx) 与同版四张静态表格图：[难度阶段](evidence/DIFFICULTY_STAGES.png)、[解锁条件](evidence/UNLOCK_CONDITIONS.png)、[原料](evidence/INGREDIENTS.png)、[配方](evidence/RECIPES.png)。图像用于读数和检查候选行状态；准确数据以工作簿与 `SOURCE_DIFF.md` 的逐格核验为准。

本次请求批准的是无版本人工源候选和 41 字段中文说明。原已批 v0.1 数值、配方和业务字段不变；四表 50 条记录的 `DRAFT/false` 经 Product 明确提升为 `READY/true`。`READY` 仅允许候选进入后续审核与导出前校验，不代表客户端或服务端可消费。旧工作簿和旧奶茶字段说明均保留准确历史快照。

Tech Lead 下一步只读检查类型、ID、引用、配方选池与字段说明；Master Review 后由 Producer 记录用户对本准确候选版本的批准。当前 `RESOURCE_INDEX.json` 未指向新候选，正式资源列表为空；生成器、运行资源、实际发布与运行验证均未完成。
