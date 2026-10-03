# Tech Lead 对视觉设计继承与生产交接提案的评审

日期：2026-10-03。结论：**支持提案方向，建议补入下列技术与 QA 边界后交 Master 汇总、用户审批**。本文件是只读评审；不修改角色配置、`rules/artifact_contract.md`、项目预算、既有审批或主 Studio 仓库。评审对象：[Art 跨角色提案](CP-ART-VISUAL-INHERITANCE-20261003.md)及当前游戏仓库 `agents/tech_lead/`、`agents/client/`、`agents/qa/`、`rules/artifact_contract.md`。

## 事实与现行规则的缺口

空景/幽灵 v0.1 的贴图尺寸、alpha、图集、循环帧和静态哈希可检查，但桥的可行走体量、远近景和水/石材明暗、幽灵侧向剪影、走跑幅度及无靠背矮凳与此前向用户展示的视觉方向不一致。旧资源被退回；详见 `project/changes/CP-UNIT-MENU-VISUAL-FIDELITY-001.md`。序列帧、4–6 帧、可编辑分层、图集和复用都不必然要求这次的平面化或近正面形体。技术评审曾将主要视觉差距视作轻微，说明“资源结构有效”与“视觉设计继承有效”没有被分开记录和阻断。

现行 `rules/artifact_contract.md` 已要求 Art Direction、概念/正式区分、UI/VFX 对 Art 的视觉 Review、Client 的实现报告、QA 视觉证据；`agents/qa/` 已要求自动差异不能替代专业判断，缺性能预算和证据不能判通过。这些基础应保留。缺口在于：Tech Lead 的生产预检和成品 Review 未明确禁止以性能/图集/复用假设改视觉；Client 的接入交付未明确资产 UUID/hash、实际镜头图和未经批准的程序性外观改动；跨角色 Contract 未列视觉 PASS 与生产 PASS 为各自独立门禁。不要把已存在的规则重新写成另一套平行流程。

## 建议补入的通用条文

### 1. Tech Lead：视觉目标与生产预算分立

可由 Master 组织评审后写入 `agents/tech_lead/ROLE.md`、`CONSTRAINTS.md` 及 `rules/artifact_contract.md` 的等价条文：

> Tech Lead 为视觉资产提供画布、像素密度、分层、图集、动画格式、内存、合批、平台限制及接入约束，并在每次图片产出前与 Art 对同一源版本和明确批次签认。技术估算是约束和风险证据，不自动授权改变已采纳的构图、轮廓、体积、材质、受光、动作可辨性或对象身份。正式源输出后分别记录 Art 的视觉符合度结论和 Tech 的生产有效性结论；任一必要项未通过，资源不得称为可交付正式成品。

> 报告区分估算、静态实图检查、Creator 导入和目标设备实测。`同源`、`同 atlas`、`单页` 均不能直接推出一次 DrawCall；PNG 文件体积不能代替纹理驻留和加载峰值。没有批准设备/阈值或未运行的指标写 `NOT_TESTED/BLOCKED`，不得给数值 `PASS`。

出图前联签与成品双结论是两个时间点：样张首次生成也要先签文字预案；样张完成后 Art 按已批准视觉锚点实图审查，再由 Tech 以实际 alpha bbox、页数/贴图面积/投影像素草排；全量资源尺寸、帧数或图集改变，按新批次重新联签。这样既允许先做代表样张，也不以尚未存在的像素数据要求虚假“实测预签”。

### 2. Client：按版本接入、展示真实镜头，不静默改外观

建议写入 `agents/client/ROLE.md`、`CONSTRAINTS.md` 和交付物要求：

> Client 只把符合当前门禁的视觉版本接入正式菜单/场景；记录正式源、导出资源、Prefab 的 ID、版本、hash/UUID、依赖及导入日志。Lab/调试入口可用明确标记的候选资源试验，但不能将占位/旧退稿伪装成正式同源资产。接入后提交按批准视窗、DPR、镜头和状态的截图/录屏，核翻转、支点、前后遮挡、材质/色彩、UI/VFX 叠层及缩放；程序中的 tint、滤镜、缩放、裁切、混合或重排若改变已批准视觉锚点，须送 Art 复审，并由 Tech 评估代价。

