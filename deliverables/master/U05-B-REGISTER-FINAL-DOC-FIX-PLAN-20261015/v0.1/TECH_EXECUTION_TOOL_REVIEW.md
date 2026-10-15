# 受控执行脚本只读审查

结论：**dry-run 内容与资源身份检查通过；当前 `--commit` 分支不得放行。** 本审查没有调用 `--commit`、执行脚本或修改 Art 文件。

脚本默认仅向 `/private/tmp/u05_final_doc_fix_once/` 写四份预览；当前正式四文件仍为原 SHA。现有临时预览 SHA 为 CUT `c493493d8f695794ad30005b0d9a95a4c9a3142344aee7e25936b7cf9a1a1718`、ASSET `9ce9f560516571d199a7819942ca47bade4fbefd8ff25b80fb40a91f20b641a8`、LEDGER `488fe44525ebd9708e86eeacf1261522293644b983d6499f680e8fe8a927d86e`、DELIVERABLE `3257c92e0cb0b53692ef9bfa13cd4887a40fd294f9428688b9a252f3c34efaaa`。新脚本按 `files.items()` 读取冻结清单，`safe_rel` 排除绝对路径、`..`、反斜杠与 NUL；逐项核 58 PNG 的源 SHA/尺寸/mode/alpha、ID 唯一及 FNT SHA/字节、冻结10件、54运行/4不接入、55条新计划路径，并按项目 schema 当前使用的关键字递归校验 DELIVERABLE。此部分比旧脚本完整。

`--commit` 分支仍有必须修的缺陷：

1. **覆盖历史账本字段**：`commit_once()` 把原账本顶层 `activity_start_utc`、`activity_precommit_end_utc`、`prior_full_conservative_seconds` 等首轮字段直接改为新轮值；新 `correction_preflight` 仅保留首轮约256秒与超16秒、失败152秒，没有首轮原 `04:23:13.280953` 预提交检查点及失败轮 `06:01:38–06:04:10` 起止。方案要求这些历史时间明确保留。应把首轮原字段复制进独立 `prior_runs` 记录后再增加新轮字段，或新增 `final_correction_*` 字段而不覆盖原字段。
2. **仍只记预提交时间**：`commit_once()` 在备份之后、正式替换之前计算 `end`，随后写四文件、逐件读回和冻结核查，返回及打印还要耗时。账本把这一检查点当新轮终点，不能满足“最终结束与保守全轮活动闭合”。应保留明确的 `precommit` 检查点，并在全部后验核验完成后记录最终结束、全轮保守秒数和累计上界；如果最终结束记录需要第二次写账本，须把该步骤纳入同一次受控事务与硬线，不可悄悄再次执行。
3. **硬线与回滚**：脚本只在替换前检查 `<240`，替换和复核期间可跨线仍输出 `COMMIT_COMPLETE`；异常回滚逐件 `write_bytes(old)`，但没有回滚后的逐件 SHA 证据，回滚异常还可能掩盖原失败。应在各关键阶段留足时间、最终完成时再次查硬线；临界时停并保守标 BLOCKED。提交/回滚每件原新 SHA 与结果留证。四个 `Path.replace` 是单文件原子操作，不是四件整体事务。
4. **审批门禁过弱**：`approval_passes()` 仅检查文件存在及 `status=USER_APPROVED`，没有锁定批准的 task_id、version、artifact、方案三 SHA 或同批 Tech 预算签。用户尚未批准新方案时它会拒绝，但正式模式应绑定准确批准身份与同批签；`--start-utc` 是命令行任意值，没有与 Art 当轮真实起点证据或剩余预算核算相联。必须在执行前由 Art/Tech 独立核身份和预算，不能只信脚本的 240 秒计算。
5. **正式状态过早**：旧账本顶层 `status=READY_FOR_USER_GATE2_NOT_CLIENT_IMPORTED` 被保留；在全轮核验和 Tech/Producer 复核前不应声称 Gate2 就绪。`DELIVERABLE` 的预算 FAIL 已正确保留；最终仍须呈现原超时及失败记录。

最低风险路径：先让编码任务只改上述正式分支并再次 temp-only dry-run；Art/Tech 静态核最终补丁、批准记录/三 SHA、同批预算余额和当前四 SHA；用户批准方案后以当轮真实 UTC 起点执行**唯一一次**正式替换。完成后核正式四件路径、SHA、schema、历史和新轮最终账本、冻结10件及硬线；任一失败保持 BLOCKED。当前没有可安全建议 Art 执行的 `--commit` 命令。
