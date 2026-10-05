# 工作流程复盘记录

Producer 按 `rules/work_retrospective.md` 在每个有明确结果的执行周期后追加简短记录。本文件记录流程观察，不代表 Artifact 用户批准或 QA 通过；重大或重复问题另见 `project/improvements/`。

## 记录模板

### <执行周期 ID>｜<关联 Task / Artifact 版本>

- Owner / 结果 / 证据路径 / 当前门禁：
- 起止时间、时区、总耗时与已知分段：
- 慢的判断依据：
- 主要原因（观察与推断分开）：
- 建议（最多三条；责任角色、预期作用、代价/风险、复核节点）：
- 后续复核：待复核 / 有效 / 无效 / 证据不足。

## 本轮记录

### WR-20261005-001｜Producer 流程复盘规则更新

- Owner / 结果 / 证据路径 / 当前门禁：Master 执行组织级规则更新；当前游戏与主模板 Studio Layer 已同步，标准小游戏模板已加入空白复盘日志；证据见 `governance/capability_changes/CAP-2026-10-05-PRODUCER-RETROSPECTIVE.md`、`rules/work_retrospective.md`。这是治理工作，不是游戏 Artifact 审批。
- 起止时间、时区、总耗时与已知分段：本轮开始时间未单独记录，总耗时未知；2026-10-05 16:00:11（Asia/Shanghai）已进入规则落地阶段。后续同类工作应在开工时留起点。
- 慢的判断依据：尚无同类工作基线，不能断定本轮整体偏慢。
- 主要原因（观察与推断分开）：观察到主模板位于当前游戏工作区之外，同步时需要单独申请文件写入权限；该步骤实际获准并完成。未发现可证实的其他慢因，不将权限检查直接归为人员效率问题。
- 建议：Producer 在下一次组织级双同步开工前核对两个仓库的可写范围并记录起点时间；预期减少中途发现权限限制的等待，代价是一次简短预检；下一次同类变更结束时复核。
- 后续复核：待复核。

### WR-20261005-002｜四层切图动态审查访问阻塞解除

- Owner / 结果 / 证据路径 / 当前门禁：Producer 记录 `UNIT-MENU-FOUR-LAYER-CUT-001` 从 `BLOCKED` 转 `REVISION`；依据 `tasks/UNIT-MENU-FOUR-LAYER-CUT-001/TASK.json`、`ARTIFACT_APPROVAL.json`、`deliverables/art/UNIT-MENU-FOUR-LAYER-CUT-001/v0.1/MASTER_REVIEW.json`。Gate2 未申请，Art/Tech/Master 的 v0.1 `CHANGES_REQUESTED` 保持有效。
- 起止时间、时区、总耗时与已知分段：2026-10-05 15:58（Asia/Shanghai）记录本地预览拒绝并阻塞；约 16:35 用户允许本机预览、Master CUA 实看，阻塞解除；16:39 完成状态同步。约 37 分钟是两个记录节点的间隔，含用户授权与会话过程，不能当作 Agent 制作耗时；具体制作/等待分段未知。
- 慢的判断依据：尚无同类动态审查基线；可证实的关键路径等待是本地预览曾被浏览器策略拒绝，导致动态证据不能采集。
- 主要原因（观察与推断分开）：观察为浏览器策略曾拒绝 `127.0.0.1:8765`，用户明确允许后 Master CUA 可访问；推断为访问门禁使 v0.1 动态验收保留 `NOT_TESTED`。现在仍缺可持久追溯的新证据，不能据主线程观察追认旧 Review。
- 建议：Master 与 Art 在下一次 Gate2 动态审查前先确认当前预览入口可访问，并把两竖屏视口、倍率端点、连续拖缩/复位的可复验画面归档到对应版本；预期减少审查中途阻断与重复观看，代价是额外取证和存储，复核节点为本 Task 下一版 Art/Tech 正式 Review。
- 后续复核：待复核。

### WR-20261005-003｜单元示例1切图直接交用户审核

