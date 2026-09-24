# 会话启动、恢复与交接协议

规则文本版本：`studio-workflow-v2-policy`。这是文件驱动的会话恢复规范，不是已经部署的恢复服务。顶层入口、规则版本与实施状态分别见 AGENTS.md、governance/WORKFLOW_VERSION.json、governance/IMPLEMENTATION_STATUS.md。

本协议不新增权限，不替代用户批准，不让会话在后台继续执行。

## 启动顺序

1. 确认实际仓库根目录；读取根 AGENTS.md 和工作路径内的嵌套说明。
2. 读取 governance/WORKFLOW_VERSION.json、governance/CONTINUOUS_IMPROVEMENT_POLICY.md；在游戏仓库读取 .studio-lock.json、project/SESSION_STATE.md（存在时），在模板仓库读取 governance/IMPLEMENTATION_STATUS.md。缺失可选索引时从实际文件恢复；缺失必需授权或规范时记录阻塞，不自行假定。
3. 读取 project/DECISIONS.md、活动 Task、相关审批/评审、project/improvements/ 与 project/quality/ 中的待办。SESSION_STATE 只是索引，不是批准或任务事实源。
4. 按 ROLE -> CAPABILITIES -> CONSTRAINTS -> DECISIONS -> SKILLS 加载本次涉及角色；按路径和版本加载必要输入，不重新阅读全部历史。
5. 检查规则版本、任务修订、输入哈希、待审批项和占用情况。与摘要冲突时以实际记录为准，记录冲突，不猜测继续。
6. 只推进用户已授权且依赖满足的工作；不能从“恢复会话”推断用户批准了待审产物。

## 信息层次

- Studio Layer：通用职责、流程、Schema、版本与模板；不包含游戏事实。
- Project Layer：当前游戏的决策、性能预算、平台矩阵、调优记录与例外。
- 执行记录：Task、Artifact、Review、Approval、运行证据。长期角色配置仍以 agents/<role>/ 为唯一事实源。

SESSION_STATE.md 是轻量恢复入口，包含当前目标、活动任务、待决定事项、阻塞、迁移/调优待办、适用规则版本和真实路径。Producer 从正式记录整理索引，在授权范围内用正常文件工具保存并读回核对。当前没有可调用的自动 resume 命令，不得虚构已运行该工具；摘要也不能代替实际任务、批准和证据。

## 保存节点

Task 启动、产物提交、测试结果、审批变化、调优应用/回退及阻塞变化时立即更新正式记录与恢复索引，不等会话结束才保存。先持久化真实记录，再更新日志和 Dashboard；生成视图不能反向更改批准事实。

每轮结束明确：实际完成、真实验证、未测范围、剩余门禁、下一动作。IN_PROGRESS 必须有本轮实际执行证据；没有执行器时不能宣称后台运行。

## 多会话写入

为本次工作记录修订标识、执行编号和负责写入者。兼容当前 Task Schema 时，将这些信息写入 notes 字符串或治理 Markdown，不给旧 JSON 增加未知字段。写入前重新读取并核对预期修订或文件摘要，使用精确 edit；不匹配时停止该项写入并协调，不能直接全量覆盖。

现有文件工具不提供可证明的跨会话原子锁。因此共享任务、审批日志、规则和 Dashboard 采用单写者；其他会话只能提交独立提案。检查修订号不是分布式锁，也不能宣称已实现并行写入安全。占用失效需核对实际执行状态，不自动抢占。

## 规则升级与恢复

旧任务和审批不回填新规则、不伪造批准。新任务采用本规则文本，JSON 继续符合现有 schemas/；旧活动任务保留原规则，到安全交接点以差异计划迁移。游戏 .studio-lock.json 继续指向真实已有 commit，本地修订单独记录，禁止假装已提交或同步远端。

持续改进按 governance/CONTINUOUS_IMPROVEMENT_POLICY.md（CI-001）及 capability_change_protocol.md 执行；正式游戏产物审批不变。新会话不能因为恢复索引写着“待继续”就推定已获得批准。用户限制仅模板时，不进入具体游戏执行、不更新其索引、不触发双同步。
