# 自动 Git 提交与推送｜Producer 流程评审

评审对象：`CAP-2026-09-29-GIT-AUTO-PUSH.json`
结论：**同意按用户本次明确授权调整日常收尾流程，审批门禁与仓库边界保持独立。**

- `add`、`commit`、`push` 表示文件同步状态，不表示 Artifact 已通过专业评审或用户审批。草稿和 `USER_REVIEW` 版本即使推送成功，仍保留原阶段；Producer 只依据 Review 与明确的用户决定更新审批记录和下游门禁。
- 提交前核对实际变更文件与当前任务/治理提案的范围，确认版本链、Task/Deliverable/Review/Approval 引用一致，并检查敏感内容和不应进入仓库的临时文件。提交后可在里程碑或看板记录该次同步结果与仓库，但不把 commit 当成验收证据。
- Studio Repository 只接收通用 Studio Layer 与标准项目模板默认项；Game Repository 接收当前游戏的 Project Layer 和其 Studio Layer 快照。双同步要分别核对两个仓库的变更范围，不能把具体游戏需求、配置、产物或审批历史推入模板仓库。
- 正常同步遇到远端冲突、需要强制推送或改写历史时停止自动流程，保留本地工作并交由 Master 单独处理；此类动作不从日常 `add/commit/push` 授权推导。推送失败应如实记录本地已提交与远端未同步状态。

本评审不执行 Git，也不修改治理规则或任何游戏 Artifact 审批状态。
