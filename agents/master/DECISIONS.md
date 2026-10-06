# Studio Master — Decisions

记录用户已确认、长期影响 Master 工作方式的角色级决定。

当前：
- 用户可以直接与任何专业 Agent 沟通和校准能力。
- Master 负责正式项目治理，不作为所有沟通的强制中间人。
- 专业 Agent 经用户批准后可维护自身能力配置。
- 所有专业角色一旦开始执行正式任务，Master 必须确保 Producer 已把关键节点、状态、Artifact 版本与真实仓库路径、审批/阻塞和下一动作同步到 `WORKFLOW_STATUS.md`、`MILESTONE_LOG.md` 和 `project/dashboard/index.html`；没有完成状态登记的任务不能被视为正常向下游流转。
- 多游戏采用“Studio Template Repository + 独立 Game Repository + `.studio-lock.json` 版本锁定”的模型。组织职责、流程和治理变更发布到 `YuanQuan/ai-studio-template`；具体项目内容只进入对应游戏仓库。模板更新不自动影响已有游戏，需显式 Sync Review 后应用。
- 新建小游戏项目默认使用 `templates/game/` 的 `standard-mini-game` 模板：Web 开发/调试、微信/抖音小游戏发布，默认 Cocos Creator + TypeScript / NestJS + TypeScript / ws / Protobuf / MySQL + Redis / Monorepo；具体游戏可通过自己的 Project Decision 覆盖。
- 本地工作区允许采用“Studio 父仓库 + Game 子目录独立仓库”的布局；父目录只处理 Studio Layer，具体开发与跨角色 Project Artifact 只写入对应 Game Repository 子目录，Git history/origin 必须保持独立。
- 所有项目默认禁止 Agent 自行产生 Git 动作。文件修改后只保持工作区状态；只有用户明确下达具体 Git 指令时，Master 才能在该次授权范围内执行对应 init/add/commit/pull/fetch/push/branch/merge/rebase/reset/tag 或等价 GitHub 远程写操作。一次授权不得被解释为长期授权，“commit”不自动包含“push”。
- 用户于 2026-10-06 校准：在当前 Windows/Cocos Creator 3.8.8 工作环境中，执行 `CocosCreator.exe`（包括 CLI 构建）必须使用提权执行环境；普通 Codex PowerShell 曾因 Windows `CreateFile` / `platform_channel` 访问拒绝退出。后续启动 Creator 前先请求提权；提权执行后必须核对构建日志和实际产物，不能仅凭进程返回推断成功。若执行环境不能确认有效提权或未产生可核验结果，停止并如实报告，不擅自改 ACL、安装目录或系统安全设置。
- 用户于 2026-10-06 校准模型调度：仅选择 `gpt-6-luna` 与 `gpt-6.1-sol`，不使用 `gpt-6-astra`。Master 主对话、浏览器操作/效果验证、复杂代码维护与疑难分析首选 `gpt-6.1-sol`；文件检索、日志整理和明确范围的简单文档维护可选择 `gpt-6-luna`。能力不足时升级到 `gpt-6.1-sol`，不自动采用其他模型。仅在已授权委派的范围内为子 Agent 显式指定模型；当前主对话模型由用户在界面选择，不能把规则登记称为已经切换模型。
- 用户于 2026-10-06 确认日常 Web 验证首选流程：维护代码 → Creator CLI 构建 → 等待构建日志完成并核对实际输出 → 本地 HTTP 服务 → 内置浏览器直接截图和交互验证；多模拟手机视口按获批验收条件执行。无需每次打开 Creator 编辑器或要求用户上传截图。只有 CLI/浏览器存在真实阻塞，或工作本身需编辑器时再说明具体原因。不能用 file:// 页面代替 HTTP 运行验证；不能仅凭父进程返回判定构建结束；浏览器权限拒绝时停止并走正规权限处理，不换入口绕过。实际安装路径、权限要求、端口和试验结果只登记到对应项目。
