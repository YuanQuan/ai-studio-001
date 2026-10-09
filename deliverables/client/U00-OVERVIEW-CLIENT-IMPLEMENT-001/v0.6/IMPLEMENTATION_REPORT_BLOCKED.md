# U00 参数基线修订实施记录 v0.6

已按用户 JSON 更新 U00 店铺 baseline scale 为六家均 0.34，六店脚点与 v0.5 保持相同；初始顾客数量为 1，顾客 1 scale 为 0.20。恢复动作将临时顾客数量恢复至 1，并重置店铺位置/scale 与顾客缩放；新增顾客继续采用 U00 的 0.20 baseline。离开后重进会重建为相同 baseline。U02 独立示例未修改。

源码 SHA-256：`99364FBBFB1212EAB3791A4193606EE2B7EC63A40C8AB9C316DFF8B67FF22ABD`。assets + Creator 声明 TypeScript noEmit 通过（退出码 0，见 `TYPECHECK_RESULT.json`）。v0.5 参数与检查历史保持在 v0.5 目录。Creator 构建状态为 BLOCKED：首次命令因PowerShell外层参数冲突未启动；修正为 runbook 提升助手后，Windows PowerShell 和 `pwsh.exe` RunAs 创建均返回 `0xc0000142`，Creator 未启动。HTTP/IAB 未测试。隔离工程输入和启动证据见 `BUILD_AND_RUNTIME_RECORD.md`。

该实现是单元示例；Owner 自核不等于独立 Review 或正式 QA。用户 JSON 授权参数修订，不代表对整版 v0.6 的批准。