- Owner / 结果 / 证据路径 / 当前门禁：Master 与 Producer 按用户最新流程决定同步当前游戏与主模板规则，形成 `deliverables/art/UNIT-MENU-FOUR-LAYER-CUT-001/v0.3/USER_REVIEW_PACKET.md`；PSD/四 PNG 哈希复核一致，Task 到 `USER_REVIEW`。本轮没有 Gate2 用户批准。
- 起止时间、时区、总耗时与已知分段：本轮开始时间未可靠记录；2026-10-05 17:43（Asia/Shanghai）已开始文件级规则同步，17:45 形成当前审核包。上述节点不覆盖整个执行周期，总耗时及用户等待时间未知。
- 慢的判断依据：用户明确指出切图效果的专业复审和额外预览环境并非其所需交接方式；此前 v0.1 因动态预览证据进入返工，属于可证实的流程路径变化，不推断人员效率。
- 主要原因（观察与推断分开）：观察为旧规则把 Art/Tech/Master Review 设在用户审核之前，用户现要求亲自看具体结果；迁移时保留旧评审历史并核对源文件。未测量旧流程与新流程的平均耗时。
- 建议：Producer 在下一批自行切图 Task 建立时直接使用新门禁，并于首次 Gate2 用户审核后复核是否减少无效等待；负责人 Producer，风险是技术问题延至接入阶段，届时由 Tech/Client/QA 记录并返工。复核节点为本任务 Gate2 决定及后续 Creator 实测。
- 后续复核：待复核。

### WR-20261005-004｜示例1 Gate2 批准与 Web 接入技术稿送审

- Owner / 结果 / 证据路径 / 当前门禁：用户批准 `UNIT-MENU-FOUR-LAYER-CUT-001 v0.3` Gate2，Master 接受该切图任务；Tech Lead 提交 `UNIT-MENU-SCENE1-TECH-RUNTIME-001 v0.1`，5/5 Required、四项验收 PASS，Tech/Master Review APPROVED；Producer 核验后送 `USER_REVIEW`。证据：两任务的 `TASK.json`、`ARTIFACT_APPROVAL.json`，`deliverables/master/UNIT-MENU-FOUR-LAYER-CUT-001/v0.3/ACCEPTANCE.md` 和 `deliverables/tech_lead/UNIT-MENU-SCENE1-TECH-RUNTIME-001/v0.1/`。技术稿尚未获得用户批准，Creator/Web 实际运行与性能为 `NOT_TESTED`。
- 起止时间、时区、总耗时与已知分段：2026-10-05 17:56:22（Asia/Shanghai）记录 Gate2 用户决定；18:00 为用户 Web 范围决定及 Tech 开工的约时记录；18:09:20 开始本次 Producer 文件核验，18:10 记录 `USER_REVIEW` 节点。此前 Tech 实际编制及专业 Review 的精确起止时间、用户等待时间均未知，整个授权周期总耗时未知；不能把上述节点间隔视作制作耗时。
- 慢的判断依据：尚无同类接入技术稿时长基线；本轮未发现可证实的慢因。已观察到旧 Tech v0.2 的实体机硬门禁与用户最新 Web 模拟分辨率范围冲突，需要版本化技术增量和后续 Client/QA 开工包修订；这是范围澄清后的必要迁移，不归责人员。
- 主要原因（观察与推断分开）：观察为用户直接批准具体切图并明确分阶段 Web 测试，Tech v0.1 已逐项列出旧条款冲突和待审预算；无工具故障或返工耗时证据。推断为若下游继续引用旧实体机措辞可能重复阻塞；尚未发生下游开工，不能记为已造成延误。
- 建议：Producer 在 Client/QA 下一版开工包 Review 时逐项核对 `DEC-UNIT-MENU-WEB-TEST-005` 与 Tech v0.1 审批状态，预期避免错用实体机门禁；代价为一次短门禁核验，风险是技术稿若被用户退回须重核依赖；复核节点为 Client/QA 开工包提交。Tech Lead 在运行验收前给出可复验 Web 视口矩阵与数值预算供用户另审，预期减少 QA 临时补条件的返工；代价是需锁定浏览器/视口/采样口径，复核节点为 Web 预算 USER_REVIEW。
- 后续复核：WR-20261005-003 的直接交用户审核已达成 Gate2 用户决定；其是否减少平均等待仍证据不足。本文两项建议待复核。

