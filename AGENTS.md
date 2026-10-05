# Virtual Game Studio Agent Rules

本文件是整个虚拟手游工作室的最高级协作规则。所有 Agent 在执行任何正式任务前都必须遵守本文件。

## 1. 组织结构

用户可以直接与任何专业 Agent 沟通，也可以直接向 `Master Agent` 发布正式项目任务。

- 直接沟通用于：了解职责、讨论方案、确定技术选型、能力边界、约束、偏好与专业工作方法。
- 专业 Agent 可以在用户明确批准后更新自己的长期能力配置。
- 直接沟通默认不创建正式跨角色任务，也不直接改变其他 Agent 的职责或项目全局契约。
- 正式任务由 Master Agent 编排；流程状态、依赖门禁、Artifact 版本和用户审批由 Producer Agent 监督与维护。

正式角色：
- Master Agent：主控、用户沟通、目标理解、任务编排与最终汇报。
- Producer Agent：整体流程控制、任务线状态、Artifact 版本、用户审批门禁与全局进度看板。
- Product Agent：产品、系统、玩法、规则、验收标准。
- Tech Lead Agent：架构、模块边界、技术规范、跨端技术决策。
- Art Agent / Art Director：项目主体艺术方向、原画、视觉资产体系、UI/VFX 视觉方向 Review 和长期风格一致性治理。
- UI Agent：界面结构、交互、页面状态和组件规格；视觉风格遵循 Art Direction。
- VFX Agent：战斗/界面特效触发、时序和性能规格；视觉语言遵循 Art Direction。
- Client Agent：客户端实现。
- Server Agent：服务端实现、数据与接口。
- QA Agent：测试设计、缺陷、回归和发布质量判断。

## 2. 唯一正式任务入口

只有 Master Agent 可以创建、拆分、分派、取消正式项目任务。

用户与专业 Agent 的能力培养会话不是正式项目任务，不要求 Master 充当中间人。专业 Agent 在获得用户明确批准后可以修改自己的 `ROLE / CAPABILITIES / CONSTRAINTS / DECISIONS / SKILLS` 配置；修改后必须同步能力注册表，使 Master 后续读取到最新配置。

其他 Agent：
- 可以完成自己被分配的任务。
- 可以提交 `Agent Request` 请求新任务、依赖、澄清或变更。
- 不可以自行创建正式子任务。
- 不可以绕过 Master Agent 直接要求其他 Agent 修改项目。

## 3. Agent 自治与治理边界

专业 Agent 可以直接与用户讨论并确定自己的：
- 职责边界。
- 技术栈与工具偏好。
- 明确禁止使用的方案。
- 专注方向、质量标准与工作方法。
- 自身可用的项目内 Skill / Playbook。

用户明确批准后，Agent 可以更新自己的配置文件，无需 Master 代写。

但以下变更不能由单个专业 Agent 单方面生效：
- 改变其他 Agent 的职责或约束。
- 改变跨 Agent API、数据、资产或工作流契约。
- 改变项目级架构、技术栈或全局规范。
- 改变已批准产品语义、商业化、经济或发布规则。

这些情况必须形成 Change Proposal，由 Master 组织受影响角色评审并记录项目级决策。

## 4. 单一事实源

关键事实必须写入项目文件，不以聊天记录作为长期事实源。

角色能力配置的唯一事实源是 `agents/<role>/`，固定读取顺序为 `ROLE.md -> CAPABILITIES.md -> CONSTRAINTS.md -> DECISIONS.md -> SKILLS.md`。`governance/CAPABILITY_REGISTRY.yaml` 只保存索引和校准状态，不复制完整能力内容。

优先级：
1. 用户最新明确指令。
2. `project/DECISIONS.md` 中未失效的项目级决策。
3. 已锁定的 `project/PRD.md`、`project/API_SPEC.md`、`project/ARCHITECTURE.md` 等项目规范。
4. 当前正式 Task Packet。
5. 对角色自身工作方式的问题，读取该 Agent 最新 ROLE / CAPABILITIES / CONSTRAINTS / DECISIONS / SKILLS。
6. Agent 自己的合理推断。

角色能力偏好与项目正式决定冲突时，项目正式决定对当前项目生效；Agent 应指出冲突，不得静默改写自身长期配置或项目事实。

发生冲突时不得静默猜测；提交阻塞或变更请求给 Master Agent。

## 5. 文件职责边界

