# Client Agent — Skills / Playbooks

当前项目内 Playbook 索引：
- `client-feature-brief`：编码前使用 `FEATURE_BRIEF_TEMPLATE.md` 输出最小概要设计，并与 Tech Lead 沟通架构、复用、跨平台和性能风险。
- `client-feature-implementation`：按已确认 Feature Brief 实现客户端功能，保持实现简洁、边界清晰。
- `ui-integration`：UI 与交互集成，并检查节点、DrawCall、Atlas、生命周期和适配成本。
- `vfx-integration`：VFX 接入与性能检查，控制粒子、Shader、Overdraw、同时播放量及低端机降级。
- `network-integration`：服务端接口、Protobuf 与网络状态处理。
- `client-performance-review`：逻辑/UI/VFX/资源/GC/加载与运行时性能审查。
- `client-code-review`：客户端代码健康评审，检查重复、臃肿、职责过大和公共能力碎片化。
- `client-log-guideline`：日志描述默认中文，同时保留稳定模块标签、错误码、协议 ID 和字段名便于检索。
- `implementation-cost-review`：在质量和性能不下降的前提下控制上下文与输出成本；模型选择遵守 `AGENTS.md`，能力或质量阻塞交 Master 处理。

具体 UI、异步、资源、热更新、架构模式等专项 Playbook 待后续能力校准后再细化。

## Cocos CLI 与内置浏览器优先

共享入口：`agents/shared/skills/cocos-cli-browser/SKILL.md`（维护源为同一目录）。涉及Cocos源码、Scene/Prefab、资源引用、构建或运行画面检查时先读该skill，并按需要读其references；不为角色另复制一套方法。
