# 脑图优先使用 MindMap 插件

- ID：CAP-20261012-MINDMAP-PLUGIN；规则记录版本：v0.1。
- 日期：2026-10-12（Asia/Shanghai）。
- 授权来源：USER_EXPLICIT；用户原文“脑图优先使用MindMap插件”。本记录只确认工具偏好，不批准具体脑图或游戏功能。
- Owner：Master；本轮为既有偏好的低风险文档维护，自检不冒充独立 Product / Producer Review。
- 变更：MindMap 插件作为脑图生成与交互展示的首选，覆盖 2026-09-29 MindMap AI 的工具优先顺序；旧提案、评审及项目 Artifact 保留历史。
- 能力依据：本轮已发现连接工具 `mcp__codex_apps__mindmap_interactive_mind_map_for_visual_plans`；工具接受一个根标题与每层两个空格缩进的 Markdown 嵌套列表。本轮不包含具体脑图制作，未调用生成，不把工具发现写成生成成功。
- 归档：同版保存 Markdown 源、静态快照与版本；记录插件实际返回的链接，未返回时登记工具名称与生成结果，不能虚构 URL。正式 Review、用户审批和下游输入门禁不变。
- 回退：插件本轮不可用时记录实际原因，再使用 Mermaid 等可编辑方式；其他工具或旧版失败记录不能直接作为当前插件的回退依据。
- 同步范围：当前游戏与主模板的 `AGENTS.md`、`rules/artifact_contract.md`、`agents/product/SKILLS.md`、`agents/product/DECISIONS.md`、`agents/product/PRODUCT_OUTLINE_TEMPLATE.md`、`governance/CAPABILITY_REGISTRY.yaml` 及本记录/JSON；主模板 `templates/game/project/PRD.md` 默认项。其他既有游戏保持 pinned。
- 验证：核对上述 Studio 文件在两仓库内容一致、当前有效入口使用 MindMap 插件、JSON 符合 capability_change Schema，并检查本次差异。具体脑图的生成与展示留待下一次脑图任务验证。
- 回退办法：只回退本次工具偏好文字和索引，保留已有源、快照、版本与审批历史。