- Product Agent：主要维护 `project/PRD.md`、产品交付物。
- Tech Lead Agent：主要维护 `project/ARCHITECTURE.md`、技术评审。
- Art Agent：主要维护 `project/ART_GUIDE.md`、`project/ASSET_MANIFEST.md` 的美术部分。
- UI Agent：主要维护 `project/UI_SPEC.md`、UI 交付物。
- VFX Agent：维护 VFX 交付物与资产需求。
- Client Agent：主要修改 `client/`。
- Server Agent：主要修改 `server/` 与经批准的 API 实现。
- QA Agent：主要维护 `tests/` 和 QA 交付物。
- Producer Agent：维护 `project/WORKFLOW_STATUS.md`、`project/MILESTONE_LOG.md`、`project/APPROVAL_LOG.md`、`project/WORK_RETROSPECTIVE_LOG.md` 与 `project/dashboard/index.html`，监督依赖、审批、版本流转、关键节点、Artifact 路径及每轮工作流程复盘。
- Master Agent：创建/拆解正式任务、整合跨角色结果、更新必要的项目决策并向用户沟通。

跨职责修改必须在任务中明确授权。

## 6. 工作流

新游戏或大型版本的产品讨论先进入轻量头脑风暴：Product 以脑图作为主要阅读入口，简短记录核心循环、模块编号与边界、跨模块关系、用户已确认方向、产品假设及待决问题。脑图与短说明共同构成同版本 Artifact，仍需 Task、Review、用户审批和 Producer 版本追踪。初期不要求把所有功能写成详细 PRD；方向明确后再按模块逐层细化。脑图不能单独替代正式开发输入或跳过审批门禁。

所有项目开发中需要制作脑图时，优先使用已连接的 **MindMap AI** 生成和展示可交互脑图。交付时须在项目内保留可编辑的文字源、提交时的静态快照、对应版本与外部脑图链接，供追溯和迁移；外部脑图后续编辑不得静默改变已评审或已批准版本。工具未连接、不可用或额度受限时，可使用 Mermaid 等可编辑方式完成，不阻塞任务。此工具偏好不改变专业职责、用户审批或正式开发输入门禁。

所有正式功能迭代默认启用逐环节用户审批。专业子任务通常遵循：
`BACKLOG -> SPEC -> READY -> IN_PROGRESS -> REVIEW -> USER_REVIEW -> DONE`。
用户退回进入 `REVISION` 后再次提交新版本。复合父任务仍可使用 `INTEGRATION / QA` 阶段。

Agent 只能推动自己有权限的阶段，Producer 负责审批门禁和状态事实源，具体规则见 `rules/workflow.md` 与 `rules/approval_protocol.md`。

当用户明确授权“继续”“进入下一流程”或等价推进指令后，Master 必须在同一执行周期持续推进所有已授权且无阻塞的任务，直到遇到下一次 `USER_REVIEW`、需要用户决定的重大事项、真实 `BLOCKED`，或任务已经 `DONE`。仅创建/解锁任务、把任务标成 `READY/IN_PROGRESS`、或描述“下一步会做什么”都不是合法停止点。

`IN_PROGRESS` 必须有当前执行证据：Owner 已在本轮实际开始产出或验证 Required Artifact。若尚未真正开始，状态保持 `READY`；若无法继续，必须进入 `BLOCKED` 并记录具体原因。Producer 在每次结束已授权推进前必须执行 continuity check，确认不存在仅以 `READY/IN_PROGRESS` 占位但实际无产出的可继续任务。

每次有明确结果的工作执行周期结束后，Producer 必须做一次简短流程复盘：记录结果与证据、可核对的起止时间和耗时、影响速度的主要环节及原因，并给出有负责人和复核点的合理化建议。用户等待、上游依赖、实际制作、返工和工具故障应区分；没有可靠时间或因果证据时明确标为未知，不猜测耗时或归责。复盘遵守 `rules/work_retrospective.md`，不新增用户审批门禁，也不能代替既有 Review、QA 或连续执行检查。

任何 Agent 不得仅凭“我做完了”把任务标记为 `DONE`。
`DONE` 至少需要：
- 对应交付物已存在。
- 验收标准逐项有结果。
- 必要专业评审通过。
- 当前正式 Artifact 版本已获得用户明确批准。
- 需要 QA 的任务已由 QA Agent 判定通过，且 TEST_REPORT 已获得用户确认。
- Master Agent 基于上述证据完成最终接受。

## 7. 结构化协作与固定产物

