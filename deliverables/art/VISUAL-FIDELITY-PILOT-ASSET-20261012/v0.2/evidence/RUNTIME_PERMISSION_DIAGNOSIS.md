# 本批 Creator 执行权限诊断

只读核查时刻：2026-10-12 20:58:15 +08:00。未启动 Creator，未改变系统权限、安装包、源码或旧技术报告。

## 可复核依据

- 本批 `build/build-attempts.json` 仅记录两次默认执行环境下的失败：直接 Creator 3.8.8 CLI 在 `RegisterApplication` / `NSApplication` 初始化阶段以 134、`SIGABRT` 退出；随后唯一 `open -a` 恢复以 `kLSNoExecutableErr` 拒绝启动。两次均未进入构建、没有本批输出。记录中没有 `sandbox_permissions=require_escalated` 尝试。
- 同机同项目的 `deliverables/client/U04-DIALOGUE-CLIENT-001/v0.4/evidence/BUILD_ATTEMPTS.json` 记录了相同版本 Creator 的默认沙箱 CLI 134 / `RegisterApplication` 崩溃和 LaunchServices 拒绝，随后以**已授权升级执行环境**运行同一路径的官方 Creator CLI。其 `CREATOR_BUILD_CLI_CAPTURE.log` 实有 2026-10-11 13:19:56 +08:00 的 `build Task (web-mobile) Finished in (5 s)ms`；尝试表记录退出码 36。日志中也有子构建脚本 `SIGTERM` 诊断，故不能单凭退出码推定无误；历史任务另有其自身产物身份检查，不能移用作本批产物。
- 当前安装路径仍为 `/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator`，文件存在且有执行位；本次 SHA-256 为 `3a8452496c03e85f2784e64679a1fd203701b0b245125efee02c7923f2bd3464`。历史日志核实相同路径与版本，但未记录当时二进制哈希，不能声称两个时点字节一致。
- 共享 `agents/shared/skills/cocos-cli-browser/references/build-and-browser.md` 明确：执行环境确需沙箱升级时走正式审批机制，不修改系统 ACL / 安全设置；Creator 3.8 的 36 仅是成功证据之一，必须核当前日志、输出时间/内容和入口依赖。
- 本诊断完成前，Master 报告其经正规升级权限只读 `pgrep` 发现现存主 Creator 进程 PID `68057`，命令行 `--project` 指向同一 `apps/client`，并有 GPU/Renderer helper。这是新的当前环境依据；我在默认沙箱自行 `ps/pgrep` 获系统拒绝，未独立复核进程状态。Master 正只读核其 Editor UI，不应再启动另一 CLI 争用同项目资产数据库。若现存健康 Editor 能使用本批配置构建，可优先由该进程完成，不计作第三次启动恢复；实际 UI 能力及构建结果仍待核。

## 判定与边界

同类症状及同机历史成功为**一次**沿用官方 CLI、以 `sandbox_permissions=require_escalated` 申请正式执行权限的本批构建提供合理依据；但当前已有同项目 Creator 进程，据共享规则不得并行启动 CLI 争用资产数据库。应先由 Master 核现存 Editor 的实际项目、UI 与本批配置可用性，再决定是否能直接用它完成构建；仅在它不可用且确认不再占用项目时，才考虑上述一次正式权限 CLI。该处理不是第二个图像候选、修正轮次重置、换引擎或制作预算重置；本批累计修正仍为 2/2，源图、mask、曲线及当前源码身份须保持。此诊断不授权自动启动：由 Master 最终决定，真实自动审批须通过；若拒绝或构建仍失败，立即停止，不再 `open`、换引擎、改 ACL 或连续重试。

获准且实际执行后，仍须以本批当前配置、文件 SHA、完整 Creator 任务日志、当前输出目录及其内容核验，不能借历史 `web-mobile` 产物或仅凭退出码宣称通过。现在本批运行仍为 `BLOCKED`；Creator 导入、Effect 编译、实际 UV/颜色/alpha、动画、Draw Call、纹理内存、CPU/GPU、HTTP 与浏览器均为 `NOT_TESTED`。本记录不新增用户门禁，也不代替 `TECH_RUNTIME_REVIEW.md` 的运行核对。
