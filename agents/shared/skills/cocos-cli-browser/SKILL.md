---
name: cocos-cli-browser
description: Develop and validate Cocos projects through version-compatible scripts and Creator CLI, then inspect actual Web output in the Codex in-app browser. Use for Cocos source, Scene/Prefab, asset-reference, build, functional or visual checks; keep required Editor and target-platform checks when CLI/Web cannot cover them.
---

# Cocos CLI 与内置浏览器

为Cocos开发、资源接入和验证优先采用“受控脚本/API → 静态核验 → Creator导入/CLI构建 → 本地HTTP实际产物 → Codex内置浏览器运行”的路线。遵守当前项目的版本、Task范围、资源批准与QA门禁；操作偏好不授予额外权限或降低验收标准。

## 选择可行能力

先读取项目版本、正式输入、工作区差异与已有工具。区分Creator内置构建CLI、Editor扩展API和独立cocos-cli：不将构建命令想象成Scene编辑命令，不把另一个版本/工具链默认为兼容。用当前已有工具，具体路径、权限、端口和成功试验记录放项目内，不写成跨机器默认。

场景/Prefab/资源引用修改时读 [场景与资源](references/scene-and-assets.md)。导入、构建、服务和运行验证时读 [构建与浏览器](references/build-and-browser.md)。操作本身需Editor或CLI确有阻塞时可使用Editor并说明原因；目标设备/小游戏SDK/原生/平台性能仍按已批计划执行，Web不能替代。

## 执行与结果

1. 保护已有差异，记录原文件/hash与可恢复副本，确认所依赖资源版本已批。
2. 用可审查脚本或可用引擎API处理源码/Scene/Prefab。保留稳定UUID、`.meta`、已批图像字节；移除对象时完整重映射嵌套对象索引和关系。静态核验后由Creator导入与构建，再检查真实运行；缺少必需证据保持NOT_TESTED/BLOCKED。
3. 对旧资源证明专属归属、解除活动引用，并核对相关导入/构建/运行后清理；历史审批资料不作为运行垃圾删除。
4. 优先用Codex内置浏览器打开HTTP实际产物。先读当前浏览器工具文档和可用能力；有语义定位用DOM，否则以最新截图确定Canvas输入坐标，再观察结果。只读evaluate不改变游戏状态；截图和控制台证据关联构建身份及Task。
5. 分别报告静态、导入、构建、运行、视觉/性能结果。工具可用、静态通过或界面可打开均不等于功能/正式QA已通过。

## 恢复与共享

构建核实结束日志与当前输出，不凭父进程返回或旧目录判PASS；仅针对明确失败作一次恢复，再失败则换有依据的诊断方法或记BLOCKED。浏览器/CLI权限拒绝遵循正规授权，不换端口、外部浏览器或其他控制入口绕过。服务默认loopback、跟踪自己启动的进程，结束后清理临时服务/标签，交付或后续仍需的资源标明归属。

Studio中此skill的维护源为 `agents/shared/skills/cocos-cli-browser/`；相关角色的SKILLS索引指向同一源，不分别复制成多套方法。可同步相同版本到Codex可发现的个人skill目录；安装不意味着当前会话目录已自动重新载入，当前角色可直接读取仓库入口。机器和具体游戏证据留在对应Game Repository。
