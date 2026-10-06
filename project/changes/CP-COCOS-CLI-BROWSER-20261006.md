# Cocos 执行约束迁移

关联：`COCOS-CLI-BROWSER-POLICY-001`、`CAP-20261006-COCOS-CLI-BROWSER`。用户2026-10-06明确授权“修改这个实施约束……尽量用cli……通过codex内置浏览器……可行就直接变成一种约束”。Tech、Client、QA同版Review已通过。

## 当前任务补充

`UNIT-SAMPLE-SINGLE-ENTRY-CLIENT-IMPLEMENT-001` 仍消费已批准 Product v0.2、Tech Plan v0.1、Client Brief v0.2、QA Plan v0.2，保留原U01语义、资源范围、身份、画面与操作验收及实现/正式QA用户门禁。

唯一方法变化：原Brief中必须先经Inspector清引用、Creator保存/重开且禁止脚本改Scene的执行限制，改按 `rules/cocos_cli_browser_workflow.md` 允许受控脚本转换。当前安全交接点尚未修改Scene、代码或新增资源删除。旧批准文档与审批保留，不倒写为当时采用新方法。

实施顺序：记录基线与备份/hash → 清理场景旧引用并完整更新必要对象图 → 静态及关系/资产审计 → 修改消费者代码 → 锁定Creator导入/CLI构建 → HTTP实际产物与Codex内置浏览器冒烟 → 核实专属旧资源退役 → 同版本专业Review → 实现Artifact USER_REVIEW。既有删除先核账，未达引擎/运行门槛的候选不认定正式清理完成。

四层2172×724批准PNG、`.meta`、共享Prefab/Controller真实UUID及历史产物受保护。不得借路线变化新建Scene、重新生图、再导入生成UUID或接入范围外正式七项单元。

## 结果边界

Creator窗口截图故障不再是脚本实施路线的必然前置阻塞。缺少必需的当前导入、构建或运行证据时仍保持NOT_TESTED/BLOCKED，并写新原因。工具路线探测不等于U01实现、正式QA或发布通过。

组织同步记录、实际CLI结果与浏览器证据见 `deliverables/master/COCOS-CLI-BROWSER-POLICY-001/v0.1/FEASIBILITY_AND_MIGRATION.md`。