Client 对节点、DrawCall、Overdraw、纹理加载/释放和帧时间作测量支持；是否达到性能阈值由已批准的项目预算与 QA 阶段决定。编译成功、Web Mock 或编辑器预览只能证明相应范围，不等同于目标机接入及性能通过。

### 3. QA：视觉和性能分项报告，保持阶段边界

建议在 `agents/qa/` 与 `rules/artifact_contract.md` 的现有 Visual QA/性能条款中补交接字段，不改变两阶段 QA 协议：

> QA 从用户批准的 Art/UI/VFX Artifact 与逐项视觉锚点建立用例，在固定视窗、DPR、镜头位置、状态/动作下保存截图、关键帧或短录屏；自动像素差异仅用于定位，重大观感由 Art 专业 Review 判定。`TEST_REPORT` 分列功能、视觉、性能结果及各自 `PASS/FAIL/NOT_TESTED`，不得用运行流畅掩盖视觉失配，也不得用静态美术通过代替性能和接入验证。

按现行 `rules/qa_protocol.md`，`FUNCTIONAL` 默认固定 Web/测试环境并验证适用性能；`RELEASE` 对明确候选构建、声明平台和真机执行平台性能与适用专项。若某游戏 Task 特别要求单元阶段目标机核验，该项须在获批开工包中明确环境、设备和阈值；未执行前保留 `NOT_TESTED`，不能把它暗中提前为所有游戏 FUNCTIONAL 的通用要求。重大视觉偏差的 P1 建议仍属 `agents/qa/CONSTRAINTS.md` 中**待用户确认**的严重度边界，本提案不可预先宣布已批准。

### 4. 预算冲突的升级与决定

当实际贴图、图集、帧数、DrawCall、帧时间或内存与预算冲突：

1. Tech Lead 与 Client 记录同一真实资源和运行环境的数值、测量方法、瓶颈与目标预算；Art 记录每个优化候选对视觉锚点的可见影响；QA 记录未测或失败项。
2. 先提出能保持视觉目标的技术方案，如裁透明边、合理分层与生命周期、材质/批次排序、合法纹理压缩、限制同屏数量或经 Art 验证的材质变体；逐案列预计/实测收益、画质风险和维护成本。不得把“压缩图集”默认为删动作、改剪影、降低材质层次。
3. 若所有可行方案仍会更改已批准视觉、动作、目标设备或性能阈值，Tech/Art 将量化取舍交 Master，Master 组织 Product、Client、QA 等受影响角色和用户完成 Change Proposal/审批；Producer 锁定版本与门禁。任何角色都不能单方降规格，也不能以缺设备改填 N/A 或 PASS。

## 对 Art 提案的两点修订请求

1. 在交接表里写清“代表样张首次出图前 Art/Tech 联签 → Art 实图视觉 PASS → Tech 实图面积/图集/性能方案 Review → 全量再联签”，以免“先样张、后 Tech 评估”被误读为样张无需技术出图前签认。
2. 将“目标机检验”拆为项目 Task 明确要求的单元取证与 `RELEASE` 阶段必需真机取证；遵守当前 `rules/qa_protocol.md`，不将所有游戏 FUNCTIONAL 一律升级到真机，也不把 Web 或静态预览写成设备 PASS。

## 治理与适用边界

本建议属 `CROSS_AGENT_CONTRACT` 候选，涉及 Art、Tech Lead、Client、QA、Master/Producer。由 Master 按 `schemas/capability_change.schema.json` 汇总受影响角色意见并取得用户审批，获批后按 `AGENTS.md` 第 11 节执行当前游戏与主 Studio Layer 及适用模板的同步。具体 Cocos 3.8.8、720×1280、桥、幽灵、23 帧和项目目标机/阈值只留在当前 Game Repository，不写入通用角色标准。此评审本身不授权恢复已退回资源的生产或接入。
