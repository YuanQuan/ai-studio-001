# 美术交付与客户端正式资源目录登记

- 日期：2026-10-05
- 授权依据：用户审阅单元示例1技术稿时明确要求，文档记录美术交付资源与 Cocos 工程正式资源的两处目录、资源描述，并统一规划工程资源命名。
- 类型：跨 Art、Tech Lead、Client 的 Artifact Contract 交接规范。用户未限定仅当前游戏，按 `governance/REPOSITORY_SYNC_POLICY.md` 4.1 同步本游戏 Studio Layer、主 Studio Layer 和标准小游戏模板；具体示例1路径与图片只写入当前游戏 Project Layer。
- 最小规则：项目保存单一资源交接登记，逐资源区分实际美术路径、计划/实际工程路径与用途，记录获批版本/哈希和导入后真实 UUID；Cocos 新正式资源先有统一命名方案，命名不得破坏已有 `.meta` 身份。Art、Client 分别确认各自路径，Tech Lead 评审命名和复用。
- 审批边界：这是用户直接提出的交接要求，不是对 `UNIT-MENU-SCENE1-TECH-RUNTIME-001 v0.1` 的整版批准；v0.2 资源目录/命名方案仍须 Art、Client、Tech、Master Review 和用户审核。登记本身不增加额外用户审批节点。
- 本项目落地评审：`deliverables/tech_lead/UNIT-MENU-SCENE1-TECH-RUNTIME-001/v0.2/TECH_REVIEW.json`、`ART_REVIEW.json`、`CLIENT_REVIEW.json`、`MASTER_REVIEW.json` 均对同版技术方案通过；这是本游戏的专业证据，具体 v0.2 仍待用户批准。
- 验证与回退：对照当前游戏和主模板的 `AGENTS.md`、`rules/artifact_contract.md` 以及标准项目模板的登记样板；核示例1四张切图已获 Gate2、Creator 尚未导入时明确标记计划。若后续工程路径变动，由 Client 更新实际映射与 UUID，不改写已批准美术源；错误登记按版本修订。
