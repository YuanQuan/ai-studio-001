# Capability Change Protocol

本协议处理用户直接确认的能力变更，以及 `governance/CONTINUOUS_IMPROVEMENT_POLICY.md`（CI-001）授权范围内的内部改进。二者必须记录不同授权来源；任何内部评审都不能冒充用户批准。

## A. 允许直接确定并由 Agent 自身更新
在用户明确批准后，或完成 CI-001 规定的分类、评审和验证后，Agent 可以在获授权的目录内更新自己的：
- `ROLE.md`：职责与非职责。
- `CAPABILITIES.md`：掌握的技术、工具、方法和优势。
- `CONSTRAINTS.md`：禁止项、必须遵守的限制、默认取舍。
- `DECISIONS.md`：用户已确认的长期角色决策。
- `SKILLS.md`：该角色可调用或应建设的项目内 Skill / Playbook 索引。

无需 Master 参与讨论，也无需 Master 代写。

## B. 必须告知 Master 并进入跨角色治理
若结论会影响以下任一项，不能由单个 Agent 单方面生效：
- 其他 Agent 的工作方式或职责。
- API、数据格式、存档、资源接口、交付格式等 Contract。
- 项目正式技术栈或架构。
- 产品规则、经济、商业化或发布规则。
- 已在执行中的其他正式任务。

此时由 Master 组织受影响角色评审；涉及产品、破坏性契约、重大架构、权限或质量底线的变更仍须用户明确批准。用户审批型提案继续符合 `schemas/capability_change.schema.json`。CI-001 的 A/B 类内部改进在现有 Schema 尚未扩展期间使用可追溯 Markdown 记录：模板维护放 `governance/capability_changes/`，游戏问题放 `project/improvements/`。不得将既有授权填写成一次新的 user_approval=APPROVED；游戏的产品决策仍写入 project/DECISIONS.md。

## C. Skill 自我演进规则
Agent 可以记录方法缺口。改进适用 CI-001：A 类按范围记录与验证，B 类由 Master 组织受影响角色评审后试验，C 类仍由用户批准。不得借方法优化扩大权限、删除质量门禁或绕过工具安全检查。

流程：
1. 记录问题、证据、最小修改、收益假设、风险分类和授权依据。
2. 完成相应评审或用户批准，不伪造独立审查。
3. 在授权范围内实施并验证；失败时停止或按记录回退，不修改验收目标。
4. 更新角色方法索引与必要注册信息；方法有文档不等于工具能力已验证。
5. 经验证的通用方法才可按同步策略回流模板。

## D. Master 的同步职责
Master 不维护角色配置副本。Master 在创建或分派正式任务前必须：
1. 读取 `governance/CAPABILITY_REGISTRY.yaml`。
2. 读取该任务涉及角色的 ROLE / CAPABILITIES / CONSTRAINTS / DECISIONS / SKILLS。
3. 读取项目正式决策和规范。
4. 若角色偏好与项目决定冲突，以用户最新明确指令和项目正式决定为准，并记录冲突。

当用户在某个当前 Game Repository 中明确修改 Agent 的长期职责、约束或跨角色工作方式时，除非用户明确限定“仅当前项目”，该变更同时视为 Studio 级职责变更：本轮必须同步修改当前游戏的对应 Studio Layer 快照与 `YuanQuan/ai-studio-template` 主 Studio Layer。若该职责变化影响 `standard-mini-game` 的默认工作方式，还必须同步更新 `templates/game/` 中相应默认项。该文件级同步不自动授权 Git commit/push，也不自动改写其他既有游戏。

若用户明确限定“只改模板”或排除某个游戏目录，该范围优先于上面的默认双同步；不得直接或间接修改被排除的仓库。CI-001 的经验回流需先验证与去除项目特定内容，不能将当前游戏的全部配置覆盖到模板。

## E. 校准状态
当用户完成一次角色能力确认后，应把该 Agent 在 `CAPABILITY_REGISTRY.yaml` 中的 `calibration_status` 从 `needs_user_calibration` 更新为 `calibrated`。重大能力变化后可暂时改为 `recalibration_needed`。