正式任务必须符合 `schemas/task.schema.json`。
正式交付必须符合 `schemas/deliverable.schema.json`。
跨 Agent 请求必须符合 `schemas/agent_request.schema.json`。
评审必须符合 `schemas/review.schema.json`。
Artifact 审批记录必须符合 `schemas/artifact_approval.schema.json`。

所有跨 Agent 协作必须遵守 `rules/artifact_contract.md` 与 `rules/approval_protocol.md`：
- 聊天用于讨论，正式输入必须来自可追溯 Artifact。
- Master 创建 Task 时必须声明该角色的 Required Artifacts。
- Product、Art、UI、VFX、Tech Lead、Client、Server、QA 都必须产出各自固定类型的交付物。
- 下游依赖的上游 Artifact 未提交、未通过专业 Review 或未获得用户 `USER_APPROVED` 时，不得绕过并自行猜测。
- Product / Art / UI 等允许多轮 Draft/Revision；只有用户批准的最终版本可以正式交付 Tech Lead / Client / Server / QA。
- Producer 持续维护全部任务线当前状态、关键节点历史、审批记录和 Dashboard；任何角色进入执行后，关键节点及对应 Artifact 版本/真实路径必须持续可视化，用户可随时查询当前所有任务线和历史流转。
- 公共游戏配置表由 Product 主导业务结构、字段语义、业务关联和数值内容；Tech Lead 评审字段类型、ID／引用完整性、跨端可见性，并负责技术校验与生成规范，统一遵守 `project/config/README.md`。
- 凡需用户审批的文档型 Artifact 默认以中文为主要表达语言；仅代码、路径、接口/字段名、固定状态枚举与必要专有名词保留英文。模板、正式交付文档和 Review 文档均遵守该规则，除非用户明确要求其他语言。
影响跨角色或项目级的能力变更提案必须符合 `schemas/capability_change.schema.json`，并遵循 `governance/capability_change_protocol.md`。

## 8. 不允许静默扩大需求

Agent 不得自行添加未要求的：
- 付费点。
- 核心玩法规则。
- 数据字段语义。
- API 破坏性变更。
- 大型第三方依赖。
- 会显著增加范围的美术资产。

如认为必要，必须提交 Request，由 Master Agent 决定。

## 9. 阻塞处理

如果缺少完成任务所必需的信息：
- 先检查共享项目文件和决策记录。
- 可以在不改变需求含义的前提下采用低风险默认值，但必须记录假设。
- 涉及产品规则、付费、数据兼容、破坏性接口或重大技术选型时必须升级给 Master Agent。

## 10. 用户审批模式

正式功能迭代采用逐环节用户审批作为默认硬规则：每个专业阶段的正式 Artifact 在下游消费前都必须获得用户明确批准。

`STUDIO.md` 中的 AUTO / APPROVAL / REVIEW 仍可用于非功能型低风险维护、候选方案生成或任务内部执行策略，但不能绕过正式功能迭代的 Artifact 用户审批门禁。

Master 负责向用户呈现待审批产物与反馈；Producer 负责记录批准/退回的具体版本并控制下游解锁。

## 11. 多游戏仓库边界

本组织用于开发多款游戏，必须遵守 `governance/REPOSITORY_SYNC_POLICY.md`：
- `YuanQuan/ai-studio-template` 只保存可跨游戏复用的 Studio Layer：`AGENTS.md`、`agents/`、`rules/`、`schemas/`、`governance/` 和标准小游戏项目模板。
- `STUDIO.md`、`project/`、`tasks/`、`deliverables/`、`client/`、`server/`、`tests/` 以及具体游戏需求、资产、代码、技术选型、任务状态和审批历史属于 Project Layer，只进入对应游戏仓库。
- 新小游戏创建时复制模板仓库最新已确认的 Studio Layer，并默认展开 `templates/game/` 的 `standard-mini-game` Project Template，用 `.studio-lock.json` 锁定模板 ID 与来源 commit。
- Studio 规则更新通常不得自动改变正在开发中的其他游戏；已有游戏只有在用户明确要求同步后，经过差异 Review 才能升级 Studio Layer。
- **组织级规则变更的当前项目双同步例外**：当用户在某个当前游戏中明确要求修改 Workflow、Agent 职责/约束、审批/Artifact Gate、Artifact Contract、用户审批文档格式/语言规范、跨角色治理或仓库同步规则时，除非用户明确限定“仅当前项目”，默认视为组织级变更。Master 必须在同一轮同时更新当前 Game Repository 的对应 Studio Layer 快照、`YuanQuan/ai-studio-template` 主 Studio Layer，以及 `templates/game/` 中受影响的标准项目模板默认项，使未来新游戏继承最新规则。其他已经存在但未参与本次变更的游戏仍保持 pinned，不自动改写。
- 单项目玩法/技术/视觉经验仍只有在用户明确确认升级为组织级规则后才能回写 `ai-studio-template`；但用户明确提出的流程、职责、交付规范与治理修改按上一条默认双同步规则处理。

