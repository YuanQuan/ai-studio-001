# CP-VISUAL-OUTCOME-PRIORITY-20261008｜视觉效果优先与必要时重绘

状态：`APPLIED`（当前游戏与主模板文件已本地应用；主模板 commit/push 已有下述证据，当前游戏 commit/push 待核）。Master 已接受通用规则变更，Tech 与 Client 治理 Review 均 `APPROVED`，无职责冲突或新增门禁。对应同名 JSON 符合 `schemas/capability_change.schema.json`。当前游戏的 Tech、Client 证据分别为 `deliverables/tech_lead/U03-SHOP-VISUAL-FIDELITY-003/v0.1/GOVERNANCE_TECH_REVIEW.json` 与 `deliverables/client/U03-SHOP-SIGN-CLIENT-REPLACE-001/v0.3/GOVERNANCE_CLIENT_REVIEW.json`，仅存本游戏 Project Layer，不进入通用模板。

## 授权与问题

2026-10-08 用户明确要求“美术角度效果第一，修图最终效果不好可以选择重绘，要达到效果图与真实效果一致”。U03 对照 `mixed_signs_v04` 的当前视觉异议说明，旧规则的“除非用户明确要求重画，只能沿用 PSD 局部修订”可能让方法约束压过视觉目标。此授权改变通用 Art 工作方式；具体 U03 v0.2 的 Gate1/Gate2 批准和历史文件仍保留，不自动视为新 v0.3 获批。

## 建议适用规则

Art 先核局部修订能否达到已确认效果；不能达到时可选择重绘，记录同背景、同视窗、同显示尺度的差距、方法理由、范围、来源和旧版保留方式。新旧稿逐锚点比较，正式接入后以实际运行画面再对照，静态总览不替代运行结论。重绘不能改变已批准产品语义或视觉目标；来源/字体权利核查、可编辑 PSD、正式图片制作方案 Gate1、首图前 Art/Tech 同批预签、具体切片 Gate2 用户决定以及接入后的运行验证继续适用。自行切图的 Gate2 仍直接交用户审核，不增加专业成品复审或额外预览环境门禁。

## 影响与同步边界

- 当前游戏 Studio Layer：`AGENTS.md`、`rules/visual_production_contract.md`、`agents/art/ROLE.md`、`agents/art/CONSTRAINTS.md`、`agents/art/DECISIONS.md`；能力注册表仍以 `agents/art/` 为事实源，现有 `calibrated` 状态不需改变。
- Master 已组织受影响角色评审通用交接措辞；Tech 与 Client Review 均通过，Art 已按新版授权预案同批预签。跨角色规则由 Master 接受，未新增审批门禁；适用 QA 仍在正式功能阶段遵守原验证职责。
- 依 `governance/REPOSITORY_SYNC_POLICY.md` §4.1，Master 已在 parent 工作区应用并提交五份 Studio 文件、`templates/game/STUDIO.md`、`templates/game/project/ART_GUIDE.md` 和两份去项目化提案。主模板 commit `9ee34fa80c9c96a1999849175242ef077b78741d`，Master 报告普通 push 成功；Producer 只读核本地 HEAD 与 `origin/main` 同 SHA、九个提交路径均为通用文件。当前游戏五份同名文件 SHA 与主模板一致，两个模板默认项无 U03 等项目内容。当前游戏 `.studio-lock.json` 保留原全量基线，因为仅定向同步五文件；当前游戏 commit/push 尚未核，详见 `project/changes/STUDIO_SYNC_REVIEW_VISUAL_20261008.md`。
- 不把 U03 的具体游戏图、PSD、切片、审批或任务状态带入模板；其他已存在游戏仍保持 pinned。

## 验证与复核

当前项目的规则文本只更新现有 Gate 内的方法选择与视觉验收依据。Master 复核受影响角色与模板默认项；Producer 核当前游戏/主模板差异及同步结果。U03 新修订由 Master 另建 Task，实际美术代表样张、同背景同尺度比较与后续运行画面作为可检查的执行证据；仅改规则文本不是本轮视觉任务完成。
