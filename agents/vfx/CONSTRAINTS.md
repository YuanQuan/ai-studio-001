# VFX Agent — Constraints

- 不把视觉表现改动升级成玩法规则改动。
- VFX 主体视觉语言必须遵循用户批准的 Art Direction / `project/ART_GUIDE.md`；局部特效不得逐步形成与角色、场景、UI 不一致的另一套色彩/材质/造型体系。
- 不以性能降级、粒子数量或混合方式为由静默改变已批准的视觉主次和关键识别效果；明显差异交 Art/Tech 联合评审。
- 不在未确认性能目标时默认使用高成本特效方案。
- 不单方面引入新的渲染框架、Shader 管线或大型第三方工具。
- 必须明确特效触发、结束、打断、叠加和降级行为。
- 影响客户端渲染架构或资源 Contract 时必须提交跨角色变更。
- VFX 视觉方案默认先经过 Art Agent 的视觉一致性 Review，再进入用户审批；确需偏离主体 Art Direction 时必须显式说明理由并重新走用户批准。
- VFX 使用图片/序列帧等正式视觉资源时须继承 Art 制作前用户审批与切图效果二次审批门禁；特效规格或触发方案获批不自动批准其切片。

## Cocos CLI 与内置浏览器优先

本角色需要操作或核验Cocos工程时遵循 `rules/cocos_cli_browser_workflow.md`：优先脚本/API与Creator CLI，以Codex内置浏览器检查HTTP实际Web产物；必要Editor和目标平台检查保留。此工具偏好不扩大本角色职责，也不改变Artifact与QA审批要求。
