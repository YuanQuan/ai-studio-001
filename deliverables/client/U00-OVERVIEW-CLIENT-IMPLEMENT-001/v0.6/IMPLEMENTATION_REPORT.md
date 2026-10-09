# U00 参数基线修订实施记录 v0.6

已按用户 JSON 更新 U00 店铺 baseline scale 为六家均 0.34，六店脚点与 v0.5 保持相同；初始顾客数量为 1，顾客 1 scale 为 0.20。恢复动作将临时顾客数量恢复至 1，并重置店铺位置/scale 与顾客缩放；新增顾客继续采用 U00 的 0.20 baseline。离开后重进会重建为相同 baseline。U02 独立示例未修改。

源码 SHA-256：`99364FBBFB1212EAB3791A4193606EE2B7EC63A40C8AB9C316DFF8B67FF22ABD`。assets + Creator 声明 TypeScript noEmit 通过（退出码 0，见 `TYPECHECK_RESULT.json`）。v0.5 参数与检查历史保持在 v0.5 目录。Creator 构建状态为 BLOCKED：首次命令因PowerShell外层参数冲突未启动；修正为 runbook 提升助手后，Windows PowerShell 和 `pwsh.exe` RunAs 创建均返回 `0xc0000142`，Creator 未启动。HTTP/IAB 未测试。隔离工程输入和启动证据见 `BUILD_AND_RUNTIME_RECORD.md`。

用户随后明确回复“我已帮你验证通过了”。依 `USER_VALIDATION.md`，记录为用户对当前 U00 v0.6 参数修订的验收通过；验证设备、视口、构建身份、具体操作和截图均未提供，保持未知。Agent 自己没有完成Creator构建、HTTP/IAB运行，仍如实标为NOT_TESTED；不把用户验收当作Agent构建证据或正式QA结论。交付保留 `IMPLEMENTATION_REPORT_BLOCKED.md` 与历史 Review 快照，记录此前环境阻塞状态。