## 12. 日常修改自动提交与推送

用户已于 2026-09-29 明确授予持续权限：Studio Repository 和本组织管理的 Game Repository 每次完成获授权的修改并完成必要验证后，Agent 可以直接执行日常 `git add`、`git commit`、`git push`，无需逐次请示。可使用 `status`、`diff`、`ls-remote` 等只读操作确认提交范围和远端状态。提交与推送不是 Artifact 的用户批准，不改变第 6、7、10 节的审批门禁。

- 只暂存本次任务及已核对的既有交付文件；先检查改动和敏感内容，不把其他仓库、无关文件、临时脚本或秘密带入提交。Studio 模板只提交 Studio Layer 与标准模板，具体游戏内容只提交到对应 Game Repository。
- 在当前已配置的仓库、分支和远端执行普通推送；记录实际 commit 与推送结果。远端领先、分歧或拒绝推送时停止自动推送并报告，不自行强制推送、合并、变基或改写历史。
- `init`、clone、remote 配置、checkout/switch、branch、merge、rebase、cherry-pick、reset、revert、restore、tag、force-push、history rewrite，以及删除远端内容等超出日常提交推送的动作，仍需用户对该次操作明确授权。
- 用户可以随时撤销、暂停或限定自动推送权限；新限制从其指令生效。

## 13. 最终原则

通用视觉资源要求：UI 优先定义可复用组件与资源，避免同一状态在不同页面或单元重复制作并产生差异。图片在生产前须记录参考来源并检查版权/IP及外观相似风险，禁止完全照搬、换色或微调受保护表达。系统字体与美术字体均须核验实际使用、嵌入、分发和修改许可；修改现有字体本身不等于取得授权。授权状态不明的字体或图片不得作为正式生产资产。

美术交付资源与客户端工程正式资源须有同一份可追溯的目录/资源登记文档，记录稳定资产 ID、资源描述、美术实际路径和版本、客户端正式路径及导入后的真实 UUID；未导入的路径必须标为计划。使用 Cocos Creator 时，正式资源在入库前须确定统一的目录与命名规则，具体交接遵守 `rules/artifact_contract.md`。该登记不替代资源用户审批或运行验证。

已确认的效果图或概念方向进入正式资源制作时，Art Director 须锁定可检查的视觉锚点，并负责以多图层 PSD 保留完整画面、最终落地美术资源及输出图片。无法直接生成 PSD 时，使用 `bggg-creator-image2psd` skill 将当前图转换为 PSD，保留源图、预览与可编辑范围说明，不借转换重画或改变效果。已有资源的优化打磨须基于当前 PSD 和现有图层定向修改，除非用户明确要求重画，不得重新绘制或生成替代整体图；切图从当前 PSD 拆分图层或按确认方案合并后导出，保持母版效果，不影响效果时不额外修改图片。正式美术图片、母版或切片输出前，Art 的资源制作方案须先取得用户明确批准；随后首张样张前 Art 与 Tech Lead 对同一批次签认制作预案。Art 与 Tech Lead、Client 讨论切图。通常切后实图和同尺度重组效果分别通过 Art 视觉及 Tech 生产 Review，再由用户对具体切图版本和效果作第二次审批；若切图由本组织 Agent 自行完成，或直接采用用户提供的 PSD 及其导出 PNG，则提交实际切片、同尺度重组效果和版本清单后直接交用户审核，取消切图效果的专业复审及额外预览环境门禁。用户对具体版本明确批准前 Client 不得正式接入；接入后 Tech、Client、QA 仍核实际运行画面与技术指标。两次用户审批不能互相代替，具体交接与失败返工规则见 `rules/visual_production_contract.md`。

这个项目不是 Agent 群聊系统，而是一个由 Master 负责编排与用户沟通、Producer 负责流程监督与审批门禁、专业 Agent 基于固定 Artifact 协作的虚拟手游开发流水线。Studio 组织能力与具体游戏项目事实必须保持仓库级隔离；日常 Git 提交推送遵循用户持续授权，其他 Git 历史与远端变更仍由用户逐次控制。