### WR-20261005-005｜示例1技术稿 v0.1 退回与双目录 v0.2 送审

- Owner / 结果 / 证据路径 / 当前门禁：用户要求 `UNIT-MENU-SCENE1-TECH-RUNTIME-001 v0.1` 补美术交付/Cocos 正式资源双目录、用途描述和统一命名，旧版未获整版批准；Tech Lead 修订 v0.2，Art、Client、Tech、Master 同版 Review 均 `APPROVED`。Producer 核九项 Required、六项同序 PASS 和六个源文件 SHA-256 后送 `USER_REVIEW`。证据见 `tasks/UNIT-MENU-SCENE1-TECH-RUNTIME-001/ARTIFACT_APPROVAL_v0.1.json`、当前 `TASK.json`/`ARTIFACT_APPROVAL.json`、`deliverables/tech_lead/UNIT-MENU-SCENE1-TECH-RUNTIME-001/v0.2/`、`project/ASSET_HANDOFF_REGISTRY.md`。v0.2 尚待用户决定，工程导入与运行未测。
- 起止时间、时区、总耗时与已知分段：2026-10-05 18:21:25（Asia/Shanghai）为 v0.1 用户修订反馈的审批记录时间；18:35:15 Producer 本轮读取 Task/Review；18:37 登记 v0.2 送审节点。Tech 实际编制、Art/Client/Master Review 各自起止、用户等待与工具操作分段缺可靠时间，整个执行周期总耗时未知；不能将约 16 分钟节点间隔计为制作时长。
- 慢的判断依据：尚无同类双目录交接规格基线，无法断定本轮偏慢。可证实的返工范围是用户在 v0.1 审阅时新增明确的资源路径/命名要求；未见工具故障或专业 Review 反复退回记录。
- 主要原因（观察与推断分开）：观察为 v0.1 缺逐件美术交付与 Cocos 正式资源双目录说明，用户明确要求后才形成 v0.2 登记和命名稿；Creator 目标路径仍为计划、UUID 待生成。推断为未来若只维护单端目录可能再次产生资源版本错配，当前尚无实际错配证据。
- 建议：Client 在获批开工包下首次导入四张 PNG 与 Prefab 时按 `project/ASSET_HANDOFF_REGISTRY.md` 分项回填实际路径、源/目标 hash、`.meta`/子资源 UUID 和 Scene 引用；预期减少资源身份不清的返工，代价为一次逐件登记，复核节点为 Client 实施报告的 Tech/Art Review。Producer 在下一次资源交接审批前核登记中的“已存在/计划”状态和用户批准版本；预期阻止未导入路径被当成可消费资源，代价为门禁检查，复核节点为下一批正式资源入库。
- 后续复核：WR-20261005-004 对 Client/QA 开工包和 Web 预算的建议仍待相关版本提交；本文建议待复核。

### WR-20261005-006｜示例1 Client/QA 编码前开工包送审

