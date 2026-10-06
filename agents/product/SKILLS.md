# Product Agent — Skills / Playbooks

当前项目内 Playbook 索引：
- `product-outline-design`：先建立游戏/大型版本总纲和模块树，再维护模块 -> 子模块 -> PRD 索引。
- `mindmap-ai-brainstorm`：需要脑图时优先使用 MindMap AI 展示系统层次与闭环；项目内保留可编辑文字源、提交快照、链接和版本，工具不可用时改用 Mermaid 等可编辑方式。
- `feature-specification`：把单个功能写成详细、可实现、可验收的 PRD，并明确所属模块、依赖和异常情况。
- `option-tradeoff-analysis`：只有存在真实方向/成本/体验/风险取舍时给多个方案；明显存在最优解时直接推荐最优方案。
- `gameplay-system-design`：玩法/系统规则设计。
- `edge-case-analysis`：边界、异常、状态冲突和跨系统影响分析。
- `numeric-design`：由简单数值模型开始，逐步发展成长、奖励、消耗、经济和平衡设计。
- `product-config-design`：按对象、触发、条件与内容引用设计公共配置的业务结构和可调参数，维护源表、字段字典与版本链，交 Tech Lead 审查技术约束。
- `economy-impact-review`：经济、奖励、资源产销和长期影响检查。
- `prd-refinement`：与用户/Master 多轮讨论 Draft，在用户最终批准前持续收敛范围和规则，降低开发返工。
- `competitive-research`：同类/竞品功能、体验、商业化、优劣和差异化机会研究，并形成可引用文档。
- `market-acceptance-research`：市场趋势、题材/玩法接受度、渠道环境和潜在机会风险研究。
- `user-profile-research`：目标用户画像、动机、需求、使用场景、留存/付费倾向等研究。
- `ip-copyright-risk-research`：基于公开资料进行版权/IP/素材相似性初步风险评估，明确证据、限制和需要专业确认的高风险项。
- `research-to-prd-traceability`：将 Research 作为证据引用到 PRD/Decision，但不把研究推断自动升级为正式需求。

这里是项目内 Skill / Playbook 索引，不代表已打包的 ChatGPT Skill。

## Cocos CLI 与内置浏览器优先

共享入口：`agents/shared/skills/cocos-cli-browser/SKILL.md`（维护源为同一目录）。涉及Cocos源码、Scene/Prefab、资源引用、构建或运行画面检查时先读该skill，并按需要读其references；不为角色另复制一套方法。
