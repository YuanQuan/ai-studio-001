# 受控执行工具复核 v0.2

结论：修订后的 dry-run 与审批门禁方向通过，**正式 `--commit` 仍需两处定点修正；本轮不归档为已签可执行脚本**。未执行正式提交，未修改 Art 或正式资源文件。

当前脚本 SHA-256 为 `8c43ab1af5c45ebdda2c965b0a9e26c75306cdbfe63c09e57fb81e52e69cf85c`。临时四预览实际 SHA：CUT `a1250ac79911913d750310d9cd6918fc21eb9884b301d7631e1825631a0442e4`，ASSET `9ce9f560516571d199a7819942ca47bade4fbefd8ff25b80fb40a91f20b641a8`，LEDGER `fc04ce4d155becd142d750a5ee828d6d74f5c4eb7b5e9d048cd96d7c29d0eba6`，DELIVERABLE `04945efbaa2eb8ca92099d64627e5133288e551105bbf84faa28f15cb0dd4cb0`。预览保留旧顶层 `04:20:13` / `04:23:13.280953`，列首轮最终超16秒和失败轮 `06:01:38–06:04:10` / 152秒；CUT/LEDGER 明确 BLOCKED，交付预算 FAIL、Tech 终审 NOT_TESTED。58 PNG/FNT、路径、冻结文件及 schema 的预检代码完整性较上一版明显改善。

已修复项：`approval_passes()` 现在核 artifact_approval schema、准确任务/版本/角色/产物、三份批准文件即时 SHA，以及同批 Tech 放行记录的批准 SHA、冻结清单 SHA 和当前脚本 SHA；未有审批与签认时拒绝正式提交。`safe_rel` 排除绝对路径、上跳、反斜杠和 NUL。四文件逐件替换，异常时尝试逐件恢复并写 rollback audit；原首轮顶层账本字段保持不变。正式分支有替换前、替换后、最终校验后的硬线检查。

仍需修正：

1. `commit_once()` 在首次替换和冻结校验之后取得 `postwrite_end`，将其写为 `final_doc_fix_activity.activity_end_utc` 和累计值；**之后还进行二次 ledger 替换、四件再读与冻结再核、硬线检查、计算最终 SHA、返回/打印**。因此账本仍把中间检查点称为“最终活动结束”，没有如实闭合方案要求的全轮保守时长。最低成本方式是在最后一次账本替换紧前获取闭合时钟，用明确的保守向上取整秒数涵盖剩余写入/核验，最后再核硬线；或将 Art 实际 run 结束事件作为单独不可混同的最终活动证据，并在四文档中如实标明账本内时间只是提交检查点。不得把当前 `postwrite_end` 直接称最终结束。
2. `attempted_hashes` 在 `outputs[PRODUCTION_LEDGER]` 加入新轮 precommit 内容之前计算；若该文件替换后发生回滚，`rollback_audit.json` 的 `attempted_sha256` 对 ledger 是旧候选 SHA，并非真正尝试写入的字节。应在每次正式替换前、输出字节最终确定后记录该文件实际 SHA；第二次 ledger 闭合替换也更新该 SHA。回滚审计才能逐件可核。

另需注意：`--start-utc` 由 Art 提供，脚本能检验时间早于当前且未到240秒，但不能证明它就是当轮真实开始；正式放行仍需 Art/Tech 与事件记录核对。四文件替换不是整体原子事务，回滚失败时保持 BLOCKED。用户新方案尚未批准，同批 Tech 预算释放尚不存在，当前审批门禁应继续拒绝 `--commit`。上述两处修正后须对最终脚本原字节和 temp-only 预览再次复核，再由 Tech 归档签名脚本；当前没有安全的 Art 正式执行命令可提供。