- Owner / 结果 / 证据路径 / 当前门禁：Client 与 QA 分别提交 `UNIT-MENU-SCENE1-CLIENT-BRIEF-001 v0.1`、`UNIT-MENU-SCENE1-QA-PLAN-001 v0.1`；两 Task 均 7/7 Required、五项与 Task 逐字同序 `PASS`，各自三份同版 Review `APPROVED`，Producer 核后进入 `USER_REVIEW`。证据见两 Task 的 `TASK.json`、`ARTIFACT_APPROVAL.json` 和对应 `deliverables/client/`、`deliverables/qa/` v0.1 目录；本轮无用户对两包的批准，正式编码/导入仍锁定。
- 起止时间、时区、总耗时与已知分段：2026-10-05 18:48:35（Asia/Shanghai）记录上游 Tech v0.2 用户批准，18:51 QA 开始编制，18:53 Client 首稿和 QA 首文件落盘，19:06 QA 进入 `USER_REVIEW`，19:07 Client 进入 `USER_REVIEW`。上游批准到两包送审的记录节点相隔约 18 分 25 秒，包含并行编制、交叉 Review 和流程核验，不能当作任一角色制作耗时；各 Owner 实际作业、用户等待与 Review 分段缺精确时间，总制作耗时未知。
- 慢的判断依据：尚无同类双包编制基线，不断定整体偏慢。可证实的一次返工是 Client `DELIVERABLE.json` 原有五项 criterion 用概括语句，未与 Task 五项逐字一致，Producer 核出后由 Client 对齐；QA 曾有六项对五项不一致，也在本轮送审前修正。修正均未改变方案范围或证据结论。
- 主要原因（观察与推断分开）：观察为两个交付文件初稿对 Task 验收文字各有一次结构对齐缺口，且 QA 早期 `MASTER_REVIEW.json` 是自检内容，后由 Master 独立评审替换。没有精确耗时、工具故障或后续质量影响证据；推断为若在交付自检时直接引用 Task 原文，可减少送审前重复编辑。
- 建议：Client/QA Owner 在下一次提交 `DELIVERABLE.json` 前用 Task Packet 自动或人工逐字校验 criterion 数量、顺序与内容；预期减少门禁退回，代价为一次短核验，复核节点为下一批开工包 Producer Review。Master 在写 `MASTER_REVIEW.json` 前核 reviewer 身份与独立结论，预期避免自检文件误入正式门禁，代价为一次文件检查，复核节点为下一份 Master Review。
- 后续复核：WR-20261005-004 对 Client/QA 开工包版本化与范围核验的建议在本轮执行；是否减少等待仍证据不足。WR-20261005-005 的导入 UUID 回填建议待 Client 获批实施后复核。

### WR-20261005-007｜示例1双开工包批准与 Client 实施启动

- Owner / 结果 / 证据路径 / 当前门禁：用户明确“批准继续”Client Brief 与 QA Plan v0.1；Producer 登记两份 `ARTIFACT_APPROVAL.json`，Master 分别最终接受，两 Task `DONE`。新 `UNIT-MENU-SCENE1-CLIENT-IMPLEMENT-001 v0.1` 五依赖均 USER_APPROVED/DONE，Client 已实际复制四张 Gate2 PNG 至批准目标路径且四目标 SHA-256 与登记表相同，Task 进入 `IN_PROGRESS`。证据见三 Task Packet、两份 `deliverables/master/.../v0.1/MASTER_ACCEPTANCE.md`、`project/ASSET_HANDOFF_REGISTRY.md` 与四目标 PNG。本轮只解锁实现，Web 矩阵/预算与 QA 正式运行仍待审批。
- 起止时间、时区、耗时：用户回复的精确时间未知；Producer 于 2026-10-05 19:19:20（Asia/Shanghai）登记批准，19:22:11 核两份 Master 接受与新 Task READY，Client Owner 记录 19:24 已有四 PNG 实产，Producer 于 19:26:12 核实。批准登记至首项实产节点相隔约 4 分 40 秒，包含任务包/接受核验及 Owner 工作，不能解释为 Client 制作时长；实际导入、专业 Review、用户等待和本实施 Task 总耗时均未知。
- 慢的判断依据与原因：没有同类 Creator 接入基线，也没有本轮可证实的阻塞或返工，暂不判定慢。可观察到登记表正确区分真实美术源与计划 Creator 路径，首批复制哈希一次一致；真实 `.meta`/UUID 尚待 Editor 生成，不能从图片复制推断导入完成。
- 建议与复核：Client Owner 在 Creator 实际导入后逐件回填 `.meta`、主/子 UUID、设置、目标 hash 与 Scene 引用；预期减少资产身份错配，代价为逐项登记，复核点为实施包 Art/Tech Review。Producer 在实施包送 `USER_REVIEW` 前核实这些值来自真实 Editor 文件和项目登记，并逐项区分 `PASS`/`NOT_TESTED`；预期避免计划态冒充验收，代价为一次身份链检查，复核点为本实施 Task 门禁。
- 后续复核：WR-20261005-006 的验收原文逐字检查已用于两包结案核验；是否减少返工尚无后续样本。WR-20261005-005 的 UUID 回填建议在本 Task 实施后复核。
