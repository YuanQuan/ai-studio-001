# Producer 每轮工作流程复盘规则变更

- ID：CAP-2026-10-05-PRODUCER-RETROSPECTIVE
- 来源：用户 2026-10-05 明确要求 Producer 对每一次工作的结果做流程复盘，找出耗时慢的原因并给出合理化建议。
- 授权依据：USER_EXPLICIT；依据 `AGENTS.md` 第 11 节和 `governance/REPOSITORY_SYNC_POLICY.md` 第 4.1 节，组织级职责/流程变更同步当前游戏与主模板。
- 风险分类：Producer 职责与工作流补充；不改变产品、技术、质量门槛或用户审批。
- Owner：Master；受影响角色：Producer。此项是用户直接确定的 Producer 自身职责与流程要求，未声称存在独立专业评审。
- 问题：既有持续改进策略仅在退回、阻塞、任务结束等节点触发简短检查，没有要求每次有结果的执行周期复盘耗时及慢因。
- 修改范围：`AGENTS.md`、`agents/producer/`、`rules/work_retrospective.md`、`rules/workflow.md`、`rules/session_protocol.md`、`governance/CONTINUOUS_IMPROVEMENT_POLICY.md`；当前游戏新增空白复盘日志，主模板 `templates/game/` 增加默认空白日志与初始化索引。
- 预期收益：每轮结束时可区分实际制作、等待、评审、返工和工具故障，并把建议留到下一次相似工作验证。
- 实际验证：文件级双同步和引用检查；未做历史耗时回填，也未把复盘当成游戏 Artifact 审批。
- 回退办法：若短记录造成可证实的额外负担，由 Master 组织复核并经用户决定调整频率或字段；不删除已留下的真实历史记录。
- 适用规则版本：当前 Studio Layer 文件版本；已有执行中任务在安全交接点采用，不改写旧 Task / Approval。
- 同步状态：当前游戏与主模板文件级同步；提交和推送结果以本轮 Git 实际输出为准。
